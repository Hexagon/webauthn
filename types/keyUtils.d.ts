export function algToHashStr(alg: any): any;
export function algToStr(alg: any): any;
export class Key {
    constructor(key: any, alg: any);
    _original_pem: any;
    _original_jwk: any;
    _original_cose: any;
    _key: any;
    _alg: any;
    _keyinfo: any;
    fromPem(pem: any, hashName: any): Promise<any>;
    _keyInfo: any;
    fromJWK(jwk: any, extractable: any): Promise<any>;
    fromCose(cose: any): Promise<any>;
    _cose: ArrayBuffer;
    toPem(forcedExport: any): Promise<any>;
    toJwk(): any;
    toCose(): any;
    getKey(): any;
    getAlgorithm(): any;
}
