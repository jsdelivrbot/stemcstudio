import { Command } from '../../editor/commands/Command';
import { COMMAND_NAME_GOTO_DEFINITION } from '../../editor/editor_protocol';
import { COMMAND_NAME_FORMAT_DOCUMENT } from '../../editor/editor_protocol';
import { COMMAND_NAME_CUT } from '../../editor/editor_protocol';
import { COMMAND_NAME_COPY } from '../../editor/editor_protocol';
import { COMMAND_NAME_PASTE } from '../../editor/editor_protocol';
import { ContextMenuItem, CONTEXT_MENU_ITEM_DIVIDER } from '../contextMenu/ContextMenuItem';
import { EditSession } from '../../editor/EditSession';
import { Editor } from '../../editor/Editor';
import { createGotoDefinitionCommand } from '../../workbench/commands/gotoDefinition';
import { FormatDocumentController } from '../../workbench/actions/formatDocument';
import { createFormatDocumentCommand } from '../../workbench/commands/formatDocument';
import { isLanguageServiceScript } from '../../utils/isLanguageServiceScript';

export interface ContextMenuController extends FormatDocumentController {

}

//
// An important idea is not to build the context menu from command key bindings.
// For a command key binding, the starting context is different.
//

/**
 * 
 */
export function computeContextMenu(path: string, editor: Editor, indentSize: number, controller: ContextMenuController, session: EditSession): (ContextMenuItem | null)[] {
    const menuItems: (ContextMenuItem | null)[] = [];
    if (isLanguageServiceScript(path)) {
        menuItems.push(menuItemFromCommand(createGotoDefinitionCommand()));
        /*
        menuItems.push({
            label: "Peek Definition", action: () => {
                console.log(`Peek Definition`);
            }
        });
        menuItems.push({
            label: "Go to Implementation", action: () => {
                console.log(`Go to Implementation`);
            }
        });
        menuItems.push({
            label: "Go to Type Definition", action: () => {
                console.log(`Go to Type Definition`);
            }
        });
        menuItems.push({
            label: "Find All References", action: () => {
                console.log(`Find All References`);
            }
        });
        */
    }
    if (isLanguageServiceScript(path)) {
        if (menuItems.length > 0) {
            menuItems.push(CONTEXT_MENU_ITEM_DIVIDER);
        }
        // TODO: Rename Symbol
        /*
        menuItems.push({
            label: "Rename Symbol", action: () => {
                console.log(`Rename Symbol`);
            }
        });
        */
        // TODO: Change All Occurrences
        /*
        menuItems.push({
            label: "Change All Occurrences", action: () => {
                console.log(`Change All Occurrences`);
            }
        });
        */
        menuItems.push(menuItemFromCommand(createFormatDocumentCommand(path, indentSize, controller, session)));
    }
    //
    // Disabling the Cut, Copy, Paste menu items (and the separator) temporarily.
    // It is apparent that the command bindings are intended to support clipboard events.
    // This is not the same as starting from mouse events.
    // I need to think about this more.
    //
    /*
    if (isEditorChangeable(editor)) {
        if (menuItems.length > 0) {
            menuItems.push(CONTEXT_MENU_ITEM_DIVIDER);
        }
        // TODO: copy should be on an EditorReadable interface.
        menuItems.push(menuItemFromEditorChangeableCommand(createCutCommand(), editor));
        menuItems.push(menuItemFromEditorChangeableCommand(createCopyCommand(), editor));
        menuItems.push(menuItemFromEditorChangeableCommand(createPasteCommand(), editor));
    }
    */
    return menuItems;
}

function menuItemFromCommand(command: Command<any>): ContextMenuItem {
    //
    // What could happen here is that the name of the command resolves to a label through i18n (asynchronously).
    //
    const label = (typeof command.name === 'string') ? translate(command.name) : `${typeof command.name}`;
    return {
        label,
        action: () => {
            if (command.exec) {
                command.exec(void 0);
            }
        }
    };
}

//
// Keep. Used to support Cut, Copy, Paste.
//
/*
function menuItemFromEditorChangeableCommand(command: Command<EditorChangeable>, editor: EditorChangeable): ContextMenuItem {
    //
    // What could happen here is that the name of the command resolves to a label through i18n (asynchronously).
    //
    const label = (typeof command.name === 'string') ? translate(command.name) : `${typeof command.name}`;
    return {
        label,
        action: () => {
            if (command.exec) {
                command.exec(editor);
            }
        }
    };
}
*/

/**
 * TODO: Make this asynchronous.
 */
function translate(commandName: string): string {
    switch (commandName) {
        case COMMAND_NAME_GOTO_DEFINITION: {
            return "Go to Definition";
        }
        case COMMAND_NAME_FORMAT_DOCUMENT: {
            return "Format Document";
        }
        case COMMAND_NAME_CUT: {
            return "Cut";
        }
        case COMMAND_NAME_COPY: {
            return "Copy";
        }
        case COMMAND_NAME_PASTE: {
            return "Paste";
        }
        default: {
            return `Unknown command name: '${commandName}'`;
        }
    }
}
