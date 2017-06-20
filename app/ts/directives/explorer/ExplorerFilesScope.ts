import { IScope } from 'angular';
import { ContextMenuItem } from '../contextMenu/ContextMenuItem';

/**
 * The shape of the menu property dictates the form of the DOM attribute in the context-menu.
 * e.g.
 * context-menu = 'menu(path)'
 */
export interface ExplorerFilesScope extends IScope {
    /**
     * The null entry in the returned array corresponds to a menu divider.
     */
    menu: (name: string) => (ContextMenuItem | null)[];
}
