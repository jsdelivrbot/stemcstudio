import { deepCopy } from "../lib/lang";
import Rule from '../Rule';
import Highlighter from './Highlighter';
import HighlighterFactory from './HighlighterFactory';

const pushState = function (this: Rule, currentState: string, stack: string[]): string {
    if (currentState !== "start" || stack.length) {
        stack.unshift(this.nextState, currentState);
    }
    return this.nextState;
};

const popState = function (this: Rule, currentState: string, stack: string[]): string {
    stack.shift();
    return stack.shift() || "start";
};

/**
 *
 */
export default class TextHighlightRules implements Highlighter {
    /**
     * FIXME: This should be called rulesByStateName.
     */
    $rules: { [stateName: string]: Rule[] };

    $embeds: string[];

    $keywordList: string[];

    /**
     *
     */
    constructor() {

        // regexp must not have capturing parentheses
        // regexps are ordered -> the first match is used

        this.$rules = {
            "start": [
                {
                    token: "empty_line",
                    regex: '^$'
                },
                {
                    defaultToken: "text"
                }
            ]
        };
    }

    /**
     * @param rules
     * @param prefix
     */
    addRules(rules: { [name: string]: Rule[] }, prefix?: string): void {
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
                        if (rule.nextState && rule.nextState.indexOf(prefix) !== 0)
                            rule.nextState = prefix + rule.nextState;
                    }
                }
                this.$rules[prefix + key] = state;
            }
        }
    }

    /**
     *
     */
    getRules(): { [name: string]: Rule[] } {
        return this.$rules;
    }

    /**
     * FIXME: typing of 1st parameter.
     */
    embedRules(highlightRules: HighlighterFactory | { [stateName: string]: Rule[] }, prefix: string, escapeRules: Rule[], states?: string[], append?: boolean): void {
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

        if (!this.$embeds) {
            this.$embeds = [];
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
                let toInsert: Rule[] = null;
                if (Array.isArray(rule)) {
                    toInsert = rule;
                    rule = {};
                }
                // Possibly dead code...
                if (!rule.regex && rule['start']) {
                    rule.regex = rule['start'];
                    if (!rule.next)
                        rule.next = [];
                    (<any>rule.next).push({
                        defaultToken: rule.token
                    }, {
                            token: rule.token + ".end",
                            regex: rule['end'] || rule['start'],
                            next: "pop"
                        });
                    rule.token = rule.token + ".start";
                    rule['push'] = <any>true;
                }
                const next = rule.next || rule.push;
                if (next && Array.isArray(next)) {
                    let stateName = rule['stateName'];
                    if (!stateName) {
                        stateName = rule.token;
                        if (typeof stateName !== "string")
                            stateName = stateName[0] || "";
                        if (rules[stateName])
                            stateName += id++;
                    }
                    rules[stateName] = next;
                    rule.next = stateName;
                    processState(stateName);
                } else if (next === "pop") {
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
                    let args: (number | Rule)[] = [i, 1];
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
                    rule.token = this.createKeywordMapper(
                        rule.keywordMap, rule.defaultToken || "text", rule.caseInsensitive
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
