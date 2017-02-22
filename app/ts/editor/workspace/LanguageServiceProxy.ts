import CompletionEntry from './CompletionEntry';
import Delta from '../Delta';
import Diagnostic from './Diagnostic';
import FormatCodeSettings from './FormatCodeSettings';
import TextChange from './TextChange';
import OutputFile from './OutputFile';
import QuickInfo from './QuickInfo';
import WorkerClient from '../worker/WorkerClient';
import setModuleKindCallback from './SetModuleKindCallback';
import setScriptTargetCallback from './SetScriptTargetCallback';

const EVENT_APPLY_DELTA = 'applyDelta';
const EVENT_DEFAULT_LIB_CONTENT = 'defaultLibContent';
const EVENT_ENSURE_SCRIPT = 'ensureScript';
const EVENT_GET_COMPLETIONS_AT_POSITION = 'getCompletionsAtPosition';
const EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT = 'getFormattingEditsForDocument';
const EVENT_GET_OUTPUT_FILES = 'getOutputFiles';
const EVENT_GET_SEMANTIC_ERRORS = 'getSemanticErrors';
const EVENT_GET_SYNTAX_ERRORS = 'getSyntaxErrors';
const EVENT_GET_QUICK_INFO_AT_POSITION = 'getQuickInfoAtPosition';
const EVENT_REMOVE_SCRIPT = 'removeScript';
const EVENT_SET_MODULE_KIND = 'setModuleKind';
const EVENT_SET_SCRIPT_TARGET = 'setScriptTarget';
const EVENT_SET_TRACE = 'setTrace';

interface WorkerClientData<T> {
    err?: any;
    value?: T;
    callbackId: number;
}

/**
 * This class is consumed by the WsModel.
 */
export default class LanguageServiceProxy {

    /**
     *
     */
    private readonly worker: WorkerClient;

    /**
     *
     */
    private readonly callbacks: { [id: number]: (err: any, results?: any) => any } = {};

    /**
     * The identifier for the next callback.
     */
    private callbackId = 1;

    /**
     * Creates the underlying WorkerClient and establishes listeners.
     * This method DOES NOT start the thread.
     *
     * @param workerUrl The URL of the JavaScript file for the worker.
     */
    constructor(workerUrl: string) {

        this.worker = new WorkerClient(workerUrl);

        this.worker.on(EVENT_APPLY_DELTA, (response: { data: WorkerClientData<any> }) => {
            const { err, callbackId } = response.data;
            const callback: (err: any) => void = this.releaseCallback(callbackId);
            callback(err);
        });

        this.worker.on(EVENT_DEFAULT_LIB_CONTENT, (response: { data: WorkerClientData<any> }) => {
            const { err, callbackId } = response.data;
            const callback: (err: any) => void = this.releaseCallback(callbackId);
            callback(err);
        });

        this.worker.on(EVENT_ENSURE_SCRIPT, (response: { data: WorkerClientData<any> }) => {
            const { err, callbackId } = response.data;
            const callback: (err: any) => void = this.releaseCallback(callbackId);
            callback(err);
        });

        this.worker.on(EVENT_REMOVE_SCRIPT, (response: { data: WorkerClientData<any> }) => {
            const { err, callbackId } = response.data;
            const callback: (err: any) => void = this.releaseCallback(callbackId);
            callback(err);
        });

        this.worker.on(EVENT_GET_SYNTAX_ERRORS, (response: { data: WorkerClientData<Diagnostic[]> }) => {
            const { err, value, callbackId } = response.data;
            const callback: (err: any, results?: Diagnostic[]) => void = this.releaseCallback(callbackId);
            callback(err, value);
        });

        this.worker.on(EVENT_GET_SEMANTIC_ERRORS, (response: { data: WorkerClientData<Diagnostic[]> }) => {
            const { err, value, callbackId } = response.data;
            const callback: (err: any, results?: Diagnostic[]) => void = this.releaseCallback(callbackId);
            callback(err, value);
        });

        this.worker.on(EVENT_GET_COMPLETIONS_AT_POSITION, (response: { data: WorkerClientData<CompletionEntry[]> }) => {
            const { err, value, callbackId } = response.data;
            const callback: (err: any, results?: CompletionEntry[]) => void = this.releaseCallback(callbackId);
            callback(err, value);
        });

        this.worker.on(EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT, (response: { data: WorkerClientData<TextChange[]> }) => {
            const { err, value, callbackId } = response.data;
            const callback: (err: any, textChanges?: TextChange[]) => void = this.releaseCallback(callbackId);
            callback(err, value);
        });

        this.worker.on(EVENT_GET_QUICK_INFO_AT_POSITION, (response: { data: WorkerClientData<QuickInfo> }) => {
            const { err, value, callbackId } = response.data;
            const callback: (err: any, quickInfo?: QuickInfo) => void = this.releaseCallback(callbackId);
            callback(err, value);
        });

        this.worker.on(EVENT_GET_OUTPUT_FILES, (response: { data: WorkerClientData<OutputFile[]> }) => {
            const { err, value, callbackId } = response.data;
            const callback: (err: any, outputFiles?: OutputFile[]) => void = this.releaseCallback(callbackId);
            callback(err, value);
        });

        this.worker.on(EVENT_SET_MODULE_KIND, (response: { data: WorkerClientData<any> }) => {
            const { err, callbackId } = response.data;
            const callback: setModuleKindCallback = this.releaseCallback(callbackId);
            callback(err);
        });

        this.worker.on(EVENT_SET_SCRIPT_TARGET, (response: { data: WorkerClientData<any> }) => {
            const { err, callbackId } = response.data;
            const callback: setScriptTargetCallback = this.releaseCallback(callbackId);
            callback(err);
        });

        this.worker.on(EVENT_SET_TRACE, (response: { data: WorkerClientData<any> }) => {
            const { err, callbackId } = response.data;
            const callback: (err: any) => any = this.releaseCallback(callbackId);
            callback(err);
        });
    }

    initialize(scriptImports: string[], callback: (err: any) => any): void {
        this.worker.init(scriptImports, 'ace-workers.js', 'LanguageServiceWorker', function (err: any) {
            if (err) {
                console.warn(`worker.init() failed ${err}`);
            }
            callback(err);
        });
    }

    terminate(): void {
        this.worker.dispose();
    }

    setDefaultLibContent(content: string, callback: (err: any) => any): void {
        const callbackId = this.captureCallback(callback);
        const message = { data: { content, callbackId } };
        this.worker.emit(EVENT_DEFAULT_LIB_CONTENT, message);
    }

    private captureCallback(callback: (err: any, results?: any) => any): number {
        if (callback) {
            const callbackId = this.callbackId++;
            this.callbacks[callbackId] = callback;
            return callbackId;
        }
        else {
            return void 0;
        }
    }

    private releaseCallback(callbackId: number) {
        if (typeof callbackId === 'number') {
            const callback = this.callbacks[callbackId];
            delete this.callbacks[callbackId];
            return callback;
        }
        else {
            return void 0;
        }
    }

    ensureScript(path: string, content: string, callback: (err: any) => any): void {
        const callbackId = this.captureCallback(callback);
        // content = content.replace(/\r\n?/g, '\n');
        const message = { data: { fileName: path, content, callbackId } };
        this.worker.emit(EVENT_ENSURE_SCRIPT, message);
    }

    applyDelta(path: string, delta: Delta, callback: (err: any) => any): void {
        const callbackId = this.captureCallback(callback);
        const message = { data: { fileName: path, delta, callbackId } };
        this.worker.emit(EVENT_APPLY_DELTA, message);
    }

    removeScript(path: string, callback: (err: any) => any): void {
        function hook(err: any) {
            if (err) {
                console.warn(`LanguageServiceProxy.removeScript(${path}) failed. ${err}`);
            }
            callback(err);
        }
        const callbackId = this.captureCallback(hook);
        this.worker.emit(EVENT_REMOVE_SCRIPT, { data: { fileName: path, callbackId } });
    }

    public setModuleKind(moduleKind: string, callback: setModuleKindCallback): void {
        const callbackId = this.captureCallback(callback);
        const message = { data: { moduleKind, callbackId } };
        this.worker.emit(EVENT_SET_MODULE_KIND, message);
    }

    public setScriptTarget(scriptTarget: string, callback: setScriptTargetCallback): void {
        const callbackId = this.captureCallback(callback);
        const message = { data: { scriptTarget, callbackId } };
        this.worker.emit(EVENT_SET_SCRIPT_TARGET, message);
    }

    public setTrace(trace: boolean, callback: (err: any) => any): void {
        const callbackId = this.captureCallback(callback);
        const message = { data: { trace, callbackId } };
        this.worker.emit(EVENT_SET_TRACE, message);
    }

    public getSyntaxErrors(fileName: string, callback: (err: any, results: Diagnostic[]) => void): void {
        const callbackId = this.captureCallback(callback);
        const message = { data: { fileName, callbackId } };
        this.worker.emit(EVENT_GET_SYNTAX_ERRORS, message);
    }

    public getSemanticErrors(fileName: string, callback: (err: any, results: Diagnostic[]) => void): void {
        const callbackId = this.captureCallback(callback);
        const message = { data: { fileName, callbackId } };
        this.worker.emit(EVENT_GET_SEMANTIC_ERRORS, message);
    }

    private _getCompletionsAtPosition(fileName: string, position: number, prefix: string, callback: (err: any, completions: CompletionEntry[]) => void): void {
        const callbackId = this.captureCallback(callback);
        const message = { data: { fileName, position, prefix, callbackId } };
        this.worker.emit(EVENT_GET_COMPLETIONS_AT_POSITION, message);
    }

    getCompletionsAtPosition(fileName: string, position: number, prefix: string): Promise<CompletionEntry[]> {
        return new Promise<CompletionEntry[]>((resolve, reject) => {
            this._getCompletionsAtPosition(fileName, position, prefix, function (err: any, completions: CompletionEntry[]) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(completions);
                }
            });
        });
    }

    public getFormattingEditsForDocument(fileName: string, settings: FormatCodeSettings, callback: (err: any, textChanges: TextChange[]) => any): void {
        const callbackId = this.captureCallback(callback);
        const message = { data: { fileName, settings, callbackId } };
        this.worker.emit(EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT, message);
    }

    public getQuickInfoAtPosition(fileName: string, position: number, callback: (err: any, quickInfo: QuickInfo) => any): void {
        const callbackId = this.captureCallback(callback);
        const message = { data: { fileName, position, callbackId } };
        this.worker.emit(EVENT_GET_QUICK_INFO_AT_POSITION, message);
    }

    getOutputFiles(fileName: string, callback: (err: any, outputFiles: OutputFile[]) => any): void {
        const callbackId = this.captureCallback(callback);
        const message = { data: { fileName, callbackId } };
        this.worker.emit(EVENT_GET_OUTPUT_FILES, message);
    }
}
