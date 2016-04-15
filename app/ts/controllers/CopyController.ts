import app from '../app';
import CopyScope from '../scopes/CopyScope';
import IDoodleManager from '../services/doodles/IDoodleManager';

app.controller('copy-controller', [
    '$scope',
    '$state',
    'doodles',
    'STATE_DOODLE',
    function(
        $scope: CopyScope,
        $state: angular.ui.IStateService,
        doodles: IDoodleManager,
        STATE_DOODLE: string
    ) {

        $scope.description = doodles.suggestName();
        $scope.template = doodles.current();

        $scope.doOK = function() {
            doodles.createDoodle($scope.template, $scope.description);
            doodles.updateStorage();
            $state.go(STATE_DOODLE);
        };

        $scope.doCancel = function() {
            $state.go(STATE_DOODLE);
        };

    }]);
