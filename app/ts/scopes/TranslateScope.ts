import * as angular from 'angular';
import AppScope from './AppScope';

interface TranslateScope extends AppScope {
    changeLanguage(langKey: string): void;
}

export default TranslateScope;
