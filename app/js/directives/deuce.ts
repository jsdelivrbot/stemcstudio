/// <reference path="../../../typings/angularjs/angular.d.ts" />
module deuce {
    export interface IEditor {
      setValue(value: string, something: number): void;
      resize(something: boolean): void;
    }
    export function edit(element: string, workspace: any): IEditor {
      var editor: IEditor = {
        setValue: function(value: string, something: number) {

        },
        resize: function(something: boolean) {

        }
      };
      return editor;
    }
}

angular.module('deuce', [])
.directive('deuceEditor', function() {
  return {
    restrict : 'A',
    scope: {},
    templateUrl: 'deuce.html'
  };
});
