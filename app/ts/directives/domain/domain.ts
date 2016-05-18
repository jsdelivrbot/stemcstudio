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
            "<brand />",
            "<span class='md-logo-text-stem'>STEMC</span>",
            "<span class='md-logo-text-studio'>studio</span>",
            "<span class='md-logo-text-domain'>.com</span>",
            "<span class='md-logo-text-version'><sup>{{version}}</sup></span>"].join('')
    };
}
