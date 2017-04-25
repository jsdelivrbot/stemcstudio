import Delta from '../../Delta';
import ScriptInfo from './ScriptInfo';
import { ModuleKind, ScriptTarget } from '../LanguageServiceEvents';
import { tsConfigModuleKindFromCompilerOptions } from '../LanguageServiceHelpers';
import { compilerModuleKindFromTsConfig } from '../LanguageServiceHelpers';
import { tsConfigScriptTargetFromCompilerOptions } from '../LanguageServiceHelpers';
import { compilerScriptTargetFromTsConfig } from '../LanguageServiceHelpers';

export interface TsConfigSettings {

}

/**
 *
 */
export class DefaultLanguageServiceHost implements ts.LanguageServiceHost {

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
        this.compilerOptions.allowJs = true;
        this.compilerOptions.declaration = true;
        this.compilerOptions.emitDecoratorMetadata = true;
        this.compilerOptions.experimentalDecorators = true;
        this.compilerOptions.jsx = ts.JsxEmit.React;
        this.compilerOptions.module = ts.ModuleKind.System;
        this.compilerOptions.noImplicitAny = true;
        this.compilerOptions.noImplicitReturns = true;
        this.compilerOptions.noImplicitThis = true;
        this.compilerOptions.noUnusedLocals = true;
        this.compilerOptions.noUnusedParameters = true;
        this.compilerOptions.operatorOverloading = true;
        this.compilerOptions.preserveConstEnums = true;
        this.compilerOptions.removeComments = false;
        this.compilerOptions.sourceMap = true;
        this.compilerOptions.strictNullChecks = true;
        this.compilerOptions.suppressImplicitAnyIndexErrors = true;
        this.compilerOptions.target = ts.ScriptTarget.ES5;
        this.compilerOptions.traceResolution = true;
    }

    /**
     * Used to encode a string representation of the ModuleKind.
     *
     * TODO: It doesn't really make sense to have the tsConfig type here.
     */
    get moduleKind(): ModuleKind {
        return tsConfigModuleKindFromCompilerOptions(this.compilerOptions.module, 'system');
    }

    /**
     * This is NOT part of the LanguageServiceHost interface.
     * Used to decode a string representation of the ModuleKind.
     *
     * TODO: It doesn't really make sense to have the tsConfig type here.
     */
    set moduleKind(moduleKind: ModuleKind) {
        moduleKind = moduleKind.toLowerCase() as ModuleKind;
        this.compilerOptions.module = compilerModuleKindFromTsConfig(moduleKind);
    }

    /**
     * Determines whether the operatorOverloading compiler option is enabled.
     */
    isOperatorOverloadingEnabled(): boolean {
        return !!this.compilerOptions.operatorOverloading;
    }

    /**
     * Sets the operatorOverloading compiler option and returns the previous value.
     */
    setOperatorOverloading(operatorOverloading: boolean): boolean {
        const oldValue = this.isOperatorOverloadingEnabled();
        this.compilerOptions.operatorOverloading = operatorOverloading;
        return oldValue;
    }

    /**
     * Used to encode a string representation of the ScriptTarget.
     *
     * TODO: It doesn't really make sense to have the tsConfig type here.
     */
    get scriptTarget(): ScriptTarget {
        return tsConfigScriptTargetFromCompilerOptions(this.compilerOptions.target, 'es5');
    }

    /**
     * This is NOT part of the LanguageServiceHost interface.
     * Used to decode a string representation of the ScriptTarget.
     *
     * TODO: It doesn't really make sense to have the tsConfig type here.
     */
    set scriptTarget(scriptTarget: ScriptTarget) {
        scriptTarget = scriptTarget.toLowerCase() as ScriptTarget;
        this.compilerOptions.target = compilerScriptTargetFromTsConfig(scriptTarget);
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
     * This is not part of the LanguageServiceHost interface.
     * It is called by the LanguageServiceWorker.
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
     * The synchronous nature of this method means that would have to have
     * all modules loaded in advance. This presents an issue for d.ts files
     * which import other d.ts files.
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
                console.warn(`Unable to resolve module '${moduleName}'`);
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
