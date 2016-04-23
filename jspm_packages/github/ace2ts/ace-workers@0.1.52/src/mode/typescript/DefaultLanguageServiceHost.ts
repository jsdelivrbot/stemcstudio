"use strict";

import Delta from '../../Delta';
import ScriptInfo from "./ScriptInfo";

/**
 * @class DefaultLanguageServiceHost
 */
export default class DefaultLanguageServiceHost implements ts.LanguageServiceHost {

    /**
     * @property compilerOptions
     * @type CompilerOptions
     * @private
     */
    private compilerOptions: ts.CompilerOptions;

    /**
     * @property scripts
     * @type { [fileName: string]: ScriptInfo }
     * @private
     */
    private scripts: { [fileName: string]: ScriptInfo };

    /**
     * @class DefaultLanguageServiceHost
     * @constructor
     */
    constructor() {
        this.compilerOptions = {};
        this.compilerOptions.module = ts.ModuleKind.None;
        this.compilerOptions.target = ts.ScriptTarget.ES3;
        this.scripts = {};
    }

    /**
     * @property moduleKind
     * @type {string}
     */
    get moduleKind(): string {
        const moduleKind = this.compilerOptions.module
        switch (moduleKind) {
            case ts.ModuleKind.AMD: {
                return 'amd'
            }
            case ts.ModuleKind.CommonJS: {
                return 'commonjs'
            }
            case ts.ModuleKind.ES2015: {
                return 'es2015'
            }
            case ts.ModuleKind.ES6: {
                return 'es6'
            }
            case ts.ModuleKind.None: {
                return 'none'
            }
            case ts.ModuleKind.System: {
                return 'system'
            }
            case ts.ModuleKind.UMD: {
                return 'umd'
            }
            default: {
                throw new Error(`Unrecognized module kind: ${moduleKind}`)
            }
        }
    }

    set moduleKind(moduleKind: string) {
        moduleKind = moduleKind.toLowerCase()
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
            case 'es6': {
                this.compilerOptions.module = ts.ModuleKind.ES6;
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
                throw new Error(`Unrecognized module kind: ${moduleKind}`)
            }
        }
    }

    get scriptTarget(): string {
        const scriptTarget = this.compilerOptions.target
        switch (scriptTarget) {
            case ts.ScriptTarget.ES2015: {
                return 'ES2015'
            }
            case ts.ScriptTarget.ES3: {
                return 'ES3'
            }
            case ts.ScriptTarget.ES5: {
                return 'ES5'
            }
            case ts.ScriptTarget.ES6: {
                return 'ES6'
            }
            case ts.ScriptTarget.Latest: {
                return 'Latest'
            }
            default: {
                throw new Error(`Unrecognized script target: ${scriptTarget}`)
            }
        }
    }

    set scriptTarget(scriptTarget: string) {
        scriptTarget = scriptTarget.toLowerCase()
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
            case 'es6': {
                this.compilerOptions.target = ts.ScriptTarget.ES6;
                break;
            }
            case 'latest': {
                this.compilerOptions.target = ts.ScriptTarget.Latest;
                break;
            }
            default: {
                throw new Error(`Unrecognized script target: ${scriptTarget}`)
            }
        }
    }

    /**
     * @method getScriptFileNames
     * @return {string[]}
     */
    getScriptFileNames(): string[] {
        return Object.keys(this.scripts);
    }

    /**
     * @method addScript
     * @param fileName {string}
     * @param content {string}
     * @return {void}
     */
    private addScript(fileName: string, content: string): void {
        const script = new ScriptInfo(content);
        this.scripts[fileName] = script;
    }

    /**
     * @method ensureScript
     * @param fileName {string}
     * @param content {string}
     * @return {void}
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
     * @method applyDelta
     * @param fileName {string}
     * @param delta {Delta}
     * @return {void}
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
     * @method removeScript
     * @param fileName {string}
     * @return {void}
     */
    removeScript(fileName: string): void {
        const script = this.scripts[fileName];
        if (script) {
            delete this.scripts[fileName];
        }
        else {
            console.warn(`removeScript: No script with fileName '${fileName}'`);
        }
    }

    /**
     * @method setCompilationSettings
     * @param compilerOptions {CompilerOptions}
     * @return {void}
     */
    setCompilationSettings(compilerOptions: ts.CompilerOptions): void {
        this.compilerOptions = compilerOptions;
    }

    /**
     * Returns the compiler options required to support the LanguageServiceHost interface.
     * @method getCompilationSettings
     * @return {CompilerOptions}
     */
    getCompilationSettings(): ts.CompilerOptions {
        return this.compilerOptions;
    }

    /**
     * @method getNewLine
     * @return {string}
     */
    getNewLine(): string {
        // Maybe we should get this from the editor?
        return "\n";
    }

    /**
     * @method getScriptVersion
     * @param fileName {string}
     * @return {string}
     */
    getScriptVersion(fileName: string): string {
        const script = this.scripts[fileName];
        return "" + script.version;
    }

    /**
     * @method getScriptSnapshot
     * @param fileName {string}
     * @return {IScriptSnapshot}
     */
    getScriptSnapshot(fileName: string): ts.IScriptSnapshot {
        const script = this.scripts[fileName];
        if (script) {
            const result = ts.ScriptSnapshot.fromString(script.getValue());
            return result;
        }
        else {
            return void 0
        }
    }

    /**
     * @method getCurrentDirectory
     * @return {string}
     */
    getCurrentDirectory(): string {
        return "";
    }

    /**
     * This method is called by the LanguageService in order to determine
     * the library that represents what is globally available.
     *
     * @method getDefaultLibFileName
     * @param options {CompilerOptions}
     * @return {string}
     */
    getDefaultLibFileName(options: ts.CompilerOptions): string {
        return "defaultLib.d.ts";
    }
}
