import {DccCbor, DccZlibCompressed} from "../model/DccBase45";
import pako from 'pako'

export class ZlibDecoder {
    static decode(cert: DccZlibCompressed): DccCbor {
        return pako.inflate(cert)
    }
}
