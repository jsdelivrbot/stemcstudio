/// <reference path="../../typings/angularjs/angular.d.ts" />
interface AppScope extends angular.IRootScopeService {
    log: (thing) => void;
    alert: (thing) => void;
}