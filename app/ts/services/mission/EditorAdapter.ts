import MwEditor from '../../modules/synchronization/MwEditor';
import Patch from '../../modules/synchronization/Patch';
import Editor from '../../widgets/editor/Editor';


export default class EditorAdapter implements MwEditor {
    constructor(public editor: Editor) {
        // Do nothin yet.
    }
    getText(): string {
        return this.editor.getValue();
    }
    setText(text: string): void {
        this.editor.setValue(text/*, cursorPos*/);
    }
    patch(patches: Patch[]): boolean[] {
        return [];
    }
    onSentDiff() {
        // Ignore.
    }
    release(): number {
        return 0;
    }
}
