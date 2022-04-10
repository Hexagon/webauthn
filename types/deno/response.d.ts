/**
 * The base class of {@link Fido2AttestationResult} and {@link Fido2AssertionResult}
 * @property {Map} authnrData Authenticator data that was parsed and validated
 * @property {Map} clientData Client data that was parsed and validated
 * @property {Map} expectations The expectations that were used to validate the result
 * @property {Object} request The request that was validated
 * @property {Map} audit A collection of audit information, such as useful warnings and information. May be useful for risk engines or for debugging.
 * @property {Boolean} audit.validExpectations Whether the expectations that were provided were complete and valid
 * @property {Boolean} audit.validRequest Whether the request message was complete and valid
 * @property {Boolean} audit.complete Whether all fields in the result have been validated
 * @property {Set} audit.journal A list of the fields that were validated
 * @property {Map} audit.warning A set of warnings that were generated while validating the result
 * @property {Map} audit.info A set of informational fields that were generated while validating the result. Includes any x509 extensions of the attestation certificate during registration, and whether the key supports a rollback counter during authentication.
 */
export class Fido2Result {
    constructor(sym: any);
    parse(): void;
    clientData: any;
    validate(): Promise<void>;
    create(req: any, exp: any): Promise<Fido2Result>;
    expectations: Map<any, any>;
    request: any;
}
/**
 * A validated attesetation result
 * @extends {Fido2Result}
 */
export class Fido2AttestationResult extends Fido2Result {
    static create(req: any, exp: any): Promise<Fido2AttestationResult>;
    requiredExpectations: Set<string>;
    optionalExpectations: Set<string>;
    parse(): Promise<void>;
    authnrData: any;
}
/**
 * A validated assertion result
 * @extends {Fido2Result}
 */
export class Fido2AssertionResult extends Fido2Result {
    static create(req: any, exp: any): Promise<Fido2AssertionResult>;
    requiredExpectations: Set<string>;
    optionalExpectations: Set<string>;
    parse(): Promise<void>;
    authnrData: Map<any, any>;
}
