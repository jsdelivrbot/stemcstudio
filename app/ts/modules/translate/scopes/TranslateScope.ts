import { IScope } from 'angular';
/**
 * Mixin when using the TranslateController.
 */
interface TranslateScope extends IScope {
    changeLanguage(langKey: string): void;
    preText: string;
    postText: string;
}

export default TranslateScope;
