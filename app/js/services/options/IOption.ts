interface IOption {
  /**
   * The name is the unique identifier and correlates with the Bower name.
   */
  name: string;
  /**
   * How the option is known to the user. i.e. What we use in the user interface.
   */
  moniker: string;
  /**
   *
   */
  description: string;
  /**
   * The semantic version.
   */
  version: string;
  /**
   * Determines whether the option is visible to the user.
   */
  visible: boolean;
  /**
   *
   */
  js: string;
  /**
   *
   */
  dts: string;
  /**
   * The dependencies expressed as name => semantic version dependency map.
   */
  dependencies: { [name: string]: string };
}