import * as crypto from "crypto";
import { URL } from "url";
import jwkToPem from "jwk-to-pem"; // CommonJS
import { getPublicSuffix } from "tldts";
import { fromBER } from "asn1js";
import * as pkijs from "pkijs";

function checkOrigin(str) {

	let originUrl = new URL(str);
	let origin = originUrl.origin;

	if (origin !== str) {
		throw new Error("origin was malformatted");
	}

	let isLocalhost = (originUrl.hostname == "localhost" || originUrl.hostname.endsWith(".localhost"));

	if (originUrl.protocol !== "https:" && !isLocalhost) {
		throw new Error("origin should be https");
	}

	if (getPublicSuffix(originUrl.hostname) === null && !isLocalhost) {
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

function checkDomainOrUrl(value, name, rules = {}) {
	if (!name) {
		throw new TypeError("name not specified in checkDomainOrUrl");
	}

	if (typeof value !== "string") {
		throw new Error(`${name} must be a string`);
	}

	if (getPublicSuffix(value) !== null) return value; // if valid domain no need for futher checks

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

function verifySignature(publicKey, expectedSignature, data) {
	const verify = crypto.createVerify("SHA256");
	verify.write(new Uint8Array(data));
	verify.end();
	return verify.verify(publicKey, new Uint8Array(expectedSignature));
}

async function hashDigest(o) {
	if (typeof o === "string") {
		o = new TextEncoder().encode(o);
	}
	let hash = crypto.createHash("sha256");
	hash.update(new Uint8Array(o));
	return new Uint8Array(hash.digest());
}

function randomValues(n) {
	return crypto.randomBytes(n);
}

function getHostname(urlIn) {
	return new URL(urlIn).hostname;
}

const envUnified = (typeof window !== "undefined") ? window.env : process.env;

let webcrypto;
if(envUnified.FIDO2LIB_USENATIVECRYPTO) {
	// Opt-in to use native crypto, as it depends on the environment and is difficult to test
	// NodeJS crypto API is currently in experimental state
	console.warn("[FIDO2-LIB] Native crypto is enabled");
	if ((typeof self !== "undefined") && "crypto" in self) {
		webcrypto = self.crypto;
	} else {
		webcrypto = await import("crypto").webcrypto;
	}
} else {
	const { Crypto } = await import("@peculiar/webcrypto");
	webcrypto = new Crypto();
}

const ToolBox = {
	checkOrigin,
	checkRpId,
	checkDomainOrUrl,
	checkUrl,
	verifySignature,
	jwkToPem,
	hashDigest,
	randomValues,
	getHostname,
	webcrypto,
	fromBER,
	pkijs
};

const ToolBoxRegistration = {
	registerAsGlobal: () => {
		global.webauthnToolBox = ToolBox;
	}
};

export { ToolBoxRegistration, ToolBox };