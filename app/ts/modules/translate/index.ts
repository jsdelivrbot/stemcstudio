import * as angular from 'angular';

import TranslateController from './controllers/TranslateController';
import translateDirective from './directives/translate';
import translateFilter from './filters/translate';
import TranslateGatewayProvider from './services/TranslateGatewayProvider';
import TranslateServiceProvider from './services/TranslateServiceProvider';
import { TRANSLATE_GATEWAY_UUID, TRANSLATE_SERVICE_UUID } from './api';

const translate: angular.IModule = angular.module('translate', []);

// The controller is used for changing the language.
translate.controller('translate-controller', TranslateController);

// The directive provides asynchronous translation.
translate.directive('translate', translateDirective);

// The filter provides only synchronous translation.
translate.filter('translate', translateFilter);

// The service is made available through a provider, but we must register using the service uuid.
translate.provider(TRANSLATE_GATEWAY_UUID, new TranslateGatewayProvider());
translate.provider(TRANSLATE_SERVICE_UUID, new TranslateServiceProvider());

translate.config([function () {
    // console.log(`${translate.name}.config(...)`);
}]);

translate.run([function () {
    // console.log(`${translate.name}.run(...)`);
}]);

export default translate;
