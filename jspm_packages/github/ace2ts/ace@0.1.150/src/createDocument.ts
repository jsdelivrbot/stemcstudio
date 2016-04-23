import Document from './Document';

export default function createDocument(textOrLines: string | string[]): Document {
    return new Document(textOrLines);
}
