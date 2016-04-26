import app from '../app';
import Doodle from '../services/doodles/Doodle';
import IDoodleManager from '../services/doodles/IDoodleManager';
import NewScope from '../scopes/NewScope';
import * as ng from 'angular';

app.controller('new-controller', [
    '$scope',
    '$state',
    'doodles',
    'templates',
    'STATE_DOODLE',
    function(
        $scope: NewScope,
        $state: ng.ui.IStateService,
        doodles: IDoodleManager,
        templates: Doodle[],
        STATE_DOODLE: string
    ) {

        $scope.description = doodles.suggestName();
        $scope.template = templates[0];
        $scope.templates = templates;

        $scope.doOK = function() {
            doodles.createDoodle($scope.template, $scope.description);
            doodles.updateStorage();
            $state.go(STATE_DOODLE);
        };

        $scope.doCancel = function() {
            $state.go(STATE_DOODLE);
        };

    }]);
