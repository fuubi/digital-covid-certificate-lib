import {Jwt} from "./Jwt";

export class KeyStore {
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


    public loadFromJWT(jwt: Jwt, verifySignature: boolean){

        if (verifySignature) {
            throw new Error("Not implemented")
        }else {
            this.keys = jwt.payload.certs
        }
    }

    getKey(kid:string){
       return  this.keys.filter(key => key.keyId === kid).pop()
    }


}
