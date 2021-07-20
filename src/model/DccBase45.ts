

export type Base45 = string;
type DccType = 'HC1';
export class DccBase45 {
    public readonly type: DccType
    public readonly base45: Base45

    constructor(public readonly certificateWithPrefix: Base45) {
        this.type = certificateWithPrefix.substr(0,3) as DccType;
        this.base45 = this.certificateWithPrefix.substr(4)

        if (this.type !== 'HC1') {
            throw new Error(`Certificate Type: ${this.type} is not supported.`)
        }
    }
}

