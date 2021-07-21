import {EudccHcert, DccCose, DccHcertFactory, VaccinationCertificate} from "../model/DccBase45";


export class CoseDecoder {
    static decode(cert: DccCose): VaccinationCertificate {
       return DccHcertFactory.create(cert)
    }
}
