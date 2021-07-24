import {Base45Decoder} from "../../../src/decoder/Base45Decoder";
import {DccBase45} from "../../../src";

describe("Test the base45 decoder", ( ) => {
    test("Decode base45 0 to unit8Array [0]", () =>{
        const base45 = "0"
        const unit8Buffer = Base45Decoder.decode(new DccBase45(base45))
        expect(unit8Buffer.equals(new Buffer([0]))).toBeTruthy();
    })

    test("Decode base45 aa to unit8Array [210]", () =>{
        const base45 = "aa"
        const unit8Buffer = Base45Decoder.decode(new DccBase45(base45))
        expect(unit8Buffer.equals(new Buffer([210]))).toBeTruthy();
    })

})
