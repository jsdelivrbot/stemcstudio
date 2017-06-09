/* */ 
"format cjs";
(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('./platform-browser.umd'), require('@angular/animations'), require('@angular/animations/browser')) : typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/platform-browser', '@angular/animations', '@angular/animations/browser'], factory) : (factory((global.ng = global.ng || {}, global.ng.platformBrowser = global.ng.platformBrowser || {}, global.ng.platformBrowser.animations = global.ng.platformBrowser.animations || {}), global.ng.core, global.ng.platformBrowser, global.ng.animations, global.ng.animations.browser));
}(this, (function(exports, _angular_core, _angular_platformBrowser, _angular_animations, _angular_animations_browser) {
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
  var BrowserAnimationBuilder = (function(_super) {
    __extends(BrowserAnimationBuilder, _super);
    function BrowserAnimationBuilder(rootRenderer) {
      var _this = _super.call(this) || this;
      _this._nextAnimationId = 0;
      var typeData = {
        id: '0',
        encapsulation: _angular_core.ViewEncapsulation.None,
        styles: [],
        data: {animation: []}
      };
      _this._renderer = rootRenderer.createRenderer(document.body, typeData);
      return _this;
    }
    BrowserAnimationBuilder.prototype.build = function(animation) {
      var id = this._nextAnimationId.toString();
      this._nextAnimationId++;
      var entry = Array.isArray(animation) ? _angular_animations.sequence(animation) : animation;
      issueAnimationCommand(this._renderer, null, id, 'register', [entry]);
      return new BrowserAnimationFactory(id, this._renderer);
    };
    return BrowserAnimationBuilder;
  }(_angular_animations.AnimationBuilder));
  BrowserAnimationBuilder.decorators = [{type: _angular_core.Injectable}];
  BrowserAnimationBuilder.ctorParameters = function() {
    return [{type: _angular_core.RendererFactory2}];
  };
  var BrowserAnimationFactory = (function(_super) {
    __extends(BrowserAnimationFactory, _super);
    function BrowserAnimationFactory(_id, _renderer) {
      var _this = _super.call(this) || this;
      _this._id = _id;
      _this._renderer = _renderer;
      return _this;
    }
    BrowserAnimationFactory.prototype.create = function(element, options) {
      return new RendererAnimationPlayer(this._id, element, options || {}, this._renderer);
    };
    return BrowserAnimationFactory;
  }(_angular_animations.AnimationFactory));
  var RendererAnimationPlayer = (function() {
    function RendererAnimationPlayer(id, element, options, _renderer) {
      this.id = id;
      this.element = element;
      this._renderer = _renderer;
      this.parentPlayer = null;
      this._started = false;
      this.totalTime = 0;
      this._command('create', options);
    }
    RendererAnimationPlayer.prototype._listen = function(eventName, callback) {
      return this._renderer.listen(this.element, "@@" + this.id + ":" + eventName, callback);
    };
    RendererAnimationPlayer.prototype._command = function(command) {
      var args = [];
      for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
      }
      return issueAnimationCommand(this._renderer, this.element, this.id, command, args);
    };
    RendererAnimationPlayer.prototype.onDone = function(fn) {
      this._listen('done', fn);
    };
    RendererAnimationPlayer.prototype.onStart = function(fn) {
      this._listen('start', fn);
    };
    RendererAnimationPlayer.prototype.onDestroy = function(fn) {
      this._listen('destroy', fn);
    };
    RendererAnimationPlayer.prototype.init = function() {
      this._command('init');
    };
    RendererAnimationPlayer.prototype.hasStarted = function() {
      return this._started;
    };
    RendererAnimationPlayer.prototype.play = function() {
      this._command('play');
      this._started = true;
    };
    RendererAnimationPlayer.prototype.pause = function() {
      this._command('pause');
    };
    RendererAnimationPlayer.prototype.restart = function() {
      this._command('restart');
    };
    RendererAnimationPlayer.prototype.finish = function() {
      this._command('finish');
    };
    RendererAnimationPlayer.prototype.destroy = function() {
      this._command('destroy');
    };
    RendererAnimationPlayer.prototype.reset = function() {
      this._command('reset');
    };
    RendererAnimationPlayer.prototype.setPosition = function(p) {
      this._command('setPosition', p);
    };
    RendererAnimationPlayer.prototype.getPosition = function() {
      return 0;
    };
    return RendererAnimationPlayer;
  }());
  function issueAnimationCommand(renderer, element, id, command, args) {
    return renderer.setProperty(element, "@@" + id + ":" + command, args);
  }
  var AnimationRendererFactory = (function() {
    function AnimationRendererFactory(delegate, engine, _zone) {
      this.delegate = delegate;
      this.engine = engine;
      this._zone = _zone;
      this._currentId = 0;
      this._microtaskId = 1;
      this._animationCallbacksBuffer = [];
      this._rendererCache = new Map();
      engine.onRemovalComplete = function(element, delegate) {
        if (delegate && delegate.parentNode(element)) {
          delegate.removeChild(element.parentNode, element);
        }
      };
    }
    AnimationRendererFactory.prototype.createRenderer = function(hostElement, type) {
      var _this = this;
      var EMPTY_NAMESPACE_ID = '';
      var delegate = this.delegate.createRenderer(hostElement, type);
      if (!hostElement || !type || !type.data || !type.data['animation']) {
        var renderer = this._rendererCache.get(delegate);
        if (!renderer) {
          renderer = new BaseAnimationRenderer(EMPTY_NAMESPACE_ID, delegate, this.engine);
          this._rendererCache.set(delegate, renderer);
        }
        return renderer;
      }
      var componentId = type.id;
      var namespaceId = type.id + '-' + this._currentId;
      this._currentId++;
      this.engine.register(namespaceId, hostElement);
      var animationTriggers = (type.data['animation']);
      animationTriggers.forEach(function(trigger) {
        return _this.engine.registerTrigger(componentId, namespaceId, hostElement, trigger.name, trigger);
      });
      return new AnimationRenderer(this, namespaceId, delegate, this.engine);
    };
    AnimationRendererFactory.prototype.begin = function() {
      if (this.delegate.begin) {
        this.delegate.begin();
      }
    };
    AnimationRendererFactory.prototype._scheduleCountTask = function() {
      var _this = this;
      Zone.current.scheduleMicroTask('incremenet the animation microtask', function() {
        return _this._microtaskId++;
      });
    };
    AnimationRendererFactory.prototype.scheduleListenerCallback = function(count, fn, data) {
      var _this = this;
      if (count >= 0 && count < this._microtaskId) {
        this._zone.run(function() {
          return fn(data);
        });
        return;
      }
      if (this._animationCallbacksBuffer.length == 0) {
        Promise.resolve(null).then(function() {
          _this._zone.run(function() {
            _this._animationCallbacksBuffer.forEach(function(tuple) {
              var fn = tuple[0],
                  data = tuple[1];
              fn(data);
            });
            _this._animationCallbacksBuffer = [];
          });
        });
      }
      this._animationCallbacksBuffer.push([fn, data]);
    };
    AnimationRendererFactory.prototype.end = function() {
      var _this = this;
      this._zone.runOutsideAngular(function() {
        _this._scheduleCountTask();
        _this.engine.flush(_this._microtaskId);
      });
      if (this.delegate.end) {
        this.delegate.end();
      }
    };
    AnimationRendererFactory.prototype.whenRenderingDone = function() {
      return this.engine.whenRenderingDone();
    };
    return AnimationRendererFactory;
  }());
  AnimationRendererFactory.decorators = [{type: _angular_core.Injectable}];
  AnimationRendererFactory.ctorParameters = function() {
    return [{type: _angular_core.RendererFactory2}, {type: _angular_animations_browser.ɵAnimationEngine}, {type: _angular_core.NgZone}];
  };
  var BaseAnimationRenderer = (function() {
    function BaseAnimationRenderer(namespaceId, delegate, engine) {
      this.namespaceId = namespaceId;
      this.delegate = delegate;
      this.engine = engine;
      this.destroyNode = this.delegate.destroyNode ? function(n) {
        return delegate.destroyNode(n);
      } : null;
    }
    Object.defineProperty(BaseAnimationRenderer.prototype, "data", {
      get: function() {
        return this.delegate.data;
      },
      enumerable: true,
      configurable: true
    });
    BaseAnimationRenderer.prototype.destroy = function() {
      this.engine.destroy(this.namespaceId, this.delegate);
      this.delegate.destroy();
    };
    BaseAnimationRenderer.prototype.createElement = function(name, namespace) {
      return this.delegate.createElement(name, namespace);
    };
    BaseAnimationRenderer.prototype.createComment = function(value) {
      return this.delegate.createComment(value);
    };
    BaseAnimationRenderer.prototype.createText = function(value) {
      return this.delegate.createText(value);
    };
    BaseAnimationRenderer.prototype.appendChild = function(parent, newChild) {
      this.delegate.appendChild(parent, newChild);
      this.engine.onInsert(this.namespaceId, newChild, parent, false);
    };
    BaseAnimationRenderer.prototype.insertBefore = function(parent, newChild, refChild) {
      this.delegate.insertBefore(parent, newChild, refChild);
      this.engine.onInsert(this.namespaceId, newChild, parent, true);
    };
    BaseAnimationRenderer.prototype.removeChild = function(parent, oldChild) {
      this.engine.onRemove(this.namespaceId, oldChild, this.delegate);
    };
    BaseAnimationRenderer.prototype.selectRootElement = function(selectorOrNode) {
      return this.delegate.selectRootElement(selectorOrNode);
    };
    BaseAnimationRenderer.prototype.parentNode = function(node) {
      return this.delegate.parentNode(node);
    };
    BaseAnimationRenderer.prototype.nextSibling = function(node) {
      return this.delegate.nextSibling(node);
    };
    BaseAnimationRenderer.prototype.setAttribute = function(el, name, value, namespace) {
      this.delegate.setAttribute(el, name, value, namespace);
    };
    BaseAnimationRenderer.prototype.removeAttribute = function(el, name, namespace) {
      this.delegate.removeAttribute(el, name, namespace);
    };
    BaseAnimationRenderer.prototype.addClass = function(el, name) {
      this.delegate.addClass(el, name);
    };
    BaseAnimationRenderer.prototype.removeClass = function(el, name) {
      this.delegate.removeClass(el, name);
    };
    BaseAnimationRenderer.prototype.setStyle = function(el, style, value, flags) {
      this.delegate.setStyle(el, style, value, flags);
    };
    BaseAnimationRenderer.prototype.removeStyle = function(el, style, flags) {
      this.delegate.removeStyle(el, style, flags);
    };
    BaseAnimationRenderer.prototype.setProperty = function(el, name, value) {
      this.delegate.setProperty(el, name, value);
    };
    BaseAnimationRenderer.prototype.setValue = function(node, value) {
      this.delegate.setValue(node, value);
    };
    BaseAnimationRenderer.prototype.listen = function(target, eventName, callback) {
      return this.delegate.listen(target, eventName, callback);
    };
    return BaseAnimationRenderer;
  }());
  var AnimationRenderer = (function(_super) {
    __extends(AnimationRenderer, _super);
    function AnimationRenderer(factory, namespaceId, delegate, engine) {
      var _this = _super.call(this, namespaceId, delegate, engine) || this;
      _this.factory = factory;
      _this.namespaceId = namespaceId;
      return _this;
    }
    AnimationRenderer.prototype.setProperty = function(el, name, value) {
      if (name.charAt(0) == '@') {
        name = name.substr(1);
        this.engine.setProperty(this.namespaceId, el, name, value);
      } else {
        this.delegate.setProperty(el, name, value);
      }
    };
    AnimationRenderer.prototype.listen = function(target, eventName, callback) {
      var _this = this;
      if (eventName.charAt(0) == '@') {
        var element = resolveElementFromTarget(target);
        var name = eventName.substr(1);
        var phase = '';
        if (name.charAt(0) != '@') {
          _a = parseTriggerCallbackName(name), name = _a[0], phase = _a[1];
        }
        return this.engine.listen(this.namespaceId, element, name, phase, function(event) {
          var countId = ((event))['_data'] || -1;
          _this.factory.scheduleListenerCallback(countId, callback, event);
        });
      }
      return this.delegate.listen(target, eventName, callback);
      var _a;
    };
    return AnimationRenderer;
  }(BaseAnimationRenderer));
  function resolveElementFromTarget(target) {
    switch (target) {
      case 'body':
        return document.body;
      case 'document':
        return document;
      case 'window':
        return window;
      default:
        return target;
    }
  }
  function parseTriggerCallbackName(triggerName) {
    var dotIndex = triggerName.indexOf('.');
    var trigger = triggerName.substring(0, dotIndex);
    var phase = triggerName.substr(dotIndex + 1);
    return [trigger, phase];
  }
  var InjectableAnimationEngine = (function(_super) {
    __extends(InjectableAnimationEngine, _super);
    function InjectableAnimationEngine(driver, normalizer) {
      return _super.call(this, driver, normalizer) || this;
    }
    return InjectableAnimationEngine;
  }(_angular_animations_browser.ɵAnimationEngine));
  InjectableAnimationEngine.decorators = [{type: _angular_core.Injectable}];
  InjectableAnimationEngine.ctorParameters = function() {
    return [{type: _angular_animations_browser.AnimationDriver}, {type: _angular_animations_browser.ɵAnimationStyleNormalizer}];
  };
  function instantiateSupportedAnimationDriver() {
    if (_angular_animations_browser.ɵsupportsWebAnimations()) {
      return new _angular_animations_browser.ɵWebAnimationsDriver();
    }
    return new _angular_animations_browser.ɵNoopAnimationDriver();
  }
  function instantiateDefaultStyleNormalizer() {
    return new _angular_animations_browser.ɵWebAnimationsStyleNormalizer();
  }
  function instantiateRendererFactory(renderer, engine, zone) {
    return new AnimationRendererFactory(renderer, engine, zone);
  }
  var SHARED_ANIMATION_PROVIDERS = [{
    provide: _angular_animations.AnimationBuilder,
    useClass: BrowserAnimationBuilder
  }, {
    provide: _angular_animations_browser.ɵAnimationStyleNormalizer,
    useFactory: instantiateDefaultStyleNormalizer
  }, {
    provide: _angular_animations_browser.ɵAnimationEngine,
    useClass: InjectableAnimationEngine
  }, {
    provide: _angular_core.RendererFactory2,
    useFactory: instantiateRendererFactory,
    deps: [_angular_platformBrowser.ɵDomRendererFactory2, _angular_animations_browser.ɵAnimationEngine, _angular_core.NgZone]
  }];
  var BROWSER_ANIMATIONS_PROVIDERS = [{
    provide: _angular_animations_browser.AnimationDriver,
    useFactory: instantiateSupportedAnimationDriver
  }].concat(SHARED_ANIMATION_PROVIDERS);
  var BROWSER_NOOP_ANIMATIONS_PROVIDERS = [{
    provide: _angular_animations_browser.AnimationDriver,
    useClass: _angular_animations_browser.ɵNoopAnimationDriver
  }].concat(SHARED_ANIMATION_PROVIDERS);
  var BrowserAnimationsModule = (function() {
    function BrowserAnimationsModule() {}
    return BrowserAnimationsModule;
  }());
  BrowserAnimationsModule.decorators = [{
    type: _angular_core.NgModule,
    args: [{
      imports: [_angular_platformBrowser.BrowserModule],
      providers: BROWSER_ANIMATIONS_PROVIDERS
    }]
  }];
  BrowserAnimationsModule.ctorParameters = function() {
    return [];
  };
  var NoopAnimationsModule = (function() {
    function NoopAnimationsModule() {}
    return NoopAnimationsModule;
  }());
  NoopAnimationsModule.decorators = [{
    type: _angular_core.NgModule,
    args: [{
      imports: [_angular_platformBrowser.BrowserModule],
      providers: BROWSER_NOOP_ANIMATIONS_PROVIDERS
    }]
  }];
  NoopAnimationsModule.ctorParameters = function() {
    return [];
  };
  exports.BrowserAnimationsModule = BrowserAnimationsModule;
  exports.NoopAnimationsModule = NoopAnimationsModule;
  exports.ɵBrowserAnimationBuilder = BrowserAnimationBuilder;
  exports.ɵBrowserAnimationFactory = BrowserAnimationFactory;
  exports.ɵAnimationRenderer = AnimationRenderer;
  exports.ɵAnimationRendererFactory = AnimationRendererFactory;
  exports.ɵa = BaseAnimationRenderer;
  exports.ɵf = BROWSER_ANIMATIONS_PROVIDERS;
  exports.ɵg = BROWSER_NOOP_ANIMATIONS_PROVIDERS;
  exports.ɵb = InjectableAnimationEngine;
  exports.ɵd = instantiateDefaultStyleNormalizer;
  exports.ɵe = instantiateRendererFactory;
  exports.ɵc = instantiateSupportedAnimationDriver;
  Object.defineProperty(exports, '__esModule', {value: true});
})));
