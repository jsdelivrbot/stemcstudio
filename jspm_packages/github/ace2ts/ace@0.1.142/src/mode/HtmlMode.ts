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
import {arrayToMap} from "../lib/lang";
import Annotation from "../Annotation";
import Completion from "../Completion";
import Position from "../Position";
import TextMode from "./TextMode";
import JavaScriptMode from "./JavaScriptMode";
import CssMode from "./CssMode";
import HtmlHighlightRules from "./HtmlHighlightRules";
import HtmlBehaviour from "./behaviour/HtmlBehaviour";
import HtmlFoldMode from "./folding/HtmlFoldMode";
import HtmlCompletions from "./HtmlCompletions";
import WorkerClient from "../worker/WorkerClient";
import EditSession from "../EditSession";

// http://www.w3.org/TR/html5/syntax.html#void-elements
var voidElements = ["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"];
var optionalEndTags = ["li", "dt", "dd", "p", "rt", "rp", "optgroup", "option", "colgroup", "td", "th"];

/**
 * @class HtmlMode
 * @extends TextMode
 */
export default class HtmlMode extends TextMode {
  protected blockComment = { start: "<!--", end: "-->" };
  private voidElements = arrayToMap(voidElements, 1);
  public $id = "ace/mode/html";

  /**
   * The name of the element for fragment parsing.
   */
  private fragmentContext: string;

  $completer: HtmlCompletions;

  /**
   * @class HtmlMode
   * @constructor
   * @param workerUrl {string}
   * @param scriptImports {string[]}
   * @param [options]
   */
  constructor(workerUrl: string, scriptImports: string[], options?: { fragmentContext: string }) {
    super(workerUrl, scriptImports);
    this.fragmentContext = options && options.fragmentContext;
    this.HighlightRules = HtmlHighlightRules;
    this.$behaviour = new HtmlBehaviour();
    this.$completer = new HtmlCompletions();

    var X = JavaScriptMode;

    this.createModeDelegates({
      "js-": JavaScriptMode,
      "css-": CssMode
    });

    this.foldingRules = new HtmlFoldMode(this.voidElements, arrayToMap(optionalEndTags, 1));
  }

  getNextLineIndent(state: string, line: string, tab: string): string {
    return this.$getIndent(line);
  }

  checkOutdent(state: string, line: string, text: string): boolean {
    return false;
  }

  getCompletions(state: string, session: EditSession, pos: Position, prefix: string): Completion[] {
    return this.$completer.getCompletions(state, session, pos, prefix);
  }

  createWorker(session: EditSession): WorkerClient {

    var workerUrl = this.workerUrl;
    var scriptImports = this.scriptImports;
    var mode = this;

    var worker = new WorkerClient(workerUrl);

    worker.on("initAfter", function() {
      worker.attachToDocument(session.getDocument());
      if (mode.fragmentContext) {
        worker.call("setOptions", [{ context: mode.fragmentContext }]);
      }
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

    // FIXME: Must be able to inject the module name.
    worker.init(scriptImports, 'ace-workers.js', 'HtmlWorker');

    return worker;
  };
}
