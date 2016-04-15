import app from '../app';
import BodyScope from '../scopes/BodyScope';
import BootstrapDialog from 'bootstrap-dialog';
import CookieService from '../services/cookie/CookieService';
import IDoodleManager from '../services/doodles/IDoodleManager';
import Gist from '../services/github/Gist';
import GitHubService from '../services/github/GitHubService';
import linkToMap from '../utils/linkToMap';

app.controller('body-controller', [
    '$scope',
    '$state',
    'doodles',
    'ga',
    'GitHub',
    'cookie',
    'GITHUB_TOKEN_COOKIE_NAME',
    function(
        $scope: BodyScope,
        $state: angular.ui.IStateService,
        doodles: IDoodleManager,
        ga: UniversalAnalytics.ga,
        github: GitHubService,
        cookie: CookieService,
        GITHUB_TOKEN_COOKIE_NAME: string
    ) {

        $scope.currentDoodle = function() {
            return doodles.current();
        };

        $scope.doodles = function() {
            return doodles.filter(function() { return true; });
        };

        $scope.clickDownload = function(label?: string, value?: number) {
            ga('send', 'event', 'doodle', 'download', label, value);
            const token = cookie.getItem(GITHUB_TOKEN_COOKIE_NAME);
            github.getGists(token, function(err: any, gists: Gist[], status: number, headers, config) {
                if (!err) {
                    $scope.gists = gists;
                    $scope.links = linkToMap(headers('link'));
                    $state.go('download');
                }
                else {
                    BootstrapDialog.show({
                        type: BootstrapDialog.TYPE_DANGER,
                        // FIXME: Why does jQuery get defined globally and does a module import fail?
                        title: $("<h3>Download failed</h3>"),
                        message: `Unable to download Gists. Cause: ${err} ${status}`,
                        buttons: [{
                            label: "Close",
                            cssClass: 'btn btn-primary',
                            action: function(dialog: IBootstrapDialog) {
                                dialog.close();
                            }
                        }]
                    });
                }
            });
        };

    }
]);
