import { stringRepeat } from "../lib/lang";
import { COMMAND_NAME_BACKSPACE } from '../editor_protocol';
import { COMMAND_NAME_DEL } from '../editor_protocol';
import { COMMAND_NAME_INDENT } from "../editor_protocol";
import { COMMAND_NAME_INSERT_STRING } from "../editor_protocol";
//
//
//
import { EditorCommandable as Editor } from '../../virtual/EditorCommandable';
import { Command } from './Command';

function bindKey(win: string | null, mac: string | null): { win: string | null; mac: string | null } {
    return { win, mac };
}

const commands: Command<Editor>[] = [
    {
        name: "selectall",
        bindKey: bindKey("Ctrl-A", "Command-A"),
        exec: function (editor: Editor) { editor.selectAll(); },
        readOnly: true
    },
    {
        name: "centerselection",
        bindKey: bindKey(null, "Ctrl-L"),
        exec: function (editor: Editor) { editor.centerSelection(); },
        readOnly: true
    },
    {
        name: "gotoline",
        bindKey: bindKey("Ctrl-L", "Command-L"),
        exec: function (editor: Editor) {
            const response = prompt("Enter line number:");
            if (typeof response === 'string') {
                const line = parseInt(response, 10);
                if (!isNaN(line)) {
                    editor.gotoLine(line);
                }
            }
        },
        readOnly: true
    },
    {
        name: "fold",
        bindKey: bindKey("Alt-L|Ctrl-F1", "Command-Alt-L|Command-F1"),
        exec: function (editor: Editor) { editor.toggleFold(false); },
        multiSelectAction: "forEach",
        scrollIntoView: "center",
        readOnly: true
    },
    {
        name: "unfold",
        bindKey: bindKey("Alt-Shift-L|Ctrl-Shift-F1", "Command-Alt-Shift-L|Command-Shift-F1"),
        exec: function (editor: Editor) { editor.toggleFold(true); },
        multiSelectAction: "forEach",
        scrollIntoView: "center",
        readOnly: true
    },
    {
        name: "toggleFoldWidget",
        bindKey: bindKey("F2", "F2"),
        exec: function (editor: Editor) { editor.toggleFoldWidget(false); },
        multiSelectAction: "forEach",
        scrollIntoView: "center",
        readOnly: true
    },
    {
        name: "toggleParentFoldWidget",
        bindKey: bindKey("Alt-F2", "Alt-F2"),
        exec: function (editor: Editor) { editor.toggleFoldWidget(true); },
        multiSelectAction: "forEach",
        scrollIntoView: "center",
        readOnly: true
    },
    {
        name: "foldall",
        // TODO: Should this be bindKey(null, ...?
        bindKey: bindKey("Ctrl-Alt-0", "Ctrl-Command-Option-0"),
        exec: function (editor: Editor) { editor.foldAll(); },
        scrollIntoView: "center",
        readOnly: true
    },
    {
        name: "foldOther",
        bindKey: bindKey("Alt-0", "Command-Option-0"),
        exec: function (editor: Editor) {
            editor.foldAll();
            // FIXME: unfold must accept a Range[], then we add this line...
            // editor.getSession().unfold(editor.selection.getAllRanges());
        },
        scrollIntoView: "center",
        readOnly: true
    },
    {
        name: "unfoldall",
        bindKey: bindKey("Alt-Shift-0", "Command-Option-Shift-0"),
        exec: function (editor: Editor) { editor.unfold(); },
        scrollIntoView: "center",
        readOnly: true
    },
    {
        name: "findnext",
        bindKey: bindKey("Ctrl-K", "Command-G"),
        exec: function (editor: Editor) { editor.findNext(); },
        multiSelectAction: "forEach",
        scrollIntoView: "center",
        readOnly: true
    },
    {
        name: "findprevious",
        bindKey: bindKey("Ctrl-Shift-K", "Command-Shift-G"),
        exec: function (editor: Editor) { editor.findPrevious(); },
        multiSelectAction: "forEach",
        scrollIntoView: "center",
        readOnly: true
    },
    {
        name: "selectOrFindNext",
        bindKey: bindKey("Alt-K", "Ctrl-G"),
        exec: function (editor: Editor) { editor.selectWordOrFindNext(); },
        readOnly: true
    },
    {
        name: "selectOrFindPrevious",
        bindKey: bindKey("Alt-Shift-K", "Ctrl-Shift-G"),
        exec: function (editor: Editor) { editor.selectWordOrFindPrevious(); },
        readOnly: true
    },
    {
        name: "overwrite",
        bindKey: bindKey("Insert", "Insert"),
        exec: function (editor: Editor) { editor.toggleOverwrite(); },
        readOnly: true
    },
    {
        name: "selecttostart",
        bindKey: bindKey("Ctrl-Shift-Home", "Command-Shift-Home|Command-Shift-Up"),
        exec: function (editor: Editor) { editor.selectToFileStart(); },
        multiSelectAction: "forEach",
        readOnly: true,
        scrollIntoView: "animate",
        group: "fileJump"
    },
    {
        name: "gotostart",
        bindKey: bindKey("Ctrl-Home", "Command-Home|Command-Up"),
        exec: function (editor: Editor) { editor.navigateFileStart(); },
        multiSelectAction: "forEach",
        readOnly: true,
        scrollIntoView: "animate",
        group: "fileJump"
    },
    {
        name: "selectup",
        bindKey: bindKey("Shift-Up", "Shift-Up|Ctrl-Shift-P"),
        exec: function (editor: Editor) { editor.selectUp(); },
        multiSelectAction: "forEach",
        readOnly: true
    },
    {
        name: "golineup",
        bindKey: bindKey("Up", "Up|Ctrl-P"),
        exec: function (editor: Editor, args: { times: number }) { editor.navigateUp(args.times); },
        multiSelectAction: "forEach",
        readOnly: true
    },
    {
        name: "selecttoend",
        bindKey: bindKey("Ctrl-Shift-End", "Command-Shift-End|Command-Shift-Down"),
        exec: function (editor: Editor) { editor.selectFileEnd(); },
        multiSelectAction: "forEach",
        readOnly: true,
        scrollIntoView: "animate",
        group: "fileJump"
    },
    {
        name: "gotoend",
        bindKey: bindKey("Ctrl-End", "Command-End|Command-Down"),
        exec: function (editor: Editor) { editor.navigateFileEnd(); },
        multiSelectAction: "forEach",
        readOnly: true,
        scrollIntoView: "animate",
        group: "fileJump"
    },
    {
        name: "selectdown",
        bindKey: bindKey("Shift-Down", "Shift-Down|Ctrl-Shift-N"),
        exec: function (editor: Editor) { editor.selectDown(); },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor",
        readOnly: true
    },
    {
        name: "golinedown",
        bindKey: bindKey("Down", "Down|Ctrl-N"),
        exec: function (editor: Editor, args: { times: number }) { editor.navigateDown(args.times); },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor",
        readOnly: true
    },
    {
        name: "selectwordleft",
        bindKey: bindKey("Ctrl-Shift-Left", "Option-Shift-Left"),
        exec: function (editor: Editor) { editor.selectWordLeft(); },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor",
        readOnly: true
    },
    {
        name: "gotowordleft",
        bindKey: bindKey("Ctrl-Left", "Option-Left"),
        exec: function (editor: Editor) { editor.navigateWordLeft(); },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor",
        readOnly: true
    },
    {
        name: "selecttolinestart",
        bindKey: bindKey("Alt-Shift-Left", "Command-Shift-Left|Ctrl-Shift-A"),
        exec: function (editor: Editor) { editor.selectLineStart(); },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor",
        readOnly: true
    },
    {
        name: "gotolinestart",
        bindKey: bindKey("Alt-Left|Home", "Command-Left|Home|Ctrl-A"),
        exec: function (editor: Editor) { editor.navigateLineStart(); },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor",
        readOnly: true
    },
    {
        name: "selectleft",
        bindKey: bindKey("Shift-Left", "Shift-Left|Ctrl-Shift-B"),
        exec: function (editor: Editor) { editor.selectLeft(); },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor",
        readOnly: true
    },
    {
        name: "gotoleft",
        bindKey: bindKey("Left", "Left|Ctrl-B"),
        exec: function (editor: Editor, args: { times: number }) { editor.navigateLeft(args.times); },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor",
        readOnly: true
    },
    {
        name: "selectwordright",
        bindKey: bindKey("Ctrl-Shift-Right", "Option-Shift-Right"),
        exec: function (editor: Editor) { editor.selectWordRight(); },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor",
        readOnly: true
    },
    {
        name: "gotowordright",
        bindKey: bindKey("Ctrl-Right", "Option-Right"),
        exec: function (editor: Editor) { editor.navigateWordRight(); },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor",
        readOnly: true
    },
    {
        name: "selecttolineend",
        bindKey: bindKey("Alt-Shift-Right", "Command-Shift-Right|Shift-End|Ctrl-Shift-E"),
        exec: function (editor: Editor) { editor.selectLineEnd(); },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor",
        readOnly: true
    },
    {
        name: "gotolineend",
        bindKey: bindKey("Alt-Right|End", "Command-Right|End|Ctrl-E"),
        exec: function (editor: Editor) { editor.navigateLineEnd(); },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor",
        readOnly: true
    },
    {
        name: "selectright",
        bindKey: bindKey("Shift-Right", "Shift-Right"),
        exec: function (editor: Editor) { editor.selectRight(); },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor",
        readOnly: true
    },
    {
        name: "gotoright",
        bindKey: bindKey("Right", "Right|Ctrl-F"),
        exec: function (editor: Editor, args: { times: number }) { editor.navigateRight(args.times); },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor",
        readOnly: true
    },
    {
        name: "selectpagedown",
        bindKey: "Shift-PageDown",
        exec: function (editor: Editor) { editor.selectPageDown(); },
        readOnly: true
    },
    {
        name: "pagedown",
        bindKey: bindKey(null, "Option-PageDown"),
        exec: function (editor: Editor) { editor.scrollPageDown(); },
        readOnly: true
    },
    {
        name: "gotopagedown",
        bindKey: bindKey("PageDown", "PageDown|Ctrl-V"),
        exec: function (editor: Editor) { editor.gotoPageDown(); },
        readOnly: true
    },
    {
        name: "selectpageup",
        bindKey: "Shift-PageUp",
        exec: function (editor: Editor) { editor.selectPageUp(); },
        readOnly: true
    },
    {
        name: "pageup",
        bindKey: bindKey(null, "Option-PageUp"),
        exec: function (editor: Editor) { editor.scrollPageUp(); },
        readOnly: true
    },
    {
        name: "gotopageup",
        bindKey: "PageUp",
        exec: function (editor: Editor) { editor.gotoPageUp(); },
        readOnly: true
    },
    {
        name: "scrollup",
        bindKey: bindKey("Ctrl-Up", null),
        exec: function (editor: Editor) { editor.scrollUp(); },
        readOnly: true
    },
    {
        name: "scrolldown",
        bindKey: bindKey("Ctrl-Down", null),
        exec: function (editor: Editor) { editor.scrollDown(); },
        readOnly: true
    },
    {
        name: "selectlinestart",
        bindKey: "Shift-Home",
        exec: function (editor: Editor) { editor.selectLineStart(); },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor",
        readOnly: true
    },
    {
        name: "selectlineend",
        bindKey: "Shift-End",
        exec: function (editor: Editor) { editor.selectLineEnd(); },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor",
        readOnly: true
    },
    {
        name: "togglerecording",
        bindKey: bindKey("Ctrl-Alt-E", "Command-Option-E"),
        exec: function (editor: Editor) { editor.toggleRecording(); },
        readOnly: true
    },
    {
        name: "replaymacro",
        bindKey: bindKey("Ctrl-Shift-E", "Command-Shift-E"),
        exec: function (editor: Editor) { editor.replay(); },
        readOnly: true
    },
    {
        name: "jumptomatching",
        bindKey: bindKey("Ctrl-P", "Ctrl-P"),
        exec: function (editor: Editor) { editor.jumpToMatching(); },
        multiSelectAction: "forEach",
        readOnly: true
    },
    {
        name: "selecttomatching",
        bindKey: bindKey("Ctrl-Shift-P", "Ctrl-Shift-P"),
        exec: function (editor: Editor) { editor.jumpToMatching(true); },
        multiSelectAction: "forEach",
        readOnly: true
    },
    {
        name: "passKeysToBrowser",
        bindKey: bindKey("null", "null"),
        exec: function () {
            // Do nothing?
        },
        passEvent: true,
        readOnly: true
    },
    {
        name: "copy",
        exec: function (editor: Editor) { editor.copy(); },
        readOnly: true,
    },

    // commands disabled in readOnly mode
    {
        name: "cut",
        exec: function (editor: Editor) { editor.cut(); },
        scrollIntoView: "cursor",
        multiSelectAction: "forEach"
    },
    {
        name: "paste",
        exec: function (editor: Editor, args) { editor.paste(); },
        scrollIntoView: "cursor"
    },
    {
        name: "removeline",
        bindKey: bindKey("Ctrl-D", "Command-D"),
        exec: function (editor: Editor) { editor.removeLines(); },
        scrollIntoView: "cursor",
        multiSelectAction: "forEachLine"
    },
    {
        name: "duplicateSelection",
        bindKey: bindKey("Ctrl-Shift-D", "Command-Shift-D"),
        exec: function (editor: Editor) { editor.duplicateSelection(); },
        scrollIntoView: "cursor",
        multiSelectAction: "forEach"
    },
    {
        name: "sortlines",
        bindKey: bindKey("Ctrl-Alt-S", "Command-Alt-S"),
        exec: function (editor: Editor) { editor.sortLines(); },
        scrollIntoView: "selection",
        multiSelectAction: "forEachLine"
    },
    {
        name: "togglecomment",
        bindKey: bindKey("Ctrl-/", "Command-/"),
        exec: function (editor: Editor) { editor.toggleCommentLines(); },
        multiSelectAction: "forEachLine",
        scrollIntoView: "selectionPart"
    },
    {
        name: "toggleBlockComment",
        bindKey: bindKey("Ctrl-Shift-/", "Command-Shift-/"),
        exec: function (editor: Editor) { editor.toggleBlockComment(); },
        multiSelectAction: "forEach",
        scrollIntoView: "selectionPart"
    },
    {
        name: "modifyNumberUp",
        bindKey: bindKey("Ctrl-Shift-Up", "Alt-Shift-Up"),
        exec: function (editor: Editor) { editor.modifyNumber(1); },
        multiSelectAction: "forEach"
    },
    {
        name: "modifyNumberDown",
        bindKey: bindKey("Ctrl-Shift-Down", "Alt-Shift-Down"),
        exec: function (editor: Editor) { editor.modifyNumber(-1); },
        multiSelectAction: "forEach"
    },
    {
        name: "undo",
        bindKey: bindKey("Ctrl-Z", "Command-Z"),
        exec: function (editor: Editor) { editor.undo(); }
    },
    {
        name: "redo",
        bindKey: bindKey("Ctrl-Shift-Z|Ctrl-Y", "Command-Shift-Z|Command-Y"),
        exec: function (editor: Editor) { editor.redo(); }
    },
    {
        name: "copylinesup",
        bindKey: bindKey("Alt-Shift-Up", "Command-Option-Up"),
        exec: function (editor: Editor) { editor.copyLinesUp(); },
        scrollIntoView: "cursor"
    },
    {
        name: "movelinesup",
        bindKey: bindKey("Alt-Up", "Option-Up"),
        exec: function (editor: Editor) { editor.moveLinesUp(); },
        scrollIntoView: "cursor"
    },
    {
        name: "copylinesdown",
        bindKey: bindKey("Alt-Shift-Down", "Command-Option-Down"),
        exec: function (editor: Editor) { editor.copyLinesDown(); },
        scrollIntoView: "cursor"
    },
    {
        name: "movelinesdown",
        bindKey: bindKey("Alt-Down", "Option-Down"),
        exec: function (editor: Editor) { editor.moveLinesDown(); },
        scrollIntoView: "cursor"
    },
    {
        name: COMMAND_NAME_DEL,
        bindKey: bindKey("Delete", "Delete|Ctrl-D|Shift-Delete"),
        exec: function (editor: Editor) { editor.remove("right"); },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor"
    },
    {
        name: COMMAND_NAME_BACKSPACE,
        bindKey: bindKey(
            "Shift-Backspace|Backspace",
            "Ctrl-Backspace|Shift-Backspace|Backspace|Ctrl-H"
        ),
        exec: function (editor: Editor) { editor.remove("left"); },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor"
    },
    {
        name: "cut_or_delete",
        bindKey: bindKey("Shift-Delete", null),
        exec: function (editor: Editor) { editor.deleteLeft(); },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor"
    },
    {
        name: "removetolinestart",
        bindKey: bindKey("Alt-Backspace", "Command-Backspace"),
        exec: function (editor: Editor) { editor.removeToLineStart(); },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor"
    },
    {
        name: "removetolineend",
        bindKey: bindKey("Alt-Delete", "Ctrl-K"),
        exec: function (editor: Editor) { editor.removeToLineEnd(); },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor"
    },
    {
        name: "removewordleft",
        bindKey: bindKey("Ctrl-Backspace", "Alt-Backspace|Ctrl-Alt-Backspace"),
        exec: function (editor: Editor) { editor.removeWordLeft(); },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor"
    },
    {
        name: "removewordright",
        bindKey: bindKey("Ctrl-Delete", "Alt-Delete"),
        exec: function (editor: Editor) { editor.removeWordRight(); },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor"
    },
    {
        name: "outdent",
        bindKey: bindKey("Shift-Tab", "Shift-Tab"),
        exec: function (editor: Editor) { editor.blockOutdent(); },
        multiSelectAction: "forEach",
        scrollIntoView: "selectionPart"
    },
    {
        name: COMMAND_NAME_INDENT,
        bindKey: bindKey("Tab", "Tab"),
        exec: function (editor: Editor) { editor.indent(); },
        multiSelectAction: "forEach",
        scrollIntoView: "selectionPart"
    },
    {
        name: "blockoutdent",
        bindKey: bindKey("Ctrl-[", "Ctrl-["),
        exec: function (editor: Editor) { editor.blockOutdent(); },
        multiSelectAction: "forEachLine",
        scrollIntoView: "selectionPart"
    },
    {
        name: "blockindent",
        bindKey: bindKey("Ctrl-]", "Ctrl-]"),
        exec: function (editor: Editor) { editor.blockIndent(); },
        multiSelectAction: "forEachLine",
        scrollIntoView: "selectionPart"
    },
    {
        name: COMMAND_NAME_INSERT_STRING,
        exec: function (editor: Editor, str: string) { editor.insert(str); },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor"
    },
    {
        name: "inserttext",
        exec: function (editor: Editor, args: { text?: string; times?: number }) {
            editor.insert(stringRepeat(args.text || "", args.times || 1));
        },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor"
    },
    {
        name: "splitline",
        bindKey: bindKey(null, "Ctrl-O"),
        exec: function (editor: Editor) { editor.splitLine(); },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor"
    },
    {
        name: "transposeletters",
        // Ctrl-T does not work on Chrome.
        bindKey: bindKey("Alt-X", "Ctrl-T"),
        exec: function (editor: Editor) { editor.transposeLetters(); },
        multiSelectAction: function (editor: Editor) { editor.transposeLetters(); },
        scrollIntoView: "cursor"
    },
    {
        name: "touppercase",
        bindKey: bindKey("Ctrl-U", "Ctrl-U"),
        exec: function (editor: Editor) { editor.toUpperCase(); },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor"
    },
    {
        name: "tolowercase",
        bindKey: bindKey("Ctrl-Shift-U", "Ctrl-Shift-U"),
        exec: function (editor: Editor) { editor.toLowerCase(); },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor"
    },
    {
        name: "expandtoline",
        bindKey: bindKey("Ctrl-Shift-L", "Command-Shift-L"),
        exec: function (editor: Editor) { editor.expandToLine(); },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor",
        readOnly: true
    },
    {
        name: "joinlines",
        bindKey: bindKey(null, null),
        exec: function (editor: Editor) { editor.joinLines(); },
        multiSelectAction: "forEach",
        readOnly: true
    },
    {
        name: "invertSelection",
        bindKey: bindKey(null, null),
        exec: function (editor: Editor) { editor.invertSelection(); },
        readOnly: true,
        scrollIntoView: "none"
    }
];

export default commands;
