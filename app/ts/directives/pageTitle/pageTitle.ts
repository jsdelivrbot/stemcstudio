import * as ng from 'angular';

/**
 * Directive Definition Factory
 * Usage <page-title>
 */
export default function(): ng.IDirective {
    return {
        restrict: 'E',
        scope: { title: '@' },
        template: [
            "<span class='md-logo-text-math navbar-brand'>{{ title }}</span>"
        ].join('')
    };
}
