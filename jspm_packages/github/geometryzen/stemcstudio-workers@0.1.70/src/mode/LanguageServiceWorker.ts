import Delta from '../Delta';
import WorkerCallback from "../WorkerCallback";
import DefaultLanguageServiceHost from './typescript/DefaultLanguageServiceHost';
import DocumentRegistryInspector from './typescript/DocumentRegistryInspector';

/**
 * 
 */
const useCaseSensitiveFileNames = true;

const EVENT_APPLY_DELTA = 'applyDelta';
const EVENT_SET_TRACE = 'setTrace';
const EVENT_DEFAULT_LIB_CONTENT = 'defaultLibContent';
const EVENT_ENSURE_SCRIPT = 'ensureScript';
const EVENT_REMOVE_SCRIPT = 'removeScript';
const EVENT_SET_MODULE_KIND = 'setModuleKind';
const EVENT_SET_SCRIPT_TARGET = 'setScriptTarget';
const EVENT_GET_SYNTAX_ERRORS = 'getSyntaxErrors';
const EVENT_GET_SEMANTIC_ERRORS = 'getSemanticErrors';
const EVENT_GET_COMPLETIONS_AT_POSITION = 'getCompletionsAtPosition';
const EVENT_GET_QUICK_INFO_AT_POSITION = 'getQuickInfoAtPosition';
const EVENT_GET_OUTPUT_FILES = 'getOutputFiles';
const EVENT_EXPERIMENTAL = 'experimental';

/**
 * systemModuleName(void 0, 'Foo.ts', 'js'))   => Foo.js
 * systemModuleName('./',   'Foo.ts', 'js'))   => ./Foo.js
 * systemModuleName(void 0, 'Foo.ts', 'd.ts')) => Foo.d.ts
 */
function systemModuleName(prefix: string, fileName: string, extension: string): string {
    const lastPeriod = fileName.lastIndexOf('.')
    if (lastPeriod >= 0) {
        const name = fileName.substring(0, lastPeriod)
        const suffix = fileName.substring(lastPeriod + 1)
        if (typeof extension === 'string') {
            return [prefix, name, '.', extension].join('')
        }
        else {
            return [prefix, name].join('')
        }
    }
    else {
        if (typeof extension === 'string') {
            return [prefix, fileName, '.', extension].join('')
        }
        else {
            return [prefix, fileName].join('')
        }
    }
}

/**
 * @class LanguageServiceWorker
 */
export default class LanguageServiceWorker {

    public trace: boolean = false;

    /**
     * @property host
     * @type DefaultLanguageServiceHost
     * @private
     */
    private host: DefaultLanguageServiceHost;

    /**
     * Language services debug assertion when switching compiler options #6965
     * -----------------------------------------------------------------------
     * The system assumes that files and compilation settings are not mutable.
     * There are places that are built on this assumption. 
     * Creating a new LS object is the correct way to go.
     * The system is wired to make this a cheap operation, by caching SourceFile objects, and reusing them.
     *
     * Which is why I am disposing of the LanguageService every time something changes.
     * I have a feeling though that I don't need to do it for deltas.
     *
     * Use the ensureLS() method to acquire a LanguageService.
     * Use the disposeLS() method to release a LanguageService. 
     * 
     * @property $service
     * @type LanguageService
     * @private
     */
    private $service: ts.LanguageService;

    private documentRegistry: DocumentRegistryInspector;

    /**
     * @class LanguageServiceWorker
     * @constructor
     * @param sender {WorkerCallback}
     */
    constructor(private sender: WorkerCallback) {

        this.host = new DefaultLanguageServiceHost();
        // Experimenting with an explicit document registry. 
        this.documentRegistry = new DocumentRegistryInspector(ts.createDocumentRegistry(useCaseSensitiveFileNames));

        sender.on(EVENT_SET_TRACE, (message: { data: { trace: boolean, callbackId: number } }) => {
            const {trace, callbackId} = message.data;
            try {
                this.trace = trace;
                this.documentRegistry.trace;
                if (this.trace) {
                    console.log(`${EVENT_SET_TRACE}(${trace})`)
                    console.log(JSON.stringify(this.host.getScriptFileNames(), null, 2))
                }
                this.resolve(EVENT_SET_TRACE, void 0, callbackId);
            }
            catch (err) {
                this.reject(EVENT_SET_TRACE, err, callbackId);
            }
        });

        sender.on(EVENT_DEFAULT_LIB_CONTENT, (message: { data: { content: string; callbackId: number } }) => {
            const {content, callbackId} = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_DEFAULT_LIB_CONTENT}(${this.host.getDefaultLibFileName({})})`)
                    console.log(JSON.stringify(this.host.getScriptFileNames(), null, 2))
                }
                this.disposeLS();
                this.host.ensureScript(this.host.getDefaultLibFileName({}), content);
                this.resolve(EVENT_DEFAULT_LIB_CONTENT, void 0, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_DEFAULT_LIB_CONTENT, reason, callbackId);
            }
        });

        sender.on(EVENT_ENSURE_SCRIPT, (message: { data: { fileName: string; content: string; callbackId } }) => {
            const {fileName, content, callbackId} = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_ENSURE_SCRIPT}(${fileName})`)
                    console.log(JSON.stringify(this.host.getScriptFileNames(), null, 2))
                }
                this.disposeLS();
                this.host.ensureScript(fileName, content);
                this.resolve(EVENT_ENSURE_SCRIPT, void 0, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_ENSURE_SCRIPT, reason, callbackId);
            }
        });

        sender.on(EVENT_APPLY_DELTA, (message: { data: { fileName: string; delta: Delta, callbackId: number } }) => {
            const {fileName, delta, callbackId} = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_APPLY_DELTA}(${fileName}, ${JSON.stringify(delta, null, 2)})`)
                    console.log(JSON.stringify(this.host.getScriptFileNames(), null, 2))
                }
                // this.disposeLS();
                this.host.applyDelta(fileName, delta);
                this.resolve(EVENT_APPLY_DELTA, void 0, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_APPLY_DELTA, reason, callbackId);
            }
        });

        sender.on(EVENT_REMOVE_SCRIPT, (message: { data: { fileName: string; callbackId: number } }) => {
            const {fileName, callbackId} = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_REMOVE_SCRIPT}(${fileName})`)
                    console.log(JSON.stringify(this.host.getScriptFileNames(), null, 2))
                }
                this.disposeLS();
                this.host.removeScript(fileName);
                this.resolve(EVENT_REMOVE_SCRIPT, void 0, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_REMOVE_SCRIPT, reason, callbackId);
            }
        });

        sender.on(EVENT_SET_MODULE_KIND, (message: { data: { moduleKind: string, callbackId: number } }) => {
            const {moduleKind, callbackId} = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_SET_MODULE_KIND}(${moduleKind})`)
                    console.log(JSON.stringify(this.host.getScriptFileNames(), null, 2))
                }
                this.disposeLS();
                this.host.moduleKind = moduleKind;
                this.resolve(EVENT_SET_MODULE_KIND, void 0, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_SET_MODULE_KIND, reason, callbackId);
            }
        });

        sender.on(EVENT_SET_SCRIPT_TARGET, (message: { data: { scriptTarget: string, callbackId: number } }) => {
            const {scriptTarget, callbackId} = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_SET_SCRIPT_TARGET}(${scriptTarget})`)
                    console.log(JSON.stringify(this.host.getScriptFileNames(), null, 2))
                }
                this.disposeLS();
                this.host.scriptTarget = scriptTarget;
                this.resolve(EVENT_SET_SCRIPT_TARGET, void 0, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_SET_SCRIPT_TARGET, reason, callbackId);
            }
        });

        sender.on(EVENT_GET_SYNTAX_ERRORS, (message: { data: { fileName: string; callbackId: number } }) => {
            const {fileName, callbackId} = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_GET_SYNTAX_ERRORS}(${fileName})`)
                    console.log(JSON.stringify(this.host.getScriptFileNames(), null, 2))
                }
                const diagnostics = this.ensureLS().getSyntacticDiagnostics(fileName);
                const errors = diagnostics.map(function(diagnostic: ts.Diagnostic) {
                    return { message: ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"), start: diagnostic.start, length: diagnostic.length };
                });
                this.resolve(EVENT_GET_SYNTAX_ERRORS, errors, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_GET_SYNTAX_ERRORS, reason, callbackId);
            }
        });

        sender.on(EVENT_GET_SEMANTIC_ERRORS, (message: { data: { fileName: string; callbackId: number } }) => {
            const {fileName, callbackId} = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_GET_SEMANTIC_ERRORS}(${fileName})`)
                    console.log(JSON.stringify(this.host.getScriptFileNames(), null, 2))
                }
                const diagnostics = this.ensureLS().getSemanticDiagnostics(fileName);
                const errors = diagnostics.map(function(diagnostic: ts.Diagnostic) {
                    return { message: ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"), start: diagnostic.start, length: diagnostic.length };
                });
                this.resolve(EVENT_GET_SEMANTIC_ERRORS, errors, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_GET_SEMANTIC_ERRORS, reason, callbackId);
            }
        });

        sender.on(EVENT_GET_COMPLETIONS_AT_POSITION, (message: { data: { fileName: string; position: number; prefix: string; callbackId: number } }) => {
            const {fileName, position, prefix, callbackId} = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_GET_COMPLETIONS_AT_POSITION}(${fileName}, ${position}, ${prefix})`)
                    console.log(JSON.stringify(this.host.getScriptFileNames(), null, 2))
                }
                if (typeof position !== 'number' || isNaN(position)) {
                    throw new Error("position must be a number and not NaN");
                }
                const completionInfo: ts.CompletionInfo = this.ensureLS().getCompletionsAtPosition(fileName, position);
                if (completionInfo) {
                    const completions: ts.CompletionEntry[] = completionInfo.entries;
                    this.resolve(EVENT_GET_COMPLETIONS_AT_POSITION, completions, callbackId);
                }
                else {
                    this.resolve(EVENT_GET_COMPLETIONS_AT_POSITION, [], callbackId);
                }
            }
            catch (reason) {
                this.reject(EVENT_GET_COMPLETIONS_AT_POSITION, reason, callbackId);
            }
        });

        sender.on(EVENT_GET_QUICK_INFO_AT_POSITION, (message: { data: { fileName: string; position: number; callbackId: number } }) => {
            const {fileName, position, callbackId} = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_GET_QUICK_INFO_AT_POSITION}(${fileName}, ${position})`)
                    console.log(JSON.stringify(this.host.getScriptFileNames(), null, 2))
                }
                if (typeof position !== 'number' || isNaN(position)) {
                    throw new Error("position must be a number and not NaN");
                }
                const quickInfo: ts.QuickInfo = this.ensureLS().getQuickInfoAtPosition(fileName, position);
                this.resolve(EVENT_GET_QUICK_INFO_AT_POSITION, quickInfo, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_GET_QUICK_INFO_AT_POSITION, reason, callbackId);
            }
        });

        sender.on(EVENT_GET_OUTPUT_FILES, (message: { data: { fileName: string; callbackId: number } }) => {
            const {fileName, callbackId} = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_GET_OUTPUT_FILES}(${fileName})`)
                    console.log(JSON.stringify(this.host.getScriptFileNames(), null, 2))
                }
                const sourceFile: ts.SourceFile = this.ensureLS().getSourceFile(fileName)
                const input = sourceFile.text
                const transpileOptions: ts.TranspileOptions = {}
                transpileOptions.compilerOptions = this.host.getCompilationSettings()
                transpileOptions.fileName = fileName    // What does this do, exactly?
                // We want named modules so that we can bundle in the Browser.
                // Maybe this could be an optional parameter in future?
                transpileOptions.moduleName = systemModuleName('./', fileName, 'js')
                transpileOptions.reportDiagnostics = false
                const output: ts.TranspileOutput = ts.transpileModule(input, transpileOptions)
                const outputFiles: ts.OutputFile[] = []
                outputFiles.push({ name: systemModuleName(void 0, fileName, 'js'), text: output.outputText, writeByteOrderMark: void 0 })
                // We're currently ignoring the source map.
                // outputFiles.push({ name: systemModuleName(void 0, fileName, 'js.map'), text: output.sourceMapText, writeByteOrderMark: void 0 })
                this.resolve(EVENT_GET_OUTPUT_FILES, outputFiles, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_GET_OUTPUT_FILES, reason, callbackId)
            }
            // The original implementation would create the JavaScript and d.ts files.
            /*
            try {
              const emitOutput: ts.EmitOutput = this.service.getEmitOutput(fileName);
              const outputFiles: ts.OutputFile[] = emitOutput.outputFiles;
              const response = { outputFiles: outputFiles, callbackId: callbackId };
              sender.emit("outputFiles", response);
            }
            catch (e) {
              sender.emit("outputFiles", {err: `${e}`, callbackId});
            }
            */
        })

        sender.on(EVENT_EXPERIMENTAL, (message: { data: { fileName: string; position: number; callbackId: number } }) => {
            const {fileName, position, callbackId} = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_EXPERIMENTAL}(${fileName}, ${position})`)
                    console.log(JSON.stringify(this.host.getScriptFileNames(), null, 2))
                }
                if (typeof position !== 'number' || isNaN(position)) {
                    throw new Error("position must be a number and not NaN");
                }
                const quickInfo: ts.QuickInfo = this.ensureLS().getQuickInfoAtPosition(fileName, position);
                this.resolve(EVENT_EXPERIMENTAL, quickInfo, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_EXPERIMENTAL, reason, callbackId);
            }
        });
    }

    /**
     * Ensures a LanguageService is cached, until it is invalidated.
     */
    ensureLS(): ts.LanguageService {
        if (!this.$service) {
            if (this.trace) {
                console.log("createLanguageService()")
            }
            this.$service = ts.createLanguageService(this.host, this.documentRegistry);
        }
        return this.$service;
    }

    /**
     * Disposes of the LanguageService.
     * This is needed when files change or compilation settings change.
     */
    disposeLS(): void {
        if (this.$service) {
            if (this.trace) {
                console.log("LanguageService.dispose()")
            }
            this.$service.dispose()
            this.$service = void 0;
        }
    }

    /**
     * Helper function for resolving a request.
     * Incorporates conditional tracing.
     */
    resolve(eventName: string, value: any, callbackId: number): void {
        if (this.trace) {
            console.log(`resolve(${eventName}, ${JSON.stringify(value, null, 2)})`)
        }
        this.sender.resolve(eventName, value, callbackId);
    }

    /**
     * Helper function for rejecting a request.
     * Incorporates conditional tracing.
     */
    reject(eventName: string, reason: any, callbackId: number): void {
        if (this.trace) {
            console.warn(`reject(${eventName}, ${reason})`)
        }
        this.sender.reject(eventName, reason, callbackId);
    }
}