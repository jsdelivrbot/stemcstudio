/* */ 
'use strict';
var Beautifier = require('./beautifier').Beautifier,
    Options = require('./options').Options;
function css_beautify(source_text, options) {
  var beautifier = new Beautifier(source_text, options);
  return beautifier.beautify();
}
module.exports = css_beautify;
module.exports.defaultOptions = function() {
  return new Options();
};
