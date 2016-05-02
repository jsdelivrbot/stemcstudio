/**
 * Extracts the names from a map of name to semantic version range.
 * TODO: Temporary until we do semantic versioning.
 */
export default function dependencyNames(deps: { [key: string]: string }): string[] {
    const ds: string[] = [];
    for (let prop in deps) {
        if (deps.hasOwnProperty(prop)) {
            ds.push(prop);
        }
    }
    return ds;
}
