// deno-lint-ignore-file
// Fix Deno global
if (typeof Deno === "undefined") {
  global.Deno = {
    permissions: false,
  };
}

// Fix crypto global in node
if (typeof crypto === "undefined") {
  // deno-lint-ignore
  global.crypto = (await import("crypto")).webcrypto;
}


import {} from "./toolbox.js";

export { Webauthn } from "./common/main.js";

export {
  parseAttestationObject,
  parseAuthenticatorData,
  parseAuthnrAssertionResponse,
  parseAuthnrAttestationResponse,
  parseClientResponse,
  parseExpectations,
} from "./common/parser.js";

export { Certificate, CertManager, CRL, helpers } from "./common/certUtils.js";

export {
  Fido2AssertionResult,
  Fido2AttestationResult,
  Fido2Result,
} from "./common/response.js";

export { attach } from "./common/validator.js";

export { MdsCollection, MdsEntry } from "./common/mds.js";

export { noneAttestation } from "./common/attestations/none.js";
export { fidoU2fAttestation } from "./common/attestations/fidoU2F.js";
export { packedAttestation } from "./common/attestations/packed.js";
export { tpmAttestation } from "./common/attestations/tpm.js";
export { androidSafetyNetAttestation } from "./common/attestations/androidSafetyNet.js";

export {
  abEqual,
  abToBuf,
  abToHex,
  appendBuffer,
  coerceToArrayBuffer,
  coerceToBase64,
  coerceToBase64Url,
  isBase64Url,
  isPem,
  jsObjectToB64,
  pemToBase64,
  strToAb,
  tools,
} from "./common/utils.js";
