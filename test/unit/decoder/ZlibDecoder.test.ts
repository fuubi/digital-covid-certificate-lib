import pako from "pako"
import {ZlibDecoder} from "../../../src/decoder/ZlibDecoder";

describe("Test the zlib decoder (lib: pako)", ( ) => {
    test("Should decompress a compressed buffer", () =>{
        const value = Buffer.from("hello")
        const compressed = pako.deflate( value)
        const decompressed = ZlibDecoder.decode(compressed)
        expect(decompressed).toStrictEqual(Uint8Array.from(value));
    })
})
