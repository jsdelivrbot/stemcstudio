import * as angular from 'angular';
import * as uib from 'angular-bootstrap';
import Category from './Category';
import Book from './Book';
import Chapter from './Chapter';
import Topic from './Topic';
import LabelModalScope from './LabelModalScope';
import LabelSettings from './LabelSettings';
import mathematics from './mathematics/category';
import physics from './physics/category';
import compsci from './compsci/category';

export default class LabelModalController {
    public static $inject: string[] = ['$scope', '$uibModalInstance', 'options'];
    constructor($scope: LabelModalScope, $uibModalInstance: uib.IModalServiceInstance, options: LabelSettings) {

        $scope.f = {
            t: angular.isString(options.title) ? options.title : "",
            a: angular.isString(options.author) ? options.author : "",
            k: angular.isArray(options.keywords) ? options.keywords.join(', ') : ""
        };

        $scope.ok = function() {
            options.title = $scope.f.t;
            options.author = $scope.f.a;
            options.keywords = $scope.f.k.split(',').map(function(s) { return s.trim(); });
            $uibModalInstance.close(options);
        };
        $scope.cancel = function() {
            // Important that this string be consistent with workflow.
            $uibModalInstance.dismiss('cancel click');
        };

        $scope.levels = [
            {
                value: 10,
                name: 'Graduate'
            },
            {
                value: 7,
                name: 'Undergraduate'
            },
            {
                value: 4,
                name: 'High School'
            },
            {
                value: 1,
                name: 'Middle School'
            }
        ];
    }
    $onInit(): void {
        // This IS called.
    }
    $onDestroy(): void {
        // This is NOT called. Don't know why.
        console.warn("LabelModalController.$onDestroy");
    }
}