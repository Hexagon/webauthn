export namespace cbor {
    export { encode };
    export { decode };
}
export function checkDomainOrUrl(value: any, name: any, rules?: {}): string;
export function checkOrigin(str: any): any;
export function checkRpId(rpId: any): string;
export function checkUrl(value: any, name: any, rules?: {}): string;
import { decodeProtectedHeader } from "../deps.js";
import { exportSPKI } from "../deps.js";
import { fromBER } from "../deps.js";
export function getEmbeddedJwk(jwsHeader: any, alg: any): Promise<any>;
export function getHostname(urlIn: any): any;
export function hashDigest(o: any, alg: any): Promise<any>;
import { importJWK } from "../deps.js";
import { importSPKI } from "../deps.js";
import { jwtVerify } from "../deps.js";
export namespace pkijs {
    export { setEngine };
    export { CryptoEngine };
    export { PkijsCertificate as Certificate };
    export { CertificateRevocationList };
    export { CertificateChainValidationEngine };
    export { PublicKeyInfo };
}
export function randomValues(n: any): Uint8Array;
export function verifySignature(publicKeyPem: any, expectedSignature: any, data: any, hashName: any): Promise<any>;
export const webcrypto: any;
import { encode } from "../deps.js";
import { decode } from "../deps.js";
import { setEngine } from "../deps.js";
import { CryptoEngine } from "../deps.js";
import { PkijsCertificate } from "../deps.js";
import { CertificateRevocationList } from "../deps.js";
import { CertificateChainValidationEngine } from "../deps.js";
import { PublicKeyInfo } from "../deps.js";
export { decodeProtectedHeader, exportSPKI, fromBER, importJWK, importSPKI, jwtVerify };
