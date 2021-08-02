# Release Notes

## Table of content
- [v0.0.3](#v003)

## v0.1.0
- Decode and expose signedHeader in DccCose.ts
- Jwt.ts 
    -  Changed class fields: 
        - .mac -> .signature
        - .signedContent -> .toBeSigned
- ChKeyStore.ts validates the JWS while loading keys
