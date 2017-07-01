/* */ 
"format cjs";
(function(process) {
  (function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common'), require('@angular/core')) : typeof define === 'function' && define.amd ? define(['exports', '@angular/common', '@angular/core'], factory) : (factory((global.ng = global.ng || {}, global.ng.platformBrowser = global.ng.platformBrowser || {}), global.ng.common, global.ng.core));
  }(this, (function(exports, _angular_common, _angular_core) {
    'use strict';
    var extendStatics = Object.setPrototypeOf || ({__proto__: []} instanceof Array && function(d, b) {
      d.__proto__ = b;
    }) || function(d, b) {
      for (var p in b)
        if (b.hasOwnProperty(p))
          d[p] = b[p];
    };
    function __extends(d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var _DOM = ((null));
    function getDOM() {
      return _DOM;
    }
    function setRootDomAdapter(adapter) {
      if (!_DOM) {
        _DOM = adapter;
      }
    }
    var DomAdapter = (function() {
      function DomAdapter() {
        this.resourceLoaderType = ((null));
      }
      DomAdapter.prototype.hasProperty = function(element, name) {};
      DomAdapter.prototype.setProperty = function(el, name, value) {};
      DomAdapter.prototype.getProperty = function(el, name) {};
      DomAdapter.prototype.invoke = function(el, methodName, args) {};
      DomAdapter.prototype.logError = function(error) {};
      DomAdapter.prototype.log = function(error) {};
      DomAdapter.prototype.logGroup = function(error) {};
      DomAdapter.prototype.logGroupEnd = function() {};
      Object.defineProperty(DomAdapter.prototype, "attrToPropMap", {
        get: function() {
          return this._attrToPropMap;
        },
        set: function(value) {
          this._attrToPropMap = value;
        },
        enumerable: true,
        configurable: true
      });
      DomAdapter.prototype.contains = function(nodeA, nodeB) {};
      DomAdapter.prototype.parse = function(templateHtml) {};
      DomAdapter.prototype.querySelector = function(el, selector) {};
      DomAdapter.prototype.querySelectorAll = function(el, selector) {};
      DomAdapter.prototype.on = function(el, evt, listener) {};
      DomAdapter.prototype.onAndCancel = function(el, evt, listener) {};
      DomAdapter.prototype.dispatchEvent = function(el, evt) {};
      DomAdapter.prototype.createMouseEvent = function(eventType) {};
      DomAdapter.prototype.createEvent = function(eventType) {};
      DomAdapter.prototype.preventDefault = function(evt) {};
      DomAdapter.prototype.isPrevented = function(evt) {};
      DomAdapter.prototype.getInnerHTML = function(el) {};
      DomAdapter.prototype.getTemplateContent = function(el) {};
      DomAdapter.prototype.getOuterHTML = function(el) {};
      DomAdapter.prototype.nodeName = function(node) {};
      DomAdapter.prototype.nodeValue = function(node) {};
      DomAdapter.prototype.type = function(node) {};
      DomAdapter.prototype.content = function(node) {};
      DomAdapter.prototype.firstChild = function(el) {};
      DomAdapter.prototype.nextSibling = function(el) {};
      DomAdapter.prototype.parentElement = function(el) {};
      DomAdapter.prototype.childNodes = function(el) {};
      DomAdapter.prototype.childNodesAsList = function(el) {};
      DomAdapter.prototype.clearNodes = function(el) {};
      DomAdapter.prototype.appendChild = function(el, node) {};
      DomAdapter.prototype.removeChild = function(el, node) {};
      DomAdapter.prototype.replaceChild = function(el, newNode, oldNode) {};
      DomAdapter.prototype.remove = function(el) {};
      DomAdapter.prototype.insertBefore = function(parent, ref, node) {};
      DomAdapter.prototype.insertAllBefore = function(parent, ref, nodes) {};
      DomAdapter.prototype.insertAfter = function(parent, el, node) {};
      DomAdapter.prototype.setInnerHTML = function(el, value) {};
      DomAdapter.prototype.getText = function(el) {};
      DomAdapter.prototype.setText = function(el, value) {};
      DomAdapter.prototype.getValue = function(el) {};
      DomAdapter.prototype.setValue = function(el, value) {};
      DomAdapter.prototype.getChecked = function(el) {};
      DomAdapter.prototype.setChecked = function(el, value) {};
      DomAdapter.prototype.createComment = function(text) {};
      DomAdapter.prototype.createTemplate = function(html) {};
      DomAdapter.prototype.createElement = function(tagName, doc) {};
      DomAdapter.prototype.createElementNS = function(ns, tagName, doc) {};
      DomAdapter.prototype.createTextNode = function(text, doc) {};
      DomAdapter.prototype.createScriptTag = function(attrName, attrValue, doc) {};
      DomAdapter.prototype.createStyleElement = function(css, doc) {};
      DomAdapter.prototype.createShadowRoot = function(el) {};
      DomAdapter.prototype.getShadowRoot = function(el) {};
      DomAdapter.prototype.getHost = function(el) {};
      DomAdapter.prototype.getDistributedNodes = function(el) {};
      DomAdapter.prototype.clone = function(node) {};
      DomAdapter.prototype.getElementsByClassName = function(element, name) {};
      DomAdapter.prototype.getElementsByTagName = function(element, name) {};
      DomAdapter.prototype.classList = function(element) {};
      DomAdapter.prototype.addClass = function(element, className) {};
      DomAdapter.prototype.removeClass = function(element, className) {};
      DomAdapter.prototype.hasClass = function(element, className) {};
      DomAdapter.prototype.setStyle = function(element, styleName, styleValue) {};
      DomAdapter.prototype.removeStyle = function(element, styleName) {};
      DomAdapter.prototype.getStyle = function(element, styleName) {};
      DomAdapter.prototype.hasStyle = function(element, styleName, styleValue) {};
      DomAdapter.prototype.tagName = function(element) {};
      DomAdapter.prototype.attributeMap = function(element) {};
      DomAdapter.prototype.hasAttribute = function(element, attribute) {};
      DomAdapter.prototype.hasAttributeNS = function(element, ns, attribute) {};
      DomAdapter.prototype.getAttribute = function(element, attribute) {};
      DomAdapter.prototype.getAttributeNS = function(element, ns, attribute) {};
      DomAdapter.prototype.setAttribute = function(element, name, value) {};
      DomAdapter.prototype.setAttributeNS = function(element, ns, name, value) {};
      DomAdapter.prototype.removeAttribute = function(element, attribute) {};
      DomAdapter.prototype.removeAttributeNS = function(element, ns, attribute) {};
      DomAdapter.prototype.templateAwareRoot = function(el) {};
      DomAdapter.prototype.createHtmlDocument = function() {};
      DomAdapter.prototype.getBoundingClientRect = function(el) {};
      DomAdapter.prototype.getTitle = function(doc) {};
      DomAdapter.prototype.setTitle = function(doc, newTitle) {};
      DomAdapter.prototype.elementMatches = function(n, selector) {};
      DomAdapter.prototype.isTemplateElement = function(el) {};
      DomAdapter.prototype.isTextNode = function(node) {};
      DomAdapter.prototype.isCommentNode = function(node) {};
      DomAdapter.prototype.isElementNode = function(node) {};
      DomAdapter.prototype.hasShadowRoot = function(node) {};
      DomAdapter.prototype.isShadowRoot = function(node) {};
      DomAdapter.prototype.importIntoDoc = function(node) {};
      DomAdapter.prototype.adoptNode = function(node) {};
      DomAdapter.prototype.getHref = function(element) {};
      DomAdapter.prototype.getEventKey = function(event) {};
      DomAdapter.prototype.resolveAndSetHref = function(element, baseUrl, href) {};
      DomAdapter.prototype.supportsDOMEvents = function() {};
      DomAdapter.prototype.supportsNativeShadowDOM = function() {};
      DomAdapter.prototype.getGlobalEventTarget = function(doc, target) {};
      DomAdapter.prototype.getHistory = function() {};
      DomAdapter.prototype.getLocation = function() {};
      DomAdapter.prototype.getBaseHref = function(doc) {};
      DomAdapter.prototype.resetBaseElement = function() {};
      DomAdapter.prototype.getUserAgent = function() {};
      DomAdapter.prototype.setData = function(element, name, value) {};
      DomAdapter.prototype.getComputedStyle = function(element) {};
      DomAdapter.prototype.getData = function(element, name) {};
      DomAdapter.prototype.supportsWebAnimation = function() {};
      DomAdapter.prototype.performanceNow = function() {};
      DomAdapter.prototype.getAnimationPrefix = function() {};
      DomAdapter.prototype.getTransitionEnd = function() {};
      DomAdapter.prototype.supportsAnimation = function() {};
      DomAdapter.prototype.supportsCookies = function() {};
      DomAdapter.prototype.getCookie = function(name) {};
      DomAdapter.prototype.setCookie = function(name, value) {};
      return DomAdapter;
    }());
    var GenericBrowserDomAdapter = (function(_super) {
      __extends(GenericBrowserDomAdapter, _super);
      function GenericBrowserDomAdapter() {
        var _this = _super.call(this) || this;
        _this._animationPrefix = null;
        _this._transitionEnd = null;
        try {
          var element_1 = _this.createElement('div', document);
          if (_this.getStyle(element_1, 'animationName') != null) {
            _this._animationPrefix = '';
          } else {
            var domPrefixes = ['Webkit', 'Moz', 'O', 'ms'];
            for (var i = 0; i < domPrefixes.length; i++) {
              if (_this.getStyle(element_1, domPrefixes[i] + 'AnimationName') != null) {
                _this._animationPrefix = '-' + domPrefixes[i].toLowerCase() + '-';
                break;
              }
            }
          }
          var transEndEventNames_1 = {
            WebkitTransition: 'webkitTransitionEnd',
            MozTransition: 'transitionend',
            OTransition: 'oTransitionEnd otransitionend',
            transition: 'transitionend'
          };
          Object.keys(transEndEventNames_1).forEach(function(key) {
            if (_this.getStyle(element_1, key) != null) {
              _this._transitionEnd = transEndEventNames_1[key];
            }
          });
        } catch (e) {
          _this._animationPrefix = null;
          _this._transitionEnd = null;
        }
        return _this;
      }
      GenericBrowserDomAdapter.prototype.getDistributedNodes = function(el) {
        return ((el)).getDistributedNodes();
      };
      GenericBrowserDomAdapter.prototype.resolveAndSetHref = function(el, baseUrl, href) {
        el.href = href == null ? baseUrl : baseUrl + '/../' + href;
      };
      GenericBrowserDomAdapter.prototype.supportsDOMEvents = function() {
        return true;
      };
      GenericBrowserDomAdapter.prototype.supportsNativeShadowDOM = function() {
        return typeof((document.body)).createShadowRoot === 'function';
      };
      GenericBrowserDomAdapter.prototype.getAnimationPrefix = function() {
        return this._animationPrefix ? this._animationPrefix : '';
      };
      GenericBrowserDomAdapter.prototype.getTransitionEnd = function() {
        return this._transitionEnd ? this._transitionEnd : '';
      };
      GenericBrowserDomAdapter.prototype.supportsAnimation = function() {
        return this._animationPrefix != null && this._transitionEnd != null;
      };
      return GenericBrowserDomAdapter;
    }(DomAdapter));
    var _attrToPropMap = {
      'class': 'className',
      'innerHtml': 'innerHTML',
      'readonly': 'readOnly',
      'tabindex': 'tabIndex'
    };
    var DOM_KEY_LOCATION_NUMPAD = 3;
    var _keyMap = {
      '\b': 'Backspace',
      '\t': 'Tab',
      '\x7F': 'Delete',
      '\x1B': 'Escape',
      'Del': 'Delete',
      'Esc': 'Escape',
      'Left': 'ArrowLeft',
      'Right': 'ArrowRight',
      'Up': 'ArrowUp',
      'Down': 'ArrowDown',
      'Menu': 'ContextMenu',
      'Scroll': 'ScrollLock',
      'Win': 'OS'
    };
    var _chromeNumKeyPadMap = {
      'A': '1',
      'B': '2',
      'C': '3',
      'D': '4',
      'E': '5',
      'F': '6',
      'G': '7',
      'H': '8',
      'I': '9',
      'J': '*',
      'K': '+',
      'M': '-',
      'N': '.',
      'O': '/',
      '\x60': '0',
      '\x90': 'NumLock'
    };
    var nodeContains;
    if (_angular_core.ɵglobal['Node']) {
      nodeContains = _angular_core.ɵglobal['Node'].prototype.contains || function(node) {
        return !!(this.compareDocumentPosition(node) & 16);
      };
    }
    var BrowserDomAdapter = (function(_super) {
      __extends(BrowserDomAdapter, _super);
      function BrowserDomAdapter() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      BrowserDomAdapter.prototype.parse = function(templateHtml) {
        throw new Error('parse not implemented');
      };
      BrowserDomAdapter.makeCurrent = function() {
        setRootDomAdapter(new BrowserDomAdapter());
      };
      BrowserDomAdapter.prototype.hasProperty = function(element, name) {
        return name in element;
      };
      BrowserDomAdapter.prototype.setProperty = function(el, name, value) {
        ((el))[name] = value;
      };
      BrowserDomAdapter.prototype.getProperty = function(el, name) {
        return ((el))[name];
      };
      BrowserDomAdapter.prototype.invoke = function(el, methodName, args) {
        ((el))[methodName].apply(((el)), args);
      };
      BrowserDomAdapter.prototype.logError = function(error) {
        if (window.console) {
          if (console.error) {
            console.error(error);
          } else {
            console.log(error);
          }
        }
      };
      BrowserDomAdapter.prototype.log = function(error) {
        if (window.console) {
          window.console.log && window.console.log(error);
        }
      };
      BrowserDomAdapter.prototype.logGroup = function(error) {
        if (window.console) {
          window.console.group && window.console.group(error);
        }
      };
      BrowserDomAdapter.prototype.logGroupEnd = function() {
        if (window.console) {
          window.console.groupEnd && window.console.groupEnd();
        }
      };
      Object.defineProperty(BrowserDomAdapter.prototype, "attrToPropMap", {
        get: function() {
          return _attrToPropMap;
        },
        enumerable: true,
        configurable: true
      });
      BrowserDomAdapter.prototype.contains = function(nodeA, nodeB) {
        return nodeContains.call(nodeA, nodeB);
      };
      BrowserDomAdapter.prototype.querySelector = function(el, selector) {
        return el.querySelector(selector);
      };
      BrowserDomAdapter.prototype.querySelectorAll = function(el, selector) {
        return el.querySelectorAll(selector);
      };
      BrowserDomAdapter.prototype.on = function(el, evt, listener) {
        el.addEventListener(evt, listener, false);
      };
      BrowserDomAdapter.prototype.onAndCancel = function(el, evt, listener) {
        el.addEventListener(evt, listener, false);
        return function() {
          el.removeEventListener(evt, listener, false);
        };
      };
      BrowserDomAdapter.prototype.dispatchEvent = function(el, evt) {
        el.dispatchEvent(evt);
      };
      BrowserDomAdapter.prototype.createMouseEvent = function(eventType) {
        var evt = document.createEvent('MouseEvent');
        evt.initEvent(eventType, true, true);
        return evt;
      };
      BrowserDomAdapter.prototype.createEvent = function(eventType) {
        var evt = document.createEvent('Event');
        evt.initEvent(eventType, true, true);
        return evt;
      };
      BrowserDomAdapter.prototype.preventDefault = function(evt) {
        evt.preventDefault();
        evt.returnValue = false;
      };
      BrowserDomAdapter.prototype.isPrevented = function(evt) {
        return evt.defaultPrevented || evt.returnValue != null && !evt.returnValue;
      };
      BrowserDomAdapter.prototype.getInnerHTML = function(el) {
        return el.innerHTML;
      };
      BrowserDomAdapter.prototype.getTemplateContent = function(el) {
        return 'content' in el && el instanceof HTMLTemplateElement ? el.content : null;
      };
      BrowserDomAdapter.prototype.getOuterHTML = function(el) {
        return el.outerHTML;
      };
      BrowserDomAdapter.prototype.nodeName = function(node) {
        return node.nodeName;
      };
      BrowserDomAdapter.prototype.nodeValue = function(node) {
        return node.nodeValue;
      };
      BrowserDomAdapter.prototype.type = function(node) {
        return node.type;
      };
      BrowserDomAdapter.prototype.content = function(node) {
        if (this.hasProperty(node, 'content')) {
          return ((node)).content;
        } else {
          return node;
        }
      };
      BrowserDomAdapter.prototype.firstChild = function(el) {
        return el.firstChild;
      };
      BrowserDomAdapter.prototype.nextSibling = function(el) {
        return el.nextSibling;
      };
      BrowserDomAdapter.prototype.parentElement = function(el) {
        return el.parentNode;
      };
      BrowserDomAdapter.prototype.childNodes = function(el) {
        return el.childNodes;
      };
      BrowserDomAdapter.prototype.childNodesAsList = function(el) {
        var childNodes = el.childNodes;
        var res = new Array(childNodes.length);
        for (var i = 0; i < childNodes.length; i++) {
          res[i] = childNodes[i];
        }
        return res;
      };
      BrowserDomAdapter.prototype.clearNodes = function(el) {
        while (el.firstChild) {
          el.removeChild(el.firstChild);
        }
      };
      BrowserDomAdapter.prototype.appendChild = function(el, node) {
        el.appendChild(node);
      };
      BrowserDomAdapter.prototype.removeChild = function(el, node) {
        el.removeChild(node);
      };
      BrowserDomAdapter.prototype.replaceChild = function(el, newChild, oldChild) {
        el.replaceChild(newChild, oldChild);
      };
      BrowserDomAdapter.prototype.remove = function(node) {
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
        return node;
      };
      BrowserDomAdapter.prototype.insertBefore = function(parent, ref, node) {
        parent.insertBefore(node, ref);
      };
      BrowserDomAdapter.prototype.insertAllBefore = function(parent, ref, nodes) {
        nodes.forEach(function(n) {
          return parent.insertBefore(n, ref);
        });
      };
      BrowserDomAdapter.prototype.insertAfter = function(parent, ref, node) {
        parent.insertBefore(node, ref.nextSibling);
      };
      BrowserDomAdapter.prototype.setInnerHTML = function(el, value) {
        el.innerHTML = value;
      };
      BrowserDomAdapter.prototype.getText = function(el) {
        return el.textContent;
      };
      BrowserDomAdapter.prototype.setText = function(el, value) {
        el.textContent = value;
      };
      BrowserDomAdapter.prototype.getValue = function(el) {
        return el.value;
      };
      BrowserDomAdapter.prototype.setValue = function(el, value) {
        el.value = value;
      };
      BrowserDomAdapter.prototype.getChecked = function(el) {
        return el.checked;
      };
      BrowserDomAdapter.prototype.setChecked = function(el, value) {
        el.checked = value;
      };
      BrowserDomAdapter.prototype.createComment = function(text) {
        return document.createComment(text);
      };
      BrowserDomAdapter.prototype.createTemplate = function(html) {
        var t = document.createElement('template');
        t.innerHTML = html;
        return t;
      };
      BrowserDomAdapter.prototype.createElement = function(tagName, doc) {
        if (doc === void 0) {
          doc = document;
        }
        return doc.createElement(tagName);
      };
      BrowserDomAdapter.prototype.createElementNS = function(ns, tagName, doc) {
        if (doc === void 0) {
          doc = document;
        }
        return doc.createElementNS(ns, tagName);
      };
      BrowserDomAdapter.prototype.createTextNode = function(text, doc) {
        if (doc === void 0) {
          doc = document;
        }
        return doc.createTextNode(text);
      };
      BrowserDomAdapter.prototype.createScriptTag = function(attrName, attrValue, doc) {
        if (doc === void 0) {
          doc = document;
        }
        var el = (doc.createElement('SCRIPT'));
        el.setAttribute(attrName, attrValue);
        return el;
      };
      BrowserDomAdapter.prototype.createStyleElement = function(css, doc) {
        if (doc === void 0) {
          doc = document;
        }
        var style = (doc.createElement('style'));
        this.appendChild(style, this.createTextNode(css));
        return style;
      };
      BrowserDomAdapter.prototype.createShadowRoot = function(el) {
        return ((el)).createShadowRoot();
      };
      BrowserDomAdapter.prototype.getShadowRoot = function(el) {
        return ((el)).shadowRoot;
      };
      BrowserDomAdapter.prototype.getHost = function(el) {
        return ((el)).host;
      };
      BrowserDomAdapter.prototype.clone = function(node) {
        return node.cloneNode(true);
      };
      BrowserDomAdapter.prototype.getElementsByClassName = function(element, name) {
        return element.getElementsByClassName(name);
      };
      BrowserDomAdapter.prototype.getElementsByTagName = function(element, name) {
        return element.getElementsByTagName(name);
      };
      BrowserDomAdapter.prototype.classList = function(element) {
        return Array.prototype.slice.call(element.classList, 0);
      };
      BrowserDomAdapter.prototype.addClass = function(element, className) {
        element.classList.add(className);
      };
      BrowserDomAdapter.prototype.removeClass = function(element, className) {
        element.classList.remove(className);
      };
      BrowserDomAdapter.prototype.hasClass = function(element, className) {
        return element.classList.contains(className);
      };
      BrowserDomAdapter.prototype.setStyle = function(element, styleName, styleValue) {
        element.style[styleName] = styleValue;
      };
      BrowserDomAdapter.prototype.removeStyle = function(element, stylename) {
        element.style[stylename] = '';
      };
      BrowserDomAdapter.prototype.getStyle = function(element, stylename) {
        return element.style[stylename];
      };
      BrowserDomAdapter.prototype.hasStyle = function(element, styleName, styleValue) {
        var value = this.getStyle(element, styleName) || '';
        return styleValue ? value == styleValue : value.length > 0;
      };
      BrowserDomAdapter.prototype.tagName = function(element) {
        return element.tagName;
      };
      BrowserDomAdapter.prototype.attributeMap = function(element) {
        var res = new Map();
        var elAttrs = element.attributes;
        for (var i = 0; i < elAttrs.length; i++) {
          var attrib = elAttrs[i];
          res.set(attrib.name, attrib.value);
        }
        return res;
      };
      BrowserDomAdapter.prototype.hasAttribute = function(element, attribute) {
        return element.hasAttribute(attribute);
      };
      BrowserDomAdapter.prototype.hasAttributeNS = function(element, ns, attribute) {
        return element.hasAttributeNS(ns, attribute);
      };
      BrowserDomAdapter.prototype.getAttribute = function(element, attribute) {
        return element.getAttribute(attribute);
      };
      BrowserDomAdapter.prototype.getAttributeNS = function(element, ns, name) {
        return element.getAttributeNS(ns, name);
      };
      BrowserDomAdapter.prototype.setAttribute = function(element, name, value) {
        element.setAttribute(name, value);
      };
      BrowserDomAdapter.prototype.setAttributeNS = function(element, ns, name, value) {
        element.setAttributeNS(ns, name, value);
      };
      BrowserDomAdapter.prototype.removeAttribute = function(element, attribute) {
        element.removeAttribute(attribute);
      };
      BrowserDomAdapter.prototype.removeAttributeNS = function(element, ns, name) {
        element.removeAttributeNS(ns, name);
      };
      BrowserDomAdapter.prototype.templateAwareRoot = function(el) {
        return this.isTemplateElement(el) ? this.content(el) : el;
      };
      BrowserDomAdapter.prototype.createHtmlDocument = function() {
        return document.implementation.createHTMLDocument('fakeTitle');
      };
      BrowserDomAdapter.prototype.getBoundingClientRect = function(el) {
        try {
          return el.getBoundingClientRect();
        } catch (e) {
          return {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            width: 0,
            height: 0
          };
        }
      };
      BrowserDomAdapter.prototype.getTitle = function(doc) {
        return document.title;
      };
      BrowserDomAdapter.prototype.setTitle = function(doc, newTitle) {
        document.title = newTitle || '';
      };
      BrowserDomAdapter.prototype.elementMatches = function(n, selector) {
        if (n instanceof HTMLElement) {
          return n.matches && n.matches(selector) || n.msMatchesSelector && n.msMatchesSelector(selector) || n.webkitMatchesSelector && n.webkitMatchesSelector(selector);
        }
        return false;
      };
      BrowserDomAdapter.prototype.isTemplateElement = function(el) {
        return el instanceof HTMLElement && el.nodeName == 'TEMPLATE';
      };
      BrowserDomAdapter.prototype.isTextNode = function(node) {
        return node.nodeType === Node.TEXT_NODE;
      };
      BrowserDomAdapter.prototype.isCommentNode = function(node) {
        return node.nodeType === Node.COMMENT_NODE;
      };
      BrowserDomAdapter.prototype.isElementNode = function(node) {
        return node.nodeType === Node.ELEMENT_NODE;
      };
      BrowserDomAdapter.prototype.hasShadowRoot = function(node) {
        return node.shadowRoot != null && node instanceof HTMLElement;
      };
      BrowserDomAdapter.prototype.isShadowRoot = function(node) {
        return node instanceof DocumentFragment;
      };
      BrowserDomAdapter.prototype.importIntoDoc = function(node) {
        return document.importNode(this.templateAwareRoot(node), true);
      };
      BrowserDomAdapter.prototype.adoptNode = function(node) {
        return document.adoptNode(node);
      };
      BrowserDomAdapter.prototype.getHref = function(el) {
        return ((el)).href;
      };
      BrowserDomAdapter.prototype.getEventKey = function(event) {
        var key = event.key;
        if (key == null) {
          key = event.keyIdentifier;
          if (key == null) {
            return 'Unidentified';
          }
          if (key.startsWith('U+')) {
            key = String.fromCharCode(parseInt(key.substring(2), 16));
            if (event.location === DOM_KEY_LOCATION_NUMPAD && _chromeNumKeyPadMap.hasOwnProperty(key)) {
              key = ((_chromeNumKeyPadMap))[key];
            }
          }
        }
        return _keyMap[key] || key;
      };
      BrowserDomAdapter.prototype.getGlobalEventTarget = function(doc, target) {
        if (target === 'window') {
          return window;
        }
        if (target === 'document') {
          return document;
        }
        if (target === 'body') {
          return document.body;
        }
        return null;
      };
      BrowserDomAdapter.prototype.getHistory = function() {
        return window.history;
      };
      BrowserDomAdapter.prototype.getLocation = function() {
        return window.location;
      };
      BrowserDomAdapter.prototype.getBaseHref = function(doc) {
        var href = getBaseElementHref();
        return href == null ? null : relativePath(href);
      };
      BrowserDomAdapter.prototype.resetBaseElement = function() {
        baseElement = null;
      };
      BrowserDomAdapter.prototype.getUserAgent = function() {
        return window.navigator.userAgent;
      };
      BrowserDomAdapter.prototype.setData = function(element, name, value) {
        this.setAttribute(element, 'data-' + name, value);
      };
      BrowserDomAdapter.prototype.getData = function(element, name) {
        return this.getAttribute(element, 'data-' + name);
      };
      BrowserDomAdapter.prototype.getComputedStyle = function(element) {
        return getComputedStyle(element);
      };
      BrowserDomAdapter.prototype.supportsWebAnimation = function() {
        return typeof((Element)).prototype['animate'] === 'function';
      };
      BrowserDomAdapter.prototype.performanceNow = function() {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
      };
      BrowserDomAdapter.prototype.supportsCookies = function() {
        return true;
      };
      BrowserDomAdapter.prototype.getCookie = function(name) {
        return parseCookieValue(document.cookie, name);
      };
      BrowserDomAdapter.prototype.setCookie = function(name, value) {
        document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
      };
      return BrowserDomAdapter;
    }(GenericBrowserDomAdapter));
    var baseElement = null;
    function getBaseElementHref() {
      if (!baseElement) {
        baseElement = ((document.querySelector('base')));
        if (!baseElement) {
          return null;
        }
      }
      return baseElement.getAttribute('href');
    }
    var urlParsingNode;
    function relativePath(url) {
      if (!urlParsingNode) {
        urlParsingNode = document.createElement('a');
      }
      urlParsingNode.setAttribute('href', url);
      return (urlParsingNode.pathname.charAt(0) === '/') ? urlParsingNode.pathname : '/' + urlParsingNode.pathname;
    }
    function parseCookieValue(cookieStr, name) {
      name = encodeURIComponent(name);
      for (var _i = 0,
          _a = cookieStr.split(';'); _i < _a.length; _i++) {
        var cookie = _a[_i];
        var eqIndex = cookie.indexOf('=');
        var _b = eqIndex == -1 ? [cookie, ''] : [cookie.slice(0, eqIndex), cookie.slice(eqIndex + 1)],
            cookieName = _b[0],
            cookieValue = _b[1];
        if (cookieName.trim() === name) {
          return decodeURIComponent(cookieValue);
        }
      }
      return null;
    }
    var DOCUMENT = new _angular_core.InjectionToken('DocumentToken');
    function supportsState() {
      return !!window.history.pushState;
    }
    var BrowserPlatformLocation = (function(_super) {
      __extends(BrowserPlatformLocation, _super);
      function BrowserPlatformLocation(_doc) {
        var _this = _super.call(this) || this;
        _this._doc = _doc;
        _this._init();
        return _this;
      }
      BrowserPlatformLocation.prototype._init = function() {
        this._location = getDOM().getLocation();
        this._history = getDOM().getHistory();
      };
      Object.defineProperty(BrowserPlatformLocation.prototype, "location", {
        get: function() {
          return this._location;
        },
        enumerable: true,
        configurable: true
      });
      BrowserPlatformLocation.prototype.getBaseHrefFromDOM = function() {
        return ((getDOM().getBaseHref(this._doc)));
      };
      BrowserPlatformLocation.prototype.onPopState = function(fn) {
        getDOM().getGlobalEventTarget(this._doc, 'window').addEventListener('popstate', fn, false);
      };
      BrowserPlatformLocation.prototype.onHashChange = function(fn) {
        getDOM().getGlobalEventTarget(this._doc, 'window').addEventListener('hashchange', fn, false);
      };
      Object.defineProperty(BrowserPlatformLocation.prototype, "pathname", {
        get: function() {
          return this._location.pathname;
        },
        set: function(newPath) {
          this._location.pathname = newPath;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(BrowserPlatformLocation.prototype, "search", {
        get: function() {
          return this._location.search;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(BrowserPlatformLocation.prototype, "hash", {
        get: function() {
          return this._location.hash;
        },
        enumerable: true,
        configurable: true
      });
      BrowserPlatformLocation.prototype.pushState = function(state, title, url) {
        if (supportsState()) {
          this._history.pushState(state, title, url);
        } else {
          this._location.hash = url;
        }
      };
      BrowserPlatformLocation.prototype.replaceState = function(state, title, url) {
        if (supportsState()) {
          this._history.replaceState(state, title, url);
        } else {
          this._location.hash = url;
        }
      };
      BrowserPlatformLocation.prototype.forward = function() {
        this._history.forward();
      };
      BrowserPlatformLocation.prototype.back = function() {
        this._history.back();
      };
      return BrowserPlatformLocation;
    }(_angular_common.PlatformLocation));
    BrowserPlatformLocation.decorators = [{type: _angular_core.Injectable}];
    BrowserPlatformLocation.ctorParameters = function() {
      return [{
        type: undefined,
        decorators: [{
          type: _angular_core.Inject,
          args: [DOCUMENT]
        }]
      }];
    };
    var Meta = (function() {
      function Meta(_doc) {
        this._doc = _doc;
        this._dom = getDOM();
      }
      Meta.prototype.addTag = function(tag, forceCreation) {
        if (forceCreation === void 0) {
          forceCreation = false;
        }
        if (!tag)
          return null;
        return this._getOrCreateElement(tag, forceCreation);
      };
      Meta.prototype.addTags = function(tags, forceCreation) {
        var _this = this;
        if (forceCreation === void 0) {
          forceCreation = false;
        }
        if (!tags)
          return [];
        return tags.reduce(function(result, tag) {
          if (tag) {
            result.push(_this._getOrCreateElement(tag, forceCreation));
          }
          return result;
        }, []);
      };
      Meta.prototype.getTag = function(attrSelector) {
        if (!attrSelector)
          return null;
        return this._dom.querySelector(this._doc, "meta[" + attrSelector + "]");
      };
      Meta.prototype.getTags = function(attrSelector) {
        if (!attrSelector)
          return [];
        var list = this._dom.querySelectorAll(this._doc, "meta[" + attrSelector + "]");
        return list ? [].slice.call(list) : [];
      };
      Meta.prototype.updateTag = function(tag, selector) {
        if (!tag)
          return null;
        selector = selector || this._parseSelector(tag);
        var meta = ((this.getTag(selector)));
        if (meta) {
          return this._setMetaElementAttributes(tag, meta);
        }
        return this._getOrCreateElement(tag, true);
      };
      Meta.prototype.removeTag = function(attrSelector) {
        this.removeTagElement(((this.getTag(attrSelector))));
      };
      Meta.prototype.removeTagElement = function(meta) {
        if (meta) {
          this._dom.remove(meta);
        }
      };
      Meta.prototype._getOrCreateElement = function(meta, forceCreation) {
        if (forceCreation === void 0) {
          forceCreation = false;
        }
        if (!forceCreation) {
          var selector = this._parseSelector(meta);
          var elem = ((this.getTag(selector)));
          if (elem && this._containsAttributes(meta, elem))
            return elem;
        }
        var element = (this._dom.createElement('meta'));
        this._setMetaElementAttributes(meta, element);
        var head = this._dom.getElementsByTagName(this._doc, 'head')[0];
        this._dom.appendChild(head, element);
        return element;
      };
      Meta.prototype._setMetaElementAttributes = function(tag, el) {
        var _this = this;
        Object.keys(tag).forEach(function(prop) {
          return _this._dom.setAttribute(el, prop, tag[prop]);
        });
        return el;
      };
      Meta.prototype._parseSelector = function(tag) {
        var attr = tag.name ? 'name' : 'property';
        return attr + "=\"" + tag[attr] + "\"";
      };
      Meta.prototype._containsAttributes = function(tag, elem) {
        var _this = this;
        return Object.keys(tag).every(function(key) {
          return _this._dom.getAttribute(elem, key) === tag[key];
        });
      };
      return Meta;
    }());
    Meta.decorators = [{type: _angular_core.Injectable}];
    Meta.ctorParameters = function() {
      return [{
        type: undefined,
        decorators: [{
          type: _angular_core.Inject,
          args: [DOCUMENT]
        }]
      }];
    };
    var TRANSITION_ID = new _angular_core.InjectionToken('TRANSITION_ID');
    function appInitializerFactory(transitionId, document, injector) {
      return function() {
        injector.get(_angular_core.ApplicationInitStatus).donePromise.then(function() {
          var dom = getDOM();
          var styles = Array.prototype.slice.apply(dom.querySelectorAll(document, "style[ng-transition]"));
          styles.filter(function(el) {
            return dom.getAttribute(el, 'ng-transition') === transitionId;
          }).forEach(function(el) {
            return dom.remove(el);
          });
        });
      };
    }
    var SERVER_TRANSITION_PROVIDERS = [{
      provide: _angular_core.APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [TRANSITION_ID, DOCUMENT, _angular_core.Injector],
      multi: true
    }];
    var BrowserGetTestability = (function() {
      function BrowserGetTestability() {}
      BrowserGetTestability.init = function() {
        _angular_core.setTestabilityGetter(new BrowserGetTestability());
      };
      BrowserGetTestability.prototype.addToWindow = function(registry) {
        _angular_core.ɵglobal['getAngularTestability'] = function(elem, findInAncestors) {
          if (findInAncestors === void 0) {
            findInAncestors = true;
          }
          var testability = registry.findTestabilityInTree(elem, findInAncestors);
          if (testability == null) {
            throw new Error('Could not find testability for element.');
          }
          return testability;
        };
        _angular_core.ɵglobal['getAllAngularTestabilities'] = function() {
          return registry.getAllTestabilities();
        };
        _angular_core.ɵglobal['getAllAngularRootElements'] = function() {
          return registry.getAllRootElements();
        };
        var whenAllStable = function(callback) {
          var testabilities = _angular_core.ɵglobal['getAllAngularTestabilities']();
          var count = testabilities.length;
          var didWork = false;
          var decrement = function(didWork_) {
            didWork = didWork || didWork_;
            count--;
            if (count == 0) {
              callback(didWork);
            }
          };
          testabilities.forEach(function(testability) {
            testability.whenStable(decrement);
          });
        };
        if (!_angular_core.ɵglobal['frameworkStabilizers']) {
          _angular_core.ɵglobal['frameworkStabilizers'] = [];
        }
        _angular_core.ɵglobal['frameworkStabilizers'].push(whenAllStable);
      };
      BrowserGetTestability.prototype.findTestabilityInTree = function(registry, elem, findInAncestors) {
        if (elem == null) {
          return null;
        }
        var t = registry.getTestability(elem);
        if (t != null) {
          return t;
        } else if (!findInAncestors) {
          return null;
        }
        if (getDOM().isShadowRoot(elem)) {
          return this.findTestabilityInTree(registry, getDOM().getHost(elem), true);
        }
        return this.findTestabilityInTree(registry, getDOM().parentElement(elem), true);
      };
      return BrowserGetTestability;
    }());
    var Title = (function() {
      function Title(_doc) {
        this._doc = _doc;
      }
      Title.prototype.getTitle = function() {
        return getDOM().getTitle(this._doc);
      };
      Title.prototype.setTitle = function(newTitle) {
        getDOM().setTitle(this._doc, newTitle);
      };
      return Title;
    }());
    Title.decorators = [{type: _angular_core.Injectable}];
    Title.ctorParameters = function() {
      return [{
        type: undefined,
        decorators: [{
          type: _angular_core.Inject,
          args: [DOCUMENT]
        }]
      }];
    };
    function exportNgVar(name, value) {
      if (!ng) {
        _angular_core.ɵglobal['ng'] = ng = ((_angular_core.ɵglobal['ng'])) || {};
      }
      ng[name] = value;
    }
    var ng;
    var CORE_TOKENS = {
      'ApplicationRef': _angular_core.ApplicationRef,
      'NgZone': _angular_core.NgZone
    };
    var INSPECT_GLOBAL_NAME = 'probe';
    var CORE_TOKENS_GLOBAL_NAME = 'coreTokens';
    function inspectNativeElement(element) {
      return _angular_core.getDebugNode(element);
    }
    var NgProbeToken$1 = (function() {
      function NgProbeToken$1(name, token) {
        this.name = name;
        this.token = token;
      }
      return NgProbeToken$1;
    }());
    function _createNgProbe(extraTokens, coreTokens) {
      var tokens = (extraTokens || []).concat(coreTokens || []);
      exportNgVar(INSPECT_GLOBAL_NAME, inspectNativeElement);
      exportNgVar(CORE_TOKENS_GLOBAL_NAME, Object.assign({}, CORE_TOKENS, _ngProbeTokensToMap(tokens || [])));
      return function() {
        return inspectNativeElement;
      };
    }
    function _ngProbeTokensToMap(tokens) {
      return tokens.reduce(function(prev, t) {
        return (prev[t.name] = t.token, prev);
      }, {});
    }
    var ELEMENT_PROBE_PROVIDERS = [{
      provide: _angular_core.APP_INITIALIZER,
      useFactory: _createNgProbe,
      deps: [[NgProbeToken$1, new _angular_core.Optional()], [_angular_core.NgProbeToken, new _angular_core.Optional()]],
      multi: true
    }];
    var EVENT_MANAGER_PLUGINS = new _angular_core.InjectionToken('EventManagerPlugins');
    var EventManager = (function() {
      function EventManager(plugins, _zone) {
        var _this = this;
        this._zone = _zone;
        this._eventNameToPlugin = new Map();
        plugins.forEach(function(p) {
          return p.manager = _this;
        });
        this._plugins = plugins.slice().reverse();
      }
      EventManager.prototype.addEventListener = function(element, eventName, handler) {
        var plugin = this._findPluginFor(eventName);
        return plugin.addEventListener(element, eventName, handler);
      };
      EventManager.prototype.addGlobalEventListener = function(target, eventName, handler) {
        var plugin = this._findPluginFor(eventName);
        return plugin.addGlobalEventListener(target, eventName, handler);
      };
      EventManager.prototype.getZone = function() {
        return this._zone;
      };
      EventManager.prototype._findPluginFor = function(eventName) {
        var plugin = this._eventNameToPlugin.get(eventName);
        if (plugin) {
          return plugin;
        }
        var plugins = this._plugins;
        for (var i = 0; i < plugins.length; i++) {
          var plugin_1 = plugins[i];
          if (plugin_1.supports(eventName)) {
            this._eventNameToPlugin.set(eventName, plugin_1);
            return plugin_1;
          }
        }
        throw new Error("No event manager plugin found for event " + eventName);
      };
      return EventManager;
    }());
    EventManager.decorators = [{type: _angular_core.Injectable}];
    EventManager.ctorParameters = function() {
      return [{
        type: Array,
        decorators: [{
          type: _angular_core.Inject,
          args: [EVENT_MANAGER_PLUGINS]
        }]
      }, {type: _angular_core.NgZone}];
    };
    var EventManagerPlugin = (function() {
      function EventManagerPlugin(_doc) {
        this._doc = _doc;
      }
      EventManagerPlugin.prototype.supports = function(eventName) {};
      EventManagerPlugin.prototype.addEventListener = function(element, eventName, handler) {};
      EventManagerPlugin.prototype.addGlobalEventListener = function(element, eventName, handler) {
        var target = getDOM().getGlobalEventTarget(this._doc, element);
        if (!target) {
          throw new Error("Unsupported event target " + target + " for event " + eventName);
        }
        return this.addEventListener(target, eventName, handler);
      };
      return EventManagerPlugin;
    }());
    var SharedStylesHost = (function() {
      function SharedStylesHost() {
        this._stylesSet = new Set();
      }
      SharedStylesHost.prototype.addStyles = function(styles) {
        var _this = this;
        var additions = new Set();
        styles.forEach(function(style) {
          if (!_this._stylesSet.has(style)) {
            _this._stylesSet.add(style);
            additions.add(style);
          }
        });
        this.onStylesAdded(additions);
      };
      SharedStylesHost.prototype.onStylesAdded = function(additions) {};
      SharedStylesHost.prototype.getAllStyles = function() {
        return Array.from(this._stylesSet);
      };
      return SharedStylesHost;
    }());
    SharedStylesHost.decorators = [{type: _angular_core.Injectable}];
    SharedStylesHost.ctorParameters = function() {
      return [];
    };
    var DomSharedStylesHost = (function(_super) {
      __extends(DomSharedStylesHost, _super);
      function DomSharedStylesHost(_doc) {
        var _this = _super.call(this) || this;
        _this._doc = _doc;
        _this._hostNodes = new Set();
        _this._styleNodes = new Set();
        _this._hostNodes.add(_doc.head);
        return _this;
      }
      DomSharedStylesHost.prototype._addStylesToHost = function(styles, host) {
        var _this = this;
        styles.forEach(function(style) {
          var styleEl = _this._doc.createElement('style');
          styleEl.textContent = style;
          _this._styleNodes.add(host.appendChild(styleEl));
        });
      };
      DomSharedStylesHost.prototype.addHost = function(hostNode) {
        this._addStylesToHost(this._stylesSet, hostNode);
        this._hostNodes.add(hostNode);
      };
      DomSharedStylesHost.prototype.removeHost = function(hostNode) {
        this._hostNodes.delete(hostNode);
      };
      DomSharedStylesHost.prototype.onStylesAdded = function(additions) {
        var _this = this;
        this._hostNodes.forEach(function(hostNode) {
          return _this._addStylesToHost(additions, hostNode);
        });
      };
      DomSharedStylesHost.prototype.ngOnDestroy = function() {
        this._styleNodes.forEach(function(styleNode) {
          return getDOM().remove(styleNode);
        });
      };
      return DomSharedStylesHost;
    }(SharedStylesHost));
    DomSharedStylesHost.decorators = [{type: _angular_core.Injectable}];
    DomSharedStylesHost.ctorParameters = function() {
      return [{
        type: undefined,
        decorators: [{
          type: _angular_core.Inject,
          args: [DOCUMENT]
        }]
      }];
    };
    var NAMESPACE_URIS = {
      'svg': 'http://www.w3.org/2000/svg',
      'xhtml': 'http://www.w3.org/1999/xhtml',
      'xlink': 'http://www.w3.org/1999/xlink',
      'xml': 'http://www.w3.org/XML/1998/namespace',
      'xmlns': 'http://www.w3.org/2000/xmlns/'
    };
    var COMPONENT_REGEX = /%COMP%/g;
    var COMPONENT_VARIABLE = '%COMP%';
    var HOST_ATTR = "_nghost-" + COMPONENT_VARIABLE;
    var CONTENT_ATTR = "_ngcontent-" + COMPONENT_VARIABLE;
    function shimContentAttribute(componentShortId) {
      return CONTENT_ATTR.replace(COMPONENT_REGEX, componentShortId);
    }
    function shimHostAttribute(componentShortId) {
      return HOST_ATTR.replace(COMPONENT_REGEX, componentShortId);
    }
    function flattenStyles(compId, styles, target) {
      for (var i = 0; i < styles.length; i++) {
        var style = styles[i];
        if (Array.isArray(style)) {
          flattenStyles(compId, style, target);
        } else {
          style = style.replace(COMPONENT_REGEX, compId);
          target.push(style);
        }
      }
      return target;
    }
    function decoratePreventDefault(eventHandler) {
      return function(event) {
        var allowDefaultBehavior = eventHandler(event);
        if (allowDefaultBehavior === false) {
          event.preventDefault();
          event.returnValue = false;
        }
      };
    }
    var DomRendererFactory2 = (function() {
      function DomRendererFactory2(eventManager, sharedStylesHost) {
        this.eventManager = eventManager;
        this.sharedStylesHost = sharedStylesHost;
        this.rendererByCompId = new Map();
        this.defaultRenderer = new DefaultDomRenderer2(eventManager);
      }
      DomRendererFactory2.prototype.createRenderer = function(element, type) {
        if (!element || !type) {
          return this.defaultRenderer;
        }
        switch (type.encapsulation) {
          case _angular_core.ViewEncapsulation.Emulated:
            {
              var renderer = this.rendererByCompId.get(type.id);
              if (!renderer) {
                renderer = new EmulatedEncapsulationDomRenderer2(this.eventManager, this.sharedStylesHost, type);
                this.rendererByCompId.set(type.id, renderer);
              }
              ((renderer)).applyToHost(element);
              return renderer;
            }
          case _angular_core.ViewEncapsulation.Native:
            return new ShadowDomRenderer(this.eventManager, this.sharedStylesHost, element, type);
          default:
            {
              if (!this.rendererByCompId.has(type.id)) {
                var styles = flattenStyles(type.id, type.styles, []);
                this.sharedStylesHost.addStyles(styles);
                this.rendererByCompId.set(type.id, this.defaultRenderer);
              }
              return this.defaultRenderer;
            }
        }
      };
      DomRendererFactory2.prototype.begin = function() {};
      DomRendererFactory2.prototype.end = function() {};
      return DomRendererFactory2;
    }());
    DomRendererFactory2.decorators = [{type: _angular_core.Injectable}];
    DomRendererFactory2.ctorParameters = function() {
      return [{type: EventManager}, {type: DomSharedStylesHost}];
    };
    var DefaultDomRenderer2 = (function() {
      function DefaultDomRenderer2(eventManager) {
        this.eventManager = eventManager;
        this.data = Object.create(null);
      }
      DefaultDomRenderer2.prototype.destroy = function() {};
      DefaultDomRenderer2.prototype.createElement = function(name, namespace) {
        if (namespace) {
          return document.createElementNS(NAMESPACE_URIS[namespace], name);
        }
        return document.createElement(name);
      };
      DefaultDomRenderer2.prototype.createComment = function(value) {
        return document.createComment(value);
      };
      DefaultDomRenderer2.prototype.createText = function(value) {
        return document.createTextNode(value);
      };
      DefaultDomRenderer2.prototype.appendChild = function(parent, newChild) {
        parent.appendChild(newChild);
      };
      DefaultDomRenderer2.prototype.insertBefore = function(parent, newChild, refChild) {
        if (parent) {
          parent.insertBefore(newChild, refChild);
        }
      };
      DefaultDomRenderer2.prototype.removeChild = function(parent, oldChild) {
        if (parent) {
          parent.removeChild(oldChild);
        }
      };
      DefaultDomRenderer2.prototype.selectRootElement = function(selectorOrNode) {
        var el = typeof selectorOrNode === 'string' ? document.querySelector(selectorOrNode) : selectorOrNode;
        if (!el) {
          throw new Error("The selector \"" + selectorOrNode + "\" did not match any elements");
        }
        el.textContent = '';
        return el;
      };
      DefaultDomRenderer2.prototype.parentNode = function(node) {
        return node.parentNode;
      };
      DefaultDomRenderer2.prototype.nextSibling = function(node) {
        return node.nextSibling;
      };
      DefaultDomRenderer2.prototype.setAttribute = function(el, name, value, namespace) {
        if (namespace) {
          name = namespace + ":" + name;
          var namespaceUri = NAMESPACE_URIS[namespace];
          if (namespaceUri) {
            el.setAttributeNS(namespaceUri, name, value);
          } else {
            el.setAttribute(name, value);
          }
        } else {
          el.setAttribute(name, value);
        }
      };
      DefaultDomRenderer2.prototype.removeAttribute = function(el, name, namespace) {
        if (namespace) {
          var namespaceUri = NAMESPACE_URIS[namespace];
          if (namespaceUri) {
            el.removeAttributeNS(namespaceUri, name);
          } else {
            el.removeAttribute(namespace + ":" + name);
          }
        } else {
          el.removeAttribute(name);
        }
      };
      DefaultDomRenderer2.prototype.addClass = function(el, name) {
        el.classList.add(name);
      };
      DefaultDomRenderer2.prototype.removeClass = function(el, name) {
        el.classList.remove(name);
      };
      DefaultDomRenderer2.prototype.setStyle = function(el, style, value, flags) {
        if (flags & _angular_core.RendererStyleFlags2.DashCase) {
          el.style.setProperty(style, value, !!(flags & _angular_core.RendererStyleFlags2.Important) ? 'important' : '');
        } else {
          el.style[style] = value;
        }
      };
      DefaultDomRenderer2.prototype.removeStyle = function(el, style, flags) {
        if (flags & _angular_core.RendererStyleFlags2.DashCase) {
          el.style.removeProperty(style);
        } else {
          el.style[style] = '';
        }
      };
      DefaultDomRenderer2.prototype.setProperty = function(el, name, value) {
        checkNoSyntheticProp(name, 'property');
        el[name] = value;
      };
      DefaultDomRenderer2.prototype.setValue = function(node, value) {
        node.nodeValue = value;
      };
      DefaultDomRenderer2.prototype.listen = function(target, event, callback) {
        checkNoSyntheticProp(event, 'listener');
        if (typeof target === 'string') {
          return (this.eventManager.addGlobalEventListener(target, event, decoratePreventDefault(callback)));
        }
        return ((this.eventManager.addEventListener(target, event, decoratePreventDefault(callback))));
      };
      return DefaultDomRenderer2;
    }());
    var AT_CHARCODE = '@'.charCodeAt(0);
    function checkNoSyntheticProp(name, nameKind) {
      if (name.charCodeAt(0) === AT_CHARCODE) {
        throw new Error("Found the synthetic " + nameKind + " " + name + ". Please include either \"BrowserAnimationsModule\" or \"NoopAnimationsModule\" in your application.");
      }
    }
    var EmulatedEncapsulationDomRenderer2 = (function(_super) {
      __extends(EmulatedEncapsulationDomRenderer2, _super);
      function EmulatedEncapsulationDomRenderer2(eventManager, sharedStylesHost, component) {
        var _this = _super.call(this, eventManager) || this;
        _this.component = component;
        var styles = flattenStyles(component.id, component.styles, []);
        sharedStylesHost.addStyles(styles);
        _this.contentAttr = shimContentAttribute(component.id);
        _this.hostAttr = shimHostAttribute(component.id);
        return _this;
      }
      EmulatedEncapsulationDomRenderer2.prototype.applyToHost = function(element) {
        _super.prototype.setAttribute.call(this, element, this.hostAttr, '');
      };
      EmulatedEncapsulationDomRenderer2.prototype.createElement = function(parent, name) {
        var el = _super.prototype.createElement.call(this, parent, name);
        _super.prototype.setAttribute.call(this, el, this.contentAttr, '');
        return el;
      };
      return EmulatedEncapsulationDomRenderer2;
    }(DefaultDomRenderer2));
    var ShadowDomRenderer = (function(_super) {
      __extends(ShadowDomRenderer, _super);
      function ShadowDomRenderer(eventManager, sharedStylesHost, hostEl, component) {
        var _this = _super.call(this, eventManager) || this;
        _this.sharedStylesHost = sharedStylesHost;
        _this.hostEl = hostEl;
        _this.component = component;
        _this.shadowRoot = hostEl.createShadowRoot();
        _this.sharedStylesHost.addHost(_this.shadowRoot);
        var styles = flattenStyles(component.id, component.styles, []);
        for (var i = 0; i < styles.length; i++) {
          var styleEl = document.createElement('style');
          styleEl.textContent = styles[i];
          _this.shadowRoot.appendChild(styleEl);
        }
        return _this;
      }
      ShadowDomRenderer.prototype.nodeOrShadowRoot = function(node) {
        return node === this.hostEl ? this.shadowRoot : node;
      };
      ShadowDomRenderer.prototype.destroy = function() {
        this.sharedStylesHost.removeHost(this.shadowRoot);
      };
      ShadowDomRenderer.prototype.appendChild = function(parent, newChild) {
        return _super.prototype.appendChild.call(this, this.nodeOrShadowRoot(parent), newChild);
      };
      ShadowDomRenderer.prototype.insertBefore = function(parent, newChild, refChild) {
        return _super.prototype.insertBefore.call(this, this.nodeOrShadowRoot(parent), newChild, refChild);
      };
      ShadowDomRenderer.prototype.removeChild = function(parent, oldChild) {
        return _super.prototype.removeChild.call(this, this.nodeOrShadowRoot(parent), oldChild);
      };
      ShadowDomRenderer.prototype.parentNode = function(node) {
        return this.nodeOrShadowRoot(_super.prototype.parentNode.call(this, this.nodeOrShadowRoot(node)));
      };
      return ShadowDomRenderer;
    }(DefaultDomRenderer2));
    var DomEventsPlugin = (function(_super) {
      __extends(DomEventsPlugin, _super);
      function DomEventsPlugin(doc) {
        return _super.call(this, doc) || this;
      }
      DomEventsPlugin.prototype.supports = function(eventName) {
        return true;
      };
      DomEventsPlugin.prototype.addEventListener = function(element, eventName, handler) {
        element.addEventListener(eventName, (handler), false);
        return function() {
          return element.removeEventListener(eventName, (handler), false);
        };
      };
      return DomEventsPlugin;
    }(EventManagerPlugin));
    DomEventsPlugin.decorators = [{type: _angular_core.Injectable}];
    DomEventsPlugin.ctorParameters = function() {
      return [{
        type: undefined,
        decorators: [{
          type: _angular_core.Inject,
          args: [DOCUMENT]
        }]
      }];
    };
    var EVENT_NAMES = {
      'pan': true,
      'panstart': true,
      'panmove': true,
      'panend': true,
      'pancancel': true,
      'panleft': true,
      'panright': true,
      'panup': true,
      'pandown': true,
      'pinch': true,
      'pinchstart': true,
      'pinchmove': true,
      'pinchend': true,
      'pinchcancel': true,
      'pinchin': true,
      'pinchout': true,
      'press': true,
      'pressup': true,
      'rotate': true,
      'rotatestart': true,
      'rotatemove': true,
      'rotateend': true,
      'rotatecancel': true,
      'swipe': true,
      'swipeleft': true,
      'swiperight': true,
      'swipeup': true,
      'swipedown': true,
      'tap': true
    };
    var HAMMER_GESTURE_CONFIG = new _angular_core.InjectionToken('HammerGestureConfig');
    var HammerGestureConfig = (function() {
      function HammerGestureConfig() {
        this.events = [];
        this.overrides = {};
      }
      HammerGestureConfig.prototype.buildHammer = function(element) {
        var mc = new Hammer(element);
        mc.get('pinch').set({enable: true});
        mc.get('rotate').set({enable: true});
        for (var eventName in this.overrides) {
          mc.get(eventName).set(this.overrides[eventName]);
        }
        return mc;
      };
      return HammerGestureConfig;
    }());
    HammerGestureConfig.decorators = [{type: _angular_core.Injectable}];
    HammerGestureConfig.ctorParameters = function() {
      return [];
    };
    var HammerGesturesPlugin = (function(_super) {
      __extends(HammerGesturesPlugin, _super);
      function HammerGesturesPlugin(doc, _config) {
        var _this = _super.call(this, doc) || this;
        _this._config = _config;
        return _this;
      }
      HammerGesturesPlugin.prototype.supports = function(eventName) {
        if (!EVENT_NAMES.hasOwnProperty(eventName.toLowerCase()) && !this.isCustomEvent(eventName)) {
          return false;
        }
        if (!((window)).Hammer) {
          throw new Error("Hammer.js is not loaded, can not bind " + eventName + " event");
        }
        return true;
      };
      HammerGesturesPlugin.prototype.addEventListener = function(element, eventName, handler) {
        var _this = this;
        var zone = this.manager.getZone();
        eventName = eventName.toLowerCase();
        return zone.runOutsideAngular(function() {
          var mc = _this._config.buildHammer(element);
          var callback = function(eventObj) {
            zone.runGuarded(function() {
              handler(eventObj);
            });
          };
          mc.on(eventName, callback);
          return function() {
            return mc.off(eventName, callback);
          };
        });
      };
      HammerGesturesPlugin.prototype.isCustomEvent = function(eventName) {
        return this._config.events.indexOf(eventName) > -1;
      };
      return HammerGesturesPlugin;
    }(EventManagerPlugin));
    HammerGesturesPlugin.decorators = [{type: _angular_core.Injectable}];
    HammerGesturesPlugin.ctorParameters = function() {
      return [{
        type: undefined,
        decorators: [{
          type: _angular_core.Inject,
          args: [DOCUMENT]
        }]
      }, {
        type: HammerGestureConfig,
        decorators: [{
          type: _angular_core.Inject,
          args: [HAMMER_GESTURE_CONFIG]
        }]
      }];
    };
    var MODIFIER_KEYS = ['alt', 'control', 'meta', 'shift'];
    var MODIFIER_KEY_GETTERS = {
      'alt': function(event) {
        return event.altKey;
      },
      'control': function(event) {
        return event.ctrlKey;
      },
      'meta': function(event) {
        return event.metaKey;
      },
      'shift': function(event) {
        return event.shiftKey;
      }
    };
    var KeyEventsPlugin = (function(_super) {
      __extends(KeyEventsPlugin, _super);
      function KeyEventsPlugin(doc) {
        return _super.call(this, doc) || this;
      }
      KeyEventsPlugin.prototype.supports = function(eventName) {
        return KeyEventsPlugin.parseEventName(eventName) != null;
      };
      KeyEventsPlugin.prototype.addEventListener = function(element, eventName, handler) {
        var parsedEvent = ((KeyEventsPlugin.parseEventName(eventName)));
        var outsideHandler = KeyEventsPlugin.eventCallback(parsedEvent['fullKey'], handler, this.manager.getZone());
        return this.manager.getZone().runOutsideAngular(function() {
          return getDOM().onAndCancel(element, parsedEvent['domEventName'], outsideHandler);
        });
      };
      KeyEventsPlugin.parseEventName = function(eventName) {
        var parts = eventName.toLowerCase().split('.');
        var domEventName = parts.shift();
        if ((parts.length === 0) || !(domEventName === 'keydown' || domEventName === 'keyup')) {
          return null;
        }
        var key = KeyEventsPlugin._normalizeKey(((parts.pop())));
        var fullKey = '';
        MODIFIER_KEYS.forEach(function(modifierName) {
          var index = parts.indexOf(modifierName);
          if (index > -1) {
            parts.splice(index, 1);
            fullKey += modifierName + '.';
          }
        });
        fullKey += key;
        if (parts.length != 0 || key.length === 0) {
          return null;
        }
        var result = {};
        result['domEventName'] = domEventName;
        result['fullKey'] = fullKey;
        return result;
      };
      KeyEventsPlugin.getEventFullKey = function(event) {
        var fullKey = '';
        var key = getDOM().getEventKey(event);
        key = key.toLowerCase();
        if (key === ' ') {
          key = 'space';
        } else if (key === '.') {
          key = 'dot';
        }
        MODIFIER_KEYS.forEach(function(modifierName) {
          if (modifierName != key) {
            var modifierGetter = MODIFIER_KEY_GETTERS[modifierName];
            if (modifierGetter(event)) {
              fullKey += modifierName + '.';
            }
          }
        });
        fullKey += key;
        return fullKey;
      };
      KeyEventsPlugin.eventCallback = function(fullKey, handler, zone) {
        return function(event) {
          if (KeyEventsPlugin.getEventFullKey(event) === fullKey) {
            zone.runGuarded(function() {
              return handler(event);
            });
          }
        };
      };
      KeyEventsPlugin._normalizeKey = function(keyName) {
        switch (keyName) {
          case 'esc':
            return 'escape';
          default:
            return keyName;
        }
      };
      return KeyEventsPlugin;
    }(EventManagerPlugin));
    KeyEventsPlugin.decorators = [{type: _angular_core.Injectable}];
    KeyEventsPlugin.ctorParameters = function() {
      return [{
        type: undefined,
        decorators: [{
          type: _angular_core.Inject,
          args: [DOCUMENT]
        }]
      }];
    };
    var SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file):|[^&:/?#]*(?:[/?#]|$))/gi;
    var DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+\/]+=*$/i;
    function sanitizeUrl(url) {
      url = String(url);
      if (url.match(SAFE_URL_PATTERN) || url.match(DATA_URL_PATTERN))
        return url;
      if (_angular_core.isDevMode()) {
        getDOM().log("WARNING: sanitizing unsafe URL value " + url + " (see http://g.co/ng/security#xss)");
      }
      return 'unsafe:' + url;
    }
    function sanitizeSrcset(srcset) {
      srcset = String(srcset);
      return srcset.split(',').map(function(srcset) {
        return sanitizeUrl(srcset.trim());
      }).join(', ');
    }
    var inertElement = null;
    var DOM = null;
    function getInertElement() {
      if (inertElement)
        return inertElement;
      DOM = getDOM();
      var templateEl = DOM.createElement('template');
      if ('content' in templateEl)
        return templateEl;
      var doc = DOM.createHtmlDocument();
      inertElement = DOM.querySelector(doc, 'body');
      if (inertElement == null) {
        var html = DOM.createElement('html', doc);
        inertElement = DOM.createElement('body', doc);
        DOM.appendChild(html, inertElement);
        DOM.appendChild(doc, html);
      }
      return inertElement;
    }
    function tagSet(tags) {
      var res = {};
      for (var _i = 0,
          _a = tags.split(','); _i < _a.length; _i++) {
        var t = _a[_i];
        res[t] = true;
      }
      return res;
    }
    function merge() {
      var sets = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        sets[_i] = arguments[_i];
      }
      var res = {};
      for (var _a = 0,
          sets_1 = sets; _a < sets_1.length; _a++) {
        var s = sets_1[_a];
        for (var v in s) {
          if (s.hasOwnProperty(v))
            res[v] = true;
        }
      }
      return res;
    }
    var VOID_ELEMENTS = tagSet('area,br,col,hr,img,wbr');
    var OPTIONAL_END_TAG_BLOCK_ELEMENTS = tagSet('colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr');
    var OPTIONAL_END_TAG_INLINE_ELEMENTS = tagSet('rp,rt');
    var OPTIONAL_END_TAG_ELEMENTS = merge(OPTIONAL_END_TAG_INLINE_ELEMENTS, OPTIONAL_END_TAG_BLOCK_ELEMENTS);
    var BLOCK_ELEMENTS = merge(OPTIONAL_END_TAG_BLOCK_ELEMENTS, tagSet('address,article,' + 'aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,' + 'h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul'));
    var INLINE_ELEMENTS = merge(OPTIONAL_END_TAG_INLINE_ELEMENTS, tagSet('a,abbr,acronym,audio,b,' + 'bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s,' + 'samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video'));
    var VALID_ELEMENTS = merge(VOID_ELEMENTS, BLOCK_ELEMENTS, INLINE_ELEMENTS, OPTIONAL_END_TAG_ELEMENTS);
    var URI_ATTRS = tagSet('background,cite,href,itemtype,longdesc,poster,src,xlink:href');
    var SRCSET_ATTRS = tagSet('srcset');
    var HTML_ATTRS = tagSet('abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,' + 'compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace,' + 'ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules,' + 'scope,scrolling,shape,size,sizes,span,srclang,start,summary,tabindex,target,title,translate,type,usemap,' + 'valign,value,vspace,width');
    var VALID_ATTRS = merge(URI_ATTRS, SRCSET_ATTRS, HTML_ATTRS);
    var SanitizingHtmlSerializer = (function() {
      function SanitizingHtmlSerializer() {
        this.sanitizedSomething = false;
        this.buf = [];
      }
      SanitizingHtmlSerializer.prototype.sanitizeChildren = function(el) {
        var current = ((el.firstChild));
        while (current) {
          if (DOM.isElementNode(current)) {
            this.startElement((current));
          } else if (DOM.isTextNode(current)) {
            this.chars(((DOM.nodeValue(current))));
          } else {
            this.sanitizedSomething = true;
          }
          if (DOM.firstChild(current)) {
            current = ((DOM.firstChild(current)));
            continue;
          }
          while (current) {
            if (DOM.isElementNode(current)) {
              this.endElement((current));
            }
            var next = checkClobberedElement(current, ((DOM.nextSibling(current))));
            if (next) {
              current = next;
              break;
            }
            current = checkClobberedElement(current, ((DOM.parentElement(current))));
          }
        }
        return this.buf.join('');
      };
      SanitizingHtmlSerializer.prototype.startElement = function(element) {
        var _this = this;
        var tagName = DOM.nodeName(element).toLowerCase();
        if (!VALID_ELEMENTS.hasOwnProperty(tagName)) {
          this.sanitizedSomething = true;
          return;
        }
        this.buf.push('<');
        this.buf.push(tagName);
        DOM.attributeMap(element).forEach(function(value, attrName) {
          var lower = attrName.toLowerCase();
          if (!VALID_ATTRS.hasOwnProperty(lower)) {
            _this.sanitizedSomething = true;
            return;
          }
          if (URI_ATTRS[lower])
            value = sanitizeUrl(value);
          if (SRCSET_ATTRS[lower])
            value = sanitizeSrcset(value);
          _this.buf.push(' ');
          _this.buf.push(attrName);
          _this.buf.push('="');
          _this.buf.push(encodeEntities(value));
          _this.buf.push('"');
        });
        this.buf.push('>');
      };
      SanitizingHtmlSerializer.prototype.endElement = function(current) {
        var tagName = DOM.nodeName(current).toLowerCase();
        if (VALID_ELEMENTS.hasOwnProperty(tagName) && !VOID_ELEMENTS.hasOwnProperty(tagName)) {
          this.buf.push('</');
          this.buf.push(tagName);
          this.buf.push('>');
        }
      };
      SanitizingHtmlSerializer.prototype.chars = function(chars) {
        this.buf.push(encodeEntities(chars));
      };
      return SanitizingHtmlSerializer;
    }());
    function checkClobberedElement(node, nextNode) {
      if (nextNode && DOM.contains(node, nextNode)) {
        throw new Error("Failed to sanitize html because the element is clobbered: " + DOM.getOuterHTML(node));
      }
      return nextNode;
    }
    var SURROGATE_PAIR_REGEXP = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
    var NON_ALPHANUMERIC_REGEXP = /([^\#-~ |!])/g;
    function encodeEntities(value) {
      return value.replace(/&/g, '&amp;').replace(SURROGATE_PAIR_REGEXP, function(match) {
        var hi = match.charCodeAt(0);
        var low = match.charCodeAt(1);
        return '&#' + (((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000) + ';';
      }).replace(NON_ALPHANUMERIC_REGEXP, function(match) {
        return '&#' + match.charCodeAt(0) + ';';
      }).replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    function stripCustomNsAttrs(el) {
      DOM.attributeMap(el).forEach(function(_, attrName) {
        if (attrName === 'xmlns:ns1' || attrName.indexOf('ns1:') === 0) {
          DOM.removeAttribute(el, attrName);
        }
      });
      for (var _i = 0,
          _a = DOM.childNodesAsList(el); _i < _a.length; _i++) {
        var n = _a[_i];
        if (DOM.isElementNode(n))
          stripCustomNsAttrs((n));
      }
    }
    function sanitizeHtml(defaultDoc, unsafeHtmlInput) {
      try {
        var containerEl = getInertElement();
        var unsafeHtml = unsafeHtmlInput ? String(unsafeHtmlInput) : '';
        var mXSSAttempts = 5;
        var parsedHtml = unsafeHtml;
        do {
          if (mXSSAttempts === 0) {
            throw new Error('Failed to sanitize html because the input is unstable');
          }
          mXSSAttempts--;
          unsafeHtml = parsedHtml;
          DOM.setInnerHTML(containerEl, unsafeHtml);
          if (defaultDoc.documentMode) {
            stripCustomNsAttrs(containerEl);
          }
          parsedHtml = DOM.getInnerHTML(containerEl);
        } while (unsafeHtml !== parsedHtml);
        var sanitizer = new SanitizingHtmlSerializer();
        var safeHtml = sanitizer.sanitizeChildren(DOM.getTemplateContent(containerEl) || containerEl);
        var parent = DOM.getTemplateContent(containerEl) || containerEl;
        for (var _i = 0,
            _a = DOM.childNodesAsList(parent); _i < _a.length; _i++) {
          var child = _a[_i];
          DOM.removeChild(parent, child);
        }
        if (_angular_core.isDevMode() && sanitizer.sanitizedSomething) {
          DOM.log('WARNING: sanitizing HTML stripped some content (see http://g.co/ng/security#xss).');
        }
        return safeHtml;
      } catch (e) {
        inertElement = null;
        throw e;
      }
    }
    var VALUES = '[-,."\'%_!# a-zA-Z0-9]+';
    var TRANSFORMATION_FNS = '(?:matrix|translate|scale|rotate|skew|perspective)(?:X|Y|3d)?';
    var COLOR_FNS = '(?:rgb|hsl)a?';
    var GRADIENTS = '(?:repeating-)?(?:linear|radial)-gradient';
    var CSS3_FNS = '(?:calc|attr)';
    var FN_ARGS = '\\([-0-9.%, #a-zA-Z]+\\)';
    var SAFE_STYLE_VALUE = new RegExp("^(" + VALUES + "|" + ("(?:" + TRANSFORMATION_FNS + "|" + COLOR_FNS + "|" + GRADIENTS + "|" + CSS3_FNS + ")") + (FN_ARGS + ")$"), 'g');
    var URL_RE = /^url\(([^)]+)\)$/;
    function hasBalancedQuotes(value) {
      var outsideSingle = true;
      var outsideDouble = true;
      for (var i = 0; i < value.length; i++) {
        var c = value.charAt(i);
        if (c === '\'' && outsideDouble) {
          outsideSingle = !outsideSingle;
        } else if (c === '"' && outsideSingle) {
          outsideDouble = !outsideDouble;
        }
      }
      return outsideSingle && outsideDouble;
    }
    function sanitizeStyle(value) {
      value = String(value).trim();
      if (!value)
        return '';
      var urlMatch = value.match(URL_RE);
      if ((urlMatch && sanitizeUrl(urlMatch[1]) === urlMatch[1]) || value.match(SAFE_STYLE_VALUE) && hasBalancedQuotes(value)) {
        return value;
      }
      if (_angular_core.isDevMode()) {
        getDOM().log("WARNING: sanitizing unsafe style value " + value + " (see http://g.co/ng/security#xss).");
      }
      return 'unsafe';
    }
    var DomSanitizer = (function() {
      function DomSanitizer() {}
      DomSanitizer.prototype.sanitize = function(context, value) {};
      DomSanitizer.prototype.bypassSecurityTrustHtml = function(value) {};
      DomSanitizer.prototype.bypassSecurityTrustStyle = function(value) {};
      DomSanitizer.prototype.bypassSecurityTrustScript = function(value) {};
      DomSanitizer.prototype.bypassSecurityTrustUrl = function(value) {};
      DomSanitizer.prototype.bypassSecurityTrustResourceUrl = function(value) {};
      return DomSanitizer;
    }());
    var DomSanitizerImpl = (function(_super) {
      __extends(DomSanitizerImpl, _super);
      function DomSanitizerImpl(_doc) {
        var _this = _super.call(this) || this;
        _this._doc = _doc;
        return _this;
      }
      DomSanitizerImpl.prototype.sanitize = function(ctx, value) {
        if (value == null)
          return null;
        switch (ctx) {
          case _angular_core.SecurityContext.NONE:
            return (value);
          case _angular_core.SecurityContext.HTML:
            if (value instanceof SafeHtmlImpl)
              return value.changingThisBreaksApplicationSecurity;
            this.checkNotSafeValue(value, 'HTML');
            return sanitizeHtml(this._doc, String(value));
          case _angular_core.SecurityContext.STYLE:
            if (value instanceof SafeStyleImpl)
              return value.changingThisBreaksApplicationSecurity;
            this.checkNotSafeValue(value, 'Style');
            return sanitizeStyle((value));
          case _angular_core.SecurityContext.SCRIPT:
            if (value instanceof SafeScriptImpl)
              return value.changingThisBreaksApplicationSecurity;
            this.checkNotSafeValue(value, 'Script');
            throw new Error('unsafe value used in a script context');
          case _angular_core.SecurityContext.URL:
            if (value instanceof SafeResourceUrlImpl || value instanceof SafeUrlImpl) {
              return value.changingThisBreaksApplicationSecurity;
            }
            this.checkNotSafeValue(value, 'URL');
            return sanitizeUrl(String(value));
          case _angular_core.SecurityContext.RESOURCE_URL:
            if (value instanceof SafeResourceUrlImpl) {
              return value.changingThisBreaksApplicationSecurity;
            }
            this.checkNotSafeValue(value, 'ResourceURL');
            throw new Error('unsafe value used in a resource URL context (see http://g.co/ng/security#xss)');
          default:
            throw new Error("Unexpected SecurityContext " + ctx + " (see http://g.co/ng/security#xss)");
        }
      };
      DomSanitizerImpl.prototype.checkNotSafeValue = function(value, expectedType) {
        if (value instanceof SafeValueImpl) {
          throw new Error("Required a safe " + expectedType + ", got a " + value.getTypeName() + " " + "(see http://g.co/ng/security#xss)");
        }
      };
      DomSanitizerImpl.prototype.bypassSecurityTrustHtml = function(value) {
        return new SafeHtmlImpl(value);
      };
      DomSanitizerImpl.prototype.bypassSecurityTrustStyle = function(value) {
        return new SafeStyleImpl(value);
      };
      DomSanitizerImpl.prototype.bypassSecurityTrustScript = function(value) {
        return new SafeScriptImpl(value);
      };
      DomSanitizerImpl.prototype.bypassSecurityTrustUrl = function(value) {
        return new SafeUrlImpl(value);
      };
      DomSanitizerImpl.prototype.bypassSecurityTrustResourceUrl = function(value) {
        return new SafeResourceUrlImpl(value);
      };
      return DomSanitizerImpl;
    }(DomSanitizer));
    DomSanitizerImpl.decorators = [{type: _angular_core.Injectable}];
    DomSanitizerImpl.ctorParameters = function() {
      return [{
        type: undefined,
        decorators: [{
          type: _angular_core.Inject,
          args: [DOCUMENT]
        }]
      }];
    };
    var SafeValueImpl = (function() {
      function SafeValueImpl(changingThisBreaksApplicationSecurity) {
        this.changingThisBreaksApplicationSecurity = changingThisBreaksApplicationSecurity;
      }
      SafeValueImpl.prototype.getTypeName = function() {};
      SafeValueImpl.prototype.toString = function() {
        return "SafeValue must use [property]=binding: " + this.changingThisBreaksApplicationSecurity + " (see http://g.co/ng/security#xss)";
      };
      return SafeValueImpl;
    }());
    var SafeHtmlImpl = (function(_super) {
      __extends(SafeHtmlImpl, _super);
      function SafeHtmlImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      SafeHtmlImpl.prototype.getTypeName = function() {
        return 'HTML';
      };
      return SafeHtmlImpl;
    }(SafeValueImpl));
    var SafeStyleImpl = (function(_super) {
      __extends(SafeStyleImpl, _super);
      function SafeStyleImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      SafeStyleImpl.prototype.getTypeName = function() {
        return 'Style';
      };
      return SafeStyleImpl;
    }(SafeValueImpl));
    var SafeScriptImpl = (function(_super) {
      __extends(SafeScriptImpl, _super);
      function SafeScriptImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      SafeScriptImpl.prototype.getTypeName = function() {
        return 'Script';
      };
      return SafeScriptImpl;
    }(SafeValueImpl));
    var SafeUrlImpl = (function(_super) {
      __extends(SafeUrlImpl, _super);
      function SafeUrlImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      SafeUrlImpl.prototype.getTypeName = function() {
        return 'URL';
      };
      return SafeUrlImpl;
    }(SafeValueImpl));
    var SafeResourceUrlImpl = (function(_super) {
      __extends(SafeResourceUrlImpl, _super);
      function SafeResourceUrlImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      SafeResourceUrlImpl.prototype.getTypeName = function() {
        return 'ResourceURL';
      };
      return SafeResourceUrlImpl;
    }(SafeValueImpl));
    var INTERNAL_BROWSER_PLATFORM_PROVIDERS = [{
      provide: _angular_core.PLATFORM_ID,
      useValue: _angular_common.ɵPLATFORM_BROWSER_ID
    }, {
      provide: _angular_core.PLATFORM_INITIALIZER,
      useValue: initDomAdapter,
      multi: true
    }, {
      provide: _angular_common.PlatformLocation,
      useClass: BrowserPlatformLocation
    }, {
      provide: DOCUMENT,
      useFactory: _document,
      deps: []
    }];
    var BROWSER_SANITIZATION_PROVIDERS = [{
      provide: _angular_core.Sanitizer,
      useExisting: DomSanitizer
    }, {
      provide: DomSanitizer,
      useClass: DomSanitizerImpl
    }];
    var platformBrowser = _angular_core.createPlatformFactory(_angular_core.platformCore, 'browser', INTERNAL_BROWSER_PLATFORM_PROVIDERS);
    function initDomAdapter() {
      BrowserDomAdapter.makeCurrent();
      BrowserGetTestability.init();
    }
    function errorHandler() {
      return new _angular_core.ErrorHandler();
    }
    function _document() {
      return document;
    }
    var BrowserModule = (function() {
      function BrowserModule(parentModule) {
        if (parentModule) {
          throw new Error("BrowserModule has already been loaded. If you need access to common directives such as NgIf and NgFor from a lazy loaded module, import CommonModule instead.");
        }
      }
      BrowserModule.withServerTransition = function(params) {
        return {
          ngModule: BrowserModule,
          providers: [{
            provide: _angular_core.APP_ID,
            useValue: params.appId
          }, {
            provide: TRANSITION_ID,
            useExisting: _angular_core.APP_ID
          }, SERVER_TRANSITION_PROVIDERS]
        };
      };
      return BrowserModule;
    }());
    BrowserModule.decorators = [{
      type: _angular_core.NgModule,
      args: [{
        providers: [BROWSER_SANITIZATION_PROVIDERS, {
          provide: _angular_core.ErrorHandler,
          useFactory: errorHandler,
          deps: []
        }, {
          provide: EVENT_MANAGER_PLUGINS,
          useClass: DomEventsPlugin,
          multi: true
        }, {
          provide: EVENT_MANAGER_PLUGINS,
          useClass: KeyEventsPlugin,
          multi: true
        }, {
          provide: EVENT_MANAGER_PLUGINS,
          useClass: HammerGesturesPlugin,
          multi: true
        }, {
          provide: HAMMER_GESTURE_CONFIG,
          useClass: HammerGestureConfig
        }, DomRendererFactory2, {
          provide: _angular_core.RendererFactory2,
          useExisting: DomRendererFactory2
        }, {
          provide: SharedStylesHost,
          useExisting: DomSharedStylesHost
        }, DomSharedStylesHost, _angular_core.Testability, EventManager, ELEMENT_PROBE_PROVIDERS, Meta, Title],
        exports: [_angular_common.CommonModule, _angular_core.ApplicationModule]
      }]
    }];
    BrowserModule.ctorParameters = function() {
      return [{
        type: BrowserModule,
        decorators: [{type: _angular_core.Optional}, {type: _angular_core.SkipSelf}]
      }];
    };
    var win = typeof window !== 'undefined' && window || {};
    var ChangeDetectionPerfRecord = (function() {
      function ChangeDetectionPerfRecord(msPerTick, numTicks) {
        this.msPerTick = msPerTick;
        this.numTicks = numTicks;
      }
      return ChangeDetectionPerfRecord;
    }());
    var AngularProfiler = (function() {
      function AngularProfiler(ref) {
        this.appRef = ref.injector.get(_angular_core.ApplicationRef);
      }
      AngularProfiler.prototype.timeChangeDetection = function(config) {
        var record = config && config['record'];
        var profileName = 'Change Detection';
        var isProfilerAvailable = win.console.profile != null;
        if (record && isProfilerAvailable) {
          win.console.profile(profileName);
        }
        var start = getDOM().performanceNow();
        var numTicks = 0;
        while (numTicks < 5 || (getDOM().performanceNow() - start) < 500) {
          this.appRef.tick();
          numTicks++;
        }
        var end = getDOM().performanceNow();
        if (record && isProfilerAvailable) {
          ((win.console.profileEnd))(profileName);
        }
        var msPerTick = (end - start) / numTicks;
        win.console.log("ran " + numTicks + " change detection cycles");
        win.console.log(msPerTick.toFixed(2) + " ms per check");
        return new ChangeDetectionPerfRecord(msPerTick, numTicks);
      };
      return AngularProfiler;
    }());
    var PROFILER_GLOBAL_NAME = 'profiler';
    function enableDebugTools(ref) {
      exportNgVar(PROFILER_GLOBAL_NAME, new AngularProfiler(ref));
      return ref;
    }
    function disableDebugTools() {
      exportNgVar(PROFILER_GLOBAL_NAME, null);
    }
    var By = (function() {
      function By() {}
      By.all = function() {
        return function(debugElement) {
          return true;
        };
      };
      By.css = function(selector) {
        return function(debugElement) {
          return debugElement.nativeElement != null ? getDOM().elementMatches(debugElement.nativeElement, selector) : false;
        };
      };
      By.directive = function(type) {
        return function(debugElement) {
          return ((debugElement.providerTokens)).indexOf(type) !== -1;
        };
      };
      return By;
    }());
    var VERSION = new _angular_core.Version('4.2.5');
    exports.BrowserModule = BrowserModule;
    exports.platformBrowser = platformBrowser;
    exports.Meta = Meta;
    exports.Title = Title;
    exports.disableDebugTools = disableDebugTools;
    exports.enableDebugTools = enableDebugTools;
    exports.By = By;
    exports.NgProbeToken = NgProbeToken$1;
    exports.DOCUMENT = DOCUMENT;
    exports.EVENT_MANAGER_PLUGINS = EVENT_MANAGER_PLUGINS;
    exports.EventManager = EventManager;
    exports.HAMMER_GESTURE_CONFIG = HAMMER_GESTURE_CONFIG;
    exports.HammerGestureConfig = HammerGestureConfig;
    exports.DomSanitizer = DomSanitizer;
    exports.VERSION = VERSION;
    exports.ɵBROWSER_SANITIZATION_PROVIDERS = BROWSER_SANITIZATION_PROVIDERS;
    exports.ɵINTERNAL_BROWSER_PLATFORM_PROVIDERS = INTERNAL_BROWSER_PLATFORM_PROVIDERS;
    exports.ɵinitDomAdapter = initDomAdapter;
    exports.ɵBrowserDomAdapter = BrowserDomAdapter;
    exports.ɵBrowserPlatformLocation = BrowserPlatformLocation;
    exports.ɵTRANSITION_ID = TRANSITION_ID;
    exports.ɵBrowserGetTestability = BrowserGetTestability;
    exports.ɵELEMENT_PROBE_PROVIDERS = ELEMENT_PROBE_PROVIDERS;
    exports.ɵDomAdapter = DomAdapter;
    exports.ɵgetDOM = getDOM;
    exports.ɵsetRootDomAdapter = setRootDomAdapter;
    exports.ɵDomRendererFactory2 = DomRendererFactory2;
    exports.ɵNAMESPACE_URIS = NAMESPACE_URIS;
    exports.ɵflattenStyles = flattenStyles;
    exports.ɵshimContentAttribute = shimContentAttribute;
    exports.ɵshimHostAttribute = shimHostAttribute;
    exports.ɵDomEventsPlugin = DomEventsPlugin;
    exports.ɵHammerGesturesPlugin = HammerGesturesPlugin;
    exports.ɵKeyEventsPlugin = KeyEventsPlugin;
    exports.ɵDomSharedStylesHost = DomSharedStylesHost;
    exports.ɵSharedStylesHost = SharedStylesHost;
    exports.ɵb = _document;
    exports.ɵa = errorHandler;
    exports.ɵh = GenericBrowserDomAdapter;
    exports.ɵg = SERVER_TRANSITION_PROVIDERS;
    exports.ɵf = appInitializerFactory;
    exports.ɵc = _createNgProbe;
    exports.ɵd = EventManagerPlugin;
    exports.ɵe = DomSanitizerImpl;
    Object.defineProperty(exports, '__esModule', {value: true});
  })));
})(require('process'));
