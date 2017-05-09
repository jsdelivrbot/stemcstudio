import { EditSession } from './editor';

export interface EditorMinimal {
    /**
     * 
     */
    setSession(session: EditSession | undefined): void;
    /**
     * 
     */
    dispose(): void;
}
