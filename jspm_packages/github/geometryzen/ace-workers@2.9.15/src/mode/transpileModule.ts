function endsWith(str: string, suffix: string): boolean {
    const expectedPos = str.length - suffix.length;
    return expectedPos >= 0 && str.indexOf(suffix, expectedPos) === expectedPos;
}

function fileExtensionIs(path: string, extension: string): boolean {
    return path.length > extension.length && endsWith(path, extension);
}

/**
 * A thin wrapper around Program.emit so that custom transformers are used.
 */
export default function transpileModule(program: ts.Program, sourceFile: ts.SourceFile, customTransformers: ts.CustomTransformers): ts.TranspileOutput {

    let outputText: string;
    let sourceMapText: string;

    function writeFile(fileName: string, text: string, writeByteOrderMark: boolean, onError?: (message: string) => void, sourceFiles?: ts.SourceFile[]): void {
        if (fileExtensionIs(fileName, ".map")) {
            // This is called when the compiler settings in the host request source maps.
            sourceMapText = text;
        }
        else if (fileExtensionIs(fileName, ".d.ts")) {
            // Ignore, but this IS called.
        }
        else if (fileExtensionIs(fileName, ".js")) {
            outputText = text;
        }
        else {
            console.warn(`fileName => ${fileName}`);
        }
    }

    program.emit(sourceFile, writeFile, void 0, false, customTransformers);

    return { outputText, sourceMapText };
}
