// Testing lib
import * as chai from "chai";

// Helpers
import * as h from "./helpers/fido2-helpers.js";

// Testing subject
import { Fido2AssertionResult } from "./helpers/lib-or-dist.js";
const assert = chai.assert;

describe("Fido2Result", function () {
  it("works with WindowsHello", async function () {
    const ret = await Fido2AssertionResult.create(
      h.lib.assertionResponseWindowsHello,
      {
        origin: "https://webauthn.org",
        challenge: "m7ZU0Z-_IiwviFnF1JXeJjFhVBincW69E1Ctj8AQ-Ybb1uc41bMHtItg6JACh1sOj_ZXjonw2acj_JD2i-axEQ",
        flags: ["UP"],
        prevCounter: 0,
        publicKey: h.lib.assnPublicKeyWindowsHello,
        userHandle: "YWs",
      },
    );
    assert.instanceOf(ret, Fido2AssertionResult);
  });
});
