export class UnsupportedCertificateError extends Error {
    constructor(type: string) {
        super(`Certificate Type: ${type} is not supported.`);
    }
}
