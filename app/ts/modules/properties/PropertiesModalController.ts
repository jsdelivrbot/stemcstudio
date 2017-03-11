import * as uib from 'angular-bootstrap';
import isBoolean from '../../utils/isBoolean';
import isString from '../../utils/isString';
import IOption from '../../services/options/IOption';
import IOptionManager from '../../services/options/IOptionManager';
import PropertiesModalScope from './PropertiesModalScope';
import PropertiesSettings from './PropertiesSettings';

export default class PropertiesModalController {
    public static $inject: string[] = [
        '$scope',
        '$uibModalInstance',
        'options',
        'pkgInfo'];
    constructor(
        $scope: PropertiesModalScope,
        $uibModalInstance: uib.IModalServiceInstance,
        options: IOptionManager,
        pkgInfo: PropertiesSettings) {

        $scope.f = {
            n: isString(pkgInfo.name) ? pkgInfo.name : "",
            v: isString(pkgInfo.version) ? pkgInfo.version : "",
            noLoopCheck: isBoolean(pkgInfo.noLoopCheck) ? pkgInfo.noLoopCheck : false,
            o: isBoolean(pkgInfo.operatorOverloading) ? pkgInfo.operatorOverloading : false,
            dependencies: pkgInfo.dependencies
        };
        $scope.options = options.filter(function (option: IOption) { return option.visible; });

        /**
         * This method changes the scope.dependencies array.
         * It is therefore essential that this array is a copy
         * of the dependencies of the doodle in order for the
         * Cancel processing to work correctly.
         */
        $scope.toggleDependency = function (packageName: string) {
            const idx = $scope.f.dependencies.indexOf(packageName);
            if (idx > -1) {
                $scope.f.dependencies.splice(idx, 1);
            }
            else {
                $scope.f.dependencies.push(packageName);
            }
        };

        $scope.ok = function () {
            pkgInfo.name = $scope.f.n;
            pkgInfo.version = $scope.f.v;
            pkgInfo.noLoopCheck = $scope.f.noLoopCheck;
            pkgInfo.operatorOverloading = $scope.f.o;
            pkgInfo.dependencies = $scope.f.dependencies.filter(function (packageName) { return options.filter(function (option) { return option.visible && option.packageName === packageName; }).length > 0; });

            $uibModalInstance.close(pkgInfo);
        };
        $scope.cancel = function () {
            // Important that this string be consistent with workflow.
            $uibModalInstance.dismiss('cancel click');
        };
    }
    $onInit(): void {
        // This IS called.
    }
    $onDestroy(): void {
        // This is NOT called. Don't know why.
        console.warn("PropertiesModalController.$onDestroy");
    }
}
