/**
 * Converts a comma-delimited value from the user interface into a string[].
 * The main idea here is that an empty string when split using commas begets an empty string.
 * We want the case of an empty string to be interpreted as a zero-length array.
 * 
 * This is used for Labels and Tags, affecting the keywords in the in package.json file.
 */
export function splitStringToKeywords(separator: string, value: string): string[] {
    if (typeof value === 'string') {
        value = value.trim();
        if (value.length > 0) {
            return value.split(separator).map(function (s) { return s.trim(); });
        }
        else {
            return [];
        }
    }
    else if (typeof value === 'undefined') {
        return [];
    }
    else {
        return [];
    }
}
