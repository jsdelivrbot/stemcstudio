/* */ 
'use strict';
var BaseTokenizer = require('../core/tokenizer').Tokenizer;
var BASETOKEN = require('../core/tokenizer').TOKEN;
var Directives = require('../core/directives').Directives;
var acorn = require('../core/acorn');
var TOKEN = {
  TAG_OPEN: 'TK_TAG_OPEN',
  TAG_CLOSE: 'TK_TAG_CLOSE',
  ATTRIBUTE: 'TK_ATTRIBUTE',
  EQUALS: 'TK_EQUALS',
  VALUE: 'TK_VALUE',
  COMMENT: 'TK_COMMENT',
  TEXT: 'TK_TEXT',
  UNKNOWN: 'TK_UNKNOWN',
  START: BASETOKEN.START,
  RAW: BASETOKEN.RAW,
  EOF: BASETOKEN.EOF
};
var directives_core = new Directives(/<\!--/, /-->/);
var Tokenizer = function(input_string, options) {
  BaseTokenizer.call(this, input_string, options);
  this._current_tag_name = '';
  this._whitespace_pattern = /[\n\r\t ]+/g;
  this._newline_pattern = /([^\n\r]*)(\r\n|[\n\r])?/g;
  this._word_pattern = this._options.indent_handlebars ? /[\n\r\t <]|{{/g : /[\n\r\t <]/g;
};
Tokenizer.prototype = new BaseTokenizer();
Tokenizer.prototype._is_comment = function(current_token) {
  return false;
};
Tokenizer.prototype._is_opening = function(current_token) {
  return current_token.type === TOKEN.TAG_OPEN;
};
Tokenizer.prototype._is_closing = function(current_token, open_token) {
  return current_token.type === TOKEN.TAG_CLOSE && (open_token && (((current_token.text === '>' || current_token.text === '/>') && open_token.text[0] === '<') || (current_token.text === '}}' && open_token.text[0] === '{' && open_token.text[1] === '{')));
};
Tokenizer.prototype._reset = function() {
  this._current_tag_name = '';
};
Tokenizer.prototype._get_next_token = function(previous_token, open_token) {
  this._readWhitespace();
  var token = null;
  var c = this._input.peek();
  if (c === null) {
    return this._create_token(TOKEN.EOF, '');
  }
  token = token || this._read_attribute(c, previous_token, open_token);
  token = token || this._read_raw_content(previous_token, open_token);
  token = token || this._read_comment(c);
  token = token || this._read_open(c, open_token);
  token = token || this._read_close(c, open_token);
  token = token || this._read_content_word();
  token = token || this._create_token(TOKEN.UNKNOWN, this._input.next());
  return token;
};
Tokenizer.prototype._read_comment = function(c) {
  var token = null;
  if (c === '<' || c === '{') {
    var peek1 = this._input.peek(1);
    var peek2 = this._input.peek(2);
    if ((c === '<' && (peek1 === '!' || peek1 === '?' || peek1 === '%')) || this._options.indent_handlebars && c === '{' && peek1 === '{' && peek2 === '!') {
      var comment = '',
          delimiter = '>',
          matched = false;
      var input_char = this._input.next();
      while (input_char) {
        comment += input_char;
        if (comment.charAt(comment.length - 1) === delimiter.charAt(delimiter.length - 1) && comment.indexOf(delimiter) !== -1) {
          break;
        }
        if (!matched) {
          matched = comment.length > 10;
          if (comment.indexOf('<![if') === 0) {
            delimiter = '<![endif]>';
            matched = true;
          } else if (comment.indexOf('<![cdata[') === 0) {
            delimiter = ']]>';
            matched = true;
          } else if (comment.indexOf('<![') === 0) {
            delimiter = ']>';
            matched = true;
          } else if (comment.indexOf('<!--') === 0) {
            delimiter = '-->';
            matched = true;
          } else if (comment.indexOf('{{!--') === 0) {
            delimiter = '--}}';
            matched = true;
          } else if (comment.indexOf('{{!') === 0) {
            if (comment.length === 5 && comment.indexOf('{{!--') === -1) {
              delimiter = '}}';
              matched = true;
            }
          } else if (comment.indexOf('<?') === 0) {
            delimiter = '?>';
            matched = true;
          } else if (comment.indexOf('<%') === 0) {
            delimiter = '%>';
            matched = true;
          }
        }
        input_char = this._input.next();
      }
      var directives = directives_core.get_directives(comment);
      if (directives && directives.ignore === 'start') {
        comment += directives_core.readIgnored(this._input);
      }
      comment = comment.replace(acorn.allLineBreaks, '\n');
      token = this._create_token(TOKEN.COMMENT, comment);
      token.directives = directives;
    }
  }
  return token;
};
Tokenizer.prototype._read_open = function(c, open_token) {
  var resulting_string = null;
  var token = null;
  if (!open_token) {
    if (c === '<') {
      resulting_string = this._input.read(/<(?:[^\n\r\t >{][^\n\r\t >{/]*)?/g);
      token = this._create_token(TOKEN.TAG_OPEN, resulting_string);
    } else if (this._options.indent_handlebars && c === '{' && this._input.peek(1) === '{') {
      resulting_string = this._input.readUntil(/[\n\r\t }]/g);
      token = this._create_token(TOKEN.TAG_OPEN, resulting_string);
    }
  }
  return token;
};
Tokenizer.prototype._read_close = function(c, open_token) {
  var resulting_string = null;
  var token = null;
  if (open_token) {
    if (open_token.text[0] === '<' && (c === '>' || (c === '/' && this._input.peek(1) === '>'))) {
      resulting_string = this._input.next();
      if (c === '/') {
        resulting_string += this._input.next();
      }
      token = this._create_token(TOKEN.TAG_CLOSE, resulting_string);
    } else if (open_token.text[0] === '{' && c === '}' && this._input.peek(1) === '}') {
      this._input.next();
      this._input.next();
      token = this._create_token(TOKEN.TAG_CLOSE, '}}');
    }
  }
  return token;
};
Tokenizer.prototype._read_attribute = function(c, previous_token, open_token) {
  var token = null;
  var resulting_string = '';
  if (open_token && open_token.text[0] === '<') {
    if (c === '=') {
      token = this._create_token(TOKEN.EQUALS, this._input.next());
    } else if (c === '"' || c === "'") {
      var content = this._input.next();
      var input_string = '';
      var string_pattern = new RegExp(c + '|{{', 'g');
      while (this._input.hasNext()) {
        input_string = this._input.readUntilAfter(string_pattern);
        content += input_string;
        if (input_string[input_string.length - 1] === '"' || input_string[input_string.length - 1] === "'") {
          break;
        } else if (this._input.hasNext()) {
          content += this._input.readUntilAfter(/}}/g);
        }
      }
      token = this._create_token(TOKEN.VALUE, content);
    } else {
      if (c === '{' && this._input.peek(1) === '{') {
        resulting_string = this._input.readUntilAfter(/}}/g);
      } else {
        resulting_string = this._input.readUntil(/[\n\r\t =\/>]/g);
      }
      if (resulting_string) {
        if (previous_token.type === TOKEN.EQUALS) {
          token = this._create_token(TOKEN.VALUE, resulting_string);
        } else {
          token = this._create_token(TOKEN.ATTRIBUTE, resulting_string);
        }
      }
    }
  }
  return token;
};
Tokenizer.prototype._is_content_unformatted = function(tag_name) {
  return this._options.void_elements.indexOf(tag_name) === -1 && (tag_name === 'script' || tag_name === 'style' || this._options.content_unformatted.indexOf(tag_name) !== -1 || this._options.unformatted.indexOf(tag_name) !== -1);
};
Tokenizer.prototype._read_raw_content = function(previous_token, open_token) {
  var resulting_string = '';
  if (open_token && open_token.text[0] === '{') {
    resulting_string = this._input.readUntil(/}}/g);
  } else if (previous_token.type === TOKEN.TAG_CLOSE && (previous_token.opened.text[0] === '<')) {
    var tag_name = previous_token.opened.text.substr(1).toLowerCase();
    if (this._is_content_unformatted(tag_name)) {
      resulting_string = this._input.readUntil(new RegExp('</' + tag_name + '[\\n\\r\\t ]*?>', 'ig'));
    }
  }
  if (resulting_string) {
    return this._create_token(TOKEN.TEXT, resulting_string);
  }
  return null;
};
Tokenizer.prototype._read_content_word = function() {
  var resulting_string = this._input.readUntil(this._word_pattern);
  if (resulting_string) {
    return this._create_token(TOKEN.TEXT, resulting_string);
  }
};
module.exports.Tokenizer = Tokenizer;
module.exports.TOKEN = TOKEN;
