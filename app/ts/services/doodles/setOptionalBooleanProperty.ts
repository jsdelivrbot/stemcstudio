import isBoolean from '../../utils/isBoolean';
import isUndefined from '../../utils/isUndefined';

/**
 * Sets a boolean property on a target object.
 * 'false' values remove the corresponding property name.
 * Undefined values remove the corresponding property name.
 */
export default function setOptionalBooleanProperty(name: string, value: boolean, target: { [name: string]: any }): void {
    if (isBoolean(value)) {
        if (value) {
            target[name] = value;
        }
        else {
            delete target[name];
        }
    }
    else if (isUndefined(value)) {
        delete target[name];
    }
    else {
        throw new TypeError(`${name} must be a boolean or undefined.`);
    }
}
