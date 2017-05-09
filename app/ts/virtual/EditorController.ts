import { EditSession } from './editor';
import { EditorMinimal } from './EditorMinimal';

export interface EditorController extends EditorMinimal {
    getSession(): EditSession | undefined;
    sessionOrThrow(): EditSession;
}
