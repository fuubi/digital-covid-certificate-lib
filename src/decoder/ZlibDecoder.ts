import pako from 'pako'
import { DccCbor } from '../model/DccCbor'
import { DccZlibCompressed } from '../model/DccZlibCompressed'

export class ZlibDecoder {
    static decode(cert: DccZlibCompressed): DccCbor {
        return pako.inflate(cert)
    }
}
