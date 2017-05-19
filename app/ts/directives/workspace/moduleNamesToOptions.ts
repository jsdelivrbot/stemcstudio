import { IOption } from '../../services/options/IOption';
import { IOptionManager } from '../../services/options/IOptionManager';

/**
 * Filters the `options` using the provided `packageNames`.
 */
export function moduleNamesToOptions(moduleNames: string[], optionManager: IOptionManager): IOption[] {
    return optionManager.filter(function (option) { return moduleNames.indexOf(option.moduleName) >= 0; });
}
