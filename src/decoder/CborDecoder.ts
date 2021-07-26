import * as cbor from "cbor-web";
import {DccCose} from "../model/DccCose";
import {DccCbor} from "../model/DccCbor";

export class CborDecoder {
    static decode(cert: DccCbor): DccCose {
        return new DccCose(cbor.decode(cert))
    }
}
