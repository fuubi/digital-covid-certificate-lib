import {DccBase45} from "../../../src/model/DccBase45";

describe("Test the base45", ( ) => {
    test("Return the type", () =>{
        const base45Cert =  new DccBase45('HC1:0')
        expect(base45Cert).toBeDefined();
        expect(base45Cert.type).toBe('HC1');
        expect(base45Cert.certificateZlib.equals(new Buffer([0]))).toBeTruthy();
        expect(base45Cert.certificate).toBe('0');
    })

    test("Return the type 1", () =>{
        const base45Cert =  new DccBase45('HC1:aa')
        expect(base45Cert).toBeDefined();
        expect(base45Cert.type).toBe('HC1');
        expect(base45Cert.certificateZlib.equals(new Buffer([210]))).toBeTruthy();
        expect(base45Cert.certificate).toBe('aa');
    })

    test("Throw an error for unsupported certificate types", () =>{
        expect(() => new DccBase45('UPS:0')).toThrowError("Certificate Type: UPS is not supported.")
    })

})
