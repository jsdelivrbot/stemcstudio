import { IOption } from '../../services/options/IOption';
import { IOptionManager } from '../../services/options/IOptionManager';

/**
 * Filters the `options` using the provided `packageNames`.
 */
export function packageNamesToOptions(packageNames: string[], optionManager: IOptionManager): IOption[] {
    return optionManager.filter(function (option) { return packageNames.indexOf(option.packageName) >= 0; });
}
