"use strict";

import {qualifyURL} from '../lib/net';
import Delta from "../Delta";
import Document from "../Document";
import EventBus from "../EventBus";
import EventEmitterClass from '../lib/EventEmitterClass';
import {get} from "../config";

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
export default class WorkerClient implements EventBus<WorkerClient> {

    /**
     * The underlying Web Worker.
     * @property $worker
     * @type Worker
     * @private
     */
    private $worker: Worker;

    /**
     * Changes in the Document are queued here so that they can
     * later be posted to the worker thread.
     *
     * @property deltaQueue
     * @type Delta[]
     * @private
     */
    private deltaQueue: Delta[];

    // The following implementation provides a generic approach
    // for making asynchronous request/response calls.
    // TODO: Make this reusable?
    // TODO: Provide a Promise-like capability?
    private callbacks: { [id: number]: (data: any) => any } = {};
    private callbackId: number = 1;

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
    private eventBus: EventEmitterClass<WorkerClient>;

    /**
     * @class WorkerClient
     * @constructor
     * @param workerUrl {string}
     */
    constructor(workerUrl: string) {
        this.eventBus = new EventEmitterClass<WorkerClient>(this);
        this.sendDeltaQueue = this.sendDeltaQueue.bind(this);
        this.changeListener = this.changeListener.bind(this);
        this.onMessage = this.onMessage.bind(this);

        var workerUrl = qualifyURL(workerUrl);

        try {
            this.$worker = new Worker(workerUrl);
        }
        catch (e) {
            if (e instanceof window['DOMException']) {
                // Likely same origin problem. Use importScripts from a shim Worker.
                var blob: Blob = this.$workerBlob(workerUrl);
                var URL: URL = window['URL'] || window['webkitURL'];
                var blobURL: string = URL.createObjectURL(blob);

                this.$worker = new Worker(blobURL);
                URL.revokeObjectURL(blobURL);
            }
            else {
                throw e;
            }
        }

        // Add an EventListener for data the worker returns.
        this.$worker.onmessage = this.onMessage;
    }

    /**
     * Posts a message to the worker thread causing the thread to be started.
     *
     * @method init
     * @param scriptImports {string[]}
     * @param moduleName {string}
     * @param className {string}
     * @return {void}
     */
    init(scriptImports: string[], moduleName: string, className: string): void {
        // Sending a postMessage starts the worker.
        this.$worker.postMessage({
            init: true,
            scriptImports: scriptImports,
            moduleName: moduleName,
            className: className
        });
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
        var origin: string = event.origin;
        var source: Window = event.source;
        var msg = event.data;
        // TODO: Interfaces for data exchanged.
        switch (msg.type) {

            case "log":
                window.console && console.log && console.log.apply(console, msg.data);
                break;

            case "event":
                // TODO: Enumerate the event names for documentation purposes.
                // Some will be standard becuase they are associated with the
                // WorkerClient protocol. Others will be undocumented and custom
                // because they are specific to the particular implementation.
                /**
                 * @event TODO
                 */
                this.eventBus._signal(msg.name, { data: msg.data });
                break;

            case "call":
                var callback = this.callbacks[msg.id];
                if (callback) {
                    callback(msg.data);
                    delete this.callbacks[msg.id];
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
     * @method terminate
     * @return {void}
     */
    terminate(): void {
        /**
         * @event terminate
         */
        this.eventBus._signal("terminate", {});
        this.deltaQueue = void 0;
        this.$worker.terminate();
        this.$worker = void 0;
    }

    /**
     * Posts a message to the worker thread with a specific command data structure.
     *
     * @method send
     * @param cmd {string}
     * @param args {any}
     * @return {void}
     */
    // FIXME: Rename this postCommand in order to be more obvious that
    // we are acting as a conduit to the worker thread.
    // FIXME: Capture the structure using a d.ts file.
    send(cmd: string, args: any): void {
        this.$worker.postMessage({ command: cmd, args: args });
    }

    /**
     * This is a wrapper around the the asynchronous post to the worker thread
     * that allows us to provide a callback function for an anticipated post
     * response.
     *
     * @method call
     * @param cmd {string}
     * @param args {any}
     * @param callback
     * @return {void}
     */
    // TODO: Provide a Promise-based version of this method and see if it makes the code
    // more maintainable.
    call(cmd: string, args: any, callback?: (data: any) => any): void {
        if (callback) {
            var id = this.callbackId++;
            this.callbacks[id] = callback;
            args.push(id);
        }
        this.send(cmd, args);
    }

    /**
     * W.I.P. experiment at using promises for the API.
     * This highlights the need for a protocol between
     * the Worker thread implementation and this WorkerClient.
     * TODO: Complete.
     * TODO: Can we get type-safety in the Promise?
     * We might need an argument of type T to make this happen.
     *
     * @method invoke
     * @param cmd
     * @param args
     * @return {Promise}
     * @private
     */
    private invoke<T>(cmd: string, args): Promise<T> {
        var workerClient = this;
        return new Promise<any>(function(resolve, reject) {
            workerClient.call(cmd, args, function(retval: { err: any; data: T }) {
                // It's clear now that the callback function or data
                // should provide some means to distinguish between
                // an error and a normal execution. This would require
                // a protocal between the the WorkerClient and the
                // implementation of the Worker thread.
                if (retval.err) {
                    reject(retval.err);
                }
                else {
                    resolve(retval.data);
                }
            })
        });
    }

    /**
     * Posts a message to the worker thread with a specific event data structure.
     *
     * @method emit
     * @param event {string} The name of the event.
     * @param data
     * @return {void}
     */
    // FIXME
    emit(event: string, data: { data: any }): void {
        try {
            // firefox refuses to clone objects which have function properties
            if (this.$worker) {
                // FIXME: Simplify.
                this.$worker.postMessage({ event: event, data: { data: data.data } });
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
        this.call("setValue", [doc.getValue()]);
        doc.addChangeListener(this.changeListener);
    }

    /**
     * @method detachFromDocument
     * @return {void}
     * @private
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
     * chane is not acted upon immediately.
     *
     * This method is replaced in the constructor by a function that is bound to `this`.
     *
     * @method changeListener
     * @param delta {Delta}
     * @param doc {Document}
     * @return {void}
     * @private
     */
    // TODO: It would be better if this was away from the WorkerClient API.
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
     * @method on
     * @param eventName {string}
     * @param callback {(event: MessageEvent, source: WorkerClient) => any}
     * @return {void}
     */
    on(eventName: string, callback: (event: MessageEvent, source: WorkerClient) => any): void {
        this.eventBus.on(eventName, callback, false);
    }

    /**
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
        var doc = this.$doc;
        var queue = this.deltaQueue;
        if (!queue) return;
        this.deltaQueue = void 0;

        // We're going to post all the changes in one message, but we apply a
        // heuristic to just send the actual document if there are enough changes.
        if (queue.length > 20 && queue.length > doc.getLength() >> 1) {
            // TODO: If there is no callback then call is the same as send,
            // which is a postCommand.
            this.call("setValue", [doc.getValue()]);
        }
        else {
            // TODO: This method should probably be called 'changes', since the
            // data was accumulated from one or more change events.
            // TODO: emot cound be renamed postEvent, which is more descriptive.
            this.emit("change", { data: queue });
        }
    }

    /**
     * @method $workerBlob
     * @param workerUrl {string}
     * @return {Blob}
     * @private
     */
    private $workerBlob(workerUrl: string): Blob {
        // workerUrl can be protocol relative
        // importScripts only takes fully qualified urls
        var script = "importScripts('" + qualifyURL(workerUrl) + "');";
        try {
            return new Blob([script], { "type": "application/javascript" });
        }
        catch (e) { // Backwards-compatibility
            var BlobBuilder = window['BlobBuilder'] || window['WebKitBlobBuilder'] || window['MozBlobBuilder'];
            var blobBuilder = new BlobBuilder();
            blobBuilder.append(script);
            return blobBuilder.getBlob("application/javascript");
        }
    }
}

/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */
