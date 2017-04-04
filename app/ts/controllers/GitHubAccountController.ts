import GitHubAccountScope from '../scopes/GitHubAccountScope';
import { GITHUB_SERVICE_UUID, IGitHubService } from '../services/github/IGitHubService';
import GitHubUser from '../services/github/GitHubUser';
import Repo from '../services/github/Repo';

/**
 *
 */
export default class GitHubAccountController {
    public static $inject: string[] = ['$scope', GITHUB_SERVICE_UUID];
    /**
     *
     */
    constructor(private $scope: GitHubAccountScope, private githubService: IGitHubService) {
        // Do nothing.
    }

    /**
     *
     */
    $onInit(): void {

        this.githubService.getUser().then((promiseValue) => {
            if (promiseValue.data) {
                this.$scope.user = promiseValue.data;
            }
        }).catch(() => {
            this.$scope.user = <GitHubUser>{ name: "", login: "", avatar_url: void 0 };
        });

        this.githubService.getUserRepos((err: any, repos: Repo[]) => {
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
