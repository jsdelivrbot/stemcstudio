import {mustBeTruthy} from './asserts';
import MwChange from './MwChange';
import MwLink from './MwLink';
import MwEdit from './MwEdit';
import MwEditor from './MwEditor';
import MwShadow from './MwShadow';
import MwWorkspace from './MwWorkspace';

/**
 * A node in a network of links and the text of all files.
 * In a client-server environment, the client will have only one link.
 * In a client-server environment, the server may have several links.
 * Peer-to-peer topologies are also possible.
 * The identifier must be unique and unchanging.
 */
export default class MwNode {

    /**
     * The editor adapters.
     */
    public editors: { [fileId: string]: MwEditor } = {};

    /**
     * In a client-server topology, a client would have only one link to the server.
     * However, the server could support many clients.
     */
    private links: { [nodeId: string]: MwLink } = {};

    /**
     * The workspace adapter.
     * This is the counterpart of this node.
     */
    private workspace: MwWorkspace;

    /**
     * @param id Uniquely identifies this node.
     * @param workspace
     * @param makeBackup Determines whether this node will use a Backup Shadow.
     */
    constructor(public id: string, workspace: MwWorkspace) {
        this.workspace = workspace;
    }

    /**
     * Adds an editor to this node.
     *
     * @param fileId
     * @param editor
     */
    addEditor(fileId: string, editor: MwEditor) {
        this.editors[fileId] = editor;
        const owners = Object.keys(this.links);
        const iLen = owners.length;
        for (let i = 0; i < iLen; i++) {
            const owner = owners[i];
            const link = this.links[owner];
            const shadow = link.ensureShadow(fileId);
            shadow.updateTextAndIncrementLocalVersion(editor.getText());
        }
    }

    removeEditor(fileId: string): void {
        const editor = this.editors[fileId];
        if (editor) {
            this.workspace.deleteEditor(editor);
            editor.release();
            delete this.editors[fileId];

            const nodeIds = Object.keys(this.links);
            for (let n = 0; n < nodeIds.length; n++) {
                const nodeId = nodeIds[n];
                const link = this.links[nodeId];
                const edit: MwEdit = {
                    s: this.id,
                    t: nodeId,
                    x: [link.removeFile(fileId)]
                };
                link.edits.push(edit);
            }
        }
    }

    /**
     * Adds a link from this node to another node.
     *
     * @param nodeId
     * @param link The link may be subclassed?
     */
    private addLink(nodeId: string, link: MwLink): void {
        this.links[nodeId] = link;
    }

    private ensureLink(nodeId: string): MwLink {
        const existing = this.links[nodeId];
        if (!existing) {
            // TODO: We need a MwLinkFactory!
            const link = new MwLink();
            this.addLink(nodeId, link);
            return link;
        }
        else {
            return existing;
        }
    }

    /**
     * TODO: This exists primarily for testing?
     */
    getEditor(fileId: string): MwEditor {
        return this.editors[fileId];
    }

    /**
     * Captures the workspace as a versioned snapshot,
     * updates the edit stack. The edit stack is what should be
     * sent to the appropriate node for synchronization.
     * 
     * @param nodeId The identifier of the node that the edits will be sent to.
     */
    getEdits(nodeId: string): MwEdit[] {
        const link = this.ensureLink(nodeId);
        this.captureWorkspace(nodeId);
        return link.edits;
    }

    /**
     * Updates the workspace through the adapter and maintains the state of the synchronization.
     * 
     * @param edits The changes received for this node.
     */
    setEdits(edits: MwEdit[]): void {
        const iLen = edits.length;
        for (let i = 0; i < iLen; i++) {
            const edit = edits[i];
            this.setEdit(edit);
        }
    }

    /**
     * Examine all the files in the workspace for changes.
     * This will have the effect of updating the edit
     * stack (more generally, synchronization message)
     * as well as updating the shadow texts and versions.
     * 
     * @param nodeId The target node for which we want to capture edits.
     */
    private captureWorkspace(nodeId: string): void {
        const link = this.ensureLink(nodeId);
        const edit: MwEdit = {
            s: this.id,
            t: nodeId,
            x: []
        };
        const fileIds = Object.keys(this.editors);
        const iLen = fileIds.length;
        for (let i = 0; i < iLen; i++) {
            const fileId = fileIds[i];
            const change = this.captureFile(fileId, link);
            if (change) {
                edit.x.push(change);
            }
        }
        link.edits.push(edit);
    }

    private containsRawAction(link: MwLink, text: string): boolean {
        const edits = link.edits;
        for (let i = 0; i < edits.length; i++) {
            const edit = edits[i];
            const changes = edit.x;
            if (changes.length === 1) {
                const change = changes[0];
                const action = change.a;
                if (action && action.c === 'R' && action.x === text) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
        return false;
    }

    private captureFile(fileId: string, link: MwLink): MwChange {
        mustBeTruthy(link, `link must be a MwLink (${typeof link})`);
        const shadow: MwShadow = link.shadows[fileId];
        const editor: MwEditor = this.editors[fileId];
        const text = editor.getText();
        if (shadow) {
            if (shadow.happy) {
                return shadow.createDiffTextChange(text, fileId);
            }
            else {
                if (this.containsRawAction(link, text)) {
                    // Ignore
                    return void 0;
                }
                else {
                    // The last delta postback from the server to this shareObj didn't match.
                    // Send a full text dump to get back in sync.  This will result in any
                    // changes since the last postback being wiped out. :(
                    // Notice that updating the shadow text and incrementing the local version happens BEFORE.
                    return shadow.createFullTextChange(text, fileId, true);
                }
            }
        }
        else {
            const shadow = link.ensureShadow(fileId);
            return shadow.createFullTextChange(text, fileId, true);
        }
    }

    private setEdit(edit: MwEdit): void {
        if (edit.t !== this.id) {
            throw new Error(`edit ${edit.t} is not for this node ${this.id}`);
        }
        const link = this.ensureLink(edit.s);
        const iLen = edit.x.length;
        for (let i = 0; i < iLen; i++) {
            const change = edit.x[i];
            const action = change.a;
            if (action) {
                switch (action.c) {
                    case 'R': {
                        const editor = this.ensureEditor(change.f);
                        const text = decodeURI(<string>action.x);
                        editor.setText(text);
                        const shadow = link.ensureShadow(change.f);
                        // The action local version becomes our remote version.
                        shadow.updateRaw(text, action.n);
                        link.discardFileChanges(change.f);
                    }
                        break;
                    case 'r': {
                        const text = decodeURI(<string>action.x);
                        const shadow = link.shadows[change.f];
                        // const shadow = link.ensureShadow(change.f, this.useBackupShadow);
                        // The action local version becomes our remote version.
                        shadow.updateRaw(text, action.n);
                        link.discardFileChanges(change.f);
                    }
                        break;
                    case 'D':
                    case 'd': {
                        const editor = this.editors[change.f];
                        const shadow = link.getShadow(change.f);
                        const backup = link.getBackup(change.f);
                        // The change remote version becomes our local version.
                        // The action local version becomes our remote version.
                        link.patchDelta(change.f, editor, action.c, <string[]>action.x, change.m, action.n);
                        backup.copy(shadow);
                        if (typeof change.m === 'number') {
                            link.discardActionsLe(change.f, change.m);
                        }
                    }
                        break;
                    case 'N':
                    case 'n': {
                        this.removeEditor(change.f);
                        if (typeof change.m === 'number') {
                            link.discardActionsLe(change.f, change.m);
                        }
                        link.discardFileChanges(change.f);
                    }
                        break;
                    default: {
                        console.warn(`Unknown code: ${action.c}`);
                    }
                }
            }
            else {
                if (typeof change.m === 'number') {
                    link.discardActionsLe(change.f, change.m);
                }
            }
        }
    }

    private ensureEditor(fileId: string): MwEditor {
        const existing = this.editors[fileId];
        if (!existing) {
            const editor = this.workspace.createEditor();
            this.addEditor(fileId, editor);
            return editor;
        }
        else {
            return existing;
        }
    }
}
