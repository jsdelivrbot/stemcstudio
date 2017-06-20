import { IDoodleFile } from './IDoodleFile';

export interface IDoodle {

    /**
     *
     */
    name: string;

    /**
     *
     */
    version: string;

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
     * The last known generated JavaScript file. This is cached to improve startup.
     * This is a mapping from the fileName to the JavaScript text.
     */
    lastKnownJs: { [name: string]: string };

    /**
     * disable infinite loop detection.
     */
    noLoopCheck: boolean;

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
     * A map from package name to semantic version.
     */
    dependencies: { [packageName: string]: string };

    /**
     *
     */
    created_at?: string;

    /**
     *
     */
    updated_at?: string;

    /**
     *
     */
    closeFile(name: string): void;

    /**
     *
     */
    deleteFile(name: string): void;

    /**
     * Empties the map containing Gist files that are marked for deletion.
     */
    emptyTrash(): void;

    /**
     *
     */
    existsFile(name: string): boolean;

    /**
     *
     */
    existsFileInTrash(name: string): boolean;

    /**
     *
     */
    getPreviewFile(): string;

    /**
     * Makes a best attempt to return a file that can be rendered for preview.
     */
    getPreviewFileOrBestAvailable(): string;

    /**
     *
     */
    newFile(name: string): IDoodleFile;

    /**
     *
     */
    openFile(name: string): void;

    /**
     *
     */
    renameFile(oldName: string, newName: string): void;

    /**
     *
     */
    selectFile(name: string): void;

    /**
     *
     */
    setPreviewFile(name: string): void;
}
