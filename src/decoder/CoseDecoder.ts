import {EudccHcert, DccCose, DccHcertFactory, VaccinationCertificate, EudccCertificate} from "../model/DccBase45";


export class CoseDecoder {
    static decode(cert: DccCose): EudccCertificate {
       return DccHcertFactory.create(cert)
    }
}
