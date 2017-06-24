/* */ 
"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var asserts_1 = require('../common/asserts');
var TokenError_1 = require('../common/TokenError');
var Tokens_1 = require('./Tokens');
var T_COMMENT = Tokens_1.Tokens.T_COMMENT;
var T_DEDENT = Tokens_1.Tokens.T_DEDENT;
var T_ENDMARKER = Tokens_1.Tokens.T_ENDMARKER;
var T_ERRORTOKEN = Tokens_1.Tokens.T_ERRORTOKEN;
var T_INDENT = Tokens_1.Tokens.T_INDENT;
var T_NAME = Tokens_1.Tokens.T_NAME;
var T_NEWLINE = Tokens_1.Tokens.T_NEWLINE;
var T_NL = Tokens_1.Tokens.T_NL;
var T_NUMBER = Tokens_1.Tokens.T_NUMBER;
var T_OP = Tokens_1.Tokens.T_OP;
var T_STRING = Tokens_1.Tokens.T_STRING;
var Comment_ = "#[^\\r\\n]*";
var MultiComment_ = "'{3}[^]*'{3}";
var Ident = "[a-zA-Z_]\\w*";
var Binnumber = '0[bB][01]*';
var Hexnumber = '0[xX][\\da-fA-F]*[lL]?';
var Octnumber = '0[oO]?[0-7]*[lL]?';
var Decnumber = '[1-9]\\d*[lL]?';
var Intnumber = group(Binnumber, Hexnumber, Octnumber, Decnumber);
var Exponent = "[eE][-+]?\\d+";
var Pointfloat = group("\\d+\\.\\d*", "\\.\\d+") + maybe(Exponent);
var Expfloat = '\\d+' + Exponent;
var Floatnumber = group(Pointfloat, Expfloat);
var Imagnumber = group("\\d+[jJ]", Floatnumber + "[jJ]");
var Number_ = group(Imagnumber, Floatnumber, Intnumber);
var Single = "^[^'\\\\]*(?:\\\\.[^'\\\\]*)*'";
var Double_ = '^[^"\\\\]*(?:\\\\.[^"\\\\]*)*"';
var Single3 = "[^'\\\\]*(?:(?:\\\\.|'(?!''))[^'\\\\]*)*'''";
var Double3 = '[^"\\\\]*(?:(?:\\\\.|"(?!""))[^"\\\\]*)*"""';
var Triple = group("[ubUB]?[rR]?'''", '[ubUB]?[rR]?"""');
var Operator = group("\\*\\*=?", ">>=?", "<<=?", "<>", "!=", "//=?", "->", "[+\\-*/%&|^=<>]=?", "~");
var Bracket = '[\\][(){}]';
var Special = group('\\r?\\n', '[:;.,`@]');
var Funny = group(Operator, Bracket, Special);
var ContStr = group("[uUbB]?[rR]?'[^\\n'\\\\]*(?:\\\\.[^\\n'\\\\]*)*" + group("'", '\\\\\\r?\\n'), '[uUbB]?[rR]?"[^\\n"\\\\]*(?:\\\\.[^\\n"\\\\]*)*' + group('"', '\\\\\\r?\\n'));
var PseudoExtras = group('\\\\\\r?\\n', Comment_, Triple, MultiComment_);
var PseudoToken = "^" + group(PseudoExtras, Number_, Funny, ContStr, Ident);
var pseudoprog = new RegExp(PseudoToken);
var single3prog = new RegExp(Single3, "g");
var double3prog = new RegExp(Double3, "g");
var endprogs = {
  "'": new RegExp(Single, "g"),
  '"': new RegExp(Double_, "g"),
  "'''": single3prog,
  '"""': double3prog,
  "r'''": single3prog,
  'r"""': double3prog,
  "u'''": single3prog,
  'u"""': double3prog,
  "b'''": single3prog,
  'b"""': double3prog,
  "ur'''": single3prog,
  'ur"""': double3prog,
  "br'''": single3prog,
  'br"""': double3prog,
  "R'''": single3prog,
  'R"""': double3prog,
  "U'''": single3prog,
  'U"""': double3prog,
  "B'''": single3prog,
  'B"""': double3prog,
  "uR'''": single3prog,
  'uR"""': double3prog,
  "Ur'''": single3prog,
  'Ur"""': double3prog,
  "UR'''": single3prog,
  'UR"""': double3prog,
  "bR'''": single3prog,
  'bR"""': double3prog,
  "Br'''": single3prog,
  'Br"""': double3prog,
  "BR'''": single3prog,
  'BR"""': double3prog,
  'r': null,
  'R': null,
  'u': null,
  'U': null,
  'b': null,
  'B': null
};
var triple_quoted = {
  "'''": true,
  '"""': true,
  "r'''": true,
  'r"""': true,
  "R'''": true,
  'R"""': true,
  "u'''": true,
  'u"""': true,
  "U'''": true,
  'U"""': true,
  "b'''": true,
  'b"""': true,
  "B'''": true,
  'B"""': true,
  "ur'''": true,
  'ur"""': true,
  "Ur'''": true,
  'Ur"""': true,
  "uR'''": true,
  'uR"""': true,
  "UR'''": true,
  'UR"""': true,
  "br'''": true,
  'br"""': true,
  "Br'''": true,
  'Br"""': true,
  "bR'''": true,
  'bR"""': true,
  "BR'''": true,
  'BR"""': true
};
var single_quoted = {
  "'": true,
  '"': true,
  "r'": true,
  'r"': true,
  "R'": true,
  'R"': true,
  "u'": true,
  'u"': true,
  "U'": true,
  'U"': true,
  "b'": true,
  'b"': true,
  "B'": true,
  'B"': true,
  "ur'": true,
  'ur"': true,
  "Ur'": true,
  'Ur"': true,
  "uR'": true,
  'uR"': true,
  "UR'": true,
  'UR"': true,
  "br'": true,
  'br"': true,
  "Br'": true,
  'Br"': true,
  "bR'": true,
  'bR"': true,
  "BR'": true,
  'BR"': true
};
var tabsize = 8;
var NAMECHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_';
var NUMCHARS = '0123456789';
var LINE = 0;
var COLUMN = 1;
exports.Done = 'done';
exports.Failed = 'failed';
var Tokenizer = (function() {
  function Tokenizer(interactive, callback) {
    this.callback = callback;
    this.begin = [-1, -1];
    this.end = [-1, -1];
    this.lnum = 0;
    this.parenlev = 0;
    this.strstart = [-1, -1];
    this.callback = callback;
    this.continued = false;
    this.contstr = '';
    this.needcont = false;
    this.contline = undefined;
    this.indents = [0];
    this.endprog = /.*/;
    this.interactive = interactive;
    this.doneFunc = function doneOrFailed() {
      var begin = this.begin;
      var end = this.end;
      begin[LINE] = end[LINE] = this.lnum;
      begin[COLUMN] = end[COLUMN] = 0;
      var N = this.indents.length;
      for (var i = 1; i < N; ++i) {
        if (callback(T_DEDENT, '', begin, end, '')) {
          return exports.Done;
        }
      }
      if (callback(T_ENDMARKER, '', begin, end, '')) {
        return exports.Done;
      }
      return exports.Failed;
    };
  }
  Tokenizer.prototype.generateTokens = function(line) {
    var endmatch;
    var column;
    var endIndex;
    if (!line) {
      line = '';
    }
    this.lnum += 1;
    var pos = 0;
    var max = line.length;
    var callback = this.callback;
    var begin = this.begin;
    begin[LINE] = this.lnum;
    var end = this.end;
    end[LINE] = this.lnum;
    if (this.contstr.length > 0) {
      if (!line) {
        throw new TokenError_1.TokenError("EOF in multi-line string", this.strstart[LINE], this.strstart[COLUMN]);
      }
      this.endprog.lastIndex = 0;
      endmatch = this.endprog.test(line);
      if (endmatch) {
        pos = endIndex = this.endprog.lastIndex;
        end[COLUMN] = endIndex;
        if (callback(T_STRING, this.contstr + line.substring(0, endIndex), this.strstart, end, this.contline + line)) {
          return exports.Done;
        }
        this.contstr = '';
        this.needcont = false;
        this.contline = undefined;
      } else if (this.needcont && line.substring(line.length - 2) !== "\\\n" && line.substring(line.length - 3) !== "\\\r\n") {
        asserts_1.assert(typeof this.contline === 'string');
        end[COLUMN] = line.length;
        if (callback(T_ERRORTOKEN, this.contstr + line, this.strstart, end, this.contline)) {
          return exports.Done;
        }
        this.contstr = '';
        this.contline = undefined;
        return false;
      } else {
        this.contstr += line;
        this.contline = this.contline + line;
        return false;
      }
    } else if (this.parenlev === 0 && !this.continued) {
      if (!line)
        return this.doneFunc();
      column = 0;
      while (pos < max) {
        var ch = line.charAt(pos);
        if (ch === ' ') {
          column += 1;
        } else if (ch === '\t') {
          column = (column / tabsize + 1) * tabsize;
        } else if (ch === '\f') {
          column = 0;
        } else {
          break;
        }
        pos = pos + 1;
      }
      if (pos === max)
        return this.doneFunc();
      if ("#\r\n".indexOf(line.charAt(pos)) !== -1) {
        if (line.charAt(pos) === '#') {
          var comment_token = rstrip(line.substring(pos), '\r\n');
          var nl_pos = pos + comment_token.length;
          begin[COLUMN] = pos;
          end[COLUMN] = nl_pos;
          if (callback(T_COMMENT, comment_token, begin, end, line)) {
            return exports.Done;
          }
          begin[COLUMN] = nl_pos;
          end[COLUMN] = line.length;
          if (callback(T_NL, line.substring(nl_pos), begin, end, line)) {
            return exports.Done;
          }
          return false;
        } else {
          begin[COLUMN] = pos;
          end[COLUMN] = line.length;
          if (callback(T_NL, line.substring(pos), begin, end, line)) {
            return exports.Done;
          }
          if (!this.interactive)
            return false;
        }
      }
      if ("'''".indexOf(line.charAt(pos)) !== -1) {
        if (line.charAt(pos) === "'") {
          var comment_token = line.substring(pos);
          var nl_pos = pos + comment_token.length;
          begin[COLUMN] = pos;
          end[COLUMN] = nl_pos;
          if (callback(T_COMMENT, comment_token, begin, end, line)) {
            return exports.Done;
          }
          begin[COLUMN] = nl_pos;
          end[COLUMN] = line.length;
          if (callback(T_NL, line.substring(nl_pos), begin, end, line)) {
            return exports.Done;
          }
          return false;
        } else {
          begin[COLUMN] = pos;
          end[COLUMN] = line.length;
          if (callback(T_NL, line.substring(pos), begin, end, line)) {
            return exports.Done;
          }
          if (!this.interactive)
            return false;
        }
      }
      if (column > this.indents[this.indents.length - 1]) {
        this.indents.push(column);
        begin[COLUMN] = 0;
        end[COLUMN] = pos;
        if (callback(T_INDENT, line.substring(0, pos), begin, end, line)) {
          return exports.Done;
        }
      }
      while (column < this.indents[this.indents.length - 1]) {
        if (!contains(this.indents, column)) {
          begin[COLUMN] = 0;
          end[COLUMN] = pos;
          throw indentationError("unindent does not match any outer indentation level", begin, end, line);
        }
        this.indents.splice(this.indents.length - 1, 1);
        begin[COLUMN] = pos;
        end[COLUMN] = pos;
        if (callback(T_DEDENT, '', begin, end, line)) {
          return exports.Done;
        }
      }
    } else {
      if (!line) {
        throw new TokenError_1.TokenError("EOF in multi-line statement", this.lnum, 0);
      }
      this.continued = false;
    }
    while (pos < max) {
      var capos = line.charAt(pos);
      while (capos === ' ' || capos === '\f' || capos === '\t') {
        pos += 1;
        capos = line.charAt(pos);
      }
      pseudoprog.lastIndex = 0;
      var pseudomatch = pseudoprog.exec(line.substring(pos));
      if (pseudomatch) {
        var startIndex = pos;
        endIndex = startIndex + pseudomatch[1].length;
        begin[COLUMN] = startIndex;
        end[COLUMN] = endIndex;
        pos = endIndex;
        var token = line.substring(startIndex, endIndex);
        var initial = line.charAt(startIndex);
        if (NUMCHARS.indexOf(initial) !== -1 || (initial === '.' && token !== '.')) {
          if (callback(T_NUMBER, token, begin, end, line)) {
            return exports.Done;
          }
        } else if (initial === '\r' || initial === '\n') {
          var newl = T_NEWLINE;
          if (this.parenlev > 0)
            newl = T_NL;
          if (callback(newl, token, begin, end, line)) {
            return exports.Done;
          }
        } else if (initial === '#' || initial === "'''") {
          if (callback(T_COMMENT, token, begin, end, line)) {
            return exports.Done;
          }
        } else if (triple_quoted.hasOwnProperty(token)) {
          this.endprog = endprogs[token];
          this.endprog.lastIndex = 0;
          endmatch = this.endprog.test(line.substring(pos));
          if (endmatch) {
            pos = this.endprog.lastIndex + pos;
            var token_1 = line.substring(startIndex, pos);
            end[COLUMN] = pos;
            if (callback(T_STRING, token_1, begin, end, line)) {
              return exports.Done;
            }
          } else {
            this.strstart[LINE] = this.lnum;
            this.strstart[COLUMN] = startIndex;
            this.contstr = line.substring(startIndex);
            this.contline = line;
            return false;
          }
        } else if (single_quoted.hasOwnProperty(initial) || single_quoted.hasOwnProperty(token.substring(0, 2)) || single_quoted.hasOwnProperty(token.substring(0, 3))) {
          if (token[token.length - 1] === '\n') {
            this.endprog = endprogs[initial] || endprogs[token[1]] || endprogs[token[2]];
            asserts_1.assert(this.endprog instanceof RegExp);
            this.contstr = line.substring(startIndex);
            this.needcont = true;
            this.contline = line;
            return false;
          } else {
            if (callback(T_STRING, token, begin, end, line)) {
              return exports.Done;
            }
          }
        } else if (NAMECHARS.indexOf(initial) !== -1) {
          if (callback(T_NAME, token, begin, end, line)) {
            return exports.Done;
          }
        } else if (initial === '\\') {
          end[COLUMN] = pos;
          if (callback(T_NL, token, begin, end, line)) {
            return exports.Done;
          }
          this.continued = true;
        } else {
          if ('([{'.indexOf(initial) !== -1) {
            this.parenlev += 1;
          } else if (')]}'.indexOf(initial) !== -1) {
            this.parenlev -= 1;
          }
          if (callback(T_OP, token, begin, end, line)) {
            return exports.Done;
          }
        }
      } else {
        begin[COLUMN] = pos;
        end[COLUMN] = pos + 1;
        if (callback(T_ERRORTOKEN, line.charAt(pos), begin, end, line)) {
          return exports.Done;
        }
        pos += 1;
      }
    }
    return false;
  };
  return Tokenizer;
}());
exports.Tokenizer = Tokenizer;
function group(x, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
  var args = Array.prototype.slice.call(arguments);
  return '(' + args.join('|') + ')';
}
function maybe(x) {
  return group.apply(null, arguments) + "?";
}
function contains(a, obj) {
  var i = a.length;
  while (i--) {
    if (a[i] === obj) {
      return true;
    }
  }
  return false;
}
function rstrip(input, what) {
  var i;
  for (i = input.length; i > 0; --i) {
    if (what.indexOf(input.charAt(i - 1)) === -1)
      break;
  }
  return input.substring(0, i);
}
function indentationError(message, begin, end, text) {
  asserts_1.assert(Array.isArray(begin), "begin must be an Array");
  asserts_1.assert(Array.isArray(end), "end must be an Array");
  var e = new SyntaxError(message);
  e.name = "IndentationError";
  if (begin) {
    e['lineNumber'] = begin[LINE];
    e['columnNumber'] = begin[COLUMN];
  }
  return e;
}
