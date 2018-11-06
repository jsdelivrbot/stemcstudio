/* */ 
'use strict';
var BaseOptions = require('../core/options').Options;
var validPositionValues = ['before-newline', 'after-newline', 'preserve-newline'];
function Options(options) {
  BaseOptions.call(this, options, 'js');
  var raw_brace_style = this.raw_options.brace_style || null;
  if (raw_brace_style === "expand-strict") {
    this.raw_options.brace_style = "expand";
  } else if (raw_brace_style === "collapse-preserve-inline") {
    this.raw_options.brace_style = "collapse,preserve-inline";
  } else if (this.raw_options.braces_on_own_line !== undefined) {
    this.raw_options.brace_style = this.raw_options.braces_on_own_line ? "expand" : "collapse";
  }
  var brace_style_split = this._get_selection_list('brace_style', ['collapse', 'expand', 'end-expand', 'none', 'preserve-inline']);
  this.brace_preserve_inline = false;
  this.brace_style = "collapse";
  for (var bs = 0; bs < brace_style_split.length; bs++) {
    if (brace_style_split[bs] === "preserve-inline") {
      this.brace_preserve_inline = true;
    } else {
      this.brace_style = brace_style_split[bs];
    }
  }
  this.unindent_chained_methods = this._get_boolean('unindent_chained_methods');
  this.break_chained_methods = this._get_boolean('break_chained_methods');
  this.space_in_paren = this._get_boolean('space_in_paren');
  this.space_in_empty_paren = this._get_boolean('space_in_empty_paren');
  this.jslint_happy = this._get_boolean('jslint_happy');
  this.space_after_anon_function = this._get_boolean('space_after_anon_function');
  this.space_after_named_function = this._get_boolean('space_after_named_function');
  this.keep_array_indentation = this._get_boolean('keep_array_indentation');
  this.space_before_conditional = this._get_boolean('space_before_conditional', true);
  this.unescape_strings = this._get_boolean('unescape_strings');
  this.e4x = this._get_boolean('e4x');
  this.comma_first = this._get_boolean('comma_first');
  this.operator_position = this._get_selection('operator_position', validPositionValues);
  this.test_output_raw = this._get_boolean('test_output_raw');
  if (this.jslint_happy) {
    this.space_after_anon_function = true;
  }
}
Options.prototype = new BaseOptions();
module.exports.Options = Options;
