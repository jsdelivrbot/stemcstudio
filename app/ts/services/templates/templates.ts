import app from '../../app';
import ITemplate from './ITemplate';

import EIGHT_BOOTSTRAP from './EIGHT_BOOTSTRAP';
import { HTML } from './COMMON_HTML';
import MINIMAL_BOOTSTRAP from './MINIMAL_BOOTSTRAP';
import MINIMAL_CSS from './MINIMAL_CSS';
import MINIMAL_README from './MINIMAL_README';
import MINIMAL_SPEC_RUNNER from './MINIMAL_SPEC_RUNNER';
import MINIMAL_EXAMPLE_SPEC from './MINIMAL_EXAMPLE_SPEC';
import { LANGUAGE_HTML } from '../../languages/modes';
import { LANGUAGE_TYPE_SCRIPT } from '../../languages/modes';
import { LANGUAGE_CSS } from '../../languages/modes';
import { LANGUAGE_MARKDOWN } from '../../languages/modes';
import { EDITOR_PREFERENCES_STORAGE } from '../../modules/preferences/constants';
import EditorPreferencesStorage from '../../modules/preferences/EditorPreferencesStorage';

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
         * WARNING! The choice of src for the SystemJS universal module loader is critical.
         * I have not yet had complete success with CDNJS, and so I am using the experimental
         * CDN serving the jspm registry.
         * As of Mar 16 2017, the most current version is 0.20.9
         * The migration from 0.19.x to 0.20.x requires some care.
         * The entry below is used on jspm.io and appears to be an alias for 0.19.34
         */
        const systemJsUrl = 'https://jspm.io/system@0.19.js';

        const BASIC: ITemplate = {
            name: "BASIC",
            description: "Minimal Program",
            files: {},
            dependencies: dependenciesMap(['DomReady']),
            noLoopCheck: false,
            operatorOverloading: true
        };
        BASIC.files[FILENAME_HTML] = { content: HTML(tab, './index.js', systemJsUrl), language: LANGUAGE_HTML };
        BASIC.files['index.ts'] = { content: MINIMAL_BOOTSTRAP(), language: LANGUAGE_TYPE_SCRIPT };
        BASIC.files['style.css'] = { content: MINIMAL_CSS(tab), language: LANGUAGE_CSS };
        BASIC.files['README.md'] = { content: MINIMAL_README(), language: LANGUAGE_MARKDOWN };

        const EIGHT: ITemplate = {
            name: "EIGHT",
            description: "EIGHT WebGL 3D Graphics",
            files: {},
            dependencies: dependenciesMap(['DomReady', 'jasmine', 'davinci-eight']),
            noLoopCheck: false,
            operatorOverloading: true
        };
        EIGHT.files[FILENAME_HTML] = { content: HTML(tab, './index.js', systemJsUrl, { canvasId: 'canvas3D' }), language: LANGUAGE_HTML };
        EIGHT.files['index.ts'] = { content: EIGHT_BOOTSTRAP(tab), language: LANGUAGE_TYPE_SCRIPT };
        EIGHT.files['style.css'] = { content: MINIMAL_CSS(tab), language: LANGUAGE_CSS };
        EIGHT.files['README.md'] = { content: MINIMAL_README(), language: LANGUAGE_MARKDOWN };
        EIGHT.files['tests.html'] = { content: HTML(tab, './tests.js', systemJsUrl), language: LANGUAGE_HTML };
        EIGHT.files['tests.ts'] = { content: MINIMAL_SPEC_RUNNER(tab), language: LANGUAGE_TYPE_SCRIPT };
        EIGHT.files['Example.spec.ts'] = { content: MINIMAL_EXAMPLE_SPEC(tab), language: LANGUAGE_TYPE_SCRIPT };

        const JASMINE: ITemplate = {
            name: "JASMINE",
            description: "Jasmine Testing Framework",
            files: {},
            dependencies: dependenciesMap(['DomReady', 'jasmine']),
            noLoopCheck: false,
            operatorOverloading: true
        };
        JASMINE.files[FILENAME_HTML] = { content: HTML(tab, './index.js', systemJsUrl), language: LANGUAGE_HTML };
        JASMINE.files['index.ts'] = { content: MINIMAL_BOOTSTRAP(), language: LANGUAGE_TYPE_SCRIPT };
        JASMINE.files['style.css'] = { content: MINIMAL_CSS(tab), language: LANGUAGE_CSS };
        JASMINE.files['README.md'] = { content: MINIMAL_README(), language: LANGUAGE_MARKDOWN };
        JASMINE.files['tests.html'] = { content: HTML(tab, './tests.js', systemJsUrl), language: LANGUAGE_HTML };
        JASMINE.files['tests.ts'] = { content: MINIMAL_SPEC_RUNNER(tab), language: LANGUAGE_TYPE_SCRIPT };
        JASMINE.files['Example.spec.ts'] = { content: MINIMAL_EXAMPLE_SPEC(tab), language: LANGUAGE_TYPE_SCRIPT };

        return [BASIC, EIGHT, JASMINE];
    }]);
