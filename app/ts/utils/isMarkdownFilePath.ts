import { modeFromName } from './modeFromName';
import { LANGUAGE_MARKDOWN } from '../languages/modes';

export function isMarkdownFilePath(path: string): boolean {
    return modeFromName(path) === LANGUAGE_MARKDOWN;
}
