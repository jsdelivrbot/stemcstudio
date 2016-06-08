import * as ng from 'angular';
import controller from './ExplorerController';
import ExplorerScope from './ExplorerScope';
import WsFile from '../../wsmodel/services/WsFile';
import WsModel from '../../wsmodel/services/WsModel';

/**
 * interface for the DOM attributes.
 */
interface ExplorerAttributes extends ng.IAttributes {

}

interface IViewValue {
    [path: string]: WsFile;
}

const ddo: ng.IDirective = {
    require: ['ngModel'],
    restrict: 'E',
    bindToController: {
    },
    controller,
    controllerAs: '$ctrl',
    templateUrl: 'explorer.html',
    /**
     * The compile step ordering relative to the DOM depends upon whether we transclude.
     */
    compile: function(tElem: ng.IAugmentedJQuery, tAttrs: ng.IAttributes): ng.IDirectivePrePost {
        return {
            /**
             * The preLink step always takes place from top to bottom in the DOM hierarchy.
             */
            pre: function($scope: ExplorerScope, iElem: ng.IAugmentedJQuery, iAttrs: ExplorerAttributes, controller: {}, transclude: ng.ITranscludeFunction) {
                const ngModel: ng.INgModelController = controller[0];
                ngModel.$formatters.push(function(modelvalue: WsModel) {
                    if (modelvalue) {
                        if (modelvalue instanceof WsModel) {
                            const viewValue: IViewValue = {};
                            const paths = modelvalue.files.keys;
                            const iLen = paths.length;
                            for (let i = 0; i < iLen; i++) {
                                const path = paths[i];
                                const file: WsFile = modelvalue.files.getWeakRef(path);
                                viewValue[path] = file;
                            }
                            // It's a transformation, so we return a viewValue.
                            return viewValue;
                        }
                        else {
                            console.warn("modelvalue is not a WsModel");
                            return [];
                        }
                    }
                    else {
                        return [];
                    }
                });
                ngModel.$parsers.push(function(viewValue: IViewValue) {
                    ngModel.$setValidity('yadda', true); // We passed the yadda test.
                    return viewValue;
                });
                // In Angular 1.3+ we have the $validators pipeline.
                // We don't need to set validation states because we have an object, not an array.
                ngModel.$validators['foo'] = function(modelValue: WsModel, viewValue: IViewValue): boolean {
                    return true;
                };
            },
            /**
             * The postLink step always takes place from bottom to top in the DOM hierarchy.
             */
            post: function($scope: ExplorerScope, iElem: ng.IAugmentedJQuery, iAttrs: ExplorerAttributes, controller: {}, transclude: ng.ITranscludeFunction) {
                const ngModel: ng.INgModelController = controller[0];

                // $render is the notification that the model has changed and so the view needs to be rendered.
                // Furthermore, we are being asked to use $viewValue, which has been passed through our formatters.
                // Recall the formatters return a $viewValue which is a denormalized $modelValue for easy presentation logic (HTML).
                ngModel.$render = function() {
                    $scope.filesByPath = <IViewValue>ngModel.$viewValue;
                };

                // When the transclude property is true, we get access to the fifth parameter of the link function.
                if (transclude) {
                    transclude(function(clonedElement: JQuery) {
                        // const text: string = clonedElement.text()
                        // We might set this value on say an editor.
                    });
                }
            }
        };
    }
};

export default function() { return ddo; };
