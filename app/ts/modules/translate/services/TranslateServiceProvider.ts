import { ITranslateServiceProvider, ITranslateService, ITranslationTable } from '../api';
import { ITranslateGateway, TRANSLATE_GATEWAY_UUID } from '../api';
import TranslateService from './TranslateService';

/**
 * Using a provider allows us to externally configure a service.
 */
export default class TranslateServiceProvider implements ITranslateServiceProvider {
    public $inject: string[] = [];
    /**
     * The language from which we translate.
     */
    private sourceLanguage_: string;
    /**
     * 
     */
    constructor() {
        // Don't inject here!
    }

    get sourceLanguage(): string {
        return this.sourceLanguage_;
    }

    set sourceLanguage(sourceLanguage: string) {
        this.sourceLanguage_ = sourceLanguage;
    }

    translations(key: string, translationTable: ITranslationTable): ITranslateServiceProvider {
        console.log(`translations() ${key} => ${JSON.stringify(translationTable, null, 2)}`);
        return this;
    }

    useLocalStorage(): void {
        // Enables the use of local storage.
    }

    /**
     * IServiceProvider.$get returns an instance of the service.
     * We use a fat arrow to bind this correctly.
     */
    $get = ['$q', TRANSLATE_GATEWAY_UUID, ($q: angular.IQService, translateGateway: ITranslateGateway): ITranslateService => {
        return new TranslateService($q, translateGateway, this.sourceLanguage_);
    }];
}
