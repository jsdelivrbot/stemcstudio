/* ***** BEGIN LICENSE BLOCK *****
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2016 David Geo Holmes <david.geo.holmes@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * ***** END LICENSE BLOCK ***** */
import SAXTreeBuilder from './SAXTreeBuilder';
import Tokenizer from './Tokenizer';
import TreeParser from './TreeParser';

export default class SAXParser {
    contentHandler;
    private _errorHandler;
    private _treeBuilder: SAXTreeBuilder;
    private _tokenizer: Tokenizer;
    private _scriptingEnabled: boolean;
    constructor() {
        this.contentHandler = null;
        this._errorHandler = null;
        this._treeBuilder = new SAXTreeBuilder();
        this._tokenizer = new Tokenizer(this._treeBuilder);
        this._scriptingEnabled = false;

    }
    parseFragment(source, context) {
        this._treeBuilder.setFragmentContext(context);
        this._tokenizer.tokenize(source);
        var fragment = this._treeBuilder.getFragment();
        if (fragment) {
            new TreeParser(this.contentHandler).parse(fragment);
        }
    }

    parse(source) {
        this._tokenizer.tokenize(source);
        var document = this._treeBuilder.document;
        if (document) {
            new TreeParser(this.contentHandler).parse(document);
        }
    }

    get scriptingEnabled(): boolean {
        return this._scriptingEnabled;
    }
    set scriptingEnabled(scriptingEnabled: boolean) {
        this._scriptingEnabled = scriptingEnabled;
        this._treeBuilder.scriptingEnabled = scriptingEnabled;
    }

    get errorHandler() {
        return this._errorHandler;
    }
    set errorHandler(errorHandler) {
        this._errorHandler = errorHandler;
        this._treeBuilder.errorHandler = errorHandler;
    }
}
