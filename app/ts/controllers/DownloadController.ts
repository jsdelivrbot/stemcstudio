import app from '../app';
import ICloud from '../services/cloud/ICloud';
import CookieService from '../services/cookie/CookieService';
import IDoodleManager from '../services/doodles/IDoodleManager';
import DownloadScope from '../scopes/DownloadScope';
import Gist from '../services/github/Gist';
import GitHubService from '../services/github/GitHubService';
import linkToMap from '../utils/linkToMap';

// The 'rel' values that we understand for Hypermedia links.
const PAGE_F = 'first';
const PAGE_P = 'prev';
const PAGE_N = 'next';
const PAGE_L = 'last';

app.controller('download-controller', [
    '$scope',
    '$state',
    'cloud',
    'doodles',
    'cookie',
    'ga',
    'GitHub',
    'GITHUB_TOKEN_COOKIE_NAME',
    'STATE_DOODLE',
    function(
        $scope: DownloadScope,
        $state: angular.ui.IStateService,
        cloud: ICloud,
        doodles: IDoodleManager,
        cookie: CookieService,
        ga: UniversalAnalytics.ga,
        github: GitHubService,
        GITHUB_TOKEN_COOKIE_NAME: string,
        STATE_DOODLE: string
    ) {

        function isPage(rel: string): boolean {
            return typeof $scope.links[rel] === 'string';
        }

        $scope.isPageF = function(): boolean {
            return isPage(PAGE_F);
        }
        $scope.isPageP = function(): boolean {
            return isPage(PAGE_P);
        }
        $scope.isPageN = function(): boolean {
            return isPage(PAGE_N);
        }
        $scope.isPageL = function(): boolean {
            return isPage(PAGE_L);
        }

        function doPage(rel: string): void {
            if (!isPage(rel)) {
                return;
            }
            const href = $scope.links[rel];
            const token = cookie.getItem(GITHUB_TOKEN_COOKIE_NAME);
            github.getGistsPage(token, href, function(err: any, gists: Gist[], status: number, headers, config) {
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
        }

        $scope.doPageF = function(): void {
            doPage(PAGE_F);
        }
        $scope.doPageP = function(): void {
            doPage(PAGE_P);
        }
        $scope.doPageL = function(): void {
            doPage(PAGE_L);
        }
        $scope.doPageN = function(): void {
            doPage(PAGE_N);
        }

        $scope.doCancel = function() {
            $state.go(STATE_DOODLE);
        };

    }
]);
