export function ab2str(buf: any): string;
export function abToBuf(ab: any): Buffer;
export function isBase64Url(str: any): boolean;
export function abEqual(a: any, b: any): boolean;
export function isPem(pem: any): boolean;
export function pemToBase64(pem: any): any;
export function identify(o: any, ref: any): string;
export function isPositiveInteger(n: any): boolean;
export function hashDigest(o: any): Promise<any>;
export function randomValues(n: any): Uint8Array;
/**
 * Creates a new Uint8Array based on two different ArrayBuffers
 *
 * @private
 * @param {ArrayBuffers} buffer1 The first buffer.
 * @param {ArrayBuffers} buffer2 The second buffer.
 * @return {ArrayBuffers} The new ArrayBuffer created out of the two.
 */
export function appendBuffer(buffer1: ArrayBuffers, buffer2: ArrayBuffers): ArrayBuffers;
export function coerceToArrayBuffer(buf: any, name: any): ArrayBuffer;
import { base64 } from "./tools/base64/base64.js";
export function coerceToBase64Url(thing: any, name: any): string;
export function coerceToBase64(thing: any, name: any): string;
export { base64 };
