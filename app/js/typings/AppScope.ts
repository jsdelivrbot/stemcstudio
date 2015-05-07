/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/angular-ui-router/angular-ui-router.d.ts" />
interface AppScope extends angular.IRootScopeService {

    $state: angular.ui.IStateService;
    $stateParams: angular.ui.IStateParams;
    log: (thing) => void;
    alert: (thing) => void;

    clientId: () => string;
    isLoggedIn(): boolean;
    login(): void;
    logout(): void;
    userLogin(): string;
}