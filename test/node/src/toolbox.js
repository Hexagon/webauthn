// Testing lib
import { test } from "uvu";
import * as assert from "uvu/assert";

// Helpers
import { base64 } from "../../../src/common/utils.js";

// Testing subjects
import { ToolBox } from "../../../src/node/toolbox.js";

// Actual tests
const testToolBox = function () {
	
	test("randomValues", async () => {
		const res32bytes = ToolBox.randomValues(32);
		assert.equal(res32bytes.length, 32);
	});

	test("checkUrl should throw on non public suffix", async () => {
		assert.throws(() => { ToolBox.checkUrl("asdf.ffsf"); }, "origin is not a valid eTLD+1");
	});

	test("checkOrigin should throw on non public suffix", async () => {
		assert.throws(() => { ToolBox.checkOrigin("asdf.ffsf"); }, "origin is not a valid eTLD+1");
	});

	test("hash", async () => {
		let hash = base64.fromArrayBuffer(await ToolBox.hashDigest(new TextEncoder().encode("Asd")));
		assert.equal(hash, "I/N27AiwtvQxCPYb+qls0Wjz2sTl5cAhhaEHrZz/xdE=");
	});

	test.run();
};
export { testToolBox };