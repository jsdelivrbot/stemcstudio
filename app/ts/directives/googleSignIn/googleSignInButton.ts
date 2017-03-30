import GoogleSignInScope from './GoogleSignInScope';

/**
 * Directive Definition Factory
 * Usage <google-sign-in-button button-id="uniqueid" options="options"></google-sign-in-button>
 */
export default function (): ng.IDirective {
    return {
        scope: {
            /**
             * The button-id property sets the id property on the created div element.
             */
            buttonId: '@',
            options: '&'
        },
        template: '<div></div>',
        link: function ($scope: GoogleSignInScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) {
            const div = <HTMLDivElement>element.find('div')[0];
            div.id = attrs['buttonId'];
            gapi.signin2.render(div.id, $scope.options());

            function onDestroyScope() {
                // console.lg("The Google Button $scope is going away...");
            }

            $scope.$on('$destroy', onDestroyScope);
        }
    };
}
