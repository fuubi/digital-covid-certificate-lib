import {DccCose} from "../model/DccCose";

export class Verifier {

    static async verify(cryptoKey: CryptoKey, alg: AlgorithmIdentifier, dccCose: DccCose): Promise<boolean>{
        return crypto.subtle.verify(
            alg,
            cryptoKey, //from generateKey or importKey above
            dccCose.signature, //ArrayBuffer of the signature
            dccCose.getContentToSign() //ArrayBuffer of the data
        )
    }
}
