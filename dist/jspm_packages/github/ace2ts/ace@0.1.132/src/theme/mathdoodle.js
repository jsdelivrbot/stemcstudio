System.register(["../lib/dom"], function(exports_1) {
    var dom;
    var isDark, cssClass, cssText;
    return {
        setters:[
            function (dom_1) {
                dom = dom_1;
            }],
        execute: function() {
            exports_1("isDark", isDark = true);
            exports_1("cssClass", cssClass = "ace-mathdoodle");
            exports_1("cssText", cssText = require("../requirejs/text!./mathdoodle.css"));
            dom.ensureHTMLStyleElement(cssText, cssClass);
        }
    }
});
