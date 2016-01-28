import Document from './Document';
import EditSession from './EditSession';

export default function createEditSession(doc: Document): EditSession {
    return new EditSession(doc);
}
