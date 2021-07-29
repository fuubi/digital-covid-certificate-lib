import * as cbor from "cbor-web";
import {Convert} from "pvtsutils";

export class DccCose {
    public signedHeader: CoseSignedHeader;
    public unsignedHeader: CoseUnsignedHeader;
    public payload: CosePayload;
    public signature: CoseSignature;
    private payloadAsJson: any;
    private signedHeaderAsJson: {kid?: string} = {};

    constructor(private readonly cose: Cose) {
        this.signedHeader   = cose.value[CoseKeys.CoseSignedHeader]
        this.unsignedHeader = cose.value[CoseKeys.CoseUnsignedHeader]
        this.payload        = cose.value[CoseKeys.CosePayload]
        this.signature      = cose.value[CoseKeys.CoseSignature]
        this.payloadAsJson  = cbor.decode(this.payload)
        this.decodeHeader()
    }

    getContentToSign(){
        return  cbor.encode(["Signature1", this.signedHeader, Buffer.from(''), this.payload])
        // importnat the unsigned header field must be a empty buffer object
        // Uint8Array yields the wrong Byte!!! by the cbor encoder!
        // This might be a edge case (bug??) from the cbor lib as it works fine with signedHeader and payload UnitArrays
    }

    getPayloadAsJson(): any{
        return this.payloadAsJson
    }

    getSignedHeaderAsJson(): any{
        return this.signedHeaderAsJson;
    }

    private decodeHeader(){
        // https://www.iana.org/assignments/cose/cose.xhtml#header-parameters
        const headerKeys = {kid: 4}
        const header = cbor.decode(this.signedHeader)
        if(header.get(headerKeys.kid)){
            this.signedHeaderAsJson.kid = Convert.ToBase64(header.get(headerKeys.kid))
        }
    }
}


export type CoseSignedHeader = Uint8Array
export type CoseUnsignedHeader = Uint8Array
export type CosePayload = Uint8Array
export type CoseSignature = Uint8Array
export const CoseKeys = {
    CoseSignedHeader: 0,
    CoseUnsignedHeader: 1,
    CosePayload: 2,
    CoseSignature: 3
}
export type Cose ={
    tag: number,
    value: [
        CoseSignedHeader,
        CoseUnsignedHeader,
        CosePayload,
        CoseSignature
    ]
}
