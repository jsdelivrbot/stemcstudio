import { Diff } from './Diff';
import { Patch } from './Patch';

/**
 * The adapter on the user's document (editor).
 * The central idea to this interface is that it permits:
 * 1. raw overwrite using setText
 * 2. delta merge using patch
 */
export interface MwDocument {

    /**
     * 
     */
    getText(): string;

    /**
     * 
     */
    setText(text: string): void;

    /**
     * Returns an array of boolean flags indicating whether each patch could be applied.
     */
    patch(patches: Patch[]): boolean[];

    /**
     * 
     */
    onSentDiff(diffs: Diff[]): void;

    /**
     * A reference to this editor is no longer being used.
     */
    release(): number;
}
