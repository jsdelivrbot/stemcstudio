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
}

export default IDoodleFile;
