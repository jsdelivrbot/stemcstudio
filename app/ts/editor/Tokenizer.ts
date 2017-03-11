import { Rule, RuleToken } from "./Rule";
import TokenizedLine from './TokenizedLine';
import { BasicToken } from './Token';

// tokenizing lines longer than this makes editor very slow
let MAX_TOKEN_COUNT = 2000;

/**
 * 
 */
function $applyToken(this: Rule<string>, str: string): BasicToken[] | undefined {
    if (typeof this.token === 'function') {
        const tokens: BasicToken[] = [];
        if (this.splitRegex) {
            const splits = this.splitRegex.exec(str);
            if (splits) {
                const values = splits.slice(1);
                // FIXME: Don't want this cast.
                const types: string | string[] = this.token.apply(this, values);

                // required for compatibility with old modes
                if (typeof types === "string") {
                    return [{ type: types, value: str }];
                }

                for (let i = 0, l = types.length; i < l; i++) {
                    if (values[i]) {
                        tokens[tokens.length] = { type: types[i], value: values[i] };
                    }
                }
            }
        }
        return tokens;
    }
    else {
        console.warn("expecting rule.token to be a function.");
        return void 0;
    }
}

function $arrayTokens(this: Rule<string>, str: string): 'text' | BasicToken[] {
    if (!str) {
        return [];
    }
    const tokens: BasicToken[] = [];
    if (this.splitRegex) {
        const values = this.splitRegex.exec(str);
        if (!values) {
            return 'text';
        }
        const types = this.tokenArray;
        if (types) {
            for (let i = 0, l = types.length; i < l; i++) {
                if (values[i + 1]) {
                    tokens[tokens.length] = { type: types[i], value: values[i + 1] };
                }
            }
        }
    }
    return tokens;
}

function removeCapturingGroups(src: string): string {
    const r = src.replace(
        /\[(?:\\.|[^\]])*?\]|\\.|\(\?[:=!]|(\()/g,
        function (x, y) { return y ? "(?:" : x; }
    );
    return r;
}

function createSplitterRegexp(src: string, flag?: string): RegExp {
    if (src.indexOf("(?=") !== -1) {
        let stack = 0;
        let inChClass = false;
        const lastCapture: { stack?: number, start?: number; end?: number } = {};
        src.replace(/(\\.)|(\((?:\?[=!])?)|(\))|([\[\]])/g, function (
            m, esc, parenOpen, parenClose, square, index
        ) {
            if (inChClass) {
                inChClass = square !== "]";
            }
            else if (square) {
                inChClass = true;
            }
            else if (parenClose) {
                if (stack === lastCapture.stack) {
                    lastCapture.end = index + 1;
                    lastCapture.stack = -1;
                }
                stack--;
            }
            else if (parenOpen) {
                stack++;
                if (parenOpen.length !== 1) {
                    lastCapture.stack = stack;
                    lastCapture.start = index;
                }
            }
            return m;
        });

        if (lastCapture.end != null && /^\)*$/.test(src.substr(lastCapture.end)))
            src = src.substring(0, lastCapture.start) + src.substr(lastCapture.end);
    }

    // this is needed for regexps that can match in multiple ways
    if (src.charAt(0) !== "^") src = "^" + src;
    if (src.charAt(src.length - 1) !== "$") src += "$";

    return new RegExp(src, (flag || "").replace("g", ""));
}

/**
 * This class takes a set of highlighting rules, and creates a tokenizer out of them.
 * For more information, see [the wiki on extending highlighters](https://github.com/ajaxorg/ace/wiki/Creating-or-Extending-an-Edit-Mode#wiki-extendingTheHighlighter).
 */
export default class Tokenizer {
    // Mode wants access to the states (rules)
    /**
     * 
     */
    public readonly states: { [stateName: string]: Rule<string>[] };

    /**
     * 
     */
    private readonly regExps: { [stateName: string]: RegExp } = {};

    /**
     * 
     */
    private readonly matchMappings: { [stateName: string]: Rule<string> } = {};

    /**
     * Constructs a new tokenizer based on the given rules and flags.
     *
     * @param states The highlighting rules for each state (rulesByState).
     */
    constructor(rulesByState: { [stateName: string]: Rule<string>[] }) {
        this.states = rulesByState;

        for (const key in this.states) {
            if (this.states.hasOwnProperty(key)) {

                const rules = this.states[key];
                const ruleRegExps: string[] = [];
                let matchTotal = 0;
                const mapping: Rule<string> = this.matchMappings[key] = { defaultToken: "text" };
                let flag = "g";

                const splitterRules: Rule<string>[] = [];
                for (let i = 0; i < rules.length; i++) {
                    const rule = rules[i];
                    if (rule.defaultToken)
                        mapping.defaultToken = rule.defaultToken;
                    if (rule.caseInsensitive)
                        flag = "gi";
                    if (rule.regex == null)
                        continue;

                    if (rule.regex instanceof RegExp) {
                        rule.regex = rule.regex.toString().slice(1, -1);
                    }

                    // Count number of matching groups. 2 extra groups from the full match
                    // And the catch-all on the end (used to force a match);
                    let adjustedregex = rule.regex;
                    const matches = new RegExp("(?:(" + adjustedregex + ")|(.))").exec("a");
                    if (matches) {
                        let matchcount = matches.length - 2;
                        if (Array.isArray(rule.token)) {
                            if (rule.token.length === 1 || matchcount === 1) {
                                rule.token = rule.token[0];
                            }
                            else if (matchcount - 1 !== rule.token.length) {
                                console.warn("number of classes and regexp groups doesn't match", {
                                    rule: rule,
                                    groupCount: matchcount - 1
                                });
                                rule.token = rule.token[0];
                            }
                            else {
                                rule.tokenArray = rule.token;
                                rule.token = null;
                                rule.onMatch = $arrayTokens;
                            }
                        }
                        else if (typeof rule.token === "function" && !rule.onMatch) {
                            if (matchcount > 1)
                                rule.onMatch = $applyToken;
                            else
                                rule.onMatch = rule.token;
                        }

                        if (matchcount > 1) {
                            if (/\\\d/.test(rule.regex)) {
                                // Replace any backreferences and offset appropriately.
                                adjustedregex = rule.regex.replace(/\\([0-9]+)/g, function (match, digit) {
                                    return "\\" + (parseInt(digit, 10) + matchTotal + 1);
                                });
                            }
                            else {
                                matchcount = 1;
                                adjustedregex = removeCapturingGroups(rule.regex);
                            }
                            if (!rule.splitRegex && typeof rule.token !== "string")
                                splitterRules.push(rule); // flag will be known only at the very end
                        }

                        mapping[matchTotal] = i;
                        matchTotal += matchcount;
                    }

                    ruleRegExps.push(adjustedregex);

                    // makes property access faster
                    if (!rule.onMatch)
                        rule.onMatch = null;
                }

                if (!ruleRegExps.length) {
                    mapping[0] = 0;
                    ruleRegExps.push("$");
                }

                splitterRules.forEach((rule) => {
                    if (typeof rule.regex === 'string') {
                        rule.splitRegex = createSplitterRegexp(rule.regex, flag);
                    }
                    else {
                        console.warn("Ignoring rule.regex");
                        // Not sure if this is dead code.
                        // rule.splitRegex = rule.regex;
                    }
                });

                this.regExps[key] = new RegExp("(" + ruleRegExps.join(")|(") + ")|($)", flag);
            }
        }
    }

    /**
     * Not currently used. Keeping in case it has a usage.
     */
    public $setMaxTokenCount(m: number): void {
        MAX_TOKEN_COUNT = m | 0;
    }

    /**
     * startState is usually undefined.
     */
    public getLineTokens(line: string, startState: string | string[] | null | undefined): TokenizedLine<BasicToken> {

        let stack: string[];
        if (startState && typeof startState !== "string") {
            stack = startState.slice(0);
            startState = stack[0];
            if (startState === "#tmp") {
                stack.shift();
                startState = stack.shift();
            }
        }
        else {
            stack = [];
        }

        let currentState: string = <string>startState || "start";
        let rules = this.states[currentState];
        if (!rules) {
            currentState = "start";
            rules = this.states[currentState];
        }
        let mapping = this.matchMappings[currentState];
        let re = this.regExps[currentState];
        re.lastIndex = 0;

        let match: RegExpExecArray | null;
        const tokens: BasicToken[] = [];
        let lastIndex = 0;
        let matchAttempts = 0;

        let token: BasicToken = { type: null, value: "" };

        while (match = re.exec(line)) {
            let type: RuleToken<string> = mapping.defaultToken;
            let rule = null;
            const value = match[0];
            const index = re.lastIndex;

            if (index - value.length > lastIndex) {
                const skipped = line.substring(lastIndex, index - value.length);
                if (token.type === type) {
                    token.value += skipped;
                }
                else {
                    if (token.type) {
                        tokens.push(token);
                    }
                    // FIXME: Is the cast valid?
                    if (typeof type === 'string') {
                        token = { type: type, value: skipped };
                    }
                    else {
                        console.warn(`Unexpected type => ${type}`);
                    }
                }
            }

            for (let i = 0; i < match.length - 2; i++) {
                if (match[i + 1] === undefined)
                    continue;

                rule = rules[mapping[i]];

                if (rule.onMatch)
                    type = rule.onMatch(value, currentState, stack, line);
                else
                    type = rule.token;

                if (rule.next) {
                    if (typeof rule.next === "string") {
                        currentState = rule.next;
                    }
                    else if (Array.isArray(rule.next)) {
                        // This case should not happen because or rule normalization?
                        console.warn("rule.next: Rule[] is not being handled by the Tokenizer.");
                    }
                    else {
                        currentState = rule.next(currentState, stack);
                    }

                    rules = this.states[currentState];
                    if (!rules) {
                        // FIXME: I'm ignoring this for the time being!
                        console.warn("state doesn't exist", currentState);
                        currentState = "start";
                        rules = this.states[currentState];
                    }
                    mapping = this.matchMappings[currentState];
                    lastIndex = index;
                    re = this.regExps[currentState];
                    re.lastIndex = index;
                }
                break;
            }

            if (value) {
                if (typeof type === "string") {
                    if ((!rule || rule.merge !== false) && token.type === type) {
                        token.value += value;
                    }
                    else {
                        if (token.type)
                            tokens.push(token);
                        token = { type: type, value: value };
                    }
                }
                else if (type) {
                    if (token.type)
                        tokens.push(token);
                    token = { type: null, value: "" };
                    for (let i = 0; i < type.length; i++)
                        tokens.push(type[i]);
                }
            }

            if (lastIndex === line.length)
                break;

            lastIndex = index;

            if (matchAttempts++ > MAX_TOKEN_COUNT) {
                if (matchAttempts > 2 * line.length) {
                    console.warn("infinite loop within tokenizer", { startState: startState, line: line });
                }
                // chrome doens't show contents of text nodes with very long text
                while (lastIndex < line.length) {
                    if (token.type)
                        tokens.push(token);
                    token = { value: line.substring(lastIndex, lastIndex += 2000), type: "overflow" };
                }
                currentState = "start";
                stack = [];
                break;
            }
        }

        if (token.type) {
            tokens.push(token);
        }

        if (stack.length > 1) {
            if (stack[0] !== currentState) {
                stack.unshift("#tmp", currentState);
            }
        }

        return {
            tokens: tokens,
            state: stack.length ? stack : currentState
        };
    }
}
