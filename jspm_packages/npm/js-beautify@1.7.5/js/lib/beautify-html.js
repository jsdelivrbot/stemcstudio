/* */ 
"format cjs";
(function() {
  var legacy_beautify_html = (function(modules) {
    var installedModules = {};
    function __webpack_require__(moduleId) {
      if (installedModules[moduleId]) {
        return installedModules[moduleId].exports;
      }
      var module = installedModules[moduleId] = {
        i: moduleId,
        l: false,
        exports: {}
      };
      modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
      module.l = true;
      return module.exports;
    }
    __webpack_require__.m = modules;
    __webpack_require__.c = installedModules;
    __webpack_require__.i = function(value) {
      return value;
    };
    __webpack_require__.d = function(exports, name, getter) {
      if (!__webpack_require__.o(exports, name)) {
        Object.defineProperty(exports, name, {
          configurable: false,
          enumerable: true,
          get: getter
        });
      }
    };
    __webpack_require__.n = function(module) {
      var getter = module && module.__esModule ? function getDefault() {
        return module['default'];
      } : function getModuleExports() {
        return module;
      };
      __webpack_require__.d(getter, 'a', getter);
      return getter;
    };
    __webpack_require__.o = function(object, property) {
      return Object.prototype.hasOwnProperty.call(object, property);
    };
    __webpack_require__.p = "";
    return __webpack_require__(__webpack_require__.s = 3);
  })([(function(module, exports, __webpack_require__) {
    var mergeOpts = __webpack_require__(2).mergeOpts;
    var acorn = __webpack_require__(1);
    var lineBreak = acorn.lineBreak;
    var allLineBreaks = acorn.allLineBreaks;
    function ltrim(s) {
      return s.replace(/^\s+/g, '');
    }
    function rtrim(s) {
      return s.replace(/\s+$/g, '');
    }
    function Beautifier(html_source, options, js_beautify, css_beautify) {
      html_source = html_source || '';
      var multi_parser,
          indent_inner_html,
          indent_body_inner_html,
          indent_head_inner_html,
          indent_size,
          indent_character,
          wrap_line_length,
          brace_style,
          unformatted,
          content_unformatted,
          preserve_newlines,
          max_preserve_newlines,
          indent_handlebars,
          wrap_attributes,
          wrap_attributes_indent_size,
          is_wrap_attributes_force,
          is_wrap_attributes_force_expand_multiline,
          is_wrap_attributes_force_aligned,
          end_with_newline,
          extra_liners,
          eol;
      options = options || {};
      options = mergeOpts(options, 'html');
      if ((options.wrap_line_length === undefined || parseInt(options.wrap_line_length, 10) === 0) && (options.max_char !== undefined && parseInt(options.max_char, 10) !== 0)) {
        options.wrap_line_length = options.max_char;
      }
      indent_inner_html = (options.indent_inner_html === undefined) ? false : options.indent_inner_html;
      indent_body_inner_html = (options.indent_body_inner_html === undefined) ? true : options.indent_body_inner_html;
      indent_head_inner_html = (options.indent_head_inner_html === undefined) ? true : options.indent_head_inner_html;
      indent_size = (options.indent_size === undefined) ? 4 : parseInt(options.indent_size, 10);
      indent_character = (options.indent_char === undefined) ? ' ' : options.indent_char;
      brace_style = (options.brace_style === undefined) ? 'collapse' : options.brace_style;
      wrap_line_length = parseInt(options.wrap_line_length, 10) === 0 ? 32786 : parseInt(options.wrap_line_length || 250, 10);
      unformatted = options.unformatted || ['a', 'abbr', 'area', 'audio', 'b', 'bdi', 'bdo', 'br', 'button', 'canvas', 'cite', 'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'map', 'mark', 'math', 'meter', 'noscript', 'object', 'output', 'progress', 'q', 'ruby', 's', 'samp', 'select', 'small', 'span', 'strong', 'sub', 'sup', 'svg', 'template', 'textarea', 'time', 'u', 'var', 'video', 'wbr', 'text', 'acronym', 'address', 'big', 'dt', 'ins', 'strike', 'tt'];
      content_unformatted = options.content_unformatted || ['pre'];
      preserve_newlines = (options.preserve_newlines === undefined) ? true : options.preserve_newlines;
      max_preserve_newlines = preserve_newlines ? (isNaN(parseInt(options.max_preserve_newlines, 10)) ? 32786 : parseInt(options.max_preserve_newlines, 10)) : 0;
      indent_handlebars = (options.indent_handlebars === undefined) ? false : options.indent_handlebars;
      wrap_attributes = (options.wrap_attributes === undefined) ? 'auto' : options.wrap_attributes;
      wrap_attributes_indent_size = (isNaN(parseInt(options.wrap_attributes_indent_size, 10))) ? indent_size : parseInt(options.wrap_attributes_indent_size, 10);
      is_wrap_attributes_force = wrap_attributes.substr(0, 'force'.length) === 'force';
      is_wrap_attributes_force_expand_multiline = (wrap_attributes === 'force-expand-multiline');
      is_wrap_attributes_force_aligned = (wrap_attributes === 'force-aligned');
      end_with_newline = (options.end_with_newline === undefined) ? false : options.end_with_newline;
      extra_liners = (typeof options.extra_liners === 'object') && options.extra_liners ? options.extra_liners.concat() : (typeof options.extra_liners === 'string') ? options.extra_liners.split(',') : 'head,body,/html'.split(',');
      eol = options.eol ? options.eol : 'auto';
      if (options.indent_with_tabs) {
        indent_character = '\t';
        indent_size = 1;
      }
      if (eol === 'auto') {
        eol = '\n';
        if (html_source && lineBreak.test(html_source || '')) {
          eol = html_source.match(lineBreak)[0];
        }
      }
      eol = eol.replace(/\\r/, '\r').replace(/\\n/, '\n');
      html_source = html_source.replace(allLineBreaks, '\n');
      function Parser() {
        this.pos = 0;
        this.token = '';
        this.current_mode = 'CONTENT';
        this.tags = {
          parent: 'parent1',
          parentcount: 1,
          parent1: ''
        };
        this.tag_type = '';
        this.token_text = this.last_token = this.last_text = this.token_type = '';
        this.newlines = 0;
        this.indent_content = indent_inner_html;
        this.indent_body_inner_html = indent_body_inner_html;
        this.indent_head_inner_html = indent_head_inner_html;
        this.Utils = {
          whitespace: "\n\r\t ".split(''),
          single_token: options.void_elements || ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr', '!doctype', '?xml', '?php', 'basefont', 'isindex'],
          extra_liners: extra_liners,
          in_array: function(what, arr) {
            for (var i = 0; i < arr.length; i++) {
              if (what === arr[i]) {
                return true;
              }
            }
            return false;
          }
        };
        this.is_whitespace = function(text) {
          for (var n = 0; n < text.length; n++) {
            if (!this.Utils.in_array(text.charAt(n), this.Utils.whitespace)) {
              return false;
            }
          }
          return true;
        };
        this.traverse_whitespace = function() {
          var input_char = '';
          input_char = this.input.charAt(this.pos);
          if (this.Utils.in_array(input_char, this.Utils.whitespace)) {
            this.newlines = 0;
            while (this.Utils.in_array(input_char, this.Utils.whitespace)) {
              if (preserve_newlines && input_char === '\n' && this.newlines <= max_preserve_newlines) {
                this.newlines += 1;
              }
              this.pos++;
              input_char = this.input.charAt(this.pos);
            }
            return true;
          }
          return false;
        };
        this.space_or_wrap = function(content) {
          if (this.line_char_count >= this.wrap_line_length) {
            this.print_newline(false, content);
            this.print_indentation(content);
            return true;
          } else {
            this.line_char_count++;
            content.push(' ');
            return false;
          }
        };
        this.get_content = function() {
          var input_char = '',
              content = [],
              handlebarsStarted = 0;
          while (this.input.charAt(this.pos) !== '<' || handlebarsStarted === 2) {
            if (this.pos >= this.input.length) {
              return content.length ? content.join('') : ['', 'TK_EOF'];
            }
            if (handlebarsStarted < 2 && this.traverse_whitespace()) {
              this.space_or_wrap(content);
              continue;
            }
            input_char = this.input.charAt(this.pos);
            if (indent_handlebars) {
              if (input_char === '{') {
                handlebarsStarted += 1;
              } else if (handlebarsStarted < 2) {
                handlebarsStarted = 0;
              }
              if (input_char === '}' && handlebarsStarted > 0) {
                if (handlebarsStarted-- === 0) {
                  break;
                }
              }
              var peek3 = this.input.substr(this.pos, 3);
              if (peek3 === '{{#' || peek3 === '{{/') {
                break;
              } else if (peek3 === '{{!') {
                return [this.get_tag(), 'TK_TAG_HANDLEBARS_COMMENT'];
              } else if (this.input.substr(this.pos, 2) === '{{') {
                if (this.get_tag(true) === '{{else}}') {
                  break;
                }
              }
            }
            this.pos++;
            this.line_char_count++;
            content.push(input_char);
          }
          return content.length ? content.join('') : '';
        };
        this.get_contents_to = function(name) {
          if (this.pos === this.input.length) {
            return ['', 'TK_EOF'];
          }
          var content = '';
          var reg_match = new RegExp('</' + name + '\\s*>', 'igm');
          reg_match.lastIndex = this.pos;
          var reg_array = reg_match.exec(this.input);
          var end_script = reg_array ? reg_array.index : this.input.length;
          if (this.pos < end_script) {
            content = this.input.substring(this.pos, end_script);
            this.pos = end_script;
          }
          return content;
        };
        this.record_tag = function(tag) {
          if (this.tags[tag + 'count']) {
            this.tags[tag + 'count']++;
            this.tags[tag + this.tags[tag + 'count']] = this.indent_level;
          } else {
            this.tags[tag + 'count'] = 1;
            this.tags[tag + this.tags[tag + 'count']] = this.indent_level;
          }
          this.tags[tag + this.tags[tag + 'count'] + 'parent'] = this.tags.parent;
          this.tags.parent = tag + this.tags[tag + 'count'];
        };
        this.retrieve_tag = function(tag) {
          if (this.tags[tag + 'count']) {
            var temp_parent = this.tags.parent;
            while (temp_parent) {
              if (tag + this.tags[tag + 'count'] === temp_parent) {
                break;
              }
              temp_parent = this.tags[temp_parent + 'parent'];
            }
            if (temp_parent) {
              this.indent_level = this.tags[tag + this.tags[tag + 'count']];
              this.tags.parent = this.tags[temp_parent + 'parent'];
            }
            delete this.tags[tag + this.tags[tag + 'count'] + 'parent'];
            delete this.tags[tag + this.tags[tag + 'count']];
            if (this.tags[tag + 'count'] === 1) {
              delete this.tags[tag + 'count'];
            } else {
              this.tags[tag + 'count']--;
            }
          }
        };
        this.indent_to_tag = function(tag) {
          if (!this.tags[tag + 'count']) {
            return;
          }
          var temp_parent = this.tags.parent;
          while (temp_parent) {
            if (tag + this.tags[tag + 'count'] === temp_parent) {
              break;
            }
            temp_parent = this.tags[temp_parent + 'parent'];
          }
          if (temp_parent) {
            this.indent_level = this.tags[tag + this.tags[tag + 'count']];
          }
        };
        this.get_tag = function(peek) {
          var input_char = '',
              content = [],
              comment = '',
              space = false,
              first_attr = true,
              has_wrapped_attrs = false,
              tag_start,
              tag_end,
              tag_start_char,
              orig_pos = this.pos,
              orig_line_char_count = this.line_char_count,
              is_tag_closed = false,
              tail;
          peek = peek !== undefined ? peek : false;
          do {
            if (this.pos >= this.input.length) {
              if (peek) {
                this.pos = orig_pos;
                this.line_char_count = orig_line_char_count;
              }
              return content.length ? content.join('') : ['', 'TK_EOF'];
            }
            input_char = this.input.charAt(this.pos);
            this.pos++;
            if (this.Utils.in_array(input_char, this.Utils.whitespace)) {
              space = true;
              continue;
            }
            if (input_char === "'" || input_char === '"') {
              input_char += this.get_unformatted(input_char);
              space = true;
            }
            if (input_char === '=') {
              space = false;
            }
            tail = this.input.substr(this.pos - 1);
            if (is_wrap_attributes_force_expand_multiline && has_wrapped_attrs && !is_tag_closed && (input_char === '>' || input_char === '/')) {
              if (tail.match(/^\/?\s*>/)) {
                space = false;
                is_tag_closed = true;
                this.print_newline(false, content);
                this.print_indentation(content);
              }
            }
            if (content.length && content[content.length - 1] !== '=' && input_char !== '>' && space) {
              var wrapped = this.space_or_wrap(content);
              var indentAttrs = wrapped && input_char !== '/' && !is_wrap_attributes_force;
              space = false;
              if (is_wrap_attributes_force && input_char !== '/') {
                var force_first_attr_wrap = false;
                if (is_wrap_attributes_force_expand_multiline && first_attr) {
                  var is_only_attribute = tail.match(/^\S*(="([^"]|\\")*")?\s*\/?\s*>/) !== null;
                  force_first_attr_wrap = !is_only_attribute;
                }
                if (!first_attr || force_first_attr_wrap) {
                  this.print_newline(false, content);
                  this.print_indentation(content);
                  indentAttrs = true;
                }
              }
              if (indentAttrs) {
                has_wrapped_attrs = true;
                var alignment_size = wrap_attributes_indent_size;
                if (is_wrap_attributes_force_aligned) {
                  alignment_size = content.indexOf(' ') + 1;
                }
                for (var count = 0; count < alignment_size; count++) {
                  content.push(' ');
                }
              }
              if (first_attr) {
                for (var i = 0; i < content.length; i++) {
                  if (content[i] === ' ') {
                    first_attr = false;
                    break;
                  }
                }
              }
            }
            if (indent_handlebars && tag_start_char === '<') {
              if ((input_char + this.input.charAt(this.pos)) === '{{') {
                input_char += this.get_unformatted('}}');
                if (content.length && content[content.length - 1] !== ' ' && content[content.length - 1] !== '<') {
                  input_char = ' ' + input_char;
                }
                space = true;
              }
            }
            if (input_char === '<' && !tag_start_char) {
              tag_start = this.pos - 1;
              tag_start_char = '<';
            }
            if (indent_handlebars && !tag_start_char) {
              if (content.length >= 2 && content[content.length - 1] === '{' && content[content.length - 2] === '{') {
                if (input_char === '#' || input_char === '/' || input_char === '!') {
                  tag_start = this.pos - 3;
                } else {
                  tag_start = this.pos - 2;
                }
                tag_start_char = '{';
              }
            }
            this.line_char_count++;
            content.push(input_char);
            if (content[1] && (content[1] === '!' || content[1] === '?' || content[1] === '%')) {
              content = [this.get_comment(tag_start)];
              break;
            }
            if (indent_handlebars && content[1] && content[1] === '{' && content[2] && content[2] === '!') {
              content = [this.get_comment(tag_start)];
              break;
            }
            if (indent_handlebars && tag_start_char === '{' && content.length > 2 && content[content.length - 2] === '}' && content[content.length - 1] === '}') {
              break;
            }
          } while (input_char !== '>');
          var tag_complete = content.join('');
          var tag_index;
          var tag_offset;
          if (tag_complete.indexOf(' ') !== -1) {
            tag_index = tag_complete.indexOf(' ');
          } else if (tag_complete.indexOf('\n') !== -1) {
            tag_index = tag_complete.indexOf('\n');
          } else if (tag_complete.charAt(0) === '{') {
            tag_index = tag_complete.indexOf('}');
          } else {
            tag_index = tag_complete.indexOf('>');
          }
          if (tag_complete.charAt(0) === '<' || !indent_handlebars) {
            tag_offset = 1;
          } else {
            tag_offset = tag_complete.charAt(2) === '#' ? 3 : 2;
          }
          var tag_check = tag_complete.substring(tag_offset, tag_index).toLowerCase();
          if (tag_complete.charAt(tag_complete.length - 2) === '/' || this.Utils.in_array(tag_check, this.Utils.single_token)) {
            if (!peek) {
              this.tag_type = 'SINGLE';
            }
          } else if (indent_handlebars && tag_complete.charAt(0) === '{' && tag_check === 'else') {
            if (!peek) {
              this.indent_to_tag('if');
              this.tag_type = 'HANDLEBARS_ELSE';
              this.indent_content = true;
              this.traverse_whitespace();
            }
          } else if (this.is_unformatted(tag_check, unformatted) || this.is_unformatted(tag_check, content_unformatted)) {
            comment = this.get_unformatted('</' + tag_check + '>', tag_complete);
            content.push(comment);
            tag_end = this.pos - 1;
            this.tag_type = 'SINGLE';
          } else if (tag_check === 'script' && (tag_complete.search('type') === -1 || (tag_complete.search('type') > -1 && tag_complete.search(/\b(text|application|dojo)\/(x-)?(javascript|ecmascript|jscript|livescript|(ld\+)?json|method|aspect)/) > -1))) {
            if (!peek) {
              this.record_tag(tag_check);
              this.tag_type = 'SCRIPT';
            }
          } else if (tag_check === 'style' && (tag_complete.search('type') === -1 || (tag_complete.search('type') > -1 && tag_complete.search('text/css') > -1))) {
            if (!peek) {
              this.record_tag(tag_check);
              this.tag_type = 'STYLE';
            }
          } else if (tag_check.charAt(0) === '!') {
            if (!peek) {
              this.tag_type = 'SINGLE';
              this.traverse_whitespace();
            }
          } else if (!peek) {
            if (tag_check.charAt(0) === '/') {
              this.retrieve_tag(tag_check.substring(1));
              this.tag_type = 'END';
            } else {
              this.record_tag(tag_check);
              if (tag_check.toLowerCase() !== 'html') {
                this.indent_content = true;
              }
              this.tag_type = 'START';
            }
            if (this.traverse_whitespace()) {
              this.space_or_wrap(content);
            }
            if (this.Utils.in_array(tag_check, this.Utils.extra_liners)) {
              this.print_newline(false, this.output);
              if (this.output.length && this.output[this.output.length - 2] !== '\n') {
                this.print_newline(true, this.output);
              }
            }
          }
          if (peek) {
            this.pos = orig_pos;
            this.line_char_count = orig_line_char_count;
          }
          return content.join('');
        };
        this.get_comment = function(start_pos) {
          var comment = '',
              delimiter = '>',
              matched = false;
          this.pos = start_pos;
          var input_char = this.input.charAt(this.pos);
          this.pos++;
          while (this.pos <= this.input.length) {
            comment += input_char;
            if (comment.charAt(comment.length - 1) === delimiter.charAt(delimiter.length - 1) && comment.indexOf(delimiter) !== -1) {
              break;
            }
            if (!matched && comment.length < 10) {
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
            input_char = this.input.charAt(this.pos);
            this.pos++;
          }
          return comment;
        };
        function tokenMatcher(delimiter) {
          var token = '';
          var add = function(str) {
            var newToken = token + str.toLowerCase();
            token = newToken.length <= delimiter.length ? newToken : newToken.substr(newToken.length - delimiter.length, delimiter.length);
          };
          var doesNotMatch = function() {
            return token.indexOf(delimiter) === -1;
          };
          return {
            add: add,
            doesNotMatch: doesNotMatch
          };
        }
        this.get_unformatted = function(delimiter, orig_tag) {
          if (orig_tag && orig_tag.toLowerCase().indexOf(delimiter) !== -1) {
            return '';
          }
          var input_char = '';
          var content = '';
          var space = true;
          var delimiterMatcher = tokenMatcher(delimiter);
          do {
            if (this.pos >= this.input.length) {
              return content;
            }
            input_char = this.input.charAt(this.pos);
            this.pos++;
            if (this.Utils.in_array(input_char, this.Utils.whitespace)) {
              if (!space) {
                this.line_char_count--;
                continue;
              }
              if (input_char === '\n' || input_char === '\r') {
                content += '\n';
                this.line_char_count = 0;
                continue;
              }
            }
            content += input_char;
            delimiterMatcher.add(input_char);
            this.line_char_count++;
            space = true;
            if (indent_handlebars && input_char === '{' && content.length && content.charAt(content.length - 2) === '{') {
              content += this.get_unformatted('}}');
            }
          } while (delimiterMatcher.doesNotMatch());
          return content;
        };
        this.get_token = function() {
          var token;
          if (this.last_token === 'TK_TAG_SCRIPT' || this.last_token === 'TK_TAG_STYLE') {
            var type = this.last_token.substr(7);
            token = this.get_contents_to(type);
            if (typeof token !== 'string') {
              return token;
            }
            return [token, 'TK_' + type];
          }
          if (this.current_mode === 'CONTENT') {
            token = this.get_content();
            if (typeof token !== 'string') {
              return token;
            } else {
              return [token, 'TK_CONTENT'];
            }
          }
          if (this.current_mode === 'TAG') {
            token = this.get_tag();
            if (typeof token !== 'string') {
              return token;
            } else {
              var tag_name_type = 'TK_TAG_' + this.tag_type;
              return [token, tag_name_type];
            }
          }
        };
        this.get_full_indent = function(level) {
          level = this.indent_level + level || 0;
          if (level < 1) {
            return '';
          }
          return Array(level + 1).join(this.indent_string);
        };
        this.is_unformatted = function(tag_check, unformatted) {
          if (!this.Utils.in_array(tag_check, unformatted)) {
            return false;
          }
          if (tag_check.toLowerCase() !== 'a' || !this.Utils.in_array('a', unformatted)) {
            return true;
          }
          var next_tag = this.get_tag(true);
          var tag = (next_tag || "").match(/^\s*<\s*\/?([a-z]*)\s*[^>]*>\s*$/);
          if (!tag || this.Utils.in_array(tag[1], unformatted)) {
            return true;
          } else {
            return false;
          }
        };
        this.printer = function(js_source, indent_character, indent_size, wrap_line_length, brace_style) {
          this.input = js_source || '';
          this.input = this.input.replace(/\r\n|[\r\u2028\u2029]/g, '\n');
          this.output = [];
          this.indent_character = indent_character;
          this.indent_string = '';
          this.indent_size = indent_size;
          this.brace_style = brace_style;
          this.indent_level = 0;
          this.wrap_line_length = wrap_line_length;
          this.line_char_count = 0;
          for (var i = 0; i < this.indent_size; i++) {
            this.indent_string += this.indent_character;
          }
          this.print_newline = function(force, arr) {
            this.line_char_count = 0;
            if (!arr || !arr.length) {
              return;
            }
            if (force || (arr[arr.length - 1] !== '\n')) {
              if ((arr[arr.length - 1] !== '\n')) {
                arr[arr.length - 1] = rtrim(arr[arr.length - 1]);
              }
              arr.push('\n');
            }
          };
          this.print_indentation = function(arr) {
            for (var i = 0; i < this.indent_level; i++) {
              arr.push(this.indent_string);
              this.line_char_count += this.indent_string.length;
            }
          };
          this.print_token = function(text) {
            if (this.is_whitespace(text) && !this.output.length) {
              return;
            }
            if (text || text !== '') {
              if (this.output.length && this.output[this.output.length - 1] === '\n') {
                this.print_indentation(this.output);
                text = ltrim(text);
              }
            }
            this.print_token_raw(text);
          };
          this.print_token_raw = function(text) {
            if (this.newlines > 0) {
              text = rtrim(text);
            }
            if (text && text !== '') {
              if (text.length > 1 && text.charAt(text.length - 1) === '\n') {
                this.output.push(text.slice(0, -1));
                this.print_newline(false, this.output);
              } else {
                this.output.push(text);
              }
            }
            for (var n = 0; n < this.newlines; n++) {
              this.print_newline(n > 0, this.output);
            }
            this.newlines = 0;
          };
          this.indent = function() {
            this.indent_level++;
          };
          this.unindent = function() {
            if (this.indent_level > 0) {
              this.indent_level--;
            }
          };
        };
        return this;
      }
      this.beautify = function() {
        multi_parser = new Parser();
        multi_parser.printer(html_source, indent_character, indent_size, wrap_line_length, brace_style);
        while (true) {
          var t = multi_parser.get_token();
          multi_parser.token_text = t[0];
          multi_parser.token_type = t[1];
          if (multi_parser.token_type === 'TK_EOF') {
            break;
          }
          switch (multi_parser.token_type) {
            case 'TK_TAG_START':
              multi_parser.print_newline(false, multi_parser.output);
              multi_parser.print_token(multi_parser.token_text);
              if (multi_parser.indent_content) {
                if ((multi_parser.indent_body_inner_html || !multi_parser.token_text.match(/<body(?:.*)>/)) && (multi_parser.indent_head_inner_html || !multi_parser.token_text.match(/<head(?:.*)>/))) {
                  multi_parser.indent();
                }
                multi_parser.indent_content = false;
              }
              multi_parser.current_mode = 'CONTENT';
              break;
            case 'TK_TAG_STYLE':
            case 'TK_TAG_SCRIPT':
              multi_parser.print_newline(false, multi_parser.output);
              multi_parser.print_token(multi_parser.token_text);
              multi_parser.current_mode = 'CONTENT';
              break;
            case 'TK_TAG_END':
              if (multi_parser.last_token === 'TK_CONTENT' && multi_parser.last_text === '') {
                var tag_name = (multi_parser.token_text.match(/\w+/) || [])[0];
                var tag_extracted_from_last_output = null;
                if (multi_parser.output.length) {
                  tag_extracted_from_last_output = multi_parser.output[multi_parser.output.length - 1].match(/(?:<|{{#)\s*(\w+)/);
                }
                if (tag_extracted_from_last_output === null || (tag_extracted_from_last_output[1] !== tag_name && !multi_parser.Utils.in_array(tag_extracted_from_last_output[1], unformatted))) {
                  multi_parser.print_newline(false, multi_parser.output);
                }
              }
              multi_parser.print_token(multi_parser.token_text);
              multi_parser.current_mode = 'CONTENT';
              break;
            case 'TK_TAG_SINGLE':
              var tag_check = multi_parser.token_text.match(/^\s*<([a-z-]+)/i);
              if (!tag_check || !multi_parser.Utils.in_array(tag_check[1], unformatted)) {
                multi_parser.print_newline(false, multi_parser.output);
              }
              multi_parser.print_token(multi_parser.token_text);
              multi_parser.current_mode = 'CONTENT';
              break;
            case 'TK_TAG_HANDLEBARS_ELSE':
              var foundIfOnCurrentLine = false;
              for (var lastCheckedOutput = multi_parser.output.length - 1; lastCheckedOutput >= 0; lastCheckedOutput--) {
                if (multi_parser.output[lastCheckedOutput] === '\n') {
                  break;
                } else {
                  if (multi_parser.output[lastCheckedOutput].match(/{{#if/)) {
                    foundIfOnCurrentLine = true;
                    break;
                  }
                }
              }
              if (!foundIfOnCurrentLine) {
                multi_parser.print_newline(false, multi_parser.output);
              }
              multi_parser.print_token(multi_parser.token_text);
              if (multi_parser.indent_content) {
                multi_parser.indent();
                multi_parser.indent_content = false;
              }
              multi_parser.current_mode = 'CONTENT';
              break;
            case 'TK_TAG_HANDLEBARS_COMMENT':
              multi_parser.print_token(multi_parser.token_text);
              multi_parser.current_mode = 'TAG';
              break;
            case 'TK_CONTENT':
              multi_parser.print_token(multi_parser.token_text);
              multi_parser.current_mode = 'TAG';
              break;
            case 'TK_STYLE':
            case 'TK_SCRIPT':
              if (multi_parser.token_text !== '') {
                multi_parser.print_newline(false, multi_parser.output);
                var text = multi_parser.token_text,
                    _beautifier,
                    script_indent_level = 1;
                if (multi_parser.token_type === 'TK_SCRIPT') {
                  _beautifier = typeof js_beautify === 'function' && js_beautify;
                } else if (multi_parser.token_type === 'TK_STYLE') {
                  _beautifier = typeof css_beautify === 'function' && css_beautify;
                }
                if (options.indent_scripts === "keep") {
                  script_indent_level = 0;
                } else if (options.indent_scripts === "separate") {
                  script_indent_level = -multi_parser.indent_level;
                }
                var indentation = multi_parser.get_full_indent(script_indent_level);
                if (_beautifier) {
                  var Child_options = function() {
                    this.eol = '\n';
                  };
                  Child_options.prototype = options;
                  var child_options = new Child_options();
                  text = _beautifier(text.replace(/^\s*/, indentation), child_options);
                } else {
                  var white = text.match(/^\s*/)[0];
                  var _level = white.match(/[^\n\r]*$/)[0].split(multi_parser.indent_string).length - 1;
                  var reindent = multi_parser.get_full_indent(script_indent_level - _level);
                  text = text.replace(/^\s*/, indentation).replace(/\r\n|\r|\n/g, '\n' + reindent).replace(/\s+$/, '');
                }
                if (text) {
                  multi_parser.print_token_raw(text);
                  multi_parser.print_newline(true, multi_parser.output);
                }
              }
              multi_parser.current_mode = 'TAG';
              break;
            default:
              if (multi_parser.token_text !== '') {
                multi_parser.print_token(multi_parser.token_text);
              }
              break;
          }
          multi_parser.last_token = multi_parser.token_type;
          multi_parser.last_text = multi_parser.token_text;
        }
        var sweet_code = multi_parser.output.join('').replace(/[\r\n\t ]+$/, '');
        if (end_with_newline) {
          sweet_code += '\n';
        }
        if (eol !== '\n') {
          sweet_code = sweet_code.replace(/[\n]/g, eol);
        }
        return sweet_code;
      };
    }
    module.exports.Beautifier = Beautifier;
  }), (function(module, exports) {
    var nonASCIIwhitespace = /[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/;
    var nonASCIIidentifierStartChars = "\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0\u08a2-\u08ac\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua697\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa80-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc";
    var nonASCIIidentifierChars = "\u0300-\u036f\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u0620-\u0649\u0672-\u06d3\u06e7-\u06e8\u06fb-\u06fc\u0730-\u074a\u0800-\u0814\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0840-\u0857\u08e4-\u08fe\u0900-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962-\u0963\u0966-\u096f\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09d7\u09df-\u09e0\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a66-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2-\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b5f-\u0b60\u0b66-\u0b6f\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0be6-\u0bef\u0c01-\u0c03\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62-\u0c63\u0c66-\u0c6f\u0c82\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2-\u0ce3\u0ce6-\u0cef\u0d02\u0d03\u0d46-\u0d48\u0d57\u0d62-\u0d63\u0d66-\u0d6f\u0d82\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e34-\u0e3a\u0e40-\u0e45\u0e50-\u0e59\u0eb4-\u0eb9\u0ec8-\u0ecd\u0ed0-\u0ed9\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f41-\u0f47\u0f71-\u0f84\u0f86-\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u1029\u1040-\u1049\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f-\u109d\u135d-\u135f\u170e-\u1710\u1720-\u1730\u1740-\u1750\u1772\u1773\u1780-\u17b2\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u1920-\u192b\u1930-\u193b\u1951-\u196d\u19b0-\u19c0\u19c8-\u19c9\u19d0-\u19d9\u1a00-\u1a15\u1a20-\u1a53\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1b46-\u1b4b\u1b50-\u1b59\u1b6b-\u1b73\u1bb0-\u1bb9\u1be6-\u1bf3\u1c00-\u1c22\u1c40-\u1c49\u1c5b-\u1c7d\u1cd0-\u1cd2\u1d00-\u1dbe\u1e01-\u1f15\u200c\u200d\u203f\u2040\u2054\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2d81-\u2d96\u2de0-\u2dff\u3021-\u3028\u3099\u309a\ua640-\ua66d\ua674-\ua67d\ua69f\ua6f0-\ua6f1\ua7f8-\ua800\ua806\ua80b\ua823-\ua827\ua880-\ua881\ua8b4-\ua8c4\ua8d0-\ua8d9\ua8f3-\ua8f7\ua900-\ua909\ua926-\ua92d\ua930-\ua945\ua980-\ua983\ua9b3-\ua9c0\uaa00-\uaa27\uaa40-\uaa41\uaa4c-\uaa4d\uaa50-\uaa59\uaa7b\uaae0-\uaae9\uaaf2-\uaaf3\uabc0-\uabe1\uabec\uabed\uabf0-\uabf9\ufb20-\ufb28\ufe00-\ufe0f\ufe20-\ufe26\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff3f";
    var nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
    var nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");
    exports.newline = /[\n\r\u2028\u2029]/;
    exports.lineBreak = new RegExp('\r\n|' + exports.newline.source);
    exports.allLineBreaks = new RegExp(exports.lineBreak.source, 'g');
    exports.isIdentifierStart = function(code) {
      if (code < 65)
        return code === 36 || code === 64;
      if (code < 91)
        return true;
      if (code < 97)
        return code === 95;
      if (code < 123)
        return true;
      return code >= 0xaa && nonASCIIidentifierStart.test(String.fromCharCode(code));
    };
    exports.isIdentifierChar = function(code) {
      if (code < 48)
        return code === 36;
      if (code < 58)
        return true;
      if (code < 65)
        return false;
      if (code < 91)
        return true;
      if (code < 97)
        return code === 95;
      if (code < 123)
        return true;
      return code >= 0xaa && nonASCIIidentifier.test(String.fromCharCode(code));
    };
  }), (function(module, exports) {
    function mergeOpts(allOptions, targetType) {
      var finalOpts = {};
      var name;
      for (name in allOptions) {
        if (name !== targetType) {
          finalOpts[name] = allOptions[name];
        }
      }
      if (targetType in allOptions) {
        for (name in allOptions[targetType]) {
          finalOpts[name] = allOptions[targetType][name];
        }
      }
      return finalOpts;
    }
    module.exports.mergeOpts = mergeOpts;
  }), (function(module, exports, __webpack_require__) {
    var Beautifier = __webpack_require__(0).Beautifier;
    function style_html(html_source, options, js_beautify, css_beautify) {
      var beautifier = new Beautifier(html_source, options, js_beautify, css_beautify);
      return beautifier.beautify();
    }
    module.exports = style_html;
  })]);
  var style_html = legacy_beautify_html;
  if (typeof define === "function" && define.amd) {
    define(["require", "./beautify", "./beautify-css"], function(requireamd) {
      var js_beautify = requireamd("./beautify");
      var css_beautify = requireamd("./beautify-css");
      return {html_beautify: function(html_source, options) {
          return style_html(html_source, options, js_beautify.js_beautify, css_beautify.css_beautify);
        }};
    });
  } else if (typeof exports !== "undefined") {
    var js_beautify = require('./beautify');
    var css_beautify = require('./beautify-css');
    exports.html_beautify = function(html_source, options) {
      return style_html(html_source, options, js_beautify.js_beautify, css_beautify.css_beautify);
    };
  } else if (typeof window !== "undefined") {
    window.html_beautify = function(html_source, options) {
      return style_html(html_source, options, window.js_beautify, window.css_beautify);
    };
  } else if (typeof global !== "undefined") {
    global.html_beautify = function(html_source, options) {
      return style_html(html_source, options, global.js_beautify, global.css_beautify);
    };
  }
}());
