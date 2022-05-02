export function abEqual(b1: any, b2: any): boolean;
export function abToBuf(ab: any): ArrayBufferLike;
export function abToHex(ab: any): any;
export function abToInt(ab: any): number;
export function abToPem(type: any, ab: any): string;
export function abToStr(buf: any): string;
/**
 * Creates a new Uint8Array based on two different ArrayBuffers
 *
 * @private
 * @param {ArrayBuffers} buffer1 The first buffer.
 * @param {ArrayBuffers} buffer2 The second buffer.
 * @return {ArrayBuffers} The new ArrayBuffer created out of the two.
 */
export function appendBuffer(buffer1: ArrayBuffers, buffer2: ArrayBuffers): ArrayBuffers;
export function b64ToJsObject(b64: any, desc: any): any;
export function coerceToArrayBuffer(buf: any, name: any): ArrayBuffer;
export function coerceToBase64(thing: any, name: any): string;
export function coerceToBase64Url(thing: any, name: any): string;
export function isBase64Url(str: any): boolean;
export function isPem(pem: any): boolean;
export function isPositiveInteger(n: any): boolean;
export function jsObjectToB64(obj: any): any;
export function pemToBase64(pem: any): any;
export function strToAb(str: any): ArrayBuffer;
import * as tools from "./toolbox.js";
export { tools };
