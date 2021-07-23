import {KeyStore} from "../../../src/crypto/KeyStore";
import {CH_KEYS_UPDATE_LIST_JWT} from "../../../src/data/ch-keys/updatelistJwt";

describe("Test the key store", ( ) => {
    test("Should load the signing keys from a JWT (without signature verification)", async () =>{
        const keyStore = new KeyStore()
        keyStore.loadFromJWT(CH_KEYS_UPDATE_LIST_JWT, false)
        keyStore.getKey("id")
        }
    )}
)
