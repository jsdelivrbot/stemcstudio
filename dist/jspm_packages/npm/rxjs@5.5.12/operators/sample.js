/* */ 
"use strict";
var __extends = (this && this.__extends) || function(d, b) {
  for (var p in b)
    if (b.hasOwnProperty(p))
      d[p] = b[p];
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
function sample(notifier) {
  return function(source) {
    return source.lift(new SampleOperator(notifier));
  };
}
exports.sample = sample;
var SampleOperator = (function() {
  function SampleOperator(notifier) {
    this.notifier = notifier;
  }
  SampleOperator.prototype.call = function(subscriber, source) {
    var sampleSubscriber = new SampleSubscriber(subscriber);
    var subscription = source.subscribe(sampleSubscriber);
    subscription.add(subscribeToResult_1.subscribeToResult(sampleSubscriber, this.notifier));
    return subscription;
  };
  return SampleOperator;
}());
var SampleSubscriber = (function(_super) {
  __extends(SampleSubscriber, _super);
  function SampleSubscriber() {
    _super.apply(this, arguments);
    this.hasValue = false;
  }
  SampleSubscriber.prototype._next = function(value) {
    this.value = value;
    this.hasValue = true;
  };
  SampleSubscriber.prototype.notifyNext = function(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    this.emitValue();
  };
  SampleSubscriber.prototype.notifyComplete = function() {
    this.emitValue();
  };
  SampleSubscriber.prototype.emitValue = function() {
    if (this.hasValue) {
      this.hasValue = false;
      this.destination.next(this.value);
    }
  };
  return SampleSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
