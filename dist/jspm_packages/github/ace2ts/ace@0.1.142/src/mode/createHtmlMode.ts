import HtmlMode from './HtmlMode';

export default function createCssMode(workerUrl: string, scriptImports: string[]) {
    return new HtmlMode(workerUrl, scriptImports)
}
