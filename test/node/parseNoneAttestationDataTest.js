// Testing lib
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";

// Helpers
import * as fido2helpers from "fido2-helpers";

// Test subject
import {
  parseAttestationObject,
  parseAuthenticatorData,
  parseAuthnrAssertionResponse,
  parseAuthnrAttestationResponse,
  parseClientResponse,
  parseExpectations,
} from "../../dist/webauthn.js";
import { noneAttestation } from "../../dist/webauthn.js";
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

runs.forEach(function (run) {
  describe(run.functionName + " (none)", function () {
    it("parser is object", function () {
      assert.equal(typeof parser, "object");
    });

    it("correctly parses 'none' format", async function () {
      const ret = run.functionName == "parseAuthnrAttestationResponse"
        ? await parser[run.functionName](
          h.lib.makeCredentialAttestationNoneResponse,
        )
        : await parser[run.functionName](
          h.lib.makeCredentialAttestationNoneResponse.response
            .attestationObject,
        );
      assert.instanceOf(ret, Map);
      assert.strictEqual(ret.size, 12);
      // attStmt
      // var attStmt = ret.get("attStmt");
      // assert.isObject(attStmt);
      // assert.strictEqual(Object.keys(attStmt).length, 0);
      // assert.deepEqual(attStmt, {});
      // fmt
      const fmt = ret.get("fmt");
      assert.strictEqual(fmt, "none");
      // got the right authData CBOR
      const rawAuthnrData = ret.get("rawAuthnrData");
      assert.instanceOf(rawAuthnrData, ArrayBuffer);
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
        0x41,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0xA2,
        0x00,
        0x08,
        0xA2,
        0xDD,
        0x5E,
        0xAC,
        0x1A,
        0x86,
        0xA8,
        0xCD,
        0x6E,
        0xD3,
        0x6C,
        0xD6,
        0x98,
        0x94,
        0x96,
        0x89,
        0xE5,
        0xBA,
        0xFC,
        0x4E,
        0xB0,
        0x5F,
        0x45,
        0x79,
        0xE8,
        0x7D,
        0x93,
        0xBA,
        0x97,
        0x6B,
        0x2E,
        0x73,
        0x76,
        0xB9,
        0xB6,
        0xDF,
        0xD7,
        0x16,
        0xE1,
        0x64,
        0x14,
        0x0F,
        0xF9,
        0x79,
        0xA6,
        0xD4,
        0xF3,
        0x44,
        0xB5,
        0x3D,
        0x6D,
        0x26,
        0xE0,
        0x86,
        0x7B,
        0xF4,
        0x14,
        0xB6,
        0x91,
        0x03,
        0xBB,
        0x65,
        0xCB,
        0xB2,
        0xDA,
        0xF7,
        0xF4,
        0x11,
        0x28,
        0x35,
        0xF0,
        0x64,
        0xCB,
        0x1B,
        0x59,
        0xA8,
        0xE5,
        0x84,
        0xA4,
        0x21,
        0xDA,
        0x8B,
        0xD8,
        0x9E,
        0x38,
        0x7A,
        0x0B,
        0x7E,
        0xEA,
        0xB7,
        0x23,
        0xEC,
        0xD7,
        0x9D,
        0x48,
        0x4C,
        0x31,
        0x6B,
        0xFB,
        0xAE,
        0xC5,
        0x46,
        0x01,
        0xB4,
        0x73,
        0x67,
        0x49,
        0x0A,
        0x83,
        0x9A,
        0xDA,
        0x14,
        0x01,
        0xF3,
        0x3D,
        0x2D,
        0x25,
        0x8B,
        0x97,
        0xAE,
        0x41,
        0x8C,
        0xA5,
        0x59,
        0x34,
        0x65,
        0x29,
        0xF5,
        0xAA,
        0x37,
        0xDE,
        0x63,
        0x12,
        0x75,
        0x57,
        0xD0,
        0x43,
        0x46,
        0xC7,
        0xCD,
        0xEE,
        0xBD,
        0x25,
        0x54,
        0x2F,
        0x2C,
        0x17,
        0xFC,
        0x39,
        0x38,
        0x99,
        0x52,
        0xA2,
        0x6C,
        0x3A,
        0xE2,
        0xA6,
        0xA6,
        0xA5,
        0x1C,
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
        0xBB,
        0x11,
        0xCD,
        0xDD,
        0x6E,
        0x9E,
        0x86,
        0x9D,
        0x15,
        0x59,
        0x72,
        0x9A,
        0x30,
        0xD8,
        0x9E,
        0xD4,
        0x9F,
        0x36,
        0x31,
        0x52,
        0x42,
        0x15,
        0x96,
        0x12,
        0x71,
        0xAB,
        0xBB,
        0xE2,
        0x8D,
        0x7B,
        0x73,
        0x1F,
        0x22,
        0x58,
        0x20,
        0xDB,
        0xD6,
        0x39,
        0x13,
        0x2E,
        0x2E,
        0xE5,
        0x61,
        0x96,
        0x5B,
        0x83,
        0x05,
        0x30,
        0xA6,
        0xA0,
        0x24,
        0xF1,
        0x09,
        0x88,
        0x88,
        0xF3,
        0x13,
        0x55,
        0x05,
        0x15,
        0x92,
        0x11,
        0x84,
        0xC8,
        0x6A,
        0xCA,
        0xC3,
      ]).buffer;
      assert(
        h.functions.abEqual(rawAuthnrData, expectedRawAuthnrData),
        "authData contains right bytes",
      );
      // parsed the authData CBOR correctly
      // var authData = ret.get("authData");
      // assert.isObject(authData);
      // assert.strictEqual(Object.keys(authData).length, 8);
      const rpIdHash = ret.get("rpIdHash");
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
      assert(
        h.functions.abEqual(rpIdHash, expectedRpIdHash),
        "correct rpIdHash",
      );
      // flags
      const flags = ret.get("flags");
      assert.instanceOf(flags, Set);
      assert.strictEqual(flags.size, 2);
      assert.isTrue(flags.has("UP"));
      assert.isTrue(flags.has("AT"));
      // counter
      assert.strictEqual(ret.get("counter"), 0);
      assert.isNumber(ret.get("counter"));
      // aaguid
      const aaguid = ret.get("aaguid");
      assert.instanceOf(aaguid, ArrayBuffer);
      const expectedAaguid = new Uint8Array([
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
      ]).buffer;
      assert(h.functions.abEqual(aaguid, expectedAaguid), "correct aaguid");
      // credIdLen
      assert.strictEqual(ret.get("credIdLen"), 162);
      // credId
      const credId = ret.get("credId");
      assert.instanceOf(credId, ArrayBuffer);
      const expectedCredId = new Uint8Array([
        0x00,
        0x08,
        0xA2,
        0xDD,
        0x5E,
        0xAC,
        0x1A,
        0x86,
        0xA8,
        0xCD,
        0x6E,
        0xD3,
        0x6C,
        0xD6,
        0x98,
        0x94,
        0x96,
        0x89,
        0xE5,
        0xBA,
        0xFC,
        0x4E,
        0xB0,
        0x5F,
        0x45,
        0x79,
        0xE8,
        0x7D,
        0x93,
        0xBA,
        0x97,
        0x6B,
        0x2E,
        0x73,
        0x76,
        0xB9,
        0xB6,
        0xDF,
        0xD7,
        0x16,
        0xE1,
        0x64,
        0x14,
        0x0F,
        0xF9,
        0x79,
        0xA6,
        0xD4,
        0xF3,
        0x44,
        0xB5,
        0x3D,
        0x6D,
        0x26,
        0xE0,
        0x86,
        0x7B,
        0xF4,
        0x14,
        0xB6,
        0x91,
        0x03,
        0xBB,
        0x65,
        0xCB,
        0xB2,
        0xDA,
        0xF7,
        0xF4,
        0x11,
        0x28,
        0x35,
        0xF0,
        0x64,
        0xCB,
        0x1B,
        0x59,
        0xA8,
        0xE5,
        0x84,
        0xA4,
        0x21,
        0xDA,
        0x8B,
        0xD8,
        0x9E,
        0x38,
        0x7A,
        0x0B,
        0x7E,
        0xEA,
        0xB7,
        0x23,
        0xEC,
        0xD7,
        0x9D,
        0x48,
        0x4C,
        0x31,
        0x6B,
        0xFB,
        0xAE,
        0xC5,
        0x46,
        0x01,
        0xB4,
        0x73,
        0x67,
        0x49,
        0x0A,
        0x83,
        0x9A,
        0xDA,
        0x14,
        0x01,
        0xF3,
        0x3D,
        0x2D,
        0x25,
        0x8B,
        0x97,
        0xAE,
        0x41,
        0x8C,
        0xA5,
        0x59,
        0x34,
        0x65,
        0x29,
        0xF5,
        0xAA,
        0x37,
        0xDE,
        0x63,
        0x12,
        0x75,
        0x57,
        0xD0,
        0x43,
        0x46,
        0xC7,
        0xCD,
        0xEE,
        0xBD,
        0x25,
        0x54,
        0x2F,
        0x2C,
        0x17,
        0xFC,
        0x39,
        0x38,
        0x99,
        0x52,
        0xA2,
        0x6C,
        0x3A,
        0xE2,
        0xA6,
        0xA6,
        0xA5,
        0x1C,
      ]).buffer;
      assert(h.functions.abEqual(credId, expectedCredId), "correct credId");
      // credentialPublicKeyCose
      const credentialPublicKeyCose = ret.get("credentialPublicKeyCose");
      assert.instanceOf(credentialPublicKeyCose, ArrayBuffer);
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
        0xBB,
        0x11,
        0xCD,
        0xDD,
        0x6E,
        0x9E,
        0x86,
        0x9D,
        0x15,
        0x59,
        0x72,
        0x9A,
        0x30,
        0xD8,
        0x9E,
        0xD4,
        0x9F,
        0x36,
        0x31,
        0x52,
        0x42,
        0x15,
        0x96,
        0x12,
        0x71,
        0xAB,
        0xBB,
        0xE2,
        0x8D,
        0x7B,
        0x73,
        0x1F,
        0x22,
        0x58,
        0x20,
        0xDB,
        0xD6,
        0x39,
        0x13,
        0x2E,
        0x2E,
        0xE5,
        0x61,
        0x96,
        0x5B,
        0x83,
        0x05,
        0x30,
        0xA6,
        0xA0,
        0x24,
        0xF1,
        0x09,
        0x88,
        0x88,
        0xF3,
        0x13,
        0x55,
        0x05,
        0x15,
        0x92,
        0x11,
        0x84,
        0xC8,
        0x6A,
        0xCA,
        0xC3,
      ]).buffer;
      assert(
        h.functions.abEqual(
          credentialPublicKeyCose,
          expectedCredentialPublicKeyCose,
        ),
        "correct credentialPublicKeyCose",
      );
      // credentialPublicKeyJwk
      const credentialPublicKeyJwk = ret.get("credentialPublicKeyJwk");
      assert.isObject(credentialPublicKeyJwk);
      assert.strictEqual(Object.keys(credentialPublicKeyJwk).length, 5);
      assert.strictEqual(credentialPublicKeyJwk.kty, "EC");
      assert.strictEqual(credentialPublicKeyJwk.crv, "P-256");
      assert.strictEqual(credentialPublicKeyJwk.alg, "ECDSA_w_SHA256");
      // assert.instanceOf(credentialPublicKeyJwk.x, ArrayBuffer);
      // var expectedX = new Uint8Array([
      //     0xBB, 0x11, 0xCD, 0xDD, 0x6E, 0x9E, 0x86, 0x9D, 0x15, 0x59, 0x72, 0x9A, 0x30, 0xD8, 0x9E, 0xD4,
      //     0x9F, 0x36, 0x31, 0x52, 0x42, 0x15, 0x96, 0x12, 0x71, 0xAB, 0xBB, 0xE2, 0x8D, 0x7B, 0x73, 0x1F
      // ]).buffer;
      // assert(h.functions.abEqual(credentialPublicKeyJwk.x, expectedX), "correct 'x' in jwk");
      // assert.instanceOf(credentialPublicKeyJwk.y, ArrayBuffer);
      // var expectedY = new Uint8Array([
      //     0xDB, 0xD6, 0x39, 0x13, 0x2E, 0x2E, 0xE5, 0x61, 0x96, 0x5B, 0x83, 0x05, 0x30, 0xA6, 0xA0, 0x24,
      //     0xF1, 0x09, 0x88, 0x88, 0xF3, 0x13, 0x55, 0x05, 0x15, 0x92, 0x11, 0x84, 0xC8, 0x6A, 0xCA, 0xC3
      // ]).buffer;
      // assert(h.functions.abEqual(credentialPublicKeyJwk.y, expectedY), "correct 'y' in jwk");
      assert.strictEqual(
        credentialPublicKeyJwk.x,
        "uxHN3W6ehp0VWXKaMNie1J82MVJCFZYScau74o17cx8",
      );
      assert.strictEqual(
        credentialPublicKeyJwk.y,
        "29Y5Ey4u5WGWW4MFMKagJPEJiIjzE1UFFZIRhMhqysM",
      );
      // credentialPublicKeyPem
      const credentialPublicKeyPem = ret.get("credentialPublicKeyPem");
      assert.isString(credentialPublicKeyPem);
      const expectedPem = "-----BEGIN PUBLIC KEY-----\n" +
        "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEuxHN3W6ehp0VWXKaMNie1J82MVJC\n" +
        "FZYScau74o17cx/b1jkTLi7lYZZbgwUwpqAk8QmIiPMTVQUVkhGEyGrKww==\n" +
        "-----END PUBLIC KEY-----\n";
      assert.strictEqual(credentialPublicKeyPem, expectedPem);
    });
  });
});

describe("parseFn (none)", function () {
  it("throws if attStmn has fields", function () {
    const attStmt = { test: 1 };
    assert.throws(
      () => {
        noneAttestation.parseFn(attStmt);
      },
      Error,
      "'none' attestation format: attStmt had fields",
    );
  });
});
