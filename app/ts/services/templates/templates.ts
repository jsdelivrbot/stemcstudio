import app from '../../app';
import IOptionManager from '../options/IOptionManager';
import ITemplate from './ITemplate';

import MINIMAL_HTML from './MINIMAL_HTML';
import MINIMAL_BOOTSTRAP from './MINIMAL_BOOTSTRAP';
import MINIMAL_GREETING from './MINIMAL_GREETING';
import MINIMAL_CSS from './MINIMAL_CSS';
import MINIMAL_README from './MINIMAL_README';
import MINIMAL_SPEC_RUNNER_HTML from './MINIMAL_SPEC_RUNNER_HTML';
import MINIMAL_SPEC_RUNNER from './MINIMAL_SPEC_RUNNER';
import MINIMAL_EXTEND from './MINIMAL_EXTEND';
import MINIMAL_VECTOR from './MINIMAL_VECTOR';
import MINIMAL_VECTOR_SPEC from './MINIMAL_VECTOR_SPEC';
import {LANGUAGE_HTML} from '../../languages/modes';
import {LANGUAGE_TYPE_SCRIPT} from '../../languages/modes';
import {LANGUAGE_CSS} from '../../languages/modes';
import {LANGUAGE_MARKDOWN} from '../../languages/modes';

/**
 * The `templates` service provides starting point doodles.
 * A template is essentially a doodle that is copied.
 */
app.factory('templates', [
    '$location',
    'options',
    'LIBS_MARKER',
    'SCRIPTS_MARKER',
    'FILENAME_HTML',
    'FILENAME_CODE',
    'FILENAME_LIBS',
    'FILENAME_LESS',
    function(
        $location: angular.ILocationService,
        options: IOptionManager,
        LIBS_MARKER: string,
        SCRIPTS_MARKER: string,
        FILENAME_HTML: string,
        FILENAME_CODE: string,
        FILENAME_LIBS: string,
        FILENAME_LESS: string
    ): ITemplate[] {

        // We really don't need a full Doodle here.
        // But maybe that won't save much?
        const T0: ITemplate = {
            description: "Getting Started with STEMCstudio",
            files: {},
            dependencies: ['DomReady', 'jasmine'],
            operatorOverloading: false
        };
        T0.files[FILENAME_HTML] = { content: MINIMAL_HTML(), language: LANGUAGE_HTML };
        T0.files['index.ts'] = { content: MINIMAL_BOOTSTRAP(), language: LANGUAGE_TYPE_SCRIPT };
        T0.files['greeting.ts'] = { content: MINIMAL_GREETING(), language: LANGUAGE_TYPE_SCRIPT };
        T0.files['style.css'] = { content: MINIMAL_CSS(), language: LANGUAGE_CSS };
        T0.files['README.md'] = { content: MINIMAL_README(), language: LANGUAGE_MARKDOWN };
        T0.files['tests.html'] = { content: MINIMAL_SPEC_RUNNER_HTML(), language: LANGUAGE_HTML };
        T0.files['tests.ts'] = { content: MINIMAL_SPEC_RUNNER(), language: LANGUAGE_TYPE_SCRIPT };
        T0.files['extend.ts'] = { content: MINIMAL_EXTEND(), language: LANGUAGE_TYPE_SCRIPT };
        T0.files['Vector.ts'] = { content: MINIMAL_VECTOR(), language: LANGUAGE_TYPE_SCRIPT };
        T0.files['Vector.spec.ts'] = { content: MINIMAL_VECTOR_SPEC(), language: LANGUAGE_TYPE_SCRIPT };
        // TODO: The following should trigger the creation of the package.json file.
        // T0.name = "getting-started";
        // T0.version = "0.1.0";

        return [T0];
    }]);
