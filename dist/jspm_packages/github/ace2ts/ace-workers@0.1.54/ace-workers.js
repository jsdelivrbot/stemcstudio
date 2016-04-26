"use strict";
System.register(["./src/mode/ExampleWorker", "./src/mode/HtmlWorker", "./src/mode/JavaScriptWorker", "./src/mode/TypeScriptWorker", "./src/mode/LanguageServiceWorker", "./src/lib/Sender"], function(exports_1) {
    var ExampleWorker_1, HtmlWorker_1, JavaScriptWorker_1, TypeScriptWorker_1, LanguageServiceWorker_1, Sender_1;
    var main;
    return {
        setters:[
            function (ExampleWorker_1_1) {
                ExampleWorker_1 = ExampleWorker_1_1;
            },
            function (HtmlWorker_1_1) {
                HtmlWorker_1 = HtmlWorker_1_1;
            },
            function (JavaScriptWorker_1_1) {
                JavaScriptWorker_1 = JavaScriptWorker_1_1;
            },
            function (TypeScriptWorker_1_1) {
                TypeScriptWorker_1 = TypeScriptWorker_1_1;
            },
            function (LanguageServiceWorker_1_1) {
                LanguageServiceWorker_1 = LanguageServiceWorker_1_1;
            },
            function (Sender_1_1) {
                Sender_1 = Sender_1_1;
            }],
        execute: function() {
            main = {
                get ExampleWorker() { return ExampleWorker_1.default; },
                get HtmlWorker() { return HtmlWorker_1.default; },
                get JavaScriptWorker() { return JavaScriptWorker_1.default; },
                get TypeScriptWorker() { return TypeScriptWorker_1.default; },
                get LanguageServiceWorker() { return LanguageServiceWorker_1.default; },
                get Sender() { return Sender_1.default; }
            };
            exports_1("default",main);
        }
    }
});
