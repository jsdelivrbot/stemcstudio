//
// It is best for this code to be compiled in an environment
// where DedicatedWorkerGlobalScope is defined and Window is not defined.
//
"use strict";
(function (scope: DedicatedWorkerGlobalScope) {

    (<any>scope).console = {};
    (<any>scope).console.log = function () {
        const data = Array.prototype.slice.call(arguments, 0);
        scope.postMessage({ type: "log", data });
    };
    (<any>scope).console.warn = function () {
        const data = Array.prototype.slice.call(arguments, 0);
        scope.postMessage({ type: "warn", data });
    };

    scope.onerror = function (event: Event) {
        console.warn("Worker " + event);
    };

    var main = null;
    var sender = null;

    scope.onmessage = function (event: MessageEvent) {
        const data: any = event.data;
        const msg: {
            command?: string;
            args?: any;
            init?: any;
            scriptImports?: string[];
            moduleName?: string;
            className?: string;
            callbackId?: number;
            event?: string;
            data?: any;
        } = data;
        if (msg.command) {
            // Commands corresponds things like setting the value of the mirror document
            if (main) {
                if (main[msg.command]) {
                    main[msg.command].apply(main, msg.args);
                }
                else {
                    throw new Error("Unknown command:" + msg.command + "(" + JSON.stringify(msg.args) + ")");
                }
            }
            else {
                console.warn("Not initialized. Unable to process command " + msg.command + "(" + JSON.stringify(msg.args) + ")");
            }
        }
        else if (msg.init) {
            if (msg.scriptImports) {
                for (let i = 0; i < msg.scriptImports.length; i++) {
                    const scriptImport = msg.scriptImports[i];
                    importScripts(scriptImport);
                }
            }
            if (scope['System']) {
                System.import(msg.moduleName)
                    .then(function (m: ImportedModule) {
                        sender = new m.default.Sender(scope);
                        try {
                            main = new m.default[msg.className](sender);
                            sender.emit('init', { callbackId: msg.callbackId });
                        }
                        catch (e) {
                            sender.emit('init', { err: "" + e, callbackId: msg.callbackId });
                        }
                    })
                    .catch(function (reason) {
                        console.warn("Sender could not be constructed.");
                        scope.postMessage({ type: "initFailed", data: "Sender could not be constructed" });
                    });
            }
            else {
                console.warn("worker could not be initialized because System property is not defined on scope.");
                scope.postMessage({ type: "initFailed", data: "System is not defined" });
            }
        }
        else if (msg.event && sender) {
            // Events correspond to changes in the document due to user interaction.
            // These changes are relayed to the worker.
            sender._signal(msg.event, msg.data);
        }
        else {
            console.warn(`dropped msg in worker.ts, keys(msg) => ${Object.keys(msg)} typeof sender => '${typeof sender}'.`);
            // console.warn(`dropped(${JSON.stringify(msg)})`);
        }
    };
})(this);
