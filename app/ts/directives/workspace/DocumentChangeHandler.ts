import Delta from '../../editor/Delta';
import Document from '../../editor/Document';

/**
 *
 */
interface DocumentChangeHandler {
    (delta: Delta, source: Document): any;
}

export default DocumentChangeHandler;
