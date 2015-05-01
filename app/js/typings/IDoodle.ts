interface IDoodle {
  /**
   * Every doodle gets a UUID to determine uniqueness.
   */
  uuid: string;
  /**
   * The GitHub Gist identifier.
   */
  gistId?: string;
  /**
   * 
   */
  description: string;
  /**
   * The `isCodeVisible` property determines whether the code is visible.
   */
  isCodeVisible: boolean;
  /**
   * The `isViewVisible` property determines whether the view is visible.
   */
  isViewVisible: boolean;
  /**
   * The `focusEditor` property contains the fileName of the editor which has focus.
   */
  focusEditor: string;
  /**
   * 
   */
  html: string;
  /**
   * 
   */
  code: string;
  /**
   * 
   */
  dependencies: string[];
}
