import { isJavaScript } from './isJavaScript';
import { isPython } from './isPython';
import { isTypeScript } from './isTypeScript';

export function isLanguageServiceScript(fileName: string): boolean {
    return isTypeScript(fileName) || isJavaScript(fileName) || isPython(fileName);
}
