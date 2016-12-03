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
    showInvisibles: boolean;
    /**
     * 
     */
    showLineNumbers: boolean;
    /**
     * 
     */
    showPrintMargin: boolean;
}

export default EditorPreferencesEvent;

export const currentTheme = 'currentTheme';
