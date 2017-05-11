import { element, forEach, isFunction } from 'angular';
import { IAugmentedJQuery, IPromise, IQService, IScope } from 'angular';
import { ContextMenuItem, CONTEXT_MENU_ITEM_DIVIDER } from './ContextMenuItem';

/**
 *
 */
function processLabel($q: IQService, menuItem: ContextMenuItem, promises: IPromise<string>[]): IAugmentedJQuery {
    const anchor = element('<a>');
    anchor.css('padding-right', '8px');
    // href='#' makes the mouse cursor correct but we must prevent the default action when we register the event handler. 
    anchor.attr({ tabIndex: '-1', href: '#' });

    // `when` is like Promise.resolve, but it allows the menuItem.label to be either a value or a Promise.
    // So in theory, the labels in our context menu can be built asynchronously.
    const promise: IPromise<string> = $q.when(menuItem.label);
    promises.push(promise);
    promise.then(function (text: string) {
        anchor.text(text);
    });
    return anchor;
}

function registerEventHandler($scope: IScope, enabled: boolean, menuItem: ContextMenuItem, li: IAugmentedJQuery, contextMenuEvent: PointerEvent, removeContextMenus: () => void) {
    if (enabled) {
        li.on('click', function (clickEvent: JQueryMouseEventObject) {
            // WARNING: href='#' will drive us back to the home page if we don't prevent the default action for click.
            clickEvent.preventDefault();
            $scope.$apply(function () {
                element(contextMenuEvent.currentTarget).removeClass('context');
                removeContextMenus();
                if (isFunction(menuItem.action)) {
                    menuItem.action();
                }
                else {
                    console.warn(`ContextMenuItem[label=${menuItem.label}].action must be a function.`);
                }
            });
        });
    }
    else {
        li.on('click', function (clickEvent: JQueryMouseEventObject) {
            clickEvent.preventDefault();
        });
        li.addClass('disabled');
    }
}

/**
 *
 */
function renderContextMenuItem($q: IQService, $scope: IScope, contextMenuEvent: PointerEvent, li: IAugmentedJQuery, menuItem: ContextMenuItem, promises: IPromise<string>[], removeContextMenu: () => void): void {
    const label: IAugmentedJQuery = processLabel($q, menuItem, promises);
    li.append(label);

    registerEventHandler($scope, true, menuItem, li, contextMenuEvent, removeContextMenu);
}

/**
 * The way that this function is defined, it is fire-and-forget.
 */
function resizeMenuWhenLabelsResolve($q: IQService, ul: IAugmentedJQuery, event: PointerEvent, promises: IPromise<any>[]): void {

    $q.all(promises).then(function () {

        let topCoordinate = event.pageY;

        const menuHeight: number = element(ul[0]).prop('offsetHeight');

        const winHeight = event.view.innerHeight;

        if (topCoordinate > menuHeight && winHeight - topCoordinate < menuHeight) {
            topCoordinate = event.pageY - menuHeight;
        }

        let leftCoordinate = event.pageX;
        const menuWidth = element(ul[0]).prop('offsetWidth');
        const winWidth = event.view.innerWidth;

        if (leftCoordinate > menuWidth && winWidth - leftCoordinate < menuWidth) {
            leftCoordinate = event.pageX - menuWidth;
        }

        ul.css({
            display: 'block',
            position: 'absolute',
            left: `${leftCoordinate}px`,
            top: `${topCoordinate}px`
        });
    });
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
export function renderContextMenu($q: IQService, $scope: IScope, contextMenuEvent: PointerEvent, menu: (ContextMenuItem | null)[], removeContextMenu: () => void): IAugmentedJQuery {

    /**
     * TODO: Documentation
     */
    const promises: IPromise<string>[] = [];

    element(contextMenuEvent.currentTarget).addClass('context');
    const contextMenu: IAugmentedJQuery = element('<div>');
    contextMenu.addClass('dropdown clearfix');
    const ul: IAugmentedJQuery = element('<ul>');
    ul.addClass('dropdown-menu');
    ul.attr({ role: 'menu' });
    ul.css({
        'display': 'block',
        'position': 'absolute',
        'left': contextMenuEvent.pageX + 'px',
        'top': contextMenuEvent.pageY + 'px',
        'z-index': 1000
    });

    forEach(menu, function (menuItem: ContextMenuItem) {
        const li: IAugmentedJQuery = element('<li>');
        ul.append(li);
        if (menuItem === CONTEXT_MENU_ITEM_DIVIDER) {
            li.addClass('divider');
        }
        else {
            renderContextMenuItem($q, $scope, contextMenuEvent, li, menuItem, promises, removeContextMenu);
        }
    });

    contextMenu.append(ul);
    const height = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
    );
    contextMenu.css({
        width: '100%',
        height: height + 'px',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 9999
    });
    element(document).find('body').append(contextMenu);

    // Now that the menu has been built, we make some adjustments to the dimensions.
    resizeMenuWhenLabelsResolve($q, ul, contextMenuEvent, promises);

    contextMenu.on('mousedown', function (event: JQueryEventObject) {
        // The following code dismisses the context menu if a mousedown event
        // occurs outside of the menu items.
        if (element(event.target).hasClass('dropdown')) {
            element(event.currentTarget).removeClass('context');
            removeContextMenu();
        }
    });

    return contextMenu;
}

