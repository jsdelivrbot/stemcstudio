import app from '../../app';
import ITemplate from './ITemplate';

import EIGHT_BOOTSTRAP from './EIGHT_BOOTSTRAP';
import EIGHT_HTML from './EIGHT_HTML';
import MINIMAL_HTML from './MINIMAL_HTML';
import MINIMAL_BOOTSTRAP from './MINIMAL_BOOTSTRAP';
import MINIMAL_CSS from './MINIMAL_CSS';
import MINIMAL_README from './MINIMAL_README';
import MINIMAL_SPEC_RUNNER_HTML from './MINIMAL_SPEC_RUNNER_HTML';
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

        const MINIM: ITemplate = {
            name: "BASIC",
            description: "Basic",
            files: {},
            dependencies: ['DomReady', 'jasmine'],
            operatorOverloading: false
        };
        MINIM.files[FILENAME_HTML] = { content: MINIMAL_HTML(tab), language: LANGUAGE_HTML };
        MINIM.files['index.ts'] = { content: MINIMAL_BOOTSTRAP(), language: LANGUAGE_TYPE_SCRIPT };
        MINIM.files['style.css'] = { content: MINIMAL_CSS(tab), language: LANGUAGE_CSS };
        MINIM.files['README.md'] = { content: MINIMAL_README(), language: LANGUAGE_MARKDOWN };
        MINIM.files['tests.html'] = { content: MINIMAL_SPEC_RUNNER_HTML(tab), language: LANGUAGE_HTML };
        MINIM.files['tests.ts'] = { content: MINIMAL_SPEC_RUNNER(tab), language: LANGUAGE_TYPE_SCRIPT };
        MINIM.files['Example.spec.ts'] = { content: MINIMAL_EXAMPLE_SPEC(tab), language: LANGUAGE_TYPE_SCRIPT };

        const EIGHT: ITemplate = {
            name: "EIGHT",
            description: "EIGHT",
            files: {},
            dependencies: ['DomReady', 'jasmine', 'davinci-eight'],
            operatorOverloading: true
        };
        EIGHT.files[FILENAME_HTML] = { content: EIGHT_HTML(tab), language: LANGUAGE_HTML };
        EIGHT.files['index.ts'] = { content: EIGHT_BOOTSTRAP(tab), language: LANGUAGE_TYPE_SCRIPT };
        EIGHT.files['style.css'] = { content: MINIMAL_CSS(tab), language: LANGUAGE_CSS };
        EIGHT.files['README.md'] = { content: MINIMAL_README(), language: LANGUAGE_MARKDOWN };
        EIGHT.files['tests.html'] = { content: MINIMAL_SPEC_RUNNER_HTML(tab), language: LANGUAGE_HTML };
        EIGHT.files['tests.ts'] = { content: MINIMAL_SPEC_RUNNER(tab), language: LANGUAGE_TYPE_SCRIPT };
        EIGHT.files['Example.spec.ts'] = { content: MINIMAL_EXAMPLE_SPEC(tab), language: LANGUAGE_TYPE_SCRIPT };

        // The MINIM (minimal) template is only present as a foundation for other templates.
        // Avoid providing templates that don't do much when the program is launched!
        return [EIGHT];
    }]);
