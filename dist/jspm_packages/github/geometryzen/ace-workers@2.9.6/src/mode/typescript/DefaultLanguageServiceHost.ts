import Delta from '../../Delta';
import ScriptInfo from './ScriptInfo';

/**
 *
 */
export default class DefaultLanguageServiceHost implements ts.LanguageServiceHost {

    /**
     * The compiler options, which can be changed.
     */
    private compilerOptions: ts.CompilerOptions = {};

    /**
     *
     */
    private readonly scripts: { [fileName: string]: ScriptInfo } = {};

    /**
     *
     */
    private readonly moduleNameToFileName: { [moduleName: string]: string } = {};

    /**
     *
     */
    constructor() {
        this.compilerOptions.module = ts.ModuleKind.System;
        this.compilerOptions.target = ts.ScriptTarget.ES5;
        this.compilerOptions.allowJs = true;
        this.compilerOptions.declaration = true;
        this.compilerOptions.jsx = ts.JsxEmit.React;
        this.compilerOptions.noImplicitAny = true;
        this.compilerOptions.noImplicitReturns = true;
        this.compilerOptions.noImplicitThis = true;
        this.compilerOptions.noUnusedLocals = true;
        this.compilerOptions.noUnusedParameters = true;
        this.compilerOptions.operatorOverloading = true;
        this.compilerOptions.strictNullChecks = true;
        this.compilerOptions.suppressImplicitAnyIndexErrors = true;
        this.compilerOptions.traceResolution = true;
        this.compilerOptions.sourceMap = true;
    }

    /**
     * Used to encode a string representation of the ModuleKind.
     */
    get moduleKind(): string {
        const moduleKind = this.compilerOptions.module;
        switch (moduleKind) {
            case ts.ModuleKind.AMD: {
                return 'amd';
            }
            case ts.ModuleKind.CommonJS: {
                return 'commonjs';
            }
            case ts.ModuleKind.ES2015: {
                return 'es2015';
            }
            case ts.ModuleKind.None: {
                return 'none';
            }
            case ts.ModuleKind.System: {
                return 'system';
            }
            case ts.ModuleKind.UMD: {
                return 'umd';
            }
            default: {
                throw new Error(`Unrecognized module kind: ${moduleKind}`);
            }
        }
    }

    /**
     * This is NOT part of the LanguageServiceHost interface.
     * Used to decode a string representation of the ModuleKind.
     */
    set moduleKind(moduleKind: string) {
        moduleKind = moduleKind.toLowerCase();
        switch (moduleKind) {
            case 'amd': {
                this.compilerOptions.module = ts.ModuleKind.AMD;
                break;
            }
            case 'commonjs': {
                this.compilerOptions.module = ts.ModuleKind.CommonJS;
                break;
            }
            case 'es2015': {
                this.compilerOptions.module = ts.ModuleKind.ES2015;
                break;
            }
            case 'none': {
                this.compilerOptions.module = ts.ModuleKind.None;
                break;
            }
            case 'system': {
                this.compilerOptions.module = ts.ModuleKind.System;
                break;
            }
            case 'umd': {
                this.compilerOptions.module = ts.ModuleKind.UMD;
                break;
            }
            default: {
                throw new Error(`Unrecognized module kind: ${moduleKind}`);
            }
        }
    }

    get operatorOverloading(): boolean {
        return !!this.compilerOptions.operatorOverloading;
    }

    set operatorOverloading(operatorOverloading: boolean) {
        this.compilerOptions.operatorOverloading = operatorOverloading;
    }

    /**
     * Used to encode a string representation of the ScriptTarget.
     */
    get scriptTarget(): string {
        const scriptTarget = this.compilerOptions.target;
        switch (scriptTarget) {
            case ts.ScriptTarget.ES2015: {
                return 'es2015';
            }
            case ts.ScriptTarget.ES3: {
                return 'es3';
            }
            case ts.ScriptTarget.ES5: {
                return 'es5';
            }
            case ts.ScriptTarget.Latest: {
                return 'latest';
            }
            default: {
                throw new Error(`Unrecognized script target: ${scriptTarget}`);
            }
        }
    }

    /**
     * This is NOT part of the LanguageServiceHost interface.
     * Used to decode a string representation of the ScriptTarget.
     */
    set scriptTarget(scriptTarget: string) {
        scriptTarget = scriptTarget.toLowerCase();
        switch (scriptTarget) {
            case 'es2015': {
                this.compilerOptions.target = ts.ScriptTarget.ES2015;
                break;
            }
            case 'es3': {
                this.compilerOptions.target = ts.ScriptTarget.ES3;
                break;
            }
            case 'es5': {
                this.compilerOptions.target = ts.ScriptTarget.ES5;
                break;
            }
            case 'latest': {
                this.compilerOptions.target = ts.ScriptTarget.Latest;
                break;
            }
            default: {
                throw new Error(`Unrecognized script target: ${scriptTarget}`);
            }
        }
    }

    /**
     *
     */
    getScriptFileNames(): string[] {
        return Object.keys(this.scripts);
    }

    /**
     *
     */
    private addScript(fileName: string, content: string): void {
        const script = new ScriptInfo(content);
        this.scripts[fileName] = script;
    }

    /**
     *
     */
    ensureModuleMapping(moduleName: string, fileName: string): void {
        this.moduleNameToFileName[moduleName] = fileName;
    }

    /**
     *
     */
    ensureScript(fileName: string, content: string): void {
        const script = this.scripts[fileName];
        if (script) {
            script.updateContent(content);
        }
        else {
            this.addScript(fileName, content);
        }
    }

    /**
     *
     */
    applyDelta(fileName: string, delta: Delta): void {
        const script = this.scripts[fileName];
        if (script) {
            script.applyDelta(delta);
        }
        else {
            throw new Error("No script with fileName '" + fileName + "'");
        }
    }

    /**
     *
     */
    removeModuleMapping(moduleName: string): void {
        delete this.moduleNameToFileName[moduleName];
    }

    /**
     *
     */
    removeScript(fileName: string): void {
        const script = this.scripts[fileName];
        if (script) {
            delete this.scripts[fileName];
        }
    }

    /**
     *
     */
    setCompilationSettings(compilerOptions: ts.CompilerOptions): void {
        this.compilerOptions = compilerOptions;
    }

    /**
     * Returns the compiler options required to support the LanguageServiceHost interface.
     */
    getCompilationSettings(): ts.CompilerOptions {
        return this.compilerOptions;
    }

    /**
     * Custom transformers allow us to modify the generated JavaScript code
     * in the pipeline both before and after the built-in transformers.
     */
    getCustomTransformers(): ts.CustomTransformers {
        const before: ts.TransformerFactory<ts.SourceFile>[] = [];
        const after: ts.TransformerFactory<ts.SourceFile>[] = [];
        const that: ts.CustomTransformers = { before, after };
        return that;
    }

    /**
     *
     */
    getNewLine(): string {
        // Maybe we should get this from the editor?
        return "\n";
    }

    /**
     *
     */
    getScriptVersion(fileName: string): string {
        const script = this.scripts[fileName];
        return `${script.version}`;
    }

    /**
     *
     */
    getScriptSnapshot(fileName: string): ts.IScriptSnapshot {
        const script = this.scripts[fileName];
        if (script) {
            const result = ts.ScriptSnapshot.fromString(script.getValue());
            return result;
        }
        else {
            // We may end up here if the user renames a file but has not yet
            // updated the imports.
            return void 0;
        }
    }

    /**
     *
     */
    getCurrentDirectory(): string {
        return "";
    }

    /**
     * This method is called by the LanguageService in order to determine
     * the library that represents what is globally available.
     */
    getDefaultLibFileName(options: ts.CompilerOptions): string {
        return "defaultLib.d.ts";
    }

    /**
     *
     */
    resolveModuleNames(moduleNames: string[], containingFile: string): ts.ResolvedModuleFull[] {
        const fileNames = Object.keys(this.scripts);
        return moduleNames.map((moduleName) => {
            const fileName = fileNames.find((candidateFileName) => {
                /**
                 * This terminology comes from SystemJS.
                 */
                const isRelativeToBaseURI = moduleName.startsWith('./');
                if (isRelativeToBaseURI) {
                    // It's relative to the base URI.
                    const simpleName = moduleName.substring(2);
                    if (candidateFileName.indexOf(`${simpleName}.ts`) >= 0) {
                        return true;
                    }
                    if (candidateFileName.indexOf(`${simpleName}.tsx`) >= 0) {
                        return true;
                    }
                }
                else {
                    if (candidateFileName === moduleName) {
                        return true;
                    }
                    if (candidateFileName.indexOf(`${moduleName}/index.d.ts`) >= 0) {
                        return true;
                    }
                    if (this.moduleNameToFileName[moduleName] === candidateFileName) {
                        return true;
                    }
                }
                return false;
            });
            if (fileName) {
                const m: ts.ResolvedModuleFull = {
                    resolvedFileName: fileName,
                    isExternalLibraryImport: false,
                    extension: extensionFromFileName(fileName)
                };
                return m;
            }
            else {
                return undefined;
            }
        });
    }
}

function extensionFromFileName(fileName: string): ts.Extension | undefined {
    if (fileName.endsWith('.d.ts')) {
        return ts.Extension.Dts;
    }
    else if (fileName.endsWith('.ts')) {
        return ts.Extension.Ts;
    }
    else if (fileName.endsWith('.tsx')) {
        return ts.Extension.Tsx;
    }
    else if (fileName.endsWith('.js')) {
        return ts.Extension.Js;
    }
    else if (fileName.endsWith('.jsx')) {
        return ts.Extension.Jsx;
    }
    else {
        return undefined;
    }
}
