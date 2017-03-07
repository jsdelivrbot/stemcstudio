System.register(["./EntityParser", "./InputStream", "./isAlpha", "./isWhitespace"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var EntityParser_1, InputStream_1, isAlpha_1, isWhitespace_1, Tokenizer;
    return {
        setters: [
            function (EntityParser_1_1) {
                EntityParser_1 = EntityParser_1_1;
            },
            function (InputStream_1_1) {
                InputStream_1 = InputStream_1_1;
            },
            function (isAlpha_1_1) {
                isAlpha_1 = isAlpha_1_1;
            },
            function (isWhitespace_1_1) {
                isWhitespace_1 = isWhitespace_1_1;
            }
        ],
        execute: function () {
            Tokenizer = (function () {
                function Tokenizer(tokenHandler) {
                    this._tokenHandler = tokenHandler;
                    this._state = Tokenizer.DATA;
                    this._inputStream = new InputStream_1.default();
                    this._currentToken = null;
                    this._temporaryBuffer = '';
                    this._additionalAllowedCharacter = '';
                }
                Object.defineProperty(Tokenizer.prototype, "lineNumber", {
                    get: function () {
                        return this._inputStream.location().line;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Tokenizer.prototype, "columnNumber", {
                    get: function () {
                        return this._inputStream.location().column;
                    },
                    enumerable: true,
                    configurable: true
                });
                Tokenizer.prototype._parseError = function (code, args) {
                    this._tokenHandler.parseError(code, args);
                };
                Tokenizer.prototype._emitToken = function (token) {
                    if (token.type === 'StartTag') {
                        for (var i = 1; i < token.data.length; i++) {
                            if (!token.data[i].nodeName)
                                token.data.splice(i--, 1);
                        }
                    }
                    else if (token.type === 'EndTag') {
                        if (token.selfClosing) {
                            this._parseError('self-closing-flag-on-end-tag');
                        }
                        if (token.data.length !== 0) {
                            this._parseError('attributes-in-end-tag');
                        }
                    }
                    this._tokenHandler.processToken(token);
                    if (token.type === 'StartTag' && token.selfClosing && !this._tokenHandler.isSelfClosingFlagAcknowledged()) {
                        this._parseError('non-void-element-with-trailing-solidus', { name: token.name });
                    }
                };
                Tokenizer.prototype._emitCurrentToken = function () {
                    this._state = Tokenizer.DATA;
                    this._emitToken(this._currentToken);
                };
                Tokenizer.prototype._currentAttribute = function () {
                    return this._currentToken.data[this._currentToken.data.length - 1];
                };
                Tokenizer.prototype.setState = function (state) {
                    this._state = state;
                };
                Tokenizer.prototype.tokenize = function (source) {
                    Tokenizer.DATA = data_state;
                    Tokenizer.RCDATA = rcdata_state;
                    Tokenizer.RAWTEXT = rawtext_state;
                    Tokenizer.SCRIPT_DATA = script_data_state;
                    Tokenizer.PLAINTEXT = plaintext_state;
                    this._state = Tokenizer.DATA;
                    this._inputStream.append(source);
                    this._tokenHandler.startTokenization(this);
                    this._inputStream.eof = true;
                    var tokenizer = this;
                    while (this._state.call(this, this._inputStream))
                        ;
                    function data_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._emitToken({ type: 'EOF', data: null });
                            return false;
                        }
                        else if (data === '&') {
                            tokenizer.setState(character_reference_in_data_state);
                        }
                        else if (data === '<') {
                            tokenizer.setState(tag_open_state);
                        }
                        else if (data === '\u0000') {
                            tokenizer._emitToken({ type: 'Characters', data: data });
                            buffer.commit();
                        }
                        else {
                            var chars = buffer.matchUntil("&|<|\u0000");
                            tokenizer._emitToken({ type: 'Characters', data: data + chars });
                            buffer.commit();
                        }
                        return true;
                    }
                    function character_reference_in_data_state(buffer) {
                        var character = EntityParser_1.EntityParser.consumeEntity(buffer, tokenizer);
                        tokenizer.setState(data_state);
                        tokenizer._emitToken({ type: 'Characters', data: character || '&' });
                        return true;
                    }
                    function rcdata_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._emitToken({ type: 'EOF', data: null });
                            return false;
                        }
                        else if (data === '&') {
                            tokenizer.setState(character_reference_in_rcdata_state);
                        }
                        else if (data === '<') {
                            tokenizer.setState(rcdata_less_than_sign_state);
                        }
                        else if (data === "\u0000") {
                            tokenizer._parseError("invalid-codepoint");
                            tokenizer._emitToken({ type: 'Characters', data: '\uFFFD' });
                            buffer.commit();
                        }
                        else {
                            var chars = buffer.matchUntil("&|<|\u0000");
                            tokenizer._emitToken({ type: 'Characters', data: data + chars });
                            buffer.commit();
                        }
                        return true;
                    }
                    function character_reference_in_rcdata_state(buffer) {
                        var character = EntityParser_1.EntityParser.consumeEntity(buffer, tokenizer);
                        tokenizer.setState(rcdata_state);
                        tokenizer._emitToken({ type: 'Characters', data: character || '&' });
                        return true;
                    }
                    function rawtext_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._emitToken({ type: 'EOF', data: null });
                            return false;
                        }
                        else if (data === '<') {
                            tokenizer.setState(rawtext_less_than_sign_state);
                        }
                        else if (data === "\u0000") {
                            tokenizer._parseError("invalid-codepoint");
                            tokenizer._emitToken({ type: 'Characters', data: '\uFFFD' });
                            buffer.commit();
                        }
                        else {
                            var chars = buffer.matchUntil("<|\u0000");
                            tokenizer._emitToken({ type: 'Characters', data: data + chars });
                        }
                        return true;
                    }
                    function plaintext_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._emitToken({ type: 'EOF', data: null });
                            return false;
                        }
                        else if (data === "\u0000") {
                            tokenizer._parseError("invalid-codepoint");
                            tokenizer._emitToken({ type: 'Characters', data: '\uFFFD' });
                            buffer.commit();
                        }
                        else {
                            var chars = buffer.matchUntil("\u0000");
                            tokenizer._emitToken({ type: 'Characters', data: data + chars });
                        }
                        return true;
                    }
                    function script_data_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._emitToken({ type: 'EOF', data: null });
                            return false;
                        }
                        else if (data === '<') {
                            tokenizer.setState(script_data_less_than_sign_state);
                        }
                        else if (data === '\u0000') {
                            tokenizer._parseError("invalid-codepoint");
                            tokenizer._emitToken({ type: 'Characters', data: '\uFFFD' });
                            buffer.commit();
                        }
                        else {
                            var chars = buffer.matchUntil("<|\u0000");
                            tokenizer._emitToken({ type: 'Characters', data: data + chars });
                        }
                        return true;
                    }
                    function rcdata_less_than_sign_state(buffer) {
                        var data = buffer.char();
                        if (data === "/") {
                            this._temporaryBuffer = '';
                            tokenizer.setState(rcdata_end_tag_open_state);
                        }
                        else {
                            tokenizer._emitToken({ type: 'Characters', data: '<' });
                            buffer.unget(data);
                            tokenizer.setState(rcdata_state);
                        }
                        return true;
                    }
                    function rcdata_end_tag_open_state(buffer) {
                        var data = buffer.char();
                        if (isAlpha_1.default(data)) {
                            this._temporaryBuffer += data;
                            tokenizer.setState(rcdata_end_tag_name_state);
                        }
                        else {
                            tokenizer._emitToken({ type: 'Characters', data: '</' });
                            buffer.unget(data);
                            tokenizer.setState(rcdata_state);
                        }
                        return true;
                    }
                    function rcdata_end_tag_name_state(buffer) {
                        var appropriate = tokenizer._currentToken && (tokenizer._currentToken.name === this._temporaryBuffer.toLowerCase());
                        var data = buffer.char();
                        if (isWhitespace_1.default(data) && appropriate) {
                            tokenizer._currentToken = { type: 'EndTag', name: this._temporaryBuffer, data: [], selfClosing: false };
                            tokenizer.setState(before_attribute_name_state);
                        }
                        else if (data === '/' && appropriate) {
                            tokenizer._currentToken = { type: 'EndTag', name: this._temporaryBuffer, data: [], selfClosing: false };
                            tokenizer.setState(self_closing_tag_state);
                        }
                        else if (data === '>' && appropriate) {
                            tokenizer._currentToken = { type: 'EndTag', name: this._temporaryBuffer, data: [], selfClosing: false };
                            tokenizer._emitCurrentToken();
                            tokenizer.setState(data_state);
                        }
                        else if (isAlpha_1.default(data)) {
                            this._temporaryBuffer += data;
                            buffer.commit();
                        }
                        else {
                            tokenizer._emitToken({ type: 'Characters', data: '</' + this._temporaryBuffer });
                            buffer.unget(data);
                            tokenizer.setState(rcdata_state);
                        }
                        return true;
                    }
                    function rawtext_less_than_sign_state(buffer) {
                        var data = buffer.char();
                        if (data === "/") {
                            this._temporaryBuffer = '';
                            tokenizer.setState(rawtext_end_tag_open_state);
                        }
                        else {
                            tokenizer._emitToken({ type: 'Characters', data: '<' });
                            buffer.unget(data);
                            tokenizer.setState(rawtext_state);
                        }
                        return true;
                    }
                    function rawtext_end_tag_open_state(buffer) {
                        var data = buffer.char();
                        if (isAlpha_1.default(data)) {
                            this._temporaryBuffer += data;
                            tokenizer.setState(rawtext_end_tag_name_state);
                        }
                        else {
                            tokenizer._emitToken({ type: 'Characters', data: '</' });
                            buffer.unget(data);
                            tokenizer.setState(rawtext_state);
                        }
                        return true;
                    }
                    function rawtext_end_tag_name_state(buffer) {
                        var appropriate = tokenizer._currentToken && (tokenizer._currentToken.name === this._temporaryBuffer.toLowerCase());
                        var data = buffer.char();
                        if (isWhitespace_1.default(data) && appropriate) {
                            tokenizer._currentToken = { type: 'EndTag', name: this._temporaryBuffer, data: [], selfClosing: false };
                            tokenizer.setState(before_attribute_name_state);
                        }
                        else if (data === '/' && appropriate) {
                            tokenizer._currentToken = { type: 'EndTag', name: this._temporaryBuffer, data: [], selfClosing: false };
                            tokenizer.setState(self_closing_tag_state);
                        }
                        else if (data === '>' && appropriate) {
                            tokenizer._currentToken = { type: 'EndTag', name: this._temporaryBuffer, data: [], selfClosing: false };
                            tokenizer._emitCurrentToken();
                            tokenizer.setState(data_state);
                        }
                        else if (isAlpha_1.default(data)) {
                            this._temporaryBuffer += data;
                            buffer.commit();
                        }
                        else {
                            tokenizer._emitToken({ type: 'Characters', data: '</' + this._temporaryBuffer });
                            buffer.unget(data);
                            tokenizer.setState(rawtext_state);
                        }
                        return true;
                    }
                    function script_data_less_than_sign_state(buffer) {
                        var data = buffer.char();
                        if (data === "/") {
                            this._temporaryBuffer = '';
                            tokenizer.setState(script_data_end_tag_open_state);
                        }
                        else if (data === '!') {
                            tokenizer._emitToken({ type: 'Characters', data: '<!' });
                            tokenizer.setState(script_data_escape_start_state);
                        }
                        else {
                            tokenizer._emitToken({ type: 'Characters', data: '<' });
                            buffer.unget(data);
                            tokenizer.setState(script_data_state);
                        }
                        return true;
                    }
                    function script_data_end_tag_open_state(buffer) {
                        var data = buffer.char();
                        if (isAlpha_1.default(data)) {
                            this._temporaryBuffer += data;
                            tokenizer.setState(script_data_end_tag_name_state);
                        }
                        else {
                            tokenizer._emitToken({ type: 'Characters', data: '</' });
                            buffer.unget(data);
                            tokenizer.setState(script_data_state);
                        }
                        return true;
                    }
                    function script_data_end_tag_name_state(buffer) {
                        var appropriate = tokenizer._currentToken && (tokenizer._currentToken.name === this._temporaryBuffer.toLowerCase());
                        var data = buffer.char();
                        if (isWhitespace_1.default(data) && appropriate) {
                            tokenizer._currentToken = { type: 'EndTag', name: 'script', data: [], selfClosing: false };
                            tokenizer.setState(before_attribute_name_state);
                        }
                        else if (data === '/' && appropriate) {
                            tokenizer._currentToken = { type: 'EndTag', name: 'script', data: [], selfClosing: false };
                            tokenizer.setState(self_closing_tag_state);
                        }
                        else if (data === '>' && appropriate) {
                            tokenizer._currentToken = { type: 'EndTag', name: 'script', data: [], selfClosing: false };
                            tokenizer._emitCurrentToken();
                        }
                        else if (isAlpha_1.default(data)) {
                            this._temporaryBuffer += data;
                            buffer.commit();
                        }
                        else {
                            tokenizer._emitToken({ type: 'Characters', data: '</' + this._temporaryBuffer });
                            buffer.unget(data);
                            tokenizer.setState(script_data_state);
                        }
                        return true;
                    }
                    function script_data_escape_start_state(buffer) {
                        var data = buffer.char();
                        if (data === '-') {
                            tokenizer._emitToken({ type: 'Characters', data: '-' });
                            tokenizer.setState(script_data_escape_start_dash_state);
                        }
                        else {
                            buffer.unget(data);
                            tokenizer.setState(script_data_state);
                        }
                        return true;
                    }
                    function script_data_escape_start_dash_state(buffer) {
                        var data = buffer.char();
                        if (data === '-') {
                            tokenizer._emitToken({ type: 'Characters', data: '-' });
                            tokenizer.setState(script_data_escaped_dash_dash_state);
                        }
                        else {
                            buffer.unget(data);
                            tokenizer.setState(script_data_state);
                        }
                        return true;
                    }
                    function script_data_escaped_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            buffer.unget(data);
                            tokenizer.setState(data_state);
                        }
                        else if (data === '-') {
                            tokenizer._emitToken({ type: 'Characters', data: '-' });
                            tokenizer.setState(script_data_escaped_dash_state);
                        }
                        else if (data === '<') {
                            tokenizer.setState(script_data_escaped_less_then_sign_state);
                        }
                        else if (data === '\u0000') {
                            tokenizer._parseError("invalid-codepoint");
                            tokenizer._emitToken({ type: 'Characters', data: '\uFFFD' });
                            buffer.commit();
                        }
                        else {
                            var chars = buffer.matchUntil('<|-|\u0000');
                            tokenizer._emitToken({ type: 'Characters', data: data + chars });
                        }
                        return true;
                    }
                    function script_data_escaped_dash_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            buffer.unget(data);
                            tokenizer.setState(data_state);
                        }
                        else if (data === '-') {
                            tokenizer._emitToken({ type: 'Characters', data: '-' });
                            tokenizer.setState(script_data_escaped_dash_dash_state);
                        }
                        else if (data === '<') {
                            tokenizer.setState(script_data_escaped_less_then_sign_state);
                        }
                        else if (data === '\u0000') {
                            tokenizer._parseError("invalid-codepoint");
                            tokenizer._emitToken({ type: 'Characters', data: '\uFFFD' });
                            tokenizer.setState(script_data_escaped_state);
                        }
                        else {
                            tokenizer._emitToken({ type: 'Characters', data: data });
                            tokenizer.setState(script_data_escaped_state);
                        }
                        return true;
                    }
                    function script_data_escaped_dash_dash_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._parseError('eof-in-script');
                            buffer.unget(data);
                            tokenizer.setState(data_state);
                        }
                        else if (data === '<') {
                            tokenizer.setState(script_data_escaped_less_then_sign_state);
                        }
                        else if (data === '>') {
                            tokenizer._emitToken({ type: 'Characters', data: '>' });
                            tokenizer.setState(script_data_state);
                        }
                        else if (data === '\u0000') {
                            tokenizer._parseError("invalid-codepoint");
                            tokenizer._emitToken({ type: 'Characters', data: '\uFFFD' });
                            tokenizer.setState(script_data_escaped_state);
                        }
                        else {
                            tokenizer._emitToken({ type: 'Characters', data: data });
                            tokenizer.setState(script_data_escaped_state);
                        }
                        return true;
                    }
                    function script_data_escaped_less_then_sign_state(buffer) {
                        var data = buffer.char();
                        if (data === '/') {
                            this._temporaryBuffer = '';
                            tokenizer.setState(script_data_escaped_end_tag_open_state);
                        }
                        else if (isAlpha_1.default(data)) {
                            tokenizer._emitToken({ type: 'Characters', data: '<' + data });
                            this._temporaryBuffer = data;
                            tokenizer.setState(script_data_double_escape_start_state);
                        }
                        else {
                            tokenizer._emitToken({ type: 'Characters', data: '<' });
                            buffer.unget(data);
                            tokenizer.setState(script_data_escaped_state);
                        }
                        return true;
                    }
                    function script_data_escaped_end_tag_open_state(buffer) {
                        var data = buffer.char();
                        if (isAlpha_1.default(data)) {
                            this._temporaryBuffer = data;
                            tokenizer.setState(script_data_escaped_end_tag_name_state);
                        }
                        else {
                            tokenizer._emitToken({ type: 'Characters', data: '</' });
                            buffer.unget(data);
                            tokenizer.setState(script_data_escaped_state);
                        }
                        return true;
                    }
                    function script_data_escaped_end_tag_name_state(buffer) {
                        var appropriate = tokenizer._currentToken && (tokenizer._currentToken.name === this._temporaryBuffer.toLowerCase());
                        var data = buffer.char();
                        if (isWhitespace_1.default(data) && appropriate) {
                            tokenizer._currentToken = { type: 'EndTag', name: 'script', data: [], selfClosing: false };
                            tokenizer.setState(before_attribute_name_state);
                        }
                        else if (data === '/' && appropriate) {
                            tokenizer._currentToken = { type: 'EndTag', name: 'script', data: [], selfClosing: false };
                            tokenizer.setState(self_closing_tag_state);
                        }
                        else if (data === '>' && appropriate) {
                            tokenizer._currentToken = { type: 'EndTag', name: 'script', data: [], selfClosing: false };
                            tokenizer.setState(data_state);
                            tokenizer._emitCurrentToken();
                        }
                        else if (isAlpha_1.default(data)) {
                            this._temporaryBuffer += data;
                            buffer.commit();
                        }
                        else {
                            tokenizer._emitToken({ type: 'Characters', data: '</' + this._temporaryBuffer });
                            buffer.unget(data);
                            tokenizer.setState(script_data_escaped_state);
                        }
                        return true;
                    }
                    function script_data_double_escape_start_state(buffer) {
                        var data = buffer.char();
                        if (isWhitespace_1.default(data) || data === '/' || data === '>') {
                            tokenizer._emitToken({ type: 'Characters', data: data });
                            if (this._temporaryBuffer.toLowerCase() === 'script')
                                tokenizer.setState(script_data_double_escaped_state);
                            else
                                tokenizer.setState(script_data_escaped_state);
                        }
                        else if (isAlpha_1.default(data)) {
                            tokenizer._emitToken({ type: 'Characters', data: data });
                            this._temporaryBuffer += data;
                            buffer.commit();
                        }
                        else {
                            buffer.unget(data);
                            tokenizer.setState(script_data_escaped_state);
                        }
                        return true;
                    }
                    function script_data_double_escaped_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._parseError('eof-in-script');
                            buffer.unget(data);
                            tokenizer.setState(data_state);
                        }
                        else if (data === '-') {
                            tokenizer._emitToken({ type: 'Characters', data: '-' });
                            tokenizer.setState(script_data_double_escaped_dash_state);
                        }
                        else if (data === '<') {
                            tokenizer._emitToken({ type: 'Characters', data: '<' });
                            tokenizer.setState(script_data_double_escaped_less_than_sign_state);
                        }
                        else if (data === '\u0000') {
                            tokenizer._parseError('invalid-codepoint');
                            tokenizer._emitToken({ type: 'Characters', data: '\uFFFD' });
                            buffer.commit();
                        }
                        else {
                            tokenizer._emitToken({ type: 'Characters', data: data });
                            buffer.commit();
                        }
                        return true;
                    }
                    function script_data_double_escaped_dash_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._parseError('eof-in-script');
                            buffer.unget(data);
                            tokenizer.setState(data_state);
                        }
                        else if (data === '-') {
                            tokenizer._emitToken({ type: 'Characters', data: '-' });
                            tokenizer.setState(script_data_double_escaped_dash_dash_state);
                        }
                        else if (data === '<') {
                            tokenizer._emitToken({ type: 'Characters', data: '<' });
                            tokenizer.setState(script_data_double_escaped_less_than_sign_state);
                        }
                        else if (data === '\u0000') {
                            tokenizer._parseError('invalid-codepoint');
                            tokenizer._emitToken({ type: 'Characters', data: '\uFFFD' });
                            tokenizer.setState(script_data_double_escaped_state);
                        }
                        else {
                            tokenizer._emitToken({ type: 'Characters', data: data });
                            tokenizer.setState(script_data_double_escaped_state);
                        }
                        return true;
                    }
                    function script_data_double_escaped_dash_dash_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._parseError('eof-in-script');
                            buffer.unget(data);
                            tokenizer.setState(data_state);
                        }
                        else if (data === '-') {
                            tokenizer._emitToken({ type: 'Characters', data: '-' });
                            buffer.commit();
                        }
                        else if (data === '<') {
                            tokenizer._emitToken({ type: 'Characters', data: '<' });
                            tokenizer.setState(script_data_double_escaped_less_than_sign_state);
                        }
                        else if (data === '>') {
                            tokenizer._emitToken({ type: 'Characters', data: '>' });
                            tokenizer.setState(script_data_state);
                        }
                        else if (data === '\u0000') {
                            tokenizer._parseError('invalid-codepoint');
                            tokenizer._emitToken({ type: 'Characters', data: '\uFFFD' });
                            tokenizer.setState(script_data_double_escaped_state);
                        }
                        else {
                            tokenizer._emitToken({ type: 'Characters', data: data });
                            tokenizer.setState(script_data_double_escaped_state);
                        }
                        return true;
                    }
                    function script_data_double_escaped_less_than_sign_state(buffer) {
                        var data = buffer.char();
                        if (data === '/') {
                            tokenizer._emitToken({ type: 'Characters', data: '/' });
                            this._temporaryBuffer = '';
                            tokenizer.setState(script_data_double_escape_end_state);
                        }
                        else {
                            buffer.unget(data);
                            tokenizer.setState(script_data_double_escaped_state);
                        }
                        return true;
                    }
                    function script_data_double_escape_end_state(buffer) {
                        var data = buffer.char();
                        if (isWhitespace_1.default(data) || data === '/' || data === '>') {
                            tokenizer._emitToken({ type: 'Characters', data: data });
                            if (this._temporaryBuffer.toLowerCase() === 'script')
                                tokenizer.setState(script_data_escaped_state);
                            else
                                tokenizer.setState(script_data_double_escaped_state);
                        }
                        else if (isAlpha_1.default(data)) {
                            tokenizer._emitToken({ type: 'Characters', data: data });
                            this._temporaryBuffer += data;
                            buffer.commit();
                        }
                        else {
                            buffer.unget(data);
                            tokenizer.setState(script_data_double_escaped_state);
                        }
                        return true;
                    }
                    function tag_open_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._parseError("bare-less-than-sign-at-eof");
                            tokenizer._emitToken({ type: 'Characters', data: '<' });
                            buffer.unget(data);
                            tokenizer.setState(data_state);
                        }
                        else if (isAlpha_1.default(data)) {
                            tokenizer._currentToken = { type: 'StartTag', name: data.toLowerCase(), data: [] };
                            tokenizer.setState(tag_name_state);
                        }
                        else if (data === '!') {
                            tokenizer.setState(markup_declaration_open_state);
                        }
                        else if (data === '/') {
                            tokenizer.setState(close_tag_open_state);
                        }
                        else if (data === '>') {
                            tokenizer._parseError("expected-tag-name-but-got-right-bracket");
                            tokenizer._emitToken({ type: 'Characters', data: "<>" });
                            tokenizer.setState(data_state);
                        }
                        else if (data === '?') {
                            tokenizer._parseError("expected-tag-name-but-got-question-mark");
                            buffer.unget(data);
                            tokenizer.setState(bogus_comment_state);
                        }
                        else {
                            tokenizer._parseError("expected-tag-name");
                            tokenizer._emitToken({ type: 'Characters', data: "<" });
                            buffer.unget(data);
                            tokenizer.setState(data_state);
                        }
                        return true;
                    }
                    function close_tag_open_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._parseError("expected-closing-tag-but-got-eof");
                            tokenizer._emitToken({ type: 'Characters', data: '</' });
                            buffer.unget(data);
                            tokenizer.setState(data_state);
                        }
                        else if (isAlpha_1.default(data)) {
                            tokenizer._currentToken = { type: 'EndTag', name: data.toLowerCase(), data: [] };
                            tokenizer.setState(tag_name_state);
                        }
                        else if (data === '>') {
                            tokenizer._parseError("expected-closing-tag-but-got-right-bracket");
                            tokenizer.setState(data_state);
                        }
                        else {
                            tokenizer._parseError("expected-closing-tag-but-got-char", { data: data });
                            buffer.unget(data);
                            tokenizer.setState(bogus_comment_state);
                        }
                        return true;
                    }
                    function tag_name_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._parseError('eof-in-tag-name');
                            buffer.unget(data);
                            tokenizer.setState(data_state);
                        }
                        else if (isWhitespace_1.default(data)) {
                            tokenizer.setState(before_attribute_name_state);
                        }
                        else if (isAlpha_1.default(data)) {
                            tokenizer._currentToken.name += data.toLowerCase();
                        }
                        else if (data === '>') {
                            tokenizer._emitCurrentToken();
                        }
                        else if (data === '/') {
                            tokenizer.setState(self_closing_tag_state);
                        }
                        else if (data === '\u0000') {
                            tokenizer._parseError("invalid-codepoint");
                            tokenizer._currentToken.name += "\uFFFD";
                        }
                        else {
                            tokenizer._currentToken.name += data;
                        }
                        buffer.commit();
                        return true;
                    }
                    function before_attribute_name_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._parseError("expected-attribute-name-but-got-eof");
                            buffer.unget(data);
                            tokenizer.setState(data_state);
                        }
                        else if (isWhitespace_1.default(data)) {
                            return true;
                        }
                        else if (isAlpha_1.default(data)) {
                            tokenizer._currentToken.data.push({ nodeName: data.toLowerCase(), nodeValue: "" });
                            tokenizer.setState(attribute_name_state);
                        }
                        else if (data === '>') {
                            tokenizer._emitCurrentToken();
                        }
                        else if (data === '/') {
                            tokenizer.setState(self_closing_tag_state);
                        }
                        else if (data === "'" || data === '"' || data === '=' || data === '<') {
                            tokenizer._parseError("invalid-character-in-attribute-name");
                            tokenizer._currentToken.data.push({ nodeName: data, nodeValue: "" });
                            tokenizer.setState(attribute_name_state);
                        }
                        else if (data === '\u0000') {
                            tokenizer._parseError("invalid-codepoint");
                            tokenizer._currentToken.data.push({ nodeName: "\uFFFD", nodeValue: "" });
                        }
                        else {
                            tokenizer._currentToken.data.push({ nodeName: data, nodeValue: "" });
                            tokenizer.setState(attribute_name_state);
                        }
                        return true;
                    }
                    function attribute_name_state(buffer) {
                        var data = buffer.char();
                        var leavingThisState = true;
                        var shouldEmit = false;
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._parseError("eof-in-attribute-name");
                            buffer.unget(data);
                            tokenizer.setState(data_state);
                            shouldEmit = true;
                        }
                        else if (data === '=') {
                            tokenizer.setState(before_attribute_value_state);
                        }
                        else if (isAlpha_1.default(data)) {
                            tokenizer._currentAttribute().nodeName += data.toLowerCase();
                            leavingThisState = false;
                        }
                        else if (data === '>') {
                            shouldEmit = true;
                        }
                        else if (isWhitespace_1.default(data)) {
                            tokenizer.setState(after_attribute_name_state);
                        }
                        else if (data === '/') {
                            tokenizer.setState(self_closing_tag_state);
                        }
                        else if (data === "'" || data === '"') {
                            tokenizer._parseError("invalid-character-in-attribute-name");
                            tokenizer._currentAttribute().nodeName += data;
                            leavingThisState = false;
                        }
                        else if (data === '\u0000') {
                            tokenizer._parseError("invalid-codepoint");
                            tokenizer._currentAttribute().nodeName += "\uFFFD";
                        }
                        else {
                            tokenizer._currentAttribute().nodeName += data;
                            leavingThisState = false;
                        }
                        if (leavingThisState) {
                            var attributes = tokenizer._currentToken.data;
                            var currentAttribute = attributes[attributes.length - 1];
                            for (var i = attributes.length - 2; i >= 0; i--) {
                                if (currentAttribute.nodeName === attributes[i].nodeName) {
                                    tokenizer._parseError("duplicate-attribute", { name: currentAttribute.nodeName });
                                    currentAttribute.nodeName = null;
                                    break;
                                }
                            }
                            if (shouldEmit)
                                tokenizer._emitCurrentToken();
                        }
                        else {
                            buffer.commit();
                        }
                        return true;
                    }
                    function after_attribute_name_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._parseError("expected-end-of-tag-but-got-eof");
                            buffer.unget(data);
                            tokenizer.setState(data_state);
                        }
                        else if (isWhitespace_1.default(data)) {
                            return true;
                        }
                        else if (data === '=') {
                            tokenizer.setState(before_attribute_value_state);
                        }
                        else if (data === '>') {
                            tokenizer._emitCurrentToken();
                        }
                        else if (isAlpha_1.default(data)) {
                            tokenizer._currentToken.data.push({ nodeName: data, nodeValue: "" });
                            tokenizer.setState(attribute_name_state);
                        }
                        else if (data === '/') {
                            tokenizer.setState(self_closing_tag_state);
                        }
                        else if (data === "'" || data === '"' || data === '<') {
                            tokenizer._parseError("invalid-character-after-attribute-name");
                            tokenizer._currentToken.data.push({ nodeName: data, nodeValue: "" });
                            tokenizer.setState(attribute_name_state);
                        }
                        else if (data === '\u0000') {
                            tokenizer._parseError("invalid-codepoint");
                            tokenizer._currentToken.data.push({ nodeName: "\uFFFD", nodeValue: "" });
                        }
                        else {
                            tokenizer._currentToken.data.push({ nodeName: data, nodeValue: "" });
                            tokenizer.setState(attribute_name_state);
                        }
                        return true;
                    }
                    function before_attribute_value_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._parseError("expected-attribute-value-but-got-eof");
                            buffer.unget(data);
                            tokenizer.setState(data_state);
                        }
                        else if (isWhitespace_1.default(data)) {
                            return true;
                        }
                        else if (data === '"') {
                            tokenizer.setState(attribute_value_double_quoted_state);
                        }
                        else if (data === '&') {
                            tokenizer.setState(attribute_value_unquoted_state);
                            buffer.unget(data);
                        }
                        else if (data === "'") {
                            tokenizer.setState(attribute_value_single_quoted_state);
                        }
                        else if (data === '>') {
                            tokenizer._parseError("expected-attribute-value-but-got-right-bracket");
                            tokenizer._emitCurrentToken();
                        }
                        else if (data === '=' || data === '<' || data === '`') {
                            tokenizer._parseError("unexpected-character-in-unquoted-attribute-value");
                            tokenizer._currentAttribute().nodeValue += data;
                            tokenizer.setState(attribute_value_unquoted_state);
                        }
                        else if (data === '\u0000') {
                            tokenizer._parseError("invalid-codepoint");
                            tokenizer._currentAttribute().nodeValue += "\uFFFD";
                        }
                        else {
                            tokenizer._currentAttribute().nodeValue += data;
                            tokenizer.setState(attribute_value_unquoted_state);
                        }
                        return true;
                    }
                    function attribute_value_double_quoted_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._parseError("eof-in-attribute-value-double-quote");
                            buffer.unget(data);
                            tokenizer.setState(data_state);
                        }
                        else if (data === '"') {
                            tokenizer.setState(after_attribute_value_state);
                        }
                        else if (data === '&') {
                            this._additionalAllowedCharacter = '"';
                            tokenizer.setState(character_reference_in_attribute_value_state);
                        }
                        else if (data === '\u0000') {
                            tokenizer._parseError("invalid-codepoint");
                            tokenizer._currentAttribute().nodeValue += "\uFFFD";
                        }
                        else {
                            var s = buffer.matchUntil('[\0"&]');
                            data = data + s;
                            tokenizer._currentAttribute().nodeValue += data;
                        }
                        return true;
                    }
                    function attribute_value_single_quoted_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._parseError("eof-in-attribute-value-single-quote");
                            buffer.unget(data);
                            tokenizer.setState(data_state);
                        }
                        else if (data === "'") {
                            tokenizer.setState(after_attribute_value_state);
                        }
                        else if (data === '&') {
                            this._additionalAllowedCharacter = "'";
                            tokenizer.setState(character_reference_in_attribute_value_state);
                        }
                        else if (data === '\u0000') {
                            tokenizer._parseError("invalid-codepoint");
                            tokenizer._currentAttribute().nodeValue += "\uFFFD";
                        }
                        else {
                            tokenizer._currentAttribute().nodeValue += data + buffer.matchUntil("\u0000|['&]");
                        }
                        return true;
                    }
                    function attribute_value_unquoted_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._parseError("eof-after-attribute-value");
                            buffer.unget(data);
                            tokenizer.setState(data_state);
                        }
                        else if (isWhitespace_1.default(data)) {
                            tokenizer.setState(before_attribute_name_state);
                        }
                        else if (data === '&') {
                            this._additionalAllowedCharacter = ">";
                            tokenizer.setState(character_reference_in_attribute_value_state);
                        }
                        else if (data === '>') {
                            tokenizer._emitCurrentToken();
                        }
                        else if (data === '"' || data === "'" || data === '=' || data === '`' || data === '<') {
                            tokenizer._parseError("unexpected-character-in-unquoted-attribute-value");
                            tokenizer._currentAttribute().nodeValue += data;
                            buffer.commit();
                        }
                        else if (data === '\u0000') {
                            tokenizer._parseError("invalid-codepoint");
                            tokenizer._currentAttribute().nodeValue += "\uFFFD";
                        }
                        else {
                            var o = buffer.matchUntil("\u0000|[" + "\t\n\v\f\x20\r" + "&<>\"'=`" + "]");
                            if (o === InputStream_1.default.EOF) {
                                tokenizer._parseError("eof-in-attribute-value-no-quotes");
                                tokenizer._emitCurrentToken();
                            }
                            buffer.commit();
                            tokenizer._currentAttribute().nodeValue += data + o;
                        }
                        return true;
                    }
                    function character_reference_in_attribute_value_state(buffer) {
                        var character = EntityParser_1.EntityParser.consumeEntity(buffer, tokenizer, this._additionalAllowedCharacter);
                        this._currentAttribute().nodeValue += character || '&';
                        if (this._additionalAllowedCharacter === '"')
                            tokenizer.setState(attribute_value_double_quoted_state);
                        else if (this._additionalAllowedCharacter === '\'')
                            tokenizer.setState(attribute_value_single_quoted_state);
                        else if (this._additionalAllowedCharacter === '>')
                            tokenizer.setState(attribute_value_unquoted_state);
                        return true;
                    }
                    function after_attribute_value_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._parseError("eof-after-attribute-value");
                            buffer.unget(data);
                            tokenizer.setState(data_state);
                        }
                        else if (isWhitespace_1.default(data)) {
                            tokenizer.setState(before_attribute_name_state);
                        }
                        else if (data === '>') {
                            tokenizer.setState(data_state);
                            tokenizer._emitCurrentToken();
                        }
                        else if (data === '/') {
                            tokenizer.setState(self_closing_tag_state);
                        }
                        else {
                            tokenizer._parseError("unexpected-character-after-attribute-value");
                            buffer.unget(data);
                            tokenizer.setState(before_attribute_name_state);
                        }
                        return true;
                    }
                    function self_closing_tag_state(buffer) {
                        var c = buffer.char();
                        if (c === InputStream_1.default.EOF) {
                            tokenizer._parseError("unexpected-eof-after-solidus-in-tag");
                            buffer.unget(c);
                            tokenizer.setState(data_state);
                        }
                        else if (c === '>') {
                            tokenizer._currentToken.selfClosing = true;
                            tokenizer.setState(data_state);
                            tokenizer._emitCurrentToken();
                        }
                        else {
                            tokenizer._parseError("unexpected-character-after-solidus-in-tag");
                            buffer.unget(c);
                            tokenizer.setState(before_attribute_name_state);
                        }
                        return true;
                    }
                    function bogus_comment_state(buffer) {
                        var data = buffer.matchUntil('>');
                        data = data.replace(/\u0000/g, "\uFFFD");
                        buffer.char();
                        tokenizer._emitToken({ type: 'Comment', data: data });
                        tokenizer.setState(data_state);
                        return true;
                    }
                    function markup_declaration_open_state(buffer) {
                        var chars = buffer.shift(2);
                        if (chars === '--') {
                            tokenizer._currentToken = { type: 'Comment', data: '' };
                            tokenizer.setState(comment_start_state);
                        }
                        else {
                            var newchars = buffer.shift(5);
                            if (newchars === InputStream_1.default.EOF || chars === InputStream_1.default.EOF) {
                                tokenizer._parseError("expected-dashes-or-doctype");
                                tokenizer.setState(bogus_comment_state);
                                buffer.unget(chars);
                                return true;
                            }
                            chars += newchars;
                            if (chars.toUpperCase() === 'DOCTYPE') {
                                tokenizer._currentToken = { type: 'Doctype', name: '', publicId: null, systemId: null, forceQuirks: false };
                                tokenizer.setState(doctype_state);
                            }
                            else if (tokenizer._tokenHandler.isCdataSectionAllowed() && chars === '[CDATA[') {
                                tokenizer.setState(cdata_section_state);
                            }
                            else {
                                tokenizer._parseError("expected-dashes-or-doctype");
                                buffer.unget(chars);
                                tokenizer.setState(bogus_comment_state);
                            }
                        }
                        return true;
                    }
                    function cdata_section_state(buffer) {
                        var data = buffer.matchUntil(']]>');
                        buffer.shift(3);
                        if (data) {
                            tokenizer._emitToken({ type: 'Characters', data: data });
                        }
                        tokenizer.setState(data_state);
                        return true;
                    }
                    function comment_start_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._parseError("eof-in-comment");
                            tokenizer._emitToken(tokenizer._currentToken);
                            buffer.unget(data);
                            tokenizer.setState(data_state);
                        }
                        else if (data === '-') {
                            tokenizer.setState(comment_start_dash_state);
                        }
                        else if (data === '>') {
                            tokenizer._parseError("incorrect-comment");
                            tokenizer._emitToken(tokenizer._currentToken);
                            tokenizer.setState(data_state);
                        }
                        else if (data === '\u0000') {
                            tokenizer._parseError("invalid-codepoint");
                            tokenizer._currentToken.data += "\uFFFD";
                        }
                        else {
                            tokenizer._currentToken.data += data;
                            tokenizer.setState(comment_state);
                        }
                        return true;
                    }
                    function comment_start_dash_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._parseError("eof-in-comment");
                            tokenizer._emitToken(tokenizer._currentToken);
                            buffer.unget(data);
                            tokenizer.setState(data_state);
                        }
                        else if (data === '-') {
                            tokenizer.setState(comment_end_state);
                        }
                        else if (data === '>') {
                            tokenizer._parseError("incorrect-comment");
                            tokenizer._emitToken(tokenizer._currentToken);
                            tokenizer.setState(data_state);
                        }
                        else if (data === '\u0000') {
                            tokenizer._parseError("invalid-codepoint");
                            tokenizer._currentToken.data += "\uFFFD";
                        }
                        else {
                            tokenizer._currentToken.data += '-' + data;
                            tokenizer.setState(comment_state);
                        }
                        return true;
                    }
                    function comment_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._parseError("eof-in-comment");
                            tokenizer._emitToken(tokenizer._currentToken);
                            buffer.unget(data);
                            tokenizer.setState(data_state);
                        }
                        else if (data === '-') {
                            tokenizer.setState(comment_end_dash_state);
                        }
                        else if (data === '\u0000') {
                            tokenizer._parseError("invalid-codepoint");
                            tokenizer._currentToken.data += "\uFFFD";
                        }
                        else {
                            tokenizer._currentToken.data += data;
                            buffer.commit();
                        }
                        return true;
                    }
                    function comment_end_dash_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._parseError("eof-in-comment-end-dash");
                            tokenizer._emitToken(tokenizer._currentToken);
                            buffer.unget(data);
                            tokenizer.setState(data_state);
                        }
                        else if (data === '-') {
                            tokenizer.setState(comment_end_state);
                        }
                        else if (data === '\u0000') {
                            tokenizer._parseError("invalid-codepoint");
                            tokenizer._currentToken.data += "-\uFFFD";
                            tokenizer.setState(comment_state);
                        }
                        else {
                            tokenizer._currentToken.data += '-' + data + buffer.matchUntil('\u0000|-');
                            buffer.char();
                        }
                        return true;
                    }
                    function comment_end_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._parseError("eof-in-comment-double-dash");
                            tokenizer._emitToken(tokenizer._currentToken);
                            buffer.unget(data);
                            tokenizer.setState(data_state);
                        }
                        else if (data === '>') {
                            tokenizer._emitToken(tokenizer._currentToken);
                            tokenizer.setState(data_state);
                        }
                        else if (data === '!') {
                            tokenizer._parseError("unexpected-bang-after-double-dash-in-comment");
                            tokenizer.setState(comment_end_bang_state);
                        }
                        else if (data === '-') {
                            tokenizer._parseError("unexpected-dash-after-double-dash-in-comment");
                            tokenizer._currentToken.data += data;
                        }
                        else if (data === '\u0000') {
                            tokenizer._parseError("invalid-codepoint");
                            tokenizer._currentToken.data += "--\uFFFD";
                            tokenizer.setState(comment_state);
                        }
                        else {
                            tokenizer._parseError("unexpected-char-in-comment");
                            tokenizer._currentToken.data += '--' + data;
                            tokenizer.setState(comment_state);
                        }
                        return true;
                    }
                    function comment_end_bang_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._parseError("eof-in-comment-end-bang-state");
                            tokenizer._emitToken(tokenizer._currentToken);
                            buffer.unget(data);
                            tokenizer.setState(data_state);
                        }
                        else if (data === '>') {
                            tokenizer._emitToken(tokenizer._currentToken);
                            tokenizer.setState(data_state);
                        }
                        else if (data === '-') {
                            tokenizer._currentToken.data += '--!';
                            tokenizer.setState(comment_end_dash_state);
                        }
                        else {
                            tokenizer._currentToken.data += '--!' + data;
                            tokenizer.setState(comment_state);
                        }
                        return true;
                    }
                    function doctype_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._parseError("expected-doctype-name-but-got-eof");
                            tokenizer._currentToken.forceQuirks = true;
                            buffer.unget(data);
                            tokenizer.setState(data_state);
                            tokenizer._emitCurrentToken();
                        }
                        else if (isWhitespace_1.default(data)) {
                            tokenizer.setState(before_doctype_name_state);
                        }
                        else {
                            tokenizer._parseError("need-space-after-doctype");
                            buffer.unget(data);
                            tokenizer.setState(before_doctype_name_state);
                        }
                        return true;
                    }
                    function before_doctype_name_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._parseError("expected-doctype-name-but-got-eof");
                            tokenizer._currentToken.forceQuirks = true;
                            buffer.unget(data);
                            tokenizer.setState(data_state);
                            tokenizer._emitCurrentToken();
                        }
                        else if (isWhitespace_1.default(data)) {
                        }
                        else if (data === '>') {
                            tokenizer._parseError("expected-doctype-name-but-got-right-bracket");
                            tokenizer._currentToken.forceQuirks = true;
                            tokenizer.setState(data_state);
                            tokenizer._emitCurrentToken();
                        }
                        else {
                            if (isAlpha_1.default(data))
                                data = data.toLowerCase();
                            tokenizer._currentToken.name = data;
                            tokenizer.setState(doctype_name_state);
                        }
                        return true;
                    }
                    function doctype_name_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._currentToken.forceQuirks = true;
                            buffer.unget(data);
                            tokenizer._parseError("eof-in-doctype-name");
                            tokenizer.setState(data_state);
                            tokenizer._emitCurrentToken();
                        }
                        else if (isWhitespace_1.default(data)) {
                            tokenizer.setState(after_doctype_name_state);
                        }
                        else if (data === '>') {
                            tokenizer.setState(data_state);
                            tokenizer._emitCurrentToken();
                        }
                        else {
                            if (isAlpha_1.default(data))
                                data = data.toLowerCase();
                            tokenizer._currentToken.name += data;
                            buffer.commit();
                        }
                        return true;
                    }
                    function after_doctype_name_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._currentToken.forceQuirks = true;
                            buffer.unget(data);
                            tokenizer._parseError("eof-in-doctype");
                            tokenizer.setState(data_state);
                            tokenizer._emitCurrentToken();
                        }
                        else if (isWhitespace_1.default(data)) {
                        }
                        else if (data === '>') {
                            tokenizer.setState(data_state);
                            tokenizer._emitCurrentToken();
                        }
                        else {
                            if (['p', 'P'].indexOf(data) > -1) {
                                var expected = [['u', 'U'], ['b', 'B'], ['l', 'L'], ['i', 'I'], ['c', 'C']];
                                var matched = expected.every(function (expected) {
                                    data = buffer.char();
                                    return expected.indexOf(data) > -1;
                                });
                                if (matched) {
                                    tokenizer.setState(after_doctype_public_keyword_state);
                                    return true;
                                }
                            }
                            else if (['s', 'S'].indexOf(data) > -1) {
                                var expected = [['y', 'Y'], ['s', 'S'], ['t', 'T'], ['e', 'E'], ['m', 'M']];
                                var matched = expected.every(function (expected) {
                                    data = buffer.char();
                                    return expected.indexOf(data) > -1;
                                });
                                if (matched) {
                                    tokenizer.setState(after_doctype_system_keyword_state);
                                    return true;
                                }
                            }
                            buffer.unget(data);
                            tokenizer._currentToken.forceQuirks = true;
                            if (data === InputStream_1.default.EOF) {
                                tokenizer._parseError("eof-in-doctype");
                                buffer.unget(data);
                                tokenizer.setState(data_state);
                                tokenizer._emitCurrentToken();
                            }
                            else {
                                tokenizer._parseError("expected-space-or-right-bracket-in-doctype", { data: data });
                                tokenizer.setState(bogus_doctype_state);
                            }
                        }
                        return true;
                    }
                    function after_doctype_public_keyword_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._parseError("eof-in-doctype");
                            tokenizer._currentToken.forceQuirks = true;
                            buffer.unget(data);
                            tokenizer.setState(data_state);
                            tokenizer._emitCurrentToken();
                        }
                        else if (isWhitespace_1.default(data)) {
                            tokenizer.setState(before_doctype_public_identifier_state);
                        }
                        else if (data === "'" || data === '"') {
                            tokenizer._parseError("unexpected-char-in-doctype");
                            buffer.unget(data);
                            tokenizer.setState(before_doctype_public_identifier_state);
                        }
                        else {
                            buffer.unget(data);
                            tokenizer.setState(before_doctype_public_identifier_state);
                        }
                        return true;
                    }
                    function before_doctype_public_identifier_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._parseError("eof-in-doctype");
                            tokenizer._currentToken.forceQuirks = true;
                            buffer.unget(data);
                            tokenizer.setState(data_state);
                            tokenizer._emitCurrentToken();
                        }
                        else if (isWhitespace_1.default(data)) {
                        }
                        else if (data === '"') {
                            tokenizer._currentToken.publicId = '';
                            tokenizer.setState(doctype_public_identifier_double_quoted_state);
                        }
                        else if (data === "'") {
                            tokenizer._currentToken.publicId = '';
                            tokenizer.setState(doctype_public_identifier_single_quoted_state);
                        }
                        else if (data === '>') {
                            tokenizer._parseError("unexpected-end-of-doctype");
                            tokenizer._currentToken.forceQuirks = true;
                            tokenizer.setState(data_state);
                            tokenizer._emitCurrentToken();
                        }
                        else {
                            tokenizer._parseError("unexpected-char-in-doctype");
                            tokenizer._currentToken.forceQuirks = true;
                            tokenizer.setState(bogus_doctype_state);
                        }
                        return true;
                    }
                    function doctype_public_identifier_double_quoted_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._parseError("eof-in-doctype");
                            tokenizer._currentToken.forceQuirks = true;
                            buffer.unget(data);
                            tokenizer.setState(data_state);
                            tokenizer._emitCurrentToken();
                        }
                        else if (data === '"') {
                            tokenizer.setState(after_doctype_public_identifier_state);
                        }
                        else if (data === '>') {
                            tokenizer._parseError("unexpected-end-of-doctype");
                            tokenizer._currentToken.forceQuirks = true;
                            tokenizer.setState(data_state);
                            tokenizer._emitCurrentToken();
                        }
                        else {
                            tokenizer._currentToken.publicId += data;
                        }
                        return true;
                    }
                    function doctype_public_identifier_single_quoted_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._parseError("eof-in-doctype");
                            tokenizer._currentToken.forceQuirks = true;
                            buffer.unget(data);
                            tokenizer.setState(data_state);
                            tokenizer._emitCurrentToken();
                        }
                        else if (data === "'") {
                            tokenizer.setState(after_doctype_public_identifier_state);
                        }
                        else if (data === '>') {
                            tokenizer._parseError("unexpected-end-of-doctype");
                            tokenizer._currentToken.forceQuirks = true;
                            tokenizer.setState(data_state);
                            tokenizer._emitCurrentToken();
                        }
                        else {
                            tokenizer._currentToken.publicId += data;
                        }
                        return true;
                    }
                    function after_doctype_public_identifier_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._parseError("eof-in-doctype");
                            tokenizer._currentToken.forceQuirks = true;
                            tokenizer._emitCurrentToken();
                            buffer.unget(data);
                            tokenizer.setState(data_state);
                        }
                        else if (isWhitespace_1.default(data)) {
                            tokenizer.setState(between_doctype_public_and_system_identifiers_state);
                        }
                        else if (data === '>') {
                            tokenizer.setState(data_state);
                            tokenizer._emitCurrentToken();
                        }
                        else if (data === '"') {
                            tokenizer._parseError("unexpected-char-in-doctype");
                            tokenizer._currentToken.systemId = '';
                            tokenizer.setState(doctype_system_identifier_double_quoted_state);
                        }
                        else if (data === "'") {
                            tokenizer._parseError("unexpected-char-in-doctype");
                            tokenizer._currentToken.systemId = '';
                            tokenizer.setState(doctype_system_identifier_single_quoted_state);
                        }
                        else {
                            tokenizer._parseError("unexpected-char-in-doctype");
                            tokenizer._currentToken.forceQuirks = true;
                            tokenizer.setState(bogus_doctype_state);
                        }
                        return true;
                    }
                    function between_doctype_public_and_system_identifiers_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._parseError("eof-in-doctype");
                            tokenizer._currentToken.forceQuirks = true;
                            tokenizer._emitCurrentToken();
                            buffer.unget(data);
                            tokenizer.setState(data_state);
                        }
                        else if (isWhitespace_1.default(data)) {
                        }
                        else if (data === '>') {
                            tokenizer._emitCurrentToken();
                            tokenizer.setState(data_state);
                        }
                        else if (data === '"') {
                            tokenizer._currentToken.systemId = '';
                            tokenizer.setState(doctype_system_identifier_double_quoted_state);
                        }
                        else if (data === "'") {
                            tokenizer._currentToken.systemId = '';
                            tokenizer.setState(doctype_system_identifier_single_quoted_state);
                        }
                        else {
                            tokenizer._parseError("unexpected-char-in-doctype");
                            tokenizer._currentToken.forceQuirks = true;
                            tokenizer.setState(bogus_doctype_state);
                        }
                        return true;
                    }
                    function after_doctype_system_keyword_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._parseError("eof-in-doctype");
                            tokenizer._currentToken.forceQuirks = true;
                            tokenizer._emitCurrentToken();
                            buffer.unget(data);
                            tokenizer.setState(data_state);
                        }
                        else if (isWhitespace_1.default(data)) {
                            tokenizer.setState(before_doctype_system_identifier_state);
                        }
                        else if (data === "'" || data === '"') {
                            tokenizer._parseError("unexpected-char-in-doctype");
                            buffer.unget(data);
                            tokenizer.setState(before_doctype_system_identifier_state);
                        }
                        else {
                            buffer.unget(data);
                            tokenizer.setState(before_doctype_system_identifier_state);
                        }
                        return true;
                    }
                    function before_doctype_system_identifier_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._parseError("eof-in-doctype");
                            tokenizer._currentToken.forceQuirks = true;
                            tokenizer._emitCurrentToken();
                            buffer.unget(data);
                            tokenizer.setState(data_state);
                        }
                        else if (isWhitespace_1.default(data)) {
                        }
                        else if (data === '"') {
                            tokenizer._currentToken.systemId = '';
                            tokenizer.setState(doctype_system_identifier_double_quoted_state);
                        }
                        else if (data === "'") {
                            tokenizer._currentToken.systemId = '';
                            tokenizer.setState(doctype_system_identifier_single_quoted_state);
                        }
                        else if (data === '>') {
                            tokenizer._parseError("unexpected-end-of-doctype");
                            tokenizer._currentToken.forceQuirks = true;
                            tokenizer._emitCurrentToken();
                            tokenizer.setState(data_state);
                        }
                        else {
                            tokenizer._parseError("unexpected-char-in-doctype");
                            tokenizer._currentToken.forceQuirks = true;
                            tokenizer.setState(bogus_doctype_state);
                        }
                        return true;
                    }
                    function doctype_system_identifier_double_quoted_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._parseError("eof-in-doctype");
                            tokenizer._currentToken.forceQuirks = true;
                            tokenizer._emitCurrentToken();
                            buffer.unget(data);
                            tokenizer.setState(data_state);
                        }
                        else if (data === '"') {
                            tokenizer.setState(after_doctype_system_identifier_state);
                        }
                        else if (data === '>') {
                            tokenizer._parseError("unexpected-end-of-doctype");
                            tokenizer._currentToken.forceQuirks = true;
                            tokenizer._emitCurrentToken();
                            tokenizer.setState(data_state);
                        }
                        else {
                            tokenizer._currentToken.systemId += data;
                        }
                        return true;
                    }
                    function doctype_system_identifier_single_quoted_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._parseError("eof-in-doctype");
                            tokenizer._currentToken.forceQuirks = true;
                            tokenizer._emitCurrentToken();
                            buffer.unget(data);
                            tokenizer.setState(data_state);
                        }
                        else if (data === "'") {
                            tokenizer.setState(after_doctype_system_identifier_state);
                        }
                        else if (data === '>') {
                            tokenizer._parseError("unexpected-end-of-doctype");
                            tokenizer._currentToken.forceQuirks = true;
                            tokenizer._emitCurrentToken();
                            tokenizer.setState(data_state);
                        }
                        else {
                            tokenizer._currentToken.systemId += data;
                        }
                        return true;
                    }
                    function after_doctype_system_identifier_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            tokenizer._parseError("eof-in-doctype");
                            tokenizer._currentToken.forceQuirks = true;
                            tokenizer._emitCurrentToken();
                            buffer.unget(data);
                            tokenizer.setState(data_state);
                        }
                        else if (isWhitespace_1.default(data)) {
                        }
                        else if (data === '>') {
                            tokenizer._emitCurrentToken();
                            tokenizer.setState(data_state);
                        }
                        else {
                            tokenizer._parseError("unexpected-char-in-doctype");
                            tokenizer.setState(bogus_doctype_state);
                        }
                        return true;
                    }
                    function bogus_doctype_state(buffer) {
                        var data = buffer.char();
                        if (data === InputStream_1.default.EOF) {
                            buffer.unget(data);
                            tokenizer._emitCurrentToken();
                            tokenizer.setState(data_state);
                        }
                        else if (data === '>') {
                            tokenizer._emitCurrentToken();
                            tokenizer.setState(data_state);
                        }
                        return true;
                    }
                };
                return Tokenizer;
            }());
            exports_1("default", Tokenizer);
        }
    };
});
