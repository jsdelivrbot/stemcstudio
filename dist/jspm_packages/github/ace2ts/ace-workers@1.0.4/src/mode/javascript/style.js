System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function register(linter) {
        linter.on("Identifier", function style_scanProto(data) {
            if (linter.getOption("proto")) {
                return;
            }
            if (data.name === "__proto__") {
                linter.warn("W103", {
                    line: data.line,
                    char: data.char,
                    data: [data.name, "6"]
                });
            }
        });
        linter.on("Identifier", function style_scanIterator(data) {
            if (linter.getOption("iterator")) {
                return;
            }
            if (data.name === "__iterator__") {
                linter.warn("W103", {
                    line: data.line,
                    char: data.char,
                    data: [data.name]
                });
            }
        });
        linter.on("Identifier", function style_scanCamelCase(data) {
            if (!linter.getOption("camelcase")) {
                return;
            }
            if (data.name.replace(/^_+|_+$/g, "").indexOf("_") > -1 && !data.name.match(/^[A-Z0-9_]*$/)) {
                linter.warn("W106", {
                    line: data.line,
                    char: data.from,
                    data: [data.name]
                });
            }
        });
        linter.on("String", function style_scanQuotes(data) {
            var quotmark = linter.getOption("quotmark");
            var code;
            if (!quotmark) {
                return;
            }
            if (quotmark === "single" && data.quote !== "'") {
                code = "W109";
            }
            if (quotmark === "double" && data.quote !== "\"") {
                code = "W108";
            }
            if (quotmark === true) {
                if (!linter.getCache("quotmark")) {
                    linter.setCache("quotmark", data.quote);
                }
                if (linter.getCache("quotmark") !== data.quote) {
                    code = "W110";
                }
            }
            if (code) {
                linter.warn(code, {
                    line: data.line,
                    char: data.char,
                });
            }
        });
        linter.on("Number", function style_scanNumbers(data) {
            if (data.value.charAt(0) === ".") {
                linter.warn("W008", {
                    line: data.line,
                    char: data.char,
                    data: [data.value]
                });
            }
            if (data.value.substr(data.value.length - 1) === ".") {
                linter.warn("W047", {
                    line: data.line,
                    char: data.char,
                    data: [data.value]
                });
            }
            if (/^00+/.test(data.value)) {
                linter.warn("W046", {
                    line: data.line,
                    char: data.char,
                    data: [data.value]
                });
            }
        });
        linter.on("String", function style_scanJavaScriptURLs(data) {
            var re = /^(?:javascript|jscript|ecmascript|vbscript|livescript)\s*:/i;
            if (linter.getOption("scripturl")) {
                return;
            }
            if (re.test(data.value)) {
                linter.warn("W107", {
                    line: data.line,
                    char: data.char
                });
            }
        });
    }
    exports_1("register", register);
    return {
        setters:[],
        execute: function() {
            ;
        }
    }
});
