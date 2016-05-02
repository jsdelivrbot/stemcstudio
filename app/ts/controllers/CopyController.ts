import app from '../app';
import CopyScope from '../scopes/CopyScope';
import IDoodleManager from '../services/doodles/IDoodleManager';
import ITemplate from '../services/templates/ITemplate';

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

        const copySource = doodles.current()

        const template: ITemplate = {
            description: copySource.description,
            files: copySource.files,
            dependencies: copySource.dependencies,
            operatorOverloading: copySource.operatorOverloading
        };

        $scope.template = template;

        $scope.doOK = function() {
            doodles.createDoodle($scope.template, $scope.description);
            doodles.updateStorage();
            $state.go(STATE_DOODLE);
        };

        $scope.doCancel = function() {
            $state.go(STATE_DOODLE);
        };

    }]);
