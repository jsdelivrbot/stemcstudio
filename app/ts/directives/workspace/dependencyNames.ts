/**
 * Extracts the names from a map of name to semantic version range.
 * TODO: Temporary until we do semantic versioning.
 */
export function dependencyNames(deps: { [packageName: string]: string }): string[] {
    const ds: string[] = [];
    for (let prop in deps) {
        if (deps.hasOwnProperty(prop)) {
            ds.push(prop);
        }
    }
    return ds;
}
