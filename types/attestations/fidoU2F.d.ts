export namespace fidoU2fAttestation {
    export const name: string;
    export { fidoU2fParseFn as parseFn };
    export { fidoU2fValidateFn as validateFn };
}
declare function fidoU2fParseFn(attStmt: any): Map<any, any>;
declare function fidoU2fValidateFn(): Promise<boolean>;
export {};
