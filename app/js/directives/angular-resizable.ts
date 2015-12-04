/// <reference path="../../../typings/angularjs/angular.d.ts" />
module angularResizable {
    export interface IResizableScope extends angular.IScope {
        rWidth: number;
        rHeight: number;
        rDirections: string[];
        rCenteredX: boolean;
        rCenteredY: boolean;
        rFlex: boolean;
        rGrabber: string;
    }
}

angular.module('angularResizable', [])
    .directive('resizable', function() {
        var toCall: () => any;

        // This function is used to regulate the resizing events that are broadcast.
        function throttle(fun: () => any) {
            if (toCall === void 0) {
                toCall = fun;
                setTimeout(function() {
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
                rGrabber: "@"
            },
            link: function(scope: angularResizable.IResizableScope, element: angular.IAugmentedJQuery, attr: angular.IAttributes) {
                
                // Register watchers on width and height attributes if they are set.
                scope.$watch('rWidth', function(value) {
                    element[0].style.width = scope.rWidth + 'px'
                })
                scope.$watch('rHeight', function(value) {
                    element[0].style.height = scope.rHeight + 'px'
                })

                element.addClass('resizable')

                var style = window.getComputedStyle(element[0], null)

                /**
                 * The style width property value captured at dragStart.
                 */
                var w: number

                /**
                 * The style height property value captured at dragStart.
                 */
                var h: number

                var dir: string[] = scope.rDirections

                var vx: number = scope.rCenteredX ? 2 : 1 // if centered double velocity
                var vy: number = scope.rCenteredY ? 2 : 1 // if centered double velocity

                /**
                 * The innerHTML structure of the synthesized grabber div element.
                 */
                var inner = scope.rGrabber ? scope.rGrabber : '<span></span>'

                /**
                 * Initialized to clientX or clientY according to the drag axis.
                 */
                var start: number

                /**
                 * 'top', 'right', 'bottom', or 'left'.
                 * Records the dragging direction which is current at dragStart.
                 */
                var dragDir: string

                /**
                 * 'x' or 'y' according to the direction which may be left, right, top or bottom.
                 */
                var axis: string
                var info: { id: string; height: (boolean | number); width: (boolean | number) } = { id: void 0, width: false, height: false }

                /**
                 * `updateInfo` is called for all mouse events.
                 * It appears to be recording the state of the resized element.
                 */
                var updateInfo = function() {
                    info.width = false
                    info.height = false
                    if (axis === 'x') {
                        info.width = scope.rFlex ? parseInt(element[0].style.flexBasis) : parseInt(element[0].style.width)
                    }
                    else {
                        info.height = scope.rFlex ? parseInt(element[0].style.flexBasis) : parseInt(element[0].style.height)
                    }
                    info.id = element[0].id
                }

                var dragging = function(e: MouseEvent) {
                    /**
                     * `offset` holds the movement (in pixels) since dragStart in the appropriate axis.
                     */
                    var offset = axis === 'x' ? start - e.clientX : start - e.clientY
                    switch (dragDir) {
                        case 'top':
                            if (scope.rFlex) {
                                element[0].style.flexBasis = h + (offset * vy) + 'px'
                            }
                            else {
                                element[0].style.height = h + (offset * vy) + 'px'
                            }
                            break
                        case 'right':
                            if (scope.rFlex) {
                                element[0].style.flexGrow = '0'
                                element[0].style.flexBasis = w - (offset * vx) + 'px'
                            }
                            else {
                                element[0].style.width = w - (offset * vx) + 'px'
                            }
                            break
                        case 'bottom':
                            if (scope.rFlex) {
                                element[0].style.flexBasis = h - (offset * vy) + 'px'
                            }
                            else {
                                element[0].style.height = h - (offset * vy) + 'px'
                            }
                            break;
                        case 'left':
                            if (scope.rFlex) {
                                element[0].style.flexBasis = w + (offset * vx) + 'px'
                            }
                            else {
                                element[0].style.width = w + (offset * vx) + 'px'
                            }
                            break
                    }
                    updateInfo()
                    throttle(function() { scope.$emit("angular-resizable.resizing", info); })
                }

                var dragEnd = function(e: MouseEvent) {
                    updateInfo()
                    // Dispatch the event upwards through the scope hierarchy.
                    scope.$emit("angular-resizable.resizeEnd", info)
                    scope.$apply()
                    document.removeEventListener('mouseup', dragEnd, false)
                    document.removeEventListener('mousemove', dragging, false)
                    element.removeClass('no-transition')
                }

                /**
                 * The dragStart function adds listeners for mousemove and mouseup.
                 * The dragStart function handles a mousedown event.
                 */
                var dragStart = function(e: MouseEvent, direction: string) {
                    dragDir = direction
                    axis = (dragDir === 'left' || dragDir === 'right') ? 'x' : 'y'
                    start = (axis === 'x') ? e.clientX : e.clientY

                    w = parseInt(style.getPropertyValue("width"))
                    h = parseInt(style.getPropertyValue("height"))

                    // Prevent transition while dragging.
                    element.addClass('no-transition')

                    document.addEventListener('mouseup', dragEnd, false);
                    document.addEventListener('mousemove', dragging, false);
                    
                    // Disable highlighting while dragging.
                    if (e.stopPropagation) {
                        e.stopPropagation()
                    }
                    if (e.preventDefault) {
                        e.preventDefault()
                    }
                    e.cancelBubble = true
                    e.returnValue = false

                    updateInfo();

                    scope.$emit("angular-resizable.resizeStart", info)
                    scope.$apply()
                }

                for (var i = 0, iLength = dir.length; i < iLength; i++) {
                    (function() {
                        var grabber = document.createElement('div')
                        var direction = dir[i]

                        // Add class for styling purposes.
                        grabber.setAttribute('class', 'rg-' + dir[i])
                        grabber.innerHTML = inner
                        element[0].appendChild(grabber)
                        grabber.ondragstart = function(e: DragEvent) { return false }
                        grabber.addEventListener('mousedown', function(e: MouseEvent) {
                            dragStart(e, direction)
                        }, false)
                    } ())
                }
            }
        }
    })
