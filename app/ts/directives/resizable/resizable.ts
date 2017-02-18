import * as angular from 'angular';
import ResizableScope from './ResizableScope';

//
// TODO: I separated the mouse handling from touch handling in order to avoid the instanceof TouchEvent test.
// Why? Firefox doesn't know TouchEvent giving the console error 'ReferenceError: TouchEvent is not defined'.
// It also breaks the resizer in Firefox.
// This could be fixed by an existence check of window['TouchEvent'] but that may not be optimal.
// DRY: This leaves some duplicate code. When removing this technical debt, be wary of making common code out
// of logic that is superficially similar. For example, try to take advantage of the differences between mouse and
// touch handling rather than forcing them to do the same thing.
//
export default function () {
    let toCall: () => any;

    // This function is used to regulate the resizing events that are broadcast.
    function throttle(fun: () => any) {
        if (toCall === void 0) {
            toCall = fun;
            setTimeout(function () {
                toCall();
                toCall = void 0;
            }, 100);
        }
        else {
            toCall = fun;
        }
    }

    return {
        restrict: 'AE',
        scope: {
            rDirections: "=",
            rCenteredX: "=",
            rCenteredY: "=",
            rWidth: "=",
            rHeight: "=",
            rFlex: "=",
            rGrabber: "@",
            rDisabled: '@',
            rNoThrottle: '='
        },
        link: function (scope: ResizableScope, element: angular.IAugmentedJQuery, attr: angular.IAttributes) {
            const flexBasis =
                'flexBasis' in document.documentElement.style ? 'flexBasis' :
                    'webkitFlexBasis' in document.documentElement.style ? 'webkitFlexBasis' :
                        'msFlexPreferredSize' in document.documentElement.style ? 'msFlexPreferredSize' : 'flexBasis';

            // Register watchers on width and height attributes if they are set.
            scope.$watch('rWidth', function (value) {
                element[0].style[scope.rFlex ? flexBasis : 'width'] = scope.rWidth + 'px';
            });
            scope.$watch('rHeight', function (value) {
                element[0].style[scope.rFlex ? flexBasis : 'height'] = scope.rHeight + 'px';
            });

            element.addClass('resizable');

            const style = window.getComputedStyle(element[0], null);

            /**
             * The style width property value captured at dragStart.
             */
            let w: number;

            /**
             * The style height property value captured at dragStart.
             */
            let h: number;

            const dir: string[] = scope.rDirections || ['right'];

            const vx: number = scope.rCenteredX ? 2 : 1; // if centered double velocity
            const vy: number = scope.rCenteredY ? 2 : 1; // if centered double velocity

            /**
             * The innerHTML structure of the synthesized grabber div element.
             */
            const inner = scope.rGrabber ? scope.rGrabber : '<span></span>';

            /**
             * Initialized to clientX or clientY according to the drag axis.
             */
            let start: number;

            /**
             * 'top', 'right', 'bottom', or 'left'.
             * Records the dragging direction which is current at dragStart.
             */
            let dragDir: string;

            /**
             * 'x' or 'y' according to the direction which may be left, right, top or bottom.
             */
            let axis: string;

            const info: { id: string; height: (boolean | number); width: (boolean | number) } = { id: void 0, width: false, height: false };

            /**
             * `updateInfo` is called for all mouse events.
             * It appears to be recording the state of the resized element.
             */
            const updateInfo = function () {
                info.width = false;
                info.height = false;
                if (axis === 'x') {
                    info.width = scope.rFlex ? parseInt(element[0].style.flexBasis, 10) : parseInt(element[0].style.width, 10);
                }
                else {
                    info.height = scope.rFlex ? parseInt(element[0].style.flexBasis, 10) : parseInt(element[0].style.height, 10);
                }
                info.id = element[0].id;
            };

            const getTouchClientX = function (e: TouchEvent) {
                return e.touches[0].clientX;
            };

            const getTouchClientY = function (e: TouchEvent) {
                return e.touches[0].clientY;
            };

            const draggingMouse = function (e: MouseEvent) {
                /**
                 * `offset` holds the movement (in pixels) since dragStart in the appropriate axis.
                 */
                const offset = axis === 'x' ? start - e.clientX : start - e.clientY;
                switch (dragDir) {
                    case 'top':
                        if (scope.rFlex) {
                            element[0].style.flexBasis = h + (offset * vy) + 'px';
                        }
                        else {
                            element[0].style.height = h + (offset * vy) + 'px';
                        }
                        break;
                    case 'right':
                        if (scope.rFlex) {
                            element[0].style.flexGrow = '0';
                            element[0].style.flexBasis = w - (offset * vx) + 'px';
                        }
                        else {
                            element[0].style.width = w - (offset * vx) + 'px';
                        }
                        break;
                    case 'bottom':
                        if (scope.rFlex) {
                            element[0].style.flexBasis = h - (offset * vy) + 'px';
                        }
                        else {
                            element[0].style.height = h - (offset * vy) + 'px';
                        }
                        break;
                    case 'left':
                        if (scope.rFlex) {
                            element[0].style.flexBasis = w + (offset * vx) + 'px';
                        }
                        else {
                            element[0].style.width = w + (offset * vx) + 'px';
                        }
                        break;
                }
                updateInfo();
                function resizingEmit() {
                    scope.$emit('angular-resizable.resizing', info);
                }
                if (scope.rNoThrottle) {
                    resizingEmit();
                } else {
                    throttle(resizingEmit);
                }
            };

            const draggingTouch = function (e: TouchEvent) {
                /**
                 * `offset` holds the movement (in pixels) since dragStart in the appropriate axis.
                 */
                const offset = axis === 'x' ? start - getTouchClientX(e) : start - getTouchClientY(e);
                switch (dragDir) {
                    case 'top':
                        if (scope.rFlex) {
                            element[0].style.flexBasis = h + (offset * vy) + 'px';
                        }
                        else {
                            element[0].style.height = h + (offset * vy) + 'px';
                        }
                        break;
                    case 'right':
                        if (scope.rFlex) {
                            element[0].style.flexGrow = '0';
                            element[0].style.flexBasis = w - (offset * vx) + 'px';
                        }
                        else {
                            element[0].style.width = w - (offset * vx) + 'px';
                        }
                        break;
                    case 'bottom':
                        if (scope.rFlex) {
                            element[0].style.flexBasis = h - (offset * vy) + 'px';
                        }
                        else {
                            element[0].style.height = h - (offset * vy) + 'px';
                        }
                        break;
                    case 'left':
                        if (scope.rFlex) {
                            element[0].style.flexBasis = w + (offset * vx) + 'px';
                        }
                        else {
                            element[0].style.width = w + (offset * vx) + 'px';
                        }
                        break;
                }
                updateInfo();
                function resizingEmit() {
                    scope.$emit('angular-resizable.resizing', info);
                }
                if (scope.rNoThrottle) {
                    resizingEmit();
                } else {
                    throttle(resizingEmit);
                }
            };

            const dragMouseEnd = function (e: MouseEvent) {
                updateInfo();
                // Dispatch the event upwards through the scope hierarchy.
                scope.$emit("angular-resizable.resizeEnd", info);
                scope.$apply();
                document.removeEventListener('mouseup', dragMouseEnd, false);
                document.removeEventListener('mousemove', draggingMouse, false);
                element.removeClass('no-transition');
            };

            const dragTouchEnd = function (e: TouchEvent) {
                updateInfo();
                // Dispatch the event upwards through the scope hierarchy.
                scope.$emit("angular-resizable.resizeEnd", info);
                scope.$apply();
                document.removeEventListener('touchend', dragTouchEnd, false);
                document.removeEventListener('touchmove', draggingTouch, false);
                element.removeClass('no-transition');
            };

            const dragMouseStart = function (e: MouseEvent, direction: string) {
                dragDir = direction;
                axis = (dragDir === 'left' || dragDir === 'right') ? 'x' : 'y';
                start = (axis === 'x') ? e.clientX : e.clientY;

                w = parseInt(style.getPropertyValue("width"), 10);
                h = parseInt(style.getPropertyValue("height"), 10);

                // Prevent transition while dragging.
                element.addClass('no-transition');

                document.addEventListener('mouseup', dragMouseEnd, false);
                document.addEventListener('mousemove', draggingMouse, false);

                // Disable highlighting while dragging.
                if (e.stopPropagation) {
                    e.stopPropagation();
                }
                if (e.preventDefault) {
                    e.preventDefault();
                }
                e.cancelBubble = true;
                e.returnValue = false;

                updateInfo();

                scope.$emit("angular-resizable.resizeStart", info);
                scope.$apply();
            };

            const dragTouchStart = function (e: TouchEvent, direction: string) {
                dragDir = direction;
                axis = (dragDir === 'left' || dragDir === 'right') ? 'x' : 'y';
                start = (axis === 'x') ? getTouchClientX(e) : getTouchClientY(e);

                w = parseInt(style.getPropertyValue("width"), 10);
                h = parseInt(style.getPropertyValue("height"), 10);

                // Prevent transition while dragging.
                element.addClass('no-transition');

                document.addEventListener('touchend', dragTouchEnd, false);
                document.addEventListener('touchmove', draggingTouch, false);

                // Disable highlighting while dragging.
                if (e.stopPropagation) {
                    e.stopPropagation();
                }
                if (e.preventDefault) {
                    e.preventDefault();
                }
                e.cancelBubble = true;
                e.returnValue = false;

                updateInfo();

                scope.$emit("angular-resizable.resizeStart", info);
                scope.$apply();
            };

            for (let i = 0, iLength = dir.length; i < iLength; i++) {
                (function () {
                    const grabber = document.createElement('div');
                    const direction = dir[i];

                    // Add class for styling purposes.
                    grabber.setAttribute('class', 'rg-' + dir[i]);
                    grabber.innerHTML = inner;
                    element[0].appendChild(grabber);
                    const mouseDown = function (e: MouseEvent) {
                        const disabled = (scope.rDisabled === 'true');
                        if (!disabled && (e.which === 1)) {
                            dragMouseStart(e, direction);
                        }
                    };
                    const touchStart = function (e: TouchEvent) {
                        const disabled = (scope.rDisabled === 'true');
                        if (!disabled && (e.touches)) {
                            dragTouchStart(e, direction);
                        }
                    };
                    grabber.ondragstart = function (e: DragEvent) { return false; };
                    grabber.addEventListener('mousedown', mouseDown, false);
                    grabber.addEventListener('touchstart', touchStart, false);
                }());
            }
        }
    };
}
