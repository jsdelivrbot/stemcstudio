import { deepCopy } from "../lib/lang";
import { Highlighter, HighlighterRule, HighlighterStack, HighlighterStackElement } from './Highlighter';
import { HighlighterFactory } from './HighlighterFactory';

/**
 * Special value that may be assigned to a rule.next.
 * When it is encountered by the normalizer, it is replaced by a function that pos the stack.
 */
export const POP_STATE = 'pop';

export const STATE_START = 'start';

/**
 * FIXME: typing problem.
 * A Highlighter stack element is a number | string.
 * nextState is string | undefined. Should this be a HighlighterStackElement?
 */
const pushState = function (this: HighlighterRule, currentState: string, stack: HighlighterStack): HighlighterStackElement | undefined {
    // Is this convoluted in order to enable recovery from errors?
    if (currentState !== STATE_START || stack.length) {
        // Interesting that pushState pushes two states.
        // nextState ends up being the topmost element in the stack.
        // FIXME: The cast is made because Rule appears to mix design-time and run-time semantics.
        // nextState is optional and implicit at design-time, but is explicit and required at run-time?
        // This should be enforced in the normalization of the rules.
        stack.unshift(this.nextState as HighlighterStackElement, currentState);
    }
    return this.nextState;
};

/**
 * FIXME: The double-popping of the stack is unexpected.
 * I'm becoming convinced that the root cause is the redundancy of currentState and a stack taken together.
 * I expect that the stack was introduced later. The currentState should simply be the top element on the stack.
 * Does this situation exist so that the highlighter can recover from syntax errors?
 * Notice also the double-push in the pushState function.
 */
const popState = function (this: HighlighterRule, currentState: string, stack: HighlighterStack): HighlighterStackElement {
    // Why is shift called twice? Probably because we push twice in pushState!
    // console.warn(`(TextHighlightRules) popState(currentState = ${currentState}, stack = ${JSON.stringify(stack)})`);
    /*const shiftedOne =*/ stack.shift();
    // console.lg(`shiftedOne = ${shiftedOne}, stack = ${JSON.stringify(stack)}`);
    const shiftedTwo = stack.shift();
    // console.lg(`shiftedTwo = ${shiftedTwo}, stack = ${JSON.stringify(stack)}`);
    return shiftedTwo || STATE_START;
};

/**
 *
 */
export class TextHighlightRules implements Highlighter {
    /**
     * This could be called rulesByStateName.
     */
    $rules: { [stateName: string]: HighlighterRule[] };

    private readonly $embeds: string[] = [];

    $keywordList: string[];

    /**
     *
     */
    constructor() {

        // regexp must not have capturing parentheses
        // regexps are ordered -> the first match is used

        this.$rules = {};

        this.$rules[STATE_START] = [
            {
                token: "empty_line",
                regex: '^$'
            },
            {
                defaultToken: "text"
            }
        ];
    }

    /**
     * Adds a set of rules, prefixing all state names with the given prefix.
     * The name(s) of all the added rules will become 'prefix-name'
     */
    addRules(rules: { [stateName: string]: HighlighterRule[] }, prefix?: string): void {
        if (!prefix) {
            for (const key in rules) {
                if (rules.hasOwnProperty(key)) {
                    this.$rules[key] = rules[key];
                }
            }
            return;
        }
        for (const key in rules) {
            if (rules.hasOwnProperty(key)) {
                const state = rules[key];
                for (let i = 0; i < state.length; i++) {
                    const rule = state[i];
                    if (rule.next || rule.onMatch) {
                        if (typeof rule.next === "string") {
                            if (rule.next.indexOf(prefix) !== 0)
                                rule.next = prefix + rule.next;
                        }
                        if (rule.nextState && (typeof rule.nextState === 'string') && rule.nextState.indexOf(prefix) !== 0) {
                            rule.nextState = prefix + rule.nextState;
                        }
                    }
                }
                this.$rules[prefix + key] = state;
            }
        }
    }

    /**
     * Returns the rules for this highlighter.
     */
    getRules(): { [name: string]: HighlighterRule[] } {
        return this.$rules;
    }

    /**
     * Allows embedding a highlighter.
     * FIXME: typing of 1st parameter.
     */
    embedRules(highlightRules: HighlighterFactory | { [stateName: string]: HighlighterRule[] }, prefix: string, escapeRules: HighlighterRule[], states?: string[], append?: boolean): void {
        const embedRules = typeof highlightRules === "function"
            ? new highlightRules().getRules()
            : highlightRules;
        if (states) {
            for (let i = 0; i < states.length; i++) {
                states[i] = prefix + states[i];
            }
        }
        else {
            states = [];
            for (const key in embedRules) {
                if (embedRules.hasOwnProperty(key)) {
                    states.push(prefix + key);
                }
            }
        }

        this.addRules(embedRules, prefix);

        if (escapeRules) {
            const addRules = Array.prototype[append ? "push" : "unshift"];
            for (let i = 0; i < states.length; i++) {
                addRules.apply(this.$rules[states[i]], deepCopy(escapeRules));
            }
        }

        this.$embeds.push(prefix);
    }

    /**
     *
     */
    getEmbeds(): string[] {
        return this.$embeds;
    }

    /**
     * WARNING: This is a very tricky bit of code because of the typing.
     * Get some tests going before mucking with it.
     */
    normalizeRules(): void {
        let id = 0;
        const rules = this.$rules;
        const processState = (key: string) => {
            const state = rules[key];
            // Possible dead code...
            state['processed'] = true;
            for (let i = 0; i < state.length; i++) {
                let rule = state[i];
                let toInsert: HighlighterRule[] | null = null;
                if (Array.isArray(rule)) {
                    toInsert = rule;
                    rule = {};
                }
                // Possibly dead code...
                if (!rule.regex && rule[STATE_START]) {
                    rule.regex = rule['start'];
                    if (!rule.next)
                        rule.next = [];
                    (<any>rule.next).push(
                        {
                            defaultToken: rule.token
                        },
                        {
                            token: rule.token + ".end",
                            regex: rule['end'] || rule['start'],
                            next: POP_STATE
                        });
                    rule.token = rule.token + ".start";
                    rule.push = <any>true;
                }
                const next = rule.next || rule.push;
                if (next && Array.isArray(next)) {
                    let stateName = rule.stateName;
                    if (!stateName) {
                        // FIXME
                        stateName = <string>rule.token;
                        if (typeof stateName !== "string") {
                            stateName = stateName[0] || "";
                        }
                        if (rules[stateName]) {
                            stateName += id++;
                        }
                    }
                    rules[stateName] = next;
                    rule.next = stateName;
                    processState(stateName);
                }
                else if (next === POP_STATE) {
                    rule.next = popState;
                }

                if (rule.push) {
                    const nextState = rule.next || rule.push;
                    if (typeof nextState === 'string') {
                        rule.nextState = nextState;
                    }
                    else {
                        console.warn(`nextState is not a string!`);
                    }
                    rule.next = pushState;
                    delete rule.push;
                }

                if (rule.rules) {
                    for (const r in rule.rules) {
                        if (rules[r]) {
                            if (rules[r].push)
                                rules[r].push.apply(rules[r], rule.rules[r]);
                        } else {
                            rules[r] = rule.rules[r];
                        }
                    }
                }

                // FIXME: Purge the never case?
                const includeName = typeof rule === "string"
                    ? rule
                    : typeof rule.include === "string"
                        ? rule.include
                        : "";
                if (includeName) {
                    toInsert = rules[includeName];
                }

                if (toInsert) {
                    let args: (number | HighlighterRule)[] = [i, 1];
                    args = args.concat(toInsert);
                    if (rule.noEscape)
                        args = args.filter(function (x) {
                            if (typeof x === 'number') {
                                return true;
                            }
                            else {
                                return !x.next;
                            }
                        });
                    state.splice.apply(state, args);
                    // skip included rules since they are already processed
                    // i += args.length - 3;
                    i--;
                }

                if (rule.keywordMap) {
                    // TODO: Check that this cast is valid.
                    const defaultToken = <string>rule.defaultToken || "text";
                    rule.token = this.createKeywordMapper(
                        rule.keywordMap, defaultToken, rule.caseInsensitive
                    );
                    delete rule.defaultToken;
                }
            }
        };
        Object.keys(rules).forEach(processState, this);
    }

    createKeywordMapper(map: { [key: string]: string }, defaultToken: string, ignoreCase?: boolean, splitChar?: string): (value: string) => string {
        const keywords: { [key: string]: string } = Object.create(null);
        Object.keys(map).forEach(function (className: string) {
            let a = map[className];
            if (ignoreCase) {
                a = a.toLowerCase();
            }
            const list: string[] = a.split(splitChar || "|");
            for (let i = list.length; i--;) {
                keywords[list[i]] = className;
            }
        });
        // in legacy versions of opera keywords["__proto__"] sets prototype
        // even on objects with __proto__=null
        if (Object.getPrototypeOf(keywords)) {
            keywords['__proto__'] = null;
        }
        this.$keywordList = Object.keys(keywords);
        map = null;
        return ignoreCase
            ? function (value: string) { return keywords[value.toLowerCase()] || defaultToken; }
            : function (value: string) { return keywords[value] || defaultToken; };
    }

    getKeywords(): string[] {
        return this.$keywordList;
    }
}
