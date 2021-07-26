import base45 from "base45";
import {DccBase45} from "../model/DccBase45";
import {DccZlibCompressed} from "../model/DccZlibCompressed";

export class Base45Decoder {
    static decode(cert: DccBase45): DccZlibCompressed {
        return base45.decode(cert.base45)
    }
}
