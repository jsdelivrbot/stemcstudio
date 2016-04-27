/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

import { createElement } from "../lib/dom";
import { addListener, preventDefault, removeListener } from "../lib/event";
import { isMac, isOpera } from "../lib/useragent";

var AUTOSCROLL_DELAY = 200;
var SCROLL_CURSOR_DELAY = 200;
var SCROLL_CURSOR_HYSTERESIS = 5;

// FIXME: I think the issue may be that this is a mixin?

class DragdropHandler {
    // This is key: The event is not an ordinary mouse event.
    mousedownEvent: EditorMouseEvent;
    editor;
    $dragEnabled;
    cancelDrag;
    state;

    onDragStart(e: DragEvent) { };
    onDragEnd(e: DragEvent) { };
    onDragEnter(e: DragEvent) { };
    onDragLeave(e: DragEvent) { };
    onDragOver(e: DragEvent) { };
    onDrop(e: DragEvent) { };
    /**
     * We construct on a class defined in the Editor!
     * Does this class have to go in the same module as the Editor?
     */
    constructor(mouseHandler: MouseHandler) {

        var editor = mouseHandler.editor;

        var blankImage = <HTMLImageElement>createElement("img");
        // Safari crashes without image data
        blankImage.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
        if (isOpera)
            blankImage.style.cssText = "width:1px;height:1px;position:fixed;top:0;left:0;z-index:2147483647;opacity:0;";

        var exports = ["dragWait", "dragWaitEnd", "startDrag", "dragReadyEnd", "onMouseDrag"];

        exports.forEach(function(x) {
            mouseHandler[x] = this[x];
        }, this);
        editor.addEventListener("mousedown", this.onMouseDown.bind(mouseHandler));


        var mouseTarget = editor.container;
        var dragSelectionMarker, x, y;
        var timerId, range;
        var dragCursor, counter = 0;
        var dragOperation;
        var isInternal;
        var autoScrollStartTime;
        var cursorMovedTime;
        var cursorPointOnCaretMoved;

        this.onDragStart = function(e: DragEvent) {
            // webkit workaround, see this.onMouseDown
            if (this.cancelDrag || !mouseTarget.draggable) {
                var self = this;
                setTimeout(function() {
                    self.startSelect();
                    self.captureMouse(e);
                }, 0);
                return preventDefault(e);
            }
            range = editor.getSelectionRange();

            var dataTransfer = e.dataTransfer;
            dataTransfer.effectAllowed = editor.getReadOnly() ? "copy" : "copyMove";
            if (isOpera) {
                editor.container.appendChild(blankImage);
                // force layout
                blankImage.scrollTop = 0;
            }
            dataTransfer.setDragImage && dataTransfer.setDragImage(blankImage, 0, 0);
            if (isOpera) {
                editor.container.removeChild(blankImage);
            }
            // clear Opera garbage
            dataTransfer.clearData();
            dataTransfer.setData("Text", editor.session.getTextRange());

            isInternal = true;
            this.setState("drag");
        };

        this.onDragEnd = function(e: DragEvent) {
            mouseTarget.draggable = false;
            isInternal = false;
            this.setState(null);
            if (!editor.getReadOnly()) {
                var dropEffect = e.dataTransfer.dropEffect;
                if (!dragOperation && dropEffect == "move")
                    // text was dragged outside the editor
                    editor.session.remove(editor.getSelectionRange());
                editor.renderer.$cursorLayer.setBlinking(true);
            }
            this.editor.unsetStyle("ace_dragging");
        };

        this.onDragEnter = function(e: DragEvent) {
            if (editor.getReadOnly() || !canAccept(e.dataTransfer))
                return;
            x = e.clientX;
            y = e.clientY;
            if (!dragSelectionMarker)
                addDragMarker();
            counter++;
            // dataTransfer object does not save dropEffect across events on IE, so we store it in dragOperation
            e.dataTransfer.dropEffect = dragOperation = getDropEffect(e);
            return preventDefault(e);
        };

        this.onDragOver = function(e: DragEvent) {
            if (editor.getReadOnly() || !canAccept(e.dataTransfer))
                return;
            x = e.clientX;
            y = e.clientY;
            // Opera doesn't trigger dragenter event on drag start
            if (!dragSelectionMarker) {
                addDragMarker();
                counter++;
            }
            if (onMouseMoveTimer !== null)
                onMouseMoveTimer = null;

            e.dataTransfer.dropEffect = dragOperation = getDropEffect(e);
            return preventDefault(e);
        };

        this.onDragLeave = function(e: DragEvent) {
            counter--;
            if (counter <= 0 && dragSelectionMarker) {
                clearDragMarker();
                dragOperation = null;
                return preventDefault(e);
            }
        };

        this.onDrop = function(e: DragEvent) {
            if (!dragCursor)
                return;
            var dataTransfer = e.dataTransfer;
            if (isInternal) {
                switch (dragOperation) {
                    case "move":
                        if (range.contains(dragCursor.row, dragCursor.column)) {
                            // clear selection
                            range = {
                                start: dragCursor,
                                end: dragCursor
                            };
                        } else {
                            // move text
                            range = editor.moveText(range, dragCursor);
                        }
                        break;
                    case "copy":
                        // copy text
                        range = editor.moveText(range, dragCursor, true);
                        break;
                }
            } else {
                var dropData = dataTransfer.getData('Text');
                range = {
                    start: dragCursor,
                    end: editor.session.insert(dragCursor, dropData)
                };
                editor.focus();
                dragOperation = null;
            }
            clearDragMarker();
            return preventDefault(e);
        };

        addListener(mouseTarget, "dragstart", this.onDragStart.bind(mouseHandler));
        addListener(mouseTarget, "dragend", this.onDragEnd.bind(mouseHandler));
        addListener(mouseTarget, "dragenter", this.onDragEnter.bind(mouseHandler));
        addListener(mouseTarget, "dragover", this.onDragOver.bind(mouseHandler));
        addListener(mouseTarget, "dragleave", this.onDragLeave.bind(mouseHandler));
        addListener(mouseTarget, "drop", this.onDrop.bind(mouseHandler));

        function scrollCursorIntoView(cursor, prevCursor) {
            var now = Date.now();
            var vMovement = !prevCursor || cursor.row != prevCursor.row;
            var hMovement = !prevCursor || cursor.column != prevCursor.column;
            if (!cursorMovedTime || vMovement || hMovement) {
                editor.$blockScrolling += 1;
                editor.moveCursorToPosition(cursor);
                editor.$blockScrolling -= 1;
                cursorMovedTime = now;
                cursorPointOnCaretMoved = { x: x, y: y };
            } else {
                var distance = calcDistance(cursorPointOnCaretMoved.x, cursorPointOnCaretMoved.y, x, y);
                if (distance > SCROLL_CURSOR_HYSTERESIS) {
                    cursorMovedTime = null;
                } else if (now - cursorMovedTime >= SCROLL_CURSOR_DELAY) {
                    editor.renderer.scrollCursorIntoView();
                    cursorMovedTime = null;
                }
            }
        }

        function autoScroll(cursor, prevCursor) {
            var now = Date.now();
            var lineHeight = editor.renderer.layerConfig.lineHeight;
            var characterWidth = editor.renderer.layerConfig.characterWidth;
            var editorRect = editor.renderer.scroller.getBoundingClientRect();
            var offsets = {
                x: {
                    left: x - editorRect.left,
                    right: editorRect.right - x
                },
                y: {
                    top: y - editorRect.top,
                    bottom: editorRect.bottom - y
                }
            };
            var nearestXOffset = Math.min(offsets.x.left, offsets.x.right);
            var nearestYOffset = Math.min(offsets.y.top, offsets.y.bottom);
            var scrollCursor = { row: cursor.row, column: cursor.column };
            if (nearestXOffset / characterWidth <= 2) {
                scrollCursor.column += (offsets.x.left < offsets.x.right ? -3 : +2);
            }
            if (nearestYOffset / lineHeight <= 1) {
                scrollCursor.row += (offsets.y.top < offsets.y.bottom ? -1 : +1);
            }
            var vScroll = cursor.row != scrollCursor.row;
            var hScroll = cursor.column != scrollCursor.column;
            var vMovement = !prevCursor || cursor.row != prevCursor.row;
            if (vScroll || (hScroll && !vMovement)) {
                if (!autoScrollStartTime)
                    autoScrollStartTime = now;
                else if (now - autoScrollStartTime >= AUTOSCROLL_DELAY)
                    editor.renderer.scrollCursorIntoView(scrollCursor);
            } else {
                autoScrollStartTime = null;
            }
        }

        function onDragInterval() {
            var prevCursor = dragCursor;
            dragCursor = editor.renderer.screenToTextCoordinates(x, y);
            scrollCursorIntoView(dragCursor, prevCursor);
            autoScroll(dragCursor, prevCursor);
        }

        function addDragMarker() {
            range = editor.selection.toOrientedRange();
            dragSelectionMarker = editor.session.addMarker(range, "ace_selection", editor.getSelectionStyle());
            editor.clearSelection();
            if (editor.isFocused())
                editor.renderer.$cursorLayer.setBlinking(false);
            clearInterval(timerId);
            onDragInterval();
            timerId = setInterval(onDragInterval, 20);
            counter = 0;
            addListener(document, "mousemove", onMouseMove);
        }

        function clearDragMarker() {
            clearInterval(timerId);
            editor.session.removeMarker(dragSelectionMarker);
            dragSelectionMarker = null;
            editor.$blockScrolling += 1;
            editor.selection.fromOrientedRange(range);
            editor.$blockScrolling -= 1;
            if (editor.isFocused() && !isInternal)
                editor.renderer.$cursorLayer.setBlinking(!editor.getReadOnly());
            range = null;
            dragCursor = null;
            counter = 0;
            autoScrollStartTime = null;
            cursorMovedTime = null;
            removeListener(document, "mousemove", onMouseMove);
        }

        // sometimes other code on the page can stop dragleave event leaving editor stuck in the drag state
        var onMouseMoveTimer = null;
        function onMouseMove() {
            if (onMouseMoveTimer == null) {
                onMouseMoveTimer = setTimeout(function() {
                    if (onMouseMoveTimer != null && dragSelectionMarker)
                        clearDragMarker();
                }, 20);
            }
        }

        function canAccept(dataTransfer: DataTransfer) {
            var types = dataTransfer.types;
            return !types || Array.prototype.some.call(types, function(type) {
                return type == 'text/plain' || type == 'Text';
            });
        }

        function getDropEffect(e: DragEvent): string {
            var copyAllowed = ['copy', 'copymove', 'all', 'uninitialized'];
            var moveAllowed = ['move', 'copymove', 'linkmove', 'all', 'uninitialized'];

            var copyModifierState = isMac ? e.altKey : e.ctrlKey;

            // IE throws error while dragging from another app
            var effectAllowed = "uninitialized";
            try {
                effectAllowed = e.dataTransfer.effectAllowed.toLowerCase();
            } catch (e) { }
            var dropEffect = "none";

            if (copyModifierState && copyAllowed.indexOf(effectAllowed) >= 0)
                dropEffect = "copy";
            else if (moveAllowed.indexOf(effectAllowed) >= 0)
                dropEffect = "move";
            else if (copyAllowed.indexOf(effectAllowed) >= 0)
                dropEffect = "copy";

            return dropEffect;
        }
    }

    dragWait() {
        var interval = Date.now() - this.mousedownEvent.time;
        if (interval > this.editor.getDragDelay())
            this.startDrag();
    }

    dragWaitEnd() {
        var target = this.editor.container;
        target.draggable = false;
        this.startSelect(this.mousedownEvent.getDocumentPosition());
        this.selectEnd();
    }

    dragReadyEnd(e) {
        this.editor.renderer.$cursorLayer.setBlinking(!this.editor.getReadOnly());
        this.editor.unsetStyle("ace_dragging");
        this.dragWaitEnd();
    }

    startDrag() {
        this.cancelDrag = false;
        var target = this.editor.container;
        target.draggable = true;
        this.editor.renderer.$cursorLayer.setBlinking(false);
        this.editor.setStyle("ace_dragging");
        this.setState("dragReady");
    }

    onMouseDrag(e) {
        var target = this.editor.container;
        if (useragent.isIE && this.state == "dragReady") {
            // IE does not handle [draggable] attribute set after mousedown
            var distance = calcDistance(this.mousedownEvent.x, this.mousedownEvent.y, this.x, this.y);
            if (distance > 3)
                target.dragDrop();
        }
        if (this.state === "dragWait") {
            var distance = calcDistance(this.mousedownEvent.x, this.mousedownEvent.y, this.x, this.y);
            if (distance > 0) {
                target.draggable = false;
                this.startSelect(this.mousedownEvent.getDocumentPosition());
            }
        }
    }

    onMouseDown(e: MouseEvent) {
        if (!this.$dragEnabled)
            return;
        this.mousedownEvent = e;
        var editor = this.editor;

        var inSelection = e.inSelection();
        var button = e.getButton();
        var clickCount = e.domEvent.detail || 1;
        if (clickCount === 1 && button === 0 && inSelection) {
            if (e.editor.inMultiSelectMode && (e.getAccelKey() || e.getShiftKey()))
                return;
            this.mousedownEvent.time = Date.now();
            var eventTarget = e.domEvent.target || e.domEvent.srcElement;
            if ("unselectable" in eventTarget)
                eventTarget.unselectable = "on";
            if (editor.getDragDelay()) {
                // https://code.google.com/p/chromium/issues/detail?id=286700
                if (useragent.isWebKit) {
                    this.cancelDrag = true;
                    var mouseTarget = editor.container;
                    mouseTarget.draggable = true;
                }
                this.setState("dragWait");
            } else {
                this.startDrag();
            }
            this.captureMouse(e, this.onMouseDrag.bind(this));
            // TODO: a better way to prevent default handler without preventing browser default action
            e.defaultPrevented = true;
        }
    }
}

function calcDistance(ax, ay, bx, by) {
    return Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2));
}
