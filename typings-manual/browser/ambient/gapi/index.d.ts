/**
 * https://developers.google.com/identity/sign-in/web
 * 
 * 1. Use the special <div class='g-signin2' data-onsuccess= ...
 * 
 * This doesn't work very well in our System/AngukarJS environment because of race conditions.
 * 
 * 2. Modify a div using gapi.signin2.render(div.id, scope.options());
 *
 * This works pretty well in our environment. An AngularJS directive makes a neat solution.
 * 
 * 3. gapi.auth2.getAuthInstance().attachClickHandler(...)
 *
 * Haven't tried this yet. 
 * 
 * 4. ??? Can we use the API directly?
 * 
 * 4a. Call gapi.auth2.init to initialize the GoogleAuth instance. (Maybe in app.run)
 *     This actually returns a GoogleAuth instance (usually referenced as auth2).
 *     However, the same object can now be obtained with gapi.auth2.getAuthInstance()
 * 
 */
declare module gapi {
    interface SignIn2Options {
        /**
         * The scopes to request when the user signs in (default: profile).
         */
        scope?: string;
        /**
         * The width of the button in pixels (default: 120).
         */
        width?: number;
        /**
         * The height of the button in pixels (default: 36).
         */
        height?: number;
        /**
         * Display long labels such as "Sign in with Google" rather than "Sign in" (default: false).
         */
        longtitle?: boolean;
        /**
         * The color theme of the button: either light or dark (default: light).
         */
        theme?: string;
        /**
         * The callback function to call when a user successfully signs in.
         * This function must take one argument: an instance of gapi.auth2.GoogleUser (default: none).
         */
        onsuccess?: (googleUser: auth2.GoogleUser) => any;
        /**
         * The callback function to call when sign-in fails.
         * This function takes no arguments (default: none).
         */
        onfailure?: (reason: any) => any;
    }
    export module auth2 {
        interface AuthResponse {
            access_token: string;
            id_token: string;
            login_hint: string;
            scope: string;
            expires_in: string;
            first_issued_at: string;
            expires_at: string;
        }
        interface BasicProfile {
            getId(): string;
            getName(): string;
            getGivenName(): string;
            getFamilyName(): string;
            getImageUrl(): string;
            getEmail(): string;
        }
        interface CurrentUser {
            /**
             * Returns a GoogleUser object that represents the current user.
             * Note that in a newly-initialized GoogleAuth instance, the current user has not been set.
             * Use the currentUser.listen() method or the GoogleAuth.then() to get an initialized GoogleAuth instance.
             */
            get(): GoogleUser;
            /**
             * Listen for changes in currentUser.
             * 
             * @method listen
             * @param listener {(googleUser: GoogleUser) => any} listen passes this function a GoogleUser instance on every change that modifies currentUser.
             */
            listen(listener: (googleUser: GoogleUser) => any): void;
        }
        /**
         * A GoogleUser object represents one user account.
         * GoogleUser objects are typically obtained by calling GoogleAuth.currentUser.get().
         */
        interface GoogleUser {
            /**
             * Important: Do not use the Google IDs returned by getId() to communicate the currently signed in user to your backend server.
             * Instead, send ID tokens, which can be securely validated on the server.
             */
            getId(): string;
            getAuthResponse(): auth2.AuthResponse;
            getBasicProfile(): auth2.BasicProfile;
            /**
             * Get the scopes that the user granted as a space-delimited string.
             */
            getGrantedScopes(): string;
            /**
             * Get the user's Google Apps domain if the user signed in with a Google Apps account.
             */
            getHostedDomain(): string;
            /**
             * @method hasGrantedScopes
             * @param scopes {string} A space-delimited string of scopes.
             * @return {boolean} Returns true if the user granted the specified scopes.
             */
            hasGrantedScopes(scopes: string): boolean;
            /**
             * Returns true if the user is signed in.
             */
            isSignedIn(): boolean;
            signIn(options): any;
            grant(options: SigninOptionsBuilder): Promise<any>;
            grantOfflineAccess(scopes): any;
            /**
             * Revokes all of the scopes that the user granted.
             */
            disconnect();
        }
        /**
         * GoogleAuth is a singleton class that provides methods to allow the user to sign in with
         * a Google account, get the user's current sign-in status, 
         * get specific data from the user's Google profile, 
         * request additional scopes, and sign out from the current account.
         */
        interface GoogleAuth {
            currentUser: CurrentUser;
            isSignedIn: {
                /**
                 * Returns whether the current user is currently signed in.
                 */
                get(): boolean;
                /**
                 * Listen for changes in the current user's sign-in state.
                 * 
                 * @method listen
                 * @param listener {(direction)=>any} direction is true when user signs in, false when user signs out.
                 */
                listen(listener: (direction: boolean) => any)
            }
            /**
             * 
             */
            signIn(): Promise<any>;
            /**
             * Signs out all accounts from the application.
             */
            signOut(): Promise<any>;
            then(onInit: () => any, onFailure: (reason: any) => any): Promise<any>;
            disconnect();
            grantOfflineAccess(options): Promise<any>;
            /**
             * @method attachClickHandler
             * @param container {string | HTMLDivElement}
             * @param options {} See signIn
             * @param onSuccess Handles successful sign-ins.
             * @param onFailure Handles sign-in failures.
             */
            attachClickHandler(container: string | HTMLDivElement, options, onsuccess: (googleUser: auth2.GoogleUser) => any, onfailure: (error: any) => any)
        }

        /**
         * Initializes the GoogleAuth object.
         * You must call this method before calling gapi.auth2.GoogleAuth's methods.
         */
        export function init(params: {
            client_id: string;
            cookie_policy?: string;
            scope?: string;
            /**
             * Determines effect of getBasicProfile() on the GoogleUser.
             */
            fetch_basic_profile?: boolean;
            hosted_domain?: string;
            openid_realm?: string;
        }): GoogleAuth;

        /**
         * Returns the GoogleAuth object.
         * You must initialize the GoogleAuth object with gapi.auth2.init() before calling this method.
         */
        export function getAuthInstance(): GoogleAuth;

        class SigninOptionsBuilder {
            constructor(options: {
                scope: string;
            });
            setAppPackageName(name: string): void;
            setFetchBasicProfile(fetchBasicProfile: boolean): void;
            setPrompt(prompt: string): void;
            setScope(scope: string): SigninOptionsBuilder;
        }
    }
    interface SignIn2 {
        /**
         * Renders a context-aware sign-in button in the element with the given ID,
         * using the settings specified by the options object.
         * 
         * @method render
         * @param id {string} The ID of the element in which to render the sign-in button.
         * @param options {SignIn2Options} An object containing the settings to use to render the button. 
         */
        render(id: string, options: SignIn2Options): void;
    }
    export var signin2: SignIn2;
    /**
     * https://developers.google.com/identity/sign-in/web/people
     */
    export function load(thing: string, callback: () => any);
}
/*
gapi.load('auth2', function() {
    const auth2 = gapi.auth2.init({
        client_id: '',
        fetch_basic_profile: false,
        scope: 'profile'
    });
    auth2.signIn().then(function() {
        console.log(auth2.currentUser.get().getId());
    })

})
*/
