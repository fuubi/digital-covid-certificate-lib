import {DccHcert, DccCose, DccHcertFactory} from "../model/DccBase45";


export class CoseDecoder {
    static decode(cert: DccCose): DccHcert {
       return DccHcertFactory.create(cert)
    }
}
