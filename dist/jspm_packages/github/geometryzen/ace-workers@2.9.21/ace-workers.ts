import { ClojureWorker } from "./src/mode/ClojureWorker";
import { ExampleWorker } from "./src/mode/ExampleWorker";
import { GlslWorker } from "./src/mode/GlslWorker";
import { HtmlWorker } from "./src/mode/HtmlWorker";
import { JavaScriptWorker } from "./src/mode/JavaScriptWorker";
import { JsonWorker } from "./src/mode/JsonWorker";
import { PythonWorker } from "./src/mode/PythonWorker";
import { TypeScriptWorker } from "./src/mode/TypeScriptWorker";
import { LanguageServiceWorker } from "./src/mode/LanguageServiceWorker";
import { Sender } from "./src/lib/Sender";

const main = {
    get ClojureWorker() { return ClojureWorker; },
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
