System.register(["./src/workers/ClojureWorker", "./src/workers/CssWorker", "./src/workers/ExampleWorker", "./src/workers/GlslWorker", "./src/workers/HtmlWorker", "./src/workers/JavaScriptWorker", "./src/workers/JsonWorker", "./src/workers/PythonWorker", "./src/workers/TypeScriptWorker", "./src/workers/LanguageServiceWorker", "./src/lib/Sender"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ClojureWorker_1, CssWorker_1, ExampleWorker_1, GlslWorker_1, HtmlWorker_1, JavaScriptWorker_1, JsonWorker_1, PythonWorker_1, TypeScriptWorker_1, LanguageServiceWorker_1, Sender_1, main;
    return {
        setters: [
            function (ClojureWorker_1_1) {
                ClojureWorker_1 = ClojureWorker_1_1;
            },
            function (CssWorker_1_1) {
                CssWorker_1 = CssWorker_1_1;
            },
            function (ExampleWorker_1_1) {
                ExampleWorker_1 = ExampleWorker_1_1;
            },
            function (GlslWorker_1_1) {
                GlslWorker_1 = GlslWorker_1_1;
            },
            function (HtmlWorker_1_1) {
                HtmlWorker_1 = HtmlWorker_1_1;
            },
            function (JavaScriptWorker_1_1) {
                JavaScriptWorker_1 = JavaScriptWorker_1_1;
            },
            function (JsonWorker_1_1) {
                JsonWorker_1 = JsonWorker_1_1;
            },
            function (PythonWorker_1_1) {
                PythonWorker_1 = PythonWorker_1_1;
            },
            function (TypeScriptWorker_1_1) {
                TypeScriptWorker_1 = TypeScriptWorker_1_1;
            },
            function (LanguageServiceWorker_1_1) {
                LanguageServiceWorker_1 = LanguageServiceWorker_1_1;
            },
            function (Sender_1_1) {
                Sender_1 = Sender_1_1;
            }
        ],
        execute: function () {
            main = {
                get ClojureWorker() { return ClojureWorker_1.ClojureWorker; },
                get CssWorker() { return CssWorker_1.CssWorker; },
                get ExampleWorker() { return ExampleWorker_1.ExampleWorker; },
                get GlslWorker() { return GlslWorker_1.GlslWorker; },
                get HtmlWorker() { return HtmlWorker_1.HtmlWorker; },
                get JavaScriptWorker() { return JavaScriptWorker_1.JavaScriptWorker; },
                get JsonWorker() { return JsonWorker_1.JsonWorker; },
                get PythonWorker() { return PythonWorker_1.PythonWorker; },
                get TypeScriptWorker() { return TypeScriptWorker_1.TypeScriptWorker; },
                get LanguageServiceWorker() { return LanguageServiceWorker_1.LanguageServiceWorker; },
                get Sender() { return Sender_1.Sender; }
            };
            exports_1("default", main);
        }
    };
});
