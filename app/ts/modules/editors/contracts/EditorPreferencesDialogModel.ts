import Theme from '../Theme';
/**
 * These are really the parameters passed to the dialog and returned.
 * Controllers will set this and decide what to do with the response.
 */
interface EditorPreferencesDialogModel {
    /**
     *
     */
    fontSize: string;
    /**
     * 
     */
    theme: Theme;
    /**
     * 
     */
    showInvisibles: boolean;
}

export default EditorPreferencesDialogModel;
