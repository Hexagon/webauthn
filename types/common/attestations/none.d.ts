export namespace noneAttestation {
    export const name: string;
    export { noneParseFn as parseFn };
    export { noneValidateFn as validateFn };
}
declare function noneParseFn(attStmt: any): Map<any, any>;
declare function noneValidateFn(): Promise<boolean>;
export {};
