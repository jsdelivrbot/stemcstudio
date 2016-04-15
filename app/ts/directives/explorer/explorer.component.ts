import * as ng from 'angular';
import controller from './ExplorerController'
import ExplorerScope from './ExplorerScope'
import IExplorerModel from './IExplorerModel'

/**
 * interface for the DOM attributes.
 */
interface ExplorerAttributes extends ng.IAttributes {

}

/**
 * This is private, an implementation detail.
 * The $viewValue is denormalized, so its is an array of stuff.
 */
interface IViewValue extends Array<{ name: string, isOpen: boolean, selected: boolean }> {
}

//
// Using an object literal to build IDirective seems the safest way to leverage the TypeScript compiler.
// At least I get errors if I mis-name a property. If I create a class this is not so.
//
// I'm using a directive rather than a component here so that I have the potential to use the full
// capability of a directive and because the component syntactic suger creates obscurity. Documentation
// that describes the syntactic sugar before the core should be considered a learning anti-pattern!
//
// Usage:
//
// <file-navigator ng-model='some.property'></file-navigator>
//
// The JSON schema for the ng-model ($modelValue) property is currently...
//
// {name: string; isOpen: boolean; selected: boolean}[]
//
// Remark: Since only one file can be selected, this modelValue is already denormalized.
// Ideally, the model would be normalized so that it is easier to maintain. It would
// also be possible to demonstrate the role of $formatters in denormalizing to create
// the $viewValue for the presentation logic.
//
// Remark: I'm using ng-model here knowing that there may be efficiency issues.
// The point is that I want to have ONE model input so that I can evolve to
// having a schema for that model. It also gives me the opportunity to leverage
// the pipeline inherent in using ng-model. In any case, the use of ng-model
// is subject to change as the Best Practice emerges. I may later prefer to use
// DOM attributes as input parameters.
//
// Remark: Creating a view with AngularJS binding is easiest when the viewValue
// is DENORMALIZED (because it avoids loops in the UI code). However, for conceptual
// integrity it is better if the viewModel is normalized.
// This suggests a role for the formatters as denormalizing the
// normalized $modelValue into a denormalized $viewValue.
//
// Remark on terminology: We should start using consistent terms for various patterns.
//
// presentation logic - the code that is embedded in the HTML.
// $viewValue - A representation of the model which is may be denormalized to simplify presentation logic.
// $modelValue - the normalized representation of the model, perhaps the model itself.
//
// Remark: In this directive we won't be directly modifying the model.
// This is reflected in the fact that we never call $setViewValue.
//
// Remark: If the component is not responsible for directly changing the model then
// it becomes stateless (at least only having a $viewValue copy). So it doesn't need a controller.
//

const ddo: ng.IDirective = {
    require: ['ngModel'],
    restrict: 'E',
//  scope: {},
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
            pre: function(scope: ng.IScope, iElem: ng.IAugmentedJQuery, iAttrs: ExplorerAttributes, controller: {}, transclude: ng.ITranscludeFunction) {
                const ngModel: ng.INgModelController = controller[0]
                ngModel.$formatters.push(function(modelValue: IExplorerModel) {
                    if (modelValue) {
                        const viewValue: IViewValue = []
                        const names = Object.keys(modelValue)
                        const iLen = names.length
                        for (let i = 0; i < iLen; i++) {
                            const name = names[i]
                            const file = modelValue[name]
                            viewValue.push({ name, isOpen: file.isOpen, selected: file.selected })
                        }
                        // It's a transformation, so we return a viewValue.
                        return viewValue
                    }
                    else {
                        return []
                    }
                })
                ngModel.$parsers.push(function(viewValue: IViewValue) {
                    ngModel.$setValidity('yadda', true)  // We passed the yadda test.
                    return viewValue
                })
                // In Angular 1.3+ we have the $validators pipeline.
                // We don't need to set validation states because we have an object, not an array.
                ngModel.$validators['foo'] = function(modelValue: IExplorerModel, viewValue: IViewValue): boolean {
                    return true
                }
            },
            /**
             * The postLink step always takes place from bottom to top in the DOM hierarchy.
             */
            post: function($scope: ExplorerScope, iElem: ng.IAugmentedJQuery, iAttrs: ExplorerAttributes, controller: {}, transclude: ng.ITranscludeFunction) {
                const ngModel: ng.INgModelController = controller[0]

                // $render is the notification that the model has changed and so the view needs to be rendered.
                // Furthermore, we are being asked to use $viewValue, which has been passed through our formatters.
                // Recall the formatters return a $viewValue which is a denormalized $modelValue for easy presentation logic (HTML).
                ngModel.$render = function() {
                    $scope.files = <IViewValue>ngModel.$viewValue;
                }

                // When the transclude property is true, we get access to the fifth parameter of the link function.
                if (transclude) {
                    transclude(function(clonedElement: JQuery) {
                        // const text: string = clonedElement.text()
                        // We might set this value on say an editor.
                    });
                }
            }
        }
    }
}

export default function() { return ddo }
