import * as cbor from "cbor-web";
import {CborDecoder} from "../../../src";
import {Cose} from "../../../src";


describe("Test the cbor decoder lib cbor-web", ( ) => {
    test("Should decode the cbor buffer to an cose object", () =>{

        const dummyHeader = Buffer.from([ 162, 1, 56, 36, 4, 72, 46, 93, 205, 63, 77, 243, 59, 22])
        //  TypeError: The "chunk" argument must be one of type string, Buffer, or Uint8Array. Received type object
        // ok in node test env:
        // todo add a jest conf for test which should run in node env
        // or fix the type error for jsdom
        const dummyCose: Cose = {
            tag: -18,
            value: [dummyHeader, Buffer.from(""), cbor.encodeOne({test: "ok"}, {canonical: true} ), Buffer.from([12,13])]
        }
        const encodedValue = cbor.encodeOne(dummyCose)
        const dccCose = CborDecoder.decode(encodedValue)
        expect(Buffer.from(dccCose.signedHeader).equals(dummyCose.value[0])).toBeTruthy()
        expect(Buffer.from(dccCose.unsignedHeader).equals(dummyCose.value[1])).toBeTruthy()
        expect(Buffer.from(dccCose.payload).equals(dummyCose.value[2])).toBeTruthy()
        expect(Buffer.from(dccCose.signature).equals(dummyCose.value[3])).toBeTruthy()

        const jsonPayload = dccCose.getPayloadAsJson()
        expect(jsonPayload).toStrictEqual({test: "ok"})

        const jsonSignedHeader = dccCose.getSignedHeaderAsJson()
        expect(jsonSignedHeader).toStrictEqual({kid: "Ll3NP03zOxY="})

    })
})

