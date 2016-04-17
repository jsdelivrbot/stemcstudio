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
"use strict";

import Completion from "./Completion";
import Editor from "./Editor";
import EditSession from "./EditSession";
import Position from "./Position";
import Range from "./Range";
import TextAndSelection from "./TextAndSelection";
import Tokenizer from "./Tokenizer";
import WorkerClient from "./worker/WorkerClient";
import FoldMode from "./mode/folding/FoldMode"

/**
 * @class LanguageMode
 */
interface LanguageMode {

  /**
   * @property $id
   * @type string
   */
  $id: string;

  /**
   * @property indentWithTabs
   * @type boolean
   */
  $indentWithTabs: boolean;

  /**
   * @property foldingRules
   * @type FoldMode
   */
  foldingRules: FoldMode;

  /**
   * @property modes
   * @type LanguageMode[]
   */
  modes: LanguageMode[];

  /**
   * @property nonTokenRe
   * @type RegExp;
   */
  nonTokenRe: RegExp;

  /**
   * @property tokenRe
   * @type RegExp;
   */
  tokenRe: RegExp;

  /**
   * @method autoOutdent
   * @param state {string}
   * @param session {EditSession}
   * @param row {number}
   * @return {number}
   */
  autoOutdent(state: string, session: EditSession, row: number): number;

  /**
   * @method checkOutdent
   * @param state {string}
   * @param line {string}
   * @param text {string}
   * @return {boolean}
   */
  checkOutdent(state: string, line: string, text: string): boolean;

  /**
   * @method createWorker
   * @param session {EditSession}
   * @return {WorkerClient}
   */
  createWorker(session: EditSession): WorkerClient;

  /**
   * @method getCompletions
   * @param state {string}
   * @param session {EditSession}
   * @param position {Position}
   * @param prefix {string}
   * @return {Completion[]}
   */
  getCompletions(state: string, session: EditSession, position: Position, prefix: string): Completion[];

  /**
   * @method getMatching
   * @param session {EditSession}
   * @return {Range}
   */
  getMatching(session: EditSession): Range;

  /**
   * @method getNextLineIndent
   * @param state {string}
   * @param line {string}
   * @param tab {string}
   * @return {string}
   */
  getNextLineIndent(state: string, line: string, tab: string): string;

  /**
   * @method getTokenizer
   * @return {Tokenizer}
   */
  getTokenizer(): Tokenizer;

  /**
   * @method toggleCommentLines
   * @param state {string}
   * @param session {EditSession}
   * @param startRow {number}
   * @param endRow {number}
   * @return {boolean}
   */
  toggleCommentLines(state: string, session: EditSession, startRow: number, endRow: number): boolean;

  /**
   * @method toggleBlockComment
   * @param state {string}
   * @param session {EditSession}
   * @param range {Range}
   * @param cursor {Position}
   * @return {void}
   */
  toggleBlockComment(state: string, session: EditSession, range: Range, cursor: Position): void;

  /**
   * @method transformAction
   * @param state {string}
   * @param action {string}
   * @param editor {Editor}
   * @param session {EditSession}
   * @param data {string | Range}
   * @return {TextAndSelection | Range}
   */
  transformAction(state: string, action: string, editor: Editor, session: EditSession, data: string | Range): TextAndSelection | Range;
}

export default LanguageMode;