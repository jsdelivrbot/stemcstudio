/**
 * Trims leading and trailing whitespace, text to lower case, and converts spaces in a phrase to hyphens.
 */
export default function hyphenate(phrase: string): string {
    if (typeof phrase === 'string') {
        return phrase.trim().toLowerCase().replace(/\s/g, '-');
    }
    else {
        return phrase;
    }
}
