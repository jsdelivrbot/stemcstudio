import app from '../app';
import Doodle from '../services/doodles/Doodle';
import IDoodleManager from '../services/doodles/IDoodleManager';
import OpenScope from '../scopes/OpenScope';

app.controller('open-controller', [
    '$scope',
    '$state',
    'doodles',
    'STATE_DOODLE',
    function(
        $scope: OpenScope,
        $state: angular.ui.IStateService,
        doodles: IDoodleManager,
        STATE_DOODLE: string
    ) {

        $scope.doOpen = function(doodle: Doodle) {
            doodles.makeCurrent(doodle);
            $state.go(STATE_DOODLE);
        }

        $scope.doDelete = function(doodle: Doodle) {
            doodles.deleteDoodle(doodle);
        }

        $scope.doClose = function() {
            $state.go(STATE_DOODLE);
        };

    }]);
