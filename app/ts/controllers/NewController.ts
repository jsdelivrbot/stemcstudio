import app from '../app';
import copyTemplateToWorkspace from '../mappings/copyTemplateToWorkspace';
import ITemplate from '../services/templates/ITemplate';
import IDoodleManager from '../services/doodles/IDoodleManager';
import NewScope from '../scopes/NewScope';
import * as ng from 'angular';
import WsModel from '../wsmodel/services/WsModel';

// TODO: Expose this as a NewController class.
app.controller('new-controller', [
    '$scope',
    '$state',
    'doodles',
    'templates',
    'STATE_DOODLE',
    'wsModel',
    function(
        $scope: NewScope,
        $state: ng.ui.IStateService,
        doodles: IDoodleManager,
        templates: ITemplate[],
        STATE_DOODLE: string,
        wsModel: WsModel
    ) {
        $scope.description = doodles.suggestName();
        $scope.template = templates[0];
        $scope.templates = templates;

        $scope.doOK = function() {
            wsModel.dispose();
            wsModel.recycle();
            copyTemplateToWorkspace($scope.template, wsModel);
            // TODO: Create a new Doodle for Local Storage
            // const doodle = new Doodle(options);
            // doodles.createDoodle($scope.template, $scope.description);
            throw new Error("TODO: NewController.doOK");
            // doodles.updateStorage();
            // $state.go(STATE_DOODLE);
        };

        $scope.doCancel = function() {
            $state.go(STATE_DOODLE);
        };
    }]);
