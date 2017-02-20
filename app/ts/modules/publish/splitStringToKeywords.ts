import isString from '../../utils/isString';
import isUndefined from '../../utils/isUndefined';
/**
 * Converts a comma-delimited value from the user interface into a string[].
 * The main idea here is that an empty string when split using commas begets an empty string.
 * We want the case of an empty string to be interpreted as a zero-length array.
 */
export default function splitStringToKeywords(separator: string, value: string): string[] {
    if (isString(value)) {
        value = value.trim();
        if (value.length > 0) {
            return value.split(separator).map(function (s) { return s.trim(); });
        }
        else {
            return [];
        }
    }
    else if (isUndefined(value)) {
        return [];
    }
    else {
        return [];
    }
}
