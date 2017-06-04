import { Delta } from '../../editor/Delta';
import { DefaultLanguageServiceHost } from './DefaultLanguageServiceHost';
import { DocumentRegistryInspector } from './DocumentRegistryInspector';
import { fileExtensionIs } from './fileExtensionIs';
import { changedCompilerSettings/*, compilerOptionsFromTsConfig*/ } from './LanguageServiceHelpers';
import { PythonLanguageService } from '../python/PythonLanguageService';
import { transpileModule } from './transpileModule';
import { transpileModule as transpilePythonModule, mapToTarget } from 'typhon-lang';

import { IConfigurationFile } from '../tslint/configuration';
import { Linter as PythonLinter } from '../python/Linter';
import { Linter as TypeScriptLinter } from '../tslint/linter';

/**
 *
 */
const useCaseSensitiveFileNames = true;

/**
 * A workspace language service that coordinates the behaviour of the underlying language services.
 */
export class LanguageServiceDispatcher {
    /**
     * The document registry is the same for the lifetime of the application and shared across language services.
     * Entries in the document registry have a count of the number of services using them.
     */
    private readonly tsDocumentRegistry: DocumentRegistryInspector;

    /**
     * The TypeScript language service answers the tough queries.
     * It is created lazily.
     */
    private tsLanguageService: ts.LanguageService;
    /**
     * For symmetry, we create a Python language service.
     * It is created lazily.
     */
    private pyLanguageService: PythonLanguageService;

    /**
     * @param pyLanguageServiceHost
     * @param tsLanguageServiceHost
     */
    constructor(private readonly pyLanguageServiceHost: DefaultLanguageServiceHost, private readonly tsLanguageServiceHost: DefaultLanguageServiceHost) {
        this.tsDocumentRegistry = new DocumentRegistryInspector(ts.createDocumentRegistry(useCaseSensitiveFileNames));
    }
    applyDelta(fileName: string, delta: Delta): void {
        if (isTypeScriptFileName(fileName)) {
            this.tsLanguageServiceHost.applyDelta(fileName, delta);
        }
        else if (isPythonFileName(fileName)) {
            this.pyLanguageServiceHost.applyDelta(fileName, delta);
        }
        else {
            throw new Error(`delta cannot be applied to file '${fileName}'.`);
        }
    }
    getScriptContent(fileName: string): string {
        if (isTypeScriptFileName(fileName)) {
            return this.tsLanguageServiceHost.getScriptContent(fileName);
        }
        else if (isPythonFileName(fileName)) {
            return this.pyLanguageServiceHost.getScriptContent(fileName);
        }
        else {
            throw new Error(`Cannot get script content for file '${fileName}'.`);
        }
    }
    setScriptContent(fileName: string, content: string): boolean {
        if (isTypeScriptFileName(fileName)) {
            return this.tsLanguageServiceHost.setScriptContent(fileName, content);
        }
        else if (isPythonFileName(fileName)) {
            return this.pyLanguageServiceHost.setScriptContent(fileName, content);
        }
        else {
            throw new Error(`Cannot set script content for file '${fileName}'.`);
        }
    }
    removeScript(fileName: string): boolean {
        if (isTypeScriptFileName(fileName)) {
            return this.tsLanguageServiceHost.removeScript(fileName);
        }
        else if (isPythonFileName(fileName)) {
            return this.pyLanguageServiceHost.removeScript(fileName);
        }
        else {
            throw new Error(`Cannot set script content for file '${fileName}'.`);
        }
    }
    ensureModuleMapping(moduleName: string, fileName: string): string {
        if (isTypeScriptFileName(fileName)) {
            return this.tsLanguageServiceHost.ensureModuleMapping(moduleName, fileName);
        }
        else {
            throw new Error(`Cannot map module '${moduleName}'to file '${fileName}'.`);
        }
    }
    removeModuleMapping(moduleName: string): string {
        return this.tsLanguageServiceHost.removeModuleMapping(moduleName);
    }
    getDefaultLibFileName(options: ts.CompilerOptions): string {
        return this.tsLanguageServiceHost.getDefaultLibFileName(options);
    }
    getCompilationSettings(): ts.CompilerOptions {
        return this.tsLanguageServiceHost.getCompilationSettings();
    }
    setCompilationSettings(compilerOptions: ts.CompilerOptions): void {
        const oldSettings = this.getCompilationSettings();
        this.tsLanguageServiceHost.setCompilationSettings(compilerOptions);
        const newSettings = this.getCompilationSettings();
        if (changedCompilerSettings(oldSettings, newSettings)) {
            if (this.tsLanguageService) {
                this.tsLanguageService.cleanupSemanticCache();
            }
        }
    }
    isOperatorOverloadingEnabled(): boolean {
        return this.tsLanguageServiceHost.isOperatorOverloadingEnabled();
    }
    setOperatorOverloading(operatorOverloading: boolean): boolean {
        const oldValue = this.isOperatorOverloadingEnabled();
        if (oldValue !== operatorOverloading) {
            // This effectively drops the program, forcing it to be recreated when needed.
            if (this.tsLanguageService) {
                this.tsLanguageService.cleanupSemanticCache();
            }
            return this.tsLanguageServiceHost.setOperatorOverloading(operatorOverloading);
        }
        else {
            return oldValue;
        }
    }
    /**
     * Ensures a LanguageService is cached, until it is invalidated.
     */
    private ensureTypeScriptLanguageService(): ts.LanguageService {
        if (!this.tsLanguageService) {
            this.tsLanguageService = ts.createLanguageService(this.tsLanguageServiceHost, this.tsDocumentRegistry);
        }
        return this.tsLanguageService;
    }
    private ensurePythonLanguageService(): PythonLanguageService {
        if (!this.pyLanguageService) {
            this.pyLanguageService = new PythonLanguageService(this.pyLanguageServiceHost/*, this.tsDocumentRegistry*/);
        }
        return this.pyLanguageService;
    }
    getSyntaxErrors(fileName: string): Diagnostic[] {
        if (isTypeScriptFileName(fileName)) {
            const diagnostics = this.ensureTypeScriptLanguageService().getSyntacticDiagnostics(fileName);
            return diagnostics.map(tsDiagnosticToEditorDiagnostic);
        }
        else if (isPythonFileName(fileName)) {
            // console.warn(`getSyntaxErrors('${fileName}') is not yet implemented.`);
            return [];
        }
        else {
            return [];
        }
    }
    getSemanticErrors(fileName: string): Diagnostic[] {
        if (isTypeScriptFileName(fileName)) {
            const diagnostics = this.ensureTypeScriptLanguageService().getSemanticDiagnostics(fileName);
            return diagnostics.map(tsDiagnosticToEditorDiagnostic);
        }
        else if (isPythonFileName(fileName)) {
            // console.warn(`getSemanticErrors('${fileName}') is not yet implemented.`);
            return [];
        }
        else {
            return [];
        }
    }
    getLintErrors(fileName: string, configuration: IConfigurationFile): Diagnostic[] {
        if (isTypeScriptFileName(fileName)) {
            const linter = new TypeScriptLinter({ fix: false }, this.ensureTypeScriptLanguageService());
            linter.lint(fileName, configuration);
            const ruleFailures = linter.getRuleFailures();
            return ruleFailures.map(ruleFailureToEditorDiagnostic);
        }
        else if (isPythonFileName(fileName)) {
            const linter = new PythonLinter({ fix: false }, this.ensurePythonLanguageService());
            linter.lint(fileName, configuration);
            const ruleFailures = linter.getRuleFailures();
            return ruleFailures.map(ruleFailureToEditorDiagnostic);
        }
        else {
            return [];
        }
    }
    getCompletionsAtPosition(fileName: string, position: number): ts.CompletionEntry[] {
        const tsLS = this.ensureTypeScriptLanguageService();
        function callback(tsFileName: string, tsPosition: number): ts.CompletionEntry[] {
            const completionInfo: ts.CompletionInfo = tsLS.getCompletionsAtPosition(tsFileName, tsPosition);
            if (completionInfo) {
                // FIXME: This misses a few properties on CompletionInfo. We don't use them yet.
                return completionInfo.entries;
            }
            else {
                return [];
            }
        }
        return this.getAtPosition<ts.CompletionEntry[]>(fileName, position, 'getCompletionsAtPosition', callback);
    }
    getDefinitionAtPosition(fileName: string, position: number): ts.DefinitionInfo[] {
        const tsLS = this.ensureTypeScriptLanguageService();
        function callback(tsFileName: string, tsPosition: number): ts.DefinitionInfo[] {
            const definitionInfo: ts.DefinitionInfo[] = tsLS.getDefinitionAtPosition(tsFileName, tsPosition);
            if (definitionInfo) {
                return definitionInfo;
            }
            else {
                return [];
            }
        }
        return this.getAtPosition<ts.DefinitionInfo[]>(fileName, position, 'getDefinitionAtPosition', callback);
    }
    getFormattingEditsForDocument(fileName: string, settings: ts.FormatCodeSettings): ts.TextChange[] {
        return this.ensureTypeScriptLanguageService().getFormattingEditsForDocument(fileName, settings);
    }
    getOutputFiles(fileName: string): ts.OutputFile[] {
        const t1 = Date.now();
        this.synchronizeFiles();
        const t2 = Date.now();
        const outputFiles = this.outputFiles(fileName);
        const t3 = Date.now();
        console.log(`synchronize  took ${t2 - t1} ms`);
        console.log(`output Files took ${t3 - t2} ms`);
        return outputFiles;
    }
    getQuickInfoAtPosition(fileName: string, position: number): ts.QuickInfo {
        const tsLS = this.ensureTypeScriptLanguageService();
        function callback(tsFileName: string, tsPosition: number): ts.QuickInfo {
            return tsLS.getQuickInfoAtPosition(tsFileName, tsPosition);
        }
        return this.getAtPosition<ts.QuickInfo>(fileName, position, 'getQuickInfoAtPosition', callback);
    }
    /**
     * A helper method for implementing functions requiring fileName and position.
     * @param fileName The fileName.
     * @param position The position index.
     * @param alias The name of the function that we provide the framework.
     * @param callback The callback function that takes a TypeScript fileName and postion index.
     */
    private getAtPosition<T>(fileName: string, position: number, alias: string, callback: (tsFileName: string, tsPosition: number) => T): T {

        this.synchronizeFiles();

        const pyLS = this.ensurePythonLanguageService();
        const tsHost = this.tsLanguageServiceHost;
        const pyHost = this.pyLanguageServiceHost;

        if (isTypeScriptFileName(fileName)) {
            return callback(fileName, position);
        }
        else if (isPythonFileName(fileName)) {
            const pyLineAndColumn = pyHost.getLineAndColumn(fileName, position);
            if (pyLineAndColumn) {
                const sourceMap = pyLS.getSourceMap(fileName);
                if (sourceMap) {
                    const tsLineAndColumn = mapToTarget(sourceMap, pyLineAndColumn.line, pyLineAndColumn.column);
                    if (tsLineAndColumn) {
                        const tsFileName = getTargetFileName(fileName);
                        const tsIndex = tsHost.lineAndColumnToIndex(tsFileName, tsLineAndColumn);
                        if (typeof tsIndex === 'number') {
                            return callback(tsFileName, tsIndex);
                        }
                        else {
                            throw new Error(`${alias}('${fileName}') failed to compute tsIndex.`);
                        }
                    }
                    else {
                        throw new Error(`${alias}('${fileName}') failed to map from Python to TypeScript.`);
                    }
                }
                else {
                    throw new Error(`${alias}('${fileName}') unable to get source map.`);
                }
            }
            else {
                throw new Error(`${alias}('${fileName}') unable to compute line and column from position index.`);
            }
        }
        else {
            throw new Error(`${alias}('${fileName}') is not allowed.`);
        }
    }

    /**
     * Any files which have been modified are transpiled to TypeScript and set the the TypeScript language service host.
     * Source maps are retained in the appropriate language service.
     */
    private synchronizeFiles(): void {
        for (const pyFileName of this.pyLanguageServiceHost.getScriptFileNames()) {
            const sourceVersion = this.pyLanguageServiceHost.getScriptVersionNumber(pyFileName);
            const tsFileName = getTargetFileName(pyFileName);
            const targetVersion = this.tsLanguageServiceHost.getScriptVersionNumber(tsFileName);
            if (targetNeedsUpdate(sourceVersion, targetVersion)) {
                const sourceText = this.pyLanguageServiceHost.getScriptContent(pyFileName);
                const { code, sourceMap } = transpilePythonModule(sourceText);
                this.tsLanguageServiceHost.setScriptContent(tsFileName, code);
                // TODO: Maybe this should be into the host?
                this.pyLanguageService.setSourceMap(pyFileName, sourceMap);
            }
        }
    }
    /**
     * Returns the output files for the specified file assuming we are synchronized.
     */
    private outputFiles(fileName: string): ts.OutputFile[] {

        if (isTypeScriptFileName(fileName)) {
            // Do nothing.
        }
        else if (isPythonFileName(fileName)) {
            fileName = getTargetFileName(fileName);
        }
        else {
            console.warn(`getOutputFiles('${fileName}') is not allowed.`);
            return void 0;
        }

        const languageService = this.ensureTypeScriptLanguageService();
        const program = languageService.getProgram();
        const sourceFile: ts.SourceFile = program.getSourceFile(fileName);
        // We want named modules so that we can bundle in the Browser.
        sourceFile.moduleName = systemModuleName('./', fileName, 'js');
        // We implement our own transpileModule in order to use the custom transformers.
        // This will be useful for bringing Operator Overloading into the fold.
        const output: ts.TranspileOutput = transpileModule(program, sourceFile, this.tsLanguageServiceHost.getCustomTransformers());
        const outputFiles: ts.OutputFile[] = [];
        if (output.outputText) {
            outputFiles.push({ name: systemModuleName(void 0, fileName, 'js'), text: output.outputText, writeByteOrderMark: void 0 });
        }
        if (output.sourceMapText) {
            outputFiles.push({ name: systemModuleName(void 0, fileName, 'js.map'), text: output.sourceMapText, writeByteOrderMark: void 0 });
        }
        return outputFiles;
    }
}

/**
 * Used to determine whether a file can be stored in the TypeScript LanguageServiceHost.
 * Since JavaScript is a subset of TypeScript, all JavaScript files qualify.
 */
function isTypeScriptFileName(fileName: string) {
    return fileExtensionIs(fileName, '.ts')
        || fileExtensionIs(fileName, '.tsx')
        || fileExtensionIs(fileName, '.d.ts')
        || isJavaScriptFileName(fileName);
}

function isJavaScriptFileName(fileName: string) {
    return fileExtensionIs(fileName, '.js')
        || fileExtensionIs(fileName, '.jsx');
}

/**
 * Used to determine whether a file can be stored in the Python LanguageServiceHost.
 */
function isPythonFileName(fileName: string) {
    return fileExtensionIs(fileName, '.py')
        || fileExtensionIs(fileName, '.pyx')
        || fileExtensionIs(fileName, '.d.py');
}

export enum DiagnosticCategory {
    Warning = 0,
    Error = 1,
    Message = 2
}

/**
 * The structure expected by the editor for a diagnostic.
 * This differs from the TypeScript structure in several respects.
 * 1) It does not contain the file.
 * 2) messageText has been flattened to message.
 * 3) code supports numeric for TypeScript and string for TsLint.
 */
export interface Diagnostic {
    message: string;
    start: number;
    length: number;
    category: DiagnosticCategory;
    code: number | string;
}

/**
 * Maps the TypeScript Diagnostic object to that expected by the editor.
 */
function tsDiagnosticToEditorDiagnostic(diagnostic: ts.Diagnostic): Diagnostic {
    return {
        message: ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
        start: diagnostic.start,
        length: diagnostic.length,
        category: diagnostic.category,
        code: diagnostic.code
    };
}

interface RulePosition {
    getPosition(): number;
}

interface RuleFailure {
    getStartPosition(): RulePosition;
    getEndPosition(): RulePosition;
    getRuleName(): string;
    getFailure(): string;
}

function ruleFailureToEditorDiagnostic(ruleFailure: RuleFailure): Diagnostic {
    const start: number = ruleFailure.getStartPosition().getPosition();
    const end: number = ruleFailure.getEndPosition().getPosition();
    const length = end - start;
    const ruleName = ruleFailure.getRuleName();
    return {
        message: ruleFailure.getFailure(),
        start,
        length,
        category: DiagnosticCategory.Warning,
        code: ruleName
    };
}

/**
 * systemModuleName(void 0, 'Foo.ts', 'js'))   => Foo.js
 * systemModuleName('./',   'Foo.ts', 'js'))   => ./Foo.js
 * systemModuleName(void 0, 'Foo.ts', 'd.ts')) => Foo.d.ts
 */
function systemModuleName(prefix: string, fileName: string, extension: string): string {
    const lastPeriod = fileName.lastIndexOf('.');
    if (lastPeriod >= 0) {
        const name = fileName.substring(0, lastPeriod);
        // const suffix = fileName.substring(lastPeriod + 1);
        if (typeof extension === 'string') {
            return [prefix, name, '.', extension].join('');
        }
        else {
            return [prefix, name].join('');
        }
    }
    else {
        if (typeof extension === 'string') {
            return [prefix, fileName, '.', extension].join('');
        }
        else {
            return [prefix, fileName].join('');
        }
    }
}

function getTargetFileName(fileName: string) {
    if (fileExtensionIs(fileName, '.py')) {
        const end = fileName.lastIndexOf('.py');
        return `${fileName.substring(0, end)}.ts`;
    }
    else {
        throw new Error(`getTargetFileName(${fileName})`);
    }
}

function targetNeedsUpdate(sourceVersion: number | undefined, targetVersion: number | undefined): boolean {
    if (typeof targetVersion === 'number') {
        if (typeof sourceVersion === 'number') {
            return sourceVersion > targetVersion;
        }
        else {
            throw new Error("sourceVersion should not be undefined");
        }
    }
    else {
        // There is no target hence no target version.
        return true;
    }
}
