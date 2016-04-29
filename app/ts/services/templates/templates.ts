import app from '../../app';
import Doodle from '../doodles/Doodle';
import ITemplate from './ITemplate';
import IUuidService from '../uuid/IUuidService';

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
    'uuid4',
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
        uuid: IUuidService,
        CODE_MARKER: string,
        LIBS_MARKER: string,
        STYLE_MARKER: string,
        SCRIPTS_MARKER: string,
        FILENAME_HTML: string,
        FILENAME_CODE: string,
        FILENAME_LIBS: string,
        FILENAME_LESS: string
    ): ITemplate[] {

        const T0: Doodle = new Doodle()
        T0.uuid = uuid.generate()
        T0.description = "Application"
        T0.files = {}
        T0.newFile(FILENAME_HTML).content = MINIMAL_HTML()
        T0.newFile('bootstrap.ts').content = MINIMAL_BOOTSTRAP()
        T0.newFile('greeting.ts').content = MINIMAL_GREETING()
        T0.newFile('style.css').content = MINIMAL_CSS()
        T0.newFile('README.md').content = MINIMAL_README()
        T0.newFile('specRunner.html').content = MINIMAL_SPEC_RUNNER_HTML()
        T0.newFile('specRunner.ts').content = MINIMAL_SPEC_RUNNER()
        T0.newFile('extend.ts').content = MINIMAL_EXTEND()
        T0.newFile('Vector.ts').content = MINIMAL_VECTOR()
        T0.newFile('Vector.spec.ts').content = MINIMAL_VECTOR_SPEC()
        T0.dependencies = ['DomReady', 'jasmine']

        return [T0];
    }]);
