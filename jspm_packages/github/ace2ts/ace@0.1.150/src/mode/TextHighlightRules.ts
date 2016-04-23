import {deepCopy} from "../lib/lang";
import Rule from '../Rule';
// import LegacyNextRule from '../LegacyNextRule';

/**
 * @class TextHighlightRules
 */
export default class TextHighlightRules {
    /**
     * FIXME: This should be called rulesByState.
     */
    $rules: { [name: string]: Rule[] };

    $embeds: string[];

    nextState: string;

    $keywordList: string[];

    /**
     * @class TextHighlightRules
     * @constructor
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
     * @method addRules
     * @param rulesByState
     * @param [prefix] {string}
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
            for (var i = 0; i < rules.length; i++) {
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
     * @method getRules
     * @return {{[name:string]:Rule[]}}
     */
    getRules(): { [name: string]: Rule[] } {
        return this.$rules;
    }

    /**
     * FIXME: typing
     */
    embedRules(HighlightRules, prefix: string, escapeRules, states?: string[], append?: boolean) {
        const embedRules: { [name: string]: Rule[] } = (typeof HighlightRules === "function") ? new HighlightRules().getRules() : HighlightRules;
        if (states) {
            for (var i = 0; i < states.length; i++) {
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
            // FIXME: Replace this by a Type-safe implementation!
            const addRules = Array.prototype[append ? "push" : "unshift"];
            for (var i = 0; i < states.length; i++) {
                addRules.apply(this.$rules[states[i]], deepCopy(escapeRules));
            }
        }

        if (!this.$embeds) {
            this.$embeds = [];
        }
        this.$embeds.push(prefix);
    }

    /**
     * @method getEmbeds
     * @return {string[]}
     */
    getEmbeds(): string[] {
        return this.$embeds;
    }

    /**
     * May be a mix of correcting legacy definitions and/or actually doing something useful?
     * @method normalizeRules
     * @return {void}
     */
    normalizeRules(): void {

        const pushState = (currentState: string, stack: string[]): string => {
            // FIXME: Could be a bug here because nextState is untyped.
            // Fix by using => ?
            if (currentState !== "start" || stack.length) {
                stack.unshift(this.nextState, currentState);
            }
            return this.nextState;
        };
        const popState = (currentState: string, stack: string[]): string => {
            // if (stack[0] === currentState)
            stack.shift();
            return stack.shift() || "start";
        };


        let id = 0;

        /**
         * The rules: Rule[] by state: string.
         */
        var rules = this.$rules;

        /**
         *
         */
        function processState(key: string) {
            // The key parameter is the state name, but we use that variable name already.
            const state: Rule[] = rules[key];

            // OK, this looks like a hack.
            state['processed'] = true;

            for (let i = 0; i < state.length; i++) {
                const rule: Rule = state[i];
                // I'm guessing that the start property is a legacy version of regex.
                if (!rule.regex && rule['start']) {
                    rule.regex = rule['start'];
                    const nextRules: Rule[] = [];
                    if (!rule.next) {
                        // We break the rules again, but fix them a bit later!
                        // Probably better to define new variables?
                        rule.next = <any>nextRules;
                    }
                    nextRules.push(
                        {
                            defaultToken: rule.token
                        },
                        {
                            token: rule.token + ".end",
                            regex: rule['end'] || rule['start'],
                            next: "pop"
                        });
                    rule.token = rule.token + ".start";
                    // We break the rules here and unbreak them below!
                    rule.push = <any>true;
                }

                const next = rule.next || rule.push;

                if (next && Array.isArray(next)) {
                    // const legacyRule = <LegacyNextRule><any>rule;
                    let stateName: string = rule['stateName'];
                    if (!stateName) {
                        // Don't worry, we'll make it a string again!
                        stateName = <any>rule.token;
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
                else if (next === "pop") {
                    rule.next = popState;
                }

                // Looking for the boolean we set earlier?
                if (rule.push) {
                    // FIXME: This normalization stuff needs to go or be revised into two data structures.
                    rule.nextState = <any>(rule.next || rule.push);
                    rule.next = pushState;
                    delete rule.push;
                }

                if (rule['rules']) {
                    const childRulesByState: { [name: string]: Rule[] } = rule['rules'];
                    for (var r in childRulesByState) {
                        if (rules[r]) {
                            if (rules[r].push)
                                rules[r].push.apply(rules[r], childRulesByState[r]);
                        } else {
                            rules[r] = childRulesByState[r];
                        }
                    }
                }

                // Maybe toInclude is a better name or the 'include' property should have been called 'insert'?
                let toInsert: Rule[];
                if (rule.include || typeof rule === "string") {
                    const includeName = rule.include || <string>rule;
                    toInsert = rules[includeName];
                }
                else if (Array.isArray(rule)) {
                    toInsert = <any>rule;
                }

                if (toInsert) {
                    let args: any[] = [i, 1];
                    args.concat(toInsert);
                    if (rule.noEscape) {
                        args = args.filter(function(x) { return !x['next']; });
                    }
                    state.splice.apply(state, args);
                    // skip included rules since they are already processed
                    // i += args.length - 3;
                    i--;
                    toInsert = null;
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
        Object.keys(map).forEach(function(className: string) {
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
            ? function(value: string) { return keywords[value.toLowerCase()] || defaultToken; }
            : function(value: string) { return keywords[value] || defaultToken; };
    }

    getKeywords(): string[] {
        return this.$keywordList;
    }
}
