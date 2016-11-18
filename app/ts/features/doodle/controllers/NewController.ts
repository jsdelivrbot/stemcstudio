import ITemplate from '../../../services/templates/ITemplate';
import IDoodleManager from '../../../services/doodles/IDoodleManager';
import NavigationService from '../../../modules/navigation/NavigationService';
import NewScope from '../../../scopes/NewScope';
import copyTemplateToDoodle from '../../../mappings/copyTemplateToDoodle';

export default class NewController {
    public static $inject: string[] = [
        '$scope',
        'doodles',
        'navigation',
        'templates'
    ];
    constructor(
        $scope: NewScope,
        doodles: IDoodleManager,
        navigation: NavigationService,
        templates: ITemplate[]
    ) {
        $scope.description = doodles.suggestName();
        $scope.template = templates[0];
        $scope.templates = templates;

        $scope.doOK = function () {
            const doodle = doodles.createDoodle();
            copyTemplateToDoodle($scope.template, doodle);
            doodle.description = $scope.description;
            doodles.addHead(doodle);
            doodles.updateStorage();
            navigation.gotoDoodle();
        };

        $scope.doCancel = function () {
            navigation.gotoDoodle();
        };
    }
}
