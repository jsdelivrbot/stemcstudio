System.registerDynamic('npm:editor-document@0.0.5/build/browser/index.js', [], true, function ($__require, exports, module) {
    /* */
    "format cjs";

    var global = this || self,
        GLOBAL = global;
    (function (global, factory) {
        typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof undefined === 'function' && define.amd ? define(['exports'], factory) : factory(global.editorDocument = global.editorDocument || {});
    })(exports, function (exports) {
        'use strict';

        function applyDelta(docLines, delta, doNotValidate) {
            // Disabled validation since it breaks autocompletion popup.
            /*
            if (!doNotValidate) {
                validateDelta(docLines, delta);
            }
            */
            var row = delta.start.row;
            var startColumn = delta.start.column;
            var line = docLines[row] || "";
            switch (delta.action) {
                case "insert":
                    var lines = delta.lines;
                    if (lines.length === 1) {
                        docLines[row] = line.substring(0, startColumn) + delta.lines[0] + line.substring(startColumn);
                    } else {
                        var args = [row, 1];
                        args = args.concat(delta.lines);
                        docLines.splice.apply(docLines, args);
                        docLines[row] = line.substring(0, startColumn) + docLines[row];
                        docLines[row + delta.lines.length - 1] += line.substring(startColumn);
                    }
                    break;
                case "remove":
                    var endColumn = delta.end.column;
                    var endRow = delta.end.row;
                    if (row === endRow) {
                        docLines[row] = line.substring(0, startColumn) + line.substring(endColumn);
                    } else {
                        docLines.splice(row, endRow - row + 1, line.substring(0, startColumn) + docLines[endRow].substring(endColumn));
                    }
                    break;
                default:
                    {
                        // Do nothing.
                    }
            }
        }

        function position(row, column) {
            return { row: row, column: column };
        }
        /**
         * Returns 0 if positions are equal, +1 if p1 comes after p2, -1 if p1 comes before p2.
         */
        function comparePositions(p1, p2) {
            if (p1.row > p2.row) {
                return 1;
            } else if (p1.row < p2.row) {
                return -1;
            } else {
                if (p1.column > p2.column) {
                    return 1;
                } else if (p1.column < p2.column) {
                    return -1;
                } else {
                    return 0;
                }
            }
        }
        function equalPositions(p1, p2) {
            return p1.row === p2.row && p1.column === p2.column;
        }

        // import { Observable } from 'rxjs/Observable';
        // import { Observer } from 'rxjs/Observer';
        // import { EventBus } from "../EventBus";
        // import { Command } from '../../virtual/editor';
        var stopPropagation = function () {
            this.propagationStopped = true;
        };
        var preventDefault = function () {
            this.defaultPrevented = true;
        };
        /*
        export interface DefaultHandler<T> {
            (event: { command: Command<T>; target: T, args: any }, source: T): void;
        }
        */
        /**
         * Intended to be used as a Mixin.
         * N.B. The original implementation was an object, the TypeScript way is
         * designed to satisfy the compiler.
         */
        var EventEmitterClass = function () {
            /**
             *
             */
            function EventEmitterClass(owner) {
                this.owner = owner;
            }
            /**
             * Calls the listeners any any default handlers with an elaborate
             * mechanism for limiting both propagation and the default invocation.
             */
            EventEmitterClass.prototype._dispatchEvent = function (eventName, event) {
                if (!this._eventRegistry) {
                    this._eventRegistry = {};
                }
                if (!this._defaultHandlers) {
                    this._defaultHandlers = {};
                }
                var listeners = this._eventRegistry[eventName] || [];
                var defaultHandler = this._defaultHandlers[eventName];
                if (!listeners.length && !defaultHandler) return;
                if (typeof event !== "object" || !event) {
                    event = {};
                }
                // FIXME: This smells a bit.
                if (!event['type']) {
                    event['type'] = eventName;
                }
                if (!event['stopPropagation']) {
                    event['stopPropagation'] = stopPropagation;
                }
                if (!event['preventDefault']) {
                    event['preventDefault'] = preventDefault;
                }
                // Make a copy in order to avoid race conditions.
                listeners = listeners.slice();
                for (var i = 0; i < listeners.length; i++) {
                    listeners[i](event, this.owner);
                    if (event['propagationStopped']) {
                        break;
                    }
                }
                if (defaultHandler && !event['defaultPrevented']) {
                    return defaultHandler(event, this.owner);
                }
            };
            /**
             *
             */
            EventEmitterClass.prototype.hasListeners = function (eventName) {
                var registry = this._eventRegistry;
                var listeners = registry && registry[eventName];
                return listeners && listeners.length > 0;
            };
            /**
             * Emit uses the somewhat complex semantics of the dispatchEvent method.
             * Consider using `signal` for more elementary behaviour.
             */
            EventEmitterClass.prototype._emit = function (eventName, event) {
                return this._dispatchEvent(eventName, event);
            };
            /**
             * Calls each listener subscribed to the eventName passing the event and the source.
             */
            EventEmitterClass.prototype._signal = function (eventName, event) {
                /**
                 * The listeners subscribed to the specified event name
                 */
                var listeners = (this._eventRegistry || {})[eventName];
                if (!listeners) {
                    return;
                }
                // slice just makes a copy so that we don't mess up on array bounds.
                // It's a bit expensive though?
                listeners = listeners.slice();
                for (var _i = 0, listeners_1 = listeners; _i < listeners_1.length; _i++) {
                    var listener = listeners_1[_i];
                    listener(event, this.owner);
                }
            };
            /*
                events(eventName: NAME): Observable<E> {
                    return new Observable<E>((observer: Observer<E>) => {
                        function changeListener(value: E, source: T) {
                            observer.next(value);
                        }
                        return this.on(eventName, changeListener, false);
                    });
                }
            */
            EventEmitterClass.prototype.once = function (eventName, callback) {
                var _self = this;
                if (callback) {
                    this.addEventListener(eventName, function newCallback() {
                        _self.removeEventListener(eventName, newCallback);
                        callback.apply(null, arguments);
                    });
                }
            };
            /*
                setDefaultHandler(eventName: NAME, callback: DefaultHandler<T>) {
                    // FIXME: All this casting is creepy.
                    let handlers: any = this._defaultHandlers;
                    if (!handlers) {
                        handlers = this._defaultHandlers = <any>{ _disabled_: {} };
                    }
                     if (handlers[eventName]) {
                        const existingHandler = handlers[eventName];
                        let disabled = handlers._disabled_[eventName];
                        if (!disabled) {
                            handlers._disabled_[eventName] = disabled = [];
                        }
                        disabled.push(existingHandler);
                        const i = disabled.indexOf(callback);
                        if (i !== -1)
                            disabled.splice(i, 1);
                    }
                    handlers[eventName] = callback;
                }
            */
            /*
                removeDefaultHandler(eventName: NAME, callback: (event: E, source: T) => any) {
                    // FIXME: All this casting is creepy.
                    const handlers: any = this._defaultHandlers;
                    if (!handlers) {
                        return;
                    }
                    const disabled = handlers._disabled_[eventName];
                     if (handlers[eventName] === callback) {
                        // FIXME: Something wrong here.
                        // unused = handlers[eventName];
                        if (disabled) {
                            this.setDefaultHandler(eventName, disabled.pop());
                        }
                    }
                    else if (disabled) {
                        const i = disabled.indexOf(callback);
                        if (i !== -1) {
                            disabled.splice(i, 1);
                        }
                    }
                }
            */
            // Discourage usage.
            EventEmitterClass.prototype.addEventListener = function (eventName, callback, capturing) {
                var _this = this;
                this._eventRegistry = this._eventRegistry || {};
                var listeners = this._eventRegistry[eventName];
                if (!listeners) {
                    listeners = this._eventRegistry[eventName] = [];
                }
                if (listeners.indexOf(callback) === -1) {
                    if (capturing) {
                        listeners.unshift(callback);
                    } else {
                        listeners.push(callback);
                    }
                }
                return function () {
                    _this.removeEventListener(eventName, callback, capturing);
                };
            };
            /**
             *
             */
            EventEmitterClass.prototype.on = function (eventName, callback, capturing) {
                return this.addEventListener(eventName, callback, capturing);
            };
            // Discourage usage.
            EventEmitterClass.prototype.removeEventListener = function (eventName, callback, capturing) {
                this._eventRegistry = this._eventRegistry || {};
                var listeners = this._eventRegistry[eventName];
                if (!listeners) return;
                var index = listeners.indexOf(callback);
                if (index !== -1) {
                    listeners.splice(index, 1);
                }
            };
            /**
             *
             */
            EventEmitterClass.prototype.off = function (eventName, callback, capturing) {
                return this.removeEventListener(eventName, callback, capturing);
            };
            /**
             *
             */
            EventEmitterClass.prototype.removeAllListeners = function (eventName) {
                if (this._eventRegistry) this._eventRegistry[eventName] = [];
            };
            return EventEmitterClass;
        }();

        function range(start, end) {
            return { start: start, end: end };
        }
        /**
         * The range is empty if the start and end position coincide.
         */
        function isEmptyRange(range) {
            return equalPositions(range.start, range.end);
        }

        /**
         * Copies a Position.
         */
        function clonePos(pos) {
            return { row: pos.row, column: pos.column };
        }
        /**
         * Constructs a Position from row and column.
         */
        function pos(row, column) {
            return { row: row, column: column };
        }
        var $split = function () {
            function foo(text) {
                return text.replace(/\r\n|\r/g, "\n").split("\n");
            }
            function bar(text) {
                return text.split(/\r\n|\r|\n/);
            }
            // Determine whether the split function performs as we expect.
            // Here we attempt to separate a string of three separators.
            // If all works out, we should get back an array of four (4) empty strings.
            if ("aaa".split(/a/).length === 0) {
                return foo;
            } else {
                // In Chrome, this is the mainline because the result
                // of the test condition length is 4.
                return bar;
            }
        }();
        /*
        function clipPosition(doc: Document, position: Position): Position {
            const length = doc.getLength();
            if (position.row >= length) {
                position.row = Math.max(0, length - 1);
                position.column = doc.getLine(length - 1).length;
            }
            else {
                position.row = Math.max(0, position.row);
                position.column = Math.min(Math.max(position.column, 0), doc.getLine(position.row).length);
            }
            return position;
        }
        */
        var CHANGE = 'change';
        var CHANGE_NEW_LINE_MODE = 'changeNewLineMode';
        /**
         *
         */
        var Document = function () {
            /**
             * If text is included, the Document contains those strings; otherwise, it's empty.
             * A `change` event will be emitted. But does anyone see it?
             *
             * @param textOrLines
             */
            function Document(textOrLines) {
                /**
                 * The lines of text.
                 * These lines do not include a line terminating character.
                 */
                this._lines = [];
                /**
                 *
                 */
                this._autoNewLine = "";
                /**
                 *
                 */
                this._newLineMode = "auto";
                /**
                 * Maintains a count of the number of references to this instance of Document.
                 */
                this.refCount = 1;
                this._lines = [""];
                this._eventBus = new EventEmitterClass(this);
                /*
                this.changeEvents = new Observable<Delta>((observer: Observer<Delta>) => {
                    function changeListener(value: Delta, source: Document) {
                        observer.next(value);
                    }
                    this.addChangeListener(changeListener);
                    return () => {
                        this.removeChangeListener(changeListener);
                    };
                });
                */
                // There has to be one line at least in the document. If you pass an empty
                // string to the insert function, nothing will happen. Workaround.
                if (textOrLines.length === 0) {
                    this._lines = [""];
                } else if (Array.isArray(textOrLines)) {
                    this.insertMergedLines({ row: 0, column: 0 }, textOrLines);
                } else {
                    this.insert({ row: 0, column: 0 }, textOrLines);
                }
            }
            Document.prototype.destructor = function () {
                this._lines.length = 0;
                this._eventBus = void 0;
            };
            Document.prototype.addRef = function () {
                this.refCount++;
                return this.refCount;
            };
            Document.prototype.release = function () {
                this.refCount--;
                if (this.refCount === 0) {
                    this.destructor();
                } else if (this.refCount < 0) {
                    throw new Error("Document refCount is negative.");
                }
                return this.refCount;
            };
            /**
             * Replaces all the lines in the current `Document` with the value of `text`.
             * A `change` event will be emitted.
             */
            Document.prototype.setValue = function (text) {
                var row = this.getLength() - 1;
                var start = position(0, 0);
                var end = position(row, this.getLine(row).length);
                // FIXME: Can we avoid the temporary objects?
                this.remove(range(start, end));
                this.insert({ row: 0, column: 0 }, text);
            };
            /**
             * Returns all the lines in the document as a single string, joined by the new line character.
             */
            Document.prototype.getValue = function () {
                return this._lines.join(this.getNewLineCharacter());
            };
            Document.prototype.eventBusOrThrow = function () {
                if (this._eventBus) {
                    return this._eventBus;
                } else {
                    throw new Error("Document is a zombie.");
                }
            };
            /**
             * Determines the newline character that is present in the presented text
             * and caches the result in $autoNewLine.
             * Emits 'changeNewLineMode'.
             */
            Document.prototype.$detectNewLine = function (text) {
                var match = text.match(/^.*?(\r\n|\r|\n)/m);
                this._autoNewLine = match ? match[1] : "\n";
                this.eventBusOrThrow()._signal(CHANGE_NEW_LINE_MODE);
            };
            /**
             * Returns the newline character that's being used, depending on the value of `newLineMode`.
             *  If `newLineMode == windows`, `\r\n` is returned.
             *  If `newLineMode == unix`, `\n` is returned.
             *  If `newLineMode == auto`, the value of `autoNewLine` is returned.
             */
            Document.prototype.getNewLineCharacter = function () {
                switch (this._newLineMode) {
                    case "windows":
                        return "\r\n";
                    case "unix":
                        return "\n";
                    default:
                        return this._autoNewLine || "\n";
                }
            };
            /**
             * Sets the new line mode.
             *
             * newLineMode is the newline mode to use; can be either `windows`, `unix`, or `auto`.
             * Emits 'changeNewLineMode'
             */
            Document.prototype.setNewLineMode = function (newLineMode) {
                if (this._newLineMode === newLineMode) {
                    return;
                }
                this._newLineMode = newLineMode;
                this.eventBusOrThrow()._signal(CHANGE_NEW_LINE_MODE);
            };
            /**
             * Returns the type of newlines being used; either `windows`, `unix`, or `auto`.
             */
            Document.prototype.getNewLineMode = function () {
                return this._newLineMode;
            };
            /**
             * Returns `true` if `text` is a newline character (either `\r\n`, `\r`, or `\n`).
             *
             * @param text The text to check.
             */
            Document.prototype.isNewLine = function (text) {
                return text === "\r\n" || text === "\r" || text === "\n";
            };
            /**
             * Returns a verbatim copy of the given line as it is in the document.
             *
             * @param row The row index to retrieve.
             */
            Document.prototype.getLine = function (row) {
                return this._lines[row] || "";
            };
            /**
             * Returns a COPY of the lines between and including `firstRow` and `lastRow`.
             * These lines do not include the line terminator.
             *
             * @param firstRow The first row index to retrieve.
             * @param lastRow The final row index to retrieve.
             */
            Document.prototype.getLines = function (firstRow, lastRow) {
                // The semantics of slice are that it does not include the end index.
                var end = lastRow + 1;
                return this._lines.slice(firstRow, end);
            };
            /**
             * Returns a COPY of the lines in the document.
             * These lines do not include the line terminator.
             */
            Document.prototype.getAllLines = function () {
                return this._lines.slice(0, this._lines.length);
            };
            /**
             * Returns the number of rows in the document.
             */
            Document.prototype.getLength = function () {
                return this._lines.length;
            };
            /**
             * Returns all the text corresponding to the range with line terminators.
             */
            Document.prototype.getTextRange = function (range$$1) {
                return this.getLinesForRange(range$$1).join(this.getNewLineCharacter());
            };
            /**
             * Returns all the text within `range` as an array of lines.
             */
            Document.prototype.getLinesForRange = function (range$$1) {
                var lines;
                if (range$$1.start.row === range$$1.end.row) {
                    // Handle a single-line range.
                    lines = [this.getLine(range$$1.start.row).substring(range$$1.start.column, range$$1.end.column)];
                } else {
                    // Handle a multi-line range.
                    lines = this.getLines(range$$1.start.row, range$$1.end.row);
                    lines[0] = (lines[0] || "").substring(range$$1.start.column);
                    var l = lines.length - 1;
                    if (range$$1.end.row - range$$1.start.row === l) {
                        lines[l] = lines[l].substring(0, range$$1.end.column);
                    }
                }
                return lines;
            };
            /**
             * Inserts a block of `text` at the indicated `position`.
             * Returns the end position of the inserted text, the character immediately after the last character inserted.
             * This method also triggers the 'change' event.
             */
            Document.prototype.insert = function (position$$1, text) {
                // Only detect new lines if the document has no line break yet.
                if (this.getLength() <= 1) {
                    this.$detectNewLine(text);
                }
                return this.insertMergedLines(position$$1, $split(text));
            };
            /**
             * Inserts `text` into the `position` at the current row. This method also triggers the `"change"` event.
             *
             * This differs from the `insert` method in two ways:
             *   1. This does NOT handle newline characters (single-line text only).
             *   2. This is faster than the `insert` method for single-line text insertions.
             */
            Document.prototype.insertInLine = function (position$$1, text) {
                var start = this.clippedPos(position$$1.row, position$$1.column);
                var end = pos(position$$1.row, position$$1.column + text.length);
                this.applyDelta({
                    start: start,
                    end: end,
                    action: "insert",
                    lines: [text]
                }, true);
                return clonePos(end);
            };
            /**
             * Clips the position so that it refers to the nearest valid position.
             */
            Document.prototype.clippedPos = function (row, column) {
                var length = this.getLength();
                var rowTooBig = false;
                if (row === void 0) {
                    row = length;
                } else if (row < 0) {
                    row = 0;
                } else if (row >= length) {
                    row = length - 1;
                    rowTooBig = true;
                }
                var line = this.getLine(row);
                if (rowTooBig) {
                    column = line.length;
                }
                column = Math.min(Math.max(column, 0), line.length);
                return { row: row, column: column };
            };
            Document.prototype.on = function (eventName, callback, capturing) {
                return this.eventBusOrThrow().on(eventName, callback, capturing);
            };
            Document.prototype.off = function (eventName, callback, capturing) {
                return this.eventBusOrThrow().off(eventName, callback, capturing);
            };
            /**
             *
             */
            Document.prototype.addChangeListener = function (callback) {
                return this.on(CHANGE, callback, false);
            };
            /**
             *
             */
            Document.prototype.addChangeNewLineModeListener = function (callback) {
                this.on(CHANGE_NEW_LINE_MODE, callback, false);
            };
            /**
             *
             */
            Document.prototype.removeChangeListener = function (callback) {
                this.off(CHANGE, callback);
            };
            /**
             *
             */
            Document.prototype.removeChangeNewLineModeListener = function (callback) {
                this.off(CHANGE_NEW_LINE_MODE, callback);
            };
            /**
             * Inserts the elements in `lines` into the document as full lines (does not merge with existing line), starting at the row index given by `row`.
             * This method also triggers the `"change"` event.
             */
            Document.prototype.insertFullLines = function (row, lines) {
                // Clip to document.
                // Allow one past the document end.
                row = Math.min(Math.max(row, 0), this.getLength());
                // Calculate insertion point.
                var column = 0;
                if (row < this.getLength()) {
                    // Insert before the specified row.
                    lines = lines.concat([""]);
                    column = 0;
                } else {
                    // Insert after the last row in the document.
                    lines = [""].concat(lines);
                    row--;
                    column = this._lines[row].length;
                }
                // Insert.
                return this.insertMergedLines({ row: row, column: column }, lines);
            };
            /**
             * Inserts the text in `lines` into the document, starting at the `position` given.
             * Returns the end position of the inserted text.
             * This method also triggers the 'change' event.
             */
            Document.prototype.insertMergedLines = function (position$$1, lines) {
                var start = this.clippedPos(position$$1.row, position$$1.column);
                var end = {
                    row: start.row + lines.length - 1,
                    column: (lines.length === 1 ? start.column : 0) + lines[lines.length - 1].length
                };
                this.applyDelta({
                    start: start,
                    end: end,
                    action: "insert",
                    lines: lines
                });
                return clonePos(end);
            };
            /**
             * Removes the `range` from the document.
             * This method triggers a 'change' event.
             *
             * @param range A specified Range to remove
             * @return Returns the new `start` property of the range.
             * If `range` is empty, this function returns the unmodified value of `range.start`.
             */
            Document.prototype.remove = function (range$$1) {
                var start = this.clippedPos(range$$1.start.row, range$$1.start.column);
                var end = this.clippedPos(range$$1.end.row, range$$1.end.column);
                this.applyDelta({
                    start: start,
                    end: end,
                    action: "remove",
                    lines: this.getLinesForRange({ start: start, end: end })
                });
                return clonePos(start);
            };
            /**
             * Removes the specified columns from the `row`.
             * This method also triggers the `'change'` event.
             *
             * @param row The row to remove from.
             * @param startColumn The column to start removing at.
             * @param endColumn The column to stop removing at.
             * @returns An object containing `startRow` and `startColumn`, indicating the new row and column values.<br/>If `startColumn` is equal to `endColumn`, this function returns nothing.
             */
            Document.prototype.removeInLine = function (row, startColumn, endColumn) {
                var start = this.clippedPos(row, startColumn);
                var end = this.clippedPos(row, endColumn);
                this.applyDelta({
                    start: start,
                    end: end,
                    action: "remove",
                    lines: this.getLinesForRange({ start: start, end: end })
                }, true);
                return clonePos(start);
            };
            /**
             * Removes a range of full lines and returns a COPY of the removed lines.
             * This method also triggers the `"change"` event.
             *
             * @param firstRow The first row to be removed
             * @param lastRow The last row to be removed
             */
            Document.prototype.removeFullLines = function (firstRow, lastRow) {
                // Clip to document.
                firstRow = Math.min(Math.max(0, firstRow), this.getLength() - 1);
                lastRow = Math.min(Math.max(0, lastRow), this.getLength() - 1);
                // Calculate deletion range.
                // Delete the ending new line unless we're at the end of the document.
                // If we're at the end of the document, delete the starting new line.
                var deleteFirstNewLine = lastRow === this.getLength() - 1 && firstRow > 0;
                var deleteLastNewLine = lastRow < this.getLength() - 1;
                var startRow = deleteFirstNewLine ? firstRow - 1 : firstRow;
                var startCol = deleteFirstNewLine ? this.getLine(startRow).length : 0;
                var endRow = deleteLastNewLine ? lastRow + 1 : lastRow;
                var endCol = deleteLastNewLine ? 0 : this.getLine(endRow).length;
                var start = position(startRow, startCol);
                var end = position(endRow, endCol);
                /**
                 * A copy of delelted lines with line terminators omitted (maintains previous behavior).
                 */
                var deletedLines = this.getLines(firstRow, lastRow);
                this.applyDelta({
                    start: start,
                    end: end,
                    action: "remove",
                    lines: this.getLinesForRange(range(start, end))
                });
                return deletedLines;
            };
            /**
             * Removes the new line between `row` and the row immediately following it.
             *
             * @param row The row to check.
             */
            Document.prototype.removeNewLine = function (row) {
                if (row < this.getLength() - 1 && row >= 0) {
                    this.applyDelta({
                        start: pos(row, this.getLine(row).length),
                        end: pos(row + 1, 0),
                        action: "remove",
                        lines: ["", ""]
                    });
                }
            };
            /**
             * Replaces a range in the document with the new `text`.
             * Returns the end position of the change.
             * This method triggers a 'change' event for the removal.
             * This method triggers a 'change' event for the insertion.
             */
            Document.prototype.replace = function (range$$1, newText) {
                if (newText.length === 0 && isEmptyRange(range$$1)) {
                    // If the range is empty then the range.start and range.end will be the same.
                    return range$$1.end;
                }
                var oldText = this.getTextRange(range$$1);
                // Shortcut: If the text we want to insert is the same as it is already
                // in the document, we don't have to replace anything.
                if (newText === oldText) {
                    return range$$1.end;
                }
                this.remove(range$$1);
                return this.insert(range$$1.start, newText);
            };
            /**
             * Applies all the changes previously accumulated.
             */
            Document.prototype.applyDeltas = function (deltas) {
                for (var i = 0; i < deltas.length; i++) {
                    this.applyDelta(deltas[i]);
                }
            };
            /**
             * Reverts any changes previously applied.
             */
            Document.prototype.revertDeltas = function (deltas) {
                for (var i = deltas.length - 1; i >= 0; i--) {
                    this.revertDelta(deltas[i]);
                }
            };
            /**
             * Applies `delta` (insert and remove actions) to the document and triggers the 'change' event.
             */
            Document.prototype.applyDelta = function (delta, doNotValidate) {
                var isInsert = delta.action === "insert";
                // An empty range is a NOOP.
                if (isInsert ? delta.lines.length <= 1 && !delta.lines[0] : equalPositions(delta.start, delta.end)) {
                    return;
                }
                if (isInsert && delta.lines.length > 20000) this.$splitAndapplyLargeDelta(delta, 20000);
                applyDelta(this._lines, delta, doNotValidate);
                this.eventBusOrThrow()._signal(CHANGE, delta);
            };
            Document.prototype.$splitAndapplyLargeDelta = function (delta, MAX) {
                // Split large insert deltas. This is necessary because:
                //    1. We need to support splicing delta lines into the document via $lines.splice.apply(...)
                //    2. fn.apply() doesn't work for a large number of params. The smallest threshold is on chrome 40 ~42000.
                // we use 20000 to leave some space for actual stack
                //
                // To Do: Ideally we'd be consistent and also split 'delete' deltas. We don't do this now, because delete
                //        delta handling is too slow. If we make delete delta handling faster we can split all large deltas
                //        as shown in https://gist.github.com/aldendaniels/8367109#file-document-snippet-js
                //        If we do this, update validateDelta() to limit the number of lines in a delete delta.
                var lines = delta.lines;
                var l = lines.length;
                var row = delta.start.row;
                var column = delta.start.column;
                var from = 0;
                var to = 0;
                do {
                    from = to;
                    to += MAX - 1;
                    var chunk = lines.slice(from, to);
                    if (to > l) {
                        // Update remaining delta.
                        delta.lines = chunk;
                        delta.start.row = row + from;
                        delta.start.column = column;
                        break;
                    }
                    chunk.push("");
                    this.applyDelta({
                        start: pos(row + from, column),
                        end: pos(row + to, column = 0),
                        action: delta.action,
                        lines: chunk
                    }, true);
                } while (true);
            };
            /**
             * Reverts `delta` from the document.
             * A delta object (can include "insert" and "remove" actions)
             */
            Document.prototype.revertDelta = function (delta) {
                this.applyDelta({
                    start: clonePos(delta.start),
                    end: clonePos(delta.end),
                    action: delta.action === "insert" ? "remove" : "insert",
                    lines: delta.lines.slice()
                });
            };
            /**
             * Converts an index position in a document to a `{row, column}` object.
             *
             * Index refers to the "absolute position" of a character in the document. For example:
             *
             * ```javascript
             * x = 0; // 10 characters, plus one for newline
             * y = -1;
             * ```
             *
             * Here, `y` is an index 15: 11 characters for the first row, and 5 characters until `y` in the second.
             *
             * @param index An index to convert
             * @param startRow The row from which to start the conversion
             * @returns An object of the `index` position.
             */
            Document.prototype.indexToPosition = function (index, startRow) {
                if (startRow === void 0) {
                    startRow = 0;
                }
                /**
                 * A local reference to improve performance in the loop.
                 */
                var lines = this._lines;
                var newlineLength = this.getNewLineCharacter().length;
                var l = lines.length;
                for (var i = startRow || 0; i < l; i++) {
                    index -= lines[i].length + newlineLength;
                    if (index < 0) return { row: i, column: index + lines[i].length + newlineLength };
                }
                return { row: l - 1, column: lines[l - 1].length };
            };
            /**
             * Converts the `position` in a document to the character's zero-based index.
             *
             * Index refers to the "absolute position" of a character in the document. For example:
             *
             * ```javascript
             * x = 0; // 10 characters, plus one for newline
             * y = -1;
             * ```
             *
             * Here, `y` is an index 15: 11 characters for the first row, and 5 characters until `y` in the second.
             *
             * @param position The `{row, column}` to convert.
             * @param startRow The row from which to start the conversion. Defaults to zero.
             */
            Document.prototype.positionToIndex = function (position$$1, startRow) {
                if (startRow === void 0) {
                    startRow = 0;
                }
                /**
                 * A local reference to improve performance in the loop.
                 */
                var lines = this._lines;
                var newlineLength = this.getNewLineCharacter().length;
                var index = 0;
                var row = Math.min(position$$1.row, lines.length);
                for (var i = startRow || 0; i < row; ++i) {
                    index += lines[i].length + newlineLength;
                }
                return index + position$$1.column;
            };
            return Document;
        }();

        exports.applyDelta = applyDelta;
        exports.Document = Document;
        exports.comparePositions = comparePositions;
        exports.equalPositions = equalPositions;
        exports.position = position;
        exports.isEmptyRange = isEmptyRange;
        exports.range = range;

        Object.defineProperty(exports, '__esModule', { value: true });
    });

});
System.registerDynamic("npm:editor-document@0.0.5.js", ["npm:editor-document@0.0.5/build/browser/index.js"], true, function ($__require, exports, module) {
  var global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:editor-document@0.0.5/build/browser/index.js");
});
System.register("src/mode/typescript/ScriptInfo.js", ["editor-document"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var editor_document_1, ScriptInfo;
    return {
        setters: [function (editor_document_1_1) {
            editor_document_1 = editor_document_1_1;
        }],
        execute: function () {
            ScriptInfo = function () {
                function ScriptInfo(textOrLines, version) {
                    this.version = version;
                    this.doc = new editor_document_1.Document(textOrLines);
                }
                ScriptInfo.prototype.updateContent = function (content) {
                    this.updateContentAndVersionNumber(content, this.version + 1);
                };
                ScriptInfo.prototype.updateContentAndVersionNumber = function (content, version) {
                    this.doc.setValue(content);
                    this.version = version;
                };
                ScriptInfo.prototype.applyDelta = function (delta) {
                    this.doc.applyDelta(delta);
                    this.version++;
                    return this.version;
                };
                ScriptInfo.prototype.getValue = function () {
                    return this.doc.getValue();
                };
                ScriptInfo.prototype.getLineAndColumn = function (positionIndex) {
                    var pos = this.doc.indexToPosition(positionIndex);
                    if (pos) {
                        return { line: pos.row + 1, column: pos.column };
                    } else {
                        return void 0;
                    }
                };
                ScriptInfo.prototype.positionToIndex = function (pos) {
                    return this.doc.positionToIndex(pos, 0);
                };
                ScriptInfo.prototype.lineAndColumnToIndex = function (lineAndColumn) {
                    return this.doc.positionToIndex({ row: lineAndColumn.line - 1, column: lineAndColumn.column }, 0);
                };
                return ScriptInfo;
            }();
            exports_1("ScriptInfo", ScriptInfo);
        }
    };
});
System.register("src/mode/typescript/DefaultLanguageServiceHost.js", ["./ScriptInfo", "./LanguageServiceHelpers", "./fileExtensionIs"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function extensionFromFileName(fileName) {
        if (fileName.endsWith('.d.ts')) {
            return ts.Extension.Dts;
        } else if (fileName.endsWith('.js')) {
            return ts.Extension.Js;
        } else if (fileName.endsWith('.jsx')) {
            return ts.Extension.Jsx;
        } else if (fileName.endsWith('.ts')) {
            return ts.Extension.Ts;
        } else if (fileName.endsWith('.tsx')) {
            return ts.Extension.Tsx;
        } else {
            return undefined;
        }
    }
    var ScriptInfo_1, LanguageServiceHelpers_1, LanguageServiceHelpers_2, LanguageServiceHelpers_3, LanguageServiceHelpers_4, fileExtensionIs_1, DefaultLanguageServiceHost;
    return {
        setters: [function (ScriptInfo_1_1) {
            ScriptInfo_1 = ScriptInfo_1_1;
        }, function (LanguageServiceHelpers_1_1) {
            LanguageServiceHelpers_1 = LanguageServiceHelpers_1_1;
            LanguageServiceHelpers_2 = LanguageServiceHelpers_1_1;
            LanguageServiceHelpers_3 = LanguageServiceHelpers_1_1;
            LanguageServiceHelpers_4 = LanguageServiceHelpers_1_1;
        }, function (fileExtensionIs_1_1) {
            fileExtensionIs_1 = fileExtensionIs_1_1;
        }],
        execute: function () {
            DefaultLanguageServiceHost = function () {
                function DefaultLanguageServiceHost() {
                    this.compilerOptions = {};
                    this.scripts = {};
                    this.moduleNameToFileName = {};
                    this.compilerOptions.allowJs = true;
                    this.compilerOptions.declaration = true;
                    this.compilerOptions.emitDecoratorMetadata = true;
                    this.compilerOptions.experimentalDecorators = true;
                    this.compilerOptions.jsx = ts.JsxEmit.React;
                    this.compilerOptions.module = ts.ModuleKind.System;
                    this.compilerOptions.noImplicitAny = true;
                    this.compilerOptions.noImplicitReturns = true;
                    this.compilerOptions.noImplicitThis = true;
                    this.compilerOptions.noUnusedLocals = true;
                    this.compilerOptions.noUnusedParameters = true;
                    this.compilerOptions.operatorOverloading = true;
                    this.compilerOptions.preserveConstEnums = true;
                    this.compilerOptions.removeComments = false;
                    this.compilerOptions.sourceMap = true;
                    this.compilerOptions.strictNullChecks = true;
                    this.compilerOptions.suppressImplicitAnyIndexErrors = true;
                    this.compilerOptions.target = ts.ScriptTarget.ES5;
                    this.compilerOptions.traceResolution = true;
                }
                Object.defineProperty(DefaultLanguageServiceHost.prototype, "moduleKind", {
                    get: function () {
                        return LanguageServiceHelpers_1.tsConfigModuleKindFromCompilerOptions(this.compilerOptions.module, 'system');
                    },
                    set: function (moduleKind) {
                        moduleKind = moduleKind.toLowerCase();
                        this.compilerOptions.module = LanguageServiceHelpers_2.compilerModuleKindFromTsConfig(moduleKind);
                    },
                    enumerable: true,
                    configurable: true
                });
                DefaultLanguageServiceHost.prototype.isOperatorOverloadingEnabled = function () {
                    return !!this.compilerOptions.operatorOverloading;
                };
                DefaultLanguageServiceHost.prototype.setOperatorOverloading = function (operatorOverloading) {
                    var oldValue = this.isOperatorOverloadingEnabled();
                    this.compilerOptions.operatorOverloading = operatorOverloading;
                    return oldValue;
                };
                Object.defineProperty(DefaultLanguageServiceHost.prototype, "scriptTarget", {
                    get: function () {
                        return LanguageServiceHelpers_3.tsConfigScriptTargetFromCompilerOptions(this.compilerOptions.target, 'es5');
                    },
                    set: function (scriptTarget) {
                        scriptTarget = scriptTarget.toLowerCase();
                        this.compilerOptions.target = LanguageServiceHelpers_4.compilerScriptTargetFromTsConfig(scriptTarget);
                    },
                    enumerable: true,
                    configurable: true
                });
                DefaultLanguageServiceHost.prototype.getScriptFileNames = function () {
                    return Object.keys(this.scripts);
                };
                DefaultLanguageServiceHost.prototype.addScript = function (fileName, content, version) {
                    if (version === void 0) {
                        version = 1;
                    }
                    var script = new ScriptInfo_1.ScriptInfo(content, version);
                    this.scripts[fileName] = script;
                    return script;
                };
                DefaultLanguageServiceHost.prototype.ensureModuleMapping = function (moduleName, fileName) {
                    var previousFileName = this.moduleNameToFileName[moduleName];
                    this.moduleNameToFileName[moduleName] = fileName;
                    return previousFileName;
                };
                DefaultLanguageServiceHost.prototype.applyDelta = function (fileName, delta) {
                    var script = this.scripts[fileName];
                    if (script) {
                        return script.applyDelta(delta);
                    } else {
                        throw new Error("No script with fileName '" + fileName + "'");
                    }
                };
                DefaultLanguageServiceHost.prototype.removeModuleMapping = function (moduleName) {
                    var fileName = this.moduleNameToFileName[moduleName];
                    delete this.moduleNameToFileName[moduleName];
                    return fileName;
                };
                DefaultLanguageServiceHost.prototype.getScriptContent = function (fileName) {
                    var script = this.scripts[fileName];
                    if (script) {
                        return script.getValue();
                    } else {
                        return void 0;
                    }
                };
                DefaultLanguageServiceHost.prototype.removeScript = function (fileName) {
                    var script = this.scripts[fileName];
                    if (script) {
                        delete this.scripts[fileName];
                        return true;
                    } else {
                        return false;
                    }
                };
                DefaultLanguageServiceHost.prototype.setScriptContent = function (fileName, content) {
                    var script = this.scripts[fileName];
                    if (script) {
                        script.updateContent(content);
                        return false;
                    } else {
                        this.addScript(fileName, content);
                        return true;
                    }
                };
                DefaultLanguageServiceHost.prototype.setCompilationSettings = function (compilerOptions) {
                    this.compilerOptions = compilerOptions;
                };
                DefaultLanguageServiceHost.prototype.getCompilationSettings = function () {
                    return this.compilerOptions;
                };
                DefaultLanguageServiceHost.prototype.getCustomTransformers = function () {
                    var before = [];
                    var after = [];
                    var that = { before: before, after: after };
                    return that;
                };
                DefaultLanguageServiceHost.prototype.getNewLine = function () {
                    return "\n";
                };
                DefaultLanguageServiceHost.prototype.getScriptVersion = function (fileName) {
                    var script = this.scripts[fileName];
                    if (script) {
                        return "" + script.version;
                    } else {
                        return void 0;
                    }
                };
                DefaultLanguageServiceHost.prototype.getScriptVersionNumber = function (fileName) {
                    var script = this.scripts[fileName];
                    if (script) {
                        return script.version;
                    } else {
                        return void 0;
                    }
                };
                DefaultLanguageServiceHost.prototype.getLineAndColumn = function (fileName, position) {
                    var script = this.scripts[fileName];
                    if (script) {
                        return script.getLineAndColumn(position);
                    } else {
                        return void 0;
                    }
                };
                DefaultLanguageServiceHost.prototype.lineAndColumnToIndex = function (fileName, lineAndColumn) {
                    var script = this.scripts[fileName];
                    if (script) {
                        return script.lineAndColumnToIndex(lineAndColumn);
                    } else {
                        return void 0;
                    }
                };
                DefaultLanguageServiceHost.prototype.getScriptSnapshot = function (fileName) {
                    var script = this.scripts[fileName];
                    if (script) {
                        var result = ts.ScriptSnapshot.fromString(script.getValue());
                        return result;
                    } else {
                        return void 0;
                    }
                };
                DefaultLanguageServiceHost.prototype.getCurrentDirectory = function () {
                    return "";
                };
                DefaultLanguageServiceHost.prototype.getDefaultLibFileName = function (options) {
                    return "defaultLib.d.ts";
                };
                DefaultLanguageServiceHost.prototype.resolveModuleNames = function (moduleNames, containingFile) {
                    var _this = this;
                    var fileNames = Object.keys(this.scripts);
                    var ns = moduleNames.map(function (moduleName) {
                        var isRelativeToBaseURI = moduleName.startsWith('./');
                        var fileName = fileNames.find(function (candidateFileName) {
                            if (isRelativeToBaseURI) {
                                var simpleName = moduleName.substring(2);
                                if (fileExtensionIs_1.fileExtensionIs(simpleName, '.js')) {
                                    var basicName = fileExtensionIs_1.removeExtension(simpleName, '.js');
                                    if (candidateFileName.indexOf(basicName + ".ts") >= 0) {
                                        return true;
                                    }
                                } else if (fileExtensionIs_1.fileExtensionIs(simpleName, '.jsx')) {
                                    var basicName = fileExtensionIs_1.removeExtension(simpleName, '.jsx');
                                    if (candidateFileName.indexOf(basicName + ".tsx") >= 0) {
                                        return true;
                                    }
                                } else {
                                    if (candidateFileName.indexOf(simpleName + ".ts") >= 0) {
                                        return true;
                                    }
                                    if (candidateFileName.indexOf(simpleName + ".tsx") >= 0) {
                                        return true;
                                    }
                                }
                            } else {
                                if (candidateFileName === moduleName) {
                                    return true;
                                }
                                if (candidateFileName.indexOf(moduleName + "/index.d.ts") >= 0) {
                                    return true;
                                }
                                if (_this.moduleNameToFileName[moduleName] === candidateFileName) {
                                    return true;
                                }
                            }
                            return false;
                        });
                        if (fileName) {
                            var m = {
                                resolvedFileName: fileName,
                                isExternalLibraryImport: false,
                                extension: extensionFromFileName(fileName)
                            };
                            return m;
                        } else {
                            return undefined;
                        }
                    });
                    return ns;
                };
                return DefaultLanguageServiceHost;
            }();
            exports_1("DefaultLanguageServiceHost", DefaultLanguageServiceHost);
        }
    };
});
System.register("src/mode/typescript/DocumentRegistryInspector.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var DocumentRegistryInspector;
    return {
        setters: [],
        execute: function () {
            DocumentRegistryInspector = function () {
                function DocumentRegistryInspector(documentRegistry) {
                    this.documentRegistry = documentRegistry;
                    this.trace = false;
                }
                DocumentRegistryInspector.prototype.acquireDocument = function (fileName, compilationSettings, scriptSnapshot, version) {
                    if (this.trace) {
                        console.log("acquireDocument(" + fileName + ", " + JSON.stringify(compilationSettings, null, 2) + ")");
                    }
                    return this.documentRegistry.acquireDocument(fileName, compilationSettings, scriptSnapshot, version);
                };
                DocumentRegistryInspector.prototype.acquireDocumentWithKey = function (fileName, path, compilationSettings, key, scriptSnapshot, version, scriptKind) {
                    if (this.trace) {
                        console.log("acquireDocumentWithKey(" + fileName + ", " + JSON.stringify(compilationSettings, null, 2) + ")");
                    }
                    return this.documentRegistry.acquireDocumentWithKey(fileName, path, compilationSettings, key, scriptSnapshot, version);
                };
                DocumentRegistryInspector.prototype.getKeyForCompilationSettings = function (settings) {
                    return this.documentRegistry.getKeyForCompilationSettings(settings);
                };
                DocumentRegistryInspector.prototype.releaseDocument = function (fileName, compilationSettings) {
                    if (this.trace) {
                        console.log("releaseDocument(" + fileName + ", " + JSON.stringify(compilationSettings, null, 2) + ")");
                    }
                    return this.documentRegistry.releaseDocument(fileName, compilationSettings);
                };
                DocumentRegistryInspector.prototype.releaseDocumentWithKey = function (path, key) {
                    return this.documentRegistry.releaseDocumentWithKey(path, key);
                };
                DocumentRegistryInspector.prototype.reportStats = function () {
                    if (this.trace) {
                        console.log("reportStats()");
                    }
                    return this.documentRegistry.reportStats();
                };
                DocumentRegistryInspector.prototype.updateDocument = function (fileName, compilationSettings, scriptSnapshot, version) {
                    if (this.trace) {
                        console.log("updateDocument(" + fileName + ", " + JSON.stringify(compilationSettings, null, 2) + ")");
                    }
                    return this.documentRegistry.updateDocument(fileName, compilationSettings, scriptSnapshot, version);
                };
                DocumentRegistryInspector.prototype.updateDocumentWithKey = function (fileName, path, compilationSettings, key, scriptSnapshot, version, scriptKind) {
                    if (this.trace) {
                        console.log("updateDocumentWithKey(" + fileName + ", " + JSON.stringify(compilationSettings, null, 2) + ")");
                    }
                    return this.documentRegistry.updateDocumentWithKey(fileName, path, compilationSettings, key, scriptSnapshot, version);
                };
                return DocumentRegistryInspector;
            }();
            exports_1("DocumentRegistryInspector", DocumentRegistryInspector);
        }
    };
});
System.register("src/mode/python/PythonLanguageService.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var PythonLanguageService;
    return {
        setters: [],
        execute: function () {
            PythonLanguageService = function () {
                function PythonLanguageService(host) {
                    this.sourceMaps = {};
                }
                PythonLanguageService.prototype.getSourceMap = function (fileName) {
                    return this.sourceMaps[fileName];
                };
                PythonLanguageService.prototype.setSourceMap = function (fileName, sourceMap) {
                    this.sourceMaps[fileName] = sourceMap;
                };
                return PythonLanguageService;
            }();
            exports_1("PythonLanguageService", PythonLanguageService);
        }
    };
});
System.register("src/mode/typescript/fileExtensionIs.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function endsWith(path, suffix) {
        var expectedPos = path.length - suffix.length;
        return expectedPos >= 0 && path.indexOf(suffix, expectedPos) === expectedPos;
    }
    function fileExtensionIs(path, extension) {
        return path.length > extension.length && endsWith(path, extension);
    }
    exports_1("fileExtensionIs", fileExtensionIs);
    function removeExtension(path, extension) {
        var endPos = path.length - extension.length;
        return path.substring(0, endPos);
    }
    exports_1("removeExtension", removeExtension);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("src/mode/typescript/transpileModule.js", ["./fileExtensionIs"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function transpileModule(program, sourceFile, customTransformers) {
        var outputText;
        var sourceMapText;
        function writeFile(fileName, text, writeByteOrderMark, onError, sourceFiles) {
            if (fileExtensionIs_1.fileExtensionIs(fileName, ".map")) {
                sourceMapText = text;
            } else if (fileExtensionIs_1.fileExtensionIs(fileName, ".d.ts")) {} else if (fileExtensionIs_1.fileExtensionIs(fileName, ".js")) {
                outputText = text;
            } else {
                console.warn("fileName => " + fileName);
            }
        }
        program.emit(sourceFile, writeFile, void 0, false, customTransformers);
        return { outputText: outputText, sourceMapText: sourceMapText };
    }
    exports_1("transpileModule", transpileModule);
    var fileExtensionIs_1;
    return {
        setters: [function (fileExtensionIs_1_1) {
            fileExtensionIs_1 = fileExtensionIs_1_1;
        }],
        execute: function () {}
    };
});
System.registerDynamic('npm:typhon-lang@0.12.9/build/browser/index.js', [], true, function ($__require, exports, module) {
    /* */
    "format cjs";

    var global = this || self,
        GLOBAL = global;
    (function (global, factory) {
        typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof undefined === 'function' && define.amd ? define(['exports'], factory) : factory(global.typhonLang = global.typhonLang || {});
    })(exports, function (exports) {
        'use strict';

        /**
         * Symbolic constants for various Python Language tokens.
         */

        var Tokens;
        (function (Tokens) {
            Tokens[Tokens["T_ENDMARKER"] = 0] = "T_ENDMARKER";
            Tokens[Tokens["T_NAME"] = 1] = "T_NAME";
            Tokens[Tokens["T_NUMBER"] = 2] = "T_NUMBER";
            Tokens[Tokens["T_STRING"] = 3] = "T_STRING";
            Tokens[Tokens["T_NEWLINE"] = 4] = "T_NEWLINE";
            Tokens[Tokens["T_INDENT"] = 5] = "T_INDENT";
            Tokens[Tokens["T_DEDENT"] = 6] = "T_DEDENT";
            Tokens[Tokens["T_LPAR"] = 7] = "T_LPAR";
            Tokens[Tokens["T_RPAR"] = 8] = "T_RPAR";
            Tokens[Tokens["T_LSQB"] = 9] = "T_LSQB";
            Tokens[Tokens["T_RSQB"] = 10] = "T_RSQB";
            Tokens[Tokens["T_COLON"] = 11] = "T_COLON";
            Tokens[Tokens["T_COMMA"] = 12] = "T_COMMA";
            Tokens[Tokens["T_SEMI"] = 13] = "T_SEMI";
            Tokens[Tokens["T_PLUS"] = 14] = "T_PLUS";
            Tokens[Tokens["T_MINUS"] = 15] = "T_MINUS";
            Tokens[Tokens["T_STAR"] = 16] = "T_STAR";
            Tokens[Tokens["T_SLASH"] = 17] = "T_SLASH";
            Tokens[Tokens["T_VBAR"] = 18] = "T_VBAR";
            Tokens[Tokens["T_AMPER"] = 19] = "T_AMPER";
            Tokens[Tokens["T_LESS"] = 20] = "T_LESS";
            Tokens[Tokens["T_GREATER"] = 21] = "T_GREATER";
            Tokens[Tokens["T_EQUAL"] = 22] = "T_EQUAL";
            Tokens[Tokens["T_DOT"] = 23] = "T_DOT";
            Tokens[Tokens["T_PERCENT"] = 24] = "T_PERCENT";
            Tokens[Tokens["T_BACKQUOTE"] = 25] = "T_BACKQUOTE";
            Tokens[Tokens["T_LBRACE"] = 26] = "T_LBRACE";
            Tokens[Tokens["T_RBRACE"] = 27] = "T_RBRACE";
            Tokens[Tokens["T_EQEQUAL"] = 28] = "T_EQEQUAL";
            Tokens[Tokens["T_NOTEQUAL"] = 29] = "T_NOTEQUAL";
            Tokens[Tokens["T_LESSEQUAL"] = 30] = "T_LESSEQUAL";
            Tokens[Tokens["T_GREATEREQUAL"] = 31] = "T_GREATEREQUAL";
            Tokens[Tokens["T_TILDE"] = 32] = "T_TILDE";
            Tokens[Tokens["T_CIRCUMFLEX"] = 33] = "T_CIRCUMFLEX";
            Tokens[Tokens["T_LEFTSHIFT"] = 34] = "T_LEFTSHIFT";
            Tokens[Tokens["T_RIGHTSHIFT"] = 35] = "T_RIGHTSHIFT";
            Tokens[Tokens["T_DOUBLESTAR"] = 36] = "T_DOUBLESTAR";
            Tokens[Tokens["T_PLUSEQUAL"] = 37] = "T_PLUSEQUAL";
            Tokens[Tokens["T_MINEQUAL"] = 38] = "T_MINEQUAL";
            Tokens[Tokens["T_STAREQUAL"] = 39] = "T_STAREQUAL";
            Tokens[Tokens["T_SLASHEQUAL"] = 40] = "T_SLASHEQUAL";
            Tokens[Tokens["T_PERCENTEQUAL"] = 41] = "T_PERCENTEQUAL";
            Tokens[Tokens["T_AMPEREQUAL"] = 42] = "T_AMPEREQUAL";
            Tokens[Tokens["T_VBAREQUAL"] = 43] = "T_VBAREQUAL";
            Tokens[Tokens["T_CIRCUMFLEXEQUAL"] = 44] = "T_CIRCUMFLEXEQUAL";
            Tokens[Tokens["T_LEFTSHIFTEQUAL"] = 45] = "T_LEFTSHIFTEQUAL";
            Tokens[Tokens["T_RIGHTSHIFTEQUAL"] = 46] = "T_RIGHTSHIFTEQUAL";
            Tokens[Tokens["T_DOUBLESTAREQUAL"] = 47] = "T_DOUBLESTAREQUAL";
            Tokens[Tokens["T_DOUBLESLASH"] = 48] = "T_DOUBLESLASH";
            Tokens[Tokens["T_DOUBLESLASHEQUAL"] = 49] = "T_DOUBLESLASHEQUAL";
            Tokens[Tokens["T_AT"] = 50] = "T_AT";
            Tokens[Tokens["T_ATEQUAL"] = 51] = "T_ATEQUAL";
            Tokens[Tokens["T_OP"] = 52] = "T_OP";
            Tokens[Tokens["T_COMMENT"] = 53] = "T_COMMENT";
            Tokens[Tokens["T_NL"] = 54] = "T_NL";
            Tokens[Tokens["T_RARROW"] = 55] = "T_RARROW";
            Tokens[Tokens["T_AWAIT"] = 56] = "T_AWAIT";
            Tokens[Tokens["T_ASYNC"] = 57] = "T_ASYNC";
            Tokens[Tokens["T_ERRORTOKEN"] = 58] = "T_ERRORTOKEN";
            Tokens[Tokens["T_N_TOKENS"] = 59] = "T_N_TOKENS";
            Tokens[Tokens["T_NT_OFFSET"] = 256] = "T_NT_OFFSET";
        })(Tokens || (Tokens = {}));

        // DO NOT MODIFY. File automatically generated by pgen/parser/main.py
        /**
         * Mapping from operator textual symbols to token symbolic constants.
         */
        var OpMap = {
            "(": Tokens.T_LPAR,
            ")": Tokens.T_RPAR,
            "[": Tokens.T_LSQB,
            "]": Tokens.T_RSQB,
            ":": Tokens.T_COLON,
            ",": Tokens.T_COMMA,
            ";": Tokens.T_SEMI,
            "+": Tokens.T_PLUS,
            "-": Tokens.T_MINUS,
            "*": Tokens.T_STAR,
            "/": Tokens.T_SLASH,
            "|": Tokens.T_VBAR,
            "&": Tokens.T_AMPER,
            "<": Tokens.T_LESS,
            ">": Tokens.T_GREATER,
            "=": Tokens.T_EQUAL,
            ".": Tokens.T_DOT,
            "%": Tokens.T_PERCENT,
            "`": Tokens.T_BACKQUOTE,
            "{": Tokens.T_LBRACE,
            "}": Tokens.T_RBRACE,
            "@": Tokens.T_AT,
            "==": Tokens.T_EQEQUAL,
            "!=": Tokens.T_NOTEQUAL,
            "<>": Tokens.T_NOTEQUAL,
            "<=": Tokens.T_LESSEQUAL,
            ">=": Tokens.T_GREATEREQUAL,
            "~": Tokens.T_TILDE,
            "^": Tokens.T_CIRCUMFLEX,
            "<<": Tokens.T_LEFTSHIFT,
            ">>": Tokens.T_RIGHTSHIFT,
            "**": Tokens.T_DOUBLESTAR,
            "+=": Tokens.T_PLUSEQUAL,
            "-=": Tokens.T_MINEQUAL,
            "*=": Tokens.T_STAREQUAL,
            "/=": Tokens.T_SLASHEQUAL,
            "%=": Tokens.T_PERCENTEQUAL,
            "&=": Tokens.T_AMPEREQUAL,
            "|=": Tokens.T_VBAREQUAL,
            "^=": Tokens.T_CIRCUMFLEXEQUAL,
            "<<=": Tokens.T_LEFTSHIFTEQUAL,
            ">>=": Tokens.T_RIGHTSHIFTEQUAL,
            "**=": Tokens.T_DOUBLESTAREQUAL,
            "//": Tokens.T_DOUBLESLASH,
            "//=": Tokens.T_DOUBLESLASHEQUAL,
            "->": Tokens.T_RARROW
        };
        /**
         * An Arc is a pair, represented in an array, consisting a label and a to-state.
         */
        var ARC_SYMBOL_LABEL = 0;
        var ARC_TO_STATE = 1;
        /**
         *
         */
        var IDX_DFABT_DFA = 0;
        var IDX_DFABT_BEGIN_TOKENS = 1;

        /**
         *
         */
        var ParseTables = {
            sym: { AndExpr: 257,
                ArithmeticExpr: 258,
                AtomExpr: 259,
                BitwiseAndExpr: 260,
                BitwiseOrExpr: 261,
                BitwiseXorExpr: 262,
                ComparisonExpr: 263,
                ExprList: 264,
                ExprStmt: 265,
                GeometricExpr: 266,
                GlobalStmt: 267,
                IfExpr: 268,
                ImportList: 269,
                ImportSpecifier: 270,
                LambdaExpr: 271,
                ModuleSpecifier: 272,
                NonLocalStmt: 273,
                NotExpr: 274,
                OrExpr: 275,
                PowerExpr: 276,
                ShiftExpr: 277,
                UnaryExpr: 278,
                YieldExpr: 279,
                annasign: 280,
                arglist: 281,
                argument: 282,
                assert_stmt: 283,
                augassign: 284,
                break_stmt: 285,
                classdef: 286,
                comp_op: 287,
                compound_stmt: 288,
                continue_stmt: 289,
                decorated: 290,
                decorator: 291,
                decorators: 292,
                del_stmt: 293,
                dictmaker: 294,
                dotted_as_name: 295,
                dotted_as_names: 296,
                dotted_name: 297,
                encoding_decl: 298,
                eval_input: 299,
                except_clause: 300,
                exec_stmt: 301,
                file_input: 302,
                flow_stmt: 303,
                for_stmt: 304,
                fpdef: 305,
                fplist: 306,
                funcdef: 307,
                gen_for: 308,
                gen_if: 309,
                gen_iter: 310,
                if_stmt: 311,
                import_from: 312,
                import_name: 313,
                import_stmt: 314,
                list_for: 315,
                list_if: 316,
                list_iter: 317,
                listmaker: 318,
                old_LambdaExpr: 319,
                old_test: 320,
                parameters: 321,
                pass_stmt: 322,
                print_stmt: 323,
                raise_stmt: 324,
                return_stmt: 325,
                simple_stmt: 326,
                single_input: 256,
                sliceop: 327,
                small_stmt: 328,
                stmt: 329,
                subscript: 330,
                subscriptlist: 331,
                suite: 332,
                testlist: 333,
                testlist1: 334,
                testlist_gexp: 335,
                testlist_safe: 336,
                trailer: 337,
                try_stmt: 338,
                varargslist: 339,
                while_stmt: 340,
                with_stmt: 341,
                with_var: 342,
                yield_stmt: 343 },
            number2symbol: { 256: 'single_input',
                257: 'AndExpr',
                258: 'ArithmeticExpr',
                259: 'AtomExpr',
                260: 'BitwiseAndExpr',
                261: 'BitwiseOrExpr',
                262: 'BitwiseXorExpr',
                263: 'ComparisonExpr',
                264: 'ExprList',
                265: 'ExprStmt',
                266: 'GeometricExpr',
                267: 'GlobalStmt',
                268: 'IfExpr',
                269: 'ImportList',
                270: 'ImportSpecifier',
                271: 'LambdaExpr',
                272: 'ModuleSpecifier',
                273: 'NonLocalStmt',
                274: 'NotExpr',
                275: 'OrExpr',
                276: 'PowerExpr',
                277: 'ShiftExpr',
                278: 'UnaryExpr',
                279: 'YieldExpr',
                280: 'annasign',
                281: 'arglist',
                282: 'argument',
                283: 'assert_stmt',
                284: 'augassign',
                285: 'break_stmt',
                286: 'classdef',
                287: 'comp_op',
                288: 'compound_stmt',
                289: 'continue_stmt',
                290: 'decorated',
                291: 'decorator',
                292: 'decorators',
                293: 'del_stmt',
                294: 'dictmaker',
                295: 'dotted_as_name',
                296: 'dotted_as_names',
                297: 'dotted_name',
                298: 'encoding_decl',
                299: 'eval_input',
                300: 'except_clause',
                301: 'exec_stmt',
                302: 'file_input',
                303: 'flow_stmt',
                304: 'for_stmt',
                305: 'fpdef',
                306: 'fplist',
                307: 'funcdef',
                308: 'gen_for',
                309: 'gen_if',
                310: 'gen_iter',
                311: 'if_stmt',
                312: 'import_from',
                313: 'import_name',
                314: 'import_stmt',
                315: 'list_for',
                316: 'list_if',
                317: 'list_iter',
                318: 'listmaker',
                319: 'old_LambdaExpr',
                320: 'old_test',
                321: 'parameters',
                322: 'pass_stmt',
                323: 'print_stmt',
                324: 'raise_stmt',
                325: 'return_stmt',
                326: 'simple_stmt',
                327: 'sliceop',
                328: 'small_stmt',
                329: 'stmt',
                330: 'subscript',
                331: 'subscriptlist',
                332: 'suite',
                333: 'testlist',
                334: 'testlist1',
                335: 'testlist_gexp',
                336: 'testlist_safe',
                337: 'trailer',
                338: 'try_stmt',
                339: 'varargslist',
                340: 'while_stmt',
                341: 'with_stmt',
                342: 'with_var',
                343: 'yield_stmt' },
            dfas: { 256: [[[[1, 1], [2, 1], [3, 2]], [[0, 1]], [[2, 1]]], { 2: 1,
                    4: 1,
                    5: 1,
                    6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    10: 1,
                    11: 1,
                    12: 1,
                    13: 1,
                    14: 1,
                    15: 1,
                    16: 1,
                    17: 1,
                    18: 1,
                    19: 1,
                    20: 1,
                    21: 1,
                    22: 1,
                    23: 1,
                    24: 1,
                    25: 1,
                    26: 1,
                    27: 1,
                    28: 1,
                    29: 1,
                    30: 1,
                    31: 1,
                    32: 1,
                    33: 1,
                    34: 1,
                    35: 1,
                    36: 1,
                    37: 1 }],
                257: [[[[38, 1]], [[39, 0], [0, 1]]], { 6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    14: 1,
                    18: 1,
                    21: 1,
                    25: 1,
                    29: 1,
                    32: 1,
                    37: 1 }],
                258: [[[[40, 1]], [[25, 0], [37, 0], [0, 1]]], { 6: 1, 8: 1, 9: 1, 14: 1, 18: 1, 21: 1, 25: 1, 29: 1, 32: 1, 37: 1 }],
                259: [[[[18, 1], [8, 2], [32, 5], [29, 4], [9, 3], [14, 6], [21, 2]], [[18, 1], [0, 1]], [[0, 2]], [[41, 7], [42, 2]], [[43, 2], [44, 8], [45, 8]], [[46, 9], [47, 2]], [[48, 10]], [[42, 2]], [[43, 2]], [[47, 2]], [[14, 2]]], { 8: 1, 9: 1, 14: 1, 18: 1, 21: 1, 29: 1, 32: 1 }],
                260: [[[[49, 1]], [[50, 0], [0, 1]]], { 6: 1, 8: 1, 9: 1, 14: 1, 18: 1, 21: 1, 25: 1, 29: 1, 32: 1, 37: 1 }],
                261: [[[[51, 1]], [[52, 0], [0, 1]]], { 6: 1, 8: 1, 9: 1, 14: 1, 18: 1, 21: 1, 25: 1, 29: 1, 32: 1, 37: 1 }],
                262: [[[[53, 1]], [[54, 0], [0, 1]]], { 6: 1, 8: 1, 9: 1, 14: 1, 18: 1, 21: 1, 25: 1, 29: 1, 32: 1, 37: 1 }],
                263: [[[[55, 1]], [[56, 0], [0, 1]]], { 6: 1, 8: 1, 9: 1, 14: 1, 18: 1, 21: 1, 25: 1, 29: 1, 32: 1, 37: 1 }],
                264: [[[[55, 1]], [[57, 2], [0, 1]], [[55, 1], [0, 2]]], { 6: 1, 8: 1, 9: 1, 14: 1, 18: 1, 21: 1, 25: 1, 29: 1, 32: 1, 37: 1 }],
                265: [[[[58, 1]], [[59, 2], [60, 3], [61, 4], [0, 1]], [[0, 2]], [[58, 2], [45, 2]], [[58, 5], [45, 5]], [[61, 4], [0, 5]]], { 6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    14: 1,
                    18: 1,
                    21: 1,
                    25: 1,
                    29: 1,
                    32: 1,
                    37: 1 }],
                266: [[[[62, 1]], [[63, 0], [64, 0], [65, 0], [66, 0], [0, 1]]], { 6: 1, 8: 1, 9: 1, 14: 1, 18: 1, 21: 1, 25: 1, 29: 1, 32: 1, 37: 1 }],
                267: [[[[27, 1]], [[21, 2]], [[57, 1], [0, 2]]], { 27: 1 }],
                268: [[[[67, 1], [68, 2]], [[0, 1]], [[31, 3], [0, 2]], [[68, 4]], [[69, 5]], [[70, 1]]], { 6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    14: 1,
                    18: 1,
                    21: 1,
                    25: 1,
                    29: 1,
                    32: 1,
                    37: 1 }],
                269: [[[[71, 1]], [[57, 2], [0, 1]], [[71, 1], [0, 2]]], { 21: 1 }],
                270: [[[[21, 1]], [[72, 2], [0, 1]], [[21, 3]], [[0, 3]]], { 21: 1 }],
                271: [[[[11, 1]], [[73, 2], [74, 3]], [[70, 4]], [[73, 2]], [[0, 4]]], { 11: 1 }],
                272: [[[[18, 1]], [[0, 1]]], { 18: 1 }],
                273: [[[[13, 1]], [[21, 2]], [[57, 1], [0, 2]]], { 13: 1 }],
                274: [[[[7, 1], [75, 2]], [[38, 2]], [[0, 2]]], { 6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    14: 1,
                    18: 1,
                    21: 1,
                    25: 1,
                    29: 1,
                    32: 1,
                    37: 1 }],
                275: [[[[76, 1]], [[77, 0], [0, 1]]], { 6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    14: 1,
                    18: 1,
                    21: 1,
                    25: 1,
                    29: 1,
                    32: 1,
                    37: 1 }],
                276: [[[[78, 1]], [[79, 1], [80, 2], [0, 1]], [[49, 3]], [[0, 3]]], { 8: 1, 9: 1, 14: 1, 18: 1, 21: 1, 29: 1, 32: 1 }],
                277: [[[[81, 1]], [[82, 0], [83, 0], [0, 1]]], { 6: 1, 8: 1, 9: 1, 14: 1, 18: 1, 21: 1, 25: 1, 29: 1, 32: 1, 37: 1 }],
                278: [[[[25, 1], [6, 1], [37, 1], [84, 2]], [[49, 2]], [[0, 2]]], { 6: 1, 8: 1, 9: 1, 14: 1, 18: 1, 21: 1, 25: 1, 29: 1, 32: 1, 37: 1 }],
                279: [[[[26, 1]], [[58, 2], [0, 1]], [[0, 2]]], { 26: 1 }],
                280: [[[[73, 1]], [[70, 2]], [[61, 3], [0, 2]], [[70, 4]], [[0, 4]]], { 73: 1 }],
                281: [[[[64, 1], [85, 2], [80, 3]], [[70, 4]], [[57, 5], [0, 2]], [[70, 6]], [[57, 7], [0, 4]], [[64, 1], [85, 2], [80, 3], [0, 5]], [[0, 6]], [[85, 4], [80, 3]]], { 6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    14: 1,
                    18: 1,
                    21: 1,
                    25: 1,
                    29: 1,
                    32: 1,
                    37: 1,
                    64: 1,
                    80: 1 }],
                282: [[[[70, 1]], [[86, 2], [61, 3], [0, 1]], [[0, 2]], [[70, 2]]], { 6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    14: 1,
                    18: 1,
                    21: 1,
                    25: 1,
                    29: 1,
                    32: 1,
                    37: 1 }],
                283: [[[[20, 1]], [[70, 2]], [[57, 3], [0, 2]], [[70, 4]], [[0, 4]]], { 20: 1 }],
                284: [[[[87, 1], [88, 1], [89, 1], [90, 1], [91, 1], [92, 1], [93, 1], [94, 1], [95, 1], [96, 1], [97, 1], [98, 1]], [[0, 1]]], { 87: 1,
                    88: 1,
                    89: 1,
                    90: 1,
                    91: 1,
                    92: 1,
                    93: 1,
                    94: 1,
                    95: 1,
                    96: 1,
                    97: 1,
                    98: 1 }],
                285: [[[[33, 1]], [[0, 1]]], { 33: 1 }],
                286: [[[[10, 1]], [[21, 2]], [[73, 3], [29, 4]], [[99, 5]], [[43, 6], [58, 7]], [[0, 5]], [[73, 3]], [[43, 6]]], { 10: 1 }],
                287: [[[[100, 1], [101, 1], [7, 2], [102, 1], [100, 1], [103, 1], [104, 1], [105, 3], [106, 1], [107, 1]], [[0, 1]], [[103, 1]], [[7, 1], [0, 3]]], { 7: 1, 100: 1, 101: 1, 102: 1, 103: 1, 104: 1, 105: 1, 106: 1, 107: 1 }],
                288: [[[[108, 1], [109, 1], [110, 1], [111, 1], [112, 1], [113, 1], [114, 1], [115, 1]], [[0, 1]]], { 4: 1, 10: 1, 15: 1, 17: 1, 28: 1, 31: 1, 35: 1, 36: 1 }],
                289: [[[[34, 1]], [[0, 1]]], { 34: 1 }],
                290: [[[[116, 1]], [[114, 2], [111, 2]], [[0, 2]]], { 35: 1 }],
                291: [[[[35, 1]], [[117, 2]], [[29, 4], [2, 3]], [[0, 3]], [[43, 5], [118, 6]], [[2, 3]], [[43, 5]]], { 35: 1 }],
                292: [[[[119, 1]], [[119, 1], [0, 1]]], { 35: 1 }],
                293: [[[[22, 1]], [[120, 2]], [[0, 2]]], { 22: 1 }],
                294: [[[[70, 1]], [[73, 2]], [[70, 3]], [[57, 4], [0, 3]], [[70, 1], [0, 4]]], { 6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    14: 1,
                    18: 1,
                    21: 1,
                    25: 1,
                    29: 1,
                    32: 1,
                    37: 1 }],
                295: [[[[117, 1]], [[72, 2], [0, 1]], [[21, 3]], [[0, 3]]], { 21: 1 }],
                296: [[[[121, 1]], [[57, 0], [0, 1]]], { 21: 1 }],
                297: [[[[21, 1]], [[122, 0], [0, 1]]], { 21: 1 }],
                298: [[[[21, 1]], [[0, 1]]], { 21: 1 }],
                299: [[[[58, 1]], [[2, 1], [123, 2]], [[0, 2]]], { 6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    14: 1,
                    18: 1,
                    21: 1,
                    25: 1,
                    29: 1,
                    32: 1,
                    37: 1 }],
                300: [[[[124, 1]], [[70, 2], [0, 1]], [[72, 3], [57, 3], [0, 2]], [[70, 4]], [[0, 4]]], { 124: 1 }],
                301: [[[[16, 1]], [[55, 2]], [[103, 3], [0, 2]], [[70, 4]], [[57, 5], [0, 4]], [[70, 6]], [[0, 6]]], { 16: 1 }],
                302: [[[[2, 0], [123, 1], [125, 0]], [[0, 1]]], { 2: 1,
                    4: 1,
                    5: 1,
                    6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    10: 1,
                    11: 1,
                    12: 1,
                    13: 1,
                    14: 1,
                    15: 1,
                    16: 1,
                    17: 1,
                    18: 1,
                    19: 1,
                    20: 1,
                    21: 1,
                    22: 1,
                    23: 1,
                    24: 1,
                    25: 1,
                    26: 1,
                    27: 1,
                    28: 1,
                    29: 1,
                    30: 1,
                    31: 1,
                    32: 1,
                    33: 1,
                    34: 1,
                    35: 1,
                    36: 1,
                    37: 1,
                    123: 1 }],
                303: [[[[126, 1], [127, 1], [128, 1], [129, 1], [130, 1]], [[0, 1]]], { 5: 1, 19: 1, 26: 1, 33: 1, 34: 1 }],
                304: [[[[28, 1]], [[120, 2]], [[103, 3]], [[58, 4]], [[73, 5]], [[99, 6]], [[69, 7], [0, 6]], [[73, 8]], [[99, 9]], [[0, 9]]], { 28: 1 }],
                305: [[[[29, 1], [21, 2]], [[131, 3]], [[73, 4], [0, 2]], [[43, 5]], [[70, 5]], [[0, 5]]], { 21: 1, 29: 1 }],
                306: [[[[132, 1]], [[57, 2], [0, 1]], [[132, 1], [0, 2]]], { 21: 1, 29: 1 }],
                307: [[[[4, 1]], [[21, 2]], [[133, 3]], [[134, 4], [73, 5]], [[70, 6]], [[99, 7]], [[73, 5]], [[0, 7]]], { 4: 1 }],
                308: [[[[28, 1]], [[120, 2]], [[103, 3]], [[68, 4]], [[135, 5], [0, 4]], [[0, 5]]], { 28: 1 }],
                309: [[[[31, 1]], [[136, 2]], [[135, 3], [0, 2]], [[0, 3]]], { 31: 1 }],
                310: [[[[86, 1], [137, 1]], [[0, 1]]], { 28: 1, 31: 1 }],
                311: [[[[31, 1]], [[70, 2]], [[73, 3]], [[99, 4]], [[69, 5], [138, 1], [0, 4]], [[73, 6]], [[99, 7]], [[0, 7]]], { 31: 1 }],
                312: [[[[30, 1]], [[139, 2]], [[24, 3]], [[140, 4], [29, 5], [64, 4]], [[0, 4]], [[140, 6]], [[43, 4]]], { 30: 1 }],
                313: [[[[24, 1]], [[141, 2]], [[0, 2]]], { 24: 1 }],
                314: [[[[142, 1], [143, 1]], [[0, 1]]], { 24: 1, 30: 1 }],
                315: [[[[28, 1]], [[120, 2]], [[103, 3]], [[144, 4]], [[145, 5], [0, 4]], [[0, 5]]], { 28: 1 }],
                316: [[[[31, 1]], [[136, 2]], [[145, 3], [0, 2]], [[0, 3]]], { 31: 1 }],
                317: [[[[146, 1], [147, 1]], [[0, 1]]], { 28: 1, 31: 1 }],
                318: [[[[70, 1]], [[146, 2], [57, 3], [0, 1]], [[0, 2]], [[70, 4], [0, 3]], [[57, 3], [0, 4]]], { 6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    14: 1,
                    18: 1,
                    21: 1,
                    25: 1,
                    29: 1,
                    32: 1,
                    37: 1 }],
                319: [[[[11, 1]], [[73, 2], [74, 3]], [[136, 4]], [[73, 2]], [[0, 4]]], { 11: 1 }],
                320: [[[[148, 1], [68, 1]], [[0, 1]]], { 6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    14: 1,
                    18: 1,
                    21: 1,
                    25: 1,
                    29: 1,
                    32: 1,
                    37: 1 }],
                321: [[[[29, 1]], [[43, 2], [74, 3]], [[0, 2]], [[43, 2]]], { 29: 1 }],
                322: [[[[23, 1]], [[0, 1]]], { 23: 1 }],
                323: [[[[12, 1]], [[70, 2], [82, 3], [0, 1]], [[57, 4], [0, 2]], [[70, 5]], [[70, 2], [0, 4]], [[57, 6], [0, 5]], [[70, 7]], [[57, 8], [0, 7]], [[70, 7], [0, 8]]], { 12: 1 }],
                324: [[[[5, 1]], [[70, 2], [0, 1]], [[57, 3], [0, 2]], [[70, 4]], [[57, 5], [0, 4]], [[70, 6]], [[0, 6]]], { 5: 1 }],
                325: [[[[19, 1]], [[58, 2], [0, 1]], [[0, 2]]], { 19: 1 }],
                326: [[[[149, 1]], [[2, 2], [150, 3]], [[0, 2]], [[149, 1], [2, 2]]], { 5: 1,
                    6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    12: 1,
                    13: 1,
                    14: 1,
                    16: 1,
                    18: 1,
                    19: 1,
                    20: 1,
                    21: 1,
                    22: 1,
                    23: 1,
                    24: 1,
                    25: 1,
                    26: 1,
                    27: 1,
                    29: 1,
                    30: 1,
                    32: 1,
                    33: 1,
                    34: 1,
                    37: 1 }],
                327: [[[[73, 1]], [[70, 2], [0, 1]], [[0, 2]]], { 73: 1 }],
                328: [[[[151, 1], [152, 1], [153, 1], [154, 1], [155, 1], [156, 1], [157, 1], [158, 1], [159, 1], [160, 1]], [[0, 1]]], { 5: 1,
                    6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    12: 1,
                    13: 1,
                    14: 1,
                    16: 1,
                    18: 1,
                    19: 1,
                    20: 1,
                    21: 1,
                    22: 1,
                    23: 1,
                    24: 1,
                    25: 1,
                    26: 1,
                    27: 1,
                    29: 1,
                    30: 1,
                    32: 1,
                    33: 1,
                    34: 1,
                    37: 1 }],
                329: [[[[1, 1], [3, 1]], [[0, 1]]], { 4: 1,
                    5: 1,
                    6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    10: 1,
                    11: 1,
                    12: 1,
                    13: 1,
                    14: 1,
                    15: 1,
                    16: 1,
                    17: 1,
                    18: 1,
                    19: 1,
                    20: 1,
                    21: 1,
                    22: 1,
                    23: 1,
                    24: 1,
                    25: 1,
                    26: 1,
                    27: 1,
                    28: 1,
                    29: 1,
                    30: 1,
                    31: 1,
                    32: 1,
                    33: 1,
                    34: 1,
                    35: 1,
                    36: 1,
                    37: 1 }],
                330: [[[[73, 1], [70, 2], [122, 3]], [[161, 4], [70, 5], [0, 1]], [[73, 1], [0, 2]], [[122, 6]], [[0, 4]], [[161, 4], [0, 5]], [[122, 4]]], { 6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    14: 1,
                    18: 1,
                    21: 1,
                    25: 1,
                    29: 1,
                    32: 1,
                    37: 1,
                    73: 1,
                    122: 1 }],
                331: [[[[162, 1]], [[57, 2], [0, 1]], [[162, 1], [0, 2]]], { 6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    14: 1,
                    18: 1,
                    21: 1,
                    25: 1,
                    29: 1,
                    32: 1,
                    37: 1,
                    73: 1,
                    122: 1 }],
                332: [[[[1, 1], [2, 2]], [[0, 1]], [[163, 3]], [[125, 4]], [[164, 1], [125, 4]]], { 2: 1,
                    5: 1,
                    6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    12: 1,
                    13: 1,
                    14: 1,
                    16: 1,
                    18: 1,
                    19: 1,
                    20: 1,
                    21: 1,
                    22: 1,
                    23: 1,
                    24: 1,
                    25: 1,
                    26: 1,
                    27: 1,
                    29: 1,
                    30: 1,
                    32: 1,
                    33: 1,
                    34: 1,
                    37: 1 }],
                333: [[[[70, 1]], [[57, 2], [0, 1]], [[70, 1], [0, 2]]], { 6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    14: 1,
                    18: 1,
                    21: 1,
                    25: 1,
                    29: 1,
                    32: 1,
                    37: 1 }],
                334: [[[[70, 1]], [[57, 0], [0, 1]]], { 6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    14: 1,
                    18: 1,
                    21: 1,
                    25: 1,
                    29: 1,
                    32: 1,
                    37: 1 }],
                335: [[[[70, 1]], [[86, 2], [57, 3], [0, 1]], [[0, 2]], [[70, 4], [0, 3]], [[57, 3], [0, 4]]], { 6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    14: 1,
                    18: 1,
                    21: 1,
                    25: 1,
                    29: 1,
                    32: 1,
                    37: 1 }],
                336: [[[[136, 1]], [[57, 2], [0, 1]], [[136, 3]], [[57, 4], [0, 3]], [[136, 3], [0, 4]]], { 6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    11: 1,
                    14: 1,
                    18: 1,
                    21: 1,
                    25: 1,
                    29: 1,
                    32: 1,
                    37: 1 }],
                337: [[[[29, 1], [122, 2], [32, 3]], [[43, 4], [118, 5]], [[21, 4]], [[165, 6]], [[0, 4]], [[43, 4]], [[47, 4]]], { 29: 1, 32: 1, 122: 1 }],
                338: [[[[15, 1]], [[73, 2]], [[99, 3]], [[166, 4], [167, 5]], [[73, 6]], [[73, 7]], [[99, 8]], [[99, 9]], [[166, 4], [69, 10], [167, 5], [0, 8]], [[0, 9]], [[73, 11]], [[99, 12]], [[167, 5], [0, 12]]], { 15: 1 }],
                339: [[[[64, 1], [132, 2], [80, 3]], [[21, 4]], [[61, 5], [57, 6], [0, 2]], [[21, 7]], [[57, 8], [0, 4]], [[70, 9]], [[64, 1], [132, 2], [80, 3], [0, 6]], [[0, 7]], [[80, 3]], [[57, 6], [0, 9]]], { 21: 1, 29: 1, 64: 1, 80: 1 }],
                340: [[[[17, 1]], [[70, 2]], [[73, 3]], [[99, 4]], [[69, 5], [0, 4]], [[73, 6]], [[99, 7]], [[0, 7]]], { 17: 1 }],
                341: [[[[36, 1]], [[70, 2]], [[73, 3], [168, 4]], [[99, 5]], [[73, 3]], [[0, 5]]], { 36: 1 }],
                342: [[[[72, 1]], [[55, 2]], [[0, 2]]], { 72: 1 }],
                343: [[[[45, 1]], [[0, 1]]], { 26: 1 }] },
            states: [[[[1, 1], [2, 1], [3, 2]], [[0, 1]], [[2, 1]]], [[[38, 1]], [[39, 0], [0, 1]]], [[[40, 1]], [[25, 0], [37, 0], [0, 1]]], [[[18, 1], [8, 2], [32, 5], [29, 4], [9, 3], [14, 6], [21, 2]], [[18, 1], [0, 1]], [[0, 2]], [[41, 7], [42, 2]], [[43, 2], [44, 8], [45, 8]], [[46, 9], [47, 2]], [[48, 10]], [[42, 2]], [[43, 2]], [[47, 2]], [[14, 2]]], [[[49, 1]], [[50, 0], [0, 1]]], [[[51, 1]], [[52, 0], [0, 1]]], [[[53, 1]], [[54, 0], [0, 1]]], [[[55, 1]], [[56, 0], [0, 1]]], [[[55, 1]], [[57, 2], [0, 1]], [[55, 1], [0, 2]]], [[[58, 1]], [[59, 2], [60, 3], [61, 4], [0, 1]], [[0, 2]], [[58, 2], [45, 2]], [[58, 5], [45, 5]], [[61, 4], [0, 5]]], [[[62, 1]], [[63, 0], [64, 0], [65, 0], [66, 0], [0, 1]]], [[[27, 1]], [[21, 2]], [[57, 1], [0, 2]]], [[[67, 1], [68, 2]], [[0, 1]], [[31, 3], [0, 2]], [[68, 4]], [[69, 5]], [[70, 1]]], [[[71, 1]], [[57, 2], [0, 1]], [[71, 1], [0, 2]]], [[[21, 1]], [[72, 2], [0, 1]], [[21, 3]], [[0, 3]]], [[[11, 1]], [[73, 2], [74, 3]], [[70, 4]], [[73, 2]], [[0, 4]]], [[[18, 1]], [[0, 1]]], [[[13, 1]], [[21, 2]], [[57, 1], [0, 2]]], [[[7, 1], [75, 2]], [[38, 2]], [[0, 2]]], [[[76, 1]], [[77, 0], [0, 1]]], [[[78, 1]], [[79, 1], [80, 2], [0, 1]], [[49, 3]], [[0, 3]]], [[[81, 1]], [[82, 0], [83, 0], [0, 1]]], [[[25, 1], [6, 1], [37, 1], [84, 2]], [[49, 2]], [[0, 2]]], [[[26, 1]], [[58, 2], [0, 1]], [[0, 2]]], [[[73, 1]], [[70, 2]], [[61, 3], [0, 2]], [[70, 4]], [[0, 4]]], [[[64, 1], [85, 2], [80, 3]], [[70, 4]], [[57, 5], [0, 2]], [[70, 6]], [[57, 7], [0, 4]], [[64, 1], [85, 2], [80, 3], [0, 5]], [[0, 6]], [[85, 4], [80, 3]]], [[[70, 1]], [[86, 2], [61, 3], [0, 1]], [[0, 2]], [[70, 2]]], [[[20, 1]], [[70, 2]], [[57, 3], [0, 2]], [[70, 4]], [[0, 4]]], [[[87, 1], [88, 1], [89, 1], [90, 1], [91, 1], [92, 1], [93, 1], [94, 1], [95, 1], [96, 1], [97, 1], [98, 1]], [[0, 1]]], [[[33, 1]], [[0, 1]]], [[[10, 1]], [[21, 2]], [[73, 3], [29, 4]], [[99, 5]], [[43, 6], [58, 7]], [[0, 5]], [[73, 3]], [[43, 6]]], [[[100, 1], [101, 1], [7, 2], [102, 1], [100, 1], [103, 1], [104, 1], [105, 3], [106, 1], [107, 1]], [[0, 1]], [[103, 1]], [[7, 1], [0, 3]]], [[[108, 1], [109, 1], [110, 1], [111, 1], [112, 1], [113, 1], [114, 1], [115, 1]], [[0, 1]]], [[[34, 1]], [[0, 1]]], [[[116, 1]], [[114, 2], [111, 2]], [[0, 2]]], [[[35, 1]], [[117, 2]], [[29, 4], [2, 3]], [[0, 3]], [[43, 5], [118, 6]], [[2, 3]], [[43, 5]]], [[[119, 1]], [[119, 1], [0, 1]]], [[[22, 1]], [[120, 2]], [[0, 2]]], [[[70, 1]], [[73, 2]], [[70, 3]], [[57, 4], [0, 3]], [[70, 1], [0, 4]]], [[[117, 1]], [[72, 2], [0, 1]], [[21, 3]], [[0, 3]]], [[[121, 1]], [[57, 0], [0, 1]]], [[[21, 1]], [[122, 0], [0, 1]]], [[[21, 1]], [[0, 1]]], [[[58, 1]], [[2, 1], [123, 2]], [[0, 2]]], [[[124, 1]], [[70, 2], [0, 1]], [[72, 3], [57, 3], [0, 2]], [[70, 4]], [[0, 4]]], [[[16, 1]], [[55, 2]], [[103, 3], [0, 2]], [[70, 4]], [[57, 5], [0, 4]], [[70, 6]], [[0, 6]]], [[[2, 0], [123, 1], [125, 0]], [[0, 1]]], [[[126, 1], [127, 1], [128, 1], [129, 1], [130, 1]], [[0, 1]]], [[[28, 1]], [[120, 2]], [[103, 3]], [[58, 4]], [[73, 5]], [[99, 6]], [[69, 7], [0, 6]], [[73, 8]], [[99, 9]], [[0, 9]]], [[[29, 1], [21, 2]], [[131, 3]], [[73, 4], [0, 2]], [[43, 5]], [[70, 5]], [[0, 5]]], [[[132, 1]], [[57, 2], [0, 1]], [[132, 1], [0, 2]]], [[[4, 1]], [[21, 2]], [[133, 3]], [[134, 4], [73, 5]], [[70, 6]], [[99, 7]], [[73, 5]], [[0, 7]]], [[[28, 1]], [[120, 2]], [[103, 3]], [[68, 4]], [[135, 5], [0, 4]], [[0, 5]]], [[[31, 1]], [[136, 2]], [[135, 3], [0, 2]], [[0, 3]]], [[[86, 1], [137, 1]], [[0, 1]]], [[[31, 1]], [[70, 2]], [[73, 3]], [[99, 4]], [[69, 5], [138, 1], [0, 4]], [[73, 6]], [[99, 7]], [[0, 7]]], [[[30, 1]], [[139, 2]], [[24, 3]], [[140, 4], [29, 5], [64, 4]], [[0, 4]], [[140, 6]], [[43, 4]]], [[[24, 1]], [[141, 2]], [[0, 2]]], [[[142, 1], [143, 1]], [[0, 1]]], [[[28, 1]], [[120, 2]], [[103, 3]], [[144, 4]], [[145, 5], [0, 4]], [[0, 5]]], [[[31, 1]], [[136, 2]], [[145, 3], [0, 2]], [[0, 3]]], [[[146, 1], [147, 1]], [[0, 1]]], [[[70, 1]], [[146, 2], [57, 3], [0, 1]], [[0, 2]], [[70, 4], [0, 3]], [[57, 3], [0, 4]]], [[[11, 1]], [[73, 2], [74, 3]], [[136, 4]], [[73, 2]], [[0, 4]]], [[[148, 1], [68, 1]], [[0, 1]]], [[[29, 1]], [[43, 2], [74, 3]], [[0, 2]], [[43, 2]]], [[[23, 1]], [[0, 1]]], [[[12, 1]], [[70, 2], [82, 3], [0, 1]], [[57, 4], [0, 2]], [[70, 5]], [[70, 2], [0, 4]], [[57, 6], [0, 5]], [[70, 7]], [[57, 8], [0, 7]], [[70, 7], [0, 8]]], [[[5, 1]], [[70, 2], [0, 1]], [[57, 3], [0, 2]], [[70, 4]], [[57, 5], [0, 4]], [[70, 6]], [[0, 6]]], [[[19, 1]], [[58, 2], [0, 1]], [[0, 2]]], [[[149, 1]], [[2, 2], [150, 3]], [[0, 2]], [[149, 1], [2, 2]]], [[[73, 1]], [[70, 2], [0, 1]], [[0, 2]]], [[[151, 1], [152, 1], [153, 1], [154, 1], [155, 1], [156, 1], [157, 1], [158, 1], [159, 1], [160, 1]], [[0, 1]]], [[[1, 1], [3, 1]], [[0, 1]]], [[[73, 1], [70, 2], [122, 3]], [[161, 4], [70, 5], [0, 1]], [[73, 1], [0, 2]], [[122, 6]], [[0, 4]], [[161, 4], [0, 5]], [[122, 4]]], [[[162, 1]], [[57, 2], [0, 1]], [[162, 1], [0, 2]]], [[[1, 1], [2, 2]], [[0, 1]], [[163, 3]], [[125, 4]], [[164, 1], [125, 4]]], [[[70, 1]], [[57, 2], [0, 1]], [[70, 1], [0, 2]]], [[[70, 1]], [[57, 0], [0, 1]]], [[[70, 1]], [[86, 2], [57, 3], [0, 1]], [[0, 2]], [[70, 4], [0, 3]], [[57, 3], [0, 4]]], [[[136, 1]], [[57, 2], [0, 1]], [[136, 3]], [[57, 4], [0, 3]], [[136, 3], [0, 4]]], [[[29, 1], [122, 2], [32, 3]], [[43, 4], [118, 5]], [[21, 4]], [[165, 6]], [[0, 4]], [[43, 4]], [[47, 4]]], [[[15, 1]], [[73, 2]], [[99, 3]], [[166, 4], [167, 5]], [[73, 6]], [[73, 7]], [[99, 8]], [[99, 9]], [[166, 4], [69, 10], [167, 5], [0, 8]], [[0, 9]], [[73, 11]], [[99, 12]], [[167, 5], [0, 12]]], [[[64, 1], [132, 2], [80, 3]], [[21, 4]], [[61, 5], [57, 6], [0, 2]], [[21, 7]], [[57, 8], [0, 4]], [[70, 9]], [[64, 1], [132, 2], [80, 3], [0, 6]], [[0, 7]], [[80, 3]], [[57, 6], [0, 9]]], [[[17, 1]], [[70, 2]], [[73, 3]], [[99, 4]], [[69, 5], [0, 4]], [[73, 6]], [[99, 7]], [[0, 7]]], [[[36, 1]], [[70, 2]], [[73, 3], [168, 4]], [[99, 5]], [[73, 3]], [[0, 5]]], [[[72, 1]], [[55, 2]], [[0, 2]]], [[[45, 1]], [[0, 1]]]],
            labels: [[0, 'EMPTY'], [326, null], [4, null], [288, null], [1, 'def'], [1, 'raise'], [32, null], [1, 'not'], [2, null], [26, null], [1, 'class'], [1, 'lambda'], [1, 'print'], [1, 'nonlocal'], [25, null], [1, 'try'], [1, 'exec'], [1, 'while'], [3, null], [1, 'return'], [1, 'assert'], [1, null], [1, 'del'], [1, 'pass'], [1, 'import'], [15, null], [1, 'yield'], [1, 'global'], [1, 'for'], [7, null], [1, 'from'], [1, 'if'], [9, null], [1, 'break'], [1, 'continue'], [50, null], [1, 'with'], [14, null], [274, null], [1, 'and'], [266, null], [294, null], [27, null], [8, null], [335, null], [279, null], [318, null], [10, null], [334, null], [278, null], [19, null], [262, null], [18, null], [260, null], [33, null], [258, null], [287, null], [12, null], [333, null], [280, null], [284, null], [22, null], [277, null], [48, null], [16, null], [17, null], [24, null], [271, null], [275, null], [1, 'else'], [268, null], [270, null], [1, 'as'], [11, null], [339, null], [263, null], [257, null], [1, 'or'], [259, null], [337, null], [36, null], [261, null], [35, null], [34, null], [276, null], [282, null], [308, null], [46, null], [39, null], [41, null], [47, null], [42, null], [43, null], [37, null], [44, null], [49, null], [45, null], [38, null], [40, null], [332, null], [29, null], [21, null], [28, null], [1, 'in'], [30, null], [1, 'is'], [31, null], [20, null], [338, null], [311, null], [304, null], [286, null], [341, null], [340, null], [307, null], [290, null], [292, null], [297, null], [281, null], [291, null], [264, null], [295, null], [23, null], [0, null], [1, 'except'], [329, null], [285, null], [289, null], [324, null], [325, null], [343, null], [306, null], [305, null], [321, null], [55, null], [310, null], [320, null], [309, null], [1, 'elif'], [272, null], [269, null], [296, null], [313, null], [312, null], [336, null], [317, null], [315, null], [316, null], [319, null], [328, null], [13, null], [303, null], [267, null], [265, null], [322, null], [273, null], [323, null], [293, null], [301, null], [283, null], [314, null], [327, null], [330, null], [5, null], [6, null], [331, null], [300, null], [1, 'finally'], [342, null]],
            keywords: { 'and': 39,
                'as': 72,
                'assert': 20,
                'break': 33,
                'class': 10,
                'continue': 34,
                'def': 4,
                'del': 22,
                'elif': 138,
                'else': 69,
                'except': 124,
                'exec': 16,
                'finally': 167,
                'for': 28,
                'from': 30,
                'global': 27,
                'if': 31,
                'import': 24,
                'in': 103,
                'is': 105,
                'lambda': 11,
                'nonlocal': 13,
                'not': 7,
                'or': 77,
                'pass': 23,
                'print': 12,
                'raise': 5,
                'return': 19,
                'try': 15,
                'while': 17,
                'with': 36,
                'yield': 26 },
            tokens: { 0: 123,
                1: 21,
                2: 8,
                3: 18,
                4: 2,
                5: 163,
                6: 164,
                7: 29,
                8: 43,
                9: 32,
                10: 47,
                11: 73,
                12: 57,
                13: 150,
                14: 37,
                15: 25,
                16: 64,
                17: 65,
                18: 52,
                19: 50,
                20: 107,
                21: 101,
                22: 61,
                23: 122,
                24: 66,
                25: 14,
                26: 9,
                27: 42,
                28: 102,
                29: 100,
                30: 104,
                31: 106,
                32: 6,
                33: 54,
                34: 83,
                35: 82,
                36: 80,
                37: 93,
                38: 97,
                39: 88,
                40: 98,
                41: 89,
                42: 91,
                43: 92,
                44: 94,
                45: 96,
                46: 87,
                47: 90,
                48: 63,
                49: 95,
                50: 35,
                55: 134 },
            start: 256
        };
        // Nothing more to see here.

        /**
         * We're looking for something that is truthy, not just true.
         */
        function assert(condition, message) {
            if (!condition) {
                throw new Error(message);
            }
        }
        function fail(message) {
            assert(false, message);
        }

        /**
         * Null function used for default values of callbacks, etc.
         */

        /**
         * When defining a class Foo with an abstract method bar(), you can do:
         * Foo.prototype.bar = base.abstractMethod
         *
         * Now if a subclass of Foo fails to override bar(), an error will be thrown
         * when bar() is invoked.
         *
         * Note: This does not take the name of the function to override as an argument
         * because that would make it more difficult to obfuscate our JavaScript code.
         *
         * @type {!Function}
         * @throws {Error} when invoked to indicate the method should be overridden.
         */

        // ==============================================================================
        // Language Enhancements
        // ==============================================================================
        /**
         * This is a "fixed" version of the typeof operator.  It differs from the typeof
         * operator in such a way that null returns 'null' and arrays return 'array'.
         * @param {*} value The value to get the type of.
         * @return {string} The name of the type.
         */

        /**
         * Returns true if the specified value is not undefined.
         * WARNING: Do not use this to test if an object has a property. Use the in
         * operator instead.  Additionally, this function assumes that the global
         * undefined variable has not been redefined.
         * @param {*} val Variable to test.
         * @return {boolean} Whether variable is defined.
         */
        function isDef(val) {
            return val !== undefined;
        }
        /**
         * Returns true if the specified value is null.
         * @param {*} val Variable to test.
         * @return {boolean} Whether variable is null.
         */

        /**
         * Returns true if the specified value is defined and not null.
         * @param {*} val Variable to test.
         * @return {boolean} Whether variable is defined and not null.
         */

        /**
         * Returns true if the specified value is an array.
         * @param {*} val Variable to test.
         * @return {boolean} Whether variable is an array.
         */

        /**
         * Returns true if the object looks like a Date. To qualify as Date-like the
         * value needs to be an object and have a getFullYear() function.
         * @param {*} val Variable to test.
         * @return {boolean} Whether variable is a like a Date.
         */

        /**
         * Returns true if the specified value is a string.
         * @param {*} val Variable to test.
         * @return {boolean} Whether variable is a string.
         */
        function isString(val) {
            return typeof val === 'string';
        }
        /**
         * Returns true if the specified value is a boolean.
         * @param {*} val Variable to test.
         * @return {boolean} Whether variable is boolean.
         */

        /**
         * Returns true if the specified value is a number.
         * @param {*} val Variable to test.
         * @return {boolean} Whether variable is a number.
         */
        function isNumber(val) {
            return typeof val === 'number';
        }
        /**
         * Returns true if the specified value is a function.
         * @param {*} val Variable to test.
         * @return {boolean} Whether variable is a function.
         */

        /**
         * Returns true if the specified value is an object.  This includes arrays and
         * functions.
         * @param {*} val Variable to test.
         * @return {boolean} Whether variable is an object.
         */

        /**
         *
         */
        var TokenError = function () {
            function TokenError(message, lineNumber, columnNumber) {
                assert(isString(message), "message must be a string");
                assert(isNumber(lineNumber), "lineNumber must be a number");
                assert(isNumber(columnNumber), "columnNumber must be a number");
                this.name = "TokenError";
                this.message = message;
                this.lineNumber = lineNumber;
                this.columnNumber = columnNumber;
            }
            return TokenError;
        }();

        // Cache a few tokens for performance.
        var T_COMMENT$1 = Tokens.T_COMMENT;
        var T_DEDENT = Tokens.T_DEDENT;
        var T_ENDMARKER$1 = Tokens.T_ENDMARKER;
        var T_ERRORTOKEN = Tokens.T_ERRORTOKEN;
        var T_INDENT = Tokens.T_INDENT;
        var T_NAME$1 = Tokens.T_NAME;
        var T_NEWLINE = Tokens.T_NEWLINE;
        var T_NL$1 = Tokens.T_NL;
        var T_NUMBER = Tokens.T_NUMBER;
        var T_OP$1 = Tokens.T_OP;
        var T_STRING = Tokens.T_STRING;
        /* we have to use string and ctor to be able to build patterns up. + on /.../
            * does something strange. */
        // const Whitespace = "[ \\f\\t]*";
        var Comment_ = "#[^\\r\\n]*";
        var MultiComment_ = "'{3}[^]*'{3}";
        var Ident = "[a-zA-Z_]\\w*";
        var Binnumber = '0[bB][01]*';
        var Hexnumber = '0[xX][\\da-fA-F]*[lL]?';
        var Octnumber = '0[oO]?[0-7]*[lL]?';
        var Decnumber = '[1-9]\\d*[lL]?';
        var Intnumber = group(Binnumber, Hexnumber, Octnumber, Decnumber);
        var Exponent = "[eE][-+]?\\d+";
        var Pointfloat = group("\\d+\\.\\d*", "\\.\\d+") + maybe(Exponent);
        var Expfloat = '\\d+' + Exponent;
        var Floatnumber = group(Pointfloat, Expfloat);
        var Imagnumber = group("\\d+[jJ]", Floatnumber + "[jJ]");
        var Number_ = group(Imagnumber, Floatnumber, Intnumber);
        // tail end of ' string
        var Single = "^[^'\\\\]*(?:\\\\.[^'\\\\]*)*'";
        // tail end of " string
        var Double_ = '^[^"\\\\]*(?:\\\\.[^"\\\\]*)*"';
        // tail end of ''' string
        var Single3 = "[^'\\\\]*(?:(?:\\\\.|'(?!''))[^'\\\\]*)*'''";
        // tail end of """ string
        var Double3 = '[^"\\\\]*(?:(?:\\\\.|"(?!""))[^"\\\\]*)*"""';
        var Triple = group("[ubUB]?[rR]?'''", '[ubUB]?[rR]?"""');
        // const String_ = group("[uU]?[rR]?'[^\\n'\\\\]*(?:\\\\.[^\\n'\\\\]*)*'", '[uU]?[rR]?"[^\\n"\\\\]*(?:\\\\.[^\\n"\\\\]*)*"');
        // Because of leftmost-then-longest match semantics, be sure to put the
        // longest operators first (e.g., if = came before ==, == would get
        // recognized as two instances of =).
        var Operator = group("\\*\\*=?", ">>=?", "<<=?", "<>", "!=", "//=?", "->", "[+\\-*/%&|^=<>]=?", "~");
        var Bracket = '[\\][(){}]';
        var Special = group('\\r?\\n', '[:;.,`@]');
        var Funny = group(Operator, Bracket, Special);
        var ContStr = group("[uUbB]?[rR]?'[^\\n'\\\\]*(?:\\\\.[^\\n'\\\\]*)*" + group("'", '\\\\\\r?\\n'), '[uUbB]?[rR]?"[^\\n"\\\\]*(?:\\\\.[^\\n"\\\\]*)*' + group('"', '\\\\\\r?\\n'));
        var PseudoExtras = group('\\\\\\r?\\n', Comment_, Triple, MultiComment_);
        // Need to prefix with "^" as we only want to match what's next
        var PseudoToken = "^" + group(PseudoExtras, Number_, Funny, ContStr, Ident);
        var pseudoprog = new RegExp(PseudoToken);
        var single3prog = new RegExp(Single3, "g");
        var double3prog = new RegExp(Double3, "g");
        var endprogs = {
            "'": new RegExp(Single, "g"), '"': new RegExp(Double_, "g"),
            "'''": single3prog, '"""': double3prog,
            "r'''": single3prog, 'r"""': double3prog,
            "u'''": single3prog, 'u"""': double3prog,
            "b'''": single3prog, 'b"""': double3prog,
            "ur'''": single3prog, 'ur"""': double3prog,
            "br'''": single3prog, 'br"""': double3prog,
            "R'''": single3prog, 'R"""': double3prog,
            "U'''": single3prog, 'U"""': double3prog,
            "B'''": single3prog, 'B"""': double3prog,
            "uR'''": single3prog, 'uR"""': double3prog,
            "Ur'''": single3prog, 'Ur"""': double3prog,
            "UR'''": single3prog, 'UR"""': double3prog,
            "bR'''": single3prog, 'bR"""': double3prog,
            "Br'''": single3prog, 'Br"""': double3prog,
            "BR'''": single3prog, 'BR"""': double3prog,
            'r': null, 'R': null,
            'u': null, 'U': null,
            'b': null, 'B': null
        };
        var triple_quoted = {
            "'''": true, '"""': true,
            "r'''": true, 'r"""': true, "R'''": true, 'R"""': true,
            "u'''": true, 'u"""': true, "U'''": true, 'U"""': true,
            "b'''": true, 'b"""': true, "B'''": true, 'B"""': true,
            "ur'''": true, 'ur"""': true, "Ur'''": true, 'Ur"""': true,
            "uR'''": true, 'uR"""': true, "UR'''": true, 'UR"""': true,
            "br'''": true, 'br"""': true, "Br'''": true, 'Br"""': true,
            "bR'''": true, 'bR"""': true, "BR'''": true, 'BR"""': true
        };
        var single_quoted = {
            "'": true, '"': true,
            "r'": true, 'r"': true, "R'": true, 'R"': true,
            "u'": true, 'u"': true, "U'": true, 'U"': true,
            "b'": true, 'b"': true, "B'": true, 'B"': true,
            "ur'": true, 'ur"': true, "Ur'": true, 'Ur"': true,
            "uR'": true, 'uR"': true, "UR'": true, 'UR"': true,
            "br'": true, 'br"': true, "Br'": true, 'Br"': true,
            "bR'": true, 'bR"': true, "BR'": true, 'BR"': true
        };
        var tabsize = 8;
        var NAMECHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_';
        var NUMCHARS = '0123456789';
        /**
         * For performance, let V8 know the size of an array.
         * The first element is the line number.
         * The line number is 1-based. This is intuitive because it maps to the way we think about line numbers.
         * The second element is the column.
         * The column is 0-based. This works well because it is the standard index for accessing strings.
         */
        /**
         * The index of the line in the LineColumn array.
         */
        var LINE = 0;
        /**
         * The index of the column in the LineColumn array.
         */
        var COLUMN = 1;
        var Done = 'done';
        var Failed = 'failed';
        /**
         * This is a port of tokenize.py by Ka-Ping Yee.
         *
         * each call to readline should return one line of input as a string, or
         * undefined if it's finished.
         *
         * callback is called for each token with 5 args:
         * 1. the token type
         * 2. the token string
         * 3. [ start_row, start_col ]
         * 4. [ end_row, end_col ]
         * 5. logical line where the token was found, including continuation lines
         *
         * callback can return true to abort.
         */
        var Tokenizer = function () {
            /**
             *
             */
            function Tokenizer(interactive, callback) {
                this.callback = callback;
                /**
                 * Cache of the beginning of a token.
                 * This will change by token so consumers must copy the values out.
                 */
                this.begin = [-1, -1];
                /**
                 * Cache of the end of a token.
                 * This will change by token so consumers must copy the values out.
                 */
                this.end = [-1, -1];
                /**
                 * The line number. This must be copied into the begin[LINE] and end[LINE] properties.
                 */
                this.lnum = 0;
                this.parenlev = 0;
                this.strstart = [-1, -1];
                this.callback = callback;
                this.continued = false;
                this.contstr = '';
                this.needcont = false;
                this.contline = undefined;
                this.indents = [0];
                this.endprog = /.*/;
                this.interactive = interactive;
                this.doneFunc = function doneOrFailed() {
                    var begin = this.begin;
                    var end = this.end;
                    begin[LINE] = end[LINE] = this.lnum;
                    begin[COLUMN] = end[COLUMN] = 0;
                    var N = this.indents.length;
                    for (var i = 1; i < N; ++i) {
                        if (callback(T_DEDENT, '', begin, end, '')) {
                            return Done;
                        }
                    }
                    if (callback(T_ENDMARKER$1, '', begin, end, '')) {
                        return Done;
                    }
                    return Failed;
                };
            }
            /**
             * @param line
             * @return 'done' or 'failed' or true?
             */
            Tokenizer.prototype.generateTokens = function (line) {
                var endmatch;
                var column;
                var endIndex;
                if (!line) {
                    line = '';
                }
                this.lnum += 1;
                var pos = 0;
                var max = line.length;
                /**
                 * Local variable for performance and brevity.
                 */
                var callback = this.callback;
                var begin = this.begin;
                begin[LINE] = this.lnum;
                var end = this.end;
                end[LINE] = this.lnum;
                if (this.contstr.length > 0) {
                    if (!line) {
                        throw new TokenError("EOF in multi-line string", this.strstart[LINE], this.strstart[COLUMN]);
                    }
                    this.endprog.lastIndex = 0;
                    endmatch = this.endprog.test(line);
                    if (endmatch) {
                        pos = endIndex = this.endprog.lastIndex;
                        end[COLUMN] = endIndex;
                        if (callback(T_STRING, this.contstr + line.substring(0, endIndex), this.strstart, end, this.contline + line)) {
                            return Done;
                        }
                        this.contstr = '';
                        this.needcont = false;
                        this.contline = undefined;
                    } else if (this.needcont && line.substring(line.length - 2) !== "\\\n" && line.substring(line.length - 3) !== "\\\r\n") {
                        // Either contline is a string or the callback must allow undefined.
                        assert(typeof this.contline === 'string');
                        end[COLUMN] = line.length;
                        if (callback(T_ERRORTOKEN, this.contstr + line, this.strstart, end, this.contline)) {
                            return Done;
                        }
                        this.contstr = '';
                        this.contline = undefined;
                        return false;
                    } else {
                        this.contstr += line;
                        this.contline = this.contline + line;
                        return false;
                    }
                } else if (this.parenlev === 0 && !this.continued) {
                    if (!line) return this.doneFunc();
                    column = 0;
                    while (pos < max) {
                        var ch = line.charAt(pos);
                        if (ch === ' ') {
                            column += 1;
                        } else if (ch === '\t') {
                            column = (column / tabsize + 1) * tabsize;
                        } else if (ch === '\f') {
                            column = 0;
                        } else {
                            break;
                        }
                        pos = pos + 1;
                    }
                    if (pos === max) return this.doneFunc();
                    if ("#\r\n".indexOf(line.charAt(pos)) !== -1) {
                        if (line.charAt(pos) === '#') {
                            var comment_token = rstrip(line.substring(pos), '\r\n');
                            var nl_pos = pos + comment_token.length;
                            begin[COLUMN] = pos;
                            end[COLUMN] = nl_pos;
                            if (callback(T_COMMENT$1, comment_token, begin, end, line)) {
                                return Done;
                            }
                            begin[COLUMN] = nl_pos;
                            end[COLUMN] = line.length;
                            if (callback(T_NL$1, line.substring(nl_pos), begin, end, line)) {
                                return Done;
                            }
                            return false;
                        } else {
                            begin[COLUMN] = pos;
                            end[COLUMN] = line.length;
                            if (callback(T_NL$1, line.substring(pos), begin, end, line)) {
                                return Done;
                            }
                            if (!this.interactive) return false;
                        }
                    }
                    if ("'''".indexOf(line.charAt(pos)) !== -1) {
                        if (line.charAt(pos) === "'") {
                            var comment_token = line.substring(pos);
                            var nl_pos = pos + comment_token.length;
                            begin[COLUMN] = pos;
                            end[COLUMN] = nl_pos;
                            if (callback(T_COMMENT$1, comment_token, begin, end, line)) {
                                return Done;
                            }
                            begin[COLUMN] = nl_pos;
                            end[COLUMN] = line.length;
                            if (callback(T_NL$1, line.substring(nl_pos), begin, end, line)) {
                                return Done;
                            }
                            return false;
                        } else {
                            begin[COLUMN] = pos;
                            end[COLUMN] = line.length;
                            if (callback(T_NL$1, line.substring(pos), begin, end, line)) {
                                return Done;
                            }
                            if (!this.interactive) return false;
                        }
                    }
                    if (column > this.indents[this.indents.length - 1]) {
                        this.indents.push(column);
                        begin[COLUMN] = 0;
                        end[COLUMN] = pos;
                        if (callback(T_INDENT, line.substring(0, pos), begin, end, line)) {
                            return Done;
                        }
                    }
                    while (column < this.indents[this.indents.length - 1]) {
                        if (!contains(this.indents, column)) {
                            begin[COLUMN] = 0;
                            end[COLUMN] = pos;
                            throw indentationError("unindent does not match any outer indentation level", begin, end, line);
                        }
                        this.indents.splice(this.indents.length - 1, 1);
                        begin[COLUMN] = pos;
                        end[COLUMN] = pos;
                        if (callback(T_DEDENT, '', begin, end, line)) {
                            return Done;
                        }
                    }
                } else {
                    if (!line) {
                        throw new TokenError("EOF in multi-line statement", this.lnum, 0);
                    }
                    this.continued = false;
                }
                while (pos < max) {
                    // js regexes don't return any info about matches, other than the
                    // content. we'd like to put a \w+ before pseudomatch, but then we
                    // can't get any data
                    var capos = line.charAt(pos);
                    while (capos === ' ' || capos === '\f' || capos === '\t') {
                        pos += 1;
                        capos = line.charAt(pos);
                    }
                    pseudoprog.lastIndex = 0;
                    var pseudomatch = pseudoprog.exec(line.substring(pos));
                    if (pseudomatch) {
                        var startIndex = pos;
                        endIndex = startIndex + pseudomatch[1].length;
                        begin[COLUMN] = startIndex;
                        end[COLUMN] = endIndex;
                        pos = endIndex;
                        var token = line.substring(startIndex, endIndex);
                        var initial = line.charAt(startIndex);
                        if (NUMCHARS.indexOf(initial) !== -1 || initial === '.' && token !== '.') {
                            if (callback(T_NUMBER, token, begin, end, line)) {
                                return Done;
                            }
                        } else if (initial === '\r' || initial === '\n') {
                            var newl = T_NEWLINE;
                            if (this.parenlev > 0) newl = T_NL$1;
                            if (callback(newl, token, begin, end, line)) {
                                return Done;
                            }
                        } else if (initial === '#' || initial === "'''") {
                            if (callback(T_COMMENT$1, token, begin, end, line)) {
                                return Done;
                            }
                        } else if (triple_quoted.hasOwnProperty(token)) {
                            this.endprog = endprogs[token];
                            this.endprog.lastIndex = 0;
                            endmatch = this.endprog.test(line.substring(pos));
                            if (endmatch) {
                                pos = this.endprog.lastIndex + pos;
                                var token_1 = line.substring(startIndex, pos);
                                end[COLUMN] = pos;
                                if (callback(T_STRING, token_1, begin, end, line)) {
                                    return Done;
                                }
                            } else {
                                this.strstart[LINE] = this.lnum;
                                this.strstart[COLUMN] = startIndex;
                                this.contstr = line.substring(startIndex);
                                this.contline = line;
                                return false;
                            }
                        } else if (single_quoted.hasOwnProperty(initial) || single_quoted.hasOwnProperty(token.substring(0, 2)) || single_quoted.hasOwnProperty(token.substring(0, 3))) {
                            if (token[token.length - 1] === '\n') {
                                this.endprog = endprogs[initial] || endprogs[token[1]] || endprogs[token[2]];
                                assert(this.endprog instanceof RegExp);
                                this.contstr = line.substring(startIndex);
                                this.needcont = true;
                                this.contline = line;
                                return false;
                            } else {
                                if (callback(T_STRING, token, begin, end, line)) {
                                    return Done;
                                }
                            }
                        } else if (NAMECHARS.indexOf(initial) !== -1) {
                            if (callback(T_NAME$1, token, begin, end, line)) {
                                return Done;
                            }
                        } else if (initial === '\\') {
                            end[COLUMN] = pos;
                            if (callback(T_NL$1, token, begin, end, line)) {
                                return Done;
                            }
                            this.continued = true;
                        } else {
                            if ('([{'.indexOf(initial) !== -1) {
                                this.parenlev += 1;
                            } else if (')]}'.indexOf(initial) !== -1) {
                                this.parenlev -= 1;
                            }
                            if (callback(T_OP$1, token, begin, end, line)) {
                                return Done;
                            }
                        }
                    } else {
                        begin[COLUMN] = pos;
                        end[COLUMN] = pos + 1;
                        if (callback(T_ERRORTOKEN, line.charAt(pos), begin, end, line)) {
                            return Done;
                        }
                        pos += 1;
                    }
                }
                return false;
            };
            return Tokenizer;
        }();
        function group(x, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
            var args = Array.prototype.slice.call(arguments);
            return '(' + args.join('|') + ')';
        }
        function maybe(x) {
            return group.apply(null, arguments) + "?";
        }
        function contains(a, obj) {
            var i = a.length;
            while (i--) {
                if (a[i] === obj) {
                    return true;
                }
            }
            return false;
        }
        function rstrip(input, what) {
            var i;
            for (i = input.length; i > 0; --i) {
                if (what.indexOf(input.charAt(i - 1)) === -1) break;
            }
            return input.substring(0, i);
        }
        /**
         * @param message
         * @param begin
         * @param end
         * @param {string|undefined} text
         */
        function indentationError(message, begin, end, text) {
            assert(Array.isArray(begin), "begin must be an Array");
            assert(Array.isArray(end), "end must be an Array");
            var e = new SyntaxError(message /*, fileName*/);
            e.name = "IndentationError";
            if (begin) {
                e['lineNumber'] = begin[LINE];
                e['columnNumber'] = begin[COLUMN];
            }
            return e;
        }

        /**
         * Decodes of the tokens.
         * A mapping from the token number (symbol) to its human-readable name.
         */
        var tokenNames = {};
        tokenNames[Tokens.T_AMPER] = 'T_AMPER';
        tokenNames[Tokens.T_AMPEREQUAL] = 'T_AMPEREQUAL';
        tokenNames[Tokens.T_AT] = 'T_AT';
        tokenNames[Tokens.T_BACKQUOTE] = 'T_BACKQUOTE';
        tokenNames[Tokens.T_CIRCUMFLEX] = 'T_CIRCUMFLEX';
        tokenNames[Tokens.T_CIRCUMFLEXEQUAL] = 'T_CIRCUMFLEXEQUAL';
        tokenNames[Tokens.T_COLON] = 'T_COLON';
        tokenNames[Tokens.T_COMMA] = 'T_COMMA';
        tokenNames[Tokens.T_COMMENT] = 'T_COMMENT';
        tokenNames[Tokens.T_DEDENT] = 'T_DEDENT';
        tokenNames[Tokens.T_DOT] = 'T_DOT';
        tokenNames[Tokens.T_DOUBLESLASH] = 'T_DOUBLESLASH';
        tokenNames[Tokens.T_DOUBLESLASHEQUAL] = 'T_DOUBLESLASHEQUAL';
        tokenNames[Tokens.T_DOUBLESTAR] = 'T_DOUBLESTAR';
        tokenNames[Tokens.T_DOUBLESTAREQUAL] = 'T_DOUBLESTAREQUAL';
        tokenNames[Tokens.T_ENDMARKER] = 'T_ENDMARKER';
        tokenNames[Tokens.T_EQEQUAL] = 'T_EQEQUAL';
        tokenNames[Tokens.T_EQUAL] = 'T_EQUAL';
        tokenNames[Tokens.T_ERRORTOKEN] = 'T_ERRORTOKEN';
        tokenNames[Tokens.T_GREATER] = 'T_GREATER';
        tokenNames[Tokens.T_GREATEREQUAL] = 'T_GREATEREQUAL';
        tokenNames[Tokens.T_INDENT] = 'T_INDENT';
        tokenNames[Tokens.T_LBRACE] = 'T_LBRACE';
        tokenNames[Tokens.T_LEFTSHIFT] = 'T_LEFTSHIFT';
        tokenNames[Tokens.T_LEFTSHIFTEQUAL] = 'T_LEFTSHIFTEQUAL';
        tokenNames[Tokens.T_LESS] = 'T_LESS';
        tokenNames[Tokens.T_LESSEQUAL] = 'T_LESSEQUAL';
        tokenNames[Tokens.T_LPAR] = 'T_LPAR';
        tokenNames[Tokens.T_LSQB] = 'T_LSQB';
        tokenNames[Tokens.T_MINEQUAL] = 'T_MINEQUAL';
        tokenNames[Tokens.T_MINUS] = 'T_MINUS';
        tokenNames[Tokens.T_N_TOKENS] = 'T_N_TOKENS';
        tokenNames[Tokens.T_NAME] = 'T_NAME';
        tokenNames[Tokens.T_NEWLINE] = 'T_NEWLINE';
        tokenNames[Tokens.T_NL] = 'T_NL';
        tokenNames[Tokens.T_NOTEQUAL] = 'T_NOTEQUAL';
        tokenNames[Tokens.T_NT_OFFSET] = 'T_NT_OFFSET';
        tokenNames[Tokens.T_NUMBER] = 'T_NUMBER';
        tokenNames[Tokens.T_OP] = 'T_OP';
        tokenNames[Tokens.T_PERCENT] = 'T_PERCENT';
        tokenNames[Tokens.T_PERCENTEQUAL] = 'T_PERCENTEQUAL';
        tokenNames[Tokens.T_PLUS] = 'T_PLUS';
        tokenNames[Tokens.T_PLUSEQUAL] = 'T_PLUSEQUAL';
        tokenNames[Tokens.T_RARROW] = 'T_RARROW';
        tokenNames[Tokens.T_RBRACE] = 'T_RBRACE';
        tokenNames[Tokens.T_RIGHTSHIFT] = 'T_RIGHTSHIFT';
        tokenNames[Tokens.T_RPAR] = 'T_RPAR';
        tokenNames[Tokens.T_RSQB] = 'T_RSQB';
        tokenNames[Tokens.T_SEMI] = 'T_SEMI';
        tokenNames[Tokens.T_SLASH] = 'T_SLASH';
        tokenNames[Tokens.T_SLASHEQUAL] = 'T_SLASHEQUAL';
        tokenNames[Tokens.T_STAR] = 'T_STAR';
        tokenNames[Tokens.T_STAREQUAL] = 'T_STAREQUAL';
        tokenNames[Tokens.T_STRING] = 'T_STRING';
        tokenNames[Tokens.T_TILDE] = 'T_TILDE';
        tokenNames[Tokens.T_VBAR] = 'T_VBAR';
        tokenNames[Tokens.T_VBAREQUAL] = 'T_VBAREQUAL';

        function grammarName(type) {
            var tokenName = tokenNames[type];
            if (tokenName) {
                return tokenName;
            } else {
                return ParseTables.number2symbol[type];
            }
        }

        /*! *****************************************************************************
        Copyright (c) Microsoft Corporation. All rights reserved.
        Licensed under the Apache License, Version 2.0 (the "License"); you may not use
        this file except in compliance with the License. You may obtain a copy of the
        License at http://www.apache.org/licenses/LICENSE-2.0
        
        THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
        KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
        WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
        MERCHANTABLITY OR NON-INFRINGEMENT.
        
        See the Apache Version 2.0 License for specific language governing permissions
        and limitations under the License.
        ***************************************************************************** */
        /* global Reflect, Promise */

        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };

        function __extends(d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        }

        /**
         * @param message
         * @param lineNumber
         */
        function syntaxError(message, range) {
            assert(isString(message), "message must be a string");
            if (isDef(range)) {
                assert(isNumber(range.begin.line), "lineNumber must be a number");
            }
            var e = new SyntaxError(message /*, fileName*/);
            if (range) {
                assert(isNumber(range.begin.line), "lineNumber must be a number");
                if (typeof range.begin.line === 'number') {
                    e['lineNumber'] = range.begin.line;
                }
            }
            return e;
        }
        var ParseError = function (_super) {
            __extends(ParseError, _super);
            function ParseError(message) {
                var _this = _super.call(this, message) || this;
                _this.name = 'ParseError';
                return _this;
            }
            return ParseError;
        }(SyntaxError);
        /**
         * @param message
         * @param begin
         * @param end
         */
        function parseError(message, begin, end) {
            var e = new ParseError(message);
            // Copying from begin and end is important because they change for each token.
            // Notice that the Line is 1-based, but that row is 0-based.
            // Both column and Column are 0-based.
            if (Array.isArray(begin)) {
                e.begin = { row: begin[0] - 1, column: begin[1] };
            }
            if (Array.isArray(end)) {
                e.end = { row: end[0] - 1, column: end[1] };
            }
            return e;
        }

        var Position = function () {
            /**
             *
             */
            function Position(line, column) {
                this.line = line;
                this.column = column;
            }
            Position.prototype.toString = function () {
                return "[" + this.line + ", " + this.column + "]";
            };
            return Position;
        }();

        var Range = function () {
            /**
             *
             */
            function Range(begin, end) {
                assert(begin, "begin must be defined");
                assert(end, "end must be defined");
                this.begin = begin;
                this.end = end;
            }
            Range.prototype.toString = function () {
                return this.begin + " to " + this.end;
            };
            return Range;
        }();

        /**
         * Returns the number of children in the specified node.
         * Returns n.children.length
         */
        function NCH(n) {
            assert(n !== undefined);
            if (Array.isArray(n.children)) {
                return n.children.length;
            } else {
                return 0;
            }
        }
        function CHILD(n, i) {
            assert(i !== undefined && i >= 0);
            return CHILDREN(n)[i];
        }
        function FIND(n, type) {
            assert(type !== undefined);
            var children = CHILDREN(n);
            var N = children.length;
            for (var i = 0; i < N; i++) {
                var child = children[i];
                if (child.type === type) {
                    return i;
                }
            }
            return -1;
        }
        function CHILDREN(n) {
            assert(n !== undefined);
            if (n.children) {
                return n.children;
            } else {
                throw new Error("node does not have any children");
            }
        }
        function IDXLAST(xs) {
            return xs.length - 1;
        }
        /**
         * Returns the terminal nodes of the tree.
         */

        /**
         * Prepare the source text into lines to feed to the `generateTokens` method of the tokenizer.
         */
        function splitSourceTextIntoLines(sourceText) {
            var lines = [];
            // Why do we normalize the sourceText in this manner?
            if (sourceText.substr(IDXLAST(sourceText), 1) !== "\n") {
                sourceText += "\n";
            }
            // Splitting this way will create a final line that is the zero-length string.
            var pieces = sourceText.split("\n");
            var N = pieces.length;
            for (var i = 0; i < N; ++i) {
                // We're adding back newline characters for all but the last line.
                var line = pieces[i] + (i === IDXLAST(pieces) ? "" : "\n");
                lines.push(line);
            }
            return lines;
        }

        // Dereference certain tokens for performance.
        var T_COMMENT = Tokens.T_COMMENT;
        var T_ENDMARKER = Tokens.T_ENDMARKER;
        var T_NAME = Tokens.T_NAME;
        var T_NL = Tokens.T_NL;
        var T_NT_OFFSET = Tokens.T_NT_OFFSET;
        var T_OP = Tokens.T_OP;
        // low level parser to a concrete syntax tree, derived from cpython's lib2to3
        // TODO: The parser does not report whitespace nodes.
        // It would be nice if there were an ignoreWhitespace option.
        var Parser = function () {
            /**
             *
             */
            function Parser(grammar) {
                this.stack = [];
                this.used_names = {};
                this.grammar = grammar;
            }
            Parser.prototype.setup = function (start) {
                start = start || this.grammar.start;
                var newnode = {
                    type: start,
                    range: null,
                    value: null,
                    children: []
                };
                var stackentry = {
                    dfa: this.grammar.dfas[start][IDX_DFABT_DFA],
                    beginTokens: this.grammar.dfas[start][IDX_DFABT_BEGIN_TOKENS],
                    stateId: 0,
                    node: newnode
                };
                this.stack.push(stackentry);
            };
            /**
             * Add a token; return true if we're done.
             * @param type
             * @param value
             * @param context [start, end, line]
             */
            Parser.prototype.addtoken = function (type, value, begin, end, line) {
                /**
                 * The symbol for the token being added.
                 */
                var tokenSymbol = this.classify(type, value, begin, end, line);
                /**
                 * Local variable for performance.
                 */
                var stack = this.stack;
                // More local variables for performance.
                var g = this.grammar;
                var dfas = g.dfas;
                var labels = g.labels;
                // This code is very performance sensitive.
                OUTERWHILE: while (true) {
                    var stackTop = stack[stack.length - 1];
                    var dfa = stackTop.dfa;
                    // This is not being used. Why?
                    // let first = tp.dfa[DFA_SECOND];
                    var arcs = dfa[stackTop.stateId];
                    // look for a to-state with this label
                    for (var _i = 0, arcs_1 = arcs; _i < arcs_1.length; _i++) {
                        var arc = arcs_1[_i];
                        var arcSymbol = arc[ARC_SYMBOL_LABEL];
                        var newState = arc[ARC_TO_STATE];
                        var t = labels[arcSymbol][0];
                        // const v = labels[arcSymbol][1];
                        // console.lg(`t => ${t}, v => ${v}`);
                        if (tokenSymbol === arcSymbol) {
                            this.shiftToken(type, value, newState, begin, end, line);
                            // pop while we are in an accept-only state
                            var stateId = newState;
                            /**
                             * Temporary variable to save a few CPU cycles.
                             */
                            var statesOfState = dfa[stateId];
                            while (statesOfState.length === 1 && statesOfState[0][ARC_SYMBOL_LABEL] === 0 && statesOfState[0][ARC_TO_STATE] === stateId) {
                                this.popNonTerminal();
                                // Much of the time we won't be done so cache the stack length.
                                var stackLength = stack.length;
                                if (stackLength === 0) {
                                    // done!
                                    return true;
                                } else {
                                    stackTop = stack[stackLength - 1];
                                    stateId = stackTop.stateId;
                                    dfa = stackTop.dfa;
                                    // first = stackTop.beginTokens;
                                    // first = top.dfa[1];
                                    statesOfState = dfa[stateId];
                                }
                            }
                            // done with this token
                            return false;
                        } else if (isNonTerminal(t)) {
                            var dfabt = dfas[t];
                            var dfa_1 = dfabt[IDX_DFABT_DFA];
                            var beginTokens = dfabt[IDX_DFABT_BEGIN_TOKENS];
                            if (beginTokens.hasOwnProperty(tokenSymbol)) {
                                this.pushNonTerminal(t, dfa_1, beginTokens, newState, begin, end, line);
                                continue OUTERWHILE;
                            }
                        }
                    }
                    // We've exhaused all the arcs for the for the state.
                    if (existsTransition(arcs, [T_ENDMARKER, stackTop.stateId])) {
                        // an accepting state, pop it and try something else
                        this.popNonTerminal();
                        if (stack.length === 0) {
                            throw parseError("too much input");
                        }
                    } else {
                        var found = grammarName(stackTop.stateId);
                        // FIXME:
                        throw parseError("Unexpected " + found + " at " + JSON.stringify([begin[0], begin[1] + 1]), begin, end);
                    }
                }
            };
            /**
             * Turn a token into a symbol (something that labels an arc in the DFA).
             * The context is only used for error reporting.
             * @param type
             * @param value
             * @param context [begin, end, line]
             */
            Parser.prototype.classify = function (type, value, begin, end, line) {
                // Assertion commented out for efficiency.
                assertTerminal(type);
                var g = this.grammar;
                if (type === T_NAME) {
                    this.used_names[value] = true;
                    var keywordToSymbol = g.keywords;
                    if (keywordToSymbol.hasOwnProperty(value)) {
                        var ilabel_1 = keywordToSymbol[value];
                        // assert(typeof ilabel === 'number', "How can it not be?");
                        return ilabel_1;
                    }
                }
                var tokenToSymbol = g.tokens;
                var ilabel;
                if (tokenToSymbol.hasOwnProperty(type)) {
                    ilabel = tokenToSymbol[type];
                }
                if (!ilabel) {
                    console.log("ilabel = " + ilabel + ", type = " + type + ", value = " + value + ", begin = " + JSON.stringify(begin) + ", end = " + JSON.stringify(end));
                    throw parseError("bad token", begin, end);
                }
                return ilabel;
            };
            /**
             * Shifting a token (terminal).
             * 1. A new node is created representing the token.
             * 2. The new node is added as a child to the topmost node on the stack.
             * 3. The state of the topmost element on the stack is updated to be the new state.
             */
            Parser.prototype.shiftToken = function (type, value, newState, begin, end, line) {
                // assertTerminal(type);
                // Local variable for efficiency.
                var stack = this.stack;
                /**
                 * The topmost element in the stack is affected by shifting a token.
                 */
                var stackTop = stack[stack.length - 1];
                var node = stackTop.node;
                var newnode = {
                    type: type,
                    value: value,
                    range: new Range(new Position(begin[0], begin[1]), new Position(end[0], end[1])),
                    children: null
                };
                if (newnode && node.children) {
                    node.children.push(newnode);
                }
                stackTop.stateId = newState;
            };
            /**
             * Push a non-terminal symbol onto the stack as a new node.
             * 1. Update the state of the topmost element on the stack to be newState.
             * 2. Push a new element onto the stack corresponding to the symbol.
             * The new stack elements uses the newDfa and has state 0.
             */
            Parser.prototype.pushNonTerminal = function (type, dfa, beginTokens, newState, begin, end, line) {
                // Based on how this function is called, there is really no need for this assertion.
                // Retain it for now while it is not the performance bottleneck.
                // assertNonTerminal(type);
                // Local variable for efficiency.
                var stack = this.stack;
                var stackTop = stack[stack.length - 1];
                stackTop.stateId = newState;
                var beginPos = begin ? new Position(begin[0], begin[1]) : null;
                var endPos = end ? new Position(end[0], end[1]) : null;
                var newnode = { type: type, value: null, range: new Range(beginPos, endPos), children: [] };
                // TODO: Is there a symbolic constant for the zero state?
                stack.push({ dfa: dfa, beginTokens: beginTokens, stateId: 0, node: newnode });
            };
            /**
             * Pop a nonterminal.
             * Popping an element from the stack causes the node to be added to the children of the new top element.
             * The exception is when the stack becomes empty, in which case the node becomes the root node.
             */
            Parser.prototype.popNonTerminal = function () {
                // Local variable for efficiency.
                var stack = this.stack;
                var poppedElement = stack.pop();
                if (poppedElement) {
                    var poppedNode = poppedElement.node;
                    // Remove this assertion only when it becomes a performance issue.
                    // assertNonTerminal(poppedNode.type);
                    if (poppedNode) {
                        /**
                         * The length of the stack following the pop operation.
                         */
                        var N = stack.length;
                        if (N !== 0) {
                            var node = stack[N - 1].node;
                            var children = node.children;
                            if (children) {
                                children.push(poppedNode);
                            }
                        } else {
                            // If the length of the stack following the pop is zero then the popped element becomes the root node.
                            this.rootNode = poppedNode;
                            poppedNode.used_names = this.used_names;
                        }
                    }
                }
            };
            return Parser;
        }();
        /**
         * FIXME: This is O(N). Can we do better?
         * Finds the specified
         * @param a An array of arrays where each element is an array of two integers.
         * @param obj An array containing two integers.
         */
        function existsTransition(arcs, obj) {
            var i = arcs.length;
            while (i--) {
                var arc = arcs[i];
                if (arc[ARC_SYMBOL_LABEL] === obj[ARC_SYMBOL_LABEL] && arc[ARC_TO_STATE] === obj[ARC_TO_STATE]) {
                    return true;
                }
            }
            return false;
        }
        /**
         * parser for interactive input. returns a function that should be called with
         * lines of input as they are entered. the function will return false
         * until the input is complete, when it will return the rootnode of the parse.
         *
         * @param style root of parse tree (optional)
         */
        function makeParser(sourceKind) {
            if (sourceKind === undefined) sourceKind = exports.SourceKind.File;
            // FIXME: Would be nice to get this typing locked down. Why does Grammar not match ParseTables?
            var p = new Parser(ParseTables);
            // TODO: Can we do this over the symbolic constants?
            switch (sourceKind) {
                case exports.SourceKind.File:
                    {
                        p.setup(ParseTables.sym.file_input);
                        break;
                    }
                case exports.SourceKind.Eval:
                    {
                        p.setup(ParseTables.sym.eval_input);
                        break;
                    }
                case exports.SourceKind.Single:
                    {
                        p.setup(ParseTables.sym.single_input);
                        break;
                    }
                default:
                    {
                        throw new Error("SourceKind must be one of File, Eval, or Single.");
                    }
            }
            var lineno = 1;
            var column = 0;
            var prefix = "";
            var tokenizer = new Tokenizer(sourceKind === exports.SourceKind.Single, function tokenizerCallback(type, value, start, end, line) {
                // var s_lineno = start[0];
                // var s_column = start[1];
                /*
                if (s_lineno !== lineno && s_column !== column)
                {
                    // todo; update prefix and line/col
                }
                */
                if (type === T_COMMENT || type === T_NL) {
                    prefix += value;
                    lineno = end[0];
                    column = end[1];
                    if (value[value.length - 1] === "\n") {
                        lineno += 1;
                        column = 0;
                    }
                    return undefined;
                }
                if (type === T_OP) {
                    type = OpMap[value];
                }
                // FIXME: We're creating an array object here for every token.
                if (p.addtoken(type, value, start, end, line)) {
                    return true;
                }
                return undefined;
            });
            return function parseFunc(line) {
                var ret = tokenizer.generateTokens(line);
                if (ret) {
                    if (ret !== "done") {
                        throw parseError("incomplete input");
                    }
                    return p.rootNode;
                }
                return false;
            };
        }
        /**
         * Determines the starting point in the grammar for parsing the source.
         */

        (function (SourceKind) {
            /**
             * Suitable for a module.
             */
            SourceKind[SourceKind["File"] = 0] = "File";
            /**
             * Suitable for execution.
             */
            SourceKind[SourceKind["Eval"] = 1] = "Eval";
            /**
             * Suitable for a REPL.
             */
            SourceKind[SourceKind["Single"] = 2] = "Single";
        })(exports.SourceKind || (exports.SourceKind = {}));
        function parse(sourceText, sourceKind) {
            if (sourceKind === void 0) {
                sourceKind = exports.SourceKind.File;
            }
            var parser = makeParser(sourceKind);
            var lines = splitSourceTextIntoLines(sourceText);
            // FIXME: Mixing the types this way is awkward for the consumer.
            var ret = false;
            for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                var line = lines_1[_i];
                ret = parser(line);
            }
            return ret;
        }
        /**
         * Concrete Syntax Tree
         */
        function cstDump(parseTree) {
            function parseTreeDump(n, indent) {
                var ret = "";
                if (isNonTerminal(n.type)) {
                    ret += indent + ParseTables.number2symbol[n.type] + "\n";
                    if (n.children) {
                        for (var i = 0; i < n.children.length; ++i) {
                            ret += parseTreeDump(n.children[i], "  " + indent);
                        }
                    }
                } else {
                    ret += indent + tokenNames[n.type] + ": " + n.value + "\n";
                }
                return ret;
            }
            return parseTreeDump(parseTree, "");
        }
        /**
         * Terminal symbols hsould be less than T_NT_OFFSET.
         * NT_OFFSET means non-terminal offset.
         */
        function assertTerminal(type) {
            assert(type < T_NT_OFFSET, "terminal symbols should be less than T_NT_OFFSET");
        }
        /*
        function assertNonTerminal(type: number): void {
            assert(isNonTerminal(type), "non terminal symbols should be greater than or equal to T_NT_OFFSET");
        }
        */
        function isNonTerminal(type) {
            return type >= T_NT_OFFSET;
        }

        //
        // This module is at the bottom.
        // It should only import modules that don't introduce circularity.
        //
        var Load = function () {
            function Load() {}
            return Load;
        }();
        var Store = function () {
            function Store() {}
            return Store;
        }();
        var Del = function () {
            function Del() {}
            return Del;
        }();
        var AugLoad = function () {
            function AugLoad() {}
            return AugLoad;
        }();
        var AugStore = function () {
            function AugStore() {}
            return AugStore;
        }();
        var Param = function () {
            function Param() {}
            return Param;
        }();
        var And = function () {
            function And() {}
            return And;
        }();
        var Or = function () {
            function Or() {}
            return Or;
        }();
        var Add = function () {
            function Add() {}
            return Add;
        }();
        var Sub = function () {
            function Sub() {}
            return Sub;
        }();
        var Mult = function () {
            function Mult() {}
            return Mult;
        }();
        var Div = function () {
            function Div() {}
            return Div;
        }();
        var Mod = function () {
            function Mod() {}
            return Mod;
        }();
        var Pow = function () {
            function Pow() {}
            return Pow;
        }();
        var LShift = function () {
            function LShift() {}
            return LShift;
        }();
        var RShift = function () {
            function RShift() {}
            return RShift;
        }();
        var BitOr = function () {
            function BitOr() {}
            return BitOr;
        }();
        var BitXor = function () {
            function BitXor() {}
            return BitXor;
        }();
        var BitAnd = function () {
            function BitAnd() {}
            return BitAnd;
        }();
        var FloorDiv = function () {
            function FloorDiv() {}
            return FloorDiv;
        }();
        var Invert = function () {
            function Invert() {}
            return Invert;
        }();
        var Not = function () {
            function Not() {}
            return Not;
        }();
        var UAdd = function () {
            function UAdd() {}
            return UAdd;
        }();
        var USub = function () {
            function USub() {}
            return USub;
        }();
        var Eq = function () {
            function Eq() {}
            return Eq;
        }();
        var NotEq = function () {
            function NotEq() {}
            return NotEq;
        }();
        var Lt = function () {
            function Lt() {}
            return Lt;
        }();
        var LtE = function () {
            function LtE() {}
            return LtE;
        }();
        var Gt = function () {
            function Gt() {}
            return Gt;
        }();
        var GtE = function () {
            function GtE() {}
            return GtE;
        }();
        var Is = function () {
            function Is() {}
            return Is;
        }();
        var IsNot = function () {
            function IsNot() {}
            return IsNot;
        }();
        var In = function () {
            function In() {}
            return In;
        }();
        var NotIn = function () {
            function NotIn() {}
            return NotIn;
        }();
        var RangeAnnotated = function () {
            function RangeAnnotated(value, range) {
                this.value = value;
                this.range = range;
                assert(typeof value !== 'undefined', "value must be defined.");
            }
            return RangeAnnotated;
        }();
        var Expression = function () {
            function Expression() {
                // Do noting yet.
            }
            Expression.prototype.accept = function (visitor) {
                // accept must be implemented by derived classes.
                throw new Error("\"Expression.accept\" is not implemented.");
            };
            return Expression;
        }();
        var Statement = function () {
            function Statement() {}
            Statement.prototype.accept = function (visitor) {
                // accept must be implemented by derived classes.
                throw new Error("\"Statement.accept\" is not implemented.");
            };
            return Statement;
        }();
        var IterationStatement = function (_super) {
            __extends(IterationStatement, _super);
            function IterationStatement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return IterationStatement;
        }(Statement);
        var Module = function () {
            function Module(body) {
                this.body = body;
            }
            Module.prototype.accept = function (visitor) {
                visitor.module(this);
            };
            return Module;
        }();
        var Interactive = function () {
            function Interactive(body) {
                this.body = body;
            }
            return Interactive;
        }();
        var UnaryExpression = function (_super) {
            __extends(UnaryExpression, _super);
            function UnaryExpression() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return UnaryExpression;
        }(Expression);
        var Suite = function () {
            function Suite(body) {
                this.body = body;
            }
            return Suite;
        }();
        var FunctionDef = function (_super) {
            __extends(FunctionDef, _super);
            function FunctionDef(name, args, body, returnType, decorator_list, range) {
                var _this = _super.call(this) || this;
                _this.range = range;
                _this.name = name;
                _this.args = args;
                _this.body = body;
                _this.decorator_list = decorator_list;
                _this.returnType = returnType;
                return _this;
            }
            FunctionDef.prototype.accept = function (visitor) {
                visitor.functionDef(this);
            };
            return FunctionDef;
        }(Statement);
        var FunctionParamDef = function () {
            function FunctionParamDef(name, type) {
                this.name = name;
                if (type) {
                    this.type = type;
                } else {
                    this.type = null;
                }
            }
            return FunctionParamDef;
        }();
        var ClassDef = function (_super) {
            __extends(ClassDef, _super);
            function ClassDef(name, bases, body, decorator_list, range) {
                var _this = _super.call(this) || this;
                _this.range = range;
                _this.name = name;
                _this.bases = bases;
                _this.body = body;
                _this.decorator_list = decorator_list;
                return _this;
            }
            ClassDef.prototype.accept = function (visitor) {
                visitor.classDef(this);
            };
            return ClassDef;
        }(Statement);
        var ReturnStatement = function (_super) {
            __extends(ReturnStatement, _super);
            function ReturnStatement(value, range) {
                var _this = _super.call(this) || this;
                _this.range = range;
                _this.value = value;
                return _this;
            }
            ReturnStatement.prototype.accept = function (visitor) {
                visitor.returnStatement(this);
            };
            return ReturnStatement;
        }(Statement);
        var DeleteStatement = function (_super) {
            __extends(DeleteStatement, _super);
            function DeleteStatement(targets, range) {
                var _this = _super.call(this) || this;
                _this.range = range;
                _this.targets = targets;
                return _this;
            }
            return DeleteStatement;
        }(Statement);
        var Assign = function (_super) {
            __extends(Assign, _super);
            function Assign(targets, value, range, eqRange, type) {
                var _this = _super.call(this) || this;
                _this.range = range;
                _this.eqRange = eqRange;
                _this.targets = targets;
                _this.value = value;
                if (type) {
                    _this.type = type;
                }
                return _this;
            }
            Assign.prototype.accept = function (visitor) {
                visitor.assign(this);
            };
            return Assign;
        }(Statement);
        var AugAssign = function (_super) {
            __extends(AugAssign, _super);
            function AugAssign(target, op, value, range) {
                var _this = _super.call(this) || this;
                _this.range = range;
                _this.target = target;
                _this.op = op;
                _this.value = value;
                return _this;
            }
            return AugAssign;
        }(Statement);
        var AnnAssign = function (_super) {
            __extends(AnnAssign, _super);
            function AnnAssign(type, target, range) {
                var _this = _super.call(this) || this;
                _this.range = range;
                _this.value = type;
                _this.target = target;
                return _this;
            }
            AnnAssign.prototype.accept = function (visitor) {
                visitor.annAssign(this);
            };
            return AnnAssign;
        }(Statement);
        var Print = function (_super) {
            __extends(Print, _super);
            function Print(dest, values, nl, range) {
                var _this = _super.call(this) || this;
                _this.range = range;
                _this.dest = dest;
                _this.values = values;
                _this.nl = nl;
                return _this;
            }
            Print.prototype.accept = function (visitor) {
                visitor.print(this);
            };
            return Print;
        }(Statement);
        var ForStatement = function (_super) {
            __extends(ForStatement, _super);
            function ForStatement(target, iter, body, orelse, range) {
                var _this = _super.call(this) || this;
                _this.range = range;
                _this.target = target;
                _this.iter = iter;
                _this.body = body;
                _this.orelse = orelse;
                return _this;
            }
            ForStatement.prototype.accept = function (visitor) {
                visitor.forStatement(this);
            };
            return ForStatement;
        }(Statement);
        var WhileStatement = function (_super) {
            __extends(WhileStatement, _super);
            function WhileStatement(test, body, orelse, range) {
                var _this = _super.call(this) || this;
                _this.range = range;
                _this.test = test;
                _this.body = body;
                _this.orelse = orelse;
                return _this;
            }
            return WhileStatement;
        }(IterationStatement);
        var IfStatement = function (_super) {
            __extends(IfStatement, _super);
            function IfStatement(test, consequent, alternate, range) {
                var _this = _super.call(this) || this;
                _this.range = range;
                _this.test = test;
                _this.consequent = consequent;
                _this.alternate = alternate;
                return _this;
            }
            IfStatement.prototype.accept = function (visitor) {
                visitor.ifStatement(this);
            };
            return IfStatement;
        }(Statement);
        var WithStatement = function (_super) {
            __extends(WithStatement, _super);
            function WithStatement(context_expr, optional_vars, body, range) {
                var _this = _super.call(this) || this;
                _this.range = range;
                _this.context_expr = context_expr;
                _this.optional_vars = optional_vars;
                _this.body = body;
                return _this;
            }
            return WithStatement;
        }(Statement);
        var Raise = function (_super) {
            __extends(Raise, _super);
            function Raise(type, inst, tback, range) {
                var _this = _super.call(this) || this;
                _this.range = range;
                _this.type = type;
                _this.inst = inst;
                _this.tback = tback;
                return _this;
            }
            return Raise;
        }(Statement);
        var TryExcept = function (_super) {
            __extends(TryExcept, _super);
            function TryExcept(body, handlers, orelse, range) {
                var _this = _super.call(this) || this;
                _this.range = range;
                _this.body = body;
                _this.handlers = handlers;
                _this.orelse = orelse;
                return _this;
            }
            return TryExcept;
        }(Statement);
        var TryFinally = function (_super) {
            __extends(TryFinally, _super);
            function TryFinally(body, finalbody, range) {
                var _this = _super.call(this) || this;
                _this.range = range;
                _this.body = body;
                _this.finalbody = finalbody;
                return _this;
            }
            return TryFinally;
        }(Statement);
        var Assert = function (_super) {
            __extends(Assert, _super);
            function Assert(test, msg, range) {
                var _this = _super.call(this) || this;
                _this.range = range;
                _this.test = test;
                _this.msg = msg;
                return _this;
            }
            return Assert;
        }(Statement);
        var ImportStatement = function (_super) {
            __extends(ImportStatement, _super);
            function ImportStatement(names, range) {
                var _this = _super.call(this) || this;
                _this.range = range;
                _this.names = names;
                return _this;
            }
            return ImportStatement;
        }(Statement);
        var ImportFrom = function (_super) {
            __extends(ImportFrom, _super);
            function ImportFrom(module, names, level, range) {
                var _this = _super.call(this) || this;
                _this.range = range;
                assert(typeof module.value === 'string', "module must be a string.");
                assert(Array.isArray(names), "names must be an Array.");
                _this.module = module;
                _this.names = names;
                _this.level = level;
                return _this;
            }
            ImportFrom.prototype.accept = function (visitor) {
                visitor.importFrom(this);
            };
            return ImportFrom;
        }(Statement);
        var Exec = function (_super) {
            __extends(Exec, _super);
            function Exec(body, globals, locals, range) {
                var _this = _super.call(this) || this;
                _this.range = range;
                _this.body = body;
                _this.globals = globals;
                _this.locals = locals;
                return _this;
            }
            return Exec;
        }(Statement);
        var Global = function (_super) {
            __extends(Global, _super);
            function Global(names, range) {
                var _this = _super.call(this) || this;
                _this.range = range;
                _this.names = names;
                return _this;
            }
            return Global;
        }(Statement);
        var NonLocal = function (_super) {
            __extends(NonLocal, _super);
            function NonLocal(names, range) {
                var _this = _super.call(this) || this;
                _this.range = range;
                _this.names = names;
                return _this;
            }
            return NonLocal;
        }(Statement);
        var ExpressionStatement = function (_super) {
            __extends(ExpressionStatement, _super);
            function ExpressionStatement(value, range) {
                var _this = _super.call(this) || this;
                _this.range = range;
                _this.value = value;
                return _this;
            }
            ExpressionStatement.prototype.accept = function (visitor) {
                visitor.expressionStatement(this);
            };
            return ExpressionStatement;
        }(Statement);
        var Pass = function (_super) {
            __extends(Pass, _super);
            function Pass(range) {
                var _this = _super.call(this) || this;
                _this.range = range;
                return _this;
            }
            return Pass;
        }(Statement);
        var BreakStatement = function (_super) {
            __extends(BreakStatement, _super);
            function BreakStatement(range) {
                var _this = _super.call(this) || this;
                _this.range = range;
                return _this;
            }
            return BreakStatement;
        }(Statement);
        var ContinueStatement = function (_super) {
            __extends(ContinueStatement, _super);
            function ContinueStatement(range) {
                var _this = _super.call(this) || this;
                _this.range = range;
                return _this;
            }
            return ContinueStatement;
        }(Statement);
        var BoolOp = function (_super) {
            __extends(BoolOp, _super);
            function BoolOp(op, values, range) {
                var _this = _super.call(this) || this;
                _this.range = range;
                _this.op = op;
                _this.values = values;
                return _this;
            }
            return BoolOp;
        }(Expression);
        var BinOp = function (_super) {
            __extends(BinOp, _super);
            function BinOp(lhs, ops, rhs, range) {
                var _this = _super.call(this) || this;
                _this.range = range;
                _this.lhs = lhs;
                _this.op = ops.op;
                _this.opRange = ops.range;
                _this.rhs = rhs;
                return _this;
            }
            BinOp.prototype.accept = function (visitor) {
                visitor.binOp(this);
            };
            return BinOp;
        }(Expression);
        var UnaryOp = function (_super) {
            __extends(UnaryOp, _super);
            function UnaryOp(op, operand, range) {
                var _this = _super.call(this) || this;
                _this.range = range;
                _this.op = op;
                _this.operand = operand;
                return _this;
            }
            return UnaryOp;
        }(Expression);
        var Lambda = function (_super) {
            __extends(Lambda, _super);
            function Lambda(args, body, range) {
                var _this = _super.call(this) || this;
                _this.range = range;
                _this.args = args;
                _this.body = body;
                return _this;
            }
            return Lambda;
        }(Expression);
        var IfExp = function (_super) {
            __extends(IfExp, _super);
            function IfExp(test, body, orelse, range) {
                var _this = _super.call(this) || this;
                _this.range = range;
                _this.test = test;
                _this.body = body;
                _this.orelse = orelse;
                return _this;
            }
            return IfExp;
        }(Expression);
        var Dict = function (_super) {
            __extends(Dict, _super);
            function Dict(keys, values, range) {
                var _this = _super.call(this) || this;
                _this.range = range;
                _this.keys = keys;
                _this.values = values;
                return _this;
            }
            Dict.prototype.accept = function (visitor) {
                visitor.dict(this);
            };
            return Dict;
        }(Expression);
        var ListComp = function (_super) {
            __extends(ListComp, _super);
            function ListComp(elt, generators, range) {
                var _this = _super.call(this) || this;
                _this.range = range;
                _this.elt = elt;
                _this.generators = generators;
                return _this;
            }
            return ListComp;
        }(Expression);
        var GeneratorExp = function (_super) {
            __extends(GeneratorExp, _super);
            function GeneratorExp(elt, generators, range) {
                var _this = _super.call(this) || this;
                _this.range = range;
                _this.elt = elt;
                _this.generators = generators;
                return _this;
            }
            return GeneratorExp;
        }(Expression);
        var Yield = function (_super) {
            __extends(Yield, _super);
            function Yield(value, range) {
                var _this = _super.call(this) || this;
                _this.range = range;
                _this.value = value;
                return _this;
            }
            return Yield;
        }(Expression);
        var Compare = function (_super) {
            __extends(Compare, _super);
            function Compare(left, ops, comparators, range) {
                var _this = _super.call(this) || this;
                _this.range = range;
                _this.left = left;
                for (var _i = 0, ops_1 = ops; _i < ops_1.length; _i++) {
                    var op = ops_1[_i];
                    switch (op) {
                        case Eq:
                            {
                                break;
                            }
                        case NotEq:
                            {
                                break;
                            }
                        case Gt:
                            {
                                break;
                            }
                        case GtE:
                            {
                                break;
                            }
                        case Lt:
                            {
                                break;
                            }
                        case LtE:
                            {
                                break;
                            }
                        case In:
                            {
                                break;
                            }
                        case NotIn:
                            {
                                break;
                            }
                        case Is:
                            {
                                break;
                            }
                        case IsNot:
                            {
                                break;
                            }
                        default:
                            {
                                throw new Error("ops must only contain CompareOperator(s) but contains " + op);
                            }
                    }
                }
                _this.ops = ops;
                _this.comparators = comparators;
                return _this;
            }
            Compare.prototype.accept = function (visitor) {
                visitor.compareExpression(this);
            };
            return Compare;
        }(Expression);
        var Call = function (_super) {
            __extends(Call, _super);
            function Call(func, args, keywords, starargs, kwargs) {
                var _this = _super.call(this) || this;
                _this.func = func;
                _this.args = args;
                _this.keywords = keywords;
                _this.starargs = starargs;
                _this.kwargs = kwargs;
                return _this;
            }
            Call.prototype.accept = function (visitor) {
                visitor.callExpression(this);
            };
            return Call;
        }(Expression);
        var Num = function (_super) {
            __extends(Num, _super);
            function Num(n) {
                var _this = _super.call(this) || this;
                _this.n = n;
                return _this;
            }
            Num.prototype.accept = function (visitor) {
                visitor.num(this);
            };
            return Num;
        }(Expression);
        var Str = function (_super) {
            __extends(Str, _super);
            function Str(s) {
                var _this = _super.call(this) || this;
                _this.s = s;
                return _this;
            }
            Str.prototype.accept = function (visitor) {
                visitor.str(this);
            };
            return Str;
        }(Expression);
        var Attribute = function (_super) {
            __extends(Attribute, _super);
            function Attribute(value, attr, ctx, range) {
                var _this = _super.call(this) || this;
                _this.range = range;
                _this.value = value;
                _this.attr = attr;
                _this.ctx = ctx;
                return _this;
            }
            Attribute.prototype.accept = function (visitor) {
                visitor.attribute(this);
            };
            return Attribute;
        }(Expression);
        var Subscript = function (_super) {
            __extends(Subscript, _super);
            function Subscript(value, slice, ctx, range) {
                var _this = _super.call(this) || this;
                _this.range = range;
                _this.value = value;
                _this.slice = slice;
                _this.ctx = ctx;
                return _this;
            }
            return Subscript;
        }(Expression);
        var Name = function (_super) {
            __extends(Name, _super);
            function Name(id, ctx) {
                var _this = _super.call(this) || this;
                _this.id = id;
                _this.ctx = ctx;
                return _this;
            }
            Name.prototype.accept = function (visitor) {
                visitor.name(this);
            };
            return Name;
        }(Expression);
        var List = function (_super) {
            __extends(List, _super);
            function List(elts, ctx, range) {
                var _this = _super.call(this) || this;
                _this.range = range;
                _this.elts = elts;
                _this.ctx = ctx;
                return _this;
            }
            List.prototype.accept = function (visitor) {
                visitor.list(this);
            };
            return List;
        }(Expression);
        var Tuple = function (_super) {
            __extends(Tuple, _super);
            function Tuple(elts, ctx, range) {
                var _this = _super.call(this) || this;
                _this.range = range;
                _this.elts = elts;
                _this.ctx = ctx;
                return _this;
            }
            return Tuple;
        }(Expression);
        var Ellipsis = function () {
            function Ellipsis() {
                // Do nothing yet.
            }
            return Ellipsis;
        }();
        var Slice = function () {
            function Slice(lower, upper, step) {
                this.lower = lower;
                this.upper = upper;
                this.step = step;
            }
            return Slice;
        }();
        var ExtSlice = function () {
            function ExtSlice(dims) {
                this.dims = dims;
            }
            return ExtSlice;
        }();
        var Index = function () {
            function Index(value) {
                this.value = value;
            }
            return Index;
        }();
        var Comprehension = function () {
            function Comprehension(target, iter, ifs, range) {
                this.range = range;
                this.target = target;
                this.iter = iter;
                this.ifs = ifs;
            }
            return Comprehension;
        }();
        var ExceptHandler = function () {
            function ExceptHandler(type, name, body, range) {
                this.range = range;
                this.type = type;
                this.name = name;
                this.body = body;
            }
            return ExceptHandler;
        }();
        var Arguments = function () {
            function Arguments(args, vararg, kwarg, defaults) {
                this.args = args;
                this.vararg = vararg;
                this.kwarg = kwarg;
                this.defaults = defaults;
            }
            return Arguments;
        }();
        var Keyword = function () {
            function Keyword(arg, value) {
                this.arg = arg;
                this.value = value;
            }
            return Keyword;
        }();
        var Alias = function () {
            function Alias(name, asname) {
                assert(typeof name.value === 'string');
                assert(typeof asname === 'string' || asname === null);
                this.name = name;
                this.asname = asname;
            }
            Alias.prototype.toString = function () {
                return this.name.value + " as " + this.asname;
            };
            return Alias;
        }();
        Module.prototype['_astname'] = 'Module';
        Module.prototype['_fields'] = ['body', function (n) {
            return n.body;
        }];
        Interactive.prototype['_astname'] = 'Interactive';
        Interactive.prototype['_fields'] = ['body', function (n) {
            return n.body;
        }];
        Expression.prototype['_astname'] = 'Expression';
        Expression.prototype['_fields'] = ['body', function (n) {
            // TOD: Expression is abstract so we should not be here?
            return void 0;
        }];
        Suite.prototype['_astname'] = 'Suite';
        Suite.prototype['_fields'] = ['body', function (n) {
            return n.body;
        }];
        FunctionDef.prototype['_astname'] = 'FunctionDef';
        FunctionDef.prototype['_fields'] = ['name', function (n) {
            return n.name.value;
        }, 'args', function (n) {
            return n.args;
        }, 'body', function (n) {
            return n.body;
        }, 'returnType', function (n) {
            return n.returnType;
        }, 'decorator_list', function (n) {
            return n.decorator_list;
        }];
        ClassDef.prototype['_astname'] = 'ClassDef';
        ClassDef.prototype['_fields'] = ['name', function (n) {
            return n.name.value;
        }, 'bases', function (n) {
            return n.bases;
        }, 'body', function (n) {
            return n.body;
        }, 'decorator_list', function (n) {
            return n.decorator_list;
        }];
        ReturnStatement.prototype['_astname'] = 'ReturnStatement';
        ReturnStatement.prototype['_fields'] = ['value', function (n) {
            return n.value;
        }];
        DeleteStatement.prototype['_astname'] = 'DeleteStatement';
        DeleteStatement.prototype['_fields'] = ['targets', function (n) {
            return n.targets;
        }];
        Assign.prototype['_astname'] = 'Assign';
        Assign.prototype['_fields'] = ['targets', function (n) {
            return n.targets;
        }, 'value', function (n) {
            return n.value;
        }];
        AugAssign.prototype['_astname'] = 'AugAssign';
        AugAssign.prototype['_fields'] = ['target', function (n) {
            return n.target;
        }, 'op', function (n) {
            return n.op;
        }, 'value', function (n) {
            return n.value;
        }];
        AnnAssign.prototype['_astname'] = 'AnnAssign';
        AnnAssign.prototype['_fields'] = ['target', function (n) {
            return n.target;
        }, 'type', function (n) {
            return n.value;
        }];
        Print.prototype['_astname'] = 'Print';
        Print.prototype['_fields'] = ['dest', function (n) {
            return n.dest;
        }, 'values', function (n) {
            return n.values;
        }, 'nl', function (n) {
            return n.nl;
        }];
        ForStatement.prototype['_astname'] = 'ForStatement';
        ForStatement.prototype['_fields'] = ['target', function (n) {
            return n.target;
        }, 'iter', function (n) {
            return n.iter;
        }, 'body', function (n) {
            return n.body;
        }, 'orelse', function (n) {
            return n.orelse;
        }];
        WhileStatement.prototype['_astname'] = 'WhileStatement';
        WhileStatement.prototype['_fields'] = ['test', function (n) {
            return n.test;
        }, 'body', function (n) {
            return n.body;
        }, 'orelse', function (n) {
            return n.orelse;
        }];
        IfStatement.prototype['_astname'] = 'IfStatement';
        IfStatement.prototype['_fields'] = ['test', function (n) {
            return n.test;
        }, 'consequent', function (n) {
            return n.consequent;
        }, 'alternate', function (n) {
            return n.alternate;
        }];
        WithStatement.prototype['_astname'] = 'WithStatement';
        WithStatement.prototype['_fields'] = ['context_expr', function (n) {
            return n.context_expr;
        }, 'optional_vars', function (n) {
            return n.optional_vars;
        }, 'body', function (n) {
            return n.body;
        }];
        Raise.prototype['_astname'] = 'Raise';
        Raise.prototype['_fields'] = ['type', function (n) {
            return n.type;
        }, 'inst', function (n) {
            return n.inst;
        }, 'tback', function (n) {
            return n.tback;
        }];
        TryExcept.prototype['_astname'] = 'TryExcept';
        TryExcept.prototype['_fields'] = ['body', function (n) {
            return n.body;
        }, 'handlers', function (n) {
            return n.handlers;
        }, 'orelse', function (n) {
            return n.orelse;
        }];
        TryFinally.prototype['_astname'] = 'TryFinally';
        TryFinally.prototype['_fields'] = ['body', function (n) {
            return n.body;
        }, 'finalbody', function (n) {
            return n.finalbody;
        }];
        Assert.prototype['_astname'] = 'Assert';
        Assert.prototype['_fields'] = ['test', function (n) {
            return n.test;
        }, 'msg', function (n) {
            return n.msg;
        }];
        ImportStatement.prototype['_astname'] = 'Import';
        ImportStatement.prototype['_fields'] = ['names', function (n) {
            return n.names;
        }];
        ImportFrom.prototype['_astname'] = 'ImportFrom';
        ImportFrom.prototype['_fields'] = ['module', function (n) {
            return n.module.value;
        }, 'names', function (n) {
            return n.names;
        }, 'level', function (n) {
            return n.level;
        }];
        Exec.prototype['_astname'] = 'Exec';
        Exec.prototype['_fields'] = ['body', function (n) {
            return n.body;
        }, 'globals', function (n) {
            return n.globals;
        }, 'locals', function (n) {
            return n.locals;
        }];
        Global.prototype['_astname'] = 'Global';
        Global.prototype['_fields'] = ['names', function (n) {
            return n.names;
        }];
        NonLocal.prototype['_astname'] = 'NonLocal';
        NonLocal.prototype['_fields'] = ['names', function (n) {
            return n.names;
        }];
        ExpressionStatement.prototype['_astname'] = 'ExpressionStatement';
        ExpressionStatement.prototype['_fields'] = ['value', function (n) {
            return n.value;
        }];
        Pass.prototype['_astname'] = 'Pass';
        Pass.prototype['_fields'] = [];
        BreakStatement.prototype['_astname'] = 'BreakStatement';
        BreakStatement.prototype['_fields'] = [];
        ContinueStatement.prototype['_astname'] = 'ContinueStatement';
        ContinueStatement.prototype['_fields'] = [];
        BoolOp.prototype['_astname'] = 'BoolOp';
        BoolOp.prototype['_fields'] = ['op', function (n) {
            return n.op;
        }, 'values', function (n) {
            return n.values;
        }];
        BinOp.prototype['_astname'] = 'BinOp';
        BinOp.prototype['_fields'] = ['lhs', function (n) {
            return n.lhs;
        }, 'op', function (n) {
            return n.op;
        }, 'rhs', function (n) {
            return n.rhs;
        }];
        UnaryOp.prototype['_astname'] = 'UnaryOp';
        UnaryOp.prototype['_fields'] = ['op', function (n) {
            return n.op;
        }, 'operand', function (n) {
            return n.operand;
        }];
        Lambda.prototype['_astname'] = 'Lambda';
        Lambda.prototype['_fields'] = ['args', function (n) {
            return n.args;
        }, 'body', function (n) {
            return n.body;
        }];
        IfExp.prototype['_astname'] = 'IfExp';
        IfExp.prototype['_fields'] = ['test', function (n) {
            return n.test;
        }, 'body', function (n) {
            return n.body;
        }, 'orelse', function (n) {
            return n.orelse;
        }];
        Dict.prototype['_astname'] = 'Dict';
        Dict.prototype['_fields'] = ['keys', function (n) {
            return n.keys;
        }, 'values', function (n) {
            return n.values;
        }];
        ListComp.prototype['_astname'] = 'ListComp';
        ListComp.prototype['_fields'] = ['elt', function (n) {
            return n.elt;
        }, 'generators', function (n) {
            return n.generators;
        }];
        GeneratorExp.prototype['_astname'] = 'GeneratorExp';
        GeneratorExp.prototype['_fields'] = ['elt', function (n) {
            return n.elt;
        }, 'generators', function (n) {
            return n.generators;
        }];
        Yield.prototype['_astname'] = 'Yield';
        Yield.prototype['_fields'] = ['value', function (n) {
            return n.value;
        }];
        Compare.prototype['_astname'] = 'Compare';
        Compare.prototype['_fields'] = ['left', function (n) {
            return n.left;
        }, 'ops', function (n) {
            return n.ops;
        }, 'comparators', function (n) {
            return n.comparators;
        }];
        Call.prototype['_astname'] = 'Call';
        Call.prototype['_fields'] = ['func', function (n) {
            return n.func;
        }, 'args', function (n) {
            return n.args;
        }, 'keywords', function (n) {
            return n.keywords;
        }, 'starargs', function (n) {
            return n.starargs;
        }, 'kwargs', function (n) {
            return n.kwargs;
        }];
        Num.prototype['_astname'] = 'Num';
        Num.prototype['_fields'] = ['n', function (n) {
            return n.n.value;
        }];
        Str.prototype['_astname'] = 'Str';
        Str.prototype['_fields'] = ['s', function (n) {
            return n.s.value;
        }];
        Attribute.prototype['_astname'] = 'Attribute';
        Attribute.prototype['_fields'] = ['value', function (n) {
            return n.value;
        }, 'attr', function (n) {
            return n.attr.value;
        }, 'ctx', function (n) {
            return n.ctx;
        }];
        Subscript.prototype['_astname'] = 'Subscript';
        Subscript.prototype['_fields'] = ['value', function (n) {
            return n.value;
        }, 'slice', function (n) {
            return n.slice;
        }, 'ctx', function (n) {
            return n.ctx;
        }];
        Name.prototype['_astname'] = 'Name';
        Name.prototype['_fields'] = ['id', function (n) {
            return n.id.value;
        }, 'ctx', function (n) {
            return n.ctx;
        }];
        List.prototype['_astname'] = 'List';
        List.prototype['_fields'] = ['elts', function (n) {
            return n.elts;
        }, 'ctx', function (n) {
            return n.ctx;
        }];
        Tuple.prototype['_astname'] = 'Tuple';
        Tuple.prototype['_fields'] = ['elts', function (n) {
            return n.elts;
        }, 'ctx', function (n) {
            return n.ctx;
        }];
        Load.prototype['_astname'] = 'Load';
        Load.prototype['_isenum'] = true;
        Store.prototype['_astname'] = 'Store';
        Store.prototype['_isenum'] = true;
        Del.prototype['_astname'] = 'Del';
        Del.prototype['_isenum'] = true;
        AugLoad.prototype['_astname'] = 'AugLoad';
        AugLoad.prototype['_isenum'] = true;
        AugStore.prototype['_astname'] = 'AugStore';
        AugStore.prototype['_isenum'] = true;
        Param.prototype['_astname'] = 'Param';
        Param.prototype['_isenum'] = true;
        Ellipsis.prototype['_astname'] = 'Ellipsis';
        Ellipsis.prototype['_fields'] = [];
        Slice.prototype['_astname'] = 'Slice';
        Slice.prototype['_fields'] = ['lower', function (n) {
            return n.lower;
        }, 'upper', function (n) {
            return n.upper;
        }, 'step', function (n) {
            return n.step;
        }];
        ExtSlice.prototype['_astname'] = 'ExtSlice';
        ExtSlice.prototype['_fields'] = ['dims', function (n) {
            return n.dims;
        }];
        Index.prototype['_astname'] = 'Index';
        Index.prototype['_fields'] = ['value', function (n) {
            return n.value;
        }];
        And.prototype['_astname'] = 'And';
        And.prototype['_isenum'] = true;
        Or.prototype['_astname'] = 'Or';
        Or.prototype['_isenum'] = true;
        Add.prototype['_astname'] = 'Add';
        Add.prototype['_isenum'] = true;
        Sub.prototype['_astname'] = 'Sub';
        Sub.prototype['_isenum'] = true;
        Mult.prototype['_astname'] = 'Mult';
        Mult.prototype['_isenum'] = true;
        Div.prototype['_astname'] = 'Div';
        Div.prototype['_isenum'] = true;
        Mod.prototype['_astname'] = 'Mod';
        Mod.prototype['_isenum'] = true;
        Pow.prototype['_astname'] = 'Pow';
        Pow.prototype['_isenum'] = true;
        LShift.prototype['_astname'] = 'LShift';
        LShift.prototype['_isenum'] = true;
        RShift.prototype['_astname'] = 'RShift';
        RShift.prototype['_isenum'] = true;
        BitOr.prototype['_astname'] = 'BitOr';
        BitOr.prototype['_isenum'] = true;
        BitXor.prototype['_astname'] = 'BitXor';
        BitXor.prototype['_isenum'] = true;
        BitAnd.prototype['_astname'] = 'BitAnd';
        BitAnd.prototype['_isenum'] = true;
        FloorDiv.prototype['_astname'] = 'FloorDiv';
        FloorDiv.prototype['_isenum'] = true;
        Invert.prototype['_astname'] = 'Invert';
        Invert.prototype['_isenum'] = true;
        Not.prototype['_astname'] = 'Not';
        Not.prototype['_isenum'] = true;
        UAdd.prototype['_astname'] = 'UAdd';
        UAdd.prototype['_isenum'] = true;
        USub.prototype['_astname'] = 'USub';
        USub.prototype['_isenum'] = true;
        Eq.prototype['_astname'] = 'Eq';
        Eq.prototype['_isenum'] = true;
        NotEq.prototype['_astname'] = 'NotEq';
        NotEq.prototype['_isenum'] = true;
        Lt.prototype['_astname'] = 'Lt';
        Lt.prototype['_isenum'] = true;
        LtE.prototype['_astname'] = 'LtE';
        LtE.prototype['_isenum'] = true;
        Gt.prototype['_astname'] = 'Gt';
        Gt.prototype['_isenum'] = true;
        GtE.prototype['_astname'] = 'GtE';
        GtE.prototype['_isenum'] = true;
        Is.prototype['_astname'] = 'Is';
        Is.prototype['_isenum'] = true;
        IsNot.prototype['_astname'] = 'IsNot';
        IsNot.prototype['_isenum'] = true;
        In.prototype['_astname'] = 'In';
        In.prototype['_isenum'] = true;
        NotIn.prototype['_astname'] = 'NotIn';
        NotIn.prototype['_isenum'] = true;
        Comprehension.prototype['_astname'] = 'Comprehension';
        Comprehension.prototype['_fields'] = ['target', function (n) {
            return n.target;
        }, 'iter', function (n) {
            return n.iter;
        }, 'ifs', function (n) {
            return n.ifs;
        }];
        ExceptHandler.prototype['_astname'] = 'ExceptHandler';
        ExceptHandler.prototype['_fields'] = ['type', function (n) {
            return n.type;
        }, 'name', function (n) {
            return n.name;
        }, 'body', function (n) {
            return n.body;
        }];
        Arguments.prototype['_astname'] = 'Arguments';
        Arguments.prototype['_fields'] = ['args', function (n) {
            return n.args;
        }, 'vararg', function (n) {
            return n.vararg;
        }, 'kwarg', function (n) {
            return n.kwarg;
        }, 'defaults', function (n) {
            return n.defaults;
        }];
        Keyword.prototype['_astname'] = 'Keyword';
        Keyword.prototype['_fields'] = ['arg', function (n) {
            return n.arg.value;
        }, 'value', function (n) {
            return n.value;
        }];
        FunctionParamDef.prototype['_astname'] = 'FunctionParamDef';
        FunctionParamDef.prototype['_fields'] = ['name', function (n) {
            return n.name;
        }, 'type', function (n) {
            return n.type;
        }];
        Alias.prototype['_astname'] = 'Alias';
        Alias.prototype['_fields'] = ['name', function (n) {
            return n.name.value;
        }, 'asname', function (n) {
            return n.asname;
        }];

        /**
         * @param s
         */
        function floatAST(s) {
            var thing = {
                text: s,
                value: parseFloat(s),
                isFloat: function () {
                    return true;
                },
                isInt: function () {
                    return false;
                },
                isLong: function () {
                    return false;
                },
                toString: function () {
                    return s;
                }
            };
            return thing;
        }
        /**
         * @param n
         */
        function intAST(n) {
            var thing = {
                value: n,
                isFloat: function () {
                    return false;
                },
                isInt: function () {
                    return true;
                },
                isLong: function () {
                    return false;
                },
                toString: function () {
                    return '' + n;
                }
            };
            return thing;
        }
        /**
         * @param {string} s
         */
        function longAST(s, radix) {
            var thing = {
                text: s,
                radix: radix,
                isFloat: function () {
                    return false;
                },
                isInt: function () {
                    return false;
                },
                isLong: function () {
                    return true;
                },
                toString: function () {
                    return s;
                }
            };
            return thing;
        }

        // TODO: Conventions
        // FIXME: Convention
        // import { Module } from './types';
        // import { cstDump } from './parser';
        //
        // This is pretty much a straight port of ast.c from CPython 2.6.5.
        //
        // The previous version was easier to work with and more JS-ish, but having a
        // somewhat different ast structure than cpython makes testing more difficult.
        //
        // This way, we can use a dump from the ast module on any arbitrary python
        // code and know that we're the same up to ast level, at least.
        //
        var SYM = ParseTables.sym;
        /**
         *
         */
        var LONG_THRESHOLD = Math.pow(2, 53);
        /**
         * FIXME: Consolidate with parseError in parser.
         */
        function syntaxError$1(message, range) {
            assert(isString(message), "message must be a string");
            assert(isNumber(range.begin.line), "lineNumber must be a number");
            var e = new SyntaxError(message /*, fileName*/);
            e['lineNumber'] = range.begin.line;
            return e;
        }
        var Compiling = function () {
            function Compiling(encoding) {
                this.c_encoding = encoding;
            }
            return Compiling;
        }();
        /**
         * Asserts that the type of the node is that specified.
         */
        function REQ(n, type) {
            // Avoid the cost of building the message string when there is no issue.
            if (n.type !== type) {
                fail("node must have type " + type + " = " + grammarName(type) + ", but was " + n.type + " = " + grammarName(n.type) + ".");
            }
        }
        /**
         * Nothing more than assertion that the argument is a string.
         */
        function strobj(s) {
            // Avoid the cost of building the message string when there is no issue.
            if (typeof s !== 'string') {
                fail("expecting string, got " + typeof s);
            }
            // This previously constructed the runtime representation.
            // That may have had an string intern side effect?
            return s;
        }
        function numStmts(n) {
            switch (n.type) {
                case SYM.single_input:
                    if (CHILD(n, 0).type === Tokens.T_NEWLINE) return 0;else return numStmts(CHILD(n, 0));
                case SYM.file_input:
                    var cnt = 0;
                    for (var i = 0; i < NCH(n); ++i) {
                        var ch = CHILD(n, i);
                        if (ch.type === SYM.stmt) {
                            cnt += numStmts(ch);
                        }
                    }
                    return cnt;
                case SYM.stmt:
                    return numStmts(CHILD(n, 0));
                case SYM.compound_stmt:
                    return 1;
                case SYM.simple_stmt:
                    return Math.floor(NCH(n) / 2); // div 2 is to remove count of ;s
                case SYM.suite:
                    if (NCH(n) === 1) return numStmts(CHILD(n, 0));else {
                        var cnt_1 = 0;
                        for (var i = 2; i < NCH(n) - 1; ++i) {
                            cnt_1 += numStmts(CHILD(n, i));
                        }
                        return cnt_1;
                    }
                default:
                    {
                        throw new Error("Non-statement found");
                    }
            }
        }
        function forbiddenCheck(c, n, x, range) {
            if (x === "None") throw syntaxError$1("assignment to None", range);
            if (x === "True" || x === "False") throw syntaxError$1("assignment to True or False is forbidden", range);
        }
        /**
         * Set the context ctx for e, recursively traversing e.
         *
         * Only sets context for expr kinds that can appear in assignment context as
         * per the asdl file.
         */
        function setContext(c, e, ctx, n) {
            assert(ctx !== AugStore && ctx !== AugLoad);
            var s = null;
            var exprName = null;
            if (e instanceof Attribute) {
                if (ctx === Store) forbiddenCheck(c, n, e.attr.value, n.range);
                e.ctx = ctx;
            } else if (e instanceof Name) {
                if (ctx === Store) forbiddenCheck(c, n, /*e.attr*/void 0, n.range);
                e.ctx = ctx;
            } else if (e instanceof Subscript) {
                e.ctx = ctx;
            } else if (e instanceof List) {
                e.ctx = ctx;
                s = e.elts;
            } else if (e instanceof Tuple) {
                if (e.elts.length === 0) {
                    throw syntaxError$1("can't assign to ()", n.range);
                }
                e.ctx = ctx;
                s = e.elts;
            } else if (e instanceof Lambda) {
                exprName = "lambda";
            } else if (e instanceof Call) {
                exprName = "function call";
            } else if (e instanceof BoolOp) {
                exprName = "operator";
            } else {
                switch (e.constructor) {
                    case BoolOp:
                    case BinOp:
                    case UnaryOp:
                        exprName = "operator";
                        break;
                    case GeneratorExp:
                        exprName = "generator expression";
                        break;
                    case Yield:
                        exprName = "yield expression";
                        break;
                    case ListComp:
                        exprName = "list comprehension";
                        break;
                    case Dict:
                    case Num:
                    case Str:
                        exprName = "literal";
                        break;
                    case Compare:
                        exprName = "comparison expression";
                        break;
                    case IfExp:
                        exprName = "conditional expression";
                        break;
                    default:
                        {
                            throw new Error("unhandled expression in assignment");
                        }
                }
            }
            if (exprName) {
                throw syntaxError$1("can't " + (ctx === Store ? "assign to" : "delete") + " " + exprName, n.range);
            }
            if (s) {
                for (var _i = 0, s_1 = s; _i < s_1.length; _i++) {
                    var e_1 = s_1[_i];
                    setContext(c, e_1, ctx, n);
                }
            }
        }
        var operatorMap = {};
        (function () {
            operatorMap[Tokens.T_VBAR] = BitOr;
            assert(operatorMap[Tokens.T_VBAR] !== undefined, "" + Tokens.T_VBAR);
            // assert(operatorMap[TOK.T_VBAR] === BitOr, `${TOK.T_VBAR}`);
            operatorMap[Tokens.T_VBAR] = BitOr;
            operatorMap[Tokens.T_CIRCUMFLEX] = BitXor;
            operatorMap[Tokens.T_AMPER] = BitAnd;
            operatorMap[Tokens.T_LEFTSHIFT] = LShift;
            operatorMap[Tokens.T_RIGHTSHIFT] = RShift;
            operatorMap[Tokens.T_PLUS] = Add;
            operatorMap[Tokens.T_MINUS] = Sub;
            operatorMap[Tokens.T_STAR] = Mult;
            operatorMap[Tokens.T_SLASH] = Div;
            operatorMap[Tokens.T_DOUBLESLASH] = FloorDiv;
            operatorMap[Tokens.T_PERCENT] = Mod;
        })();
        function getOperator(n) {
            assert(operatorMap[n.type] !== undefined, "" + n.type);
            return { op: operatorMap[n.type], range: n.range };
        }
        function astForCompOp(c, n) {
            // comp_op: '<'|'>'|'=='|'>='|'<='|'<>'|'!='|'in'|'not' 'in'|'is' |'is' 'not'
            REQ(n, SYM.comp_op);
            if (NCH(n) === 1) {
                n = CHILD(n, 0);
                switch (n.type) {
                    case Tokens.T_LESS:
                        return Lt;
                    case Tokens.T_GREATER:
                        return Gt;
                    case Tokens.T_EQEQUAL:
                        return Eq;
                    case Tokens.T_LESSEQUAL:
                        return LtE;
                    case Tokens.T_GREATEREQUAL:
                        return GtE;
                    case Tokens.T_NOTEQUAL:
                        return NotEq;
                    case Tokens.T_NAME:
                        if (n.value === "in") return In;
                        if (n.value === "is") return Is;
                }
            } else if (NCH(n) === 2) {
                if (CHILD(n, 0).type === Tokens.T_NAME) {
                    if (CHILD(n, 1).value === "in") return NotIn;
                    if (CHILD(n, 0).value === "is") return IsNot;
                }
            }
            throw new Error("invalid comp_op");
        }
        function seqForTestlist(c, n) {
            /* testlist: test (',' test)* [','] */
            assert(n.type === SYM.testlist || n.type === SYM.listmaker || n.type === SYM.testlist_gexp || n.type === SYM.testlist_safe || n.type === SYM.testlist1);
            var seq = [];
            for (var i = 0; i < NCH(n); i += 2) {
                assert(CHILD(n, i).type === SYM.IfExpr || CHILD(n, i).type === SYM.old_test);
                seq[i / 2] = astForExpr(c, CHILD(n, i));
            }
            return seq;
        }
        function astForSuite(c, n) {
            /* suite: simple_stmt | NEWLINE INDENT stmt+ DEDENT */
            REQ(n, SYM.suite);
            var seq = [];
            var pos = 0;
            var ch;
            if (CHILD(n, 0).type === SYM.simple_stmt) {
                n = CHILD(n, 0);
                /* simple_stmt always ends with an NEWLINE and may have a trailing
                    * SEMI. */
                var end = NCH(n) - 1;
                if (CHILD(n, end - 1).type === Tokens.T_SEMI) {
                    end -= 1;
                }
                // by 2 to skip
                for (var i = 0; i < end; i += 2) {
                    seq[pos++] = astForStmt(c, CHILD(n, i));
                }
            } else {
                for (var i = 2; i < NCH(n) - 1; ++i) {
                    ch = CHILD(n, i);
                    REQ(ch, SYM.stmt);
                    var num = numStmts(ch);
                    if (num === 1) {
                        // small_stmt or compound_stmt w/ only 1 child
                        seq[pos++] = astForStmt(c, ch);
                    } else {
                        ch = CHILD(ch, 0);
                        REQ(ch, SYM.simple_stmt);
                        for (var j = 0; j < NCH(ch); j += 2) {
                            if (NCH(CHILD(ch, j)) === 0) {
                                assert(j + 1 === NCH(ch));
                                break;
                            }
                            seq[pos++] = astForStmt(c, CHILD(ch, j));
                        }
                    }
                }
            }
            assert(pos === numStmts(n));
            return seq;
        }
        function astForExceptClause(c, exc, body) {
            /* except_clause: 'except' [test [(',' | 'as') test]] */
            REQ(exc, SYM.except_clause);
            REQ(body, SYM.suite);
            if (NCH(exc) === 1) {
                return new ExceptHandler(null, null, astForSuite(c, body), exc.range);
            } else if (NCH(exc) === 2) return new ExceptHandler(astForExpr(c, CHILD(exc, 1)), null, astForSuite(c, body), exc.range);else if (NCH(exc) === 4) {
                var e = astForExpr(c, CHILD(exc, 3));
                setContext(c, e, Store, CHILD(exc, 3));
                return new ExceptHandler(astForExpr(c, CHILD(exc, 1)), e, astForSuite(c, body), exc.range);
            } else {
                throw new Error("wrong number of children for except clause");
            }
        }
        function astForTryStmt(c, n) {
            var nc = NCH(n);
            var nexcept = (nc - 3) / 3;
            var orelse = [];
            var finally_ = null;
            REQ(n, SYM.try_stmt);
            var body = astForSuite(c, CHILD(n, 2));
            if (CHILD(n, nc - 3).type === Tokens.T_NAME) {
                if (CHILD(n, nc - 3).value === "finally") {
                    if (nc >= 9 && CHILD(n, nc - 6).type === Tokens.T_NAME) {
                        /* we can assume it's an "else",
                            because nc >= 9 for try-else-finally and
                            it would otherwise have a type of except_clause */
                        orelse = astForSuite(c, CHILD(n, nc - 4));
                        nexcept--;
                    }
                    finally_ = astForSuite(c, CHILD(n, nc - 1));
                    nexcept--;
                } else {
                    /* we can assume it's an "else",
                        otherwise it would have a type of except_clause */
                    orelse = astForSuite(c, CHILD(n, nc - 1));
                    nexcept--;
                }
            } else if (CHILD(n, nc - 3).type !== SYM.except_clause) {
                throw syntaxError$1("malformed 'try' statement", n.range);
            }
            if (nexcept > 0) {
                var handlers = [];
                for (var i = 0; i < nexcept; ++i) {
                    handlers[i] = astForExceptClause(c, CHILD(n, 3 + i * 3), CHILD(n, 5 + i * 3));
                }
                var exceptSt = new TryExcept(body, handlers, orelse, n.range);
                if (!finally_) return exceptSt;
                /* if a 'finally' is present too, we nest the TryExcept within a
                    TryFinally to emulate try ... except ... finally */
                body = [exceptSt];
            }
            assert(finally_ !== null);
            return new TryFinally(body, finally_, n.range);
        }
        function astForDottedName(c, n) {
            REQ(n, SYM.dotted_name);
            var child = CHILD(n, 0);
            var id = new RangeAnnotated(child.value, child.range);
            var e = new Name(id, Load);
            for (var i = 2; i < NCH(n); i += 2) {
                var child_1 = CHILD(n, i);
                id = new RangeAnnotated(child_1.value, child_1.range);
                e = new Attribute(e, id, Load, n.range);
            }
            return e;
        }
        function astForDecorator(c, n) {
            /* decorator: '@' dotted_name [ '(' [arglist] ')' ] NEWLINE */
            REQ(n, SYM.decorator);
            REQ(CHILD(n, 0), Tokens.T_AT);
            REQ(CHILD(n, NCH(n) - 1), Tokens.T_NEWLINE);
            var nameExpr = astForDottedName(c, CHILD(n, 1));
            if (NCH(n) === 3) return nameExpr;else if (NCH(n) === 5) return new Call(nameExpr, [], [], null, null);else return astForCall(c, CHILD(n, 3), nameExpr);
        }
        function astForDecorators(c, n) {
            REQ(n, SYM.decorators);
            var decoratorSeq = [];
            for (var i = 0; i < NCH(n); ++i) {
                decoratorSeq[i] = astForDecorator(c, CHILD(n, i));
            }
            return decoratorSeq;
        }
        function astForDecorated(c, n) {
            REQ(n, SYM.decorated);
            var decoratorSeq = astForDecorators(c, CHILD(n, 0));
            assert(CHILD(n, 1).type === SYM.funcdef || CHILD(n, 1).type === SYM.classdef);
            var thing = null;
            if (CHILD(n, 1).type === SYM.funcdef) {
                thing = astForFuncdef(c, CHILD(n, 1), decoratorSeq);
            } else if (CHILD(n, 1).type === SYM.classdef) {
                thing = astForClassdef(c, CHILD(n, 1), decoratorSeq);
            } else {
                throw new Error("astForDecorated");
            }
            if (thing) {
                // FIXME: Pass into functions above?
                // thing.range = n.range;
            }
            return thing;
        }
        function astForWithVar(c, n) {
            REQ(n, SYM.with_var);
            return astForExpr(c, CHILD(n, 1));
        }
        function astForWithStmt(c, n) {
            /* with_stmt: 'with' test [ with_var ] ':' suite */
            var suiteIndex = 3; // skip with, test, :
            assert(n.type === SYM.with_stmt);
            var contextExpr = astForExpr(c, CHILD(n, 1));
            var optionalVars;
            if (CHILD(n, 2).type === SYM.with_var) {
                optionalVars = astForWithVar(c, CHILD(n, 2));
                setContext(c, optionalVars, Store, n);
                suiteIndex = 4;
            }
            return new WithStatement(contextExpr, optionalVars, astForSuite(c, CHILD(n, suiteIndex)), n.range);
        }
        function astForExecStmt(c, n) {
            var globals = null;
            var locals = null;
            var nchildren = NCH(n);
            assert(nchildren === 2 || nchildren === 4 || nchildren === 6);
            /* exec_stmt: 'exec' expr ['in' test [',' test]] */
            REQ(n, SYM.exec_stmt);
            var expr1 = astForExpr(c, CHILD(n, 1));
            if (nchildren >= 4) {
                globals = astForExpr(c, CHILD(n, 3));
            }
            if (nchildren === 6) {
                locals = astForExpr(c, CHILD(n, 5));
            }
            return new Exec(expr1, globals, locals, n.range);
        }
        function astForIfStmt(c, n) {
            /* if_stmt: 'if' test ':' suite ('elif' test ':' suite)*
                ['else' ':' suite]
            */
            REQ(n, SYM.if_stmt);
            if (NCH(n) === 4) return new IfStatement(astForExpr(c, CHILD(n, 1)), astForSuite(c, CHILD(n, 3)), [], n.range);
            var s = CHILD(n, 4).value;
            var decider = s.charAt(2); // elSe or elIf
            if (decider === 's') {
                return new IfStatement(astForExpr(c, CHILD(n, 1)), astForSuite(c, CHILD(n, 3)), astForSuite(c, CHILD(n, 6)), n.range);
            } else if (decider === 'i') {
                var nElif = NCH(n) - 4;
                var hasElse = false;
                var orelse = [];
                /* must reference the child nElif+1 since 'else' token is third, not
                    * fourth child from the end. */
                if (CHILD(n, nElif + 1).type === Tokens.T_NAME && CHILD(n, nElif + 1).value.charAt(2) === 's') {
                    hasElse = true;
                    nElif -= 3;
                }
                nElif /= 4;
                if (hasElse) {
                    orelse = [new IfStatement(astForExpr(c, CHILD(n, NCH(n) - 6)), astForSuite(c, CHILD(n, NCH(n) - 4)), astForSuite(c, CHILD(n, NCH(n) - 1)), CHILD(n, NCH(n) - 6).range)];
                    nElif--;
                }
                for (var i = 0; i < nElif; ++i) {
                    var off = 5 + (nElif - i - 1) * 4;
                    orelse = [new IfStatement(astForExpr(c, CHILD(n, off)), astForSuite(c, CHILD(n, off + 2)), orelse, CHILD(n, off).range)];
                }
                return new IfStatement(astForExpr(c, CHILD(n, 1)), astForSuite(c, CHILD(n, 3)), orelse, n.range);
            }
            throw new Error("unexpected token in 'if' statement");
        }
        function astForExprlist(c, n, context) {
            REQ(n, SYM.ExprList);
            var seq = [];
            for (var i = 0; i < NCH(n); i += 2) {
                var e = astForExpr(c, CHILD(n, i));
                seq[i / 2] = e;
                if (context) setContext(c, e, context, CHILD(n, i));
            }
            return seq;
        }
        function astForDelStmt(c, n) {
            REQ(n, SYM.del_stmt);
            return new DeleteStatement(astForExprlist(c, CHILD(n, 1), Del), n.range);
        }
        function astForGlobalStmt(c, n) {
            REQ(n, SYM.GlobalStmt);
            var s = [];
            for (var i = 1; i < NCH(n); i += 2) {
                s[(i - 1) / 2] = strobj(CHILD(n, i).value);
            }
            return new Global(s, n.range);
        }
        function astForNonLocalStmt(c, n) {
            REQ(n, SYM.NonLocalStmt);
            var s = [];
            for (var i = 1; i < NCH(n); i += 2) {
                s[(i - 1) / 2] = strobj(CHILD(n, i).value);
            }
            return new NonLocal(s, n.range);
        }
        function astForAssertStmt(c, n) {
            /* assert_stmt: 'assert' test [',' test] */
            REQ(n, SYM.assert_stmt);
            if (NCH(n) === 2) {
                return new Assert(astForExpr(c, CHILD(n, 1)), null, n.range);
            } else if (NCH(n) === 4) {
                return new Assert(astForExpr(c, CHILD(n, 1)), astForExpr(c, CHILD(n, 3)), n.range);
            }
            throw new Error("improper number of parts to assert stmt");
        }
        function aliasForImportName(c, n) {
            /*
                ImportSpecifier: NAME ['as' NAME]
                dotted_as_name: dotted_name ['as' NAME]
                dotted_name: NAME ('.' NAME)*
            */
            loop: while (true) {
                switch (n.type) {
                    case SYM.ImportSpecifier:
                        {
                            var str = null;
                            var nameNode = CHILD(n, 0);
                            var name_1 = strobj(nameNode.value);
                            var nameRange = nameNode.range;
                            if (NCH(n) === 3) {
                                str = CHILD(n, 2).value;
                            }
                            return new Alias(new RangeAnnotated(name_1, nameRange), str == null ? null : strobj(str));
                        }
                    case SYM.dotted_as_name:
                        if (NCH(n) === 1) {
                            n = CHILD(n, 0);
                            continue loop;
                        } else {
                            var a = aliasForImportName(c, CHILD(n, 0));
                            assert(!a.asname);
                            a.asname = strobj(CHILD(n, 2).value);
                            return a;
                        }
                    case SYM.dotted_name:
                        if (NCH(n) === 1) {
                            var nameNode = CHILD(n, 0);
                            var name_2 = strobj(nameNode.value);
                            var nameRange = nameNode.range;
                            return new Alias(new RangeAnnotated(name_2, nameRange), null);
                        } else {
                            // create a string of the form a.b.c
                            var str = '';
                            for (var i = 0; i < NCH(n); i += 2) {
                                str += CHILD(n, i).value + ".";
                            }
                            return new Alias(new RangeAnnotated(str.substr(0, str.length - 1), null), null);
                        }
                    case Tokens.T_STAR:
                        {
                            return new Alias(new RangeAnnotated("*", n.range), null);
                        }
                    case Tokens.T_NAME:
                        {
                            // Temporary.
                            return new Alias(new RangeAnnotated(n.value, n.range), null);
                        }
                    default:
                        {
                            throw syntaxError$1("unexpected import name " + grammarName(n.type), n.range);
                        }
                }
            }
        }
        function parseModuleSpecifier(c, moduleSpecifierNode) {
            REQ(moduleSpecifierNode, SYM.ModuleSpecifier);
            var N = NCH(moduleSpecifierNode);
            var ret = "";
            var range;
            for (var i = 0; i < N; ++i) {
                var child = CHILD(moduleSpecifierNode, i);
                ret = ret + parsestr(c, child.value);
                range = child.range;
            }
            return { value: ret, range: range };
        }
        function astForImportStmt(c, importStatementNode) {
            REQ(importStatementNode, SYM.import_stmt);
            var nameOrFrom = CHILD(importStatementNode, 0);
            if (nameOrFrom.type === SYM.import_name) {
                var n = CHILD(nameOrFrom, 1);
                REQ(n, SYM.dotted_as_names);
                var aliases = [];
                for (var i = 0; i < NCH(n); i += 2) {
                    aliases[i / 2] = aliasForImportName(c, CHILD(n, i));
                }
                return new ImportStatement(aliases, importStatementNode.range);
            } else if (nameOrFrom.type === SYM.import_from) {
                // let mod: Alias = null;
                var moduleSpec = void 0;
                var ndots = 0;
                var nchildren = void 0;
                var idx = void 0;
                for (idx = 1; idx < NCH(nameOrFrom); ++idx) {
                    var child = CHILD(nameOrFrom, idx);
                    var childType = child.type;
                    if (childType === SYM.dotted_name) {
                        // This should be dead code since we support ECMAScript 2015 modules.
                        throw syntaxError$1("unknown import statement " + grammarName(childType) + ".", child.range);
                        // mod = aliasForImportName(c, child);
                        // idx++;
                        // break;
                    } else if (childType === SYM.ModuleSpecifier) {
                        moduleSpec = parseModuleSpecifier(c, child);
                        break;
                    } else if (childType !== Tokens.T_DOT) {
                        // Let's be more specific...
                        throw syntaxError$1("unknown import statement " + grammarName(childType) + ".", child.range);
                        // break;
                    }
                    ndots++;
                }
                ++idx; // skip the import keyword
                var n = nameOrFrom;
                switch (CHILD(nameOrFrom, idx).type) {
                    case Tokens.T_STAR:
                        {
                            // from ... import
                            n = CHILD(nameOrFrom, idx);
                            nchildren = 1;
                            break;
                        }
                    case Tokens.T_LPAR:
                        {
                            // from ... import (x, y, z)
                            n = CHILD(n, idx + 1);
                            nchildren = NCH(n);
                            break;
                        }
                    case SYM.ImportList:
                        {
                            // from ... import x, y, z
                            n = CHILD(n, idx);
                            nchildren = NCH(n);
                            if (nchildren % 2 === 0) {
                                throw syntaxError$1("trailing comma not allowed without surrounding parentheses", n.range);
                            }
                        }
                }
                var aliases = [];
                if (n.type === Tokens.T_STAR) {
                    aliases[0] = aliasForImportName(c, n);
                } else {
                    REQ(n, SYM.import_from);
                    var importListNode = CHILD(n, FIND(n, SYM.ImportList));
                    astForImportList(c, importListNode, aliases);
                }
                // moduleName = mod ? mod.name : moduleName;
                assert(typeof moduleSpec.value === 'string');
                return new ImportFrom(new RangeAnnotated(moduleSpec.value, moduleSpec.range), aliases, ndots, importStatementNode.range);
            } else {
                throw syntaxError$1("unknown import statement " + grammarName(nameOrFrom.type) + ".", nameOrFrom.range);
            }
        }
        function astForImportList(c, importListNode, aliases) {
            REQ(importListNode, SYM.ImportList);
            var N = NCH(importListNode);
            for (var i = 0; i < N; i++) {
                var child = CHILD(importListNode, i);
                if (child.type === SYM.ImportSpecifier) {
                    aliases.push(aliasForImportName(c, child));
                }
            }
        }
        function astForTestlistGexp(c, n) {
            assert(n.type === SYM.testlist_gexp || n.type === SYM.argument);
            if (NCH(n) > 1 && CHILD(n, 1).type === SYM.gen_for) return astForGenexp(c, n);
            return astForTestlist(c, n);
        }
        function astForListcomp(c, n) {
            function countListFors(c, n) {
                var nfors = 0;
                var ch = CHILD(n, 1);
                count_list_for: while (true) {
                    nfors++;
                    REQ(ch, SYM.list_for);
                    if (NCH(ch) === 5) ch = CHILD(ch, 4);else return nfors;
                    count_list_iter: while (true) {
                        REQ(ch, SYM.list_iter);
                        ch = CHILD(ch, 0);
                        if (ch.type === SYM.list_for) continue count_list_for;else if (ch.type === SYM.list_if) {
                            if (NCH(ch) === 3) {
                                ch = CHILD(ch, 2);
                                continue count_list_iter;
                            } else return nfors;
                        }
                        break;
                    }
                    // FIXME: What does a break at the end of a function do?
                    break;
                }
                throw new Error("TODO: Should this be returning void 0?");
            }
            function countListIfs(c, n) {
                var nifs = 0;
                while (true) {
                    REQ(n, SYM.list_iter);
                    if (CHILD(n, 0).type === SYM.list_for) return nifs;
                    n = CHILD(n, 0);
                    REQ(n, SYM.list_if);
                    nifs++;
                    if (NCH(n) === 2) return nifs;
                    n = CHILD(n, 2);
                }
            }
            REQ(n, SYM.listmaker);
            assert(NCH(n) > 1);
            var elt = astForExpr(c, CHILD(n, 0));
            var nfors = countListFors(c, n);
            var listcomps = [];
            var ch = CHILD(n, 1);
            for (var i = 0; i < nfors; ++i) {
                REQ(ch, SYM.list_for);
                var forch = CHILD(ch, 1);
                var t = astForExprlist(c, forch, Store);
                var expression = astForTestlist(c, CHILD(ch, 3));
                var lc = void 0;
                if (NCH(forch) === 1) lc = new Comprehension(t[0], expression, []);else lc = new Comprehension(new Tuple(t, Store, ch.range), expression, []);
                if (NCH(ch) === 5) {
                    ch = CHILD(ch, 4);
                    var nifs = countListIfs(c, ch);
                    var ifs = [];
                    for (var j = 0; j < nifs; ++j) {
                        REQ(ch, SYM.list_iter);
                        ch = CHILD(ch, 0);
                        REQ(ch, SYM.list_if);
                        ifs[j] = astForExpr(c, CHILD(ch, 1));
                        if (NCH(ch) === 3) ch = CHILD(ch, 2);
                    }
                    if (ch.type === SYM.list_iter) ch = CHILD(ch, 0);
                    lc.ifs = ifs;
                }
                listcomps[i] = lc;
            }
            return new ListComp(elt, listcomps, n.range);
        }
        function astForUnaryExpr(c, n) {
            if (CHILD(n, 0).type === Tokens.T_MINUS && NCH(n) === 2) {
                var pfactor = CHILD(n, 1);
                if (pfactor.type === SYM.UnaryExpr && NCH(pfactor) === 1) {
                    var ppower = CHILD(pfactor, 0);
                    if (ppower.type === SYM.PowerExpr && NCH(ppower) === 1) {
                        var patom = CHILD(ppower, 0);
                        if (patom.type === SYM.AtomExpr) {
                            var pnum = CHILD(patom, 0);
                            if (pnum.type === Tokens.T_NUMBER) {
                                pnum.value = "-" + pnum.value;
                                return astForAtomExpr(c, patom);
                            }
                        }
                    }
                }
            }
            var expression = astForExpr(c, CHILD(n, 1));
            switch (CHILD(n, 0).type) {
                case Tokens.T_PLUS:
                    return new UnaryOp(UAdd, expression, n.range);
                case Tokens.T_MINUS:
                    return new UnaryOp(USub, expression, n.range);
                case Tokens.T_TILDE:
                    return new UnaryOp(Invert, expression, n.range);
            }
            throw new Error("unhandled UnaryExpr");
        }
        function astForForStmt(c, n) {
            var seq = [];
            REQ(n, SYM.for_stmt);
            if (NCH(n) === 9) {
                seq = astForSuite(c, CHILD(n, 8));
            }
            var nodeTarget = CHILD(n, 1);
            var _target = astForExprlist(c, nodeTarget, Store);
            var target;
            if (NCH(nodeTarget) === 1) target = _target[0];else target = new Tuple(_target, Store, n.range);
            return new ForStatement(target, astForTestlist(c, CHILD(n, 3)), astForSuite(c, CHILD(n, 5)), seq, n.range);
        }
        function astForCall(c, n, func) {
            /*
                arglist: (argument ',')* (argument [',']| '*' test [',' '**' test]
                        | '**' test)
                argument: [test '='] test [gen_for]        # Really [keyword '='] test
            */
            REQ(n, SYM.arglist);
            var nargs = 0;
            var nkeywords = 0;
            var ngens = 0;
            for (var i = 0; i < NCH(n); ++i) {
                var ch = CHILD(n, i);
                if (ch.type === SYM.argument) {
                    if (NCH(ch) === 1) nargs++;else if (CHILD(ch, 1).type === SYM.gen_for) ngens++;else nkeywords++;
                }
            }
            if (ngens > 1 || ngens && (nargs || nkeywords)) throw syntaxError$1("Generator expression must be parenthesized if not sole argument", n.range);
            if (nargs + nkeywords + ngens > 255) throw syntaxError$1("more than 255 arguments", n.range);
            var args = [];
            var keywords = [];
            nargs = 0;
            nkeywords = 0;
            var vararg = null;
            var kwarg = null;
            for (var i = 0; i < NCH(n); ++i) {
                var ch = CHILD(n, i);
                if (ch.type === SYM.argument) {
                    if (NCH(ch) === 1) {
                        if (nkeywords) throw syntaxError$1("non-keyword arg after keyword arg", n.range);
                        if (vararg) throw syntaxError$1("only named arguments may follow *expression", n.range);
                        args[nargs++] = astForExpr(c, CHILD(ch, 0));
                    } else if (CHILD(ch, 1).type === SYM.gen_for) args[nargs++] = astForGenexp(c, ch);else {
                        var e = astForExpr(c, CHILD(ch, 0));
                        if (e.constructor === Lambda) throw syntaxError$1("lambda cannot contain assignment", n.range);else if (e.constructor !== Name) throw syntaxError$1("keyword can't be an expression", n.range);
                        var key = e.id;
                        forbiddenCheck(c, CHILD(ch, 0), key.value, n.range);
                        for (var k = 0; k < nkeywords; ++k) {
                            var tmp = keywords[k].arg.value;
                            if (tmp === key.value) throw syntaxError$1("keyword argument repeated", n.range);
                        }
                        keywords[nkeywords++] = new Keyword(key, astForExpr(c, CHILD(ch, 2)));
                    }
                } else if (ch.type === Tokens.T_STAR) vararg = astForExpr(c, CHILD(n, ++i));else if (ch.type === Tokens.T_DOUBLESTAR) kwarg = astForExpr(c, CHILD(n, ++i));
            }
            // Convert keywords to a Dict, which is one arg
            var keywordDict = keywordsToDict(keywords);
            if (keywordDict.keys.length !== 0) {
                args.push(keywordDict);
            }
            return new Call(func, args, [], vararg, kwarg);
        }
        function keywordsToDict(keywords) {
            var keys = [];
            var values = [];
            for (var _i = 0, keywords_1 = keywords; _i < keywords_1.length; _i++) {
                var keyword = keywords_1[_i];
                values.push(keyword.value);
                keys.push(new Name(new RangeAnnotated(keyword.arg.value, keyword.arg.range), Load));
            }
            return new Dict(keys, values);
        }
        function astForTrailer(c, node, leftExpr) {
            /* trailer: '(' [arglist] ')' | '[' subscriptlist ']' | '.' NAME
                subscriptlist: subscript (',' subscript)* [',']
                subscript: '.' '.' '.' | test | [test] ':' [test] [sliceop]
                */
            var n = node;
            var childZero = CHILD(n, 0);
            var childOne = CHILD(n, 1);
            var childTwo = CHILD(n, 2);
            REQ(n, SYM.trailer);
            if (childZero.type === Tokens.T_LPAR) {
                if (NCH(n) === 2) {
                    return new Call(leftExpr, [], [], null, null);
                } else {
                    return astForCall(c, childOne, leftExpr);
                }
            } else if (childZero.type === Tokens.T_DOT) {
                return new Attribute(leftExpr, new RangeAnnotated(childOne.value, childOne.range), Load, n.range);
            } else {
                REQ(childZero, Tokens.T_LSQB);
                REQ(childTwo, Tokens.T_RSQB);
                var n_1 = childOne;
                if (NCH(n_1) === 1) return new Subscript(leftExpr, astForSlice(c, CHILD(n_1, 0)), Load, n_1.range);else {
                    /* The grammar is ambiguous here. The ambiguity is resolved
                        by treating the sequence as a tuple literal if there are
                        no slice features.
                    */
                    var simple = true;
                    var slices = [];
                    for (var j = 0; j < NCH(n_1); j += 2) {
                        var slc = astForSlice(c, CHILD(n_1, j));
                        if (slc.constructor !== Index) {
                            simple = false;
                        }
                        slices[j / 2] = slc;
                    }
                    if (!simple) {
                        return new Subscript(leftExpr, new ExtSlice(slices), Load, n_1.range);
                    }
                    var elts = [];
                    for (var j = 0; j < slices.length; ++j) {
                        var slc = slices[j];
                        if (slc instanceof Index) {
                            assert(slc.value !== null && slc.value !== undefined);
                            elts[j] = slc.value;
                        } else {
                            assert(slc instanceof Index);
                        }
                    }
                    var e = new Tuple(elts, Load, n_1.range);
                    return new Subscript(leftExpr, new Index(e), Load, n_1.range);
                }
            }
        }
        function astForFlowStmt(c, n) {
            REQ(n, SYM.flow_stmt);
            var ch = CHILD(n, 0);
            switch (ch.type) {
                case SYM.break_stmt:
                    return new BreakStatement(n.range);
                case SYM.continue_stmt:
                    return new ContinueStatement(n.range);
                case SYM.yield_stmt:
                    return new ExpressionStatement(astForExpr(c, CHILD(ch, 0)), n.range);
                case SYM.return_stmt:
                    if (NCH(ch) === 1) return new ReturnStatement(null, n.range);else return new ReturnStatement(astForTestlist(c, CHILD(ch, 1)), n.range);
                case SYM.raise_stmt:
                    {
                        if (NCH(ch) === 1) return new Raise(null, null, null, n.range);else if (NCH(ch) === 2) return new Raise(astForExpr(c, CHILD(ch, 1)), null, null, n.range);else if (NCH(ch) === 4) return new Raise(astForExpr(c, CHILD(ch, 1)), astForExpr(c, CHILD(ch, 3)), null, n.range);else if (NCH(ch) === 6) return new Raise(astForExpr(c, CHILD(ch, 1)), astForExpr(c, CHILD(ch, 3)), astForExpr(c, CHILD(ch, 5)), n.range);else {
                            throw new Error("unhandled flow statement");
                        }
                    }
                default:
                    {
                        throw new Error("unexpected flow_stmt");
                    }
            }
        }
        function astForArguments(c, n) {
            /* parameters: '(' [varargslist] ')'
                varargslist: (fpdef ['=' test] ',')* ('*' NAME [',' '**' NAME]
                    | '**' NAME) | fpdef ['=' test] (',' fpdef ['=' test])* [',']
            */
            var ch;
            var vararg = null;
            var kwarg = null;
            if (n.type === SYM.parameters) {
                if (NCH(n) === 2) return new Arguments([], null, null, []);
                n = CHILD(n, 1); // n is a varargslist here on out
            }
            REQ(n, SYM.varargslist);
            var args = [];
            var defaults = [];
            /* fpdef: NAME [':' IfExpr] | '(' fplist ')'
                fplist: fpdef (',' fpdef)* [',']
            */
            var foundDefault = false;
            var i = 0;
            var j = 0; // index for defaults
            var k = 0; // index for args
            // loop through the children of the varargslist
            while (i < NCH(n)) {
                ch = CHILD(n, i);
                switch (ch.type) {
                    // If it is a fpdef - act here
                    case SYM.fpdef:
                        var complexArgs = 0;
                        var parenthesized = false;
                        handle_fpdef: while (true) {
                            if (i + 1 < NCH(n) && CHILD(n, i + 1).type === Tokens.T_EQUAL) {
                                defaults[j++] = astForExpr(c, CHILD(n, i + 2));
                                i += 2;
                                foundDefault = true;
                            } else if (foundDefault) {
                                /* def f((x)=4): pass should raise an error.
                                    def f((x, (y))): pass will just incur the tuple unpacking warning. */
                                if (parenthesized && !complexArgs) throw syntaxError$1("parenthesized arg with default", n.range);
                                throw syntaxError$1("non-default argument follows default argument", n.range);
                            }
                            // For unpacking a tuple
                            if (NCH(ch) === 3 && ch.children[2].type === Tokens.T_RPAR) {
                                ch = CHILD(ch, 1);
                                // def foo((x)): is not complex, special case.
                                if (NCH(ch) !== 1) {
                                    throw syntaxError$1("tuple parameter unpacking has been removed", n.range);
                                } else {
                                    /* def foo((x)): setup for checking NAME below. */
                                    /* Loop because there can be many parens and tuple
                                        unpacking mixed in. */
                                    parenthesized = true;
                                    ch = CHILD(ch, 0);
                                    assert(ch.type === SYM.fpdef);
                                    continue handle_fpdef;
                                }
                            }
                            // childzero here is possibly the 'NAME' in fpdef: NAME [':' IfExpr]
                            var childZero = CHILD(ch, 0);
                            if (childZero.type === Tokens.T_NAME) {
                                forbiddenCheck(c, n, childZero.value, n.range);
                                var id = new RangeAnnotated(childZero.value, childZero.range);
                                /**
                                 * Setting the type of the param here, will be third child of fpdef if it exists
                                 * If it doesn't exist then set the type as null and have typescript attempt to infer it later
                                 */
                                var paramTypeNode = CHILD(ch, 2);
                                if (paramTypeNode) {
                                    var paramTypeExpr = astForExpr(c, paramTypeNode);
                                    args[k++] = new FunctionParamDef(new Name(id, Param), paramTypeExpr);
                                } else {
                                    args[k++] = new FunctionParamDef(new Name(id, Param));
                                }
                            }
                            i += 2;
                            if (parenthesized) throw syntaxError$1("parenthesized argument names are invalid", n.range);
                            break;
                        }
                        break;
                    case Tokens.T_STAR:
                        forbiddenCheck(c, CHILD(n, i + 1), CHILD(n, i + 1).value, n.range);
                        vararg = strobj(CHILD(n, i + 1).value);
                        i += 3;
                        break;
                    case Tokens.T_DOUBLESTAR:
                        forbiddenCheck(c, CHILD(n, i + 1), CHILD(n, i + 1).value, n.range);
                        kwarg = strobj(CHILD(n, i + 1).value);
                        i += 3;
                        break;
                    default:
                        {
                            throw new Error("unexpected node in varargslist");
                        }
                }
            }
            return new Arguments(args, vararg, kwarg, defaults);
        }
        function astForFuncdef(c, n, decoratorSeq) {
            /**
             * funcdef: ['export'] def' NAME parameters ['->' IfExpr] ':' suite
             */
            REQ(n, SYM.funcdef);
            var numberOfChildren = NCH(n);
            var ch1;
            var name;
            var args;
            // Name and args are 1 node further if 'export' exists
            if (numberOfChildren !== 8 && numberOfChildren !== 6) {
                ch1 = CHILD(n, 1);
                name = strobj(ch1.value);
                forbiddenCheck(c, ch1, name, n.range);
                args = astForArguments(c, CHILD(n, 2));
            } else {
                ch1 = CHILD(n, 2);
                name = strobj(ch1.value);
                forbiddenCheck(c, ch1, name, n.range);
                args = astForArguments(c, CHILD(n, 3));
            }
            // suite is either 4, 6 or 7, depending on whether functype exists
            var body;
            var returnType;
            // Neither Export nor FuncType exist
            if (numberOfChildren === 5) {
                body = astForSuite(c, CHILD(n, 4));
                returnType = null;
            } else if (numberOfChildren === 6) {
                body = astForSuite(c, CHILD(n, 5));
                returnType = null;
            } else if (numberOfChildren === 7) {
                returnType = astForExpr(c, CHILD(n, 4));
                body = astForSuite(c, CHILD(n, 6));
            } else if (numberOfChildren === 8) {
                returnType = astForExpr(c, CHILD(n, 5));
                body = astForSuite(c, CHILD(n, 7));
            } else {
                fail("Was expecting 5, 7 or 8 children, received " + numberOfChildren + " children");
            }
            return new FunctionDef(new RangeAnnotated(name, ch1.range), args, body, returnType, decoratorSeq, n.range);
        }
        function astForClassBases(c, n) {
            var numberOfChildren = NCH(n);
            assert(numberOfChildren > 0);
            REQ(n, SYM.testlist);
            if (numberOfChildren === 1) {
                return [astForExpr(c, CHILD(n, 0))];
            }
            return seqForTestlist(c, n);
        }
        function astForClassdef(c, node, decoratorSeq) {
            /**
             * ['export'] 'class' NAME ['(' [testlist] ')'] ':' suite
             */
            var n = node;
            var numberOfChildren = NCH(n);
            REQ(n, SYM.classdef);
            var nameNode;
            var className;
            var nameRange;
            if (numberOfChildren !== 5 && numberOfChildren !== 8) {
                if (numberOfChildren !== 7 || CHILD(n, 4).type !== Tokens.T_RPAR) {
                    nameNode = CHILD(n, 1);
                    forbiddenCheck(c, n, nameNode.value, n.range);
                    className = strobj(nameNode.value);
                    nameRange = nameNode.range;
                }
            } else {
                nameNode = CHILD(n, 2);
                forbiddenCheck(c, n, nameNode.value, n.range);
                className = strobj(nameNode.value);
                nameRange = nameNode.range;
            }
            // If grammar looks like 'class NAME : suite'
            if (numberOfChildren === 4) {
                return new ClassDef(new RangeAnnotated(className, nameRange), [], astForSuite(c, CHILD(n, 3)), decoratorSeq, n.range);
            }
            // If grammar looks like 'export class NAME : suite'
            if (numberOfChildren === 5) {}
            // temp

            // If grammar looks like 'export class NAME '(' ')' : suite'
            if (numberOfChildren === 7 && CHILD(n, 3).type !== Tokens.T_RPAR) {}
            // temp

            // If grammar looks like 'export class NAME '(' testlist ')' : suite '
            if (numberOfChildren === 8) {
                // temp
            }
            var c3 = CHILD(n, 3);
            // If grammar looks like 'class NAME '(' ')' : suite'
            if (c3.type === Tokens.T_RPAR) {
                return new ClassDef(new RangeAnnotated(className, nameRange), [], astForSuite(c, CHILD(n, 5)), decoratorSeq, n.range);
            }
            // Otherwise grammar looks like 'class NAME '(' testlist ')' : suite'
            // ClassBases are 'testlist'
            var bases = astForClassBases(c, c3);
            var s = astForSuite(c, CHILD(n, 6));
            return new ClassDef(new RangeAnnotated(className, nameRange), bases, s, decoratorSeq, n.range);
        }
        function astForLambdef(c, n) {
            var args;
            var expression;
            if (NCH(n) === 3) {
                args = new Arguments([], null, null, []);
                expression = astForExpr(c, CHILD(n, 2));
            } else {
                args = astForArguments(c, CHILD(n, 1));
                expression = astForExpr(c, CHILD(n, 3));
            }
            return new Lambda(args, expression, n.range);
        }
        function astForGenexp(c, n) {
            /* testlist_gexp: test ( gen_for | (',' test)* [','] )
                argument: [test '='] test [gen_for]       # Really [keyword '='] test */
            assert(n.type === SYM.testlist_gexp || n.type === SYM.argument);
            assert(NCH(n) > 1);
            function countGenFors(c, n) {
                var nfors = 0;
                var ch = CHILD(n, 1);
                count_gen_for: while (true) {
                    nfors++;
                    REQ(ch, SYM.gen_for);
                    if (NCH(ch) === 5) ch = CHILD(ch, 4);else return nfors;
                    count_gen_iter: while (true) {
                        REQ(ch, SYM.gen_iter);
                        ch = CHILD(ch, 0);
                        if (ch.type === SYM.gen_for) continue count_gen_for;else if (ch.type === SYM.gen_if) {
                            if (NCH(ch) === 3) {
                                ch = CHILD(ch, 2);
                                continue count_gen_iter;
                            } else return nfors;
                        }
                        break;
                    }
                    break;
                }
                throw new Error("logic error in countGenFors");
            }
            function countGenIfs(c, n) {
                var nifs = 0;
                while (true) {
                    REQ(n, SYM.gen_iter);
                    if (CHILD(n, 0).type === SYM.gen_for) return nifs;
                    n = CHILD(n, 0);
                    REQ(n, SYM.gen_if);
                    nifs++;
                    if (NCH(n) === 2) return nifs;
                    n = CHILD(n, 2);
                }
            }
            var elt = astForExpr(c, CHILD(n, 0));
            var nfors = countGenFors(c, n);
            var genexps = [];
            var ch = CHILD(n, 1);
            for (var i = 0; i < nfors; ++i) {
                REQ(ch, SYM.gen_for);
                var forch = CHILD(ch, 1);
                var t = astForExprlist(c, forch, Store);
                var expression = astForExpr(c, CHILD(ch, 3));
                var ge = void 0;
                if (NCH(forch) === 1) ge = new Comprehension(t[0], expression, []);else ge = new Comprehension(new Tuple(t, Store, ch.range), expression, []);
                if (NCH(ch) === 5) {
                    ch = CHILD(ch, 4);
                    var nifs = countGenIfs(c, ch);
                    var ifs = [];
                    for (var j = 0; j < nifs; ++j) {
                        REQ(ch, SYM.gen_iter);
                        ch = CHILD(ch, 0);
                        REQ(ch, SYM.gen_if);
                        expression = astForExpr(c, CHILD(ch, 1));
                        ifs[j] = expression;
                        if (NCH(ch) === 3) ch = CHILD(ch, 2);
                    }
                    if (ch.type === SYM.gen_iter) ch = CHILD(ch, 0);
                    ge.ifs = ifs;
                }
                genexps[i] = ge;
            }
            return new GeneratorExp(elt, genexps, n.range);
        }
        function astForWhileStmt(c, n) {
            /* while_stmt: 'while' test ':' suite ['else' ':' suite] */
            REQ(n, SYM.while_stmt);
            if (NCH(n) === 4) return new WhileStatement(astForExpr(c, CHILD(n, 1)), astForSuite(c, CHILD(n, 3)), [], n.range);else if (NCH(n) === 7) return new WhileStatement(astForExpr(c, CHILD(n, 1)), astForSuite(c, CHILD(n, 3)), astForSuite(c, CHILD(n, 6)), n.range);
            throw new Error("wrong number of tokens for 'while' stmt");
        }
        function astForAugassign(c, n) {
            REQ(n, SYM.augassign);
            n = CHILD(n, 0);
            switch (n.value.charAt(0)) {
                case '+':
                    return Add;
                case '-':
                    return Sub;
                case '/':
                    {
                        if (n.value.charAt(1) === '/') {
                            return FloorDiv;
                        } else {
                            return Div;
                        }
                    }
                case '%':
                    return Mod;
                case '<':
                    return LShift;
                case '>':
                    return RShift;
                case '&':
                    return BitAnd;
                case '^':
                    return BitXor;
                case '|':
                    return BitOr;
                case '*':
                    {
                        if (n.value.charAt(1) === '*') {
                            return Pow;
                        } else {
                            return Mult;
                        }
                    }
                default:
                    {
                        throw new Error("invalid augassign");
                    }
            }
        }
        function astForBinop(c, n) {
            /* Must account for a sequence of expressions.
                How should A op B op C by represented?
                BinOp(BinOp(A, op, B), op, C).
            */
            var result = new BinOp(astForExpr(c, CHILD(n, 0)), getOperator(CHILD(n, 1)), astForExpr(c, CHILD(n, 2)), n.range);
            var nops = (NCH(n) - 1) / 2;
            for (var i = 1; i < nops; ++i) {
                var nextOper = CHILD(n, i * 2 + 1);
                var tmp = astForExpr(c, CHILD(n, i * 2 + 2));
                result = new BinOp(result, getOperator(nextOper), tmp, nextOper.range);
            }
            return result;
        }
        function astForTestlist(c, n) {
            /* testlist_gexp: test (',' test)* [','] */
            /* testlist: test (',' test)* [','] */
            /* testlist_safe: test (',' test)+ [','] */
            /* testlist1: test (',' test)* */
            assert(NCH(n) > 0);
            if (n.type === SYM.testlist_gexp) {
                if (NCH(n) > 1) {
                    assert(CHILD(n, 1).type !== SYM.gen_for);
                }
            } else {
                assert(n.type === SYM.testlist || n.type === SYM.testlist_safe || n.type === SYM.testlist1);
            }
            if (NCH(n) === 1) {
                return astForExpr(c, CHILD(n, 0));
            } else {
                return new Tuple(seqForTestlist(c, n), Load, n.range);
            }
        }
        function astForExprStmt(c, node) {
            // Prevent assignment.
            var n = node;
            REQ(n, SYM.ExprStmt);
            if (NCH(n) === 1) {
                return new ExpressionStatement(astForTestlist(c, CHILD(n, 0)), n.range);
            } else if (CHILD(n, 1).type === SYM.augassign) {
                var ch = CHILD(n, 0);
                var expr1 = astForTestlist(c, ch);
                switch (expr1.constructor) {
                    case GeneratorExp:
                        throw syntaxError$1("augmented assignment to generator expression not possible", n.range);
                    case Yield:
                        throw syntaxError$1("augmented assignment to yield expression not possible", n.range);
                    case Name:
                        {
                            var varName = expr1.id;
                            forbiddenCheck(c, ch, varName.value, n.range);
                            break;
                        }
                    case Attribute:
                    case Subscript:
                        break;
                    default:
                        throw syntaxError$1("illegal expression for augmented assignment", n.range);
                }
                setContext(c, expr1, Store, ch);
                ch = CHILD(n, 2);
                var expr2 = void 0;
                if (ch.type === SYM.testlist) {
                    expr2 = astForTestlist(c, ch);
                } else expr2 = astForExpr(c, ch);
                return new AugAssign(expr1, astForAugassign(c, CHILD(n, 1)), expr2, n.range);
            } else if (CHILD(n, 1).type === SYM.annasign) {
                // annasign
                // ':' 'IfExpr' ['=' 'IfExpr]
                var ch = CHILD(n, 0);
                var annasignChild = CHILD(n, 1);
                var type = astForExpr(c, CHILD(annasignChild, 1));
                var eq = CHILD(annasignChild, 2); // Equals sign
                if (eq) {
                    REQ(eq, Tokens.T_EQUAL);
                    var variable = [astForTestlist(c, ch)]; // variable is the first node (before the annasign)
                    var valueNode = CHILD(annasignChild, 3);
                    var value = void 0;
                    if (valueNode.type === SYM.testlist) {
                        value = astForTestlist(c, valueNode);
                    } else {
                        value = astForExpr(c, valueNode);
                    }
                    return new Assign(variable, value, n.range, eq.range, type);
                } else {
                    return new AnnAssign(type, astForTestlist(c, ch), n.range);
                }
            } else {
                // normal assignment
                var eq = CHILD(n, 1);
                REQ(eq, Tokens.T_EQUAL);
                var targets = [];
                var N = NCH(n);
                for (var i = 0; i < N - 2; i += 2) {
                    var ch = CHILD(n, i);
                    if (ch.type === SYM.YieldExpr) throw syntaxError$1("assignment to yield expression not possible", n.range);
                    var e = astForTestlist(c, ch);
                    setContext(c, e, Store, CHILD(n, i));
                    targets[i / 2] = e;
                }
                var value = CHILD(n, N - 1);
                var expression = void 0;
                if (value.type === SYM.testlist) expression = astForTestlist(c, value);else expression = astForExpr(c, value);
                return new Assign(targets, expression, n.range, eq.range);
            }
        }
        function astForIfexpr(c, n) {
            assert(NCH(n) === 5);
            return new IfExp(astForExpr(c, CHILD(n, 2)), astForExpr(c, CHILD(n, 0)), astForExpr(c, CHILD(n, 4)), n.range);
        }
        // escape() was deprecated in JavaScript 1.5. Use encodeURI or encodeURIComponent instead.
        function escape(s) {
            return encodeURIComponent(s);
        }
        /**
         * s is a python-style string literal, including quote characters and u/r/b
         * prefixes. Returns decoded string object.
         */
        function parsestr(c, s) {
            // const encodeUtf8 = function(s) { return unescape(encodeURIComponent(s)); };
            var decodeUtf8 = function (s) {
                return decodeURIComponent(escape(s));
            };
            var decodeEscape = function (s, quote) {
                var len = s.length;
                var ret = '';
                for (var i = 0; i < len; ++i) {
                    var c_1 = s.charAt(i);
                    if (c_1 === '\\') {
                        ++i;
                        c_1 = s.charAt(i);
                        if (c_1 === 'n') ret += "\n";else if (c_1 === '\\') ret += "\\";else if (c_1 === 't') ret += "\t";else if (c_1 === 'r') ret += "\r";else if (c_1 === 'b') ret += "\b";else if (c_1 === 'f') ret += "\f";else if (c_1 === 'v') ret += "\v";else if (c_1 === '0') ret += "\0";else if (c_1 === '"') ret += '"';else if (c_1 === '\'') ret += '\'';else if (c_1 === '\n') {} else if (c_1 === 'x') {
                            var d0 = s.charAt(++i);
                            var d1 = s.charAt(++i);
                            ret += String.fromCharCode(parseInt(d0 + d1, 16));
                        } else if (c_1 === 'u' || c_1 === 'U') {
                            var d0 = s.charAt(++i);
                            var d1 = s.charAt(++i);
                            var d2 = s.charAt(++i);
                            var d3 = s.charAt(++i);
                            ret += String.fromCharCode(parseInt(d0 + d1, 16), parseInt(d2 + d3, 16));
                        } else {
                            // Leave it alone
                            ret += "\\" + c_1;
                        }
                    } else {
                        ret += c_1;
                    }
                }
                return ret;
            };
            var quote = s.charAt(0);
            var rawmode = false;
            if (quote === 'u' || quote === 'U') {
                s = s.substr(1);
                quote = s.charAt(0);
            } else if (quote === 'r' || quote === 'R') {
                s = s.substr(1);
                quote = s.charAt(0);
                rawmode = true;
            }
            assert(quote !== 'b' && quote !== 'B', "todo; haven't done b'' strings yet");
            assert(quote === "'" || quote === '"' && s.charAt(s.length - 1) === quote);
            s = s.substr(1, s.length - 2);
            if (s.length >= 4 && s.charAt(0) === quote && s.charAt(1) === quote) {
                assert(s.charAt(s.length - 1) === quote && s.charAt(s.length - 2) === quote);
                s = s.substr(2, s.length - 4);
            }
            if (rawmode || s.indexOf('\\') === -1) {
                return strobj(decodeUtf8(s));
            }
            return strobj(decodeEscape(s, quote));
        }
        /**
         *
         */
        function parsestrplus(c, n) {
            REQ(CHILD(n, 0), Tokens.T_STRING);
            var ret = "";
            for (var i = 0; i < NCH(n); ++i) {
                var child = CHILD(n, i);
                try {
                    ret = ret + parsestr(c, child.value);
                } catch (x) {
                    throw syntaxError$1("invalid string (possibly contains a unicode character)", child.range);
                }
            }
            return ret;
        }
        function parsenumber(c, s, range) {
            var endChar = s.charAt(s.length - 1);
            if (endChar === 'j' || endChar === 'J') {
                throw syntaxError$1("complex numbers are currently unsupported", range);
            }
            if (s.indexOf('.') !== -1) {
                return floatAST(s);
            }
            // Handle integers of various bases
            var tmp = s;
            var value;
            var radix = 10;
            var neg = false;
            if (s.charAt(0) === '-') {
                tmp = s.substr(1);
                neg = true;
            }
            if (tmp.charAt(0) === '0' && (tmp.charAt(1) === 'x' || tmp.charAt(1) === 'X')) {
                // Hex
                tmp = tmp.substring(2);
                value = parseInt(tmp, 16);
                radix = 16;
            } else if (s.indexOf('e') !== -1 || s.indexOf('E') !== -1) {
                // Float with exponent (needed to make sure e/E wasn't hex first)
                return floatAST(s);
            } else if (tmp.charAt(0) === '0' && (tmp.charAt(1) === 'b' || tmp.charAt(1) === 'B')) {
                // Binary
                tmp = tmp.substring(2);
                value = parseInt(tmp, 2);
                radix = 2;
            } else if (tmp.charAt(0) === '0') {
                if (tmp === "0") {
                    // Zero
                    value = 0;
                } else {
                    // Octal (Leading zero, but not actually zero)
                    if (endChar === 'l' || endChar === 'L') {
                        return longAST(s.substr(0, s.length - 1), 8);
                    } else {
                        radix = 8;
                        tmp = tmp.substring(1);
                        if (tmp.charAt(0) === 'o' || tmp.charAt(0) === 'O') {
                            tmp = tmp.substring(1);
                        }
                        value = parseInt(tmp, 8);
                    }
                }
            } else {
                // Decimal
                if (endChar === 'l' || endChar === 'L') {
                    return longAST(s.substr(0, s.length - 1), radix);
                } else {
                    value = parseInt(tmp, radix);
                }
            }
            // Convert to long
            if (value > LONG_THRESHOLD && Math.floor(value) === value && s.indexOf('e') === -1 && s.indexOf('E') === -1) {
                // TODO: Does radix zero make sense?
                return longAST(s, 0);
            }
            if (endChar === 'l' || endChar === 'L') {
                return longAST(s.substr(0, s.length - 1), radix);
            } else {
                if (neg) {
                    return intAST(-value);
                } else {
                    return intAST(value);
                }
            }
        }
        function astForSlice(c, node) {
            var n = node;
            REQ(n, SYM.subscript);
            var ch = CHILD(n, 0);
            var lower = null;
            var upper = null;
            var step = null;
            if (ch.type === Tokens.T_DOT) {
                return new Ellipsis();
            }
            if (NCH(n) === 1 && ch.type === SYM.IfExpr) {
                return new Index(astForExpr(c, ch));
            }
            if (ch.type === SYM.IfExpr) {
                lower = astForExpr(c, ch);
            }
            if (ch.type === Tokens.T_COLON) {
                if (NCH(n) > 1) {
                    var n2 = CHILD(n, 1);
                    if (n2.type === SYM.IfExpr) upper = astForExpr(c, n2);
                }
            } else if (NCH(n) > 2) {
                var n2 = CHILD(n, 2);
                if (n2.type === SYM.IfExpr) {
                    upper = astForExpr(c, n2);
                }
            }
            ch = CHILD(n, NCH(n) - 1);
            if (ch.type === SYM.sliceop) {
                if (NCH(ch) === 1) {
                    ch = CHILD(ch, 0);
                    step = new Name(new RangeAnnotated("None", null), Load);
                } else {
                    ch = CHILD(ch, 1);
                    if (ch.type === SYM.IfExpr) step = astForExpr(c, ch);
                }
            }
            return new Slice(lower, upper, step);
        }
        function astForAtomExpr(c, n) {
            var c0 = CHILD(n, 0);
            switch (c0.type) {
                case Tokens.T_NAME:
                    // All names start in Load context, but may be changed later
                    return new Name(new RangeAnnotated(c0.value, c0.range), Load);
                case Tokens.T_STRING:
                    {
                        // FIXME: Owing to the way that Python allows string concatenation, this is imprecise.
                        return new Str(new RangeAnnotated(parsestrplus(c, n), n.range));
                    }
                case Tokens.T_NUMBER:
                    {
                        return new Num(new RangeAnnotated(parsenumber(c, c0.value, c0.range), n.range));
                    }
                case Tokens.T_LPAR:
                    {
                        var c1 = CHILD(n, 1);
                        if (c1.type === Tokens.T_RPAR) {
                            return new Tuple([], Load, n.range);
                        }
                        if (c1.type === SYM.YieldExpr) {
                            return astForExpr(c, c1);
                        }
                        if (NCH(c1) > 1 && CHILD(c1, 1).type === SYM.gen_for) {
                            return astForGenexp(c, c1);
                        }
                        return astForTestlistGexp(c, c1);
                    }
                case Tokens.T_LSQB:
                    {
                        var c1 = CHILD(n, 1);
                        if (c1.type === Tokens.T_RSQB) return new List([], Load, n.range);
                        REQ(c1, SYM.listmaker);
                        if (NCH(c1) === 1 || CHILD(c1, 1).type === Tokens.T_COMMA) return new List(seqForTestlist(c, c1), Load, n.range);else return astForListcomp(c, c1);
                    }
                case Tokens.T_LBRACE:
                    {
                        /* dictmaker: test ':' test (',' test ':' test)* [','] */
                        var c1 = CHILD(n, 1);
                        var N = NCH(c1);
                        // var size = Math.floor((NCH(ch) + 1) / 4); // + 1 for no trailing comma case
                        var keys = [];
                        var values = [];
                        for (var i = 0; i < N; i += 4) {
                            keys[i / 4] = astForExpr(c, CHILD(c1, i));
                            values[i / 4] = astForExpr(c, CHILD(c1, i + 2));
                        }
                        return new Dict(keys, values, n.range);
                    }
                case Tokens.T_BACKQUOTE:
                    {
                        throw syntaxError$1("backquote not supported, use repr()", n.range);
                    }
                default:
                    {
                        throw new Error("unhandled atom '" + grammarName(c0.type) + "'");
                    }
            }
        }
        function astForPowerExpr(c, node) {
            var n = node;
            REQ(n, SYM.PowerExpr);
            var N = NCH(n);
            var NminusOne = N - 1;
            var e = astForAtomExpr(c, CHILD(n, 0));
            if (N === 1) return e;
            for (var i = 1; i < N; ++i) {
                var ch = CHILD(n, i);
                if (ch.type !== SYM.trailer) {
                    break;
                }
                e = astForTrailer(c, ch, e);
            }
            if (CHILD(n, NminusOne).type === SYM.UnaryExpr) {
                var f = astForExpr(c, CHILD(n, NminusOne));
                return new BinOp(e, { op: Pow, range: null }, f, n.range);
            } else {
                return e;
            }
        }
        function astForExpr(c, n) {
            LOOP: while (true) {
                switch (n.type) {
                    case SYM.IfExpr:
                    case SYM.old_test:
                        if (CHILD(n, 0).type === SYM.LambdaExpr || CHILD(n, 0).type === SYM.old_LambdaExpr) return astForLambdef(c, CHILD(n, 0));else if (NCH(n) > 1) return astForIfexpr(c, n);
                    // fallthrough
                    case SYM.OrExpr:
                    case SYM.AndExpr:
                        if (NCH(n) === 1) {
                            n = CHILD(n, 0);
                            continue LOOP;
                        }
                        var seq = [];
                        for (var i = 0; i < NCH(n); i += 2) {
                            seq[i / 2] = astForExpr(c, CHILD(n, i));
                        }
                        if (CHILD(n, 1).value === "and") {
                            return new BoolOp(And, seq, n.range);
                        }
                        assert(CHILD(n, 1).value === "or");
                        return new BoolOp(Or, seq, n.range);
                    case SYM.NotExpr:
                        if (NCH(n) === 1) {
                            n = CHILD(n, 0);
                            continue LOOP;
                        } else {
                            return new UnaryOp(Not, astForExpr(c, CHILD(n, 1)), n.range);
                        }
                    case SYM.ComparisonExpr:
                        if (NCH(n) === 1) {
                            n = CHILD(n, 0);
                            continue LOOP;
                        } else {
                            var ops = [];
                            var cmps = [];
                            for (var i = 1; i < NCH(n); i += 2) {
                                ops[(i - 1) / 2] = astForCompOp(c, CHILD(n, i));
                                cmps[(i - 1) / 2] = astForExpr(c, CHILD(n, i + 1));
                            }
                            return new Compare(astForExpr(c, CHILD(n, 0)), ops, cmps, n.range);
                        }
                    case SYM.ArithmeticExpr:
                    case SYM.GeometricExpr:
                    case SYM.ShiftExpr:
                    case SYM.BitwiseOrExpr:
                    case SYM.BitwiseXorExpr:
                    case SYM.BitwiseAndExpr:
                        if (NCH(n) === 1) {
                            n = CHILD(n, 0);
                            continue LOOP;
                        }
                        return astForBinop(c, n);
                    case SYM.YieldExpr:
                        var exp = null;
                        if (NCH(n) === 2) {
                            exp = astForTestlist(c, CHILD(n, 1));
                        }
                        return new Yield(exp, n.range);
                    case SYM.UnaryExpr:
                        if (NCH(n) === 1) {
                            n = CHILD(n, 0);
                            continue LOOP;
                        }
                        return astForUnaryExpr(c, n);
                    case SYM.PowerExpr:
                        return astForPowerExpr(c, n);
                    default:
                        {
                            throw new Error("unhandled expr" /*, "n.type: %d", n.type*/);
                        }
                }
            }
        }
        function astForPrintStmt(c, n) {
            var start = 1;
            var dest = null;
            REQ(n, SYM.print_stmt);
            if (NCH(n) >= 2 && CHILD(n, 1).type === Tokens.T_RIGHTSHIFT) {
                dest = astForExpr(c, CHILD(n, 2));
                start = 4;
            }
            var seq = [];
            for (var i = start, j = 0; i < NCH(n); i += 2, ++j) {
                seq[j] = astForExpr(c, CHILD(n, i));
            }
            var nl = CHILD(n, NCH(n) - 1).type === Tokens.T_COMMA ? false : true;
            return new Print(dest, seq, nl, n.range);
        }
        function astForStmt(c, n) {
            if (n.type === SYM.stmt) {
                assert(NCH(n) === 1);
                n = CHILD(n, 0);
            }
            if (n.type === SYM.simple_stmt) {
                assert(numStmts(n) === 1);
                n = CHILD(n, 0);
            }
            if (n.type === SYM.small_stmt) {
                REQ(n, SYM.small_stmt);
                n = CHILD(n, 0);
                switch (n.type) {
                    case SYM.ExprStmt:
                        return astForExprStmt(c, n);
                    case SYM.print_stmt:
                        return astForPrintStmt(c, n);
                    case SYM.del_stmt:
                        return astForDelStmt(c, n);
                    case SYM.pass_stmt:
                        return new Pass(n.range);
                    case SYM.flow_stmt:
                        return astForFlowStmt(c, n);
                    case SYM.import_stmt:
                        return astForImportStmt(c, n);
                    case SYM.GlobalStmt:
                        return astForGlobalStmt(c, n);
                    case SYM.NonLocalStmt:
                        return astForNonLocalStmt(c, n);
                    case SYM.exec_stmt:
                        return astForExecStmt(c, n);
                    case SYM.assert_stmt:
                        return astForAssertStmt(c, n);
                    default:
                        {
                            throw new Error("unhandled small_stmt");
                        }
                }
            } else {
                var ch = CHILD(n, 0);
                REQ(n, SYM.compound_stmt);
                switch (ch.type) {
                    case SYM.if_stmt:
                        return astForIfStmt(c, ch);
                    case SYM.while_stmt:
                        return astForWhileStmt(c, ch);
                    case SYM.for_stmt:
                        return astForForStmt(c, ch);
                    case SYM.try_stmt:
                        return astForTryStmt(c, ch);
                    case SYM.with_stmt:
                        return astForWithStmt(c, ch);
                    case SYM.funcdef:
                        return astForFuncdef(c, ch, []);
                    case SYM.classdef:
                        return astForClassdef(c, ch, []);
                    case SYM.decorated:
                        return astForDecorated(c, ch);
                    default:
                        {
                            throw new Error("unhandled compound_stmt");
                        }
                }
            }
        }

        function astFromParse(n) {
            var c = new Compiling("utf-8");
            var stmts = [];
            var k = 0;
            for (var i = 0; i < NCH(n) - 1; ++i) {
                var ch = CHILD(n, i);
                if (n.type === Tokens.T_NEWLINE) continue;
                REQ(ch, SYM.stmt);
                var num = numStmts(ch);
                if (num === 1) {
                    stmts[k++] = astForStmt(c, ch);
                } else {
                    ch = CHILD(ch, 0);
                    REQ(ch, SYM.simple_stmt);
                    for (var j = 0; j < num; ++j) {
                        stmts[k++] = astForStmt(c, CHILD(ch, j * 2));
                    }
                }
            }
            return stmts;
            /*
            switch (n.type) {
                case SYM.file_input:
                case SYM.eval_input: {
                    throw new Error("todo;");
                }
                case SYM.single_input: {
                    throw new Error("todo;");
                }
                default: {
                    throw new Error("todo;");
                }
            }
            */
        }
        function astDump(node) {
            var _format = function (node) {
                if (node === null) {
                    return "None";
                } else if (node['prototype'] && node['prototype']._astname !== undefined && node['prototype']._isenum) {
                    // TODO: Replace the _isenum classes with real TypeScript enum.
                    // TODO: Why do we have the parens?
                    return node['prototype']._astname + "()";
                } else if (node['_astname'] !== undefined) {
                    var fields = [];
                    for (var i = 0; i < node['_fields'].length; i += 2) {
                        var a = node['_fields'][i]; // field name
                        var b = node['_fields'][i + 1](node); // field getter func
                        fields.push([a, _format(b)]);
                    }
                    var attrs = [];
                    for (var i = 0; i < fields.length; ++i) {
                        var field = fields[i];
                        attrs.push(field[0] + "=" + field[1].replace(/^\s+/, ''));
                    }
                    var fieldstr = attrs.join(',');
                    return node['_astname'] + "(" + fieldstr + ")";
                } else if (Array.isArray(node)) {
                    var elems = [];
                    for (var i = 0; i < node.length; ++i) {
                        var x = node[i];
                        elems.push(_format(x));
                    }
                    var elemsstr = elems.join(',');
                    return "[" + elemsstr.replace(/^\s+/, '') + "]";
                } else {
                    var ret = void 0;
                    if (node === true) ret = "True";else if (node === false) ret = "False";else ret = "" + node;
                    return ret;
                }
            };
            return _format(node);
        }

        /* Flags for def-use information */
        var DEF_GLOBAL = 1 << 0; /* global stmt */
        var DEF_LOCAL = 2 << 0; /* assignment in code block */
        var DEF_PARAM = 2 << 1; /* formal parameter */
        var USE = 2 << 2; /* name is used */
        /* parameter is star arg */
        /* parameter is star-star arg */
        /* name defined in tuple in parameters */
        /* name used but not defined in nested block */
        /* free variable is actually implicit global */
        var DEF_FREE_CLASS = 2 << 8; /* free variable from class's method */
        var DEF_IMPORT = 2 << 9; /* assignment occurred via import */
        var DEF_BOUND = DEF_LOCAL | DEF_PARAM | DEF_IMPORT;
        /* GLOBAL_EXPLICIT and GLOBAL_IMPLICIT are used internally by the symbol
           table.  GLOBAL is returned from PyST_GetScope() for either of them.
           It is stored in ste_symbols at bits 12-14.
        */
        var SCOPE_OFF = 11;
        var SCOPE_MASK = 7;
        var LOCAL = 1;
        var GLOBAL_EXPLICIT = 2;
        var GLOBAL_IMPLICIT = 3;
        var FREE = 4;
        var CELL = 5;
        /* The following three names are used for the ste_unoptimized bit field */

        /* top-level names, including eval and exec */

        var ModuleBlock = 'module';
        var FunctionBlock = 'function';
        var ClassBlock = 'class';

        function dictUpdate(a, b) {
            for (var kb in b) {
                if (b.hasOwnProperty(kb)) {
                    a[kb] = b[kb];
                }
            }
        }

        /**
         * @param priv
         * @param name
         */
        function mangleName(priv, name) {
            var strpriv = null;
            if (priv === null || name === null || name.charAt(0) !== '_' || name.charAt(1) !== '_') {
                return name;
            }
            // don't mangle dunder (double underscore) names e.g. __id__.
            if (name.charAt(name.length - 1) === '_' && name.charAt(name.length - 2) === '_') {
                return name;
            }
            // don't mangle classes that are all _ (obscure much?)
            strpriv = priv;
            strpriv.replace(/_/g, '');
            if (strpriv === '') {
                return name;
            }
            strpriv = priv;
            strpriv.replace(/^_*/, '');
            strpriv = '_' + strpriv + name;
            return strpriv;
        }

        var Symbol$1 = function () {
            /**
             * @param name
             * @param flags
             * @param namespaces
             */
            function Symbol(name, flags, namespaces) {
                this.__name = name;
                this.__flags = flags;
                this.__scope = flags >> SCOPE_OFF & SCOPE_MASK;
                this.__namespaces = namespaces || [];
            }
            Symbol.prototype.get_name = function () {
                return this.__name;
            };
            Symbol.prototype.is_referenced = function () {
                return !!(this.__flags & USE);
            };
            Symbol.prototype.is_parameter = function () {
                return !!(this.__flags & DEF_PARAM);
            };
            Symbol.prototype.is_global = function () {
                return this.__scope === GLOBAL_IMPLICIT || this.__scope === GLOBAL_EXPLICIT;
            };
            Symbol.prototype.is_declared_global = function () {
                return this.__scope === GLOBAL_EXPLICIT;
            };
            Symbol.prototype.is_local = function () {
                return !!(this.__flags & DEF_BOUND);
            };
            Symbol.prototype.is_free = function () {
                return this.__scope === FREE;
            };
            Symbol.prototype.is_imported = function () {
                return !!(this.__flags & DEF_IMPORT);
            };
            Symbol.prototype.is_assigned = function () {
                return !!(this.__flags & DEF_LOCAL);
            };
            Symbol.prototype.is_namespace = function () {
                return this.__namespaces && this.__namespaces.length > 0;
            };
            Symbol.prototype.get_namespaces = function () {
                return this.__namespaces;
            };
            return Symbol;
        }();

        var astScopeCounter = 0;
        /**
         * A SymbolTableScope is created for nodes in the AST.
         * It is created only when the SymbolTable enters a block.
         */
        var SymbolTableScope = function () {
            /**
             * @param table
             * @param name The name of the node defining the scope.
             * @param blockType
             * @param astNode
             * @param range
             */
            function SymbolTableScope(table, name, blockType, astNode, range) {
                /**
                 * A mapping from the name of a symbol to its flags.
                 */
                this.symFlags = {};
                /**
                 * A list of (local) variables that exists in the current scope.
                 * This is populated by the addDef method in SymbolTable.
                 * e.g. Name, FunctionDef, ClassDef, Global?, Lambda, Alias.
                 * Note that global variables are maintained in the SymbolTable to which we have access.
                 */
                this.varnames = [];
                this.children = [];
                this.table = table;
                this.name = name;
                this.blockType = blockType;
                astNode.scopeId = astScopeCounter++;
                table.stss[astNode.scopeId] = this;
                this.range = range;
                if (table.cur && (table.cur.isNested || table.cur.blockType === FunctionBlock)) {
                    this.isNested = true;
                } else {
                    this.isNested = false;
                }
                this.hasFree = false;
                this.childHasFree = false; // true if child block has free vars including free refs to globals
                this.generator = false;
                this.varargs = false;
                this.varkeywords = false;
                this.returnsValue = false;
                // cache of Symbols for returning to other parts of code
                this.symbols = {};
            }
            SymbolTableScope.prototype.get_type = function () {
                return this.blockType;
            };
            SymbolTableScope.prototype.get_name = function () {
                return this.name;
            };
            SymbolTableScope.prototype.get_range = function () {
                return this.range;
            };
            SymbolTableScope.prototype.is_nested = function () {
                return this.isNested;
            };
            SymbolTableScope.prototype.has_children = function () {
                return this.children.length > 0;
            };
            SymbolTableScope.prototype.get_identifiers = function () {
                return this._identsMatching(function (x) {
                    return true;
                });
            };
            SymbolTableScope.prototype.lookup = function (name) {
                var sym;
                if (!this.symbols.hasOwnProperty(name)) {
                    var flags = this.symFlags[name];
                    var namespaces = this.__check_children(name);
                    sym = this.symbols[name] = new Symbol$1(name, flags, namespaces);
                } else {
                    sym = this.symbols[name];
                }
                return sym;
            };
            SymbolTableScope.prototype.__check_children = function (name) {
                // print("  check_children:", name);
                var ret = [];
                for (var i = 0; i < this.children.length; ++i) {
                    var child = this.children[i];
                    if (child.name === name) ret.push(child);
                }
                return ret;
            };
            /**
             * Looks in the bindings for this scope and returns the names of the nodes that match the mask filter.
             */
            SymbolTableScope.prototype._identsMatching = function (filter) {
                var ret = [];
                for (var k in this.symFlags) {
                    if (this.symFlags.hasOwnProperty(k)) {
                        if (filter(this.symFlags[k])) ret.push(k);
                    }
                }
                ret.sort();
                return ret;
            };
            /**
             * Returns the names of parameters (DEF_PARAM) for function scopes.
             */
            SymbolTableScope.prototype.get_parameters = function () {
                assert(this.get_type() === 'function', "get_parameters only valid for function scopes");
                if (!this._funcParams) {
                    this._funcParams = this._identsMatching(function (x) {
                        return !!(x & DEF_PARAM);
                    });
                }
                return this._funcParams;
            };
            /**
             * Returns the names of local variables (DEF_BOUND) for function scopes.
             */
            SymbolTableScope.prototype.get_locals = function () {
                assert(this.get_type() === 'function', "get_locals only valid for function scopes");
                if (!this._funcLocals) {
                    this._funcLocals = this._identsMatching(function (x) {
                        return !!(x & DEF_BOUND);
                    });
                }
                return this._funcLocals;
            };
            /**
             * Returns the names of global variables for function scopes.
             */
            SymbolTableScope.prototype.get_globals = function () {
                assert(this.get_type() === 'function', "get_globals only valid for function scopes");
                if (!this._funcGlobals) {
                    this._funcGlobals = this._identsMatching(function (x) {
                        var masked = x >> SCOPE_OFF & SCOPE_MASK;
                        return masked === GLOBAL_IMPLICIT || masked === GLOBAL_EXPLICIT;
                    });
                }
                return this._funcGlobals;
            };
            /**
             * Returns the names of free variables for function scopes.
             */
            SymbolTableScope.prototype.get_frees = function () {
                assert(this.get_type() === 'function', "get_frees only valid for function scopes");
                if (!this._funcFrees) {
                    this._funcFrees = this._identsMatching(function (x) {
                        var masked = x >> SCOPE_OFF & SCOPE_MASK;
                        return masked === FREE;
                    });
                }
                return this._funcFrees;
            };
            /**
             * Returns the names of methods for class scopes.
             */
            SymbolTableScope.prototype.get_methods = function () {
                assert(this.get_type() === 'class', "get_methods only valid for class scopes");
                if (!this._classMethods) {
                    // todo; uniq?
                    var all = [];
                    for (var i = 0; i < this.children.length; ++i) all.push(this.children[i].name);
                    all.sort();
                    this._classMethods = all;
                }
                return this._classMethods;
            };
            /**
             * I think this returns the scopeId of a node with the specified name.
             */
            SymbolTableScope.prototype.getScope = function (name) {
                // print("getScope");
                // for (var k in this.symFlags) print(k);
                var v = this.symFlags[name];
                if (v === undefined) return 0;
                return v >> SCOPE_OFF & SCOPE_MASK;
            };
            return SymbolTableScope;
        }();

        /**
         * The symbol table uses the abstract synntax tree (not the parse tree).
         */
        var SymbolTable = function () {
            /**
             *
             */
            function SymbolTable() {
                this.cur = null;
                this.top = null;
                this.stack = [];
                this.global = null; // points at top level module symFlags
                this.curClass = null; // current class or null
                this.tmpname = 0;
                // mapping from ast nodes to their scope if they have one. we add an
                // id to the ast node when a scope is created for it, and store it in
                // here for the compiler to lookup later.
                this.stss = {};
            }
            /**
             * Lookup the SymbolTableScope for a scopeId of the AST.
             */
            SymbolTable.prototype.getStsForAst = function (ast) {
                assert(ast.scopeId !== undefined, "ast wasn't added to st?");
                var v = this.stss[ast.scopeId];
                assert(v !== undefined, "unknown sym tab entry");
                return v;
            };
            SymbolTable.prototype.SEQStmt = function (nodes) {
                var len = nodes.length;
                for (var i = 0; i < len; ++i) {
                    var val = nodes[i];
                    if (val) this.visitStmt(val);
                }
            };
            SymbolTable.prototype.SEQExpr = function (nodes) {
                var len = nodes.length;
                for (var i = 0; i < len; ++i) {
                    var val = nodes[i];
                    if (val) this.visitExpr(val);
                }
            };
            /**
             * A block represents a scope.
             * The following nodes in the AST define new blocks of the indicated type and name:
             * Module        ModuleBlock   = 'module'    name = 'top'
             * FunctionDef   FunctionBlock = 'function'  name = The name of the function.
             * ClassDef      ClassBlock    = 'class'     name = The name of the class.
             * Lambda        FunctionBlock = 'function'  name = 'lambda'
             * GeneratoeExp  FunctionBlock = 'function'  name = 'genexpr'
             *
             * @param name
             * @param blockType
             * @param astNode The AST node that is defining the block.
             * @param lineno
             */
            SymbolTable.prototype.enterBlock = function (name, blockType, astNode, range) {
                //  name = fixReservedNames(name);
                var prev = null;
                if (this.cur) {
                    prev = this.cur;
                    this.stack.push(this.cur);
                }
                this.cur = new SymbolTableScope(this, name, blockType, astNode, range);
                if (name === 'top') {
                    this.global = this.cur.symFlags;
                }
                if (prev) {
                    prev.children.push(this.cur);
                }
            };
            SymbolTable.prototype.exitBlock = function () {
                // print("exitBlock");
                this.cur = null;
                if (this.stack.length > 0) this.cur = this.stack.pop();
            };
            SymbolTable.prototype.visitParams = function (args, toplevel) {
                for (var i = 0; i < args.length; ++i) {
                    var arg = args[i];
                    if (arg.name.constructor === Name) {
                        assert(arg.name.ctx === Param || arg.name.ctx === Store && !toplevel);
                        this.addDef(arg.name.id.value, DEF_PARAM, arg.name.id.range);
                    } else {
                        // Tuple isn't supported
                        throw syntaxError("invalid expression in parameter list");
                    }
                }
            };
            SymbolTable.prototype.visitArguments = function (a, range) {
                if (a.args) this.visitParams(a.args, true);
                if (a.vararg) {
                    this.addDef(a.vararg, DEF_PARAM, range);
                    this.cur.varargs = true;
                }
                if (a.kwarg) {
                    this.addDef(a.kwarg, DEF_PARAM, range);
                    this.cur.varkeywords = true;
                }
            };
            /**
             *
             */
            SymbolTable.prototype.newTmpname = function (range) {
                this.addDef("_[" + ++this.tmpname + "]", DEF_LOCAL, range);
            };
            /**
             * 1. Modifies symbol flags for the current scope.
             * 2.a Adds a variable name for the current scope, OR
             * 2.b Sets the SymbolFlags for a global variable.
             * @param name
             * @param flags
             * @param lineno
             */
            SymbolTable.prototype.addDef = function (name, flags, range) {
                var mangled = mangleName(this.curClass, name);
                //  mangled = fixReservedNames(mangled);
                // Modify symbol flags for the current scope.
                var val = this.cur.symFlags[mangled];
                if (val !== undefined) {
                    if (flags & DEF_PARAM && val & DEF_PARAM) {
                        throw syntaxError("duplicate argument '" + name + "' in function definition", range);
                    }
                    val |= flags;
                } else {
                    val = flags;
                }
                this.cur.symFlags[mangled] = val;
                if (flags & DEF_PARAM) {
                    this.cur.varnames.push(mangled);
                } else if (flags & DEF_GLOBAL) {
                    val = flags;
                    var fromGlobal = this.global[mangled];
                    if (fromGlobal !== undefined) val |= fromGlobal;
                    this.global[mangled] = val;
                }
            };
            SymbolTable.prototype.visitSlice = function (s) {
                if (s instanceof Slice) {
                    if (s.lower) this.visitExpr(s.lower);
                    if (s.upper) this.visitExpr(s.upper);
                    if (s.step) this.visitExpr(s.step);
                } else if (s instanceof ExtSlice) {
                    for (var i = 0; i < s.dims.length; ++i) {
                        this.visitSlice(s.dims[i]);
                    }
                } else if (s instanceof Index) {
                    this.visitExpr(s.value);
                } else if (s instanceof Ellipsis) {
                    // Do nothing.
                }
            };
            /**
             *
             */
            SymbolTable.prototype.visitStmt = function (s) {
                assert(s !== undefined, "visitStmt called with undefined");
                if (s instanceof FunctionDef) {
                    this.addDef(s.name.value, DEF_LOCAL, s.range);
                    if (s.args.defaults) this.SEQExpr(s.args.defaults);
                    if (s.decorator_list) this.SEQExpr(s.decorator_list);
                    this.enterBlock(s.name.value, FunctionBlock, s, s.range);
                    this.visitArguments(s.args, s.range);
                    this.SEQStmt(s.body);
                    this.exitBlock();
                } else if (s instanceof ClassDef) {
                    this.addDef(s.name.value, DEF_LOCAL, s.range);
                    this.SEQExpr(s.bases);
                    if (s.decorator_list) this.SEQExpr(s.decorator_list);
                    this.enterBlock(s.name.value, ClassBlock, s, s.range);
                    var tmp = this.curClass;
                    this.curClass = s.name.value;
                    this.SEQStmt(s.body);
                    this.curClass = tmp;
                    this.exitBlock();
                } else if (s instanceof ReturnStatement) {
                    if (s.value) {
                        this.visitExpr(s.value);
                        this.cur.returnsValue = true;
                        if (this.cur.generator) {
                            throw syntaxError("'return' with argument inside generator");
                        }
                    }
                } else if (s instanceof DeleteStatement) {
                    this.SEQExpr(s.targets);
                } else if (s instanceof Assign) {
                    this.SEQExpr(s.targets);
                    this.visitExpr(s.value);
                } else if (s instanceof AugAssign) {
                    this.visitExpr(s.target);
                    this.visitExpr(s.value);
                } else if (s instanceof AnnAssign) {
                    this.visitExpr(s.target);
                    this.visitExpr(s.value);
                } else if (s instanceof Print) {
                    if (s.dest) this.visitExpr(s.dest);
                    this.SEQExpr(s.values);
                } else if (s instanceof ForStatement) {
                    this.visitExpr(s.target);
                    this.visitExpr(s.iter);
                    this.SEQStmt(s.body);
                    if (s.orelse) this.SEQStmt(s.orelse);
                } else if (s instanceof WhileStatement) {
                    this.visitExpr(s.test);
                    this.SEQStmt(s.body);
                    if (s.orelse) this.SEQStmt(s.orelse);
                } else if (s instanceof IfStatement) {
                    this.visitExpr(s.test);
                    this.SEQStmt(s.consequent);
                    if (s.alternate) {
                        this.SEQStmt(s.alternate);
                    }
                } else if (s instanceof Raise) {
                    if (s.type) {
                        this.visitExpr(s.type);
                        if (s.inst) {
                            this.visitExpr(s.inst);
                            if (s.tback) this.visitExpr(s.tback);
                        }
                    }
                } else if (s instanceof TryExcept) {
                    this.SEQStmt(s.body);
                    this.SEQStmt(s.orelse);
                    this.visitExcepthandlers(s.handlers);
                } else if (s instanceof TryFinally) {
                    this.SEQStmt(s.body);
                    this.SEQStmt(s.finalbody);
                } else if (s instanceof Assert) {
                    this.visitExpr(s.test);
                    if (s.msg) this.visitExpr(s.msg);
                } else if (s instanceof ImportStatement) {
                    var imps = s;
                    this.visitAlias(imps.names, imps.range);
                } else if (s instanceof ImportFrom) {
                    var impFrom = s;
                    this.visitAlias(impFrom.names, impFrom.range);
                } else if (s instanceof Exec) {
                    this.visitExpr(s.body);
                    if (s.globals) {
                        this.visitExpr(s.globals);
                        if (s.locals) this.visitExpr(s.locals);
                    }
                } else if (s instanceof Global) {
                    var nameslen = s.names.length;
                    for (var i = 0; i < nameslen; ++i) {
                        var name_1 = mangleName(this.curClass, s.names[i]);
                        //              name = fixReservedNames(name);
                        var cur = this.cur.symFlags[name_1];
                        if (cur & (DEF_LOCAL | USE)) {
                            if (cur & DEF_LOCAL) {
                                throw syntaxError("name '" + name_1 + "' is assigned to before global declaration", s.range);
                            } else {
                                throw syntaxError("name '" + name_1 + "' is used prior to global declaration", s.range);
                            }
                        }
                        this.addDef(name_1, DEF_GLOBAL, s.range);
                    }
                } else if (s instanceof ExpressionStatement) {
                    this.visitExpr(s.value);
                } else if (s instanceof Pass || s instanceof BreakStatement || s instanceof ContinueStatement) {
                    // Do nothing.
                } else if (s instanceof WithStatement) {
                    var ws = s;
                    this.newTmpname(ws.range);
                    this.visitExpr(ws.context_expr);
                    if (ws.optional_vars) {
                        this.newTmpname(ws.range);
                        this.visitExpr(ws.optional_vars);
                    }
                    this.SEQStmt(ws.body);
                } else {
                    fail("Unhandled type " + s.constructor.name + " in visitStmt");
                }
            };
            SymbolTable.prototype.visitExpr = function (e) {
                assert(e !== undefined, "visitExpr called with undefined");
                if (e instanceof BoolOp) {
                    this.SEQExpr(e.values);
                } else if (e instanceof BinOp) {
                    this.visitExpr(e.lhs);
                    this.visitExpr(e.rhs);
                } else if (e instanceof UnaryOp) {
                    this.visitExpr(e.operand);
                } else if (e instanceof Lambda) {
                    this.addDef("lambda", DEF_LOCAL, e.range);
                    if (e.args.defaults) this.SEQExpr(e.args.defaults);
                    this.enterBlock("lambda", FunctionBlock, e, e.range);
                    this.visitArguments(e.args, e.range);
                    this.visitExpr(e.body);
                    this.exitBlock();
                } else if (e instanceof IfExp) {
                    this.visitExpr(e.test);
                    this.visitExpr(e.body);
                    this.visitExpr(e.orelse);
                } else if (e instanceof Dict) {
                    this.SEQExpr(e.keys);
                    this.SEQExpr(e.values);
                } else if (e instanceof ListComp) {
                    this.newTmpname(e.range);
                    this.visitExpr(e.elt);
                    this.visitComprehension(e.generators, 0);
                } else if (e instanceof GeneratorExp) {
                    this.visitGenexp(e);
                } else if (e instanceof Yield) {
                    if (e.value) this.visitExpr(e.value);
                    this.cur.generator = true;
                    if (this.cur.returnsValue) {
                        throw syntaxError("'return' with argument inside generator");
                    }
                } else if (e instanceof Compare) {
                    this.visitExpr(e.left);
                    this.SEQExpr(e.comparators);
                } else if (e instanceof Call) {
                    this.visitExpr(e.func);
                    this.SEQExpr(e.args);
                    for (var i = 0; i < e.keywords.length; ++i) this.visitExpr(e.keywords[i].value);
                    // print(JSON.stringify(e.starargs, null, 2));
                    // print(JSON.stringify(e.kwargs, null,2));
                    if (e.starargs) this.visitExpr(e.starargs);
                    if (e.kwargs) this.visitExpr(e.kwargs);
                } else if (e instanceof Num || e instanceof Str) {
                    // Do nothing.
                } else if (e instanceof Attribute) {
                    this.visitExpr(e.value);
                } else if (e instanceof Subscript) {
                    this.visitExpr(e.value);
                    this.visitSlice(e.slice);
                } else if (e instanceof Name) {
                    this.addDef(e.id.value, e.ctx === Load ? USE : DEF_LOCAL, e.id.range);
                } else if (e instanceof List || e instanceof Tuple) {
                    this.SEQExpr(e.elts);
                } else {
                    fail("Unhandled type " + e.constructor.name + " in visitExpr");
                }
            };
            SymbolTable.prototype.visitComprehension = function (lcs, startAt) {
                var len = lcs.length;
                for (var i = startAt; i < len; ++i) {
                    var lc = lcs[i];
                    this.visitExpr(lc.target);
                    this.visitExpr(lc.iter);
                    this.SEQExpr(lc.ifs);
                }
            };
            /**
             * This is probably not correct for names. What are they?
             * @param names
             * @param range
             */
            SymbolTable.prototype.visitAlias = function (names, range) {
                /* Compute store_name, the name actually bound by the import
                    operation.  It is diferent than a->name when a->name is a
                    dotted package name (e.g. spam.eggs)
                */
                for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
                    var a = names_1[_i];
                    var name_2 = a.asname === null ? a.name.value : a.asname;
                    var storename = name_2;
                    var dot = name_2.indexOf('.');
                    if (dot !== -1) storename = name_2.substr(0, dot);
                    if (name_2 !== "*") {
                        this.addDef(storename, DEF_IMPORT, range);
                    } else {
                        if (this.cur.blockType !== ModuleBlock) {
                            throw syntaxError("import * only allowed at module level");
                        }
                    }
                }
            };
            /**
             *
             */
            SymbolTable.prototype.visitGenexp = function (e) {
                var outermost = e.generators[0];
                // outermost is evaled in current scope
                this.visitExpr(outermost.iter);
                this.enterBlock("genexpr", FunctionBlock, e, e.range);
                this.cur.generator = true;
                this.addDef(".0", DEF_PARAM, e.range);
                this.visitExpr(outermost.target);
                this.SEQExpr(outermost.ifs);
                this.visitComprehension(e.generators, 1);
                this.visitExpr(e.elt);
                this.exitBlock();
            };
            SymbolTable.prototype.visitExcepthandlers = function (handlers) {
                for (var i = 0, eh = void 0; eh = handlers[i]; ++i) {
                    if (eh.type) this.visitExpr(eh.type);
                    if (eh.name) this.visitExpr(eh.name);
                    this.SEQStmt(eh.body);
                }
            };
            /**
             * @param ste The Symbol Table Scope.
             */
            SymbolTable.prototype.analyzeBlock = function (ste, bound, free, global) {
                var local = {};
                var scope = {};
                var newglobal = {};
                var newbound = {};
                var newfree = {};
                if (ste.blockType === ClassBlock) {
                    dictUpdate(newglobal, global);
                    if (bound) dictUpdate(newbound, bound);
                }
                for (var name_3 in ste.symFlags) {
                    if (ste.symFlags.hasOwnProperty(name_3)) {
                        var flags = ste.symFlags[name_3];
                        this.analyzeName(ste, scope, name_3, flags, bound, local, free, global);
                    }
                }
                if (ste.blockType !== ClassBlock) {
                    if (ste.blockType === FunctionBlock) dictUpdate(newbound, local);
                    if (bound) dictUpdate(newbound, bound);
                    dictUpdate(newglobal, global);
                }
                var allfree = {};
                var childlen = ste.children.length;
                for (var i = 0; i < childlen; ++i) {
                    var c = ste.children[i];
                    this.analyzeChildBlock(c, newbound, newfree, newglobal, allfree);
                    if (c.hasFree || c.childHasFree) ste.childHasFree = true;
                }
                dictUpdate(newfree, allfree);
                if (ste.blockType === FunctionBlock) this.analyzeCells(scope, newfree);
                this.updateSymbols(ste.symFlags, scope, bound, newfree, ste.blockType === ClassBlock);
                dictUpdate(free, newfree);
            };
            SymbolTable.prototype.analyzeChildBlock = function (entry, bound, free, global, childFree) {
                var tempBound = {};
                dictUpdate(tempBound, bound);
                var tempFree = {};
                dictUpdate(tempFree, free);
                var tempGlobal = {};
                dictUpdate(tempGlobal, global);
                this.analyzeBlock(entry, tempBound, tempFree, tempGlobal);
                dictUpdate(childFree, tempFree);
            };
            SymbolTable.prototype.analyzeCells = function (scope, free) {
                for (var name_4 in scope) {
                    if (scope.hasOwnProperty(name_4)) {
                        var flags = scope[name_4];
                        if (flags !== LOCAL) continue;
                        if (free[name_4] === undefined) continue;
                        scope[name_4] = CELL;
                        delete free[name_4];
                    }
                }
            };
            /**
             * store scope info back into the st symbols dict. symbols is modified,
             * others are not.
             */
            SymbolTable.prototype.updateSymbols = function (symbols, scope, bound, free, classflag) {
                for (var name_5 in symbols) {
                    if (symbols.hasOwnProperty(name_5)) {
                        var flags = symbols[name_5];
                        var w = scope[name_5];
                        flags |= w << SCOPE_OFF;
                        symbols[name_5] = flags;
                    }
                }
                var freeValue = FREE << SCOPE_OFF;
                for (var name_6 in free) {
                    if (free.hasOwnProperty(name_6)) {
                        var o = symbols[name_6];
                        if (o !== undefined) {
                            // it could be a free variable in a method of the class that has
                            // the same name as a local or global in the class scope
                            if (classflag && o & (DEF_BOUND | DEF_GLOBAL)) {
                                var i = o | DEF_FREE_CLASS;
                                symbols[name_6] = i;
                            }
                            // else it's not free, probably a cell
                            continue;
                        }
                        if (bound[name_6] === undefined) continue;
                        symbols[name_6] = freeValue;
                    }
                }
            };
            /**
             * @param {Object} ste The Symbol Table Scope.
             * @param {string} name
             */
            SymbolTable.prototype.analyzeName = function (ste, dict, name, flags, bound, local, free, global) {
                if (flags & DEF_GLOBAL) {
                    if (flags & DEF_PARAM) throw syntaxError("name '" + name + "' is local and global", ste.range);
                    dict[name] = GLOBAL_EXPLICIT;
                    global[name] = null;
                    if (bound && bound[name] !== undefined) delete bound[name];
                    return;
                }
                if (flags & DEF_BOUND) {
                    dict[name] = LOCAL;
                    local[name] = null;
                    delete global[name];
                    return;
                }
                if (bound && bound[name] !== undefined) {
                    dict[name] = FREE;
                    ste.hasFree = true;
                    free[name] = null;
                } else if (global && global[name] !== undefined) {
                    dict[name] = GLOBAL_IMPLICIT;
                } else {
                    if (ste.isNested) ste.hasFree = true;
                    dict[name] = GLOBAL_IMPLICIT;
                }
            };
            SymbolTable.prototype.analyze = function () {
                var free = {};
                var global = {};
                this.analyzeBlock(this.top, null, free, global);
            };
            return SymbolTable;
        }();

        // import { Symbol } from './Symbol';
        /**
         * Creates a SymbolTable for the specified Module.
         */
        function semanticsOfModule(mod) {
            var st = new SymbolTable();
            st.enterBlock("top", ModuleBlock, mod, null);
            st.top = st.cur;
            // This is a good place to dump the AST for debugging.
            for (var _i = 0, _a = mod.body; _i < _a.length; _i++) {
                var stmt = _a[_i];
                st.visitStmt(stmt);
            }
            st.exitBlock();
            st.analyze();
            return st;
        }

        /**
         * Provides a textual representation of the SymbolTable.
         */

        exports.parse = parse;
        exports.cstDump = cstDump;
        exports.ParseError = ParseError;
        exports.astFromParse = astFromParse;
        exports.astDump = astDump;
        exports.Add = Add;
        exports.AnnAssign = AnnAssign;
        exports.Assign = Assign;
        exports.Attribute = Attribute;
        exports.BinOp = BinOp;
        exports.BitAnd = BitAnd;
        exports.BitOr = BitOr;
        exports.BitXor = BitXor;
        exports.Call = Call;
        exports.ClassDef = ClassDef;
        exports.Compare = Compare;
        exports.Dict = Dict;
        exports.Div = Div;
        exports.Eq = Eq;
        exports.Expression = Expression;
        exports.ExpressionStatement = ExpressionStatement;
        exports.FloorDiv = FloorDiv;
        exports.ForStatement = ForStatement;
        exports.FunctionDef = FunctionDef;
        exports.Gt = Gt;
        exports.GtE = GtE;
        exports.IfStatement = IfStatement;
        exports.ImportFrom = ImportFrom;
        exports.In = In;
        exports.Is = Is;
        exports.IsNot = IsNot;
        exports.List = List;
        exports.Lt = Lt;
        exports.LtE = LtE;
        exports.LShift = LShift;
        exports.Mod = Mod;
        exports.Module = Module;
        exports.Mult = Mult;
        exports.Name = Name;
        exports.Num = Num;
        exports.NotEq = NotEq;
        exports.NotIn = NotIn;
        exports.Param = Param;
        exports.Position = Position;
        exports.Print = Print;
        exports.Range = Range;
        exports.RangeAnnotated = RangeAnnotated;
        exports.ReturnStatement = ReturnStatement;
        exports.RShift = RShift;
        exports.Str = Str;
        exports.Sub = Sub;
        exports.DEF_LOCAL = DEF_LOCAL;
        exports.semanticsOfModule = semanticsOfModule;
        exports.SymbolTable = SymbolTable;
        exports.SymbolTableScope = SymbolTableScope;

        Object.defineProperty(exports, '__esModule', { value: true });
    });

});
System.registerDynamic("npm:typhon-lang@0.12.9.js", ["npm:typhon-lang@0.12.9/build/browser/index.js"], true, function ($__require, exports, module) {
  var global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:typhon-lang@0.12.9/build/browser/index.js");
});
System.registerDynamic('npm:process@0.11.10/browser.js', [], true, function ($__require, exports, module) {
    var global = this || self,
        GLOBAL = global;
    // shim for using process in browser
    var process = module.exports = {};

    // cached from whatever global is present so that test runners that stub it
    // don't break things.  But we need to wrap it in a try catch in case it is
    // wrapped in strict mode code which doesn't define any globals.  It's inside a
    // function because try/catches deoptimize in certain engines.

    var cachedSetTimeout;
    var cachedClearTimeout;

    function defaultSetTimout() {
        throw new Error('setTimeout has not been defined');
    }
    function defaultClearTimeout() {
        throw new Error('clearTimeout has not been defined');
    }
    (function () {
        try {
            if (typeof setTimeout === 'function') {
                cachedSetTimeout = setTimeout;
            } else {
                cachedSetTimeout = defaultSetTimout;
            }
        } catch (e) {
            cachedSetTimeout = defaultSetTimout;
        }
        try {
            if (typeof clearTimeout === 'function') {
                cachedClearTimeout = clearTimeout;
            } else {
                cachedClearTimeout = defaultClearTimeout;
            }
        } catch (e) {
            cachedClearTimeout = defaultClearTimeout;
        }
    })();
    function runTimeout(fun) {
        if (cachedSetTimeout === setTimeout) {
            //normal enviroments in sane situations
            return setTimeout(fun, 0);
        }
        // if setTimeout wasn't available but was latter defined
        if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
            cachedSetTimeout = setTimeout;
            return setTimeout(fun, 0);
        }
        try {
            // when when somebody has screwed with setTimeout but no I.E. maddness
            return cachedSetTimeout(fun, 0);
        } catch (e) {
            try {
                // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
                return cachedSetTimeout.call(null, fun, 0);
            } catch (e) {
                // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
                return cachedSetTimeout.call(this, fun, 0);
            }
        }
    }
    function runClearTimeout(marker) {
        if (cachedClearTimeout === clearTimeout) {
            //normal enviroments in sane situations
            return clearTimeout(marker);
        }
        // if clearTimeout wasn't available but was latter defined
        if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
            cachedClearTimeout = clearTimeout;
            return clearTimeout(marker);
        }
        try {
            // when when somebody has screwed with setTimeout but no I.E. maddness
            return cachedClearTimeout(marker);
        } catch (e) {
            try {
                // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
                return cachedClearTimeout.call(null, marker);
            } catch (e) {
                // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
                // Some versions of I.E. have different rules for clearTimeout vs setTimeout
                return cachedClearTimeout.call(this, marker);
            }
        }
    }
    var queue = [];
    var draining = false;
    var currentQueue;
    var queueIndex = -1;

    function cleanUpNextTick() {
        if (!draining || !currentQueue) {
            return;
        }
        draining = false;
        if (currentQueue.length) {
            queue = currentQueue.concat(queue);
        } else {
            queueIndex = -1;
        }
        if (queue.length) {
            drainQueue();
        }
    }

    function drainQueue() {
        if (draining) {
            return;
        }
        var timeout = runTimeout(cleanUpNextTick);
        draining = true;

        var len = queue.length;
        while (len) {
            currentQueue = queue;
            queue = [];
            while (++queueIndex < len) {
                if (currentQueue) {
                    currentQueue[queueIndex].run();
                }
            }
            queueIndex = -1;
            len = queue.length;
        }
        currentQueue = null;
        draining = false;
        runClearTimeout(timeout);
    }

    process.nextTick = function (fun) {
        var args = new Array(arguments.length - 1);
        if (arguments.length > 1) {
            for (var i = 1; i < arguments.length; i++) {
                args[i - 1] = arguments[i];
            }
        }
        queue.push(new Item(fun, args));
        if (queue.length === 1 && !draining) {
            runTimeout(drainQueue);
        }
    };

    // v8 likes predictible objects
    function Item(fun, array) {
        this.fun = fun;
        this.array = array;
    }
    Item.prototype.run = function () {
        this.fun.apply(null, this.array);
    };
    process.title = 'browser';
    process.browser = true;
    process.env = {};
    process.argv = [];
    process.version = ''; // empty string to avoid regexp issues
    process.versions = {};

    function noop() {}

    process.on = noop;
    process.addListener = noop;
    process.once = noop;
    process.off = noop;
    process.removeListener = noop;
    process.removeAllListeners = noop;
    process.emit = noop;
    process.prependListener = noop;
    process.prependOnceListener = noop;

    process.listeners = function (name) {
        return [];
    };

    process.binding = function (name) {
        throw new Error('process.binding is not supported');
    };

    process.cwd = function () {
        return '/';
    };
    process.chdir = function (dir) {
        throw new Error('process.chdir is not supported');
    };
    process.umask = function () {
        return 0;
    };
});
System.registerDynamic("npm:process@0.11.10.js", ["npm:process@0.11.10/browser.js"], true, function ($__require, exports, module) {
  var global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:process@0.11.10/browser.js");
});
System.registerDynamic('github:jspm/nodelibs-process@0.1.2/index.js', ['process'], true, function ($__require, exports, module) {
  var global = this || self,
      GLOBAL = global;
  module.exports = System._nodeRequire ? process : $__require('process');
});
System.registerDynamic("github:jspm/nodelibs-process@0.1.2.js", ["github:jspm/nodelibs-process@0.1.2/index"], true, function ($__require, exports, module) {
  var global = this || self,
      GLOBAL = global;
  module.exports = $__require("github:jspm/nodelibs-process@0.1.2/index");
});
System.registerDynamic('npm:code-writer@0.1.2/build/browser/index.js', ['process'], true, function ($__require, exports, module) {
  /* */
  "format cjs";

  var global = this || self,
      GLOBAL = global;
  (function (process) {
    (function (global, factory) {
      typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof undefined === 'function' && define.amd ? define(['exports'], factory) : factory(global.CodeWriter = global.CodeWriter || {});
    })(this, function (exports) {
      'use strict';

      var MutablePosition = function () {
        function MutablePosition(line, column) {
          this.line = line;
          this.column = column;
        }
        MutablePosition.prototype.offset = function (rows, cols) {
          this.line += rows;
          this.column += cols;
        };
        MutablePosition.prototype.toString = function () {
          return "[" + this.line + ", " + this.column + "]";
        };
        return MutablePosition;
      }();
      function assert(condition, message) {
        if (!condition) {
          throw new Error(message);
        }
      }
      var MutableRange = function () {
        function MutableRange(begin, end) {
          this.begin = begin;
          this.end = end;
          assert(begin, "begin must be defined");
          assert(end, "end must be defined");
          this.begin = begin;
          this.end = end;
        }
        MutableRange.prototype.offset = function (rows, cols) {
          this.begin.offset(rows, cols);
          this.end.offset(rows, cols);
        };
        MutableRange.prototype.toString = function () {
          return this.begin + " to " + this.end;
        };
        return MutableRange;
      }();
      var Position = function () {
        function Position(line, column) {
          this.line = line;
          this.column = column;
        }
        Position.prototype.toString = function () {
          return "[" + this.line + ", " + this.column + "]";
        };
        return Position;
      }();
      function positionComparator(a, b) {
        if (a.line < b.line) {
          return -1;
        } else if (a.line > b.line) {
          return 1;
        } else {
          if (a.column < b.column) {
            return -1;
          } else if (a.column > b.column) {
            return 1;
          } else {
            return 0;
          }
        }
      }
      var Range = function () {
        function Range(begin, end) {
          assert(begin, "begin must be defined");
          assert(end, "end must be defined");
          this.begin = begin;
          this.end = end;
        }
        Range.prototype.toString = function () {
          return this.begin + " to " + this.end;
        };
        return Range;
      }();
      var MappingTree = function () {
        function MappingTree(source, target, children) {
          this.children = children;
          assert(source, "source must be defined");
          assert(target, "target must be defined");
          this.source = source;
          this.target = target;
        }
        MappingTree.prototype.offset = function (rows, cols) {
          if (this.target) {
            this.target.offset(rows, cols);
          }
          if (this.children) {
            for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
              var child = _a[_i];
              child.offset(rows, cols);
            }
          }
        };
        MappingTree.prototype.mappings = function () {
          if (this.children) {
            var maps = [];
            for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
              var child = _a[_i];
              for (var _b = 0, _c = child.mappings(); _b < _c.length; _b++) {
                var map = _c[_b];
                maps.push(map);
              }
            }
            return maps;
          } else {
            return [{
              source: this.source,
              target: this.target
            }];
          }
        };
        return MappingTree;
      }();
      (function (IndentStyle) {
        IndentStyle[IndentStyle["None"] = 0] = "None";
        IndentStyle[IndentStyle["Block"] = 1] = "Block";
        IndentStyle[IndentStyle["Smart"] = 2] = "Smart";
      })(exports.IndentStyle || (exports.IndentStyle = {}));
      var StackElement = function () {
        function StackElement(bMark, eMark, targetBeginLine, targetBeginColumn, trace) {
          this.bMark = bMark;
          this.eMark = eMark;
          this.texts = [];
          this.trees = [];
          this.cursor = new MutablePosition(targetBeginLine, targetBeginColumn);
        }
        StackElement.prototype.write = function (text, tree) {
          assert(typeof text === 'string', "text must be a string");
          this.texts.push(text);
          this.trees.push(tree);
          var cursor = this.cursor;
          var beginLine = cursor.line;
          var beginColumn = cursor.column;
          var endLine = cursor.line;
          var endColumn = beginColumn + text.length;
          if (tree) {
            tree.target.begin.line = beginLine;
            tree.target.begin.column = beginColumn;
            tree.target.end.line = endLine;
            tree.target.end.column = endColumn;
          }
          cursor.line = endLine;
          cursor.column = endColumn;
        };
        StackElement.prototype.snapshot = function () {
          var texts = this.texts;
          var trees = this.trees;
          var N = texts.length;
          if (N === 0) {
            return this.package('', null);
          } else {
            var sBL = Number.MAX_SAFE_INTEGER;
            var sBC = Number.MAX_SAFE_INTEGER;
            var sEL = Number.MIN_SAFE_INTEGER;
            var sEC = Number.MIN_SAFE_INTEGER;
            var tBL = Number.MAX_SAFE_INTEGER;
            var tBC = Number.MAX_SAFE_INTEGER;
            var tEL = Number.MIN_SAFE_INTEGER;
            var tEC = Number.MIN_SAFE_INTEGER;
            var children = [];
            for (var i = 0; i < N; i++) {
              var tree = trees[i];
              if (tree) {
                sBL = Math.min(sBL, tree.source.begin.line);
                sBC = Math.min(sBC, tree.source.begin.column);
                sEL = Math.max(sEL, tree.source.end.line);
                sEC = Math.max(sEC, tree.source.end.column);
                tBL = Math.min(tBL, tree.target.begin.line);
                tBC = Math.min(tBC, tree.target.begin.column);
                tEL = Math.max(tEL, tree.target.end.line);
                tEC = Math.max(tEC, tree.target.end.column);
                children.push(tree);
              }
            }
            var text = texts.join("");
            if (children.length > 1) {
              var source = new Range(new Position(sBL, sBC), new Position(sEL, sEC));
              var target = new MutableRange(new MutablePosition(tBL, tBC), new MutablePosition(tEL, tEC));
              return this.package(text, new MappingTree(source, target, children));
            } else if (children.length === 1) {
              return this.package(text, children[0]);
            } else {
              return this.package(text, null);
            }
          }
        };
        StackElement.prototype.package = function (text, tree) {
          return {
            text: text,
            tree: tree,
            targetEndLine: this.cursor.line,
            targetEndColumn: this.cursor.column
          };
        };
        StackElement.prototype.getLine = function () {
          return this.cursor.line;
        };
        StackElement.prototype.getColumn = function () {
          return this.cursor.column;
        };
        return StackElement;
      }();
      function IDXLAST(xs) {
        return xs.length - 1;
      }
      var Stack = function () {
        function Stack(begin, end, targetLine, targetColumn, trace) {
          this.elements = [];
          this.elements.push(new StackElement(begin, end, targetLine, targetColumn, trace));
        }
        Object.defineProperty(Stack.prototype, "length", {
          get: function () {
            return this.elements.length;
          },
          enumerable: true,
          configurable: true
        });
        Stack.prototype.push = function (element) {
          this.elements.push(element);
        };
        Stack.prototype.pop = function () {
          return this.elements.pop();
        };
        Stack.prototype.write = function (text, tree) {
          this.elements[IDXLAST(this.elements)].write(text, tree);
        };
        Stack.prototype.dispose = function () {
          assert(this.elements.length === 1, "stack length should be 1");
          var textAndMappings = this.elements[IDXLAST(this.elements)].snapshot();
          this.pop();
          assert(this.elements.length === 0, "stack length should be 0");
          return textAndMappings;
        };
        Stack.prototype.getLine = function () {
          return this.elements[IDXLAST(this.elements)].getLine();
        };
        Stack.prototype.getColumn = function () {
          return this.elements[IDXLAST(this.elements)].getColumn();
        };
        return Stack;
      }();
      var CodeWriter = function () {
        function CodeWriter(beginLine, beginColumn, options, trace) {
          if (options === void 0) {
            options = {};
          }
          if (trace === void 0) {
            trace = false;
          }
          this.options = options;
          this.trace = trace;
          this.stack = new Stack('', '', beginLine, beginColumn, trace);
        }
        CodeWriter.prototype.assign = function (text, source) {
          var target = new MutableRange(new MutablePosition(-3, -3), new MutablePosition(-3, -3));
          var tree = new MappingTree(source, target, null);
          this.stack.write(text, tree);
        };
        CodeWriter.prototype.name = function (id, source) {
          if (source) {
            var target = new MutableRange(new MutablePosition(-2, -2), new MutablePosition(-2, -2));
            var tree = new MappingTree(source, target, null);
            this.stack.write(id, tree);
          } else {
            this.stack.write(id, null);
          }
        };
        CodeWriter.prototype.num = function (text, source) {
          if (source) {
            var target = new MutableRange(new MutablePosition(-3, -3), new MutablePosition(-3, -3));
            var tree = new MappingTree(source, target, null);
            this.stack.write(text, tree);
          } else {
            this.stack.write(text, null);
          }
        };
        CodeWriter.prototype.str = function (text, source) {
          if (source) {
            var target = new MutableRange(new MutablePosition(-23, -23), new MutablePosition(-23, -23));
            var tree = new MappingTree(source, target, null);
            this.stack.write(text, tree);
          } else {
            this.stack.write(text, null);
          }
        };
        CodeWriter.prototype.write = function (text, tree) {
          this.stack.write(text, tree);
        };
        CodeWriter.prototype.snapshot = function () {
          assert(this.stack.length === 1, "stack length is not zero");
          return this.stack.dispose();
        };
        CodeWriter.prototype.binOp = function (binOp, source) {
          var target = new MutableRange(new MutablePosition(-5, -5), new MutablePosition(-5, -5));
          var tree = new MappingTree(source, target, null);
          if (this.options.insertSpaceBeforeAndAfterBinaryOperators) {
            this.space();
            this.stack.write(binOp, tree);
            this.space();
          } else {
            this.stack.write(binOp, tree);
          }
        };
        CodeWriter.prototype.comma = function (begin, end) {
          if (begin && end) {
            var source = new Range(begin, end);
            var target = new MutableRange(new MutablePosition(-4, -4), new MutablePosition(-4, -4));
            var tree = new MappingTree(source, target, null);
            this.stack.write(',', tree);
          } else {
            this.stack.write(',', null);
          }
          if (this.options.insertSpaceAfterCommaDelimiter) {
            this.stack.write(' ', null);
          }
        };
        CodeWriter.prototype.space = function () {
          this.stack.write(' ', null);
        };
        CodeWriter.prototype.beginBlock = function () {
          this.prolog('{', '}');
        };
        CodeWriter.prototype.endBlock = function () {
          this.epilog(false);
        };
        CodeWriter.prototype.beginBracket = function () {
          this.prolog('[', ']');
        };
        CodeWriter.prototype.endBracket = function () {
          this.epilog(this.options.insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets);
        };
        CodeWriter.prototype.beginObject = function () {
          this.prolog('{', '}');
        };
        CodeWriter.prototype.endObject = function () {
          this.epilog(this.options.insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces);
        };
        CodeWriter.prototype.openParen = function () {
          this.prolog('(', ')');
        };
        CodeWriter.prototype.closeParen = function () {
          this.epilog(this.options.insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis);
        };
        CodeWriter.prototype.beginQuote = function () {
          this.prolog("'", "'");
        };
        CodeWriter.prototype.endQuote = function () {
          this.epilog(false);
        };
        CodeWriter.prototype.beginStatement = function () {
          this.prolog('', ';');
        };
        CodeWriter.prototype.endStatement = function () {
          this.epilog(false);
        };
        CodeWriter.prototype.prolog = function (bMark, eMark) {
          var line = this.stack.getLine();
          var column = this.stack.getColumn();
          this.stack.push(new StackElement(bMark, eMark, line, column, this.trace));
        };
        CodeWriter.prototype.epilog = function (insertSpaceAfterOpeningAndBeforeClosingNonempty) {
          var popped = this.stack.pop();
          var textAndMappings = popped.snapshot();
          var text = textAndMappings.text;
          var tree = textAndMappings.tree;
          if (text.length > 0 && insertSpaceAfterOpeningAndBeforeClosingNonempty) {
            this.write(popped.bMark, null);
            this.space();
            var rows = 0;
            var cols = popped.bMark.length + 1;
            if (tree) {
              tree.offset(rows, cols);
            }
            this.write(text, tree);
            this.space();
            this.write(popped.eMark, null);
          } else {
            this.write(popped.bMark, null);
            var rows = 0;
            var cols = popped.bMark.length;
            if (tree) {
              tree.offset(rows, cols);
            }
            this.write(text, tree);
            this.write(popped.eMark, null);
          }
        };
        return CodeWriter;
      }();
      exports.MutablePosition = MutablePosition;
      exports.MutableRange = MutableRange;
      exports.Position = Position;
      exports.positionComparator = positionComparator;
      exports.Range = Range;
      exports.MappingTree = MappingTree;
      exports.CodeWriter = CodeWriter;
      Object.defineProperty(exports, '__esModule', { value: true });
    });
  })($__require('process'));
});
System.registerDynamic("npm:code-writer@0.1.2.js", ["npm:code-writer@0.1.2/build/browser/index.js"], true, function ($__require, exports, module) {
  var global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:code-writer@0.1.2/build/browser/index.js");
});
System.registerDynamic('npm:generic-rbtree@1.1.1/build/browser/index.js', [], true, function ($__require, exports, module) {
    /* */
    "format cjs";

    var global = this || self,
        GLOBAL = global;
    (function (global, factory) {
        typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof undefined === 'function' && define.amd ? define(['exports'], factory) : factory(global.EIGHT = global.EIGHT || {});
    })(exports, function (exports) {
        'use strict';

        /**
         *
         */

        var RBNode = function () {
            /**
             * Constructs a red-black binary tree node.
             */
            function RBNode(key, value) {
                this.key = key;
                this.value = value;
                /**
                 * The red (true) / black (false) flag.
                 */
                this.flag = false;
                this.l = this;
                this.r = this;
                this.p = this;
            }
            /*
            get red(): boolean {
                return this.flag;
            }
            set red(red: boolean) {
                this.flag = red;
            }
            get black(): boolean {
                return !this.flag;
            }
            set black(black: boolean) {
                this.flag = !black;
            }
            */
            RBNode.prototype.toString = function () {
                return (this.flag ? 'red' : 'black') + " " + this.key;
            };
            return RBNode;
        }();

        var RBTree = function () {
            /**
             * Initializes an RBTree.
             * It is important to define a key that is smaller than all expected keys
             * so that the first insert becomes the root (head.r).
             *
             * @param lowKey A key that is smaller than all expected keys.
             * @param highKey A key that is larger than all expected keys.
             * @param nilValue The value to return when a search is not successful.
             * @param comp The comparator used for comparing keys.
             */
            function RBTree(lowKey, highKey, nilValue, comp) {
                this.highKey = highKey;
                this.comp = comp;
                /**
                 * The number of keys inserted.
                 */
                this.N = 0;
                this.lowNode = new RBNode(lowKey, nilValue);
                this.highNode = new RBNode(highKey, nilValue);
                // Notice that z does not have a key because it has to be less than and greater than every other key.
                var z = new RBNode(null, nilValue);
                this.head = new RBNode(lowKey, nilValue);
                // Head left is never used or changed so we'll store the tail node there.
                this.head.l = z;
                // Head right refers the the actual tree root which is currently empty.
                this.head.r = z;
                this.head.p = this.head;
            }
            Object.defineProperty(RBTree.prototype, "root", {
                get: function () {
                    return this.head.r;
                },
                set: function (root) {
                    this.head.r = root;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RBTree.prototype, "z", {
                /**
                 * The "tail" node.
                 * This allows our subtrees never to be undefined or null.
                 * All searches will result in a node, but misses will return the tail node.
                 */
                get: function () {
                    return this.head.l;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RBTree.prototype, "lowKey", {
                get: function () {
                    return this.head.key;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Legal means that is greater than the key stored in the head node.
             * The key does not have to exist.
             */
            RBTree.prototype.assertLegalKey = function (key, comp) {
                if (comp(key, this.lowKey) <= 0) {
                    throw new Error("key, " + key + ", must be greater than the low key, " + this.lowKey + ".");
                }
                if (comp(key, this.highKey) >= 0) {
                    throw new Error("key, " + key + ", must be less than the high key, " + this.highKey + ".");
                }
            };
            /**
             *
             */
            RBTree.prototype.insert = function (key, value) {
                var comp = this.comp;
                this.assertLegalKey(key, comp);
                var n = new RBNode(key, value);
                rbInsert(this, n, comp);
                this.root.flag = false;
                // Update the count of nodes inserted.
                this.N += 1;
                return n;
            };
            /**
             * Greatest Lower Bound of a key.
             * Returns the node corresponding to the key if it exists, or the next lowest key.
             * Returns null if there is no smaller key in the tree.
             */
            RBTree.prototype.glb = function (key) {
                var comp = this.comp;
                this.assertLegalKey(key, comp);
                var low = this.lowNode;
                var node = glb(this, this.root, key, comp, low);
                if (node !== low) {
                    return node;
                } else {
                    return null;
                }
            };
            /**
             * Least Upper Bound of a key.
             * Returns the node corresponding to the key if it exists, or the next highest key.
             * Returns null if there is no greater key in the tree.
             */
            RBTree.prototype.lub = function (key) {
                var comp = this.comp;
                this.assertLegalKey(key, comp);
                var high = this.highNode;
                var node = lub(this, this.root, key, comp, high);
                if (node !== high) {
                    return node;
                } else {
                    return null;
                }
            };
            /**
             *
             */
            RBTree.prototype.search = function (key) {
                var comp = this.comp;
                this.assertLegalKey(key, comp);
                /**
                 * The current node for the search.
                 */
                var x = this.root;
                // The search will always be "successful" but may end with z.
                this.z.key = key;
                while (comp(key, x.key) !== 0) {
                    x = comp(key, x.key) < 0 ? x.l : x.r;
                }
                return x.value;
            };
            /**
             *
             * @param key
             */
            RBTree.prototype.remove = function (key) {
                var comp = this.comp;
                this.assertLegalKey(key, comp);
                var head = this.head;
                var z = this.z;
                /**
                 * The current node for the search, we begin at the root.
                 */
                var x = this.root;
                /**
                 * The parent of the current node.
                 */
                var p = head;
                // The search will always be "successful" but may end with z.
                z.key = key;
                // Search in the normal way to get p and x.
                while (comp(key, x.key) !== 0) {
                    p = x;
                    x = comp(key, x.key) < 0 ? x.l : x.r;
                }
                // Our search has terminated and x is either the node to be removed or z.
                /**
                 * A reference to the node that we will be removing.
                 * This may point to z, but the following code also works in that case.
                 */
                var t = x;
                // From now on we will be making x reference the node that replaces t.
                if (t.r === z) {
                    // The node t has no right child.
                    // The node that replaces t will be the left child of t.
                    x = t.l;
                } else if (t.r.l === z) {
                    // The node t has a right child with no left child.
                    // This empty slot can be used to accept t.l
                    x = t.r;
                    x.l = t.l;
                } else {
                    // The node with the next highest key must be in the r-l-l-l-l... path with a left child equal to z.
                    // It can't be anywhere else of there would be an intervening key.
                    // Note also that the previous tests have eliminated the case where
                    // there is no highets key. This node with the next highest key must have
                    // the property that it has an empty left child.
                    var c = t.r;
                    while (c.l.l !== z) {
                        c = c.l;
                    }
                    // We exit from the loop when c.l.l equals z, which means that c.l is the node that
                    // we want to use to replace t.
                    x = c.l;
                    c.l = x.r;
                    x.l = t.l;
                    x.r = t.r;
                }
                // We can now free the t node (if we need to do so).
                // Finally, account for whether t was the left or right child of p.
                if (comp(key, p.key) < 0) {
                    p.l = x;
                } else {
                    p.r = x;
                }
            };
            Object.defineProperty(RBTree.prototype, "heightInvariant", {
                /**
                 * Determines whether this tree satisfies the height invariant.
                 * The height invariant is that the number of black nodes in every path to leaf nodes should be the same.
                 * This property is for testing only; it traverses the tree and so affects performance.
                 */
                get: function () {
                    return heightInv(this.root, this.z);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RBTree.prototype, "colorInvariant", {
                /**
                 * Determines whether this tree satisfies the color invarant.
                 * The color invariant is that no two adjacent nodes should be colored red.
                 * This property is for testing only; it traverses the treeand so affects performance.
                 */
                get: function () {
                    return colorInv(this.root, this.head.flag, this.z);
                },
                enumerable: true,
                configurable: true
            });
            return RBTree;
        }();
        function colorFlip(p, g, gg) {
            p.flag = false;
            g.flag = true;
            gg.flag = false;
            return g;
        }
        /**
         * z, x, y are in diamond-left formation.
         * z is the initial leader and is black.
         * x and y are initially red.
         *
         * z moves right and back.
         * y takes the lead.
         * children a,b of y are adopted by x and z.
         * x becomes black.
         *
         *    z          y
         * x    =>    x     z
         *    y        a   b
         *  a   b
         */
        function diamondLeftToVic(lead) {
            var m = lead.p;
            var z = lead;
            var x = z.l;
            var y = x.r;
            var a = y.l;
            var b = y.r;
            x.flag = false;
            y.l = x;
            x.p = y;
            y.r = z;
            z.p = y;
            x.r = a;
            a.p = x;
            z.l = b;
            b.p = z;
            if (m.r === lead) {
                m.r = y;
            } else {
                m.l = y;
            }
            y.p = m;
            return y;
        }
        /**
         * x, z, y are in diamond-right formation.
         * x is the initial leader and is black.
         * z and y are initially red.
         *
         * x moves left and back
         * y takes the lead.
         * z becomes black.
         *
         *    x          y
         *       z => x     z
         *    y        a   b
         *  a   b
         */
        function diamondRightToVic(lead) {
            var m = lead.p;
            var x = lead;
            var z = x.r;
            var y = z.l;
            var a = y.l;
            var b = y.r;
            z.flag = false;
            y.l = x;
            x.p = y;
            y.r = z;
            z.p = y;
            x.r = a;
            a.p = x;
            z.l = b;
            b.p = z;
            if (m.r === lead) {
                m.r = y;
            } else {
                m.l = y;
            }
            y.p = m;
            return y;
        }
        function echelonLeftToVic(lead) {
            var m = lead.p;
            var z = lead;
            var y = z.l;
            var a = y.r;
            y.l.flag = false;
            y.r = z;
            z.p = y;
            z.l = a;
            a.p = z;
            if (m.r === lead) {
                m.r = y;
            } else {
                m.l = y;
            }
            y.p = m;
            return y;
        }
        function echelonRightToVic(lead) {
            var m = lead.p;
            var x = lead;
            var y = x.r;
            var a = y.l;
            y.r.flag = false;
            y.l = x;
            x.p = y;
            x.r = a;
            a.p = x;
            if (m.r === lead) {
                m.r = y;
            } else {
                m.l = y;
            }
            y.p = m;
            return y;
        }
        function colorInv(node, redParent, z) {
            if (node === z) {
                return true;
            } else if (redParent && node.flag) {
                return false;
            } else {
                return colorInv(node.l, node.flag, z) && colorInv(node.r, node.flag, z);
            }
        }
        function heightInv(node, z) {
            return blackHeight(node, z) >= 0;
        }
        /**
         * Computes the number of black nodes (including z) on the path from x to leaf, not counting x.
         * The height does not include itself.
         * z nodes are black.
         */
        function blackHeight(x, z) {
            if (x === z) {
                return 0;
            } else {
                var hL = blackHeight(x.l, z);
                if (hL >= 0) {
                    var hR = blackHeight(x.r, z);
                    if (hR >= 0) {
                        if (hR === hR) {
                            return x.flag ? hL : hL + 1;
                        }
                    }
                }
                return -1;
            }
        }
        function rbInsert(tree, n, comp) {
            var key = n.key;
            var z = tree.z;
            var x = tree.root;
            x.p = tree.head;
            while (x !== z) {
                x.l.p = x;
                x.r.p = x;
                x = comp(key, x.key) < 0 ? x.l : x.r;
            }
            n.p = x.p;
            if (x.p === tree.head) {
                tree.root = n;
            } else {
                if (comp(key, x.p.key) < 0) {
                    x.p.l = n;
                } else {
                    x.p.r = n;
                }
            }
            n.l = z;
            n.r = z;
            if (n.p.flag) {
                rbInsertFixup(tree, n);
            } else {
                n.flag = true;
            }
        }
        /**
         * In this algorithm we start with the node that has been inserted and make our way up the tree.
         * This requires carefully maintaining parent pointers.
         */
        function rbInsertFixup(tree, n) {
            // When inserting the node (at any place other than the root), we always color it red.
            // This is so that we don't violate the height invariant.
            // However, this may violate the color invariant, which we address by recursing back up the tree.
            n.flag = true;
            if (!n.p.flag) {
                throw new Error("n.p must be red.");
            }
            while (n.flag) {
                /**
                 * The parent of n.
                 */
                var p = n.p;
                if (n === tree.root) {
                    tree.root.flag = false;
                    return;
                } else if (p === tree.root) {
                    tree.root.flag = false;
                    return;
                }
                /**
                 * The leader of the formation.
                 */
                var lead = p.p;
                // Establish the n = red, p = red, g = black condition for a transformation.
                if (p.flag && !lead.flag) {
                    if (p === lead.l) {
                        var aux = lead.r;
                        if (aux.flag) {
                            n = colorFlip(p, lead, aux);
                        } else if (n === p.r) {
                            n = diamondLeftToVic(lead);
                        } else {
                            n = echelonLeftToVic(lead);
                        }
                    } else {
                        var aux = lead.l;
                        if (aux.flag) {
                            n = colorFlip(p, lead, aux);
                        } else if (n === n.p.l) {
                            n = diamondRightToVic(lead);
                        } else {
                            n = echelonRightToVic(lead);
                        }
                    }
                } else {
                    break;
                }
            }
            tree.root.flag = false;
        }
        /**
         * Recursive implementation to compute the Greatest Lower Bound.
         * The largest key such that glb <= key.
         */
        function glb(tree, node, key, comp, low) {
            if (node === tree.z) {
                return low;
            } else if (comp(key, node.key) >= 0) {
                // The node key is a valid lower bound, but may not be the greatest.
                // Take the right link in search of larger keys.
                return maxNode(node, glb(tree, node.r, key, comp, low), comp);
            } else {
                // Take the left link in search of smaller keys.
                return glb(tree, node.l, key, comp, low);
            }
        }
        /**
         * Recursive implementation to compute the Least Upper Bound.
         * The smallest key such that key <= lub.
         */
        function lub(tree, node, key, comp, high) {
            if (node === tree.z) {
                return high;
            } else if (comp(key, node.key) <= 0) {
                // The node key is a valid upper bound, but may not be the least.
                return minNode(node, lub(tree, node.l, key, comp, high), comp);
            } else {
                // Take the right link in search of bigger keys.
                return lub(tree, node.r, key, comp, high);
            }
        }
        function maxNode(a, b, comp) {
            if (comp(a.key, b.key) > 0) {
                return a;
            } else if (comp(a.key, b.key) < 0) {
                return b;
            } else {
                return a;
            }
        }
        function minNode(a, b, comp) {
            if (comp(a.key, b.key) < 0) {
                return a;
            } else if (comp(a.key, b.key) > 0) {
                return b;
            } else {
                return a;
            }
        }

        exports.RBNode = RBNode;
        exports.RBTree = RBTree;

        Object.defineProperty(exports, '__esModule', { value: true });
    });

});
System.registerDynamic("npm:generic-rbtree@1.1.1.js", ["npm:generic-rbtree@1.1.1/build/browser/index.js"], true, function ($__require, exports, module) {
  var global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:generic-rbtree@1.1.1/build/browser/index.js");
});
System.registerDynamic('npm:typhon-typescript@0.3.0/build/browser/index.js', ['typhon-lang', 'code-writer', 'generic-rbtree'], true, function ($__require, exports, module) {
    /* */
    "format cjs";

    var global = this || self,
        GLOBAL = global;
    (function (global, factory) {
        typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, $__require('typhon-lang'), $__require('code-writer'), $__require('generic-rbtree')) : typeof undefined === 'function' && define.amd ? define(['exports', 'typhon-lang', 'code-writer', 'generic-rbtree'], factory) : factory(global.typhonTypescript = global.typhonTypescript || {}, global.typhonLang, global.codeWriter, global.genericRbtree);
    })(exports, function (exports, typhonLang, codeWriter, genericRbtree) {
        'use strict';

        /**
         * We're looking for something that is truthy, not just true.
         */

        function assert(condition, message) {
            if (!condition) {
                throw new Error(message);
            }
        }

        /**
         * FIXME: Argument should be declared as string but not allowed by TypeScript compiler.
         * May be a bug when comparing to 0x7f below.
         */
        function toStringLiteralJS(value) {
            // single is preferred
            var quote = "'";
            if (value.indexOf("'") !== -1 && value.indexOf('"') === -1) {
                quote = '"';
            }
            var len = value.length;
            var ret = quote;
            for (var i = 0; i < len; ++i) {
                var c = value.charAt(i);
                if (c === quote || c === '\\') ret += '\\' + c;else if (c === '\t') ret += '\\t';else if (c === '\n') ret += '\\n';else if (c === '\r') ret += '\\r';else if (c < ' ' || c >= 0x7f) {
                    var ashex = c.charCodeAt(0).toString(16);
                    if (ashex.length < 2) ashex = "0" + ashex;
                    ret += "\\x" + ashex;
                } else ret += c;
            }
            ret += quote;
            return ret;
        }

        /**
         * Determines whether the name or attribute should be considered to be a class.
         * This is a heuristic test based upon the JavaScript convention for class names.
         * In future we may be able to use type information.
         */
        function isClassNameByConvention(name) {
            var id = name.id;
            if (id instanceof typhonLang.RangeAnnotated && typeof id.value === 'string') {
                // console.lg(`name => ${JSON.stringify(name, null, 2)}`);
                var N = id.value.length;
                if (N > 0) {
                    var firstChar = id.value[0];
                    return firstChar.toUpperCase() === firstChar;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
        function isMethod(functionDef) {
            for (var i = 0; i < functionDef.args.args.length; i++) {
                if (i === 0) {
                    var arg = functionDef.args.args[i];
                    if (arg.name.id.value === 'self') {
                        return true;
                    }
                } else {
                    return false;
                }
            }
            return false;
        }

        var SourceMap = function () {
            function SourceMap(sourceToTarget, targetToSource) {
                this.sourceToTarget = sourceToTarget;
                this.targetToSource = targetToSource;
                // Do nothing yet.
            }
            SourceMap.prototype.getTargetPosition = function (sourcePos) {
                var nodeL = this.sourceToTarget.glb(sourcePos);
                var nodeU = this.sourceToTarget.lub(sourcePos);
                if (nodeL) {
                    if (nodeU) {
                        return interpolate(sourcePos.line, sourcePos.column, nodeL.key, nodeL.value);
                    } else {
                        return null;
                    }
                } else {
                    return null;
                }
            };
            SourceMap.prototype.getSourcePosition = function (targetPos) {
                var nodeL = this.targetToSource.glb(targetPos);
                if (nodeL) {
                    return interpolate(targetPos.line, targetPos.column, nodeL.key, nodeL.value);
                } else {
                    return null;
                }
            };
            return SourceMap;
        }();
        function interpolate(sourceLine, sourceColumn, sourceBegin, targetBegin) {
            var lineOffset = sourceLine - sourceBegin.line;
            var columnOffset = sourceColumn - sourceBegin.column;
            var targetLine = targetBegin.line + lineOffset;
            var targetColumn = targetBegin.column + columnOffset;
            return new codeWriter.Position(targetLine, targetColumn);
        }

        /**
         * Provides enhanced scope information beyond the SymbolTableScope.
         */
        var PrinterUnit = function () {
            /**
             * Stuff that changes on entry/exit of code blocks. must be saved and restored
             * when returning to a block.
             * Corresponds to the body of a module, class, or function.
             */
            function PrinterUnit(name, ste) {
                /**
                 * Used to determine whether a local variable has been declared.
                 */
                this.declared = {};
                assert(typeof name === 'string');
                assert(typeof ste === 'object');
                this.name = name;
                this.ste = ste;
                this.private_ = null;
                this.beginLine = 0;
                this.lineno = 0;
                this.linenoSet = false;
                this.localnames = [];
                this.blocknum = 0;
                this.blocks = [];
                this.curblock = 0;
                this.scopename = null;
                this.prefixCode = '';
                this.varDeclsCode = '';
                this.switchCode = '';
                this.suffixCode = '';
                // stack of where to go on a break
                this.breakBlocks = [];
                // stack of where to go on a continue
                this.continueBlocks = [];
                this.exceptBlocks = [];
                this.finallyBlocks = [];
            }
            PrinterUnit.prototype.activateScope = function () {
                // Do nothing yet.
            };
            PrinterUnit.prototype.deactivateScope = function () {
                // Do nothing yet.
            };
            return PrinterUnit;
        }();
        var Printer = function () {
            /**
             *
             * @param st The symbol table obtained from semantic analysis.
             * @param flags Not being used yet. May become options.
             * @param sourceText The original source code, provided for annotating the generated code and source mapping.
             */
            function Printer(st, flags, sourceText, beginLine, beginColumn, trace) {
                this.beginLine = beginLine;
                this.beginColumn = beginColumn;
                /**
                 * Used to provide a unique number for generated symbol names.
                 */
                this.gensymCount = 0;
                // this.fileName = fileName;
                this.st = st;
                this.flags = flags;
                this.interactive = false;
                this.nestlevel = 0;
                this.u = null;
                this.stack = [];
                this.result = [];
                // this.gensymcount = 0;
                this.allUnits = [];
                this.source = sourceText ? sourceText.split("\n") : false;
                this.writer = new codeWriter.CodeWriter(beginLine, beginColumn, {}, trace);
            }
            /**
             * This is the entry point for this visitor.
             */
            Printer.prototype.transpileModule = function (module) {
                // Traversing the AST sends commands to the writer.
                this.enterScope("<module>", module, this.beginLine, this.beginColumn);
                this.module(module);
                this.exitScope();
                // Now return the captured events as a transpiled module.
                return this.writer.snapshot();
            };
            /**
             * Looks up the SymbolTableScope.
             * Pushes a new PrinterUnit onto the stack.
             * Returns a string identifying the scope.
             * @param name The name that will be assigned to the PrinterUnit.
             * @param key A scope object in the AST from sematic analysis. Provides the mapping to the SymbolTableScope.
             */
            Printer.prototype.enterScope = function (name, key, beginLine, beginColumn) {
                var u = new PrinterUnit(name, this.st.getStsForAst(key));
                u.beginLine = beginLine;
                u.beginColumn = beginColumn;
                if (this.u && this.u.private_) {
                    u.private_ = this.u.private_;
                }
                this.stack.push(this.u);
                this.allUnits.push(u);
                var scopeName = this.gensym('scope');
                u.scopename = scopeName;
                this.u = u;
                this.u.activateScope();
                this.nestlevel++;
                return scopeName;
            };
            Printer.prototype.exitScope = function () {
                if (this.u) {
                    this.u.deactivateScope();
                }
                this.nestlevel--;
                if (this.stack.length - 1 >= 0) {
                    this.u = this.stack.pop();
                } else {
                    this.u = null;
                }
                if (this.u) {
                    this.u.activateScope();
                }
            };
            Printer.prototype.forStatement = function (fs) {
                var body = fs.body;
                var range = fs.iter;
                var target = fs.target;
                this.writer.write("for", null);
                this.writer.openParen();
                if (range instanceof typhonLang.Call) {
                    this.writer.beginStatement();
                    if (target instanceof typhonLang.Name) {
                        var flags = this.u.ste.symFlags[target.id.value];
                        if (flags && typhonLang.DEF_LOCAL) {
                            if (this.u.declared[target.id.value]) {
                                // The variable has already been declared.
                            } else {
                                // We use let for now because we would need to look ahead for more assignments.
                                // The smenatic analysis could count the number of assignments in the current scope?
                                this.writer.write("let ", null);
                                this.u.declared[target.id.value] = true;
                            }
                        }
                    }
                    target.accept(this);
                    this.writer.write("=", null);
                    var secondArg = range.args[1];
                    var thirdArg = range.args[2];
                    if (range.args[3]) {
                        throw new Error("Too many arguments");
                    }
                    // range() accepts 1 or 2 parameters, if 1 then first param is always 0
                    if (secondArg) {
                        var firstArg = range.args[0];
                        firstArg.accept(this);
                        this.writer.endStatement();
                    } else {
                        this.writer.write("0", null);
                        this.writer.endStatement();
                    }
                    // writing second part of for statement
                    this.writer.beginStatement();
                    target.accept(this);
                    this.writer.write("<", null);
                    secondArg.accept(this);
                    this.writer.endStatement();
                    // writing third part of for statement
                    if (thirdArg) {
                        target.accept(this);
                        this.writer.write("=", null);
                        target.accept(this);
                        this.writer.write("+", null);
                        thirdArg.accept(this);
                    } else {
                        target.accept(this);
                        this.writer.write("++", null);
                    }
                } else if (range instanceof typhonLang.Name) {
                    // "for (" written so far
                    var greedyIterator = range.id.value; // The list to iterate over
                    this.writer.write("let ", null);
                    if (target instanceof typhonLang.Name) {
                        var flags = this.u.ste.symFlags[target.id.value];
                        if (flags && typhonLang.DEF_LOCAL) {
                            if (this.u.declared[target.id.value]) {
                                // The variable has already been declared.
                            } else {
                                // We use let for now because we would need to look ahead for more assignments.
                                // The smenatic analysis could count the number of assignments in the current scope?
                                this.writer.write("let ", null);
                                this.u.declared[target.id.value] = true;
                            }
                        }
                    }
                    target.accept(this);
                    this.writer.write(" of", null);
                    this.writer.write(" " + greedyIterator, null);
                } else {
                    console.log(range);
                    throw new Error("Invalid range... range is instance of " + range.constructor.name + ", not 'Call' or 'Name'");
                }
                this.writer.closeParen();
                this.writer.beginBlock();
                for (var _i = 0, body_1 = body; _i < body_1.length; _i++) {
                    var stmt = body_1[_i];
                    this.writer.beginStatement();
                    stmt.accept(this);
                    this.writer.endStatement();
                }
                this.writer.endBlock();
            };
            /**
             * Generates a unique symbol name for the provided namespace.
             */
            Printer.prototype.gensym = function (namespace) {
                var symbolName = namespace || '';
                symbolName = '$' + symbolName;
                symbolName += this.gensymCount++;
                return symbolName;
            };
            // Everything below here is an implementation of the Visitor
            Printer.prototype.annAssign = function (annassign) {
                this.writer.beginStatement();
                // TODO: Declaration.
                // TODO: How to deal with multiple target?
                /**
                 * Decides whether to write let or not
                 */
                var target = annassign.target;
                if (target instanceof typhonLang.Name) {
                    var flags = this.u.ste.symFlags[target.id.value];
                    if (flags && typhonLang.DEF_LOCAL) {
                        if (this.u.declared[target.id.value]) {
                            // The variable has already been declared.
                        } else {
                            // We use let for now because we would need to look ahead for more assignments.
                            // The smenatic analysis could count the number of assignments in the current scope?
                            this.writer.write("let ", null);
                            this.u.declared[target.id.value] = true;
                        }
                    }
                }
                target.accept(this);
                if (annassign.value) {
                    this.writer.write(":", null);
                    annassign.value.accept(this);
                }
                this.writer.endStatement();
            };
            Printer.prototype.assign = function (assign) {
                this.writer.beginStatement();
                // TODO: Declaration.
                // TODO: How to deal with multiple target?
                /**
                 * Decides whether to write let or not
                 */
                for (var _i = 0, _a = assign.targets; _i < _a.length; _i++) {
                    var target = _a[_i];
                    if (target instanceof typhonLang.Name) {
                        var flags = this.u.ste.symFlags[target.id.value];
                        if (flags && typhonLang.DEF_LOCAL) {
                            if (this.u.declared[target.id.value]) {
                                // The variable has already been declared.
                            } else {
                                // We use let for now because we would need to look ahead for more assignments.
                                // The smenatic analysis could count the number of assignments in the current scope?
                                this.writer.write("let ", null);
                                this.u.declared[target.id.value] = true;
                            }
                        }
                    }
                    target.accept(this);
                    if (assign.type) {
                        this.writer.write(":", null);
                        assign.type.accept(this);
                    }
                }
                this.writer.assign("=", assign.eqRange);
                assign.value.accept(this);
                this.writer.endStatement();
            };
            Printer.prototype.attribute = function (attribute) {
                attribute.value.accept(this);
                this.writer.write(".", null);
                this.writer.str(attribute.attr.value, attribute.attr.range);
            };
            Printer.prototype.binOp = function (be) {
                be.lhs.accept(this);
                var op = be.op;
                var opRange = be.opRange;
                switch (op) {
                    case typhonLang.Add:
                        {
                            this.writer.binOp("+", opRange);
                            break;
                        }
                    case typhonLang.Sub:
                        {
                            this.writer.binOp("-", opRange);
                            break;
                        }
                    case typhonLang.Mult:
                        {
                            this.writer.binOp("*", opRange);
                            break;
                        }
                    case typhonLang.Div:
                        {
                            this.writer.binOp("/", opRange);
                            break;
                        }
                    case typhonLang.BitOr:
                        {
                            this.writer.binOp("|", opRange);
                            break;
                        }
                    case typhonLang.BitXor:
                        {
                            this.writer.binOp("^", opRange);
                            break;
                        }
                    case typhonLang.BitAnd:
                        {
                            this.writer.binOp("&", opRange);
                            break;
                        }
                    case typhonLang.LShift:
                        {
                            this.writer.binOp("<<", opRange);
                            break;
                        }
                    case typhonLang.RShift:
                        {
                            this.writer.binOp(">>", opRange);
                            break;
                        }
                    case typhonLang.Mod:
                        {
                            this.writer.binOp("%", opRange);
                            break;
                        }
                    case typhonLang.FloorDiv:
                        {
                            // TODO: What is the best way to handle FloorDiv.
                            // This doesn't actually exist in TypeScript.
                            this.writer.binOp("//", opRange);
                            break;
                        }
                    default:
                        {
                            throw new Error("Unexpected binary operator " + op + ": " + typeof op);
                        }
                }
                be.rhs.accept(this);
            };
            Printer.prototype.callExpression = function (ce) {
                if (ce.func instanceof typhonLang.Name) {
                    if (isClassNameByConvention(ce.func)) {
                        this.writer.write("new ", null);
                    }
                } else if (ce.func instanceof typhonLang.Attribute) {
                    if (isClassNameByConvention(ce.func)) {
                        this.writer.write("new ", null);
                    }
                } else {
                    throw new Error("Call.func must be a Name " + ce.func);
                }
                ce.func.accept(this);
                this.writer.openParen();
                for (var i = 0; i < ce.args.length; i++) {
                    if (i > 0) {
                        this.writer.comma(null, null);
                    }
                    var arg = ce.args[i];
                    arg.accept(this);
                }
                for (var i = 0; i < ce.keywords.length; ++i) {
                    if (i > 0) {
                        this.writer.comma(null, null);
                    }
                    ce.keywords[i].value.accept(this);
                }
                if (ce.starargs) {
                    ce.starargs.accept(this);
                }
                if (ce.kwargs) {
                    ce.kwargs.accept(this);
                }
                this.writer.closeParen();
            };
            Printer.prototype.classDef = function (cd) {
                this.writer.write("class", null);
                this.writer.space();
                this.writer.name(cd.name.value, cd.name.range);
                // this.writer.openParen();
                // this.writer.closeParen();
                this.writer.beginBlock();
                /*
                this.writer.write("constructor");
                this.writer.openParen();
                this.writer.closeParen();
                this.writer.beginBlock();
                this.writer.endBlock();
                */
                for (var _i = 0, _a = cd.body; _i < _a.length; _i++) {
                    var stmt = _a[_i];
                    stmt.accept(this);
                }
                this.writer.endBlock();
            };
            Printer.prototype.compareExpression = function (ce) {
                ce.left.accept(this);
                for (var _i = 0, _a = ce.ops; _i < _a.length; _i++) {
                    var op = _a[_i];
                    switch (op) {
                        case typhonLang.Eq:
                            {
                                this.writer.write("===", null);
                                break;
                            }
                        case typhonLang.NotEq:
                            {
                                this.writer.write("!==", null);
                                break;
                            }
                        case typhonLang.Lt:
                            {
                                this.writer.write("<", null);
                                break;
                            }
                        case typhonLang.LtE:
                            {
                                this.writer.write("<=", null);
                                break;
                            }
                        case typhonLang.Gt:
                            {
                                this.writer.write(">", null);
                                break;
                            }
                        case typhonLang.GtE:
                            {
                                this.writer.write(">=", null);
                                break;
                            }
                        case typhonLang.Is:
                            {
                                this.writer.write("===", null);
                                break;
                            }
                        case typhonLang.IsNot:
                            {
                                this.writer.write("!==", null);
                                break;
                            }
                        case typhonLang.In:
                            {
                                this.writer.write(" in ", null);
                                break;
                            }
                        case typhonLang.NotIn:
                            {
                                this.writer.write(" not in ", null);
                                break;
                            }
                        default:
                            {
                                throw new Error("Unexpected comparison expression operator: " + op);
                            }
                    }
                }
                for (var _b = 0, _c = ce.comparators; _b < _c.length; _b++) {
                    var comparator = _c[_b];
                    comparator.accept(this);
                }
            };
            Printer.prototype.dict = function (dict) {
                var keys = dict.keys;
                var values = dict.values;
                var N = keys.length;
                this.writer.beginObject();
                for (var i = 0; i < N; i++) {
                    if (i > 0) {
                        this.writer.comma(null, null);
                    }
                    keys[i].accept(this);
                    this.writer.write(":", null);
                    values[i].accept(this);
                }
                this.writer.endObject();
            };
            Printer.prototype.expressionStatement = function (s) {
                this.writer.beginStatement();
                s.value.accept(this);
                this.writer.endStatement();
            };
            Printer.prototype.functionDef = function (functionDef) {
                var isClassMethod = isMethod(functionDef);
                var sts = this.st.getStsForAst(functionDef);
                var parentScope = this.u.ste;
                for (var _i = 0, _a = parentScope.children; _i < _a.length; _i++) {
                    var scope = _a[_i];
                    if (sts === scope) {
                        this.writer.write("export ", null);
                    }
                }
                if (!isClassMethod) {
                    this.writer.write("function ", null);
                }
                this.writer.name(functionDef.name.value, functionDef.name.range);
                this.writer.openParen();
                for (var i = 0; i < functionDef.args.args.length; i++) {
                    var arg = functionDef.args.args[i];
                    var argType = arg.type;
                    if (i === 0) {
                        if (arg.name.id.value === 'self') {
                            // Ignore.
                        } else {
                            arg.name.accept(this);
                            if (argType) {
                                this.writer.write(":", null);
                                argType.accept(this);
                            }
                        }
                    } else {
                        arg.name.accept(this);
                        if (argType) {
                            this.writer.write(":", null);
                            argType.accept(this);
                        }
                    }
                }
                this.writer.closeParen();
                if (functionDef.returnType) {
                    this.writer.write(":", null);
                    functionDef.returnType.accept(this);
                }
                this.writer.beginBlock();
                for (var _b = 0, _c = functionDef.body; _b < _c.length; _b++) {
                    var stmt = _c[_b];
                    stmt.accept(this);
                }
                this.writer.endBlock();
            };
            Printer.prototype.ifStatement = function (i) {
                this.writer.write("if", null);
                this.writer.openParen();
                i.test.accept(this);
                this.writer.closeParen();
                this.writer.beginBlock();
                for (var _i = 0, _a = i.consequent; _i < _a.length; _i++) {
                    var con = _a[_i];
                    con.accept(this);
                }
                this.writer.endBlock();
            };
            Printer.prototype.importFrom = function (importFrom) {
                this.writer.beginStatement();
                this.writer.write("import", null);
                this.writer.space();
                this.writer.beginBlock();
                for (var i = 0; i < importFrom.names.length; i++) {
                    if (i > 0) {
                        this.writer.comma(null, null);
                    }
                    var alias = importFrom.names[i];
                    this.writer.name(alias.name.value, alias.name.range);
                    if (alias.asname) {
                        this.writer.space();
                        this.writer.write("as", null);
                        this.writer.space();
                        this.writer.write(alias.asname, null);
                    }
                }
                this.writer.endBlock();
                this.writer.space();
                this.writer.write("from", null);
                this.writer.space();
                this.writer.str(toStringLiteralJS(importFrom.module.value), importFrom.module.range);
                this.writer.endStatement();
            };
            Printer.prototype.list = function (list) {
                var elements = list.elts;
                var N = elements.length;
                this.writer.write('[', null);
                for (var i = 0; i < N; i++) {
                    if (i > 0) {
                        this.writer.comma(null, null);
                    }
                    elements[i].accept(this);
                }
                this.writer.write(']', null);
            };
            Printer.prototype.module = function (m) {
                for (var _i = 0, _a = m.body; _i < _a.length; _i++) {
                    var stmt = _a[_i];
                    stmt.accept(this);
                }
            };
            Printer.prototype.name = function (name) {
                // TODO: Since 'True' and 'False' are reserved words in Python,
                // syntactic analysis (parsing) should be sufficient to identify
                // this name as a boolean expression - avoiding this overhead.
                var value = name.id.value;
                var range = name.id.range;
                switch (value) {
                    case 'True':
                        {
                            this.writer.name('true', range);
                            break;
                        }
                    case 'False':
                        {
                            this.writer.name('false', range);
                            break;
                        }
                    case 'str':
                        {
                            this.writer.name('string', range);
                            break;
                        }
                    case 'num':
                        {
                            this.writer.name('number', range);
                            break;
                        }
                    case 'None':
                        {
                            this.writer.name('null', range);
                            break;
                        }
                    /*
                    case 'dict': {
                        const testDict = "(function dict(...keys: dictVal[]):Dict {const dict1 = new Dict(keys); return dict1;})";
                        this.writer.name(`${testDict}`, range);
                        break;
                    }
                    */
                    case 'bool':
                        {
                            this.writer.name('boolean', range);
                            break;
                        }
                    default:
                        {
                            this.writer.name(value, range);
                        }
                }
            };
            Printer.prototype.num = function (num) {
                var value = num.n.value;
                var range = num.n.range;
                this.writer.num(value.toString(), range);
            };
            Printer.prototype.print = function (print) {
                this.writer.name("console", null);
                this.writer.write(".", null);
                this.writer.name("log", null);
                this.writer.openParen();
                for (var _i = 0, _a = print.values; _i < _a.length; _i++) {
                    var value = _a[_i];
                    value.accept(this);
                }
                this.writer.closeParen();
            };
            Printer.prototype.returnStatement = function (rs) {
                this.writer.beginStatement();
                this.writer.write("return", null);
                this.writer.write(" ", null);
                rs.value.accept(this);
                this.writer.endStatement();
            };
            Printer.prototype.str = function (str) {
                var s = str.s;
                // const begin = str.begin;
                // const end = str.end;
                this.writer.str(toStringLiteralJS(s.value), s.range);
            };
            return Printer;
        }();
        function transpileModule(sourceText, trace) {
            if (trace === void 0) {
                trace = false;
            }
            var cst = typhonLang.parse(sourceText, typhonLang.SourceKind.File);
            if (typeof cst === 'object') {
                var stmts = typhonLang.astFromParse(cst);
                var mod = new typhonLang.Module(stmts);
                var symbolTable = typhonLang.semanticsOfModule(mod);
                var printer = new Printer(symbolTable, 0, sourceText, 1, 0, trace);
                var textAndMappings = printer.transpileModule(mod);
                var code = textAndMappings.text;
                var sourceMap = mappingTreeToSourceMap(textAndMappings.tree, trace);
                return { code: code, sourceMap: sourceMap };
            } else {
                throw new Error("Error parsing source for file.");
            }
        }
        var NIL_VALUE = new codeWriter.Position(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
        var HI_KEY = new codeWriter.Position(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
        var LO_KEY = new codeWriter.Position(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);
        function mappingTreeToSourceMap(mappingTree, trace) {
            var sourceToTarget = new genericRbtree.RBTree(LO_KEY, HI_KEY, NIL_VALUE, codeWriter.positionComparator);
            var targetToSource = new genericRbtree.RBTree(LO_KEY, HI_KEY, NIL_VALUE, codeWriter.positionComparator);
            if (mappingTree) {
                for (var _i = 0, _a = mappingTree.mappings(); _i < _a.length; _i++) {
                    var mapping = _a[_i];
                    var source = mapping.source;
                    var target = mapping.target;
                    // Convert to immutable values for targets.
                    var tBegin = new codeWriter.Position(target.begin.line, target.begin.column);
                    var tEnd = new codeWriter.Position(target.end.line, target.end.column);
                    if (trace) {
                        console.log(source.begin + " => " + tBegin);
                        console.log(source.end + " => " + tEnd);
                    }
                    sourceToTarget.insert(source.begin, tBegin);
                    sourceToTarget.insert(source.end, tEnd);
                    targetToSource.insert(tBegin, source.begin);
                    targetToSource.insert(tEnd, source.end);
                }
            }
            return new SourceMap(sourceToTarget, targetToSource);
        }

        exports.transpileModule = transpileModule;
        exports.SourceMap = SourceMap;

        Object.defineProperty(exports, '__esModule', { value: true });
    });

});
System.registerDynamic("npm:typhon-typescript@0.3.0.js", ["npm:typhon-typescript@0.3.0/build/browser/index.js"], true, function ($__require, exports, module) {
  var global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:typhon-typescript@0.3.0/build/browser/index.js");
});
System.register("src/mode/python/Linter.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var RuleFailurePosition, Replacement, Fix, RuleFailure, Linter;
    return {
        setters: [],
        execute: function () {
            RuleFailurePosition = function () {
                function RuleFailurePosition(position, lineAndCharacter) {
                    this.position = position;
                    this.lineAndCharacter = lineAndCharacter;
                }
                RuleFailurePosition.prototype.getPosition = function () {
                    return this.position;
                };
                RuleFailurePosition.prototype.getLineAndCharacter = function () {
                    return this.lineAndCharacter;
                };
                RuleFailurePosition.prototype.toJson = function () {
                    return {
                        character: this.lineAndCharacter.character,
                        line: this.lineAndCharacter.line,
                        position: this.position
                    };
                };
                RuleFailurePosition.prototype.equals = function (ruleFailurePosition) {
                    var ll = this.lineAndCharacter;
                    var rr = ruleFailurePosition.lineAndCharacter;
                    return this.position === ruleFailurePosition.position && ll.line === rr.line && ll.character === rr.character;
                };
                return RuleFailurePosition;
            }();
            exports_1("RuleFailurePosition", RuleFailurePosition);
            Replacement = function () {
                function Replacement(innerStart, innerLength, innerText) {
                    this.innerStart = innerStart;
                    this.innerLength = innerLength;
                    this.innerText = innerText;
                }
                Replacement.applyAll = function (content, replacements) {
                    replacements.sort(function (a, b) {
                        return b.end - a.end;
                    });
                    return replacements.reduce(function (text, r) {
                        return r.apply(text);
                    }, content);
                };
                Replacement.replaceFromTo = function (start, end, text) {
                    return new Replacement(start, end - start, text);
                };
                Replacement.deleteText = function (start, length) {
                    return new Replacement(start, length, "");
                };
                Replacement.deleteFromTo = function (start, end) {
                    return new Replacement(start, end - start, "");
                };
                Replacement.appendText = function (start, text) {
                    return new Replacement(start, 0, text);
                };
                Object.defineProperty(Replacement.prototype, "start", {
                    get: function () {
                        return this.innerStart;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Replacement.prototype, "length", {
                    get: function () {
                        return this.innerLength;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Replacement.prototype, "end", {
                    get: function () {
                        return this.innerStart + this.innerLength;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Replacement.prototype, "text", {
                    get: function () {
                        return this.innerText;
                    },
                    enumerable: true,
                    configurable: true
                });
                Replacement.prototype.apply = function (content) {
                    return content.substring(0, this.start) + this.text + content.substring(this.start + this.length);
                };
                return Replacement;
            }();
            exports_1("Replacement", Replacement);
            Fix = function () {
                function Fix(innerRuleName, innerReplacements) {
                    this.innerRuleName = innerRuleName;
                    this.innerReplacements = innerReplacements;
                }
                Fix.applyAll = function (content, fixes) {
                    var replacements = [];
                    for (var _i = 0, fixes_1 = fixes; _i < fixes_1.length; _i++) {
                        var fix = fixes_1[_i];
                        replacements = replacements.concat(fix.replacements);
                    }
                    return Replacement.applyAll(content, replacements);
                };
                Object.defineProperty(Fix.prototype, "ruleName", {
                    get: function () {
                        return this.innerRuleName;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Fix.prototype, "replacements", {
                    get: function () {
                        return this.innerReplacements;
                    },
                    enumerable: true,
                    configurable: true
                });
                Fix.prototype.apply = function (content) {
                    return Replacement.applyAll(content, this.innerReplacements);
                };
                return Fix;
            }();
            exports_1("Fix", Fix);
            RuleFailure = function () {
                function RuleFailure(sourceFile, start, end, failure, ruleName, fix) {
                    this.sourceFile = sourceFile;
                    this.failure = failure;
                    this.ruleName = ruleName;
                    this.fix = fix;
                    this.fileName = sourceFile.fileName;
                    this.startPosition = this.createFailurePosition(start);
                    this.endPosition = this.createFailurePosition(end);
                    this.rawLines = sourceFile.text;
                }
                RuleFailure.prototype.getFileName = function () {
                    return this.fileName;
                };
                RuleFailure.prototype.getRuleName = function () {
                    return this.ruleName;
                };
                RuleFailure.prototype.getStartPosition = function () {
                    return this.startPosition;
                };
                RuleFailure.prototype.getEndPosition = function () {
                    return this.endPosition;
                };
                RuleFailure.prototype.getFailure = function () {
                    return this.failure;
                };
                RuleFailure.prototype.hasFix = function () {
                    return this.fix !== undefined;
                };
                RuleFailure.prototype.getFix = function () {
                    return this.fix;
                };
                RuleFailure.prototype.getRawLines = function () {
                    return this.rawLines;
                };
                RuleFailure.prototype.toJson = function () {
                    return {
                        endPosition: this.endPosition.toJson(),
                        failure: this.failure,
                        fix: this.fix,
                        name: this.fileName,
                        ruleName: this.ruleName,
                        startPosition: this.startPosition.toJson()
                    };
                };
                RuleFailure.prototype.equals = function (ruleFailure) {
                    return this.failure === ruleFailure.getFailure() && this.fileName === ruleFailure.getFileName() && this.startPosition.equals(ruleFailure.getStartPosition()) && this.endPosition.equals(ruleFailure.getEndPosition());
                };
                RuleFailure.prototype.createFailurePosition = function (position) {
                    var lineAndCharacter = this.sourceFile.getLineAndCharacterOfPosition(position);
                    return new RuleFailurePosition(position, lineAndCharacter);
                };
                return RuleFailure;
            }();
            exports_1("RuleFailure", RuleFailure);
            Linter = function () {
                function Linter(options, languageService) {
                    this.failures = [];
                }
                Linter.prototype.lint = function (fileName, configuration) {};
                Linter.prototype.getRuleFailures = function () {
                    return this.failures;
                };
                return Linter;
            }();
            exports_1("Linter", Linter);
        }
    };
});
System.register("src/mode/tslint/error.js", [], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __moduleName = context_1 && context_1.id;
    function isError(possibleError) {
        return possibleError != null && possibleError.message !== undefined;
    }
    exports_1("isError", isError);
    function showWarningOnce(message) {
        if (!shownWarnings.has(message)) {
            console.warn(message);
            shownWarnings.add(message);
        }
    }
    exports_1("showWarningOnce", showWarningOnce);
    var shownWarnings, FatalError;
    return {
        setters: [],
        execute: function () {
            shownWarnings = new Set();
            FatalError = function (_super) {
                __extends(FatalError, _super);
                function FatalError(message, innerError) {
                    var _this = _super.call(this, message) || this;
                    _this.message = message;
                    _this.innerError = innerError;
                    _this.name = FatalError.NAME;
                    _this.stack = new Error().stack;
                    return _this;
                }
                FatalError.NAME = "FatalError";
                return FatalError;
            }(Error);
            exports_1("FatalError", FatalError);
        }
    };
});
System.register("src/mode/tslint/rules/arrayTypeRule.js", ["../language/rule/abstractRule", "../utils", "../language/walker/ruleWalker"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        } else {
            cooked.raw = raw;
        }
        return cooked;
    };
    var __moduleName = context_1 && context_1.id;
    var abstractRule_1, utils_1, ruleWalker_1, OPTION_ARRAY, OPTION_GENERIC, OPTION_ARRAY_SIMPLE, Rule, ArrayTypeWalker, templateObject_1;
    return {
        setters: [function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }, function (utils_1_1) {
            utils_1 = utils_1_1;
        }, function (ruleWalker_1_1) {
            ruleWalker_1 = ruleWalker_1_1;
        }],
        execute: function () {
            OPTION_ARRAY = "array";
            OPTION_GENERIC = "generic";
            OPTION_ARRAY_SIMPLE = "array-simple";
            Rule = function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    var alignWalker = new ArrayTypeWalker(sourceFile, this.getOptions());
                    return this.applyWithWalker(alignWalker);
                };
                Rule.metadata = {
                    ruleName: "array-type",
                    description: "Requires using either 'T[]' or 'Array<T>' for arrays.",
                    hasFix: true,
                    optionsDescription: utils_1.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            One of the following arguments must be provided:\n\n            * `\"", "\"` enforces use of `T[]` for all types T.\n            * `\"", "\"` enforces use of `Array<T>` for all types T.\n            * `\"", "\"` enforces use of `T[]` if `T` is a simple type (primitive or type reference)."], ["\n            One of the following arguments must be provided:\n\n            * \\`\"", "\"\\` enforces use of \\`T[]\\` for all types T.\n            * \\`\"", "\"\\` enforces use of \\`Array<T>\\` for all types T.\n            * \\`\"", "\"\\` enforces use of \\`T[]\\` if \\`T\\` is a simple type (primitive or type reference)."])), OPTION_ARRAY, OPTION_GENERIC, OPTION_ARRAY_SIMPLE),
                    options: {
                        type: "string",
                        enum: [OPTION_ARRAY, OPTION_GENERIC, OPTION_ARRAY_SIMPLE]
                    },
                    optionExamples: ["[true, \"" + OPTION_ARRAY + "\"]", "[true, \"" + OPTION_GENERIC + "\"]", "[true, \"" + OPTION_ARRAY_SIMPLE + "\"]"],
                    type: "style",
                    typescriptOnly: true
                };
                Rule.FAILURE_STRING_ARRAY = "Array type using 'Array<T>' is forbidden. Use 'T[]' instead.";
                Rule.FAILURE_STRING_GENERIC = "Array type using 'T[]' is forbidden. Use 'Array<T>' instead.";
                Rule.FAILURE_STRING_ARRAY_SIMPLE = "Array type using 'Array<T>' is forbidden for simple types. Use 'T[]' instead.";
                Rule.FAILURE_STRING_GENERIC_SIMPLE = "Array type using 'T[]' is forbidden for non-simple types. Use 'Array<T>' instead.";
                return Rule;
            }(abstractRule_1.AbstractRule);
            exports_1("Rule", Rule);
            ArrayTypeWalker = function (_super) {
                __extends(ArrayTypeWalker, _super);
                function ArrayTypeWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ArrayTypeWalker.prototype.visitArrayType = function (node) {
                    var typeName = node.elementType;
                    if (this.hasOption(OPTION_GENERIC) || this.hasOption(OPTION_ARRAY_SIMPLE) && !this.isSimpleType(typeName)) {
                        var failureString = this.hasOption(OPTION_GENERIC) ? Rule.FAILURE_STRING_GENERIC : Rule.FAILURE_STRING_GENERIC_SIMPLE;
                        var parens = typeName.kind === ts.SyntaxKind.ParenthesizedType ? 1 : 0;
                        var space = !parens && node.parent.kind === ts.SyntaxKind.AsExpression && node.getStart() === node.getFullStart() ? " " : "";
                        var fix = this.createFix(this.createReplacement(typeName.getStart(), parens, space + "Array<"), this.createReplacement(typeName.getEnd() - parens, node.getEnd() - typeName.getEnd() + parens, ">"));
                        this.addFailureAtNode(node, failureString, fix);
                    }
                    _super.prototype.visitArrayType.call(this, node);
                };
                ArrayTypeWalker.prototype.visitTypeReference = function (node) {
                    var typeName = node.typeName.getText();
                    if (typeName === "Array" && (this.hasOption(OPTION_ARRAY) || this.hasOption(OPTION_ARRAY_SIMPLE))) {
                        var failureString = this.hasOption(OPTION_ARRAY) ? Rule.FAILURE_STRING_ARRAY : Rule.FAILURE_STRING_ARRAY_SIMPLE;
                        var typeArgs = node.typeArguments;
                        if (!typeArgs || typeArgs.length === 0) {
                            var fix = this.createFix(this.createReplacement(node.getStart(), node.getWidth(), "any[]"));
                            this.addFailureAtNode(node, failureString, fix);
                        } else if (typeArgs && typeArgs.length === 1 && (!this.hasOption(OPTION_ARRAY_SIMPLE) || this.isSimpleType(typeArgs[0]))) {
                            var type = typeArgs[0];
                            var typeStart = type.getStart();
                            var typeEnd = type.getEnd();
                            var parens = type.kind === ts.SyntaxKind.UnionType || type.kind === ts.SyntaxKind.FunctionType || type.kind === ts.SyntaxKind.IntersectionType;
                            var fix = this.createFix(this.createReplacement(node.getStart(), typeStart - node.getStart(), parens ? "(" : ""), this.createReplacement(typeEnd, node.getEnd() - typeEnd, (parens ? ")" : "") + "[]"));
                            this.addFailureAtNode(node, failureString, fix);
                        }
                    }
                    _super.prototype.visitTypeReference.call(this, node);
                };
                ArrayTypeWalker.prototype.isSimpleType = function (nodeType) {
                    switch (nodeType.kind) {
                        case ts.SyntaxKind.AnyKeyword:
                        case ts.SyntaxKind.ArrayType:
                        case ts.SyntaxKind.BooleanKeyword:
                        case ts.SyntaxKind.NullKeyword:
                        case ts.SyntaxKind.UndefinedKeyword:
                        case ts.SyntaxKind.NumberKeyword:
                        case ts.SyntaxKind.StringKeyword:
                        case ts.SyntaxKind.SymbolKeyword:
                        case ts.SyntaxKind.VoidKeyword:
                        case ts.SyntaxKind.NeverKeyword:
                            return true;
                        case ts.SyntaxKind.TypeReference:
                            var node = nodeType;
                            var typeArgs = node.typeArguments;
                            if (!typeArgs || typeArgs.length === 0 || node.typeName.getText() === "Array" && this.isSimpleType(typeArgs[0])) {
                                return true;
                            } else {
                                return false;
                            }
                        default:
                            return false;
                    }
                };
                return ArrayTypeWalker;
            }(ruleWalker_1.RuleWalker);
        }
    };
});
System.register("src/mode/tslint/rules/classNameRule.js", ["../language/rule/abstractRule", "../language/walker/ruleWalker"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __moduleName = context_1 && context_1.id;
    var abstractRule_1, ruleWalker_1, Rule, NameWalker;
    return {
        setters: [function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }, function (ruleWalker_1_1) {
            ruleWalker_1 = ruleWalker_1_1;
        }],
        execute: function () {
            Rule = function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    return this.applyWithWalker(new NameWalker(sourceFile, this.getOptions()));
                };
                Rule.metadata = {
                    ruleName: "class-name",
                    description: "Enforces PascalCased class and interface names.",
                    rationale: "Makes it easy to differentiate classes from regular variables at a glance.",
                    optionsDescription: "Not configurable.",
                    options: null,
                    optionExamples: ["true"],
                    type: "style",
                    typescriptOnly: false
                };
                Rule.FAILURE_STRING = "Class name must be in pascal case";
                return Rule;
            }(abstractRule_1.AbstractRule);
            exports_1("Rule", Rule);
            NameWalker = function (_super) {
                __extends(NameWalker, _super);
                function NameWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                NameWalker.prototype.visitClassDeclaration = function (node) {
                    if (node.name != null) {
                        var className = node.name.getText();
                        if (!this.isPascalCased(className)) {
                            this.addFailureAtNode(node.name, Rule.FAILURE_STRING);
                        }
                    }
                    _super.prototype.visitClassDeclaration.call(this, node);
                };
                NameWalker.prototype.visitInterfaceDeclaration = function (node) {
                    var interfaceName = node.name.getText();
                    if (!this.isPascalCased(interfaceName)) {
                        this.addFailureAtNode(node.name, Rule.FAILURE_STRING);
                    }
                    _super.prototype.visitInterfaceDeclaration.call(this, node);
                };
                NameWalker.prototype.isPascalCased = function (name) {
                    if (name.length <= 0) {
                        return true;
                    }
                    var firstCharacter = name.charAt(0);
                    return firstCharacter === firstCharacter.toUpperCase() && name.indexOf("_") === -1;
                };
                return NameWalker;
            }(ruleWalker_1.RuleWalker);
        }
    };
});
System.register("src/mode/tslint/rules/commentFormatRule.js", ["../language/rule/abstractRule", "../language/utils", "../utils", "../language/walker/ruleWalker"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        } else {
            cooked.raw = raw;
        }
        return cooked;
    };
    var __moduleName = context_1 && context_1.id;
    function startsWith(commentText, changeCase) {
        if (commentText.length <= 2) {
            return true;
        }
        var firstCharacterMatch = commentText.match(/^\/\/\s*(\w)/);
        if (firstCharacterMatch != null) {
            var firstCharacter = firstCharacterMatch[1];
            return firstCharacter === changeCase(firstCharacter);
        } else {
            return true;
        }
    }
    function startsWithLowercase(commentText) {
        return startsWith(commentText, function (c) {
            return c.toLowerCase();
        });
    }
    function startsWithUppercase(commentText) {
        return startsWith(commentText, function (c) {
            return c.toUpperCase();
        });
    }
    function startsWithSpace(commentText) {
        if (commentText.length <= 2) {
            return true;
        }
        var commentBody = commentText.substring(2);
        if (/^#(end)?region/.test(commentBody)) {
            return true;
        }
        if (/^noinspection\s/.test(commentBody)) {
            return true;
        }
        var firstCharacter = commentBody.charAt(0);
        return firstCharacter === " " || firstCharacter === "/";
    }
    function isEnableDisableFlag(commentText) {
        return (/^(\/\*|\/\/)\s*tslint:(enable|disable)/.test(commentText)
        );
    }
    var abstractRule_1, utils_1, utils_2, ruleWalker_1, utils_3, OPTION_SPACE, OPTION_LOWERCASE, OPTION_UPPERCASE, Rule, CommentWalker, templateObject_1;
    return {
        setters: [function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }, function (utils_1_1) {
            utils_1 = utils_1_1;
        }, function (utils_2_1) {
            utils_2 = utils_2_1;
            utils_3 = utils_2_1;
        }, function (ruleWalker_1_1) {
            ruleWalker_1 = ruleWalker_1_1;
        }],
        execute: function () {
            OPTION_SPACE = "check-space";
            OPTION_LOWERCASE = "check-lowercase";
            OPTION_UPPERCASE = "check-uppercase";
            Rule = function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    return this.applyWithWalker(new CommentWalker(sourceFile, this.getOptions()));
                };
                Rule.metadata = {
                    ruleName: "comment-format",
                    description: "Enforces formatting rules for single-line comments.",
                    rationale: "Helps maintain a consistent, readable style in your codebase.",
                    optionsDescription: utils_2.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            Three arguments may be optionally provided:\n\n            * `\"check-space\"` requires that all single-line comments must begin with a space, as in `// comment`\n                * note that comments starting with `///` are also allowed, for things such as `///<reference>`\n            * `\"check-lowercase\"` requires that the first non-whitespace character of a comment must be lowercase, if applicable.\n            * `\"check-uppercase\"` requires that the first non-whitespace character of a comment must be uppercase, if applicable.\n            \n            Exceptions to `\"check-lowercase\"` or `\"check-uppercase\"` can be managed with object that may be passed as last argument.\n            \n            One of two options can be provided in this object:\n                \n                * `\"ignore-words\"`  - array of strings - words that will be ignored at the beginning of the comment.\n                * `\"ignore-pattern\"` - string - RegExp pattern that will be ignored at the beginning of the comment.\n            "], ["\n            Three arguments may be optionally provided:\n\n            * \\`\"check-space\"\\` requires that all single-line comments must begin with a space, as in \\`// comment\\`\n                * note that comments starting with \\`///\\` are also allowed, for things such as \\`///<reference>\\`\n            * \\`\"check-lowercase\"\\` requires that the first non-whitespace character of a comment must be lowercase, if applicable.\n            * \\`\"check-uppercase\"\\` requires that the first non-whitespace character of a comment must be uppercase, if applicable.\n            \n            Exceptions to \\`\"check-lowercase\"\\` or \\`\"check-uppercase\"\\` can be managed with object that may be passed as last argument.\n            \n            One of two options can be provided in this object:\n                \n                * \\`\"ignore-words\"\\`  - array of strings - words that will be ignored at the beginning of the comment.\n                * \\`\"ignore-pattern\"\\` - string - RegExp pattern that will be ignored at the beginning of the comment.\n            "]))),
                    options: {
                        type: "array",
                        items: {
                            anyOf: [{
                                type: "string",
                                enum: ["check-space", "check-lowercase", "check-uppercase"]
                            }, {
                                type: "object",
                                properties: {
                                    "ignore-words": {
                                        type: "array",
                                        items: {
                                            type: "string"
                                        }
                                    },
                                    "ignore-pattern": {
                                        type: "string"
                                    }
                                },
                                minProperties: 1,
                                maxProperties: 1
                            }]
                        },
                        minLength: 1,
                        maxLength: 4
                    },
                    optionExamples: ['[true, "check-space", "check-uppercase"]', '[true, "check-lowercase", {"ignore-words": ["TODO", "HACK"]}]', '[true, "check-lowercase", {"ignore-pattern": "STD\\w{2,3}\\b"}]'],
                    type: "style",
                    typescriptOnly: false
                };
                Rule.LOWERCASE_FAILURE = "comment must start with lowercase letter";
                Rule.UPPERCASE_FAILURE = "comment must start with uppercase letter";
                Rule.LEADING_SPACE_FAILURE = "comment must start with a space";
                Rule.IGNORE_WORDS_FAILURE_FACTORY = function (words) {
                    return " or the word(s): " + words.join(", ");
                };
                Rule.IGNORE_PATTERN_FAILURE_FACTORY = function (pattern) {
                    return " or its start must match the regex pattern \"" + pattern + "\"";
                };
                return Rule;
            }(abstractRule_1.AbstractRule);
            exports_1("Rule", Rule);
            CommentWalker = function (_super) {
                __extends(CommentWalker, _super);
                function CommentWalker(sourceFile, options) {
                    var _this = _super.call(this, sourceFile, options) || this;
                    _this.failureIgnorePart = "";
                    _this.exceptionsRegExp = _this.composeExceptionsRegExp();
                    return _this;
                }
                CommentWalker.prototype.visitSourceFile = function (node) {
                    var _this = this;
                    utils_1.forEachComment(node, function (fullText, kind, pos) {
                        if (kind === ts.SyntaxKind.SingleLineCommentTrivia) {
                            var commentText = fullText.substring(pos.tokenStart, pos.end);
                            var startPosition = pos.tokenStart + 2;
                            var width = commentText.length - 2;
                            if (_this.hasOption(OPTION_SPACE)) {
                                if (!startsWithSpace(commentText)) {
                                    _this.addFailureAt(startPosition, width, Rule.LEADING_SPACE_FAILURE);
                                }
                            }
                            if (_this.hasOption(OPTION_LOWERCASE)) {
                                if (!startsWithLowercase(commentText) && !_this.startsWithException(commentText)) {
                                    _this.addFailureAt(startPosition, width, Rule.LOWERCASE_FAILURE + _this.failureIgnorePart);
                                }
                            }
                            if (_this.hasOption(OPTION_UPPERCASE)) {
                                if (!startsWithUppercase(commentText) && !isEnableDisableFlag(commentText) && !_this.startsWithException(commentText)) {
                                    _this.addFailureAt(startPosition, width, Rule.UPPERCASE_FAILURE + _this.failureIgnorePart);
                                }
                            }
                        }
                    });
                };
                CommentWalker.prototype.startsWithException = function (commentText) {
                    if (this.exceptionsRegExp == null) {
                        return false;
                    }
                    return this.exceptionsRegExp.test(commentText);
                };
                CommentWalker.prototype.composeExceptionsRegExp = function () {
                    var optionsList = this.getOptions();
                    var exceptionsObject = optionsList[optionsList.length - 1];
                    if (typeof exceptionsObject === "string" || !exceptionsObject) {
                        return null;
                    }
                    if (exceptionsObject["ignore-pattern"]) {
                        var ignorePattern = exceptionsObject["ignore-pattern"];
                        this.failureIgnorePart = Rule.IGNORE_PATTERN_FAILURE_FACTORY(ignorePattern);
                        return new RegExp("^//\\s*(" + ignorePattern + ")");
                    }
                    if (exceptionsObject["ignore-words"]) {
                        var ignoreWords = exceptionsObject["ignore-words"];
                        this.failureIgnorePart = Rule.IGNORE_WORDS_FAILURE_FACTORY(ignoreWords);
                        var wordsPattern = ignoreWords.map(String).map(function (str) {
                            return str.trim();
                        }).map(utils_3.escapeRegExp).join("|");
                        return new RegExp("^//\\s*(" + wordsPattern + ")\\b");
                    }
                    return null;
                };
                return CommentWalker;
            }(ruleWalker_1.RuleWalker);
        }
    };
});
System.register("src/mode/tslint/rules/curlyRule.js", ["../language/rule/abstractRule", "../language/utils", "../utils", "../language/walker/ruleWalker"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        } else {
            cooked.raw = raw;
        }
        return cooked;
    };
    var __moduleName = context_1 && context_1.id;
    function isStatementBraced(node) {
        return node.kind === ts.SyntaxKind.Block;
    }
    var abstractRule_1, utils_1, utils_2, ruleWalker_1, Rule, CurlyWalker, templateObject_1;
    return {
        setters: [function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }, function (utils_1_1) {
            utils_1 = utils_1_1;
        }, function (utils_2_1) {
            utils_2 = utils_2_1;
        }, function (ruleWalker_1_1) {
            ruleWalker_1 = ruleWalker_1_1;
        }],
        execute: function () {
            Rule = function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    return this.applyWithWalker(new CurlyWalker(sourceFile, this.getOptions()));
                };
                Rule.metadata = {
                    ruleName: "curly",
                    description: "Enforces braces for `if`/`for`/`do`/`while` statements.",
                    rationale: utils_2.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            ```ts\n            if (foo === bar)\n                foo++;\n                bar++;\n            ```\n\n            In the code above, the author almost certainly meant for both `foo++` and `bar++`\n            to be executed only if `foo === bar`. However, he forgot braces and `bar++` will be executed\n            no matter what. This rule could prevent such a mistake."], ["\n            \\`\\`\\`ts\n            if (foo === bar)\n                foo++;\n                bar++;\n            \\`\\`\\`\n\n            In the code above, the author almost certainly meant for both \\`foo++\\` and \\`bar++\\`\n            to be executed only if \\`foo === bar\\`. However, he forgot braces and \\`bar++\\` will be executed\n            no matter what. This rule could prevent such a mistake."]))),
                    optionsDescription: "Not configurable.",
                    options: null,
                    optionExamples: ["true"],
                    type: "functionality",
                    typescriptOnly: false
                };
                Rule.DO_FAILURE_STRING = "do statements must be braced";
                Rule.ELSE_FAILURE_STRING = "else statements must be braced";
                Rule.FOR_FAILURE_STRING = "for statements must be braced";
                Rule.IF_FAILURE_STRING = "if statements must be braced";
                Rule.WHILE_FAILURE_STRING = "while statements must be braced";
                return Rule;
            }(abstractRule_1.AbstractRule);
            exports_1("Rule", Rule);
            CurlyWalker = function (_super) {
                __extends(CurlyWalker, _super);
                function CurlyWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                CurlyWalker.prototype.visitForInStatement = function (node) {
                    if (!isStatementBraced(node.statement)) {
                        this.addFailureAtNode(node, Rule.FOR_FAILURE_STRING);
                    }
                    _super.prototype.visitForInStatement.call(this, node);
                };
                CurlyWalker.prototype.visitForOfStatement = function (node) {
                    if (!isStatementBraced(node.statement)) {
                        this.addFailureAtNode(node, Rule.FOR_FAILURE_STRING);
                    }
                    _super.prototype.visitForOfStatement.call(this, node);
                };
                CurlyWalker.prototype.visitForStatement = function (node) {
                    if (!isStatementBraced(node.statement)) {
                        this.addFailureAtNode(node, Rule.FOR_FAILURE_STRING);
                    }
                    _super.prototype.visitForStatement.call(this, node);
                };
                CurlyWalker.prototype.visitIfStatement = function (node) {
                    if (!isStatementBraced(node.thenStatement)) {
                        this.addFailureFromStartToEnd(node.getStart(), node.thenStatement.getEnd(), Rule.IF_FAILURE_STRING);
                    }
                    if (node.elseStatement != null && node.elseStatement.kind !== ts.SyntaxKind.IfStatement && !isStatementBraced(node.elseStatement)) {
                        var elseKeywordNode = utils_1.childOfKind(node, ts.SyntaxKind.ElseKeyword);
                        this.addFailureFromStartToEnd(elseKeywordNode.getStart(), node.elseStatement.getEnd(), Rule.ELSE_FAILURE_STRING);
                    }
                    _super.prototype.visitIfStatement.call(this, node);
                };
                CurlyWalker.prototype.visitDoStatement = function (node) {
                    if (!isStatementBraced(node.statement)) {
                        this.addFailureAtNode(node, Rule.DO_FAILURE_STRING);
                    }
                    _super.prototype.visitDoStatement.call(this, node);
                };
                CurlyWalker.prototype.visitWhileStatement = function (node) {
                    if (!isStatementBraced(node.statement)) {
                        this.addFailureAtNode(node, Rule.WHILE_FAILURE_STRING);
                    }
                    _super.prototype.visitWhileStatement.call(this, node);
                };
                return CurlyWalker;
            }(ruleWalker_1.RuleWalker);
        }
    };
});
System.register("src/mode/tslint/rules/eoflineRule.js", ["../language/rule/abstractRule", "../language/rule/rule"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __moduleName = context_1 && context_1.id;
    var abstractRule_1, rule_1, Rule;
    return {
        setters: [function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }, function (rule_1_1) {
            rule_1 = rule_1_1;
        }],
        execute: function () {
            Rule = function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    var length = sourceFile.text.length;
                    if (length === 0 || sourceFile.text[length - 1] === "\n") {
                        return [];
                    }
                    return this.filterFailures([new rule_1.RuleFailure(sourceFile, length, length, Rule.FAILURE_STRING, this.getOptions().ruleName)]);
                };
                Rule.metadata = {
                    ruleName: "eofline",
                    description: "Ensures the file ends with a newline.",
                    rationale: "It is a [standard convention](http://stackoverflow.com/q/729692/3124288) to end files with a newline.",
                    optionsDescription: "Not configurable.",
                    options: null,
                    optionExamples: ["true"],
                    type: "maintainability",
                    typescriptOnly: false
                };
                Rule.FAILURE_STRING = "file should end with a newline";
                return Rule;
            }(abstractRule_1.AbstractRule);
            exports_1("Rule", Rule);
        }
    };
});
System.register("src/mode/tslint/rules/forinRule.js", ["../language/rule/abstractRule", "../utils", "../language/walker/ruleWalker"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        } else {
            cooked.raw = raw;
        }
        return cooked;
    };
    var __moduleName = context_1 && context_1.id;
    function nodeIsContinue(node) {
        var kind = node.kind;
        if (kind === ts.SyntaxKind.ContinueStatement) {
            return true;
        }
        if (kind === ts.SyntaxKind.Block) {
            var blockStatements = node.statements;
            if (blockStatements.length === 1 && blockStatements[0].kind === ts.SyntaxKind.ContinueStatement) {
                return true;
            }
        }
        return false;
    }
    var abstractRule_1, utils_1, ruleWalker_1, Rule, ForInWalker, templateObject_1;
    return {
        setters: [function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }, function (utils_1_1) {
            utils_1 = utils_1_1;
        }, function (ruleWalker_1_1) {
            ruleWalker_1 = ruleWalker_1_1;
        }],
        execute: function () {
            Rule = function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    return this.applyWithWalker(new ForInWalker(sourceFile, this.getOptions()));
                };
                Rule.metadata = {
                    ruleName: "forin",
                    description: "Requires a `for ... in` statement to be filtered with an `if` statement.",
                    rationale: utils_1.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            ```ts\n            for (let key in someObject) {\n                if (someObject.hasOwnProperty(key)) {\n                    // code here\n                }\n            }\n            ```\n            Prevents accidental iteration over properties inherited from an object's prototype.\n            See [MDN's `for...in`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in)\n            documentation for more information about `for...in` loops."], ["\n            \\`\\`\\`ts\n            for (let key in someObject) {\n                if (someObject.hasOwnProperty(key)) {\n                    // code here\n                }\n            }\n            \\`\\`\\`\n            Prevents accidental iteration over properties inherited from an object's prototype.\n            See [MDN's \\`for...in\\`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in)\n            documentation for more information about \\`for...in\\` loops."]))),
                    optionsDescription: "Not configurable.",
                    options: null,
                    optionExamples: ["true"],
                    type: "functionality",
                    typescriptOnly: false
                };
                Rule.FAILURE_STRING = "for (... in ...) statements must be filtered with an if statement";
                return Rule;
            }(abstractRule_1.AbstractRule);
            exports_1("Rule", Rule);
            ForInWalker = function (_super) {
                __extends(ForInWalker, _super);
                function ForInWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ForInWalker.prototype.visitForInStatement = function (node) {
                    this.handleForInStatement(node);
                    _super.prototype.visitForInStatement.call(this, node);
                };
                ForInWalker.prototype.handleForInStatement = function (node) {
                    var statement = node.statement;
                    var statementKind = node.statement.kind;
                    if (statementKind === ts.SyntaxKind.IfStatement) {
                        return;
                    }
                    if (statementKind === ts.SyntaxKind.Block) {
                        var blockNode = statement;
                        var blockStatements = blockNode.statements;
                        if (blockStatements.length >= 1) {
                            var firstBlockStatement = blockStatements[0];
                            if (firstBlockStatement.kind === ts.SyntaxKind.IfStatement) {
                                if (blockStatements.length === 1) {
                                    return;
                                }
                                var ifStatement = firstBlockStatement.thenStatement;
                                if (nodeIsContinue(ifStatement)) {
                                    return;
                                }
                            }
                        }
                    }
                    this.addFailureAtNode(node, Rule.FAILURE_STRING);
                };
                return ForInWalker;
            }(ruleWalker_1.RuleWalker);
        }
    };
});
System.register("src/mode/tslint/rules/indentRule.js", ["../language/rule/abstractRule", "../utils", "../language/walker/ruleWalker"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        } else {
            cooked.raw = raw;
        }
        return cooked;
    };
    var __moduleName = context_1 && context_1.id;
    var abstractRule_1, utils_1, ruleWalker_1, OPTION_USE_TABS, OPTION_USE_SPACES, Rule, IndentWalker, templateObject_1, templateObject_2;
    return {
        setters: [function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }, function (utils_1_1) {
            utils_1 = utils_1_1;
        }, function (ruleWalker_1_1) {
            ruleWalker_1 = ruleWalker_1_1;
        }],
        execute: function () {
            OPTION_USE_TABS = "tabs";
            OPTION_USE_SPACES = "spaces";
            Rule = function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    return this.applyWithWalker(new IndentWalker(sourceFile, this.getOptions()));
                };
                Rule.metadata = {
                    ruleName: "indent",
                    description: "Enforces indentation with tabs or spaces.",
                    rationale: utils_1.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            Using only one of tabs or spaces for indentation leads to more consistent editor behavior,\n            cleaner diffs in version control, and easier programmatic manipulation."], ["\n            Using only one of tabs or spaces for indentation leads to more consistent editor behavior,\n            cleaner diffs in version control, and easier programmatic manipulation."]))),
                    optionsDescription: utils_1.dedent(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n            One of the following arguments must be provided:\n\n            * `\"spaces\"` enforces consistent spaces.\n            * `\"tabs\"` enforces consistent tabs."], ["\n            One of the following arguments must be provided:\n\n            * \\`\"spaces\"\\` enforces consistent spaces.\n            * \\`\"tabs\"\\` enforces consistent tabs."]))),
                    options: {
                        type: "string",
                        enum: ["tabs", "spaces"]
                    },
                    optionExamples: ['[true, "spaces"]'],
                    type: "maintainability",
                    typescriptOnly: false
                };
                Rule.FAILURE_STRING_TABS = "tab indentation expected";
                Rule.FAILURE_STRING_SPACES = "space indentation expected";
                return Rule;
            }(abstractRule_1.AbstractRule);
            exports_1("Rule", Rule);
            IndentWalker = function (_super) {
                __extends(IndentWalker, _super);
                function IndentWalker(sourceFile, options) {
                    var _this = _super.call(this, sourceFile, options) || this;
                    if (_this.hasOption(OPTION_USE_TABS)) {
                        _this.regExp = new RegExp(" ");
                        _this.failureString = Rule.FAILURE_STRING_TABS;
                    } else if (_this.hasOption(OPTION_USE_SPACES)) {
                        _this.regExp = new RegExp("\t");
                        _this.failureString = Rule.FAILURE_STRING_SPACES;
                    }
                    return _this;
                }
                IndentWalker.prototype.visitSourceFile = function (node) {
                    if (!this.hasOption(OPTION_USE_TABS) && !this.hasOption(OPTION_USE_SPACES)) {
                        return;
                    }
                    var endOfComment = -1;
                    var endOfTemplateString = -1;
                    var scanner = ts.createScanner(ts.ScriptTarget.ES5, false, ts.LanguageVariant.Standard, node.text);
                    for (var _i = 0, _a = node.getLineStarts(); _i < _a.length; _i++) {
                        var lineStart = _a[_i];
                        if (lineStart < endOfComment || lineStart < endOfTemplateString) {
                            continue;
                        }
                        scanner.setTextPos(lineStart);
                        var currentScannedType = scanner.scan();
                        var fullLeadingWhitespace = "";
                        var lastStartPos = -1;
                        while (currentScannedType === ts.SyntaxKind.WhitespaceTrivia) {
                            var startPos = scanner.getStartPos();
                            if (startPos === lastStartPos) {
                                break;
                            }
                            lastStartPos = startPos;
                            fullLeadingWhitespace += scanner.getTokenText();
                            currentScannedType = scanner.scan();
                        }
                        var commentRanges = ts.getTrailingCommentRanges(node.text, lineStart);
                        if (commentRanges) {
                            endOfComment = commentRanges[commentRanges.length - 1].end;
                        } else {
                            var scanType = currentScannedType;
                            while (scanType !== ts.SyntaxKind.NewLineTrivia && scanType !== ts.SyntaxKind.EndOfFileToken) {
                                if (scanType === ts.SyntaxKind.NoSubstitutionTemplateLiteral) {
                                    endOfTemplateString = scanner.getStartPos() + scanner.getTokenText().length;
                                } else if (scanType === ts.SyntaxKind.TemplateHead) {
                                    while (scanType !== ts.SyntaxKind.TemplateTail && scanType !== ts.SyntaxKind.EndOfFileToken) {
                                        scanType = scanner.scan();
                                        if (scanType === ts.SyntaxKind.CloseBraceToken) {
                                            scanType = scanner.reScanTemplateToken();
                                        }
                                    }
                                    endOfTemplateString = scanner.getStartPos() + scanner.getTokenText().length;
                                }
                                scanType = scanner.scan();
                            }
                        }
                        if (currentScannedType === ts.SyntaxKind.SingleLineCommentTrivia || currentScannedType === ts.SyntaxKind.MultiLineCommentTrivia || currentScannedType === ts.SyntaxKind.NewLineTrivia) {
                            continue;
                        }
                        if (fullLeadingWhitespace.match(this.regExp)) {
                            this.addFailureAt(lineStart, fullLeadingWhitespace.length, this.failureString);
                        }
                    }
                };
                return IndentWalker;
            }(ruleWalker_1.RuleWalker);
        }
    };
});
System.register("src/mode/tslint/rules/interfaceNameRule.js", ["../language/rule/abstractRule", "../utils", "../language/walker/ruleWalker"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        } else {
            cooked.raw = raw;
        }
        return cooked;
    };
    var __moduleName = context_1 && context_1.id;
    var abstractRule_1, utils_1, ruleWalker_1, OPTION_ALWAYS, OPTION_NEVER, Rule, NameWalker, templateObject_1;
    return {
        setters: [function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }, function (utils_1_1) {
            utils_1 = utils_1_1;
        }, function (ruleWalker_1_1) {
            ruleWalker_1 = ruleWalker_1_1;
        }],
        execute: function () {
            OPTION_ALWAYS = "always-prefix";
            OPTION_NEVER = "never-prefix";
            Rule = function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    return this.applyWithWalker(new NameWalker(sourceFile, this.getOptions()));
                };
                Rule.metadata = {
                    ruleName: "interface-name",
                    description: "Requires interface names to begin with a capital 'I'",
                    rationale: "Makes it easy to differentiate interfaces from regular classes at a glance.",
                    optionsDescription: utils_1.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            One of the following two options must be provided:\n\n            * `\"", "\"` requires interface names to start with an \"I\"\n            * `\"", "\"` requires interface names to not have an \"I\" prefix"], ["\n            One of the following two options must be provided:\n\n            * \\`\"", "\"\\` requires interface names to start with an \"I\"\n            * \\`\"", "\"\\` requires interface names to not have an \"I\" prefix"])), OPTION_ALWAYS, OPTION_NEVER),
                    options: {
                        type: "string",
                        enum: [OPTION_ALWAYS, OPTION_NEVER]
                    },
                    optionExamples: ["[true, \"" + OPTION_ALWAYS + "\"]", "[true, \"" + OPTION_NEVER + "\"]"],
                    type: "style",
                    typescriptOnly: true
                };
                Rule.FAILURE_STRING = "interface name must start with a capitalized I";
                Rule.FAILURE_STRING_NO_PREFIX = "interface name must not have an \"I\" prefix";
                return Rule;
            }(abstractRule_1.AbstractRule);
            exports_1("Rule", Rule);
            NameWalker = function (_super) {
                __extends(NameWalker, _super);
                function NameWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                NameWalker.prototype.visitInterfaceDeclaration = function (node) {
                    var interfaceName = node.name.text;
                    var always = this.hasOption(OPTION_ALWAYS) || this.getOptions() && this.getOptions().length === 0;
                    if (always) {
                        if (!this.startsWithI(interfaceName)) {
                            this.addFailureAtNode(node.name, Rule.FAILURE_STRING);
                        }
                    } else if (this.hasOption(OPTION_NEVER)) {
                        if (this.hasPrefixI(interfaceName)) {
                            this.addFailureAtNode(node.name, Rule.FAILURE_STRING_NO_PREFIX);
                        }
                    }
                    _super.prototype.visitInterfaceDeclaration.call(this, node);
                };
                NameWalker.prototype.startsWithI = function (name) {
                    if (name.length <= 0) {
                        return true;
                    }
                    var firstCharacter = name.charAt(0);
                    return firstCharacter === "I";
                };
                NameWalker.prototype.hasPrefixI = function (name) {
                    if (name.length <= 0) {
                        return true;
                    }
                    var firstCharacter = name.charAt(0);
                    if (firstCharacter !== "I") {
                        return false;
                    }
                    var secondCharacter = name.charAt(1);
                    if (secondCharacter === "") {
                        return false;
                    } else if (secondCharacter !== secondCharacter.toUpperCase()) {
                        return false;
                    }
                    if (name.indexOf("IDB") === 0) {
                        return false;
                    }
                    return true;
                };
                return NameWalker;
            }(ruleWalker_1.RuleWalker);
        }
    };
});
System.register("src/mode/tslint/rules/jsdocFormatRule.js", ["../language/rule/abstractRule", "../language/utils", "../utils", "../language/walker/ruleWalker"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        } else {
            cooked.raw = raw;
        }
        return cooked;
    };
    var __moduleName = context_1 && context_1.id;
    var abstractRule_1, utils_1, utils_2, ruleWalker_1, Rule, JsdocWalker, templateObject_1;
    return {
        setters: [function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }, function (utils_1_1) {
            utils_1 = utils_1_1;
        }, function (utils_2_1) {
            utils_2 = utils_2_1;
        }, function (ruleWalker_1_1) {
            ruleWalker_1 = ruleWalker_1_1;
        }],
        execute: function () {
            Rule = function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    return this.applyWithWalker(new JsdocWalker(sourceFile, this.getOptions()));
                };
                Rule.metadata = {
                    ruleName: "jsdoc-format",
                    description: "Enforces basic format rules for JSDoc comments.",
                    descriptionDetails: utils_2.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            The following rules are enforced for JSDoc comments (comments starting with `/**`):\n\n            * each line contains an asterisk and asterisks must be aligned\n            * each asterisk must be followed by either a space or a newline (except for the first and the last)\n            * the only characters before the asterisk on each line must be whitespace characters\n            * one line comments must start with `/** ` and end with `*/`"], ["\n            The following rules are enforced for JSDoc comments (comments starting with \\`/**\\`):\n\n            * each line contains an asterisk and asterisks must be aligned\n            * each asterisk must be followed by either a space or a newline (except for the first and the last)\n            * the only characters before the asterisk on each line must be whitespace characters\n            * one line comments must start with \\`/** \\` and end with \\`*/\\`"]))),
                    rationale: "Helps maintain a consistent, readable style for JSDoc comments.",
                    optionsDescription: "Not configurable.",
                    options: null,
                    optionExamples: ["true"],
                    type: "style",
                    typescriptOnly: false
                };
                Rule.ALIGNMENT_FAILURE_STRING = "asterisks in jsdoc must be aligned";
                Rule.FORMAT_FAILURE_STRING = "jsdoc is not formatted correctly on this line";
                return Rule;
            }(abstractRule_1.AbstractRule);
            exports_1("Rule", Rule);
            JsdocWalker = function (_super) {
                __extends(JsdocWalker, _super);
                function JsdocWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                JsdocWalker.prototype.visitSourceFile = function (node) {
                    var _this = this;
                    utils_1.forEachComment(node, function (fullText, kind, pos) {
                        if (kind === ts.SyntaxKind.MultiLineCommentTrivia) {
                            _this.findFailuresForJsdocComment(fullText.substring(pos.tokenStart, pos.end), pos.tokenStart);
                        }
                    });
                };
                JsdocWalker.prototype.findFailuresForJsdocComment = function (commentText, startingPosition) {
                    var currentPosition = startingPosition;
                    var lines = commentText.split(/\r?\n/);
                    var firstLine = lines[0];
                    var jsdocPosition = currentPosition;
                    var isJsdocMatch = firstLine.match(/^\s*\/\*\*([^*]|$)/);
                    if (isJsdocMatch != null) {
                        if (lines.length === 1) {
                            var firstLineMatch = firstLine.match(/^\s*\/\*\* (.* )?\*\/$/);
                            if (firstLineMatch == null) {
                                this.addFailureAt(jsdocPosition, firstLine.length, Rule.FORMAT_FAILURE_STRING);
                            }
                            return;
                        }
                        var indexToMatch = firstLine.indexOf("**") + this.getLineAndCharacterOfPosition(currentPosition).character;
                        var otherLines = lines.splice(1, lines.length - 2);
                        jsdocPosition += firstLine.length + 1;
                        for (var _i = 0, otherLines_1 = otherLines; _i < otherLines_1.length; _i++) {
                            var line = otherLines_1[_i];
                            var asteriskMatch = line.match(/^\s*\*( |$)/);
                            if (asteriskMatch == null) {
                                this.addFailureAt(jsdocPosition, line.length, Rule.FORMAT_FAILURE_STRING);
                            }
                            var asteriskIndex = line.indexOf("*");
                            if (asteriskIndex !== indexToMatch) {
                                this.addFailureAt(jsdocPosition, line.length, Rule.ALIGNMENT_FAILURE_STRING);
                            }
                            jsdocPosition += line.length + 1;
                        }
                        var lastLine = lines[lines.length - 1];
                        var endBlockCommentMatch = lastLine.match(/^\s*\*\/$/);
                        if (endBlockCommentMatch == null) {
                            this.addFailureAt(jsdocPosition, lastLine.length, Rule.FORMAT_FAILURE_STRING);
                        }
                        var lastAsteriskIndex = lastLine.indexOf("*");
                        if (lastAsteriskIndex !== indexToMatch) {
                            this.addFailureAt(jsdocPosition, lastLine.length, Rule.ALIGNMENT_FAILURE_STRING);
                        }
                    }
                };
                return JsdocWalker;
            }(ruleWalker_1.RuleWalker);
        }
    };
});
System.register("src/mode/tslint/rules/labelPositionRule.js", ["../language/rule/abstractRule", "../utils", "../language/walker/ruleWalker"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        } else {
            cooked.raw = raw;
        }
        return cooked;
    };
    var __moduleName = context_1 && context_1.id;
    var abstractRule_1, utils_1, ruleWalker_1, Rule, LabelPositionWalker, templateObject_1;
    return {
        setters: [function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }, function (utils_1_1) {
            utils_1 = utils_1_1;
        }, function (ruleWalker_1_1) {
            ruleWalker_1 = ruleWalker_1_1;
        }],
        execute: function () {
            Rule = function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    return this.applyWithWalker(new LabelPositionWalker(sourceFile, this.getOptions()));
                };
                Rule.metadata = {
                    ruleName: "label-position",
                    description: "Only allows labels in sensible locations.",
                    descriptionDetails: "This rule only allows labels to be on `do/for/while/switch` statements.",
                    rationale: utils_1.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            Labels in JavaScript only can be used in conjunction with `break` or `continue`,\n            constructs meant to be used for loop flow control. While you can theoretically use\n            labels on any block statement in JS, it is considered poor code structure to do so."], ["\n            Labels in JavaScript only can be used in conjunction with \\`break\\` or \\`continue\\`,\n            constructs meant to be used for loop flow control. While you can theoretically use\n            labels on any block statement in JS, it is considered poor code structure to do so."]))),
                    optionsDescription: "Not configurable.",
                    options: null,
                    optionExamples: ["true"],
                    type: "functionality",
                    typescriptOnly: false
                };
                Rule.FAILURE_STRING = "unexpected label on statement";
                return Rule;
            }(abstractRule_1.AbstractRule);
            exports_1("Rule", Rule);
            LabelPositionWalker = function (_super) {
                __extends(LabelPositionWalker, _super);
                function LabelPositionWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                LabelPositionWalker.prototype.visitLabeledStatement = function (node) {
                    var statement = node.statement;
                    if (statement.kind !== ts.SyntaxKind.DoStatement && statement.kind !== ts.SyntaxKind.ForStatement && statement.kind !== ts.SyntaxKind.ForInStatement && statement.kind !== ts.SyntaxKind.ForOfStatement && statement.kind !== ts.SyntaxKind.WhileStatement && statement.kind !== ts.SyntaxKind.SwitchStatement) {
                        this.addFailureAtNode(node.label, Rule.FAILURE_STRING);
                    }
                    _super.prototype.visitLabeledStatement.call(this, node);
                };
                return LabelPositionWalker;
            }(ruleWalker_1.RuleWalker);
        }
    };
});
System.register("src/mode/tslint/rules/maxLineLengthRule.js", ["../language/rule/abstractRule", "../language/rule/rule", "../language/utils", "../utils"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        } else {
            cooked.raw = raw;
        }
        return cooked;
    };
    var __moduleName = context_1 && context_1.id;
    var abstractRule_1, rule_1, utils_1, utils_2, Rule, templateObject_1;
    return {
        setters: [function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }, function (rule_1_1) {
            rule_1 = rule_1_1;
        }, function (utils_1_1) {
            utils_1 = utils_1_1;
        }, function (utils_2_1) {
            utils_2 = utils_2_1;
        }],
        execute: function () {
            Rule = function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.isEnabled = function () {
                    var ruleArguments = this.getOptions().ruleArguments;
                    if (_super.prototype.isEnabled.call(this)) {
                        var option = ruleArguments[0];
                        if (typeof option === "number" && option > 0) {
                            return true;
                        }
                    }
                    return false;
                };
                Rule.prototype.apply = function (sourceFile) {
                    var ruleFailures = [];
                    var ruleArguments = this.getOptions().ruleArguments;
                    var lineLimit = ruleArguments[0];
                    var lineStarts = sourceFile.getLineStarts();
                    var errorString = Rule.FAILURE_STRING_FACTORY(lineLimit);
                    var disabledIntervals = this.getOptions().disabledIntervals;
                    var source = sourceFile.getFullText();
                    for (var i = 0; i < lineStarts.length - 1; ++i) {
                        var from = lineStarts[i];
                        var to = lineStarts[i + 1];
                        if (to - from - 1 > lineLimit && !(to - from - 2 === lineLimit && source[to - 2] === "\r")) {
                            var ruleFailure = new rule_1.RuleFailure(sourceFile, from, to - 1, errorString, this.getOptions().ruleName);
                            if (!utils_1.doesIntersect(ruleFailure, disabledIntervals)) {
                                ruleFailures.push(ruleFailure);
                            }
                        }
                    }
                    return ruleFailures;
                };
                Rule.metadata = {
                    ruleName: "max-line-length",
                    description: "Requires lines to be under a certain max length.",
                    rationale: utils_2.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            Limiting the length of a line of code improves code readability.\n            It also makes comparing code side-by-side easier and improves compatibility with\n            various editors, IDEs, and diff viewers."], ["\n            Limiting the length of a line of code improves code readability.\n            It also makes comparing code side-by-side easier and improves compatibility with\n            various editors, IDEs, and diff viewers."]))),
                    optionsDescription: "An integer indicating the max length of lines.",
                    options: {
                        type: "number",
                        minimum: "1"
                    },
                    optionExamples: ["[true, 120]"],
                    type: "maintainability",
                    typescriptOnly: false
                };
                Rule.FAILURE_STRING_FACTORY = function (lineLimit) {
                    return "Exceeds maximum line length of " + lineLimit;
                };
                return Rule;
            }(abstractRule_1.AbstractRule);
            exports_1("Rule", Rule);
        }
    };
});
System.register("src/mode/tslint/rules/memberAccessRule.js", ["../language/rule/abstractRule", "../language/utils", "../utils", "../language/walker/ruleWalker"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        } else {
            cooked.raw = raw;
        }
        return cooked;
    };
    var __moduleName = context_1 && context_1.id;
    var abstractRule_1, utils_1, utils_2, ruleWalker_1, Rule, MemberAccessWalker, templateObject_1;
    return {
        setters: [function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }, function (utils_1_1) {
            utils_1 = utils_1_1;
        }, function (utils_2_1) {
            utils_2 = utils_2_1;
        }, function (ruleWalker_1_1) {
            ruleWalker_1 = ruleWalker_1_1;
        }],
        execute: function () {
            Rule = function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    return this.applyWithWalker(new MemberAccessWalker(sourceFile, this.getOptions()));
                };
                Rule.metadata = {
                    ruleName: "member-access",
                    description: "Requires explicit visibility declarations for class members.",
                    rationale: "Explicit visibility declarations can make code more readable and accessible for those new to TS.",
                    optionsDescription: utils_2.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            Two arguments may be optionally provided:\n\n            * `\"check-accessor\"` enforces explicit visibility on get/set accessors (can only be public)\n            * `\"check-constructor\"`  enforces explicit visibility on constructors (can only be public)"], ["\n            Two arguments may be optionally provided:\n\n            * \\`\"check-accessor\"\\` enforces explicit visibility on get/set accessors (can only be public)\n            * \\`\"check-constructor\"\\`  enforces explicit visibility on constructors (can only be public)"]))),
                    options: {
                        type: "array",
                        items: {
                            type: "string",
                            enum: ["check-accessor", "check-constructor"]
                        },
                        minLength: 0,
                        maxLength: 2
                    },
                    optionExamples: ["true", '[true, "check-accessor"]'],
                    type: "typescript",
                    typescriptOnly: true
                };
                Rule.FAILURE_STRING_FACTORY = function (memberType, memberName, publicOnly) {
                    memberName = memberName === undefined ? "" : " '" + memberName + "'";
                    if (publicOnly) {
                        return "The " + memberType + memberName + " must be marked as 'public'";
                    }
                    return "The " + memberType + memberName + " must be marked either 'private', 'public', or 'protected'";
                };
                return Rule;
            }(abstractRule_1.AbstractRule);
            exports_1("Rule", Rule);
            MemberAccessWalker = function (_super) {
                __extends(MemberAccessWalker, _super);
                function MemberAccessWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                MemberAccessWalker.prototype.visitConstructorDeclaration = function (node) {
                    if (this.hasOption("check-constructor")) {
                        this.validateVisibilityModifiers(node);
                    }
                    _super.prototype.visitConstructorDeclaration.call(this, node);
                };
                MemberAccessWalker.prototype.visitMethodDeclaration = function (node) {
                    this.validateVisibilityModifiers(node);
                    _super.prototype.visitMethodDeclaration.call(this, node);
                };
                MemberAccessWalker.prototype.visitPropertyDeclaration = function (node) {
                    this.validateVisibilityModifiers(node);
                    _super.prototype.visitPropertyDeclaration.call(this, node);
                };
                MemberAccessWalker.prototype.visitGetAccessor = function (node) {
                    if (this.hasOption("check-accessor")) {
                        this.validateVisibilityModifiers(node);
                    }
                    _super.prototype.visitGetAccessor.call(this, node);
                };
                MemberAccessWalker.prototype.visitSetAccessor = function (node) {
                    if (this.hasOption("check-accessor")) {
                        this.validateVisibilityModifiers(node);
                    }
                    _super.prototype.visitSetAccessor.call(this, node);
                };
                MemberAccessWalker.prototype.validateVisibilityModifiers = function (node) {
                    if (node.parent.kind === ts.SyntaxKind.ObjectLiteralExpression) {
                        return;
                    }
                    var hasAnyVisibilityModifiers = utils_1.hasModifier(node.modifiers, ts.SyntaxKind.PublicKeyword, ts.SyntaxKind.PrivateKeyword, ts.SyntaxKind.ProtectedKeyword);
                    if (!hasAnyVisibilityModifiers) {
                        var memberType = void 0;
                        var publicOnly = false;
                        var end = void 0;
                        if (node.kind === ts.SyntaxKind.MethodDeclaration) {
                            memberType = "class method";
                            end = node.name.getEnd();
                        } else if (node.kind === ts.SyntaxKind.PropertyDeclaration) {
                            memberType = "class property";
                            end = node.name.getEnd();
                        } else if (node.kind === ts.SyntaxKind.Constructor) {
                            memberType = "class constructor";
                            publicOnly = true;
                            end = utils_1.childOfKind(node, ts.SyntaxKind.ConstructorKeyword).getEnd();
                        } else if (node.kind === ts.SyntaxKind.GetAccessor) {
                            memberType = "get property accessor";
                            end = node.name.getEnd();
                        } else if (node.kind === ts.SyntaxKind.SetAccessor) {
                            memberType = "set property accessor";
                            end = node.name.getEnd();
                        } else {
                            throw new Error("unhandled node type");
                        }
                        var memberName = void 0;
                        if (node.name !== undefined && node.name.kind === ts.SyntaxKind.Identifier) {
                            memberName = node.name.text;
                        }
                        var failureString = Rule.FAILURE_STRING_FACTORY(memberType, memberName, publicOnly);
                        this.addFailureFromStartToEnd(node.getStart(), end, failureString);
                    }
                };
                return MemberAccessWalker;
            }(ruleWalker_1.RuleWalker);
            exports_1("MemberAccessWalker", MemberAccessWalker);
        }
    };
});
System.register("src/mode/tslint/rules/newParensRule.js", ["../language/rule/abstractRule", "../language/walker/ruleWalker"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __moduleName = context_1 && context_1.id;
    var abstractRule_1, ruleWalker_1, Rule, NewParensWalker;
    return {
        setters: [function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }, function (ruleWalker_1_1) {
            ruleWalker_1 = ruleWalker_1_1;
        }],
        execute: function () {
            Rule = function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    var newParensWalker = new NewParensWalker(sourceFile, this.getOptions());
                    return this.applyWithWalker(newParensWalker);
                };
                Rule.metadata = {
                    ruleName: "new-parens",
                    description: "Requires parentheses when invoking a constructor via the `new` keyword.",
                    rationale: "Maintains stylistic consistency with other function calls.",
                    optionsDescription: "Not configurable.",
                    options: null,
                    optionExamples: ["true"],
                    type: "style",
                    typescriptOnly: false
                };
                Rule.FAILURE_STRING = "Parentheses are required when invoking a constructor";
                return Rule;
            }(abstractRule_1.AbstractRule);
            exports_1("Rule", Rule);
            NewParensWalker = function (_super) {
                __extends(NewParensWalker, _super);
                function NewParensWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                NewParensWalker.prototype.visitNewExpression = function (node) {
                    if (node.arguments === undefined) {
                        this.addFailureAtNode(node, Rule.FAILURE_STRING);
                    }
                    _super.prototype.visitNewExpression.call(this, node);
                };
                return NewParensWalker;
            }(ruleWalker_1.RuleWalker);
        }
    };
});
System.register("src/mode/tslint/rules/noAnyRule.js", ["../language/rule/abstractRule", "../language/walker/ruleWalker"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __moduleName = context_1 && context_1.id;
    var abstractRule_1, ruleWalker_1, Rule, NoAnyWalker;
    return {
        setters: [function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }, function (ruleWalker_1_1) {
            ruleWalker_1 = ruleWalker_1_1;
        }],
        execute: function () {
            Rule = function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    return this.applyWithWalker(new NoAnyWalker(sourceFile, this.getOptions()));
                };
                Rule.metadata = {
                    ruleName: "no-any",
                    description: "Disallows usages of `any` as a type declaration.",
                    hasFix: true,
                    rationale: "Using `any` as a type declaration nullifies the compile-time benefits of the type system.",
                    optionsDescription: "Not configurable.",
                    options: null,
                    optionExamples: ["true"],
                    type: "typescript",
                    typescriptOnly: true
                };
                Rule.FAILURE_STRING = "Type declaration of 'any' loses type-safety. " + "Consider replacing it with a more precise type, the empty type ('{}'), " + "or suppress this occurrence.";
                return Rule;
            }(abstractRule_1.AbstractRule);
            exports_1("Rule", Rule);
            NoAnyWalker = function (_super) {
                __extends(NoAnyWalker, _super);
                function NoAnyWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                NoAnyWalker.prototype.visitAnyKeyword = function (node) {
                    var fix = this.createFix(this.createReplacement(node.getStart(), node.getWidth(), "{}"));
                    this.addFailureAtNode(node, Rule.FAILURE_STRING, fix);
                    _super.prototype.visitAnyKeyword.call(this, node);
                };
                return NoAnyWalker;
            }(ruleWalker_1.RuleWalker);
        }
    };
});
System.register("src/mode/tslint/rules/noArgRule.js", ["../language/rule/abstractRule", "../utils", "../language/walker/ruleWalker"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        } else {
            cooked.raw = raw;
        }
        return cooked;
    };
    var __moduleName = context_1 && context_1.id;
    var abstractRule_1, utils_1, ruleWalker_1, Rule, NoArgWalker, templateObject_1;
    return {
        setters: [function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }, function (utils_1_1) {
            utils_1 = utils_1_1;
        }, function (ruleWalker_1_1) {
            ruleWalker_1 = ruleWalker_1_1;
        }],
        execute: function () {
            Rule = function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    return this.applyWithWalker(new NoArgWalker(sourceFile, this.getOptions()));
                };
                Rule.metadata = {
                    ruleName: "no-arg",
                    description: "Disallows use of `arguments.callee`.",
                    rationale: utils_1.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            Using `arguments.callee` makes various performance optimizations impossible.\n            See [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments/callee)\n            for more details on why to avoid `arguments.callee`."], ["\n            Using \\`arguments.callee\\` makes various performance optimizations impossible.\n            See [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments/callee)\n            for more details on why to avoid \\`arguments.callee\\`."]))),
                    optionsDescription: "Not configurable.",
                    options: null,
                    optionExamples: ["true"],
                    type: "functionality",
                    typescriptOnly: false
                };
                Rule.FAILURE_STRING = "Access to arguments.callee is forbidden";
                return Rule;
            }(abstractRule_1.AbstractRule);
            exports_1("Rule", Rule);
            NoArgWalker = function (_super) {
                __extends(NoArgWalker, _super);
                function NoArgWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                NoArgWalker.prototype.visitPropertyAccessExpression = function (node) {
                    var expression = node.expression;
                    var name = node.name;
                    if (expression.kind === ts.SyntaxKind.Identifier && name.text === "callee") {
                        var identifierExpression = expression;
                        if (identifierExpression.text === "arguments") {
                            this.addFailureAtNode(expression, Rule.FAILURE_STRING);
                        }
                    }
                    _super.prototype.visitPropertyAccessExpression.call(this, node);
                };
                return NoArgWalker;
            }(ruleWalker_1.RuleWalker);
        }
    };
});
System.register("src/mode/tslint/rules/noBitwiseRule.js", ["../language/rule/abstractRule", "../utils", "../language/walker/ruleWalker"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        } else {
            cooked.raw = raw;
        }
        return cooked;
    };
    var __moduleName = context_1 && context_1.id;
    var abstractRule_1, utils_1, ruleWalker_1, Rule, NoBitwiseWalker, templateObject_1, templateObject_2;
    return {
        setters: [function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }, function (utils_1_1) {
            utils_1 = utils_1_1;
        }, function (ruleWalker_1_1) {
            ruleWalker_1 = ruleWalker_1_1;
        }],
        execute: function () {
            Rule = function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    return this.applyWithWalker(new NoBitwiseWalker(sourceFile, this.getOptions()));
                };
                Rule.metadata = {
                    ruleName: "no-bitwise",
                    description: "Disallows bitwise operators.",
                    descriptionDetails: utils_1.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            Specifically, the following bitwise operators are banned:\n            `&`, `&=`, `|`, `|=`,\n            `^`, `^=`, `<<`, `<<=`,\n            `>>`, `>>=`, `>>>`, `>>>=`, and `~`.\n            This rule does not ban the use of `&` and `|` for intersection and union types."], ["\n            Specifically, the following bitwise operators are banned:\n            \\`&\\`, \\`&=\\`, \\`|\\`, \\`|=\\`,\n            \\`^\\`, \\`^=\\`, \\`<<\\`, \\`<<=\\`,\n            \\`>>\\`, \\`>>=\\`, \\`>>>\\`, \\`>>>=\\`, and \\`~\\`.\n            This rule does not ban the use of \\`&\\` and \\`|\\` for intersection and union types."]))),
                    rationale: utils_1.dedent(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n            Bitwise operators are often typos - for example `bool1 & bool2` instead of `bool1 && bool2`.\n            They also can be an indicator of overly clever code which decreases maintainability."], ["\n            Bitwise operators are often typos - for example \\`bool1 & bool2\\` instead of \\`bool1 && bool2\\`.\n            They also can be an indicator of overly clever code which decreases maintainability."]))),
                    optionsDescription: "Not configurable.",
                    options: null,
                    optionExamples: ["true"],
                    type: "functionality",
                    typescriptOnly: false
                };
                Rule.FAILURE_STRING = "Forbidden bitwise operation";
                return Rule;
            }(abstractRule_1.AbstractRule);
            exports_1("Rule", Rule);
            NoBitwiseWalker = function (_super) {
                __extends(NoBitwiseWalker, _super);
                function NoBitwiseWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                NoBitwiseWalker.prototype.visitBinaryExpression = function (node) {
                    switch (node.operatorToken.kind) {
                        case ts.SyntaxKind.AmpersandToken:
                        case ts.SyntaxKind.AmpersandEqualsToken:
                        case ts.SyntaxKind.BarToken:
                        case ts.SyntaxKind.BarEqualsToken:
                        case ts.SyntaxKind.CaretToken:
                        case ts.SyntaxKind.CaretEqualsToken:
                        case ts.SyntaxKind.LessThanLessThanToken:
                        case ts.SyntaxKind.LessThanLessThanEqualsToken:
                        case ts.SyntaxKind.GreaterThanGreaterThanToken:
                        case ts.SyntaxKind.GreaterThanGreaterThanEqualsToken:
                        case ts.SyntaxKind.GreaterThanGreaterThanGreaterThanToken:
                        case ts.SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken:
                            this.addFailureAtNode(node, Rule.FAILURE_STRING);
                            break;
                        default:
                            break;
                    }
                    _super.prototype.visitBinaryExpression.call(this, node);
                };
                NoBitwiseWalker.prototype.visitPrefixUnaryExpression = function (node) {
                    if (node.operator === ts.SyntaxKind.TildeToken) {
                        this.addFailureAtNode(node, Rule.FAILURE_STRING);
                    }
                    _super.prototype.visitPrefixUnaryExpression.call(this, node);
                };
                return NoBitwiseWalker;
            }(ruleWalker_1.RuleWalker);
        }
    };
});
System.register("src/mode/tslint/rules/noConditionalAssignmentRule.js", ["../language/rule/abstractRule", "../utils", "../language/walker/ruleWalker"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        } else {
            cooked.raw = raw;
        }
        return cooked;
    };
    var __moduleName = context_1 && context_1.id;
    function isAssignmentToken(token) {
        return token.kind >= ts.SyntaxKind.FirstAssignment && token.kind <= ts.SyntaxKind.LastAssignment;
    }
    var abstractRule_1, utils_1, ruleWalker_1, Rule, NoConditionalAssignmentWalker, templateObject_1;
    return {
        setters: [function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }, function (utils_1_1) {
            utils_1 = utils_1_1;
        }, function (ruleWalker_1_1) {
            ruleWalker_1 = ruleWalker_1_1;
        }],
        execute: function () {
            Rule = function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    var walker = new NoConditionalAssignmentWalker(sourceFile, this.getOptions());
                    return this.applyWithWalker(walker);
                };
                Rule.metadata = {
                    ruleName: "no-conditional-assignment",
                    description: "Disallows any type of assignment in conditionals.",
                    descriptionDetails: "This applies to `do-while`, `for`, `if`, and `while` statements.",
                    rationale: utils_1.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            Assignments in conditionals are often typos:\n            for example `if (var1 = var2)` instead of `if (var1 == var2)`.\n            They also can be an indicator of overly clever code which decreases maintainability."], ["\n            Assignments in conditionals are often typos:\n            for example \\`if (var1 = var2)\\` instead of \\`if (var1 == var2)\\`.\n            They also can be an indicator of overly clever code which decreases maintainability."]))),
                    optionsDescription: "Not configurable.",
                    options: null,
                    optionExamples: ["true"],
                    type: "functionality",
                    typescriptOnly: false
                };
                Rule.FAILURE_STRING = "Assignments in conditional expressions are forbidden";
                return Rule;
            }(abstractRule_1.AbstractRule);
            exports_1("Rule", Rule);
            NoConditionalAssignmentWalker = function (_super) {
                __extends(NoConditionalAssignmentWalker, _super);
                function NoConditionalAssignmentWalker() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.isInConditional = false;
                    return _this;
                }
                NoConditionalAssignmentWalker.prototype.visitIfStatement = function (node) {
                    this.validateConditionalExpression(node.expression);
                    _super.prototype.visitIfStatement.call(this, node);
                };
                NoConditionalAssignmentWalker.prototype.visitWhileStatement = function (node) {
                    this.validateConditionalExpression(node.expression);
                    _super.prototype.visitWhileStatement.call(this, node);
                };
                NoConditionalAssignmentWalker.prototype.visitDoStatement = function (node) {
                    this.validateConditionalExpression(node.expression);
                    _super.prototype.visitDoStatement.call(this, node);
                };
                NoConditionalAssignmentWalker.prototype.visitForStatement = function (node) {
                    if (node.condition != null) {
                        this.validateConditionalExpression(node.condition);
                    }
                    _super.prototype.visitForStatement.call(this, node);
                };
                NoConditionalAssignmentWalker.prototype.visitBinaryExpression = function (expression) {
                    if (this.isInConditional) {
                        this.checkForAssignment(expression);
                    }
                    _super.prototype.visitBinaryExpression.call(this, expression);
                };
                NoConditionalAssignmentWalker.prototype.validateConditionalExpression = function (expression) {
                    this.isInConditional = true;
                    if (expression.kind === ts.SyntaxKind.BinaryExpression) {
                        this.checkForAssignment(expression);
                    }
                    this.walkChildren(expression);
                    this.isInConditional = false;
                };
                NoConditionalAssignmentWalker.prototype.checkForAssignment = function (expression) {
                    if (isAssignmentToken(expression.operatorToken)) {
                        this.addFailureAtNode(expression, Rule.FAILURE_STRING);
                    }
                };
                return NoConditionalAssignmentWalker;
            }(ruleWalker_1.RuleWalker);
        }
    };
});
System.register("src/mode/tslint/rules/noConsecutiveBlankLinesRule.js", ["../language/rule/abstractRule", "../utils", "../language/walker/ruleWalker"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        } else {
            cooked.raw = raw;
        }
        return cooked;
    };
    var __moduleName = context_1 && context_1.id;
    var abstractRule_1, utils_1, ruleWalker_1, Rule, NoConsecutiveBlankLinesWalker, templateObject_1;
    return {
        setters: [function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }, function (utils_1_1) {
            utils_1 = utils_1_1;
        }, function (ruleWalker_1_1) {
            ruleWalker_1 = ruleWalker_1_1;
        }],
        execute: function () {
            Rule = function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.FAILURE_STRING_FACTORY = function (allowed) {
                    return allowed === 1 ? "Consecutive blank lines are forbidden" : "Exceeds the " + allowed + " allowed consecutive blank lines";
                };
                Rule.prototype.isEnabled = function () {
                    if (!_super.prototype.isEnabled.call(this)) {
                        return false;
                    }
                    var options = this.getOptions();
                    var allowedBlanks = options.ruleArguments && options.ruleArguments[0] || Rule.DEFAULT_ALLOWED_BLANKS;
                    return typeof allowedBlanks === "number" && allowedBlanks >= Rule.MINIMUM_ALLOWED_BLANKS;
                };
                Rule.prototype.apply = function (sourceFile) {
                    return this.applyWithWalker(new NoConsecutiveBlankLinesWalker(sourceFile, this.getOptions()));
                };
                Rule.DEFAULT_ALLOWED_BLANKS = 1;
                Rule.MINIMUM_ALLOWED_BLANKS = 1;
                Rule.metadata = {
                    ruleName: "no-consecutive-blank-lines",
                    description: "Disallows one or more blank lines in a row.",
                    rationale: "Helps maintain a readable style in your codebase.",
                    optionsDescription: utils_1.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            An optional number of maximum allowed sequential blanks can be specified. If no value\n            is provided, a default of $(Rule.DEFAULT_ALLOWED_BLANKS) will be used."], ["\n            An optional number of maximum allowed sequential blanks can be specified. If no value\n            is provided, a default of $(Rule.DEFAULT_ALLOWED_BLANKS) will be used."]))),
                    options: {
                        type: "number",
                        minimum: "$(Rule.MINIMUM_ALLOWED_BLANKS)"
                    },
                    optionExamples: ["true", "[true, 2]"],
                    type: "style",
                    typescriptOnly: false
                };
                return Rule;
            }(abstractRule_1.AbstractRule);
            exports_1("Rule", Rule);
            NoConsecutiveBlankLinesWalker = function (_super) {
                __extends(NoConsecutiveBlankLinesWalker, _super);
                function NoConsecutiveBlankLinesWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                NoConsecutiveBlankLinesWalker.prototype.walk = function (node) {
                    var templateIntervals = this.getTemplateIntervals(node);
                    var lineStarts = node.getLineStarts();
                    var options = this.getOptions();
                    var allowedBlanks = options && options[0] || Rule.DEFAULT_ALLOWED_BLANKS;
                    var failureMessage = Rule.FAILURE_STRING_FACTORY(allowedBlanks);
                    var sourceFileText = node.getFullText();
                    var soureFileLines = sourceFileText.split(/\n/);
                    var blankLineIndexes = [];
                    soureFileLines.forEach(function (txt, i) {
                        if (txt.trim() === "") {
                            blankLineIndexes.push(i);
                        }
                    });
                    var sequences = [];
                    var lastVal = -2;
                    for (var _i = 0, blankLineIndexes_1 = blankLineIndexes; _i < blankLineIndexes_1.length; _i++) {
                        var line = blankLineIndexes_1[_i];
                        line > lastVal + 1 ? sequences.push([line]) : sequences[sequences.length - 1].push(line);
                        lastVal = line;
                    }
                    var _loop_1 = function (arr) {
                        if (arr.length <= allowedBlanks) {
                            return "continue";
                        }
                        var startLineNum = arr[0];
                        var pos = lineStarts[startLineNum + 1];
                        var isInTemplate = templateIntervals.some(function (interval) {
                            return pos >= interval.startPosition && pos < interval.endPosition;
                        });
                        if (!isInTemplate) {
                            this_1.addFailureAt(pos, 1, failureMessage);
                        }
                    };
                    var this_1 = this;
                    for (var _a = 0, sequences_1 = sequences; _a < sequences_1.length; _a++) {
                        var arr = sequences_1[_a];
                        _loop_1(arr);
                    }
                };
                NoConsecutiveBlankLinesWalker.prototype.getTemplateIntervals = function (sourceFile) {
                    var intervals = [];
                    var cb = function (node) {
                        if (node.kind >= ts.SyntaxKind.FirstTemplateToken && node.kind <= ts.SyntaxKind.LastTemplateToken) {
                            intervals.push({
                                endPosition: node.getEnd(),
                                startPosition: node.getStart(sourceFile)
                            });
                        } else {
                            ts.forEachChild(node, cb);
                        }
                    };
                    ts.forEachChild(sourceFile, cb);
                    return intervals;
                };
                return NoConsecutiveBlankLinesWalker;
            }(ruleWalker_1.RuleWalker);
        }
    };
});
System.register("src/mode/tslint/rules/banRule.js", ["../language/rule/abstractRule", "../utils", "../language/walker/ruleWalker"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        } else {
            cooked.raw = raw;
        }
        return cooked;
    };
    var __moduleName = context_1 && context_1.id;
    var abstractRule_1, utils_1, ruleWalker_1, Rule, BanFunctionWalker, templateObject_1;
    return {
        setters: [function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }, function (utils_1_1) {
            utils_1 = utils_1_1;
        }, function (ruleWalker_1_1) {
            ruleWalker_1 = ruleWalker_1_1;
        }],
        execute: function () {
            Rule = function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    var options = this.getOptions();
                    var banFunctionWalker = new BanFunctionWalker(sourceFile, options);
                    var functionsToBan = options.ruleArguments;
                    if (functionsToBan !== undefined) {
                        functionsToBan.forEach(function (f) {
                            return banFunctionWalker.addBannedFunction(f);
                        });
                    }
                    return this.applyWithWalker(banFunctionWalker);
                };
                Rule.metadata = {
                    ruleName: "ban",
                    description: "Bans the use of specific functions or global methods.",
                    optionsDescription: utils_1.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            A list of `['object', 'method', 'optional explanation here']` or `['globalMethod']` which ban `object.method()`\n            or respectively `globalMethod()`."], ["\n            A list of \\`['object', 'method', 'optional explanation here']\\` or \\`['globalMethod']\\` which ban \\`object.method()\\`\n            or respectively \\`globalMethod()\\`."]))),
                    options: {
                        type: "list",
                        listType: {
                            type: "array",
                            items: { type: "string" },
                            minLength: 1,
                            maxLength: 3
                        }
                    },
                    optionExamples: ["[true, [\"someGlobalMethod\"], [\"someObject\", \"someFunction\"],\n                          [\"someObject\", \"otherFunction\", \"Optional explanation\"]]"],
                    type: "functionality",
                    typescriptOnly: false
                };
                Rule.FAILURE_STRING_FACTORY = function (expression, messageAddition) {
                    return "Calls to '" + expression + "' are not allowed." + (messageAddition ? " " + messageAddition : "");
                };
                return Rule;
            }(abstractRule_1.AbstractRule);
            exports_1("Rule", Rule);
            BanFunctionWalker = function (_super) {
                __extends(BanFunctionWalker, _super);
                function BanFunctionWalker() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.bannedGlobalFunctions = [];
                    _this.bannedFunctions = [];
                    return _this;
                }
                BanFunctionWalker.prototype.addBannedFunction = function (bannedFunction) {
                    if (bannedFunction.length === 1) {
                        this.bannedGlobalFunctions.push(bannedFunction[0]);
                    } else if (bannedFunction.length >= 2) {
                        this.bannedFunctions.push(bannedFunction);
                    }
                };
                BanFunctionWalker.prototype.visitCallExpression = function (node) {
                    var expression = node.expression;
                    this.checkForObjectMethodBan(expression);
                    this.checkForGlobalBan(expression);
                    _super.prototype.visitCallExpression.call(this, node);
                };
                BanFunctionWalker.prototype.checkForObjectMethodBan = function (expression) {
                    if (expression.kind === ts.SyntaxKind.PropertyAccessExpression && expression.getChildCount() >= 3) {
                        var firstToken = expression.getFirstToken();
                        var firstChild = expression.getChildAt(0);
                        var secondChild = expression.getChildAt(1);
                        var thirdChild = expression.getChildAt(2);
                        var rightSideExpression = thirdChild.getFullText();
                        var leftSideExpression = void 0;
                        if (firstChild.getChildCount() > 0) {
                            leftSideExpression = firstChild.getLastToken().getText();
                        } else {
                            leftSideExpression = firstToken.getText();
                        }
                        if (secondChild.kind === ts.SyntaxKind.DotToken) {
                            for (var _i = 0, _a = this.bannedFunctions; _i < _a.length; _i++) {
                                var bannedFunction = _a[_i];
                                if (leftSideExpression === bannedFunction[0] && rightSideExpression === bannedFunction[1]) {
                                    var failure = Rule.FAILURE_STRING_FACTORY(leftSideExpression + "." + rightSideExpression, bannedFunction[2]);
                                    this.addFailureAtNode(expression, failure);
                                }
                            }
                        }
                    }
                };
                BanFunctionWalker.prototype.checkForGlobalBan = function (expression) {
                    if (expression.kind === ts.SyntaxKind.Identifier) {
                        var identifierName = expression.text;
                        if (this.bannedGlobalFunctions.indexOf(identifierName) !== -1) {
                            this.addFailureAtNode(expression, Rule.FAILURE_STRING_FACTORY("" + identifierName));
                        }
                    }
                };
                return BanFunctionWalker;
            }(ruleWalker_1.RuleWalker);
            exports_1("BanFunctionWalker", BanFunctionWalker);
        }
    };
});
System.register("src/mode/tslint/rules/noConsoleRule.js", ["./banRule"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __moduleName = context_1 && context_1.id;
    var BanRule, Rule;
    return {
        setters: [function (BanRule_1) {
            BanRule = BanRule_1;
        }],
        execute: function () {
            Rule = function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    var options = this.getOptions();
                    var consoleBanWalker = new BanRule.BanFunctionWalker(sourceFile, this.getOptions());
                    for (var _i = 0, _a = options.ruleArguments; _i < _a.length; _i++) {
                        var option = _a[_i];
                        consoleBanWalker.addBannedFunction(["console", option]);
                    }
                    return this.applyWithWalker(consoleBanWalker);
                };
                Rule.metadata = {
                    ruleName: "no-console",
                    description: "Bans the use of specified `console` methods.",
                    rationale: "In general, \`console\` methods aren't appropriate for production code.",
                    optionsDescription: "A list of method names to ban.",
                    options: {
                        type: "array",
                        items: { type: "string" }
                    },
                    optionExamples: ["[true, \"log\", \"error\"]"],
                    type: "functionality",
                    typescriptOnly: false
                };
                return Rule;
            }(BanRule.Rule);
            exports_1("Rule", Rule);
        }
    };
});
System.register("src/mode/tslint/rules/noConstructRule.js", ["../language/rule/abstractRule", "../utils", "../language/walker/ruleWalker"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        } else {
            cooked.raw = raw;
        }
        return cooked;
    };
    var __moduleName = context_1 && context_1.id;
    var abstractRule_1, utils_1, ruleWalker_1, Rule, NoConstructWalker, templateObject_1;
    return {
        setters: [function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }, function (utils_1_1) {
            utils_1 = utils_1_1;
        }, function (ruleWalker_1_1) {
            ruleWalker_1 = ruleWalker_1_1;
        }],
        execute: function () {
            Rule = function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    return this.applyWithWalker(new NoConstructWalker(sourceFile, this.getOptions()));
                };
                Rule.metadata = {
                    ruleName: "no-construct",
                    description: "Disallows access to the constructors of `String`, `Number`, and `Boolean`.",
                    descriptionDetails: "Disallows constructor use such as `new Number(foo)` but does not disallow `Number(foo)`.",
                    rationale: utils_1.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            There is little reason to use `String`, `Number`, or `Boolean` as constructors.\n            In almost all cases, the regular function-call version is more appropriate.\n            [More details](http://stackoverflow.com/q/4719320/3124288) are available on StackOverflow."], ["\n            There is little reason to use \\`String\\`, \\`Number\\`, or \\`Boolean\\` as constructors.\n            In almost all cases, the regular function-call version is more appropriate.\n            [More details](http://stackoverflow.com/q/4719320/3124288) are available on StackOverflow."]))),
                    optionsDescription: "Not configurable.",
                    options: null,
                    optionExamples: ["true"],
                    type: "functionality",
                    typescriptOnly: false
                };
                Rule.FAILURE_STRING = "Forbidden constructor, use a literal or simple function call instead";
                return Rule;
            }(abstractRule_1.AbstractRule);
            exports_1("Rule", Rule);
            NoConstructWalker = function (_super) {
                __extends(NoConstructWalker, _super);
                function NoConstructWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                NoConstructWalker.prototype.visitNewExpression = function (node) {
                    if (node.expression.kind === ts.SyntaxKind.Identifier) {
                        var identifier = node.expression;
                        var constructorName = identifier.text;
                        if (NoConstructWalker.FORBIDDEN_CONSTRUCTORS.indexOf(constructorName) !== -1) {
                            this.addFailureAt(node.getStart(), identifier.getEnd() - node.getStart(), Rule.FAILURE_STRING);
                        }
                    }
                    _super.prototype.visitNewExpression.call(this, node);
                };
                NoConstructWalker.FORBIDDEN_CONSTRUCTORS = ["Boolean", "Number", "String"];
                return NoConstructWalker;
            }(ruleWalker_1.RuleWalker);
        }
    };
});
System.register("src/mode/tslint/rules/noEvalRule.js", ["../language/rule/abstractRule", "../utils", "../language/walker/ruleWalker"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        } else {
            cooked.raw = raw;
        }
        return cooked;
    };
    var __moduleName = context_1 && context_1.id;
    var abstractRule_1, utils_1, ruleWalker_1, Rule, NoEvalWalker, templateObject_1;
    return {
        setters: [function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }, function (utils_1_1) {
            utils_1 = utils_1_1;
        }, function (ruleWalker_1_1) {
            ruleWalker_1 = ruleWalker_1_1;
        }],
        execute: function () {
            Rule = function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    return this.applyWithWalker(new NoEvalWalker(sourceFile, this.getOptions()));
                };
                Rule.metadata = {
                    ruleName: "no-eval",
                    description: "Disallows `eval` function invocations.",
                    rationale: utils_1.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            `eval()` is dangerous as it allows arbitrary code execution with full privileges. There are\n            [alternatives](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval)\n            for most of the use cases for `eval()`."], ["\n            \\`eval()\\` is dangerous as it allows arbitrary code execution with full privileges. There are\n            [alternatives](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval)\n            for most of the use cases for \\`eval()\\`."]))),
                    optionsDescription: "Not configurable.",
                    options: null,
                    optionExamples: ["true"],
                    type: "functionality",
                    typescriptOnly: false
                };
                Rule.FAILURE_STRING = "forbidden eval";
                return Rule;
            }(abstractRule_1.AbstractRule);
            exports_1("Rule", Rule);
            NoEvalWalker = function (_super) {
                __extends(NoEvalWalker, _super);
                function NoEvalWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                NoEvalWalker.prototype.visitCallExpression = function (node) {
                    var expression = node.expression;
                    if (expression.kind === ts.SyntaxKind.Identifier) {
                        var expressionName = expression.text;
                        if (expressionName === "eval") {
                            this.addFailureAtNode(expression, Rule.FAILURE_STRING);
                        }
                    }
                    _super.prototype.visitCallExpression.call(this, node);
                };
                return NoEvalWalker;
            }(ruleWalker_1.RuleWalker);
        }
    };
});
System.register("src/mode/tslint/language/walker/programAwareRuleWalker.js", ["./ruleWalker"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __moduleName = context_1 && context_1.id;
    var ruleWalker_1, ProgramAwareRuleWalker;
    return {
        setters: [function (ruleWalker_1_1) {
            ruleWalker_1 = ruleWalker_1_1;
        }],
        execute: function () {
            ProgramAwareRuleWalker = function (_super) {
                __extends(ProgramAwareRuleWalker, _super);
                function ProgramAwareRuleWalker(sourceFile, options, program) {
                    var _this = _super.call(this, sourceFile, options) || this;
                    _this.program = program;
                    _this.typeChecker = program.getTypeChecker();
                    return _this;
                }
                ProgramAwareRuleWalker.prototype.getProgram = function () {
                    return this.program;
                };
                ProgramAwareRuleWalker.prototype.getTypeChecker = function () {
                    return this.typeChecker;
                };
                return ProgramAwareRuleWalker;
            }(ruleWalker_1.RuleWalker);
            exports_1("ProgramAwareRuleWalker", ProgramAwareRuleWalker);
        }
    };
});
System.register("src/mode/tslint/rules/noForInArrayRule.js", ["../language/rule/typedRule", "../utils", "../language/walker/programAwareRuleWalker"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        } else {
            cooked.raw = raw;
        }
        return cooked;
    };
    var __moduleName = context_1 && context_1.id;
    var typedRule_1, utils_1, programAwareRuleWalker_1, Rule, NoForInArrayWalker, templateObject_1;
    return {
        setters: [function (typedRule_1_1) {
            typedRule_1 = typedRule_1_1;
        }, function (utils_1_1) {
            utils_1 = utils_1_1;
        }, function (programAwareRuleWalker_1_1) {
            programAwareRuleWalker_1 = programAwareRuleWalker_1_1;
        }],
        execute: function () {
            Rule = function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.applyWithProgram = function (sourceFile, langSvc) {
                    var noForInArrayWalker = new NoForInArrayWalker(sourceFile, this.getOptions(), langSvc.getProgram());
                    return this.applyWithWalker(noForInArrayWalker);
                };
                Rule.metadata = {
                    ruleName: "no-for-in-array",
                    description: "Disallows iterating over an array with a for-in loop.",
                    descriptionDetails: utils_1.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            A for-in loop (`for (var k in o)`) iterates over the properties of an Object.\n\n            While it is legal to use for-in loops with array types, it is not common.\n            for-in will iterate over the indices of the array as strings, omitting any \"holes\" in\n            the array.\n\n            More common is to use for-of, which iterates over the values of an array.\n            If you want to iterate over the indices, alternatives include:\n\n            array.forEach((value, index) => { ... });\n            for (const [index, value] of array.entries()) { ... }\n            for (let i = 0; i < array.length; i++) { ... }\n            "], ["\n            A for-in loop (\\`for (var k in o)\\`) iterates over the properties of an Object.\n\n            While it is legal to use for-in loops with array types, it is not common.\n            for-in will iterate over the indices of the array as strings, omitting any \"holes\" in\n            the array.\n\n            More common is to use for-of, which iterates over the values of an array.\n            If you want to iterate over the indices, alternatives include:\n\n            array.forEach((value, index) => { ... });\n            for (const [index, value] of array.entries()) { ... }\n            for (let i = 0; i < array.length; i++) { ... }\n            "]))),
                    optionsDescription: "Not configurable.",
                    options: null,
                    optionExamples: ["true"],
                    requiresTypeInfo: true,
                    type: "functionality",
                    typescriptOnly: false
                };
                Rule.FAILURE_STRING = "for-in loops over arrays are forbidden. Use for-of or array.forEach instead.";
                return Rule;
            }(typedRule_1.TypedRule);
            exports_1("Rule", Rule);
            NoForInArrayWalker = function (_super) {
                __extends(NoForInArrayWalker, _super);
                function NoForInArrayWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                NoForInArrayWalker.prototype.visitForInStatement = function (node) {
                    var iteratee = node.expression;
                    var tc = this.getTypeChecker();
                    var type = tc.getTypeAtLocation(iteratee);
                    var isArrayType = type.symbol && type.symbol.name === "Array";
                    var isStringType = (type.flags & ts.TypeFlags.StringLike) !== 0;
                    if (isArrayType || isStringType) {
                        this.addFailureAtNode(node, Rule.FAILURE_STRING);
                    }
                    _super.prototype.visitForInStatement.call(this, node);
                };
                return NoForInArrayWalker;
            }(programAwareRuleWalker_1.ProgramAwareRuleWalker);
        }
    };
});
System.register("src/mode/tslint/rules/noInferrableTypesRule.js", ["../language/rule/abstractRule", "../language/rule/rule", "../utils", "../language/walker/walker"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        } else {
            cooked.raw = raw;
        }
        return cooked;
    };
    var __moduleName = context_1 && context_1.id;
    var abstractRule_1, rule_1, utils_1, walker_1, OPTION_IGNORE_PARMS, OPTION_IGNORE_PROPERTIES, Rule, NoInferrableTypesWalker, templateObject_1;
    return {
        setters: [function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }, function (rule_1_1) {
            rule_1 = rule_1_1;
        }, function (utils_1_1) {
            utils_1 = utils_1_1;
        }, function (walker_1_1) {
            walker_1 = walker_1_1;
        }],
        execute: function () {
            OPTION_IGNORE_PARMS = "ignore-params";
            OPTION_IGNORE_PROPERTIES = "ignore-properties";
            Rule = function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    return this.applyWithWalker(new NoInferrableTypesWalker(sourceFile, this.ruleName, {
                        ignoreParameters: this.ruleArguments.indexOf(OPTION_IGNORE_PARMS) !== -1,
                        ignoreProperties: this.ruleArguments.indexOf(OPTION_IGNORE_PROPERTIES) !== -1
                    }));
                };
                Rule.metadata = {
                    ruleName: "no-inferrable-types",
                    description: "Disallows explicit type declarations for variables or parameters initialized to a number, string, or boolean.",
                    rationale: "Explicit types where they can be easily inferred by the compiler make code more verbose.",
                    optionsDescription: utils_1.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            Two arguments may be optionally provided:\n\n            * `", "` allows specifying an inferrable type annotation for function params.\n            This can be useful when combining with the `typedef` rule.\n            * `", "` allows specifying an inferrable type annotation for class properties."], ["\n            Two arguments may be optionally provided:\n\n            * \\`", "\\` allows specifying an inferrable type annotation for function params.\n            This can be useful when combining with the \\`typedef\\` rule.\n            * \\`", "\\` allows specifying an inferrable type annotation for class properties."])), OPTION_IGNORE_PARMS, OPTION_IGNORE_PROPERTIES),
                    options: {
                        type: "array",
                        items: {
                            type: "string",
                            enum: [OPTION_IGNORE_PARMS, OPTION_IGNORE_PROPERTIES]
                        },
                        minLength: 0,
                        maxLength: 2
                    },
                    hasFix: true,
                    optionExamples: ["true", "[true, \"" + OPTION_IGNORE_PARMS + "\"]", "[true, \"" + OPTION_IGNORE_PARMS + "\", \"" + OPTION_IGNORE_PROPERTIES + "\"]"],
                    type: "typescript",
                    typescriptOnly: true
                };
                Rule.FAILURE_STRING_FACTORY = function (type) {
                    return "Type " + type + " trivially inferred from a " + type + " literal, remove type annotation";
                };
                return Rule;
            }(abstractRule_1.AbstractRule);
            exports_1("Rule", Rule);
            NoInferrableTypesWalker = function (_super) {
                __extends(NoInferrableTypesWalker, _super);
                function NoInferrableTypesWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                NoInferrableTypesWalker.prototype.walk = function (sourceFile) {
                    var _this = this;
                    var cb = function (node) {
                        switch (node.kind) {
                            case ts.SyntaxKind.Parameter:
                                if (!_this.options.ignoreParameters) {
                                    _this.checkDeclaration(node);
                                }
                                break;
                            case ts.SyntaxKind.PropertyDeclaration:
                                if (_this.options.ignoreProperties) {
                                    break;
                                }
                            case ts.SyntaxKind.VariableDeclaration:
                                _this.checkDeclaration(node);
                            default:
                        }
                        return ts.forEachChild(node, cb);
                    };
                    return ts.forEachChild(sourceFile, cb);
                };
                NoInferrableTypesWalker.prototype.checkDeclaration = function (node) {
                    if (node.type != null && node.initializer != null) {
                        var failure = null;
                        switch (node.type.kind) {
                            case ts.SyntaxKind.BooleanKeyword:
                                if (node.initializer.kind === ts.SyntaxKind.TrueKeyword || node.initializer.kind === ts.SyntaxKind.FalseKeyword) {
                                    failure = "boolean";
                                }
                                break;
                            case ts.SyntaxKind.NumberKeyword:
                                if (node.initializer.kind === ts.SyntaxKind.NumericLiteral) {
                                    failure = "number";
                                }
                                break;
                            case ts.SyntaxKind.StringKeyword:
                                switch (node.initializer.kind) {
                                    case ts.SyntaxKind.StringLiteral:
                                    case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
                                    case ts.SyntaxKind.TemplateExpression:
                                        failure = "string";
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            default:
                                break;
                        }
                        if (failure != null) {
                            this.addFailureAtNode(node.type, Rule.FAILURE_STRING_FACTORY(failure), this.createFix(rule_1.Replacement.deleteFromTo(node.name.end, node.type.end)));
                        }
                    }
                };
                return NoInferrableTypesWalker;
            }(walker_1.AbstractWalker);
        }
    };
});
System.register("src/mode/tslint/rules/noMagicNumbersRule.js", ["../language/rule/abstractRule", "../utils", "../language/walker/walker"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        } else {
            cooked.raw = raw;
        }
        return cooked;
    };
    var __moduleName = context_1 && context_1.id;
    var abstractRule_1, utils_1, walker_1, Rule, NoMagicNumbersWalker, templateObject_1, templateObject_2;
    return {
        setters: [function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }, function (utils_1_1) {
            utils_1 = utils_1_1;
        }, function (walker_1_1) {
            walker_1 = walker_1_1;
        }],
        execute: function () {
            Rule = function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    var allowedNumbers = this.ruleArguments.length > 0 ? this.ruleArguments : Rule.DEFAULT_ALLOWED;
                    return this.applyWithWalker(new NoMagicNumbersWalker(sourceFile, this.ruleName, new Set(allowedNumbers.map(String))));
                };
                Rule.metadata = {
                    ruleName: "no-magic-numbers",
                    description: utils_1.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            Disallows the use constant number values outside of variable assignments.\n            When no list of allowed values is specified, -1, 0 and 1 are allowed by default."], ["\n            Disallows the use constant number values outside of variable assignments.\n            When no list of allowed values is specified, -1, 0 and 1 are allowed by default."]))),
                    rationale: utils_1.dedent(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n            Magic numbers should be avoided as they often lack documentation, forcing\n            them to be stored in variables gives them implicit documentation."], ["\n            Magic numbers should be avoided as they often lack documentation, forcing\n            them to be stored in variables gives them implicit documentation."]))),
                    optionsDescription: "A list of allowed numbers.",
                    options: {
                        type: "array",
                        items: {
                            type: "number"
                        },
                        minLength: 1
                    },
                    optionExamples: ["true", "[true, 1, 2, 3]"],
                    type: "typescript",
                    typescriptOnly: false
                };
                Rule.FAILURE_STRING = "'magic numbers' are not allowed";
                Rule.ALLOWED_NODES = new Set([ts.SyntaxKind.ExportAssignment, ts.SyntaxKind.FirstAssignment, ts.SyntaxKind.LastAssignment, ts.SyntaxKind.PropertyAssignment, ts.SyntaxKind.ShorthandPropertyAssignment, ts.SyntaxKind.VariableDeclaration, ts.SyntaxKind.VariableDeclarationList, ts.SyntaxKind.EnumMember, ts.SyntaxKind.PropertyDeclaration, ts.SyntaxKind.Parameter]);
                Rule.DEFAULT_ALLOWED = [-1, 0, 1];
                return Rule;
            }(abstractRule_1.AbstractRule);
            exports_1("Rule", Rule);
            NoMagicNumbersWalker = function (_super) {
                __extends(NoMagicNumbersWalker, _super);
                function NoMagicNumbersWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                NoMagicNumbersWalker.prototype.walk = function (sourceFile) {
                    var _this = this;
                    var cb = function (node) {
                        if (node.kind === ts.SyntaxKind.NumericLiteral) {
                            _this.checkNumericLiteral(node, node.text);
                        } else if (node.kind === ts.SyntaxKind.PrefixUnaryExpression && node.operator === ts.SyntaxKind.MinusToken) {
                            _this.checkNumericLiteral(node, "-" + node.operand.text);
                        } else {
                            ts.forEachChild(node, cb);
                        }
                    };
                    return ts.forEachChild(sourceFile, cb);
                };
                NoMagicNumbersWalker.prototype.checkNumericLiteral = function (node, num) {
                    if (!Rule.ALLOWED_NODES.has(node.parent.kind) && !this.options.has(num)) {
                        this.addFailureAtNode(node, Rule.FAILURE_STRING);
                    }
                };
                return NoMagicNumbersWalker;
            }(walker_1.AbstractWalker);
        }
    };
});
System.register("src/mode/tslint/rules/noShadowedVariableRule.js", ["../language/rule/abstractRule", "../language/walker/blockScopeAwareRuleWalker", "../language/utils"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __moduleName = context_1 && context_1.id;
    var abstractRule_1, blockScopeAwareRuleWalker_1, utils_1, Rule, NoShadowedVariableWalker;
    return {
        setters: [function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }, function (blockScopeAwareRuleWalker_1_1) {
            blockScopeAwareRuleWalker_1 = blockScopeAwareRuleWalker_1_1;
        }, function (utils_1_1) {
            utils_1 = utils_1_1;
        }],
        execute: function () {
            Rule = function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    return this.applyWithWalker(new NoShadowedVariableWalker(sourceFile, this.getOptions()));
                };
                Rule.metadata = {
                    ruleName: "no-shadowed-variable",
                    description: "Disallows shadowing variable declarations.",
                    rationale: "Shadowing a variable masks access to it and obscures to what value an identifier actually refers.",
                    optionsDescription: "Not configurable.",
                    options: null,
                    optionExamples: ["true"],
                    type: "functionality",
                    typescriptOnly: false
                };
                Rule.FAILURE_STRING_FACTORY = function (name) {
                    return "Shadowed variable: '" + name + "'";
                };
                return Rule;
            }(abstractRule_1.AbstractRule);
            exports_1("Rule", Rule);
            NoShadowedVariableWalker = function (_super) {
                __extends(NoShadowedVariableWalker, _super);
                function NoShadowedVariableWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                NoShadowedVariableWalker.prototype.createScope = function () {
                    return new Set();
                };
                NoShadowedVariableWalker.prototype.createBlockScope = function () {
                    return new Set();
                };
                NoShadowedVariableWalker.prototype.visitBindingElement = function (node) {
                    var isSingleVariable = node.name.kind === ts.SyntaxKind.Identifier;
                    if (isSingleVariable) {
                        var name = node.name;
                        var variableDeclaration = utils_1.getBindingElementVariableDeclaration(node);
                        var isBlockScopedVar = variableDeclaration !== null && utils_1.isBlockScopedVariable(variableDeclaration);
                        this.handleSingleVariableIdentifier(name, isBlockScopedVar);
                    }
                    _super.prototype.visitBindingElement.call(this, node);
                };
                NoShadowedVariableWalker.prototype.visitCatchClause = function (node) {
                    this.visitBlock(node.block);
                };
                NoShadowedVariableWalker.prototype.visitCallSignature = function (_node) {};
                NoShadowedVariableWalker.prototype.visitFunctionType = function (_node) {};
                NoShadowedVariableWalker.prototype.visitConstructorType = function (_node) {};
                NoShadowedVariableWalker.prototype.visitIndexSignatureDeclaration = function (_node) {};
                NoShadowedVariableWalker.prototype.visitMethodSignature = function (_node) {};
                NoShadowedVariableWalker.prototype.visitParameterDeclaration = function (node) {
                    var isSingleParameter = node.name.kind === ts.SyntaxKind.Identifier;
                    if (isSingleParameter) {
                        this.handleSingleVariableIdentifier(node.name, false);
                    }
                    _super.prototype.visitParameterDeclaration.call(this, node);
                };
                NoShadowedVariableWalker.prototype.visitTypeLiteral = function (_node) {};
                NoShadowedVariableWalker.prototype.visitVariableDeclaration = function (node) {
                    var isSingleVariable = node.name.kind === ts.SyntaxKind.Identifier;
                    if (isSingleVariable) {
                        this.handleSingleVariableIdentifier(node.name, utils_1.isBlockScopedVariable(node));
                    }
                    _super.prototype.visitVariableDeclaration.call(this, node);
                };
                NoShadowedVariableWalker.prototype.handleSingleVariableIdentifier = function (variableIdentifier, isBlockScoped) {
                    var variableName = variableIdentifier.text;
                    if (this.isVarInCurrentScope(variableName) && !this.inCurrentBlockScope(variableName)) {
                        this.addFailureOnIdentifier(variableIdentifier);
                    } else if (this.inPreviousBlockScope(variableName)) {
                        this.addFailureOnIdentifier(variableIdentifier);
                    }
                    if (!isBlockScoped) {
                        this.getCurrentScope().add(variableName);
                    }
                    this.getCurrentBlockScope().add(variableName);
                };
                NoShadowedVariableWalker.prototype.isVarInCurrentScope = function (varName) {
                    return this.getCurrentScope().has(varName);
                };
                NoShadowedVariableWalker.prototype.inCurrentBlockScope = function (varName) {
                    return this.getCurrentBlockScope().has(varName);
                };
                NoShadowedVariableWalker.prototype.inPreviousBlockScope = function (varName) {
                    var _this = this;
                    return this.getAllBlockScopes().some(function (scopeInfo) {
                        return scopeInfo !== _this.getCurrentBlockScope() && scopeInfo.has(varName);
                    });
                };
                NoShadowedVariableWalker.prototype.addFailureOnIdentifier = function (ident) {
                    var failureString = Rule.FAILURE_STRING_FACTORY(ident.text);
                    this.addFailureAtNode(ident, failureString);
                };
                return NoShadowedVariableWalker;
            }(blockScopeAwareRuleWalker_1.BlockScopeAwareRuleWalker);
        }
    };
});
System.register("src/mode/tslint/rules/noStringThrowRule.js", ["../language/rule/abstractRule", "../language/walker/ruleWalker"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __moduleName = context_1 && context_1.id;
    var abstractRule_1, ruleWalker_1, Rule, Walker;
    return {
        setters: [function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }, function (ruleWalker_1_1) {
            ruleWalker_1 = ruleWalker_1_1;
        }],
        execute: function () {
            Rule = function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    return this.applyWithWalker(new Walker(sourceFile, this.getOptions()));
                };
                Rule.metadata = {
                    ruleName: "no-string-throw",
                    description: "Flags throwing plain strings or concatenations of strings " + "because only Errors produce proper stack traces.",
                    hasFix: true,
                    options: null,
                    optionsDescription: "Not configurable.",
                    type: "functionality",
                    typescriptOnly: false
                };
                Rule.FAILURE_STRING = "Throwing plain strings (not instances of Error) gives no stack traces";
                return Rule;
            }(abstractRule_1.AbstractRule);
            exports_1("Rule", Rule);
            Walker = function (_super) {
                __extends(Walker, _super);
                function Walker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Walker.prototype.visitThrowStatement = function (node) {
                    var expression = node.expression;
                    if (this.stringConcatRecursive(expression)) {
                        var fix = this.createFix(this.createReplacement(expression.getStart(), expression.getEnd() - expression.getStart(), "new Error(" + expression.getText() + ")"));
                        this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING, fix));
                    }
                    _super.prototype.visitThrowStatement.call(this, node);
                };
                Walker.prototype.stringConcatRecursive = function (node) {
                    switch (node.kind) {
                        case ts.SyntaxKind.StringLiteral:
                        case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
                        case ts.SyntaxKind.TemplateExpression:
                            return true;
                        case ts.SyntaxKind.BinaryExpression:
                            var n = node;
                            var op = n.operatorToken.kind;
                            return op === ts.SyntaxKind.PlusToken && (this.stringConcatRecursive(n.left) || this.stringConcatRecursive(n.right));
                        case ts.SyntaxKind.ParenthesizedExpression:
                            return this.stringConcatRecursive(node.expression);
                        default:
                            return false;
                    }
                };
                return Walker;
            }(ruleWalker_1.RuleWalker);
        }
    };
});
System.register("src/mode/tslint/rules/noTrailingWhitespaceRule.js", ["../language/rule/abstractRule", "../language/rule/rule", "../language/utils", "../utils"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        } else {
            cooked.raw = raw;
        }
        return cooked;
    };
    var __moduleName = context_1 && context_1.id;
    function walk(ctx) {
        var lastSeenWasWhitespace = false;
        var lastSeenWhitespacePosition = 0;
        utils_1.forEachToken(ctx.sourceFile, false, function (fullText, kind, pos) {
            if (kind === ts.SyntaxKind.NewLineTrivia || kind === ts.SyntaxKind.EndOfFileToken) {
                if (lastSeenWasWhitespace) {
                    reportFailure(ctx, lastSeenWhitespacePosition, pos.tokenStart);
                }
                lastSeenWasWhitespace = false;
            } else if (kind === ts.SyntaxKind.WhitespaceTrivia) {
                lastSeenWasWhitespace = true;
                lastSeenWhitespacePosition = pos.tokenStart;
            } else {
                if (ctx.options !== 1) {
                    if (kind === ts.SyntaxKind.SingleLineCommentTrivia) {
                        var commentText = fullText.substring(pos.tokenStart + 2, pos.end);
                        var match = /\s+$/.exec(commentText);
                        if (match !== null) {
                            reportFailure(ctx, pos.end - match[0].length, pos.end);
                        }
                    } else if (kind === ts.SyntaxKind.MultiLineCommentTrivia && (ctx.options !== 2 || fullText[pos.tokenStart + 2] !== "*" || fullText[pos.tokenStart + 3] === "*")) {
                        var startPos = pos.tokenStart + 2;
                        var commentText = fullText.substring(startPos, pos.end - 2);
                        var lines = commentText.split("\n");
                        var len = lines.length - 1;
                        for (var i = 0; i < len; ++i) {
                            var line = lines[i];
                            if (line.endsWith("\r")) {
                                line = line.substr(0, line.length - 1);
                            }
                            var start = line.search(/\s+$/);
                            if (start !== -1) {
                                reportFailure(ctx, startPos + start, startPos + line.length);
                            }
                            startPos += lines[i].length + 1;
                        }
                    }
                }
                lastSeenWasWhitespace = false;
            }
        });
    }
    function reportFailure(ctx, start, end) {
        ctx.addFailure(start, end, Rule.FAILURE_STRING, ctx.createFix(rule_1.Replacement.deleteFromTo(start, end)));
    }
    var abstractRule_1, rule_1, utils_1, utils_2, OPTION_IGNORE_COMMENTS, OPTION_IGNORE_JSDOC, Rule, templateObject_1;
    return {
        setters: [function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }, function (rule_1_1) {
            rule_1 = rule_1_1;
        }, function (utils_1_1) {
            utils_1 = utils_1_1;
        }, function (utils_2_1) {
            utils_2 = utils_2_1;
        }],
        execute: function () {
            OPTION_IGNORE_COMMENTS = "ignore-comments";
            OPTION_IGNORE_JSDOC = "ignore-jsdoc";
            Rule = function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    var option = 0;
                    if (this.ruleArguments.indexOf(OPTION_IGNORE_COMMENTS) !== -1) {
                        option = 1;
                    } else if (this.ruleArguments.indexOf(OPTION_IGNORE_JSDOC) !== -1) {
                        option = 2;
                    }
                    return this.applyWithFunction(sourceFile, walk, option);
                };
                Rule.metadata = {
                    ruleName: "no-trailing-whitespace",
                    description: "Disallows trailing whitespace at the end of a line.",
                    rationale: "Keeps version control diffs clean as it prevents accidental whitespace from being committed.",
                    optionsDescription: utils_2.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            Possible settings are:\n\n            * `\"", "\"`: Allows trailing whitespace in comments.\n            * `\"", "\"`: Allows trailing whitespace only in JSDoc comments."], ["\n            Possible settings are:\n\n            * \\`\"", "\"\\`: Allows trailing whitespace in comments.\n            * \\`\"", "\"\\`: Allows trailing whitespace only in JSDoc comments."])), OPTION_IGNORE_COMMENTS, OPTION_IGNORE_JSDOC),
                    hasFix: true,
                    options: {
                        type: "array",
                        items: {
                            type: "string",
                            enum: [OPTION_IGNORE_COMMENTS, OPTION_IGNORE_JSDOC]
                        }
                    },
                    optionExamples: ["true", "[true, \"" + OPTION_IGNORE_COMMENTS + "\"]", "[true, \"" + OPTION_IGNORE_JSDOC + "\"]"],
                    type: "style",
                    typescriptOnly: false
                };
                Rule.FAILURE_STRING = "trailing whitespace";
                return Rule;
            }(abstractRule_1.AbstractRule);
            exports_1("Rule", Rule);
        }
    };
});
System.register("src/mode/tslint/rules/noVarKeywordRule.js", ["../language/rule/abstractRule", "../language/utils", "../language/walker/ruleWalker"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __moduleName = context_1 && context_1.id;
    var abstractRule_1, utils_1, ruleWalker_1, Rule, NoVarKeywordWalker;
    return {
        setters: [function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }, function (utils_1_1) {
            utils_1 = utils_1_1;
        }, function (ruleWalker_1_1) {
            ruleWalker_1 = ruleWalker_1_1;
        }],
        execute: function () {
            Rule = function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    var noVarKeywordWalker = new NoVarKeywordWalker(sourceFile, this.getOptions());
                    return this.applyWithWalker(noVarKeywordWalker);
                };
                Rule.metadata = {
                    ruleName: "no-var-keyword",
                    description: "Disallows usage of the `var` keyword.",
                    descriptionDetails: "Use `let` or `const` instead.",
                    hasFix: true,
                    optionsDescription: "Not configurable.",
                    options: null,
                    optionExamples: ["true"],
                    type: "functionality",
                    typescriptOnly: false
                };
                Rule.FAILURE_STRING = "Forbidden 'var' keyword, use 'let' or 'const' instead";
                return Rule;
            }(abstractRule_1.AbstractRule);
            exports_1("Rule", Rule);
            NoVarKeywordWalker = function (_super) {
                __extends(NoVarKeywordWalker, _super);
                function NoVarKeywordWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                NoVarKeywordWalker.prototype.visitVariableStatement = function (node) {
                    if (!utils_1.hasModifier(node.modifiers, ts.SyntaxKind.DeclareKeyword) && !utils_1.isBlockScopedVariable(node)) {
                        this.reportFailure(node.declarationList);
                    }
                    _super.prototype.visitVariableStatement.call(this, node);
                };
                NoVarKeywordWalker.prototype.visitForStatement = function (node) {
                    this.handleInitializerNode(node.initializer);
                    _super.prototype.visitForStatement.call(this, node);
                };
                NoVarKeywordWalker.prototype.visitForInStatement = function (node) {
                    this.handleInitializerNode(node.initializer);
                    _super.prototype.visitForInStatement.call(this, node);
                };
                NoVarKeywordWalker.prototype.visitForOfStatement = function (node) {
                    this.handleInitializerNode(node.initializer);
                    _super.prototype.visitForOfStatement.call(this, node);
                };
                NoVarKeywordWalker.prototype.handleInitializerNode = function (node) {
                    if (node && node.kind === ts.SyntaxKind.VariableDeclarationList && !(utils_1.isNodeFlagSet(node, ts.NodeFlags.Let) || utils_1.isNodeFlagSet(node, ts.NodeFlags.Const))) {
                        this.reportFailure(node);
                    }
                };
                NoVarKeywordWalker.prototype.reportFailure = function (node) {
                    var nodeStart = node.getStart(this.getSourceFile());
                    this.addFailureAt(nodeStart, "var".length, Rule.FAILURE_STRING, this.createFix(this.createReplacement(nodeStart, "var".length, "let")));
                };
                return NoVarKeywordWalker;
            }(ruleWalker_1.RuleWalker);
        }
    };
});
System.register("src/mode/tslint/configuration.js", ["./utils"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function extendConfigurationFile(targetConfig, nextConfigSource) {
        var combinedConfig = {};
        var configRulesDirectory = utils_1.arrayify(targetConfig.rulesDirectory);
        var nextConfigRulesDirectory = utils_1.arrayify(nextConfigSource.rulesDirectory);
        combinedConfig.rulesDirectory = configRulesDirectory.concat(nextConfigRulesDirectory);
        var combineProperties = function (targetProperty, nextProperty) {
            var combinedProperty = {};
            for (var _i = 0, _a = Object.keys(utils_1.objectify(targetProperty)); _i < _a.length; _i++) {
                var name = _a[_i];
                combinedProperty[name] = targetProperty[name];
            }
            for (var _b = 0, _c = Object.keys(utils_1.objectify(nextProperty)); _b < _c.length; _b++) {
                var name = _c[_b];
                combinedProperty[name] = nextProperty[name];
            }
            return combinedProperty;
        };
        combinedConfig.rules = combineProperties(targetConfig.rules, nextConfigSource.rules);
        combinedConfig.jsRules = combineProperties(targetConfig.jsRules, nextConfigSource.jsRules);
        combinedConfig.linterOptions = combineProperties(targetConfig.linterOptions, nextConfigSource.linterOptions);
        return combinedConfig;
    }
    exports_1("extendConfigurationFile", extendConfigurationFile);
    var utils_1, CONFIG_FILENAME, DEFAULT_CONFIG;
    return {
        setters: [function (utils_1_1) {
            utils_1 = utils_1_1;
        }],
        execute: function () {
            exports_1("CONFIG_FILENAME", CONFIG_FILENAME = "tslint.json");
            exports_1("DEFAULT_CONFIG", DEFAULT_CONFIG = {
                "extends": "tslint:recommended"
            });
        }
    };
});
System.register("src/mode/tslint/formatters/jsonFormatter.js", ["../language/formatter/abstractFormatter", "../utils"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        } else {
            cooked.raw = raw;
        }
        return cooked;
    };
    var __moduleName = context_1 && context_1.id;
    var abstractFormatter_1, Utils, Formatter, templateObject_1;
    return {
        setters: [function (abstractFormatter_1_1) {
            abstractFormatter_1 = abstractFormatter_1_1;
        }, function (Utils_1) {
            Utils = Utils_1;
        }],
        execute: function () {
            Formatter = function (_super) {
                __extends(Formatter, _super);
                function Formatter() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Formatter.prototype.format = function (failures) {
                    var failuresJSON = failures.map(function (failure) {
                        return failure.toJson();
                    });
                    return JSON.stringify(failuresJSON);
                };
                Formatter.metadata = {
                    formatterName: "json",
                    description: "Formats errors as simple JSON.",
                    sample: Utils.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n        [\n            {\n                \"endPosition\": {\n                    \"character\": 13,\n                    \"line\": 0,\n                    \"position\": 13\n                },\n                \"failure\": \"Missing semicolon\",\n                \"fix\": {\n                    \"innerRuleName\": \"semicolon\",\n                    \"innerReplacements\": [\n                        {\n                            \"innerStart\": 13,\n                            \"innerLength\": 0,\n                            \"innerText\": \";\"\n                        }\n                    ]\n                },\n                \"name\": \"myFile.ts\",\n                \"ruleName\": \"semicolon\",\n                \"startPosition\": {\n                    \"character\": 13,\n                    \"line\": 0,\n                    \"position\": 13\n                }\n            }\n        ]"], ["\n        [\n            {\n                \"endPosition\": {\n                    \"character\": 13,\n                    \"line\": 0,\n                    \"position\": 13\n                },\n                \"failure\": \"Missing semicolon\",\n                \"fix\": {\n                    \"innerRuleName\": \"semicolon\",\n                    \"innerReplacements\": [\n                        {\n                            \"innerStart\": 13,\n                            \"innerLength\": 0,\n                            \"innerText\": \";\"\n                        }\n                    ]\n                },\n                \"name\": \"myFile.ts\",\n                \"ruleName\": \"semicolon\",\n                \"startPosition\": {\n                    \"character\": 13,\n                    \"line\": 0,\n                    \"position\": 13\n                }\n            }\n        ]"]))),
                    consumer: "machine"
                };
                return Formatter;
            }(abstractFormatter_1.AbstractFormatter);
            exports_1("Formatter", Formatter);
        }
    };
});
System.register("src/mode/tslint/formatters/pmdFormatter.js", ["../language/formatter/abstractFormatter", "../utils"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        } else {
            cooked.raw = raw;
        }
        return cooked;
    };
    var __moduleName = context_1 && context_1.id;
    var abstractFormatter_1, Utils, Formatter, templateObject_1;
    return {
        setters: [function (abstractFormatter_1_1) {
            abstractFormatter_1 = abstractFormatter_1_1;
        }, function (Utils_1) {
            Utils = Utils_1;
        }],
        execute: function () {
            Formatter = function (_super) {
                __extends(Formatter, _super);
                function Formatter() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Formatter.prototype.format = function (failures) {
                    var output = "<pmd version=\"tslint\">";
                    for (var _i = 0, failures_1 = failures; _i < failures_1.length; _i++) {
                        var failure = failures_1[_i];
                        var failureString = failure.getFailure().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#39;").replace(/"/g, "&quot;");
                        var lineAndCharacter = failure.getStartPosition().getLineAndCharacter();
                        output += "<file name=\"" + failure.getFileName();
                        output += "\"><violation begincolumn=\"" + (lineAndCharacter.character + 1);
                        output += "\" beginline=\"" + (lineAndCharacter.line + 1);
                        output += "\" priority=\"1\"";
                        output += " rule=\"" + failureString + "\"> </violation></file>";
                    }
                    output += "</pmd>";
                    return output;
                };
                Formatter.metadata = {
                    formatterName: "pmd",
                    description: "Formats errors as through they were PMD output.",
                    descriptionDetails: "Imitates the XML output from PMD. All errors have a priority of 1.",
                    sample: Utils.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n        <pmd version=\"tslint\">\n            <file name=\"myFile.ts\">\n                <violation begincolumn=\"14\" beginline=\"1\" priority=\"1\" rule=\"Missing semicolon\"></violation>\n            </file>\n        </pmd>"], ["\n        <pmd version=\"tslint\">\n            <file name=\"myFile.ts\">\n                <violation begincolumn=\"14\" beginline=\"1\" priority=\"1\" rule=\"Missing semicolon\"></violation>\n            </file>\n        </pmd>"]))),
                    consumer: "machine"
                };
                return Formatter;
            }(abstractFormatter_1.AbstractFormatter);
            exports_1("Formatter", Formatter);
        }
    };
});
System.register("src/mode/tslint/formatters/proseFormatter.js", ["../language/formatter/abstractFormatter"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __moduleName = context_1 && context_1.id;
    var abstractFormatter_1, Formatter;
    return {
        setters: [function (abstractFormatter_1_1) {
            abstractFormatter_1 = abstractFormatter_1_1;
        }],
        execute: function () {
            Formatter = function (_super) {
                __extends(Formatter, _super);
                function Formatter() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Formatter.prototype.format = function (failures, fixes) {
                    if (failures.length === 0 && (!fixes || fixes.length === 0)) {
                        return "";
                    }
                    var fixLines = [];
                    if (fixes) {
                        var perFileFixes = new Map();
                        for (var _i = 0, fixes_1 = fixes; _i < fixes_1.length; _i++) {
                            var fix = fixes_1[_i];
                            perFileFixes.set(fix.getFileName(), (perFileFixes.get(fix.getFileName()) || 0) + 1);
                        }
                        perFileFixes.forEach(function (fixCount, fixedFile) {
                            fixLines.push("Fixed " + fixCount + " error(s) in " + fixedFile);
                        });
                        fixLines.push("");
                    }
                    var errorLines = failures.map(function (failure) {
                        var fileName = failure.getFileName();
                        var failureString = failure.getFailure();
                        var lineAndCharacter = failure.getStartPosition().getLineAndCharacter();
                        var positionTuple = "[" + (lineAndCharacter.line + 1) + ", " + (lineAndCharacter.character + 1) + "]";
                        return "" + fileName + positionTuple + ": " + failureString;
                    });
                    return fixLines.concat(errorLines).join("\n") + "\n";
                };
                Formatter.metadata = {
                    formatterName: "prose",
                    description: "The default formatter which outputs simple human-readable messages.",
                    sample: "myFile.ts[1, 14]: Missing semicolon",
                    consumer: "human"
                };
                return Formatter;
            }(abstractFormatter_1.AbstractFormatter);
            exports_1("Formatter", Formatter);
        }
    };
});
System.register("src/mode/tslint/formatters/verboseFormatter.js", ["../language/formatter/abstractFormatter"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __moduleName = context_1 && context_1.id;
    var abstractFormatter_1, Formatter;
    return {
        setters: [function (abstractFormatter_1_1) {
            abstractFormatter_1 = abstractFormatter_1_1;
        }],
        execute: function () {
            Formatter = function (_super) {
                __extends(Formatter, _super);
                function Formatter() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Formatter.prototype.format = function (failures) {
                    var outputLines = failures.map(function (failure) {
                        var fileName = failure.getFileName();
                        var failureString = failure.getFailure();
                        var ruleName = failure.getRuleName();
                        var lineAndCharacter = failure.getStartPosition().getLineAndCharacter();
                        var positionTuple = "[" + (lineAndCharacter.line + 1) + ", " + (lineAndCharacter.character + 1) + "]";
                        return "(" + ruleName + ") " + fileName + positionTuple + ": " + failureString;
                    });
                    return outputLines.join("\n") + "\n";
                };
                Formatter.metadata = {
                    formatterName: "verbose",
                    description: "The human-readable formatter which includes the rule name in messages.",
                    descriptionDetails: "The output is the same as the prose formatter with the rule name included",
                    sample: "(semicolon) myFile.ts[1, 14]: Missing semicolon",
                    consumer: "human"
                };
                return Formatter;
            }(abstractFormatter_1.AbstractFormatter);
            exports_1("Formatter", Formatter);
        }
    };
});
System.register("src/mode/tslint/language/formatter/abstractFormatter.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var AbstractFormatter;
    return {
        setters: [],
        execute: function () {
            AbstractFormatter = function () {
                function AbstractFormatter() {}
                return AbstractFormatter;
            }();
            exports_1("AbstractFormatter", AbstractFormatter);
        }
    };
});
System.register("src/mode/tslint/formatters/fileslistFormatter.js", ["../language/formatter/abstractFormatter"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __moduleName = context_1 && context_1.id;
    var abstractFormatter_1, Formatter;
    return {
        setters: [function (abstractFormatter_1_1) {
            abstractFormatter_1 = abstractFormatter_1_1;
        }],
        execute: function () {
            Formatter = function (_super) {
                __extends(Formatter, _super);
                function Formatter() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Formatter.prototype.format = function (failures) {
                    if (failures.length === 0) {
                        return "";
                    }
                    var files = [];
                    var currentFile;
                    for (var _i = 0, failures_1 = failures; _i < failures_1.length; _i++) {
                        var failure = failures_1[_i];
                        var fileName = failure.getFileName();
                        if (fileName !== currentFile) {
                            files.push(fileName);
                            currentFile = fileName;
                        }
                    }
                    return files.join("\n") + "\n";
                };
                Formatter.metadata = {
                    formatterName: "filesList",
                    description: "Lists files containing lint errors.",
                    sample: "directory/myFile.ts",
                    consumer: "machine"
                };
                return Formatter;
            }(abstractFormatter_1.AbstractFormatter);
            exports_1("Formatter", Formatter);
        }
    };
});
System.register("src/mode/tslint/formatters/index.js", ["./jsonFormatter", "./pmdFormatter", "./proseFormatter", "./verboseFormatter", "./fileslistFormatter"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (jsonFormatter_1_1) {
            exports_1({
                "JsonFormatter": jsonFormatter_1_1["Formatter"]
            });
        }, function (pmdFormatter_1_1) {
            exports_1({
                "PmdFormatter": pmdFormatter_1_1["Formatter"]
            });
        }, function (proseFormatter_1_1) {
            exports_1({
                "ProseFormatter": proseFormatter_1_1["Formatter"]
            });
        }, function (verboseFormatter_1_1) {
            exports_1({
                "VerboseFormatter": verboseFormatter_1_1["Formatter"]
            });
        }, function (fileslistFormatter_1_1) {
            exports_1({
                "FileslistFormatter": fileslistFormatter_1_1["Formatter"]
            });
        }],
        execute: function () {}
    };
});
System.register("src/mode/tslint/formatters.js", ["./language/formatter/abstractFormatter", "./formatters/index"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function exportStar_1(m) {
        var exports = {};
        for (var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_1(exports);
    }
    return {
        setters: [function (abstractFormatter_1_1) {
            exportStar_1(abstractFormatter_1_1);
        }, function (index_1_1) {
            exportStar_1(index_1_1);
        }],
        execute: function () {}
    };
});
System.register("src/mode/tslint/language/rule/typedRule.js", ["./abstractRule"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __moduleName = context_1 && context_1.id;
    var abstractRule_1, TypedRule;
    return {
        setters: [function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }],
        execute: function () {
            TypedRule = function (_super) {
                __extends(TypedRule, _super);
                function TypedRule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                TypedRule.isTypedRule = function (rule) {
                    return "applyWithProgram" in rule;
                };
                TypedRule.prototype.apply = function () {
                    throw new Error("The '" + this.ruleName + "' rule requires type checking");
                };
                return TypedRule;
            }(abstractRule_1.AbstractRule);
            exports_1("TypedRule", TypedRule);
        }
    };
});
System.register("src/mode/tslint/rules.js", ["./language/rule/abstractRule", "./language/rule/typedRule"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function exportStar_1(m) {
        var exports = {};
        for (var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_1(exports);
    }
    return {
        setters: [function (abstractRule_1_1) {
            exportStar_1(abstractRule_1_1);
        }, function (typedRule_1_1) {
            exportStar_1(typedRule_1_1);
        }],
        execute: function () {}
    };
});
System.register("src/mode/tslint/enableDisableRules.js", ["./language/rule/abstractRule", "./language/utils"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var abstractRule_1, utils_1, EnableDisableRulesWalker;
    return {
        setters: [function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }, function (utils_1_1) {
            utils_1 = utils_1_1;
        }],
        execute: function () {
            EnableDisableRulesWalker = function () {
                function EnableDisableRulesWalker(sourceFile, rules) {
                    this.sourceFile = sourceFile;
                    this.enableDisableRuleMap = {};
                    this.enabledRules = [];
                    if (rules) {
                        for (var _i = 0, _a = Object.keys(rules); _i < _a.length; _i++) {
                            var rule = _a[_i];
                            if (abstractRule_1.AbstractRule.isRuleEnabled(rules[rule])) {
                                this.enabledRules.push(rule);
                                this.enableDisableRuleMap[rule] = [{
                                    isEnabled: true,
                                    position: 0
                                }];
                            }
                        }
                    }
                }
                EnableDisableRulesWalker.prototype.getEnableDisableRuleMap = function () {
                    var _this = this;
                    utils_1.forEachComment(this.sourceFile, function (fullText, kind, pos) {
                        var commentText = kind === ts.SyntaxKind.SingleLineCommentTrivia ? fullText.substring(pos.tokenStart + 2, pos.end) : fullText.substring(pos.tokenStart + 2, pos.end - 2);
                        return _this.handleComment(commentText, pos);
                    });
                    return this.enableDisableRuleMap;
                };
                EnableDisableRulesWalker.prototype.getStartOfLinePosition = function (position, lineOffset) {
                    if (lineOffset === void 0) {
                        lineOffset = 0;
                    }
                    var line = ts.getLineAndCharacterOfPosition(this.sourceFile, position).line + lineOffset;
                    var lineStarts = this.sourceFile.getLineStarts();
                    if (line >= lineStarts.length) {
                        return undefined;
                    }
                    return lineStarts[line];
                };
                EnableDisableRulesWalker.prototype.switchRuleState = function (ruleName, isEnabled, start, end) {
                    var ruleStateMap = this.enableDisableRuleMap[ruleName];
                    if (ruleStateMap === undefined || isEnabled === ruleStateMap[ruleStateMap.length - 1].isEnabled) {
                        return;
                    }
                    ruleStateMap.push({
                        isEnabled: isEnabled,
                        position: start
                    });
                    if (end) {
                        ruleStateMap.push({
                            isEnabled: !isEnabled,
                            position: end
                        });
                    }
                };
                EnableDisableRulesWalker.prototype.handleComment = function (commentText, pos) {
                    var match = /^\s*tslint:(enable|disable)(?:-(line|next-line))?(:|\s|$)/.exec(commentText);
                    if (match !== null) {
                        var rulesList = commentText.substr(match[0].length).split(/\s+/).filter(function (rule) {
                            return !!rule;
                        });
                        if (rulesList.length === 0 && match[3] === ":") {
                            return;
                        }
                        if (rulesList.length === 0 || rulesList.indexOf("all") !== -1) {
                            rulesList = this.enabledRules;
                        }
                        this.handleTslintLineSwitch(rulesList, match[1] === "enable", match[2], pos);
                    }
                };
                EnableDisableRulesWalker.prototype.handleTslintLineSwitch = function (rules, isEnabled, modifier, pos) {
                    var start;
                    var end;
                    if (modifier === "line") {
                        start = this.getStartOfLinePosition(pos.tokenStart);
                        end = this.getStartOfLinePosition(pos.end, 1);
                    } else if (modifier === "next-line") {
                        start = this.getStartOfLinePosition(pos.end, 1);
                        if (start === undefined) {
                            return;
                        }
                        end = this.getStartOfLinePosition(pos.end, 2);
                    } else {
                        start = pos.tokenStart;
                        end = undefined;
                    }
                    for (var _i = 0, rules_1 = rules; _i < rules_1.length; _i++) {
                        var ruleToSwitch = rules_1[_i];
                        this.switchRuleState(ruleToSwitch, isEnabled, start, end);
                    }
                };
                return EnableDisableRulesWalker;
            }();
            exports_1("EnableDisableRulesWalker", EnableDisableRulesWalker);
        }
    };
});
System.register("src/mode/tslint/language/languageServiceHost.js", ["./utils"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function wrapProgram(program) {
        var files = new Map();
        var fileVersions = new Map();
        var host = {
            getCompilationSettings: function () {
                return program.getCompilerOptions();
            },
            getCurrentDirectory: function () {
                return program.getCurrentDirectory();
            },
            getDefaultLibFileName: function () {
                return "lib.d.ts";
            },
            getScriptFileNames: function () {
                return program.getSourceFiles().map(function (sf) {
                    return sf.fileName;
                });
            },
            getScriptSnapshot: function (name) {
                var file = files.get(name);
                if (file !== undefined) {
                    return ts.ScriptSnapshot.fromString(file);
                }
                if (!program.getSourceFile(name)) {
                    return undefined;
                }
                return ts.ScriptSnapshot.fromString(program.getSourceFile(name).getFullText());
            },
            getScriptVersion: function (name) {
                var version = fileVersions.get(name);
                return version === undefined ? "1" : String(version);
            },
            log: function () {},
            editFile: function (fileName, newContent) {
                files.set(fileName, newContent);
                var prevVersion = fileVersions.get(fileName);
                fileVersions.set(fileName, prevVersion === undefined ? 0 : prevVersion + 1);
            }
        };
        var langSvc = ts.createLanguageService(host, ts.createDocumentRegistry());
        langSvc.editFile = host.editFile;
        return langSvc;
    }
    exports_1("wrapProgram", wrapProgram);
    function checkEdit(ls, sf, newText) {
        if (ls.hasOwnProperty("editFile")) {
            var host = ls;
            host.editFile(sf.fileName, newText);
            var newProgram = ls.getProgram();
            var newSf = newProgram.getSourceFile(sf.fileName);
            var newDiags = ts.getPreEmitDiagnostics(newProgram, newSf);
            host.editFile(sf.fileName, sf.getFullText());
            return newDiags;
        }
        return [];
    }
    exports_1("checkEdit", checkEdit);
    function createLanguageServiceHost(fileName, source) {
        return {
            getCompilationSettings: function () {
                return utils_1.createCompilerOptions();
            },
            getCurrentDirectory: function () {
                return "";
            },
            getDefaultLibFileName: function () {
                return "lib.d.ts";
            },
            getScriptFileNames: function () {
                return [fileName];
            },
            getScriptSnapshot: function (name) {
                return ts.ScriptSnapshot.fromString(name === fileName ? source : "");
            },
            getScriptVersion: function () {
                return "1";
            },
            log: function () {}
        };
    }
    exports_1("createLanguageServiceHost", createLanguageServiceHost);
    function createLanguageService(fileName, source) {
        var languageServiceHost = createLanguageServiceHost(fileName, source);
        return ts.createLanguageService(languageServiceHost);
    }
    exports_1("createLanguageService", createLanguageService);
    var utils_1;
    return {
        setters: [function (utils_1_1) {
            utils_1 = utils_1_1;
        }],
        execute: function () {}
    };
});
System.register("src/mode/tslint/language/walker/walker.js", ["./walkContext"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __moduleName = context_1 && context_1.id;
    var walkContext_1, AbstractWalker;
    return {
        setters: [function (walkContext_1_1) {
            walkContext_1 = walkContext_1_1;
        }],
        execute: function () {
            AbstractWalker = function (_super) {
                __extends(AbstractWalker, _super);
                function AbstractWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                AbstractWalker.prototype.getSourceFile = function () {
                    return this.sourceFile;
                };
                AbstractWalker.prototype.getFailures = function () {
                    return this.failures;
                };
                return AbstractWalker;
            }(walkContext_1.WalkContext);
            exports_1("AbstractWalker", AbstractWalker);
        }
    };
});
System.register("src/mode/tslint/index.js", ["./configuration", "./formatters", "./linter", "./rules", "./utils", "./language/rule/rule", "./enableDisableRules", "./ruleLoader", "./language/utils", "./language/languageServiceHost", "./language/walker/walker"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var Configuration, Formatters, Linter, Rules, Utils;
    var exportedNames_1 = {
        "Configuration": true,
        "Formatters": true,
        "Linter": true,
        "Rules": true,
        "Utils": true
    };
    function exportStar_1(m) {
        var exports = {};
        for (var n in m) {
            if (n !== "default" && !exportedNames_1.hasOwnProperty(n)) exports[n] = m[n];
        }
        exports_1(exports);
    }
    return {
        setters: [function (Configuration_1) {
            Configuration = Configuration_1;
        }, function (Formatters_1) {
            Formatters = Formatters_1;
        }, function (Linter_1) {
            Linter = Linter_1;
        }, function (Rules_1) {
            Rules = Rules_1;
        }, function (Utils_1) {
            Utils = Utils_1;
        }, function (rule_1_1) {
            exportStar_1(rule_1_1);
        }, function (enableDisableRules_1_1) {
            exportStar_1(enableDisableRules_1_1);
        }, function (ruleLoader_1_1) {
            exportStar_1(ruleLoader_1_1);
        }, function (utils_1_1) {
            exportStar_1(utils_1_1);
        }, function (languageServiceHost_1_1) {
            exportStar_1(languageServiceHost_1_1);
        }, function (walker_1_1) {
            exportStar_1(walker_1_1);
        }],
        execute: function () {
            exports_1("Configuration", Configuration);
            exports_1("Formatters", Formatters);
            exports_1("Linter", Linter);
            exports_1("Rules", Rules);
            exports_1("Utils", Utils);
        }
    };
});
System.register("src/mode/tslint/rules/oneVariablePerDeclarationRule.js", ["../language/rule/abstractRule", "../language/walker/ruleWalker", "../index"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        } else {
            cooked.raw = raw;
        }
        return cooked;
    };
    var __moduleName = context_1 && context_1.id;
    var abstractRule_1, ruleWalker_1, Lint, OPTION_IGNORE_FOR_LOOP, Rule, OneVariablePerDeclarationWalker, templateObject_1;
    return {
        setters: [function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }, function (ruleWalker_1_1) {
            ruleWalker_1 = ruleWalker_1_1;
        }, function (Lint_1) {
            Lint = Lint_1;
        }],
        execute: function () {
            OPTION_IGNORE_FOR_LOOP = "ignore-for-loop";
            Rule = function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    var oneVarWalker = new OneVariablePerDeclarationWalker(sourceFile, this.getOptions());
                    return this.applyWithWalker(oneVarWalker);
                };
                Rule.metadata = {
                    ruleName: "one-variable-per-declaration",
                    description: "Disallows multiple variable definitions in the same declaration statement.",
                    optionsDescription: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            One argument may be optionally provided:\n\n            * `", "` allows multiple variable definitions in a for loop declaration."], ["\n            One argument may be optionally provided:\n\n            * \\`", "\\` allows multiple variable definitions in a for loop declaration."])), OPTION_IGNORE_FOR_LOOP),
                    options: {
                        type: "array",
                        items: {
                            type: "string",
                            enum: [OPTION_IGNORE_FOR_LOOP]
                        },
                        minLength: 0,
                        maxLength: 1
                    },
                    optionExamples: ["true", "[true, \"" + OPTION_IGNORE_FOR_LOOP + "\"]"],
                    type: "style",
                    typescriptOnly: false
                };
                Rule.FAILURE_STRING = "Multiple variable declarations in the same statement are forbidden";
                return Rule;
            }(abstractRule_1.AbstractRule);
            exports_1("Rule", Rule);
            OneVariablePerDeclarationWalker = function (_super) {
                __extends(OneVariablePerDeclarationWalker, _super);
                function OneVariablePerDeclarationWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                OneVariablePerDeclarationWalker.prototype.visitVariableStatement = function (node) {
                    var declarationList = node.declarationList;
                    if (declarationList.declarations.length > 1) {
                        this.addFailureAtNode(node, Rule.FAILURE_STRING);
                    }
                    _super.prototype.visitVariableStatement.call(this, node);
                };
                OneVariablePerDeclarationWalker.prototype.visitForStatement = function (node) {
                    var initializer = node.initializer;
                    var shouldIgnoreForLoop = this.hasOption(OPTION_IGNORE_FOR_LOOP);
                    if (!shouldIgnoreForLoop && initializer != null && initializer.kind === ts.SyntaxKind.VariableDeclarationList && initializer.declarations.length > 1) {
                        this.addFailureAtNode(initializer, Rule.FAILURE_STRING);
                    }
                    _super.prototype.visitForStatement.call(this, node);
                };
                return OneVariablePerDeclarationWalker;
            }(ruleWalker_1.RuleWalker);
        }
    };
});
System.register("src/mode/tslint/rules/preferConstRule.js", ["../language/rule/abstractRule", "../language/walker/blockScopeAwareRuleWalker", "../language/utils", "../utils"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        } else {
            cooked.raw = raw;
        }
        return cooked;
    };
    var __moduleName = context_1 && context_1.id;
    var abstractRule_1, blockScopeAwareRuleWalker_1, utils_1, utils_2, utils_3, Rule, PreferConstWalker, ScopeInfo, templateObject_1;
    return {
        setters: [function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }, function (blockScopeAwareRuleWalker_1_1) {
            blockScopeAwareRuleWalker_1 = blockScopeAwareRuleWalker_1_1;
        }, function (utils_1_1) {
            utils_1 = utils_1_1;
            utils_3 = utils_1_1;
        }, function (utils_2_1) {
            utils_2 = utils_2_1;
        }],
        execute: function () {
            Rule = function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    var preferConstWalker = new PreferConstWalker(sourceFile, this.getOptions());
                    return this.applyWithWalker(preferConstWalker);
                };
                Rule.metadata = {
                    ruleName: "prefer-const",
                    description: "Requires that variable declarations use `const` instead of `let` if possible.",
                    descriptionDetails: utils_2.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            If a variable is only assigned to once when it is declared, it should be declared using 'const'"], ["\n            If a variable is only assigned to once when it is declared, it should be declared using 'const'"]))),
                    hasFix: true,
                    optionsDescription: "Not configurable.",
                    options: null,
                    optionExamples: ["true"],
                    type: "maintainability",
                    typescriptOnly: false
                };
                Rule.FAILURE_STRING_FACTORY = function (identifier) {
                    return "Identifier '" + identifier + "' is never reassigned; use 'const' instead of 'let'.";
                };
                return Rule;
            }(abstractRule_1.AbstractRule);
            exports_1("Rule", Rule);
            PreferConstWalker = function (_super) {
                __extends(PreferConstWalker, _super);
                function PreferConstWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                PreferConstWalker.collect = function (statements, scopeInfo) {
                    for (var _i = 0, statements_1 = statements; _i < statements_1.length; _i++) {
                        var s = statements_1[_i];
                        if (s.kind === ts.SyntaxKind.VariableStatement) {
                            PreferConstWalker.collectInVariableDeclarationList(s.declarationList, scopeInfo);
                        }
                    }
                };
                PreferConstWalker.collectInVariableDeclarationList = function (node, scopeInfo) {
                    var allowConst;
                    if (ts.getCombinedModifierFlags === undefined) {
                        allowConst = utils_3.isCombinedNodeFlagSet(node, ts.NodeFlags.Let) && !utils_1.hasModifier(node.parent.modifiers, ts.SyntaxKind.ExportKeyword);
                    } else {
                        allowConst = utils_3.isCombinedNodeFlagSet(node, ts.NodeFlags.Let) && !utils_3.isCombinedModifierFlagSet(node, ts.ModifierFlags.Export);
                    }
                    if (allowConst) {
                        for (var _i = 0, _a = node.declarations; _i < _a.length; _i++) {
                            var decl = _a[_i];
                            PreferConstWalker.addDeclarationName(decl.name, node, scopeInfo);
                        }
                    }
                };
                PreferConstWalker.addDeclarationName = function (node, container, scopeInfo) {
                    if (node.kind === ts.SyntaxKind.Identifier) {
                        scopeInfo.addVariable(node, container);
                    } else {
                        for (var _i = 0, _a = node.elements; _i < _a.length; _i++) {
                            var el = _a[_i];
                            if (el.kind === ts.SyntaxKind.BindingElement) {
                                PreferConstWalker.addDeclarationName(el.name, container, scopeInfo);
                            }
                        }
                    }
                };
                PreferConstWalker.prototype.createScope = function () {
                    return {};
                };
                PreferConstWalker.prototype.createBlockScope = function (node) {
                    var scopeInfo = new ScopeInfo();
                    switch (node.kind) {
                        case ts.SyntaxKind.SourceFile:
                            PreferConstWalker.collect(node.statements, scopeInfo);
                            break;
                        case ts.SyntaxKind.Block:
                            PreferConstWalker.collect(node.statements, scopeInfo);
                            break;
                        case ts.SyntaxKind.ModuleDeclaration:
                            var body = node.body;
                            if (body && body.kind === ts.SyntaxKind.ModuleBlock) {
                                PreferConstWalker.collect(body.statements, scopeInfo);
                            }
                            break;
                        case ts.SyntaxKind.ForStatement:
                        case ts.SyntaxKind.ForOfStatement:
                        case ts.SyntaxKind.ForInStatement:
                            var initializer = node.initializer;
                            if (initializer && initializer.kind === ts.SyntaxKind.VariableDeclarationList) {
                                PreferConstWalker.collectInVariableDeclarationList(initializer, scopeInfo);
                            }
                            break;
                        case ts.SyntaxKind.SwitchStatement:
                            for (var _i = 0, _a = node.caseBlock.clauses; _i < _a.length; _i++) {
                                var caseClause = _a[_i];
                                PreferConstWalker.collect(caseClause.statements, scopeInfo);
                            }
                            break;
                        default:
                            break;
                    }
                    return scopeInfo;
                };
                PreferConstWalker.prototype.onBlockScopeEnd = function () {
                    var seenLetStatements = new Set();
                    for (var _i = 0, _a = this.getCurrentBlockScope().getConstCandiates(); _i < _a.length; _i++) {
                        var usage = _a[_i];
                        var fix = void 0;
                        if (!usage.reassignedSibling && !seenLetStatements.has(usage.letStatement)) {
                            fix = this.createFix(this.createReplacement(usage.letStatement.getStart(), "let".length, "const"));
                            seenLetStatements.add(usage.letStatement);
                        }
                        this.addFailureAtNode(usage.identifier, Rule.FAILURE_STRING_FACTORY(usage.identifier.text), fix);
                    }
                };
                PreferConstWalker.prototype.visitBinaryExpression = function (node) {
                    if (utils_3.isAssignment(node)) {
                        this.handleLHSExpression(node.left);
                    }
                    _super.prototype.visitBinaryExpression.call(this, node);
                };
                PreferConstWalker.prototype.visitPrefixUnaryExpression = function (node) {
                    this.handleUnaryExpression(node);
                    _super.prototype.visitPrefixUnaryExpression.call(this, node);
                };
                PreferConstWalker.prototype.visitPostfixUnaryExpression = function (node) {
                    this.handleUnaryExpression(node);
                    _super.prototype.visitPostfixUnaryExpression.call(this, node);
                };
                PreferConstWalker.prototype.handleLHSExpression = function (node) {
                    var _this = this;
                    node = utils_3.unwrapParentheses(node);
                    if (node.kind === ts.SyntaxKind.Identifier) {
                        this.markAssignment(node);
                    } else if (node.kind === ts.SyntaxKind.ArrayLiteralExpression) {
                        var deconstructionArray = node;
                        deconstructionArray.elements.forEach(function (child) {
                            _this.handleLHSExpression(child);
                        });
                    } else if (node.kind === ts.SyntaxKind.ObjectLiteralExpression) {
                        for (var _i = 0, _a = node.properties; _i < _a.length; _i++) {
                            var prop = _a[_i];
                            switch (prop.kind) {
                                case ts.SyntaxKind.PropertyAssignment:
                                    this.handleLHSExpression(prop.initializer);
                                    break;
                                case ts.SyntaxKind.ShorthandPropertyAssignment:
                                    this.handleLHSExpression(prop.name);
                                    break;
                                case ts.SyntaxKind.SpreadAssignment:
                                    this.handleLHSExpression(prop.expression);
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                };
                PreferConstWalker.prototype.handleUnaryExpression = function (node) {
                    if (node.operator === ts.SyntaxKind.PlusPlusToken || node.operator === ts.SyntaxKind.MinusMinusToken) {
                        this.handleLHSExpression(node.operand);
                    }
                };
                PreferConstWalker.prototype.markAssignment = function (identifier) {
                    var allBlockScopes = this.getAllBlockScopes();
                    for (var i = allBlockScopes.length - 1; i >= 0; i--) {
                        if (allBlockScopes[i].incrementVariableUsage(identifier.text)) {
                            break;
                        }
                    }
                };
                return PreferConstWalker;
            }(blockScopeAwareRuleWalker_1.BlockScopeAwareRuleWalker);
            ScopeInfo = function () {
                function ScopeInfo() {
                    this.identifierUsages = new Map();
                    this.sharedLetSets = new Map();
                }
                ScopeInfo.prototype.addVariable = function (identifier, letStatement) {
                    this.identifierUsages.set(identifier.text, { letStatement: letStatement, identifier: identifier, usageCount: 0 });
                    var shared = this.sharedLetSets.get(letStatement);
                    if (shared === undefined) {
                        shared = [];
                        this.sharedLetSets.set(letStatement, shared);
                    }
                    shared.push(identifier.text);
                };
                ScopeInfo.prototype.getConstCandiates = function () {
                    var _this = this;
                    var constCandidates = [];
                    this.sharedLetSets.forEach(function (variableNames) {
                        var anyReassigned = variableNames.some(function (key) {
                            return _this.identifierUsages.get(key).usageCount > 0;
                        });
                        for (var _i = 0, variableNames_1 = variableNames; _i < variableNames_1.length; _i++) {
                            var variableName = variableNames_1[_i];
                            var usage = _this.identifierUsages.get(variableName);
                            if (usage.usageCount === 0) {
                                constCandidates.push({
                                    identifier: usage.identifier,
                                    letStatement: usage.letStatement,
                                    reassignedSibling: anyReassigned
                                });
                            }
                        }
                    });
                    return constCandidates;
                };
                ScopeInfo.prototype.incrementVariableUsage = function (varName) {
                    var usages = this.identifierUsages.get(varName);
                    if (usages !== undefined) {
                        usages.usageCount++;
                        return true;
                    }
                    return false;
                };
                return ScopeInfo;
            }();
        }
    };
});
System.register("src/mode/tslint/language/walker/scopeAwareRuleWalker.js", ["../utils", "./ruleWalker"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __moduleName = context_1 && context_1.id;
    var utils_1, ruleWalker_1, ScopeAwareRuleWalker;
    return {
        setters: [function (utils_1_1) {
            utils_1 = utils_1_1;
        }, function (ruleWalker_1_1) {
            ruleWalker_1 = ruleWalker_1_1;
        }],
        execute: function () {
            ScopeAwareRuleWalker = function (_super) {
                __extends(ScopeAwareRuleWalker, _super);
                function ScopeAwareRuleWalker(sourceFile, options) {
                    var _this = _super.call(this, sourceFile, options) || this;
                    _this.scopeStack = ts.isExternalModule(sourceFile) ? [] : [_this.createScope(sourceFile)];
                    return _this;
                }
                ScopeAwareRuleWalker.prototype.getCurrentScope = function () {
                    return this.scopeStack[this.scopeStack.length - 1];
                };
                ScopeAwareRuleWalker.prototype.getAllScopes = function () {
                    return this.scopeStack;
                };
                ScopeAwareRuleWalker.prototype.getCurrentDepth = function () {
                    return this.scopeStack.length;
                };
                ScopeAwareRuleWalker.prototype.onScopeStart = function () {
                    return;
                };
                ScopeAwareRuleWalker.prototype.onScopeEnd = function () {
                    return;
                };
                ScopeAwareRuleWalker.prototype.visitNode = function (node) {
                    var isNewScope = this.isScopeBoundary(node);
                    if (isNewScope) {
                        this.scopeStack.push(this.createScope(node));
                        this.onScopeStart();
                    }
                    _super.prototype.visitNode.call(this, node);
                    if (isNewScope) {
                        this.onScopeEnd();
                        this.scopeStack.pop();
                    }
                };
                ScopeAwareRuleWalker.prototype.isScopeBoundary = function (node) {
                    return utils_1.isScopeBoundary(node);
                };
                return ScopeAwareRuleWalker;
            }(ruleWalker_1.RuleWalker);
            exports_1("ScopeAwareRuleWalker", ScopeAwareRuleWalker);
        }
    };
});
System.register("src/mode/tslint/language/walker/blockScopeAwareRuleWalker.js", ["../utils", "./scopeAwareRuleWalker"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __moduleName = context_1 && context_1.id;
    var utils_1, scopeAwareRuleWalker_1, BlockScopeAwareRuleWalker;
    return {
        setters: [function (utils_1_1) {
            utils_1 = utils_1_1;
        }, function (scopeAwareRuleWalker_1_1) {
            scopeAwareRuleWalker_1 = scopeAwareRuleWalker_1_1;
        }],
        execute: function () {
            BlockScopeAwareRuleWalker = function (_super) {
                __extends(BlockScopeAwareRuleWalker, _super);
                function BlockScopeAwareRuleWalker(sourceFile, options) {
                    var _this = _super.call(this, sourceFile, options) || this;
                    _this.blockScopeStack = ts.isExternalModule(sourceFile) ? [] : [_this.createBlockScope(sourceFile)];
                    return _this;
                }
                BlockScopeAwareRuleWalker.prototype.getAllBlockScopes = function () {
                    return this.blockScopeStack;
                };
                BlockScopeAwareRuleWalker.prototype.getCurrentBlockScope = function () {
                    return this.blockScopeStack[this.blockScopeStack.length - 1];
                };
                BlockScopeAwareRuleWalker.prototype.getCurrentBlockDepth = function () {
                    return this.blockScopeStack.length;
                };
                BlockScopeAwareRuleWalker.prototype.onBlockScopeStart = function () {
                    return;
                };
                BlockScopeAwareRuleWalker.prototype.onBlockScopeEnd = function () {
                    return;
                };
                BlockScopeAwareRuleWalker.prototype.findBlockScope = function (predicate) {
                    for (var i = this.blockScopeStack.length - 1; i >= 0; i--) {
                        if (predicate(this.blockScopeStack[i])) {
                            return this.blockScopeStack[i];
                        }
                    }
                    return undefined;
                };
                BlockScopeAwareRuleWalker.prototype.visitNode = function (node) {
                    var isNewBlockScope = this.isBlockScopeBoundary(node);
                    if (isNewBlockScope) {
                        this.blockScopeStack.push(this.createBlockScope(node));
                        this.onBlockScopeStart();
                    }
                    _super.prototype.visitNode.call(this, node);
                    if (isNewBlockScope) {
                        this.onBlockScopeEnd();
                        this.blockScopeStack.pop();
                    }
                };
                BlockScopeAwareRuleWalker.prototype.isBlockScopeBoundary = function (node) {
                    return utils_1.isBlockScopeBoundary(node);
                };
                return BlockScopeAwareRuleWalker;
            }(scopeAwareRuleWalker_1.ScopeAwareRuleWalker);
            exports_1("BlockScopeAwareRuleWalker", BlockScopeAwareRuleWalker);
        }
    };
});
System.register("src/mode/tslint/rules/preferForOfRule.js", ["../language/rule/abstractRule", "../language/walker/blockScopeAwareRuleWalker", "../language/utils"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __moduleName = context_1 && context_1.id;
    var abstractRule_1, blockScopeAwareRuleWalker_1, utils_1, Rule, PreferForOfWalker;
    return {
        setters: [function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }, function (blockScopeAwareRuleWalker_1_1) {
            blockScopeAwareRuleWalker_1 = blockScopeAwareRuleWalker_1_1;
        }, function (utils_1_1) {
            utils_1 = utils_1_1;
        }],
        execute: function () {
            Rule = function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    return this.applyWithWalker(new PreferForOfWalker(sourceFile, this.getOptions()));
                };
                Rule.metadata = {
                    ruleName: "prefer-for-of",
                    description: "Recommends a 'for-of' loop over a standard 'for' loop if the index is only used to access the array being iterated.",
                    rationale: "A for(... of ...) loop is easier to implement and read when the index is not needed.",
                    optionsDescription: "Not configurable.",
                    options: null,
                    optionExamples: ["true"],
                    type: "typescript",
                    typescriptOnly: false
                };
                Rule.FAILURE_STRING = "Expected a 'for-of' loop instead of a 'for' loop with this simple iteration";
                return Rule;
            }(abstractRule_1.AbstractRule);
            exports_1("Rule", Rule);
            PreferForOfWalker = function (_super) {
                __extends(PreferForOfWalker, _super);
                function PreferForOfWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                PreferForOfWalker.prototype.createScope = function () {};
                PreferForOfWalker.prototype.createBlockScope = function () {
                    return new Map();
                };
                PreferForOfWalker.prototype.visitForStatement = function (node) {
                    var arrayNodeInfo = this.getForLoopHeaderInfo(node);
                    var currentBlockScope = this.getCurrentBlockScope();
                    var indexVariableName;
                    if (node.incrementor != null && arrayNodeInfo != null) {
                        var indexVariable = arrayNodeInfo.indexVariable,
                            arrayToken = arrayNodeInfo.arrayToken;
                        indexVariableName = indexVariable.getText();
                        currentBlockScope.set(indexVariableName, {
                            arrayToken: arrayToken,
                            forLoopEndPosition: node.incrementor.end + 1,
                            onlyArrayReadAccess: true
                        });
                    }
                    _super.prototype.visitForStatement.call(this, node);
                    if (indexVariableName != null) {
                        var incrementorState = currentBlockScope.get(indexVariableName);
                        if (incrementorState.onlyArrayReadAccess) {
                            this.addFailureFromStartToEnd(node.getStart(), incrementorState.forLoopEndPosition, Rule.FAILURE_STRING);
                        }
                        currentBlockScope.delete(indexVariableName);
                    }
                };
                PreferForOfWalker.prototype.visitIdentifier = function (node) {
                    var incrementorScope = this.findBlockScope(function (scope) {
                        return scope.has(node.text);
                    });
                    if (incrementorScope != null) {
                        var incrementorState = incrementorScope.get(node.text);
                        if (incrementorState != null && incrementorState.arrayToken != null && incrementorState.forLoopEndPosition < node.getStart()) {
                            if (node.parent.kind === ts.SyntaxKind.ElementAccessExpression) {
                                var elementAccess = node.parent;
                                var arrayIdentifier = utils_1.unwrapParentheses(elementAccess.expression);
                                if (incrementorState.arrayToken.getText() !== arrayIdentifier.getText()) {
                                    incrementorState.onlyArrayReadAccess = false;
                                } else if (elementAccess.parent != null && utils_1.isAssignment(elementAccess.parent)) {
                                    incrementorState.onlyArrayReadAccess = false;
                                }
                            } else {
                                incrementorState.onlyArrayReadAccess = false;
                            }
                        }
                        _super.prototype.visitIdentifier.call(this, node);
                    }
                };
                PreferForOfWalker.prototype.getForLoopHeaderInfo = function (forLoop) {
                    var indexVariableName;
                    var indexVariable;
                    if (forLoop.initializer != null && forLoop.initializer.kind === ts.SyntaxKind.VariableDeclarationList) {
                        var syntaxList = forLoop.initializer.getChildAt(1);
                        if (syntaxList.kind === ts.SyntaxKind.SyntaxList && syntaxList.getChildCount() === 1) {
                            var assignment = syntaxList.getChildAt(0);
                            if (assignment.kind === ts.SyntaxKind.VariableDeclaration && assignment.getChildCount() === 3) {
                                var value = assignment.getChildAt(2).getText();
                                if (value === "0") {
                                    indexVariable = assignment.getChildAt(0);
                                    indexVariableName = indexVariable.getText();
                                }
                            }
                        }
                    }
                    if (indexVariableName == null || forLoop.condition == null || forLoop.condition.kind !== ts.SyntaxKind.BinaryExpression || forLoop.condition.getChildAt(0).getText() !== indexVariableName || forLoop.condition.getChildAt(1).getText() !== "<") {
                        return null;
                    }
                    if (forLoop.incrementor == null || !this.isIncremented(forLoop.incrementor, indexVariableName)) {
                        return null;
                    }
                    var conditionRight = forLoop.condition.getChildAt(2);
                    if (conditionRight.kind === ts.SyntaxKind.PropertyAccessExpression) {
                        var propertyAccess = conditionRight;
                        if (indexVariable != null && propertyAccess.name.getText() === "length") {
                            return { indexVariable: indexVariable, arrayToken: utils_1.unwrapParentheses(propertyAccess.expression) };
                        }
                    }
                    return null;
                };
                PreferForOfWalker.prototype.isIncremented = function (node, indexVariableName) {
                    if (node == null) {
                        return false;
                    }
                    if (node.kind === ts.SyntaxKind.PrefixUnaryExpression) {
                        var incrementor = node;
                        if (incrementor.operator === ts.SyntaxKind.PlusPlusToken && incrementor.operand.getText() === indexVariableName) {
                            return true;
                        }
                    } else if (node.kind === ts.SyntaxKind.PostfixUnaryExpression) {
                        var incrementor = node;
                        if (incrementor.operator === ts.SyntaxKind.PlusPlusToken && incrementor.operand.getText() === indexVariableName) {
                            return true;
                        }
                    } else if (node.kind === ts.SyntaxKind.BinaryExpression) {
                        var binaryExpression = node;
                        if (binaryExpression.operatorToken.getText() === "+=" && binaryExpression.left.getText() === indexVariableName && binaryExpression.right.getText() === "1") {
                            return true;
                        }
                        if (binaryExpression.operatorToken.getText() === "=" && binaryExpression.left.getText() === indexVariableName) {
                            var addExpression = binaryExpression.right;
                            if (addExpression.operatorToken.getText() === "+") {
                                if (addExpression.right.getText() === indexVariableName && addExpression.left.getText() === "1") {
                                    return true;
                                } else if (addExpression.left.getText() === indexVariableName && addExpression.right.getText() === "1") {
                                    return true;
                                }
                            }
                        }
                    }
                    return false;
                };
                return PreferForOfWalker;
            }(blockScopeAwareRuleWalker_1.BlockScopeAwareRuleWalker);
        }
    };
});
System.register("src/mode/tslint/rules/preferFunctionOverMethodRule.js", ["../language/rule/abstractRule", "../language/utils", "../utils", "../language/walker/ruleWalker"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        } else {
            cooked.raw = raw;
        }
        return cooked;
    };
    var __moduleName = context_1 && context_1.id;
    function isRecursiveCall(thisOrSuper, cur) {
        var parent = thisOrSuper.parent;
        return thisOrSuper.kind === ts.SyntaxKind.ThisKeyword && parent.kind === ts.SyntaxKind.PropertyAccessExpression && parent.name.text === cur.name;
    }
    function methodVisibility(node) {
        if (utils_1.hasModifier(node.modifiers, ts.SyntaxKind.PrivateKeyword)) {
            return 2;
        } else if (utils_1.hasModifier(node.modifiers, ts.SyntaxKind.ProtectedKeyword)) {
            return 1;
        } else {
            return 0;
        }
    }
    var abstractRule_1, utils_1, utils_2, ruleWalker_1, OPTION_ALLOW_PUBLIC, OPTION_ALLOW_PROTECTED, Rule, PreferFunctionOverMethodWalker, templateObject_1;
    return {
        setters: [function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }, function (utils_1_1) {
            utils_1 = utils_1_1;
        }, function (utils_2_1) {
            utils_2 = utils_2_1;
        }, function (ruleWalker_1_1) {
            ruleWalker_1 = ruleWalker_1_1;
        }],
        execute: function () {
            OPTION_ALLOW_PUBLIC = "allow-public";
            OPTION_ALLOW_PROTECTED = "allow-protected";
            Rule = function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    return this.applyWithWalker(new PreferFunctionOverMethodWalker(sourceFile, this.getOptions()));
                };
                Rule.metadata = {
                    ruleName: "prefer-function-over-method",
                    description: "Warns for class methods that do not use 'this'.",
                    optionsDescription: utils_2.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            \"", "\" excludes checking of public methods.\n            \"", "\" excludes checking of protected methods."], ["\n            \"", "\" excludes checking of public methods.\n            \"", "\" excludes checking of protected methods."])), OPTION_ALLOW_PUBLIC, OPTION_ALLOW_PROTECTED),
                    options: {
                        type: "string",
                        enum: [OPTION_ALLOW_PUBLIC, OPTION_ALLOW_PROTECTED]
                    },
                    optionExamples: ["true", "[true, \"" + OPTION_ALLOW_PUBLIC + "\", \"" + OPTION_ALLOW_PROTECTED + "\"]"],
                    type: "style",
                    typescriptOnly: false
                };
                Rule.FAILURE_STRING = "Class method does not use 'this'. Use a function instead.";
                return Rule;
            }(abstractRule_1.AbstractRule);
            exports_1("Rule", Rule);
            PreferFunctionOverMethodWalker = function (_super) {
                __extends(PreferFunctionOverMethodWalker, _super);
                function PreferFunctionOverMethodWalker() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.allowPublic = _this.hasOption(OPTION_ALLOW_PUBLIC);
                    _this.allowProtected = _this.hasOption(OPTION_ALLOW_PROTECTED);
                    _this.stack = [];
                    return _this;
                }
                PreferFunctionOverMethodWalker.prototype.visitNode = function (node) {
                    var _this = this;
                    switch (node.kind) {
                        case ts.SyntaxKind.ThisKeyword:
                        case ts.SyntaxKind.SuperKeyword:
                            this.setThisUsed(node);
                            break;
                        case ts.SyntaxKind.MethodDeclaration:
                            var name = node.name;
                            var usesThis = this.withThisScope(name.kind === ts.SyntaxKind.Identifier ? name.text : undefined, function () {
                                return _super.prototype.visitNode.call(_this, node);
                            });
                            if (!usesThis && node.parent.kind !== ts.SyntaxKind.ObjectLiteralExpression && this.shouldWarnForModifiers(node)) {
                                this.addFailureAtNode(node.name, Rule.FAILURE_STRING);
                            }
                            break;
                        case ts.SyntaxKind.FunctionDeclaration:
                        case ts.SyntaxKind.FunctionExpression:
                            this.withThisScope(undefined, function () {
                                return _super.prototype.visitNode.call(_this, node);
                            });
                            break;
                        default:
                            _super.prototype.visitNode.call(this, node);
                    }
                };
                PreferFunctionOverMethodWalker.prototype.setThisUsed = function (node) {
                    var cur = this.stack[this.stack.length - 1];
                    if (cur && !isRecursiveCall(node, cur)) {
                        cur.isThisUsed = true;
                    }
                };
                PreferFunctionOverMethodWalker.prototype.withThisScope = function (name, recur) {
                    this.stack.push({ name: name, isThisUsed: false });
                    recur();
                    return this.stack.pop().isThisUsed;
                };
                PreferFunctionOverMethodWalker.prototype.shouldWarnForModifiers = function (node) {
                    if (utils_1.hasModifier(node.modifiers, ts.SyntaxKind.StaticKeyword, ts.SyntaxKind.AbstractKeyword)) {
                        return false;
                    }
                    switch (methodVisibility(node)) {
                        case 0:
                            return !this.allowPublic;
                        case 1:
                            return !this.allowProtected;
                        default:
                            return true;
                    }
                };
                return PreferFunctionOverMethodWalker;
            }(ruleWalker_1.RuleWalker);
        }
    };
});
System.register("src/mode/tslint/rules/preferMethodSignatureRule.js", ["../language/rule/abstractRule", "../language/utils", "../language/walker/ruleWalker"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __moduleName = context_1 && context_1.id;
    var abstractRule_1, utils_1, ruleWalker_1, Rule, Walker;
    return {
        setters: [function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }, function (utils_1_1) {
            utils_1 = utils_1_1;
        }, function (ruleWalker_1_1) {
            ruleWalker_1 = ruleWalker_1_1;
        }],
        execute: function () {
            Rule = function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    return this.applyWithWalker(new Walker(sourceFile, this.getOptions()));
                };
                Rule.metadata = {
                    ruleName: "prefer-method-signature",
                    description: "Prefer `foo(): void` over `foo: () => void` in interfaces and types.",
                    hasFix: true,
                    optionsDescription: "Not configurable.",
                    options: null,
                    optionExamples: ["true"],
                    type: "style",
                    typescriptOnly: false
                };
                Rule.FAILURE_STRING = "Use a method signature instead of a property signature of function type.";
                return Rule;
            }(abstractRule_1.AbstractRule);
            exports_1("Rule", Rule);
            Walker = function (_super) {
                __extends(Walker, _super);
                function Walker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Walker.prototype.visitPropertySignature = function (node) {
                    var type = node.type;
                    if (type !== undefined && type.kind === ts.SyntaxKind.FunctionType) {
                        this.addFailureAtNode(node.name, Rule.FAILURE_STRING, this.createMethodSignatureFix(node, type));
                    }
                    _super.prototype.visitPropertySignature.call(this, node);
                };
                Walker.prototype.createMethodSignatureFix = function (node, type) {
                    return type.type && this.createFix(this.deleteFromTo(utils_1.childOfKind(node, ts.SyntaxKind.ColonToken).getStart(), type.getStart()), this.deleteFromTo(utils_1.childOfKind(type, ts.SyntaxKind.EqualsGreaterThanToken).getStart(), type.type.getStart()), this.appendText(utils_1.childOfKind(type, ts.SyntaxKind.CloseParenToken).end, ":"));
                };
                return Walker;
            }(ruleWalker_1.RuleWalker);
        }
    };
});
System.register("src/mode/tslint/rules/radixRule.js", ["../language/rule/abstractRule", "../utils", "../language/walker/ruleWalker"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        } else {
            cooked.raw = raw;
        }
        return cooked;
    };
    var __moduleName = context_1 && context_1.id;
    var abstractRule_1, utils_1, ruleWalker_1, Rule, RadixWalker, templateObject_1;
    return {
        setters: [function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }, function (utils_1_1) {
            utils_1 = utils_1_1;
        }, function (ruleWalker_1_1) {
            ruleWalker_1 = ruleWalker_1_1;
        }],
        execute: function () {
            Rule = function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    var radixWalker = new RadixWalker(sourceFile, this.getOptions());
                    return this.applyWithWalker(radixWalker);
                };
                Rule.metadata = {
                    ruleName: "radix",
                    description: "Requires the radix parameter to be specified when calling `parseInt`.",
                    rationale: utils_1.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            From [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt):\n            > Always specify this parameter to eliminate reader confusion and to guarantee predictable behavior.\n            > Different implementations produce different results when a radix is not specified, usually defaulting the value to 10."], ["\n            From [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt):\n            > Always specify this parameter to eliminate reader confusion and to guarantee predictable behavior.\n            > Different implementations produce different results when a radix is not specified, usually defaulting the value to 10."]))),
                    optionsDescription: "Not configurable.",
                    options: null,
                    optionExamples: ["true"],
                    type: "functionality",
                    typescriptOnly: false
                };
                Rule.FAILURE_STRING = "Missing radix parameter";
                return Rule;
            }(abstractRule_1.AbstractRule);
            exports_1("Rule", Rule);
            RadixWalker = function (_super) {
                __extends(RadixWalker, _super);
                function RadixWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                RadixWalker.prototype.visitCallExpression = function (node) {
                    var expression = node.expression;
                    if (expression.kind === ts.SyntaxKind.Identifier && node.getFirstToken().getText() === "parseInt" && node.arguments.length < 2) {
                        this.addFailureAtNode(node, Rule.FAILURE_STRING);
                    }
                    _super.prototype.visitCallExpression.call(this, node);
                };
                return RadixWalker;
            }(ruleWalker_1.RuleWalker);
        }
    };
});
System.register("src/mode/tslint/rules/semicolonRule.js", ["../language/rule/abstractRule", "../language/utils", "../utils", "../language/walker/ruleWalker"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        } else {
            cooked.raw = raw;
        }
        return cooked;
    };
    var __moduleName = context_1 && context_1.id;
    var abstractRule_1, utils_1, utils_2, ruleWalker_1, OPTION_ALWAYS, OPTION_NEVER, OPTION_IGNORE_BOUND_CLASS_METHODS, OPTION_IGNORE_INTERFACES, Rule, SemicolonWalker, templateObject_1;
    return {
        setters: [function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }, function (utils_1_1) {
            utils_1 = utils_1_1;
        }, function (utils_2_1) {
            utils_2 = utils_2_1;
        }, function (ruleWalker_1_1) {
            ruleWalker_1 = ruleWalker_1_1;
        }],
        execute: function () {
            OPTION_ALWAYS = "always";
            OPTION_NEVER = "never";
            OPTION_IGNORE_BOUND_CLASS_METHODS = "ignore-bound-class-methods";
            OPTION_IGNORE_INTERFACES = "ignore-interfaces";
            Rule = function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    return this.applyWithWalker(new SemicolonWalker(sourceFile, this.getOptions()));
                };
                Rule.metadata = {
                    ruleName: "semicolon",
                    description: "Enforces consistent semicolon usage at the end of every statement.",
                    hasFix: true,
                    optionsDescription: utils_2.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            One of the following arguments must be provided:\n\n            * `\"", "\"` enforces semicolons at the end of every statement.\n            * `\"", "\"` disallows semicolons at the end of every statement except for when they are necessary.\n\n            The following arguments may be optionally provided:\n\n            * `\"", "\"` skips checking semicolons at the end of interface members.\n            * `\"", "\"` skips checking semicolons at the end of bound class methods."], ["\n            One of the following arguments must be provided:\n\n            * \\`\"", "\"\\` enforces semicolons at the end of every statement.\n            * \\`\"", "\"\\` disallows semicolons at the end of every statement except for when they are necessary.\n\n            The following arguments may be optionally provided:\n\n            * \\`\"", "\"\\` skips checking semicolons at the end of interface members.\n            * \\`\"", "\"\\` skips checking semicolons at the end of bound class methods."])), OPTION_ALWAYS, OPTION_NEVER, OPTION_IGNORE_INTERFACES, OPTION_IGNORE_BOUND_CLASS_METHODS),
                    options: {
                        type: "array",
                        items: [{
                            type: "string",
                            enum: [OPTION_ALWAYS, OPTION_NEVER]
                        }, {
                            type: "string",
                            enum: [OPTION_IGNORE_INTERFACES]
                        }],
                        additionalItems: false
                    },
                    optionExamples: ["[true, \"" + OPTION_ALWAYS + "\"]", "[true, \"" + OPTION_NEVER + "\"]", "[true, \"" + OPTION_ALWAYS + "\", \"" + OPTION_IGNORE_INTERFACES + "\"]", "[true, \"" + OPTION_ALWAYS + "\", \"" + OPTION_IGNORE_BOUND_CLASS_METHODS + "\"]"],
                    type: "style",
                    typescriptOnly: false
                };
                Rule.FAILURE_STRING_MISSING = "Missing semicolon";
                Rule.FAILURE_STRING_COMMA = "Interface properties should be separated by semicolons";
                Rule.FAILURE_STRING_UNNECESSARY = "Unnecessary semicolon";
                return Rule;
            }(abstractRule_1.AbstractRule);
            exports_1("Rule", Rule);
            SemicolonWalker = function (_super) {
                __extends(SemicolonWalker, _super);
                function SemicolonWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                SemicolonWalker.prototype.visitVariableStatement = function (node) {
                    this.checkSemicolonAt(node);
                    _super.prototype.visitVariableStatement.call(this, node);
                };
                SemicolonWalker.prototype.visitExpressionStatement = function (node) {
                    this.checkSemicolonAt(node);
                    _super.prototype.visitExpressionStatement.call(this, node);
                };
                SemicolonWalker.prototype.visitReturnStatement = function (node) {
                    this.checkSemicolonAt(node);
                    _super.prototype.visitReturnStatement.call(this, node);
                };
                SemicolonWalker.prototype.visitBreakStatement = function (node) {
                    this.checkSemicolonAt(node);
                    _super.prototype.visitBreakStatement.call(this, node);
                };
                SemicolonWalker.prototype.visitContinueStatement = function (node) {
                    this.checkSemicolonAt(node);
                    _super.prototype.visitContinueStatement.call(this, node);
                };
                SemicolonWalker.prototype.visitThrowStatement = function (node) {
                    this.checkSemicolonAt(node);
                    _super.prototype.visitThrowStatement.call(this, node);
                };
                SemicolonWalker.prototype.visitImportDeclaration = function (node) {
                    this.checkSemicolonAt(node);
                    _super.prototype.visitImportDeclaration.call(this, node);
                };
                SemicolonWalker.prototype.visitImportEqualsDeclaration = function (node) {
                    this.checkSemicolonAt(node);
                    _super.prototype.visitImportEqualsDeclaration.call(this, node);
                };
                SemicolonWalker.prototype.visitDoStatement = function (node) {
                    this.checkSemicolonAt(node);
                    _super.prototype.visitDoStatement.call(this, node);
                };
                SemicolonWalker.prototype.visitDebuggerStatement = function (node) {
                    this.checkSemicolonAt(node);
                    _super.prototype.visitDebuggerStatement.call(this, node);
                };
                SemicolonWalker.prototype.visitPropertyDeclaration = function (node) {
                    var initializer = node.initializer;
                    if (initializer && initializer.kind === ts.SyntaxKind.ArrowFunction && /\{[^]*\n/.test(node.getText())) {
                        if (!this.hasOption(OPTION_IGNORE_BOUND_CLASS_METHODS)) {
                            this.checkSemicolonAt(node, "never");
                        }
                    } else {
                        this.checkSemicolonAt(node);
                    }
                    _super.prototype.visitPropertyDeclaration.call(this, node);
                };
                SemicolonWalker.prototype.visitInterfaceDeclaration = function (node) {
                    if (this.hasOption(OPTION_IGNORE_INTERFACES)) {
                        return;
                    }
                    for (var _i = 0, _a = node.members; _i < _a.length; _i++) {
                        var member = _a[_i];
                        this.checkSemicolonAt(member);
                    }
                    _super.prototype.visitInterfaceDeclaration.call(this, node);
                };
                SemicolonWalker.prototype.visitExportAssignment = function (node) {
                    this.checkSemicolonAt(node);
                    _super.prototype.visitExportAssignment.call(this, node);
                };
                SemicolonWalker.prototype.visitFunctionDeclaration = function (node) {
                    if (!node.body) {
                        this.checkSemicolonAt(node);
                    }
                    _super.prototype.visitFunctionDeclaration.call(this, node);
                };
                SemicolonWalker.prototype.visitTypeAliasDeclaration = function (node) {
                    this.checkSemicolonAt(node);
                    _super.prototype.visitTypeAliasDeclaration.call(this, node);
                };
                SemicolonWalker.prototype.checkSemicolonAt = function (node, override) {
                    var sourceFile = this.getSourceFile();
                    var hasSemicolon = utils_1.childOfKind(node, ts.SyntaxKind.SemicolonToken) !== undefined;
                    var position = node.getStart(sourceFile) + node.getWidth(sourceFile);
                    var never = override === "never" || this.hasOption(OPTION_NEVER);
                    var always = !never && (this.hasOption(OPTION_ALWAYS) || this.getOptions() && this.getOptions().length === 0);
                    if (always && !hasSemicolon) {
                        var children = node.getChildren(sourceFile);
                        var lastChild = children[children.length - 1];
                        if (node.parent.kind === ts.SyntaxKind.InterfaceDeclaration && lastChild.kind === ts.SyntaxKind.CommaToken) {
                            var failureStart = lastChild.getStart(sourceFile);
                            var fix = this.createFix(this.createReplacement(failureStart, lastChild.getWidth(sourceFile), ";"));
                            this.addFailureAt(failureStart, 0, Rule.FAILURE_STRING_COMMA, fix);
                        } else {
                            var failureStart = Math.min(position, this.getLimit());
                            var fix = this.createFix(this.appendText(failureStart, ";"));
                            this.addFailureAt(failureStart, 0, Rule.FAILURE_STRING_MISSING, fix);
                        }
                    } else if (never && hasSemicolon) {
                        var scanner = ts.createScanner(ts.ScriptTarget.ES5, false, ts.LanguageVariant.Standard, sourceFile.text);
                        scanner.setTextPos(position);
                        var tokenKind = scanner.scan();
                        while (tokenKind === ts.SyntaxKind.WhitespaceTrivia || tokenKind === ts.SyntaxKind.NewLineTrivia) {
                            tokenKind = scanner.scan();
                        }
                        if (tokenKind !== ts.SyntaxKind.OpenParenToken && tokenKind !== ts.SyntaxKind.OpenBracketToken && tokenKind !== ts.SyntaxKind.PlusToken && tokenKind !== ts.SyntaxKind.MinusToken) {
                            var failureStart = Math.min(position - 1, this.getLimit());
                            var fix = this.createFix(this.deleteText(failureStart, 1));
                            this.addFailureAt(failureStart, 1, Rule.FAILURE_STRING_UNNECESSARY, fix);
                        }
                    }
                };
                return SemicolonWalker;
            }(ruleWalker_1.RuleWalker);
            exports_1("default", Rule);
        }
    };
});
System.register("src/mode/tslint/rules/trailingCommaRule.js", ["../language/rule/abstractRule", "../language/utils", "../utils", "../language/walker/ruleWalker"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        } else {
            cooked.raw = raw;
        }
        return cooked;
    };
    var __moduleName = context_1 && context_1.id;
    var abstractRule_1, utils_1, utils_2, ruleWalker_1, Rule, TrailingCommaWalker, templateObject_1, templateObject_2;
    return {
        setters: [function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }, function (utils_1_1) {
            utils_1 = utils_1_1;
        }, function (utils_2_1) {
            utils_2 = utils_2_1;
        }, function (ruleWalker_1_1) {
            ruleWalker_1 = ruleWalker_1_1;
        }],
        execute: function () {
            Rule = function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    return this.applyWithWalker(new TrailingCommaWalker(sourceFile, this.getOptions()));
                };
                Rule.metadata = {
                    ruleName: "trailing-comma",
                    description: utils_2.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            Requires or disallows trailing commas in array and object literals, destructuring assignments, function and tuple typings,\n            named imports and function parameters."], ["\n            Requires or disallows trailing commas in array and object literals, destructuring assignments, function and tuple typings,\n            named imports and function parameters."]))),
                    hasFix: true,
                    optionsDescription: utils_2.dedent(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n            One argument which is an object with the keys `multiline` and `singleline`.\n            Both should be set to either `\"always\"` or `\"never\"`.\n\n            * `\"multiline\"` checks multi-line object literals.\n            * `\"singleline\"` checks single-line object literals.\n\n            A array is considered \"multiline\" if its closing bracket is on a line\n            after the last array element. The same general logic is followed for\n            object literals, function and tuple typings, named import statements\n            and function parameters."], ["\n            One argument which is an object with the keys \\`multiline\\` and \\`singleline\\`.\n            Both should be set to either \\`\"always\"\\` or \\`\"never\"\\`.\n\n            * \\`\"multiline\"\\` checks multi-line object literals.\n            * \\`\"singleline\"\\` checks single-line object literals.\n\n            A array is considered \"multiline\" if its closing bracket is on a line\n            after the last array element. The same general logic is followed for\n            object literals, function and tuple typings, named import statements\n            and function parameters."]))),
                    options: {
                        type: "object",
                        properties: {
                            multiline: {
                                type: "string",
                                enum: ["always", "never"]
                            },
                            singleline: {
                                type: "string",
                                enum: ["always", "never"]
                            }
                        },
                        additionalProperties: false
                    },
                    optionExamples: ['[true, {"multiline": "always", "singleline": "never"}]'],
                    type: "maintainability",
                    typescriptOnly: false
                };
                Rule.FAILURE_STRING_NEVER = "Unnecessary trailing comma";
                Rule.FAILURE_STRING_ALWAYS = "Missing trailing comma";
                return Rule;
            }(abstractRule_1.AbstractRule);
            exports_1("Rule", Rule);
            TrailingCommaWalker = function (_super) {
                __extends(TrailingCommaWalker, _super);
                function TrailingCommaWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                TrailingCommaWalker.prototype.visitArrayLiteralExpression = function (node) {
                    this.lintChildNodeWithIndex(node, 1);
                    _super.prototype.visitArrayLiteralExpression.call(this, node);
                };
                TrailingCommaWalker.prototype.visitArrowFunction = function (node) {
                    this.lintChildNodeWithIndex(node, 1);
                    _super.prototype.visitArrowFunction.call(this, node);
                };
                TrailingCommaWalker.prototype.visitBindingPattern = function (node) {
                    if (node.kind === ts.SyntaxKind.ArrayBindingPattern || node.kind === ts.SyntaxKind.ObjectBindingPattern) {
                        this.lintChildNodeWithIndex(node, 1);
                    }
                    _super.prototype.visitBindingPattern.call(this, node);
                };
                TrailingCommaWalker.prototype.visitCallExpression = function (node) {
                    this.lintNode(node);
                    _super.prototype.visitCallExpression.call(this, node);
                };
                TrailingCommaWalker.prototype.visitClassDeclaration = function (node) {
                    this.lintNode(node);
                    _super.prototype.visitClassDeclaration.call(this, node);
                };
                TrailingCommaWalker.prototype.visitConstructSignature = function (node) {
                    this.lintNode(node);
                    _super.prototype.visitConstructSignature.call(this, node);
                };
                TrailingCommaWalker.prototype.visitConstructorDeclaration = function (node) {
                    this.lintNode(node);
                    _super.prototype.visitConstructorDeclaration.call(this, node);
                };
                TrailingCommaWalker.prototype.visitConstructorType = function (node) {
                    this.lintNode(node);
                    _super.prototype.visitConstructorType.call(this, node);
                };
                TrailingCommaWalker.prototype.visitEnumDeclaration = function (node) {
                    this.lintNode(node, true);
                    _super.prototype.visitEnumDeclaration.call(this, node);
                };
                TrailingCommaWalker.prototype.visitFunctionType = function (node) {
                    this.lintChildNodeWithIndex(node, 1);
                    _super.prototype.visitFunctionType.call(this, node);
                };
                TrailingCommaWalker.prototype.visitFunctionDeclaration = function (node) {
                    this.lintNode(node);
                    _super.prototype.visitFunctionDeclaration.call(this, node);
                };
                TrailingCommaWalker.prototype.visitFunctionExpression = function (node) {
                    this.lintNode(node);
                    _super.prototype.visitFunctionExpression.call(this, node);
                };
                TrailingCommaWalker.prototype.visitInterfaceDeclaration = function (node) {
                    this.lintNode(node);
                    _super.prototype.visitInterfaceDeclaration.call(this, node);
                };
                TrailingCommaWalker.prototype.visitMethodDeclaration = function (node) {
                    this.lintNode(node);
                    _super.prototype.visitMethodDeclaration.call(this, node);
                };
                TrailingCommaWalker.prototype.visitMethodSignature = function (node) {
                    this.lintNode(node);
                    _super.prototype.visitMethodSignature.call(this, node);
                };
                TrailingCommaWalker.prototype.visitNamedImports = function (node) {
                    this.lintChildNodeWithIndex(node, 1);
                    _super.prototype.visitNamedImports.call(this, node);
                };
                TrailingCommaWalker.prototype.visitNewExpression = function (node) {
                    this.lintNode(node);
                    _super.prototype.visitNewExpression.call(this, node);
                };
                TrailingCommaWalker.prototype.visitObjectLiteralExpression = function (node) {
                    this.lintChildNodeWithIndex(node, 1);
                    _super.prototype.visitObjectLiteralExpression.call(this, node);
                };
                TrailingCommaWalker.prototype.visitSetAccessor = function (node) {
                    this.lintNode(node);
                    _super.prototype.visitSetAccessor.call(this, node);
                };
                TrailingCommaWalker.prototype.visitTupleType = function (node) {
                    this.lintChildNodeWithIndex(node, 1);
                    _super.prototype.visitTupleType.call(this, node);
                };
                TrailingCommaWalker.prototype.visitTypeLiteral = function (node) {
                    this.lintNode(node);
                    var children = node.getChildren();
                    for (var i = 0; i < children.length - 2; i++) {
                        if (children[i].kind === ts.SyntaxKind.OpenBraceToken && children[i + 1].kind === ts.SyntaxKind.SyntaxList && children[i + 2].kind === ts.SyntaxKind.CloseBraceToken) {
                            var grandChildren = children[i + 1].getChildren();
                            var hasSemicolon = grandChildren.some(function (grandChild) {
                                return utils_1.childOfKind(grandChild, ts.SyntaxKind.SemicolonToken) !== undefined;
                            });
                            if (!hasSemicolon) {
                                var endLineOfClosingElement = this.getSourceFile().getLineAndCharacterOfPosition(children[i + 2].getEnd()).line;
                                this.lintChildNodeWithIndex(children[i + 1], grandChildren.length - 1, endLineOfClosingElement);
                            }
                        }
                    }
                    _super.prototype.visitTypeLiteral.call(this, node);
                };
                TrailingCommaWalker.prototype.visitTypeReference = function (node) {
                    this.lintNode(node);
                    _super.prototype.visitTypeReference.call(this, node);
                };
                TrailingCommaWalker.prototype.lintNode = function (node, includeBraces) {
                    var _this = this;
                    var children = node.getChildren();
                    var syntaxListWrapperTokens = includeBraces === true ? TrailingCommaWalker.SYNTAX_LIST_WRAPPER_TOKENS : TrailingCommaWalker.SYNTAX_LIST_WRAPPER_TOKENS.slice(1);
                    var _loop_1 = function (i) {
                        syntaxListWrapperTokens.forEach(function (_a) {
                            var openToken = _a[0],
                                closeToken = _a[1];
                            if (children[i].kind === openToken && children[i + 1].kind === ts.SyntaxKind.SyntaxList && children[i + 2].kind === closeToken) {
                                _this.lintChildNodeWithIndex(node, i + 1);
                            }
                        });
                    };
                    for (var i = 0; i < children.length - 2; i++) {
                        _loop_1(i);
                    }
                };
                TrailingCommaWalker.prototype.lintChildNodeWithIndex = function (node, childNodeIndex, endLineOfClosingElement) {
                    var child = node.getChildAt(childNodeIndex);
                    if (child != null) {
                        var grandChildren = child.getChildren();
                        if (grandChildren.length > 0) {
                            var lastGrandChild = grandChildren[grandChildren.length - 1];
                            var hasTrailingComma = lastGrandChild.kind === ts.SyntaxKind.CommaToken;
                            var endLineOfLastElement = this.getSourceFile().getLineAndCharacterOfPosition(lastGrandChild.getEnd()).line;
                            if (endLineOfClosingElement === undefined) {
                                var closingElementNode = node.getChildAt(childNodeIndex + 1);
                                if (closingElementNode == null) {
                                    closingElementNode = node;
                                }
                                endLineOfClosingElement = this.getSourceFile().getLineAndCharacterOfPosition(closingElementNode.getEnd()).line;
                            }
                            var isMultiline = endLineOfClosingElement !== endLineOfLastElement;
                            var option = this.getOption(isMultiline ? "multiline" : "singleline");
                            if (hasTrailingComma && option === "never") {
                                var failureStart = lastGrandChild.getStart();
                                var fix = this.createFix(this.deleteText(failureStart, 1));
                                this.addFailureAt(failureStart, 1, Rule.FAILURE_STRING_NEVER, fix);
                            } else if (!hasTrailingComma && option === "always") {
                                var failureStart = lastGrandChild.getEnd();
                                var fix = this.createFix(this.appendText(failureStart, ","));
                                this.addFailureAt(failureStart - 1, 1, Rule.FAILURE_STRING_ALWAYS, fix);
                            }
                        }
                    }
                };
                TrailingCommaWalker.prototype.getOption = function (option) {
                    var allOptions = this.getOptions();
                    if (allOptions == null || allOptions.length === 0) {
                        return null;
                    }
                    return allOptions[0][option];
                };
                TrailingCommaWalker.SYNTAX_LIST_WRAPPER_TOKENS = [[ts.SyntaxKind.OpenBraceToken, ts.SyntaxKind.CloseBraceToken], [ts.SyntaxKind.OpenBracketToken, ts.SyntaxKind.CloseBracketToken], [ts.SyntaxKind.OpenParenToken, ts.SyntaxKind.CloseParenToken]];
                return TrailingCommaWalker;
            }(ruleWalker_1.RuleWalker);
        }
    };
});
System.register("src/mode/tslint/rules/tripleEqualsRule.js", ["../language/rule/abstractRule", "../language/utils", "../utils", "../language/walker/ruleWalker"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        } else {
            cooked.raw = raw;
        }
        return cooked;
    };
    var __moduleName = context_1 && context_1.id;
    var abstractRule_1, utils_1, utils_2, ruleWalker_1, OPTION_ALLOW_NULL_CHECK, OPTION_ALLOW_UNDEFINED_CHECK, Rule, ComparisonWalker, templateObject_1;
    return {
        setters: [function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }, function (utils_1_1) {
            utils_1 = utils_1_1;
        }, function (utils_2_1) {
            utils_2 = utils_2_1;
        }, function (ruleWalker_1_1) {
            ruleWalker_1 = ruleWalker_1_1;
        }],
        execute: function () {
            OPTION_ALLOW_NULL_CHECK = "allow-null-check";
            OPTION_ALLOW_UNDEFINED_CHECK = "allow-undefined-check";
            Rule = function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    var comparisonWalker = new ComparisonWalker(sourceFile, this.getOptions());
                    return this.applyWithWalker(comparisonWalker);
                };
                Rule.metadata = {
                    ruleName: "triple-equals",
                    description: "Requires `===` and `!==` in place of `==` and `!=`.",
                    optionsDescription: utils_2.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            Two arguments may be optionally provided:\n\n            * `\"allow-null-check\"` allows `==` and `!=` when comparing to `null`.\n            * `\"allow-undefined-check\"` allows `==` and `!=` when comparing to `undefined`."], ["\n            Two arguments may be optionally provided:\n\n            * \\`\"allow-null-check\"\\` allows \\`==\\` and \\`!=\\` when comparing to \\`null\\`.\n            * \\`\"allow-undefined-check\"\\` allows \\`==\\` and \\`!=\\` when comparing to \\`undefined\\`."]))),
                    options: {
                        type: "array",
                        items: {
                            type: "string",
                            enum: [OPTION_ALLOW_NULL_CHECK, OPTION_ALLOW_UNDEFINED_CHECK]
                        },
                        minLength: 0,
                        maxLength: 2
                    },
                    optionExamples: ["true", '[true, "allow-null-check"]', '[true, "allow-undefined-check"]'],
                    type: "functionality",
                    typescriptOnly: false
                };
                Rule.EQ_FAILURE_STRING = "== should be ===";
                Rule.NEQ_FAILURE_STRING = "!= should be !==";
                return Rule;
            }(abstractRule_1.AbstractRule);
            exports_1("Rule", Rule);
            ComparisonWalker = function (_super) {
                __extends(ComparisonWalker, _super);
                function ComparisonWalker() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.allowNull = _this.hasOption(OPTION_ALLOW_NULL_CHECK);
                    _this.allowUndefined = _this.hasOption(OPTION_ALLOW_UNDEFINED_CHECK);
                    return _this;
                }
                ComparisonWalker.prototype.visitBinaryExpression = function (node) {
                    var eq = utils_1.getEqualsKind(node.operatorToken);
                    if (eq && !eq.isStrict && !this.isExpressionAllowed(node)) {
                        this.addFailureAtNode(node.operatorToken, eq.isPositive ? Rule.EQ_FAILURE_STRING : Rule.NEQ_FAILURE_STRING);
                    }
                    _super.prototype.visitBinaryExpression.call(this, node);
                };
                ComparisonWalker.prototype.isExpressionAllowed = function (_a) {
                    var _this = this;
                    var left = _a.left,
                        right = _a.right;
                    var isAllowed = function (n) {
                        return n.kind === ts.SyntaxKind.NullKeyword ? _this.allowNull : _this.allowUndefined && n.kind === ts.SyntaxKind.Identifier && n.originalKeywordKind === ts.SyntaxKind.UndefinedKeyword;
                    };
                    return isAllowed(left) || isAllowed(right);
                };
                return ComparisonWalker;
            }(ruleWalker_1.RuleWalker);
        }
    };
});
System.register("src/mode/tslint/language/utils.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function createCompilerOptions() {
        return {
            allowJs: true,
            noResolve: true,
            target: ts.ScriptTarget.ES5
        };
    }
    exports_1("createCompilerOptions", createCompilerOptions);
    function doesIntersect(failure, disabledIntervals) {
        return disabledIntervals.some(function (interval) {
            var maxStart = Math.max(interval.startPosition, failure.getStartPosition().getPosition());
            var minEnd = Math.min(interval.endPosition, failure.getEndPosition().getPosition());
            return maxStart <= minEnd;
        });
    }
    exports_1("doesIntersect", doesIntersect);
    function scanAllTokens(scanner, callback) {
        var lastStartPos = -1;
        while (scanner.scan() !== ts.SyntaxKind.EndOfFileToken) {
            var startPos = scanner.getStartPos();
            if (startPos === lastStartPos) {
                break;
            }
            lastStartPos = startPos;
            callback(scanner);
        }
    }
    exports_1("scanAllTokens", scanAllTokens);
    function hasModifier(modifiers) {
        var modifierKinds = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            modifierKinds[_i - 1] = arguments[_i];
        }
        if (modifiers === undefined || modifierKinds.length === 0) {
            return false;
        }
        return modifiers.some(function (m) {
            return modifierKinds.some(function (k) {
                return m.kind === k;
            });
        });
    }
    exports_1("hasModifier", hasModifier);
    function isBlockScopedVariable(node) {
        var parentNode = node.kind === ts.SyntaxKind.VariableDeclaration ? node.parent : node.declarationList;
        return isNodeFlagSet(parentNode, ts.NodeFlags.Let) || isNodeFlagSet(parentNode, ts.NodeFlags.Const);
    }
    exports_1("isBlockScopedVariable", isBlockScopedVariable);
    function isBlockScopedBindingElement(node) {
        var variableDeclaration = getBindingElementVariableDeclaration(node);
        return variableDeclaration == null || isBlockScopedVariable(variableDeclaration);
    }
    exports_1("isBlockScopedBindingElement", isBlockScopedBindingElement);
    function getBindingElementVariableDeclaration(node) {
        var currentParent = node.parent;
        while (currentParent.kind !== ts.SyntaxKind.VariableDeclaration) {
            if (currentParent.parent == null) {
                return null;
            } else {
                currentParent = currentParent.parent;
            }
        }
        return currentParent;
    }
    exports_1("getBindingElementVariableDeclaration", getBindingElementVariableDeclaration);
    function childOfKind(node, kind) {
        return node.getChildren().find(function (child) {
            return child.kind === kind;
        });
    }
    exports_1("childOfKind", childOfKind);
    function someAncestor(node, predicate) {
        return predicate(node) || node.parent != null && someAncestor(node.parent, predicate);
    }
    exports_1("someAncestor", someAncestor);
    function isAssignment(node) {
        if (node.kind === ts.SyntaxKind.BinaryExpression) {
            var binaryExpression = node;
            return binaryExpression.operatorToken.kind >= ts.SyntaxKind.FirstAssignment && binaryExpression.operatorToken.kind <= ts.SyntaxKind.LastAssignment;
        } else {
            return false;
        }
    }
    exports_1("isAssignment", isAssignment);
    function isNodeFlagSet(node, flagToCheck) {
        return (node.flags & flagToCheck) !== 0;
    }
    exports_1("isNodeFlagSet", isNodeFlagSet);
    function isCombinedNodeFlagSet(node, flagToCheck) {
        return (ts.getCombinedNodeFlags(node) & flagToCheck) !== 0;
    }
    exports_1("isCombinedNodeFlagSet", isCombinedNodeFlagSet);
    function isCombinedModifierFlagSet(node, flagToCheck) {
        return (ts.getCombinedModifierFlags(node) & flagToCheck) !== 0;
    }
    exports_1("isCombinedModifierFlagSet", isCombinedModifierFlagSet);
    function isTypeFlagSet(type, flagToCheck) {
        return (type.flags & flagToCheck) !== 0;
    }
    exports_1("isTypeFlagSet", isTypeFlagSet);
    function isSymbolFlagSet(symbol, flagToCheck) {
        return (symbol.flags & flagToCheck) !== 0;
    }
    exports_1("isSymbolFlagSet", isSymbolFlagSet);
    function isObjectFlagSet(objectType, flagToCheck) {
        return (objectType.objectFlags & flagToCheck) !== 0;
    }
    exports_1("isObjectFlagSet", isObjectFlagSet);
    function isNestedModuleDeclaration(decl) {
        return decl.name.pos === decl.pos;
    }
    exports_1("isNestedModuleDeclaration", isNestedModuleDeclaration);
    function unwrapParentheses(node) {
        while (node.kind === ts.SyntaxKind.ParenthesizedExpression) {
            node = node.expression;
        }
        return node;
    }
    exports_1("unwrapParentheses", unwrapParentheses);
    function isScopeBoundary(node) {
        return node.kind === ts.SyntaxKind.FunctionDeclaration || node.kind === ts.SyntaxKind.FunctionExpression || node.kind === ts.SyntaxKind.PropertyAssignment || node.kind === ts.SyntaxKind.ShorthandPropertyAssignment || node.kind === ts.SyntaxKind.MethodDeclaration || node.kind === ts.SyntaxKind.Constructor || node.kind === ts.SyntaxKind.ModuleDeclaration || node.kind === ts.SyntaxKind.ArrowFunction || node.kind === ts.SyntaxKind.ParenthesizedExpression || node.kind === ts.SyntaxKind.ClassDeclaration || node.kind === ts.SyntaxKind.ClassExpression || node.kind === ts.SyntaxKind.InterfaceDeclaration || node.kind === ts.SyntaxKind.GetAccessor || node.kind === ts.SyntaxKind.SetAccessor || node.kind === ts.SyntaxKind.SourceFile && ts.isExternalModule(node);
    }
    exports_1("isScopeBoundary", isScopeBoundary);
    function isBlockScopeBoundary(node) {
        return isScopeBoundary(node) || node.kind === ts.SyntaxKind.Block || isLoop(node) || node.kind === ts.SyntaxKind.WithStatement || node.kind === ts.SyntaxKind.SwitchStatement || node.parent !== undefined && (node.parent.kind === ts.SyntaxKind.TryStatement || node.parent.kind === ts.SyntaxKind.IfStatement);
    }
    exports_1("isBlockScopeBoundary", isBlockScopeBoundary);
    function isLoop(node) {
        return node.kind === ts.SyntaxKind.DoStatement || node.kind === ts.SyntaxKind.WhileStatement || node.kind === ts.SyntaxKind.ForStatement || node.kind === ts.SyntaxKind.ForInStatement || node.kind === ts.SyntaxKind.ForOfStatement;
    }
    exports_1("isLoop", isLoop);
    function forEachToken(node, skipTrivia, cb, filter) {
        var sourceFile = node.getSourceFile();
        var fullText = sourceFile.text;
        var iterateFn = filter === undefined ? iterateChildren : iterateWithFilter;
        var handleTrivia = skipTrivia ? undefined : createTriviaHandler(sourceFile, cb);
        iterateFn(node);
        function iterateWithFilter(child) {
            if (filter(child)) {
                return iterateChildren(child);
            }
        }
        function iterateChildren(child) {
            if (child.kind < ts.SyntaxKind.FirstNode || child.kind === ts.SyntaxKind.JsxText) {
                return callback(child);
            }
            if (child.kind !== ts.SyntaxKind.JSDocComment) {
                return child.getChildren(sourceFile).forEach(iterateFn);
            }
        }
        function callback(token) {
            var tokenStart = token.getStart(sourceFile);
            if (!skipTrivia && tokenStart !== token.pos) {
                handleTrivia(token.pos, tokenStart, token);
            }
            return cb(fullText, token.kind, { tokenStart: tokenStart, fullStart: token.pos, end: token.end }, token.parent);
        }
    }
    exports_1("forEachToken", forEachToken);
    function createTriviaHandler(sourceFile, cb) {
        var fullText = sourceFile.text;
        var scanner = ts.createScanner(sourceFile.languageVersion, false, sourceFile.languageVariant, fullText);
        function handleTrivia(start, end, token) {
            var parent = token.parent;
            if (!canHaveLeadingTrivia(token.kind, parent)) {
                return;
            }
            scanner.setTextPos(start);
            var position;
            do {
                var kind = scanner.scan();
                position = scanner.getTextPos();
                cb(fullText, kind, { tokenStart: scanner.getTokenPos(), end: position, fullStart: start }, parent);
            } while (position < end);
        }
        return handleTrivia;
    }
    function forEachComment(node, cb) {
        return forEachToken(node, true, function (fullText, tokenKind, pos, parent) {
            if (canHaveLeadingTrivia(tokenKind, parent)) {
                var comments = ts.getLeadingCommentRanges(fullText, pos.fullStart);
                if (comments !== undefined) {
                    for (var _i = 0, comments_1 = comments; _i < comments_1.length; _i++) {
                        var comment = comments_1[_i];
                        cb(fullText, comment.kind, { fullStart: pos.fullStart, tokenStart: comment.pos, end: comment.end });
                    }
                }
            }
            if (canHaveTrailingTrivia(tokenKind, parent)) {
                var comments = ts.getTrailingCommentRanges(fullText, pos.end);
                if (comments !== undefined) {
                    for (var _a = 0, comments_2 = comments; _a < comments_2.length; _a++) {
                        var comment = comments_2[_a];
                        cb(fullText, comment.kind, { fullStart: pos.fullStart, tokenStart: comment.pos, end: comment.end });
                    }
                }
            }
        });
    }
    exports_1("forEachComment", forEachComment);
    function canHaveLeadingTrivia(tokenKind, parent) {
        if (tokenKind === ts.SyntaxKind.JsxText) {
            return false;
        }
        if (tokenKind === ts.SyntaxKind.OpenBraceToken) {
            return parent.kind !== ts.SyntaxKind.JsxExpression || parent.parent.kind !== ts.SyntaxKind.JsxElement;
        }
        if (tokenKind === ts.SyntaxKind.LessThanToken) {
            if (parent.kind === ts.SyntaxKind.JsxClosingElement) {
                return false;
            }
            if (parent.kind === ts.SyntaxKind.JsxOpeningElement || parent.kind === ts.SyntaxKind.JsxSelfClosingElement) {
                return parent.parent.parent.kind !== ts.SyntaxKind.JsxElement;
            }
        }
        return true;
    }
    function canHaveTrailingTrivia(tokenKind, parent) {
        if (tokenKind === ts.SyntaxKind.JsxText) {
            return false;
        }
        if (tokenKind === ts.SyntaxKind.CloseBraceToken) {
            return parent.kind !== ts.SyntaxKind.JsxExpression || parent.parent.kind !== ts.SyntaxKind.JsxElement;
        }
        if (tokenKind === ts.SyntaxKind.GreaterThanToken) {
            if (parent.kind === ts.SyntaxKind.JsxOpeningElement) {
                return false;
            }
            if (parent.kind === ts.SyntaxKind.JsxClosingElement || parent.kind === ts.SyntaxKind.JsxSelfClosingElement) {
                return parent.parent.parent.kind !== ts.SyntaxKind.JsxElement;
            }
        }
        return true;
    }
    function hasCommentAfterPosition(text, position) {
        return ts.getTrailingCommentRanges(text, position) !== undefined || ts.getLeadingCommentRanges(text, position) !== undefined;
    }
    exports_1("hasCommentAfterPosition", hasCommentAfterPosition);
    function getEqualsKind(node) {
        switch (node.kind) {
            case ts.SyntaxKind.EqualsEqualsToken:
                return { isPositive: true, isStrict: false };
            case ts.SyntaxKind.EqualsEqualsEqualsToken:
                return { isPositive: true, isStrict: true };
            case ts.SyntaxKind.ExclamationEqualsToken:
                return { isPositive: false, isStrict: false };
            case ts.SyntaxKind.ExclamationEqualsEqualsToken:
                return { isPositive: false, isStrict: true };
            default:
                return undefined;
        }
    }
    exports_1("getEqualsKind", getEqualsKind);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("src/mode/tslint/language/walker/walkContext.js", ["../rule/rule"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var rule_1, WalkContext;
    return {
        setters: [function (rule_1_1) {
            rule_1 = rule_1_1;
        }],
        execute: function () {
            WalkContext = function () {
                function WalkContext(sourceFile, ruleName, options) {
                    this.sourceFile = sourceFile;
                    this.ruleName = ruleName;
                    this.options = options;
                    this.failures = [];
                }
                WalkContext.prototype.addFailureAt = function (start, width, failure, fix) {
                    this.addFailure(start, start + width, failure, fix);
                };
                WalkContext.prototype.addFailure = function (start, end, failure, fix) {
                    var fileLength = this.sourceFile.end;
                    this.failures.push(new rule_1.RuleFailure(this.sourceFile, Math.min(start, fileLength), Math.min(end, fileLength), failure, this.ruleName, fix));
                };
                WalkContext.prototype.addFailureAtNode = function (node, failure, fix) {
                    this.addFailure(node.getStart(this.sourceFile), node.getEnd(), failure, fix);
                };
                WalkContext.prototype.createFix = function () {
                    var replacements = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        replacements[_i] = arguments[_i];
                    }
                    return new rule_1.Fix(this.ruleName, replacements);
                };
                return WalkContext;
            }();
            exports_1("WalkContext", WalkContext);
        }
    };
});
System.register("src/mode/tslint/language/rule/abstractRule.js", ["../utils", "../walker/walkContext"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var utils_1, walkContext_1, AbstractRule;
    return {
        setters: [function (utils_1_1) {
            utils_1 = utils_1_1;
        }, function (walkContext_1_1) {
            walkContext_1 = walkContext_1_1;
        }],
        execute: function () {
            AbstractRule = function () {
                function AbstractRule(ruleName, value, disabledIntervals) {
                    this.ruleName = ruleName;
                    this.value = value;
                    this.disabledIntervals = disabledIntervals;
                    if (Array.isArray(value) && value.length > 1) {
                        this.ruleArguments = value.slice(1);
                    } else {
                        this.ruleArguments = [];
                    }
                }
                AbstractRule.isRuleEnabled = function (ruleConfigValue) {
                    if (typeof ruleConfigValue === "boolean") {
                        return ruleConfigValue;
                    }
                    if (Array.isArray(ruleConfigValue) && ruleConfigValue.length > 0) {
                        var enabled = ruleConfigValue[0];
                        if (typeof enabled === 'boolean') {
                            return enabled;
                        } else {
                            throw new Error("ruleConfigValue[0] must be a boolean");
                        }
                    }
                    return false;
                };
                AbstractRule.prototype.getOptions = function () {
                    return {
                        disabledIntervals: this.disabledIntervals,
                        ruleArguments: this.ruleArguments,
                        ruleName: this.ruleName
                    };
                };
                AbstractRule.prototype.applyWithWalker = function (walker) {
                    walker.walk(walker.getSourceFile());
                    return this.filterFailures(walker.getFailures());
                };
                AbstractRule.prototype.isEnabled = function () {
                    return AbstractRule.isRuleEnabled(this.value);
                };
                AbstractRule.prototype.applyWithFunction = function (sourceFile, walkFn, options) {
                    var ctx = new walkContext_1.WalkContext(sourceFile, this.ruleName, options);
                    walkFn(ctx);
                    return this.filterFailures(ctx.failures);
                };
                AbstractRule.prototype.filterFailures = function (failures) {
                    var result = [];
                    var _loop_1 = function (failure) {
                        if (!utils_1.doesIntersect(failure, this_1.disabledIntervals) && !result.some(function (f) {
                            return f.equals(failure);
                        })) {
                            result.push(failure);
                        }
                    };
                    var this_1 = this;
                    for (var _i = 0, failures_1 = failures; _i < failures_1.length; _i++) {
                        var failure = failures_1[_i];
                        _loop_1(failure);
                    }
                    return result;
                };
                return AbstractRule;
            }();
            exports_1("AbstractRule", AbstractRule);
        }
    };
});
System.register("src/mode/tslint/language/rule/rule.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var Replacement, Fix, RuleFailurePosition, RuleFailure;
    return {
        setters: [],
        execute: function () {
            Replacement = function () {
                function Replacement(innerStart, innerLength, innerText) {
                    this.innerStart = innerStart;
                    this.innerLength = innerLength;
                    this.innerText = innerText;
                }
                Replacement.applyAll = function (content, replacements) {
                    replacements.sort(function (a, b) {
                        return b.end - a.end;
                    });
                    return replacements.reduce(function (text, r) {
                        return r.apply(text);
                    }, content);
                };
                Replacement.replaceFromTo = function (start, end, text) {
                    return new Replacement(start, end - start, text);
                };
                Replacement.deleteText = function (start, length) {
                    return new Replacement(start, length, "");
                };
                Replacement.deleteFromTo = function (start, end) {
                    return new Replacement(start, end - start, "");
                };
                Replacement.appendText = function (start, text) {
                    return new Replacement(start, 0, text);
                };
                Object.defineProperty(Replacement.prototype, "start", {
                    get: function () {
                        return this.innerStart;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Replacement.prototype, "length", {
                    get: function () {
                        return this.innerLength;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Replacement.prototype, "end", {
                    get: function () {
                        return this.innerStart + this.innerLength;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Replacement.prototype, "text", {
                    get: function () {
                        return this.innerText;
                    },
                    enumerable: true,
                    configurable: true
                });
                Replacement.prototype.apply = function (content) {
                    return content.substring(0, this.start) + this.text + content.substring(this.start + this.length);
                };
                return Replacement;
            }();
            exports_1("Replacement", Replacement);
            Fix = function () {
                function Fix(innerRuleName, innerReplacements) {
                    this.innerRuleName = innerRuleName;
                    this.innerReplacements = innerReplacements;
                }
                Fix.applyAll = function (content, fixes) {
                    var replacements = [];
                    for (var _i = 0, fixes_1 = fixes; _i < fixes_1.length; _i++) {
                        var fix = fixes_1[_i];
                        replacements = replacements.concat(fix.replacements);
                    }
                    return Replacement.applyAll(content, replacements);
                };
                Object.defineProperty(Fix.prototype, "ruleName", {
                    get: function () {
                        return this.innerRuleName;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Fix.prototype, "replacements", {
                    get: function () {
                        return this.innerReplacements;
                    },
                    enumerable: true,
                    configurable: true
                });
                Fix.prototype.apply = function (content) {
                    return Replacement.applyAll(content, this.innerReplacements);
                };
                return Fix;
            }();
            exports_1("Fix", Fix);
            RuleFailurePosition = function () {
                function RuleFailurePosition(position, lineAndCharacter) {
                    this.position = position;
                    this.lineAndCharacter = lineAndCharacter;
                }
                RuleFailurePosition.prototype.getPosition = function () {
                    return this.position;
                };
                RuleFailurePosition.prototype.getLineAndCharacter = function () {
                    return this.lineAndCharacter;
                };
                RuleFailurePosition.prototype.toJson = function () {
                    return {
                        character: this.lineAndCharacter.character,
                        line: this.lineAndCharacter.line,
                        position: this.position
                    };
                };
                RuleFailurePosition.prototype.equals = function (ruleFailurePosition) {
                    var ll = this.lineAndCharacter;
                    var rr = ruleFailurePosition.lineAndCharacter;
                    return this.position === ruleFailurePosition.position && ll.line === rr.line && ll.character === rr.character;
                };
                return RuleFailurePosition;
            }();
            exports_1("RuleFailurePosition", RuleFailurePosition);
            RuleFailure = function () {
                function RuleFailure(sourceFile, start, end, failure, ruleName, fix) {
                    this.sourceFile = sourceFile;
                    this.failure = failure;
                    this.ruleName = ruleName;
                    this.fix = fix;
                    this.fileName = sourceFile.fileName;
                    this.startPosition = this.createFailurePosition(start);
                    this.endPosition = this.createFailurePosition(end);
                    this.rawLines = sourceFile.text;
                }
                RuleFailure.prototype.getFileName = function () {
                    return this.fileName;
                };
                RuleFailure.prototype.getRuleName = function () {
                    return this.ruleName;
                };
                RuleFailure.prototype.getStartPosition = function () {
                    return this.startPosition;
                };
                RuleFailure.prototype.getEndPosition = function () {
                    return this.endPosition;
                };
                RuleFailure.prototype.getFailure = function () {
                    return this.failure;
                };
                RuleFailure.prototype.hasFix = function () {
                    return this.fix !== undefined;
                };
                RuleFailure.prototype.getFix = function () {
                    return this.fix;
                };
                RuleFailure.prototype.getRawLines = function () {
                    return this.rawLines;
                };
                RuleFailure.prototype.toJson = function () {
                    return {
                        endPosition: this.endPosition.toJson(),
                        failure: this.failure,
                        fix: this.fix,
                        name: this.fileName,
                        ruleName: this.ruleName,
                        startPosition: this.startPosition.toJson()
                    };
                };
                RuleFailure.prototype.equals = function (ruleFailure) {
                    return this.failure === ruleFailure.getFailure() && this.fileName === ruleFailure.getFileName() && this.startPosition.equals(ruleFailure.getStartPosition()) && this.endPosition.equals(ruleFailure.getEndPosition());
                };
                RuleFailure.prototype.createFailurePosition = function (position) {
                    var lineAndCharacter = this.sourceFile.getLineAndCharacterOfPosition(position);
                    return new RuleFailurePosition(position, lineAndCharacter);
                };
                return RuleFailure;
            }();
            exports_1("RuleFailure", RuleFailure);
        }
    };
});
System.register("src/mode/tslint/language/walker/syntaxWalker.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var SyntaxWalker;
    return {
        setters: [],
        execute: function () {
            SyntaxWalker = function () {
                function SyntaxWalker() {}
                SyntaxWalker.prototype.walk = function (node) {
                    this.visitNode(node);
                };
                SyntaxWalker.prototype.visitAnyKeyword = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitArrayLiteralExpression = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitArrayType = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitArrowFunction = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitBinaryExpression = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitBindingElement = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitBindingPattern = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitBlock = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitBreakStatement = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitCallExpression = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitCallSignature = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitCaseClause = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitClassDeclaration = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitClassExpression = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitCatchClause = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitConditionalExpression = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitConstructSignature = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitConstructorDeclaration = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitConstructorType = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitContinueStatement = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitDebuggerStatement = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitDefaultClause = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitDoStatement = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitElementAccessExpression = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitEndOfFileToken = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitEnumDeclaration = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitExportAssignment = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitExpressionStatement = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitForStatement = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitForInStatement = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitForOfStatement = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitFunctionDeclaration = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitFunctionExpression = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitFunctionType = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitGetAccessor = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitIdentifier = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitIfStatement = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitImportDeclaration = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitImportEqualsDeclaration = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitIndexSignatureDeclaration = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitInterfaceDeclaration = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitJsxAttribute = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitJsxElement = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitJsxExpression = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitJsxSelfClosingElement = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitJsxSpreadAttribute = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitLabeledStatement = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitMethodDeclaration = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitMethodSignature = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitModuleDeclaration = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitNamedImports = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitNamespaceImport = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitNewExpression = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitNonNullExpression = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitNumericLiteral = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitObjectLiteralExpression = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitParameterDeclaration = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitPostfixUnaryExpression = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitPrefixUnaryExpression = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitPropertyAccessExpression = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitPropertyAssignment = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitPropertyDeclaration = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitPropertySignature = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitRegularExpressionLiteral = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitReturnStatement = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitSetAccessor = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitSourceFile = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitStringLiteral = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitSwitchStatement = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitTemplateExpression = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitThrowStatement = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitTryStatement = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitTupleType = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitTypeAliasDeclaration = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitTypeAssertionExpression = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitTypeLiteral = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitTypeReference = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitVariableDeclaration = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitVariableDeclarationList = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitVariableStatement = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitWhileStatement = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitWithStatement = function (node) {
                    this.walkChildren(node);
                };
                SyntaxWalker.prototype.visitNode = function (node) {
                    switch (node.kind) {
                        case ts.SyntaxKind.AnyKeyword:
                            this.visitAnyKeyword(node);
                            break;
                        case ts.SyntaxKind.ArrayBindingPattern:
                            this.visitBindingPattern(node);
                            break;
                        case ts.SyntaxKind.ArrayLiteralExpression:
                            this.visitArrayLiteralExpression(node);
                            break;
                        case ts.SyntaxKind.ArrayType:
                            this.visitArrayType(node);
                            break;
                        case ts.SyntaxKind.ArrowFunction:
                            this.visitArrowFunction(node);
                            break;
                        case ts.SyntaxKind.BinaryExpression:
                            this.visitBinaryExpression(node);
                            break;
                        case ts.SyntaxKind.BindingElement:
                            this.visitBindingElement(node);
                            break;
                        case ts.SyntaxKind.Block:
                            this.visitBlock(node);
                            break;
                        case ts.SyntaxKind.BreakStatement:
                            this.visitBreakStatement(node);
                            break;
                        case ts.SyntaxKind.CallExpression:
                            this.visitCallExpression(node);
                            break;
                        case ts.SyntaxKind.CallSignature:
                            this.visitCallSignature(node);
                            break;
                        case ts.SyntaxKind.CaseClause:
                            this.visitCaseClause(node);
                            break;
                        case ts.SyntaxKind.ClassDeclaration:
                            this.visitClassDeclaration(node);
                            break;
                        case ts.SyntaxKind.ClassExpression:
                            this.visitClassExpression(node);
                            break;
                        case ts.SyntaxKind.CatchClause:
                            this.visitCatchClause(node);
                            break;
                        case ts.SyntaxKind.ConditionalExpression:
                            this.visitConditionalExpression(node);
                            break;
                        case ts.SyntaxKind.ConstructSignature:
                            this.visitConstructSignature(node);
                            break;
                        case ts.SyntaxKind.Constructor:
                            this.visitConstructorDeclaration(node);
                            break;
                        case ts.SyntaxKind.ConstructorType:
                            this.visitConstructorType(node);
                            break;
                        case ts.SyntaxKind.ContinueStatement:
                            this.visitContinueStatement(node);
                            break;
                        case ts.SyntaxKind.DebuggerStatement:
                            this.visitDebuggerStatement(node);
                            break;
                        case ts.SyntaxKind.DefaultClause:
                            this.visitDefaultClause(node);
                            break;
                        case ts.SyntaxKind.DoStatement:
                            this.visitDoStatement(node);
                            break;
                        case ts.SyntaxKind.ElementAccessExpression:
                            this.visitElementAccessExpression(node);
                            break;
                        case ts.SyntaxKind.EndOfFileToken:
                            this.visitEndOfFileToken(node);
                            break;
                        case ts.SyntaxKind.EnumDeclaration:
                            this.visitEnumDeclaration(node);
                            break;
                        case ts.SyntaxKind.ExportAssignment:
                            this.visitExportAssignment(node);
                            break;
                        case ts.SyntaxKind.ExpressionStatement:
                            this.visitExpressionStatement(node);
                            break;
                        case ts.SyntaxKind.ForStatement:
                            this.visitForStatement(node);
                            break;
                        case ts.SyntaxKind.ForInStatement:
                            this.visitForInStatement(node);
                            break;
                        case ts.SyntaxKind.ForOfStatement:
                            this.visitForOfStatement(node);
                            break;
                        case ts.SyntaxKind.FunctionDeclaration:
                            this.visitFunctionDeclaration(node);
                            break;
                        case ts.SyntaxKind.FunctionExpression:
                            this.visitFunctionExpression(node);
                            break;
                        case ts.SyntaxKind.FunctionType:
                            this.visitFunctionType(node);
                            break;
                        case ts.SyntaxKind.GetAccessor:
                            this.visitGetAccessor(node);
                            break;
                        case ts.SyntaxKind.Identifier:
                            this.visitIdentifier(node);
                            break;
                        case ts.SyntaxKind.IfStatement:
                            this.visitIfStatement(node);
                            break;
                        case ts.SyntaxKind.ImportDeclaration:
                            this.visitImportDeclaration(node);
                            break;
                        case ts.SyntaxKind.ImportEqualsDeclaration:
                            this.visitImportEqualsDeclaration(node);
                            break;
                        case ts.SyntaxKind.IndexSignature:
                            this.visitIndexSignatureDeclaration(node);
                            break;
                        case ts.SyntaxKind.InterfaceDeclaration:
                            this.visitInterfaceDeclaration(node);
                            break;
                        case ts.SyntaxKind.JsxAttribute:
                            this.visitJsxAttribute(node);
                            break;
                        case ts.SyntaxKind.JsxElement:
                            this.visitJsxElement(node);
                            break;
                        case ts.SyntaxKind.JsxExpression:
                            this.visitJsxExpression(node);
                            break;
                        case ts.SyntaxKind.JsxSelfClosingElement:
                            this.visitJsxSelfClosingElement(node);
                            break;
                        case ts.SyntaxKind.JsxSpreadAttribute:
                            this.visitJsxSpreadAttribute(node);
                            break;
                        case ts.SyntaxKind.LabeledStatement:
                            this.visitLabeledStatement(node);
                            break;
                        case ts.SyntaxKind.MethodDeclaration:
                            this.visitMethodDeclaration(node);
                            break;
                        case ts.SyntaxKind.MethodSignature:
                            this.visitMethodSignature(node);
                            break;
                        case ts.SyntaxKind.ModuleDeclaration:
                            this.visitModuleDeclaration(node);
                            break;
                        case ts.SyntaxKind.NamedImports:
                            this.visitNamedImports(node);
                            break;
                        case ts.SyntaxKind.NamespaceImport:
                            this.visitNamespaceImport(node);
                            break;
                        case ts.SyntaxKind.NewExpression:
                            this.visitNewExpression(node);
                            break;
                        case ts.SyntaxKind.NonNullExpression:
                            this.visitNonNullExpression(node);
                            break;
                        case ts.SyntaxKind.NumericLiteral:
                            this.visitNumericLiteral(node);
                            break;
                        case ts.SyntaxKind.ObjectBindingPattern:
                            this.visitBindingPattern(node);
                            break;
                        case ts.SyntaxKind.ObjectLiteralExpression:
                            this.visitObjectLiteralExpression(node);
                            break;
                        case ts.SyntaxKind.Parameter:
                            this.visitParameterDeclaration(node);
                            break;
                        case ts.SyntaxKind.PostfixUnaryExpression:
                            this.visitPostfixUnaryExpression(node);
                            break;
                        case ts.SyntaxKind.PrefixUnaryExpression:
                            this.visitPrefixUnaryExpression(node);
                            break;
                        case ts.SyntaxKind.PropertyAccessExpression:
                            this.visitPropertyAccessExpression(node);
                            break;
                        case ts.SyntaxKind.PropertyAssignment:
                            this.visitPropertyAssignment(node);
                            break;
                        case ts.SyntaxKind.PropertyDeclaration:
                            this.visitPropertyDeclaration(node);
                            break;
                        case ts.SyntaxKind.PropertySignature:
                            this.visitPropertySignature(node);
                            break;
                        case ts.SyntaxKind.RegularExpressionLiteral:
                            this.visitRegularExpressionLiteral(node);
                            break;
                        case ts.SyntaxKind.ReturnStatement:
                            this.visitReturnStatement(node);
                            break;
                        case ts.SyntaxKind.SetAccessor:
                            this.visitSetAccessor(node);
                            break;
                        case ts.SyntaxKind.SourceFile:
                            this.visitSourceFile(node);
                            break;
                        case ts.SyntaxKind.StringLiteral:
                            this.visitStringLiteral(node);
                            break;
                        case ts.SyntaxKind.SwitchStatement:
                            this.visitSwitchStatement(node);
                            break;
                        case ts.SyntaxKind.TemplateExpression:
                            this.visitTemplateExpression(node);
                            break;
                        case ts.SyntaxKind.ThrowStatement:
                            this.visitThrowStatement(node);
                            break;
                        case ts.SyntaxKind.TryStatement:
                            this.visitTryStatement(node);
                            break;
                        case ts.SyntaxKind.TupleType:
                            this.visitTupleType(node);
                            break;
                        case ts.SyntaxKind.TypeAliasDeclaration:
                            this.visitTypeAliasDeclaration(node);
                            break;
                        case ts.SyntaxKind.TypeAssertionExpression:
                            this.visitTypeAssertionExpression(node);
                            break;
                        case ts.SyntaxKind.TypeLiteral:
                            this.visitTypeLiteral(node);
                            break;
                        case ts.SyntaxKind.TypeReference:
                            this.visitTypeReference(node);
                            break;
                        case ts.SyntaxKind.VariableDeclaration:
                            this.visitVariableDeclaration(node);
                            break;
                        case ts.SyntaxKind.VariableDeclarationList:
                            this.visitVariableDeclarationList(node);
                            break;
                        case ts.SyntaxKind.VariableStatement:
                            this.visitVariableStatement(node);
                            break;
                        case ts.SyntaxKind.WhileStatement:
                            this.visitWhileStatement(node);
                            break;
                        case ts.SyntaxKind.WithStatement:
                            this.visitWithStatement(node);
                            break;
                        default:
                            this.walkChildren(node);
                            break;
                    }
                };
                SyntaxWalker.prototype.walkChildren = function (node) {
                    var _this = this;
                    ts.forEachChild(node, function (child) {
                        return _this.visitNode(child);
                    });
                };
                return SyntaxWalker;
            }();
            exports_1("SyntaxWalker", SyntaxWalker);
        }
    };
});
System.register("src/mode/tslint/language/walker/ruleWalker.js", ["../rule/rule", "./syntaxWalker"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __moduleName = context_1 && context_1.id;
    var rule_1, syntaxWalker_1, RuleWalker;
    return {
        setters: [function (rule_1_1) {
            rule_1 = rule_1_1;
        }, function (syntaxWalker_1_1) {
            syntaxWalker_1 = syntaxWalker_1_1;
        }],
        execute: function () {
            RuleWalker = function (_super) {
                __extends(RuleWalker, _super);
                function RuleWalker(sourceFile, options) {
                    var _this = _super.call(this) || this;
                    _this.sourceFile = sourceFile;
                    _this.failures = [];
                    _this.options = options.ruleArguments;
                    _this.limit = _this.sourceFile.getFullWidth();
                    _this.ruleName = options.ruleName;
                    return _this;
                }
                RuleWalker.prototype.getSourceFile = function () {
                    return this.sourceFile;
                };
                RuleWalker.prototype.getLineAndCharacterOfPosition = function (position) {
                    return this.sourceFile.getLineAndCharacterOfPosition(position);
                };
                RuleWalker.prototype.getFailures = function () {
                    return this.failures;
                };
                RuleWalker.prototype.getLimit = function () {
                    return this.limit;
                };
                RuleWalker.prototype.getOptions = function () {
                    return this.options;
                };
                RuleWalker.prototype.hasOption = function (option) {
                    if (this.options) {
                        return this.options.indexOf(option) !== -1;
                    } else {
                        return false;
                    }
                };
                RuleWalker.prototype.skip = function (_node) {
                    return;
                };
                RuleWalker.prototype.createFailure = function (start, width, failure, fix) {
                    var from = start > this.limit ? this.limit : start;
                    var to = start + width > this.limit ? this.limit : start + width;
                    return new rule_1.RuleFailure(this.sourceFile, from, to, failure, this.ruleName, fix);
                };
                RuleWalker.prototype.addFailure = function (failure) {
                    this.failures.push(failure);
                };
                RuleWalker.prototype.addFailureAt = function (start, width, failure, fix) {
                    this.addFailure(this.createFailure(start, width, failure, fix));
                };
                RuleWalker.prototype.addFailureFromStartToEnd = function (start, end, failure, fix) {
                    this.addFailureAt(start, end - start, failure, fix);
                };
                RuleWalker.prototype.addFailureAtNode = function (node, failure, fix) {
                    this.addFailureAt(node.getStart(this.sourceFile), node.getWidth(this.sourceFile), failure, fix);
                };
                RuleWalker.prototype.createReplacement = function (start, length, text) {
                    return new rule_1.Replacement(start, length, text);
                };
                RuleWalker.prototype.appendText = function (start, text) {
                    return this.createReplacement(start, 0, text);
                };
                RuleWalker.prototype.deleteText = function (start, length) {
                    return this.createReplacement(start, length, "");
                };
                RuleWalker.prototype.deleteFromTo = function (start, end) {
                    return this.createReplacement(start, end - start, "");
                };
                RuleWalker.prototype.getRuleName = function () {
                    return this.ruleName;
                };
                RuleWalker.prototype.createFix = function () {
                    var replacements = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        replacements[_i] = arguments[_i];
                    }
                    return new rule_1.Fix(this.ruleName, replacements);
                };
                return RuleWalker;
            }(syntaxWalker_1.SyntaxWalker);
            exports_1("RuleWalker", RuleWalker);
        }
    };
});
System.register("src/mode/tslint/rules/useIsnanRule.js", ["../language/rule/abstractRule", "../utils", "../language/walker/ruleWalker"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        } else {
            cooked.raw = raw;
        }
        return cooked;
    };
    var __moduleName = context_1 && context_1.id;
    var abstractRule_1, utils_1, ruleWalker_1, Rule, UseIsnanRuleWalker, templateObject_1;
    return {
        setters: [function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }, function (utils_1_1) {
            utils_1 = utils_1_1;
        }, function (ruleWalker_1_1) {
            ruleWalker_1 = ruleWalker_1_1;
        }],
        execute: function () {
            Rule = function (_super) {
                __extends(Rule, _super);
                function Rule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Rule.prototype.apply = function (sourceFile) {
                    return this.applyWithWalker(new UseIsnanRuleWalker(sourceFile, this.getOptions()));
                };
                Rule.metadata = {
                    ruleName: "use-isnan",
                    description: "Enforces use of the `isNaN()` function to check for NaN references instead of a comparison to the `NaN` constant.",
                    rationale: utils_1.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            Since `NaN !== NaN`, comparisons with regular operators will produce unexpected results.\n            So, instead of `if (myVar === NaN)`, do `if (isNaN(myVar))`."], ["\n            Since \\`NaN !== NaN\\`, comparisons with regular operators will produce unexpected results.\n            So, instead of \\`if (myVar === NaN)\\`, do \\`if (isNaN(myVar))\\`."]))),
                    optionsDescription: "Not configurable.",
                    options: null,
                    optionExamples: ["true"],
                    type: "functionality",
                    typescriptOnly: false
                };
                Rule.FAILURE_STRING = "Found an invalid comparison for NaN: ";
                return Rule;
            }(abstractRule_1.AbstractRule);
            exports_1("Rule", Rule);
            UseIsnanRuleWalker = function (_super) {
                __extends(UseIsnanRuleWalker, _super);
                function UseIsnanRuleWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                UseIsnanRuleWalker.prototype.visitBinaryExpression = function (node) {
                    if ((this.isExpressionNaN(node.left) || this.isExpressionNaN(node.right)) && node.operatorToken.kind !== ts.SyntaxKind.EqualsToken) {
                        this.addFailureAtNode(node, Rule.FAILURE_STRING + node.getText());
                    }
                    _super.prototype.visitBinaryExpression.call(this, node);
                };
                UseIsnanRuleWalker.prototype.isExpressionNaN = function (node) {
                    return node.kind === ts.SyntaxKind.Identifier && node.getText() === "NaN";
                };
                return UseIsnanRuleWalker;
            }(ruleWalker_1.RuleWalker);
        }
    };
});
System.register("src/mode/tslint/ruleLoader.js", ["./error", "./language/rule/abstractRule", "./utils", "./rules/arrayTypeRule", "./rules/classNameRule", "./rules/commentFormatRule", "./rules/curlyRule", "./rules/eoflineRule", "./rules/forinRule", "./rules/indentRule", "./rules/interfaceNameRule", "./rules/jsdocFormatRule", "./rules/labelPositionRule", "./rules/maxLineLengthRule", "./rules/memberAccessRule", "./rules/newParensRule", "./rules/noAnyRule", "./rules/noArgRule", "./rules/noBitwiseRule", "./rules/noConditionalAssignmentRule", "./rules/noConsecutiveBlankLinesRule", "./rules/noConsoleRule", "./rules/noConstructRule", "./rules/noEvalRule", "./rules/noForInArrayRule", "./rules/noInferrableTypesRule", "./rules/noMagicNumbersRule", "./rules/noShadowedVariableRule", "./rules/noStringThrowRule", "./rules/noTrailingWhitespaceRule", "./rules/noVarKeywordRule", "./rules/oneVariablePerDeclarationRule", "./rules/preferConstRule", "./rules/preferForOfRule", "./rules/preferFunctionOverMethodRule", "./rules/preferMethodSignatureRule", "./rules/radixRule", "./rules/semicolonRule", "./rules/trailingCommaRule", "./rules/tripleEqualsRule", "./rules/useIsnanRule"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function loadRules(ruleConfiguration, enableDisableRuleMap, isJs) {
        var rules = [];
        var notFoundRules = [];
        var notAllowedInJsRules = [];
        for (var ruleName in ruleConfiguration) {
            if (ruleConfiguration.hasOwnProperty(ruleName)) {
                var ruleValue = ruleConfiguration[ruleName];
                if (abstractRule_1.AbstractRule.isRuleEnabled(ruleValue) || enableDisableRuleMap.hasOwnProperty(ruleName)) {
                    var Rule = findRule(ruleName);
                    if (Rule == null) {
                        notFoundRules.push(ruleName);
                    } else {
                        if (isJs && Rule.metadata && Rule.metadata.typescriptOnly != null && Rule.metadata.typescriptOnly) {
                            notAllowedInJsRules.push(ruleName);
                        } else {
                            var ruleSpecificList = ruleName in enableDisableRuleMap ? enableDisableRuleMap[ruleName] : [];
                            var disabledIntervals = buildDisabledIntervalsFromSwitches(ruleSpecificList);
                            rules.push(new Rule(ruleName, ruleValue, disabledIntervals));
                            if (Rule.metadata && Rule.metadata.deprecationMessage) {
                                error_1.showWarningOnce(Rule.metadata.ruleName + " is deprecated. " + Rule.metadata.deprecationMessage);
                            }
                        }
                    }
                }
            }
        }
        return rules;
    }
    exports_1("loadRules", loadRules);
    function findRule(name) {
        var camelizedName = transformName(name);
        var Rule = loadCachedRule(camelizedName);
        if (Rule) {
            return Rule;
        } else {
            throw new Error("rule " + name + " not found");
        }
    }
    exports_1("findRule", findRule);
    function transformName(name) {
        var nameMatch = name.match(/^([-_]*)(.*?)([-_]*)$/);
        if (nameMatch == null) {
            return name + "Rule";
        }
        return nameMatch[1] + utils_1.camelize(nameMatch[2]) + nameMatch[3] + "Rule";
    }
    function loadRule(ruleName) {
        switch (ruleName) {
            case 'arrayTypeRule':
                return arrayTypeRule_1.Rule;
            case 'classNameRule':
                return classNameRule_1.Rule;
            case 'commentFormatRule':
                return commentFormatRule_1.Rule;
            case 'curlyRule':
                return curlyRule_1.Rule;
            case 'eoflineRule':
                return eoflineRule_1.Rule;
            case 'forinRule':
                return forinRule_1.Rule;
            case 'indentRule':
                return indentRule_1.Rule;
            case 'interfaceNameRule':
                return interfaceNameRule_1.Rule;
            case 'jsdocFormatRule':
                return jsdocFormatRule_1.Rule;
            case 'labelPositionRule':
                return labelPositionRule_1.Rule;
            case 'maxLineLengthRule':
                return maxLineLengthRule_1.Rule;
            case 'memberAccessRule':
                return memberAccessRule_1.Rule;
            case 'newParensRule':
                return newParensRule_1.Rule;
            case 'noAnyRule':
                return noAnyRule_1.Rule;
            case 'noArgRule':
                return noArgRule_1.Rule;
            case 'noBitwiseRule':
                return noBitwiseRule_1.Rule;
            case 'noConditionalAssignmentRule':
                return noConditionalAssignmentRule_1.Rule;
            case 'noConsecutiveBlankLinesRule':
                return noConsecutiveBlankLinesRule_1.Rule;
            case 'noConsoleRule':
                return noConsoleRule_1.Rule;
            case 'noConstructRule':
                return noConstructRule_1.Rule;
            case 'noEvalRule':
                return noEvalRule_1.Rule;
            case 'noForInArrayRule':
                return noForInArrayRule_1.Rule;
            case 'noInferrableTypesRule':
                return noInferrableTypesRule_1.Rule;
            case 'noMagicNumbersRule':
                return noMagicNumbersRule_1.Rule;
            case 'noShadowedVariableRule':
                return noShadowedVariableRule_1.Rule;
            case 'noStringThrowRule':
                return noStringThrowRule_1.Rule;
            case 'noTrailingWhitespaceRule':
                return noTrailingWhitespaceRule_1.Rule;
            case 'noVarKeywordRule':
                return noVarKeywordRule_1.Rule;
            case 'oneVariablePerDeclarationRule':
                return oneVariablePerDeclarationRule_1.Rule;
            case 'preferConstRule':
                return preferConstRule_1.Rule;
            case 'preferForOfRule':
                return preferForOfRule_1.Rule;
            case 'preferFunctionOverMethodRule':
                return preferFunctionOverMethodRule_1.Rule;
            case 'preferMethodSignatureRule':
                return preferMethodSignatureRule_1.Rule;
            case 'radixRule':
                return radixRule_1.Rule;
            case 'semicolonRule':
                return semicolonRule_1.Rule;
            case 'trailingCommaRule':
                return trailingCommaRule_1.Rule;
            case 'tripleEqualsRule':
                return tripleEqualsRule_1.Rule;
            case 'useIsnanRule':
                return useIsnanRule_1.Rule;
            default:
                return null;
        }
    }
    function loadCachedRule(ruleName) {
        var cachedRule = cachedRules.get(ruleName);
        if (cachedRule !== undefined) {
            return cachedRule;
        }
        var Rule = loadRule(ruleName);
        cachedRules.set(ruleName, Rule);
        return Rule;
    }
    function buildDisabledIntervalsFromSwitches(ruleSpecificList) {
        var disabledIntervalList = [];
        var i = 1;
        while (i < ruleSpecificList.length) {
            var startPosition = ruleSpecificList[i].position;
            var endPosition = ruleSpecificList[i + 1] ? ruleSpecificList[i + 1].position : Infinity;
            disabledIntervalList.push({
                endPosition: endPosition,
                startPosition: startPosition
            });
            i += 2;
        }
        return disabledIntervalList;
    }
    var error_1, abstractRule_1, utils_1, arrayTypeRule_1, classNameRule_1, commentFormatRule_1, curlyRule_1, eoflineRule_1, forinRule_1, indentRule_1, interfaceNameRule_1, jsdocFormatRule_1, labelPositionRule_1, maxLineLengthRule_1, memberAccessRule_1, newParensRule_1, noAnyRule_1, noArgRule_1, noBitwiseRule_1, noConditionalAssignmentRule_1, noConsecutiveBlankLinesRule_1, noConsoleRule_1, noConstructRule_1, noEvalRule_1, noForInArrayRule_1, noInferrableTypesRule_1, noMagicNumbersRule_1, noShadowedVariableRule_1, noStringThrowRule_1, noTrailingWhitespaceRule_1, noVarKeywordRule_1, oneVariablePerDeclarationRule_1, preferConstRule_1, preferForOfRule_1, preferFunctionOverMethodRule_1, preferMethodSignatureRule_1, radixRule_1, semicolonRule_1, trailingCommaRule_1, tripleEqualsRule_1, useIsnanRule_1, cachedRules;
    return {
        setters: [function (error_1_1) {
            error_1 = error_1_1;
        }, function (abstractRule_1_1) {
            abstractRule_1 = abstractRule_1_1;
        }, function (utils_1_1) {
            utils_1 = utils_1_1;
        }, function (arrayTypeRule_1_1) {
            arrayTypeRule_1 = arrayTypeRule_1_1;
        }, function (classNameRule_1_1) {
            classNameRule_1 = classNameRule_1_1;
        }, function (commentFormatRule_1_1) {
            commentFormatRule_1 = commentFormatRule_1_1;
        }, function (curlyRule_1_1) {
            curlyRule_1 = curlyRule_1_1;
        }, function (eoflineRule_1_1) {
            eoflineRule_1 = eoflineRule_1_1;
        }, function (forinRule_1_1) {
            forinRule_1 = forinRule_1_1;
        }, function (indentRule_1_1) {
            indentRule_1 = indentRule_1_1;
        }, function (interfaceNameRule_1_1) {
            interfaceNameRule_1 = interfaceNameRule_1_1;
        }, function (jsdocFormatRule_1_1) {
            jsdocFormatRule_1 = jsdocFormatRule_1_1;
        }, function (labelPositionRule_1_1) {
            labelPositionRule_1 = labelPositionRule_1_1;
        }, function (maxLineLengthRule_1_1) {
            maxLineLengthRule_1 = maxLineLengthRule_1_1;
        }, function (memberAccessRule_1_1) {
            memberAccessRule_1 = memberAccessRule_1_1;
        }, function (newParensRule_1_1) {
            newParensRule_1 = newParensRule_1_1;
        }, function (noAnyRule_1_1) {
            noAnyRule_1 = noAnyRule_1_1;
        }, function (noArgRule_1_1) {
            noArgRule_1 = noArgRule_1_1;
        }, function (noBitwiseRule_1_1) {
            noBitwiseRule_1 = noBitwiseRule_1_1;
        }, function (noConditionalAssignmentRule_1_1) {
            noConditionalAssignmentRule_1 = noConditionalAssignmentRule_1_1;
        }, function (noConsecutiveBlankLinesRule_1_1) {
            noConsecutiveBlankLinesRule_1 = noConsecutiveBlankLinesRule_1_1;
        }, function (noConsoleRule_1_1) {
            noConsoleRule_1 = noConsoleRule_1_1;
        }, function (noConstructRule_1_1) {
            noConstructRule_1 = noConstructRule_1_1;
        }, function (noEvalRule_1_1) {
            noEvalRule_1 = noEvalRule_1_1;
        }, function (noForInArrayRule_1_1) {
            noForInArrayRule_1 = noForInArrayRule_1_1;
        }, function (noInferrableTypesRule_1_1) {
            noInferrableTypesRule_1 = noInferrableTypesRule_1_1;
        }, function (noMagicNumbersRule_1_1) {
            noMagicNumbersRule_1 = noMagicNumbersRule_1_1;
        }, function (noShadowedVariableRule_1_1) {
            noShadowedVariableRule_1 = noShadowedVariableRule_1_1;
        }, function (noStringThrowRule_1_1) {
            noStringThrowRule_1 = noStringThrowRule_1_1;
        }, function (noTrailingWhitespaceRule_1_1) {
            noTrailingWhitespaceRule_1 = noTrailingWhitespaceRule_1_1;
        }, function (noVarKeywordRule_1_1) {
            noVarKeywordRule_1 = noVarKeywordRule_1_1;
        }, function (oneVariablePerDeclarationRule_1_1) {
            oneVariablePerDeclarationRule_1 = oneVariablePerDeclarationRule_1_1;
        }, function (preferConstRule_1_1) {
            preferConstRule_1 = preferConstRule_1_1;
        }, function (preferForOfRule_1_1) {
            preferForOfRule_1 = preferForOfRule_1_1;
        }, function (preferFunctionOverMethodRule_1_1) {
            preferFunctionOverMethodRule_1 = preferFunctionOverMethodRule_1_1;
        }, function (preferMethodSignatureRule_1_1) {
            preferMethodSignatureRule_1 = preferMethodSignatureRule_1_1;
        }, function (radixRule_1_1) {
            radixRule_1 = radixRule_1_1;
        }, function (semicolonRule_1_1) {
            semicolonRule_1 = semicolonRule_1_1;
        }, function (trailingCommaRule_1_1) {
            trailingCommaRule_1 = trailingCommaRule_1_1;
        }, function (tripleEqualsRule_1_1) {
            tripleEqualsRule_1 = tripleEqualsRule_1_1;
        }, function (useIsnanRule_1_1) {
            useIsnanRule_1 = useIsnanRule_1_1;
        }],
        execute: function () {
            cachedRules = new Map();
        }
    };
});
System.register("src/mode/tslint/utils.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function arrayify(arg) {
        if (Array.isArray(arg)) {
            return arg;
        } else if (arg != null) {
            return [arg];
        } else {
            return [];
        }
    }
    exports_1("arrayify", arrayify);
    function objectify(arg) {
        if (typeof arg === "object" && arg != null) {
            return arg;
        } else {
            return {};
        }
    }
    exports_1("objectify", objectify);
    function camelize(stringWithHyphens) {
        return stringWithHyphens.replace(/-(.)/g, function (_, nextLetter) {
            return nextLetter.toUpperCase();
        });
    }
    exports_1("camelize", camelize);
    function dedent(strings) {
        var values = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            values[_i - 1] = arguments[_i];
        }
        var fullString = strings.reduce(function (accumulator, str, i) {
            return accumulator + values[i - 1] + str;
        });
        var match = fullString.match(/^[ \t]*(?=\S)/gm);
        if (!match) {
            return fullString;
        }
        var indent = Math.min.apply(Math, match.map(function (el) {
            return el.length;
        }));
        var regexp = new RegExp("^[ \\t]{" + indent + "}", "gm");
        fullString = indent > 0 ? fullString.replace(regexp, "") : fullString;
        return fullString;
    }
    exports_1("dedent", dedent);
    function stripComments(content) {
        var regexp = /("(?:[^\\\"]*(?:\\.)?)*")|('(?:[^\\\']*(?:\\.)?)*')|(\/\*(?:\r?\n|.)*?\*\/)|(\/{2,}.*?(?:(?:\r?\n)|$))/g;
        var result = content.replace(regexp, function (match, _m1, _m2, m3, m4) {
            if (m3) {
                return "";
            } else if (m4) {
                var length = m4.length;
                if (length > 2 && m4[length - 1] === "\n") {
                    return m4[length - 2] === "\r" ? "\r\n" : "\n";
                } else {
                    return "";
                }
            } else {
                return match;
            }
        });
        return result;
    }
    exports_1("stripComments", stripComments);
    function escapeRegExp(re) {
        return re.replace(/[.+*?|^$[\]{}()\\]/g, "\\$&");
    }
    exports_1("escapeRegExp", escapeRegExp);
    function arraysAreEqual(a, b, eq) {
        return a === b || !!a && !!b && a.length === b.length && a.every(function (x, idx) {
            return eq(x, b[idx]);
        });
    }
    exports_1("arraysAreEqual", arraysAreEqual);
    return {
        setters: [],
        execute: function () {
            ;
        }
    };
});
System.register("src/mode/tslint/linter.js", ["./enableDisableRules", "./error", "./language/rule/typedRule", "./ruleLoader", "./utils"], function (exports_1, context_1) {
    "use strict";

    var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        } else {
            cooked.raw = raw;
        }
        return cooked;
    };
    var __moduleName = context_1 && context_1.id;
    var enableDisableRules_1, error_1, typedRule_1, ruleLoader_1, utils_1, Linter, templateObject_1;
    return {
        setters: [function (enableDisableRules_1_1) {
            enableDisableRules_1 = enableDisableRules_1_1;
        }, function (error_1_1) {
            error_1 = error_1_1;
        }, function (typedRule_1_1) {
            typedRule_1 = typedRule_1_1;
        }, function (ruleLoader_1_1) {
            ruleLoader_1 = ruleLoader_1_1;
        }, function (utils_1_1) {
            utils_1 = utils_1_1;
        }],
        execute: function () {
            Linter = function () {
                function Linter(options, languageService) {
                    this.languageService = languageService;
                    this.failures = [];
                    this.fixes = [];
                    if (typeof options !== "object") {
                        throw new Error("Unknown Linter options type: " + typeof options);
                    }
                    if (options.configuration != null) {
                        throw new Error("ILinterOptions does not contain the property `configuration` as of version 4. " + "Did you mean to pass the `IConfigurationFile` object to lint() ? ");
                    }
                }
                Linter.getFileNames = function (program) {
                    return program.getSourceFiles().map(function (s) {
                        return s.fileName;
                    }).filter(function (l) {
                        return l.substr(-5) !== ".d.ts";
                    });
                };
                Linter.prototype.lint = function (fileName, configuration) {
                    var sourceFile = this.getSourceFile(fileName);
                    var isJs = /\.jsx?$/i.test(fileName);
                    var enabledRules = this.getEnabledRules(sourceFile, configuration, isJs);
                    var hasLinterRun = false;
                    var fileFailures = [];
                    if (!hasLinterRun || this.fixes.length > 0) {
                        fileFailures = [];
                        for (var _i = 0, enabledRules_1 = enabledRules; _i < enabledRules_1.length; _i++) {
                            var rule = enabledRules_1[_i];
                            var ruleFailures = this.applyRule(rule, sourceFile);
                            if (ruleFailures.length > 0) {
                                fileFailures = fileFailures.concat(ruleFailures);
                            }
                        }
                    }
                    this.failures = this.failures.concat(fileFailures);
                };
                Linter.prototype.getRuleFailures = function () {
                    return this.failures;
                };
                Linter.prototype.applyRule = function (rule, sourceFile) {
                    var ruleFailures = [];
                    try {
                        if (typedRule_1.TypedRule.isTypedRule(rule)) {
                            ruleFailures = rule.applyWithProgram(sourceFile, this.languageService);
                        } else {
                            ruleFailures = rule.apply(sourceFile, this.languageService);
                        }
                    } catch (error) {
                        if (error_1.isError(error)) {
                            error_1.showWarningOnce("Warning: " + error.message);
                        } else {}
                    }
                    var fileFailures = [];
                    for (var _i = 0, ruleFailures_1 = ruleFailures; _i < ruleFailures_1.length; _i++) {
                        var ruleFailure = ruleFailures_1[_i];
                        if (!this.containsRule(this.failures, ruleFailure)) {
                            fileFailures.push(ruleFailure);
                        }
                    }
                    return fileFailures;
                };
                Linter.prototype.getEnabledRules = function (sourceFile, configuration, isJs) {
                    var configurationRules = isJs ? configuration.jsRules : configuration.rules;
                    var enableDisableRuleMap = new enableDisableRules_1.EnableDisableRulesWalker(sourceFile, configurationRules).getEnableDisableRuleMap();
                    var configuredRules = configurationRules ? ruleLoader_1.loadRules(configurationRules, enableDisableRuleMap, isJs) : [];
                    return configuredRules.filter(function (r) {
                        return r.isEnabled();
                    });
                };
                Linter.prototype.getSourceFile = function (fileName) {
                    var sourceFile = this.languageService.getProgram().getSourceFile(fileName);
                    if (sourceFile && !("resolvedModules" in sourceFile)) {
                        throw new Error("Program must be type checked before linting");
                    }
                    if (sourceFile === undefined) {
                        var INVALID_SOURCE_ERROR = utils_1.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n                Invalid source file: ", ". Ensure that the files supplied to lint have a .ts, .tsx, .js or .jsx extension.\n            "], ["\n                Invalid source file: ", ". Ensure that the files supplied to lint have a .ts, .tsx, .js or .jsx extension.\n            "])), fileName);
                        throw new Error(INVALID_SOURCE_ERROR);
                    }
                    return sourceFile;
                };
                Linter.prototype.containsRule = function (rules, rule) {
                    return rules.some(function (r) {
                        return r.equals(rule);
                    });
                };
                return Linter;
            }();
            exports_1("Linter", Linter);
        }
    };
});
System.register("src/mode/typescript/LanguageServiceDispatcher.js", ["./DocumentRegistryInspector", "./fileExtensionIs", "./LanguageServiceHelpers", "../python/PythonLanguageService", "./transpileModule", "typhon-typescript", "../python/Linter", "../tslint/linter"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function isTypeScriptFileName(fileName) {
        return fileExtensionIs_1.fileExtensionIs(fileName, '.ts') || fileExtensionIs_1.fileExtensionIs(fileName, '.tsx') || fileExtensionIs_1.fileExtensionIs(fileName, '.d.ts');
    }
    function isJavaScriptFileName(fileName) {
        return fileExtensionIs_1.fileExtensionIs(fileName, '.js') || fileExtensionIs_1.fileExtensionIs(fileName, '.jsx');
    }
    function isPythonFileName(fileName) {
        return fileExtensionIs_1.fileExtensionIs(fileName, '.py') || fileExtensionIs_1.fileExtensionIs(fileName, '.pyx') || fileExtensionIs_1.fileExtensionIs(fileName, '.d.py');
    }
    function tsDiagnosticToEditorDiagnostic(diagnostic) {
        return {
            message: ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
            start: diagnostic.start,
            length: diagnostic.length,
            category: diagnostic.category,
            code: diagnostic.code
        };
    }
    function ruleFailureToEditorDiagnostic(ruleFailure) {
        var start = ruleFailure.getStartPosition().getPosition();
        var end = ruleFailure.getEndPosition().getPosition();
        var length = end - start;
        var ruleName = ruleFailure.getRuleName();
        return {
            message: ruleFailure.getFailure(),
            start: start,
            length: length,
            category: DiagnosticCategory.Warning,
            code: ruleName
        };
    }
    function systemModuleName(prefix, fileName, extension) {
        var lastPeriod = fileName.lastIndexOf('.');
        if (lastPeriod >= 0) {
            var name = fileName.substring(0, lastPeriod);
            if (typeof extension === 'string') {
                return [prefix, name, '.', extension].join('');
            } else {
                return [prefix, name].join('');
            }
        } else {
            if (typeof extension === 'string') {
                return [prefix, fileName, '.', extension].join('');
            } else {
                return [prefix, fileName].join('');
            }
        }
    }
    function getTargetFileName(fileName) {
        if (fileExtensionIs_1.fileExtensionIs(fileName, '.js')) {
            var end = fileName.lastIndexOf('.js');
            return fileName.substring(0, end) + ".ts";
        } else if (fileExtensionIs_1.fileExtensionIs(fileName, '.jsx')) {
            var end = fileName.lastIndexOf('.jsx');
            return fileName.substring(0, end) + ".tsx";
        } else if (fileExtensionIs_1.fileExtensionIs(fileName, '.py')) {
            var end = fileName.lastIndexOf('.py');
            return fileName.substring(0, end) + ".ts";
        } else if (fileExtensionIs_1.fileExtensionIs(fileName, '.pyx')) {
            var end = fileName.lastIndexOf('.pyx');
            return fileName.substring(0, end) + ".tsx";
        } else {
            throw new Error("getTargetFileName(" + fileName + ")");
        }
    }
    function targetNeedsUpdate(sourceVersion, targetVersion) {
        if (typeof targetVersion === 'number') {
            if (typeof sourceVersion === 'number') {
                return sourceVersion > targetVersion;
            } else {
                throw new Error("sourceVersion should not be undefined");
            }
        } else {
            return true;
        }
    }
    var DocumentRegistryInspector_1, fileExtensionIs_1, LanguageServiceHelpers_1, PythonLanguageService_1, transpileModule_1, typhon_typescript_1, Linter_1, linter_1, useCaseSensitiveFileNames, LanguageServiceDispatcher, DiagnosticCategory;
    return {
        setters: [function (DocumentRegistryInspector_1_1) {
            DocumentRegistryInspector_1 = DocumentRegistryInspector_1_1;
        }, function (fileExtensionIs_1_1) {
            fileExtensionIs_1 = fileExtensionIs_1_1;
        }, function (LanguageServiceHelpers_1_1) {
            LanguageServiceHelpers_1 = LanguageServiceHelpers_1_1;
        }, function (PythonLanguageService_1_1) {
            PythonLanguageService_1 = PythonLanguageService_1_1;
        }, function (transpileModule_1_1) {
            transpileModule_1 = transpileModule_1_1;
        }, function (typhon_typescript_1_1) {
            typhon_typescript_1 = typhon_typescript_1_1;
        }, function (Linter_1_1) {
            Linter_1 = Linter_1_1;
        }, function (linter_1_1) {
            linter_1 = linter_1_1;
        }],
        execute: function () {
            useCaseSensitiveFileNames = true;
            LanguageServiceDispatcher = function () {
                function LanguageServiceDispatcher(jsHost, pyHost, tsHost) {
                    this.jsHost = jsHost;
                    this.pyHost = pyHost;
                    this.tsHost = tsHost;
                    this.tsDocumentRegistry = new DocumentRegistryInspector_1.DocumentRegistryInspector(ts.createDocumentRegistry(useCaseSensitiveFileNames));
                }
                LanguageServiceDispatcher.prototype.applyDelta = function (fileName, delta) {
                    if (isTypeScriptFileName(fileName)) {
                        return this.tsHost.applyDelta(fileName, delta);
                    } else if (isJavaScriptFileName(fileName)) {
                        return this.jsHost.applyDelta(fileName, delta);
                    } else if (isPythonFileName(fileName)) {
                        return this.pyHost.applyDelta(fileName, delta);
                    } else {
                        throw new Error("delta cannot be applied to file '" + fileName + "'.");
                    }
                };
                LanguageServiceDispatcher.prototype.getScriptContent = function (fileName) {
                    if (isTypeScriptFileName(fileName)) {
                        return this.tsHost.getScriptContent(fileName);
                    } else if (isJavaScriptFileName(fileName)) {
                        return this.jsHost.getScriptContent(fileName);
                    } else if (isPythonFileName(fileName)) {
                        return this.pyHost.getScriptContent(fileName);
                    } else {
                        throw new Error("Cannot get script content for file '" + fileName + "'.");
                    }
                };
                LanguageServiceDispatcher.prototype.setScriptContent = function (fileName, content) {
                    if (isTypeScriptFileName(fileName)) {
                        return this.tsHost.setScriptContent(fileName, content);
                    } else if (isJavaScriptFileName(fileName)) {
                        return this.jsHost.setScriptContent(fileName, content);
                    } else if (isPythonFileName(fileName)) {
                        return this.pyHost.setScriptContent(fileName, content);
                    } else {
                        throw new Error("Cannot set script content for file '" + fileName + "'.");
                    }
                };
                LanguageServiceDispatcher.prototype.getScriptVersionNumber = function (fileName) {
                    if (isTypeScriptFileName(fileName)) {
                        return this.tsHost.getScriptVersionNumber(fileName);
                    } else if (isJavaScriptFileName(fileName)) {
                        return this.jsHost.getScriptVersionNumber(fileName);
                    } else if (isPythonFileName(fileName)) {
                        return this.pyHost.getScriptVersionNumber(fileName);
                    } else {
                        throw new Error("Cannot get script version number for file '" + fileName + "'.");
                    }
                };
                LanguageServiceDispatcher.prototype.removeScript = function (fileName) {
                    if (isTypeScriptFileName(fileName)) {
                        return this.tsHost.removeScript(fileName);
                    } else if (isJavaScriptFileName(fileName)) {
                        return this.jsHost.removeScript(fileName);
                    } else if (isPythonFileName(fileName)) {
                        return this.pyHost.removeScript(fileName);
                    } else {
                        throw new Error("Cannot set script content for file '" + fileName + "'.");
                    }
                };
                LanguageServiceDispatcher.prototype.ensureModuleMapping = function (moduleName, fileName) {
                    if (isTypeScriptFileName(fileName)) {
                        return this.tsHost.ensureModuleMapping(moduleName, fileName);
                    } else if (isJavaScriptFileName(fileName)) {
                        return this.jsHost.ensureModuleMapping(moduleName, fileName);
                    } else if (isPythonFileName(fileName)) {
                        return this.pyHost.ensureModuleMapping(moduleName, fileName);
                    } else {
                        throw new Error("Cannot map module '" + moduleName + "'to file '" + fileName + "'.");
                    }
                };
                LanguageServiceDispatcher.prototype.removeModuleMapping = function (moduleName) {
                    return this.tsHost.removeModuleMapping(moduleName);
                };
                LanguageServiceDispatcher.prototype.getDefaultLibFileName = function (options) {
                    return this.tsHost.getDefaultLibFileName(options);
                };
                LanguageServiceDispatcher.prototype.getCompilationSettings = function () {
                    return this.tsHost.getCompilationSettings();
                };
                LanguageServiceDispatcher.prototype.setCompilationSettings = function (compilerOptions) {
                    var oldSettings = this.getCompilationSettings();
                    this.tsHost.setCompilationSettings(compilerOptions);
                    var newSettings = this.getCompilationSettings();
                    if (LanguageServiceHelpers_1.changedCompilerSettings(oldSettings, newSettings)) {
                        if (this.tsLanguageService) {
                            this.tsLanguageService.cleanupSemanticCache();
                        }
                    }
                };
                LanguageServiceDispatcher.prototype.isOperatorOverloadingEnabled = function () {
                    return this.tsHost.isOperatorOverloadingEnabled();
                };
                LanguageServiceDispatcher.prototype.setOperatorOverloading = function (operatorOverloading) {
                    var oldValue = this.isOperatorOverloadingEnabled();
                    if (oldValue !== operatorOverloading) {
                        if (this.tsLanguageService) {
                            this.tsLanguageService.cleanupSemanticCache();
                        }
                        return this.tsHost.setOperatorOverloading(operatorOverloading);
                    } else {
                        return oldValue;
                    }
                };
                LanguageServiceDispatcher.prototype.ensureTypeScriptLanguageService = function () {
                    if (!this.tsLanguageService) {
                        this.tsLanguageService = ts.createLanguageService(this.tsHost, this.tsDocumentRegistry);
                    }
                    return this.tsLanguageService;
                };
                LanguageServiceDispatcher.prototype.ensurePythonLanguageService = function () {
                    if (!this.pyLanguageService) {
                        this.pyLanguageService = new PythonLanguageService_1.PythonLanguageService(this.pyHost);
                    }
                    return this.pyLanguageService;
                };
                LanguageServiceDispatcher.prototype.mapTsDiagnosticsToPy = function (tsFileName, tsDiagnostics, pyFileName) {
                    var pyLS = this.ensurePythonLanguageService();
                    var tsHost = this.tsHost;
                    var pyHost = this.pyHost;
                    return tsDiagnostics.map(function (tsDiagnostic) {
                        var category = tsDiagnostic.category;
                        var code = tsDiagnostic.code;
                        var length = tsDiagnostic.length;
                        var message = tsDiagnostic.message;
                        var tsLineAndColumn = tsHost.getLineAndColumn(tsFileName, tsDiagnostic.start);
                        var sourceMap = pyLS.getSourceMap(pyFileName);
                        var pyLineAndColumn = sourceMap.getSourcePosition(tsLineAndColumn);
                        var pyStart = pyHost.lineAndColumnToIndex(pyFileName, pyLineAndColumn);
                        return { category: category, code: code, length: length, message: message, start: pyStart };
                    });
                };
                LanguageServiceDispatcher.prototype.getSyntaxErrors = function (fileName) {
                    if (isTypeScriptFileName(fileName)) {
                        var tsLS = this.ensureTypeScriptLanguageService();
                        this.synchronizeFiles();
                        var diagnostics = tsLS.getSyntacticDiagnostics(fileName);
                        return diagnostics.map(tsDiagnosticToEditorDiagnostic);
                    } else if (isJavaScriptFileName(fileName)) {
                        var tsFileName = getTargetFileName(fileName);
                        return this.getSyntaxErrors(tsFileName);
                    } else if (isPythonFileName(fileName)) {
                        var tsFileName = getTargetFileName(fileName);
                        return this.mapTsDiagnosticsToPy(tsFileName, this.getSyntaxErrors(tsFileName), fileName);
                    } else {
                        return [];
                    }
                };
                LanguageServiceDispatcher.prototype.getSemanticErrors = function (fileName) {
                    if (isTypeScriptFileName(fileName)) {
                        var tsLS = this.ensureTypeScriptLanguageService();
                        this.synchronizeFiles();
                        var diagnostics = tsLS.getSemanticDiagnostics(fileName);
                        return diagnostics.map(tsDiagnosticToEditorDiagnostic);
                    } else if (isJavaScriptFileName(fileName)) {
                        var tsFileName = getTargetFileName(fileName);
                        return this.getSemanticErrors(tsFileName);
                    } else if (isPythonFileName(fileName)) {
                        var tsFileName = getTargetFileName(fileName);
                        return this.mapTsDiagnosticsToPy(tsFileName, this.getSemanticErrors(tsFileName), fileName);
                    } else {
                        return [];
                    }
                };
                LanguageServiceDispatcher.prototype.getLintErrors = function (fileName, configuration) {
                    if (isTypeScriptFileName(fileName)) {
                        var tsLS = this.ensureTypeScriptLanguageService();
                        this.synchronizeFiles();
                        var linter = new linter_1.Linter({ fix: false }, tsLS);
                        linter.lint(fileName, configuration);
                        var ruleFailures = linter.getRuleFailures();
                        return ruleFailures.map(ruleFailureToEditorDiagnostic);
                    } else if (isJavaScriptFileName(fileName)) {
                        return [];
                    } else if (isPythonFileName(fileName)) {
                        var linter = new Linter_1.Linter({ fix: false }, this.ensurePythonLanguageService());
                        linter.lint(fileName, configuration);
                        var ruleFailures = linter.getRuleFailures();
                        return ruleFailures.map(ruleFailureToEditorDiagnostic);
                    } else {
                        return [];
                    }
                };
                LanguageServiceDispatcher.prototype.getCompletionsAtPosition = function (fileName, position) {
                    var tsLS = this.ensureTypeScriptLanguageService();
                    function callback(tsFileName, tsPosition) {
                        var completionInfo = tsLS.getCompletionsAtPosition(tsFileName, tsPosition);
                        if (completionInfo) {
                            return completionInfo.entries;
                        } else {
                            return [];
                        }
                    }
                    return this.getAtPosition(fileName, position, [], 'getCompletionsAtPosition', callback);
                };
                LanguageServiceDispatcher.prototype.getDefinitionAtPosition = function (fileName, position) {
                    var tsLS = this.ensureTypeScriptLanguageService();
                    function callback(tsFileName, tsPosition) {
                        var definitionInfo = tsLS.getDefinitionAtPosition(tsFileName, tsPosition);
                        if (definitionInfo) {
                            return definitionInfo;
                        } else {
                            return [];
                        }
                    }
                    return this.getAtPosition(fileName, position, [], 'getDefinitionAtPosition', callback);
                };
                LanguageServiceDispatcher.prototype.getFormattingEditsForDocument = function (fileName, settings) {
                    return this.ensureTypeScriptLanguageService().getFormattingEditsForDocument(fileName, settings);
                };
                LanguageServiceDispatcher.prototype.getOutputFiles = function (fileName) {
                    this.synchronizeFiles();
                    var outputFiles = this.outputFiles(fileName);
                    return outputFiles;
                };
                LanguageServiceDispatcher.prototype.getQuickInfoAtPosition = function (fileName, position) {
                    var tsLS = this.ensureTypeScriptLanguageService();
                    function callback(tsFileName, tsPosition) {
                        return tsLS.getQuickInfoAtPosition(tsFileName, tsPosition);
                    }
                    return this.getAtPosition(fileName, position, void 0, 'getQuickInfoAtPosition', callback);
                };
                LanguageServiceDispatcher.prototype.getAtPosition = function (fileName, position, noMappingValue, alias, callback) {
                    this.synchronizeFiles();
                    if (isTypeScriptFileName(fileName)) {
                        return callback(fileName, position);
                    } else if (isJavaScriptFileName(fileName)) {
                        var tsFileName = getTargetFileName(fileName);
                        return callback(tsFileName, position);
                    } else if (isPythonFileName(fileName)) {
                        var pyLineAndColumn = this.pyHost.getLineAndColumn(fileName, position);
                        if (pyLineAndColumn) {
                            var pyLS = this.ensurePythonLanguageService();
                            var sourceMap = pyLS.getSourceMap(fileName);
                            if (sourceMap) {
                                var tsLineAndColumn = sourceMap.getTargetPosition(pyLineAndColumn);
                                if (tsLineAndColumn) {
                                    var tsFileName = getTargetFileName(fileName);
                                    var tsIndex = this.tsHost.lineAndColumnToIndex(tsFileName, tsLineAndColumn);
                                    if (typeof tsIndex === 'number') {
                                        return callback(tsFileName, tsIndex);
                                    } else {
                                        throw new Error(alias + "('" + fileName + "') failed to compute tsIndex.");
                                    }
                                } else {
                                    return noMappingValue;
                                }
                            } else {
                                throw new Error(alias + "('" + fileName + "') unable to get source map.");
                            }
                        } else {
                            throw new Error(alias + "('" + fileName + "') unable to compute line and column from position index.");
                        }
                    } else {
                        throw new Error(alias + "('" + fileName + "') is not allowed.");
                    }
                };
                LanguageServiceDispatcher.prototype.synchronizeFiles = function () {
                    for (var _i = 0, _a = this.jsHost.getScriptFileNames(); _i < _a.length; _i++) {
                        var jsFileName = _a[_i];
                        var sourceVersion = this.jsHost.getScriptVersionNumber(jsFileName);
                        var tsFileName = getTargetFileName(jsFileName);
                        var targetVersion = this.tsHost.getScriptVersionNumber(tsFileName);
                        if (targetNeedsUpdate(sourceVersion, targetVersion)) {
                            var sourceText = this.jsHost.getScriptContent(jsFileName);
                            this.tsHost.setScriptContent(tsFileName, sourceText);
                        }
                    }
                    var pyLS = this.ensurePythonLanguageService();
                    for (var _b = 0, _c = this.pyHost.getScriptFileNames(); _b < _c.length; _b++) {
                        var pyFileName = _c[_b];
                        var sourceVersion = this.pyHost.getScriptVersionNumber(pyFileName);
                        var tsFileName = getTargetFileName(pyFileName);
                        var targetVersion = this.tsHost.getScriptVersionNumber(tsFileName);
                        if (targetNeedsUpdate(sourceVersion, targetVersion)) {
                            var sourceText = this.pyHost.getScriptContent(pyFileName);
                            var _d = typhon_typescript_1.transpileModule(sourceText),
                                code = _d.code,
                                sourceMap = _d.sourceMap;
                            this.tsHost.setScriptContent(tsFileName, code);
                            pyLS.setSourceMap(pyFileName, sourceMap);
                        }
                    }
                };
                LanguageServiceDispatcher.prototype.outputFiles = function (fileName) {
                    if (isTypeScriptFileName(fileName)) {
                        var tsLS = this.ensureTypeScriptLanguageService();
                        var program = tsLS.getProgram();
                        var sourceFile = program.getSourceFile(fileName);
                        sourceFile.moduleName = systemModuleName('./', fileName, 'js');
                        var output = transpileModule_1.transpileModule(program, sourceFile, this.tsHost.getCustomTransformers());
                        var outputFiles = [];
                        if (output.outputText) {
                            outputFiles.push({ name: systemModuleName(void 0, fileName, 'js'), text: output.outputText, writeByteOrderMark: void 0 });
                        }
                        if (output.sourceMapText) {
                            outputFiles.push({ name: systemModuleName(void 0, fileName, 'js.map'), text: output.sourceMapText, writeByteOrderMark: void 0 });
                        }
                        return outputFiles;
                    } else if (isJavaScriptFileName(fileName)) {
                        return this.outputFiles(getTargetFileName(fileName));
                    } else if (isPythonFileName(fileName)) {
                        return this.outputFiles(getTargetFileName(fileName));
                    } else {
                        console.warn("getOutputFiles('" + fileName + "') is not allowed.");
                        return [];
                    }
                };
                return LanguageServiceDispatcher;
            }();
            exports_1("LanguageServiceDispatcher", LanguageServiceDispatcher);
            (function (DiagnosticCategory) {
                DiagnosticCategory[DiagnosticCategory["Warning"] = 0] = "Warning";
                DiagnosticCategory[DiagnosticCategory["Error"] = 1] = "Error";
                DiagnosticCategory[DiagnosticCategory["Message"] = 2] = "Message";
            })(DiagnosticCategory || (DiagnosticCategory = {}));
            exports_1("DiagnosticCategory", DiagnosticCategory);
        }
    };
});
System.register("src/mode/typescript/LanguageServiceEvents.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var EVENT_APPLY_DELTA, EVENT_DEFAULT_LIB_CONTENT, EVENT_ENSURE_MODULE_MAPPING, EVENT_GET_COMPLETIONS_AT_POSITION, EVENT_GET_DEFINITION_AT_POSITION, EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT, EVENT_GET_OUTPUT_FILES, EVENT_GET_SCRIPT_CONTENT, EVENT_GET_SEMANTIC_ERRORS, EVENT_GET_SYNTAX_ERRORS, EVENT_GET_LINT_ERRORS, EVENT_GET_QUICK_INFO_AT_POSITION, EVENT_REMOVE_MODULE_MAPPING, EVENT_REMOVE_SCRIPT, EVENT_SET_MODULE_KIND, EVENT_SET_OPERATOR_OVERLOADING, EVENT_SET_SCRIPT_CONTENT, EVENT_SET_SCRIPT_TARGET, EVENT_SET_TRACE, EVENT_SET_TS_CONFIG;
    return {
        setters: [],
        execute: function () {
            exports_1("EVENT_APPLY_DELTA", EVENT_APPLY_DELTA = 'applyDelta');
            exports_1("EVENT_DEFAULT_LIB_CONTENT", EVENT_DEFAULT_LIB_CONTENT = 'defaultLibContent');
            exports_1("EVENT_ENSURE_MODULE_MAPPING", EVENT_ENSURE_MODULE_MAPPING = 'ensureModuleMapping');
            exports_1("EVENT_GET_COMPLETIONS_AT_POSITION", EVENT_GET_COMPLETIONS_AT_POSITION = 'getCompletionsAtPosition');
            exports_1("EVENT_GET_DEFINITION_AT_POSITION", EVENT_GET_DEFINITION_AT_POSITION = 'getDefinitionAtPosition');
            exports_1("EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT", EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT = 'getFormattingEditsForDocument');
            exports_1("EVENT_GET_OUTPUT_FILES", EVENT_GET_OUTPUT_FILES = 'getOutputFiles');
            exports_1("EVENT_GET_SCRIPT_CONTENT", EVENT_GET_SCRIPT_CONTENT = 'getScriptContent');
            exports_1("EVENT_GET_SEMANTIC_ERRORS", EVENT_GET_SEMANTIC_ERRORS = 'getSemanticErrors');
            exports_1("EVENT_GET_SYNTAX_ERRORS", EVENT_GET_SYNTAX_ERRORS = 'getSyntaxErrors');
            exports_1("EVENT_GET_LINT_ERRORS", EVENT_GET_LINT_ERRORS = 'getLintErrors');
            exports_1("EVENT_GET_QUICK_INFO_AT_POSITION", EVENT_GET_QUICK_INFO_AT_POSITION = 'getQuickInfoAtPosition');
            exports_1("EVENT_REMOVE_MODULE_MAPPING", EVENT_REMOVE_MODULE_MAPPING = 'removeModuleMapping');
            exports_1("EVENT_REMOVE_SCRIPT", EVENT_REMOVE_SCRIPT = 'removeScript');
            exports_1("EVENT_SET_MODULE_KIND", EVENT_SET_MODULE_KIND = 'setModuleKind');
            exports_1("EVENT_SET_OPERATOR_OVERLOADING", EVENT_SET_OPERATOR_OVERLOADING = 'setOperatorOverloading');
            exports_1("EVENT_SET_SCRIPT_CONTENT", EVENT_SET_SCRIPT_CONTENT = 'setScriptContent');
            exports_1("EVENT_SET_SCRIPT_TARGET", EVENT_SET_SCRIPT_TARGET = 'setScriptTarget');
            exports_1("EVENT_SET_TRACE", EVENT_SET_TRACE = 'setTrace');
            exports_1("EVENT_SET_TS_CONFIG", EVENT_SET_TS_CONFIG = 'setTsConfig');
        }
    };
});
System.register("src/mode/typescript/LanguageServiceHelpers.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function changedCompilerSettings(oldSettings, newSettings) {
        if (oldSettings.allowJs !== newSettings.allowJs) {
            return true;
        }
        if (oldSettings.allowSyntheticDefaultImports !== newSettings.allowSyntheticDefaultImports) {
            return true;
        }
        if (oldSettings.allowUnreachableCode !== newSettings.allowUnreachableCode) {
            return true;
        }
        if (oldSettings.allowUnusedLabels !== newSettings.allowUnusedLabels) {
            return true;
        }
        if (oldSettings.alwaysStrict !== newSettings.alwaysStrict) {
            return true;
        }
        if (oldSettings.baseUrl !== newSettings.baseUrl) {
            return true;
        }
        if (oldSettings.charset !== newSettings.charset) {
            return true;
        }
        if (oldSettings.declaration !== newSettings.declaration) {
            return true;
        }
        if (oldSettings.declarationDir !== newSettings.declarationDir) {
            return true;
        }
        if (oldSettings.disableSizeLimit !== newSettings.disableSizeLimit) {
            return true;
        }
        if (oldSettings.downlevelIteration !== newSettings.downlevelIteration) {
            return true;
        }
        if (oldSettings.emitBOM !== newSettings.emitBOM) {
            return true;
        }
        if (oldSettings.emitDecoratorMetadata !== newSettings.emitDecoratorMetadata) {
            return true;
        }
        if (oldSettings.experimentalDecorators !== newSettings.experimentalDecorators) {
            return true;
        }
        if (oldSettings.forceConsistentCasingInFileNames !== newSettings.forceConsistentCasingInFileNames) {
            return true;
        }
        if (oldSettings.importHelpers !== newSettings.importHelpers) {
            return true;
        }
        if (oldSettings.inlineSourceMap !== newSettings.inlineSourceMap) {
            return true;
        }
        if (oldSettings.inlineSources !== newSettings.inlineSources) {
            return true;
        }
        if (oldSettings.isolatedModules !== newSettings.isolatedModules) {
            return true;
        }
        if (oldSettings.jsx !== newSettings.jsx) {
            return true;
        }
        if (oldSettings.jsxFactory !== newSettings.jsxFactory) {
            return true;
        }
        if (oldSettings.lib !== newSettings.lib) {
            return true;
        }
        if (oldSettings.locale !== newSettings.locale) {
            return true;
        }
        if (oldSettings.mapRoot !== newSettings.mapRoot) {
            return true;
        }
        if (oldSettings.maxNodeModuleJsDepth !== newSettings.maxNodeModuleJsDepth) {
            return true;
        }
        if (oldSettings.module !== newSettings.module) {
            return true;
        }
        if (oldSettings.moduleResolution !== newSettings.moduleResolution) {
            return true;
        }
        if (oldSettings.newLine !== newSettings.newLine) {
            return true;
        }
        if (oldSettings.noEmit !== newSettings.noEmit) {
            return true;
        }
        if (oldSettings.noEmitHelpers !== newSettings.noEmitHelpers) {
            return true;
        }
        if (oldSettings.noEmitOnError !== newSettings.noEmitOnError) {
            return true;
        }
        if (oldSettings.noErrorTruncation !== newSettings.noErrorTruncation) {
            return true;
        }
        if (oldSettings.noFallthroughCasesInSwitch !== newSettings.noFallthroughCasesInSwitch) {
            return true;
        }
        if (oldSettings.noImplicitAny !== newSettings.noImplicitAny) {
            return true;
        }
        if (oldSettings.noImplicitReturns !== newSettings.noImplicitReturns) {
            return true;
        }
        if (oldSettings.noImplicitThis !== newSettings.noImplicitThis) {
            return true;
        }
        if (oldSettings.noImplicitUseStrict !== newSettings.noImplicitUseStrict) {
            return true;
        }
        if (oldSettings.noLib !== newSettings.noLib) {
            return true;
        }
        if (oldSettings.noResolve !== newSettings.noResolve) {
            return true;
        }
        if (oldSettings.noUnusedLocals !== newSettings.noUnusedLocals) {
            return true;
        }
        if (oldSettings.noUnusedParameters !== newSettings.noUnusedParameters) {
            return true;
        }
        if (oldSettings.operatorOverloading !== newSettings.operatorOverloading) {
            return true;
        }
        if (oldSettings.out !== newSettings.out) {
            return true;
        }
        if (oldSettings.outDir !== newSettings.outDir) {
            return true;
        }
        if (oldSettings.outFile !== newSettings.outFile) {
            return true;
        }
        if (oldSettings.paths !== newSettings.paths) {
            return true;
        }
        if (oldSettings.preserveConstEnums !== newSettings.preserveConstEnums) {
            return true;
        }
        if (oldSettings.project !== newSettings.project) {
            return true;
        }
        if (oldSettings.reactNamespace !== newSettings.reactNamespace) {
            return true;
        }
        if (oldSettings.removeComments !== newSettings.removeComments) {
            return true;
        }
        if (oldSettings.rootDir !== newSettings.rootDir) {
            return true;
        }
        if (oldSettings.rootDirs !== newSettings.rootDirs) {
            return true;
        }
        if (oldSettings.skipDefaultLibCheck !== newSettings.skipDefaultLibCheck) {
            return true;
        }
        if (oldSettings.skipLibCheck !== newSettings.skipLibCheck) {
            return true;
        }
        if (oldSettings.sourceMap !== newSettings.souceMap) {
            return true;
        }
        if (oldSettings.sourceRoot !== newSettings.sourceRoot) {
            return true;
        }
        if (oldSettings.strict !== newSettings.strict) {
            return true;
        }
        if (oldSettings.strictNullChecks !== newSettings.strictNullChecks) {
            return true;
        }
        if (oldSettings.suppressExcessPropertyErrors !== newSettings.suppressExcessPropertyErrors) {
            return true;
        }
        if (oldSettings.suppressImplicitAnyIndexErrors !== newSettings.suppressImplicitAnyIndexErrors) {
            return true;
        }
        if (oldSettings.target !== newSettings.target) {
            return true;
        }
        if (oldSettings.traceResolution !== newSettings.traceResolution) {
            return true;
        }
        if (oldSettings.typeRoots !== newSettings.typeRoots) {
            return true;
        }
        return false;
    }
    exports_1("changedCompilerSettings", changedCompilerSettings);
    function compilerJsxEmitFromTsConfig(jsx, defaultJsx) {
        if (jsx) {
            switch (jsx) {
                case 'none':
                    {
                        return ts.JsxEmit.None;
                    }
                case 'preserve':
                    {
                        return ts.JsxEmit.Preserve;
                    }
                case 'react':
                    {
                        return ts.JsxEmit.React;
                    }
                case 'react-native':
                    {
                        return ts.JsxEmit.ReactNative;
                    }
                default:
                    {
                        throw new Error("Unrecognized jsx: " + jsx);
                    }
            }
        } else {
            return defaultJsx;
        }
    }
    exports_1("compilerJsxEmitFromTsConfig", compilerJsxEmitFromTsConfig);
    function compilerModuleKindFromTsConfig(moduleKind) {
        moduleKind = moduleKind.toLowerCase();
        switch (moduleKind) {
            case 'amd':
                {
                    return ts.ModuleKind.AMD;
                }
            case 'commonjs':
                {
                    return ts.ModuleKind.CommonJS;
                }
            case 'es2015':
                {
                    return ts.ModuleKind.ES2015;
                }
            case 'none':
                {
                    return ts.ModuleKind.None;
                }
            case 'system':
                {
                    return ts.ModuleKind.System;
                }
            case 'umd':
                {
                    return ts.ModuleKind.UMD;
                }
            default:
                {
                    throw new Error("Unrecognized ModuleKind: " + moduleKind);
                }
        }
    }
    exports_1("compilerModuleKindFromTsConfig", compilerModuleKindFromTsConfig);
    function compilerScriptTargetFromTsConfig(scriptTarget) {
        scriptTarget = scriptTarget.toLowerCase();
        switch (scriptTarget) {
            case 'es2015':
                {
                    return ts.ScriptTarget.ES2015;
                }
            case 'es2016':
                {
                    return ts.ScriptTarget.ES2016;
                }
            case 'es2017':
                {
                    return ts.ScriptTarget.ES2017;
                }
            case 'es3':
                {
                    return ts.ScriptTarget.ES3;
                }
            case 'es5':
                {
                    return ts.ScriptTarget.ES5;
                }
            case 'esnext':
                {
                    return ts.ScriptTarget.ESNext;
                }
            case 'latest':
                {
                    return ts.ScriptTarget.Latest;
                }
            default:
                {
                    throw new Error("Unrecognized ScriptTarget: " + scriptTarget);
                }
        }
    }
    exports_1("compilerScriptTargetFromTsConfig", compilerScriptTargetFromTsConfig);
    function compilerOptionsFromTsConfig(settings, operatorOverloading) {
        var compilerOptions = {};
        compilerOptions.allowJs = settings.allowJs;
        compilerOptions.declaration = settings.declaration;
        compilerOptions.emitDecoratorMetadata = settings.emitDecoratorMetadata;
        compilerOptions.experimentalDecorators = settings.experimentalDecorators;
        compilerOptions.jsx = compilerJsxEmitFromTsConfig(settings.jsx, ts.JsxEmit.React);
        compilerOptions.module = compilerModuleKindFromTsConfig(settings.module);
        compilerOptions.noImplicitAny = settings.noImplicitAny;
        compilerOptions.noImplicitReturns = settings.noImplicitReturns;
        compilerOptions.noImplicitThis = settings.noImplicitThis;
        compilerOptions.noUnusedLocals = settings.noUnusedLocals;
        compilerOptions.noUnusedParameters = settings.noUnusedParameters;
        compilerOptions.operatorOverloading = operatorOverloading;
        compilerOptions.preserveConstEnums = settings.preserveConstEnums;
        compilerOptions.removeComments = settings.removeComments;
        compilerOptions.sourceMap = settings.sourceMap;
        compilerOptions.strictNullChecks = settings.strictNullChecks;
        compilerOptions.suppressImplicitAnyIndexErrors = settings.suppressImplicitAnyIndexErrors;
        compilerOptions.target = compilerScriptTargetFromTsConfig(settings.target);
        compilerOptions.traceResolution = settings.traceResolution;
        return compilerOptions;
    }
    exports_1("compilerOptionsFromTsConfig", compilerOptionsFromTsConfig);
    function tsConfigJsxEmitFromCompilerOptions(jsx) {
        switch (jsx) {
            case ts.JsxEmit.None:
                {
                    return 'none';
                }
            case ts.JsxEmit.Preserve:
                {
                    return 'preserve';
                }
            case ts.JsxEmit.React:
                {
                    return 'react';
                }
            case ts.JsxEmit.ReactNative:
                {
                    return 'react-native';
                }
            default:
                {
                    throw new Error("Unrecognized " + jsx + ": JsxEmit");
                }
        }
    }
    exports_1("tsConfigJsxEmitFromCompilerOptions", tsConfigJsxEmitFromCompilerOptions);
    function tsConfigModuleKindFromCompilerOptions(moduleKind, defaultValue) {
        if (typeof moduleKind !== 'undefined') {
            switch (moduleKind) {
                case ts.ModuleKind.AMD:
                    {
                        return 'amd';
                    }
                case ts.ModuleKind.CommonJS:
                    {
                        return 'commonjs';
                    }
                case ts.ModuleKind.ES2015:
                    {
                        return 'es2015';
                    }
                case ts.ModuleKind.None:
                    {
                        return 'none';
                    }
                case ts.ModuleKind.System:
                    {
                        return 'system';
                    }
                case ts.ModuleKind.UMD:
                    {
                        return 'umd';
                    }
                default:
                    {
                        throw new Error("Unrecognized " + moduleKind + ": ModuleKind");
                    }
            }
        } else {
            return defaultValue;
        }
    }
    exports_1("tsConfigModuleKindFromCompilerOptions", tsConfigModuleKindFromCompilerOptions);
    function tsConfigScriptTargetFromCompilerOptions(scriptTarget, defaultValue) {
        if (typeof scriptTarget !== 'undefined') {
            switch (scriptTarget) {
                case ts.ScriptTarget.ES2015:
                    {
                        return 'es2015';
                    }
                case ts.ScriptTarget.ES2016:
                    {
                        return 'es2016';
                    }
                case ts.ScriptTarget.ES2017:
                    {
                        return 'es2017';
                    }
                case ts.ScriptTarget.ES3:
                    {
                        return 'es3';
                    }
                case ts.ScriptTarget.ES5:
                    {
                        return 'es5';
                    }
                case ts.ScriptTarget.ESNext:
                    {
                        return 'esnext';
                    }
                case ts.ScriptTarget.Latest:
                    {
                        return 'latest';
                    }
                default:
                    {
                        throw new Error("Unrecognized " + scriptTarget + ": ScriptTarget");
                    }
            }
        } else {
            return defaultValue;
        }
    }
    exports_1("tsConfigScriptTargetFromCompilerOptions", tsConfigScriptTargetFromCompilerOptions);
    function tsConfigFromCompilerOptions(options) {
        var tsConfig = {
            allowJs: options.allowJs,
            declaration: options.declaration,
            emitDecoratorMetadata: options.emitDecoratorMetadata,
            experimentalDecorators: options.experimentalDecorators,
            jsx: tsConfigJsxEmitFromCompilerOptions(ts.JsxEmit.React),
            module: tsConfigModuleKindFromCompilerOptions(options.module, 'system'),
            noImplicitAny: options.noImplicitAny,
            noImplicitReturns: options.noImplicitReturns,
            noImplicitThis: options.noImplicitThis,
            noUnusedLocals: options.noUnusedLocals,
            noUnusedParameters: options.noUnusedParameters,
            preserveConstEnums: options.preserveConstEnums,
            removeComments: options.removeComments,
            sourceMap: options.sourceMap,
            strictNullChecks: options.strictNullChecks,
            suppressImplicitAnyIndexErrors: options.suppressImplicitAnyIndexErrors,
            target: tsConfigScriptTargetFromCompilerOptions(options.target, 'es5'),
            traceResolution: options.traceResolution
        };
        return tsConfig;
    }
    exports_1("tsConfigFromCompilerOptions", tsConfigFromCompilerOptions);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("src/workers/LanguageServiceWorker.js", ["../mode/typescript/DefaultLanguageServiceHost", "../mode/typescript/LanguageServiceDispatcher", "../mode/typescript/LanguageServiceEvents", "../mode/typescript/LanguageServiceHelpers"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var DefaultLanguageServiceHost_1, LanguageServiceDispatcher_1, LanguageServiceEvents_1, LanguageServiceEvents_2, LanguageServiceEvents_3, LanguageServiceEvents_4, LanguageServiceEvents_5, LanguageServiceEvents_6, LanguageServiceEvents_7, LanguageServiceEvents_8, LanguageServiceEvents_9, LanguageServiceEvents_10, LanguageServiceEvents_11, LanguageServiceEvents_12, LanguageServiceEvents_13, LanguageServiceEvents_14, LanguageServiceEvents_15, LanguageServiceEvents_16, LanguageServiceEvents_17, LanguageServiceEvents_18, LanguageServiceEvents_19, LanguageServiceEvents_20, LanguageServiceHelpers_1, LanguageServiceHelpers_2, LanguageServiceWorker;
    return {
        setters: [function (DefaultLanguageServiceHost_1_1) {
            DefaultLanguageServiceHost_1 = DefaultLanguageServiceHost_1_1;
        }, function (LanguageServiceDispatcher_1_1) {
            LanguageServiceDispatcher_1 = LanguageServiceDispatcher_1_1;
        }, function (LanguageServiceEvents_1_1) {
            LanguageServiceEvents_1 = LanguageServiceEvents_1_1;
            LanguageServiceEvents_2 = LanguageServiceEvents_1_1;
            LanguageServiceEvents_3 = LanguageServiceEvents_1_1;
            LanguageServiceEvents_4 = LanguageServiceEvents_1_1;
            LanguageServiceEvents_5 = LanguageServiceEvents_1_1;
            LanguageServiceEvents_6 = LanguageServiceEvents_1_1;
            LanguageServiceEvents_7 = LanguageServiceEvents_1_1;
            LanguageServiceEvents_8 = LanguageServiceEvents_1_1;
            LanguageServiceEvents_9 = LanguageServiceEvents_1_1;
            LanguageServiceEvents_10 = LanguageServiceEvents_1_1;
            LanguageServiceEvents_11 = LanguageServiceEvents_1_1;
            LanguageServiceEvents_12 = LanguageServiceEvents_1_1;
            LanguageServiceEvents_13 = LanguageServiceEvents_1_1;
            LanguageServiceEvents_14 = LanguageServiceEvents_1_1;
            LanguageServiceEvents_15 = LanguageServiceEvents_1_1;
            LanguageServiceEvents_16 = LanguageServiceEvents_1_1;
            LanguageServiceEvents_17 = LanguageServiceEvents_1_1;
            LanguageServiceEvents_18 = LanguageServiceEvents_1_1;
            LanguageServiceEvents_19 = LanguageServiceEvents_1_1;
            LanguageServiceEvents_20 = LanguageServiceEvents_1_1;
        }, function (LanguageServiceHelpers_1_1) {
            LanguageServiceHelpers_1 = LanguageServiceHelpers_1_1;
            LanguageServiceHelpers_2 = LanguageServiceHelpers_1_1;
        }],
        execute: function () {
            LanguageServiceWorker = function () {
                function LanguageServiceWorker(sender) {
                    var _this = this;
                    this.sender = sender;
                    this.trace = false;
                    this.traceB = false;
                    this.jsLSHost = new DefaultLanguageServiceHost_1.DefaultLanguageServiceHost();
                    this.pyLSHost = new DefaultLanguageServiceHost_1.DefaultLanguageServiceHost();
                    this.tsLSHost = new DefaultLanguageServiceHost_1.DefaultLanguageServiceHost();
                    this.dispatcher = new LanguageServiceDispatcher_1.LanguageServiceDispatcher(this.jsLSHost, this.pyLSHost, this.tsLSHost);
                    sender.on(LanguageServiceEvents_17.EVENT_SET_TRACE, function (message) {
                        var _a = message.data,
                            trace = _a.trace,
                            callbackId = _a.callbackId;
                        try {
                            var newTrace = trace;
                            var oldTrace = _this.trace;
                            _this.trace = newTrace;
                            _this.resolve(LanguageServiceEvents_17.EVENT_SET_TRACE, oldTrace, callbackId);
                        } catch (err) {
                            _this.reject(LanguageServiceEvents_17.EVENT_SET_TRACE, err, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_2.EVENT_DEFAULT_LIB_CONTENT, function (message) {
                        var _a = message.data,
                            content = _a.content,
                            callbackId = _a.callbackId;
                        try {
                            if (_this.traceB) {
                                console.log(LanguageServiceEvents_2.EVENT_DEFAULT_LIB_CONTENT + "(" + _this.dispatcher.getDefaultLibFileName({}) + ")");
                            }
                            var added = _this.dispatcher.setScriptContent(_this.dispatcher.getDefaultLibFileName({}), content);
                            _this.resolve(LanguageServiceEvents_2.EVENT_DEFAULT_LIB_CONTENT, added, callbackId);
                        } catch (reason) {
                            _this.reject(LanguageServiceEvents_2.EVENT_DEFAULT_LIB_CONTENT, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_3.EVENT_ENSURE_MODULE_MAPPING, function (message) {
                        var _a = message.data,
                            moduleName = _a.moduleName,
                            fileName = _a.fileName,
                            callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(LanguageServiceEvents_3.EVENT_ENSURE_MODULE_MAPPING + "(" + moduleName + "=>" + fileName + ")");
                            }
                            var previousFileName = _this.dispatcher.ensureModuleMapping(moduleName, fileName);
                            _this.resolve(LanguageServiceEvents_3.EVENT_ENSURE_MODULE_MAPPING, previousFileName, callbackId);
                        } catch (reason) {
                            _this.reject(LanguageServiceEvents_3.EVENT_ENSURE_MODULE_MAPPING, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_10.EVENT_GET_SCRIPT_CONTENT, function (message) {
                        var _a = message.data,
                            fileName = _a.fileName,
                            callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(LanguageServiceEvents_10.EVENT_GET_SCRIPT_CONTENT + "(" + fileName + ")");
                            }
                            var content = _this.dispatcher.getScriptContent(fileName);
                            _this.resolve(LanguageServiceEvents_10.EVENT_GET_SCRIPT_CONTENT, content, callbackId);
                        } catch (reason) {
                            _this.reject(LanguageServiceEvents_10.EVENT_GET_SCRIPT_CONTENT, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_19.EVENT_SET_SCRIPT_CONTENT, function (message) {
                        var _a = message.data,
                            fileName = _a.fileName,
                            content = _a.content,
                            callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(LanguageServiceEvents_19.EVENT_SET_SCRIPT_CONTENT + "(" + fileName + ")");
                                console.log(content);
                            }
                            var added = _this.dispatcher.setScriptContent(fileName, content);
                            _this.resolve(LanguageServiceEvents_19.EVENT_SET_SCRIPT_CONTENT, added, callbackId);
                        } catch (reason) {
                            _this.reject(LanguageServiceEvents_19.EVENT_SET_SCRIPT_CONTENT, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_1.EVENT_APPLY_DELTA, function (message) {
                        var _a = message.data,
                            fileName = _a.fileName,
                            delta = _a.delta,
                            callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(LanguageServiceEvents_1.EVENT_APPLY_DELTA + "(" + fileName + ", " + JSON.stringify(delta) + ")");
                            }
                            var version = _this.dispatcher.applyDelta(fileName, delta);
                            _this.resolve(LanguageServiceEvents_1.EVENT_APPLY_DELTA, version, callbackId);
                        } catch (reason) {
                            _this.reject(LanguageServiceEvents_1.EVENT_APPLY_DELTA, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_13.EVENT_REMOVE_MODULE_MAPPING, function (message) {
                        var _a = message.data,
                            moduleName = _a.moduleName,
                            callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(LanguageServiceEvents_13.EVENT_REMOVE_MODULE_MAPPING + "(" + moduleName + ")");
                            }
                            var mappedFileName = _this.dispatcher.removeModuleMapping(moduleName);
                            _this.resolve(LanguageServiceEvents_13.EVENT_REMOVE_MODULE_MAPPING, mappedFileName, callbackId);
                        } catch (reason) {
                            _this.reject(LanguageServiceEvents_13.EVENT_REMOVE_MODULE_MAPPING, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_20.EVENT_REMOVE_SCRIPT, function (message) {
                        var _a = message.data,
                            fileName = _a.fileName,
                            callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(LanguageServiceEvents_20.EVENT_REMOVE_SCRIPT + "(" + fileName + ")");
                            }
                            var removed = _this.dispatcher.removeScript(fileName);
                            _this.resolve(LanguageServiceEvents_20.EVENT_REMOVE_SCRIPT, removed, callbackId);
                        } catch (reason) {
                            _this.reject(LanguageServiceEvents_20.EVENT_REMOVE_SCRIPT, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_14.EVENT_SET_MODULE_KIND, function (message) {
                        var _a = message.data,
                            moduleKind = _a.moduleKind,
                            callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(LanguageServiceEvents_14.EVENT_SET_MODULE_KIND + "(" + moduleKind + ")");
                            }
                            _this.tsLSHost.moduleKind = moduleKind;
                            _this.resolve(LanguageServiceEvents_14.EVENT_SET_MODULE_KIND, _this.tsLSHost.moduleKind, callbackId);
                        } catch (reason) {
                            _this.reject(LanguageServiceEvents_14.EVENT_SET_MODULE_KIND, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_15.EVENT_SET_OPERATOR_OVERLOADING, function (message) {
                        var _a = message.data,
                            operatorOverloading = _a.operatorOverloading,
                            callbackId = _a.callbackId;
                        try {
                            if (_this.traceB) {
                                console.log(LanguageServiceEvents_15.EVENT_SET_OPERATOR_OVERLOADING + "(" + operatorOverloading + ")");
                            }
                            var oldValue = _this.setOperatorOverloading(operatorOverloading);
                            _this.resolve(LanguageServiceEvents_15.EVENT_SET_OPERATOR_OVERLOADING, oldValue, callbackId);
                        } catch (reason) {
                            _this.reject(LanguageServiceEvents_15.EVENT_SET_OPERATOR_OVERLOADING, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_16.EVENT_SET_SCRIPT_TARGET, function (message) {
                        var _a = message.data,
                            scriptTarget = _a.scriptTarget,
                            callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(LanguageServiceEvents_16.EVENT_SET_SCRIPT_TARGET + "(" + scriptTarget + ")");
                            }
                            _this.tsLSHost.scriptTarget = scriptTarget;
                            _this.resolve(LanguageServiceEvents_16.EVENT_SET_SCRIPT_TARGET, _this.tsLSHost.scriptTarget, callbackId);
                        } catch (reason) {
                            _this.reject(LanguageServiceEvents_16.EVENT_SET_SCRIPT_TARGET, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_18.EVENT_SET_TS_CONFIG, function (message) {
                        var _a = message.data,
                            settings = _a.settings,
                            callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(LanguageServiceEvents_18.EVENT_SET_TS_CONFIG + "(" + JSON.stringify(settings) + ")");
                            }
                            try {
                                var operatorOverloading = _this.dispatcher.isOperatorOverloadingEnabled();
                                var compilerOptions = LanguageServiceHelpers_1.compilerOptionsFromTsConfig(settings, operatorOverloading);
                                _this.dispatcher.setCompilationSettings(compilerOptions);
                                var updatedSettings = LanguageServiceHelpers_2.tsConfigFromCompilerOptions(_this.dispatcher.getCompilationSettings());
                                _this.resolve(LanguageServiceEvents_18.EVENT_SET_TS_CONFIG, updatedSettings, callbackId);
                            } catch (e) {
                                _this.reject(LanguageServiceEvents_18.EVENT_SET_TS_CONFIG, e, callbackId);
                            }
                        } catch (reason) {
                            _this.reject(LanguageServiceEvents_18.EVENT_SET_TS_CONFIG, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_12.EVENT_GET_SYNTAX_ERRORS, function (message) {
                        var _a = message.data,
                            fileName = _a.fileName,
                            callbackId = _a.callbackId;
                        try {
                            if (_this.traceB) {
                                console.log(LanguageServiceEvents_12.EVENT_GET_SYNTAX_ERRORS + "(" + fileName + ")");
                            }
                            var diagnostics = _this.dispatcher.getSyntaxErrors(fileName);
                            _this.resolve(LanguageServiceEvents_12.EVENT_GET_SYNTAX_ERRORS, diagnostics, callbackId);
                        } catch (reason) {
                            _this.reject(LanguageServiceEvents_12.EVENT_GET_SYNTAX_ERRORS, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_11.EVENT_GET_SEMANTIC_ERRORS, function (message) {
                        var _a = message.data,
                            fileName = _a.fileName,
                            callbackId = _a.callbackId;
                        try {
                            if (_this.traceB) {
                                console.log(LanguageServiceEvents_11.EVENT_GET_SEMANTIC_ERRORS + "(" + fileName + ")");
                            }
                            var diagnostics = _this.dispatcher.getSemanticErrors(fileName);
                            _this.resolve(LanguageServiceEvents_11.EVENT_GET_SEMANTIC_ERRORS, diagnostics, callbackId);
                        } catch (reason) {
                            _this.reject(LanguageServiceEvents_11.EVENT_GET_SEMANTIC_ERRORS, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_4.EVENT_GET_COMPLETIONS_AT_POSITION, function (message) {
                        var _a = message.data,
                            fileName = _a.fileName,
                            position = _a.position,
                            prefix = _a.prefix,
                            callbackId = _a.callbackId;
                        try {
                            if (_this.traceB) {
                                console.log(LanguageServiceEvents_4.EVENT_GET_COMPLETIONS_AT_POSITION + "(" + fileName + ", " + position + ", " + prefix + ")");
                            }
                            if (typeof position !== 'number' || isNaN(position)) {
                                throw new Error("position must be a number and not NaN");
                            }
                            var completions = _this.dispatcher.getCompletionsAtPosition(fileName, position);
                            _this.resolve(LanguageServiceEvents_4.EVENT_GET_COMPLETIONS_AT_POSITION, completions, callbackId);
                        } catch (reason) {
                            _this.reject(LanguageServiceEvents_4.EVENT_GET_COMPLETIONS_AT_POSITION, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_5.EVENT_GET_DEFINITION_AT_POSITION, function (message) {
                        var _a = message.data,
                            fileName = _a.fileName,
                            position = _a.position,
                            callbackId = _a.callbackId;
                        try {
                            if (_this.traceB) {
                                console.log(LanguageServiceEvents_5.EVENT_GET_DEFINITION_AT_POSITION + "(" + fileName + ", " + position + ")");
                            }
                            if (typeof position !== 'number' || isNaN(position)) {
                                throw new Error("position must be a number and not NaN");
                            }
                            var definitionInfo = _this.dispatcher.getDefinitionAtPosition(fileName, position);
                            _this.resolve(LanguageServiceEvents_5.EVENT_GET_DEFINITION_AT_POSITION, definitionInfo, callbackId);
                        } catch (reason) {
                            _this.reject(LanguageServiceEvents_5.EVENT_GET_DEFINITION_AT_POSITION, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_9.EVENT_GET_QUICK_INFO_AT_POSITION, function (message) {
                        var _a = message.data,
                            fileName = _a.fileName,
                            position = _a.position,
                            callbackId = _a.callbackId;
                        try {
                            if (_this.traceB) {
                                console.log(LanguageServiceEvents_9.EVENT_GET_QUICK_INFO_AT_POSITION + "(" + fileName + ", " + position + ")");
                            }
                            if (typeof position !== 'number' || isNaN(position)) {
                                throw new Error("position must be a number and not NaN");
                            }
                            var quickInfo = _this.dispatcher.getQuickInfoAtPosition(fileName, position);
                            _this.resolve(LanguageServiceEvents_9.EVENT_GET_QUICK_INFO_AT_POSITION, quickInfo, callbackId);
                        } catch (reason) {
                            _this.reject(LanguageServiceEvents_9.EVENT_GET_QUICK_INFO_AT_POSITION, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_8.EVENT_GET_OUTPUT_FILES, function (message) {
                        var _a = message.data,
                            fileName = _a.fileName,
                            callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(LanguageServiceEvents_8.EVENT_GET_OUTPUT_FILES + "(" + fileName + ")");
                            }
                            var version = _this.dispatcher.getScriptVersionNumber(fileName);
                            var outputFiles = _this.dispatcher.getOutputFiles(fileName);
                            _this.resolve(LanguageServiceEvents_8.EVENT_GET_OUTPUT_FILES, { fileName: fileName, outputFiles: outputFiles, version: version }, callbackId);
                        } catch (reason) {
                            _this.reject(LanguageServiceEvents_8.EVENT_GET_OUTPUT_FILES, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_6.EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT, function (message) {
                        var _a = message.data,
                            fileName = _a.fileName,
                            settings = _a.settings,
                            callbackId = _a.callbackId;
                        try {
                            if (_this.traceB) {
                                console.log(LanguageServiceEvents_6.EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT + "(" + fileName + ", " + settings + ")");
                            }
                            if (typeof settings !== 'object') {
                                throw new Error("settings must be an object and not NaN");
                            }
                            var textChanges = _this.dispatcher.getFormattingEditsForDocument(fileName, settings);
                            _this.resolve(LanguageServiceEvents_6.EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT, textChanges, callbackId);
                        } catch (reason) {
                            _this.reject(LanguageServiceEvents_6.EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_7.EVENT_GET_LINT_ERRORS, function (message) {
                        var _a = message.data,
                            fileName = _a.fileName,
                            configuration = _a.configuration,
                            callbackId = _a.callbackId;
                        try {
                            if (_this.traceB) {
                                console.log(LanguageServiceEvents_7.EVENT_GET_LINT_ERRORS + "(" + fileName + ")");
                                console.log(LanguageServiceEvents_7.EVENT_GET_LINT_ERRORS + "(" + JSON.stringify(configuration, null, 2) + ")");
                            }
                            var diagnostics = _this.dispatcher.getLintErrors(fileName, configuration);
                            _this.resolve(LanguageServiceEvents_7.EVENT_GET_LINT_ERRORS, diagnostics, callbackId);
                        } catch (reason) {
                            _this.reject(LanguageServiceEvents_7.EVENT_GET_LINT_ERRORS, reason, callbackId);
                        }
                    });
                }
                LanguageServiceWorker.prototype.isOperatorOverloadingEnabled = function () {
                    return this.dispatcher.isOperatorOverloadingEnabled();
                };
                LanguageServiceWorker.prototype.setOperatorOverloading = function (operatorOverloading) {
                    return this.dispatcher.setOperatorOverloading(operatorOverloading);
                };
                LanguageServiceWorker.prototype.resolve = function (eventName, value, callbackId) {
                    if (this.trace) {
                        if (eventName !== LanguageServiceEvents_17.EVENT_SET_TRACE) {
                            console.log("resolve(" + eventName + ", " + JSON.stringify(value, null, 2) + ")");
                        }
                    }
                    this.sender.resolve(eventName, value, callbackId);
                };
                LanguageServiceWorker.prototype.reject = function (eventName, reason, callbackId) {
                    if (this.trace) {
                        console.warn("reject(" + eventName + ", " + reason + ")");
                    }
                    this.sender.reject(eventName, reason, callbackId);
                };
                return LanguageServiceWorker;
            }();
            exports_1("LanguageServiceWorker", LanguageServiceWorker);
        }
    };
});
System.register("src/lib/event_emitter.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var stopPropagation, preventDefault, EventEmitterClass;
    return {
        setters: [],
        execute: function () {
            stopPropagation = function () {
                this.propagationStopped = true;
            };
            preventDefault = function () {
                this.defaultPrevented = true;
            };
            EventEmitterClass = function () {
                function EventEmitterClass() {}
                EventEmitterClass.prototype._dispatchEvent = function (eventName, event) {
                    if (!this._eventRegistry) {
                        this._eventRegistry = {};
                    }
                    if (!this._defaultHandlers) {
                        this._defaultHandlers = {};
                    }
                    var listeners = this._eventRegistry[eventName] || [];
                    var defaultHandler = this._defaultHandlers[eventName];
                    if (!listeners.length && !defaultHandler) return;
                    if (typeof event !== "object" || !event) {
                        event = {};
                    }
                    if (!event.type) {
                        event.type = eventName;
                    }
                    if (!event.stopPropagation) {
                        event.stopPropagation = stopPropagation;
                    }
                    if (!event.preventDefault) {
                        event.preventDefault = preventDefault;
                    }
                    listeners = listeners.slice();
                    for (var i = 0; i < listeners.length; i++) {
                        listeners[i](event, this);
                        if (event['propagationStopped']) {
                            break;
                        }
                    }
                    if (defaultHandler && !event.defaultPrevented) {
                        return defaultHandler(event, this);
                    }
                };
                EventEmitterClass.prototype._emit = function (eventName, event) {
                    return this._dispatchEvent(eventName, event);
                };
                EventEmitterClass.prototype._signal = function (eventName, e) {
                    var listeners = (this._eventRegistry || {})[eventName];
                    if (!listeners) {
                        return;
                    }
                    listeners = listeners.slice();
                    for (var i = 0, iLength = listeners.length; i < iLength; i++) {
                        listeners[i](e, this);
                    }
                };
                EventEmitterClass.prototype.once = function (eventName, callback) {
                    var _self = this;
                    if (callback) {
                        this.addEventListener(eventName, function newCallback() {
                            _self.removeEventListener(eventName, newCallback);
                            callback.apply(null, arguments);
                        });
                    }
                };
                EventEmitterClass.prototype.setDefaultHandler = function (eventName, callback) {
                    var handlers = this._defaultHandlers;
                    if (!handlers) {
                        handlers = this._defaultHandlers = { _disabled_: {} };
                    }
                    if (handlers[eventName]) {
                        var old = handlers[eventName];
                        var disabled = handlers._disabled_[eventName];
                        if (!disabled) handlers._disabled_[eventName] = disabled = [];
                        disabled.push(old);
                        var i = disabled.indexOf(callback);
                        if (i !== -1) disabled.splice(i, 1);
                    }
                    handlers[eventName] = callback;
                };
                EventEmitterClass.prototype.removeDefaultHandler = function (eventName, callback) {
                    var handlers = this._defaultHandlers;
                    if (!handlers) {
                        return;
                    }
                    var disabled = handlers._disabled_[eventName];
                    if (handlers[eventName] === callback) {
                        if (disabled) this.setDefaultHandler(eventName, disabled.pop());
                    } else if (disabled) {
                        var i = disabled.indexOf(callback);
                        if (i !== -1) disabled.splice(i, 1);
                    }
                };
                EventEmitterClass.prototype.addEventListener = function (eventName, callback, capturing) {
                    this._eventRegistry = this._eventRegistry || {};
                    var listeners = this._eventRegistry[eventName];
                    if (!listeners) {
                        listeners = this._eventRegistry[eventName] = [];
                    }
                    if (listeners.indexOf(callback) === -1) {
                        if (capturing) {
                            listeners.unshift(callback);
                        } else {
                            listeners.push(callback);
                        }
                    }
                    return callback;
                };
                EventEmitterClass.prototype.on = function (eventName, callback, capturing) {
                    return this.addEventListener(eventName, callback, capturing);
                };
                EventEmitterClass.prototype.removeEventListener = function (eventName, callback) {
                    this._eventRegistry = this._eventRegistry || {};
                    var listeners = this._eventRegistry[eventName];
                    if (!listeners) return;
                    var index = listeners.indexOf(callback);
                    if (index !== -1) {
                        listeners.splice(index, 1);
                    }
                };
                EventEmitterClass.prototype.off = function (eventName, callback) {
                    return this.removeEventListener(eventName, callback);
                };
                EventEmitterClass.prototype.removeAllListeners = function (eventName) {
                    if (this._eventRegistry) this._eventRegistry[eventName] = [];
                };
                return EventEmitterClass;
            }();
            exports_1("EventEmitterClass", EventEmitterClass);
        }
    };
});
System.register("src/lib/Sender.js", ["./event_emitter"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var __moduleName = context_1 && context_1.id;
    var event_emitter_1, Sender;
    return {
        setters: [function (event_emitter_1_1) {
            event_emitter_1 = event_emitter_1_1;
        }],
        execute: function () {
            Sender = function (_super) {
                __extends(Sender, _super);
                function Sender(target) {
                    var _this = _super.call(this) || this;
                    _this.target = target;
                    return _this;
                }
                Sender.prototype.callback = function (message, callbackId) {
                    this.target.postMessage({ type: "call", id: callbackId, data: message });
                };
                Sender.prototype.emit = function (eventName, message) {
                    this.target.postMessage({ type: "event", name: eventName, data: message });
                };
                Sender.prototype.resolve = function (eventName, value, callbackId) {
                    var response = { value: value, callbackId: callbackId };
                    this.emit(eventName, response);
                };
                Sender.prototype.reject = function (eventName, reason, callbackId) {
                    var response = { err: "" + reason, callbackId: callbackId };
                    this.emit(eventName, response);
                };
                return Sender;
            }(event_emitter_1.EventEmitterClass);
            exports_1("Sender", Sender);
        }
    };
});
System.register("stemcstudio-workspace.js", ["./src/workers/LanguageServiceWorker", "./src/lib/Sender"], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    var LanguageServiceWorker_1, Sender_1, main;
    return {
        setters: [function (LanguageServiceWorker_1_1) {
            LanguageServiceWorker_1 = LanguageServiceWorker_1_1;
        }, function (Sender_1_1) {
            Sender_1 = Sender_1_1;
        }],
        execute: function () {
            main = {
                get LanguageServiceWorker() {
                    return LanguageServiceWorker_1.LanguageServiceWorker;
                },
                get Sender() {
                    return Sender_1.Sender;
                }
            };
            exports_1("default", main);
        }
    };
});