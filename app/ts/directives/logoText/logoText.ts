import { IDirective } from 'angular';

/**
 * This directive is used on the home page and dialog titles.
 * Directive Definition Factory
 * Usage <logo-text version='{{version}}'>
 */
export default function (): IDirective {
    return {
        restrict: 'E',
        scope: { version: '@' },
        template: [
            "<span class='md-logo-text-stem'>ts</span>",
            "<span class='md-logo-text-math'>Code</span>",
            "<span class='md-logo-text-studio'>Hub</span>",
            "<span class='md-logo-text-domain'>.com</span>",
            "<span class='md-logo-text-version'><sup>{{version}}</sup></span>"].join('')
    };
}
