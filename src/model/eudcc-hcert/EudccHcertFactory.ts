import { COUNTRY_2_LETTER_ISO3166_CODES } from "../../data/Country2LetterISO3166Codes";
import { VSD_DISEASE_AGENT_TARGETED } from "../../data/DiseaseAgentTargeted";
import { HSC_COMMON_RECONGINTION_RAT } from "../../data/HscCommonRecogintionRat";
import { VSD_TEST_RESULTS } from "../../data/TestResult";
import { VSD_TEST_TYPE } from "../../data/TestType";
import { VSD_VACCINE_MANUFACTURER } from "../../data/VaccineManufacturer";
import { VSD_VACCINE_MEDICAL_PRODUCT } from "../../data/VaccineMedicalProduct";
import { VSD_VACCINE_PROPHYLAXIS } from "../../data/VaccineProphylaxis";
import { getValueSetValue } from "../../data/ValueSets";
import { DccCose } from "../DccCose";
import { EudccCertificate, EudccRecoeryGroup, EudccTestGroup } from "./EudccFields";
import { RecoveryCertificate } from "./RecoveryCertificate";
import { TestCertificate } from "./TestCertifiacte";
import { VaccinationCertificate } from "./VaccinationCertifiacte";

const ChPayloadKeys = {
    ISSUER: 1,
    SUBJECT: 2,
    AUDIENCE: 3,
    EXPIRATION: 4,
    NOT_BEFORE: 5,
    ISSUED_AT: 6,
    CWT_ID: 7,

    HCERT: -260,
    LIGHT: -250
}

export class DccHcertFactory {

    static create(dccCose: DccCose): EudccCertificate {
        const version = DccHcertFactory.getValue(dccCose)("ver")
        if(version){
            // could later be used to dereference different version, for now we just ignore it
            return  DccHcertFactory.dereferenceV_1_3_0(dccCose)
        }

    }

    /**
     * https://ec.europa.eu/health/sites/default/files/ehealth/docs/covid-certificate_json_specification_en.pdf
     * @param dccCose
     */
    static dereferenceV_1_3_0(dccCose: DccCose): EudccCertificate {
        const getMetadataValue = DccHcertFactory.getMetaDataValue(dccCose)
        const getValue = DccHcertFactory.getValue(dccCose)
        /**
         * MUST match the identifier of the schema version used for
         * producing the EUDCC.
         *  Example:
         *      "ver": "1.3.0"
         */
        const version = getValue("ver")
        /**
         * Surname(s), such as family name(s), of the holder.
         * Exactly 1 (one) non-empty field MUST be provided, with
         * all surnames included in it. In case of multiple surnames,
         * these MUST be separated by a space. Combination names
         * including hyphens or similar characters must however
         * stay the same.
         * Examples:
         *  "fn": "Musterfrau-Gößinger"
         *  "fn": "Musterfrau-Gößinger Müller"
         */
        const familyName = getValue("nam")["fn"]

        /**
         Surname(s) of the holder transliterated using the same
         convention as the one used in the holder’s machine
         readable travel documents (such as the rules defined in
         ICAO Doc 9303 Part 3).
         Exactly 1 (one) non-empty field MUST be provided, only
         including characters A-Z and <. Maximum length: 80
         characters (as per ICAO 9303 specification).
         Examples:
         "fnt": "MUSTERFRAU<GOESSINGER"
         "fnt": "MUSTERFRAU<GOESSINGER<MUELLER"
         */
        const familyNameStandardised = getValue("nam")["fnt"]

        /**
         * Forename(s), such as given name(s), of the holder.
         If the holder has no forenames, the field MUST be
         skipped.
         In all other cases, exactly 1 (one) non-empty field MUST
         be provided, with all forenames included in it. In case of
         multiple forenames, these MUST be separated by a space.
         Example:
         "gn": "Isolde Erika"
         */
        const givenName = getValue("nam")["gn"]

        /**
         Forename(s) of the holder transliterated using the same
         convention as the one used in the holder’s machine
         readable travel documents (such as the rules defined in
         ICAO Doc 9303 Part 3).
         If the holder has no forenames, the field MUST be
         skipped.
         In all other cases, exactly 1 (one) non-empty field MUST
         be provided, only including characters A-Z and <.
         Maximum length: 80 characters.
         Example:
         "gnt": "ISOLDE<ERIKA"
         */
        const givenNameStandardised = getValue("nam")["gnt"]

        /**
         * Date of birth of the DCC holder.
         Complete or partial date without time restricted to the
         range from 1900-01-01 to 2099-12-31.
         Exactly 1 (one) non-empty field MUST be provided if the
         complete or partial date of birth is known. If the date of
         birth is not known even partially, the field MUST be set to
         an empty string "". This should match the information as
         provided on travel documents.
         One of the following ISO 8601 formats MUST be used if
         information on date of birth is available. Other options are
         not supported.
         YYYY-MM-DD
         YYYY-MM
         YYYY
         (The verifier app may show missing parts of the date of
         birth using the XX convention as the one used in machine-
         readable travel documents, e.g. 1990-XX-XX.)
         Examples:
         "dob": "1979-04-14"
         "dob": "1901-08"
         "dob": "1939"
         "dob": ""
         */
        const dateOfBirth = getValue("dob")
        const person = {
            givenName, givenNameStandardised,
            familyName, familyNameStandardised,
            dateOfBirth
        }

        if(getValue("v")){
            const groupInformation = DccHcertFactory.getVaccinationGroupInformation(dccCose)
            return new VaccinationCertificate(version, person, groupInformation)
        }
        else if (getValue("t")){
            const groupInformation = DccHcertFactory.getTestGroupInformation(dccCose)
            return new TestCertificate(version, person, groupInformation)
        }
        else if (getValue("r")){
            const groupInformation = DccHcertFactory.getRecoveryGroupInformation(dccCose)
            return new RecoveryCertificate(version, person, groupInformation)
        }

        throw new Error("...")

    }

    private static getVaccinationGroupInformation(dccCose: DccCose) {
        const getValue = DccHcertFactory.getValue(dccCose)

        /**
         A coded value from the value set
         disease-agent-targeted.json.
         This value set has a single entry 840539006, which is the code for COVID-
         19 from SNOMED CT (GPS).
         Exactly 1 (one) non-empty field MUST be provided.
         Example:
         "tg": "840539006"
         */
        const diseaseId = getValue("v")[0]["tg"]
        const disease = getValueSetValue(VSD_DISEASE_AGENT_TARGETED)(diseaseId, 'en')

        /**
         Type of the vaccine or prophylaxis used.
         A coded value from the value set
         vaccine-prophylaxis.json.
         The value set will be distributed from the EUDCC Gateway starting with the
         gateway version 1.1.
         Exactly 1 (one) non-empty field MUST be provided.
         Example:
         "vp": "1119349007" (a SARS-CoV-2 mRNA vaccine)
         */
        const vaccineOrProphylaxisId = getValue("v")[0]["vp"]
        const vaccineOrProphylaxis = getValueSetValue(VSD_VACCINE_PROPHYLAXIS)(vaccineOrProphylaxisId, 'en')

        /**
         Medicinal product used for this specific dose of vaccination. A coded value
         from the value set
         vaccine-medicinal-product.json.
         The value set will be distributed from the EUDCC Gateway starting with the
         gateway version 1.1.
         Exactly 1 (one) non-empty field MUST be provided. Example:
         "mp": "EU/1/20/1528" (Comirnaty)
         */
        const vaccineProductId = getValue("v")[0]["mp"]
        const vaccineProduct = getValueSetValue(VSD_VACCINE_MEDICAL_PRODUCT)(vaccineProductId, 'en')

        /**
         Marketing authorisation holder or manufacturer, if no marketing authorization
         holder is present. A coded value from the value set
         vaccine-mah-manf.json.
         The value set will be distributed from the EUDCC Gateway starting with the
         gateway version 1.1.
         Exactly 1 (one) non-empty field MUST be provided. Example:
         "ma": "ORG-100030215" (Biontech Manufacturing GmbH)
         */
        const vaccineManufacturerId = getValue("v")[0]["ma"]
        const vaccineManufacturer = getValueSetValue(VSD_VACCINE_MANUFACTURER)(vaccineManufacturerId, 'en')

        /**
         Sequence number (positive integer) of the dose given during this vaccination
         event. 1 for the first dose, 2 for the second dose etc.
         Exactly 1 (one) non-empty field MUST be provided.
         Examples:
         "dn": "1" (first dose in a series)
         "dn": "2" (second dose in a series)
         "dn": "3" (third dose in a series, such as in case of a booster)
         */
        const doseNumber = getValue("v")[0]["dn"]

        /**
         Total number of doses (positive integer) in a complete vaccination series
         according to the used vaccination protocol. The protocol is not in all cases
         directly defined by the vaccine product, as in some countries only one dose of
         normally two-dose vaccines is delivered to people recovered from COVID-
         19. In these cases, the value of the field should be set to 1.
         Exactly 1 (one) non-empty field MUST be provided.
         Examples:
         "sd": "1" (for all 1-dose vaccination schedules)
         "sd": "2" (for 2-dose vaccination schedules)
         "sd": "3" (in case of a booster)
         */
        const overallDoseNumber = getValue("v")[0]["sd"]

        /**
         The date when the described dose was received, in the format YYYY-MM-DD
         (full date without time). Other formats are not supported.
         Exactly 1 (one) non-empty field MUST be provided. Example:
         "dt": "2021-03-28"
         */
        const vaccinationDate = getValue("v")[0]["dt"]

        /**
         Country expressed as a 2-letter ISO3166 code (RECOMMENDED) or a
         reference to an international organisation responsible for the vaccination event
         (such as UNHCR or WHO).  A coded value from the value set
         country-2-codes.json.
         The value set will be distributed from the EUDCC Gateway starting
         with the gateway version 1.1.
         Exactly 1 (one) field MUST be provided.
         Example:
         "co": "CZ"
         "co": "UNHCR"
         */
            // We only handle the 2 letter code.
        const vaccinationCountry = COUNTRY_2_LETTER_ISO3166_CODES[getValue("v")[0]["co"]]

        /**
         Name of the organisation that issued the certificate. Identifiers are allowed as
         part of the name, but not recommended to be used individually without the
         name as a text. Max 80 UTF-8 characters.
         Exactly 1 (one) non-empty field MUST be provided. Example:
         "is": "Ministry of Health of the Czech Republic"
         "is": "Vaccination Centre South District 3"             */
        const certificateIssuer = getValue("v")[0]["is"]

        /**
         Unique certificate identifier (UVCI) as specified in the vaccination-
         proof_interoperability-guidelines_en.pdf (europa.eu)
         The inclusion of the checksum is optional. The prefix "URN:UVCI:" may be
         added.
         Exactly 1 (one) non-empty field MUST be provided.
         Examples:
         "ci": "URN:UVCI:01:NL:187/37512422923"
         "ci": "URN:UVCI:01:AT:10807843F94AEE0EE5093FBC254BD813#B"         */
        const uniqueCertificateIdentifier = getValue("v")[0]["ci"]
        return {
            disease, vaccineOrProphylaxis, vaccineProduct, vaccineManufacturer,
            doseNumber, overallDoseNumber, vaccinationDate, vaccinationCountry,
            certificateIssuer, uniqueCertificateIdentifier
        }
    }

    /**
     * A utility function to access the metadata values.
     *
     * Metadata (payload as json) internal data model:
     * {
     *     1: ...
     *     2: ...
     *     -260: ...
     * }
     * @param dccCose
     * @private
     */
    private static getMetaDataValue(dccCose: DccCose) {
        return (key) => dccCose.getPayloadAsJson().get(key)
    }


    /**
     * A utility function to access the hcert values.
     *
     * Hcert (payload as json) internal data model:
     * {
     *     -260: {
     *         1: {
     *             v: ...
     *             dob: ...
     *             name: ...
     *             ver: ...
     *         }
     *     }
     * }
     * @param dccHcert
     * @private
     */
    private static getValue(dccCose: DccCose) {
        // @ts-ignore
        return (key) => dccCose.getPayloadAsJson().get(ChPayloadKeys.HCERT).get(1)[key]
    }

    private static getTestGroupInformation(dccCose: DccCose): EudccTestGroup {
        const testGroup = DccHcertFactory.getValue(dccCose)("t")[0]

        /**
         A coded value from the value set
         disease-agent-targeted.json.
         This value set has a single entry 840539006, which is the code for COVID-
         19 from SNOMED CT (GPS).
         Exactly 1 (one) non-empty field MUST be provided.
         Example:
         "tg": "840539006"
         */
        const diseaseId = testGroup["tg"]
        const disease = getValueSetValue(VSD_DISEASE_AGENT_TARGETED)(diseaseId, 'en')

        /**
         The type of the test used, based on the material targeted by the test. A coded
         value from the value set
         test-type.json
         (based on LOINC). Values outside of the value set are not allowed.
         Exactly 1 (one) non-empty field MUST be provided.
         Example:
         "tt": "LP6464-4" (Nucleic acid amplification with probe
         detection)
         "tt": "LP217198-3" (Rapid immunoassay)
         */
        const testTypeId = testGroup["tt"]
        const testType = getValueSetValue(VSD_TEST_TYPE)(testTypeId, 'en')

        /**
         The name of the nucleic acid amplification test (NAAT) used. The name
         should include the name of the test manufacturer and the commercial name of
         the test, separated by a comma.
         For NAAT: the field is optional.
         For RAT: the field SHOULD NOT be used, as the name of the test is supplied
         indirectly through the test device identifier (t/ma).
         When supplied, the field MUST NOT be empty.
         Example:
         "nm": "ELITechGroup, SARS-CoV-2 ELITe MGB® Kit"
         */
        const testName = testGroup["nm"]

        /**
         Rapid antigen test (RAT) device identifier from the JRC database. Value set
         (HSC common list):
          All Rapid antigen tests in HSC common list (human readable).
          https://covid-19-diagnostics.jrc.ec.europa.eu/devices/hsc-common-
         recognition-rat (machine-readable, values of the field id_device
         included on the list form the value set).
         In EU/EEA countries, issuers MUST only issue certificates for tests belonging
         to the currently valid value set. The value set MUST be updated every 24
         hours.
         Values outside of the value set MAY be used in certificates issued by third
         countries, however the identifiers MUST still be from the JRC database. The
         use of other identifiers such as those provided directly by test manufacturers is
         not permitted.

         Verifiers MUST detect values not belonging to the up to date value set and
         render certificates bearing these as invalid. If an identifier is removed from
         the value set, certificates including it MAY be accepted for a maximum of 72
         hours after the removal.
         The value set will be distributed from the EUDCC Gateway starting with the
         gateway version 1.1.
         For RAT: exactly 1 (one) non-empty field MUST be provided.
         For NAAT: the field MUST NOT be used, even if the NAA test identifier is
         available in the JRC database.
         Example:
         "ma": "344" (SD BIOSENSOR Inc, STANDARD F COVID-19 Ag
         FIA)
         */
        const testDevice = HSC_COMMON_RECONGINTION_RAT.deviceList.filter(d => testGroup["ma"] === d.id_device).pop()

        /**
         * The date and time when the test sample was collected. The time MUST
         include information on the time zone. The value MUST NOT denote the time
         when the test result was produced.
         Exactly 1 (one) non-empty field MUST be provided.
         One of the following ISO 8601 formats MUST be used. Other options are not
         supported.
         YYYY-MM-DDThh:mm:ssZ
         YYYY-MM-DDThh:mm:ss[+-]hh
         YYYY-MM-DDThh:mm:ss[+-]hhmm
         YYYY-MM-DDThh:mm:ss[+-]hh:mm

         Examples:
         "sc": "2021-08-20T10:03:12Z" (UTC time)
         "sc": "2021-08-20T12:03:12+02" (CEST time)
         "sc": "2021-08-20T12:03:12+0200" (CEST time)
         "sc": "2021-08-20T12:03:12+02:00" (CEST time)
         */
        const testDate = new Date(testGroup["sc"])



        /**
         The result of the test. A coded value from the value set
         test-result.json (based on SNOMED CT, GPS).
         Exactly 1 (one) non-empty field MUST be provided.
         Example:
         "tr": "260415000"  (Not detected)
         */
        const testResultId = testGroup["tr"]
        const testResult = getValueSetValue(VSD_TEST_RESULTS)(testResultId, 'en')

        /**
         * Name of the actor that conducted the test. Identifiers are allowed as part of the
         name, but not recommended to be used individually without the name as a
         text. Max 80 UTF-8 characters. Any extra characters should be truncated. The
         name is not designed for automated verification.
         For NAAT tests: exactly 1 (one) non-empty field MUST be provided.
         For RAT tests: the field is optional. If provided, MUST NOT be empty.
         Example:
         "tc": "Test centre west region 245"
         */
        const testingCentre = testGroup["tc"]

        /**
         Country expressed as a 2-letter ISO3166 code (RECOMMENDED) or a
         reference to an international organisation responsible for carrying out the test
         (such as UNHCR or WHO). This MUST be a coded value from the value set
         country-2-codes.json.
         The value set will be distributed from the EUDCC Gateway starting with the
         gateway version 1.1.
         Exactly 1 (one) field MUST be provided.
         Examples:
         "co": "CZ"
         "co": "UNHCR"
         */
        const testingCountry = COUNTRY_2_LETTER_ISO3166_CODES[testGroup["co"]]


        /**
         Country expressed as a 2-letter ISO3166 code (RECOMMENDED) or a
         reference to an international organisation responsible for carrying out the test
         (such as UNHCR or WHO). This MUST be a coded value from the value set
         country-2-codes.json.
         The value set will be distributed from the EUDCC Gateway starting with the
         gateway version 1.1.
         Exactly 1 (one) field MUST be provided.
         Examples:
         "co": "CZ"
         "co": "UNHCR"
         */
        const certificateIssuer = testGroup["is"]

        /**
         Unique certificate identifier (UVCI) as specified in the vaccination-
         proof_interoperability-guidelines_en.pdf (europa.eu)
         The inclusion of the checksum is optional. The prefix "URN:UVCI:" may be
         added.
         Exactly 1 (one) non-empty field MUST be provided.
         Examples:
         "ci": "URN:UVCI:01:NL:187/37512422923"
         "ci": "URN:UVCI:01:AT:10807843F94AEE0EE5093FBC254BD813#B"         */
        const uniqueCertificateIdentifier = testGroup["ci"]

        return {
            disease, testType, testName, testDevice, testDate, testResult,
            testingCentre, testingCountry,
            certificateIssuer, uniqueCertificateIdentifier
        }
    }

    private static getRecoveryGroupInformation(dccCose: DccCose): EudccRecoeryGroup {
        const recoveryGroup = DccHcertFactory.getValue(dccCose)("r")[0]

        /**
         A coded value from the value set
         disease-agent-targeted.json.
         This value set has a single entry 840539006, which is the code for COVID-
         19 from SNOMED CT (GPS).
         Exactly 1 (one) non-empty field MUST be provided.
         Example:
         "tg": "840539006"
         */
        const diseaseId = recoveryGroup["tg"]
        const disease = getValueSetValue(VSD_DISEASE_AGENT_TARGETED)(diseaseId, 'en')

        /**
         The date when a sample for the NAAT test producing a positive result was
         collected, in the format YYYY-MM-DD (complete date without time). Other
         formats are not supported.
         Exactly 1 (one) non-empty field MUST be provided.
         Example:
         "fr": "2021-05-18"
         */
        const firstPositiveTestDate = recoveryGroup["fr"]

        /**
         Country expressed as a 2-letter ISO3166 code (RECOMMENDED) or a
         reference to an international organisation responsible for carrying out the test
         (such as UNHCR or WHO). This MUST be a coded value from the value set
         country-2-codes.json.
         The value set will be distributed from the EUDCC Gateway starting with the
         gateway version 1.1.
         Exactly 1 (one) field MUST be provided.
         Examples:
         "co": "CZ"
         "co": "UNHCR"
         */
        const testingCountry = COUNTRY_2_LETTER_ISO3166_CODES[recoveryGroup["co"]]


        /**
         Country expressed as a 2-letter ISO3166 code (RECOMMENDED) or a
         reference to an international organisation responsible for carrying out the test
         (such as UNHCR or WHO). This MUST be a coded value from the value set
         country-2-codes.json.
         The value set will be distributed from the EUDCC Gateway starting with the
         gateway version 1.1.
         Exactly 1 (one) field MUST be provided.
         Examples:
         "co": "CZ"
         "co": "UNHCR"
         */
        const certificateIssuer = recoveryGroup["is"]

        /**
         The first date on which the certificate is considered to be valid. The date
         MUST NOT be earlier than the date calculated as r/fr + 11 days.
         The date MUST be provided in the format YYYY-MM-DD (complete date
         without time). Other formats are not supported.
         Exactly 1 (one) non-empty field MUST be provided.
         Example:
         "df": "2021-05-29"
         */
        const certificateValidFrom = recoveryGroup["df"]

        /**
         The last date on which the certificate is considered to be valid, assigned by the
         certificate issuer. The date MUST NOT be after the date calculated as r/fr +
         180 days.
         The date MUST be provided in the format YYYY-MM-DD (complete date
         without time). Other formats are not supported.
         Exactly 1 (one) non-empty field MUST be provided.
         Example:
         "du": "2021-11-14"
         */
        const certificateValidUntil = recoveryGroup["du"]

        /**
         Unique certificate identifier (UVCI) as specified in the vaccination-
         proof_interoperability-guidelines_en.pdf (europa.eu)
         The inclusion of the checksum is optional. The prefix "URN:UVCI:" may be
         added.
         Exactly 1 (one) non-empty field MUST be provided.
         Examples:
         "ci": "URN:UVCI:01:NL:187/37512422923"
         "ci": "URN:UVCI:01:AT:10807843F94AEE0EE5093FBC254BD813#B"         */
        const uniqueCertificateIdentifier = recoveryGroup["ci"]


        return { disease, certificateIssuer, testingCountry,
            uniqueCertificateIdentifier, firstPositiveTestDate,
            certificateValidFrom, certificateValidUntil
        }

    }
}
