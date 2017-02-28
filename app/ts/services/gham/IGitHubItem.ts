/**
 * An instance of structure is created at the start of a login request.
 * It is then stored in local storage under a special key.
 * When the authentication callback is invoked the the cached value is retrieved from local storage.
 * By looking at the `pending` property, we can check that the authentication request has not been spoofed.
 * This approach is recommended by GitHub.
 */
interface IGitHubItem {
    oauth: {
        /**
         * A generated-per-login-request UUID-4 used to improve security.
         */
        pending: string;
        /**
         * 
         */
        code?: string;
        /**
         * 
         */
        state?: string;
    };
}

export default IGitHubItem;
