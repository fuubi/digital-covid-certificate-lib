import {ChKeyStore} from "../../../../src/crypto/key-store/ChKeyStore";
import {Jwt} from "../../../../src/crypto/Jwt";

describe("Test the key store", ( ) => {
    test("Should load the signing keys from a JWT (without signature verification)", async () =>{
        const jwt: Jwt = {header: {}, payload: {certs: [{
                    "keyId": "Ll3NP03zOxY=",
                    "use": "sig",
                    "alg": "RS256",
                    "n": "ALZP+dbLSV1OPEag9pYeCHbMRa45SX5kwqy693EDRF5KxKCNzhFfDZ6LRNUY1ZkK6i009OKMaVpXGzKJV7SQbbt6zoizcEL8lRG4/8UnOik/OE6exgaNT/5JLp2PlZmm+h1Alf6BmWJrHYlD/zp0z1+lsunXpQ4Z64ByA7Yu9/00rBu2ZdVepJu/iiJIwJFQhA5JFA+7n33eBvhgWdAfRdSjk9CHBUDbw5tM5UTlaBhZZj0vA1payx7iHTGwdvNbog43DfpDVLe61Mso+kxYF/VgoBAf+ZkATEWmlytc3g02jZJgtkuyFsYTELDAVycgHWw/QJ0DmXOl0YwWrju4M9M=",
                    "e": "AQAB",
                    "subjectPublicKeyInfo": null,
                    "crv": null,
                    "x": null,
                    "y": null
                }]}, mac: new ArrayBuffer(256)};

        const keyStore = new ChKeyStore()
        keyStore.loadKeys({jwt, verifySignature: false})
        const key = await keyStore.getKey("Ll3NP03zOxY=");
        expect(key).toBeDefined()
        }
    )}
)
