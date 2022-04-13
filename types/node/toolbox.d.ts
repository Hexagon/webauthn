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
declare function checkOrigin(str: any): string;
declare function checkRpId(rpId: any): string;
declare function checkDomainOrUrl(value: any, name: any, rules?: {}): string;
declare function checkUrl(value: any, name: any, rules?: {}): string;
declare function verifySignature(publicKey: any, expectedSignature: any, data: any): boolean;
declare function hashDigest(o: any): Promise<Uint8Array>;
declare function randomValues(n: any): Buffer;
declare function getHostname(urlIn: any): string;
export {};
