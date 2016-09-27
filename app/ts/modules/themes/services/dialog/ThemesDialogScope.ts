import Theme from '../../Theme';

interface ThemesDialogScope {

    /**
     * The selected theme.
     */
    theme: Theme;

    /**
     * The list of available themes, used to populate a list of options.
     */
    themes: Theme[];

    ok(): void;
    submit(): void;
    cancel(); void;
}

export default ThemesDialogScope;
