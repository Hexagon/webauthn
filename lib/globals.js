// deno-lint-ignore-file
// Fix Deno global
if (typeof Deno === "undefined") {
  global.Deno = {
    permissions: false,
  };
}

// Fix crypto global in node
if (typeof crypto === "undefined") {
  // deno-lint-ignore
  global.crypto = (await import("crypto")).webcrypto;
}
