import * as angular from 'angular';

/**
 * The Application Root Scope.
 */
interface AppScope extends angular.IRootScopeService {
    $state: angular.ui.IStateService;
    $stateParams: angular.ui.IStateParamsService;
    log: (thing: any) => void;
    alert: (thing: any) => void;

    clientId: () => string;
    isLoggedIn(): boolean;
    login(): void;
    logout(): void;
    userLogin(): string;
    /**
     * The version of the application.
     */
    version: string;
    
    FEATURE_LOGIN_ENABLED: boolean;
}

export default AppScope;
