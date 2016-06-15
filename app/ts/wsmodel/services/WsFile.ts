import applyPatchToDocument from './applyPatchToDocument';
import Document from '../../editor/Document';
import EditSession from '../../editor/EditSession';
import Editor from '../../editor/Editor';
import Shareable from '../../base/Shareable';
import MwUnit from '../../synchronization/MwUnit';
import MwEditor from '../../synchronization/MwEditor';
import Patch from '../../synchronization/Patch';
import WsModel from './WsModel';

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
 * Editor is created in the user interface layer as part of an Angular directive.
 * This directive informs its controller of the lifecycle of the editor and these
 * events are forwarded to the workspace, allowing the editor property of this file
 * to reflect the existence of an Editor in the user interface.
 */
export default class WsFile implements MwEditor, Shareable {

    public editor: Editor;

    /**
     * The editSession is (almost) an implementation detail except that
     * it is bound to an ng-model. In all other cases, calls to getSession
     * will lazily create a session and the instance will be reference counted.
     */
    private session: EditSession;

    /**
     * The line-oriented textual content.
     */
    public doc: Document;

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
    mode: string;

    /**
     * The file is open for editing.
     */
    public isOpen = false;

    /**
     * 
     */
    public preview = false;

    /**
     * Let's us know if this file exists in GitHub.
     * When deleting files, this lets us know if we need to "nullify" the file.
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
     * A weak reference to the workspace that owns this file.
     */
    private workspace: WsModel;

    /**
     * @param workspace
     */
    constructor(workspace: WsModel) {
        // console.lg("WsFile.constructor");
        this.workspace = workspace;
    }

    /**
     * 
     */
    protected destructor(): void {
        // console.lg("WsFile.destructor");
        this.setSession(void 0);
        this.setDocument(void 0);
        this.workspace = void 0;
    }

    public setSession(session: EditSession) {
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
            if (!(session instanceof EditSession)) {
                throw new TypeError("session must be an EditSession.");
            }
            this.session = session;
            this.session.addRef();
            // TODO: attachSession
        }
    }

    public setDocument(doc: Document) {
        if (this.doc === doc) {
            return;
        }
        if (this.doc) {
            this.doc.release();
            this.doc = void 0;
        }
        if (doc) {
            if (!(doc instanceof Document)) {
                throw new TypeError("doc must be a Document.");
            }
            this.doc = doc;
            this.doc.addRef();
        }
    }

    /**
     * 
     */
    addRef(): number {
        this.refCount++;
        // console.lg(`WsFile.addRef() => ${this.refCount}`);
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
        // console.lg(`WsFile.release() => ${this.refCount}`);
        return this.refCount;
    }

    /**
     *
     */
    getEditor(): Editor {
        if (this.editor) {
            return this.editor;
        }
        else {
            return void 0;
        }
    }

    setEditor(editor: Editor) {
        this.editor = editor;
    }

    hasEditor(): boolean {
        return this.editor ? true : false;
    }

    /**
     * FIXME: Really ensureSession
     */
    getSession(): EditSession {
        if (this.session) {
            this.session.addRef();
            return this.session;
        }
        else if (this.doc) {
            const session = new EditSession(this.doc);
            // TODO: Do some mode-based session initialization here.
            this.setSession(session);
            return session;
        }
        else {
            // May be better to throw an exception here.
            //
            return void 0;
        }
    }

    hasSession(): boolean {
        return this.session ? true : false;
    }

    /**
     * @returns The underlying document. This must be released when no longer required.
     */
    getDocument(): Document {
        if (this.doc) {
            this.doc.addRef();
            return this.doc;
        }
        else {
            // May be better to throw an exception here.
            return void 0;
        }
    }

    hasDocument(): boolean {
        return this.doc ? true : false;
    }

    getText(): string {
        if (this.doc) {
            return this.doc.getValue();
        }
        else {
            console.warn("WsFile.getValue() called when text is not defined.");
            return void 0;
        }
    }

    /**
     * Sets the text on the Document level.
     */
    setText(text: string): void {
        if (typeof text === 'string') {
            if (this.doc) {
                this.doc.setValue(text);
            }
            else {
                const doc = new Document(text);
                this.setDocument(doc);
                doc.release();
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
        for (let i = 0; i < patches.length; i++) {
            const patch = patches[i];
            /* const {start, length, applied} = */ applyPatchToDocument(patch, this.doc);
            // The results of aplying the patch as a collection of diffs.
        }
        return [];
    }

    onSentDiff() {
        // Ignore.
    }
}
