System.register(["../error"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function errorComparator(err1, err2) {
        if (err1.startPos.line !== err2.startPos.line) {
            return err1.startPos.line - err2.startPos.line;
        }
        else if (err1.startPos.col !== err2.startPos.col) {
            return err1.startPos.col - err2.startPos.col;
        }
        else if (err1.endPos.line !== err2.endPos.line) {
            return err1.endPos.line - err2.endPos.line;
        }
        else if (err1.endPos.col !== err2.endPos.col) {
            return err1.endPos.col - err2.endPos.col;
        }
        else {
            return err1.message.localeCompare(err2.message);
        }
    }
    exports_1("errorComparator", errorComparator);
    function lintSyntaxError(message) {
        return new error_1.Error("Lint File Syntax Error: " + message);
    }
    exports_1("lintSyntaxError", lintSyntaxError);
    var error_1;
    return {
        setters: [
            function (error_1_1) {
                error_1 = error_1_1;
            }
        ],
        execute: function () {
        }
    };
});
