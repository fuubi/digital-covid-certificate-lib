# Digital Covid Certificate Lib (DccLib)

DccLib is a TypeScript library that decodes and verifies the European Digital Covid Certificate (Eudcc) in modern web
browsers. For now the library has only been tested with Swiss certificates. In theories other DCC's should also work as
long as they follow Eudcc specification, and the provided singing keys are valid.

This work is primarily intended for educational purposes. In fact, it was a project as part of an internal hackathon at
the University of Basel.

- [TsDocs](https://fuubi.github.io/digital-covid-certificate-lib/)
- [Demo](https://fuubi.github.io/digital-covid-certificate-lib/demo)
    - The demo is not very user-friendly... Sorry for that, but have a look at the console to interact directly with your certificate.
- Example Projects
  - [js-webpack](https://github.com/FUUbi/digital-covid-certificate-lib/tree/main/examples/js-webpack)
    is a sample project using JavaScript and Webpack.
  - [ts-react](https://github.com/FUUbi/digital-covid-certificate-lib/tree/main/examples/ts-react) 
    is a sample project using TypeScript and React.
    
    
## List of all features:

- decode the Eudcc 
    - [Base45Decoder](./src/decoder/Base45Decoder.ts)
    - [ZlibDecoder](./src/decoder/ZlibDecoder.ts)
    - [CborDecoder](./src/decoder/CborDecoder.ts)
    - [CoseDecoder](./src/decoder/CoseDecoder.ts)
- dereference EU eHealthNetwork Digitial Covid Certificate [value sets](https://github.com/ehn-dcc-development/ehn-dcc-valuesets)
- load and verify DCC Signing Keys from JSON Web Token (JWT)
- verify x509 Certificate Trust Chain
- verify DCC 

## Examples
The following two examples show how to decode and verify the validity of the DCC.

### Example 1
- Step wise decode DCC
- Load DCC keys from JWT
- Verify DCC key JWT signature and certificate chain 
- Verify the DCC 

```typescript
import {
  Base45Decoder,
  CborDecoder, ChKeyStore,
  CoseDecoder,
  DccBase45,
  Jwt,
  Verifier,
  ZlibDecoder,
  CH_KEYS_UPDATE_LIST_JWT, CH_ROOT_CERTIFICATE
} from "digital-covid-certificate-lib";

const validVaccinationCert = "HC1:NCFK60DG0/3WUWGSLKH47GO0Y%5S.PK%96L79CK-500XK0JCV496F3PYJ-982F3:OR2B8Y50.FK6ZK7:EDOLOPCO8F6%E3.DA%EOPC1G72A6YM86G7/F6/G80X6H%6946746T%6C46/96SF60R6FN8UPC0JCZ69FVCPD0LVC6JD846Y96C463W5307+EDG8F3I80/D6$CBECSUER:C2$NS346$C2%E9VC- CSUE145GB8JA5B$D% D3IA4W5646646-96:96.JCP9EJY8L/5M/5546.96SF63KC.SC4KCD3DX47B46IL6646H*6Z/ER2DD46JH8946JPCT3E5JDLA7$Q69464W51S6..DX%DZJC2/DYOA$$E5$C JC3/D9Z95LEZED1ECW.C8WE2OA3ZAGY8MPCG/DU2DRB8MTA8+9$PC5$CUZC$$5Y$5FBB*10GBH A81QK UV-$SOGD1APAB4$5UV C-EWB4T*6H%QV/DAP9L7J3Y4O/WVI5IW3672HO-HV16IW3JHV-FI%WJCPBI8QTE008I+FPR01MYFA6EBN2SR3H+4KH1M9RCIM2 VV15REG 516N93SS70RBUCH-RJM2JMULZ6*/HBBW7W7:S2BU7T6PRTMF4ALUNEXH3P7 LE0YF0TGE461PBK9TD68HDIT4AIFD9NH14V%GBCONJOV$KN  C+3U-IT$SE-A2V+9UO9WYRJ4HN+M/Z5W$QEDT/8C:88OQ4DXOBBIQ453863NPW0EJXG8$GH1T 38C*UI6T /FCDC%6VLNOA6W6BEYJJUH2Z-SOJO1D7JMALD8 $1%5B.GH$7AQOHZ:K3BNO1"
const dccBase45 = new DccBase45(validVaccinationCert)
const dccZlib = Base45Decoder.decode(dccBase45)
const dccCbor = ZlibDecoder.decode(dccZlib);
const dccCose = CborDecoder.decode(dccCbor)
const eudcc   = CoseDecoder.decode(dccCose)


const keystore = new ChKeyStore()
await keystore.loadKeys(
          {
            jwt: new Jwt(CH_KEYS_UPDATE_LIST_JWT),
            verifySignature: true,
            rootCertificate: CH_ROOT_CERTIFICATE
          }
  )


const kId = dccCose.getSignedHeaderAsJson().kid
const publicKey = await keystore.getKey(kId)
const valid = await Verifier.verify(publicKey,
          {
            name: "RSA-PSS",
            saltLength: 32, 
          },
          dccCose
  )
```

### Example 2
- Create a chain decoder
- Load DCC keys from JWT
- Verify the DCC

```typescript
// same imports as for example 1

const validVaccinationCert = "HC1:NCFK60DG0/3WUWGSLKH47GO0Y%5S.PK%96L79CK-500XK0JCV496F3PYJ-982F3:OR2B8Y50.FK6ZK7:EDOLOPCO8F6%E3.DA%EOPC1G72A6YM86G7/F6/G80X6H%6946746T%6C46/96SF60R6FN8UPC0JCZ69FVCPD0LVC6JD846Y96C463W5307+EDG8F3I80/D6$CBECSUER:C2$NS346$C2%E9VC- CSUE145GB8JA5B$D% D3IA4W5646646-96:96.JCP9EJY8L/5M/5546.96SF63KC.SC4KCD3DX47B46IL6646H*6Z/ER2DD46JH8946JPCT3E5JDLA7$Q69464W51S6..DX%DZJC2/DYOA$$E5$C JC3/D9Z95LEZED1ECW.C8WE2OA3ZAGY8MPCG/DU2DRB8MTA8+9$PC5$CUZC$$5Y$5FBB*10GBH A81QK UV-$SOGD1APAB4$5UV C-EWB4T*6H%QV/DAP9L7J3Y4O/WVI5IW3672HO-HV16IW3JHV-FI%WJCPBI8QTE008I+FPR01MYFA6EBN2SR3H+4KH1M9RCIM2 VV15REG 516N93SS70RBUCH-RJM2JMULZ6*/HBBW7W7:S2BU7T6PRTMF4ALUNEXH3P7 LE0YF0TGE461PBK9TD68HDIT4AIFD9NH14V%GBCONJOV$KN  C+3U-IT$SE-A2V+9UO9WYRJ4HN+M/Z5W$QEDT/8C:88OQ4DXOBBIQ453863NPW0EJXG8$GH1T 38C*UI6T /FCDC%6VLNOA6W6BEYJJUH2Z-SOJO1D7JMALD8 $1%5B.GH$7AQOHZ:K3BNO1"

const coseChainDecoder = (cert: string) => CborDecoder.decode(ZlibDecoder.decode(Base45Decoder.decode(new DccBase45(cert))))
const dccCose = coseChainDecoder(validVaccinationCert)

const keystore = new ChKeyStore()
await keystore.loadKeys(
        {
          jwt: new Jwt(CH_KEYS_UPDATE_LIST_JWT),
          verifySignature: false,
        }
)

const kId = dccCose.getSignedHeaderAsJson().kid
const publicKey = await keystore.getKey(kId)
const valid = await Verifier.verify(publicKey,
        {
          name: "RSA-PSS",
          saltLength: 32,
        },
        dccCose
)
```
