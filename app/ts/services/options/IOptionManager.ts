import IOption from './IOption';

/**
 *
 */
interface IOptionManager {
    unshift(doodle: IOption): void;
    length: number;
    filter(callback: (doodle: IOption, index: number, array: IOption[]) => boolean): IOption[];
    deleteOption(name: string): void;
}

export default IOptionManager;
