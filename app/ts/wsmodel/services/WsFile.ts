import applyPatchToDocument from './applyPatchToDocument';
import Document from '../../editor/Document';
import EditSession from '../../editor/EditSession';
import Shareable from '../../base/Shareable';
import MwUnit from '../../synchronization/MwUnit';
import MwEditor from '../../synchronization/MwEditor';
import Patch from '../../synchronization/Patch';

export default class WsFile implements MwEditor, Shareable {

    /**
     * The editSession is (almost) an implementation detail except:
     * 1. It is bound to an ng-model.
     * 2. It's used in MissionControl
     */
    public editSession: EditSession;
    public unit: MwUnit;

    /**
     * This might equally well be called the 'mode' because we don't change the language easily.
     * Note that the editSession contains a $mode: LanguageMode.
     * TODO: Rename to 'mode'.
     * TODO: Eventually, we would like the mode to be extensible.
     */
    language: string;

    /**
     * The file is open for editing.
     */
    public isOpen = true;

    /**
     * 
     */
    public preview = false;

    /**
     * Let's us know if this file exists in GitHub.
     */
    public raw_url: string;

    /**
     * 
     */
    public selected: boolean = false;

    /**
     * 
     */
    private refCount = 1;

    /**
     *
     */
    constructor() {
        // Do nothing yet.
        console.log("WsFile.constructor");
    }

    /**
     * 
     */
    protected destructor(): void {
        console.log("WsFile.destructor");
        this.setSession(void 0);
    }

    public setSession(editSession: EditSession) {
        if (this.editSession === editSession) {
            return;
        }
        if (this.editSession) {
            this.editSession.release();
            this.editSession = void 0;
        }
        if (editSession) {
            // console.lg("WsFile.constructor");
            if (!(editSession instanceof EditSession)) {
                throw new TypeError("editSession must be an EditSession");
            }
            this.editSession = editSession;
            this.editSession.addRef();
        }
    }

    clone(): WsFile {
        // There is currently no clone() method on an EditSession so we lose information.
        const copy = new WsFile();
        copy.setText(this.getText())
        copy.isOpen = this.isOpen;
        copy.language = this.language;
        copy.raw_url = this.raw_url;
        copy.selected = this.selected;
        // copy.size = this.size;
        // copy.truncated = this.truncated;
        // copy.type = this.type;
        return copy;
    }

    /**
     * 
     */
    addRef(): number {
        this.refCount++;
        return this.refCount;
    }

    /**
     * 
     */
    release(): number {
        this.refCount--;
        if (this.refCount === 0) {
            this.destructor();
        }
        else if (this.refCount < 0) {
            throw new Error("refCount has dropped below zero.");
        }
        return this.refCount;
    }

    getText(): string {
        if (this.editSession) {
            return this.editSession.getValue();
        }
        else {
            console.warn("WsFile.getValue() called when editSession is not defined.");
            return void 0;
        }
    }

    setText(text: string): void {
        if (typeof text === 'string') {
            if (this.editSession) {
                this.editSession.setValue(text);
            }
            else {
                const session = new EditSession(new Document(text));
                // const unit = new MwUnit();
                this.setSession(session);
                session.release();
            }
        }
        else {
            throw new TypeError("text must be a string.");
        }
    }

    patch(patches: Patch[]): boolean[] {
        const document = this.editSession.getDocument();
        for (let i = 0; i < patches.length; i++) {
            const patch = patches[i];
            /* const {start, length, applied} = */ applyPatchToDocument(patch, document);
            // The results of aplying the patch as a collection of diffs.
        }
        // this.editor.
        return [];
    }

    onSentDiff() {
        // Ignore.
    }
}