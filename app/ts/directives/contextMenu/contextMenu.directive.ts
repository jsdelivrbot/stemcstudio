import * as ng from 'angular';
import ContextMenuItem from './ContextMenuItem';

/**
 * interface for the DOM attributes.
 */
interface ContextMenuAttributes extends ng.IAttributes {
    /**
     * The expression used to build the context menu.
     * This should evaluate to an array of ContextMenuItem.
     */
    contextMenu: string;
}

/**
 * This implementation was inspired by...
 * https://github.com/Templarian/ui.bootstrap.contextMenu
 */
function factory($q: ng.IQService) {

    /**
     * Our mutable state includes the currently displayed context menu.
     */
    let currentContextMenu: ng.IAugmentedJQuery = void 0

    /**
     * 
     */
    function removeContextMenus() {
        if (currentContextMenu) {
            currentContextMenu.remove()
            currentContextMenu = void 0
        }
    }

    /**
     *
     */
    function handlePromises(ul: ng.IAugmentedJQuery, event: JQueryEventObject, promises: ng.IPromise<any>[]) {
        $q.all(promises).then(function() {

            let topCoordinate = event.pageY
            const menuHeight: number = ng.element(ul[0]).prop('offsetHeight')
            // TODO: What is view?
            const winHeight: number = event['view'].innerHeight
            if (topCoordinate > menuHeight && winHeight - topCoordinate < menuHeight) {
                topCoordinate = event.pageY - menuHeight
            }

            let leftCoordinate = event.pageX
            const menuWidth = angular.element(ul[0]).prop('offsetWidth')
            const winWidth = event['view'].innerWidth
            if (leftCoordinate > menuWidth && winWidth - leftCoordinate < menuWidth) {
                leftCoordinate = event.pageX - menuWidth
            }

            ul.css({
                display: 'block',
                position: 'absolute',
                left: leftCoordinate + 'px',
                top: topCoordinate + 'px'
            })
        })
    }

    function registerEventHandler($scope: ng.IScope, enabled: boolean, menuItem: ContextMenuItem, li: ng.IAugmentedJQuery, contextMenuEvent: JQueryEventObject) {
        if (enabled) {
            li.on('click', function(clickEvent: JQueryMouseEventObject) {
                // WARNING: href='#' will drive us back to the home page if we don't prevent the default action for click.
                clickEvent.preventDefault()
                $scope.$apply(function() {
                    ng.element(contextMenuEvent.currentTarget).removeClass('context')
                    removeContextMenus()
                    if (ng.isFunction(menuItem.action)) {
                        menuItem.action()
                    }
                    else {
                        console.warn(`ContextMenuItem[label=${menuItem.label}].action must be a function.`)
                    }
                })
            })
        }
        else {
            li.on('click', function(clickEvent: JQueryMouseEventObject) {
                clickEvent.preventDefault()
            })
            li.addClass('disabled')
        }
    }

    /**
     *
     */
    function processLabel(menuItem: ContextMenuItem, promises: ng.IPromise<string>[]): ng.IAugmentedJQuery {
        const anchor = ng.element('<a>')
        anchor.css('padding-right', '8px')
        // href='#' makes the mouse cursor correct but we must prevent the default action when we register the event handler. 
        anchor.attr({ tabIndex: '-1', href: '#' })

        const promise: ng.IPromise<string> = $q.when(menuItem.label)
        promise.then(function(text: string) {
            anchor.text(text)
        })
        return anchor;
    }

    /**
     *
     */
    function renderContextMenuItem($scope: ng.IScope, contextMenuEvent: JQueryEventObject, li: ng.IAugmentedJQuery, menuItem: ContextMenuItem, promises: ng.IPromise<string>[]): void {
        const label: ng.IAugmentedJQuery = processLabel(menuItem, promises)
        li.append(label)

        registerEventHandler($scope, true, menuItem, li, contextMenuEvent)
    }

    /**
     * Create a dropdown menu consistent with Bootstrap standards.
     * This is basically a DOM structure that looks like:
     *
     * <div class='dropdown'>
     *  <!-- Don't need the button or the caret. -->
     *   <ul class='dropdown-menu' role='menu' aria-labelledby='...'>
     *     <li role='presentation'>
     *       <a role='menuitem' href='#'>Label</a>
     *     </li>
     *     <li class='divider'></li>
     *     <li class='disabled'></li>
     *   </ul>
     * </div>
     *
     * Accessibility provided by including the role and aria- attributes.
     */
    function renderContextMenu($scope: ng.IScope, contextMenuEvent: JQueryEventObject, menu: ContextMenuItem[]) {

        /**
         * TODO: Documentation
         */
        const promises: ng.IPromise<string>[] = []

        ng.element(event.currentTarget).addClass('context')
        const contextMenu: ng.IAugmentedJQuery = ng.element('<div>')
        currentContextMenu = contextMenu;
        contextMenu.addClass('dropdown clearfix')
        const ul: ng.IAugmentedJQuery = ng.element('<ul>')
        ul.addClass('dropdown-menu')
        ul.attr({ role: 'menu' })
        ul.css({
            'display': 'block',
            'position': 'absolute',
            'left': contextMenuEvent.pageX + 'px',
            'top': contextMenuEvent.pageY + 'px',
            'z-index': 1000
        })

        angular.forEach(menu, function(menuItem: ContextMenuItem) {
            const li: ng.IAugmentedJQuery = ng.element('<li>')
            ul.append(li)
            if (menuItem === null) {
                li.addClass('divider')
            }
            else {
                renderContextMenuItem($scope, contextMenuEvent, li, menuItem, promises)
            }
        })

        contextMenu.append(ul)
        const height = Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
        )
        contextMenu.css({
            width: '100%',
            height: height + 'px',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 9999
        })
        ng.element(document).find('body').append(contextMenu)

        // Now that the menu has been built, we make some adjustments to the dimensions.
        handlePromises(ul, contextMenuEvent, promises)

        contextMenu.on('mousedown', function(event: JQueryEventObject) {
            // The following code dismisses the context menu if a mousedown event
            // occurs outside of the menu items.
            if (ng.element(event.target).hasClass('dropdown')) {
                ng.element(event.currentTarget).removeClass('context')
                removeContextMenus()
            }
        })
    }

    /**
     * Using the compile function because it is the most general approach.
     * The compile step is called once.
     * The pre- and post-Link steps are called once for each context-menu directive (DOM attribute) instance.
     */
    function compile(tElem: ng.IAugmentedJQuery, tAttrs: ng.IAttributes): ng.IDirectivePrePost {
        // We currently don't do anything during the compile step.
        return {

            /**
             * The preLink step always takes place from top to bottom in the DOM hierarchy.
             */
            pre: function(scope: ng.IScope, iElem: ng.IAugmentedJQuery, iAttrs: ContextMenuAttributes, controller: {}, transclude: ng.ITranscludeFunction) {
                // Do nothing.
            },

            /**
             * The postLink step always takes place from bottom to top in the DOM hierarchy.
             */
            post: function($scope: ng.IScope, iElem: ng.IAugmentedJQuery, iAttrs: ContextMenuAttributes, controller: {}, transclude: ng.ITranscludeFunction) {
                function contextMenuEventHandler(contextMenuEvent: JQueryEventObject) {
                    event.stopPropagation()
                    $scope.$apply(function() {
                        // Prevent the default context menu from popping up.
                        event.preventDefault()
                        const menu: ContextMenuItem[] = $scope.$eval(iAttrs.contextMenu)
                        if (menu instanceof Array) {
                            renderContextMenu($scope, contextMenuEvent, menu)
                        }
                        else {
                            const msg = "context-menu expression must evaluate to an array."
                            console.warn(msg)
                        }
                    })
                }
                function onDestroyScope() {
                    iElem.off('contextmenu', contextMenuEventHandler)
                    removeContextMenus()
                }
                iElem.on('contextmenu', contextMenuEventHandler)
                $scope.$on("$destroy", onDestroyScope)
            }
        }
    }

    /**
     * The factory function returns an IDirective.
     */
    const directive: angular.IDirective = {
        require: [],
        restrict: 'A',
        compile
    }
    return directive
}

/**
 * Dependencies that will be injected into the factory function.
 */
factory.$inject = ['$q']

export default factory
