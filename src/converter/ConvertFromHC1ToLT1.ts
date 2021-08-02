import {DccBase45} from "../model/DccBase45";

// This converter can be exported as soon as CORS is enabled on the endpoint.
// Otherwise the request will always fail when executing it the browser...
class ConvertFromHC1ToLT1 {
    private static conversionEndpoint =  "https://covidcertificate-app.bit.admin.ch/app/transform/v1/"
    private static certLightEndpoint = `${ConvertFromHC1ToLT1.conversionEndpoint}certificateLight`

    static async convert(cert: DccBase45){
        const body: BodyInit= JSON.stringify({hcert: cert.certificateWithPrefix });
        const headers: HeadersInit = [["Content-Type", "application/json"]]
        const method: string = 'POST'
        return fetch(this.certLightEndpoint, {body, headers, method})
    }
}
