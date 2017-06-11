/**
 * Returns `true` if the fileName has the `js` or `jsx` extension.
 */
export function isJavaScript(path: string): boolean {
    const period = path.lastIndexOf('.');
    if (period >= 0) {
        const extension = path.substring(period + 1);
        switch (extension) {
            case 'js':
            case 'jsx': {
                return true;
            }
            default: {
                return false;
            }
        }
    }
    console.warn(`isJavaScript('${path}') can't figure that one out.`);
    return false;
}
