import Doodle from './Doodle';
import ITemplate from '../templates/ITemplate';

interface IDoodleManager {
    unshift(doodle: Doodle): void;
    length: number;
    filter(callback: (doodle: Doodle, index: number, array: Doodle[]) => boolean): Doodle[];
    current(): Doodle;
    makeCurrent(doodle: Doodle): void;
    deleteDoodle(doodle: Doodle): void;
    updateStorage(): void;
    /**
     * Creates a new Doodle from the specified template and makes it the current doodle.
     */
    createDoodle(template: ITemplate, description?: string): void;
    suggestName(): string;
}

export default IDoodleManager;
