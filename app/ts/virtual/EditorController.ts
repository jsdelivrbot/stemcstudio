import { EditSession } from './editor';

export interface EditorController {
    getSession(): EditSession | undefined;
    setSession(session: EditSession | undefined): void;

    sessionOrThrow(): EditSession;
}
