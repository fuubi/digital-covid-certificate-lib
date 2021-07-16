import base45 from 'base45';

type Base45 = string;
type DccType = 'HC1';

export class DccBase45 {
    public readonly type: DccType
    public readonly certificate: Base45
    public readonly certificateZlib: Buffer

    constructor(public readonly certificateWithPrefix: Base45) {
        this.type = certificateWithPrefix.substr(0,3) as DccType;
        this.certificate = this.certificateWithPrefix.substr(4)

        if (this.type !== 'HC1') {
            throw new Error(`Certificate Type: ${this.type} is not supported.`)
        }
        this.certificateZlib = base45.decode(this.certificate)
    }
}


