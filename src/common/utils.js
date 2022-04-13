import { base64 } from "./tools/base64/base64.js";
import * as cbor from "../common/tools/cbor/decode.js";
import { coseToJwk } from "../common/tools/cose-to-jwk/cose-to-jwk.js";

function ab2str(buf) {
	let str = "";
	new Uint8Array(buf).forEach((ch) => {
		str += String.fromCharCode(ch);
	});
	return str;
}

function isBase64Url(str) {
	return !!str.match(/^[A-Za-z0-9\-_]+={0,2}$/);
}

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

function isPositiveInteger(n) {
	return n >>> 0 === parseFloat(n);
}

function abToBuf(ab) {
	return new Uint8Array(ab).buffer;
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

/* Used for tests */
function arrayBufferEquals(b1, b2) {
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
}

export {
	ab2str,
	abToBuf,
	isBase64Url,
	abEqual,
	isPem,
	isPositiveInteger,
	appendBuffer,
	coerceToArrayBuffer,
	base64,
	coerceToBase64Url,
	coerceToBase64,
	cbor,
	coseToJwk,
	arrayBufferEquals
};
