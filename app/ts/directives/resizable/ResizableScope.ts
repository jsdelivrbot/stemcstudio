import { IScope } from 'angular';

export type Direction = 'bottom' | 'left' | 'right' | 'top';

/**
 * resizeStart
 * resizing
 * resizeEnd
 */
export interface ResizableScope extends IScope {

  /**
   * integer or $scope variable
   */
  rWidth: number;

  /**
   * integer or $scope variable
   */
  rHeight: number;

  /**
   * Accepts ['top', 'right', 'bottom', 'left']
   * Default ['right']
   */
  rDirections: Direction[];

  /**
   * Default false
   */
  rCenteredX: boolean;

  /**
   * Default false
   */
  rCenteredY: boolean;

  /**
   * Default false
   */
  rFlex: boolean;

  /**
   * Defines custom inner html for the grabber.
   * Default <span></span>
   */
  rGrabber: string;

  /**
   *
   */
  rDisabled: string;

  /**
   *
   */
  rNoThrottle: boolean;
}
