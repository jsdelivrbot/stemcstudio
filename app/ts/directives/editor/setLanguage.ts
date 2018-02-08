// Built-In Languages../
import { APP_VERSION } from '../../constants';
import { STEMCSTUDIO_WORKER_TS_PATH } from '../../constants';
import { STEMCSTUDIO_WORKERS_PATH } from '../../constants';
import { AsciiDocMode } from '../../editor/mode/AsciiDocMode';
import { ClojureMode } from '../../editor/mode/ClojureMode';
import { CssMode } from '../../editor/mode/CssMode';
import { CsvMode } from '../../editor/mode/CsvMode';
import { GlslMode } from '../../editor/mode/GlslMode';
import { GoLangMode } from '../../editor/mode/GoLangMode';
import { HaskellMode } from '../../editor/mode/HaskellMode';
import { HtmlMode } from '../../editor/mode/HtmlMode';
import { JavaScriptMode } from '../../editor/mode/JavaScriptMode';
import { JsxMode } from '../../editor/mode/JsxMode';
import { JsonMode } from '../../editor/mode/JsonMode';
import { LatexMode } from '../../editor/mode/LatexMode';
import { MarkdownMode } from '../../editor/mode/MarkdownMode';
import { MatlabMode } from '../../editor/mode/MatlabMode';
import { PureScriptMode } from '../../editor/mode/PureScriptMode';
import { PythonMode } from '../../editor/mode/PythonMode';
import { SvgMode } from '../../editor/mode/SvgMode';
import { TextMode } from '../../editor/mode/TextMode';
import { TypeScriptMode } from '../../editor/mode/TypeScriptMode';
import { TsxMode } from '../../editor/mode/TsxMode';
import { XmlMode } from '../../editor/mode/XmlMode';
import { YamlMode } from '../../editor/mode/YamlMode';
import { LANGUAGE_ASCIIDOC } from '../../languages/modes';
import { LANGUAGE_CSS } from '../../languages/modes';
import { LANGUAGE_CSV } from '../../languages/modes';
import { LANGUAGE_GLSL } from '../../languages/modes';
import { LANGUAGE_GO } from '../../languages/modes';
import { LANGUAGE_HASKELL } from '../../languages/modes';
import { LANGUAGE_HTML } from '../../languages/modes';
import { LANGUAGE_JAVA_SCRIPT } from '../../languages/modes';
import { LANGUAGE_JSX } from '../../languages/modes';
import { LANGUAGE_JSON } from '../../languages/modes';
import { LANGUAGE_LATEX } from '../../languages/modes';
import { LANGUAGE_LESS } from '../../languages/modes';
import { LANGUAGE_MARKDOWN } from '../../languages/modes';
import { LANGUAGE_MATLAB } from '../../languages/modes';
import { LANGUAGE_PURE_SCRIPT } from '../../languages/modes';
import { LANGUAGE_PYTHON } from '../../languages/modes';
import { LANGUAGE_SCHEME } from '../../languages/modes';
import { LANGUAGE_SVG } from '../../languages/modes';
import { LANGUAGE_TEXT } from '../../languages/modes';
import { LANGUAGE_TSX } from '../../languages/modes';
import { LANGUAGE_TYPE_SCRIPT } from '../../languages/modes';
import { LANGUAGE_XML } from '../../languages/modes';
import { LANGUAGE_YAML } from '../../languages/modes';
import { LanguageModeId } from '../../editor/LanguageMode';
import { EditSession } from '../../editor/EditSession';

/**
 * 
 */
export function setLanguage(editSession: EditSession, mode: LanguageModeId): Promise<void> {
    const systemImports: string[] = ['/jspm_packages/system.js', `/jspm.config.js?version=${APP_VERSION}`];
    /**
     * workerImports adds to systemImports.
     */
    const workerImports: string[] = systemImports.concat([STEMCSTUDIO_WORKERS_PATH]);

    return new Promise<void>((resolve, reject) => {
        function onSetLanguageMode(err: any) {
            if (!err) {
                resolve();
            }
            else {
                reject(err);
            }
        }
        switch (mode) {
            case LANGUAGE_ASCIIDOC: {
                editSession.setUseWrapMode(true);
                // editor.setWrapBehavioursEnabled(true);
                editSession.setLanguageMode(new AsciiDocMode('/js/worker.js', workerImports), onSetLanguageMode);
                break;
            }
            case LANGUAGE_HASKELL: {
                editSession.setUseWorker(false);
                editSession.setLanguageMode(new HaskellMode('/js/worker.js', workerImports), onSetLanguageMode);
                break;
            }
            case LANGUAGE_PYTHON: {
                editSession.setUseWorker(true);
                editSession.setLanguageMode(new PythonMode('/js/worker.js', workerImports), onSetLanguageMode);
                break;
            }
            case LANGUAGE_SCHEME: {
                // If we don't use the worker then we don't get a confirmation.
                // editSession.setUseWorker(false);
                editSession.setLanguageMode(new ClojureMode('/js/worker.js', workerImports), onSetLanguageMode);
                break;
            }
            case LANGUAGE_JAVA_SCRIPT: {
                editSession.setLanguageMode(new JavaScriptMode('/js/worker.js', workerImports), onSetLanguageMode);
                break;
            }
            case LANGUAGE_JSX: {
                editSession.setLanguageMode(new JsxMode('/js/worker.js', workerImports), onSetLanguageMode);
                break;
            }
            case LANGUAGE_PURE_SCRIPT: {
                editSession.setUseWorker(false);
                editSession.setLanguageMode(new PureScriptMode('/js/worker.js', workerImports), onSetLanguageMode);
                break;
            }
            case LANGUAGE_TYPE_SCRIPT: {
                const tsMode = new TypeScriptMode('/js/worker.js', systemImports.concat([STEMCSTUDIO_WORKER_TS_PATH]));
                tsMode.getTokenizer().trace = editSession.traceTokenizer;
                editSession.setLanguageMode(tsMode, onSetLanguageMode);
                break;
            }
            case LANGUAGE_TSX: {
                const tsxMode = new TsxMode('/js/worker.js', systemImports.concat([STEMCSTUDIO_WORKER_TS_PATH]));
                tsxMode.getTokenizer().trace = editSession.traceTokenizer;
                editSession.setLanguageMode(tsxMode, onSetLanguageMode);
                break;
            }
            case LANGUAGE_HTML: {
                editSession.setLanguageMode(new HtmlMode('/js/worker.js', workerImports), onSetLanguageMode);
                break;
            }
            case LANGUAGE_JSON: {
                editSession.setLanguageMode(new JsonMode('/js/worker.js', workerImports), onSetLanguageMode);
                break;
            }
            case LANGUAGE_GLSL: {
                // If we don't use the worker then we don't get a confirmation.
                editSession.setLanguageMode(new GlslMode('/js/worker.js', workerImports), onSetLanguageMode);
                break;
            }
            case LANGUAGE_GO: {
                editSession.setUseWorker(false);
                editSession.setLanguageMode(new GoLangMode('/js/worker.js', workerImports), onSetLanguageMode);
                break;
            }
            case LANGUAGE_CSS:
            case LANGUAGE_LESS: {
                // If we don't use the worker then we don't get a confirmation.
                editSession.setUseWorker(false);
                editSession.setLanguageMode(new CssMode('/js/worker.js', workerImports), onSetLanguageMode);
                break;
            }
            case LANGUAGE_LATEX: {
                editSession.setUseWrapMode(true);
                // editor.setWrapBehavioursEnabled(true);
                editSession.setLanguageMode(new LatexMode('/js/worker.js', workerImports), onSetLanguageMode);
                break;
            }
            case LANGUAGE_MARKDOWN: {
                editSession.setUseWrapMode(true);
                // editor.setWrapBehavioursEnabled(true);
                editSession.setLanguageMode(new MarkdownMode('/js/worker.js', workerImports), onSetLanguageMode);
                break;
            }
            case LANGUAGE_MATLAB: {
                editSession.setUseWorker(false);
                editSession.setLanguageMode(new MatlabMode('/js/worker.js', workerImports), onSetLanguageMode);
                break;
            }
            case LANGUAGE_CSV: {
                editSession.setLanguageMode(new CsvMode('/js/worker.js', workerImports), onSetLanguageMode);
                break;
            }
            case LANGUAGE_SVG: {
                editSession.setLanguageMode(new SvgMode('/js/worker.js', workerImports), onSetLanguageMode);
                break;
            }
            case LANGUAGE_TEXT: {
                editSession.setLanguageMode(new TextMode('/js/worker.js', workerImports), onSetLanguageMode);
                break;
            }
            case LANGUAGE_XML: {
                editSession.setLanguageMode(new XmlMode('/js/worker.js', workerImports), onSetLanguageMode);
                break;
            }
            case LANGUAGE_YAML: {
                editSession.setLanguageMode(new YamlMode('/js/worker.js', workerImports), onSetLanguageMode);
                break;
            }
            default: {
                reject(new Error(`Unrecognized mode '${mode}'.`));
            }
        }
    });
}
