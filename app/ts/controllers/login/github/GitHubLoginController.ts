import CookieService from '../../../services/cookie/CookieService';
import GitHubLoginScope from './GitHubLoginScope';
import IGitHubItem from '../../../services/gham/IGitHubItem';
import IUuidService from '../../../services/uuid/IUuidService';

//
// TODO: DRY & refactor so that there is a GitHub service.
//

/**
 * The GitHub OAuth2 endpoint.
 * Nobody else needs to know this except this module.
 */
const GITHUB_GET_LOGIN_OAUTH_AUTHORIZE = "https://github.com/login/oauth/authorize";

/**
 * @class GitHubLoginController
 */
export default class GitHubLoginController {
    public static $inject: string[] = [
        '$scope',
        '$window',
        'cookie',
        'githubKey',
        'uuid4',
        'FEATURE_GIST_ENABLED',
        'FEATURE_REPO_ENABLED',
        'FEATURE_GITHUB_SIGNIN_ENABLED',
        'GITHUB_LOGIN_COOKIE_NAME',
        'GITHUB_TOKEN_COOKIE_NAME'
    ];
    /**
     * @class GitHubLoginController
     * @constructor
     * @param $scope
     * @param $window
     * @param cookie
     * @param gitHubKey {string}
     * @param uuid4 {IUuidService} Use to generate a unique string for extra security.
     */
    constructor(
        private $scope: GitHubLoginScope,
        private $window: angular.IWindowService,
        private cookie: CookieService,
        private githubKey: string,
        private uuid4: IUuidService,
        private FEATURE_GIST_ENABLED: boolean,
        private FEATURE_REPO_ENABLED: boolean,
        private FEATURE_GITHUB_SIGNIN_ENABLED: boolean,
        private GITHUB_LOGIN_COOKIE_NAME: string,
        private GITHUB_TOKEN_COOKIE_NAME: string
    ) {
        // Do nothing.
    }

    /**
     * @method $onInit
     * @return {void}
     */
    $onInit(): void {
        // Do nothing.
    }

    /**
     * @method $onDestroy
     * @return {void}
     */
    $onDestroy(): void {
        // Do nothing.
    }

    /**
     * @method login
     * @return {void}
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
            const scopes: string[] = [];
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
            const pending = this.uuid4.generate();

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
     * @method logout
     * @return {void}
     */
    logout(): void {
        if (this.FEATURE_GITHUB_SIGNIN_ENABLED) {
            ga('send', 'event', 'GitHub', 'logout');
            // FIXME: Would be nice to encapsulate this.
            this.cookie.removeItem(this.GITHUB_TOKEN_COOKIE_NAME);
            this.cookie.removeItem(this.GITHUB_LOGIN_COOKIE_NAME);
        }
        else {
            console.warn(`FEATURE_GITHUB_SIGNIN_ENABLED => ${this.FEATURE_GITHUB_SIGNIN_ENABLED}`);
        }
    }

    /**
     * @method isLoggedIn
     * @return {boolean}
     */
    isLoggedIn(): boolean {
        if (this.FEATURE_GITHUB_SIGNIN_ENABLED) {
            return this.cookie.hasItem(this.GITHUB_TOKEN_COOKIE_NAME);
        }
        else {
            console.warn(`FEATURE_GITHUB_SIGNIN_ENABLED => ${this.FEATURE_GITHUB_SIGNIN_ENABLED}`);
            return false;
        }
    }

    /**
     * Convenience method for the user interface.
     *
     * @method toggleLogin
     * @return {void}
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
