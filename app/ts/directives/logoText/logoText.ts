import * as ng from 'angular';

/**
 * Directive Definition Factory
 * Usage <logo-text version='{{version}}'>
 */
export default function(): ng.IDirective {
    return {
        restrict: 'E',
        scope: { version: '@' },
        template: [
            "<span class='md-logo-text-math'>STEM</span>",
            "<span class='md-logo-text-doodle'>studio</span>",
            "<!-- span class='md-logo-text-domain'>.org</span -->",
            "<span class='md-logo-text-version'><sup>{{version}}</sup></span>"].join('')
    };
}
