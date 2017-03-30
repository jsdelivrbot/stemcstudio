import { ITranslateGateway } from '../api';
import { ITranslateService } from '../api';

/**
 *
 */
export default class TranslateService implements ITranslateService {

    private directivePriority_ = 0;
    private readonly sourceLanguage_: string;
    private targetLanguage_ = 'de';

    /**
     * 
     */
    constructor(private $q: ng.IQService, private translateGateway: ITranslateGateway, sourceLanguage: string) {
        // We can receive arguments from the provider.
        // We don't use $inject because the provider does it for us.
        this.sourceLanguage_ = sourceLanguage;
    }

    get directivePriority(): number {
        return this.directivePriority_;
    }

    set directivePriority(directivePriority: number) {
        this.directivePriority_ = directivePriority;
    }

    isKeepContent(): boolean {
        return true;
    }

    isPostCompilingEnabled(): boolean {
        return true;
    }

    /**
     * Translates the input string asynchronously from
     * the sourceLanguage (static) to the targetLanguage (dynamic).
     */
    translate(input: string): ng.IPromise<string> {
        const deferred = this.$q.defer<string>();

        // TODO: Before going directly to the gateway, we will be checking a local cache.

        this.translateGateway.translate(input)
            .then(function (translation) {
                deferred.resolve(translation);
            })
            .catch(function (reason) {
                deferred.reject(new Error(`I'm sorry Dave, I'm afraid I cannot translate '${input}' because ${reason}.`));
            });

        return deferred.promise;
    }

    /**
     * 
     */
    uses(targetLanguage: string): void {
        this.targetLanguage_ = targetLanguage;
    }
}
