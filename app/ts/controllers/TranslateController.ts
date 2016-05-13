import TranslateScope from '../scopes/TranslateScope';
import ITranslateService from '../modules/translate/ITranslateService';

export default class TranslateController {
    public static $inject: string[] = [
        '$scope',
        '$translate',
        'FEATURE_I18N_ENABLED'
    ];
    constructor(
        $scope: TranslateScope,
        $translate: ITranslateService,
        FEATURE_I18N_ENABLED: boolean) {

        $scope.FEATURE_I18N_ENABLED = FEATURE_I18N_ENABLED;

        $scope.changeLanguage = function(langKey: string) {
            $translate.uses(langKey);
        };
    }
}
