import Delta from '../../editor/Delta';
import EditSession from '../../editor/EditSession';

/**
 * TODO: This could be an ACE interface?
 */
interface ChangeHandler {
    (delta: Delta, session: EditSession): any;
}

export default ChangeHandler;
