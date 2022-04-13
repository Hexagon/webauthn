export function ab2str(buf: any): string;
export function abToBuf(ab: any): ArrayBufferLike;
export function isBase64Url(str: any): boolean;
export function abEqual(a: any, b: any): boolean;
export function isPem(pem: any): boolean;
export function isPositiveInteger(n: any): boolean;
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
import * as cbor from "../common/tools/cbor/decode.js";
import { coseToJwk } from "../common/tools/cose-to-jwk/cose-to-jwk.js";
export function arrayBufferEquals(b1: any, b2: any): boolean;
export { base64, cbor, coseToJwk };
