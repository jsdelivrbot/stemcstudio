/* */ 
'use strict';
require('./es6.regexp.exec');
var redefine = require('./_redefine');
var hide = require('./_hide');
var fails = require('./_fails');
var defined = require('./_defined');
var wks = require('./_wks');
var regexpExec = require('./_regexp-exec');
var SPECIES = wks('species');
var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function() {
  var re = /./;
  re.exec = function() {
    var result = [];
    result.groups = {a: '7'};
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});
var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function() {
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function() {
    return originalExec.apply(this, arguments);
  };
  var result = 'ab'.split(re);
  return result.length === 2 && result[0] === 'a' && result[1] === 'b';
})();
module.exports = function(KEY, length, exec) {
  var SYMBOL = wks(KEY);
  var DELEGATES_TO_SYMBOL = !fails(function() {
    var O = {};
    O[SYMBOL] = function() {
      return 7;
    };
    return ''[KEY](O) != 7;
  });
  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !fails(function() {
    var execCalled = false;
    var re = /a/;
    re.exec = function() {
      execCalled = true;
      return null;
    };
    if (KEY === 'split') {
      re.constructor = {};
      re.constructor[SPECIES] = function() {
        return re;
      };
    }
    re[SYMBOL]('');
    return !execCalled;
  }) : undefined;
  if (!DELEGATES_TO_SYMBOL || !DELEGATES_TO_EXEC || (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) || (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)) {
    var nativeRegExpMethod = /./[SYMBOL];
    var fns = exec(defined, SYMBOL, ''[KEY], function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
      if (regexp.exec === regexpExec) {
        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
          return {
            done: true,
            value: nativeRegExpMethod.call(regexp, str, arg2)
          };
        }
        return {
          done: true,
          value: nativeMethod.call(str, regexp, arg2)
        };
      }
      return {done: false};
    });
    var strfn = fns[0];
    var rxfn = fns[1];
    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2 ? function(string, arg) {
      return rxfn.call(string, this, arg);
    } : function(string) {
      return rxfn.call(string, this);
    });
  }
};
