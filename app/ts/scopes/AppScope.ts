import * as angular from 'angular';

/**
 * The Application Root Scope.
 */
interface AppScope extends angular.IRootScopeService {
    $state: angular.ui.IStateService;
    $stateParams: angular.ui.IStateParamsService;

    /**
     * This is the GitHub client id for OAuth2.
     * It's value depends on whether we are in production or localhost:8080, so we get it from the server as a cookie.
     */
    clientId: () => string;

    /**
     * (GitHub)
     */
    isGitHubSignedIn(): boolean;

    /**
     * (GitHub)
     */
    userLogin(): string;

    /**
     * (Google)
     */
    googleUser: gapi.auth2.GoogleUser;
    /**
     * (Google)
     */
    isGoogleSignedIn(): boolean;

    /**
     * The version of the application.
     */
    version: string;

    /**
     * 
     */
    FEATURE_GOOGLE_SIGNIN_ENABLED: boolean;

    /**
     * 
     */
    FEATURE_LOGIN_ENABLED: boolean;

    /**
     * 
     */
    FEATURE_I18N_ENABLED: boolean;

    /**
     * Navigate to the Home page.
     */
    goHome(): void;

    /**
     * Navigate to the Log In page.
     */
    goLogin(): void;

    /**
     * Navigate to the Search page.
     */
    goSearch(): void;
}

export default AppScope;
