/* */ 
'use strict';
var Options = require('./options').Options;
var Output = require('../core/output').Output;
var Tokenizer = require('./tokenizer').Tokenizer;
var TOKEN = require('./tokenizer').TOKEN;
var lineBreak = /\r\n|[\r\n]/;
var allLineBreaks = /\r\n|[\r\n]/g;
var Printer = function(options, base_indent_string) {
  this.indent_level = 0;
  this.alignment_size = 0;
  this.wrap_line_length = options.wrap_line_length;
  this.max_preserve_newlines = options.max_preserve_newlines;
  this.preserve_newlines = options.preserve_newlines;
  this._output = new Output(options, base_indent_string);
};
Printer.prototype.current_line_has_match = function(pattern) {
  return this._output.current_line.has_match(pattern);
};
Printer.prototype.set_space_before_token = function(value) {
  this._output.space_before_token = value;
};
Printer.prototype.add_raw_token = function(token) {
  this._output.add_raw_token(token);
};
Printer.prototype.traverse_whitespace = function(raw_token) {
  if (raw_token.whitespace_before || raw_token.newlines) {
    var newlines = 0;
    if (raw_token.type !== TOKEN.TEXT && raw_token.previous.type !== TOKEN.TEXT) {
      newlines = raw_token.newlines ? 1 : 0;
    }
    if (this.preserve_newlines) {
      newlines = raw_token.newlines < this.max_preserve_newlines + 1 ? raw_token.newlines : this.max_preserve_newlines + 1;
    }
    if (newlines) {
      for (var n = 0; n < newlines; n++) {
        this.print_newline(n > 0);
      }
    } else {
      this._output.space_before_token = true;
      this.print_space_or_wrap(raw_token.text);
    }
    return true;
  }
  return false;
};
Printer.prototype.print_space_or_wrap = function(text) {
  if (this.wrap_line_length) {
    if (this._output.current_line.get_character_count() + text.length + 1 >= this.wrap_line_length) {
      return this._output.add_new_line();
    }
  }
  return false;
};
Printer.prototype.print_newline = function(force) {
  this._output.add_new_line(force);
};
Printer.prototype.print_token = function(text) {
  if (text) {
    if (this._output.current_line.is_empty()) {
      this._output.set_indent(this.indent_level, this.alignment_size);
    }
    this._output.add_token(text);
  }
};
Printer.prototype.print_raw_text = function(text) {
  this._output.current_line.push_raw(text);
};
Printer.prototype.indent = function() {
  this.indent_level++;
};
Printer.prototype.unindent = function() {
  if (this.indent_level > 0) {
    this.indent_level--;
  }
};
Printer.prototype.get_full_indent = function(level) {
  level = this.indent_level + (level || 0);
  if (level < 1) {
    return '';
  }
  return this._output.get_indent_string(level);
};
var uses_beautifier = function(tag_check, start_token) {
  var raw_token = start_token.next;
  if (!start_token.closed) {
    return false;
  }
  while (raw_token.type !== TOKEN.EOF && raw_token.closed !== start_token) {
    if (raw_token.type === TOKEN.ATTRIBUTE && raw_token.text === 'type') {
      var peekEquals = raw_token.next ? raw_token.next : raw_token;
      var peekValue = peekEquals.next ? peekEquals.next : peekEquals;
      if (peekEquals.type === TOKEN.EQUALS && peekValue.type === TOKEN.VALUE) {
        return (tag_check === 'style' && peekValue.text.search('text/css') > -1) || (tag_check === 'script' && peekValue.text.search(/(text|application|dojo)\/(x-)?(javascript|ecmascript|jscript|livescript|(ld\+)?json|method|aspect)/) > -1);
      }
      return false;
    }
    raw_token = raw_token.next;
  }
  return true;
};
function in_array(what, arr) {
  return arr.indexOf(what) !== -1;
}
function TagFrame(parent, parser_token, indent_level) {
  this.parent = parent || null;
  this.tag = parser_token ? parser_token.tag_name : '';
  this.indent_level = indent_level || 0;
  this.parser_token = parser_token || null;
}
function TagStack(printer) {
  this._printer = printer;
  this._current_frame = null;
}
TagStack.prototype.get_parser_token = function() {
  return this._current_frame ? this._current_frame.parser_token : null;
};
TagStack.prototype.record_tag = function(parser_token) {
  var new_frame = new TagFrame(this._current_frame, parser_token, this._printer.indent_level);
  this._current_frame = new_frame;
};
TagStack.prototype._try_pop_frame = function(frame) {
  var parser_token = null;
  if (frame) {
    parser_token = frame.parser_token;
    this._printer.indent_level = frame.indent_level;
    this._current_frame = frame.parent;
  }
  return parser_token;
};
TagStack.prototype._get_frame = function(tag_list, stop_list) {
  var frame = this._current_frame;
  while (frame) {
    if (tag_list.indexOf(frame.tag) !== -1) {
      break;
    } else if (stop_list && stop_list.indexOf(frame.tag) !== -1) {
      frame = null;
      break;
    }
    frame = frame.parent;
  }
  return frame;
};
TagStack.prototype.try_pop = function(tag, stop_list) {
  var frame = this._get_frame([tag], stop_list);
  return this._try_pop_frame(frame);
};
TagStack.prototype.indent_to_tag = function(tag_list) {
  var frame = this._get_frame(tag_list);
  if (frame) {
    this._printer.indent_level = frame.indent_level;
  }
};
function Beautifier(source_text, options, js_beautify, css_beautify) {
  this._source_text = source_text || '';
  options = options || {};
  this._js_beautify = js_beautify;
  this._css_beautify = css_beautify;
  this._tag_stack = null;
  var optionHtml = new Options(options, 'html');
  this._options = optionHtml;
  this._is_wrap_attributes_force = this._options.wrap_attributes.substr(0, 'force'.length) === 'force';
  this._is_wrap_attributes_force_expand_multiline = (this._options.wrap_attributes === 'force-expand-multiline');
  this._is_wrap_attributes_force_aligned = (this._options.wrap_attributes === 'force-aligned');
  this._is_wrap_attributes_aligned_multiple = (this._options.wrap_attributes === 'aligned-multiple');
}
Beautifier.prototype.beautify = function() {
  if (this._options.disabled) {
    return this._source_text;
  }
  var source_text = this._source_text;
  var eol = this._options.eol;
  if (this._options.eol === 'auto') {
    eol = '\n';
    if (source_text && lineBreak.test(source_text)) {
      eol = source_text.match(lineBreak)[0];
    }
  }
  source_text = source_text.replace(allLineBreaks, '\n');
  var baseIndentString = '';
  var last_token = {
    text: '',
    type: ''
  };
  var last_tag_token = new TagOpenParserToken();
  var printer = new Printer(this._options, baseIndentString);
  var tokens = new Tokenizer(source_text, this._options).tokenize();
  this._tag_stack = new TagStack(printer);
  var parser_token = null;
  var raw_token = tokens.next();
  while (raw_token.type !== TOKEN.EOF) {
    if (raw_token.type === TOKEN.TAG_OPEN || raw_token.type === TOKEN.COMMENT) {
      parser_token = this._handle_tag_open(printer, raw_token, last_tag_token, last_token);
      last_tag_token = parser_token;
    } else if ((raw_token.type === TOKEN.ATTRIBUTE || raw_token.type === TOKEN.EQUALS || raw_token.type === TOKEN.VALUE) || (raw_token.type === TOKEN.TEXT && !last_tag_token.tag_complete)) {
      parser_token = this._handle_inside_tag(printer, raw_token, last_tag_token, tokens);
    } else if (raw_token.type === TOKEN.TAG_CLOSE) {
      parser_token = this._handle_tag_close(printer, raw_token, last_tag_token);
    } else if (raw_token.type === TOKEN.TEXT) {
      parser_token = this._handle_text(printer, raw_token, last_tag_token);
    } else {
      printer.add_raw_token(raw_token);
    }
    last_token = parser_token;
    raw_token = tokens.next();
  }
  var sweet_code = printer._output.get_code(eol);
  return sweet_code;
};
Beautifier.prototype._handle_tag_close = function(printer, raw_token, last_tag_token) {
  var parser_token = {
    text: raw_token.text,
    type: raw_token.type
  };
  printer.alignment_size = 0;
  last_tag_token.tag_complete = true;
  printer.set_space_before_token(raw_token.newlines || raw_token.whitespace_before !== '');
  if (last_tag_token.is_unformatted) {
    printer.add_raw_token(raw_token);
  } else {
    if (last_tag_token.tag_start_char === '<') {
      printer.set_space_before_token(raw_token.text[0] === '/');
      if (this._is_wrap_attributes_force_expand_multiline && last_tag_token.has_wrapped_attrs) {
        printer.print_newline(false);
      }
    }
    printer.print_token(raw_token.text);
  }
  if (last_tag_token.indent_content && !(last_tag_token.is_unformatted || last_tag_token.is_content_unformatted)) {
    printer.indent();
    last_tag_token.indent_content = false;
  }
  return parser_token;
};
Beautifier.prototype._handle_inside_tag = function(printer, raw_token, last_tag_token, tokens) {
  var parser_token = {
    text: raw_token.text,
    type: raw_token.type
  };
  printer.set_space_before_token(raw_token.newlines || raw_token.whitespace_before !== '');
  if (last_tag_token.is_unformatted) {
    printer.add_raw_token(raw_token);
  } else {
    if (last_tag_token.tag_start_char === '<') {
      if (raw_token.type === TOKEN.ATTRIBUTE) {
        printer.set_space_before_token(true);
        last_tag_token.attr_count += 1;
      } else if (raw_token.type === TOKEN.EQUALS) {
        printer.set_space_before_token(false);
      } else if (raw_token.type === TOKEN.VALUE && raw_token.previous.type === TOKEN.EQUALS) {
        printer.set_space_before_token(false);
      }
    }
    if (printer._output.space_before_token && last_tag_token.tag_start_char === '<') {
      var wrapped = printer.print_space_or_wrap(raw_token.text);
      if (raw_token.type === TOKEN.ATTRIBUTE) {
        var indentAttrs = wrapped && !this._is_wrap_attributes_force;
        if (this._is_wrap_attributes_force) {
          var force_first_attr_wrap = false;
          if (this._is_wrap_attributes_force_expand_multiline && last_tag_token.attr_count === 1) {
            var is_only_attribute = true;
            var peek_index = 0;
            var peek_token;
            do {
              peek_token = tokens.peek(peek_index);
              if (peek_token.type === TOKEN.ATTRIBUTE) {
                is_only_attribute = false;
                break;
              }
              peek_index += 1;
            } while (peek_index < 4 && peek_token.type !== TOKEN.EOF && peek_token.type !== TOKEN.TAG_CLOSE);
            force_first_attr_wrap = !is_only_attribute;
          }
          if (last_tag_token.attr_count > 1 || force_first_attr_wrap) {
            printer.print_newline(false);
            indentAttrs = true;
          }
        }
        if (indentAttrs) {
          last_tag_token.has_wrapped_attrs = true;
        }
      }
    }
    printer.print_token(raw_token.text);
  }
  return parser_token;
};
Beautifier.prototype._handle_text = function(printer, raw_token, last_tag_token) {
  var parser_token = {
    text: raw_token.text,
    type: 'TK_CONTENT'
  };
  if (last_tag_token.custom_beautifier) {
    this._print_custom_beatifier_text(printer, raw_token, last_tag_token);
  } else if (last_tag_token.is_unformatted || last_tag_token.is_content_unformatted) {
    printer.add_raw_token(raw_token);
  } else {
    printer.traverse_whitespace(raw_token);
    printer.print_token(raw_token.text);
  }
  return parser_token;
};
Beautifier.prototype._print_custom_beatifier_text = function(printer, raw_token, last_tag_token) {
  if (raw_token.text !== '') {
    printer.print_newline(false);
    var text = raw_token.text,
        _beautifier,
        script_indent_level = 1;
    if (last_tag_token.tag_name === 'script') {
      _beautifier = typeof this._js_beautify === 'function' && this._js_beautify;
    } else if (last_tag_token.tag_name === 'style') {
      _beautifier = typeof this._css_beautify === 'function' && this._css_beautify;
    }
    if (this._options.indent_scripts === "keep") {
      script_indent_level = 0;
    } else if (this._options.indent_scripts === "separate") {
      script_indent_level = -printer.indent_level;
    }
    var indentation = printer.get_full_indent(script_indent_level);
    text = text.replace(/\n[ \t]*$/, '');
    if (_beautifier) {
      var Child_options = function() {
        this.eol = '\n';
      };
      Child_options.prototype = this._options.raw_options;
      var child_options = new Child_options();
      text = _beautifier(indentation + text, child_options);
    } else {
      var white = text.match(/^\s*/)[0];
      var _level = white.match(/[^\n\r]*$/)[0].split(this._options.indent_string).length - 1;
      var reindent = this._get_full_indent(script_indent_level - _level);
      text = (indentation + text.trim()).replace(/\r\n|\r|\n/g, '\n' + reindent);
    }
    if (text) {
      printer.print_raw_text(text);
      printer.print_newline(true);
    }
  }
};
Beautifier.prototype._handle_tag_open = function(printer, raw_token, last_tag_token, last_token) {
  var parser_token = this._get_tag_open_token(raw_token);
  if ((last_tag_token.is_unformatted || last_tag_token.is_content_unformatted) && raw_token.type === TOKEN.TAG_OPEN && raw_token.text.indexOf('</') === 0) {
    printer.add_raw_token(raw_token);
  } else {
    printer.traverse_whitespace(raw_token);
    this._set_tag_position(printer, raw_token, parser_token, last_tag_token, last_token);
    printer.print_token(raw_token.text);
  }
  if (this._is_wrap_attributes_force_aligned || this._is_wrap_attributes_aligned_multiple) {
    parser_token.alignment_size = raw_token.text.length + 1;
  }
  if (!parser_token.tag_complete && !parser_token.is_unformatted) {
    printer.alignment_size = parser_token.alignment_size;
  }
  return parser_token;
};
var TagOpenParserToken = function(parent, raw_token) {
  this.parent = parent || null;
  this.text = '';
  this.type = 'TK_TAG_OPEN';
  this.tag_name = '';
  this.is_inline_element = false;
  this.is_unformatted = false;
  this.is_content_unformatted = false;
  this.is_empty_element = false;
  this.is_start_tag = false;
  this.is_end_tag = false;
  this.indent_content = false;
  this.multiline_content = false;
  this.custom_beautifier = false;
  this.start_tag_token = null;
  this.attr_count = 0;
  this.has_wrapped_attrs = false;
  this.alignment_size = 0;
  this.tag_complete = false;
  this.tag_start_char = '';
  this.tag_check = '';
  if (!raw_token) {
    this.tag_complete = true;
  } else {
    var tag_check_match;
    this.tag_start_char = raw_token.text[0];
    this.text = raw_token.text;
    if (this.tag_start_char === '<') {
      tag_check_match = raw_token.text.match(/^<([^\s>]*)/);
      this.tag_check = tag_check_match ? tag_check_match[1] : '';
    } else {
      tag_check_match = raw_token.text.match(/^{{\#?([^\s}]+)/);
      this.tag_check = tag_check_match ? tag_check_match[1] : '';
    }
    this.tag_check = this.tag_check.toLowerCase();
    if (raw_token.type === TOKEN.COMMENT) {
      this.tag_complete = true;
    }
    this.is_start_tag = this.tag_check.charAt(0) !== '/';
    this.tag_name = !this.is_start_tag ? this.tag_check.substr(1) : this.tag_check;
    this.is_end_tag = !this.is_start_tag || (raw_token.closed && raw_token.closed.text === '/>');
    this.is_end_tag = this.is_end_tag || (this.tag_start_char === '{' && (this.text.length < 3 || (/[^#\^]/.test(this.text.charAt(2)))));
  }
};
Beautifier.prototype._get_tag_open_token = function(raw_token) {
  var parser_token = new TagOpenParserToken(this._tag_stack.get_parser_token(), raw_token);
  parser_token.alignment_size = this._options.wrap_attributes_indent_size;
  parser_token.is_end_tag = parser_token.is_end_tag || in_array(parser_token.tag_check, this._options.void_elements);
  parser_token.is_empty_element = parser_token.tag_complete || (parser_token.is_start_tag && parser_token.is_end_tag);
  parser_token.is_unformatted = !parser_token.tag_complete && in_array(parser_token.tag_check, this._options.unformatted);
  parser_token.is_content_unformatted = !parser_token.is_empty_element && in_array(parser_token.tag_check, this._options.content_unformatted);
  parser_token.is_inline_element = in_array(parser_token.tag_name, this._options.inline) || parser_token.tag_start_char === '{';
  return parser_token;
};
Beautifier.prototype._set_tag_position = function(printer, raw_token, parser_token, last_tag_token, last_token) {
  if (!parser_token.is_empty_element) {
    if (parser_token.is_end_tag) {
      parser_token.start_tag_token = this._tag_stack.try_pop(parser_token.tag_name);
    } else {
      this._do_optional_end_element(parser_token);
      this._tag_stack.record_tag(parser_token);
      if ((parser_token.tag_name === 'script' || parser_token.tag_name === 'style') && !(parser_token.is_unformatted || parser_token.is_content_unformatted)) {
        parser_token.custom_beautifier = uses_beautifier(parser_token.tag_check, raw_token);
      }
    }
  }
  if (in_array(parser_token.tag_check, this._options.extra_liners)) {
    printer.print_newline(false);
    if (!printer._output.just_added_blankline()) {
      printer.print_newline(true);
    }
  }
  if (parser_token.is_empty_element) {
    if (parser_token.tag_start_char === '{' && parser_token.tag_check === 'else') {
      this._tag_stack.indent_to_tag(['if', 'unless', 'each']);
      parser_token.indent_content = true;
      var foundIfOnCurrentLine = printer.current_line_has_match(/{{#if/);
      if (!foundIfOnCurrentLine) {
        printer.print_newline(false);
      }
    }
    if (parser_token.tag_name === '!--' && last_token.type === TOKEN.TAG_CLOSE && last_tag_token.is_end_tag && parser_token.text.indexOf('\n') === -1) {} else if (!parser_token.is_inline_element && !parser_token.is_unformatted) {
      printer.print_newline(false);
    }
  } else if (parser_token.is_unformatted || parser_token.is_content_unformatted) {
    if (!parser_token.is_inline_element && !parser_token.is_unformatted) {
      printer.print_newline(false);
    }
  } else if (parser_token.is_end_tag) {
    if ((parser_token.start_tag_token && parser_token.start_tag_token.multiline_content) || !(parser_token.is_inline_element || (last_tag_token.is_inline_element) || (last_token.type === TOKEN.TAG_CLOSE && parser_token.start_tag_token === last_tag_token) || (last_token.type === 'TK_CONTENT'))) {
      printer.print_newline(false);
    }
  } else {
    parser_token.indent_content = !parser_token.custom_beautifier;
    if (parser_token.tag_start_char === '<') {
      if (parser_token.tag_name === 'html') {
        parser_token.indent_content = this._options.indent_inner_html;
      } else if (parser_token.tag_name === 'head') {
        parser_token.indent_content = this._options.indent_head_inner_html;
      } else if (parser_token.tag_name === 'body') {
        parser_token.indent_content = this._options.indent_body_inner_html;
      }
    }
    if (!parser_token.is_inline_element && last_token.type !== 'TK_CONTENT') {
      if (parser_token.parent) {
        parser_token.parent.multiline_content = true;
      }
      printer.print_newline(false);
    }
  }
};
Beautifier.prototype._do_optional_end_element = function(parser_token) {
  if (parser_token.is_empty_element || !parser_token.is_start_tag || !parser_token.parent) {
    return;
  } else if (parser_token.tag_name === 'body') {
    this._tag_stack.try_pop('head');
  } else if (parser_token.tag_name === 'li') {
    this._tag_stack.try_pop('li', ['ol', 'ul']);
  } else if (parser_token.tag_name === 'dd' || parser_token.tag_name === 'dt') {
    this._tag_stack.try_pop('dt', ['dl']);
    this._tag_stack.try_pop('dd', ['dl']);
  } else if (parser_token.tag_name === 'rp' || parser_token.tag_name === 'rt') {
    this._tag_stack.try_pop('rt', ['ruby', 'rtc']);
    this._tag_stack.try_pop('rp', ['ruby', 'rtc']);
  } else if (parser_token.tag_name === 'optgroup') {
    this._tag_stack.try_pop('optgroup', ['select']);
  } else if (parser_token.tag_name === 'option') {
    this._tag_stack.try_pop('option', ['select', 'datalist', 'optgroup']);
  } else if (parser_token.tag_name === 'colgroup') {
    this._tag_stack.try_pop('caption', ['table']);
  } else if (parser_token.tag_name === 'thead') {
    this._tag_stack.try_pop('caption', ['table']);
    this._tag_stack.try_pop('colgroup', ['table']);
  } else if (parser_token.tag_name === 'tbody' || parser_token.tag_name === 'tfoot') {
    this._tag_stack.try_pop('caption', ['table']);
    this._tag_stack.try_pop('colgroup', ['table']);
    this._tag_stack.try_pop('thead', ['table']);
    this._tag_stack.try_pop('tbody', ['table']);
  } else if (parser_token.tag_name === 'tr') {
    this._tag_stack.try_pop('caption', ['table']);
    this._tag_stack.try_pop('colgroup', ['table']);
    this._tag_stack.try_pop('tr', ['table', 'thead', 'tbody', 'tfoot']);
  } else if (parser_token.tag_name === 'th' || parser_token.tag_name === 'td') {
    this._tag_stack.try_pop('td', ['tr']);
    this._tag_stack.try_pop('th', ['tr']);
  }
  parser_token.parent = this._tag_stack.get_parser_token();
};
module.exports.Beautifier = Beautifier;
