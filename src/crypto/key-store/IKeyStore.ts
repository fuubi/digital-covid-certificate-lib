interface IKeyStore<LoadingArgs,Identifier> {
    loadKeys(loadingArgs: LoadingArgs)
    getKey(id: Identifier)
}
