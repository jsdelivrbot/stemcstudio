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

    /**
     * The version of the application.
     */
    version: string;

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
