import {Jwt} from "../Jwt";
import {Convert} from "pvtsutils";
import {X509Certificate} from "@peculiar/x509";

export type ChKeyStoreIdentifier = string
export type ChKeyStoreLoadingArgs = {
    jwt: Jwt, verifySignature: boolean
    rootCertificate?: X509Certificate
}

export class ChKeyStore implements IKeyStore<ChKeyStoreLoadingArgs, ChKeyStoreIdentifier>{
    private keys: ({keyId: string} & JsonWebKey)[]
    constructor() {
    }

    private async verifyCertificateChain(args: ChKeyStoreLoadingArgs){
        const {jwt, rootCertificate} = args;
        const trustChain:  X509Certificate[] = jwt.header.x5c.map(cert => new X509Certificate(cert))
        if(rootCertificate){
            trustChain.push(rootCertificate)
        }
        for (let i = 0; i < trustChain.length; i++) {
            const valid = await trustChain[i].verify({date: new Date(), publicKey: trustChain[i+1]})
            if(!valid){
                throw new Error("Invalid certificate.")
            }
        }
    }

    getKey(keyId: ChKeyStoreIdentifier): Promise<CryptoKey>{
        console.log(this.keys)
        const keyData =  this.keys.filter(key => key.keyId  === keyId).pop()
        return this.mapToCryptoKey(keyData);
    }

    async loadKeys(loadingArgs: ChKeyStoreLoadingArgs) {
        if (loadingArgs.verifySignature) {
            await this.verifyCertificateChain(loadingArgs)
            // await this.verifyJwtSignature(loadingArgs) // todo fix validation - does not work yet
        }

        this.keys = loadingArgs.jwt.payload.certs
    }

    private mapToCryptoKey(keyData: { keyId: string } & JsonWebKey) {
        const format = "jwk"
        keyData.kty = "RSA";
        keyData.ext = true
        keyData.alg = keyData.alg === 'RS256' ? "PS256" : keyData.alg
        // RS256 is not known to WebCrypto Api

        const toBase64Url = (str) => Convert.ToBase64Url(Convert.FromBase64(str))
        keyData.e = toBase64Url(keyData.e)
        keyData.n = toBase64Url(keyData.n)
        const algorithm = {
            name: "RSA-PSS",
            // can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
            hash: {name: "SHA-256"},
        }
        // whether the key is extractable (i.e. can be used in exportKey)
        const extractable = false
        // "verify" for public key import, "sign" for private key imports
        const keyUsages: KeyUsage[] = ["verify"]
        return crypto.subtle.importKey(
            format,
            keyData,
            algorithm,
            extractable,
            keyUsages
        )
    }

    private async verifyJwtSignature(arg: ChKeyStoreLoadingArgs) {
        const {jwt} = arg;
        const certificate:  X509Certificate = jwt.header.x5c.map(cert => new X509Certificate(cert))[0]
        const publicKey = await certificate.publicKey.rawData //ArrayBuffer of the signature
        const contentToSing = jwt.signedContent
        let algorithm = { name: "HMAC", hash: "SHA-256" };
        const cryptoKey = await crypto.subtle.importKey(
            "raw", // raw format of the key - should be Uint8Array
            publicKey,
            algorithm,
            false, // export
            ["verify"] // what this key can do
        )

        const valid  = await crypto.subtle.verify(
            algorithm,
            cryptoKey, //from generateKey or importKey above
            publicKey, //ArrayBuffer of the signature
            contentToSing //ArrayBuffer of the data
        )

    return valid
    }
}
