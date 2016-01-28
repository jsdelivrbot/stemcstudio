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
"use strict";

import TextMode from "./TextMode";
import CssHighlightRules from "./CssHighlightRules";
import MatchingBraceOutdent from "./MatchingBraceOutdent";
import WorkerClient from "../worker/WorkerClient";
import CssBehaviour from "./behaviour/CssBehaviour";
import CStyleFoldMode from "./folding/CstyleFoldMode";
import Annotation from "../Annotation";
import EditSession from "../EditSession";

/**
 * @class CssMode
 * @extends TextMode
 */
export default class CssMode extends TextMode {
  $id = "ace/mode/css";
  $outdent: MatchingBraceOutdent;
  blockComment = { start: "/*", end: "*/" };

  /**
   * @class CssMode
   * @constructor
   * @param workerUrl {string}
   * @param scriptImports {string[]}
   */
  constructor(workerUrl: string, scriptImports: string[]) {
    super(workerUrl, scriptImports);
    this.HighlightRules = CssHighlightRules;
    this.$outdent = new MatchingBraceOutdent();
    this.$behaviour = new CssBehaviour();
    this.foldingRules = new CStyleFoldMode();
  }


  getNextLineIndent(state: string, line: string, tab: string) {
    var indent = this.$getIndent(line);

    // ignore braces in comments
    var tokens = this.getTokenizer().getLineTokens(line, state).tokens;
    if (tokens.length && tokens[tokens.length - 1].type == "comment") {
      return indent;
    }

    var match = line.match(/^.*\{\s*$/);
    if (match) {
      indent += tab;
    }

    return indent;
  }

  checkOutdent(state: string, line: string, text: string): boolean {
    return this.$outdent.checkOutdent(line, text);
  }

  autoOutdent(state: string, session: EditSession, row: number): number {
    return this.$outdent.autoOutdent(session, row);
  }

  createWorker(session: EditSession): WorkerClient {

    var workerUrl = this.workerUrl;
    var scriptImports = this.scriptImports;

    var worker = new WorkerClient(workerUrl);

    worker.on("initAfter", function() {
      worker.attachToDocument(session.getDocument());
    });

    worker.on("initFail", function(message) {
    });

    worker.on('annotations', function(event: { data: Annotation[] }) {
      var annotations: Annotation[] = event.data;
      if (annotations.length > 0) {
        session.setAnnotations(annotations);
      }
      else {
        session.clearAnnotations();
      }
      session._emit("annotations", { data: annotations });
    });

    worker.on("terminate", function() {
      worker.detachFromDocument();
      session.clearAnnotations();
    });

    worker.init(scriptImports, 'ace-workers.js', 'CssWorker');

    return worker;
  }
}
