import { Diff } from './Diff';
import { DMP } from './DMP';
import { Patch } from './Patch';
import { MwEditor } from './MwEditor';

const dmp = new DMP();

/**
 * The server does not maintain a real editor.
 * It may be interesting to consider the benefits of more functionality.
 */
export class ServerObj implements MwEditor {
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
        // console.lg(`onSentDiff: ${JSON.stringify(diffs, null, 2)}`);
    }
    release(): number {
        return 0;
    }
}
