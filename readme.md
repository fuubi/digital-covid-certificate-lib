# Digital Covid Certificate Lib (DccLib)
The DccLib is a TypeScript library that decodes and verifies the European Digital Covid Certificate (Eudcc) in modern browsers.
Currently, the library has only been tested with Swiss certificates.


## List of all features:

- decode the Eudcc 
    - [Base45Decoder](./src/decoder/Base45Decoder.ts)
    - [ZlibDecoder](./src/decoder/ZlibDecoder.ts)
    - [CborDecoder](./src/decoder/CborDecoder.ts)
    - [CoseDecoder](./src/decoder/CoseDecoder.ts)
- dereference EU eHealthNetwork Digitial Covid Certificate [value sets](https://github.com/ehn-dcc-development/ehn-dcc-valuesets)
- load DCC Signing Keys from JSON Web Token (JWT)
- verify x509 Certificate Trust Chain
- verify DCC 

## List of (hopefully) upcoming features:

- generate a light Swiss Covid Certificate
- get kid from Dcc
- verify JWT signature


## Examples
In the folder [examples]() there are two sample projects on how to quickly get started in a JavaScript 
 and a TypeScript environment.

