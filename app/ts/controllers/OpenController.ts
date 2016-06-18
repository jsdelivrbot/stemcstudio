import AbstractPageController from './AbstractPageController';
import Doodle from '../services/doodles/Doodle';
import IDoodleManager from '../services/doodles/IDoodleManager';
import IGitHubAuthManager from '../services/gham/IGitHubAuthManager';
import OpenScope from '../scopes/OpenScope';
import ModalDialog from '../services/modalService/ModalDialog';
import NavigationService from '../modules/navigation/NavigationService';

/**
 * @class OpenController
 * @extends AbstractPageController
 */
export default class OpenController extends AbstractPageController {
    public static $inject: string[] = [
        '$scope',
        '$window',
        'doodles',
        'GitHubAuthManager',
        'ga',
        'modalDialog',
        'navigation',
        'UNIVERSAL_ANALYTICS_TRACKING_ID'
    ];
    constructor(
        $scope: OpenScope,
        $window: angular.IWindowService,
        doodles: IDoodleManager,
        authManager: IGitHubAuthManager,
        ga: UniversalAnalytics.ga,
        modalDialog: ModalDialog,
        navigation: NavigationService,
        UNIVERSAL_ANALYTICS_TRACKING_ID: string
    ) {
        super($scope, $window, authManager, ga, modalDialog, UNIVERSAL_ANALYTICS_TRACKING_ID, 'auto');

        $scope.doodles = function() {
            return doodles.filter(function() { return true; });
        };

        /**
         * DRY: I feel like I've seen this before somewhere.
         */
        $scope.doOpen = (doodle: Doodle) => {
            // We know that the Doodle is in Local Storage, but we can avoid
            // a state change by going to the correct state the first time.
            doodles.makeCurrent(doodle);
            doodles.updateStorage();
            if (doodle.owner && doodle.repo) {
                navigation.gotoRepo(doodle.owner, doodle.repo);
            }
            else if (doodle.gistId) {
                navigation.gotoGist(doodle.gistId);
            }
            else {
                navigation.gotoDoodle();
            }
        };

        $scope.doDelete = function(doodle: Doodle) {
            // TODO: DRY. This code also exists in the HomeController.
            modalDialog.confirm({ title: 'Delete', message: `Are you sure you want to delete '${doodle.description}' from your Local Storage?` }).then(function(promiseValue) {
                doodles.deleteDoodle(doodle);
                doodles.updateStorage();
            }).catch(function(reason) {
                switch (reason) {
                    case 'cancel click':
                    case 'escape key press': {
                        // Do nothing.
                        break;
                    }
                    default: {
                        console.warn(JSON.stringify(reason, null, 2));
                    }
                }
            });
        };

        $scope.doClose = function() {
            navigation.gotoDoodle();
        };
    }
}
