import { module } from 'angular';
import TranslateController from './controllers/TranslateController';
import translateDirective from './directives/translate';
import translateFilter from './filters/translate';
import TranslateGatewayProvider from './services/TranslateGatewayProvider';
import TranslateServiceProvider from './services/TranslateServiceProvider';
import { TRANSLATE_GATEWAY_UUID, TRANSLATE_SERVICE_UUID } from './api';

export const translateModule = module('translate', []);

// The controller is used for changing the language.
translateModule.controller('translate-controller', TranslateController);

// The directive provides asynchronous translation.
translateModule.directive('translate', translateDirective);

// The filter provides only synchronous translation.
translateModule.filter('translate', translateFilter);

// The service is made available through a provider, but we must register using the service uuid.
translateModule.provider(TRANSLATE_GATEWAY_UUID, new TranslateGatewayProvider());
translateModule.provider(TRANSLATE_SERVICE_UUID, new TranslateServiceProvider());

translateModule.config([function () {
    // Do nothing.
}]);

translateModule.run([function () {
    // Do nothing.
}]);
