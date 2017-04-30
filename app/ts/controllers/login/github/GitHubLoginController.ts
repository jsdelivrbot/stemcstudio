import { IWindowService } from 'angular';
import { COOKIE_SERVICE_UUID, ICookieService } from '../../../services/cookie/ICookieService';
import GitHubLoginScope from './GitHubLoginScope';
import IGitHubItem from '../../../services/gham/IGitHubItem';
import { UUID_SERVICE_UUID, IUuidService } from '../../../services/uuid/IUuidService';
import { GITHUB_TOKEN_COOKIE_NAME } from '../../../constants';

//
// TODO: DRY & refactor so that there is a GitHub service.
//

/**
 * The GitHub OAuth2 endpoint.
 * Nobody else needs to know this except this module.
 */
const GITHUB_GET_LOGIN_OAUTH_AUTHORIZE = "https://github.com/login/oauth/authorize";

/**
 *
 */
export class GitHubLoginController {
    public static $inject: string[] = [
        '$scope',
        '$window',
        COOKIE_SERVICE_UUID,
        'githubKey',
        UUID_SERVICE_UUID,
        'FEATURE_GIST_ENABLED',
        'FEATURE_REPO_ENABLED',
        'FEATURE_GITHUB_SIGNIN_ENABLED',
        'GITHUB_LOGIN_COOKIE_NAME'
    ];
    /**
     * @param $scope
     * @param $window
     * @param cookieService
     * @param gitHubKey
     * @param uuidService Use to generate a unique string for extra security.
     */
    constructor(
        private $scope: GitHubLoginScope,
        private $window: IWindowService,
        private cookieService: ICookieService,
        private githubKey: string,
        private uuidService: IUuidService,
        private FEATURE_GIST_ENABLED: boolean,
        private FEATURE_REPO_ENABLED: boolean,
        private FEATURE_GITHUB_SIGNIN_ENABLED: boolean,
        private GITHUB_LOGIN_COOKIE_NAME: string
    ) {
        // Do nothing.
    }

    /**
     *
     */
    $onInit(): void {
        // Do nothing.
    }

    /**
     *
     */
    $onDestroy(): void {
        // Do nothing.
    }

    /**
     *
     */
    login(): void {
        if (this.FEATURE_GITHUB_SIGNIN_ENABLED) {
            ga('send', 'event', 'GitHub', 'login');
            // This is the beginning of the Web Application Flow for GitHub OAuth2.
            // The API now allows us to specify an unguessable random string called 'state'.
            // This 'state' string is used to protect against cross-site request forgery attacks.

            /**
             * The scopes that we will need from GitHub.
             * TODO: Can we do more incremental authorization?
             */
            const scopes: ('gist' | 'repo' | 'user')[] = [];
            scopes.push('user');
            if (this.FEATURE_GIST_ENABLED) {
                scopes.push('gist');
            }
            if (this.FEATURE_REPO_ENABLED) {
                scopes.push('repo');
            }

            /**
             * This little string provides a bit more security - the unguessable random string.
             */
            const pending = this.uuidService.generate();

            /**
             * The GitHub OAuth2 endpoint URL.
             */
            const githubURL = `${GITHUB_GET_LOGIN_OAUTH_AUTHORIZE}?client_id=${this.$scope.clientId()}&amp;scope=${scopes.join(',')}&amp;state=${pending}`;

            // We effectively reset the GitHub property.
            const github: Readonly<IGitHubItem> = { oauth: { pending: pending } };
            this.$window.localStorage.setItem(this.githubKey, JSON.stringify(github));
            // Begin the GET request to GitHub.
            // Changing the browser URL appears to take you away from the app,
            // but the login redirects back to the server.
            this.$window.location.href = githubURL;
        }
        else {
            console.warn(`FEATURE_GITHUB_SIGNIN_ENABLED => ${this.FEATURE_GITHUB_SIGNIN_ENABLED}`);
        }
    }

    /**
     *
     */
    logout(): void {
        if (this.FEATURE_GITHUB_SIGNIN_ENABLED) {
            ga('send', 'event', 'GitHub', 'logout');
            // FIXME: Would be nice to encapsulate this.
            this.cookieService.removeItem(GITHUB_TOKEN_COOKIE_NAME);
            this.cookieService.removeItem(this.GITHUB_LOGIN_COOKIE_NAME);
        }
        else {
            console.warn(`FEATURE_GITHUB_SIGNIN_ENABLED => ${this.FEATURE_GITHUB_SIGNIN_ENABLED}`);
        }
    }

    /**
     *
     */
    isLoggedIn(): boolean {
        if (this.FEATURE_GITHUB_SIGNIN_ENABLED) {
            return this.cookieService.hasItem(GITHUB_TOKEN_COOKIE_NAME);
        }
        else {
            console.warn(`FEATURE_GITHUB_SIGNIN_ENABLED => ${this.FEATURE_GITHUB_SIGNIN_ENABLED}`);
            return false;
        }
    }

    /**
     * Convenience method for the user interface.
     */
    toggleLogin(): void {
        if (this.isLoggedIn()) {
            this.logout();
        }
        else {
            this.login();
        }
    }
}
