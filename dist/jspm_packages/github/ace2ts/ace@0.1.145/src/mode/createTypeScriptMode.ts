import TypeScriptMode from './TypeScriptMode';

/**
 * createTypeScriptMode
 */
export default function(workerUrl: string, scriptImports: string[]) {
    return new TypeScriptMode(workerUrl, scriptImports)
}
