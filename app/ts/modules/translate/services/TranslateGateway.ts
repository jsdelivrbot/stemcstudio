import * as angular from 'angular';
import { ITranslateGateway } from '../api';

interface TranslationResponse {
    translation: string;
}

/**
 *
 */
export default class TranslateGateway implements ITranslateGateway {

    /**
     * 
     */
    constructor(private $http: ng.IHttpService, private $q: angular.IQService, private path: string) {
        // We can receive arguments from the provider.
        // We don't use $inject because the provider does it for us.
    }

    /**
     * Translates the input string asynchronously from
     * the sourceLanguage (static) to the targetLanguage (dynamic).
     */
    translate(input: string): angular.IPromise<string> {
        const d = this.$q.defer<string>();
        this.$http.get<TranslationResponse>(`/${this.path}/${input}`)
            .then(function (promiseValue) {
                const translationResponse = promiseValue.data;
                if (translationResponse) {
                    d.resolve(translationResponse.translation);
                }
                else {
                    d.reject(new Error("translation is not available"));
                }
            })
            .catch(function (reason: { data: string; status: number; statusText: string }) {
                switch (reason.status) {
                    case 404: {
                        d.reject(new Error(`The translation of '${input}' could not be found.`));
                        break;
                    }
                    default: {
                        d.reject(new Error(reason.statusText));
                    }
                }
            });
        return d.promise;
    }
}
