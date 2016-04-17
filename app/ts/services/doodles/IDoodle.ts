import IDoodleFile from './IDoodleFile';

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
    files: { [name: string]: IDoodleFile };

    /**
     *
     */
    trash: { [name: string]: IDoodleFile };

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

    /**
     * @method closeFile
     * @param name {string}
     * @return {void}
     */
    closeFile(name: string): void;

    /**
     * Empties the map containing Gist files that are marked for deletion.
     * 
     * @method emtyTrash
     * @return {void}
     */
    emptyTrash(): void;

    /**
     * @method newFile
     * @param name {string}
     * @return {IDoodleFile}
     */
    newFile(name: string): IDoodleFile;

    /**
     * @method openFile
     * @param name {string}
     * @return {void}
     */
    openFile(name: string): void;

    /**
     * @method renameFile
     * @param oldName {string}
     * @param newName {string}
     * @return {void}
     */
    renameFile(oldName: string, newName: string): void;

    /**
     * @method selectFile
     * @param name {string}
     * @return {void}
     */
    selectFile(name: string): void;

    /**
     * @method deleteFile
     * @param name {string}
     * @return {void}
     */
    deleteFile(name: string): void;
}

export default IDoodle;
