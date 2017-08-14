import { app } from '../../app';
import { ITemplate } from './template';
import { CANVAS_MAIN } from './CANVAS_MAIN';
import { CANVAS_MODEL } from './CANVAS_MODEL';
import { CANVAS_VIEW } from './CANVAS_VIEW';
import { EIGHT_MAIN } from './EIGHT_MAIN';
import { EIGHT_MODEL } from './EIGHT_MODEL';
import { EIGHT_VIEW } from './EIGHT_VIEW';
import { HTML } from './COMMON_HTML';
import { KEYBOARD } from './KEYBOARD';
import { MINIMAL_MAIN } from './MINIMAL_MAIN';
import { MINIMAL_MODEL } from './MINIMAL_MODEL';
import { MINIMAL_VIEW } from './MINIMAL_VIEW';
import { MINIMAL_CSS } from './MINIMAL_CSS';
import { STANDARD_README } from './STANDARD_README';
import { MINIMAL_SPEC_RUNNER } from './MINIMAL_SPEC_RUNNER';
import { MINIMAL_EXAMPLE_SPEC } from './MINIMAL_EXAMPLE_SPEC';
import { REACT_BOOTSTRAP } from './REACT_BOOTSTRAP';
import { LANGUAGE_HTML } from '../../languages/modes';
import { LANGUAGE_JAVA_SCRIPT } from '../../languages/modes';
import { LANGUAGE_JSON } from '../../languages/modes';
import { LANGUAGE_TYPE_SCRIPT } from '../../languages/modes';
import { LANGUAGE_CSS } from '../../languages/modes';
import { LANGUAGE_MARKDOWN } from '../../languages/modes';
import { EDITOR_PREFERENCES_STORAGE } from '../../modules/preferences/constants';
import { EditorPreferencesStorage } from '../../modules/preferences/EditorPreferencesStorage';
import { SYSTEM_CONFIG } from './SYSTEM_CONFIG';
import { TemplateOptions } from './template';
import { TYPES_CONFIG } from './TYPES_CONFIG';
import { VECTOR_2D_SPEC } from './VECTOR_2D_SPEC';
import { VECTOR_3D_SPEC } from './VECTOR_3D_SPEC';
import { VECTOR } from './VECTOR';

const MAIN_DOT_JS = `main.js`;
const MAIN_DOT_TS = 'main.ts';

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
export function dependenciesMap(packageNames: string[]): { [packageName: string]: string } {
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
         * TODO: This is not consistent with the template substitution.
         */
        // const systemJsUrl = 'https://www.stemcstudio.com/jspm_packages/system.js';
        const systemJsUrl = 'https://jspm.io/system@0.19.34.js';
        // const systemJsUrl = 'https://unpkg.com/systemjs@0.19.34/dist/system.src.js';

        // TODO: The problem here is that the template file content maps to strings,
        // when it should map to functions that create strings. Doing so would allow
        // the contents of the template files to be determined AFTER the user has
        // entered their customizations.
        const options: TemplateOptions = {
            mainJs: MAIN_DOT_JS,
            mainTs: MAIN_DOT_TS,
            tab: tabString(editorPreferences)
        };

        const BASIC: ITemplate = {
            name: "BASIC",
            description: "Minimal Web Program",
            files: {},
            dependencies: dependenciesMap(['DomReady']),
            hideConfigFiles: true,
            linting: true,
            noLoopCheck: false,
            operatorOverloading: true
        };
        BASIC.files['index.html'] = { content: HTML(tab, `./${MAIN_DOT_JS}`, systemJsUrl, { containerId: 'container' }), language: LANGUAGE_HTML };
        BASIC.files['main.ts'] = { content: MINIMAL_MAIN(tab), language: LANGUAGE_TYPE_SCRIPT };
        BASIC.files['model.ts'] = { content: MINIMAL_MODEL(tab), language: LANGUAGE_TYPE_SCRIPT };
        BASIC.files['README.md'] = { content: STANDARD_README(options), language: LANGUAGE_MARKDOWN };
        BASIC.files['style.css'] = { content: MINIMAL_CSS(tab, { hideOverflow: false }), language: LANGUAGE_CSS };
        BASIC.files['system.config.js'] = { content: SYSTEM_CONFIG(tab, {}), language: LANGUAGE_JAVA_SCRIPT };
        BASIC.files['types.config.json'] = { content: TYPES_CONFIG(tab, {}), language: LANGUAGE_JSON };
        BASIC.files['view.ts'] = { content: MINIMAL_VIEW(tab), language: LANGUAGE_TYPE_SCRIPT };

        const CANVAS: ITemplate = {
            name: "Model View 2D",
            description: "MVC Canvas (2D Graphics)",
            files: {},
            dependencies: dependenciesMap(['DomReady', 'jasmine']),
            hideConfigFiles: true,
            linting: true,
            noLoopCheck: false,
            operatorOverloading: true
        };
        CANVAS.files['index.html'] = { content: HTML(tab, `./${MAIN_DOT_JS}`, systemJsUrl, { containerId: 'container' }), language: LANGUAGE_HTML };
        CANVAS.files['keyboard.ts'] = { content: KEYBOARD(tab), language: LANGUAGE_TYPE_SCRIPT };
        CANVAS.files['main.ts'] = { content: CANVAS_MAIN(tab), language: LANGUAGE_TYPE_SCRIPT };
        CANVAS.files['model.ts'] = { content: CANVAS_MODEL(tab), language: LANGUAGE_TYPE_SCRIPT };
        CANVAS.files['README.md'] = { content: STANDARD_README(options), language: LANGUAGE_MARKDOWN };
        CANVAS.files['style.css'] = { content: MINIMAL_CSS(tab, { hideOverflow: true }), language: LANGUAGE_CSS };
        CANVAS.files['system.config.js'] = { content: SYSTEM_CONFIG(tab, {}), language: LANGUAGE_JAVA_SCRIPT };
        CANVAS.files['types.config.json'] = { content: TYPES_CONFIG(tab, {}), language: LANGUAGE_JSON };
        CANVAS.files['tests.html'] = { content: HTML(tab, './tests.js', systemJsUrl), language: LANGUAGE_HTML };
        CANVAS.files['tests.ts'] = { content: MINIMAL_SPEC_RUNNER(tab, 'Vector', 'vectorSpec', './vector.spec'), language: LANGUAGE_TYPE_SCRIPT };
        CANVAS.files['vector.spec.ts'] = { content: VECTOR_2D_SPEC(tab), language: LANGUAGE_TYPE_SCRIPT };
        CANVAS.files['vector.ts'] = { content: VECTOR(tab, 2), language: LANGUAGE_TYPE_SCRIPT };
        CANVAS.files['view.ts'] = { content: CANVAS_VIEW(tab), language: LANGUAGE_TYPE_SCRIPT };

        const EIGHT: ITemplate = {
            name: "Model View 3D",
            description: "MVC WebGL (3D Graphics)",
            files: {},
            dependencies: dependenciesMap(['DomReady', 'jasmine', 'davinci-eight']),
            hideConfigFiles: true,
            linting: true,
            noLoopCheck: false,
            operatorOverloading: true
        };
        EIGHT.files['index.html'] = { content: HTML(tab, `./${MAIN_DOT_JS}`, systemJsUrl, { containerId: 'container' }), language: LANGUAGE_HTML };
        EIGHT.files['keyboard.ts'] = { content: KEYBOARD(tab), language: LANGUAGE_TYPE_SCRIPT };
        EIGHT.files['main.ts'] = { content: EIGHT_MAIN(tab), language: LANGUAGE_TYPE_SCRIPT };
        EIGHT.files['model.ts'] = { content: EIGHT_MODEL(tab), language: LANGUAGE_TYPE_SCRIPT };
        EIGHT.files['README.md'] = { content: STANDARD_README(options), language: LANGUAGE_MARKDOWN };
        EIGHT.files['style.css'] = { content: MINIMAL_CSS(tab, { hideOverflow: false }), language: LANGUAGE_CSS };
        EIGHT.files['system.config.js'] = { content: SYSTEM_CONFIG(tab, { 'davinci-eight': 'https://unpkg.com/davinci-eight@7.0.3/build/browser/index.js' }), language: LANGUAGE_JAVA_SCRIPT };
        EIGHT.files['tests.html'] = { content: HTML(tab, './tests.js', systemJsUrl), language: LANGUAGE_HTML };
        EIGHT.files['tests.ts'] = { content: MINIMAL_SPEC_RUNNER(tab, 'Vector', 'vectorSpec', './vector.spec'), language: LANGUAGE_TYPE_SCRIPT };
        EIGHT.files['types.config.json'] = { content: TYPES_CONFIG(tab, { 'davinci-eight': 'https://unpkg.com/davinci-eight@7.0.3/build/browser/index.d.ts' }), language: LANGUAGE_JSON };
        EIGHT.files['vector.spec.ts'] = { content: VECTOR_3D_SPEC(tab), language: LANGUAGE_TYPE_SCRIPT };
        EIGHT.files['vector.ts'] = { content: VECTOR(tab, 3), language: LANGUAGE_TYPE_SCRIPT };
        EIGHT.files['view.ts'] = { content: EIGHT_VIEW(tab), language: LANGUAGE_TYPE_SCRIPT };

        const REACT: ITemplate = {
            name: "React",
            description: "React UI Component Framework",
            files: {},
            dependencies: dependenciesMap(['DomReady', 'jasmine'/*, 'react', 'react-dom'*/]),
            hideConfigFiles: true,
            linting: true,
            noLoopCheck: false,
            operatorOverloading: true
        };
        REACT.files['index.html'] = { content: HTML(tab, `./${MAIN_DOT_JS}`, systemJsUrl, { containerId: 'container' }), language: LANGUAGE_HTML };
        REACT.files['example.spec.ts'] = { content: MINIMAL_EXAMPLE_SPEC(tab), language: LANGUAGE_TYPE_SCRIPT };
        REACT.files['main.tsx'] = { content: REACT_BOOTSTRAP(tab), language: LANGUAGE_TYPE_SCRIPT };
        REACT.files['README.md'] = { content: STANDARD_README(options), language: LANGUAGE_MARKDOWN };
        REACT.files['style.css'] = { content: MINIMAL_CSS(tab, { hideOverflow: false }), language: LANGUAGE_CSS };
        REACT.files['system.config.js'] = {
            content: SYSTEM_CONFIG(tab, {
                'react': 'https://www.stemcstudio.com/vendor/react@15.4.2/react.js',
                'react-dom': 'https://www.stemcstudio.com/vendor/react-dom@15.4.2/react-dom.js'
            }), language: LANGUAGE_JAVA_SCRIPT
        };
        REACT.files['tests.html'] = { content: HTML(tab, './tests.js', systemJsUrl), language: LANGUAGE_HTML };
        REACT.files['tests.ts'] = { content: MINIMAL_SPEC_RUNNER(tab, 'Example', 'exampleSpec', './example.spec'), language: LANGUAGE_TYPE_SCRIPT };
        REACT.files['types.config.json'] = {
            content: TYPES_CONFIG(tab, {
                'react': 'https://www.stemcstudio.com/vendor/react@15.4.2/index.d.ts',
                'react-dom': 'https://www.stemcstudio.com/vendor/react-dom@15.4.2/index.d.ts'
            }), language: LANGUAGE_JSON
        };

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
        JASMINE.files['index.html'] = { content: HTML(tab, `./${MAIN_DOT_JS}`, systemJsUrl, { containerId: 'container' }), language: LANGUAGE_HTML };
        JASMINE.files['example.spec.ts'] = { content: MINIMAL_EXAMPLE_SPEC(tab), language: LANGUAGE_TYPE_SCRIPT };
        JASMINE.files['main.ts'] = { content: MINIMAL_MAIN(tab), language: LANGUAGE_TYPE_SCRIPT };
        JASMINE.files['model.ts'] = { content: MINIMAL_MODEL(tab), language: LANGUAGE_TYPE_SCRIPT };
        JASMINE.files['README.md'] = { content: STANDARD_README(options), language: LANGUAGE_MARKDOWN };
        JASMINE.files['style.css'] = { content: MINIMAL_CSS(tab, { hideOverflow: false }), language: LANGUAGE_CSS };
        JASMINE.files['system.config.js'] = { content: SYSTEM_CONFIG(tab, {}), language: LANGUAGE_JAVA_SCRIPT };
        JASMINE.files['tests.html'] = { content: HTML(tab, './tests.js', systemJsUrl), language: LANGUAGE_HTML };
        JASMINE.files['tests.ts'] = { content: MINIMAL_SPEC_RUNNER(tab, 'Example', 'exampleSpec', './example.spec'), language: LANGUAGE_TYPE_SCRIPT };
        JASMINE.files['types.config.json'] = { content: TYPES_CONFIG(tab, {}), language: LANGUAGE_JSON };
        JASMINE.files['view.ts'] = { content: MINIMAL_VIEW(tab), language: LANGUAGE_TYPE_SCRIPT };

        return [BASIC, CANVAS, EIGHT, REACT, JASMINE];
    }]);
