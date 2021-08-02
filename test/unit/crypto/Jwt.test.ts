import {CH_KEYS_UPDATE_LIST_JWT} from "../../../src";
import {Jwt} from "../../../src";

describe("Test the jwt", ( ) => {
    test("Should parse CH key update list jwt", async () =>{
            const jwt = new Jwt(CH_KEYS_UPDATE_LIST_JWT)
        expect(jwt.header.alg).toBe("RS256")
        expect(jwt.header.x5c.length).toBe(2)

        expect(jwt.payload.certs.length).toBe(131)
        expect(jwt.signature instanceof ArrayBuffer).toBeTruthy()
        }
    )
    test("Should parse the example token from RFC7519.", async () =>{
            const jwt = new Jwt("eyJ0eXAiOiJKV1QiLA0KICJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJqb2UiLA0KICJleHAiOjEzMDA4MTkzODAsDQogImh0dHA6Ly9leGFtcGxlLmNvbS9pc19yb290Ijp0cnVlfQ.dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk")
            expect(jwt.header.alg).toBe("HS256")
            expect(jwt.header.typ).toBe("JWT")

            expect(jwt.payload.iss).toBe("joe")
            expect(jwt.signature instanceof ArrayBuffer).toBeTruthy()
            }
        )

        test("Should throw a error for incompatible jwt", async () =>{
                expect(() => new Jwt("eyJhbGciOiJSUzI1NiJ9")).toThrowError()
            }
        )
    }
)
