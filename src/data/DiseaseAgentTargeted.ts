// https://raw.githubusercontent.com/ehn-dcc-development/ehn-dcc-valuesets/84268b62f6994e687186b3d5f218839d916a978e/disease-agent-targeted.json

type DiseaseAgentTargeted = {
  valueSetId: string,
  valueSetDate: string,
  valuesSetValues: {
    "840539006": DiseaseValueSet
  }
}

export type DiseaseValueSet = {
  "display": string,
  "lang": string,
  "active": boolean,
  "version": string,
  "system": string
}

const  diseaseAgentTargeted: DiseaseAgentTargeted = {
  "valueSetId": "disease-agent-targeted",
  "valueSetDate": "2021-04-27",
  "valuesSetValues": {
    "840539006": {
      "display": "COVID-19",
      "lang": "en",
      "active": true,
      "version": "http://snomed.info/sct/900000000000207008/version/20210131",
      "system": "http://snomed.info/sct"
    }
  }
}

export const getDiseaseValueSet = (code: string, lang: 'en') => {
  return diseaseAgentTargeted.valuesSetValues[code] as DiseaseValueSet
}
