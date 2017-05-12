import { applyPatchToDocument } from './applyPatchToDocument';
import { EventBus } from './EventBus';
import Shareable from '../../base/Shareable';
import MwUnit from '../../synchronization/MwUnit';
import { MwDocument } from '../../synchronization/MwDocument';
import Patch from '../../synchronization/Patch';
import { WsModel } from './WsModel';
//
// Editor Abstraction Layer.
//
import { Editor } from '../../virtual/editor';
import { EditorService } from '../../virtual/editor';
import { EditSession } from '../../virtual/editor';
import { LanguageModeId } from '../../virtual/editor';

/**
 * This class corresponds to a file at a particular path in a workspace.
 * It's members reflect the various states that a workspace file can be
 * in, these states usually arising from performance considerations.
 * 
 * The lowest level of activation of the file uses a Document as the means
 * to store the content. We don't use a string to avoid duplication of the
 * data when a session is required.
 * 
 * The next level of activation is the EditSession. This provides undo/redo
 * but there need not be a user interface. The EditSession is has a 
 * Document property and automatically listens for Document changes.
 * When the language mode is known, the session may start a worker thread to
 * perform background syntax analysis. Syntax errors may be collected and displayed
 * even if there is no corresponding Editor for the file.
 * 
 * The highest level of activation is the Editor. This provides a user interface.
 * The Editor has a session property.
 * 
 * We lazily create the least costly representation required. However, the
 * Editor is created in the user interface layer as part of an AngularJS directive.
 * This directive informs its controller of the lifecycle of the editor and these
 * events are forwarded to the workspace, allowing the editor property of this file
 * to reflect the existence of an Editor in the user interface.
 */
export class WsFile implements MwDocument, Shareable {

    /**
     * A weak reference to the editor.
     */
    private editor: Editor | undefined;
    private readonly editorBus = new EventBus<'editor', { oldEditor: Editor | undefined; newEditor: Editor | undefined }, WsFile>(this);
    /**
     * Events recording the changing of the editor property.
     */
    public readonly editorEvents = this.editorBus.events('editor');

    /**
     * The editSession is (almost) an implementation detail except that
     * it is bound to an ng-model. In all other cases, calls to getSession
     * will lazily create a session and the instance will be reference counted.
     */
    private session: EditSession | undefined;

    /**
     * The synchronization data (shadow, backup, versions, etc).
     */
    public unit: MwUnit;

    /**
     * The language mode name.
     * This is called the 'mode' because we don't change the language easily.
     * Note that the editSession contains a $mode: LanguageMode.
     * TODO: Eventually, we would like the mode to be extensible.
     */
    mode: LanguageModeId | undefined;

    /**
     * The file is open for editing.
     */
    public isOpen = false;

    /**
     * 
     */
    public htmlChoice = false;

    /**
     * 
     */
    public markdownChoice = false;

    /**
     * Let's us know if this file exists in GitHub.
     * When deleting files, this lets us know if we need to "nullify" the file.
     */
    public existsInGitHub = false;

    /**
     * Let's us know that the file has diagnostic errors.
     */
    public tainted = false;

    /**
     * 
     */
    public selected = false;

    /**
     * 
     */
    private refCount = 1;

    /**
     * A weak reference to the workspace that owns this file.
     */
    private workspace: WsModel | undefined;

    /**
     * @param workspace
     */
    constructor(public readonly isExternal: boolean, workspace: WsModel, private editorService: EditorService) {
        this.workspace = workspace;
    }

    /**
     * 
     */
    protected destructor(): void {
        this.setSession(void 0);
        this.workspace = void 0;
    }

    public setSession(session: EditSession | undefined) {
        if (this.session === session) {
            return;
        }
        if (this.session) {
            // TODO: detachSession
            // this.workspace.detachSession()
            this.session.release();
            this.session = void 0;
        }
        if (session) {
            this.session = session;
            this.session.addRef();
            // TODO: attachSession
        }
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

    /**
     * Returns a weak reference to the Editor.
     */
    getEditor(): Editor | undefined {
        if (this.editor) {
            return this.editor;
        }
        else {
            return void 0;
        }
    }

    setEditor(newEditor: Editor | undefined) {
        const oldEditor = this.editor;
        this.editor = newEditor;
        this.editorBus.emitAsync('editor', { oldEditor, newEditor });
    }

    hasEditor(): boolean {
        return this.editor ? true : false;
    }

    /**
     * FIXME: Really ensureSession
     * The caller must release the session reference when no longer needed.
     */
    getSession(): EditSession {
        if (this.session) {
            this.session.addRef();
            return this.session;
        }
        else {
            // TODO: This means that the WsFile needs to have a factory.
            const session = this.editorService.createSession("");
            // TODO: Do some mode-based session initialization here.
            this.setSession(session);
            return session;
        }
    }

    hasSession(): boolean {
        return this.session ? true : false;
    }

    getText(): string {
        if (this.session) {
            return this.session.getValue();
        }
        else {
            console.warn("WsFile.getValue() called when text is not defined.");
            throw new Error("missing document");
        }
    }

    /**
     * Sets the text on the edit session, which is guaranteed to exist.
     * A `change` event will be emitted on the document.
     */
    setText(text: string): void {
        if (typeof text === 'string') {
            if (this.session) {
                this.session.setValue(text);
            }
            else {
                const session = this.editorService.createSession(text);
                this.setSession(session);
                session.release();
            }
        }
        else {
            throw new TypeError("text must be a string.");
        }
    }

    /**
     * Applies patches to this file.
     * TODO: Implement boolean[] of return values.
     */
    patch(patches: Patch[]): boolean[] {
        const session = this.session;
        if (session) {
            for (const patch of patches) {
                const { start, length, applied } = applyPatchToDocument(patch, session);
                // The results of aplying the patch as a collection of diffs.
                // TODO: Used the applied or return everything?
                console.log(`applyPatchToDocument(${patch}) => start=${start}, length=${length}, applied=${applied}`);
            }
        }
        else {
            throw new Error(`Unable to apply patches because session is '${typeof session}'`);
        }
        return [];
    }

    onSentDiff() {
        // Ignore.
    }
}
