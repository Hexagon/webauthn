import {
	ab2str,
	abToBuf,
	isBase64Url,
	abEqual,
	isPem,
	pemToBase64,
	isPositiveInteger,
	appendBuffer,
	hashDigest,
	randomValues,
	identify,
	coerceToArrayBuffer,
	coerceToBase64,
	coerceToBase64Url,
	base64
} from "../common/utils.js";

import { webcrypto, subtleCrypto } from "../common/crypto.js";

import { jwkToPem } from "./tools/jwk-to-pem.js";

import { URL } from "./deps.js";

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

	/* ToDo: Reenable PSL
	if (!psl.isValid(originUrl.hostname) && !isLocalhost) {
		throw new Error("origin is not a valid eTLD+1");
	}*/

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

	// ToDo: Reenable PSL if (psl.isValid(value)) return value; // if valid domain no need for futher checks

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

async function importRsaKey(pem) {
	// fetch the part of the PEM string between header and footer
	const pemContents = pemToBase64(pem);
	// base64 decode the string to get the binary data
	const binaryDerString = base64.toArrayBuffer(pemContents);
	// convert from a binary string to an ArrayBuffer
	const result = await subtleCrypto.importKey(
		"spki",
		binaryDerString,
		{
			name: "RSASSA-PKCS1-v1_5",
			hash: "SHA-256"
		},
		false,
		["verify"]
	);

	return result;
}


async function verifySignature(publicKey, expectedSignature, data) {
	const importedKey = await importRsaKey(publicKey);
	const result = await subtleCrypto.verify("RSASSA-PKCS1-v1_5", importedKey, expectedSignature, data);
	return result;
}

export {
	coerceToBase64Url,
	coerceToBase64,
	checkRpId,
	ab2str,
	coerceToArrayBuffer,
	abToBuf,
	randomValues,
	isBase64Url,
	checkOrigin,
	abEqual,
	isPem,
	isPositiveInteger,
	hashDigest,
	verifySignature,
	appendBuffer,
	identify,
	base64,
	jwkToPem
};
