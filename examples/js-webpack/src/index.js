// main entry point for index.html

import {
    Base45Decoder,
    CborDecoder, ChKeyStore,
    CoseDecoder,
    DccBase45,
    Jwt,
    Verifier,
    ZlibDecoder,
    CH_KEYS_UPDATE_LIST_JWT, CH_ROOT_CERTIFICATE
} from "digital-covid-certificate-lib";



async function onScanSuccess(decodedText, decodedResult) {
    let infoInnerHtml = ""
    const infoEl = document.getElementById("info");
    const appendText = (html) => {infoInnerHtml += html; infoEl.innerHTML = infoInnerHtml}
    appendText("<p> 1. Scanned the QRcode and logged the Dcc Base45 object in the Browser Console.</p>")
    const dccBase45 = new DccBase45(decodedResult.decodedText)
    console.log("Dcc Base45:")
    console.log(dccBase45)

    try {

        const dccZlib = Base45Decoder.decode(dccBase45)
        console.log("Dcc Zlib:")
        console.log(dccZlib)
        appendText("<p> 2. Decoded the Base45 and logged the Dcc Zlib object in the Browser Console.</p>")


        const dccCbor = ZlibDecoder.decode(dccZlib);
        console.log("Dcc Cbor:")
        console.log(dccCbor)
        appendText("<p> 3. Decoded the Zlib compressed buffer and logged the Dcc Cbor object in the Browser Console.</p>")

        const dccCose = CborDecoder.decode(dccCbor)
        console.log("Dcc Cose:")
        console.log(dccCose)
        appendText("<p> 4. Decoded the cbor buffer and  logged the Dcc Cose object in the Browser Console.</p>")

        const eudcc = CoseDecoder.decode(dccCose)
        console.log("Eudcc:")
        console.log(eudcc)
        appendText("<p> 5. Decoded the cose object and logged the Eudcc object in the Browser Console.</p>")


        const rootCertificate = document.getElementById("root-certificate").textContent
        const jwt = new Jwt(document.getElementById("valid-signing-keys-jwt").textContent)
        const keystore = new ChKeyStore()
        await keystore.loadKeys(
            {
                jwt,
                verifySignature: true,
                rootCertificate
            }
        )
        appendText("<p> 6. Loaded Ch Key Store.</p>")
        console.log(keystore)

        const kId = dccCose.getSignedHeaderAsJson().kid
        const publicKey = await keystore.getKey(kId)
        const valid = await Verifier.verify(publicKey,
            {
                name: "RSA-PSS",
                saltLength: 32, //the length of the salt
            },
            dccCose
        )
        console.log(`Valid certificate: ${valid}`)

    }catch (e){
        appendText(`<p>Ups... something went wrong. ${e.message} </p>`)
        console.error(e)
    }

}

var html5QrcodeScanner = new Html5QrcodeScanner(
    "reader", { fps: 10 });
html5QrcodeScanner.render(onScanSuccess);

document.getElementById("root-certificate").textContent =  CH_ROOT_CERTIFICATE
document.getElementById("valid-signing-keys-jwt").textContent =  CH_KEYS_UPDATE_LIST_JWT
