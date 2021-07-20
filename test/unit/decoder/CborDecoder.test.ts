import * as cbor from "cbor-web";
import {CborDecoder} from "../../../src/decoder/CborDecoder";
describe("Test the cbor decoder lib cbor-web", ( ) => {
    test("", () =>{
        const value = [[1, 2, 3], {}, [10, 11], [12,13]]
        const encodedValue = cbor.encodeOne(value)
        const decodedValue = CborDecoder.decode(encodedValue)
        expect(decodedValue).toStrictEqual(value)
    })
})
