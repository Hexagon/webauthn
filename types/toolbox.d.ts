export namespace cbor {
    export { encode };
    export { decode };
}
export function checkDomainOrUrl(value: any, name: any, rules?: {}): string;
export function checkOrigin(str: any): string;
export function checkRpId(rpId: any): string;
export function checkUrl(value: any, name: any, rules?: {}): string;
import { decodeProtectedHeader } from "jose";
import { exportSPKI } from "jose";
import { fromBER } from "asn1js";
export function getEmbeddedJwk(jwsHeader: any, alg: any): Promise<any>;
export function getHostname(urlIn: any): string;
export function hashDigest(o: any, alg: any): Promise<any>;
import { importJWK } from "jose";
import { importSPKI } from "jose";
import { jwtVerify } from "jose";
export namespace pkijs {
    export { setEngine };
    export { CryptoEngine };
    export { PkijsCertificate as Certificate };
    export { CertificateRevocationList };
    export { CertificateChainValidationEngine };
    export { PublicKeyInfo };
}
export function randomValues(n: any): Uint8Array;
export function verifySignature(publicKey: any, expectedSignature: any, data: any, hashName: any): Promise<any>;
export const webcrypto: any;
import { encode } from "cbor-x";
import { decode } from "cbor-x";
export { base64, decodeProtectedHeader, exportSPKI, fromBER, importJWK, importSPKI, jwtVerify };
