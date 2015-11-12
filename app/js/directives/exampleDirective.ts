/// <reference path="../../../typings/angularjs/angular.d.ts" />

module mathdoodle.Directives {
    export interface IMyScope extends ng.IScope {
        name: string;
    }
    export function MyDirective(): ng.IDirective {
        return {
            template: '',
            scope: {},
            link: (scope: IMyScope) => {
                scope.name = 'David'
            }
        }
    }
}

// I assume ng.IDirectiveFactory is typed as a function returning an ng.IDirective.
angular.module('app').directive('whatever', mathdoodle.Directives.MyDirective);