import { assertEquals } from "https://deno.land/std@0.128.0/testing/asserts.ts";
import * as utils from "../../../src/deno/utils.js";
import { default as klon } from "https://esm.run/klon";
import * as h from "../../helpers/fido2-helpers.js";

function testUtils() {
	// Actual tests
	Deno.test("randomValues has corrent length", async () => {
		const res32bytes = utils.randomValues(32);
		assertEquals(res32bytes.length, 32);
	});

	Deno.test("Coerce", () => {
		const testReq = klon(h.lib.makeCredentialAttestationNoneResponse);
		testReq.response.clientDataJSON = h.lib.makeCredentialAttestationNoneResponse.response.clientDataJSON.slice(0);
		testReq.response.attestationObject = h.lib.makeCredentialAttestationNoneResponse.response.attestationObject.slice(0);
		let resData = utils.coerceToArrayBuffer(testReq.response.clientDataJSON, "test");
		let resAttestationObject = utils.coerceToArrayBuffer(testReq.response.attestationObject, "test");
		let resData2 = utils.coerceToArrayBuffer(resData, "test");
		let resAttestationObject2 = utils.coerceToArrayBuffer(resAttestationObject, "test");
		assertEquals(testReq.response.clientDataJSON.byteLength,resData.byteLength);
		assertEquals(testReq.response.attestationObject.byteLength,resAttestationObject.byteLength);
		assertEquals(testReq.response.clientDataJSON.byteLength,resData2.byteLength);
		assertEquals(testReq.response.attestationObject.byteLength,resAttestationObject2.byteLength);
	});
}

export { testUtils };