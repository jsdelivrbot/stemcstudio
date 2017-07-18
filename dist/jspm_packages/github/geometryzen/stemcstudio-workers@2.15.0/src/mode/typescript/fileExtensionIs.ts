export type Extension = '.d.ts' | '.d.py' | '.map' | '.js' | '.jsx' | '.py' | '.pyx' | '.ts' | '.tsx';

function endsWith(path: string, suffix: Extension): boolean {
    const expectedPos = path.length - suffix.length;
    return expectedPos >= 0 && path.indexOf(suffix, expectedPos) === expectedPos;
}


export function fileExtensionIs(path: string, extension: Extension): boolean {
    return path.length > extension.length && endsWith(path, extension);
}

export function removeExtension(path: string, extension: Extension): string {
    const endPos = path.length - extension.length;
    return path.substring(0, endPos);
}
