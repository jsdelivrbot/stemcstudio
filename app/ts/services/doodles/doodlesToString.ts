import Doodle from './Doodle';
import doodleToSerializable from './doodleToSerializable';

export default function doodlesToString(doodles: Doodle[]): string {
    return JSON.stringify(doodles.map(doodle => doodleToSerializable(doodle)))
}
