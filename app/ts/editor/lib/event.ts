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
import { FUNCTION_KEYS, KEY_MODS, MODIFIER_KEYS, PRINTABLE_KEYS } from './keys';
import { isChromeOS, isIE, isMac, isOldGecko, isOpera } from './useragent';

export interface ListenerTarget extends EventTarget {
}

/**
 * https://developer.apple.com/reference/webkit/domwheelevent/1420223-wheeldeltax
 */
interface DOMWheelEvent extends MouseWheelEvent {
    wheelX: number;
    wheelY: number;
    axis: number;
    HORIZONTAL_AXIS: number;
}

export function addListener(target: ListenerTarget, type: string, callback: EventListenerOrEventListenerObject, useCapture?: boolean) {
    if (target.addEventListener) {
        return target.addEventListener(type, callback, false);
    }
}

export function removeListener(target: ListenerTarget, type: string, callback: EventListenerOrEventListenerObject, useCapture?: boolean) {
    if (target.removeEventListener) {
        return target.removeEventListener(type, callback, false);
    }
}

/*
* Prevents propagation and clobbers the default action of the passed Event (standard DOM).
*/
export function stopEvent(e: Event): boolean {
    stopPropagation(e);
    preventDefault(e);
    return false;
}

/**
 * Calls the `stopPropagation` method (if it is defined).
 * If it is not defined, sets the `cancelBubble` property to `true`.
 */
export function stopPropagation(e: Event): void {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    else {
        e.cancelBubble = true;
    }
}

export function preventDefault(e: Event): void {
    // returnValue is no longer documented in typings.
    const RETURN_VALUE_DEPRECATED = 'returnValue';
    if (e.preventDefault) {
        e.preventDefault();
    }
    else if (e[RETURN_VALUE_DEPRECATED]) {
        e[RETURN_VALUE_DEPRECATED] = false;
    }
}

/*
 * @return {Number} 0 for left button, 1 for middle button, 2 for right button
 */
export function getButton(e: MouseEvent): number {
    if (e.type === "dblclick")
        return 0;
    if (e.type === "contextmenu" || (isMac && (e.ctrlKey && !e.altKey && !e.shiftKey)))
        return 2;

    // DOM Event
    if (e.preventDefault) {
        return e.button;
    }
    // legacy IE
    else {
        return { 1: 0, 2: 2, 4: 1 }[e.button];
    }
}

// FIXME: We should not be assuming the document as window.document!
/**
 * Returns a function which may be used to manually release the mouse.
 */
export function capture(unused: HTMLElement, acquireCaptureHandler: (event: MouseEvent) => void, releaseCaptureHandler: (event: MouseEvent) => void): (event: MouseEvent) => void {
    // FIXME: 'Document' is missing property 'onmouseleave' from 'HTMLElement'.
    const element: any = document;

    function releaseMouse(e: MouseEvent) {

        // It seems redundant and cumbersome to provide this event to both handlers?
        if (acquireCaptureHandler) {
            acquireCaptureHandler(e);
        }
        if (releaseCaptureHandler) {
            releaseCaptureHandler(e);
        }

        removeListener(element, "mousemove", acquireCaptureHandler, true);
        removeListener(element, "mouseup", releaseMouse, true);
        removeListener(element, "dragstart", releaseMouse, true);
    }

    addListener(element, "mousemove", acquireCaptureHandler, true);
    addListener(element, "mouseup", releaseMouse, true);
    addListener(element, "dragstart", releaseMouse, true);

    return releaseMouse;
}

/**
 * Adds a portable 'mousewheel' ['wheel','DOM MouseScroll'] listener to an element.
 */
export function addMouseWheelListener(element: HTMLElement, callback: (event: MouseWheelEvent) => void): void {
    if ("onmousewheel" in element) {
        addListener(element, "mousewheel", function (e: DOMWheelEvent) {
            const factor = 8;
            if (e.wheelDeltaX !== undefined) {
                e.wheelX = -e.wheelDeltaX / factor;
                e.wheelY = -e.wheelDeltaY / factor;
            }
            else {
                e.wheelX = 0;
                e.wheelY = -e.wheelDelta / factor;
            }
            callback(e);
        });
    }
    else if ("onwheel" in element) {
        addListener(element, "wheel", function wheel(e: DOMWheelEvent) {
            const factor = 0.35;
            switch (e.deltaMode) {
                case e.DOM_DELTA_PIXEL:
                    e.wheelX = e.deltaX * factor || 0;
                    e.wheelY = e.deltaY * factor || 0;
                    break;
                case e.DOM_DELTA_LINE:
                case e.DOM_DELTA_PAGE:
                    e.wheelX = (e.deltaX || 0) * 5;
                    e.wheelY = (e.deltaY || 0) * 5;
                    break;
            }
            callback(e);
        });
    }
    else {
        // TODO: Define interface for DOMMouseScroll.
        addListener(element, "DOMMouseScroll", function (e: DOMWheelEvent) {
            if (e.axis && e.axis === e.HORIZONTAL_AXIS) {
                e.wheelX = (e.detail || 0) * 5;
                e.wheelY = 0;
            }
            else {
                e.wheelX = 0;
                e.wheelY = (e.detail || 0) * 5;
            }
            callback(e);
        });
    }
}

export function addMultiMouseDownListener(el: ListenerTarget, timeouts: number[], eventHandler: Object, callbackName: string) {
    let clicks = 0;
    let startX: number;
    let startY: number;
    let timer: number | null;
    const eventNames = {
        2: "dblclick",
        3: "tripleclick",
        4: "quadclick"
    };

    addListener(el, "mousedown", function (e: MouseEvent) {
        if (getButton(e) !== 0) {
            clicks = 0;
        } else if (e.detail > 1) {
            clicks++;
            if (clicks > 4)
                clicks = 1;
        } else {
            clicks = 1;
        }
        if (isIE) {
            const isNewClick = Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5;
            if (!timer || isNewClick)
                clicks = 1;
            if (timer)
                clearTimeout(timer);
            timer = window.setTimeout(function () { timer = null; }, timeouts[clicks - 1] || 600);

            if (clicks === 1) {
                startX = e.clientX;
                startY = e.clientY;
            }
        }

        // TODO. This custom property is not part of MouseEvent.
        e['_clicks'] = clicks;

        eventHandler[callbackName]("mousedown", e);

        if (clicks > 4)
            clicks = 0;
        else if (clicks > 1)
            return eventHandler[callbackName](eventNames[clicks], e);
    });
}

const getModifierHash = isMac && isOpera && !("KeyboardEvent" in window)
    ? function (e: KeyboardEvent) {
        return 0 | (e.metaKey ? 1 : 0) | (e.altKey ? 2 : 0) | (e.shiftKey ? 4 : 0) | (e.ctrlKey ? 8 : 0);
    }
    : function (e: KeyboardEvent) {
        return 0 | (e.ctrlKey ? 1 : 0) | (e.altKey ? 2 : 0) | (e.shiftKey ? 4 : 0) | (e.metaKey ? 8 : 0);
    };

export function getModifierString(e: KeyboardEvent) {
    return KEY_MODS[getModifierHash(e)];
}

let pressedKeys: {
    [keyCode: number]: boolean | null;
    altGr: boolean | number;
} | null = null;

function resetPressedKeys(e: any) {
    pressedKeys = Object.create(null);
}

let ts = 0;

function normalizeCommandKeys(callback: (e: KeyboardEvent, hashId: number, keyCode: number) => any, e: KeyboardEvent, keyCode: number | null) {
    let hashId = getModifierHash(e);

    if (!isMac && pressedKeys) {
        if (pressedKeys[91] || pressedKeys[92])
            hashId |= 8;
        if (pressedKeys.altGr) {
            if ((3 & hashId) !== 3)
                pressedKeys.altGr = 0;
            else
                return;
        }
        if (keyCode === 18 || keyCode === 17) {
            if (keyCode === 17 && e.location === 1) {
                ts = e.timeStamp;
            } else if (keyCode === 18 && hashId === 3 && e.location === 2) {
                let dt = -ts;
                ts = e.timeStamp;
                dt += ts;
                if (dt < 3)
                    pressedKeys.altGr = true;
            }
        }
    }

    if (keyCode as number in MODIFIER_KEYS) {
        switch (MODIFIER_KEYS[keyCode as number]) {
            case "Alt":
                hashId = 2;
                break;
            case "Shift":
                hashId = 4;
                break;
            case "Ctrl":
                hashId = 1;
                break;
            default:
                hashId = 8;
                break;
        }
        keyCode = -1;
    }

    if (hashId & 8 && (keyCode === 91 || keyCode === 93)) {
        keyCode = -1;
    }

    if (!hashId && keyCode === 13) {
        if (e.location === 3) {
            callback(e, hashId, -keyCode);
            if (e.defaultPrevented)
                return;
        }
    }

    if (isChromeOS && hashId & 8) {
        callback(e, hashId, keyCode as number);
        if (e.defaultPrevented)
            return;
        else
            hashId &= ~8;
    }

    // If there is no hashId and the keyCode is not a function key, then
    // we don't call the callback as we don't handle a command key here
    // (it's a normal key/character input).
    if (!hashId && !(keyCode as number in FUNCTION_KEYS) && !(keyCode as number in PRINTABLE_KEYS)) {
        return false;
    }

    return callback(e, hashId, keyCode as number);
}

/**
 * A utility for adding listeners for keyboard events to produce hashId(s).
 * The hashId value is compatible with the KeyboardHandler which maps them onto commands.
 */
export function addCommandKeyListener(el: ListenerTarget, callback: (e: KeyboardEvent, hashId: number, keyCode: number) => any) {
    if (isOldGecko || (isOpera && !("KeyboardEvent" in window))) {
        // Old versions of Gecko aka. Firefox < 4.0 didn't repeat the keydown
        // event if the user pressed the key for a longer time. Instead, the
        // keydown event was fired once and later on only the keypress event.
        // To emulate the 'right' keydown behavior, the keyCode of the initial
        // keyDown event is stored and in the following keypress events the
        // stores keyCode is used to emulate a keyDown event.
        let lastKeyDownKeyCode: number | null = null;
        addListener(el, "keydown", function (e: KeyboardEvent) {
            lastKeyDownKeyCode = e.keyCode;
        });
        addListener(el, "keypress", function (e: KeyboardEvent) {
            return normalizeCommandKeys(callback, e, lastKeyDownKeyCode);
        });
    }
    else {
        let lastDefaultPrevented: boolean | null = null;

        addListener(el, "keydown", function (e: KeyboardEvent) {
            if (pressedKeys) {
                pressedKeys[e.keyCode] = true;
            }
            const result = normalizeCommandKeys(callback, e, e.keyCode);
            lastDefaultPrevented = e.defaultPrevented;
            return result;
        });

        addListener(el, 'keypress', function (e: KeyboardEvent) {
            if (lastDefaultPrevented && (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey)) {
                stopEvent(e);
                lastDefaultPrevented = null;
            }
        });

        addListener(el, 'keyup', function (e: KeyboardEvent) {
            if (pressedKeys) {
                pressedKeys[e.keyCode] = null;
            }
        });

        if (!pressedKeys) {
            pressedKeys = Object.create(null);
            addListener(window, 'focus', resetPressedKeys);
        }
    }
}

// FIXME: Conditional exports not supported by TypeScript or Harmony/ES6.
// declare const exports: any;
/*
if (window.postMessage && !isOldIE) {
    const postMessageId = 1;
    exports.nextTick = function(callback, win) {
        win = win || window;
        const messageName = "zero-timeout-message-" + postMessageId;
        addListener(win, "message", function listener(e) {
            if (e.data == messageName) {
                stopPropagation(e);
                removeListener(win, "message", listener);
                callback();
            }
        });
        // postMessage with "*" for targetOrigin is a security concern.
        win.postMessage(messageName, window.location.href);
    };
}
*/

let nextFrameCandidate: (callback: () => void, $window: Window) => void = window.requestAnimationFrame ||
    window['mozRequestAnimationFrame'] ||
    window['webkitRequestAnimationFrame'] ||
    window['msRequestAnimationFrame'] ||
    window['oRequestAnimationFrame'];

if (nextFrameCandidate) {
    nextFrameCandidate = nextFrameCandidate.bind(window);
}
else {
    nextFrameCandidate = function (callback) {
        setTimeout(callback, 17);
    };
}

/**
 * A backwards-compatible, browser-neutral, requestAnimationFrame.
 */
export const requestAnimationFrame: (callback: () => void, $window: Window) => void = nextFrameCandidate;
