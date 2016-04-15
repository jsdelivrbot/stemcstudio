import Doodle from './Doodle';

interface IDoodleManager {
    unshift(doodle: Doodle): void;
    length: number;
    filter(callback: (doodle: Doodle, index: number, array: Doodle[]) => boolean): Doodle[];
    current(): Doodle;
    makeCurrent(uuid: string): void;
    deleteDoodle(uuid: string): void;
    updateStorage(): void;
    createDoodle(template: Doodle, description?: string);
    suggestName(): string;
}

export default IDoodleManager;
