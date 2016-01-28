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
var NodeType = {
  /**
   * A CDATA section.
   */
  CDATA: 1,
  /**
   * A run of characters.
   */
  CHARACTERS: 2,
  /**
   * A comment.
   */
  COMMENT: 3,
  /**
   * A document.
   */
  DOCUMENT: 4,
  /**
   * A document fragment.
   */
  DOCUMENT_FRAGMENT: 5,
  /**
   * A DTD.
   */
  DTD: 6,
  /**
   * An element.
   */
  ELEMENT: 7,
  /**
   * An entity.
   */
  ENTITY: 8,
  /**
   * A run of ignorable whitespace.
   */
  IGNORABLE_WHITESPACE: 9,
  /**
   * A processing instruction.
   */
  PROCESSING_INSTRUCTION: 10,
  /**
   * A skipped entity.
   */
  SKIPPED_ENTITY: 11
};

export default NodeType;