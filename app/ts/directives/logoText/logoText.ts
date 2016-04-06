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
            "<span class='md-logo-text-math'>math</span>",
            "<span class='md-logo-text-doodle'>doodle</span>",
            "<span class='md-logo-text-domain'>.io</span>",
            "<span class='md-logo-text-version'><sup>Alpha&nbsp;{{version}}</sup></span>"].join('')
    };
}
