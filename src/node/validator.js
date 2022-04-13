/* eslint-disable no-invalid-this */
// validators are a mixin, so it's okay that we're using 'this' all over the place
import {
	validateCreateRequest,
	// clientData validators
	validateRawClientDataJson,
	validateId,
	validateCreateType,
	validateGetType,
	validateChallenge,
	validateTokenBinding,
	validateTransports,
	// authnrData validators		
	validateRawAuthnrData,
	validateAaguid,
	validateCredId,
	validatePublicKey,
	validateFlags,
	validateCounter,
	validateInitialCounter,
	validateAssertionResponse,
	validateAudit,
} from "../common/validator.js";

import {
	hashDigest,
	checkOrigin,
	isBase64Url,
	isPositiveInteger,
	isPem,
	verifySignature,
	appendBuffer,
	checkRpId,
	coerceToArrayBuffer,
	coerceToBase64Url
} from "./utils.js";

import { Webauthn } from "./webauthn.js";

import { URL } from "url";

async function validateRpIdHash() {
	let rpIdHash = this.authnrData.get("rpIdHash");

	if (rpIdHash instanceof Buffer) {
		rpIdHash = new Uint8Array(rpIdHash).buffer;
	}

	if (!(rpIdHash instanceof ArrayBuffer)) {
		throw new Error("couldn't coerce clientData rpIdHash to ArrayBuffer");
	}

	let domain = this.expectations.has("rpId")
		? this.expectations.get("rpId")
		: new URL(this.expectations.get("origin")).hostname;
	let createdHash = new Uint8Array(await hashDigest(domain)).buffer;

	// wouldn't it be weird if two SHA256 hashes were different lengths...?
	if (rpIdHash.byteLength !== createdHash.byteLength) {
		throw new Error("authnrData rpIdHash length mismatch");
	}

	rpIdHash = new Uint8Array(rpIdHash);
	createdHash = new Uint8Array(createdHash);
	for (let i = 0; i < rpIdHash.byteLength; i++) {
		if (rpIdHash[i] !== createdHash[i]) {
			throw new TypeError("authnrData rpIdHash mismatch");
		}
	}

	this.audit.journal.add("rpIdHash");

	return true;
}

async function validateAttestation() {
	return Webauthn.validateAttestation.call(this);
}

async function validateExpectations() {
	/* eslint complexity: ["off"] */
	let req = this.requiredExpectations;
	let opt = this.optionalExpectations;
	let exp = this.expectations;

	if (!(exp instanceof Map)) {
		throw new Error("expectations should be of type Map");
	}

	if (Array.isArray(req)) {
		req = new Set([req]);
	}

	if (!(req instanceof Set)) {
		throw new Error("requiredExpectaions should be of type Set");
	}

	if (Array.isArray(opt)) {
		opt = new Set([opt]);
	}

	if (!(opt instanceof Set)) {
		throw new Error("optionalExpectations should be of type Set");
	}

	for (let field of req) {
		if (!exp.has(field)) {
			throw new Error(`expectation did not contain value for '${field}'`);
		}
	}

	let optCount = 0;
	for (const [field] of exp) {
		if (opt.has(field)) {
			optCount++;
		}
	}

	if (req.size !== exp.size - optCount) {
		throw new Error(`wrong number of expectations: should have ${req.size} but got ${exp.size - optCount}`);
	}

	// origin - isValid
	if (req.has("origin")) {
		let expectedOrigin = exp.get("origin");

		checkOrigin(expectedOrigin);
	}

	// rpId - optional, isValid
	if (exp.has("rpId")) {
		let expectedRpId = exp.get("rpId");

		checkRpId(expectedRpId);
	}

	// challenge - is valid base64url string
	if (exp.has("challenge")) {
		let challenge = exp.get("challenge");
		if (typeof challenge !== "string") {
			throw new Error("expected challenge should be of type String, got: " + typeof challenge);
		}

		if (!isBase64Url(challenge)) {
			throw new Error("expected challenge should be properly encoded base64url String");
		}
	}

	// flags - is Array or Set
	if (req.has("flags")) {
		let validFlags = new Set(["UP", "UV", "UP-or-UV", "AT", "ED"]);
		let flags = exp.get("flags");

		for (let flag of flags) {
			if (!validFlags.has(flag)) {
				throw new Error(`expected flag unknown: ${flag}`);
			}
		}
	}

	// prevCounter
	if (req.has("prevCounter")) {
		let prevCounter = exp.get("prevCounter");

		if (!isPositiveInteger(prevCounter)) {
			throw new Error("expected counter to be positive integer");
		}
	}

	// publicKey
	if (req.has("publicKey")) {
		let publicKey = exp.get("publicKey");
		if (!isPem(publicKey)) {
			throw new Error("expected publicKey to be in PEM format");
		}
	}

	// userHandle
	if (req.has("userHandle")) {
		let userHandle = exp.get("userHandle");
		if (userHandle !== null &&
			typeof userHandle !== "string") {
			throw new Error("expected userHandle to be null or string");
		}
	}


	// allowCredentials
	if (exp.has("allowCredentials")) {
		let allowCredentials = exp.get("allowCredentials");
		if (allowCredentials != null) {
			if (!Array.isArray(allowCredentials)) {
				throw new Error("expected allowCredentials to be null or array");
			} else {
				for (const index in allowCredentials) {
					if (typeof allowCredentials[index].id === "string") {
						allowCredentials[index].id = coerceToArrayBuffer(allowCredentials[index].id, "allowCredentials[" + index + "].id");
					}
					if (allowCredentials[index].id == null || !(allowCredentials[index].id instanceof ArrayBuffer)) {
						throw new Error("expected id of allowCredentials[" + index + "] to be ArrayBuffer");
					}
					if (allowCredentials[index].type == null || allowCredentials[index].type !== "public-key") {
						throw new Error("expected type of allowCredentials[" + index + "] to be string with value 'public-key'");
					}
					if (allowCredentials[index].transports != null && !Array.isArray(allowCredentials[index].transports)) {
						throw new Error("expected transports of allowCredentials[" + index + "] to be array or null");
					} else if (allowCredentials[index].transports != null && !allowCredentials[index].transports.every(el => ["usb", "nfc", "ble", "internal"].includes(el))) {
						throw new Error("expected transports of allowCredentials[" + index + "] to be string with value 'usb', 'nfc', 'ble', 'internal' or null");
					}
				}
			}
		}

	}

	this.audit.validExpectations = true;

	return true;
}

async function validateUserHandle() {
	let userHandle = this.authnrData.get("userHandle");

	if (userHandle === undefined ||
		userHandle === null ||
		userHandle === "") {
		this.audit.journal.add("userHandle");
		return true;
	}

	userHandle = coerceToBase64Url(userHandle, "userHandle");
	let expUserHandle = this.expectations.get("userHandle");
	if (typeof userHandle === "string" &&
		userHandle === expUserHandle) {
		this.audit.journal.add("userHandle");
		return true;
	}

	throw new Error("unable to validate userHandle");
}

async function validateAssertionSignature() {
	let expectedSignature = this.authnrData.get("sig");
	let publicKey = this.expectations.get("publicKey");
	let rawAuthnrData = this.authnrData.get("rawAuthnrData");
	let rawClientData = this.clientData.get("rawClientDataJson");

	let clientDataHashBuf = await hashDigest(rawClientData);
	let clientDataHash = new Uint8Array(clientDataHashBuf).buffer;

	let res = await verifySignature(publicKey, expectedSignature, appendBuffer(rawAuthnrData,clientDataHash));
	if (!res) {
		throw new Error("signature validation failed");
	}

	this.audit.journal.add("sig");

	return true;
}

async function validateOrigin() {
	let expectedOrigin = this.expectations.get("origin");
	let clientDataOrigin = this.clientData.get("origin");

	let origin = checkOrigin(clientDataOrigin);

	if (origin !== expectedOrigin) {
		throw new Error("clientData origin did not match expected origin");
	}

	this.audit.journal.add("origin");

	return true;
}

function attach(o) {
	let mixins = {
		validateExpectations,
		validateCreateRequest,
		// clientData validators
		validateRawClientDataJson,
		validateOrigin,
		validateId,
		validateCreateType,
		validateGetType,
		validateChallenge,
		validateTokenBinding,
		validateTransports,
		// authnrData validators		
		validateRawAuthnrData,
		validateAttestation,
		validateAssertionSignature,
		validateRpIdHash,
		validateAaguid,
		validateCredId,
		validatePublicKey,
		validateFlags,
		validateUserHandle,
		validateCounter,
		validateInitialCounter,
		validateAssertionResponse,
		// audit structures
		audit: {
			validExpectations: false,
			validRequest: false,
			complete: false,
			journal: new Set(),
			warning: new Map(),
			info: new Map(),
		},
		validateAudit,
	};

	for (let key of Object.keys(mixins)) {
		o[key] = mixins[key];
	}
}

export { attach };