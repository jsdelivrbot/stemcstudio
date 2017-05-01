/**
 * Sets a boolean property on a target object.
 * 'false' values remove the corresponding property name.
 * Undefined values remove the corresponding property name.
 */
export function setOptionalBooleanProperty(name: string, value: boolean | undefined, target: { [name: string]: any }): void {
    if (typeof value === 'boolean') {
        if (value) {
            target[name] = value;
        }
        else {
            delete target[name];
        }
    }
    else if (typeof value === 'undefined') {
        delete target[name];
    }
    else {
        throw new TypeError(`${name} must be a boolean or undefined.`);
    }
}
