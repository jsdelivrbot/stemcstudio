import CompletionEntry from './CompletionEntry';
import Delta from '../Delta';
import Diagnostic from './Diagnostic';
import OutputFile from './OutputFile';
import QuickInfo from './QuickInfo';
import WorkerClient from '../worker/WorkerClient';
import setModuleKindCallback from './SetModuleKindCallback';
import setScriptTargetCallback from './SetScriptTargetCallback';

const EVENT_APPLY_DELTA = 'applyDelta';
const EVENT_DEFAULT_LIB_CONTENT = 'defaultLibContent';
const EVENT_ENSURE_SCRIPT = 'ensureScript';
const EVENT_REMOVE_SCRIPT = 'removeScript';
const EVENT_GET_SYNTAX_ERRORS = 'getSyntaxErrors';
const EVENT_GET_SEMANTIC_ERRORS = 'getSemanticErrors';
const EVENT_SET_MODULE_KIND = 'setModuleKind';
const EVENT_SET_SCRIPT_TARGET = 'setScriptTarget';
const EVENT_SET_TRACE = 'setTrace';
const EVENT_GET_COMPLETIONS_AT_POSITION = 'getCompletionsAtPosition';
const EVENT_GET_QUICK_INFO_AT_POSITION = 'getQuickInfoAtPosition';
const EVENT_GET_OUTPUT_FILES = 'getOutputFiles';

interface WorkerClientData<T> {
    err?: any;
    value?: T;
    callbackId: number;
}

/**
 * @class LanguageServiceProxy
 */
export default class LanguageServiceProxy {

    /**
     * @property worker
     * @type WorkerClient
     * @private
     */
    private worker: WorkerClient;

    /**
     * @property callbacks
     * @private
     */
    private callbacks: { [id: number]: (err: any, results?: any) => any } = {};

    /**
     * The identifier for the next callback.
     *
     * @property callbackId
     * @type number
     * @private
     */
    private callbackId = 1;

    /**
     * @class LanguageServiceProxy
     * @constructor
     * @param workerUrl {string}
     */
    constructor(workerUrl: string) {

        this.worker = new WorkerClient(workerUrl);

        this.worker.on(EVENT_APPLY_DELTA, (response: { data: WorkerClientData<any> }) => {
            const {err, callbackId} = response.data;
            const callback: (err: any) => void = this.releaseCallback(callbackId);
            callback(err);
        });

        this.worker.on(EVENT_DEFAULT_LIB_CONTENT, (response: { data: WorkerClientData<any> }) => {
            const {err, callbackId} = response.data;
            const callback: (err: any) => void = this.releaseCallback(callbackId);
            callback(err);
        });

        this.worker.on(EVENT_ENSURE_SCRIPT, (response: { data: WorkerClientData<any> }) => {
            const {err, callbackId} = response.data;
            const callback: (err: any) => void = this.releaseCallback(callbackId);
            callback(err);
        });

        this.worker.on(EVENT_REMOVE_SCRIPT, (response: { data: WorkerClientData<any> }) => {
            const {err, callbackId} = response.data;
            const callback: (err: any) => void = this.releaseCallback(callbackId);
            callback(err);
        });

        this.worker.on(EVENT_GET_SYNTAX_ERRORS, (response: { data: WorkerClientData<Diagnostic[]> }) => {
            const {err, value, callbackId} = response.data;
            const callback: (err: any, results?: Diagnostic[]) => void = this.releaseCallback(callbackId);
            callback(err, value);
        });

        this.worker.on(EVENT_GET_SEMANTIC_ERRORS, (response: { data: WorkerClientData<Diagnostic[]> }) => {
            const {err, value, callbackId} = response.data;
            const callback: (err: any, results?: Diagnostic[]) => void = this.releaseCallback(callbackId);
            callback(err, value);
        });

        this.worker.on(EVENT_GET_COMPLETIONS_AT_POSITION, (response: { data: WorkerClientData<CompletionEntry[]> }) => {
            const {err, value, callbackId} = response.data;
            const callback: (err: any, results?: CompletionEntry[]) => void = this.releaseCallback(callbackId);
            callback(err, value);
        });

        this.worker.on(EVENT_GET_QUICK_INFO_AT_POSITION, (response: { data: WorkerClientData<QuickInfo> }) => {
            const {err, value, callbackId} = response.data;
            const callback: (err: any, quickInfo?: QuickInfo) => void = this.releaseCallback(callbackId);
            callback(err, value);
        });

        this.worker.on(EVENT_GET_OUTPUT_FILES, (response: { data: WorkerClientData<OutputFile[]> }) => {
            const {err, value, callbackId} = response.data;
            const callback: (err: any, outputFiles?: OutputFile[]) => void = this.releaseCallback(callbackId);
            callback(err, value);
        });

        this.worker.on(EVENT_SET_MODULE_KIND, (response: { data: WorkerClientData<any> }) => {
            const {err, callbackId} = response.data;
            const callback: setModuleKindCallback = this.releaseCallback(callbackId);
            callback(err);
        });

        this.worker.on(EVENT_SET_SCRIPT_TARGET, (response: { data: WorkerClientData<any> }) => {
            const {err, callbackId} = response.data;
            const callback: setScriptTargetCallback = this.releaseCallback(callbackId);
            callback(err);
        });

        this.worker.on(EVENT_SET_TRACE, (response: { data: WorkerClientData<any> }) => {
            const {err, callbackId} = response.data;
            const callback: (err: any) => any = this.releaseCallback(callbackId);
            callback(err);
        });
    }

    /**
     * @method init
     * @param scriptImports {string[]}
     * @param callback {(err: any) => any}
     * @return {void}
     */
    init(scriptImports: string[], callback: (err: any) => any): void {
        this.worker.init(scriptImports, 'ace-workers.js', 'LanguageServiceWorker', callback);
    }

    /**
     * @method terminate
     * @return {void}
     */
    terminate(): void {
        this.worker.terminate();
    }

    /**
     * @method setDefaultLibContent
     * @param content {string}
     * @return {void}
     */
    setDefaultLibContent(content: string, callback: (err: any) => any): void {
        const callbackId = this.captureCallback(callback);
        const message = { data: { content, callbackId } };
        this.worker.emit(EVENT_DEFAULT_LIB_CONTENT, message);
    }

    /**
     *
     */
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

    /**
     *
     */
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

    /**
     * @method ensureScript
     * @param fileName {string}
     * @param content {string}
     * @param callback {(err: any) => any}
     * @return {void}
     */
    ensureScript(fileName: string, content: string, callback: (err: any) => any): void {
        const callbackId = this.captureCallback(callback);
        // content = content.replace(/\r\n?/g, '\n');
        const message = { data: { fileName, content, callbackId } };
        this.worker.emit(EVENT_ENSURE_SCRIPT, message);
    }

    /**
     * @method applyDelta
     * @param fileName {string}
     * @param delta {Delta}
     * @param callback {(err: any) => any}
     * @return {void}
     */
    applyDelta(fileName: string, delta: Delta, callback: (err: any) => any): void {
        const callbackId = this.captureCallback(callback);
        const message = { data: { fileName, delta, callbackId } };
        this.worker.emit(EVENT_APPLY_DELTA, message);
    }

    /**
     * @method removeScript
     * @param fileName {string}
     * @param callback {(err: any) => any}
     * @return {void}
     */
    removeScript(fileName: string, callback: (err: any) => any): void {
        const callbackId = this.captureCallback(callback);
        this.worker.emit(EVENT_REMOVE_SCRIPT, { data: { fileName, callbackId } });
    }

    /**
     * @method setModuleKind
     * @param moduleKind {string}
     * @param callback {setModuleKindCallback}
     * @return {void}
     */
    public setModuleKind(moduleKind: string, callback: setModuleKindCallback): void {
        const callbackId = this.captureCallback(callback);
        const message = { data: { moduleKind, callbackId } };
        this.worker.emit(EVENT_SET_MODULE_KIND, message);
    }

    /**
     * @method setScriptTarget
     * @param scriptTarget {string}
     * @param callback {setScriptTargetCallback}
     * @return {void}
     */
    public setScriptTarget(scriptTarget: string, callback: setScriptTargetCallback): void {
        const callbackId = this.captureCallback(callback);
        const message = { data: { scriptTarget, callbackId } };
        this.worker.emit(EVENT_SET_SCRIPT_TARGET, message);
    }

    /**
     * @method setTrace
     * @param trace {boolean}
     * @param callback {setModuleKindCallback}
     * @return {void}
     */
    public setTrace(trace: boolean, callback: (err: any) => any): void {
        const callbackId = this.captureCallback(callback);
        const message = { data: { trace, callbackId } };
        this.worker.emit(EVENT_SET_TRACE, message);
    }

    /**
     * @method getSyntaxErrors
     * @param fileName {string}
     * @param callback {(err: any, results: Diagnostic[]) => void}
     * @return {void}
     */
    public getSyntaxErrors(fileName: string, callback: (err: any, results: Diagnostic[]) => void): void {
        const callbackId = this.captureCallback(callback);
        const message = { data: { fileName, callbackId } };
        this.worker.emit(EVENT_GET_SYNTAX_ERRORS, message);
    }

    /**
     * @method getSemanticErrors
     * @param fileName {string}
     * @param callback {(err: any, results: Diagnostic[]) => void}
     * @return {void}
     */
    public getSemanticErrors(fileName: string, callback: (err: any, results: Diagnostic[]) => void): void {
        const callbackId = this.captureCallback(callback);
        const message = { data: { fileName, callbackId } };
        this.worker.emit(EVENT_GET_SEMANTIC_ERRORS, message);
    }

    /**
     * @method _getCompletionsAtPosition
     * @param fileName {string}
     * @param position {number}
     * @param prefix {string}
     * @param callback {(err, completions) => any}
     * @return {void}
     * @private
     */
    private _getCompletionsAtPosition(fileName: string, position: number, prefix: string, callback: (err: any, completions: CompletionEntry[]) => void): void {
        const callbackId = this.captureCallback(callback);
        const message = { data: { fileName, position, prefix, callbackId } };
        this.worker.emit(EVENT_GET_COMPLETIONS_AT_POSITION, message);
    }

    /**
     * @method getCompletionsAtPosition
     * @param fileName {string}
     * @param position {number}
     * @param prefix {string}
     * @return {Promise<CompletionEntry[]>} CompletionEntry[]
     */
    getCompletionsAtPosition(fileName: string, position: number, prefix: string): Promise<CompletionEntry[]> {
        return new Promise<CompletionEntry[]>((resolve, reject) => {
            this._getCompletionsAtPosition(fileName, position, prefix, function(err: any, completions: CompletionEntry[]) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(completions);
                }
            });
        });
    }

    /**
     * @method getQuickInfoAtPosition
     * @param fileName {string}
     * @param position {number}
     * @param callback {(err, quickInfo: ExtendedQuickInfo) => any}
     * @return {void}
     */
    public getQuickInfoAtPosition(fileName: string, position: number, callback: (err: any, quickInfo: QuickInfo) => any): void {
        const callbackId = this.captureCallback(callback);
        const message = { data: { fileName, position, callbackId } };
        this.worker.emit(EVENT_GET_QUICK_INFO_AT_POSITION, message);
    }

    /**
     * @method getOutputFiles
     * @param fileName {string}
     * @param callback {(err: any, outputFiles: OutputFile[]) => any}
     * @return {void}
     */
    getOutputFiles(fileName: string, callback: (err: any, outputFiles: OutputFile[]) => any): void {
        const callbackId = this.captureCallback(callback);
        const message = { data: { fileName, callbackId } };
        this.worker.emit(EVENT_GET_OUTPUT_FILES, message);
    }
}
