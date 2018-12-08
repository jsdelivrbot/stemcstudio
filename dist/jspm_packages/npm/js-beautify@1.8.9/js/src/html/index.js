/* */ 
'use strict';
var Beautifier = require('./beautifier').Beautifier,
    Options = require('./options').Options;
function style_html(html_source, options, js_beautify, css_beautify) {
  var beautifier = new Beautifier(html_source, options, js_beautify, css_beautify);
  return beautifier.beautify();
}
module.exports = style_html;
module.exports.defaultOptions = function() {
  return new Options();
};
