export function getPosition(): number;
export function checkedRead(): any;
export function read(): any;
export function setExtractor(extractStrings: any): void;
export function clearSource(): void;
export function addExtension(extension: any): void;
export function roundFloat32(float32Number: any): number;
export class Decoder {
    constructor(options: any);
    mapKey: Map<any, any>;
    decodeKey(key: any): any;
    encodeKey(key: any): any;
    encodeKeys(rec: any): any;
    decodeKeys(map: any): any;
    _mapKey: Map<any, any>;
    mapDecode(source: any, end: any): any;
    decode(source: any, end: any): any;
    decodeMultiple(source: any, forEach: any): any[];
}
export let isNativeAccelerationEnabled: boolean;
export class Tag {
    constructor(value: any, tag: any);
    value: any;
    tag: any;
}
export const typedArrays: string[];
export const mult10: any[];
export function decode(source: any, end: any): any;
export function decodeMultiple(source: any, forEach: any): any[];
export namespace FLOAT32_OPTIONS {
    const NEVER: number;
    const ALWAYS: number;
    const DECIMAL_ROUND: number;
    const DECIMAL_FIT: number;
}
