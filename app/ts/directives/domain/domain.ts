import { IDirective } from 'angular';
/**
 * Directive Definition Factory
 * Usage <logo-text version='{{version}}'>
 * TODO: Almost certainly DEAD CODE?
 */
export default function (): IDirective {
    return {
        restrict: 'E',
        scope: { version: '@' },
        template: [
            "<brand />",
            "<span class='md-logo-text-stem'>ts</span>",
            "<span class='md-logo-text-math'>Code</span>",
            "<span class='md-logo-text-studio'>Hub</span>",
            "<span class='md-logo-text-domain'>.com</span>",
            "<span class='md-logo-text-version'><sup>{{version}}</sup></span>"].join('')
    };
}
