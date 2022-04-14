// Testing lib
import { test } from "uvu";
import * as assert from "uvu/assert";


// Helpers
import { ToolBox } from "../../../src/node/toolbox.js";
import * as h from "../../helpers/fido2-helpers.js";

// Test subject
import { Webauthn } from "../../../src/node/webauthn.js";

// Actual tests
const testMain = function () {
	test("Istantiation and registration", async () => {
		const testObj = new Webauthn({
			timeout: 90000,
			rpId: "My RP",
			rpName: "Webauthn Test",
			challengeSize: 128,
			attestation: "none",
			cryptoParams: [-7, -257],
			authenticatorAttachment: undefined, // ["platform", "cross-platform"]
			authenticatorRequireResidentKey: false,
			authenticatorUserVerification: "preferred"
		}, ToolBox);
		assert.equal(testObj.attestationMap instanceof Map, true);

		// Registration
		let registrationOptions = await testObj.attestationOptions();
		assert.equal(registrationOptions.rp.name, "Webauthn Test");
		assert.equal(registrationOptions.rp.id, "My RP");
		assert.equal(registrationOptions.attestation, "none");
		assert.equal(registrationOptions.challenge instanceof ArrayBuffer, true);
		assert.equal(registrationOptions.challenge.byteLength, 128);
		let attestationExpectations = {
			challenge: "33EHav-jZ1v9qwH783aU-j0ARx6r5o-YHh-wd7C6jPbd7Wh6ytbIZosIIACehwf9-s6hXhySHO-HHUjEwZS29w",
			origin: "https://localhost:8443",
			factor: "either"
		};
		let regResult = await testObj.attestationResult(h.lib.makeCredentialAttestationNoneResponse, attestationExpectations); // will throw on error
		assert.equal(regResult.audit.validExpectations, true);
		assert.equal(regResult.audit.validRequest, true);
		assert.equal(regResult.audit.complete, true);
		let 
			counter = regResult.authnrData.get("counter"),
			credId = regResult.authnrData.get("credId");

		// Authorization
		const testObjAuth = new Webauthn({
			timeout: 90000,
			rpId: "My RP",
			rpName: "Webauthn Test",
			challengeSize: 128,
			attestation: "none",
			cryptoParams: [-7, -257],
			authenticatorAttachment: undefined, // ["platform", "cross-platform"]
			authenticatorRequireResidentKey: false,
			authenticatorUserVerification: "preferred"
		}, ToolBox);
		assert.equal(testObj.attestationMap instanceof Map, true);

		// Authentication
		/*let authnOptions = */await testObjAuth.assertionOptions();

		let assertionExpectations = {
			// Remove the following comment if allowCredentials has been added into authnOptions so the credential received will be validate against allowCredentials array.
			// allowCredentials: [{
			//     id: "lTqW8H/lHJ4yT0nLOvsvKgcyJCeO8LdUjG5vkXpgO2b0XfyjLMejRvW5oslZtA4B/GgkO/qhTgoBWSlDqCng4Q==",
			//     type: "public-key",
			//     transports: ["usb"]
			// }],
			challenge: "eaTyUNnyPDDdK8SNEgTEUvz1Q8dylkjjTimYd5X7QAo-F8_Z1lsJi3BilUpFZHkICNDWY8r9ivnTgW7-XZC3qQ",
			origin: "https://localhost:8443",
			factor: "either",
			publicKey: h.lib.assnPublicKey,
			prevCounter: counter,
			userHandle: credId
		};
		/*let authResult =*/ await testObjAuth.assertionResult(h.lib.assertionResponse, assertionExpectations); // will throw on error
	});

	test.run();
};
export { testMain };
