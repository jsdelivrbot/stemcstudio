import Token from './Token'
import literals from './literals'
import operators from './operators'
import builtins from './builtins'

const NORMAL = 999;          // <-- never emitted
const TOKEN = 9999;          // <-- never emitted
// These things are called mode(s) and correspond to the following map.
const BLOCK_COMMENT = 0;
const LINE_COMMENT = 1;
const PREPROCESSOR = 2;
const OPERATOR = 3;
const INTEGER = 4;
const FLOAT = 5;
const IDENT = 6;
const BUILTIN = 7;
const KEYWORD = 8;
const WHITESPACE = 9;
const EOF = 10;
const HEX = 11;

const map: string[] = [
    'block-comment'
  , 'line-comment'
  , 'preprocessor'
  , 'operator'
  , 'integer'
  , 'float'
  , 'ident'
  , 'builtin'
  , 'keyword'
  , 'whitespace'
  , 'eof'
  , 'integer'
]

export default function tokenize() {

  function token(data: string): void {
    if (data.length) {
      tokens.push({
        type: map[mode]
      , data: data
      , position: start
      , line: line
      , column: col
      })
    }
  }

  function write(chunk: string) {
    i = 0
    input += chunk
    len = input.length

    var last: number

    while(c = input[i], i < len) {
      last = i

      switch(mode) {
        case BLOCK_COMMENT: i = block_comment(); break
        case LINE_COMMENT: i = line_comment(); break
        case PREPROCESSOR: i = preprocessor(); break
        case OPERATOR: i = operator(); break
        case INTEGER: i = integer(); break
        case HEX: i = hex(); break
        case FLOAT: i = decimal(); break
        case TOKEN: i = readtoken(); break
        case WHITESPACE: i = whitespace(); break
        case NORMAL: i = normal(); break
      }

      if(last !== i) {
        switch(input[last]) {
          case '\n': col = 0; ++line; break
          default: ++col; break
        }
      }
    }

    total += i
    input = input.slice(i)
    return tokens
  }

  function end(chunk?: string) {
    if(content.length) {
      token(content.join(''))
    }

    mode = EOF
    token('(eof)')
    return tokens
  }

  function normal() {
    content = content.length ? [] : content

    if(last === '/' && c === '*') {
      start = total + i - 1
      mode = BLOCK_COMMENT
      last = c
      return i + 1
    }

    if(last === '/' && c === '/') {
      start = total + i - 1
      mode = LINE_COMMENT
      last = c
      return i + 1
    }

    if(c === '#') {
      mode = PREPROCESSOR
      start = total + i
      return i
    }

    if(/\s/.test(c)) {
      mode = WHITESPACE
      start = total + i
      return i
    }

    isnum = /\d/.test(c)
    isoperator = /[^\w_]/.test(c)

    start = total + i
    mode = isnum ? INTEGER : isoperator ? OPERATOR : TOKEN
    return i
  }

  function whitespace() {
    if(/[^\s]/g.test(c)) {
      token(content.join(''))
      mode = NORMAL
      return i
    }
    content.push(c)
    last = c
    return i + 1
  }

  function preprocessor() {
    if(c === '\n' && last !== '\\') {
      token(content.join(''))
      mode = NORMAL
      return i
    }
    content.push(c)
    last = c
    return i + 1
  }

  function line_comment() {
    return preprocessor()
  }

  function block_comment() {
    if(c === '/' && last === '*') {
      content.push(c)
      token(content.join(''))
      mode = NORMAL
      return i + 1
    }

    content.push(c)
    last = c
    return i + 1
  }

  function operator() {
    if(last === '.' && /\d/.test(c)) {
      mode = FLOAT
      return i
    }

    if(last === '/' && c === '*') {
      mode = BLOCK_COMMENT
      return i
    }

    if(last === '/' && c === '/') {
      mode = LINE_COMMENT
      return i
    }

    if(c === '.' && content.length) {
      while(determine_operator(content)) {
        // Do nothing.
      }
      mode = FLOAT
      return i
    }

    if(c === ';' || c === ')' || c === '(') {
      if(content.length) {
        while(determine_operator(content)) {

        }
      }
      token(c)
      mode = NORMAL
      return i + 1
    }

    var is_composite_operator = content.length === 2 && c !== '='
    if(/[\w_\d\s]/.test(c) || is_composite_operator) {
      while(determine_operator(content)) {

      }
      mode = NORMAL
      return i
    }

    content.push(c)
    last = c
    return i + 1
  }

  function determine_operator(buf: string[]) {
    var j = 0
    var idx: number
    var res: any

    do {
      idx = operators.indexOf(buf.slice(0, buf.length + j).join(''))
      res = operators[idx]

      if(idx === -1) {
        if(j-- + buf.length > 0) {
          continue;
        }
        res = buf.slice(0, 1).join('')
      }

      token(res)

      start += res.length
      content = content.slice(res.length)
      return content.length
    } while(1)
  }

  function hex() {
    if(/[^a-fA-F0-9]/.test(c)) {
      token(content.join(''))
      mode = NORMAL
      return i
    }

    content.push(c)
    last = c
    return i + 1
  }

  function integer() {
    if(c === '.') {
      content.push(c)
      mode = FLOAT
      last = c
      return i + 1
    }

    if(/[eE]/.test(c)) {
      content.push(c)
      mode = FLOAT
      last = c
      return i + 1
    }

    if(c === 'x' && content.length === 1 && content[0] === '0') {
      mode = HEX
      content.push(c)
      last = c
      return i + 1
    }

    if(/[^\d]/.test(c)) {
      token(content.join(''))
      mode = NORMAL
      return i
    }

    content.push(c)
    last = c
    return i + 1
  }

  function decimal() {
    if (c === 'f') {
      content.push(c)
      last = c
      i += 1
    }

    if (/[eE]/.test(c)) {
      content.push(c)
      last = c
      return i + 1
    }

    if (/[^\d]/.test(c)) {
      token(content.join(''))
      mode = NORMAL
      return i
    }
    content.push(c)
    last = c
    return i + 1
  }

  function readtoken() {
    if(/[^\d\w_]/.test(c)) {
      var contentstr = content.join('')
      if (literals.indexOf(contentstr) > -1) {
        mode = KEYWORD
      } else if (builtins.indexOf(contentstr) > -1) {
        mode = BUILTIN
      } else {
        mode = IDENT
      }
      token(content.join(''))
      mode = NORMAL
      return i
    }
    content.push(c)
    last = c
    return i + 1
  }

  var i = 0;
  var total = 0;
  var mode = NORMAL;
  var c: any;
  var last: string;
  var content: string[] = [];
  var tokens: Token[] = [];
  var token_idx = 0;
  var token_offs = 0;
  var line = 1;
  var col = 0;
  var start = 0;
  var isnum = false;
  var isoperator = false;
  var input = '';
  var len: number;

  return function(data: string) {
    tokens = []
    if (data !== null) {
      return write(data)
    }
    return end()
  }
}
