export namespace ToolBox {
    export { checkOrigin };
    export { checkRpId };
    export { checkDomainOrUrl };
    export { checkUrl };
    export { verifySignature };
    export { jwkToPem };
    export { hashDigest };
    export { randomValues };
    export { getHostname };
}
declare function checkOrigin(str: any): any;
declare function checkRpId(rpId: any): string;
declare function checkDomainOrUrl(value: any, name: any, rules?: {}): string;
declare function checkUrl(value: any, name: any, rules?: {}): string;
declare function verifySignature(publicKey: any, expectedSignature: any, data: any): Promise<any>;
declare function jwkToPem(jwk: any): Promise<any>;
declare function hashDigest(o: any): Promise<any>;
declare function randomValues(n: any): Uint8Array;
declare function getHostname(urlIn: any): any;
export {};
