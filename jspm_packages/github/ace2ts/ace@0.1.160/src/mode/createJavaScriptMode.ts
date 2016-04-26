import JavaScriptMode from './JavaScriptMode';

/**
 * createJavaScriptMode
 */
export default function createJavaScriptMode(workerUrl: string, scriptImports: string[]) {
    return new JavaScriptMode(workerUrl, scriptImports);
}
