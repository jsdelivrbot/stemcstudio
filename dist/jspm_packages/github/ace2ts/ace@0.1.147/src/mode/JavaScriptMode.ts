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

import {inherits} from "../lib/oop";
import Annotation from "../Annotation";
import TextMode from "./TextMode";
import JavaScriptHighlightRules from "./JavaScriptHighlightRules";
import MatchingBraceOutdent from "./MatchingBraceOutdent";
import Range from "../Range";
import WorkerClient from "../worker/WorkerClient";
import CstyleBehaviour from "./behaviour/CstyleBehaviour";
import CStyleFoldMode from "./folding/CstyleFoldMode";
import EditSession from "../EditSession";

/**
 * @class JavaScriptMode
 * @extends TextMode
 */
export default class JavaScriptMode extends TextMode {
  $outdent: MatchingBraceOutdent;
  blockComment: { start: string; end: string };

  /**
   * @class JavaScriptMode
   * @constructor
   * @param workerUrl {string}
   * @param scriptImports: {string[]}
   */
  constructor(workerUrl: string, scriptImports: string[]) {
    super(workerUrl, scriptImports);
    // The Tokenizer will be built using these rules.
    this.HighlightRules = JavaScriptHighlightRules;

    this.$outdent = new MatchingBraceOutdent();
    this.$behaviour = new CstyleBehaviour();
    this.foldingRules = new CStyleFoldMode();
    this.lineCommentStart = "//";
    this.blockComment = { start: "/*", end: "*/" };

    this.$id = "ace/mode/javascript";
  }

  /**
   * @method getNextLineIndent
   * @param state {string}
   * @param line {string}
   * @param tab {string}
   * @return {string}
   */
  getNextLineIndent(state: string, line: string, tab: string): string {
    var indent = this.$getIndent(line);

    var tokenizedLine = this.getTokenizer().getLineTokens(line, state);
    var tokens = tokenizedLine.tokens;
    var endState = tokenizedLine.state;

    // If the type of the last token is a comment, there is no change of indentation.
    if (tokens.length && tokens[tokens.length - 1].type === "comment") {
      return indent;
    }

    if (state === "start" || state === "no_regex") {
      // Indent for case statements or things like opening braces.
      var match = line.match(/^.*(?:\bcase\b.*\:|[\{\(\[])\s*$/);
      if (match) {
        indent += tab;
      }
    }
    else if (state === "doc-start") {
      if (endState == "start" || endState == "no_regex") {
        return "";
      }
      // Indent for block comments.
      var match = line.match(/^\s*(\/?)\*/);
      if (match) {
        if (match[1]) {
          indent += " ";
        }
        indent += "* ";
      }
    }

    return indent;
  }

  checkOutdent(state: string, line: string, text: string): boolean {
    return this.$outdent.checkOutdent(line, text);
  };

  autoOutdent(state: string, session: EditSession, row: number): number {
    return this.$outdent.autoOutdent(session, row);
  };

  /**
   * @method createWorker
   * @param session {EditSession}
   * @return {WorkerClient}
   */
  createWorker(session: EditSession): WorkerClient {

    var worker = new WorkerClient(this.workerUrl);

    worker.on("initAfter", function() {
      worker.attachToDocument(session.getDocument());
    });

    worker.on("initFailed", function(event: MessageEvent) {
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

    // FIXME: Must be able to inject the module name.
    worker.init(this.scriptImports, 'ace-workers.js', 'JavaScriptWorker');

    return worker;
  }
}
