"use strict";

import Document from '../Document';
import Editor from '../Editor';
import Position from '../Position';
import Range from '../Range';
import getPosition from './getPosition';

/**
 * A wrapper around an Editor to perform conversions between linear character, {row;column} and TextRange representations.
 * 
 * The editor is integral to the conversion because it knows the lengths of each line.
 */
export default class EditorPosition {
    private editor: Editor;
    constructor(editor: Editor) {
        this.editor = editor;
    }
    getPositionChars(pos: Position): number {
        var doc = this.editor.getSession().getDocument();
        return EditorPosition.getChars(doc, pos);
    }
    getPositionFromChars(chars: number): Position {
        var doc = this.editor.getSession().getDocument();
        return getPosition(doc, chars);
    }
    getCurrentPositionChars(): number {
        return this.getPositionChars(this.editor.getCursorPosition());
    }
    getCurrentLeftChar(): string {
        return this.getPositionLeftChar(this.editor.getCursorPosition());
    }
    getTextAtCursorPosition(cursor: Position): string {
        var range = new Range(cursor.row, cursor.column, cursor.row, cursor.column + 1);
        // The final function would probably have been better named 'getTextInRange'.
        return this.editor.getSession().getDocument().getTextRange(range);
    }
    getPositionLeftChar(cursor: Position): string {
        var range = new Range(cursor.row, cursor.column, cursor.row, cursor.column - 1);
        return this.editor.getSession().getDocument().getTextRange(range);
    }

    static getChars(doc: Document, pos: Position): number {
        return EditorPosition.getLinesChars(doc.getLines(0, pos.row - 1)) + pos.column;
    }

    static getLinesChars(lines: string[]): number {
        var count = 0;
        lines.forEach(function(line) {
            // I assume we are adding 1 for the implicit newline character.
            return count += line.length + 1;
        });
        return count;
    }
    static getPositionChars(editor: Editor, pos: Position): number {
        var doc = editor.getSession().getDocument();
        return EditorPosition.getChars(doc, pos);
    }

}
