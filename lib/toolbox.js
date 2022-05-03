// Store reference to used webcrypto (in case an alternative will be used)
import { webauthnCrypto } from "./crypto.js";
const webcrypto = webauthnCrypto;

// External dependencies
import { URL } from "url";
import { parse as tldtsParse } from "tldts";
import punycode from "punycode";
import { decodeProtectedHeader, exportSPKI, importJWK, importSPKI, jwtVerify } from "jose";
import {
  Certificate as PkijsCertificate,
  CertificateChainValidationEngine,
  CertificateRevocationList,
  CryptoEngine,
  PublicKeyInfo,
  setEngine,
} from "pkijs";
import { fromBER } from "asn1js";
import { decode, encode } from "cbor-x";
const cbor = { encode, decode };
import { base64 } from "@hexagon/base64";

// Internal dependencies
import { Certificate } from "./certUtils.js";
import { Key } from "./keyUtils.js";

// Set up pkijs
const pkijs = {
  setEngine,
  CryptoEngine,
  Certificate: PkijsCertificate,
  CertificateRevocationList,
  CertificateChainValidationEngine,
  PublicKeyInfo,
};
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
  const rStart = signature[4] === 0 ? 5 : 4;
  const rEnd = rStart + 32;
  const sStart = signature[rEnd + 2] === 0 ? rEnd + 3 : rEnd + 2;
  return new Uint8Array([
    ...signature.slice(rStart, rEnd),
    ...signature.slice(sStart),
  ]);
}

function checkOrigin(str) {
  const originUrl = new URL(str);
  const origin = originUrl.origin;

  if (origin !== str) {
    throw new Error("origin was malformatted");
  }

  const isLocalhost = (originUrl.hostname == "localhost" ||
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
  } catch (_err) {
    throw new Error(`${name} is not a valid eTLD+1/url`);
  }

  if (!value.startsWith("http")) {
    throw new Error(`${name} must be http protocol`);
  }

  if (!rules.allowHttp && urlValue.protocol !== "https:") {
    throw new Error(`${name} should be https`);
  }

  // origin: base url without path including /
  if (
    !rules.allowPath && (value.endsWith("/") || urlValue.pathname !== "/")
  ) { // urlValue adds / in path always
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
  const ascii = punycode.toASCII(value);

  if (ascii.length < 1) {
    // return 'DOMAIN_TOO_SHORT';
    return false;
  }
  if (ascii.length > 255) {
    // return 'DOMAIN_TOO_LONG';
    return false;
  }

  // Check each part's length and allowed chars.
  const labels = ascii.split(".");
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
    /* if (label.charAt(label.length - 1) === '-') {
			// LABEL_ENDS_WITH_DASH
			return false;
		} */
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

  const isLocalhost = (rpId === "localhost" || rpId.endsWith(".localhost"));

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
    const alg = importedKey.algorithm;
    if (!alg.hash || hashName) {
      alg.hash = { name: hashName || "SHA-256" };
    }

    // Convert signature
    if (alg.name === "ECDSA") {
      uSignature = await derToRaw(uSignature);
    }

    return await webcrypto.subtle.verify(
      alg,
      publicKey.getKey(),
      new Uint8Array(uSignature),
      new Uint8Array(data),
    );
  } catch (_e) {
    console.error(_e);
  }
}

async function hashDigest(o, alg) {
  if (typeof o === "string") {
    o = new TextEncoder().encode(o);
  }
  const result = await webcrypto.subtle.digest(alg || "sha-256", o);
  return result;
}

function randomValues(n) {
  const byteArray = new Uint8Array(n);
  webcrypto.getRandomValues(byteArray);
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

  // Use alg from header if not present, use passed alg as default
  publicKey.alg = publicKey.alg || jwsHeader.alg || alg;

  return publicKey;
}

export {
  base64,
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
