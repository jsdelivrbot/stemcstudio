/* */ 
"use strict";
var retry_1 = require('../operators/retry');
function retry(count) {
  if (count === void 0) {
    count = -1;
  }
  return retry_1.retry(count)(this);
}
exports.retry = retry;
