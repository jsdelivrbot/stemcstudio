import BootstrapDialog from 'bootstrap-dialog';
import { DownloadScope } from '../scopes/DownloadScope';
import { GITHUB_GIST_SERVICE_UUID, IGitHubGistService } from '../services/github/IGitHubGistService';
import { NAVIGATION_SERVICE_UUID, INavigationService } from '../modules/navigation/INavigationService';

// The 'rel' values that we understand for Hypermedia links.
const PAGE_F = 'first';
const PAGE_P = 'prev';
const PAGE_N = 'next';
const PAGE_L = 'last';

export class DownloadController {
    public static $inject: string[] = [
        '$scope',
        GITHUB_GIST_SERVICE_UUID,
        NAVIGATION_SERVICE_UUID,
    ];
    constructor(
        $scope: DownloadScope,
        githubGistService: IGitHubGistService,
        navigationService: INavigationService
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
            githubGistService.getGistsPage(href)
                .then(function ({ gists, links }) {
                    $scope.gists = gists;
                    $scope.links = links;
                    navigationService.gotoDownload();
                })
                .catch(function (reason: any) {
                    BootstrapDialog.show({
                        type: BootstrapDialog.TYPE_DANGER,
                        // FIXME: Why does jQuery get defined globally and does a module import fail?
                        title: "Download failed",
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
            navigationService.gotoWork();
        };
    }
    $onInit(): void {
        // This method is called.
    }
    $onDestroy(): void {
        // This will not be called because this is a routing controller.
        console.warn("DownloadController.$onDestroy()");
    }
}
