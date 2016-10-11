// Generates an overlay for displaying menus. The overlay is an absolutely

import {createHTMLDivElement} from "../../lib/dom";
import Editor from '../../Editor';
// var cssText = require("../../requirejs/text!./settings_menu.css");
// dom.importCssString(cssText);

/**
 * Generates an overlay for displaying menus. The overlay is an absolutely
 *  positioned div.
 * @param {DOMElement} contentElement Any element which may be presented inside
 *  a div.
 * @param {string|number} top absolute position value.
 * @param {string|number} right absolute position value.
 * @param {string|number} bottom absolute position value.
 * @param {string|number} left absolute position value.
 */
export default function overlayPage(editor: Editor, contentElement: Node, top: string | number, right: string | number, bottom: string | number, left: string | number) {

    var topStyle = top ? 'top: ' + top + ';' : '';
    var bottomStyle = bottom ? 'bottom: ' + bottom + ';' : '';
    var rightStyle = right ? 'right: ' + right + ';' : '';
    var leftStyle = left ? 'left: ' + left + ';' : '';

    var closer = document.createElement('div');
    var contentContainer = document.createElement('div');

    function documentEscListener(e: KeyboardEvent) {
        if (e.keyCode === 27) {
            closer.click();
        }
    }

    closer.style.cssText = 'margin: 0; padding: 0; ' +
        'position: fixed; top:0; bottom:0; left:0; right:0;' +
        'z-index: 9990; ' +
        'background-color: rgba(0, 0, 0, 0.3);';
    closer.addEventListener('click', function () {
        document.removeEventListener('keydown', documentEscListener);
        closer.parentNode.removeChild(closer);
        editor.focus();
        closer = null;
    });
    // click closer if esc key is pressed
    document.addEventListener('keydown', documentEscListener);

    contentContainer.style.cssText = topStyle + rightStyle + bottomStyle + leftStyle;
    contentContainer.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    var wrapper = createHTMLDivElement();
    wrapper.style.position = "relative";

    var closeButton = createHTMLDivElement();
    closeButton.className = "ace_closeButton";
    closeButton.addEventListener('click', function () {
        closer.click();
    });

    wrapper.appendChild(closeButton);
    contentContainer.appendChild(wrapper);

    contentContainer.appendChild(contentElement);
    closer.appendChild(contentContainer);
    document.body.appendChild(closer);
    editor.blur();
}
