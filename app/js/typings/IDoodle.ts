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
   * 
   */
  autoupdate: boolean;
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
  dependencies: IDependency[];
}
