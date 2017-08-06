/**
 * 
 */
export function stripExtension(path: string): string {
    const pos = path.lastIndexOf('.');
    return path.substring(0, pos);
}
