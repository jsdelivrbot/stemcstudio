/* */ 
"use strict";
var async_1 = require('../scheduler/async');
var debounceTime_1 = require('../operators/debounceTime');
function debounceTime(dueTime, scheduler) {
  if (scheduler === void 0) {
    scheduler = async_1.async;
  }
  return debounceTime_1.debounceTime(dueTime, scheduler)(this);
}
exports.debounceTime = debounceTime;
