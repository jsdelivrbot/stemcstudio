/* */ 
'use strict';
var Beautifier = require('./beautifier').Beautifier,
    Options = require('./options').Options;
function js_beautify(js_source_text, options) {
  var beautifier = new Beautifier(js_source_text, options);
  return beautifier.beautify();
}
module.exports = js_beautify;
module.exports.defaultOptions = function() {
  return new Options();
};
