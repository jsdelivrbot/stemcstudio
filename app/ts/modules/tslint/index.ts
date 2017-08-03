import { module } from 'angular';
import { TSLINT_SETTINGS_SERVICE, TSLINT_MODULE } from './constants';
import { TsLintSettingsJsonFileService } from './services/TsLintSettingsJsonFileService';

//
// How we name this module is not so important because we will
// use the name property in the application. It should, however,
// be reasonably unique. I'm using a reverse-domain convention.
//

/**
 * The module for TypeScript Linting.
 */
export const tslintModule = module(TSLINT_MODULE, []);

tslintModule.service(TSLINT_SETTINGS_SERVICE, TsLintSettingsJsonFileService);

tslintModule.config([function () {
    // console.lg(`${m.name}.config(...)`);
}]);

tslintModule.run([function () {
    // console.lg(`${m.name}.run(...)`);
}]);
