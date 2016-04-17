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

// FIXME: For some reason the generated file causes a breakage in the mouse/mouse_handler_test
import BlockComment from './BlockComment';
import Completion from "../Completion";
import Position from "../Position";
import Tokenizer from "../Tokenizer";
import TextHighlightRules from "./TextHighlightRules";
import Behaviour from "./Behaviour";
import BehaviourCallback from "../BehaviourCallback";
import FoldMode from './folding/FoldMode';
import {packages} from "../unicode";
import {escapeRegExp} from "../lib/lang";
import TokenIterator from "../TokenIterator";
import Range from "../Range";
import TextAndSelection from "./TextAndSelection";
import EditSession from '../EditSession';
import Editor from '../Editor';
import WorkerClient from "../worker/WorkerClient";
import LanguageMode from '../LanguageMode';

/**
 * @class TextMode
 */
export default class TextMode implements LanguageMode {
  /**
   * Used when loading snippets for zero or more modes?
   * @property modes
   * @type LanguageMode[]
   */
  public modes: LanguageMode[];
  protected HighlightRules: any = TextHighlightRules;
  protected $behaviour = new Behaviour();

  /**
   * @property tokenRe
   * @type RegExp
   */
  public tokenRe = new RegExp("^["
    + packages.L
    + packages.Mn + packages.Mc
    + packages.Nd
    + packages.Pc + "\\$_]+", "g"
  );

  /**
   * @property nonTokenRe
   * @type RegExp
   */
  public nonTokenRe = new RegExp("^(?:[^"
    + packages.L
    + packages.Mn + packages.Mc
    + packages.Nd
    + packages.Pc + "\\$_]|\\s])+", "g"
  );

  protected lineCommentStart: string | string[] = "";
  protected blockComment: BlockComment;
  public $id = "ace/mode/text";
  private $tokenizer: Tokenizer;
  private $highlightRules: any;
  private $keywordList: string[];
  private $embeds: string[];
  private $modes: { [path: string]: LanguageMode };
  private completionKeywords: string[];
  public $indentWithTabs: boolean;
  public foldingRules: FoldMode;
  public getMatching: (session: EditSession) => Range;

  /**
   * @property workerUrl
   * @type string
   * @protected
   */
  protected workerUrl: string;

  /**
   * @property scriptImports
   * @type string[]
   * @protected
   */
  protected scriptImports: string[] = [];

  /**
   * @class TextMode
   * @constructor
   * @param workerUrl {string}
   */
  constructor(workerUrl: string, scriptImports: string[]) {
    if (typeof workerUrl === 'string') {
      this.workerUrl = workerUrl;
    }
    else {
      throw new TypeError("workerUrl must be a string.");
    }
    this.scriptImports = scriptImports;
  }

  /**
   * @method getTokenizer
   * @return {Tokenizer}
   */
  getTokenizer(): Tokenizer {
    if (!this.$tokenizer) {
      this.$highlightRules = this.$highlightRules || new this.HighlightRules();
      this.$tokenizer = new Tokenizer(this.$highlightRules.getRules());
    }
    return this.$tokenizer;
  }

  /**
   * @method toggleCommentLines
   * @param state {string}
   * @param session {EditSession}
   * @param startRow {number}
   * @param endRow {number}
   * @return {boolean}
   */
  public toggleCommentLines(state: string, session: EditSession, startRow: number, endRow: number): boolean {
    var doc = session.doc;

    var ignoreBlankLines = true;
    var shouldRemove = true;
    var minIndent = Infinity;
    var tabSize = session.getTabSize();
    var insertAtTabStop = false;

    if (!this.lineCommentStart) {
      if (!this.blockComment)
        return false;
      var lineCommentStart = this.blockComment.start;
      var lineCommentEnd = this.blockComment.end;
      var regexpStart = new RegExp("^(\\s*)(?:" + escapeRegExp(lineCommentStart) + ")");
      var regexpEnd = new RegExp("(?:" + escapeRegExp(lineCommentEnd) + ")\\s*$");

      var comment = function(line: string, i: number) {
        if (testRemove(line, i))
          return;
        if (!ignoreBlankLines || /\S/.test(line)) {
          doc.insertInLine({ row: i, column: line.length }, lineCommentEnd);
          doc.insertInLine({ row: i, column: minIndent }, lineCommentStart);
        }
      };

      var uncomment = function(line: string, i: number) {
        var m;
        if (m = line.match(regexpEnd))
          doc.removeInLine(i, line.length - m[0].length, line.length);
        if (m = line.match(regexpStart))
          doc.removeInLine(i, m[1].length, m[0].length);
      };

      var testRemove = function(line: string, row: number) {
        if (regexpStart.test(line))
          return true;
        var tokens = session.getTokens(row);
        for (var i = 0; i < tokens.length; i++) {
          if (tokens[i].type === 'comment')
            return true;
        }
      };
    }
    else {
      if (Array.isArray(this.lineCommentStart)) {
        var regexpStartString: string = (<string[]>this.lineCommentStart).map(escapeRegExp).join("|");
        lineCommentStart = (<string[]>this.lineCommentStart)[0];
      }
      else {
        var regexpStartString: string = escapeRegExp(<string>this.lineCommentStart);
        lineCommentStart = <string>this.lineCommentStart;
      }
      regexpStart = new RegExp("^(\\s*)(?:" + regexpStartString + ") ?");

      insertAtTabStop = session.getUseSoftTabs();

      var uncomment = function(line: string, i: number) {
        var m = line.match(regexpStart);
        if (!m) return;
        var start = m[1].length, end = m[0].length;
        if (!shouldInsertSpace(line, start, end) && m[0][end - 1] == " ")
          end--;
        doc.removeInLine(i, start, end);
      };
      var commentWithSpace = lineCommentStart + " ";
      var comment = function(line: string, i: number) {
        if (!ignoreBlankLines || /\S/.test(line)) {
          if (shouldInsertSpace(line, minIndent, minIndent))
            doc.insertInLine({ row: i, column: minIndent }, commentWithSpace);
          else
            doc.insertInLine({ row: i, column: minIndent }, lineCommentStart);
        }
      };
      var testRemove = function(line: string, i: number) {
        return regexpStart.test(line);
      };

      var shouldInsertSpace = function(line: string, before: number, after: number) {
        var spaces = 0;
        while (before-- && line.charAt(before) == " ")
          spaces++;
        if (spaces % tabSize != 0)
          return false;
        var spaces = 0;
        while (line.charAt(after++) == " ")
          spaces++;
        if (tabSize > 2)
          return spaces % tabSize != tabSize - 1;
        else
          return spaces % tabSize == 0;
      };
    }

    function iter(fun) {
      for (var i = startRow; i <= endRow; i++)
        fun(doc.getLine(i), i);
    }


    var minEmptyLength = Infinity;
    iter(function(line: string, row: number) {
      var indent = line.search(/\S/);
      if (indent !== -1) {
        if (indent < minIndent)
          minIndent = indent;
        if (shouldRemove && !testRemove(line, row))
          shouldRemove = false;
      } else if (minEmptyLength > line.length) {
        minEmptyLength = line.length;
      }
    });

    if (minIndent == Infinity) {
      minIndent = minEmptyLength;
      ignoreBlankLines = false;
      shouldRemove = false;
    }

    if (insertAtTabStop && minIndent % tabSize != 0)
      minIndent = Math.floor(minIndent / tabSize) * tabSize;

    iter(shouldRemove ? uncomment : comment);
  }

  /**
   * @method toggleBlockComment
   * @param state {string}
   * @param session {EditSession}
   * @param range {Range}
   * @param cirsor {Position}
   * @return {void}
   */
  toggleBlockComment(state: string, session: EditSession, range: Range, cursor: Position): void {
    var comment = this.blockComment;
    if (!comment)
      return;
    if (!comment.start && comment[0])
      comment = comment[0];

    var iterator = new TokenIterator(session, cursor.row, cursor.column);
    var token = iterator.getCurrentToken();

    var selection = session.getSelection();
    var initialRange = selection.toOrientedRange();
    var startRow, colDiff;

    if (token && /comment/.test(token.type)) {
      var startRange, endRange;
      while (token && /comment/.test(token.type)) {
        var i = token.value.indexOf(comment.start);
        if (i != -1) {
          var row = iterator.getCurrentTokenRow();
          var column = iterator.getCurrentTokenColumn() + i;
          startRange = new Range(row, column, row, column + comment.start.length);
          break;
        }
        token = iterator.stepBackward();
      }

      var iterator = new TokenIterator(session, cursor.row, cursor.column);
      var token = iterator.getCurrentToken();
      while (token && /comment/.test(token.type)) {
        var i = token.value.indexOf(comment.end);
        if (i != -1) {
          var row = iterator.getCurrentTokenRow();
          var column = iterator.getCurrentTokenColumn() + i;
          endRange = new Range(row, column, row, column + comment.end.length);
          break;
        }
        token = iterator.stepForward();
      }
      if (endRange)
        session.remove(endRange);
      if (startRange) {
        session.remove(startRange);
        startRow = startRange.start.row;
        colDiff = -comment.start.length;
      }
    } else {
      colDiff = comment.start.length;
      startRow = range.start.row;
      session.insert(range.end, comment.end);
      session.insert(range.start, comment.start);
    }
    // todo: selection should have ended up in the right place automatically!
    if (initialRange.start.row == startRow)
      initialRange.start.column += colDiff;
    if (initialRange.end.row == startRow)
      initialRange.end.column += colDiff;
    session.getSelection().fromOrientedRange(initialRange);
  }

  /**
   * @method getNextLineIndent
   * @param state {string}
   * @param line {string}
   * @param tab {string}
   * @return {string}
   */
  getNextLineIndent(state: string, line: string, tab: string): string {
    return this.$getIndent(line);
  }

  checkOutdent(state: string, line: string, text: string): boolean {
    return false;
  }

  autoOutdent(state: string, session: EditSession, row: number): number {
    return 0;
  }

  // FIXME: This should be standalone method.
  $getIndent(line: string): string {
    return line.match(/^\s*/)[0];
  }

  /**
   * @method createWorker
   * @param session {EditSession}
   * @return {WorkerClient}
   */
  createWorker(session: EditSession): WorkerClient {
    return void 0;
  }

  createModeDelegates(mapping: { [prefix: string]: any }) {
    this.$embeds = [];
    this.$modes = {};
    for (var p in mapping) {
      if (mapping[p]) {
        this.$embeds.push(p);
        // May not be ideal that we have to assume the same construction
        // parameters for delegates but it should work most of the time.
        // Leave it this way for now.
        this.$modes[p] = new mapping[p](this.workerUrl, this.scriptImports);
      }
    }

    var delegations = ['toggleBlockComment', 'toggleCommentLines', 'getNextLineIndent',
      'checkOutdent', 'autoOutdent', 'transformAction', 'getCompletions'];

    for (var k = 0; k < delegations.length; k++) {
      (function(scope) {
        var functionName = delegations[k];
        var defaultHandler = scope[functionName];
        scope[delegations[k]] = function() {
          return this.$delegator(functionName, arguments, defaultHandler);
        };
      } (this));
    }
  }

  $delegator(method, args, defaultHandler) {
    var state = args[0];
    if (typeof state != "string")
      state = state[0];
    for (var i = 0; i < this.$embeds.length; i++) {
      if (!this.$modes[this.$embeds[i]]) continue;

      var split = state.split(this.$embeds[i]);
      if (!split[0] && split[1]) {
        args[0] = split[1];
        var mode = this.$modes[this.$embeds[i]];
        return mode[method].apply(mode, args);
      }
    }
    var ret = defaultHandler.apply(this, args);
    return defaultHandler ? ret : undefined;
  }

  /**
   * This method is called by the Editor.
   *
   * @method transformAction
   * @param state {string}
   * @param action {string}
   * @param editor {Editor}
   * @param session {EditSession}
   * @param param {any} This will usually be a Range or a text string.
   * @return {any} This will usually be a Range or an object: {text: string; selection: number[]}
   */
  // TODO: May be able to make this type-safe by separating cases where param is string from Range.
  // string => {text: string; selection: number[]} (This corresponds to the insert operation)
  // Range  => Range                               (This corresponds to the remove operation)
  transformAction(state: string, action: string, editor: Editor, session: EditSession, param: string | Range): TextAndSelection | Range {
    if (this.$behaviour) {
      var behaviours = this.$behaviour.getBehaviours();
      for (var key in behaviours) {
        if (behaviours[key][action]) {
          // FIXME: Make this type-safe?
          //var callback: BehaviourCallback = behaviours[key][action];
          //var transformed = callback(state, action, editor, session, unused);
          var ret = behaviours[key][action].apply(this, arguments);
          if (ret) {
            return ret;
          }
        }
      }
    }
  }

  getKeywords(append: boolean): string[] {
    // this is for autocompletion to pick up regexp'ed keywords
    if (!this.completionKeywords) {

      var rules = this.$tokenizer.states;
      var completionKeywords: string[] = [];
      for (var rule in rules) {
        var ruleItr = rules[rule];
        for (var r = 0, l = ruleItr.length; r < l; r++) {
          if (typeof ruleItr[r].token === "string") {
            if (/keyword|support|storage/.test(ruleItr[r].token))
              completionKeywords.push(ruleItr[r].regex);
          }
          else if (typeof ruleItr[r].token === "object") {
            for (var a = 0, aLength = ruleItr[r].token.length; a < aLength; a++) {
              if (/keyword|support|storage/.test(ruleItr[r].token[a])) {
                // drop surrounding parens
                var matched: string = ruleItr[r].regex.match(/\(.+?\)/g)[a];
                completionKeywords.push(matched.substr(1, matched.length - 2));
              }
            }
          }
        }
      }
      this.completionKeywords = completionKeywords;
    }
    // this is for highlighting embed rules, like HAML/Ruby or Obj-C/C
    if (!append) {
      return this.$keywordList;
    }
    return completionKeywords.concat(this.$keywordList || []);
  }

  $createKeywordList(): string[] {
    if (!this.$highlightRules)
      this.getTokenizer();
    return this.$keywordList = this.$highlightRules.$keywordList || [];
  }

  getCompletions(state: string, session: EditSession, pos: Position, prefix: string): Completion[] {
    var keywords: string[] = this.$keywordList || this.$createKeywordList();
    return keywords.map(function(word: string) {
      return {
        name: word,
        value: word,
        score: 0,
        meta: "keyword"
      };
    });
  }
}
