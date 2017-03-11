import ITextService from './ITextService';

/**
 *
 */
export default class TextService implements ITextService {
    /**
     * We don't have any dependencies right now, but this is how they would be described
     * so that the AngularJS injector can do its job.
     */
    public static $inject: string[] = [];

    /**
     *
     */
    constructor() {
        // Do nothing (yet).
        // Does AngularJS use the new operator when creating a service? YES
        // const isConstructor = this instanceof TextService
    }

    /**
     *
     */
    normalizeWhitespace(str: string): string {
        // Strip an initial blank whitespace caused from having text nested inside an html tag.
        const stripped = str.replace(/^\n/, '');
        if (stripped.length > 0) {
            // Find the first text with an indent and get the length of the indent.
            const matches = new RegExp("(?:^|\n)([ \t\r]+)").exec(stripped);
            if (Array.isArray(matches)) {
                const firstIndentLength = matches[1].length;
                // Use the first indent length as a baseline and normalize all other lines.
                return stripped.replace(new RegExp("(^|\n)[ \t\r]{" + firstIndentLength + "}", 'g'), "$1");
            }
            else {
                return stripped;
            }
        }
        else {
            return stripped;
        }
    }
}
