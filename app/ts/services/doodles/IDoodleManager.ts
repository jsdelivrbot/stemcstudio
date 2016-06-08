import Doodle from './Doodle';

/**
 * TODO: Move this towards being an API for LocalStorage.
 */
interface IDoodleManager {
    unshift(doodle: Doodle): void;
    length: number;
    filter(callback: (doodle: Doodle, index: number, array: Doodle[]) => boolean): Doodle[];
    /**
     * @deprecated?
     */
    current(): Doodle;
    /**
     * @deprecated?
     */
    makeCurrent(doodle: Doodle): void;
    deleteDoodle(doodle: Doodle): void;
    updateStorage(): void;
    /**
     * Creates a new Doodle from the specified template and makes it the current doodle.
     * @deprecated
     */
    // createDoodle(template: ITemplate, description?: string): void;
    suggestName(): string;
}

export default IDoodleManager;
