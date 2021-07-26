import {ValueSetValue} from "../../data/ValueSets";
import {VaccinationCertificate} from "./VaccinationCertifiacte";
import {TestCertificate} from "./TestCertifiacte";
import {RecoveryCertificate} from "./RecoveryCertificate";

export type EudccPerson = {
    familyName: string,
    familyNameStandardised: string,
    givenName:string,
    givenNameStandardised: string,
    dateOfBirth: string
}

export type EudccCertificate = VaccinationCertificate | TestCertificate | RecoveryCertificate

export type EudccVaccinationGroup = {
    uniqueCertificateIdentifier: string;
    certificateIssuer: string;
    disease: ValueSetValue,
    vaccineOrProphylaxis: ValueSetValue
    vaccineProduct: ValueSetValue
    vaccineManufacturer: ValueSetValue,
    doseNumber: number,
    overallDoseNumber: number,
    vaccinationDate: string,
    vaccinationCountry: string
}

export type RapidAntigenTestDeviceDocument = {
    extracted_on: string
    deviceList: RapidAntigenTestDevice[]
}

export type RapidAntigenTestDevice = {
    id_device: string, commercial_name: string,
    manufacturer: { id_manufacturer: string, name: string, country: string, website: string},
    hsc_common_list: boolean, hsc_mutual_recognition:boolean, last_updated: string,
    hsc_list_history:{list_date:string,in_common_list:boolean,in_mutual_recognition:boolean}[]
}

export type EudccTestGroup = {
    uniqueCertificateIdentifier: string;
    certificateIssuer: string;
    testingCountry: string;
    testingCentre: string;
    testResult: ValueSetValue;
    testDate: Date;
    testDevice?: RapidAntigenTestDevice
    testName: string;
    testType: ValueSetValue
    disease: ValueSetValue
}

export type EudccRecoeryGroup = {
    disease: ValueSetValue
    firstPositiveTestDate: string;
    testingCountry: string;
    certificateIssuer: string;
    certificateValidFrom: string;
    certificateValidUntil: string;
    uniqueCertificateIdentifier: string;
}
