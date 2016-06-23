// import Range from "../Range";
import Command from './Command';
import Editor from '../Editor';
// import {COMMAND_NAME_BACKSPACE} from '../editor_protocol';
// import {COMMAND_NAME_DEL} from '../editor_protocol';
// import {COMMAND_NAME_INSERT_STRING} from "../editor_protocol";

/*
function bindKey(win: string, mac: string) {
    return { win: win, mac: mac };
}
*/

// commands to enter multiselect mode
const commands: Command[] = [{
    name: "addCursorAbove",
    exec: function(editor: Editor) { editor.selectMoreLines(-1); },
    bindKey: { win: "Ctrl-Alt-Up", mac: "Ctrl-Alt-Up" },
    readOnly: true
}, {
        name: "addCursorBelow",
        exec: function(editor: Editor) { editor.selectMoreLines(1); },
        bindKey: { win: "Ctrl-Alt-Down", mac: "Ctrl-Alt-Down" },
        readOnly: true
    }, {
        name: "addCursorAboveSkipCurrent",
        exec: function(editor: Editor) { editor.selectMoreLines(-1, true); },
        bindKey: { win: "Ctrl-Alt-Shift-Up", mac: "Ctrl-Alt-Shift-Up" },
        readOnly: true
    }, {
        name: "addCursorBelowSkipCurrent",
        exec: function(editor: Editor) { editor.selectMoreLines(1, true); },
        bindKey: { win: "Ctrl-Alt-Shift-Down", mac: "Ctrl-Alt-Shift-Down" },
        readOnly: true
    }, {
        name: "selectMoreBefore",
        exec: function(editor: Editor) { editor.selectMore(-1); },
        bindKey: { win: "Ctrl-Alt-Left", mac: "Ctrl-Alt-Left" },
        readOnly: true
    }, {
        name: "selectMoreAfter",
        exec: function(editor: Editor) { editor.selectMore(1); },
        bindKey: { win: "Ctrl-Alt-Right", mac: "Ctrl-Alt-Right" },
        readOnly: true
    }, {
        name: "selectNextBefore",
        exec: function(editor: Editor) { editor.selectMore(-1, true); },
        bindKey: { win: "Ctrl-Alt-Shift-Left", mac: "Ctrl-Alt-Shift-Left" },
        readOnly: true
    }, {
        name: "selectNextAfter",
        exec: function(editor: Editor) { editor.selectMore(1, true); },
        bindKey: { win: "Ctrl-Alt-Shift-Right", mac: "Ctrl-Alt-Shift-Right" },
        readOnly: true
    }, {
        name: "splitIntoLines",
        exec: function(editor: Editor) { editor.multiSelect.splitIntoLines(); },
        bindKey: { win: "Ctrl-Alt-L", mac: "Ctrl-Alt-L" },
        readOnly: true
    }, {
        name: "alignCursors",
        exec: function(editor: Editor) { editor.alignCursors(); },
        bindKey: { win: "Ctrl-Alt-A", mac: "Ctrl-Alt-A" }
    }, {
        name: "findAll",
        exec: function(editor: Editor) { editor.findAll(); },
        bindKey: { win: "Ctrl-Alt-K", mac: "Ctrl-Alt-G" },
        readOnly: true
    }];

export default commands;

/*
// commands active only in multiselect mode
exports.multiSelectCommands = [{
    name: "singleSelection",
    bindKey: "esc",
    exec: function(editor) { editor.exitMultiSelectMode(); },
    readonly: true,
    isAvailable: function(editor) {return editor && editor.inMultiSelectMode}
}];

var HashHandler = require("../keyboard/hash_handler").HashHandler;
exports.keyboardHandler = new HashHandler(exports.multiSelectCommands);
*/
