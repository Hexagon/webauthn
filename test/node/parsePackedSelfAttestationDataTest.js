// Testing lib
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";

// Helpers
import * as fido2helpers from "fido2-helpers";

import { abEqual } from "../../dist/webauthn.js";

// Test subject
import {
  parseAttestationObject,
  parseAuthenticatorData,
  parseAuthnrAssertionResponse,
  parseAuthnrAttestationResponse,
  parseClientResponse,
  parseExpectations,
} from "../../dist/webauthn.js";

import { packedSelfAttestationResponse } from "../fixtures/packedSelfAttestationData.js";
chai.use(chaiAsPromised.default);
const { assert } = chai;
const h = fido2helpers.default;

const parser = {
  parseAuthnrAttestationResponse,
  parseAttestationObject,
};

const runs = [
  { functionName: "parseAuthnrAttestationResponse" },
  { functionName: "parseAttestationObject" },
];

const parsedPackedSelfAttestationResponse = {
  ...packedSelfAttestationResponse,
  id: h.functions.b64decode(packedSelfAttestationResponse.id),
  rawId: h.functions.b64decode(packedSelfAttestationResponse.rawId),
  response: {
    attestationObject: h.functions.b64decode(
      packedSelfAttestationResponse.response.attestationObject,
    ),
    clientDataJSON: h.functions.b64decode(
      packedSelfAttestationResponse.response.clientDataJSON,
    ),
  },
};

runs.forEach(function (run) {
  describe(run.functionName + " (packed self-assigned)", async function () {
    it("parser is object", function () {
      assert.equal(typeof parser, "object");
    });

    const ret = run.functionName == "parseAuthnrAttestationResponse"
      ? await parser[run.functionName](parsedPackedSelfAttestationResponse)
      : await parser[run.functionName](
        parsedPackedSelfAttestationResponse.response.attestationObject,
      );

    it("parser returns Map with correct size", function () {
      assert.instanceOf(ret, Map);
      assert.strictEqual(ret.size, 15);
    });

    it("is 'packed' fmt", function () {
      assert.strictEqual(ret.get("fmt"), "packed");
    });

    it("has correct alg", function () {
      const alg = ret.get("alg");
      assert.isObject(alg);
      assert.strictEqual(Object.keys(alg).length, 2);
      assert.strictEqual(alg.algName, "ECDSA_w_SHA256");
      assert.strictEqual(alg.hashAlg, "SHA256");
    });

    it("does not have x5c", function () {
      const x5c = ret.get("x5c");
      assert.isUndefined(x5c);
    });

    it("does not have attCert", function () {
      const attCert = ret.get("attCert");
      assert.isUndefined(attCert);
    });

    it("has sig", function () {
      const sig = ret.get("sig");
      assert.instanceOf(sig, ArrayBuffer);

      const expectedSig = new Uint8Array([
        0x30,
        0x45,
        0x02,
        0x21,
        0x00,
        0x9b,
        0x71,
        0x6a,
        0x01,
        0xb0,
        0x51,
        0x26,
        0x01,
        0xc8,
        0xb0,
        0x07,
        0x7a,
        0xb7,
        0x0f,
        0xe4,
        0x16,
        0xfd,
        0x7d,
        0x24,
        0x02,
        0x18,
        0xa3,
        0x99,
        0xbc,
        0x9b,
        0x80,
        0x01,
        0xe3,
        0x07,
        0xdd,
        0xfb,
        0x4a,
        0x02,
        0x20,
        0x0b,
        0xa5,
        0x88,
        0x9f,
        0xfe,
        0xec,
        0x5f,
        0xbc,
        0x12,
        0x08,
        0x94,
        0x5f,
        0x60,
        0x67,
        0x67,
        0x18,
        0x18,
        0x51,
        0x5b,
        0xba,
        0x7b,
        0x02,
        0x7d,
        0xea,
        0xb6,
        0xd4,
        0x71,
        0xe3,
        0x3f,
        0x07,
        0x1a,
        0xd8,
      ]).buffer;

      assert.isTrue(abEqual(sig, expectedSig), "sig has correct value");
    });

    it("has correct raw authnrData", function () {
      const rawAuthnrData = ret.get("rawAuthnrData");
      assert.instanceOf(rawAuthnrData, ArrayBuffer);
      assert.strictEqual(rawAuthnrData.byteLength, 283);

      const expectedRawAuthnrData = new Uint8Array([
        0x49,
        0x96,
        0x0D,
        0xE5,
        0x88,
        0x0E,
        0x8C,
        0x68,
        0x74,
        0x34,
        0x17,
        0x0F,
        0x64,
        0x76,
        0x60,
        0x5B,
        0x8F,
        0xE4,
        0xAE,
        0xB9,
        0xA2,
        0x86,
        0x32,
        0xC7,
        0x99,
        0x5C,
        0xF3,
        0xBA,
        0x83,
        0x1D,
        0x97,
        0x63,
        0x45,
        0x61,
        0xEE,
        0xC2,
        0xF6,
        0xAD,
        0xCE,
        0x00,
        0x02,
        0x35,
        0xBC,
        0xC6,
        0x0A,
        0x64,
        0x8B,
        0x0B,
        0x25,
        0xF1,
        0xF0,
        0x55,
        0x03,
        0x00,
        0x97,
        0x01,
        0x0E,
        0x3B,
        0x5A,
        0xAB,
        0x26,
        0x12,
        0x93,
        0x72,
        0x39,
        0x7B,
        0xA2,
        0x7A,
        0xF2,
        0x4B,
        0xD8,
        0x4E,
        0x33,
        0x41,
        0x1C,
        0x0A,
        0x20,
        0xE2,
        0x6D,
        0x07,
        0x28,
        0x2C,
        0xDA,
        0x71,
        0x8D,
        0xDA,
        0xF8,
        0xD5,
        0xBC,
        0x5C,
        0x55,
        0x23,
        0xB4,
        0x6A,
        0x06,
        0xA3,
        0xAF,
        0xE4,
        0x1B,
        0x83,
        0x68,
        0x18,
        0x4B,
        0x2C,
        0x66,
        0xF9,
        0x8E,
        0x4F,
        0x31,
        0x0F,
        0x51,
        0xF4,
        0x95,
        0x13,
        0x97,
        0x8A,
        0x11,
        0x97,
        0x73,
        0x1C,
        0x42,
        0xC9,
        0xD5,
        0x6F,
        0xC1,
        0xBF,
        0xFE,
        0x73,
        0xB3,
        0xB5,
        0xB5,
        0x70,
        0xE6,
        0xA3,
        0x1B,
        0x3D,
        0x9E,
        0xB7,
        0xDF,
        0x90,
        0x31,
        0xC8,
        0x2C,
        0x79,
        0xB4,
        0x24,
        0xB3,
        0x06,
        0xA7,
        0xAA,
        0x12,
        0x56,
        0x23,
        0x7C,
        0xE1,
        0xF3,
        0x49,
        0x10,
        0x7A,
        0xB3,
        0xF4,
        0xBE,
        0xAC,
        0x61,
        0x8F,
        0x16,
        0x42,
        0x6E,
        0xFE,
        0xD5,
        0xF6,
        0x6C,
        0x9E,
        0xD2,
        0xDD,
        0xAC,
        0x37,
        0xE8,
        0x9B,
        0x5B,
        0xBE,
        0xF6,
        0xF2,
        0xE1,
        0x82,
        0xED,
        0xDF,
        0xD1,
        0x68,
        0xAB,
        0x8B,
        0x04,
        0x7B,
        0x66,
        0xBA,
        0x78,
        0x51,
        0x1D,
        0x20,
        0x85,
        0x44,
        0x92,
        0xA1,
        0x42,
        0x0B,
        0x43,
        0xA5,
        0x01,
        0x02,
        0x03,
        0x26,
        0x20,
        0x01,
        0x21,
        0x58,
        0x20,
        0xB9,
        0xB7,
        0xD9,
        0x2A,
        0x9B,
        0x86,
        0x36,
        0xED,
        0x25,
        0xBB,
        0x3B,
        0xFE,
        0x9B,
        0x28,
        0x16,
        0x54,
        0x87,
        0xD4,
        0xEA,
        0x28,
        0x13,
        0x63,
        0xE3,
        0x88,
        0x4E,
        0x1E,
        0xE3,
        0x49,
        0x7D,
        0xC4,
        0x2F,
        0xE7,
        0x22,
        0x58,
        0x20,
        0x9C,
        0x17,
        0xF0,
        0xD6,
        0xCC,
        0x1F,
        0xAB,
        0x6F,
        0xA2,
        0x00,
        0x89,
        0x23,
        0x65,
        0x12,
        0x34,
        0x15,
        0xEF,
        0x64,
        0x1C,
        0xA6,
        0x95,
        0xF6,
        0x98,
        0x3,
        0xFA,
        0xDA,
        0xAD,
        0x7A,
        0xA8,
        0xF0,
        0x1C,
        0x97,
      ]).buffer;
      assert.isTrue(
        abEqual(rawAuthnrData, expectedRawAuthnrData),
        "rawAuthnrData has correct value",
      );
    });

    it("has correct rpIdHash", function () {
      const rpIdHash = ret.get("rpIdHash");
      assert.instanceOf(rpIdHash, ArrayBuffer);
      assert.strictEqual(rpIdHash.byteLength, 32);

      const expectedRpIdHash = new Uint8Array([
        0x49,
        0x96,
        0x0D,
        0xE5,
        0x88,
        0x0E,
        0x8C,
        0x68,
        0x74,
        0x34,
        0x17,
        0x0F,
        0x64,
        0x76,
        0x60,
        0x5B,
        0x8F,
        0xE4,
        0xAE,
        0xB9,
        0xA2,
        0x86,
        0x32,
        0xC7,
        0x99,
        0x5C,
        0xF3,
        0xBA,
        0x83,
        0x1D,
        0x97,
        0x63,
      ]).buffer;
      assert.isTrue(
        abEqual(rpIdHash, expectedRpIdHash),
        "rpIdHash has correct value",
      );
    });

    it("has correct flags", function () {
      const flags = ret.get("flags");
      assert.instanceOf(flags, Set);
      assert.strictEqual(flags.size, 3);
      assert.isTrue(flags.has("AT"));
      assert.isTrue(flags.has("UP"));
      assert.isTrue(flags.has("UV"));
    });

    it("has correct counter", function () {
      const counter = ret.get("counter");
      assert.isNumber(counter);
      assert.strictEqual(counter, 1643037430);
    });

    it("has correct aaguid", function () {
      const aaguid = ret.get("aaguid");
      assert.instanceOf(aaguid, ArrayBuffer);
      assert.strictEqual(aaguid.byteLength, 16);

      const expectedAaguid = new Uint8Array([
        0xAD,
        0xCE,
        0x00,
        0x02,
        0x35,
        0xBC,
        0xC6,
        0x0A,
        0x64,
        0x8B,
        0x0B,
        0x25,
        0xF1,
        0xF0,
        0x55,
        0x03,
      ]).buffer;
      assert.isTrue(
        abEqual(aaguid, expectedAaguid),
        "aaguid has correct value",
      );
    });

    it("has correct credIdLen", function () {
      const credIdLen = ret.get("credIdLen");
      assert.isNumber(credIdLen);
      assert.strictEqual(credIdLen, 151);
    });

    it("has correct credentialPublicKeyCose", function () {
      const credentialPublicKeyCose = ret.get("credentialPublicKeyCose");
      assert.instanceOf(credentialPublicKeyCose, ArrayBuffer);
      assert.strictEqual(credentialPublicKeyCose.byteLength, 77);

      const expectedCredentialPublicKeyCose = new Uint8Array([
        0xA5,
        0x01,
        0x02,
        0x03,
        0x26,
        0x20,
        0x01,
        0x21,
        0x58,
        0x20,
        0xB9,
        0xB7,
        0xD9,
        0x2A,
        0x9B,
        0x86,
        0x36,
        0xED,
        0x25,
        0xBB,
        0x3B,
        0xFE,
        0x9B,
        0x28,
        0x16,
        0x54,
        0x87,
        0xD4,
        0xEA,
        0x28,
        0x13,
        0x63,
        0xE3,
        0x88,
        0x4E,
        0x1E,
        0xE3,
        0x49,
        0x7D,
        0xC4,
        0x2F,
        0xE7,
        0x22,
        0x58,
        0x20,
        0x9C,
        0x17,
        0xF0,
        0xD6,
        0xCC,
        0x1F,
        0xAB,
        0x6F,
        0xA2,
        0x00,
        0x89,
        0x23,
        0x65,
        0x12,
        0x34,
        0x15,
        0xEF,
        0x64,
        0x1C,
        0xA6,
        0x95,
        0xF6,
        0x98,
        0x03,
        0xFA,
        0xDA,
        0xAD,
        0x7A,
        0xA8,
        0xF0,
        0x1C,
        0x97,
      ]).buffer;
      assert.isTrue(
        abEqual(credentialPublicKeyCose, expectedCredentialPublicKeyCose),
        "credentialPublicKeyCose has correct value",
      );
    });
  });
});
