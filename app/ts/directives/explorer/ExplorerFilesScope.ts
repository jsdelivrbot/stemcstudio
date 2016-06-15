import * as ng from 'angular';
import ContextMenuItem from '../contextMenu/ContextMenuItem';
import WsFile from '../../wsmodel/services/WsFile';

/**
 * The shape of the menu property dictates the form of the DOM attribute in the context-menu.
 * e.g.
 * context-menu = 'menu(name, file)'
 */
interface ExplorerFilesScope extends ng.IScope {
    menu: (name: string, file: WsFile) => ContextMenuItem[];
}

export default ExplorerFilesScope;
