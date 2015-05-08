/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="AppScope.ts" />
/// <reference path="../services/doodles/IDoodle.ts" />
/// <reference path="../services/doodles/IDoodleManager.ts" />
/// <reference path="IGist.ts" />

// Define the interface for scope for type-safety.
// It should only contain the API required for the view.
interface IHomeScope extends AppScope {
  /**
   * @param label Used by Universal Analytics to categorize events.
   * @param value Values must be non-negative. Useful to pass counts.
   */
  showHTML: (label?: string, value?: number) => void;
  /**
   * @param label Used by Universal Analytics to categorize events.
   * @param value Values must be non-negative. Useful to pass counts.
   */
  showCode: (label?: string, value?: number) => void;
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
  doAbout(): void;
  doShare: () => void;
  doHelp: () => void;

  doDownload(): void;
  doUpload(): void;

//doodles: IDoodleManager;
  templates: IDoodle[];
//options: IOption[];
  gists: IGist[];

  // This is only here to pass parameters into the dialog.
  description: string;
  dependencies: string[];

  shareURL: () => string;

  updateView(): void;
  updatePreview(delay: number): void;
}
