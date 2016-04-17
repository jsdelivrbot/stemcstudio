import MarkdownMode from './MarkdownMode';

/**
 * createMarkdownMode
 */
export default function(workerUrl: string, scriptImports: string[]) {
    return new MarkdownMode(workerUrl, scriptImports)
}
