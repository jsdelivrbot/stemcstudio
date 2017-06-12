import { isWhitespace } from './isWhitespace';

export function isAllWhitespace(characters: string) {
    for (const ch of characters) {
        if (!isWhitespace(ch)) {
            return false;
        }
    }
    return true;
}
