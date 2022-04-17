// Testing lib
import { test } from "uvu";
import * as assert from "uvu/assert";


// Helpers
import { ToolBoxRegistration } from "../../../src/node/toolbox.js";
ToolBoxRegistration.registerAsGlobal();

import { arrayBufferEquals } from "../../../src/common/utils.js";
import * as h from "../../helpers/fido2-helpers.js";

import {
	Certificate,
	CertManager,
	CRL,
	helpers as certHelpers,
} from "../../../src/common/certUtils.js";


const testCertUtils = function () {
	test("Certificate is function", async () => {
		assert.equal(typeof Certificate, "function");
	});
	test("Certificate constructor can create new cert", async () => {
		let cert = new Certificate(h.certs.yubicoRoot);
		assert.equal(cert instanceof Certificate, true);
		assert.equal(typeof cert._cert, "object");
	});
	test("Certificate constructor throws if no arg to constructor", function() {
		assert.throws(() => {
			new Certificate();
		}, TypeError, "could not coerce 'certificate' to ArrayBuffer");
	});
	test("Certificate constructor throws if constructor arg can't be coerced to ArrayBuffer", function() {
		assert.throws(() => {
			new Certificate(3);
		}, TypeError, "could not coerce 'certificate' to ArrayBuffer");
	});

	test("Certificate constructor throws if cert is empty ArrayBuffer", function() {
		assert.throws(() => {
			new Certificate([]);
		}, Error, "cert was empty (0 bytes)");
	});

	test("Certificate verify can verify root cert", function() {
		let cert = new Certificate(h.certs.yubicoRoot);
		let p = cert.verify();
		assert.equal(p instanceof Promise, true);
		return p;
	});

	test("Certificate verify throws if root cert isn't found", async function() {
		let cert = new Certificate(h.certs.yubiKeyAttestation);
		let p;
		try {
			p = await cert.verify();
		} catch (err) {
			assert.equal(err instanceof Error, true);
			assert.equal(err.message, "Please provide issuer certificate as a parameter");
		}
		assert.equal(typeof p, "undefined");
		return Promise.resolve();
	});

	test("Certificate verify can verify cert with root cert", async function() {
		CertManager.addCert(h.certs.yubicoRoot);
		let cert = new Certificate(h.certs.yubiKeyAttestation);
		await cert.verify();
	});

	test("Certificate getPublicKey can extract public key of attestation", function() {
		let cert = new Certificate(h.certs.yubiKeyAttestation);
		let p = cert.getPublicKey();
		assert.equal(p instanceof Promise, true);
		return p.then((jwk) => {
			assert.equal(typeof jwk, "object");
			assert.equal(jwk.kty, "EC");
			assert.equal(jwk.crv, "P-256");
			assert.equal(jwk.x, "SzMfdz2BRLmZXL5FhVF-F1g6pHYjaVy-haxILIAZ8sk");
			assert.equal(jwk.y, "uUZ64EWw5m8TGy6jJDyR_aYC4xjz_F2NKnq65yvRQwk");
		});
	});

	test("Certificate getPublicKey can extract public key of root", function() {
		let cert = new Certificate(h.certs.yubicoRoot);
		let p = cert.getPublicKey();
		assert.equal(p instanceof Promise, true);
		return p.then((jwk) => {
			assert.equal(typeof jwk, "object");
			assert.equal(jwk.kty, "RSA");
			assert.equal(jwk.alg, "RS256");
			assert.equal(jwk.e, "AQAB");
			assert.equal(jwk.n, "v48GLoQVZamomFhDLK1hYrICfj7TPdXkq6SOEyu1Od5sAiGsEgx8vL1JpOTdigI_Wm70_TT-UjEtYUIt7rMaGBqJ10IHzumV8lAPWvigJKnRZwZ5croEngjnqfBHWRX7GkRbTI5MM-RnM9j8uLyGLwnTBz7cGs9G1bs53rniBM-k50IxOt0Xbds28J3m8ExuWcm3lksG88vgSd-GR3FITwGPPciUF7hNCMzGRXBAWzzUW1hAkSoI6v_6k_Z5gzhVZUkQrdsIqj0s5bsJ_r_rLkBAbFI0xjBHdubSl105DVttcCFm8XkslKE18C7xkusZcEEoDaZNql2MH_Il4O1VmQ");
		});
	});

	test("Certificate getSerial returns correct serial for attestation", function() {
		let cert = new Certificate(h.certs.yubiKeyAttestation);
		let serial = cert.getSerial();
		assert.equal(serial, "Yubico U2F EE Serial 1432534688");
	});

	test("Certificate getSerial returns correct serial for root", function() {
		let cert = new Certificate(h.certs.yubicoRoot);
		let serial = cert.getSerial();
		assert.equal(serial, "Yubico U2F Root CA Serial 457200631");
	});

	test("Certificate getIssuer returns correct issuer for attestation", function() {
		let cert = new Certificate(h.certs.yubiKeyAttestation);
		let serial = cert.getIssuer();
		assert.equal(serial, "Yubico U2F Root CA Serial 457200631");
	});

	test("Certificate getIssuer returns correct issuer for root", function() {
		let cert = new Certificate(h.certs.yubicoRoot);
		let serial = cert.getIssuer();
		assert.equal(serial, "Yubico U2F Root CA Serial 457200631");
	});
	test("Certificate getVersion returns correct version for attestation", function() {
		let cert = new Certificate(h.certs.yubiKeyAttestation);
		let version = cert.getVersion();
		assert.equal(version, 3);
	});

	test("Certificate getVersion returns correct version for root", function() {
		let cert = new Certificate(h.certs.yubicoRoot);
		let version = cert.getVersion();
		assert.equal(version, 3);
	});

	test("Certificate getExtensions returns correct extensions for attestation", function() {
		let cert = new Certificate(h.certs.yubiKeyAttestation);
		let extensions = cert.getExtensions();
		assert.instance(extensions, Map);
		assert.equal(extensions.size, 2);
		assert.ok(extensions.has("yubico-device-id"));
		assert.ok(extensions.has("fido-u2f-transports"));
		assert.equal(extensions.get("yubico-device-id"), "YubiKey 4/YubiKey 4 Nano");
		let u2fTransports = extensions.get("fido-u2f-transports");
		assert.instance(u2fTransports, Set);
		assert.equal(u2fTransports.size, 1);
		assert.ok(u2fTransports.has("usb"));
	});

	test("Certificate getExtensions returns correct extensions for root", function() {
		let cert = new Certificate(h.certs.yubicoRoot);
		let extensions = cert.getExtensions();
		assert.instance(extensions, Map);
		assert.equal(extensions.size, 3);
		assert.ok(extensions.has("subject-key-identifier"));
		assert.ok(extensions.has("basic-constraints"));
		assert.ok(extensions.has("key-usage"));
		assert.instance(extensions.get("subject-key-identifier"), ArrayBuffer);
		assert.type(extensions.get("basic-constraints"), "object");
		assert.instance(extensions.get("key-usage"), Set);
		assert.ok(extensions.get("key-usage").has("cRLSign"));
		assert.ok(extensions.get("key-usage").has("keyCertSign"));
	});

	test("Certificate getExtensions returns FIDO2 extensions", function() {
		let cert = new Certificate(h.certs.feitianFido2);
		let extensions = cert.getExtensions();
		assert.instance(cert.warning, Map);
		assert.equal(cert.warning.size, 0);

		assert.instance(extensions, Map);
		assert.equal(extensions.size, 5);

		// subject-key-identifier
		let subjectKeyId = extensions.get("subject-key-identifier");
		assert.instance(subjectKeyId, ArrayBuffer);
		assert.equal(subjectKeyId.byteLength, 20);

		// authority-key-identifier
		let authorityKeyId = extensions.get("authority-key-identifier");
		assert.instance(authorityKeyId, Map);
		assert.equal(authorityKeyId.size, 1);
		assert.instance(authorityKeyId.get("key-identifier"), ArrayBuffer);

		// basic-constraints
		let basicConstraints = extensions.get("basic-constraints");
		assert.type(basicConstraints, "object");
		assert.equal(Object.keys(basicConstraints).length, 1);
		assert.equal(basicConstraints.cA, false);

		// fido-u2f-transports
		let transports = extensions.get("fido-u2f-transports");
		assert.instance(transports, Set);
		assert.equal(transports.size, 1);
		assert.ok(transports.has("usb"), "transports has USB");

		// 'fido-u2f-transports' => Set { 'usb' },

		// fido-aaguid
		let aaguid = extensions.get("fido-aaguid");
		assert.instance(aaguid, ArrayBuffer);
		let expectedAaguid = new Uint8Array([0x42, 0x38, 0x32, 0x45, 0x44, 0x37, 0x33, 0x43, 0x38, 0x46, 0x42, 0x34, 0x45, 0x35, 0x41, 0x32]).buffer;
		assert.ok(arrayBufferEquals(aaguid, expectedAaguid), "correct aaguid value");
	});

	test("Certificate getExtensions returns correct extensions for TPM attestation", function() {
		let cert = new Certificate(h.certs.tpmAttestation);
		let extensions = cert.getExtensions();
		assert.instance(extensions, Map);
		assert.equal(extensions.size, 8);
		// key usage
		let keyUsage = extensions.get("key-usage");
		assert.instance(keyUsage, Set);
		assert.equal(keyUsage.size, 1);
		assert.ok(keyUsage.has("digitalSignature"), "key-usage has digital signature");
		// basic constraints
		let basicConstraints = extensions.get("basic-constraints");
		assert.type(basicConstraints, "object");
		assert.equal(Object.keys(basicConstraints).length, 1);
		assert.equal(basicConstraints.cA, false);
		// certificate policies
		let certPolicies = extensions.get("certificate-policies");
		assert.ok(Array.isArray(certPolicies));
		assert.equal(certPolicies.length, 1);
		let policyQualifiers = certPolicies[0];
		assert.type(policyQualifiers, "object");
		assert.equal(policyQualifiers.id, "policy-qualifiers");
		assert.ok(Array.isArray(policyQualifiers.value));
		assert.equal(policyQualifiers.value.length, 1);
		let policyQualifier = policyQualifiers.value[0];
		assert.type(policyQualifier, "object");
		assert.equal(policyQualifier.id, "policy-qualifier");
		assert.ok(Array.isArray(policyQualifier.value));
		assert.equal(policyQualifier.value.length, 1);
		assert.equal(policyQualifier.value[0], "TCPA  Trusted  Platform  Identity");
		// extended key usage
		let extKeyUsage = extensions.get("ext-key-usage");
		assert.ok(Array.isArray(extKeyUsage));
		assert.equal(extKeyUsage.length, 1);
		assert.equal(extKeyUsage[0], "tcg-kp-aik-certificate");
		// alternate name
		let subjAltNames = extensions.get("subject-alt-name");
		assert.ok(Array.isArray(subjAltNames));
		assert.equal(subjAltNames.length, 1);
		let subjAltName = subjAltNames[0];
		assert.type(subjAltName, "object");
		assert.equal(Object.keys(subjAltName).length, 1);
		let generalNames = subjAltName.directoryName;
		assert.instance(generalNames, Map);
		assert.equal(generalNames.size, 3);
		assert.equal(generalNames.get("tcg-at-tpm-version"), "id:13");
		assert.equal(generalNames.get("tcg-at-tpm-model"), "NPCT6xx");
		assert.equal(generalNames.get("tcg-at-tpm-manufacturer"), "id:4E544300");
		// authority key identifier
		let authKeyId = extensions.get("authority-key-identifier");
		assert.instance(authKeyId, Map);
		assert.equal(authKeyId.size, 1);
		authKeyId = authKeyId.get("key-identifier");
		assert.instance(authKeyId, ArrayBuffer);
		let expectedAuthKeyId = new Uint8Array([
			0xC2, 0x12, 0xA9, 0x5B, 0xCE, 0xFA, 0x56, 0xF8, 0xC0, 0xC1, 0x6F, 0xB1, 0x5B, 0xDD, 0x03, 0x34,
			0x47, 0xB3, 0x7A, 0xA3,
		]).buffer;
		assert.ok(arrayBufferEquals(authKeyId, expectedAuthKeyId), "got expected authority key identifier");
		// subject key identifier
		let subjectKeyId = extensions.get("subject-key-identifier");
		assert.instance(subjectKeyId, ArrayBuffer);
		let expectedSubjectKeyId = new Uint8Array([
			0xAF, 0xE2, 0x45, 0xD3, 0x48, 0x0F, 0x22, 0xDC, 0xD5, 0x0C, 0xD2, 0xAE, 0x7B, 0x96, 0xB5, 0xA9,
			0x33, 0xCA, 0x7F, 0xE1,
		]).buffer;
		assert.ok(arrayBufferEquals(subjectKeyId, expectedSubjectKeyId), "got expected authority key identifier");
		// info access
		let infoAccess = extensions.get("authority-info-access");
		assert.instance(infoAccess, Map);
		assert.equal(infoAccess.size, 1);
		let certAuthIss = infoAccess.get("cert-authority-issuers");
		assert.type(certAuthIss, "object");
		assert.equal(Object.keys(certAuthIss).length, 1);
		assert.equal(certAuthIss.uniformResourceIdentifier, "https://azcsprodncuaikpublish.blob.core.windows.net/ncu-ntc-keyid-1591d4b6eaf98d0104864b6903a48dd0026077d3/3b918ae4-07e1-4059-9491-0ad248190818.cer");
	});
	test("Certificate getSubject returns correct extensions for attestation", function() {
		let cert = new Certificate(h.certs.yubiKeyAttestation);
		let subject = cert.getSubject();
		assert.instance(subject, Map);
		assert.equal(subject.size, 1);
		assert.equal(subject.get("common-name"), "Yubico U2F EE Serial 1432534688");

	});

	test("Certificate getSubject returns correct extensions for root", function() {
		let cert = new Certificate(h.certs.yubicoRoot);
		let subject = cert.getSubject();
		assert.instance(subject, Map);
		assert.equal(subject.size, 1);
		assert.equal(subject.get("common-name"), "Yubico U2F Root CA Serial 457200631");
	});

	test("Certificate getSubject returns correct values for Feitian FIDO2", function() {
		let cert = new Certificate(h.certs.feitianFido2);
		let subject = cert.getSubject();
		assert.instance(subject, Map);
		assert.equal(subject.size, 4);
		assert.equal(subject.get("country-name"), "CN");
		assert.equal(subject.get("organization-name"), "Feitian Technologies");
		assert.equal(subject.get("organizational-unit-name"), "Authenticator Attestation");
		assert.equal(subject.get("common-name"), "FT BioPass FIDO2 USB");
	});

	test("Helpers resolveOid decodes U2F USB transport type", function() {
		let ret = certHelpers.resolveOid(
			"1.3.6.1.4.1.45724.2.1.1",
			new Uint8Array([0x03, 0x02, 0x05, 0x20]).buffer
		);
		assert.type(ret, "object");
		assert.equal(ret.id, "fido-u2f-transports");
		assert.instance(ret.value, Set);
		assert.equal(ret.value.size, 1);
		assert.ok(ret.value.has("usb"));
	});

	test("Helpers resolveOid decodes U2F Bluetooth Classic transport type", function() {
		let ret = certHelpers.resolveOid(
			"1.3.6.1.4.1.45724.2.1.1",
			new Uint8Array([0x03, 0x02, 0x07, 0x80]).buffer
		);
		assert.type(ret, "object");
		assert.equal(ret.id, "fido-u2f-transports");
		assert.instance(ret.value, Set);
		assert.equal(ret.value.size, 1);
		assert.ok(ret.value.has("bluetooth-classic"));
	});

	test("decodes U2F USB+NFC transport type", function() {
		let ret = certHelpers.resolveOid(
			"1.3.6.1.4.1.45724.2.1.1",
			new Uint8Array([0x03, 0x02, 0x04, 0x30]).buffer
		);
		assert.type(ret, "object");
		assert.equal(ret.id, "fido-u2f-transports");
		assert.instance(ret.value, Set);
		assert.equal(ret.value.size, 2);
		assert.ok(ret.value.has("usb"));
		assert.ok(ret.value.has("nfc"));
	});

	test("Helpers resolveOid decodes U2F USB Internal transport type", function() {
		let ret = certHelpers.resolveOid(
			"1.3.6.1.4.1.45724.2.1.1",
			new Uint8Array([0x03, 0x02, 0x03, 0x08]).buffer
		);
		assert.type(ret, "object");
		assert.equal(ret.id, "fido-u2f-transports");
		assert.instance(ret.value, Set);
		assert.equal(ret.value.size, 1);
		assert.ok(ret.value.has("usb-internal"));
	});

	test("Helpers resolveOid decodes all transport types", function() {
		let ret = certHelpers.resolveOid(
			"1.3.6.1.4.1.45724.2.1.1",
			new Uint8Array([0x03, 0x02, 0x03, 0xF8]).buffer
		);
		assert.type(ret, "object");
		assert.equal(ret.id, "fido-u2f-transports");
		assert.instance(ret.value, Set);
		assert.equal(ret.value.size, 5);
		assert.ok(ret.value.has("bluetooth-classic"));
		assert.ok(ret.value.has("bluetooth-low-energy"));
		assert.ok(ret.value.has("usb"));
		assert.ok(ret.value.has("nfc"));
		assert.ok(ret.value.has("usb-internal"));
	});

	test("CRL can create mdsRootCrl", function() {
		let ret = new CRL(h.mds.mdsRootCrl);
		assert.type(ret, "object");
		assert.type(ret._crl, "object");
	});

	test("CRL can create ca1Crl", function() {
		let ret = new CRL(h.mds.ca1Crl);
		assert.type(ret, "object");
		assert.type(ret._crl, "object");
	});

	test("CertManager is function", function() {
		assert.type(CertManager, "function");
	});

	test("CertManager has static methods", function() {
		assert.type(CertManager.addCert, "function");
		assert.type(CertManager.removeAll, "function");
	});

	test("CertManager addCert throws if no cert", function() {
		assert.throws(() => {
			CertManager.addCert();
		}, TypeError, "could not coerce 'certificate' to ArrayBuffer");
		
		CertManager.removeAll();
	});

	test("CertManager addCert can add cert", function() {
		CertManager.addCert(h.certs.yubicoRoot);

		CertManager.removeAll();
	});

	test("CertManager getCerts returns empty Map if no certs added", function() {
		let ret = CertManager.getCerts();
		assert.instance(ret, Map);
		assert.equal(ret.size, 0);
	});

	test("CertManager getCerts returns Map with added cert", function() {
		CertManager.addCert(h.certs.yubicoRoot);
		let ret = CertManager.getCerts();
		assert.instance(ret, Map);
		assert.equal(ret.size, 1);
		assert.ok(ret.has("Yubico U2F Root CA Serial 457200631"));

		CertManager.removeAll();
	});

	/*test("CerManager verifyCertChain rejects on empty arguments", async function() {
        await assert.throws(async () => { 
            await CertManager.verifyCertChain();
        }, "expected 'certs' to be non-empty Array, got: undefined");
		CertManager.removeAll();
		return result;
    });*/

	/*test("CerManager verifyCertChain works for MDS2", function() {
        var certs = [
            new Certificate(h.mds.mdsSigningCert),
            new Certificate(h.mds.mdsIntermediateCert),
        ];
        var trustedRoots = [
            new Certificate(h.mds.mdsRootCert),
        ];

        var certRevocationLists = [
            new CRL(h.mds.mdsRootCrl),
            new CRL(h.mds.ca1Crl),
        ];

        var ret = CertManager.verifyCertChain(certs, trustedRoots, certRevocationLists);
        assert.instance(ret, Promise);

		CertManager.removeAll();

        return ret;
    });

    test("CerManager verifyCertChain will create certs from input arrays", function() {
        var certs = [
            h.mds.mdsSigningCert,
            h.mds.mdsIntermediateCert,
        ];
        var trustedRoots = [
            h.mds.mdsRootCert,
        ];

        var certRevocationLists = [
            h.mds.mdsRootCrl,
            h.mds.ca1Crl,
        ];

        var ret = CertManager.verifyCertChain(certs, trustedRoots, certRevocationLists);
        assert.instance(ret, Promise);

		CertManager.removeAll();

        return ret;
    });*/
    
	test.run();
};
export { testCertUtils };
