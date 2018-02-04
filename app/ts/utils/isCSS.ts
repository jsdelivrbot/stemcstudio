/**
 * Returns `true` if the fileName has the css extension.
 */
export function isCSS(path: string): boolean {
    const period = path.lastIndexOf('.');
    if (period >= 0) {
        const extension = path.substring(period + 1);
        switch (extension) {
            case 'css': {
                return true;
            }
            default: {
                return false;
            }
        }
    }
    console.warn(`isCSS('${path}') can't figure that one out.`);
    return false;
}
