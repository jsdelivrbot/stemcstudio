import { IToken } from './IToken';

export class NameStack {
    _stack: IToken[];
    constructor() {
        this._stack = [];
    }

    get length() {
        return this._stack.length;
    }

    /**
     * Create a new entry in the stack. Useful for tracking names across
     * expressions.
     */
    push() {
        this._stack.push(null);
    }

    /**
     * Discard the most recently-created name on the stack.
     */
    pop() {
        this._stack.pop();
    }

    /**
     * Update the most recent name on the top of the stack.
     *
     * @param {object} token The token to consider as the source for the most
     *                       recent name.
     */
    set(token: IToken) {
        this._stack[this.length - 1] = token;
    }

    /**
     * Generate a string representation of the most recent name.
     */
    infer(): string {
        let nameToken = this._stack[this.length - 1];

        // During expected operation, the topmost entry on the stack will only
        // reflect the current function's name when the function is declared without
        // the `function` keyword (i.e. for in-line accessor methods). In other
        // cases, the `function` expression itself will introduce an empty entry on
        // the top of the stack, and this should be ignored.
        if (!nameToken || nameToken.type === "class") {
            nameToken = this._stack[this.length - 2];
        }

        if (!nameToken) {
            return "(empty)";
        }

        const type = nameToken.type;

        if (type !== "(string)" && type !== "(number)" && type !== "(identifier)" && type !== "default") {
            return "(expression)";
        }

        let prefix = "";

        if (nameToken.accessorType) {
            prefix = nameToken.accessorType + " ";
        }

        return prefix + nameToken.value;
    }
}
