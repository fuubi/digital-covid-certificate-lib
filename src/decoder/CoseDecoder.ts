import {Dcc, DccCose} from "../model/DccBase45";


export class CoseDecoder {
    static decode(cert: DccCose): Dcc {
       return new Dcc(cert)

    }
}
