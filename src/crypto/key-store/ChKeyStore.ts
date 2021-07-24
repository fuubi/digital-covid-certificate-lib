import {Jwt} from "../Jwt";
import {Convert} from "pvtsutils";

export type ChKeyStoreIdentifier = string
export type ChKeyStoreLoadingArgs = {
    jwt: Jwt, verifySignature: boolean
}
export class ChKeyStore implements IKeyStore<ChKeyStoreLoadingArgs, ChKeyStoreIdentifier>{
    private keys: ({keyId: string} & JsonWebKey)[]
    constructor() {
    }

    private loadX509CertificatChain(jwt: Jwt, checkSignature: boolean){
        if (checkSignature) {
            throw new Error("Not implemented")
        }else {
            throw new Error("Not implemented")
        }
    }

    getKey(keyId: ChKeyStoreIdentifier): Promise<CryptoKey>{
        console.log(this.keys)
        const keyData =  this.keys.filter(key => key.keyId  === keyId).pop()
        console.log(keyData)
        return this.mapToCryptoKey(keyData);
    }

    loadKeys(loadingArgs: ChKeyStoreLoadingArgs) {
        if (loadingArgs.verifySignature) {
            throw new Error("Not implemented")
        }else {
            this.keys = loadingArgs.jwt.payload.certs
        }
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
}
