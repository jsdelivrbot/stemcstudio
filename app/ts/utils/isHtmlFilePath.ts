import { modeFromName } from './modeFromName';
import { LANGUAGE_HTML } from '../languages/modes';

/**
 * Returns `true` if the fileName has the html extension.
 */
export function isHtmlFilePath(path: string): boolean {
    return modeFromName(path) === LANGUAGE_HTML;
}
