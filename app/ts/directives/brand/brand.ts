import { IDirective } from 'angular';
/**
 * Directive Definition Factory
 * Usage <brand />
 */
export function brandDirective(): IDirective {
    return {
        restrict: 'E',
        scope: {},
        bindToController: {
            // No binding.
        },
        // Place the template on one line in order to avoid spaces between the parts of the brand name.
        template: "<span class='md-logo-text-stem'>STEM</span><span class='md-logo-text-math'>C</span><span class='md-logo-text-studio'>studio</span>",
        controller: function () {
            // Do nothing.
        },
        // Not being used in this directive.
        controllerAs: 'ctrl'
    };
}
