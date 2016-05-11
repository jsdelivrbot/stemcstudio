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
    instant(translationId: string, interpolateParams?: any, interpolationId?: string, forceLanguage?: boolean): string {
        if (translationId === 'APP_NAME') {
            return 'STEMCstudio';
        }
        else {
            return translationId;
        }
    }

    /**
     * 
     */
    uses(langKey: string): void {
        // TODO
    }
}