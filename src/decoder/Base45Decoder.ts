import {Base45, DccBase45, DccZlibCompressed} from "../model/DccBase45";
import  base45 from "base45";

export class Base45Decoder {
    static decode(cert: DccBase45): DccZlibCompressed {
        return base45.decode(cert.base45)
    }
}
