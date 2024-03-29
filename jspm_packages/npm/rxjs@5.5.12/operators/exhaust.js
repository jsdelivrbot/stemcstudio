/* */ 
(function(process) {
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
  function exhaust() {
    return function(source) {
      return source.lift(new SwitchFirstOperator());
    };
  }
  exports.exhaust = exhaust;
  var SwitchFirstOperator = (function() {
    function SwitchFirstOperator() {}
    SwitchFirstOperator.prototype.call = function(subscriber, source) {
      return source.subscribe(new SwitchFirstSubscriber(subscriber));
    };
    return SwitchFirstOperator;
  }());
  var SwitchFirstSubscriber = (function(_super) {
    __extends(SwitchFirstSubscriber, _super);
    function SwitchFirstSubscriber(destination) {
      _super.call(this, destination);
      this.hasCompleted = false;
      this.hasSubscription = false;
    }
    SwitchFirstSubscriber.prototype._next = function(value) {
      if (!this.hasSubscription) {
        this.hasSubscription = true;
        this.add(subscribeToResult_1.subscribeToResult(this, value));
      }
    };
    SwitchFirstSubscriber.prototype._complete = function() {
      this.hasCompleted = true;
      if (!this.hasSubscription) {
        this.destination.complete();
      }
    };
    SwitchFirstSubscriber.prototype.notifyComplete = function(innerSub) {
      this.remove(innerSub);
      this.hasSubscription = false;
      if (this.hasCompleted) {
        this.destination.complete();
      }
    };
    return SwitchFirstSubscriber;
  }(OuterSubscriber_1.OuterSubscriber));
})(require('process'));
