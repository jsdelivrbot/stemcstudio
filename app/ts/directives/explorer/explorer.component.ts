import { IAttributes, IAugmentedJQuery, IDirective, IDirectivePrePost, INgModelController, ITranscludeFunction } from 'angular';
import controller from './ExplorerController';
import ExplorerScope from './ExplorerScope';
import WsModel from '../../modules/wsmodel/WsModel';

/**
 * interface for the DOM attributes.
 */
interface ExplorerAttributes extends IAttributes {

}

function factory(): IDirective {

    const directive: IDirective = {
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
        compile: function (tElem: IAugmentedJQuery, tAttrs: IAttributes): IDirectivePrePost {
            return {
                /**
                 * The preLink step always takes place from top to bottom in the DOM hierarchy.
                 */
                pre: function ($scope: ExplorerScope, iElem: IAugmentedJQuery, iAttrs: ExplorerAttributes, controller: {}, transclude: ITranscludeFunction) {
                    const ngModel: INgModelController = controller[0];
                    ngModel.$formatters.push(function (modelValue: WsModel) {
                        if (modelValue) {
                            if (modelValue instanceof WsModel) {
                                return modelValue;
                            }
                            else {
                                console.warn("modelvalue is not a WsModel");
                                return {};
                            }
                        }
                        else {
                            return {};
                        }
                    });
                    ngModel.$parsers.push(function (viewValue: WsModel) {
                        ngModel.$setValidity('yadda', true); // We passed the yadda test.
                        return viewValue;
                    });
                    // In Angular 1.3+ we have the $validators pipeline.
                    // We don't need to set validation states because we have an object, not an array.
                    ngModel.$validators['foo'] = function (modelValue: WsModel, viewValue: WsModel): boolean {
                        return true;
                    };
                },
                /**
                 * The postLink step always takes place from bottom to top in the DOM hierarchy.
                 */
                post: function ($scope: ExplorerScope, iElem: IAugmentedJQuery, iAttrs: ExplorerAttributes, controller: {}, transclude: ITranscludeFunction) {
                    const ngModel: INgModelController = controller[0];

                    // $render is the notification that the model has changed and so the view needs to be rendered.
                    // Furthermore, we are being asked to use $viewValue, which has been passed through our formatters.
                    // Recall the formatters return a $viewValue which is a denormalized $modelValue for easy presentation logic (HTML).
                    ngModel.$render = function () {
                        $scope.workspace = <WsModel>ngModel.$viewValue;
                    };

                    // When the transclude property is true, we get access to the fifth parameter of the link function.
                    if (transclude) {
                        transclude(function (clonedElement: JQuery) {
                            // const text: string = clonedElement.text()
                            // We might set this value on say an editor.
                        });
                    }
                }
            };
        }
    };
    return directive;
}

factory.$inject = [];

export default factory;
