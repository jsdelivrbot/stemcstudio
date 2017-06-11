import { isJavaScript } from './isJavaScript';
import { isPython } from './isPython';
import { isTypeScript } from './isTypeScript';

/**
 * Determines, based upon the fileName, whether the file is processed as a script by the language service.
 * The files currently processed are JavaScript, Python, and TypeScript.
 */
export function isLanguageServiceScript(fileName: string): boolean {
    return isTypeScript(fileName) || isJavaScript(fileName) || isPython(fileName);
}
