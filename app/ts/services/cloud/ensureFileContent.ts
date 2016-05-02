import stripWS from '../../utils/stripWS';
import modeFromName from '../../utils/modeFromName';
import {LANGUAGE_CSS} from '../../languages/modes';
import {LANGUAGE_HTML} from '../../languages/modes';
import {LANGUAGE_LESS} from '../../languages/modes';
import {LANGUAGE_JAVA_SCRIPT} from '../../languages/modes';
import {LANGUAGE_MARKDOWN} from '../../languages/modes';
import {LANGUAGE_TYPE_SCRIPT} from '../../languages/modes';

export default function ensureFileContent(name: string, content: string): string {
    const mode = modeFromName(name)
    switch (mode) {
        case LANGUAGE_HTML: {
            if (stripWS(content).length > 0) {
                return content;
            }
            else {
                return '<!DOCTYPE html>\n';
            }
        }
        case LANGUAGE_JAVA_SCRIPT:
        case LANGUAGE_TYPE_SCRIPT: {
            if (stripWS(content).length > 0) {
                return content;
            }
            else {
                return '//\n';
            }
        }
        case LANGUAGE_CSS:
        case LANGUAGE_LESS: {
            if (stripWS(content).length > 0) {
                return content;
            }
            else {
                return '//\n';
            }
        }
        case LANGUAGE_MARKDOWN: {
            if (stripWS(content).length > 0) {
                return content;
            }
            else {
                return '#\n';
            }
        }
        default: {
            if (stripWS(content).length > 0) {
                return content;
            }
            else {
                console.warn(`${name} => ${mode}, ${stripWS(content).length}`)
                return content;
            }
        }
    }
}
