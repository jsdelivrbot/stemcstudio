/* */ 
var Beautifier = require('./beautifier').Beautifier;
function css_beautify(source_text, options) {
  var beautifier = new Beautifier(source_text, options);
  return beautifier.beautify();
}
module.exports = css_beautify;
