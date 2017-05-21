import { LANGUAGE_C } from '../languages/modes';
import { LANGUAGE_CPP } from '../languages/modes';
import { LANGUAGE_CSS } from '../languages/modes';
import { LANGUAGE_CSV } from '../languages/modes';
import { LANGUAGE_GLSL } from '../languages/modes';
import { LANGUAGE_HASKELL } from '../languages/modes';
import { LANGUAGE_HTML } from '../languages/modes';
import { LANGUAGE_JSON } from '../languages/modes';
import { LANGUAGE_JAVA_SCRIPT } from '../languages/modes';
import { LANGUAGE_JSX } from '../languages/modes';
import { LANGUAGE_LESS } from '../languages/modes';
import { LANGUAGE_MARKDOWN } from '../languages/modes';
import { LANGUAGE_MATLAB } from '../languages/modes';
import { LANGUAGE_PYTHON } from '../languages/modes';
import { LANGUAGE_SCHEME } from '../languages/modes';
import { LANGUAGE_TEXT } from '../languages/modes';
import { LANGUAGE_TYPE_SCRIPT } from '../languages/modes';
import { LANGUAGE_TSX } from '../languages/modes';
import { LANGUAGE_XML } from '../languages/modes';
import { LANGUAGE_YAML } from '../languages/modes';
//
// Editor Abstraction Layer
//
import { LanguageModeId } from '../virtual/editor';

const extensionToMode: { [ext: string]: LanguageModeId } = {};
const fileNameToMode: { [fileName: string]: LanguageModeId } = {};

extensionToMode['c'] = LANGUAGE_C;
extensionToMode['cpp'] = LANGUAGE_CPP;
extensionToMode['css'] = LANGUAGE_CSS;
extensionToMode['csv'] = LANGUAGE_CSV;
extensionToMode['gitignore'] = LANGUAGE_TEXT;
extensionToMode['glsl'] = LANGUAGE_GLSL;
extensionToMode['hs'] = LANGUAGE_HASKELL;
extensionToMode['html'] = LANGUAGE_HTML;
extensionToMode['js'] = LANGUAGE_JAVA_SCRIPT;
extensionToMode['jsx'] = LANGUAGE_JSX;
extensionToMode['json'] = LANGUAGE_JSON;
extensionToMode['less'] = LANGUAGE_LESS;
extensionToMode['m'] = LANGUAGE_MATLAB;
extensionToMode['md'] = LANGUAGE_MARKDOWN;
extensionToMode['py'] = LANGUAGE_PYTHON;
extensionToMode['scm'] = LANGUAGE_SCHEME;
// extensionToMode['sass'] = 'SASS'
extensionToMode['ts'] = LANGUAGE_TYPE_SCRIPT;
extensionToMode['tsx'] = LANGUAGE_TSX;
extensionToMode['txt'] = LANGUAGE_TEXT;
extensionToMode['xml'] = LANGUAGE_XML;
extensionToMode['yaml'] = LANGUAGE_YAML;

fileNameToMode['LICENSE'] = LANGUAGE_TEXT;
fileNameToMode['.gitignore'] = LANGUAGE_TEXT;

/**
 * Given a file name, determines the language (mode).
 * The mode returned is a string containing the canonical mode name.
 * If the mode cannot be determined, then undefined is returned.
 */
export function modeFromName(fileName: string): LanguageModeId | undefined {
    const period = fileName.lastIndexOf('.');
    if (period >= 0) {
        const extension = fileName.substring(period + 1);
        const mode = extensionToMode[extension];
        if (mode) {
            return mode;
        }
        else {
            console.warn(`modeFromName('${fileName}') can't figure that one out.`);
            return void 0;
        }
    }
    if (fileNameToMode[fileName]) {
        return fileNameToMode[fileName];
    }
    console.warn(`modeFromName('${fileName}') can't figure that one out.`);
    return void 0;
}
