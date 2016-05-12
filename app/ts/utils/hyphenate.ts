/**
 * Converts spaces in a phrase to hyphens.
 */
export default function hyphenate(phrase: string): string {
    if (typeof phrase === 'string') {
        return phrase.replace(' ', '-');
    }
    else {
        return phrase;
    }
}
