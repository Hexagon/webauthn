export namespace packedAttestation {
    export const name: string;
    export { packedParseFn as parseFn };
    export { packedValidateFn as validateFn };
}
declare function packedParseFn(attStmt: any): Map<any, any>;
declare function packedValidateFn(): any;
export {};
