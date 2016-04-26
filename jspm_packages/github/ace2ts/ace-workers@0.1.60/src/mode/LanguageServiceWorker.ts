import Delta from '../Delta';
import WorkerCallback from "../WorkerCallback";
import DefaultLanguageServiceHost from './typescript/DefaultLanguageServiceHost';

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
     * @property service
     * @type LanguageService
     * @private
     */
    private service: ts.LanguageService;

    /**
     * @class LanguageServiceWorker
     * @constructor
     * @param sender {WorkerCallback}
     */
    constructor(private sender: WorkerCallback) {

        this.host = new DefaultLanguageServiceHost();
        this.service = ts.createLanguageService(this.host);

        sender.on(EVENT_SET_TRACE, (message: { data: { trace: boolean, callbackId: number } }) => {
            const {trace, callbackId} = message.data;
            try {
                this.trace = trace;
                if (this.trace) {
                    console.log(`${EVENT_SET_TRACE}(${trace})`)
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
                }
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
                }
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
                }
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
                }
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
                }
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
                }
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
                }
                const diagnostics = this.service.getSyntacticDiagnostics(fileName);
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
                }
                const diagnostics = this.service.getSemanticDiagnostics(fileName);
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
                }
                if (typeof position !== 'number' || isNaN(position)) {
                    throw new Error("position must be a number and not NaN");
                }
                const completionInfo: ts.CompletionInfo = this.service.getCompletionsAtPosition(fileName, position);
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
                }
                if (typeof position !== 'number' || isNaN(position)) {
                    throw new Error("position must be a number and not NaN");
                }
                const quickInfo: ts.QuickInfo = this.service.getQuickInfoAtPosition(fileName, position);
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
                }
                const sourceFile: ts.SourceFile = this.service.getSourceFile(fileName)
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