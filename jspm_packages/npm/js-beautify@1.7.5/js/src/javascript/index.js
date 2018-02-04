/* */ 
var Beautifier = require('./beautifier').Beautifier;
function js_beautify(js_source_text, options) {
  var beautifier = new Beautifier(js_source_text, options);
  return beautifier.beautify();
}
module.exports = js_beautify;
