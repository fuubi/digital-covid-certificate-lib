import { EudccPerson, EudccVaccinationGroup } from "./EudccFields";
import { EudccHcert } from "./EudccHcert";

export class VaccinationCertificate extends EudccHcert{
    constructor(
        public readonly schemaVersion: string,
        public readonly person: EudccPerson,
        public readonly infromation: EudccVaccinationGroup
    ) {
        super(schemaVersion, person)
    }
}
