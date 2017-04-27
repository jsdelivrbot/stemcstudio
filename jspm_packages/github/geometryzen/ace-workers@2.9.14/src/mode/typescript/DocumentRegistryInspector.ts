/**
 * A pass-through implementation of DocumentRegistry for tracing purposes.
 */
export default class DocumentRegistryInspector implements ts.DocumentRegistry {
    trace = false;
    constructor(private documentRegistry: ts.DocumentRegistry) {
    }
    acquireDocument(fileName: string, compilationSettings: ts.CompilerOptions, scriptSnapshot: ts.IScriptSnapshot, version: string): ts.SourceFile {
        if (this.trace) {
            console.log(`acquireDocument(${fileName}, ${JSON.stringify(compilationSettings, null, 2)})`);
        }
        return this.documentRegistry.acquireDocument(fileName, compilationSettings, scriptSnapshot, version);
    }
    acquireDocumentWithKey(fileName: string, path: ts.Path, compilationSettings: ts.CompilerOptions, key: ts.DocumentRegistryBucketKey, scriptSnapshot: ts.IScriptSnapshot, version: string, scriptKind?: ts.ScriptKind): ts.SourceFile {
        if (this.trace) {
            console.log(`acquireDocumentWithKey(${fileName}, ${JSON.stringify(compilationSettings, null, 2)})`);
        }
        return this.documentRegistry.acquireDocumentWithKey(fileName, path, compilationSettings, key, scriptSnapshot, version);
    }
    getKeyForCompilationSettings(settings: ts.CompilerOptions): ts.DocumentRegistryBucketKey {
        return this.documentRegistry.getKeyForCompilationSettings(settings);
    }
    releaseDocument(fileName: string, compilationSettings: ts.CompilerOptions): void {
        if (this.trace) {
            console.log(`releaseDocument(${fileName}, ${JSON.stringify(compilationSettings, null, 2)})`);
        }
        return this.documentRegistry.releaseDocument(fileName, compilationSettings);
    }
    releaseDocumentWithKey(path: ts.Path, key: ts.DocumentRegistryBucketKey): void {
        return this.documentRegistry.releaseDocumentWithKey(path, key);
    }
    reportStats(): string {
        if (this.trace) {
            console.log(`reportStats()`);
        }
        return this.documentRegistry.reportStats();
    }
    updateDocument(fileName: string, compilationSettings: ts.CompilerOptions, scriptSnapshot: ts.IScriptSnapshot, version: string): ts.SourceFile {
        if (this.trace) {
            console.log(`updateDocument(${fileName}, ${JSON.stringify(compilationSettings, null, 2)})`);
        }
        return this.documentRegistry.updateDocument(fileName, compilationSettings, scriptSnapshot, version);
    }
    updateDocumentWithKey(fileName: string, path: ts.Path, compilationSettings: ts.CompilerOptions, key: ts.DocumentRegistryBucketKey, scriptSnapshot: ts.IScriptSnapshot, version: string, scriptKind?: ts.ScriptKind): ts.SourceFile {
        if (this.trace) {
            console.log(`updateDocumentWithKey(${fileName}, ${JSON.stringify(compilationSettings, null, 2)})`);
        }
        return this.documentRegistry.updateDocumentWithKey(fileName, path, compilationSettings, key, scriptSnapshot, version);
    }
}
