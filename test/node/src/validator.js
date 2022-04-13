// Testing lib
import { test } from "uvu";
import * as assert from "uvu/assert";

// Helpers
import klon from "klon";
import * as h from "../../helpers/fido2-helpers.js";
import { ToolBox } from "../../../src/node/toolbox.js";

// Testing subjects
import * as parser from "../../../src/common/parser.js";
import * as validator from "../../../src/common/validator.js";

const before = (run) => {
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
		authnrData: run.functionName == "parseAuthnrAttestationResponse" ? parser[run.functionName](h.lib.makeCredentialAttestationNoneResponse, ToolBox) :  parser[run.functionName](h.lib.makeCredentialAttestationNoneResponse.response.attestationObject, ToolBox),
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
		attResp.tools = ToolBox;

		let ret = await attResp.validateExpectations();
		assert.equal(ret, true);
		assert.equal(attResp.audit.validExpectations, true);
	});
	
	test("Dummy test", async () => {
		const { attResp } = before({functionName: "parseAuthnrAttestationResponse"});
		attResp.tools = ToolBox;

		attResp.expectations.set("allowCredentials", null);
		let ret = await attResp.validateExpectations();
		assert.ok(ret);
		assert.ok(attResp.audit.validExpectations);
	});

	test.run();
};
export { testValidator };