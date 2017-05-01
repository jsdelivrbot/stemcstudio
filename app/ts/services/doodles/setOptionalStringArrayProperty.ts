/**
 * Sets a string[] property on a target object.
 * Empty arrays remove the corresponding property name.
 * Undefined values remove the corresponding property name.
 */
export function setOptionalStringArrayProperty(name: string, values: string[], target: { [name: string]: any }): void {
    if (Array.isArray(values)) {
        if (values.length > 0) {
            target[name] = values;
        }
        else {
            // A zero-length array is interpreted as omitting the property.
            delete target[name];
        }
    }
    else if (typeof values === 'undefined') {
        delete target[name];
    }
    else {
        throw new TypeError(`${name} must be a string[] or undefined.`);
    }
}
