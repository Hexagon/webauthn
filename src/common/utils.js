import { base64 } from "./tools/base64/base64.js";
import * as cbor from "../common/tools/cbor/decode.js";
import { coseToJwk } from "../common/tools/cose-to-jwk/cose-to-jwk.js";
import { webcrypto, subtleCrypto } from "./crypto.js";

function ab2str(buf) {
	let str = "";
	new Uint8Array(buf).forEach((ch) => {
		str += String.fromCharCode(ch);
	});
	return str;
}

/*function str2ab(str) {
	let buf = new ArrayBuffer(str.length);
	let bufView = new Uint8Array(buf);
	for (let i = 0, strLen = str.length; i < strLen; i++) {
		bufView[i] = str.charCodeAt(i);
	}
	return buf;
}*/

function isBase64Url(str) {
	return !!str.match(/^[A-Za-z0-9\-_]+={0,2}$/);
}

/*function bufEqual(a, b) {
	let len = a.length;

	if (len !== b.length) {
		return false;
	}

	for (let i = 0; i < len; i++) {
		if (a.readUInt8(i) !== b.readUInt8(i)) {
			return false;
		}
	}

	return true;
}*/

function abEqual(a, b) {
	let len = a.byteLength;

	if (len !== b.byteLength) {
		return false;
	}

	a = new Uint8Array(a);
	b = new Uint8Array(b);
	for (let i = 0; i < len; i++) {
		if (a[i] !== b[i]) {
			return false;
		}
	}

	return true;
}

function isPem(pem) {
	if (typeof pem !== "string") {
		return false;
	}

	let pemRegex = /^-----BEGIN .+-----$\n([A-Za-z0-9+/=]|\n)*^-----END .+-----$/m;
	return !!pem.match(pemRegex);
}

function pemToBase64(pem) {
	if (!isPem(pem)) {
		throw new Error("expected PEM string as input");
	}

	let pemArr = pem.split("\n");
	// remove first and last lines
	pemArr = pemArr.slice(1, pemArr.length - 2);
	return pemArr.join("");
}

function isPositiveInteger(n) {
	return n >>> 0 === parseFloat(n);
}

function abToBuf(ab) {
	return Buffer.from(new Uint8Array(ab));
}

/*function abToPem(type, ab) {
	if (typeof type !== "string") {
		throw new Error("abToPem expected 'type' to be string like 'CERTIFICATE', got: " + type);
	}

	let str = coerceToBase64(ab, "pem buffer");

	return [
		`-----BEGIN ${type}-----\n`,
		...str.match(/.{1,64}/g).map((s) => s + "\n"),
		`-----END ${type}-----\n`,
	].join("");
}*/

/*function arrayBufferEquals(b1, b2) {
	if (!(b1 instanceof ArrayBuffer) ||
            !(b2 instanceof ArrayBuffer)) {
		console.log("not array buffers");
		return false;
	}

	if (b1.byteLength !== b2.byteLength) {
		console.log("not same length");
		return false;
	}
	b1 = new Uint8Array(b1);
	b2 = new Uint8Array(b2);
	for (let i = 0; i < b1.byteLength; i++) {
		if (b1[i] !== b2[i]) return false;
	}
	return true;
}*/

/*function abToInt(ab) {
	if (!(ab instanceof ArrayBuffer)) {
		throw new Error("abToInt: expected ArrayBuffer");
	}

	let buf = new Uint8Array(ab);
	let cnt = ab.byteLength - 1;
	let ret = 0;
	buf.forEach((byte) => {
		ret |= (byte << (cnt * 8));
		cnt--;
	});

	return ret;
}*/

/*function b64ToJsObject(b64, desc) {
	return JSON.parse(ab2str(coerceToArrayBuffer(b64, desc)));
}

function jsObjectToB64(obj) {
	return Buffer.from(JSON.stringify(obj).replace(/[\u{0080}-\u{FFFF}]/gu,"")).toString("base64");
}*/
/*
*/

async function hashDigest(o) {
	if (typeof o === "string") {
		o = new TextEncoder().encode(o);
	}
	let result = await subtleCrypto.digest("sha-256", o);
	return result;
}

function randomValues(n) {
	let byteArray = new Uint8Array(n);
	webcrypto.getRandomValues(byteArray);
	return byteArray;
}

/**
 * Creates a new Uint8Array based on two different ArrayBuffers
 *
 * @private
 * @param {ArrayBuffers} buffer1 The first buffer.
 * @param {ArrayBuffers} buffer2 The second buffer.
 * @return {ArrayBuffers} The new ArrayBuffer created out of the two.
 */
let appendBuffer = function(buffer1, buffer2) {
	let tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
	tmp.set(new Uint8Array(buffer1), 0);
	tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
	return tmp.buffer;
};

function coerceToArrayBuffer(buf, name) {
	
	if (!name) {
		throw new TypeError("name not specified in coerceToArrayBuffer");
	}

	// Handle empty strings
	if (typeof buf === "string" && buf === "") {
		buf = new Uint8Array(0);

	// Handle base64url and base64 strings
	} else if (typeof buf === "string") {
		// base64url to base64
		buf = buf.replace(/-/g, "+").replace(/_/g, "/");
		// base64 to Buffer
		buf = base64.toArrayBuffer(buf);
	}

	// Handle undefined
	if(typeof buf === "undefined") {
		buf = new ArrayBuffer(0);
	}

	// Extract typed array from Array
	if(Array.isArray(buf)) {
		buf = new Uint8Array(buf);
	}

	// Extract ArrayBuffer from Node buffer
	if (typeof Buffer !== "undefined" && !(buf instanceof Buffer)) {
		buf = new Uint8Array(buf);
		buf = buf.buffer;
	}

	// Extract arraybuffer from TypedArray
	if(buf instanceof Uint8Array) {
		buf = buf.slice(0, buf.byteLength, buf.buffer.byteOffset).buffer;
	}

	// error if none of the above worked
	if (!(buf instanceof ArrayBuffer)) {
		throw new TypeError(`could not coerce '${name}' to ArrayBuffer`);
	}

	return buf;
}


function coerceToBase64(thing, name) {
	if (!name) {
		throw new TypeError("name not specified in coerceToBase64");
	}
	
	if (typeof thing !== "string") {
		try {
			thing = base64.fromArrayBuffer(coerceToArrayBuffer(thing, name));
		} catch (e) {
			throw new Error(`could not coerce '${name}' to base64 string`);
		}
	}

	if (typeof thing !== "string") {
		throw new Error(`could not coerce '${name}' to base64 string`);
	}

	return thing;
}

function coerceToBase64Url(thing, name) {

	if (!name) {
		throw new TypeError("name not specified in coerceToBase64");
	}
	
	if (typeof thing !== "string") {
		try {
			thing = base64.fromArrayBuffer(coerceToArrayBuffer(thing, name), true);
		} catch (e) {
			throw new Error(`could not coerce '${name}' to base64url string`);
		}
	}

	if (typeof thing !== "string") {
		throw new Error(`could not coerce '${name}' to base64url string`);
	}
	
	return thing;
}

export {
	ab2str,
	abToBuf,
	isBase64Url,
	abEqual,
	isPem,
	pemToBase64,
	isPositiveInteger,
	hashDigest,
	randomValues,
	appendBuffer,
	coerceToArrayBuffer,
	base64,
	coerceToBase64Url,
	coerceToBase64,
	cbor,
	coseToJwk
};
