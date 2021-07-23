import {Convert} from "pvtsutils";

export class Jwt {
    public header: any
    public payload: any
    public mac: ArrayBuffer

    constructor(jwt: string) {
        const parts = jwt.split(".")
        if (parts.length !== 3) {
            throw Error("Only Json Web Token (JWT) with 3 parts are supported. See: https://datatracker.ietf.org/doc/html/rfc7519#section-3.1")
        }
        this.header = JSON.parse(atob(parts[0]));
        this.payload = JSON.parse(atob(parts[1]));
        this.mac = Convert.FromBase64Url(parts[2]);
    }
}


