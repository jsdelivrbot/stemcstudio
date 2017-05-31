//
// TODO: This is probably equivalent to simply exporting.
//
import { ClojureWorker } from "./src/workers/ClojureWorker";
import { CssWorker } from "./src/workers/CssWorker";
import { ExampleWorker } from "./src/workers/ExampleWorker";
import { GlslWorker } from "./src/workers/GlslWorker";
import { HtmlWorker } from "./src/workers/HtmlWorker";
import { JavaScriptWorker } from "./src/workers/JavaScriptWorker";
import { JsonWorker } from "./src/workers/JsonWorker";
import { PythonWorker } from "./src/workers/PythonWorker";
import { TypeScriptWorker } from "./src/workers/TypeScriptWorker";
import { LanguageServiceWorker } from "./src/workers/LanguageServiceWorker";
import { Sender } from "./src/lib/Sender";

const main = {
    get ClojureWorker() { return ClojureWorker; },
    get CssWorker() { return CssWorker; },
    get ExampleWorker() { return ExampleWorker; },
    get GlslWorker() { return GlslWorker; },
    get HtmlWorker() { return HtmlWorker; },
    get JavaScriptWorker() { return JavaScriptWorker; },
    get JsonWorker() { return JsonWorker; },
    get PythonWorker() { return PythonWorker; },
    get TypeScriptWorker() { return TypeScriptWorker; },
    get LanguageServiceWorker() { return LanguageServiceWorker; },
    get Sender() { return Sender; }
};

export default main;
