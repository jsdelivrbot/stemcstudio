import { Patch } from './Patch';

/**
 * The adapter on the user's editor.
 * It may be more appropriate to think of this as the interface to a document.
 * The access is asynchronous because the data is typically stored in a remote database.
 */
export interface MwEditor {
    /**
     * 
     */
    getText(callback: (err: Error, text: string) => any): void;

    /**
     * 
     */
    setText(text: string, callback: (err: Error) => any): void;

    /**
     * The callback provides an array of boolean flags indicating whether each patch could be applied.
     * @param patches The patches to be applied.
     */
    patch(patches: Patch[], callback: (err: Error, reply: boolean[]) => any): void;

    /**
     * A reference to this editor is no longer being used.
     */
    release(): number;
}
