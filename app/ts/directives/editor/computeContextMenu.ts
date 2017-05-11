import { Command } from '../../editor/commands/Command';
import { COMMAND_NAME_FORMAT_DOCUMENT } from '../../editor/editor_protocol';
import { COMMAND_NAME_CUT } from '../../editor/editor_protocol';
import { COMMAND_NAME_COPY } from '../../editor/editor_protocol';
import { COMMAND_NAME_PASTE } from '../../editor/editor_protocol';
import { ContextMenuItem, CONTEXT_MENU_ITEM_DIVIDER } from '../contextMenu/ContextMenuItem';
// import { Editor } from '../../virtual/editor';
import { EditSession } from '../../virtual/editor';
import { EditorMinimal } from '../../virtual/EditorMinimal';
import { EditorChangeable, isEditorChangeable } from '../../virtual/EditorChangeable';
import { FormatDocumentController } from '../../workbench/actions/formatDocument';
import { createFormatDocumentCommand } from '../../workbench/commands/formatDocument';
import { createCutCommand } from '../../workbench/commands/cut';
import { createCopyCommand } from '../../workbench/commands/copy';
import { createPasteCommand } from '../../workbench/commands/paste';

export interface ContextMenuController extends FormatDocumentController {

}

export function computeContextMenu(path: string, editor: EditorMinimal, indentSize: number, controller: ContextMenuController, session: EditSession): (ContextMenuItem | null)[] {
    const menuItems: (ContextMenuItem | null)[] = [];
    menuItems.push({
        label: "Go to Definition", action: () => {
            console.log(`Go to Definition`);
        }
    });
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
    menuItems.push(CONTEXT_MENU_ITEM_DIVIDER);
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
    if (isEditorChangeable(editor)) {
        menuItems.push(CONTEXT_MENU_ITEM_DIVIDER);
        // TODO: copy should be on an EditorReadable interface.
        menuItems.push(menuItemFromEditorChangeableCommand(createCutCommand(), editor));
        menuItems.push(menuItemFromEditorChangeableCommand(createCopyCommand(), editor));
        menuItems.push(menuItemFromEditorChangeableCommand(createPasteCommand(), editor));
    }
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

/**
 * TODO: Make this asynchronous.
 */
function translate(commandName: string): string {
    switch (commandName) {
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
