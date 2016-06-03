import Diff from './Diff';
import Patch from './Patch';

/**
 * The adapter on the user's editor.
 */
interface MwEditor {
    getText(): string;
    setText(text: string): void;
    /**
     * @param patches The patches to be applied.
     * @returns An array of booolean flags indicating whether each patch could be applied.
     */
    patch(patches: Patch[]): boolean[];
    onSentDiff(diffs: Diff[]);

    /**
     * A reference to this editor is no longer being used.
     */
    release(): number;
}

export default MwEditor;
