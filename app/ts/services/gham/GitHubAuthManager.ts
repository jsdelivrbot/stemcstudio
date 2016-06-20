import * as ng from 'angular';
import CookieService from '../cookie/CookieService';
import GitHubService from '../github/GitHubService';
import IGitHubAuthManager from './IGitHubAuthManager';
import IGitHubItem from './IGitHubItem';

const GITHUB_TOKEN_COOKIE_NAME = 'github-token';
const GITHUB_LOGIN_COOKIE_NAME = 'github-login';

// The name of this cookie must correspond with the cookie sent back from the server.
const GITHUB_APPLICATION_CLIENT_ID_COOKIE_NAME = 'stemcstudio-github-application-client-id';

export default class GitHubAuthManager implements IGitHubAuthManager {
    public static $inject: string[] = [
        '$http',
        '$location',
        '$window',
        'cookie',
        'GitHub',
        'githubKey',
    ];
    constructor(
        private $http: angular.IHttpService,
        private $location: angular.ILocationService,
        private $window: angular.IWindowService,
        private cookie: CookieService,
        private github: GitHubService,
        private githubKey: string
    ) {
        // Do nothing.
    }

    /**
     * 
     */
    clientId(): string {
        return this.cookie.getItem(GITHUB_APPLICATION_CLIENT_ID_COOKIE_NAME);
    }

    /**
     * 
     */
    handleGitHubLoginCallback(done: (err: Error, token: string) => any) {
        const GATEKEEPER_DOMAIN = `${this.$location.protocol()}://${this.$location.host()}:${this.$location.port()}`;
        const ghItem = <IGitHubItem>JSON.parse(this.$window.localStorage.getItem(this.githubKey));
        if (ghItem) {
            this.$window.localStorage.removeItem(this.githubKey);
            const code = ghItem.oauth.code;
            this.$http.get<{ token: string }>(`${GATEKEEPER_DOMAIN}/authenticate/${code}`)
                .success((data: { token: string }, status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) => {
                    const token = data.token;
                    this.cookie.setItem(GITHUB_TOKEN_COOKIE_NAME, token);
                    this.github.getUser().then((response) => {
                        const user = response.data;
                        this.cookie.setItem(GITHUB_LOGIN_COOKIE_NAME, user.login);
                        done(void 0, token);
                    }).catch((reason) => {
                        done(new Error("Unable to retrieve your user information."), void 0);
                    });
                })
                .error((data, status, headers, config) => {
                    done(new Error("Unable to retrieve your authentication token."), void 0);
                });
        }
        else {
            // Do nothing.
        }
    }

    /**
     * 
     */
    handleLoginCallback(done: (err: Error, token: string) => any) {
        const GATEKEEPER_DOMAIN = `${this.$location.protocol()}://${this.$location.host()}:${this.$location.port()}`;
        const match = this.$window.location.href.match(/\?code=([a-z0-9]*)/);
        if (match) {
            this.$location.search({});
            const code = match[1];
            this.$http.get(`${GATEKEEPER_DOMAIN}/authenticate/${code}`)
                .success((data: { token: string }, status, headers, config) => {
                    const token = data.token;
                    this.cookie.setItem(GITHUB_TOKEN_COOKIE_NAME, token);
                    this.github.getUser().then((response) => {
                        const user = response.data;
                        this.cookie.setItem(GITHUB_LOGIN_COOKIE_NAME, user.login);
                        done(void 0, token);
                    }).catch((reason) => {
                        done(new Error(`Unable to retrieve your user information because ${JSON.stringify(reason)} .`), void 0);
                    });
                })
                .error((data, status, headers, config) => {
                    done(new Error("Unable to retrieve your authentication token."), void 0);
                });
        }
        else if (this.$window.location.href.match(/\?error=access_denied/)) {
            this.$location.search({});
        }
    }

    /**
     * 
     */
    isSignedIn(): boolean {
        return this.cookie.hasItem(GITHUB_TOKEN_COOKIE_NAME);
    }

    /**
     * 
     */
    userLogin(): string {
        if (this.isSignedIn()) {
            return this.cookie.getItem(GITHUB_LOGIN_COOKIE_NAME);
        }
        else {
            return void 0;
        }
    }
}
