import { app } from '../../app';
import { ITemplate } from './template';
import { EIGHT_BOOTSTRAP } from './EIGHT_BOOTSTRAP';
import { HTML } from './COMMON_HTML';
import { MINIMAL_BOOTSTRAP } from './MINIMAL_BOOTSTRAP';
import { MINIMAL_CSS } from './MINIMAL_CSS';
import { STANDARD_README } from './STANDARD_README';
import { MINIMAL_SPEC_RUNNER } from './MINIMAL_SPEC_RUNNER';
import { MINIMAL_EXAMPLE_SPEC } from './MINIMAL_EXAMPLE_SPEC';
import { REACT_BOOTSTRAP } from './REACT_BOOTSTRAP';
import { LANGUAGE_HTML } from '../../languages/modes';
import { LANGUAGE_TYPE_SCRIPT } from '../../languages/modes';
import { LANGUAGE_CSS } from '../../languages/modes';
import { LANGUAGE_MARKDOWN } from '../../languages/modes';
import { EDITOR_PREFERENCES_STORAGE } from '../../modules/preferences/constants';
import { EditorPreferencesStorage } from '../../modules/preferences/EditorPreferencesStorage';
import { TemplateOptions } from './template';

const INDEX_DOT_JS = `main.js`;
const INDEX_DOT_TS = 'main.ts';
const INDEX_DOT_TSX = 'main.tsx';

/**
 * Computes the string to use for a single tab based upon the current editor preferences.
 */
function tabString(editorPreferences: EditorPreferencesStorage): string {
    if (editorPreferences.useSoftTabs) {
        let ts = "";
        const tabSize = editorPreferences.tabSize;
        for (let i = 0; i < tabSize; i++) {
            ts = ts + " ";
        }
        return ts;
    }
    else {
        return "\t";
    }
}
export default function dependenciesMap(packageNames: string[]): { [packageName: string]: string } {
    function version(packageName: string): string {
        return 'latest';
    }
    const obj: { [packageName: string]: string } = {};
    packageNames.forEach(function (packageName: string) {
        obj[packageName] = version(packageName);
    });
    return obj;
}

/**
 * The `templates` service provides starting point doodles.
 * A template is essentially a doodle that is copied.
 */
app.factory('templates', [
    EDITOR_PREFERENCES_STORAGE,
    'FILENAME_HTML',
    function (
        editorPreferences: EditorPreferencesStorage,
        FILENAME_HTML: string
    ): ITemplate[] {
        /**
         * The string to use for a single tab.
         */
        const tab = tabString(editorPreferences);
        /**
         * System polyfill.
         * After some problems with the file at unpkg.com, going back to jspm.io
         */
        const systemJsUrl = 'https://www.stemcstudio.com/jspm_packages/system.js';
        // const systemJsUrl = 'https://jspm.io/system@0.19.34.js';
        // const systemJsUrl = 'https://unpkg.com/systemjs@0.19.34/dist/system.src.js';

        // TODO: The problem here is that the template file content maps to strings,
        // when it should map to functions that create strings. Doing so would allow
        // the contents of the template files to be determined AFTER the user has
        // entered their customizations.
        const options: TemplateOptions = {
            mainJs: INDEX_DOT_JS,
            mainTs: INDEX_DOT_TS,
            tab: tabString(editorPreferences)
        };

        const BASIC: ITemplate = {
            name: "BASIC",
            description: "Minimal Program",
            files: {},
            dependencies: dependenciesMap(['DomReady']),
            hideConfigFiles: true,
            linting: true,
            noLoopCheck: false,
            operatorOverloading: true
        };
        BASIC.files[FILENAME_HTML] = { content: HTML(tab, `./${INDEX_DOT_JS}`, systemJsUrl), language: LANGUAGE_HTML };
        BASIC.files[INDEX_DOT_TS] = { content: MINIMAL_BOOTSTRAP(), language: LANGUAGE_TYPE_SCRIPT };
        BASIC.files['style.css'] = { content: MINIMAL_CSS(tab), language: LANGUAGE_CSS };
        BASIC.files['README.md'] = { content: STANDARD_README(options), language: LANGUAGE_MARKDOWN };

        const EIGHT: ITemplate = {
            name: "EIGHT",
            description: "EIGHT WebGL 3D Graphics",
            files: {},
            dependencies: dependenciesMap([/*'DomReady', 'jasmine',*/ 'davinci-eight']),
            hideConfigFiles: true,
            linting: true,
            noLoopCheck: false,
            operatorOverloading: true
        };
        EIGHT.files[FILENAME_HTML] = { content: HTML(tab, `./${INDEX_DOT_JS}`, systemJsUrl, { canvasId: 'canvas3D' }), language: LANGUAGE_HTML };
        EIGHT.files[INDEX_DOT_TS] = { content: EIGHT_BOOTSTRAP(tab), language: LANGUAGE_TYPE_SCRIPT };
        EIGHT.files['style.css'] = { content: MINIMAL_CSS(tab), language: LANGUAGE_CSS };
        EIGHT.files['README.md'] = { content: STANDARD_README(options), language: LANGUAGE_MARKDOWN };
        // EIGHT.files['tests.html'] = { content: HTML(tab, './tests.js', systemJsUrl), language: LANGUAGE_HTML };
        // EIGHT.files['tests.ts'] = { content: MINIMAL_SPEC_RUNNER(tab), language: LANGUAGE_TYPE_SCRIPT };
        // EIGHT.files['Example.spec.ts'] = { content: MINIMAL_EXAMPLE_SPEC(tab), language: LANGUAGE_TYPE_SCRIPT };

        const REACT: ITemplate = {
            name: "React",
            description: "React UI Component Framework",
            files: {},
            dependencies: dependenciesMap(['DomReady', 'jasmine', 'react', 'react-dom']),
            hideConfigFiles: true,
            linting: true,
            noLoopCheck: false,
            operatorOverloading: true
        };
        REACT.files[FILENAME_HTML] = { content: HTML(tab, `./${INDEX_DOT_JS}`, systemJsUrl, { containerId: 'container' }), language: LANGUAGE_HTML };
        REACT.files[INDEX_DOT_TSX] = { content: REACT_BOOTSTRAP(tab), language: LANGUAGE_TYPE_SCRIPT };
        REACT.files['style.css'] = { content: MINIMAL_CSS(tab), language: LANGUAGE_CSS };
        REACT.files['README.md'] = { content: STANDARD_README(options), language: LANGUAGE_MARKDOWN };
        REACT.files['tests.html'] = { content: HTML(tab, './tests.js', systemJsUrl), language: LANGUAGE_HTML };
        REACT.files['tests.ts'] = { content: MINIMAL_SPEC_RUNNER(tab), language: LANGUAGE_TYPE_SCRIPT };
        REACT.files['Example.spec.ts'] = { content: MINIMAL_EXAMPLE_SPEC(tab), language: LANGUAGE_TYPE_SCRIPT };

        const JASMINE: ITemplate = {
            name: "JASMINE",
            description: "Jasmine Testing Framework",
            files: {},
            dependencies: dependenciesMap(['DomReady', 'jasmine']),
            hideConfigFiles: true,
            linting: true,
            noLoopCheck: false,
            operatorOverloading: true
        };
        JASMINE.files[FILENAME_HTML] = { content: HTML(tab, `./${INDEX_DOT_JS}`, systemJsUrl), language: LANGUAGE_HTML };
        JASMINE.files[INDEX_DOT_TS] = { content: MINIMAL_BOOTSTRAP(), language: LANGUAGE_TYPE_SCRIPT };
        JASMINE.files['style.css'] = { content: MINIMAL_CSS(tab), language: LANGUAGE_CSS };
        JASMINE.files['README.md'] = { content: STANDARD_README(options), language: LANGUAGE_MARKDOWN };
        JASMINE.files['tests.html'] = { content: HTML(tab, './tests.js', systemJsUrl), language: LANGUAGE_HTML };
        JASMINE.files['tests.ts'] = { content: MINIMAL_SPEC_RUNNER(tab), language: LANGUAGE_TYPE_SCRIPT };
        JASMINE.files['Example.spec.ts'] = { content: MINIMAL_EXAMPLE_SPEC(tab), language: LANGUAGE_TYPE_SCRIPT };

        return [BASIC, EIGHT, REACT, JASMINE];
    }]);
