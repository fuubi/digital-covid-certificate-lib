export class KeyStore {
    private keys
    constructor() {
    }

    private loadX509CertificatChain(jwt: string, checkSignature: boolean){
        if (checkSignature) {
            throw new Error("Not implemented")
        }else {
            throw new Error("Not implemented")
        }
    }


    public loadFromJWT(jwt: string, verifySignature: boolean){
        if (verifySignature) {
            throw new Error("Not implemented")
        }else {
            throw new Error("Not implemented")
        }
    }

    getKey(kid:string){
        throw new Error("Not implemented")
    }
}
