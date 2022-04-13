// Testing lib
import { assertEquals } from "../deps.js";

// Helpers
import { base64 } from "../../../src/common/utils.js";

// Test subject
import { ToolBox } from "../../../src/deno/toolbox.js";

// Actual tests
const testToolBox = function () {
  Deno.test("randomValues", async () => {
    const res32bytes = ToolBox.randomValues(32);
    assertEquals(res32bytes.length, 32);
  });

  Deno.test("hash", async () => {
    let hash = base64.fromArrayBuffer(
      await ToolBox.hashDigest(new TextEncoder().encode("Asd")),
    );
    assertEquals(hash, "I/N27AiwtvQxCPYb+qls0Wjz2sTl5cAhhaEHrZz/xdE=");
  });
};
export { testToolBox };
