export function parseExpectations(exp: any, tools: any): Map<any, any>;
/**
 * Parses the clientData JSON byte stream into an Object
 * @param  {ArrayBuffer} clientDataJSON The ArrayBuffer containing the properly formatted JSON of the clientData object
 * @return {Object}                The parsed clientData object
 */
export function parseClientResponse(msg: any): any;
export function parseAuthenticatorData(authnrDataArrayBuffer: any, tools: any): Promise<Map<any, any>>;
export function parseAuthnrAssertionResponse(msg: any, tools: any): Promise<Map<any, any>>;
export function parseAuthnrAttestationResponse(msg: any, tools: any): Promise<Map<any, any>>;
