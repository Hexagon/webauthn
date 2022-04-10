import { test } from "uvu";
import * as assert from "uvu/assert";
import { Fido2AttestationResult, Fido2AssertionResult } from "../../../src/node/response.js";
import * as h from "../../helpers/fido2-helpers.js";

/*const before = () => {

	const testReq = klon(h.lib.makeCredentialAttestationNoneResponse);
	testReq.response.clientDataJSON = h.lib.makeCredentialAttestationNoneResponse.response.clientDataJSON.slice(0);
	testReq.response.attestationObject = h.lib.makeCredentialAttestationNoneResponse.response.attestationObject.slice(0);

	return testReq;

};*/

// Actual tests
const testResponse = function () {

	test("Fido2AttestationResult is function", function() {
		assert.equal(typeof Fido2AttestationResult, "function");
	});

	test("Fido2AttestationResult throws if called with new", function() {
		assert.throws(() => {
			new Fido2AttestationResult();
		}, Error, "Do not create with 'new' operator. Call 'Fido2AttestationResult.create()' or 'Fido2AssertionResult.create()' instead.");
	});

	test("Fido2AttestationResult passes with 'none' attestation", async function() {
		await Fido2AttestationResult.create(h.lib.makeCredentialAttestationNoneResponse, {
			origin: "https://localhost:8443",
			challenge: "33EHav-jZ1v9qwH783aU-j0ARx6r5o-YHh-wd7C6jPbd7Wh6ytbIZosIIACehwf9-s6hXhySHO-HHUjEwZS29w",
			flags: ["UP", "AT"],
		});
	});

	test("Fido2AssertionResult is function", function() {
		assert.equal(typeof Fido2AssertionResult, "function");
	});

	test("Fido2AssertionResult throws if called with new", function() {
		assert.throws(() => {
			new Fido2AssertionResult();
		}, Error, "Do not create with 'new' operator. Call 'Fido2AttestationResult.create()' or 'Fido2AssertionResult.create()' instead.");
	});

	test("Fido2AssertionResult returns Fido2AssertionResult object on success", async function() {
		let ret = await Fido2AssertionResult.create(h.lib.assertionResponse, {
			origin: "https://localhost:8443",
			challenge: "eaTyUNnyPDDdK8SNEgTEUvz1Q8dylkjjTimYd5X7QAo-F8_Z1lsJi3BilUpFZHkICNDWY8r9ivnTgW7-XZC3qQ",
			flags: ["UP"],
			prevCounter: 362,
			publicKey: h.lib.assnPublicKey,
			userHandle: null,
		});
		assert.ok(ret instanceof Fido2AssertionResult);
	});

	test("Fido2AssertionResult works with WindowsHello", async function() {
		let ret = await Fido2AssertionResult.create(h.lib.assertionResponseWindowsHello, {
			origin: "https://webauthn.org",
			challenge: "m7ZU0Z-_IiwviFnF1JXeJjFhVBincW69E1Ctj8AQ-Ybb1uc41bMHtItg6JACh1sOj_ZXjonw2acj_JD2i-axEQ",
			flags: ["UP"],
			prevCounter: 0,
			publicKey: h.lib.assnPublicKeyWindowsHello,
			userHandle: "YWs",
		});
		assert.ok(ret instanceof Fido2AssertionResult);
	});

	test.run();
};

export { testResponse };