import Command from '../commands/Command';

/**
 * @class KeyboardResponse
 */
interface KeyboardResponse {

    /**
     * @property command
     * @type Command
     */
    command: Command;

    /**
     * @property args
     * @type any
     */
    args?: any;

    /**
     * @property passEvent
     * @type boolean
     */
    passEvent?: boolean;
}

export default KeyboardResponse;
