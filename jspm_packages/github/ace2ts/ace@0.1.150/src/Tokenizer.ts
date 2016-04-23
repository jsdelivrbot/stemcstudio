import Rule from "./Rule";
import TokenizedLine from './TokenizedLine';
import Token from './Token';

// tokenizing lines longer than this makes editor very slow
let MAX_TOKEN_COUNT = 2000;

/**
 * This class takes a set of highlighting rules, and creates a tokenizer out of them. For more information, see [the wiki on extending highlighters](https://github.com/ajaxorg/ace/wiki/Creating-or-Extending-an-Edit-Mode#wiki-extendingTheHighlighter).
 * @class Tokenizer
 */
export default class Tokenizer {
  // Mode wants access to the states (rules)
  public states: { [stateName: string]: Rule[] };
  private regExps: { [stateName: string]: RegExp };
  private matchMappings: { [name: string]: Rule };
  private tokenArray: string[];
  private splitRegex: RegExp;
  private token;

  /**
   * Constructs a new tokenizer based on the given rules and flags.
   *
   * @class Tokenizer
   * @constructor
   * @param states {{[name:string]: Rule[]}} The highlighting rules for each state.
   */
  constructor(states: { [name: string]: Rule[] }) {
    this.states = states;

    this.regExps = {};
    this.matchMappings = {};
    // const keys: string[] = Object.keys(this.states)
    for (var key in this.states) {
      const state: Rule[] = this.states[key];
      const ruleRegExps: string[] = [];
      let matchTotal = 0;
      const mapping: Rule = this.matchMappings[key] = { defaultToken: "text" };
      let flag = "g";

      var splitterRules: Rule[] = [];
      for (let i = 0; i < state.length; i++) {

        const rule: Rule = state[i];

        if (rule.defaultToken) {
          mapping.defaultToken = rule.defaultToken;
        }

        if (rule.caseInsensitive) {
          flag = "gi";
        }

        if (rule.regex == null) {
          continue;
        }

        // The code below assumes regex: string!
        if (rule.regex instanceof RegExp) {
          rule.regex = rule.regex.toString().slice(1, -1);
        }

        // Count number of matching groups. 2 extra groups from the full match
        // And the catch-all on the end (used to force a match);
        let adjustedregex: string = <string>rule.regex;
        let matchcount = new RegExp("(?:(" + adjustedregex + ")|(.))").exec("a").length - 2;
        if (Array.isArray(rule.token)) {
          if (rule.token.length == 1 || matchcount == 1) {
            rule.token = rule.token[0];
          }
          else if (matchcount - 1 != rule.token.length) {
            throw new Error("number of classes and regexp groups in '" +
              rule.token + "'\n'" + rule.regex + "' doesn't match\n"
              + (matchcount - 1) + "!=" + rule.token.length);
          }
          else {
            rule.tokenArray = rule.token;
            rule.token = null;
            rule.onMatch = this.$arrayTokens;
          }
        }
        else if (typeof rule.token === "function" && !rule.onMatch) {
          if (matchcount > 1) {
            rule.onMatch = this.$applyToken;
          }
          else {
            rule.onMatch = <any>rule.token;
          }
        }

        if (matchcount > 1) {
          // The conversion to string was made earlier.
          if (/\\\d/.test(<string>rule.regex)) {
            // Replace any backreferences and offset appropriately.
            adjustedregex = (<string>rule.regex).replace(/\\([0-9]+)/g, function(match, digit) {
              return "\\" + (parseInt(digit, 10) + matchTotal + 1);
            });
          }
          else {
            matchcount = 1;
            adjustedregex = this.removeCapturingGroups(<string>rule.regex);
          }
          if (!rule.splitRegex && typeof rule.token !== "string")
            splitterRules.push(rule); // flag will be known only at the very end
        }

        mapping[matchTotal] = i;
        matchTotal += matchcount;

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

      splitterRules.forEach((rule: Rule) => {
        rule.splitRegex = this.createSplitterRegexp(<string>rule.regex, flag);
      });

      this.regExps[key] = new RegExp("(" + ruleRegExps.join(")|(") + ")|($)", flag);
    }
  }

  private $setMaxTokenCount(m: number) {
    MAX_TOKEN_COUNT = m | 0;
  }

  private $applyToken(str: string): Token[] {
    const values: string[] = this.splitRegex.exec(str).slice(1);
    const types: string | string[] = this.token.apply(this, values);

    // required for compatibility with legacy? modes
    if (typeof types === "string") {
      return [{ type: types, value: str }];
    }

    const tokens: Token[] = [];
    for (let i = 0, l = types.length; i < l; i++) {
      if (values[i]) {
        tokens[tokens.length] = { type: types[i], value: values[i] };
      }
    }
    return tokens;
  }

  private $arrayTokens(str: string): string | Token[] {
    if (!str) {
      return [];
    }
    const values = this.splitRegex.exec(str);
    if (!values) {
      return "text";
    }
    const tokens: Token[] = [];
    const types = this.tokenArray;
    for (var i = 0, l = types.length; i < l; i++) {
      if (values[i + 1]) {
        tokens[tokens.length] = { type: types[i], value: values[i + 1] };
      }
    }
    return tokens;
  }

  private removeCapturingGroups(src: string): string {
    var r = src.replace(
      /\[(?:\\.|[^\]])*?\]|\\.|\(\?[:=!]|(\()/g,
      function(x, y) { return y ? "(?:" : x; }
    );
    return r;
  }

  private createSplitterRegexp(src: string, flag?: string): RegExp {
    if (src.indexOf("(?=") != -1) {
      var stack = 0;
      var inChClass = false;
      var lastCapture: any = {};
      src.replace(/(\\.)|(\((?:\?[=!])?)|(\))|([\[\]])/g, function(
        m, esc, parenOpen, parenClose, square, index
      ) {
        if (inChClass) {
          inChClass = square != "]";
        } else if (square) {
          inChClass = true;
        } else if (parenClose) {
          if (stack == lastCapture.stack) {
            lastCapture.end = index + 1;
            lastCapture.stack = -1;
          }
          stack--;
        } else if (parenOpen) {
          stack++;
          if (parenOpen.length != 1) {
            lastCapture.stack = stack
            lastCapture.start = index;
          }
        }
        return m;
      });

      if (lastCapture.end != null && /^\)*$/.test(src.substr(lastCapture.end)))
        src = src.substring(0, lastCapture.start) + src.substr(lastCapture.end);
    }
    return new RegExp(src, (flag || "").replace("g", ""));
  }

  /**
   * Returns an object containing two properties:
   * `tokens: Token[]`, which contains all the tokens; and `state: string`, the current state.
   *
   * @method getLineTokens
   * @return {TokenizedLine}
   */
  public getLineTokens(line: string, startState: string | string[]): TokenizedLine {
    let stack: string[] = [];
    if (startState && typeof startState !== 'string') {
      stack = (<string[]>startState).slice(0);
      startState = stack[0];
      if (startState === '#tmp') {
        stack.shift()
        startState = stack.shift()
      }
    }
    else {
      stack = [];
    }

    let currentState: string = <string>startState || "start";
    var state: Rule[] = this.states[currentState];
    if (!state) {
      currentState = "start";
      state = this.states[currentState];
    }
    var mapping = this.matchMappings[currentState];
    var re = this.regExps[currentState];
    re.lastIndex = 0;

    var match: RegExpExecArray;
    var tokens: Token[] = [];
    var lastIndex = 0;

    var token: Token = { type: null, value: "" };

    while (match = re.exec(line)) {
      var type: any = mapping.defaultToken;
      var rule: Rule = null;
      var value = match[0];
      var index = re.lastIndex;

      if (index - value.length > lastIndex) {
        const skipped = line.substring(lastIndex, index - value.length);
        if (token.type == type) {
          token.value += skipped;
        }
        else {
          if (token.type) {
            tokens.push(token);
          }
          token = { type: type, value: skipped };
        }
      }

      for (var i = 0; i < match.length - 2; i++) {
        if (match[i + 1] === undefined) {
          continue;
        }

        rule = state[mapping[i]];

        if (rule.onMatch) {
          type = rule.onMatch(value, currentState, stack);
        }
        else {
          type = rule.token;
        }

        if (rule.next) {
          if (typeof rule.next === 'string') {
            currentState = <string>rule.next;
          }
          else {
            const next: (currentState: string, stack: string[]) => string = <any>rule.next
            currentState = next(currentState, stack);
          }

          state = this.states[currentState];
          if (!state) {
            currentState = "start";
            state = this.states[currentState];
          }
          mapping = this.matchMappings[currentState];
          lastIndex = index;
          re = this.regExps[currentState];
          re.lastIndex = index;
        }
        break;
      }

      if (value) {
        if (typeof type == "string") {
          if ((!rule || rule.merge !== false) && token.type === type) {
            token.value += value;
          }
          else {
            if (token.type) {
              tokens.push(token);
            }
            token = { type: type, value: value };
          }
        }
        else if (type) {
          if (token.type) {
            tokens.push(token);
          }
          token = { type: null, value: "" };
          for (var i = 0; i < type.length; i++) {
            tokens.push(type[i]);
          }
        }
      }

      if (lastIndex == line.length) {
        break;
      }

      lastIndex = index;

      if (tokens.length > MAX_TOKEN_COUNT) {
        // chrome doens't show contents of text nodes with very long text
        while (lastIndex < line.length) {
          if (token.type) {
            tokens.push(token);
          }
          token = {
            value: line.substring(lastIndex, lastIndex += 2000),
            type: "overflow"
          };
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
        stack.unshift('#tmp', currentState);
      }
    }

    return {
      tokens: tokens,
      state: stack.length ? stack : currentState
    };
  }
}
