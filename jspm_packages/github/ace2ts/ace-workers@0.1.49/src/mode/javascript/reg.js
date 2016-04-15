System.register([], function(exports_1) {
    "use strict";
    var unsafeString, unsafeChars, needEsc, needEscGlobal, starSlash, identifierRegExp, javascriptURL, fallsThrough, maxlenException;
    return {
        setters:[],
        execute: function() {
            exports_1("unsafeString", unsafeString = /@cc|<\/?|script|\]\s*\]|<\s*!|&lt/i);
            exports_1("unsafeChars", unsafeChars = /[\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/);
            exports_1("needEsc", needEsc = /[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/);
            exports_1("needEscGlobal", needEscGlobal = /[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g);
            exports_1("starSlash", starSlash = /\*\//);
            exports_1("identifierRegExp", identifierRegExp = /^([a-zA-Z_$][a-zA-Z0-9_$]*)$/);
            exports_1("javascriptURL", javascriptURL = /^(?:javascript|jscript|ecmascript|vbscript|livescript)\s*:/i);
            exports_1("fallsThrough", fallsThrough = /^\s*falls?\sthrough\s*$/);
            exports_1("maxlenException", maxlenException = /^(?:(?:\/\/|\/\*|\*) ?)?[^ ]+$/);
        }
    }
});
