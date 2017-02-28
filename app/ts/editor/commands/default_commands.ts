import { stringRepeat, stringTrimLeft, stringTrimRight } from "../lib/lang";
import Range from "../Range";
import Command from './Command';
import Editor from '../Editor';
import { COMMAND_NAME_BACKSPACE } from '../editor_protocol';
import { COMMAND_NAME_DEL } from '../editor_protocol';
import { COMMAND_NAME_INSERT_STRING } from "../editor_protocol";

function bindKey(win: string | null, mac: string | null): { win: string | null; mac: string | null } {
    return { win, mac };
}

const commands: Command[] = [
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
        exec: function (editor: Editor) { editor.sessionOrThrow().toggleFold(false); },
        multiSelectAction: "forEach",
        scrollIntoView: "center",
        readOnly: true
    },
    {
        name: "unfold",
        bindKey: bindKey("Alt-Shift-L|Ctrl-Shift-F1", "Command-Alt-Shift-L|Command-Shift-F1"),
        exec: function (editor: Editor) { editor.sessionOrThrow().toggleFold(true); },
        multiSelectAction: "forEach",
        scrollIntoView: "center",
        readOnly: true
    },
    {
        name: "toggleFoldWidget",
        bindKey: bindKey("F2", "F2"),
        exec: function (editor: Editor) { editor.sessionOrThrow().toggleFoldWidget(false); },
        multiSelectAction: "forEach",
        scrollIntoView: "center",
        readOnly: true
    },
    {
        name: "toggleParentFoldWidget",
        bindKey: bindKey("Alt-F2", "Alt-F2"),
        exec: function (editor: Editor) { editor.sessionOrThrow().toggleFoldWidget(true); },
        multiSelectAction: "forEach",
        scrollIntoView: "center",
        readOnly: true
    },
    {
        name: "foldall",
        // TODO: Should this be bindKey(null, ...?
        bindKey: bindKey("Ctrl-Alt-0", "Ctrl-Command-Option-0"),
        exec: function (editor: Editor) { editor.sessionOrThrow().foldAll(); },
        scrollIntoView: "center",
        readOnly: true
    },
    {
        name: "foldOther",
        bindKey: bindKey("Alt-0", "Command-Option-0"),
        exec: function (editor: Editor) {
            editor.sessionOrThrow().foldAll();
            // FIXME: unfold must accept a Range[], then we add this line...
            // editor.getSession().unfold(editor.selection.getAllRanges());
        },
        scrollIntoView: "center",
        readOnly: true
    },
    {
        name: "unfoldall",
        bindKey: bindKey("Alt-Shift-0", "Command-Option-Shift-0"),
        exec: function (editor: Editor) { editor.sessionOrThrow().unfold(); },
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
        exec: function (editor: Editor) {
            if (editor.selection && editor.selection.isEmpty()) {
                editor.selection.selectWord();
            }
            else {
                editor.findNext();
            }
        },
        readOnly: true
    },
    {
        name: "selectOrFindPrevious",
        bindKey: bindKey("Alt-Shift-K", "Ctrl-Shift-G"),
        exec: function (editor: Editor) {
            if (editor.selection && editor.selection.isEmpty()) {
                editor.selection.selectWord();
            }
            else {
                editor.findPrevious();
            }
        },
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
        exec: function (editor: Editor) { editor.selectionOrThrow().selectFileStart(); },
        multiSelectAction: "forEach",
        readOnly: true,
        scrollIntoView: "animate",
        aceCommandGroup: "fileJump"
    },
    {
        name: "gotostart",
        bindKey: bindKey("Ctrl-Home", "Command-Home|Command-Up"),
        exec: function (editor: Editor) { editor.navigateFileStart(); },
        multiSelectAction: "forEach",
        readOnly: true,
        scrollIntoView: "animate",
        aceCommandGroup: "fileJump"
    },
    {
        name: "selectup",
        bindKey: bindKey("Shift-Up", "Shift-Up|Ctrl-Shift-P"),
        exec: function (editor: Editor) { editor.selectionOrThrow().selectUp(); },
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
        exec: function (editor: Editor) { editor.selectionOrThrow().selectFileEnd(); },
        multiSelectAction: "forEach",
        readOnly: true,
        scrollIntoView: "animate",
        aceCommandGroup: "fileJump"
    },
    {
        name: "gotoend",
        bindKey: bindKey("Ctrl-End", "Command-End|Command-Down"),
        exec: function (editor: Editor) { editor.navigateFileEnd(); },
        multiSelectAction: "forEach",
        readOnly: true,
        scrollIntoView: "animate",
        aceCommandGroup: "fileJump"
    },
    {
        name: "selectdown",
        bindKey: bindKey("Shift-Down", "Shift-Down|Ctrl-Shift-N"),
        exec: function (editor: Editor) { editor.selectionOrThrow().selectDown(); },
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
        exec: function (editor: Editor) { editor.selectionOrThrow().selectWordLeft(); },
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
        exec: function (editor: Editor) { editor.selectionOrThrow().selectLineStart(); },
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
        exec: function (editor: Editor) { editor.selectionOrThrow().selectLeft(); },
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
        exec: function (editor: Editor) { editor.selectionOrThrow().selectWordRight(); },
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
        exec: function (editor: Editor) { editor.selectionOrThrow().selectLineEnd(); },
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
        exec: function (editor: Editor) { editor.selectionOrThrow().selectRight(); },
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
    }, {
        name: "gotopagedown",
        bindKey: bindKey("PageDown", "PageDown|Ctrl-V"),
        exec: function (editor: Editor) { editor.gotoPageDown(); },
        readOnly: true
    }, {
        name: "selectpageup",
        bindKey: "Shift-PageUp",
        exec: function (editor: Editor) { editor.selectPageUp(); },
        readOnly: true
    }, {
        name: "pageup",
        bindKey: bindKey(null, "Option-PageUp"),
        exec: function (editor: Editor) { editor.scrollPageUp(); },
        readOnly: true
    }, {
        name: "gotopageup",
        bindKey: "PageUp",
        exec: function (editor: Editor) { editor.gotoPageUp(); },
        readOnly: true
    }, {
        name: "scrollup",
        bindKey: bindKey("Ctrl-Up", null),
        exec: function (e: Editor) { e.renderer.scrollBy(0, -2 * e.renderer.layerConfig.lineHeight); },
        readOnly: true
    }, {
        name: "scrolldown",
        bindKey: bindKey("Ctrl-Down", null),
        exec: function (e: Editor) { e.renderer.scrollBy(0, 2 * e.renderer.layerConfig.lineHeight); },
        readOnly: true
    }, {
        name: "selectlinestart",
        bindKey: "Shift-Home",
        exec: function (editor: Editor) { editor.selectionOrThrow().selectLineStart(); },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor",
        readOnly: true
    }, {
        name: "selectlineend",
        bindKey: "Shift-End",
        exec: function (editor: Editor) { editor.selectionOrThrow().selectLineEnd(); },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor",
        readOnly: true
    }, {
        name: "togglerecording",
        bindKey: bindKey("Ctrl-Alt-E", "Command-Option-E"),
        exec: function (editor: Editor) { editor.commands.toggleRecording(editor); },
        readOnly: true
    }, {
        name: "replaymacro",
        bindKey: bindKey("Ctrl-Shift-E", "Command-Shift-E"),
        exec: function (editor: Editor) { editor.commands.replay(editor); },
        readOnly: true
    }, {
        name: "jumptomatching",
        bindKey: bindKey("Ctrl-P", "Ctrl-P"),
        exec: function (editor: Editor) { editor.jumpToMatching(); },
        multiSelectAction: "forEach",
        readOnly: true
    }, {
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
        exec: function (editor: Editor) {
            // placeholder for replay macro
        },
        readOnly: true,
    },

    // commands disabled in readOnly mode
    {
        name: "cut",
        exec: function (editor: Editor) {
            const range = editor.getSelectionRange();
            editor._emit("cut", range);

            if (editor.selection && !editor.selection.isEmpty()) {
                editor.sessionOrThrow().remove(range);
                editor.clearSelection();
            }
        },
        scrollIntoView: "cursor",
        multiSelectAction: "forEach"
    },
    {
        name: "paste",
        exec: function (editor: Editor, args) {
            // TODO: $handlePaste on Editor
            // editor.$handlePaste(args);
        },
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
    }, {
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
        exec: function (editor: Editor) {
            if (editor.selection && editor.selection.isEmpty()) {
                editor.remove("left");
                return void 0;
            }
            else {
                return false;
            }
        },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor"
    }, {
        name: "removetolinestart",
        bindKey: bindKey("Alt-Backspace", "Command-Backspace"),
        exec: function (editor: Editor) { editor.removeToLineStart(); },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor"
    }, {
        name: "removetolineend",
        bindKey: bindKey("Alt-Delete", "Ctrl-K"),
        exec: function (editor: Editor) { editor.removeToLineEnd(); },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor"
    }, {
        name: "removewordleft",
        bindKey: bindKey("Ctrl-Backspace", "Alt-Backspace|Ctrl-Alt-Backspace"),
        exec: function (editor: Editor) { editor.removeWordLeft(); },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor"
    }, {
        name: "removewordright",
        bindKey: bindKey("Ctrl-Delete", "Alt-Delete"),
        exec: function (editor: Editor) { editor.removeWordRight(); },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor"
    }, {
        name: "outdent",
        bindKey: bindKey("Shift-Tab", "Shift-Tab"),
        exec: function (editor: Editor) { editor.blockOutdent(); },
        multiSelectAction: "forEach",
        scrollIntoView: "selectionPart"
    },
    {
        name: "indent",
        bindKey: bindKey("Tab", "Tab"),
        exec: function (editor: Editor) { editor.indent(); },
        multiSelectAction: "forEach",
        scrollIntoView: "selectionPart"
    }, {
        name: "blockoutdent",
        bindKey: bindKey("Ctrl-[", "Ctrl-["),
        exec: function (editor: Editor) { editor.blockOutdent(); },
        multiSelectAction: "forEachLine",
        scrollIntoView: "selectionPart"
    }, {
        name: "blockindent",
        bindKey: bindKey("Ctrl-]", "Ctrl-]"),
        exec: function (editor: Editor) { editor.blockIndent(); },
        multiSelectAction: "forEachLine",
        scrollIntoView: "selectionPart"
    }, {
        name: COMMAND_NAME_INSERT_STRING,
        exec: function (editor: Editor, str: string) { editor.insert(str); },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor"
    }, {
        name: "inserttext",
        exec: function (editor: Editor, args: { text?: string; times?: number }) {
            editor.insert(stringRepeat(args.text || "", args.times || 1));
        },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor"
    }, {
        name: "splitline",
        bindKey: bindKey(null, "Ctrl-O"),
        exec: function (editor: Editor) { editor.splitLine(); },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor"
    }, {
        name: "transposeletters",
        // Ctrl-T does not work on Chrome.
        bindKey: bindKey("Alt-X", "Ctrl-T"),
        exec: function (editor: Editor) { editor.transposeLetters(); },
        multiSelectAction: function (editor: Editor) { editor.transposeLetters(); },
        scrollIntoView: "cursor"
    }, {
        name: "touppercase",
        bindKey: bindKey("Ctrl-U", "Ctrl-U"),
        exec: function (editor: Editor) { editor.toUpperCase(); },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor"
    }, {
        name: "tolowercase",
        bindKey: bindKey("Ctrl-Shift-U", "Ctrl-Shift-U"),
        exec: function (editor: Editor) { editor.toLowerCase(); },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor"
    }, {
        name: "expandtoline",
        bindKey: bindKey("Ctrl-Shift-L", "Command-Shift-L"),
        exec: function (editor: Editor) {
            if (editor.selection) {
                const range = editor.selection.getRange();

                range.start.column = range.end.column = 0;
                range.end.row++;
                editor.selection.setRange(range, false);
            }
        },
        multiSelectAction: "forEach",
        scrollIntoView: "cursor",
        readOnly: true
    }, {
        name: "joinlines",
        bindKey: bindKey(null, null),
        exec: function (editor: Editor) {
            if (editor.selection) {
                const isBackwards = editor.selection.isBackwards();
                const selectionStart = isBackwards ? editor.selection.getSelectionLead() : editor.selection.getSelectionAnchor();
                const selectionEnd = isBackwards ? editor.selection.getSelectionAnchor() : editor.selection.getSelectionLead();
                if (editor.session && editor.session.doc) {
                    const firstLineEndCol = editor.session.doc.getLine(selectionStart.row).length;
                    const selectedText = editor.session.doc.getTextRange(editor.selection.getRange());
                    const selectedCount = selectedText.replace(/\n\s*/, " ").length;
                    let insertLine = editor.session.doc.getLine(selectionStart.row);

                    for (let i = selectionStart.row + 1; i <= selectionEnd.row + 1; i++) {
                        let curLine = stringTrimLeft(stringTrimRight(editor.session.doc.getLine(i)));
                        if (curLine.length !== 0) {
                            curLine = " " + curLine;
                        }
                        insertLine += curLine;
                    };

                    if (selectionEnd.row + 1 < (editor.session.doc.getLength() - 1)) {
                        // Don't insert a newline at the end of the document
                        insertLine += editor.session.doc.getNewLineCharacter();
                    }

                    editor.clearSelection();
                    editor.session.doc.replace(new Range(selectionStart.row, 0, selectionEnd.row + 2, 0), insertLine);

                    if (selectedCount > 0) {
                        // Select the text that was previously selected
                        editor.selection.moveCursorTo(selectionStart.row, selectionStart.column);
                        editor.selection.selectTo(selectionStart.row, selectionStart.column + selectedCount);
                    }
                    else {
                        // If the joined line had something in it, start the cursor at that something
                        const column = editor.session.doc.getLine(selectionStart.row).length > firstLineEndCol ? (firstLineEndCol + 1) : firstLineEndCol;
                        editor.selection.moveCursorTo(selectionStart.row, column);
                    }
                }
            }
        },
        multiSelectAction: "forEach",
        readOnly: true
    }, {
        name: "invertSelection",
        bindKey: bindKey(null, null),
        exec: function (editor: Editor) {
            if (editor.session && editor.session.doc && editor.selection) {
                const endRow = editor.session.doc.getLength() - 1;
                const endCol = editor.session.doc.getLine(endRow).length;
                let ranges = editor.selection.rangeList.ranges;
                const newRanges: Range[] = [];

                // If multiple selections don't exist, rangeList will return 0 so replace with single range
                if (ranges.length < 1) {
                    ranges = [editor.selection.getRange()];
                }

                for (let i = 0; i < ranges.length; i++) {
                    if (i === (ranges.length - 1)) {
                        // The last selection must connect to the end of the document, unless it already does
                        if (!(ranges[i].end.row === endRow && ranges[i].end.column === endCol)) {
                            newRanges.push(new Range(ranges[i].end.row, ranges[i].end.column, endRow, endCol));
                        }
                    }

                    if (i === 0) {
                        // The first selection must connect to the start of the document, unless it already does
                        if (!(ranges[i].start.row === 0 && ranges[i].start.column === 0)) {
                            newRanges.push(new Range(0, 0, ranges[i].start.row, ranges[i].start.column));
                        }
                    } else {
                        newRanges.push(new Range(ranges[i - 1].end.row, ranges[i - 1].end.column, ranges[i].start.row, ranges[i].start.column));
                    }
                }

                editor.exitMultiSelectMode();
                editor.clearSelection();

                for (let i = 0; i < newRanges.length; i++) {
                    editor.selection.addRange(newRanges[i], false);
                }
            }
        },
        readOnly: true,
        scrollIntoView: "none"
    }];

export default commands;
