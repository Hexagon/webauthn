# webauthn

NPM: @hexagon\webauthn | Deno.land: webauthn

Slim Webauthn library with ES6, Node and Deno support. Heavily based on fido2-lib, but with it's own set of pros (and cons).

*Currently in pre-release*

[![Node.js CI](https://github.com/Hexagon/webauthn/actions/workflows/node.js.yml/badge.svg)](https://github.com/Hexagon/webauthn/actions/workflows/node.js.yml) 
[![Deno CI](https://github.com/Hexagon/webauthn/actions/workflows/deno.yml/badge.svg)](https://github.com/Hexagon/webauthn/actions/workflows/deno.yml)
[![npm version](https://badge.fury.io/js/@hexagon%2Fwebauthn.svg)](https://badge.fury.io/js/@hexagon%2Fwebauthn) [![NPM Downloads](https://img.shields.io/npm/dm/@hexagon/webauthn.svg)](https://www.npmjs.org/package/@hexagon/webauthn) 
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Hexagon/webauthn/blob/master/LICENSE) [![jsdelivr](https://data.jsdelivr.com/v1/package/gh/hexagon/webauthn/badge?style=rounded)](https://www.jsdelivr.com/package/gh/hexagon/webauthn)

Demo/Example for both Deno and Node available at [github.com/Hexagon/webauthn-skeleton/tree/server/deno](https://github.com/Hexagon/webauthn-skeleton/tree/server/deno)

Pros, compared to fido2-lib

*   Supports both Node and Deno with the same code base
*   Simplified dependency tree. Less duplicates, and less dependencies overall.
*   ToDo: Make this list complete with explanations

Cons, compared to fido2-lib

*   Lacks all Attestation-modes except "none"
*   Lacks MDS
*   All automated tests of fido2-lib isn't implemented
*   This library should be considered experimental, in comparison.

## Installation

### Node.js

```npm install @hexagon/webauthn --save```

JavaScript

```javascript
// ESM Import ...
import webauthn from "@hexagon/webauthn";

// ... or CommonJS Require
const webauthn = require("@hexagon/webauthn");
```

TypeScript

```typescript
import webauthn from "@hexagon/webauthn";

// ...
```

### Deno

JavaScript

```javascript
import webauthn from "https://cdn.jsdelivr.net/gh/hexagon/webauthn@0/src/deno/webauthn.js";

// ...
```

TypeScript

```typescript
import { webauthn } from "https://cdn.jsdelivr.net/gh/hexagon/webauthn@0/src/deno/webauthn.js";

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

#### Node commands

| Command  | Description                              |
|-------|------------------------------------------|
| `npm run build` | Run all sort of node checks, good before comitting |
| `npm run build:docs` | Rebuild documentation, good before releasing |
| `npm run test` | Run Node tests, good after code changes |
| `npm run test:coverage` | Run Node tests with coverage (included in build) |
| `npm run test:lint` | Run eslint (included in build) |
| `npm run test:lint:fix` | Run eslint try to fix linting errors |
| `npm run test:lint:fix` | Run eslint try to fix linting errors |

#### Deno commands

| Command  | Description                              |
|-------|------------------------------------------|
| `deno fmt --check test/deno src/deno` | Check linting of Deno files |
| `npm run test:lint` | Check linting of Deno files |
| `deno test test/deno` | Run deno tests |
| `npm run test:deno` | .. or Run deno tests |

### File structure

| Path  | Description                              |
|-------|------------------------------------------|
| `/src/common` | Source code base folder |
| `/src/common/attestation` | Attestation plug-ins |
| `/src/common/tools` | Bundled dependencies |
| `/src/deno/webauthn.js` | Deno entrypoint |
| `/src/deno/toolbox.js` | Deno external dependencies and shims |
| `/src/node/webauthn.js` | Node entrypoint |
| `/src/node/toolbox.js` | Node external dependencies and shims |
| `/test/node` | Node tests |
| `/test/deno` | Deno tests |
| `/docs` | Documentation |

### Contributors

The underlying code is heavily based on [github.com/webauthn-open-source/fido2-lib](https://github.com/webauthn-open-source/fido2-lib)

## License

MIT
