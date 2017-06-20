import { Session } from './Session';

/**
 *
 */
export class Rule<T> {
    public priority: number;

    /**
     *
     */
    constructor(
        public name: string,
        options: {
            priority?: number;
            salience?: number;
        },
        public pattern: (facts: T) => boolean,
        public action: (facts: T, session: Session<T>, next: (reason: any) => any) => any
    ) {
        this.priority = options.priority || options.salience || 0;
    }
}
