/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="ICodeInfo.ts" />

// Define the interface for scope for type-safety.
// It should only contain the API required for the view.
interface IHomeScope extends angular.IScope {
  showHTML: () => void;
  showCode: () => void;
  isShowingHTML: boolean;
  isShowingCode: boolean;

  isEditMode: boolean;
  toggleText: string;
  toggleMode: () => void;

  isViewVisible: boolean;
  resumeText: string;
  toggleView: () => void;

  isMenuVisible: boolean;
  toggleMenu: () => void;

  doNew: () => void;
  doOpen: () => void;
  doSave: () => void;
  doCopy: () => void;
  doShare: () => void;
  doHelp: () => void;

  documents: ICodeInfo[];
  templates: ICodeInfo[];
}
