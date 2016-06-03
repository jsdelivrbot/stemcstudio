import BodyScope from '../scopes/BodyScope';

/**
 * The controller for the <body> tag.
 * The controller is referred to as 'body-controller' in layout.jade.
 *
 * @class BodyController
 */
export default class BodyController {
    public static $inject: string[] = [
        '$scope',
        '$state',
        'ga'
    ];
    constructor(
        private $scope: BodyScope,
        private $state: angular.ui.IStateService,
        private ga: UniversalAnalytics.ga
    ) {
        $scope.goHome = (label?: string, value?: number) => {
            const destination = 'home';
            this.navigateTo(destination, void 0, void 0, label, value)
                .then(function(promiseValue: any) {
                    // console.lg(`navigateTo('${destination}') completed.`);
                })
                .catch(function(reason: any) {
                    console.warn(`navigateTo('${destination}') failed.`);
                });
        };


        /*
        $scope.clickDownload = function(label?: string, value?: number) {
            ga('send', 'event', 'doodle', 'download', label, value);
            github.getGists()
                .then(function(promiseValue) {
                    const gists = promiseValue.data;
                    const headers = promiseValue.headers;
                    $scope.gists = gists;
                    if (headers['link']) {
                        $scope.links = linkToMap(headers('link'));
                    }
                    else {
                        $scope.links = {};
                    }
                    $state.go('download');
                })
                .catch(function(reason: any) {
                    BootstrapDialog.show({
                        type: BootstrapDialog.TYPE_DANGER,
                        // FIXME: Why does jQuery get defined globally and does a module import fail?
                        title: $("<h3>Download failed</h3>"),
                        message: `Unable to download Gists. Cause: ${reason} ${status}`,
                        buttons: [{
                            label: "Close",
                            cssClass: 'btn btn-primary',
                            action: function(dialog: IBootstrapDialog) {
                                dialog.close();
                            }
                        }]
                    });

                });
        };
        */
    }

    /**
     * @method $onInit
     * @return {void}
     */
    $onInit() {
        // This method IS called when the application loads.
    }

    /**
     * @method $onDestroy
     * @return {void}
     */
    $onDestroy() {
        // I don't think that this method is called.
        console.warn("BodyController.$onDestroy()");
    }

    /**
     * @method navigateTo
     * @param to {string}
     * @param [params] {}
     * @param [options] {IStateOptions}
     * @param [label] {string} Contextual information from UI.
     * @param [value] {string} Contextual information from UI.
     * @return {IPromise}
     */
    protected navigateTo(to: string, params?: {}, options?: angular.ui.IStateOptions, label?: string, value?: number): angular.IPromise<any> {
        this.ga('send', 'event', 'navigateTo', to, label, value);
        return this.$state.go(to, params, options);
    }
}
