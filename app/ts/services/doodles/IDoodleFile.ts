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
    language: string | undefined;

    /**
     * (Volatile)
     */
    htmlChoice: boolean;

    /**
     * (Volatile)
     */
    markdownChoice: boolean;

    /**
     * (Gist)
     */
    raw_url: string | undefined;

    /**
     * (Volatile)
     */
    selected?: boolean;
}

export default IDoodleFile;
