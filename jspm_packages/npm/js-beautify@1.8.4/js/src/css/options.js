/* */ 
'use strict';
var BaseOptions = require('../core/options').Options;
function Options(options) {
  BaseOptions.call(this, options, 'css');
  this.selector_separator_newline = this._get_boolean('selector_separator_newline', true);
  this.newline_between_rules = this._get_boolean('newline_between_rules', true);
  var space_around_selector_separator = this._get_boolean('space_around_selector_separator');
  this.space_around_combinator = this._get_boolean('space_around_combinator') || space_around_selector_separator;
}
Options.prototype = new BaseOptions();
module.exports.Options = Options;
