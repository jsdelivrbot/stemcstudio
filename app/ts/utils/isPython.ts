/**
 * Returns `true` if the fileName has the `py` or `pyx` extension.
 */
export function isPython(path: string): boolean {
    const period = path.lastIndexOf('.');
    if (period >= 0) {
        const extension = path.substring(period + 1);
        switch (extension) {
            case 'py':
            case 'pyx': {
                return true;
            }
            default: {
                return false;
            }
        }
    }
    console.warn(`isPython('${path}') can't figure that one out.`);
    return false;
}
