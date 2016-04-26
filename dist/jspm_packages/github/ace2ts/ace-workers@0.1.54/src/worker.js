"use strict";
(function (scope) {
    var consoleLog = function (msg) {
        scope.postMessage({ type: "log", data: msg });
    };
    scope.onerror = function (event) {
        consoleLog("Worker " + event);
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
                consoleLog("Not initialized. Unable to process command " + msg.command + "(" + JSON.stringify(msg.args) + ")");
            }
        }
        else if (msg.init) {
            if (msg.scriptImports) {
                for (var i = 0; i < msg.scriptImports.length; i++) {
                    var scriptImport = msg.scriptImports[i];
                    importScripts(scriptImport);
                }
            }
            if (scope['System']) {
                System.import(msg.moduleName)
                    .then(function (m) {
                    sender = new m.default.Sender(scope);
                    main = new m.default[msg.className](sender);
                    sender.emit('initAfter');
                })
                    .catch(function (err) {
                    consoleLog("initFailed. Cause: " + err);
                    sender.emit('initFailed', "" + err);
                });
            }
            else {
                consoleLog("System config failed.");
                scope.postMessage({ type: "initFailed", data: "System is not defined" });
            }
        }
        else if (msg.event && sender) {
            sender._signal(msg.event, msg.data);
        }
        else {
            consoleLog("dropped(" + JSON.stringify(msg) + ")");
        }
    };
})(this);
