let testTarget = "lib";
if (typeof Deno !== "undefined" && typeof Deno.env !== "undefined" && Deno.env.get("TEST_TARGET")) {
  testTarget = Deno.env.get("TEST_TARGET");
}
if (typeof process !== "undefined" && process.env.TEST_TARGET) {
  testTarget = process.env.TEST_TARGET;
}

let exported;
if (testTarget === "dist") {
  exported = await import("../../dist/webauthn.js");
} else {
  exported = await import("../../lib/webauthn.js");
}

const {
  abEqual,
  abToBuf,
  androidSafetyNetAttestation,
  appendBuffer,
  coerceToArrayBuffer,
  Fido2AssertionResult,
  Fido2AttestationResult,
  fidoU2fAttestation,
  MdsCollection,
  MdsEntry,
  noneAttestation,
  packedAttestation,
  tools,
  tpmAttestation,
  Certificate,
  CertManager,
  CRL,
  helpers,
  coerceToBase64Url,
  jsObjectToB64,
  strToAb,
  parseAttestationObject,
  parseAuthnrAttestationResponse,
  parseAuthnrAssertionResponse,
  parseClientResponse,
  parseExpectations,
  coerceToBase64,
  Fido2Result,
  abToHex,
  isBase64Url,
  isPem,
  pemToBase64,
  attach,
  Key,
  Webauthn,
} = exported;
export {
  abEqual,
  abToBuf,
  abToHex,
  androidSafetyNetAttestation,
  appendBuffer,
  attach,
  Certificate,
  CertManager,
  coerceToArrayBuffer,
  coerceToBase64,
  coerceToBase64Url,
  CRL,
  Fido2AssertionResult,
  Fido2AttestationResult,
  Fido2Result,
  fidoU2fAttestation,
  helpers,
  isBase64Url,
  isPem,
  jsObjectToB64,
  Key,
  MdsCollection,
  MdsEntry,
  noneAttestation,
  packedAttestation,
  parseAttestationObject,
  parseAuthnrAssertionResponse,
  parseAuthnrAttestationResponse,
  parseClientResponse,
  parseExpectations,
  pemToBase64,
  strToAb,
  tools,
  tpmAttestation,
  Webauthn,
};
