import IDoodle from '../services/doodles/IDoodle';
import IDoodleConfig from '../services/cloud/IDoodleConfig';
import IOptionManager from '../services/options/IOptionManager';

// Temporary to ensure correct Gist serialization.
function depObject(names: string[], options: IOptionManager): { [key: string]: string } {
    function version(name: string): string {
        const matching = options.filter(function(option) { return option.name === name; });
        if (matching.length > 0) {
            return matching[0].version;
        }
        else {
            return undefined;
        }
    }
    const obj: { [key: string]: string } = {};
    names.forEach(function(name: string) {
        obj[name] = version(name);
    });
    return obj;
}

/**
 * Extracts the configuration part of the doodle.
 * TODO: Extract into a service and inject the options.
 */
export default function(doodle: IDoodle, options: IOptionManager): IDoodleConfig {
    return {
        uuid: doodle.uuid,
        description: doodle.description,
        dependencies: depObject(doodle.dependencies, options),
        operatorOverloading: doodle.operatorOverloading
    };
}
