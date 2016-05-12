import * as ng from 'angular';
import GoogleSignInScope from './GoogleSignInScope';

/**
 * Directive Definition Factory
 * Usage <google-sign-in-button button-id="uniqueid" options="options"></google-sign-in-button>
 */
export default function(): ng.IDirective {
    return {
        scope: {
            buttonId: '@',
            options: '&'
        },
        template: '<div></div>',
        link: function(scope: GoogleSignInScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) {
            const div = element.find('div')[0];
            div.id = attrs['buttonId'];
            gapi.signin2.render(div.id, scope.options());
        }
    };
}
