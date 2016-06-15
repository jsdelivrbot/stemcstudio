import Doodle from './Doodle';

/**
 * API for LocalStorage of Doodle(s).
 */
interface IDoodleManager {
    /**
     * Inserts the doodle at the top of the list of doodles, making it the current doodle.
     */
    unshift(doodle: Doodle): void;
    length: number;
    filter(callback: (doodle: Doodle, index: number, array: Doodle[]) => boolean): Doodle[];
    current(): Doodle;
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

export default IDoodleManager;
