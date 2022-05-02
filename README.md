# webauthn

NPM: @hexagon\webauthn | Deno.land: webauthn

Slim Webauthn library with ES6, Deno and Node (>=16) support. Heavily based on fido2-lib.

*Currently in pre-release*

[![Node.js CI](https://github.com/Hexagon/webauthn/actions/workflows/node.js.yml/badge.svg)](https://github.com/Hexagon/webauthn/actions/workflows/node.js.yml) 
[![Deno CI](https://github.com/Hexagon/webauthn/actions/workflows/deno.yml/badge.svg)](https://github.com/Hexagon/webauthn/actions/workflows/deno.yml)
[![npm version](https://badge.fury.io/js/@hexagon%2Fwebauthn.svg)](https://badge.fury.io/js/@hexagon%2Fwebauthn) [![NPM Downloads](https://img.shields.io/npm/dm/@hexagon/webauthn.svg)](https://www.npmjs.org/package/@hexagon/webauthn) 
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Hexagon/webauthn/blob/master/LICENSE) [![jsdelivr](https://data.jsdelivr.com/v1/package/gh/hexagon/webauthn/badge?style=rounded)](https://www.jsdelivr.com/package/gh/hexagon/webauthn)

Example for both Deno and Node available at [github.com/Hexagon/webauthn-skeleton](https://github.com/Hexagon/webauthn-skeleton)

# Features

### Specific to @hexagon/webauthn

*   Supports Deno and recent versions of Node (>=16)
*   Pure ESM code base
*   Bundled distributable, no remote dependencies

### Inherited from fido2-lib

*   Works with Windows Hello, Android lock screen, Yubikeys
*   Attestation formats: packed, tpm, android-safetynet, fido-u2f, none
*   Convenient API for adding more attestation formats
*   Convenient API for adding extensions
*   Metadata service (MDS) support enables authenticator root of trust and authenticator metadata
*   Support for multiple simultaneous metadata services (e.g. FIDO MDS 1 & 2)
*   Crypto families: ECDSA, RSA
*   x509 cert parsing, support for FIDO-related extensions, and NIST Public Key Interoperability Test Suite (PKITS) chain validation (from [pki.js](https://github.com/PeculiarVentures/PKI.js/))
*   Returns parsed and validated data, along with extra audit data for risk engines

## Installation

### Deno

Import `dist/webauthn.js` using your favorite metod. The module is available at [deno.land/x/webauthn](https://deno.land/x/webauthn), jsdelivr, npm, unpkg etc.

```javascript
import { Webauthn } from "https://cdn.jsdelivr.net/gh/hexagon/webauthn@0/dist/webauthn.js";

// ...
```

### Node.js

```npm install @hexagon/webauthn --save```

```javascript
// ESM Import ...
import { Webauthn } from "@hexagon/webauthn";

// ... or CommonJS
const { Webauthn } = await import("@hexagon/webauthn");
```

## Usage

### Examples

All examles assumes you have imported webauthn as described under 'Installation'.

@hexagon/webauthn uses the same interface as `fido2-lib`

#### Instantiate Library (Simple):
```js
// create a new instance of the library
var f2l = new Webauthn();
```

#### Instantiate Library (Complex):
```js
// could also use one or more of the options below,
// which just makes the options calls easier later on:
var f2l = new Webauthn({
    timeout: 42,
    rpId: "example.com",
    rpName: "ACME",
    rpIcon: "https://example.com/logo.png",
    challengeSize: 128,
    attestation: "none",
    cryptoParams: [-7, -257],
    authenticatorAttachment: "platform",
    authenticatorRequireResidentKey: false,
    authenticatorUserVerification: "required"
});
```

#### Registration:
```js
var registrationOptions = await f2l.attestationOptions();

// make sure to add registrationOptions.user.id
// save the challenge in the session information...
// send registrationOptions to client and pass them in to `navigator.credentials.create()`...
// get response back from client (clientAttestationResponse)

var attestationExpectations = {
    challenge: "33EHav-jZ1v9qwH783aU-j0ARx6r5o-YHh-wd7C6jPbd7Wh6ytbIZosIIACehwf9-s6hXhySHO-HHUjEwZS29w",
    origin: "https://localhost:8443",
    factor: "either"
};
var regResult = await f2l.attestationResult(clientAttestationResponse, attestationExpectations); // will throw on error

// registration complete!
// save publicKey and counter from regResult to user's info for future authentication calls
```

#### Authentication:
```js
var authnOptions = await f2l.assertionOptions();

// add allowCredentials to limit the number of allowed credential for the authentication process. For further details refer to webauthn specs: (https://www.w3.org/TR/webauthn-2/#dom-publickeycredentialrequestoptions-allowcredentials).
// save the challenge in the session information...
// send authnOptions to client and pass them in to `navigator.credentials.get()`...
// get response back from client (clientAssertionResponse)

var assertionExpectations = {
    // Remove the following comment if allowCredentials has been added into authnOptions so the credential received will be validate against allowCredentials array.
    // allowCredentials: [{
    //     id: "lTqW8H/lHJ4yT0nLOvsvKgcyJCeO8LdUjG5vkXpgO2b0XfyjLMejRvW5oslZtA4B/GgkO/qhTgoBWSlDqCng4Q==",
    //     type: "public-key",
    //     transports: ["usb"]
    // }],
    challenge: "eaTyUNnyPDDdK8SNEgTEUvz1Q8dylkjjTimYd5X7QAo-F8_Z1lsJi3BilUpFZHkICNDWY8r9ivnTgW7-XZC3qQ",
    origin: "https://localhost:8443",
    factor: "either",
    publicKey: "-----BEGIN PUBLIC KEY-----\n" +
        "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAERez9aO2wBAWO54MuGbEqSdWahSnG\n" +
        "MAg35BCNkaE3j8Q+O/ZhhKqTeIKm7El70EG6ejt4sg1ZaoQ5ELg8k3ywTg==\n" +
        "-----END PUBLIC KEY-----\n",
    prevCounter: 362
};
var authnResult = await f2l.assertionResult(clientAssertionResponse, assertionExpectations); // will throw on error

// authentication complete!
```

Full demo for both Deno and Node available at [github.com/Hexagon/webauthn-skeleton/tree/server/deno](https://github.com/Hexagon/webauthn-skeleton/tree/server/deno)

## Contributing

See [Contribution Guide](/CONTRIBUTING.md) for general guidelines.

### Development

| Command  | Description                              |
|-------|------------------------------------------|
| `deno task test` | Run deno tests |
| `deno task coverage` | Run deno tests and display coverage |
| `deno lint` | Lint code base |
| `npm run typings` | Build typings (using tsc) |
| `npm run docs` | Build docs (using jsdoc) |
| `npm run test` | Run node tests (against distributable) |
| `deno task build` | Run all sorts of checks, then builds the bundle and tests the bundle using node |

### File structure

| Path  | Description                              |
|-------|------------------------------------------|
| `/lib` | Source code base folder |
| `/lib/attestation/` | Attestation plug-ins |
| `/lib/webauthn.js` | Deno entrypoint |
| `/lib/toolbox.js` | Deno external dependencies and shims |
| `/test/node` | Node tests |
| `/test/deno` | Deno tests |
| `/docs` | Documentation |

### Dependencies

All dependencies are bundled in distributable (`dist/webauthn.js`)

For details, see [/import_map.json](/import_map.json)

### Contributors

The underlying code is heavily based on [github.com/webauthn-open-source/fido2-lib](https://github.com/webauthn-open-source/fido2-lib)

## License

MIT
