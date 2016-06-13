import Delta from '../../editor/Delta';
import EditSession from '../../editor/EditSession';

/**
 *
 */
interface EditSessionChangeHandler {
    (delta: Delta, source: EditSession): any;
}

export default EditSessionChangeHandler;
