function getExtension(path: string): string {
    const basename = path.split(/[\\/]/).pop();
    if (basename) {
        const pos = basename.lastIndexOf(".");
        if (basename === "" || pos < 1) {
            return "";
        }
        return basename.slice(pos + 1);
    }
    else {
        throw new Error(`path ${path} has no basename`);
    }
}

export function prefixFromPath(path: string): string {
    const extension = getExtension(path);
    return path.substring(0, path.length - extension.length - 1);
}
