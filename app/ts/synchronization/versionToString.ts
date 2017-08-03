export function versionToString(version: number): string {
    const kind = typeof version;
    if (kind === 'number') {
        return `${version}`;
    }
    else if (kind === 'undefined') {
        return '';
    }
    else {
        throw new TypeError(`unexpected version typeof => '${kind}'`);
    }
}
