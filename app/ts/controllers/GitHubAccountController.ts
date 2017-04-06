import GitHubAccountScope from '../scopes/GitHubAccountScope';
import { GITHUB_USER_SERVICE_UUID, IGitHubUserService } from '../services/github/IGitHubUserService';
import { GITHUB_SERVICE_UUID, IGitHubService } from '../services/github/IGitHubService';
import GitHubUser from '../services/github/GitHubUser';
import Repo from '../services/github/Repo';

/**
 *
 */
export default class GitHubAccountController {
    public static $inject: string[] = ['$scope', GITHUB_USER_SERVICE_UUID, GITHUB_SERVICE_UUID];
    /**
     *
     */
    constructor(private $scope: GitHubAccountScope, private githubUserService: IGitHubUserService, private githubService: IGitHubService) {
        // Do nothing.
    }

    /**
     *
     */
    $onInit(): void {

        this.githubUserService.getUser()
            .then((user) => {
                this.$scope.user = user;
            })
            .catch((reason) => {
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
     *
     */
    $onDestroy(): void {
        // Do nothing.
    }
}
