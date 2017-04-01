import { module } from 'angular';
import { TSLINT_SETTINGS_SERVICE, TSLINT_MODULE } from './constants';
import TsLintSettingsJsonFileService from './services/TsLintSettingsJsonFileService';

//
// How we name this module is not so important because we will
// use the name property in the application. It should, however,
// be reasonably unique. I'm using a reverse-domain convention.
//

/**
 * The module for TypeScript Linting.
 */
const m = module(TSLINT_MODULE, []);

m.service(TSLINT_SETTINGS_SERVICE, TsLintSettingsJsonFileService);

m.config([function () {
    // console.lg(`${m.name}.config(...)`);
}]);

m.run([function () {
    // console.lg(`${m.name}.run(...)`);
}]);

export default m;
