import * as angular from 'angular';
import app from '../app';
import IDoodleManager from '../services/doodles/IDoodleManager';
import IOption from '../services/options/IOption';
import IOptionManager from '../services/options/IOptionManager';

/**
 * The things that we want to maintain.
 */
interface Zombie {
    description: string;
    dependencies: string[];
    operatorOverloading: boolean;
}

interface PropertiesScope extends angular.IScope {
    zombie: Zombie;
    options: IOption[];
    toggleDependency(name: string);
    doOK: () => void;
    doCancel: () => void;
}

// FIXME: Doing this as a state is causing the doodle-controller to reload.
app.controller('properties-controller', [
    '$scope',
    '$state',
    '$stateParams',
    'doodles',
    'options',
    'STATE_DOODLE',
    function(
        $scope: PropertiesScope,
        $state: angular.ui.IStateService,
        $stateParams: angular.ui.IStateParamsService,
        doodles: IDoodleManager,
        options: IOptionManager,
        STATE_DOODLE: string
    ) {
        const dude = doodles.current()

        // We make a copy of the current doodle so that we can Cancel the modal dialog.
        $scope.zombie = {
            description: dude.description,
            dependencies: dude.dependencies,
            operatorOverloading: dude.operatorOverloading
        }
        $scope.options = options.filter(function(option: IOption) { return option.visible; });

        /**
         * This method changes the scope.dependencies array.
         * It is therefore essential that this array is a copy
         * of the dependencies of the doodle in order for the
         * Cancel processing to work correctly.
         */
        $scope.toggleDependency = function(name: string) {
            const idx = $scope.zombie.dependencies.indexOf(name);
            if (idx > -1) {
                $scope.zombie.dependencies.splice(idx, 1);
            }
            else {
                $scope.zombie.dependencies.push(name);
            }
        }

        $scope.doOK = function() {
            dude.description = $scope.zombie.description;
            // Perform some clanup, while we map dependencies.
            if ($scope.zombie.dependencies) {
                dude.dependencies = $scope.zombie.dependencies.filter(function(name) { return options.filter(function(option) { return option.visible && option.name === name }).length > 0 });
            }
            dude.operatorOverloading = $scope.zombie.operatorOverloading;
            $state.go(STATE_DOODLE);
        };

        $scope.doCancel = function() {
            $state.go(STATE_DOODLE);
        };

    }]);
