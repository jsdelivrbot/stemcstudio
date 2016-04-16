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
/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */
'use strict';

import createAnchor from "./createAnchor";
import createDocument from "./createDocument";
import createEditor from "./createEditor";
import createEditSession from "./createEditSession";
import createFold from "./createFold";
import createFoldLine from "./createFoldLine";
import createRange from "./createRange";
import createRenderer from "./createRenderer";
import createTokenizer from "./createTokenizer";
import createUndoManager from "./createUndoManager";
import createWorkerClient from "./createWorkerClient";
import createWorkspace from "./workspace/createWorkspace";

import createCssMode from "./mode/createCssMode";
import createHtmlMode from "./mode/createHtmlMode";
import createTextMode from "./mode/createTextMode";
import createJavaScriptMode from "./mode/createJavaScriptMode";
import createTypeScriptMode from "./mode/createTypeScriptMode";

import edit from "./edit";

/**
 * @module ace
 */
const ace = {

    /**
     * @property createAnchor
     * @type (doc: Document, row: number, column: number) => Anchor
     * @readOnly
     */
    get createAnchor() { return createAnchor; },

    /**
     * @property createDocument
     * @type (textOrLines: string | string[]) => Document
     * @readOnly
     */
    get createDocument() { return createDocument; },

    /**
     * @property createEditor
     * @type (renderer: Renderer, session: EditSession) => Editor
     * @readOnly
     */
    get createEditor() { return createEditor; },

    /**
     * @property createEditSession
     * @type (doc: Document) => EditSession
     * @readOnly
     */
    get createEditSession() { return createEditSession; },

    /**
     * @property createFold
     * @type (range: Range, placeholder: string) => Fold
     * @readOnly
     */
    get createFold() { return createFold; },

    /**
     * @property createFoldLine
     * @type (foldData: any, folds: Fold[]) => FoldLine
     * @readOnly
     */
    get createFoldLine() { return createFoldLine; },

    /**
     * @property createRange
     * @type (startRow: number, startColumn: number, endRow: number, endColumn: number) => Range
     * @readOnly
     */
    get createRange() { return createRange; },

    /**
     * @property createRenderer
     * @type (container: HTMLElement) => Renderer
     * @readOnly
     */
    get createRenderer() { return createRenderer; },

    /**
     * @property createTokenizer
     * @type (rules: { [name: string]: Rule[] }) => Tokenizer
     * @readOnly
     */
    get createTokenizer() { return createTokenizer; },

    /**
     * @property createUndoManager
     * @type () => UndoManager
     * @readOnly
     */
    get createUndoManager() { return createUndoManager; },

    /**
     * @property createWorkerClient
     * @type (workerUrl: string) => WorkerClient
     * @readOnly
     */
    get createWorkerClient() { return createWorkerClient; },

    /**
     * @property createWorkspace
     * @type () => Workspace
     * @readOnly
     */
    get createWorkspace() { return createWorkspace; },

    /**
     * @property edit
     * @type (container: HTMLElement) => Editor
     * @readOnly
     */
    get edit() { return edit; },

    get createCssMode() { return createCssMode; },
    get createHtmlMode() { return createHtmlMode; },
    get createTextMode() { return createTextMode; },
    get createJavaScriptMode() { return createJavaScriptMode; },
    get createTypeScriptMode() { return createTypeScriptMode; }
};

export default ace;
