System.register(["./src/workers/LanguageServiceWorker", "./src/lib/Sender"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var LanguageServiceWorker_1, Sender_1, main;
    return {
        setters: [
            function (LanguageServiceWorker_1_1) {
                LanguageServiceWorker_1 = LanguageServiceWorker_1_1;
            },
            function (Sender_1_1) {
                Sender_1 = Sender_1_1;
            }
        ],
        execute: function () {
            main = {
                get LanguageServiceWorker() { return LanguageServiceWorker_1.LanguageServiceWorker; },
                get Sender() { return Sender_1.Sender; }
            };
            exports_1("default", main);
        }
    };
});
