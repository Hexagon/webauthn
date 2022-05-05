export { Key } from "./keyUtils.js";
export { attach } from "./validator.js";
export class Webauthn {
    static utils: typeof utils;
    /**
     * Creates a new {@link MdsCollection}
     * @param {String} collectionName The name of the collection to create.
     * Used to identify the source of a {@link MdsEntry} when {@link Fido2Lib#findMdsEntry}
     * finds multiple matching entries from different sources (e.g. FIDO MDS 1 & FIDO MDS 2)
     * @return {MdsCollection} The MdsCollection that was created
     * @see  MdsCollection
     */
    static createMdsCollection(collectionName: string): MdsCollection;
    /**
     * Adds a new {@link MdsCollection} to the global MDS collection list that will be used for {@link findMdsEntry}
     * @param {MdsCollection} mdsCollection The MDS collection that will be used
     * @see  MdsCollection
     */
    static addMdsCollection(mdsCollection: MdsCollection): Promise<void>;
    /**
     * Removes all entries from the global MDS collections list. Mostly used for testing.
     */
    static clearMdsCollections(): void;
    /**
     * Returns {@link MdsEntry} objects that match the requested id. The
     * lookup is done by calling {@link MdsCollection#findEntry} on the current global
     * MDS collection. If no global MDS collection has been specified using
     * {@link setMdsCollection}, an `Error` will be thrown.
     * @param  {String|ArrayBuffer} id The authenticator id to look up metadata for
     * @return {Array.<MdsEntry>}    Returns an Array of {@link MdsEntry} for the specified id.
     * If no entry was found, the Array will be empty.
     * @see  MdsCollection
     */
    static findMdsEntry(id: string | ArrayBuffer): Array<MdsEntry>;
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
    /**
     * Parses and validates an attestation response from the client
     * @param {Object} res The assertion result that was generated by the client.
     * See {@link https://w3.org/TR/webauthn/#authenticatorattestationresponse AuthenticatorAttestationResponse} in the WebAuthn spec.
     * @param {String} [res.id] The base64url encoded id returned by the client
     * @param {String} [res.rawId] The base64url encoded rawId returned by the client. If `res.rawId` is missing, `res.id` will be used instead. If both are missing an error will be thrown.
     * @param {String} res.response.clientDataJSON The base64url encoded clientDataJSON returned by the client
     * @param {String} res.response.authenticatorData The base64url encoded authenticatorData returned by the client
     * @param {Object} expected The expected parameters for the assertion response.
     * If these parameters don't match the recieved values, validation will fail and an error will be thrown.
     * @param {String} expected.challenge The base64url encoded challenge that was sent to the client, as generated by [assertionOptions]{@link Fido2Lib#assertionOptions}
     * @param {String} expected.origin The expected origin that the authenticator has signed over. For example, "https://localhost:8443" or "https://webauthn.org"
     * @param {String} expected.factor Which factor is expected for the assertion. Valid values are "first", "second", or "either".
     * If "first", this requires that the authenticator performed user verification (e.g. - biometric authentication, PIN authentication, etc.).
     * If "second", this requires that the authenticator performed user presence (e.g. - user pressed a button).
     * If "either", then either "first" or "second" is acceptable
     * @return {Promise<Fido2AttestationResult>} Returns a Promise that resolves to a {@link Fido2AttestationResult}
     * @throws {Error} If parsing or validation fails
     */
    attestationResult(res: {
        id?: string;
        rawId?: string;
    }, expected: {
        challenge: string;
        origin: string;
        factor: string;
    }): Promise<Fido2AttestationResult>;
    /**
     * Parses and validates an assertion response from the client
     * @param {Object} res The assertion result that was generated by the client.
     * See {@link https://w3.org/TR/webauthn/#authenticatorassertionresponse AuthenticatorAssertionResponse} in the WebAuthn spec.
     * @param {String} [res.id] The base64url encoded id returned by the client
     * @param {String} [res.rawId] The base64url encoded rawId returned by the client. If `res.rawId` is missing, `res.id` will be used instead. If both are missing an error will be thrown.
     * @param {String} res.response.clientDataJSON The base64url encoded clientDataJSON returned by the client
     * @param {String} res.response.attestationObject The base64url encoded authenticatorData returned by the client
     * @param {String} res.response.signature The base64url encoded signature returned by the client
     * @param {String|null} [res.response.userHandle] The base64url encoded userHandle returned by the client. May be null or an empty string.
     * @param {Object} expected The expected parameters for the assertion response.
     * If these parameters don't match the recieved values, validation will fail and an error will be thrown.
     * @param {String} expected.challenge The base64url encoded challenge that was sent to the client, as generated by [assertionOptions]{@link Fido2Lib#assertionOptions}
     * @param {String} expected.origin The expected origin that the authenticator has signed over. For example, "https://localhost:8443" or "https://webauthn.org"
     * @param {String} expected.factor Which factor is expected for the assertion. Valid values are "first", "second", or "either".
     * If "first", this requires that the authenticator performed user verification (e.g. - biometric authentication, PIN authentication, etc.).
     * If "second", this requires that the authenticator performed user presence (e.g. - user pressed a button).
     * If "either", then either "first" or "second" is acceptable
     * @param {String} expected.publicKey A PEM encoded public key that will be used to validate the assertion response signature.
     * This is the public key that was returned for this user during [attestationResult]{@link Fido2Lib#attestationResult}
     * @param {Number} expected.prevCounter The previous value of the signature counter for this authenticator.
     * @param {String|null} expected.userHandle The expected userHandle, which was the user.id during registration
     * @return {Promise<Fido2AssertionResult>} Returns a Promise that resolves to a {@link Fido2AssertionResult}
     * @throws {Error} If parsing or validation fails
     */
    assertionResult(res: {
        id?: string;
        rawId?: string;
    }, expected: {
        challenge: string;
        origin: string;
        factor: string;
        publicKey: string;
        prevCounter: number;
        userHandle: string | null;
    }): Promise<Fido2AssertionResult>;
    /**
     * Gets a challenge and any other parameters for the `navigator.credentials.create()` call
     * The `challenge` property is an `ArrayBuffer` and will need to be encoded to be transmitted to the client.
     * @param {Object} [opts] An object containing various options for the option creation
     * @param {Object} [opts.extensionOptions] An object that contains the extensions to enable, and the options to use for each of them.
     * The keys of this object are the names of the extensions (e.g. - "appid"), and the value of each key is the option that will
     * be passed to that extension when it is generating the value to send to the client. This object overrides the extensions that
     * have been set with {@link enableExtension} and the options that have been set with {@link setExtensionOptions}. If an extension
     * was enabled with {@link enableExtension} but it isn't included in this object, the extension won't be sent to the client. Likewise,
     * if an extension was disabled with {@link disableExtension} but it is included in this object, it will be sent to the client.
     * @param {String} [extraData] Extra data to be signed by the authenticator during attestation. The challenge will be a hash:
     * SHA256(rawChallenge + extraData) and the `rawChallenge` will be returned as part of PublicKeyCredentialCreationOptions.
     * @returns {Promise<PublicKeyCredentialCreationOptions>} The options for creating calling `navigator.credentials.create()`
     */
    attestationOptions(opts?: {
        extensionOptions?: any;
    }): Promise<any>;
    /**
     * Creates an assertion challenge and any other parameters for the `navigator.credentials.get()` call.
     * The `challenge` property is an `ArrayBuffer` and will need to be encoded to be transmitted to the client.
     * @param {Object} [opts] An object containing various options for the option creation
     * @param {Object} [opts.extensionOptions] An object that contains the extensions to enable, and the options to use for each of them.
     * The keys of this object are the names of the extensions (e.g. - "appid"), and the value of each key is the option that will
     * be passed to that extension when it is generating the value to send to the client. This object overrides the extensions that
     * have been set with {@link enableExtension} and the options that have been set with {@link setExtensionOptions}. If an extension
     * was enabled with {@link enableExtension} but it isn't included in this object, the extension won't be sent to the client. Likewise,
     * if an extension was disabled with {@link disableExtension} but it is included in this object, it will be sent to the client.
     * @param {String} [extraData] Extra data to be signed by the authenticator during attestation. The challenge will be a hash:
     * SHA256(rawChallenge + extraData) and the `rawChallenge` will be returned as part of PublicKeyCredentialCreationOptions.
     * @returns {Promise<PublicKeyCredentialRequestOptions>} The options to be passed to `navigator.credentials.get()`
     */
    assertionOptions(opts?: {
        extensionOptions?: any;
    }): Promise<any>;
}
import { Fido2AssertionResult } from "./response.js";
import { Fido2AttestationResult } from "./response.js";
import { Fido2Result } from "./response.js";
import { MdsCollection } from "./mds.js";
import { MdsEntry } from "./mds.js";
import { androidSafetyNetAttestation } from "./attestations/androidSafetyNet.js";
import { fidoU2fAttestation } from "./attestations/fidoU2F.js";
import { noneAttestation } from "./attestations/none.js";
import { packedAttestation } from "./attestations/packed.js";
import { tpmAttestation } from "./attestations/tpm.js";
import * as utils from "./utils.js";
export { Fido2AssertionResult, Fido2AttestationResult, Fido2Result, MdsCollection, MdsEntry, androidSafetyNetAttestation, fidoU2fAttestation, noneAttestation, packedAttestation, tpmAttestation };
export { abEqual, abToBuf, abToHex, appendBuffer, coerceToArrayBuffer, coerceToBase64, coerceToBase64Url, isBase64Url, isPem, jsObjectToB64, pemToBase64, strToAb, tools } from "./utils.js";
export { parseAttestationObject, parseAuthenticatorData, parseAuthnrAssertionResponse, parseAuthnrAttestationResponse, parseClientResponse, parseExpectations } from "./parser.js";
export { Certificate, CertManager, CRL, helpers } from "./certUtils.js";
