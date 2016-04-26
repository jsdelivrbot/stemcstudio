import {} from "../lib/useragent";
import Editor from '../Editor';
import {} from '../lib/event';
import {
ClientLocation,
DIRECTION_VERTICAL,
Manager,
VectorE2
} from '../hammer/hammer';
import {PanRecognizer} from '../hammer/recognizers/pan';
import {} from '../hammer/recognizers/pinch';
import {} from '../hammer/recognizers/press';
import {} from '../hammer/recognizers/rotate';
import {} from '../hammer/recognizers/swipe';
import {TapRecognizer} from '../hammer/recognizers/tap';

// It seems that TypeScript 1.0.0 doesn't know about TouchEvent.
// This should motivate the upgrade of TypeScript and hacking for ACE.
export interface ITouch {
    clientX: number;
    clientY: number;
    pageX: number;
    pageY: number;
    screenX: number;
    screenY: number;
}

export interface ITouchEvent extends Event {
    type: string;
    touches: ITouch[];
}

export function touchManager(editor: Editor) {

    var target: HTMLDivElement = editor.renderer.getMouseEventTarget();
    var manager = new Manager(target);

    manager.add(new PanRecognizer('pan', true).setDirection(DIRECTION_VERTICAL).setThreshold(20));
    manager.add(new TapRecognizer('tap', true));

    manager.on('pan', function(movement: VectorE2) {
        editor.renderer.scrollBy(-movement.x, -movement.y);
    });

    manager.on('tap', function(event: ClientLocation) {
        var pos = editor.renderer.screenToTextCoordinates(event.clientX, event.clientY);

        pos.row = Math.max(0, Math.min(pos.row, editor.getSession().getLength() - 1));

        editor.moveCursorToPosition(pos);
        editor.renderer.scrollCursorIntoView();
        editor.focus();
    });

    return manager;
}
