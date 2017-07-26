System.register(["./src/workers/TypeScriptWorker", "./src/lib/Sender"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var TypeScriptWorker_1, Sender_1, main;
    return {
        setters: [
            function (TypeScriptWorker_1_1) {
                TypeScriptWorker_1 = TypeScriptWorker_1_1;
            },
            function (Sender_1_1) {
                Sender_1 = Sender_1_1;
            }
        ],
        execute: function () {
            main = {
                get TypeScriptWorker() { return TypeScriptWorker_1.TypeScriptWorker; },
                get Sender() { return Sender_1.Sender; }
            };
            exports_1("default", main);
        }
    };
});
