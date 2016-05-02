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
    createDoodle(template: ITemplate, description?: string);
    suggestName(): string;
}

export default IDoodleManager;
