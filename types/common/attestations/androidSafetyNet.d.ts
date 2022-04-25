export namespace androidSafetyNetAttestation {
    export const name: string;
    export { androidSafetyNetParseFn as parseFn };
    export { androidSafetyNetValidateFn as validateFn };
}
declare function androidSafetyNetParseFn(attStmt: any): Map<any, any>;
declare function androidSafetyNetValidateFn(): Promise<boolean>;
export {};
