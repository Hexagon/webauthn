/**
 * A class for managing, validating, and finding metadata that describes authenticators
 *
 * This class does not do any of the downloading of the TOC or any of the entries in the TOC,
 * but assumes that you can download the data and pass it to this class. This allows for cleverness
 * and flexibility in how, when, and what is downloaded -- while at the same time allowing this class
 * to take care of the not-so-fun parts of validating signatures, hashes, certificat chains, and certificate
 * revocation lists.
 *
 * Typically this will be created through {@link Fido2Lib#createMdsCollection} and then set as the global
 * MDS collection via {@link Fido2Lib#setMdsCollection}
 *
 * @example
 * var mc = Fido2Lib.createMdsCollection()
 * // download TOC from https://mds.fidoalliance.org ...
 * var tocObj = await mc.addToc(tocBase64);
 * tocObj.entries.forEach((entry) => {
 *     // download entry.url ...
 *     mc.addEntry(entryBase64);
 * });
 * Fido2Lib.setMdsCollection(mc); // performs validation
 * var entry = Fido2Lib.findEntry("4e4e#4005");
 */
export class MdsCollection {
    /**
     * Creates a new MdsCollection
     * @return {MdsCollection} The MDS collection that was created. The freshly created MDS collection has
     * no Table of Contents (TOC) or entries, which must be added through {@link addToc} and {@link addEntry}, respectively.
     */
    constructor(collectionName: any);
    toc: any;
    unvalidatedEntryList: Map<any, any>;
    entryList: Map<any, any>;
    validated: boolean;
    name: string;
    /**
     * Validates and stores the Table of Contents (TOC) for future reference. This method validates
     * the TOC JSON Web Token (JWT) signature, as well as the certificate chain. The certiciate chain
     * is validated using the `rootCert` and `crls` that are provided.
     * @param {String} tocStr   The base64url encoded Table of Contents, as described in the [FIDO Metadata Service specification]{@link https://fidoalliance.org/specs/fido-v2.0-id-20180227/fido-metadata-service-v2.0-id-20180227.html}
     * @param {Array.<String>|Array.<ArrayBuffer>|String|ArrayBuffer|undefined} rootCert One or more root certificates that serve as a trust anchor for the Metadata Service.
     * Certificate format is flexible, and can be a PEM string, a base64 encoded string, or an ArrayBuffer, provieded that each of those formats can be decoded to valid ASN.1
     * If the `rootCert` is `undefined`, then the default [FIDO MDS root certificate](https://mds.fidoalliance.org/Root.cer) will be used.
     * @param {Array.<String>|Array.<ArrayBuffer>} crls     An array of Certificate Revocation Lists (CRLs) that should be used when validating
     * the certificate chain. Like `rootCert` the format of the CRLs is flexible and can be PEM encoded, base64 encoded, or an ArrayBuffer
     * provied that the CRL contains valid ASN.1 encoding.
     * @returns {Promise.<Object>} Returns a Promise that resolves to a TOC object, or that rejects with an error.
     */
    addToc(tocStr: string, rootCert: Array<string> | Array<ArrayBuffer> | string | ArrayBuffer | undefined, crls: Array<string> | Array<ArrayBuffer>): Promise<any>;
    /**
     * Returns the parsed and validated Table of Contents object from {@link getToc}
     * @return {Object|null} Returns the TOC if one has been provided to {@link getToc}
     * or `null` if no TOC has been provided yet.
     */
    getToc(): any | null;
    /**
     * Parses and adds a new MDS entry to the collection. The entry will not be available
     * through {@link findEntry} until {@link validate} has been called
     * @param {String} entryStr The base64url encoded entry, most likely downloaded from
     * the URL that was found in the Table of Contents (TOC)
     */
    addEntry(entryStr: string): void;
    /**
     * Validates all entries that have been added. Note that {@link MdsCollection#findEntry}
     * will not find an {@link MdsEntry} until it has been validated.
     * @throws {Error} If a validation error occurs
     * @returns {Promise} Returns a Promise
     */
    validate(): Promise<any>;
    /**
     * Looks up an entry by AAID, AAGUID, or attestationCertificateKeyIdentifiers.
     * Only entries that have been validated will be found.
     * @param  {String|ArrayBuffer} id The AAID, AAGUID, or attestationCertificateKeyIdentifiers of the entry to find
     * @return {MdsEntry|null}    The MDS entry that was found, or null if no entry was found.
     */
    findEntry(id: string | ArrayBuffer): MdsEntry | null;
}
/**
 * Holds a single MDS entry that provides the metadata for an authenticator. Contains
 * both the TOC data (such as `statusReports` and `url`) as well as all the metadata
 * statment data. All the metadata has been converted from the integers found in the
 * [FIDORegistry](https://fidoalliance.org/specs/fido-v2.0-id-20180227/fido-registry-v2.0-id-20180227.html)
 * and [FIDO UAF Registry](https://fidoalliance.org/specs/fido-uaf-v1.2-rd-20171128/fido-uaf-reg-v1.2-rd-20171128.html)
 * have been converted to more friendly values. The following values are converted:
 * * attachmentHint - converted to Array of Strings
 * * attestationTypes - converted to Array of Strings
 * * authenticationAlgorithm - converted to String
 * * keyProtection - converted to Array of Strings
 * * matcherProtection - converted to Array of Strings
 * * publicKeyAlgAndEncoding - converted to String
 * * tcDisplay - converted to Array of Strings
 * * userVerificationDetails - converted to Array of Array of {@link UserVerificationDesc}
 *
 * See the [FIDO Metadata Specification]{@link https://fidoalliance.org/specs/fido-v2.0-id-20180227/fido-metadata-statement-v2.0-id-20180227.html}
 * for a description of each of the properties of this class.
 */
export class MdsEntry {
    /**
     * Creates a new MDS entry. It is assumed that the entry has already been validated.
     * The typical way of creating new MdsEntry objects is via the {@link MdsCollection#addEntry} and {@link MdsCollection#validate}
     * methods, which will take care of parsing and validing the MDS entry for you.
     * @param  {Object} mdsEntry The parsed and validated metadata statement Object for this entry
     * @param  {Object} tocEntry The parsed and validated TOC information Object for this entry
     * @return {mdsEntry}          The properly formatted MDS entry
     */
    constructor(mdsEntry: any, tocEntry: any);
    attachmentHint: string[];
    attestationTypes: any;
    authenticationAlgorithm: string;
    keyProtection: string[];
    matcherProtection: string[];
    publicKeyAlgAndEncoding: string;
    tcDisplay: string[];
    userVerificationDetails: any[];
    protocolFamily: string;
}
