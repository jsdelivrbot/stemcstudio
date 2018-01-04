import { qualifyURL } from '../lib/net';
import { Delta } from "editor-document";
import { EventBus } from "../EventBus";
import { EventEmitterClass } from '../lib/EventEmitterClass';
import { CallbackManager } from './CallbackManager';
import { Disposable } from '../../editor/Disposable';
import { EditSession } from "../../editor/EditSession";

/**
 * Protocol for the initialization message.
 * Using an interface ensures that we don't accidently pass the wrong data structure.
 * This interface is only used in this module.
 */
interface InitRequestMessage {
    init: boolean;
    scriptImports: string[];
    moduleName: string;
    className: string;
    callbackId: number;
}

/**
 * <p>
 * WorkerClient controls the interaction between an editor session
 * and a Web Worker.
 * </p>
 * It provides additional capabilities by being a wrapper around
 * an underlying Web Worker:
 * <ul>
 * <li>
 * It is a controller between the editor
 * <code>EditSession</code> and the <code>Worker</code> thread.
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
 */
export class WorkerClient implements EventBus<string, MessageEvent, WorkerClient>, Disposable {

    /**
     * The underlying Web Worker.
     */
    private worker: Worker | undefined;

    /**
     * Changes in the Document are queued here so that they can
     * later be posted to the worker thread.
     */
    private deltaQueue: Delta[] | undefined;

    private callbackManager = new CallbackManager();

    /**
     * 
     */
    private $session: EditSession | null;

    /**
     *
     */
    private eventBus: EventEmitterClass<string, MessageEvent, WorkerClient>;

    /**
     *
     */
    constructor(private workerUrl: string) {
        this.eventBus = new EventEmitterClass<string, MessageEvent, WorkerClient>(this);
        this.sendDeltaQueue = this.sendDeltaQueue.bind(this);
        this.changeListener = this.changeListener.bind(this);
        this.onMessage = this.onMessage.bind(this);
    }

    /**
     * Posts a message to the worker thread causing the thread to be started.
     * TODO: Promisify this method.
     */
    init(scriptImports: string[], moduleName: string, className: string, callback: (err: any) => any): void {

        if (this.worker) {
            console.warn("The worker is already initialized");
            window.setTimeout(callback, 0);
            return;
        }

        // importScrupts only takes fully qualified URLs.
        const workerUrl = qualifyURL(this.workerUrl);
        try {
            // The worker thread will not be started until we post a message to it (below).
            this.worker = new Worker(workerUrl);
        }
        catch (e) {
            if (e instanceof window['DOMException']) {
                // Likely same origin problem. Use importScripts from a shim Worker.
                const blob: Blob = this.createBlob(workerUrl);
                const URL = window.URL || window['webkitURL'];
                const blobURL: string = URL.createObjectURL(blob);

                this.worker = new Worker(blobURL);
                URL.revokeObjectURL(blobURL);
            }
            else {
                window.setTimeout(function () { callback(e); }, 0);
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
        // 
        const initMessage: InitRequestMessage = { init: true, scriptImports, moduleName, className, callbackId };
        this.worker.postMessage(initMessage);
    }

    /**
     * This method is is used as the callback function for the Worker thread
     * and so it receives all messages posted back from that thread.
     */
    private onMessage(/* this: WorkerClient, */ event: MessageEvent): void {
        // const origin: string = event.origin;
        // const source: Window = event.source;
        const msg = event.data;
        switch (msg.type) {
            case "info":
                if (window.console && console.info) {
                    console.info.apply(console, msg.data);
                }
                break;
            case "log":
                if (window.console && console.log) {
                    console.log.apply(console, msg.data);
                }
                break;
            case "warn":
                if (window.console && console.warn) {
                    console.warn.apply(console, msg.data);
                }
                break;
            case "error":
                if (window.console && console.error) {
                    console.error.apply(console, msg.data);
                }
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
     * Calls the terminate method of the underlying Worker and sets the worker property to undefined.
     */
    dispose(): void {
        // Once a Web Worker has been terminated, there is no way to restart it.
        // We also don't get any notification that it has shut down.
        if (this.worker) {
            this.eventBus._signal("terminate", <MessageEvent>{});
            this.deltaQueue = void 0;

            this.worker.terminate();
            this.worker = void 0;
        }
    }

    /**
     * Posts a message to the worker thread with a specific command data structure.
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
     */
    emit(event: string, data: { data: any }): void {
        try {
            // firefox refuses to clone objects which have function properties
            if (this.worker) {
                // FIXME: Simplify.
                this.worker.postMessage({ event, data: { data: data.data } });
            }
        }
        catch (e) {
            console.error(e.stack);
        }
    }

    /**
     * Attaching to the document adds a listener for change deltas.
     * This method calls addRef on the document.
     */
    public attachToSession(session: EditSession): void {

        if (this.$session === session) {
            return;
        }

        if (this.$session) {
            this.detachFromSession();
        }

        if (session) {
            this.$session = session;
            this.$session.addRef();
            this.call("setValue", [session.getValue()], function () {
                // Do nothing.
            });
            session.addChangeListener(this.changeListener);
        }
        else {
            throw new Error("doc must be defined.");
        }
    }

    /**
     * Detaching from the document removes the listener for change deltas.
     * This method calls release on the document.
     */
    public detachFromSession(): void {
        if (this.$session) {
            this.$session.removeChangeListener(this.changeListener);
            this.$session.release();
            this.$session = null;
        }
    }

    /**
     * This method is used to handle 'change' events in the document.
     * When the document changes (reported as a Delta), the delta is added to
     * the deltaQueue member of this WorkerClient. As is good practice, the
     * change is not acted upon immediately.
     *
     * This method is replaced in the constructor by a function that is bound to `this`.
     */
    private changeListener(delta: Delta/*, doc: Document*/): void {
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
     */
    on(eventName: string, callback: (event: MessageEvent, source: WorkerClient) => any) {
        this.eventBus.on(eventName, callback, false);
        return () => {
            this.eventBus.off(eventName, callback, false);
        };
    }

    /**
     * This method provides the implementation of the EventBus interface.
     */
    off(eventName: string, callback: (event: MessageEvent, source: WorkerClient) => any): void {
        this.eventBus.off(eventName, callback);
    }

    /**
     * This method is intended to be used as a callback for setTimeout.
     * It is replaced by a version that is bound to `this`.
     */
    private sendDeltaQueue(): void {
        const session = this.$session;
        if (session) {
            const queue = this.deltaQueue;
            if (!queue) return;
            this.deltaQueue = void 0;

            // We're going to post all the changes in one message, but we apply a
            // heuristic to just send the actual document if there are enough changes.
            if (queue.length > 20 && queue.length > session.getLength() >> 1) {
                // TODO: If there is no callback then call is the same as send,
                // which is a postCommand.
                this.call("setValue", [session.getValue()], function () {
                    // Do nothing.
                });
            }
            else {
                // TODO: This method should probably be called 'changes', since the
                // data was accumulated from one or more change events.
                // TODO: emit cound be renamed postEvent, which is more descriptive.
                this.emit("change", { data: queue });
            }
        }
    }

    /**
     *
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
