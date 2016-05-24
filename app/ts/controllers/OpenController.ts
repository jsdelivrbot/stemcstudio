import AbstractPageController from './AbstractPageController';
import Doodle from '../services/doodles/Doodle';
import IDoodleManager from '../services/doodles/IDoodleManager';
import IGitHubAuthManager from '../services/gham/IGitHubAuthManager';
import OpenScope from '../scopes/OpenScope';
import ModalDialog from '../services/modalService/ModalDialog';

/**
 * @class OpenController
 * @extends AbstractPageController
 */
export default class OpenController extends AbstractPageController {
    public static $inject: string[] = [
        '$scope',
        '$state',
        '$window',
        'doodles',
        'GitHubAuthManager',
        'ga',
        'modalDialog',
        'STATE_DOODLE',
        'STATE_GIST',
        'UNIVERSAL_ANALYTICS_TRACKING_ID',
    ];
    constructor(
        $scope: OpenScope,
        $state: angular.ui.IStateService,
        $window: angular.IWindowService,
        doodles: IDoodleManager,
        authManager: IGitHubAuthManager,
        ga: UniversalAnalytics.ga,
        modalDialog: ModalDialog,
        STATE_DOODLE: string,
        STATE_GIST: string,
        UNIVERSAL_ANALYTICS_TRACKING_ID: string
    ) {
        super($scope, $state, $window, authManager, ga, modalDialog, UNIVERSAL_ANALYTICS_TRACKING_ID, 'auto');

        $scope.doodles = function() {
            return doodles.filter(function() { return true; });
        };

        $scope.doOpen = (doodle: Doodle) => {
            // We know that the Doodle is in Local Storage, but we can avoid
            // a state change by going to the correct state the first time.
            doodles.makeCurrent(doodle);
            if (doodle.gistId) {
                this.navigateTo(STATE_GIST, { gistId: doodle.gistId });
            }
            else {
                this.navigateTo(STATE_DOODLE);
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
            $state.go(STATE_DOODLE);
        };
    }
}
