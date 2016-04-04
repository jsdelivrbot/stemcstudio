/* */ 
"use strict";
var root_1 = require('./util/root');
var observable_1 = require('./symbol/observable');
var toSubscriber_1 = require('./util/toSubscriber');
var Observable = (function() {
  function Observable(subscribe) {
    this._isScalar = false;
    if (subscribe) {
      this._subscribe = subscribe;
    }
  }
  Observable.prototype.lift = function(operator) {
    var observable = new Observable();
    observable.source = this;
    observable.operator = operator;
    return observable;
  };
  Observable.prototype.subscribe = function(observerOrNext, error, complete) {
    var operator = this.operator;
    var target = toSubscriber_1.toSubscriber(observerOrNext, error, complete);
    var transformer = operator && operator.call(target) || target;
    if (transformer !== target) {
      target.add(transformer);
    }
    var subscription = this._subscribe(transformer);
    if (subscription !== target) {
      target.add(subscription);
    }
    if (target.syncErrorThrowable) {
      target.syncErrorThrowable = false;
      if (target.syncErrorThrown) {
        throw target.syncErrorValue;
      }
    }
    return target;
  };
  Observable.prototype.forEach = function(next, PromiseCtor) {
    var _this = this;
    if (!PromiseCtor) {
      if (root_1.root.Rx && root_1.root.Rx.config && root_1.root.Rx.config.Promise) {
        PromiseCtor = root_1.root.Rx.config.Promise;
      } else if (root_1.root.Promise) {
        PromiseCtor = root_1.root.Promise;
      }
    }
    if (!PromiseCtor) {
      throw new Error('no Promise impl found');
    }
    return new PromiseCtor(function(resolve, reject) {
      var subscription = _this.subscribe(function(value) {
        if (subscription) {
          try {
            next(value);
          } catch (err) {
            reject(err);
            subscription.unsubscribe();
          }
        } else {
          next(value);
        }
      }, reject, resolve);
    });
  };
  Observable.prototype._subscribe = function(subscriber) {
    return this.source.subscribe(subscriber);
  };
  Observable.prototype[observable_1.$$observable] = function() {
    return this;
  };
  Observable.create = function(subscribe) {
    return new Observable(subscribe);
  };
  return Observable;
}());
exports.Observable = Observable;
