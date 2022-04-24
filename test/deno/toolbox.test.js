// Testing lib
import { assertEquals, assertThrows } from "./common/deps.js";

// Helpers
import { base64, tools } from "../../lib/common/utils.js";

Deno.test("randomValues", async () => {
  const res32bytes = tools.randomValues(32);
  assertEquals(res32bytes.length, 32);
});

Deno.test("checkUrl should throw on non public suffix", async () => {
  assertThrows(() => {
    tools.checkUrl("asdf.ffsf");
  }, "origin is not a valid eTLD+1");
});

Deno.test("checkOrigin should throw on non public suffix", async () => {
  assertThrows(() => {
    ToolBox.checkOrigin("asdf.ffsf");
  }, "origin is not a valid eTLD+1");
});

Deno.test("hash", async () => {
  let hash = base64.fromArrayBuffer(
    await tools.hashDigest(new TextEncoder().encode("Asd")),
  );
  assertEquals(hash, "I/N27AiwtvQxCPYb+qls0Wjz2sTl5cAhhaEHrZz/xdE=");
});
