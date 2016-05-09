import Session from './Session';

/**
 * @class Rule
 */
export default class Rule<T> {
    public priority: number;

    /**
     * @class Rule
     * @constructor
     * @param name {string}
     * @param options
     * @param pattern
     * @param action
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
