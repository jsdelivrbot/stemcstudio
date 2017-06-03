import { isWhitespaceOrReplacementCharacter } from './isWhitespaceOrReplacementCharacter';

export function isAllWhitespaceOrReplacementCharacters(characters: string): boolean {
    for (const ch of characters) {
        if (!isWhitespaceOrReplacementCharacter(ch)) {
            return false;
        }
    }
    return true;
}
