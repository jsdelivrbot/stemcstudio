/* */ 
"format cjs";
(function(process) {
  (function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof define === 'function' && define.amd ? define('@angular/compiler', ['exports'], factory) : (factory((global.ng = global.ng || {}, global.ng.compiler = {})));
  }(this, (function(exports) {
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
    var __assign = Object.assign || function __assign(t) {
      for (var s,
          i = 1,
          n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    };
    function Inject() {}
    var createInject = makeMetadataFactory('Inject', function(token) {
      return ({token: token});
    });
    var createInjectionToken = makeMetadataFactory('InjectionToken', function(desc) {
      return ({_desc: desc});
    });
    function Attribute() {}
    var createAttribute = makeMetadataFactory('Attribute', function(attributeName) {
      return ({attributeName: attributeName});
    });
    function Query() {}
    var createContentChildren = makeMetadataFactory('ContentChildren', function(selector, data) {
      if (data === void 0) {
        data = {};
      }
      return (__assign({
        selector: selector,
        first: false,
        isViewQuery: false,
        descendants: false
      }, data));
    });
    var createContentChild = makeMetadataFactory('ContentChild', function(selector, data) {
      if (data === void 0) {
        data = {};
      }
      return (__assign({
        selector: selector,
        first: true,
        isViewQuery: false,
        descendants: true
      }, data));
    });
    var createViewChildren = makeMetadataFactory('ViewChildren', function(selector, data) {
      if (data === void 0) {
        data = {};
      }
      return (__assign({
        selector: selector,
        first: false,
        isViewQuery: true,
        descendants: true
      }, data));
    });
    var createViewChild = makeMetadataFactory('ViewChild', function(selector, data) {
      return (__assign({
        selector: selector,
        first: true,
        isViewQuery: true,
        descendants: true
      }, data));
    });
    function Directive() {}
    var createDirective = makeMetadataFactory('Directive', function(dir) {
      if (dir === void 0) {
        dir = {};
      }
      return dir;
    });
    function Component() {}
    var ViewEncapsulation = {
      Emulated: 0,
      Native: 1,
      None: 2
    };
    ViewEncapsulation[ViewEncapsulation.Emulated] = "Emulated";
    ViewEncapsulation[ViewEncapsulation.Native] = "Native";
    ViewEncapsulation[ViewEncapsulation.None] = "None";
    var ChangeDetectionStrategy = {
      OnPush: 0,
      Default: 1
    };
    ChangeDetectionStrategy[ChangeDetectionStrategy.OnPush] = "OnPush";
    ChangeDetectionStrategy[ChangeDetectionStrategy.Default] = "Default";
    var createComponent = makeMetadataFactory('Component', function(c) {
      if (c === void 0) {
        c = {};
      }
      return (__assign({changeDetection: ChangeDetectionStrategy.Default}, c));
    });
    function Pipe() {}
    var createPipe = makeMetadataFactory('Pipe', function(p) {
      return (__assign({pure: true}, p));
    });
    function Input() {}
    var createInput = makeMetadataFactory('Input', function(bindingPropertyName) {
      return ({bindingPropertyName: bindingPropertyName});
    });
    function Output() {}
    var createOutput = makeMetadataFactory('Output', function(bindingPropertyName) {
      return ({bindingPropertyName: bindingPropertyName});
    });
    function HostBinding() {}
    var createHostBinding = makeMetadataFactory('HostBinding', function(hostPropertyName) {
      return ({hostPropertyName: hostPropertyName});
    });
    function HostListener() {}
    var createHostListener = makeMetadataFactory('HostListener', function(eventName, args) {
      return ({
        eventName: eventName,
        args: args
      });
    });
    function NgModule() {}
    var createNgModule = makeMetadataFactory('NgModule', function(ngModule) {
      return ngModule;
    });
    function ModuleWithProviders() {}
    function SchemaMetadata() {}
    var CUSTOM_ELEMENTS_SCHEMA = {name: 'custom-elements'};
    var NO_ERRORS_SCHEMA = {name: 'no-errors-schema'};
    var createOptional = makeMetadataFactory('Optional');
    var createInjectable = makeMetadataFactory('Injectable');
    var createSelf = makeMetadataFactory('Self');
    var createSkipSelf = makeMetadataFactory('SkipSelf');
    var createHost = makeMetadataFactory('Host');
    var Type = Function;
    var SecurityContext = {
      NONE: 0,
      HTML: 1,
      STYLE: 2,
      SCRIPT: 3,
      URL: 4,
      RESOURCE_URL: 5
    };
    SecurityContext[SecurityContext.NONE] = "NONE";
    SecurityContext[SecurityContext.HTML] = "HTML";
    SecurityContext[SecurityContext.STYLE] = "STYLE";
    SecurityContext[SecurityContext.SCRIPT] = "SCRIPT";
    SecurityContext[SecurityContext.URL] = "URL";
    SecurityContext[SecurityContext.RESOURCE_URL] = "RESOURCE_URL";
    var NodeFlags = {
      None: 0,
      TypeElement: 1,
      TypeText: 2,
      ProjectedTemplate: 4,
      CatRenderNode: 3,
      TypeNgContent: 8,
      TypePipe: 16,
      TypePureArray: 32,
      TypePureObject: 64,
      TypePurePipe: 128,
      CatPureExpression: 224,
      TypeValueProvider: 256,
      TypeClassProvider: 512,
      TypeFactoryProvider: 1024,
      TypeUseExistingProvider: 2048,
      LazyProvider: 4096,
      PrivateProvider: 8192,
      TypeDirective: 16384,
      Component: 32768,
      CatProviderNoDirective: 3840,
      CatProvider: 20224,
      OnInit: 65536,
      OnDestroy: 131072,
      DoCheck: 262144,
      OnChanges: 524288,
      AfterContentInit: 1048576,
      AfterContentChecked: 2097152,
      AfterViewInit: 4194304,
      AfterViewChecked: 8388608,
      EmbeddedViews: 16777216,
      ComponentView: 33554432,
      TypeContentQuery: 67108864,
      TypeViewQuery: 134217728,
      StaticQuery: 268435456,
      DynamicQuery: 536870912,
      CatQuery: 201326592,
      Types: 201347067
    };
    var DepFlags = {
      None: 0,
      SkipSelf: 1,
      Optional: 2,
      Value: 8
    };
    var ArgumentType = {
      Inline: 0,
      Dynamic: 1
    };
    var BindingFlags = {
      TypeElementAttribute: 1,
      TypeElementClass: 2,
      TypeElementStyle: 4,
      TypeProperty: 8,
      SyntheticProperty: 16,
      SyntheticHostProperty: 32,
      CatSyntheticProperty: 48,
      Types: 15
    };
    var QueryBindingType = {
      First: 0,
      All: 1
    };
    var QueryValueType = {
      ElementRef: 0,
      RenderElement: 1,
      TemplateRef: 2,
      ViewContainerRef: 3,
      Provider: 4
    };
    var ViewFlags = {
      None: 0,
      OnPush: 2
    };
    var MissingTranslationStrategy = {
      Error: 0,
      Warning: 1,
      Ignore: 2
    };
    MissingTranslationStrategy[MissingTranslationStrategy.Error] = "Error";
    MissingTranslationStrategy[MissingTranslationStrategy.Warning] = "Warning";
    MissingTranslationStrategy[MissingTranslationStrategy.Ignore] = "Ignore";
    function MetadataFactory() {}
    function makeMetadataFactory(name, props) {
      var factory = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        var values = props ? props.apply(void 0, args) : {};
        return __assign({ngMetadataName: name}, values);
      };
      factory.isTypeOf = function(obj) {
        return obj && obj.ngMetadataName === name;
      };
      factory.ngMetadataName = name;
      return factory;
    }
    function Route() {}
    var core = Object.freeze({
      Inject: Inject,
      createInject: createInject,
      createInjectionToken: createInjectionToken,
      Attribute: Attribute,
      createAttribute: createAttribute,
      Query: Query,
      createContentChildren: createContentChildren,
      createContentChild: createContentChild,
      createViewChildren: createViewChildren,
      createViewChild: createViewChild,
      Directive: Directive,
      createDirective: createDirective,
      Component: Component,
      ViewEncapsulation: ViewEncapsulation,
      ChangeDetectionStrategy: ChangeDetectionStrategy,
      createComponent: createComponent,
      Pipe: Pipe,
      createPipe: createPipe,
      Input: Input,
      createInput: createInput,
      Output: Output,
      createOutput: createOutput,
      HostBinding: HostBinding,
      createHostBinding: createHostBinding,
      HostListener: HostListener,
      createHostListener: createHostListener,
      NgModule: NgModule,
      createNgModule: createNgModule,
      ModuleWithProviders: ModuleWithProviders,
      SchemaMetadata: SchemaMetadata,
      CUSTOM_ELEMENTS_SCHEMA: CUSTOM_ELEMENTS_SCHEMA,
      NO_ERRORS_SCHEMA: NO_ERRORS_SCHEMA,
      createOptional: createOptional,
      createInjectable: createInjectable,
      createSelf: createSelf,
      createSkipSelf: createSkipSelf,
      createHost: createHost,
      Type: Type,
      SecurityContext: SecurityContext,
      NodeFlags: NodeFlags,
      DepFlags: DepFlags,
      ArgumentType: ArgumentType,
      BindingFlags: BindingFlags,
      QueryBindingType: QueryBindingType,
      QueryValueType: QueryValueType,
      ViewFlags: ViewFlags,
      MissingTranslationStrategy: MissingTranslationStrategy,
      MetadataFactory: MetadataFactory,
      Route: Route
    });
    var DASH_CASE_REGEXP = /-+([a-z0-9])/g;
    function dashCaseToCamelCase(input) {
      return input.replace(DASH_CASE_REGEXP, function() {
        var m = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          m[_i] = arguments[_i];
        }
        return m[1].toUpperCase();
      });
    }
    function splitAtColon(input, defaultValues) {
      return _splitAt(input, ':', defaultValues);
    }
    function splitAtPeriod(input, defaultValues) {
      return _splitAt(input, '.', defaultValues);
    }
    function _splitAt(input, character, defaultValues) {
      var characterIndex = input.indexOf(character);
      if (characterIndex == -1)
        return defaultValues;
      return [input.slice(0, characterIndex).trim(), input.slice(characterIndex + 1).trim()];
    }
    function visitValue(value, visitor, context) {
      if (Array.isArray(value)) {
        return visitor.visitArray((value), context);
      }
      if (isStrictStringMap(value)) {
        return visitor.visitStringMap((value), context);
      }
      if (value == null || typeof value == 'string' || typeof value == 'number' || typeof value == 'boolean') {
        return visitor.visitPrimitive(value, context);
      }
      return visitor.visitOther(value, context);
    }
    function isDefined(val) {
      return val !== null && val !== undefined;
    }
    function noUndefined(val) {
      return val === undefined ? ((null)) : val;
    }
    var ValueTransformer = (function() {
      function ValueTransformer() {}
      ValueTransformer.prototype.visitArray = function(arr, context) {
        var _this = this;
        return arr.map(function(value) {
          return visitValue(value, _this, context);
        });
      };
      ValueTransformer.prototype.visitStringMap = function(map, context) {
        var _this = this;
        var result = {};
        Object.keys(map).forEach(function(key) {
          result[key] = visitValue(map[key], _this, context);
        });
        return result;
      };
      ValueTransformer.prototype.visitPrimitive = function(value, context) {
        return value;
      };
      ValueTransformer.prototype.visitOther = function(value, context) {
        return value;
      };
      return ValueTransformer;
    }());
    var SyncAsync = {
      assertSync: function(value) {
        if (isPromise(value)) {
          throw new Error("Illegal state: value cannot be a promise");
        }
        return value;
      },
      then: function(value, cb) {
        return isPromise(value) ? value.then(cb) : cb(value);
      },
      all: function(syncAsyncValues) {
        return syncAsyncValues.some(isPromise) ? Promise.all(syncAsyncValues) : (syncAsyncValues);
      }
    };
    function syntaxError(msg, parseErrors) {
      var error = Error(msg);
      ((error))[ERROR_SYNTAX_ERROR] = true;
      if (parseErrors)
        ((error))[ERROR_PARSE_ERRORS] = parseErrors;
      return error;
    }
    var ERROR_SYNTAX_ERROR = 'ngSyntaxError';
    var ERROR_PARSE_ERRORS = 'ngParseErrors';
    function isSyntaxError(error) {
      return ((error))[ERROR_SYNTAX_ERROR];
    }
    function getParseErrors(error) {
      return ((error))[ERROR_PARSE_ERRORS] || [];
    }
    function escapeRegExp(s) {
      return s.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
    }
    var STRING_MAP_PROTO = Object.getPrototypeOf({});
    function isStrictStringMap(obj) {
      return typeof obj === 'object' && obj !== null && Object.getPrototypeOf(obj) === STRING_MAP_PROTO;
    }
    function utf8Encode(str) {
      var encoded = '';
      for (var index = 0; index < str.length; index++) {
        var codePoint = str.charCodeAt(index);
        if (codePoint >= 0xd800 && codePoint <= 0xdbff && str.length > (index + 1)) {
          var low = str.charCodeAt(index + 1);
          if (low >= 0xdc00 && low <= 0xdfff) {
            index++;
            codePoint = ((codePoint - 0xd800) << 10) + low - 0xdc00 + 0x10000;
          }
        }
        if (codePoint <= 0x7f) {
          encoded += String.fromCharCode(codePoint);
        } else if (codePoint <= 0x7ff) {
          encoded += String.fromCharCode(((codePoint >> 6) & 0x1F) | 0xc0, (codePoint & 0x3f) | 0x80);
        } else if (codePoint <= 0xffff) {
          encoded += String.fromCharCode((codePoint >> 12) | 0xe0, ((codePoint >> 6) & 0x3f) | 0x80, (codePoint & 0x3f) | 0x80);
        } else if (codePoint <= 0x1fffff) {
          encoded += String.fromCharCode(((codePoint >> 18) & 0x07) | 0xf0, ((codePoint >> 12) & 0x3f) | 0x80, ((codePoint >> 6) & 0x3f) | 0x80, (codePoint & 0x3f) | 0x80);
        }
      }
      return encoded;
    }
    function stringify(token) {
      if (typeof token === 'string') {
        return token;
      }
      if (token instanceof Array) {
        return '[' + token.map(stringify).join(', ') + ']';
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
    function resolveForwardRef(type) {
      if (typeof type === 'function' && type.hasOwnProperty('__forward_ref__')) {
        return type();
      } else {
        return type;
      }
    }
    function isPromise(obj) {
      return !!obj && typeof obj.then === 'function';
    }
    var Version = (function() {
      function Version(full) {
        this.full = full;
        var splits = full.split('.');
        this.major = splits[0];
        this.minor = splits[1];
        this.patch = splits.slice(2).join('.');
      }
      return Version;
    }());
    var VERSION = new Version('5.2.9');
    var TextAst = (function() {
      function TextAst(value, ngContentIndex, sourceSpan) {
        this.value = value;
        this.ngContentIndex = ngContentIndex;
        this.sourceSpan = sourceSpan;
      }
      TextAst.prototype.visit = function(visitor, context) {
        return visitor.visitText(this, context);
      };
      return TextAst;
    }());
    var BoundTextAst = (function() {
      function BoundTextAst(value, ngContentIndex, sourceSpan) {
        this.value = value;
        this.ngContentIndex = ngContentIndex;
        this.sourceSpan = sourceSpan;
      }
      BoundTextAst.prototype.visit = function(visitor, context) {
        return visitor.visitBoundText(this, context);
      };
      return BoundTextAst;
    }());
    var AttrAst = (function() {
      function AttrAst(name, value, sourceSpan) {
        this.name = name;
        this.value = value;
        this.sourceSpan = sourceSpan;
      }
      AttrAst.prototype.visit = function(visitor, context) {
        return visitor.visitAttr(this, context);
      };
      return AttrAst;
    }());
    var BoundElementPropertyAst = (function() {
      function BoundElementPropertyAst(name, type, securityContext, value, unit, sourceSpan) {
        this.name = name;
        this.type = type;
        this.securityContext = securityContext;
        this.value = value;
        this.unit = unit;
        this.sourceSpan = sourceSpan;
        this.isAnimation = this.type === PropertyBindingType.Animation;
      }
      BoundElementPropertyAst.prototype.visit = function(visitor, context) {
        return visitor.visitElementProperty(this, context);
      };
      return BoundElementPropertyAst;
    }());
    var BoundEventAst = (function() {
      function BoundEventAst(name, target, phase, handler, sourceSpan) {
        this.name = name;
        this.target = target;
        this.phase = phase;
        this.handler = handler;
        this.sourceSpan = sourceSpan;
        this.fullName = BoundEventAst.calcFullName(this.name, this.target, this.phase);
        this.isAnimation = !!this.phase;
      }
      BoundEventAst.calcFullName = function(name, target, phase) {
        if (target) {
          return target + ":" + name;
        } else if (phase) {
          return "@" + name + "." + phase;
        } else {
          return name;
        }
      };
      BoundEventAst.prototype.visit = function(visitor, context) {
        return visitor.visitEvent(this, context);
      };
      return BoundEventAst;
    }());
    var ReferenceAst = (function() {
      function ReferenceAst(name, value, sourceSpan) {
        this.name = name;
        this.value = value;
        this.sourceSpan = sourceSpan;
      }
      ReferenceAst.prototype.visit = function(visitor, context) {
        return visitor.visitReference(this, context);
      };
      return ReferenceAst;
    }());
    var VariableAst = (function() {
      function VariableAst(name, value, sourceSpan) {
        this.name = name;
        this.value = value;
        this.sourceSpan = sourceSpan;
      }
      VariableAst.prototype.visit = function(visitor, context) {
        return visitor.visitVariable(this, context);
      };
      return VariableAst;
    }());
    var ElementAst = (function() {
      function ElementAst(name, attrs, inputs, outputs, references, directives, providers, hasViewContainer, queryMatches, children, ngContentIndex, sourceSpan, endSourceSpan) {
        this.name = name;
        this.attrs = attrs;
        this.inputs = inputs;
        this.outputs = outputs;
        this.references = references;
        this.directives = directives;
        this.providers = providers;
        this.hasViewContainer = hasViewContainer;
        this.queryMatches = queryMatches;
        this.children = children;
        this.ngContentIndex = ngContentIndex;
        this.sourceSpan = sourceSpan;
        this.endSourceSpan = endSourceSpan;
      }
      ElementAst.prototype.visit = function(visitor, context) {
        return visitor.visitElement(this, context);
      };
      return ElementAst;
    }());
    var EmbeddedTemplateAst = (function() {
      function EmbeddedTemplateAst(attrs, outputs, references, variables, directives, providers, hasViewContainer, queryMatches, children, ngContentIndex, sourceSpan) {
        this.attrs = attrs;
        this.outputs = outputs;
        this.references = references;
        this.variables = variables;
        this.directives = directives;
        this.providers = providers;
        this.hasViewContainer = hasViewContainer;
        this.queryMatches = queryMatches;
        this.children = children;
        this.ngContentIndex = ngContentIndex;
        this.sourceSpan = sourceSpan;
      }
      EmbeddedTemplateAst.prototype.visit = function(visitor, context) {
        return visitor.visitEmbeddedTemplate(this, context);
      };
      return EmbeddedTemplateAst;
    }());
    var BoundDirectivePropertyAst = (function() {
      function BoundDirectivePropertyAst(directiveName, templateName, value, sourceSpan) {
        this.directiveName = directiveName;
        this.templateName = templateName;
        this.value = value;
        this.sourceSpan = sourceSpan;
      }
      BoundDirectivePropertyAst.prototype.visit = function(visitor, context) {
        return visitor.visitDirectiveProperty(this, context);
      };
      return BoundDirectivePropertyAst;
    }());
    var DirectiveAst = (function() {
      function DirectiveAst(directive, inputs, hostProperties, hostEvents, contentQueryStartId, sourceSpan) {
        this.directive = directive;
        this.inputs = inputs;
        this.hostProperties = hostProperties;
        this.hostEvents = hostEvents;
        this.contentQueryStartId = contentQueryStartId;
        this.sourceSpan = sourceSpan;
      }
      DirectiveAst.prototype.visit = function(visitor, context) {
        return visitor.visitDirective(this, context);
      };
      return DirectiveAst;
    }());
    var ProviderAst = (function() {
      function ProviderAst(token, multiProvider, eager, providers, providerType, lifecycleHooks, sourceSpan) {
        this.token = token;
        this.multiProvider = multiProvider;
        this.eager = eager;
        this.providers = providers;
        this.providerType = providerType;
        this.lifecycleHooks = lifecycleHooks;
        this.sourceSpan = sourceSpan;
      }
      ProviderAst.prototype.visit = function(visitor, context) {
        return null;
      };
      return ProviderAst;
    }());
    var ProviderAstType = {
      PublicService: 0,
      PrivateService: 1,
      Component: 2,
      Directive: 3,
      Builtin: 4
    };
    ProviderAstType[ProviderAstType.PublicService] = "PublicService";
    ProviderAstType[ProviderAstType.PrivateService] = "PrivateService";
    ProviderAstType[ProviderAstType.Component] = "Component";
    ProviderAstType[ProviderAstType.Directive] = "Directive";
    ProviderAstType[ProviderAstType.Builtin] = "Builtin";
    var NgContentAst = (function() {
      function NgContentAst(index, ngContentIndex, sourceSpan) {
        this.index = index;
        this.ngContentIndex = ngContentIndex;
        this.sourceSpan = sourceSpan;
      }
      NgContentAst.prototype.visit = function(visitor, context) {
        return visitor.visitNgContent(this, context);
      };
      return NgContentAst;
    }());
    var PropertyBindingType = {
      Property: 0,
      Attribute: 1,
      Class: 2,
      Style: 3,
      Animation: 4
    };
    PropertyBindingType[PropertyBindingType.Property] = "Property";
    PropertyBindingType[PropertyBindingType.Attribute] = "Attribute";
    PropertyBindingType[PropertyBindingType.Class] = "Class";
    PropertyBindingType[PropertyBindingType.Style] = "Style";
    PropertyBindingType[PropertyBindingType.Animation] = "Animation";
    var NullTemplateVisitor = (function() {
      function NullTemplateVisitor() {}
      NullTemplateVisitor.prototype.visitNgContent = function(ast, context) {};
      NullTemplateVisitor.prototype.visitEmbeddedTemplate = function(ast, context) {};
      NullTemplateVisitor.prototype.visitElement = function(ast, context) {};
      NullTemplateVisitor.prototype.visitReference = function(ast, context) {};
      NullTemplateVisitor.prototype.visitVariable = function(ast, context) {};
      NullTemplateVisitor.prototype.visitEvent = function(ast, context) {};
      NullTemplateVisitor.prototype.visitElementProperty = function(ast, context) {};
      NullTemplateVisitor.prototype.visitAttr = function(ast, context) {};
      NullTemplateVisitor.prototype.visitBoundText = function(ast, context) {};
      NullTemplateVisitor.prototype.visitText = function(ast, context) {};
      NullTemplateVisitor.prototype.visitDirective = function(ast, context) {};
      NullTemplateVisitor.prototype.visitDirectiveProperty = function(ast, context) {};
      return NullTemplateVisitor;
    }());
    var RecursiveTemplateAstVisitor = (function(_super) {
      __extends(RecursiveTemplateAstVisitor, _super);
      function RecursiveTemplateAstVisitor() {
        return _super.call(this) || this;
      }
      RecursiveTemplateAstVisitor.prototype.visitEmbeddedTemplate = function(ast, context) {
        return this.visitChildren(context, function(visit) {
          visit(ast.attrs);
          visit(ast.references);
          visit(ast.variables);
          visit(ast.directives);
          visit(ast.providers);
          visit(ast.children);
        });
      };
      RecursiveTemplateAstVisitor.prototype.visitElement = function(ast, context) {
        return this.visitChildren(context, function(visit) {
          visit(ast.attrs);
          visit(ast.inputs);
          visit(ast.outputs);
          visit(ast.references);
          visit(ast.directives);
          visit(ast.providers);
          visit(ast.children);
        });
      };
      RecursiveTemplateAstVisitor.prototype.visitDirective = function(ast, context) {
        return this.visitChildren(context, function(visit) {
          visit(ast.inputs);
          visit(ast.hostProperties);
          visit(ast.hostEvents);
        });
      };
      RecursiveTemplateAstVisitor.prototype.visitChildren = function(context, cb) {
        var results = [];
        var t = this;
        function visit(children) {
          if (children && children.length)
            results.push(templateVisitAll(t, children, context));
        }
        cb(visit);
        return [].concat.apply([], results);
      };
      return RecursiveTemplateAstVisitor;
    }(NullTemplateVisitor));
    function templateVisitAll(visitor, asts, context) {
      if (context === void 0) {
        context = null;
      }
      var result = [];
      var visit = visitor.visit ? function(ast) {
        return ((visitor.visit))(ast, context) || ast.visit(visitor, context);
      } : function(ast) {
        return ast.visit(visitor, context);
      };
      asts.forEach(function(ast) {
        var astResult = visit(ast);
        if (astResult) {
          result.push(astResult);
        }
      });
      return result;
    }
    var CompilerConfig = (function() {
      function CompilerConfig(_a) {
        var _b = _a === void 0 ? {} : _a,
            _c = _b.defaultEncapsulation,
            defaultEncapsulation = _c === void 0 ? ViewEncapsulation.Emulated : _c,
            _d = _b.useJit,
            useJit = _d === void 0 ? true : _d,
            _e = _b.jitDevMode,
            jitDevMode = _e === void 0 ? false : _e,
            _f = _b.missingTranslation,
            missingTranslation = _f === void 0 ? null : _f,
            enableLegacyTemplate = _b.enableLegacyTemplate,
            preserveWhitespaces = _b.preserveWhitespaces,
            strictInjectionParameters = _b.strictInjectionParameters;
        this.defaultEncapsulation = defaultEncapsulation;
        this.useJit = !!useJit;
        this.jitDevMode = !!jitDevMode;
        this.missingTranslation = missingTranslation;
        this.enableLegacyTemplate = enableLegacyTemplate === true;
        this.preserveWhitespaces = preserveWhitespacesDefault(noUndefined(preserveWhitespaces));
        this.strictInjectionParameters = strictInjectionParameters === true;
      }
      return CompilerConfig;
    }());
    function preserveWhitespacesDefault(preserveWhitespacesOption, defaultSetting) {
      if (defaultSetting === void 0) {
        defaultSetting = true;
      }
      return preserveWhitespacesOption === null ? defaultSetting : preserveWhitespacesOption;
    }
    var StaticSymbol = (function() {
      function StaticSymbol(filePath, name, members) {
        this.filePath = filePath;
        this.name = name;
        this.members = members;
      }
      StaticSymbol.prototype.assertNoMembers = function() {
        if (this.members.length) {
          throw new Error("Illegal state: symbol without members expected, but got " + JSON.stringify(this) + ".");
        }
      };
      return StaticSymbol;
    }());
    var StaticSymbolCache = (function() {
      function StaticSymbolCache() {
        this.cache = new Map();
      }
      StaticSymbolCache.prototype.get = function(declarationFile, name, members) {
        members = members || [];
        var memberSuffix = members.length ? "." + members.join('.') : '';
        var key = "\"" + declarationFile + "\"." + name + memberSuffix;
        var result = this.cache.get(key);
        if (!result) {
          result = new StaticSymbol(declarationFile, name, members);
          this.cache.set(key, result);
        }
        return result;
      };
      return StaticSymbolCache;
    }());
    var HOST_REG_EXP = /^(?:(?:\[([^\]]+)\])|(?:\(([^\)]+)\)))|(\@[-\w]+)$/;
    function _sanitizeIdentifier(name) {
      return name.replace(/\W/g, '_');
    }
    var _anonymousTypeIndex = 0;
    function identifierName(compileIdentifier) {
      if (!compileIdentifier || !compileIdentifier.reference) {
        return null;
      }
      var ref = compileIdentifier.reference;
      if (ref instanceof StaticSymbol) {
        return ref.name;
      }
      if (ref['__anonymousType']) {
        return ref['__anonymousType'];
      }
      var identifier = stringify(ref);
      if (identifier.indexOf('(') >= 0) {
        identifier = "anonymous_" + _anonymousTypeIndex++;
        ref['__anonymousType'] = identifier;
      } else {
        identifier = _sanitizeIdentifier(identifier);
      }
      return identifier;
    }
    function identifierModuleUrl(compileIdentifier) {
      var ref = compileIdentifier.reference;
      if (ref instanceof StaticSymbol) {
        return ref.filePath;
      }
      return "./" + stringify(ref);
    }
    function viewClassName(compType, embeddedTemplateIndex) {
      return "View_" + identifierName({reference: compType}) + "_" + embeddedTemplateIndex;
    }
    function rendererTypeName(compType) {
      return "RenderType_" + identifierName({reference: compType});
    }
    function hostViewClassName(compType) {
      return "HostView_" + identifierName({reference: compType});
    }
    function componentFactoryName(compType) {
      return identifierName({reference: compType}) + "NgFactory";
    }
    var CompileSummaryKind = {
      Pipe: 0,
      Directive: 1,
      NgModule: 2,
      Injectable: 3
    };
    CompileSummaryKind[CompileSummaryKind.Pipe] = "Pipe";
    CompileSummaryKind[CompileSummaryKind.Directive] = "Directive";
    CompileSummaryKind[CompileSummaryKind.NgModule] = "NgModule";
    CompileSummaryKind[CompileSummaryKind.Injectable] = "Injectable";
    function tokenName(token) {
      return token.value != null ? _sanitizeIdentifier(token.value) : identifierName(token.identifier);
    }
    function tokenReference(token) {
      if (token.identifier != null) {
        return token.identifier.reference;
      } else {
        return token.value;
      }
    }
    var CompileStylesheetMetadata = (function() {
      function CompileStylesheetMetadata(_a) {
        var _b = _a === void 0 ? {} : _a,
            moduleUrl = _b.moduleUrl,
            styles = _b.styles,
            styleUrls = _b.styleUrls;
        this.moduleUrl = moduleUrl || null;
        this.styles = _normalizeArray(styles);
        this.styleUrls = _normalizeArray(styleUrls);
      }
      return CompileStylesheetMetadata;
    }());
    var CompileTemplateMetadata = (function() {
      function CompileTemplateMetadata(_a) {
        var encapsulation = _a.encapsulation,
            template = _a.template,
            templateUrl = _a.templateUrl,
            htmlAst = _a.htmlAst,
            styles = _a.styles,
            styleUrls = _a.styleUrls,
            externalStylesheets = _a.externalStylesheets,
            animations = _a.animations,
            ngContentSelectors = _a.ngContentSelectors,
            interpolation = _a.interpolation,
            isInline = _a.isInline,
            preserveWhitespaces = _a.preserveWhitespaces;
        this.encapsulation = encapsulation;
        this.template = template;
        this.templateUrl = templateUrl;
        this.htmlAst = htmlAst;
        this.styles = _normalizeArray(styles);
        this.styleUrls = _normalizeArray(styleUrls);
        this.externalStylesheets = _normalizeArray(externalStylesheets);
        this.animations = animations ? flatten(animations) : [];
        this.ngContentSelectors = ngContentSelectors || [];
        if (interpolation && interpolation.length != 2) {
          throw new Error("'interpolation' should have a start and an end symbol.");
        }
        this.interpolation = interpolation;
        this.isInline = isInline;
        this.preserveWhitespaces = preserveWhitespaces;
      }
      CompileTemplateMetadata.prototype.toSummary = function() {
        return {
          ngContentSelectors: this.ngContentSelectors,
          encapsulation: this.encapsulation
        };
      };
      return CompileTemplateMetadata;
    }());
    var CompileDirectiveMetadata = (function() {
      function CompileDirectiveMetadata(_a) {
        var isHost = _a.isHost,
            type = _a.type,
            isComponent = _a.isComponent,
            selector = _a.selector,
            exportAs = _a.exportAs,
            changeDetection = _a.changeDetection,
            inputs = _a.inputs,
            outputs = _a.outputs,
            hostListeners = _a.hostListeners,
            hostProperties = _a.hostProperties,
            hostAttributes = _a.hostAttributes,
            providers = _a.providers,
            viewProviders = _a.viewProviders,
            queries = _a.queries,
            guards = _a.guards,
            viewQueries = _a.viewQueries,
            entryComponents = _a.entryComponents,
            template = _a.template,
            componentViewType = _a.componentViewType,
            rendererType = _a.rendererType,
            componentFactory = _a.componentFactory;
        this.isHost = !!isHost;
        this.type = type;
        this.isComponent = isComponent;
        this.selector = selector;
        this.exportAs = exportAs;
        this.changeDetection = changeDetection;
        this.inputs = inputs;
        this.outputs = outputs;
        this.hostListeners = hostListeners;
        this.hostProperties = hostProperties;
        this.hostAttributes = hostAttributes;
        this.providers = _normalizeArray(providers);
        this.viewProviders = _normalizeArray(viewProviders);
        this.queries = _normalizeArray(queries);
        this.guards = guards;
        this.viewQueries = _normalizeArray(viewQueries);
        this.entryComponents = _normalizeArray(entryComponents);
        this.template = template;
        this.componentViewType = componentViewType;
        this.rendererType = rendererType;
        this.componentFactory = componentFactory;
      }
      CompileDirectiveMetadata.create = function(_a) {
        var isHost = _a.isHost,
            type = _a.type,
            isComponent = _a.isComponent,
            selector = _a.selector,
            exportAs = _a.exportAs,
            changeDetection = _a.changeDetection,
            inputs = _a.inputs,
            outputs = _a.outputs,
            host = _a.host,
            providers = _a.providers,
            viewProviders = _a.viewProviders,
            queries = _a.queries,
            guards = _a.guards,
            viewQueries = _a.viewQueries,
            entryComponents = _a.entryComponents,
            template = _a.template,
            componentViewType = _a.componentViewType,
            rendererType = _a.rendererType,
            componentFactory = _a.componentFactory;
        var hostListeners = {};
        var hostProperties = {};
        var hostAttributes = {};
        if (host != null) {
          Object.keys(host).forEach(function(key) {
            var value = host[key];
            var matches = key.match(HOST_REG_EXP);
            if (matches === null) {
              hostAttributes[key] = value;
            } else if (matches[1] != null) {
              hostProperties[matches[1]] = value;
            } else if (matches[2] != null) {
              hostListeners[matches[2]] = value;
            }
          });
        }
        var inputsMap = {};
        if (inputs != null) {
          inputs.forEach(function(bindConfig) {
            var parts = splitAtColon(bindConfig, [bindConfig, bindConfig]);
            inputsMap[parts[0]] = parts[1];
          });
        }
        var outputsMap = {};
        if (outputs != null) {
          outputs.forEach(function(bindConfig) {
            var parts = splitAtColon(bindConfig, [bindConfig, bindConfig]);
            outputsMap[parts[0]] = parts[1];
          });
        }
        return new CompileDirectiveMetadata({
          isHost: isHost,
          type: type,
          isComponent: !!isComponent,
          selector: selector,
          exportAs: exportAs,
          changeDetection: changeDetection,
          inputs: inputsMap,
          outputs: outputsMap,
          hostListeners: hostListeners,
          hostProperties: hostProperties,
          hostAttributes: hostAttributes,
          providers: providers,
          viewProviders: viewProviders,
          queries: queries,
          guards: guards,
          viewQueries: viewQueries,
          entryComponents: entryComponents,
          template: template,
          componentViewType: componentViewType,
          rendererType: rendererType,
          componentFactory: componentFactory
        });
      };
      CompileDirectiveMetadata.prototype.toSummary = function() {
        return {
          summaryKind: CompileSummaryKind.Directive,
          type: this.type,
          isComponent: this.isComponent,
          selector: this.selector,
          exportAs: this.exportAs,
          inputs: this.inputs,
          outputs: this.outputs,
          hostListeners: this.hostListeners,
          hostProperties: this.hostProperties,
          hostAttributes: this.hostAttributes,
          providers: this.providers,
          viewProviders: this.viewProviders,
          queries: this.queries,
          guards: this.guards,
          viewQueries: this.viewQueries,
          entryComponents: this.entryComponents,
          changeDetection: this.changeDetection,
          template: this.template && this.template.toSummary(),
          componentViewType: this.componentViewType,
          rendererType: this.rendererType,
          componentFactory: this.componentFactory
        };
      };
      return CompileDirectiveMetadata;
    }());
    var CompilePipeMetadata = (function() {
      function CompilePipeMetadata(_a) {
        var type = _a.type,
            name = _a.name,
            pure = _a.pure;
        this.type = type;
        this.name = name;
        this.pure = !!pure;
      }
      CompilePipeMetadata.prototype.toSummary = function() {
        return {
          summaryKind: CompileSummaryKind.Pipe,
          type: this.type,
          name: this.name,
          pure: this.pure
        };
      };
      return CompilePipeMetadata;
    }());
    var CompileNgModuleMetadata = (function() {
      function CompileNgModuleMetadata(_a) {
        var type = _a.type,
            providers = _a.providers,
            declaredDirectives = _a.declaredDirectives,
            exportedDirectives = _a.exportedDirectives,
            declaredPipes = _a.declaredPipes,
            exportedPipes = _a.exportedPipes,
            entryComponents = _a.entryComponents,
            bootstrapComponents = _a.bootstrapComponents,
            importedModules = _a.importedModules,
            exportedModules = _a.exportedModules,
            schemas = _a.schemas,
            transitiveModule = _a.transitiveModule,
            id = _a.id;
        this.type = type || null;
        this.declaredDirectives = _normalizeArray(declaredDirectives);
        this.exportedDirectives = _normalizeArray(exportedDirectives);
        this.declaredPipes = _normalizeArray(declaredPipes);
        this.exportedPipes = _normalizeArray(exportedPipes);
        this.providers = _normalizeArray(providers);
        this.entryComponents = _normalizeArray(entryComponents);
        this.bootstrapComponents = _normalizeArray(bootstrapComponents);
        this.importedModules = _normalizeArray(importedModules);
        this.exportedModules = _normalizeArray(exportedModules);
        this.schemas = _normalizeArray(schemas);
        this.id = id || null;
        this.transitiveModule = transitiveModule || null;
      }
      CompileNgModuleMetadata.prototype.toSummary = function() {
        var module = ((this.transitiveModule));
        return {
          summaryKind: CompileSummaryKind.NgModule,
          type: this.type,
          entryComponents: module.entryComponents,
          providers: module.providers,
          modules: module.modules,
          exportedDirectives: module.exportedDirectives,
          exportedPipes: module.exportedPipes
        };
      };
      return CompileNgModuleMetadata;
    }());
    var TransitiveCompileNgModuleMetadata = (function() {
      function TransitiveCompileNgModuleMetadata() {
        this.directivesSet = new Set();
        this.directives = [];
        this.exportedDirectivesSet = new Set();
        this.exportedDirectives = [];
        this.pipesSet = new Set();
        this.pipes = [];
        this.exportedPipesSet = new Set();
        this.exportedPipes = [];
        this.modulesSet = new Set();
        this.modules = [];
        this.entryComponentsSet = new Set();
        this.entryComponents = [];
        this.providers = [];
      }
      TransitiveCompileNgModuleMetadata.prototype.addProvider = function(provider, module) {
        this.providers.push({
          provider: provider,
          module: module
        });
      };
      TransitiveCompileNgModuleMetadata.prototype.addDirective = function(id) {
        if (!this.directivesSet.has(id.reference)) {
          this.directivesSet.add(id.reference);
          this.directives.push(id);
        }
      };
      TransitiveCompileNgModuleMetadata.prototype.addExportedDirective = function(id) {
        if (!this.exportedDirectivesSet.has(id.reference)) {
          this.exportedDirectivesSet.add(id.reference);
          this.exportedDirectives.push(id);
        }
      };
      TransitiveCompileNgModuleMetadata.prototype.addPipe = function(id) {
        if (!this.pipesSet.has(id.reference)) {
          this.pipesSet.add(id.reference);
          this.pipes.push(id);
        }
      };
      TransitiveCompileNgModuleMetadata.prototype.addExportedPipe = function(id) {
        if (!this.exportedPipesSet.has(id.reference)) {
          this.exportedPipesSet.add(id.reference);
          this.exportedPipes.push(id);
        }
      };
      TransitiveCompileNgModuleMetadata.prototype.addModule = function(id) {
        if (!this.modulesSet.has(id.reference)) {
          this.modulesSet.add(id.reference);
          this.modules.push(id);
        }
      };
      TransitiveCompileNgModuleMetadata.prototype.addEntryComponent = function(ec) {
        if (!this.entryComponentsSet.has(ec.componentType)) {
          this.entryComponentsSet.add(ec.componentType);
          this.entryComponents.push(ec);
        }
      };
      return TransitiveCompileNgModuleMetadata;
    }());
    function _normalizeArray(obj) {
      return obj || [];
    }
    var ProviderMeta = (function() {
      function ProviderMeta(token, _a) {
        var useClass = _a.useClass,
            useValue = _a.useValue,
            useExisting = _a.useExisting,
            useFactory = _a.useFactory,
            deps = _a.deps,
            multi = _a.multi;
        this.token = token;
        this.useClass = useClass || null;
        this.useValue = useValue;
        this.useExisting = useExisting;
        this.useFactory = useFactory || null;
        this.dependencies = deps || null;
        this.multi = !!multi;
      }
      return ProviderMeta;
    }());
    function flatten(list) {
      return list.reduce(function(flat, item) {
        var flatItem = Array.isArray(item) ? flatten(item) : item;
        return ((flat)).concat(flatItem);
      }, []);
    }
    function jitSourceUrl(url) {
      return url.replace(/(\w+:\/\/[\w:-]+)?(\/+)?/, 'ng:///');
    }
    function templateSourceUrl(ngModuleType, compMeta, templateMeta) {
      var url;
      if (templateMeta.isInline) {
        if (compMeta.type.reference instanceof StaticSymbol) {
          url = compMeta.type.reference.filePath + "." + compMeta.type.reference.name + ".html";
        } else {
          url = identifierName(ngModuleType) + "/" + identifierName(compMeta.type) + ".html";
        }
      } else {
        url = ((templateMeta.templateUrl));
      }
      return compMeta.type.reference instanceof StaticSymbol ? url : jitSourceUrl(url);
    }
    function sharedStylesheetJitUrl(meta, id) {
      var pathParts = ((meta.moduleUrl)).split(/\/\\/g);
      var baseName = pathParts[pathParts.length - 1];
      return jitSourceUrl("css/" + id + baseName + ".ngstyle.js");
    }
    function ngModuleJitUrl(moduleMeta) {
      return jitSourceUrl(identifierName(moduleMeta.type) + "/module.ngfactory.js");
    }
    function templateJitUrl(ngModuleType, compMeta) {
      return jitSourceUrl(identifierName(ngModuleType) + "/" + identifierName(compMeta.type) + ".ngfactory.js");
    }
    var AstPath = (function() {
      function AstPath(path, position) {
        if (position === void 0) {
          position = -1;
        }
        this.path = path;
        this.position = position;
      }
      Object.defineProperty(AstPath.prototype, "empty", {
        get: function() {
          return !this.path || !this.path.length;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AstPath.prototype, "head", {
        get: function() {
          return this.path[0];
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AstPath.prototype, "tail", {
        get: function() {
          return this.path[this.path.length - 1];
        },
        enumerable: true,
        configurable: true
      });
      AstPath.prototype.parentOf = function(node) {
        return node && this.path[this.path.indexOf(node) - 1];
      };
      AstPath.prototype.childOf = function(node) {
        return this.path[this.path.indexOf(node) + 1];
      };
      AstPath.prototype.first = function(ctor) {
        for (var i = this.path.length - 1; i >= 0; i--) {
          var item = this.path[i];
          if (item instanceof ctor)
            return (item);
        }
      };
      AstPath.prototype.push = function(node) {
        this.path.push(node);
      };
      AstPath.prototype.pop = function() {
        return ((this.path.pop()));
      };
      return AstPath;
    }());
    var Text = (function() {
      function Text(value, sourceSpan) {
        this.value = value;
        this.sourceSpan = sourceSpan;
      }
      Text.prototype.visit = function(visitor, context) {
        return visitor.visitText(this, context);
      };
      return Text;
    }());
    var Expansion = (function() {
      function Expansion(switchValue, type, cases, sourceSpan, switchValueSourceSpan) {
        this.switchValue = switchValue;
        this.type = type;
        this.cases = cases;
        this.sourceSpan = sourceSpan;
        this.switchValueSourceSpan = switchValueSourceSpan;
      }
      Expansion.prototype.visit = function(visitor, context) {
        return visitor.visitExpansion(this, context);
      };
      return Expansion;
    }());
    var ExpansionCase = (function() {
      function ExpansionCase(value, expression, sourceSpan, valueSourceSpan, expSourceSpan) {
        this.value = value;
        this.expression = expression;
        this.sourceSpan = sourceSpan;
        this.valueSourceSpan = valueSourceSpan;
        this.expSourceSpan = expSourceSpan;
      }
      ExpansionCase.prototype.visit = function(visitor, context) {
        return visitor.visitExpansionCase(this, context);
      };
      return ExpansionCase;
    }());
    var Attribute$1 = (function() {
      function Attribute(name, value, sourceSpan, valueSpan) {
        this.name = name;
        this.value = value;
        this.sourceSpan = sourceSpan;
        this.valueSpan = valueSpan;
      }
      Attribute.prototype.visit = function(visitor, context) {
        return visitor.visitAttribute(this, context);
      };
      return Attribute;
    }());
    var Element = (function() {
      function Element(name, attrs, children, sourceSpan, startSourceSpan, endSourceSpan) {
        if (startSourceSpan === void 0) {
          startSourceSpan = null;
        }
        if (endSourceSpan === void 0) {
          endSourceSpan = null;
        }
        this.name = name;
        this.attrs = attrs;
        this.children = children;
        this.sourceSpan = sourceSpan;
        this.startSourceSpan = startSourceSpan;
        this.endSourceSpan = endSourceSpan;
      }
      Element.prototype.visit = function(visitor, context) {
        return visitor.visitElement(this, context);
      };
      return Element;
    }());
    var Comment = (function() {
      function Comment(value, sourceSpan) {
        this.value = value;
        this.sourceSpan = sourceSpan;
      }
      Comment.prototype.visit = function(visitor, context) {
        return visitor.visitComment(this, context);
      };
      return Comment;
    }());
    function visitAll(visitor, nodes, context) {
      if (context === void 0) {
        context = null;
      }
      var result = [];
      var visit = visitor.visit ? function(ast) {
        return ((visitor.visit))(ast, context) || ast.visit(visitor, context);
      } : function(ast) {
        return ast.visit(visitor, context);
      };
      nodes.forEach(function(ast) {
        var astResult = visit(ast);
        if (astResult) {
          result.push(astResult);
        }
      });
      return result;
    }
    var RecursiveVisitor = (function() {
      function RecursiveVisitor() {}
      RecursiveVisitor.prototype.visitElement = function(ast, context) {
        this.visitChildren(context, function(visit) {
          visit(ast.attrs);
          visit(ast.children);
        });
      };
      RecursiveVisitor.prototype.visitAttribute = function(ast, context) {};
      RecursiveVisitor.prototype.visitText = function(ast, context) {};
      RecursiveVisitor.prototype.visitComment = function(ast, context) {};
      RecursiveVisitor.prototype.visitExpansion = function(ast, context) {
        return this.visitChildren(context, function(visit) {
          visit(ast.cases);
        });
      };
      RecursiveVisitor.prototype.visitExpansionCase = function(ast, context) {};
      RecursiveVisitor.prototype.visitChildren = function(context, cb) {
        var results = [];
        var t = this;
        function visit(children) {
          if (children)
            results.push(visitAll(t, children, context));
        }
        cb(visit);
        return [].concat.apply([], results);
      };
      return RecursiveVisitor;
    }());
    function spanOf(ast) {
      var start = ast.sourceSpan.start.offset;
      var end = ast.sourceSpan.end.offset;
      if (ast instanceof Element) {
        if (ast.endSourceSpan) {
          end = ast.endSourceSpan.end.offset;
        } else if (ast.children && ast.children.length) {
          end = spanOf(ast.children[ast.children.length - 1]).end;
        }
      }
      return {
        start: start,
        end: end
      };
    }
    function findNode(nodes, position) {
      var path = [];
      var visitor = new (function(_super) {
        __extends(class_1, _super);
        function class_1() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.visit = function(ast, context) {
          var span = spanOf(ast);
          if (span.start <= position && position < span.end) {
            path.push(ast);
          } else {
            return true;
          }
        };
        return class_1;
      }(RecursiveVisitor));
      visitAll(visitor, nodes);
      return new AstPath(path, position);
    }
    function assertArrayOfStrings(identifier, value) {
      if (value == null) {
        return;
      }
      if (!Array.isArray(value)) {
        throw new Error("Expected '" + identifier + "' to be an array of strings.");
      }
      for (var i = 0; i < value.length; i += 1) {
        if (typeof value[i] !== 'string') {
          throw new Error("Expected '" + identifier + "' to be an array of strings.");
        }
      }
    }
    var INTERPOLATION_BLACKLIST_REGEXPS = [/^\s*$/, /[<>]/, /^[{}]$/, /&(#|[a-z])/i, /^\/\//];
    function assertInterpolationSymbols(identifier, value) {
      if (value != null && !(Array.isArray(value) && value.length == 2)) {
        throw new Error("Expected '" + identifier + "' to be an array, [start, end].");
      } else if (value != null) {
        var start_1 = (value[0]);
        var end_1 = (value[1]);
        INTERPOLATION_BLACKLIST_REGEXPS.forEach(function(regexp) {
          if (regexp.test(start_1) || regexp.test(end_1)) {
            throw new Error("['" + start_1 + "', '" + end_1 + "'] contains unusable interpolation symbol.");
          }
        });
      }
    }
    var InterpolationConfig = (function() {
      function InterpolationConfig(start, end) {
        this.start = start;
        this.end = end;
      }
      InterpolationConfig.fromArray = function(markers) {
        if (!markers) {
          return DEFAULT_INTERPOLATION_CONFIG;
        }
        assertInterpolationSymbols('interpolation', markers);
        return new InterpolationConfig(markers[0], markers[1]);
      };
      return InterpolationConfig;
    }());
    var DEFAULT_INTERPOLATION_CONFIG = new InterpolationConfig('{{', '}}');
    var StyleWithImports = (function() {
      function StyleWithImports(style, styleUrls) {
        this.style = style;
        this.styleUrls = styleUrls;
      }
      return StyleWithImports;
    }());
    function isStyleUrlResolvable(url) {
      if (url == null || url.length === 0 || url[0] == '/')
        return false;
      var schemeMatch = url.match(URL_WITH_SCHEMA_REGEXP);
      return schemeMatch === null || schemeMatch[1] == 'package' || schemeMatch[1] == 'asset';
    }
    function extractStyleUrls(resolver, baseUrl, cssText) {
      var foundUrls = [];
      var modifiedCssText = cssText.replace(CSS_STRIPPABLE_COMMENT_REGEXP, '').replace(CSS_IMPORT_REGEXP, function() {
        var m = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          m[_i] = arguments[_i];
        }
        var url = m[1] || m[2];
        if (!isStyleUrlResolvable(url)) {
          return m[0];
        }
        foundUrls.push(resolver.resolve(baseUrl, url));
        return '';
      });
      return new StyleWithImports(modifiedCssText, foundUrls);
    }
    var CSS_IMPORT_REGEXP = /@import\s+(?:url\()?\s*(?:(?:['"]([^'"]*))|([^;\)\s]*))[^;]*;?/g;
    var CSS_STRIPPABLE_COMMENT_REGEXP = /\/\*(?!#\s*(?:sourceURL|sourceMappingURL)=)[\s\S]+?\*\//g;
    var URL_WITH_SCHEMA_REGEXP = /^([^:/?#]+):/;
    var TagContentType = {
      RAW_TEXT: 0,
      ESCAPABLE_RAW_TEXT: 1,
      PARSABLE_DATA: 2
    };
    TagContentType[TagContentType.RAW_TEXT] = "RAW_TEXT";
    TagContentType[TagContentType.ESCAPABLE_RAW_TEXT] = "ESCAPABLE_RAW_TEXT";
    TagContentType[TagContentType.PARSABLE_DATA] = "PARSABLE_DATA";
    function splitNsName(elementName) {
      if (elementName[0] != ':') {
        return [null, elementName];
      }
      var colonIndex = elementName.indexOf(':', 1);
      if (colonIndex == -1) {
        throw new Error("Unsupported format \"" + elementName + "\" expecting \":namespace:name\"");
      }
      return [elementName.slice(1, colonIndex), elementName.slice(colonIndex + 1)];
    }
    function isNgContainer(tagName) {
      return splitNsName(tagName)[1] === 'ng-container';
    }
    function isNgContent(tagName) {
      return splitNsName(tagName)[1] === 'ng-content';
    }
    function isNgTemplate(tagName) {
      return splitNsName(tagName)[1] === 'ng-template';
    }
    function getNsPrefix(fullName) {
      return fullName === null ? null : splitNsName(fullName)[0];
    }
    function mergeNsAndName(prefix, localName) {
      return prefix ? ":" + prefix + ":" + localName : localName;
    }
    var NAMED_ENTITIES = {
      'Aacute': '\u00C1',
      'aacute': '\u00E1',
      'Acirc': '\u00C2',
      'acirc': '\u00E2',
      'acute': '\u00B4',
      'AElig': '\u00C6',
      'aelig': '\u00E6',
      'Agrave': '\u00C0',
      'agrave': '\u00E0',
      'alefsym': '\u2135',
      'Alpha': '\u0391',
      'alpha': '\u03B1',
      'amp': '&',
      'and': '\u2227',
      'ang': '\u2220',
      'apos': '\u0027',
      'Aring': '\u00C5',
      'aring': '\u00E5',
      'asymp': '\u2248',
      'Atilde': '\u00C3',
      'atilde': '\u00E3',
      'Auml': '\u00C4',
      'auml': '\u00E4',
      'bdquo': '\u201E',
      'Beta': '\u0392',
      'beta': '\u03B2',
      'brvbar': '\u00A6',
      'bull': '\u2022',
      'cap': '\u2229',
      'Ccedil': '\u00C7',
      'ccedil': '\u00E7',
      'cedil': '\u00B8',
      'cent': '\u00A2',
      'Chi': '\u03A7',
      'chi': '\u03C7',
      'circ': '\u02C6',
      'clubs': '\u2663',
      'cong': '\u2245',
      'copy': '\u00A9',
      'crarr': '\u21B5',
      'cup': '\u222A',
      'curren': '\u00A4',
      'dagger': '\u2020',
      'Dagger': '\u2021',
      'darr': '\u2193',
      'dArr': '\u21D3',
      'deg': '\u00B0',
      'Delta': '\u0394',
      'delta': '\u03B4',
      'diams': '\u2666',
      'divide': '\u00F7',
      'Eacute': '\u00C9',
      'eacute': '\u00E9',
      'Ecirc': '\u00CA',
      'ecirc': '\u00EA',
      'Egrave': '\u00C8',
      'egrave': '\u00E8',
      'empty': '\u2205',
      'emsp': '\u2003',
      'ensp': '\u2002',
      'Epsilon': '\u0395',
      'epsilon': '\u03B5',
      'equiv': '\u2261',
      'Eta': '\u0397',
      'eta': '\u03B7',
      'ETH': '\u00D0',
      'eth': '\u00F0',
      'Euml': '\u00CB',
      'euml': '\u00EB',
      'euro': '\u20AC',
      'exist': '\u2203',
      'fnof': '\u0192',
      'forall': '\u2200',
      'frac12': '\u00BD',
      'frac14': '\u00BC',
      'frac34': '\u00BE',
      'frasl': '\u2044',
      'Gamma': '\u0393',
      'gamma': '\u03B3',
      'ge': '\u2265',
      'gt': '>',
      'harr': '\u2194',
      'hArr': '\u21D4',
      'hearts': '\u2665',
      'hellip': '\u2026',
      'Iacute': '\u00CD',
      'iacute': '\u00ED',
      'Icirc': '\u00CE',
      'icirc': '\u00EE',
      'iexcl': '\u00A1',
      'Igrave': '\u00CC',
      'igrave': '\u00EC',
      'image': '\u2111',
      'infin': '\u221E',
      'int': '\u222B',
      'Iota': '\u0399',
      'iota': '\u03B9',
      'iquest': '\u00BF',
      'isin': '\u2208',
      'Iuml': '\u00CF',
      'iuml': '\u00EF',
      'Kappa': '\u039A',
      'kappa': '\u03BA',
      'Lambda': '\u039B',
      'lambda': '\u03BB',
      'lang': '\u27E8',
      'laquo': '\u00AB',
      'larr': '\u2190',
      'lArr': '\u21D0',
      'lceil': '\u2308',
      'ldquo': '\u201C',
      'le': '\u2264',
      'lfloor': '\u230A',
      'lowast': '\u2217',
      'loz': '\u25CA',
      'lrm': '\u200E',
      'lsaquo': '\u2039',
      'lsquo': '\u2018',
      'lt': '<',
      'macr': '\u00AF',
      'mdash': '\u2014',
      'micro': '\u00B5',
      'middot': '\u00B7',
      'minus': '\u2212',
      'Mu': '\u039C',
      'mu': '\u03BC',
      'nabla': '\u2207',
      'nbsp': '\u00A0',
      'ndash': '\u2013',
      'ne': '\u2260',
      'ni': '\u220B',
      'not': '\u00AC',
      'notin': '\u2209',
      'nsub': '\u2284',
      'Ntilde': '\u00D1',
      'ntilde': '\u00F1',
      'Nu': '\u039D',
      'nu': '\u03BD',
      'Oacute': '\u00D3',
      'oacute': '\u00F3',
      'Ocirc': '\u00D4',
      'ocirc': '\u00F4',
      'OElig': '\u0152',
      'oelig': '\u0153',
      'Ograve': '\u00D2',
      'ograve': '\u00F2',
      'oline': '\u203E',
      'Omega': '\u03A9',
      'omega': '\u03C9',
      'Omicron': '\u039F',
      'omicron': '\u03BF',
      'oplus': '\u2295',
      'or': '\u2228',
      'ordf': '\u00AA',
      'ordm': '\u00BA',
      'Oslash': '\u00D8',
      'oslash': '\u00F8',
      'Otilde': '\u00D5',
      'otilde': '\u00F5',
      'otimes': '\u2297',
      'Ouml': '\u00D6',
      'ouml': '\u00F6',
      'para': '\u00B6',
      'permil': '\u2030',
      'perp': '\u22A5',
      'Phi': '\u03A6',
      'phi': '\u03C6',
      'Pi': '\u03A0',
      'pi': '\u03C0',
      'piv': '\u03D6',
      'plusmn': '\u00B1',
      'pound': '\u00A3',
      'prime': '\u2032',
      'Prime': '\u2033',
      'prod': '\u220F',
      'prop': '\u221D',
      'Psi': '\u03A8',
      'psi': '\u03C8',
      'quot': '\u0022',
      'radic': '\u221A',
      'rang': '\u27E9',
      'raquo': '\u00BB',
      'rarr': '\u2192',
      'rArr': '\u21D2',
      'rceil': '\u2309',
      'rdquo': '\u201D',
      'real': '\u211C',
      'reg': '\u00AE',
      'rfloor': '\u230B',
      'Rho': '\u03A1',
      'rho': '\u03C1',
      'rlm': '\u200F',
      'rsaquo': '\u203A',
      'rsquo': '\u2019',
      'sbquo': '\u201A',
      'Scaron': '\u0160',
      'scaron': '\u0161',
      'sdot': '\u22C5',
      'sect': '\u00A7',
      'shy': '\u00AD',
      'Sigma': '\u03A3',
      'sigma': '\u03C3',
      'sigmaf': '\u03C2',
      'sim': '\u223C',
      'spades': '\u2660',
      'sub': '\u2282',
      'sube': '\u2286',
      'sum': '\u2211',
      'sup': '\u2283',
      'sup1': '\u00B9',
      'sup2': '\u00B2',
      'sup3': '\u00B3',
      'supe': '\u2287',
      'szlig': '\u00DF',
      'Tau': '\u03A4',
      'tau': '\u03C4',
      'there4': '\u2234',
      'Theta': '\u0398',
      'theta': '\u03B8',
      'thetasym': '\u03D1',
      'thinsp': '\u2009',
      'THORN': '\u00DE',
      'thorn': '\u00FE',
      'tilde': '\u02DC',
      'times': '\u00D7',
      'trade': '\u2122',
      'Uacute': '\u00DA',
      'uacute': '\u00FA',
      'uarr': '\u2191',
      'uArr': '\u21D1',
      'Ucirc': '\u00DB',
      'ucirc': '\u00FB',
      'Ugrave': '\u00D9',
      'ugrave': '\u00F9',
      'uml': '\u00A8',
      'upsih': '\u03D2',
      'Upsilon': '\u03A5',
      'upsilon': '\u03C5',
      'Uuml': '\u00DC',
      'uuml': '\u00FC',
      'weierp': '\u2118',
      'Xi': '\u039E',
      'xi': '\u03BE',
      'Yacute': '\u00DD',
      'yacute': '\u00FD',
      'yen': '\u00A5',
      'yuml': '\u00FF',
      'Yuml': '\u0178',
      'Zeta': '\u0396',
      'zeta': '\u03B6',
      'zwj': '\u200D',
      'zwnj': '\u200C'
    };
    var NGSP_UNICODE = '\uE500';
    NAMED_ENTITIES['ngsp'] = NGSP_UNICODE;
    var NG_CONTENT_SELECT_ATTR = 'select';
    var LINK_ELEMENT = 'link';
    var LINK_STYLE_REL_ATTR = 'rel';
    var LINK_STYLE_HREF_ATTR = 'href';
    var LINK_STYLE_REL_VALUE = 'stylesheet';
    var STYLE_ELEMENT = 'style';
    var SCRIPT_ELEMENT = 'script';
    var NG_NON_BINDABLE_ATTR = 'ngNonBindable';
    var NG_PROJECT_AS = 'ngProjectAs';
    function preparseElement(ast) {
      var selectAttr = ((null));
      var hrefAttr = ((null));
      var relAttr = ((null));
      var nonBindable = false;
      var projectAs = ((null));
      ast.attrs.forEach(function(attr) {
        var lcAttrName = attr.name.toLowerCase();
        if (lcAttrName == NG_CONTENT_SELECT_ATTR) {
          selectAttr = attr.value;
        } else if (lcAttrName == LINK_STYLE_HREF_ATTR) {
          hrefAttr = attr.value;
        } else if (lcAttrName == LINK_STYLE_REL_ATTR) {
          relAttr = attr.value;
        } else if (attr.name == NG_NON_BINDABLE_ATTR) {
          nonBindable = true;
        } else if (attr.name == NG_PROJECT_AS) {
          if (attr.value.length > 0) {
            projectAs = attr.value;
          }
        }
      });
      selectAttr = normalizeNgContentSelect(selectAttr);
      var nodeName = ast.name.toLowerCase();
      var type = PreparsedElementType.OTHER;
      if (isNgContent(nodeName)) {
        type = PreparsedElementType.NG_CONTENT;
      } else if (nodeName == STYLE_ELEMENT) {
        type = PreparsedElementType.STYLE;
      } else if (nodeName == SCRIPT_ELEMENT) {
        type = PreparsedElementType.SCRIPT;
      } else if (nodeName == LINK_ELEMENT && relAttr == LINK_STYLE_REL_VALUE) {
        type = PreparsedElementType.STYLESHEET;
      }
      return new PreparsedElement(type, selectAttr, hrefAttr, nonBindable, projectAs);
    }
    var PreparsedElementType = {
      NG_CONTENT: 0,
      STYLE: 1,
      STYLESHEET: 2,
      SCRIPT: 3,
      OTHER: 4
    };
    PreparsedElementType[PreparsedElementType.NG_CONTENT] = "NG_CONTENT";
    PreparsedElementType[PreparsedElementType.STYLE] = "STYLE";
    PreparsedElementType[PreparsedElementType.STYLESHEET] = "STYLESHEET";
    PreparsedElementType[PreparsedElementType.SCRIPT] = "SCRIPT";
    PreparsedElementType[PreparsedElementType.OTHER] = "OTHER";
    var PreparsedElement = (function() {
      function PreparsedElement(type, selectAttr, hrefAttr, nonBindable, projectAs) {
        this.type = type;
        this.selectAttr = selectAttr;
        this.hrefAttr = hrefAttr;
        this.nonBindable = nonBindable;
        this.projectAs = projectAs;
      }
      return PreparsedElement;
    }());
    function normalizeNgContentSelect(selectAttr) {
      if (selectAttr === null || selectAttr.length === 0) {
        return '*';
      }
      return selectAttr;
    }
    var DirectiveNormalizer = (function() {
      function DirectiveNormalizer(_resourceLoader, _urlResolver, _htmlParser, _config) {
        this._resourceLoader = _resourceLoader;
        this._urlResolver = _urlResolver;
        this._htmlParser = _htmlParser;
        this._config = _config;
        this._resourceLoaderCache = new Map();
      }
      DirectiveNormalizer.prototype.clearCache = function() {
        this._resourceLoaderCache.clear();
      };
      DirectiveNormalizer.prototype.clearCacheFor = function(normalizedDirective) {
        var _this = this;
        if (!normalizedDirective.isComponent) {
          return;
        }
        var template = ((normalizedDirective.template));
        this._resourceLoaderCache.delete(((template.templateUrl)));
        template.externalStylesheets.forEach(function(stylesheet) {
          _this._resourceLoaderCache.delete(((stylesheet.moduleUrl)));
        });
      };
      DirectiveNormalizer.prototype._fetch = function(url) {
        var result = this._resourceLoaderCache.get(url);
        if (!result) {
          result = this._resourceLoader.get(url);
          this._resourceLoaderCache.set(url, result);
        }
        return result;
      };
      DirectiveNormalizer.prototype.normalizeTemplate = function(prenormData) {
        var _this = this;
        if (isDefined(prenormData.template)) {
          if (isDefined(prenormData.templateUrl)) {
            throw syntaxError("'" + stringify(prenormData.componentType) + "' component cannot define both template and templateUrl");
          }
          if (typeof prenormData.template !== 'string') {
            throw syntaxError("The template specified for component " + stringify(prenormData.componentType) + " is not a string");
          }
        } else if (isDefined(prenormData.templateUrl)) {
          if (typeof prenormData.templateUrl !== 'string') {
            throw syntaxError("The templateUrl specified for component " + stringify(prenormData.componentType) + " is not a string");
          }
        } else {
          throw syntaxError("No template specified for component " + stringify(prenormData.componentType));
        }
        if (isDefined(prenormData.preserveWhitespaces) && typeof prenormData.preserveWhitespaces !== 'boolean') {
          throw syntaxError("The preserveWhitespaces option for component " + stringify(prenormData.componentType) + " must be a boolean");
        }
        return SyncAsync.then(this._preParseTemplate(prenormData), function(preparsedTemplate) {
          return _this._normalizeTemplateMetadata(prenormData, preparsedTemplate);
        });
      };
      DirectiveNormalizer.prototype._preParseTemplate = function(prenomData) {
        var _this = this;
        var template;
        var templateUrl;
        if (prenomData.template != null) {
          template = prenomData.template;
          templateUrl = prenomData.moduleUrl;
        } else {
          templateUrl = this._urlResolver.resolve(prenomData.moduleUrl, ((prenomData.templateUrl)));
          template = this._fetch(templateUrl);
        }
        return SyncAsync.then(template, function(template) {
          return _this._preparseLoadedTemplate(prenomData, template, templateUrl);
        });
      };
      DirectiveNormalizer.prototype._preparseLoadedTemplate = function(prenormData, template, templateAbsUrl) {
        var isInline = !!prenormData.template;
        var interpolationConfig = InterpolationConfig.fromArray(((prenormData.interpolation)));
        var rootNodesAndErrors = this._htmlParser.parse(template, templateSourceUrl({reference: prenormData.ngModuleType}, {type: {reference: prenormData.componentType}}, {
          isInline: isInline,
          templateUrl: templateAbsUrl
        }), true, interpolationConfig);
        if (rootNodesAndErrors.errors.length > 0) {
          var errorString = rootNodesAndErrors.errors.join('\n');
          throw syntaxError("Template parse errors:\n" + errorString);
        }
        var templateMetadataStyles = this._normalizeStylesheet(new CompileStylesheetMetadata({
          styles: prenormData.styles,
          moduleUrl: prenormData.moduleUrl
        }));
        var visitor = new TemplatePreparseVisitor();
        visitAll(visitor, rootNodesAndErrors.rootNodes);
        var templateStyles = this._normalizeStylesheet(new CompileStylesheetMetadata({
          styles: visitor.styles,
          styleUrls: visitor.styleUrls,
          moduleUrl: templateAbsUrl
        }));
        var styles = templateMetadataStyles.styles.concat(templateStyles.styles);
        var inlineStyleUrls = templateMetadataStyles.styleUrls.concat(templateStyles.styleUrls);
        var styleUrls = this._normalizeStylesheet(new CompileStylesheetMetadata({
          styleUrls: prenormData.styleUrls,
          moduleUrl: prenormData.moduleUrl
        })).styleUrls;
        return {
          template: template,
          templateUrl: templateAbsUrl,
          isInline: isInline,
          htmlAst: rootNodesAndErrors,
          styles: styles,
          inlineStyleUrls: inlineStyleUrls,
          styleUrls: styleUrls,
          ngContentSelectors: visitor.ngContentSelectors
        };
      };
      DirectiveNormalizer.prototype._normalizeTemplateMetadata = function(prenormData, preparsedTemplate) {
        var _this = this;
        return SyncAsync.then(this._loadMissingExternalStylesheets(preparsedTemplate.styleUrls.concat(preparsedTemplate.inlineStyleUrls)), function(externalStylesheets) {
          return _this._normalizeLoadedTemplateMetadata(prenormData, preparsedTemplate, externalStylesheets);
        });
      };
      DirectiveNormalizer.prototype._normalizeLoadedTemplateMetadata = function(prenormData, preparsedTemplate, stylesheets) {
        var _this = this;
        var styles = preparsedTemplate.styles.slice();
        this._inlineStyles(preparsedTemplate.inlineStyleUrls, stylesheets, styles);
        var styleUrls = preparsedTemplate.styleUrls;
        var externalStylesheets = styleUrls.map(function(styleUrl) {
          var stylesheet = ((stylesheets.get(styleUrl)));
          var styles = stylesheet.styles.slice();
          _this._inlineStyles(stylesheet.styleUrls, stylesheets, styles);
          return new CompileStylesheetMetadata({
            moduleUrl: styleUrl,
            styles: styles
          });
        });
        var encapsulation = prenormData.encapsulation;
        if (encapsulation == null) {
          encapsulation = this._config.defaultEncapsulation;
        }
        if (encapsulation === ViewEncapsulation.Emulated && styles.length === 0 && styleUrls.length === 0) {
          encapsulation = ViewEncapsulation.None;
        }
        return new CompileTemplateMetadata({
          encapsulation: encapsulation,
          template: preparsedTemplate.template,
          templateUrl: preparsedTemplate.templateUrl,
          htmlAst: preparsedTemplate.htmlAst,
          styles: styles,
          styleUrls: styleUrls,
          ngContentSelectors: preparsedTemplate.ngContentSelectors,
          animations: prenormData.animations,
          interpolation: prenormData.interpolation,
          isInline: preparsedTemplate.isInline,
          externalStylesheets: externalStylesheets,
          preserveWhitespaces: preserveWhitespacesDefault(prenormData.preserveWhitespaces, this._config.preserveWhitespaces)
        });
      };
      DirectiveNormalizer.prototype._inlineStyles = function(styleUrls, stylesheets, targetStyles) {
        var _this = this;
        styleUrls.forEach(function(styleUrl) {
          var stylesheet = ((stylesheets.get(styleUrl)));
          stylesheet.styles.forEach(function(style) {
            return targetStyles.push(style);
          });
          _this._inlineStyles(stylesheet.styleUrls, stylesheets, targetStyles);
        });
      };
      DirectiveNormalizer.prototype._loadMissingExternalStylesheets = function(styleUrls, loadedStylesheets) {
        var _this = this;
        if (loadedStylesheets === void 0) {
          loadedStylesheets = new Map();
        }
        return SyncAsync.then(SyncAsync.all(styleUrls.filter(function(styleUrl) {
          return !loadedStylesheets.has(styleUrl);
        }).map(function(styleUrl) {
          return SyncAsync.then(_this._fetch(styleUrl), function(loadedStyle) {
            var stylesheet = _this._normalizeStylesheet(new CompileStylesheetMetadata({
              styles: [loadedStyle],
              moduleUrl: styleUrl
            }));
            loadedStylesheets.set(styleUrl, stylesheet);
            return _this._loadMissingExternalStylesheets(stylesheet.styleUrls, loadedStylesheets);
          });
        })), function(_) {
          return loadedStylesheets;
        });
      };
      DirectiveNormalizer.prototype._normalizeStylesheet = function(stylesheet) {
        var _this = this;
        var moduleUrl = ((stylesheet.moduleUrl));
        var allStyleUrls = stylesheet.styleUrls.filter(isStyleUrlResolvable).map(function(url) {
          return _this._urlResolver.resolve(moduleUrl, url);
        });
        var allStyles = stylesheet.styles.map(function(style) {
          var styleWithImports = extractStyleUrls(_this._urlResolver, moduleUrl, style);
          allStyleUrls.push.apply(allStyleUrls, styleWithImports.styleUrls);
          return styleWithImports.style;
        });
        return new CompileStylesheetMetadata({
          styles: allStyles,
          styleUrls: allStyleUrls,
          moduleUrl: moduleUrl
        });
      };
      return DirectiveNormalizer;
    }());
    var TemplatePreparseVisitor = (function() {
      function TemplatePreparseVisitor() {
        this.ngContentSelectors = [];
        this.styles = [];
        this.styleUrls = [];
        this.ngNonBindableStackCount = 0;
      }
      TemplatePreparseVisitor.prototype.visitElement = function(ast, context) {
        var preparsedElement = preparseElement(ast);
        switch (preparsedElement.type) {
          case PreparsedElementType.NG_CONTENT:
            if (this.ngNonBindableStackCount === 0) {
              this.ngContentSelectors.push(preparsedElement.selectAttr);
            }
            break;
          case PreparsedElementType.STYLE:
            var textContent_1 = '';
            ast.children.forEach(function(child) {
              if (child instanceof Text) {
                textContent_1 += child.value;
              }
            });
            this.styles.push(textContent_1);
            break;
          case PreparsedElementType.STYLESHEET:
            this.styleUrls.push(preparsedElement.hrefAttr);
            break;
          default:
            break;
        }
        if (preparsedElement.nonBindable) {
          this.ngNonBindableStackCount++;
        }
        visitAll(this, ast.children);
        if (preparsedElement.nonBindable) {
          this.ngNonBindableStackCount--;
        }
        return null;
      };
      TemplatePreparseVisitor.prototype.visitExpansion = function(ast, context) {
        visitAll(this, ast.cases);
      };
      TemplatePreparseVisitor.prototype.visitExpansionCase = function(ast, context) {
        visitAll(this, ast.expression);
      };
      TemplatePreparseVisitor.prototype.visitComment = function(ast, context) {
        return null;
      };
      TemplatePreparseVisitor.prototype.visitAttribute = function(ast, context) {
        return null;
      };
      TemplatePreparseVisitor.prototype.visitText = function(ast, context) {
        return null;
      };
      return TemplatePreparseVisitor;
    }());
    var QUERY_METADATA_IDENTIFIERS = [createViewChild, createViewChildren, createContentChild, createContentChildren];
    var DirectiveResolver = (function() {
      function DirectiveResolver(_reflector) {
        this._reflector = _reflector;
      }
      DirectiveResolver.prototype.isDirective = function(type) {
        var typeMetadata = this._reflector.annotations(resolveForwardRef(type));
        return typeMetadata && typeMetadata.some(isDirectiveMetadata);
      };
      DirectiveResolver.prototype.resolve = function(type, throwIfNotFound) {
        if (throwIfNotFound === void 0) {
          throwIfNotFound = true;
        }
        var typeMetadata = this._reflector.annotations(resolveForwardRef(type));
        if (typeMetadata) {
          var metadata = findLast(typeMetadata, isDirectiveMetadata);
          if (metadata) {
            var propertyMetadata = this._reflector.propMetadata(type);
            var guards = this._reflector.guards(type);
            return this._mergeWithPropertyMetadata(metadata, propertyMetadata, guards, type);
          }
        }
        if (throwIfNotFound) {
          throw new Error("No Directive annotation found on " + stringify(type));
        }
        return null;
      };
      DirectiveResolver.prototype._mergeWithPropertyMetadata = function(dm, propertyMetadata, guards, directiveType) {
        var inputs = [];
        var outputs = [];
        var host = {};
        var queries = {};
        Object.keys(propertyMetadata).forEach(function(propName) {
          var input = findLast(propertyMetadata[propName], function(a) {
            return createInput.isTypeOf(a);
          });
          if (input) {
            if (input.bindingPropertyName) {
              inputs.push(propName + ": " + input.bindingPropertyName);
            } else {
              inputs.push(propName);
            }
          }
          var output = findLast(propertyMetadata[propName], function(a) {
            return createOutput.isTypeOf(a);
          });
          if (output) {
            if (output.bindingPropertyName) {
              outputs.push(propName + ": " + output.bindingPropertyName);
            } else {
              outputs.push(propName);
            }
          }
          var hostBindings = propertyMetadata[propName].filter(function(a) {
            return createHostBinding.isTypeOf(a);
          });
          hostBindings.forEach(function(hostBinding) {
            if (hostBinding.hostPropertyName) {
              var startWith = hostBinding.hostPropertyName[0];
              if (startWith === '(') {
                throw new Error("@HostBinding can not bind to events. Use @HostListener instead.");
              } else if (startWith === '[') {
                throw new Error("@HostBinding parameter should be a property name, 'class.<name>', or 'attr.<name>'.");
              }
              host["[" + hostBinding.hostPropertyName + "]"] = propName;
            } else {
              host["[" + propName + "]"] = propName;
            }
          });
          var hostListeners = propertyMetadata[propName].filter(function(a) {
            return createHostListener.isTypeOf(a);
          });
          hostListeners.forEach(function(hostListener) {
            var args = hostListener.args || [];
            host["(" + hostListener.eventName + ")"] = propName + "(" + args.join(',') + ")";
          });
          var query = findLast(propertyMetadata[propName], function(a) {
            return QUERY_METADATA_IDENTIFIERS.some(function(i) {
              return i.isTypeOf(a);
            });
          });
          if (query) {
            queries[propName] = query;
          }
        });
        return this._merge(dm, inputs, outputs, host, queries, guards, directiveType);
      };
      DirectiveResolver.prototype._extractPublicName = function(def) {
        return splitAtColon(def, [((null)), def])[1].trim();
      };
      DirectiveResolver.prototype._dedupeBindings = function(bindings) {
        var names = new Set();
        var publicNames = new Set();
        var reversedResult = [];
        for (var i = bindings.length - 1; i >= 0; i--) {
          var binding = bindings[i];
          var name_1 = this._extractPublicName(binding);
          publicNames.add(name_1);
          if (!names.has(name_1)) {
            names.add(name_1);
            reversedResult.push(binding);
          }
        }
        return reversedResult.reverse();
      };
      DirectiveResolver.prototype._merge = function(directive, inputs, outputs, host, queries, guards, directiveType) {
        var mergedInputs = this._dedupeBindings(directive.inputs ? directive.inputs.concat(inputs) : inputs);
        var mergedOutputs = this._dedupeBindings(directive.outputs ? directive.outputs.concat(outputs) : outputs);
        var mergedHost = directive.host ? __assign({}, directive.host, host) : host;
        var mergedQueries = directive.queries ? __assign({}, directive.queries, queries) : queries;
        if (createComponent.isTypeOf(directive)) {
          var comp = (directive);
          return createComponent({
            selector: comp.selector,
            inputs: mergedInputs,
            outputs: mergedOutputs,
            host: mergedHost,
            exportAs: comp.exportAs,
            moduleId: comp.moduleId,
            queries: mergedQueries,
            changeDetection: comp.changeDetection,
            providers: comp.providers,
            viewProviders: comp.viewProviders,
            entryComponents: comp.entryComponents,
            template: comp.template,
            templateUrl: comp.templateUrl,
            styles: comp.styles,
            styleUrls: comp.styleUrls,
            encapsulation: comp.encapsulation,
            animations: comp.animations,
            interpolation: comp.interpolation,
            preserveWhitespaces: directive.preserveWhitespaces
          });
        } else {
          return createDirective({
            selector: directive.selector,
            inputs: mergedInputs,
            outputs: mergedOutputs,
            host: mergedHost,
            exportAs: directive.exportAs,
            queries: mergedQueries,
            providers: directive.providers,
            guards: guards
          });
        }
      };
      return DirectiveResolver;
    }());
    function isDirectiveMetadata(type) {
      return createDirective.isTypeOf(type) || createComponent.isTypeOf(type);
    }
    function findLast(arr, condition) {
      for (var i = arr.length - 1; i >= 0; i--) {
        if (condition(arr[i])) {
          return arr[i];
        }
      }
      return null;
    }
    var $EOF = 0;
    var $TAB = 9;
    var $LF = 10;
    var $VTAB = 11;
    var $FF = 12;
    var $CR = 13;
    var $SPACE = 32;
    var $BANG = 33;
    var $DQ = 34;
    var $HASH = 35;
    var $$ = 36;
    var $PERCENT = 37;
    var $AMPERSAND = 38;
    var $SQ = 39;
    var $LPAREN = 40;
    var $RPAREN = 41;
    var $STAR = 42;
    var $PLUS = 43;
    var $COMMA = 44;
    var $MINUS = 45;
    var $PERIOD = 46;
    var $SLASH = 47;
    var $COLON = 58;
    var $SEMICOLON = 59;
    var $LT = 60;
    var $EQ = 61;
    var $GT = 62;
    var $QUESTION = 63;
    var $0 = 48;
    var $9 = 57;
    var $A = 65;
    var $E = 69;
    var $F = 70;
    var $X = 88;
    var $Z = 90;
    var $LBRACKET = 91;
    var $BACKSLASH = 92;
    var $RBRACKET = 93;
    var $CARET = 94;
    var $_ = 95;
    var $a = 97;
    var $e = 101;
    var $f = 102;
    var $n = 110;
    var $r = 114;
    var $t = 116;
    var $u = 117;
    var $v = 118;
    var $x = 120;
    var $z = 122;
    var $LBRACE = 123;
    var $BAR = 124;
    var $RBRACE = 125;
    var $NBSP = 160;
    var $BT = 96;
    function isWhitespace(code) {
      return (code >= $TAB && code <= $SPACE) || (code == $NBSP);
    }
    function isDigit(code) {
      return $0 <= code && code <= $9;
    }
    function isAsciiLetter(code) {
      return code >= $a && code <= $z || code >= $A && code <= $Z;
    }
    function isAsciiHexDigit(code) {
      return code >= $a && code <= $f || code >= $A && code <= $F || isDigit(code);
    }
    var TokenType = {
      Character: 0,
      Identifier: 1,
      Keyword: 2,
      String: 3,
      Operator: 4,
      Number: 5,
      Error: 6
    };
    TokenType[TokenType.Character] = "Character";
    TokenType[TokenType.Identifier] = "Identifier";
    TokenType[TokenType.Keyword] = "Keyword";
    TokenType[TokenType.String] = "String";
    TokenType[TokenType.Operator] = "Operator";
    TokenType[TokenType.Number] = "Number";
    TokenType[TokenType.Error] = "Error";
    var KEYWORDS = ['var', 'let', 'as', 'null', 'undefined', 'true', 'false', 'if', 'else', 'this'];
    var Lexer = (function() {
      function Lexer() {}
      Lexer.prototype.tokenize = function(text) {
        var scanner = new _Scanner(text);
        var tokens = [];
        var token = scanner.scanToken();
        while (token != null) {
          tokens.push(token);
          token = scanner.scanToken();
        }
        return tokens;
      };
      return Lexer;
    }());
    var Token = (function() {
      function Token(index, type, numValue, strValue) {
        this.index = index;
        this.type = type;
        this.numValue = numValue;
        this.strValue = strValue;
      }
      Token.prototype.isCharacter = function(code) {
        return this.type == TokenType.Character && this.numValue == code;
      };
      Token.prototype.isNumber = function() {
        return this.type == TokenType.Number;
      };
      Token.prototype.isString = function() {
        return this.type == TokenType.String;
      };
      Token.prototype.isOperator = function(operater) {
        return this.type == TokenType.Operator && this.strValue == operater;
      };
      Token.prototype.isIdentifier = function() {
        return this.type == TokenType.Identifier;
      };
      Token.prototype.isKeyword = function() {
        return this.type == TokenType.Keyword;
      };
      Token.prototype.isKeywordLet = function() {
        return this.type == TokenType.Keyword && this.strValue == 'let';
      };
      Token.prototype.isKeywordAs = function() {
        return this.type == TokenType.Keyword && this.strValue == 'as';
      };
      Token.prototype.isKeywordNull = function() {
        return this.type == TokenType.Keyword && this.strValue == 'null';
      };
      Token.prototype.isKeywordUndefined = function() {
        return this.type == TokenType.Keyword && this.strValue == 'undefined';
      };
      Token.prototype.isKeywordTrue = function() {
        return this.type == TokenType.Keyword && this.strValue == 'true';
      };
      Token.prototype.isKeywordFalse = function() {
        return this.type == TokenType.Keyword && this.strValue == 'false';
      };
      Token.prototype.isKeywordThis = function() {
        return this.type == TokenType.Keyword && this.strValue == 'this';
      };
      Token.prototype.isError = function() {
        return this.type == TokenType.Error;
      };
      Token.prototype.toNumber = function() {
        return this.type == TokenType.Number ? this.numValue : -1;
      };
      Token.prototype.toString = function() {
        switch (this.type) {
          case TokenType.Character:
          case TokenType.Identifier:
          case TokenType.Keyword:
          case TokenType.Operator:
          case TokenType.String:
          case TokenType.Error:
            return this.strValue;
          case TokenType.Number:
            return this.numValue.toString();
          default:
            return null;
        }
      };
      return Token;
    }());
    function newCharacterToken(index, code) {
      return new Token(index, TokenType.Character, code, String.fromCharCode(code));
    }
    function newIdentifierToken(index, text) {
      return new Token(index, TokenType.Identifier, 0, text);
    }
    function newKeywordToken(index, text) {
      return new Token(index, TokenType.Keyword, 0, text);
    }
    function newOperatorToken(index, text) {
      return new Token(index, TokenType.Operator, 0, text);
    }
    function newStringToken(index, text) {
      return new Token(index, TokenType.String, 0, text);
    }
    function newNumberToken(index, n) {
      return new Token(index, TokenType.Number, n, '');
    }
    function newErrorToken(index, message) {
      return new Token(index, TokenType.Error, 0, message);
    }
    var EOF = new Token(-1, TokenType.Character, 0, '');
    var _Scanner = (function() {
      function _Scanner(input) {
        this.input = input;
        this.peek = 0;
        this.index = -1;
        this.length = input.length;
        this.advance();
      }
      _Scanner.prototype.advance = function() {
        this.peek = ++this.index >= this.length ? $EOF : this.input.charCodeAt(this.index);
      };
      _Scanner.prototype.scanToken = function() {
        var input = this.input,
            length = this.length;
        var peek = this.peek,
            index = this.index;
        while (peek <= $SPACE) {
          if (++index >= length) {
            peek = $EOF;
            break;
          } else {
            peek = input.charCodeAt(index);
          }
        }
        this.peek = peek;
        this.index = index;
        if (index >= length) {
          return null;
        }
        if (isIdentifierStart(peek))
          return this.scanIdentifier();
        if (isDigit(peek))
          return this.scanNumber(index);
        var start = index;
        switch (peek) {
          case $PERIOD:
            this.advance();
            return isDigit(this.peek) ? this.scanNumber(start) : newCharacterToken(start, $PERIOD);
          case $LPAREN:
          case $RPAREN:
          case $LBRACE:
          case $RBRACE:
          case $LBRACKET:
          case $RBRACKET:
          case $COMMA:
          case $COLON:
          case $SEMICOLON:
            return this.scanCharacter(start, peek);
          case $SQ:
          case $DQ:
            return this.scanString();
          case $HASH:
          case $PLUS:
          case $MINUS:
          case $STAR:
          case $SLASH:
          case $PERCENT:
          case $CARET:
            return this.scanOperator(start, String.fromCharCode(peek));
          case $QUESTION:
            return this.scanComplexOperator(start, '?', $PERIOD, '.');
          case $LT:
          case $GT:
            return this.scanComplexOperator(start, String.fromCharCode(peek), $EQ, '=');
          case $BANG:
          case $EQ:
            return this.scanComplexOperator(start, String.fromCharCode(peek), $EQ, '=', $EQ, '=');
          case $AMPERSAND:
            return this.scanComplexOperator(start, '&', $AMPERSAND, '&');
          case $BAR:
            return this.scanComplexOperator(start, '|', $BAR, '|');
          case $NBSP:
            while (isWhitespace(this.peek))
              this.advance();
            return this.scanToken();
        }
        this.advance();
        return this.error("Unexpected character [" + String.fromCharCode(peek) + "]", 0);
      };
      _Scanner.prototype.scanCharacter = function(start, code) {
        this.advance();
        return newCharacterToken(start, code);
      };
      _Scanner.prototype.scanOperator = function(start, str) {
        this.advance();
        return newOperatorToken(start, str);
      };
      _Scanner.prototype.scanComplexOperator = function(start, one, twoCode, two, threeCode, three) {
        this.advance();
        var str = one;
        if (this.peek == twoCode) {
          this.advance();
          str += two;
        }
        if (threeCode != null && this.peek == threeCode) {
          this.advance();
          str += three;
        }
        return newOperatorToken(start, str);
      };
      _Scanner.prototype.scanIdentifier = function() {
        var start = this.index;
        this.advance();
        while (isIdentifierPart(this.peek))
          this.advance();
        var str = this.input.substring(start, this.index);
        return KEYWORDS.indexOf(str) > -1 ? newKeywordToken(start, str) : newIdentifierToken(start, str);
      };
      _Scanner.prototype.scanNumber = function(start) {
        var simple = (this.index === start);
        this.advance();
        while (true) {
          if (isDigit(this.peek)) {} else if (this.peek == $PERIOD) {
            simple = false;
          } else if (isExponentStart(this.peek)) {
            this.advance();
            if (isExponentSign(this.peek))
              this.advance();
            if (!isDigit(this.peek))
              return this.error('Invalid exponent', -1);
            simple = false;
          } else {
            break;
          }
          this.advance();
        }
        var str = this.input.substring(start, this.index);
        var value = simple ? parseIntAutoRadix(str) : parseFloat(str);
        return newNumberToken(start, value);
      };
      _Scanner.prototype.scanString = function() {
        var start = this.index;
        var quote = this.peek;
        this.advance();
        var buffer = '';
        var marker = this.index;
        var input = this.input;
        while (this.peek != quote) {
          if (this.peek == $BACKSLASH) {
            buffer += input.substring(marker, this.index);
            this.advance();
            var unescapedCode = void 0;
            this.peek = this.peek;
            if (this.peek == $u) {
              var hex = input.substring(this.index + 1, this.index + 5);
              if (/^[0-9a-f]+$/i.test(hex)) {
                unescapedCode = parseInt(hex, 16);
              } else {
                return this.error("Invalid unicode escape [\\u" + hex + "]", 0);
              }
              for (var i = 0; i < 5; i++) {
                this.advance();
              }
            } else {
              unescapedCode = unescape(this.peek);
              this.advance();
            }
            buffer += String.fromCharCode(unescapedCode);
            marker = this.index;
          } else if (this.peek == $EOF) {
            return this.error('Unterminated quote', 0);
          } else {
            this.advance();
          }
        }
        var last = input.substring(marker, this.index);
        this.advance();
        return newStringToken(start, buffer + last);
      };
      _Scanner.prototype.error = function(message, offset) {
        var position = this.index + offset;
        return newErrorToken(position, "Lexer Error: " + message + " at column " + position + " in expression [" + this.input + "]");
      };
      return _Scanner;
    }());
    function isIdentifierStart(code) {
      return ($a <= code && code <= $z) || ($A <= code && code <= $Z) || (code == $_) || (code == $$);
    }
    function isIdentifier(input) {
      if (input.length == 0)
        return false;
      var scanner = new _Scanner(input);
      if (!isIdentifierStart(scanner.peek))
        return false;
      scanner.advance();
      while (scanner.peek !== $EOF) {
        if (!isIdentifierPart(scanner.peek))
          return false;
        scanner.advance();
      }
      return true;
    }
    function isIdentifierPart(code) {
      return isAsciiLetter(code) || isDigit(code) || (code == $_) || (code == $$);
    }
    function isExponentStart(code) {
      return code == $e || code == $E;
    }
    function isExponentSign(code) {
      return code == $MINUS || code == $PLUS;
    }
    function isQuote(code) {
      return code === $SQ || code === $DQ || code === $BT;
    }
    function unescape(code) {
      switch (code) {
        case $n:
          return $LF;
        case $f:
          return $FF;
        case $r:
          return $CR;
        case $t:
          return $TAB;
        case $v:
          return $VTAB;
        default:
          return code;
      }
    }
    function parseIntAutoRadix(text) {
      var result = parseInt(text);
      if (isNaN(result)) {
        throw new Error('Invalid integer literal when parsing ' + text);
      }
      return result;
    }
    var ParserError = (function() {
      function ParserError(message, input, errLocation, ctxLocation) {
        this.input = input;
        this.errLocation = errLocation;
        this.ctxLocation = ctxLocation;
        this.message = "Parser Error: " + message + " " + errLocation + " [" + input + "] in " + ctxLocation;
      }
      return ParserError;
    }());
    var ParseSpan = (function() {
      function ParseSpan(start, end) {
        this.start = start;
        this.end = end;
      }
      return ParseSpan;
    }());
    var AST = (function() {
      function AST(span) {
        this.span = span;
      }
      AST.prototype.visit = function(visitor, context) {
        if (context === void 0) {
          context = null;
        }
        return null;
      };
      AST.prototype.toString = function() {
        return 'AST';
      };
      return AST;
    }());
    var Quote = (function(_super) {
      __extends(Quote, _super);
      function Quote(span, prefix, uninterpretedExpression, location) {
        var _this = _super.call(this, span) || this;
        _this.prefix = prefix;
        _this.uninterpretedExpression = uninterpretedExpression;
        _this.location = location;
        return _this;
      }
      Quote.prototype.visit = function(visitor, context) {
        if (context === void 0) {
          context = null;
        }
        return visitor.visitQuote(this, context);
      };
      Quote.prototype.toString = function() {
        return 'Quote';
      };
      return Quote;
    }(AST));
    var EmptyExpr = (function(_super) {
      __extends(EmptyExpr, _super);
      function EmptyExpr() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      EmptyExpr.prototype.visit = function(visitor, context) {
        if (context === void 0) {
          context = null;
        }
      };
      return EmptyExpr;
    }(AST));
    var ImplicitReceiver = (function(_super) {
      __extends(ImplicitReceiver, _super);
      function ImplicitReceiver() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      ImplicitReceiver.prototype.visit = function(visitor, context) {
        if (context === void 0) {
          context = null;
        }
        return visitor.visitImplicitReceiver(this, context);
      };
      return ImplicitReceiver;
    }(AST));
    var Chain = (function(_super) {
      __extends(Chain, _super);
      function Chain(span, expressions) {
        var _this = _super.call(this, span) || this;
        _this.expressions = expressions;
        return _this;
      }
      Chain.prototype.visit = function(visitor, context) {
        if (context === void 0) {
          context = null;
        }
        return visitor.visitChain(this, context);
      };
      return Chain;
    }(AST));
    var Conditional = (function(_super) {
      __extends(Conditional, _super);
      function Conditional(span, condition, trueExp, falseExp) {
        var _this = _super.call(this, span) || this;
        _this.condition = condition;
        _this.trueExp = trueExp;
        _this.falseExp = falseExp;
        return _this;
      }
      Conditional.prototype.visit = function(visitor, context) {
        if (context === void 0) {
          context = null;
        }
        return visitor.visitConditional(this, context);
      };
      return Conditional;
    }(AST));
    var PropertyRead = (function(_super) {
      __extends(PropertyRead, _super);
      function PropertyRead(span, receiver, name) {
        var _this = _super.call(this, span) || this;
        _this.receiver = receiver;
        _this.name = name;
        return _this;
      }
      PropertyRead.prototype.visit = function(visitor, context) {
        if (context === void 0) {
          context = null;
        }
        return visitor.visitPropertyRead(this, context);
      };
      return PropertyRead;
    }(AST));
    var PropertyWrite = (function(_super) {
      __extends(PropertyWrite, _super);
      function PropertyWrite(span, receiver, name, value) {
        var _this = _super.call(this, span) || this;
        _this.receiver = receiver;
        _this.name = name;
        _this.value = value;
        return _this;
      }
      PropertyWrite.prototype.visit = function(visitor, context) {
        if (context === void 0) {
          context = null;
        }
        return visitor.visitPropertyWrite(this, context);
      };
      return PropertyWrite;
    }(AST));
    var SafePropertyRead = (function(_super) {
      __extends(SafePropertyRead, _super);
      function SafePropertyRead(span, receiver, name) {
        var _this = _super.call(this, span) || this;
        _this.receiver = receiver;
        _this.name = name;
        return _this;
      }
      SafePropertyRead.prototype.visit = function(visitor, context) {
        if (context === void 0) {
          context = null;
        }
        return visitor.visitSafePropertyRead(this, context);
      };
      return SafePropertyRead;
    }(AST));
    var KeyedRead = (function(_super) {
      __extends(KeyedRead, _super);
      function KeyedRead(span, obj, key) {
        var _this = _super.call(this, span) || this;
        _this.obj = obj;
        _this.key = key;
        return _this;
      }
      KeyedRead.prototype.visit = function(visitor, context) {
        if (context === void 0) {
          context = null;
        }
        return visitor.visitKeyedRead(this, context);
      };
      return KeyedRead;
    }(AST));
    var KeyedWrite = (function(_super) {
      __extends(KeyedWrite, _super);
      function KeyedWrite(span, obj, key, value) {
        var _this = _super.call(this, span) || this;
        _this.obj = obj;
        _this.key = key;
        _this.value = value;
        return _this;
      }
      KeyedWrite.prototype.visit = function(visitor, context) {
        if (context === void 0) {
          context = null;
        }
        return visitor.visitKeyedWrite(this, context);
      };
      return KeyedWrite;
    }(AST));
    var BindingPipe = (function(_super) {
      __extends(BindingPipe, _super);
      function BindingPipe(span, exp, name, args) {
        var _this = _super.call(this, span) || this;
        _this.exp = exp;
        _this.name = name;
        _this.args = args;
        return _this;
      }
      BindingPipe.prototype.visit = function(visitor, context) {
        if (context === void 0) {
          context = null;
        }
        return visitor.visitPipe(this, context);
      };
      return BindingPipe;
    }(AST));
    var LiteralPrimitive = (function(_super) {
      __extends(LiteralPrimitive, _super);
      function LiteralPrimitive(span, value) {
        var _this = _super.call(this, span) || this;
        _this.value = value;
        return _this;
      }
      LiteralPrimitive.prototype.visit = function(visitor, context) {
        if (context === void 0) {
          context = null;
        }
        return visitor.visitLiteralPrimitive(this, context);
      };
      return LiteralPrimitive;
    }(AST));
    var LiteralArray = (function(_super) {
      __extends(LiteralArray, _super);
      function LiteralArray(span, expressions) {
        var _this = _super.call(this, span) || this;
        _this.expressions = expressions;
        return _this;
      }
      LiteralArray.prototype.visit = function(visitor, context) {
        if (context === void 0) {
          context = null;
        }
        return visitor.visitLiteralArray(this, context);
      };
      return LiteralArray;
    }(AST));
    var LiteralMap = (function(_super) {
      __extends(LiteralMap, _super);
      function LiteralMap(span, keys, values) {
        var _this = _super.call(this, span) || this;
        _this.keys = keys;
        _this.values = values;
        return _this;
      }
      LiteralMap.prototype.visit = function(visitor, context) {
        if (context === void 0) {
          context = null;
        }
        return visitor.visitLiteralMap(this, context);
      };
      return LiteralMap;
    }(AST));
    var Interpolation = (function(_super) {
      __extends(Interpolation, _super);
      function Interpolation(span, strings, expressions) {
        var _this = _super.call(this, span) || this;
        _this.strings = strings;
        _this.expressions = expressions;
        return _this;
      }
      Interpolation.prototype.visit = function(visitor, context) {
        if (context === void 0) {
          context = null;
        }
        return visitor.visitInterpolation(this, context);
      };
      return Interpolation;
    }(AST));
    var Binary = (function(_super) {
      __extends(Binary, _super);
      function Binary(span, operation, left, right) {
        var _this = _super.call(this, span) || this;
        _this.operation = operation;
        _this.left = left;
        _this.right = right;
        return _this;
      }
      Binary.prototype.visit = function(visitor, context) {
        if (context === void 0) {
          context = null;
        }
        return visitor.visitBinary(this, context);
      };
      return Binary;
    }(AST));
    var PrefixNot = (function(_super) {
      __extends(PrefixNot, _super);
      function PrefixNot(span, expression) {
        var _this = _super.call(this, span) || this;
        _this.expression = expression;
        return _this;
      }
      PrefixNot.prototype.visit = function(visitor, context) {
        if (context === void 0) {
          context = null;
        }
        return visitor.visitPrefixNot(this, context);
      };
      return PrefixNot;
    }(AST));
    var NonNullAssert = (function(_super) {
      __extends(NonNullAssert, _super);
      function NonNullAssert(span, expression) {
        var _this = _super.call(this, span) || this;
        _this.expression = expression;
        return _this;
      }
      NonNullAssert.prototype.visit = function(visitor, context) {
        if (context === void 0) {
          context = null;
        }
        return visitor.visitNonNullAssert(this, context);
      };
      return NonNullAssert;
    }(AST));
    var MethodCall = (function(_super) {
      __extends(MethodCall, _super);
      function MethodCall(span, receiver, name, args) {
        var _this = _super.call(this, span) || this;
        _this.receiver = receiver;
        _this.name = name;
        _this.args = args;
        return _this;
      }
      MethodCall.prototype.visit = function(visitor, context) {
        if (context === void 0) {
          context = null;
        }
        return visitor.visitMethodCall(this, context);
      };
      return MethodCall;
    }(AST));
    var SafeMethodCall = (function(_super) {
      __extends(SafeMethodCall, _super);
      function SafeMethodCall(span, receiver, name, args) {
        var _this = _super.call(this, span) || this;
        _this.receiver = receiver;
        _this.name = name;
        _this.args = args;
        return _this;
      }
      SafeMethodCall.prototype.visit = function(visitor, context) {
        if (context === void 0) {
          context = null;
        }
        return visitor.visitSafeMethodCall(this, context);
      };
      return SafeMethodCall;
    }(AST));
    var FunctionCall = (function(_super) {
      __extends(FunctionCall, _super);
      function FunctionCall(span, target, args) {
        var _this = _super.call(this, span) || this;
        _this.target = target;
        _this.args = args;
        return _this;
      }
      FunctionCall.prototype.visit = function(visitor, context) {
        if (context === void 0) {
          context = null;
        }
        return visitor.visitFunctionCall(this, context);
      };
      return FunctionCall;
    }(AST));
    var ASTWithSource = (function(_super) {
      __extends(ASTWithSource, _super);
      function ASTWithSource(ast, source, location, errors) {
        var _this = _super.call(this, new ParseSpan(0, source == null ? 0 : source.length)) || this;
        _this.ast = ast;
        _this.source = source;
        _this.location = location;
        _this.errors = errors;
        return _this;
      }
      ASTWithSource.prototype.visit = function(visitor, context) {
        if (context === void 0) {
          context = null;
        }
        return this.ast.visit(visitor, context);
      };
      ASTWithSource.prototype.toString = function() {
        return this.source + " in " + this.location;
      };
      return ASTWithSource;
    }(AST));
    var TemplateBinding = (function() {
      function TemplateBinding(span, key, keyIsVar, name, expression) {
        this.span = span;
        this.key = key;
        this.keyIsVar = keyIsVar;
        this.name = name;
        this.expression = expression;
      }
      return TemplateBinding;
    }());
    var NullAstVisitor = (function() {
      function NullAstVisitor() {}
      NullAstVisitor.prototype.visitBinary = function(ast, context) {};
      NullAstVisitor.prototype.visitChain = function(ast, context) {};
      NullAstVisitor.prototype.visitConditional = function(ast, context) {};
      NullAstVisitor.prototype.visitFunctionCall = function(ast, context) {};
      NullAstVisitor.prototype.visitImplicitReceiver = function(ast, context) {};
      NullAstVisitor.prototype.visitInterpolation = function(ast, context) {};
      NullAstVisitor.prototype.visitKeyedRead = function(ast, context) {};
      NullAstVisitor.prototype.visitKeyedWrite = function(ast, context) {};
      NullAstVisitor.prototype.visitLiteralArray = function(ast, context) {};
      NullAstVisitor.prototype.visitLiteralMap = function(ast, context) {};
      NullAstVisitor.prototype.visitLiteralPrimitive = function(ast, context) {};
      NullAstVisitor.prototype.visitMethodCall = function(ast, context) {};
      NullAstVisitor.prototype.visitPipe = function(ast, context) {};
      NullAstVisitor.prototype.visitPrefixNot = function(ast, context) {};
      NullAstVisitor.prototype.visitNonNullAssert = function(ast, context) {};
      NullAstVisitor.prototype.visitPropertyRead = function(ast, context) {};
      NullAstVisitor.prototype.visitPropertyWrite = function(ast, context) {};
      NullAstVisitor.prototype.visitQuote = function(ast, context) {};
      NullAstVisitor.prototype.visitSafeMethodCall = function(ast, context) {};
      NullAstVisitor.prototype.visitSafePropertyRead = function(ast, context) {};
      return NullAstVisitor;
    }());
    var RecursiveAstVisitor = (function() {
      function RecursiveAstVisitor() {}
      RecursiveAstVisitor.prototype.visitBinary = function(ast, context) {
        ast.left.visit(this);
        ast.right.visit(this);
        return null;
      };
      RecursiveAstVisitor.prototype.visitChain = function(ast, context) {
        return this.visitAll(ast.expressions, context);
      };
      RecursiveAstVisitor.prototype.visitConditional = function(ast, context) {
        ast.condition.visit(this);
        ast.trueExp.visit(this);
        ast.falseExp.visit(this);
        return null;
      };
      RecursiveAstVisitor.prototype.visitPipe = function(ast, context) {
        ast.exp.visit(this);
        this.visitAll(ast.args, context);
        return null;
      };
      RecursiveAstVisitor.prototype.visitFunctionCall = function(ast, context) {
        ((ast.target)).visit(this);
        this.visitAll(ast.args, context);
        return null;
      };
      RecursiveAstVisitor.prototype.visitImplicitReceiver = function(ast, context) {
        return null;
      };
      RecursiveAstVisitor.prototype.visitInterpolation = function(ast, context) {
        return this.visitAll(ast.expressions, context);
      };
      RecursiveAstVisitor.prototype.visitKeyedRead = function(ast, context) {
        ast.obj.visit(this);
        ast.key.visit(this);
        return null;
      };
      RecursiveAstVisitor.prototype.visitKeyedWrite = function(ast, context) {
        ast.obj.visit(this);
        ast.key.visit(this);
        ast.value.visit(this);
        return null;
      };
      RecursiveAstVisitor.prototype.visitLiteralArray = function(ast, context) {
        return this.visitAll(ast.expressions, context);
      };
      RecursiveAstVisitor.prototype.visitLiteralMap = function(ast, context) {
        return this.visitAll(ast.values, context);
      };
      RecursiveAstVisitor.prototype.visitLiteralPrimitive = function(ast, context) {
        return null;
      };
      RecursiveAstVisitor.prototype.visitMethodCall = function(ast, context) {
        ast.receiver.visit(this);
        return this.visitAll(ast.args, context);
      };
      RecursiveAstVisitor.prototype.visitPrefixNot = function(ast, context) {
        ast.expression.visit(this);
        return null;
      };
      RecursiveAstVisitor.prototype.visitNonNullAssert = function(ast, context) {
        ast.expression.visit(this);
        return null;
      };
      RecursiveAstVisitor.prototype.visitPropertyRead = function(ast, context) {
        ast.receiver.visit(this);
        return null;
      };
      RecursiveAstVisitor.prototype.visitPropertyWrite = function(ast, context) {
        ast.receiver.visit(this);
        ast.value.visit(this);
        return null;
      };
      RecursiveAstVisitor.prototype.visitSafePropertyRead = function(ast, context) {
        ast.receiver.visit(this);
        return null;
      };
      RecursiveAstVisitor.prototype.visitSafeMethodCall = function(ast, context) {
        ast.receiver.visit(this);
        return this.visitAll(ast.args, context);
      };
      RecursiveAstVisitor.prototype.visitAll = function(asts, context) {
        var _this = this;
        asts.forEach(function(ast) {
          return ast.visit(_this, context);
        });
        return null;
      };
      RecursiveAstVisitor.prototype.visitQuote = function(ast, context) {
        return null;
      };
      return RecursiveAstVisitor;
    }());
    var AstTransformer = (function() {
      function AstTransformer() {}
      AstTransformer.prototype.visitImplicitReceiver = function(ast, context) {
        return ast;
      };
      AstTransformer.prototype.visitInterpolation = function(ast, context) {
        return new Interpolation(ast.span, ast.strings, this.visitAll(ast.expressions));
      };
      AstTransformer.prototype.visitLiteralPrimitive = function(ast, context) {
        return new LiteralPrimitive(ast.span, ast.value);
      };
      AstTransformer.prototype.visitPropertyRead = function(ast, context) {
        return new PropertyRead(ast.span, ast.receiver.visit(this), ast.name);
      };
      AstTransformer.prototype.visitPropertyWrite = function(ast, context) {
        return new PropertyWrite(ast.span, ast.receiver.visit(this), ast.name, ast.value.visit(this));
      };
      AstTransformer.prototype.visitSafePropertyRead = function(ast, context) {
        return new SafePropertyRead(ast.span, ast.receiver.visit(this), ast.name);
      };
      AstTransformer.prototype.visitMethodCall = function(ast, context) {
        return new MethodCall(ast.span, ast.receiver.visit(this), ast.name, this.visitAll(ast.args));
      };
      AstTransformer.prototype.visitSafeMethodCall = function(ast, context) {
        return new SafeMethodCall(ast.span, ast.receiver.visit(this), ast.name, this.visitAll(ast.args));
      };
      AstTransformer.prototype.visitFunctionCall = function(ast, context) {
        return new FunctionCall(ast.span, ((ast.target)).visit(this), this.visitAll(ast.args));
      };
      AstTransformer.prototype.visitLiteralArray = function(ast, context) {
        return new LiteralArray(ast.span, this.visitAll(ast.expressions));
      };
      AstTransformer.prototype.visitLiteralMap = function(ast, context) {
        return new LiteralMap(ast.span, ast.keys, this.visitAll(ast.values));
      };
      AstTransformer.prototype.visitBinary = function(ast, context) {
        return new Binary(ast.span, ast.operation, ast.left.visit(this), ast.right.visit(this));
      };
      AstTransformer.prototype.visitPrefixNot = function(ast, context) {
        return new PrefixNot(ast.span, ast.expression.visit(this));
      };
      AstTransformer.prototype.visitNonNullAssert = function(ast, context) {
        return new NonNullAssert(ast.span, ast.expression.visit(this));
      };
      AstTransformer.prototype.visitConditional = function(ast, context) {
        return new Conditional(ast.span, ast.condition.visit(this), ast.trueExp.visit(this), ast.falseExp.visit(this));
      };
      AstTransformer.prototype.visitPipe = function(ast, context) {
        return new BindingPipe(ast.span, ast.exp.visit(this), ast.name, this.visitAll(ast.args));
      };
      AstTransformer.prototype.visitKeyedRead = function(ast, context) {
        return new KeyedRead(ast.span, ast.obj.visit(this), ast.key.visit(this));
      };
      AstTransformer.prototype.visitKeyedWrite = function(ast, context) {
        return new KeyedWrite(ast.span, ast.obj.visit(this), ast.key.visit(this), ast.value.visit(this));
      };
      AstTransformer.prototype.visitAll = function(asts) {
        var res = new Array(asts.length);
        for (var i = 0; i < asts.length; ++i) {
          res[i] = asts[i].visit(this);
        }
        return res;
      };
      AstTransformer.prototype.visitChain = function(ast, context) {
        return new Chain(ast.span, this.visitAll(ast.expressions));
      };
      AstTransformer.prototype.visitQuote = function(ast, context) {
        return new Quote(ast.span, ast.prefix, ast.uninterpretedExpression, ast.location);
      };
      return AstTransformer;
    }());
    function visitAstChildren(ast, visitor, context) {
      function visit(ast) {
        visitor.visit && visitor.visit(ast, context) || ast.visit(visitor, context);
      }
      function visitAll(asts) {
        asts.forEach(visit);
      }
      ast.visit({
        visitBinary: function(ast) {
          visit(ast.left);
          visit(ast.right);
        },
        visitChain: function(ast) {
          visitAll(ast.expressions);
        },
        visitConditional: function(ast) {
          visit(ast.condition);
          visit(ast.trueExp);
          visit(ast.falseExp);
        },
        visitFunctionCall: function(ast) {
          if (ast.target) {
            visit(ast.target);
          }
          visitAll(ast.args);
        },
        visitImplicitReceiver: function(ast) {},
        visitInterpolation: function(ast) {
          visitAll(ast.expressions);
        },
        visitKeyedRead: function(ast) {
          visit(ast.obj);
          visit(ast.key);
        },
        visitKeyedWrite: function(ast) {
          visit(ast.obj);
          visit(ast.key);
          visit(ast.obj);
        },
        visitLiteralArray: function(ast) {
          visitAll(ast.expressions);
        },
        visitLiteralMap: function(ast) {},
        visitLiteralPrimitive: function(ast) {},
        visitMethodCall: function(ast) {
          visit(ast.receiver);
          visitAll(ast.args);
        },
        visitPipe: function(ast) {
          visit(ast.exp);
          visitAll(ast.args);
        },
        visitPrefixNot: function(ast) {
          visit(ast.expression);
        },
        visitNonNullAssert: function(ast) {
          visit(ast.expression);
        },
        visitPropertyRead: function(ast) {
          visit(ast.receiver);
        },
        visitPropertyWrite: function(ast) {
          visit(ast.receiver);
          visit(ast.value);
        },
        visitQuote: function(ast) {},
        visitSafeMethodCall: function(ast) {
          visit(ast.receiver);
          visitAll(ast.args);
        },
        visitSafePropertyRead: function(ast) {
          visit(ast.receiver);
        }
      });
    }
    var SplitInterpolation = (function() {
      function SplitInterpolation(strings, expressions, offsets) {
        this.strings = strings;
        this.expressions = expressions;
        this.offsets = offsets;
      }
      return SplitInterpolation;
    }());
    var TemplateBindingParseResult = (function() {
      function TemplateBindingParseResult(templateBindings, warnings, errors) {
        this.templateBindings = templateBindings;
        this.warnings = warnings;
        this.errors = errors;
      }
      return TemplateBindingParseResult;
    }());
    function _createInterpolateRegExp(config) {
      var pattern = escapeRegExp(config.start) + '([\\s\\S]*?)' + escapeRegExp(config.end);
      return new RegExp(pattern, 'g');
    }
    var Parser = (function() {
      function Parser(_lexer) {
        this._lexer = _lexer;
        this.errors = [];
      }
      Parser.prototype.parseAction = function(input, location, interpolationConfig) {
        if (interpolationConfig === void 0) {
          interpolationConfig = DEFAULT_INTERPOLATION_CONFIG;
        }
        this._checkNoInterpolation(input, location, interpolationConfig);
        var sourceToLex = this._stripComments(input);
        var tokens = this._lexer.tokenize(this._stripComments(input));
        var ast = new _ParseAST(input, location, tokens, sourceToLex.length, true, this.errors, input.length - sourceToLex.length).parseChain();
        return new ASTWithSource(ast, input, location, this.errors);
      };
      Parser.prototype.parseBinding = function(input, location, interpolationConfig) {
        if (interpolationConfig === void 0) {
          interpolationConfig = DEFAULT_INTERPOLATION_CONFIG;
        }
        var ast = this._parseBindingAst(input, location, interpolationConfig);
        return new ASTWithSource(ast, input, location, this.errors);
      };
      Parser.prototype.parseSimpleBinding = function(input, location, interpolationConfig) {
        if (interpolationConfig === void 0) {
          interpolationConfig = DEFAULT_INTERPOLATION_CONFIG;
        }
        var ast = this._parseBindingAst(input, location, interpolationConfig);
        var errors = SimpleExpressionChecker.check(ast);
        if (errors.length > 0) {
          this._reportError("Host binding expression cannot contain " + errors.join(' '), input, location);
        }
        return new ASTWithSource(ast, input, location, this.errors);
      };
      Parser.prototype._reportError = function(message, input, errLocation, ctxLocation) {
        this.errors.push(new ParserError(message, input, errLocation, ctxLocation));
      };
      Parser.prototype._parseBindingAst = function(input, location, interpolationConfig) {
        var quote = this._parseQuote(input, location);
        if (quote != null) {
          return quote;
        }
        this._checkNoInterpolation(input, location, interpolationConfig);
        var sourceToLex = this._stripComments(input);
        var tokens = this._lexer.tokenize(sourceToLex);
        return new _ParseAST(input, location, tokens, sourceToLex.length, false, this.errors, input.length - sourceToLex.length).parseChain();
      };
      Parser.prototype._parseQuote = function(input, location) {
        if (input == null)
          return null;
        var prefixSeparatorIndex = input.indexOf(':');
        if (prefixSeparatorIndex == -1)
          return null;
        var prefix = input.substring(0, prefixSeparatorIndex).trim();
        if (!isIdentifier(prefix))
          return null;
        var uninterpretedExpression = input.substring(prefixSeparatorIndex + 1);
        return new Quote(new ParseSpan(0, input.length), prefix, uninterpretedExpression, location);
      };
      Parser.prototype.parseTemplateBindings = function(prefixToken, input, location) {
        var tokens = this._lexer.tokenize(input);
        if (prefixToken) {
          var prefixTokens = this._lexer.tokenize(prefixToken).map(function(t) {
            t.index = 0;
            return t;
          });
          tokens.unshift.apply(tokens, prefixTokens);
        }
        return new _ParseAST(input, location, tokens, input.length, false, this.errors, 0).parseTemplateBindings();
      };
      Parser.prototype.parseInterpolation = function(input, location, interpolationConfig) {
        if (interpolationConfig === void 0) {
          interpolationConfig = DEFAULT_INTERPOLATION_CONFIG;
        }
        var split = this.splitInterpolation(input, location, interpolationConfig);
        if (split == null)
          return null;
        var expressions = [];
        for (var i = 0; i < split.expressions.length; ++i) {
          var expressionText = split.expressions[i];
          var sourceToLex = this._stripComments(expressionText);
          var tokens = this._lexer.tokenize(sourceToLex);
          var ast = new _ParseAST(input, location, tokens, sourceToLex.length, false, this.errors, split.offsets[i] + (expressionText.length - sourceToLex.length)).parseChain();
          expressions.push(ast);
        }
        return new ASTWithSource(new Interpolation(new ParseSpan(0, input == null ? 0 : input.length), split.strings, expressions), input, location, this.errors);
      };
      Parser.prototype.splitInterpolation = function(input, location, interpolationConfig) {
        if (interpolationConfig === void 0) {
          interpolationConfig = DEFAULT_INTERPOLATION_CONFIG;
        }
        var regexp = _createInterpolateRegExp(interpolationConfig);
        var parts = input.split(regexp);
        if (parts.length <= 1) {
          return null;
        }
        var strings = [];
        var expressions = [];
        var offsets = [];
        var offset = 0;
        for (var i = 0; i < parts.length; i++) {
          var part = parts[i];
          if (i % 2 === 0) {
            strings.push(part);
            offset += part.length;
          } else if (part.trim().length > 0) {
            offset += interpolationConfig.start.length;
            expressions.push(part);
            offsets.push(offset);
            offset += part.length + interpolationConfig.end.length;
          } else {
            this._reportError('Blank expressions are not allowed in interpolated strings', input, "at column " + this._findInterpolationErrorColumn(parts, i, interpolationConfig) + " in", location);
            expressions.push('$implict');
            offsets.push(offset);
          }
        }
        return new SplitInterpolation(strings, expressions, offsets);
      };
      Parser.prototype.wrapLiteralPrimitive = function(input, location) {
        return new ASTWithSource(new LiteralPrimitive(new ParseSpan(0, input == null ? 0 : input.length), input), input, location, this.errors);
      };
      Parser.prototype._stripComments = function(input) {
        var i = this._commentStart(input);
        return i != null ? input.substring(0, i).trim() : input;
      };
      Parser.prototype._commentStart = function(input) {
        var outerQuote = null;
        for (var i = 0; i < input.length - 1; i++) {
          var char = input.charCodeAt(i);
          var nextChar = input.charCodeAt(i + 1);
          if (char === $SLASH && nextChar == $SLASH && outerQuote == null)
            return i;
          if (outerQuote === char) {
            outerQuote = null;
          } else if (outerQuote == null && isQuote(char)) {
            outerQuote = char;
          }
        }
        return null;
      };
      Parser.prototype._checkNoInterpolation = function(input, location, interpolationConfig) {
        var regexp = _createInterpolateRegExp(interpolationConfig);
        var parts = input.split(regexp);
        if (parts.length > 1) {
          this._reportError("Got interpolation (" + interpolationConfig.start + interpolationConfig.end + ") where expression was expected", input, "at column " + this._findInterpolationErrorColumn(parts, 1, interpolationConfig) + " in", location);
        }
      };
      Parser.prototype._findInterpolationErrorColumn = function(parts, partInErrIdx, interpolationConfig) {
        var errLocation = '';
        for (var j = 0; j < partInErrIdx; j++) {
          errLocation += j % 2 === 0 ? parts[j] : "" + interpolationConfig.start + parts[j] + interpolationConfig.end;
        }
        return errLocation.length;
      };
      return Parser;
    }());
    var _ParseAST = (function() {
      function _ParseAST(input, location, tokens, inputLength, parseAction, errors, offset) {
        this.input = input;
        this.location = location;
        this.tokens = tokens;
        this.inputLength = inputLength;
        this.parseAction = parseAction;
        this.errors = errors;
        this.offset = offset;
        this.rparensExpected = 0;
        this.rbracketsExpected = 0;
        this.rbracesExpected = 0;
        this.index = 0;
      }
      _ParseAST.prototype.peek = function(offset) {
        var i = this.index + offset;
        return i < this.tokens.length ? this.tokens[i] : EOF;
      };
      Object.defineProperty(_ParseAST.prototype, "next", {
        get: function() {
          return this.peek(0);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(_ParseAST.prototype, "inputIndex", {
        get: function() {
          return (this.index < this.tokens.length) ? this.next.index + this.offset : this.inputLength + this.offset;
        },
        enumerable: true,
        configurable: true
      });
      _ParseAST.prototype.span = function(start) {
        return new ParseSpan(start, this.inputIndex);
      };
      _ParseAST.prototype.advance = function() {
        this.index++;
      };
      _ParseAST.prototype.optionalCharacter = function(code) {
        if (this.next.isCharacter(code)) {
          this.advance();
          return true;
        } else {
          return false;
        }
      };
      _ParseAST.prototype.peekKeywordLet = function() {
        return this.next.isKeywordLet();
      };
      _ParseAST.prototype.peekKeywordAs = function() {
        return this.next.isKeywordAs();
      };
      _ParseAST.prototype.expectCharacter = function(code) {
        if (this.optionalCharacter(code))
          return;
        this.error("Missing expected " + String.fromCharCode(code));
      };
      _ParseAST.prototype.optionalOperator = function(op) {
        if (this.next.isOperator(op)) {
          this.advance();
          return true;
        } else {
          return false;
        }
      };
      _ParseAST.prototype.expectOperator = function(operator) {
        if (this.optionalOperator(operator))
          return;
        this.error("Missing expected operator " + operator);
      };
      _ParseAST.prototype.expectIdentifierOrKeyword = function() {
        var n = this.next;
        if (!n.isIdentifier() && !n.isKeyword()) {
          this.error("Unexpected token " + n + ", expected identifier or keyword");
          return '';
        }
        this.advance();
        return (n.toString());
      };
      _ParseAST.prototype.expectIdentifierOrKeywordOrString = function() {
        var n = this.next;
        if (!n.isIdentifier() && !n.isKeyword() && !n.isString()) {
          this.error("Unexpected token " + n + ", expected identifier, keyword, or string");
          return '';
        }
        this.advance();
        return (n.toString());
      };
      _ParseAST.prototype.parseChain = function() {
        var exprs = [];
        var start = this.inputIndex;
        while (this.index < this.tokens.length) {
          var expr = this.parsePipe();
          exprs.push(expr);
          if (this.optionalCharacter($SEMICOLON)) {
            if (!this.parseAction) {
              this.error('Binding expression cannot contain chained expression');
            }
            while (this.optionalCharacter($SEMICOLON)) {}
          } else if (this.index < this.tokens.length) {
            this.error("Unexpected token '" + this.next + "'");
          }
        }
        if (exprs.length == 0)
          return new EmptyExpr(this.span(start));
        if (exprs.length == 1)
          return exprs[0];
        return new Chain(this.span(start), exprs);
      };
      _ParseAST.prototype.parsePipe = function() {
        var result = this.parseExpression();
        if (this.optionalOperator('|')) {
          if (this.parseAction) {
            this.error('Cannot have a pipe in an action expression');
          }
          do {
            var name_1 = this.expectIdentifierOrKeyword();
            var args = [];
            while (this.optionalCharacter($COLON)) {
              args.push(this.parseExpression());
            }
            result = new BindingPipe(this.span(result.span.start), result, name_1, args);
          } while (this.optionalOperator('|'));
        }
        return result;
      };
      _ParseAST.prototype.parseExpression = function() {
        return this.parseConditional();
      };
      _ParseAST.prototype.parseConditional = function() {
        var start = this.inputIndex;
        var result = this.parseLogicalOr();
        if (this.optionalOperator('?')) {
          var yes = this.parsePipe();
          var no = void 0;
          if (!this.optionalCharacter($COLON)) {
            var end = this.inputIndex;
            var expression = this.input.substring(start, end);
            this.error("Conditional expression " + expression + " requires all 3 expressions");
            no = new EmptyExpr(this.span(start));
          } else {
            no = this.parsePipe();
          }
          return new Conditional(this.span(start), result, yes, no);
        } else {
          return result;
        }
      };
      _ParseAST.prototype.parseLogicalOr = function() {
        var result = this.parseLogicalAnd();
        while (this.optionalOperator('||')) {
          var right = this.parseLogicalAnd();
          result = new Binary(this.span(result.span.start), '||', result, right);
        }
        return result;
      };
      _ParseAST.prototype.parseLogicalAnd = function() {
        var result = this.parseEquality();
        while (this.optionalOperator('&&')) {
          var right = this.parseEquality();
          result = new Binary(this.span(result.span.start), '&&', result, right);
        }
        return result;
      };
      _ParseAST.prototype.parseEquality = function() {
        var result = this.parseRelational();
        while (this.next.type == TokenType.Operator) {
          var operator = this.next.strValue;
          switch (operator) {
            case '==':
            case '===':
            case '!=':
            case '!==':
              this.advance();
              var right = this.parseRelational();
              result = new Binary(this.span(result.span.start), operator, result, right);
              continue;
          }
          break;
        }
        return result;
      };
      _ParseAST.prototype.parseRelational = function() {
        var result = this.parseAdditive();
        while (this.next.type == TokenType.Operator) {
          var operator = this.next.strValue;
          switch (operator) {
            case '<':
            case '>':
            case '<=':
            case '>=':
              this.advance();
              var right = this.parseAdditive();
              result = new Binary(this.span(result.span.start), operator, result, right);
              continue;
          }
          break;
        }
        return result;
      };
      _ParseAST.prototype.parseAdditive = function() {
        var result = this.parseMultiplicative();
        while (this.next.type == TokenType.Operator) {
          var operator = this.next.strValue;
          switch (operator) {
            case '+':
            case '-':
              this.advance();
              var right = this.parseMultiplicative();
              result = new Binary(this.span(result.span.start), operator, result, right);
              continue;
          }
          break;
        }
        return result;
      };
      _ParseAST.prototype.parseMultiplicative = function() {
        var result = this.parsePrefix();
        while (this.next.type == TokenType.Operator) {
          var operator = this.next.strValue;
          switch (operator) {
            case '*':
            case '%':
            case '/':
              this.advance();
              var right = this.parsePrefix();
              result = new Binary(this.span(result.span.start), operator, result, right);
              continue;
          }
          break;
        }
        return result;
      };
      _ParseAST.prototype.parsePrefix = function() {
        if (this.next.type == TokenType.Operator) {
          var start = this.inputIndex;
          var operator = this.next.strValue;
          var result = void 0;
          switch (operator) {
            case '+':
              this.advance();
              result = this.parsePrefix();
              return new Binary(this.span(start), '-', result, new LiteralPrimitive(new ParseSpan(start, start), 0));
            case '-':
              this.advance();
              result = this.parsePrefix();
              return new Binary(this.span(start), operator, new LiteralPrimitive(new ParseSpan(start, start), 0), result);
            case '!':
              this.advance();
              result = this.parsePrefix();
              return new PrefixNot(this.span(start), result);
          }
        }
        return this.parseCallChain();
      };
      _ParseAST.prototype.parseCallChain = function() {
        var result = this.parsePrimary();
        while (true) {
          if (this.optionalCharacter($PERIOD)) {
            result = this.parseAccessMemberOrMethodCall(result, false);
          } else if (this.optionalOperator('?.')) {
            result = this.parseAccessMemberOrMethodCall(result, true);
          } else if (this.optionalCharacter($LBRACKET)) {
            this.rbracketsExpected++;
            var key = this.parsePipe();
            this.rbracketsExpected--;
            this.expectCharacter($RBRACKET);
            if (this.optionalOperator('=')) {
              var value = this.parseConditional();
              result = new KeyedWrite(this.span(result.span.start), result, key, value);
            } else {
              result = new KeyedRead(this.span(result.span.start), result, key);
            }
          } else if (this.optionalCharacter($LPAREN)) {
            this.rparensExpected++;
            var args = this.parseCallArguments();
            this.rparensExpected--;
            this.expectCharacter($RPAREN);
            result = new FunctionCall(this.span(result.span.start), result, args);
          } else if (this.optionalOperator('!')) {
            result = new NonNullAssert(this.span(result.span.start), result);
          } else {
            return result;
          }
        }
      };
      _ParseAST.prototype.parsePrimary = function() {
        var start = this.inputIndex;
        if (this.optionalCharacter($LPAREN)) {
          this.rparensExpected++;
          var result = this.parsePipe();
          this.rparensExpected--;
          this.expectCharacter($RPAREN);
          return result;
        } else if (this.next.isKeywordNull()) {
          this.advance();
          return new LiteralPrimitive(this.span(start), null);
        } else if (this.next.isKeywordUndefined()) {
          this.advance();
          return new LiteralPrimitive(this.span(start), void 0);
        } else if (this.next.isKeywordTrue()) {
          this.advance();
          return new LiteralPrimitive(this.span(start), true);
        } else if (this.next.isKeywordFalse()) {
          this.advance();
          return new LiteralPrimitive(this.span(start), false);
        } else if (this.next.isKeywordThis()) {
          this.advance();
          return new ImplicitReceiver(this.span(start));
        } else if (this.optionalCharacter($LBRACKET)) {
          this.rbracketsExpected++;
          var elements = this.parseExpressionList($RBRACKET);
          this.rbracketsExpected--;
          this.expectCharacter($RBRACKET);
          return new LiteralArray(this.span(start), elements);
        } else if (this.next.isCharacter($LBRACE)) {
          return this.parseLiteralMap();
        } else if (this.next.isIdentifier()) {
          return this.parseAccessMemberOrMethodCall(new ImplicitReceiver(this.span(start)), false);
        } else if (this.next.isNumber()) {
          var value = this.next.toNumber();
          this.advance();
          return new LiteralPrimitive(this.span(start), value);
        } else if (this.next.isString()) {
          var literalValue = this.next.toString();
          this.advance();
          return new LiteralPrimitive(this.span(start), literalValue);
        } else if (this.index >= this.tokens.length) {
          this.error("Unexpected end of expression: " + this.input);
          return new EmptyExpr(this.span(start));
        } else {
          this.error("Unexpected token " + this.next);
          return new EmptyExpr(this.span(start));
        }
      };
      _ParseAST.prototype.parseExpressionList = function(terminator) {
        var result = [];
        if (!this.next.isCharacter(terminator)) {
          do {
            result.push(this.parsePipe());
          } while (this.optionalCharacter($COMMA));
        }
        return result;
      };
      _ParseAST.prototype.parseLiteralMap = function() {
        var keys = [];
        var values = [];
        var start = this.inputIndex;
        this.expectCharacter($LBRACE);
        if (!this.optionalCharacter($RBRACE)) {
          this.rbracesExpected++;
          do {
            var quoted = this.next.isString();
            var key = this.expectIdentifierOrKeywordOrString();
            keys.push({
              key: key,
              quoted: quoted
            });
            this.expectCharacter($COLON);
            values.push(this.parsePipe());
          } while (this.optionalCharacter($COMMA));
          this.rbracesExpected--;
          this.expectCharacter($RBRACE);
        }
        return new LiteralMap(this.span(start), keys, values);
      };
      _ParseAST.prototype.parseAccessMemberOrMethodCall = function(receiver, isSafe) {
        if (isSafe === void 0) {
          isSafe = false;
        }
        var start = receiver.span.start;
        var id = this.expectIdentifierOrKeyword();
        if (this.optionalCharacter($LPAREN)) {
          this.rparensExpected++;
          var args = this.parseCallArguments();
          this.expectCharacter($RPAREN);
          this.rparensExpected--;
          var span = this.span(start);
          return isSafe ? new SafeMethodCall(span, receiver, id, args) : new MethodCall(span, receiver, id, args);
        } else {
          if (isSafe) {
            if (this.optionalOperator('=')) {
              this.error('The \'?.\' operator cannot be used in the assignment');
              return new EmptyExpr(this.span(start));
            } else {
              return new SafePropertyRead(this.span(start), receiver, id);
            }
          } else {
            if (this.optionalOperator('=')) {
              if (!this.parseAction) {
                this.error('Bindings cannot contain assignments');
                return new EmptyExpr(this.span(start));
              }
              var value = this.parseConditional();
              return new PropertyWrite(this.span(start), receiver, id, value);
            } else {
              return new PropertyRead(this.span(start), receiver, id);
            }
          }
        }
      };
      _ParseAST.prototype.parseCallArguments = function() {
        if (this.next.isCharacter($RPAREN))
          return [];
        var positionals = [];
        do {
          positionals.push(this.parsePipe());
        } while (this.optionalCharacter($COMMA));
        return (positionals);
      };
      _ParseAST.prototype.expectTemplateBindingKey = function() {
        var result = '';
        var operatorFound = false;
        do {
          result += this.expectIdentifierOrKeywordOrString();
          operatorFound = this.optionalOperator('-');
          if (operatorFound) {
            result += '-';
          }
        } while (operatorFound);
        return result.toString();
      };
      _ParseAST.prototype.parseTemplateBindings = function() {
        var bindings = [];
        var prefix = ((null));
        var warnings = [];
        while (this.index < this.tokens.length) {
          var start = this.inputIndex;
          var keyIsVar = this.peekKeywordLet();
          if (keyIsVar) {
            this.advance();
          }
          var rawKey = this.expectTemplateBindingKey();
          var key = rawKey;
          if (!keyIsVar) {
            if (prefix == null) {
              prefix = key;
            } else {
              key = prefix + key[0].toUpperCase() + key.substring(1);
            }
          }
          this.optionalCharacter($COLON);
          var name_2 = ((null));
          var expression = ((null));
          if (keyIsVar) {
            if (this.optionalOperator('=')) {
              name_2 = this.expectTemplateBindingKey();
            } else {
              name_2 = '\$implicit';
            }
          } else if (this.peekKeywordAs()) {
            var letStart = this.inputIndex;
            this.advance();
            name_2 = rawKey;
            key = this.expectTemplateBindingKey();
            keyIsVar = true;
          } else if (this.next !== EOF && !this.peekKeywordLet()) {
            var start_1 = this.inputIndex;
            var ast = this.parsePipe();
            var source = this.input.substring(start_1 - this.offset, this.inputIndex - this.offset);
            expression = new ASTWithSource(ast, source, this.location, this.errors);
          }
          bindings.push(new TemplateBinding(this.span(start), key, keyIsVar, name_2, expression));
          if (this.peekKeywordAs() && !keyIsVar) {
            var letStart = this.inputIndex;
            this.advance();
            var letName = this.expectTemplateBindingKey();
            bindings.push(new TemplateBinding(this.span(letStart), letName, true, key, ((null))));
          }
          if (!this.optionalCharacter($SEMICOLON)) {
            this.optionalCharacter($COMMA);
          }
        }
        return new TemplateBindingParseResult(bindings, warnings, this.errors);
      };
      _ParseAST.prototype.error = function(message, index) {
        if (index === void 0) {
          index = null;
        }
        this.errors.push(new ParserError(message, this.input, this.locationText(index), this.location));
        this.skip();
      };
      _ParseAST.prototype.locationText = function(index) {
        if (index === void 0) {
          index = null;
        }
        if (index == null)
          index = this.index;
        return (index < this.tokens.length) ? "at column " + (this.tokens[index].index + 1) + " in" : "at the end of the expression";
      };
      _ParseAST.prototype.skip = function() {
        var n = this.next;
        while (this.index < this.tokens.length && !n.isCharacter($SEMICOLON) && (this.rparensExpected <= 0 || !n.isCharacter($RPAREN)) && (this.rbracesExpected <= 0 || !n.isCharacter($RBRACE)) && (this.rbracketsExpected <= 0 || !n.isCharacter($RBRACKET))) {
          if (this.next.isError()) {
            this.errors.push(new ParserError(((this.next.toString())), this.input, this.locationText(), this.location));
          }
          this.advance();
          n = this.next;
        }
      };
      return _ParseAST;
    }());
    var SimpleExpressionChecker = (function() {
      function SimpleExpressionChecker() {
        this.errors = [];
      }
      SimpleExpressionChecker.check = function(ast) {
        var s = new SimpleExpressionChecker();
        ast.visit(s);
        return s.errors;
      };
      SimpleExpressionChecker.prototype.visitImplicitReceiver = function(ast, context) {};
      SimpleExpressionChecker.prototype.visitInterpolation = function(ast, context) {};
      SimpleExpressionChecker.prototype.visitLiteralPrimitive = function(ast, context) {};
      SimpleExpressionChecker.prototype.visitPropertyRead = function(ast, context) {};
      SimpleExpressionChecker.prototype.visitPropertyWrite = function(ast, context) {};
      SimpleExpressionChecker.prototype.visitSafePropertyRead = function(ast, context) {};
      SimpleExpressionChecker.prototype.visitMethodCall = function(ast, context) {};
      SimpleExpressionChecker.prototype.visitSafeMethodCall = function(ast, context) {};
      SimpleExpressionChecker.prototype.visitFunctionCall = function(ast, context) {};
      SimpleExpressionChecker.prototype.visitLiteralArray = function(ast, context) {
        this.visitAll(ast.expressions);
      };
      SimpleExpressionChecker.prototype.visitLiteralMap = function(ast, context) {
        this.visitAll(ast.values);
      };
      SimpleExpressionChecker.prototype.visitBinary = function(ast, context) {};
      SimpleExpressionChecker.prototype.visitPrefixNot = function(ast, context) {};
      SimpleExpressionChecker.prototype.visitNonNullAssert = function(ast, context) {};
      SimpleExpressionChecker.prototype.visitConditional = function(ast, context) {};
      SimpleExpressionChecker.prototype.visitPipe = function(ast, context) {
        this.errors.push('pipes');
      };
      SimpleExpressionChecker.prototype.visitKeyedRead = function(ast, context) {};
      SimpleExpressionChecker.prototype.visitKeyedWrite = function(ast, context) {};
      SimpleExpressionChecker.prototype.visitAll = function(asts) {
        var _this = this;
        return asts.map(function(node) {
          return node.visit(_this);
        });
      };
      SimpleExpressionChecker.prototype.visitChain = function(ast, context) {};
      SimpleExpressionChecker.prototype.visitQuote = function(ast, context) {};
      return SimpleExpressionChecker;
    }());
    var ParseLocation = (function() {
      function ParseLocation(file, offset, line, col) {
        this.file = file;
        this.offset = offset;
        this.line = line;
        this.col = col;
      }
      ParseLocation.prototype.toString = function() {
        return this.offset != null ? this.file.url + "@" + this.line + ":" + this.col : this.file.url;
      };
      ParseLocation.prototype.moveBy = function(delta) {
        var source = this.file.content;
        var len = source.length;
        var offset = this.offset;
        var line = this.line;
        var col = this.col;
        while (offset > 0 && delta < 0) {
          offset--;
          delta++;
          var ch = source.charCodeAt(offset);
          if (ch == $LF) {
            line--;
            var priorLine = source.substr(0, offset - 1).lastIndexOf(String.fromCharCode($LF));
            col = priorLine > 0 ? offset - priorLine : offset;
          } else {
            col--;
          }
        }
        while (offset < len && delta > 0) {
          var ch = source.charCodeAt(offset);
          offset++;
          delta--;
          if (ch == $LF) {
            line++;
            col = 0;
          } else {
            col++;
          }
        }
        return new ParseLocation(this.file, offset, line, col);
      };
      ParseLocation.prototype.getContext = function(maxChars, maxLines) {
        var content = this.file.content;
        var startOffset = this.offset;
        if (startOffset != null) {
          if (startOffset > content.length - 1) {
            startOffset = content.length - 1;
          }
          var endOffset = startOffset;
          var ctxChars = 0;
          var ctxLines = 0;
          while (ctxChars < maxChars && startOffset > 0) {
            startOffset--;
            ctxChars++;
            if (content[startOffset] == '\n') {
              if (++ctxLines == maxLines) {
                break;
              }
            }
          }
          ctxChars = 0;
          ctxLines = 0;
          while (ctxChars < maxChars && endOffset < content.length - 1) {
            endOffset++;
            ctxChars++;
            if (content[endOffset] == '\n') {
              if (++ctxLines == maxLines) {
                break;
              }
            }
          }
          return {
            before: content.substring(startOffset, this.offset),
            after: content.substring(this.offset, endOffset + 1)
          };
        }
        return null;
      };
      return ParseLocation;
    }());
    var ParseSourceFile = (function() {
      function ParseSourceFile(content, url) {
        this.content = content;
        this.url = url;
      }
      return ParseSourceFile;
    }());
    var ParseSourceSpan = (function() {
      function ParseSourceSpan(start, end, details) {
        if (details === void 0) {
          details = null;
        }
        this.start = start;
        this.end = end;
        this.details = details;
      }
      ParseSourceSpan.prototype.toString = function() {
        return this.start.file.content.substring(this.start.offset, this.end.offset);
      };
      return ParseSourceSpan;
    }());
    var ParseErrorLevel = {
      WARNING: 0,
      ERROR: 1
    };
    ParseErrorLevel[ParseErrorLevel.WARNING] = "WARNING";
    ParseErrorLevel[ParseErrorLevel.ERROR] = "ERROR";
    var ParseError = (function() {
      function ParseError(span, msg, level) {
        if (level === void 0) {
          level = ParseErrorLevel.ERROR;
        }
        this.span = span;
        this.msg = msg;
        this.level = level;
      }
      ParseError.prototype.contextualMessage = function() {
        var ctx = this.span.start.getContext(100, 3);
        return ctx ? this.msg + " (\"" + ctx.before + "[" + ParseErrorLevel[this.level] + " ->]" + ctx.after + "\")" : this.msg;
      };
      ParseError.prototype.toString = function() {
        var details = this.span.details ? ", " + this.span.details : '';
        return this.contextualMessage() + ": " + this.span.start + details;
      };
      return ParseError;
    }());
    function typeSourceSpan(kind, type) {
      var moduleUrl = identifierModuleUrl(type);
      var sourceFileName = moduleUrl != null ? "in " + kind + " " + identifierName(type) + " in " + moduleUrl : "in " + kind + " " + identifierName(type);
      var sourceFile = new ParseSourceFile('', sourceFileName);
      return new ParseSourceSpan(new ParseLocation(sourceFile, -1, -1, -1), new ParseLocation(sourceFile, -1, -1, -1));
    }
    var TokenType$1 = {
      TAG_OPEN_START: 0,
      TAG_OPEN_END: 1,
      TAG_OPEN_END_VOID: 2,
      TAG_CLOSE: 3,
      TEXT: 4,
      ESCAPABLE_RAW_TEXT: 5,
      RAW_TEXT: 6,
      COMMENT_START: 7,
      COMMENT_END: 8,
      CDATA_START: 9,
      CDATA_END: 10,
      ATTR_NAME: 11,
      ATTR_VALUE: 12,
      DOC_TYPE: 13,
      EXPANSION_FORM_START: 14,
      EXPANSION_CASE_VALUE: 15,
      EXPANSION_CASE_EXP_START: 16,
      EXPANSION_CASE_EXP_END: 17,
      EXPANSION_FORM_END: 18,
      EOF: 19
    };
    TokenType$1[TokenType$1.TAG_OPEN_START] = "TAG_OPEN_START";
    TokenType$1[TokenType$1.TAG_OPEN_END] = "TAG_OPEN_END";
    TokenType$1[TokenType$1.TAG_OPEN_END_VOID] = "TAG_OPEN_END_VOID";
    TokenType$1[TokenType$1.TAG_CLOSE] = "TAG_CLOSE";
    TokenType$1[TokenType$1.TEXT] = "TEXT";
    TokenType$1[TokenType$1.ESCAPABLE_RAW_TEXT] = "ESCAPABLE_RAW_TEXT";
    TokenType$1[TokenType$1.RAW_TEXT] = "RAW_TEXT";
    TokenType$1[TokenType$1.COMMENT_START] = "COMMENT_START";
    TokenType$1[TokenType$1.COMMENT_END] = "COMMENT_END";
    TokenType$1[TokenType$1.CDATA_START] = "CDATA_START";
    TokenType$1[TokenType$1.CDATA_END] = "CDATA_END";
    TokenType$1[TokenType$1.ATTR_NAME] = "ATTR_NAME";
    TokenType$1[TokenType$1.ATTR_VALUE] = "ATTR_VALUE";
    TokenType$1[TokenType$1.DOC_TYPE] = "DOC_TYPE";
    TokenType$1[TokenType$1.EXPANSION_FORM_START] = "EXPANSION_FORM_START";
    TokenType$1[TokenType$1.EXPANSION_CASE_VALUE] = "EXPANSION_CASE_VALUE";
    TokenType$1[TokenType$1.EXPANSION_CASE_EXP_START] = "EXPANSION_CASE_EXP_START";
    TokenType$1[TokenType$1.EXPANSION_CASE_EXP_END] = "EXPANSION_CASE_EXP_END";
    TokenType$1[TokenType$1.EXPANSION_FORM_END] = "EXPANSION_FORM_END";
    TokenType$1[TokenType$1.EOF] = "EOF";
    var Token$1 = (function() {
      function Token(type, parts, sourceSpan) {
        this.type = type;
        this.parts = parts;
        this.sourceSpan = sourceSpan;
      }
      return Token;
    }());
    var TokenError = (function(_super) {
      __extends(TokenError, _super);
      function TokenError(errorMsg, tokenType, span) {
        var _this = _super.call(this, span, errorMsg) || this;
        _this.tokenType = tokenType;
        return _this;
      }
      return TokenError;
    }(ParseError));
    var TokenizeResult = (function() {
      function TokenizeResult(tokens, errors) {
        this.tokens = tokens;
        this.errors = errors;
      }
      return TokenizeResult;
    }());
    function tokenize(source, url, getTagDefinition, tokenizeExpansionForms, interpolationConfig) {
      if (tokenizeExpansionForms === void 0) {
        tokenizeExpansionForms = false;
      }
      if (interpolationConfig === void 0) {
        interpolationConfig = DEFAULT_INTERPOLATION_CONFIG;
      }
      return new _Tokenizer(new ParseSourceFile(source, url), getTagDefinition, tokenizeExpansionForms, interpolationConfig).tokenize();
    }
    var _CR_OR_CRLF_REGEXP = /\r\n?/g;
    function _unexpectedCharacterErrorMsg(charCode) {
      var char = charCode === $EOF ? 'EOF' : String.fromCharCode(charCode);
      return "Unexpected character \"" + char + "\"";
    }
    function _unknownEntityErrorMsg(entitySrc) {
      return "Unknown entity \"" + entitySrc + "\" - use the \"&#<decimal>;\" or  \"&#x<hex>;\" syntax";
    }
    var _ControlFlowError = (function() {
      function _ControlFlowError(error) {
        this.error = error;
      }
      return _ControlFlowError;
    }());
    var _Tokenizer = (function() {
      function _Tokenizer(_file, _getTagDefinition, _tokenizeIcu, _interpolationConfig) {
        if (_interpolationConfig === void 0) {
          _interpolationConfig = DEFAULT_INTERPOLATION_CONFIG;
        }
        this._file = _file;
        this._getTagDefinition = _getTagDefinition;
        this._tokenizeIcu = _tokenizeIcu;
        this._interpolationConfig = _interpolationConfig;
        this._peek = -1;
        this._nextPeek = -1;
        this._index = -1;
        this._line = 0;
        this._column = -1;
        this._expansionCaseStack = [];
        this._inInterpolation = false;
        this.tokens = [];
        this.errors = [];
        this._input = _file.content;
        this._length = _file.content.length;
        this._advance();
      }
      _Tokenizer.prototype._processCarriageReturns = function(content) {
        return content.replace(_CR_OR_CRLF_REGEXP, '\n');
      };
      _Tokenizer.prototype.tokenize = function() {
        while (this._peek !== $EOF) {
          var start = this._getLocation();
          try {
            if (this._attemptCharCode($LT)) {
              if (this._attemptCharCode($BANG)) {
                if (this._attemptCharCode($LBRACKET)) {
                  this._consumeCdata(start);
                } else if (this._attemptCharCode($MINUS)) {
                  this._consumeComment(start);
                } else {
                  this._consumeDocType(start);
                }
              } else if (this._attemptCharCode($SLASH)) {
                this._consumeTagClose(start);
              } else {
                this._consumeTagOpen(start);
              }
            } else if (!(this._tokenizeIcu && this._tokenizeExpansionForm())) {
              this._consumeText();
            }
          } catch (e) {
            if (e instanceof _ControlFlowError) {
              this.errors.push(e.error);
            } else {
              throw e;
            }
          }
        }
        this._beginToken(TokenType$1.EOF);
        this._endToken([]);
        return new TokenizeResult(mergeTextTokens(this.tokens), this.errors);
      };
      _Tokenizer.prototype._tokenizeExpansionForm = function() {
        if (isExpansionFormStart(this._input, this._index, this._interpolationConfig)) {
          this._consumeExpansionFormStart();
          return true;
        }
        if (isExpansionCaseStart(this._peek) && this._isInExpansionForm()) {
          this._consumeExpansionCaseStart();
          return true;
        }
        if (this._peek === $RBRACE) {
          if (this._isInExpansionCase()) {
            this._consumeExpansionCaseEnd();
            return true;
          }
          if (this._isInExpansionForm()) {
            this._consumeExpansionFormEnd();
            return true;
          }
        }
        return false;
      };
      _Tokenizer.prototype._getLocation = function() {
        return new ParseLocation(this._file, this._index, this._line, this._column);
      };
      _Tokenizer.prototype._getSpan = function(start, end) {
        if (start === void 0) {
          start = this._getLocation();
        }
        if (end === void 0) {
          end = this._getLocation();
        }
        return new ParseSourceSpan(start, end);
      };
      _Tokenizer.prototype._beginToken = function(type, start) {
        if (start === void 0) {
          start = this._getLocation();
        }
        this._currentTokenStart = start;
        this._currentTokenType = type;
      };
      _Tokenizer.prototype._endToken = function(parts, end) {
        if (end === void 0) {
          end = this._getLocation();
        }
        var token = new Token$1(this._currentTokenType, parts, new ParseSourceSpan(this._currentTokenStart, end));
        this.tokens.push(token);
        this._currentTokenStart = ((null));
        this._currentTokenType = ((null));
        return token;
      };
      _Tokenizer.prototype._createError = function(msg, span) {
        if (this._isInExpansionForm()) {
          msg += " (Do you have an unescaped \"{\" in your template? Use \"{{ '{' }}\") to escape it.)";
        }
        var error = new TokenError(msg, this._currentTokenType, span);
        this._currentTokenStart = ((null));
        this._currentTokenType = ((null));
        return new _ControlFlowError(error);
      };
      _Tokenizer.prototype._advance = function() {
        if (this._index >= this._length) {
          throw this._createError(_unexpectedCharacterErrorMsg($EOF), this._getSpan());
        }
        if (this._peek === $LF) {
          this._line++;
          this._column = 0;
        } else if (this._peek !== $LF && this._peek !== $CR) {
          this._column++;
        }
        this._index++;
        this._peek = this._index >= this._length ? $EOF : this._input.charCodeAt(this._index);
        this._nextPeek = this._index + 1 >= this._length ? $EOF : this._input.charCodeAt(this._index + 1);
      };
      _Tokenizer.prototype._attemptCharCode = function(charCode) {
        if (this._peek === charCode) {
          this._advance();
          return true;
        }
        return false;
      };
      _Tokenizer.prototype._attemptCharCodeCaseInsensitive = function(charCode) {
        if (compareCharCodeCaseInsensitive(this._peek, charCode)) {
          this._advance();
          return true;
        }
        return false;
      };
      _Tokenizer.prototype._requireCharCode = function(charCode) {
        var location = this._getLocation();
        if (!this._attemptCharCode(charCode)) {
          throw this._createError(_unexpectedCharacterErrorMsg(this._peek), this._getSpan(location, location));
        }
      };
      _Tokenizer.prototype._attemptStr = function(chars) {
        var len = chars.length;
        if (this._index + len > this._length) {
          return false;
        }
        var initialPosition = this._savePosition();
        for (var i = 0; i < len; i++) {
          if (!this._attemptCharCode(chars.charCodeAt(i))) {
            this._restorePosition(initialPosition);
            return false;
          }
        }
        return true;
      };
      _Tokenizer.prototype._attemptStrCaseInsensitive = function(chars) {
        for (var i = 0; i < chars.length; i++) {
          if (!this._attemptCharCodeCaseInsensitive(chars.charCodeAt(i))) {
            return false;
          }
        }
        return true;
      };
      _Tokenizer.prototype._requireStr = function(chars) {
        var location = this._getLocation();
        if (!this._attemptStr(chars)) {
          throw this._createError(_unexpectedCharacterErrorMsg(this._peek), this._getSpan(location));
        }
      };
      _Tokenizer.prototype._attemptCharCodeUntilFn = function(predicate) {
        while (!predicate(this._peek)) {
          this._advance();
        }
      };
      _Tokenizer.prototype._requireCharCodeUntilFn = function(predicate, len) {
        var start = this._getLocation();
        this._attemptCharCodeUntilFn(predicate);
        if (this._index - start.offset < len) {
          throw this._createError(_unexpectedCharacterErrorMsg(this._peek), this._getSpan(start, start));
        }
      };
      _Tokenizer.prototype._attemptUntilChar = function(char) {
        while (this._peek !== char) {
          this._advance();
        }
      };
      _Tokenizer.prototype._readChar = function(decodeEntities) {
        if (decodeEntities && this._peek === $AMPERSAND) {
          return this._decodeEntity();
        } else {
          var index = this._index;
          this._advance();
          return this._input[index];
        }
      };
      _Tokenizer.prototype._decodeEntity = function() {
        var start = this._getLocation();
        this._advance();
        if (this._attemptCharCode($HASH)) {
          var isHex = this._attemptCharCode($x) || this._attemptCharCode($X);
          var numberStart = this._getLocation().offset;
          this._attemptCharCodeUntilFn(isDigitEntityEnd);
          if (this._peek != $SEMICOLON) {
            throw this._createError(_unexpectedCharacterErrorMsg(this._peek), this._getSpan());
          }
          this._advance();
          var strNum = this._input.substring(numberStart, this._index - 1);
          try {
            var charCode = parseInt(strNum, isHex ? 16 : 10);
            return String.fromCharCode(charCode);
          } catch (e) {
            var entity = this._input.substring(start.offset + 1, this._index - 1);
            throw this._createError(_unknownEntityErrorMsg(entity), this._getSpan(start));
          }
        } else {
          var startPosition = this._savePosition();
          this._attemptCharCodeUntilFn(isNamedEntityEnd);
          if (this._peek != $SEMICOLON) {
            this._restorePosition(startPosition);
            return '&';
          }
          this._advance();
          var name_1 = this._input.substring(start.offset + 1, this._index - 1);
          var char = NAMED_ENTITIES[name_1];
          if (!char) {
            throw this._createError(_unknownEntityErrorMsg(name_1), this._getSpan(start));
          }
          return char;
        }
      };
      _Tokenizer.prototype._consumeRawText = function(decodeEntities, firstCharOfEnd, attemptEndRest) {
        var tagCloseStart;
        var textStart = this._getLocation();
        this._beginToken(decodeEntities ? TokenType$1.ESCAPABLE_RAW_TEXT : TokenType$1.RAW_TEXT, textStart);
        var parts = [];
        while (true) {
          tagCloseStart = this._getLocation();
          if (this._attemptCharCode(firstCharOfEnd) && attemptEndRest()) {
            break;
          }
          if (this._index > tagCloseStart.offset) {
            parts.push(this._input.substring(tagCloseStart.offset, this._index));
          }
          while (this._peek !== firstCharOfEnd) {
            parts.push(this._readChar(decodeEntities));
          }
        }
        return this._endToken([this._processCarriageReturns(parts.join(''))], tagCloseStart);
      };
      _Tokenizer.prototype._consumeComment = function(start) {
        var _this = this;
        this._beginToken(TokenType$1.COMMENT_START, start);
        this._requireCharCode($MINUS);
        this._endToken([]);
        var textToken = this._consumeRawText(false, $MINUS, function() {
          return _this._attemptStr('->');
        });
        this._beginToken(TokenType$1.COMMENT_END, textToken.sourceSpan.end);
        this._endToken([]);
      };
      _Tokenizer.prototype._consumeCdata = function(start) {
        var _this = this;
        this._beginToken(TokenType$1.CDATA_START, start);
        this._requireStr('CDATA[');
        this._endToken([]);
        var textToken = this._consumeRawText(false, $RBRACKET, function() {
          return _this._attemptStr(']>');
        });
        this._beginToken(TokenType$1.CDATA_END, textToken.sourceSpan.end);
        this._endToken([]);
      };
      _Tokenizer.prototype._consumeDocType = function(start) {
        this._beginToken(TokenType$1.DOC_TYPE, start);
        this._attemptUntilChar($GT);
        this._advance();
        this._endToken([this._input.substring(start.offset + 2, this._index - 1)]);
      };
      _Tokenizer.prototype._consumePrefixAndName = function() {
        var nameOrPrefixStart = this._index;
        var prefix = ((null));
        while (this._peek !== $COLON && !isPrefixEnd(this._peek)) {
          this._advance();
        }
        var nameStart;
        if (this._peek === $COLON) {
          this._advance();
          prefix = this._input.substring(nameOrPrefixStart, this._index - 1);
          nameStart = this._index;
        } else {
          nameStart = nameOrPrefixStart;
        }
        this._requireCharCodeUntilFn(isNameEnd, this._index === nameStart ? 1 : 0);
        var name = this._input.substring(nameStart, this._index);
        return [prefix, name];
      };
      _Tokenizer.prototype._consumeTagOpen = function(start) {
        var savedPos = this._savePosition();
        var tagName;
        var lowercaseTagName;
        try {
          if (!isAsciiLetter(this._peek)) {
            throw this._createError(_unexpectedCharacterErrorMsg(this._peek), this._getSpan());
          }
          var nameStart = this._index;
          this._consumeTagOpenStart(start);
          tagName = this._input.substring(nameStart, this._index);
          lowercaseTagName = tagName.toLowerCase();
          this._attemptCharCodeUntilFn(isNotWhitespace);
          while (this._peek !== $SLASH && this._peek !== $GT) {
            this._consumeAttributeName();
            this._attemptCharCodeUntilFn(isNotWhitespace);
            if (this._attemptCharCode($EQ)) {
              this._attemptCharCodeUntilFn(isNotWhitespace);
              this._consumeAttributeValue();
            }
            this._attemptCharCodeUntilFn(isNotWhitespace);
          }
          this._consumeTagOpenEnd();
        } catch (e) {
          if (e instanceof _ControlFlowError) {
            this._restorePosition(savedPos);
            this._beginToken(TokenType$1.TEXT, start);
            this._endToken(['<']);
            return;
          }
          throw e;
        }
        var contentTokenType = this._getTagDefinition(tagName).contentType;
        if (contentTokenType === TagContentType.RAW_TEXT) {
          this._consumeRawTextWithTagClose(lowercaseTagName, false);
        } else if (contentTokenType === TagContentType.ESCAPABLE_RAW_TEXT) {
          this._consumeRawTextWithTagClose(lowercaseTagName, true);
        }
      };
      _Tokenizer.prototype._consumeRawTextWithTagClose = function(lowercaseTagName, decodeEntities) {
        var _this = this;
        var textToken = this._consumeRawText(decodeEntities, $LT, function() {
          if (!_this._attemptCharCode($SLASH))
            return false;
          _this._attemptCharCodeUntilFn(isNotWhitespace);
          if (!_this._attemptStrCaseInsensitive(lowercaseTagName))
            return false;
          _this._attemptCharCodeUntilFn(isNotWhitespace);
          return _this._attemptCharCode($GT);
        });
        this._beginToken(TokenType$1.TAG_CLOSE, textToken.sourceSpan.end);
        this._endToken([((null)), lowercaseTagName]);
      };
      _Tokenizer.prototype._consumeTagOpenStart = function(start) {
        this._beginToken(TokenType$1.TAG_OPEN_START, start);
        var parts = this._consumePrefixAndName();
        this._endToken(parts);
      };
      _Tokenizer.prototype._consumeAttributeName = function() {
        this._beginToken(TokenType$1.ATTR_NAME);
        var prefixAndName = this._consumePrefixAndName();
        this._endToken(prefixAndName);
      };
      _Tokenizer.prototype._consumeAttributeValue = function() {
        this._beginToken(TokenType$1.ATTR_VALUE);
        var value;
        if (this._peek === $SQ || this._peek === $DQ) {
          var quoteChar = this._peek;
          this._advance();
          var parts = [];
          while (this._peek !== quoteChar) {
            parts.push(this._readChar(true));
          }
          value = parts.join('');
          this._advance();
        } else {
          var valueStart = this._index;
          this._requireCharCodeUntilFn(isNameEnd, 1);
          value = this._input.substring(valueStart, this._index);
        }
        this._endToken([this._processCarriageReturns(value)]);
      };
      _Tokenizer.prototype._consumeTagOpenEnd = function() {
        var tokenType = this._attemptCharCode($SLASH) ? TokenType$1.TAG_OPEN_END_VOID : TokenType$1.TAG_OPEN_END;
        this._beginToken(tokenType);
        this._requireCharCode($GT);
        this._endToken([]);
      };
      _Tokenizer.prototype._consumeTagClose = function(start) {
        this._beginToken(TokenType$1.TAG_CLOSE, start);
        this._attemptCharCodeUntilFn(isNotWhitespace);
        var prefixAndName = this._consumePrefixAndName();
        this._attemptCharCodeUntilFn(isNotWhitespace);
        this._requireCharCode($GT);
        this._endToken(prefixAndName);
      };
      _Tokenizer.prototype._consumeExpansionFormStart = function() {
        this._beginToken(TokenType$1.EXPANSION_FORM_START, this._getLocation());
        this._requireCharCode($LBRACE);
        this._endToken([]);
        this._expansionCaseStack.push(TokenType$1.EXPANSION_FORM_START);
        this._beginToken(TokenType$1.RAW_TEXT, this._getLocation());
        var condition = this._readUntil($COMMA);
        this._endToken([condition], this._getLocation());
        this._requireCharCode($COMMA);
        this._attemptCharCodeUntilFn(isNotWhitespace);
        this._beginToken(TokenType$1.RAW_TEXT, this._getLocation());
        var type = this._readUntil($COMMA);
        this._endToken([type], this._getLocation());
        this._requireCharCode($COMMA);
        this._attemptCharCodeUntilFn(isNotWhitespace);
      };
      _Tokenizer.prototype._consumeExpansionCaseStart = function() {
        this._beginToken(TokenType$1.EXPANSION_CASE_VALUE, this._getLocation());
        var value = this._readUntil($LBRACE).trim();
        this._endToken([value], this._getLocation());
        this._attemptCharCodeUntilFn(isNotWhitespace);
        this._beginToken(TokenType$1.EXPANSION_CASE_EXP_START, this._getLocation());
        this._requireCharCode($LBRACE);
        this._endToken([], this._getLocation());
        this._attemptCharCodeUntilFn(isNotWhitespace);
        this._expansionCaseStack.push(TokenType$1.EXPANSION_CASE_EXP_START);
      };
      _Tokenizer.prototype._consumeExpansionCaseEnd = function() {
        this._beginToken(TokenType$1.EXPANSION_CASE_EXP_END, this._getLocation());
        this._requireCharCode($RBRACE);
        this._endToken([], this._getLocation());
        this._attemptCharCodeUntilFn(isNotWhitespace);
        this._expansionCaseStack.pop();
      };
      _Tokenizer.prototype._consumeExpansionFormEnd = function() {
        this._beginToken(TokenType$1.EXPANSION_FORM_END, this._getLocation());
        this._requireCharCode($RBRACE);
        this._endToken([]);
        this._expansionCaseStack.pop();
      };
      _Tokenizer.prototype._consumeText = function() {
        var start = this._getLocation();
        this._beginToken(TokenType$1.TEXT, start);
        var parts = [];
        do {
          if (this._interpolationConfig && this._attemptStr(this._interpolationConfig.start)) {
            parts.push(this._interpolationConfig.start);
            this._inInterpolation = true;
          } else if (this._interpolationConfig && this._inInterpolation && this._attemptStr(this._interpolationConfig.end)) {
            parts.push(this._interpolationConfig.end);
            this._inInterpolation = false;
          } else {
            parts.push(this._readChar(true));
          }
        } while (!this._isTextEnd());
        this._endToken([this._processCarriageReturns(parts.join(''))]);
      };
      _Tokenizer.prototype._isTextEnd = function() {
        if (this._peek === $LT || this._peek === $EOF) {
          return true;
        }
        if (this._tokenizeIcu && !this._inInterpolation) {
          if (isExpansionFormStart(this._input, this._index, this._interpolationConfig)) {
            return true;
          }
          if (this._peek === $RBRACE && this._isInExpansionCase()) {
            return true;
          }
        }
        return false;
      };
      _Tokenizer.prototype._savePosition = function() {
        return [this._peek, this._index, this._column, this._line, this.tokens.length];
      };
      _Tokenizer.prototype._readUntil = function(char) {
        var start = this._index;
        this._attemptUntilChar(char);
        return this._input.substring(start, this._index);
      };
      _Tokenizer.prototype._restorePosition = function(position) {
        this._peek = position[0];
        this._index = position[1];
        this._column = position[2];
        this._line = position[3];
        var nbTokens = position[4];
        if (nbTokens < this.tokens.length) {
          this.tokens = this.tokens.slice(0, nbTokens);
        }
      };
      _Tokenizer.prototype._isInExpansionCase = function() {
        return this._expansionCaseStack.length > 0 && this._expansionCaseStack[this._expansionCaseStack.length - 1] === TokenType$1.EXPANSION_CASE_EXP_START;
      };
      _Tokenizer.prototype._isInExpansionForm = function() {
        return this._expansionCaseStack.length > 0 && this._expansionCaseStack[this._expansionCaseStack.length - 1] === TokenType$1.EXPANSION_FORM_START;
      };
      return _Tokenizer;
    }());
    function isNotWhitespace(code) {
      return !isWhitespace(code) || code === $EOF;
    }
    function isNameEnd(code) {
      return isWhitespace(code) || code === $GT || code === $SLASH || code === $SQ || code === $DQ || code === $EQ;
    }
    function isPrefixEnd(code) {
      return (code < $a || $z < code) && (code < $A || $Z < code) && (code < $0 || code > $9);
    }
    function isDigitEntityEnd(code) {
      return code == $SEMICOLON || code == $EOF || !isAsciiHexDigit(code);
    }
    function isNamedEntityEnd(code) {
      return code == $SEMICOLON || code == $EOF || !isAsciiLetter(code);
    }
    function isExpansionFormStart(input, offset, interpolationConfig) {
      var isInterpolationStart = interpolationConfig ? input.indexOf(interpolationConfig.start, offset) == offset : false;
      return input.charCodeAt(offset) == $LBRACE && !isInterpolationStart;
    }
    function isExpansionCaseStart(peek) {
      return peek === $EQ || isAsciiLetter(peek) || isDigit(peek);
    }
    function compareCharCodeCaseInsensitive(code1, code2) {
      return toUpperCaseCharCode(code1) == toUpperCaseCharCode(code2);
    }
    function toUpperCaseCharCode(code) {
      return code >= $a && code <= $z ? code - $a + $A : code;
    }
    function mergeTextTokens(srcTokens) {
      var dstTokens = [];
      var lastDstToken = undefined;
      for (var i = 0; i < srcTokens.length; i++) {
        var token = srcTokens[i];
        if (lastDstToken && lastDstToken.type == TokenType$1.TEXT && token.type == TokenType$1.TEXT) {
          lastDstToken.parts[0] += token.parts[0];
          lastDstToken.sourceSpan.end = token.sourceSpan.end;
        } else {
          lastDstToken = token;
          dstTokens.push(lastDstToken);
        }
      }
      return dstTokens;
    }
    var TreeError = (function(_super) {
      __extends(TreeError, _super);
      function TreeError(elementName, span, msg) {
        var _this = _super.call(this, span, msg) || this;
        _this.elementName = elementName;
        return _this;
      }
      TreeError.create = function(elementName, span, msg) {
        return new TreeError(elementName, span, msg);
      };
      return TreeError;
    }(ParseError));
    var ParseTreeResult = (function() {
      function ParseTreeResult(rootNodes, errors) {
        this.rootNodes = rootNodes;
        this.errors = errors;
      }
      return ParseTreeResult;
    }());
    var Parser$1 = (function() {
      function Parser(getTagDefinition) {
        this.getTagDefinition = getTagDefinition;
      }
      Parser.prototype.parse = function(source, url, parseExpansionForms, interpolationConfig) {
        if (parseExpansionForms === void 0) {
          parseExpansionForms = false;
        }
        if (interpolationConfig === void 0) {
          interpolationConfig = DEFAULT_INTERPOLATION_CONFIG;
        }
        var tokensAndErrors = tokenize(source, url, this.getTagDefinition, parseExpansionForms, interpolationConfig);
        var treeAndErrors = new _TreeBuilder(tokensAndErrors.tokens, this.getTagDefinition).build();
        return new ParseTreeResult(treeAndErrors.rootNodes, ((tokensAndErrors.errors)).concat(treeAndErrors.errors));
      };
      return Parser;
    }());
    var _TreeBuilder = (function() {
      function _TreeBuilder(tokens, getTagDefinition) {
        this.tokens = tokens;
        this.getTagDefinition = getTagDefinition;
        this._index = -1;
        this._rootNodes = [];
        this._errors = [];
        this._elementStack = [];
        this._advance();
      }
      _TreeBuilder.prototype.build = function() {
        while (this._peek.type !== TokenType$1.EOF) {
          if (this._peek.type === TokenType$1.TAG_OPEN_START) {
            this._consumeStartTag(this._advance());
          } else if (this._peek.type === TokenType$1.TAG_CLOSE) {
            this._consumeEndTag(this._advance());
          } else if (this._peek.type === TokenType$1.CDATA_START) {
            this._closeVoidElement();
            this._consumeCdata(this._advance());
          } else if (this._peek.type === TokenType$1.COMMENT_START) {
            this._closeVoidElement();
            this._consumeComment(this._advance());
          } else if (this._peek.type === TokenType$1.TEXT || this._peek.type === TokenType$1.RAW_TEXT || this._peek.type === TokenType$1.ESCAPABLE_RAW_TEXT) {
            this._closeVoidElement();
            this._consumeText(this._advance());
          } else if (this._peek.type === TokenType$1.EXPANSION_FORM_START) {
            this._consumeExpansion(this._advance());
          } else {
            this._advance();
          }
        }
        return new ParseTreeResult(this._rootNodes, this._errors);
      };
      _TreeBuilder.prototype._advance = function() {
        var prev = this._peek;
        if (this._index < this.tokens.length - 1) {
          this._index++;
        }
        this._peek = this.tokens[this._index];
        return prev;
      };
      _TreeBuilder.prototype._advanceIf = function(type) {
        if (this._peek.type === type) {
          return this._advance();
        }
        return null;
      };
      _TreeBuilder.prototype._consumeCdata = function(startToken) {
        this._consumeText(this._advance());
        this._advanceIf(TokenType$1.CDATA_END);
      };
      _TreeBuilder.prototype._consumeComment = function(token) {
        var text = this._advanceIf(TokenType$1.RAW_TEXT);
        this._advanceIf(TokenType$1.COMMENT_END);
        var value = text != null ? text.parts[0].trim() : null;
        this._addToParent(new Comment(value, token.sourceSpan));
      };
      _TreeBuilder.prototype._consumeExpansion = function(token) {
        var switchValue = this._advance();
        var type = this._advance();
        var cases = [];
        while (this._peek.type === TokenType$1.EXPANSION_CASE_VALUE) {
          var expCase = this._parseExpansionCase();
          if (!expCase)
            return;
          cases.push(expCase);
        }
        if (this._peek.type !== TokenType$1.EXPANSION_FORM_END) {
          this._errors.push(TreeError.create(null, this._peek.sourceSpan, "Invalid ICU message. Missing '}'."));
          return;
        }
        var sourceSpan = new ParseSourceSpan(token.sourceSpan.start, this._peek.sourceSpan.end);
        this._addToParent(new Expansion(switchValue.parts[0], type.parts[0], cases, sourceSpan, switchValue.sourceSpan));
        this._advance();
      };
      _TreeBuilder.prototype._parseExpansionCase = function() {
        var value = this._advance();
        if (this._peek.type !== TokenType$1.EXPANSION_CASE_EXP_START) {
          this._errors.push(TreeError.create(null, this._peek.sourceSpan, "Invalid ICU message. Missing '{'."));
          return null;
        }
        var start = this._advance();
        var exp = this._collectExpansionExpTokens(start);
        if (!exp)
          return null;
        var end = this._advance();
        exp.push(new Token$1(TokenType$1.EOF, [], end.sourceSpan));
        var parsedExp = new _TreeBuilder(exp, this.getTagDefinition).build();
        if (parsedExp.errors.length > 0) {
          this._errors = this._errors.concat((parsedExp.errors));
          return null;
        }
        var sourceSpan = new ParseSourceSpan(value.sourceSpan.start, end.sourceSpan.end);
        var expSourceSpan = new ParseSourceSpan(start.sourceSpan.start, end.sourceSpan.end);
        return new ExpansionCase(value.parts[0], parsedExp.rootNodes, sourceSpan, value.sourceSpan, expSourceSpan);
      };
      _TreeBuilder.prototype._collectExpansionExpTokens = function(start) {
        var exp = [];
        var expansionFormStack = [TokenType$1.EXPANSION_CASE_EXP_START];
        while (true) {
          if (this._peek.type === TokenType$1.EXPANSION_FORM_START || this._peek.type === TokenType$1.EXPANSION_CASE_EXP_START) {
            expansionFormStack.push(this._peek.type);
          }
          if (this._peek.type === TokenType$1.EXPANSION_CASE_EXP_END) {
            if (lastOnStack(expansionFormStack, TokenType$1.EXPANSION_CASE_EXP_START)) {
              expansionFormStack.pop();
              if (expansionFormStack.length == 0)
                return exp;
            } else {
              this._errors.push(TreeError.create(null, start.sourceSpan, "Invalid ICU message. Missing '}'."));
              return null;
            }
          }
          if (this._peek.type === TokenType$1.EXPANSION_FORM_END) {
            if (lastOnStack(expansionFormStack, TokenType$1.EXPANSION_FORM_START)) {
              expansionFormStack.pop();
            } else {
              this._errors.push(TreeError.create(null, start.sourceSpan, "Invalid ICU message. Missing '}'."));
              return null;
            }
          }
          if (this._peek.type === TokenType$1.EOF) {
            this._errors.push(TreeError.create(null, start.sourceSpan, "Invalid ICU message. Missing '}'."));
            return null;
          }
          exp.push(this._advance());
        }
      };
      _TreeBuilder.prototype._consumeText = function(token) {
        var text = token.parts[0];
        if (text.length > 0 && text[0] == '\n') {
          var parent_1 = this._getParentElement();
          if (parent_1 != null && parent_1.children.length == 0 && this.getTagDefinition(parent_1.name).ignoreFirstLf) {
            text = text.substring(1);
          }
        }
        if (text.length > 0) {
          this._addToParent(new Text(text, token.sourceSpan));
        }
      };
      _TreeBuilder.prototype._closeVoidElement = function() {
        var el = this._getParentElement();
        if (el && this.getTagDefinition(el.name).isVoid) {
          this._elementStack.pop();
        }
      };
      _TreeBuilder.prototype._consumeStartTag = function(startTagToken) {
        var prefix = startTagToken.parts[0];
        var name = startTagToken.parts[1];
        var attrs = [];
        while (this._peek.type === TokenType$1.ATTR_NAME) {
          attrs.push(this._consumeAttr(this._advance()));
        }
        var fullName = this._getElementFullName(prefix, name, this._getParentElement());
        var selfClosing = false;
        if (this._peek.type === TokenType$1.TAG_OPEN_END_VOID) {
          this._advance();
          selfClosing = true;
          var tagDef = this.getTagDefinition(fullName);
          if (!(tagDef.canSelfClose || getNsPrefix(fullName) !== null || tagDef.isVoid)) {
            this._errors.push(TreeError.create(fullName, startTagToken.sourceSpan, "Only void and foreign elements can be self closed \"" + startTagToken.parts[1] + "\""));
          }
        } else if (this._peek.type === TokenType$1.TAG_OPEN_END) {
          this._advance();
          selfClosing = false;
        }
        var end = this._peek.sourceSpan.start;
        var span = new ParseSourceSpan(startTagToken.sourceSpan.start, end);
        var el = new Element(fullName, attrs, [], span, span, undefined);
        this._pushElement(el);
        if (selfClosing) {
          this._popElement(fullName);
          el.endSourceSpan = span;
        }
      };
      _TreeBuilder.prototype._pushElement = function(el) {
        var parentEl = this._getParentElement();
        if (parentEl && this.getTagDefinition(parentEl.name).isClosedByChild(el.name)) {
          this._elementStack.pop();
        }
        var tagDef = this.getTagDefinition(el.name);
        var _a = this._getParentElementSkippingContainers(),
            parent = _a.parent,
            container = _a.container;
        if (parent && tagDef.requireExtraParent(parent.name)) {
          var newParent = new Element(tagDef.parentToAdd, [], [], el.sourceSpan, el.startSourceSpan, el.endSourceSpan);
          this._insertBeforeContainer(parent, container, newParent);
        }
        this._addToParent(el);
        this._elementStack.push(el);
      };
      _TreeBuilder.prototype._consumeEndTag = function(endTagToken) {
        var fullName = this._getElementFullName(endTagToken.parts[0], endTagToken.parts[1], this._getParentElement());
        if (this._getParentElement()) {
          ((this._getParentElement())).endSourceSpan = endTagToken.sourceSpan;
        }
        if (this.getTagDefinition(fullName).isVoid) {
          this._errors.push(TreeError.create(fullName, endTagToken.sourceSpan, "Void elements do not have end tags \"" + endTagToken.parts[1] + "\""));
        } else if (!this._popElement(fullName)) {
          var errMsg = "Unexpected closing tag \"" + fullName + "\". It may happen when the tag has already been closed by another tag. For more info see https://www.w3.org/TR/html5/syntax.html#closing-elements-that-have-implied-end-tags";
          this._errors.push(TreeError.create(fullName, endTagToken.sourceSpan, errMsg));
        }
      };
      _TreeBuilder.prototype._popElement = function(fullName) {
        for (var stackIndex = this._elementStack.length - 1; stackIndex >= 0; stackIndex--) {
          var el = this._elementStack[stackIndex];
          if (el.name == fullName) {
            this._elementStack.splice(stackIndex, this._elementStack.length - stackIndex);
            return true;
          }
          if (!this.getTagDefinition(el.name).closedByParent) {
            return false;
          }
        }
        return false;
      };
      _TreeBuilder.prototype._consumeAttr = function(attrName) {
        var fullName = mergeNsAndName(attrName.parts[0], attrName.parts[1]);
        var end = attrName.sourceSpan.end;
        var value = '';
        var valueSpan = ((undefined));
        if (this._peek.type === TokenType$1.ATTR_VALUE) {
          var valueToken = this._advance();
          value = valueToken.parts[0];
          end = valueToken.sourceSpan.end;
          valueSpan = valueToken.sourceSpan;
        }
        return new Attribute$1(fullName, value, new ParseSourceSpan(attrName.sourceSpan.start, end), valueSpan);
      };
      _TreeBuilder.prototype._getParentElement = function() {
        return this._elementStack.length > 0 ? this._elementStack[this._elementStack.length - 1] : null;
      };
      _TreeBuilder.prototype._getParentElementSkippingContainers = function() {
        var container = null;
        for (var i = this._elementStack.length - 1; i >= 0; i--) {
          if (!isNgContainer(this._elementStack[i].name)) {
            return {
              parent: this._elementStack[i],
              container: container
            };
          }
          container = this._elementStack[i];
        }
        return {
          parent: null,
          container: container
        };
      };
      _TreeBuilder.prototype._addToParent = function(node) {
        var parent = this._getParentElement();
        if (parent != null) {
          parent.children.push(node);
        } else {
          this._rootNodes.push(node);
        }
      };
      _TreeBuilder.prototype._insertBeforeContainer = function(parent, container, node) {
        if (!container) {
          this._addToParent(node);
          this._elementStack.push(node);
        } else {
          if (parent) {
            var index = parent.children.indexOf(container);
            parent.children[index] = node;
          } else {
            this._rootNodes.push(node);
          }
          node.children.push(container);
          this._elementStack.splice(this._elementStack.indexOf(container), 0, node);
        }
      };
      _TreeBuilder.prototype._getElementFullName = function(prefix, localName, parentElement) {
        if (prefix == null) {
          prefix = ((this.getTagDefinition(localName).implicitNamespacePrefix));
          if (prefix == null && parentElement != null) {
            prefix = getNsPrefix(parentElement.name);
          }
        }
        return mergeNsAndName(prefix, localName);
      };
      return _TreeBuilder;
    }());
    function lastOnStack(stack, element) {
      return stack.length > 0 && stack[stack.length - 1] === element;
    }
    function digest(message) {
      return message.id || sha1(serializeNodes(message.nodes).join('') + ("[" + message.meaning + "]"));
    }
    function decimalDigest(message) {
      if (message.id) {
        return message.id;
      }
      var visitor = new _SerializerIgnoreIcuExpVisitor();
      var parts = message.nodes.map(function(a) {
        return a.visit(visitor, null);
      });
      return computeMsgId(parts.join(''), message.meaning);
    }
    var _SerializerVisitor = (function() {
      function _SerializerVisitor() {}
      _SerializerVisitor.prototype.visitText = function(text, context) {
        return text.value;
      };
      _SerializerVisitor.prototype.visitContainer = function(container, context) {
        var _this = this;
        return "[" + container.children.map(function(child) {
          return child.visit(_this);
        }).join(', ') + "]";
      };
      _SerializerVisitor.prototype.visitIcu = function(icu, context) {
        var _this = this;
        var strCases = Object.keys(icu.cases).map(function(k) {
          return k + " {" + icu.cases[k].visit(_this) + "}";
        });
        return "{" + icu.expression + ", " + icu.type + ", " + strCases.join(', ') + "}";
      };
      _SerializerVisitor.prototype.visitTagPlaceholder = function(ph, context) {
        var _this = this;
        return ph.isVoid ? "<ph tag name=\"" + ph.startName + "\"/>" : "<ph tag name=\"" + ph.startName + "\">" + ph.children.map(function(child) {
          return child.visit(_this);
        }).join(', ') + "</ph name=\"" + ph.closeName + "\">";
      };
      _SerializerVisitor.prototype.visitPlaceholder = function(ph, context) {
        return ph.value ? "<ph name=\"" + ph.name + "\">" + ph.value + "</ph>" : "<ph name=\"" + ph.name + "\"/>";
      };
      _SerializerVisitor.prototype.visitIcuPlaceholder = function(ph, context) {
        return "<ph icu name=\"" + ph.name + "\">" + ph.value.visit(this) + "</ph>";
      };
      return _SerializerVisitor;
    }());
    var serializerVisitor = new _SerializerVisitor();
    function serializeNodes(nodes) {
      return nodes.map(function(a) {
        return a.visit(serializerVisitor, null);
      });
    }
    var _SerializerIgnoreIcuExpVisitor = (function(_super) {
      __extends(_SerializerIgnoreIcuExpVisitor, _super);
      function _SerializerIgnoreIcuExpVisitor() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      _SerializerIgnoreIcuExpVisitor.prototype.visitIcu = function(icu, context) {
        var _this = this;
        var strCases = Object.keys(icu.cases).map(function(k) {
          return k + " {" + icu.cases[k].visit(_this) + "}";
        });
        return "{" + icu.type + ", " + strCases.join(', ') + "}";
      };
      return _SerializerIgnoreIcuExpVisitor;
    }(_SerializerVisitor));
    function sha1(str) {
      var utf8 = utf8Encode(str);
      var words32 = stringToWords32(utf8, Endian.Big);
      var len = utf8.length * 8;
      var w = new Array(80);
      var _a = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0],
          a = _a[0],
          b = _a[1],
          c = _a[2],
          d = _a[3],
          e = _a[4];
      words32[len >> 5] |= 0x80 << (24 - len % 32);
      words32[((len + 64 >> 9) << 4) + 15] = len;
      for (var i = 0; i < words32.length; i += 16) {
        var _b = [a, b, c, d, e],
            h0 = _b[0],
            h1 = _b[1],
            h2 = _b[2],
            h3 = _b[3],
            h4 = _b[4];
        for (var j = 0; j < 80; j++) {
          if (j < 16) {
            w[j] = words32[i + j];
          } else {
            w[j] = rol32(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
          }
          var _c = fk(j, b, c, d),
              f = _c[0],
              k = _c[1];
          var temp = [rol32(a, 5), f, e, k, w[j]].reduce(add32);
          _d = [d, c, rol32(b, 30), a, temp], e = _d[0], d = _d[1], c = _d[2], b = _d[3], a = _d[4];
        }
        _e = [add32(a, h0), add32(b, h1), add32(c, h2), add32(d, h3), add32(e, h4)], a = _e[0], b = _e[1], c = _e[2], d = _e[3], e = _e[4];
      }
      return byteStringToHexString(words32ToByteString([a, b, c, d, e]));
      var _d,
          _e;
    }
    function fk(index, b, c, d) {
      if (index < 20) {
        return [(b & c) | (~b & d), 0x5a827999];
      }
      if (index < 40) {
        return [b ^ c ^ d, 0x6ed9eba1];
      }
      if (index < 60) {
        return [(b & c) | (b & d) | (c & d), 0x8f1bbcdc];
      }
      return [b ^ c ^ d, 0xca62c1d6];
    }
    function fingerprint(str) {
      var utf8 = utf8Encode(str);
      var _a = [hash32(utf8, 0), hash32(utf8, 102072)],
          hi = _a[0],
          lo = _a[1];
      if (hi == 0 && (lo == 0 || lo == 1)) {
        hi = hi ^ 0x130f9bef;
        lo = lo ^ -0x6b5f56d8;
      }
      return [hi, lo];
    }
    function computeMsgId(msg, meaning) {
      var _a = fingerprint(msg),
          hi = _a[0],
          lo = _a[1];
      if (meaning) {
        var _b = fingerprint(meaning),
            him = _b[0],
            lom = _b[1];
        _c = add64(rol64([hi, lo], 1), [him, lom]), hi = _c[0], lo = _c[1];
      }
      return byteStringToDecString(words32ToByteString([hi & 0x7fffffff, lo]));
      var _c;
    }
    function hash32(str, c) {
      var _a = [0x9e3779b9, 0x9e3779b9],
          a = _a[0],
          b = _a[1];
      var i;
      var len = str.length;
      for (i = 0; i + 12 <= len; i += 12) {
        a = add32(a, wordAt(str, i, Endian.Little));
        b = add32(b, wordAt(str, i + 4, Endian.Little));
        c = add32(c, wordAt(str, i + 8, Endian.Little));
        _b = mix([a, b, c]), a = _b[0], b = _b[1], c = _b[2];
      }
      a = add32(a, wordAt(str, i, Endian.Little));
      b = add32(b, wordAt(str, i + 4, Endian.Little));
      c = add32(c, len);
      c = add32(c, wordAt(str, i + 8, Endian.Little) << 8);
      return mix([a, b, c])[2];
      var _b;
    }
    function mix(_a) {
      var a = _a[0],
          b = _a[1],
          c = _a[2];
      a = sub32(a, b);
      a = sub32(a, c);
      a ^= c >>> 13;
      b = sub32(b, c);
      b = sub32(b, a);
      b ^= a << 8;
      c = sub32(c, a);
      c = sub32(c, b);
      c ^= b >>> 13;
      a = sub32(a, b);
      a = sub32(a, c);
      a ^= c >>> 12;
      b = sub32(b, c);
      b = sub32(b, a);
      b ^= a << 16;
      c = sub32(c, a);
      c = sub32(c, b);
      c ^= b >>> 5;
      a = sub32(a, b);
      a = sub32(a, c);
      a ^= c >>> 3;
      b = sub32(b, c);
      b = sub32(b, a);
      b ^= a << 10;
      c = sub32(c, a);
      c = sub32(c, b);
      c ^= b >>> 15;
      return [a, b, c];
    }
    var Endian = {
      Little: 0,
      Big: 1
    };
    Endian[Endian.Little] = "Little";
    Endian[Endian.Big] = "Big";
    function add32(a, b) {
      return add32to64(a, b)[1];
    }
    function add32to64(a, b) {
      var low = (a & 0xffff) + (b & 0xffff);
      var high = (a >>> 16) + (b >>> 16) + (low >>> 16);
      return [high >>> 16, (high << 16) | (low & 0xffff)];
    }
    function add64(_a, _b) {
      var ah = _a[0],
          al = _a[1];
      var bh = _b[0],
          bl = _b[1];
      var _c = add32to64(al, bl),
          carry = _c[0],
          l = _c[1];
      var h = add32(add32(ah, bh), carry);
      return [h, l];
    }
    function sub32(a, b) {
      var low = (a & 0xffff) - (b & 0xffff);
      var high = (a >> 16) - (b >> 16) + (low >> 16);
      return (high << 16) | (low & 0xffff);
    }
    function rol32(a, count) {
      return (a << count) | (a >>> (32 - count));
    }
    function rol64(_a, count) {
      var hi = _a[0],
          lo = _a[1];
      var h = (hi << count) | (lo >>> (32 - count));
      var l = (lo << count) | (hi >>> (32 - count));
      return [h, l];
    }
    function stringToWords32(str, endian) {
      var words32 = Array((str.length + 3) >>> 2);
      for (var i = 0; i < words32.length; i++) {
        words32[i] = wordAt(str, i * 4, endian);
      }
      return words32;
    }
    function byteAt(str, index) {
      return index >= str.length ? 0 : str.charCodeAt(index) & 0xff;
    }
    function wordAt(str, index, endian) {
      var word = 0;
      if (endian === Endian.Big) {
        for (var i = 0; i < 4; i++) {
          word += byteAt(str, index + i) << (24 - 8 * i);
        }
      } else {
        for (var i = 0; i < 4; i++) {
          word += byteAt(str, index + i) << 8 * i;
        }
      }
      return word;
    }
    function words32ToByteString(words32) {
      return words32.reduce(function(str, word) {
        return str + word32ToByteString(word);
      }, '');
    }
    function word32ToByteString(word) {
      var str = '';
      for (var i = 0; i < 4; i++) {
        str += String.fromCharCode((word >>> 8 * (3 - i)) & 0xff);
      }
      return str;
    }
    function byteStringToHexString(str) {
      var hex = '';
      for (var i = 0; i < str.length; i++) {
        var b = byteAt(str, i);
        hex += (b >>> 4).toString(16) + (b & 0x0f).toString(16);
      }
      return hex.toLowerCase();
    }
    function byteStringToDecString(str) {
      var decimal = '';
      var toThePower = '1';
      for (var i = str.length - 1; i >= 0; i--) {
        decimal = addBigInt(decimal, numberTimesBigInt(byteAt(str, i), toThePower));
        toThePower = numberTimesBigInt(256, toThePower);
      }
      return decimal.split('').reverse().join('');
    }
    function addBigInt(x, y) {
      var sum = '';
      var len = Math.max(x.length, y.length);
      for (var i = 0,
          carry = 0; i < len || carry; i++) {
        var tmpSum = carry + +(x[i] || 0) + +(y[i] || 0);
        if (tmpSum >= 10) {
          carry = 1;
          sum += tmpSum - 10;
        } else {
          carry = 0;
          sum += tmpSum;
        }
      }
      return sum;
    }
    function numberTimesBigInt(num, b) {
      var product = '';
      var bToThePower = b;
      for (; num !== 0; num = num >>> 1) {
        if (num & 1)
          product = addBigInt(product, bToThePower);
        bToThePower = addBigInt(bToThePower, bToThePower);
      }
      return product;
    }
    var Message = (function() {
      function Message(nodes, placeholders, placeholderToMessage, meaning, description, id) {
        this.nodes = nodes;
        this.placeholders = placeholders;
        this.placeholderToMessage = placeholderToMessage;
        this.meaning = meaning;
        this.description = description;
        this.id = id;
        if (nodes.length) {
          this.sources = [{
            filePath: nodes[0].sourceSpan.start.file.url,
            startLine: nodes[0].sourceSpan.start.line + 1,
            startCol: nodes[0].sourceSpan.start.col + 1,
            endLine: nodes[nodes.length - 1].sourceSpan.end.line + 1,
            endCol: nodes[0].sourceSpan.start.col + 1
          }];
        } else {
          this.sources = [];
        }
      }
      return Message;
    }());
    var Text$1 = (function() {
      function Text(value, sourceSpan) {
        this.value = value;
        this.sourceSpan = sourceSpan;
      }
      Text.prototype.visit = function(visitor, context) {
        return visitor.visitText(this, context);
      };
      return Text;
    }());
    var Container = (function() {
      function Container(children, sourceSpan) {
        this.children = children;
        this.sourceSpan = sourceSpan;
      }
      Container.prototype.visit = function(visitor, context) {
        return visitor.visitContainer(this, context);
      };
      return Container;
    }());
    var Icu = (function() {
      function Icu(expression, type, cases, sourceSpan) {
        this.expression = expression;
        this.type = type;
        this.cases = cases;
        this.sourceSpan = sourceSpan;
      }
      Icu.prototype.visit = function(visitor, context) {
        return visitor.visitIcu(this, context);
      };
      return Icu;
    }());
    var TagPlaceholder = (function() {
      function TagPlaceholder(tag, attrs, startName, closeName, children, isVoid, sourceSpan) {
        this.tag = tag;
        this.attrs = attrs;
        this.startName = startName;
        this.closeName = closeName;
        this.children = children;
        this.isVoid = isVoid;
        this.sourceSpan = sourceSpan;
      }
      TagPlaceholder.prototype.visit = function(visitor, context) {
        return visitor.visitTagPlaceholder(this, context);
      };
      return TagPlaceholder;
    }());
    var Placeholder = (function() {
      function Placeholder(value, name, sourceSpan) {
        this.value = value;
        this.name = name;
        this.sourceSpan = sourceSpan;
      }
      Placeholder.prototype.visit = function(visitor, context) {
        return visitor.visitPlaceholder(this, context);
      };
      return Placeholder;
    }());
    var IcuPlaceholder = (function() {
      function IcuPlaceholder(value, name, sourceSpan) {
        this.value = value;
        this.name = name;
        this.sourceSpan = sourceSpan;
      }
      IcuPlaceholder.prototype.visit = function(visitor, context) {
        return visitor.visitIcuPlaceholder(this, context);
      };
      return IcuPlaceholder;
    }());
    var CloneVisitor = (function() {
      function CloneVisitor() {}
      CloneVisitor.prototype.visitText = function(text, context) {
        return new Text$1(text.value, text.sourceSpan);
      };
      CloneVisitor.prototype.visitContainer = function(container, context) {
        var _this = this;
        var children = container.children.map(function(n) {
          return n.visit(_this, context);
        });
        return new Container(children, container.sourceSpan);
      };
      CloneVisitor.prototype.visitIcu = function(icu, context) {
        var _this = this;
        var cases = {};
        Object.keys(icu.cases).forEach(function(key) {
          return cases[key] = icu.cases[key].visit(_this, context);
        });
        var msg = new Icu(icu.expression, icu.type, cases, icu.sourceSpan);
        msg.expressionPlaceholder = icu.expressionPlaceholder;
        return msg;
      };
      CloneVisitor.prototype.visitTagPlaceholder = function(ph, context) {
        var _this = this;
        var children = ph.children.map(function(n) {
          return n.visit(_this, context);
        });
        return new TagPlaceholder(ph.tag, ph.attrs, ph.startName, ph.closeName, children, ph.isVoid, ph.sourceSpan);
      };
      CloneVisitor.prototype.visitPlaceholder = function(ph, context) {
        return new Placeholder(ph.value, ph.name, ph.sourceSpan);
      };
      CloneVisitor.prototype.visitIcuPlaceholder = function(ph, context) {
        return new IcuPlaceholder(ph.value, ph.name, ph.sourceSpan);
      };
      return CloneVisitor;
    }());
    var RecurseVisitor = (function() {
      function RecurseVisitor() {}
      RecurseVisitor.prototype.visitText = function(text, context) {};
      RecurseVisitor.prototype.visitContainer = function(container, context) {
        var _this = this;
        container.children.forEach(function(child) {
          return child.visit(_this);
        });
      };
      RecurseVisitor.prototype.visitIcu = function(icu, context) {
        var _this = this;
        Object.keys(icu.cases).forEach(function(k) {
          icu.cases[k].visit(_this);
        });
      };
      RecurseVisitor.prototype.visitTagPlaceholder = function(ph, context) {
        var _this = this;
        ph.children.forEach(function(child) {
          return child.visit(_this);
        });
      };
      RecurseVisitor.prototype.visitPlaceholder = function(ph, context) {};
      RecurseVisitor.prototype.visitIcuPlaceholder = function(ph, context) {};
      return RecurseVisitor;
    }());
    var HtmlTagDefinition = (function() {
      function HtmlTagDefinition(_a) {
        var _b = _a === void 0 ? {} : _a,
            closedByChildren = _b.closedByChildren,
            requiredParents = _b.requiredParents,
            implicitNamespacePrefix = _b.implicitNamespacePrefix,
            _c = _b.contentType,
            contentType = _c === void 0 ? TagContentType.PARSABLE_DATA : _c,
            _d = _b.closedByParent,
            closedByParent = _d === void 0 ? false : _d,
            _e = _b.isVoid,
            isVoid = _e === void 0 ? false : _e,
            _f = _b.ignoreFirstLf,
            ignoreFirstLf = _f === void 0 ? false : _f;
        var _this = this;
        this.closedByChildren = {};
        this.closedByParent = false;
        this.canSelfClose = false;
        if (closedByChildren && closedByChildren.length > 0) {
          closedByChildren.forEach(function(tagName) {
            return _this.closedByChildren[tagName] = true;
          });
        }
        this.isVoid = isVoid;
        this.closedByParent = closedByParent || isVoid;
        if (requiredParents && requiredParents.length > 0) {
          this.requiredParents = {};
          this.parentToAdd = requiredParents[0];
          requiredParents.forEach(function(tagName) {
            return _this.requiredParents[tagName] = true;
          });
        }
        this.implicitNamespacePrefix = implicitNamespacePrefix || null;
        this.contentType = contentType;
        this.ignoreFirstLf = ignoreFirstLf;
      }
      HtmlTagDefinition.prototype.requireExtraParent = function(currentParent) {
        if (!this.requiredParents) {
          return false;
        }
        if (!currentParent) {
          return true;
        }
        var lcParent = currentParent.toLowerCase();
        var isParentTemplate = lcParent === 'template' || currentParent === 'ng-template';
        return !isParentTemplate && this.requiredParents[lcParent] != true;
      };
      HtmlTagDefinition.prototype.isClosedByChild = function(name) {
        return this.isVoid || name.toLowerCase() in this.closedByChildren;
      };
      return HtmlTagDefinition;
    }());
    var TAG_DEFINITIONS = {
      'base': new HtmlTagDefinition({isVoid: true}),
      'meta': new HtmlTagDefinition({isVoid: true}),
      'area': new HtmlTagDefinition({isVoid: true}),
      'embed': new HtmlTagDefinition({isVoid: true}),
      'link': new HtmlTagDefinition({isVoid: true}),
      'img': new HtmlTagDefinition({isVoid: true}),
      'input': new HtmlTagDefinition({isVoid: true}),
      'param': new HtmlTagDefinition({isVoid: true}),
      'hr': new HtmlTagDefinition({isVoid: true}),
      'br': new HtmlTagDefinition({isVoid: true}),
      'source': new HtmlTagDefinition({isVoid: true}),
      'track': new HtmlTagDefinition({isVoid: true}),
      'wbr': new HtmlTagDefinition({isVoid: true}),
      'p': new HtmlTagDefinition({
        closedByChildren: ['address', 'article', 'aside', 'blockquote', 'div', 'dl', 'fieldset', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'main', 'nav', 'ol', 'p', 'pre', 'section', 'table', 'ul'],
        closedByParent: true
      }),
      'thead': new HtmlTagDefinition({closedByChildren: ['tbody', 'tfoot']}),
      'tbody': new HtmlTagDefinition({
        closedByChildren: ['tbody', 'tfoot'],
        closedByParent: true
      }),
      'tfoot': new HtmlTagDefinition({
        closedByChildren: ['tbody'],
        closedByParent: true
      }),
      'tr': new HtmlTagDefinition({
        closedByChildren: ['tr'],
        requiredParents: ['tbody', 'tfoot', 'thead'],
        closedByParent: true
      }),
      'td': new HtmlTagDefinition({
        closedByChildren: ['td', 'th'],
        closedByParent: true
      }),
      'th': new HtmlTagDefinition({
        closedByChildren: ['td', 'th'],
        closedByParent: true
      }),
      'col': new HtmlTagDefinition({
        requiredParents: ['colgroup'],
        isVoid: true
      }),
      'svg': new HtmlTagDefinition({implicitNamespacePrefix: 'svg'}),
      'math': new HtmlTagDefinition({implicitNamespacePrefix: 'math'}),
      'li': new HtmlTagDefinition({
        closedByChildren: ['li'],
        closedByParent: true
      }),
      'dt': new HtmlTagDefinition({closedByChildren: ['dt', 'dd']}),
      'dd': new HtmlTagDefinition({
        closedByChildren: ['dt', 'dd'],
        closedByParent: true
      }),
      'rb': new HtmlTagDefinition({
        closedByChildren: ['rb', 'rt', 'rtc', 'rp'],
        closedByParent: true
      }),
      'rt': new HtmlTagDefinition({
        closedByChildren: ['rb', 'rt', 'rtc', 'rp'],
        closedByParent: true
      }),
      'rtc': new HtmlTagDefinition({
        closedByChildren: ['rb', 'rtc', 'rp'],
        closedByParent: true
      }),
      'rp': new HtmlTagDefinition({
        closedByChildren: ['rb', 'rt', 'rtc', 'rp'],
        closedByParent: true
      }),
      'optgroup': new HtmlTagDefinition({
        closedByChildren: ['optgroup'],
        closedByParent: true
      }),
      'option': new HtmlTagDefinition({
        closedByChildren: ['option', 'optgroup'],
        closedByParent: true
      }),
      'pre': new HtmlTagDefinition({ignoreFirstLf: true}),
      'listing': new HtmlTagDefinition({ignoreFirstLf: true}),
      'style': new HtmlTagDefinition({contentType: TagContentType.RAW_TEXT}),
      'script': new HtmlTagDefinition({contentType: TagContentType.RAW_TEXT}),
      'title': new HtmlTagDefinition({contentType: TagContentType.ESCAPABLE_RAW_TEXT}),
      'textarea': new HtmlTagDefinition({
        contentType: TagContentType.ESCAPABLE_RAW_TEXT,
        ignoreFirstLf: true
      })
    };
    var _DEFAULT_TAG_DEFINITION = new HtmlTagDefinition();
    function getHtmlTagDefinition(tagName) {
      return TAG_DEFINITIONS[tagName.toLowerCase()] || _DEFAULT_TAG_DEFINITION;
    }
    var TAG_TO_PLACEHOLDER_NAMES = {
      'A': 'LINK',
      'B': 'BOLD_TEXT',
      'BR': 'LINE_BREAK',
      'EM': 'EMPHASISED_TEXT',
      'H1': 'HEADING_LEVEL1',
      'H2': 'HEADING_LEVEL2',
      'H3': 'HEADING_LEVEL3',
      'H4': 'HEADING_LEVEL4',
      'H5': 'HEADING_LEVEL5',
      'H6': 'HEADING_LEVEL6',
      'HR': 'HORIZONTAL_RULE',
      'I': 'ITALIC_TEXT',
      'LI': 'LIST_ITEM',
      'LINK': 'MEDIA_LINK',
      'OL': 'ORDERED_LIST',
      'P': 'PARAGRAPH',
      'Q': 'QUOTATION',
      'S': 'STRIKETHROUGH_TEXT',
      'SMALL': 'SMALL_TEXT',
      'SUB': 'SUBSTRIPT',
      'SUP': 'SUPERSCRIPT',
      'TBODY': 'TABLE_BODY',
      'TD': 'TABLE_CELL',
      'TFOOT': 'TABLE_FOOTER',
      'TH': 'TABLE_HEADER_CELL',
      'THEAD': 'TABLE_HEADER',
      'TR': 'TABLE_ROW',
      'TT': 'MONOSPACED_TEXT',
      'U': 'UNDERLINED_TEXT',
      'UL': 'UNORDERED_LIST'
    };
    var PlaceholderRegistry = (function() {
      function PlaceholderRegistry() {
        this._placeHolderNameCounts = {};
        this._signatureToName = {};
      }
      PlaceholderRegistry.prototype.getStartTagPlaceholderName = function(tag, attrs, isVoid) {
        var signature = this._hashTag(tag, attrs, isVoid);
        if (this._signatureToName[signature]) {
          return this._signatureToName[signature];
        }
        var upperTag = tag.toUpperCase();
        var baseName = TAG_TO_PLACEHOLDER_NAMES[upperTag] || "TAG_" + upperTag;
        var name = this._generateUniqueName(isVoid ? baseName : "START_" + baseName);
        this._signatureToName[signature] = name;
        return name;
      };
      PlaceholderRegistry.prototype.getCloseTagPlaceholderName = function(tag) {
        var signature = this._hashClosingTag(tag);
        if (this._signatureToName[signature]) {
          return this._signatureToName[signature];
        }
        var upperTag = tag.toUpperCase();
        var baseName = TAG_TO_PLACEHOLDER_NAMES[upperTag] || "TAG_" + upperTag;
        var name = this._generateUniqueName("CLOSE_" + baseName);
        this._signatureToName[signature] = name;
        return name;
      };
      PlaceholderRegistry.prototype.getPlaceholderName = function(name, content) {
        var upperName = name.toUpperCase();
        var signature = "PH: " + upperName + "=" + content;
        if (this._signatureToName[signature]) {
          return this._signatureToName[signature];
        }
        var uniqueName = this._generateUniqueName(upperName);
        this._signatureToName[signature] = uniqueName;
        return uniqueName;
      };
      PlaceholderRegistry.prototype.getUniquePlaceholder = function(name) {
        return this._generateUniqueName(name.toUpperCase());
      };
      PlaceholderRegistry.prototype._hashTag = function(tag, attrs, isVoid) {
        var start = "<" + tag;
        var strAttrs = Object.keys(attrs).sort().map(function(name) {
          return " " + name + "=" + attrs[name];
        }).join('');
        var end = isVoid ? '/>' : "></" + tag + ">";
        return start + strAttrs + end;
      };
      PlaceholderRegistry.prototype._hashClosingTag = function(tag) {
        return this._hashTag("/" + tag, {}, false);
      };
      PlaceholderRegistry.prototype._generateUniqueName = function(base) {
        var seen = this._placeHolderNameCounts.hasOwnProperty(base);
        if (!seen) {
          this._placeHolderNameCounts[base] = 1;
          return base;
        }
        var id = this._placeHolderNameCounts[base];
        this._placeHolderNameCounts[base] = id + 1;
        return base + "_" + id;
      };
      return PlaceholderRegistry;
    }());
    var _expParser = new Parser(new Lexer());
    function createI18nMessageFactory(interpolationConfig) {
      var visitor = new _I18nVisitor(_expParser, interpolationConfig);
      return function(nodes, meaning, description, id) {
        return visitor.toI18nMessage(nodes, meaning, description, id);
      };
    }
    var _I18nVisitor = (function() {
      function _I18nVisitor(_expressionParser, _interpolationConfig) {
        this._expressionParser = _expressionParser;
        this._interpolationConfig = _interpolationConfig;
      }
      _I18nVisitor.prototype.toI18nMessage = function(nodes, meaning, description, id) {
        this._isIcu = nodes.length == 1 && nodes[0] instanceof Expansion;
        this._icuDepth = 0;
        this._placeholderRegistry = new PlaceholderRegistry();
        this._placeholderToContent = {};
        this._placeholderToMessage = {};
        var i18nodes = visitAll(this, nodes, {});
        return new Message(i18nodes, this._placeholderToContent, this._placeholderToMessage, meaning, description, id);
      };
      _I18nVisitor.prototype.visitElement = function(el, context) {
        var children = visitAll(this, el.children);
        var attrs = {};
        el.attrs.forEach(function(attr) {
          attrs[attr.name] = attr.value;
        });
        var isVoid = getHtmlTagDefinition(el.name).isVoid;
        var startPhName = this._placeholderRegistry.getStartTagPlaceholderName(el.name, attrs, isVoid);
        this._placeholderToContent[startPhName] = ((el.sourceSpan)).toString();
        var closePhName = '';
        if (!isVoid) {
          closePhName = this._placeholderRegistry.getCloseTagPlaceholderName(el.name);
          this._placeholderToContent[closePhName] = "</" + el.name + ">";
        }
        return new TagPlaceholder(el.name, attrs, startPhName, closePhName, children, isVoid, ((el.sourceSpan)));
      };
      _I18nVisitor.prototype.visitAttribute = function(attribute, context) {
        return this._visitTextWithInterpolation(attribute.value, attribute.sourceSpan);
      };
      _I18nVisitor.prototype.visitText = function(text, context) {
        return this._visitTextWithInterpolation(text.value, ((text.sourceSpan)));
      };
      _I18nVisitor.prototype.visitComment = function(comment, context) {
        return null;
      };
      _I18nVisitor.prototype.visitExpansion = function(icu, context) {
        var _this = this;
        this._icuDepth++;
        var i18nIcuCases = {};
        var i18nIcu = new Icu(icu.switchValue, icu.type, i18nIcuCases, icu.sourceSpan);
        icu.cases.forEach(function(caze) {
          i18nIcuCases[caze.value] = new Container(caze.expression.map(function(node) {
            return node.visit(_this, {});
          }), caze.expSourceSpan);
        });
        this._icuDepth--;
        if (this._isIcu || this._icuDepth > 0) {
          var expPh = this._placeholderRegistry.getUniquePlaceholder("VAR_" + icu.type);
          i18nIcu.expressionPlaceholder = expPh;
          this._placeholderToContent[expPh] = icu.switchValue;
          return i18nIcu;
        }
        var phName = this._placeholderRegistry.getPlaceholderName('ICU', icu.sourceSpan.toString());
        var visitor = new _I18nVisitor(this._expressionParser, this._interpolationConfig);
        this._placeholderToMessage[phName] = visitor.toI18nMessage([icu], '', '', '');
        return new IcuPlaceholder(i18nIcu, phName, icu.sourceSpan);
      };
      _I18nVisitor.prototype.visitExpansionCase = function(icuCase, context) {
        throw new Error('Unreachable code');
      };
      _I18nVisitor.prototype._visitTextWithInterpolation = function(text, sourceSpan) {
        var splitInterpolation = this._expressionParser.splitInterpolation(text, sourceSpan.start.toString(), this._interpolationConfig);
        if (!splitInterpolation) {
          return new Text$1(text, sourceSpan);
        }
        var nodes = [];
        var container = new Container(nodes, sourceSpan);
        var _a = this._interpolationConfig,
            sDelimiter = _a.start,
            eDelimiter = _a.end;
        for (var i = 0; i < splitInterpolation.strings.length - 1; i++) {
          var expression = splitInterpolation.expressions[i];
          var baseName = _extractPlaceholderName(expression) || 'INTERPOLATION';
          var phName = this._placeholderRegistry.getPlaceholderName(baseName, expression);
          if (splitInterpolation.strings[i].length) {
            nodes.push(new Text$1(splitInterpolation.strings[i], sourceSpan));
          }
          nodes.push(new Placeholder(expression, phName, sourceSpan));
          this._placeholderToContent[phName] = sDelimiter + expression + eDelimiter;
        }
        var lastStringIdx = splitInterpolation.strings.length - 1;
        if (splitInterpolation.strings[lastStringIdx].length) {
          nodes.push(new Text$1(splitInterpolation.strings[lastStringIdx], sourceSpan));
        }
        return container;
      };
      return _I18nVisitor;
    }());
    var _CUSTOM_PH_EXP = /\/\/[\s\S]*i18n[\s\S]*\([\s\S]*ph[\s\S]*=[\s\S]*("|')([\s\S]*?)\1[\s\S]*\)/g;
    function _extractPlaceholderName(input) {
      return input.split(_CUSTOM_PH_EXP)[2];
    }
    var I18nError = (function(_super) {
      __extends(I18nError, _super);
      function I18nError(span, msg) {
        return _super.call(this, span, msg) || this;
      }
      return I18nError;
    }(ParseError));
    var _I18N_ATTR = 'i18n';
    var _I18N_ATTR_PREFIX = 'i18n-';
    var _I18N_COMMENT_PREFIX_REGEXP = /^i18n:?/;
    var MEANING_SEPARATOR = '|';
    var ID_SEPARATOR = '@@';
    var i18nCommentsWarned = false;
    function extractMessages(nodes, interpolationConfig, implicitTags, implicitAttrs) {
      var visitor = new _Visitor(implicitTags, implicitAttrs);
      return visitor.extract(nodes, interpolationConfig);
    }
    function mergeTranslations(nodes, translations, interpolationConfig, implicitTags, implicitAttrs) {
      var visitor = new _Visitor(implicitTags, implicitAttrs);
      return visitor.merge(nodes, translations, interpolationConfig);
    }
    var ExtractionResult = (function() {
      function ExtractionResult(messages, errors) {
        this.messages = messages;
        this.errors = errors;
      }
      return ExtractionResult;
    }());
    var _VisitorMode = {
      Extract: 0,
      Merge: 1
    };
    _VisitorMode[_VisitorMode.Extract] = "Extract";
    _VisitorMode[_VisitorMode.Merge] = "Merge";
    var _Visitor = (function() {
      function _Visitor(_implicitTags, _implicitAttrs) {
        this._implicitTags = _implicitTags;
        this._implicitAttrs = _implicitAttrs;
      }
      _Visitor.prototype.extract = function(nodes, interpolationConfig) {
        var _this = this;
        this._init(_VisitorMode.Extract, interpolationConfig);
        nodes.forEach(function(node) {
          return node.visit(_this, null);
        });
        if (this._inI18nBlock) {
          this._reportError(nodes[nodes.length - 1], 'Unclosed block');
        }
        return new ExtractionResult(this._messages, this._errors);
      };
      _Visitor.prototype.merge = function(nodes, translations, interpolationConfig) {
        this._init(_VisitorMode.Merge, interpolationConfig);
        this._translations = translations;
        var wrapper = new Element('wrapper', [], nodes, ((undefined)), undefined, undefined);
        var translatedNode = wrapper.visit(this, null);
        if (this._inI18nBlock) {
          this._reportError(nodes[nodes.length - 1], 'Unclosed block');
        }
        return new ParseTreeResult(translatedNode.children, this._errors);
      };
      _Visitor.prototype.visitExpansionCase = function(icuCase, context) {
        var expression = visitAll(this, icuCase.expression, context);
        if (this._mode === _VisitorMode.Merge) {
          return new ExpansionCase(icuCase.value, expression, icuCase.sourceSpan, icuCase.valueSourceSpan, icuCase.expSourceSpan);
        }
      };
      _Visitor.prototype.visitExpansion = function(icu, context) {
        this._mayBeAddBlockChildren(icu);
        var wasInIcu = this._inIcu;
        if (!this._inIcu) {
          if (this._isInTranslatableSection) {
            this._addMessage([icu]);
          }
          this._inIcu = true;
        }
        var cases = visitAll(this, icu.cases, context);
        if (this._mode === _VisitorMode.Merge) {
          icu = new Expansion(icu.switchValue, icu.type, cases, icu.sourceSpan, icu.switchValueSourceSpan);
        }
        this._inIcu = wasInIcu;
        return icu;
      };
      _Visitor.prototype.visitComment = function(comment, context) {
        var isOpening = _isOpeningComment(comment);
        if (isOpening && this._isInTranslatableSection) {
          this._reportError(comment, 'Could not start a block inside a translatable section');
          return;
        }
        var isClosing = _isClosingComment(comment);
        if (isClosing && !this._inI18nBlock) {
          this._reportError(comment, 'Trying to close an unopened block');
          return;
        }
        if (!this._inI18nNode && !this._inIcu) {
          if (!this._inI18nBlock) {
            if (isOpening) {
              if (!i18nCommentsWarned && (console) && (console.warn)) {
                i18nCommentsWarned = true;
                var details = comment.sourceSpan.details ? ", " + comment.sourceSpan.details : '';
                console.warn("I18n comments are deprecated, use an <ng-container> element instead (" + comment.sourceSpan.start + details + ")");
              }
              this._inI18nBlock = true;
              this._blockStartDepth = this._depth;
              this._blockChildren = [];
              this._blockMeaningAndDesc = ((comment.value)).replace(_I18N_COMMENT_PREFIX_REGEXP, '').trim();
              this._openTranslatableSection(comment);
            }
          } else {
            if (isClosing) {
              if (this._depth == this._blockStartDepth) {
                this._closeTranslatableSection(comment, this._blockChildren);
                this._inI18nBlock = false;
                var message = ((this._addMessage(this._blockChildren, this._blockMeaningAndDesc)));
                var nodes = this._translateMessage(comment, message);
                return visitAll(this, nodes);
              } else {
                this._reportError(comment, 'I18N blocks should not cross element boundaries');
                return;
              }
            }
          }
        }
      };
      _Visitor.prototype.visitText = function(text, context) {
        if (this._isInTranslatableSection) {
          this._mayBeAddBlockChildren(text);
        }
        return text;
      };
      _Visitor.prototype.visitElement = function(el, context) {
        var _this = this;
        this._mayBeAddBlockChildren(el);
        this._depth++;
        var wasInI18nNode = this._inI18nNode;
        var wasInImplicitNode = this._inImplicitNode;
        var childNodes = [];
        var translatedChildNodes = ((undefined));
        var i18nAttr = _getI18nAttr(el);
        var i18nMeta = i18nAttr ? i18nAttr.value : '';
        var isImplicit = this._implicitTags.some(function(tag) {
          return el.name === tag;
        }) && !this._inIcu && !this._isInTranslatableSection;
        var isTopLevelImplicit = !wasInImplicitNode && isImplicit;
        this._inImplicitNode = wasInImplicitNode || isImplicit;
        if (!this._isInTranslatableSection && !this._inIcu) {
          if (i18nAttr || isTopLevelImplicit) {
            this._inI18nNode = true;
            var message = ((this._addMessage(el.children, i18nMeta)));
            translatedChildNodes = this._translateMessage(el, message);
          }
          if (this._mode == _VisitorMode.Extract) {
            var isTranslatable = i18nAttr || isTopLevelImplicit;
            if (isTranslatable)
              this._openTranslatableSection(el);
            visitAll(this, el.children);
            if (isTranslatable)
              this._closeTranslatableSection(el, el.children);
          }
        } else {
          if (i18nAttr || isTopLevelImplicit) {
            this._reportError(el, 'Could not mark an element as translatable inside a translatable section');
          }
          if (this._mode == _VisitorMode.Extract) {
            visitAll(this, el.children);
          }
        }
        if (this._mode === _VisitorMode.Merge) {
          var visitNodes = translatedChildNodes || el.children;
          visitNodes.forEach(function(child) {
            var visited = child.visit(_this, context);
            if (visited && !_this._isInTranslatableSection) {
              childNodes = childNodes.concat(visited);
            }
          });
        }
        this._visitAttributesOf(el);
        this._depth--;
        this._inI18nNode = wasInI18nNode;
        this._inImplicitNode = wasInImplicitNode;
        if (this._mode === _VisitorMode.Merge) {
          var translatedAttrs = this._translateAttributes(el);
          return new Element(el.name, translatedAttrs, childNodes, el.sourceSpan, el.startSourceSpan, el.endSourceSpan);
        }
        return null;
      };
      _Visitor.prototype.visitAttribute = function(attribute, context) {
        throw new Error('unreachable code');
      };
      _Visitor.prototype._init = function(mode, interpolationConfig) {
        this._mode = mode;
        this._inI18nBlock = false;
        this._inI18nNode = false;
        this._depth = 0;
        this._inIcu = false;
        this._msgCountAtSectionStart = undefined;
        this._errors = [];
        this._messages = [];
        this._inImplicitNode = false;
        this._createI18nMessage = createI18nMessageFactory(interpolationConfig);
      };
      _Visitor.prototype._visitAttributesOf = function(el) {
        var _this = this;
        var explicitAttrNameToValue = {};
        var implicitAttrNames = this._implicitAttrs[el.name] || [];
        el.attrs.filter(function(attr) {
          return attr.name.startsWith(_I18N_ATTR_PREFIX);
        }).forEach(function(attr) {
          return explicitAttrNameToValue[attr.name.slice(_I18N_ATTR_PREFIX.length)] = attr.value;
        });
        el.attrs.forEach(function(attr) {
          if (attr.name in explicitAttrNameToValue) {
            _this._addMessage([attr], explicitAttrNameToValue[attr.name]);
          } else if (implicitAttrNames.some(function(name) {
            return attr.name === name;
          })) {
            _this._addMessage([attr]);
          }
        });
      };
      _Visitor.prototype._addMessage = function(ast, msgMeta) {
        if (ast.length == 0 || ast.length == 1 && ast[0] instanceof Attribute$1 && !((ast[0])).value) {
          return null;
        }
        var _a = _parseMessageMeta(msgMeta),
            meaning = _a.meaning,
            description = _a.description,
            id = _a.id;
        var message = this._createI18nMessage(ast, meaning, description, id);
        this._messages.push(message);
        return message;
      };
      _Visitor.prototype._translateMessage = function(el, message) {
        if (message && this._mode === _VisitorMode.Merge) {
          var nodes = this._translations.get(message);
          if (nodes) {
            return nodes;
          }
          this._reportError(el, "Translation unavailable for message id=\"" + this._translations.digest(message) + "\"");
        }
        return [];
      };
      _Visitor.prototype._translateAttributes = function(el) {
        var _this = this;
        var attributes = el.attrs;
        var i18nParsedMessageMeta = {};
        attributes.forEach(function(attr) {
          if (attr.name.startsWith(_I18N_ATTR_PREFIX)) {
            i18nParsedMessageMeta[attr.name.slice(_I18N_ATTR_PREFIX.length)] = _parseMessageMeta(attr.value);
          }
        });
        var translatedAttributes = [];
        attributes.forEach(function(attr) {
          if (attr.name === _I18N_ATTR || attr.name.startsWith(_I18N_ATTR_PREFIX)) {
            return;
          }
          if (attr.value && attr.value != '' && i18nParsedMessageMeta.hasOwnProperty(attr.name)) {
            var _a = i18nParsedMessageMeta[attr.name],
                meaning = _a.meaning,
                description = _a.description,
                id = _a.id;
            var message = _this._createI18nMessage([attr], meaning, description, id);
            var nodes = _this._translations.get(message);
            if (nodes) {
              if (nodes.length == 0) {
                translatedAttributes.push(new Attribute$1(attr.name, '', attr.sourceSpan));
              } else if (nodes[0] instanceof Text) {
                var value = ((nodes[0])).value;
                translatedAttributes.push(new Attribute$1(attr.name, value, attr.sourceSpan));
              } else {
                _this._reportError(el, "Unexpected translation for attribute \"" + attr.name + "\" (id=\"" + (id || _this._translations.digest(message)) + "\")");
              }
            } else {
              _this._reportError(el, "Translation unavailable for attribute \"" + attr.name + "\" (id=\"" + (id || _this._translations.digest(message)) + "\")");
            }
          } else {
            translatedAttributes.push(attr);
          }
        });
        return translatedAttributes;
      };
      _Visitor.prototype._mayBeAddBlockChildren = function(node) {
        if (this._inI18nBlock && !this._inIcu && this._depth == this._blockStartDepth) {
          this._blockChildren.push(node);
        }
      };
      _Visitor.prototype._openTranslatableSection = function(node) {
        if (this._isInTranslatableSection) {
          this._reportError(node, 'Unexpected section start');
        } else {
          this._msgCountAtSectionStart = this._messages.length;
        }
      };
      Object.defineProperty(_Visitor.prototype, "_isInTranslatableSection", {
        get: function() {
          return this._msgCountAtSectionStart !== void 0;
        },
        enumerable: true,
        configurable: true
      });
      _Visitor.prototype._closeTranslatableSection = function(node, directChildren) {
        if (!this._isInTranslatableSection) {
          this._reportError(node, 'Unexpected section end');
          return;
        }
        var startIndex = this._msgCountAtSectionStart;
        var significantChildren = directChildren.reduce(function(count, node) {
          return count + (node instanceof Comment ? 0 : 1);
        }, 0);
        if (significantChildren == 1) {
          for (var i = this._messages.length - 1; i >= ((startIndex)); i--) {
            var ast = this._messages[i].nodes;
            if (!(ast.length == 1 && ast[0] instanceof Text$1)) {
              this._messages.splice(i, 1);
              break;
            }
          }
        }
        this._msgCountAtSectionStart = undefined;
      };
      _Visitor.prototype._reportError = function(node, msg) {
        this._errors.push(new I18nError(((node.sourceSpan)), msg));
      };
      return _Visitor;
    }());
    function _isOpeningComment(n) {
      return !!(n instanceof Comment && n.value && n.value.startsWith('i18n'));
    }
    function _isClosingComment(n) {
      return !!(n instanceof Comment && n.value && n.value === '/i18n');
    }
    function _getI18nAttr(p) {
      return p.attrs.find(function(attr) {
        return attr.name === _I18N_ATTR;
      }) || null;
    }
    function _parseMessageMeta(i18n) {
      if (!i18n)
        return {
          meaning: '',
          description: '',
          id: ''
        };
      var idIndex = i18n.indexOf(ID_SEPARATOR);
      var descIndex = i18n.indexOf(MEANING_SEPARATOR);
      var _a = (idIndex > -1) ? [i18n.slice(0, idIndex), i18n.slice(idIndex + 2)] : [i18n, ''],
          meaningAndDesc = _a[0],
          id = _a[1];
      var _b = (descIndex > -1) ? [meaningAndDesc.slice(0, descIndex), meaningAndDesc.slice(descIndex + 1)] : ['', meaningAndDesc],
          meaning = _b[0],
          description = _b[1];
      return {
        meaning: meaning,
        description: description,
        id: id
      };
    }
    var XmlTagDefinition = (function() {
      function XmlTagDefinition() {
        this.closedByParent = false;
        this.contentType = TagContentType.PARSABLE_DATA;
        this.isVoid = false;
        this.ignoreFirstLf = false;
        this.canSelfClose = true;
      }
      XmlTagDefinition.prototype.requireExtraParent = function(currentParent) {
        return false;
      };
      XmlTagDefinition.prototype.isClosedByChild = function(name) {
        return false;
      };
      return XmlTagDefinition;
    }());
    var _TAG_DEFINITION = new XmlTagDefinition();
    function getXmlTagDefinition(tagName) {
      return _TAG_DEFINITION;
    }
    var XmlParser = (function(_super) {
      __extends(XmlParser, _super);
      function XmlParser() {
        return _super.call(this, getXmlTagDefinition) || this;
      }
      XmlParser.prototype.parse = function(source, url, parseExpansionForms) {
        if (parseExpansionForms === void 0) {
          parseExpansionForms = false;
        }
        return _super.prototype.parse.call(this, source, url, parseExpansionForms);
      };
      return XmlParser;
    }(Parser$1));
    var Serializer = (function() {
      function Serializer() {}
      Serializer.prototype.createNameMapper = function(message) {
        return null;
      };
      return Serializer;
    }());
    var SimplePlaceholderMapper = (function(_super) {
      __extends(SimplePlaceholderMapper, _super);
      function SimplePlaceholderMapper(message, mapName) {
        var _this = _super.call(this) || this;
        _this.mapName = mapName;
        _this.internalToPublic = {};
        _this.publicToNextId = {};
        _this.publicToInternal = {};
        message.nodes.forEach(function(node) {
          return node.visit(_this);
        });
        return _this;
      }
      SimplePlaceholderMapper.prototype.toPublicName = function(internalName) {
        return this.internalToPublic.hasOwnProperty(internalName) ? this.internalToPublic[internalName] : null;
      };
      SimplePlaceholderMapper.prototype.toInternalName = function(publicName) {
        return this.publicToInternal.hasOwnProperty(publicName) ? this.publicToInternal[publicName] : null;
      };
      SimplePlaceholderMapper.prototype.visitText = function(text, context) {
        return null;
      };
      SimplePlaceholderMapper.prototype.visitTagPlaceholder = function(ph, context) {
        this.visitPlaceholderName(ph.startName);
        _super.prototype.visitTagPlaceholder.call(this, ph, context);
        this.visitPlaceholderName(ph.closeName);
      };
      SimplePlaceholderMapper.prototype.visitPlaceholder = function(ph, context) {
        this.visitPlaceholderName(ph.name);
      };
      SimplePlaceholderMapper.prototype.visitIcuPlaceholder = function(ph, context) {
        this.visitPlaceholderName(ph.name);
      };
      SimplePlaceholderMapper.prototype.visitPlaceholderName = function(internalName) {
        if (!internalName || this.internalToPublic.hasOwnProperty(internalName)) {
          return;
        }
        var publicName = this.mapName(internalName);
        if (this.publicToInternal.hasOwnProperty(publicName)) {
          var nextId = this.publicToNextId[publicName];
          this.publicToNextId[publicName] = nextId + 1;
          publicName = publicName + "_" + nextId;
        } else {
          this.publicToNextId[publicName] = 1;
        }
        this.internalToPublic[internalName] = publicName;
        this.publicToInternal[publicName] = internalName;
      };
      return SimplePlaceholderMapper;
    }(RecurseVisitor));
    var _Visitor$1 = (function() {
      function _Visitor() {}
      _Visitor.prototype.visitTag = function(tag) {
        var _this = this;
        var strAttrs = this._serializeAttributes(tag.attrs);
        if (tag.children.length == 0) {
          return "<" + tag.name + strAttrs + "/>";
        }
        var strChildren = tag.children.map(function(node) {
          return node.visit(_this);
        });
        return "<" + tag.name + strAttrs + ">" + strChildren.join('') + "</" + tag.name + ">";
      };
      _Visitor.prototype.visitText = function(text) {
        return text.value;
      };
      _Visitor.prototype.visitDeclaration = function(decl) {
        return "<?xml" + this._serializeAttributes(decl.attrs) + " ?>";
      };
      _Visitor.prototype._serializeAttributes = function(attrs) {
        var strAttrs = Object.keys(attrs).map(function(name) {
          return name + "=\"" + attrs[name] + "\"";
        }).join(' ');
        return strAttrs.length > 0 ? ' ' + strAttrs : '';
      };
      _Visitor.prototype.visitDoctype = function(doctype) {
        return "<!DOCTYPE " + doctype.rootTag + " [\n" + doctype.dtd + "\n]>";
      };
      return _Visitor;
    }());
    var _visitor = new _Visitor$1();
    function serialize(nodes) {
      return nodes.map(function(node) {
        return node.visit(_visitor);
      }).join('');
    }
    var Declaration = (function() {
      function Declaration(unescapedAttrs) {
        var _this = this;
        this.attrs = {};
        Object.keys(unescapedAttrs).forEach(function(k) {
          _this.attrs[k] = _escapeXml(unescapedAttrs[k]);
        });
      }
      Declaration.prototype.visit = function(visitor) {
        return visitor.visitDeclaration(this);
      };
      return Declaration;
    }());
    var Doctype = (function() {
      function Doctype(rootTag, dtd) {
        this.rootTag = rootTag;
        this.dtd = dtd;
      }
      Doctype.prototype.visit = function(visitor) {
        return visitor.visitDoctype(this);
      };
      return Doctype;
    }());
    var Tag = (function() {
      function Tag(name, unescapedAttrs, children) {
        if (unescapedAttrs === void 0) {
          unescapedAttrs = {};
        }
        if (children === void 0) {
          children = [];
        }
        var _this = this;
        this.name = name;
        this.children = children;
        this.attrs = {};
        Object.keys(unescapedAttrs).forEach(function(k) {
          _this.attrs[k] = _escapeXml(unescapedAttrs[k]);
        });
      }
      Tag.prototype.visit = function(visitor) {
        return visitor.visitTag(this);
      };
      return Tag;
    }());
    var Text$2 = (function() {
      function Text(unescapedValue) {
        this.value = _escapeXml(unescapedValue);
      }
      Text.prototype.visit = function(visitor) {
        return visitor.visitText(this);
      };
      return Text;
    }());
    var CR = (function(_super) {
      __extends(CR, _super);
      function CR(ws) {
        if (ws === void 0) {
          ws = 0;
        }
        return _super.call(this, "\n" + new Array(ws + 1).join(' ')) || this;
      }
      return CR;
    }(Text$2));
    var _ESCAPED_CHARS = [[/&/g, '&amp;'], [/"/g, '&quot;'], [/'/g, '&apos;'], [/</g, '&lt;'], [/>/g, '&gt;']];
    function _escapeXml(text) {
      return _ESCAPED_CHARS.reduce(function(text, entry) {
        return text.replace(entry[0], entry[1]);
      }, text);
    }
    var _VERSION = '1.2';
    var _XMLNS = 'urn:oasis:names:tc:xliff:document:1.2';
    var _DEFAULT_SOURCE_LANG = 'en';
    var _PLACEHOLDER_TAG = 'x';
    var _MARKER_TAG = 'mrk';
    var _FILE_TAG = 'file';
    var _SOURCE_TAG = 'source';
    var _SEGMENT_SOURCE_TAG = 'seg-source';
    var _TARGET_TAG = 'target';
    var _UNIT_TAG = 'trans-unit';
    var _CONTEXT_GROUP_TAG = 'context-group';
    var _CONTEXT_TAG = 'context';
    var Xliff = (function(_super) {
      __extends(Xliff, _super);
      function Xliff() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      Xliff.prototype.write = function(messages, locale) {
        var visitor = new _WriteVisitor();
        var transUnits = [];
        messages.forEach(function(message) {
          var contextTags = [];
          message.sources.forEach(function(source) {
            var contextGroupTag = new Tag(_CONTEXT_GROUP_TAG, {purpose: 'location'});
            contextGroupTag.children.push(new CR(10), new Tag(_CONTEXT_TAG, {'context-type': 'sourcefile'}, [new Text$2(source.filePath)]), new CR(10), new Tag(_CONTEXT_TAG, {'context-type': 'linenumber'}, [new Text$2("" + source.startLine)]), new CR(8));
            contextTags.push(new CR(8), contextGroupTag);
          });
          var transUnit = new Tag(_UNIT_TAG, {
            id: message.id,
            datatype: 'html'
          });
          (_a = transUnit.children).push.apply(_a, [new CR(8), new Tag(_SOURCE_TAG, {}, visitor.serialize(message.nodes))].concat(contextTags));
          if (message.description) {
            transUnit.children.push(new CR(8), new Tag('note', {
              priority: '1',
              from: 'description'
            }, [new Text$2(message.description)]));
          }
          if (message.meaning) {
            transUnit.children.push(new CR(8), new Tag('note', {
              priority: '1',
              from: 'meaning'
            }, [new Text$2(message.meaning)]));
          }
          transUnit.children.push(new CR(6));
          transUnits.push(new CR(6), transUnit);
          var _a;
        });
        var body = new Tag('body', {}, transUnits.concat([new CR(4)]));
        var file = new Tag('file', {
          'source-language': locale || _DEFAULT_SOURCE_LANG,
          datatype: 'plaintext',
          original: 'ng2.template'
        }, [new CR(4), body, new CR(2)]);
        var xliff = new Tag('xliff', {
          version: _VERSION,
          xmlns: _XMLNS
        }, [new CR(2), file, new CR()]);
        return serialize([new Declaration({
          version: '1.0',
          encoding: 'UTF-8'
        }), new CR(), xliff, new CR()]);
      };
      Xliff.prototype.load = function(content, url) {
        var xliffParser = new XliffParser();
        var _a = xliffParser.parse(content, url),
            locale = _a.locale,
            msgIdToHtml = _a.msgIdToHtml,
            errors = _a.errors;
        var i18nNodesByMsgId = {};
        var converter = new XmlToI18n();
        Object.keys(msgIdToHtml).forEach(function(msgId) {
          var _a = converter.convert(msgIdToHtml[msgId], url),
              i18nNodes = _a.i18nNodes,
              e = _a.errors;
          errors.push.apply(errors, e);
          i18nNodesByMsgId[msgId] = i18nNodes;
        });
        if (errors.length) {
          throw new Error("xliff parse errors:\n" + errors.join('\n'));
        }
        return {
          locale: ((locale)),
          i18nNodesByMsgId: i18nNodesByMsgId
        };
      };
      Xliff.prototype.digest = function(message) {
        return digest(message);
      };
      return Xliff;
    }(Serializer));
    var _WriteVisitor = (function() {
      function _WriteVisitor() {}
      _WriteVisitor.prototype.visitText = function(text, context) {
        return [new Text$2(text.value)];
      };
      _WriteVisitor.prototype.visitContainer = function(container, context) {
        var _this = this;
        var nodes = [];
        container.children.forEach(function(node) {
          return nodes.push.apply(nodes, node.visit(_this));
        });
        return nodes;
      };
      _WriteVisitor.prototype.visitIcu = function(icu, context) {
        var _this = this;
        var nodes = [new Text$2("{" + icu.expressionPlaceholder + ", " + icu.type + ", ")];
        Object.keys(icu.cases).forEach(function(c) {
          nodes.push.apply(nodes, [new Text$2(c + " {")].concat(icu.cases[c].visit(_this), [new Text$2("} ")]));
        });
        nodes.push(new Text$2("}"));
        return nodes;
      };
      _WriteVisitor.prototype.visitTagPlaceholder = function(ph, context) {
        var ctype = getCtypeForTag(ph.tag);
        if (ph.isVoid) {
          return [new Tag(_PLACEHOLDER_TAG, {
            id: ph.startName,
            ctype: ctype,
            'equiv-text': "<" + ph.tag + "/>"
          })];
        }
        var startTagPh = new Tag(_PLACEHOLDER_TAG, {
          id: ph.startName,
          ctype: ctype,
          'equiv-text': "<" + ph.tag + ">"
        });
        var closeTagPh = new Tag(_PLACEHOLDER_TAG, {
          id: ph.closeName,
          ctype: ctype,
          'equiv-text': "</" + ph.tag + ">"
        });
        return [startTagPh].concat(this.serialize(ph.children), [closeTagPh]);
      };
      _WriteVisitor.prototype.visitPlaceholder = function(ph, context) {
        return [new Tag(_PLACEHOLDER_TAG, {
          id: ph.name,
          'equiv-text': "{{" + ph.value + "}}"
        })];
      };
      _WriteVisitor.prototype.visitIcuPlaceholder = function(ph, context) {
        var equivText = "{" + ph.value.expression + ", " + ph.value.type + ", " + Object.keys(ph.value.cases).map(function(value) {
          return value + ' {...}';
        }).join(' ') + "}";
        return [new Tag(_PLACEHOLDER_TAG, {
          id: ph.name,
          'equiv-text': equivText
        })];
      };
      _WriteVisitor.prototype.serialize = function(nodes) {
        var _this = this;
        return [].concat.apply([], nodes.map(function(node) {
          return node.visit(_this);
        }));
      };
      return _WriteVisitor;
    }());
    var XliffParser = (function() {
      function XliffParser() {
        this._locale = null;
      }
      XliffParser.prototype.parse = function(xliff, url) {
        this._unitMlString = null;
        this._msgIdToHtml = {};
        var xml = new XmlParser().parse(xliff, url, false);
        this._errors = xml.errors;
        visitAll(this, xml.rootNodes, null);
        return {
          msgIdToHtml: this._msgIdToHtml,
          errors: this._errors,
          locale: this._locale
        };
      };
      XliffParser.prototype.visitElement = function(element, context) {
        switch (element.name) {
          case _UNIT_TAG:
            this._unitMlString = ((null));
            var idAttr = element.attrs.find(function(attr) {
              return attr.name === 'id';
            });
            if (!idAttr) {
              this._addError(element, "<" + _UNIT_TAG + "> misses the \"id\" attribute");
            } else {
              var id = idAttr.value;
              if (this._msgIdToHtml.hasOwnProperty(id)) {
                this._addError(element, "Duplicated translations for msg " + id);
              } else {
                visitAll(this, element.children, null);
                if (typeof this._unitMlString === 'string') {
                  this._msgIdToHtml[id] = this._unitMlString;
                } else {
                  this._addError(element, "Message " + id + " misses a translation");
                }
              }
            }
            break;
          case _SOURCE_TAG:
          case _SEGMENT_SOURCE_TAG:
            break;
          case _TARGET_TAG:
            var innerTextStart = ((element.startSourceSpan)).end.offset;
            var innerTextEnd = ((element.endSourceSpan)).start.offset;
            var content = ((element.startSourceSpan)).start.file.content;
            var innerText = content.slice(innerTextStart, innerTextEnd);
            this._unitMlString = innerText;
            break;
          case _FILE_TAG:
            var localeAttr = element.attrs.find(function(attr) {
              return attr.name === 'target-language';
            });
            if (localeAttr) {
              this._locale = localeAttr.value;
            }
            visitAll(this, element.children, null);
            break;
          default:
            visitAll(this, element.children, null);
        }
      };
      XliffParser.prototype.visitAttribute = function(attribute, context) {};
      XliffParser.prototype.visitText = function(text, context) {};
      XliffParser.prototype.visitComment = function(comment, context) {};
      XliffParser.prototype.visitExpansion = function(expansion, context) {};
      XliffParser.prototype.visitExpansionCase = function(expansionCase, context) {};
      XliffParser.prototype._addError = function(node, message) {
        this._errors.push(new I18nError(((node.sourceSpan)), message));
      };
      return XliffParser;
    }());
    var XmlToI18n = (function() {
      function XmlToI18n() {}
      XmlToI18n.prototype.convert = function(message, url) {
        var xmlIcu = new XmlParser().parse(message, url, true);
        this._errors = xmlIcu.errors;
        var i18nNodes = this._errors.length > 0 || xmlIcu.rootNodes.length == 0 ? [] : [].concat.apply([], visitAll(this, xmlIcu.rootNodes));
        return {
          i18nNodes: i18nNodes,
          errors: this._errors
        };
      };
      XmlToI18n.prototype.visitText = function(text, context) {
        return new Text$1(text.value, ((text.sourceSpan)));
      };
      XmlToI18n.prototype.visitElement = function(el, context) {
        if (el.name === _PLACEHOLDER_TAG) {
          var nameAttr = el.attrs.find(function(attr) {
            return attr.name === 'id';
          });
          if (nameAttr) {
            return new Placeholder('', nameAttr.value, ((el.sourceSpan)));
          }
          this._addError(el, "<" + _PLACEHOLDER_TAG + "> misses the \"id\" attribute");
          return null;
        }
        if (el.name === _MARKER_TAG) {
          return [].concat.apply([], visitAll(this, el.children));
        }
        this._addError(el, "Unexpected tag");
        return null;
      };
      XmlToI18n.prototype.visitExpansion = function(icu, context) {
        var caseMap = {};
        visitAll(this, icu.cases).forEach(function(c) {
          caseMap[c.value] = new Container(c.nodes, icu.sourceSpan);
        });
        return new Icu(icu.switchValue, icu.type, caseMap, icu.sourceSpan);
      };
      XmlToI18n.prototype.visitExpansionCase = function(icuCase, context) {
        return {
          value: icuCase.value,
          nodes: visitAll(this, icuCase.expression)
        };
      };
      XmlToI18n.prototype.visitComment = function(comment, context) {};
      XmlToI18n.prototype.visitAttribute = function(attribute, context) {};
      XmlToI18n.prototype._addError = function(node, message) {
        this._errors.push(new I18nError(((node.sourceSpan)), message));
      };
      return XmlToI18n;
    }());
    function getCtypeForTag(tag) {
      switch (tag.toLowerCase()) {
        case 'br':
          return 'lb';
        case 'img':
          return 'image';
        default:
          return "x-" + tag;
      }
    }
    var _VERSION$1 = '2.0';
    var _XMLNS$1 = 'urn:oasis:names:tc:xliff:document:2.0';
    var _DEFAULT_SOURCE_LANG$1 = 'en';
    var _PLACEHOLDER_TAG$1 = 'ph';
    var _PLACEHOLDER_SPANNING_TAG = 'pc';
    var _MARKER_TAG$1 = 'mrk';
    var _XLIFF_TAG = 'xliff';
    var _SOURCE_TAG$1 = 'source';
    var _TARGET_TAG$1 = 'target';
    var _UNIT_TAG$1 = 'unit';
    var Xliff2 = (function(_super) {
      __extends(Xliff2, _super);
      function Xliff2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      Xliff2.prototype.write = function(messages, locale) {
        var visitor = new _WriteVisitor$1();
        var units = [];
        messages.forEach(function(message) {
          var unit = new Tag(_UNIT_TAG$1, {id: message.id});
          var notes = new Tag('notes');
          if (message.description || message.meaning) {
            if (message.description) {
              notes.children.push(new CR(8), new Tag('note', {category: 'description'}, [new Text$2(message.description)]));
            }
            if (message.meaning) {
              notes.children.push(new CR(8), new Tag('note', {category: 'meaning'}, [new Text$2(message.meaning)]));
            }
          }
          message.sources.forEach(function(source) {
            notes.children.push(new CR(8), new Tag('note', {category: 'location'}, [new Text$2(source.filePath + ":" + source.startLine + (source.endLine !== source.startLine ? ',' + source.endLine : ''))]));
          });
          notes.children.push(new CR(6));
          unit.children.push(new CR(6), notes);
          var segment = new Tag('segment');
          segment.children.push(new CR(8), new Tag(_SOURCE_TAG$1, {}, visitor.serialize(message.nodes)), new CR(6));
          unit.children.push(new CR(6), segment, new CR(4));
          units.push(new CR(4), unit);
        });
        var file = new Tag('file', {
          'original': 'ng.template',
          id: 'ngi18n'
        }, units.concat([new CR(2)]));
        var xliff = new Tag(_XLIFF_TAG, {
          version: _VERSION$1,
          xmlns: _XMLNS$1,
          srcLang: locale || _DEFAULT_SOURCE_LANG$1
        }, [new CR(2), file, new CR()]);
        return serialize([new Declaration({
          version: '1.0',
          encoding: 'UTF-8'
        }), new CR(), xliff, new CR()]);
      };
      Xliff2.prototype.load = function(content, url) {
        var xliff2Parser = new Xliff2Parser();
        var _a = xliff2Parser.parse(content, url),
            locale = _a.locale,
            msgIdToHtml = _a.msgIdToHtml,
            errors = _a.errors;
        var i18nNodesByMsgId = {};
        var converter = new XmlToI18n$1();
        Object.keys(msgIdToHtml).forEach(function(msgId) {
          var _a = converter.convert(msgIdToHtml[msgId], url),
              i18nNodes = _a.i18nNodes,
              e = _a.errors;
          errors.push.apply(errors, e);
          i18nNodesByMsgId[msgId] = i18nNodes;
        });
        if (errors.length) {
          throw new Error("xliff2 parse errors:\n" + errors.join('\n'));
        }
        return {
          locale: ((locale)),
          i18nNodesByMsgId: i18nNodesByMsgId
        };
      };
      Xliff2.prototype.digest = function(message) {
        return decimalDigest(message);
      };
      return Xliff2;
    }(Serializer));
    var _WriteVisitor$1 = (function() {
      function _WriteVisitor() {}
      _WriteVisitor.prototype.visitText = function(text, context) {
        return [new Text$2(text.value)];
      };
      _WriteVisitor.prototype.visitContainer = function(container, context) {
        var _this = this;
        var nodes = [];
        container.children.forEach(function(node) {
          return nodes.push.apply(nodes, node.visit(_this));
        });
        return nodes;
      };
      _WriteVisitor.prototype.visitIcu = function(icu, context) {
        var _this = this;
        var nodes = [new Text$2("{" + icu.expressionPlaceholder + ", " + icu.type + ", ")];
        Object.keys(icu.cases).forEach(function(c) {
          nodes.push.apply(nodes, [new Text$2(c + " {")].concat(icu.cases[c].visit(_this), [new Text$2("} ")]));
        });
        nodes.push(new Text$2("}"));
        return nodes;
      };
      _WriteVisitor.prototype.visitTagPlaceholder = function(ph, context) {
        var _this = this;
        var type = getTypeForTag(ph.tag);
        if (ph.isVoid) {
          var tagPh = new Tag(_PLACEHOLDER_TAG$1, {
            id: (this._nextPlaceholderId++).toString(),
            equiv: ph.startName,
            type: type,
            disp: "<" + ph.tag + "/>"
          });
          return [tagPh];
        }
        var tagPc = new Tag(_PLACEHOLDER_SPANNING_TAG, {
          id: (this._nextPlaceholderId++).toString(),
          equivStart: ph.startName,
          equivEnd: ph.closeName,
          type: type,
          dispStart: "<" + ph.tag + ">",
          dispEnd: "</" + ph.tag + ">"
        });
        var nodes = [].concat.apply([], ph.children.map(function(node) {
          return node.visit(_this);
        }));
        if (nodes.length) {
          nodes.forEach(function(node) {
            return tagPc.children.push(node);
          });
        } else {
          tagPc.children.push(new Text$2(''));
        }
        return [tagPc];
      };
      _WriteVisitor.prototype.visitPlaceholder = function(ph, context) {
        var idStr = (this._nextPlaceholderId++).toString();
        return [new Tag(_PLACEHOLDER_TAG$1, {
          id: idStr,
          equiv: ph.name,
          disp: "{{" + ph.value + "}}"
        })];
      };
      _WriteVisitor.prototype.visitIcuPlaceholder = function(ph, context) {
        var cases = Object.keys(ph.value.cases).map(function(value) {
          return value + ' {...}';
        }).join(' ');
        var idStr = (this._nextPlaceholderId++).toString();
        return [new Tag(_PLACEHOLDER_TAG$1, {
          id: idStr,
          equiv: ph.name,
          disp: "{" + ph.value.expression + ", " + ph.value.type + ", " + cases + "}"
        })];
      };
      _WriteVisitor.prototype.serialize = function(nodes) {
        var _this = this;
        this._nextPlaceholderId = 0;
        return [].concat.apply([], nodes.map(function(node) {
          return node.visit(_this);
        }));
      };
      return _WriteVisitor;
    }());
    var Xliff2Parser = (function() {
      function Xliff2Parser() {
        this._locale = null;
      }
      Xliff2Parser.prototype.parse = function(xliff, url) {
        this._unitMlString = null;
        this._msgIdToHtml = {};
        var xml = new XmlParser().parse(xliff, url, false);
        this._errors = xml.errors;
        visitAll(this, xml.rootNodes, null);
        return {
          msgIdToHtml: this._msgIdToHtml,
          errors: this._errors,
          locale: this._locale
        };
      };
      Xliff2Parser.prototype.visitElement = function(element, context) {
        switch (element.name) {
          case _UNIT_TAG$1:
            this._unitMlString = null;
            var idAttr = element.attrs.find(function(attr) {
              return attr.name === 'id';
            });
            if (!idAttr) {
              this._addError(element, "<" + _UNIT_TAG$1 + "> misses the \"id\" attribute");
            } else {
              var id = idAttr.value;
              if (this._msgIdToHtml.hasOwnProperty(id)) {
                this._addError(element, "Duplicated translations for msg " + id);
              } else {
                visitAll(this, element.children, null);
                if (typeof this._unitMlString === 'string') {
                  this._msgIdToHtml[id] = this._unitMlString;
                } else {
                  this._addError(element, "Message " + id + " misses a translation");
                }
              }
            }
            break;
          case _SOURCE_TAG$1:
            break;
          case _TARGET_TAG$1:
            var innerTextStart = ((element.startSourceSpan)).end.offset;
            var innerTextEnd = ((element.endSourceSpan)).start.offset;
            var content = ((element.startSourceSpan)).start.file.content;
            var innerText = content.slice(innerTextStart, innerTextEnd);
            this._unitMlString = innerText;
            break;
          case _XLIFF_TAG:
            var localeAttr = element.attrs.find(function(attr) {
              return attr.name === 'trgLang';
            });
            if (localeAttr) {
              this._locale = localeAttr.value;
            }
            var versionAttr = element.attrs.find(function(attr) {
              return attr.name === 'version';
            });
            if (versionAttr) {
              var version = versionAttr.value;
              if (version !== '2.0') {
                this._addError(element, "The XLIFF file version " + version + " is not compatible with XLIFF 2.0 serializer");
              } else {
                visitAll(this, element.children, null);
              }
            }
            break;
          default:
            visitAll(this, element.children, null);
        }
      };
      Xliff2Parser.prototype.visitAttribute = function(attribute, context) {};
      Xliff2Parser.prototype.visitText = function(text, context) {};
      Xliff2Parser.prototype.visitComment = function(comment, context) {};
      Xliff2Parser.prototype.visitExpansion = function(expansion, context) {};
      Xliff2Parser.prototype.visitExpansionCase = function(expansionCase, context) {};
      Xliff2Parser.prototype._addError = function(node, message) {
        this._errors.push(new I18nError(node.sourceSpan, message));
      };
      return Xliff2Parser;
    }());
    var XmlToI18n$1 = (function() {
      function XmlToI18n() {}
      XmlToI18n.prototype.convert = function(message, url) {
        var xmlIcu = new XmlParser().parse(message, url, true);
        this._errors = xmlIcu.errors;
        var i18nNodes = this._errors.length > 0 || xmlIcu.rootNodes.length == 0 ? [] : [].concat.apply([], visitAll(this, xmlIcu.rootNodes));
        return {
          i18nNodes: i18nNodes,
          errors: this._errors
        };
      };
      XmlToI18n.prototype.visitText = function(text, context) {
        return new Text$1(text.value, text.sourceSpan);
      };
      XmlToI18n.prototype.visitElement = function(el, context) {
        var _this = this;
        switch (el.name) {
          case _PLACEHOLDER_TAG$1:
            var nameAttr = el.attrs.find(function(attr) {
              return attr.name === 'equiv';
            });
            if (nameAttr) {
              return [new Placeholder('', nameAttr.value, el.sourceSpan)];
            }
            this._addError(el, "<" + _PLACEHOLDER_TAG$1 + "> misses the \"equiv\" attribute");
            break;
          case _PLACEHOLDER_SPANNING_TAG:
            var startAttr = el.attrs.find(function(attr) {
              return attr.name === 'equivStart';
            });
            var endAttr = el.attrs.find(function(attr) {
              return attr.name === 'equivEnd';
            });
            if (!startAttr) {
              this._addError(el, "<" + _PLACEHOLDER_TAG$1 + "> misses the \"equivStart\" attribute");
            } else if (!endAttr) {
              this._addError(el, "<" + _PLACEHOLDER_TAG$1 + "> misses the \"equivEnd\" attribute");
            } else {
              var startId = startAttr.value;
              var endId = endAttr.value;
              var nodes = [];
              return nodes.concat.apply(nodes, [new Placeholder('', startId, el.sourceSpan)].concat(el.children.map(function(node) {
                return node.visit(_this, null);
              }), [new Placeholder('', endId, el.sourceSpan)]));
            }
            break;
          case _MARKER_TAG$1:
            return [].concat.apply([], visitAll(this, el.children));
          default:
            this._addError(el, "Unexpected tag");
        }
        return null;
      };
      XmlToI18n.prototype.visitExpansion = function(icu, context) {
        var caseMap = {};
        visitAll(this, icu.cases).forEach(function(c) {
          caseMap[c.value] = new Container(c.nodes, icu.sourceSpan);
        });
        return new Icu(icu.switchValue, icu.type, caseMap, icu.sourceSpan);
      };
      XmlToI18n.prototype.visitExpansionCase = function(icuCase, context) {
        return {
          value: icuCase.value,
          nodes: [].concat.apply([], visitAll(this, icuCase.expression))
        };
      };
      XmlToI18n.prototype.visitComment = function(comment, context) {};
      XmlToI18n.prototype.visitAttribute = function(attribute, context) {};
      XmlToI18n.prototype._addError = function(node, message) {
        this._errors.push(new I18nError(node.sourceSpan, message));
      };
      return XmlToI18n;
    }());
    function getTypeForTag(tag) {
      switch (tag.toLowerCase()) {
        case 'br':
        case 'b':
        case 'i':
        case 'u':
          return 'fmt';
        case 'img':
          return 'image';
        case 'a':
          return 'link';
        default:
          return 'other';
      }
    }
    var _MESSAGES_TAG = 'messagebundle';
    var _MESSAGE_TAG = 'msg';
    var _PLACEHOLDER_TAG$2 = 'ph';
    var _EXEMPLE_TAG = 'ex';
    var _SOURCE_TAG$2 = 'source';
    var _DOCTYPE = "<!ELEMENT messagebundle (msg)*>\n<!ATTLIST messagebundle class CDATA #IMPLIED>\n\n<!ELEMENT msg (#PCDATA|ph|source)*>\n<!ATTLIST msg id CDATA #IMPLIED>\n<!ATTLIST msg seq CDATA #IMPLIED>\n<!ATTLIST msg name CDATA #IMPLIED>\n<!ATTLIST msg desc CDATA #IMPLIED>\n<!ATTLIST msg meaning CDATA #IMPLIED>\n<!ATTLIST msg obsolete (obsolete) #IMPLIED>\n<!ATTLIST msg xml:space (default|preserve) \"default\">\n<!ATTLIST msg is_hidden CDATA #IMPLIED>\n\n<!ELEMENT source (#PCDATA)>\n\n<!ELEMENT ph (#PCDATA|ex)*>\n<!ATTLIST ph name CDATA #REQUIRED>\n\n<!ELEMENT ex (#PCDATA)>";
    var Xmb = (function(_super) {
      __extends(Xmb, _super);
      function Xmb() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      Xmb.prototype.write = function(messages, locale) {
        var exampleVisitor = new ExampleVisitor();
        var visitor = new _Visitor$2();
        var rootNode = new Tag(_MESSAGES_TAG);
        messages.forEach(function(message) {
          var attrs = {id: message.id};
          if (message.description) {
            attrs['desc'] = message.description;
          }
          if (message.meaning) {
            attrs['meaning'] = message.meaning;
          }
          var sourceTags = [];
          message.sources.forEach(function(source) {
            sourceTags.push(new Tag(_SOURCE_TAG$2, {}, [new Text$2(source.filePath + ":" + source.startLine + (source.endLine !== source.startLine ? ',' + source.endLine : ''))]));
          });
          rootNode.children.push(new CR(2), new Tag(_MESSAGE_TAG, attrs, sourceTags.concat(visitor.serialize(message.nodes))));
        });
        rootNode.children.push(new CR());
        return serialize([new Declaration({
          version: '1.0',
          encoding: 'UTF-8'
        }), new CR(), new Doctype(_MESSAGES_TAG, _DOCTYPE), new CR(), exampleVisitor.addDefaultExamples(rootNode), new CR()]);
      };
      Xmb.prototype.load = function(content, url) {
        throw new Error('Unsupported');
      };
      Xmb.prototype.digest = function(message) {
        return digest$1(message);
      };
      Xmb.prototype.createNameMapper = function(message) {
        return new SimplePlaceholderMapper(message, toPublicName);
      };
      return Xmb;
    }(Serializer));
    var _Visitor$2 = (function() {
      function _Visitor() {}
      _Visitor.prototype.visitText = function(text, context) {
        return [new Text$2(text.value)];
      };
      _Visitor.prototype.visitContainer = function(container, context) {
        var _this = this;
        var nodes = [];
        container.children.forEach(function(node) {
          return nodes.push.apply(nodes, node.visit(_this));
        });
        return nodes;
      };
      _Visitor.prototype.visitIcu = function(icu, context) {
        var _this = this;
        var nodes = [new Text$2("{" + icu.expressionPlaceholder + ", " + icu.type + ", ")];
        Object.keys(icu.cases).forEach(function(c) {
          nodes.push.apply(nodes, [new Text$2(c + " {")].concat(icu.cases[c].visit(_this), [new Text$2("} ")]));
        });
        nodes.push(new Text$2("}"));
        return nodes;
      };
      _Visitor.prototype.visitTagPlaceholder = function(ph, context) {
        var startEx = new Tag(_EXEMPLE_TAG, {}, [new Text$2("<" + ph.tag + ">")]);
        var startTagPh = new Tag(_PLACEHOLDER_TAG$2, {name: ph.startName}, [startEx]);
        if (ph.isVoid) {
          return [startTagPh];
        }
        var closeEx = new Tag(_EXEMPLE_TAG, {}, [new Text$2("</" + ph.tag + ">")]);
        var closeTagPh = new Tag(_PLACEHOLDER_TAG$2, {name: ph.closeName}, [closeEx]);
        return [startTagPh].concat(this.serialize(ph.children), [closeTagPh]);
      };
      _Visitor.prototype.visitPlaceholder = function(ph, context) {
        var exTag = new Tag(_EXEMPLE_TAG, {}, [new Text$2("{{" + ph.value + "}}")]);
        return [new Tag(_PLACEHOLDER_TAG$2, {name: ph.name}, [exTag])];
      };
      _Visitor.prototype.visitIcuPlaceholder = function(ph, context) {
        var exTag = new Tag(_EXEMPLE_TAG, {}, [new Text$2("{" + ph.value.expression + ", " + ph.value.type + ", " + Object.keys(ph.value.cases).map(function(value) {
          return value + ' {...}';
        }).join(' ') + "}")]);
        return [new Tag(_PLACEHOLDER_TAG$2, {name: ph.name}, [exTag])];
      };
      _Visitor.prototype.serialize = function(nodes) {
        var _this = this;
        return [].concat.apply([], nodes.map(function(node) {
          return node.visit(_this);
        }));
      };
      return _Visitor;
    }());
    function digest$1(message) {
      return decimalDigest(message);
    }
    var ExampleVisitor = (function() {
      function ExampleVisitor() {}
      ExampleVisitor.prototype.addDefaultExamples = function(node) {
        node.visit(this);
        return node;
      };
      ExampleVisitor.prototype.visitTag = function(tag) {
        var _this = this;
        if (tag.name === _PLACEHOLDER_TAG$2) {
          if (!tag.children || tag.children.length == 0) {
            var exText = new Text$2(tag.attrs['name'] || '...');
            tag.children = [new Tag(_EXEMPLE_TAG, {}, [exText])];
          }
        } else if (tag.children) {
          tag.children.forEach(function(node) {
            return node.visit(_this);
          });
        }
      };
      ExampleVisitor.prototype.visitText = function(text) {};
      ExampleVisitor.prototype.visitDeclaration = function(decl) {};
      ExampleVisitor.prototype.visitDoctype = function(doctype) {};
      return ExampleVisitor;
    }());
    function toPublicName(internalName) {
      return internalName.toUpperCase().replace(/[^A-Z0-9_]/g, '_');
    }
    var _TRANSLATIONS_TAG = 'translationbundle';
    var _TRANSLATION_TAG = 'translation';
    var _PLACEHOLDER_TAG$3 = 'ph';
    var Xtb = (function(_super) {
      __extends(Xtb, _super);
      function Xtb() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      Xtb.prototype.write = function(messages, locale) {
        throw new Error('Unsupported');
      };
      Xtb.prototype.load = function(content, url) {
        var xtbParser = new XtbParser();
        var _a = xtbParser.parse(content, url),
            locale = _a.locale,
            msgIdToHtml = _a.msgIdToHtml,
            errors = _a.errors;
        var i18nNodesByMsgId = {};
        var converter = new XmlToI18n$2();
        Object.keys(msgIdToHtml).forEach(function(msgId) {
          var valueFn = function() {
            var _a = converter.convert(msgIdToHtml[msgId], url),
                i18nNodes = _a.i18nNodes,
                errors = _a.errors;
            if (errors.length) {
              throw new Error("xtb parse errors:\n" + errors.join('\n'));
            }
            return i18nNodes;
          };
          createLazyProperty(i18nNodesByMsgId, msgId, valueFn);
        });
        if (errors.length) {
          throw new Error("xtb parse errors:\n" + errors.join('\n'));
        }
        return {
          locale: ((locale)),
          i18nNodesByMsgId: i18nNodesByMsgId
        };
      };
      Xtb.prototype.digest = function(message) {
        return digest$1(message);
      };
      Xtb.prototype.createNameMapper = function(message) {
        return new SimplePlaceholderMapper(message, toPublicName);
      };
      return Xtb;
    }(Serializer));
    function createLazyProperty(messages, id, valueFn) {
      Object.defineProperty(messages, id, {
        configurable: true,
        enumerable: true,
        get: function() {
          var value = valueFn();
          Object.defineProperty(messages, id, {
            enumerable: true,
            value: value
          });
          return value;
        },
        set: function(_) {
          throw new Error('Could not overwrite an XTB translation');
        }
      });
    }
    var XtbParser = (function() {
      function XtbParser() {
        this._locale = null;
      }
      XtbParser.prototype.parse = function(xtb, url) {
        this._bundleDepth = 0;
        this._msgIdToHtml = {};
        var xml = new XmlParser().parse(xtb, url, false);
        this._errors = xml.errors;
        visitAll(this, xml.rootNodes);
        return {
          msgIdToHtml: this._msgIdToHtml,
          errors: this._errors,
          locale: this._locale
        };
      };
      XtbParser.prototype.visitElement = function(element, context) {
        switch (element.name) {
          case _TRANSLATIONS_TAG:
            this._bundleDepth++;
            if (this._bundleDepth > 1) {
              this._addError(element, "<" + _TRANSLATIONS_TAG + "> elements can not be nested");
            }
            var langAttr = element.attrs.find(function(attr) {
              return attr.name === 'lang';
            });
            if (langAttr) {
              this._locale = langAttr.value;
            }
            visitAll(this, element.children, null);
            this._bundleDepth--;
            break;
          case _TRANSLATION_TAG:
            var idAttr = element.attrs.find(function(attr) {
              return attr.name === 'id';
            });
            if (!idAttr) {
              this._addError(element, "<" + _TRANSLATION_TAG + "> misses the \"id\" attribute");
            } else {
              var id = idAttr.value;
              if (this._msgIdToHtml.hasOwnProperty(id)) {
                this._addError(element, "Duplicated translations for msg " + id);
              } else {
                var innerTextStart = ((element.startSourceSpan)).end.offset;
                var innerTextEnd = ((element.endSourceSpan)).start.offset;
                var content = ((element.startSourceSpan)).start.file.content;
                var innerText = content.slice(((innerTextStart)), ((innerTextEnd)));
                this._msgIdToHtml[id] = innerText;
              }
            }
            break;
          default:
            this._addError(element, 'Unexpected tag');
        }
      };
      XtbParser.prototype.visitAttribute = function(attribute, context) {};
      XtbParser.prototype.visitText = function(text, context) {};
      XtbParser.prototype.visitComment = function(comment, context) {};
      XtbParser.prototype.visitExpansion = function(expansion, context) {};
      XtbParser.prototype.visitExpansionCase = function(expansionCase, context) {};
      XtbParser.prototype._addError = function(node, message) {
        this._errors.push(new I18nError(((node.sourceSpan)), message));
      };
      return XtbParser;
    }());
    var XmlToI18n$2 = (function() {
      function XmlToI18n() {}
      XmlToI18n.prototype.convert = function(message, url) {
        var xmlIcu = new XmlParser().parse(message, url, true);
        this._errors = xmlIcu.errors;
        var i18nNodes = this._errors.length > 0 || xmlIcu.rootNodes.length == 0 ? [] : visitAll(this, xmlIcu.rootNodes);
        return {
          i18nNodes: i18nNodes,
          errors: this._errors
        };
      };
      XmlToI18n.prototype.visitText = function(text, context) {
        return new Text$1(text.value, ((text.sourceSpan)));
      };
      XmlToI18n.prototype.visitExpansion = function(icu, context) {
        var caseMap = {};
        visitAll(this, icu.cases).forEach(function(c) {
          caseMap[c.value] = new Container(c.nodes, icu.sourceSpan);
        });
        return new Icu(icu.switchValue, icu.type, caseMap, icu.sourceSpan);
      };
      XmlToI18n.prototype.visitExpansionCase = function(icuCase, context) {
        return {
          value: icuCase.value,
          nodes: visitAll(this, icuCase.expression)
        };
      };
      XmlToI18n.prototype.visitElement = function(el, context) {
        if (el.name === _PLACEHOLDER_TAG$3) {
          var nameAttr = el.attrs.find(function(attr) {
            return attr.name === 'name';
          });
          if (nameAttr) {
            return new Placeholder('', nameAttr.value, ((el.sourceSpan)));
          }
          this._addError(el, "<" + _PLACEHOLDER_TAG$3 + "> misses the \"name\" attribute");
        } else {
          this._addError(el, "Unexpected tag");
        }
        return null;
      };
      XmlToI18n.prototype.visitComment = function(comment, context) {};
      XmlToI18n.prototype.visitAttribute = function(attribute, context) {};
      XmlToI18n.prototype._addError = function(node, message) {
        this._errors.push(new I18nError(((node.sourceSpan)), message));
      };
      return XmlToI18n;
    }());
    var HtmlParser = (function(_super) {
      __extends(HtmlParser, _super);
      function HtmlParser() {
        return _super.call(this, getHtmlTagDefinition) || this;
      }
      HtmlParser.prototype.parse = function(source, url, parseExpansionForms, interpolationConfig) {
        if (parseExpansionForms === void 0) {
          parseExpansionForms = false;
        }
        if (interpolationConfig === void 0) {
          interpolationConfig = DEFAULT_INTERPOLATION_CONFIG;
        }
        return _super.prototype.parse.call(this, source, url, parseExpansionForms, interpolationConfig);
      };
      return HtmlParser;
    }(Parser$1));
    var TranslationBundle = (function() {
      function TranslationBundle(_i18nNodesByMsgId, locale, digest, mapperFactory, missingTranslationStrategy, console) {
        if (_i18nNodesByMsgId === void 0) {
          _i18nNodesByMsgId = {};
        }
        if (missingTranslationStrategy === void 0) {
          missingTranslationStrategy = MissingTranslationStrategy.Warning;
        }
        this._i18nNodesByMsgId = _i18nNodesByMsgId;
        this.digest = digest;
        this.mapperFactory = mapperFactory;
        this._i18nToHtml = new I18nToHtmlVisitor(_i18nNodesByMsgId, locale, digest, ((mapperFactory)), missingTranslationStrategy, console);
      }
      TranslationBundle.load = function(content, url, serializer, missingTranslationStrategy, console) {
        var _a = serializer.load(content, url),
            locale = _a.locale,
            i18nNodesByMsgId = _a.i18nNodesByMsgId;
        var digestFn = function(m) {
          return serializer.digest(m);
        };
        var mapperFactory = function(m) {
          return ((serializer.createNameMapper(m)));
        };
        return new TranslationBundle(i18nNodesByMsgId, locale, digestFn, mapperFactory, missingTranslationStrategy, console);
      };
      TranslationBundle.prototype.get = function(srcMsg) {
        var html = this._i18nToHtml.convert(srcMsg);
        if (html.errors.length) {
          throw new Error(html.errors.join('\n'));
        }
        return html.nodes;
      };
      TranslationBundle.prototype.has = function(srcMsg) {
        return this.digest(srcMsg) in this._i18nNodesByMsgId;
      };
      return TranslationBundle;
    }());
    var I18nToHtmlVisitor = (function() {
      function I18nToHtmlVisitor(_i18nNodesByMsgId, _locale, _digest, _mapperFactory, _missingTranslationStrategy, _console) {
        if (_i18nNodesByMsgId === void 0) {
          _i18nNodesByMsgId = {};
        }
        this._i18nNodesByMsgId = _i18nNodesByMsgId;
        this._locale = _locale;
        this._digest = _digest;
        this._mapperFactory = _mapperFactory;
        this._missingTranslationStrategy = _missingTranslationStrategy;
        this._console = _console;
        this._contextStack = [];
        this._errors = [];
      }
      I18nToHtmlVisitor.prototype.convert = function(srcMsg) {
        this._contextStack.length = 0;
        this._errors.length = 0;
        var text = this._convertToText(srcMsg);
        var url = srcMsg.nodes[0].sourceSpan.start.file.url;
        var html = new HtmlParser().parse(text, url, true);
        return {
          nodes: html.rootNodes,
          errors: this._errors.concat(html.errors)
        };
      };
      I18nToHtmlVisitor.prototype.visitText = function(text, context) {
        return text.value;
      };
      I18nToHtmlVisitor.prototype.visitContainer = function(container, context) {
        var _this = this;
        return container.children.map(function(n) {
          return n.visit(_this);
        }).join('');
      };
      I18nToHtmlVisitor.prototype.visitIcu = function(icu, context) {
        var _this = this;
        var cases = Object.keys(icu.cases).map(function(k) {
          return k + " {" + icu.cases[k].visit(_this) + "}";
        });
        var exp = this._srcMsg.placeholders.hasOwnProperty(icu.expression) ? this._srcMsg.placeholders[icu.expression] : icu.expression;
        return "{" + exp + ", " + icu.type + ", " + cases.join(' ') + "}";
      };
      I18nToHtmlVisitor.prototype.visitPlaceholder = function(ph, context) {
        var phName = this._mapper(ph.name);
        if (this._srcMsg.placeholders.hasOwnProperty(phName)) {
          return this._srcMsg.placeholders[phName];
        }
        if (this._srcMsg.placeholderToMessage.hasOwnProperty(phName)) {
          return this._convertToText(this._srcMsg.placeholderToMessage[phName]);
        }
        this._addError(ph, "Unknown placeholder \"" + ph.name + "\"");
        return '';
      };
      I18nToHtmlVisitor.prototype.visitTagPlaceholder = function(ph, context) {
        var _this = this;
        var tag = "" + ph.tag;
        var attrs = Object.keys(ph.attrs).map(function(name) {
          return name + "=\"" + ph.attrs[name] + "\"";
        }).join(' ');
        if (ph.isVoid) {
          return "<" + tag + " " + attrs + "/>";
        }
        var children = ph.children.map(function(c) {
          return c.visit(_this);
        }).join('');
        return "<" + tag + " " + attrs + ">" + children + "</" + tag + ">";
      };
      I18nToHtmlVisitor.prototype.visitIcuPlaceholder = function(ph, context) {
        return this._convertToText(this._srcMsg.placeholderToMessage[ph.name]);
      };
      I18nToHtmlVisitor.prototype._convertToText = function(srcMsg) {
        var _this = this;
        var id = this._digest(srcMsg);
        var mapper = this._mapperFactory ? this._mapperFactory(srcMsg) : null;
        var nodes;
        this._contextStack.push({
          msg: this._srcMsg,
          mapper: this._mapper
        });
        this._srcMsg = srcMsg;
        if (this._i18nNodesByMsgId.hasOwnProperty(id)) {
          nodes = this._i18nNodesByMsgId[id];
          this._mapper = function(name) {
            return mapper ? ((mapper.toInternalName(name))) : name;
          };
        } else {
          if (this._missingTranslationStrategy === MissingTranslationStrategy.Error) {
            var ctx = this._locale ? " for locale \"" + this._locale + "\"" : '';
            this._addError(srcMsg.nodes[0], "Missing translation for message \"" + id + "\"" + ctx);
          } else if (this._console && this._missingTranslationStrategy === MissingTranslationStrategy.Warning) {
            var ctx = this._locale ? " for locale \"" + this._locale + "\"" : '';
            this._console.warn("Missing translation for message \"" + id + "\"" + ctx);
          }
          nodes = srcMsg.nodes;
          this._mapper = function(name) {
            return name;
          };
        }
        var text = nodes.map(function(node) {
          return node.visit(_this);
        }).join('');
        var context = ((this._contextStack.pop()));
        this._srcMsg = context.msg;
        this._mapper = context.mapper;
        return text;
      };
      I18nToHtmlVisitor.prototype._addError = function(el, msg) {
        this._errors.push(new I18nError(el.sourceSpan, msg));
      };
      return I18nToHtmlVisitor;
    }());
    var I18NHtmlParser = (function() {
      function I18NHtmlParser(_htmlParser, translations, translationsFormat, missingTranslation, console) {
        if (missingTranslation === void 0) {
          missingTranslation = MissingTranslationStrategy.Warning;
        }
        this._htmlParser = _htmlParser;
        if (translations) {
          var serializer = createSerializer(translationsFormat);
          this._translationBundle = TranslationBundle.load(translations, 'i18n', serializer, missingTranslation, console);
        } else {
          this._translationBundle = new TranslationBundle({}, null, digest, undefined, missingTranslation, console);
        }
      }
      I18NHtmlParser.prototype.parse = function(source, url, parseExpansionForms, interpolationConfig) {
        if (parseExpansionForms === void 0) {
          parseExpansionForms = false;
        }
        if (interpolationConfig === void 0) {
          interpolationConfig = DEFAULT_INTERPOLATION_CONFIG;
        }
        var parseResult = this._htmlParser.parse(source, url, parseExpansionForms, interpolationConfig);
        if (parseResult.errors.length) {
          return new ParseTreeResult(parseResult.rootNodes, parseResult.errors);
        }
        return mergeTranslations(parseResult.rootNodes, this._translationBundle, interpolationConfig, [], {});
      };
      return I18NHtmlParser;
    }());
    function createSerializer(format) {
      format = (format || 'xlf').toLowerCase();
      switch (format) {
        case 'xmb':
          return new Xmb();
        case 'xtb':
          return new Xtb();
        case 'xliff2':
        case 'xlf2':
          return new Xliff2();
        case 'xliff':
        case 'xlf':
        default:
          return new Xliff();
      }
    }
    var STRIP_SRC_FILE_SUFFIXES = /(\.ts|\.d\.ts|\.js|\.jsx|\.tsx)$/;
    var GENERATED_FILE = /\.ngfactory\.|\.ngsummary\./;
    var JIT_SUMMARY_FILE = /\.ngsummary\./;
    var JIT_SUMMARY_NAME = /NgSummary$/;
    function ngfactoryFilePath(filePath, forceSourceFile) {
      if (forceSourceFile === void 0) {
        forceSourceFile = false;
      }
      var urlWithSuffix = splitTypescriptSuffix(filePath, forceSourceFile);
      return urlWithSuffix[0] + ".ngfactory" + normalizeGenFileSuffix(urlWithSuffix[1]);
    }
    function stripGeneratedFileSuffix(filePath) {
      return filePath.replace(GENERATED_FILE, '.');
    }
    function isGeneratedFile(filePath) {
      return GENERATED_FILE.test(filePath);
    }
    function splitTypescriptSuffix(path, forceSourceFile) {
      if (forceSourceFile === void 0) {
        forceSourceFile = false;
      }
      if (path.endsWith('.d.ts')) {
        return [path.slice(0, -5), forceSourceFile ? '.ts' : '.d.ts'];
      }
      var lastDot = path.lastIndexOf('.');
      if (lastDot !== -1) {
        return [path.substring(0, lastDot), path.substring(lastDot)];
      }
      return [path, ''];
    }
    function normalizeGenFileSuffix(srcFileSuffix) {
      return srcFileSuffix === '.tsx' ? '.ts' : srcFileSuffix;
    }
    function summaryFileName(fileName) {
      var fileNameWithoutSuffix = fileName.replace(STRIP_SRC_FILE_SUFFIXES, '');
      return fileNameWithoutSuffix + ".ngsummary.json";
    }
    function summaryForJitFileName(fileName, forceSourceFile) {
      if (forceSourceFile === void 0) {
        forceSourceFile = false;
      }
      var urlWithSuffix = splitTypescriptSuffix(stripGeneratedFileSuffix(fileName), forceSourceFile);
      return urlWithSuffix[0] + ".ngsummary" + urlWithSuffix[1];
    }
    function stripSummaryForJitFileSuffix(filePath) {
      return filePath.replace(JIT_SUMMARY_FILE, '.');
    }
    function summaryForJitName(symbolName) {
      return symbolName + "NgSummary";
    }
    function stripSummaryForJitNameSuffix(symbolName) {
      return symbolName.replace(JIT_SUMMARY_NAME, '');
    }
    var LOWERED_SYMBOL = /\u0275\d+/;
    function isLoweredSymbol(name) {
      return LOWERED_SYMBOL.test(name);
    }
    function createLoweredSymbol(id) {
      return "\u0275" + id;
    }
    var CORE = '@angular/core';
    var Identifiers = (function() {
      function Identifiers() {}
      Identifiers.ANALYZE_FOR_ENTRY_COMPONENTS = {
        name: 'ANALYZE_FOR_ENTRY_COMPONENTS',
        moduleName: CORE
      };
      Identifiers.ElementRef = {
        name: 'ElementRef',
        moduleName: CORE
      };
      Identifiers.NgModuleRef = {
        name: 'NgModuleRef',
        moduleName: CORE
      };
      Identifiers.ViewContainerRef = {
        name: 'ViewContainerRef',
        moduleName: CORE
      };
      Identifiers.ChangeDetectorRef = {
        name: 'ChangeDetectorRef',
        moduleName: CORE
      };
      Identifiers.QueryList = {
        name: 'QueryList',
        moduleName: CORE
      };
      Identifiers.TemplateRef = {
        name: 'TemplateRef',
        moduleName: CORE
      };
      Identifiers.CodegenComponentFactoryResolver = {
        name: 'ɵCodegenComponentFactoryResolver',
        moduleName: CORE
      };
      Identifiers.ComponentFactoryResolver = {
        name: 'ComponentFactoryResolver',
        moduleName: CORE
      };
      Identifiers.ComponentFactory = {
        name: 'ComponentFactory',
        moduleName: CORE
      };
      Identifiers.ComponentRef = {
        name: 'ComponentRef',
        moduleName: CORE
      };
      Identifiers.NgModuleFactory = {
        name: 'NgModuleFactory',
        moduleName: CORE
      };
      Identifiers.createModuleFactory = {
        name: 'ɵcmf',
        moduleName: CORE
      };
      Identifiers.moduleDef = {
        name: 'ɵmod',
        moduleName: CORE
      };
      Identifiers.moduleProviderDef = {
        name: 'ɵmpd',
        moduleName: CORE
      };
      Identifiers.RegisterModuleFactoryFn = {
        name: 'ɵregisterModuleFactory',
        moduleName: CORE
      };
      Identifiers.Injector = {
        name: 'Injector',
        moduleName: CORE
      };
      Identifiers.ViewEncapsulation = {
        name: 'ViewEncapsulation',
        moduleName: CORE
      };
      Identifiers.ChangeDetectionStrategy = {
        name: 'ChangeDetectionStrategy',
        moduleName: CORE
      };
      Identifiers.SecurityContext = {
        name: 'SecurityContext',
        moduleName: CORE
      };
      Identifiers.LOCALE_ID = {
        name: 'LOCALE_ID',
        moduleName: CORE
      };
      Identifiers.TRANSLATIONS_FORMAT = {
        name: 'TRANSLATIONS_FORMAT',
        moduleName: CORE
      };
      Identifiers.inlineInterpolate = {
        name: 'ɵinlineInterpolate',
        moduleName: CORE
      };
      Identifiers.interpolate = {
        name: 'ɵinterpolate',
        moduleName: CORE
      };
      Identifiers.EMPTY_ARRAY = {
        name: 'ɵEMPTY_ARRAY',
        moduleName: CORE
      };
      Identifiers.EMPTY_MAP = {
        name: 'ɵEMPTY_MAP',
        moduleName: CORE
      };
      Identifiers.Renderer = {
        name: 'Renderer',
        moduleName: CORE
      };
      Identifiers.viewDef = {
        name: 'ɵvid',
        moduleName: CORE
      };
      Identifiers.elementDef = {
        name: 'ɵeld',
        moduleName: CORE
      };
      Identifiers.anchorDef = {
        name: 'ɵand',
        moduleName: CORE
      };
      Identifiers.textDef = {
        name: 'ɵted',
        moduleName: CORE
      };
      Identifiers.directiveDef = {
        name: 'ɵdid',
        moduleName: CORE
      };
      Identifiers.providerDef = {
        name: 'ɵprd',
        moduleName: CORE
      };
      Identifiers.queryDef = {
        name: 'ɵqud',
        moduleName: CORE
      };
      Identifiers.pureArrayDef = {
        name: 'ɵpad',
        moduleName: CORE
      };
      Identifiers.pureObjectDef = {
        name: 'ɵpod',
        moduleName: CORE
      };
      Identifiers.purePipeDef = {
        name: 'ɵppd',
        moduleName: CORE
      };
      Identifiers.pipeDef = {
        name: 'ɵpid',
        moduleName: CORE
      };
      Identifiers.nodeValue = {
        name: 'ɵnov',
        moduleName: CORE
      };
      Identifiers.ngContentDef = {
        name: 'ɵncd',
        moduleName: CORE
      };
      Identifiers.unwrapValue = {
        name: 'ɵunv',
        moduleName: CORE
      };
      Identifiers.createRendererType2 = {
        name: 'ɵcrt',
        moduleName: CORE
      };
      Identifiers.RendererType2 = {
        name: 'RendererType2',
        moduleName: CORE
      };
      Identifiers.ViewDefinition = {
        name: 'ɵViewDefinition',
        moduleName: CORE
      };
      Identifiers.createComponentFactory = {
        name: 'ɵccf',
        moduleName: CORE
      };
      return Identifiers;
    }());
    function createTokenForReference(reference) {
      return {identifier: {reference: reference}};
    }
    function createTokenForExternalReference(reflector, reference) {
      return createTokenForReference(reflector.resolveExternalReference(reference));
    }
    var LifecycleHooks = {
      OnInit: 0,
      OnDestroy: 1,
      DoCheck: 2,
      OnChanges: 3,
      AfterContentInit: 4,
      AfterContentChecked: 5,
      AfterViewInit: 6,
      AfterViewChecked: 7
    };
    LifecycleHooks[LifecycleHooks.OnInit] = "OnInit";
    LifecycleHooks[LifecycleHooks.OnDestroy] = "OnDestroy";
    LifecycleHooks[LifecycleHooks.DoCheck] = "DoCheck";
    LifecycleHooks[LifecycleHooks.OnChanges] = "OnChanges";
    LifecycleHooks[LifecycleHooks.AfterContentInit] = "AfterContentInit";
    LifecycleHooks[LifecycleHooks.AfterContentChecked] = "AfterContentChecked";
    LifecycleHooks[LifecycleHooks.AfterViewInit] = "AfterViewInit";
    LifecycleHooks[LifecycleHooks.AfterViewChecked] = "AfterViewChecked";
    var LIFECYCLE_HOOKS_VALUES = [LifecycleHooks.OnInit, LifecycleHooks.OnDestroy, LifecycleHooks.DoCheck, LifecycleHooks.OnChanges, LifecycleHooks.AfterContentInit, LifecycleHooks.AfterContentChecked, LifecycleHooks.AfterViewInit, LifecycleHooks.AfterViewChecked];
    function hasLifecycleHook(reflector, hook, token) {
      return reflector.hasLifecycleHook(token, getHookName(hook));
    }
    function getAllLifecycleHooks(reflector, token) {
      return LIFECYCLE_HOOKS_VALUES.filter(function(hook) {
        return hasLifecycleHook(reflector, hook, token);
      });
    }
    function getHookName(hook) {
      switch (hook) {
        case LifecycleHooks.OnInit:
          return 'ngOnInit';
        case LifecycleHooks.OnDestroy:
          return 'ngOnDestroy';
        case LifecycleHooks.DoCheck:
          return 'ngDoCheck';
        case LifecycleHooks.OnChanges:
          return 'ngOnChanges';
        case LifecycleHooks.AfterContentInit:
          return 'ngAfterContentInit';
        case LifecycleHooks.AfterContentChecked:
          return 'ngAfterContentChecked';
        case LifecycleHooks.AfterViewInit:
          return 'ngAfterViewInit';
        case LifecycleHooks.AfterViewChecked:
          return 'ngAfterViewChecked';
      }
    }
    var _SELECTOR_REGEXP = new RegExp('(\\:not\\()|' + '([-\\w]+)|' + '(?:\\.([-\\w]+))|' + '(?:\\[([-.\\w*]+)(?:=([\"\']?)([^\\]\"\']*)\\5)?\\])|' + '(\\))|' + '(\\s*,\\s*)', 'g');
    var CssSelector = (function() {
      function CssSelector() {
        this.element = null;
        this.classNames = [];
        this.attrs = [];
        this.notSelectors = [];
      }
      CssSelector.parse = function(selector) {
        var results = [];
        var _addResult = function(res, cssSel) {
          if (cssSel.notSelectors.length > 0 && !cssSel.element && cssSel.classNames.length == 0 && cssSel.attrs.length == 0) {
            cssSel.element = '*';
          }
          res.push(cssSel);
        };
        var cssSelector = new CssSelector();
        var match;
        var current = cssSelector;
        var inNot = false;
        _SELECTOR_REGEXP.lastIndex = 0;
        while (match = _SELECTOR_REGEXP.exec(selector)) {
          if (match[1]) {
            if (inNot) {
              throw new Error('Nesting :not is not allowed in a selector');
            }
            inNot = true;
            current = new CssSelector();
            cssSelector.notSelectors.push(current);
          }
          if (match[2]) {
            current.setElement(match[2]);
          }
          if (match[3]) {
            current.addClassName(match[3]);
          }
          if (match[4]) {
            current.addAttribute(match[4], match[6]);
          }
          if (match[7]) {
            inNot = false;
            current = cssSelector;
          }
          if (match[8]) {
            if (inNot) {
              throw new Error('Multiple selectors in :not are not supported');
            }
            _addResult(results, cssSelector);
            cssSelector = current = new CssSelector();
          }
        }
        _addResult(results, cssSelector);
        return results;
      };
      CssSelector.prototype.isElementSelector = function() {
        return this.hasElementSelector() && this.classNames.length == 0 && this.attrs.length == 0 && this.notSelectors.length === 0;
      };
      CssSelector.prototype.hasElementSelector = function() {
        return !!this.element;
      };
      CssSelector.prototype.setElement = function(element) {
        if (element === void 0) {
          element = null;
        }
        this.element = element;
      };
      CssSelector.prototype.getMatchingElementTemplate = function() {
        var tagName = this.element || 'div';
        var classAttr = this.classNames.length > 0 ? " class=\"" + this.classNames.join(' ') + "\"" : '';
        var attrs = '';
        for (var i = 0; i < this.attrs.length; i += 2) {
          var attrName = this.attrs[i];
          var attrValue = this.attrs[i + 1] !== '' ? "=\"" + this.attrs[i + 1] + "\"" : '';
          attrs += " " + attrName + attrValue;
        }
        return getHtmlTagDefinition(tagName).isVoid ? "<" + tagName + classAttr + attrs + "/>" : "<" + tagName + classAttr + attrs + "></" + tagName + ">";
      };
      CssSelector.prototype.addAttribute = function(name, value) {
        if (value === void 0) {
          value = '';
        }
        this.attrs.push(name, value && value.toLowerCase() || '');
      };
      CssSelector.prototype.addClassName = function(name) {
        this.classNames.push(name.toLowerCase());
      };
      CssSelector.prototype.toString = function() {
        var res = this.element || '';
        if (this.classNames) {
          this.classNames.forEach(function(klass) {
            return res += "." + klass;
          });
        }
        if (this.attrs) {
          for (var i = 0; i < this.attrs.length; i += 2) {
            var name_1 = this.attrs[i];
            var value = this.attrs[i + 1];
            res += "[" + name_1 + (value ? '=' + value : '') + "]";
          }
        }
        this.notSelectors.forEach(function(notSelector) {
          return res += ":not(" + notSelector + ")";
        });
        return res;
      };
      return CssSelector;
    }());
    var SelectorMatcher = (function() {
      function SelectorMatcher() {
        this._elementMap = new Map();
        this._elementPartialMap = new Map();
        this._classMap = new Map();
        this._classPartialMap = new Map();
        this._attrValueMap = new Map();
        this._attrValuePartialMap = new Map();
        this._listContexts = [];
      }
      SelectorMatcher.createNotMatcher = function(notSelectors) {
        var notMatcher = new SelectorMatcher();
        notMatcher.addSelectables(notSelectors, null);
        return notMatcher;
      };
      SelectorMatcher.prototype.addSelectables = function(cssSelectors, callbackCtxt) {
        var listContext = ((null));
        if (cssSelectors.length > 1) {
          listContext = new SelectorListContext(cssSelectors);
          this._listContexts.push(listContext);
        }
        for (var i = 0; i < cssSelectors.length; i++) {
          this._addSelectable(cssSelectors[i], callbackCtxt, listContext);
        }
      };
      SelectorMatcher.prototype._addSelectable = function(cssSelector, callbackCtxt, listContext) {
        var matcher = this;
        var element = cssSelector.element;
        var classNames = cssSelector.classNames;
        var attrs = cssSelector.attrs;
        var selectable = new SelectorContext(cssSelector, callbackCtxt, listContext);
        if (element) {
          var isTerminal = attrs.length === 0 && classNames.length === 0;
          if (isTerminal) {
            this._addTerminal(matcher._elementMap, element, selectable);
          } else {
            matcher = this._addPartial(matcher._elementPartialMap, element);
          }
        }
        if (classNames) {
          for (var i = 0; i < classNames.length; i++) {
            var isTerminal = attrs.length === 0 && i === classNames.length - 1;
            var className = classNames[i];
            if (isTerminal) {
              this._addTerminal(matcher._classMap, className, selectable);
            } else {
              matcher = this._addPartial(matcher._classPartialMap, className);
            }
          }
        }
        if (attrs) {
          for (var i = 0; i < attrs.length; i += 2) {
            var isTerminal = i === attrs.length - 2;
            var name_2 = attrs[i];
            var value = attrs[i + 1];
            if (isTerminal) {
              var terminalMap = matcher._attrValueMap;
              var terminalValuesMap = terminalMap.get(name_2);
              if (!terminalValuesMap) {
                terminalValuesMap = new Map();
                terminalMap.set(name_2, terminalValuesMap);
              }
              this._addTerminal(terminalValuesMap, value, selectable);
            } else {
              var partialMap = matcher._attrValuePartialMap;
              var partialValuesMap = partialMap.get(name_2);
              if (!partialValuesMap) {
                partialValuesMap = new Map();
                partialMap.set(name_2, partialValuesMap);
              }
              matcher = this._addPartial(partialValuesMap, value);
            }
          }
        }
      };
      SelectorMatcher.prototype._addTerminal = function(map, name, selectable) {
        var terminalList = map.get(name);
        if (!terminalList) {
          terminalList = [];
          map.set(name, terminalList);
        }
        terminalList.push(selectable);
      };
      SelectorMatcher.prototype._addPartial = function(map, name) {
        var matcher = map.get(name);
        if (!matcher) {
          matcher = new SelectorMatcher();
          map.set(name, matcher);
        }
        return matcher;
      };
      SelectorMatcher.prototype.match = function(cssSelector, matchedCallback) {
        var result = false;
        var element = ((cssSelector.element));
        var classNames = cssSelector.classNames;
        var attrs = cssSelector.attrs;
        for (var i = 0; i < this._listContexts.length; i++) {
          this._listContexts[i].alreadyMatched = false;
        }
        result = this._matchTerminal(this._elementMap, element, cssSelector, matchedCallback) || result;
        result = this._matchPartial(this._elementPartialMap, element, cssSelector, matchedCallback) || result;
        if (classNames) {
          for (var i = 0; i < classNames.length; i++) {
            var className = classNames[i];
            result = this._matchTerminal(this._classMap, className, cssSelector, matchedCallback) || result;
            result = this._matchPartial(this._classPartialMap, className, cssSelector, matchedCallback) || result;
          }
        }
        if (attrs) {
          for (var i = 0; i < attrs.length; i += 2) {
            var name_3 = attrs[i];
            var value = attrs[i + 1];
            var terminalValuesMap = ((this._attrValueMap.get(name_3)));
            if (value) {
              result = this._matchTerminal(terminalValuesMap, '', cssSelector, matchedCallback) || result;
            }
            result = this._matchTerminal(terminalValuesMap, value, cssSelector, matchedCallback) || result;
            var partialValuesMap = ((this._attrValuePartialMap.get(name_3)));
            if (value) {
              result = this._matchPartial(partialValuesMap, '', cssSelector, matchedCallback) || result;
            }
            result = this._matchPartial(partialValuesMap, value, cssSelector, matchedCallback) || result;
          }
        }
        return result;
      };
      SelectorMatcher.prototype._matchTerminal = function(map, name, cssSelector, matchedCallback) {
        if (!map || typeof name !== 'string') {
          return false;
        }
        var selectables = map.get(name) || [];
        var starSelectables = ((map.get('*')));
        if (starSelectables) {
          selectables = selectables.concat(starSelectables);
        }
        if (selectables.length === 0) {
          return false;
        }
        var selectable;
        var result = false;
        for (var i = 0; i < selectables.length; i++) {
          selectable = selectables[i];
          result = selectable.finalize(cssSelector, matchedCallback) || result;
        }
        return result;
      };
      SelectorMatcher.prototype._matchPartial = function(map, name, cssSelector, matchedCallback) {
        if (!map || typeof name !== 'string') {
          return false;
        }
        var nestedSelector = map.get(name);
        if (!nestedSelector) {
          return false;
        }
        return nestedSelector.match(cssSelector, matchedCallback);
      };
      return SelectorMatcher;
    }());
    var SelectorListContext = (function() {
      function SelectorListContext(selectors) {
        this.selectors = selectors;
        this.alreadyMatched = false;
      }
      return SelectorListContext;
    }());
    var SelectorContext = (function() {
      function SelectorContext(selector, cbContext, listContext) {
        this.selector = selector;
        this.cbContext = cbContext;
        this.listContext = listContext;
        this.notSelectors = selector.notSelectors;
      }
      SelectorContext.prototype.finalize = function(cssSelector, callback) {
        var result = true;
        if (this.notSelectors.length > 0 && (!this.listContext || !this.listContext.alreadyMatched)) {
          var notMatcher = SelectorMatcher.createNotMatcher(this.notSelectors);
          result = !notMatcher.match(cssSelector, null);
        }
        if (result && callback && (!this.listContext || !this.listContext.alreadyMatched)) {
          if (this.listContext) {
            this.listContext.alreadyMatched = true;
          }
          callback(this.selector, this.cbContext);
        }
        return result;
      };
      return SelectorContext;
    }());
    var ERROR_COMPONENT_TYPE = 'ngComponentType';
    var CompileMetadataResolver = (function() {
      function CompileMetadataResolver(_config, _htmlParser, _ngModuleResolver, _directiveResolver, _pipeResolver, _summaryResolver, _schemaRegistry, _directiveNormalizer, _console, _staticSymbolCache, _reflector, _errorCollector) {
        this._config = _config;
        this._htmlParser = _htmlParser;
        this._ngModuleResolver = _ngModuleResolver;
        this._directiveResolver = _directiveResolver;
        this._pipeResolver = _pipeResolver;
        this._summaryResolver = _summaryResolver;
        this._schemaRegistry = _schemaRegistry;
        this._directiveNormalizer = _directiveNormalizer;
        this._console = _console;
        this._staticSymbolCache = _staticSymbolCache;
        this._reflector = _reflector;
        this._errorCollector = _errorCollector;
        this._nonNormalizedDirectiveCache = new Map();
        this._directiveCache = new Map();
        this._summaryCache = new Map();
        this._pipeCache = new Map();
        this._ngModuleCache = new Map();
        this._ngModuleOfTypes = new Map();
      }
      CompileMetadataResolver.prototype.getReflector = function() {
        return this._reflector;
      };
      CompileMetadataResolver.prototype.clearCacheFor = function(type) {
        var dirMeta = this._directiveCache.get(type);
        this._directiveCache.delete(type);
        this._nonNormalizedDirectiveCache.delete(type);
        this._summaryCache.delete(type);
        this._pipeCache.delete(type);
        this._ngModuleOfTypes.delete(type);
        this._ngModuleCache.clear();
        if (dirMeta) {
          this._directiveNormalizer.clearCacheFor(dirMeta);
        }
      };
      CompileMetadataResolver.prototype.clearCache = function() {
        this._directiveCache.clear();
        this._nonNormalizedDirectiveCache.clear();
        this._summaryCache.clear();
        this._pipeCache.clear();
        this._ngModuleCache.clear();
        this._ngModuleOfTypes.clear();
        this._directiveNormalizer.clearCache();
      };
      CompileMetadataResolver.prototype._createProxyClass = function(baseType, name) {
        var delegate = null;
        var proxyClass = (function() {
          if (!delegate) {
            throw new Error("Illegal state: Class " + name + " for type " + stringify(baseType) + " is not compiled yet!");
          }
          return delegate.apply(this, arguments);
        });
        proxyClass.setDelegate = function(d) {
          delegate = d;
          ((proxyClass)).prototype = d.prototype;
        };
        ((proxyClass)).overriddenName = name;
        return proxyClass;
      };
      CompileMetadataResolver.prototype.getGeneratedClass = function(dirType, name) {
        if (dirType instanceof StaticSymbol) {
          return this._staticSymbolCache.get(ngfactoryFilePath(dirType.filePath), name);
        } else {
          return this._createProxyClass(dirType, name);
        }
      };
      CompileMetadataResolver.prototype.getComponentViewClass = function(dirType) {
        return this.getGeneratedClass(dirType, viewClassName(dirType, 0));
      };
      CompileMetadataResolver.prototype.getHostComponentViewClass = function(dirType) {
        return this.getGeneratedClass(dirType, hostViewClassName(dirType));
      };
      CompileMetadataResolver.prototype.getHostComponentType = function(dirType) {
        var name = identifierName({reference: dirType}) + "_Host";
        if (dirType instanceof StaticSymbol) {
          return this._staticSymbolCache.get(dirType.filePath, name);
        } else {
          var HostClass = (function HostClass() {});
          HostClass.overriddenName = name;
          return HostClass;
        }
      };
      CompileMetadataResolver.prototype.getRendererType = function(dirType) {
        if (dirType instanceof StaticSymbol) {
          return this._staticSymbolCache.get(ngfactoryFilePath(dirType.filePath), rendererTypeName(dirType));
        } else {
          return ({});
        }
      };
      CompileMetadataResolver.prototype.getComponentFactory = function(selector, dirType, inputs, outputs) {
        if (dirType instanceof StaticSymbol) {
          return this._staticSymbolCache.get(ngfactoryFilePath(dirType.filePath), componentFactoryName(dirType));
        } else {
          var hostView = this.getHostComponentViewClass(dirType);
          var createComponentFactory = this._reflector.resolveExternalReference(Identifiers.createComponentFactory);
          return createComponentFactory(selector, dirType, (hostView), inputs, outputs, []);
        }
      };
      CompileMetadataResolver.prototype.initComponentFactory = function(factory, ngContentSelectors) {
        if (!(factory instanceof StaticSymbol)) {
          (_a = ((factory)).ngContentSelectors).push.apply(_a, ngContentSelectors);
        }
        var _a;
      };
      CompileMetadataResolver.prototype._loadSummary = function(type, kind) {
        var typeSummary = this._summaryCache.get(type);
        if (!typeSummary) {
          var summary = this._summaryResolver.resolveSummary(type);
          typeSummary = summary ? summary.type : null;
          this._summaryCache.set(type, typeSummary || null);
        }
        return typeSummary && typeSummary.summaryKind === kind ? typeSummary : null;
      };
      CompileMetadataResolver.prototype.getHostComponentMetadata = function(compMeta, hostViewType) {
        var hostType = this.getHostComponentType(compMeta.type.reference);
        if (!hostViewType) {
          hostViewType = this.getHostComponentViewClass(hostType);
        }
        var template = CssSelector.parse(((compMeta.selector)))[0].getMatchingElementTemplate();
        var templateUrl = '';
        var htmlAst = this._htmlParser.parse(template, templateUrl);
        return CompileDirectiveMetadata.create({
          isHost: true,
          type: {
            reference: hostType,
            diDeps: [],
            lifecycleHooks: []
          },
          template: new CompileTemplateMetadata({
            encapsulation: ViewEncapsulation.None,
            template: template,
            templateUrl: templateUrl,
            htmlAst: htmlAst,
            styles: [],
            styleUrls: [],
            ngContentSelectors: [],
            animations: [],
            isInline: true,
            externalStylesheets: [],
            interpolation: null,
            preserveWhitespaces: false
          }),
          exportAs: null,
          changeDetection: ChangeDetectionStrategy.Default,
          inputs: [],
          outputs: [],
          host: {},
          isComponent: true,
          selector: '*',
          providers: [],
          viewProviders: [],
          queries: [],
          guards: {},
          viewQueries: [],
          componentViewType: hostViewType,
          rendererType: ({
            id: '__Host__',
            encapsulation: ViewEncapsulation.None,
            styles: [],
            data: {}
          }),
          entryComponents: [],
          componentFactory: null
        });
      };
      CompileMetadataResolver.prototype.loadDirectiveMetadata = function(ngModuleType, directiveType, isSync) {
        var _this = this;
        if (this._directiveCache.has(directiveType)) {
          return null;
        }
        directiveType = resolveForwardRef(directiveType);
        var _a = ((this.getNonNormalizedDirectiveMetadata(directiveType))),
            annotation = _a.annotation,
            metadata = _a.metadata;
        var createDirectiveMetadata = function(templateMetadata) {
          var normalizedDirMeta = new CompileDirectiveMetadata({
            isHost: false,
            type: metadata.type,
            isComponent: metadata.isComponent,
            selector: metadata.selector,
            exportAs: metadata.exportAs,
            changeDetection: metadata.changeDetection,
            inputs: metadata.inputs,
            outputs: metadata.outputs,
            hostListeners: metadata.hostListeners,
            hostProperties: metadata.hostProperties,
            hostAttributes: metadata.hostAttributes,
            providers: metadata.providers,
            viewProviders: metadata.viewProviders,
            queries: metadata.queries,
            guards: metadata.guards,
            viewQueries: metadata.viewQueries,
            entryComponents: metadata.entryComponents,
            componentViewType: metadata.componentViewType,
            rendererType: metadata.rendererType,
            componentFactory: metadata.componentFactory,
            template: templateMetadata
          });
          if (templateMetadata) {
            _this.initComponentFactory(((metadata.componentFactory)), templateMetadata.ngContentSelectors);
          }
          _this._directiveCache.set(directiveType, normalizedDirMeta);
          _this._summaryCache.set(directiveType, normalizedDirMeta.toSummary());
          return null;
        };
        if (metadata.isComponent) {
          var template = ((metadata.template));
          var templateMeta = this._directiveNormalizer.normalizeTemplate({
            ngModuleType: ngModuleType,
            componentType: directiveType,
            moduleUrl: this._reflector.componentModuleUrl(directiveType, annotation),
            encapsulation: template.encapsulation,
            template: template.template,
            templateUrl: template.templateUrl,
            styles: template.styles,
            styleUrls: template.styleUrls,
            animations: template.animations,
            interpolation: template.interpolation,
            preserveWhitespaces: template.preserveWhitespaces
          });
          if (isPromise(templateMeta) && isSync) {
            this._reportError(componentStillLoadingError(directiveType), directiveType);
            return null;
          }
          return SyncAsync.then(templateMeta, createDirectiveMetadata);
        } else {
          createDirectiveMetadata(null);
          return null;
        }
      };
      CompileMetadataResolver.prototype.getNonNormalizedDirectiveMetadata = function(directiveType) {
        var _this = this;
        directiveType = resolveForwardRef(directiveType);
        if (!directiveType) {
          return null;
        }
        var cacheEntry = this._nonNormalizedDirectiveCache.get(directiveType);
        if (cacheEntry) {
          return cacheEntry;
        }
        var dirMeta = this._directiveResolver.resolve(directiveType, false);
        if (!dirMeta) {
          return null;
        }
        var nonNormalizedTemplateMetadata = ((undefined));
        if (createComponent.isTypeOf(dirMeta)) {
          var compMeta = (dirMeta);
          assertArrayOfStrings('styles', compMeta.styles);
          assertArrayOfStrings('styleUrls', compMeta.styleUrls);
          assertInterpolationSymbols('interpolation', compMeta.interpolation);
          var animations = compMeta.animations;
          nonNormalizedTemplateMetadata = new CompileTemplateMetadata({
            encapsulation: noUndefined(compMeta.encapsulation),
            template: noUndefined(compMeta.template),
            templateUrl: noUndefined(compMeta.templateUrl),
            htmlAst: null,
            styles: compMeta.styles || [],
            styleUrls: compMeta.styleUrls || [],
            animations: animations || [],
            interpolation: noUndefined(compMeta.interpolation),
            isInline: !!compMeta.template,
            externalStylesheets: [],
            ngContentSelectors: [],
            preserveWhitespaces: noUndefined(dirMeta.preserveWhitespaces)
          });
        }
        var changeDetectionStrategy = ((null));
        var viewProviders = [];
        var entryComponentMetadata = [];
        var selector = dirMeta.selector;
        if (createComponent.isTypeOf(dirMeta)) {
          var compMeta = (dirMeta);
          changeDetectionStrategy = ((compMeta.changeDetection));
          if (compMeta.viewProviders) {
            viewProviders = this._getProvidersMetadata(compMeta.viewProviders, entryComponentMetadata, "viewProviders for \"" + stringifyType(directiveType) + "\"", [], directiveType);
          }
          if (compMeta.entryComponents) {
            entryComponentMetadata = flattenAndDedupeArray(compMeta.entryComponents).map(function(type) {
              return ((_this._getEntryComponentMetadata(type)));
            }).concat(entryComponentMetadata);
          }
          if (!selector) {
            selector = this._schemaRegistry.getDefaultComponentElementName();
          }
        } else {
          if (!selector) {
            this._reportError(syntaxError("Directive " + stringifyType(directiveType) + " has no selector, please add it!"), directiveType);
            selector = 'error';
          }
        }
        var providers = [];
        if (dirMeta.providers != null) {
          providers = this._getProvidersMetadata(dirMeta.providers, entryComponentMetadata, "providers for \"" + stringifyType(directiveType) + "\"", [], directiveType);
        }
        var queries = [];
        var viewQueries = [];
        if (dirMeta.queries != null) {
          queries = this._getQueriesMetadata(dirMeta.queries, false, directiveType);
          viewQueries = this._getQueriesMetadata(dirMeta.queries, true, directiveType);
        }
        var metadata = CompileDirectiveMetadata.create({
          isHost: false,
          selector: selector,
          exportAs: noUndefined(dirMeta.exportAs),
          isComponent: !!nonNormalizedTemplateMetadata,
          type: this._getTypeMetadata(directiveType),
          template: nonNormalizedTemplateMetadata,
          changeDetection: changeDetectionStrategy,
          inputs: dirMeta.inputs || [],
          outputs: dirMeta.outputs || [],
          host: dirMeta.host || {},
          providers: providers || [],
          viewProviders: viewProviders || [],
          queries: queries || [],
          guards: dirMeta.guards || {},
          viewQueries: viewQueries || [],
          entryComponents: entryComponentMetadata,
          componentViewType: nonNormalizedTemplateMetadata ? this.getComponentViewClass(directiveType) : null,
          rendererType: nonNormalizedTemplateMetadata ? this.getRendererType(directiveType) : null,
          componentFactory: null
        });
        if (nonNormalizedTemplateMetadata) {
          metadata.componentFactory = this.getComponentFactory(selector, directiveType, metadata.inputs, metadata.outputs);
        }
        cacheEntry = {
          metadata: metadata,
          annotation: dirMeta
        };
        this._nonNormalizedDirectiveCache.set(directiveType, cacheEntry);
        return cacheEntry;
      };
      CompileMetadataResolver.prototype.getDirectiveMetadata = function(directiveType) {
        var dirMeta = ((this._directiveCache.get(directiveType)));
        if (!dirMeta) {
          this._reportError(syntaxError("Illegal state: getDirectiveMetadata can only be called after loadNgModuleDirectiveAndPipeMetadata for a module that declares it. Directive " + stringifyType(directiveType) + "."), directiveType);
        }
        return dirMeta;
      };
      CompileMetadataResolver.prototype.getDirectiveSummary = function(dirType) {
        var dirSummary = (this._loadSummary(dirType, CompileSummaryKind.Directive));
        if (!dirSummary) {
          this._reportError(syntaxError("Illegal state: Could not load the summary for directive " + stringifyType(dirType) + "."), dirType);
        }
        return dirSummary;
      };
      CompileMetadataResolver.prototype.isDirective = function(type) {
        return !!this._loadSummary(type, CompileSummaryKind.Directive) || this._directiveResolver.isDirective(type);
      };
      CompileMetadataResolver.prototype.isPipe = function(type) {
        return !!this._loadSummary(type, CompileSummaryKind.Pipe) || this._pipeResolver.isPipe(type);
      };
      CompileMetadataResolver.prototype.isNgModule = function(type) {
        return !!this._loadSummary(type, CompileSummaryKind.NgModule) || this._ngModuleResolver.isNgModule(type);
      };
      CompileMetadataResolver.prototype.getNgModuleSummary = function(moduleType, alreadyCollecting) {
        if (alreadyCollecting === void 0) {
          alreadyCollecting = null;
        }
        var moduleSummary = (this._loadSummary(moduleType, CompileSummaryKind.NgModule));
        if (!moduleSummary) {
          var moduleMeta = this.getNgModuleMetadata(moduleType, false, alreadyCollecting);
          moduleSummary = moduleMeta ? moduleMeta.toSummary() : null;
          if (moduleSummary) {
            this._summaryCache.set(moduleType, moduleSummary);
          }
        }
        return moduleSummary;
      };
      CompileMetadataResolver.prototype.loadNgModuleDirectiveAndPipeMetadata = function(moduleType, isSync, throwIfNotFound) {
        var _this = this;
        if (throwIfNotFound === void 0) {
          throwIfNotFound = true;
        }
        var ngModule = this.getNgModuleMetadata(moduleType, throwIfNotFound);
        var loading = [];
        if (ngModule) {
          ngModule.declaredDirectives.forEach(function(id) {
            var promise = _this.loadDirectiveMetadata(moduleType, id.reference, isSync);
            if (promise) {
              loading.push(promise);
            }
          });
          ngModule.declaredPipes.forEach(function(id) {
            return _this._loadPipeMetadata(id.reference);
          });
        }
        return Promise.all(loading);
      };
      CompileMetadataResolver.prototype.getNgModuleMetadata = function(moduleType, throwIfNotFound, alreadyCollecting) {
        var _this = this;
        if (throwIfNotFound === void 0) {
          throwIfNotFound = true;
        }
        if (alreadyCollecting === void 0) {
          alreadyCollecting = null;
        }
        moduleType = resolveForwardRef(moduleType);
        var compileMeta = this._ngModuleCache.get(moduleType);
        if (compileMeta) {
          return compileMeta;
        }
        var meta = this._ngModuleResolver.resolve(moduleType, throwIfNotFound);
        if (!meta) {
          return null;
        }
        var declaredDirectives = [];
        var exportedNonModuleIdentifiers = [];
        var declaredPipes = [];
        var importedModules = [];
        var exportedModules = [];
        var providers = [];
        var entryComponents = [];
        var bootstrapComponents = [];
        var schemas = [];
        if (meta.imports) {
          flattenAndDedupeArray(meta.imports).forEach(function(importedType) {
            var importedModuleType = ((undefined));
            if (isValidType(importedType)) {
              importedModuleType = importedType;
            } else if (importedType && importedType.ngModule) {
              var moduleWithProviders = importedType;
              importedModuleType = moduleWithProviders.ngModule;
              if (moduleWithProviders.providers) {
                providers.push.apply(providers, _this._getProvidersMetadata(moduleWithProviders.providers, entryComponents, "provider for the NgModule '" + stringifyType(importedModuleType) + "'", [], importedType));
              }
            }
            if (importedModuleType) {
              if (_this._checkSelfImport(moduleType, importedModuleType))
                return;
              if (!alreadyCollecting)
                alreadyCollecting = new Set();
              if (alreadyCollecting.has(importedModuleType)) {
                _this._reportError(syntaxError(_this._getTypeDescriptor(importedModuleType) + " '" + stringifyType(importedType) + "' is imported recursively by the module '" + stringifyType(moduleType) + "'."), moduleType);
                return;
              }
              alreadyCollecting.add(importedModuleType);
              var importedModuleSummary = _this.getNgModuleSummary(importedModuleType, alreadyCollecting);
              alreadyCollecting.delete(importedModuleType);
              if (!importedModuleSummary) {
                _this._reportError(syntaxError("Unexpected " + _this._getTypeDescriptor(importedType) + " '" + stringifyType(importedType) + "' imported by the module '" + stringifyType(moduleType) + "'. Please add a @NgModule annotation."), moduleType);
                return;
              }
              importedModules.push(importedModuleSummary);
            } else {
              _this._reportError(syntaxError("Unexpected value '" + stringifyType(importedType) + "' imported by the module '" + stringifyType(moduleType) + "'"), moduleType);
              return;
            }
          });
        }
        if (meta.exports) {
          flattenAndDedupeArray(meta.exports).forEach(function(exportedType) {
            if (!isValidType(exportedType)) {
              _this._reportError(syntaxError("Unexpected value '" + stringifyType(exportedType) + "' exported by the module '" + stringifyType(moduleType) + "'"), moduleType);
              return;
            }
            if (!alreadyCollecting)
              alreadyCollecting = new Set();
            if (alreadyCollecting.has(exportedType)) {
              _this._reportError(syntaxError(_this._getTypeDescriptor(exportedType) + " '" + stringify(exportedType) + "' is exported recursively by the module '" + stringifyType(moduleType) + "'"), moduleType);
              return;
            }
            alreadyCollecting.add(exportedType);
            var exportedModuleSummary = _this.getNgModuleSummary(exportedType, alreadyCollecting);
            alreadyCollecting.delete(exportedType);
            if (exportedModuleSummary) {
              exportedModules.push(exportedModuleSummary);
            } else {
              exportedNonModuleIdentifiers.push(_this._getIdentifierMetadata(exportedType));
            }
          });
        }
        var transitiveModule = this._getTransitiveNgModuleMetadata(importedModules, exportedModules);
        if (meta.declarations) {
          flattenAndDedupeArray(meta.declarations).forEach(function(declaredType) {
            if (!isValidType(declaredType)) {
              _this._reportError(syntaxError("Unexpected value '" + stringifyType(declaredType) + "' declared by the module '" + stringifyType(moduleType) + "'"), moduleType);
              return;
            }
            var declaredIdentifier = _this._getIdentifierMetadata(declaredType);
            if (_this.isDirective(declaredType)) {
              transitiveModule.addDirective(declaredIdentifier);
              declaredDirectives.push(declaredIdentifier);
              _this._addTypeToModule(declaredType, moduleType);
            } else if (_this.isPipe(declaredType)) {
              transitiveModule.addPipe(declaredIdentifier);
              transitiveModule.pipes.push(declaredIdentifier);
              declaredPipes.push(declaredIdentifier);
              _this._addTypeToModule(declaredType, moduleType);
            } else {
              _this._reportError(syntaxError("Unexpected " + _this._getTypeDescriptor(declaredType) + " '" + stringifyType(declaredType) + "' declared by the module '" + stringifyType(moduleType) + "'. Please add a @Pipe/@Directive/@Component annotation."), moduleType);
              return;
            }
          });
        }
        var exportedDirectives = [];
        var exportedPipes = [];
        exportedNonModuleIdentifiers.forEach(function(exportedId) {
          if (transitiveModule.directivesSet.has(exportedId.reference)) {
            exportedDirectives.push(exportedId);
            transitiveModule.addExportedDirective(exportedId);
          } else if (transitiveModule.pipesSet.has(exportedId.reference)) {
            exportedPipes.push(exportedId);
            transitiveModule.addExportedPipe(exportedId);
          } else {
            _this._reportError(syntaxError("Can't export " + _this._getTypeDescriptor(exportedId.reference) + " " + stringifyType(exportedId.reference) + " from " + stringifyType(moduleType) + " as it was neither declared nor imported!"), moduleType);
            return;
          }
        });
        if (meta.providers) {
          providers.push.apply(providers, this._getProvidersMetadata(meta.providers, entryComponents, "provider for the NgModule '" + stringifyType(moduleType) + "'", [], moduleType));
        }
        if (meta.entryComponents) {
          entryComponents.push.apply(entryComponents, flattenAndDedupeArray(meta.entryComponents).map(function(type) {
            return ((_this._getEntryComponentMetadata(type)));
          }));
        }
        if (meta.bootstrap) {
          flattenAndDedupeArray(meta.bootstrap).forEach(function(type) {
            if (!isValidType(type)) {
              _this._reportError(syntaxError("Unexpected value '" + stringifyType(type) + "' used in the bootstrap property of module '" + stringifyType(moduleType) + "'"), moduleType);
              return;
            }
            bootstrapComponents.push(_this._getIdentifierMetadata(type));
          });
        }
        entryComponents.push.apply(entryComponents, bootstrapComponents.map(function(type) {
          return ((_this._getEntryComponentMetadata(type.reference)));
        }));
        if (meta.schemas) {
          schemas.push.apply(schemas, flattenAndDedupeArray(meta.schemas));
        }
        compileMeta = new CompileNgModuleMetadata({
          type: this._getTypeMetadata(moduleType),
          providers: providers,
          entryComponents: entryComponents,
          bootstrapComponents: bootstrapComponents,
          schemas: schemas,
          declaredDirectives: declaredDirectives,
          exportedDirectives: exportedDirectives,
          declaredPipes: declaredPipes,
          exportedPipes: exportedPipes,
          importedModules: importedModules,
          exportedModules: exportedModules,
          transitiveModule: transitiveModule,
          id: meta.id || null
        });
        entryComponents.forEach(function(id) {
          return transitiveModule.addEntryComponent(id);
        });
        providers.forEach(function(provider) {
          return transitiveModule.addProvider(provider, ((compileMeta)).type);
        });
        transitiveModule.addModule(compileMeta.type);
        this._ngModuleCache.set(moduleType, compileMeta);
        return compileMeta;
      };
      CompileMetadataResolver.prototype._checkSelfImport = function(moduleType, importedModuleType) {
        if (moduleType === importedModuleType) {
          this._reportError(syntaxError("'" + stringifyType(moduleType) + "' module can't import itself"), moduleType);
          return true;
        }
        return false;
      };
      CompileMetadataResolver.prototype._getTypeDescriptor = function(type) {
        if (isValidType(type)) {
          if (this.isDirective(type)) {
            return 'directive';
          }
          if (this.isPipe(type)) {
            return 'pipe';
          }
          if (this.isNgModule(type)) {
            return 'module';
          }
        }
        if (((type)).provide) {
          return 'provider';
        }
        return 'value';
      };
      CompileMetadataResolver.prototype._addTypeToModule = function(type, moduleType) {
        var oldModule = this._ngModuleOfTypes.get(type);
        if (oldModule && oldModule !== moduleType) {
          this._reportError(syntaxError("Type " + stringifyType(type) + " is part of the declarations of 2 modules: " + stringifyType(oldModule) + " and " + stringifyType(moduleType) + "! " + ("Please consider moving " + stringifyType(type) + " to a higher module that imports " + stringifyType(oldModule) + " and " + stringifyType(moduleType) + ". ") + ("You can also create a new NgModule that exports and includes " + stringifyType(type) + " then import that NgModule in " + stringifyType(oldModule) + " and " + stringifyType(moduleType) + ".")), moduleType);
          return;
        }
        this._ngModuleOfTypes.set(type, moduleType);
      };
      CompileMetadataResolver.prototype._getTransitiveNgModuleMetadata = function(importedModules, exportedModules) {
        var result = new TransitiveCompileNgModuleMetadata();
        var modulesByToken = new Map();
        importedModules.concat(exportedModules).forEach(function(modSummary) {
          modSummary.modules.forEach(function(mod) {
            return result.addModule(mod);
          });
          modSummary.entryComponents.forEach(function(comp) {
            return result.addEntryComponent(comp);
          });
          var addedTokens = new Set();
          modSummary.providers.forEach(function(entry) {
            var tokenRef = tokenReference(entry.provider.token);
            var prevModules = modulesByToken.get(tokenRef);
            if (!prevModules) {
              prevModules = new Set();
              modulesByToken.set(tokenRef, prevModules);
            }
            var moduleRef = entry.module.reference;
            if (addedTokens.has(tokenRef) || !prevModules.has(moduleRef)) {
              prevModules.add(moduleRef);
              addedTokens.add(tokenRef);
              result.addProvider(entry.provider, entry.module);
            }
          });
        });
        exportedModules.forEach(function(modSummary) {
          modSummary.exportedDirectives.forEach(function(id) {
            return result.addExportedDirective(id);
          });
          modSummary.exportedPipes.forEach(function(id) {
            return result.addExportedPipe(id);
          });
        });
        importedModules.forEach(function(modSummary) {
          modSummary.exportedDirectives.forEach(function(id) {
            return result.addDirective(id);
          });
          modSummary.exportedPipes.forEach(function(id) {
            return result.addPipe(id);
          });
        });
        return result;
      };
      CompileMetadataResolver.prototype._getIdentifierMetadata = function(type) {
        type = resolveForwardRef(type);
        return {reference: type};
      };
      CompileMetadataResolver.prototype.isInjectable = function(type) {
        var annotations = this._reflector.annotations(type);
        return annotations.some(function(ann) {
          return createInjectable.isTypeOf(ann);
        });
      };
      CompileMetadataResolver.prototype.getInjectableSummary = function(type) {
        return {
          summaryKind: CompileSummaryKind.Injectable,
          type: this._getTypeMetadata(type, null, false)
        };
      };
      CompileMetadataResolver.prototype._getInjectableMetadata = function(type, dependencies) {
        if (dependencies === void 0) {
          dependencies = null;
        }
        var typeSummary = this._loadSummary(type, CompileSummaryKind.Injectable);
        if (typeSummary) {
          return typeSummary.type;
        }
        return this._getTypeMetadata(type, dependencies);
      };
      CompileMetadataResolver.prototype._getTypeMetadata = function(type, dependencies, throwOnUnknownDeps) {
        if (dependencies === void 0) {
          dependencies = null;
        }
        if (throwOnUnknownDeps === void 0) {
          throwOnUnknownDeps = true;
        }
        var identifier = this._getIdentifierMetadata(type);
        return {
          reference: identifier.reference,
          diDeps: this._getDependenciesMetadata(identifier.reference, dependencies, throwOnUnknownDeps),
          lifecycleHooks: getAllLifecycleHooks(this._reflector, identifier.reference)
        };
      };
      CompileMetadataResolver.prototype._getFactoryMetadata = function(factory, dependencies) {
        if (dependencies === void 0) {
          dependencies = null;
        }
        factory = resolveForwardRef(factory);
        return {
          reference: factory,
          diDeps: this._getDependenciesMetadata(factory, dependencies)
        };
      };
      CompileMetadataResolver.prototype.getPipeMetadata = function(pipeType) {
        var pipeMeta = this._pipeCache.get(pipeType);
        if (!pipeMeta) {
          this._reportError(syntaxError("Illegal state: getPipeMetadata can only be called after loadNgModuleDirectiveAndPipeMetadata for a module that declares it. Pipe " + stringifyType(pipeType) + "."), pipeType);
        }
        return pipeMeta || null;
      };
      CompileMetadataResolver.prototype.getPipeSummary = function(pipeType) {
        var pipeSummary = (this._loadSummary(pipeType, CompileSummaryKind.Pipe));
        if (!pipeSummary) {
          this._reportError(syntaxError("Illegal state: Could not load the summary for pipe " + stringifyType(pipeType) + "."), pipeType);
        }
        return pipeSummary;
      };
      CompileMetadataResolver.prototype.getOrLoadPipeMetadata = function(pipeType) {
        var pipeMeta = this._pipeCache.get(pipeType);
        if (!pipeMeta) {
          pipeMeta = this._loadPipeMetadata(pipeType);
        }
        return pipeMeta;
      };
      CompileMetadataResolver.prototype._loadPipeMetadata = function(pipeType) {
        pipeType = resolveForwardRef(pipeType);
        var pipeAnnotation = ((this._pipeResolver.resolve(pipeType)));
        var pipeMeta = new CompilePipeMetadata({
          type: this._getTypeMetadata(pipeType),
          name: pipeAnnotation.name,
          pure: !!pipeAnnotation.pure
        });
        this._pipeCache.set(pipeType, pipeMeta);
        this._summaryCache.set(pipeType, pipeMeta.toSummary());
        return pipeMeta;
      };
      CompileMetadataResolver.prototype._getDependenciesMetadata = function(typeOrFunc, dependencies, throwOnUnknownDeps) {
        var _this = this;
        if (throwOnUnknownDeps === void 0) {
          throwOnUnknownDeps = true;
        }
        var hasUnknownDeps = false;
        var params = dependencies || this._reflector.parameters(typeOrFunc) || [];
        var dependenciesMetadata = params.map(function(param) {
          var isAttribute = false;
          var isHost = false;
          var isSelf = false;
          var isSkipSelf = false;
          var isOptional = false;
          var token = null;
          if (Array.isArray(param)) {
            param.forEach(function(paramEntry) {
              if (createHost.isTypeOf(paramEntry)) {
                isHost = true;
              } else if (createSelf.isTypeOf(paramEntry)) {
                isSelf = true;
              } else if (createSkipSelf.isTypeOf(paramEntry)) {
                isSkipSelf = true;
              } else if (createOptional.isTypeOf(paramEntry)) {
                isOptional = true;
              } else if (createAttribute.isTypeOf(paramEntry)) {
                isAttribute = true;
                token = paramEntry.attributeName;
              } else if (createInject.isTypeOf(paramEntry)) {
                token = paramEntry.token;
              } else if (createInjectionToken.isTypeOf(paramEntry) || paramEntry instanceof StaticSymbol) {
                token = paramEntry;
              } else if (isValidType(paramEntry) && token == null) {
                token = paramEntry;
              }
            });
          } else {
            token = param;
          }
          if (token == null) {
            hasUnknownDeps = true;
            return ((null));
          }
          return {
            isAttribute: isAttribute,
            isHost: isHost,
            isSelf: isSelf,
            isSkipSelf: isSkipSelf,
            isOptional: isOptional,
            token: _this._getTokenMetadata(token)
          };
        });
        if (hasUnknownDeps) {
          var depsTokens = dependenciesMetadata.map(function(dep) {
            return dep ? stringifyType(dep.token) : '?';
          }).join(', ');
          var message = "Can't resolve all parameters for " + stringifyType(typeOrFunc) + ": (" + depsTokens + ").";
          if (throwOnUnknownDeps || this._config.strictInjectionParameters) {
            this._reportError(syntaxError(message), typeOrFunc);
          } else {
            this._console.warn("Warning: " + message + " This will become an error in Angular v6.x");
          }
        }
        return dependenciesMetadata;
      };
      CompileMetadataResolver.prototype._getTokenMetadata = function(token) {
        token = resolveForwardRef(token);
        var compileToken;
        if (typeof token === 'string') {
          compileToken = {value: token};
        } else {
          compileToken = {identifier: {reference: token}};
        }
        return compileToken;
      };
      CompileMetadataResolver.prototype._getProvidersMetadata = function(providers, targetEntryComponents, debugInfo, compileProviders, type) {
        var _this = this;
        if (compileProviders === void 0) {
          compileProviders = [];
        }
        providers.forEach(function(provider, providerIdx) {
          if (Array.isArray(provider)) {
            _this._getProvidersMetadata(provider, targetEntryComponents, debugInfo, compileProviders);
          } else {
            provider = resolveForwardRef(provider);
            var providerMeta = ((undefined));
            if (provider && typeof provider === 'object' && provider.hasOwnProperty('provide')) {
              _this._validateProvider(provider);
              providerMeta = new ProviderMeta(provider.provide, provider);
            } else if (isValidType(provider)) {
              providerMeta = new ProviderMeta(provider, {useClass: provider});
            } else if (provider === void 0) {
              _this._reportError(syntaxError("Encountered undefined provider! Usually this means you have a circular dependencies (might be caused by using 'barrel' index.ts files."));
              return;
            } else {
              var providersInfo = ((providers.reduce(function(soFar, seenProvider, seenProviderIdx) {
                if (seenProviderIdx < providerIdx) {
                  soFar.push("" + stringifyType(seenProvider));
                } else if (seenProviderIdx == providerIdx) {
                  soFar.push("?" + stringifyType(seenProvider) + "?");
                } else if (seenProviderIdx == providerIdx + 1) {
                  soFar.push('...');
                }
                return soFar;
              }, []))).join(', ');
              _this._reportError(syntaxError("Invalid " + (debugInfo ? debugInfo : 'provider') + " - only instances of Provider and Type are allowed, got: [" + providersInfo + "]"), type);
              return;
            }
            if (providerMeta.token === _this._reflector.resolveExternalReference(Identifiers.ANALYZE_FOR_ENTRY_COMPONENTS)) {
              targetEntryComponents.push.apply(targetEntryComponents, _this._getEntryComponentsFromProvider(providerMeta, type));
            } else {
              compileProviders.push(_this.getProviderMetadata(providerMeta));
            }
          }
        });
        return compileProviders;
      };
      CompileMetadataResolver.prototype._validateProvider = function(provider) {
        if (provider.hasOwnProperty('useClass') && provider.useClass == null) {
          this._reportError(syntaxError("Invalid provider for " + stringifyType(provider.provide) + ". useClass cannot be " + provider.useClass + ".\n           Usually it happens when:\n           1. There's a circular dependency (might be caused by using index.ts (barrel) files).\n           2. Class was used before it was declared. Use forwardRef in this case."));
        }
      };
      CompileMetadataResolver.prototype._getEntryComponentsFromProvider = function(provider, type) {
        var _this = this;
        var components = [];
        var collectedIdentifiers = [];
        if (provider.useFactory || provider.useExisting || provider.useClass) {
          this._reportError(syntaxError("The ANALYZE_FOR_ENTRY_COMPONENTS token only supports useValue!"), type);
          return [];
        }
        if (!provider.multi) {
          this._reportError(syntaxError("The ANALYZE_FOR_ENTRY_COMPONENTS token only supports 'multi = true'!"), type);
          return [];
        }
        extractIdentifiers(provider.useValue, collectedIdentifiers);
        collectedIdentifiers.forEach(function(identifier) {
          var entry = _this._getEntryComponentMetadata(identifier.reference, false);
          if (entry) {
            components.push(entry);
          }
        });
        return components;
      };
      CompileMetadataResolver.prototype._getEntryComponentMetadata = function(dirType, throwIfNotFound) {
        if (throwIfNotFound === void 0) {
          throwIfNotFound = true;
        }
        var dirMeta = this.getNonNormalizedDirectiveMetadata(dirType);
        if (dirMeta && dirMeta.metadata.isComponent) {
          return {
            componentType: dirType,
            componentFactory: ((dirMeta.metadata.componentFactory))
          };
        }
        var dirSummary = (this._loadSummary(dirType, CompileSummaryKind.Directive));
        if (dirSummary && dirSummary.isComponent) {
          return {
            componentType: dirType,
            componentFactory: ((dirSummary.componentFactory))
          };
        }
        if (throwIfNotFound) {
          throw syntaxError(dirType.name + " cannot be used as an entry component.");
        }
        return null;
      };
      CompileMetadataResolver.prototype.getProviderMetadata = function(provider) {
        var compileDeps = ((undefined));
        var compileTypeMetadata = ((null));
        var compileFactoryMetadata = ((null));
        var token = this._getTokenMetadata(provider.token);
        if (provider.useClass) {
          compileTypeMetadata = this._getInjectableMetadata(provider.useClass, provider.dependencies);
          compileDeps = compileTypeMetadata.diDeps;
          if (provider.token === provider.useClass) {
            token = {identifier: compileTypeMetadata};
          }
        } else if (provider.useFactory) {
          compileFactoryMetadata = this._getFactoryMetadata(provider.useFactory, provider.dependencies);
          compileDeps = compileFactoryMetadata.diDeps;
        }
        return {
          token: token,
          useClass: compileTypeMetadata,
          useValue: provider.useValue,
          useFactory: compileFactoryMetadata,
          useExisting: provider.useExisting ? this._getTokenMetadata(provider.useExisting) : undefined,
          deps: compileDeps,
          multi: provider.multi
        };
      };
      CompileMetadataResolver.prototype._getQueriesMetadata = function(queries, isViewQuery, directiveType) {
        var _this = this;
        var res = [];
        Object.keys(queries).forEach(function(propertyName) {
          var query = queries[propertyName];
          if (query.isViewQuery === isViewQuery) {
            res.push(_this._getQueryMetadata(query, propertyName, directiveType));
          }
        });
        return res;
      };
      CompileMetadataResolver.prototype._queryVarBindings = function(selector) {
        return selector.split(/\s*,\s*/);
      };
      CompileMetadataResolver.prototype._getQueryMetadata = function(q, propertyName, typeOrFunc) {
        var _this = this;
        var selectors;
        if (typeof q.selector === 'string') {
          selectors = this._queryVarBindings(q.selector).map(function(varName) {
            return _this._getTokenMetadata(varName);
          });
        } else {
          if (!q.selector) {
            this._reportError(syntaxError("Can't construct a query for the property \"" + propertyName + "\" of \"" + stringifyType(typeOrFunc) + "\" since the query selector wasn't defined."), typeOrFunc);
            selectors = [];
          } else {
            selectors = [this._getTokenMetadata(q.selector)];
          }
        }
        return {
          selectors: selectors,
          first: q.first,
          descendants: q.descendants,
          propertyName: propertyName,
          read: q.read ? this._getTokenMetadata(q.read) : ((null))
        };
      };
      CompileMetadataResolver.prototype._reportError = function(error, type, otherType) {
        if (this._errorCollector) {
          this._errorCollector(error, type);
          if (otherType) {
            this._errorCollector(error, otherType);
          }
        } else {
          throw error;
        }
      };
      return CompileMetadataResolver;
    }());
    function flattenArray(tree, out) {
      if (out === void 0) {
        out = [];
      }
      if (tree) {
        for (var i = 0; i < tree.length; i++) {
          var item = resolveForwardRef(tree[i]);
          if (Array.isArray(item)) {
            flattenArray(item, out);
          } else {
            out.push(item);
          }
        }
      }
      return out;
    }
    function dedupeArray(array) {
      if (array) {
        return Array.from(new Set(array));
      }
      return [];
    }
    function flattenAndDedupeArray(tree) {
      return dedupeArray(flattenArray(tree));
    }
    function isValidType(value) {
      return (value instanceof StaticSymbol) || (value instanceof Type);
    }
    function extractIdentifiers(value, targetIdentifiers) {
      visitValue(value, new _CompileValueConverter(), targetIdentifiers);
    }
    var _CompileValueConverter = (function(_super) {
      __extends(_CompileValueConverter, _super);
      function _CompileValueConverter() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      _CompileValueConverter.prototype.visitOther = function(value, targetIdentifiers) {
        targetIdentifiers.push({reference: value});
      };
      return _CompileValueConverter;
    }(ValueTransformer));
    function stringifyType(type) {
      if (type instanceof StaticSymbol) {
        return type.name + " in " + type.filePath;
      } else {
        return stringify(type);
      }
    }
    function componentStillLoadingError(compType) {
      var error = Error("Can't compile synchronously as " + stringify(compType) + " is still being loaded!");
      ((error))[ERROR_COMPONENT_TYPE] = compType;
      return error;
    }
    var TypeModifier = {Const: 0};
    TypeModifier[TypeModifier.Const] = "Const";
    var Type$1 = (function() {
      function Type(modifiers) {
        if (modifiers === void 0) {
          modifiers = null;
        }
        this.modifiers = modifiers;
        if (!modifiers) {
          this.modifiers = [];
        }
      }
      Type.prototype.hasModifier = function(modifier) {
        return ((this.modifiers)).indexOf(modifier) !== -1;
      };
      return Type;
    }());
    var BuiltinTypeName = {
      Dynamic: 0,
      Bool: 1,
      String: 2,
      Int: 3,
      Number: 4,
      Function: 5,
      Inferred: 6
    };
    BuiltinTypeName[BuiltinTypeName.Dynamic] = "Dynamic";
    BuiltinTypeName[BuiltinTypeName.Bool] = "Bool";
    BuiltinTypeName[BuiltinTypeName.String] = "String";
    BuiltinTypeName[BuiltinTypeName.Int] = "Int";
    BuiltinTypeName[BuiltinTypeName.Number] = "Number";
    BuiltinTypeName[BuiltinTypeName.Function] = "Function";
    BuiltinTypeName[BuiltinTypeName.Inferred] = "Inferred";
    var BuiltinType = (function(_super) {
      __extends(BuiltinType, _super);
      function BuiltinType(name, modifiers) {
        if (modifiers === void 0) {
          modifiers = null;
        }
        var _this = _super.call(this, modifiers) || this;
        _this.name = name;
        return _this;
      }
      BuiltinType.prototype.visitType = function(visitor, context) {
        return visitor.visitBuiltintType(this, context);
      };
      return BuiltinType;
    }(Type$1));
    var ExpressionType = (function(_super) {
      __extends(ExpressionType, _super);
      function ExpressionType(value, modifiers) {
        if (modifiers === void 0) {
          modifiers = null;
        }
        var _this = _super.call(this, modifiers) || this;
        _this.value = value;
        return _this;
      }
      ExpressionType.prototype.visitType = function(visitor, context) {
        return visitor.visitExpressionType(this, context);
      };
      return ExpressionType;
    }(Type$1));
    var ArrayType = (function(_super) {
      __extends(ArrayType, _super);
      function ArrayType(of, modifiers) {
        if (modifiers === void 0) {
          modifiers = null;
        }
        var _this = _super.call(this, modifiers) || this;
        _this.of = of;
        return _this;
      }
      ArrayType.prototype.visitType = function(visitor, context) {
        return visitor.visitArrayType(this, context);
      };
      return ArrayType;
    }(Type$1));
    var MapType = (function(_super) {
      __extends(MapType, _super);
      function MapType(valueType, modifiers) {
        if (modifiers === void 0) {
          modifiers = null;
        }
        var _this = _super.call(this, modifiers) || this;
        _this.valueType = valueType || null;
        return _this;
      }
      MapType.prototype.visitType = function(visitor, context) {
        return visitor.visitMapType(this, context);
      };
      return MapType;
    }(Type$1));
    var DYNAMIC_TYPE = new BuiltinType(BuiltinTypeName.Dynamic);
    var INFERRED_TYPE = new BuiltinType(BuiltinTypeName.Inferred);
    var BOOL_TYPE = new BuiltinType(BuiltinTypeName.Bool);
    var INT_TYPE = new BuiltinType(BuiltinTypeName.Int);
    var NUMBER_TYPE = new BuiltinType(BuiltinTypeName.Number);
    var STRING_TYPE = new BuiltinType(BuiltinTypeName.String);
    var FUNCTION_TYPE = new BuiltinType(BuiltinTypeName.Function);
    var BinaryOperator = {
      Equals: 0,
      NotEquals: 1,
      Identical: 2,
      NotIdentical: 3,
      Minus: 4,
      Plus: 5,
      Divide: 6,
      Multiply: 7,
      Modulo: 8,
      And: 9,
      Or: 10,
      Lower: 11,
      LowerEquals: 12,
      Bigger: 13,
      BiggerEquals: 14
    };
    BinaryOperator[BinaryOperator.Equals] = "Equals";
    BinaryOperator[BinaryOperator.NotEquals] = "NotEquals";
    BinaryOperator[BinaryOperator.Identical] = "Identical";
    BinaryOperator[BinaryOperator.NotIdentical] = "NotIdentical";
    BinaryOperator[BinaryOperator.Minus] = "Minus";
    BinaryOperator[BinaryOperator.Plus] = "Plus";
    BinaryOperator[BinaryOperator.Divide] = "Divide";
    BinaryOperator[BinaryOperator.Multiply] = "Multiply";
    BinaryOperator[BinaryOperator.Modulo] = "Modulo";
    BinaryOperator[BinaryOperator.And] = "And";
    BinaryOperator[BinaryOperator.Or] = "Or";
    BinaryOperator[BinaryOperator.Lower] = "Lower";
    BinaryOperator[BinaryOperator.LowerEquals] = "LowerEquals";
    BinaryOperator[BinaryOperator.Bigger] = "Bigger";
    BinaryOperator[BinaryOperator.BiggerEquals] = "BiggerEquals";
    function nullSafeIsEquivalent(base, other) {
      if (base == null || other == null) {
        return base == other;
      }
      return base.isEquivalent(other);
    }
    function areAllEquivalent(base, other) {
      var len = base.length;
      if (len !== other.length) {
        return false;
      }
      for (var i = 0; i < len; i++) {
        if (!base[i].isEquivalent(other[i])) {
          return false;
        }
      }
      return true;
    }
    var Expression = (function() {
      function Expression(type, sourceSpan) {
        this.type = type || null;
        this.sourceSpan = sourceSpan || null;
      }
      Expression.prototype.prop = function(name, sourceSpan) {
        return new ReadPropExpr(this, name, null, sourceSpan);
      };
      Expression.prototype.key = function(index, type, sourceSpan) {
        return new ReadKeyExpr(this, index, type, sourceSpan);
      };
      Expression.prototype.callMethod = function(name, params, sourceSpan) {
        return new InvokeMethodExpr(this, name, params, null, sourceSpan);
      };
      Expression.prototype.callFn = function(params, sourceSpan) {
        return new InvokeFunctionExpr(this, params, null, sourceSpan);
      };
      Expression.prototype.instantiate = function(params, type, sourceSpan) {
        return new InstantiateExpr(this, params, type, sourceSpan);
      };
      Expression.prototype.conditional = function(trueCase, falseCase, sourceSpan) {
        if (falseCase === void 0) {
          falseCase = null;
        }
        return new ConditionalExpr(this, trueCase, falseCase, null, sourceSpan);
      };
      Expression.prototype.equals = function(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Equals, this, rhs, null, sourceSpan);
      };
      Expression.prototype.notEquals = function(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.NotEquals, this, rhs, null, sourceSpan);
      };
      Expression.prototype.identical = function(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Identical, this, rhs, null, sourceSpan);
      };
      Expression.prototype.notIdentical = function(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.NotIdentical, this, rhs, null, sourceSpan);
      };
      Expression.prototype.minus = function(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Minus, this, rhs, null, sourceSpan);
      };
      Expression.prototype.plus = function(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Plus, this, rhs, null, sourceSpan);
      };
      Expression.prototype.divide = function(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Divide, this, rhs, null, sourceSpan);
      };
      Expression.prototype.multiply = function(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Multiply, this, rhs, null, sourceSpan);
      };
      Expression.prototype.modulo = function(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Modulo, this, rhs, null, sourceSpan);
      };
      Expression.prototype.and = function(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.And, this, rhs, null, sourceSpan);
      };
      Expression.prototype.or = function(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Or, this, rhs, null, sourceSpan);
      };
      Expression.prototype.lower = function(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Lower, this, rhs, null, sourceSpan);
      };
      Expression.prototype.lowerEquals = function(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.LowerEquals, this, rhs, null, sourceSpan);
      };
      Expression.prototype.bigger = function(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Bigger, this, rhs, null, sourceSpan);
      };
      Expression.prototype.biggerEquals = function(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.BiggerEquals, this, rhs, null, sourceSpan);
      };
      Expression.prototype.isBlank = function(sourceSpan) {
        return this.equals(TYPED_NULL_EXPR, sourceSpan);
      };
      Expression.prototype.cast = function(type, sourceSpan) {
        return new CastExpr(this, type, sourceSpan);
      };
      Expression.prototype.toStmt = function() {
        return new ExpressionStatement(this, null);
      };
      return Expression;
    }());
    var BuiltinVar = {
      This: 0,
      Super: 1,
      CatchError: 2,
      CatchStack: 3
    };
    BuiltinVar[BuiltinVar.This] = "This";
    BuiltinVar[BuiltinVar.Super] = "Super";
    BuiltinVar[BuiltinVar.CatchError] = "CatchError";
    BuiltinVar[BuiltinVar.CatchStack] = "CatchStack";
    var ReadVarExpr = (function(_super) {
      __extends(ReadVarExpr, _super);
      function ReadVarExpr(name, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        if (typeof name === 'string') {
          _this.name = name;
          _this.builtin = null;
        } else {
          _this.name = null;
          _this.builtin = (name);
        }
        return _this;
      }
      ReadVarExpr.prototype.isEquivalent = function(e) {
        return e instanceof ReadVarExpr && this.name === e.name && this.builtin === e.builtin;
      };
      ReadVarExpr.prototype.visitExpression = function(visitor, context) {
        return visitor.visitReadVarExpr(this, context);
      };
      ReadVarExpr.prototype.set = function(value) {
        if (!this.name) {
          throw new Error("Built in variable " + this.builtin + " can not be assigned to.");
        }
        return new WriteVarExpr(this.name, value, null, this.sourceSpan);
      };
      return ReadVarExpr;
    }(Expression));
    var WriteVarExpr = (function(_super) {
      __extends(WriteVarExpr, _super);
      function WriteVarExpr(name, value, type, sourceSpan) {
        var _this = _super.call(this, type || value.type, sourceSpan) || this;
        _this.name = name;
        _this.value = value;
        return _this;
      }
      WriteVarExpr.prototype.isEquivalent = function(e) {
        return e instanceof WriteVarExpr && this.name === e.name && this.value.isEquivalent(e.value);
      };
      WriteVarExpr.prototype.visitExpression = function(visitor, context) {
        return visitor.visitWriteVarExpr(this, context);
      };
      WriteVarExpr.prototype.toDeclStmt = function(type, modifiers) {
        return new DeclareVarStmt(this.name, this.value, type, modifiers, this.sourceSpan);
      };
      return WriteVarExpr;
    }(Expression));
    var WriteKeyExpr = (function(_super) {
      __extends(WriteKeyExpr, _super);
      function WriteKeyExpr(receiver, index, value, type, sourceSpan) {
        var _this = _super.call(this, type || value.type, sourceSpan) || this;
        _this.receiver = receiver;
        _this.index = index;
        _this.value = value;
        return _this;
      }
      WriteKeyExpr.prototype.isEquivalent = function(e) {
        return e instanceof WriteKeyExpr && this.receiver.isEquivalent(e.receiver) && this.index.isEquivalent(e.index) && this.value.isEquivalent(e.value);
      };
      WriteKeyExpr.prototype.visitExpression = function(visitor, context) {
        return visitor.visitWriteKeyExpr(this, context);
      };
      return WriteKeyExpr;
    }(Expression));
    var WritePropExpr = (function(_super) {
      __extends(WritePropExpr, _super);
      function WritePropExpr(receiver, name, value, type, sourceSpan) {
        var _this = _super.call(this, type || value.type, sourceSpan) || this;
        _this.receiver = receiver;
        _this.name = name;
        _this.value = value;
        return _this;
      }
      WritePropExpr.prototype.isEquivalent = function(e) {
        return e instanceof WritePropExpr && this.receiver.isEquivalent(e.receiver) && this.name === e.name && this.value.isEquivalent(e.value);
      };
      WritePropExpr.prototype.visitExpression = function(visitor, context) {
        return visitor.visitWritePropExpr(this, context);
      };
      return WritePropExpr;
    }(Expression));
    var BuiltinMethod = {
      ConcatArray: 0,
      SubscribeObservable: 1,
      Bind: 2
    };
    BuiltinMethod[BuiltinMethod.ConcatArray] = "ConcatArray";
    BuiltinMethod[BuiltinMethod.SubscribeObservable] = "SubscribeObservable";
    BuiltinMethod[BuiltinMethod.Bind] = "Bind";
    var InvokeMethodExpr = (function(_super) {
      __extends(InvokeMethodExpr, _super);
      function InvokeMethodExpr(receiver, method, args, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.receiver = receiver;
        _this.args = args;
        if (typeof method === 'string') {
          _this.name = method;
          _this.builtin = null;
        } else {
          _this.name = null;
          _this.builtin = (method);
        }
        return _this;
      }
      InvokeMethodExpr.prototype.isEquivalent = function(e) {
        return e instanceof InvokeMethodExpr && this.receiver.isEquivalent(e.receiver) && this.name === e.name && this.builtin === e.builtin && areAllEquivalent(this.args, e.args);
      };
      InvokeMethodExpr.prototype.visitExpression = function(visitor, context) {
        return visitor.visitInvokeMethodExpr(this, context);
      };
      return InvokeMethodExpr;
    }(Expression));
    var InvokeFunctionExpr = (function(_super) {
      __extends(InvokeFunctionExpr, _super);
      function InvokeFunctionExpr(fn, args, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.fn = fn;
        _this.args = args;
        return _this;
      }
      InvokeFunctionExpr.prototype.isEquivalent = function(e) {
        return e instanceof InvokeFunctionExpr && this.fn.isEquivalent(e.fn) && areAllEquivalent(this.args, e.args);
      };
      InvokeFunctionExpr.prototype.visitExpression = function(visitor, context) {
        return visitor.visitInvokeFunctionExpr(this, context);
      };
      return InvokeFunctionExpr;
    }(Expression));
    var InstantiateExpr = (function(_super) {
      __extends(InstantiateExpr, _super);
      function InstantiateExpr(classExpr, args, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.classExpr = classExpr;
        _this.args = args;
        return _this;
      }
      InstantiateExpr.prototype.isEquivalent = function(e) {
        return e instanceof InstantiateExpr && this.classExpr.isEquivalent(e.classExpr) && areAllEquivalent(this.args, e.args);
      };
      InstantiateExpr.prototype.visitExpression = function(visitor, context) {
        return visitor.visitInstantiateExpr(this, context);
      };
      return InstantiateExpr;
    }(Expression));
    var LiteralExpr = (function(_super) {
      __extends(LiteralExpr, _super);
      function LiteralExpr(value, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.value = value;
        return _this;
      }
      LiteralExpr.prototype.isEquivalent = function(e) {
        return e instanceof LiteralExpr && this.value === e.value;
      };
      LiteralExpr.prototype.visitExpression = function(visitor, context) {
        return visitor.visitLiteralExpr(this, context);
      };
      return LiteralExpr;
    }(Expression));
    var ExternalExpr = (function(_super) {
      __extends(ExternalExpr, _super);
      function ExternalExpr(value, type, typeParams, sourceSpan) {
        if (typeParams === void 0) {
          typeParams = null;
        }
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.value = value;
        _this.typeParams = typeParams;
        return _this;
      }
      ExternalExpr.prototype.isEquivalent = function(e) {
        return e instanceof ExternalExpr && this.value.name === e.value.name && this.value.moduleName === e.value.moduleName && this.value.runtime === e.value.runtime;
      };
      ExternalExpr.prototype.visitExpression = function(visitor, context) {
        return visitor.visitExternalExpr(this, context);
      };
      return ExternalExpr;
    }(Expression));
    var ExternalReference = (function() {
      function ExternalReference(moduleName, name, runtime) {
        this.moduleName = moduleName;
        this.name = name;
        this.runtime = runtime;
      }
      return ExternalReference;
    }());
    var ConditionalExpr = (function(_super) {
      __extends(ConditionalExpr, _super);
      function ConditionalExpr(condition, trueCase, falseCase, type, sourceSpan) {
        if (falseCase === void 0) {
          falseCase = null;
        }
        var _this = _super.call(this, type || trueCase.type, sourceSpan) || this;
        _this.condition = condition;
        _this.falseCase = falseCase;
        _this.trueCase = trueCase;
        return _this;
      }
      ConditionalExpr.prototype.isEquivalent = function(e) {
        return e instanceof ConditionalExpr && this.condition.isEquivalent(e.condition) && this.trueCase.isEquivalent(e.trueCase) && nullSafeIsEquivalent(this.falseCase, e.falseCase);
      };
      ConditionalExpr.prototype.visitExpression = function(visitor, context) {
        return visitor.visitConditionalExpr(this, context);
      };
      return ConditionalExpr;
    }(Expression));
    var NotExpr = (function(_super) {
      __extends(NotExpr, _super);
      function NotExpr(condition, sourceSpan) {
        var _this = _super.call(this, BOOL_TYPE, sourceSpan) || this;
        _this.condition = condition;
        return _this;
      }
      NotExpr.prototype.isEquivalent = function(e) {
        return e instanceof NotExpr && this.condition.isEquivalent(e.condition);
      };
      NotExpr.prototype.visitExpression = function(visitor, context) {
        return visitor.visitNotExpr(this, context);
      };
      return NotExpr;
    }(Expression));
    var AssertNotNull = (function(_super) {
      __extends(AssertNotNull, _super);
      function AssertNotNull(condition, sourceSpan) {
        var _this = _super.call(this, condition.type, sourceSpan) || this;
        _this.condition = condition;
        return _this;
      }
      AssertNotNull.prototype.isEquivalent = function(e) {
        return e instanceof AssertNotNull && this.condition.isEquivalent(e.condition);
      };
      AssertNotNull.prototype.visitExpression = function(visitor, context) {
        return visitor.visitAssertNotNullExpr(this, context);
      };
      return AssertNotNull;
    }(Expression));
    var CastExpr = (function(_super) {
      __extends(CastExpr, _super);
      function CastExpr(value, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.value = value;
        return _this;
      }
      CastExpr.prototype.isEquivalent = function(e) {
        return e instanceof CastExpr && this.value.isEquivalent(e.value);
      };
      CastExpr.prototype.visitExpression = function(visitor, context) {
        return visitor.visitCastExpr(this, context);
      };
      return CastExpr;
    }(Expression));
    var FnParam = (function() {
      function FnParam(name, type) {
        if (type === void 0) {
          type = null;
        }
        this.name = name;
        this.type = type;
      }
      FnParam.prototype.isEquivalent = function(param) {
        return this.name === param.name;
      };
      return FnParam;
    }());
    var FunctionExpr = (function(_super) {
      __extends(FunctionExpr, _super);
      function FunctionExpr(params, statements, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.params = params;
        _this.statements = statements;
        return _this;
      }
      FunctionExpr.prototype.isEquivalent = function(e) {
        return e instanceof FunctionExpr && areAllEquivalent(this.params, e.params) && areAllEquivalent(this.statements, e.statements);
      };
      FunctionExpr.prototype.visitExpression = function(visitor, context) {
        return visitor.visitFunctionExpr(this, context);
      };
      FunctionExpr.prototype.toDeclStmt = function(name, modifiers) {
        if (modifiers === void 0) {
          modifiers = null;
        }
        return new DeclareFunctionStmt(name, this.params, this.statements, this.type, modifiers, this.sourceSpan);
      };
      return FunctionExpr;
    }(Expression));
    var BinaryOperatorExpr = (function(_super) {
      __extends(BinaryOperatorExpr, _super);
      function BinaryOperatorExpr(operator, lhs, rhs, type, sourceSpan) {
        var _this = _super.call(this, type || lhs.type, sourceSpan) || this;
        _this.operator = operator;
        _this.rhs = rhs;
        _this.lhs = lhs;
        return _this;
      }
      BinaryOperatorExpr.prototype.isEquivalent = function(e) {
        return e instanceof BinaryOperatorExpr && this.operator === e.operator && this.lhs.isEquivalent(e.lhs) && this.rhs.isEquivalent(e.rhs);
      };
      BinaryOperatorExpr.prototype.visitExpression = function(visitor, context) {
        return visitor.visitBinaryOperatorExpr(this, context);
      };
      return BinaryOperatorExpr;
    }(Expression));
    var ReadPropExpr = (function(_super) {
      __extends(ReadPropExpr, _super);
      function ReadPropExpr(receiver, name, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.receiver = receiver;
        _this.name = name;
        return _this;
      }
      ReadPropExpr.prototype.isEquivalent = function(e) {
        return e instanceof ReadPropExpr && this.receiver.isEquivalent(e.receiver) && this.name === e.name;
      };
      ReadPropExpr.prototype.visitExpression = function(visitor, context) {
        return visitor.visitReadPropExpr(this, context);
      };
      ReadPropExpr.prototype.set = function(value) {
        return new WritePropExpr(this.receiver, this.name, value, null, this.sourceSpan);
      };
      return ReadPropExpr;
    }(Expression));
    var ReadKeyExpr = (function(_super) {
      __extends(ReadKeyExpr, _super);
      function ReadKeyExpr(receiver, index, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.receiver = receiver;
        _this.index = index;
        return _this;
      }
      ReadKeyExpr.prototype.isEquivalent = function(e) {
        return e instanceof ReadKeyExpr && this.receiver.isEquivalent(e.receiver) && this.index.isEquivalent(e.index);
      };
      ReadKeyExpr.prototype.visitExpression = function(visitor, context) {
        return visitor.visitReadKeyExpr(this, context);
      };
      ReadKeyExpr.prototype.set = function(value) {
        return new WriteKeyExpr(this.receiver, this.index, value, null, this.sourceSpan);
      };
      return ReadKeyExpr;
    }(Expression));
    var LiteralArrayExpr = (function(_super) {
      __extends(LiteralArrayExpr, _super);
      function LiteralArrayExpr(entries, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.entries = entries;
        return _this;
      }
      LiteralArrayExpr.prototype.isEquivalent = function(e) {
        return e instanceof LiteralArrayExpr && areAllEquivalent(this.entries, e.entries);
      };
      LiteralArrayExpr.prototype.visitExpression = function(visitor, context) {
        return visitor.visitLiteralArrayExpr(this, context);
      };
      return LiteralArrayExpr;
    }(Expression));
    var LiteralMapEntry = (function() {
      function LiteralMapEntry(key, value, quoted) {
        this.key = key;
        this.value = value;
        this.quoted = quoted;
      }
      LiteralMapEntry.prototype.isEquivalent = function(e) {
        return this.key === e.key && this.value.isEquivalent(e.value);
      };
      return LiteralMapEntry;
    }());
    var LiteralMapExpr = (function(_super) {
      __extends(LiteralMapExpr, _super);
      function LiteralMapExpr(entries, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.entries = entries;
        _this.valueType = null;
        if (type) {
          _this.valueType = type.valueType;
        }
        return _this;
      }
      LiteralMapExpr.prototype.isEquivalent = function(e) {
        return e instanceof LiteralMapExpr && areAllEquivalent(this.entries, e.entries);
      };
      LiteralMapExpr.prototype.visitExpression = function(visitor, context) {
        return visitor.visitLiteralMapExpr(this, context);
      };
      return LiteralMapExpr;
    }(Expression));
    var CommaExpr = (function(_super) {
      __extends(CommaExpr, _super);
      function CommaExpr(parts, sourceSpan) {
        var _this = _super.call(this, parts[parts.length - 1].type, sourceSpan) || this;
        _this.parts = parts;
        return _this;
      }
      CommaExpr.prototype.isEquivalent = function(e) {
        return e instanceof CommaExpr && areAllEquivalent(this.parts, e.parts);
      };
      CommaExpr.prototype.visitExpression = function(visitor, context) {
        return visitor.visitCommaExpr(this, context);
      };
      return CommaExpr;
    }(Expression));
    var THIS_EXPR = new ReadVarExpr(BuiltinVar.This, null, null);
    var SUPER_EXPR = new ReadVarExpr(BuiltinVar.Super, null, null);
    var CATCH_ERROR_VAR = new ReadVarExpr(BuiltinVar.CatchError, null, null);
    var CATCH_STACK_VAR = new ReadVarExpr(BuiltinVar.CatchStack, null, null);
    var NULL_EXPR = new LiteralExpr(null, null, null);
    var TYPED_NULL_EXPR = new LiteralExpr(null, INFERRED_TYPE, null);
    var StmtModifier = {
      Final: 0,
      Private: 1,
      Exported: 2
    };
    StmtModifier[StmtModifier.Final] = "Final";
    StmtModifier[StmtModifier.Private] = "Private";
    StmtModifier[StmtModifier.Exported] = "Exported";
    var Statement = (function() {
      function Statement(modifiers, sourceSpan) {
        this.modifiers = modifiers || [];
        this.sourceSpan = sourceSpan || null;
      }
      Statement.prototype.hasModifier = function(modifier) {
        return ((this.modifiers)).indexOf(modifier) !== -1;
      };
      return Statement;
    }());
    var DeclareVarStmt = (function(_super) {
      __extends(DeclareVarStmt, _super);
      function DeclareVarStmt(name, value, type, modifiers, sourceSpan) {
        if (modifiers === void 0) {
          modifiers = null;
        }
        var _this = _super.call(this, modifiers, sourceSpan) || this;
        _this.name = name;
        _this.value = value;
        _this.type = type || value.type;
        return _this;
      }
      DeclareVarStmt.prototype.isEquivalent = function(stmt) {
        return stmt instanceof DeclareVarStmt && this.name === stmt.name && this.value.isEquivalent(stmt.value);
      };
      DeclareVarStmt.prototype.visitStatement = function(visitor, context) {
        return visitor.visitDeclareVarStmt(this, context);
      };
      return DeclareVarStmt;
    }(Statement));
    var DeclareFunctionStmt = (function(_super) {
      __extends(DeclareFunctionStmt, _super);
      function DeclareFunctionStmt(name, params, statements, type, modifiers, sourceSpan) {
        if (modifiers === void 0) {
          modifiers = null;
        }
        var _this = _super.call(this, modifiers, sourceSpan) || this;
        _this.name = name;
        _this.params = params;
        _this.statements = statements;
        _this.type = type || null;
        return _this;
      }
      DeclareFunctionStmt.prototype.isEquivalent = function(stmt) {
        return stmt instanceof DeclareFunctionStmt && areAllEquivalent(this.params, stmt.params) && areAllEquivalent(this.statements, stmt.statements);
      };
      DeclareFunctionStmt.prototype.visitStatement = function(visitor, context) {
        return visitor.visitDeclareFunctionStmt(this, context);
      };
      return DeclareFunctionStmt;
    }(Statement));
    var ExpressionStatement = (function(_super) {
      __extends(ExpressionStatement, _super);
      function ExpressionStatement(expr, sourceSpan) {
        var _this = _super.call(this, null, sourceSpan) || this;
        _this.expr = expr;
        return _this;
      }
      ExpressionStatement.prototype.isEquivalent = function(stmt) {
        return stmt instanceof ExpressionStatement && this.expr.isEquivalent(stmt.expr);
      };
      ExpressionStatement.prototype.visitStatement = function(visitor, context) {
        return visitor.visitExpressionStmt(this, context);
      };
      return ExpressionStatement;
    }(Statement));
    var ReturnStatement = (function(_super) {
      __extends(ReturnStatement, _super);
      function ReturnStatement(value, sourceSpan) {
        var _this = _super.call(this, null, sourceSpan) || this;
        _this.value = value;
        return _this;
      }
      ReturnStatement.prototype.isEquivalent = function(stmt) {
        return stmt instanceof ReturnStatement && this.value.isEquivalent(stmt.value);
      };
      ReturnStatement.prototype.visitStatement = function(visitor, context) {
        return visitor.visitReturnStmt(this, context);
      };
      return ReturnStatement;
    }(Statement));
    var AbstractClassPart = (function() {
      function AbstractClassPart(type, modifiers) {
        this.modifiers = modifiers;
        if (!modifiers) {
          this.modifiers = [];
        }
        this.type = type || null;
      }
      AbstractClassPart.prototype.hasModifier = function(modifier) {
        return ((this.modifiers)).indexOf(modifier) !== -1;
      };
      return AbstractClassPart;
    }());
    var ClassField = (function(_super) {
      __extends(ClassField, _super);
      function ClassField(name, type, modifiers) {
        if (modifiers === void 0) {
          modifiers = null;
        }
        var _this = _super.call(this, type, modifiers) || this;
        _this.name = name;
        return _this;
      }
      ClassField.prototype.isEquivalent = function(f) {
        return this.name === f.name;
      };
      return ClassField;
    }(AbstractClassPart));
    var ClassMethod = (function(_super) {
      __extends(ClassMethod, _super);
      function ClassMethod(name, params, body, type, modifiers) {
        if (modifiers === void 0) {
          modifiers = null;
        }
        var _this = _super.call(this, type, modifiers) || this;
        _this.name = name;
        _this.params = params;
        _this.body = body;
        return _this;
      }
      ClassMethod.prototype.isEquivalent = function(m) {
        return this.name === m.name && areAllEquivalent(this.body, m.body);
      };
      return ClassMethod;
    }(AbstractClassPart));
    var ClassGetter = (function(_super) {
      __extends(ClassGetter, _super);
      function ClassGetter(name, body, type, modifiers) {
        if (modifiers === void 0) {
          modifiers = null;
        }
        var _this = _super.call(this, type, modifiers) || this;
        _this.name = name;
        _this.body = body;
        return _this;
      }
      ClassGetter.prototype.isEquivalent = function(m) {
        return this.name === m.name && areAllEquivalent(this.body, m.body);
      };
      return ClassGetter;
    }(AbstractClassPart));
    var ClassStmt = (function(_super) {
      __extends(ClassStmt, _super);
      function ClassStmt(name, parent, fields, getters, constructorMethod, methods, modifiers, sourceSpan) {
        if (modifiers === void 0) {
          modifiers = null;
        }
        var _this = _super.call(this, modifiers, sourceSpan) || this;
        _this.name = name;
        _this.parent = parent;
        _this.fields = fields;
        _this.getters = getters;
        _this.constructorMethod = constructorMethod;
        _this.methods = methods;
        return _this;
      }
      ClassStmt.prototype.isEquivalent = function(stmt) {
        return stmt instanceof ClassStmt && this.name === stmt.name && nullSafeIsEquivalent(this.parent, stmt.parent) && areAllEquivalent(this.fields, stmt.fields) && areAllEquivalent(this.getters, stmt.getters) && this.constructorMethod.isEquivalent(stmt.constructorMethod) && areAllEquivalent(this.methods, stmt.methods);
      };
      ClassStmt.prototype.visitStatement = function(visitor, context) {
        return visitor.visitDeclareClassStmt(this, context);
      };
      return ClassStmt;
    }(Statement));
    var IfStmt = (function(_super) {
      __extends(IfStmt, _super);
      function IfStmt(condition, trueCase, falseCase, sourceSpan) {
        if (falseCase === void 0) {
          falseCase = [];
        }
        var _this = _super.call(this, null, sourceSpan) || this;
        _this.condition = condition;
        _this.trueCase = trueCase;
        _this.falseCase = falseCase;
        return _this;
      }
      IfStmt.prototype.isEquivalent = function(stmt) {
        return stmt instanceof IfStmt && this.condition.isEquivalent(stmt.condition) && areAllEquivalent(this.trueCase, stmt.trueCase) && areAllEquivalent(this.falseCase, stmt.falseCase);
      };
      IfStmt.prototype.visitStatement = function(visitor, context) {
        return visitor.visitIfStmt(this, context);
      };
      return IfStmt;
    }(Statement));
    var CommentStmt = (function(_super) {
      __extends(CommentStmt, _super);
      function CommentStmt(comment, sourceSpan) {
        var _this = _super.call(this, null, sourceSpan) || this;
        _this.comment = comment;
        return _this;
      }
      CommentStmt.prototype.isEquivalent = function(stmt) {
        return stmt instanceof CommentStmt;
      };
      CommentStmt.prototype.visitStatement = function(visitor, context) {
        return visitor.visitCommentStmt(this, context);
      };
      return CommentStmt;
    }(Statement));
    var TryCatchStmt = (function(_super) {
      __extends(TryCatchStmt, _super);
      function TryCatchStmt(bodyStmts, catchStmts, sourceSpan) {
        var _this = _super.call(this, null, sourceSpan) || this;
        _this.bodyStmts = bodyStmts;
        _this.catchStmts = catchStmts;
        return _this;
      }
      TryCatchStmt.prototype.isEquivalent = function(stmt) {
        return stmt instanceof TryCatchStmt && areAllEquivalent(this.bodyStmts, stmt.bodyStmts) && areAllEquivalent(this.catchStmts, stmt.catchStmts);
      };
      TryCatchStmt.prototype.visitStatement = function(visitor, context) {
        return visitor.visitTryCatchStmt(this, context);
      };
      return TryCatchStmt;
    }(Statement));
    var ThrowStmt = (function(_super) {
      __extends(ThrowStmt, _super);
      function ThrowStmt(error, sourceSpan) {
        var _this = _super.call(this, null, sourceSpan) || this;
        _this.error = error;
        return _this;
      }
      ThrowStmt.prototype.isEquivalent = function(stmt) {
        return stmt instanceof TryCatchStmt && this.error.isEquivalent(stmt.error);
      };
      ThrowStmt.prototype.visitStatement = function(visitor, context) {
        return visitor.visitThrowStmt(this, context);
      };
      return ThrowStmt;
    }(Statement));
    var AstTransformer$1 = (function() {
      function AstTransformer() {}
      AstTransformer.prototype.transformExpr = function(expr, context) {
        return expr;
      };
      AstTransformer.prototype.transformStmt = function(stmt, context) {
        return stmt;
      };
      AstTransformer.prototype.visitReadVarExpr = function(ast, context) {
        return this.transformExpr(ast, context);
      };
      AstTransformer.prototype.visitWriteVarExpr = function(expr, context) {
        return this.transformExpr(new WriteVarExpr(expr.name, expr.value.visitExpression(this, context), expr.type, expr.sourceSpan), context);
      };
      AstTransformer.prototype.visitWriteKeyExpr = function(expr, context) {
        return this.transformExpr(new WriteKeyExpr(expr.receiver.visitExpression(this, context), expr.index.visitExpression(this, context), expr.value.visitExpression(this, context), expr.type, expr.sourceSpan), context);
      };
      AstTransformer.prototype.visitWritePropExpr = function(expr, context) {
        return this.transformExpr(new WritePropExpr(expr.receiver.visitExpression(this, context), expr.name, expr.value.visitExpression(this, context), expr.type, expr.sourceSpan), context);
      };
      AstTransformer.prototype.visitInvokeMethodExpr = function(ast, context) {
        var method = ast.builtin || ast.name;
        return this.transformExpr(new InvokeMethodExpr(ast.receiver.visitExpression(this, context), ((method)), this.visitAllExpressions(ast.args, context), ast.type, ast.sourceSpan), context);
      };
      AstTransformer.prototype.visitInvokeFunctionExpr = function(ast, context) {
        return this.transformExpr(new InvokeFunctionExpr(ast.fn.visitExpression(this, context), this.visitAllExpressions(ast.args, context), ast.type, ast.sourceSpan), context);
      };
      AstTransformer.prototype.visitInstantiateExpr = function(ast, context) {
        return this.transformExpr(new InstantiateExpr(ast.classExpr.visitExpression(this, context), this.visitAllExpressions(ast.args, context), ast.type, ast.sourceSpan), context);
      };
      AstTransformer.prototype.visitLiteralExpr = function(ast, context) {
        return this.transformExpr(ast, context);
      };
      AstTransformer.prototype.visitExternalExpr = function(ast, context) {
        return this.transformExpr(ast, context);
      };
      AstTransformer.prototype.visitConditionalExpr = function(ast, context) {
        return this.transformExpr(new ConditionalExpr(ast.condition.visitExpression(this, context), ast.trueCase.visitExpression(this, context), ((ast.falseCase)).visitExpression(this, context), ast.type, ast.sourceSpan), context);
      };
      AstTransformer.prototype.visitNotExpr = function(ast, context) {
        return this.transformExpr(new NotExpr(ast.condition.visitExpression(this, context), ast.sourceSpan), context);
      };
      AstTransformer.prototype.visitAssertNotNullExpr = function(ast, context) {
        return this.transformExpr(new AssertNotNull(ast.condition.visitExpression(this, context), ast.sourceSpan), context);
      };
      AstTransformer.prototype.visitCastExpr = function(ast, context) {
        return this.transformExpr(new CastExpr(ast.value.visitExpression(this, context), ast.type, ast.sourceSpan), context);
      };
      AstTransformer.prototype.visitFunctionExpr = function(ast, context) {
        return this.transformExpr(new FunctionExpr(ast.params, this.visitAllStatements(ast.statements, context), ast.type, ast.sourceSpan), context);
      };
      AstTransformer.prototype.visitBinaryOperatorExpr = function(ast, context) {
        return this.transformExpr(new BinaryOperatorExpr(ast.operator, ast.lhs.visitExpression(this, context), ast.rhs.visitExpression(this, context), ast.type, ast.sourceSpan), context);
      };
      AstTransformer.prototype.visitReadPropExpr = function(ast, context) {
        return this.transformExpr(new ReadPropExpr(ast.receiver.visitExpression(this, context), ast.name, ast.type, ast.sourceSpan), context);
      };
      AstTransformer.prototype.visitReadKeyExpr = function(ast, context) {
        return this.transformExpr(new ReadKeyExpr(ast.receiver.visitExpression(this, context), ast.index.visitExpression(this, context), ast.type, ast.sourceSpan), context);
      };
      AstTransformer.prototype.visitLiteralArrayExpr = function(ast, context) {
        return this.transformExpr(new LiteralArrayExpr(this.visitAllExpressions(ast.entries, context), ast.type, ast.sourceSpan), context);
      };
      AstTransformer.prototype.visitLiteralMapExpr = function(ast, context) {
        var _this = this;
        var entries = ast.entries.map(function(entry) {
          return new LiteralMapEntry(entry.key, entry.value.visitExpression(_this, context), entry.quoted);
        });
        var mapType = new MapType(ast.valueType, null);
        return this.transformExpr(new LiteralMapExpr(entries, mapType, ast.sourceSpan), context);
      };
      AstTransformer.prototype.visitCommaExpr = function(ast, context) {
        return this.transformExpr(new CommaExpr(this.visitAllExpressions(ast.parts, context), ast.sourceSpan), context);
      };
      AstTransformer.prototype.visitAllExpressions = function(exprs, context) {
        var _this = this;
        return exprs.map(function(expr) {
          return expr.visitExpression(_this, context);
        });
      };
      AstTransformer.prototype.visitDeclareVarStmt = function(stmt, context) {
        return this.transformStmt(new DeclareVarStmt(stmt.name, stmt.value.visitExpression(this, context), stmt.type, stmt.modifiers, stmt.sourceSpan), context);
      };
      AstTransformer.prototype.visitDeclareFunctionStmt = function(stmt, context) {
        return this.transformStmt(new DeclareFunctionStmt(stmt.name, stmt.params, this.visitAllStatements(stmt.statements, context), stmt.type, stmt.modifiers, stmt.sourceSpan), context);
      };
      AstTransformer.prototype.visitExpressionStmt = function(stmt, context) {
        return this.transformStmt(new ExpressionStatement(stmt.expr.visitExpression(this, context), stmt.sourceSpan), context);
      };
      AstTransformer.prototype.visitReturnStmt = function(stmt, context) {
        return this.transformStmt(new ReturnStatement(stmt.value.visitExpression(this, context), stmt.sourceSpan), context);
      };
      AstTransformer.prototype.visitDeclareClassStmt = function(stmt, context) {
        var _this = this;
        var parent = ((stmt.parent)).visitExpression(this, context);
        var getters = stmt.getters.map(function(getter) {
          return new ClassGetter(getter.name, _this.visitAllStatements(getter.body, context), getter.type, getter.modifiers);
        });
        var ctorMethod = stmt.constructorMethod && new ClassMethod(stmt.constructorMethod.name, stmt.constructorMethod.params, this.visitAllStatements(stmt.constructorMethod.body, context), stmt.constructorMethod.type, stmt.constructorMethod.modifiers);
        var methods = stmt.methods.map(function(method) {
          return new ClassMethod(method.name, method.params, _this.visitAllStatements(method.body, context), method.type, method.modifiers);
        });
        return this.transformStmt(new ClassStmt(stmt.name, parent, stmt.fields, getters, ctorMethod, methods, stmt.modifiers, stmt.sourceSpan), context);
      };
      AstTransformer.prototype.visitIfStmt = function(stmt, context) {
        return this.transformStmt(new IfStmt(stmt.condition.visitExpression(this, context), this.visitAllStatements(stmt.trueCase, context), this.visitAllStatements(stmt.falseCase, context), stmt.sourceSpan), context);
      };
      AstTransformer.prototype.visitTryCatchStmt = function(stmt, context) {
        return this.transformStmt(new TryCatchStmt(this.visitAllStatements(stmt.bodyStmts, context), this.visitAllStatements(stmt.catchStmts, context), stmt.sourceSpan), context);
      };
      AstTransformer.prototype.visitThrowStmt = function(stmt, context) {
        return this.transformStmt(new ThrowStmt(stmt.error.visitExpression(this, context), stmt.sourceSpan), context);
      };
      AstTransformer.prototype.visitCommentStmt = function(stmt, context) {
        return this.transformStmt(stmt, context);
      };
      AstTransformer.prototype.visitAllStatements = function(stmts, context) {
        var _this = this;
        return stmts.map(function(stmt) {
          return stmt.visitStatement(_this, context);
        });
      };
      return AstTransformer;
    }());
    var RecursiveAstVisitor$1 = (function() {
      function RecursiveAstVisitor() {}
      RecursiveAstVisitor.prototype.visitType = function(ast, context) {
        return ast;
      };
      RecursiveAstVisitor.prototype.visitExpression = function(ast, context) {
        if (ast.type) {
          ast.type.visitType(this, context);
        }
        return ast;
      };
      RecursiveAstVisitor.prototype.visitBuiltintType = function(type, context) {
        return this.visitType(type, context);
      };
      RecursiveAstVisitor.prototype.visitExpressionType = function(type, context) {
        type.value.visitExpression(this, context);
        return this.visitType(type, context);
      };
      RecursiveAstVisitor.prototype.visitArrayType = function(type, context) {
        return this.visitType(type, context);
      };
      RecursiveAstVisitor.prototype.visitMapType = function(type, context) {
        return this.visitType(type, context);
      };
      RecursiveAstVisitor.prototype.visitReadVarExpr = function(ast, context) {
        return this.visitExpression(ast, context);
      };
      RecursiveAstVisitor.prototype.visitWriteVarExpr = function(ast, context) {
        ast.value.visitExpression(this, context);
        return this.visitExpression(ast, context);
      };
      RecursiveAstVisitor.prototype.visitWriteKeyExpr = function(ast, context) {
        ast.receiver.visitExpression(this, context);
        ast.index.visitExpression(this, context);
        ast.value.visitExpression(this, context);
        return this.visitExpression(ast, context);
      };
      RecursiveAstVisitor.prototype.visitWritePropExpr = function(ast, context) {
        ast.receiver.visitExpression(this, context);
        ast.value.visitExpression(this, context);
        return this.visitExpression(ast, context);
      };
      RecursiveAstVisitor.prototype.visitInvokeMethodExpr = function(ast, context) {
        ast.receiver.visitExpression(this, context);
        this.visitAllExpressions(ast.args, context);
        return this.visitExpression(ast, context);
      };
      RecursiveAstVisitor.prototype.visitInvokeFunctionExpr = function(ast, context) {
        ast.fn.visitExpression(this, context);
        this.visitAllExpressions(ast.args, context);
        return this.visitExpression(ast, context);
      };
      RecursiveAstVisitor.prototype.visitInstantiateExpr = function(ast, context) {
        ast.classExpr.visitExpression(this, context);
        this.visitAllExpressions(ast.args, context);
        return this.visitExpression(ast, context);
      };
      RecursiveAstVisitor.prototype.visitLiteralExpr = function(ast, context) {
        return this.visitExpression(ast, context);
      };
      RecursiveAstVisitor.prototype.visitExternalExpr = function(ast, context) {
        var _this = this;
        if (ast.typeParams) {
          ast.typeParams.forEach(function(type) {
            return type.visitType(_this, context);
          });
        }
        return this.visitExpression(ast, context);
      };
      RecursiveAstVisitor.prototype.visitConditionalExpr = function(ast, context) {
        ast.condition.visitExpression(this, context);
        ast.trueCase.visitExpression(this, context);
        ((ast.falseCase)).visitExpression(this, context);
        return this.visitExpression(ast, context);
      };
      RecursiveAstVisitor.prototype.visitNotExpr = function(ast, context) {
        ast.condition.visitExpression(this, context);
        return this.visitExpression(ast, context);
      };
      RecursiveAstVisitor.prototype.visitAssertNotNullExpr = function(ast, context) {
        ast.condition.visitExpression(this, context);
        return this.visitExpression(ast, context);
      };
      RecursiveAstVisitor.prototype.visitCastExpr = function(ast, context) {
        ast.value.visitExpression(this, context);
        return this.visitExpression(ast, context);
      };
      RecursiveAstVisitor.prototype.visitFunctionExpr = function(ast, context) {
        this.visitAllStatements(ast.statements, context);
        return this.visitExpression(ast, context);
      };
      RecursiveAstVisitor.prototype.visitBinaryOperatorExpr = function(ast, context) {
        ast.lhs.visitExpression(this, context);
        ast.rhs.visitExpression(this, context);
        return this.visitExpression(ast, context);
      };
      RecursiveAstVisitor.prototype.visitReadPropExpr = function(ast, context) {
        ast.receiver.visitExpression(this, context);
        return this.visitExpression(ast, context);
      };
      RecursiveAstVisitor.prototype.visitReadKeyExpr = function(ast, context) {
        ast.receiver.visitExpression(this, context);
        ast.index.visitExpression(this, context);
        return this.visitExpression(ast, context);
      };
      RecursiveAstVisitor.prototype.visitLiteralArrayExpr = function(ast, context) {
        this.visitAllExpressions(ast.entries, context);
        return this.visitExpression(ast, context);
      };
      RecursiveAstVisitor.prototype.visitLiteralMapExpr = function(ast, context) {
        var _this = this;
        ast.entries.forEach(function(entry) {
          return entry.value.visitExpression(_this, context);
        });
        return this.visitExpression(ast, context);
      };
      RecursiveAstVisitor.prototype.visitCommaExpr = function(ast, context) {
        this.visitAllExpressions(ast.parts, context);
        return this.visitExpression(ast, context);
      };
      RecursiveAstVisitor.prototype.visitAllExpressions = function(exprs, context) {
        var _this = this;
        exprs.forEach(function(expr) {
          return expr.visitExpression(_this, context);
        });
      };
      RecursiveAstVisitor.prototype.visitDeclareVarStmt = function(stmt, context) {
        stmt.value.visitExpression(this, context);
        if (stmt.type) {
          stmt.type.visitType(this, context);
        }
        return stmt;
      };
      RecursiveAstVisitor.prototype.visitDeclareFunctionStmt = function(stmt, context) {
        this.visitAllStatements(stmt.statements, context);
        if (stmt.type) {
          stmt.type.visitType(this, context);
        }
        return stmt;
      };
      RecursiveAstVisitor.prototype.visitExpressionStmt = function(stmt, context) {
        stmt.expr.visitExpression(this, context);
        return stmt;
      };
      RecursiveAstVisitor.prototype.visitReturnStmt = function(stmt, context) {
        stmt.value.visitExpression(this, context);
        return stmt;
      };
      RecursiveAstVisitor.prototype.visitDeclareClassStmt = function(stmt, context) {
        var _this = this;
        ((stmt.parent)).visitExpression(this, context);
        stmt.getters.forEach(function(getter) {
          return _this.visitAllStatements(getter.body, context);
        });
        if (stmt.constructorMethod) {
          this.visitAllStatements(stmt.constructorMethod.body, context);
        }
        stmt.methods.forEach(function(method) {
          return _this.visitAllStatements(method.body, context);
        });
        return stmt;
      };
      RecursiveAstVisitor.prototype.visitIfStmt = function(stmt, context) {
        stmt.condition.visitExpression(this, context);
        this.visitAllStatements(stmt.trueCase, context);
        this.visitAllStatements(stmt.falseCase, context);
        return stmt;
      };
      RecursiveAstVisitor.prototype.visitTryCatchStmt = function(stmt, context) {
        this.visitAllStatements(stmt.bodyStmts, context);
        this.visitAllStatements(stmt.catchStmts, context);
        return stmt;
      };
      RecursiveAstVisitor.prototype.visitThrowStmt = function(stmt, context) {
        stmt.error.visitExpression(this, context);
        return stmt;
      };
      RecursiveAstVisitor.prototype.visitCommentStmt = function(stmt, context) {
        return stmt;
      };
      RecursiveAstVisitor.prototype.visitAllStatements = function(stmts, context) {
        var _this = this;
        stmts.forEach(function(stmt) {
          return stmt.visitStatement(_this, context);
        });
      };
      return RecursiveAstVisitor;
    }());
    function findReadVarNames(stmts) {
      var visitor = new _ReadVarVisitor();
      visitor.visitAllStatements(stmts, null);
      return visitor.varNames;
    }
    var _ReadVarVisitor = (function(_super) {
      __extends(_ReadVarVisitor, _super);
      function _ReadVarVisitor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.varNames = new Set();
        return _this;
      }
      _ReadVarVisitor.prototype.visitDeclareFunctionStmt = function(stmt, context) {
        return stmt;
      };
      _ReadVarVisitor.prototype.visitDeclareClassStmt = function(stmt, context) {
        return stmt;
      };
      _ReadVarVisitor.prototype.visitReadVarExpr = function(ast, context) {
        if (ast.name) {
          this.varNames.add(ast.name);
        }
        return null;
      };
      return _ReadVarVisitor;
    }(RecursiveAstVisitor$1));
    function collectExternalReferences(stmts) {
      var visitor = new _FindExternalReferencesVisitor();
      visitor.visitAllStatements(stmts, null);
      return visitor.externalReferences;
    }
    var _FindExternalReferencesVisitor = (function(_super) {
      __extends(_FindExternalReferencesVisitor, _super);
      function _FindExternalReferencesVisitor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.externalReferences = [];
        return _this;
      }
      _FindExternalReferencesVisitor.prototype.visitExternalExpr = function(e, context) {
        this.externalReferences.push(e.value);
        return _super.prototype.visitExternalExpr.call(this, e, context);
      };
      return _FindExternalReferencesVisitor;
    }(RecursiveAstVisitor$1));
    function applySourceSpanToStatementIfNeeded(stmt, sourceSpan) {
      if (!sourceSpan) {
        return stmt;
      }
      var transformer = new _ApplySourceSpanTransformer(sourceSpan);
      return stmt.visitStatement(transformer, null);
    }
    function applySourceSpanToExpressionIfNeeded(expr, sourceSpan) {
      if (!sourceSpan) {
        return expr;
      }
      var transformer = new _ApplySourceSpanTransformer(sourceSpan);
      return expr.visitExpression(transformer, null);
    }
    var _ApplySourceSpanTransformer = (function(_super) {
      __extends(_ApplySourceSpanTransformer, _super);
      function _ApplySourceSpanTransformer(sourceSpan) {
        var _this = _super.call(this) || this;
        _this.sourceSpan = sourceSpan;
        return _this;
      }
      _ApplySourceSpanTransformer.prototype._clone = function(obj) {
        var clone = Object.create(obj.constructor.prototype);
        for (var prop in obj) {
          clone[prop] = obj[prop];
        }
        return clone;
      };
      _ApplySourceSpanTransformer.prototype.transformExpr = function(expr, context) {
        if (!expr.sourceSpan) {
          expr = this._clone(expr);
          expr.sourceSpan = this.sourceSpan;
        }
        return expr;
      };
      _ApplySourceSpanTransformer.prototype.transformStmt = function(stmt, context) {
        if (!stmt.sourceSpan) {
          stmt = this._clone(stmt);
          stmt.sourceSpan = this.sourceSpan;
        }
        return stmt;
      };
      return _ApplySourceSpanTransformer;
    }(AstTransformer$1));
    function variable(name, type, sourceSpan) {
      return new ReadVarExpr(name, type, sourceSpan);
    }
    function importExpr(id, typeParams, sourceSpan) {
      if (typeParams === void 0) {
        typeParams = null;
      }
      return new ExternalExpr(id, null, typeParams, sourceSpan);
    }
    function importType(id, typeParams, typeModifiers) {
      if (typeParams === void 0) {
        typeParams = null;
      }
      if (typeModifiers === void 0) {
        typeModifiers = null;
      }
      return id != null ? expressionType(importExpr(id, typeParams, null), typeModifiers) : null;
    }
    function expressionType(expr, typeModifiers) {
      if (typeModifiers === void 0) {
        typeModifiers = null;
      }
      return new ExpressionType(expr, typeModifiers);
    }
    function literalArr(values, type, sourceSpan) {
      return new LiteralArrayExpr(values, type, sourceSpan);
    }
    function literalMap(values, type) {
      if (type === void 0) {
        type = null;
      }
      return new LiteralMapExpr(values.map(function(e) {
        return new LiteralMapEntry(e.key, e.value, e.quoted);
      }), type, null);
    }
    function not(expr, sourceSpan) {
      return new NotExpr(expr, sourceSpan);
    }
    function assertNotNull(expr, sourceSpan) {
      return new AssertNotNull(expr, sourceSpan);
    }
    function fn(params, body, type, sourceSpan) {
      return new FunctionExpr(params, body, type, sourceSpan);
    }
    function literal(value, type, sourceSpan) {
      return new LiteralExpr(value, type, sourceSpan);
    }
    var ProviderError = (function(_super) {
      __extends(ProviderError, _super);
      function ProviderError(message, span) {
        return _super.call(this, span, message) || this;
      }
      return ProviderError;
    }(ParseError));
    var ProviderViewContext = (function() {
      function ProviderViewContext(reflector, component) {
        var _this = this;
        this.reflector = reflector;
        this.component = component;
        this.errors = [];
        this.viewQueries = _getViewQueries(component);
        this.viewProviders = new Map();
        component.viewProviders.forEach(function(provider) {
          if (_this.viewProviders.get(tokenReference(provider.token)) == null) {
            _this.viewProviders.set(tokenReference(provider.token), true);
          }
        });
      }
      return ProviderViewContext;
    }());
    var ProviderElementContext = (function() {
      function ProviderElementContext(viewContext, _parent, _isViewRoot, _directiveAsts, attrs, refs, isTemplate, contentQueryStartId, _sourceSpan) {
        var _this = this;
        this.viewContext = viewContext;
        this._parent = _parent;
        this._isViewRoot = _isViewRoot;
        this._directiveAsts = _directiveAsts;
        this._sourceSpan = _sourceSpan;
        this._transformedProviders = new Map();
        this._seenProviders = new Map();
        this._queriedTokens = new Map();
        this.transformedHasViewContainer = false;
        this._attrs = {};
        attrs.forEach(function(attrAst) {
          return _this._attrs[attrAst.name] = attrAst.value;
        });
        var directivesMeta = _directiveAsts.map(function(directiveAst) {
          return directiveAst.directive;
        });
        this._allProviders = _resolveProvidersFromDirectives(directivesMeta, _sourceSpan, viewContext.errors);
        this._contentQueries = _getContentQueries(contentQueryStartId, directivesMeta);
        Array.from(this._allProviders.values()).forEach(function(provider) {
          _this._addQueryReadsTo(provider.token, provider.token, _this._queriedTokens);
        });
        if (isTemplate) {
          var templateRefId = createTokenForExternalReference(this.viewContext.reflector, Identifiers.TemplateRef);
          this._addQueryReadsTo(templateRefId, templateRefId, this._queriedTokens);
        }
        refs.forEach(function(refAst) {
          var defaultQueryValue = refAst.value || createTokenForExternalReference(_this.viewContext.reflector, Identifiers.ElementRef);
          _this._addQueryReadsTo({value: refAst.name}, defaultQueryValue, _this._queriedTokens);
        });
        if (this._queriedTokens.get(this.viewContext.reflector.resolveExternalReference(Identifiers.ViewContainerRef))) {
          this.transformedHasViewContainer = true;
        }
        Array.from(this._allProviders.values()).forEach(function(provider) {
          var eager = provider.eager || _this._queriedTokens.get(tokenReference(provider.token));
          if (eager) {
            _this._getOrCreateLocalProvider(provider.providerType, provider.token, true);
          }
        });
      }
      ProviderElementContext.prototype.afterElement = function() {
        var _this = this;
        Array.from(this._allProviders.values()).forEach(function(provider) {
          _this._getOrCreateLocalProvider(provider.providerType, provider.token, false);
        });
      };
      Object.defineProperty(ProviderElementContext.prototype, "transformProviders", {
        get: function() {
          var lazyProviders = [];
          var eagerProviders = [];
          this._transformedProviders.forEach(function(provider) {
            if (provider.eager) {
              eagerProviders.push(provider);
            } else {
              lazyProviders.push(provider);
            }
          });
          return lazyProviders.concat(eagerProviders);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ProviderElementContext.prototype, "transformedDirectiveAsts", {
        get: function() {
          var sortedProviderTypes = this.transformProviders.map(function(provider) {
            return provider.token.identifier;
          });
          var sortedDirectives = this._directiveAsts.slice();
          sortedDirectives.sort(function(dir1, dir2) {
            return sortedProviderTypes.indexOf(dir1.directive.type) - sortedProviderTypes.indexOf(dir2.directive.type);
          });
          return sortedDirectives;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ProviderElementContext.prototype, "queryMatches", {
        get: function() {
          var allMatches = [];
          this._queriedTokens.forEach(function(matches) {
            allMatches.push.apply(allMatches, matches);
          });
          return allMatches;
        },
        enumerable: true,
        configurable: true
      });
      ProviderElementContext.prototype._addQueryReadsTo = function(token, defaultValue, queryReadTokens) {
        this._getQueriesFor(token).forEach(function(query) {
          var queryValue = query.meta.read || defaultValue;
          var tokenRef = tokenReference(queryValue);
          var queryMatches = queryReadTokens.get(tokenRef);
          if (!queryMatches) {
            queryMatches = [];
            queryReadTokens.set(tokenRef, queryMatches);
          }
          queryMatches.push({
            queryId: query.queryId,
            value: queryValue
          });
        });
      };
      ProviderElementContext.prototype._getQueriesFor = function(token) {
        var result = [];
        var currentEl = this;
        var distance = 0;
        var queries;
        while (currentEl !== null) {
          queries = currentEl._contentQueries.get(tokenReference(token));
          if (queries) {
            result.push.apply(result, queries.filter(function(query) {
              return query.meta.descendants || distance <= 1;
            }));
          }
          if (currentEl._directiveAsts.length > 0) {
            distance++;
          }
          currentEl = currentEl._parent;
        }
        queries = this.viewContext.viewQueries.get(tokenReference(token));
        if (queries) {
          result.push.apply(result, queries);
        }
        return result;
      };
      ProviderElementContext.prototype._getOrCreateLocalProvider = function(requestingProviderType, token, eager) {
        var _this = this;
        var resolvedProvider = this._allProviders.get(tokenReference(token));
        if (!resolvedProvider || ((requestingProviderType === ProviderAstType.Directive || requestingProviderType === ProviderAstType.PublicService) && resolvedProvider.providerType === ProviderAstType.PrivateService) || ((requestingProviderType === ProviderAstType.PrivateService || requestingProviderType === ProviderAstType.PublicService) && resolvedProvider.providerType === ProviderAstType.Builtin)) {
          return null;
        }
        var transformedProviderAst = this._transformedProviders.get(tokenReference(token));
        if (transformedProviderAst) {
          return transformedProviderAst;
        }
        if (this._seenProviders.get(tokenReference(token)) != null) {
          this.viewContext.errors.push(new ProviderError("Cannot instantiate cyclic dependency! " + tokenName(token), this._sourceSpan));
          return null;
        }
        this._seenProviders.set(tokenReference(token), true);
        var transformedProviders = resolvedProvider.providers.map(function(provider) {
          var transformedUseValue = provider.useValue;
          var transformedUseExisting = ((provider.useExisting));
          var transformedDeps = ((undefined));
          if (provider.useExisting != null) {
            var existingDiDep = ((_this._getDependency(resolvedProvider.providerType, {token: provider.useExisting}, eager)));
            if (existingDiDep.token != null) {
              transformedUseExisting = existingDiDep.token;
            } else {
              transformedUseExisting = ((null));
              transformedUseValue = existingDiDep.value;
            }
          } else if (provider.useFactory) {
            var deps = provider.deps || provider.useFactory.diDeps;
            transformedDeps = deps.map(function(dep) {
              return ((_this._getDependency(resolvedProvider.providerType, dep, eager)));
            });
          } else if (provider.useClass) {
            var deps = provider.deps || provider.useClass.diDeps;
            transformedDeps = deps.map(function(dep) {
              return ((_this._getDependency(resolvedProvider.providerType, dep, eager)));
            });
          }
          return _transformProvider(provider, {
            useExisting: transformedUseExisting,
            useValue: transformedUseValue,
            deps: transformedDeps
          });
        });
        transformedProviderAst = _transformProviderAst(resolvedProvider, {
          eager: eager,
          providers: transformedProviders
        });
        this._transformedProviders.set(tokenReference(token), transformedProviderAst);
        return transformedProviderAst;
      };
      ProviderElementContext.prototype._getLocalDependency = function(requestingProviderType, dep, eager) {
        if (eager === void 0) {
          eager = false;
        }
        if (dep.isAttribute) {
          var attrValue = this._attrs[((dep.token)).value];
          return {
            isValue: true,
            value: attrValue == null ? null : attrValue
          };
        }
        if (dep.token != null) {
          if ((requestingProviderType === ProviderAstType.Directive || requestingProviderType === ProviderAstType.Component)) {
            if (tokenReference(dep.token) === this.viewContext.reflector.resolveExternalReference(Identifiers.Renderer) || tokenReference(dep.token) === this.viewContext.reflector.resolveExternalReference(Identifiers.ElementRef) || tokenReference(dep.token) === this.viewContext.reflector.resolveExternalReference(Identifiers.ChangeDetectorRef) || tokenReference(dep.token) === this.viewContext.reflector.resolveExternalReference(Identifiers.TemplateRef)) {
              return dep;
            }
            if (tokenReference(dep.token) === this.viewContext.reflector.resolveExternalReference(Identifiers.ViewContainerRef)) {
              ((this)).transformedHasViewContainer = true;
            }
          }
          if (tokenReference(dep.token) === this.viewContext.reflector.resolveExternalReference(Identifiers.Injector)) {
            return dep;
          }
          if (this._getOrCreateLocalProvider(requestingProviderType, dep.token, eager) != null) {
            return dep;
          }
        }
        return null;
      };
      ProviderElementContext.prototype._getDependency = function(requestingProviderType, dep, eager) {
        if (eager === void 0) {
          eager = false;
        }
        var currElement = this;
        var currEager = eager;
        var result = null;
        if (!dep.isSkipSelf) {
          result = this._getLocalDependency(requestingProviderType, dep, eager);
        }
        if (dep.isSelf) {
          if (!result && dep.isOptional) {
            result = {
              isValue: true,
              value: null
            };
          }
        } else {
          while (!result && currElement._parent) {
            var prevElement = currElement;
            currElement = currElement._parent;
            if (prevElement._isViewRoot) {
              currEager = false;
            }
            result = currElement._getLocalDependency(ProviderAstType.PublicService, dep, currEager);
          }
          if (!result) {
            if (!dep.isHost || this.viewContext.component.isHost || this.viewContext.component.type.reference === tokenReference(((dep.token))) || this.viewContext.viewProviders.get(tokenReference(((dep.token)))) != null) {
              result = dep;
            } else {
              result = dep.isOptional ? result = {
                isValue: true,
                value: null
              } : null;
            }
          }
        }
        if (!result) {
          this.viewContext.errors.push(new ProviderError("No provider for " + tokenName((((dep.token)))), this._sourceSpan));
        }
        return result;
      };
      return ProviderElementContext;
    }());
    var NgModuleProviderAnalyzer = (function() {
      function NgModuleProviderAnalyzer(reflector, ngModule, extraProviders, sourceSpan) {
        var _this = this;
        this.reflector = reflector;
        this._transformedProviders = new Map();
        this._seenProviders = new Map();
        this._errors = [];
        this._allProviders = new Map();
        ngModule.transitiveModule.modules.forEach(function(ngModuleType) {
          var ngModuleProvider = {
            token: {identifier: ngModuleType},
            useClass: ngModuleType
          };
          _resolveProviders([ngModuleProvider], ProviderAstType.PublicService, true, sourceSpan, _this._errors, _this._allProviders);
        });
        _resolveProviders(ngModule.transitiveModule.providers.map(function(entry) {
          return entry.provider;
        }).concat(extraProviders), ProviderAstType.PublicService, false, sourceSpan, this._errors, this._allProviders);
      }
      NgModuleProviderAnalyzer.prototype.parse = function() {
        var _this = this;
        Array.from(this._allProviders.values()).forEach(function(provider) {
          _this._getOrCreateLocalProvider(provider.token, provider.eager);
        });
        if (this._errors.length > 0) {
          var errorString = this._errors.join('\n');
          throw new Error("Provider parse errors:\n" + errorString);
        }
        var lazyProviders = [];
        var eagerProviders = [];
        this._transformedProviders.forEach(function(provider) {
          if (provider.eager) {
            eagerProviders.push(provider);
          } else {
            lazyProviders.push(provider);
          }
        });
        return lazyProviders.concat(eagerProviders);
      };
      NgModuleProviderAnalyzer.prototype._getOrCreateLocalProvider = function(token, eager) {
        var _this = this;
        var resolvedProvider = this._allProviders.get(tokenReference(token));
        if (!resolvedProvider) {
          return null;
        }
        var transformedProviderAst = this._transformedProviders.get(tokenReference(token));
        if (transformedProviderAst) {
          return transformedProviderAst;
        }
        if (this._seenProviders.get(tokenReference(token)) != null) {
          this._errors.push(new ProviderError("Cannot instantiate cyclic dependency! " + tokenName(token), resolvedProvider.sourceSpan));
          return null;
        }
        this._seenProviders.set(tokenReference(token), true);
        var transformedProviders = resolvedProvider.providers.map(function(provider) {
          var transformedUseValue = provider.useValue;
          var transformedUseExisting = ((provider.useExisting));
          var transformedDeps = ((undefined));
          if (provider.useExisting != null) {
            var existingDiDep = _this._getDependency({token: provider.useExisting}, eager, resolvedProvider.sourceSpan);
            if (existingDiDep.token != null) {
              transformedUseExisting = existingDiDep.token;
            } else {
              transformedUseExisting = ((null));
              transformedUseValue = existingDiDep.value;
            }
          } else if (provider.useFactory) {
            var deps = provider.deps || provider.useFactory.diDeps;
            transformedDeps = deps.map(function(dep) {
              return _this._getDependency(dep, eager, resolvedProvider.sourceSpan);
            });
          } else if (provider.useClass) {
            var deps = provider.deps || provider.useClass.diDeps;
            transformedDeps = deps.map(function(dep) {
              return _this._getDependency(dep, eager, resolvedProvider.sourceSpan);
            });
          }
          return _transformProvider(provider, {
            useExisting: transformedUseExisting,
            useValue: transformedUseValue,
            deps: transformedDeps
          });
        });
        transformedProviderAst = _transformProviderAst(resolvedProvider, {
          eager: eager,
          providers: transformedProviders
        });
        this._transformedProviders.set(tokenReference(token), transformedProviderAst);
        return transformedProviderAst;
      };
      NgModuleProviderAnalyzer.prototype._getDependency = function(dep, eager, requestorSourceSpan) {
        if (eager === void 0) {
          eager = false;
        }
        var foundLocal = false;
        if (!dep.isSkipSelf && dep.token != null) {
          if (tokenReference(dep.token) === this.reflector.resolveExternalReference(Identifiers.Injector) || tokenReference(dep.token) === this.reflector.resolveExternalReference(Identifiers.ComponentFactoryResolver)) {
            foundLocal = true;
          } else if (this._getOrCreateLocalProvider(dep.token, eager) != null) {
            foundLocal = true;
          }
        }
        var result = dep;
        if (dep.isSelf && !foundLocal) {
          if (dep.isOptional) {
            result = {
              isValue: true,
              value: null
            };
          } else {
            this._errors.push(new ProviderError("No provider for " + tokenName((((dep.token)))), requestorSourceSpan));
          }
        }
        return result;
      };
      return NgModuleProviderAnalyzer;
    }());
    function _transformProvider(provider, _a) {
      var useExisting = _a.useExisting,
          useValue = _a.useValue,
          deps = _a.deps;
      return {
        token: provider.token,
        useClass: provider.useClass,
        useExisting: useExisting,
        useFactory: provider.useFactory,
        useValue: useValue,
        deps: deps,
        multi: provider.multi
      };
    }
    function _transformProviderAst(provider, _a) {
      var eager = _a.eager,
          providers = _a.providers;
      return new ProviderAst(provider.token, provider.multiProvider, provider.eager || eager, providers, provider.providerType, provider.lifecycleHooks, provider.sourceSpan);
    }
    function _resolveProvidersFromDirectives(directives, sourceSpan, targetErrors) {
      var providersByToken = new Map();
      directives.forEach(function(directive) {
        var dirProvider = {
          token: {identifier: directive.type},
          useClass: directive.type
        };
        _resolveProviders([dirProvider], directive.isComponent ? ProviderAstType.Component : ProviderAstType.Directive, true, sourceSpan, targetErrors, providersByToken);
      });
      var directivesWithComponentFirst = directives.filter(function(dir) {
        return dir.isComponent;
      }).concat(directives.filter(function(dir) {
        return !dir.isComponent;
      }));
      directivesWithComponentFirst.forEach(function(directive) {
        _resolveProviders(directive.providers, ProviderAstType.PublicService, false, sourceSpan, targetErrors, providersByToken);
        _resolveProviders(directive.viewProviders, ProviderAstType.PrivateService, false, sourceSpan, targetErrors, providersByToken);
      });
      return providersByToken;
    }
    function _resolveProviders(providers, providerType, eager, sourceSpan, targetErrors, targetProvidersByToken) {
      providers.forEach(function(provider) {
        var resolvedProvider = targetProvidersByToken.get(tokenReference(provider.token));
        if (resolvedProvider != null && !!resolvedProvider.multiProvider !== !!provider.multi) {
          targetErrors.push(new ProviderError("Mixing multi and non multi provider is not possible for token " + tokenName(resolvedProvider.token), sourceSpan));
        }
        if (!resolvedProvider) {
          var lifecycleHooks = provider.token.identifier && ((provider.token.identifier)).lifecycleHooks ? ((provider.token.identifier)).lifecycleHooks : [];
          var isUseValue = !(provider.useClass || provider.useExisting || provider.useFactory);
          resolvedProvider = new ProviderAst(provider.token, !!provider.multi, eager || isUseValue, [provider], providerType, lifecycleHooks, sourceSpan);
          targetProvidersByToken.set(tokenReference(provider.token), resolvedProvider);
        } else {
          if (!provider.multi) {
            resolvedProvider.providers.length = 0;
          }
          resolvedProvider.providers.push(provider);
        }
      });
    }
    function _getViewQueries(component) {
      var viewQueryId = 1;
      var viewQueries = new Map();
      if (component.viewQueries) {
        component.viewQueries.forEach(function(query) {
          return _addQueryToTokenMap(viewQueries, {
            meta: query,
            queryId: viewQueryId++
          });
        });
      }
      return viewQueries;
    }
    function _getContentQueries(contentQueryStartId, directives) {
      var contentQueryId = contentQueryStartId;
      var contentQueries = new Map();
      directives.forEach(function(directive, directiveIndex) {
        if (directive.queries) {
          directive.queries.forEach(function(query) {
            return _addQueryToTokenMap(contentQueries, {
              meta: query,
              queryId: contentQueryId++
            });
          });
        }
      });
      return contentQueries;
    }
    function _addQueryToTokenMap(map, query) {
      query.meta.selectors.forEach(function(token) {
        var entry = map.get(tokenReference(token));
        if (!entry) {
          entry = [];
          map.set(tokenReference(token), entry);
        }
        entry.push(query);
      });
    }
    var QUOTED_KEYS = '$quoted$';
    function convertValueToOutputAst(ctx, value, type) {
      if (type === void 0) {
        type = null;
      }
      return visitValue(value, new _ValueOutputAstTransformer(ctx), type);
    }
    var _ValueOutputAstTransformer = (function() {
      function _ValueOutputAstTransformer(ctx) {
        this.ctx = ctx;
      }
      _ValueOutputAstTransformer.prototype.visitArray = function(arr, type) {
        var _this = this;
        return literalArr(arr.map(function(value) {
          return visitValue(value, _this, null);
        }), type);
      };
      _ValueOutputAstTransformer.prototype.visitStringMap = function(map, type) {
        var _this = this;
        var entries = [];
        var quotedSet = new Set(map && map[QUOTED_KEYS]);
        Object.keys(map).forEach(function(key) {
          entries.push(new LiteralMapEntry(key, visitValue(map[key], _this, null), quotedSet.has(key)));
        });
        return new LiteralMapExpr(entries, type);
      };
      _ValueOutputAstTransformer.prototype.visitPrimitive = function(value, type) {
        return literal(value, type);
      };
      _ValueOutputAstTransformer.prototype.visitOther = function(value, type) {
        if (value instanceof Expression) {
          return value;
        } else {
          return this.ctx.importExpr(value);
        }
      };
      return _ValueOutputAstTransformer;
    }());
    function providerDef(ctx, providerAst) {
      var flags = 0;
      if (!providerAst.eager) {
        flags |= 4096;
      }
      if (providerAst.providerType === ProviderAstType.PrivateService) {
        flags |= 8192;
      }
      providerAst.lifecycleHooks.forEach(function(lifecycleHook) {
        if (lifecycleHook === LifecycleHooks.OnDestroy || providerAst.providerType === ProviderAstType.Directive || providerAst.providerType === ProviderAstType.Component) {
          flags |= lifecycleHookToNodeFlag(lifecycleHook);
        }
      });
      var _a = providerAst.multiProvider ? multiProviderDef(ctx, flags, providerAst.providers) : singleProviderDef(ctx, flags, providerAst.providerType, providerAst.providers[0]),
          providerExpr = _a.providerExpr,
          providerFlags = _a.flags,
          depsExpr = _a.depsExpr;
      return {
        providerExpr: providerExpr,
        flags: providerFlags,
        depsExpr: depsExpr,
        tokenExpr: tokenExpr(ctx, providerAst.token)
      };
    }
    function multiProviderDef(ctx, flags, providers) {
      var allDepDefs = [];
      var allParams = [];
      var exprs = providers.map(function(provider, providerIndex) {
        var expr;
        if (provider.useClass) {
          var depExprs = convertDeps(providerIndex, provider.deps || provider.useClass.diDeps);
          expr = ctx.importExpr(provider.useClass.reference).instantiate(depExprs);
        } else if (provider.useFactory) {
          var depExprs = convertDeps(providerIndex, provider.deps || provider.useFactory.diDeps);
          expr = ctx.importExpr(provider.useFactory.reference).callFn(depExprs);
        } else if (provider.useExisting) {
          var depExprs = convertDeps(providerIndex, [{token: provider.useExisting}]);
          expr = depExprs[0];
        } else {
          expr = convertValueToOutputAst(ctx, provider.useValue);
        }
        return expr;
      });
      var providerExpr = fn(allParams, [new ReturnStatement(literalArr(exprs))], INFERRED_TYPE);
      return {
        providerExpr: providerExpr,
        flags: flags | 1024,
        depsExpr: literalArr(allDepDefs)
      };
      function convertDeps(providerIndex, deps) {
        return deps.map(function(dep, depIndex) {
          var paramName = "p" + providerIndex + "_" + depIndex;
          allParams.push(new FnParam(paramName, DYNAMIC_TYPE));
          allDepDefs.push(depDef(ctx, dep));
          return variable(paramName);
        });
      }
    }
    function singleProviderDef(ctx, flags, providerType, providerMeta) {
      var providerExpr;
      var deps;
      if (providerType === ProviderAstType.Directive || providerType === ProviderAstType.Component) {
        providerExpr = ctx.importExpr(((providerMeta.useClass)).reference);
        flags |= 16384;
        deps = providerMeta.deps || ((providerMeta.useClass)).diDeps;
      } else {
        if (providerMeta.useClass) {
          providerExpr = ctx.importExpr(providerMeta.useClass.reference);
          flags |= 512;
          deps = providerMeta.deps || providerMeta.useClass.diDeps;
        } else if (providerMeta.useFactory) {
          providerExpr = ctx.importExpr(providerMeta.useFactory.reference);
          flags |= 1024;
          deps = providerMeta.deps || providerMeta.useFactory.diDeps;
        } else if (providerMeta.useExisting) {
          providerExpr = NULL_EXPR;
          flags |= 2048;
          deps = [{token: providerMeta.useExisting}];
        } else {
          providerExpr = convertValueToOutputAst(ctx, providerMeta.useValue);
          flags |= 256;
          deps = [];
        }
      }
      var depsExpr = literalArr(deps.map(function(dep) {
        return depDef(ctx, dep);
      }));
      return {
        providerExpr: providerExpr,
        flags: flags,
        depsExpr: depsExpr
      };
    }
    function tokenExpr(ctx, tokenMeta) {
      return tokenMeta.identifier ? ctx.importExpr(tokenMeta.identifier.reference) : literal(tokenMeta.value);
    }
    function depDef(ctx, dep) {
      var expr = dep.isValue ? convertValueToOutputAst(ctx, dep.value) : tokenExpr(ctx, ((dep.token)));
      var flags = 0;
      if (dep.isSkipSelf) {
        flags |= 1;
      }
      if (dep.isOptional) {
        flags |= 2;
      }
      if (dep.isValue) {
        flags |= 8;
      }
      return flags === 0 ? expr : literalArr([literal(flags), expr]);
    }
    function lifecycleHookToNodeFlag(lifecycleHook) {
      var nodeFlag = 0;
      switch (lifecycleHook) {
        case LifecycleHooks.AfterContentChecked:
          nodeFlag = 2097152;
          break;
        case LifecycleHooks.AfterContentInit:
          nodeFlag = 1048576;
          break;
        case LifecycleHooks.AfterViewChecked:
          nodeFlag = 8388608;
          break;
        case LifecycleHooks.AfterViewInit:
          nodeFlag = 4194304;
          break;
        case LifecycleHooks.DoCheck:
          nodeFlag = 262144;
          break;
        case LifecycleHooks.OnChanges:
          nodeFlag = 524288;
          break;
        case LifecycleHooks.OnDestroy:
          nodeFlag = 131072;
          break;
        case LifecycleHooks.OnInit:
          nodeFlag = 65536;
          break;
      }
      return nodeFlag;
    }
    function componentFactoryResolverProviderDef(reflector, ctx, flags, entryComponents) {
      var entryComponentFactories = entryComponents.map(function(entryComponent) {
        return ctx.importExpr(entryComponent.componentFactory);
      });
      var token = createTokenForExternalReference(reflector, Identifiers.ComponentFactoryResolver);
      var classMeta = {
        diDeps: [{
          isValue: true,
          value: literalArr(entryComponentFactories)
        }, {
          token: token,
          isSkipSelf: true,
          isOptional: true
        }, {token: createTokenForExternalReference(reflector, Identifiers.NgModuleRef)}],
        lifecycleHooks: [],
        reference: reflector.resolveExternalReference(Identifiers.CodegenComponentFactoryResolver)
      };
      var _a = singleProviderDef(ctx, flags, ProviderAstType.PrivateService, {
        token: token,
        multi: false,
        useClass: classMeta
      }),
          providerExpr = _a.providerExpr,
          providerFlags = _a.flags,
          depsExpr = _a.depsExpr;
      return {
        providerExpr: providerExpr,
        flags: providerFlags,
        depsExpr: depsExpr,
        tokenExpr: tokenExpr(ctx, token)
      };
    }
    var NgModuleCompileResult = (function() {
      function NgModuleCompileResult(ngModuleFactoryVar) {
        this.ngModuleFactoryVar = ngModuleFactoryVar;
      }
      return NgModuleCompileResult;
    }());
    var LOG_VAR = variable('_l');
    var NgModuleCompiler = (function() {
      function NgModuleCompiler(reflector) {
        this.reflector = reflector;
      }
      NgModuleCompiler.prototype.compile = function(ctx, ngModuleMeta, extraProviders) {
        var sourceSpan = typeSourceSpan('NgModule', ngModuleMeta.type);
        var entryComponentFactories = ngModuleMeta.transitiveModule.entryComponents;
        var bootstrapComponents = ngModuleMeta.bootstrapComponents;
        var providerParser = new NgModuleProviderAnalyzer(this.reflector, ngModuleMeta, extraProviders, sourceSpan);
        var providerDefs = [componentFactoryResolverProviderDef(this.reflector, ctx, 0, entryComponentFactories)].concat(providerParser.parse().map(function(provider) {
          return providerDef(ctx, provider);
        })).map(function(_a) {
          var providerExpr = _a.providerExpr,
              depsExpr = _a.depsExpr,
              flags = _a.flags,
              tokenExpr = _a.tokenExpr;
          return importExpr(Identifiers.moduleProviderDef).callFn([literal(flags), tokenExpr, providerExpr, depsExpr]);
        });
        var ngModuleDef = importExpr(Identifiers.moduleDef).callFn([literalArr(providerDefs)]);
        var ngModuleDefFactory = fn([new FnParam(((LOG_VAR.name)))], [new ReturnStatement(ngModuleDef)], INFERRED_TYPE);
        var ngModuleFactoryVar = identifierName(ngModuleMeta.type) + "NgFactory";
        this._createNgModuleFactory(ctx, ngModuleMeta.type.reference, importExpr(Identifiers.createModuleFactory).callFn([ctx.importExpr(ngModuleMeta.type.reference), literalArr(bootstrapComponents.map(function(id) {
          return ctx.importExpr(id.reference);
        })), ngModuleDefFactory]));
        if (ngModuleMeta.id) {
          var registerFactoryStmt = importExpr(Identifiers.RegisterModuleFactoryFn).callFn([literal(ngModuleMeta.id), variable(ngModuleFactoryVar)]).toStmt();
          ctx.statements.push(registerFactoryStmt);
        }
        return new NgModuleCompileResult(ngModuleFactoryVar);
      };
      NgModuleCompiler.prototype.createStub = function(ctx, ngModuleReference) {
        this._createNgModuleFactory(ctx, ngModuleReference, NULL_EXPR);
      };
      NgModuleCompiler.prototype._createNgModuleFactory = function(ctx, reference, value) {
        var ngModuleFactoryVar = identifierName({reference: reference}) + "NgFactory";
        var ngModuleFactoryStmt = variable(ngModuleFactoryVar).set(value).toDeclStmt(importType(Identifiers.NgModuleFactory, [((expressionType(ctx.importExpr(reference))))], [TypeModifier.Const]), [StmtModifier.Final, StmtModifier.Exported]);
        ctx.statements.push(ngModuleFactoryStmt);
      };
      return NgModuleCompiler;
    }());
    var NgModuleResolver = (function() {
      function NgModuleResolver(_reflector) {
        this._reflector = _reflector;
      }
      NgModuleResolver.prototype.isNgModule = function(type) {
        return this._reflector.annotations(type).some(createNgModule.isTypeOf);
      };
      NgModuleResolver.prototype.resolve = function(type, throwIfNotFound) {
        if (throwIfNotFound === void 0) {
          throwIfNotFound = true;
        }
        var ngModuleMeta = findLast(this._reflector.annotations(type), createNgModule.isTypeOf);
        if (ngModuleMeta) {
          return ngModuleMeta;
        } else {
          if (throwIfNotFound) {
            throw new Error("No NgModule metadata found for '" + stringify(type) + "'.");
          }
          return null;
        }
      };
      return NgModuleResolver;
    }());
    var VERSION$1 = 3;
    var JS_B64_PREFIX = '# sourceMappingURL=data:application/json;base64,';
    var SourceMapGenerator = (function() {
      function SourceMapGenerator(file) {
        if (file === void 0) {
          file = null;
        }
        this.file = file;
        this.sourcesContent = new Map();
        this.lines = [];
        this.lastCol0 = 0;
        this.hasMappings = false;
      }
      SourceMapGenerator.prototype.addSource = function(url, content) {
        if (content === void 0) {
          content = null;
        }
        if (!this.sourcesContent.has(url)) {
          this.sourcesContent.set(url, content);
        }
        return this;
      };
      SourceMapGenerator.prototype.addLine = function() {
        this.lines.push([]);
        this.lastCol0 = 0;
        return this;
      };
      SourceMapGenerator.prototype.addMapping = function(col0, sourceUrl, sourceLine0, sourceCol0) {
        if (!this.currentLine) {
          throw new Error("A line must be added before mappings can be added");
        }
        if (sourceUrl != null && !this.sourcesContent.has(sourceUrl)) {
          throw new Error("Unknown source file \"" + sourceUrl + "\"");
        }
        if (col0 == null) {
          throw new Error("The column in the generated code must be provided");
        }
        if (col0 < this.lastCol0) {
          throw new Error("Mapping should be added in output order");
        }
        if (sourceUrl && (sourceLine0 == null || sourceCol0 == null)) {
          throw new Error("The source location must be provided when a source url is provided");
        }
        this.hasMappings = true;
        this.lastCol0 = col0;
        this.currentLine.push({
          col0: col0,
          sourceUrl: sourceUrl,
          sourceLine0: sourceLine0,
          sourceCol0: sourceCol0
        });
        return this;
      };
      Object.defineProperty(SourceMapGenerator.prototype, "currentLine", {
        get: function() {
          return this.lines.slice(-1)[0];
        },
        enumerable: true,
        configurable: true
      });
      SourceMapGenerator.prototype.toJSON = function() {
        var _this = this;
        if (!this.hasMappings) {
          return null;
        }
        var sourcesIndex = new Map();
        var sources = [];
        var sourcesContent = [];
        Array.from(this.sourcesContent.keys()).forEach(function(url, i) {
          sourcesIndex.set(url, i);
          sources.push(url);
          sourcesContent.push(_this.sourcesContent.get(url) || null);
        });
        var mappings = '';
        var lastCol0 = 0;
        var lastSourceIndex = 0;
        var lastSourceLine0 = 0;
        var lastSourceCol0 = 0;
        this.lines.forEach(function(segments) {
          lastCol0 = 0;
          mappings += segments.map(function(segment) {
            var segAsStr = toBase64VLQ(segment.col0 - lastCol0);
            lastCol0 = segment.col0;
            if (segment.sourceUrl != null) {
              segAsStr += toBase64VLQ(((sourcesIndex.get(segment.sourceUrl))) - lastSourceIndex);
              lastSourceIndex = ((sourcesIndex.get(segment.sourceUrl)));
              segAsStr += toBase64VLQ(((segment.sourceLine0)) - lastSourceLine0);
              lastSourceLine0 = ((segment.sourceLine0));
              segAsStr += toBase64VLQ(((segment.sourceCol0)) - lastSourceCol0);
              lastSourceCol0 = ((segment.sourceCol0));
            }
            return segAsStr;
          }).join(',');
          mappings += ';';
        });
        mappings = mappings.slice(0, -1);
        return {
          'file': this.file || '',
          'version': VERSION$1,
          'sourceRoot': '',
          'sources': sources,
          'sourcesContent': sourcesContent,
          'mappings': mappings
        };
      };
      SourceMapGenerator.prototype.toJsComment = function() {
        return this.hasMappings ? '//' + JS_B64_PREFIX + toBase64String(JSON.stringify(this, null, 0)) : '';
      };
      return SourceMapGenerator;
    }());
    function toBase64String(value) {
      var b64 = '';
      value = utf8Encode(value);
      for (var i = 0; i < value.length; ) {
        var i1 = value.charCodeAt(i++);
        var i2 = value.charCodeAt(i++);
        var i3 = value.charCodeAt(i++);
        b64 += toBase64Digit(i1 >> 2);
        b64 += toBase64Digit(((i1 & 3) << 4) | (isNaN(i2) ? 0 : i2 >> 4));
        b64 += isNaN(i2) ? '=' : toBase64Digit(((i2 & 15) << 2) | (i3 >> 6));
        b64 += isNaN(i2) || isNaN(i3) ? '=' : toBase64Digit(i3 & 63);
      }
      return b64;
    }
    function toBase64VLQ(value) {
      value = value < 0 ? ((-value) << 1) + 1 : value << 1;
      var out = '';
      do {
        var digit = value & 31;
        value = value >> 5;
        if (value > 0) {
          digit = digit | 32;
        }
        out += toBase64Digit(digit);
      } while (value > 0);
      return out;
    }
    var B64_DIGITS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    function toBase64Digit(value) {
      if (value < 0 || value >= 64) {
        throw new Error("Can only encode value in the range [0, 63]");
      }
      return B64_DIGITS[value];
    }
    var _SINGLE_QUOTE_ESCAPE_STRING_RE = /'|\\|\n|\r|\$/g;
    var _LEGAL_IDENTIFIER_RE = /^[$A-Z_][0-9A-Z_$]*$/i;
    var _INDENT_WITH = '  ';
    var CATCH_ERROR_VAR$1 = variable('error', null, null);
    var CATCH_STACK_VAR$1 = variable('stack', null, null);
    var _EmittedLine = (function() {
      function _EmittedLine(indent) {
        this.indent = indent;
        this.partsLength = 0;
        this.parts = [];
        this.srcSpans = [];
      }
      return _EmittedLine;
    }());
    var EmitterVisitorContext = (function() {
      function EmitterVisitorContext(_indent) {
        this._indent = _indent;
        this._classes = [];
        this._preambleLineCount = 0;
        this._lines = [new _EmittedLine(_indent)];
      }
      EmitterVisitorContext.createRoot = function() {
        return new EmitterVisitorContext(0);
      };
      Object.defineProperty(EmitterVisitorContext.prototype, "_currentLine", {
        get: function() {
          return this._lines[this._lines.length - 1];
        },
        enumerable: true,
        configurable: true
      });
      EmitterVisitorContext.prototype.println = function(from, lastPart) {
        if (lastPart === void 0) {
          lastPart = '';
        }
        this.print(from || null, lastPart, true);
      };
      EmitterVisitorContext.prototype.lineIsEmpty = function() {
        return this._currentLine.parts.length === 0;
      };
      EmitterVisitorContext.prototype.lineLength = function() {
        return this._currentLine.indent * _INDENT_WITH.length + this._currentLine.partsLength;
      };
      EmitterVisitorContext.prototype.print = function(from, part, newLine) {
        if (newLine === void 0) {
          newLine = false;
        }
        if (part.length > 0) {
          this._currentLine.parts.push(part);
          this._currentLine.partsLength += part.length;
          this._currentLine.srcSpans.push(from && from.sourceSpan || null);
        }
        if (newLine) {
          this._lines.push(new _EmittedLine(this._indent));
        }
      };
      EmitterVisitorContext.prototype.removeEmptyLastLine = function() {
        if (this.lineIsEmpty()) {
          this._lines.pop();
        }
      };
      EmitterVisitorContext.prototype.incIndent = function() {
        this._indent++;
        if (this.lineIsEmpty()) {
          this._currentLine.indent = this._indent;
        }
      };
      EmitterVisitorContext.prototype.decIndent = function() {
        this._indent--;
        if (this.lineIsEmpty()) {
          this._currentLine.indent = this._indent;
        }
      };
      EmitterVisitorContext.prototype.pushClass = function(clazz) {
        this._classes.push(clazz);
      };
      EmitterVisitorContext.prototype.popClass = function() {
        return ((this._classes.pop()));
      };
      Object.defineProperty(EmitterVisitorContext.prototype, "currentClass", {
        get: function() {
          return this._classes.length > 0 ? this._classes[this._classes.length - 1] : null;
        },
        enumerable: true,
        configurable: true
      });
      EmitterVisitorContext.prototype.toSource = function() {
        return this.sourceLines.map(function(l) {
          return l.parts.length > 0 ? _createIndent(l.indent) + l.parts.join('') : '';
        }).join('\n');
      };
      EmitterVisitorContext.prototype.toSourceMapGenerator = function(genFilePath, startsAtLine) {
        if (startsAtLine === void 0) {
          startsAtLine = 0;
        }
        var map = new SourceMapGenerator(genFilePath);
        var firstOffsetMapped = false;
        var mapFirstOffsetIfNeeded = function() {
          if (!firstOffsetMapped) {
            map.addSource(genFilePath, ' ').addMapping(0, genFilePath, 0, 0);
            firstOffsetMapped = true;
          }
        };
        for (var i = 0; i < startsAtLine; i++) {
          map.addLine();
          mapFirstOffsetIfNeeded();
        }
        this.sourceLines.forEach(function(line, lineIdx) {
          map.addLine();
          var spans = line.srcSpans;
          var parts = line.parts;
          var col0 = line.indent * _INDENT_WITH.length;
          var spanIdx = 0;
          while (spanIdx < spans.length && !spans[spanIdx]) {
            col0 += parts[spanIdx].length;
            spanIdx++;
          }
          if (spanIdx < spans.length && lineIdx === 0 && col0 === 0) {
            firstOffsetMapped = true;
          } else {
            mapFirstOffsetIfNeeded();
          }
          while (spanIdx < spans.length) {
            var span = ((spans[spanIdx]));
            var source = span.start.file;
            var sourceLine = span.start.line;
            var sourceCol = span.start.col;
            map.addSource(source.url, source.content).addMapping(col0, source.url, sourceLine, sourceCol);
            col0 += parts[spanIdx].length;
            spanIdx++;
            while (spanIdx < spans.length && (span === spans[spanIdx] || !spans[spanIdx])) {
              col0 += parts[spanIdx].length;
              spanIdx++;
            }
          }
        });
        return map;
      };
      EmitterVisitorContext.prototype.setPreambleLineCount = function(count) {
        return this._preambleLineCount = count;
      };
      EmitterVisitorContext.prototype.spanOf = function(line, column) {
        var emittedLine = this._lines[line - this._preambleLineCount];
        if (emittedLine) {
          var columnsLeft = column - _createIndent(emittedLine.indent).length;
          for (var partIndex = 0; partIndex < emittedLine.parts.length; partIndex++) {
            var part = emittedLine.parts[partIndex];
            if (part.length > columnsLeft) {
              return emittedLine.srcSpans[partIndex];
            }
            columnsLeft -= part.length;
          }
        }
        return null;
      };
      Object.defineProperty(EmitterVisitorContext.prototype, "sourceLines", {
        get: function() {
          if (this._lines.length && this._lines[this._lines.length - 1].parts.length === 0) {
            return this._lines.slice(0, -1);
          }
          return this._lines;
        },
        enumerable: true,
        configurable: true
      });
      return EmitterVisitorContext;
    }());
    var AbstractEmitterVisitor = (function() {
      function AbstractEmitterVisitor(_escapeDollarInStrings) {
        this._escapeDollarInStrings = _escapeDollarInStrings;
      }
      AbstractEmitterVisitor.prototype.visitExpressionStmt = function(stmt, ctx) {
        stmt.expr.visitExpression(this, ctx);
        ctx.println(stmt, ';');
        return null;
      };
      AbstractEmitterVisitor.prototype.visitReturnStmt = function(stmt, ctx) {
        ctx.print(stmt, "return ");
        stmt.value.visitExpression(this, ctx);
        ctx.println(stmt, ';');
        return null;
      };
      AbstractEmitterVisitor.prototype.visitIfStmt = function(stmt, ctx) {
        ctx.print(stmt, "if (");
        stmt.condition.visitExpression(this, ctx);
        ctx.print(stmt, ") {");
        var hasElseCase = stmt.falseCase != null && stmt.falseCase.length > 0;
        if (stmt.trueCase.length <= 1 && !hasElseCase) {
          ctx.print(stmt, " ");
          this.visitAllStatements(stmt.trueCase, ctx);
          ctx.removeEmptyLastLine();
          ctx.print(stmt, " ");
        } else {
          ctx.println();
          ctx.incIndent();
          this.visitAllStatements(stmt.trueCase, ctx);
          ctx.decIndent();
          if (hasElseCase) {
            ctx.println(stmt, "} else {");
            ctx.incIndent();
            this.visitAllStatements(stmt.falseCase, ctx);
            ctx.decIndent();
          }
        }
        ctx.println(stmt, "}");
        return null;
      };
      AbstractEmitterVisitor.prototype.visitThrowStmt = function(stmt, ctx) {
        ctx.print(stmt, "throw ");
        stmt.error.visitExpression(this, ctx);
        ctx.println(stmt, ";");
        return null;
      };
      AbstractEmitterVisitor.prototype.visitCommentStmt = function(stmt, ctx) {
        var lines = stmt.comment.split('\n');
        lines.forEach(function(line) {
          ctx.println(stmt, "// " + line);
        });
        return null;
      };
      AbstractEmitterVisitor.prototype.visitWriteVarExpr = function(expr, ctx) {
        var lineWasEmpty = ctx.lineIsEmpty();
        if (!lineWasEmpty) {
          ctx.print(expr, '(');
        }
        ctx.print(expr, expr.name + " = ");
        expr.value.visitExpression(this, ctx);
        if (!lineWasEmpty) {
          ctx.print(expr, ')');
        }
        return null;
      };
      AbstractEmitterVisitor.prototype.visitWriteKeyExpr = function(expr, ctx) {
        var lineWasEmpty = ctx.lineIsEmpty();
        if (!lineWasEmpty) {
          ctx.print(expr, '(');
        }
        expr.receiver.visitExpression(this, ctx);
        ctx.print(expr, "[");
        expr.index.visitExpression(this, ctx);
        ctx.print(expr, "] = ");
        expr.value.visitExpression(this, ctx);
        if (!lineWasEmpty) {
          ctx.print(expr, ')');
        }
        return null;
      };
      AbstractEmitterVisitor.prototype.visitWritePropExpr = function(expr, ctx) {
        var lineWasEmpty = ctx.lineIsEmpty();
        if (!lineWasEmpty) {
          ctx.print(expr, '(');
        }
        expr.receiver.visitExpression(this, ctx);
        ctx.print(expr, "." + expr.name + " = ");
        expr.value.visitExpression(this, ctx);
        if (!lineWasEmpty) {
          ctx.print(expr, ')');
        }
        return null;
      };
      AbstractEmitterVisitor.prototype.visitInvokeMethodExpr = function(expr, ctx) {
        expr.receiver.visitExpression(this, ctx);
        var name = expr.name;
        if (expr.builtin != null) {
          name = this.getBuiltinMethodName(expr.builtin);
          if (name == null) {
            return null;
          }
        }
        ctx.print(expr, "." + name + "(");
        this.visitAllExpressions(expr.args, ctx, ",");
        ctx.print(expr, ")");
        return null;
      };
      AbstractEmitterVisitor.prototype.visitInvokeFunctionExpr = function(expr, ctx) {
        expr.fn.visitExpression(this, ctx);
        ctx.print(expr, "(");
        this.visitAllExpressions(expr.args, ctx, ',');
        ctx.print(expr, ")");
        return null;
      };
      AbstractEmitterVisitor.prototype.visitReadVarExpr = function(ast, ctx) {
        var varName = ((ast.name));
        if (ast.builtin != null) {
          switch (ast.builtin) {
            case BuiltinVar.Super:
              varName = 'super';
              break;
            case BuiltinVar.This:
              varName = 'this';
              break;
            case BuiltinVar.CatchError:
              varName = ((CATCH_ERROR_VAR$1.name));
              break;
            case BuiltinVar.CatchStack:
              varName = ((CATCH_STACK_VAR$1.name));
              break;
            default:
              throw new Error("Unknown builtin variable " + ast.builtin);
          }
        }
        ctx.print(ast, varName);
        return null;
      };
      AbstractEmitterVisitor.prototype.visitInstantiateExpr = function(ast, ctx) {
        ctx.print(ast, "new ");
        ast.classExpr.visitExpression(this, ctx);
        ctx.print(ast, "(");
        this.visitAllExpressions(ast.args, ctx, ',');
        ctx.print(ast, ")");
        return null;
      };
      AbstractEmitterVisitor.prototype.visitLiteralExpr = function(ast, ctx) {
        var value = ast.value;
        if (typeof value === 'string') {
          ctx.print(ast, escapeIdentifier(value, this._escapeDollarInStrings));
        } else {
          ctx.print(ast, "" + value);
        }
        return null;
      };
      AbstractEmitterVisitor.prototype.visitConditionalExpr = function(ast, ctx) {
        ctx.print(ast, "(");
        ast.condition.visitExpression(this, ctx);
        ctx.print(ast, '? ');
        ast.trueCase.visitExpression(this, ctx);
        ctx.print(ast, ': ');
        ((ast.falseCase)).visitExpression(this, ctx);
        ctx.print(ast, ")");
        return null;
      };
      AbstractEmitterVisitor.prototype.visitNotExpr = function(ast, ctx) {
        ctx.print(ast, '!');
        ast.condition.visitExpression(this, ctx);
        return null;
      };
      AbstractEmitterVisitor.prototype.visitAssertNotNullExpr = function(ast, ctx) {
        ast.condition.visitExpression(this, ctx);
        return null;
      };
      AbstractEmitterVisitor.prototype.visitBinaryOperatorExpr = function(ast, ctx) {
        var opStr;
        switch (ast.operator) {
          case BinaryOperator.Equals:
            opStr = '==';
            break;
          case BinaryOperator.Identical:
            opStr = '===';
            break;
          case BinaryOperator.NotEquals:
            opStr = '!=';
            break;
          case BinaryOperator.NotIdentical:
            opStr = '!==';
            break;
          case BinaryOperator.And:
            opStr = '&&';
            break;
          case BinaryOperator.Or:
            opStr = '||';
            break;
          case BinaryOperator.Plus:
            opStr = '+';
            break;
          case BinaryOperator.Minus:
            opStr = '-';
            break;
          case BinaryOperator.Divide:
            opStr = '/';
            break;
          case BinaryOperator.Multiply:
            opStr = '*';
            break;
          case BinaryOperator.Modulo:
            opStr = '%';
            break;
          case BinaryOperator.Lower:
            opStr = '<';
            break;
          case BinaryOperator.LowerEquals:
            opStr = '<=';
            break;
          case BinaryOperator.Bigger:
            opStr = '>';
            break;
          case BinaryOperator.BiggerEquals:
            opStr = '>=';
            break;
          default:
            throw new Error("Unknown operator " + ast.operator);
        }
        ctx.print(ast, "(");
        ast.lhs.visitExpression(this, ctx);
        ctx.print(ast, " " + opStr + " ");
        ast.rhs.visitExpression(this, ctx);
        ctx.print(ast, ")");
        return null;
      };
      AbstractEmitterVisitor.prototype.visitReadPropExpr = function(ast, ctx) {
        ast.receiver.visitExpression(this, ctx);
        ctx.print(ast, ".");
        ctx.print(ast, ast.name);
        return null;
      };
      AbstractEmitterVisitor.prototype.visitReadKeyExpr = function(ast, ctx) {
        ast.receiver.visitExpression(this, ctx);
        ctx.print(ast, "[");
        ast.index.visitExpression(this, ctx);
        ctx.print(ast, "]");
        return null;
      };
      AbstractEmitterVisitor.prototype.visitLiteralArrayExpr = function(ast, ctx) {
        ctx.print(ast, "[");
        this.visitAllExpressions(ast.entries, ctx, ',');
        ctx.print(ast, "]");
        return null;
      };
      AbstractEmitterVisitor.prototype.visitLiteralMapExpr = function(ast, ctx) {
        var _this = this;
        ctx.print(ast, "{");
        this.visitAllObjects(function(entry) {
          ctx.print(ast, escapeIdentifier(entry.key, _this._escapeDollarInStrings, entry.quoted) + ":");
          entry.value.visitExpression(_this, ctx);
        }, ast.entries, ctx, ',');
        ctx.print(ast, "}");
        return null;
      };
      AbstractEmitterVisitor.prototype.visitCommaExpr = function(ast, ctx) {
        ctx.print(ast, '(');
        this.visitAllExpressions(ast.parts, ctx, ',');
        ctx.print(ast, ')');
        return null;
      };
      AbstractEmitterVisitor.prototype.visitAllExpressions = function(expressions, ctx, separator) {
        var _this = this;
        this.visitAllObjects(function(expr) {
          return expr.visitExpression(_this, ctx);
        }, expressions, ctx, separator);
      };
      AbstractEmitterVisitor.prototype.visitAllObjects = function(handler, expressions, ctx, separator) {
        var incrementedIndent = false;
        for (var i = 0; i < expressions.length; i++) {
          if (i > 0) {
            if (ctx.lineLength() > 80) {
              ctx.print(null, separator, true);
              if (!incrementedIndent) {
                ctx.incIndent();
                ctx.incIndent();
                incrementedIndent = true;
              }
            } else {
              ctx.print(null, separator, false);
            }
          }
          handler(expressions[i]);
        }
        if (incrementedIndent) {
          ctx.decIndent();
          ctx.decIndent();
        }
      };
      AbstractEmitterVisitor.prototype.visitAllStatements = function(statements, ctx) {
        var _this = this;
        statements.forEach(function(stmt) {
          return stmt.visitStatement(_this, ctx);
        });
      };
      return AbstractEmitterVisitor;
    }());
    function escapeIdentifier(input, escapeDollar, alwaysQuote) {
      if (alwaysQuote === void 0) {
        alwaysQuote = true;
      }
      if (input == null) {
        return null;
      }
      var body = input.replace(_SINGLE_QUOTE_ESCAPE_STRING_RE, function() {
        var match = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          match[_i] = arguments[_i];
        }
        if (match[0] == '$') {
          return escapeDollar ? '\\$' : '$';
        } else if (match[0] == '\n') {
          return '\\n';
        } else if (match[0] == '\r') {
          return '\\r';
        } else {
          return "\\" + match[0];
        }
      });
      var requiresQuotes = alwaysQuote || !_LEGAL_IDENTIFIER_RE.test(body);
      return requiresQuotes ? "'" + body + "'" : body;
    }
    function _createIndent(count) {
      var res = '';
      for (var i = 0; i < count; i++) {
        res += _INDENT_WITH;
      }
      return res;
    }
    function debugOutputAstAsTypeScript(ast) {
      var converter = new _TsEmitterVisitor();
      var ctx = EmitterVisitorContext.createRoot();
      var asts = Array.isArray(ast) ? ast : [ast];
      asts.forEach(function(ast) {
        if (ast instanceof Statement) {
          ast.visitStatement(converter, ctx);
        } else if (ast instanceof Expression) {
          ast.visitExpression(converter, ctx);
        } else if (ast instanceof Type$1) {
          ast.visitType(converter, ctx);
        } else {
          throw new Error("Don't know how to print debug info for " + ast);
        }
      });
      return ctx.toSource();
    }
    var TypeScriptEmitter = (function() {
      function TypeScriptEmitter() {}
      TypeScriptEmitter.prototype.emitStatementsAndContext = function(genFilePath, stmts, preamble, emitSourceMaps, referenceFilter) {
        if (preamble === void 0) {
          preamble = '';
        }
        if (emitSourceMaps === void 0) {
          emitSourceMaps = true;
        }
        var converter = new _TsEmitterVisitor(referenceFilter);
        var ctx = EmitterVisitorContext.createRoot();
        converter.visitAllStatements(stmts, ctx);
        var preambleLines = preamble ? preamble.split('\n') : [];
        converter.reexports.forEach(function(reexports, exportedModuleName) {
          var reexportsCode = reexports.map(function(reexport) {
            return reexport.name + " as " + reexport.as;
          }).join(',');
          preambleLines.push("export {" + reexportsCode + "} from '" + exportedModuleName + "';");
        });
        converter.importsWithPrefixes.forEach(function(prefix, importedModuleName) {
          preambleLines.push("imp" + ("ort * as " + prefix + " from '" + importedModuleName + "';"));
        });
        var sm = emitSourceMaps ? ctx.toSourceMapGenerator(genFilePath, preambleLines.length).toJsComment() : '';
        var lines = preambleLines.concat([ctx.toSource(), sm]);
        if (sm) {
          lines.push('');
        }
        ctx.setPreambleLineCount(preambleLines.length);
        return {
          sourceText: lines.join('\n'),
          context: ctx
        };
      };
      TypeScriptEmitter.prototype.emitStatements = function(genFilePath, stmts, preamble) {
        if (preamble === void 0) {
          preamble = '';
        }
        return this.emitStatementsAndContext(genFilePath, stmts, preamble).sourceText;
      };
      return TypeScriptEmitter;
    }());
    var _TsEmitterVisitor = (function(_super) {
      __extends(_TsEmitterVisitor, _super);
      function _TsEmitterVisitor(referenceFilter) {
        var _this = _super.call(this, false) || this;
        _this.referenceFilter = referenceFilter;
        _this.typeExpression = 0;
        _this.importsWithPrefixes = new Map();
        _this.reexports = new Map();
        return _this;
      }
      _TsEmitterVisitor.prototype.visitType = function(t, ctx, defaultType) {
        if (defaultType === void 0) {
          defaultType = 'any';
        }
        if (t) {
          this.typeExpression++;
          t.visitType(this, ctx);
          this.typeExpression--;
        } else {
          ctx.print(null, defaultType);
        }
      };
      _TsEmitterVisitor.prototype.visitLiteralExpr = function(ast, ctx) {
        var value = ast.value;
        if (value == null && ast.type != INFERRED_TYPE) {
          ctx.print(ast, "(" + value + " as any)");
          return null;
        }
        return _super.prototype.visitLiteralExpr.call(this, ast, ctx);
      };
      _TsEmitterVisitor.prototype.visitLiteralArrayExpr = function(ast, ctx) {
        if (ast.entries.length === 0) {
          ctx.print(ast, '(');
        }
        var result = _super.prototype.visitLiteralArrayExpr.call(this, ast, ctx);
        if (ast.entries.length === 0) {
          ctx.print(ast, ' as any[])');
        }
        return result;
      };
      _TsEmitterVisitor.prototype.visitExternalExpr = function(ast, ctx) {
        this._visitIdentifier(ast.value, ast.typeParams, ctx);
        return null;
      };
      _TsEmitterVisitor.prototype.visitAssertNotNullExpr = function(ast, ctx) {
        var result = _super.prototype.visitAssertNotNullExpr.call(this, ast, ctx);
        ctx.print(ast, '!');
        return result;
      };
      _TsEmitterVisitor.prototype.visitDeclareVarStmt = function(stmt, ctx) {
        if (stmt.hasModifier(StmtModifier.Exported) && stmt.value instanceof ExternalExpr && !stmt.type) {
          var _a = stmt.value.value,
              name_1 = _a.name,
              moduleName = _a.moduleName;
          if (moduleName) {
            var reexports = this.reexports.get(moduleName);
            if (!reexports) {
              reexports = [];
              this.reexports.set(moduleName, reexports);
            }
            reexports.push({
              name: ((name_1)),
              as: stmt.name
            });
            return null;
          }
        }
        if (stmt.hasModifier(StmtModifier.Exported)) {
          ctx.print(stmt, "export ");
        }
        if (stmt.hasModifier(StmtModifier.Final)) {
          ctx.print(stmt, "const");
        } else {
          ctx.print(stmt, "var");
        }
        ctx.print(stmt, " " + stmt.name);
        this._printColonType(stmt.type, ctx);
        ctx.print(stmt, " = ");
        stmt.value.visitExpression(this, ctx);
        ctx.println(stmt, ";");
        return null;
      };
      _TsEmitterVisitor.prototype.visitCastExpr = function(ast, ctx) {
        ctx.print(ast, "(<");
        ((ast.type)).visitType(this, ctx);
        ctx.print(ast, ">");
        ast.value.visitExpression(this, ctx);
        ctx.print(ast, ")");
        return null;
      };
      _TsEmitterVisitor.prototype.visitInstantiateExpr = function(ast, ctx) {
        ctx.print(ast, "new ");
        this.typeExpression++;
        ast.classExpr.visitExpression(this, ctx);
        this.typeExpression--;
        ctx.print(ast, "(");
        this.visitAllExpressions(ast.args, ctx, ',');
        ctx.print(ast, ")");
        return null;
      };
      _TsEmitterVisitor.prototype.visitDeclareClassStmt = function(stmt, ctx) {
        var _this = this;
        ctx.pushClass(stmt);
        if (stmt.hasModifier(StmtModifier.Exported)) {
          ctx.print(stmt, "export ");
        }
        ctx.print(stmt, "class " + stmt.name);
        if (stmt.parent != null) {
          ctx.print(stmt, " extends ");
          this.typeExpression++;
          stmt.parent.visitExpression(this, ctx);
          this.typeExpression--;
        }
        ctx.println(stmt, " {");
        ctx.incIndent();
        stmt.fields.forEach(function(field) {
          return _this._visitClassField(field, ctx);
        });
        if (stmt.constructorMethod != null) {
          this._visitClassConstructor(stmt, ctx);
        }
        stmt.getters.forEach(function(getter) {
          return _this._visitClassGetter(getter, ctx);
        });
        stmt.methods.forEach(function(method) {
          return _this._visitClassMethod(method, ctx);
        });
        ctx.decIndent();
        ctx.println(stmt, "}");
        ctx.popClass();
        return null;
      };
      _TsEmitterVisitor.prototype._visitClassField = function(field, ctx) {
        if (field.hasModifier(StmtModifier.Private)) {
          ctx.print(null, "/*private*/ ");
        }
        ctx.print(null, field.name);
        this._printColonType(field.type, ctx);
        ctx.println(null, ";");
      };
      _TsEmitterVisitor.prototype._visitClassGetter = function(getter, ctx) {
        if (getter.hasModifier(StmtModifier.Private)) {
          ctx.print(null, "private ");
        }
        ctx.print(null, "get " + getter.name + "()");
        this._printColonType(getter.type, ctx);
        ctx.println(null, " {");
        ctx.incIndent();
        this.visitAllStatements(getter.body, ctx);
        ctx.decIndent();
        ctx.println(null, "}");
      };
      _TsEmitterVisitor.prototype._visitClassConstructor = function(stmt, ctx) {
        ctx.print(stmt, "constructor(");
        this._visitParams(stmt.constructorMethod.params, ctx);
        ctx.println(stmt, ") {");
        ctx.incIndent();
        this.visitAllStatements(stmt.constructorMethod.body, ctx);
        ctx.decIndent();
        ctx.println(stmt, "}");
      };
      _TsEmitterVisitor.prototype._visitClassMethod = function(method, ctx) {
        if (method.hasModifier(StmtModifier.Private)) {
          ctx.print(null, "private ");
        }
        ctx.print(null, method.name + "(");
        this._visitParams(method.params, ctx);
        ctx.print(null, ")");
        this._printColonType(method.type, ctx, 'void');
        ctx.println(null, " {");
        ctx.incIndent();
        this.visitAllStatements(method.body, ctx);
        ctx.decIndent();
        ctx.println(null, "}");
      };
      _TsEmitterVisitor.prototype.visitFunctionExpr = function(ast, ctx) {
        ctx.print(ast, "(");
        this._visitParams(ast.params, ctx);
        ctx.print(ast, ")");
        this._printColonType(ast.type, ctx, 'void');
        ctx.println(ast, " => {");
        ctx.incIndent();
        this.visitAllStatements(ast.statements, ctx);
        ctx.decIndent();
        ctx.print(ast, "}");
        return null;
      };
      _TsEmitterVisitor.prototype.visitDeclareFunctionStmt = function(stmt, ctx) {
        if (stmt.hasModifier(StmtModifier.Exported)) {
          ctx.print(stmt, "export ");
        }
        ctx.print(stmt, "function " + stmt.name + "(");
        this._visitParams(stmt.params, ctx);
        ctx.print(stmt, ")");
        this._printColonType(stmt.type, ctx, 'void');
        ctx.println(stmt, " {");
        ctx.incIndent();
        this.visitAllStatements(stmt.statements, ctx);
        ctx.decIndent();
        ctx.println(stmt, "}");
        return null;
      };
      _TsEmitterVisitor.prototype.visitTryCatchStmt = function(stmt, ctx) {
        ctx.println(stmt, "try {");
        ctx.incIndent();
        this.visitAllStatements(stmt.bodyStmts, ctx);
        ctx.decIndent();
        ctx.println(stmt, "} catch (" + CATCH_ERROR_VAR$1.name + ") {");
        ctx.incIndent();
        var catchStmts = [(CATCH_STACK_VAR$1.set(CATCH_ERROR_VAR$1.prop('stack', null)).toDeclStmt(null, [StmtModifier.Final]))].concat(stmt.catchStmts);
        this.visitAllStatements(catchStmts, ctx);
        ctx.decIndent();
        ctx.println(stmt, "}");
        return null;
      };
      _TsEmitterVisitor.prototype.visitBuiltintType = function(type, ctx) {
        var typeStr;
        switch (type.name) {
          case BuiltinTypeName.Bool:
            typeStr = 'boolean';
            break;
          case BuiltinTypeName.Dynamic:
            typeStr = 'any';
            break;
          case BuiltinTypeName.Function:
            typeStr = 'Function';
            break;
          case BuiltinTypeName.Number:
            typeStr = 'number';
            break;
          case BuiltinTypeName.Int:
            typeStr = 'number';
            break;
          case BuiltinTypeName.String:
            typeStr = 'string';
            break;
          default:
            throw new Error("Unsupported builtin type " + type.name);
        }
        ctx.print(null, typeStr);
        return null;
      };
      _TsEmitterVisitor.prototype.visitExpressionType = function(ast, ctx) {
        ast.value.visitExpression(this, ctx);
        return null;
      };
      _TsEmitterVisitor.prototype.visitArrayType = function(type, ctx) {
        this.visitType(type.of, ctx);
        ctx.print(null, "[]");
        return null;
      };
      _TsEmitterVisitor.prototype.visitMapType = function(type, ctx) {
        ctx.print(null, "{[key: string]:");
        this.visitType(type.valueType, ctx);
        ctx.print(null, "}");
        return null;
      };
      _TsEmitterVisitor.prototype.getBuiltinMethodName = function(method) {
        var name;
        switch (method) {
          case BuiltinMethod.ConcatArray:
            name = 'concat';
            break;
          case BuiltinMethod.SubscribeObservable:
            name = 'subscribe';
            break;
          case BuiltinMethod.Bind:
            name = 'bind';
            break;
          default:
            throw new Error("Unknown builtin method: " + method);
        }
        return name;
      };
      _TsEmitterVisitor.prototype._visitParams = function(params, ctx) {
        var _this = this;
        this.visitAllObjects(function(param) {
          ctx.print(null, param.name);
          _this._printColonType(param.type, ctx);
        }, params, ctx, ',');
      };
      _TsEmitterVisitor.prototype._visitIdentifier = function(value, typeParams, ctx) {
        var _this = this;
        var name = value.name,
            moduleName = value.moduleName;
        if (this.referenceFilter && this.referenceFilter(value)) {
          ctx.print(null, '(null as any)');
          return;
        }
        if (moduleName) {
          var prefix = this.importsWithPrefixes.get(moduleName);
          if (prefix == null) {
            prefix = "i" + this.importsWithPrefixes.size;
            this.importsWithPrefixes.set(moduleName, prefix);
          }
          ctx.print(null, prefix + ".");
        }
        ctx.print(null, ((name)));
        if (this.typeExpression > 0) {
          var suppliedParameters = typeParams || [];
          if (suppliedParameters.length > 0) {
            ctx.print(null, "<");
            this.visitAllObjects(function(type) {
              return type.visitType(_this, ctx);
            }, ((typeParams)), ctx, ',');
            ctx.print(null, ">");
          }
        }
      };
      _TsEmitterVisitor.prototype._printColonType = function(type, ctx, defaultType) {
        if (type !== INFERRED_TYPE) {
          ctx.print(null, ':');
          this.visitType(type, ctx, defaultType);
        }
      };
      return _TsEmitterVisitor;
    }(AbstractEmitterVisitor));
    var PipeResolver = (function() {
      function PipeResolver(_reflector) {
        this._reflector = _reflector;
      }
      PipeResolver.prototype.isPipe = function(type) {
        var typeMetadata = this._reflector.annotations(resolveForwardRef(type));
        return typeMetadata && typeMetadata.some(createPipe.isTypeOf);
      };
      PipeResolver.prototype.resolve = function(type, throwIfNotFound) {
        if (throwIfNotFound === void 0) {
          throwIfNotFound = true;
        }
        var metas = this._reflector.annotations(resolveForwardRef(type));
        if (metas) {
          var annotation = findLast(metas, createPipe.isTypeOf);
          if (annotation) {
            return annotation;
          }
        }
        if (throwIfNotFound) {
          throw new Error("No Pipe decorator found on " + stringify(type));
        }
        return null;
      };
      return PipeResolver;
    }());
    var SECURITY_SCHEMA = {};
    function registerContext(ctx, specs) {
      for (var _i = 0,
          specs_1 = specs; _i < specs_1.length; _i++) {
        var spec = specs_1[_i];
        SECURITY_SCHEMA[spec.toLowerCase()] = ctx;
      }
    }
    registerContext(SecurityContext.HTML, ['iframe|srcdoc', '*|innerHTML', '*|outerHTML']);
    registerContext(SecurityContext.STYLE, ['*|style']);
    registerContext(SecurityContext.URL, ['*|formAction', 'area|href', 'area|ping', 'audio|src', 'a|href', 'a|ping', 'blockquote|cite', 'body|background', 'del|cite', 'form|action', 'img|src', 'img|srcset', 'input|src', 'ins|cite', 'q|cite', 'source|src', 'source|srcset', 'track|src', 'video|poster', 'video|src']);
    registerContext(SecurityContext.RESOURCE_URL, ['applet|code', 'applet|codebase', 'base|href', 'embed|src', 'frame|src', 'head|profile', 'html|manifest', 'iframe|src', 'link|href', 'media|src', 'object|codebase', 'object|data', 'script|src']);
    var ElementSchemaRegistry = (function() {
      function ElementSchemaRegistry() {}
      return ElementSchemaRegistry;
    }());
    var BOOLEAN = 'boolean';
    var NUMBER = 'number';
    var STRING = 'string';
    var OBJECT = 'object';
    var SCHEMA = ['[Element]|textContent,%classList,className,id,innerHTML,*beforecopy,*beforecut,*beforepaste,*copy,*cut,*paste,*search,*selectstart,*webkitfullscreenchange,*webkitfullscreenerror,*wheel,outerHTML,#scrollLeft,#scrollTop,slot' + ',*message,*mozfullscreenchange,*mozfullscreenerror,*mozpointerlockchange,*mozpointerlockerror,*webglcontextcreationerror,*webglcontextlost,*webglcontextrestored', '[HTMLElement]^[Element]|accessKey,contentEditable,dir,!draggable,!hidden,innerText,lang,*abort,*auxclick,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*cuechange,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*gotpointercapture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*pause,*play,*playing,*pointercancel,*pointerdown,*pointerenter,*pointerleave,*pointermove,*pointerout,*pointerover,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*seeked,*seeking,*select,*show,*stalled,*submit,*suspend,*timeupdate,*toggle,*volumechange,*waiting,outerText,!spellcheck,%style,#tabIndex,title,!translate', 'abbr,address,article,aside,b,bdi,bdo,cite,code,dd,dfn,dt,em,figcaption,figure,footer,header,i,kbd,main,mark,nav,noscript,rb,rp,rt,rtc,ruby,s,samp,section,small,strong,sub,sup,u,var,wbr^[HTMLElement]|accessKey,contentEditable,dir,!draggable,!hidden,innerText,lang,*abort,*auxclick,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*cuechange,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*gotpointercapture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*pause,*play,*playing,*pointercancel,*pointerdown,*pointerenter,*pointerleave,*pointermove,*pointerout,*pointerover,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*seeked,*seeking,*select,*show,*stalled,*submit,*suspend,*timeupdate,*toggle,*volumechange,*waiting,outerText,!spellcheck,%style,#tabIndex,title,!translate', 'media^[HTMLElement]|!autoplay,!controls,%controlsList,%crossOrigin,#currentTime,!defaultMuted,#defaultPlaybackRate,!disableRemotePlayback,!loop,!muted,*encrypted,*waitingforkey,#playbackRate,preload,src,%srcObject,#volume', ':svg:^[HTMLElement]|*abort,*auxclick,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*cuechange,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*gotpointercapture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*pause,*play,*playing,*pointercancel,*pointerdown,*pointerenter,*pointerleave,*pointermove,*pointerout,*pointerover,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*seeked,*seeking,*select,*show,*stalled,*submit,*suspend,*timeupdate,*toggle,*volumechange,*waiting,%style,#tabIndex', ':svg:graphics^:svg:|', ':svg:animation^:svg:|*begin,*end,*repeat', ':svg:geometry^:svg:|', ':svg:componentTransferFunction^:svg:|', ':svg:gradient^:svg:|', ':svg:textContent^:svg:graphics|', ':svg:textPositioning^:svg:textContent|', 'a^[HTMLElement]|charset,coords,download,hash,host,hostname,href,hreflang,name,password,pathname,ping,port,protocol,referrerPolicy,rel,rev,search,shape,target,text,type,username', 'area^[HTMLElement]|alt,coords,download,hash,host,hostname,href,!noHref,password,pathname,ping,port,protocol,referrerPolicy,rel,search,shape,target,username', 'audio^media|', 'br^[HTMLElement]|clear', 'base^[HTMLElement]|href,target', 'body^[HTMLElement]|aLink,background,bgColor,link,*beforeunload,*blur,*error,*focus,*hashchange,*languagechange,*load,*message,*offline,*online,*pagehide,*pageshow,*popstate,*rejectionhandled,*resize,*scroll,*storage,*unhandledrejection,*unload,text,vLink', 'button^[HTMLElement]|!autofocus,!disabled,formAction,formEnctype,formMethod,!formNoValidate,formTarget,name,type,value', 'canvas^[HTMLElement]|#height,#width', 'content^[HTMLElement]|select', 'dl^[HTMLElement]|!compact', 'datalist^[HTMLElement]|', 'details^[HTMLElement]|!open', 'dialog^[HTMLElement]|!open,returnValue', 'dir^[HTMLElement]|!compact', 'div^[HTMLElement]|align', 'embed^[HTMLElement]|align,height,name,src,type,width', 'fieldset^[HTMLElement]|!disabled,name', 'font^[HTMLElement]|color,face,size', 'form^[HTMLElement]|acceptCharset,action,autocomplete,encoding,enctype,method,name,!noValidate,target', 'frame^[HTMLElement]|frameBorder,longDesc,marginHeight,marginWidth,name,!noResize,scrolling,src', 'frameset^[HTMLElement]|cols,*beforeunload,*blur,*error,*focus,*hashchange,*languagechange,*load,*message,*offline,*online,*pagehide,*pageshow,*popstate,*rejectionhandled,*resize,*scroll,*storage,*unhandledrejection,*unload,rows', 'hr^[HTMLElement]|align,color,!noShade,size,width', 'head^[HTMLElement]|', 'h1,h2,h3,h4,h5,h6^[HTMLElement]|align', 'html^[HTMLElement]|version', 'iframe^[HTMLElement]|align,!allowFullscreen,frameBorder,height,longDesc,marginHeight,marginWidth,name,referrerPolicy,%sandbox,scrolling,src,srcdoc,width', 'img^[HTMLElement]|align,alt,border,%crossOrigin,#height,#hspace,!isMap,longDesc,lowsrc,name,referrerPolicy,sizes,src,srcset,useMap,#vspace,#width', 'input^[HTMLElement]|accept,align,alt,autocapitalize,autocomplete,!autofocus,!checked,!defaultChecked,defaultValue,dirName,!disabled,%files,formAction,formEnctype,formMethod,!formNoValidate,formTarget,#height,!incremental,!indeterminate,max,#maxLength,min,#minLength,!multiple,name,pattern,placeholder,!readOnly,!required,selectionDirection,#selectionEnd,#selectionStart,#size,src,step,type,useMap,value,%valueAsDate,#valueAsNumber,#width', 'li^[HTMLElement]|type,#value', 'label^[HTMLElement]|htmlFor', 'legend^[HTMLElement]|align', 'link^[HTMLElement]|as,charset,%crossOrigin,!disabled,href,hreflang,integrity,media,referrerPolicy,rel,%relList,rev,%sizes,target,type', 'map^[HTMLElement]|name', 'marquee^[HTMLElement]|behavior,bgColor,direction,height,#hspace,#loop,#scrollAmount,#scrollDelay,!trueSpeed,#vspace,width', 'menu^[HTMLElement]|!compact', 'meta^[HTMLElement]|content,httpEquiv,name,scheme', 'meter^[HTMLElement]|#high,#low,#max,#min,#optimum,#value', 'ins,del^[HTMLElement]|cite,dateTime', 'ol^[HTMLElement]|!compact,!reversed,#start,type', 'object^[HTMLElement]|align,archive,border,code,codeBase,codeType,data,!declare,height,#hspace,name,standby,type,useMap,#vspace,width', 'optgroup^[HTMLElement]|!disabled,label', 'option^[HTMLElement]|!defaultSelected,!disabled,label,!selected,text,value', 'output^[HTMLElement]|defaultValue,%htmlFor,name,value', 'p^[HTMLElement]|align', 'param^[HTMLElement]|name,type,value,valueType', 'picture^[HTMLElement]|', 'pre^[HTMLElement]|#width', 'progress^[HTMLElement]|#max,#value', 'q,blockquote,cite^[HTMLElement]|', 'script^[HTMLElement]|!async,charset,%crossOrigin,!defer,event,htmlFor,integrity,src,text,type', 'select^[HTMLElement]|!autofocus,!disabled,#length,!multiple,name,!required,#selectedIndex,#size,value', 'shadow^[HTMLElement]|', 'slot^[HTMLElement]|name', 'source^[HTMLElement]|media,sizes,src,srcset,type', 'span^[HTMLElement]|', 'style^[HTMLElement]|!disabled,media,type', 'caption^[HTMLElement]|align', 'th,td^[HTMLElement]|abbr,align,axis,bgColor,ch,chOff,#colSpan,headers,height,!noWrap,#rowSpan,scope,vAlign,width', 'col,colgroup^[HTMLElement]|align,ch,chOff,#span,vAlign,width', 'table^[HTMLElement]|align,bgColor,border,%caption,cellPadding,cellSpacing,frame,rules,summary,%tFoot,%tHead,width', 'tr^[HTMLElement]|align,bgColor,ch,chOff,vAlign', 'tfoot,thead,tbody^[HTMLElement]|align,ch,chOff,vAlign', 'template^[HTMLElement]|', 'textarea^[HTMLElement]|autocapitalize,!autofocus,#cols,defaultValue,dirName,!disabled,#maxLength,#minLength,name,placeholder,!readOnly,!required,#rows,selectionDirection,#selectionEnd,#selectionStart,value,wrap', 'title^[HTMLElement]|text', 'track^[HTMLElement]|!default,kind,label,src,srclang', 'ul^[HTMLElement]|!compact,type', 'unknown^[HTMLElement]|', 'video^media|#height,poster,#width', ':svg:a^:svg:graphics|', ':svg:animate^:svg:animation|', ':svg:animateMotion^:svg:animation|', ':svg:animateTransform^:svg:animation|', ':svg:circle^:svg:geometry|', ':svg:clipPath^:svg:graphics|', ':svg:defs^:svg:graphics|', ':svg:desc^:svg:|', ':svg:discard^:svg:|', ':svg:ellipse^:svg:geometry|', ':svg:feBlend^:svg:|', ':svg:feColorMatrix^:svg:|', ':svg:feComponentTransfer^:svg:|', ':svg:feComposite^:svg:|', ':svg:feConvolveMatrix^:svg:|', ':svg:feDiffuseLighting^:svg:|', ':svg:feDisplacementMap^:svg:|', ':svg:feDistantLight^:svg:|', ':svg:feDropShadow^:svg:|', ':svg:feFlood^:svg:|', ':svg:feFuncA^:svg:componentTransferFunction|', ':svg:feFuncB^:svg:componentTransferFunction|', ':svg:feFuncG^:svg:componentTransferFunction|', ':svg:feFuncR^:svg:componentTransferFunction|', ':svg:feGaussianBlur^:svg:|', ':svg:feImage^:svg:|', ':svg:feMerge^:svg:|', ':svg:feMergeNode^:svg:|', ':svg:feMorphology^:svg:|', ':svg:feOffset^:svg:|', ':svg:fePointLight^:svg:|', ':svg:feSpecularLighting^:svg:|', ':svg:feSpotLight^:svg:|', ':svg:feTile^:svg:|', ':svg:feTurbulence^:svg:|', ':svg:filter^:svg:|', ':svg:foreignObject^:svg:graphics|', ':svg:g^:svg:graphics|', ':svg:image^:svg:graphics|', ':svg:line^:svg:geometry|', ':svg:linearGradient^:svg:gradient|', ':svg:mpath^:svg:|', ':svg:marker^:svg:|', ':svg:mask^:svg:|', ':svg:metadata^:svg:|', ':svg:path^:svg:geometry|', ':svg:pattern^:svg:|', ':svg:polygon^:svg:geometry|', ':svg:polyline^:svg:geometry|', ':svg:radialGradient^:svg:gradient|', ':svg:rect^:svg:geometry|', ':svg:svg^:svg:graphics|#currentScale,#zoomAndPan', ':svg:script^:svg:|type', ':svg:set^:svg:animation|', ':svg:stop^:svg:|', ':svg:style^:svg:|!disabled,media,title,type', ':svg:switch^:svg:graphics|', ':svg:symbol^:svg:|', ':svg:tspan^:svg:textPositioning|', ':svg:text^:svg:textPositioning|', ':svg:textPath^:svg:textContent|', ':svg:title^:svg:|', ':svg:use^:svg:graphics|', ':svg:view^:svg:|#zoomAndPan', 'data^[HTMLElement]|value', 'keygen^[HTMLElement]|!autofocus,challenge,!disabled,form,keytype,name', 'menuitem^[HTMLElement]|type,label,icon,!disabled,!checked,radiogroup,!default', 'summary^[HTMLElement]|', 'time^[HTMLElement]|dateTime', ':svg:cursor^:svg:|'];
    var _ATTR_TO_PROP = {
      'class': 'className',
      'for': 'htmlFor',
      'formaction': 'formAction',
      'innerHtml': 'innerHTML',
      'readonly': 'readOnly',
      'tabindex': 'tabIndex'
    };
    var DomElementSchemaRegistry = (function(_super) {
      __extends(DomElementSchemaRegistry, _super);
      function DomElementSchemaRegistry() {
        var _this = _super.call(this) || this;
        _this._schema = {};
        SCHEMA.forEach(function(encodedType) {
          var type = {};
          var _a = encodedType.split('|'),
              strType = _a[0],
              strProperties = _a[1];
          var properties = strProperties.split(',');
          var _b = strType.split('^'),
              typeNames = _b[0],
              superName = _b[1];
          typeNames.split(',').forEach(function(tag) {
            return _this._schema[tag.toLowerCase()] = type;
          });
          var superType = superName && _this._schema[superName.toLowerCase()];
          if (superType) {
            Object.keys(superType).forEach(function(prop) {
              type[prop] = superType[prop];
            });
          }
          properties.forEach(function(property) {
            if (property.length > 0) {
              switch (property[0]) {
                case '*':
                  break;
                case '!':
                  type[property.substring(1)] = BOOLEAN;
                  break;
                case '#':
                  type[property.substring(1)] = NUMBER;
                  break;
                case '%':
                  type[property.substring(1)] = OBJECT;
                  break;
                default:
                  type[property] = STRING;
              }
            }
          });
        });
        return _this;
      }
      DomElementSchemaRegistry.prototype.hasProperty = function(tagName, propName, schemaMetas) {
        if (schemaMetas.some(function(schema) {
          return schema.name === NO_ERRORS_SCHEMA.name;
        })) {
          return true;
        }
        if (tagName.indexOf('-') > -1) {
          if (isNgContainer(tagName) || isNgContent(tagName)) {
            return false;
          }
          if (schemaMetas.some(function(schema) {
            return schema.name === CUSTOM_ELEMENTS_SCHEMA.name;
          })) {
            return true;
          }
        }
        var elementProperties = this._schema[tagName.toLowerCase()] || this._schema['unknown'];
        return !!elementProperties[propName];
      };
      DomElementSchemaRegistry.prototype.hasElement = function(tagName, schemaMetas) {
        if (schemaMetas.some(function(schema) {
          return schema.name === NO_ERRORS_SCHEMA.name;
        })) {
          return true;
        }
        if (tagName.indexOf('-') > -1) {
          if (isNgContainer(tagName) || isNgContent(tagName)) {
            return true;
          }
          if (schemaMetas.some(function(schema) {
            return schema.name === CUSTOM_ELEMENTS_SCHEMA.name;
          })) {
            return true;
          }
        }
        return !!this._schema[tagName.toLowerCase()];
      };
      DomElementSchemaRegistry.prototype.securityContext = function(tagName, propName, isAttribute) {
        if (isAttribute) {
          propName = this.getMappedPropName(propName);
        }
        tagName = tagName.toLowerCase();
        propName = propName.toLowerCase();
        var ctx = SECURITY_SCHEMA[tagName + '|' + propName];
        if (ctx) {
          return ctx;
        }
        ctx = SECURITY_SCHEMA['*|' + propName];
        return ctx ? ctx : SecurityContext.NONE;
      };
      DomElementSchemaRegistry.prototype.getMappedPropName = function(propName) {
        return _ATTR_TO_PROP[propName] || propName;
      };
      DomElementSchemaRegistry.prototype.getDefaultComponentElementName = function() {
        return 'ng-component';
      };
      DomElementSchemaRegistry.prototype.validateProperty = function(name) {
        if (name.toLowerCase().startsWith('on')) {
          var msg = "Binding to event property '" + name + "' is disallowed for security reasons, " + ("please use (" + name.slice(2) + ")=...") + ("\nIf '" + name + "' is a directive input, make sure the directive is imported by the") + " current module.";
          return {
            error: true,
            msg: msg
          };
        } else {
          return {error: false};
        }
      };
      DomElementSchemaRegistry.prototype.validateAttribute = function(name) {
        if (name.toLowerCase().startsWith('on')) {
          var msg = "Binding to event attribute '" + name + "' is disallowed for security reasons, " + ("please use (" + name.slice(2) + ")=...");
          return {
            error: true,
            msg: msg
          };
        } else {
          return {error: false};
        }
      };
      DomElementSchemaRegistry.prototype.allKnownElementNames = function() {
        return Object.keys(this._schema);
      };
      DomElementSchemaRegistry.prototype.normalizeAnimationStyleProperty = function(propName) {
        return dashCaseToCamelCase(propName);
      };
      DomElementSchemaRegistry.prototype.normalizeAnimationStyleValue = function(camelCaseProp, userProvidedProp, val) {
        var unit = '';
        var strVal = val.toString().trim();
        var errorMsg = ((null));
        if (_isPixelDimensionStyle(camelCaseProp) && val !== 0 && val !== '0') {
          if (typeof val === 'number') {
            unit = 'px';
          } else {
            var valAndSuffixMatch = val.match(/^[+-]?[\d\.]+([a-z]*)$/);
            if (valAndSuffixMatch && valAndSuffixMatch[1].length == 0) {
              errorMsg = "Please provide a CSS unit value for " + userProvidedProp + ":" + val;
            }
          }
        }
        return {
          error: errorMsg,
          value: strVal + unit
        };
      };
      return DomElementSchemaRegistry;
    }(ElementSchemaRegistry));
    function _isPixelDimensionStyle(prop) {
      switch (prop) {
        case 'width':
        case 'height':
        case 'minWidth':
        case 'minHeight':
        case 'maxWidth':
        case 'maxHeight':
        case 'left':
        case 'top':
        case 'bottom':
        case 'right':
        case 'fontSize':
        case 'outlineWidth':
        case 'outlineOffset':
        case 'paddingTop':
        case 'paddingLeft':
        case 'paddingBottom':
        case 'paddingRight':
        case 'marginTop':
        case 'marginLeft':
        case 'marginBottom':
        case 'marginRight':
        case 'borderRadius':
        case 'borderWidth':
        case 'borderTopWidth':
        case 'borderLeftWidth':
        case 'borderRightWidth':
        case 'borderBottomWidth':
        case 'textIndent':
          return true;
        default:
          return false;
      }
    }
    var ShadowCss = (function() {
      function ShadowCss() {
        this.strictStyling = true;
      }
      ShadowCss.prototype.shimCssText = function(cssText, selector, hostSelector) {
        if (hostSelector === void 0) {
          hostSelector = '';
        }
        var commentsWithHash = extractCommentsWithHash(cssText);
        cssText = stripComments(cssText);
        cssText = this._insertDirectives(cssText);
        var scopedCssText = this._scopeCssText(cssText, selector, hostSelector);
        return [scopedCssText].concat(commentsWithHash).join('\n');
      };
      ShadowCss.prototype._insertDirectives = function(cssText) {
        cssText = this._insertPolyfillDirectivesInCssText(cssText);
        return this._insertPolyfillRulesInCssText(cssText);
      };
      ShadowCss.prototype._insertPolyfillDirectivesInCssText = function(cssText) {
        return cssText.replace(_cssContentNextSelectorRe, function() {
          var m = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            m[_i] = arguments[_i];
          }
          return m[2] + '{';
        });
      };
      ShadowCss.prototype._insertPolyfillRulesInCssText = function(cssText) {
        return cssText.replace(_cssContentRuleRe, function() {
          var m = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            m[_i] = arguments[_i];
          }
          var rule = m[0].replace(m[1], '').replace(m[2], '');
          return m[4] + rule;
        });
      };
      ShadowCss.prototype._scopeCssText = function(cssText, scopeSelector, hostSelector) {
        var unscopedRules = this._extractUnscopedRulesFromCssText(cssText);
        cssText = this._insertPolyfillHostInCssText(cssText);
        cssText = this._convertColonHost(cssText);
        cssText = this._convertColonHostContext(cssText);
        cssText = this._convertShadowDOMSelectors(cssText);
        if (scopeSelector) {
          cssText = this._scopeSelectors(cssText, scopeSelector, hostSelector);
        }
        cssText = cssText + '\n' + unscopedRules;
        return cssText.trim();
      };
      ShadowCss.prototype._extractUnscopedRulesFromCssText = function(cssText) {
        var r = '';
        var m;
        _cssContentUnscopedRuleRe.lastIndex = 0;
        while ((m = _cssContentUnscopedRuleRe.exec(cssText)) !== null) {
          var rule = m[0].replace(m[2], '').replace(m[1], m[4]);
          r += rule + '\n\n';
        }
        return r;
      };
      ShadowCss.prototype._convertColonHost = function(cssText) {
        return this._convertColonRule(cssText, _cssColonHostRe, this._colonHostPartReplacer);
      };
      ShadowCss.prototype._convertColonHostContext = function(cssText) {
        return this._convertColonRule(cssText, _cssColonHostContextRe, this._colonHostContextPartReplacer);
      };
      ShadowCss.prototype._convertColonRule = function(cssText, regExp, partReplacer) {
        return cssText.replace(regExp, function() {
          var m = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            m[_i] = arguments[_i];
          }
          if (m[2]) {
            var parts = m[2].split(',');
            var r = [];
            for (var i = 0; i < parts.length; i++) {
              var p = parts[i].trim();
              if (!p)
                break;
              r.push(partReplacer(_polyfillHostNoCombinator, p, m[3]));
            }
            return r.join(',');
          } else {
            return _polyfillHostNoCombinator + m[3];
          }
        });
      };
      ShadowCss.prototype._colonHostContextPartReplacer = function(host, part, suffix) {
        if (part.indexOf(_polyfillHost) > -1) {
          return this._colonHostPartReplacer(host, part, suffix);
        } else {
          return host + part + suffix + ', ' + part + ' ' + host + suffix;
        }
      };
      ShadowCss.prototype._colonHostPartReplacer = function(host, part, suffix) {
        return host + part.replace(_polyfillHost, '') + suffix;
      };
      ShadowCss.prototype._convertShadowDOMSelectors = function(cssText) {
        return _shadowDOMSelectorsRe.reduce(function(result, pattern) {
          return result.replace(pattern, ' ');
        }, cssText);
      };
      ShadowCss.prototype._scopeSelectors = function(cssText, scopeSelector, hostSelector) {
        var _this = this;
        return processRules(cssText, function(rule) {
          var selector = rule.selector;
          var content = rule.content;
          if (rule.selector[0] != '@') {
            selector = _this._scopeSelector(rule.selector, scopeSelector, hostSelector, _this.strictStyling);
          } else if (rule.selector.startsWith('@media') || rule.selector.startsWith('@supports') || rule.selector.startsWith('@page') || rule.selector.startsWith('@document')) {
            content = _this._scopeSelectors(rule.content, scopeSelector, hostSelector);
          }
          return new CssRule(selector, content);
        });
      };
      ShadowCss.prototype._scopeSelector = function(selector, scopeSelector, hostSelector, strict) {
        var _this = this;
        return selector.split(',').map(function(part) {
          return part.trim().split(_shadowDeepSelectors);
        }).map(function(deepParts) {
          var shallowPart = deepParts[0],
              otherParts = deepParts.slice(1);
          var applyScope = function(shallowPart) {
            if (_this._selectorNeedsScoping(shallowPart, scopeSelector)) {
              return strict ? _this._applyStrictSelectorScope(shallowPart, scopeSelector, hostSelector) : _this._applySelectorScope(shallowPart, scopeSelector, hostSelector);
            } else {
              return shallowPart;
            }
          };
          return [applyScope(shallowPart)].concat(otherParts).join(' ');
        }).join(', ');
      };
      ShadowCss.prototype._selectorNeedsScoping = function(selector, scopeSelector) {
        var re = this._makeScopeMatcher(scopeSelector);
        return !re.test(selector);
      };
      ShadowCss.prototype._makeScopeMatcher = function(scopeSelector) {
        var lre = /\[/g;
        var rre = /\]/g;
        scopeSelector = scopeSelector.replace(lre, '\\[').replace(rre, '\\]');
        return new RegExp('^(' + scopeSelector + ')' + _selectorReSuffix, 'm');
      };
      ShadowCss.prototype._applySelectorScope = function(selector, scopeSelector, hostSelector) {
        return this._applySimpleSelectorScope(selector, scopeSelector, hostSelector);
      };
      ShadowCss.prototype._applySimpleSelectorScope = function(selector, scopeSelector, hostSelector) {
        _polyfillHostRe.lastIndex = 0;
        if (_polyfillHostRe.test(selector)) {
          var replaceBy_1 = this.strictStyling ? "[" + hostSelector + "]" : scopeSelector;
          return selector.replace(_polyfillHostNoCombinatorRe, function(hnc, selector) {
            return selector.replace(/([^:]*)(:*)(.*)/, function(_, before, colon, after) {
              return before + replaceBy_1 + colon + after;
            });
          }).replace(_polyfillHostRe, replaceBy_1 + ' ');
        }
        return scopeSelector + ' ' + selector;
      };
      ShadowCss.prototype._applyStrictSelectorScope = function(selector, scopeSelector, hostSelector) {
        var _this = this;
        var isRe = /\[is=([^\]]*)\]/g;
        scopeSelector = scopeSelector.replace(isRe, function(_) {
          var parts = [];
          for (var _i = 1; _i < arguments.length; _i++) {
            parts[_i - 1] = arguments[_i];
          }
          return parts[0];
        });
        var attrName = '[' + scopeSelector + ']';
        var _scopeSelectorPart = function(p) {
          var scopedP = p.trim();
          if (!scopedP) {
            return '';
          }
          if (p.indexOf(_polyfillHostNoCombinator) > -1) {
            scopedP = _this._applySimpleSelectorScope(p, scopeSelector, hostSelector);
          } else {
            var t = p.replace(_polyfillHostRe, '');
            if (t.length > 0) {
              var matches = t.match(/([^:]*)(:*)(.*)/);
              if (matches) {
                scopedP = matches[1] + attrName + matches[2] + matches[3];
              }
            }
          }
          return scopedP;
        };
        var safeContent = new SafeSelector(selector);
        selector = safeContent.content();
        var scopedSelector = '';
        var startIndex = 0;
        var res;
        var sep = /( |>|\+|~(?!=))\s*/g;
        var hasHost = selector.indexOf(_polyfillHostNoCombinator) > -1;
        var shouldScope = !hasHost;
        while ((res = sep.exec(selector)) !== null) {
          var separator = res[1];
          var part_1 = selector.slice(startIndex, res.index).trim();
          shouldScope = shouldScope || part_1.indexOf(_polyfillHostNoCombinator) > -1;
          var scopedPart = shouldScope ? _scopeSelectorPart(part_1) : part_1;
          scopedSelector += scopedPart + " " + separator + " ";
          startIndex = sep.lastIndex;
        }
        var part = selector.substring(startIndex);
        shouldScope = shouldScope || part.indexOf(_polyfillHostNoCombinator) > -1;
        scopedSelector += shouldScope ? _scopeSelectorPart(part) : part;
        return safeContent.restore(scopedSelector);
      };
      ShadowCss.prototype._insertPolyfillHostInCssText = function(selector) {
        return selector.replace(_colonHostContextRe, _polyfillHostContext).replace(_colonHostRe, _polyfillHost);
      };
      return ShadowCss;
    }());
    var SafeSelector = (function() {
      function SafeSelector(selector) {
        var _this = this;
        this.placeholders = [];
        this.index = 0;
        selector = selector.replace(/(\[[^\]]*\])/g, function(_, keep) {
          var replaceBy = "__ph-" + _this.index + "__";
          _this.placeholders.push(keep);
          _this.index++;
          return replaceBy;
        });
        this._content = selector.replace(/(:nth-[-\w]+)(\([^)]+\))/g, function(_, pseudo, exp) {
          var replaceBy = "__ph-" + _this.index + "__";
          _this.placeholders.push(exp);
          _this.index++;
          return pseudo + replaceBy;
        });
      }
      SafeSelector.prototype.restore = function(content) {
        var _this = this;
        return content.replace(/__ph-(\d+)__/g, function(ph, index) {
          return _this.placeholders[+index];
        });
      };
      SafeSelector.prototype.content = function() {
        return this._content;
      };
      return SafeSelector;
    }());
    var _cssContentNextSelectorRe = /polyfill-next-selector[^}]*content:[\s]*?(['"])(.*?)\1[;\s]*}([^{]*?){/gim;
    var _cssContentRuleRe = /(polyfill-rule)[^}]*(content:[\s]*(['"])(.*?)\3)[;\s]*[^}]*}/gim;
    var _cssContentUnscopedRuleRe = /(polyfill-unscoped-rule)[^}]*(content:[\s]*(['"])(.*?)\3)[;\s]*[^}]*}/gim;
    var _polyfillHost = '-shadowcsshost';
    var _polyfillHostContext = '-shadowcsscontext';
    var _parenSuffix = ')(?:\\((' + '(?:\\([^)(]*\\)|[^)(]*)+?' + ')\\))?([^,{]*)';
    var _cssColonHostRe = new RegExp('(' + _polyfillHost + _parenSuffix, 'gim');
    var _cssColonHostContextRe = new RegExp('(' + _polyfillHostContext + _parenSuffix, 'gim');
    var _polyfillHostNoCombinator = _polyfillHost + '-no-combinator';
    var _polyfillHostNoCombinatorRe = /-shadowcsshost-no-combinator([^\s]*)/;
    var _shadowDOMSelectorsRe = [/::shadow/g, /::content/g, /\/shadow-deep\//g, /\/shadow\//g];
    var _shadowDeepSelectors = /(?:>>>)|(?:\/deep\/)|(?:::ng-deep)/g;
    var _selectorReSuffix = '([>\\s~+\[.,{:][\\s\\S]*)?$';
    var _polyfillHostRe = /-shadowcsshost/gim;
    var _colonHostRe = /:host/gim;
    var _colonHostContextRe = /:host-context/gim;
    var _commentRe = /\/\*\s*[\s\S]*?\*\//g;
    function stripComments(input) {
      return input.replace(_commentRe, '');
    }
    var _commentWithHashRe = /\/\*\s*#\s*source(Mapping)?URL=[\s\S]+?\*\//g;
    function extractCommentsWithHash(input) {
      return input.match(_commentWithHashRe) || [];
    }
    var _ruleRe = /(\s*)([^;\{\}]+?)(\s*)((?:{%BLOCK%}?\s*;?)|(?:\s*;))/g;
    var _curlyRe = /([{}])/g;
    var OPEN_CURLY = '{';
    var CLOSE_CURLY = '}';
    var BLOCK_PLACEHOLDER = '%BLOCK%';
    var CssRule = (function() {
      function CssRule(selector, content) {
        this.selector = selector;
        this.content = content;
      }
      return CssRule;
    }());
    function processRules(input, ruleCallback) {
      var inputWithEscapedBlocks = escapeBlocks(input);
      var nextBlockIndex = 0;
      return inputWithEscapedBlocks.escapedString.replace(_ruleRe, function() {
        var m = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          m[_i] = arguments[_i];
        }
        var selector = m[2];
        var content = '';
        var suffix = m[4];
        var contentPrefix = '';
        if (suffix && suffix.startsWith('{' + BLOCK_PLACEHOLDER)) {
          content = inputWithEscapedBlocks.blocks[nextBlockIndex++];
          suffix = suffix.substring(BLOCK_PLACEHOLDER.length + 1);
          contentPrefix = '{';
        }
        var rule = ruleCallback(new CssRule(selector, content));
        return "" + m[1] + rule.selector + m[3] + contentPrefix + rule.content + suffix;
      });
    }
    var StringWithEscapedBlocks = (function() {
      function StringWithEscapedBlocks(escapedString, blocks) {
        this.escapedString = escapedString;
        this.blocks = blocks;
      }
      return StringWithEscapedBlocks;
    }());
    function escapeBlocks(input) {
      var inputParts = input.split(_curlyRe);
      var resultParts = [];
      var escapedBlocks = [];
      var bracketCount = 0;
      var currentBlockParts = [];
      for (var partIndex = 0; partIndex < inputParts.length; partIndex++) {
        var part = inputParts[partIndex];
        if (part == CLOSE_CURLY) {
          bracketCount--;
        }
        if (bracketCount > 0) {
          currentBlockParts.push(part);
        } else {
          if (currentBlockParts.length > 0) {
            escapedBlocks.push(currentBlockParts.join(''));
            resultParts.push(BLOCK_PLACEHOLDER);
            currentBlockParts = [];
          }
          resultParts.push(part);
        }
        if (part == OPEN_CURLY) {
          bracketCount++;
        }
      }
      if (currentBlockParts.length > 0) {
        escapedBlocks.push(currentBlockParts.join(''));
        resultParts.push(BLOCK_PLACEHOLDER);
      }
      return new StringWithEscapedBlocks(resultParts.join(''), escapedBlocks);
    }
    var COMPONENT_VARIABLE = '%COMP%';
    var HOST_ATTR = "_nghost-" + COMPONENT_VARIABLE;
    var CONTENT_ATTR = "_ngcontent-" + COMPONENT_VARIABLE;
    var StylesCompileDependency = (function() {
      function StylesCompileDependency(name, moduleUrl, setValue) {
        this.name = name;
        this.moduleUrl = moduleUrl;
        this.setValue = setValue;
      }
      return StylesCompileDependency;
    }());
    var CompiledStylesheet = (function() {
      function CompiledStylesheet(outputCtx, stylesVar, dependencies, isShimmed, meta) {
        this.outputCtx = outputCtx;
        this.stylesVar = stylesVar;
        this.dependencies = dependencies;
        this.isShimmed = isShimmed;
        this.meta = meta;
      }
      return CompiledStylesheet;
    }());
    var StyleCompiler = (function() {
      function StyleCompiler(_urlResolver) {
        this._urlResolver = _urlResolver;
        this._shadowCss = new ShadowCss();
      }
      StyleCompiler.prototype.compileComponent = function(outputCtx, comp) {
        var template = ((comp.template));
        return this._compileStyles(outputCtx, comp, new CompileStylesheetMetadata({
          styles: template.styles,
          styleUrls: template.styleUrls,
          moduleUrl: identifierModuleUrl(comp.type)
        }), this.needsStyleShim(comp), true);
      };
      StyleCompiler.prototype.compileStyles = function(outputCtx, comp, stylesheet, shim) {
        if (shim === void 0) {
          shim = this.needsStyleShim(comp);
        }
        return this._compileStyles(outputCtx, comp, stylesheet, shim, false);
      };
      StyleCompiler.prototype.needsStyleShim = function(comp) {
        return ((comp.template)).encapsulation === ViewEncapsulation.Emulated;
      };
      StyleCompiler.prototype._compileStyles = function(outputCtx, comp, stylesheet, shim, isComponentStylesheet) {
        var _this = this;
        var styleExpressions = stylesheet.styles.map(function(plainStyle) {
          return literal(_this._shimIfNeeded(plainStyle, shim));
        });
        var dependencies = [];
        stylesheet.styleUrls.forEach(function(styleUrl) {
          var exprIndex = styleExpressions.length;
          styleExpressions.push(((null)));
          dependencies.push(new StylesCompileDependency(getStylesVarName(null), styleUrl, function(value) {
            return styleExpressions[exprIndex] = outputCtx.importExpr(value);
          }));
        });
        var stylesVar = getStylesVarName(isComponentStylesheet ? comp : null);
        var stmt = variable(stylesVar).set(literalArr(styleExpressions, new ArrayType(DYNAMIC_TYPE, [TypeModifier.Const]))).toDeclStmt(null, isComponentStylesheet ? [StmtModifier.Final] : [StmtModifier.Final, StmtModifier.Exported]);
        outputCtx.statements.push(stmt);
        return new CompiledStylesheet(outputCtx, stylesVar, dependencies, shim, stylesheet);
      };
      StyleCompiler.prototype._shimIfNeeded = function(style, shim) {
        return shim ? this._shadowCss.shimCssText(style, CONTENT_ATTR, HOST_ATTR) : style;
      };
      return StyleCompiler;
    }());
    function getStylesVarName(component) {
      var result = "styles";
      if (component) {
        result += "_" + identifierName(component.type);
      }
      return result;
    }
    var PRESERVE_WS_ATTR_NAME = 'ngPreserveWhitespaces';
    var SKIP_WS_TRIM_TAGS = new Set(['pre', 'template', 'textarea', 'script', 'style']);
    var WS_CHARS = ' \f\n\r\t\v\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff';
    var NO_WS_REGEXP = new RegExp("[^" + WS_CHARS + "]");
    var WS_REPLACE_REGEXP = new RegExp("[" + WS_CHARS + "]{2,}", 'g');
    function hasPreserveWhitespacesAttr(attrs) {
      return attrs.some(function(attr) {
        return attr.name === PRESERVE_WS_ATTR_NAME;
      });
    }
    function replaceNgsp(value) {
      return value.replace(new RegExp(NGSP_UNICODE, 'g'), ' ');
    }
    var WhitespaceVisitor = (function() {
      function WhitespaceVisitor() {}
      WhitespaceVisitor.prototype.visitElement = function(element, context) {
        if (SKIP_WS_TRIM_TAGS.has(element.name) || hasPreserveWhitespacesAttr(element.attrs)) {
          return new Element(element.name, visitAll(this, element.attrs), element.children, element.sourceSpan, element.startSourceSpan, element.endSourceSpan);
        }
        return new Element(element.name, element.attrs, visitAll(this, element.children), element.sourceSpan, element.startSourceSpan, element.endSourceSpan);
      };
      WhitespaceVisitor.prototype.visitAttribute = function(attribute, context) {
        return attribute.name !== PRESERVE_WS_ATTR_NAME ? attribute : null;
      };
      WhitespaceVisitor.prototype.visitText = function(text, context) {
        var isNotBlank = text.value.match(NO_WS_REGEXP);
        if (isNotBlank) {
          return new Text(replaceNgsp(text.value).replace(WS_REPLACE_REGEXP, ' '), text.sourceSpan);
        }
        return null;
      };
      WhitespaceVisitor.prototype.visitComment = function(comment, context) {
        return comment;
      };
      WhitespaceVisitor.prototype.visitExpansion = function(expansion, context) {
        return expansion;
      };
      WhitespaceVisitor.prototype.visitExpansionCase = function(expansionCase, context) {
        return expansionCase;
      };
      return WhitespaceVisitor;
    }());
    function removeWhitespaces(htmlAstWithErrors) {
      return new ParseTreeResult(visitAll(new WhitespaceVisitor(), htmlAstWithErrors.rootNodes), htmlAstWithErrors.errors);
    }
    var PLURAL_CASES = ['zero', 'one', 'two', 'few', 'many', 'other'];
    function expandNodes(nodes) {
      var expander = new _Expander();
      return new ExpansionResult(visitAll(expander, nodes), expander.isExpanded, expander.errors);
    }
    var ExpansionResult = (function() {
      function ExpansionResult(nodes, expanded, errors) {
        this.nodes = nodes;
        this.expanded = expanded;
        this.errors = errors;
      }
      return ExpansionResult;
    }());
    var ExpansionError = (function(_super) {
      __extends(ExpansionError, _super);
      function ExpansionError(span, errorMsg) {
        return _super.call(this, span, errorMsg) || this;
      }
      return ExpansionError;
    }(ParseError));
    var _Expander = (function() {
      function _Expander() {
        this.isExpanded = false;
        this.errors = [];
      }
      _Expander.prototype.visitElement = function(element, context) {
        return new Element(element.name, element.attrs, visitAll(this, element.children), element.sourceSpan, element.startSourceSpan, element.endSourceSpan);
      };
      _Expander.prototype.visitAttribute = function(attribute, context) {
        return attribute;
      };
      _Expander.prototype.visitText = function(text, context) {
        return text;
      };
      _Expander.prototype.visitComment = function(comment, context) {
        return comment;
      };
      _Expander.prototype.visitExpansion = function(icu, context) {
        this.isExpanded = true;
        return icu.type == 'plural' ? _expandPluralForm(icu, this.errors) : _expandDefaultForm(icu, this.errors);
      };
      _Expander.prototype.visitExpansionCase = function(icuCase, context) {
        throw new Error('Should not be reached');
      };
      return _Expander;
    }());
    function _expandPluralForm(ast, errors) {
      var children = ast.cases.map(function(c) {
        if (PLURAL_CASES.indexOf(c.value) == -1 && !c.value.match(/^=\d+$/)) {
          errors.push(new ExpansionError(c.valueSourceSpan, "Plural cases should be \"=<number>\" or one of " + PLURAL_CASES.join(", ")));
        }
        var expansionResult = expandNodes(c.expression);
        errors.push.apply(errors, expansionResult.errors);
        return new Element("ng-template", [new Attribute$1('ngPluralCase', "" + c.value, c.valueSourceSpan)], expansionResult.nodes, c.sourceSpan, c.sourceSpan, c.sourceSpan);
      });
      var switchAttr = new Attribute$1('[ngPlural]', ast.switchValue, ast.switchValueSourceSpan);
      return new Element('ng-container', [switchAttr], children, ast.sourceSpan, ast.sourceSpan, ast.sourceSpan);
    }
    function _expandDefaultForm(ast, errors) {
      var children = ast.cases.map(function(c) {
        var expansionResult = expandNodes(c.expression);
        errors.push.apply(errors, expansionResult.errors);
        if (c.value === 'other') {
          return new Element("ng-template", [new Attribute$1('ngSwitchDefault', '', c.valueSourceSpan)], expansionResult.nodes, c.sourceSpan, c.sourceSpan, c.sourceSpan);
        }
        return new Element("ng-template", [new Attribute$1('ngSwitchCase', "" + c.value, c.valueSourceSpan)], expansionResult.nodes, c.sourceSpan, c.sourceSpan, c.sourceSpan);
      });
      var switchAttr = new Attribute$1('[ngSwitch]', ast.switchValue, ast.switchValueSourceSpan);
      return new Element('ng-container', [switchAttr], children, ast.sourceSpan, ast.sourceSpan, ast.sourceSpan);
    }
    var PROPERTY_PARTS_SEPARATOR = '.';
    var ATTRIBUTE_PREFIX = 'attr';
    var CLASS_PREFIX = 'class';
    var STYLE_PREFIX = 'style';
    var ANIMATE_PROP_PREFIX = 'animate-';
    var BoundPropertyType = {
      DEFAULT: 0,
      LITERAL_ATTR: 1,
      ANIMATION: 2
    };
    BoundPropertyType[BoundPropertyType.DEFAULT] = "DEFAULT";
    BoundPropertyType[BoundPropertyType.LITERAL_ATTR] = "LITERAL_ATTR";
    BoundPropertyType[BoundPropertyType.ANIMATION] = "ANIMATION";
    var BoundProperty = (function() {
      function BoundProperty(name, expression, type, sourceSpan) {
        this.name = name;
        this.expression = expression;
        this.type = type;
        this.sourceSpan = sourceSpan;
        this.isLiteral = this.type === BoundPropertyType.LITERAL_ATTR;
        this.isAnimation = this.type === BoundPropertyType.ANIMATION;
      }
      return BoundProperty;
    }());
    var BindingParser = (function() {
      function BindingParser(_exprParser, _interpolationConfig, _schemaRegistry, pipes, _targetErrors) {
        var _this = this;
        this._exprParser = _exprParser;
        this._interpolationConfig = _interpolationConfig;
        this._schemaRegistry = _schemaRegistry;
        this._targetErrors = _targetErrors;
        this.pipesByName = new Map();
        this._usedPipes = new Map();
        pipes.forEach(function(pipe) {
          return _this.pipesByName.set(pipe.name, pipe);
        });
      }
      BindingParser.prototype.getUsedPipes = function() {
        return Array.from(this._usedPipes.values());
      };
      BindingParser.prototype.createDirectiveHostPropertyAsts = function(dirMeta, elementSelector, sourceSpan) {
        var _this = this;
        if (dirMeta.hostProperties) {
          var boundProps_1 = [];
          Object.keys(dirMeta.hostProperties).forEach(function(propName) {
            var expression = dirMeta.hostProperties[propName];
            if (typeof expression === 'string') {
              _this.parsePropertyBinding(propName, expression, true, sourceSpan, [], boundProps_1);
            } else {
              _this._reportError("Value of the host property binding \"" + propName + "\" needs to be a string representing an expression but got \"" + expression + "\" (" + typeof expression + ")", sourceSpan);
            }
          });
          return boundProps_1.map(function(prop) {
            return _this.createElementPropertyAst(elementSelector, prop);
          });
        }
        return null;
      };
      BindingParser.prototype.createDirectiveHostEventAsts = function(dirMeta, sourceSpan) {
        var _this = this;
        if (dirMeta.hostListeners) {
          var targetEventAsts_1 = [];
          Object.keys(dirMeta.hostListeners).forEach(function(propName) {
            var expression = dirMeta.hostListeners[propName];
            if (typeof expression === 'string') {
              _this.parseEvent(propName, expression, sourceSpan, [], targetEventAsts_1);
            } else {
              _this._reportError("Value of the host listener \"" + propName + "\" needs to be a string representing an expression but got \"" + expression + "\" (" + typeof expression + ")", sourceSpan);
            }
          });
          return targetEventAsts_1;
        }
        return null;
      };
      BindingParser.prototype.parseInterpolation = function(value, sourceSpan) {
        var sourceInfo = sourceSpan.start.toString();
        try {
          var ast = ((this._exprParser.parseInterpolation(value, sourceInfo, this._interpolationConfig)));
          if (ast)
            this._reportExpressionParserErrors(ast.errors, sourceSpan);
          this._checkPipes(ast, sourceSpan);
          return ast;
        } catch (e) {
          this._reportError("" + e, sourceSpan);
          return this._exprParser.wrapLiteralPrimitive('ERROR', sourceInfo);
        }
      };
      BindingParser.prototype.parseInlineTemplateBinding = function(prefixToken, value, sourceSpan, targetMatchableAttrs, targetProps, targetVars) {
        var bindings = this._parseTemplateBindings(prefixToken, value, sourceSpan);
        for (var i = 0; i < bindings.length; i++) {
          var binding = bindings[i];
          if (binding.keyIsVar) {
            targetVars.push(new VariableAst(binding.key, binding.name, sourceSpan));
          } else if (binding.expression) {
            this._parsePropertyAst(binding.key, binding.expression, sourceSpan, targetMatchableAttrs, targetProps);
          } else {
            targetMatchableAttrs.push([binding.key, '']);
            this.parseLiteralAttr(binding.key, null, sourceSpan, targetMatchableAttrs, targetProps);
          }
        }
      };
      BindingParser.prototype._parseTemplateBindings = function(prefixToken, value, sourceSpan) {
        var _this = this;
        var sourceInfo = sourceSpan.start.toString();
        try {
          var bindingsResult = this._exprParser.parseTemplateBindings(prefixToken, value, sourceInfo);
          this._reportExpressionParserErrors(bindingsResult.errors, sourceSpan);
          bindingsResult.templateBindings.forEach(function(binding) {
            if (binding.expression) {
              _this._checkPipes(binding.expression, sourceSpan);
            }
          });
          bindingsResult.warnings.forEach(function(warning) {
            _this._reportError(warning, sourceSpan, ParseErrorLevel.WARNING);
          });
          return bindingsResult.templateBindings;
        } catch (e) {
          this._reportError("" + e, sourceSpan);
          return [];
        }
      };
      BindingParser.prototype.parseLiteralAttr = function(name, value, sourceSpan, targetMatchableAttrs, targetProps) {
        if (_isAnimationLabel(name)) {
          name = name.substring(1);
          if (value) {
            this._reportError("Assigning animation triggers via @prop=\"exp\" attributes with an expression is invalid." + " Use property bindings (e.g. [@prop]=\"exp\") or use an attribute without a value (e.g. @prop) instead.", sourceSpan, ParseErrorLevel.ERROR);
          }
          this._parseAnimation(name, value, sourceSpan, targetMatchableAttrs, targetProps);
        } else {
          targetProps.push(new BoundProperty(name, this._exprParser.wrapLiteralPrimitive(value, ''), BoundPropertyType.LITERAL_ATTR, sourceSpan));
        }
      };
      BindingParser.prototype.parsePropertyBinding = function(name, expression, isHost, sourceSpan, targetMatchableAttrs, targetProps) {
        var isAnimationProp = false;
        if (name.startsWith(ANIMATE_PROP_PREFIX)) {
          isAnimationProp = true;
          name = name.substring(ANIMATE_PROP_PREFIX.length);
        } else if (_isAnimationLabel(name)) {
          isAnimationProp = true;
          name = name.substring(1);
        }
        if (isAnimationProp) {
          this._parseAnimation(name, expression, sourceSpan, targetMatchableAttrs, targetProps);
        } else {
          this._parsePropertyAst(name, this._parseBinding(expression, isHost, sourceSpan), sourceSpan, targetMatchableAttrs, targetProps);
        }
      };
      BindingParser.prototype.parsePropertyInterpolation = function(name, value, sourceSpan, targetMatchableAttrs, targetProps) {
        var expr = this.parseInterpolation(value, sourceSpan);
        if (expr) {
          this._parsePropertyAst(name, expr, sourceSpan, targetMatchableAttrs, targetProps);
          return true;
        }
        return false;
      };
      BindingParser.prototype._parsePropertyAst = function(name, ast, sourceSpan, targetMatchableAttrs, targetProps) {
        targetMatchableAttrs.push([name, ((ast.source))]);
        targetProps.push(new BoundProperty(name, ast, BoundPropertyType.DEFAULT, sourceSpan));
      };
      BindingParser.prototype._parseAnimation = function(name, expression, sourceSpan, targetMatchableAttrs, targetProps) {
        var ast = this._parseBinding(expression || 'undefined', false, sourceSpan);
        targetMatchableAttrs.push([name, ((ast.source))]);
        targetProps.push(new BoundProperty(name, ast, BoundPropertyType.ANIMATION, sourceSpan));
      };
      BindingParser.prototype._parseBinding = function(value, isHostBinding, sourceSpan) {
        var sourceInfo = sourceSpan.start.toString();
        try {
          var ast = isHostBinding ? this._exprParser.parseSimpleBinding(value, sourceInfo, this._interpolationConfig) : this._exprParser.parseBinding(value, sourceInfo, this._interpolationConfig);
          if (ast)
            this._reportExpressionParserErrors(ast.errors, sourceSpan);
          this._checkPipes(ast, sourceSpan);
          return ast;
        } catch (e) {
          this._reportError("" + e, sourceSpan);
          return this._exprParser.wrapLiteralPrimitive('ERROR', sourceInfo);
        }
      };
      BindingParser.prototype.createElementPropertyAst = function(elementSelector, boundProp) {
        if (boundProp.isAnimation) {
          return new BoundElementPropertyAst(boundProp.name, PropertyBindingType.Animation, SecurityContext.NONE, boundProp.expression, null, boundProp.sourceSpan);
        }
        var unit = null;
        var bindingType = ((undefined));
        var boundPropertyName = null;
        var parts = boundProp.name.split(PROPERTY_PARTS_SEPARATOR);
        var securityContexts = ((undefined));
        if (parts.length > 1) {
          if (parts[0] == ATTRIBUTE_PREFIX) {
            boundPropertyName = parts[1];
            this._validatePropertyOrAttributeName(boundPropertyName, boundProp.sourceSpan, true);
            securityContexts = calcPossibleSecurityContexts(this._schemaRegistry, elementSelector, boundPropertyName, true);
            var nsSeparatorIdx = boundPropertyName.indexOf(':');
            if (nsSeparatorIdx > -1) {
              var ns = boundPropertyName.substring(0, nsSeparatorIdx);
              var name_1 = boundPropertyName.substring(nsSeparatorIdx + 1);
              boundPropertyName = mergeNsAndName(ns, name_1);
            }
            bindingType = PropertyBindingType.Attribute;
          } else if (parts[0] == CLASS_PREFIX) {
            boundPropertyName = parts[1];
            bindingType = PropertyBindingType.Class;
            securityContexts = [SecurityContext.NONE];
          } else if (parts[0] == STYLE_PREFIX) {
            unit = parts.length > 2 ? parts[2] : null;
            boundPropertyName = parts[1];
            bindingType = PropertyBindingType.Style;
            securityContexts = [SecurityContext.STYLE];
          }
        }
        if (boundPropertyName === null) {
          boundPropertyName = this._schemaRegistry.getMappedPropName(boundProp.name);
          securityContexts = calcPossibleSecurityContexts(this._schemaRegistry, elementSelector, boundPropertyName, false);
          bindingType = PropertyBindingType.Property;
          this._validatePropertyOrAttributeName(boundPropertyName, boundProp.sourceSpan, false);
        }
        return new BoundElementPropertyAst(boundPropertyName, bindingType, securityContexts[0], boundProp.expression, unit, boundProp.sourceSpan);
      };
      BindingParser.prototype.parseEvent = function(name, expression, sourceSpan, targetMatchableAttrs, targetEvents) {
        if (_isAnimationLabel(name)) {
          name = name.substr(1);
          this._parseAnimationEvent(name, expression, sourceSpan, targetEvents);
        } else {
          this._parseEvent(name, expression, sourceSpan, targetMatchableAttrs, targetEvents);
        }
      };
      BindingParser.prototype._parseAnimationEvent = function(name, expression, sourceSpan, targetEvents) {
        var matches = splitAtPeriod(name, [name, '']);
        var eventName = matches[0];
        var phase = matches[1].toLowerCase();
        if (phase) {
          switch (phase) {
            case 'start':
            case 'done':
              var ast = this._parseAction(expression, sourceSpan);
              targetEvents.push(new BoundEventAst(eventName, null, phase, ast, sourceSpan));
              break;
            default:
              this._reportError("The provided animation output phase value \"" + phase + "\" for \"@" + eventName + "\" is not supported (use start or done)", sourceSpan);
              break;
          }
        } else {
          this._reportError("The animation trigger output event (@" + eventName + ") is missing its phase value name (start or done are currently supported)", sourceSpan);
        }
      };
      BindingParser.prototype._parseEvent = function(name, expression, sourceSpan, targetMatchableAttrs, targetEvents) {
        var _a = splitAtColon(name, [((null)), name]),
            target = _a[0],
            eventName = _a[1];
        var ast = this._parseAction(expression, sourceSpan);
        targetMatchableAttrs.push([((name)), ((ast.source))]);
        targetEvents.push(new BoundEventAst(eventName, target, null, ast, sourceSpan));
      };
      BindingParser.prototype._parseAction = function(value, sourceSpan) {
        var sourceInfo = sourceSpan.start.toString();
        try {
          var ast = this._exprParser.parseAction(value, sourceInfo, this._interpolationConfig);
          if (ast) {
            this._reportExpressionParserErrors(ast.errors, sourceSpan);
          }
          if (!ast || ast.ast instanceof EmptyExpr) {
            this._reportError("Empty expressions are not allowed", sourceSpan);
            return this._exprParser.wrapLiteralPrimitive('ERROR', sourceInfo);
          }
          this._checkPipes(ast, sourceSpan);
          return ast;
        } catch (e) {
          this._reportError("" + e, sourceSpan);
          return this._exprParser.wrapLiteralPrimitive('ERROR', sourceInfo);
        }
      };
      BindingParser.prototype._reportError = function(message, sourceSpan, level) {
        if (level === void 0) {
          level = ParseErrorLevel.ERROR;
        }
        this._targetErrors.push(new ParseError(sourceSpan, message, level));
      };
      BindingParser.prototype._reportExpressionParserErrors = function(errors, sourceSpan) {
        for (var _i = 0,
            errors_1 = errors; _i < errors_1.length; _i++) {
          var error = errors_1[_i];
          this._reportError(error.message, sourceSpan);
        }
      };
      BindingParser.prototype._checkPipes = function(ast, sourceSpan) {
        var _this = this;
        if (ast) {
          var collector = new PipeCollector();
          ast.visit(collector);
          collector.pipes.forEach(function(ast, pipeName) {
            var pipeMeta = _this.pipesByName.get(pipeName);
            if (!pipeMeta) {
              _this._reportError("The pipe '" + pipeName + "' could not be found", new ParseSourceSpan(sourceSpan.start.moveBy(ast.span.start), sourceSpan.start.moveBy(ast.span.end)));
            } else {
              _this._usedPipes.set(pipeName, pipeMeta);
            }
          });
        }
      };
      BindingParser.prototype._validatePropertyOrAttributeName = function(propName, sourceSpan, isAttr) {
        var report = isAttr ? this._schemaRegistry.validateAttribute(propName) : this._schemaRegistry.validateProperty(propName);
        if (report.error) {
          this._reportError(((report.msg)), sourceSpan, ParseErrorLevel.ERROR);
        }
      };
      return BindingParser;
    }());
    var PipeCollector = (function(_super) {
      __extends(PipeCollector, _super);
      function PipeCollector() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.pipes = new Map();
        return _this;
      }
      PipeCollector.prototype.visitPipe = function(ast, context) {
        this.pipes.set(ast.name, ast);
        ast.exp.visit(this);
        this.visitAll(ast.args, context);
        return null;
      };
      return PipeCollector;
    }(RecursiveAstVisitor));
    function _isAnimationLabel(name) {
      return name[0] == '@';
    }
    function calcPossibleSecurityContexts(registry, selector, propName, isAttribute) {
      var ctxs = [];
      CssSelector.parse(selector).forEach(function(selector) {
        var elementNames = selector.element ? [selector.element] : registry.allKnownElementNames();
        var notElementNames = new Set(selector.notSelectors.filter(function(selector) {
          return selector.isElementSelector();
        }).map(function(selector) {
          return selector.element;
        }));
        var possibleElementNames = elementNames.filter(function(elementName) {
          return !notElementNames.has(elementName);
        });
        ctxs.push.apply(ctxs, possibleElementNames.map(function(elementName) {
          return registry.securityContext(elementName, propName, isAttribute);
        }));
      });
      return ctxs.length === 0 ? [SecurityContext.NONE] : Array.from(new Set(ctxs)).sort();
    }
    var BIND_NAME_REGEXP = /^(?:(?:(?:(bind-)|(let-)|(ref-|#)|(on-)|(bindon-)|(@))(.+))|\[\(([^\)]+)\)\]|\[([^\]]+)\]|\(([^\)]+)\))$/;
    var KW_BIND_IDX = 1;
    var KW_LET_IDX = 2;
    var KW_REF_IDX = 3;
    var KW_ON_IDX = 4;
    var KW_BINDON_IDX = 5;
    var KW_AT_IDX = 6;
    var IDENT_KW_IDX = 7;
    var IDENT_BANANA_BOX_IDX = 8;
    var IDENT_PROPERTY_IDX = 9;
    var IDENT_EVENT_IDX = 10;
    var TEMPLATE_ELEMENT = 'template';
    var TEMPLATE_ATTR = 'template';
    var TEMPLATE_ATTR_PREFIX = '*';
    var CLASS_ATTR = 'class';
    var TEXT_CSS_SELECTOR = CssSelector.parse('*')[0];
    var TEMPLATE_ELEMENT_DEPRECATION_WARNING = 'The <template> element is deprecated. Use <ng-template> instead';
    var TEMPLATE_ATTR_DEPRECATION_WARNING = 'The template attribute is deprecated. Use an ng-template element instead.';
    var warningCounts = {};
    function warnOnlyOnce(warnings) {
      return function(error) {
        if (warnings.indexOf(error.msg) !== -1) {
          warningCounts[error.msg] = (warningCounts[error.msg] || 0) + 1;
          return warningCounts[error.msg] <= 1;
        }
        return true;
      };
    }
    var TemplateParseError = (function(_super) {
      __extends(TemplateParseError, _super);
      function TemplateParseError(message, span, level) {
        return _super.call(this, span, message, level) || this;
      }
      return TemplateParseError;
    }(ParseError));
    var TemplateParseResult = (function() {
      function TemplateParseResult(templateAst, usedPipes, errors) {
        this.templateAst = templateAst;
        this.usedPipes = usedPipes;
        this.errors = errors;
      }
      return TemplateParseResult;
    }());
    var TemplateParser = (function() {
      function TemplateParser(_config, _reflector, _exprParser, _schemaRegistry, _htmlParser, _console, transforms) {
        this._config = _config;
        this._reflector = _reflector;
        this._exprParser = _exprParser;
        this._schemaRegistry = _schemaRegistry;
        this._htmlParser = _htmlParser;
        this._console = _console;
        this.transforms = transforms;
      }
      TemplateParser.prototype.parse = function(component, template, directives, pipes, schemas, templateUrl, preserveWhitespaces) {
        var result = this.tryParse(component, template, directives, pipes, schemas, templateUrl, preserveWhitespaces);
        var warnings = ((result.errors)).filter(function(error) {
          return error.level === ParseErrorLevel.WARNING;
        }).filter(warnOnlyOnce([TEMPLATE_ATTR_DEPRECATION_WARNING, TEMPLATE_ELEMENT_DEPRECATION_WARNING]));
        var errors = ((result.errors)).filter(function(error) {
          return error.level === ParseErrorLevel.ERROR;
        });
        if (warnings.length > 0) {
          this._console.warn("Template parse warnings:\n" + warnings.join('\n'));
        }
        if (errors.length > 0) {
          var errorString = errors.join('\n');
          throw syntaxError("Template parse errors:\n" + errorString, errors);
        }
        return {
          template: ((result.templateAst)),
          pipes: ((result.usedPipes))
        };
      };
      TemplateParser.prototype.tryParse = function(component, template, directives, pipes, schemas, templateUrl, preserveWhitespaces) {
        var htmlParseResult = typeof template === 'string' ? ((this._htmlParser)).parse(template, templateUrl, true, this.getInterpolationConfig(component)) : template;
        if (!preserveWhitespaces) {
          htmlParseResult = removeWhitespaces(htmlParseResult);
        }
        return this.tryParseHtml(this.expandHtml(htmlParseResult), component, directives, pipes, schemas);
      };
      TemplateParser.prototype.tryParseHtml = function(htmlAstWithErrors, component, directives, pipes, schemas) {
        var result;
        var errors = htmlAstWithErrors.errors;
        var usedPipes = [];
        if (htmlAstWithErrors.rootNodes.length > 0) {
          var uniqDirectives = removeSummaryDuplicates(directives);
          var uniqPipes = removeSummaryDuplicates(pipes);
          var providerViewContext = new ProviderViewContext(this._reflector, component);
          var interpolationConfig = ((undefined));
          if (component.template && component.template.interpolation) {
            interpolationConfig = {
              start: component.template.interpolation[0],
              end: component.template.interpolation[1]
            };
          }
          var bindingParser = new BindingParser(this._exprParser, ((interpolationConfig)), this._schemaRegistry, uniqPipes, errors);
          var parseVisitor = new TemplateParseVisitor(this._reflector, this._config, providerViewContext, uniqDirectives, bindingParser, this._schemaRegistry, schemas, errors);
          result = visitAll(parseVisitor, htmlAstWithErrors.rootNodes, EMPTY_ELEMENT_CONTEXT);
          errors.push.apply(errors, providerViewContext.errors);
          usedPipes.push.apply(usedPipes, bindingParser.getUsedPipes());
        } else {
          result = [];
        }
        this._assertNoReferenceDuplicationOnTemplate(result, errors);
        if (errors.length > 0) {
          return new TemplateParseResult(result, usedPipes, errors);
        }
        if (this.transforms) {
          this.transforms.forEach(function(transform) {
            result = templateVisitAll(transform, result);
          });
        }
        return new TemplateParseResult(result, usedPipes, errors);
      };
      TemplateParser.prototype.expandHtml = function(htmlAstWithErrors, forced) {
        if (forced === void 0) {
          forced = false;
        }
        var errors = htmlAstWithErrors.errors;
        if (errors.length == 0 || forced) {
          var expandedHtmlAst = expandNodes(htmlAstWithErrors.rootNodes);
          errors.push.apply(errors, expandedHtmlAst.errors);
          htmlAstWithErrors = new ParseTreeResult(expandedHtmlAst.nodes, errors);
        }
        return htmlAstWithErrors;
      };
      TemplateParser.prototype.getInterpolationConfig = function(component) {
        if (component.template) {
          return InterpolationConfig.fromArray(component.template.interpolation);
        }
        return undefined;
      };
      TemplateParser.prototype._assertNoReferenceDuplicationOnTemplate = function(result, errors) {
        var existingReferences = [];
        result.filter(function(element) {
          return !!((element)).references;
        }).forEach(function(element) {
          return ((element)).references.forEach(function(reference) {
            var name = reference.name;
            if (existingReferences.indexOf(name) < 0) {
              existingReferences.push(name);
            } else {
              var error = new TemplateParseError("Reference \"#" + name + "\" is defined several times", reference.sourceSpan, ParseErrorLevel.ERROR);
              errors.push(error);
            }
          });
        });
      };
      return TemplateParser;
    }());
    var TemplateParseVisitor = (function() {
      function TemplateParseVisitor(reflector, config, providerViewContext, directives, _bindingParser, _schemaRegistry, _schemas, _targetErrors) {
        var _this = this;
        this.reflector = reflector;
        this.config = config;
        this.providerViewContext = providerViewContext;
        this._bindingParser = _bindingParser;
        this._schemaRegistry = _schemaRegistry;
        this._schemas = _schemas;
        this._targetErrors = _targetErrors;
        this.selectorMatcher = new SelectorMatcher();
        this.directivesIndex = new Map();
        this.ngContentCount = 0;
        this.contentQueryStartId = providerViewContext.component.viewQueries.length + 1;
        directives.forEach(function(directive, index) {
          var selector = CssSelector.parse(((directive.selector)));
          _this.selectorMatcher.addSelectables(selector, directive);
          _this.directivesIndex.set(directive, index);
        });
      }
      TemplateParseVisitor.prototype.visitExpansion = function(expansion, context) {
        return null;
      };
      TemplateParseVisitor.prototype.visitExpansionCase = function(expansionCase, context) {
        return null;
      };
      TemplateParseVisitor.prototype.visitText = function(text, parent) {
        var ngContentIndex = ((parent.findNgContentIndex(TEXT_CSS_SELECTOR)));
        var valueNoNgsp = replaceNgsp(text.value);
        var expr = this._bindingParser.parseInterpolation(valueNoNgsp, ((text.sourceSpan)));
        return expr ? new BoundTextAst(expr, ngContentIndex, ((text.sourceSpan))) : new TextAst(valueNoNgsp, ngContentIndex, ((text.sourceSpan)));
      };
      TemplateParseVisitor.prototype.visitAttribute = function(attribute, context) {
        return new AttrAst(attribute.name, attribute.value, attribute.sourceSpan);
      };
      TemplateParseVisitor.prototype.visitComment = function(comment, context) {
        return null;
      };
      TemplateParseVisitor.prototype.visitElement = function(element, parent) {
        var _this = this;
        var queryStartIndex = this.contentQueryStartId;
        var nodeName = element.name;
        var preparsedElement = preparseElement(element);
        if (preparsedElement.type === PreparsedElementType.SCRIPT || preparsedElement.type === PreparsedElementType.STYLE) {
          return null;
        }
        if (preparsedElement.type === PreparsedElementType.STYLESHEET && isStyleUrlResolvable(preparsedElement.hrefAttr)) {
          return null;
        }
        var matchableAttrs = [];
        var elementOrDirectiveProps = [];
        var elementOrDirectiveRefs = [];
        var elementVars = [];
        var events = [];
        var templateElementOrDirectiveProps = [];
        var templateMatchableAttrs = [];
        var templateElementVars = [];
        var hasInlineTemplates = false;
        var attrs = [];
        var isTemplateElement = isTemplate(element, this.config.enableLegacyTemplate, function(m, span) {
          return _this._reportError(m, span, ParseErrorLevel.WARNING);
        });
        element.attrs.forEach(function(attr) {
          var hasBinding = _this._parseAttr(isTemplateElement, attr, matchableAttrs, elementOrDirectiveProps, events, elementOrDirectiveRefs, elementVars);
          var templateBindingsSource;
          var prefixToken;
          var normalizedName = _this._normalizeAttributeName(attr.name);
          if (_this.config.enableLegacyTemplate && normalizedName == TEMPLATE_ATTR) {
            _this._reportError(TEMPLATE_ATTR_DEPRECATION_WARNING, attr.sourceSpan, ParseErrorLevel.WARNING);
            templateBindingsSource = attr.value;
          } else if (normalizedName.startsWith(TEMPLATE_ATTR_PREFIX)) {
            templateBindingsSource = attr.value;
            prefixToken = normalizedName.substring(TEMPLATE_ATTR_PREFIX.length) + ':';
          }
          var hasTemplateBinding = templateBindingsSource != null;
          if (hasTemplateBinding) {
            if (hasInlineTemplates) {
              _this._reportError("Can't have multiple template bindings on one element. Use only one attribute named 'template' or prefixed with *", attr.sourceSpan);
            }
            hasInlineTemplates = true;
            _this._bindingParser.parseInlineTemplateBinding(((prefixToken)), ((templateBindingsSource)), attr.sourceSpan, templateMatchableAttrs, templateElementOrDirectiveProps, templateElementVars);
          }
          if (!hasBinding && !hasTemplateBinding) {
            attrs.push(_this.visitAttribute(attr, null));
            matchableAttrs.push([attr.name, attr.value]);
          }
        });
        var elementCssSelector = createElementCssSelector(nodeName, matchableAttrs);
        var _a = this._parseDirectives(this.selectorMatcher, elementCssSelector),
            directiveMetas = _a.directives,
            matchElement = _a.matchElement;
        var references = [];
        var boundDirectivePropNames = new Set();
        var directiveAsts = this._createDirectiveAsts(isTemplateElement, element.name, directiveMetas, elementOrDirectiveProps, elementOrDirectiveRefs, ((element.sourceSpan)), references, boundDirectivePropNames);
        var elementProps = this._createElementPropertyAsts(element.name, elementOrDirectiveProps, boundDirectivePropNames);
        var isViewRoot = parent.isTemplateElement || hasInlineTemplates;
        var providerContext = new ProviderElementContext(this.providerViewContext, ((parent.providerContext)), isViewRoot, directiveAsts, attrs, references, isTemplateElement, queryStartIndex, ((element.sourceSpan)));
        var children = visitAll(preparsedElement.nonBindable ? NON_BINDABLE_VISITOR : this, element.children, ElementContext.create(isTemplateElement, directiveAsts, isTemplateElement ? ((parent.providerContext)) : providerContext));
        providerContext.afterElement();
        var projectionSelector = preparsedElement.projectAs != null ? CssSelector.parse(preparsedElement.projectAs)[0] : elementCssSelector;
        var ngContentIndex = ((parent.findNgContentIndex(projectionSelector)));
        var parsedElement;
        if (preparsedElement.type === PreparsedElementType.NG_CONTENT) {
          if (element.children && !element.children.every(_isEmptyTextNode)) {
            this._reportError("<ng-content> element cannot have content.", ((element.sourceSpan)));
          }
          parsedElement = new NgContentAst(this.ngContentCount++, hasInlineTemplates ? ((null)) : ngContentIndex, ((element.sourceSpan)));
        } else if (isTemplateElement) {
          this._assertAllEventsPublishedByDirectives(directiveAsts, events);
          this._assertNoComponentsNorElementBindingsOnTemplate(directiveAsts, elementProps, ((element.sourceSpan)));
          parsedElement = new EmbeddedTemplateAst(attrs, events, references, elementVars, providerContext.transformedDirectiveAsts, providerContext.transformProviders, providerContext.transformedHasViewContainer, providerContext.queryMatches, children, hasInlineTemplates ? ((null)) : ngContentIndex, ((element.sourceSpan)));
        } else {
          this._assertElementExists(matchElement, element);
          this._assertOnlyOneComponent(directiveAsts, ((element.sourceSpan)));
          var ngContentIndex_1 = hasInlineTemplates ? null : parent.findNgContentIndex(projectionSelector);
          parsedElement = new ElementAst(nodeName, attrs, elementProps, events, references, providerContext.transformedDirectiveAsts, providerContext.transformProviders, providerContext.transformedHasViewContainer, providerContext.queryMatches, children, hasInlineTemplates ? null : ngContentIndex_1, element.sourceSpan, element.endSourceSpan || null);
        }
        if (hasInlineTemplates) {
          var templateQueryStartIndex = this.contentQueryStartId;
          var templateSelector = createElementCssSelector(TEMPLATE_ELEMENT, templateMatchableAttrs);
          var templateDirectiveMetas = this._parseDirectives(this.selectorMatcher, templateSelector).directives;
          var templateBoundDirectivePropNames = new Set();
          var templateDirectiveAsts = this._createDirectiveAsts(true, element.name, templateDirectiveMetas, templateElementOrDirectiveProps, [], ((element.sourceSpan)), [], templateBoundDirectivePropNames);
          var templateElementProps = this._createElementPropertyAsts(element.name, templateElementOrDirectiveProps, templateBoundDirectivePropNames);
          this._assertNoComponentsNorElementBindingsOnTemplate(templateDirectiveAsts, templateElementProps, ((element.sourceSpan)));
          var templateProviderContext = new ProviderElementContext(this.providerViewContext, ((parent.providerContext)), parent.isTemplateElement, templateDirectiveAsts, [], [], true, templateQueryStartIndex, ((element.sourceSpan)));
          templateProviderContext.afterElement();
          parsedElement = new EmbeddedTemplateAst([], [], [], templateElementVars, templateProviderContext.transformedDirectiveAsts, templateProviderContext.transformProviders, templateProviderContext.transformedHasViewContainer, templateProviderContext.queryMatches, [parsedElement], ngContentIndex, ((element.sourceSpan)));
        }
        return parsedElement;
      };
      TemplateParseVisitor.prototype._parseAttr = function(isTemplateElement, attr, targetMatchableAttrs, targetProps, targetEvents, targetRefs, targetVars) {
        var name = this._normalizeAttributeName(attr.name);
        var value = attr.value;
        var srcSpan = attr.sourceSpan;
        var bindParts = name.match(BIND_NAME_REGEXP);
        var hasBinding = false;
        if (bindParts !== null) {
          hasBinding = true;
          if (bindParts[KW_BIND_IDX] != null) {
            this._bindingParser.parsePropertyBinding(bindParts[IDENT_KW_IDX], value, false, srcSpan, targetMatchableAttrs, targetProps);
          } else if (bindParts[KW_LET_IDX]) {
            if (isTemplateElement) {
              var identifier = bindParts[IDENT_KW_IDX];
              this._parseVariable(identifier, value, srcSpan, targetVars);
            } else {
              this._reportError("\"let-\" is only supported on ng-template elements.", srcSpan);
            }
          } else if (bindParts[KW_REF_IDX]) {
            var identifier = bindParts[IDENT_KW_IDX];
            this._parseReference(identifier, value, srcSpan, targetRefs);
          } else if (bindParts[KW_ON_IDX]) {
            this._bindingParser.parseEvent(bindParts[IDENT_KW_IDX], value, srcSpan, targetMatchableAttrs, targetEvents);
          } else if (bindParts[KW_BINDON_IDX]) {
            this._bindingParser.parsePropertyBinding(bindParts[IDENT_KW_IDX], value, false, srcSpan, targetMatchableAttrs, targetProps);
            this._parseAssignmentEvent(bindParts[IDENT_KW_IDX], value, srcSpan, targetMatchableAttrs, targetEvents);
          } else if (bindParts[KW_AT_IDX]) {
            this._bindingParser.parseLiteralAttr(name, value, srcSpan, targetMatchableAttrs, targetProps);
          } else if (bindParts[IDENT_BANANA_BOX_IDX]) {
            this._bindingParser.parsePropertyBinding(bindParts[IDENT_BANANA_BOX_IDX], value, false, srcSpan, targetMatchableAttrs, targetProps);
            this._parseAssignmentEvent(bindParts[IDENT_BANANA_BOX_IDX], value, srcSpan, targetMatchableAttrs, targetEvents);
          } else if (bindParts[IDENT_PROPERTY_IDX]) {
            this._bindingParser.parsePropertyBinding(bindParts[IDENT_PROPERTY_IDX], value, false, srcSpan, targetMatchableAttrs, targetProps);
          } else if (bindParts[IDENT_EVENT_IDX]) {
            this._bindingParser.parseEvent(bindParts[IDENT_EVENT_IDX], value, srcSpan, targetMatchableAttrs, targetEvents);
          }
        } else {
          hasBinding = this._bindingParser.parsePropertyInterpolation(name, value, srcSpan, targetMatchableAttrs, targetProps);
        }
        if (!hasBinding) {
          this._bindingParser.parseLiteralAttr(name, value, srcSpan, targetMatchableAttrs, targetProps);
        }
        return hasBinding;
      };
      TemplateParseVisitor.prototype._normalizeAttributeName = function(attrName) {
        return /^data-/i.test(attrName) ? attrName.substring(5) : attrName;
      };
      TemplateParseVisitor.prototype._parseVariable = function(identifier, value, sourceSpan, targetVars) {
        if (identifier.indexOf('-') > -1) {
          this._reportError("\"-\" is not allowed in variable names", sourceSpan);
        }
        targetVars.push(new VariableAst(identifier, value, sourceSpan));
      };
      TemplateParseVisitor.prototype._parseReference = function(identifier, value, sourceSpan, targetRefs) {
        if (identifier.indexOf('-') > -1) {
          this._reportError("\"-\" is not allowed in reference names", sourceSpan);
        }
        targetRefs.push(new ElementOrDirectiveRef(identifier, value, sourceSpan));
      };
      TemplateParseVisitor.prototype._parseAssignmentEvent = function(name, expression, sourceSpan, targetMatchableAttrs, targetEvents) {
        this._bindingParser.parseEvent(name + "Change", expression + "=$event", sourceSpan, targetMatchableAttrs, targetEvents);
      };
      TemplateParseVisitor.prototype._parseDirectives = function(selectorMatcher, elementCssSelector) {
        var _this = this;
        var directives = new Array(this.directivesIndex.size);
        var matchElement = false;
        selectorMatcher.match(elementCssSelector, function(selector, directive) {
          directives[((_this.directivesIndex.get(directive)))] = directive;
          matchElement = matchElement || selector.hasElementSelector();
        });
        return {
          directives: directives.filter(function(dir) {
            return !!dir;
          }),
          matchElement: matchElement
        };
      };
      TemplateParseVisitor.prototype._createDirectiveAsts = function(isTemplateElement, elementName, directives, props, elementOrDirectiveRefs, elementSourceSpan, targetReferences, targetBoundDirectivePropNames) {
        var _this = this;
        var matchedReferences = new Set();
        var component = ((null));
        var directiveAsts = directives.map(function(directive) {
          var sourceSpan = new ParseSourceSpan(elementSourceSpan.start, elementSourceSpan.end, "Directive " + identifierName(directive.type));
          if (directive.isComponent) {
            component = directive;
          }
          var directiveProperties = [];
          var hostProperties = ((_this._bindingParser.createDirectiveHostPropertyAsts(directive, elementName, sourceSpan)));
          hostProperties = _this._checkPropertiesInSchema(elementName, hostProperties);
          var hostEvents = ((_this._bindingParser.createDirectiveHostEventAsts(directive, sourceSpan)));
          _this._createDirectivePropertyAsts(directive.inputs, props, directiveProperties, targetBoundDirectivePropNames);
          elementOrDirectiveRefs.forEach(function(elOrDirRef) {
            if ((elOrDirRef.value.length === 0 && directive.isComponent) || (elOrDirRef.isReferenceToDirective(directive))) {
              targetReferences.push(new ReferenceAst(elOrDirRef.name, createTokenForReference(directive.type.reference), elOrDirRef.sourceSpan));
              matchedReferences.add(elOrDirRef.name);
            }
          });
          var contentQueryStartId = _this.contentQueryStartId;
          _this.contentQueryStartId += directive.queries.length;
          return new DirectiveAst(directive, directiveProperties, hostProperties, hostEvents, contentQueryStartId, sourceSpan);
        });
        elementOrDirectiveRefs.forEach(function(elOrDirRef) {
          if (elOrDirRef.value.length > 0) {
            if (!matchedReferences.has(elOrDirRef.name)) {
              _this._reportError("There is no directive with \"exportAs\" set to \"" + elOrDirRef.value + "\"", elOrDirRef.sourceSpan);
            }
          } else if (!component) {
            var refToken = ((null));
            if (isTemplateElement) {
              refToken = createTokenForExternalReference(_this.reflector, Identifiers.TemplateRef);
            }
            targetReferences.push(new ReferenceAst(elOrDirRef.name, refToken, elOrDirRef.sourceSpan));
          }
        });
        return directiveAsts;
      };
      TemplateParseVisitor.prototype._createDirectivePropertyAsts = function(directiveProperties, boundProps, targetBoundDirectiveProps, targetBoundDirectivePropNames) {
        if (directiveProperties) {
          var boundPropsByName_1 = new Map();
          boundProps.forEach(function(boundProp) {
            var prevValue = boundPropsByName_1.get(boundProp.name);
            if (!prevValue || prevValue.isLiteral) {
              boundPropsByName_1.set(boundProp.name, boundProp);
            }
          });
          Object.keys(directiveProperties).forEach(function(dirProp) {
            var elProp = directiveProperties[dirProp];
            var boundProp = boundPropsByName_1.get(elProp);
            if (boundProp) {
              targetBoundDirectivePropNames.add(boundProp.name);
              if (!isEmptyExpression(boundProp.expression)) {
                targetBoundDirectiveProps.push(new BoundDirectivePropertyAst(dirProp, boundProp.name, boundProp.expression, boundProp.sourceSpan));
              }
            }
          });
        }
      };
      TemplateParseVisitor.prototype._createElementPropertyAsts = function(elementName, props, boundDirectivePropNames) {
        var _this = this;
        var boundElementProps = [];
        props.forEach(function(prop) {
          if (!prop.isLiteral && !boundDirectivePropNames.has(prop.name)) {
            boundElementProps.push(_this._bindingParser.createElementPropertyAst(elementName, prop));
          }
        });
        return this._checkPropertiesInSchema(elementName, boundElementProps);
      };
      TemplateParseVisitor.prototype._findComponentDirectives = function(directives) {
        return directives.filter(function(directive) {
          return directive.directive.isComponent;
        });
      };
      TemplateParseVisitor.prototype._findComponentDirectiveNames = function(directives) {
        return this._findComponentDirectives(directives).map(function(directive) {
          return ((identifierName(directive.directive.type)));
        });
      };
      TemplateParseVisitor.prototype._assertOnlyOneComponent = function(directives, sourceSpan) {
        var componentTypeNames = this._findComponentDirectiveNames(directives);
        if (componentTypeNames.length > 1) {
          this._reportError("More than one component matched on this element.\n" + "Make sure that only one component's selector can match a given element.\n" + ("Conflicting components: " + componentTypeNames.join(',')), sourceSpan);
        }
      };
      TemplateParseVisitor.prototype._assertElementExists = function(matchElement, element) {
        var elName = element.name.replace(/^:xhtml:/, '');
        if (!matchElement && !this._schemaRegistry.hasElement(elName, this._schemas)) {
          var errorMsg = "'" + elName + "' is not a known element:\n";
          errorMsg += "1. If '" + elName + "' is an Angular component, then verify that it is part of this module.\n";
          if (elName.indexOf('-') > -1) {
            errorMsg += "2. If '" + elName + "' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the '@NgModule.schemas' of this component to suppress this message.";
          } else {
            errorMsg += "2. To allow any element add 'NO_ERRORS_SCHEMA' to the '@NgModule.schemas' of this component.";
          }
          this._reportError(errorMsg, ((element.sourceSpan)));
        }
      };
      TemplateParseVisitor.prototype._assertNoComponentsNorElementBindingsOnTemplate = function(directives, elementProps, sourceSpan) {
        var _this = this;
        var componentTypeNames = this._findComponentDirectiveNames(directives);
        if (componentTypeNames.length > 0) {
          this._reportError("Components on an embedded template: " + componentTypeNames.join(','), sourceSpan);
        }
        elementProps.forEach(function(prop) {
          _this._reportError("Property binding " + prop.name + " not used by any directive on an embedded template. Make sure that the property name is spelled correctly and all directives are listed in the \"@NgModule.declarations\".", sourceSpan);
        });
      };
      TemplateParseVisitor.prototype._assertAllEventsPublishedByDirectives = function(directives, events) {
        var _this = this;
        var allDirectiveEvents = new Set();
        directives.forEach(function(directive) {
          Object.keys(directive.directive.outputs).forEach(function(k) {
            var eventName = directive.directive.outputs[k];
            allDirectiveEvents.add(eventName);
          });
        });
        events.forEach(function(event) {
          if (event.target != null || !allDirectiveEvents.has(event.name)) {
            _this._reportError("Event binding " + event.fullName + " not emitted by any directive on an embedded template. Make sure that the event name is spelled correctly and all directives are listed in the \"@NgModule.declarations\".", event.sourceSpan);
          }
        });
      };
      TemplateParseVisitor.prototype._checkPropertiesInSchema = function(elementName, boundProps) {
        var _this = this;
        return boundProps.filter(function(boundProp) {
          if (boundProp.type === PropertyBindingType.Property && !_this._schemaRegistry.hasProperty(elementName, boundProp.name, _this._schemas)) {
            var errorMsg = "Can't bind to '" + boundProp.name + "' since it isn't a known property of '" + elementName + "'.";
            if (elementName.startsWith('ng-')) {
              errorMsg += "\n1. If '" + boundProp.name + "' is an Angular directive, then add 'CommonModule' to the '@NgModule.imports' of this component." + "\n2. To allow any property add 'NO_ERRORS_SCHEMA' to the '@NgModule.schemas' of this component.";
            } else if (elementName.indexOf('-') > -1) {
              errorMsg += "\n1. If '" + elementName + "' is an Angular component and it has '" + boundProp.name + "' input, then verify that it is part of this module." + ("\n2. If '" + elementName + "' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the '@NgModule.schemas' of this component to suppress this message.") + "\n3. To allow any property add 'NO_ERRORS_SCHEMA' to the '@NgModule.schemas' of this component.";
            }
            _this._reportError(errorMsg, boundProp.sourceSpan);
          }
          return !isEmptyExpression(boundProp.value);
        });
      };
      TemplateParseVisitor.prototype._reportError = function(message, sourceSpan, level) {
        if (level === void 0) {
          level = ParseErrorLevel.ERROR;
        }
        this._targetErrors.push(new ParseError(sourceSpan, message, level));
      };
      return TemplateParseVisitor;
    }());
    var NonBindableVisitor = (function() {
      function NonBindableVisitor() {}
      NonBindableVisitor.prototype.visitElement = function(ast, parent) {
        var preparsedElement = preparseElement(ast);
        if (preparsedElement.type === PreparsedElementType.SCRIPT || preparsedElement.type === PreparsedElementType.STYLE || preparsedElement.type === PreparsedElementType.STYLESHEET) {
          return null;
        }
        var attrNameAndValues = ast.attrs.map(function(attr) {
          return [attr.name, attr.value];
        });
        var selector = createElementCssSelector(ast.name, attrNameAndValues);
        var ngContentIndex = parent.findNgContentIndex(selector);
        var children = visitAll(this, ast.children, EMPTY_ELEMENT_CONTEXT);
        return new ElementAst(ast.name, visitAll(this, ast.attrs), [], [], [], [], [], false, [], children, ngContentIndex, ast.sourceSpan, ast.endSourceSpan);
      };
      NonBindableVisitor.prototype.visitComment = function(comment, context) {
        return null;
      };
      NonBindableVisitor.prototype.visitAttribute = function(attribute, context) {
        return new AttrAst(attribute.name, attribute.value, attribute.sourceSpan);
      };
      NonBindableVisitor.prototype.visitText = function(text, parent) {
        var ngContentIndex = ((parent.findNgContentIndex(TEXT_CSS_SELECTOR)));
        return new TextAst(text.value, ngContentIndex, ((text.sourceSpan)));
      };
      NonBindableVisitor.prototype.visitExpansion = function(expansion, context) {
        return expansion;
      };
      NonBindableVisitor.prototype.visitExpansionCase = function(expansionCase, context) {
        return expansionCase;
      };
      return NonBindableVisitor;
    }());
    var ElementOrDirectiveRef = (function() {
      function ElementOrDirectiveRef(name, value, sourceSpan) {
        this.name = name;
        this.value = value;
        this.sourceSpan = sourceSpan;
      }
      ElementOrDirectiveRef.prototype.isReferenceToDirective = function(directive) {
        return splitExportAs(directive.exportAs).indexOf(this.value) !== -1;
      };
      return ElementOrDirectiveRef;
    }());
    function splitExportAs(exportAs) {
      return exportAs ? exportAs.split(',').map(function(e) {
        return e.trim();
      }) : [];
    }
    function splitClasses(classAttrValue) {
      return classAttrValue.trim().split(/\s+/g);
    }
    var ElementContext = (function() {
      function ElementContext(isTemplateElement, _ngContentIndexMatcher, _wildcardNgContentIndex, providerContext) {
        this.isTemplateElement = isTemplateElement;
        this._ngContentIndexMatcher = _ngContentIndexMatcher;
        this._wildcardNgContentIndex = _wildcardNgContentIndex;
        this.providerContext = providerContext;
      }
      ElementContext.create = function(isTemplateElement, directives, providerContext) {
        var matcher = new SelectorMatcher();
        var wildcardNgContentIndex = ((null));
        var component = directives.find(function(directive) {
          return directive.directive.isComponent;
        });
        if (component) {
          var ngContentSelectors = ((component.directive.template)).ngContentSelectors;
          for (var i = 0; i < ngContentSelectors.length; i++) {
            var selector = ngContentSelectors[i];
            if (selector === '*') {
              wildcardNgContentIndex = i;
            } else {
              matcher.addSelectables(CssSelector.parse(ngContentSelectors[i]), i);
            }
          }
        }
        return new ElementContext(isTemplateElement, matcher, wildcardNgContentIndex, providerContext);
      };
      ElementContext.prototype.findNgContentIndex = function(selector) {
        var ngContentIndices = [];
        this._ngContentIndexMatcher.match(selector, function(selector, ngContentIndex) {
          ngContentIndices.push(ngContentIndex);
        });
        ngContentIndices.sort();
        if (this._wildcardNgContentIndex != null) {
          ngContentIndices.push(this._wildcardNgContentIndex);
        }
        return ngContentIndices.length > 0 ? ngContentIndices[0] : null;
      };
      return ElementContext;
    }());
    function createElementCssSelector(elementName, attributes) {
      var cssSelector = new CssSelector();
      var elNameNoNs = splitNsName(elementName)[1];
      cssSelector.setElement(elNameNoNs);
      for (var i = 0; i < attributes.length; i++) {
        var attrName = attributes[i][0];
        var attrNameNoNs = splitNsName(attrName)[1];
        var attrValue = attributes[i][1];
        cssSelector.addAttribute(attrNameNoNs, attrValue);
        if (attrName.toLowerCase() == CLASS_ATTR) {
          var classes = splitClasses(attrValue);
          classes.forEach(function(className) {
            return cssSelector.addClassName(className);
          });
        }
      }
      return cssSelector;
    }
    var EMPTY_ELEMENT_CONTEXT = new ElementContext(true, new SelectorMatcher(), null, null);
    var NON_BINDABLE_VISITOR = new NonBindableVisitor();
    function _isEmptyTextNode(node) {
      return node instanceof Text && node.value.trim().length == 0;
    }
    function removeSummaryDuplicates(items) {
      var map = new Map();
      items.forEach(function(item) {
        if (!map.get(item.type.reference)) {
          map.set(item.type.reference, item);
        }
      });
      return Array.from(map.values());
    }
    function isEmptyExpression(ast) {
      if (ast instanceof ASTWithSource) {
        ast = ast.ast;
      }
      return ast instanceof EmptyExpr;
    }
    function isTemplate(el, enableLegacyTemplate, reportDeprecation) {
      if (isNgTemplate(el.name))
        return true;
      var tagNoNs = splitNsName(el.name)[1];
      if (tagNoNs.toLowerCase() === TEMPLATE_ELEMENT) {
        if (enableLegacyTemplate && tagNoNs.toLowerCase() === TEMPLATE_ELEMENT) {
          reportDeprecation(TEMPLATE_ELEMENT_DEPRECATION_WARNING, ((el.sourceSpan)));
          return true;
        }
      }
      return false;
    }
    var EventHandlerVars = (function() {
      function EventHandlerVars() {}
      EventHandlerVars.event = variable('$event');
      return EventHandlerVars;
    }());
    var ConvertActionBindingResult = (function() {
      function ConvertActionBindingResult(stmts, allowDefault) {
        this.stmts = stmts;
        this.allowDefault = allowDefault;
      }
      return ConvertActionBindingResult;
    }());
    function convertActionBinding(localResolver, implicitReceiver, action, bindingId) {
      if (!localResolver) {
        localResolver = new DefaultLocalResolver();
      }
      var actionWithoutBuiltins = convertPropertyBindingBuiltins({
        createLiteralArrayConverter: function(argCount) {
          return function(args) {
            return literalArr(args);
          };
        },
        createLiteralMapConverter: function(keys) {
          return function(values) {
            var entries = keys.map(function(k, i) {
              return ({
                key: k.key,
                value: values[i],
                quoted: k.quoted
              });
            });
            return literalMap(entries);
          };
        },
        createPipeConverter: function(name) {
          throw new Error("Illegal State: Actions are not allowed to contain pipes. Pipe: " + name);
        }
      }, action);
      var visitor = new _AstToIrVisitor(localResolver, implicitReceiver, bindingId);
      var actionStmts = [];
      flattenStatements(actionWithoutBuiltins.visit(visitor, _Mode.Statement), actionStmts);
      prependTemporaryDecls(visitor.temporaryCount, bindingId, actionStmts);
      var lastIndex = actionStmts.length - 1;
      var preventDefaultVar = ((null));
      if (lastIndex >= 0) {
        var lastStatement = actionStmts[lastIndex];
        var returnExpr = convertStmtIntoExpression(lastStatement);
        if (returnExpr) {
          preventDefaultVar = createPreventDefaultVar(bindingId);
          actionStmts[lastIndex] = preventDefaultVar.set(returnExpr.cast(DYNAMIC_TYPE).notIdentical(literal(false))).toDeclStmt(null, [StmtModifier.Final]);
        }
      }
      return new ConvertActionBindingResult(actionStmts, preventDefaultVar);
    }
    function convertPropertyBindingBuiltins(converterFactory, ast) {
      return convertBuiltins(converterFactory, ast);
    }
    var ConvertPropertyBindingResult = (function() {
      function ConvertPropertyBindingResult(stmts, currValExpr) {
        this.stmts = stmts;
        this.currValExpr = currValExpr;
      }
      return ConvertPropertyBindingResult;
    }());
    var BindingForm = {
      General: 0,
      TrySimple: 1
    };
    BindingForm[BindingForm.General] = "General";
    BindingForm[BindingForm.TrySimple] = "TrySimple";
    function convertPropertyBinding(localResolver, implicitReceiver, expressionWithoutBuiltins, bindingId, form) {
      if (!localResolver) {
        localResolver = new DefaultLocalResolver();
      }
      var currValExpr = createCurrValueExpr(bindingId);
      var stmts = [];
      var visitor = new _AstToIrVisitor(localResolver, implicitReceiver, bindingId);
      var outputExpr = expressionWithoutBuiltins.visit(visitor, _Mode.Expression);
      if (visitor.temporaryCount) {
        for (var i = 0; i < visitor.temporaryCount; i++) {
          stmts.push(temporaryDeclaration(bindingId, i));
        }
      } else if (form == BindingForm.TrySimple) {
        return new ConvertPropertyBindingResult([], outputExpr);
      }
      stmts.push(currValExpr.set(outputExpr).toDeclStmt(DYNAMIC_TYPE, [StmtModifier.Final]));
      return new ConvertPropertyBindingResult(stmts, currValExpr);
    }
    function convertBuiltins(converterFactory, ast) {
      var visitor = new _BuiltinAstConverter(converterFactory);
      return ast.visit(visitor);
    }
    function temporaryName(bindingId, temporaryNumber) {
      return "tmp_" + bindingId + "_" + temporaryNumber;
    }
    function temporaryDeclaration(bindingId, temporaryNumber) {
      return new DeclareVarStmt(temporaryName(bindingId, temporaryNumber), NULL_EXPR);
    }
    function prependTemporaryDecls(temporaryCount, bindingId, statements) {
      for (var i = temporaryCount - 1; i >= 0; i--) {
        statements.unshift(temporaryDeclaration(bindingId, i));
      }
    }
    var _Mode = {
      Statement: 0,
      Expression: 1
    };
    _Mode[_Mode.Statement] = "Statement";
    _Mode[_Mode.Expression] = "Expression";
    function ensureStatementMode(mode, ast) {
      if (mode !== _Mode.Statement) {
        throw new Error("Expected a statement, but saw " + ast);
      }
    }
    function ensureExpressionMode(mode, ast) {
      if (mode !== _Mode.Expression) {
        throw new Error("Expected an expression, but saw " + ast);
      }
    }
    function convertToStatementIfNeeded(mode, expr) {
      if (mode === _Mode.Statement) {
        return expr.toStmt();
      } else {
        return expr;
      }
    }
    var _BuiltinAstConverter = (function(_super) {
      __extends(_BuiltinAstConverter, _super);
      function _BuiltinAstConverter(_converterFactory) {
        var _this = _super.call(this) || this;
        _this._converterFactory = _converterFactory;
        return _this;
      }
      _BuiltinAstConverter.prototype.visitPipe = function(ast, context) {
        var _this = this;
        var args = [ast.exp].concat(ast.args).map(function(ast) {
          return ast.visit(_this, context);
        });
        return new BuiltinFunctionCall(ast.span, args, this._converterFactory.createPipeConverter(ast.name, args.length));
      };
      _BuiltinAstConverter.prototype.visitLiteralArray = function(ast, context) {
        var _this = this;
        var args = ast.expressions.map(function(ast) {
          return ast.visit(_this, context);
        });
        return new BuiltinFunctionCall(ast.span, args, this._converterFactory.createLiteralArrayConverter(ast.expressions.length));
      };
      _BuiltinAstConverter.prototype.visitLiteralMap = function(ast, context) {
        var _this = this;
        var args = ast.values.map(function(ast) {
          return ast.visit(_this, context);
        });
        return new BuiltinFunctionCall(ast.span, args, this._converterFactory.createLiteralMapConverter(ast.keys));
      };
      return _BuiltinAstConverter;
    }(AstTransformer));
    var _AstToIrVisitor = (function() {
      function _AstToIrVisitor(_localResolver, _implicitReceiver, bindingId) {
        this._localResolver = _localResolver;
        this._implicitReceiver = _implicitReceiver;
        this.bindingId = bindingId;
        this._nodeMap = new Map();
        this._resultMap = new Map();
        this._currentTemporary = 0;
        this.temporaryCount = 0;
      }
      _AstToIrVisitor.prototype.visitBinary = function(ast, mode) {
        var op;
        switch (ast.operation) {
          case '+':
            op = BinaryOperator.Plus;
            break;
          case '-':
            op = BinaryOperator.Minus;
            break;
          case '*':
            op = BinaryOperator.Multiply;
            break;
          case '/':
            op = BinaryOperator.Divide;
            break;
          case '%':
            op = BinaryOperator.Modulo;
            break;
          case '&&':
            op = BinaryOperator.And;
            break;
          case '||':
            op = BinaryOperator.Or;
            break;
          case '==':
            op = BinaryOperator.Equals;
            break;
          case '!=':
            op = BinaryOperator.NotEquals;
            break;
          case '===':
            op = BinaryOperator.Identical;
            break;
          case '!==':
            op = BinaryOperator.NotIdentical;
            break;
          case '<':
            op = BinaryOperator.Lower;
            break;
          case '>':
            op = BinaryOperator.Bigger;
            break;
          case '<=':
            op = BinaryOperator.LowerEquals;
            break;
          case '>=':
            op = BinaryOperator.BiggerEquals;
            break;
          default:
            throw new Error("Unsupported operation " + ast.operation);
        }
        return convertToStatementIfNeeded(mode, new BinaryOperatorExpr(op, this._visit(ast.left, _Mode.Expression), this._visit(ast.right, _Mode.Expression)));
      };
      _AstToIrVisitor.prototype.visitChain = function(ast, mode) {
        ensureStatementMode(mode, ast);
        return this.visitAll(ast.expressions, mode);
      };
      _AstToIrVisitor.prototype.visitConditional = function(ast, mode) {
        var value = this._visit(ast.condition, _Mode.Expression);
        return convertToStatementIfNeeded(mode, value.conditional(this._visit(ast.trueExp, _Mode.Expression), this._visit(ast.falseExp, _Mode.Expression)));
      };
      _AstToIrVisitor.prototype.visitPipe = function(ast, mode) {
        throw new Error("Illegal state: Pipes should have been converted into functions. Pipe: " + ast.name);
      };
      _AstToIrVisitor.prototype.visitFunctionCall = function(ast, mode) {
        var convertedArgs = this.visitAll(ast.args, _Mode.Expression);
        var fnResult;
        if (ast instanceof BuiltinFunctionCall) {
          fnResult = ast.converter(convertedArgs);
        } else {
          fnResult = this._visit(((ast.target)), _Mode.Expression).callFn(convertedArgs);
        }
        return convertToStatementIfNeeded(mode, fnResult);
      };
      _AstToIrVisitor.prototype.visitImplicitReceiver = function(ast, mode) {
        ensureExpressionMode(mode, ast);
        return this._implicitReceiver;
      };
      _AstToIrVisitor.prototype.visitInterpolation = function(ast, mode) {
        ensureExpressionMode(mode, ast);
        var args = [literal(ast.expressions.length)];
        for (var i = 0; i < ast.strings.length - 1; i++) {
          args.push(literal(ast.strings[i]));
          args.push(this._visit(ast.expressions[i], _Mode.Expression));
        }
        args.push(literal(ast.strings[ast.strings.length - 1]));
        return ast.expressions.length <= 9 ? importExpr(Identifiers.inlineInterpolate).callFn(args) : importExpr(Identifiers.interpolate).callFn([args[0], literalArr(args.slice(1))]);
      };
      _AstToIrVisitor.prototype.visitKeyedRead = function(ast, mode) {
        var leftMostSafe = this.leftMostSafeNode(ast);
        if (leftMostSafe) {
          return this.convertSafeAccess(ast, leftMostSafe, mode);
        } else {
          return convertToStatementIfNeeded(mode, this._visit(ast.obj, _Mode.Expression).key(this._visit(ast.key, _Mode.Expression)));
        }
      };
      _AstToIrVisitor.prototype.visitKeyedWrite = function(ast, mode) {
        var obj = this._visit(ast.obj, _Mode.Expression);
        var key = this._visit(ast.key, _Mode.Expression);
        var value = this._visit(ast.value, _Mode.Expression);
        return convertToStatementIfNeeded(mode, obj.key(key).set(value));
      };
      _AstToIrVisitor.prototype.visitLiteralArray = function(ast, mode) {
        throw new Error("Illegal State: literal arrays should have been converted into functions");
      };
      _AstToIrVisitor.prototype.visitLiteralMap = function(ast, mode) {
        throw new Error("Illegal State: literal maps should have been converted into functions");
      };
      _AstToIrVisitor.prototype.visitLiteralPrimitive = function(ast, mode) {
        var type = ast.value === null || ast.value === undefined || ast.value === true || ast.value === true ? INFERRED_TYPE : undefined;
        return convertToStatementIfNeeded(mode, literal(ast.value, type));
      };
      _AstToIrVisitor.prototype._getLocal = function(name) {
        return this._localResolver.getLocal(name);
      };
      _AstToIrVisitor.prototype.visitMethodCall = function(ast, mode) {
        if (ast.receiver instanceof ImplicitReceiver && ast.name == '$any') {
          var args = (this.visitAll(ast.args, _Mode.Expression));
          if (args.length != 1) {
            throw new Error("Invalid call to $any, expected 1 argument but received " + (args.length || 'none'));
          }
          return ((args[0])).cast(DYNAMIC_TYPE);
        }
        var leftMostSafe = this.leftMostSafeNode(ast);
        if (leftMostSafe) {
          return this.convertSafeAccess(ast, leftMostSafe, mode);
        } else {
          var args = this.visitAll(ast.args, _Mode.Expression);
          var result = null;
          var receiver = this._visit(ast.receiver, _Mode.Expression);
          if (receiver === this._implicitReceiver) {
            var varExpr = this._getLocal(ast.name);
            if (varExpr) {
              result = varExpr.callFn(args);
            }
          }
          if (result == null) {
            result = receiver.callMethod(ast.name, args);
          }
          return convertToStatementIfNeeded(mode, result);
        }
      };
      _AstToIrVisitor.prototype.visitPrefixNot = function(ast, mode) {
        return convertToStatementIfNeeded(mode, not(this._visit(ast.expression, _Mode.Expression)));
      };
      _AstToIrVisitor.prototype.visitNonNullAssert = function(ast, mode) {
        return convertToStatementIfNeeded(mode, assertNotNull(this._visit(ast.expression, _Mode.Expression)));
      };
      _AstToIrVisitor.prototype.visitPropertyRead = function(ast, mode) {
        var leftMostSafe = this.leftMostSafeNode(ast);
        if (leftMostSafe) {
          return this.convertSafeAccess(ast, leftMostSafe, mode);
        } else {
          var result = null;
          var receiver = this._visit(ast.receiver, _Mode.Expression);
          if (receiver === this._implicitReceiver) {
            result = this._getLocal(ast.name);
          }
          if (result == null) {
            result = receiver.prop(ast.name);
          }
          return convertToStatementIfNeeded(mode, result);
        }
      };
      _AstToIrVisitor.prototype.visitPropertyWrite = function(ast, mode) {
        var receiver = this._visit(ast.receiver, _Mode.Expression);
        if (receiver === this._implicitReceiver) {
          var varExpr = this._getLocal(ast.name);
          if (varExpr) {
            throw new Error('Cannot assign to a reference or variable!');
          }
        }
        return convertToStatementIfNeeded(mode, receiver.prop(ast.name).set(this._visit(ast.value, _Mode.Expression)));
      };
      _AstToIrVisitor.prototype.visitSafePropertyRead = function(ast, mode) {
        return this.convertSafeAccess(ast, this.leftMostSafeNode(ast), mode);
      };
      _AstToIrVisitor.prototype.visitSafeMethodCall = function(ast, mode) {
        return this.convertSafeAccess(ast, this.leftMostSafeNode(ast), mode);
      };
      _AstToIrVisitor.prototype.visitAll = function(asts, mode) {
        var _this = this;
        return asts.map(function(ast) {
          return _this._visit(ast, mode);
        });
      };
      _AstToIrVisitor.prototype.visitQuote = function(ast, mode) {
        throw new Error("Quotes are not supported for evaluation!\n        Statement: " + ast.uninterpretedExpression + " located at " + ast.location);
      };
      _AstToIrVisitor.prototype._visit = function(ast, mode) {
        var result = this._resultMap.get(ast);
        if (result)
          return result;
        return (this._nodeMap.get(ast) || ast).visit(this, mode);
      };
      _AstToIrVisitor.prototype.convertSafeAccess = function(ast, leftMostSafe, mode) {
        var guardedExpression = this._visit(leftMostSafe.receiver, _Mode.Expression);
        var temporary = ((undefined));
        if (this.needsTemporary(leftMostSafe.receiver)) {
          temporary = this.allocateTemporary();
          guardedExpression = temporary.set(guardedExpression);
          this._resultMap.set(leftMostSafe.receiver, temporary);
        }
        var condition = guardedExpression.isBlank();
        if (leftMostSafe instanceof SafeMethodCall) {
          this._nodeMap.set(leftMostSafe, new MethodCall(leftMostSafe.span, leftMostSafe.receiver, leftMostSafe.name, leftMostSafe.args));
        } else {
          this._nodeMap.set(leftMostSafe, new PropertyRead(leftMostSafe.span, leftMostSafe.receiver, leftMostSafe.name));
        }
        var access = this._visit(ast, _Mode.Expression);
        this._nodeMap.delete(leftMostSafe);
        if (temporary) {
          this.releaseTemporary(temporary);
        }
        return convertToStatementIfNeeded(mode, condition.conditional(literal(null), access));
      };
      _AstToIrVisitor.prototype.leftMostSafeNode = function(ast) {
        var _this = this;
        var visit = function(visitor, ast) {
          return (_this._nodeMap.get(ast) || ast).visit(visitor);
        };
        return ast.visit({
          visitBinary: function(ast) {
            return null;
          },
          visitChain: function(ast) {
            return null;
          },
          visitConditional: function(ast) {
            return null;
          },
          visitFunctionCall: function(ast) {
            return null;
          },
          visitImplicitReceiver: function(ast) {
            return null;
          },
          visitInterpolation: function(ast) {
            return null;
          },
          visitKeyedRead: function(ast) {
            return visit(this, ast.obj);
          },
          visitKeyedWrite: function(ast) {
            return null;
          },
          visitLiteralArray: function(ast) {
            return null;
          },
          visitLiteralMap: function(ast) {
            return null;
          },
          visitLiteralPrimitive: function(ast) {
            return null;
          },
          visitMethodCall: function(ast) {
            return visit(this, ast.receiver);
          },
          visitPipe: function(ast) {
            return null;
          },
          visitPrefixNot: function(ast) {
            return null;
          },
          visitNonNullAssert: function(ast) {
            return null;
          },
          visitPropertyRead: function(ast) {
            return visit(this, ast.receiver);
          },
          visitPropertyWrite: function(ast) {
            return null;
          },
          visitQuote: function(ast) {
            return null;
          },
          visitSafeMethodCall: function(ast) {
            return visit(this, ast.receiver) || ast;
          },
          visitSafePropertyRead: function(ast) {
            return visit(this, ast.receiver) || ast;
          }
        });
      };
      _AstToIrVisitor.prototype.needsTemporary = function(ast) {
        var _this = this;
        var visit = function(visitor, ast) {
          return ast && (_this._nodeMap.get(ast) || ast).visit(visitor);
        };
        var visitSome = function(visitor, ast) {
          return ast.some(function(ast) {
            return visit(visitor, ast);
          });
        };
        return ast.visit({
          visitBinary: function(ast) {
            return visit(this, ast.left) || visit(this, ast.right);
          },
          visitChain: function(ast) {
            return false;
          },
          visitConditional: function(ast) {
            return visit(this, ast.condition) || visit(this, ast.trueExp) || visit(this, ast.falseExp);
          },
          visitFunctionCall: function(ast) {
            return true;
          },
          visitImplicitReceiver: function(ast) {
            return false;
          },
          visitInterpolation: function(ast) {
            return visitSome(this, ast.expressions);
          },
          visitKeyedRead: function(ast) {
            return false;
          },
          visitKeyedWrite: function(ast) {
            return false;
          },
          visitLiteralArray: function(ast) {
            return true;
          },
          visitLiteralMap: function(ast) {
            return true;
          },
          visitLiteralPrimitive: function(ast) {
            return false;
          },
          visitMethodCall: function(ast) {
            return true;
          },
          visitPipe: function(ast) {
            return true;
          },
          visitPrefixNot: function(ast) {
            return visit(this, ast.expression);
          },
          visitNonNullAssert: function(ast) {
            return visit(this, ast.expression);
          },
          visitPropertyRead: function(ast) {
            return false;
          },
          visitPropertyWrite: function(ast) {
            return false;
          },
          visitQuote: function(ast) {
            return false;
          },
          visitSafeMethodCall: function(ast) {
            return true;
          },
          visitSafePropertyRead: function(ast) {
            return false;
          }
        });
      };
      _AstToIrVisitor.prototype.allocateTemporary = function() {
        var tempNumber = this._currentTemporary++;
        this.temporaryCount = Math.max(this._currentTemporary, this.temporaryCount);
        return new ReadVarExpr(temporaryName(this.bindingId, tempNumber));
      };
      _AstToIrVisitor.prototype.releaseTemporary = function(temporary) {
        this._currentTemporary--;
        if (temporary.name != temporaryName(this.bindingId, this._currentTemporary)) {
          throw new Error("Temporary " + temporary.name + " released out of order");
        }
      };
      return _AstToIrVisitor;
    }());
    function flattenStatements(arg, output) {
      if (Array.isArray(arg)) {
        ((arg)).forEach(function(entry) {
          return flattenStatements(entry, output);
        });
      } else {
        output.push(arg);
      }
    }
    var DefaultLocalResolver = (function() {
      function DefaultLocalResolver() {}
      DefaultLocalResolver.prototype.getLocal = function(name) {
        if (name === EventHandlerVars.event.name) {
          return EventHandlerVars.event;
        }
        return null;
      };
      return DefaultLocalResolver;
    }());
    function createCurrValueExpr(bindingId) {
      return variable("currVal_" + bindingId);
    }
    function createPreventDefaultVar(bindingId) {
      return variable("pd_" + bindingId);
    }
    function convertStmtIntoExpression(stmt) {
      if (stmt instanceof ExpressionStatement) {
        return stmt.expr;
      } else if (stmt instanceof ReturnStatement) {
        return stmt.value;
      }
      return null;
    }
    var BuiltinFunctionCall = (function(_super) {
      __extends(BuiltinFunctionCall, _super);
      function BuiltinFunctionCall(span, args, converter) {
        var _this = _super.call(this, span, null, args) || this;
        _this.args = args;
        _this.converter = converter;
        return _this;
      }
      return BuiltinFunctionCall;
    }(FunctionCall));
    var TypeCheckCompiler = (function() {
      function TypeCheckCompiler(options, reflector) {
        this.options = options;
        this.reflector = reflector;
      }
      TypeCheckCompiler.prototype.compileComponent = function(componentId, component, template, usedPipes, externalReferenceVars, ctx) {
        var _this = this;
        var pipes = new Map();
        usedPipes.forEach(function(p) {
          return pipes.set(p.name, p.type.reference);
        });
        var embeddedViewCount = 0;
        var viewBuilderFactory = function(parent, guards) {
          var embeddedViewIndex = embeddedViewCount++;
          return new ViewBuilder(_this.options, _this.reflector, externalReferenceVars, parent, component.type.reference, component.isHost, embeddedViewIndex, pipes, guards, ctx, viewBuilderFactory);
        };
        var visitor = viewBuilderFactory(null, []);
        visitor.visitAll([], template);
        return visitor.build(componentId);
      };
      return TypeCheckCompiler;
    }());
    var DYNAMIC_VAR_NAME = '_any';
    var TypeCheckLocalResolver = (function() {
      function TypeCheckLocalResolver() {}
      TypeCheckLocalResolver.prototype.getLocal = function(name) {
        if (name === EventHandlerVars.event.name) {
          return variable(DYNAMIC_VAR_NAME);
        }
        return null;
      };
      return TypeCheckLocalResolver;
    }());
    var defaultResolver = new TypeCheckLocalResolver();
    var ViewBuilder = (function() {
      function ViewBuilder(options, reflector, externalReferenceVars, parent, component, isHostComponent, embeddedViewIndex, pipes, guards, ctx, viewBuilderFactory) {
        this.options = options;
        this.reflector = reflector;
        this.externalReferenceVars = externalReferenceVars;
        this.parent = parent;
        this.component = component;
        this.isHostComponent = isHostComponent;
        this.embeddedViewIndex = embeddedViewIndex;
        this.pipes = pipes;
        this.guards = guards;
        this.ctx = ctx;
        this.viewBuilderFactory = viewBuilderFactory;
        this.refOutputVars = new Map();
        this.variables = [];
        this.children = [];
        this.updates = [];
        this.actions = [];
      }
      ViewBuilder.prototype.getOutputVar = function(type) {
        var varName;
        if (type === this.component && this.isHostComponent) {
          varName = DYNAMIC_VAR_NAME;
        } else if (type instanceof StaticSymbol) {
          varName = this.externalReferenceVars.get(type);
        } else {
          varName = DYNAMIC_VAR_NAME;
        }
        if (!varName) {
          throw new Error("Illegal State: referring to a type without a variable " + JSON.stringify(type));
        }
        return varName;
      };
      ViewBuilder.prototype.getTypeGuardExpressions = function(ast) {
        var result = this.guards.slice();
        for (var _i = 0,
            _a = ast.directives; _i < _a.length; _i++) {
          var directive = _a[_i];
          for (var _b = 0,
              _c = directive.inputs; _b < _c.length; _b++) {
            var input = _c[_b];
            var guard = directive.directive.guards[input.directiveName];
            if (guard) {
              var useIf = guard === 'UseIf';
              result.push({
                guard: guard,
                useIf: useIf,
                expression: ({
                  context: this.component,
                  value: input.value
                })
              });
            }
          }
        }
        return result;
      };
      ViewBuilder.prototype.visitAll = function(variables, astNodes) {
        this.variables = variables;
        templateVisitAll(this, astNodes);
      };
      ViewBuilder.prototype.build = function(componentId, targetStatements) {
        var _this = this;
        if (targetStatements === void 0) {
          targetStatements = [];
        }
        this.children.forEach(function(child) {
          return child.build(componentId, targetStatements);
        });
        var viewStmts = [variable(DYNAMIC_VAR_NAME).set(NULL_EXPR).toDeclStmt(DYNAMIC_TYPE)];
        var bindingCount = 0;
        this.updates.forEach(function(expression) {
          var _a = _this.preprocessUpdateExpression(expression),
              sourceSpan = _a.sourceSpan,
              context = _a.context,
              value = _a.value;
          var bindingId = "" + bindingCount++;
          var nameResolver = context === _this.component ? _this : defaultResolver;
          var _b = convertPropertyBinding(nameResolver, variable(_this.getOutputVar(context)), value, bindingId, BindingForm.General),
              stmts = _b.stmts,
              currValExpr = _b.currValExpr;
          stmts.push(new ExpressionStatement(currValExpr));
          viewStmts.push.apply(viewStmts, stmts.map(function(stmt) {
            return applySourceSpanToStatementIfNeeded(stmt, sourceSpan);
          }));
        });
        this.actions.forEach(function(_a) {
          var sourceSpan = _a.sourceSpan,
              context = _a.context,
              value = _a.value;
          var bindingId = "" + bindingCount++;
          var nameResolver = context === _this.component ? _this : defaultResolver;
          var stmts = convertActionBinding(nameResolver, variable(_this.getOutputVar(context)), value, bindingId).stmts;
          viewStmts.push.apply(viewStmts, stmts.map(function(stmt) {
            return applySourceSpanToStatementIfNeeded(stmt, sourceSpan);
          }));
        });
        if (this.guards.length) {
          var guardExpression = undefined;
          for (var _i = 0,
              _a = this.guards; _i < _a.length; _i++) {
            var guard = _a[_i];
            var _b = this.preprocessUpdateExpression(guard.expression),
                context = _b.context,
                value = _b.value;
            var bindingId = "" + bindingCount++;
            var nameResolver = context === this.component ? this : defaultResolver;
            var _c = convertPropertyBinding(nameResolver, variable(this.getOutputVar(context)), value, bindingId, BindingForm.TrySimple),
                stmts = _c.stmts,
                currValExpr = _c.currValExpr;
            if (stmts.length == 0) {
              var guardClause = guard.useIf ? currValExpr : this.ctx.importExpr(guard.guard).callFn([currValExpr]);
              guardExpression = guardExpression ? guardExpression.and(guardClause) : guardClause;
            }
          }
          if (guardExpression) {
            viewStmts = [new IfStmt(guardExpression, viewStmts)];
          }
        }
        var viewName = "_View_" + componentId + "_" + this.embeddedViewIndex;
        var viewFactory = new DeclareFunctionStmt(viewName, [], viewStmts);
        targetStatements.push(viewFactory);
        return targetStatements;
      };
      ViewBuilder.prototype.visitBoundText = function(ast, context) {
        var _this = this;
        var astWithSource = (ast.value);
        var inter = (astWithSource.ast);
        inter.expressions.forEach(function(expr) {
          return _this.updates.push({
            context: _this.component,
            value: expr,
            sourceSpan: ast.sourceSpan
          });
        });
      };
      ViewBuilder.prototype.visitEmbeddedTemplate = function(ast, context) {
        this.visitElementOrTemplate(ast);
        if (this.options.fullTemplateTypeCheck) {
          var guards = this.getTypeGuardExpressions(ast);
          var childVisitor = this.viewBuilderFactory(this, guards);
          this.children.push(childVisitor);
          childVisitor.visitAll(ast.variables, ast.children);
        }
      };
      ViewBuilder.prototype.visitElement = function(ast, context) {
        var _this = this;
        this.visitElementOrTemplate(ast);
        var inputDefs = [];
        var updateRendererExpressions = [];
        var outputDefs = [];
        ast.inputs.forEach(function(inputAst) {
          _this.updates.push({
            context: _this.component,
            value: inputAst.value,
            sourceSpan: inputAst.sourceSpan
          });
        });
        templateVisitAll(this, ast.children);
      };
      ViewBuilder.prototype.visitElementOrTemplate = function(ast) {
        var _this = this;
        ast.directives.forEach(function(dirAst) {
          _this.visitDirective(dirAst);
        });
        ast.references.forEach(function(ref) {
          var outputVarType = ((null));
          if (ref.value && ref.value.identifier && _this.options.fullTemplateTypeCheck) {
            outputVarType = ref.value.identifier.reference;
          } else {
            outputVarType = BuiltinTypeName.Dynamic;
          }
          _this.refOutputVars.set(ref.name, outputVarType);
        });
        ast.outputs.forEach(function(outputAst) {
          _this.actions.push({
            context: _this.component,
            value: outputAst.handler,
            sourceSpan: outputAst.sourceSpan
          });
        });
      };
      ViewBuilder.prototype.visitDirective = function(dirAst) {
        var _this = this;
        var dirType = dirAst.directive.type.reference;
        dirAst.inputs.forEach(function(input) {
          return _this.updates.push({
            context: _this.component,
            value: input.value,
            sourceSpan: input.sourceSpan
          });
        });
        if (this.options.fullTemplateTypeCheck) {
          dirAst.hostProperties.forEach(function(inputAst) {
            return _this.updates.push({
              context: dirType,
              value: inputAst.value,
              sourceSpan: inputAst.sourceSpan
            });
          });
          dirAst.hostEvents.forEach(function(hostEventAst) {
            return _this.actions.push({
              context: dirType,
              value: hostEventAst.handler,
              sourceSpan: hostEventAst.sourceSpan
            });
          });
        }
      };
      ViewBuilder.prototype.getLocal = function(name) {
        if (name == EventHandlerVars.event.name) {
          return variable(this.getOutputVar(BuiltinTypeName.Dynamic));
        }
        for (var currBuilder = this; currBuilder; currBuilder = currBuilder.parent) {
          var outputVarType = void 0;
          outputVarType = currBuilder.refOutputVars.get(name);
          if (outputVarType == null) {
            var varAst = currBuilder.variables.find(function(varAst) {
              return varAst.name === name;
            });
            if (varAst) {
              outputVarType = BuiltinTypeName.Dynamic;
            }
          }
          if (outputVarType != null) {
            return variable(this.getOutputVar(outputVarType));
          }
        }
        return null;
      };
      ViewBuilder.prototype.pipeOutputVar = function(name) {
        var pipe = this.pipes.get(name);
        if (!pipe) {
          throw new Error("Illegal State: Could not find pipe " + name + " in template of " + this.component);
        }
        return this.getOutputVar(pipe);
      };
      ViewBuilder.prototype.preprocessUpdateExpression = function(expression) {
        var _this = this;
        return {
          sourceSpan: expression.sourceSpan,
          context: expression.context,
          value: convertPropertyBindingBuiltins({
            createLiteralArrayConverter: function(argCount) {
              return function(args) {
                var arr = literalArr(args);
                return _this.options.fullTemplateTypeCheck ? arr : arr.cast(DYNAMIC_TYPE);
              };
            },
            createLiteralMapConverter: function(keys) {
              return function(values) {
                var entries = keys.map(function(k, i) {
                  return ({
                    key: k.key,
                    value: values[i],
                    quoted: k.quoted
                  });
                });
                var map = literalMap(entries);
                return _this.options.fullTemplateTypeCheck ? map : map.cast(DYNAMIC_TYPE);
              };
            },
            createPipeConverter: function(name, argCount) {
              return function(args) {
                var pipeExpr = _this.options.fullTemplateTypeCheck ? variable(_this.pipeOutputVar(name)) : variable(_this.getOutputVar(BuiltinTypeName.Dynamic));
                return pipeExpr.callMethod('transform', args);
              };
            }
          }, expression.value)
        };
      };
      ViewBuilder.prototype.visitNgContent = function(ast, context) {};
      ViewBuilder.prototype.visitText = function(ast, context) {};
      ViewBuilder.prototype.visitDirectiveProperty = function(ast, context) {};
      ViewBuilder.prototype.visitReference = function(ast, context) {};
      ViewBuilder.prototype.visitVariable = function(ast, context) {};
      ViewBuilder.prototype.visitEvent = function(ast, context) {};
      ViewBuilder.prototype.visitElementProperty = function(ast, context) {};
      ViewBuilder.prototype.visitAttr = function(ast, context) {};
      return ViewBuilder;
    }());
    var CLASS_ATTR$1 = 'class';
    var STYLE_ATTR = 'style';
    var IMPLICIT_TEMPLATE_VAR = '\$implicit';
    var ViewCompileResult = (function() {
      function ViewCompileResult(viewClassVar, rendererTypeVar) {
        this.viewClassVar = viewClassVar;
        this.rendererTypeVar = rendererTypeVar;
      }
      return ViewCompileResult;
    }());
    var ViewCompiler = (function() {
      function ViewCompiler(_reflector) {
        this._reflector = _reflector;
      }
      ViewCompiler.prototype.compileComponent = function(outputCtx, component, template, styles, usedPipes) {
        var _this = this;
        var embeddedViewCount = 0;
        var staticQueryIds = findStaticQueryIds(template);
        var renderComponentVarName = ((undefined));
        if (!component.isHost) {
          var template_1 = ((component.template));
          var customRenderData = [];
          if (template_1.animations && template_1.animations.length) {
            customRenderData.push(new LiteralMapEntry('animation', convertValueToOutputAst(outputCtx, template_1.animations), true));
          }
          var renderComponentVar = variable(rendererTypeName(component.type.reference));
          renderComponentVarName = ((renderComponentVar.name));
          outputCtx.statements.push(renderComponentVar.set(importExpr(Identifiers.createRendererType2).callFn([new LiteralMapExpr([new LiteralMapEntry('encapsulation', literal(template_1.encapsulation), false), new LiteralMapEntry('styles', styles, false), new LiteralMapEntry('data', new LiteralMapExpr(customRenderData), false)])])).toDeclStmt(importType(Identifiers.RendererType2), [StmtModifier.Final, StmtModifier.Exported]));
        }
        var viewBuilderFactory = function(parent) {
          var embeddedViewIndex = embeddedViewCount++;
          return new ViewBuilder$1(_this._reflector, outputCtx, parent, component, embeddedViewIndex, usedPipes, staticQueryIds, viewBuilderFactory);
        };
        var visitor = viewBuilderFactory(null);
        visitor.visitAll([], template);
        (_a = outputCtx.statements).push.apply(_a, visitor.build());
        return new ViewCompileResult(visitor.viewName, renderComponentVarName);
        var _a;
      };
      return ViewCompiler;
    }());
    var LOG_VAR$1 = variable('_l');
    var VIEW_VAR = variable('_v');
    var CHECK_VAR = variable('_ck');
    var COMP_VAR = variable('_co');
    var EVENT_NAME_VAR = variable('en');
    var ALLOW_DEFAULT_VAR = variable("ad");
    var ViewBuilder$1 = (function() {
      function ViewBuilder(reflector, outputCtx, parent, component, embeddedViewIndex, usedPipes, staticQueryIds, viewBuilderFactory) {
        this.reflector = reflector;
        this.outputCtx = outputCtx;
        this.parent = parent;
        this.component = component;
        this.embeddedViewIndex = embeddedViewIndex;
        this.usedPipes = usedPipes;
        this.staticQueryIds = staticQueryIds;
        this.viewBuilderFactory = viewBuilderFactory;
        this.nodes = [];
        this.purePipeNodeIndices = Object.create(null);
        this.refNodeIndices = Object.create(null);
        this.variables = [];
        this.children = [];
        this.compType = this.embeddedViewIndex > 0 ? DYNAMIC_TYPE : ((expressionType(outputCtx.importExpr(this.component.type.reference))));
        this.viewName = viewClassName(this.component.type.reference, this.embeddedViewIndex);
      }
      ViewBuilder.prototype.visitAll = function(variables, astNodes) {
        var _this = this;
        this.variables = variables;
        if (!this.parent) {
          this.usedPipes.forEach(function(pipe) {
            if (pipe.pure) {
              _this.purePipeNodeIndices[pipe.name] = _this._createPipe(null, pipe);
            }
          });
        }
        if (!this.parent) {
          var queryIds_1 = staticViewQueryIds(this.staticQueryIds);
          this.component.viewQueries.forEach(function(query, queryIndex) {
            var queryId = queryIndex + 1;
            var bindingType = query.first ? 0 : 1;
            var flags = 134217728 | calcStaticDynamicQueryFlags(queryIds_1, queryId, query.first);
            _this.nodes.push(function() {
              return ({
                sourceSpan: null,
                nodeFlags: flags,
                nodeDef: importExpr(Identifiers.queryDef).callFn([literal(flags), literal(queryId), new LiteralMapExpr([new LiteralMapEntry(query.propertyName, literal(bindingType), false)])])
              });
            });
          });
        }
        templateVisitAll(this, astNodes);
        if (this.parent && (astNodes.length === 0 || needsAdditionalRootNode(astNodes))) {
          this.nodes.push(function() {
            return ({
              sourceSpan: null,
              nodeFlags: 1,
              nodeDef: importExpr(Identifiers.anchorDef).callFn([literal(0), NULL_EXPR, NULL_EXPR, literal(0)])
            });
          });
        }
      };
      ViewBuilder.prototype.build = function(targetStatements) {
        if (targetStatements === void 0) {
          targetStatements = [];
        }
        this.children.forEach(function(child) {
          return child.build(targetStatements);
        });
        var _a = this._createNodeExpressions(),
            updateRendererStmts = _a.updateRendererStmts,
            updateDirectivesStmts = _a.updateDirectivesStmts,
            nodeDefExprs = _a.nodeDefExprs;
        var updateRendererFn = this._createUpdateFn(updateRendererStmts);
        var updateDirectivesFn = this._createUpdateFn(updateDirectivesStmts);
        var viewFlags = 0;
        if (!this.parent && this.component.changeDetection === ChangeDetectionStrategy.OnPush) {
          viewFlags |= 2;
        }
        var viewFactory = new DeclareFunctionStmt(this.viewName, [new FnParam(((LOG_VAR$1.name)))], [new ReturnStatement(importExpr(Identifiers.viewDef).callFn([literal(viewFlags), literalArr(nodeDefExprs), updateDirectivesFn, updateRendererFn]))], importType(Identifiers.ViewDefinition), this.embeddedViewIndex === 0 ? [StmtModifier.Exported] : []);
        targetStatements.push(viewFactory);
        return targetStatements;
      };
      ViewBuilder.prototype._createUpdateFn = function(updateStmts) {
        var updateFn;
        if (updateStmts.length > 0) {
          var preStmts = [];
          if (!this.component.isHost && findReadVarNames(updateStmts).has(((COMP_VAR.name)))) {
            preStmts.push(COMP_VAR.set(VIEW_VAR.prop('component')).toDeclStmt(this.compType));
          }
          updateFn = fn([new FnParam(((CHECK_VAR.name)), INFERRED_TYPE), new FnParam(((VIEW_VAR.name)), INFERRED_TYPE)], preStmts.concat(updateStmts), INFERRED_TYPE);
        } else {
          updateFn = NULL_EXPR;
        }
        return updateFn;
      };
      ViewBuilder.prototype.visitNgContent = function(ast, context) {
        this.nodes.push(function() {
          return ({
            sourceSpan: ast.sourceSpan,
            nodeFlags: 8,
            nodeDef: importExpr(Identifiers.ngContentDef).callFn([literal(ast.ngContentIndex), literal(ast.index)])
          });
        });
      };
      ViewBuilder.prototype.visitText = function(ast, context) {
        var checkIndex = -1;
        this.nodes.push(function() {
          return ({
            sourceSpan: ast.sourceSpan,
            nodeFlags: 2,
            nodeDef: importExpr(Identifiers.textDef).callFn([literal(checkIndex), literal(ast.ngContentIndex), literalArr([literal(ast.value)])])
          });
        });
      };
      ViewBuilder.prototype.visitBoundText = function(ast, context) {
        var _this = this;
        var nodeIndex = this.nodes.length;
        this.nodes.push(((null)));
        var astWithSource = (ast.value);
        var inter = (astWithSource.ast);
        var updateRendererExpressions = inter.expressions.map(function(expr, bindingIndex) {
          return _this._preprocessUpdateExpression({
            nodeIndex: nodeIndex,
            bindingIndex: bindingIndex,
            sourceSpan: ast.sourceSpan,
            context: COMP_VAR,
            value: expr
          });
        });
        var checkIndex = nodeIndex;
        this.nodes[nodeIndex] = function() {
          return ({
            sourceSpan: ast.sourceSpan,
            nodeFlags: 2,
            nodeDef: importExpr(Identifiers.textDef).callFn([literal(checkIndex), literal(ast.ngContentIndex), literalArr(inter.strings.map(function(s) {
              return literal(s);
            }))]),
            updateRenderer: updateRendererExpressions
          });
        };
      };
      ViewBuilder.prototype.visitEmbeddedTemplate = function(ast, context) {
        var _this = this;
        var nodeIndex = this.nodes.length;
        this.nodes.push(((null)));
        var _a = this._visitElementOrTemplate(nodeIndex, ast),
            flags = _a.flags,
            queryMatchesExpr = _a.queryMatchesExpr,
            hostEvents = _a.hostEvents;
        var childVisitor = this.viewBuilderFactory(this);
        this.children.push(childVisitor);
        childVisitor.visitAll(ast.variables, ast.children);
        var childCount = this.nodes.length - nodeIndex - 1;
        this.nodes[nodeIndex] = function() {
          return ({
            sourceSpan: ast.sourceSpan,
            nodeFlags: 1 | flags,
            nodeDef: importExpr(Identifiers.anchorDef).callFn([literal(flags), queryMatchesExpr, literal(ast.ngContentIndex), literal(childCount), _this._createElementHandleEventFn(nodeIndex, hostEvents), variable(childVisitor.viewName)])
          });
        };
      };
      ViewBuilder.prototype.visitElement = function(ast, context) {
        var _this = this;
        var nodeIndex = this.nodes.length;
        this.nodes.push(((null)));
        var elName = isNgContainer(ast.name) ? null : ast.name;
        var _a = this._visitElementOrTemplate(nodeIndex, ast),
            flags = _a.flags,
            usedEvents = _a.usedEvents,
            queryMatchesExpr = _a.queryMatchesExpr,
            dirHostBindings = _a.hostBindings,
            hostEvents = _a.hostEvents;
        var inputDefs = [];
        var updateRendererExpressions = [];
        var outputDefs = [];
        if (elName) {
          var hostBindings = ast.inputs.map(function(inputAst) {
            return ({
              context: (COMP_VAR),
              inputAst: inputAst,
              dirAst: (null)
            });
          }).concat(dirHostBindings);
          if (hostBindings.length) {
            updateRendererExpressions = hostBindings.map(function(hostBinding, bindingIndex) {
              return _this._preprocessUpdateExpression({
                context: hostBinding.context,
                nodeIndex: nodeIndex,
                bindingIndex: bindingIndex,
                sourceSpan: hostBinding.inputAst.sourceSpan,
                value: hostBinding.inputAst.value
              });
            });
            inputDefs = hostBindings.map(function(hostBinding) {
              return elementBindingDef(hostBinding.inputAst, hostBinding.dirAst);
            });
          }
          outputDefs = usedEvents.map(function(_a) {
            var target = _a[0],
                eventName = _a[1];
            return literalArr([literal(target), literal(eventName)]);
          });
        }
        templateVisitAll(this, ast.children);
        var childCount = this.nodes.length - nodeIndex - 1;
        var compAst = ast.directives.find(function(dirAst) {
          return dirAst.directive.isComponent;
        });
        var compRendererType = (NULL_EXPR);
        var compView = (NULL_EXPR);
        if (compAst) {
          compView = this.outputCtx.importExpr(compAst.directive.componentViewType);
          compRendererType = this.outputCtx.importExpr(compAst.directive.rendererType);
        }
        var checkIndex = nodeIndex;
        this.nodes[nodeIndex] = function() {
          return ({
            sourceSpan: ast.sourceSpan,
            nodeFlags: 1 | flags,
            nodeDef: importExpr(Identifiers.elementDef).callFn([literal(checkIndex), literal(flags), queryMatchesExpr, literal(ast.ngContentIndex), literal(childCount), literal(elName), elName ? fixedAttrsDef(ast) : NULL_EXPR, inputDefs.length ? literalArr(inputDefs) : NULL_EXPR, outputDefs.length ? literalArr(outputDefs) : NULL_EXPR, _this._createElementHandleEventFn(nodeIndex, hostEvents), compView, compRendererType]),
            updateRenderer: updateRendererExpressions
          });
        };
      };
      ViewBuilder.prototype._visitElementOrTemplate = function(nodeIndex, ast) {
        var _this = this;
        var flags = 0;
        if (ast.hasViewContainer) {
          flags |= 16777216;
        }
        var usedEvents = new Map();
        ast.outputs.forEach(function(event) {
          var _a = elementEventNameAndTarget(event, null),
              name = _a.name,
              target = _a.target;
          usedEvents.set(elementEventFullName(target, name), [target, name]);
        });
        ast.directives.forEach(function(dirAst) {
          dirAst.hostEvents.forEach(function(event) {
            var _a = elementEventNameAndTarget(event, dirAst),
                name = _a.name,
                target = _a.target;
            usedEvents.set(elementEventFullName(target, name), [target, name]);
          });
        });
        var hostBindings = [];
        var hostEvents = [];
        this._visitComponentFactoryResolverProvider(ast.directives);
        ast.providers.forEach(function(providerAst, providerIndex) {
          var dirAst = ((undefined));
          var dirIndex = ((undefined));
          ast.directives.forEach(function(localDirAst, i) {
            if (localDirAst.directive.type.reference === tokenReference(providerAst.token)) {
              dirAst = localDirAst;
              dirIndex = i;
            }
          });
          if (dirAst) {
            var _a = _this._visitDirective(providerAst, dirAst, dirIndex, nodeIndex, ast.references, ast.queryMatches, usedEvents, ((_this.staticQueryIds.get((ast))))),
                dirHostBindings = _a.hostBindings,
                dirHostEvents = _a.hostEvents;
            hostBindings.push.apply(hostBindings, dirHostBindings);
            hostEvents.push.apply(hostEvents, dirHostEvents);
          } else {
            _this._visitProvider(providerAst, ast.queryMatches);
          }
        });
        var queryMatchExprs = [];
        ast.queryMatches.forEach(function(match) {
          var valueType = ((undefined));
          if (tokenReference(match.value) === _this.reflector.resolveExternalReference(Identifiers.ElementRef)) {
            valueType = 0;
          } else if (tokenReference(match.value) === _this.reflector.resolveExternalReference(Identifiers.ViewContainerRef)) {
            valueType = 3;
          } else if (tokenReference(match.value) === _this.reflector.resolveExternalReference(Identifiers.TemplateRef)) {
            valueType = 2;
          }
          if (valueType != null) {
            queryMatchExprs.push(literalArr([literal(match.queryId), literal(valueType)]));
          }
        });
        ast.references.forEach(function(ref) {
          var valueType = ((undefined));
          if (!ref.value) {
            valueType = 1;
          } else if (tokenReference(ref.value) === _this.reflector.resolveExternalReference(Identifiers.TemplateRef)) {
            valueType = 2;
          }
          if (valueType != null) {
            _this.refNodeIndices[ref.name] = nodeIndex;
            queryMatchExprs.push(literalArr([literal(ref.name), literal(valueType)]));
          }
        });
        ast.outputs.forEach(function(outputAst) {
          hostEvents.push({
            context: COMP_VAR,
            eventAst: outputAst,
            dirAst: ((null))
          });
        });
        return {
          flags: flags,
          usedEvents: Array.from(usedEvents.values()),
          queryMatchesExpr: queryMatchExprs.length ? literalArr(queryMatchExprs) : NULL_EXPR,
          hostBindings: hostBindings,
          hostEvents: hostEvents
        };
      };
      ViewBuilder.prototype._visitDirective = function(providerAst, dirAst, directiveIndex, elementNodeIndex, refs, queryMatches, usedEvents, queryIds) {
        var _this = this;
        var nodeIndex = this.nodes.length;
        this.nodes.push(((null)));
        dirAst.directive.queries.forEach(function(query, queryIndex) {
          var queryId = dirAst.contentQueryStartId + queryIndex;
          var flags = 67108864 | calcStaticDynamicQueryFlags(queryIds, queryId, query.first);
          var bindingType = query.first ? 0 : 1;
          _this.nodes.push(function() {
            return ({
              sourceSpan: dirAst.sourceSpan,
              nodeFlags: flags,
              nodeDef: importExpr(Identifiers.queryDef).callFn([literal(flags), literal(queryId), new LiteralMapExpr([new LiteralMapEntry(query.propertyName, literal(bindingType), false)])])
            });
          });
        });
        var childCount = this.nodes.length - nodeIndex - 1;
        var _a = this._visitProviderOrDirective(providerAst, queryMatches),
            flags = _a.flags,
            queryMatchExprs = _a.queryMatchExprs,
            providerExpr = _a.providerExpr,
            depsExpr = _a.depsExpr;
        refs.forEach(function(ref) {
          if (ref.value && tokenReference(ref.value) === tokenReference(providerAst.token)) {
            _this.refNodeIndices[ref.name] = nodeIndex;
            queryMatchExprs.push(literalArr([literal(ref.name), literal(4)]));
          }
        });
        if (dirAst.directive.isComponent) {
          flags |= 32768;
        }
        var inputDefs = dirAst.inputs.map(function(inputAst, inputIndex) {
          var mapValue = literalArr([literal(inputIndex), literal(inputAst.directiveName)]);
          return new LiteralMapEntry(inputAst.directiveName, mapValue, false);
        });
        var outputDefs = [];
        var dirMeta = dirAst.directive;
        Object.keys(dirMeta.outputs).forEach(function(propName) {
          var eventName = dirMeta.outputs[propName];
          if (usedEvents.has(eventName)) {
            outputDefs.push(new LiteralMapEntry(propName, literal(eventName), false));
          }
        });
        var updateDirectiveExpressions = [];
        if (dirAst.inputs.length || (flags & (262144 | 65536)) > 0) {
          updateDirectiveExpressions = dirAst.inputs.map(function(input, bindingIndex) {
            return _this._preprocessUpdateExpression({
              nodeIndex: nodeIndex,
              bindingIndex: bindingIndex,
              sourceSpan: input.sourceSpan,
              context: COMP_VAR,
              value: input.value
            });
          });
        }
        var dirContextExpr = importExpr(Identifiers.nodeValue).callFn([VIEW_VAR, literal(nodeIndex)]);
        var hostBindings = dirAst.hostProperties.map(function(inputAst) {
          return ({
            context: dirContextExpr,
            dirAst: dirAst,
            inputAst: inputAst
          });
        });
        var hostEvents = dirAst.hostEvents.map(function(hostEventAst) {
          return ({
            context: dirContextExpr,
            eventAst: hostEventAst,
            dirAst: dirAst
          });
        });
        var checkIndex = nodeIndex;
        this.nodes[nodeIndex] = function() {
          return ({
            sourceSpan: dirAst.sourceSpan,
            nodeFlags: 16384 | flags,
            nodeDef: importExpr(Identifiers.directiveDef).callFn([literal(checkIndex), literal(flags), queryMatchExprs.length ? literalArr(queryMatchExprs) : NULL_EXPR, literal(childCount), providerExpr, depsExpr, inputDefs.length ? new LiteralMapExpr(inputDefs) : NULL_EXPR, outputDefs.length ? new LiteralMapExpr(outputDefs) : NULL_EXPR]),
            updateDirectives: updateDirectiveExpressions,
            directive: dirAst.directive.type
          });
        };
        return {
          hostBindings: hostBindings,
          hostEvents: hostEvents
        };
      };
      ViewBuilder.prototype._visitProvider = function(providerAst, queryMatches) {
        this._addProviderNode(this._visitProviderOrDirective(providerAst, queryMatches));
      };
      ViewBuilder.prototype._visitComponentFactoryResolverProvider = function(directives) {
        var componentDirMeta = directives.find(function(dirAst) {
          return dirAst.directive.isComponent;
        });
        if (componentDirMeta && componentDirMeta.directive.entryComponents.length) {
          var _a = componentFactoryResolverProviderDef(this.reflector, this.outputCtx, 8192, componentDirMeta.directive.entryComponents),
              providerExpr = _a.providerExpr,
              depsExpr = _a.depsExpr,
              flags = _a.flags,
              tokenExpr = _a.tokenExpr;
          this._addProviderNode({
            providerExpr: providerExpr,
            depsExpr: depsExpr,
            flags: flags,
            tokenExpr: tokenExpr,
            queryMatchExprs: [],
            sourceSpan: componentDirMeta.sourceSpan
          });
        }
      };
      ViewBuilder.prototype._addProviderNode = function(data) {
        var nodeIndex = this.nodes.length;
        this.nodes.push(function() {
          return ({
            sourceSpan: data.sourceSpan,
            nodeFlags: data.flags,
            nodeDef: importExpr(Identifiers.providerDef).callFn([literal(data.flags), data.queryMatchExprs.length ? literalArr(data.queryMatchExprs) : NULL_EXPR, data.tokenExpr, data.providerExpr, data.depsExpr])
          });
        });
      };
      ViewBuilder.prototype._visitProviderOrDirective = function(providerAst, queryMatches) {
        var flags = 0;
        var queryMatchExprs = [];
        queryMatches.forEach(function(match) {
          if (tokenReference(match.value) === tokenReference(providerAst.token)) {
            queryMatchExprs.push(literalArr([literal(match.queryId), literal(4)]));
          }
        });
        var _a = providerDef(this.outputCtx, providerAst),
            providerExpr = _a.providerExpr,
            depsExpr = _a.depsExpr,
            providerFlags = _a.flags,
            tokenExpr = _a.tokenExpr;
        return {
          flags: flags | providerFlags,
          queryMatchExprs: queryMatchExprs,
          providerExpr: providerExpr,
          depsExpr: depsExpr,
          tokenExpr: tokenExpr,
          sourceSpan: providerAst.sourceSpan
        };
      };
      ViewBuilder.prototype.getLocal = function(name) {
        if (name == EventHandlerVars.event.name) {
          return EventHandlerVars.event;
        }
        var currViewExpr = VIEW_VAR;
        for (var currBuilder = this; currBuilder; currBuilder = currBuilder.parent, currViewExpr = currViewExpr.prop('parent').cast(DYNAMIC_TYPE)) {
          var refNodeIndex = currBuilder.refNodeIndices[name];
          if (refNodeIndex != null) {
            return importExpr(Identifiers.nodeValue).callFn([currViewExpr, literal(refNodeIndex)]);
          }
          var varAst = currBuilder.variables.find(function(varAst) {
            return varAst.name === name;
          });
          if (varAst) {
            var varValue = varAst.value || IMPLICIT_TEMPLATE_VAR;
            return currViewExpr.prop('context').prop(varValue);
          }
        }
        return null;
      };
      ViewBuilder.prototype._createLiteralArrayConverter = function(sourceSpan, argCount) {
        if (argCount === 0) {
          var valueExpr_1 = importExpr(Identifiers.EMPTY_ARRAY);
          return function() {
            return valueExpr_1;
          };
        }
        var checkIndex = this.nodes.length;
        this.nodes.push(function() {
          return ({
            sourceSpan: sourceSpan,
            nodeFlags: 32,
            nodeDef: importExpr(Identifiers.pureArrayDef).callFn([literal(checkIndex), literal(argCount)])
          });
        });
        return function(args) {
          return callCheckStmt(checkIndex, args);
        };
      };
      ViewBuilder.prototype._createLiteralMapConverter = function(sourceSpan, keys) {
        if (keys.length === 0) {
          var valueExpr_2 = importExpr(Identifiers.EMPTY_MAP);
          return function() {
            return valueExpr_2;
          };
        }
        var map = literalMap(keys.map(function(e, i) {
          return (__assign({}, e, {value: literal(i)}));
        }));
        var checkIndex = this.nodes.length;
        this.nodes.push(function() {
          return ({
            sourceSpan: sourceSpan,
            nodeFlags: 64,
            nodeDef: importExpr(Identifiers.pureObjectDef).callFn([literal(checkIndex), map])
          });
        });
        return function(args) {
          return callCheckStmt(checkIndex, args);
        };
      };
      ViewBuilder.prototype._createPipeConverter = function(expression, name, argCount) {
        var pipe = ((this.usedPipes.find(function(pipeSummary) {
          return pipeSummary.name === name;
        })));
        if (pipe.pure) {
          var checkIndex_1 = this.nodes.length;
          this.nodes.push(function() {
            return ({
              sourceSpan: expression.sourceSpan,
              nodeFlags: 128,
              nodeDef: importExpr(Identifiers.purePipeDef).callFn([literal(checkIndex_1), literal(argCount)])
            });
          });
          var compViewExpr = VIEW_VAR;
          var compBuilder = this;
          while (compBuilder.parent) {
            compBuilder = compBuilder.parent;
            compViewExpr = compViewExpr.prop('parent').cast(DYNAMIC_TYPE);
          }
          var pipeNodeIndex = compBuilder.purePipeNodeIndices[name];
          var pipeValueExpr_1 = importExpr(Identifiers.nodeValue).callFn([compViewExpr, literal(pipeNodeIndex)]);
          return function(args) {
            return callUnwrapValue(expression.nodeIndex, expression.bindingIndex, callCheckStmt(checkIndex_1, [pipeValueExpr_1].concat(args)));
          };
        } else {
          var nodeIndex = this._createPipe(expression.sourceSpan, pipe);
          var nodeValueExpr_1 = importExpr(Identifiers.nodeValue).callFn([VIEW_VAR, literal(nodeIndex)]);
          return function(args) {
            return callUnwrapValue(expression.nodeIndex, expression.bindingIndex, nodeValueExpr_1.callMethod('transform', args));
          };
        }
      };
      ViewBuilder.prototype._createPipe = function(sourceSpan, pipe) {
        var _this = this;
        var nodeIndex = this.nodes.length;
        var flags = 0;
        pipe.type.lifecycleHooks.forEach(function(lifecycleHook) {
          if (lifecycleHook === LifecycleHooks.OnDestroy) {
            flags |= lifecycleHookToNodeFlag(lifecycleHook);
          }
        });
        var depExprs = pipe.type.diDeps.map(function(diDep) {
          return depDef(_this.outputCtx, diDep);
        });
        this.nodes.push(function() {
          return ({
            sourceSpan: sourceSpan,
            nodeFlags: 16,
            nodeDef: importExpr(Identifiers.pipeDef).callFn([literal(flags), _this.outputCtx.importExpr(pipe.type.reference), literalArr(depExprs)])
          });
        });
        return nodeIndex;
      };
      ViewBuilder.prototype._preprocessUpdateExpression = function(expression) {
        var _this = this;
        return {
          nodeIndex: expression.nodeIndex,
          bindingIndex: expression.bindingIndex,
          sourceSpan: expression.sourceSpan,
          context: expression.context,
          value: convertPropertyBindingBuiltins({
            createLiteralArrayConverter: function(argCount) {
              return _this._createLiteralArrayConverter(expression.sourceSpan, argCount);
            },
            createLiteralMapConverter: function(keys) {
              return _this._createLiteralMapConverter(expression.sourceSpan, keys);
            },
            createPipeConverter: function(name, argCount) {
              return _this._createPipeConverter(expression, name, argCount);
            }
          }, expression.value)
        };
      };
      ViewBuilder.prototype._createNodeExpressions = function() {
        var self = this;
        var updateBindingCount = 0;
        var updateRendererStmts = [];
        var updateDirectivesStmts = [];
        var nodeDefExprs = this.nodes.map(function(factory, nodeIndex) {
          var _a = factory(),
              nodeDef = _a.nodeDef,
              nodeFlags = _a.nodeFlags,
              updateDirectives = _a.updateDirectives,
              updateRenderer = _a.updateRenderer,
              sourceSpan = _a.sourceSpan;
          if (updateRenderer) {
            updateRendererStmts.push.apply(updateRendererStmts, createUpdateStatements(nodeIndex, sourceSpan, updateRenderer, false));
          }
          if (updateDirectives) {
            updateDirectivesStmts.push.apply(updateDirectivesStmts, createUpdateStatements(nodeIndex, sourceSpan, updateDirectives, (nodeFlags & (262144 | 65536)) > 0));
          }
          var logWithNodeDef = nodeFlags & 3 ? new CommaExpr([LOG_VAR$1.callFn([]).callFn([]), nodeDef]) : nodeDef;
          return applySourceSpanToExpressionIfNeeded(logWithNodeDef, sourceSpan);
        });
        return {
          updateRendererStmts: updateRendererStmts,
          updateDirectivesStmts: updateDirectivesStmts,
          nodeDefExprs: nodeDefExprs
        };
        function createUpdateStatements(nodeIndex, sourceSpan, expressions, allowEmptyExprs) {
          var updateStmts = [];
          var exprs = expressions.map(function(_a) {
            var sourceSpan = _a.sourceSpan,
                context = _a.context,
                value = _a.value;
            var bindingId = "" + updateBindingCount++;
            var nameResolver = context === COMP_VAR ? self : null;
            var _b = convertPropertyBinding(nameResolver, context, value, bindingId, BindingForm.General),
                stmts = _b.stmts,
                currValExpr = _b.currValExpr;
            updateStmts.push.apply(updateStmts, stmts.map(function(stmt) {
              return applySourceSpanToStatementIfNeeded(stmt, sourceSpan);
            }));
            return applySourceSpanToExpressionIfNeeded(currValExpr, sourceSpan);
          });
          if (expressions.length || allowEmptyExprs) {
            updateStmts.push(applySourceSpanToStatementIfNeeded(callCheckStmt(nodeIndex, exprs).toStmt(), sourceSpan));
          }
          return updateStmts;
        }
      };
      ViewBuilder.prototype._createElementHandleEventFn = function(nodeIndex, handlers) {
        var _this = this;
        var handleEventStmts = [];
        var handleEventBindingCount = 0;
        handlers.forEach(function(_a) {
          var context = _a.context,
              eventAst = _a.eventAst,
              dirAst = _a.dirAst;
          var bindingId = "" + handleEventBindingCount++;
          var nameResolver = context === COMP_VAR ? _this : null;
          var _b = convertActionBinding(nameResolver, context, eventAst.handler, bindingId),
              stmts = _b.stmts,
              allowDefault = _b.allowDefault;
          var trueStmts = stmts;
          if (allowDefault) {
            trueStmts.push(ALLOW_DEFAULT_VAR.set(allowDefault.and(ALLOW_DEFAULT_VAR)).toStmt());
          }
          var _c = elementEventNameAndTarget(eventAst, dirAst),
              eventTarget = _c.target,
              eventName = _c.name;
          var fullEventName = elementEventFullName(eventTarget, eventName);
          handleEventStmts.push(applySourceSpanToStatementIfNeeded(new IfStmt(literal(fullEventName).identical(EVENT_NAME_VAR), trueStmts), eventAst.sourceSpan));
        });
        var handleEventFn;
        if (handleEventStmts.length > 0) {
          var preStmts = [ALLOW_DEFAULT_VAR.set(literal(true)).toDeclStmt(BOOL_TYPE)];
          if (!this.component.isHost && findReadVarNames(handleEventStmts).has(((COMP_VAR.name)))) {
            preStmts.push(COMP_VAR.set(VIEW_VAR.prop('component')).toDeclStmt(this.compType));
          }
          handleEventFn = fn([new FnParam(((VIEW_VAR.name)), INFERRED_TYPE), new FnParam(((EVENT_NAME_VAR.name)), INFERRED_TYPE), new FnParam(((EventHandlerVars.event.name)), INFERRED_TYPE)], preStmts.concat(handleEventStmts, [new ReturnStatement(ALLOW_DEFAULT_VAR)]), INFERRED_TYPE);
        } else {
          handleEventFn = NULL_EXPR;
        }
        return handleEventFn;
      };
      ViewBuilder.prototype.visitDirective = function(ast, context) {};
      ViewBuilder.prototype.visitDirectiveProperty = function(ast, context) {};
      ViewBuilder.prototype.visitReference = function(ast, context) {};
      ViewBuilder.prototype.visitVariable = function(ast, context) {};
      ViewBuilder.prototype.visitEvent = function(ast, context) {};
      ViewBuilder.prototype.visitElementProperty = function(ast, context) {};
      ViewBuilder.prototype.visitAttr = function(ast, context) {};
      return ViewBuilder;
    }());
    function needsAdditionalRootNode(astNodes) {
      var lastAstNode = astNodes[astNodes.length - 1];
      if (lastAstNode instanceof EmbeddedTemplateAst) {
        return lastAstNode.hasViewContainer;
      }
      if (lastAstNode instanceof ElementAst) {
        if (isNgContainer(lastAstNode.name) && lastAstNode.children.length) {
          return needsAdditionalRootNode(lastAstNode.children);
        }
        return lastAstNode.hasViewContainer;
      }
      return lastAstNode instanceof NgContentAst;
    }
    function elementBindingDef(inputAst, dirAst) {
      switch (inputAst.type) {
        case PropertyBindingType.Attribute:
          return literalArr([literal(1), literal(inputAst.name), literal(inputAst.securityContext)]);
        case PropertyBindingType.Property:
          return literalArr([literal(8), literal(inputAst.name), literal(inputAst.securityContext)]);
        case PropertyBindingType.Animation:
          var bindingType = 8 | (dirAst && dirAst.directive.isComponent ? 32 : 16);
          return literalArr([literal(bindingType), literal('@' + inputAst.name), literal(inputAst.securityContext)]);
        case PropertyBindingType.Class:
          return literalArr([literal(2), literal(inputAst.name), NULL_EXPR]);
        case PropertyBindingType.Style:
          return literalArr([literal(4), literal(inputAst.name), literal(inputAst.unit)]);
      }
    }
    function fixedAttrsDef(elementAst) {
      var mapResult = Object.create(null);
      elementAst.attrs.forEach(function(attrAst) {
        mapResult[attrAst.name] = attrAst.value;
      });
      elementAst.directives.forEach(function(dirAst) {
        Object.keys(dirAst.directive.hostAttributes).forEach(function(name) {
          var value = dirAst.directive.hostAttributes[name];
          var prevValue = mapResult[name];
          mapResult[name] = prevValue != null ? mergeAttributeValue(name, prevValue, value) : value;
        });
      });
      return literalArr(Object.keys(mapResult).sort().map(function(attrName) {
        return literalArr([literal(attrName), literal(mapResult[attrName])]);
      }));
    }
    function mergeAttributeValue(attrName, attrValue1, attrValue2) {
      if (attrName == CLASS_ATTR$1 || attrName == STYLE_ATTR) {
        return attrValue1 + " " + attrValue2;
      } else {
        return attrValue2;
      }
    }
    function callCheckStmt(nodeIndex, exprs) {
      if (exprs.length > 10) {
        return CHECK_VAR.callFn([VIEW_VAR, literal(nodeIndex), literal(1), literalArr(exprs)]);
      } else {
        return CHECK_VAR.callFn([VIEW_VAR, literal(nodeIndex), literal(0)].concat(exprs));
      }
    }
    function callUnwrapValue(nodeIndex, bindingIdx, expr) {
      return importExpr(Identifiers.unwrapValue).callFn([VIEW_VAR, literal(nodeIndex), literal(bindingIdx), expr]);
    }
    function findStaticQueryIds(nodes, result) {
      if (result === void 0) {
        result = new Map();
      }
      nodes.forEach(function(node) {
        var staticQueryIds = new Set();
        var dynamicQueryIds = new Set();
        var queryMatches = ((undefined));
        if (node instanceof ElementAst) {
          findStaticQueryIds(node.children, result);
          node.children.forEach(function(child) {
            var childData = ((result.get(child)));
            childData.staticQueryIds.forEach(function(queryId) {
              return staticQueryIds.add(queryId);
            });
            childData.dynamicQueryIds.forEach(function(queryId) {
              return dynamicQueryIds.add(queryId);
            });
          });
          queryMatches = node.queryMatches;
        } else if (node instanceof EmbeddedTemplateAst) {
          findStaticQueryIds(node.children, result);
          node.children.forEach(function(child) {
            var childData = ((result.get(child)));
            childData.staticQueryIds.forEach(function(queryId) {
              return dynamicQueryIds.add(queryId);
            });
            childData.dynamicQueryIds.forEach(function(queryId) {
              return dynamicQueryIds.add(queryId);
            });
          });
          queryMatches = node.queryMatches;
        }
        if (queryMatches) {
          queryMatches.forEach(function(match) {
            return staticQueryIds.add(match.queryId);
          });
        }
        dynamicQueryIds.forEach(function(queryId) {
          return staticQueryIds.delete(queryId);
        });
        result.set(node, {
          staticQueryIds: staticQueryIds,
          dynamicQueryIds: dynamicQueryIds
        });
      });
      return result;
    }
    function staticViewQueryIds(nodeStaticQueryIds) {
      var staticQueryIds = new Set();
      var dynamicQueryIds = new Set();
      Array.from(nodeStaticQueryIds.values()).forEach(function(entry) {
        entry.staticQueryIds.forEach(function(queryId) {
          return staticQueryIds.add(queryId);
        });
        entry.dynamicQueryIds.forEach(function(queryId) {
          return dynamicQueryIds.add(queryId);
        });
      });
      dynamicQueryIds.forEach(function(queryId) {
        return staticQueryIds.delete(queryId);
      });
      return {
        staticQueryIds: staticQueryIds,
        dynamicQueryIds: dynamicQueryIds
      };
    }
    function elementEventNameAndTarget(eventAst, dirAst) {
      if (eventAst.isAnimation) {
        return {
          name: "@" + eventAst.name + "." + eventAst.phase,
          target: dirAst && dirAst.directive.isComponent ? 'component' : null
        };
      } else {
        return eventAst;
      }
    }
    function calcStaticDynamicQueryFlags(queryIds, queryId, isFirst) {
      var flags = 0;
      if (isFirst && (queryIds.staticQueryIds.has(queryId) || !queryIds.dynamicQueryIds.has(queryId))) {
        flags |= 268435456;
      } else {
        flags |= 536870912;
      }
      return flags;
    }
    function elementEventFullName(target, name) {
      return target ? target + ":" + name : name;
    }
    var MessageBundle = (function() {
      function MessageBundle(_htmlParser, _implicitTags, _implicitAttrs, _locale) {
        if (_locale === void 0) {
          _locale = null;
        }
        this._htmlParser = _htmlParser;
        this._implicitTags = _implicitTags;
        this._implicitAttrs = _implicitAttrs;
        this._locale = _locale;
        this._messages = [];
      }
      MessageBundle.prototype.updateFromTemplate = function(html, url, interpolationConfig) {
        var htmlParserResult = this._htmlParser.parse(html, url, true, interpolationConfig);
        if (htmlParserResult.errors.length) {
          return htmlParserResult.errors;
        }
        var i18nParserResult = extractMessages(htmlParserResult.rootNodes, interpolationConfig, this._implicitTags, this._implicitAttrs);
        if (i18nParserResult.errors.length) {
          return i18nParserResult.errors;
        }
        (_a = this._messages).push.apply(_a, i18nParserResult.messages);
        return [];
        var _a;
      };
      MessageBundle.prototype.getMessages = function() {
        return this._messages;
      };
      MessageBundle.prototype.write = function(serializer, filterSources) {
        var messages = {};
        var mapperVisitor = new MapPlaceholderNames();
        this._messages.forEach(function(message) {
          var id = serializer.digest(message);
          if (!messages.hasOwnProperty(id)) {
            messages[id] = message;
          } else {
            (_a = messages[id].sources).push.apply(_a, message.sources);
          }
          var _a;
        });
        var msgList = Object.keys(messages).map(function(id) {
          var mapper = serializer.createNameMapper(messages[id]);
          var src = messages[id];
          var nodes = mapper ? mapperVisitor.convert(src.nodes, mapper) : src.nodes;
          var transformedMessage = new Message(nodes, {}, {}, src.meaning, src.description, id);
          transformedMessage.sources = src.sources;
          if (filterSources) {
            transformedMessage.sources.forEach(function(source) {
              return source.filePath = filterSources(source.filePath);
            });
          }
          return transformedMessage;
        });
        return serializer.write(msgList, this._locale);
      };
      return MessageBundle;
    }());
    var MapPlaceholderNames = (function(_super) {
      __extends(MapPlaceholderNames, _super);
      function MapPlaceholderNames() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      MapPlaceholderNames.prototype.convert = function(nodes, mapper) {
        var _this = this;
        return mapper ? nodes.map(function(n) {
          return n.visit(_this, mapper);
        }) : nodes;
      };
      MapPlaceholderNames.prototype.visitTagPlaceholder = function(ph, mapper) {
        var _this = this;
        var startName = ((mapper.toPublicName(ph.startName)));
        var closeName = ph.closeName ? ((mapper.toPublicName(ph.closeName))) : ph.closeName;
        var children = ph.children.map(function(n) {
          return n.visit(_this, mapper);
        });
        return new TagPlaceholder(ph.tag, ph.attrs, startName, closeName, children, ph.isVoid, ph.sourceSpan);
      };
      MapPlaceholderNames.prototype.visitPlaceholder = function(ph, mapper) {
        return new Placeholder(ph.value, ((mapper.toPublicName(ph.name))), ph.sourceSpan);
      };
      MapPlaceholderNames.prototype.visitIcuPlaceholder = function(ph, mapper) {
        return new IcuPlaceholder(ph.value, ((mapper.toPublicName(ph.name))), ph.sourceSpan);
      };
      return MapPlaceholderNames;
    }(CloneVisitor));
    var GeneratedFile = (function() {
      function GeneratedFile(srcFileUrl, genFileUrl, sourceOrStmts) {
        this.srcFileUrl = srcFileUrl;
        this.genFileUrl = genFileUrl;
        if (typeof sourceOrStmts === 'string') {
          this.source = sourceOrStmts;
          this.stmts = null;
        } else {
          this.source = null;
          this.stmts = sourceOrStmts;
        }
      }
      GeneratedFile.prototype.isEquivalent = function(other) {
        if (this.genFileUrl !== other.genFileUrl) {
          return false;
        }
        if (this.source) {
          return this.source === other.source;
        }
        if (other.stmts == null) {
          return false;
        }
        return areAllEquivalent(((this.stmts)), ((other.stmts)));
      };
      return GeneratedFile;
    }());
    function toTypeScript(file, preamble) {
      if (preamble === void 0) {
        preamble = '';
      }
      if (!file.stmts) {
        throw new Error("Illegal state: No stmts present on GeneratedFile " + file.genFileUrl);
      }
      return new TypeScriptEmitter().emitStatements(file.genFileUrl, file.stmts, preamble);
    }
    function listLazyRoutes(moduleMeta, reflector) {
      var allLazyRoutes = [];
      for (var _i = 0,
          _a = moduleMeta.transitiveModule.providers; _i < _a.length; _i++) {
        var _b = _a[_i],
            provider = _b.provider,
            module = _b.module;
        if (tokenReference(provider.token) === reflector.ROUTES) {
          var loadChildren = _collectLoadChildren(provider.useValue);
          for (var _c = 0,
              loadChildren_1 = loadChildren; _c < loadChildren_1.length; _c++) {
            var route = loadChildren_1[_c];
            allLazyRoutes.push(parseLazyRoute(route, reflector, module.reference));
          }
        }
      }
      return allLazyRoutes;
    }
    function _collectLoadChildren(routes, target) {
      if (target === void 0) {
        target = [];
      }
      if (typeof routes === 'string') {
        target.push(routes);
      } else if (Array.isArray(routes)) {
        for (var _i = 0,
            routes_1 = routes; _i < routes_1.length; _i++) {
          var route = routes_1[_i];
          _collectLoadChildren(route, target);
        }
      } else if (routes.loadChildren) {
        _collectLoadChildren(routes.loadChildren, target);
      } else if (routes.children) {
        _collectLoadChildren(routes.children, target);
      }
      return target;
    }
    function parseLazyRoute(route, reflector, module) {
      var _a = route.split('#'),
          routePath = _a[0],
          routeName = _a[1];
      var referencedModule = reflector.resolveExternalReference({
        moduleName: routePath,
        name: routeName
      }, module ? module.filePath : undefined);
      return {
        route: route,
        module: module || referencedModule,
        referencedModule: referencedModule
      };
    }
    var ResolvedStaticSymbol = (function() {
      function ResolvedStaticSymbol(symbol, metadata) {
        this.symbol = symbol;
        this.metadata = metadata;
      }
      return ResolvedStaticSymbol;
    }());
    var SUPPORTED_SCHEMA_VERSION = 4;
    var StaticSymbolResolver = (function() {
      function StaticSymbolResolver(host, staticSymbolCache, summaryResolver, errorRecorder) {
        this.host = host;
        this.staticSymbolCache = staticSymbolCache;
        this.summaryResolver = summaryResolver;
        this.errorRecorder = errorRecorder;
        this.metadataCache = new Map();
        this.resolvedSymbols = new Map();
        this.resolvedFilePaths = new Set();
        this.importAs = new Map();
        this.symbolResourcePaths = new Map();
        this.symbolFromFile = new Map();
        this.knownFileNameToModuleNames = new Map();
      }
      StaticSymbolResolver.prototype.resolveSymbol = function(staticSymbol) {
        if (staticSymbol.members.length > 0) {
          return ((this._resolveSymbolMembers(staticSymbol)));
        }
        var resultFromSummary = ((this._resolveSymbolFromSummary(staticSymbol)));
        if (resultFromSummary) {
          return resultFromSummary;
        }
        var resultFromCache = this.resolvedSymbols.get(staticSymbol);
        if (resultFromCache) {
          return resultFromCache;
        }
        this._createSymbolsOf(staticSymbol.filePath);
        return ((this.resolvedSymbols.get(staticSymbol)));
      };
      StaticSymbolResolver.prototype.getImportAs = function(staticSymbol, useSummaries) {
        if (useSummaries === void 0) {
          useSummaries = true;
        }
        if (staticSymbol.members.length) {
          var baseSymbol = this.getStaticSymbol(staticSymbol.filePath, staticSymbol.name);
          var baseImportAs = this.getImportAs(baseSymbol, useSummaries);
          return baseImportAs ? this.getStaticSymbol(baseImportAs.filePath, baseImportAs.name, staticSymbol.members) : null;
        }
        var summarizedFileName = stripSummaryForJitFileSuffix(staticSymbol.filePath);
        if (summarizedFileName !== staticSymbol.filePath) {
          var summarizedName = stripSummaryForJitNameSuffix(staticSymbol.name);
          var baseSymbol = this.getStaticSymbol(summarizedFileName, summarizedName, staticSymbol.members);
          var baseImportAs = this.getImportAs(baseSymbol, useSummaries);
          return baseImportAs ? this.getStaticSymbol(summaryForJitFileName(baseImportAs.filePath), summaryForJitName(baseImportAs.name), baseSymbol.members) : null;
        }
        var result = (useSummaries && this.summaryResolver.getImportAs(staticSymbol)) || null;
        if (!result) {
          result = ((this.importAs.get(staticSymbol)));
        }
        return result;
      };
      StaticSymbolResolver.prototype.getResourcePath = function(staticSymbol) {
        return this.symbolResourcePaths.get(staticSymbol) || staticSymbol.filePath;
      };
      StaticSymbolResolver.prototype.getTypeArity = function(staticSymbol) {
        if (isGeneratedFile(staticSymbol.filePath)) {
          return null;
        }
        var resolvedSymbol = unwrapResolvedMetadata(this.resolveSymbol(staticSymbol));
        while (resolvedSymbol && resolvedSymbol.metadata instanceof StaticSymbol) {
          resolvedSymbol = unwrapResolvedMetadata(this.resolveSymbol(resolvedSymbol.metadata));
        }
        return (resolvedSymbol && resolvedSymbol.metadata && resolvedSymbol.metadata.arity) || null;
      };
      StaticSymbolResolver.prototype.getKnownModuleName = function(filePath) {
        return this.knownFileNameToModuleNames.get(filePath) || null;
      };
      StaticSymbolResolver.prototype.recordImportAs = function(sourceSymbol, targetSymbol) {
        sourceSymbol.assertNoMembers();
        targetSymbol.assertNoMembers();
        this.importAs.set(sourceSymbol, targetSymbol);
      };
      StaticSymbolResolver.prototype.recordModuleNameForFileName = function(fileName, moduleName) {
        this.knownFileNameToModuleNames.set(fileName, moduleName);
      };
      StaticSymbolResolver.prototype.invalidateFile = function(fileName) {
        this.metadataCache.delete(fileName);
        this.resolvedFilePaths.delete(fileName);
        var symbols = this.symbolFromFile.get(fileName);
        if (symbols) {
          this.symbolFromFile.delete(fileName);
          for (var _i = 0,
              symbols_1 = symbols; _i < symbols_1.length; _i++) {
            var symbol = symbols_1[_i];
            this.resolvedSymbols.delete(symbol);
            this.importAs.delete(symbol);
            this.symbolResourcePaths.delete(symbol);
          }
        }
      };
      StaticSymbolResolver.prototype.ignoreErrorsFor = function(cb) {
        var recorder = this.errorRecorder;
        this.errorRecorder = function() {};
        try {
          return cb();
        } finally {
          this.errorRecorder = recorder;
        }
      };
      StaticSymbolResolver.prototype._resolveSymbolMembers = function(staticSymbol) {
        var members = staticSymbol.members;
        var baseResolvedSymbol = this.resolveSymbol(this.getStaticSymbol(staticSymbol.filePath, staticSymbol.name));
        if (!baseResolvedSymbol) {
          return null;
        }
        var baseMetadata = unwrapResolvedMetadata(baseResolvedSymbol.metadata);
        if (baseMetadata instanceof StaticSymbol) {
          return new ResolvedStaticSymbol(staticSymbol, this.getStaticSymbol(baseMetadata.filePath, baseMetadata.name, members));
        } else if (baseMetadata && baseMetadata.__symbolic === 'class') {
          if (baseMetadata.statics && members.length === 1) {
            return new ResolvedStaticSymbol(staticSymbol, baseMetadata.statics[members[0]]);
          }
        } else {
          var value = baseMetadata;
          for (var i = 0; i < members.length && value; i++) {
            value = value[members[i]];
          }
          return new ResolvedStaticSymbol(staticSymbol, value);
        }
        return null;
      };
      StaticSymbolResolver.prototype._resolveSymbolFromSummary = function(staticSymbol) {
        var summary = this.summaryResolver.resolveSummary(staticSymbol);
        return summary ? new ResolvedStaticSymbol(staticSymbol, summary.metadata) : null;
      };
      StaticSymbolResolver.prototype.getStaticSymbol = function(declarationFile, name, members) {
        return this.staticSymbolCache.get(declarationFile, name, members);
      };
      StaticSymbolResolver.prototype.hasDecorators = function(filePath) {
        var metadata = this.getModuleMetadata(filePath);
        if (metadata['metadata']) {
          return Object.keys(metadata['metadata']).some(function(metadataKey) {
            var entry = metadata['metadata'][metadataKey];
            return entry && entry.__symbolic === 'class' && entry.decorators;
          });
        }
        return false;
      };
      StaticSymbolResolver.prototype.getSymbolsOf = function(filePath) {
        var summarySymbols = this.summaryResolver.getSymbolsOf(filePath);
        if (summarySymbols) {
          return summarySymbols;
        }
        this._createSymbolsOf(filePath);
        var metadataSymbols = [];
        this.resolvedSymbols.forEach(function(resolvedSymbol) {
          if (resolvedSymbol.symbol.filePath === filePath) {
            metadataSymbols.push(resolvedSymbol.symbol);
          }
        });
        return metadataSymbols;
      };
      StaticSymbolResolver.prototype._createSymbolsOf = function(filePath) {
        var _this = this;
        if (this.resolvedFilePaths.has(filePath)) {
          return;
        }
        this.resolvedFilePaths.add(filePath);
        var resolvedSymbols = [];
        var metadata = this.getModuleMetadata(filePath);
        if (metadata['importAs']) {
          this.knownFileNameToModuleNames.set(filePath, metadata['importAs']);
        }
        if (metadata['exports']) {
          var _loop_1 = function(moduleExport) {
            if (moduleExport.export) {
              moduleExport.export.forEach(function(exportSymbol) {
                var symbolName;
                if (typeof exportSymbol === 'string') {
                  symbolName = exportSymbol;
                } else {
                  symbolName = exportSymbol.as;
                }
                symbolName = unescapeIdentifier(symbolName);
                var symName = symbolName;
                if (typeof exportSymbol !== 'string') {
                  symName = unescapeIdentifier(exportSymbol.name);
                }
                var resolvedModule = _this.resolveModule(moduleExport.from, filePath);
                if (resolvedModule) {
                  var targetSymbol = _this.getStaticSymbol(resolvedModule, symName);
                  var sourceSymbol = _this.getStaticSymbol(filePath, symbolName);
                  resolvedSymbols.push(_this.createExport(sourceSymbol, targetSymbol));
                }
              });
            } else {
              var resolvedModule = this_1.resolveModule(moduleExport.from, filePath);
              if (resolvedModule) {
                var nestedExports = this_1.getSymbolsOf(resolvedModule);
                nestedExports.forEach(function(targetSymbol) {
                  var sourceSymbol = _this.getStaticSymbol(filePath, targetSymbol.name);
                  resolvedSymbols.push(_this.createExport(sourceSymbol, targetSymbol));
                });
              }
            }
          };
          var this_1 = this;
          for (var _i = 0,
              _a = metadata['exports']; _i < _a.length; _i++) {
            var moduleExport = _a[_i];
            _loop_1(moduleExport);
          }
        }
        if (metadata['metadata']) {
          var topLevelSymbolNames_1 = new Set(Object.keys(metadata['metadata']).map(unescapeIdentifier));
          var origins_1 = metadata['origins'] || {};
          Object.keys(metadata['metadata']).forEach(function(metadataKey) {
            var symbolMeta = metadata['metadata'][metadataKey];
            var name = unescapeIdentifier(metadataKey);
            var symbol = _this.getStaticSymbol(filePath, name);
            var origin = origins_1.hasOwnProperty(metadataKey) && origins_1[metadataKey];
            if (origin) {
              var originFilePath = _this.resolveModule(origin, filePath);
              if (!originFilePath) {
                _this.reportError(new Error("Couldn't resolve original symbol for " + origin + " from " + filePath));
              } else {
                _this.symbolResourcePaths.set(symbol, originFilePath);
              }
            }
            resolvedSymbols.push(_this.createResolvedSymbol(symbol, filePath, topLevelSymbolNames_1, symbolMeta));
          });
        }
        resolvedSymbols.forEach(function(resolvedSymbol) {
          return _this.resolvedSymbols.set(resolvedSymbol.symbol, resolvedSymbol);
        });
        this.symbolFromFile.set(filePath, resolvedSymbols.map(function(resolvedSymbol) {
          return resolvedSymbol.symbol;
        }));
      };
      StaticSymbolResolver.prototype.createResolvedSymbol = function(sourceSymbol, topLevelPath, topLevelSymbolNames, metadata) {
        var _this = this;
        if (this.summaryResolver.isLibraryFile(sourceSymbol.filePath) && metadata && metadata['__symbolic'] === 'class') {
          var transformedMeta_1 = {
            __symbolic: 'class',
            arity: metadata.arity
          };
          return new ResolvedStaticSymbol(sourceSymbol, transformedMeta_1);
        }
        var _originalFileMemo;
        var getOriginalName = function() {
          if (!_originalFileMemo) {
            _originalFileMemo = _this.host.getOutputName(topLevelPath.replace(/((\.ts)|(\.d\.ts)|)$/, '.ts').replace(/^.*node_modules[/\\]/, ''));
          }
          return _originalFileMemo;
        };
        var self = this;
        var ReferenceTransformer = (function(_super) {
          __extends(ReferenceTransformer, _super);
          function ReferenceTransformer() {
            return _super !== null && _super.apply(this, arguments) || this;
          }
          ReferenceTransformer.prototype.visitStringMap = function(map, functionParams) {
            var symbolic = map['__symbolic'];
            if (symbolic === 'function') {
              var oldLen = functionParams.length;
              functionParams.push.apply(functionParams, (map['parameters'] || []));
              var result = _super.prototype.visitStringMap.call(this, map, functionParams);
              functionParams.length = oldLen;
              return result;
            } else if (symbolic === 'reference') {
              var module = map['module'];
              var name_1 = map['name'] ? unescapeIdentifier(map['name']) : map['name'];
              if (!name_1) {
                return null;
              }
              var filePath = void 0;
              if (module) {
                filePath = ((self.resolveModule(module, sourceSymbol.filePath)));
                if (!filePath) {
                  return {
                    __symbolic: 'error',
                    message: "Could not resolve " + module + " relative to " + sourceSymbol.filePath + ".",
                    line: map["line"],
                    character: map["character"],
                    fileName: getOriginalName()
                  };
                }
                return {
                  __symbolic: 'resolved',
                  symbol: self.getStaticSymbol(filePath, name_1),
                  line: map["line"],
                  character: map["character"],
                  fileName: getOriginalName()
                };
              } else if (functionParams.indexOf(name_1) >= 0) {
                return {
                  __symbolic: 'reference',
                  name: name_1
                };
              } else {
                if (topLevelSymbolNames.has(name_1)) {
                  return self.getStaticSymbol(topLevelPath, name_1);
                }
                null;
              }
            } else if (symbolic === 'error') {
              return __assign({}, map, {fileName: getOriginalName()});
            } else {
              return _super.prototype.visitStringMap.call(this, map, functionParams);
            }
          };
          return ReferenceTransformer;
        }(ValueTransformer));
        var transformedMeta = visitValue(metadata, new ReferenceTransformer(), []);
        var unwrappedTransformedMeta = unwrapResolvedMetadata(transformedMeta);
        if (unwrappedTransformedMeta instanceof StaticSymbol) {
          return this.createExport(sourceSymbol, unwrappedTransformedMeta);
        }
        return new ResolvedStaticSymbol(sourceSymbol, transformedMeta);
      };
      StaticSymbolResolver.prototype.createExport = function(sourceSymbol, targetSymbol) {
        sourceSymbol.assertNoMembers();
        targetSymbol.assertNoMembers();
        if (this.summaryResolver.isLibraryFile(sourceSymbol.filePath) && this.summaryResolver.isLibraryFile(targetSymbol.filePath)) {
          this.importAs.set(targetSymbol, this.getImportAs(sourceSymbol) || sourceSymbol);
        }
        return new ResolvedStaticSymbol(sourceSymbol, targetSymbol);
      };
      StaticSymbolResolver.prototype.reportError = function(error, context, path) {
        if (this.errorRecorder) {
          this.errorRecorder(error, (context && context.filePath) || path);
        } else {
          throw error;
        }
      };
      StaticSymbolResolver.prototype.getModuleMetadata = function(module) {
        var moduleMetadata = this.metadataCache.get(module);
        if (!moduleMetadata) {
          var moduleMetadatas = this.host.getMetadataFor(module);
          if (moduleMetadatas) {
            var maxVersion_1 = -1;
            moduleMetadatas.forEach(function(md) {
              if (md && md['version'] > maxVersion_1) {
                maxVersion_1 = md['version'];
                moduleMetadata = md;
              }
            });
          }
          if (!moduleMetadata) {
            moduleMetadata = {
              __symbolic: 'module',
              version: SUPPORTED_SCHEMA_VERSION,
              module: module,
              metadata: {}
            };
          }
          if (moduleMetadata['version'] != SUPPORTED_SCHEMA_VERSION) {
            var errorMessage = moduleMetadata['version'] == 2 ? "Unsupported metadata version " + moduleMetadata['version'] + " for module " + module + ". This module should be compiled with a newer version of ngc" : "Metadata version mismatch for module " + module + ", found version " + moduleMetadata['version'] + ", expected " + SUPPORTED_SCHEMA_VERSION;
            this.reportError(new Error(errorMessage));
          }
          this.metadataCache.set(module, moduleMetadata);
        }
        return moduleMetadata;
      };
      StaticSymbolResolver.prototype.getSymbolByModule = function(module, symbolName, containingFile) {
        var filePath = this.resolveModule(module, containingFile);
        if (!filePath) {
          this.reportError(new Error("Could not resolve module " + module + (containingFile ? ' relative to ' + containingFile : '')));
          return this.getStaticSymbol("ERROR:" + module, symbolName);
        }
        return this.getStaticSymbol(filePath, symbolName);
      };
      StaticSymbolResolver.prototype.resolveModule = function(module, containingFile) {
        try {
          return this.host.moduleNameToFileName(module, containingFile);
        } catch (e) {
          console.error("Could not resolve module '" + module + "' relative to file " + containingFile);
          this.reportError(e, undefined, containingFile);
        }
        return null;
      };
      return StaticSymbolResolver;
    }());
    function unescapeIdentifier(identifier) {
      return identifier.startsWith('___') ? identifier.substr(1) : identifier;
    }
    function unwrapResolvedMetadata(metadata) {
      if (metadata && metadata.__symbolic === 'resolved') {
        return metadata.symbol;
      }
      return metadata;
    }
    function serializeSummaries(srcFileName, forJitCtx, summaryResolver, symbolResolver, symbols, types) {
      var toJsonSerializer = new ToJsonSerializer(symbolResolver, summaryResolver, srcFileName);
      symbols.forEach(function(resolvedSymbol) {
        return toJsonSerializer.addSummary({
          symbol: resolvedSymbol.symbol,
          metadata: resolvedSymbol.metadata
        });
      });
      types.forEach(function(_a) {
        var summary = _a.summary,
            metadata = _a.metadata;
        toJsonSerializer.addSummary({
          symbol: summary.type.reference,
          metadata: undefined,
          type: summary
        });
      });
      var _a = toJsonSerializer.serialize(),
          json = _a.json,
          exportAs = _a.exportAs;
      if (forJitCtx) {
        var forJitSerializer_1 = new ForJitSerializer(forJitCtx, symbolResolver, summaryResolver);
        types.forEach(function(_a) {
          var summary = _a.summary,
              metadata = _a.metadata;
          forJitSerializer_1.addSourceType(summary, metadata);
        });
        toJsonSerializer.unprocessedSymbolSummariesBySymbol.forEach(function(summary) {
          if (summaryResolver.isLibraryFile(summary.symbol.filePath) && summary.type) {
            forJitSerializer_1.addLibType(summary.type);
          }
        });
        forJitSerializer_1.serialize(exportAs);
      }
      return {
        json: json,
        exportAs: exportAs
      };
    }
    function deserializeSummaries(symbolCache, summaryResolver, libraryFileName, json) {
      var deserializer = new FromJsonDeserializer(symbolCache, summaryResolver);
      return deserializer.deserialize(libraryFileName, json);
    }
    function createForJitStub(outputCtx, reference) {
      return createSummaryForJitFunction(outputCtx, reference, NULL_EXPR);
    }
    function createSummaryForJitFunction(outputCtx, reference, value) {
      var fnName = summaryForJitName(reference.name);
      outputCtx.statements.push(fn([], [new ReturnStatement(value)], new ArrayType(DYNAMIC_TYPE)).toDeclStmt(fnName, [StmtModifier.Final, StmtModifier.Exported]));
    }
    var ToJsonSerializer = (function(_super) {
      __extends(ToJsonSerializer, _super);
      function ToJsonSerializer(symbolResolver, summaryResolver, srcFileName) {
        var _this = _super.call(this) || this;
        _this.symbolResolver = symbolResolver;
        _this.summaryResolver = summaryResolver;
        _this.srcFileName = srcFileName;
        _this.symbols = [];
        _this.indexBySymbol = new Map();
        _this.reexportedBy = new Map();
        _this.processedSummaryBySymbol = new Map();
        _this.processedSummaries = [];
        _this.unprocessedSymbolSummariesBySymbol = new Map();
        _this.moduleName = symbolResolver.getKnownModuleName(srcFileName);
        return _this;
      }
      ToJsonSerializer.prototype.addSummary = function(summary) {
        var _this = this;
        var unprocessedSummary = this.unprocessedSymbolSummariesBySymbol.get(summary.symbol);
        var processedSummary = this.processedSummaryBySymbol.get(summary.symbol);
        if (!unprocessedSummary) {
          unprocessedSummary = {
            symbol: summary.symbol,
            metadata: undefined
          };
          this.unprocessedSymbolSummariesBySymbol.set(summary.symbol, unprocessedSummary);
          processedSummary = {symbol: this.processValue(summary.symbol, 0)};
          this.processedSummaries.push(processedSummary);
          this.processedSummaryBySymbol.set(summary.symbol, processedSummary);
        }
        if (!unprocessedSummary.metadata && summary.metadata) {
          var metadata_1 = summary.metadata || {};
          if (metadata_1.__symbolic === 'class') {
            var clone_1 = {};
            Object.keys(metadata_1).forEach(function(propName) {
              if (propName !== 'decorators') {
                clone_1[propName] = metadata_1[propName];
              }
            });
            metadata_1 = clone_1;
          } else if (isCall(metadata_1)) {
            if (!isFunctionCall(metadata_1) && !isMethodCallOnVariable(metadata_1)) {
              metadata_1 = {
                __symbolic: 'error',
                message: 'Complex function calls are not supported.'
              };
            }
          }
          unprocessedSummary.metadata = metadata_1;
          processedSummary.metadata = this.processValue(metadata_1, 1);
          if (metadata_1 instanceof StaticSymbol && this.summaryResolver.isLibraryFile(metadata_1.filePath)) {
            var declarationSymbol = this.symbols[((this.indexBySymbol.get(metadata_1)))];
            if (!isLoweredSymbol(declarationSymbol.name)) {
              this.reexportedBy.set(declarationSymbol, summary.symbol);
            }
          }
        }
        if (!unprocessedSummary.type && summary.type) {
          unprocessedSummary.type = summary.type;
          processedSummary.type = this.processValue(summary.type, 0);
          if (summary.type.summaryKind === CompileSummaryKind.NgModule) {
            var ngModuleSummary = (summary.type);
            ngModuleSummary.exportedDirectives.concat(ngModuleSummary.exportedPipes).forEach(function(id) {
              var symbol = id.reference;
              if (_this.summaryResolver.isLibraryFile(symbol.filePath) && !_this.unprocessedSymbolSummariesBySymbol.has(symbol)) {
                var summary_1 = _this.summaryResolver.resolveSummary(symbol);
                if (summary_1) {
                  _this.addSummary(summary_1);
                }
              }
            });
          }
        }
      };
      ToJsonSerializer.prototype.serialize = function() {
        var _this = this;
        var exportAs = [];
        var json = JSON.stringify({
          moduleName: this.moduleName,
          summaries: this.processedSummaries,
          symbols: this.symbols.map(function(symbol, index) {
            symbol.assertNoMembers();
            var importAs = ((undefined));
            if (_this.summaryResolver.isLibraryFile(symbol.filePath)) {
              var reexportSymbol = _this.reexportedBy.get(symbol);
              if (reexportSymbol) {
                importAs = ((_this.indexBySymbol.get(reexportSymbol)));
              } else {
                var summary = _this.unprocessedSymbolSummariesBySymbol.get(symbol);
                if (!summary || !summary.metadata || summary.metadata.__symbolic !== 'interface') {
                  importAs = symbol.name + "_" + index;
                  exportAs.push({
                    symbol: symbol,
                    exportAs: importAs
                  });
                }
              }
            }
            return {
              __symbol: index,
              name: symbol.name,
              filePath: _this.summaryResolver.toSummaryFileName(symbol.filePath, _this.srcFileName),
              importAs: importAs
            };
          })
        });
        return {
          json: json,
          exportAs: exportAs
        };
      };
      ToJsonSerializer.prototype.processValue = function(value, flags) {
        return visitValue(value, this, flags);
      };
      ToJsonSerializer.prototype.visitOther = function(value, context) {
        if (value instanceof StaticSymbol) {
          var baseSymbol = this.symbolResolver.getStaticSymbol(value.filePath, value.name);
          var index = this.visitStaticSymbol(baseSymbol, context);
          return {
            __symbol: index,
            members: value.members
          };
        }
      };
      ToJsonSerializer.prototype.visitStaticSymbol = function(baseSymbol, flags) {
        var index = this.indexBySymbol.get(baseSymbol);
        var summary = null;
        if (flags & 1 && this.summaryResolver.isLibraryFile(baseSymbol.filePath)) {
          if (this.unprocessedSymbolSummariesBySymbol.has(baseSymbol)) {
            return ((index));
          }
          summary = this.loadSummary(baseSymbol);
          if (summary && summary.metadata instanceof StaticSymbol) {
            index = this.visitStaticSymbol(summary.metadata, flags);
            summary = null;
          }
        } else if (index != null) {
          return index;
        }
        if (index == null) {
          index = this.symbols.length;
          this.symbols.push(baseSymbol);
        }
        this.indexBySymbol.set(baseSymbol, index);
        if (summary) {
          this.addSummary(summary);
        }
        return index;
      };
      ToJsonSerializer.prototype.loadSummary = function(symbol) {
        var summary = this.summaryResolver.resolveSummary(symbol);
        if (!summary) {
          var resolvedSymbol = this.symbolResolver.resolveSymbol(symbol);
          if (resolvedSymbol) {
            summary = {
              symbol: resolvedSymbol.symbol,
              metadata: resolvedSymbol.metadata
            };
          }
        }
        return summary;
      };
      return ToJsonSerializer;
    }(ValueTransformer));
    var ForJitSerializer = (function() {
      function ForJitSerializer(outputCtx, symbolResolver, summaryResolver) {
        this.outputCtx = outputCtx;
        this.symbolResolver = symbolResolver;
        this.summaryResolver = summaryResolver;
        this.data = [];
      }
      ForJitSerializer.prototype.addSourceType = function(summary, metadata) {
        this.data.push({
          summary: summary,
          metadata: metadata,
          isLibrary: false
        });
      };
      ForJitSerializer.prototype.addLibType = function(summary) {
        this.data.push({
          summary: summary,
          metadata: null,
          isLibrary: true
        });
      };
      ForJitSerializer.prototype.serialize = function(exportAsArr) {
        var _this = this;
        var exportAsBySymbol = new Map();
        for (var _i = 0,
            exportAsArr_1 = exportAsArr; _i < exportAsArr_1.length; _i++) {
          var _a = exportAsArr_1[_i],
              symbol = _a.symbol,
              exportAs = _a.exportAs;
          exportAsBySymbol.set(symbol, exportAs);
        }
        var ngModuleSymbols = new Set();
        for (var _b = 0,
            _c = this.data; _b < _c.length; _b++) {
          var _d = _c[_b],
              summary = _d.summary,
              metadata = _d.metadata,
              isLibrary = _d.isLibrary;
          if (summary.summaryKind === CompileSummaryKind.NgModule) {
            ngModuleSymbols.add(summary.type.reference);
            var modSummary = (summary);
            for (var _e = 0,
                _f = modSummary.modules; _e < _f.length; _e++) {
              var mod = _f[_e];
              ngModuleSymbols.add(mod.reference);
            }
          }
          if (!isLibrary) {
            var fnName = summaryForJitName(summary.type.reference.name);
            createSummaryForJitFunction(this.outputCtx, summary.type.reference, this.serializeSummaryWithDeps(summary, ((metadata))));
          }
        }
        ngModuleSymbols.forEach(function(ngModuleSymbol) {
          if (_this.summaryResolver.isLibraryFile(ngModuleSymbol.filePath)) {
            var exportAs = exportAsBySymbol.get(ngModuleSymbol) || ngModuleSymbol.name;
            var jitExportAsName = summaryForJitName(exportAs);
            _this.outputCtx.statements.push(variable(jitExportAsName).set(_this.serializeSummaryRef(ngModuleSymbol)).toDeclStmt(null, [StmtModifier.Exported]));
          }
        });
      };
      ForJitSerializer.prototype.serializeSummaryWithDeps = function(summary, metadata) {
        var _this = this;
        var expressions = [this.serializeSummary(summary)];
        var providers = [];
        if (metadata instanceof CompileNgModuleMetadata) {
          expressions.push.apply(expressions, metadata.declaredDirectives.concat(metadata.declaredPipes).map(function(type) {
            return type.reference;
          }).concat(metadata.transitiveModule.modules.map(function(type) {
            return type.reference;
          }).filter(function(ref) {
            return ref !== metadata.type.reference;
          })).map(function(ref) {
            return _this.serializeSummaryRef(ref);
          }));
          providers = metadata.providers;
        } else if (summary.summaryKind === CompileSummaryKind.Directive) {
          var dirSummary = (summary);
          providers = dirSummary.providers.concat(dirSummary.viewProviders);
        }
        expressions.push.apply(expressions, providers.filter(function(provider) {
          return !!provider.useClass;
        }).map(function(provider) {
          return _this.serializeSummary(({
            summaryKind: CompileSummaryKind.Injectable,
            type: provider.useClass
          }));
        }));
        return literalArr(expressions);
      };
      ForJitSerializer.prototype.serializeSummaryRef = function(typeSymbol) {
        var jitImportedSymbol = this.symbolResolver.getStaticSymbol(summaryForJitFileName(typeSymbol.filePath), summaryForJitName(typeSymbol.name));
        return this.outputCtx.importExpr(jitImportedSymbol);
      };
      ForJitSerializer.prototype.serializeSummary = function(data) {
        var outputCtx = this.outputCtx;
        var Transformer = (function() {
          function Transformer() {}
          Transformer.prototype.visitArray = function(arr, context) {
            var _this = this;
            return literalArr(arr.map(function(entry) {
              return visitValue(entry, _this, context);
            }));
          };
          Transformer.prototype.visitStringMap = function(map, context) {
            var _this = this;
            return new LiteralMapExpr(Object.keys(map).map(function(key) {
              return new LiteralMapEntry(key, visitValue(map[key], _this, context), false);
            }));
          };
          Transformer.prototype.visitPrimitive = function(value, context) {
            return literal(value);
          };
          Transformer.prototype.visitOther = function(value, context) {
            if (value instanceof StaticSymbol) {
              return outputCtx.importExpr(value);
            } else {
              throw new Error("Illegal State: Encountered value " + value);
            }
          };
          return Transformer;
        }());
        return visitValue(data, new Transformer(), null);
      };
      return ForJitSerializer;
    }());
    var FromJsonDeserializer = (function(_super) {
      __extends(FromJsonDeserializer, _super);
      function FromJsonDeserializer(symbolCache, summaryResolver) {
        var _this = _super.call(this) || this;
        _this.symbolCache = symbolCache;
        _this.summaryResolver = summaryResolver;
        return _this;
      }
      FromJsonDeserializer.prototype.deserialize = function(libraryFileName, json) {
        var _this = this;
        var data = JSON.parse(json);
        var allImportAs = [];
        this.symbols = data.symbols.map(function(serializedSymbol) {
          return _this.symbolCache.get(_this.summaryResolver.fromSummaryFileName(serializedSymbol.filePath, libraryFileName), serializedSymbol.name);
        });
        data.symbols.forEach(function(serializedSymbol, index) {
          var symbol = _this.symbols[index];
          var importAs = serializedSymbol.importAs;
          if (typeof importAs === 'number') {
            allImportAs.push({
              symbol: symbol,
              importAs: _this.symbols[importAs]
            });
          } else if (typeof importAs === 'string') {
            allImportAs.push({
              symbol: symbol,
              importAs: _this.symbolCache.get(ngfactoryFilePath(libraryFileName), importAs)
            });
          }
        });
        var summaries = (visitValue(data.summaries, this, null));
        return {
          moduleName: data.moduleName,
          summaries: summaries,
          importAs: allImportAs
        };
      };
      FromJsonDeserializer.prototype.visitStringMap = function(map, context) {
        if ('__symbol' in map) {
          var baseSymbol = this.symbols[map['__symbol']];
          var members = map['members'];
          return members.length ? this.symbolCache.get(baseSymbol.filePath, baseSymbol.name, members) : baseSymbol;
        } else {
          return _super.prototype.visitStringMap.call(this, map, context);
        }
      };
      return FromJsonDeserializer;
    }(ValueTransformer));
    function isCall(metadata) {
      return metadata && metadata.__symbolic === 'call';
    }
    function isFunctionCall(metadata) {
      return isCall(metadata) && unwrapResolvedMetadata(metadata.expression) instanceof StaticSymbol;
    }
    function isMethodCallOnVariable(metadata) {
      return isCall(metadata) && metadata.expression && metadata.expression.__symbolic === 'select' && unwrapResolvedMetadata(metadata.expression.expression) instanceof StaticSymbol;
    }
    var StubEmitFlags = {
      Basic: 1,
      TypeCheck: 2,
      All: 3
    };
    StubEmitFlags[StubEmitFlags.Basic] = "Basic";
    StubEmitFlags[StubEmitFlags.TypeCheck] = "TypeCheck";
    StubEmitFlags[StubEmitFlags.All] = "All";
    var AotCompiler = (function() {
      function AotCompiler(_config, _options, _host, _reflector, _metadataResolver, _templateParser, _styleCompiler, _viewCompiler, _typeCheckCompiler, _ngModuleCompiler, _outputEmitter, _summaryResolver, _symbolResolver) {
        this._config = _config;
        this._options = _options;
        this._host = _host;
        this._reflector = _reflector;
        this._metadataResolver = _metadataResolver;
        this._templateParser = _templateParser;
        this._styleCompiler = _styleCompiler;
        this._viewCompiler = _viewCompiler;
        this._typeCheckCompiler = _typeCheckCompiler;
        this._ngModuleCompiler = _ngModuleCompiler;
        this._outputEmitter = _outputEmitter;
        this._summaryResolver = _summaryResolver;
        this._symbolResolver = _symbolResolver;
        this._templateAstCache = new Map();
        this._analyzedFiles = new Map();
      }
      AotCompiler.prototype.clearCache = function() {
        this._metadataResolver.clearCache();
      };
      AotCompiler.prototype.analyzeModulesSync = function(rootFiles) {
        var _this = this;
        var analyzeResult = analyzeAndValidateNgModules(rootFiles, this._host, this._symbolResolver, this._metadataResolver);
        analyzeResult.ngModules.forEach(function(ngModule) {
          return _this._metadataResolver.loadNgModuleDirectiveAndPipeMetadata(ngModule.type.reference, true);
        });
        return analyzeResult;
      };
      AotCompiler.prototype.analyzeModulesAsync = function(rootFiles) {
        var _this = this;
        var analyzeResult = analyzeAndValidateNgModules(rootFiles, this._host, this._symbolResolver, this._metadataResolver);
        return Promise.all(analyzeResult.ngModules.map(function(ngModule) {
          return _this._metadataResolver.loadNgModuleDirectiveAndPipeMetadata(ngModule.type.reference, false);
        })).then(function() {
          return analyzeResult;
        });
      };
      AotCompiler.prototype._analyzeFile = function(fileName) {
        var analyzedFile = this._analyzedFiles.get(fileName);
        if (!analyzedFile) {
          analyzedFile = analyzeFile(this._host, this._symbolResolver, this._metadataResolver, fileName);
          this._analyzedFiles.set(fileName, analyzedFile);
        }
        return analyzedFile;
      };
      AotCompiler.prototype.findGeneratedFileNames = function(fileName) {
        var _this = this;
        var genFileNames = [];
        var file = this._analyzeFile(fileName);
        if (this._options.allowEmptyCodegenFiles || file.directives.length || file.pipes.length || file.injectables.length || file.ngModules.length || file.exportsNonSourceFiles) {
          genFileNames.push(ngfactoryFilePath(file.fileName, true));
          if (this._options.enableSummariesForJit) {
            genFileNames.push(summaryForJitFileName(file.fileName, true));
          }
        }
        var fileSuffix = normalizeGenFileSuffix(splitTypescriptSuffix(file.fileName, true)[1]);
        file.directives.forEach(function(dirSymbol) {
          var compMeta = ((_this._metadataResolver.getNonNormalizedDirectiveMetadata(dirSymbol))).metadata;
          if (!compMeta.isComponent) {
            return;
          }
          ((compMeta.template)).styleUrls.forEach(function(styleUrl) {
            var normalizedUrl = _this._host.resourceNameToFileName(styleUrl, file.fileName);
            if (!normalizedUrl) {
              throw syntaxError("Couldn't resolve resource " + styleUrl + " relative to " + file.fileName);
            }
            var needsShim = (((compMeta.template)).encapsulation || _this._config.defaultEncapsulation) === ViewEncapsulation.Emulated;
            genFileNames.push(_stylesModuleUrl(normalizedUrl, needsShim, fileSuffix));
            if (_this._options.allowEmptyCodegenFiles) {
              genFileNames.push(_stylesModuleUrl(normalizedUrl, !needsShim, fileSuffix));
            }
          });
        });
        return genFileNames;
      };
      AotCompiler.prototype.emitBasicStub = function(genFileName, originalFileName) {
        var outputCtx = this._createOutputContext(genFileName);
        if (genFileName.endsWith('.ngfactory.ts')) {
          if (!originalFileName) {
            throw new Error("Assertion error: require the original file for .ngfactory.ts stubs. File: " + genFileName);
          }
          var originalFile = this._analyzeFile(originalFileName);
          this._createNgFactoryStub(outputCtx, originalFile, StubEmitFlags.Basic);
        } else if (genFileName.endsWith('.ngsummary.ts')) {
          if (this._options.enableSummariesForJit) {
            if (!originalFileName) {
              throw new Error("Assertion error: require the original file for .ngsummary.ts stubs. File: " + genFileName);
            }
            var originalFile = this._analyzeFile(originalFileName);
            _createEmptyStub(outputCtx);
            originalFile.ngModules.forEach(function(ngModule) {
              createForJitStub(outputCtx, ngModule.type.reference);
            });
          }
        } else if (genFileName.endsWith('.ngstyle.ts')) {
          _createEmptyStub(outputCtx);
        }
        return this._codegenSourceModule('unknown', outputCtx);
      };
      AotCompiler.prototype.emitTypeCheckStub = function(genFileName, originalFileName) {
        var originalFile = this._analyzeFile(originalFileName);
        var outputCtx = this._createOutputContext(genFileName);
        if (genFileName.endsWith('.ngfactory.ts')) {
          this._createNgFactoryStub(outputCtx, originalFile, StubEmitFlags.TypeCheck);
        }
        return outputCtx.statements.length > 0 ? this._codegenSourceModule(originalFile.fileName, outputCtx) : null;
      };
      AotCompiler.prototype.loadFilesAsync = function(fileNames) {
        var _this = this;
        var files = fileNames.map(function(fileName) {
          return _this._analyzeFile(fileName);
        });
        var loadingPromises = [];
        files.forEach(function(file) {
          return file.ngModules.forEach(function(ngModule) {
            return loadingPromises.push(_this._metadataResolver.loadNgModuleDirectiveAndPipeMetadata(ngModule.type.reference, false));
          });
        });
        return Promise.all(loadingPromises).then(function(_) {
          return mergeAndValidateNgFiles(files);
        });
      };
      AotCompiler.prototype.loadFilesSync = function(fileNames) {
        var _this = this;
        var files = fileNames.map(function(fileName) {
          return _this._analyzeFile(fileName);
        });
        files.forEach(function(file) {
          return file.ngModules.forEach(function(ngModule) {
            return _this._metadataResolver.loadNgModuleDirectiveAndPipeMetadata(ngModule.type.reference, true);
          });
        });
        return mergeAndValidateNgFiles(files);
      };
      AotCompiler.prototype._createNgFactoryStub = function(outputCtx, file, emitFlags) {
        var _this = this;
        var componentId = 0;
        file.ngModules.forEach(function(ngModuleMeta, ngModuleIndex) {
          _this._ngModuleCompiler.createStub(outputCtx, ngModuleMeta.type.reference);
          var externalReferences = ngModuleMeta.transitiveModule.directives.map(function(d) {
            return d.reference;
          }).concat(ngModuleMeta.transitiveModule.pipes.map(function(d) {
            return d.reference;
          }), ngModuleMeta.importedModules.map(function(m) {
            return m.type.reference;
          }), ngModuleMeta.exportedModules.map(function(m) {
            return m.type.reference;
          }), _this._externalIdentifierReferences([Identifiers.TemplateRef, Identifiers.ElementRef]));
          var externalReferenceVars = new Map();
          externalReferences.forEach(function(ref, typeIndex) {
            externalReferenceVars.set(ref, "_decl" + ngModuleIndex + "_" + typeIndex);
          });
          externalReferenceVars.forEach(function(varName, reference) {
            outputCtx.statements.push(variable(varName).set(NULL_EXPR.cast(DYNAMIC_TYPE)).toDeclStmt(expressionType(outputCtx.importExpr(reference, null, false))));
          });
          if (emitFlags & StubEmitFlags.TypeCheck) {
            ngModuleMeta.declaredDirectives.forEach(function(dirId) {
              var compMeta = _this._metadataResolver.getDirectiveMetadata(dirId.reference);
              if (!compMeta.isComponent) {
                return;
              }
              componentId++;
              _this._createTypeCheckBlock(outputCtx, compMeta.type.reference.name + "_Host_" + componentId, ngModuleMeta, _this._metadataResolver.getHostComponentMetadata(compMeta), [compMeta.type], externalReferenceVars);
              _this._createTypeCheckBlock(outputCtx, compMeta.type.reference.name + "_" + componentId, ngModuleMeta, compMeta, ngModuleMeta.transitiveModule.directives, externalReferenceVars);
            });
          }
        });
        if (outputCtx.statements.length === 0) {
          _createEmptyStub(outputCtx);
        }
      };
      AotCompiler.prototype._externalIdentifierReferences = function(references) {
        var result = [];
        for (var _i = 0,
            references_1 = references; _i < references_1.length; _i++) {
          var reference = references_1[_i];
          var token = createTokenForExternalReference(this._reflector, reference);
          if (token.identifier) {
            result.push(token.identifier.reference);
          }
        }
        return result;
      };
      AotCompiler.prototype._createTypeCheckBlock = function(ctx, componentId, moduleMeta, compMeta, directives, externalReferenceVars) {
        var _a = this._parseTemplate(compMeta, moduleMeta, directives),
            parsedTemplate = _a.template,
            usedPipes = _a.pipes;
        (_b = ctx.statements).push.apply(_b, this._typeCheckCompiler.compileComponent(componentId, compMeta, parsedTemplate, usedPipes, externalReferenceVars, ctx));
        var _b;
      };
      AotCompiler.prototype.emitMessageBundle = function(analyzeResult, locale) {
        var _this = this;
        var errors = [];
        var htmlParser = new HtmlParser();
        var messageBundle = new MessageBundle(htmlParser, [], {}, locale);
        analyzeResult.files.forEach(function(file) {
          var compMetas = [];
          file.directives.forEach(function(directiveType) {
            var dirMeta = _this._metadataResolver.getDirectiveMetadata(directiveType);
            if (dirMeta && dirMeta.isComponent) {
              compMetas.push(dirMeta);
            }
          });
          compMetas.forEach(function(compMeta) {
            var html = ((((compMeta.template)).template));
            var interpolationConfig = InterpolationConfig.fromArray(((compMeta.template)).interpolation);
            errors.push.apply(errors, ((messageBundle.updateFromTemplate(html, file.fileName, interpolationConfig))));
          });
        });
        if (errors.length) {
          throw new Error(errors.map(function(e) {
            return e.toString();
          }).join('\n'));
        }
        return messageBundle;
      };
      AotCompiler.prototype.emitAllImpls = function(analyzeResult) {
        var _this = this;
        var ngModuleByPipeOrDirective = analyzeResult.ngModuleByPipeOrDirective,
            files = analyzeResult.files;
        var sourceModules = files.map(function(file) {
          return _this._compileImplFile(file.fileName, ngModuleByPipeOrDirective, file.directives, file.pipes, file.ngModules, file.injectables);
        });
        return flatten(sourceModules);
      };
      AotCompiler.prototype._compileImplFile = function(srcFileUrl, ngModuleByPipeOrDirective, directives, pipes, ngModules, injectables) {
        var _this = this;
        var fileSuffix = normalizeGenFileSuffix(splitTypescriptSuffix(srcFileUrl, true)[1]);
        var generatedFiles = [];
        var outputCtx = this._createOutputContext(ngfactoryFilePath(srcFileUrl, true));
        generatedFiles.push.apply(generatedFiles, this._createSummary(srcFileUrl, directives, pipes, ngModules, injectables, outputCtx));
        ngModules.forEach(function(ngModuleMeta) {
          return _this._compileModule(outputCtx, ngModuleMeta);
        });
        directives.forEach(function(dirType) {
          var compMeta = _this._metadataResolver.getDirectiveMetadata((dirType));
          if (!compMeta.isComponent) {
            return;
          }
          var ngModule = ngModuleByPipeOrDirective.get(dirType);
          if (!ngModule) {
            throw new Error("Internal Error: cannot determine the module for component " + identifierName(compMeta.type) + "!");
          }
          var componentStylesheet = _this._styleCompiler.compileComponent(outputCtx, compMeta);
          ((compMeta.template)).externalStylesheets.forEach(function(stylesheetMeta) {
            var shim = _this._styleCompiler.needsStyleShim(compMeta);
            generatedFiles.push(_this._codegenStyles(srcFileUrl, compMeta, stylesheetMeta, shim, fileSuffix));
            if (_this._options.allowEmptyCodegenFiles) {
              generatedFiles.push(_this._codegenStyles(srcFileUrl, compMeta, stylesheetMeta, !shim, fileSuffix));
            }
          });
          var compViewVars = _this._compileComponent(outputCtx, compMeta, ngModule, ngModule.transitiveModule.directives, componentStylesheet, fileSuffix);
          _this._compileComponentFactory(outputCtx, compMeta, ngModule, fileSuffix);
        });
        if (outputCtx.statements.length > 0 || this._options.allowEmptyCodegenFiles) {
          var srcModule = this._codegenSourceModule(srcFileUrl, outputCtx);
          generatedFiles.unshift(srcModule);
        }
        return generatedFiles;
      };
      AotCompiler.prototype._createSummary = function(srcFileName, directives, pipes, ngModules, injectables, ngFactoryCtx) {
        var _this = this;
        var symbolSummaries = this._symbolResolver.getSymbolsOf(srcFileName).map(function(symbol) {
          return _this._symbolResolver.resolveSymbol(symbol);
        });
        var typeData = ngModules.map(function(meta) {
          return ({
            summary: ((_this._metadataResolver.getNgModuleSummary(meta.type.reference))),
            metadata: ((_this._metadataResolver.getNgModuleMetadata(meta.type.reference)))
          });
        }).concat(directives.map(function(ref) {
          return ({
            summary: ((_this._metadataResolver.getDirectiveSummary(ref))),
            metadata: ((_this._metadataResolver.getDirectiveMetadata(ref)))
          });
        }), pipes.map(function(ref) {
          return ({
            summary: ((_this._metadataResolver.getPipeSummary(ref))),
            metadata: ((_this._metadataResolver.getPipeMetadata(ref)))
          });
        }), injectables.map(function(ref) {
          return ({
            summary: ((_this._metadataResolver.getInjectableSummary(ref))),
            metadata: ((_this._metadataResolver.getInjectableSummary(ref))).type
          });
        }));
        var forJitOutputCtx = this._options.enableSummariesForJit ? this._createOutputContext(summaryForJitFileName(srcFileName, true)) : null;
        var _a = serializeSummaries(srcFileName, forJitOutputCtx, this._summaryResolver, this._symbolResolver, symbolSummaries, typeData),
            json = _a.json,
            exportAs = _a.exportAs;
        exportAs.forEach(function(entry) {
          ngFactoryCtx.statements.push(variable(entry.exportAs).set(ngFactoryCtx.importExpr(entry.symbol)).toDeclStmt(null, [StmtModifier.Exported]));
        });
        var summaryJson = new GeneratedFile(srcFileName, summaryFileName(srcFileName), json);
        var result = [summaryJson];
        if (forJitOutputCtx) {
          result.push(this._codegenSourceModule(srcFileName, forJitOutputCtx));
        }
        return result;
      };
      AotCompiler.prototype._compileModule = function(outputCtx, ngModule) {
        var providers = [];
        if (this._options.locale) {
          var normalizedLocale = this._options.locale.replace(/_/g, '-');
          providers.push({
            token: createTokenForExternalReference(this._reflector, Identifiers.LOCALE_ID),
            useValue: normalizedLocale
          });
        }
        if (this._options.i18nFormat) {
          providers.push({
            token: createTokenForExternalReference(this._reflector, Identifiers.TRANSLATIONS_FORMAT),
            useValue: this._options.i18nFormat
          });
        }
        this._ngModuleCompiler.compile(outputCtx, ngModule, providers);
      };
      AotCompiler.prototype._compileComponentFactory = function(outputCtx, compMeta, ngModule, fileSuffix) {
        var hostMeta = this._metadataResolver.getHostComponentMetadata(compMeta);
        var hostViewFactoryVar = this._compileComponent(outputCtx, hostMeta, ngModule, [compMeta.type], null, fileSuffix).viewClassVar;
        var compFactoryVar = componentFactoryName(compMeta.type.reference);
        var inputsExprs = [];
        for (var propName in compMeta.inputs) {
          var templateName = compMeta.inputs[propName];
          inputsExprs.push(new LiteralMapEntry(propName, literal(templateName), false));
        }
        var outputsExprs = [];
        for (var propName in compMeta.outputs) {
          var templateName = compMeta.outputs[propName];
          outputsExprs.push(new LiteralMapEntry(propName, literal(templateName), false));
        }
        outputCtx.statements.push(variable(compFactoryVar).set(importExpr(Identifiers.createComponentFactory).callFn([literal(compMeta.selector), outputCtx.importExpr(compMeta.type.reference), variable(hostViewFactoryVar), new LiteralMapExpr(inputsExprs), new LiteralMapExpr(outputsExprs), literalArr(((compMeta.template)).ngContentSelectors.map(function(selector) {
          return literal(selector);
        }))])).toDeclStmt(importType(Identifiers.ComponentFactory, [((expressionType(outputCtx.importExpr(compMeta.type.reference))))], [TypeModifier.Const]), [StmtModifier.Final, StmtModifier.Exported]));
      };
      AotCompiler.prototype._compileComponent = function(outputCtx, compMeta, ngModule, directiveIdentifiers, componentStyles, fileSuffix) {
        var _a = this._parseTemplate(compMeta, ngModule, directiveIdentifiers),
            parsedTemplate = _a.template,
            usedPipes = _a.pipes;
        var stylesExpr = componentStyles ? variable(componentStyles.stylesVar) : literalArr([]);
        var viewResult = this._viewCompiler.compileComponent(outputCtx, compMeta, parsedTemplate, stylesExpr, usedPipes);
        if (componentStyles) {
          _resolveStyleStatements(this._symbolResolver, componentStyles, this._styleCompiler.needsStyleShim(compMeta), fileSuffix);
        }
        return viewResult;
      };
      AotCompiler.prototype._parseTemplate = function(compMeta, ngModule, directiveIdentifiers) {
        var _this = this;
        if (this._templateAstCache.has(compMeta.type.reference)) {
          return ((this._templateAstCache.get(compMeta.type.reference)));
        }
        var preserveWhitespaces = ((((compMeta)).template)).preserveWhitespaces;
        var directives = directiveIdentifiers.map(function(dir) {
          return _this._metadataResolver.getDirectiveSummary(dir.reference);
        });
        var pipes = ngModule.transitiveModule.pipes.map(function(pipe) {
          return _this._metadataResolver.getPipeSummary(pipe.reference);
        });
        var result = this._templateParser.parse(compMeta, ((((compMeta.template)).htmlAst)), directives, pipes, ngModule.schemas, templateSourceUrl(ngModule.type, compMeta, ((compMeta.template))), preserveWhitespaces);
        this._templateAstCache.set(compMeta.type.reference, result);
        return result;
      };
      AotCompiler.prototype._createOutputContext = function(genFilePath) {
        var _this = this;
        var importExpr$$1 = function(symbol, typeParams, useSummaries) {
          if (typeParams === void 0) {
            typeParams = null;
          }
          if (useSummaries === void 0) {
            useSummaries = true;
          }
          if (!(symbol instanceof StaticSymbol)) {
            throw new Error("Internal error: unknown identifier " + JSON.stringify(symbol));
          }
          var arity = _this._symbolResolver.getTypeArity(symbol) || 0;
          var _a = _this._symbolResolver.getImportAs(symbol, useSummaries) || symbol,
              filePath = _a.filePath,
              name = _a.name,
              members = _a.members;
          var importModule = _this._fileNameToModuleName(filePath, genFilePath);
          var selfReference = _this._fileNameToModuleName(genFilePath, genFilePath);
          var moduleName = importModule === selfReference ? null : importModule;
          var suppliedTypeParams = typeParams || [];
          var missingTypeParamsCount = arity - suppliedTypeParams.length;
          var allTypeParams = suppliedTypeParams.concat(new Array(missingTypeParamsCount).fill(DYNAMIC_TYPE));
          return members.reduce(function(expr, memberName) {
            return expr.prop(memberName);
          }, (importExpr(new ExternalReference(moduleName, name, null), allTypeParams)));
        };
        return {
          statements: [],
          genFilePath: genFilePath,
          importExpr: importExpr$$1
        };
      };
      AotCompiler.prototype._fileNameToModuleName = function(importedFilePath, containingFilePath) {
        return this._summaryResolver.getKnownModuleName(importedFilePath) || this._symbolResolver.getKnownModuleName(importedFilePath) || this._host.fileNameToModuleName(importedFilePath, containingFilePath);
      };
      AotCompiler.prototype._codegenStyles = function(srcFileUrl, compMeta, stylesheetMetadata, isShimmed, fileSuffix) {
        var outputCtx = this._createOutputContext(_stylesModuleUrl(((stylesheetMetadata.moduleUrl)), isShimmed, fileSuffix));
        var compiledStylesheet = this._styleCompiler.compileStyles(outputCtx, compMeta, stylesheetMetadata, isShimmed);
        _resolveStyleStatements(this._symbolResolver, compiledStylesheet, isShimmed, fileSuffix);
        return this._codegenSourceModule(srcFileUrl, outputCtx);
      };
      AotCompiler.prototype._codegenSourceModule = function(srcFileUrl, ctx) {
        return new GeneratedFile(srcFileUrl, ctx.genFilePath, ctx.statements);
      };
      AotCompiler.prototype.listLazyRoutes = function(entryRoute, analyzedModules) {
        var self = this;
        if (entryRoute) {
          var symbol = parseLazyRoute(entryRoute, this._reflector).referencedModule;
          return visitLazyRoute(symbol);
        } else if (analyzedModules) {
          var allLazyRoutes = [];
          for (var _i = 0,
              _a = analyzedModules.ngModules; _i < _a.length; _i++) {
            var ngModule = _a[_i];
            var lazyRoutes = listLazyRoutes(ngModule, this._reflector);
            for (var _b = 0,
                lazyRoutes_1 = lazyRoutes; _b < lazyRoutes_1.length; _b++) {
              var lazyRoute = lazyRoutes_1[_b];
              allLazyRoutes.push(lazyRoute);
            }
          }
          return allLazyRoutes;
        } else {
          throw new Error("Either route or analyzedModules has to be specified!");
        }
        function visitLazyRoute(symbol, seenRoutes, allLazyRoutes) {
          if (seenRoutes === void 0) {
            seenRoutes = new Set();
          }
          if (allLazyRoutes === void 0) {
            allLazyRoutes = [];
          }
          if (seenRoutes.has(symbol) || !symbol.name) {
            return allLazyRoutes;
          }
          seenRoutes.add(symbol);
          var lazyRoutes = listLazyRoutes(((self._metadataResolver.getNgModuleMetadata(symbol, true))), self._reflector);
          for (var _i = 0,
              lazyRoutes_2 = lazyRoutes; _i < lazyRoutes_2.length; _i++) {
            var lazyRoute = lazyRoutes_2[_i];
            allLazyRoutes.push(lazyRoute);
            visitLazyRoute(lazyRoute.referencedModule, seenRoutes, allLazyRoutes);
          }
          return allLazyRoutes;
        }
      };
      return AotCompiler;
    }());
    function _createEmptyStub(outputCtx) {
      outputCtx.statements.push(importExpr(Identifiers.ComponentFactory).toStmt());
    }
    function _resolveStyleStatements(symbolResolver, compileResult, needsShim, fileSuffix) {
      compileResult.dependencies.forEach(function(dep) {
        dep.setValue(symbolResolver.getStaticSymbol(_stylesModuleUrl(dep.moduleUrl, needsShim, fileSuffix), dep.name));
      });
    }
    function _stylesModuleUrl(stylesheetUrl, shim, suffix) {
      return "" + stylesheetUrl + (shim ? '.shim' : '') + ".ngstyle" + suffix;
    }
    function analyzeNgModules(fileNames, host, staticSymbolResolver, metadataResolver) {
      var files = _analyzeFilesIncludingNonProgramFiles(fileNames, host, staticSymbolResolver, metadataResolver);
      return mergeAnalyzedFiles(files);
    }
    function analyzeAndValidateNgModules(fileNames, host, staticSymbolResolver, metadataResolver) {
      return validateAnalyzedModules(analyzeNgModules(fileNames, host, staticSymbolResolver, metadataResolver));
    }
    function validateAnalyzedModules(analyzedModules) {
      if (analyzedModules.symbolsMissingModule && analyzedModules.symbolsMissingModule.length) {
        var messages = analyzedModules.symbolsMissingModule.map(function(s) {
          return "Cannot determine the module for class " + s.name + " in " + s.filePath + "! Add " + s.name + " to the NgModule to fix it.";
        });
        throw syntaxError(messages.join('\n'));
      }
      return analyzedModules;
    }
    function _analyzeFilesIncludingNonProgramFiles(fileNames, host, staticSymbolResolver, metadataResolver) {
      var seenFiles = new Set();
      var files = [];
      var visitFile = function(fileName) {
        if (seenFiles.has(fileName) || !host.isSourceFile(fileName)) {
          return false;
        }
        seenFiles.add(fileName);
        var analyzedFile = analyzeFile(host, staticSymbolResolver, metadataResolver, fileName);
        files.push(analyzedFile);
        analyzedFile.ngModules.forEach(function(ngModule) {
          ngModule.transitiveModule.modules.forEach(function(modMeta) {
            return visitFile(modMeta.reference.filePath);
          });
        });
      };
      fileNames.forEach(function(fileName) {
        return visitFile(fileName);
      });
      return files;
    }
    function analyzeFile(host, staticSymbolResolver, metadataResolver, fileName) {
      var directives = [];
      var pipes = [];
      var injectables = [];
      var ngModules = [];
      var hasDecorators = staticSymbolResolver.hasDecorators(fileName);
      var exportsNonSourceFiles = false;
      if (!fileName.endsWith('.d.ts') || hasDecorators) {
        staticSymbolResolver.getSymbolsOf(fileName).forEach(function(symbol) {
          var resolvedSymbol = staticSymbolResolver.resolveSymbol(symbol);
          var symbolMeta = resolvedSymbol.metadata;
          if (!symbolMeta || symbolMeta.__symbolic === 'error') {
            return;
          }
          var isNgSymbol = false;
          if (symbolMeta.__symbolic === 'class') {
            if (metadataResolver.isDirective(symbol)) {
              isNgSymbol = true;
              directives.push(symbol);
            } else if (metadataResolver.isPipe(symbol)) {
              isNgSymbol = true;
              pipes.push(symbol);
            } else if (metadataResolver.isNgModule(symbol)) {
              var ngModule = metadataResolver.getNgModuleMetadata(symbol, false);
              if (ngModule) {
                isNgSymbol = true;
                ngModules.push(ngModule);
              }
            } else if (metadataResolver.isInjectable(symbol)) {
              isNgSymbol = true;
              injectables.push(symbol);
            }
          }
          if (!isNgSymbol) {
            exportsNonSourceFiles = exportsNonSourceFiles || isValueExportingNonSourceFile(host, symbolMeta);
          }
        });
      }
      return {
        fileName: fileName,
        directives: directives,
        pipes: pipes,
        ngModules: ngModules,
        injectables: injectables,
        exportsNonSourceFiles: exportsNonSourceFiles
      };
    }
    function isValueExportingNonSourceFile(host, metadata) {
      var exportsNonSourceFiles = false;
      var Visitor = (function() {
        function Visitor() {}
        Visitor.prototype.visitArray = function(arr, context) {
          var _this = this;
          arr.forEach(function(v) {
            return visitValue(v, _this, context);
          });
        };
        Visitor.prototype.visitStringMap = function(map, context) {
          var _this = this;
          Object.keys(map).forEach(function(key) {
            return visitValue(map[key], _this, context);
          });
        };
        Visitor.prototype.visitPrimitive = function(value, context) {};
        Visitor.prototype.visitOther = function(value, context) {
          if (value instanceof StaticSymbol && !host.isSourceFile(value.filePath)) {
            exportsNonSourceFiles = true;
          }
        };
        return Visitor;
      }());
      visitValue(metadata, new Visitor(), null);
      return exportsNonSourceFiles;
    }
    function mergeAnalyzedFiles(analyzedFiles) {
      var allNgModules = [];
      var ngModuleByPipeOrDirective = new Map();
      var allPipesAndDirectives = new Set();
      analyzedFiles.forEach(function(af) {
        af.ngModules.forEach(function(ngModule) {
          allNgModules.push(ngModule);
          ngModule.declaredDirectives.forEach(function(d) {
            return ngModuleByPipeOrDirective.set(d.reference, ngModule);
          });
          ngModule.declaredPipes.forEach(function(p) {
            return ngModuleByPipeOrDirective.set(p.reference, ngModule);
          });
        });
        af.directives.forEach(function(d) {
          return allPipesAndDirectives.add(d);
        });
        af.pipes.forEach(function(p) {
          return allPipesAndDirectives.add(p);
        });
      });
      var symbolsMissingModule = [];
      allPipesAndDirectives.forEach(function(ref) {
        if (!ngModuleByPipeOrDirective.has(ref)) {
          symbolsMissingModule.push(ref);
        }
      });
      return {
        ngModules: allNgModules,
        ngModuleByPipeOrDirective: ngModuleByPipeOrDirective,
        symbolsMissingModule: symbolsMissingModule,
        files: analyzedFiles
      };
    }
    function mergeAndValidateNgFiles(files) {
      return validateAnalyzedModules(mergeAnalyzedFiles(files));
    }
    var FORMATTED_MESSAGE = 'ngFormattedMessage';
    function indentStr(level) {
      if (level <= 0)
        return '';
      if (level < 6)
        return ['', ' ', '  ', '   ', '    ', '     '][level];
      var half = indentStr(Math.floor(level / 2));
      return half + half + (level % 2 === 1 ? ' ' : '');
    }
    function formatChain(chain, indent) {
      if (indent === void 0) {
        indent = 0;
      }
      if (!chain)
        return '';
      var position = chain.position ? chain.position.fileName + "(" + (chain.position.line + 1) + "," + (chain.position.column + 1) + ")" : '';
      var prefix = position && indent === 0 ? position + ": " : '';
      var postfix = position && indent !== 0 ? " at " + position : '';
      var message = "" + prefix + chain.message + postfix;
      return "" + indentStr(indent) + message + ((chain.next && ('\n' + formatChain(chain.next, indent + 2))) || '');
    }
    function formattedError(chain) {
      var message = formatChain(chain) + '.';
      var error = (syntaxError(message));
      ((error))[FORMATTED_MESSAGE] = true;
      error.chain = chain;
      error.position = chain.position;
      return error;
    }
    function isFormattedError(error) {
      return !!((error))[FORMATTED_MESSAGE];
    }
    var ANGULAR_CORE = '@angular/core';
    var ANGULAR_ROUTER = '@angular/router';
    var HIDDEN_KEY = /^\$.*\$$/;
    var IGNORE = {__symbolic: 'ignore'};
    var USE_VALUE = 'useValue';
    var PROVIDE = 'provide';
    var REFERENCE_SET = new Set([USE_VALUE, 'useFactory', 'data']);
    var TYPEGUARD_POSTFIX = 'TypeGuard';
    var USE_IF = 'UseIf';
    function shouldIgnore(value) {
      return value && value.__symbolic == 'ignore';
    }
    var StaticReflector = (function() {
      function StaticReflector(summaryResolver, symbolResolver, knownMetadataClasses, knownMetadataFunctions, errorRecorder) {
        if (knownMetadataClasses === void 0) {
          knownMetadataClasses = [];
        }
        if (knownMetadataFunctions === void 0) {
          knownMetadataFunctions = [];
        }
        var _this = this;
        this.summaryResolver = summaryResolver;
        this.symbolResolver = symbolResolver;
        this.errorRecorder = errorRecorder;
        this.annotationCache = new Map();
        this.propertyCache = new Map();
        this.parameterCache = new Map();
        this.methodCache = new Map();
        this.staticCache = new Map();
        this.conversionMap = new Map();
        this.resolvedExternalReferences = new Map();
        this.annotationForParentClassWithSummaryKind = new Map();
        this.initializeConversionMap();
        knownMetadataClasses.forEach(function(kc) {
          return _this._registerDecoratorOrConstructor(_this.getStaticSymbol(kc.filePath, kc.name), kc.ctor);
        });
        knownMetadataFunctions.forEach(function(kf) {
          return _this._registerFunction(_this.getStaticSymbol(kf.filePath, kf.name), kf.fn);
        });
        this.annotationForParentClassWithSummaryKind.set(CompileSummaryKind.Directive, [createDirective, createComponent]);
        this.annotationForParentClassWithSummaryKind.set(CompileSummaryKind.Pipe, [createPipe]);
        this.annotationForParentClassWithSummaryKind.set(CompileSummaryKind.NgModule, [createNgModule]);
        this.annotationForParentClassWithSummaryKind.set(CompileSummaryKind.Injectable, [createInjectable, createPipe, createDirective, createComponent, createNgModule]);
      }
      StaticReflector.prototype.componentModuleUrl = function(typeOrFunc) {
        var staticSymbol = this.findSymbolDeclaration(typeOrFunc);
        return this.symbolResolver.getResourcePath(staticSymbol);
      };
      StaticReflector.prototype.resolveExternalReference = function(ref, containingFile) {
        var key = undefined;
        if (!containingFile) {
          key = ref.moduleName + ":" + ref.name;
          var declarationSymbol_1 = this.resolvedExternalReferences.get(key);
          if (declarationSymbol_1)
            return declarationSymbol_1;
        }
        var refSymbol = this.symbolResolver.getSymbolByModule(((ref.moduleName)), ((ref.name)), containingFile);
        var declarationSymbol = this.findSymbolDeclaration(refSymbol);
        if (!containingFile) {
          this.symbolResolver.recordModuleNameForFileName(refSymbol.filePath, ((ref.moduleName)));
          this.symbolResolver.recordImportAs(declarationSymbol, refSymbol);
        }
        if (key) {
          this.resolvedExternalReferences.set(key, declarationSymbol);
        }
        return declarationSymbol;
      };
      StaticReflector.prototype.findDeclaration = function(moduleUrl, name, containingFile) {
        return this.findSymbolDeclaration(this.symbolResolver.getSymbolByModule(moduleUrl, name, containingFile));
      };
      StaticReflector.prototype.tryFindDeclaration = function(moduleUrl, name) {
        var _this = this;
        return this.symbolResolver.ignoreErrorsFor(function() {
          return _this.findDeclaration(moduleUrl, name);
        });
      };
      StaticReflector.prototype.findSymbolDeclaration = function(symbol) {
        var resolvedSymbol = this.symbolResolver.resolveSymbol(symbol);
        if (resolvedSymbol) {
          var resolvedMetadata = resolvedSymbol.metadata;
          if (resolvedMetadata && resolvedMetadata.__symbolic === 'resolved') {
            resolvedMetadata = resolvedMetadata.symbol;
          }
          if (resolvedMetadata instanceof StaticSymbol) {
            return this.findSymbolDeclaration(resolvedSymbol.metadata);
          }
        }
        return symbol;
      };
      StaticReflector.prototype.annotations = function(type) {
        var annotations = this.annotationCache.get(type);
        if (!annotations) {
          annotations = [];
          var classMetadata = this.getTypeMetadata(type);
          var parentType = this.findParentType(type, classMetadata);
          if (parentType) {
            var parentAnnotations = this.annotations(parentType);
            annotations.push.apply(annotations, parentAnnotations);
          }
          var ownAnnotations_1 = [];
          if (classMetadata['decorators']) {
            ownAnnotations_1 = this.simplify(type, classMetadata['decorators']);
            annotations.push.apply(annotations, ownAnnotations_1);
          }
          if (parentType && !this.summaryResolver.isLibraryFile(type.filePath) && this.summaryResolver.isLibraryFile(parentType.filePath)) {
            var summary = this.summaryResolver.resolveSummary(parentType);
            if (summary && summary.type) {
              var requiredAnnotationTypes = ((this.annotationForParentClassWithSummaryKind.get(((summary.type.summaryKind)))));
              var typeHasRequiredAnnotation = requiredAnnotationTypes.some(function(requiredType) {
                return ownAnnotations_1.some(function(ann) {
                  return requiredType.isTypeOf(ann);
                });
              });
              if (!typeHasRequiredAnnotation) {
                this.reportError(formatMetadataError(metadataError("Class " + type.name + " in " + type.filePath + " extends from a " + CompileSummaryKind[(((summary.type.summaryKind)))] + " in another compilation unit without duplicating the decorator", undefined, "Please add a " + requiredAnnotationTypes.map(function(type) {
                  return type.ngMetadataName;
                }).join(' or ') + " decorator to the class"), type), type);
              }
            }
          }
          this.annotationCache.set(type, annotations.filter(function(ann) {
            return !!ann;
          }));
        }
        return annotations;
      };
      StaticReflector.prototype.propMetadata = function(type) {
        var _this = this;
        var propMetadata = this.propertyCache.get(type);
        if (!propMetadata) {
          var classMetadata = this.getTypeMetadata(type);
          propMetadata = {};
          var parentType = this.findParentType(type, classMetadata);
          if (parentType) {
            var parentPropMetadata_1 = this.propMetadata(parentType);
            Object.keys(parentPropMetadata_1).forEach(function(parentProp) {
              ((propMetadata))[parentProp] = parentPropMetadata_1[parentProp];
            });
          }
          var members_1 = classMetadata['members'] || {};
          Object.keys(members_1).forEach(function(propName) {
            var propData = members_1[propName];
            var prop = ((propData)).find(function(a) {
              return a['__symbolic'] == 'property' || a['__symbolic'] == 'method';
            });
            var decorators = [];
            if (((propMetadata))[propName]) {
              decorators.push.apply(decorators, ((propMetadata))[propName]);
            }
            ((propMetadata))[propName] = decorators;
            if (prop && prop['decorators']) {
              decorators.push.apply(decorators, _this.simplify(type, prop['decorators']));
            }
          });
          this.propertyCache.set(type, propMetadata);
        }
        return propMetadata;
      };
      StaticReflector.prototype.parameters = function(type) {
        var _this = this;
        if (!(type instanceof StaticSymbol)) {
          this.reportError(new Error("parameters received " + JSON.stringify(type) + " which is not a StaticSymbol"), type);
          return [];
        }
        try {
          var parameters_1 = this.parameterCache.get(type);
          if (!parameters_1) {
            var classMetadata = this.getTypeMetadata(type);
            var parentType = this.findParentType(type, classMetadata);
            var members = classMetadata ? classMetadata['members'] : null;
            var ctorData = members ? members['__ctor__'] : null;
            if (ctorData) {
              var ctor = ((ctorData)).find(function(a) {
                return a['__symbolic'] == 'constructor';
              });
              var rawParameterTypes = (ctor['parameters']) || [];
              var parameterDecorators_1 = (this.simplify(type, ctor['parameterDecorators'] || []));
              parameters_1 = [];
              rawParameterTypes.forEach(function(rawParamType, index) {
                var nestedResult = [];
                var paramType = _this.trySimplify(type, rawParamType);
                if (paramType)
                  nestedResult.push(paramType);
                var decorators = parameterDecorators_1 ? parameterDecorators_1[index] : null;
                if (decorators) {
                  nestedResult.push.apply(nestedResult, decorators);
                }
                ((parameters_1)).push(nestedResult);
              });
            } else if (parentType) {
              parameters_1 = this.parameters(parentType);
            }
            if (!parameters_1) {
              parameters_1 = [];
            }
            this.parameterCache.set(type, parameters_1);
          }
          return parameters_1;
        } catch (e) {
          console.error("Failed on type " + JSON.stringify(type) + " with error " + e);
          throw e;
        }
      };
      StaticReflector.prototype._methodNames = function(type) {
        var methodNames = this.methodCache.get(type);
        if (!methodNames) {
          var classMetadata = this.getTypeMetadata(type);
          methodNames = {};
          var parentType = this.findParentType(type, classMetadata);
          if (parentType) {
            var parentMethodNames_1 = this._methodNames(parentType);
            Object.keys(parentMethodNames_1).forEach(function(parentProp) {
              ((methodNames))[parentProp] = parentMethodNames_1[parentProp];
            });
          }
          var members_2 = classMetadata['members'] || {};
          Object.keys(members_2).forEach(function(propName) {
            var propData = members_2[propName];
            var isMethod = ((propData)).some(function(a) {
              return a['__symbolic'] == 'method';
            });
            ((methodNames))[propName] = ((methodNames))[propName] || isMethod;
          });
          this.methodCache.set(type, methodNames);
        }
        return methodNames;
      };
      StaticReflector.prototype._staticMembers = function(type) {
        var staticMembers = this.staticCache.get(type);
        if (!staticMembers) {
          var classMetadata = this.getTypeMetadata(type);
          var staticMemberData = classMetadata['statics'] || {};
          staticMembers = Object.keys(staticMemberData);
          this.staticCache.set(type, staticMembers);
        }
        return staticMembers;
      };
      StaticReflector.prototype.findParentType = function(type, classMetadata) {
        var parentType = this.trySimplify(type, classMetadata['extends']);
        if (parentType instanceof StaticSymbol) {
          return parentType;
        }
      };
      StaticReflector.prototype.hasLifecycleHook = function(type, lcProperty) {
        if (!(type instanceof StaticSymbol)) {
          this.reportError(new Error("hasLifecycleHook received " + JSON.stringify(type) + " which is not a StaticSymbol"), type);
        }
        try {
          return !!this._methodNames(type)[lcProperty];
        } catch (e) {
          console.error("Failed on type " + JSON.stringify(type) + " with error " + e);
          throw e;
        }
      };
      StaticReflector.prototype.guards = function(type) {
        if (!(type instanceof StaticSymbol)) {
          this.reportError(new Error("guards received " + JSON.stringify(type) + " which is not a StaticSymbol"), type);
          return {};
        }
        var staticMembers = this._staticMembers(type);
        var result = {};
        for (var _i = 0,
            staticMembers_1 = staticMembers; _i < staticMembers_1.length; _i++) {
          var name_1 = staticMembers_1[_i];
          if (name_1.endsWith(TYPEGUARD_POSTFIX)) {
            var property = name_1.substr(0, name_1.length - TYPEGUARD_POSTFIX.length);
            var value = void 0;
            if (property.endsWith(USE_IF)) {
              property = name_1.substr(0, property.length - USE_IF.length);
              value = USE_IF;
            } else {
              value = this.getStaticSymbol(type.filePath, type.name, [name_1]);
            }
            result[property] = value;
          }
        }
        return result;
      };
      StaticReflector.prototype._registerDecoratorOrConstructor = function(type, ctor) {
        this.conversionMap.set(type, function(context, args) {
          return new (ctor.bind.apply(ctor, [void 0].concat(args)))();
        });
      };
      StaticReflector.prototype._registerFunction = function(type, fn) {
        this.conversionMap.set(type, function(context, args) {
          return fn.apply(undefined, args);
        });
      };
      StaticReflector.prototype.initializeConversionMap = function() {
        this.injectionToken = this.findDeclaration(ANGULAR_CORE, 'InjectionToken');
        this.opaqueToken = this.findDeclaration(ANGULAR_CORE, 'OpaqueToken');
        this.ROUTES = this.tryFindDeclaration(ANGULAR_ROUTER, 'ROUTES');
        this.ANALYZE_FOR_ENTRY_COMPONENTS = this.findDeclaration(ANGULAR_CORE, 'ANALYZE_FOR_ENTRY_COMPONENTS');
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Host'), createHost);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Injectable'), createInjectable);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Self'), createSelf);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'SkipSelf'), createSkipSelf);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Inject'), createInject);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Optional'), createOptional);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Attribute'), createAttribute);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'ContentChild'), createContentChild);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'ContentChildren'), createContentChildren);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'ViewChild'), createViewChild);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'ViewChildren'), createViewChildren);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Input'), createInput);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Output'), createOutput);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Pipe'), createPipe);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'HostBinding'), createHostBinding);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'HostListener'), createHostListener);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Directive'), createDirective);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Component'), createComponent);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'NgModule'), createNgModule);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Host'), createHost);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Self'), createSelf);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'SkipSelf'), createSkipSelf);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Optional'), createOptional);
      };
      StaticReflector.prototype.getStaticSymbol = function(declarationFile, name, members) {
        return this.symbolResolver.getStaticSymbol(declarationFile, name, members);
      };
      StaticReflector.prototype.trySimplify = function(context, value) {
        var originalRecorder = this.errorRecorder;
        this.errorRecorder = function(error, fileName) {};
        var result = this.simplify(context, value);
        this.errorRecorder = originalRecorder;
        return result;
      };
      StaticReflector.prototype.simplify = function(context, value) {
        var self = this;
        var scope = BindingScope.empty;
        var calling = new Map();
        var rootContext = context;
        function simplifyInContext(context, value, depth, references) {
          function resolveReferenceValue(staticSymbol) {
            var resolvedSymbol = self.symbolResolver.resolveSymbol(staticSymbol);
            return resolvedSymbol ? resolvedSymbol.metadata : null;
          }
          function simplifyEagerly(value) {
            return simplifyInContext(context, value, depth, 0);
          }
          function simplifyLazily(value) {
            return simplifyInContext(context, value, depth, references + 1);
          }
          function simplifyNested(nestedContext, value) {
            if (nestedContext === context) {
              return simplifyInContext(nestedContext, value, depth + 1, references);
            }
            try {
              return simplifyInContext(nestedContext, value, depth + 1, references);
            } catch (e) {
              if (isMetadataError(e)) {
                var summaryMsg = e.chain ? 'references \'' + ((e.symbol)).name + '\'' : errorSummary(e);
                var summary = "'" + nestedContext.name + "' " + summaryMsg;
                var chain = {
                  message: summary,
                  position: e.position,
                  next: e.chain
                };
                self.error({
                  message: e.message,
                  advise: e.advise,
                  context: e.context,
                  chain: chain,
                  symbol: nestedContext
                }, context);
              } else {
                throw e;
              }
            }
          }
          function simplifyCall(functionSymbol, targetFunction, args, targetExpression) {
            if (targetFunction && targetFunction['__symbolic'] == 'function') {
              if (calling.get(functionSymbol)) {
                self.error({
                  message: 'Recursion is not supported',
                  summary: "called '" + functionSymbol.name + "' recursively",
                  value: targetFunction
                }, functionSymbol);
              }
              try {
                var value_1 = targetFunction['value'];
                if (value_1 && (depth != 0 || value_1.__symbolic != 'error')) {
                  var parameters = targetFunction['parameters'];
                  var defaults = targetFunction.defaults;
                  args = args.map(function(arg) {
                    return simplifyNested(context, arg);
                  }).map(function(arg) {
                    return shouldIgnore(arg) ? undefined : arg;
                  });
                  if (defaults && defaults.length > args.length) {
                    args.push.apply(args, defaults.slice(args.length).map(function(value) {
                      return simplify(value);
                    }));
                  }
                  calling.set(functionSymbol, true);
                  var functionScope = BindingScope.build();
                  for (var i = 0; i < parameters.length; i++) {
                    functionScope.define(parameters[i], args[i]);
                  }
                  var oldScope = scope;
                  var result_1;
                  try {
                    scope = functionScope.done();
                    result_1 = simplifyNested(functionSymbol, value_1);
                  } finally {
                    scope = oldScope;
                  }
                  return result_1;
                }
              } finally {
                calling.delete(functionSymbol);
              }
            }
            if (depth === 0) {
              return IGNORE;
            }
            var position = undefined;
            if (targetExpression && targetExpression.__symbolic == 'resolved') {
              var line = targetExpression.line;
              var character = targetExpression.character;
              var fileName = targetExpression.fileName;
              if (fileName != null && line != null && character != null) {
                position = {
                  fileName: fileName,
                  line: line,
                  column: character
                };
              }
            }
            self.error({
              message: FUNCTION_CALL_NOT_SUPPORTED,
              context: functionSymbol,
              value: targetFunction,
              position: position
            }, context);
          }
          function simplify(expression) {
            if (isPrimitive(expression)) {
              return expression;
            }
            if (expression instanceof Array) {
              var result_2 = [];
              for (var _i = 0,
                  _a = ((expression)); _i < _a.length; _i++) {
                var item = _a[_i];
                if (item && item.__symbolic === 'spread') {
                  var spreadArray = simplifyEagerly(item.expression);
                  if (Array.isArray(spreadArray)) {
                    for (var _b = 0,
                        spreadArray_1 = spreadArray; _b < spreadArray_1.length; _b++) {
                      var spreadItem = spreadArray_1[_b];
                      result_2.push(spreadItem);
                    }
                    continue;
                  }
                }
                var value_2 = simplify(item);
                if (shouldIgnore(value_2)) {
                  continue;
                }
                result_2.push(value_2);
              }
              return result_2;
            }
            if (expression instanceof StaticSymbol) {
              if (expression === self.injectionToken || self.conversionMap.has(expression) || (references > 0 && !expression.members.length)) {
                return expression;
              } else {
                var staticSymbol = expression;
                var declarationValue = resolveReferenceValue(staticSymbol);
                if (declarationValue != null) {
                  return simplifyNested(staticSymbol, declarationValue);
                } else {
                  return staticSymbol;
                }
              }
            }
            if (expression) {
              if (expression['__symbolic']) {
                var staticSymbol = void 0;
                switch (expression['__symbolic']) {
                  case 'binop':
                    var left = simplify(expression['left']);
                    if (shouldIgnore(left))
                      return left;
                    var right = simplify(expression['right']);
                    if (shouldIgnore(right))
                      return right;
                    switch (expression['operator']) {
                      case '&&':
                        return left && right;
                      case '||':
                        return left || right;
                      case '|':
                        return left | right;
                      case '^':
                        return left ^ right;
                      case '&':
                        return left & right;
                      case '==':
                        return left == right;
                      case '!=':
                        return left != right;
                      case '===':
                        return left === right;
                      case '!==':
                        return left !== right;
                      case '<':
                        return left < right;
                      case '>':
                        return left > right;
                      case '<=':
                        return left <= right;
                      case '>=':
                        return left >= right;
                      case '<<':
                        return left << right;
                      case '>>':
                        return left >> right;
                      case '+':
                        return left + right;
                      case '-':
                        return left - right;
                      case '*':
                        return left * right;
                      case '/':
                        return left / right;
                      case '%':
                        return left % right;
                    }
                    return null;
                  case 'if':
                    var condition = simplify(expression['condition']);
                    return condition ? simplify(expression['thenExpression']) : simplify(expression['elseExpression']);
                  case 'pre':
                    var operand = simplify(expression['operand']);
                    if (shouldIgnore(operand))
                      return operand;
                    switch (expression['operator']) {
                      case '+':
                        return operand;
                      case '-':
                        return -operand;
                      case '!':
                        return !operand;
                      case '~':
                        return ~operand;
                    }
                    return null;
                  case 'index':
                    var indexTarget = simplifyEagerly(expression['expression']);
                    var index = simplifyEagerly(expression['index']);
                    if (indexTarget && isPrimitive(index))
                      return indexTarget[index];
                    return null;
                  case 'select':
                    var member = expression['member'];
                    var selectContext = context;
                    var selectTarget = simplify(expression['expression']);
                    if (selectTarget instanceof StaticSymbol) {
                      var members = selectTarget.members.concat(member);
                      selectContext = self.getStaticSymbol(selectTarget.filePath, selectTarget.name, members);
                      var declarationValue = resolveReferenceValue(selectContext);
                      if (declarationValue != null) {
                        return simplifyNested(selectContext, declarationValue);
                      } else {
                        return selectContext;
                      }
                    }
                    if (selectTarget && isPrimitive(member))
                      return simplifyNested(selectContext, selectTarget[member]);
                    return null;
                  case 'reference':
                    var name_2 = expression['name'];
                    var localValue = scope.resolve(name_2);
                    if (localValue != BindingScope.missing) {
                      return localValue;
                    }
                    break;
                  case 'resolved':
                    try {
                      return simplify(expression.symbol);
                    } catch (e) {
                      if (isMetadataError(e) && expression.fileName != null && expression.line != null && expression.character != null) {
                        e.position = {
                          fileName: expression.fileName,
                          line: expression.line,
                          column: expression.character
                        };
                      }
                      throw e;
                    }
                  case 'class':
                    return context;
                  case 'function':
                    return context;
                  case 'new':
                  case 'call':
                    staticSymbol = simplifyInContext(context, expression['expression'], depth + 1, 0);
                    if (staticSymbol instanceof StaticSymbol) {
                      if (staticSymbol === self.injectionToken || staticSymbol === self.opaqueToken) {
                        return context;
                      }
                      var argExpressions = expression['arguments'] || [];
                      var converter = self.conversionMap.get(staticSymbol);
                      if (converter) {
                        var args = argExpressions.map(function(arg) {
                          return simplifyNested(context, arg);
                        }).map(function(arg) {
                          return shouldIgnore(arg) ? undefined : arg;
                        });
                        return converter(context, args);
                      } else {
                        var targetFunction = resolveReferenceValue(staticSymbol);
                        return simplifyCall(staticSymbol, targetFunction, argExpressions, expression['expression']);
                      }
                    }
                    return IGNORE;
                  case 'error':
                    var message = expression.message;
                    if (expression['line'] != null) {
                      self.error({
                        message: message,
                        context: expression.context,
                        value: expression,
                        position: {
                          fileName: expression['fileName'],
                          line: expression['line'],
                          column: expression['character']
                        }
                      }, context);
                    } else {
                      self.error({
                        message: message,
                        context: expression.context
                      }, context);
                    }
                    return IGNORE;
                  case 'ignore':
                    return expression;
                }
                return null;
              }
              return mapStringMap(expression, function(value, name) {
                if (REFERENCE_SET.has(name)) {
                  if (name === USE_VALUE && PROVIDE in expression) {
                    var provide = simplify(expression.provide);
                    if (provide === self.ROUTES || provide == self.ANALYZE_FOR_ENTRY_COMPONENTS) {
                      return simplify(value);
                    }
                  }
                  return simplifyLazily(value);
                }
                return simplify(value);
              });
            }
            return IGNORE;
          }
          return simplify(value);
        }
        var result;
        try {
          result = simplifyInContext(context, value, 0, 0);
        } catch (e) {
          if (this.errorRecorder) {
            this.reportError(e, context);
          } else {
            throw formatMetadataError(e, context);
          }
        }
        if (shouldIgnore(result)) {
          return undefined;
        }
        return result;
      };
      StaticReflector.prototype.getTypeMetadata = function(type) {
        var resolvedSymbol = this.symbolResolver.resolveSymbol(type);
        return resolvedSymbol && resolvedSymbol.metadata ? resolvedSymbol.metadata : {__symbolic: 'class'};
      };
      StaticReflector.prototype.reportError = function(error, context, path) {
        if (this.errorRecorder) {
          this.errorRecorder(formatMetadataError(error, context), (context && context.filePath) || path);
        } else {
          throw error;
        }
      };
      StaticReflector.prototype.error = function(_a, reportingContext) {
        var message = _a.message,
            summary = _a.summary,
            advise = _a.advise,
            position = _a.position,
            context = _a.context,
            value = _a.value,
            symbol = _a.symbol,
            chain = _a.chain;
        this.reportError(metadataError(message, summary, advise, position, symbol, context, chain), reportingContext);
      };
      return StaticReflector;
    }());
    var METADATA_ERROR = 'ngMetadataError';
    function metadataError(message, summary, advise, position, symbol, context, chain) {
      var error = (syntaxError(message));
      ((error))[METADATA_ERROR] = true;
      if (advise)
        error.advise = advise;
      if (position)
        error.position = position;
      if (summary)
        error.summary = summary;
      if (context)
        error.context = context;
      if (chain)
        error.chain = chain;
      if (symbol)
        error.symbol = symbol;
      return error;
    }
    function isMetadataError(error) {
      return !!((error))[METADATA_ERROR];
    }
    var REFERENCE_TO_NONEXPORTED_CLASS = 'Reference to non-exported class';
    var VARIABLE_NOT_INITIALIZED = 'Variable not initialized';
    var DESTRUCTURE_NOT_SUPPORTED = 'Destructuring not supported';
    var COULD_NOT_RESOLVE_TYPE = 'Could not resolve type';
    var FUNCTION_CALL_NOT_SUPPORTED = 'Function call not supported';
    var REFERENCE_TO_LOCAL_SYMBOL = 'Reference to a local symbol';
    var LAMBDA_NOT_SUPPORTED = 'Lambda not supported';
    function expandedMessage(message, context) {
      switch (message) {
        case REFERENCE_TO_NONEXPORTED_CLASS:
          if (context && context.className) {
            return "References to a non-exported class are not supported in decorators but " + context.className + " was referenced.";
          }
          break;
        case VARIABLE_NOT_INITIALIZED:
          return 'Only initialized variables and constants can be referenced in decorators because the value of this variable is needed by the template compiler';
        case DESTRUCTURE_NOT_SUPPORTED:
          return 'Referencing an exported destructured variable or constant is not supported in decorators and this value is needed by the template compiler';
        case COULD_NOT_RESOLVE_TYPE:
          if (context && context.typeName) {
            return "Could not resolve type " + context.typeName;
          }
          break;
        case FUNCTION_CALL_NOT_SUPPORTED:
          if (context && context.name) {
            return "Function calls are not supported in decorators but '" + context.name + "' was called";
          }
          return 'Function calls are not supported in decorators';
        case REFERENCE_TO_LOCAL_SYMBOL:
          if (context && context.name) {
            return "Reference to a local (non-exported) symbols are not supported in decorators but '" + context.name + "' was referenced";
          }
          break;
        case LAMBDA_NOT_SUPPORTED:
          return "Function expressions are not supported in decorators";
      }
      return message;
    }
    function messageAdvise(message, context) {
      switch (message) {
        case REFERENCE_TO_NONEXPORTED_CLASS:
          if (context && context.className) {
            return "Consider exporting '" + context.className + "'";
          }
          break;
        case DESTRUCTURE_NOT_SUPPORTED:
          return 'Consider simplifying to avoid destructuring';
        case REFERENCE_TO_LOCAL_SYMBOL:
          if (context && context.name) {
            return "Consider exporting '" + context.name + "'";
          }
          break;
        case LAMBDA_NOT_SUPPORTED:
          return "Consider changing the function expression into an exported function";
      }
      return undefined;
    }
    function errorSummary(error) {
      if (error.summary) {
        return error.summary;
      }
      switch (error.message) {
        case REFERENCE_TO_NONEXPORTED_CLASS:
          if (error.context && error.context.className) {
            return "references non-exported class " + error.context.className;
          }
          break;
        case VARIABLE_NOT_INITIALIZED:
          return 'is not initialized';
        case DESTRUCTURE_NOT_SUPPORTED:
          return 'is a destructured variable';
        case COULD_NOT_RESOLVE_TYPE:
          return 'could not be resolved';
        case FUNCTION_CALL_NOT_SUPPORTED:
          if (error.context && error.context.name) {
            return "calls '" + error.context.name + "'";
          }
          return "calls a function";
        case REFERENCE_TO_LOCAL_SYMBOL:
          if (error.context && error.context.name) {
            return "references local variable " + error.context.name;
          }
          return "references a local variable";
      }
      return 'contains the error';
    }
    function mapStringMap(input, transform) {
      if (!input)
        return {};
      var result = {};
      Object.keys(input).forEach(function(key) {
        var value = transform(input[key], key);
        if (!shouldIgnore(value)) {
          if (HIDDEN_KEY.test(key)) {
            Object.defineProperty(result, key, {
              enumerable: false,
              configurable: true,
              value: value
            });
          } else {
            result[key] = value;
          }
        }
      });
      return result;
    }
    function isPrimitive(o) {
      return o === null || (typeof o !== 'function' && typeof o !== 'object');
    }
    var BindingScope = (function() {
      function BindingScope() {}
      BindingScope.build = function() {
        var current = new Map();
        return {
          define: function(name, value) {
            current.set(name, value);
            return this;
          },
          done: function() {
            return current.size > 0 ? new PopulatedScope(current) : BindingScope.empty;
          }
        };
      };
      BindingScope.missing = {};
      BindingScope.empty = {resolve: function(name) {
          return BindingScope.missing;
        }};
      return BindingScope;
    }());
    var PopulatedScope = (function(_super) {
      __extends(PopulatedScope, _super);
      function PopulatedScope(bindings) {
        var _this = _super.call(this) || this;
        _this.bindings = bindings;
        return _this;
      }
      PopulatedScope.prototype.resolve = function(name) {
        return this.bindings.has(name) ? this.bindings.get(name) : BindingScope.missing;
      };
      return PopulatedScope;
    }(BindingScope));
    function formatMetadataMessageChain(chain, advise) {
      var expanded = expandedMessage(chain.message, chain.context);
      var nesting = chain.symbol ? " in '" + chain.symbol.name + "'" : '';
      var message = "" + expanded + nesting;
      var position = chain.position;
      var next = chain.next ? formatMetadataMessageChain(chain.next, advise) : advise ? {message: advise} : undefined;
      return {
        message: message,
        position: position,
        next: next
      };
    }
    function formatMetadataError(e, context) {
      if (isMetadataError(e)) {
        var position = e.position;
        var chain = {
          message: "Error during template compile of '" + context.name + "'",
          position: position,
          next: {
            message: e.message,
            next: e.chain,
            context: e.context,
            symbol: e.symbol
          }
        };
        var advise = e.advise || messageAdvise(e.message, e.context);
        return formattedError(formatMetadataMessageChain(chain, advise));
      }
      return e;
    }
    var AotSummaryResolver = (function() {
      function AotSummaryResolver(host, staticSymbolCache) {
        this.host = host;
        this.staticSymbolCache = staticSymbolCache;
        this.summaryCache = new Map();
        this.loadedFilePaths = new Map();
        this.importAs = new Map();
        this.knownFileNameToModuleNames = new Map();
      }
      AotSummaryResolver.prototype.isLibraryFile = function(filePath) {
        return !this.host.isSourceFile(stripGeneratedFileSuffix(filePath));
      };
      AotSummaryResolver.prototype.toSummaryFileName = function(filePath, referringSrcFileName) {
        return this.host.toSummaryFileName(filePath, referringSrcFileName);
      };
      AotSummaryResolver.prototype.fromSummaryFileName = function(fileName, referringLibFileName) {
        return this.host.fromSummaryFileName(fileName, referringLibFileName);
      };
      AotSummaryResolver.prototype.resolveSummary = function(staticSymbol) {
        var rootSymbol = staticSymbol.members.length ? this.staticSymbolCache.get(staticSymbol.filePath, staticSymbol.name) : staticSymbol;
        var summary = this.summaryCache.get(rootSymbol);
        if (!summary) {
          this._loadSummaryFile(staticSymbol.filePath);
          summary = ((this.summaryCache.get(staticSymbol)));
        }
        return (rootSymbol === staticSymbol && summary) || null;
      };
      AotSummaryResolver.prototype.getSymbolsOf = function(filePath) {
        if (this._loadSummaryFile(filePath)) {
          return Array.from(this.summaryCache.keys()).filter(function(symbol) {
            return symbol.filePath === filePath;
          });
        }
        return null;
      };
      AotSummaryResolver.prototype.getImportAs = function(staticSymbol) {
        staticSymbol.assertNoMembers();
        return ((this.importAs.get(staticSymbol)));
      };
      AotSummaryResolver.prototype.getKnownModuleName = function(importedFilePath) {
        return this.knownFileNameToModuleNames.get(importedFilePath) || null;
      };
      AotSummaryResolver.prototype.addSummary = function(summary) {
        this.summaryCache.set(summary.symbol, summary);
      };
      AotSummaryResolver.prototype._loadSummaryFile = function(filePath) {
        var _this = this;
        var hasSummary = this.loadedFilePaths.get(filePath);
        if (hasSummary != null) {
          return hasSummary;
        }
        var json = null;
        if (this.isLibraryFile(filePath)) {
          var summaryFilePath = summaryFileName(filePath);
          try {
            json = this.host.loadSummary(summaryFilePath);
          } catch (e) {
            console.error("Error loading summary file " + summaryFilePath);
            throw e;
          }
        }
        hasSummary = json != null;
        this.loadedFilePaths.set(filePath, hasSummary);
        if (json) {
          var _a = deserializeSummaries(this.staticSymbolCache, this, filePath, json),
              moduleName = _a.moduleName,
              summaries = _a.summaries,
              importAs = _a.importAs;
          summaries.forEach(function(summary) {
            return _this.summaryCache.set(summary.symbol, summary);
          });
          if (moduleName) {
            this.knownFileNameToModuleNames.set(filePath, moduleName);
          }
          importAs.forEach(function(importAs) {
            _this.importAs.set(importAs.symbol, importAs.importAs);
          });
        }
        return hasSummary;
      };
      return AotSummaryResolver;
    }());
    function createAotUrlResolver(host) {
      return {resolve: function(basePath, url) {
          var filePath = host.resourceNameToFileName(url, basePath);
          if (!filePath) {
            throw syntaxError("Couldn't resolve resource " + url + " from " + basePath);
          }
          return filePath;
        }};
    }
    function createAotCompiler(compilerHost, options, errorCollector) {
      var translations = options.translations || '';
      var urlResolver = createAotUrlResolver(compilerHost);
      var symbolCache = new StaticSymbolCache();
      var summaryResolver = new AotSummaryResolver(compilerHost, symbolCache);
      var symbolResolver = new StaticSymbolResolver(compilerHost, symbolCache, summaryResolver);
      var staticReflector = new StaticReflector(summaryResolver, symbolResolver, [], [], errorCollector);
      var htmlParser = new I18NHtmlParser(new HtmlParser(), translations, options.i18nFormat, options.missingTranslation, console);
      var config = new CompilerConfig({
        defaultEncapsulation: ViewEncapsulation.Emulated,
        useJit: false,
        enableLegacyTemplate: options.enableLegacyTemplate === true,
        missingTranslation: options.missingTranslation,
        preserveWhitespaces: options.preserveWhitespaces,
        strictInjectionParameters: options.strictInjectionParameters
      });
      var normalizer = new DirectiveNormalizer({get: function(url) {
          return compilerHost.loadResource(url);
        }}, urlResolver, htmlParser, config);
      var expressionParser = new Parser(new Lexer());
      var elementSchemaRegistry = new DomElementSchemaRegistry();
      var tmplParser = new TemplateParser(config, staticReflector, expressionParser, elementSchemaRegistry, htmlParser, console, []);
      var resolver = new CompileMetadataResolver(config, htmlParser, new NgModuleResolver(staticReflector), new DirectiveResolver(staticReflector), new PipeResolver(staticReflector), summaryResolver, elementSchemaRegistry, normalizer, console, symbolCache, staticReflector, errorCollector);
      var viewCompiler = new ViewCompiler(staticReflector);
      var typeCheckCompiler = new TypeCheckCompiler(options, staticReflector);
      var compiler = new AotCompiler(config, options, compilerHost, staticReflector, resolver, tmplParser, new StyleCompiler(urlResolver), viewCompiler, typeCheckCompiler, new NgModuleCompiler(staticReflector), new TypeScriptEmitter(), summaryResolver, symbolResolver);
      return {
        compiler: compiler,
        reflector: staticReflector
      };
    }
    var SummaryResolver = (function() {
      function SummaryResolver() {}
      return SummaryResolver;
    }());
    var JitSummaryResolver = (function() {
      function JitSummaryResolver() {
        this._summaries = new Map();
      }
      JitSummaryResolver.prototype.isLibraryFile = function() {
        return false;
      };
      JitSummaryResolver.prototype.toSummaryFileName = function(fileName) {
        return fileName;
      };
      JitSummaryResolver.prototype.fromSummaryFileName = function(fileName) {
        return fileName;
      };
      JitSummaryResolver.prototype.resolveSummary = function(reference) {
        return this._summaries.get(reference) || null;
      };
      JitSummaryResolver.prototype.getSymbolsOf = function() {
        return [];
      };
      JitSummaryResolver.prototype.getImportAs = function(reference) {
        return reference;
      };
      JitSummaryResolver.prototype.getKnownModuleName = function(fileName) {
        return null;
      };
      JitSummaryResolver.prototype.addSummary = function(summary) {
        this._summaries.set(summary.symbol, summary);
      };
      return JitSummaryResolver;
    }());
    function interpretStatements(statements, reflector) {
      var ctx = new _ExecutionContext(null, null, null, new Map());
      var visitor = new StatementInterpreter(reflector);
      visitor.visitAllStatements(statements, ctx);
      var result = {};
      ctx.exports.forEach(function(exportName) {
        result[exportName] = ctx.vars.get(exportName);
      });
      return result;
    }
    function _executeFunctionStatements(varNames, varValues, statements, ctx, visitor) {
      var childCtx = ctx.createChildWihtLocalVars();
      for (var i = 0; i < varNames.length; i++) {
        childCtx.vars.set(varNames[i], varValues[i]);
      }
      var result = visitor.visitAllStatements(statements, childCtx);
      return result ? result.value : null;
    }
    var _ExecutionContext = (function() {
      function _ExecutionContext(parent, instance, className, vars) {
        this.parent = parent;
        this.instance = instance;
        this.className = className;
        this.vars = vars;
        this.exports = [];
      }
      _ExecutionContext.prototype.createChildWihtLocalVars = function() {
        return new _ExecutionContext(this, this.instance, this.className, new Map());
      };
      return _ExecutionContext;
    }());
    var ReturnValue = (function() {
      function ReturnValue(value) {
        this.value = value;
      }
      return ReturnValue;
    }());
    function createDynamicClass(_classStmt, _ctx, _visitor) {
      var propertyDescriptors = {};
      _classStmt.getters.forEach(function(getter) {
        propertyDescriptors[getter.name] = {
          configurable: false,
          get: function() {
            var instanceCtx = new _ExecutionContext(_ctx, this, _classStmt.name, _ctx.vars);
            return _executeFunctionStatements([], [], getter.body, instanceCtx, _visitor);
          }
        };
      });
      _classStmt.methods.forEach(function(method) {
        var paramNames = method.params.map(function(param) {
          return param.name;
        });
        propertyDescriptors[((method.name))] = {
          writable: false,
          configurable: false,
          value: function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
            }
            var instanceCtx = new _ExecutionContext(_ctx, this, _classStmt.name, _ctx.vars);
            return _executeFunctionStatements(paramNames, args, method.body, instanceCtx, _visitor);
          }
        };
      });
      var ctorParamNames = _classStmt.constructorMethod.params.map(function(param) {
        return param.name;
      });
      var ctor = function() {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        var instanceCtx = new _ExecutionContext(_ctx, this, _classStmt.name, _ctx.vars);
        _classStmt.fields.forEach(function(field) {
          _this[field.name] = undefined;
        });
        _executeFunctionStatements(ctorParamNames, args, _classStmt.constructorMethod.body, instanceCtx, _visitor);
      };
      var superClass = _classStmt.parent ? _classStmt.parent.visitExpression(_visitor, _ctx) : Object;
      ctor.prototype = Object.create(superClass.prototype, propertyDescriptors);
      return ctor;
    }
    var StatementInterpreter = (function() {
      function StatementInterpreter(reflector) {
        this.reflector = reflector;
      }
      StatementInterpreter.prototype.debugAst = function(ast) {
        return debugOutputAstAsTypeScript(ast);
      };
      StatementInterpreter.prototype.visitDeclareVarStmt = function(stmt, ctx) {
        ctx.vars.set(stmt.name, stmt.value.visitExpression(this, ctx));
        if (stmt.hasModifier(StmtModifier.Exported)) {
          ctx.exports.push(stmt.name);
        }
        return null;
      };
      StatementInterpreter.prototype.visitWriteVarExpr = function(expr, ctx) {
        var value = expr.value.visitExpression(this, ctx);
        var currCtx = ctx;
        while (currCtx != null) {
          if (currCtx.vars.has(expr.name)) {
            currCtx.vars.set(expr.name, value);
            return value;
          }
          currCtx = ((currCtx.parent));
        }
        throw new Error("Not declared variable " + expr.name);
      };
      StatementInterpreter.prototype.visitReadVarExpr = function(ast, ctx) {
        var varName = ((ast.name));
        if (ast.builtin != null) {
          switch (ast.builtin) {
            case BuiltinVar.Super:
              return ctx.instance.__proto__;
            case BuiltinVar.This:
              return ctx.instance;
            case BuiltinVar.CatchError:
              varName = CATCH_ERROR_VAR$2;
              break;
            case BuiltinVar.CatchStack:
              varName = CATCH_STACK_VAR$2;
              break;
            default:
              throw new Error("Unknown builtin variable " + ast.builtin);
          }
        }
        var currCtx = ctx;
        while (currCtx != null) {
          if (currCtx.vars.has(varName)) {
            return currCtx.vars.get(varName);
          }
          currCtx = ((currCtx.parent));
        }
        throw new Error("Not declared variable " + varName);
      };
      StatementInterpreter.prototype.visitWriteKeyExpr = function(expr, ctx) {
        var receiver = expr.receiver.visitExpression(this, ctx);
        var index = expr.index.visitExpression(this, ctx);
        var value = expr.value.visitExpression(this, ctx);
        receiver[index] = value;
        return value;
      };
      StatementInterpreter.prototype.visitWritePropExpr = function(expr, ctx) {
        var receiver = expr.receiver.visitExpression(this, ctx);
        var value = expr.value.visitExpression(this, ctx);
        receiver[expr.name] = value;
        return value;
      };
      StatementInterpreter.prototype.visitInvokeMethodExpr = function(expr, ctx) {
        var receiver = expr.receiver.visitExpression(this, ctx);
        var args = this.visitAllExpressions(expr.args, ctx);
        var result;
        if (expr.builtin != null) {
          switch (expr.builtin) {
            case BuiltinMethod.ConcatArray:
              result = receiver.concat.apply(receiver, args);
              break;
            case BuiltinMethod.SubscribeObservable:
              result = receiver.subscribe({next: args[0]});
              break;
            case BuiltinMethod.Bind:
              result = receiver.bind.apply(receiver, args);
              break;
            default:
              throw new Error("Unknown builtin method " + expr.builtin);
          }
        } else {
          result = receiver[((expr.name))].apply(receiver, args);
        }
        return result;
      };
      StatementInterpreter.prototype.visitInvokeFunctionExpr = function(stmt, ctx) {
        var args = this.visitAllExpressions(stmt.args, ctx);
        var fnExpr = stmt.fn;
        if (fnExpr instanceof ReadVarExpr && fnExpr.builtin === BuiltinVar.Super) {
          ctx.instance.constructor.prototype.constructor.apply(ctx.instance, args);
          return null;
        } else {
          var fn$$1 = stmt.fn.visitExpression(this, ctx);
          return fn$$1.apply(null, args);
        }
      };
      StatementInterpreter.prototype.visitReturnStmt = function(stmt, ctx) {
        return new ReturnValue(stmt.value.visitExpression(this, ctx));
      };
      StatementInterpreter.prototype.visitDeclareClassStmt = function(stmt, ctx) {
        var clazz = createDynamicClass(stmt, ctx, this);
        ctx.vars.set(stmt.name, clazz);
        if (stmt.hasModifier(StmtModifier.Exported)) {
          ctx.exports.push(stmt.name);
        }
        return null;
      };
      StatementInterpreter.prototype.visitExpressionStmt = function(stmt, ctx) {
        return stmt.expr.visitExpression(this, ctx);
      };
      StatementInterpreter.prototype.visitIfStmt = function(stmt, ctx) {
        var condition = stmt.condition.visitExpression(this, ctx);
        if (condition) {
          return this.visitAllStatements(stmt.trueCase, ctx);
        } else if (stmt.falseCase != null) {
          return this.visitAllStatements(stmt.falseCase, ctx);
        }
        return null;
      };
      StatementInterpreter.prototype.visitTryCatchStmt = function(stmt, ctx) {
        try {
          return this.visitAllStatements(stmt.bodyStmts, ctx);
        } catch (e) {
          var childCtx = ctx.createChildWihtLocalVars();
          childCtx.vars.set(CATCH_ERROR_VAR$2, e);
          childCtx.vars.set(CATCH_STACK_VAR$2, e.stack);
          return this.visitAllStatements(stmt.catchStmts, childCtx);
        }
      };
      StatementInterpreter.prototype.visitThrowStmt = function(stmt, ctx) {
        throw stmt.error.visitExpression(this, ctx);
      };
      StatementInterpreter.prototype.visitCommentStmt = function(stmt, context) {
        return null;
      };
      StatementInterpreter.prototype.visitInstantiateExpr = function(ast, ctx) {
        var args = this.visitAllExpressions(ast.args, ctx);
        var clazz = ast.classExpr.visitExpression(this, ctx);
        return new (clazz.bind.apply(clazz, [void 0].concat(args)))();
      };
      StatementInterpreter.prototype.visitLiteralExpr = function(ast, ctx) {
        return ast.value;
      };
      StatementInterpreter.prototype.visitExternalExpr = function(ast, ctx) {
        return this.reflector.resolveExternalReference(ast.value);
      };
      StatementInterpreter.prototype.visitConditionalExpr = function(ast, ctx) {
        if (ast.condition.visitExpression(this, ctx)) {
          return ast.trueCase.visitExpression(this, ctx);
        } else if (ast.falseCase != null) {
          return ast.falseCase.visitExpression(this, ctx);
        }
        return null;
      };
      StatementInterpreter.prototype.visitNotExpr = function(ast, ctx) {
        return !ast.condition.visitExpression(this, ctx);
      };
      StatementInterpreter.prototype.visitAssertNotNullExpr = function(ast, ctx) {
        return ast.condition.visitExpression(this, ctx);
      };
      StatementInterpreter.prototype.visitCastExpr = function(ast, ctx) {
        return ast.value.visitExpression(this, ctx);
      };
      StatementInterpreter.prototype.visitFunctionExpr = function(ast, ctx) {
        var paramNames = ast.params.map(function(param) {
          return param.name;
        });
        return _declareFn(paramNames, ast.statements, ctx, this);
      };
      StatementInterpreter.prototype.visitDeclareFunctionStmt = function(stmt, ctx) {
        var paramNames = stmt.params.map(function(param) {
          return param.name;
        });
        ctx.vars.set(stmt.name, _declareFn(paramNames, stmt.statements, ctx, this));
        if (stmt.hasModifier(StmtModifier.Exported)) {
          ctx.exports.push(stmt.name);
        }
        return null;
      };
      StatementInterpreter.prototype.visitBinaryOperatorExpr = function(ast, ctx) {
        var _this = this;
        var lhs = function() {
          return ast.lhs.visitExpression(_this, ctx);
        };
        var rhs = function() {
          return ast.rhs.visitExpression(_this, ctx);
        };
        switch (ast.operator) {
          case BinaryOperator.Equals:
            return lhs() == rhs();
          case BinaryOperator.Identical:
            return lhs() === rhs();
          case BinaryOperator.NotEquals:
            return lhs() != rhs();
          case BinaryOperator.NotIdentical:
            return lhs() !== rhs();
          case BinaryOperator.And:
            return lhs() && rhs();
          case BinaryOperator.Or:
            return lhs() || rhs();
          case BinaryOperator.Plus:
            return lhs() + rhs();
          case BinaryOperator.Minus:
            return lhs() - rhs();
          case BinaryOperator.Divide:
            return lhs() / rhs();
          case BinaryOperator.Multiply:
            return lhs() * rhs();
          case BinaryOperator.Modulo:
            return lhs() % rhs();
          case BinaryOperator.Lower:
            return lhs() < rhs();
          case BinaryOperator.LowerEquals:
            return lhs() <= rhs();
          case BinaryOperator.Bigger:
            return lhs() > rhs();
          case BinaryOperator.BiggerEquals:
            return lhs() >= rhs();
          default:
            throw new Error("Unknown operator " + ast.operator);
        }
      };
      StatementInterpreter.prototype.visitReadPropExpr = function(ast, ctx) {
        var result;
        var receiver = ast.receiver.visitExpression(this, ctx);
        result = receiver[ast.name];
        return result;
      };
      StatementInterpreter.prototype.visitReadKeyExpr = function(ast, ctx) {
        var receiver = ast.receiver.visitExpression(this, ctx);
        var prop = ast.index.visitExpression(this, ctx);
        return receiver[prop];
      };
      StatementInterpreter.prototype.visitLiteralArrayExpr = function(ast, ctx) {
        return this.visitAllExpressions(ast.entries, ctx);
      };
      StatementInterpreter.prototype.visitLiteralMapExpr = function(ast, ctx) {
        var _this = this;
        var result = {};
        ast.entries.forEach(function(entry) {
          return result[entry.key] = entry.value.visitExpression(_this, ctx);
        });
        return result;
      };
      StatementInterpreter.prototype.visitCommaExpr = function(ast, context) {
        var values = this.visitAllExpressions(ast.parts, context);
        return values[values.length - 1];
      };
      StatementInterpreter.prototype.visitAllExpressions = function(expressions, ctx) {
        var _this = this;
        return expressions.map(function(expr) {
          return expr.visitExpression(_this, ctx);
        });
      };
      StatementInterpreter.prototype.visitAllStatements = function(statements, ctx) {
        for (var i = 0; i < statements.length; i++) {
          var stmt = statements[i];
          var val = stmt.visitStatement(this, ctx);
          if (val instanceof ReturnValue) {
            return val;
          }
        }
        return null;
      };
      return StatementInterpreter;
    }());
    function _declareFn(varNames, statements, ctx, visitor) {
      return function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return _executeFunctionStatements(varNames, args, statements, ctx, visitor);
      };
    }
    var CATCH_ERROR_VAR$2 = 'error';
    var CATCH_STACK_VAR$2 = 'stack';
    var AbstractJsEmitterVisitor = (function(_super) {
      __extends(AbstractJsEmitterVisitor, _super);
      function AbstractJsEmitterVisitor() {
        return _super.call(this, false) || this;
      }
      AbstractJsEmitterVisitor.prototype.visitDeclareClassStmt = function(stmt, ctx) {
        var _this = this;
        ctx.pushClass(stmt);
        this._visitClassConstructor(stmt, ctx);
        if (stmt.parent != null) {
          ctx.print(stmt, stmt.name + ".prototype = Object.create(");
          stmt.parent.visitExpression(this, ctx);
          ctx.println(stmt, ".prototype);");
        }
        stmt.getters.forEach(function(getter) {
          return _this._visitClassGetter(stmt, getter, ctx);
        });
        stmt.methods.forEach(function(method) {
          return _this._visitClassMethod(stmt, method, ctx);
        });
        ctx.popClass();
        return null;
      };
      AbstractJsEmitterVisitor.prototype._visitClassConstructor = function(stmt, ctx) {
        ctx.print(stmt, "function " + stmt.name + "(");
        if (stmt.constructorMethod != null) {
          this._visitParams(stmt.constructorMethod.params, ctx);
        }
        ctx.println(stmt, ") {");
        ctx.incIndent();
        if (stmt.constructorMethod != null) {
          if (stmt.constructorMethod.body.length > 0) {
            ctx.println(stmt, "var self = this;");
            this.visitAllStatements(stmt.constructorMethod.body, ctx);
          }
        }
        ctx.decIndent();
        ctx.println(stmt, "}");
      };
      AbstractJsEmitterVisitor.prototype._visitClassGetter = function(stmt, getter, ctx) {
        ctx.println(stmt, "Object.defineProperty(" + stmt.name + ".prototype, '" + getter.name + "', { get: function() {");
        ctx.incIndent();
        if (getter.body.length > 0) {
          ctx.println(stmt, "var self = this;");
          this.visitAllStatements(getter.body, ctx);
        }
        ctx.decIndent();
        ctx.println(stmt, "}});");
      };
      AbstractJsEmitterVisitor.prototype._visitClassMethod = function(stmt, method, ctx) {
        ctx.print(stmt, stmt.name + ".prototype." + method.name + " = function(");
        this._visitParams(method.params, ctx);
        ctx.println(stmt, ") {");
        ctx.incIndent();
        if (method.body.length > 0) {
          ctx.println(stmt, "var self = this;");
          this.visitAllStatements(method.body, ctx);
        }
        ctx.decIndent();
        ctx.println(stmt, "};");
      };
      AbstractJsEmitterVisitor.prototype.visitReadVarExpr = function(ast, ctx) {
        if (ast.builtin === BuiltinVar.This) {
          ctx.print(ast, 'self');
        } else if (ast.builtin === BuiltinVar.Super) {
          throw new Error("'super' needs to be handled at a parent ast node, not at the variable level!");
        } else {
          _super.prototype.visitReadVarExpr.call(this, ast, ctx);
        }
        return null;
      };
      AbstractJsEmitterVisitor.prototype.visitDeclareVarStmt = function(stmt, ctx) {
        ctx.print(stmt, "var " + stmt.name + " = ");
        stmt.value.visitExpression(this, ctx);
        ctx.println(stmt, ";");
        return null;
      };
      AbstractJsEmitterVisitor.prototype.visitCastExpr = function(ast, ctx) {
        ast.value.visitExpression(this, ctx);
        return null;
      };
      AbstractJsEmitterVisitor.prototype.visitInvokeFunctionExpr = function(expr, ctx) {
        var fnExpr = expr.fn;
        if (fnExpr instanceof ReadVarExpr && fnExpr.builtin === BuiltinVar.Super) {
          ((((ctx.currentClass)).parent)).visitExpression(this, ctx);
          ctx.print(expr, ".call(this");
          if (expr.args.length > 0) {
            ctx.print(expr, ", ");
            this.visitAllExpressions(expr.args, ctx, ',');
          }
          ctx.print(expr, ")");
        } else {
          _super.prototype.visitInvokeFunctionExpr.call(this, expr, ctx);
        }
        return null;
      };
      AbstractJsEmitterVisitor.prototype.visitFunctionExpr = function(ast, ctx) {
        ctx.print(ast, "function(");
        this._visitParams(ast.params, ctx);
        ctx.println(ast, ") {");
        ctx.incIndent();
        this.visitAllStatements(ast.statements, ctx);
        ctx.decIndent();
        ctx.print(ast, "}");
        return null;
      };
      AbstractJsEmitterVisitor.prototype.visitDeclareFunctionStmt = function(stmt, ctx) {
        ctx.print(stmt, "function " + stmt.name + "(");
        this._visitParams(stmt.params, ctx);
        ctx.println(stmt, ") {");
        ctx.incIndent();
        this.visitAllStatements(stmt.statements, ctx);
        ctx.decIndent();
        ctx.println(stmt, "}");
        return null;
      };
      AbstractJsEmitterVisitor.prototype.visitTryCatchStmt = function(stmt, ctx) {
        ctx.println(stmt, "try {");
        ctx.incIndent();
        this.visitAllStatements(stmt.bodyStmts, ctx);
        ctx.decIndent();
        ctx.println(stmt, "} catch (" + CATCH_ERROR_VAR$1.name + ") {");
        ctx.incIndent();
        var catchStmts = [(CATCH_STACK_VAR$1.set(CATCH_ERROR_VAR$1.prop('stack')).toDeclStmt(null, [StmtModifier.Final]))].concat(stmt.catchStmts);
        this.visitAllStatements(catchStmts, ctx);
        ctx.decIndent();
        ctx.println(stmt, "}");
        return null;
      };
      AbstractJsEmitterVisitor.prototype._visitParams = function(params, ctx) {
        this.visitAllObjects(function(param) {
          return ctx.print(null, param.name);
        }, params, ctx, ',');
      };
      AbstractJsEmitterVisitor.prototype.getBuiltinMethodName = function(method) {
        var name;
        switch (method) {
          case BuiltinMethod.ConcatArray:
            name = 'concat';
            break;
          case BuiltinMethod.SubscribeObservable:
            name = 'subscribe';
            break;
          case BuiltinMethod.Bind:
            name = 'bind';
            break;
          default:
            throw new Error("Unknown builtin method: " + method);
        }
        return name;
      };
      return AbstractJsEmitterVisitor;
    }(AbstractEmitterVisitor));
    function evalExpression(sourceUrl, ctx, vars, createSourceMap) {
      var fnBody = ctx.toSource() + "\n//# sourceURL=" + sourceUrl;
      var fnArgNames = [];
      var fnArgValues = [];
      for (var argName in vars) {
        fnArgNames.push(argName);
        fnArgValues.push(vars[argName]);
      }
      if (createSourceMap) {
        var emptyFn = new (Function.bind.apply(Function, [void 0].concat(fnArgNames.concat('return null;'))))().toString();
        var headerLines = emptyFn.slice(0, emptyFn.indexOf('return null;')).split('\n').length - 1;
        fnBody += "\n" + ctx.toSourceMapGenerator(sourceUrl, headerLines).toJsComment();
      }
      return new (Function.bind.apply(Function, [void 0].concat(fnArgNames.concat(fnBody))))().apply(void 0, fnArgValues);
    }
    function jitStatements(sourceUrl, statements, reflector, createSourceMaps) {
      var converter = new JitEmitterVisitor(reflector);
      var ctx = EmitterVisitorContext.createRoot();
      converter.visitAllStatements(statements, ctx);
      converter.createReturnStmt(ctx);
      return evalExpression(sourceUrl, ctx, converter.getArgs(), createSourceMaps);
    }
    var JitEmitterVisitor = (function(_super) {
      __extends(JitEmitterVisitor, _super);
      function JitEmitterVisitor(reflector) {
        var _this = _super.call(this) || this;
        _this.reflector = reflector;
        _this._evalArgNames = [];
        _this._evalArgValues = [];
        _this._evalExportedVars = [];
        return _this;
      }
      JitEmitterVisitor.prototype.createReturnStmt = function(ctx) {
        var stmt = new ReturnStatement(new LiteralMapExpr(this._evalExportedVars.map(function(resultVar) {
          return new LiteralMapEntry(resultVar, variable(resultVar), false);
        })));
        stmt.visitStatement(this, ctx);
      };
      JitEmitterVisitor.prototype.getArgs = function() {
        var result = {};
        for (var i = 0; i < this._evalArgNames.length; i++) {
          result[this._evalArgNames[i]] = this._evalArgValues[i];
        }
        return result;
      };
      JitEmitterVisitor.prototype.visitExternalExpr = function(ast, ctx) {
        var value = this.reflector.resolveExternalReference(ast.value);
        var id = this._evalArgValues.indexOf(value);
        if (id === -1) {
          id = this._evalArgValues.length;
          this._evalArgValues.push(value);
          var name_1 = identifierName({reference: value}) || 'val';
          this._evalArgNames.push("jit_" + name_1 + "_" + id);
        }
        ctx.print(ast, this._evalArgNames[id]);
        return null;
      };
      JitEmitterVisitor.prototype.visitDeclareVarStmt = function(stmt, ctx) {
        if (stmt.hasModifier(StmtModifier.Exported)) {
          this._evalExportedVars.push(stmt.name);
        }
        return _super.prototype.visitDeclareVarStmt.call(this, stmt, ctx);
      };
      JitEmitterVisitor.prototype.visitDeclareFunctionStmt = function(stmt, ctx) {
        if (stmt.hasModifier(StmtModifier.Exported)) {
          this._evalExportedVars.push(stmt.name);
        }
        return _super.prototype.visitDeclareFunctionStmt.call(this, stmt, ctx);
      };
      JitEmitterVisitor.prototype.visitDeclareClassStmt = function(stmt, ctx) {
        if (stmt.hasModifier(StmtModifier.Exported)) {
          this._evalExportedVars.push(stmt.name);
        }
        return _super.prototype.visitDeclareClassStmt.call(this, stmt, ctx);
      };
      return JitEmitterVisitor;
    }(AbstractJsEmitterVisitor));
    var JitCompiler = (function() {
      function JitCompiler(_metadataResolver, _templateParser, _styleCompiler, _viewCompiler, _ngModuleCompiler, _summaryResolver, _reflector, _compilerConfig, _console, getExtraNgModuleProviders) {
        this._metadataResolver = _metadataResolver;
        this._templateParser = _templateParser;
        this._styleCompiler = _styleCompiler;
        this._viewCompiler = _viewCompiler;
        this._ngModuleCompiler = _ngModuleCompiler;
        this._summaryResolver = _summaryResolver;
        this._reflector = _reflector;
        this._compilerConfig = _compilerConfig;
        this._console = _console;
        this.getExtraNgModuleProviders = getExtraNgModuleProviders;
        this._compiledTemplateCache = new Map();
        this._compiledHostTemplateCache = new Map();
        this._compiledDirectiveWrapperCache = new Map();
        this._compiledNgModuleCache = new Map();
        this._sharedStylesheetCount = 0;
        this._addedAotSummaries = new Set();
      }
      JitCompiler.prototype.compileModuleSync = function(moduleType) {
        return SyncAsync.assertSync(this._compileModuleAndComponents(moduleType, true));
      };
      JitCompiler.prototype.compileModuleAsync = function(moduleType) {
        return Promise.resolve(this._compileModuleAndComponents(moduleType, false));
      };
      JitCompiler.prototype.compileModuleAndAllComponentsSync = function(moduleType) {
        return SyncAsync.assertSync(this._compileModuleAndAllComponents(moduleType, true));
      };
      JitCompiler.prototype.compileModuleAndAllComponentsAsync = function(moduleType) {
        return Promise.resolve(this._compileModuleAndAllComponents(moduleType, false));
      };
      JitCompiler.prototype.getComponentFactory = function(component) {
        var summary = this._metadataResolver.getDirectiveSummary(component);
        return (summary.componentFactory);
      };
      JitCompiler.prototype.loadAotSummaries = function(summaries) {
        this.clearCache();
        this._addAotSummaries(summaries);
      };
      JitCompiler.prototype._addAotSummaries = function(fn$$1) {
        if (this._addedAotSummaries.has(fn$$1)) {
          return;
        }
        this._addedAotSummaries.add(fn$$1);
        var summaries = fn$$1();
        for (var i = 0; i < summaries.length; i++) {
          var entry = summaries[i];
          if (typeof entry === 'function') {
            this._addAotSummaries(entry);
          } else {
            var summary = (entry);
            this._summaryResolver.addSummary({
              symbol: summary.type.reference,
              metadata: null,
              type: summary
            });
          }
        }
      };
      JitCompiler.prototype.hasAotSummary = function(ref) {
        return !!this._summaryResolver.resolveSummary(ref);
      };
      JitCompiler.prototype._filterJitIdentifiers = function(ids) {
        var _this = this;
        return ids.map(function(mod) {
          return mod.reference;
        }).filter(function(ref) {
          return !_this.hasAotSummary(ref);
        });
      };
      JitCompiler.prototype._compileModuleAndComponents = function(moduleType, isSync) {
        var _this = this;
        return SyncAsync.then(this._loadModules(moduleType, isSync), function() {
          _this._compileComponents(moduleType, null);
          return _this._compileModule(moduleType);
        });
      };
      JitCompiler.prototype._compileModuleAndAllComponents = function(moduleType, isSync) {
        var _this = this;
        return SyncAsync.then(this._loadModules(moduleType, isSync), function() {
          var componentFactories = [];
          _this._compileComponents(moduleType, componentFactories);
          return {
            ngModuleFactory: _this._compileModule(moduleType),
            componentFactories: componentFactories
          };
        });
      };
      JitCompiler.prototype._loadModules = function(mainModule, isSync) {
        var _this = this;
        var loading = [];
        var mainNgModule = ((this._metadataResolver.getNgModuleMetadata(mainModule)));
        this._filterJitIdentifiers(mainNgModule.transitiveModule.modules).forEach(function(nestedNgModule) {
          var moduleMeta = ((_this._metadataResolver.getNgModuleMetadata(nestedNgModule)));
          _this._filterJitIdentifiers(moduleMeta.declaredDirectives).forEach(function(ref) {
            var promise = _this._metadataResolver.loadDirectiveMetadata(moduleMeta.type.reference, ref, isSync);
            if (promise) {
              loading.push(promise);
            }
          });
          _this._filterJitIdentifiers(moduleMeta.declaredPipes).forEach(function(ref) {
            return _this._metadataResolver.getOrLoadPipeMetadata(ref);
          });
        });
        return SyncAsync.all(loading);
      };
      JitCompiler.prototype._compileModule = function(moduleType) {
        var ngModuleFactory = ((this._compiledNgModuleCache.get(moduleType)));
        if (!ngModuleFactory) {
          var moduleMeta = ((this._metadataResolver.getNgModuleMetadata(moduleType)));
          var extraProviders = this.getExtraNgModuleProviders(moduleMeta.type.reference);
          var outputCtx = createOutputContext();
          var compileResult = this._ngModuleCompiler.compile(outputCtx, moduleMeta, extraProviders);
          ngModuleFactory = this._interpretOrJit(ngModuleJitUrl(moduleMeta), outputCtx.statements)[compileResult.ngModuleFactoryVar];
          this._compiledNgModuleCache.set(moduleMeta.type.reference, ngModuleFactory);
        }
        return ngModuleFactory;
      };
      JitCompiler.prototype._compileComponents = function(mainModule, allComponentFactories) {
        var _this = this;
        var ngModule = ((this._metadataResolver.getNgModuleMetadata(mainModule)));
        var moduleByJitDirective = new Map();
        var templates = new Set();
        var transJitModules = this._filterJitIdentifiers(ngModule.transitiveModule.modules);
        transJitModules.forEach(function(localMod) {
          var localModuleMeta = ((_this._metadataResolver.getNgModuleMetadata(localMod)));
          _this._filterJitIdentifiers(localModuleMeta.declaredDirectives).forEach(function(dirRef) {
            moduleByJitDirective.set(dirRef, localModuleMeta);
            var dirMeta = _this._metadataResolver.getDirectiveMetadata(dirRef);
            if (dirMeta.isComponent) {
              templates.add(_this._createCompiledTemplate(dirMeta, localModuleMeta));
              if (allComponentFactories) {
                var template = _this._createCompiledHostTemplate(dirMeta.type.reference, localModuleMeta);
                templates.add(template);
                allComponentFactories.push((dirMeta.componentFactory));
              }
            }
          });
        });
        transJitModules.forEach(function(localMod) {
          var localModuleMeta = ((_this._metadataResolver.getNgModuleMetadata(localMod)));
          _this._filterJitIdentifiers(localModuleMeta.declaredDirectives).forEach(function(dirRef) {
            var dirMeta = _this._metadataResolver.getDirectiveMetadata(dirRef);
            if (dirMeta.isComponent) {
              dirMeta.entryComponents.forEach(function(entryComponentType) {
                var moduleMeta = ((moduleByJitDirective.get(entryComponentType.componentType)));
                templates.add(_this._createCompiledHostTemplate(entryComponentType.componentType, moduleMeta));
              });
            }
          });
          localModuleMeta.entryComponents.forEach(function(entryComponentType) {
            if (!_this.hasAotSummary(entryComponentType.componentType.reference)) {
              var moduleMeta = ((moduleByJitDirective.get(entryComponentType.componentType)));
              templates.add(_this._createCompiledHostTemplate(entryComponentType.componentType, moduleMeta));
            }
          });
        });
        templates.forEach(function(template) {
          return _this._compileTemplate(template);
        });
      };
      JitCompiler.prototype.clearCacheFor = function(type) {
        this._compiledNgModuleCache.delete(type);
        this._metadataResolver.clearCacheFor(type);
        this._compiledHostTemplateCache.delete(type);
        var compiledTemplate = this._compiledTemplateCache.get(type);
        if (compiledTemplate) {
          this._compiledTemplateCache.delete(type);
        }
      };
      JitCompiler.prototype.clearCache = function() {
        this._metadataResolver.clearCache();
        this._compiledTemplateCache.clear();
        this._compiledHostTemplateCache.clear();
        this._compiledNgModuleCache.clear();
      };
      JitCompiler.prototype._createCompiledHostTemplate = function(compType, ngModule) {
        if (!ngModule) {
          throw new Error("Component " + stringify(compType) + " is not part of any NgModule or the module has not been imported into your module.");
        }
        var compiledTemplate = this._compiledHostTemplateCache.get(compType);
        if (!compiledTemplate) {
          var compMeta = this._metadataResolver.getDirectiveMetadata(compType);
          assertComponent(compMeta);
          var hostMeta = this._metadataResolver.getHostComponentMetadata(compMeta, ((compMeta.componentFactory)).viewDefFactory);
          compiledTemplate = new CompiledTemplate(true, compMeta.type, hostMeta, ngModule, [compMeta.type]);
          this._compiledHostTemplateCache.set(compType, compiledTemplate);
        }
        return compiledTemplate;
      };
      JitCompiler.prototype._createCompiledTemplate = function(compMeta, ngModule) {
        var compiledTemplate = this._compiledTemplateCache.get(compMeta.type.reference);
        if (!compiledTemplate) {
          assertComponent(compMeta);
          compiledTemplate = new CompiledTemplate(false, compMeta.type, compMeta, ngModule, ngModule.transitiveModule.directives);
          this._compiledTemplateCache.set(compMeta.type.reference, compiledTemplate);
        }
        return compiledTemplate;
      };
      JitCompiler.prototype._compileTemplate = function(template) {
        var _this = this;
        if (template.isCompiled) {
          return;
        }
        var compMeta = template.compMeta;
        var externalStylesheetsByModuleUrl = new Map();
        var outputContext = createOutputContext();
        var componentStylesheet = this._styleCompiler.compileComponent(outputContext, compMeta);
        ((compMeta.template)).externalStylesheets.forEach(function(stylesheetMeta) {
          var compiledStylesheet = _this._styleCompiler.compileStyles(createOutputContext(), compMeta, stylesheetMeta);
          externalStylesheetsByModuleUrl.set(((stylesheetMeta.moduleUrl)), compiledStylesheet);
        });
        this._resolveStylesCompileResult(componentStylesheet, externalStylesheetsByModuleUrl);
        var pipes = template.ngModule.transitiveModule.pipes.map(function(pipe) {
          return _this._metadataResolver.getPipeSummary(pipe.reference);
        });
        var _a = this._parseTemplate(compMeta, template.ngModule, template.directives),
            parsedTemplate = _a.template,
            usedPipes = _a.pipes;
        var compileResult = this._viewCompiler.compileComponent(outputContext, compMeta, parsedTemplate, variable(componentStylesheet.stylesVar), usedPipes);
        var evalResult = this._interpretOrJit(templateJitUrl(template.ngModule.type, template.compMeta), outputContext.statements);
        var viewClass = evalResult[compileResult.viewClassVar];
        var rendererType = evalResult[compileResult.rendererTypeVar];
        template.compiled(viewClass, rendererType);
      };
      JitCompiler.prototype._parseTemplate = function(compMeta, ngModule, directiveIdentifiers) {
        var _this = this;
        var preserveWhitespaces = ((compMeta.template)).preserveWhitespaces;
        var directives = directiveIdentifiers.map(function(dir) {
          return _this._metadataResolver.getDirectiveSummary(dir.reference);
        });
        var pipes = ngModule.transitiveModule.pipes.map(function(pipe) {
          return _this._metadataResolver.getPipeSummary(pipe.reference);
        });
        return this._templateParser.parse(compMeta, ((((compMeta.template)).htmlAst)), directives, pipes, ngModule.schemas, templateSourceUrl(ngModule.type, compMeta, ((compMeta.template))), preserveWhitespaces);
      };
      JitCompiler.prototype._resolveStylesCompileResult = function(result, externalStylesheetsByModuleUrl) {
        var _this = this;
        result.dependencies.forEach(function(dep, i) {
          var nestedCompileResult = ((externalStylesheetsByModuleUrl.get(dep.moduleUrl)));
          var nestedStylesArr = _this._resolveAndEvalStylesCompileResult(nestedCompileResult, externalStylesheetsByModuleUrl);
          dep.setValue(nestedStylesArr);
        });
      };
      JitCompiler.prototype._resolveAndEvalStylesCompileResult = function(result, externalStylesheetsByModuleUrl) {
        this._resolveStylesCompileResult(result, externalStylesheetsByModuleUrl);
        return this._interpretOrJit(sharedStylesheetJitUrl(result.meta, this._sharedStylesheetCount++), result.outputCtx.statements)[result.stylesVar];
      };
      JitCompiler.prototype._interpretOrJit = function(sourceUrl, statements) {
        if (!this._compilerConfig.useJit) {
          return interpretStatements(statements, this._reflector);
        } else {
          return jitStatements(sourceUrl, statements, this._reflector, this._compilerConfig.jitDevMode);
        }
      };
      return JitCompiler;
    }());
    var CompiledTemplate = (function() {
      function CompiledTemplate(isHost, compType, compMeta, ngModule, directives) {
        this.isHost = isHost;
        this.compType = compType;
        this.compMeta = compMeta;
        this.ngModule = ngModule;
        this.directives = directives;
        this._viewClass = ((null));
        this.isCompiled = false;
      }
      CompiledTemplate.prototype.compiled = function(viewClass, rendererType) {
        this._viewClass = viewClass;
        ((this.compMeta.componentViewType)).setDelegate(viewClass);
        for (var prop in rendererType) {
          ((this.compMeta.rendererType))[prop] = rendererType[prop];
        }
        this.isCompiled = true;
      };
      return CompiledTemplate;
    }());
    function assertComponent(meta) {
      if (!meta.isComponent) {
        throw new Error("Could not compile '" + identifierName(meta.type) + "' because it is not a component.");
      }
    }
    function createOutputContext() {
      var importExpr$$1 = function(symbol) {
        return importExpr({
          name: identifierName(symbol),
          moduleName: null,
          runtime: symbol
        });
      };
      return {
        statements: [],
        genFilePath: '',
        importExpr: importExpr$$1
      };
    }
    var CompileReflector = (function() {
      function CompileReflector() {}
      return CompileReflector;
    }());
    function createUrlResolverWithoutPackagePrefix() {
      return new UrlResolver();
    }
    function createOfflineCompileUrlResolver() {
      return new UrlResolver('.');
    }
    var UrlResolver = (function() {
      function UrlResolverImpl(_packagePrefix) {
        if (_packagePrefix === void 0) {
          _packagePrefix = null;
        }
        this._packagePrefix = _packagePrefix;
      }
      UrlResolverImpl.prototype.resolve = function(baseUrl, url) {
        var resolvedUrl = url;
        if (baseUrl != null && baseUrl.length > 0) {
          resolvedUrl = _resolveUrl(baseUrl, resolvedUrl);
        }
        var resolvedParts = _split(resolvedUrl);
        var prefix = this._packagePrefix;
        if (prefix != null && resolvedParts != null && resolvedParts[_ComponentIndex.Scheme] == 'package') {
          var path = resolvedParts[_ComponentIndex.Path];
          prefix = prefix.replace(/\/+$/, '');
          path = path.replace(/^\/+/, '');
          return prefix + "/" + path;
        }
        return resolvedUrl;
      };
      return UrlResolverImpl;
    }());
    function getUrlScheme(url) {
      var match = _split(url);
      return (match && match[_ComponentIndex.Scheme]) || '';
    }
    function _buildFromEncodedParts(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_queryData, opt_fragment) {
      var out = [];
      if (opt_scheme != null) {
        out.push(opt_scheme + ':');
      }
      if (opt_domain != null) {
        out.push('//');
        if (opt_userInfo != null) {
          out.push(opt_userInfo + '@');
        }
        out.push(opt_domain);
        if (opt_port != null) {
          out.push(':' + opt_port);
        }
      }
      if (opt_path != null) {
        out.push(opt_path);
      }
      if (opt_queryData != null) {
        out.push('?' + opt_queryData);
      }
      if (opt_fragment != null) {
        out.push('#' + opt_fragment);
      }
      return out.join('');
    }
    var _splitRe = new RegExp('^' + '(?:' + '([^:/?#.]+)' + ':)?' + '(?://' + '(?:([^/?#]*)@)?' + '([\\w\\d\\-\\u0100-\\uffff.%]*)' + '(?::([0-9]+))?' + ')?' + '([^?#]+)?' + '(?:\\?([^#]*))?' + '(?:#(.*))?' + '$');
    var _ComponentIndex = {
      Scheme: 1,
      UserInfo: 2,
      Domain: 3,
      Port: 4,
      Path: 5,
      QueryData: 6,
      Fragment: 7
    };
    _ComponentIndex[_ComponentIndex.Scheme] = "Scheme";
    _ComponentIndex[_ComponentIndex.UserInfo] = "UserInfo";
    _ComponentIndex[_ComponentIndex.Domain] = "Domain";
    _ComponentIndex[_ComponentIndex.Port] = "Port";
    _ComponentIndex[_ComponentIndex.Path] = "Path";
    _ComponentIndex[_ComponentIndex.QueryData] = "QueryData";
    _ComponentIndex[_ComponentIndex.Fragment] = "Fragment";
    function _split(uri) {
      return ((uri.match(_splitRe)));
    }
    function _removeDotSegments(path) {
      if (path == '/')
        return '/';
      var leadingSlash = path[0] == '/' ? '/' : '';
      var trailingSlash = path[path.length - 1] === '/' ? '/' : '';
      var segments = path.split('/');
      var out = [];
      var up = 0;
      for (var pos = 0; pos < segments.length; pos++) {
        var segment = segments[pos];
        switch (segment) {
          case '':
          case '.':
            break;
          case '..':
            if (out.length > 0) {
              out.pop();
            } else {
              up++;
            }
            break;
          default:
            out.push(segment);
        }
      }
      if (leadingSlash == '') {
        while (up-- > 0) {
          out.unshift('..');
        }
        if (out.length === 0)
          out.push('.');
      }
      return leadingSlash + out.join('/') + trailingSlash;
    }
    function _joinAndCanonicalizePath(parts) {
      var path = parts[_ComponentIndex.Path];
      path = path == null ? '' : _removeDotSegments(path);
      parts[_ComponentIndex.Path] = path;
      return _buildFromEncodedParts(parts[_ComponentIndex.Scheme], parts[_ComponentIndex.UserInfo], parts[_ComponentIndex.Domain], parts[_ComponentIndex.Port], path, parts[_ComponentIndex.QueryData], parts[_ComponentIndex.Fragment]);
    }
    function _resolveUrl(base, url) {
      var parts = _split(encodeURI(url));
      var baseParts = _split(base);
      if (parts[_ComponentIndex.Scheme] != null) {
        return _joinAndCanonicalizePath(parts);
      } else {
        parts[_ComponentIndex.Scheme] = baseParts[_ComponentIndex.Scheme];
      }
      for (var i = _ComponentIndex.Scheme; i <= _ComponentIndex.Port; i++) {
        if (parts[i] == null) {
          parts[i] = baseParts[i];
        }
      }
      if (parts[_ComponentIndex.Path][0] == '/') {
        return _joinAndCanonicalizePath(parts);
      }
      var path = baseParts[_ComponentIndex.Path];
      if (path == null)
        path = '/';
      var index = path.lastIndexOf('/');
      path = path.substring(0, index + 1) + parts[_ComponentIndex.Path];
      parts[_ComponentIndex.Path] = path;
      return _joinAndCanonicalizePath(parts);
    }
    var ResourceLoader = (function() {
      function ResourceLoader() {}
      ResourceLoader.prototype.get = function(url) {
        return '';
      };
      return ResourceLoader;
    }());
    var Extractor = (function() {
      function Extractor(host, staticSymbolResolver, messageBundle, metadataResolver) {
        this.host = host;
        this.staticSymbolResolver = staticSymbolResolver;
        this.messageBundle = messageBundle;
        this.metadataResolver = metadataResolver;
      }
      Extractor.prototype.extract = function(rootFiles) {
        var _this = this;
        var _a = analyzeAndValidateNgModules(rootFiles, this.host, this.staticSymbolResolver, this.metadataResolver),
            files = _a.files,
            ngModules = _a.ngModules;
        return Promise.all(ngModules.map(function(ngModule) {
          return _this.metadataResolver.loadNgModuleDirectiveAndPipeMetadata(ngModule.type.reference, false);
        })).then(function() {
          var errors = [];
          files.forEach(function(file) {
            var compMetas = [];
            file.directives.forEach(function(directiveType) {
              var dirMeta = _this.metadataResolver.getDirectiveMetadata(directiveType);
              if (dirMeta && dirMeta.isComponent) {
                compMetas.push(dirMeta);
              }
            });
            compMetas.forEach(function(compMeta) {
              var html = ((((compMeta.template)).template));
              var interpolationConfig = InterpolationConfig.fromArray(((compMeta.template)).interpolation);
              errors.push.apply(errors, ((_this.messageBundle.updateFromTemplate(html, file.fileName, interpolationConfig))));
            });
          });
          if (errors.length) {
            throw new Error(errors.map(function(e) {
              return e.toString();
            }).join('\n'));
          }
          return _this.messageBundle;
        });
      };
      Extractor.create = function(host, locale) {
        var htmlParser = new HtmlParser();
        var urlResolver = createAotUrlResolver(host);
        var symbolCache = new StaticSymbolCache();
        var summaryResolver = new AotSummaryResolver(host, symbolCache);
        var staticSymbolResolver = new StaticSymbolResolver(host, symbolCache, summaryResolver);
        var staticReflector = new StaticReflector(summaryResolver, staticSymbolResolver);
        var config = new CompilerConfig({
          defaultEncapsulation: ViewEncapsulation.Emulated,
          useJit: false
        });
        var normalizer = new DirectiveNormalizer({get: function(url) {
            return host.loadResource(url);
          }}, urlResolver, htmlParser, config);
        var elementSchemaRegistry = new DomElementSchemaRegistry();
        var resolver = new CompileMetadataResolver(config, htmlParser, new NgModuleResolver(staticReflector), new DirectiveResolver(staticReflector), new PipeResolver(staticReflector), summaryResolver, elementSchemaRegistry, normalizer, console, symbolCache, staticReflector);
        var messageBundle = new MessageBundle(htmlParser, [], {}, locale);
        var extractor = new Extractor(host, staticSymbolResolver, messageBundle, resolver);
        return {
          extractor: extractor,
          staticReflector: staticReflector
        };
      };
      return Extractor;
    }());
    exports.core = core;
    exports.CompilerConfig = CompilerConfig;
    exports.preserveWhitespacesDefault = preserveWhitespacesDefault;
    exports.isLoweredSymbol = isLoweredSymbol;
    exports.createLoweredSymbol = createLoweredSymbol;
    exports.Identifiers = Identifiers;
    exports.JitCompiler = JitCompiler;
    exports.DirectiveResolver = DirectiveResolver;
    exports.PipeResolver = PipeResolver;
    exports.NgModuleResolver = NgModuleResolver;
    exports.DEFAULT_INTERPOLATION_CONFIG = DEFAULT_INTERPOLATION_CONFIG;
    exports.InterpolationConfig = InterpolationConfig;
    exports.NgModuleCompiler = NgModuleCompiler;
    exports.AssertNotNull = AssertNotNull;
    exports.BinaryOperator = BinaryOperator;
    exports.BinaryOperatorExpr = BinaryOperatorExpr;
    exports.BuiltinMethod = BuiltinMethod;
    exports.BuiltinVar = BuiltinVar;
    exports.CastExpr = CastExpr;
    exports.ClassStmt = ClassStmt;
    exports.CommaExpr = CommaExpr;
    exports.CommentStmt = CommentStmt;
    exports.ConditionalExpr = ConditionalExpr;
    exports.DeclareFunctionStmt = DeclareFunctionStmt;
    exports.DeclareVarStmt = DeclareVarStmt;
    exports.ExpressionStatement = ExpressionStatement;
    exports.ExternalExpr = ExternalExpr;
    exports.ExternalReference = ExternalReference;
    exports.FunctionExpr = FunctionExpr;
    exports.IfStmt = IfStmt;
    exports.InstantiateExpr = InstantiateExpr;
    exports.InvokeFunctionExpr = InvokeFunctionExpr;
    exports.InvokeMethodExpr = InvokeMethodExpr;
    exports.LiteralArrayExpr = LiteralArrayExpr;
    exports.LiteralExpr = LiteralExpr;
    exports.LiteralMapExpr = LiteralMapExpr;
    exports.NotExpr = NotExpr;
    exports.ReadKeyExpr = ReadKeyExpr;
    exports.ReadPropExpr = ReadPropExpr;
    exports.ReadVarExpr = ReadVarExpr;
    exports.ReturnStatement = ReturnStatement;
    exports.ThrowStmt = ThrowStmt;
    exports.TryCatchStmt = TryCatchStmt;
    exports.WriteKeyExpr = WriteKeyExpr;
    exports.WritePropExpr = WritePropExpr;
    exports.WriteVarExpr = WriteVarExpr;
    exports.StmtModifier = StmtModifier;
    exports.Statement = Statement;
    exports.collectExternalReferences = collectExternalReferences;
    exports.EmitterVisitorContext = EmitterVisitorContext;
    exports.ViewCompiler = ViewCompiler;
    exports.getParseErrors = getParseErrors;
    exports.isSyntaxError = isSyntaxError;
    exports.syntaxError = syntaxError;
    exports.Version = Version;
    exports.VERSION = VERSION;
    exports.TextAst = TextAst;
    exports.BoundTextAst = BoundTextAst;
    exports.AttrAst = AttrAst;
    exports.BoundElementPropertyAst = BoundElementPropertyAst;
    exports.BoundEventAst = BoundEventAst;
    exports.ReferenceAst = ReferenceAst;
    exports.VariableAst = VariableAst;
    exports.ElementAst = ElementAst;
    exports.EmbeddedTemplateAst = EmbeddedTemplateAst;
    exports.BoundDirectivePropertyAst = BoundDirectivePropertyAst;
    exports.DirectiveAst = DirectiveAst;
    exports.ProviderAst = ProviderAst;
    exports.ProviderAstType = ProviderAstType;
    exports.NgContentAst = NgContentAst;
    exports.PropertyBindingType = PropertyBindingType;
    exports.NullTemplateVisitor = NullTemplateVisitor;
    exports.RecursiveTemplateAstVisitor = RecursiveTemplateAstVisitor;
    exports.templateVisitAll = templateVisitAll;
    exports.identifierName = identifierName;
    exports.identifierModuleUrl = identifierModuleUrl;
    exports.viewClassName = viewClassName;
    exports.rendererTypeName = rendererTypeName;
    exports.hostViewClassName = hostViewClassName;
    exports.componentFactoryName = componentFactoryName;
    exports.CompileSummaryKind = CompileSummaryKind;
    exports.tokenName = tokenName;
    exports.tokenReference = tokenReference;
    exports.CompileStylesheetMetadata = CompileStylesheetMetadata;
    exports.CompileTemplateMetadata = CompileTemplateMetadata;
    exports.CompileDirectiveMetadata = CompileDirectiveMetadata;
    exports.CompilePipeMetadata = CompilePipeMetadata;
    exports.CompileNgModuleMetadata = CompileNgModuleMetadata;
    exports.TransitiveCompileNgModuleMetadata = TransitiveCompileNgModuleMetadata;
    exports.ProviderMeta = ProviderMeta;
    exports.flatten = flatten;
    exports.templateSourceUrl = templateSourceUrl;
    exports.sharedStylesheetJitUrl = sharedStylesheetJitUrl;
    exports.ngModuleJitUrl = ngModuleJitUrl;
    exports.templateJitUrl = templateJitUrl;
    exports.createAotUrlResolver = createAotUrlResolver;
    exports.createAotCompiler = createAotCompiler;
    exports.AotCompiler = AotCompiler;
    exports.analyzeNgModules = analyzeNgModules;
    exports.analyzeAndValidateNgModules = analyzeAndValidateNgModules;
    exports.analyzeFile = analyzeFile;
    exports.mergeAnalyzedFiles = mergeAnalyzedFiles;
    exports.GeneratedFile = GeneratedFile;
    exports.toTypeScript = toTypeScript;
    exports.formattedError = formattedError;
    exports.isFormattedError = isFormattedError;
    exports.StaticReflector = StaticReflector;
    exports.StaticSymbol = StaticSymbol;
    exports.StaticSymbolCache = StaticSymbolCache;
    exports.ResolvedStaticSymbol = ResolvedStaticSymbol;
    exports.StaticSymbolResolver = StaticSymbolResolver;
    exports.unescapeIdentifier = unescapeIdentifier;
    exports.unwrapResolvedMetadata = unwrapResolvedMetadata;
    exports.AotSummaryResolver = AotSummaryResolver;
    exports.AstPath = AstPath;
    exports.SummaryResolver = SummaryResolver;
    exports.JitSummaryResolver = JitSummaryResolver;
    exports.CompileReflector = CompileReflector;
    exports.createUrlResolverWithoutPackagePrefix = createUrlResolverWithoutPackagePrefix;
    exports.createOfflineCompileUrlResolver = createOfflineCompileUrlResolver;
    exports.UrlResolver = UrlResolver;
    exports.getUrlScheme = getUrlScheme;
    exports.ResourceLoader = ResourceLoader;
    exports.ElementSchemaRegistry = ElementSchemaRegistry;
    exports.Extractor = Extractor;
    exports.I18NHtmlParser = I18NHtmlParser;
    exports.MessageBundle = MessageBundle;
    exports.Serializer = Serializer;
    exports.Xliff = Xliff;
    exports.Xliff2 = Xliff2;
    exports.Xmb = Xmb;
    exports.Xtb = Xtb;
    exports.DirectiveNormalizer = DirectiveNormalizer;
    exports.ParserError = ParserError;
    exports.ParseSpan = ParseSpan;
    exports.AST = AST;
    exports.Quote = Quote;
    exports.EmptyExpr = EmptyExpr;
    exports.ImplicitReceiver = ImplicitReceiver;
    exports.Chain = Chain;
    exports.Conditional = Conditional;
    exports.PropertyRead = PropertyRead;
    exports.PropertyWrite = PropertyWrite;
    exports.SafePropertyRead = SafePropertyRead;
    exports.KeyedRead = KeyedRead;
    exports.KeyedWrite = KeyedWrite;
    exports.BindingPipe = BindingPipe;
    exports.LiteralPrimitive = LiteralPrimitive;
    exports.LiteralArray = LiteralArray;
    exports.LiteralMap = LiteralMap;
    exports.Interpolation = Interpolation;
    exports.Binary = Binary;
    exports.PrefixNot = PrefixNot;
    exports.NonNullAssert = NonNullAssert;
    exports.MethodCall = MethodCall;
    exports.SafeMethodCall = SafeMethodCall;
    exports.FunctionCall = FunctionCall;
    exports.ASTWithSource = ASTWithSource;
    exports.TemplateBinding = TemplateBinding;
    exports.NullAstVisitor = NullAstVisitor;
    exports.RecursiveAstVisitor = RecursiveAstVisitor;
    exports.AstTransformer = AstTransformer;
    exports.visitAstChildren = visitAstChildren;
    exports.TokenType = TokenType;
    exports.Lexer = Lexer;
    exports.Token = Token;
    exports.EOF = EOF;
    exports.isIdentifier = isIdentifier;
    exports.isQuote = isQuote;
    exports.SplitInterpolation = SplitInterpolation;
    exports.TemplateBindingParseResult = TemplateBindingParseResult;
    exports.Parser = Parser;
    exports._ParseAST = _ParseAST;
    exports.ERROR_COMPONENT_TYPE = ERROR_COMPONENT_TYPE;
    exports.CompileMetadataResolver = CompileMetadataResolver;
    exports.Text = Text;
    exports.Expansion = Expansion;
    exports.ExpansionCase = ExpansionCase;
    exports.Attribute = Attribute$1;
    exports.Element = Element;
    exports.Comment = Comment;
    exports.visitAll = visitAll;
    exports.RecursiveVisitor = RecursiveVisitor;
    exports.findNode = findNode;
    exports.ParseTreeResult = ParseTreeResult;
    exports.TreeError = TreeError;
    exports.HtmlParser = HtmlParser;
    exports.HtmlTagDefinition = HtmlTagDefinition;
    exports.getHtmlTagDefinition = getHtmlTagDefinition;
    exports.TagContentType = TagContentType;
    exports.splitNsName = splitNsName;
    exports.isNgContainer = isNgContainer;
    exports.isNgContent = isNgContent;
    exports.isNgTemplate = isNgTemplate;
    exports.getNsPrefix = getNsPrefix;
    exports.mergeNsAndName = mergeNsAndName;
    exports.NAMED_ENTITIES = NAMED_ENTITIES;
    exports.NGSP_UNICODE = NGSP_UNICODE;
    exports.debugOutputAstAsTypeScript = debugOutputAstAsTypeScript;
    exports.TypeScriptEmitter = TypeScriptEmitter;
    exports.ParseLocation = ParseLocation;
    exports.ParseSourceFile = ParseSourceFile;
    exports.ParseSourceSpan = ParseSourceSpan;
    exports.ParseErrorLevel = ParseErrorLevel;
    exports.ParseError = ParseError;
    exports.typeSourceSpan = typeSourceSpan;
    exports.DomElementSchemaRegistry = DomElementSchemaRegistry;
    exports.CssSelector = CssSelector;
    exports.SelectorMatcher = SelectorMatcher;
    exports.SelectorListContext = SelectorListContext;
    exports.SelectorContext = SelectorContext;
    exports.StylesCompileDependency = StylesCompileDependency;
    exports.CompiledStylesheet = CompiledStylesheet;
    exports.StyleCompiler = StyleCompiler;
    exports.TemplateParseError = TemplateParseError;
    exports.TemplateParseResult = TemplateParseResult;
    exports.TemplateParser = TemplateParser;
    exports.splitClasses = splitClasses;
    exports.createElementCssSelector = createElementCssSelector;
    exports.removeSummaryDuplicates = removeSummaryDuplicates;
    Object.defineProperty(exports, '__esModule', {value: true});
  })));
})(require('process'));
