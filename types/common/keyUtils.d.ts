export function algToHashStr(alg: any): any;
export function algToStr(alg: any): any;
export class Key {
    constructor(key: any);
    _original_pem: any;
    _original_jwk: any;
    _original_cose: any;
    _key: any;
    fromPem(pem: any): Promise<any>;
    fromJWK(jwk: any, extractable: any): Promise<any>;
    _alg: any;
    fromCose(cose: any): Promise<any>;
    _cose: ArrayBuffer;
    toPem(): Promise<any>;
    toJwk(): any;
    toCose(): any;
    getKey(): any;
}
