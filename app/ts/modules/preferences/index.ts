import * as angular from 'angular';

import {PREFERENCES_MANAGER, PREFERENCES_MODULE} from './constants';
import PreferencesManagerService from './services/PreferencesManagerService';

//
// How we name this module is not so important because we will
// use the name property in the application. It should, however,
// be reasonably unique. I'm using a reverse-domain convention.
//
const m: angular.IModule = angular.module(PREFERENCES_MODULE, []);

m.service(PREFERENCES_MANAGER, PreferencesManagerService);

m.config([function () {
    // console.log(`${m.name}.config(...)`);
}]);

m.run([function () {
    // console.log(`${m.name}.run(...)`);
}]);

export default m;
