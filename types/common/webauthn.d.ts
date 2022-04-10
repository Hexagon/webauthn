export class WebauthnCommon {
    /**
     * Adds a new global extension that will be available to all instantiations of
     * {@link Webauthn}. Note that the extension must still be enabled by calling
     * {@link enableExtension} for each instantiation of a Fido2Lib.
     * @param {String} extName     The name of the extension to add. (e.g. - "appid")
     * @param {Function} optionGeneratorFn Extensions are included in
     * @param {Function} resultParserFn    [description]
     * @param {Function} resultValidatorFn [description]
     */
    static addExtension(extName: string, optionGeneratorFn: Function, resultParserFn: Function, resultValidatorFn: Function): void;
    /**
     * Removes all extensions from the global extension registry. Mostly used for testing.
     */
    static deleteAllExtensions(): void;
    static parseExtensionResult(extName: any, clientThing: any, authnrThing: any): any;
    static validateExtensionResult(extName: any): any;
    /**
     * Validates an attestation response. Will be called within the context (`this`) of a {@link Fido2AttestationResult}
     * @private
     */
    private static validateAttestation;
    /**
     * Adds a new attestation format that will automatically be recognized and parsed
     * for any future {@link Fido2CreateRequest} messages
     * @param {String} fmt The name of the attestation format, as it appears in the
     * ARIN registry and / or as it will appear in the {@link Fido2CreateRequest}
     * message that is received
     * @param {Function} parseFn The function that will be called to parse the
     * attestation format. It will receive the `attStmt` as a parameter and will be
     * called from the context (`this`) of the `Fido2CreateRequest`
     * @param {Function} validateFn The function that will be called to validate the
     * attestation format. It will receive no arguments, as all the necessary
     * information for validating the attestation statement will be contained in the
     * calling context (`this`).
     */
    static addAttestationFormat(fmt: string, parseFn: Function, validateFn: Function): boolean;
    /**
     * Deletes all currently registered attestation formats.
     */
    static deleteAllAttestationFormats(): void;
    /**
     * Parses an attestation statememnt of the format specified
     * @private
     * @param {String} fmt The name of the format to be parsed, as specified in the
     * ARIN registry of attestation formats.
     * @param {Object} attStmt The attestation object to be parsed.
     * @return {Map} A Map of all the attestation fields that were parsed.
     * At this point the fields have not yet been verified.
     * @throws {Error} when a field cannot be parsed or verified.
     * @throws {TypeError} when supplied parameters `fmt` or `attStmt` are of the
     * wrong type
     */
    private static parseAttestation;
    /**
    * Creates a FIDO2 server class
    * @param {Object} opts Options for the server
    * @param {Number} [opts.timeout=60000] The amount of time to wait, in milliseconds, before a call has timed out
    * @param {String} [opts.rpId="localhost"] The name of the server
    * @param {String} [opts.rpName="Anonymous Service"] The name of the server
    * @param {String} [opts.rpIcon] A URL for the service's icon. Can be a [RFC 2397]{@link https://tools.ietf.org/html/rfc2397} data URL.
    * @param {Number} [opts.challengeSize=64] The number of bytes to use for the challenge
    * @param {Object} [opts.authenticatorSelectionCriteria] An object describing what types of authenticators are allowed to register with the service.
    * See [AuthenticatorSelectionCriteria]{@link https://w3.org/TR/webauthn/#authenticatorSelection} in the WebAuthn spec for details.
    * @param {String} [opts.authenticatorAttachment] Indicates whether authenticators should be part of the OS ("platform"), or can be roaming authenticators ("cross-platform")
    * @param {Boolean} [opts.authenticatorRequireResidentKey] Indicates whether authenticators must store the key internally (true) or if they can use a KDF to generate keys
    * @param {String} [opts.authenticatorUserVerification] Indicates whether user verification should be performed. Options are "required", "preferred", or "discouraged".
    * @param {String} [opts.attestation="direct"] The preferred attestation type to be used.
    * See [AttestationConveyancePreference]{https://w3.org/TR/webauthn/#enumdef-attestationconveyancepreference} in the WebAuthn spec
    * @param {Array<Number>} [opts.cryptoParams] A list of COSE algorithm identifiers (e.g. -7)
    * ordered by the preference in which the authenticator should use them.
    */
    constructor(opts: {
        timeout?: number;
        rpId?: string;
        rpName?: string;
        rpIcon?: string;
        challengeSize?: number;
        authenticatorSelectionCriteria?: any;
        authenticatorAttachment?: string;
        authenticatorRequireResidentKey?: boolean;
        authenticatorUserVerification?: string;
        attestation?: string;
        cryptoParams?: Array<number>;
    });
    config: {};
    attestationMap: Map<any, any>;
    extSet: Set<any>;
    extOptMap: Map<any, any>;
    /**
     * Generates the options to send to the client for the specified extension
     * @private
     * @param  {String} extName The name of the extension to generate options for. Must be a valid extension that has been registered through {@link Fido2Lib#addExtension}
     * @param  {String} type    The type of options that are being generated. Valid options are "attestation" or "assertion".
     * @param  {Any} [options] Optional parameters to pass to the generator function
     * @return {Any}         The extension value that will be sent to the client. If `undefined`, this extension won't be included in the
     * options sent to the client.
     */
    private generateExtensionOptions;
    /**
     * Enables the specified extension.
     * @param  {String} extName The name of the extension to enable. Must be a valid extension that has been registered through {@link Fido2Lib#addExtension}
     */
    enableExtension(extName: string): void;
    /**
     * Disables the specified extension.
     * @param  {String} extName The name of the extension to enable. Must be a valid extension that has been registered through {@link Fido2Lib#addExtension}
     */
    disableExtension(extName: string): void;
    /**
     * Specifies the options to be used for the extension
     * @param  {String} extName The name of the extension to set the options for (e.g. - "appid". Must be a valid extension that has been registered through {@link Fido2Lib#addExtension}
     * @param {Any} options The parameter that will be passed to the option generator function (e.g. - "https://webauthn.org")
     */
    setExtensionOptions(extName: string, options: Any): void;
}
export function setOpt(obj: any, prop: any, val: any): void;
export function factorToFlags(expectedFactor: any, flags: any): any;
export function createExtensions(type: any, extObj: any): {};
