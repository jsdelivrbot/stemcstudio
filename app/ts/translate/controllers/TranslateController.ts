import TranslateScope from '../scopes/TranslateScope';
import ITranslateService from '../ITranslateService';

export default class TranslateController {
    public static $inject: string[] = [
        '$scope',
        '$translate'
    ];
    constructor(
        $scope: TranslateScope,
        $translate: ITranslateService) {

        $scope.changeLanguage = function(langKey: string) {
            $translate.uses(langKey);
        };
    }
}
