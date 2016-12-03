import Theme from '../../Theme';

interface EditorPreferencesDialogScope {

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

    /**
     * 
     */
    showInvisibles: boolean;

    /**
     * 
     */
    showInvisiblesChange(): void;

    ok(): void;
    submit(): void;
    cancel(); void;
}

export default EditorPreferencesDialogScope;
