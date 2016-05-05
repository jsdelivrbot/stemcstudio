interface Tree {
    sha: string;
    url: string;
    tree: {
        path: string;
        /**
         * 100644
         */
        mode: string;
        /**
         * 'blob'
         */
        type: string;
        sha: string;
        size?: number;
        url: string;
    }[];
    truncated: boolean;
}

export default Tree;
