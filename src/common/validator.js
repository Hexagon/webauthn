import {
	isBase64Url,
	abEqual,
	isPem
} from "./utils.js";


function validateCreateRequest() {
	let req = this.request;

	if (typeof req !== "object") {
		throw new TypeError("expected request to be Object, got " + typeof req);
	}

	if (!(req.rawId instanceof ArrayBuffer) &&
		!(req.id instanceof ArrayBuffer)) {
		throw new TypeError("expected 'id' or 'rawId' field of request to be ArrayBuffer, got rawId " + typeof req.rawId + " and id " + typeof req.id);
	}

	if (typeof req.response !== "object") {
		throw new TypeError("expected 'response' field of request to be Object, got " + typeof req.response);
	}

	if (typeof req.response.attestationObject !== "string" &&
		!(req.response.attestationObject instanceof ArrayBuffer)) {
		throw new TypeError("expected 'response.attestationObject' to be base64 String or ArrayBuffer");
	}

	if (typeof req.response.clientDataJSON !== "string" &&
		!(req.response.clientDataJSON instanceof ArrayBuffer)) {
		throw new TypeError("expected 'response.clientDataJSON' to be base64 String or ArrayBuffer");
	}

	this.audit.validRequest = true;

	return true;
}

function validateAssertionResponse() {
	let req = this.request;

	if (typeof req !== "object") {
		throw new TypeError("expected request to be Object, got " + typeof req);
	}

	if (!(req.rawId instanceof ArrayBuffer) &&
		!(req.id instanceof ArrayBuffer)) {
		throw new TypeError("expected 'id' or 'rawId' field of request to be ArrayBuffer, got rawId " + typeof req.rawId + " and id " + typeof req.id);
	}

	if (typeof req.response !== "object") {
		throw new TypeError("expected 'response' field of request to be Object, got " + typeof req.response);
	}

	if (typeof req.response.clientDataJSON !== "string" &&
		!(req.response.clientDataJSON instanceof ArrayBuffer)) {
		throw new TypeError("expected 'response.clientDataJSON' to be base64 String or ArrayBuffer");
	}

	if (typeof req.response.authenticatorData !== "string" &&
		!(req.response.authenticatorData instanceof ArrayBuffer)) {
		throw new TypeError("expected 'response.authenticatorData' to be base64 String or ArrayBuffer");
	}

	if (typeof req.response.signature !== "string" &&
		!(req.response.signature instanceof ArrayBuffer)) {
		throw new TypeError("expected 'response.signature' to be base64 String or ArrayBuffer");
	}

	if (typeof req.response.userHandle !== "string" &&
		!(req.response.userHandle instanceof ArrayBuffer) &&
		req.response.userHandle !== undefined) {
		throw new TypeError("expected 'response.userHandle' to be base64 String, ArrayBuffer, or undefined");
	}

	this.audit.validRequest = true;

	return true;
}

async function validateRawClientDataJson() {
	// XXX: this isn't very useful, since this has already been parsed...
	let rawClientDataJson = this.clientData.get("rawClientDataJson");

	if (!(rawClientDataJson instanceof ArrayBuffer)) {
		throw new Error("clientData clientDataJson should be ArrayBuffer");
	}

	this.audit.journal.add("rawClientDataJson");

	return true;
}

async function validateTransports() {
	let transports = this.authnrData.get("transports");

	if (transports != null && !Array.isArray(transports)) {
		throw new Error("expected transports to be 'null' or 'array<string>'");
	}

	for (const index in transports) {
		if (typeof transports[index] !== "string") {
			throw new Error("expected transports[" + index + "] to be 'string'");
		}
	}

	this.audit.journal.add("transports");

	return true;
}

async function validateId() {
	let rawId = this.clientData.get("rawId");

	if (!(rawId instanceof ArrayBuffer)) {
		throw new Error("expected id to be of type ArrayBuffer");
	}

	let credId = this.authnrData.get("credId");
	if (credId !== undefined && !abEqual(rawId, credId)) {
		throw new Error("id and credId were not the same");
	}
	
	let allowCredentials = this.expectations.get("allowCredentials");

	if (allowCredentials != undefined) {
		if (!allowCredentials.some(cred => {
			let result = abEqual(rawId, cred.id);
			return result;
		}
		)) {
			throw new Error("Credential ID does not match any value in allowCredentials");
		}
	}

	this.audit.journal.add("rawId");

	return true;
}

async function validateCreateType() {
	let type = this.clientData.get("type");

	if (type !== "webauthn.create") {
		throw new Error("clientData type should be 'webauthn.create', got: " + type);
	}

	this.audit.journal.add("type");

	return true;
}

async function validateGetType() {
	let type = this.clientData.get("type");

	if (type !== "webauthn.get") {
		throw new Error("clientData type should be 'webauthn.get'");
	}

	this.audit.journal.add("type");

	return true;
}

async function validateChallenge() {
	let expectedChallenge = this.expectations.get("challenge");
	let challenge = this.clientData.get("challenge");

	if (typeof challenge !== "string") {
		throw new Error("clientData challenge was not a string");
	}

	if (!isBase64Url(challenge)) {
		throw new TypeError("clientData challenge was not properly encoded base64url");
	}

	challenge = challenge.replace(/={1,2}$/, "");

	// console.log("challenge", challenge);
	// console.log("expectedChallenge", expectedChallenge);
	if (challenge !== expectedChallenge) {
		throw new Error("clientData challenge mismatch");
	}

	this.audit.journal.add("challenge");

	return true;
}

async function validateTokenBinding() {
	// TODO: node.js can't support token binding right now :(
	let tokenBinding = this.clientData.get("tokenBinding");

	if (typeof tokenBinding === "object") {
		if (tokenBinding.status !== "not-supported" &&
			tokenBinding.status !== "supported") {
			throw new Error("tokenBinding status should be 'not-supported' or 'supported', got: " + tokenBinding.status);
		}

		if (Object.keys(tokenBinding).length != 1) {
			throw new Error("tokenBinding had too many keys");
		}
	} else if (tokenBinding !== undefined) {
		throw new Error("Token binding field malformed: " + tokenBinding);
	}

	// TODO: add audit.info for token binding status so that it can be used for policies, risk, etc.
	this.audit.journal.add("tokenBinding");

	return true;
}

async function validateRawAuthnrData() {
	// XXX: this isn't very useful, since this has already been parsed...
	let rawAuthnrData = this.authnrData.get("rawAuthnrData");
	if (!(rawAuthnrData instanceof ArrayBuffer)) {
		throw new Error("authnrData rawAuthnrData should be ArrayBuffer");
	}

	this.audit.journal.add("rawAuthnrData");

	return true;
}

async function validateFlags() {
	let expectedFlags = this.expectations.get("flags");
	let flags = this.authnrData.get("flags");

	for (let expFlag of expectedFlags) {
		if (expFlag === "UP-or-UV") {
			if (flags.has("UV")) {
				if (flags.has("UP")) {
					continue;
				} else {
					throw new Error("expected User Presence (UP) flag to be set if User Verification (UV) is set");
				}
			} else if (flags.has("UP")) {
				continue;
			} else {
				throw new Error("expected User Presence (UP) or User Verification (UV) flag to be set and neither was");
			}
		}

		if (expFlag === "UV") {
			if (flags.has("UV")) {
				if (flags.has("UP")) {
					continue;
				} else {
					throw new Error("expected User Presence (UP) flag to be set if User Verification (UV) is set");
				}
			} else {
				throw new Error(`expected flag was not set: ${expFlag}`);
			}
		}

		if (!flags.has(expFlag)) {
			throw new Error(`expected flag was not set: ${expFlag}`);
		}
	}

	this.audit.journal.add("flags");

	return true;
}

async function validateInitialCounter() {
	let counter = this.authnrData.get("counter");

	// TODO: does counter need to be zero initially? probably not... I guess..
	if (typeof counter !== "number") {
		throw new Error("authnrData counter wasn't a number");
	}

	this.audit.journal.add("counter");

	return true;
}

async function validateAaguid() {
	let aaguid = this.authnrData.get("aaguid");

	if (!(aaguid instanceof ArrayBuffer)) {
		throw new Error("authnrData AAGUID is not ArrayBuffer");
	}

	if (aaguid.byteLength !== 16) {
		throw new Error("authnrData AAGUID was wrong length");
	}

	this.audit.journal.add("aaguid");

	return true;
}

async function validateCredId() {
	let credId = this.authnrData.get("credId");
	let credIdLen = this.authnrData.get("credIdLen");

	if (!(credId instanceof ArrayBuffer)) {
		throw new Error("authnrData credId should be ArrayBuffer");
	}

	if (typeof credIdLen !== "number") {
		throw new Error("authnrData credIdLen should be number, got " + typeof credIdLen);
	}

	if (credId.byteLength !== credIdLen) {
		throw new Error("authnrData credId was wrong length");
	}

	this.audit.journal.add("credId");
	this.audit.journal.add("credIdLen");

	return true;
}

async function validatePublicKey() {
	// XXX: the parser has already turned this into PEM at this point
	// if something were malformatted or wrong, we probably would have
	// thrown an error well before this.
	// Maybe we parse the ASN.1 and make sure attributes are correct?
	// Doesn't seem very worthwhile...

	let cbor = this.authnrData.get("credentialPublicKeyCose");
	let jwk = this.authnrData.get("credentialPublicKeyJwk");
	let pem = this.authnrData.get("credentialPublicKeyPem");

	// cbor
	if (!(cbor instanceof ArrayBuffer)) {
		throw new Error("authnrData credentialPublicKeyCose isn't of type ArrayBuffer");
	}
	this.audit.journal.add("credentialPublicKeyCose");

	// jwk
	if (typeof jwk !== "object") {
		throw new Error("authnrData credentialPublicKeyJwk isn't of type Object");
	}

	if (typeof jwk.kty !== "string") {
		throw new Error("authnrData credentialPublicKeyJwk.kty isn't of type String");
	}

	if (typeof jwk.alg !== "string") {
		throw new Error("authnrData credentialPublicKeyJwk.alg isn't of type String");
	}

	switch (jwk.kty) {
	case "EC":
		if (typeof jwk.crv !== "string") {
			throw new Error("authnrData credentialPublicKeyJwk.crv isn't of type String");
		}
		break;
	case "RSA":
		if (typeof jwk.n !== "string") {
			throw new Error("authnrData credentialPublicKeyJwk.n isn't of type String");
		}

		if (typeof jwk.e !== "string") {
			throw new Error("authnrData credentialPublicKeyJwk.e isn't of type String");
		}
		break;
	default:
		throw new Error("authnrData unknown JWK key type: " + jwk.kty);
	}

	this.audit.journal.add("credentialPublicKeyJwk");

	// pem
	if (typeof pem !== "string") {
		throw new Error("authnrData credentialPublicKeyPem isn't of type String");
	}

	if (!isPem(pem)) {
		throw new Error("authnrData credentialPublicKeyPem was malformatted");
	}
	this.audit.journal.add("credentialPublicKeyPem");

	return true;
}

async function validateCounter() {
	let prevCounter = this.expectations.get("prevCounter");
	let counter = this.authnrData.get("counter");
	let counterSupported = !(counter === 0 && prevCounter === 0);

	if (counter <= prevCounter && counterSupported) {
		throw new Error("counter rollback detected");
	}

	this.audit.journal.add("counter");
	this.audit.info.set("counter-supported", "" + counterSupported);

	return true;
}

async function validateAudit() {
	let journal = this.audit.journal;
	let clientData = this.clientData;
	let authnrData = this.authnrData;

	for (let kv of clientData) {
		let val = kv[0];
		if (!journal.has(val)) {
			throw new Error(`internal audit failed: ${val} was not validated`);
		}
	}

	for (let kv of authnrData) {
		let val = kv[0];
		if (!journal.has(val)) {
			throw new Error(`internal audit failed: ${val} was not validated`);
		}
	}

	if (journal.size !== (clientData.size + authnrData.size)) {
		throw new Error(`internal audit failed: ${journal.size} fields checked; expected ${clientData.size + authnrData.size}`);
	}

	if (!this.audit.validExpectations) {
		throw new Error("internal audit failed: expectations not validated");
	}

	if (!this.audit.validRequest) {
		throw new Error("internal audit failed: request not validated");
	}

	this.audit.complete = true;

	return true;
}

export {
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
};