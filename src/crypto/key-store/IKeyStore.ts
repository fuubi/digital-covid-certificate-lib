export interface IKeyStore<LoadingArgs,Identifier> {
    loadKeys(loadingArgs: LoadingArgs): Promise<void>
    getKey(id: Identifier)
}
