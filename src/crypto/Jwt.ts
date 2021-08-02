import {Convert} from "pvtsutils";

export class Jwt {
    public header: any
    public payload: any
    public signature: ArrayBuffer
    public toBeSigned: ArrayBuffer

    constructor(public raw: string) {
        const {0: header, 1: payload, 2: signature} = raw.split(".")
        if (!header || !payload || !signature) {
            throw Error("Only Json Web Token (JWT) with 3 parts are supported. See: https://datatracker.ietf.org/doc/html/rfc7519#section-3.1")
        }
        this.header = JSON.parse(atob(header));
        this.payload = JSON.parse(atob(payload));
        this.signature = Convert.FromBase64Url(signature);
        this.toBeSigned = Buffer.from(`${header}.${payload}`,"ascii");
    }

}


