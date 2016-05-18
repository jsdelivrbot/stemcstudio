import IOption from '../../services/options/IOption';
import IOptionManager from '../../services/options/IOptionManager';

export default function namesToOptions(names: string[], options: IOptionManager): IOption[] {
    return options.filter(function(option) { return names.indexOf(option.name) >= 0; });
}
