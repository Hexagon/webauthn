/**
 * @deprecated
 * Parses the CBOR attestation statement
 * @param  {ArrayBuffer} attestationObject The CBOR byte array representing the attestation statement
 * @return {Object}                   The Object containing all the attestation information
 * @see https://w3c.github.io/webauthn/#generating-an-attestation-object
 * @see  https://w3c.github.io/webauthn/#defined-attestation-formats
 */
export function parseAttestationObject(attestationObject: ArrayBuffer): any;
export function parseAuthenticatorData(authnrDataArrayBuffer: any): Promise<Map<any, any>>;
export function parseAuthnrAssertionResponse(msg: any): Promise<Map<any, any>>;
export function parseAuthnrAttestationResponse(msg: any): Promise<Map<any, any>>;
/**
 * Parses the clientData JSON byte stream into an Object
 * @param  {ArrayBuffer} clientDataJSON The ArrayBuffer containing the properly formatted JSON of the clientData object
 * @return {Object}                The parsed clientData object
 */
export function parseClientResponse(msg: any): any;
export function parseExpectations(exp: any): Map<any, any>;
