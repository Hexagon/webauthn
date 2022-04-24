// External dependencies
import { URL } from "https://deno.land/std@0.134.0/node/url.ts";
import { parse as tldtsParse } from "https://cdn.jsdelivr.net/npm/tldts@5.7.75/dist/index.esm.min.js";
import punycode from "https://deno.land/x/punycode@v2.1.1/punycode.js";

import {
  decodeProtectedHeader,
  exportSPKI,
  importJWK,
  importSPKI,
  jwtVerify,
} from "https://deno.land/x/jose@v4.6.0/index.ts";

import * as pkijs from "https://unpkg.com/pkijs@2.1.58?module";

import { fromBER } from "https://unpkg.com/asn1js@2.0.18?module";
import * as cbor from "https://unpkg.com/cbor-x?module";

import { Certificate } from "./common/certUtils.js";
import { Key } from "./common/keyUtils.js";

// Store reference to used webcrypto (in case an alternative will be used)
const webcrypto = crypto;

pkijs.setEngine(
  "newEngine",
  webcrypto,
  new pkijs.CryptoEngine({
    name: "",
    crypto: webcrypto,
    subtle: webcrypto.subtle,
  }),
);

/*
    Convert signature from DER to raw
    Expects Uint8Array
*/
function derToRaw(signature) {
  const rStart = signature[4] === 0 ? 5 : 4,
    rEnd = rStart + 32,
    sStart = signature[rEnd + 2] === 0 ? rEnd + 3 : rEnd + 2;
  return new Uint8Array([
    ...signature.slice(rStart, rEnd),
    ...signature.slice(sStart),
  ]);
}

function checkOrigin(str) {
  let originUrl = new URL(str);
  let origin = originUrl.origin;

  if (origin !== str) {
    throw new Error("origin was malformatted");
  }

  let isLocalhost = (originUrl.hostname == "localhost" ||
    originUrl.hostname.endsWith(".localhost"));

  if (originUrl.protocol !== "https:" && !isLocalhost) {
    throw new Error("origin should be https");
  }

  if (
    (!validDomainName(originUrl.hostname) ||
      !validEtldPlusOne(originUrl.hostname)) && !isLocalhost
  ) {
    throw new Error("origin is not a valid eTLD+1");
  }

  return origin;
}

function checkUrl(value, name, rules = {}) {
  if (!name) {
    throw new TypeError("name not specified in checkUrl");
  }

  if (typeof value !== "string") {
    throw new Error(`${name} must be a string`);
  }

  let urlValue = null;
  try {
    urlValue = new URL(value);
  } catch (err) {
    throw new Error(`${name} is not a valid eTLD+1/url`);
  }

  if (!value.startsWith("http")) {
    throw new Error(`${name} must be http protocol`);
  }

  if (!rules.allowHttp && urlValue.protocol !== "https:") {
    throw new Error(`${name} should be https`);
  }

  // origin: base url without path including /
  if (!rules.allowPath && (value.endsWith("/") || urlValue.pathname !== "/")) { // urlValue adds / in path always
    throw new Error(`${name} should not include path in url`);
  }

  if (!rules.allowHash && urlValue.hash) {
    throw new Error(`${name} should not include hash in url`);
  }

  if (!rules.allowCred && (urlValue.username || urlValue.password)) {
    throw new Error(`${name} should not include credentials in url`);
  }

  if (!rules.allowQuery && urlValue.search) {
    throw new Error(`${name} should not include query string in url`);
  }

  return value;
}

function validEtldPlusOne(value) {
  // Parse domain name
  const result = tldtsParse(value, { allowPrivateDomains: true });

  // Require valid public suffix
  if (result.publicSuffix === null) {
    return false;
  }

  // Require valid hostname
  if (result.domainWithoutSuffix === null) {
    return false;
  }

  return true;
}

function validDomainName(value) {
  // Before we can validate we need to take care of IDNs with unicode chars.
  let ascii = punycode.toASCII(value);

  if (ascii.length < 1) {
    // return 'DOMAIN_TOO_SHORT';
    return false;
  }
  if (ascii.length > 255) {
    // return 'DOMAIN_TOO_LONG';
    return false;
  }

  // Check each part's length and allowed chars.
  let labels = ascii.split(".");
  let label;

  for (let i = 0; i < labels.length; ++i) {
    label = labels[i];
    if (!label.length) {
      // LABEL_TOO_SHORT
      return false;
    }
    if (label.length > 63) {
      // LABEL_TOO_LONG
      return false;
    }
    if (label.charAt(0) === "-") {
      // LABEL_STARTS_WITH_DASH
      return false;
    }
    /*if (label.charAt(label.length - 1) === '-') {
			// LABEL_ENDS_WITH_DASH
			return false;
		}*/
    if (!/^[a-z0-9-]+$/.test(label)) {
      // LABEL_INVALID_CHARS
      return false;
    }
  }

  return true;
}

function checkDomainOrUrl(value, name, rules = {}) {
  if (!name) {
    throw new TypeError("name not specified in checkDomainOrUrl");
  }

  if (typeof value !== "string") {
    throw new Error(`${name} must be a string`);
  }

  if (validEtldPlusOne(value, name) && validDomainName(value, name)) {
    return value; // if valid domain no need for futher checks
  }

  return checkUrl(value, name, rules);
}

function checkRpId(rpId) {
  if (typeof rpId !== "string") {
    throw new Error("rpId must be a string");
  }

  let isLocalhost = (rpId === "localhost" || rpId.endsWith(".localhost"));

  if (isLocalhost) return rpId;

  return checkDomainOrUrl(rpId, "rpId");
}

async function verifySignature(
  publicKeyPem,
  expectedSignature,
  data,
  hashName,
) {
  try {
    const publicKey = new Key();
    const importedKey = await publicKey.fromPem(publicKeyPem);

    let uSignature = new Uint8Array(expectedSignature);

    // Copy algorithm and default hash
    let alg = importedKey.algorithm;
    if (!alg.hash) {
      alg.hash = { name: hashName || "SHA-256" };
    }

    // Convert signature
    if (alg.name === "ECDSA") {
      uSignature = await derToRaw(uSignature);
    }

    return await crypto.subtle.verify(
      alg,
      publicKey.getKey(),
      new Uint8Array(uSignature),
      new Uint8Array(data),
    );
  } catch (_e) {
    console.error(_e);
    return;
  }
}

async function hashDigest(o, alg) {
  if (typeof o === "string") {
    o = new TextEncoder().encode(o);
  }
  let result = await crypto.subtle.digest(alg || "sha-256", o);
  return result;
}

function randomValues(n) {
  let byteArray = new Uint8Array(n);
  crypto.getRandomValues(byteArray);
  return byteArray;
}

function getHostname(urlIn) {
  return new URL(urlIn).hostname;
}

async function getEmbeddedJwk(jwsHeader, alg) {
  let publicKey;

  // Use JWK from header
  if (jwsHeader.jwk) {
    publicKey = jwsHeader.jwk;

    // Extract JWK from first x509 certificate in header
  } else if (jwsHeader.x5c) {
    const x5c0 = jwsHeader.x5c[0];
    const cert = new Certificate(x5c0);
    publicKey = await cert.getPublicKey();

    // Use common name as kid if missing
    publicKey.kid = publicKey.kid || cert.getCommonName();
  }

  if (!publicKey) {
    throw new Error("getEmbeddedJwk: JWK not found in JWS.");
  }

  // Use alg from header if not present
  publicKey.alg = publicKey.alg || jwsHeader.alg;

  return publicKey;
}

export {
  cbor,
  checkDomainOrUrl,
  checkOrigin,
  checkRpId,
  checkUrl,
  decodeProtectedHeader,
  exportSPKI,
  fromBER,
  getEmbeddedJwk,
  getHostname,
  hashDigest,
  importJWK,
  importSPKI,
  jwtVerify,
  pkijs,
  randomValues,
  verifySignature,
  webcrypto,
};
