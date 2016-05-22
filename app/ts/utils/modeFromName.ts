import {LANGUAGE_CSS} from '../languages/modes';
import {LANGUAGE_HTML} from '../languages/modes';
import {LANGUAGE_JSON} from '../languages/modes';
import {LANGUAGE_JAVA_SCRIPT} from '../languages/modes';
import {LANGUAGE_LESS} from '../languages/modes';
import {LANGUAGE_MARKDOWN} from '../languages/modes';
import {LANGUAGE_PYTHON} from '../languages/modes';
import {LANGUAGE_TEXT} from '../languages/modes';
import {LANGUAGE_TYPE_SCRIPT} from '../languages/modes';

const extensionToMode: { [ext: string]: string } = {};
const fileNameToMode: { [fileName: string]: string } = {};

// extensionToMode['coffee'] = 'CoffeeScript'
extensionToMode['css'] = LANGUAGE_CSS;
extensionToMode['gitignore'] = LANGUAGE_TEXT;
extensionToMode['html'] = LANGUAGE_HTML;
extensionToMode['js'] = LANGUAGE_JAVA_SCRIPT;
extensionToMode['json'] = LANGUAGE_JSON;
extensionToMode['less'] = LANGUAGE_LESS;
extensionToMode['md'] = LANGUAGE_MARKDOWN;
extensionToMode['py'] = LANGUAGE_PYTHON;
// extensionToMode['sass'] = 'SASS'
extensionToMode['ts'] = LANGUAGE_TYPE_SCRIPT;
extensionToMode['txt'] = LANGUAGE_TEXT;

fileNameToMode['LICENSE'] = LANGUAGE_TEXT;
fileNameToMode['.gitignore'] = LANGUAGE_TEXT;

/**
 * Given a file name, determines the language (mode).
 * The mode returned is a string containing the canonical mode name.
 * If the mode cannot be determined, then undefined is returned.
 */
export default function modeFromName(fileName: string): string {
    const period = fileName.lastIndexOf('.');
    if (period >= 0) {
        const extension = fileName.substring(period + 1);
        return extensionToMode[extension];
    }
    if (fileNameToMode[fileName]) {
        return fileNameToMode[fileName];
    }
    console.warn(`modeFromName('${fileName}') can't figure that one out.`);
    return void 0;
}
