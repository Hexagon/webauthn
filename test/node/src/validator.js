import { test } from "uvu";
import klon from "klon";
import * as assert from "uvu/assert";
import * as validator from "../../../src/node/validator.js";
import * as parser from "../../../src/node/parser.js";
import * as h from "../../helpers/fido2-helpers.js";

const before = (run) => {
	console.log(run.functionName);
	const attResp = {
		request: {},
		requiredExpectations: new Set([
			"origin",
			"challenge",
			"flags",
		]),
		optionalExpectations: new Set([
			"rpId",
			"allowCredentials",
		]),
		expectations: new Map([
			["origin", "https://localhost:8443"],
			["challenge", "33EHav-jZ1v9qwH783aU-j0ARx6r5o-YHh-wd7C6jPbd7Wh6ytbIZosIIACehwf9-s6hXhySHO-HHUjEwZS29w"],
			["flags", ["UP", "AT"]],
		]),
		clientData: parser.parseClientResponse(h.lib.makeCredentialAttestationNoneResponse),
		authnrData: run.functionName == "parseAuthnrAttestationResponse" ? parser[run.functionName](h.lib.makeCredentialAttestationNoneResponse) :  parser[run.functionName](h.lib.makeCredentialAttestationNoneResponse.response.attestationObject),
	};
	let testReq = klon(h.lib.makeCredentialAttestationNoneResponse);
	testReq.rawId = h.lib.makeCredentialAttestationNoneResponse.rawId;
	testReq.response.clientDataJSON = h.lib.makeCredentialAttestationNoneResponse.response.clientDataJSON.slice(0);
	testReq.response.attestationObject = h.lib.makeCredentialAttestationNoneResponse.response.attestationObject.slice(0);
	attResp.request = testReq;

	validator.attach(attResp);

	return {
		validator,
		attResp
	};

};
// Actual tests
const testValidator = function () {

	test("Dummy test", async () => {
		const { attResp } = before({functionName: "parseAuthnrAttestationResponse"});
		let ret = await attResp.validateExpectations();
		assert.equal(ret, true);
		assert.equal(attResp.audit.validExpectations, true);
	});
	
	test("Dummy test", async () => {
		const { attResp } = before({functionName: "parseAuthnrAttestationResponse"});
		attResp.expectations.set("allowCredentials", null);
		let ret = await attResp.validateExpectations();
		assert.ok(ret);
		assert.ok(attResp.audit.validExpectations);
	});

	test.run();
};
export { testValidator };