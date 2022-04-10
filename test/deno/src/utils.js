import { assertEquals } from "https://deno.land/std@0.128.0/testing/asserts.ts";
import * as utils from "../../../src/deno/utils.js";
import { default as klon } from "https://esm.run/klon";
import * as h from "../../helpers/fido2-helpers.js";

function testUtils() {
  // Actual tests
  Deno.test("randomValues", async () => {
    const res32bytes = utils.randomValues(32);
    assertEquals(res32bytes.length, 32);
  });

  Deno.test("coerceToArrayBuffer", () => {
    const testReq = klon(h.lib.makeCredentialAttestationNoneResponse);
    testReq.response.clientDataJSON = h.lib
      .makeCredentialAttestationNoneResponse.response.clientDataJSON.slice(0);
    testReq.response.attestationObject = h.lib
      .makeCredentialAttestationNoneResponse.response.attestationObject.slice(
        0,
      );
    let resData = utils.coerceToArrayBuffer(
      testReq.response.clientDataJSON,
      "test",
    );
    let resAttestationObject = utils.coerceToArrayBuffer(
      testReq.response.attestationObject,
      "test",
    );
    let resData2 = utils.coerceToArrayBuffer(resData, "test");
    let resAttestationObject2 = utils.coerceToArrayBuffer(
      resAttestationObject,
      "test",
    );
    assertEquals(
      testReq.response.clientDataJSON.byteLength,
      resData.byteLength,
    );
    assertEquals(
      testReq.response.attestationObject.byteLength,
      resAttestationObject.byteLength,
    );
    assertEquals(
      testReq.response.clientDataJSON.byteLength,
      resData2.byteLength,
    );
    assertEquals(
      testReq.response.attestationObject.byteLength,
      resAttestationObject2.byteLength,
    );
  });

  Deno.test("coerceToBase64", () => {
    const testReq = klon(h.lib.makeCredentialAttestationNoneResponse);
    testReq.response.clientDataJSON = h.lib
      .makeCredentialAttestationNoneResponse.response.clientDataJSON.slice(0);
    testReq.response.attestationObject = h.lib
      .makeCredentialAttestationNoneResponse.response.attestationObject.slice(
        0,
      );
    let resData = utils.coerceToBase64(testReq.response.clientDataJSON, "test");
    let resAttestationObject = utils.coerceToBase64(
      testReq.response.attestationObject,
      "test",
    );
    assertEquals(
      resData,
      "eyJjaGFsbGVuZ2UiOiIzM0VIYXYtaloxdjlxd0g3ODNhVS1qMEFSeDZyNW8tWUhoLXdkN0M2alBiZDdXaDZ5dGJJWm9zSUlBQ2Vod2Y5LXM2aFhoeVNITy1ISFVqRXdaUzI5dyIsImNsaWVudEV4dGVuc2lvbnMiOnt9LCJoYXNoQWxnb3JpdGhtIjoiU0hBLTI1NiIsIm9yaWdpbiI6Imh0dHBzOi8vbG9jYWxob3N0Ojg0NDMiLCJ0eXBlIjoid2ViYXV0aG4uY3JlYXRlIn0=",
    );
    assertEquals(
      resAttestationObject,
      "o2NmbXRkbm9uZWdhdHRTdG10oGhhdXRoRGF0YVkBJkmWDeWIDoxodDQXD2R2YFuP5K65ooYyx5lc87qDHZdjQQAAAAAAAAAAAAAAAAAAAAAAAAAAAKIACKLdXqwahqjNbtNs1piUlonluvxOsF9Feeh9k7qXay5zdrm239cW4WQUD/l5ptTzRLU9bSbghnv0FLaRA7tly7La9/QRKDXwZMsbWajlhKQh2ovYnjh6C37qtyPs151ITDFr+67FRgG0c2dJCoOa2hQB8z0tJYuXrkGMpVk0ZSn1qjfeYxJ1V9BDRsfN7r0lVC8sF/w5OJlSomw64qampRylAQIDJiABIVgguxHN3W6ehp0VWXKaMNie1J82MVJCFZYScau74o17cx8iWCDb1jkTLi7lYZZbgwUwpqAk8QmIiPMTVQUVkhGEyGrKww==",
    );
  });

  Deno.test("coerceToBase64url", () => {
    const testReq = klon(h.lib.makeCredentialAttestationNoneResponse);
    testReq.response.clientDataJSON = h.lib
      .makeCredentialAttestationNoneResponse.response.clientDataJSON.slice(0);
    testReq.response.attestationObject = h.lib
      .makeCredentialAttestationNoneResponse.response.attestationObject.slice(
        0,
      );
    let resData = utils.coerceToBase64Url(
      testReq.response.clientDataJSON,
      "test",
    );
    let resAttestationObject = utils.coerceToBase64Url(
      testReq.response.attestationObject,
      "test",
    );
    assertEquals(
      resData,
      "eyJjaGFsbGVuZ2UiOiIzM0VIYXYtaloxdjlxd0g3ODNhVS1qMEFSeDZyNW8tWUhoLXdkN0M2alBiZDdXaDZ5dGJJWm9zSUlBQ2Vod2Y5LXM2aFhoeVNITy1ISFVqRXdaUzI5dyIsImNsaWVudEV4dGVuc2lvbnMiOnt9LCJoYXNoQWxnb3JpdGhtIjoiU0hBLTI1NiIsIm9yaWdpbiI6Imh0dHBzOi8vbG9jYWxob3N0Ojg0NDMiLCJ0eXBlIjoid2ViYXV0aG4uY3JlYXRlIn0",
    );
    assertEquals(
      resAttestationObject,
      "o2NmbXRkbm9uZWdhdHRTdG10oGhhdXRoRGF0YVkBJkmWDeWIDoxodDQXD2R2YFuP5K65ooYyx5lc87qDHZdjQQAAAAAAAAAAAAAAAAAAAAAAAAAAAKIACKLdXqwahqjNbtNs1piUlonluvxOsF9Feeh9k7qXay5zdrm239cW4WQUD_l5ptTzRLU9bSbghnv0FLaRA7tly7La9_QRKDXwZMsbWajlhKQh2ovYnjh6C37qtyPs151ITDFr-67FRgG0c2dJCoOa2hQB8z0tJYuXrkGMpVk0ZSn1qjfeYxJ1V9BDRsfN7r0lVC8sF_w5OJlSomw64qampRylAQIDJiABIVgguxHN3W6ehp0VWXKaMNie1J82MVJCFZYScau74o17cx8iWCDb1jkTLi7lYZZbgwUwpqAk8QmIiPMTVQUVkhGEyGrKww",
    );
  });
}

export { testUtils };
