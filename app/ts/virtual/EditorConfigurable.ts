import { EditorMinimal } from './EditorMinimal';

export interface EditorConfigurable extends EditorMinimal {
    /**
     * 
     */
    readOnly: boolean;

    setDisplayIndentGuides(displayIndentGuides: boolean): void;

    setFontSize(fontSize: string): void;

    setShowFoldWidgets(showFoldWidgets: boolean): void;

    setShowGutter(showGutter: boolean): void;

    setShowInvisibles(showInvisibles: boolean): void;

    setShowLineNumbers(showLineNumbers: boolean): void;

    setShowPrintMargin(showPrintMargin: boolean): void;

    getTabSize(): number;
    setTabSize(tabSize: number): void;

    setThemeCss(themeId: string, href?: string): void;
    setThemeDark(isdark: boolean): void;

    getUseSoftTabs(): boolean;
    setUseSoftTabs(useSoftTabs: boolean): void;
}

export function isEditorConfigurable(editor: EditorMinimal): editor is EditorConfigurable {
    if (editor) {
        const candidate = editor as EditorConfigurable;
        return typeof candidate.getTabSize === 'function';
    }
    else {
        return false;
    }
}
