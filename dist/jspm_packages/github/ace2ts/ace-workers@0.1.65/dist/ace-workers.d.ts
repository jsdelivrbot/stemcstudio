/**
 * ace-workers@0.1.65
 */
declare module AceWorkers {

    interface WorkerCallback {
        /**
         * Use to register for events. e.g. "change".
         */
        on(name: string, callback: (e: any) => any): void;
        callback(data: any, callbackId: number): void;
        emit(name: string, data?: any): void;
        resolve(eventName: string, value: any, callbackId: number): void;
        reject(eventName: string, reason: any, callbackId: number): void;
    }

    class HtmlWorker {
        constructor(sender: WorkerCallback);
    }

    class JavaScriptWorker {
        constructor(sender: WorkerCallback);
    }

    class TypeScriptWorker {
        constructor(sender: WorkerCallback);
    }

    class Sender implements WorkerCallback {
        constructor(target: any/*: WorkerGlobalScope*/);
        on(name: string, callback: (e: any) => any): void;
        callback(data: any, callbackId: number): void;
        emit(name: string, data?: any): void;
        resolve(eventName: string, value: any, callbackId: number): void;
        reject(eventName: string, reason: any, callbackId: number): void;
    }
}

declare module 'ace-workers.js'
{
    export default AceWorkers;
}
