import * as ng from 'angular';

/**
 * Directive Definition Factory
 * Usage <brand />
 */
export default function(): ng.IDirective {
    return {
        restrict: 'E',
        scope: {},
        template: [
            "<span class='md-logo-text-stem'>STEM</span>",
            "<span class='md-logo-text-math'>C</span>",
            "<span class='md-logo-text-studio'>studio</span>"].join('')
    };
}
