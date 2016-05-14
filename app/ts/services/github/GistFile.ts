interface GistFile {
    filename: string;
    type: string;
    language: string;
    raw_url: string;
    size: number;
    truncated: boolean;
    /**
     * The content comes down unencoded.
     */
    content: string;
}

export default GistFile;
