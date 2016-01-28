import app from '../app';
import IDoodle from '../services/doodles/IDoodle';
import IDoodleManager from '../services/doodles/IDoodleManager';
import NewScope from './NewScope';

app.controller('new-controller', [
    '$scope',
    '$state',
    'doodles',
    'templates',
    'STATE_DOODLE',
    function(
        $scope: NewScope,
        $state: angular.ui.IStateService,
        doodles: IDoodleManager,
        templates: IDoodle[],
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
