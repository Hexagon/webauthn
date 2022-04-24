# webauthn

NPM: @hexagon\webauthn | Deno.land: webauthn

Slim DWebauthn library with ES6, Deno and Node support. Heavily based on fido2-lib.

*Currently in pre-release*

[![Node.js CI](https://github.com/Hexagon/webauthn/actions/workflows/node.js.yml/badge.svg)](https://github.com/Hexagon/webauthn/actions/workflows/node.js.yml) 
[![Deno CI](https://github.com/Hexagon/webauthn/actions/workflows/deno.yml/badge.svg)](https://github.com/Hexagon/webauthn/actions/workflows/deno.yml)
[![npm version](https://badge.fury.io/js/@hexagon%2Fwebauthn.svg)](https://badge.fury.io/js/@hexagon%2Fwebauthn) [![NPM Downloads](https://img.shields.io/npm/dm/@hexagon/webauthn.svg)](https://www.npmjs.org/package/@hexagon/webauthn) 
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Hexagon/webauthn/blob/master/LICENSE) [![jsdelivr](https://data.jsdelivr.com/v1/package/gh/hexagon/webauthn/badge?style=rounded)](https://www.jsdelivr.com/package/gh/hexagon/webauthn)

Demo/Example for both Deno and Node available at [github.com/Hexagon/webauthn-skeleton/tree/server/deno](https://github.com/Hexagon/webauthn-skeleton/tree/server/deno)

Features

*   Supports both Deno and recent versions of Node
*   ESM based code base
*   Bundle distributable, no remote dependencies

## Installation

### Node.js

```npm install @hexagon/webauthn --save```

JavaScript

```javascript
// ESM Import ...
import { Webauthn } from "@hexagon/webauthn";

// ... or CommonJS Require
const { Webauthn } = require("@hexagon/webauthn");
```

TypeScript

```typescript
import { Webauthn } from "@hexagon/webauthn";

// ...
```

### Deno

JavaScript

```javascript
import webauthn from "https://cdn.jsdelivr.net/gh/hexagon/webauthn@0/lib/webauthn.js";

// ...
```

TypeScript

```typescript
import { webauthn } from "https://cdn.jsdelivr.net/gh/hexagon/webauthn@0/lib/webauthn.js";

// ...
```

## Documentation

Full documentation available at [hexagon.github.io/webauthn](https://hexagon.github.io/webauthn/).

### Examples

Assuming you have imported webauthn as described under 'Installation'.

@hexagon/webauthn uses the same interface as `fido2-lib`

Examples from [github.com/webauthn-open-source/fido2-lib](https://github.com/webauthn-open-source/fido2-lib):

#### Instantiate Library (Simple):
```js
// create a new instance of the library
var f2l = new Webauthn();
```

#### Instantiate Library (Complex):
```js
// could also use one or more of the options below,
// which just makes the options calls easier later on:
var f2l = new Fido2Lib({
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
| `npm run build` | Run all sorts of checks (both Node and Deno), then builds the bundle, run before releasing |
| `deno fmt` | Format code base |
| `deno lint` | Lint code base |
| `deno test test/deno` | Run deno tests |
| `npm run test:node` | Run node tests |

### File structure

| Path  | Description                              |
|-------|------------------------------------------|
| `/lib/common` | Source code base folder |
| `/lib/common/attestation` | Attestation plug-ins |
| `/lib/common/tools` | Bundled dependencies |
| `/lib/webauthn.js` | Deno entrypoint |
| `/lib/toolbox.js` | Deno external dependencies and shims |
| `/test/node` | Node tests |
| `/test/deno` | Deno tests |
| `/docs` | Documentation |

### Dependency management

* Dependencies are imported by `deps.js`
* Pre-bundled dependencies are placed in `lib/common/tools`
* Node.js testing/dev-dependencies versions are managed in `package.json`

#### Current dependencies

| Package | Use | Version | From |
|---------|-----|----|------|
| [tldts](https://www.npmjs.com/package/tldts) | Production (bundled in dist) | 5.7.76 | jsdelivr.net |
| [punycode](https://deno.land/x/punycode) | Production (bundled in dist) | 2.1.1 | deno.land/x |
| [jose](https://deno.land/x/jose) | Production (bundled in dist) | 4.7.0 | deno.land/x |
| [cbor-x](https://deno.land/x/cbor) | Production (bundled in dist) | 1.2.1 | deno.land/x |
| [pkijs](https://www.npmjs.com/package/pkijs) | Production (bundled in dist) | 2.1.58 | unpkg.com |
| [asn1js](https://www.npmjs.com/package/asn1js) | Production (bundled in dist) | 2.3.2 | unpkg.com |
| [@hexagon/base64](https://www.npmjs.com/package/@hexagon/base64) | Production (bundled) | 1.0.18 | (bundled) |
| [std](https://deno.land/std@0.134.0/node/url.ts) | Production (bundled in dist) / Testing | 0.134.0 | deno.land/std |
| [klon](https://npmjs.org/klon) | Testing | 0.11.0 | esm.run |

### Contributors

The underlying code is heavily based on [github.com/webauthn-open-source/fido2-lib](https://github.com/webauthn-open-source/fido2-lib)

## License

MIT
