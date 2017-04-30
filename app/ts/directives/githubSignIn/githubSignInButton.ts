import { IAttributes, IAugmentedJQuery, IDirective } from 'angular';
import GitHubSignInScope from './GitHubSignInScope';

/**
 * Directive Definition Factory
 * Usage <github-sign-in-button button-id="uniqueid" options="options"></google-sign-in-button>
 */
export function githubSignInButton(): IDirective {
    return {
        scope: {
            buttonId: '@',
            options: '&'
        },
        template: `<div class='login-provider-button'></div>`,
        link: function (scope: GitHubSignInScope, element: IAugmentedJQuery, attrs: IAttributes) {
            const div = element.find('div')[0];
            div.id = attrs['buttonId'];
        }
    };
}
