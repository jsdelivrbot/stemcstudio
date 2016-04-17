/**
 *
 */
interface IDoodleFile {
    /**
     * (Gist)
     */
    content: string;

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

    /**
     * @method clone
     * @return {IDoodleFile}
     */
    clone(): IDoodleFile;
}

export default IDoodleFile;
