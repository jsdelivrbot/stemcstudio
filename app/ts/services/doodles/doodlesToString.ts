import Doodle from './Doodle';
import { doodleToSerializable } from './doodleToSerializable';

export function doodlesToString(doodles: Doodle[]): string {
    return JSON.stringify(doodles.map(doodle => doodleToSerializable(doodle)));
}
