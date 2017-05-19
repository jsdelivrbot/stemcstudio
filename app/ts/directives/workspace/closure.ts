import { IOption } from '../../services/options/IOption';
import { IOptionManager } from '../../services/options/IOptionManager';
import { packageNamesToOptions } from './packageNamesToOptions';
import { StringSet } from '../../utils/StringSet';

/**
 * Compute the closure of the options.
 * TODO: Most likely dead code after we remove the dead consumer.
 */
export function closure(options: IOption[], optionManager: IOptionManager): IOption[] {
    const packageNames = new StringSet();
    options.forEach(function (option) {
        packageNames.add(option.packageName);
    });
    let done = false;
    while (!done) {
        const size = packageNames.size();
        // TODO: This only computes the closure. It does not sort into for dependencies.
        packageNamesToOptions(packageNames.toArray(), optionManager).forEach(function (option: IOption) {
            // TODO: Use Object.keys and for-of.
            for (const packageName in option.dependencies) {
                if (option.dependencies.hasOwnProperty(packageName)) {
                    packageNames.add(packageName);
                }
            }
        });

        done = size === packageNames.size();
    }
    return packageNamesToOptions(packageNames.toArray(), optionManager);
}
