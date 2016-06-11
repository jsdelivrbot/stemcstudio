"use strict";

import {qualifyURL} from '../lib/net';
import Delta from "../Delta";
import Document from "../Document";
import EventBus from "../EventBus";
import EventEmitterClass from '../lib/EventEmitterClass';
import {get} from "../config";
import CallbackManager from './CallbackManager';

// FIXME: This class is begging to be written using the functional constructor
// pattern in order to provide better encapsulation and avoid the `this` binding
// issues associated with the class pattern or class syntactic sugar.

/**
 * <p>
 * WorkerClient controls the interaction between an editor document
 * and a Web Worker.
 * </p>
 * It provides additional capabilities by being a wrapper around
 * an underlying Web Worker:
 * <ul>
 * <li>
 * It is a controller between the editor
 * <code>Document</code> and the <code>Worker</code> thread.
 * </li>
 * <li>
 * It is a proxy to the underlying worker thread by providing
 * convenience functions for both ansychronous postMessage as
 * well as aynchronous request/response patterns.
 * </li>
 * <li>
 * It is a message hub, allowing listeners to connect to it
 * and receive events that originated in the worker thread.
 * </li>
 * </ul>
 *
 * @class WorkerClient
 */
export default class WorkerClient implements EventBus<MessageEvent, WorkerClient> {

    /**
     * The underlying Web Worker.
     */
    private worker: Worker;

    /**
     * Changes in the Document are queued here so that they can
     * later be posted to the worker thread.
     *
     * @property deltaQueue
     * @type Delta[]
     * @private
     */
    private deltaQueue: Delta[];

    private callbackManager = new CallbackManager();

    /**
     * @property editorDocument
     * @type Document
     * @private
     */
    private $doc: Document;

    /**
     * @property eventBus
     * @type EventEmitterClass<WorkerClient>
     * @private
     */
    private eventBus: EventEmitterClass<MessageEvent, WorkerClient>;

    /**
     * @class WorkerClient
     * @constructor
     * @param workerUrl {string}
     */
    constructor(private workerUrl: string) {
        this.eventBus = new EventEmitterClass<MessageEvent, WorkerClient>(this);
        this.sendDeltaQueue = this.sendDeltaQueue.bind(this);
        this.changeListener = this.changeListener.bind(this);
        this.onMessage = this.onMessage.bind(this);
    }

    /**
     * Posts a message to the worker thread causing the thread to be started.
     *
     * @method init
     * @param scriptImports {string[]}
     * @param moduleName {string}
     * @param className {string}
     * @param callback {(err: any) => any}
     * @return {void}
     */
    init(scriptImports: string[], moduleName: string, className: string, callback: (err: any) => any): void {

        if (this.worker) {
            console.warn("The worker is already initialized")
            setTimeout(callback, 0);
            return;
        }

        const workerUrl = qualifyURL(this.workerUrl);
        try {
            // The worker thread will not be started until we post a message to it (below).
            this.worker = new Worker(workerUrl);
        }
        catch (e) {
            if (e instanceof window['DOMException']) {
                // Likely same origin problem. Use importScripts from a shim Worker.
                const blob: Blob = this.createBlob(workerUrl);
                const URL: URL = window['URL'] || window['webkitURL'];
                const blobURL: string = URL.createObjectURL(blob);

                this.worker = new Worker(blobURL);
                URL.revokeObjectURL(blobURL);
            }
            else {
                setTimeout(function() { callback(e); }, 0);
                return;
            }
        }

        // Add an EventListener for data the worker returns, before we post the "wake-up" message.
        // Notice the bind.
        this.worker.onmessage = this.onMessage;

        // We want the worker thread to call the callback function when it has completed initialization.
        // That will mean that it is safe to start posting more messages to the thread.
        const callbackId = this.callbackManager.captureCallback(callback);

        // Sending a postMessage starts the worker.
        this.worker.postMessage({ init: true, scriptImports, moduleName, className, callbackId });
    }

    /**
     * This method is is used as the callback function for the Worker thread
     * and so it receives all messages posted back from that thread.
     *
     * @method onMessage
     * @param event {MessageEvent}
     * @return {void}
     * @private
     */
    private onMessage(event: MessageEvent): void {
        const origin: string = event.origin;
        const source: Window = event.source;
        const msg = event.data;
        switch (msg.type) {
            case "info":
                window.console && console.log && console.info.apply(console, msg.data);
                break;
            case "log":
                window.console && console.log && console.log.apply(console, msg.data);
                break;
            case "warn":
                window.console && console.log && console.warn.apply(console, msg.data);
                break;
            case "error":
                window.console && console.log && console.error.apply(console, msg.data);
                break;
            case "event":
                switch (msg.name) {
                    case 'init': {
                        const callback = this.callbackManager.releaseCallback(msg.data.callbackId);
                        if (callback) {
                            callback(msg.data.err);
                        }
                        break;
                    }
                    default: {
                        // Will anyone care that we cast away?
                        this.eventBus._signal(msg.name, <MessageEvent>{ data: msg.data });
                    }
                }
                break;
            case "call":
                const callback = this.callbackManager.releaseCallback[msg.id];
                if (callback) {
                    callback(msg.data);
                }
                break;
        }
    }

    /**
     * @method $normalizePath
     * @param path {string}
     * @return {string}
     * @private
     */
    private $normalizePath(path: string): string {
        return qualifyURL(path);
    }

    /**
     * Calls the terminate method of the underlying Worker and sets the worker propert to undefined.
     */
    terminate(): void {
        // One a Web Worker has been terminated, there is no way to restart it.
        // We also don't get any notification that it has shut down.
        if (this.worker) {
            /**
             * @event terminate
             */
            this.eventBus._signal("terminate", <MessageEvent>{});
            this.deltaQueue = void 0;

            this.worker.terminate();
            this.worker = void 0;
        }
    }

    /**
     * Posts a message to the worker thread with a specific command data structure.
     *
     * @method send
     * @param command {string}
     * @param args {any}
     * @return {void}
     */
    send(command: string, args: any): void {
        if (this.worker) {
            this.worker.postMessage({ command, args });
        }
    }

    /**
     * This is a wrapper around the the asynchronous post to the worker thread
     * that allows us to provide a callback function for an anticipated post
     * response.
     *
     * @method call
     * @param cmd {string}
     * @param args {any}
     * @param callback {(data: any) => any}
     * @return {void}
     */
    call(cmd: string, args: any, callback: (data: any) => any): void {
        if (callback) {
            const callbackId = this.callbackManager.captureCallback(callback);
            args.push(callbackId);
        }
        this.send(cmd, args);
    }

    /**
     * Posts a message to the worker thread with a specific event data structure.
     *
     * @method emit
     * @param event {string} The name of the event.
     * @param data
     * @return {void}
     */
    emit(event: string, data: { data: any }): void {
        try {
            // firefox refuses to clone objects which have function properties
            if (this.worker) {
                // FIXME: Simplify.
                this.worker.postMessage({ event: event, data: { data: data.data } });
            }
        }
        catch (e) {
            console.error(e.stack);
        }
    }

    /**
     * @method attachToDocument
     * @param doc {Document}
     * @return {void}
     */
    public attachToDocument(doc: Document): void {
        if (this.$doc) {
            if (this.$doc === doc) {
                return;
            }
            else {
                this.detachFromDocument();
            }
        }
        this.$doc = doc;
        this.call("setValue", [doc.getValue()], function(data: any) {
            console.log(`setValue => ${data}`)
        });
        doc.addChangeListener(this.changeListener);
    }

    /**
     * @method detachFromDocument
     * @return {void}
     */
    public detachFromDocument(): void {
        if (this.$doc) {
            this.$doc.removeChangeListener(this.changeListener);
            this.$doc = null;
        }
    }

    /**
     * This method is used to handle 'change' events in the document.
     * When the document changes (reported as a Delta), the delta is added to
     * the deltaQueue member of this WorkerClient. As is good practice, the
     * change is not acted upon immediately.
     *
     * This method is replaced in the constructor by a function that is bound to `this`.
     *
     * @method changeListener
     * @param delta {Delta}
     * @param doc {Document}
     * @return {void}
     * @private
     */
    private changeListener(delta: Delta, doc: Document): void {
        if (!this.deltaQueue) {
            this.deltaQueue = [delta];
            setTimeout(this.sendDeltaQueue, 0);
        }
        else {
            this.deltaQueue.push(delta);
        }
    }

    /**
     * This method provides the implementation of the EventBus interface.
     *
     * @method on
     * @param eventName {string}
     * @param callback {(event: MessageEvent, source: WorkerClient) => any}
     * @return {void}
     */
    on(eventName: string, callback: (event: MessageEvent, source: WorkerClient) => any): void {
        this.eventBus.on(eventName, callback, false);
    }

    /**
     * This method provides the implementation of the EventBus interface.
     *
     * @method off
     * @param eventName {string}
     * @param callback {(event: MessageEvent, source: WorkerClient) => any}
     * @return {void}
     */
    off(eventName: string, callback: (event: MessageEvent, source: WorkerClient) => any): void {
        this.eventBus.off(eventName, callback);
    }

    /**
     * This method is intended to be used as a callback for setTimeout.
     * It is replaced by a version that is bound to `this`.
     * 
     * @method sendDeltaQueue
     * @return {void}
     * @private
     */
    private sendDeltaQueue(): void {
        const doc = this.$doc;
        const queue = this.deltaQueue;
        if (!queue) return;
        this.deltaQueue = void 0;

        // We're going to post all the changes in one message, but we apply a
        // heuristic to just send the actual document if there are enough changes.
        if (queue.length > 20 && queue.length > doc.getLength() >> 1) {
            // TODO: If there is no callback then call is the same as send,
            // which is a postCommand.
            this.call("setValue", [doc.getValue()], function(data: any) {
                console.log(`setValue => ${data}`)
            });
        }
        else {
            // TODO: This method should probably be called 'changes', since the
            // data was accumulated from one or more change events.
            // TODO: emit cound be renamed postEvent, which is more descriptive.
            this.emit("change", { data: queue });
        }
    }

    /**
     * @method createBlob
     * @param workerUrl {string}
     * @return {Blob}
     * @private
     */
    private createBlob(workerUrl: string): Blob {
        // workerUrl can be protocol relative
        // importScripts only takes fully qualified urls
        const script = "importScripts('" + qualifyURL(workerUrl) + "');";
        try {
            return new Blob([script], { "type": "application/javascript" });
        }
        catch (e) { // Backwards-compatibility
            const BlobBuilder = window['BlobBuilder'] || window['WebKitBlobBuilder'] || window['MozBlobBuilder'];
            const blobBuilder = new BlobBuilder();
            blobBuilder.append(script);
            return blobBuilder.getBlob("application/javascript");
        }
    }
}
