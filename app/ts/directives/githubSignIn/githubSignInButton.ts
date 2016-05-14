import * as ng from 'angular';
import GitHubSignInScope from './GitHubSignInScope';

/**
 * Directive Definition Factory
 * Usage <google-sign-in-button button-id="uniqueid" options="options"></google-sign-in-button>
 */
export default function(): ng.IDirective {
    // const lines: string[] = [];
    // lines.push("<div class='login-provider-button'>");
    // lines.push("</div>")
    // const template = lines.join('');
    return {
        scope: {
            buttonId: '@',
            options: '&'
        },
        template: `<div class='login-provider-button'></div>`,
        link: function(scope: GitHubSignInScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) {
            const div = element.find('div')[0];
            div.id = attrs['buttonId'];
        }
    };
}
