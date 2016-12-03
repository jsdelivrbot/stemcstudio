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
    showFoldWidgets: boolean;

    /**
     * 
     */
    showFoldWidgetsChange(): void;

    /**
     * 
     */
    showInvisibles: boolean;

    /**
     * 
     */
    showInvisiblesChange(): void;

    /**
     * 
     */
    showLineNumbers: boolean;

    /**
     * 
     */
    showLineNumbersChange(): void;

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
