import Command from '../commands/Command';

/**
 *
 */
interface KeyboardResponse {
    /**
     *
     */
    command: Command;
    /**
     *
     */
    args?: any;
    /**
     *
     */
    passEvent?: boolean;
}

export default KeyboardResponse;
