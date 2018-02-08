/*jshint curly:true, eqeqeq:true, laxbreak:true, noempty:false */
/*

  The MIT License (MIT)

  Copyright (c) 2007-2017 Einar Lielmanis, Liam Newman, and contributors.

  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation files
  (the "Software"), to deal in the Software without restriction,
  including without limitation the rights to use, copy, modify, merge,
  publish, distribute, sublicense, and/or sell copies of the Software,
  and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
  BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
  ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

// var mergeOpts = require('core/options').mergeOpts;
import { mergeOpts } from '../core/options'
import { defaultBooleanIfNotDefined } from '../core/options'
// var acorn = require('core/acorn');


// var lineBreak = acorn.lineBreak;
// var allLineBreaks = acorn.allLineBreaks;
import { lineBreak, allLineBreaks } from '../core/acorn';

// function trim(s) {
//     return s.replace(/^\s+|\s+$/g, '');
// }

function ltrim(s: string): string {
    return s.replace(/^\s+/g, '');
}

function rtrim(s: string): string {
    return s.replace(/\s+$/g, '');
}

function tokenMatcher(delimiter: string) {
    var token = '';

    var add = function (str: string) {
        var newToken = token + str.toLowerCase();
        token = newToken.length <= delimiter.length ? newToken : newToken.substr(newToken.length - delimiter.length, delimiter.length);
    };

    var doesNotMatch = function () {
        return token.indexOf(delimiter) === -1;
    };

    return {
        add: add,
        doesNotMatch: doesNotMatch
    };
}

type TokenType = 'TK_EOF' | 'TK_TAG_START' | 'TK_TAG_END' | 'TK_CONTENT' | 'TK_STYLE' | 'TK_SCRIPT' | 'TK_TAG_SINGLE' | 'TK_TAG_SCRIPT' | 'TK_TAG_STYLE' | 'TK_TAG_HANDLEBARS_ELSE' | 'TK_TAG_HANDLEBARS_COMMENT';

interface ParserArgs {
    indent_inner_html: boolean;
    indent_head_inner_html: boolean;
    indent_body_inner_html: boolean;
    unformatted: string[];
    content_unformatted: string[];
    extra_liners: string[];
    indent_handlebars: boolean;
    preserve_newlines: boolean;
    max_preserve_newlines: number;
    is_wrap_attributes_force: boolean;
    is_wrap_attributes_force_aligned: boolean;
    is_wrap_attributes_force_expand_multiline: boolean;
    wrap_attributes_indent_size: number;
}

class Parser {
    pos: number;
    input: string;
    token: string;
    current_mode: 'CONTENT' | 'TAG';
    tags: {
        parent: string;
        parentcount: number;
        parent1: string;
    };
    tag_type: 'SINGLE' | 'HANDLEBARS_ELSE' | 'SCRIPT' | 'STYLE' | 'END' | 'START' | '';
    token_text: string;
    last_token: string;
    last_text: string;
    token_type: TokenType;
    newlines: number;
    brace_style: BraceStyle;
    indent_content: boolean;
    indent_level: number;
    indent_character: string;
    indent_size: number;
    indent_string: string;
    indent_body_inner_html: boolean;
    indent_head_inner_html: boolean;
    line_char_count: number;
    wrap_line_length: number;
    output: string[];
    Utils: {
        in_array(what: string, whitespace: string[]): boolean;
        single_token: string[];
        whitespace: string[];
        extra_liners: string[];
    }
    constructor(private args: ParserArgs) {

        this.pos = 0; //Parser position
        this.token = '';
        this.current_mode = 'CONTENT'; //reflects the current Parser mode: TAG/CONTENT
        this.tags = { //An object to hold tags, their position, and their parent-tags, initiated with default values
            parent: 'parent1',
            parentcount: 1,
            parent1: ''
        };
        this.tag_type = '';
        this.token_text = this.last_token = this.last_text = '';
        // How best to initialize this property?
        // this.token_type = '';
        this.newlines = 0;
        this.indent_content = args.indent_inner_html;
        this.indent_body_inner_html = args.indent_body_inner_html;
        this.indent_head_inner_html = args.indent_head_inner_html;

        this.Utils = { //Uilities made available to the various functions
            whitespace: "\n\r\t ".split(''),

            single_token: [
                // HTLM void elements - aka self-closing tags - aka singletons
                // https://www.w3.org/html/wg/drafts/html/master/syntax.html#void-elements
                'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen',
                'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr',
                // NOTE: Optional tags - are not understood.
                // https://www.w3.org/TR/html5/syntax.html#optional-tags
                // The rules for optional tags are too complex for a simple list
                // Also, the content of these tags should still be indented in many cases.
                // 'li' is a good exmple.

                // Doctype and xml elements
                '!doctype', '?xml',
                // ?php tag
                '?php',
                // other tags that were in this list, keeping just in case
                'basefont', 'isindex'
            ],
            extra_liners: args.extra_liners, //for tags that need a line of whitespace before them
            in_array(what: string, arr: string[]): boolean {
                for (var i = 0; i < arr.length; i++) {
                    if (what === arr[i]) {
                        return true;
                    }
                }
                return false;
            }
        }
    }

    // Return true if the given text is composed entirely of whitespace.
    is_whitespace(text: string): boolean {
        for (var n = 0; n < text.length; n++) {
            if (!this.Utils.in_array(text.charAt(n), this.Utils.whitespace)) {
                return false;
            }
        }
        return true;
    }

    traverse_whitespace() {
        var input_char = '';

        input_char = this.input.charAt(this.pos);
        if (this.Utils.in_array(input_char, this.Utils.whitespace)) {
            this.newlines = 0;
            while (this.Utils.in_array(input_char, this.Utils.whitespace)) {
                if (this.args.preserve_newlines && input_char === '\n' && this.newlines <= this.args.max_preserve_newlines) {
                    this.newlines += 1;
                }

                this.pos++;
                input_char = this.input.charAt(this.pos);
            }
            return true;
        }
        return false;
    }

    // Append a space to the given content (string array) or, if we are
    // at the wrap_line_length, append a newline/indentation.
    // return true if a newline was added, false if a space was added
    space_or_wrap(content: string[]) {
        if (this.line_char_count >= this.wrap_line_length) { //insert a line when the wrap_line_length is reached
            this.print_newline(false, content);
            this.print_indentation(content);
            return true;
        } else {
            this.line_char_count++;
            content.push(' ');
            return false;
        }
    }

    get_content(): string | [string, TokenType] { //function to capture regular content between tags
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

            if (this.args.indent_handlebars) {
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
                // Handlebars parsing is complicated.
                // {{#foo}} and {{/foo}} are formatted tags.
                // {{something}} should get treated as content, except:
                // {{else}} specifically behaves like {{#if}} and {{/if}}
                var peek3 = this.input.substr(this.pos, 3);
                if (peek3 === '{{#' || peek3 === '{{/') {
                    // These are tags and not content.
                    break;
                } else if (peek3 === '{{!') {
                    return [this.get_tag() as string, 'TK_TAG_HANDLEBARS_COMMENT'];
                } else if (this.input.substr(this.pos, 2) === '{{') {
                    if (this.get_tag(true) === '{{else}}') {
                        break;
                    }
                }
            }

            this.pos++;
            this.line_char_count++;
            content.push(input_char); //letter at-a-time (or string) inserted to an array
        }
        return content.length ? content.join('') : '';
    }

    get_contents_to(name: string): string | [string, TokenType] { //get the full content of a script or style to pass to js_beautify
        if (this.pos === this.input.length) {
            return ['', 'TK_EOF'];
        }
        var content = '';
        var reg_match = new RegExp('</' + name + '\\s*>', 'igm');
        reg_match.lastIndex = this.pos;
        var reg_array = reg_match.exec(this.input);
        var end_script = reg_array ? reg_array.index : this.input.length; //absolute end of script
        if (this.pos < end_script) { //get everything in between the script tags
            content = this.input.substring(this.pos, end_script);
            this.pos = end_script;
        }
        return content;
    }

    record_tag(tag: string): void { //function to record a tag and its parent in this.tags Object
        if (this.tags[tag + 'count']) { //check for the existence of this tag type
            this.tags[tag + 'count']++;
            this.tags[tag + this.tags[tag + 'count']] = this.indent_level; //and record the present indent level
        } else { //otherwise initialize this tag type
            this.tags[tag + 'count'] = 1;
            this.tags[tag + this.tags[tag + 'count']] = this.indent_level; //and record the present indent level
        }
        this.tags[tag + this.tags[tag + 'count'] + 'parent'] = this.tags.parent; //set the parent (i.e. in the case of a div this.tags.div1parent)
        this.tags.parent = tag + this.tags[tag + 'count']; //and make this the current parent (i.e. in the case of a div 'div1')
    }

    retrieve_tag(tag: string) { //function to retrieve the opening tag to the corresponding closer
        if (this.tags[tag + 'count']) { //if the openener is not in the Object we ignore it
            var temp_parent = this.tags.parent; //check to see if it's a closable tag.
            while (temp_parent) { //till we reach '' (the initial value);
                if (tag + this.tags[tag + 'count'] === temp_parent) { //if this is it use it
                    break;
                }
                temp_parent = this.tags[temp_parent + 'parent']; //otherwise keep on climbing up the DOM Tree
            }
            if (temp_parent) { //if we caught something
                this.indent_level = this.tags[tag + this.tags[tag + 'count']]; //set the indent_level accordingly
                this.tags.parent = this.tags[temp_parent + 'parent']; //and set the current parent
            }
            delete this.tags[tag + this.tags[tag + 'count'] + 'parent']; //delete the closed tags parent reference...
            delete this.tags[tag + this.tags[tag + 'count']]; //...and the tag itself
            if (this.tags[tag + 'count'] === 1) {
                delete this.tags[tag + 'count'];
            } else {
                this.tags[tag + 'count']--;
            }
        }
    }

    indent_to_tag(tag: string) {
        // Match the indentation level to the last use of this tag, but don't remove it.
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
    }

    get_tag(peek?: boolean): string | [string, TokenType] { //function to get a full tag and parse its type
        var input_char = '',
            content = [],
            comment = '',
            space = false,
            first_attr = true,
            has_wrapped_attrs = false,
            tag_start,
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

            if (this.Utils.in_array(input_char, this.Utils.whitespace)) { //don't want to insert unnecessary space
                space = true;
                continue;
            }

            if (input_char === "'" || input_char === '"') {
                input_char += this.get_unformatted(input_char);
                space = true;
            }

            if (input_char === '=') { //no space before =
                space = false;
            }
            tail = this.input.substr(this.pos - 1);
            if (this.args.is_wrap_attributes_force_expand_multiline && has_wrapped_attrs && !is_tag_closed && (input_char === '>' || input_char === '/')) {
                if (tail.match(/^\/?\s*>/)) {
                    space = false;
                    is_tag_closed = true;
                    this.print_newline(false, content);
                    this.print_indentation(content);
                }
            }
            if (content.length && content[content.length - 1] !== '=' && input_char !== '>' && space) {
                //no space after = or before >
                var wrapped = this.space_or_wrap(content);
                var indentAttrs = wrapped && input_char !== '/' && !this.args.is_wrap_attributes_force;
                space = false;

                if (this.args.is_wrap_attributes_force && input_char !== '/') {
                    var force_first_attr_wrap = false;
                    if (this.args.is_wrap_attributes_force_expand_multiline && first_attr) {
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

                    //indent attributes an auto, forced, or forced-align line-wrap
                    var alignment_size = this.args.wrap_attributes_indent_size;
                    if (this.args.is_wrap_attributes_force_aligned) {
                        alignment_size = content.indexOf(' ') + 1;
                    }

                    for (var count = 0; count < alignment_size; count++) {
                        // only ever further indent with spaces since we're trying to align characters
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

            if (this.args.indent_handlebars && tag_start_char === '<') {
                // When inside an angle-bracket tag, put spaces around
                // handlebars not inside of strings.
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

            if (this.args.indent_handlebars && !tag_start_char) {
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
            content.push(input_char); //inserts character at-a-time (or string)

            if (content[1] && (content[1] === '!' || content[1] === '?' || content[1] === '%')) { //if we're in a comment, do something special
                // We treat all comments as literals, even more than preformatted tags
                // we just look for the appropriate close tag
                content = [this.get_comment(tag_start)];
                break;
            }

            if (this.args.indent_handlebars && content[1] && content[1] === '{' && content[2] && content[2] === '!') { //if we're in a comment, do something special
                // We treat all comments as literals, even more than preformatted tags
                // we just look for the appropriate close tag
                content = [this.get_comment(tag_start)];
                break;
            }

            if (this.args.indent_handlebars && tag_start_char === '{' && content.length > 2 && content[content.length - 2] === '}' && content[content.length - 1] === '}') {
                break;
            }
        } while (input_char !== '>');

        var tag_complete = content.join('');
        var tag_index;
        var tag_offset;

        // must check for space first otherwise the tag could have the first attribute included, and
        // then not un-indent correctly
        if (tag_complete.indexOf(' ') !== -1) { //if there's whitespace, thats where the tag name ends
            tag_index = tag_complete.indexOf(' ');
        } else if (tag_complete.indexOf('\n') !== -1) { //if there's a line break, thats where the tag name ends
            tag_index = tag_complete.indexOf('\n');
        } else if (tag_complete.charAt(0) === '{') {
            tag_index = tag_complete.indexOf('}');
        } else { //otherwise go with the tag ending
            tag_index = tag_complete.indexOf('>');
        }
        if (tag_complete.charAt(0) === '<' || !this.args.indent_handlebars) {
            tag_offset = 1;
        } else {
            tag_offset = tag_complete.charAt(2) === '#' ? 3 : 2;
        }
        var tag_check = tag_complete.substring(tag_offset, tag_index).toLowerCase();
        if (tag_complete.charAt(tag_complete.length - 2) === '/' ||
            this.Utils.in_array(tag_check, this.Utils.single_token)) { //if this tag name is a single tag type (either in the list or has a closing /)
            if (!peek) {
                this.tag_type = 'SINGLE';
            }
        } else if (this.args.indent_handlebars && tag_complete.charAt(0) === '{' && tag_check === 'else') {
            if (!peek) {
                this.indent_to_tag('if');
                this.tag_type = 'HANDLEBARS_ELSE';
                this.indent_content = true;
                this.traverse_whitespace();
            }
        } else if (this.is_unformatted(tag_check, this.args.unformatted) ||
            this.is_unformatted(tag_check, this.args.content_unformatted)) {
            // do not reformat the "unformatted" or "content_unformatted" tags
            comment = this.get_unformatted('</' + tag_check + '>', tag_complete); //...delegate to get_unformatted function
            content.push(comment);
            // tag_end = this.pos - 1;
            this.tag_type = 'SINGLE';
        } else if (tag_check === 'script' &&
            (tag_complete.search('type') === -1 ||
                (tag_complete.search('type') > -1 &&
                    tag_complete.search(/\b(text|application|dojo)\/(x-)?(javascript|ecmascript|jscript|livescript|(ld\+)?json|method|aspect)/) > -1))) {
            if (!peek) {
                this.record_tag(tag_check);
                this.tag_type = 'SCRIPT';
            }
        } else if (tag_check === 'style' &&
            (tag_complete.search('type') === -1 ||
                (tag_complete.search('type') > -1 && tag_complete.search('text/css') > -1))) {
            if (!peek) {
                this.record_tag(tag_check);
                this.tag_type = 'STYLE';
            }
        } else if (tag_check.charAt(0) === '!') { //peek for <! comment
            // for comments content is already correct.
            if (!peek) {
                this.tag_type = 'SINGLE';
                this.traverse_whitespace();
            }
        } else if (!peek) {
            if (tag_check.charAt(0) === '/') { //this tag is a double tag so check for tag-ending
                this.retrieve_tag(tag_check.substring(1)); //remove it and all ancestors
                this.tag_type = 'END';
            } else { //otherwise it's a start-tag
                this.record_tag(tag_check); //push it on the tag stack
                if (tag_check.toLowerCase() !== 'html') {
                    this.indent_content = true;
                }
                this.tag_type = 'START';
            }

            // Allow preserving of newlines after a start or end tag
            if (this.traverse_whitespace()) {
                this.space_or_wrap(content);
            }

            if (this.Utils.in_array(tag_check, this.Utils.extra_liners)) { //check if this double needs an extra line
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

        return content.join(''); //returns fully formatted tag
    }

    get_comment(start_pos: number) { //function to return comment content in its entirety
        // this is will have very poor perf, but will work for now.
        var comment = '',
            delimiter = '>',
            matched = false;

        this.pos = start_pos;
        var input_char = this.input.charAt(this.pos);
        this.pos++;

        while (this.pos <= this.input.length) {
            comment += input_char;

            // only need to check for the delimiter if the last chars match
            if (comment.charAt(comment.length - 1) === delimiter.charAt(delimiter.length - 1) &&
                comment.indexOf(delimiter) !== -1) {
                break;
            }

            // only need to search for custom delimiter for the first few characters
            if (!matched && comment.length < 10) {
                if (comment.indexOf('<![if') === 0) { //peek for <![if conditional comment
                    delimiter = '<![endif]>';
                    matched = true;
                } else if (comment.indexOf('<![cdata[') === 0) { //if it's a <[cdata[ comment...
                    delimiter = ']]>';
                    matched = true;
                } else if (comment.indexOf('<![') === 0) { // some other ![ comment? ...
                    delimiter = ']>';
                    matched = true;
                } else if (comment.indexOf('<!--') === 0) { // <!-- comment ...
                    delimiter = '-->';
                    matched = true;
                } else if (comment.indexOf('{{!--') === 0) { // {{!-- handlebars comment
                    delimiter = '--}}';
                    matched = true;
                } else if (comment.indexOf('{{!') === 0) { // {{! handlebars comment
                    if (comment.length === 5 && comment.indexOf('{{!--') === -1) {
                        delimiter = '}}';
                        matched = true;
                    }
                } else if (comment.indexOf('<?') === 0) { // {{! handlebars comment
                    delimiter = '?>';
                    matched = true;
                } else if (comment.indexOf('<%') === 0) { // {{! handlebars comment
                    delimiter = '%>';
                    matched = true;
                }
            }

            input_char = this.input.charAt(this.pos);
            this.pos++;
        }

        return comment;
    }

    get_unformatted(delimiter: string, orig_tag?: string): string { //function to return unformatted content in its entirety
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
                    /*  Don't change tab indention for unformatted blocks.  If using code for html editing, this will greatly affect <pre> tags if they are specified in the 'unformatted array'
        for (var i=0; i<this.indent_level; i++) {
          content += this.indent_string;
        }
        space = false; //...and make sure other indentation is erased
        */
                    this.line_char_count = 0;
                    continue;
                }
            }
            content += input_char;
            delimiterMatcher.add(input_char);
            this.line_char_count++;
            space = true;

            if (this.args.indent_handlebars && input_char === '{' && content.length && content.charAt(content.length - 2) === '{') {
                // Handlebars expressions in strings should also be unformatted.
                content += this.get_unformatted('}}');
                // Don't consider when stopping for delimiters.
            }
        } while (delimiterMatcher.doesNotMatch());

        return content;
    }

    get_token(): [string, TokenType] { //initial handler for token-retrieval
        var token: string | [string, TokenType];

        if (this.last_token === 'TK_TAG_SCRIPT' || this.last_token === 'TK_TAG_STYLE') { //check if we need to format javascript
            var type = this.last_token.substr(7);
            token = this.get_contents_to(type);
            if (typeof token !== 'string') {
                return token;
            }
            return [token, ('TK_' + type) as TokenType];
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
                var tag_name_type: TokenType = ('TK_TAG_' + this.tag_type) as TokenType;
                return [token, tag_name_type];
            }
        }

        throw new Error(`Unexpected current mode ${this.current_mode}`);
    }

    get_full_indent(level: number): string {
        level = this.indent_level + level || 0;
        if (level < 1) {
            return '';
        }

        return Array(level + 1).join(this.indent_string);
    }

    is_unformatted(tag_check: string, unformatted: string[]): boolean {
        //is this an HTML5 block-level link?
        if (!this.Utils.in_array(tag_check, unformatted)) {
            return false;
        }

        if (tag_check.toLowerCase() !== 'a' || !this.Utils.in_array('a', unformatted)) {
            return true;
        }

        //at this point we have an  tag; is its first child something we want to remain
        //unformatted?
        var next_tag = this.get_tag(true /* peek. */);

        next_tag = next_tag || '';
        if (typeof next_tag !== 'string') {
            next_tag = next_tag[0];
        }

        // test next_tag to see if it is just html tag (no external content)
        var tag = (next_tag || "").match(/^\s*<\s*\/?([a-z]*)\s*[^>]*>\s*$/);

        // if next_tag comes back but is not an isolated tag, then
        // let's treat the 'a' tag as having content
        // and respect the unformatted option
        if (!tag || this.Utils.in_array(tag[1], unformatted)) {
            return true;
        } else {
            return false;
        }
    }

    printer(js_source: string, indent_character: string, indent_size: number, wrap_line_length: number, brace_style: BraceStyle) { //handles input/output and some other printing functions

        this.input = js_source || ''; //gets the input for the Parser

        // HACK: newline parsing inconsistent. This brute force normalizes the input.
        this.input = this.input.replace(/\r\n|[\r\u2028\u2029]/g, '\n');

        this.output = [];
        this.indent_character = indent_character;
        this.indent_string = '';
        this.indent_size = indent_size;
        this.brace_style = brace_style;
        this.indent_level = 0;
        this.wrap_line_length = wrap_line_length;
        this.line_char_count = 0; //count to see if wrap_line_length was exceeded

        for (var i = 0; i < this.indent_size; i++) {
            this.indent_string += this.indent_character;
        }

    }

    print_newline(force: boolean, arr: string[]): void {
        this.line_char_count = 0;
        if (!arr || !arr.length) {
            return;
        }
        if (force || (arr[arr.length - 1] !== '\n')) { //we might want the extra line
            if ((arr[arr.length - 1] !== '\n')) {
                arr[arr.length - 1] = rtrim(arr[arr.length - 1]);
            }
            arr.push('\n');
        }
    }

    print_indentation(arr: string[]): void {
        for (var i = 0; i < this.indent_level; i++) {
            arr.push(this.indent_string);
            this.line_char_count += this.indent_string.length;
        }
    }

    print_token(text: string): void {
        // Avoid printing initial whitespace.
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
    }

    print_token_raw(text: string): void {
        // If we are going to print newlines, truncate trailing
        // whitespace, as the newlines will represent the space.
        if (this.newlines > 0) {
            text = rtrim(text);
        }

        if (text && text !== '') {
            if (text.length > 1 && text.charAt(text.length - 1) === '\n') {
                // unformatted tags can grab newlines as their last character
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
    }

    indent(): void {
        this.indent_level++;
    }

    unindent(): void {
        if (this.indent_level > 0) {
            this.indent_level--;
        }
    }
}

type BraceStyle = 'collapse-preserve-inline' | 'collapse' | 'expand' | 'end-expand' | 'none';
type IndentScripts = 'keep' | 'separate' | 'normal'

type WrapAttributes = 'auto' | 'force' | 'force-aligned' | 'force-expand-multiline';

export interface HTMLOptions {
    indent_size?: number;
    indent_char?: string;
    indent_with_tabs?: boolean;
    eol?: string;
    end_with_newline?: boolean;
    preserve_newlines?: boolean;
    max_preserve_newlines?: number;
    indent_inner_html?: boolean;
    brace_style?: BraceStyle;
    indent_scripts?: IndentScripts;
    wrap_line_length?: number;
    wrap_attributes?: WrapAttributes;
    wrap_attributes_indent_size?: string;
    content_unformatted?: string[];
    indent_body_inner_html?: boolean;
    indent_handlebars?: boolean;
    indent_head_inner_html?: boolean;
    max_char?: number;
    extra_liners?: string | string[];
    /**
     * Determines whether SVG should be formatted. Default is false.
     */
    format_svg?: boolean | undefined;
}

export class Beautifier {
    private brace_style: BraceStyle;
    private html_source: string;
    private indent_size: number;
    private indent_character: string;
    private indent_inner_html: boolean;
    private indent_head_inner_html: boolean;
    private indent_body_inner_html: boolean;
    private indent_handlebars: boolean;
    private indent_scripts: IndentScripts;
    private wrap_line_length: number;
    private end_with_newline: boolean;
    private preserve_newlines: boolean;
    private max_preserve_newlines: number;
    private eol: string;
    private unformatted: string[];
    private content_unformatted: string[];
    private extra_liners: string[];
    private is_wrap_attributes_force: boolean;
    private is_wrap_attributes_force_expand_multiline: boolean;
    private is_wrap_attributes_force_aligned: boolean;
    private wrap_attributes_indent_size: number;
    constructor(code: string, options: HTMLOptions, private js_beautify?: {}, private css_beautify?: {}) {
        //Wrapper function to invoke all the necessary constructors and deal with the output.
        this.html_source = code || '';

        options = options || {};

        // Allow the setting of language/file-type specific options
        // with inheritance of overall settings
        options = mergeOpts(options, 'html');

        // backwards compatibility to 1.3.4
        if ((options.wrap_line_length === undefined || parseInt(options.wrap_line_length as any, 10) === 0) &&
            (options.max_char !== undefined && parseInt(options.max_char as any, 10) !== 0)) {
            options.wrap_line_length = options.max_char;
        }

        this.indent_inner_html = (options.indent_inner_html === undefined) ? false : options.indent_inner_html;
        this.indent_body_inner_html = (options.indent_body_inner_html === undefined) ? true : options.indent_body_inner_html;
        this.indent_head_inner_html = (options.indent_head_inner_html === undefined) ? true : options.indent_head_inner_html;
        this.indent_size = (options.indent_size === undefined) ? 4 : parseInt(options.indent_size as any, 10);
        this.indent_character = (options.indent_char === undefined) ? ' ' : options.indent_char;
        this.brace_style = (options.brace_style === undefined) ? 'collapse' : options.brace_style;
        this.wrap_line_length = parseInt(options.wrap_line_length as any, 10) === 0 ? 32786 : parseInt(options.wrap_line_length as any || 250, 10);
        this.unformatted = [
            // What follows is not exactly Phrasing content, but rather the tags we don't want to be formatted.
            // Notably, the svg element has been omitted and is controlled by its own option. 
            // https://www.w3.org/TR/html5/dom.html#phrasing-content
            'a', 'abbr', 'area', 'audio', 'b', 'bdi', 'bdo', 'br', 'button', 'canvas', 'cite',
            'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'i', 'iframe', 'img',
            'input', 'ins', 'kbd', 'keygen', 'label', 'map', 'mark', 'math', 'meter', 'noscript',
            'object', 'output', 'progress', 'q', 'ruby', 's', 'samp', /* 'script', */ 'select', 'small',
            'span', 'strong', 'sub', 'sup', 'template', 'textarea', 'time', 'u', 'var',
            'video', 'wbr', 'text',
            // prexisting - not sure of full effect of removing, leaving in
            'acronym', 'address', 'big', 'dt', 'ins', 'strike', 'tt',
        ];
        if (defaultBooleanIfNotDefined(true, options.format_svg)) {
            // Do nothing
        }
        else {
            this.unformatted.push('svg');
        }
        this.content_unformatted = options.content_unformatted || [
            'pre',
        ];
        this.preserve_newlines = (options.preserve_newlines === undefined) ? true : options.preserve_newlines;
        this.max_preserve_newlines = this.preserve_newlines ?
            (isNaN(parseInt(options.max_preserve_newlines as any, 10)) ? 32786 : parseInt(options.max_preserve_newlines as any, 10)) :
            0;
        this.indent_handlebars = (options.indent_handlebars === undefined) ? false : options.indent_handlebars;
        this.indent_scripts = (options.indent_scripts === undefined) ? 'normal' : options.indent_scripts;
        const wrap_attributes = (options.wrap_attributes === undefined) ? 'auto' : options.wrap_attributes;
        this.wrap_attributes_indent_size = (isNaN(parseInt(options.wrap_attributes_indent_size, 10))) ? this.indent_size : parseInt(options.wrap_attributes_indent_size, 10);
        this.is_wrap_attributes_force = wrap_attributes.substr(0, 'force'.length) === 'force';
        this.is_wrap_attributes_force_expand_multiline = (wrap_attributes === 'force-expand-multiline');
        this.is_wrap_attributes_force_aligned = (wrap_attributes === 'force-aligned');
        this.end_with_newline = (options.end_with_newline === undefined) ? false : options.end_with_newline;
        this.extra_liners = (typeof options.extra_liners === 'object') && options.extra_liners ?
            options.extra_liners.concat() : (typeof options.extra_liners === 'string') ?
                options.extra_liners.split(',') : 'head,body,/html'.split(',');
        this.eol = options.eol ? options.eol : 'auto';

        if (options.indent_with_tabs) {
            this.indent_character = '\t';
            this.indent_size = 1;
        }

        if (this.eol === 'auto') {
            this.eol = '\n';
            if (this.html_source && lineBreak.test(this.html_source || '')) {
                this.eol = this.html_source.match(lineBreak)[0];
            }
        }

        this.eol = this.eol.replace(/\\r/, '\r').replace(/\\n/, '\n');

        // HACK: newline parsing inconsistent. This brute force normalizes the input.
        this.html_source = this.html_source.replace(allLineBreaks, '\n');
    }

    beautify() {
        const args: ParserArgs = {
            content_unformatted: this.content_unformatted,
            extra_liners: this.extra_liners,
            indent_body_inner_html: this.indent_body_inner_html,
            indent_handlebars: this.indent_handlebars,
            indent_head_inner_html: this.indent_head_inner_html,
            indent_inner_html: this.indent_inner_html,
            max_preserve_newlines: this.max_preserve_newlines,
            preserve_newlines: this.preserve_newlines,
            unformatted: this.unformatted,
            is_wrap_attributes_force: this.is_wrap_attributes_force,
            is_wrap_attributes_force_aligned: this.is_wrap_attributes_force_aligned,
            is_wrap_attributes_force_expand_multiline: this.is_wrap_attributes_force_expand_multiline,
            wrap_attributes_indent_size: this.wrap_attributes_indent_size
        };
        const parser = new Parser(args); //wrapping functions Parser
        parser.printer(this.html_source, this.indent_character, this.indent_size, this.wrap_line_length, this.brace_style); //initialize starting values
        while (true) {
            const t = parser.get_token();
            parser.token_text = t[0];
            parser.token_type = t[1];

            if (parser.token_type === 'TK_EOF') {
                break;
            }

            switch (parser.token_type) {
                case 'TK_TAG_START':
                    parser.print_newline(false, parser.output);
                    parser.print_token(parser.token_text);
                    if (parser.indent_content) {
                        if ((parser.indent_body_inner_html || !parser.token_text.match(/<body(?:.*)>/)) &&
                            (parser.indent_head_inner_html || !parser.token_text.match(/<head(?:.*)>/))) {

                            parser.indent();
                        }

                        parser.indent_content = false;
                    }
                    parser.current_mode = 'CONTENT';
                    break;
                case 'TK_TAG_STYLE':
                case 'TK_TAG_SCRIPT':
                    parser.print_newline(false, parser.output);
                    parser.print_token(parser.token_text);
                    parser.current_mode = 'CONTENT';
                    break;
                case 'TK_TAG_END':
                    //Print new line only if the tag has no content and has child
                    if (parser.last_token === 'TK_CONTENT' && parser.last_text === '') {
                        var tag_name = (parser.token_text.match(/\w+/) || [])[0];
                        var tag_extracted_from_last_output = null;
                        if (parser.output.length) {
                            tag_extracted_from_last_output = parser.output[parser.output.length - 1].match(/(?:<|{{#)\s*(\w+)/);
                        }
                        if (tag_extracted_from_last_output === null ||
                            (tag_extracted_from_last_output[1] !== tag_name && !parser.Utils.in_array(tag_extracted_from_last_output[1], this.unformatted))) {
                            parser.print_newline(false, parser.output);
                        }
                    }
                    parser.print_token(parser.token_text);
                    parser.current_mode = 'CONTENT';
                    break;
                case 'TK_TAG_SINGLE':
                    // Don't add a newline before elements that should remain unformatted.
                    var tag_check = parser.token_text.match(/^\s*<([a-z-]+)/i);
                    if (!tag_check || !parser.Utils.in_array(tag_check[1], this.unformatted)) {
                        parser.print_newline(false, parser.output);
                    }
                    parser.print_token(parser.token_text);
                    parser.current_mode = 'CONTENT';
                    break;
                case 'TK_TAG_HANDLEBARS_ELSE':
                    // Don't add a newline if opening {{#if}} tag is on the current line
                    var foundIfOnCurrentLine = false;
                    for (var lastCheckedOutput = parser.output.length - 1; lastCheckedOutput >= 0; lastCheckedOutput--) {
                        if (parser.output[lastCheckedOutput] === '\n') {
                            break;
                        } else {
                            if (parser.output[lastCheckedOutput].match(/{{#if/)) {
                                foundIfOnCurrentLine = true;
                                break;
                            }
                        }
                    }
                    if (!foundIfOnCurrentLine) {
                        parser.print_newline(false, parser.output);
                    }
                    parser.print_token(parser.token_text);
                    if (parser.indent_content) {
                        parser.indent();
                        parser.indent_content = false;
                    }
                    parser.current_mode = 'CONTENT';
                    break;
                case 'TK_TAG_HANDLEBARS_COMMENT':
                    parser.print_token(parser.token_text);
                    parser.current_mode = 'TAG';
                    break;
                case 'TK_CONTENT':
                    parser.print_token(parser.token_text);
                    parser.current_mode = 'TAG';
                    break;
                case 'TK_STYLE':
                case 'TK_SCRIPT':
                    if (parser.token_text !== '') {
                        parser.print_newline(false, parser.output);
                        var text = parser.token_text;
                        var _beautifier;
                        var script_indent_level = 1;
                        if (parser.token_type === 'TK_SCRIPT') {
                            _beautifier = typeof this.js_beautify === 'function' && this.js_beautify;
                        } else if (parser.token_type === 'TK_STYLE') {
                            _beautifier = typeof this.css_beautify === 'function' && this.css_beautify;
                        }

                        if (this.indent_scripts === "keep") {
                            script_indent_level = 0;
                        } else if (this.indent_scripts === "separate") {
                            script_indent_level = -parser.indent_level;
                        }

                        var indentation = parser.get_full_indent(script_indent_level);
                        if (_beautifier) {

                            // call the Beautifier if avaliable
                            /*
                            var Child_options = function () {
                                this.eol = '\n';
                            };
                            Child_options.prototype = options;
                            var child_options = new Child_options();
                            */
                            text = _beautifier(text.replace(/^\s*/, indentation), child_options);
                        } else {
                            // simply indent the string otherwise
                            var white = text.match(/^\s*/)[0];
                            var _level = white.match(/[^\n\r]*$/)[0].split(parser.indent_string).length - 1;
                            var reindent = parser.get_full_indent(script_indent_level - _level);
                            text = text.replace(/^\s*/, indentation)
                                .replace(/\r\n|\r|\n/g, '\n' + reindent)
                                .replace(/\s+$/, '');
                        }
                        if (text) {
                            parser.print_token_raw(text);
                            parser.print_newline(true, parser.output);
                        }
                    }
                    parser.current_mode = 'TAG';
                    break;
                default:
                    // We should not be getting here but we don't want to drop input on the floor
                    // Just output the text and move on
                    if (parser.token_text !== '') {
                        parser.print_token(parser.token_text);
                    }
                    break;
            }
            parser.last_token = parser.token_type;
            parser.last_text = parser.token_text;
        }
        let sweetCode = parser.output.join('').replace(/[\r\n\t ]+$/, '');

        // establish end_with_newline
        if (this.end_with_newline) {
            sweetCode += '\n';
        }

        if (this.eol !== '\n') {
            sweetCode = sweetCode.replace(/[\n]/g, this.eol);
        }

        return sweetCode;
    }
}
