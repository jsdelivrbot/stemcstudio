/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="AppScope.ts" />
/// <reference path="IDoodle.ts" />
/// <reference path="IGist.ts" />

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
  doCopy: () => void;
  doProperties(): void;
  doShare: () => void;
  doHelp: () => void;

  doDownload(): void;
  doUpload(): void;

  doodles: IDoodle[];
  templates: IDoodle[];
  options: IOption[];
  gists: IGist[];

  // This is only here to pass parameters into the dialog.
  dependencies: string[];

  shareURL: () => string;
}
