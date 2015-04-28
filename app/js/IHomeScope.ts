/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="AppScope.ts" />
/// <reference path="ICodeInfo.ts" />
/// <reference path="typings/IGist.ts" />

// Define the interface for scope for type-safety.
// It should only contain the API required for the view.
interface IHomeScope extends AppScope {
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

  doNew: () => void;
  doOpen: () => void;
  doSave: () => void;
  doCopy: () => void;
  doShare: () => void;
  doHelp: () => void;

  doDownload(): void;

  documents: ICodeInfo[];
  templates: ICodeInfo[];
  gists: IGist[];

  shareURL: () => string;
}
