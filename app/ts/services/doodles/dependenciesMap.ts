import IOptionManager from '../options/IOptionManager';

/**
 * Converts an array of dependency names to a map of name to semantic version.
 * TODO: This is temporary until we do proper semantic versioning.
 */
export default function dependenciesMap(names: string[], options: IOptionManager): { [key: string]: string } {
    function version(moduleName: string): string {
        const matching = options.filter(function (option) { return option.moduleName === moduleName; });
        if (matching.length > 0) {
            return matching[0].version;
        }
        else {
            return 'latest';
        }
    }
    const obj: { [key: string]: string } = {};
    names.forEach(function (name: string) {
        obj[name] = version(name);
    });
    return obj;
}
