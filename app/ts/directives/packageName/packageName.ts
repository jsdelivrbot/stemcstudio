import { IAttributes, IAugmentedJQuery, IDirective, INgModelController } from 'angular';
import { validate } from '../../utils/validateNpmPackageName';

/**
 * Directive Definition Factory
 * Usage <package-name>
 */
export function packageName(): IDirective {
    // Requires an isolated model.
    return {
        // Restrict to an attribute type.
        restrict: 'A',
        // Element must have an ng-model attribute.
        require: 'ngModel',
        link: function (scope, element: IAugmentedJQuery, attr: IAttributes, ctrl: INgModelController) {

            // We have two ways of doing this, $parsers or $validators.
            ctrl.$parsers.unshift(function (value: string) {
                if (value) {
                    // 
                    ctrl.$setValidity('invalidWhatever', true);
                }

                // If it's valid, return the value to the model, otherwise return undefined.
                return value;
            });

            ctrl.$validators.packageName = function (modelValue: string, viewValue: string) {
                if (ctrl.$isEmpty(modelValue)) {
                    // consider empty models to be valid
                    return true;
                }

                const report = validate(viewValue);
                if (report.validForNewPackages && report.validForOldPackages) {
                    // The NPM package name is valid.
                    return true;
                }
                else {
                    // Is it possible to get the errors and warning back to the user?
                    console.warn(`${JSON.stringify(report, null, 2)}`);
                    // The NPM package name is invalid.
                    return false;
                }
            };
        }
    };
}
