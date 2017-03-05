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
        this.compilerOptions.strictNullChecks = true;
        this.compilerOptions.suppressImplicitAnyIndexErrors = true;
    }

    /**
     *
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

    get scriptTarget(): string {
        const scriptTarget = this.compilerOptions.target;
        switch (scriptTarget) {
            case ts.ScriptTarget.ES2015: {
                return 'ES2015';
            }
            case ts.ScriptTarget.ES3: {
                return 'ES3';
            }
            case ts.ScriptTarget.ES5: {
                return 'ES5';
            }
            case ts.ScriptTarget.Latest: {
                return 'Latest';
            }
            default: {
                throw new Error(`Unrecognized script target: ${scriptTarget}`);
            }
        }
    }

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
}
