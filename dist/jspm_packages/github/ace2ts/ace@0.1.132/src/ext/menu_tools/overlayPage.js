System.register(["../../lib/dom"], function(exports_1) {
    'use strict';
    var dom_1;
    function overlayPage(editor, contentElement, top, right, bottom, left) {
        var topStyle = top ? 'top: ' + top + ';' : '';
        var bottomStyle = bottom ? 'bottom: ' + bottom + ';' : '';
        var rightStyle = right ? 'right: ' + right + ';' : '';
        var leftStyle = left ? 'left: ' + left + ';' : '';
        var closer = document.createElement('div');
        var contentContainer = document.createElement('div');
        function documentEscListener(e) {
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
        document.addEventListener('keydown', documentEscListener);
        contentContainer.style.cssText = topStyle + rightStyle + bottomStyle + leftStyle;
        contentContainer.addEventListener('click', function (e) {
            e.stopPropagation();
        });
        var wrapper = dom_1.createHTMLDivElement();
        wrapper.style.position = "relative";
        var closeButton = dom_1.createHTMLDivElement();
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
    exports_1("default", overlayPage);
    return {
        setters:[
            function (dom_1_1) {
                dom_1 = dom_1_1;
            }],
        execute: function() {
        }
    }
});
//# sourceMappingURL=overlayPage.js.map