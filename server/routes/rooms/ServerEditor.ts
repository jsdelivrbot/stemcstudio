import Diff from '../../synchronization/Diff';
import DMP from '../../synchronization/DMP';
import Patch from '../../synchronization/Patch';
import MwEditor from '../../synchronization/MwEditor';

const dmp = new DMP();

/**
 * The server does not maintain a real editor.
 */
export default class ServerEditor implements MwEditor {
    private _text = "";
    /**
     * We'll use DMP to convert patchhes into a full text replacement.
     */
    getText(): string {
        return this._text;
    }
    setText(text: string): void {
        this._text = text;
    }
    patch(patches: Patch[]): boolean[] {
        const oldText = this.getText();
        const result = dmp.patch_apply(patches, oldText);
        const newText = <string>result[0];
        const flags = <boolean[]>result[1];
        // Set the new text only if there is a change to be made.
        if (oldText !== newText) {
            // The following will probably destroy any cursor or selection.
            // Widgets with cursors should override and patch more delicately.
            this.setText(newText);
        }
        return flags;
    }
    onSentDiff(diffs: Diff[]): void {
        // console.log(`onSentDiff: ${JSON.stringify(diffs, null, 2)}`);
    }
    release(): number {
        return 0;
    }
}
