import * as angular from 'angular';
import ITranslationTable from './ITranslationTable';

interface ITranslateProvider extends angular.IServiceProvider {
    preferredLanguage: string;
    translations(key: string, translationTable: ITranslationTable): ITranslateProvider;
    useLocalStorage(): void;
}

export default ITranslateProvider;
