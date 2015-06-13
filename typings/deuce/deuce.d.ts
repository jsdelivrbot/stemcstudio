//
// Copyright (c) David Holmes.  All rights reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

declare module ace {

    interface EventEmitter {
        addEventListener(eventName: string, callback: any, capturing?: boolean): void;
        removeEventListener(eventName: string, callback: any): void;

        on(eventName: string, callback: Function, capturing?: boolean): void;

        _emit(eventName: string, event?): void
    }

    interface WorkerSender extends EventEmitter {
        /**
         * Calls postMessage with type 'call', id=callbackId and data.
         * @param {any} data The data to send.
         * @param {number} callbackId Identifier for tagging the return call.
         */
        callback(data, callbackId): void;
        /**
         * Calls postMessage with type 'event', name and data.
         * @param {string} name
         * @param {any} data
         */
        emit(name: string, data?): void;
    }

    interface EditorCommand {
        name: string;
        bindKey: any;
        exec: Function;
    }

    interface CommandManager {
        byName;
        commands;
        addCommands(commands: EditorCommand[]);
        addCommand(command: EditorCommand);
        platform: string; // win or mac
        exec(command: string, editor: Editor, args: any);
        findKeyCommand(hashId, key);
    }

    /**
     * The {row: number; column: number} representation of the cursor position in the editor.
     */
    interface CursorPosition {
        row: number;
        column: number;
    }

    /**
     * Defines a range of text in terms of the starting and ending cursor positions.
     */
    interface CursorRange {
        start: CursorPosition;
        end: CursorPosition;
    }

    interface Annotation {
        row: number;
        column: number;
        text: string;
        type: string;
    }

    interface Document extends EventEmitter {
        getAllLines(): string[];
        getLines(firstRow: number, lastRow: number): string[];
        getLine(row: number): string;
        isNewLine(text: string): boolean;
        getValue();
        getLength(): number;
        getTextRange(range: CursorRange): string;
    }

    interface UndoManager {
        new ();
        undo(dontSelect?: boolean);
        redo(dontSelect?: boolean): string;
        reset(): void;
        hasUndo(): boolean;
        hasRedo(): boolean;
    }

    interface TokenInfo {
        value: string;
    }

    interface EditSession extends EventEmitter {
        doc;
        new (content: string, mode: string);
        multiSelect;
        getUndoManager(): UndoManager;
        getValue(): string;
        setOverwrite(val: boolean): void;
        getOverwrite(): boolean;
        setValue(value: string);
        getDocument(): Document;
        setMode(mode: string);
        getSelection(): any;
        setNewLineMode(mode: string); // unix, windows or auto
        getNewLineMode(): string;
        getMode(): any;
        setUndoManager(manager: UndoManager);
        on: (eventName: string, handler: Function, capturing?: boolean) => void;
        /**
         * Converts characters coordinates on the screen to characters coordinates within the document. [This takes into account code folding, word wrap, tab size, and any other visual modifications.]{: #conversionConsiderations}
         * @param {number} screenRow The screen row to check
         * @param {number} screenColumn The screen column to check
         * @returns {row: number; column: number} The object returned has two properties: `row` and `column`
         */
        screenToDocumentPosition(screenRow: number, screenColumn: number): { row: number; column: number };
        documentToScreenPosition(docRow: number, docColumn: number);
        getLine(row: number): string;
        removeListener(event: string, listener: Function);
        removeAllListeners(event: string);
        getTokenAt(row: number, column: number): TokenInfo;
        setAnnotations(annotations: Annotation[]);
        replace(range: string, newText: string);
        /**
         * Adds a new marker to the given `EditorRange`. If `inFront` is `true`, a front marker is defined, and the `'changeFrontMarker'` event fires; otherwise, the `'changeBackMarker'` event fires.
         * @param {CursorRange} range Define the range of the marker
         * @param {string} clazz Set the CSS class for the marker
         * @param {function | string} type Identify the type of the marker
         * @param {boolean} inFront Set to `true` to establish a front marker
         *
         *
         * @return {number} The new marker id
         */
        addMarker(range: CursorRange, clazz: string, type: any, inFront?: boolean): number;
        /**
         * Removes the marker with the specified ID. If this marker was in front, the `'changeFrontMarker'` event is emitted. If the marker was in the back, the `'changeBackMarker'` event is emitted.
         * @param {number} markerId A number representing a marker
         */
        removeMarker(markerId: number): void;
        /**
         * Returns an array containing the IDs of all the markers, either front or back.
         * @param {boolean} inFront If `true`, indicates you only want front markers; `false` indicates only back markers
         *
         * @returns {Array}
         **/
        getMarkers(inFront: boolean);
        getTabSize(): number;
        setTabSize(tabSize: number): void;
        highlight(what: string): void
    }

    interface Position {
        row: number;
        column: number;
    }

    interface Editor extends EventEmitter {
        find(value: string, options, something);
        /**
         * Brings the current `textInput` into focus.
         */
        focus(): void;
        setReadOnly(readOnly: boolean);
        getReadOnly(): boolean;
        replace(value: string, options);
        session: EditSession;
        renderer;
        resize(force: boolean);
        keyBinding;
        clearSelection();
        selectAll();
        centerSelection();
        onTextInput: (text: string) => any;
        getSelectionRange(): string;
        /**
         * Moves the cursor to the specified line number, and also into the indiciated column.
         * @param {number} lineNumber The line number to go to
         * @param {number} column A column number to go to
         * @param {boolean} animate If `true` animates scolling
         **/
        gotoLine(lineNumber: number, column: number, animate?: boolean): void;
        remove(direction: string);
        insert(text: string);
        container: HTMLElement;
        commands: CommandManager;
        setSession(session: EditSession);
        getCursorPosition(): {row: number; column: number};
        execCommand(command: string);
        getSession(): EditSession;
        setTheme(theme: string);
        getTheme(): string;
        moveCursorTo(row: number, column: number, animate?: boolean);
        moveCursorToPosition(position: {row: number; column: number});
        setDisplayIndentGuides(displayIndentGuides: boolean): void;
        /**
         * Set a new font size (in pixels) for the editor text, e.g. "12px".
         * @param {string} size A font size.
         */
        setFontSize(fontSize: string): void;
        setPrintMarginColumn(column: number);
        getShowInvisibles(): boolean;
        /**
         * If showInvisibles is set to true, invisible characters like spaces or new lines are shown in the editor.
         * @param {boolean} showInvisibles Specifies whether or not to show invisible characters.
         */
        setShowInvisibles(showInvisibles: boolean): void;
        setShowPrintMargin(showPrintMargin: boolean): void;
        getValue(): string;
        setValue(val: string, cursorPos?);
        indent();
        getSelection();
        onChangeFrontMarker();
        env;
        on(eventName, callback);
        /**
         * Enables automatic scrolling of the cursor into view when editor itself is inside scrollable element
         * @param {boolean} enable default true
         **/
        setAutoScrollEditorIntoView(enable: boolean);
        setOption(name: string, value: any);
        setOptions(options: any);
        /**
         * Changes the file contents and ensures that the workspace knows about the file.
         */
        changeFile(content: string, fileName: string, cursorPos: number): void;
    }

    interface Workspace {
        ensureScript(fileName: string, content: string, flag: boolean): void;
        editScript(fileName: string, start: number, end: number, text: string): void;
        removeScript(fileName: string): void;
        getFileNames(callback): void;
        getSyntaxErrors(fileName: string, callback: (err, results) => void): void;
        getSemanticErrors(fileName: string, callback: (err, results) => void): void;
        getCompletionsAtPosition(fileName: string, position: number, memberMode: boolean, callback: (err, results) => void): void;
        getTypeAtDocumentPosition(fileName: string, documentPosition: { row: number; column: number }, callback: (err, typeInfo) => void): void;
        getOutputFiles(fileName: string, callback: (err, results) => void): void;
    }
    
    interface Tokenizer {
        getLineTokens(line: string, startState);
    }
    
    interface ListBoxPopup extends Editor {
        isOpen;
        isTopdown;
        data;
        $imageSize;
        $borderSize;
        $isFocused;
        $computeWidth(): number;
        session: EditSession;
        selection;
        show(pos, lineHeight, topdownOnly);
        hide(): void;
        setHighlightActiveLine(highlightActiveLine: boolean): void;
        setRow(line: number): void;
        getRow(): number;
        setData(list);
        getData(row: number);
        getTextLeftOffset(): number;
        _signal(what: string): void;
    }


    interface IAce {

        /**
         * Provides access to require in packed noconflict mode
         * @param moduleName
        **/
        require(moduleName: string): any;

        /**
         * Embeds the Ace editor into the DOM, at the element provided by `elementId`.
         * @param elementId Either the id of an element, or the element itself
        **/
        edit(elementId: string, workspace: Workspace): Editor;

        /**
         * Embeds the Ace editor into the DOM, at the element provided by `htmlElement`.
         * @param htmlElement Either the id of an element, or the element itself
        **/
        edit(htmlElement: HTMLElement, workspace: Workspace): Editor;

        /**
         * Creates a new [[EditSession]], and returns the associated [[Document]].
         * @param text {:textParam}
         * @param mode {:modeParam}
        **/
        createEditSession(text: Document, mode: string);

        /**
         * Creates a new [[EditSession]], and returns the associated [[Document]].
         * @param text {:textParam}
         * @param mode {:modeParam}
        **/
        createEditSession(text: string, mode: string);

        workspace(): Workspace;

        config: any;
    }

}

declare var ace: ace.IAce

declare module 'ace' {
    export = ace;
}
