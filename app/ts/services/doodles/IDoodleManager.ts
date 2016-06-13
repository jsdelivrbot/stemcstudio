import Doodle from './Doodle';

/**
 * TODO: Move this towards being an API for LocalStorage.
 */
interface IDoodleManager {
    /**
     * Inserts the doodle at the top of the list of doodles.
     */
    unshift(doodle: Doodle): void;
    length: number;
    filter(callback: (doodle: Doodle, index: number, array: Doodle[]) => boolean): Doodle[];
    current(): Doodle;
    makeCurrent(doodle: Doodle): void;
    deleteDoodle(doodle: Doodle): void;
    updateStorage(): void;
    /**
     * Creates a standalone empty Doodle.
     */
    createDoodle(): Doodle;
    suggestName(): string;
}

export default IDoodleManager;
