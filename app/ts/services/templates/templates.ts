import app from '../../app';
import Doodle from '../doodles/Doodle';
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

/**
 * The `templates` service provides starting point doodles.
 * A template is essentially a doodle that is copied.
 */
app.factory('templates', [
    '$location',
    'options',
    'CODE_MARKER',
    'LIBS_MARKER',
    'STYLE_MARKER',
    'SCRIPTS_MARKER',
    'FILENAME_HTML',
    'FILENAME_CODE',
    'FILENAME_LIBS',
    'FILENAME_LESS',
    function(
        $location: angular.ILocationService,
        options: IOptionManager,
        CODE_MARKER: string,
        LIBS_MARKER: string,
        STYLE_MARKER: string,
        SCRIPTS_MARKER: string,
        FILENAME_HTML: string,
        FILENAME_CODE: string,
        FILENAME_LIBS: string,
        FILENAME_LESS: string
    ): ITemplate[] {

        // We really don't need a full Doodle here.
        // But maybe that won't save much?
        const T0: Doodle = new Doodle(options);
        T0.files = {};
        T0.newFile(FILENAME_HTML).content = MINIMAL_HTML();
        T0.newFile('index.ts').content = MINIMAL_BOOTSTRAP();
        T0.newFile('greeting.ts').content = MINIMAL_GREETING();
        T0.newFile('style.css').content = MINIMAL_CSS();
        T0.newFile('README.md').content = MINIMAL_README();
        T0.newFile('tests.html').content = MINIMAL_SPEC_RUNNER_HTML();
        T0.newFile('tests.ts').content = MINIMAL_SPEC_RUNNER();
        T0.newFile('extend.ts').content = MINIMAL_EXTEND();
        T0.newFile('Vector.ts').content = MINIMAL_VECTOR();
        T0.newFile('Vector.spec.ts').content = MINIMAL_VECTOR_SPEC();
        // The following should trigger the creation of the package.json file.
        T0.name = "getting-started";
        T0.version = "0.1.0";
        T0.description = "Getting Started with STEMCstudio";
        T0.dependencies = ['DomReady', 'jasmine'];
        T0.operatorOverloading = false;

        return [T0];
    }]);
