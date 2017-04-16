import { IHttpService, IQService } from 'angular';
import { ITranslateGatewayProvider, ITranslateGateway, ITranslationTable } from '../api';
import TranslateGateway from './TranslateGateway';

/**
 * Using a provider allows us to externally configure a service.
 */
export default class TranslateGatewayProvider implements ITranslateGatewayProvider {
    public $inject: string[] = [];
    /**
     * The REST path on the server for GET requests.
     */
    private path_: string;
    /**
     * 
     */
    constructor() {
        // Don't inject here!
    }

    get path(): string {
        return this.path_;
    }

    set path(path: string) {
        this.path_ = path;
    }

    translations(key: string, translationTable: ITranslationTable): ITranslateGatewayProvider {
        return this;
    }

    useLocalStorage(): void {
        // Enables the use of local storage.
    }

    /**
     * IServiceProvider.$get returns an instance of the service.
     * We use a fat arrow to bind this correctly.
     */
    $get = ['$http', '$q', ($http: IHttpService, $q: IQService): ITranslateGateway => {
        return new TranslateGateway($http, $q, this.path_);
    }];
}
