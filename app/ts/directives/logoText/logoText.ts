import { IDirective } from 'angular';

/**
 * This directive is used on the home page and dialog titles.
 * Directive Definition Factory
 * Usage <logo-text version='{{version}}'>
 */
export function logoText(): IDirective {
    return {
        restrict: 'E',
        scope: {
            version: '@'
        },
        template: [
            "<span class='md-logo-text-stem'>STEM</span>",
            "<span class='md-logo-text-math'>C</span>",
            "<span class='md-logo-text-studio'>studio</span>",
            "<span class='md-logo-text-domain'>.com</span>",
            "<span class='md-logo-text-version'><sup>{{version}}</sup></span>"].join('')
    };
}
