import { test } from "uvu";
import * as assert from "uvu/assert";
import * as utils from "../../../src/node/utils.js";
import { default as klon } from "klon";
import * as h from "../../helpers/fido2-helpers.js";

// Actual tests
const testUtils = function () {
	
	test("Dummy test", async () => {
		const res32bytes = utils.randomValues(32);
		assert.equal(res32bytes.length, 32);
	});

	test("Coerce", () => {
		const testReq = klon(h.lib.makeCredentialAttestationNoneResponse);
		testReq.response.clientDataJSON = h.lib.makeCredentialAttestationNoneResponse.response.clientDataJSON.slice(0);
		testReq.response.attestationObject = h.lib.makeCredentialAttestationNoneResponse.response.attestationObject.slice(0);
		let resData = utils.coerceToArrayBuffer(testReq.response.clientDataJSON, "test");
		let resAttestationObject = utils.coerceToArrayBuffer(testReq.response.attestationObject, "test");
	});
	
	test.run();
};
export { testUtils };