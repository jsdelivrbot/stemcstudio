import { IDirective } from 'angular';

/**
 * Directive Definition Factory
 * Usage <page-title>
 */
export default function (): IDirective {
    return {
        restrict: 'E',
        scope: { title: '@' },
        template: [
            "<span class='md-logo-text-math navbar-brand'>{{ title }}</span>"
        ].join('')
    };
}
