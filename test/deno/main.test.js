// Testing lib
import { assertEquals } from "./common/deps.js";

// Helpers
import * as h from "../helpers/fido2-helpers.js";

// Test subject
import { Webauthn } from "../../lib/webauthn.js";

Deno.test("Istantiation and registration", async () => {
  const testObj = new Webauthn({
    timeout: 90000,
    rpId: "My RP",
    rpName: "Webauthn Test",
    challengeSize: 128,
    attestation: "none",
    cryptoParams: [-7, -257],
    authenticatorAttachment: undefined, // ["platform", "cross-platform"]
    authenticatorRequireResidentKey: false,
    authenticatorUserVerification: "preferred",
  });
  assertEquals(testObj.attestationMap instanceof Map, true);

  // Registration
  const registrationOptions = await testObj.attestationOptions();
  assertEquals(registrationOptions.rp.name, "Webauthn Test");
  assertEquals(registrationOptions.rp.id, "My RP");
  assertEquals(registrationOptions.attestation, "none");
  assertEquals(registrationOptions.challenge instanceof ArrayBuffer, true);
  assertEquals(registrationOptions.challenge.byteLength, 128);
  const attestationExpectations = {
    challenge:
      "33EHav-jZ1v9qwH783aU-j0ARx6r5o-YHh-wd7C6jPbd7Wh6ytbIZosIIACehwf9-s6hXhySHO-HHUjEwZS29w",
    origin: "https://localhost:8443",
    factor: "either",
  };
  const regResult = await testObj.attestationResult(
    h.lib.makeCredentialAttestationNoneResponse,
    attestationExpectations,
  ); // will throw on error
  assertEquals(regResult.audit.validExpectations, true);
  assertEquals(regResult.audit.validRequest, true);
  assertEquals(regResult.audit.complete, true);
  const publicKey = regResult.authnrData.get("credentialPublicKeyPem");
  assertEquals(publicKey !== undefined, true);

  const counter = regResult.authnrData.get("counter");
  const credId = regResult.authnrData.get("credId");

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
    authenticatorUserVerification: "preferred",
  });
  assertEquals(testObj.attestationMap instanceof Map, true);

  // Authentication
  await testObjAuth.assertionOptions();

  const assertionExpectations = {
    // Remove the following comment if allowCredentials has been added into authnOptions so the credential received will be validate against allowCredentials array.
    // allowCredentials: [{
    //     id: "lTqW8H/lHJ4yT0nLOvsvKgcyJCeO8LdUjG5vkXpgO2b0XfyjLMejRvW5oslZtA4B/GgkO/qhTgoBWSlDqCng4Q==",
    //     type: "public-key",
    //     transports: ["usb"]
    // }],
    challenge:
      "eaTyUNnyPDDdK8SNEgTEUvz1Q8dylkjjTimYd5X7QAo-F8_Z1lsJi3BilUpFZHkICNDWY8r9ivnTgW7-XZC3qQ",
    origin: "https://localhost:8443",
    factor: "either",
    publicKey: h.lib.assnPublicKey,
    prevCounter: counter,
    userHandle: credId,
  };
  await testObjAuth.assertionResult(
    h.lib.assertionResponse,
    assertionExpectations,
  ); // will throw on error
});
