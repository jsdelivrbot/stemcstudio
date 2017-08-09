import { IRootScopeService } from 'angular';
import { IStateService, IStateParamsService } from 'angular-ui-router';

/**
 * The Application Root Scope.
 */
export interface AppScope extends IRootScopeService {
    /**
     * 
     */
    $state: IStateService;
    /**
     * 
     */
    $stateParams: IStateParamsService;

    /**
     * This is the GitHub client id for OAuth2.
     * It's value depends on whether we are in production or localhost:8080, so we get it from the server as a cookie.
     */
    clientId: () => string | null | undefined;

    /**
     * (GitHub)
     */
    isGitHubSignedIn(): boolean;

    /**
     * (GitHub)
     */
    userLogin(): string | null | undefined;

    /**
     * (Google)
     */
    googleUser: gapi.auth2.GoogleUser;

    /**
     * (Google)
     */
    isGoogleSignedIn(): boolean;

    /**
     * 'ts' or 'STEM'.
     */
    brandPartA: string;
    /**
     * 'Code' or 'C'.
     */
    brandPartB: string;
    /**
     * 'Hub' or 'studio'.
     */
    brandPartC: string;
    /**
     * 'com'
     */
    brandPartD: string;

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
    FEATURE_I18N_ENABLED: boolean;

    /**
     * Navigate to the Home page.
     */
    goHome(): void;
    /**
     * Determines whether we can, for example, click the brand icon to go home.
     * When application is embedded, we prevent such navigation.
     */
    isGoHomeEnabled: boolean;
}
