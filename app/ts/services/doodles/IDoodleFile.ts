/**
 *
 */
interface IDoodleFile {
    /**
     * (Gist)
     */
    content: string;

    /**
     * (Repo File)
     */
    sha: string;

    /**
     * (Volatile)
     */
    isOpen?: boolean;

    /**
     * (Gist)
     * 
     * CoffeeScript
     * CSS
     * HTML
     * JavaScript
     * LESS
     * Python
     * TypeScript
     */
    language: string;

    /**
     * (Volatile)
     */
    preview: boolean;

    /**
     * (Gist)
     */
    raw_url: string;

    /**
     * (Volatile)
     */
    selected?: boolean;

    /**
     * (Gist)
     */
    size: number;

    /**
     * (Gist)
     */
    truncated: boolean;

    /**
     * (Gist)
     */
    type: string;
}

export default IDoodleFile;
