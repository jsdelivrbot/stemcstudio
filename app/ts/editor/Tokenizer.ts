import { Rule, RuleToken } from "./Rule";

export const START = 'start';
export const HTEMP = '#tmp';

/**
 * The essential structure of the token used by the tokenizer.
 * Consumers may extend this structure.
 */
export interface Token {
    /**
     *
     */
    type: string;

    /**
     *
     */
    value: string;
}

/**
 * Determines whether the token argument has the appropriate string type.
 * This function provides the typesafe guard.
 */
function isToken(token: { type: string | null, value: string }): token is Token {
    // Checking only that the type is truthy is consistent with the legacy code.
    // It would probably be more precise to check for a string a string and manage
    // the case of a zero-length string elsewhere. 
    if (token.type) {
        return true;
    }
    else {
        return false;
    }
}

/**
 * Verifies that the token has a valid `type` property before pushing.
 */
function pushIfValidToken(token: { type: string | null; value: string }, tokens: Token[], trace: boolean): void {
    const value = token.value;
    if (isToken(token)) {
        if (trace) {
            // Because the push happens after the change of state, this is confusing.
            // console.lg(`token = ${JSON.stringify(token)})`);
        }
        tokens.push(token);
    }
    else {
        if (value.length !== 0) {
            // How often do we end up here.
            console.warn(`token ${JSON.stringify(token)} does not have a valid type property.`);
        }
        else {
            // Zero length values can't be annotated so maybe this is reasonable.
        }
    }
}

/**
 * Used to report a change in state for debugging purposes.
 * The stack is only provided so that it can be reported.
 */
function changeCurrentState(from: string | undefined, to: string, stack: any[], trace: boolean): string {
    if (trace) {
        console.log(`currentState: ${JSON.stringify(from)} => ${JSON.stringify(to)}`);
        if (stack.length > 0) {
            console.log(`stack (${stack.length}):`);
            console.log(JSON.stringify(stack, null, 2));
        }
        else {
            console.log("stack is empty");
        }
    }
    return to;
}

/**
 * Consistes of the current state and the tokens for the line.
 */
export interface TokenizedLine<E> {

    /**
     * The case S (stack) happens when the stack has a non-zero length.
     * TODO: Why is the alternative current state not (string | E) rather than simply string?
     * If we generalize this it appears to become (string | number) or (string | number)[].
     * Why don'twe simply use the array representation (and set E to number).
     */
    state: string | (string | E)[];

    /**
     * The tokenizer currently only produces 
     */
    tokens: Token[];
}

/**
 * tokenizing lines with more tokens than this makes editor very slow
 */
let MAX_TOKEN_COUNT = 2000;

/**
 * An `onMatch` function for a Rule.
 * 
 * TODO: The cast to <T> suggests that parameterization by T is not a good thing.
 */
function applyToken<T extends Token, E, S extends Array<string | E>>(this: Rule<T, E, S>, str: string): T[] | undefined {
    if (typeof this.token === 'function') {
        const tokens: T[] = [];
        if (this.splitRegex) {
            const splits = this.splitRegex.exec(str);
            if (splits) {
                const values = splits.slice(1);
                // FIXME: Don't want this cast.
                const types: string | string[] = this.token.apply(this, values);

                // required for compatibility with old modes
                if (typeof types === "string") {
                    return [<T>{ type: types, value: str }];
                }

                for (let i = 0, l = types.length; i < l; i++) {
                    if (values[i]) {
                        tokens[tokens.length] = <T>{ type: types[i], value: values[i] };
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

/**
 * An `onMatch` function for a Rule.
 * 
 * TODO: The cast to <T> suggests that parameterization by T is not a good thing.
 */
function arrayTokens<T extends Token, E, S extends Array<string | E>>(this: Rule<T, E, S>, str: string): 'text' | T[] {
    if (!str) {
        return [];
    }
    const tokens: T[] = [];
    if (this.splitRegex) {
        const values = this.splitRegex.exec(str);
        if (!values) {
            return 'text';
        }
        const types = this.tokenArray;
        if (types) {
            for (let i = 0, l = types.length; i < l; i++) {
                if (values[i + 1]) {
                    tokens[tokens.length] = <T>{ type: types[i], value: values[i + 1] };
                }
            }
        }
    }
    return tokens;
}

/**
 * Removes capturing by replacing (x) with (?:x).
 * It's obviously more complicated, but thas the hand-waving idea.
 * Exported for unit testing.
 */
export function removeCapturingGroups(src: string): string {
    /**
     * This function's result (return value) will be used as the replacement string.
     * @param match The matched substring.
     * @param p1 The nth parenthesized submatch string.
     * @param offset The offset of the matched substring within the whole string being examined.
     * @param whole The whole string being examined.
     */
    function replacer(match: string, p1: string | undefined, offset: number, whole: string): string {
        return p1 ? "(?:" : match;
    }
    return src.replace(/\[(?:\\.|[^\]])*?\]|\\.|\(\?[:=!]|(\()/g, replacer);
}

/**
 * Exported for unit testing.
 */
export function createSplitterRegexp(src: string, flag?: string): RegExp {
    if (src.indexOf("(?=") !== -1) {
        let stack = 0;
        let inChClass = false;
        const lastCapture: { stack?: number, start?: number; end?: number } = {};
        src.replace(/(\\.)|(\((?:\?[=!])?)|(\))|([\[\]])/g, function replacer(
            match: string, esc: string, parenOpen: string, parenClose: string, square: string, index: number
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
            return match;
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
export class Tokenizer<T extends Token, E, S extends Array<string | E>> {
    /**
     * Configures tracing to console.
     */
    public trace = false;
    /**
     * rules by state name.
     * 
     * FIXME: TextMode wants access to the rulesByState.
     * This is so that it can build completion keywords, not a good coupling.
     */
    public readonly rulesByState: { [stateName: string]: Rule<T, E, S>[] };

    /**
     * Each value is a monster; the join of all the regular expressions using |.
     * Is this for optimization?
     * Much of the complication of parsing is in determining which rule matched.
     * 
     * TODO:Rename monsterRegExpByState?
     */
    protected readonly regExps: { [stateName: string]: RegExp } = {};

    /**
     * What is this used for?
     * At first sight it seems to only contain fixed entries (defaultToken: "text"),
     * but on further inspection each matchMapping entry is being used also as a map
     * from matchTotal: number to rule index.
     * These values are then used in getLineTokens to access a rule.
     */
    protected readonly matchMappings: { [stateName: string]: Rule<T, E, S> } = {};

    public reportError: (message: string, data: any) => void = function (message: string, data: any) {
        console.warn(message, data);
    };

    /**
     * Constructs a new tokenizer based on the given rules and flags.
     *
     * @param rulesByState The highlighting rules for each state (rulesByState).
     */
    constructor(rulesByState: { [stateName: string]: Rule<T, E, S>[] }) {
        this.rulesByState = rulesByState;

        for (const stateName in this.rulesByState) {
            if (this.rulesByState.hasOwnProperty(stateName)) {

                const rules = this.rulesByState[stateName];
                /**
                 * The regular expressions for this rule.
                 * rule.regex => adjustedregex
                 */
                const ruleRegExps: string[] = [];
                let matchTotal = 0;
                const mapping: Rule<T, E, S> = this.matchMappings[stateName] = { defaultToken: "text" };
                let flag: 'g' | 'gi' = "g";

                /**
                 * What are splitter rules?
                 */
                const splitterRules: Rule<T, E, S>[] = [];
                // This cannot be converted to for-of because we need the index later.
                for (let i = 0; i < rules.length; i++) {
                    const rule = rules[i];
                    if (rule.defaultToken) {
                        mapping.defaultToken = rule.defaultToken;
                    }
                    if (rule.caseInsensitive) {
                        flag = "gi";
                    }
                    // rule.regex is string | RegExp | undefined, but undefined == null => true,
                    // so the following test is really a check for undefined!
                    if (rule.regex == null) {
                        continue;
                    }

                    if (rule.regex instanceof RegExp) {
                        // The slicing trims of the leading an trailing forward slashes leaving the pattern.
                        rule.regex = rule.regex.toString().slice(1, -1);
                    }

                    // Henceforth, rule.regex must be a string.
                    // It seems that the reason for starting from a string is to count the matching groups?

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
                                this.reportError("number of classes and regexp groups doesn't match", { rule: rule, groupCount: matchcount - 1 });
                                rule.token = rule.token[0];
                            }
                            else {
                                // string[] | T[]
                                rule.tokenArray = rule.token;
                                rule.token = null;
                                rule.onMatch = arrayTokens;
                            }
                        }
                        else if (typeof rule.token === "function" && !rule.onMatch) {
                            if (matchcount > 1) {
                                rule.onMatch = applyToken;
                            }
                            else {
                                rule.onMatch = rule.token;
                            }
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
                            if (!rule.splitRegex && typeof rule.token !== "string") {
                                splitterRules.push(rule); // flag will be known only at the very end
                            }
                        }

                        mapping[matchTotal] = i;
                        matchTotal += matchcount;
                    }

                    ruleRegExps.push(adjustedregex);

                    // makes property access faster
                    if (!rule.onMatch) {
                        rule.onMatch = null;
                    }
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

                // These guys are monstrously long.
                this.regExps[stateName] = new RegExp("(" + ruleRegExps.join(")|(") + ")|($)", flag);
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
    public getLineTokens(line: string, startState: string | E | S | null | undefined): TokenizedLine<E> {
        if (this.trace) {
            console.log("===========================================================================");
            console.log(`getLineTokens(line = '${line}', startState = ${JSON.stringify(startState)})`);
        }
        /**
         * Either the `stack` or the `currentState` will be returned
         */
        let stack: (string | E)[];
        if (startState && Array.isArray(startState)) {
            // startState has been determined to have type (string | E)[]
            stack = startState.slice(0);
            startState = stack[0];
            if (startState === HTEMP) {
                stack.shift();
                startState = stack.shift();
            }
        }
        else {
            stack = [];
        }

        /**
         * TODO: Maybe this could be typed as (string | number) (E restricted to number is general enough).
         */
        let currentState = changeCurrentState(void 0, <string>startState || START, stack, this.trace);
        let rules = this.rulesByState[currentState];
        if (!rules) {
            currentState = changeCurrentState(currentState, START, stack, this.trace);
            rules = this.rulesByState[currentState];
        }
        let mapping = this.matchMappings[currentState];
        /**
         * The regular expression for the current state.
         */
        let re = this.regExps[currentState];
        re.lastIndex = 0;

        /**
         * The result of executing the monster RegExp.
         */
        let match: RegExpExecArray | null;
        const tokens: Token[] = [];
        let lastIndex = 0;
        let matchAttempts = 0;

        // The token begins life in a deficient state without a type.
        let token: { type: string | null, value: string } = { type: null, value: "" };
        while (match = re.exec(line)) {
            /**
             * Recall that a RuleToken is a string | string[] | Function.
             * TODO: This name is a bit confusing because it suggests that the type is a string.
             */
            let ruleToken: RuleToken<T, E, S> = mapping.defaultToken;
            let rule: Rule<T, E, S> | null = null;
            const value = match[0];
            const index = re.lastIndex;

            if (index - value.length > lastIndex) {
                const skipped = line.substring(lastIndex, index - value.length);
                if (token.type === ruleToken) {
                    token.value += skipped;
                }
                else {
                    pushIfValidToken(token, tokens, this.trace);
                    if (typeof ruleToken === 'string') {
                        token = { type: ruleToken, value: skipped };
                    }
                    else {
                        console.warn(`Unexpected type => ${JSON.stringify(ruleToken)}`);
                    }
                }
            }

            for (let i = 0; i < match.length - 2; i++) {
                if (match[i + 1] === undefined)
                    continue;

                rule = rules[mapping[i]];

                if (rule.onMatch) {
                    // TODO: May be better to simplify back to a stack being a (number | string)[].
                    // FIXME: We don't have strong typing here; onMatch return any.
                    ruleToken = rule.onMatch(value, currentState, stack as S, line);
                }
                else {
                    ruleToken = rule.token;
                }

                if (this.trace) {
                    if (value.length > 0) {
                        console.log(`ruleToken = ${JSON.stringify(ruleToken)}, value = '${value}'`);
                    }
                    else {
                        console.log(`ruleToken = ${JSON.stringify(ruleToken)}, value is the empty string`);
                    }
                }

                if (rule.next) {
                    if (typeof rule.next === "string") {
                        currentState = changeCurrentState(currentState, rule.next, stack, this.trace);
                    }
                    else if (Array.isArray(rule.next)) {
                        // This case should not happen because or rule normalization?
                        console.warn("rule.next: Rule[] is not being handled by the Tokenizer.");
                    }
                    else if (typeof rule.next === 'function') {
                        // TODO: May be better to simplify back to a stack being a (number | string)[].
                        // An example of why we end up here is a POP_STATE.
                        const nextState = rule.next(currentState, stack as S);
                        if (typeof nextState === 'string') {
                            currentState = changeCurrentState(currentState, nextState, stack, this.trace);
                        }
                        else {
                            console.warn(`typeof nextState => ${typeof nextState}`);
                            currentState = changeCurrentState(currentState, nextState as any, stack, this.trace);
                        }
                    }

                    rules = this.rulesByState[currentState];
                    if (!rules) {
                        // FIXME: I'm ignoring this for the time being!
                        this.reportError("state doesn't exist", currentState);
                        currentState = changeCurrentState(currentState, START, stack, this.trace);
                        rules = this.rulesByState[currentState];
                    }
                    mapping = this.matchMappings[currentState];
                    lastIndex = index;
                    re = this.regExps[currentState];
                    re.lastIndex = index;
                }
                break;
            }

            // This block seems to be concerned with pushing a token while the re matches.
            if (value) {
                if (typeof ruleToken === "string") {
                    if ((!rule || rule.merge !== false) && token.type === ruleToken) {
                        token.value += value;
                    }
                    else {
                        pushIfValidToken(token, tokens, this.trace);
                        token = { type: ruleToken, value: value };
                    }
                }
                else if (Array.isArray(ruleToken)) {
                    pushIfValidToken(token, tokens, this.trace);
                    // Why do we clear the type here...
                    token = { type: null, value: "" };
                    for (let i = 0; i < ruleToken.length; i++) {
                        const mayBeToken = ruleToken[i];
                        if (typeof mayBeToken === 'object') {
                            pushIfValidToken(mayBeToken, tokens, this.trace);
                        }
                        else {
                            // Tests land here with ["$"], ["\\}"], which is the string[] case rather than T[].
                            // I don't see how these can be pushed as tokens.
                            // console.warn(`typeof ruleToken => ${typeof ruleToken}, ruleToken => ${JSON.stringify(ruleToken)}`);
                        }
                    }
                }
                else {
                    console.warn(`typeof ruleToken => ${typeof ruleToken} is not being handled.`);
                }
            }
            else {
                // Zero-length strings can happen.
            }

            if (lastIndex === line.length) {
                break;
            }

            lastIndex = index;

            // Recover if the number of tokens in a line slows us down.
            if (matchAttempts++ > MAX_TOKEN_COUNT) {
                if (matchAttempts > 2 * line.length) {
                    this.reportError("infinite loop within tokenizer", { startState: startState, line: line });
                }
                // Chrome doesn't show contents of text nodes with very long text.
                while (lastIndex < line.length) {
                    pushIfValidToken(token, tokens, this.trace);
                    token = { value: line.substring(lastIndex, lastIndex += 2000), type: "overflow" };
                }
                currentState = changeCurrentState(currentState, START, stack, this.trace);
                stack = [];
                break;
            }
        }

        pushIfValidToken(token, tokens, this.trace);

        if (stack.length > 1) {
            if (stack[0] !== currentState) {
                stack.unshift(HTEMP, currentState);
            }
        }

        const tokenizedLine = {
            tokens: tokens,
            state: stack.length ? stack : currentState
        };
        if (this.trace) {
            console.log(`tokenizedLine = '${JSON.stringify(tokenizedLine)}'`);
        }
        return tokenizedLine;
    }
}
