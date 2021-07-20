import * as cbor from "cbor-web";

export class Dcc {
    constructor(public dccCose: DccCose) {

    }
}


export class DccCose {
    public signedHeader: CoseSignedHeader;
    public unsignedHeader: CoseUnsignedHeader;
    public payload: CosePayload;
    public signature: CoseSignature;

    constructor(private readonly cose: Cose) {
        this.signedHeader   = cose.value[CoseKeys.CoseSignedHeader]
        this.unsignedHeader = cose.value[CoseKeys.CoseUnsignedHeader]
        this.payload        = cose.value[CoseKeys.CosePayload]
        this.signature      = cose.value[CoseKeys.CoseSignature]

    }

    getContentToSign(){
       return  cbor.encode(["Signature1", this.signedHeader, this.unsignedHeader, this.payload])
    }

    getPayloadAsJson(): any{
        return cbor.decode(this.payload)
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



export type Base45 = string;
type DccType = 'HC1';

export class DccBase45 {
    public readonly type: DccType
    public readonly base45: Base45

    constructor(public readonly certificateWithPrefix: Base45) {
        this.type = certificateWithPrefix.substr(0,3) as DccType;
        this.base45 = this.certificateWithPrefix.substr(4)

        if (this.type !== 'HC1') {
            throw new Error(`Certificate Type: ${this.type} is not supported.`)
        }
    }
}



export type DccZlibCompressed = Buffer
export type DccCbor = Buffer



