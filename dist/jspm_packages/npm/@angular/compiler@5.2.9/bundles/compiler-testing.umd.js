/* */ 
"format cjs";
(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('./compiler.umd')) : typeof define === 'function' && define.amd ? define('@angular/compiler/testing', ['exports', '@angular/compiler'], factory) : (factory((global.ng = global.ng || {}, global.ng.compiler = global.ng.compiler || {}, global.ng.compiler.testing = {}), global.ng.compiler));
}(this, (function(exports, _angular_compiler) {
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
  var MockResourceLoader = (function(_super) {
    __extends(MockResourceLoader, _super);
    function MockResourceLoader() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this._expectations = [];
      _this._definitions = new Map();
      _this._requests = [];
      return _this;
    }
    MockResourceLoader.prototype.get = function(url) {
      var request = new _PendingRequest(url);
      this._requests.push(request);
      return request.getPromise();
    };
    MockResourceLoader.prototype.hasPendingRequests = function() {
      return !!this._requests.length;
    };
    MockResourceLoader.prototype.expect = function(url, response) {
      var expectation = new _Expectation(url, response);
      this._expectations.push(expectation);
    };
    MockResourceLoader.prototype.when = function(url, response) {
      this._definitions.set(url, response);
    };
    MockResourceLoader.prototype.flush = function() {
      if (this._requests.length === 0) {
        throw new Error('No pending requests to flush');
      }
      do {
        this._processRequest(((this._requests.shift())));
      } while (this._requests.length > 0);
      this.verifyNoOutstandingExpectations();
    };
    MockResourceLoader.prototype.verifyNoOutstandingExpectations = function() {
      if (this._expectations.length === 0)
        return;
      var urls = [];
      for (var i = 0; i < this._expectations.length; i++) {
        var expectation = this._expectations[i];
        urls.push(expectation.url);
      }
      throw new Error("Unsatisfied requests: " + urls.join(', '));
    };
    MockResourceLoader.prototype._processRequest = function(request) {
      var url = request.url;
      if (this._expectations.length > 0) {
        var expectation = this._expectations[0];
        if (expectation.url == url) {
          remove(this._expectations, expectation);
          request.complete(expectation.response);
          return;
        }
      }
      if (this._definitions.has(url)) {
        var response = this._definitions.get(url);
        request.complete(response == null ? null : response);
        return;
      }
      throw new Error("Unexpected request " + url);
    };
    return MockResourceLoader;
  }(_angular_compiler.ResourceLoader));
  var _PendingRequest = (function() {
    function _PendingRequest(url) {
      var _this = this;
      this.url = url;
      this.promise = new Promise(function(res, rej) {
        _this.resolve = res;
        _this.reject = rej;
      });
    }
    _PendingRequest.prototype.complete = function(response) {
      if (response == null) {
        this.reject("Failed to load " + this.url);
      } else {
        this.resolve(response);
      }
    };
    _PendingRequest.prototype.getPromise = function() {
      return this.promise;
    };
    return _PendingRequest;
  }());
  var _Expectation = (function() {
    function _Expectation(url, response) {
      this.url = url;
      this.response = response;
    }
    return _Expectation;
  }());
  function remove(list, el) {
    var index = list.indexOf(el);
    if (index > -1) {
      list.splice(index, 1);
    }
  }
  var MockSchemaRegistry = (function() {
    function MockSchemaRegistry(existingProperties, attrPropMapping, existingElements, invalidProperties, invalidAttributes) {
      this.existingProperties = existingProperties;
      this.attrPropMapping = attrPropMapping;
      this.existingElements = existingElements;
      this.invalidProperties = invalidProperties;
      this.invalidAttributes = invalidAttributes;
    }
    MockSchemaRegistry.prototype.hasProperty = function(tagName, property, schemas) {
      var value = this.existingProperties[property];
      return value === void 0 ? true : value;
    };
    MockSchemaRegistry.prototype.hasElement = function(tagName, schemaMetas) {
      var value = this.existingElements[tagName.toLowerCase()];
      return value === void 0 ? true : value;
    };
    MockSchemaRegistry.prototype.allKnownElementNames = function() {
      return Object.keys(this.existingElements);
    };
    MockSchemaRegistry.prototype.securityContext = function(selector, property, isAttribute) {
      return _angular_compiler.core.SecurityContext.NONE;
    };
    MockSchemaRegistry.prototype.getMappedPropName = function(attrName) {
      return this.attrPropMapping[attrName] || attrName;
    };
    MockSchemaRegistry.prototype.getDefaultComponentElementName = function() {
      return 'ng-component';
    };
    MockSchemaRegistry.prototype.validateProperty = function(name) {
      if (this.invalidProperties.indexOf(name) > -1) {
        return {
          error: true,
          msg: "Binding to property '" + name + "' is disallowed for security reasons"
        };
      } else {
        return {error: false};
      }
    };
    MockSchemaRegistry.prototype.validateAttribute = function(name) {
      if (this.invalidAttributes.indexOf(name) > -1) {
        return {
          error: true,
          msg: "Binding to attribute '" + name + "' is disallowed for security reasons"
        };
      } else {
        return {error: false};
      }
    };
    MockSchemaRegistry.prototype.normalizeAnimationStyleProperty = function(propName) {
      return propName;
    };
    MockSchemaRegistry.prototype.normalizeAnimationStyleValue = function(camelCaseProp, userProvidedProp, val) {
      return {
        error: ((null)),
        value: val.toString()
      };
    };
    return MockSchemaRegistry;
  }());
  var MockDirectiveResolver = (function(_super) {
    __extends(MockDirectiveResolver, _super);
    function MockDirectiveResolver(reflector) {
      var _this = _super.call(this, reflector) || this;
      _this._directives = new Map();
      return _this;
    }
    MockDirectiveResolver.prototype.resolve = function(type, throwIfNotFound) {
      if (throwIfNotFound === void 0) {
        throwIfNotFound = true;
      }
      return this._directives.get(type) || _super.prototype.resolve.call(this, type, throwIfNotFound);
    };
    MockDirectiveResolver.prototype.setDirective = function(type, metadata) {
      this._directives.set(type, metadata);
    };
    return MockDirectiveResolver;
  }(_angular_compiler.DirectiveResolver));
  var MockNgModuleResolver = (function(_super) {
    __extends(MockNgModuleResolver, _super);
    function MockNgModuleResolver(reflector) {
      var _this = _super.call(this, reflector) || this;
      _this._ngModules = new Map();
      return _this;
    }
    MockNgModuleResolver.prototype.setNgModule = function(type, metadata) {
      this._ngModules.set(type, metadata);
    };
    MockNgModuleResolver.prototype.resolve = function(type, throwIfNotFound) {
      if (throwIfNotFound === void 0) {
        throwIfNotFound = true;
      }
      return this._ngModules.get(type) || ((_super.prototype.resolve.call(this, type, throwIfNotFound)));
    };
    return MockNgModuleResolver;
  }(_angular_compiler.NgModuleResolver));
  var MockPipeResolver = (function(_super) {
    __extends(MockPipeResolver, _super);
    function MockPipeResolver(refector) {
      var _this = _super.call(this, refector) || this;
      _this._pipes = new Map();
      return _this;
    }
    MockPipeResolver.prototype.setPipe = function(type, metadata) {
      this._pipes.set(type, metadata);
    };
    MockPipeResolver.prototype.resolve = function(type, throwIfNotFound) {
      if (throwIfNotFound === void 0) {
        throwIfNotFound = true;
      }
      var metadata = this._pipes.get(type);
      if (!metadata) {
        metadata = ((_super.prototype.resolve.call(this, type, throwIfNotFound)));
      }
      return metadata;
    };
    return MockPipeResolver;
  }(_angular_compiler.PipeResolver));
  exports.MockResourceLoader = MockResourceLoader;
  exports.MockSchemaRegistry = MockSchemaRegistry;
  exports.MockDirectiveResolver = MockDirectiveResolver;
  exports.MockNgModuleResolver = MockNgModuleResolver;
  exports.MockPipeResolver = MockPipeResolver;
  Object.defineProperty(exports, '__esModule', {value: true});
})));
