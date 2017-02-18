import { deepCopy } from "../lib/lang";
import Rule from '../Rule';
import HighlightRules from './HighlightRules';

/**
 *
 */
export default class TextHighlightRules implements HighlightRules {
    /**
     * FIXME: This should be called rulesByState.
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
     * @param rulesByState
     * @param prefix
     */
    addRules(rulesByState: { [name: string]: Rule[] }, prefix?: string) {
        const stateNames = Object.keys(rulesByState);
        const sLen = stateNames.length;
        if (!prefix) {
            for (let s = 0; s < sLen; s++) {
                const stateName = stateNames[s];
                this.$rules[stateName] = rulesByState[stateName];
            }
            return;
        }
        for (let s = 0; s < sLen; s++) {
            const stateName = stateNames[s];
            const rules: Rule[] = rulesByState[stateName];
            for (let i = 0; i < rules.length; i++) {
                const rule = rules[i];
                if (rule.next || rule.onMatch) {
                    if (typeof rule.next !== "string") {
                        if (rule.nextState && rule.nextState.indexOf(prefix) !== 0) {
                            rule.nextState = prefix + rule.nextState;
                        }
                    }
                    else {
                        // Because the typeof check earlier...
                        const next: string = <string>rule.next;
                        if (next.indexOf(prefix) !== 0) {
                            rule.next = prefix + rule.next;
                        }
                    }
                }
            }
            this.$rules[prefix + stateName] = rules;
        }
    }

    /**
     * FIXME: Rename getRulesByState
     */
    getRules(): { [name: string]: Rule[] } {
        return this.$rules;
    }

    /**
     * FIXME: typing of 1st parameter.
     */
    embedRules(HighlightRules, prefix: string, escapeRules: Rule[], states?: string[], append?: boolean) {
        const embedRules: { [name: string]: Rule[] } = (typeof HighlightRules === "function") ? new HighlightRules().getRules() : HighlightRules;
        if (states) {
            for (let i = 0; i < states.length; i++) {
                states[i] = prefix + states[i];
            }
        }
        else {
            states = [];
            const stateNames = Object.keys(embedRules);
            const sLen = stateNames.length;
            for (let s = 0; s < sLen; s++) {
                const stateName = stateNames[s];
                states.push(prefix + stateName);
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
    normalizeRules() {
        // WARNING: The following functions are intended to be executed with a Rule object
        // as the `this` reference. They cannot be type checked here.
        // DO NOT USE A FAT ARROW.
        const pushState = function (currentState: string, stack: string[]): string {
            // FIXME: Could be a bug here because nextState is untyped.
            // Fix by using => ?
            if (currentState !== "start" || stack.length) {
                stack.unshift(this.nextState, currentState);
            }
            return this.nextState;
        };
        const popState = function (currentState: string, stack: string[]): string {
            // if (stack[0] === currentState)
            stack.shift();
            return stack.shift() || "start";
        };

        let id = 0;
        const rules = this.$rules;
        function processState(key) {
            const state = rules[key];
            state['processed'] = true;
            for (let i = 0; i < state.length; i++) {
                let rule = state[i];
                let toInsert = null;
                if (Array.isArray(rule)) {
                    toInsert = rule;
                    rule = {};
                }
                if (!rule.regex && rule['start']) {
                    rule.regex = rule['start'];
                    if (!rule.next)
                        (<any>rule)['next'] = [];
                    rule.next['push']({
                        defaultToken: rule.token
                    }, {
                            token: rule.token + ".end",
                            regex: rule['end'] || rule['start'],
                            next: "pop"
                        });
                    rule.token = rule.token + ".start";
                    (<any>rule)['push'] = true;
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
                    (<any>rule)['nextState'] = rule.next || rule.push;
                    rule.next = pushState;
                    delete rule.push;
                }

                if (rule['rules']) {
                    for (const r in rule['rules']) {
                        if (rules[r]) {
                            if (rules[r].push)
                                rules[r].push.apply(rules[r], rule['rules'][r]);
                        } else {
                            rules[r] = rule['rules'][r];
                        }
                    }
                }
                const includeName = typeof rule === "string"
                    ? rule
                    : typeof rule.include === "string"
                        ? rule.include
                        : "";
                if (includeName) {
                    toInsert = rules[<any>includeName];
                }

                if (toInsert) {
                    let args = [i, 1].concat(toInsert);
                    if (rule.noEscape)
                        args = args.filter(function (x) { return !x['next']; });
                    state.splice.apply(state, args);
                    // skip included rules since they are already processed
                    // i += args.length - 3;
                    i--;
                }

                if (rule['keywordMap']) {
                    rule.token = this.createKeywordMapper(
                        rule['keywordMap'], rule.defaultToken || "text", rule.caseInsensitive
                    );
                    delete rule.defaultToken;
                }
            }
        }
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
