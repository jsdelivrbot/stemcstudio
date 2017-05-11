import { IAttributes, IAugmentedJQuery, IDirective, IDirectivePrePost, IQService, IScope, ITranscludeFunction } from 'angular';
import { ContextMenuItem } from './ContextMenuItem';
import { renderContextMenu } from './renderContextMenu';

/**
 * interface for the DOM attributes.
 */
interface ContextMenuAttributes extends IAttributes {
    /**
     * The expression used to build the context menu.
     * This should evaluate to an array of ContextMenuItem.
     */
    contextMenu: string;
}

/**
 * This implementation was inspired by...
 * https://github.com/Templarian/ui.bootstrap.contextMenu
 * 
 * Usage: context-menu='menu(path, file)' attribute explorer.html
 * 
 * It's probably not worth trying to improve this code since it uses
 * both AnhularJS $scope, $q
 */
export function contextMenu($q: IQService): IDirective {

    /**
     * Our mutable state includes the currently displayed context menu.
     */
    let currentContextMenu: IAugmentedJQuery | undefined = void 0;

    /**
     * 
     */
    function removeContextMenu() {
        if (currentContextMenu) {
            currentContextMenu.remove();
            currentContextMenu = void 0;
        }
    }

    /**
     * Using the compile function because it is the most general approach.
     * The compile step is called once.
     * The pre- and post-Link steps are called once for each context-menu directive (DOM attribute) instance.
     */
    function compile(tElem: IAugmentedJQuery, tAttrs: IAttributes): IDirectivePrePost {
        // We currently don't do anything during the compile step.
        return {

            /**
             * The preLink step always takes place from top to bottom in the DOM hierarchy.
             */
            pre: function (scope: IScope, iElem: IAugmentedJQuery, iAttrs: ContextMenuAttributes, controller: {}, transclude: ITranscludeFunction) {
                // Do nothing.
            },

            /**
             * The postLink step always takes place from bottom to top in the DOM hierarchy.
             */
            post: function ($scope: IScope, iElem: IAugmentedJQuery, iAttrs: ContextMenuAttributes, controller: {}, transclude: ITranscludeFunction) {
                function contextMenuEventHandler(contextMenuEvent: JQueryEventObject) {
                    contextMenuEvent.stopPropagation();
                    $scope.$apply(function () {
                        // Prevent the default context menu from popping up.
                        contextMenuEvent.preventDefault();
                        const menu: ContextMenuItem[] = $scope.$eval(iAttrs.contextMenu);
                        if (menu instanceof Array) {
                            currentContextMenu = renderContextMenu($q, $scope, contextMenuEvent.originalEvent as PointerEvent, menu, removeContextMenu);
                        }
                        else {
                            const msg = "context-menu expression must evaluate to an array.";
                            console.warn(msg);
                        }
                    });
                }
                function onDestroyScope() {
                    iElem.off('contextmenu', contextMenuEventHandler);
                    removeContextMenu();
                }
                iElem.on('contextmenu', contextMenuEventHandler);
                $scope.$on("$destroy", onDestroyScope);
            }
        };
    }

    /**
     * The factory function returns an IDirective.
     */
    const directive: IDirective = {
        require: [],
        restrict: 'A',
        compile
    };
    return directive;
}

/**
 * Dependencies that will be injected into the factory function.
 */
contextMenu.$inject = ['$q'];
