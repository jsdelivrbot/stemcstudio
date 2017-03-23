import * as angular from 'angular';

/**
 * Mixin when using the TranslateController.
 */
interface TranslateScope extends angular.IScope {
    changeLanguage(langKey: string): void;
    preText: string;
    postText: string;
}

export default TranslateScope;
