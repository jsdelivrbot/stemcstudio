import isUndefined from '../../utils/isUndefined';

/**
 * Sets a string[] property on a target object.
 * Empty arrays remove the corresponding property name.
 * Undefined values remove the corresponding property name.
 */
export function setOptionalStringArrayProperty(name: string, value: string[], target: { [name: string]: any }): void {
    if (Array.isArray(value)) {
        if (value.length > 0) {
            target[name] = value;
        }
        else {
            // A zero-length array is interpreted as omitting the property.
            delete target[name];
        }
    }
    else if (isUndefined(value)) {
        delete target[name];
    }
    else {
        throw new TypeError(`${name} must be a string[] or undefined.`);
    }
}
