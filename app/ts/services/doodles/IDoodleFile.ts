/**
 *
 */
interface IDoodleFile {
    /**
     *
     */
    content: string;

    isOpen?: boolean;

    /**
     * CoffeeScript
     * CSS
     * HTML
     * JavaScript
     * LESS
     * Python
     * TypeScript
     */
    language: string;

    selected?: boolean;
}

export default IDoodleFile;
