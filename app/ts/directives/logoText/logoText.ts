import { IDirective } from 'angular';

/**
 * Directive Definition Factory
 * Usage <logo-text version='{{version}}'>
 */
export default function (): IDirective {
    return {
        restrict: 'E',
        scope: { version: '@' },
        template: [
            "<span class='md-logo-text-stem'>STEM</span>",
            "<span class='md-logo-text-math'>C</span>",
            "<span class='md-logo-text-studio'>studio</span>",
            "<span class='md-logo-text-domain'>.com</span>",
            "<span class='md-logo-text-version'><sup>{{version}}</sup></span>"].join('')
    };
}
