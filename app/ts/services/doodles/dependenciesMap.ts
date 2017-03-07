import IOptionManager from '../options/IOptionManager';

/**
 * Converts an array of dependency names to a map of name to semantic version.
 * TODO: This is temporary until we do proper semantic versioning.
 */
export default function dependenciesMap(packageNames: string[], options: IOptionManager): { [key: string]: string } {
    function version(packageName: string): string {
        const matching = options.filter(function (option) { return option.packageName === packageName; });
        if (matching.length > 0) {
            return matching[0].version;
        }
        else {
            return 'latest';
        }
    }
    const obj: { [key: string]: string } = {};
    packageNames.forEach(function (packageName: string) {
        obj[packageName] = version(packageName);
    });
    return obj;
}
