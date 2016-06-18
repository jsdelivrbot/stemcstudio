import BodyScope from '../scopes/BodyScope';
import NavigationService from '../modules/navigation/NavigationService';

/**
 * The controller for the <body> tag.
 * The controller is referred to as 'body-controller' in layout.jade.
 */
export default class BodyController {
    public static $inject: string[] = ['$scope', 'navigation'];
    constructor(private $scope: BodyScope, navigation: NavigationService) {

        $scope.goHome = (label?: string, value?: number) => {
            navigation.gotoHome(label, value).then(function(promiseValue: any) {
                // console.lg(`gotoHome() completed.`);
            }).catch(function(reason: any) {
                console.warn(`gotoHome() failed: ${JSON.stringify(reason, null, 2)}`);
            });
        };

    }

    $onInit() {
        // This method IS called when the application loads.
    }

    $onDestroy() {
        // I don't think that this method is called.
        console.warn("BodyController.$onDestroy()");
    }
}
