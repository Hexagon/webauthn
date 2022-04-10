let globalAttestationMap = new Map();
let globalExtensionMap = new Map();

class WebauthnCommon {
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
	constructor(opts) {
		/* eslint complexity: ["off"] */
		opts = opts || {};

		// set defaults
		this.config = {};

		// timeout
		this.config.timeout = (opts.timeout === undefined) ? 60000 : opts.timeout; // 1 minute
		checkOptType(this.config, "timeout", "number");
		if (!(this.config.timeout >>> 0 === parseFloat(this.config.timeout))) {
			throw new RangeError("timeout should be zero or positive integer");
		}

		// challengeSize
		this.config.challengeSize = opts.challengeSize || 64;
		checkOptType(this.config, "challengeSize", "number");
		if (this.config.challengeSize < 32) {
			throw new RangeError("challenge size too small, must be 32 or greater");
		}

		// rpId
		this.config.rpId = opts.rpId;
		checkOptType(this.config, "rpId", "string");

		// rpName
		this.config.rpName = opts.rpName || "Anonymous Service";
		checkOptType(this.config, "rpName", "string");

		// rpIcon
		this.config.rpIcon = opts.rpIcon;
		checkOptType(this.config, "rpIcon", "string");

		// authenticatorRequireResidentKey
		this.config.authenticatorRequireResidentKey = opts.authenticatorRequireResidentKey;
		checkOptType(this.config, "authenticatorRequireResidentKey", "boolean");

		// authenticatorAttachment
		this.config.authenticatorAttachment = opts.authenticatorAttachment;
		if (this.config.authenticatorAttachment !== undefined &&
            (this.config.authenticatorAttachment !== "platform" &&
            this.config.authenticatorAttachment !== "cross-platform")) {
			throw new TypeError("expected authenticatorAttachment to be 'platform', or 'cross-platform', got: " + this.config.authenticatorAttachment);
		}

		// authenticatorUserVerification
		this.config.authenticatorUserVerification = opts.authenticatorUserVerification;
		if (this.config.authenticatorUserVerification !== undefined &&
            (this.config.authenticatorUserVerification !== "required" &&
            this.config.authenticatorUserVerification !== "preferred" &&
            this.config.authenticatorUserVerification !== "discouraged")) {
			throw new TypeError("expected authenticatorUserVerification to be 'required', 'preferred', or 'discouraged', got: " + this.config.authenticatorUserVerification);
		}

		// attestation
		this.config.attestation = opts.attestation || "direct";
		if (this.config.attestation !== "direct" &&
            this.config.attestation !== "indirect" &&
            this.config.attestation !== "none") {
			throw new TypeError("expected attestation to be 'direct', 'indirect', or 'none', got: " + this.config.attestation);
		}

		// cryptoParams
		this.config.cryptoParams = opts.cryptoParams || [-7, -257];
		checkOptType(this.config, "cryptoParams", Array);
		if (this.config.cryptoParams.length < 1) {
			throw new TypeError("cryptoParams must have at least one element");
		}
		this.config.cryptoParams.forEach((param) => {
			checkOptType({ cryptoParam: param }, "cryptoParam", "number");
		});

		this.attestationMap = globalAttestationMap;
		this.extSet = new Set(); // enabled extensions (all disabled by default)
		this.extOptMap = new Map(); // default options for extensions

		// TODO: convert icon file to data-URL icon
		// TODO: userVerification
	}

	/**
     * Adds a new global extension that will be available to all instantiations of
     * {@link Webauthn}. Note that the extension must still be enabled by calling
     * {@link enableExtension} for each instantiation of a Fido2Lib.
     * @param {String} extName     The name of the extension to add. (e.g. - "appid")
     * @param {Function} optionGeneratorFn Extensions are included in
     * @param {Function} resultParserFn    [description]
     * @param {Function} resultValidatorFn [description]
     */
	static addExtension(extName, optionGeneratorFn, resultParserFn, resultValidatorFn) {
		if (typeof extName !== "string") {
			throw new Error("expected 'extName' to be String, got: " + extName);
		}

		if (globalExtensionMap.has(extName)) {
			throw new Error(`the extension '${extName}' has already been added`);
		}

		if (typeof optionGeneratorFn !== "function") {
			throw new Error("expected 'optionGeneratorFn' to be a Function, got: " + optionGeneratorFn);
		}

		if (typeof resultParserFn !== "function") {
			throw new Error("expected 'resultParserFn' to be a Function, got: " + resultParserFn);
		}

		if (typeof resultValidatorFn !== "function") {
			throw new Error("expected 'resultValidatorFn' to be a Function, got: " + resultValidatorFn);
		}

		globalExtensionMap.set(extName, {
			optionGeneratorFn,
			resultParserFn,
			resultValidatorFn,
		});
	}

	/**
     * Removes all extensions from the global extension registry. Mostly used for testing.
     */
	static deleteAllExtensions() {
		globalExtensionMap.clear();
	}


	/**
     * Generates the options to send to the client for the specified extension
     * @private
     * @param  {String} extName The name of the extension to generate options for. Must be a valid extension that has been registered through {@link Fido2Lib#addExtension}
     * @param  {String} type    The type of options that are being generated. Valid options are "attestation" or "assertion".
     * @param  {Any} [options] Optional parameters to pass to the generator function
     * @return {Any}         The extension value that will be sent to the client. If `undefined`, this extension won't be included in the
     * options sent to the client.
     */
	generateExtensionOptions(extName, type, options) {
		if (typeof extName !== "string") {
			throw new Error("expected 'extName' to be String, got: " + extName);
		}

		if (type !== "attestation" && type !== "assertion") {
			throw new Error("expected 'type' to be 'attestation' or 'assertion', got: " + type);
		}

		let ext = globalExtensionMap.get(extName);
		if (typeof ext !== "object" ||
            typeof ext.optionGeneratorFn !== "function") {
			throw new Error(`valid extension for '${extName}' not found`);
		}
		let ret = ext.optionGeneratorFn(extName, type, options);

		return ret;
	}

	static parseExtensionResult(extName, clientThing, authnrThing) {
		if (typeof extName !== "string") {
			throw new Error("expected 'extName' to be String, got: " + extName);
		}

		let ext = globalExtensionMap.get(extName);
		if (typeof ext !== "object" ||
            typeof ext.parseFn !== "function") {
			throw new Error(`valid extension for '${extName}' not found`);
		}
		let ret = ext.parseFn(extName, clientThing, authnrThing);

		return ret;
	}

	static validateExtensionResult(extName) {
		let ext = globalExtensionMap.get(extName);
		if (typeof ext !== "object" ||
            typeof ext.validateFn !== "function") {
			throw new Error(`valid extension for '${extName}' not found`);
		}
		let ret = ext.validateFn.call(this);

		return ret;
	}

	/**
     * Enables the specified extension.
     * @param  {String} extName The name of the extension to enable. Must be a valid extension that has been registered through {@link Fido2Lib#addExtension}
     */
	enableExtension(extName) {
		if (typeof extName !== "string") {
			throw new Error("expected 'extName' to be String, got: " + extName);
		}

		if (!globalExtensionMap.has(extName)) {
			throw new Error(`valid extension for '${extName}' not found`);
		}

		this.extSet.add(extName);
	}

	/**
     * Disables the specified extension.
     * @param  {String} extName The name of the extension to enable. Must be a valid extension that has been registered through {@link Fido2Lib#addExtension}
     */
	disableExtension(extName) {
		if (typeof extName !== "string") {
			throw new Error("expected 'extName' to be String, got: " + extName);
		}

		if (!globalExtensionMap.has(extName)) {
			throw new Error(`valid extension for '${extName}' not found`);
		}

		this.extSet.delete(extName);
	}

	/**
     * Specifies the options to be used for the extension
     * @param  {String} extName The name of the extension to set the options for (e.g. - "appid". Must be a valid extension that has been registered through {@link Fido2Lib#addExtension}
     * @param {Any} options The parameter that will be passed to the option generator function (e.g. - "https://webauthn.org")
     */
	setExtensionOptions(extName, options) {
		if (typeof extName !== "string") {
			throw new Error("expected 'extName' to be String, got: " + extName);
		}

		if (!globalExtensionMap.has(extName)) {
			throw new Error(`valid extension for '${extName}' not found`);
		}

		this.extOptMap.set(extName, options);
	}


	/**
     * Validates an attestation response. Will be called within the context (`this`) of a {@link Fido2AttestationResult}
     * @private
     */
	static async validateAttestation() {
		let fmt = this.authnrData.get("fmt");

		// validate input
		if (typeof fmt !== "string") {
			throw new TypeError("expected 'fmt' to be string, got: " + typeof fmt);
		}

		// get from attestationMap
		let fmtObj = globalAttestationMap.get(fmt);
		if (typeof fmtObj !== "object" ||
            typeof fmtObj.parseFn !== "function" ||
            typeof fmtObj.validateFn !== "function") {
			throw new Error(`no support for attestation format: ${fmt}`);
		}

		// call fn
		let ret = await fmtObj.validateFn.call(this);

		// validate return
		if (ret !== true) {
			throw new Error(`${fmt} validateFn did not return 'true'`);
		}

		// return result
		return ret;
	}


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
	static addAttestationFormat(fmt, parseFn, validateFn) {
		// validate input
		if (typeof fmt !== "string") {
			throw new TypeError("expected 'fmt' to be string, got: " + typeof fmt);
		}

		if (typeof parseFn !== "function") {
			throw new TypeError("expected 'parseFn' to be string, got: " + typeof parseFn);
		}

		if (typeof validateFn !== "function") {
			throw new TypeError("expected 'validateFn' to be string, got: " + typeof validateFn);
		}

		if (globalAttestationMap.has(fmt)) {
			throw new Error(`can't add format: '${fmt}' already exists`);
		}

		// add to attestationMap
		globalAttestationMap.set(fmt, {
			parseFn,
			validateFn,
		});

		return true;
	}

	/**
     * Deletes all currently registered attestation formats.
     */
	static deleteAllAttestationFormats() {
		globalAttestationMap.clear();
	}

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
	static parseAttestation(fmt, attStmt) {
		// validate input
		if (typeof fmt !== "string") {
			throw new TypeError("expected 'fmt' to be string, got: " + typeof fmt);
		}

		if (typeof attStmt !== "object") {
			throw new TypeError("expected 'attStmt' to be object, got: " + typeof attStmt);
		}

		// get from attestationMap
		let fmtObj = globalAttestationMap.get(fmt);
		if (typeof fmtObj !== "object" ||
            typeof fmtObj.parseFn !== "function" ||
            typeof fmtObj.validateFn !== "function") {
			throw new Error(`no support for attestation format: ${fmt}`);
		}

		// call fn
		let ret = fmtObj.parseFn.call(this, attStmt);

		// validate return
		if (!(ret instanceof Map)) {
			throw new Error(`${fmt} parseFn did not return a Map`);
		}

		// return result
		return new Map([
			["fmt", fmt],
			...ret,
		]);
	}
}

function checkOptType(opts, prop, type) {
	if (typeof opts !== "object") return;

	// undefined
	if (opts[prop] === undefined) return;

	// native type
	if (typeof type === "string") {
		if (typeof opts[prop] !== type) {
			throw new TypeError(`expected ${prop} to be ${type}, got: ${opts[prop]}`);
		}
	}

	// class type
	if (typeof type === "function") {
		if (!(opts[prop] instanceof type)) {
			throw new TypeError(`expected ${prop} to be ${type.name}, got: ${opts[prop]}`);
		}
	}
}

function setOpt(obj, prop, val) {
	if (val !== undefined) {
		obj[prop] = val;
	}
}

function factorToFlags(expectedFactor, flags) {
	// var flags = ["AT"];
	flags = flags || [];

	switch (expectedFactor) {
	case "first":
		flags.push("UP");
		flags.push("UV");
		break;
	case "second":
		flags.push("UP");
		break;
	case "either":
		flags.push("UP-or-UV");
		break;
	default:
		throw new TypeError("expectedFactor should be 'first', 'second' or 'either'");
	}

	return flags;
}

function createExtensions(type, extObj) {
	/* eslint-disable no-invalid-this */
	let extensions = {};

	// default extensions
	let enabledExtensions = this.extSet;
	let extensionsOptions = this.extOptMap;

	// passed in extensions
	if (typeof extObj === "object") {
		enabledExtensions = new Set(Object.keys(extObj));
		extensionsOptions = new Map();
		for (let key of Object.keys(extObj)) {
			extensionsOptions.set(key, extObj[key]);
		}
	}

	// generate extension values
	for (let extension of enabledExtensions) {
		let extVal = this.generateExtensionOptions(extension, type, extensionsOptions.get(extension));
		if (extVal !== undefined) extensions[extension] = extVal;
	}

	return extensions;
}

export {
	WebauthnCommon,
	setOpt,
	factorToFlags,
	createExtensions
};