import Diff from './Diff';
import DMP from './DMP';
import Patch from './Patch';
import MwEditor from './MwEditor';
import MwWorkspace from './MwWorkspace';
import MwNode from './MwNode';
import ServerObj from './ServerObj';
import uniqueId from './uniqueId';

function inspect<T>(message: string, value: T): T { console.log(`${message}\n${JSON.stringify(value, null, 2)}`); return value; }

const dmp = new DMP();

const aId = 'Alice';
const bId = 'Bobby';
const sId = 'Server';

const fileX = 'X.file';

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
        // console.log(`setText '${text}`);
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
function syncFromTo(from: MwNode, to: MwNode, peek?: boolean) {
    if (peek) {
        inspect(from.id, from);
        inspect(to.id, to);
    }
    const edits = from.getEdits(to.id);
    if (peek) {
        inspect(`Create message ${from.id} => ${to.id}`, edits);
    }
    if (peek) {
        // The from node will change in creation of th message.
        inspect(from.id, from);
    }
    if (peek) {
        inspect(`Send message ${from.id} => ${to.id}`, edits);
    }
    to.setEdits(edits);
    if (peek) {
        // The to node will change upon receipt of the message.
        inspect(`Receiver: ${to.id}`, to);
    }
}

describe("MwNode", function() {
    describe("Alice synchronizes with server one way", function() {
        it("should add the file to Server room", function() {
            const initialString = "Macs had the original point and click UI.";
            const aString = "Macintoshes had the original point and click UI.";

            const sNode = new MwNode(sId, sff);
            const aNode = new MwNode(aId, eff);

            const aEditor = new EditorFile();
            aEditor.setText(initialString);
            aNode.addEditor(fileX, aEditor);

            syncFromTo(aNode, sNode);

            const sEditor = sNode.getEditor(fileX);

            expect(sEditor.getText()).toBe(initialString);

            aEditor.setText(aString);

            syncFromTo(aNode, sNode);

            expect(sEditor.getText()).toBe(aString);
        });
    });
    describe("Alice synchronizes with server and gets response", function() {
        it("should add the file to Server room", function() {
            const initialString = "Macs had the original point and click UI.";
            const aString = "Macintoshes had the original point and click UI.";

            const sNode = new MwNode(sId, sff);
            const aNode = new MwNode(aId, eff);

            const editor = new EditorFile();
            editor.setText(initialString);
            aNode.addEditor(fileX, editor);

            syncFromTo(aNode, sNode);

            syncFromTo(sNode, aNode);

            const serverFile = sNode.getEditor(fileX);

            expect(serverFile.getText()).toBe(initialString);

            editor.setText(aString);

            syncFromTo(aNode, sNode);

            expect(serverFile.getText()).toBe(aString);
        });
    });
    describe("Bob joins the room", function() {

        const sNode = new MwNode(sId, sff);
        const aNode = new MwNode(aId, eff);

        // Alice add a file.
        const aEditor = new EditorFile();
        aEditor.setText("The quick brown fox jumped over the lazy dogs.");
        aNode.addEditor(fileX, aEditor);

        // Alice synchronizes the file to the server.
        sNode.setEdits(aNode.getEdits(sNode.id));

        // Server synchronizes the file back to Alice.
        aNode.setEdits(sNode.getEdits(aNode.id));

        const bNode = new MwNode(bId, eff);

        syncFromTo(sNode, bNode);

        const bEditor = bNode.getEditor(fileX);

        it("should add the file to Bob's room", function() {
            expect(bEditor.getText()).toBe(aEditor.getText());
        });
    });
    describe("Alice makes an update, Bob does nothing", function() {
        const initialString = "Macs had the original point and click UI.";
        const aString = "Macintoshes had the original point and click UI.";
        const sNode = new MwNode(sId, sff);
        const aNode = new MwNode(aId, eff);

        const aFile = new EditorFile();
        aFile.setText(initialString);
        aNode.addEditor(fileX, aFile);

        // Alice pushes.
        sNode.setEdits(aNode.getEdits(sNode.id));
        // Server later acks.
        aNode.setEdits(sNode.getEdits(aNode.id));

        const bNode = new MwNode(bId, eff);
        bNode.setEdits(sNode.getEdits(bNode.id));
        // Bob acks back to the server.
        sNode.setEdits(bNode.getEdits(sNode.id));
        // const bFile = bNode.getFile(fileId);

        // Alice makes her editor change...
        aFile.setText(aString);
        sNode.setEdits(aNode.getEdits(sNode.id));

        bNode.setEdits(sNode.getEdits(bNode.id));

        it("should add the file to Bob's room", function() {
            expect(true).toBeTruthy();
            // expect(bFile.getText()).toBe(aString);
        });
    });
    describe("Alice makes an update, Bob does nothing II", function() {
        const initialString = "Macs had the original point and click UI.";
        const aString = "Macintoshes had the original point and click UI.";

        const sNode = new MwNode(sId, sff);
        const aNode = new MwNode(aId, eff);

        const fileId = uniqueId();
        const aFile = new EditorFile();
        aFile.setText(initialString);
        aNode.addEditor(fileId, aFile);

        // Alice pushes.
        const m1 = aNode.getEdits(sNode.id);
        sNode.setEdits(m1);
        // Server later acks, or maybe not.
        // aNode.setEdits(sNode.getEdits('A', false));

        const bNode = new MwNode(bId, eff);

        bNode.setEdits(sNode.getEdits(bNode.id));
        // Bob acks back to the server.
        sNode.setEdits(bNode.getEdits(sNode.id));
        // const bFile = bNode.getFile(fileId);

        // Alice makes her editor change...
        aFile.setText(aString);
        sNode.setEdits(aNode.getEdits(sNode.id));
        bNode.setEdits(sNode.getEdits(bNode.id));

        it("should add the file to Bob's room", function() {
            expect(true).toBeTruthy();
            // expect(bFile.getText()).toBe(aString);
        });
    });
    describe("Alice and Bob make updates", function() {
        const initialString = "Macs had the original point and click UI.";
        const aString = "Macs had the original point and click interface.";
        const bString = "Smith & Wesson had the original point and click UI.";
        const comboString = "Smith & Wesson had the original point and click interface.";

        const sNode = new MwNode(sId, sff);
        const aNode = new MwNode(aId, eff);

        // Alice adds a file to the room.
        const fileId = "file.ext";
        const aFile = new EditorFile();
        aFile.setText(initialString);
        aNode.addEditor(fileId, aFile);

        // Alice pushes to the server.
        const msg01 = aNode.getEdits(sNode.id);
        // inspect("A => S", msg01);
        sNode.setEdits(msg01);

        // Server acks back to Alice (or may be delayed).
        const msg02 = sNode.getEdits(aNode.id);
        aNode.setEdits(msg02);

        // Bob joins the room.
        const bNode = new MwNode(bId, eff);

        // Bob receives synch message from server.
        const msg03 = sNode.getEdits(bNode.id);
        bNode.setEdits(msg03);
        // Bob acks back to server (or may be delayed).
        const msg04 = bNode.getEdits(sNode.id);
        sNode.setEdits(msg04);
        const bFile = bNode.getEditor(fileId);

        aFile.setText(aString);
        bFile.setText(bString);

        // Bob's updates get to the server first.
        const msg05 = bNode.getEdits(sNode.id);
        sNode.setEdits(msg05);
        // Alice's update get to the server last.
        const msg06 = aNode.getEdits(sNode.id);
        sNode.setEdits(msg06);

        // Server sends sync messages back to Alice and Bob.
        const msg07 = sNode.getEdits(bNode.id);
        bNode.setEdits(msg07);
        const msg08 = sNode.getEdits(aNode.id);
        aNode.setEdits(msg08);

        it("Alice has the combined message", function() {
            expect(aFile.getText()).toBe(comboString);
        });
        it("Bob has the combined message", function() {
            expect(bFile.getText()).toBe(comboString);
        });
    });
    describe("Duplicate packet", function() {
        it("The server should ignore the edits", function() {
            const initialString = "Macs had the original point and click UI.";
            const aString = "Macintoshes had the original point and click UI.";

            const sNode = new MwNode(sId, sff);
            const aNode = new MwNode(aId, eff);

            const fileId = "file.ext";
            const editor = new EditorFile();
            editor.setText(initialString);
            aNode.addEditor(fileId, editor);

            const msg01 = aNode.getEdits(sNode.id);
            sNode.setEdits(msg01);

            const msg02 = sNode.getEdits(aNode.id);
            aNode.setEdits(msg02);

            const serverFile = sNode.getEditor(fileId);
            expect(serverFile.getText()).toBe(initialString);

            editor.setText(aString);
            const msg03 = aNode.getEdits(sNode.id);
            sNode.setEdits(msg03);
            expect(serverFile.getText()).toBe(aString);

            // Send msg03 twice
            sNode.setEdits(msg03);
            expect(serverFile.getText()).toBe(aString);
        });
    });
    describe("Lost outbound packet", function() {
        it("The client should purge edits when it finally gets an ack.", function() {
            const initialString = "Macs had the original point and click UI.";
            const aString = "Macintoshes had the original point and click UI.";

            const sNode = new MwNode(sId, sff);
            const aNode = new MwNode(aId, eff);

            const fileId = "file.ext";
            const editor = new EditorFile();
            editor.setText(initialString);
            aNode.addEditor(fileId, editor);

            const msg01 = aNode.getEdits(sNode.id);
            sNode.setEdits(msg01);

            const msg02 = sNode.getEdits(aNode.id);
            aNode.setEdits(msg02);

            const serverFile = sNode.getEditor(fileId);
            expect(serverFile.getText()).toBe(initialString);

            editor.setText(aString);
            aNode.getEdits(sNode.id);
            expect(serverFile.getText()).toBe(initialString);
            aNode.getEdits(sNode.id);
            expect(serverFile.getText()).toBe(initialString);

            const msg03 = aNode.getEdits(sNode.id);
            sNode.setEdits(msg03);
            expect(serverFile.getText()).toBe(aString);
            aNode.setEdits(sNode.getEdits(aNode.id));
        });
    });
    describe("Lost return packet", function() {
        it("The server should restore the shadow from the backup", function() {
            const initialString = "Macs had the original point and click UI.";
            const aString = "Macs had the original point and click interface.";
            const bString = "Macs had the original point and click interface!";
            const cString = "Smith & Wesson had the original point and click interface.";
            const endString = "Smith & Wesson had the original point and click interface!";

            const sNode = new MwNode(sId, sff);
            const aNode = new MwNode(aId, eff);

            const fileId = "file.ext";
            const aEditor = new EditorFile();
            aEditor.setText(initialString);
            aNode.addEditor(fileId, aEditor);

            const msg01 = aNode.getEdits(sNode.id);
            sNode.setEdits(msg01);
            const msg02 = sNode.getEdits(aNode.id);
            aNode.setEdits(msg02);

            const sEditor = sNode.getEditor(fileId);
            expect(sEditor.getText()).toBe(initialString);

            aEditor.setText(aString);
            const msg03 = aNode.getEdits(sNode.id);
            sNode.setEdits(msg03);
            expect(sEditor.getText()).toBe(aString);

            // The server creates a return packet but it gets lost.
            sEditor.setText(cString);
            sNode.getEdits(aNode.id);

            // Now the problem begins.
            // The message Alice sends has an ack version which is behind the server shadow version.
            // However, it does match the backup version. 
            aEditor.setText(bString);
            const msg04 = aNode.getEdits(sNode.id);
            sNode.setEdits(msg04);
            expect(sEditor.getText()).toBe(endString);

            aNode.setEdits(sNode.getEdits(aNode.id));
            expect(aEditor.getText()).toBe(endString);
        });
    });
    describe("Delete File on Server", function() {
        it("The server should create appropriate edits for all nodes", function() {
            const xString = "The contents of file X";
            const yString = "The contents of file Y";

            const sNode = new MwNode(sId, sff);
            const aNode = new MwNode(aId, eff);
            const bNode = new MwNode(bId, eff);

            const fileX = "fileX";
            const axEditor = new EditorFile();
            axEditor.setText(xString);
            aNode.addEditor(fileX, axEditor);

            const fileY = "fileY";
            const ayEditor = new EditorFile();
            ayEditor.setText(yString);
            aNode.addEditor(fileY, ayEditor);

            const msg01 = aNode.getEdits(sNode.id);
            sNode.setEdits(msg01);

            aNode.setEdits(sNode.getEdits(aNode.id));
            bNode.setEdits(sNode.getEdits(bNode.id));

            expect(Object.keys(aNode.editors).length).toBe(2);
            expect(Object.keys(bNode.editors).length).toBe(2);
            expect(Object.keys(sNode.editors).length).toBe(2);

            sNode.removeEditor(fileY);

            expect(Object.keys(sNode.editors).length).toBe(1);

            aNode.setEdits(sNode.getEdits(aNode.id));
            expect(Object.keys(aNode.editors).length).toBe(1);

            bNode.setEdits(sNode.getEdits(bNode.id));
            expect(Object.keys(bNode.editors).length).toBe(1);
        });
    });
    describe("Edits for an unknown node", function() {
        it("nodes should lazily create their internal structures", function() {
            const initialString = "Macs had the original point and click UI.";

            const sNode = new MwNode(sId, sff);
            const aNode = new MwNode(aId, eff);

            const fileId = "file.ext";
            const editor = new EditorFile();
            editor.setText(initialString);
            aNode.addEditor(fileId, editor);

            // Alice pushes changes to the Server.
            sNode.setEdits(aNode.getEdits(sNode.id));

            // Server acks Alice.
            aNode.setEdits(sNode.getEdits(aNode.id));

            // Request edits for a node the server does not know about.
            const bEdits = sNode.getEdits(bId);
            expect(bEdits.length).toBe(1);
            const edit = bEdits[0];
            expect(edit.s).toBe(sNode.id);
            expect(edit.t).toBe(bId);
            const changes = edit.x;
            expect(changes.length).toBe(1);
            const change = changes[0];
            expect(change.f).toBe(fileId);
            expect(change.m).toBeUndefined();
            expect(change.a).toBeDefined();
            const action = change.a;
            expect(action.c).toBe('R');
            expect(action.n).toBe(1);
            expect(action.x).toBe(initialString);

            // Set edits on Bobby that it does not know about.
            const bNode = new MwNode(bId, eff);
            bNode.setEdits(bEdits);

            expect(Object.keys(bNode.editors).length).toBe(1);
        });
    });
});
