import {Jwt} from "../Jwt";

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

    getKey(keyId: ChKeyStoreIdentifier) {
        return  this.keys.filter(key => key.keyId  === keyId).pop()
    }

    loadKeys(loadingArgs: ChKeyStoreLoadingArgs) {
        if (loadingArgs.verifySignature) {
            throw new Error("Not implemented")
        }else {
            this.keys = loadingArgs.jwt.payload.certs
        }
    }
}
