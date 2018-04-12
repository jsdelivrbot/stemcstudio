/* */ 
'use strict';
var $export = require('./_export');
var toObject = require('./_to-object');
var aFunction = require('./_a-function');
var $defineProperty = require('./_object-dp');
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {__defineSetter__: function __defineSetter__(P, setter) {
    $defineProperty.f(toObject(this), P, {
      set: aFunction(setter),
      enumerable: true,
      configurable: true
    });
  }});
