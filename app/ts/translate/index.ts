import * as angular from 'angular';

import TranslateController from './controllers/TranslateController';
import translateFilter from './filters/translate';
import TranslateProvider from './services/TranslateProvider';

const translate: angular.IModule = angular.module('translate', []);

translate.controller('translate-controller', TranslateController);
translate.filter('translate', translateFilter);
translate.provider('$translate', new TranslateProvider());

translate.config([function() {
    // console.lg(`${translate.name}.config(...)`);
}]);

translate.run([function() {
    // console.lg(`${translate.name}.run(...)`);
}]);

export default translate;
