import { Command } from '../commands/Command';

/**
 *
 */
export interface KeyboardResponse<TARGET> {
    /**
     *
     */
    command: Command<TARGET> | null;
    /**
     *
     */
    args?: any;
    /**
     *
     */
    passEvent?: boolean;
}
