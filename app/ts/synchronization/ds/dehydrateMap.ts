import FzSerializable from './FzSerializable';

/**
 * 
 */
export default function dehydrateMap<T>(map: { [key: string]: FzSerializable<T> }): { [key: string]: T } {
    const result: { [key: string]: T } = {};
    const keys = Object.keys(map);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const serializable = map[key];
        result[key] = serializable.dehydrate();
    }
    return result;
}
