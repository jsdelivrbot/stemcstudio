/* */ 
"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var tree_1 = require('../common/tree');
function splitSourceTextIntoLines(sourceText) {
  var lines = [];
  if (sourceText.substr(tree_1.IDXLAST(sourceText), 1) !== "\n") {
    sourceText += "\n";
  }
  var pieces = sourceText.split("\n");
  var N = pieces.length;
  for (var i = 0; i < N; ++i) {
    var line = pieces[i] + ((i === tree_1.IDXLAST(pieces)) ? "" : "\n");
    lines.push(line);
  }
  return lines;
}
exports.splitSourceTextIntoLines = splitSourceTextIntoLines;
