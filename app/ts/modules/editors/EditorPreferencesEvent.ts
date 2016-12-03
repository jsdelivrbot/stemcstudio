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
}

export default EditorPreferencesEvent;

export const currentTheme = 'currentTheme';
