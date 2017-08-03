import { Delta } from '../../editor/Delta';
import { Document } from '../../editor/Document';

/**
 *
 */
export interface DocumentChangeHandler {
    (delta: Delta, source: Document): any;
}
