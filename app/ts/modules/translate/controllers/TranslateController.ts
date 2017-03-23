import TranslateScope from '../scopes/TranslateScope';
import { ITranslateService } from '../api';
import { TRANSLATE_SERVICE_UUID } from '../api';

/**
 * A controller that talks to the translation service, allowing the
 * language to be changed.
 */
export default class TranslateController {
    public static $inject: string[] = ['$scope', TRANSLATE_SERVICE_UUID];

    /**
     *
     */
    constructor($scope: TranslateScope, $translate: ITranslateService) {

        $scope.changeLanguage = function (langKey: string) {
            $translate.uses(langKey);
        };
    }
}
