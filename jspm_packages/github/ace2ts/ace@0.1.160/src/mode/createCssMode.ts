import CssMode from './CssMode';

/**
 * createCssMode
 */
export default function(workerUrl: string, scriptImports: string[]) {
    return new CssMode(workerUrl, scriptImports);
}
