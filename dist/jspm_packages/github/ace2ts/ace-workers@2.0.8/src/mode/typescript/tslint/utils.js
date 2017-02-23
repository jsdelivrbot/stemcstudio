System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function arrayify(arg) {
        if (Array.isArray(arg)) {
            return arg;
        }
        else if (arg != null) {
            return [arg];
        }
        else {
            return [];
        }
    }
    exports_1("arrayify", arrayify);
    function objectify(arg) {
        if (typeof arg === "object" && arg != null) {
            return arg;
        }
        else {
            return {};
        }
    }
    exports_1("objectify", objectify);
    function camelize(stringWithHyphens) {
        return stringWithHyphens.replace(/-(.)/g, function (_, nextLetter) { return nextLetter.toUpperCase(); });
    }
    exports_1("camelize", camelize);
    function dedent(strings) {
        var values = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            values[_i - 1] = arguments[_i];
        }
        var fullString = strings.reduce(function (accumulator, str, i) {
            return accumulator + values[i - 1] + str;
        });
        var match = fullString.match(/^[ \t]*(?=\S)/gm);
        if (!match) {
            return fullString;
        }
        var indent = Math.min.apply(Math, match.map(function (el) { return el.length; }));
        var regexp = new RegExp("^[ \\t]{" + indent + "}", "gm");
        fullString = indent > 0 ? fullString.replace(regexp, "") : fullString;
        return fullString;
    }
    exports_1("dedent", dedent);
    function stripComments(content) {
        var regexp = /("(?:[^\\\"]*(?:\\.)?)*")|('(?:[^\\\']*(?:\\.)?)*')|(\/\*(?:\r?\n|.)*?\*\/)|(\/{2,}.*?(?:(?:\r?\n)|$))/g;
        var result = content.replace(regexp, function (match, _m1, _m2, m3, m4) {
            if (m3) {
                return "";
            }
            else if (m4) {
                var length = m4.length;
                if (length > 2 && m4[length - 1] === "\n") {
                    return m4[length - 2] === "\r" ? "\r\n" : "\n";
                }
                else {
                    return "";
                }
            }
            else {
                return match;
            }
        });
        return result;
    }
    exports_1("stripComments", stripComments);
    function escapeRegExp(re) {
        return re.replace(/[.+*?|^$[\]{}()\\]/g, "\\$&");
    }
    exports_1("escapeRegExp", escapeRegExp);
    function arraysAreEqual(a, b, eq) {
        return a === b || !!a && !!b && a.length === b.length && a.every(function (x, idx) { return eq(x, b[idx]); });
    }
    exports_1("arraysAreEqual", arraysAreEqual);
    return {
        setters: [],
        execute: function () {
            ;
        }
    };
});
