// deno-lint-ignore-file
// Fix Deno global
if (typeof Deno === "undefined") {
  global.Deno = {
    permissions: false,
  };
}

let webauthnCrypto;

// If using node, crypto has to be imported
if (typeof crypto === "undefined") {
  webauthnCrypto = (await import("crypto")).webcrypto;
  // Also register global
  global.crypto = webauthnCrypto;

  // If using Deno, crypto is already avalable as a global
} else {
  webauthnCrypto = crypto;
}

export { webauthnCrypto };
