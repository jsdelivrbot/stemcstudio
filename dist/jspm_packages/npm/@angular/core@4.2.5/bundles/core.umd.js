/* */ 
"format cjs";
(function(process) {
  (function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs/Observable'), require('rxjs/observable/merge'), require('rxjs/operator/share'), require('rxjs/Subject')) : typeof define === 'function' && define.amd ? define(['exports', 'rxjs/Observable', 'rxjs/observable/merge', 'rxjs/operator/share', 'rxjs/Subject'], factory) : (factory((global.ng = global.ng || {}, global.ng.core = global.ng.core || {}), global.Rx, global.Rx.Observable, global.Rx.Observable.prototype, global.Rx));
  }(this, (function(exports, rxjs_Observable, rxjs_observable_merge, rxjs_operator_share, rxjs_Subject) {
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
    var OpaqueToken = (function() {
      function OpaqueToken(_desc) {
        this._desc = _desc;
      }
      OpaqueToken.prototype.toString = function() {
        return "Token " + this._desc;
      };
      return OpaqueToken;
    }());
    var InjectionToken = (function(_super) {
      __extends(InjectionToken, _super);
      function InjectionToken(desc) {
        return _super.call(this, desc) || this;
      }
      InjectionToken.prototype.toString = function() {
        return "InjectionToken " + this._desc;
      };
      return InjectionToken;
    }(OpaqueToken));
    var __window = typeof window !== 'undefined' && window;
    var __self = typeof self !== 'undefined' && typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope && self;
    var __global = typeof global !== 'undefined' && global;
    var _global = __window || __global || __self;
    var _symbolIterator = null;
    function getSymbolIterator() {
      if (!_symbolIterator) {
        var Symbol = _global['Symbol'];
        if (Symbol && Symbol.iterator) {
          _symbolIterator = Symbol.iterator;
        } else {
          var keys = Object.getOwnPropertyNames(Map.prototype);
          for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            if (key !== 'entries' && key !== 'size' && ((Map)).prototype[key] === Map.prototype['entries']) {
              _symbolIterator = key;
            }
          }
        }
      }
      return _symbolIterator;
    }
    function scheduleMicroTask(fn) {
      Zone.current.scheduleMicroTask('scheduleMicrotask', fn);
    }
    function looseIdentical(a, b) {
      return a === b || typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b);
    }
    function stringify(token) {
      if (typeof token === 'string') {
        return token;
      }
      if (token == null) {
        return '' + token;
      }
      if (token.overriddenName) {
        return "" + token.overriddenName;
      }
      if (token.name) {
        return "" + token.name;
      }
      var res = token.toString();
      if (res == null) {
        return '' + res;
      }
      var newLineIndex = res.indexOf('\n');
      return newLineIndex === -1 ? res : res.substring(0, newLineIndex);
    }
    var _nextClassId = 0;
    var Reflect$1 = _global['Reflect'];
    function extractAnnotation(annotation) {
      if (typeof annotation === 'function' && annotation.hasOwnProperty('annotation')) {
        annotation = annotation.annotation;
      }
      return annotation;
    }
    function applyParams(fnOrArray, key) {
      if (fnOrArray === Object || fnOrArray === String || fnOrArray === Function || fnOrArray === Number || fnOrArray === Array) {
        throw new Error("Can not use native " + stringify(fnOrArray) + " as constructor");
      }
      if (typeof fnOrArray === 'function') {
        return fnOrArray;
      }
      if (Array.isArray(fnOrArray)) {
        var annotations = (fnOrArray);
        var annoLength = annotations.length - 1;
        var fn = fnOrArray[annoLength];
        if (typeof fn !== 'function') {
          throw new Error("Last position of Class method array must be Function in key " + key + " was '" + stringify(fn) + "'");
        }
        if (annoLength != fn.length) {
          throw new Error("Number of annotations (" + annoLength + ") does not match number of arguments (" + fn.length + ") in the function: " + stringify(fn));
        }
        var paramsAnnotations = [];
        for (var i = 0,
            ii = annotations.length - 1; i < ii; i++) {
          var paramAnnotations = [];
          paramsAnnotations.push(paramAnnotations);
          var annotation = annotations[i];
          if (Array.isArray(annotation)) {
            for (var j = 0; j < annotation.length; j++) {
              paramAnnotations.push(extractAnnotation(annotation[j]));
            }
          } else if (typeof annotation === 'function') {
            paramAnnotations.push(extractAnnotation(annotation));
          } else {
            paramAnnotations.push(annotation);
          }
        }
        Reflect$1.defineMetadata('parameters', paramsAnnotations, fn);
        return fn;
      }
      throw new Error("Only Function or Array is supported in Class definition for key '" + key + "' is '" + stringify(fnOrArray) + "'");
    }
    function Class(clsDef) {
      var constructor = applyParams(clsDef.hasOwnProperty('constructor') ? clsDef.constructor : undefined, 'constructor');
      var proto = constructor.prototype;
      if (clsDef.hasOwnProperty('extends')) {
        if (typeof clsDef.extends === 'function') {
          ((constructor)).prototype = proto = Object.create(((clsDef.extends)).prototype);
        } else {
          throw new Error("Class definition 'extends' property must be a constructor function was: " + stringify(clsDef.extends));
        }
      }
      for (var key in clsDef) {
        if (key !== 'extends' && key !== 'prototype' && clsDef.hasOwnProperty(key)) {
          proto[key] = applyParams(clsDef[key], key);
        }
      }
      if (this && this.annotations instanceof Array) {
        Reflect$1.defineMetadata('annotations', this.annotations, constructor);
      }
      var constructorName = constructor['name'];
      if (!constructorName || constructorName === 'constructor') {
        ((constructor))['overriddenName'] = "class" + _nextClassId++;
      }
      return (constructor);
    }
    function makeDecorator(name, props, parentClass, chainFn) {
      var metaCtor = makeMetadataCtor(props);
      function DecoratorFactory(objOrType) {
        if (!(Reflect$1 && Reflect$1.getOwnMetadata)) {
          throw 'reflect-metadata shim is required when using class decorators';
        }
        if (this instanceof DecoratorFactory) {
          metaCtor.call(this, objOrType);
          return this;
        }
        var annotationInstance = new ((DecoratorFactory))(objOrType);
        var chainAnnotation = typeof this === 'function' && Array.isArray(this.annotations) ? this.annotations : [];
        chainAnnotation.push(annotationInstance);
        var TypeDecorator = (function TypeDecorator(cls) {
          var annotations = Reflect$1.getOwnMetadata('annotations', cls) || [];
          annotations.push(annotationInstance);
          Reflect$1.defineMetadata('annotations', annotations, cls);
          return cls;
        });
        TypeDecorator.annotations = chainAnnotation;
        TypeDecorator.Class = Class;
        if (chainFn)
          chainFn(TypeDecorator);
        return TypeDecorator;
      }
      if (parentClass) {
        DecoratorFactory.prototype = Object.create(parentClass.prototype);
      }
      DecoratorFactory.prototype.toString = function() {
        return "@" + name;
      };
      ((DecoratorFactory)).annotationCls = DecoratorFactory;
      return DecoratorFactory;
    }
    function makeMetadataCtor(props) {
      return function ctor() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        if (props) {
          var values = props.apply(void 0, args);
          for (var propName in values) {
            this[propName] = values[propName];
          }
        }
      };
    }
    function makeParamDecorator(name, props, parentClass) {
      var metaCtor = makeMetadataCtor(props);
      function ParamDecoratorFactory() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        if (this instanceof ParamDecoratorFactory) {
          metaCtor.apply(this, args);
          return this;
        }
        var annotationInstance = new (((ParamDecoratorFactory)).bind.apply(((ParamDecoratorFactory)), [void 0].concat(args)))();
        ((ParamDecorator)).annotation = annotationInstance;
        return ParamDecorator;
        function ParamDecorator(cls, unusedKey, index) {
          var parameters = Reflect$1.getOwnMetadata('parameters', cls) || [];
          while (parameters.length <= index) {
            parameters.push(null);
          }
          parameters[index] = parameters[index] || [];
          ((parameters[index])).push(annotationInstance);
          Reflect$1.defineMetadata('parameters', parameters, cls);
          return cls;
        }
      }
      if (parentClass) {
        ParamDecoratorFactory.prototype = Object.create(parentClass.prototype);
      }
      ParamDecoratorFactory.prototype.toString = function() {
        return "@" + name;
      };
      ((ParamDecoratorFactory)).annotationCls = ParamDecoratorFactory;
      return ParamDecoratorFactory;
    }
    function makePropDecorator(name, props, parentClass) {
      var metaCtor = makeMetadataCtor(props);
      function PropDecoratorFactory() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        if (this instanceof PropDecoratorFactory) {
          metaCtor.apply(this, args);
          return this;
        }
        var decoratorInstance = new (((PropDecoratorFactory)).bind.apply(((PropDecoratorFactory)), [void 0].concat(args)))();
        return function PropDecorator(target, name) {
          var meta = Reflect$1.getOwnMetadata('propMetadata', target.constructor) || {};
          meta[name] = meta.hasOwnProperty(name) && meta[name] || [];
          meta[name].unshift(decoratorInstance);
          Reflect$1.defineMetadata('propMetadata', meta, target.constructor);
        };
      }
      if (parentClass) {
        PropDecoratorFactory.prototype = Object.create(parentClass.prototype);
      }
      PropDecoratorFactory.prototype.toString = function() {
        return "@" + name;
      };
      ((PropDecoratorFactory)).annotationCls = PropDecoratorFactory;
      return PropDecoratorFactory;
    }
    var ANALYZE_FOR_ENTRY_COMPONENTS = new InjectionToken('AnalyzeForEntryComponents');
    var Attribute = makeParamDecorator('Attribute', function(attributeName) {
      return ({attributeName: attributeName});
    });
    var Query = (function() {
      function Query() {}
      return Query;
    }());
    var ContentChildren = makePropDecorator('ContentChildren', function(selector, data) {
      if (data === void 0) {
        data = {};
      }
      return (Object.assign({
        selector: selector,
        first: false,
        isViewQuery: false,
        descendants: false
      }, data));
    }, Query);
    var ContentChild = makePropDecorator('ContentChild', function(selector, data) {
      if (data === void 0) {
        data = {};
      }
      return (Object.assign({
        selector: selector,
        first: true,
        isViewQuery: false,
        descendants: true
      }, data));
    }, Query);
    var ViewChildren = makePropDecorator('ViewChildren', function(selector, data) {
      if (data === void 0) {
        data = {};
      }
      return (Object.assign({
        selector: selector,
        first: false,
        isViewQuery: true,
        descendants: true
      }, data));
    }, Query);
    var ViewChild = makePropDecorator('ViewChild', function(selector, data) {
      return (Object.assign({
        selector: selector,
        first: true,
        isViewQuery: true,
        descendants: true
      }, data));
    }, Query);
    var ChangeDetectionStrategy = {};
    ChangeDetectionStrategy.OnPush = 0;
    ChangeDetectionStrategy.Default = 1;
    ChangeDetectionStrategy[ChangeDetectionStrategy.OnPush] = "OnPush";
    ChangeDetectionStrategy[ChangeDetectionStrategy.Default] = "Default";
    var ChangeDetectorStatus = {};
    ChangeDetectorStatus.CheckOnce = 0;
    ChangeDetectorStatus.Checked = 1;
    ChangeDetectorStatus.CheckAlways = 2;
    ChangeDetectorStatus.Detached = 3;
    ChangeDetectorStatus.Errored = 4;
    ChangeDetectorStatus.Destroyed = 5;
    ChangeDetectorStatus[ChangeDetectorStatus.CheckOnce] = "CheckOnce";
    ChangeDetectorStatus[ChangeDetectorStatus.Checked] = "Checked";
    ChangeDetectorStatus[ChangeDetectorStatus.CheckAlways] = "CheckAlways";
    ChangeDetectorStatus[ChangeDetectorStatus.Detached] = "Detached";
    ChangeDetectorStatus[ChangeDetectorStatus.Errored] = "Errored";
    ChangeDetectorStatus[ChangeDetectorStatus.Destroyed] = "Destroyed";
    function isDefaultChangeDetectionStrategy(changeDetectionStrategy) {
      return changeDetectionStrategy == null || changeDetectionStrategy === ChangeDetectionStrategy.Default;
    }
    var Directive = makeDecorator('Directive', function(dir) {
      if (dir === void 0) {
        dir = {};
      }
      return dir;
    });
    var Component = makeDecorator('Component', function(c) {
      if (c === void 0) {
        c = {};
      }
      return (Object.assign({changeDetection: ChangeDetectionStrategy.Default}, c));
    }, Directive);
    var Pipe = makeDecorator('Pipe', function(p) {
      return (Object.assign({pure: true}, p));
    });
    var Input = makePropDecorator('Input', function(bindingPropertyName) {
      return ({bindingPropertyName: bindingPropertyName});
    });
    var Output = makePropDecorator('Output', function(bindingPropertyName) {
      return ({bindingPropertyName: bindingPropertyName});
    });
    var HostBinding = makePropDecorator('HostBinding', function(hostPropertyName) {
      return ({hostPropertyName: hostPropertyName});
    });
    var HostListener = makePropDecorator('HostListener', function(eventName, args) {
      return ({
        eventName: eventName,
        args: args
      });
    });
    var CUSTOM_ELEMENTS_SCHEMA = {name: 'custom-elements'};
    var NO_ERRORS_SCHEMA = {name: 'no-errors-schema'};
    var NgModule = makeDecorator('NgModule', function(ngModule) {
      return ngModule;
    });
    var ViewEncapsulation = {};
    ViewEncapsulation.Emulated = 0;
    ViewEncapsulation.Native = 1;
    ViewEncapsulation.None = 2;
    ViewEncapsulation[ViewEncapsulation.Emulated] = "Emulated";
    ViewEncapsulation[ViewEncapsulation.Native] = "Native";
    ViewEncapsulation[ViewEncapsulation.None] = "None";
    var ViewMetadata = (function() {
      function ViewMetadata(opts) {
        if (opts === void 0) {
          opts = {};
        }
        this.templateUrl = opts.templateUrl;
        this.template = opts.template;
        this.styleUrls = opts.styleUrls;
        this.styles = opts.styles;
        this.encapsulation = opts.encapsulation;
        this.animations = opts.animations;
        this.interpolation = opts.interpolation;
      }
      return ViewMetadata;
    }());
    var Version = (function() {
      function Version(full) {
        this.full = full;
      }
      Object.defineProperty(Version.prototype, "major", {
        get: function() {
          return this.full.split('.')[0];
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(Version.prototype, "minor", {
        get: function() {
          return this.full.split('.')[1];
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(Version.prototype, "patch", {
        get: function() {
          return this.full.split('.').slice(2).join('.');
        },
        enumerable: true,
        configurable: true
      });
      return Version;
    }());
    var VERSION = new Version('4.2.5');
    var Inject = makeParamDecorator('Inject', function(token) {
      return ({token: token});
    });
    var Optional = makeParamDecorator('Optional');
    var Injectable = makeDecorator('Injectable');
    var Self = makeParamDecorator('Self');
    var SkipSelf = makeParamDecorator('SkipSelf');
    var Host = makeParamDecorator('Host');
    function forwardRef(forwardRefFn) {
      ((forwardRefFn)).__forward_ref__ = forwardRef;
      ((forwardRefFn)).toString = function() {
        return stringify(this());
      };
      return (((forwardRefFn)));
    }
    function resolveForwardRef(type) {
      if (typeof type === 'function' && type.hasOwnProperty('__forward_ref__') && type.__forward_ref__ === forwardRef) {
        return ((type))();
      } else {
        return type;
      }
    }
    var _THROW_IF_NOT_FOUND = new Object();
    var THROW_IF_NOT_FOUND = _THROW_IF_NOT_FOUND;
    var _NullInjector = (function() {
      function _NullInjector() {}
      _NullInjector.prototype.get = function(token, notFoundValue) {
        if (notFoundValue === void 0) {
          notFoundValue = _THROW_IF_NOT_FOUND;
        }
        if (notFoundValue === _THROW_IF_NOT_FOUND) {
          throw new Error("No provider for " + stringify(token) + "!");
        }
        return notFoundValue;
      };
      return _NullInjector;
    }());
    var Injector = (function() {
      function Injector() {}
      Injector.prototype.get = function(token, notFoundValue) {};
      Injector.prototype.get = function(token, notFoundValue) {};
      return Injector;
    }());
    Injector.THROW_IF_NOT_FOUND = _THROW_IF_NOT_FOUND;
    Injector.NULL = new _NullInjector();
    var ERROR_COMPONENT_TYPE = 'ngComponentType';
    var ERROR_DEBUG_CONTEXT = 'ngDebugContext';
    var ERROR_ORIGINAL_ERROR = 'ngOriginalError';
    var ERROR_LOGGER = 'ngErrorLogger';
    function getDebugContext(error) {
      return ((error))[ERROR_DEBUG_CONTEXT];
    }
    function getOriginalError(error) {
      return ((error))[ERROR_ORIGINAL_ERROR];
    }
    function getErrorLogger(error) {
      return ((error))[ERROR_LOGGER] || defaultErrorLogger;
    }
    function defaultErrorLogger(console) {
      var values = [];
      for (var _i = 1; _i < arguments.length; _i++) {
        values[_i - 1] = arguments[_i];
      }
      console.error.apply(console, values);
    }
    var ErrorHandler = (function() {
      function ErrorHandler(deprecatedParameter) {
        this._console = console;
      }
      ErrorHandler.prototype.handleError = function(error) {
        var originalError = this._findOriginalError(error);
        var context = this._findContext(error);
        var errorLogger = getErrorLogger(error);
        errorLogger(this._console, "ERROR", error);
        if (originalError) {
          errorLogger(this._console, "ORIGINAL ERROR", originalError);
        }
        if (context) {
          errorLogger(this._console, 'ERROR CONTEXT', context);
        }
      };
      ErrorHandler.prototype._findContext = function(error) {
        if (error) {
          return getDebugContext(error) ? getDebugContext(error) : this._findContext(getOriginalError(error));
        }
        return null;
      };
      ErrorHandler.prototype._findOriginalError = function(error) {
        var e = getOriginalError(error);
        while (e && getOriginalError(e)) {
          e = getOriginalError(e);
        }
        return e;
      };
      return ErrorHandler;
    }());
    function wrappedError(message, originalError) {
      var msg = message + " caused by: " + (originalError instanceof Error ? originalError.message : originalError);
      var error = Error(msg);
      ((error))[ERROR_ORIGINAL_ERROR] = originalError;
      return error;
    }
    function findFirstClosedCycle(keys) {
      var res = [];
      for (var i = 0; i < keys.length; ++i) {
        if (res.indexOf(keys[i]) > -1) {
          res.push(keys[i]);
          return res;
        }
        res.push(keys[i]);
      }
      return res;
    }
    function constructResolvingPath(keys) {
      if (keys.length > 1) {
        var reversed = findFirstClosedCycle(keys.slice().reverse());
        var tokenStrs = reversed.map(function(k) {
          return stringify(k.token);
        });
        return ' (' + tokenStrs.join(' -> ') + ')';
      }
      return '';
    }
    function injectionError(injector, key, constructResolvingMessage, originalError) {
      var keys = [key];
      var errMsg = constructResolvingMessage(keys);
      var error = ((originalError ? wrappedError(errMsg, originalError) : Error(errMsg)));
      error.addKey = addKey;
      error.keys = keys;
      error.injectors = [injector];
      error.constructResolvingMessage = constructResolvingMessage;
      ((error))[ERROR_ORIGINAL_ERROR] = originalError;
      return error;
    }
    function addKey(injector, key) {
      this.injectors.push(injector);
      this.keys.push(key);
      this.message = this.constructResolvingMessage(this.keys);
    }
    function noProviderError(injector, key) {
      return injectionError(injector, key, function(keys) {
        var first = stringify(keys[0].token);
        return "No provider for " + first + "!" + constructResolvingPath(keys);
      });
    }
    function cyclicDependencyError(injector, key) {
      return injectionError(injector, key, function(keys) {
        return "Cannot instantiate cyclic dependency!" + constructResolvingPath(keys);
      });
    }
    function instantiationError(injector, originalException, originalStack, key) {
      return injectionError(injector, key, function(keys) {
        var first = stringify(keys[0].token);
        return originalException.message + ": Error during instantiation of " + first + "!" + constructResolvingPath(keys) + ".";
      }, originalException);
    }
    function invalidProviderError(provider) {
      return Error("Invalid provider - only instances of Provider and Type are allowed, got: " + provider);
    }
    function noAnnotationError(typeOrFunc, params) {
      var signature = [];
      for (var i = 0,
          ii = params.length; i < ii; i++) {
        var parameter = params[i];
        if (!parameter || parameter.length == 0) {
          signature.push('?');
        } else {
          signature.push(parameter.map(stringify).join(' '));
        }
      }
      return Error('Cannot resolve all parameters for \'' + stringify(typeOrFunc) + '\'(' + signature.join(', ') + '). ' + 'Make sure that all the parameters are decorated with Inject or have valid type annotations and that \'' + stringify(typeOrFunc) + '\' is decorated with Injectable.');
    }
    function outOfBoundsError(index) {
      return Error("Index " + index + " is out-of-bounds.");
    }
    function mixingMultiProvidersWithRegularProvidersError(provider1, provider2) {
      return Error("Cannot mix multi providers and regular providers, got: " + provider1 + " " + provider2);
    }
    var ReflectiveKey = (function() {
      function ReflectiveKey(token, id) {
        this.token = token;
        this.id = id;
        if (!token) {
          throw new Error('Token must be defined!');
        }
      }
      Object.defineProperty(ReflectiveKey.prototype, "displayName", {
        get: function() {
          return stringify(this.token);
        },
        enumerable: true,
        configurable: true
      });
      ReflectiveKey.get = function(token) {
        return _globalKeyRegistry.get(resolveForwardRef(token));
      };
      Object.defineProperty(ReflectiveKey, "numberOfKeys", {
        get: function() {
          return _globalKeyRegistry.numberOfKeys;
        },
        enumerable: true,
        configurable: true
      });
      return ReflectiveKey;
    }());
    var KeyRegistry = (function() {
      function KeyRegistry() {
        this._allKeys = new Map();
      }
      KeyRegistry.prototype.get = function(token) {
        if (token instanceof ReflectiveKey)
          return token;
        if (this._allKeys.has(token)) {
          return ((this._allKeys.get(token)));
        }
        var newKey = new ReflectiveKey(token, ReflectiveKey.numberOfKeys);
        this._allKeys.set(token, newKey);
        return newKey;
      };
      Object.defineProperty(KeyRegistry.prototype, "numberOfKeys", {
        get: function() {
          return this._allKeys.size;
        },
        enumerable: true,
        configurable: true
      });
      return KeyRegistry;
    }());
    var _globalKeyRegistry = new KeyRegistry();
    var Type = Function;
    function isType(v) {
      return typeof v === 'function';
    }
    var DELEGATE_CTOR = /^function\s+\S+\(\)\s*{[\s\S]+\.apply\(this,\s*arguments\)/;
    var ReflectionCapabilities = (function() {
      function ReflectionCapabilities(reflect) {
        this._reflect = reflect || _global['Reflect'];
      }
      ReflectionCapabilities.prototype.isReflectionEnabled = function() {
        return true;
      };
      ReflectionCapabilities.prototype.factory = function(t) {
        return function() {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          return new (t.bind.apply(t, [void 0].concat(args)))();
        };
      };
      ReflectionCapabilities.prototype._zipTypesAndAnnotations = function(paramTypes, paramAnnotations) {
        var result;
        if (typeof paramTypes === 'undefined') {
          result = new Array(paramAnnotations.length);
        } else {
          result = new Array(paramTypes.length);
        }
        for (var i = 0; i < result.length; i++) {
          if (typeof paramTypes === 'undefined') {
            result[i] = [];
          } else if (paramTypes[i] != Object) {
            result[i] = [paramTypes[i]];
          } else {
            result[i] = [];
          }
          if (paramAnnotations && paramAnnotations[i] != null) {
            result[i] = result[i].concat(paramAnnotations[i]);
          }
        }
        return result;
      };
      ReflectionCapabilities.prototype._ownParameters = function(type, parentCtor) {
        if (DELEGATE_CTOR.exec(type.toString())) {
          return null;
        }
        if (((type)).parameters && ((type)).parameters !== parentCtor.parameters) {
          return ((type)).parameters;
        }
        var tsickleCtorParams = ((type)).ctorParameters;
        if (tsickleCtorParams && tsickleCtorParams !== parentCtor.ctorParameters) {
          var ctorParameters = typeof tsickleCtorParams === 'function' ? tsickleCtorParams() : tsickleCtorParams;
          var paramTypes = ctorParameters.map(function(ctorParam) {
            return ctorParam && ctorParam.type;
          });
          var paramAnnotations = ctorParameters.map(function(ctorParam) {
            return ctorParam && convertTsickleDecoratorIntoMetadata(ctorParam.decorators);
          });
          return this._zipTypesAndAnnotations(paramTypes, paramAnnotations);
        }
        if (this._reflect != null && this._reflect.getOwnMetadata != null) {
          var paramAnnotations = this._reflect.getOwnMetadata('parameters', type);
          var paramTypes = this._reflect.getOwnMetadata('design:paramtypes', type);
          if (paramTypes || paramAnnotations) {
            return this._zipTypesAndAnnotations(paramTypes, paramAnnotations);
          }
        }
        return new Array(((type.length))).fill(undefined);
      };
      ReflectionCapabilities.prototype.parameters = function(type) {
        if (!isType(type)) {
          return [];
        }
        var parentCtor = getParentCtor(type);
        var parameters = this._ownParameters(type, parentCtor);
        if (!parameters && parentCtor !== Object) {
          parameters = this.parameters(parentCtor);
        }
        return parameters || [];
      };
      ReflectionCapabilities.prototype._ownAnnotations = function(typeOrFunc, parentCtor) {
        if (((typeOrFunc)).annotations && ((typeOrFunc)).annotations !== parentCtor.annotations) {
          var annotations = ((typeOrFunc)).annotations;
          if (typeof annotations === 'function' && annotations.annotations) {
            annotations = annotations.annotations;
          }
          return annotations;
        }
        if (((typeOrFunc)).decorators && ((typeOrFunc)).decorators !== parentCtor.decorators) {
          return convertTsickleDecoratorIntoMetadata(((typeOrFunc)).decorators);
        }
        if (this._reflect && this._reflect.getOwnMetadata) {
          return this._reflect.getOwnMetadata('annotations', typeOrFunc);
        }
        return null;
      };
      ReflectionCapabilities.prototype.annotations = function(typeOrFunc) {
        if (!isType(typeOrFunc)) {
          return [];
        }
        var parentCtor = getParentCtor(typeOrFunc);
        var ownAnnotations = this._ownAnnotations(typeOrFunc, parentCtor) || [];
        var parentAnnotations = parentCtor !== Object ? this.annotations(parentCtor) : [];
        return parentAnnotations.concat(ownAnnotations);
      };
      ReflectionCapabilities.prototype._ownPropMetadata = function(typeOrFunc, parentCtor) {
        if (((typeOrFunc)).propMetadata && ((typeOrFunc)).propMetadata !== parentCtor.propMetadata) {
          var propMetadata = ((typeOrFunc)).propMetadata;
          if (typeof propMetadata === 'function' && propMetadata.propMetadata) {
            propMetadata = propMetadata.propMetadata;
          }
          return propMetadata;
        }
        if (((typeOrFunc)).propDecorators && ((typeOrFunc)).propDecorators !== parentCtor.propDecorators) {
          var propDecorators_1 = ((typeOrFunc)).propDecorators;
          var propMetadata_1 = ({});
          Object.keys(propDecorators_1).forEach(function(prop) {
            propMetadata_1[prop] = convertTsickleDecoratorIntoMetadata(propDecorators_1[prop]);
          });
          return propMetadata_1;
        }
        if (this._reflect && this._reflect.getOwnMetadata) {
          return this._reflect.getOwnMetadata('propMetadata', typeOrFunc);
        }
        return null;
      };
      ReflectionCapabilities.prototype.propMetadata = function(typeOrFunc) {
        if (!isType(typeOrFunc)) {
          return {};
        }
        var parentCtor = getParentCtor(typeOrFunc);
        var propMetadata = {};
        if (parentCtor !== Object) {
          var parentPropMetadata_1 = this.propMetadata(parentCtor);
          Object.keys(parentPropMetadata_1).forEach(function(propName) {
            propMetadata[propName] = parentPropMetadata_1[propName];
          });
        }
        var ownPropMetadata = this._ownPropMetadata(typeOrFunc, parentCtor);
        if (ownPropMetadata) {
          Object.keys(ownPropMetadata).forEach(function(propName) {
            var decorators = [];
            if (propMetadata.hasOwnProperty(propName)) {
              decorators.push.apply(decorators, propMetadata[propName]);
            }
            decorators.push.apply(decorators, ownPropMetadata[propName]);
            propMetadata[propName] = decorators;
          });
        }
        return propMetadata;
      };
      ReflectionCapabilities.prototype.hasLifecycleHook = function(type, lcProperty) {
        return type instanceof Type && lcProperty in type.prototype;
      };
      ReflectionCapabilities.prototype.getter = function(name) {
        return (new Function('o', 'return o.' + name + ';'));
      };
      ReflectionCapabilities.prototype.setter = function(name) {
        return (new Function('o', 'v', 'return o.' + name + ' = v;'));
      };
      ReflectionCapabilities.prototype.method = function(name) {
        var functionBody = "if (!o." + name + ") throw new Error('\"" + name + "\" is undefined');\n        return o." + name + ".apply(o, args);";
        return (new Function('o', 'args', functionBody));
      };
      ReflectionCapabilities.prototype.importUri = function(type) {
        if (typeof type === 'object' && type['filePath']) {
          return type['filePath'];
        }
        return "./" + stringify(type);
      };
      ReflectionCapabilities.prototype.resourceUri = function(type) {
        return "./" + stringify(type);
      };
      ReflectionCapabilities.prototype.resolveIdentifier = function(name, moduleUrl, members, runtime) {
        return runtime;
      };
      ReflectionCapabilities.prototype.resolveEnum = function(enumIdentifier, name) {
        return enumIdentifier[name];
      };
      return ReflectionCapabilities;
    }());
    function convertTsickleDecoratorIntoMetadata(decoratorInvocations) {
      if (!decoratorInvocations) {
        return [];
      }
      return decoratorInvocations.map(function(decoratorInvocation) {
        var decoratorType = decoratorInvocation.type;
        var annotationCls = decoratorType.annotationCls;
        var annotationArgs = decoratorInvocation.args ? decoratorInvocation.args : [];
        return new (annotationCls.bind.apply(annotationCls, [void 0].concat(annotationArgs)))();
      });
    }
    function getParentCtor(ctor) {
      var parentProto = Object.getPrototypeOf(ctor.prototype);
      var parentCtor = parentProto ? parentProto.constructor : null;
      return parentCtor || Object;
    }
    var Reflector = (function() {
      function Reflector(reflectionCapabilities) {
        this.reflectionCapabilities = reflectionCapabilities;
      }
      Reflector.prototype.updateCapabilities = function(caps) {
        this.reflectionCapabilities = caps;
      };
      Reflector.prototype.factory = function(type) {
        return this.reflectionCapabilities.factory(type);
      };
      Reflector.prototype.parameters = function(typeOrFunc) {
        return this.reflectionCapabilities.parameters(typeOrFunc);
      };
      Reflector.prototype.annotations = function(typeOrFunc) {
        return this.reflectionCapabilities.annotations(typeOrFunc);
      };
      Reflector.prototype.propMetadata = function(typeOrFunc) {
        return this.reflectionCapabilities.propMetadata(typeOrFunc);
      };
      Reflector.prototype.hasLifecycleHook = function(type, lcProperty) {
        return this.reflectionCapabilities.hasLifecycleHook(type, lcProperty);
      };
      Reflector.prototype.getter = function(name) {
        return this.reflectionCapabilities.getter(name);
      };
      Reflector.prototype.setter = function(name) {
        return this.reflectionCapabilities.setter(name);
      };
      Reflector.prototype.method = function(name) {
        return this.reflectionCapabilities.method(name);
      };
      Reflector.prototype.importUri = function(type) {
        return this.reflectionCapabilities.importUri(type);
      };
      Reflector.prototype.resourceUri = function(type) {
        return this.reflectionCapabilities.resourceUri(type);
      };
      Reflector.prototype.resolveIdentifier = function(name, moduleUrl, members, runtime) {
        return this.reflectionCapabilities.resolveIdentifier(name, moduleUrl, members, runtime);
      };
      Reflector.prototype.resolveEnum = function(identifier, name) {
        return this.reflectionCapabilities.resolveEnum(identifier, name);
      };
      return Reflector;
    }());
    var reflector = new Reflector(new ReflectionCapabilities());
    var ReflectiveDependency = (function() {
      function ReflectiveDependency(key, optional, visibility) {
        this.key = key;
        this.optional = optional;
        this.visibility = visibility;
      }
      ReflectiveDependency.fromKey = function(key) {
        return new ReflectiveDependency(key, false, null);
      };
      return ReflectiveDependency;
    }());
    var _EMPTY_LIST = [];
    var ResolvedReflectiveProvider_ = (function() {
      function ResolvedReflectiveProvider_(key, resolvedFactories, multiProvider) {
        this.key = key;
        this.resolvedFactories = resolvedFactories;
        this.multiProvider = multiProvider;
      }
      Object.defineProperty(ResolvedReflectiveProvider_.prototype, "resolvedFactory", {
        get: function() {
          return this.resolvedFactories[0];
        },
        enumerable: true,
        configurable: true
      });
      return ResolvedReflectiveProvider_;
    }());
    var ResolvedReflectiveFactory = (function() {
      function ResolvedReflectiveFactory(factory, dependencies) {
        this.factory = factory;
        this.dependencies = dependencies;
      }
      return ResolvedReflectiveFactory;
    }());
    function resolveReflectiveFactory(provider) {
      var factoryFn;
      var resolvedDeps;
      if (provider.useClass) {
        var useClass = resolveForwardRef(provider.useClass);
        factoryFn = reflector.factory(useClass);
        resolvedDeps = _dependenciesFor(useClass);
      } else if (provider.useExisting) {
        factoryFn = function(aliasInstance) {
          return aliasInstance;
        };
        resolvedDeps = [ReflectiveDependency.fromKey(ReflectiveKey.get(provider.useExisting))];
      } else if (provider.useFactory) {
        factoryFn = provider.useFactory;
        resolvedDeps = constructDependencies(provider.useFactory, provider.deps);
      } else {
        factoryFn = function() {
          return provider.useValue;
        };
        resolvedDeps = _EMPTY_LIST;
      }
      return new ResolvedReflectiveFactory(factoryFn, resolvedDeps);
    }
    function resolveReflectiveProvider(provider) {
      return new ResolvedReflectiveProvider_(ReflectiveKey.get(provider.provide), [resolveReflectiveFactory(provider)], provider.multi || false);
    }
    function resolveReflectiveProviders(providers) {
      var normalized = _normalizeProviders(providers, []);
      var resolved = normalized.map(resolveReflectiveProvider);
      var resolvedProviderMap = mergeResolvedReflectiveProviders(resolved, new Map());
      return Array.from(resolvedProviderMap.values());
    }
    function mergeResolvedReflectiveProviders(providers, normalizedProvidersMap) {
      for (var i = 0; i < providers.length; i++) {
        var provider = providers[i];
        var existing = normalizedProvidersMap.get(provider.key.id);
        if (existing) {
          if (provider.multiProvider !== existing.multiProvider) {
            throw mixingMultiProvidersWithRegularProvidersError(existing, provider);
          }
          if (provider.multiProvider) {
            for (var j = 0; j < provider.resolvedFactories.length; j++) {
              existing.resolvedFactories.push(provider.resolvedFactories[j]);
            }
          } else {
            normalizedProvidersMap.set(provider.key.id, provider);
          }
        } else {
          var resolvedProvider = void 0;
          if (provider.multiProvider) {
            resolvedProvider = new ResolvedReflectiveProvider_(provider.key, provider.resolvedFactories.slice(), provider.multiProvider);
          } else {
            resolvedProvider = provider;
          }
          normalizedProvidersMap.set(provider.key.id, resolvedProvider);
        }
      }
      return normalizedProvidersMap;
    }
    function _normalizeProviders(providers, res) {
      providers.forEach(function(b) {
        if (b instanceof Type) {
          res.push({
            provide: b,
            useClass: b
          });
        } else if (b && typeof b == 'object' && ((b)).provide !== undefined) {
          res.push((b));
        } else if (b instanceof Array) {
          _normalizeProviders(b, res);
        } else {
          throw invalidProviderError(b);
        }
      });
      return res;
    }
    function constructDependencies(typeOrFunc, dependencies) {
      if (!dependencies) {
        return _dependenciesFor(typeOrFunc);
      } else {
        var params_1 = dependencies.map(function(t) {
          return [t];
        });
        return dependencies.map(function(t) {
          return _extractToken(typeOrFunc, t, params_1);
        });
      }
    }
    function _dependenciesFor(typeOrFunc) {
      var params = reflector.parameters(typeOrFunc);
      if (!params)
        return [];
      if (params.some(function(p) {
        return p == null;
      })) {
        throw noAnnotationError(typeOrFunc, params);
      }
      return params.map(function(p) {
        return _extractToken(typeOrFunc, p, params);
      });
    }
    function _extractToken(typeOrFunc, metadata, params) {
      var token = null;
      var optional = false;
      if (!Array.isArray(metadata)) {
        if (metadata instanceof Inject) {
          return _createDependency(metadata.token, optional, null);
        } else {
          return _createDependency(metadata, optional, null);
        }
      }
      var visibility = null;
      for (var i = 0; i < metadata.length; ++i) {
        var paramMetadata = metadata[i];
        if (paramMetadata instanceof Type) {
          token = paramMetadata;
        } else if (paramMetadata instanceof Inject) {
          token = paramMetadata.token;
        } else if (paramMetadata instanceof Optional) {
          optional = true;
        } else if (paramMetadata instanceof Self || paramMetadata instanceof SkipSelf) {
          visibility = paramMetadata;
        } else if (paramMetadata instanceof InjectionToken) {
          token = paramMetadata;
        }
      }
      token = resolveForwardRef(token);
      if (token != null) {
        return _createDependency(token, optional, visibility);
      } else {
        throw noAnnotationError(typeOrFunc, params);
      }
    }
    function _createDependency(token, optional, visibility) {
      return new ReflectiveDependency(ReflectiveKey.get(token), optional, visibility);
    }
    var UNDEFINED = new Object();
    var ReflectiveInjector = (function() {
      function ReflectiveInjector() {}
      ReflectiveInjector.resolve = function(providers) {
        return resolveReflectiveProviders(providers);
      };
      ReflectiveInjector.resolveAndCreate = function(providers, parent) {
        var ResolvedReflectiveProviders = ReflectiveInjector.resolve(providers);
        return ReflectiveInjector.fromResolvedProviders(ResolvedReflectiveProviders, parent);
      };
      ReflectiveInjector.fromResolvedProviders = function(providers, parent) {
        return new ReflectiveInjector_(providers, parent);
      };
      ReflectiveInjector.prototype.parent = function() {};
      ReflectiveInjector.prototype.resolveAndCreateChild = function(providers) {};
      ReflectiveInjector.prototype.createChildFromResolved = function(providers) {};
      ReflectiveInjector.prototype.resolveAndInstantiate = function(provider) {};
      ReflectiveInjector.prototype.instantiateResolved = function(provider) {};
      ReflectiveInjector.prototype.get = function(token, notFoundValue) {};
      return ReflectiveInjector;
    }());
    var ReflectiveInjector_ = (function() {
      function ReflectiveInjector_(_providers, _parent) {
        this._constructionCounter = 0;
        this._providers = _providers;
        this._parent = _parent || null;
        var len = _providers.length;
        this.keyIds = new Array(len);
        this.objs = new Array(len);
        for (var i = 0; i < len; i++) {
          this.keyIds[i] = _providers[i].key.id;
          this.objs[i] = UNDEFINED;
        }
      }
      ReflectiveInjector_.prototype.get = function(token, notFoundValue) {
        if (notFoundValue === void 0) {
          notFoundValue = THROW_IF_NOT_FOUND;
        }
        return this._getByKey(ReflectiveKey.get(token), null, notFoundValue);
      };
      Object.defineProperty(ReflectiveInjector_.prototype, "parent", {
        get: function() {
          return this._parent;
        },
        enumerable: true,
        configurable: true
      });
      ReflectiveInjector_.prototype.resolveAndCreateChild = function(providers) {
        var ResolvedReflectiveProviders = ReflectiveInjector.resolve(providers);
        return this.createChildFromResolved(ResolvedReflectiveProviders);
      };
      ReflectiveInjector_.prototype.createChildFromResolved = function(providers) {
        var inj = new ReflectiveInjector_(providers);
        inj._parent = this;
        return inj;
      };
      ReflectiveInjector_.prototype.resolveAndInstantiate = function(provider) {
        return this.instantiateResolved(ReflectiveInjector.resolve([provider])[0]);
      };
      ReflectiveInjector_.prototype.instantiateResolved = function(provider) {
        return this._instantiateProvider(provider);
      };
      ReflectiveInjector_.prototype.getProviderAtIndex = function(index) {
        if (index < 0 || index >= this._providers.length) {
          throw outOfBoundsError(index);
        }
        return this._providers[index];
      };
      ReflectiveInjector_.prototype._new = function(provider) {
        if (this._constructionCounter++ > this._getMaxNumberOfObjects()) {
          throw cyclicDependencyError(this, provider.key);
        }
        return this._instantiateProvider(provider);
      };
      ReflectiveInjector_.prototype._getMaxNumberOfObjects = function() {
        return this.objs.length;
      };
      ReflectiveInjector_.prototype._instantiateProvider = function(provider) {
        if (provider.multiProvider) {
          var res = new Array(provider.resolvedFactories.length);
          for (var i = 0; i < provider.resolvedFactories.length; ++i) {
            res[i] = this._instantiate(provider, provider.resolvedFactories[i]);
          }
          return res;
        } else {
          return this._instantiate(provider, provider.resolvedFactories[0]);
        }
      };
      ReflectiveInjector_.prototype._instantiate = function(provider, ResolvedReflectiveFactory$$1) {
        var _this = this;
        var factory = ResolvedReflectiveFactory$$1.factory;
        var deps;
        try {
          deps = ResolvedReflectiveFactory$$1.dependencies.map(function(dep) {
            return _this._getByReflectiveDependency(dep);
          });
        } catch (e) {
          if (e.addKey) {
            e.addKey(this, provider.key);
          }
          throw e;
        }
        var obj;
        try {
          obj = factory.apply(void 0, deps);
        } catch (e) {
          throw instantiationError(this, e, e.stack, provider.key);
        }
        return obj;
      };
      ReflectiveInjector_.prototype._getByReflectiveDependency = function(dep) {
        return this._getByKey(dep.key, dep.visibility, dep.optional ? null : THROW_IF_NOT_FOUND);
      };
      ReflectiveInjector_.prototype._getByKey = function(key, visibility, notFoundValue) {
        if (key === INJECTOR_KEY) {
          return this;
        }
        if (visibility instanceof Self) {
          return this._getByKeySelf(key, notFoundValue);
        } else {
          return this._getByKeyDefault(key, notFoundValue, visibility);
        }
      };
      ReflectiveInjector_.prototype._getObjByKeyId = function(keyId) {
        for (var i = 0; i < this.keyIds.length; i++) {
          if (this.keyIds[i] === keyId) {
            if (this.objs[i] === UNDEFINED) {
              this.objs[i] = this._new(this._providers[i]);
            }
            return this.objs[i];
          }
        }
        return UNDEFINED;
      };
      ReflectiveInjector_.prototype._throwOrNull = function(key, notFoundValue) {
        if (notFoundValue !== THROW_IF_NOT_FOUND) {
          return notFoundValue;
        } else {
          throw noProviderError(this, key);
        }
      };
      ReflectiveInjector_.prototype._getByKeySelf = function(key, notFoundValue) {
        var obj = this._getObjByKeyId(key.id);
        return (obj !== UNDEFINED) ? obj : this._throwOrNull(key, notFoundValue);
      };
      ReflectiveInjector_.prototype._getByKeyDefault = function(key, notFoundValue, visibility) {
        var inj;
        if (visibility instanceof SkipSelf) {
          inj = this._parent;
        } else {
          inj = this;
        }
        while (inj instanceof ReflectiveInjector_) {
          var inj_ = (inj);
          var obj = inj_._getObjByKeyId(key.id);
          if (obj !== UNDEFINED)
            return obj;
          inj = inj_._parent;
        }
        if (inj !== null) {
          return inj.get(key.token, notFoundValue);
        } else {
          return this._throwOrNull(key, notFoundValue);
        }
      };
      Object.defineProperty(ReflectiveInjector_.prototype, "displayName", {
        get: function() {
          var providers = _mapProviders(this, function(b) {
            return ' "' + b.key.displayName + '" ';
          }).join(', ');
          return "ReflectiveInjector(providers: [" + providers + "])";
        },
        enumerable: true,
        configurable: true
      });
      ReflectiveInjector_.prototype.toString = function() {
        return this.displayName;
      };
      return ReflectiveInjector_;
    }());
    var INJECTOR_KEY = ReflectiveKey.get(Injector);
    function _mapProviders(injector, fn) {
      var res = new Array(injector._providers.length);
      for (var i = 0; i < injector._providers.length; ++i) {
        res[i] = fn(injector.getProviderAtIndex(i));
      }
      return res;
    }
    function isPromise(obj) {
      return !!obj && typeof obj.then === 'function';
    }
    function isObservable(obj) {
      return !!obj && typeof obj.subscribe === 'function';
    }
    var APP_INITIALIZER = new InjectionToken('Application Initializer');
    var ApplicationInitStatus = (function() {
      function ApplicationInitStatus(appInits) {
        var _this = this;
        this.appInits = appInits;
        this.initialized = false;
        this._done = false;
        this._donePromise = new Promise(function(res, rej) {
          _this.resolve = res;
          _this.reject = rej;
        });
      }
      ApplicationInitStatus.prototype.runInitializers = function() {
        var _this = this;
        if (this.initialized) {
          return;
        }
        var asyncInitPromises = [];
        var complete = function() {
          _this._done = true;
          _this.resolve();
        };
        if (this.appInits) {
          for (var i = 0; i < this.appInits.length; i++) {
            var initResult = this.appInits[i]();
            if (isPromise(initResult)) {
              asyncInitPromises.push(initResult);
            }
          }
        }
        Promise.all(asyncInitPromises).then(function() {
          complete();
        }).catch(function(e) {
          _this.reject(e);
        });
        if (asyncInitPromises.length === 0) {
          complete();
        }
        this.initialized = true;
      };
      Object.defineProperty(ApplicationInitStatus.prototype, "done", {
        get: function() {
          return this._done;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ApplicationInitStatus.prototype, "donePromise", {
        get: function() {
          return this._donePromise;
        },
        enumerable: true,
        configurable: true
      });
      return ApplicationInitStatus;
    }());
    ApplicationInitStatus.decorators = [{type: Injectable}];
    ApplicationInitStatus.ctorParameters = function() {
      return [{
        type: Array,
        decorators: [{
          type: Inject,
          args: [APP_INITIALIZER]
        }, {type: Optional}]
      }];
    };
    var APP_ID = new InjectionToken('AppId');
    function _appIdRandomProviderFactory() {
      return "" + _randomChar() + _randomChar() + _randomChar();
    }
    var APP_ID_RANDOM_PROVIDER = {
      provide: APP_ID,
      useFactory: _appIdRandomProviderFactory,
      deps: []
    };
    function _randomChar() {
      return String.fromCharCode(97 + Math.floor(Math.random() * 25));
    }
    var PLATFORM_INITIALIZER = new InjectionToken('Platform Initializer');
    var PLATFORM_ID = new InjectionToken('Platform ID');
    var APP_BOOTSTRAP_LISTENER = new InjectionToken('appBootstrapListener');
    var PACKAGE_ROOT_URL = new InjectionToken('Application Packages Root URL');
    var Console = (function() {
      function Console() {}
      Console.prototype.log = function(message) {
        console.log(message);
      };
      Console.prototype.warn = function(message) {
        console.warn(message);
      };
      return Console;
    }());
    Console.decorators = [{type: Injectable}];
    Console.ctorParameters = function() {
      return [];
    };
    var ModuleWithComponentFactories = (function() {
      function ModuleWithComponentFactories(ngModuleFactory, componentFactories) {
        this.ngModuleFactory = ngModuleFactory;
        this.componentFactories = componentFactories;
      }
      return ModuleWithComponentFactories;
    }());
    function _throwError() {
      throw new Error("Runtime compiler is not loaded");
    }
    var Compiler = (function() {
      function Compiler() {}
      Compiler.prototype.compileModuleSync = function(moduleType) {
        throw _throwError();
      };
      Compiler.prototype.compileModuleAsync = function(moduleType) {
        throw _throwError();
      };
      Compiler.prototype.compileModuleAndAllComponentsSync = function(moduleType) {
        throw _throwError();
      };
      Compiler.prototype.compileModuleAndAllComponentsAsync = function(moduleType) {
        throw _throwError();
      };
      Compiler.prototype.getNgContentSelectors = function(component) {
        throw _throwError();
      };
      Compiler.prototype.clearCache = function() {};
      Compiler.prototype.clearCacheFor = function(type) {};
      return Compiler;
    }());
    Compiler.decorators = [{type: Injectable}];
    Compiler.ctorParameters = function() {
      return [];
    };
    var COMPILER_OPTIONS = new InjectionToken('compilerOptions');
    var CompilerFactory = (function() {
      function CompilerFactory() {}
      CompilerFactory.prototype.createCompiler = function(options) {};
      return CompilerFactory;
    }());
    var ComponentRef = (function() {
      function ComponentRef() {}
      ComponentRef.prototype.location = function() {};
      ComponentRef.prototype.injector = function() {};
      ComponentRef.prototype.instance = function() {};
      ComponentRef.prototype.hostView = function() {};
      ComponentRef.prototype.changeDetectorRef = function() {};
      ComponentRef.prototype.componentType = function() {};
      ComponentRef.prototype.destroy = function() {};
      ComponentRef.prototype.onDestroy = function(callback) {};
      return ComponentRef;
    }());
    var ComponentFactory = (function() {
      function ComponentFactory() {}
      ComponentFactory.prototype.selector = function() {};
      ComponentFactory.prototype.componentType = function() {};
      ComponentFactory.prototype.ngContentSelectors = function() {};
      ComponentFactory.prototype.inputs = function() {};
      ComponentFactory.prototype.outputs = function() {};
      ComponentFactory.prototype.create = function(injector, projectableNodes, rootSelectorOrNode, ngModule) {};
      return ComponentFactory;
    }());
    function noComponentFactoryError(component) {
      var error = Error("No component factory found for " + stringify(component) + ". Did you add it to @NgModule.entryComponents?");
      ((error))[ERROR_COMPONENT] = component;
      return error;
    }
    var ERROR_COMPONENT = 'ngComponent';
    var _NullComponentFactoryResolver = (function() {
      function _NullComponentFactoryResolver() {}
      _NullComponentFactoryResolver.prototype.resolveComponentFactory = function(component) {
        throw noComponentFactoryError(component);
      };
      return _NullComponentFactoryResolver;
    }());
    var ComponentFactoryResolver = (function() {
      function ComponentFactoryResolver() {}
      ComponentFactoryResolver.prototype.resolveComponentFactory = function(component) {};
      return ComponentFactoryResolver;
    }());
    ComponentFactoryResolver.NULL = new _NullComponentFactoryResolver();
    var CodegenComponentFactoryResolver = (function() {
      function CodegenComponentFactoryResolver(factories, _parent, _ngModule) {
        this._parent = _parent;
        this._ngModule = _ngModule;
        this._factories = new Map();
        for (var i = 0; i < factories.length; i++) {
          var factory = factories[i];
          this._factories.set(factory.componentType, factory);
        }
      }
      CodegenComponentFactoryResolver.prototype.resolveComponentFactory = function(component) {
        var factory = this._factories.get(component);
        if (!factory && this._parent) {
          factory = this._parent.resolveComponentFactory(component);
        }
        if (!factory) {
          throw noComponentFactoryError(component);
        }
        return new ComponentFactoryBoundToModule(factory, this._ngModule);
      };
      return CodegenComponentFactoryResolver;
    }());
    var ComponentFactoryBoundToModule = (function(_super) {
      __extends(ComponentFactoryBoundToModule, _super);
      function ComponentFactoryBoundToModule(factory, ngModule) {
        var _this = _super.call(this) || this;
        _this.factory = factory;
        _this.ngModule = ngModule;
        return _this;
      }
      Object.defineProperty(ComponentFactoryBoundToModule.prototype, "selector", {
        get: function() {
          return this.factory.selector;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ComponentFactoryBoundToModule.prototype, "componentType", {
        get: function() {
          return this.factory.componentType;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ComponentFactoryBoundToModule.prototype, "ngContentSelectors", {
        get: function() {
          return this.factory.ngContentSelectors;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ComponentFactoryBoundToModule.prototype, "inputs", {
        get: function() {
          return this.factory.inputs;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ComponentFactoryBoundToModule.prototype, "outputs", {
        get: function() {
          return this.factory.outputs;
        },
        enumerable: true,
        configurable: true
      });
      ComponentFactoryBoundToModule.prototype.create = function(injector, projectableNodes, rootSelectorOrNode, ngModule) {
        return this.factory.create(injector, projectableNodes, rootSelectorOrNode, ngModule || this.ngModule);
      };
      return ComponentFactoryBoundToModule;
    }(ComponentFactory));
    var NgModuleRef = (function() {
      function NgModuleRef() {}
      NgModuleRef.prototype.injector = function() {};
      NgModuleRef.prototype.componentFactoryResolver = function() {};
      NgModuleRef.prototype.instance = function() {};
      NgModuleRef.prototype.destroy = function() {};
      NgModuleRef.prototype.onDestroy = function(callback) {};
      return NgModuleRef;
    }());
    var NgModuleFactory = (function() {
      function NgModuleFactory() {}
      NgModuleFactory.prototype.moduleType = function() {};
      NgModuleFactory.prototype.create = function(parentInjector) {};
      return NgModuleFactory;
    }());
    var trace;
    var events;
    function detectWTF() {
      var wtf = ((_global))['wtf'];
      if (wtf) {
        trace = wtf['trace'];
        if (trace) {
          events = trace['events'];
          return true;
        }
      }
      return false;
    }
    function createScope$1(signature, flags) {
      if (flags === void 0) {
        flags = null;
      }
      return events.createScope(signature, flags);
    }
    function leave(scope, returnValue) {
      trace.leaveScope(scope, returnValue);
      return returnValue;
    }
    function startTimeRange(rangeType, action) {
      return trace.beginTimeRange(rangeType, action);
    }
    function endTimeRange(range) {
      trace.endTimeRange(range);
    }
    var wtfEnabled = detectWTF();
    function noopScope(arg0, arg1) {
      return null;
    }
    var wtfCreateScope = wtfEnabled ? createScope$1 : function(signature, flags) {
      return noopScope;
    };
    var wtfLeave = wtfEnabled ? leave : function(s, r) {
      return r;
    };
    var wtfStartTimeRange = wtfEnabled ? startTimeRange : function(rangeType, action) {
      return null;
    };
    var wtfEndTimeRange = wtfEnabled ? endTimeRange : function(r) {
      return null;
    };
    var EventEmitter = (function(_super) {
      __extends(EventEmitter, _super);
      function EventEmitter(isAsync) {
        if (isAsync === void 0) {
          isAsync = false;
        }
        var _this = _super.call(this) || this;
        _this.__isAsync = isAsync;
        return _this;
      }
      EventEmitter.prototype.emit = function(value) {
        _super.prototype.next.call(this, value);
      };
      EventEmitter.prototype.subscribe = function(generatorOrNext, error, complete) {
        var schedulerFn;
        var errorFn = function(err) {
          return null;
        };
        var completeFn = function() {
          return null;
        };
        if (generatorOrNext && typeof generatorOrNext === 'object') {
          schedulerFn = this.__isAsync ? function(value) {
            setTimeout(function() {
              return generatorOrNext.next(value);
            });
          } : function(value) {
            generatorOrNext.next(value);
          };
          if (generatorOrNext.error) {
            errorFn = this.__isAsync ? function(err) {
              setTimeout(function() {
                return generatorOrNext.error(err);
              });
            } : function(err) {
              generatorOrNext.error(err);
            };
          }
          if (generatorOrNext.complete) {
            completeFn = this.__isAsync ? function() {
              setTimeout(function() {
                return generatorOrNext.complete();
              });
            } : function() {
              generatorOrNext.complete();
            };
          }
        } else {
          schedulerFn = this.__isAsync ? function(value) {
            setTimeout(function() {
              return generatorOrNext(value);
            });
          } : function(value) {
            generatorOrNext(value);
          };
          if (error) {
            errorFn = this.__isAsync ? function(err) {
              setTimeout(function() {
                return error(err);
              });
            } : function(err) {
              error(err);
            };
          }
          if (complete) {
            completeFn = this.__isAsync ? function() {
              setTimeout(function() {
                return complete();
              });
            } : function() {
              complete();
            };
          }
        }
        return _super.prototype.subscribe.call(this, schedulerFn, errorFn, completeFn);
      };
      return EventEmitter;
    }(rxjs_Subject.Subject));
    var NgZone = (function() {
      function NgZone(_a) {
        var _b = _a.enableLongStackTrace,
            enableLongStackTrace = _b === void 0 ? false : _b;
        this._hasPendingMicrotasks = false;
        this._hasPendingMacrotasks = false;
        this._isStable = true;
        this._nesting = 0;
        this._onUnstable = new EventEmitter(false);
        this._onMicrotaskEmpty = new EventEmitter(false);
        this._onStable = new EventEmitter(false);
        this._onErrorEvents = new EventEmitter(false);
        if (typeof Zone == 'undefined') {
          throw new Error('Angular requires Zone.js prolyfill.');
        }
        Zone.assertZonePatched();
        this.outer = this.inner = Zone.current;
        if (Zone['wtfZoneSpec']) {
          this.inner = this.inner.fork(Zone['wtfZoneSpec']);
        }
        if (enableLongStackTrace && Zone['longStackTraceZoneSpec']) {
          this.inner = this.inner.fork(Zone['longStackTraceZoneSpec']);
        }
        this.forkInnerZoneWithAngularBehavior();
      }
      NgZone.isInAngularZone = function() {
        return Zone.current.get('isAngularZone') === true;
      };
      NgZone.assertInAngularZone = function() {
        if (!NgZone.isInAngularZone()) {
          throw new Error('Expected to be in Angular Zone, but it is not!');
        }
      };
      NgZone.assertNotInAngularZone = function() {
        if (NgZone.isInAngularZone()) {
          throw new Error('Expected to not be in Angular Zone, but it is!');
        }
      };
      NgZone.prototype.run = function(fn) {
        return this.inner.run(fn);
      };
      NgZone.prototype.runGuarded = function(fn) {
        return this.inner.runGuarded(fn);
      };
      NgZone.prototype.runOutsideAngular = function(fn) {
        return this.outer.run(fn);
      };
      Object.defineProperty(NgZone.prototype, "onUnstable", {
        get: function() {
          return this._onUnstable;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(NgZone.prototype, "onMicrotaskEmpty", {
        get: function() {
          return this._onMicrotaskEmpty;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(NgZone.prototype, "onStable", {
        get: function() {
          return this._onStable;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(NgZone.prototype, "onError", {
        get: function() {
          return this._onErrorEvents;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(NgZone.prototype, "isStable", {
        get: function() {
          return this._isStable;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(NgZone.prototype, "hasPendingMicrotasks", {
        get: function() {
          return this._hasPendingMicrotasks;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(NgZone.prototype, "hasPendingMacrotasks", {
        get: function() {
          return this._hasPendingMacrotasks;
        },
        enumerable: true,
        configurable: true
      });
      NgZone.prototype.checkStable = function() {
        var _this = this;
        if (this._nesting == 0 && !this._hasPendingMicrotasks && !this._isStable) {
          try {
            this._nesting++;
            this._onMicrotaskEmpty.emit(null);
          } finally {
            this._nesting--;
            if (!this._hasPendingMicrotasks) {
              try {
                this.runOutsideAngular(function() {
                  return _this._onStable.emit(null);
                });
              } finally {
                this._isStable = true;
              }
            }
          }
        }
      };
      NgZone.prototype.forkInnerZoneWithAngularBehavior = function() {
        var _this = this;
        this.inner = this.inner.fork({
          name: 'angular',
          properties: ({'isAngularZone': true}),
          onInvokeTask: function(delegate, current, target, task, applyThis, applyArgs) {
            try {
              _this.onEnter();
              return delegate.invokeTask(target, task, applyThis, applyArgs);
            } finally {
              _this.onLeave();
            }
          },
          onInvoke: function(delegate, current, target, callback, applyThis, applyArgs, source) {
            try {
              _this.onEnter();
              return delegate.invoke(target, callback, applyThis, applyArgs, source);
            } finally {
              _this.onLeave();
            }
          },
          onHasTask: function(delegate, current, target, hasTaskState) {
            delegate.hasTask(target, hasTaskState);
            if (current === target) {
              if (hasTaskState.change == 'microTask') {
                _this.setHasMicrotask(hasTaskState.microTask);
              } else if (hasTaskState.change == 'macroTask') {
                _this.setHasMacrotask(hasTaskState.macroTask);
              }
            }
          },
          onHandleError: function(delegate, current, target, error) {
            delegate.handleError(target, error);
            _this.triggerError(error);
            return false;
          }
        });
      };
      NgZone.prototype.onEnter = function() {
        this._nesting++;
        if (this._isStable) {
          this._isStable = false;
          this._onUnstable.emit(null);
        }
      };
      NgZone.prototype.onLeave = function() {
        this._nesting--;
        this.checkStable();
      };
      NgZone.prototype.setHasMicrotask = function(hasMicrotasks) {
        this._hasPendingMicrotasks = hasMicrotasks;
        this.checkStable();
      };
      NgZone.prototype.setHasMacrotask = function(hasMacrotasks) {
        this._hasPendingMacrotasks = hasMacrotasks;
      };
      NgZone.prototype.triggerError = function(error) {
        this._onErrorEvents.emit(error);
      };
      return NgZone;
    }());
    var Testability = (function() {
      function Testability(_ngZone) {
        this._ngZone = _ngZone;
        this._pendingCount = 0;
        this._isZoneStable = true;
        this._didWork = false;
        this._callbacks = [];
        this._watchAngularEvents();
      }
      Testability.prototype._watchAngularEvents = function() {
        var _this = this;
        this._ngZone.onUnstable.subscribe({next: function() {
            _this._didWork = true;
            _this._isZoneStable = false;
          }});
        this._ngZone.runOutsideAngular(function() {
          _this._ngZone.onStable.subscribe({next: function() {
              NgZone.assertNotInAngularZone();
              scheduleMicroTask(function() {
                _this._isZoneStable = true;
                _this._runCallbacksIfReady();
              });
            }});
        });
      };
      Testability.prototype.increasePendingRequestCount = function() {
        this._pendingCount += 1;
        this._didWork = true;
        return this._pendingCount;
      };
      Testability.prototype.decreasePendingRequestCount = function() {
        this._pendingCount -= 1;
        if (this._pendingCount < 0) {
          throw new Error('pending async requests below zero');
        }
        this._runCallbacksIfReady();
        return this._pendingCount;
      };
      Testability.prototype.isStable = function() {
        return this._isZoneStable && this._pendingCount == 0 && !this._ngZone.hasPendingMacrotasks;
      };
      Testability.prototype._runCallbacksIfReady = function() {
        var _this = this;
        if (this.isStable()) {
          scheduleMicroTask(function() {
            while (_this._callbacks.length !== 0) {
              (((_this._callbacks.pop())))(_this._didWork);
            }
            _this._didWork = false;
          });
        } else {
          this._didWork = true;
        }
      };
      Testability.prototype.whenStable = function(callback) {
        this._callbacks.push(callback);
        this._runCallbacksIfReady();
      };
      Testability.prototype.getPendingRequestCount = function() {
        return this._pendingCount;
      };
      Testability.prototype.findBindings = function(using, provider, exactMatch) {
        return [];
      };
      Testability.prototype.findProviders = function(using, provider, exactMatch) {
        return [];
      };
      return Testability;
    }());
    Testability.decorators = [{type: Injectable}];
    Testability.ctorParameters = function() {
      return [{type: NgZone}];
    };
    var TestabilityRegistry = (function() {
      function TestabilityRegistry() {
        this._applications = new Map();
        _testabilityGetter.addToWindow(this);
      }
      TestabilityRegistry.prototype.registerApplication = function(token, testability) {
        this._applications.set(token, testability);
      };
      TestabilityRegistry.prototype.getTestability = function(elem) {
        return this._applications.get(elem) || null;
      };
      TestabilityRegistry.prototype.getAllTestabilities = function() {
        return Array.from(this._applications.values());
      };
      TestabilityRegistry.prototype.getAllRootElements = function() {
        return Array.from(this._applications.keys());
      };
      TestabilityRegistry.prototype.findTestabilityInTree = function(elem, findInAncestors) {
        if (findInAncestors === void 0) {
          findInAncestors = true;
        }
        return _testabilityGetter.findTestabilityInTree(this, elem, findInAncestors);
      };
      return TestabilityRegistry;
    }());
    TestabilityRegistry.decorators = [{type: Injectable}];
    TestabilityRegistry.ctorParameters = function() {
      return [];
    };
    var _NoopGetTestability = (function() {
      function _NoopGetTestability() {}
      _NoopGetTestability.prototype.addToWindow = function(registry) {};
      _NoopGetTestability.prototype.findTestabilityInTree = function(registry, elem, findInAncestors) {
        return null;
      };
      return _NoopGetTestability;
    }());
    function setTestabilityGetter(getter) {
      _testabilityGetter = getter;
    }
    var _testabilityGetter = new _NoopGetTestability();
    var _devMode = true;
    var _runModeLocked = false;
    var _platform;
    var ALLOW_MULTIPLE_PLATFORMS = new InjectionToken('AllowMultipleToken');
    function enableProdMode() {
      if (_runModeLocked) {
        throw new Error('Cannot enable prod mode after platform setup.');
      }
      _devMode = false;
    }
    function isDevMode() {
      _runModeLocked = true;
      return _devMode;
    }
    var NgProbeToken = (function() {
      function NgProbeToken(name, token) {
        this.name = name;
        this.token = token;
      }
      return NgProbeToken;
    }());
    function createPlatform(injector) {
      if (_platform && !_platform.destroyed && !_platform.injector.get(ALLOW_MULTIPLE_PLATFORMS, false)) {
        throw new Error('There can be only one platform. Destroy the previous one to create a new one.');
      }
      _platform = injector.get(PlatformRef);
      var inits = injector.get(PLATFORM_INITIALIZER, null);
      if (inits)
        inits.forEach(function(init) {
          return init();
        });
      return _platform;
    }
    function createPlatformFactory(parentPlatformFactory, name, providers) {
      if (providers === void 0) {
        providers = [];
      }
      var marker = new InjectionToken("Platform: " + name);
      return function(extraProviders) {
        if (extraProviders === void 0) {
          extraProviders = [];
        }
        var platform = getPlatform();
        if (!platform || platform.injector.get(ALLOW_MULTIPLE_PLATFORMS, false)) {
          if (parentPlatformFactory) {
            parentPlatformFactory(providers.concat(extraProviders).concat({
              provide: marker,
              useValue: true
            }));
          } else {
            createPlatform(ReflectiveInjector.resolveAndCreate(providers.concat(extraProviders).concat({
              provide: marker,
              useValue: true
            })));
          }
        }
        return assertPlatform(marker);
      };
    }
    function assertPlatform(requiredToken) {
      var platform = getPlatform();
      if (!platform) {
        throw new Error('No platform exists!');
      }
      if (!platform.injector.get(requiredToken, null)) {
        throw new Error('A platform with a different configuration has been created. Please destroy it first.');
      }
      return platform;
    }
    function destroyPlatform() {
      if (_platform && !_platform.destroyed) {
        _platform.destroy();
      }
    }
    function getPlatform() {
      return _platform && !_platform.destroyed ? _platform : null;
    }
    var PlatformRef = (function() {
      function PlatformRef() {}
      PlatformRef.prototype.bootstrapModuleFactory = function(moduleFactory) {};
      PlatformRef.prototype.bootstrapModule = function(moduleType, compilerOptions) {};
      PlatformRef.prototype.onDestroy = function(callback) {};
      PlatformRef.prototype.injector = function() {};
      PlatformRef.prototype.destroy = function() {};
      PlatformRef.prototype.destroyed = function() {};
      return PlatformRef;
    }());
    function _callAndReportToErrorHandler(errorHandler, callback) {
      try {
        var result = callback();
        if (isPromise(result)) {
          return result.catch(function(e) {
            errorHandler.handleError(e);
            throw e;
          });
        }
        return result;
      } catch (e) {
        errorHandler.handleError(e);
        throw e;
      }
    }
    var PlatformRef_ = (function(_super) {
      __extends(PlatformRef_, _super);
      function PlatformRef_(_injector) {
        var _this = _super.call(this) || this;
        _this._injector = _injector;
        _this._modules = [];
        _this._destroyListeners = [];
        _this._destroyed = false;
        return _this;
      }
      PlatformRef_.prototype.onDestroy = function(callback) {
        this._destroyListeners.push(callback);
      };
      Object.defineProperty(PlatformRef_.prototype, "injector", {
        get: function() {
          return this._injector;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(PlatformRef_.prototype, "destroyed", {
        get: function() {
          return this._destroyed;
        },
        enumerable: true,
        configurable: true
      });
      PlatformRef_.prototype.destroy = function() {
        if (this._destroyed) {
          throw new Error('The platform has already been destroyed!');
        }
        this._modules.slice().forEach(function(module) {
          return module.destroy();
        });
        this._destroyListeners.forEach(function(listener) {
          return listener();
        });
        this._destroyed = true;
      };
      PlatformRef_.prototype.bootstrapModuleFactory = function(moduleFactory) {
        return this._bootstrapModuleFactoryWithZone(moduleFactory);
      };
      PlatformRef_.prototype._bootstrapModuleFactoryWithZone = function(moduleFactory, ngZone) {
        var _this = this;
        if (!ngZone)
          ngZone = new NgZone({enableLongStackTrace: isDevMode()});
        return ngZone.run(function() {
          var ngZoneInjector = ReflectiveInjector.resolveAndCreate([{
            provide: NgZone,
            useValue: ngZone
          }], _this.injector);
          var moduleRef = (moduleFactory.create(ngZoneInjector));
          var exceptionHandler = moduleRef.injector.get(ErrorHandler, null);
          if (!exceptionHandler) {
            throw new Error('No ErrorHandler. Is platform module (BrowserModule) included?');
          }
          moduleRef.onDestroy(function() {
            return remove(_this._modules, moduleRef);
          });
          ((ngZone)).onError.subscribe({next: function(error) {
              exceptionHandler.handleError(error);
            }});
          return _callAndReportToErrorHandler(exceptionHandler, function() {
            var initStatus = moduleRef.injector.get(ApplicationInitStatus);
            initStatus.runInitializers();
            return initStatus.donePromise.then(function() {
              _this._moduleDoBootstrap(moduleRef);
              return moduleRef;
            });
          });
        });
      };
      PlatformRef_.prototype.bootstrapModule = function(moduleType, compilerOptions) {
        if (compilerOptions === void 0) {
          compilerOptions = [];
        }
        return this._bootstrapModuleWithZone(moduleType, compilerOptions);
      };
      PlatformRef_.prototype._bootstrapModuleWithZone = function(moduleType, compilerOptions, ngZone) {
        var _this = this;
        if (compilerOptions === void 0) {
          compilerOptions = [];
        }
        var compilerFactory = this.injector.get(CompilerFactory);
        var compiler = compilerFactory.createCompiler(Array.isArray(compilerOptions) ? compilerOptions : [compilerOptions]);
        return compiler.compileModuleAsync(moduleType).then(function(moduleFactory) {
          return _this._bootstrapModuleFactoryWithZone(moduleFactory, ngZone);
        });
      };
      PlatformRef_.prototype._moduleDoBootstrap = function(moduleRef) {
        var appRef = (moduleRef.injector.get(ApplicationRef));
        if (moduleRef._bootstrapComponents.length > 0) {
          moduleRef._bootstrapComponents.forEach(function(f) {
            return appRef.bootstrap(f);
          });
        } else if (moduleRef.instance.ngDoBootstrap) {
          moduleRef.instance.ngDoBootstrap(appRef);
        } else {
          throw new Error("The module " + stringify(moduleRef.instance.constructor) + " was bootstrapped, but it does not declare \"@NgModule.bootstrap\" components nor a \"ngDoBootstrap\" method. " + "Please define one of these.");
        }
        this._modules.push(moduleRef);
      };
      return PlatformRef_;
    }(PlatformRef));
    PlatformRef_.decorators = [{type: Injectable}];
    PlatformRef_.ctorParameters = function() {
      return [{type: Injector}];
    };
    var ApplicationRef = (function() {
      function ApplicationRef() {}
      ApplicationRef.prototype.bootstrap = function(componentFactory, rootSelectorOrNode) {};
      ApplicationRef.prototype.tick = function() {};
      ApplicationRef.prototype.componentTypes = function() {};
      ApplicationRef.prototype.components = function() {};
      ApplicationRef.prototype.attachView = function(view) {};
      ApplicationRef.prototype.detachView = function(view) {};
      ApplicationRef.prototype.viewCount = function() {};
      ApplicationRef.prototype.isStable = function() {};
      return ApplicationRef;
    }());
    var ApplicationRef_ = (function(_super) {
      __extends(ApplicationRef_, _super);
      function ApplicationRef_(_zone, _console, _injector, _exceptionHandler, _componentFactoryResolver, _initStatus) {
        var _this = _super.call(this) || this;
        _this._zone = _zone;
        _this._console = _console;
        _this._injector = _injector;
        _this._exceptionHandler = _exceptionHandler;
        _this._componentFactoryResolver = _componentFactoryResolver;
        _this._initStatus = _initStatus;
        _this._bootstrapListeners = [];
        _this._rootComponents = [];
        _this._rootComponentTypes = [];
        _this._views = [];
        _this._runningTick = false;
        _this._enforceNoNewChanges = false;
        _this._stable = true;
        _this._enforceNoNewChanges = isDevMode();
        _this._zone.onMicrotaskEmpty.subscribe({next: function() {
            _this._zone.run(function() {
              _this.tick();
            });
          }});
        var isCurrentlyStable = new rxjs_Observable.Observable(function(observer) {
          _this._stable = _this._zone.isStable && !_this._zone.hasPendingMacrotasks && !_this._zone.hasPendingMicrotasks;
          _this._zone.runOutsideAngular(function() {
            observer.next(_this._stable);
            observer.complete();
          });
        });
        var isStable = new rxjs_Observable.Observable(function(observer) {
          var stableSub = _this._zone.onStable.subscribe(function() {
            NgZone.assertNotInAngularZone();
            scheduleMicroTask(function() {
              if (!_this._stable && !_this._zone.hasPendingMacrotasks && !_this._zone.hasPendingMicrotasks) {
                _this._stable = true;
                observer.next(true);
              }
            });
          });
          var unstableSub = _this._zone.onUnstable.subscribe(function() {
            NgZone.assertInAngularZone();
            if (_this._stable) {
              _this._stable = false;
              _this._zone.runOutsideAngular(function() {
                observer.next(false);
              });
            }
          });
          return function() {
            stableSub.unsubscribe();
            unstableSub.unsubscribe();
          };
        });
        _this._isStable = rxjs_observable_merge.merge(isCurrentlyStable, rxjs_operator_share.share.call(isStable));
        return _this;
      }
      ApplicationRef_.prototype.attachView = function(viewRef) {
        var view = ((viewRef));
        this._views.push(view);
        view.attachToAppRef(this);
      };
      ApplicationRef_.prototype.detachView = function(viewRef) {
        var view = ((viewRef));
        remove(this._views, view);
        view.detachFromAppRef();
      };
      ApplicationRef_.prototype.bootstrap = function(componentOrFactory, rootSelectorOrNode) {
        var _this = this;
        if (!this._initStatus.done) {
          throw new Error('Cannot bootstrap as there are still asynchronous initializers running. Bootstrap components in the `ngDoBootstrap` method of the root module.');
        }
        var componentFactory;
        if (componentOrFactory instanceof ComponentFactory) {
          componentFactory = componentOrFactory;
        } else {
          componentFactory = ((this._componentFactoryResolver.resolveComponentFactory(componentOrFactory)));
        }
        this._rootComponentTypes.push(componentFactory.componentType);
        var ngModule = componentFactory instanceof ComponentFactoryBoundToModule ? null : this._injector.get(NgModuleRef);
        var selectorOrNode = rootSelectorOrNode || componentFactory.selector;
        var compRef = componentFactory.create(Injector.NULL, [], selectorOrNode, ngModule);
        compRef.onDestroy(function() {
          _this._unloadComponent(compRef);
        });
        var testability = compRef.injector.get(Testability, null);
        if (testability) {
          compRef.injector.get(TestabilityRegistry).registerApplication(compRef.location.nativeElement, testability);
        }
        this._loadComponent(compRef);
        if (isDevMode()) {
          this._console.log("Angular is running in the development mode. Call enableProdMode() to enable the production mode.");
        }
        return compRef;
      };
      ApplicationRef_.prototype._loadComponent = function(componentRef) {
        this.attachView(componentRef.hostView);
        this.tick();
        this._rootComponents.push(componentRef);
        var listeners = this._injector.get(APP_BOOTSTRAP_LISTENER, []).concat(this._bootstrapListeners);
        listeners.forEach(function(listener) {
          return listener(componentRef);
        });
      };
      ApplicationRef_.prototype._unloadComponent = function(componentRef) {
        this.detachView(componentRef.hostView);
        remove(this._rootComponents, componentRef);
      };
      ApplicationRef_.prototype.tick = function() {
        if (this._runningTick) {
          throw new Error('ApplicationRef.tick is called recursively');
        }
        var scope = ApplicationRef_._tickScope();
        try {
          this._runningTick = true;
          this._views.forEach(function(view) {
            return view.detectChanges();
          });
          if (this._enforceNoNewChanges) {
            this._views.forEach(function(view) {
              return view.checkNoChanges();
            });
          }
        } catch (e) {
          this._exceptionHandler.handleError(e);
        } finally {
          this._runningTick = false;
          wtfLeave(scope);
        }
      };
      ApplicationRef_.prototype.ngOnDestroy = function() {
        this._views.slice().forEach(function(view) {
          return view.destroy();
        });
      };
      Object.defineProperty(ApplicationRef_.prototype, "viewCount", {
        get: function() {
          return this._views.length;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ApplicationRef_.prototype, "componentTypes", {
        get: function() {
          return this._rootComponentTypes;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ApplicationRef_.prototype, "components", {
        get: function() {
          return this._rootComponents;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ApplicationRef_.prototype, "isStable", {
        get: function() {
          return this._isStable;
        },
        enumerable: true,
        configurable: true
      });
      return ApplicationRef_;
    }(ApplicationRef));
    ApplicationRef_._tickScope = wtfCreateScope('ApplicationRef#tick()');
    ApplicationRef_.decorators = [{type: Injectable}];
    ApplicationRef_.ctorParameters = function() {
      return [{type: NgZone}, {type: Console}, {type: Injector}, {type: ErrorHandler}, {type: ComponentFactoryResolver}, {type: ApplicationInitStatus}];
    };
    function remove(list, el) {
      var index = list.indexOf(el);
      if (index > -1) {
        list.splice(index, 1);
      }
    }
    var RenderComponentType = (function() {
      function RenderComponentType(id, templateUrl, slotCount, encapsulation, styles, animations) {
        this.id = id;
        this.templateUrl = templateUrl;
        this.slotCount = slotCount;
        this.encapsulation = encapsulation;
        this.styles = styles;
        this.animations = animations;
      }
      return RenderComponentType;
    }());
    var RenderDebugInfo = (function() {
      function RenderDebugInfo() {}
      RenderDebugInfo.prototype.injector = function() {};
      RenderDebugInfo.prototype.component = function() {};
      RenderDebugInfo.prototype.providerTokens = function() {};
      RenderDebugInfo.prototype.references = function() {};
      RenderDebugInfo.prototype.context = function() {};
      RenderDebugInfo.prototype.source = function() {};
      return RenderDebugInfo;
    }());
    var Renderer = (function() {
      function Renderer() {}
      Renderer.prototype.selectRootElement = function(selectorOrNode, debugInfo) {};
      Renderer.prototype.createElement = function(parentElement, name, debugInfo) {};
      Renderer.prototype.createViewRoot = function(hostElement) {};
      Renderer.prototype.createTemplateAnchor = function(parentElement, debugInfo) {};
      Renderer.prototype.createText = function(parentElement, value, debugInfo) {};
      Renderer.prototype.projectNodes = function(parentElement, nodes) {};
      Renderer.prototype.attachViewAfter = function(node, viewRootNodes) {};
      Renderer.prototype.detachView = function(viewRootNodes) {};
      Renderer.prototype.destroyView = function(hostElement, viewAllNodes) {};
      Renderer.prototype.listen = function(renderElement, name, callback) {};
      Renderer.prototype.listenGlobal = function(target, name, callback) {};
      Renderer.prototype.setElementProperty = function(renderElement, propertyName, propertyValue) {};
      Renderer.prototype.setElementAttribute = function(renderElement, attributeName, attributeValue) {};
      Renderer.prototype.setBindingDebugInfo = function(renderElement, propertyName, propertyValue) {};
      Renderer.prototype.setElementClass = function(renderElement, className, isAdd) {};
      Renderer.prototype.setElementStyle = function(renderElement, styleName, styleValue) {};
      Renderer.prototype.invokeElementMethod = function(renderElement, methodName, args) {};
      Renderer.prototype.setText = function(renderNode, text) {};
      Renderer.prototype.animate = function(element, startingStyles, keyframes, duration, delay, easing, previousPlayers) {};
      return Renderer;
    }());
    var Renderer2Interceptor = new InjectionToken('Renderer2Interceptor');
    var RootRenderer = (function() {
      function RootRenderer() {}
      RootRenderer.prototype.renderComponent = function(componentType) {};
      return RootRenderer;
    }());
    var RendererFactory2 = (function() {
      function RendererFactory2() {}
      RendererFactory2.prototype.createRenderer = function(hostElement, type) {};
      RendererFactory2.prototype.begin = function() {};
      RendererFactory2.prototype.end = function() {};
      RendererFactory2.prototype.whenRenderingDone = function() {};
      return RendererFactory2;
    }());
    var RendererStyleFlags2 = {};
    RendererStyleFlags2.Important = 1;
    RendererStyleFlags2.DashCase = 2;
    RendererStyleFlags2[RendererStyleFlags2.Important] = "Important";
    RendererStyleFlags2[RendererStyleFlags2.DashCase] = "DashCase";
    var Renderer2 = (function() {
      function Renderer2() {}
      Renderer2.prototype.data = function() {};
      Renderer2.prototype.destroy = function() {};
      Renderer2.prototype.createElement = function(name, namespace) {};
      Renderer2.prototype.createComment = function(value) {};
      Renderer2.prototype.createText = function(value) {};
      Renderer2.prototype.appendChild = function(parent, newChild) {};
      Renderer2.prototype.insertBefore = function(parent, newChild, refChild) {};
      Renderer2.prototype.removeChild = function(parent, oldChild) {};
      Renderer2.prototype.selectRootElement = function(selectorOrNode) {};
      Renderer2.prototype.parentNode = function(node) {};
      Renderer2.prototype.nextSibling = function(node) {};
      Renderer2.prototype.setAttribute = function(el, name, value, namespace) {};
      Renderer2.prototype.removeAttribute = function(el, name, namespace) {};
      Renderer2.prototype.addClass = function(el, name) {};
      Renderer2.prototype.removeClass = function(el, name) {};
      Renderer2.prototype.setStyle = function(el, style, value, flags) {};
      Renderer2.prototype.removeStyle = function(el, style, flags) {};
      Renderer2.prototype.setProperty = function(el, name, value) {};
      Renderer2.prototype.setValue = function(node, value) {};
      Renderer2.prototype.listen = function(target, eventName, callback) {};
      return Renderer2;
    }());
    var ElementRef = (function() {
      function ElementRef(nativeElement) {
        this.nativeElement = nativeElement;
      }
      return ElementRef;
    }());
    var NgModuleFactoryLoader = (function() {
      function NgModuleFactoryLoader() {}
      NgModuleFactoryLoader.prototype.load = function(path) {};
      return NgModuleFactoryLoader;
    }());
    var moduleFactories = new Map();
    function registerModuleFactory(id, factory) {
      var existing = moduleFactories.get(id);
      if (existing) {
        throw new Error("Duplicate module registered for " + id + " - " + existing.moduleType.name + " vs " + factory.moduleType.name);
      }
      moduleFactories.set(id, factory);
    }
    function getModuleFactory(id) {
      var factory = moduleFactories.get(id);
      if (!factory)
        throw new Error("No module with ID " + id + " loaded");
      return factory;
    }
    var QueryList = (function() {
      function QueryList() {
        this._dirty = true;
        this._results = [];
        this._emitter = new EventEmitter();
      }
      Object.defineProperty(QueryList.prototype, "changes", {
        get: function() {
          return this._emitter;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(QueryList.prototype, "length", {
        get: function() {
          return this._results.length;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(QueryList.prototype, "first", {
        get: function() {
          return this._results[0];
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(QueryList.prototype, "last", {
        get: function() {
          return this._results[this.length - 1];
        },
        enumerable: true,
        configurable: true
      });
      QueryList.prototype.map = function(fn) {
        return this._results.map(fn);
      };
      QueryList.prototype.filter = function(fn) {
        return this._results.filter(fn);
      };
      QueryList.prototype.find = function(fn) {
        return this._results.find(fn);
      };
      QueryList.prototype.reduce = function(fn, init) {
        return this._results.reduce(fn, init);
      };
      QueryList.prototype.forEach = function(fn) {
        this._results.forEach(fn);
      };
      QueryList.prototype.some = function(fn) {
        return this._results.some(fn);
      };
      QueryList.prototype.toArray = function() {
        return this._results.slice();
      };
      QueryList.prototype[getSymbolIterator()] = function() {
        return ((this._results))[getSymbolIterator()]();
      };
      QueryList.prototype.toString = function() {
        return this._results.toString();
      };
      QueryList.prototype.reset = function(res) {
        this._results = flatten(res);
        this._dirty = false;
      };
      QueryList.prototype.notifyOnChanges = function() {
        this._emitter.emit(this);
      };
      QueryList.prototype.setDirty = function() {
        this._dirty = true;
      };
      Object.defineProperty(QueryList.prototype, "dirty", {
        get: function() {
          return this._dirty;
        },
        enumerable: true,
        configurable: true
      });
      return QueryList;
    }());
    function flatten(list) {
      return list.reduce(function(flat, item) {
        var flatItem = Array.isArray(item) ? flatten(item) : item;
        return ((flat)).concat(flatItem);
      }, []);
    }
    var _SEPARATOR = '#';
    var FACTORY_CLASS_SUFFIX = 'NgFactory';
    var SystemJsNgModuleLoaderConfig = (function() {
      function SystemJsNgModuleLoaderConfig() {}
      return SystemJsNgModuleLoaderConfig;
    }());
    var DEFAULT_CONFIG = {
      factoryPathPrefix: '',
      factoryPathSuffix: '.ngfactory'
    };
    var SystemJsNgModuleLoader = (function() {
      function SystemJsNgModuleLoader(_compiler, config) {
        this._compiler = _compiler;
        this._config = config || DEFAULT_CONFIG;
      }
      SystemJsNgModuleLoader.prototype.load = function(path) {
        var offlineMode = this._compiler instanceof Compiler;
        return offlineMode ? this.loadFactory(path) : this.loadAndCompile(path);
      };
      SystemJsNgModuleLoader.prototype.loadAndCompile = function(path) {
        var _this = this;
        var _a = path.split(_SEPARATOR),
            module = _a[0],
            exportName = _a[1];
        if (exportName === undefined) {
          exportName = 'default';
        }
        return System.import(module).then(function(module) {
          return module[exportName];
        }).then(function(type) {
          return checkNotEmpty(type, module, exportName);
        }).then(function(type) {
          return _this._compiler.compileModuleAsync(type);
        });
      };
      SystemJsNgModuleLoader.prototype.loadFactory = function(path) {
        var _a = path.split(_SEPARATOR),
            module = _a[0],
            exportName = _a[1];
        var factoryClassSuffix = FACTORY_CLASS_SUFFIX;
        if (exportName === undefined) {
          exportName = 'default';
          factoryClassSuffix = '';
        }
        return System.import(this._config.factoryPathPrefix + module + this._config.factoryPathSuffix).then(function(module) {
          return module[exportName + factoryClassSuffix];
        }).then(function(factory) {
          return checkNotEmpty(factory, module, exportName);
        });
      };
      return SystemJsNgModuleLoader;
    }());
    SystemJsNgModuleLoader.decorators = [{type: Injectable}];
    SystemJsNgModuleLoader.ctorParameters = function() {
      return [{type: Compiler}, {
        type: SystemJsNgModuleLoaderConfig,
        decorators: [{type: Optional}]
      }];
    };
    function checkNotEmpty(value, modulePath, exportName) {
      if (!value) {
        throw new Error("Cannot find '" + exportName + "' in '" + modulePath + "'");
      }
      return value;
    }
    var TemplateRef = (function() {
      function TemplateRef() {}
      TemplateRef.prototype.elementRef = function() {};
      TemplateRef.prototype.createEmbeddedView = function(context) {};
      return TemplateRef;
    }());
    var ViewContainerRef = (function() {
      function ViewContainerRef() {}
      ViewContainerRef.prototype.element = function() {};
      ViewContainerRef.prototype.injector = function() {};
      ViewContainerRef.prototype.parentInjector = function() {};
      ViewContainerRef.prototype.clear = function() {};
      ViewContainerRef.prototype.get = function(index) {};
      ViewContainerRef.prototype.length = function() {};
      ViewContainerRef.prototype.createEmbeddedView = function(templateRef, context, index) {};
      ViewContainerRef.prototype.createComponent = function(componentFactory, index, injector, projectableNodes, ngModule) {};
      ViewContainerRef.prototype.insert = function(viewRef, index) {};
      ViewContainerRef.prototype.move = function(viewRef, currentIndex) {};
      ViewContainerRef.prototype.indexOf = function(viewRef) {};
      ViewContainerRef.prototype.remove = function(index) {};
      ViewContainerRef.prototype.detach = function(index) {};
      return ViewContainerRef;
    }());
    var ChangeDetectorRef = (function() {
      function ChangeDetectorRef() {}
      ChangeDetectorRef.prototype.markForCheck = function() {};
      ChangeDetectorRef.prototype.detach = function() {};
      ChangeDetectorRef.prototype.detectChanges = function() {};
      ChangeDetectorRef.prototype.checkNoChanges = function() {};
      ChangeDetectorRef.prototype.reattach = function() {};
      return ChangeDetectorRef;
    }());
    var ViewRef = (function(_super) {
      __extends(ViewRef, _super);
      function ViewRef() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      ViewRef.prototype.destroy = function() {};
      ViewRef.prototype.destroyed = function() {};
      ViewRef.prototype.onDestroy = function(callback) {};
      return ViewRef;
    }(ChangeDetectorRef));
    var EmbeddedViewRef = (function(_super) {
      __extends(EmbeddedViewRef, _super);
      function EmbeddedViewRef() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      EmbeddedViewRef.prototype.context = function() {};
      EmbeddedViewRef.prototype.rootNodes = function() {};
      return EmbeddedViewRef;
    }(ViewRef));
    var EventListener = (function() {
      function EventListener(name, callback) {
        this.name = name;
        this.callback = callback;
      }
      return EventListener;
    }());
    var DebugNode = (function() {
      function DebugNode(nativeNode, parent, _debugContext) {
        this._debugContext = _debugContext;
        this.nativeNode = nativeNode;
        if (parent && parent instanceof DebugElement) {
          parent.addChild(this);
        } else {
          this.parent = null;
        }
        this.listeners = [];
      }
      Object.defineProperty(DebugNode.prototype, "injector", {
        get: function() {
          return this._debugContext.injector;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(DebugNode.prototype, "componentInstance", {
        get: function() {
          return this._debugContext.component;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(DebugNode.prototype, "context", {
        get: function() {
          return this._debugContext.context;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(DebugNode.prototype, "references", {
        get: function() {
          return this._debugContext.references;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(DebugNode.prototype, "providerTokens", {
        get: function() {
          return this._debugContext.providerTokens;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(DebugNode.prototype, "source", {
        get: function() {
          return 'Deprecated since v4';
        },
        enumerable: true,
        configurable: true
      });
      return DebugNode;
    }());
    var DebugElement = (function(_super) {
      __extends(DebugElement, _super);
      function DebugElement(nativeNode, parent, _debugContext) {
        var _this = _super.call(this, nativeNode, parent, _debugContext) || this;
        _this.properties = {};
        _this.attributes = {};
        _this.classes = {};
        _this.styles = {};
        _this.childNodes = [];
        _this.nativeElement = nativeNode;
        return _this;
      }
      DebugElement.prototype.addChild = function(child) {
        if (child) {
          this.childNodes.push(child);
          child.parent = this;
        }
      };
      DebugElement.prototype.removeChild = function(child) {
        var childIndex = this.childNodes.indexOf(child);
        if (childIndex !== -1) {
          child.parent = null;
          this.childNodes.splice(childIndex, 1);
        }
      };
      DebugElement.prototype.insertChildrenAfter = function(child, newChildren) {
        var _this = this;
        var siblingIndex = this.childNodes.indexOf(child);
        if (siblingIndex !== -1) {
          (_a = this.childNodes).splice.apply(_a, [siblingIndex + 1, 0].concat(newChildren));
          newChildren.forEach(function(c) {
            if (c.parent) {
              c.parent.removeChild(c);
            }
            c.parent = _this;
          });
        }
        var _a;
      };
      DebugElement.prototype.insertBefore = function(refChild, newChild) {
        var refIndex = this.childNodes.indexOf(refChild);
        if (refIndex === -1) {
          this.addChild(newChild);
        } else {
          if (newChild.parent) {
            newChild.parent.removeChild(newChild);
          }
          newChild.parent = this;
          this.childNodes.splice(refIndex, 0, newChild);
        }
      };
      DebugElement.prototype.query = function(predicate) {
        var results = this.queryAll(predicate);
        return results[0] || null;
      };
      DebugElement.prototype.queryAll = function(predicate) {
        var matches = [];
        _queryElementChildren(this, predicate, matches);
        return matches;
      };
      DebugElement.prototype.queryAllNodes = function(predicate) {
        var matches = [];
        _queryNodeChildren(this, predicate, matches);
        return matches;
      };
      Object.defineProperty(DebugElement.prototype, "children", {
        get: function() {
          return (this.childNodes.filter(function(node) {
            return node instanceof DebugElement;
          }));
        },
        enumerable: true,
        configurable: true
      });
      DebugElement.prototype.triggerEventHandler = function(eventName, eventObj) {
        this.listeners.forEach(function(listener) {
          if (listener.name == eventName) {
            listener.callback(eventObj);
          }
        });
      };
      return DebugElement;
    }(DebugNode));
    function asNativeElements(debugEls) {
      return debugEls.map(function(el) {
        return el.nativeElement;
      });
    }
    function _queryElementChildren(element, predicate, matches) {
      element.childNodes.forEach(function(node) {
        if (node instanceof DebugElement) {
          if (predicate(node)) {
            matches.push(node);
          }
          _queryElementChildren(node, predicate, matches);
        }
      });
    }
    function _queryNodeChildren(parentNode, predicate, matches) {
      if (parentNode instanceof DebugElement) {
        parentNode.childNodes.forEach(function(node) {
          if (predicate(node)) {
            matches.push(node);
          }
          if (node instanceof DebugElement) {
            _queryNodeChildren(node, predicate, matches);
          }
        });
      }
    }
    var _nativeNodeToDebugNode = new Map();
    function getDebugNode(nativeNode) {
      return _nativeNodeToDebugNode.get(nativeNode) || null;
    }
    function indexDebugNode(node) {
      _nativeNodeToDebugNode.set(node.nativeNode, node);
    }
    function removeDebugNodeFromIndex(node) {
      _nativeNodeToDebugNode.delete(node.nativeNode);
    }
    function devModeEqual(a, b) {
      var isListLikeIterableA = isListLikeIterable(a);
      var isListLikeIterableB = isListLikeIterable(b);
      if (isListLikeIterableA && isListLikeIterableB) {
        return areIterablesEqual(a, b, devModeEqual);
      } else {
        var isAObject = a && (typeof a === 'object' || typeof a === 'function');
        var isBObject = b && (typeof b === 'object' || typeof b === 'function');
        if (!isListLikeIterableA && isAObject && !isListLikeIterableB && isBObject) {
          return true;
        } else {
          return looseIdentical(a, b);
        }
      }
    }
    var WrappedValue = (function() {
      function WrappedValue(wrapped) {
        this.wrapped = wrapped;
      }
      WrappedValue.wrap = function(value) {
        return new WrappedValue(value);
      };
      return WrappedValue;
    }());
    var ValueUnwrapper = (function() {
      function ValueUnwrapper() {
        this.hasWrappedValue = false;
      }
      ValueUnwrapper.prototype.unwrap = function(value) {
        if (value instanceof WrappedValue) {
          this.hasWrappedValue = true;
          return value.wrapped;
        }
        return value;
      };
      ValueUnwrapper.prototype.reset = function() {
        this.hasWrappedValue = false;
      };
      return ValueUnwrapper;
    }());
    var SimpleChange = (function() {
      function SimpleChange(previousValue, currentValue, firstChange) {
        this.previousValue = previousValue;
        this.currentValue = currentValue;
        this.firstChange = firstChange;
      }
      SimpleChange.prototype.isFirstChange = function() {
        return this.firstChange;
      };
      return SimpleChange;
    }());
    function isListLikeIterable(obj) {
      if (!isJsObject(obj))
        return false;
      return Array.isArray(obj) || (!(obj instanceof Map) && getSymbolIterator() in obj);
    }
    function areIterablesEqual(a, b, comparator) {
      var iterator1 = a[getSymbolIterator()]();
      var iterator2 = b[getSymbolIterator()]();
      while (true) {
        var item1 = iterator1.next();
        var item2 = iterator2.next();
        if (item1.done && item2.done)
          return true;
        if (item1.done || item2.done)
          return false;
        if (!comparator(item1.value, item2.value))
          return false;
      }
    }
    function iterateListLike(obj, fn) {
      if (Array.isArray(obj)) {
        for (var i = 0; i < obj.length; i++) {
          fn(obj[i]);
        }
      } else {
        var iterator = obj[getSymbolIterator()]();
        var item = void 0;
        while (!((item = iterator.next()).done)) {
          fn(item.value);
        }
      }
    }
    function isJsObject(o) {
      return o !== null && (typeof o === 'function' || typeof o === 'object');
    }
    var DefaultIterableDifferFactory = (function() {
      function DefaultIterableDifferFactory() {}
      DefaultIterableDifferFactory.prototype.supports = function(obj) {
        return isListLikeIterable(obj);
      };
      DefaultIterableDifferFactory.prototype.create = function(cdRefOrTrackBy, trackByFn) {
        return new DefaultIterableDiffer(trackByFn || (cdRefOrTrackBy));
      };
      return DefaultIterableDifferFactory;
    }());
    var trackByIdentity = function(index, item) {
      return item;
    };
    var DefaultIterableDiffer = (function() {
      function DefaultIterableDiffer(trackByFn) {
        this._length = 0;
        this._collection = null;
        this._linkedRecords = null;
        this._unlinkedRecords = null;
        this._previousItHead = null;
        this._itHead = null;
        this._itTail = null;
        this._additionsHead = null;
        this._additionsTail = null;
        this._movesHead = null;
        this._movesTail = null;
        this._removalsHead = null;
        this._removalsTail = null;
        this._identityChangesHead = null;
        this._identityChangesTail = null;
        this._trackByFn = trackByFn || trackByIdentity;
      }
      Object.defineProperty(DefaultIterableDiffer.prototype, "collection", {
        get: function() {
          return this._collection;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(DefaultIterableDiffer.prototype, "length", {
        get: function() {
          return this._length;
        },
        enumerable: true,
        configurable: true
      });
      DefaultIterableDiffer.prototype.forEachItem = function(fn) {
        var record;
        for (record = this._itHead; record !== null; record = record._next) {
          fn(record);
        }
      };
      DefaultIterableDiffer.prototype.forEachOperation = function(fn) {
        var nextIt = this._itHead;
        var nextRemove = this._removalsHead;
        var addRemoveOffset = 0;
        var moveOffsets = null;
        while (nextIt || nextRemove) {
          var record = !nextRemove || nextIt && ((nextIt.currentIndex)) < getPreviousIndex(nextRemove, addRemoveOffset, moveOffsets) ? ((nextIt)) : nextRemove;
          var adjPreviousIndex = getPreviousIndex(record, addRemoveOffset, moveOffsets);
          var currentIndex = record.currentIndex;
          if (record === nextRemove) {
            addRemoveOffset--;
            nextRemove = nextRemove._nextRemoved;
          } else {
            nextIt = ((nextIt))._next;
            if (record.previousIndex == null) {
              addRemoveOffset++;
            } else {
              if (!moveOffsets)
                moveOffsets = [];
              var localMovePreviousIndex = adjPreviousIndex - addRemoveOffset;
              var localCurrentIndex = ((currentIndex)) - addRemoveOffset;
              if (localMovePreviousIndex != localCurrentIndex) {
                for (var i = 0; i < localMovePreviousIndex; i++) {
                  var offset = i < moveOffsets.length ? moveOffsets[i] : (moveOffsets[i] = 0);
                  var index = offset + i;
                  if (localCurrentIndex <= index && index < localMovePreviousIndex) {
                    moveOffsets[i] = offset + 1;
                  }
                }
                var previousIndex = record.previousIndex;
                moveOffsets[previousIndex] = localCurrentIndex - localMovePreviousIndex;
              }
            }
          }
          if (adjPreviousIndex !== currentIndex) {
            fn(record, adjPreviousIndex, currentIndex);
          }
        }
      };
      DefaultIterableDiffer.prototype.forEachPreviousItem = function(fn) {
        var record;
        for (record = this._previousItHead; record !== null; record = record._nextPrevious) {
          fn(record);
        }
      };
      DefaultIterableDiffer.prototype.forEachAddedItem = function(fn) {
        var record;
        for (record = this._additionsHead; record !== null; record = record._nextAdded) {
          fn(record);
        }
      };
      DefaultIterableDiffer.prototype.forEachMovedItem = function(fn) {
        var record;
        for (record = this._movesHead; record !== null; record = record._nextMoved) {
          fn(record);
        }
      };
      DefaultIterableDiffer.prototype.forEachRemovedItem = function(fn) {
        var record;
        for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
          fn(record);
        }
      };
      DefaultIterableDiffer.prototype.forEachIdentityChange = function(fn) {
        var record;
        for (record = this._identityChangesHead; record !== null; record = record._nextIdentityChange) {
          fn(record);
        }
      };
      DefaultIterableDiffer.prototype.diff = function(collection) {
        if (collection == null)
          collection = [];
        if (!isListLikeIterable(collection)) {
          throw new Error("Error trying to diff '" + stringify(collection) + "'. Only arrays and iterables are allowed");
        }
        if (this.check(collection)) {
          return this;
        } else {
          return null;
        }
      };
      DefaultIterableDiffer.prototype.onDestroy = function() {};
      DefaultIterableDiffer.prototype.check = function(collection) {
        var _this = this;
        this._reset();
        var record = this._itHead;
        var mayBeDirty = false;
        var index;
        var item;
        var itemTrackBy;
        if (Array.isArray(collection)) {
          this._length = collection.length;
          for (var index_1 = 0; index_1 < this._length; index_1++) {
            item = collection[index_1];
            itemTrackBy = this._trackByFn(index_1, item);
            if (record === null || !looseIdentical(record.trackById, itemTrackBy)) {
              record = this._mismatch(record, item, itemTrackBy, index_1);
              mayBeDirty = true;
            } else {
              if (mayBeDirty) {
                record = this._verifyReinsertion(record, item, itemTrackBy, index_1);
              }
              if (!looseIdentical(record.item, item))
                this._addIdentityChange(record, item);
            }
            record = record._next;
          }
        } else {
          index = 0;
          iterateListLike(collection, function(item) {
            itemTrackBy = _this._trackByFn(index, item);
            if (record === null || !looseIdentical(record.trackById, itemTrackBy)) {
              record = _this._mismatch(record, item, itemTrackBy, index);
              mayBeDirty = true;
            } else {
              if (mayBeDirty) {
                record = _this._verifyReinsertion(record, item, itemTrackBy, index);
              }
              if (!looseIdentical(record.item, item))
                _this._addIdentityChange(record, item);
            }
            record = record._next;
            index++;
          });
          this._length = index;
        }
        this._truncate(record);
        this._collection = collection;
        return this.isDirty;
      };
      Object.defineProperty(DefaultIterableDiffer.prototype, "isDirty", {
        get: function() {
          return this._additionsHead !== null || this._movesHead !== null || this._removalsHead !== null || this._identityChangesHead !== null;
        },
        enumerable: true,
        configurable: true
      });
      DefaultIterableDiffer.prototype._reset = function() {
        if (this.isDirty) {
          var record = void 0;
          var nextRecord = void 0;
          for (record = this._previousItHead = this._itHead; record !== null; record = record._next) {
            record._nextPrevious = record._next;
          }
          for (record = this._additionsHead; record !== null; record = record._nextAdded) {
            record.previousIndex = record.currentIndex;
          }
          this._additionsHead = this._additionsTail = null;
          for (record = this._movesHead; record !== null; record = nextRecord) {
            record.previousIndex = record.currentIndex;
            nextRecord = record._nextMoved;
          }
          this._movesHead = this._movesTail = null;
          this._removalsHead = this._removalsTail = null;
          this._identityChangesHead = this._identityChangesTail = null;
        }
      };
      DefaultIterableDiffer.prototype._mismatch = function(record, item, itemTrackBy, index) {
        var previousRecord;
        if (record === null) {
          previousRecord = ((this._itTail));
        } else {
          previousRecord = ((record._prev));
          this._remove(record);
        }
        record = this._linkedRecords === null ? null : this._linkedRecords.get(itemTrackBy, index);
        if (record !== null) {
          if (!looseIdentical(record.item, item))
            this._addIdentityChange(record, item);
          this._moveAfter(record, previousRecord, index);
        } else {
          record = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(itemTrackBy, null);
          if (record !== null) {
            if (!looseIdentical(record.item, item))
              this._addIdentityChange(record, item);
            this._reinsertAfter(record, previousRecord, index);
          } else {
            record = this._addAfter(new IterableChangeRecord_(item, itemTrackBy), previousRecord, index);
          }
        }
        return record;
      };
      DefaultIterableDiffer.prototype._verifyReinsertion = function(record, item, itemTrackBy, index) {
        var reinsertRecord = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(itemTrackBy, null);
        if (reinsertRecord !== null) {
          record = this._reinsertAfter(reinsertRecord, ((record._prev)), index);
        } else if (record.currentIndex != index) {
          record.currentIndex = index;
          this._addToMoves(record, index);
        }
        return record;
      };
      DefaultIterableDiffer.prototype._truncate = function(record) {
        while (record !== null) {
          var nextRecord = record._next;
          this._addToRemovals(this._unlink(record));
          record = nextRecord;
        }
        if (this._unlinkedRecords !== null) {
          this._unlinkedRecords.clear();
        }
        if (this._additionsTail !== null) {
          this._additionsTail._nextAdded = null;
        }
        if (this._movesTail !== null) {
          this._movesTail._nextMoved = null;
        }
        if (this._itTail !== null) {
          this._itTail._next = null;
        }
        if (this._removalsTail !== null) {
          this._removalsTail._nextRemoved = null;
        }
        if (this._identityChangesTail !== null) {
          this._identityChangesTail._nextIdentityChange = null;
        }
      };
      DefaultIterableDiffer.prototype._reinsertAfter = function(record, prevRecord, index) {
        if (this._unlinkedRecords !== null) {
          this._unlinkedRecords.remove(record);
        }
        var prev = record._prevRemoved;
        var next = record._nextRemoved;
        if (prev === null) {
          this._removalsHead = next;
        } else {
          prev._nextRemoved = next;
        }
        if (next === null) {
          this._removalsTail = prev;
        } else {
          next._prevRemoved = prev;
        }
        this._insertAfter(record, prevRecord, index);
        this._addToMoves(record, index);
        return record;
      };
      DefaultIterableDiffer.prototype._moveAfter = function(record, prevRecord, index) {
        this._unlink(record);
        this._insertAfter(record, prevRecord, index);
        this._addToMoves(record, index);
        return record;
      };
      DefaultIterableDiffer.prototype._addAfter = function(record, prevRecord, index) {
        this._insertAfter(record, prevRecord, index);
        if (this._additionsTail === null) {
          this._additionsTail = this._additionsHead = record;
        } else {
          this._additionsTail = this._additionsTail._nextAdded = record;
        }
        return record;
      };
      DefaultIterableDiffer.prototype._insertAfter = function(record, prevRecord, index) {
        var next = prevRecord === null ? this._itHead : prevRecord._next;
        record._next = next;
        record._prev = prevRecord;
        if (next === null) {
          this._itTail = record;
        } else {
          next._prev = record;
        }
        if (prevRecord === null) {
          this._itHead = record;
        } else {
          prevRecord._next = record;
        }
        if (this._linkedRecords === null) {
          this._linkedRecords = new _DuplicateMap();
        }
        this._linkedRecords.put(record);
        record.currentIndex = index;
        return record;
      };
      DefaultIterableDiffer.prototype._remove = function(record) {
        return this._addToRemovals(this._unlink(record));
      };
      DefaultIterableDiffer.prototype._unlink = function(record) {
        if (this._linkedRecords !== null) {
          this._linkedRecords.remove(record);
        }
        var prev = record._prev;
        var next = record._next;
        if (prev === null) {
          this._itHead = next;
        } else {
          prev._next = next;
        }
        if (next === null) {
          this._itTail = prev;
        } else {
          next._prev = prev;
        }
        return record;
      };
      DefaultIterableDiffer.prototype._addToMoves = function(record, toIndex) {
        if (record.previousIndex === toIndex) {
          return record;
        }
        if (this._movesTail === null) {
          this._movesTail = this._movesHead = record;
        } else {
          this._movesTail = this._movesTail._nextMoved = record;
        }
        return record;
      };
      DefaultIterableDiffer.prototype._addToRemovals = function(record) {
        if (this._unlinkedRecords === null) {
          this._unlinkedRecords = new _DuplicateMap();
        }
        this._unlinkedRecords.put(record);
        record.currentIndex = null;
        record._nextRemoved = null;
        if (this._removalsTail === null) {
          this._removalsTail = this._removalsHead = record;
          record._prevRemoved = null;
        } else {
          record._prevRemoved = this._removalsTail;
          this._removalsTail = this._removalsTail._nextRemoved = record;
        }
        return record;
      };
      DefaultIterableDiffer.prototype._addIdentityChange = function(record, item) {
        record.item = item;
        if (this._identityChangesTail === null) {
          this._identityChangesTail = this._identityChangesHead = record;
        } else {
          this._identityChangesTail = this._identityChangesTail._nextIdentityChange = record;
        }
        return record;
      };
      DefaultIterableDiffer.prototype.toString = function() {
        var list = [];
        this.forEachItem(function(record) {
          return list.push(record);
        });
        var previous = [];
        this.forEachPreviousItem(function(record) {
          return previous.push(record);
        });
        var additions = [];
        this.forEachAddedItem(function(record) {
          return additions.push(record);
        });
        var moves = [];
        this.forEachMovedItem(function(record) {
          return moves.push(record);
        });
        var removals = [];
        this.forEachRemovedItem(function(record) {
          return removals.push(record);
        });
        var identityChanges = [];
        this.forEachIdentityChange(function(record) {
          return identityChanges.push(record);
        });
        return 'collection: ' + list.join(', ') + '\n' + 'previous: ' + previous.join(', ') + '\n' + 'additions: ' + additions.join(', ') + '\n' + 'moves: ' + moves.join(', ') + '\n' + 'removals: ' + removals.join(', ') + '\n' + 'identityChanges: ' + identityChanges.join(', ') + '\n';
      };
      return DefaultIterableDiffer;
    }());
    var IterableChangeRecord_ = (function() {
      function IterableChangeRecord_(item, trackById) {
        this.item = item;
        this.trackById = trackById;
        this.currentIndex = null;
        this.previousIndex = null;
        this._nextPrevious = null;
        this._prev = null;
        this._next = null;
        this._prevDup = null;
        this._nextDup = null;
        this._prevRemoved = null;
        this._nextRemoved = null;
        this._nextAdded = null;
        this._nextMoved = null;
        this._nextIdentityChange = null;
      }
      IterableChangeRecord_.prototype.toString = function() {
        return this.previousIndex === this.currentIndex ? stringify(this.item) : stringify(this.item) + '[' + stringify(this.previousIndex) + '->' + stringify(this.currentIndex) + ']';
      };
      return IterableChangeRecord_;
    }());
    var _DuplicateItemRecordList = (function() {
      function _DuplicateItemRecordList() {
        this._head = null;
        this._tail = null;
      }
      _DuplicateItemRecordList.prototype.add = function(record) {
        if (this._head === null) {
          this._head = this._tail = record;
          record._nextDup = null;
          record._prevDup = null;
        } else {
          ((this._tail))._nextDup = record;
          record._prevDup = this._tail;
          record._nextDup = null;
          this._tail = record;
        }
      };
      _DuplicateItemRecordList.prototype.get = function(trackById, afterIndex) {
        var record;
        for (record = this._head; record !== null; record = record._nextDup) {
          if ((afterIndex === null || afterIndex < ((record.currentIndex))) && looseIdentical(record.trackById, trackById)) {
            return record;
          }
        }
        return null;
      };
      _DuplicateItemRecordList.prototype.remove = function(record) {
        var prev = record._prevDup;
        var next = record._nextDup;
        if (prev === null) {
          this._head = next;
        } else {
          prev._nextDup = next;
        }
        if (next === null) {
          this._tail = prev;
        } else {
          next._prevDup = prev;
        }
        return this._head === null;
      };
      return _DuplicateItemRecordList;
    }());
    var _DuplicateMap = (function() {
      function _DuplicateMap() {
        this.map = new Map();
      }
      _DuplicateMap.prototype.put = function(record) {
        var key = record.trackById;
        var duplicates = this.map.get(key);
        if (!duplicates) {
          duplicates = new _DuplicateItemRecordList();
          this.map.set(key, duplicates);
        }
        duplicates.add(record);
      };
      _DuplicateMap.prototype.get = function(trackById, afterIndex) {
        var key = trackById;
        var recordList = this.map.get(key);
        return recordList ? recordList.get(trackById, afterIndex) : null;
      };
      _DuplicateMap.prototype.remove = function(record) {
        var key = record.trackById;
        var recordList = ((this.map.get(key)));
        if (recordList.remove(record)) {
          this.map.delete(key);
        }
        return record;
      };
      Object.defineProperty(_DuplicateMap.prototype, "isEmpty", {
        get: function() {
          return this.map.size === 0;
        },
        enumerable: true,
        configurable: true
      });
      _DuplicateMap.prototype.clear = function() {
        this.map.clear();
      };
      _DuplicateMap.prototype.toString = function() {
        return '_DuplicateMap(' + stringify(this.map) + ')';
      };
      return _DuplicateMap;
    }());
    function getPreviousIndex(item, addRemoveOffset, moveOffsets) {
      var previousIndex = item.previousIndex;
      if (previousIndex === null)
        return previousIndex;
      var moveOffset = 0;
      if (moveOffsets && previousIndex < moveOffsets.length) {
        moveOffset = moveOffsets[previousIndex];
      }
      return previousIndex + addRemoveOffset + moveOffset;
    }
    var DefaultKeyValueDifferFactory = (function() {
      function DefaultKeyValueDifferFactory() {}
      DefaultKeyValueDifferFactory.prototype.supports = function(obj) {
        return obj instanceof Map || isJsObject(obj);
      };
      DefaultKeyValueDifferFactory.prototype.create = function(cd) {
        return new DefaultKeyValueDiffer();
      };
      return DefaultKeyValueDifferFactory;
    }());
    var DefaultKeyValueDiffer = (function() {
      function DefaultKeyValueDiffer() {
        this._records = new Map();
        this._mapHead = null;
        this._appendAfter = null;
        this._previousMapHead = null;
        this._changesHead = null;
        this._changesTail = null;
        this._additionsHead = null;
        this._additionsTail = null;
        this._removalsHead = null;
        this._removalsTail = null;
      }
      Object.defineProperty(DefaultKeyValueDiffer.prototype, "isDirty", {
        get: function() {
          return this._additionsHead !== null || this._changesHead !== null || this._removalsHead !== null;
        },
        enumerable: true,
        configurable: true
      });
      DefaultKeyValueDiffer.prototype.forEachItem = function(fn) {
        var record;
        for (record = this._mapHead; record !== null; record = record._next) {
          fn(record);
        }
      };
      DefaultKeyValueDiffer.prototype.forEachPreviousItem = function(fn) {
        var record;
        for (record = this._previousMapHead; record !== null; record = record._nextPrevious) {
          fn(record);
        }
      };
      DefaultKeyValueDiffer.prototype.forEachChangedItem = function(fn) {
        var record;
        for (record = this._changesHead; record !== null; record = record._nextChanged) {
          fn(record);
        }
      };
      DefaultKeyValueDiffer.prototype.forEachAddedItem = function(fn) {
        var record;
        for (record = this._additionsHead; record !== null; record = record._nextAdded) {
          fn(record);
        }
      };
      DefaultKeyValueDiffer.prototype.forEachRemovedItem = function(fn) {
        var record;
        for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
          fn(record);
        }
      };
      DefaultKeyValueDiffer.prototype.diff = function(map) {
        if (!map) {
          map = new Map();
        } else if (!(map instanceof Map || isJsObject(map))) {
          throw new Error("Error trying to diff '" + stringify(map) + "'. Only maps and objects are allowed");
        }
        return this.check(map) ? this : null;
      };
      DefaultKeyValueDiffer.prototype.onDestroy = function() {};
      DefaultKeyValueDiffer.prototype.check = function(map) {
        var _this = this;
        this._reset();
        var insertBefore = this._mapHead;
        this._appendAfter = null;
        this._forEach(map, function(value, key) {
          if (insertBefore && insertBefore.key === key) {
            _this._maybeAddToChanges(insertBefore, value);
            _this._appendAfter = insertBefore;
            insertBefore = insertBefore._next;
          } else {
            var record = _this._getOrCreateRecordForKey(key, value);
            insertBefore = _this._insertBeforeOrAppend(insertBefore, record);
          }
        });
        if (insertBefore) {
          if (insertBefore._prev) {
            insertBefore._prev._next = null;
          }
          this._removalsHead = insertBefore;
          for (var record = insertBefore; record !== null; record = record._nextRemoved) {
            if (record === this._mapHead) {
              this._mapHead = null;
            }
            this._records.delete(record.key);
            record._nextRemoved = record._next;
            record.previousValue = record.currentValue;
            record.currentValue = null;
            record._prev = null;
            record._next = null;
          }
        }
        if (this._changesTail)
          this._changesTail._nextChanged = null;
        if (this._additionsTail)
          this._additionsTail._nextAdded = null;
        return this.isDirty;
      };
      DefaultKeyValueDiffer.prototype._insertBeforeOrAppend = function(before, record) {
        if (before) {
          var prev = before._prev;
          record._next = before;
          record._prev = prev;
          before._prev = record;
          if (prev) {
            prev._next = record;
          }
          if (before === this._mapHead) {
            this._mapHead = record;
          }
          this._appendAfter = before;
          return before;
        }
        if (this._appendAfter) {
          this._appendAfter._next = record;
          record._prev = this._appendAfter;
        } else {
          this._mapHead = record;
        }
        this._appendAfter = record;
        return null;
      };
      DefaultKeyValueDiffer.prototype._getOrCreateRecordForKey = function(key, value) {
        if (this._records.has(key)) {
          var record_1 = ((this._records.get(key)));
          this._maybeAddToChanges(record_1, value);
          var prev = record_1._prev;
          var next = record_1._next;
          if (prev) {
            prev._next = next;
          }
          if (next) {
            next._prev = prev;
          }
          record_1._next = null;
          record_1._prev = null;
          return record_1;
        }
        var record = new KeyValueChangeRecord_(key);
        this._records.set(key, record);
        record.currentValue = value;
        this._addToAdditions(record);
        return record;
      };
      DefaultKeyValueDiffer.prototype._reset = function() {
        if (this.isDirty) {
          var record = void 0;
          this._previousMapHead = this._mapHead;
          for (record = this._previousMapHead; record !== null; record = record._next) {
            record._nextPrevious = record._next;
          }
          for (record = this._changesHead; record !== null; record = record._nextChanged) {
            record.previousValue = record.currentValue;
          }
          for (record = this._additionsHead; record != null; record = record._nextAdded) {
            record.previousValue = record.currentValue;
          }
          this._changesHead = this._changesTail = null;
          this._additionsHead = this._additionsTail = null;
          this._removalsHead = null;
        }
      };
      DefaultKeyValueDiffer.prototype._maybeAddToChanges = function(record, newValue) {
        if (!looseIdentical(newValue, record.currentValue)) {
          record.previousValue = record.currentValue;
          record.currentValue = newValue;
          this._addToChanges(record);
        }
      };
      DefaultKeyValueDiffer.prototype._addToAdditions = function(record) {
        if (this._additionsHead === null) {
          this._additionsHead = this._additionsTail = record;
        } else {
          ((this._additionsTail))._nextAdded = record;
          this._additionsTail = record;
        }
      };
      DefaultKeyValueDiffer.prototype._addToChanges = function(record) {
        if (this._changesHead === null) {
          this._changesHead = this._changesTail = record;
        } else {
          ((this._changesTail))._nextChanged = record;
          this._changesTail = record;
        }
      };
      DefaultKeyValueDiffer.prototype._forEach = function(obj, fn) {
        if (obj instanceof Map) {
          obj.forEach(fn);
        } else {
          Object.keys(obj).forEach(function(k) {
            return fn(obj[k], k);
          });
        }
      };
      return DefaultKeyValueDiffer;
    }());
    var KeyValueChangeRecord_ = (function() {
      function KeyValueChangeRecord_(key) {
        this.key = key;
        this.previousValue = null;
        this.currentValue = null;
        this._nextPrevious = null;
        this._next = null;
        this._prev = null;
        this._nextAdded = null;
        this._nextRemoved = null;
        this._nextChanged = null;
      }
      return KeyValueChangeRecord_;
    }());
    var IterableDiffers = (function() {
      function IterableDiffers(factories) {
        this.factories = factories;
      }
      IterableDiffers.create = function(factories, parent) {
        if (parent != null) {
          var copied = parent.factories.slice();
          factories = factories.concat(copied);
          return new IterableDiffers(factories);
        } else {
          return new IterableDiffers(factories);
        }
      };
      IterableDiffers.extend = function(factories) {
        return {
          provide: IterableDiffers,
          useFactory: function(parent) {
            if (!parent) {
              throw new Error('Cannot extend IterableDiffers without a parent injector');
            }
            return IterableDiffers.create(factories, parent);
          },
          deps: [[IterableDiffers, new SkipSelf(), new Optional()]]
        };
      };
      IterableDiffers.prototype.find = function(iterable) {
        var factory = this.factories.find(function(f) {
          return f.supports(iterable);
        });
        if (factory != null) {
          return factory;
        } else {
          throw new Error("Cannot find a differ supporting object '" + iterable + "' of type '" + getTypeNameForDebugging(iterable) + "'");
        }
      };
      return IterableDiffers;
    }());
    function getTypeNameForDebugging(type) {
      return type['name'] || typeof type;
    }
    var KeyValueDiffers = (function() {
      function KeyValueDiffers(factories) {
        this.factories = factories;
      }
      KeyValueDiffers.create = function(factories, parent) {
        if (parent) {
          var copied = parent.factories.slice();
          factories = factories.concat(copied);
        }
        return new KeyValueDiffers(factories);
      };
      KeyValueDiffers.extend = function(factories) {
        return {
          provide: KeyValueDiffers,
          useFactory: function(parent) {
            if (!parent) {
              throw new Error('Cannot extend KeyValueDiffers without a parent injector');
            }
            return KeyValueDiffers.create(factories, parent);
          },
          deps: [[KeyValueDiffers, new SkipSelf(), new Optional()]]
        };
      };
      KeyValueDiffers.prototype.find = function(kv) {
        var factory = this.factories.find(function(f) {
          return f.supports(kv);
        });
        if (factory) {
          return factory;
        }
        throw new Error("Cannot find a differ supporting object '" + kv + "'");
      };
      return KeyValueDiffers;
    }());
    var keyValDiff = [new DefaultKeyValueDifferFactory()];
    var iterableDiff = [new DefaultIterableDifferFactory()];
    var defaultIterableDiffers = new IterableDiffers(iterableDiff);
    var defaultKeyValueDiffers = new KeyValueDiffers(keyValDiff);
    function _reflector() {
      return reflector;
    }
    var _CORE_PLATFORM_PROVIDERS = [{
      provide: PLATFORM_ID,
      useValue: 'unknown'
    }, PlatformRef_, {
      provide: PlatformRef,
      useExisting: PlatformRef_
    }, {
      provide: Reflector,
      useFactory: _reflector,
      deps: []
    }, TestabilityRegistry, Console];
    var platformCore = createPlatformFactory(null, 'core', _CORE_PLATFORM_PROVIDERS);
    var LOCALE_ID = new InjectionToken('LocaleId');
    var TRANSLATIONS = new InjectionToken('Translations');
    var TRANSLATIONS_FORMAT = new InjectionToken('TranslationsFormat');
    var MissingTranslationStrategy = {};
    MissingTranslationStrategy.Error = 0;
    MissingTranslationStrategy.Warning = 1;
    MissingTranslationStrategy.Ignore = 2;
    MissingTranslationStrategy[MissingTranslationStrategy.Error] = "Error";
    MissingTranslationStrategy[MissingTranslationStrategy.Warning] = "Warning";
    MissingTranslationStrategy[MissingTranslationStrategy.Ignore] = "Ignore";
    function _iterableDiffersFactory() {
      return defaultIterableDiffers;
    }
    function _keyValueDiffersFactory() {
      return defaultKeyValueDiffers;
    }
    function _localeFactory(locale) {
      return locale || 'en-US';
    }
    var ApplicationModule = (function() {
      function ApplicationModule(appRef) {}
      return ApplicationModule;
    }());
    ApplicationModule.decorators = [{
      type: NgModule,
      args: [{providers: [ApplicationRef_, {
          provide: ApplicationRef,
          useExisting: ApplicationRef_
        }, ApplicationInitStatus, Compiler, APP_ID_RANDOM_PROVIDER, {
          provide: IterableDiffers,
          useFactory: _iterableDiffersFactory
        }, {
          provide: KeyValueDiffers,
          useFactory: _keyValueDiffersFactory
        }, {
          provide: LOCALE_ID,
          useFactory: _localeFactory,
          deps: [[new Inject(LOCALE_ID), new Optional(), new SkipSelf()]]
        }]}]
    }];
    ApplicationModule.ctorParameters = function() {
      return [{type: ApplicationRef}];
    };
    var SecurityContext = {};
    SecurityContext.NONE = 0;
    SecurityContext.HTML = 1;
    SecurityContext.STYLE = 2;
    SecurityContext.SCRIPT = 3;
    SecurityContext.URL = 4;
    SecurityContext.RESOURCE_URL = 5;
    SecurityContext[SecurityContext.NONE] = "NONE";
    SecurityContext[SecurityContext.HTML] = "HTML";
    SecurityContext[SecurityContext.STYLE] = "STYLE";
    SecurityContext[SecurityContext.SCRIPT] = "SCRIPT";
    SecurityContext[SecurityContext.URL] = "URL";
    SecurityContext[SecurityContext.RESOURCE_URL] = "RESOURCE_URL";
    var Sanitizer = (function() {
      function Sanitizer() {}
      Sanitizer.prototype.sanitize = function(context, value) {};
      return Sanitizer;
    }());
    function asTextData(view, index) {
      return (view.nodes[index]);
    }
    function asElementData(view, index) {
      return (view.nodes[index]);
    }
    function asProviderData(view, index) {
      return (view.nodes[index]);
    }
    function asPureExpressionData(view, index) {
      return (view.nodes[index]);
    }
    function asQueryList(view, index) {
      return (view.nodes[index]);
    }
    var DebugContext = (function() {
      function DebugContext() {}
      DebugContext.prototype.view = function() {};
      DebugContext.prototype.nodeIndex = function() {};
      DebugContext.prototype.injector = function() {};
      DebugContext.prototype.component = function() {};
      DebugContext.prototype.providerTokens = function() {};
      DebugContext.prototype.references = function() {};
      DebugContext.prototype.context = function() {};
      DebugContext.prototype.componentRenderElement = function() {};
      DebugContext.prototype.renderNode = function() {};
      DebugContext.prototype.logError = function(console) {
        var values = [];
        for (var _i = 1; _i < arguments.length; _i++) {
          values[_i - 1] = arguments[_i];
        }
      };
      return DebugContext;
    }());
    var Services = {
      setCurrentNode: undefined,
      createRootView: undefined,
      createEmbeddedView: undefined,
      createComponentView: undefined,
      createNgModuleRef: undefined,
      overrideProvider: undefined,
      clearProviderOverrides: undefined,
      checkAndUpdateView: undefined,
      checkNoChangesView: undefined,
      destroyView: undefined,
      resolveDep: undefined,
      createDebugContext: undefined,
      handleEvent: undefined,
      updateDirectives: undefined,
      updateRenderer: undefined,
      dirtyParentQueries: undefined
    };
    function expressionChangedAfterItHasBeenCheckedError(context, oldValue, currValue, isFirstCheck) {
      var msg = "ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: '" + oldValue + "'. Current value: '" + currValue + "'.";
      if (isFirstCheck) {
        msg += " It seems like the view has been created after its parent and its children have been dirty checked." + " Has it been created in a change detection hook ?";
      }
      return viewDebugError(msg, context);
    }
    function viewWrappedDebugError(err, context) {
      if (!(err instanceof Error)) {
        err = new Error(err.toString());
      }
      _addDebugContext(err, context);
      return err;
    }
    function viewDebugError(msg, context) {
      var err = new Error(msg);
      _addDebugContext(err, context);
      return err;
    }
    function _addDebugContext(err, context) {
      ((err))[ERROR_DEBUG_CONTEXT] = context;
      ((err))[ERROR_LOGGER] = context.logError.bind(context);
    }
    function isViewDebugError(err) {
      return !!getDebugContext(err);
    }
    function viewDestroyedError(action) {
      return new Error("ViewDestroyedError: Attempt to use a destroyed view: " + action);
    }
    var NOOP = function() {};
    var _tokenKeyCache = new Map();
    function tokenKey(token) {
      var key = _tokenKeyCache.get(token);
      if (!key) {
        key = stringify(token) + '_' + _tokenKeyCache.size;
        _tokenKeyCache.set(token, key);
      }
      return key;
    }
    function unwrapValue(view, nodeIdx, bindingIdx, value) {
      if (value instanceof WrappedValue) {
        value = value.wrapped;
        var globalBindingIdx = view.def.nodes[nodeIdx].bindingIndex + bindingIdx;
        var oldValue = view.oldValues[globalBindingIdx];
        if (oldValue instanceof WrappedValue) {
          oldValue = oldValue.wrapped;
        }
        view.oldValues[globalBindingIdx] = new WrappedValue(oldValue);
      }
      return value;
    }
    var UNDEFINED_RENDERER_TYPE_ID = '$$undefined';
    var EMPTY_RENDERER_TYPE_ID = '$$empty';
    function createRendererType2(values) {
      return {
        id: UNDEFINED_RENDERER_TYPE_ID,
        styles: values.styles,
        encapsulation: values.encapsulation,
        data: values.data
      };
    }
    var _renderCompCount = 0;
    function resolveRendererType2(type) {
      if (type && type.id === UNDEFINED_RENDERER_TYPE_ID) {
        var isFilled = ((type.encapsulation != null && type.encapsulation !== ViewEncapsulation.None) || type.styles.length || Object.keys(type.data).length);
        if (isFilled) {
          type.id = "c" + _renderCompCount++;
        } else {
          type.id = EMPTY_RENDERER_TYPE_ID;
        }
      }
      if (type && type.id === EMPTY_RENDERER_TYPE_ID) {
        type = null;
      }
      return type || null;
    }
    function checkBinding(view, def, bindingIdx, value) {
      var oldValues = view.oldValues;
      if ((view.state & 2) || !looseIdentical(oldValues[def.bindingIndex + bindingIdx], value)) {
        return true;
      }
      return false;
    }
    function checkAndUpdateBinding(view, def, bindingIdx, value) {
      if (checkBinding(view, def, bindingIdx, value)) {
        view.oldValues[def.bindingIndex + bindingIdx] = value;
        return true;
      }
      return false;
    }
    function checkBindingNoChanges(view, def, bindingIdx, value) {
      var oldValue = view.oldValues[def.bindingIndex + bindingIdx];
      if ((view.state & 1) || !devModeEqual(oldValue, value)) {
        throw expressionChangedAfterItHasBeenCheckedError(Services.createDebugContext(view, def.index), oldValue, value, (view.state & 1) !== 0);
      }
    }
    function markParentViewsForCheck(view) {
      var currView = view;
      while (currView) {
        if (currView.def.flags & 2) {
          currView.state |= 8;
        }
        currView = currView.viewContainerParent || currView.parent;
      }
    }
    function markParentViewsForCheckProjectedViews(view, endView) {
      var currView = view;
      while (currView && currView !== endView) {
        currView.state |= 64;
        currView = currView.viewContainerParent || currView.parent;
      }
    }
    function dispatchEvent(view, nodeIndex, eventName, event) {
      var nodeDef = view.def.nodes[nodeIndex];
      var startView = nodeDef.flags & 33554432 ? asElementData(view, nodeIndex).componentView : view;
      markParentViewsForCheck(startView);
      return Services.handleEvent(view, nodeIndex, eventName, event);
    }
    function declaredViewContainer(view) {
      if (view.parent) {
        var parentView = view.parent;
        return asElementData(parentView, ((view.parentNodeDef)).index);
      }
      return null;
    }
    function viewParentEl(view) {
      var parentView = view.parent;
      if (parentView) {
        return ((view.parentNodeDef)).parent;
      } else {
        return null;
      }
    }
    function renderNode(view, def) {
      switch (def.flags & 201347067) {
        case 1:
          return asElementData(view, def.index).renderElement;
        case 2:
          return asTextData(view, def.index).renderText;
      }
    }
    function elementEventFullName(target, name) {
      return target ? target + ":" + name : name;
    }
    function isComponentView(view) {
      return !!view.parent && !!(((view.parentNodeDef)).flags & 32768);
    }
    function isEmbeddedView(view) {
      return !!view.parent && !(((view.parentNodeDef)).flags & 32768);
    }
    function filterQueryId(queryId) {
      return 1 << (queryId % 32);
    }
    function splitMatchedQueriesDsl(matchedQueriesDsl) {
      var matchedQueries = {};
      var matchedQueryIds = 0;
      var references = {};
      if (matchedQueriesDsl) {
        matchedQueriesDsl.forEach(function(_a) {
          var queryId = _a[0],
              valueType = _a[1];
          if (typeof queryId === 'number') {
            matchedQueries[queryId] = valueType;
            matchedQueryIds |= filterQueryId(queryId);
          } else {
            references[queryId] = valueType;
          }
        });
      }
      return {
        matchedQueries: matchedQueries,
        references: references,
        matchedQueryIds: matchedQueryIds
      };
    }
    function splitDepsDsl(deps) {
      return deps.map(function(value) {
        var token;
        var flags;
        if (Array.isArray(value)) {
          flags = value[0], token = value[1];
        } else {
          flags = 0;
          token = value;
        }
        return {
          flags: flags,
          token: token,
          tokenKey: tokenKey(token)
        };
      });
    }
    function getParentRenderElement(view, renderHost, def) {
      var renderParent = def.renderParent;
      if (renderParent) {
        if ((renderParent.flags & 1) === 0 || (renderParent.flags & 33554432) === 0 || (((renderParent.element)).componentRendererType && ((((renderParent.element)).componentRendererType)).encapsulation === ViewEncapsulation.Native)) {
          return asElementData(view, ((def.renderParent)).index).renderElement;
        }
      } else {
        return renderHost;
      }
    }
    var DEFINITION_CACHE = new WeakMap();
    function resolveDefinition(factory) {
      var value = (((DEFINITION_CACHE.get(factory))));
      if (!value) {
        value = factory(function() {
          return NOOP;
        });
        value.factory = factory;
        DEFINITION_CACHE.set(factory, value);
      }
      return value;
    }
    function rootRenderNodes(view) {
      var renderNodes = [];
      visitRootRenderNodes(view, 0, undefined, undefined, renderNodes);
      return renderNodes;
    }
    function visitRootRenderNodes(view, action, parentNode, nextSibling, target) {
      if (action === 3) {
        parentNode = view.renderer.parentNode(renderNode(view, ((view.def.lastRenderRootNode))));
      }
      visitSiblingRenderNodes(view, action, 0, view.def.nodes.length - 1, parentNode, nextSibling, target);
    }
    function visitSiblingRenderNodes(view, action, startIndex, endIndex, parentNode, nextSibling, target) {
      for (var i = startIndex; i <= endIndex; i++) {
        var nodeDef = view.def.nodes[i];
        if (nodeDef.flags & (1 | 2 | 8)) {
          visitRenderNode(view, nodeDef, action, parentNode, nextSibling, target);
        }
        i += nodeDef.childCount;
      }
    }
    function visitProjectedRenderNodes(view, ngContentIndex, action, parentNode, nextSibling, target) {
      var compView = view;
      while (compView && !isComponentView(compView)) {
        compView = compView.parent;
      }
      var hostView = ((compView)).parent;
      var hostElDef = viewParentEl(((compView)));
      var startIndex = ((hostElDef)).index + 1;
      var endIndex = ((hostElDef)).index + ((hostElDef)).childCount;
      for (var i = startIndex; i <= endIndex; i++) {
        var nodeDef = ((hostView)).def.nodes[i];
        if (nodeDef.ngContentIndex === ngContentIndex) {
          visitRenderNode(((hostView)), nodeDef, action, parentNode, nextSibling, target);
        }
        i += nodeDef.childCount;
      }
      if (!((hostView)).parent) {
        var projectedNodes = view.root.projectableNodes[ngContentIndex];
        if (projectedNodes) {
          for (var i = 0; i < projectedNodes.length; i++) {
            execRenderNodeAction(view, projectedNodes[i], action, parentNode, nextSibling, target);
          }
        }
      }
    }
    function visitRenderNode(view, nodeDef, action, parentNode, nextSibling, target) {
      if (nodeDef.flags & 8) {
        visitProjectedRenderNodes(view, ((nodeDef.ngContent)).index, action, parentNode, nextSibling, target);
      } else {
        var rn = renderNode(view, nodeDef);
        if (action === 3 && (nodeDef.flags & 33554432) && (nodeDef.bindingFlags & 48)) {
          if (nodeDef.bindingFlags & (16)) {
            execRenderNodeAction(view, rn, action, parentNode, nextSibling, target);
          }
          if (nodeDef.bindingFlags & (32)) {
            var compView = asElementData(view, nodeDef.index).componentView;
            execRenderNodeAction(compView, rn, action, parentNode, nextSibling, target);
          }
        } else {
          execRenderNodeAction(view, rn, action, parentNode, nextSibling, target);
        }
        if (nodeDef.flags & 16777216) {
          var embeddedViews = ((asElementData(view, nodeDef.index).viewContainer))._embeddedViews;
          for (var k = 0; k < embeddedViews.length; k++) {
            visitRootRenderNodes(embeddedViews[k], action, parentNode, nextSibling, target);
          }
        }
        if (nodeDef.flags & 1 && !((nodeDef.element)).name) {
          visitSiblingRenderNodes(view, action, nodeDef.index + 1, nodeDef.index + nodeDef.childCount, parentNode, nextSibling, target);
        }
      }
    }
    function execRenderNodeAction(view, renderNode, action, parentNode, nextSibling, target) {
      var renderer = view.renderer;
      switch (action) {
        case 1:
          renderer.appendChild(parentNode, renderNode);
          break;
        case 2:
          renderer.insertBefore(parentNode, renderNode, nextSibling);
          break;
        case 3:
          renderer.removeChild(parentNode, renderNode);
          break;
        case 0:
          ((target)).push(renderNode);
          break;
      }
    }
    var NS_PREFIX_RE = /^:([^:]+):(.+)$/;
    function splitNamespace(name) {
      if (name[0] === ':') {
        var match = ((name.match(NS_PREFIX_RE)));
        return [match[1], match[2]];
      }
      return ['', name];
    }
    function calcBindingFlags(bindings) {
      var flags = 0;
      for (var i = 0; i < bindings.length; i++) {
        flags |= bindings[i].flags;
      }
      return flags;
    }
    function interpolate(valueCount, constAndInterp) {
      var result = '';
      for (var i = 0; i < valueCount * 2; i = i + 2) {
        result = result + constAndInterp[i] + _toStringWithNull(constAndInterp[i + 1]);
      }
      return result + constAndInterp[valueCount * 2];
    }
    function inlineInterpolate(valueCount, c0, a1, c1, a2, c2, a3, c3, a4, c4, a5, c5, a6, c6, a7, c7, a8, c8, a9, c9) {
      switch (valueCount) {
        case 1:
          return c0 + _toStringWithNull(a1) + c1;
        case 2:
          return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2;
        case 3:
          return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) + c3;
        case 4:
          return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) + c3 + _toStringWithNull(a4) + c4;
        case 5:
          return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) + c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5;
        case 6:
          return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) + c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) + c6;
        case 7:
          return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) + c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) + c6 + _toStringWithNull(a7) + c7;
        case 8:
          return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) + c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) + c6 + _toStringWithNull(a7) + c7 + _toStringWithNull(a8) + c8;
        case 9:
          return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) + c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) + c6 + _toStringWithNull(a7) + c7 + _toStringWithNull(a8) + c8 + _toStringWithNull(a9) + c9;
        default:
          throw new Error("Does not support more than 9 expressions");
      }
    }
    function _toStringWithNull(v) {
      return v != null ? v.toString() : '';
    }
    var EMPTY_ARRAY = [];
    var EMPTY_MAP = {};
    function anchorDef(flags, matchedQueriesDsl, ngContentIndex, childCount, handleEvent, templateFactory) {
      flags |= 1;
      var _a = splitMatchedQueriesDsl(matchedQueriesDsl),
          matchedQueries = _a.matchedQueries,
          references = _a.references,
          matchedQueryIds = _a.matchedQueryIds;
      var template = templateFactory ? resolveDefinition(templateFactory) : null;
      return {
        index: -1,
        parent: null,
        renderParent: null,
        bindingIndex: -1,
        outputIndex: -1,
        flags: flags,
        childFlags: 0,
        directChildFlags: 0,
        childMatchedQueries: 0,
        matchedQueries: matchedQueries,
        matchedQueryIds: matchedQueryIds,
        references: references,
        ngContentIndex: ngContentIndex,
        childCount: childCount,
        bindings: [],
        bindingFlags: 0,
        outputs: [],
        element: {
          ns: null,
          name: null,
          attrs: null,
          template: template,
          componentProvider: null,
          componentView: null,
          componentRendererType: null,
          publicProviders: null,
          allProviders: null,
          handleEvent: handleEvent || NOOP
        },
        provider: null,
        text: null,
        query: null,
        ngContent: null
      };
    }
    function elementDef(flags, matchedQueriesDsl, ngContentIndex, childCount, namespaceAndName, fixedAttrs, bindings, outputs, handleEvent, componentView, componentRendererType) {
      if (fixedAttrs === void 0) {
        fixedAttrs = [];
      }
      if (!handleEvent) {
        handleEvent = NOOP;
      }
      var _a = splitMatchedQueriesDsl(matchedQueriesDsl),
          matchedQueries = _a.matchedQueries,
          references = _a.references,
          matchedQueryIds = _a.matchedQueryIds;
      var ns = ((null));
      var name = ((null));
      if (namespaceAndName) {
        _b = splitNamespace(namespaceAndName), ns = _b[0], name = _b[1];
      }
      bindings = bindings || [];
      var bindingDefs = new Array(bindings.length);
      for (var i = 0; i < bindings.length; i++) {
        var _c = bindings[i],
            bindingFlags = _c[0],
            namespaceAndName_1 = _c[1],
            suffixOrSecurityContext = _c[2];
        var _d = splitNamespace(namespaceAndName_1),
            ns_1 = _d[0],
            name_1 = _d[1];
        var securityContext = ((undefined));
        var suffix = ((undefined));
        switch (bindingFlags & 15) {
          case 4:
            suffix = (suffixOrSecurityContext);
            break;
          case 1:
          case 8:
            securityContext = (suffixOrSecurityContext);
            break;
        }
        bindingDefs[i] = {
          flags: bindingFlags,
          ns: ns_1,
          name: name_1,
          nonMinifiedName: name_1,
          securityContext: securityContext,
          suffix: suffix
        };
      }
      outputs = outputs || [];
      var outputDefs = new Array(outputs.length);
      for (var i = 0; i < outputs.length; i++) {
        var _e = outputs[i],
            target = _e[0],
            eventName = _e[1];
        outputDefs[i] = {
          type: 0,
          target: (target),
          eventName: eventName,
          propName: null
        };
      }
      fixedAttrs = fixedAttrs || [];
      var attrs = (fixedAttrs.map(function(_a) {
        var namespaceAndName = _a[0],
            value = _a[1];
        var _b = splitNamespace(namespaceAndName),
            ns = _b[0],
            name = _b[1];
        return [ns, name, value];
      }));
      componentRendererType = resolveRendererType2(componentRendererType);
      if (componentView) {
        flags |= 33554432;
      }
      flags |= 1;
      return {
        index: -1,
        parent: null,
        renderParent: null,
        bindingIndex: -1,
        outputIndex: -1,
        flags: flags,
        childFlags: 0,
        directChildFlags: 0,
        childMatchedQueries: 0,
        matchedQueries: matchedQueries,
        matchedQueryIds: matchedQueryIds,
        references: references,
        ngContentIndex: ngContentIndex,
        childCount: childCount,
        bindings: bindingDefs,
        bindingFlags: calcBindingFlags(bindingDefs),
        outputs: outputDefs,
        element: {
          ns: ns,
          name: name,
          attrs: attrs,
          template: null,
          componentProvider: null,
          componentView: componentView || null,
          componentRendererType: componentRendererType,
          publicProviders: null,
          allProviders: null,
          handleEvent: handleEvent || NOOP
        },
        provider: null,
        text: null,
        query: null,
        ngContent: null
      };
      var _b;
    }
    function createElement(view, renderHost, def) {
      var elDef = ((def.element));
      var rootSelectorOrNode = view.root.selectorOrNode;
      var renderer = view.renderer;
      var el;
      if (view.parent || !rootSelectorOrNode) {
        if (elDef.name) {
          el = renderer.createElement(elDef.name, elDef.ns);
        } else {
          el = renderer.createComment('');
        }
        var parentEl = getParentRenderElement(view, renderHost, def);
        if (parentEl) {
          renderer.appendChild(parentEl, el);
        }
      } else {
        el = renderer.selectRootElement(rootSelectorOrNode);
      }
      if (elDef.attrs) {
        for (var i = 0; i < elDef.attrs.length; i++) {
          var _a = elDef.attrs[i],
              ns = _a[0],
              name = _a[1],
              value = _a[2];
          renderer.setAttribute(el, name, value, ns);
        }
      }
      return el;
    }
    function listenToElementOutputs(view, compView, def, el) {
      for (var i = 0; i < def.outputs.length; i++) {
        var output = def.outputs[i];
        var handleEventClosure = renderEventHandlerClosure(view, def.index, elementEventFullName(output.target, output.eventName));
        var listenTarget = output.target;
        var listenerView = view;
        if (output.target === 'component') {
          listenTarget = null;
          listenerView = compView;
        }
        var disposable = (listenerView.renderer.listen(listenTarget || el, output.eventName, handleEventClosure));
        ((view.disposables))[def.outputIndex + i] = disposable;
      }
    }
    function renderEventHandlerClosure(view, index, eventName) {
      return function(event) {
        try {
          return dispatchEvent(view, index, eventName, event);
        } catch (e) {
          view.root.errorHandler.handleError(e);
        }
      };
    }
    function checkAndUpdateElementInline(view, def, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
      var bindLen = def.bindings.length;
      var changed = false;
      if (bindLen > 0 && checkAndUpdateElementValue(view, def, 0, v0))
        changed = true;
      if (bindLen > 1 && checkAndUpdateElementValue(view, def, 1, v1))
        changed = true;
      if (bindLen > 2 && checkAndUpdateElementValue(view, def, 2, v2))
        changed = true;
      if (bindLen > 3 && checkAndUpdateElementValue(view, def, 3, v3))
        changed = true;
      if (bindLen > 4 && checkAndUpdateElementValue(view, def, 4, v4))
        changed = true;
      if (bindLen > 5 && checkAndUpdateElementValue(view, def, 5, v5))
        changed = true;
      if (bindLen > 6 && checkAndUpdateElementValue(view, def, 6, v6))
        changed = true;
      if (bindLen > 7 && checkAndUpdateElementValue(view, def, 7, v7))
        changed = true;
      if (bindLen > 8 && checkAndUpdateElementValue(view, def, 8, v8))
        changed = true;
      if (bindLen > 9 && checkAndUpdateElementValue(view, def, 9, v9))
        changed = true;
      return changed;
    }
    function checkAndUpdateElementDynamic(view, def, values) {
      var changed = false;
      for (var i = 0; i < values.length; i++) {
        if (checkAndUpdateElementValue(view, def, i, values[i]))
          changed = true;
      }
      return changed;
    }
    function checkAndUpdateElementValue(view, def, bindingIdx, value) {
      if (!checkAndUpdateBinding(view, def, bindingIdx, value)) {
        return false;
      }
      var binding = def.bindings[bindingIdx];
      var elData = asElementData(view, def.index);
      var renderNode$$1 = elData.renderElement;
      var name = ((binding.name));
      switch (binding.flags & 15) {
        case 1:
          setElementAttribute(view, binding, renderNode$$1, binding.ns, name, value);
          break;
        case 2:
          setElementClass(view, renderNode$$1, name, value);
          break;
        case 4:
          setElementStyle(view, binding, renderNode$$1, name, value);
          break;
        case 8:
          var bindView = (def.flags & 33554432 && binding.flags & 32) ? elData.componentView : view;
          setElementProperty(bindView, binding, renderNode$$1, name, value);
          break;
      }
      return true;
    }
    function setElementAttribute(view, binding, renderNode$$1, ns, name, value) {
      var securityContext = binding.securityContext;
      var renderValue = securityContext ? view.root.sanitizer.sanitize(securityContext, value) : value;
      renderValue = renderValue != null ? renderValue.toString() : null;
      var renderer = view.renderer;
      if (value != null) {
        renderer.setAttribute(renderNode$$1, name, renderValue, ns);
      } else {
        renderer.removeAttribute(renderNode$$1, name, ns);
      }
    }
    function setElementClass(view, renderNode$$1, name, value) {
      var renderer = view.renderer;
      if (value) {
        renderer.addClass(renderNode$$1, name);
      } else {
        renderer.removeClass(renderNode$$1, name);
      }
    }
    function setElementStyle(view, binding, renderNode$$1, name, value) {
      var renderValue = view.root.sanitizer.sanitize(SecurityContext.STYLE, (value));
      if (renderValue != null) {
        renderValue = renderValue.toString();
        var unit = binding.suffix;
        if (unit != null) {
          renderValue = renderValue + unit;
        }
      } else {
        renderValue = null;
      }
      var renderer = view.renderer;
      if (renderValue != null) {
        renderer.setStyle(renderNode$$1, name, renderValue);
      } else {
        renderer.removeStyle(renderNode$$1, name);
      }
    }
    function setElementProperty(view, binding, renderNode$$1, name, value) {
      var securityContext = binding.securityContext;
      var renderValue = securityContext ? view.root.sanitizer.sanitize(securityContext, value) : value;
      view.renderer.setProperty(renderNode$$1, name, renderValue);
    }
    var NOT_CREATED$1 = new Object();
    var InjectorRefTokenKey$1 = tokenKey(Injector);
    var NgModuleRefTokenKey = tokenKey(NgModuleRef);
    function moduleProvideDef(flags, token, value, deps) {
      var depDefs = splitDepsDsl(deps);
      return {
        index: -1,
        deps: depDefs,
        flags: flags,
        token: token,
        value: value
      };
    }
    function moduleDef(providers) {
      var providersByKey = {};
      for (var i = 0; i < providers.length; i++) {
        var provider = providers[i];
        provider.index = i;
        providersByKey[tokenKey(provider.token)] = provider;
      }
      return {
        factory: null,
        providersByKey: providersByKey,
        providers: providers
      };
    }
    function initNgModule(data) {
      var def = data._def;
      var providers = data._providers = new Array(def.providers.length);
      for (var i = 0; i < def.providers.length; i++) {
        var provDef = def.providers[i];
        providers[i] = provDef.flags & 4096 ? NOT_CREATED$1 : _createProviderInstance$1(data, provDef);
      }
    }
    function resolveNgModuleDep(data, depDef, notFoundValue) {
      if (notFoundValue === void 0) {
        notFoundValue = Injector.THROW_IF_NOT_FOUND;
      }
      if (depDef.flags & 8) {
        return depDef.token;
      }
      if (depDef.flags & 2) {
        notFoundValue = null;
      }
      if (depDef.flags & 1) {
        return data._parent.get(depDef.token, notFoundValue);
      }
      var tokenKey$$1 = depDef.tokenKey;
      switch (tokenKey$$1) {
        case InjectorRefTokenKey$1:
        case NgModuleRefTokenKey:
          return data;
      }
      var providerDef = data._def.providersByKey[tokenKey$$1];
      if (providerDef) {
        var providerInstance = data._providers[providerDef.index];
        if (providerInstance === NOT_CREATED$1) {
          providerInstance = data._providers[providerDef.index] = _createProviderInstance$1(data, providerDef);
        }
        return providerInstance;
      }
      return data._parent.get(depDef.token, notFoundValue);
    }
    function _createProviderInstance$1(ngModule, providerDef) {
      var injectable;
      switch (providerDef.flags & 201347067) {
        case 512:
          injectable = _createClass(ngModule, providerDef.value, providerDef.deps);
          break;
        case 1024:
          injectable = _callFactory(ngModule, providerDef.value, providerDef.deps);
          break;
        case 2048:
          injectable = resolveNgModuleDep(ngModule, providerDef.deps[0]);
          break;
        case 256:
          injectable = providerDef.value;
          break;
      }
      return injectable;
    }
    function _createClass(ngModule, ctor, deps) {
      var len = deps.length;
      var injectable;
      switch (len) {
        case 0:
          injectable = new ctor();
          break;
        case 1:
          injectable = new ctor(resolveNgModuleDep(ngModule, deps[0]));
          break;
        case 2:
          injectable = new ctor(resolveNgModuleDep(ngModule, deps[0]), resolveNgModuleDep(ngModule, deps[1]));
          break;
        case 3:
          injectable = new ctor(resolveNgModuleDep(ngModule, deps[0]), resolveNgModuleDep(ngModule, deps[1]), resolveNgModuleDep(ngModule, deps[2]));
          break;
        default:
          var depValues = new Array(len);
          for (var i = 0; i < len; i++) {
            depValues[i] = resolveNgModuleDep(ngModule, deps[i]);
          }
          injectable = new (ctor.bind.apply(ctor, [void 0].concat(depValues)))();
      }
      return injectable;
    }
    function _callFactory(ngModule, factory, deps) {
      var len = deps.length;
      var injectable;
      switch (len) {
        case 0:
          injectable = factory();
          break;
        case 1:
          injectable = factory(resolveNgModuleDep(ngModule, deps[0]));
          break;
        case 2:
          injectable = factory(resolveNgModuleDep(ngModule, deps[0]), resolveNgModuleDep(ngModule, deps[1]));
          break;
        case 3:
          injectable = factory(resolveNgModuleDep(ngModule, deps[0]), resolveNgModuleDep(ngModule, deps[1]), resolveNgModuleDep(ngModule, deps[2]));
          break;
        default:
          var depValues = Array(len);
          for (var i = 0; i < len; i++) {
            depValues[i] = resolveNgModuleDep(ngModule, deps[i]);
          }
          injectable = factory.apply(void 0, depValues);
      }
      return injectable;
    }
    function callNgModuleLifecycle(ngModule, lifecycles) {
      var def = ngModule._def;
      for (var i = 0; i < def.providers.length; i++) {
        var provDef = def.providers[i];
        if (provDef.flags & 131072) {
          var instance = ngModule._providers[i];
          if (instance && instance !== NOT_CREATED$1) {
            instance.ngOnDestroy();
          }
        }
      }
    }
    function attachEmbeddedView(parentView, elementData, viewIndex, view) {
      var embeddedViews = ((elementData.viewContainer))._embeddedViews;
      if (viewIndex === null || viewIndex === undefined) {
        viewIndex = embeddedViews.length;
      }
      view.viewContainerParent = parentView;
      addToArray(embeddedViews, ((viewIndex)), view);
      attachProjectedView(elementData, view);
      Services.dirtyParentQueries(view);
      var prevView = ((viewIndex)) > 0 ? embeddedViews[((viewIndex)) - 1] : null;
      renderAttachEmbeddedView(elementData, prevView, view);
    }
    function attachProjectedView(vcElementData, view) {
      var dvcElementData = declaredViewContainer(view);
      if (!dvcElementData || dvcElementData === vcElementData || view.state & 16) {
        return;
      }
      view.state |= 16;
      var projectedViews = dvcElementData.template._projectedViews;
      if (!projectedViews) {
        projectedViews = dvcElementData.template._projectedViews = [];
      }
      projectedViews.push(view);
      markNodeAsProjectedTemplate(((view.parent)).def, ((view.parentNodeDef)));
    }
    function markNodeAsProjectedTemplate(viewDef, nodeDef) {
      if (nodeDef.flags & 4) {
        return;
      }
      viewDef.nodeFlags |= 4;
      nodeDef.flags |= 4;
      var parentNodeDef = nodeDef.parent;
      while (parentNodeDef) {
        parentNodeDef.childFlags |= 4;
        parentNodeDef = parentNodeDef.parent;
      }
    }
    function detachEmbeddedView(elementData, viewIndex) {
      var embeddedViews = ((elementData.viewContainer))._embeddedViews;
      if (viewIndex == null || viewIndex >= embeddedViews.length) {
        viewIndex = embeddedViews.length - 1;
      }
      if (viewIndex < 0) {
        return null;
      }
      var view = embeddedViews[viewIndex];
      view.viewContainerParent = null;
      removeFromArray(embeddedViews, viewIndex);
      Services.dirtyParentQueries(view);
      renderDetachView(view);
      return view;
    }
    function detachProjectedView(view) {
      if (!(view.state & 16)) {
        return;
      }
      var dvcElementData = declaredViewContainer(view);
      if (dvcElementData) {
        var projectedViews = dvcElementData.template._projectedViews;
        if (projectedViews) {
          removeFromArray(projectedViews, projectedViews.indexOf(view));
          Services.dirtyParentQueries(view);
        }
      }
    }
    function moveEmbeddedView(elementData, oldViewIndex, newViewIndex) {
      var embeddedViews = ((elementData.viewContainer))._embeddedViews;
      var view = embeddedViews[oldViewIndex];
      removeFromArray(embeddedViews, oldViewIndex);
      if (newViewIndex == null) {
        newViewIndex = embeddedViews.length;
      }
      addToArray(embeddedViews, newViewIndex, view);
      Services.dirtyParentQueries(view);
      renderDetachView(view);
      var prevView = newViewIndex > 0 ? embeddedViews[newViewIndex - 1] : null;
      renderAttachEmbeddedView(elementData, prevView, view);
      return view;
    }
    function renderAttachEmbeddedView(elementData, prevView, view) {
      var prevRenderNode = prevView ? renderNode(prevView, ((prevView.def.lastRenderRootNode))) : elementData.renderElement;
      var parentNode = view.renderer.parentNode(prevRenderNode);
      var nextSibling = view.renderer.nextSibling(prevRenderNode);
      visitRootRenderNodes(view, 2, parentNode, nextSibling, undefined);
    }
    function renderDetachView(view) {
      visitRootRenderNodes(view, 3, null, null, undefined);
    }
    function addToArray(arr, index, value) {
      if (index >= arr.length) {
        arr.push(value);
      } else {
        arr.splice(index, 0, value);
      }
    }
    function removeFromArray(arr, index) {
      if (index >= arr.length - 1) {
        arr.pop();
      } else {
        arr.splice(index, 1);
      }
    }
    var EMPTY_CONTEXT = new Object();
    function createComponentFactory(selector, componentType, viewDefFactory, inputs, outputs, ngContentSelectors) {
      return new ComponentFactory_(selector, componentType, viewDefFactory, inputs, outputs, ngContentSelectors);
    }
    function getComponentViewDefinitionFactory(componentFactory) {
      return ((componentFactory)).viewDefFactory;
    }
    var ComponentFactory_ = (function(_super) {
      __extends(ComponentFactory_, _super);
      function ComponentFactory_(selector, componentType, viewDefFactory, _inputs, _outputs, ngContentSelectors) {
        var _this = _super.call(this) || this;
        _this.selector = selector;
        _this.componentType = componentType;
        _this._inputs = _inputs;
        _this._outputs = _outputs;
        _this.ngContentSelectors = ngContentSelectors;
        _this.viewDefFactory = viewDefFactory;
        return _this;
      }
      Object.defineProperty(ComponentFactory_.prototype, "inputs", {
        get: function() {
          var inputsArr = [];
          var inputs = ((this._inputs));
          for (var propName in inputs) {
            var templateName = inputs[propName];
            inputsArr.push({
              propName: propName,
              templateName: templateName
            });
          }
          return inputsArr;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ComponentFactory_.prototype, "outputs", {
        get: function() {
          var outputsArr = [];
          for (var propName in this._outputs) {
            var templateName = this._outputs[propName];
            outputsArr.push({
              propName: propName,
              templateName: templateName
            });
          }
          return outputsArr;
        },
        enumerable: true,
        configurable: true
      });
      ComponentFactory_.prototype.create = function(injector, projectableNodes, rootSelectorOrNode, ngModule) {
        if (!ngModule) {
          throw new Error('ngModule should be provided');
        }
        var viewDef = resolveDefinition(this.viewDefFactory);
        var componentNodeIndex = ((((viewDef.nodes[0].element)).componentProvider)).index;
        var view = Services.createRootView(injector, projectableNodes || [], rootSelectorOrNode, viewDef, ngModule, EMPTY_CONTEXT);
        var component = asProviderData(view, componentNodeIndex).instance;
        if (rootSelectorOrNode) {
          view.renderer.setAttribute(asElementData(view, 0).renderElement, 'ng-version', VERSION.full);
        }
        return new ComponentRef_(view, new ViewRef_(view), component);
      };
      return ComponentFactory_;
    }(ComponentFactory));
    var ComponentRef_ = (function(_super) {
      __extends(ComponentRef_, _super);
      function ComponentRef_(_view, _viewRef, _component) {
        var _this = _super.call(this) || this;
        _this._view = _view;
        _this._viewRef = _viewRef;
        _this._component = _component;
        _this._elDef = _this._view.def.nodes[0];
        return _this;
      }
      Object.defineProperty(ComponentRef_.prototype, "location", {
        get: function() {
          return new ElementRef(asElementData(this._view, this._elDef.index).renderElement);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ComponentRef_.prototype, "injector", {
        get: function() {
          return new Injector_(this._view, this._elDef);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ComponentRef_.prototype, "instance", {
        get: function() {
          return this._component;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ComponentRef_.prototype, "hostView", {
        get: function() {
          return this._viewRef;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ComponentRef_.prototype, "changeDetectorRef", {
        get: function() {
          return this._viewRef;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ComponentRef_.prototype, "componentType", {
        get: function() {
          return (this._component.constructor);
        },
        enumerable: true,
        configurable: true
      });
      ComponentRef_.prototype.destroy = function() {
        this._viewRef.destroy();
      };
      ComponentRef_.prototype.onDestroy = function(callback) {
        this._viewRef.onDestroy(callback);
      };
      return ComponentRef_;
    }(ComponentRef));
    function createViewContainerData(view, elDef, elData) {
      return new ViewContainerRef_(view, elDef, elData);
    }
    var ViewContainerRef_ = (function() {
      function ViewContainerRef_(_view, _elDef, _data) {
        this._view = _view;
        this._elDef = _elDef;
        this._data = _data;
        this._embeddedViews = [];
      }
      Object.defineProperty(ViewContainerRef_.prototype, "element", {
        get: function() {
          return new ElementRef(this._data.renderElement);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ViewContainerRef_.prototype, "injector", {
        get: function() {
          return new Injector_(this._view, this._elDef);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ViewContainerRef_.prototype, "parentInjector", {
        get: function() {
          var view = this._view;
          var elDef = this._elDef.parent;
          while (!elDef && view) {
            elDef = viewParentEl(view);
            view = ((view.parent));
          }
          return view ? new Injector_(view, elDef) : new Injector_(this._view, null);
        },
        enumerable: true,
        configurable: true
      });
      ViewContainerRef_.prototype.clear = function() {
        var len = this._embeddedViews.length;
        for (var i = len - 1; i >= 0; i--) {
          var view = ((detachEmbeddedView(this._data, i)));
          Services.destroyView(view);
        }
      };
      ViewContainerRef_.prototype.get = function(index) {
        var view = this._embeddedViews[index];
        if (view) {
          var ref = new ViewRef_(view);
          ref.attachToViewContainerRef(this);
          return ref;
        }
        return null;
      };
      Object.defineProperty(ViewContainerRef_.prototype, "length", {
        get: function() {
          return this._embeddedViews.length;
        },
        enumerable: true,
        configurable: true
      });
      ViewContainerRef_.prototype.createEmbeddedView = function(templateRef, context, index) {
        var viewRef = templateRef.createEmbeddedView(context || ({}));
        this.insert(viewRef, index);
        return viewRef;
      };
      ViewContainerRef_.prototype.createComponent = function(componentFactory, index, injector, projectableNodes, ngModuleRef) {
        var contextInjector = injector || this.parentInjector;
        if (!ngModuleRef && !(componentFactory instanceof ComponentFactoryBoundToModule)) {
          ngModuleRef = contextInjector.get(NgModuleRef);
        }
        var componentRef = componentFactory.create(contextInjector, projectableNodes, undefined, ngModuleRef);
        this.insert(componentRef.hostView, index);
        return componentRef;
      };
      ViewContainerRef_.prototype.insert = function(viewRef, index) {
        var viewRef_ = (viewRef);
        var viewData = viewRef_._view;
        attachEmbeddedView(this._view, this._data, index, viewData);
        viewRef_.attachToViewContainerRef(this);
        return viewRef;
      };
      ViewContainerRef_.prototype.move = function(viewRef, currentIndex) {
        var previousIndex = this._embeddedViews.indexOf(viewRef._view);
        moveEmbeddedView(this._data, previousIndex, currentIndex);
        return viewRef;
      };
      ViewContainerRef_.prototype.indexOf = function(viewRef) {
        return this._embeddedViews.indexOf(((viewRef))._view);
      };
      ViewContainerRef_.prototype.remove = function(index) {
        var viewData = detachEmbeddedView(this._data, index);
        if (viewData) {
          Services.destroyView(viewData);
        }
      };
      ViewContainerRef_.prototype.detach = function(index) {
        var view = detachEmbeddedView(this._data, index);
        return view ? new ViewRef_(view) : null;
      };
      return ViewContainerRef_;
    }());
    function createChangeDetectorRef(view) {
      return new ViewRef_(view);
    }
    var ViewRef_ = (function() {
      function ViewRef_(_view) {
        this._view = _view;
        this._viewContainerRef = null;
        this._appRef = null;
      }
      Object.defineProperty(ViewRef_.prototype, "rootNodes", {
        get: function() {
          return rootRenderNodes(this._view);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ViewRef_.prototype, "context", {
        get: function() {
          return this._view.context;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ViewRef_.prototype, "destroyed", {
        get: function() {
          return (this._view.state & 128) !== 0;
        },
        enumerable: true,
        configurable: true
      });
      ViewRef_.prototype.markForCheck = function() {
        markParentViewsForCheck(this._view);
      };
      ViewRef_.prototype.detach = function() {
        this._view.state &= ~4;
      };
      ViewRef_.prototype.detectChanges = function() {
        var fs = this._view.root.rendererFactory;
        if (fs.begin) {
          fs.begin();
        }
        Services.checkAndUpdateView(this._view);
        if (fs.end) {
          fs.end();
        }
      };
      ViewRef_.prototype.checkNoChanges = function() {
        Services.checkNoChangesView(this._view);
      };
      ViewRef_.prototype.reattach = function() {
        this._view.state |= 4;
      };
      ViewRef_.prototype.onDestroy = function(callback) {
        if (!this._view.disposables) {
          this._view.disposables = [];
        }
        this._view.disposables.push((callback));
      };
      ViewRef_.prototype.destroy = function() {
        if (this._appRef) {
          this._appRef.detachView(this);
        } else if (this._viewContainerRef) {
          this._viewContainerRef.detach(this._viewContainerRef.indexOf(this));
        }
        Services.destroyView(this._view);
      };
      ViewRef_.prototype.detachFromAppRef = function() {
        this._appRef = null;
        renderDetachView(this._view);
        Services.dirtyParentQueries(this._view);
      };
      ViewRef_.prototype.attachToAppRef = function(appRef) {
        if (this._viewContainerRef) {
          throw new Error('This view is already attached to a ViewContainer!');
        }
        this._appRef = appRef;
      };
      ViewRef_.prototype.attachToViewContainerRef = function(vcRef) {
        if (this._appRef) {
          throw new Error('This view is already attached directly to the ApplicationRef!');
        }
        this._viewContainerRef = vcRef;
      };
      return ViewRef_;
    }());
    function createTemplateData(view, def) {
      return new TemplateRef_(view, def);
    }
    var TemplateRef_ = (function(_super) {
      __extends(TemplateRef_, _super);
      function TemplateRef_(_parentView, _def) {
        var _this = _super.call(this) || this;
        _this._parentView = _parentView;
        _this._def = _def;
        return _this;
      }
      TemplateRef_.prototype.createEmbeddedView = function(context) {
        return new ViewRef_(Services.createEmbeddedView(this._parentView, this._def, ((((this._def.element)).template)), context));
      };
      Object.defineProperty(TemplateRef_.prototype, "elementRef", {
        get: function() {
          return new ElementRef(asElementData(this._parentView, this._def.index).renderElement);
        },
        enumerable: true,
        configurable: true
      });
      return TemplateRef_;
    }(TemplateRef));
    function createInjector(view, elDef) {
      return new Injector_(view, elDef);
    }
    var Injector_ = (function() {
      function Injector_(view, elDef) {
        this.view = view;
        this.elDef = elDef;
      }
      Injector_.prototype.get = function(token, notFoundValue) {
        if (notFoundValue === void 0) {
          notFoundValue = Injector.THROW_IF_NOT_FOUND;
        }
        var allowPrivateServices = this.elDef ? (this.elDef.flags & 33554432) !== 0 : false;
        return Services.resolveDep(this.view, this.elDef, allowPrivateServices, {
          flags: 0,
          token: token,
          tokenKey: tokenKey(token)
        }, notFoundValue);
      };
      return Injector_;
    }());
    function nodeValue(view, index) {
      var def = view.def.nodes[index];
      if (def.flags & 1) {
        var elData = asElementData(view, def.index);
        return ((def.element)).template ? elData.template : elData.renderElement;
      } else if (def.flags & 2) {
        return asTextData(view, def.index).renderText;
      } else if (def.flags & (20224 | 16)) {
        return asProviderData(view, def.index).instance;
      }
      throw new Error("Illegal state: read nodeValue for node index " + index);
    }
    function createRendererV1(view) {
      return new RendererAdapter(view.renderer);
    }
    var RendererAdapter = (function() {
      function RendererAdapter(delegate) {
        this.delegate = delegate;
      }
      RendererAdapter.prototype.selectRootElement = function(selectorOrNode) {
        return this.delegate.selectRootElement(selectorOrNode);
      };
      RendererAdapter.prototype.createElement = function(parent, namespaceAndName) {
        var _a = splitNamespace(namespaceAndName),
            ns = _a[0],
            name = _a[1];
        var el = this.delegate.createElement(name, ns);
        if (parent) {
          this.delegate.appendChild(parent, el);
        }
        return el;
      };
      RendererAdapter.prototype.createViewRoot = function(hostElement) {
        return hostElement;
      };
      RendererAdapter.prototype.createTemplateAnchor = function(parentElement) {
        var comment = this.delegate.createComment('');
        if (parentElement) {
          this.delegate.appendChild(parentElement, comment);
        }
        return comment;
      };
      RendererAdapter.prototype.createText = function(parentElement, value) {
        var node = this.delegate.createText(value);
        if (parentElement) {
          this.delegate.appendChild(parentElement, node);
        }
        return node;
      };
      RendererAdapter.prototype.projectNodes = function(parentElement, nodes) {
        for (var i = 0; i < nodes.length; i++) {
          this.delegate.appendChild(parentElement, nodes[i]);
        }
      };
      RendererAdapter.prototype.attachViewAfter = function(node, viewRootNodes) {
        var parentElement = this.delegate.parentNode(node);
        var nextSibling = this.delegate.nextSibling(node);
        for (var i = 0; i < viewRootNodes.length; i++) {
          this.delegate.insertBefore(parentElement, viewRootNodes[i], nextSibling);
        }
      };
      RendererAdapter.prototype.detachView = function(viewRootNodes) {
        for (var i = 0; i < viewRootNodes.length; i++) {
          var node = viewRootNodes[i];
          var parentElement = this.delegate.parentNode(node);
          this.delegate.removeChild(parentElement, node);
        }
      };
      RendererAdapter.prototype.destroyView = function(hostElement, viewAllNodes) {
        for (var i = 0; i < viewAllNodes.length; i++) {
          ((this.delegate.destroyNode))(viewAllNodes[i]);
        }
      };
      RendererAdapter.prototype.listen = function(renderElement, name, callback) {
        return this.delegate.listen(renderElement, name, (callback));
      };
      RendererAdapter.prototype.listenGlobal = function(target, name, callback) {
        return this.delegate.listen(target, name, (callback));
      };
      RendererAdapter.prototype.setElementProperty = function(renderElement, propertyName, propertyValue) {
        this.delegate.setProperty(renderElement, propertyName, propertyValue);
      };
      RendererAdapter.prototype.setElementAttribute = function(renderElement, namespaceAndName, attributeValue) {
        var _a = splitNamespace(namespaceAndName),
            ns = _a[0],
            name = _a[1];
        if (attributeValue != null) {
          this.delegate.setAttribute(renderElement, name, attributeValue, ns);
        } else {
          this.delegate.removeAttribute(renderElement, name, ns);
        }
      };
      RendererAdapter.prototype.setBindingDebugInfo = function(renderElement, propertyName, propertyValue) {};
      RendererAdapter.prototype.setElementClass = function(renderElement, className, isAdd) {
        if (isAdd) {
          this.delegate.addClass(renderElement, className);
        } else {
          this.delegate.removeClass(renderElement, className);
        }
      };
      RendererAdapter.prototype.setElementStyle = function(renderElement, styleName, styleValue) {
        if (styleValue != null) {
          this.delegate.setStyle(renderElement, styleName, styleValue);
        } else {
          this.delegate.removeStyle(renderElement, styleName);
        }
      };
      RendererAdapter.prototype.invokeElementMethod = function(renderElement, methodName, args) {
        ((renderElement))[methodName].apply(renderElement, args);
      };
      RendererAdapter.prototype.setText = function(renderNode$$1, text) {
        this.delegate.setValue(renderNode$$1, text);
      };
      RendererAdapter.prototype.animate = function() {
        throw new Error('Renderer.animate is no longer supported!');
      };
      return RendererAdapter;
    }());
    function createNgModuleRef(moduleType, parent, bootstrapComponents, def) {
      return new NgModuleRef_(moduleType, parent, bootstrapComponents, def);
    }
    var NgModuleRef_ = (function() {
      function NgModuleRef_(_moduleType, _parent, _bootstrapComponents, _def) {
        this._moduleType = _moduleType;
        this._parent = _parent;
        this._bootstrapComponents = _bootstrapComponents;
        this._def = _def;
        this._destroyListeners = [];
        this._destroyed = false;
        initNgModule(this);
      }
      NgModuleRef_.prototype.get = function(token, notFoundValue) {
        if (notFoundValue === void 0) {
          notFoundValue = Injector.THROW_IF_NOT_FOUND;
        }
        return resolveNgModuleDep(this, {
          token: token,
          tokenKey: tokenKey(token),
          flags: 0
        }, notFoundValue);
      };
      Object.defineProperty(NgModuleRef_.prototype, "instance", {
        get: function() {
          return this.get(this._moduleType);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(NgModuleRef_.prototype, "componentFactoryResolver", {
        get: function() {
          return this.get(ComponentFactoryResolver);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(NgModuleRef_.prototype, "injector", {
        get: function() {
          return this;
        },
        enumerable: true,
        configurable: true
      });
      NgModuleRef_.prototype.destroy = function() {
        if (this._destroyed) {
          throw new Error("The ng module " + stringify(this.instance.constructor) + " has already been destroyed.");
        }
        this._destroyed = true;
        callNgModuleLifecycle(this, 131072);
        this._destroyListeners.forEach(function(listener) {
          return listener();
        });
      };
      NgModuleRef_.prototype.onDestroy = function(callback) {
        this._destroyListeners.push(callback);
      };
      return NgModuleRef_;
    }());
    var RendererV1TokenKey = tokenKey(Renderer);
    var Renderer2TokenKey = tokenKey(Renderer2);
    var ElementRefTokenKey = tokenKey(ElementRef);
    var ViewContainerRefTokenKey = tokenKey(ViewContainerRef);
    var TemplateRefTokenKey = tokenKey(TemplateRef);
    var ChangeDetectorRefTokenKey = tokenKey(ChangeDetectorRef);
    var InjectorRefTokenKey = tokenKey(Injector);
    var NOT_CREATED = new Object();
    function directiveDef(flags, matchedQueries, childCount, ctor, deps, props, outputs) {
      var bindings = [];
      if (props) {
        for (var prop in props) {
          var _a = props[prop],
              bindingIndex = _a[0],
              nonMinifiedName = _a[1];
          bindings[bindingIndex] = {
            flags: 8,
            name: prop,
            nonMinifiedName: nonMinifiedName,
            ns: null,
            securityContext: null,
            suffix: null
          };
        }
      }
      var outputDefs = [];
      if (outputs) {
        for (var propName in outputs) {
          outputDefs.push({
            type: 1,
            propName: propName,
            target: null,
            eventName: outputs[propName]
          });
        }
      }
      flags |= 16384;
      return _def(flags, matchedQueries, childCount, ctor, ctor, deps, bindings, outputDefs);
    }
    function pipeDef(flags, ctor, deps) {
      flags |= 16;
      return _def(flags, null, 0, ctor, ctor, deps);
    }
    function providerDef(flags, matchedQueries, token, value, deps) {
      return _def(flags, matchedQueries, 0, token, value, deps);
    }
    function _def(flags, matchedQueriesDsl, childCount, token, value, deps, bindings, outputs) {
      var _a = splitMatchedQueriesDsl(matchedQueriesDsl),
          matchedQueries = _a.matchedQueries,
          references = _a.references,
          matchedQueryIds = _a.matchedQueryIds;
      if (!outputs) {
        outputs = [];
      }
      if (!bindings) {
        bindings = [];
      }
      var depDefs = splitDepsDsl(deps);
      return {
        index: -1,
        parent: null,
        renderParent: null,
        bindingIndex: -1,
        outputIndex: -1,
        flags: flags,
        childFlags: 0,
        directChildFlags: 0,
        childMatchedQueries: 0,
        matchedQueries: matchedQueries,
        matchedQueryIds: matchedQueryIds,
        references: references,
        ngContentIndex: -1,
        childCount: childCount,
        bindings: bindings,
        bindingFlags: calcBindingFlags(bindings),
        outputs: outputs,
        element: null,
        provider: {
          token: token,
          value: value,
          deps: depDefs
        },
        text: null,
        query: null,
        ngContent: null
      };
    }
    function createProviderInstance(view, def) {
      return def.flags & 4096 ? NOT_CREATED : _createProviderInstance(view, def);
    }
    function createPipeInstance(view, def) {
      var compView = view;
      while (compView.parent && !isComponentView(compView)) {
        compView = compView.parent;
      }
      var allowPrivateServices = true;
      return createClass(((compView.parent)), ((viewParentEl(compView))), allowPrivateServices, ((def.provider)).value, ((def.provider)).deps);
    }
    function createDirectiveInstance(view, def) {
      var allowPrivateServices = (def.flags & 32768) > 0;
      var instance = createClass(view, ((def.parent)), allowPrivateServices, ((def.provider)).value, ((def.provider)).deps);
      if (def.outputs.length) {
        for (var i = 0; i < def.outputs.length; i++) {
          var output = def.outputs[i];
          var subscription = instance[((output.propName))].subscribe(eventHandlerClosure(view, ((def.parent)).index, output.eventName));
          ((view.disposables))[def.outputIndex + i] = subscription.unsubscribe.bind(subscription);
        }
      }
      return instance;
    }
    function eventHandlerClosure(view, index, eventName) {
      return function(event) {
        try {
          return dispatchEvent(view, index, eventName, event);
        } catch (e) {
          view.root.errorHandler.handleError(e);
        }
      };
    }
    function checkAndUpdateDirectiveInline(view, def, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
      var providerData = asProviderData(view, def.index);
      var directive = providerData.instance;
      var changed = false;
      var changes = ((undefined));
      var bindLen = def.bindings.length;
      if (bindLen > 0 && checkBinding(view, def, 0, v0)) {
        changed = true;
        changes = updateProp(view, providerData, def, 0, v0, changes);
      }
      if (bindLen > 1 && checkBinding(view, def, 1, v1)) {
        changed = true;
        changes = updateProp(view, providerData, def, 1, v1, changes);
      }
      if (bindLen > 2 && checkBinding(view, def, 2, v2)) {
        changed = true;
        changes = updateProp(view, providerData, def, 2, v2, changes);
      }
      if (bindLen > 3 && checkBinding(view, def, 3, v3)) {
        changed = true;
        changes = updateProp(view, providerData, def, 3, v3, changes);
      }
      if (bindLen > 4 && checkBinding(view, def, 4, v4)) {
        changed = true;
        changes = updateProp(view, providerData, def, 4, v4, changes);
      }
      if (bindLen > 5 && checkBinding(view, def, 5, v5)) {
        changed = true;
        changes = updateProp(view, providerData, def, 5, v5, changes);
      }
      if (bindLen > 6 && checkBinding(view, def, 6, v6)) {
        changed = true;
        changes = updateProp(view, providerData, def, 6, v6, changes);
      }
      if (bindLen > 7 && checkBinding(view, def, 7, v7)) {
        changed = true;
        changes = updateProp(view, providerData, def, 7, v7, changes);
      }
      if (bindLen > 8 && checkBinding(view, def, 8, v8)) {
        changed = true;
        changes = updateProp(view, providerData, def, 8, v8, changes);
      }
      if (bindLen > 9 && checkBinding(view, def, 9, v9)) {
        changed = true;
        changes = updateProp(view, providerData, def, 9, v9, changes);
      }
      if (changes) {
        directive.ngOnChanges(changes);
      }
      if ((view.state & 2) && (def.flags & 65536)) {
        directive.ngOnInit();
      }
      if (def.flags & 262144) {
        directive.ngDoCheck();
      }
      return changed;
    }
    function checkAndUpdateDirectiveDynamic(view, def, values) {
      var providerData = asProviderData(view, def.index);
      var directive = providerData.instance;
      var changed = false;
      var changes = ((undefined));
      for (var i = 0; i < values.length; i++) {
        if (checkBinding(view, def, i, values[i])) {
          changed = true;
          changes = updateProp(view, providerData, def, i, values[i], changes);
        }
      }
      if (changes) {
        directive.ngOnChanges(changes);
      }
      if ((view.state & 2) && (def.flags & 65536)) {
        directive.ngOnInit();
      }
      if (def.flags & 262144) {
        directive.ngDoCheck();
      }
      return changed;
    }
    function _createProviderInstance(view, def) {
      var allowPrivateServices = (def.flags & 8192) > 0;
      var providerDef = def.provider;
      var injectable;
      switch (def.flags & 201347067) {
        case 512:
          injectable = createClass(view, ((def.parent)), allowPrivateServices, ((providerDef)).value, ((providerDef)).deps);
          break;
        case 1024:
          injectable = callFactory(view, ((def.parent)), allowPrivateServices, ((providerDef)).value, ((providerDef)).deps);
          break;
        case 2048:
          injectable = resolveDep(view, ((def.parent)), allowPrivateServices, ((providerDef)).deps[0]);
          break;
        case 256:
          injectable = ((providerDef)).value;
          break;
      }
      return injectable;
    }
    function createClass(view, elDef, allowPrivateServices, ctor, deps) {
      var len = deps.length;
      var injectable;
      switch (len) {
        case 0:
          injectable = new ctor();
          break;
        case 1:
          injectable = new ctor(resolveDep(view, elDef, allowPrivateServices, deps[0]));
          break;
        case 2:
          injectable = new ctor(resolveDep(view, elDef, allowPrivateServices, deps[0]), resolveDep(view, elDef, allowPrivateServices, deps[1]));
          break;
        case 3:
          injectable = new ctor(resolveDep(view, elDef, allowPrivateServices, deps[0]), resolveDep(view, elDef, allowPrivateServices, deps[1]), resolveDep(view, elDef, allowPrivateServices, deps[2]));
          break;
        default:
          var depValues = new Array(len);
          for (var i = 0; i < len; i++) {
            depValues[i] = resolveDep(view, elDef, allowPrivateServices, deps[i]);
          }
          injectable = new (ctor.bind.apply(ctor, [void 0].concat(depValues)))();
      }
      return injectable;
    }
    function callFactory(view, elDef, allowPrivateServices, factory, deps) {
      var len = deps.length;
      var injectable;
      switch (len) {
        case 0:
          injectable = factory();
          break;
        case 1:
          injectable = factory(resolveDep(view, elDef, allowPrivateServices, deps[0]));
          break;
        case 2:
          injectable = factory(resolveDep(view, elDef, allowPrivateServices, deps[0]), resolveDep(view, elDef, allowPrivateServices, deps[1]));
          break;
        case 3:
          injectable = factory(resolveDep(view, elDef, allowPrivateServices, deps[0]), resolveDep(view, elDef, allowPrivateServices, deps[1]), resolveDep(view, elDef, allowPrivateServices, deps[2]));
          break;
        default:
          var depValues = Array(len);
          for (var i = 0; i < len; i++) {
            depValues[i] = resolveDep(view, elDef, allowPrivateServices, deps[i]);
          }
          injectable = factory.apply(void 0, depValues);
      }
      return injectable;
    }
    var NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR = {};
    function resolveDep(view, elDef, allowPrivateServices, depDef, notFoundValue) {
      if (notFoundValue === void 0) {
        notFoundValue = Injector.THROW_IF_NOT_FOUND;
      }
      if (depDef.flags & 8) {
        return depDef.token;
      }
      var startView = view;
      if (depDef.flags & 2) {
        notFoundValue = null;
      }
      var tokenKey$$1 = depDef.tokenKey;
      if (tokenKey$$1 === ChangeDetectorRefTokenKey) {
        allowPrivateServices = !!(elDef && ((elDef.element)).componentView);
      }
      if (elDef && (depDef.flags & 1)) {
        allowPrivateServices = false;
        elDef = ((elDef.parent));
      }
      while (view) {
        if (elDef) {
          switch (tokenKey$$1) {
            case RendererV1TokenKey:
              {
                var compView = findCompView(view, elDef, allowPrivateServices);
                return createRendererV1(compView);
              }
            case Renderer2TokenKey:
              {
                var compView = findCompView(view, elDef, allowPrivateServices);
                return compView.renderer;
              }
            case ElementRefTokenKey:
              return new ElementRef(asElementData(view, elDef.index).renderElement);
            case ViewContainerRefTokenKey:
              return asElementData(view, elDef.index).viewContainer;
            case TemplateRefTokenKey:
              {
                if (((elDef.element)).template) {
                  return asElementData(view, elDef.index).template;
                }
                break;
              }
            case ChangeDetectorRefTokenKey:
              {
                var cdView = findCompView(view, elDef, allowPrivateServices);
                return createChangeDetectorRef(cdView);
              }
            case InjectorRefTokenKey:
              return createInjector(view, elDef);
            default:
              var providerDef_1 = (((allowPrivateServices ? ((elDef.element)).allProviders : ((elDef.element)).publicProviders)))[tokenKey$$1];
              if (providerDef_1) {
                var providerData = asProviderData(view, providerDef_1.index);
                if (providerData.instance === NOT_CREATED) {
                  providerData.instance = _createProviderInstance(view, providerDef_1);
                }
                return providerData.instance;
              }
          }
        }
        allowPrivateServices = isComponentView(view);
        elDef = ((viewParentEl(view)));
        view = ((view.parent));
      }
      var value = startView.root.injector.get(depDef.token, NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR);
      if (value !== NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR || notFoundValue === NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR) {
        return value;
      }
      return startView.root.ngModule.injector.get(depDef.token, notFoundValue);
    }
    function findCompView(view, elDef, allowPrivateServices) {
      var compView;
      if (allowPrivateServices) {
        compView = asElementData(view, elDef.index).componentView;
      } else {
        compView = view;
        while (compView.parent && !isComponentView(compView)) {
          compView = compView.parent;
        }
      }
      return compView;
    }
    function updateProp(view, providerData, def, bindingIdx, value, changes) {
      if (def.flags & 32768) {
        var compView = asElementData(view, ((def.parent)).index).componentView;
        if (compView.def.flags & 2) {
          compView.state |= 8;
        }
      }
      var binding = def.bindings[bindingIdx];
      var propName = ((binding.name));
      providerData.instance[propName] = value;
      if (def.flags & 524288) {
        changes = changes || {};
        var oldValue = view.oldValues[def.bindingIndex + bindingIdx];
        if (oldValue instanceof WrappedValue) {
          oldValue = oldValue.wrapped;
        }
        var binding_1 = def.bindings[bindingIdx];
        changes[((binding_1.nonMinifiedName))] = new SimpleChange(oldValue, value, (view.state & 2) !== 0);
      }
      view.oldValues[def.bindingIndex + bindingIdx] = value;
      return changes;
    }
    function callLifecycleHooksChildrenFirst(view, lifecycles) {
      if (!(view.def.nodeFlags & lifecycles)) {
        return;
      }
      var nodes = view.def.nodes;
      for (var i = 0; i < nodes.length; i++) {
        var nodeDef = nodes[i];
        var parent = nodeDef.parent;
        if (!parent && nodeDef.flags & lifecycles) {
          callProviderLifecycles(view, i, nodeDef.flags & lifecycles);
        }
        if ((nodeDef.childFlags & lifecycles) === 0) {
          i += nodeDef.childCount;
        }
        while (parent && (parent.flags & 1) && i === parent.index + parent.childCount) {
          if (parent.directChildFlags & lifecycles) {
            callElementProvidersLifecycles(view, parent, lifecycles);
          }
          parent = parent.parent;
        }
      }
    }
    function callElementProvidersLifecycles(view, elDef, lifecycles) {
      for (var i = elDef.index + 1; i <= elDef.index + elDef.childCount; i++) {
        var nodeDef = view.def.nodes[i];
        if (nodeDef.flags & lifecycles) {
          callProviderLifecycles(view, i, nodeDef.flags & lifecycles);
        }
        i += nodeDef.childCount;
      }
    }
    function callProviderLifecycles(view, index, lifecycles) {
      var provider = asProviderData(view, index).instance;
      if (provider === NOT_CREATED) {
        return;
      }
      Services.setCurrentNode(view, index);
      if (lifecycles & 1048576) {
        provider.ngAfterContentInit();
      }
      if (lifecycles & 2097152) {
        provider.ngAfterContentChecked();
      }
      if (lifecycles & 4194304) {
        provider.ngAfterViewInit();
      }
      if (lifecycles & 8388608) {
        provider.ngAfterViewChecked();
      }
      if (lifecycles & 131072) {
        provider.ngOnDestroy();
      }
    }
    function queryDef(flags, id, bindings) {
      var bindingDefs = [];
      for (var propName in bindings) {
        var bindingType = bindings[propName];
        bindingDefs.push({
          propName: propName,
          bindingType: bindingType
        });
      }
      return {
        index: -1,
        parent: null,
        renderParent: null,
        bindingIndex: -1,
        outputIndex: -1,
        flags: flags,
        childFlags: 0,
        directChildFlags: 0,
        childMatchedQueries: 0,
        ngContentIndex: -1,
        matchedQueries: {},
        matchedQueryIds: 0,
        references: {},
        childCount: 0,
        bindings: [],
        bindingFlags: 0,
        outputs: [],
        element: null,
        provider: null,
        text: null,
        query: {
          id: id,
          filterId: filterQueryId(id),
          bindings: bindingDefs
        },
        ngContent: null
      };
    }
    function createQuery() {
      return new QueryList();
    }
    function dirtyParentQueries(view) {
      var queryIds = view.def.nodeMatchedQueries;
      while (view.parent && isEmbeddedView(view)) {
        var tplDef = ((view.parentNodeDef));
        view = view.parent;
        var end = tplDef.index + tplDef.childCount;
        for (var i = 0; i <= end; i++) {
          var nodeDef = view.def.nodes[i];
          if ((nodeDef.flags & 67108864) && (nodeDef.flags & 536870912) && (((nodeDef.query)).filterId & queryIds) === ((nodeDef.query)).filterId) {
            asQueryList(view, i).setDirty();
          }
          if ((nodeDef.flags & 1 && i + nodeDef.childCount < tplDef.index) || !(nodeDef.childFlags & 67108864) || !(nodeDef.childFlags & 536870912)) {
            i += nodeDef.childCount;
          }
        }
      }
      if (view.def.nodeFlags & 134217728) {
        for (var i = 0; i < view.def.nodes.length; i++) {
          var nodeDef = view.def.nodes[i];
          if ((nodeDef.flags & 134217728) && (nodeDef.flags & 536870912)) {
            asQueryList(view, i).setDirty();
          }
          i += nodeDef.childCount;
        }
      }
    }
    function checkAndUpdateQuery(view, nodeDef) {
      var queryList = asQueryList(view, nodeDef.index);
      if (!queryList.dirty) {
        return;
      }
      var directiveInstance;
      var newValues = ((undefined));
      if (nodeDef.flags & 67108864) {
        var elementDef_1 = ((((nodeDef.parent)).parent));
        newValues = calcQueryValues(view, elementDef_1.index, elementDef_1.index + elementDef_1.childCount, ((nodeDef.query)), []);
        directiveInstance = asProviderData(view, ((nodeDef.parent)).index).instance;
      } else if (nodeDef.flags & 134217728) {
        newValues = calcQueryValues(view, 0, view.def.nodes.length - 1, ((nodeDef.query)), []);
        directiveInstance = view.component;
      }
      queryList.reset(newValues);
      var bindings = ((nodeDef.query)).bindings;
      var notify = false;
      for (var i = 0; i < bindings.length; i++) {
        var binding = bindings[i];
        var boundValue = void 0;
        switch (binding.bindingType) {
          case 0:
            boundValue = queryList.first;
            break;
          case 1:
            boundValue = queryList;
            notify = true;
            break;
        }
        directiveInstance[binding.propName] = boundValue;
      }
      if (notify) {
        queryList.notifyOnChanges();
      }
    }
    function calcQueryValues(view, startIndex, endIndex, queryDef, values) {
      for (var i = startIndex; i <= endIndex; i++) {
        var nodeDef = view.def.nodes[i];
        var valueType = nodeDef.matchedQueries[queryDef.id];
        if (valueType != null) {
          values.push(getQueryValue(view, nodeDef, valueType));
        }
        if (nodeDef.flags & 1 && ((nodeDef.element)).template && (((((nodeDef.element)).template)).nodeMatchedQueries & queryDef.filterId) === queryDef.filterId) {
          var elementData = asElementData(view, i);
          if (nodeDef.flags & 16777216) {
            var embeddedViews = ((elementData.viewContainer))._embeddedViews;
            for (var k = 0; k < embeddedViews.length; k++) {
              var embeddedView = embeddedViews[k];
              var dvc = declaredViewContainer(embeddedView);
              if (dvc && dvc === elementData) {
                calcQueryValues(embeddedView, 0, embeddedView.def.nodes.length - 1, queryDef, values);
              }
            }
          }
          var projectedViews = elementData.template._projectedViews;
          if (projectedViews) {
            for (var k = 0; k < projectedViews.length; k++) {
              var projectedView = projectedViews[k];
              calcQueryValues(projectedView, 0, projectedView.def.nodes.length - 1, queryDef, values);
            }
          }
        }
        if ((nodeDef.childMatchedQueries & queryDef.filterId) !== queryDef.filterId) {
          i += nodeDef.childCount;
        }
      }
      return values;
    }
    function getQueryValue(view, nodeDef, queryValueType) {
      if (queryValueType != null) {
        var value = void 0;
        switch (queryValueType) {
          case 1:
            value = asElementData(view, nodeDef.index).renderElement;
            break;
          case 0:
            value = new ElementRef(asElementData(view, nodeDef.index).renderElement);
            break;
          case 2:
            value = asElementData(view, nodeDef.index).template;
            break;
          case 3:
            value = asElementData(view, nodeDef.index).viewContainer;
            break;
          case 4:
            value = asProviderData(view, nodeDef.index).instance;
            break;
        }
        return value;
      }
    }
    function ngContentDef(ngContentIndex, index) {
      return {
        index: -1,
        parent: null,
        renderParent: null,
        bindingIndex: -1,
        outputIndex: -1,
        flags: 8,
        childFlags: 0,
        directChildFlags: 0,
        childMatchedQueries: 0,
        matchedQueries: {},
        matchedQueryIds: 0,
        references: {},
        ngContentIndex: ngContentIndex,
        childCount: 0,
        bindings: [],
        bindingFlags: 0,
        outputs: [],
        element: null,
        provider: null,
        text: null,
        query: null,
        ngContent: {index: index}
      };
    }
    function appendNgContent(view, renderHost, def) {
      var parentEl = getParentRenderElement(view, renderHost, def);
      if (!parentEl) {
        return;
      }
      var ngContentIndex = ((def.ngContent)).index;
      visitProjectedRenderNodes(view, ngContentIndex, 1, parentEl, null, undefined);
    }
    function purePipeDef(argCount) {
      return _pureExpressionDef(128, new Array(argCount + 1));
    }
    function pureArrayDef(argCount) {
      return _pureExpressionDef(32, new Array(argCount));
    }
    function pureObjectDef(propertyNames) {
      return _pureExpressionDef(64, propertyNames);
    }
    function _pureExpressionDef(flags, propertyNames) {
      var bindings = new Array(propertyNames.length);
      for (var i = 0; i < propertyNames.length; i++) {
        var prop = propertyNames[i];
        bindings[i] = {
          flags: 8,
          name: prop,
          ns: null,
          nonMinifiedName: prop,
          securityContext: null,
          suffix: null
        };
      }
      return {
        index: -1,
        parent: null,
        renderParent: null,
        bindingIndex: -1,
        outputIndex: -1,
        flags: flags,
        childFlags: 0,
        directChildFlags: 0,
        childMatchedQueries: 0,
        matchedQueries: {},
        matchedQueryIds: 0,
        references: {},
        ngContentIndex: -1,
        childCount: 0,
        bindings: bindings,
        bindingFlags: calcBindingFlags(bindings),
        outputs: [],
        element: null,
        provider: null,
        text: null,
        query: null,
        ngContent: null
      };
    }
    function createPureExpression(view, def) {
      return {value: undefined};
    }
    function checkAndUpdatePureExpressionInline(view, def, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
      var bindings = def.bindings;
      var changed = false;
      var bindLen = bindings.length;
      if (bindLen > 0 && checkAndUpdateBinding(view, def, 0, v0))
        changed = true;
      if (bindLen > 1 && checkAndUpdateBinding(view, def, 1, v1))
        changed = true;
      if (bindLen > 2 && checkAndUpdateBinding(view, def, 2, v2))
        changed = true;
      if (bindLen > 3 && checkAndUpdateBinding(view, def, 3, v3))
        changed = true;
      if (bindLen > 4 && checkAndUpdateBinding(view, def, 4, v4))
        changed = true;
      if (bindLen > 5 && checkAndUpdateBinding(view, def, 5, v5))
        changed = true;
      if (bindLen > 6 && checkAndUpdateBinding(view, def, 6, v6))
        changed = true;
      if (bindLen > 7 && checkAndUpdateBinding(view, def, 7, v7))
        changed = true;
      if (bindLen > 8 && checkAndUpdateBinding(view, def, 8, v8))
        changed = true;
      if (bindLen > 9 && checkAndUpdateBinding(view, def, 9, v9))
        changed = true;
      if (changed) {
        var data = asPureExpressionData(view, def.index);
        var value = void 0;
        switch (def.flags & 201347067) {
          case 32:
            value = new Array(bindings.length);
            if (bindLen > 0)
              value[0] = v0;
            if (bindLen > 1)
              value[1] = v1;
            if (bindLen > 2)
              value[2] = v2;
            if (bindLen > 3)
              value[3] = v3;
            if (bindLen > 4)
              value[4] = v4;
            if (bindLen > 5)
              value[5] = v5;
            if (bindLen > 6)
              value[6] = v6;
            if (bindLen > 7)
              value[7] = v7;
            if (bindLen > 8)
              value[8] = v8;
            if (bindLen > 9)
              value[9] = v9;
            break;
          case 64:
            value = {};
            if (bindLen > 0)
              value[((bindings[0].name))] = v0;
            if (bindLen > 1)
              value[((bindings[1].name))] = v1;
            if (bindLen > 2)
              value[((bindings[2].name))] = v2;
            if (bindLen > 3)
              value[((bindings[3].name))] = v3;
            if (bindLen > 4)
              value[((bindings[4].name))] = v4;
            if (bindLen > 5)
              value[((bindings[5].name))] = v5;
            if (bindLen > 6)
              value[((bindings[6].name))] = v6;
            if (bindLen > 7)
              value[((bindings[7].name))] = v7;
            if (bindLen > 8)
              value[((bindings[8].name))] = v8;
            if (bindLen > 9)
              value[((bindings[9].name))] = v9;
            break;
          case 128:
            var pipe = v0;
            switch (bindLen) {
              case 1:
                value = pipe.transform(v0);
                break;
              case 2:
                value = pipe.transform(v1);
                break;
              case 3:
                value = pipe.transform(v1, v2);
                break;
              case 4:
                value = pipe.transform(v1, v2, v3);
                break;
              case 5:
                value = pipe.transform(v1, v2, v3, v4);
                break;
              case 6:
                value = pipe.transform(v1, v2, v3, v4, v5);
                break;
              case 7:
                value = pipe.transform(v1, v2, v3, v4, v5, v6);
                break;
              case 8:
                value = pipe.transform(v1, v2, v3, v4, v5, v6, v7);
                break;
              case 9:
                value = pipe.transform(v1, v2, v3, v4, v5, v6, v7, v8);
                break;
              case 10:
                value = pipe.transform(v1, v2, v3, v4, v5, v6, v7, v8, v9);
                break;
            }
            break;
        }
        data.value = value;
      }
      return changed;
    }
    function checkAndUpdatePureExpressionDynamic(view, def, values) {
      var bindings = def.bindings;
      var changed = false;
      for (var i = 0; i < values.length; i++) {
        if (checkAndUpdateBinding(view, def, i, values[i])) {
          changed = true;
        }
      }
      if (changed) {
        var data = asPureExpressionData(view, def.index);
        var value = void 0;
        switch (def.flags & 201347067) {
          case 32:
            value = values;
            break;
          case 64:
            value = {};
            for (var i = 0; i < values.length; i++) {
              value[((bindings[i].name))] = values[i];
            }
            break;
          case 128:
            var pipe = values[0];
            var params = values.slice(1);
            value = pipe.transform.apply(pipe, params);
            break;
        }
        data.value = value;
      }
      return changed;
    }
    function textDef(ngContentIndex, constants) {
      var bindings = new Array(constants.length - 1);
      for (var i = 1; i < constants.length; i++) {
        bindings[i - 1] = {
          flags: 8,
          name: null,
          ns: null,
          nonMinifiedName: null,
          securityContext: null,
          suffix: constants[i]
        };
      }
      var flags = 2;
      return {
        index: -1,
        parent: null,
        renderParent: null,
        bindingIndex: -1,
        outputIndex: -1,
        flags: flags,
        childFlags: 0,
        directChildFlags: 0,
        childMatchedQueries: 0,
        matchedQueries: {},
        matchedQueryIds: 0,
        references: {},
        ngContentIndex: ngContentIndex,
        childCount: 0,
        bindings: bindings,
        bindingFlags: calcBindingFlags(bindings),
        outputs: [],
        element: null,
        provider: null,
        text: {prefix: constants[0]},
        query: null,
        ngContent: null
      };
    }
    function createText(view, renderHost, def) {
      var renderNode$$1;
      var renderer = view.renderer;
      renderNode$$1 = renderer.createText(((def.text)).prefix);
      var parentEl = getParentRenderElement(view, renderHost, def);
      if (parentEl) {
        renderer.appendChild(parentEl, renderNode$$1);
      }
      return {renderText: renderNode$$1};
    }
    function checkAndUpdateTextInline(view, def, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
      var changed = false;
      var bindings = def.bindings;
      var bindLen = bindings.length;
      if (bindLen > 0 && checkAndUpdateBinding(view, def, 0, v0))
        changed = true;
      if (bindLen > 1 && checkAndUpdateBinding(view, def, 1, v1))
        changed = true;
      if (bindLen > 2 && checkAndUpdateBinding(view, def, 2, v2))
        changed = true;
      if (bindLen > 3 && checkAndUpdateBinding(view, def, 3, v3))
        changed = true;
      if (bindLen > 4 && checkAndUpdateBinding(view, def, 4, v4))
        changed = true;
      if (bindLen > 5 && checkAndUpdateBinding(view, def, 5, v5))
        changed = true;
      if (bindLen > 6 && checkAndUpdateBinding(view, def, 6, v6))
        changed = true;
      if (bindLen > 7 && checkAndUpdateBinding(view, def, 7, v7))
        changed = true;
      if (bindLen > 8 && checkAndUpdateBinding(view, def, 8, v8))
        changed = true;
      if (bindLen > 9 && checkAndUpdateBinding(view, def, 9, v9))
        changed = true;
      if (changed) {
        var value = ((def.text)).prefix;
        if (bindLen > 0)
          value += _addInterpolationPart(v0, bindings[0]);
        if (bindLen > 1)
          value += _addInterpolationPart(v1, bindings[1]);
        if (bindLen > 2)
          value += _addInterpolationPart(v2, bindings[2]);
        if (bindLen > 3)
          value += _addInterpolationPart(v3, bindings[3]);
        if (bindLen > 4)
          value += _addInterpolationPart(v4, bindings[4]);
        if (bindLen > 5)
          value += _addInterpolationPart(v5, bindings[5]);
        if (bindLen > 6)
          value += _addInterpolationPart(v6, bindings[6]);
        if (bindLen > 7)
          value += _addInterpolationPart(v7, bindings[7]);
        if (bindLen > 8)
          value += _addInterpolationPart(v8, bindings[8]);
        if (bindLen > 9)
          value += _addInterpolationPart(v9, bindings[9]);
        var renderNode$$1 = asTextData(view, def.index).renderText;
        view.renderer.setValue(renderNode$$1, value);
      }
      return changed;
    }
    function checkAndUpdateTextDynamic(view, def, values) {
      var bindings = def.bindings;
      var changed = false;
      for (var i = 0; i < values.length; i++) {
        if (checkAndUpdateBinding(view, def, i, values[i])) {
          changed = true;
        }
      }
      if (changed) {
        var value = '';
        for (var i = 0; i < values.length; i++) {
          value = value + _addInterpolationPart(values[i], bindings[i]);
        }
        value = ((def.text)).prefix + value;
        var renderNode$$1 = asTextData(view, def.index).renderText;
        view.renderer.setValue(renderNode$$1, value);
      }
      return changed;
    }
    function _addInterpolationPart(value, binding) {
      var valueStr = value != null ? value.toString() : '';
      return valueStr + binding.suffix;
    }
    function viewDef(flags, nodes, updateDirectives, updateRenderer) {
      var viewBindingCount = 0;
      var viewDisposableCount = 0;
      var viewNodeFlags = 0;
      var viewRootNodeFlags = 0;
      var viewMatchedQueries = 0;
      var currentParent = null;
      var currentElementHasPublicProviders = false;
      var currentElementHasPrivateProviders = false;
      var lastRenderRootNode = null;
      for (var i = 0; i < nodes.length; i++) {
        while (currentParent && i > currentParent.index + currentParent.childCount) {
          var newParent = currentParent.parent;
          if (newParent) {
            newParent.childFlags |= ((currentParent.childFlags));
            newParent.childMatchedQueries |= currentParent.childMatchedQueries;
          }
          currentParent = newParent;
        }
        var node = nodes[i];
        node.index = i;
        node.parent = currentParent;
        node.bindingIndex = viewBindingCount;
        node.outputIndex = viewDisposableCount;
        var currentRenderParent = void 0;
        if (currentParent && currentParent.flags & 1 && !((currentParent.element)).name) {
          currentRenderParent = currentParent.renderParent;
        } else {
          currentRenderParent = currentParent;
        }
        node.renderParent = currentRenderParent;
        if (node.element) {
          var elDef = node.element;
          elDef.publicProviders = currentParent ? ((currentParent.element)).publicProviders : Object.create(null);
          elDef.allProviders = elDef.publicProviders;
          currentElementHasPublicProviders = false;
          currentElementHasPrivateProviders = false;
        }
        validateNode(currentParent, node, nodes.length);
        viewNodeFlags |= node.flags;
        viewMatchedQueries |= node.matchedQueryIds;
        if (node.element && node.element.template) {
          viewMatchedQueries |= node.element.template.nodeMatchedQueries;
        }
        if (currentParent) {
          currentParent.childFlags |= node.flags;
          currentParent.directChildFlags |= node.flags;
          currentParent.childMatchedQueries |= node.matchedQueryIds;
          if (node.element && node.element.template) {
            currentParent.childMatchedQueries |= node.element.template.nodeMatchedQueries;
          }
        } else {
          viewRootNodeFlags |= node.flags;
        }
        viewBindingCount += node.bindings.length;
        viewDisposableCount += node.outputs.length;
        if (!currentRenderParent && (node.flags & 3)) {
          lastRenderRootNode = node;
        }
        if (node.flags & 20224) {
          if (!currentElementHasPublicProviders) {
            currentElementHasPublicProviders = true;
            ((((currentParent)).element)).publicProviders = Object.create(((((currentParent)).element)).publicProviders);
            ((((currentParent)).element)).allProviders = ((((currentParent)).element)).publicProviders;
          }
          var isPrivateService = (node.flags & 8192) !== 0;
          var isComponent = (node.flags & 32768) !== 0;
          if (!isPrivateService || isComponent) {
            ((((((currentParent)).element)).publicProviders))[tokenKey(((node.provider)).token)] = node;
          } else {
            if (!currentElementHasPrivateProviders) {
              currentElementHasPrivateProviders = true;
              ((((currentParent)).element)).allProviders = Object.create(((((currentParent)).element)).publicProviders);
            }
            ((((((currentParent)).element)).allProviders))[tokenKey(((node.provider)).token)] = node;
          }
          if (isComponent) {
            ((((currentParent)).element)).componentProvider = node;
          }
        }
        if (node.childCount) {
          currentParent = node;
        }
      }
      while (currentParent) {
        var newParent = currentParent.parent;
        if (newParent) {
          newParent.childFlags |= currentParent.childFlags;
          newParent.childMatchedQueries |= currentParent.childMatchedQueries;
        }
        currentParent = newParent;
      }
      var handleEvent = function(view, nodeIndex, eventName, event) {
        return ((((nodes[nodeIndex].element)).handleEvent))(view, eventName, event);
      };
      return {
        factory: null,
        nodeFlags: viewNodeFlags,
        rootNodeFlags: viewRootNodeFlags,
        nodeMatchedQueries: viewMatchedQueries,
        flags: flags,
        nodes: nodes,
        updateDirectives: updateDirectives || NOOP,
        updateRenderer: updateRenderer || NOOP,
        handleEvent: handleEvent || NOOP,
        bindingCount: viewBindingCount,
        outputCount: viewDisposableCount,
        lastRenderRootNode: lastRenderRootNode
      };
    }
    function validateNode(parent, node, nodeCount) {
      var template = node.element && node.element.template;
      if (template) {
        if (!template.lastRenderRootNode) {
          throw new Error("Illegal State: Embedded templates without nodes are not allowed!");
        }
        if (template.lastRenderRootNode && template.lastRenderRootNode.flags & 16777216) {
          throw new Error("Illegal State: Last root node of a template can't have embedded views, at index " + node.index + "!");
        }
      }
      if (node.flags & 20224) {
        var parentFlags = parent ? parent.flags : 0;
        if ((parentFlags & 1) === 0) {
          throw new Error("Illegal State: Provider/Directive nodes need to be children of elements or anchors, at index " + node.index + "!");
        }
      }
      if (node.query) {
        if (node.flags & 67108864 && (!parent || (parent.flags & 16384) === 0)) {
          throw new Error("Illegal State: Content Query nodes need to be children of directives, at index " + node.index + "!");
        }
        if (node.flags & 134217728 && parent) {
          throw new Error("Illegal State: View Query nodes have to be top level nodes, at index " + node.index + "!");
        }
      }
      if (node.childCount) {
        var parentEnd = parent ? parent.index + parent.childCount : nodeCount - 1;
        if (node.index <= parentEnd && node.index + node.childCount > parentEnd) {
          throw new Error("Illegal State: childCount of node leads outside of parent, at index " + node.index + "!");
        }
      }
    }
    function createEmbeddedView(parent, anchorDef$$1, viewDef, context) {
      var view = createView(parent.root, parent.renderer, parent, anchorDef$$1, viewDef);
      initView(view, parent.component, context);
      createViewNodes(view);
      return view;
    }
    function createRootView(root, def, context) {
      var view = createView(root, root.renderer, null, null, def);
      initView(view, context, context);
      createViewNodes(view);
      return view;
    }
    function createComponentView(parentView, nodeDef, viewDef, hostElement) {
      var rendererType = ((nodeDef.element)).componentRendererType;
      var compRenderer;
      if (!rendererType) {
        compRenderer = parentView.root.renderer;
      } else {
        compRenderer = parentView.root.rendererFactory.createRenderer(hostElement, rendererType);
      }
      return createView(parentView.root, compRenderer, parentView, ((nodeDef.element)).componentProvider, viewDef);
    }
    function createView(root, renderer, parent, parentNodeDef, def) {
      var nodes = new Array(def.nodes.length);
      var disposables = def.outputCount ? new Array(def.outputCount) : null;
      var view = {
        def: def,
        parent: parent,
        viewContainerParent: null,
        parentNodeDef: parentNodeDef,
        context: null,
        component: null,
        nodes: nodes,
        state: 13,
        root: root,
        renderer: renderer,
        oldValues: new Array(def.bindingCount),
        disposables: disposables
      };
      return view;
    }
    function initView(view, component, context) {
      view.component = component;
      view.context = context;
    }
    function createViewNodes(view) {
      var renderHost;
      if (isComponentView(view)) {
        var hostDef = view.parentNodeDef;
        renderHost = asElementData(((view.parent)), ((((hostDef)).parent)).index).renderElement;
      }
      var def = view.def;
      var nodes = view.nodes;
      for (var i = 0; i < def.nodes.length; i++) {
        var nodeDef = def.nodes[i];
        Services.setCurrentNode(view, i);
        var nodeData = void 0;
        switch (nodeDef.flags & 201347067) {
          case 1:
            var el = (createElement(view, renderHost, nodeDef));
            var componentView = ((undefined));
            if (nodeDef.flags & 33554432) {
              var compViewDef = resolveDefinition(((((nodeDef.element)).componentView)));
              componentView = Services.createComponentView(view, nodeDef, compViewDef, el);
            }
            listenToElementOutputs(view, componentView, nodeDef, el);
            nodeData = ({
              renderElement: el,
              componentView: componentView,
              viewContainer: null,
              template: ((nodeDef.element)).template ? createTemplateData(view, nodeDef) : undefined
            });
            if (nodeDef.flags & 16777216) {
              nodeData.viewContainer = createViewContainerData(view, nodeDef, nodeData);
            }
            break;
          case 2:
            nodeData = (createText(view, renderHost, nodeDef));
            break;
          case 512:
          case 1024:
          case 2048:
          case 256:
            {
              var instance = createProviderInstance(view, nodeDef);
              nodeData = ({instance: instance});
              break;
            }
          case 16:
            {
              var instance = createPipeInstance(view, nodeDef);
              nodeData = ({instance: instance});
              break;
            }
          case 16384:
            {
              var instance = createDirectiveInstance(view, nodeDef);
              nodeData = ({instance: instance});
              if (nodeDef.flags & 32768) {
                var compView = asElementData(view, ((nodeDef.parent)).index).componentView;
                initView(compView, instance, instance);
              }
              break;
            }
          case 32:
          case 64:
          case 128:
            nodeData = (createPureExpression(view, nodeDef));
            break;
          case 67108864:
          case 134217728:
            nodeData = (createQuery());
            break;
          case 8:
            appendNgContent(view, renderHost, nodeDef);
            nodeData = undefined;
            break;
        }
        nodes[i] = nodeData;
      }
      execComponentViewsAction(view, ViewAction.CreateViewNodes);
      execQueriesAction(view, 67108864 | 134217728, 268435456, 0);
    }
    function checkNoChangesView(view) {
      markProjectedViewsForCheck(view);
      Services.updateDirectives(view, 1);
      execEmbeddedViewsAction(view, ViewAction.CheckNoChanges);
      Services.updateRenderer(view, 1);
      execComponentViewsAction(view, ViewAction.CheckNoChanges);
      view.state &= ~(64 | 32);
    }
    function checkAndUpdateView(view) {
      if (view.state & 1) {
        view.state &= ~1;
        view.state |= 2;
      } else {
        view.state &= ~2;
      }
      markProjectedViewsForCheck(view);
      Services.updateDirectives(view, 0);
      execEmbeddedViewsAction(view, ViewAction.CheckAndUpdate);
      execQueriesAction(view, 67108864, 536870912, 0);
      callLifecycleHooksChildrenFirst(view, 2097152 | (view.state & 2 ? 1048576 : 0));
      Services.updateRenderer(view, 0);
      execComponentViewsAction(view, ViewAction.CheckAndUpdate);
      execQueriesAction(view, 134217728, 536870912, 0);
      callLifecycleHooksChildrenFirst(view, 8388608 | (view.state & 2 ? 4194304 : 0));
      if (view.def.flags & 2) {
        view.state &= ~8;
      }
      view.state &= ~(64 | 32);
    }
    function checkAndUpdateNode(view, nodeDef, argStyle, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
      if (argStyle === 0) {
        return checkAndUpdateNodeInline(view, nodeDef, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9);
      } else {
        return checkAndUpdateNodeDynamic(view, nodeDef, v0);
      }
    }
    function markProjectedViewsForCheck(view) {
      var def = view.def;
      if (!(def.nodeFlags & 4)) {
        return;
      }
      for (var i = 0; i < def.nodes.length; i++) {
        var nodeDef = def.nodes[i];
        if (nodeDef.flags & 4) {
          var projectedViews = asElementData(view, i).template._projectedViews;
          if (projectedViews) {
            for (var i_1 = 0; i_1 < projectedViews.length; i_1++) {
              var projectedView = projectedViews[i_1];
              projectedView.state |= 32;
              markParentViewsForCheckProjectedViews(projectedView, view);
            }
          }
        } else if ((nodeDef.childFlags & 4) === 0) {
          i += nodeDef.childCount;
        }
      }
    }
    function checkAndUpdateNodeInline(view, nodeDef, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
      var changed = false;
      switch (nodeDef.flags & 201347067) {
        case 1:
          changed = checkAndUpdateElementInline(view, nodeDef, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9);
          break;
        case 2:
          changed = checkAndUpdateTextInline(view, nodeDef, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9);
          break;
        case 16384:
          changed = checkAndUpdateDirectiveInline(view, nodeDef, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9);
          break;
        case 32:
        case 64:
        case 128:
          changed = checkAndUpdatePureExpressionInline(view, nodeDef, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9);
          break;
      }
      return changed;
    }
    function checkAndUpdateNodeDynamic(view, nodeDef, values) {
      var changed = false;
      switch (nodeDef.flags & 201347067) {
        case 1:
          changed = checkAndUpdateElementDynamic(view, nodeDef, values);
          break;
        case 2:
          changed = checkAndUpdateTextDynamic(view, nodeDef, values);
          break;
        case 16384:
          changed = checkAndUpdateDirectiveDynamic(view, nodeDef, values);
          break;
        case 32:
        case 64:
        case 128:
          changed = checkAndUpdatePureExpressionDynamic(view, nodeDef, values);
          break;
      }
      if (changed) {
        var bindLen = nodeDef.bindings.length;
        var bindingStart = nodeDef.bindingIndex;
        var oldValues = view.oldValues;
        for (var i = 0; i < bindLen; i++) {
          oldValues[bindingStart + i] = values[i];
        }
      }
      return changed;
    }
    function checkNoChangesNode(view, nodeDef, argStyle, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
      if (argStyle === 0) {
        checkNoChangesNodeInline(view, nodeDef, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9);
      } else {
        checkNoChangesNodeDynamic(view, nodeDef, v0);
      }
      return false;
    }
    function checkNoChangesNodeInline(view, nodeDef, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
      var bindLen = nodeDef.bindings.length;
      if (bindLen > 0)
        checkBindingNoChanges(view, nodeDef, 0, v0);
      if (bindLen > 1)
        checkBindingNoChanges(view, nodeDef, 1, v1);
      if (bindLen > 2)
        checkBindingNoChanges(view, nodeDef, 2, v2);
      if (bindLen > 3)
        checkBindingNoChanges(view, nodeDef, 3, v3);
      if (bindLen > 4)
        checkBindingNoChanges(view, nodeDef, 4, v4);
      if (bindLen > 5)
        checkBindingNoChanges(view, nodeDef, 5, v5);
      if (bindLen > 6)
        checkBindingNoChanges(view, nodeDef, 6, v6);
      if (bindLen > 7)
        checkBindingNoChanges(view, nodeDef, 7, v7);
      if (bindLen > 8)
        checkBindingNoChanges(view, nodeDef, 8, v8);
      if (bindLen > 9)
        checkBindingNoChanges(view, nodeDef, 9, v9);
    }
    function checkNoChangesNodeDynamic(view, nodeDef, values) {
      for (var i = 0; i < values.length; i++) {
        checkBindingNoChanges(view, nodeDef, i, values[i]);
      }
    }
    function checkNoChangesQuery(view, nodeDef) {
      var queryList = asQueryList(view, nodeDef.index);
      if (queryList.dirty) {
        throw expressionChangedAfterItHasBeenCheckedError(Services.createDebugContext(view, nodeDef.index), "Query " + ((nodeDef.query)).id + " not dirty", "Query " + ((nodeDef.query)).id + " dirty", (view.state & 1) !== 0);
      }
    }
    function destroyView(view) {
      if (view.state & 128) {
        return;
      }
      execEmbeddedViewsAction(view, ViewAction.Destroy);
      execComponentViewsAction(view, ViewAction.Destroy);
      callLifecycleHooksChildrenFirst(view, 131072);
      if (view.disposables) {
        for (var i = 0; i < view.disposables.length; i++) {
          view.disposables[i]();
        }
      }
      detachProjectedView(view);
      if (view.renderer.destroyNode) {
        destroyViewNodes(view);
      }
      if (isComponentView(view)) {
        view.renderer.destroy();
      }
      view.state |= 128;
    }
    function destroyViewNodes(view) {
      var len = view.def.nodes.length;
      for (var i = 0; i < len; i++) {
        var def = view.def.nodes[i];
        if (def.flags & 1) {
          ((view.renderer.destroyNode))(asElementData(view, i).renderElement);
        } else if (def.flags & 2) {
          ((view.renderer.destroyNode))(asTextData(view, i).renderText);
        }
      }
    }
    var ViewAction = {};
    ViewAction.CreateViewNodes = 0;
    ViewAction.CheckNoChanges = 1;
    ViewAction.CheckNoChangesProjectedViews = 2;
    ViewAction.CheckAndUpdate = 3;
    ViewAction.CheckAndUpdateProjectedViews = 4;
    ViewAction.Destroy = 5;
    ViewAction[ViewAction.CreateViewNodes] = "CreateViewNodes";
    ViewAction[ViewAction.CheckNoChanges] = "CheckNoChanges";
    ViewAction[ViewAction.CheckNoChangesProjectedViews] = "CheckNoChangesProjectedViews";
    ViewAction[ViewAction.CheckAndUpdate] = "CheckAndUpdate";
    ViewAction[ViewAction.CheckAndUpdateProjectedViews] = "CheckAndUpdateProjectedViews";
    ViewAction[ViewAction.Destroy] = "Destroy";
    function execComponentViewsAction(view, action) {
      var def = view.def;
      if (!(def.nodeFlags & 33554432)) {
        return;
      }
      for (var i = 0; i < def.nodes.length; i++) {
        var nodeDef = def.nodes[i];
        if (nodeDef.flags & 33554432) {
          callViewAction(asElementData(view, i).componentView, action);
        } else if ((nodeDef.childFlags & 33554432) === 0) {
          i += nodeDef.childCount;
        }
      }
    }
    function execEmbeddedViewsAction(view, action) {
      var def = view.def;
      if (!(def.nodeFlags & 16777216)) {
        return;
      }
      for (var i = 0; i < def.nodes.length; i++) {
        var nodeDef = def.nodes[i];
        if (nodeDef.flags & 16777216) {
          var embeddedViews = ((asElementData(view, i).viewContainer))._embeddedViews;
          for (var k = 0; k < embeddedViews.length; k++) {
            callViewAction(embeddedViews[k], action);
          }
        } else if ((nodeDef.childFlags & 16777216) === 0) {
          i += nodeDef.childCount;
        }
      }
    }
    function callViewAction(view, action) {
      var viewState = view.state;
      switch (action) {
        case ViewAction.CheckNoChanges:
          if ((viewState & 128) === 0) {
            if ((viewState & 12) === 12) {
              checkNoChangesView(view);
            } else if (viewState & 64) {
              execProjectedViewsAction(view, ViewAction.CheckNoChangesProjectedViews);
            }
          }
          break;
        case ViewAction.CheckNoChangesProjectedViews:
          if ((viewState & 128) === 0) {
            if (viewState & 32) {
              checkNoChangesView(view);
            } else if (viewState & 64) {
              execProjectedViewsAction(view, action);
            }
          }
          break;
        case ViewAction.CheckAndUpdate:
          if ((viewState & 128) === 0) {
            if ((viewState & 12) === 12) {
              checkAndUpdateView(view);
            } else if (viewState & 64) {
              execProjectedViewsAction(view, ViewAction.CheckAndUpdateProjectedViews);
            }
          }
          break;
        case ViewAction.CheckAndUpdateProjectedViews:
          if ((viewState & 128) === 0) {
            if (viewState & 32) {
              checkAndUpdateView(view);
            } else if (viewState & 64) {
              execProjectedViewsAction(view, action);
            }
          }
          break;
        case ViewAction.Destroy:
          destroyView(view);
          break;
        case ViewAction.CreateViewNodes:
          createViewNodes(view);
          break;
      }
    }
    function execProjectedViewsAction(view, action) {
      execEmbeddedViewsAction(view, action);
      execComponentViewsAction(view, action);
    }
    function execQueriesAction(view, queryFlags, staticDynamicQueryFlag, checkType) {
      if (!(view.def.nodeFlags & queryFlags) || !(view.def.nodeFlags & staticDynamicQueryFlag)) {
        return;
      }
      var nodeCount = view.def.nodes.length;
      for (var i = 0; i < nodeCount; i++) {
        var nodeDef = view.def.nodes[i];
        if ((nodeDef.flags & queryFlags) && (nodeDef.flags & staticDynamicQueryFlag)) {
          Services.setCurrentNode(view, nodeDef.index);
          switch (checkType) {
            case 0:
              checkAndUpdateQuery(view, nodeDef);
              break;
            case 1:
              checkNoChangesQuery(view, nodeDef);
              break;
          }
        }
        if (!(nodeDef.childFlags & queryFlags) || !(nodeDef.childFlags & staticDynamicQueryFlag)) {
          i += nodeDef.childCount;
        }
      }
    }
    var initialized = false;
    function initServicesIfNeeded() {
      if (initialized) {
        return;
      }
      initialized = true;
      var services = isDevMode() ? createDebugServices() : createProdServices();
      Services.setCurrentNode = services.setCurrentNode;
      Services.createRootView = services.createRootView;
      Services.createEmbeddedView = services.createEmbeddedView;
      Services.createComponentView = services.createComponentView;
      Services.createNgModuleRef = services.createNgModuleRef;
      Services.overrideProvider = services.overrideProvider;
      Services.clearProviderOverrides = services.clearProviderOverrides;
      Services.checkAndUpdateView = services.checkAndUpdateView;
      Services.checkNoChangesView = services.checkNoChangesView;
      Services.destroyView = services.destroyView;
      Services.resolveDep = resolveDep;
      Services.createDebugContext = services.createDebugContext;
      Services.handleEvent = services.handleEvent;
      Services.updateDirectives = services.updateDirectives;
      Services.updateRenderer = services.updateRenderer;
      Services.dirtyParentQueries = dirtyParentQueries;
    }
    function createProdServices() {
      return {
        setCurrentNode: function() {},
        createRootView: createProdRootView,
        createEmbeddedView: createEmbeddedView,
        createComponentView: createComponentView,
        createNgModuleRef: createNgModuleRef,
        overrideProvider: NOOP,
        clearProviderOverrides: NOOP,
        checkAndUpdateView: checkAndUpdateView,
        checkNoChangesView: checkNoChangesView,
        destroyView: destroyView,
        createDebugContext: function(view, nodeIndex) {
          return new DebugContext_(view, nodeIndex);
        },
        handleEvent: function(view, nodeIndex, eventName, event) {
          return view.def.handleEvent(view, nodeIndex, eventName, event);
        },
        updateDirectives: function(view, checkType) {
          return view.def.updateDirectives(checkType === 0 ? prodCheckAndUpdateNode : prodCheckNoChangesNode, view);
        },
        updateRenderer: function(view, checkType) {
          return view.def.updateRenderer(checkType === 0 ? prodCheckAndUpdateNode : prodCheckNoChangesNode, view);
        }
      };
    }
    function createDebugServices() {
      return {
        setCurrentNode: debugSetCurrentNode,
        createRootView: debugCreateRootView,
        createEmbeddedView: debugCreateEmbeddedView,
        createComponentView: debugCreateComponentView,
        createNgModuleRef: debugCreateNgModuleRef,
        overrideProvider: debugOverrideProvider,
        clearProviderOverrides: debugClearProviderOverrides,
        checkAndUpdateView: debugCheckAndUpdateView,
        checkNoChangesView: debugCheckNoChangesView,
        destroyView: debugDestroyView,
        createDebugContext: function(view, nodeIndex) {
          return new DebugContext_(view, nodeIndex);
        },
        handleEvent: debugHandleEvent,
        updateDirectives: debugUpdateDirectives,
        updateRenderer: debugUpdateRenderer
      };
    }
    function createProdRootView(elInjector, projectableNodes, rootSelectorOrNode, def, ngModule, context) {
      var rendererFactory = ngModule.injector.get(RendererFactory2);
      return createRootView(createRootData(elInjector, ngModule, rendererFactory, projectableNodes, rootSelectorOrNode), def, context);
    }
    function debugCreateRootView(elInjector, projectableNodes, rootSelectorOrNode, def, ngModule, context) {
      var rendererFactory = ngModule.injector.get(RendererFactory2);
      var root = createRootData(elInjector, ngModule, new DebugRendererFactory2(rendererFactory), projectableNodes, rootSelectorOrNode);
      var defWithOverride = applyProviderOverridesToView(def);
      return callWithDebugContext(DebugAction.create, createRootView, null, [root, defWithOverride, context]);
    }
    function createRootData(elInjector, ngModule, rendererFactory, projectableNodes, rootSelectorOrNode) {
      var sanitizer = ngModule.injector.get(Sanitizer);
      var errorHandler = ngModule.injector.get(ErrorHandler);
      var renderer = rendererFactory.createRenderer(null, null);
      return {
        ngModule: ngModule,
        injector: elInjector,
        projectableNodes: projectableNodes,
        selectorOrNode: rootSelectorOrNode,
        sanitizer: sanitizer,
        rendererFactory: rendererFactory,
        renderer: renderer,
        errorHandler: errorHandler
      };
    }
    function debugCreateEmbeddedView(parentView, anchorDef, viewDef$$1, context) {
      var defWithOverride = applyProviderOverridesToView(viewDef$$1);
      return callWithDebugContext(DebugAction.create, createEmbeddedView, null, [parentView, anchorDef, defWithOverride, context]);
    }
    function debugCreateComponentView(parentView, nodeDef, viewDef$$1, hostElement) {
      var defWithOverride = applyProviderOverridesToView(viewDef$$1);
      return callWithDebugContext(DebugAction.create, createComponentView, null, [parentView, nodeDef, defWithOverride, hostElement]);
    }
    function debugCreateNgModuleRef(moduleType, parentInjector, bootstrapComponents, def) {
      var defWithOverride = applyProviderOverridesToNgModule(def);
      return createNgModuleRef(moduleType, parentInjector, bootstrapComponents, defWithOverride);
    }
    var providerOverrides = new Map();
    function debugOverrideProvider(override) {
      providerOverrides.set(override.token, override);
    }
    function debugClearProviderOverrides() {
      providerOverrides.clear();
    }
    function applyProviderOverridesToView(def) {
      if (providerOverrides.size === 0) {
        return def;
      }
      var elementIndicesWithOverwrittenProviders = findElementIndicesWithOverwrittenProviders(def);
      if (elementIndicesWithOverwrittenProviders.length === 0) {
        return def;
      }
      def = ((def.factory))(function() {
        return NOOP;
      });
      for (var i = 0; i < elementIndicesWithOverwrittenProviders.length; i++) {
        applyProviderOverridesToElement(def, elementIndicesWithOverwrittenProviders[i]);
      }
      return def;
      function findElementIndicesWithOverwrittenProviders(def) {
        var elIndicesWithOverwrittenProviders = [];
        var lastElementDef = null;
        for (var i = 0; i < def.nodes.length; i++) {
          var nodeDef = def.nodes[i];
          if (nodeDef.flags & 1) {
            lastElementDef = nodeDef;
          }
          if (lastElementDef && nodeDef.flags & 3840 && providerOverrides.has(((nodeDef.provider)).token)) {
            elIndicesWithOverwrittenProviders.push(((lastElementDef)).index);
            lastElementDef = null;
          }
        }
        return elIndicesWithOverwrittenProviders;
      }
      function applyProviderOverridesToElement(viewDef$$1, elIndex) {
        for (var i = elIndex + 1; i < viewDef$$1.nodes.length; i++) {
          var nodeDef = viewDef$$1.nodes[i];
          if (nodeDef.flags & 1) {
            return;
          }
          if (nodeDef.flags & 3840) {
            nodeDef.flags |= 4096;
            var provider = ((nodeDef.provider));
            var override = providerOverrides.get(provider.token);
            if (override) {
              nodeDef.flags = (nodeDef.flags & ~3840) | override.flags;
              provider.deps = splitDepsDsl(override.deps);
              provider.value = override.value;
            }
          }
        }
      }
    }
    function applyProviderOverridesToNgModule(def) {
      if (providerOverrides.size === 0 || !hasOverrrides(def)) {
        return def;
      }
      def = ((def.factory))(function() {
        return NOOP;
      });
      applyProviderOverrides(def);
      return def;
      function hasOverrrides(def) {
        return def.providers.some(function(node) {
          return !!(node.flags & 3840) && providerOverrides.has(node.token);
        });
      }
      function applyProviderOverrides(def) {
        for (var i = 0; i < def.providers.length; i++) {
          var provider = def.providers[i];
          provider.flags |= 4096;
          var override = providerOverrides.get(provider.token);
          if (override) {
            provider.flags = (provider.flags & ~3840) | override.flags;
            provider.deps = splitDepsDsl(override.deps);
            provider.value = override.value;
          }
        }
      }
    }
    function prodCheckAndUpdateNode(view, nodeIndex, argStyle, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
      var nodeDef = view.def.nodes[nodeIndex];
      checkAndUpdateNode(view, nodeDef, argStyle, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9);
      return (nodeDef.flags & 224) ? asPureExpressionData(view, nodeIndex).value : undefined;
    }
    function prodCheckNoChangesNode(view, nodeIndex, argStyle, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
      var nodeDef = view.def.nodes[nodeIndex];
      checkNoChangesNode(view, nodeDef, argStyle, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9);
      return (nodeDef.flags & 224) ? asPureExpressionData(view, nodeIndex).value : undefined;
    }
    function debugCheckAndUpdateView(view) {
      return callWithDebugContext(DebugAction.detectChanges, checkAndUpdateView, null, [view]);
    }
    function debugCheckNoChangesView(view) {
      return callWithDebugContext(DebugAction.checkNoChanges, checkNoChangesView, null, [view]);
    }
    function debugDestroyView(view) {
      return callWithDebugContext(DebugAction.destroy, destroyView, null, [view]);
    }
    var DebugAction = {};
    DebugAction.create = 0;
    DebugAction.detectChanges = 1;
    DebugAction.checkNoChanges = 2;
    DebugAction.destroy = 3;
    DebugAction.handleEvent = 4;
    DebugAction[DebugAction.create] = "create";
    DebugAction[DebugAction.detectChanges] = "detectChanges";
    DebugAction[DebugAction.checkNoChanges] = "checkNoChanges";
    DebugAction[DebugAction.destroy] = "destroy";
    DebugAction[DebugAction.handleEvent] = "handleEvent";
    var _currentAction;
    var _currentView;
    var _currentNodeIndex;
    function debugSetCurrentNode(view, nodeIndex) {
      _currentView = view;
      _currentNodeIndex = nodeIndex;
    }
    function debugHandleEvent(view, nodeIndex, eventName, event) {
      debugSetCurrentNode(view, nodeIndex);
      return callWithDebugContext(DebugAction.handleEvent, view.def.handleEvent, null, [view, nodeIndex, eventName, event]);
    }
    function debugUpdateDirectives(view, checkType) {
      if (view.state & 128) {
        throw viewDestroyedError(DebugAction[_currentAction]);
      }
      debugSetCurrentNode(view, nextDirectiveWithBinding(view, 0));
      return view.def.updateDirectives(debugCheckDirectivesFn, view);
      function debugCheckDirectivesFn(view, nodeIndex, argStyle) {
        var values = [];
        for (var _i = 3; _i < arguments.length; _i++) {
          values[_i - 3] = arguments[_i];
        }
        var nodeDef = view.def.nodes[nodeIndex];
        if (checkType === 0) {
          debugCheckAndUpdateNode(view, nodeDef, argStyle, values);
        } else {
          debugCheckNoChangesNode(view, nodeDef, argStyle, values);
        }
        if (nodeDef.flags & 16384) {
          debugSetCurrentNode(view, nextDirectiveWithBinding(view, nodeIndex));
        }
        return (nodeDef.flags & 224) ? asPureExpressionData(view, nodeDef.index).value : undefined;
      }
    }
    function debugUpdateRenderer(view, checkType) {
      if (view.state & 128) {
        throw viewDestroyedError(DebugAction[_currentAction]);
      }
      debugSetCurrentNode(view, nextRenderNodeWithBinding(view, 0));
      return view.def.updateRenderer(debugCheckRenderNodeFn, view);
      function debugCheckRenderNodeFn(view, nodeIndex, argStyle) {
        var values = [];
        for (var _i = 3; _i < arguments.length; _i++) {
          values[_i - 3] = arguments[_i];
        }
        var nodeDef = view.def.nodes[nodeIndex];
        if (checkType === 0) {
          debugCheckAndUpdateNode(view, nodeDef, argStyle, values);
        } else {
          debugCheckNoChangesNode(view, nodeDef, argStyle, values);
        }
        if (nodeDef.flags & 3) {
          debugSetCurrentNode(view, nextRenderNodeWithBinding(view, nodeIndex));
        }
        return (nodeDef.flags & 224) ? asPureExpressionData(view, nodeDef.index).value : undefined;
      }
    }
    function debugCheckAndUpdateNode(view, nodeDef, argStyle, givenValues) {
      var changed = ((checkAndUpdateNode)).apply(void 0, [view, nodeDef, argStyle].concat(givenValues));
      if (changed) {
        var values = argStyle === 1 ? givenValues[0] : givenValues;
        if (nodeDef.flags & 16384) {
          var bindingValues = {};
          for (var i = 0; i < nodeDef.bindings.length; i++) {
            var binding = nodeDef.bindings[i];
            var value = values[i];
            if (binding.flags & 8) {
              bindingValues[normalizeDebugBindingName(((binding.nonMinifiedName)))] = normalizeDebugBindingValue(value);
            }
          }
          var elDef = ((nodeDef.parent));
          var el = asElementData(view, elDef.index).renderElement;
          if (!((elDef.element)).name) {
            view.renderer.setValue(el, "bindings=" + JSON.stringify(bindingValues, null, 2));
          } else {
            for (var attr in bindingValues) {
              var value = bindingValues[attr];
              if (value != null) {
                view.renderer.setAttribute(el, attr, value);
              } else {
                view.renderer.removeAttribute(el, attr);
              }
            }
          }
        }
      }
    }
    function debugCheckNoChangesNode(view, nodeDef, argStyle, values) {
      ((checkNoChangesNode)).apply(void 0, [view, nodeDef, argStyle].concat(values));
    }
    function normalizeDebugBindingName(name) {
      name = camelCaseToDashCase(name.replace(/[$@]/g, '_'));
      return "ng-reflect-" + name;
    }
    var CAMEL_CASE_REGEXP = /([A-Z])/g;
    function camelCaseToDashCase(input) {
      return input.replace(CAMEL_CASE_REGEXP, function() {
        var m = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          m[_i] = arguments[_i];
        }
        return '-' + m[1].toLowerCase();
      });
    }
    function normalizeDebugBindingValue(value) {
      try {
        return value != null ? value.toString().slice(0, 30) : value;
      } catch (e) {
        return '[ERROR] Exception while trying to serialize the value';
      }
    }
    function nextDirectiveWithBinding(view, nodeIndex) {
      for (var i = nodeIndex; i < view.def.nodes.length; i++) {
        var nodeDef = view.def.nodes[i];
        if (nodeDef.flags & 16384 && nodeDef.bindings && nodeDef.bindings.length) {
          return i;
        }
      }
      return null;
    }
    function nextRenderNodeWithBinding(view, nodeIndex) {
      for (var i = nodeIndex; i < view.def.nodes.length; i++) {
        var nodeDef = view.def.nodes[i];
        if ((nodeDef.flags & 3) && nodeDef.bindings && nodeDef.bindings.length) {
          return i;
        }
      }
      return null;
    }
    var DebugContext_ = (function() {
      function DebugContext_(view, nodeIndex) {
        this.view = view;
        this.nodeIndex = nodeIndex;
        if (nodeIndex == null) {
          this.nodeIndex = nodeIndex = 0;
        }
        this.nodeDef = view.def.nodes[nodeIndex];
        var elDef = this.nodeDef;
        var elView = view;
        while (elDef && (elDef.flags & 1) === 0) {
          elDef = elDef.parent;
        }
        if (!elDef) {
          while (!elDef && elView) {
            elDef = viewParentEl(elView);
            elView = elView.parent;
          }
        }
        this.elDef = elDef;
        this.elView = elView;
      }
      Object.defineProperty(DebugContext_.prototype, "elOrCompView", {
        get: function() {
          return asElementData(this.elView, this.elDef.index).componentView || this.view;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(DebugContext_.prototype, "injector", {
        get: function() {
          return createInjector(this.elView, this.elDef);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(DebugContext_.prototype, "component", {
        get: function() {
          return this.elOrCompView.component;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(DebugContext_.prototype, "context", {
        get: function() {
          return this.elOrCompView.context;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(DebugContext_.prototype, "providerTokens", {
        get: function() {
          var tokens = [];
          if (this.elDef) {
            for (var i = this.elDef.index + 1; i <= this.elDef.index + this.elDef.childCount; i++) {
              var childDef = this.elView.def.nodes[i];
              if (childDef.flags & 20224) {
                tokens.push(((childDef.provider)).token);
              }
              i += childDef.childCount;
            }
          }
          return tokens;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(DebugContext_.prototype, "references", {
        get: function() {
          var references = {};
          if (this.elDef) {
            collectReferences(this.elView, this.elDef, references);
            for (var i = this.elDef.index + 1; i <= this.elDef.index + this.elDef.childCount; i++) {
              var childDef = this.elView.def.nodes[i];
              if (childDef.flags & 20224) {
                collectReferences(this.elView, childDef, references);
              }
              i += childDef.childCount;
            }
          }
          return references;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(DebugContext_.prototype, "componentRenderElement", {
        get: function() {
          var elData = findHostElement(this.elOrCompView);
          return elData ? elData.renderElement : undefined;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(DebugContext_.prototype, "renderNode", {
        get: function() {
          return this.nodeDef.flags & 2 ? renderNode(this.view, this.nodeDef) : renderNode(this.elView, this.elDef);
        },
        enumerable: true,
        configurable: true
      });
      DebugContext_.prototype.logError = function(console) {
        var values = [];
        for (var _i = 1; _i < arguments.length; _i++) {
          values[_i - 1] = arguments[_i];
        }
        var logViewDef;
        var logNodeIndex;
        if (this.nodeDef.flags & 2) {
          logViewDef = this.view.def;
          logNodeIndex = this.nodeDef.index;
        } else {
          logViewDef = this.elView.def;
          logNodeIndex = this.elDef.index;
        }
        var renderNodeIndex = getRenderNodeIndex(logViewDef, logNodeIndex);
        var currRenderNodeIndex = -1;
        var nodeLogger = function() {
          currRenderNodeIndex++;
          if (currRenderNodeIndex === renderNodeIndex) {
            return (_a = console.error).bind.apply(_a, [console].concat(values));
          } else {
            return NOOP;
          }
          var _a;
        };
        ((logViewDef.factory))(nodeLogger);
        if (currRenderNodeIndex < renderNodeIndex) {
          console.error('Illegal state: the ViewDefinitionFactory did not call the logger!');
          console.error.apply(console, values);
        }
      };
      return DebugContext_;
    }());
    function getRenderNodeIndex(viewDef$$1, nodeIndex) {
      var renderNodeIndex = -1;
      for (var i = 0; i <= nodeIndex; i++) {
        var nodeDef = viewDef$$1.nodes[i];
        if (nodeDef.flags & 3) {
          renderNodeIndex++;
        }
      }
      return renderNodeIndex;
    }
    function findHostElement(view) {
      while (view && !isComponentView(view)) {
        view = ((view.parent));
      }
      if (view.parent) {
        return asElementData(view.parent, ((viewParentEl(view))).index);
      }
      return null;
    }
    function collectReferences(view, nodeDef, references) {
      for (var refName in nodeDef.references) {
        references[refName] = getQueryValue(view, nodeDef, nodeDef.references[refName]);
      }
    }
    function callWithDebugContext(action, fn, self, args) {
      var oldAction = _currentAction;
      var oldView = _currentView;
      var oldNodeIndex = _currentNodeIndex;
      try {
        _currentAction = action;
        var result = fn.apply(self, args);
        _currentView = oldView;
        _currentNodeIndex = oldNodeIndex;
        _currentAction = oldAction;
        return result;
      } catch (e) {
        if (isViewDebugError(e) || !_currentView) {
          throw e;
        }
        throw viewWrappedDebugError(e, ((getCurrentDebugContext())));
      }
    }
    function getCurrentDebugContext() {
      return _currentView ? new DebugContext_(_currentView, _currentNodeIndex) : null;
    }
    var DebugRendererFactory2 = (function() {
      function DebugRendererFactory2(delegate) {
        this.delegate = delegate;
      }
      DebugRendererFactory2.prototype.createRenderer = function(element, renderData) {
        return new DebugRenderer2(this.delegate.createRenderer(element, renderData));
      };
      DebugRendererFactory2.prototype.begin = function() {
        if (this.delegate.begin) {
          this.delegate.begin();
        }
      };
      DebugRendererFactory2.prototype.end = function() {
        if (this.delegate.end) {
          this.delegate.end();
        }
      };
      DebugRendererFactory2.prototype.whenRenderingDone = function() {
        if (this.delegate.whenRenderingDone) {
          return this.delegate.whenRenderingDone();
        }
        return Promise.resolve(null);
      };
      return DebugRendererFactory2;
    }());
    var DebugRenderer2 = (function() {
      function DebugRenderer2(delegate) {
        this.delegate = delegate;
      }
      Object.defineProperty(DebugRenderer2.prototype, "data", {
        get: function() {
          return this.delegate.data;
        },
        enumerable: true,
        configurable: true
      });
      DebugRenderer2.prototype.destroyNode = function(node) {
        removeDebugNodeFromIndex(((getDebugNode(node))));
        if (this.delegate.destroyNode) {
          this.delegate.destroyNode(node);
        }
      };
      DebugRenderer2.prototype.destroy = function() {
        this.delegate.destroy();
      };
      DebugRenderer2.prototype.createElement = function(name, namespace) {
        var el = this.delegate.createElement(name, namespace);
        var debugCtx = getCurrentDebugContext();
        if (debugCtx) {
          var debugEl = new DebugElement(el, null, debugCtx);
          debugEl.name = name;
          indexDebugNode(debugEl);
        }
        return el;
      };
      DebugRenderer2.prototype.createComment = function(value) {
        var comment = this.delegate.createComment(value);
        var debugCtx = getCurrentDebugContext();
        if (debugCtx) {
          indexDebugNode(new DebugNode(comment, null, debugCtx));
        }
        return comment;
      };
      DebugRenderer2.prototype.createText = function(value) {
        var text = this.delegate.createText(value);
        var debugCtx = getCurrentDebugContext();
        if (debugCtx) {
          indexDebugNode(new DebugNode(text, null, debugCtx));
        }
        return text;
      };
      DebugRenderer2.prototype.appendChild = function(parent, newChild) {
        var debugEl = getDebugNode(parent);
        var debugChildEl = getDebugNode(newChild);
        if (debugEl && debugChildEl && debugEl instanceof DebugElement) {
          debugEl.addChild(debugChildEl);
        }
        this.delegate.appendChild(parent, newChild);
      };
      DebugRenderer2.prototype.insertBefore = function(parent, newChild, refChild) {
        var debugEl = getDebugNode(parent);
        var debugChildEl = getDebugNode(newChild);
        var debugRefEl = ((getDebugNode(refChild)));
        if (debugEl && debugChildEl && debugEl instanceof DebugElement) {
          debugEl.insertBefore(debugRefEl, debugChildEl);
        }
        this.delegate.insertBefore(parent, newChild, refChild);
      };
      DebugRenderer2.prototype.removeChild = function(parent, oldChild) {
        var debugEl = getDebugNode(parent);
        var debugChildEl = getDebugNode(oldChild);
        if (debugEl && debugChildEl && debugEl instanceof DebugElement) {
          debugEl.removeChild(debugChildEl);
        }
        this.delegate.removeChild(parent, oldChild);
      };
      DebugRenderer2.prototype.selectRootElement = function(selectorOrNode) {
        var el = this.delegate.selectRootElement(selectorOrNode);
        var debugCtx = getCurrentDebugContext();
        if (debugCtx) {
          indexDebugNode(new DebugElement(el, null, debugCtx));
        }
        return el;
      };
      DebugRenderer2.prototype.setAttribute = function(el, name, value, namespace) {
        var debugEl = getDebugNode(el);
        if (debugEl && debugEl instanceof DebugElement) {
          var fullName = namespace ? namespace + ':' + name : name;
          debugEl.attributes[fullName] = value;
        }
        this.delegate.setAttribute(el, name, value, namespace);
      };
      DebugRenderer2.prototype.removeAttribute = function(el, name, namespace) {
        var debugEl = getDebugNode(el);
        if (debugEl && debugEl instanceof DebugElement) {
          var fullName = namespace ? namespace + ':' + name : name;
          debugEl.attributes[fullName] = null;
        }
        this.delegate.removeAttribute(el, name, namespace);
      };
      DebugRenderer2.prototype.addClass = function(el, name) {
        var debugEl = getDebugNode(el);
        if (debugEl && debugEl instanceof DebugElement) {
          debugEl.classes[name] = true;
        }
        this.delegate.addClass(el, name);
      };
      DebugRenderer2.prototype.removeClass = function(el, name) {
        var debugEl = getDebugNode(el);
        if (debugEl && debugEl instanceof DebugElement) {
          debugEl.classes[name] = false;
        }
        this.delegate.removeClass(el, name);
      };
      DebugRenderer2.prototype.setStyle = function(el, style, value, flags) {
        var debugEl = getDebugNode(el);
        if (debugEl && debugEl instanceof DebugElement) {
          debugEl.styles[style] = value;
        }
        this.delegate.setStyle(el, style, value, flags);
      };
      DebugRenderer2.prototype.removeStyle = function(el, style, flags) {
        var debugEl = getDebugNode(el);
        if (debugEl && debugEl instanceof DebugElement) {
          debugEl.styles[style] = null;
        }
        this.delegate.removeStyle(el, style, flags);
      };
      DebugRenderer2.prototype.setProperty = function(el, name, value) {
        var debugEl = getDebugNode(el);
        if (debugEl && debugEl instanceof DebugElement) {
          debugEl.properties[name] = value;
        }
        this.delegate.setProperty(el, name, value);
      };
      DebugRenderer2.prototype.listen = function(target, eventName, callback) {
        if (typeof target !== 'string') {
          var debugEl = getDebugNode(target);
          if (debugEl) {
            debugEl.listeners.push(new EventListener(eventName, callback));
          }
        }
        return this.delegate.listen(target, eventName, callback);
      };
      DebugRenderer2.prototype.parentNode = function(node) {
        return this.delegate.parentNode(node);
      };
      DebugRenderer2.prototype.nextSibling = function(node) {
        return this.delegate.nextSibling(node);
      };
      DebugRenderer2.prototype.setValue = function(node, value) {
        return this.delegate.setValue(node, value);
      };
      return DebugRenderer2;
    }());
    function overrideProvider(override) {
      initServicesIfNeeded();
      return Services.overrideProvider(override);
    }
    function clearProviderOverrides() {
      initServicesIfNeeded();
      return Services.clearProviderOverrides();
    }
    function createNgModuleFactory(ngModuleType, bootstrapComponents, defFactory) {
      return new NgModuleFactory_(ngModuleType, bootstrapComponents, defFactory);
    }
    var NgModuleFactory_ = (function(_super) {
      __extends(NgModuleFactory_, _super);
      function NgModuleFactory_(moduleType, _bootstrapComponents, _ngModuleDefFactory) {
        var _this = _super.call(this) || this;
        _this.moduleType = moduleType;
        _this._bootstrapComponents = _bootstrapComponents;
        _this._ngModuleDefFactory = _ngModuleDefFactory;
        return _this;
      }
      NgModuleFactory_.prototype.create = function(parentInjector) {
        initServicesIfNeeded();
        var def = resolveDefinition(this._ngModuleDefFactory);
        return Services.createNgModuleRef(this.moduleType, parentInjector || Injector.NULL, this._bootstrapComponents, def);
      };
      return NgModuleFactory_;
    }(NgModuleFactory));
    function trigger$1(name, definitions) {
      return {
        type: 7,
        name: name,
        definitions: definitions,
        options: {}
      };
    }
    function animate$1(timings, styles) {
      if (styles === void 0) {
        styles = null;
      }
      return {
        type: 4,
        styles: styles,
        timings: timings
      };
    }
    function group$1(steps, options) {
      if (options === void 0) {
        options = null;
      }
      return {
        type: 3,
        steps: steps,
        options: options
      };
    }
    function sequence$1(steps, options) {
      if (options === void 0) {
        options = null;
      }
      return {
        type: 2,
        steps: steps,
        options: options
      };
    }
    function style$1(tokens) {
      return {
        type: 6,
        styles: tokens,
        offset: null
      };
    }
    function state$1(name, styles) {
      return {
        type: 0,
        name: name,
        styles: styles
      };
    }
    function keyframes$1(steps) {
      return {
        type: 5,
        steps: steps
      };
    }
    function transition$1(stateChangeExpr, steps, options) {
      if (options === void 0) {
        options = null;
      }
      return {
        type: 1,
        expr: stateChangeExpr,
        animation: steps,
        options: options
      };
    }
    var AUTO_STYLE$$1 = '*';
    function trigger$$1(name, definitions) {
      return trigger$1(name, definitions);
    }
    function animate$$1(timings, styles) {
      return animate$1(timings, styles);
    }
    function group$$1(steps) {
      return group$1(steps);
    }
    function sequence$$1(steps) {
      return sequence$1(steps);
    }
    function style$$1(tokens) {
      return style$1(tokens);
    }
    function state$$1(name, styles) {
      return state$1(name, styles);
    }
    function keyframes$$1(steps) {
      return keyframes$1(steps);
    }
    function transition$$1(stateChangeExpr, steps) {
      return transition$1(stateChangeExpr, steps);
    }
    exports.Class = Class;
    exports.createPlatform = createPlatform;
    exports.assertPlatform = assertPlatform;
    exports.destroyPlatform = destroyPlatform;
    exports.getPlatform = getPlatform;
    exports.PlatformRef = PlatformRef;
    exports.ApplicationRef = ApplicationRef;
    exports.enableProdMode = enableProdMode;
    exports.isDevMode = isDevMode;
    exports.createPlatformFactory = createPlatformFactory;
    exports.NgProbeToken = NgProbeToken;
    exports.APP_ID = APP_ID;
    exports.PACKAGE_ROOT_URL = PACKAGE_ROOT_URL;
    exports.PLATFORM_INITIALIZER = PLATFORM_INITIALIZER;
    exports.PLATFORM_ID = PLATFORM_ID;
    exports.APP_BOOTSTRAP_LISTENER = APP_BOOTSTRAP_LISTENER;
    exports.APP_INITIALIZER = APP_INITIALIZER;
    exports.ApplicationInitStatus = ApplicationInitStatus;
    exports.DebugElement = DebugElement;
    exports.DebugNode = DebugNode;
    exports.asNativeElements = asNativeElements;
    exports.getDebugNode = getDebugNode;
    exports.Testability = Testability;
    exports.TestabilityRegistry = TestabilityRegistry;
    exports.setTestabilityGetter = setTestabilityGetter;
    exports.TRANSLATIONS = TRANSLATIONS;
    exports.TRANSLATIONS_FORMAT = TRANSLATIONS_FORMAT;
    exports.LOCALE_ID = LOCALE_ID;
    exports.MissingTranslationStrategy = MissingTranslationStrategy;
    exports.ApplicationModule = ApplicationModule;
    exports.wtfCreateScope = wtfCreateScope;
    exports.wtfLeave = wtfLeave;
    exports.wtfStartTimeRange = wtfStartTimeRange;
    exports.wtfEndTimeRange = wtfEndTimeRange;
    exports.Type = Type;
    exports.EventEmitter = EventEmitter;
    exports.ErrorHandler = ErrorHandler;
    exports.Sanitizer = Sanitizer;
    exports.SecurityContext = SecurityContext;
    exports.ANALYZE_FOR_ENTRY_COMPONENTS = ANALYZE_FOR_ENTRY_COMPONENTS;
    exports.Attribute = Attribute;
    exports.ContentChild = ContentChild;
    exports.ContentChildren = ContentChildren;
    exports.Query = Query;
    exports.ViewChild = ViewChild;
    exports.ViewChildren = ViewChildren;
    exports.Component = Component;
    exports.Directive = Directive;
    exports.HostBinding = HostBinding;
    exports.HostListener = HostListener;
    exports.Input = Input;
    exports.Output = Output;
    exports.Pipe = Pipe;
    exports.CUSTOM_ELEMENTS_SCHEMA = CUSTOM_ELEMENTS_SCHEMA;
    exports.NO_ERRORS_SCHEMA = NO_ERRORS_SCHEMA;
    exports.NgModule = NgModule;
    exports.ViewEncapsulation = ViewEncapsulation;
    exports.Version = Version;
    exports.VERSION = VERSION;
    exports.forwardRef = forwardRef;
    exports.resolveForwardRef = resolveForwardRef;
    exports.Injector = Injector;
    exports.ReflectiveInjector = ReflectiveInjector;
    exports.ResolvedReflectiveFactory = ResolvedReflectiveFactory;
    exports.ReflectiveKey = ReflectiveKey;
    exports.InjectionToken = InjectionToken;
    exports.OpaqueToken = OpaqueToken;
    exports.Inject = Inject;
    exports.Optional = Optional;
    exports.Injectable = Injectable;
    exports.Self = Self;
    exports.SkipSelf = SkipSelf;
    exports.Host = Host;
    exports.NgZone = NgZone;
    exports.RenderComponentType = RenderComponentType;
    exports.Renderer = Renderer;
    exports.Renderer2 = Renderer2;
    exports.RendererFactory2 = RendererFactory2;
    exports.RendererStyleFlags2 = RendererStyleFlags2;
    exports.RootRenderer = RootRenderer;
    exports.COMPILER_OPTIONS = COMPILER_OPTIONS;
    exports.Compiler = Compiler;
    exports.CompilerFactory = CompilerFactory;
    exports.ModuleWithComponentFactories = ModuleWithComponentFactories;
    exports.ComponentFactory = ComponentFactory;
    exports.ComponentRef = ComponentRef;
    exports.ComponentFactoryResolver = ComponentFactoryResolver;
    exports.ElementRef = ElementRef;
    exports.NgModuleFactory = NgModuleFactory;
    exports.NgModuleRef = NgModuleRef;
    exports.NgModuleFactoryLoader = NgModuleFactoryLoader;
    exports.getModuleFactory = getModuleFactory;
    exports.QueryList = QueryList;
    exports.SystemJsNgModuleLoader = SystemJsNgModuleLoader;
    exports.SystemJsNgModuleLoaderConfig = SystemJsNgModuleLoaderConfig;
    exports.TemplateRef = TemplateRef;
    exports.ViewContainerRef = ViewContainerRef;
    exports.EmbeddedViewRef = EmbeddedViewRef;
    exports.ViewRef = ViewRef;
    exports.ChangeDetectionStrategy = ChangeDetectionStrategy;
    exports.ChangeDetectorRef = ChangeDetectorRef;
    exports.DefaultIterableDiffer = DefaultIterableDiffer;
    exports.IterableDiffers = IterableDiffers;
    exports.KeyValueDiffers = KeyValueDiffers;
    exports.SimpleChange = SimpleChange;
    exports.WrappedValue = WrappedValue;
    exports.platformCore = platformCore;
    exports.ɵALLOW_MULTIPLE_PLATFORMS = ALLOW_MULTIPLE_PLATFORMS;
    exports.ɵAPP_ID_RANDOM_PROVIDER = APP_ID_RANDOM_PROVIDER;
    exports.ɵValueUnwrapper = ValueUnwrapper;
    exports.ɵdevModeEqual = devModeEqual;
    exports.ɵisListLikeIterable = isListLikeIterable;
    exports.ɵChangeDetectorStatus = ChangeDetectorStatus;
    exports.ɵisDefaultChangeDetectionStrategy = isDefaultChangeDetectionStrategy;
    exports.ɵConsole = Console;
    exports.ɵERROR_COMPONENT_TYPE = ERROR_COMPONENT_TYPE;
    exports.ɵComponentFactory = ComponentFactory;
    exports.ɵCodegenComponentFactoryResolver = CodegenComponentFactoryResolver;
    exports.ɵViewMetadata = ViewMetadata;
    exports.ɵReflectionCapabilities = ReflectionCapabilities;
    exports.ɵRenderDebugInfo = RenderDebugInfo;
    exports.ɵglobal = _global;
    exports.ɵlooseIdentical = looseIdentical;
    exports.ɵstringify = stringify;
    exports.ɵmakeDecorator = makeDecorator;
    exports.ɵisObservable = isObservable;
    exports.ɵisPromise = isPromise;
    exports.ɵclearProviderOverrides = clearProviderOverrides;
    exports.ɵoverrideProvider = overrideProvider;
    exports.ɵNOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR = NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR;
    exports.ɵregisterModuleFactory = registerModuleFactory;
    exports.ɵEMPTY_ARRAY = EMPTY_ARRAY;
    exports.ɵEMPTY_MAP = EMPTY_MAP;
    exports.ɵand = anchorDef;
    exports.ɵccf = createComponentFactory;
    exports.ɵcmf = createNgModuleFactory;
    exports.ɵcrt = createRendererType2;
    exports.ɵdid = directiveDef;
    exports.ɵeld = elementDef;
    exports.ɵelementEventFullName = elementEventFullName;
    exports.ɵgetComponentViewDefinitionFactory = getComponentViewDefinitionFactory;
    exports.ɵinlineInterpolate = inlineInterpolate;
    exports.ɵinterpolate = interpolate;
    exports.ɵmod = moduleDef;
    exports.ɵmpd = moduleProvideDef;
    exports.ɵncd = ngContentDef;
    exports.ɵnov = nodeValue;
    exports.ɵpid = pipeDef;
    exports.ɵprd = providerDef;
    exports.ɵpad = pureArrayDef;
    exports.ɵpod = pureObjectDef;
    exports.ɵppd = purePipeDef;
    exports.ɵqud = queryDef;
    exports.ɵted = textDef;
    exports.ɵunv = unwrapValue;
    exports.ɵvid = viewDef;
    exports.AUTO_STYLE = AUTO_STYLE$$1;
    exports.trigger = trigger$$1;
    exports.animate = animate$$1;
    exports.group = group$$1;
    exports.sequence = sequence$$1;
    exports.style = style$$1;
    exports.state = state$$1;
    exports.keyframes = keyframes$$1;
    exports.transition = transition$$1;
    exports.ɵx = animate$1;
    exports.ɵy = group$1;
    exports.ɵbc = keyframes$1;
    exports.ɵz = sequence$1;
    exports.ɵbb = state$1;
    exports.ɵba = style$1;
    exports.ɵbd = transition$1;
    exports.ɵw = trigger$1;
    exports.ɵk = _iterableDiffersFactory;
    exports.ɵl = _keyValueDiffersFactory;
    exports.ɵm = _localeFactory;
    exports.ɵe = ApplicationRef_;
    exports.ɵf = _appIdRandomProviderFactory;
    exports.ɵg = defaultIterableDiffers;
    exports.ɵh = defaultKeyValueDiffers;
    exports.ɵi = DefaultIterableDifferFactory;
    exports.ɵj = DefaultKeyValueDifferFactory;
    exports.ɵb = ReflectiveInjector_;
    exports.ɵc = ReflectiveDependency;
    exports.ɵd = resolveReflectiveProviders;
    exports.ɵn = wtfEnabled;
    exports.ɵp = createScope$1;
    exports.ɵo = detectWTF;
    exports.ɵs = endTimeRange;
    exports.ɵq = leave;
    exports.ɵr = startTimeRange;
    exports.ɵa = makeParamDecorator;
    exports.ɵt = _def;
    exports.ɵu = DebugContext;
    Object.defineProperty(exports, '__esModule', {value: true});
  })));
})(require('process'));
