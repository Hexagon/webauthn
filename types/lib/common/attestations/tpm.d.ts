export namespace tpmAttestation {
    export const name: string;
    export { tpmParseFn as parseFn };
    export { tpmValidateFn as validateFn };
}
declare function tpmParseFn(attStmt: any): Map<any, any>;
declare function tpmValidateFn(): Promise<boolean>;
export {};
