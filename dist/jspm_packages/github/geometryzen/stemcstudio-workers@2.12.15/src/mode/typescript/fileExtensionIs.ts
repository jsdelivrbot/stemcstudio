function endsWith(str: string, suffix: string): boolean {
    const expectedPos = str.length - suffix.length;
    return expectedPos >= 0 && str.indexOf(suffix, expectedPos) === expectedPos;
}

export type Extension = '.d.ts' | '.d.py' | '.map' | '.js' | '.jsx' | '.py' | '.pyx' | '.ts' | '.tsx';

export function fileExtensionIs(path: string, extension: Extension): boolean {
    return path.length > extension.length && endsWith(path, extension);
}
