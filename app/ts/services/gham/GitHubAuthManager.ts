import { IHttpService, ILocationService, IWindowService } from 'angular';
import { COOKIE_SERVICE_UUID, ICookieService } from '../cookie/ICookieService';
import { GITHUB_USER_SERVICE_UUID, IGitHubUserService } from '../github/IGitHubUserService';
import { IGitHubAuthManager } from './IGitHubAuthManager';
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
        COOKIE_SERVICE_UUID,
        GITHUB_USER_SERVICE_UUID,
        'githubKey',
    ];
    constructor(
        private $http: IHttpService,
        private $location: ILocationService,
        private $window: IWindowService,
        private cookieService: ICookieService,
        private githubService: IGitHubUserService,
        private githubKey: string
    ) {
        // Do nothing.
    }

    /**
     * 
     */
    clientId(): string | null {
        return this.cookieService.getItem(GITHUB_APPLICATION_CLIENT_ID_COOKIE_NAME);
    }

    /**
     * 
     */
    onLoginCallback(done: (err: Error | null, token?: string) => any) {
        const GATEKEEPER_DOMAIN = `${this.$location.protocol()}://${this.$location.host()}:${this.$location.port()}`;
        const ghItemStr = this.$window.localStorage.getItem(this.githubKey);
        if (typeof ghItemStr === 'string') {
            const ghItem = <Readonly<IGitHubItem>>JSON.parse(ghItemStr,
                /**
                 * We don't actually need this right now.
                 * Just illustrating the technique.
                 */
                function reviver(key, value) {
                    // pending is a generated-per-request UUID that is used by GitHub OAuth to improve security. 
                    return value;
                }
            );
            if (ghItem) {
                // const responsePending = ghItem.oauth.pending;
                // Remove the cached item used for detecting spoofing.
                this.$window.localStorage.removeItem(this.githubKey);
                const code = ghItem.oauth.code;
                this.$http.get<{ token?: string; error?: string }>(`${GATEKEEPER_DOMAIN}/authenticate/${code}`)
                    .then((promiseValue) => {
                        const data = promiseValue.data;
                        if (data) {
                            const token = data.token;
                            if (token) {
                                this.cookieService.setItem(GITHUB_TOKEN_COOKIE_NAME, token);
                                this.githubService.getUser()
                                    .then((user) => {
                                        this.cookieService.setItem(GITHUB_LOGIN_COOKIE_NAME, user.login);
                                        done(null, token);
                                    })
                                    .catch((reason) => {
                                        console.warn(`(then), data => ${JSON.stringify(data)}`);
                                        // This happens when the user hits the browser back button.
                                        // In this case, data => {"error":"bad_code"}.
                                        done(new Error(`Unable to retrieve your user information.`));
                                    });
                            }
                            else {
                                // error has the value "bad_code" when the user clicks the back button.
                                const error = data.error;
                                if (error) {
                                    switch (error) {
                                        case 'bad_code': {
                                            done(new Error("I guess we won't be logging into GitHub today!"));
                                            break;
                                        }
                                        default: {
                                            console.warn(`(then), promiseValue => ${JSON.stringify(promiseValue)}`);
                                            done(new Error(`Something is rotten in Denmark - ${error}`));
                                        }
                                    }
                                }
                                else {
                                    const msg = `(then), data => ${JSON.stringify(data)}`;
                                    console.warn(msg);
                                    done(new Error(msg));
                                }
                            }
                        }
                        else {
                            done(new Error("Unable to retrieve your authentication token."));
                        }
                    })
                    .catch((reason) => {
                        console.warn(`(catch), reason => ${JSON.stringify(reason)}`);
                        done(new Error("Unable to retrieve your authentication token."));
                    });
            }
            else {
                // Do nothing.
                console.warn(`ghItem is ${typeof ghItem}`);
            }
        }
        else {
            if (ghItemStr === null) {
                // This is expected when we first load the application.
            }
            else {
                const msg = `ghItemStr is ${typeof ghItemStr}, ${JSON.stringify(ghItemStr)}`;
                console.warn(msg);
            }
        }
    }

    /**
     * 
     */
    isSignedIn(): boolean {
        return this.cookieService.hasItem(GITHUB_TOKEN_COOKIE_NAME);
    }

    /**
     * 
     */
    userLogin(): string | undefined | null {
        if (this.isSignedIn()) {
            return this.cookieService.getItem(GITHUB_LOGIN_COOKIE_NAME);
        }
        else {
            return void 0;
        }
    }
}
