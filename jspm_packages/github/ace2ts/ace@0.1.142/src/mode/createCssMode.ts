import CssMode from './CssMode';

export default function createCssMode(workerUrl: string, scriptImports: string[]) {
    return new CssMode(workerUrl, scriptImports)
}
