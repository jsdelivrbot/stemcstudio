import { GitHubAccountScope } from '../scopes/GitHubAccountScope';
import { GITHUB_USER_SERVICE_UUID, IGitHubUserService } from '../services/github/IGitHubUserService';
import { GITHUB_REPO_SERVICE_UUID, IGitHubRepoService } from '../services/github/IGitHubRepoService';
import { GitHubUser } from '../services/github/GitHubUser';

/**
 *
 */
export class GitHubAccountController {
    public static $inject: string[] = [
        '$scope',
        GITHUB_USER_SERVICE_UUID,
        GITHUB_REPO_SERVICE_UUID
    ];
    /**
     *
     */
    constructor(
        private $scope: GitHubAccountScope,
        private githubUserService: IGitHubUserService,
        private githubRepoService: IGitHubRepoService) {
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

        this.githubRepoService.getUserRepos()
            .then((repos) => {
                this.$scope.repos = repos;

            })
            .catch((err) => {
                this.$scope.repos = [];
            });
    }

    /**
     *
     */
    $onDestroy(): void {
        // Do nothing.
    }
}
