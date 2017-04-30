import { isArray, isString } from 'angular';
import { IModalServiceInstance } from 'angular-bootstrap';
import { LabelModalScope } from './LabelModalScope';
import { LabelSettings } from './LabelSettings';
import { splitStringToKeywords } from './splitStringToKeywords';

export class LabelModalController {
    public static $inject: string[] = ['$scope', '$uibModalInstance', 'options'];
    constructor($scope: LabelModalScope, $uibModalInstance: IModalServiceInstance, options: LabelSettings) {

        $scope.f = {
            t: isString(options.title) ? options.title : "",
            a: isString(options.author) ? options.author : "",
            k: isArray(options.keywords) ? options.keywords.join(', ') : ""
        };

        $scope.ok = function () {
            options.title = $scope.f.t;
            options.author = $scope.f.a;
            options.keywords = splitStringToKeywords(',', $scope.f.k);
            $uibModalInstance.close(options);
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
        console.warn("LabelModalController.$onDestroy");
    }
}
