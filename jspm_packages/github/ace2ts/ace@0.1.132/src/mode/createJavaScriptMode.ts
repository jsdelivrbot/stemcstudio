import JavaScriptMode from './JavaScriptMode';

export default function createCssMode(workerUrl: string, scriptImports: string[]) {
    return new JavaScriptMode(workerUrl, scriptImports)
}
