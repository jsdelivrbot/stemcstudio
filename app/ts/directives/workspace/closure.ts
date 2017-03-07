import IOption from '../../services/options/IOption';
import IOptionManager from '../../services/options/IOptionManager';
import namesToOptions from './namesToOptions';
import StringSet from '../../utils/StringSet';

/**
 * Compute the closure of the options.
 */
export default function closure(options: IOption[], manager: IOptionManager): IOption[] {
    const moduleNames = new StringSet();
    options.forEach(function (option) {
        moduleNames.add(option.moduleName);
    });
    let done = false;
    while (!done) {
        const size = moduleNames.size();
        // TODO: This only computes the closure. It does not sort into for dependencies.
        namesToOptions(moduleNames.toArray(), manager).forEach(function (option: IOption) {
            // TODO: Use Object.keys and for-of.
            for (const moduleName in option.dependencies) {
                if (option.dependencies.hasOwnProperty(moduleName)) {
                    moduleNames.add(moduleName);
                }
            }
        });

        done = size === moduleNames.size();
    }
    return namesToOptions(moduleNames.toArray(), manager);
}
