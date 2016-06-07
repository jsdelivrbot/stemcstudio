interface ITranslateService {
    instant(translationId: string, interpolateParams?: any, interpolationId?: string, forceLanguage?: boolean): string;
    uses(langKey: string): void;
}

export default ITranslateService;
