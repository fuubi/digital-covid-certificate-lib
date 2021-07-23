import {CH_KEYS_UPDATE_LIST_JWT} from "../../../src/data/ch-keys/updatelistJwt";
import {Jwt} from "../../../src/crypto/Jwt";

describe("Test the jwt", ( ) => {
    test("Should parse the JWT", async () =>{
            const jwt = new Jwt(CH_KEYS_UPDATE_LIST_JWT)
        expect(jwt.header.alg).toBe("RS256")
        expect(jwt.header.x5c.length).toBe(2)

        expect(jwt.payload.certs.length).toBe(131)
        expect(jwt.mac instanceof ArrayBuffer).toBeTruthy()
        }
    )}
)
