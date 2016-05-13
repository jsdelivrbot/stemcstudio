import GitHubAccountScope from '../scopes/GitHubAccountScope';
import GitHubService from '../services/github/GitHubService';
import User from '../services/github/User';
import Repo from '../services/github/Repo';

/**
 * @class GitHubAccountScope
 */
export default class GitHubAccountController {
    public static $inject: string[] = [
        '$scope',
        'GitHub'
    ];
    /**
     * @class GitHubAccountScope
     * @constructor
     * @param $scope {GitHubAccountScope}
     */
    constructor(
        private $scope: GitHubAccountScope,
        private gitHub: GitHubService) {
        // Do nothing.
    }

    /**
     * @method $onInit
     * @return {void}
     */
    $onInit(): void {

        this.gitHub.getUser().then((response) => {
            this.$scope.user = response.data;
        }).catch((reason) => {
            this.$scope.user = <User>{ name: "", login: "", avatar_url: void 0 };
        });

        this.gitHub.getUserRepos((err: any, repos: Repo[]) => {
            if (!err) {
                this.$scope.repos = repos;
            }
            else {
                this.$scope.repos = [];
            }
        });
    }

    /**
     * @method $onDestroy
     * @return {void}
     */
    $onDestroy(): void {
        // Do nothing.
    }
}
