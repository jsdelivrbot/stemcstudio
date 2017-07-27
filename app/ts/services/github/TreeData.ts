export interface TreeData {
    /**
     * The SHA1 of the tree you want to update with new data.
     * If you don't set this, the commit will be created on top of everything.
     * However, it will only contain your change, the rest of your files will show up as deleted.
     */
    base_tree?: string;

    /**
     * 
     */
    tree: {
        /**
         * The file referenced in the tree.
         */
        path: string;

        /**
         * The file mode; one of 
         * 100644 for file (blob),
         * 100755 for executable (blob),
         * 040000 for subdirectory (tree),
         * 160000 for submodule (commit), or
         * 120000 for a blob that specifies the path of a symlink
         */
        mode: string;

        /**
         * Either blob, tree, or commit.
         */
        type: string;

        /**
         * The SHA1 checksum ID of the object in the tree
         */
        sha?: string;

        /**
         * The content you want this file to have.
         * GitHub will write this blob out and use that SHA for this entry.
         * Use either this, or tree.sha.
         */
        content?: string;
    }[];
}
