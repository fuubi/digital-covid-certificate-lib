import {DccCbor, DccCose} from "../model/DccBase45";
import * as cbor from "cbor-web";

export class CborDecoder {
    static decode(cert: DccCbor): DccCose {
        return cbor.decode(cert)
    }
}
