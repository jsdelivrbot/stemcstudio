import * as angular from 'angular';

/**
 * Mixin when using the TranslateController.
 */
interface TranslateScope extends angular.IScope {
    changeLanguage(langKey: string): void;
}

export default TranslateScope;
