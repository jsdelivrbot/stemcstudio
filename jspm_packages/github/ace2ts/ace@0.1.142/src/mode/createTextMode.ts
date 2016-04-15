import TextMode from './TextMode';

export default function createCssMode(workerUrl: string, scriptImports: string[]) {
    return new TextMode(workerUrl, scriptImports)
}
