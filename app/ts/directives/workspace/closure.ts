import IOption from '../../services/options/IOption';
import IOptionManager from '../../services/options/IOptionManager';
import namesToOptions from './namesToOptions';
import StringSet from '../../utils/StringSet';

/**
 * Compute the closure of the options.
 */
export default function closure(options: IOption[], manager: IOptionManager): IOption[] {
    const packageNames = new StringSet();
    options.forEach(function (option) {
        packageNames.add(option.packageName);
    });
    let done = false;
    while (!done) {
        const size = packageNames.size();
        // TODO: This only computes the closure. It does not sort into for dependencies.
        namesToOptions(packageNames.toArray(), manager).forEach(function (option: IOption) {
            // TODO: Use Object.keys and for-of.
            for (const packageName in option.dependencies) {
                if (option.dependencies.hasOwnProperty(packageName)) {
                    packageNames.add(packageName);
                }
            }
        });

        done = size === packageNames.size();
    }
    return namesToOptions(packageNames.toArray(), manager);
}
