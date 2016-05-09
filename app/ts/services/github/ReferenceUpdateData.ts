interface ReferenceUpdateData {
    /**
     * The SHA1 value to set this reference to.
     */
    sha: string;

    /**
     * Indicates whether to force the update or to make sure the update is a fast-forward update.
     * Leaving this out or setting it to false will make sure you're not overwriting work.
     * Default: false
     */
    force?: boolean;
}

export default ReferenceUpdateData;
