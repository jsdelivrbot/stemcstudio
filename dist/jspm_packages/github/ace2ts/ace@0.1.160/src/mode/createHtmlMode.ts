import HtmlMode from './HtmlMode';

/**
 * createHtmlMode
 */
export default function(workerUrl: string, scriptImports: string[]) {
    return new HtmlMode(workerUrl, scriptImports);
}
