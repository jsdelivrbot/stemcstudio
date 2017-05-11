import { IPromise } from 'angular';

/**
 * An item in a menu.
 * A menu corresponding to files in a project is a function that takes the name of the file
 * and returns an array of ContextMenuItem. A controller normally sets up the menu.
 * In older AngularJS code the menu appears on the scope.
 */
export interface ContextMenuItem {
    label: string | IPromise<string>;
    action: () => void;
}

export const CONTEXT_MENU_ITEM_DIVIDER: null = null;
