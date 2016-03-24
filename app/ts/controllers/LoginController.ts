import app from '../app';
import CookieService from '../services/cookie/CookieService';
import IGitHubItem from '../services/gham/IGitHubItem';
import LoginScope from './LoginScope';
import IUuidService from '../services/uuid/IUuidService';

app.controller('LoginController', [
    '$scope',
    '$state',
    '$window',
    'cookie',
    'uuid4',
    'ga',
    'githubKey',
    function(
        $scope: LoginScope,
        $state: angular.ui.IStateService,
        $window: angular.IWindowService,
        cookie: CookieService,
        uuid4: IUuidService,
        ga: UniversalAnalytics.ga,
        githubKey: string
    ) {

        // The name of this cookie must correspond with the cookie sent back from the server.
        const GITHUB_APPLICATION_CLIENT_ID_COOKIE_NAME = 'mathdoodle-github-application-client-id';
        const GITHUB_GET_LOGIN_OAUTH_AUTHORIZE = "https://github.com/login/oauth/authorize";

        $scope.githubLogin = function(label?: string, value?: number) {
            ga('send', 'event', 'GitHub', 'login', label, value);
            // This is the beginning of the Web Application Flow for GitHub OAuth2.
            // The API now allows us to specify an unguessable random string called 'state'.
            // This 'state' string is used to protect against cross-site request forgery attacks.
            const clientId = cookie.getItem(GITHUB_APPLICATION_CLIENT_ID_COOKIE_NAME);

            const state = uuid4.generate();
            const githubURL = GITHUB_GET_LOGIN_OAUTH_AUTHORIZE +
                "?client_id=" + clientId +
                "&amp;scope=user,gist" +
                "&amp;state=" + state;

            const github: IGitHubItem = { oauth: { pending: state } };

            $window.localStorage.setItem(githubKey, JSON.stringify(github));

            $window.location.href = githubURL;
        };
    }
]);
