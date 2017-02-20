import app from '../app';
import BootstrapDialog from 'bootstrap-dialog';
import DownloadScope from '../scopes/DownloadScope';
import GitHubService from '../services/github/GitHubService';
import linkToMap from '../utils/linkToMap';
import NavigationService from '../modules/navigation/NavigationService';

// The 'rel' values that we understand for Hypermedia links.
const PAGE_F = 'first';
const PAGE_P = 'prev';
const PAGE_N = 'next';
const PAGE_L = 'last';

app.controller('download-controller', [
    '$scope',
    'GitHub',
    'navigation',
    function (
        $scope: DownloadScope,
        github: GitHubService,
        navigation: NavigationService
    ) {

        function isPage(rel: string): boolean {
            return typeof $scope.links[rel] === 'string';
        }

        $scope.isPageF = function (): boolean {
            return isPage(PAGE_F);
        };
        $scope.isPageP = function (): boolean {
            return isPage(PAGE_P);
        };
        $scope.isPageN = function (): boolean {
            return isPage(PAGE_N);
        };
        $scope.isPageL = function (): boolean {
            return isPage(PAGE_L);
        };

        function doPage(rel: string): void {
            if (!isPage(rel)) {
                return;
            }
            const href = $scope.links[rel];
            github.getGistsPage(href)
                .then(function (promiseValue) {
                    const gists = promiseValue.data;
                    const headers = promiseValue.headers;
                    $scope.gists = gists;
                    if (headers('link')) {
                        $scope.links = linkToMap(headers('link'));
                    }
                    else {
                        $scope.links = {};
                    }
                    navigation.gotoDownload();
                })
                .catch(function (reason: any) {
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
        }

        $scope.doPageF = function (): void {
            doPage(PAGE_F);
        };

        $scope.doPageP = function (): void {
            doPage(PAGE_P);
        };

        $scope.doPageL = function (): void {
            doPage(PAGE_L);
        };

        $scope.doPageN = function (): void {
            doPage(PAGE_N);
        };

        $scope.doCancel = function () {
            navigation.gotoDoodle();
        };
    }
]);
