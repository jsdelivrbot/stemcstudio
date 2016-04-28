import Anchor from './Anchor';
import Document from './Document';

export default function createAnchor(doc: Document, row: number, column: number): Anchor {
    return new Anchor(doc, row, column);
}
