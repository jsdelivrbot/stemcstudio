import IExplorer from './IExplorer';
import IDoodle from '../../services/doodles/IDoodle'
import IDoodleManager from '../../services/doodles/IDoodleManager'

/**
 * @class ExplorerController
 *
 * If I am at liberty to add new views then it follows that the controller should not
 * have knowledge of the inner-workings of the view i.e. the scope?
 *
 */
export default class ExplorerController implements IExplorer {

  /**
   * @property $inject
   * @type string[]
   * @static
   */
  public static $inject: string[] = ['doodles']

  /**
   * @class ExplorerController
   * @constructor
   * @param doodles {IDoodleManager}
   */
  constructor(private doodles: IDoodleManager) {
      // Do nothing
  }

  /**
   * Called  after construction and bindings initialized.
   *
   * @method $onInit
   * @return {void}
   */
  $onInit(): void {
    // Do nothing
  }

  /**
   * @method $onDestroy
   * @return {void}
   */
  $onDestroy(): void {
    // Do nothing
  }

  /**
   * The controller is the action part of event-action.
   * You probably should not have multiple controllers over the same model,
   * at least not duplicating actions; that could lead to inconsistency of actions.
   *
   * What might this local controller do?
   * It could make an optimistic change and wait for a promise to resolve!
   * This 
   *
   * @method openFile
   * @param name {string}
   * @return {void}
   */
  openFile(name: string): void {
    // I think the right thing to do now is to talk to a service that returns a promise.
    // We can make an optimistic local change (maybe) (adjusting the scope?), and wait for the
    // promise to resolve.
    const doodle: IDoodle = this.doodles.current()
    doodle.openFile(name)
    doodle.selectFile(name)
  }

  closeFile(name: string): void {
    const doodle: IDoodle = this.doodles.current()
    doodle.closeFile(name)
  }

  selectFile(name: string): void {
    // I think the right thing to do now is to talk to a service that returns a promise.
    // We can make an optimistic local change (maybe) (adjusting the scope?), and wait for the
    // promise to resolve.
    const doodle: IDoodle = this.doodles.current()
    doodle.selectFile(name)
  }
}
