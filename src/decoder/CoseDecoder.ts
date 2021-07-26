import {DccCose} from "../model/DccCose";
import {EudccCertificate} from "../model/eudcc-hcert/EudccFields";
import {DccHcertFactory} from "../model/eudcc-hcert/EudccHcertFactory";


export class CoseDecoder {
    static decode(cert: DccCose): EudccCertificate {
       return DccHcertFactory.create(cert)
    }
}
