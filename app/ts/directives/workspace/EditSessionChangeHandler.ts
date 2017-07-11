import { Delta } from 'editor-document';
import { EditSession } from '../../editor/EditSession';

/**
 *
 */
export interface EditSessionChangeHandler {
    (delta: Delta, source: EditSession): any;
}
