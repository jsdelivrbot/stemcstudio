System.register(["./jsonFormatter", "./pmdFormatter", "./proseFormatter", "./verboseFormatter", "./fileslistFormatter"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (jsonFormatter_1_1) {
                exports_1({
                    "JsonFormatter": jsonFormatter_1_1["Formatter"]
                });
            },
            function (pmdFormatter_1_1) {
                exports_1({
                    "PmdFormatter": pmdFormatter_1_1["Formatter"]
                });
            },
            function (proseFormatter_1_1) {
                exports_1({
                    "ProseFormatter": proseFormatter_1_1["Formatter"]
                });
            },
            function (verboseFormatter_1_1) {
                exports_1({
                    "VerboseFormatter": verboseFormatter_1_1["Formatter"]
                });
            },
            function (fileslistFormatter_1_1) {
                exports_1({
                    "FileslistFormatter": fileslistFormatter_1_1["Formatter"]
                });
            }
        ],
        execute: function () {
        }
    };
});
