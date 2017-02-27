import IDoodleFile from './IDoodleFile';

interface IDoodleDS {

    /**
     * The owner login.
     */
    owner: string;

    /**
     * The repository name.
     */
    repo: string;

    /**
     * The gist identifier.
     */
    gistId: string | undefined;

    /**
     * The last known generated JavaScript file. This is cached to improve startup.
     * This is a mapping from the fileName to the JavaScript text.
     */
    lastKnownJs: { [name: string]: string };

    /**
     * 
     */
    files: { [name: string]: IDoodleFile } | undefined;

    /**
     *
     */
    trash: { [name: string]: IDoodleFile } | undefined;

    /**
     *
     */
    created_at: string;

    /**
     *
     */
    updated_at: string;
}

export default IDoodleDS;
