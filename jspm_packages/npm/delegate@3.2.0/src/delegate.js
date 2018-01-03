/* */ 
var closest = require('./closest');
function _delegate(element, selector, type, callback, useCapture) {
  var listenerFn = listener.apply(this, arguments);
  element.addEventListener(type, listenerFn, useCapture);
  return {destroy: function() {
      element.removeEventListener(type, listenerFn, useCapture);
    }};
}
function delegate(elements, selector, type, callback, useCapture) {
  if (typeof elements.addEventListener === 'function') {
    return _delegate.apply(null, arguments);
  }
  if (typeof type === 'function') {
    return _delegate.bind(null, document).apply(null, arguments);
  }
  if (typeof elements === 'string') {
    elements = document.querySelectorAll(elements);
  }
  return Array.prototype.map.call(elements, function(element) {
    return _delegate(element, selector, type, callback, useCapture);
  });
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
