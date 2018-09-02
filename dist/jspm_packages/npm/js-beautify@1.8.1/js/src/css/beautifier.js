/* */ 
'use strict';
var mergeOpts = require('../core/options').mergeOpts;
var normalizeOpts = require('../core/options').normalizeOpts;
var acorn = require('../core/acorn');
var Output = require('../core/output').Output;
var InputScanner = require('../core/inputscanner').InputScanner;
var lineBreak = acorn.lineBreak;
var allLineBreaks = acorn.allLineBreaks;
function Beautifier(source_text, options) {
  this._source_text = source_text || '';
  options = options || {};
  options = mergeOpts(options, 'css');
  options = normalizeOpts(options);
  this._options = {};
  var indentSize = options.indent_size ? parseInt(options.indent_size, 10) : 4;
  var indentCharacter = options.indent_char || ' ';
  var preserve_newlines = (options.preserve_newlines === undefined) ? false : options.preserve_newlines;
  var selectorSeparatorNewline = (options.selector_separator_newline === undefined) ? true : options.selector_separator_newline;
  var end_with_newline = (options.end_with_newline === undefined) ? false : options.end_with_newline;
  var newline_between_rules = (options.newline_between_rules === undefined) ? true : options.newline_between_rules;
  var space_around_combinator = (options.space_around_combinator === undefined) ? false : options.space_around_combinator;
  space_around_combinator = space_around_combinator || ((options.space_around_selector_separator === undefined) ? false : options.space_around_selector_separator);
  var eol = options.eol ? options.eol : 'auto';
  this._options.disabled = (options.disabled === undefined) ? false : options.disabled;
  if (options.indent_with_tabs) {
    indentCharacter = '\t';
    indentSize = 1;
  }
  eol = eol.replace(/\\r/, '\r').replace(/\\n/, '\n');
  var whitespaceChar = /\s/;
  var whitespacePattern = /(?:\s|\n)+/g;
  var block_comment_pattern = /\/\*(?:[\s\S]*?)((?:\*\/)|$)/g;
  var comment_pattern = /\/\/(?:[^\n\r\u2028\u2029]*)/g;
  var ch;
  var parenLevel = 0;
  var input;
  function eatString(endChars) {
    var result = '';
    ch = input.next();
    while (ch) {
      result += ch;
      if (ch === "\\") {
        result += input.next();
      } else if (endChars.indexOf(ch) !== -1 || ch === "\n") {
        break;
      }
      ch = input.next();
    }
    return result;
  }
  function eatWhitespace(allowAtLeastOneNewLine) {
    var result = whitespaceChar.test(input.peek());
    var isFirstNewLine = true;
    while (whitespaceChar.test(input.peek())) {
      ch = input.next();
      if (allowAtLeastOneNewLine && ch === '\n') {
        if (preserve_newlines || isFirstNewLine) {
          isFirstNewLine = false;
          output.add_new_line(true);
        }
      }
    }
    return result;
  }
  function foundNestedPseudoClass() {
    var openParen = 0;
    var i = 1;
    var ch = input.peek(i);
    while (ch) {
      if (ch === "{") {
        return true;
      } else if (ch === '(') {
        openParen += 1;
      } else if (ch === ')') {
        if (openParen === 0) {
          return false;
        }
        openParen -= 1;
      } else if (ch === ";" || ch === "}") {
        return false;
      }
      i++;
      ch = input.peek(i);
    }
    return false;
  }
  var indentLevel;
  var nestedLevel;
  var output;
  function print_string(output_string) {
    if (output.just_added_newline()) {
      output.set_indent(indentLevel);
    }
    output.add_token(output_string);
  }
  function preserveSingleSpace(isAfterSpace) {
    if (isAfterSpace) {
      output.space_before_token = true;
    }
  }
  function indent() {
    indentLevel++;
  }
  function outdent() {
    if (indentLevel > 0) {
      indentLevel--;
    }
  }
  this.beautify = function() {
    if (this._options.disabled) {
      return this._source_text;
    }
    var source_text = this._source_text;
    if (eol === 'auto') {
      eol = '\n';
      if (source_text && lineBreak.test(source_text || '')) {
        eol = source_text.match(lineBreak)[0];
      }
    }
    source_text = source_text.replace(allLineBreaks, '\n');
    var singleIndent = new Array(indentSize + 1).join(indentCharacter);
    var baseIndentString = '';
    var preindent_index = 0;
    if (source_text && source_text.length) {
      while ((source_text.charAt(preindent_index) === ' ' || source_text.charAt(preindent_index) === '\t')) {
        preindent_index += 1;
      }
      baseIndentString = source_text.substring(0, preindent_index);
      source_text = source_text.substring(preindent_index);
    }
    output = new Output(singleIndent, baseIndentString);
    input = new InputScanner(source_text);
    indentLevel = 0;
    nestedLevel = 0;
    ch = null;
    parenLevel = 0;
    var insideRule = false;
    var insidePropertyValue = false;
    var enteringConditionalGroup = false;
    var insideAtExtend = false;
    var insideAtImport = false;
    var topCharacter = ch;
    while (true) {
      var whitespace = input.read(whitespacePattern);
      var isAfterSpace = whitespace !== '';
      var previous_ch = topCharacter;
      ch = input.next();
      topCharacter = ch;
      if (!ch) {
        break;
      } else if (ch === '/' && input.peek() === '*') {
        output.add_new_line();
        input.back();
        print_string(input.read(block_comment_pattern));
        eatWhitespace(true);
        output.add_new_line();
      } else if (ch === '/' && input.peek() === '/') {
        output.space_before_token = true;
        input.back();
        print_string(input.read(comment_pattern));
        eatWhitespace(true);
      } else if (ch === '@') {
        preserveSingleSpace(isAfterSpace);
        if (input.peek() === '{') {
          print_string(ch + eatString('}'));
        } else {
          print_string(ch);
          var variableOrRule = input.peekUntilAfter(/[: ,;{}()[\]\/='"]/g);
          if (variableOrRule.match(/[ :]$/)) {
            variableOrRule = eatString(": ").replace(/\s$/, '');
            print_string(variableOrRule);
            output.space_before_token = true;
          }
          variableOrRule = variableOrRule.replace(/\s$/, '');
          if (variableOrRule === 'extend') {
            insideAtExtend = true;
          } else if (variableOrRule === 'import') {
            insideAtImport = true;
          }
          if (variableOrRule in this.NESTED_AT_RULE) {
            nestedLevel += 1;
            if (variableOrRule in this.CONDITIONAL_GROUP_RULE) {
              enteringConditionalGroup = true;
            }
          } else if (!insideRule && parenLevel === 0 && variableOrRule.indexOf(':') !== -1) {
            insidePropertyValue = true;
            indent();
          }
        }
      } else if (ch === '#' && input.peek() === '{') {
        preserveSingleSpace(isAfterSpace);
        print_string(ch + eatString('}'));
      } else if (ch === '{') {
        if (insidePropertyValue) {
          insidePropertyValue = false;
          outdent();
        }
        indent();
        output.space_before_token = true;
        print_string(ch);
        if (enteringConditionalGroup) {
          enteringConditionalGroup = false;
          insideRule = (indentLevel > nestedLevel);
        } else {
          insideRule = (indentLevel >= nestedLevel);
        }
        if (newline_between_rules && insideRule) {
          if (output.previous_line && output.previous_line.item(-1) !== '{') {
            output.ensure_empty_line_above('/', ',');
          }
        }
        eatWhitespace(true);
        output.add_new_line();
      } else if (ch === '}') {
        outdent();
        output.add_new_line();
        if (previous_ch === '{') {
          output.trim(true);
        }
        insideAtImport = false;
        insideAtExtend = false;
        if (insidePropertyValue) {
          outdent();
          insidePropertyValue = false;
        }
        print_string(ch);
        insideRule = false;
        if (nestedLevel) {
          nestedLevel--;
        }
        eatWhitespace(true);
        output.add_new_line();
        if (newline_between_rules && !output.just_added_blankline()) {
          if (input.peek() !== '}') {
            output.add_new_line(true);
          }
        }
      } else if (ch === ":") {
        if ((insideRule || enteringConditionalGroup) && !(input.lookBack("&") || foundNestedPseudoClass()) && !input.lookBack("(") && !insideAtExtend) {
          print_string(':');
          if (!insidePropertyValue) {
            insidePropertyValue = true;
            output.space_before_token = true;
            eatWhitespace(true);
            indent();
          }
        } else {
          if (input.lookBack(" ")) {
            output.space_before_token = true;
          }
          if (input.peek() === ":") {
            ch = input.next();
            print_string("::");
          } else {
            print_string(':');
          }
        }
      } else if (ch === '"' || ch === '\'') {
        preserveSingleSpace(isAfterSpace);
        print_string(ch + eatString(ch));
        eatWhitespace(true);
      } else if (ch === ';') {
        if (insidePropertyValue) {
          outdent();
          insidePropertyValue = false;
        }
        insideAtExtend = false;
        insideAtImport = false;
        print_string(ch);
        eatWhitespace(true);
        if (input.peek() !== '/') {
          output.add_new_line();
        }
      } else if (ch === '(') {
        if (input.lookBack("url")) {
          print_string(ch);
          eatWhitespace();
          ch = input.next();
          if (ch === ')' || ch === '"' || ch !== '\'') {
            input.back();
            parenLevel++;
          } else if (ch) {
            print_string(ch + eatString(')'));
          }
        } else {
          parenLevel++;
          preserveSingleSpace(isAfterSpace);
          print_string(ch);
          eatWhitespace();
        }
      } else if (ch === ')') {
        print_string(ch);
        parenLevel--;
      } else if (ch === ',') {
        print_string(ch);
        eatWhitespace(true);
        if (selectorSeparatorNewline && !insidePropertyValue && parenLevel < 1 && !insideAtImport) {
          output.add_new_line();
        } else {
          output.space_before_token = true;
        }
      } else if ((ch === '>' || ch === '+' || ch === '~') && !insidePropertyValue && parenLevel < 1) {
        if (space_around_combinator) {
          output.space_before_token = true;
          print_string(ch);
          output.space_before_token = true;
        } else {
          print_string(ch);
          eatWhitespace();
          if (ch && whitespaceChar.test(ch)) {
            ch = '';
          }
        }
      } else if (ch === ']') {
        print_string(ch);
      } else if (ch === '[') {
        preserveSingleSpace(isAfterSpace);
        print_string(ch);
      } else if (ch === '=') {
        eatWhitespace();
        print_string('=');
        if (whitespaceChar.test(ch)) {
          ch = '';
        }
      } else if (ch === '!') {
        print_string(' ');
        print_string(ch);
      } else {
        preserveSingleSpace(isAfterSpace);
        print_string(ch);
      }
    }
    var sweetCode = output.get_code(end_with_newline, eol);
    return sweetCode;
  };
  this.NESTED_AT_RULE = {
    "@page": true,
    "@font-face": true,
    "@keyframes": true,
    "@media": true,
    "@supports": true,
    "@document": true
  };
  this.CONDITIONAL_GROUP_RULE = {
    "@media": true,
    "@supports": true,
    "@document": true
  };
}
module.exports.Beautifier = Beautifier;
