// Testing lib
import { test } from "uvu";
import * as assert from "uvu/assert";

// Helpers
import { arrayBufferEquals, abToBuf, appendBuffer } from "../../../src/common/utils.js";
import * as h from "../../helpers/fido2-helpers.js";
import { ToolBox } from "../../../src/node/toolbox.js";

// Testing subjects
import * as parser from "../../../src/common/parser.js";


// Actual tests
const testParseAssertion = function () {

	test("parser is object", function() {
		assert.equal(typeof parser, "object");
	});

	test("parses assertion correctly", async function() {
		let ret = await parser.parseAuthnrAssertionResponse(h.lib.assertionResponse);
		assert.equal(ret instanceof Map, true);
		assert.equal(ret.size, 6);
		// rpid
		let rpIdHash = ret.get("rpIdHash");
		assert.equal(rpIdHash instanceof ArrayBuffer, true);
		let expectedRpIdHash = new Uint8Array([
			0x49, 0x96, 0x0D, 0xE5, 0x88, 0x0E, 0x8C, 0x68, 0x74, 0x34, 0x17, 0x0F, 0x64, 0x76, 0x60, 0x5B,
			0x8F, 0xE4, 0xAE, 0xB9, 0xA2, 0x86, 0x32, 0xC7, 0x99, 0x5C, 0xF3, 0xBA, 0x83, 0x1D, 0x97, 0x63,
		]).buffer;
		assert.equal(arrayBufferEquals(rpIdHash, expectedRpIdHash), true);
		// flags
		let flags = ret.get("flags");
		assert.equal(flags instanceof Set, true);
		assert.equal(flags.size, 1);
		assert.equal(flags.has("UP"), true);
		// counter
		assert.equal(ret.get("counter"), 363);
		// sig
		let sig = ret.get("sig");
		assert.equal(sig instanceof ArrayBuffer, true);
		let expectedSig = new Uint8Array([
			0x30, 0x46, 0x02, 0x21, 0x00, 0xFA, 0x74, 0x5D, 0xC1, 0xD1, 0x9A, 0x1A, 0x2C, 0x0D, 0x2B, 0xEF,
			0xCA, 0x32, 0x45, 0xDA, 0x0C, 0x35, 0x1D, 0x1B, 0x37, 0xDD, 0xD9, 0x8B, 0x87, 0x05, 0xFF, 0xBE,
			0x61, 0x14, 0x01, 0xFA, 0xA5, 0x02, 0x21, 0x00, 0xB6, 0x34, 0x50, 0x8B, 0x2B, 0x87, 0x4D, 0xEE,
			0xFD, 0xFE, 0x32, 0x28, 0xEC, 0x33, 0xC0, 0x3E, 0x82, 0x8F, 0x7F, 0xC6, 0x58, 0xB2, 0x62, 0x8A,
			0x84, 0xD3, 0xF7, 0x9F, 0x34, 0xB3, 0x56, 0xBB,
		]).buffer;
		assert.equal(arrayBufferEquals(sig, expectedSig), true);
		// userHandle
		let userHandle = ret.get("userHandle");
		assert.equal(typeof userHandle, "undefined");
		// authRawData
		let rawAuthnrData = ret.get("rawAuthnrData");
		assert.equal(rawAuthnrData instanceof ArrayBuffer, true);
		let expectedAuthnrRawData = new Uint8Array([
			0x49, 0x96, 0x0D, 0xE5, 0x88, 0x0E, 0x8C, 0x68, 0x74, 0x34, 0x17, 0x0F, 0x64, 0x76, 0x60, 0x5B,
			0x8F, 0xE4, 0xAE, 0xB9, 0xA2, 0x86, 0x32, 0xC7, 0x99, 0x5C, 0xF3, 0xBA, 0x83, 0x1D, 0x97, 0x63,
			0x01, 0x00, 0x00, 0x01, 0x6B,
		]).buffer;
		assert.equal(arrayBufferEquals(rawAuthnrData, expectedAuthnrRawData), true);
	});

	test("works", async function() {
		let sig = h.lib.assertionResponse.response.signature;
		let pk = h.lib.assnPublicKey;
		let authnrData = h.lib.assertionResponse.response.authenticatorData;
		let clientData = h.lib.assertionResponse.response.clientDataJSON;

		const hash = await ToolBox.hashDigest(clientData);
		let clientDataHash = new Uint8Array(hash).buffer;

		const res = await ToolBox.verifySignature(pk,abToBuf(sig),appendBuffer(abToBuf(authnrData),abToBuf(clientDataHash)));  
		assert.equal(res, true);
	});

};

export { testParseAssertion };