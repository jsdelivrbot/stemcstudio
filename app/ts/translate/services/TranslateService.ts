import ITranslateService from '../ITranslateService';

/**
 * 
 */
export default class TranslateService implements ITranslateService {
    public $inject: string[] = [];

    /**
     * 
     */
    constructor() {
        // We can receive arguments from the provider.
    }

    /**
     * 
     */
    instant(translationId: string /*, interpolateParams?: any, interpolationId?: string, forceLanguage?: boolean */): string {
        // Just a few to prove that it all works.
        if (translationId === 'APP_NAME') {
            return 'STEMCstudio';
        }
        else if (translationId === 'SEARCH') {
            return 'Search';
        }
        else {
            return translationId;
        }
    }

    /**
     * 
     */
    uses(/* langKey: string */): void {
        // TODO
    }
}
