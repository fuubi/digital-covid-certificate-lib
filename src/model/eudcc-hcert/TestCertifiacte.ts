import { EudccPerson, EudccTestGroup } from "./EudccFields";
import { EudccHcert } from "./EudccHcert";

export class TestCertificate extends EudccHcert{
    constructor(
        public readonly schemaVersion: string,
        public readonly person: EudccPerson,
        public readonly infromation: EudccTestGroup
    ) {
        super(schemaVersion, person)
    }
}
