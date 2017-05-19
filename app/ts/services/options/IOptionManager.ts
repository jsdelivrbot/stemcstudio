import { IOption } from './IOption';

/**
 *
 */
export interface IOptionManager {
    /**
     *
     */
    filter(callback: (option: IOption, index: number, array: IOption[]) => boolean): IOption[];
}

export const OPTION_MANAGER_SERVICE_UUID = 'optionManager';
