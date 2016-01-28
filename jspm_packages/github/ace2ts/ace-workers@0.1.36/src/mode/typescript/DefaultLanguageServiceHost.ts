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
        this.compilerOptions = null;
        this.scripts = {};
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
        var script = new ScriptInfo(content);
        this.scripts[fileName] = script;
    }

    /**
     * @method ensureScript
     * @param fileName {string}
     * @param content {string}
     * @return {void}
     */
    ensureScript(fileName: string, content: string): void {
        var script = this.scripts[fileName];
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
        var script = this.scripts[fileName];
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
        var script = this.scripts[fileName];
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
        var script = this.scripts[fileName];
        return "" + script.version;
    }

    /**
     * @method getScriptSnapshot
     * @param fileName {string}
     * @return {IScriptSnapshot}
     */
    getScriptSnapshot(fileName: string): ts.IScriptSnapshot {
        var script = this.scripts[fileName];
        var result = ts.ScriptSnapshot.fromString(script.getValue());
        return result;
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
