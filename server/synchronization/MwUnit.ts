// import FzSerializable from './ds/FzSerializable';
// import FzUnit from './ds/FzUnit';
// import MwBroadcast from './MwBroadcast';
import MwChange from './MwChange';
import MwEdits from './MwEdits';
import MwEditor from './MwEditor';
import MwRemote from './MwRemote';
import MwShadow from './MwShadow';
import MwWorkspace from './MwWorkspace';
// import FzRemote from './ds/FzRemote';
// import dehydrateMap from './ds/dehydrateMap';

/**
 * The smallest level of synchronization (a file).
 */
export default class MwUnit {
    private editor: MwEditor;
    private remotes: { [nodeId: string]: MwRemote } = {};
    constructor(private workspace: MwWorkspace) {
        // Do nothing yet.
    }
    /*
    getBroadcast(): MwBroadcast {
        const broadcast: MwBroadcast = {};
        const nodeIds = Object.keys(this.remotes);
        for (let i = 0; i < nodeIds.length; i++) {
            const nodeId = nodeIds[i];
            broadcast[nodeId] = this.getEdits(nodeId);
        }
        return broadcast;
    }
    */
    /**
     * @param nodeId The identifier for where the edits will be going to.
     */
    getEdits(nodeId: string, callback: (err: Error, edits: MwEdits) => any): void {
        const remote = this.ensureRemote(nodeId);
        if (this.editor) {
            this.captureFile(nodeId, function(err: Error, change: MwChange) {
                if (!err) {
                    remote.addChange(nodeId, change);
                    callback(void 0, remote.getEdits(nodeId));
                }
                else {
                    callback(err, void 0);
                }
            });
        }
        else {
            callback(new Error("editor is not defined."), void 0);
        }
    }
    getEditor(): MwEditor {
        return this.editor;
    }
    setEditor(editor: MwEditor): void {
        this.editor = editor;
    }
    removeEditor(): void {
        const editor = this.editor;
        if (editor) {
            this.workspace.deleteEditor(editor);
            editor.release();
            this.editor = void 0;

            const nodeIds = Object.keys(this.remotes);
            for (let n = 0; n < nodeIds.length; n++) {
                const nodeId = nodeIds[n];
                const remote = this.remotes[nodeId];
                remote.addChange(nodeId, remote.removeFile());
            }
        }
    }
    private addRemote(nodeId: string, remote: MwRemote): void {
        this.remotes[nodeId] = remote;
    }
    private captureFile(nodeId: string, callback: (err: Error, change: MwChange) => any): void {
        const remote = this.ensureRemote(nodeId);
        const shadow: MwShadow = remote.shadow;
        const editor: MwEditor = this.editor;
        if (editor) {
            editor.getText(function(err: Error, text: string) {
                if (!err) {
                    if (shadow) {
                        if (shadow.happy) {
                            callback(void 0, shadow.createDiffTextChange(text));
                        }
                        else {
                            if (remote.containsRawAction(nodeId, text)) {
                                // Ignore
                                callback(void 0, void 0);
                            }
                            else {
                                // The last delta postback from the server to this shareObj didn't match.
                                // Send a full text dump to get back in sync.  This will result in any
                                // changes since the last postback being wiped out. :(
                                // Notice that updating the shadow text and incrementing the local version happens BEFORE.
                                callback(void 0, shadow.createFullTextChange(text, true));
                            }
                        }
                    }
                    else {
                        const shadow = remote.ensureShadow();
                        callback(void 0, shadow.createFullTextChange(text, true));
                    }
                }
                else {
                    callback(new Error("Unable to get text from editor."), void 0);
                }
            });
        }
        else {
            callback(new Error("Must be an editor to capture a file."), void 0);
        }
    }
    ensureRemote(nodeId: string): MwRemote {
        const existing = this.remotes[nodeId];
        if (!existing) {
            // TODO: We need a MwRemoteFactory!
            const remote = new MwRemote();
            this.addRemote(nodeId, remote);
            return remote;
        }
        else {
            return existing;
        }
    }

    /**
     * This is a synchronous implementaton (becoming asynchronous)?
     * @param nodeId The identifier of the node or room that the edits came from.
     * @param edits
     */
    public setEdits(nodeId: string, edits: MwEdits): void {
        /*
        if (edit.t !== this.id) {
            throw new Error(`edit ${edit.t} is not for this node ${this.id}`);
        }
        */
        const remote = this.ensureRemote(nodeId);
        const iLen = edits.x.length;
        for (let i = 0; i < iLen; i++) {
            const change = edits.x[i];
            const action = change.a;
            if (action) {
                switch (action.c) {
                    case 'R': {
                        const editor = this.ensureEditor();
                        const text = decodeURI(<string>action.x);
                        editor.setText(text, function(err: Error) {
                            if (!err) {
                                const shadow = remote.ensureShadow();
                                // The action local version becomes our remote version.
                                shadow.updateRaw(text, action.n);
                                remote.discardChanges(nodeId);
                            }
                            else {
                                // FIXME TODO!!!
                            }
                        });
                    }
                        break;
                    case 'r': {
                        const text = decodeURI(<string>action.x);
                        const shadow = remote.shadow;
                        // const shadow = link.ensureShadow(change.f, this.useBackupShadow);
                        // The action local version becomes our remote version.
                        shadow.updateRaw(text, action.n);
                        remote.discardChanges(nodeId);
                    }
                        break;
                    case 'D':
                    case 'd': {
                        const editor = this.editor;
                        const shadow = remote.shadow;
                        const backup = remote.backup;
                        // The change remote version becomes our local version.
                        // The action local version becomes our remote version.
                        remote.patchDelta(nodeId, editor, action.c, <string[]>action.x, change.m, action.n, function(err: Error) {
                            backup.copy(shadow);
                            if (typeof change.m === 'number') {
                                remote.discardActionsLe(nodeId, change.m);
                            }
                        });
                    }
                        break;
                    case 'N':
                    case 'n': {
                        this.removeEditor();
                        if (typeof change.m === 'number') {
                            remote.discardActionsLe(nodeId, change.m);
                        }
                        remote.discardChanges(nodeId);
                    }
                        break;
                    default: {
                        console.warn(`Unknown code: ${action.c}`);
                    }
                }
            }
            else {
                if (typeof change.m === 'number') {
                    remote.discardActionsLe(nodeId, change.m);
                }
            }
        }
    }
    ensureEditor(): MwEditor {
        if (!this.editor) {
            this.editor = this.workspace.createEditor();
        }
        return this.editor;
    }
}
