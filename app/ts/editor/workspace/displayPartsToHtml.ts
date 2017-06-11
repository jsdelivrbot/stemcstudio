import { SymbolDisplayPart } from './SymbolDisplayPart';
import { escapeHTML } from "../lib/escapeHTML";

function replaceNewLine(text: string): string {
    return text.replace(/(?:\r\n|\r|\n)/g, '<br/>');
}

export function displayPartsToHtml(displayParts: SymbolDisplayPart[]): string {
    if (displayParts) {
        return displayParts.map(function (displayPart) { return replaceNewLine(escapeHTML(displayPart.text)); }).join("");
    }
    else {
        return "";
    }
}
