import { DMP } from '../../synchronization/DMP';
import { Patch } from '../../synchronization/Patch';
import { MwEditor } from '../../synchronization/MwEditor';

const dmp = new DMP();

/**
 * The server does not maintain a real editor.
 * FIXME: This does not implement the asynchronous contract of MwEditor.
 */
export class ServerEditor implements MwEditor {
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
        const newText = result[0];
        const flags = result[1];
        // Set the new text only if there is a change to be made.
        if (oldText !== newText) {
            // The following will probably destroy any cursor or selection.
            // Widgets with cursors should override and patch more delicately.
            this.setText(newText);
        }
        return flags;
    }
    release(): number {
        return 0;
    }
}
