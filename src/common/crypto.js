let webcrypto, subtleCrypto;

if (typeof crypto !== "undefined") {
    webcrypto = crypto;
    subtleCrypto = crypto.subtle;
} else {
    (async function () {
        const { Crypto } = await import('@peculiar/webcrypto');
        webcrypto = new Crypto();
        subtleCrypto = webcrypto.subtle;
    }());
}

export { webcrypto, subtleCrypto }; 