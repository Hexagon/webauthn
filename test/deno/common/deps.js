// External dependencies for testing in deno environment
export {
  assertEquals,
  assertRejects,
  assertThrows,
} from "https://deno.land/std@0.128.0/testing/asserts.ts";
export { default as klon } from "https://esm.run/klon";
export { Webauthn } from "../../../lib/webauthn.js";
