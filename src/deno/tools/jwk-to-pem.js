import { importJWK, exportSPKI } from "../deps.js";

async function jwkToPem(jwk) {

	// Set key as extractable
	jwk.ext = true;

	// Help JOSE find the correct path
	const algMap = {
		"RSASSA-PKCS1-v1_5_w_SHA256": "RS256",
		"ECDSA_w_SHA256": "ES256"
	};
	let alg = algMap[jwk.alg] || jwk.alg;
	const pubCryptoKey = await importJWK(jwk, alg);
	const pubSPKI = await exportSPKI(pubCryptoKey);

	return pubSPKI;
}

export { jwkToPem };