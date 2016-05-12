import * as angular from 'angular';

/**
 * The Application Root Scope.
 */
interface AppScope extends angular.IRootScopeService {
    $state: angular.ui.IStateService;
    $stateParams: angular.ui.IStateParamsService;

    clientId: () => string;
    isLoggedIn(): boolean;
    login(): void;
    logout(): void;
    userLogin(): string;

    googleSignIn(): void;
    googleSignOut(): void;
    googleUser: gapi.auth2.GoogleUser;

    /**
     * The version of the application.
     */
    version: string;

    /**
     * 
     */
    FEATURE_GOOGLE_API_ENABLED: boolean;

    /**
     * 
     */
    FEATURE_LOGIN_ENABLED: boolean;

    /**
     * 
     */
    FEATURE_I18N_ENABLED: boolean;
}

export default AppScope;
