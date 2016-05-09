interface ReferenceCreateData {

    /**
     * The name of the fully qualified reference (ie: refs/heads/master).
     * If it doesn't start with 'refs' and have at least two slashes, it will be rejected.
     */
    ref: string;

    /**
     * The SHA1 value to set this reference to.
     */
    sha: string;
}

export default ReferenceCreateData;
