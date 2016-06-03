"use strict";
(function (scope) {
    scope.console = {};
    scope.console.log = function () {
        var data = Array.prototype.slice.call(arguments, 0);
        scope.postMessage({ type: "log", data: data });
    };
    scope.console.warn = function () {
        var data = Array.prototype.slice.call(arguments, 0);
        scope.postMessage({ type: "warn", data: data });
    };
    scope.onerror = function (event) {
        console.warn("Worker " + event);
    };
    var main = null;
    var sender = null;
    scope.onmessage = function (event) {
        var data = event.data;
        var msg = data;
        var origin = event.origin;
        var source = event.source;
        if (msg.command) {
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
            console.log("Importing scripts into worker thread: " + msg.scriptImports + ".");
            if (msg.scriptImports) {
                for (var i = 0; i < msg.scriptImports.length; i++) {
                    var scriptImport = msg.scriptImports[i];
                    importScripts(scriptImport);
                }
            }
            if (scope['System']) {
                console.log("Importing module '" + msg.moduleName + "' using System.");
                System.import(msg.moduleName).then(function (m) {
                    console.log("Creating new Sender...");
                    sender = new m.default.Sender(scope);
                    console.log("Creating new " + msg.className + "...");
                    main = new m.default[msg.className](sender);
                    console.log("Emitting 'init' message to sender.");
                    sender.emit('init', { callbackId: msg.callbackId });
                }).catch(function (err) {
                    console.warn("init. Cause: " + err);
                    sender.emit('init', { err: "" + err, callbackId: msg.callbackId });
                });
            }
            else {
                console.warn("worker could not be initialized because System property is not defined on scope.");
                scope.postMessage({ type: "initFailed", data: "System is not defined" });
            }
        }
        else if (msg.event && sender) {
            sender._signal(msg.event, msg.data);
        }
        else {
            console.warn("dropped msg in worker.ts, keys(msg) => " + Object.keys(msg) + " typeof sender => '" + typeof sender + "'.");
        }
    };
})(this);
