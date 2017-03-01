import FzSerializable from './FzSerializable';

/**
 * 
 */
export default function dehydrateMap<T>(map: { [key: string]: FzSerializable<T> }): { [key: string]: T } {
    const result: { [key: string]: T } = {};
    for (const key of Object.keys(map)) {
        const serializable = map[key];
        result[key] = serializable.dehydrate();
    }
    return result;
}
