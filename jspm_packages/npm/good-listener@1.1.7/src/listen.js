/* */ 
var is = require('./is');
var delegate = require('delegate');
function listen(target, type, callback) {
  if (!target && !type && !callback) {
    throw new Error('Missing required arguments');
  }
  if (!is.string(type)) {
    throw new TypeError('Second argument must be a String');
  }
  if (!is.fn(callback)) {
    throw new TypeError('Third argument must be a Function');
  }
  if (is.node(target)) {
    return listenNode(target, type, callback);
  } else if (is.nodeList(target)) {
    return listenNodeList(target, type, callback);
  } else if (is.string(target)) {
    return listenSelector(target, type, callback);
  } else {
    throw new TypeError('First argument must be a String, HTMLElement, HTMLCollection, or NodeList');
  }
}
function listenNode(node, type, callback) {
  node.addEventListener(type, callback);
  return {destroy: function() {
      node.removeEventListener(type, callback);
    }};
}
function listenNodeList(nodeList, type, callback) {
  Array.prototype.forEach.call(nodeList, function(node) {
    node.addEventListener(type, callback);
  });
  return {destroy: function() {
      Array.prototype.forEach.call(nodeList, function(node) {
        node.removeEventListener(type, callback);
      });
    }};
}
function listenSelector(selector, type, callback) {
  return delegate(document.body, selector, type, callback);
}
module.exports = listen;
