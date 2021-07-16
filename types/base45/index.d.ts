declare module 'base45' {
    class Base45  {
        public static decode: (base45String: string) => Buffer
        public static encode: (buffer: Buffer) => string
    }
    export = Base45
}
