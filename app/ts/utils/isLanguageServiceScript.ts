import { isJavaScript } from './isJavaScript';
import { isPython } from './isPython';
import { isTypeScript } from './isTypeScript';
import { SYSTEM_DOT_CONFIG_DOT_JS } from '../constants';

export function isConfigFile(fileName: string): boolean {
    if (fileName === SYSTEM_DOT_CONFIG_DOT_JS) {
        return true;
    }
    else {
        return false;
    }
}

/**
 * Determines, based upon the fileName, whether the file is processed as a script by the language service.
 * The files currently processed are JavaScript, Python, and TypeScript.
 * We also include special configuration files. 
 */
export function isLanguageServiceScript(fileName: string): boolean {
    if (isConfigFile(fileName)) {
        return false;
    }
    else {
        return isTypeScript(fileName) || isJavaScript(fileName) || isPython(fileName);
    }
}
