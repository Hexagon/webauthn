export class Certificate {
    constructor(cert: any);
    _cert: any;
    warning: Map<any, any>;
    info: Map<any, any>;
    getCommonName(): string;
    verify(): any;
    getPublicKey(): any;
    getIssuer(): any;
    getSerial(): any;
    getVersion(): any;
    getSubject(): Map<any, any>;
    getExtensions(): Map<any, any>;
}
export class CertManager {
    static addCert(certBuf: any): boolean;
    static getCerts(): Map<any, any>;
    static getCertBySerial(serial: any): any;
    static removeAll(): void;
    static verifyCertChain(certs: any, roots: any, crls: any): Promise<any>;
}
export class CRL {
    constructor(crl: any);
    _crl: any;
}
export namespace helpers {
    export { resolveOid };
}
declare function resolveOid(id: any, value: any): {
    id: any;
    value: any;
};
export {};
