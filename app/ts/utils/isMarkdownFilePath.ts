import modeFromName from './modeFromName';
import {LANGUAGE_MARKDOWN} from '../languages/modes';

export default function(path: string): boolean {
    return modeFromName(path) === LANGUAGE_MARKDOWN;
}
