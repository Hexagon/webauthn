// External dependencies for testing in deno environment
export { Webauthn } from "../../../lib/webauthn.js";
export { afterEach, beforeEach, describe, it } from "test_suite";
export * as sinon from "sinon";
export {
  assertEquals,
  assertRejects,
  assertStrictEquals,
  assertThrows,
} from "std/testing/asserts.ts";
export { assert } from "../../helpers/chai-deno-shim.js";
