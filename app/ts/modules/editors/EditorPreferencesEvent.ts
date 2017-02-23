/**
 * 
 */
interface EditorPreferencesEvent {
    /**
     * 
     */
    fontSize: string;
    /**
     * 
     */
    isDark: boolean;
    /**
     * 
     */
    cssClass: string;
    /**
     * 
     */
    displayIndentGuides: boolean;
    /**
     * 
     */
    href: string;
    /**
     * 
     */
    showFoldWidgets: boolean;
    /**
     * 
     */
    showGutter: boolean;
    /**
     * 
     */
    showInvisibles: boolean;
    /**
     * 
     */
    showLineNumbers: boolean;
    /**
     * 
     */
    showPrintMargin: boolean;
    /**
     * 
     */
    tabSize: number;
    /**
     * 
     */
    useSoftTabs: boolean;
}

export default EditorPreferencesEvent;

export const currentTheme = 'currentTheme';
