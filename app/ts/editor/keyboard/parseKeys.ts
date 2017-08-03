import { FUNCTION_KEYS, KEY_MODS } from "../lib/keys";
import { Keys as keyCodes } from "../lib/keys";
import { KeyHash } from './KeyHash';
/**
 * Accepts key combinations in the form ctrl+Enter or ctrl-Enter.
 * Does not expect '|' delimited key combinations.
 * keys without modifiers or shift only.
 */
export function parseKeys(keys: string): KeyHash {

    if (keys.indexOf(" ") !== -1) {
        keys = keys.split(/\s+/).pop() as string;
    }

    const parts = keys.toLowerCase().split(/[\-\+]([\-\+])?/).filter(function (x) { return x; });
    let key = parts.pop() as string;

    const keyCode = keyCodes[key];
    if (FUNCTION_KEYS[keyCode]) {
        key = FUNCTION_KEYS[keyCode].toLowerCase();
    }
    else if (!parts.length) {
        return { key: key, hashId: -1 };
    }
    else if (parts.length === 1 && parts[0] === "shift") {
        return { key: key.toUpperCase(), hashId: -1 };
    }

    let hashId = 0;
    for (let i = parts.length; i--;) {
        const modifier = KEY_MODS[parts[i]];
        if (modifier === null) {
            throw new Error("invalid modifier " + parts[i] + " in " + keys);
        }
        hashId |= modifier;
    }
    return { key: key, hashId: hashId };
}
