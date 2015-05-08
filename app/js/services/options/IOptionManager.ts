/// <reference path="IOption.ts" />
interface IOptionManager {
  unshift(doodle: IOption): void;
  length: number;
  filter(callback: (doodle: IOption, index: number, array: IOption[]) => boolean): IOption[];
  deleteOption(name: string): void;
}