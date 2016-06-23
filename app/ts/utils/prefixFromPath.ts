function getExtension(path: string): string {
    const basename = path.split(/[\\/]/).pop();
    const pos = basename.lastIndexOf(".");
    if (basename === "" || pos < 1) {
        return "";
    }
    return basename.slice(pos + 1);
}

export default function prefixFromPath(path: string): string {
    const extension = getExtension(path);
    return path.substring(0, path.length - extension.length - 1);
}
