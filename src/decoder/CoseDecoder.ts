import {EudccHcert, DccCose, DccHcertFactory} from "../model/DccBase45";


export class CoseDecoder {
    static decode(cert: DccCose): EudccHcert {
       return DccHcertFactory.create(cert)
    }
}
