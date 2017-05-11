/* */ 
"use strict";
var multicast_1 = require('./multicast');
var ReplaySubject_1 = require('../ReplaySubject');
function shareReplay(bufferSize, windowTime, scheduler) {
  var subject;
  var connectable = multicast_1.multicast.call(this, function shareReplaySubjectFactory() {
    if (this._isComplete) {
      return subject;
    } else {
      return (subject = new ReplaySubject_1.ReplaySubject(bufferSize, windowTime, scheduler));
    }
  });
  return connectable.refCount();
}
exports.shareReplay = shareReplay;
;
