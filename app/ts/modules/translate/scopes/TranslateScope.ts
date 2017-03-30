/**
 * Mixin when using the TranslateController.
 */
interface TranslateScope extends ng.IScope {
    changeLanguage(langKey: string): void;
    preText: string;
    postText: string;
}

export default TranslateScope;
