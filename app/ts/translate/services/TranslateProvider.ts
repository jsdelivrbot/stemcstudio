import ITranslateProvider from '../ITranslateProvider';
import ITranslationTable from '../ITranslationTable';
import TranslateService from './TranslateService';

/**
 * Using a provider allows us to externally configure a service.
 */
export default class TranslateProvider implements ITranslateProvider {
    public $inject: string[] = [];
    private _preferredLanguage: string;
    constructor() {
        // Don't inject here!
    }

    get preferredLanguage(): string {
        return this._preferredLanguage;
    }

    set preferredLanguage(preferredLanguage) {
        this._preferredLanguage = preferredLanguage;
    }

    translations(key: string, translationTable: ITranslationTable): ITranslateProvider {
        return this;
    }

    useLocalStorage(): void {
        // Enables the use of local storage.
    }


    /**
     * IServiceProvider.$get returns an instance of the service.
     */
    $get() {
        return new TranslateService();
    }
}
