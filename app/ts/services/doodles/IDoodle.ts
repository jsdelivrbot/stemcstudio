interface IDoodle {

    /**
     * Every doodle gets a UUID to determine uniqueness.
     */
    uuid: string;

    /**
     * The GitHub Gist identifier.
     */
    gistId?: string;

    /**
     * 
     */
    description: string;

    /**
     * The `isCodeVisible` property determines whether the code is visible.
     */
    isCodeVisible: boolean;

    /**
     * The `isViewVisible` property determines whether the view is visible.
     */
    isViewVisible: boolean;

    /**
     * The `focusEditor` property contains the fileName of the editor which has focus.
     */
    focusEditor: string;

    /**
     * The last known generated JavaScript file. This is cached to improve startup.
     * This is a mapping from the fileName to the JavaScript text.
     */
    lastKnownJs: { [name: string]: string };
    /**
     *
     */
    operatorOverloading: boolean;
    /**
     * 
     */
    html: string;
    /**
     * 
     */
    code: string;
    /**
     * 
     */
    libs: string;
    /**
     * 
     */
    less: string;
    /**
     * 
     */
    dependencies: string[];
    /**
     *
     */
    created_at?: string;
    /**
     *
     */
    updated_at?: string;
}

export default IDoodle;
