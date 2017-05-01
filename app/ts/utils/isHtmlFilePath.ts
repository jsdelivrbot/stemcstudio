import modeFromName from './modeFromName';
import { LANGUAGE_HTML } from '../languages/modes';

export default function isHtmlFilePath(path: string): boolean {
    return modeFromName(path) === LANGUAGE_HTML;
}
