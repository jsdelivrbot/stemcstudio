import TextMode from './TextMode';

/**
 * createTextMode
 */
export default function(workerUrl: string, scriptImports: string[]) {
    return new TextMode(workerUrl, scriptImports)
}
