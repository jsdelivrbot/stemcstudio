import Diff from './Diff';
import DMP from './DMP';
import { Patch } from './Patch';
import { ACTION_RAW_OVERWRITE } from './MwAction';
import { MwEditor } from './MwEditor';
import { MwWorkspace } from './MwWorkspace';
import { MwUnit } from './MwUnit';
import ServerObj from './ServerObj';

function inspect<T>(message: string, value: T): T { console.log(`${message}\n${JSON.stringify(value, null, 2)}`); return value; }

const dmp = new DMP();

const aRoomId = 'Alice';
const bRoomId = 'Bobby';
const sRoomId = 'Steve';

/**
 * 
 */
class EditorFile implements MwEditor {
    private text;
    constructor() {
        // Do nothing.
    }
    getText(): string {
        return this.text;
    }
    setText(text: string): void {
        this.text = text;
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
    onSentDiff(diff: Diff[]): void {
        // Ignore.
    }
    release(): number {
        return 0;
    }
}

class EditorFileFactory implements MwWorkspace {
    createEditor(): MwEditor {
        return new EditorFile();
    }
    deleteEditor(editor: MwEditor) {
        // Ignore.
    }
}

class ServerFileFactory implements MwWorkspace {
    createEditor(): MwEditor {
        return new ServerObj();
    }
    deleteEditor(editor: MwEditor) {
        // Ignore.
    }
}

const eff = new EditorFileFactory();
const sff = new ServerFileFactory();

/**
 * Utility function to perform synchronization between two nodes one way.
 */
function syncFromTo(from: MwUnit, fromRoomId: string, to: MwUnit, toRoomId: string, peek?: boolean) {
    if (peek) {
        inspect(fromRoomId, from);
        inspect(toRoomId, to);
    }
    const edits = from.getEdits(toRoomId);
    if (peek) {
        inspect(`Create message ${fromRoomId} => ${toRoomId}`, edits);
    }
    if (peek) {
        // The from node will change in creation of th message.
        inspect(fromRoomId, from);
    }
    if (peek) {
        inspect(`Send message ${fromRoomId} => ${toRoomId}`, edits);
    }
    to.setEdits(fromRoomId, edits);
    if (peek) {
        // The to node will change upon receipt of the message.
        inspect(`Receiver: ${toRoomId}`, to);
    }
}

function broadcastFrom(from: MwUnit, fromRoomId: string, targets: { [nodeId: string]: MwUnit }) {
    const broadcast = from.getBroadcast();
    const nodeIds = Object.keys(broadcast);
    for (let i = 0; i < nodeIds.length; i++) {
        const nodeId = nodeIds[i];
        const edits = broadcast[nodeId];
        const target = targets[nodeId];
        target.setEdits(fromRoomId, edits);
    }

}

describe("MwUnit", function () {
    describe("Alice synchronizes with server one way", function () {
        it("should add the file to Server room", function () {
            const initialString = "Macs had the original point and click UI.";
            const aString = "Macintoshes had the original point and click UI.";

            const sNode = new MwUnit(sff);
            const aNode = new MwUnit(eff);

            const aEditor = new EditorFile();
            aEditor.setText(initialString);
            aNode.setEditor(aEditor);

            syncFromTo(aNode, aRoomId, sNode, sRoomId);

            const sEditor = sNode.getEditor();

            expect(sEditor.getText()).toBe(initialString);

            aEditor.setText(aString);

            syncFromTo(aNode, aRoomId, sNode, sRoomId);

            expect(sEditor.getText()).toBe(aString);
        });
    });
    describe("Alice synchronizes with server and gets response", function () {
        it("should add the file to Server room", function () {
            const initialString = "Macs had the original point and click UI.";
            const aString = "Macintoshes had the original point and click UI.";

            const sNode = new MwUnit(sff);
            const aNode = new MwUnit(eff);

            const editor = new EditorFile();
            editor.setText(initialString);
            aNode.setEditor(editor);

            syncFromTo(aNode, aRoomId, sNode, sRoomId);

            syncFromTo(sNode, sRoomId, aNode, aRoomId);

            const serverFile = sNode.getEditor();

            expect(serverFile.getText()).toBe(initialString);

            editor.setText(aString);

            syncFromTo(aNode, aRoomId, sNode, sRoomId);

            expect(serverFile.getText()).toBe(aString);
        });
    });
    describe("Bob joins the room", function () {

        const sNode = new MwUnit(sff);
        const aNode = new MwUnit(eff);

        // Alice add a file.
        const aEditor = new EditorFile();
        aEditor.setText("The quick brown fox jumped over the lazy dogs.");
        aNode.setEditor(aEditor);

        // Alice synchronizes the file to the server.
        sNode.setEdits(aRoomId, aNode.getEdits(sRoomId));

        // Server synchronizes the file back to Alice.
        aNode.setEdits(sRoomId, sNode.getEdits(aRoomId));

        const bNode = new MwUnit(eff);

        syncFromTo(sNode, sRoomId, bNode, bRoomId);

        const bEditor = bNode.getEditor();

        it("should add the file to Bob's room", function () {
            expect(bEditor.getText()).toBe(aEditor.getText());
        });
    });
    describe("Alice makes an update, Bob does nothing", function () {
        const initialString = "Macs had the original point and click UI.";
        const aString = "Macintoshes had the original point and click UI.";
        const sNode = new MwUnit(sff);
        const aNode = new MwUnit(eff);

        const aFile = new EditorFile();
        aFile.setText(initialString);
        aNode.setEditor(aFile);

        // Alice pushes.
        sNode.setEdits(aRoomId, aNode.getEdits(sRoomId));
        // Server later acks.
        aNode.setEdits(sRoomId, sNode.getEdits(aRoomId));

        const bNode = new MwUnit(eff);
        bNode.setEdits(sRoomId, sNode.getEdits(bRoomId));
        // Bob acks back to the server.
        sNode.setEdits(bRoomId, bNode.getEdits(sRoomId));
        // const bFile = bNode.getFile(fileId);

        // Alice makes her editor change...
        aFile.setText(aString);
        sNode.setEdits(aRoomId, aNode.getEdits(sRoomId));

        bNode.setEdits(sRoomId, sNode.getEdits(bRoomId));

        it("should add the file to Bob's room", function () {
            expect(true).toBeTruthy();
            // expect(bFile.getText()).toBe(aString);
        });
    });
    describe("Alice makes an update, Bob does nothing II", function () {
        const initialString = "Macs had the original point and click UI.";
        const aString = "Macintoshes had the original point and click UI.";

        const sNode = new MwUnit(sff);
        const aNode = new MwUnit(eff);

        const aFile = new EditorFile();
        aFile.setText(initialString);
        aNode.setEditor(aFile);

        // Alice pushes.
        const m1 = aNode.getEdits(sRoomId);
        sNode.setEdits(aRoomId, m1);
        // Server later acks, or maybe not.
        // aNode.setEdits(sNode.getEdits('A', false));

        const bNode = new MwUnit(eff);

        bNode.setEdits(sRoomId, sNode.getEdits(bRoomId));
        // Bob acks back to the server.
        sNode.setEdits(bRoomId, bNode.getEdits(sRoomId));
        // const bFile = bNode.getFile(fileId);

        // Alice makes her editor change...
        aFile.setText(aString);
        sNode.setEdits(aRoomId, aNode.getEdits(sRoomId));
        bNode.setEdits(sRoomId, sNode.getEdits(bRoomId));

        it("should add the file to Bob's room", function () {
            expect(true).toBeTruthy();
            // expect(bFile.getText()).toBe(aString);
        });
    });
    describe("Alice and Bob make updates", function () {
        const initialString = "Macs had the original point and click UI.";
        const aString = "Macs had the original point and click interface.";
        const bString = "Smith & Wesson had the original point and click UI.";
        const comboString = "Smith & Wesson had the original point and click interface.";

        const sNode = new MwUnit(sff);
        const aNode = new MwUnit(eff);

        // Alice adds a file to the room.
        const aFile = new EditorFile();
        aFile.setText(initialString);
        aNode.setEditor(aFile);

        // Alice pushes to the server.
        const msg01 = aNode.getEdits(sRoomId);
        // inspect("A => S", msg01);
        sNode.setEdits(aRoomId, msg01);

        // Server acks back to Alice (or may be delayed).
        const msg02 = sNode.getEdits(aRoomId);
        aNode.setEdits(sRoomId, msg02);

        // Bob joins the room.
        const bNode = new MwUnit(eff);

        // Bob receives synch message from server.
        const msg03 = sNode.getEdits(bRoomId);
        bNode.setEdits(sRoomId, msg03);
        // Bob acks back to server (or may be delayed).
        const msg04 = bNode.getEdits(sRoomId);
        sNode.setEdits(bRoomId, msg04);
        const bFile = bNode.getEditor();

        aFile.setText(aString);
        bFile.setText(bString);

        // Bob's updates get to the server first.
        const msg05 = bNode.getEdits(sRoomId);
        sNode.setEdits(bRoomId, msg05);
        // Alice's update get to the server last.
        const msg06 = aNode.getEdits(sRoomId);
        sNode.setEdits(aRoomId, msg06);

        // Server sends sync messages back to Alice and Bob.
        const msg07 = sNode.getEdits(bRoomId);
        bNode.setEdits(sRoomId, msg07);
        const msg08 = sNode.getEdits(aRoomId);
        aNode.setEdits(sRoomId, msg08);

        it("Alice has the combined message", function () {
            expect(aFile.getText()).toBe(comboString);
        });
        it("Bob has the combined message", function () {
            expect(bFile.getText()).toBe(comboString);
        });
    });
    describe("Duplicate packet", function () {
        it("The server should ignore the edits", function () {
            const initialString = "Macs had the original point and click UI.";
            const aString = "Macintoshes had the original point and click UI.";

            const sNode = new MwUnit(sff);
            const aNode = new MwUnit(eff);

            const editor = new EditorFile();
            editor.setText(initialString);
            aNode.setEditor(editor);

            const msg01 = aNode.getEdits(sRoomId);
            sNode.setEdits(aRoomId, msg01);

            const msg02 = sNode.getEdits(aRoomId);
            aNode.setEdits(sRoomId, msg02);

            const serverFile = sNode.getEditor();
            expect(serverFile.getText()).toBe(initialString);

            editor.setText(aString);
            const msg03 = aNode.getEdits(sRoomId);
            sNode.setEdits(aRoomId, msg03);
            expect(serverFile.getText()).toBe(aString);

            // Send msg03 twice
            sNode.setEdits(aRoomId, msg03);
            expect(serverFile.getText()).toBe(aString);
        });
    });
    describe("Lost outbound packet", function () {
        it("The client should purge edits when it finally gets an ack.", function () {
            const initialString = "Macs had the original point and click UI.";
            const aString = "Macintoshes had the original point and click UI.";

            const sNode = new MwUnit(sff);
            const aNode = new MwUnit(eff);

            const editor = new EditorFile();
            editor.setText(initialString);
            aNode.setEditor(editor);

            const msg01 = aNode.getEdits(sRoomId);
            sNode.setEdits(aRoomId, msg01);

            const msg02 = sNode.getEdits(aRoomId);
            aNode.setEdits(sRoomId, msg02);

            const serverFile = sNode.getEditor();
            expect(serverFile.getText()).toBe(initialString);

            editor.setText(aString);
            aNode.getEdits(sRoomId);
            expect(serverFile.getText()).toBe(initialString);
            aNode.getEdits(sRoomId);
            expect(serverFile.getText()).toBe(initialString);

            const msg03 = aNode.getEdits(sRoomId);
            sNode.setEdits(aRoomId, msg03);
            expect(serverFile.getText()).toBe(aString);
            aNode.setEdits(sRoomId, sNode.getEdits(aRoomId));
        });
    });
    describe("Lost return packet", function () {
        it("The server should restore the shadow from the backup", function () {
            const initialString = "Macs had the original point and click UI.";
            const aString = "Macs had the original point and click interface.";
            const bString = "Macs had the original point and click interface!";
            const cString = "Smith & Wesson had the original point and click interface.";
            const endString = "Smith & Wesson had the original point and click interface!";

            const sNode = new MwUnit(sff);
            const aNode = new MwUnit(eff);

            const aEditor = new EditorFile();
            aEditor.setText(initialString);
            aNode.setEditor(aEditor);

            const msg01 = aNode.getEdits(sRoomId);
            sNode.setEdits(aRoomId, msg01);
            const msg02 = sNode.getEdits(aRoomId);
            aNode.setEdits(sRoomId, msg02);

            const sEditor = sNode.getEditor();
            expect(sEditor.getText()).toBe(initialString);

            aEditor.setText(aString);
            const msg03 = aNode.getEdits(sRoomId);
            sNode.setEdits(aRoomId, msg03);
            expect(sEditor.getText()).toBe(aString);

            // The server creates a return packet but it gets lost.
            sEditor.setText(cString);
            sNode.getEdits(aRoomId);

            // Now the problem begins.
            // The message Alice sends has an ack version which is behind the server shadow version.
            // However, it does match the backup version. 
            aEditor.setText(bString);
            const msg04 = aNode.getEdits(sRoomId);
            sNode.setEdits(aRoomId, msg04);
            expect(sEditor.getText()).toBe(endString);

            aNode.setEdits(sRoomId, sNode.getEdits(aRoomId));
            expect(aEditor.getText()).toBe(endString);
        });
    });
    describe("Delete File on Server", function () {
        it("The server should create appropriate edits for all nodes", function () {
            const xString = "The contents of file X";

            const sNode = new MwUnit(sff);
            const aNode = new MwUnit(eff);
            const bNode = new MwUnit(eff);

            const axEditor = new EditorFile();
            axEditor.setText(xString);
            aNode.setEditor(axEditor);

            syncFromTo(aNode, aRoomId, sNode, sRoomId);
            syncFromTo(sNode, sRoomId, aNode, aRoomId);
            syncFromTo(sNode, sRoomId, bNode, bRoomId);

            sNode.removeEditor();
            expect(sNode.getEditor()).toBeUndefined();

            syncFromTo(sNode, sRoomId, aNode, aRoomId);
            syncFromTo(sNode, sRoomId, bNode, bRoomId);

            expect(aNode.getEditor()).toBeUndefined();
            expect(bNode.getEditor()).toBeUndefined();
        });
    });
    describe("Edits for an unknown node", function () {
        it("nodes should lazily create their internal structures", function () {
            const initialString = "Macs had the original point and click UI.";

            const sNode = new MwUnit(sff);
            const aNode = new MwUnit(eff);

            const editor = new EditorFile();
            editor.setText(initialString);
            aNode.setEditor(editor);

            // Alice pushes changes to the Server.
            sNode.setEdits(aRoomId, aNode.getEdits(sRoomId));

            // Server acks Alice.
            aNode.setEdits(sRoomId, sNode.getEdits(aRoomId));

            // Request edits for a node the server does not know about.
            const edits = sNode.getEdits(bRoomId);
            expect(edits).toBeDefined();
            expect(edits.x).toBeDefined();
            const changes = edits.x;
            expect(changes.length).toBe(1);
            const change = changes[0];
            expect(change.m).toBeUndefined();
            expect(change.a).toBeDefined();
            const action = change.a;
            expect(action.c).toBe(ACTION_RAW_OVERWRITE);
            expect(action.n).toBe(1);
            expect(action.x).toBe(initialString);

            // Set edits on Bobby that it does not know about.
            const bNode = new MwUnit(eff);
            bNode.setEdits(sRoomId, edits);
        });
    });
    describe("Serialization", function () {
        it("should add the file to Bob's room", function () {
            const sNode = new MwUnit(sff);
            const aNode = new MwUnit(eff);

            // Alice add a file.
            const aEditor = new EditorFile();
            aEditor.setText("The quick brown fox jumped over the lazy dogs.");
            aNode.setEditor(aEditor);

            // Alice synchronizes the file to the server.
            sNode.setEdits(aRoomId, aNode.getEdits(sRoomId));

            // Simulate hydration cycle.
            const value = sNode.dehydrate();
            const tNode = new MwUnit(sff);
            tNode.rehydrate(value);

            // Use tNode from now on.

            // Server synchronizes the file back to Alice.
            aNode.setEdits(sRoomId, tNode.getEdits(aRoomId));

            const bNode = new MwUnit(eff);

            syncFromTo(tNode, sRoomId, bNode, bRoomId);

            const bEditor = bNode.getEditor();

            expect(bEditor.getText()).toBe(aEditor.getText());
        });
    });
    describe("Broadcast", function () {
        it("should add the file to Bob's room", function () {
            const initialString = "Macs had the original point and click UI.";
            const aString = "Macintoshes had the original point and click UI.";

            const sNode = new MwUnit(sff);
            const clients: { [nodeId: string]: MwUnit } = {};
            clients[aRoomId] = new MwUnit(eff);

            const aEditor = new EditorFile();
            aEditor.setText(initialString);
            clients[aRoomId].setEditor(aEditor);

            // Alice pushes.
            syncFromTo(clients[aRoomId], aRoomId, sNode, sRoomId);
            // Server later acks to all clients.
            broadcastFrom(sNode, sRoomId, clients);

            clients[bRoomId] = new MwUnit(eff);
            syncFromTo(sNode, sRoomId, clients[bRoomId], bRoomId);
            // Bob acks back to the server.
            syncFromTo(clients[bRoomId], bRoomId, sNode, sRoomId);
            const bEditor = clients[bRoomId].getEditor();

            // Alice makes her editor change...
            aEditor.setText(aString);
            syncFromTo(clients[aRoomId], aRoomId, sNode, sRoomId);
            broadcastFrom(sNode, sRoomId, clients);

            expect(bEditor.getText()).toBe(aEditor.getText());
            expect(bEditor.getText()).toBe(aString);
        });
    });
});
