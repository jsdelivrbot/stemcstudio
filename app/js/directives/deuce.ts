/// <reference path="../../../typings/angularjs/angular.d.ts" />
module deuce {

    export interface IEditor {
      changeFile(content: string, fileName: string): IEditor;
      getSession(): ISession;
      getValue(): string;
      resize(something: boolean): void;
      setDisplayIndentGuides(displayIndentGuides: boolean): IEditor;
      setFontSize(fontSize: string): IEditor;
      setShowInvisibles(showInvisibles: boolean): IEditor;
      setShowPrintMargin(showPrintMargin: boolean): IEditor;
      setTheme(theme: string): IEditor;
      setValue(value: string, something: number): IEditor;
    }

    export interface ISession {
      setMode(mode: string): ISession;
      setTabSize(tabSize: number): ISession;
      on(name: string, callback: (event)=>void): void;
    }

    export function edit(element: HTMLElement, workspace: any): IEditor {
        element.classList.add('ace_editor');
        element.classList.add('ace-tm');
        var data: { theme: string; value: string} = {
        theme: undefined,
        value: undefined
      };

      var session: ISession = {
        setMode: function(mode: string) {
          return session;
        },
        setTabSize: function(tabSize: number) {
          return session;
        },
        on: function(name: string, callback: (event)=>void) {
          return session;
        }
      };
      var editor: IEditor = {
        changeFile: function(content: string, fileName: string) {
          return editor;
        },
        getSession: function() {
          return session;
        },
        getValue: function() {
          return data.value;
        },
        resize: function(something: boolean) {

        },
        setDisplayIndentGuides: function(displayIndentGuides: boolean) {
          return editor;
        },
        setFontSize: function(fontSize: string) {
          return editor;
        },
        setShowInvisibles: function(showInvisibles: boolean) {
          return editor;
        },
        setShowPrintMargin: function(showPrintMargin: boolean) {
          return editor;
        },
        setTheme: function(theme: string) {
          data.theme = theme;
          return editor;
        },
        setValue: function(value: string, something: number) {
          data.value = value;
          return editor;
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
