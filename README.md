# webauthn

NPM: @hexagon\webauthn | Deno.land: webauthn

Slim Webauthn library with ES6, Node and Deno support. Heavily based on fido2-lib, but with it's own set of pros (and cons).

*Work in progress*

[![Node.js CI](https://github.com/Hexagon/webauthn/actions/workflows/node.js.yml/badge.svg)](https://github.com/Hexagon/webauthn/actions/workflows/node.js.yml) 
[![Deno CI](https://github.com/Hexagon/webauthn/actions/workflows/deno.yml/badge.svg)](https://github.com/Hexagon/webauthn/actions/workflows/deno.yml)
[![npm version](https://badge.fury.io/js/@hexagon%2Fwebauthn.svg)](https://badge.fury.io/js/@hexagon%2Fwebauthn) [![NPM Downloads](https://img.shields.io/npm/dm/@hexagon/webauthn.svg)](https://www.npmjs.org/package/@hexagon/webauthn) 
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Hexagon/webauthn/blob/master/LICENSE) [![jsdelivr](https://data.jsdelivr.com/v1/package/gh/hexagon/webauthn/badge?style=rounded)](https://www.jsdelivr.com/package/gh/hexagon/webauthn)

Demo/Example for both Deno and Node available at [github.com/Hexagon/webauthn-skeleton/tree/server/deno](https://github.com/Hexagon/webauthn-skeleton/tree/server/deno)

Pros, compared to fido2-lib

*   Supports both Node and Deno with the same code base
*   Much less dependencies
*   Includes [TypeScript](https://www.typescriptlang.org/) typings
*   ToDo: Make this list complete with explanations

Cons, compared to fido2-lib

*   Lacks all Attestation-modes except "none"
*   Lacks MDS
*   All automated tests of fido2-lib isn't implemented

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

```javascript
// ToDo: ...
```

Demo/Example for both Deno and Node available at [github.com/Hexagon/webauthn-skeleton/tree/server/deno](https://github.com/Hexagon/webauthn-skeleton/tree/server/deno)

### Full API

## Contributing

See [Contribution Guide](/CONTRIBUTING.md)

### Contributors

The underlying code is heavily based on [github.com/webauthn-open-source/fido2-lib](https://github.com/webauthn-open-source/fido2-lib)

## License

MIT
