import MwBroadcast from './MwBroadcast';
import { ACTION_RAW_OVERWRITE, ACTION_RAW_SYNCHONLY } from './MwAction';
import { ACTION_DELTA_OVERWRITE, ACTION_DELTA_MERGE } from './MwAction';
import { ACTION_NULLIFY_UPPERCASE, ACTION_NULLIFY_LOWERCASE } from './MwAction';
import MwChange from './MwChange';
import { MwDocument } from './MwDocument';
import MwEdits from './MwEdits';
import { MwOptions } from './MwOptions';
import MwRemote from './MwRemote';
import MwShadow from './MwShadow';
import { MwWorkspace } from './MwWorkspace';

/**
 * The smallest level of synchronization (a file).
 */
export default class MwUnit {
    /**
     * 
     */
    private doc: MwDocument | undefined;

    /**
     * The server will have multiple remotes corresponsing to each client
     * whereas a client will have one remote corresponding to the server.
     */
    private remotes: { [nodeId: string]: MwRemote } = {};

    /**
     * A lightweight constructor that initializes the workspace and options properties.
     */
    constructor(private readonly workspace: MwWorkspace, private readonly options: MwOptions) {
        // Do nothing yet.
    }

    /**
     * A broadcast is the collection of edits for all peer nodes.
     * In the case of the client, there will only be one peer node which is the server.
     * This is dead code on the client side.
     */
    public getBroadcast(): MwBroadcast {
        const broadcast: MwBroadcast = {};
        const nodeIds = Object.keys(this.remotes);
        for (const nodeId of nodeIds) {
            broadcast[nodeId] = this.getEdits(nodeId);
        }
        return broadcast;
    }

    /**
     * 1. Ensure that there is a remote (shadow) for the specified room.
     * 2. Perform the diff between the editor and the shadow.
     * 3. Push the diff onto the outbound stack of edits.
     * 4. Return ths state of the outbound edits.
     *
     * roomId is the identifier for where the edits will be going to.
     */
    getEdits(roomId: string): MwEdits {
        const remote = this.ensureRemote(roomId);
        if (this.doc) {
            const change = this.captureFile(roomId) as MwChange;
            remote.addChange(roomId, change);
        }
        return remote.getEdits(roomId);
    }

    getEditor(): MwDocument {
        return this.doc as MwDocument;
    }

    /**
     * Let's the unit know which file is will be controlling.
     */
    setEditor(doc: MwDocument): void {
        this.doc = doc;
    }

    /**
     *
     */
    private addRemote(nodeId: string, remote: MwRemote): void {
        this.remotes[nodeId] = remote;
    }

    /**
     * Capturing the file involves creating the diff between the editor and the shadow document.
     * This method also copies the editor contents to the shadow.
     */
    private captureFile(nodeId: string): MwChange | undefined {
        const remote = this.ensureRemote(nodeId);
        const shadow = remote.shadow;
        const doc = this.doc;
        if (doc) {
            const text = doc.getText();
            if (shadow) {
                if (shadow.happy) {
                    return shadow.createDiffTextChange(text);
                }
                else {
                    if (remote.containsRawAction(nodeId, text)) {
                        // Ignore
                        return void 0;
                    }
                    else {
                        // The last delta postback from the server to this shareObj didn't match.
                        // Send a full text dump to get back in sync.  This will result in any
                        // changes since the last postback being wiped out. :(
                        // Notice that updating the shadow text and incrementing the local version happens BEFORE.
                        return shadow.createFullTextChange(text, true);
                    }
                }
            }
            else {
                const shadow = remote.ensureShadow();
                return shadow.createFullTextChange(text, true);
            }
        }
        else {
            throw new Error("Must be an editor to capture a file.");
        }
    }

    /**
     * 
     */
    ensureRemote(roomId: string): MwRemote {
        const existing = this.remotes[roomId];
        if (!existing) {
            const remote = new MwRemote(this.options);
            this.addRemote(roomId, remote);
            return remote;
        }
        else {
            return existing;
        }
    }

    /**
     * Handles 'edits' sent from the remote server.
     * The UnitListener has already dispatched to this MwUnit based upon the file 'path' property.
     * roomId is the identifier of the node or room that the edits came from.
     * path appears here because MwUnit and WsFile don't know the file path
     * edits are the changes.
     */
    public setEdits(roomId: string, path: string, edits: MwEdits): void {
        for (const change of edits.x) {
            this.setChange(roomId, path, change);
        }
    }

    /**
     * Handles 'edits' sent from the remote server.
     */
    public setChange(roomId: string, path: string, change: MwChange): void {
        const remote = this.ensureRemote(roomId);
        const action = change.a;
        if (action) {
            switch (action.c) {
                case ACTION_RAW_OVERWRITE: {
                    const doc = this.ensureDocument(path, roomId, change);
                    const text = decodeURI(action.x as string);
                    doc.setText(text);
                    const shadow = remote.ensureShadow();
                    // The action local version becomes our remote version.
                    shadow.updateRaw(text, action.n as number);
                    remote.discardChanges(roomId);
                    break;
                }
                case ACTION_RAW_SYNCHONLY: {
                    const text = decodeURI(action.x as string);
                    const shadow = remote.shadow as MwShadow;
                    // const shadow = link.ensureShadow(change.f, this.useBackupShadow);
                    // The action local version becomes our remote version.
                    shadow.updateRaw(text, action.n as number);
                    remote.discardChanges(roomId);
                    break;
                }
                case ACTION_DELTA_OVERWRITE:
                case ACTION_DELTA_MERGE: {
                    const doc = this.doc as MwDocument;
                    const shadow = remote.shadow as MwShadow;
                    const backup = remote.backup as MwShadow;
                    // The change remote version becomes our local version.
                    // The action local version becomes our remote version.
                    remote.patchDelta(roomId, doc, action.c, action.x as string[], change.m, action.n as number);
                    backup.copy(shadow);
                    if (typeof change.m === 'number') {
                        remote.discardActionsLe(roomId, change.m);
                    }
                    break;
                }
                case ACTION_NULLIFY_UPPERCASE:
                case ACTION_NULLIFY_LOWERCASE: {
                    // We are deleting the file in response to a master delete elsewhere.
                    // Thus we are acting in the slave role.
                    this.workspace.deleteFile(path, false);
                    if (typeof change.m === 'number') {
                        remote.discardActionsLe(roomId, change.m);
                    }
                    remote.discardChanges(roomId);
                    break;
                }
                default: {
                    console.warn(`Unknown action code: ${action.c}`);
                }
            }
        }
        else {
            if (typeof change.m === 'number') {
                remote.discardActionsLe(roomId, change.m);
            }
        }
    }

    /**
     * 
     */
    private ensureDocument(path: string, roomId: string, change: MwChange): MwDocument {
        if (!this.doc) {
            this.doc = this.workspace.createFile(path, roomId, change);
        }
        return this.doc;
    }
}
