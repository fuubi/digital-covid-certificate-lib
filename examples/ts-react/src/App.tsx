import React from 'react';
import './App.css';
import {
    Base45Decoder,
    CborDecoder, CH_KEYS_UPDATE_LIST_JWT, CH_ROOT_CERTIFICATE,
    ChKeyStore,
    CoseDecoder,
    DccBase45, Jwt, Verifier,
    ZlibDecoder
} from "digital-covid-certificate-lib";

function App() {
   const validVaccinationCert = "HC1:NCFK60DG0/3WUWGSLKH47GO0Y%5S.PK%96L79CK-500XK0JCV496F3PYJ-982F3:OR2B8Y50.FK6ZK7:EDOLOPCO8F6%E3.DA%EOPC1G72A6YM86G7/F6/G80X6H%6946746T%6C46/96SF60R6FN8UPC0JCZ69FVCPD0LVC6JD846Y96C463W5307+EDG8F3I80/D6$CBECSUER:C2$NS346$C2%E9VC- CSUE145GB8JA5B$D% D3IA4W5646646-96:96.JCP9EJY8L/5M/5546.96SF63KC.SC4KCD3DX47B46IL6646H*6Z/ER2DD46JH8946JPCT3E5JDLA7$Q69464W51S6..DX%DZJC2/DYOA$$E5$C JC3/D9Z95LEZED1ECW.C8WE2OA3ZAGY8MPCG/DU2DRB8MTA8+9$PC5$CUZC$$5Y$5FBB*10GBH A81QK UV-$SOGD1APAB4$5UV C-EWB4T*6H%QV/DAP9L7J3Y4O/WVI5IW3672HO-HV16IW3JHV-FI%WJCPBI8QTE008I+FPR01MYFA6EBN2SR3H+4KH1M9RCIM2 VV15REG 516N93SS70RBUCH-RJM2JMULZ6*/HBBW7W7:S2BU7T6PRTMF4ALUNEXH3P7 LE0YF0TGE461PBK9TD68HDIT4AIFD9NH14V%GBCONJOV$KN  C+3U-IT$SE-A2V+9UO9WYRJ4HN+M/Z5W$QEDT/8C:88OQ4DXOBBIQ453863NPW0EJXG8$GH1T 38C*UI6T /FCDC%6VLNOA6W6BEYJJUH2Z-SOJO1D7JMALD8 $1%5B.GH$7AQOHZ:K3BNO1"
  const dccBase45 = new DccBase45(validVaccinationCert)

    const dccZlib = Base45Decoder.decode(dccBase45)
    console.log("Dcc Zlib:")
    console.log(dccZlib)


    const dccCbor = ZlibDecoder.decode(dccZlib);
    console.log("Dcc Cbor:")
    console.log(dccCbor)

    const dccCose = CborDecoder.decode(dccCbor)
    console.log("Dcc Cose:")
    console.log(dccCose)

    const eudcc = CoseDecoder.decode(dccCose)
    console.log("Eudcc:")
    console.log(eudcc)

    const as =  async () => {

        const keystore = new ChKeyStore()
        await keystore.loadKeys(
            {
                jwt: new Jwt(CH_KEYS_UPDATE_LIST_JWT),
                verifySignature: true,
                rootCertificate: CH_ROOT_CERTIFICATE
            }
        )
        console.log(keystore)

        const kid = dccCose.getSignedHeaderAsJson().kid
        const publicKey = await keystore.getKey(kid)
        const valid = await Verifier.verify(publicKey,
            {
                name: "RSA-PSS",
                // @ts-ignore
                saltLength: 32, //the length of the salt
            },
            dccCose
        )
        console.log(`Valid certificate: ${valid}`)
    }

    as()
    return (
        <div className="App">
            Load DCC and verify signature.
            <p>Have a look at the console log output.</p>
    </div>
  );
}

export default App;
