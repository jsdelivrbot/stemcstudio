import { createHTMLDivElement } from "../../lib/dom";
import { Editor } from '../../../editor/Editor';
// cssText = require("../../requirejs/text!./settings_menu.css");
// dom.importCssString(cssText);

//
// body
//    |
//    -closer
//          |
//          -contentContainer <div style="top: 0px; right: 0px; bottom: 0px;"
//                          |
//                          -wrapper <div style="position: relative;">
//                          |      |
//                          |      -closeButton <div class='ace_closeButton'></div>
//                          |
//                          -contentElement <div id='kbshortcutmenu'>...</div>
//

/**
 * Generates an overlay for displaying menus.
 * The overlay is an absolutely positioned div.
 * Pressing the Esc key dismisses the overlay.
 * 
 * contentElement is any element which may be presented inside a div.
 * top is an absolute position value.
 * right is an absolute position value.
 * bottom is an absolute position value.
 * left is an absolute position value.
 */
export function overlayPage(editor: Editor, contentElement: Node, top: string | number, right: string | number, bottom: string | number, left: string | number | null, callback: (err: any) => any): void {

    const topStyle = top ? 'top: ' + top + ';' : '';
    const bottomStyle = bottom ? 'bottom: ' + bottom + ';' : '';
    const rightStyle = right ? 'right: ' + right + ';' : '';
    const leftStyle = left ? 'left: ' + left + ';' : '';

    let closer: HTMLDivElement | null = document.createElement('div');
    const contentContainer = document.createElement('div');

    /**
     * If the Esc key is pressed, we delegate to the click handler.
     */
    function documentEscListener(e: KeyboardEvent) {
        if (e.keyCode === 27) {
            if (closer) {
                // What sort of event do we get? 
                closer.click();
            }
        }
    }

    closer.style.cssText = 'margin: 0; padding: 0; ' +
        'position: fixed; top:0; bottom:0; left:0; right:0;' +
        'z-index: 9990; ' +
        'background-color: rgba(0, 0, 0, 0.3);';

    /**
     * This is the canonical handler for removing the overlay.
     */
    function clickListener() {
        document.removeEventListener('keydown', documentEscListener);
        if (closer) {
            closer.removeEventListener('click', clickListener);
            const body = <Node>closer.parentNode;
            body.removeChild(closer);
            closer = null;
        }
        editor.focus();
        callback(null);
    }

    closer.addEventListener('click', clickListener);
    // delegate to click closer if Esc key is pressed.
    document.addEventListener('keydown', documentEscListener);

    // The arguments determine the location of the contentContainer.
    contentContainer.style.cssText = topStyle + rightStyle + bottomStyle + leftStyle;
    contentContainer.addEventListener('click', function (e: MouseEvent) {
        e.stopPropagation();
    });

    const wrapper = createHTMLDivElement();
    wrapper.style.position = "relative";

    const closeButton = createHTMLDivElement();
    closeButton.className = "ace_closeButton";
    closeButton.addEventListener('click', function () {
        if (closer) {
            closer.click();
        }
    });

    wrapper.appendChild(closeButton);
    contentContainer.appendChild(wrapper);

    contentContainer.appendChild(contentElement);
    closer.appendChild(contentContainer);
    document.body.appendChild(closer);
    editor.blur();
}
