import { IOptionManager } from '../../services/options/IOptionManager';

/**
 * Converts an array of dependency names to a map of name to semantic version.
 * TODO: This is temporary until we do proper semantic versioning.
 */
export default function dependenciesMap(packageNames: string[], optionManager: IOptionManager): { [packageName: string]: string } {
    function version(packageName: string): string {
        const matching = optionManager.filter(function (option) { return option.packageName === packageName; });
        if (matching.length > 0) {
            return matching[0].version;
        }
        else {
            return 'latest';
        }
    }
    const obj: { [packageName: string]: string } = {};
    packageNames.forEach(function (packageName: string) {
        obj[packageName] = version(packageName);
    });
    return obj;
}
