import Delta from '../../widgets/editor/Delta';
import EditSession from '../../widgets/editor/EditSession';

/**
 * TODO: This could be an ACE interface.
 */
interface ChangeHandler {
    (delta: Delta, session: EditSession): any
}

export default ChangeHandler;
