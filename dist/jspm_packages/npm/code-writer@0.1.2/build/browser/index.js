/* */ 
"format cjs";
(function(process) {
  (function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof define === 'function' && define.amd ? define(['exports'], factory) : (factory((global.CodeWriter = global.CodeWriter || {})));
  }(this, (function(exports) {
    'use strict';
    var MutablePosition = (function() {
      function MutablePosition(line, column) {
        this.line = line;
        this.column = column;
      }
      MutablePosition.prototype.offset = function(rows, cols) {
        this.line += rows;
        this.column += cols;
      };
      MutablePosition.prototype.toString = function() {
        return "[" + this.line + ", " + this.column + "]";
      };
      return MutablePosition;
    }());
    function assert(condition, message) {
      if (!condition) {
        throw new Error(message);
      }
    }
    var MutableRange = (function() {
      function MutableRange(begin, end) {
        this.begin = begin;
        this.end = end;
        assert(begin, "begin must be defined");
        assert(end, "end must be defined");
        this.begin = begin;
        this.end = end;
      }
      MutableRange.prototype.offset = function(rows, cols) {
        this.begin.offset(rows, cols);
        this.end.offset(rows, cols);
      };
      MutableRange.prototype.toString = function() {
        return this.begin + " to " + this.end;
      };
      return MutableRange;
    }());
    var Position = (function() {
      function Position(line, column) {
        this.line = line;
        this.column = column;
      }
      Position.prototype.toString = function() {
        return "[" + this.line + ", " + this.column + "]";
      };
      return Position;
    }());
    function positionComparator(a, b) {
      if (a.line < b.line) {
        return -1;
      } else if (a.line > b.line) {
        return 1;
      } else {
        if (a.column < b.column) {
          return -1;
        } else if (a.column > b.column) {
          return 1;
        } else {
          return 0;
        }
      }
    }
    var Range = (function() {
      function Range(begin, end) {
        assert(begin, "begin must be defined");
        assert(end, "end must be defined");
        this.begin = begin;
        this.end = end;
      }
      Range.prototype.toString = function() {
        return this.begin + " to " + this.end;
      };
      return Range;
    }());
    var MappingTree = (function() {
      function MappingTree(source, target, children) {
        this.children = children;
        assert(source, "source must be defined");
        assert(target, "target must be defined");
        this.source = source;
        this.target = target;
      }
      MappingTree.prototype.offset = function(rows, cols) {
        if (this.target) {
          this.target.offset(rows, cols);
        }
        if (this.children) {
          for (var _i = 0,
              _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.offset(rows, cols);
          }
        }
      };
      MappingTree.prototype.mappings = function() {
        if (this.children) {
          var maps = [];
          for (var _i = 0,
              _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            for (var _b = 0,
                _c = child.mappings(); _b < _c.length; _b++) {
              var map = _c[_b];
              maps.push(map);
            }
          }
          return maps;
        } else {
          return [{
            source: this.source,
            target: this.target
          }];
        }
      };
      return MappingTree;
    }());
    (function(IndentStyle) {
      IndentStyle[IndentStyle["None"] = 0] = "None";
      IndentStyle[IndentStyle["Block"] = 1] = "Block";
      IndentStyle[IndentStyle["Smart"] = 2] = "Smart";
    })(exports.IndentStyle || (exports.IndentStyle = {}));
    var StackElement = (function() {
      function StackElement(bMark, eMark, targetBeginLine, targetBeginColumn, trace) {
        this.bMark = bMark;
        this.eMark = eMark;
        this.texts = [];
        this.trees = [];
        this.cursor = new MutablePosition(targetBeginLine, targetBeginColumn);
      }
      StackElement.prototype.write = function(text, tree) {
        assert(typeof text === 'string', "text must be a string");
        this.texts.push(text);
        this.trees.push(tree);
        var cursor = this.cursor;
        var beginLine = cursor.line;
        var beginColumn = cursor.column;
        var endLine = cursor.line;
        var endColumn = beginColumn + text.length;
        if (tree) {
          tree.target.begin.line = beginLine;
          tree.target.begin.column = beginColumn;
          tree.target.end.line = endLine;
          tree.target.end.column = endColumn;
        }
        cursor.line = endLine;
        cursor.column = endColumn;
      };
      StackElement.prototype.snapshot = function() {
        var texts = this.texts;
        var trees = this.trees;
        var N = texts.length;
        if (N === 0) {
          return this.package('', null);
        } else {
          var sBL = Number.MAX_SAFE_INTEGER;
          var sBC = Number.MAX_SAFE_INTEGER;
          var sEL = Number.MIN_SAFE_INTEGER;
          var sEC = Number.MIN_SAFE_INTEGER;
          var tBL = Number.MAX_SAFE_INTEGER;
          var tBC = Number.MAX_SAFE_INTEGER;
          var tEL = Number.MIN_SAFE_INTEGER;
          var tEC = Number.MIN_SAFE_INTEGER;
          var children = [];
          for (var i = 0; i < N; i++) {
            var tree = trees[i];
            if (tree) {
              sBL = Math.min(sBL, tree.source.begin.line);
              sBC = Math.min(sBC, tree.source.begin.column);
              sEL = Math.max(sEL, tree.source.end.line);
              sEC = Math.max(sEC, tree.source.end.column);
              tBL = Math.min(tBL, tree.target.begin.line);
              tBC = Math.min(tBC, tree.target.begin.column);
              tEL = Math.max(tEL, tree.target.end.line);
              tEC = Math.max(tEC, tree.target.end.column);
              children.push(tree);
            }
          }
          var text = texts.join("");
          if (children.length > 1) {
            var source = new Range(new Position(sBL, sBC), new Position(sEL, sEC));
            var target = new MutableRange(new MutablePosition(tBL, tBC), new MutablePosition(tEL, tEC));
            return this.package(text, new MappingTree(source, target, children));
          } else if (children.length === 1) {
            return this.package(text, children[0]);
          } else {
            return this.package(text, null);
          }
        }
      };
      StackElement.prototype.package = function(text, tree) {
        return {
          text: text,
          tree: tree,
          targetEndLine: this.cursor.line,
          targetEndColumn: this.cursor.column
        };
      };
      StackElement.prototype.getLine = function() {
        return this.cursor.line;
      };
      StackElement.prototype.getColumn = function() {
        return this.cursor.column;
      };
      return StackElement;
    }());
    function IDXLAST(xs) {
      return xs.length - 1;
    }
    var Stack = (function() {
      function Stack(begin, end, targetLine, targetColumn, trace) {
        this.elements = [];
        this.elements.push(new StackElement(begin, end, targetLine, targetColumn, trace));
      }
      Object.defineProperty(Stack.prototype, "length", {
        get: function() {
          return this.elements.length;
        },
        enumerable: true,
        configurable: true
      });
      Stack.prototype.push = function(element) {
        this.elements.push(element);
      };
      Stack.prototype.pop = function() {
        return this.elements.pop();
      };
      Stack.prototype.write = function(text, tree) {
        this.elements[IDXLAST(this.elements)].write(text, tree);
      };
      Stack.prototype.dispose = function() {
        assert(this.elements.length === 1, "stack length should be 1");
        var textAndMappings = this.elements[IDXLAST(this.elements)].snapshot();
        this.pop();
        assert(this.elements.length === 0, "stack length should be 0");
        return textAndMappings;
      };
      Stack.prototype.getLine = function() {
        return this.elements[IDXLAST(this.elements)].getLine();
      };
      Stack.prototype.getColumn = function() {
        return this.elements[IDXLAST(this.elements)].getColumn();
      };
      return Stack;
    }());
    var CodeWriter = (function() {
      function CodeWriter(beginLine, beginColumn, options, trace) {
        if (options === void 0) {
          options = {};
        }
        if (trace === void 0) {
          trace = false;
        }
        this.options = options;
        this.trace = trace;
        this.stack = new Stack('', '', beginLine, beginColumn, trace);
      }
      CodeWriter.prototype.assign = function(text, source) {
        var target = new MutableRange(new MutablePosition(-3, -3), new MutablePosition(-3, -3));
        var tree = new MappingTree(source, target, null);
        this.stack.write(text, tree);
      };
      CodeWriter.prototype.name = function(id, source) {
        if (source) {
          var target = new MutableRange(new MutablePosition(-2, -2), new MutablePosition(-2, -2));
          var tree = new MappingTree(source, target, null);
          this.stack.write(id, tree);
        } else {
          this.stack.write(id, null);
        }
      };
      CodeWriter.prototype.num = function(text, source) {
        if (source) {
          var target = new MutableRange(new MutablePosition(-3, -3), new MutablePosition(-3, -3));
          var tree = new MappingTree(source, target, null);
          this.stack.write(text, tree);
        } else {
          this.stack.write(text, null);
        }
      };
      CodeWriter.prototype.str = function(text, source) {
        if (source) {
          var target = new MutableRange(new MutablePosition(-23, -23), new MutablePosition(-23, -23));
          var tree = new MappingTree(source, target, null);
          this.stack.write(text, tree);
        } else {
          this.stack.write(text, null);
        }
      };
      CodeWriter.prototype.write = function(text, tree) {
        this.stack.write(text, tree);
      };
      CodeWriter.prototype.snapshot = function() {
        assert(this.stack.length === 1, "stack length is not zero");
        return this.stack.dispose();
      };
      CodeWriter.prototype.binOp = function(binOp, source) {
        var target = new MutableRange(new MutablePosition(-5, -5), new MutablePosition(-5, -5));
        var tree = new MappingTree(source, target, null);
        if (this.options.insertSpaceBeforeAndAfterBinaryOperators) {
          this.space();
          this.stack.write(binOp, tree);
          this.space();
        } else {
          this.stack.write(binOp, tree);
        }
      };
      CodeWriter.prototype.comma = function(begin, end) {
        if (begin && end) {
          var source = new Range(begin, end);
          var target = new MutableRange(new MutablePosition(-4, -4), new MutablePosition(-4, -4));
          var tree = new MappingTree(source, target, null);
          this.stack.write(',', tree);
        } else {
          this.stack.write(',', null);
        }
        if (this.options.insertSpaceAfterCommaDelimiter) {
          this.stack.write(' ', null);
        }
      };
      CodeWriter.prototype.space = function() {
        this.stack.write(' ', null);
      };
      CodeWriter.prototype.beginBlock = function() {
        this.prolog('{', '}');
      };
      CodeWriter.prototype.endBlock = function() {
        this.epilog(false);
      };
      CodeWriter.prototype.beginBracket = function() {
        this.prolog('[', ']');
      };
      CodeWriter.prototype.endBracket = function() {
        this.epilog(this.options.insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets);
      };
      CodeWriter.prototype.beginObject = function() {
        this.prolog('{', '}');
      };
      CodeWriter.prototype.endObject = function() {
        this.epilog(this.options.insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces);
      };
      CodeWriter.prototype.openParen = function() {
        this.prolog('(', ')');
      };
      CodeWriter.prototype.closeParen = function() {
        this.epilog(this.options.insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis);
      };
      CodeWriter.prototype.beginQuote = function() {
        this.prolog("'", "'");
      };
      CodeWriter.prototype.endQuote = function() {
        this.epilog(false);
      };
      CodeWriter.prototype.beginStatement = function() {
        this.prolog('', ';');
      };
      CodeWriter.prototype.endStatement = function() {
        this.epilog(false);
      };
      CodeWriter.prototype.prolog = function(bMark, eMark) {
        var line = this.stack.getLine();
        var column = this.stack.getColumn();
        this.stack.push(new StackElement(bMark, eMark, line, column, this.trace));
      };
      CodeWriter.prototype.epilog = function(insertSpaceAfterOpeningAndBeforeClosingNonempty) {
        var popped = this.stack.pop();
        var textAndMappings = popped.snapshot();
        var text = textAndMappings.text;
        var tree = textAndMappings.tree;
        if (text.length > 0 && insertSpaceAfterOpeningAndBeforeClosingNonempty) {
          this.write(popped.bMark, null);
          this.space();
          var rows = 0;
          var cols = popped.bMark.length + 1;
          if (tree) {
            tree.offset(rows, cols);
          }
          this.write(text, tree);
          this.space();
          this.write(popped.eMark, null);
        } else {
          this.write(popped.bMark, null);
          var rows = 0;
          var cols = popped.bMark.length;
          if (tree) {
            tree.offset(rows, cols);
          }
          this.write(text, tree);
          this.write(popped.eMark, null);
        }
      };
      return CodeWriter;
    }());
    exports.MutablePosition = MutablePosition;
    exports.MutableRange = MutableRange;
    exports.Position = Position;
    exports.positionComparator = positionComparator;
    exports.Range = Range;
    exports.MappingTree = MappingTree;
    exports.CodeWriter = CodeWriter;
    Object.defineProperty(exports, '__esModule', {value: true});
  })));
})(require('process'));
