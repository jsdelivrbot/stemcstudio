import IOption from '../../services/options/IOption';
import IOptionManager from '../../services/options/IOptionManager';

/**
 * Filters the `options` using the provided `moduleNames`.
 */
export default function namesToOptions(moduleNames: string[], options: IOptionManager): IOption[] {
    return options.filter(function (option) { return moduleNames.indexOf(option.moduleName) >= 0; });
}
