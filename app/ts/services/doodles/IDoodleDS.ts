import IDoodleFile from './IDoodleFile';

interface IDoodleDS {

    /**
     * The GitHub Gist identifier.
     */
    gistId: string;

    /**
     * The last known generated JavaScript file. This is cached to improve startup.
     * This is a mapping from the fileName to the JavaScript text.
     */
    lastKnownJs: { [name: string]: string };

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
    created_at: string;

    /**
     *
     */
    updated_at: string;
}

export default IDoodleDS;
