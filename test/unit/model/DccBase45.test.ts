import {DccBase45} from "../../../src";

describe("Test the base45", ( ) => {
    test("Return the type", () =>{
        const base45Cert =  new DccBase45('HC1:0')
        expect(base45Cert).toBeDefined();
        expect(base45Cert.type).toBe('HC1');
    })

    test("Return the type 1", () =>{
        const base45Cert =  new DccBase45('HC1:aa')
        expect(base45Cert).toBeDefined();
        expect(base45Cert.type).toBe('HC1');
    })

    test("Throw an error for unsupported certificate types", () =>{
        expect(() => new DccBase45('UPS:0')).toThrowError("Certificate Type: UPS is not supported.")
    })

})
