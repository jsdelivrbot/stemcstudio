import TypeScriptMode from './TypeScriptMode';

export default function createTypeScriptMode(workerUrl: string, scriptImports: string[]) {
    return new TypeScriptMode(workerUrl, scriptImports)
}
