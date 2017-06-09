export default class DocumentRegistryInspector implements ts.DocumentRegistry {
    trace: boolean = false;
    constructor(private documentRegistry: ts.DocumentRegistry) {
    }
    acquireDocument(fileName: string, compilationSettings: ts.CompilerOptions, scriptSnapshot: ts.IScriptSnapshot, version: string): ts.SourceFile {
        if (this.trace) {
            console.log(`acquireDocument(${fileName}, ${JSON.stringify(compilationSettings, null, 2)})`)
        }
        return this.documentRegistry.acquireDocument(fileName, compilationSettings, scriptSnapshot, version);
    }
    releaseDocument(fileName: string, compilationSettings: ts.CompilerOptions): void {
        if (this.trace) {
            console.log(`releaseDocument(${fileName}, ${JSON.stringify(compilationSettings, null, 2)})`)
        }
        return this.documentRegistry.releaseDocument(fileName, compilationSettings);
    }
    reportStats(): string {
        if (this.trace) {
            console.log(`reportStats()`)
        }
        return this.documentRegistry.reportStats();
    }
    updateDocument(fileName: string, compilationSettings: ts.CompilerOptions, scriptSnapshot: ts.IScriptSnapshot, version: string): ts.SourceFile {
        if (this.trace) {
            console.log(`updateDocument(${fileName}, ${JSON.stringify(compilationSettings, null, 2)})`)
        }
        return this.documentRegistry.updateDocument(fileName, compilationSettings, scriptSnapshot, version);
    }
}