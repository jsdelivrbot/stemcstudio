/* */ 
"format cjs";
(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('./core.umd')) : typeof define === 'function' && define.amd ? define(['exports', '@angular/core'], factory) : (factory((global.ng = global.ng || {}, global.ng.core = global.ng.core || {}, global.ng.core.testing = global.ng.core.testing || {}), global.ng.core));
}(this, (function(exports, _angular_core) {
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
  var _global = (typeof window === 'undefined' ? global : window);
  function async(fn) {
    if (_global.jasmine) {
      return function(done) {
        if (!done) {
          done = function() {};
          done.fail = function(e) {
            throw e;
          };
        }
        runInTestZone(fn, this, done, function(err) {
          if (typeof err === 'string') {
            return done.fail(new Error(err));
          } else {
            done.fail(err);
          }
        });
      };
    }
    return function() {
      var _this = this;
      return new Promise(function(finishCallback, failCallback) {
        runInTestZone(fn, _this, finishCallback, failCallback);
      });
    };
  }
  function runInTestZone(fn, context, finishCallback, failCallback) {
    var currentZone = Zone.current;
    var AsyncTestZoneSpec = Zone['AsyncTestZoneSpec'];
    if (AsyncTestZoneSpec === undefined) {
      throw new Error('AsyncTestZoneSpec is needed for the async() test helper but could not be found. ' + 'Please make sure that your environment includes zone.js/dist/async-test.js');
    }
    var ProxyZoneSpec = Zone['ProxyZoneSpec'];
    if (ProxyZoneSpec === undefined) {
      throw new Error('ProxyZoneSpec is needed for the async() test helper but could not be found. ' + 'Please make sure that your environment includes zone.js/dist/proxy.js');
    }
    var proxyZoneSpec = ProxyZoneSpec.get();
    ProxyZoneSpec.assertPresent();
    var proxyZone = Zone.current.getZoneWith('ProxyZoneSpec');
    var previousDelegate = proxyZoneSpec.getDelegate();
    proxyZone.parent.run(function() {
      var testZoneSpec = new AsyncTestZoneSpec(function() {
        currentZone.run(function() {
          if (proxyZoneSpec.getDelegate() == testZoneSpec) {
            proxyZoneSpec.setDelegate(previousDelegate);
          }
          finishCallback();
        });
      }, function(error) {
        currentZone.run(function() {
          if (proxyZoneSpec.getDelegate() == testZoneSpec) {
            proxyZoneSpec.setDelegate(previousDelegate);
          }
          failCallback(error);
        });
      }, 'test');
      proxyZoneSpec.setDelegate(testZoneSpec);
    });
    return Zone.current.runGuarded(fn, context);
  }
  var ComponentFixture = (function() {
    function ComponentFixture(componentRef, ngZone, _autoDetect) {
      var _this = this;
      this.componentRef = componentRef;
      this.ngZone = ngZone;
      this._autoDetect = _autoDetect;
      this._isStable = true;
      this._isDestroyed = false;
      this._resolve = null;
      this._promise = null;
      this._onUnstableSubscription = null;
      this._onStableSubscription = null;
      this._onMicrotaskEmptySubscription = null;
      this._onErrorSubscription = null;
      this.changeDetectorRef = componentRef.changeDetectorRef;
      this.elementRef = componentRef.location;
      this.debugElement = _angular_core.getDebugNode(this.elementRef.nativeElement);
      this.componentInstance = componentRef.instance;
      this.nativeElement = this.elementRef.nativeElement;
      this.componentRef = componentRef;
      this.ngZone = ngZone;
      if (ngZone) {
        this._onUnstableSubscription = ngZone.onUnstable.subscribe({next: function() {
            _this._isStable = false;
          }});
        this._onMicrotaskEmptySubscription = ngZone.onMicrotaskEmpty.subscribe({next: function() {
            if (_this._autoDetect) {
              _this.detectChanges(true);
            }
          }});
        this._onStableSubscription = ngZone.onStable.subscribe({next: function() {
            _this._isStable = true;
            if (_this._promise !== null) {
              scheduleMicroTask(function() {
                if (!ngZone.hasPendingMacrotasks) {
                  if (_this._promise !== null) {
                    _this._resolve(true);
                    _this._resolve = null;
                    _this._promise = null;
                  }
                }
              });
            }
          }});
        this._onErrorSubscription = ngZone.onError.subscribe({next: function(error) {
            throw error;
          }});
      }
    }
    ComponentFixture.prototype._tick = function(checkNoChanges) {
      this.changeDetectorRef.detectChanges();
      if (checkNoChanges) {
        this.checkNoChanges();
      }
    };
    ComponentFixture.prototype.detectChanges = function(checkNoChanges) {
      var _this = this;
      if (checkNoChanges === void 0) {
        checkNoChanges = true;
      }
      if (this.ngZone != null) {
        this.ngZone.run(function() {
          _this._tick(checkNoChanges);
        });
      } else {
        this._tick(checkNoChanges);
      }
    };
    ComponentFixture.prototype.checkNoChanges = function() {
      this.changeDetectorRef.checkNoChanges();
    };
    ComponentFixture.prototype.autoDetectChanges = function(autoDetect) {
      if (autoDetect === void 0) {
        autoDetect = true;
      }
      if (this.ngZone == null) {
        throw new Error('Cannot call autoDetectChanges when ComponentFixtureNoNgZone is set');
      }
      this._autoDetect = autoDetect;
      this.detectChanges();
    };
    ComponentFixture.prototype.isStable = function() {
      return this._isStable && !this.ngZone.hasPendingMacrotasks;
    };
    ComponentFixture.prototype.whenStable = function() {
      var _this = this;
      if (this.isStable()) {
        return Promise.resolve(false);
      } else if (this._promise !== null) {
        return this._promise;
      } else {
        this._promise = new Promise(function(res) {
          _this._resolve = res;
        });
        return this._promise;
      }
    };
    ComponentFixture.prototype._getRenderer = function() {
      if (this._renderer === undefined) {
        this._renderer = this.componentRef.injector.get(_angular_core.RendererFactory2, null);
      }
      return this._renderer;
    };
    ComponentFixture.prototype.whenRenderingDone = function() {
      var renderer = this._getRenderer();
      if (renderer && renderer.whenRenderingDone) {
        return renderer.whenRenderingDone();
      }
      return this.whenStable();
    };
    ComponentFixture.prototype.destroy = function() {
      if (!this._isDestroyed) {
        this.componentRef.destroy();
        if (this._onUnstableSubscription != null) {
          this._onUnstableSubscription.unsubscribe();
          this._onUnstableSubscription = null;
        }
        if (this._onStableSubscription != null) {
          this._onStableSubscription.unsubscribe();
          this._onStableSubscription = null;
        }
        if (this._onMicrotaskEmptySubscription != null) {
          this._onMicrotaskEmptySubscription.unsubscribe();
          this._onMicrotaskEmptySubscription = null;
        }
        if (this._onErrorSubscription != null) {
          this._onErrorSubscription.unsubscribe();
          this._onErrorSubscription = null;
        }
        this._isDestroyed = true;
      }
    };
    return ComponentFixture;
  }());
  function scheduleMicroTask(fn) {
    Zone.current.scheduleMicroTask('scheduleMicrotask', fn);
  }
  var FakeAsyncTestZoneSpec = Zone['FakeAsyncTestZoneSpec'];
  var ProxyZoneSpec = Zone['ProxyZoneSpec'];
  var _fakeAsyncTestZoneSpec = null;
  function resetFakeAsyncZone() {
    _fakeAsyncTestZoneSpec = null;
    ProxyZoneSpec.assertPresent().resetDelegate();
  }
  var _inFakeAsyncCall = false;
  function fakeAsync(fn) {
    return function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      var proxyZoneSpec = ProxyZoneSpec.assertPresent();
      if (_inFakeAsyncCall) {
        throw new Error('fakeAsync() calls can not be nested');
      }
      _inFakeAsyncCall = true;
      try {
        if (!_fakeAsyncTestZoneSpec) {
          if (proxyZoneSpec.getDelegate() instanceof FakeAsyncTestZoneSpec) {
            throw new Error('fakeAsync() calls can not be nested');
          }
          _fakeAsyncTestZoneSpec = new FakeAsyncTestZoneSpec();
        }
        var res = void 0;
        var lastProxyZoneSpec = proxyZoneSpec.getDelegate();
        proxyZoneSpec.setDelegate(_fakeAsyncTestZoneSpec);
        try {
          res = fn.apply(this, args);
          flushMicrotasks();
        } finally {
          proxyZoneSpec.setDelegate(lastProxyZoneSpec);
        }
        if (_fakeAsyncTestZoneSpec.pendingPeriodicTimers.length > 0) {
          throw new Error(_fakeAsyncTestZoneSpec.pendingPeriodicTimers.length + " " + "periodic timer(s) still in the queue.");
        }
        if (_fakeAsyncTestZoneSpec.pendingTimers.length > 0) {
          throw new Error(_fakeAsyncTestZoneSpec.pendingTimers.length + " timer(s) still in the queue.");
        }
        return res;
      } finally {
        _inFakeAsyncCall = false;
        resetFakeAsyncZone();
      }
    };
  }
  function _getFakeAsyncZoneSpec() {
    if (_fakeAsyncTestZoneSpec == null) {
      throw new Error('The code should be running in the fakeAsync zone to call this function');
    }
    return _fakeAsyncTestZoneSpec;
  }
  function tick(millis) {
    if (millis === void 0) {
      millis = 0;
    }
    _getFakeAsyncZoneSpec().tick(millis);
  }
  function flush(maxTurns) {
    return _getFakeAsyncZoneSpec().flush(maxTurns);
  }
  function discardPeriodicTasks() {
    var zoneSpec = _getFakeAsyncZoneSpec();
    var pendingTimers = zoneSpec.pendingPeriodicTimers;
    zoneSpec.pendingPeriodicTimers.length = 0;
  }
  function flushMicrotasks() {
    _getFakeAsyncZoneSpec().flushMicrotasks();
  }
  var AsyncTestCompleter = (function() {
    function AsyncTestCompleter() {
      var _this = this;
      this._promise = new Promise(function(res, rej) {
        _this._resolve = res;
        _this._reject = rej;
      });
    }
    AsyncTestCompleter.prototype.done = function(value) {
      this._resolve(value);
    };
    AsyncTestCompleter.prototype.fail = function(error, stackTrace) {
      this._reject(error);
    };
    Object.defineProperty(AsyncTestCompleter.prototype, "promise", {
      get: function() {
        return this._promise;
      },
      enumerable: true,
      configurable: true
    });
    return AsyncTestCompleter;
  }());
  function unimplemented() {
    throw Error('unimplemented');
  }
  var TestingCompiler = (function(_super) {
    __extends(TestingCompiler, _super);
    function TestingCompiler() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(TestingCompiler.prototype, "injector", {
      get: function() {
        throw unimplemented();
      },
      enumerable: true,
      configurable: true
    });
    TestingCompiler.prototype.overrideModule = function(module, overrides) {
      throw unimplemented();
    };
    TestingCompiler.prototype.overrideDirective = function(directive, overrides) {
      throw unimplemented();
    };
    TestingCompiler.prototype.overrideComponent = function(component, overrides) {
      throw unimplemented();
    };
    TestingCompiler.prototype.overridePipe = function(directive, overrides) {
      throw unimplemented();
    };
    TestingCompiler.prototype.loadAotSummaries = function(summaries) {
      throw unimplemented();
    };
    TestingCompiler.prototype.getComponentFactory = function(component) {
      throw unimplemented();
    };
    return TestingCompiler;
  }(_angular_core.Compiler));
  var TestingCompilerFactory = (function() {
    function TestingCompilerFactory() {}
    return TestingCompilerFactory;
  }());
  var UNDEFINED = new Object();
  var TestComponentRenderer = (function() {
    function TestComponentRenderer() {}
    TestComponentRenderer.prototype.insertRootElement = function(rootElementId) {};
    return TestComponentRenderer;
  }());
  var _nextRootElementId = 0;
  var ComponentFixtureAutoDetect = new _angular_core.InjectionToken('ComponentFixtureAutoDetect');
  var ComponentFixtureNoNgZone = new _angular_core.InjectionToken('ComponentFixtureNoNgZone');
  var TestBed = (function() {
    function TestBed() {
      this._instantiated = false;
      this._compiler = null;
      this._moduleRef = null;
      this._moduleFactory = null;
      this._compilerOptions = [];
      this._moduleOverrides = [];
      this._componentOverrides = [];
      this._directiveOverrides = [];
      this._pipeOverrides = [];
      this._providers = [];
      this._declarations = [];
      this._imports = [];
      this._schemas = [];
      this._activeFixtures = [];
      this._aotSummaries = function() {
        return [];
      };
      this.platform = null;
      this.ngModule = null;
    }
    TestBed.initTestEnvironment = function(ngModule, platform, aotSummaries) {
      var testBed = getTestBed();
      testBed.initTestEnvironment(ngModule, platform, aotSummaries);
      return testBed;
    };
    TestBed.resetTestEnvironment = function() {
      getTestBed().resetTestEnvironment();
    };
    TestBed.resetTestingModule = function() {
      getTestBed().resetTestingModule();
      return TestBed;
    };
    TestBed.configureCompiler = function(config) {
      getTestBed().configureCompiler(config);
      return TestBed;
    };
    TestBed.configureTestingModule = function(moduleDef) {
      getTestBed().configureTestingModule(moduleDef);
      return TestBed;
    };
    TestBed.compileComponents = function() {
      return getTestBed().compileComponents();
    };
    TestBed.overrideModule = function(ngModule, override) {
      getTestBed().overrideModule(ngModule, override);
      return TestBed;
    };
    TestBed.overrideComponent = function(component, override) {
      getTestBed().overrideComponent(component, override);
      return TestBed;
    };
    TestBed.overrideDirective = function(directive, override) {
      getTestBed().overrideDirective(directive, override);
      return TestBed;
    };
    TestBed.overridePipe = function(pipe, override) {
      getTestBed().overridePipe(pipe, override);
      return TestBed;
    };
    TestBed.overrideTemplate = function(component, template) {
      getTestBed().overrideComponent(component, {set: {
          template: template,
          templateUrl: null
        }});
      return TestBed;
    };
    TestBed.overrideProvider = function(token, provider) {
      getTestBed().overrideProvider(token, provider);
      return TestBed;
    };
    TestBed.get = function(token, notFoundValue) {
      if (notFoundValue === void 0) {
        notFoundValue = _angular_core.Injector.THROW_IF_NOT_FOUND;
      }
      return getTestBed().get(token, notFoundValue);
    };
    TestBed.createComponent = function(component) {
      return getTestBed().createComponent(component);
    };
    TestBed.prototype.initTestEnvironment = function(ngModule, platform, aotSummaries) {
      if (this.platform || this.ngModule) {
        throw new Error('Cannot set base providers because it has already been called');
      }
      this.platform = platform;
      this.ngModule = ngModule;
      if (aotSummaries) {
        this._aotSummaries = aotSummaries;
      }
    };
    TestBed.prototype.resetTestEnvironment = function() {
      this.resetTestingModule();
      this.platform = null;
      this.ngModule = null;
      this._aotSummaries = function() {
        return [];
      };
    };
    TestBed.prototype.resetTestingModule = function() {
      _angular_core.ɵclearProviderOverrides();
      this._compiler = null;
      this._moduleOverrides = [];
      this._componentOverrides = [];
      this._directiveOverrides = [];
      this._pipeOverrides = [];
      this._moduleRef = null;
      this._moduleFactory = null;
      this._compilerOptions = [];
      this._providers = [];
      this._declarations = [];
      this._imports = [];
      this._schemas = [];
      this._instantiated = false;
      this._activeFixtures.forEach(function(fixture) {
        try {
          fixture.destroy();
        } catch (e) {
          console.error('Error during cleanup of component', fixture.componentInstance);
        }
      });
      this._activeFixtures = [];
    };
    TestBed.prototype.configureCompiler = function(config) {
      this._assertNotInstantiated('TestBed.configureCompiler', 'configure the compiler');
      this._compilerOptions.push(config);
    };
    TestBed.prototype.configureTestingModule = function(moduleDef) {
      this._assertNotInstantiated('TestBed.configureTestingModule', 'configure the test module');
      if (moduleDef.providers) {
        (_a = this._providers).push.apply(_a, moduleDef.providers);
      }
      if (moduleDef.declarations) {
        (_b = this._declarations).push.apply(_b, moduleDef.declarations);
      }
      if (moduleDef.imports) {
        (_c = this._imports).push.apply(_c, moduleDef.imports);
      }
      if (moduleDef.schemas) {
        (_d = this._schemas).push.apply(_d, moduleDef.schemas);
      }
      var _a,
          _b,
          _c,
          _d;
    };
    TestBed.prototype.compileComponents = function() {
      var _this = this;
      if (this._moduleFactory || this._instantiated) {
        return Promise.resolve(null);
      }
      var moduleType = this._createCompilerAndModule();
      return this._compiler.compileModuleAndAllComponentsAsync(moduleType).then(function(moduleAndComponentFactories) {
        _this._moduleFactory = moduleAndComponentFactories.ngModuleFactory;
      });
    };
    TestBed.prototype._initIfNeeded = function() {
      if (this._instantiated) {
        return;
      }
      if (!this._moduleFactory) {
        try {
          var moduleType = this._createCompilerAndModule();
          this._moduleFactory = this._compiler.compileModuleAndAllComponentsSync(moduleType).ngModuleFactory;
        } catch (e) {
          if (getComponentType(e)) {
            throw new Error("This test module uses the component " + _angular_core.ɵstringify(getComponentType(e)) + " which is using a \"templateUrl\" or \"styleUrls\", but they were never compiled. " + "Please call \"TestBed.compileComponents\" before your test.");
          } else {
            throw e;
          }
        }
      }
      var ngZone = new _angular_core.NgZone({enableLongStackTrace: true});
      var ngZoneInjector = _angular_core.ReflectiveInjector.resolveAndCreate([{
        provide: _angular_core.NgZone,
        useValue: ngZone
      }], this.platform.injector);
      this._moduleRef = this._moduleFactory.create(ngZoneInjector);
      this._moduleRef.injector.get(_angular_core.ApplicationInitStatus).runInitializers();
      this._instantiated = true;
    };
    TestBed.prototype._createCompilerAndModule = function() {
      var _this = this;
      var providers = this._providers.concat([{
        provide: TestBed,
        useValue: this
      }]);
      var declarations = this._declarations;
      var imports = [this.ngModule, this._imports];
      var schemas = this._schemas;
      var DynamicTestModule = (function() {
        function DynamicTestModule() {}
        return DynamicTestModule;
      }());
      DynamicTestModule.decorators = [{
        type: _angular_core.NgModule,
        args: [{
          providers: providers,
          declarations: declarations,
          imports: imports,
          schemas: schemas
        }]
      }];
      DynamicTestModule.ctorParameters = function() {
        return [];
      };
      var compilerFactory = this.platform.injector.get(TestingCompilerFactory);
      this._compiler = compilerFactory.createTestingCompiler(this._compilerOptions.concat([{useDebug: true}]));
      this._compiler.loadAotSummaries(this._aotSummaries);
      this._moduleOverrides.forEach(function(entry) {
        return _this._compiler.overrideModule(entry[0], entry[1]);
      });
      this._componentOverrides.forEach(function(entry) {
        return _this._compiler.overrideComponent(entry[0], entry[1]);
      });
      this._directiveOverrides.forEach(function(entry) {
        return _this._compiler.overrideDirective(entry[0], entry[1]);
      });
      this._pipeOverrides.forEach(function(entry) {
        return _this._compiler.overridePipe(entry[0], entry[1]);
      });
      return DynamicTestModule;
    };
    TestBed.prototype._assertNotInstantiated = function(methodName, methodDescription) {
      if (this._instantiated) {
        throw new Error("Cannot " + methodDescription + " when the test module has already been instantiated. " + ("Make sure you are not using `inject` before `" + methodName + "`."));
      }
    };
    TestBed.prototype.get = function(token, notFoundValue) {
      if (notFoundValue === void 0) {
        notFoundValue = _angular_core.Injector.THROW_IF_NOT_FOUND;
      }
      this._initIfNeeded();
      if (token === TestBed) {
        return this;
      }
      var result = this._moduleRef.injector.get(token, UNDEFINED);
      return result === UNDEFINED ? this._compiler.injector.get(token, notFoundValue) : result;
    };
    TestBed.prototype.execute = function(tokens, fn, context) {
      var _this = this;
      this._initIfNeeded();
      var params = tokens.map(function(t) {
        return _this.get(t);
      });
      return fn.apply(context, params);
    };
    TestBed.prototype.overrideModule = function(ngModule, override) {
      this._assertNotInstantiated('overrideModule', 'override module metadata');
      this._moduleOverrides.push([ngModule, override]);
    };
    TestBed.prototype.overrideComponent = function(component, override) {
      this._assertNotInstantiated('overrideComponent', 'override component metadata');
      this._componentOverrides.push([component, override]);
    };
    TestBed.prototype.overrideDirective = function(directive, override) {
      this._assertNotInstantiated('overrideDirective', 'override directive metadata');
      this._directiveOverrides.push([directive, override]);
    };
    TestBed.prototype.overridePipe = function(pipe, override) {
      this._assertNotInstantiated('overridePipe', 'override pipe metadata');
      this._pipeOverrides.push([pipe, override]);
    };
    TestBed.prototype.overrideProvider = function(token, provider) {
      var flags = 0;
      var value;
      if (provider.useFactory) {
        flags |= 1024;
        value = provider.useFactory;
      } else {
        flags |= 256;
        value = provider.useValue;
      }
      var deps = (provider.deps || []).map(function(dep) {
        var depFlags = 0;
        var depToken;
        if (Array.isArray(dep)) {
          dep.forEach(function(entry) {
            if (entry instanceof _angular_core.Optional) {
              depFlags |= 2;
            } else if (entry instanceof _angular_core.SkipSelf) {
              depFlags |= 1;
            } else {
              depToken = entry;
            }
          });
        } else {
          depToken = dep;
        }
        return [depFlags, depToken];
      });
      _angular_core.ɵoverrideProvider({
        token: token,
        flags: flags,
        deps: deps,
        value: value
      });
    };
    TestBed.prototype.createComponent = function(component) {
      var _this = this;
      this._initIfNeeded();
      var componentFactory = this._compiler.getComponentFactory(component);
      if (!componentFactory) {
        throw new Error("Cannot create the component " + _angular_core.ɵstringify(component) + " as it was not imported into the testing module!");
      }
      var noNgZone = this.get(ComponentFixtureNoNgZone, false);
      var autoDetect = this.get(ComponentFixtureAutoDetect, false);
      var ngZone = noNgZone ? null : this.get(_angular_core.NgZone, null);
      var testComponentRenderer = this.get(TestComponentRenderer);
      var rootElId = "root" + _nextRootElementId++;
      testComponentRenderer.insertRootElement(rootElId);
      var initComponent = function() {
        var componentRef = componentFactory.create(_angular_core.Injector.NULL, [], "#" + rootElId, _this._moduleRef);
        return new ComponentFixture(componentRef, ngZone, autoDetect);
      };
      var fixture = !ngZone ? initComponent() : ngZone.run(initComponent);
      this._activeFixtures.push(fixture);
      return fixture;
    };
    return TestBed;
  }());
  var _testBed = null;
  function getTestBed() {
    return _testBed = _testBed || new TestBed();
  }
  function inject(tokens, fn) {
    var testBed = getTestBed();
    if (tokens.indexOf(AsyncTestCompleter) >= 0) {
      return function() {
        var _this = this;
        return testBed.compileComponents().then(function() {
          var completer = testBed.get(AsyncTestCompleter);
          testBed.execute(tokens, fn, _this);
          return completer.promise;
        });
      };
    } else {
      return function() {
        return testBed.execute(tokens, fn, this);
      };
    }
  }
  var InjectSetupWrapper = (function() {
    function InjectSetupWrapper(_moduleDef) {
      this._moduleDef = _moduleDef;
    }
    InjectSetupWrapper.prototype._addModule = function() {
      var moduleDef = this._moduleDef();
      if (moduleDef) {
        getTestBed().configureTestingModule(moduleDef);
      }
    };
    InjectSetupWrapper.prototype.inject = function(tokens, fn) {
      var self = this;
      return function() {
        self._addModule();
        return inject(tokens, fn).call(this);
      };
    };
    return InjectSetupWrapper;
  }());
  function withModule(moduleDef, fn) {
    if (fn) {
      return function() {
        var testBed = getTestBed();
        if (moduleDef) {
          testBed.configureTestingModule(moduleDef);
        }
        return fn.apply(this);
      };
    }
    return new InjectSetupWrapper(function() {
      return moduleDef;
    });
  }
  function getComponentType(error) {
    return error[_angular_core.ɵERROR_COMPONENT_TYPE];
  }
  var _global$1 = (typeof window === 'undefined' ? global : window);
  if (_global$1.beforeEach) {
    _global$1.beforeEach(function() {
      TestBed.resetTestingModule();
      resetFakeAsyncZone();
    });
  }
  var __core_private_testing_placeholder__ = '';
  exports.async = async;
  exports.ComponentFixture = ComponentFixture;
  exports.resetFakeAsyncZone = resetFakeAsyncZone;
  exports.fakeAsync = fakeAsync;
  exports.tick = tick;
  exports.flush = flush;
  exports.discardPeriodicTasks = discardPeriodicTasks;
  exports.flushMicrotasks = flushMicrotasks;
  exports.TestComponentRenderer = TestComponentRenderer;
  exports.ComponentFixtureAutoDetect = ComponentFixtureAutoDetect;
  exports.ComponentFixtureNoNgZone = ComponentFixtureNoNgZone;
  exports.TestBed = TestBed;
  exports.getTestBed = getTestBed;
  exports.inject = inject;
  exports.InjectSetupWrapper = InjectSetupWrapper;
  exports.withModule = withModule;
  exports.__core_private_testing_placeholder__ = __core_private_testing_placeholder__;
  exports.ɵTestingCompiler = TestingCompiler;
  exports.ɵTestingCompilerFactory = TestingCompilerFactory;
  Object.defineProperty(exports, '__esModule', {value: true});
})));
