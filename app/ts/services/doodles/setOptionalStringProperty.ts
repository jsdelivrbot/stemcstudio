import { isString } from '../../utils/isString';
import { isUndefined } from '../../utils/isUndefined';

/**
 * Sets a string property on a target object.
 * Leading and trailing whitespace is ignored.
 * Empty strings remove the corresponding property name.
 * Undefined values remove the corresponding property name.
 */
export function setOptionalStringProperty(name: string, value: string | undefined, target: { [name: string]: any }): void {
    if (isString(value)) {
        // Ignore leading and trailing whitespace.
        value = value.trim();
        if (value.length > 0) {
            target[name] = value;
        }
        else {
            // A zero-length string is interpreted as omitting the property.
            delete target[name];
        }
    }
    else if (isUndefined(value)) {
        delete target[name];
    }
    else {
        throw new TypeError(`${name} must be a string or undefined.`);
    }
}
