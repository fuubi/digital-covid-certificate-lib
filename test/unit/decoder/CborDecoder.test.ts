import * as cbor from "cbor-web";
import {CborDecoder} from "../../../src/decoder/CborDecoder";
import {Cose} from "../../../src/model/DccBase45";

describe("Test the cbor decoder lib cbor-web", ( ) => {
    test("Should decode the cbor buffer to an cose object", () =>{
        const dummyCose: Cose = {
            tag: -18,
            value: [Buffer.from([1, 2, 3]), Buffer.from(""), cbor.encodeOne({test: "ok"}, {canonical: true} ), Buffer.from([12,13])]
        }
        const encodedValue = cbor.encodeOne(dummyCose)
        const dccCose = CborDecoder.decode(encodedValue)
        expect(Buffer.from(dccCose.signedHeader).equals(dummyCose.value[0])).toBeTruthy()
        expect(Buffer.from(dccCose.unsignedHeader).equals(dummyCose.value[1])).toBeTruthy()
        expect(Buffer.from(dccCose.payload).equals(dummyCose.value[2])).toBeTruthy()
        expect(Buffer.from(dccCose.signature).equals(dummyCose.value[3])).toBeTruthy()

        const jsonPayload = dccCose.getPayloadAsJson()
        expect(jsonPayload).toStrictEqual({test: "ok"})

    })
})
