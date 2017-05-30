/* */ 
var closest = require('./closest');
function delegate(element, selector, type, callback, useCapture) {
  var listenerFn = listener.apply(this, arguments);
  element.addEventListener(type, listenerFn, useCapture);
  return {destroy: function() {
      element.removeEventListener(type, listenerFn, useCapture);
    }};
}
function listener(element, selector, type, callback) {
  return function(e) {
    e.delegateTarget = closest(e.target, selector);
    if (e.delegateTarget) {
      callback.call(element, e);
    }
  };
}
module.exports = delegate;
