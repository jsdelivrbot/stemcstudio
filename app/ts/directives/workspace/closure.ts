import IOption from '../../services/options/IOption';
import IOptionManager from '../../services/options/IOptionManager';
import namesToOptions from './namesToOptions';
import StringSet from '../../utils/StringSet';

/**
 * Compute the closure of the options.
 */
export default function closure(options: IOption[], manager: IOptionManager): IOption[] {
    const nameSet = new StringSet();
    options.forEach(function(option) {
        nameSet.add(option.name);
    });
    let done = false;
    while (!done) {
        const size = nameSet.size();
        // TODO: This only computes the closure. It does not sort into for dependencies.
        namesToOptions(nameSet.toArray(), manager).forEach(function(option: IOption) {
            for (let name in option.dependencies) {
                if (option.dependencies.hasOwnProperty(name)) {
                    nameSet.add(name);
                }
            }
        });

        done = size === nameSet.size();
    }
    return namesToOptions(nameSet.toArray(), manager);
}
