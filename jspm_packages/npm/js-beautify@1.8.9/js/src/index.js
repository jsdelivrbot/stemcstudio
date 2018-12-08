/* */ 
'use strict';
var js_beautify = require('./javascript/index');
var css_beautify = require('./css/index');
var html_beautify = require('./html/index');
function style_html(html_source, options, js, css) {
  js = js || js_beautify;
  css = css || css_beautify;
  return html_beautify(html_source, options, js, css);
}
style_html.defaultOptions = html_beautify.defaultOptions;
module.exports.js = js_beautify;
module.exports.css = css_beautify;
module.exports.html = style_html;
