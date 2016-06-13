import * as ng from 'angular';
import app from '../../../app';
import ITemplate from '../../../services/templates/ITemplate';
import IDoodleManager from '../../../services/doodles/IDoodleManager';
import NewScope from '../../../scopes/NewScope';
import copyTemplateToDoodle from '../../../mappings/copyTemplateToDoodle';

export default class NewController {
    public static $inject: string[] = [
        '$scope',
        '$state',
        'doodles',
        'templates',
        'STATE_DOODLE',
    ];
    constructor(
        $scope: NewScope,
        $state: ng.ui.IStateService,
        doodles: IDoodleManager,
        templates: ITemplate[],
        STATE_DOODLE: string
    ) {
        $scope.description = doodles.suggestName();
        $scope.template = templates[0];
        $scope.templates = templates;

        $scope.doOK = function() {
            const doodle = doodles.createDoodle();
            copyTemplateToDoodle($scope.template, doodle);
            doodles.unshift(doodle);
            doodles.updateStorage();
            $state.go(STATE_DOODLE);
        };

        $scope.doCancel = function() {
            $state.go(STATE_DOODLE);
        };
    }
}
