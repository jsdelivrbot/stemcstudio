import Theme from '../../Theme';

/**
 * 
 */
interface EditorPreferencesDialogScope {

    /**
     * 
     */
    fontSize: string;

    /**
     * 
     */
    fontSizeChange(): void;

    /**
     * 
     */
    fontSizes: string[];

    /**
     * 
     */
    showInvisibles: boolean;

    /**
     * 
     */
    showInvisiblesChange(): void;

    /**
     * The selected theme.
     */
    theme: Theme;

    /**
     * The list of available themes, used to populate a list of options.
     */
    themes: Theme[];

    /**
     * 
     */
    themeChange(): void;

    ok(): void;
    submit(): void;
    cancel(); void;
}

export default EditorPreferencesDialogScope;
