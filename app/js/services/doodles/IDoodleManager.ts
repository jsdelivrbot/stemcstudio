/// <reference path="IDoodle.ts" />
interface IDoodleManager {
  unshift(doodle: IDoodle): void;
  length: number;
  filter(callback: (doodle: IDoodle, index: number, array: IDoodle[]) => boolean): IDoodle[];
  current(): IDoodle;
  activeDoodle(uuid: string): void;
  deleteDoodle(uuid: string): void;
  updateStorage(): void;
}