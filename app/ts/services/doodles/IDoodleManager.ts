import { Doodle } from './Doodle';

/**
 * API for LocalStorage of Doodle(s).
 */
export interface IDoodleManager {

    /**
     * Inserts the doodle at the front of the list of doodles, making it the current doodle.
     */
    addHead(doodle: Doodle): void;

    /**
     * Inserts the doodle ath the back of the list of doodles.
     */
    addTail(doodle: Doodle): void;

    length: number;
    filter(callback: (doodle: Doodle, index: number, array: Doodle[]) => boolean): Doodle[];
    current(): Doodle | undefined;
    makeCurrent(doodle: Doodle): void;
    deleteDoodle(doodle: Doodle): void;

    /**
     * Persist the list of doodles to Local Storage.
     */
    updateStorage(): void;

    /**
     * Creates a standalone empty Doodle. The doodle is not part of the list.
     */
    createDoodle(): Doodle;
    suggestName(): string;
}

export const DOODLE_MANAGER_SERVICE_UUID = 'doodleManager';
