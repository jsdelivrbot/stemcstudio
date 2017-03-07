/* */ 
"use strict";
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
  if (typeof selector === 'function') {
    return this.lift(new MulticastOperator(subjectFactory, selector));
  }
  var connectable = Object.create(this, ConnectableObservable_1.connectableObservableDescriptor);
  connectable.source = this;
  connectable.subjectFactory = subjectFactory;
  return connectable;
}
exports.multicast = multicast;
var MulticastOperator = (function() {
  function MulticastOperator(subjectFactory, selector) {
    this.subjectFactory = subjectFactory;
    this.selector = selector;
  }
  MulticastOperator.prototype.call = function(subscriber, source) {
    var selector = this.selector;
    var subject = this.subjectFactory();
    var subscription = selector(subject).subscribe(subscriber);
    subscription.add(source.subscribe(subject));
    return subscription;
  };
  return MulticastOperator;
}());
exports.MulticastOperator = MulticastOperator;
