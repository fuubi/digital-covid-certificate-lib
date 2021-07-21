export type ValueSetDocument = {
    valueSetId: string,
    valueSetDate: string,
    valueSetValues: {[key: string]: ValueSetValue}
}

export type ValueSetValue = {
    "display": string,
    "lang": string,
    "active": boolean,
    "version": string,
    "system": string
}

export const getValueSetValue = (valueSet: ValueSetDocument) =>  (code: string, lang: 'en') => {
    return valueSet.valueSetValues[code]
}
