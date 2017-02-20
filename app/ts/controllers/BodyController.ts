import BodyScope from '../scopes/BodyScope';
import BootstrapDialog from 'bootstrap-dialog';
import GitHubService from '../services/github/GitHubService';
import linkToMap from '../utils/linkToMap';
import NavigationService from '../modules/navigation/NavigationService';

/**
 * The controller for the <body> tag.
 * The controller is referred to as 'body-controller' in layout.jade.
 */
export default class BodyController {
    public static $inject: string[] = ['$scope', 'GitHub', 'navigation'];
    constructor($scope: BodyScope, github: GitHubService, navigation: NavigationService) {

        $scope.goHome = (label?: string, value?: number) => {
            navigation.gotoHome(label, value).then(function () {
                // console.lg(`gotoHome() completed.`);
            }).catch(function (reason: any) {
                console.warn(`gotoHome() failed: ${JSON.stringify(reason, null, 2)}`);
            });
        };

        $scope.clickDownload = function (label?: string, value?: number) {
            ga('send', 'event', 'doodle', 'download', label, value);
            github.getGists().then(function (promiseValue) {
                $scope.gists = promiseValue.data;
                $scope.links = linkToMap(promiseValue.headers('link'));
                navigation.gotoDownload(label, value);
            }).catch(function (reason) {
                BootstrapDialog.show({
                    type: BootstrapDialog.TYPE_DANGER,
                    // FIXME: Why does jQuery get defined globally and does a module import fail?
                    title: $("<h3>Download failed</h3>"),
                    message: `Unable to download Gists. Cause: ${reason} ${status}`,
                    buttons: [{
                        label: "Close",
                        cssClass: 'btn btn-primary',
                        action: function (dialog: IBootstrapDialog) {
                            dialog.close();
                        }
                    }]
                });
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
