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
  var isArray_1 = require('./util/isArray');
  var isObject_1 = require('./util/isObject');
  var isFunction_1 = require('./util/isFunction');
  var tryCatch_1 = require('./util/tryCatch');
  var errorObject_1 = require('./util/errorObject');
  var UnsubscriptionError_1 = require('./util/UnsubscriptionError');
  var Subscription = (function() {
    function Subscription(unsubscribe) {
      this.closed = false;
      if (unsubscribe) {
        this._unsubscribe = unsubscribe;
      }
    }
    Subscription.prototype.unsubscribe = function() {
      var hasErrors = false;
      var errors;
      if (this.closed) {
        return;
      }
      this.closed = true;
      var _a = this,
          _unsubscribe = _a._unsubscribe,
          _subscriptions = _a._subscriptions;
      this._subscriptions = null;
      if (isFunction_1.isFunction(_unsubscribe)) {
        var trial = tryCatch_1.tryCatch(_unsubscribe).call(this);
        if (trial === errorObject_1.errorObject) {
          hasErrors = true;
          errors = errors || (errorObject_1.errorObject.e instanceof UnsubscriptionError_1.UnsubscriptionError ? flattenUnsubscriptionErrors(errorObject_1.errorObject.e.errors) : [errorObject_1.errorObject.e]);
        }
      }
      if (isArray_1.isArray(_subscriptions)) {
        var index = -1;
        var len = _subscriptions.length;
        while (++index < len) {
          var sub = _subscriptions[index];
          if (isObject_1.isObject(sub)) {
            var trial = tryCatch_1.tryCatch(sub.unsubscribe).call(sub);
            if (trial === errorObject_1.errorObject) {
              hasErrors = true;
              errors = errors || [];
              var err = errorObject_1.errorObject.e;
              if (err instanceof UnsubscriptionError_1.UnsubscriptionError) {
                errors = errors.concat(flattenUnsubscriptionErrors(err.errors));
              } else {
                errors.push(err);
              }
            }
          }
        }
      }
      if (hasErrors) {
        throw new UnsubscriptionError_1.UnsubscriptionError(errors);
      }
    };
    Subscription.prototype.add = function(teardown) {
      if (!teardown || (teardown === Subscription.EMPTY)) {
        return Subscription.EMPTY;
      }
      if (teardown === this) {
        return this;
      }
      var sub = teardown;
      switch (typeof teardown) {
        case 'function':
          sub = new Subscription(teardown);
        case 'object':
          if (sub.closed || typeof sub.unsubscribe !== 'function') {
            return sub;
          } else if (this.closed) {
            sub.unsubscribe();
            return sub;
          }
          break;
        default:
          throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
      }
      var childSub = new ChildSubscription(sub, this);
      this._subscriptions = this._subscriptions || [];
      this._subscriptions.push(childSub);
      return childSub;
    };
    Subscription.prototype.remove = function(subscription) {
      if (subscription == null || (subscription === this) || (subscription === Subscription.EMPTY)) {
        return;
      }
      var subscriptions = this._subscriptions;
      if (subscriptions) {
        var subscriptionIndex = subscriptions.indexOf(subscription);
        if (subscriptionIndex !== -1) {
          subscriptions.splice(subscriptionIndex, 1);
        }
      }
    };
    Subscription.EMPTY = (function(empty) {
      empty.closed = true;
      return empty;
    }(new Subscription()));
    return Subscription;
  }());
  exports.Subscription = Subscription;
  var ChildSubscription = (function(_super) {
    __extends(ChildSubscription, _super);
    function ChildSubscription(_innerSub, _parent) {
      _super.call(this);
      this._innerSub = _innerSub;
      this._parent = _parent;
    }
    ChildSubscription.prototype._unsubscribe = function() {
      var _a = this,
          _innerSub = _a._innerSub,
          _parent = _a._parent;
      _parent.remove(this);
      _innerSub.unsubscribe();
    };
    return ChildSubscription;
  }(Subscription));
  exports.ChildSubscription = ChildSubscription;
  function flattenUnsubscriptionErrors(errors) {
    return errors.reduce(function(errs, err) {
      return errs.concat((err instanceof UnsubscriptionError_1.UnsubscriptionError) ? err.errors : err);
    }, []);
  }
})(require('process'));
