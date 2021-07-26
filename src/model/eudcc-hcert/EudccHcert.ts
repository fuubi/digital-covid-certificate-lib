import {EudccPerson} from "./EudccFields";

export abstract class EudccHcert {

    protected constructor(
        public readonly schemaVersion: string,
        public readonly person: EudccPerson,
    ) {}
}
