import { LanguageModeId } from '../../editor/LanguageMode';

/**
 *
 */
export interface IDoodleFile {
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
    language: LanguageModeId | undefined;

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
