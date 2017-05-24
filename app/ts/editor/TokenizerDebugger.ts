import { Rule, RuleToken } from "./Rule";
import { Token } from './Token';
import { Tokenizer, TokenizedLine } from './Tokenizer';

// tokenizing lines longer than this makes editor very slow
const MAX_TOKEN_COUNT = 100000;

/*
 * An extension of Tokenizer with additional logging and infinite loop checks.
 * May be used for developing/testing new modes.
 * FIXME: This implementation does not appear to offer any afvantages over the standard
 * Tokenizer. A more useful approach might be an implementation that is less optimized
 * but closer to the specification of the highlighting rules.
 */
export class TokenizerDebugger<T extends Token, E, S extends Array<string | E>> extends Tokenizer<T, E, S> {
    constructor(rulesByState: { [stateName: string]: Rule<T, E, S>[] }) {
        super(rulesByState);
    }
    getLineTokens(line: string, startState: string | E | S | null | undefined): TokenizedLine<E> {
        let stack: (string | E)[];
        if (startState && Array.isArray(startState)) {
            stack = startState.slice(0);
            // startState is now (string | E)
            startState = stack[0];
        }
        else {
            stack = [];
        }

        // FIXME: Type safety.
        let currentState: string = <string>startState || "start";
        let state = this.rulesByState[currentState];
        let mapping = this.matchMappings[currentState];
        let re = this.regExps[currentState];
        re.lastIndex = 0;

        let match: RegExpMatchArray;
        const tokens: Token[] = [];

        let lastIndex = 0;

        let stateTransitions: string[] = [];
        function onStateChange() {
            stateTransitions.push(startState + "@" + lastIndex);
        }
        function initState() {
            onStateChange();
            stateTransitions = [];
            onStateChange();
        }

        let token: { type: string | null, value: string, state?: string } = {
            type: null,
            value: "",
            state: currentState
        };
        initState();

        let maxRecur = 100000;

        while (match = re.exec(line)) {
            let type = mapping.defaultToken;
            let rule: Rule<T, E, S> | null = null;
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
                    if (typeof type === 'string') {
                        token = { type: type, value: skipped };
                    }
                    else {
                        console.warn(`Unexpected type => ${JSON.stringify(type)}`);
                    }
                }
            }

            for (let i = 0; i < match.length - 2; i++) {
                if (match[i + 1] === undefined)
                    continue;

                if (!maxRecur--) {
                    throw "infinite" + state[mapping[i]] + currentState;
                }

                rule = state[mapping[i]];

                if (rule.onMatch)
                    type = rule.onMatch(value, currentState, stack as S, line);
                else
                    type = rule.token;

                if (rule.next) {
                    if (typeof rule.next === "string") {
                        currentState = rule.next;
                    }
                    else if (Array.isArray(rule.next)) {
                        // This case should not happen because or rule normalization?
                        // console.warn("rule.next: Rule[] is not being handled by the Tokenizer.");
                    }
                    else if (typeof rule.next === 'function') {
                        currentState = rule.next(currentState, stack as S) as string;
                    }

                    state = this.rulesByState[currentState];
                    if (!state) {
                        console.warn(currentState, "doesn't exist");
                        currentState = "start";
                        state = this.rulesByState[currentState];
                    }
                    mapping = this.matchMappings[currentState];
                    lastIndex = index;
                    re = this.regExps[currentState];
                    re.lastIndex = index;

                    onStateChange();
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
                } else if (Array.isArray(type)) {
                    if (token.type)
                        tokens.push(token);
                    token = { type: null, value: "" };
                    for (let i = 0; i < type.length; i++) {
                        const mayBeToken = type[i];
                        if (typeof mayBeToken === 'object') {
                            tokens.push(mayBeToken);
                        }
                        else {
                            console.warn(`typeof ruleToken => ${typeof type} is not being handled.`);
                        }
                    }
                }
            }

            if (lastIndex === line.length)
                break;

            lastIndex = index;

            if (tokens.length > MAX_TOKEN_COUNT) {
                token.value += line.substr(lastIndex);
                currentState = "start";
                break;
            }
        }

        if (token.type)
            tokens.push(token);

        return {
            tokens: tokens,
            state: stack.length ? stack : currentState
        };
    }
}
