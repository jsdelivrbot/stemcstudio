import { Command } from './Command';

export interface CommandExecutor<TARGET> {
    exec(command: Command<TARGET>, target?: TARGET, args?: any): boolean;
    getCommandByName(name: string): Command<TARGET>;
}
