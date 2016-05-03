import * as ng from 'angular';
import app from '../../app';
import CookieService from '../cookie/CookieService';
import GitHubService from '../github/GitHubService';
import IGitHubAuthManager from './IGitHubAuthManager';
import IGitHubItem from './IGitHubItem';
import User from '../github/User';

app.service('GitHubAuthManager', [
    '$http',
    '$location',
    '$window',
    'cookie',
    'GitHub',
    'githubKey',
    function(
        $http: angular.IHttpService,
        $location: angular.ILocationService,
        $window: angular.IWindowService,
        cookie: CookieService,
        github: GitHubService,
        githubKey: string
    ) {

        const GATEKEEPER_DOMAIN = "" + ($location.protocol()) + "://" + ($location.host()) + ":" + ($location.port());
        const GITHUB_TOKEN_COOKIE_NAME = 'github-token';
        const GITHUB_LOGIN_COOKIE_NAME = 'github-login';

        const handleGitHubLoginCallback = function(done) {
            const ghItem = <IGitHubItem>JSON.parse($window.localStorage.getItem(githubKey));
            if (ghItem) {
                $window.localStorage.removeItem(githubKey);
                const code = ghItem.oauth.code;
                $http.get<{ token: string }>(GATEKEEPER_DOMAIN + "/authenticate/" + code)
                    .success(function(data: { token: string }, status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) {
                        const token = data.token;
                        cookie.setItem(GITHUB_TOKEN_COOKIE_NAME, token);
                        github.getUser(function(err, user: User) {
                            if (!err) {
                                cookie.setItem(GITHUB_LOGIN_COOKIE_NAME, user.login);
                                done(null, token);
                            }
                            else {
                                done(new Error("Unable to retrieve your user information."));
                            }
                        });
                    })
                    .error(function(data, status, headers, config) {
                        done(new Error("Unable to retrieve your authentication token."));
                    });
            }
            else {
                // Do nothing.
            }
        };
        const handleLoginCallback = function(done) {
            const match = $window.location.href.match(/\?code=([a-z0-9]*)/);
            if (match) {
                $location.search({});
                const code = match[1];
                $http.get("" + GATEKEEPER_DOMAIN + "/authenticate/" + code)
                    .success(function(data: { token: string }, status, headers, config) {
                        const token = data.token;
                        cookie.setItem(GITHUB_TOKEN_COOKIE_NAME, token);
                        github.getUser(function(error, user) {
                            if (!error) {
                                cookie.setItem(GITHUB_LOGIN_COOKIE_NAME, user.login);
                                done(null, token);
                            }
                            else {
                                done(new Error("Unable to retrieve your user information."));
                            }
                        });
                    })
                    .error(function(data, status, headers, config) {
                        done(new Error("Unable to retrieve your authentication token."));
                    });
            }
            else if ($window.location.href.match(/\?error=access_denied/)) {
                $location.search({});
            }
        };
        const api: IGitHubAuthManager = {
            handleGitHubLoginCallback: handleGitHubLoginCallback,
            handleLoginCallback: handleLoginCallback
        };
        return api;
    }
]);
