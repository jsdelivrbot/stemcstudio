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
    showInvisibles: boolean;
}

export default EditorPreferencesEvent;

export const currentTheme = 'currentTheme';
