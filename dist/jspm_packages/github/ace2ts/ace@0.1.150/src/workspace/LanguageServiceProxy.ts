import CompletionEntry from './CompletionEntry';
import Delta from '../Delta';
import Diagnostic from './Diagnostic';
import OutputFile from './OutputFile';
import QuickInfo from './QuickInfo';
import WorkerClient from '../worker/WorkerClient';
import getModuleKindCallback from './getModuleKindCallback';
import getScriptTargetCallback from './getScriptTargetCallback';
import setModuleKindCallback from './setModuleKindCallback';
import setScriptTargetCallback from './setScriptTargetCallback';

const EVENT_DEFAULT_LIB_CONTENT = 'defaultLibContent';

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

        this.worker.on(EVENT_DEFAULT_LIB_CONTENT, (response: { data: { err: any; callbackId: number } }) => {
            const data = response.data;
            const callbackId: number = data.callbackId;
            const callback: (err: any) => void = this.callbacks[callbackId];
            delete this.callbacks[callbackId];
            if ('err' in data) {
                callback(data.err);
            }
            else {
                callback(void 0);
            }
        });

        this.worker.on('syntaxErrors', (response: { data: { errors: Diagnostic[]; callbackId: number } }) => {
            var data = response.data;
            var errors = data.errors;
            var id: number = data.callbackId;
            var callback: (err: any, results?: Diagnostic[]) => void = this.callbacks[id];
            delete this.callbacks[id];
            callback(null, errors);
        });

        this.worker.on('semanticErrors', (response: { data: { errors: Diagnostic[]; callbackId: number } }) => {
            var data = response.data;
            var errors = data.errors;
            var id: number = data.callbackId;
            var callback: (err: any, results?: Diagnostic[]) => void = this.callbacks[id];
            delete this.callbacks[id];
            callback(null, errors);
        });

        this.worker.on('completions', (response: { data: { err: any; completions: CompletionEntry[]; callbackId: number } }) => {
            var data = response.data;
            var id: number = data.callbackId;
            var callback: (err: any, results?: CompletionEntry[]) => void = this.callbacks[id];
            delete this.callbacks[id];
            if ('err' in data) {
                callback(data.err);
            }
            else {
                callback(void 0, data.completions);
            }
        });

        this.worker.on('quickInfo', (response: { data: { err: any; quickInfo: QuickInfo; callbackId: number } }) => {
            var data = response.data;
            var id: number = data.callbackId;
            var callback: (err: any, results?: QuickInfo) => void = this.callbacks[id];
            delete this.callbacks[id];
            if ('err' in data) {
                callback(data.err);
            }
            else {
                callback(void 0, data.quickInfo);
            }
        });

        this.worker.on('outputFiles', (response: { data: { err: any; outputFiles: OutputFile[]; callbackId: number } }) => {
            var data = response.data;
            var id: number = data.callbackId;
            var callback: (err: any, outputFiles?: OutputFile[]) => void = this.callbacks[id];
            delete this.callbacks[id];
            if ('err' in data) {
                callback(data.err);
            }
            else {
                callback(void 0, data.outputFiles);
            }
        });

        this.worker.on('getModuleKind', (response: { data: { err: any; moduleKind: string; callbackId: number } }) => {
            const data = response.data;
            const id: number = data.callbackId;
            const callback: getModuleKindCallback = this.callbacks[id];
            delete this.callbacks[id];
            if ('err' in data) {
                callback(data.err);
            }
            else {
                callback(void 0, data.moduleKind);
            }
        });

        this.worker.on('setModuleKind', (response: { data: { err: any; callbackId: number } }) => {
            const data = response.data;
            const id: number = data.callbackId;
            const callback: setModuleKindCallback = this.callbacks[id];
            delete this.callbacks[id];
            if ('err' in data) {
                callback(data.err);
            }
            else {
                callback(void 0);
            }
        });

        this.worker.on('getScriptTarget', (response: { data: { err: any; scriptTarget: string; callbackId: number } }) => {
            const data = response.data;
            const id: number = data.callbackId;
            const callback: getScriptTargetCallback = this.callbacks[id];
            delete this.callbacks[id];
            if ('err' in data) {
                callback(data.err);
            }
            else {
                callback(void 0, data.scriptTarget);
            }
        });

        this.worker.on('setScriptTarget', (response: { data: { err: any; callbackId: number } }) => {
            const data = response.data;
            const id: number = data.callbackId;
            const callback: setScriptTargetCallback = this.callbacks[id];
            delete this.callbacks[id];
            if ('err' in data) {
                callback(data.err);
            }
            else {
                callback(void 0);
            }
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
        const callbackId = this.callbackId++;
        this.callbacks[callbackId] = callback;
        content = content.replace(/\r\n?/g, '\n');
        const message = { data: { content, callbackId } };
        this.worker.emit(EVENT_DEFAULT_LIB_CONTENT, message);
    }

    /**
     * @method ensureScript
     * @param fileName {string}
     * @param content {string}
     * @return {void}
     */
    ensureScript(fileName: string, content: string): void {
        var message = { data: { 'fileName': fileName, 'content': content.replace(/\r\n?/g, '\n') } };
        this.worker.emit("ensureScript", message);
    }

    /**
     * @method applyDelta
     * @param fileName {string}
     * @param delta {Delta}
     * @return {void}
     */
    applyDelta(fileName: string, delta: Delta): void {
        var message = { data: { 'fileName': fileName, 'delta': delta } };
        this.worker.emit("applyDelta", message);
    }

    /**
     * @method removeScript
     * @param fileName {string}
     * @return {void}
     */
    removeScript(fileName: string): void {
        this.worker.emit("removeScript", { data: { 'fileName': fileName } });
    }

    /**
     * @method getModuleKind
     * @param callback {getModuleKindCallback}
     * @return {void}
     */
    public getModuleKind(callback: getModuleKindCallback): void {
        const callbackId = this.callbackId++;
        this.callbacks[callbackId] = callback;
        const message = { data: { callbackId } };
        this.worker.emit("getModuleKind", message);
    }

    /**
     * @method setModuleKind
     * @param moduleKind {string}
     * @param callback {setModuleKindCallback}
     * @return {void}
     */
    public setModuleKind(moduleKind: string, callback: setModuleKindCallback): void {
        const callbackId = this.callbackId++;
        this.callbacks[callbackId] = callback;
        const message = { data: { moduleKind, callbackId } };
        this.worker.emit("setModuleKind", message);
    }

    /**
     * @method getScriptTarget
     * @param callback {getScriptTargetCallback}
     * @return {void}
     */
    public getScriptTarget(callback: getScriptTargetCallback): void {
        const callbackId = this.callbackId++;
        this.callbacks[callbackId] = callback;
        const message = { data: { callbackId } };
        this.worker.emit("getScriptTarget", message);
    }

    /**
     * @method setScriptTarget
     * @param scriptTarget {string}
     * @param callback {setScriptTargetCallback}
     * @return {void}
     */
    public setScriptTarget(scriptTarget: string, callback: setScriptTargetCallback): void {
        const callbackId = this.callbackId++;
        this.callbacks[callbackId] = callback;
        const message = { data: { scriptTarget, callbackId } };
        this.worker.emit("setScriptTarget", message);
    }

    /**
     * @method getSyntaxErrors
     * @param fileName {string}
     * @param callback {(err: any, results: Diagnostic[]) => void}
     * @return {void}
     */
    public getSyntaxErrors(fileName: string, callback: (err: any, results: Diagnostic[]) => void): void {
        var id = this.callbackId++;
        this.callbacks[id] = callback;
        var message = { data: { fileName: fileName, callbackId: id } };
        this.worker.emit("getSyntaxErrors", message);
    }

    /**
     * @method getSemanticErrors
     * @param fileName {string}
     * @param callback {(err: any, results: Diagnostic[]) => void}
     * @return {void}
     */
    public getSemanticErrors(fileName: string, callback: (err: any, results: Diagnostic[]) => void): void {
        var id = this.callbackId++;
        this.callbacks[id] = callback;
        var message = { data: { fileName: fileName, callbackId: id } };
        this.worker.emit("getSemanticErrors", message);
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
        var id = this.callbackId++;
        this.callbacks[id] = callback;
        var message = { data: { fileName: fileName, position: position, prefix: prefix, callbackId: id } };
        this.worker.emit("getCompletionsAtPosition", message);
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
     * @method _getQuickInfoAtPosition
     * @param fileName {string}
     * @param position {number}
     * @param callback {(err, quickInfo: QuickInfo) => any}
     * @return {void}
     * @private
     */
    private _getQuickInfoAtPosition(fileName: string, position: number, callback: (err: any, quickInfo: QuickInfo) => void): void {
        var id = this.callbackId++;
        this.callbacks[id] = callback;
        var message = { data: { fileName: fileName, position: position, callbackId: id } };
        this.worker.emit("getQuickInfoAtPosition", message);
    }

    /**
     * @method getQuickInfoAtPosition
     * @param fileName {string}
     * @param position {number}
     * @return {Promise<QuickInfo>} QuickInfo
     */
    getQuickInfoAtPosition(fileName: string, position: number): Promise<QuickInfo> {
        return new Promise<QuickInfo>((resolve, reject) => {
            this._getQuickInfoAtPosition(fileName, position, function(err: any, quickInfo: QuickInfo) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(quickInfo);
                }
            });
        });
    }

    /**
     * @method getOutputFiles
     * @param fileName {string}
     * @return {Promise} OutputFile
     */
    getOutputFiles(fileName: string): Promise<OutputFile[]> {
        return new Promise<OutputFile[]>((resolve, reject) => {
            var id = this.callbackId++;
            this.callbacks[id] = function(err: any, outputFiles: OutputFile[]) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(outputFiles);
                }
            };
            var message = { data: { fileName: fileName, callbackId: id } };
            this.worker.emit("getOutputFiles", message);
        });
    }

}
