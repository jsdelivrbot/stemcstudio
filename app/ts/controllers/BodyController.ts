import BodyScope from '../scopes/BodyScope';
import BootstrapDialog from 'bootstrap-dialog';
import { GITHUB_SERVICE_UUID, IGitHubService } from '../services/github/IGitHubService';
import linkToMap from '../utils/linkToMap';
import {NAVIGATION_SERVICE_UUID,INavigationService} from '../modules/navigation/INavigationService';
import { ITranslateService, TRANSLATE_SERVICE_UUID } from '../modules/translate/api';

/**
 * The controller for the <body> tag.
 * The controller is referred to as 'body-controller' in layout.jade.
 */
export default class BodyController {
    public static $inject: string[] = ['$scope', GITHUB_SERVICE_UUID, NAVIGATION_SERVICE_UUID, TRANSLATE_SERVICE_UUID];
    constructor($scope: BodyScope, githubService: IGitHubService, navigation: INavigationService, translateService: ITranslateService) {

        $scope.goHome = (label?: string, value?: number) => {
            navigation.gotoHome(label, value)
                .then(function () {
                    // console.lg(`gotoHome() completed.`);
                })
                .catch(function (reason: any) {
                    console.warn(`gotoHome() failed: ${JSON.stringify(reason, null, 2)}`);
                });
        };

        $scope.clickDownload = function (label?: string, value?: number) {
            ga('send', 'event', 'doodle', 'download', label, value);
            githubService.getGists()
                .then(function (promiseValue) {
                    if (promiseValue.data) {
                        $scope.gists = promiseValue.data;
                        if (promiseValue.headers) {
                            $scope.links = linkToMap(promiseValue.headers('link'));
                        }
                        navigation.gotoDownload(label, value);
                    }
                })
                .catch(function (reason) {
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
        // This method is NOT called when the application loads.
    }
}
