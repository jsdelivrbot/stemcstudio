import app from '../app';
import IDoodleManager from '../services/doodles/IDoodleManager';
import OpenScope from './OpenScope';

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

        $scope.doOpen = function(uuid: string) {
            doodles.makeCurrent(uuid);
            $state.go(STATE_DOODLE);
        }

        $scope.doDelete = function(uuid: string) {
            doodles.deleteDoodle(uuid);
        }

        $scope.doClose = function() {
            $state.go(STATE_DOODLE);
        };

    }]);
