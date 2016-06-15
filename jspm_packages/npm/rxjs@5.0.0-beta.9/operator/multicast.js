/* */ 
"use strict";
var MulticastObservable_1 = require('../observable/MulticastObservable');
var ConnectableObservable_1 = require('../observable/ConnectableObservable');
function multicast(subjectOrSubjectFactory, selector) {
  var subjectFactory;
  if (typeof subjectOrSubjectFactory === 'function') {
    subjectFactory = subjectOrSubjectFactory;
  } else {
    subjectFactory = function subjectFactory() {
      return subjectOrSubjectFactory;
    };
  }
  var connectable = new ConnectableObservable_1.ConnectableObservable(this, subjectFactory);
  return selector ? new MulticastObservable_1.MulticastObservable(this, connectable, selector) : connectable;
}
exports.multicast = multicast;
