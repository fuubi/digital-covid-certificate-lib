import { EudccPerson, EudccRecoeryGroup } from "./EudccFields";
import { EudccHcert } from "./EudccHcert";

export class RecoveryCertificate extends EudccHcert{
    constructor(
        public readonly schemaVersion: string,
        public readonly person: EudccPerson,
        public readonly infromation: EudccRecoeryGroup
    ) {
        super(schemaVersion, person)
    }
}
