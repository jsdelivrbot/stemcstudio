/* */ 
'use strict';
var anObject = require('./_an-object');
var sameValue = require('./_same-value');
var regExpExec = require('./_regexp-exec-abstract');
require('./_fix-re-wks')('search', 1, function(defined, SEARCH, $search, maybeCallNative) {
  return [function search(regexp) {
    var O = defined(this);
    var fn = regexp == undefined ? undefined : regexp[SEARCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
  }, function(regexp) {
    var res = maybeCallNative($search, regexp, this);
    if (res.done)
      return res.value;
    var rx = anObject(regexp);
    var S = String(this);
    var previousLastIndex = rx.lastIndex;
    if (!sameValue(previousLastIndex, 0))
      rx.lastIndex = 0;
    var result = regExpExec(rx, S);
    if (!sameValue(rx.lastIndex, previousLastIndex))
      rx.lastIndex = previousLastIndex;
    return result === null ? -1 : result.index;
  }];
});
