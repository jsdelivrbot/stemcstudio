import { isWhitespace } from './isWhitespace';

export function isWhitespaceOrReplacementCharacter(ch: string): boolean {
  return isWhitespace(ch) || ch === '\uFFFD';
}
