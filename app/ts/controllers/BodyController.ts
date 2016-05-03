import app from '../app';
import BodyScope from '../scopes/BodyScope';
import BootstrapDialog from 'bootstrap-dialog';
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
    function(
        $scope: BodyScope,
        $state: angular.ui.IStateService,
        doodles: IDoodleManager,
        ga: UniversalAnalytics.ga,
        github: GitHubService
    ) {

        $scope.currentDoodle = function() {
            return doodles.current();
        };

        $scope.doodles = function() {
            return doodles.filter(function() { return true; });
        };

        $scope.clickDownload = function(label?: string, value?: number) {
            ga('send', 'event', 'doodle', 'download', label, value);
            github.getGists(function(err: any, gists: Gist[], status: number, headers: (name: string) => string) {
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
