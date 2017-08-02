/* */ 
"format cjs";
(function(process) {
  (function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common'), require('@angular/core'), require('rxjs/BehaviorSubject'), require('rxjs/Subject'), require('rxjs/observable/from'), require('rxjs/observable/of'), require('rxjs/operator/concatMap'), require('rxjs/operator/every'), require('rxjs/operator/first'), require('rxjs/operator/last'), require('rxjs/operator/map'), require('rxjs/operator/mergeMap'), require('rxjs/operator/reduce'), require('rxjs/Observable'), require('rxjs/operator/catch'), require('rxjs/operator/concatAll'), require('rxjs/util/EmptyError'), require('rxjs/observable/fromPromise'), require('rxjs/operator/mergeAll'), require('@angular/platform-browser'), require('rxjs/operator/filter')) : typeof define === 'function' && define.amd ? define(['exports', '@angular/common', '@angular/core', 'rxjs/BehaviorSubject', 'rxjs/Subject', 'rxjs/observable/from', 'rxjs/observable/of', 'rxjs/operator/concatMap', 'rxjs/operator/every', 'rxjs/operator/first', 'rxjs/operator/last', 'rxjs/operator/map', 'rxjs/operator/mergeMap', 'rxjs/operator/reduce', 'rxjs/Observable', 'rxjs/operator/catch', 'rxjs/operator/concatAll', 'rxjs/util/EmptyError', 'rxjs/observable/fromPromise', 'rxjs/operator/mergeAll', '@angular/platform-browser', 'rxjs/operator/filter'], factory) : (factory((global.ng = global.ng || {}, global.ng.router = global.ng.router || {}), global.ng.common, global.ng.core, global.Rx, global.Rx, global.Rx.Observable, global.Rx.Observable, global.Rx.Observable.prototype, global.Rx.Observable.prototype, global.Rx.Observable.prototype, global.Rx.Observable.prototype, global.Rx.Observable.prototype, global.Rx.Observable.prototype, global.Rx.Observable.prototype, global.Rx, global.Rx.Observable.prototype, global.Rx.Observable.prototype, global.Rx, global.Rx.Observable, global.Rx.Observable.prototype, global.ng.platformBrowser, global.Rx.Observable.prototype));
  }(this, (function(exports, _angular_common, _angular_core, rxjs_BehaviorSubject, rxjs_Subject, rxjs_observable_from, rxjs_observable_of, rxjs_operator_concatMap, rxjs_operator_every, rxjs_operator_first, rxjs_operator_last, rxjs_operator_map, rxjs_operator_mergeMap, rxjs_operator_reduce, rxjs_Observable, rxjs_operator_catch, rxjs_operator_concatAll, rxjs_util_EmptyError, rxjs_observable_fromPromise, rxjs_operator_mergeAll, _angular_platformBrowser, rxjs_operator_filter) {
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
    var NavigationStart = (function() {
      function NavigationStart(id, url) {
        this.id = id;
        this.url = url;
      }
      NavigationStart.prototype.toString = function() {
        return "NavigationStart(id: " + this.id + ", url: '" + this.url + "')";
      };
      return NavigationStart;
    }());
    var NavigationEnd = (function() {
      function NavigationEnd(id, url, urlAfterRedirects) {
        this.id = id;
        this.url = url;
        this.urlAfterRedirects = urlAfterRedirects;
      }
      NavigationEnd.prototype.toString = function() {
        return "NavigationEnd(id: " + this.id + ", url: '" + this.url + "', urlAfterRedirects: '" + this.urlAfterRedirects + "')";
      };
      return NavigationEnd;
    }());
    var NavigationCancel = (function() {
      function NavigationCancel(id, url, reason) {
        this.id = id;
        this.url = url;
        this.reason = reason;
      }
      NavigationCancel.prototype.toString = function() {
        return "NavigationCancel(id: " + this.id + ", url: '" + this.url + "')";
      };
      return NavigationCancel;
    }());
    var NavigationError = (function() {
      function NavigationError(id, url, error) {
        this.id = id;
        this.url = url;
        this.error = error;
      }
      NavigationError.prototype.toString = function() {
        return "NavigationError(id: " + this.id + ", url: '" + this.url + "', error: " + this.error + ")";
      };
      return NavigationError;
    }());
    var RoutesRecognized = (function() {
      function RoutesRecognized(id, url, urlAfterRedirects, state) {
        this.id = id;
        this.url = url;
        this.urlAfterRedirects = urlAfterRedirects;
        this.state = state;
      }
      RoutesRecognized.prototype.toString = function() {
        return "RoutesRecognized(id: " + this.id + ", url: '" + this.url + "', urlAfterRedirects: '" + this.urlAfterRedirects + "', state: " + this.state + ")";
      };
      return RoutesRecognized;
    }());
    var RouteConfigLoadStart = (function() {
      function RouteConfigLoadStart(route) {
        this.route = route;
      }
      RouteConfigLoadStart.prototype.toString = function() {
        return "RouteConfigLoadStart(path: " + this.route.path + ")";
      };
      return RouteConfigLoadStart;
    }());
    var RouteConfigLoadEnd = (function() {
      function RouteConfigLoadEnd(route) {
        this.route = route;
      }
      RouteConfigLoadEnd.prototype.toString = function() {
        return "RouteConfigLoadEnd(path: " + this.route.path + ")";
      };
      return RouteConfigLoadEnd;
    }());
    var GuardsCheckStart = (function() {
      function GuardsCheckStart(id, url, urlAfterRedirects, state) {
        this.id = id;
        this.url = url;
        this.urlAfterRedirects = urlAfterRedirects;
        this.state = state;
      }
      GuardsCheckStart.prototype.toString = function() {
        return "GuardsCheckStart(id: " + this.id + ", url: '" + this.url + "', urlAfterRedirects: '" + this.urlAfterRedirects + "', state: " + this.state + ")";
      };
      return GuardsCheckStart;
    }());
    var GuardsCheckEnd = (function() {
      function GuardsCheckEnd(id, url, urlAfterRedirects, state, shouldActivate) {
        this.id = id;
        this.url = url;
        this.urlAfterRedirects = urlAfterRedirects;
        this.state = state;
        this.shouldActivate = shouldActivate;
      }
      GuardsCheckEnd.prototype.toString = function() {
        return "GuardsCheckEnd(id: " + this.id + ", url: '" + this.url + "', urlAfterRedirects: '" + this.urlAfterRedirects + "', state: " + this.state + ", shouldActivate: " + this.shouldActivate + ")";
      };
      return GuardsCheckEnd;
    }());
    var ResolveStart = (function() {
      function ResolveStart(id, url, urlAfterRedirects, state) {
        this.id = id;
        this.url = url;
        this.urlAfterRedirects = urlAfterRedirects;
        this.state = state;
      }
      ResolveStart.prototype.toString = function() {
        return "ResolveStart(id: " + this.id + ", url: '" + this.url + "', urlAfterRedirects: '" + this.urlAfterRedirects + "', state: " + this.state + ")";
      };
      return ResolveStart;
    }());
    var ResolveEnd = (function() {
      function ResolveEnd(id, url, urlAfterRedirects, state) {
        this.id = id;
        this.url = url;
        this.urlAfterRedirects = urlAfterRedirects;
        this.state = state;
      }
      ResolveEnd.prototype.toString = function() {
        return "ResolveEnd(id: " + this.id + ", url: '" + this.url + "', urlAfterRedirects: '" + this.urlAfterRedirects + "', state: " + this.state + ")";
      };
      return ResolveEnd;
    }());
    var PRIMARY_OUTLET = 'primary';
    var ParamsAsMap = (function() {
      function ParamsAsMap(params) {
        this.params = params || {};
      }
      ParamsAsMap.prototype.has = function(name) {
        return this.params.hasOwnProperty(name);
      };
      ParamsAsMap.prototype.get = function(name) {
        if (this.has(name)) {
          var v = this.params[name];
          return Array.isArray(v) ? v[0] : v;
        }
        return null;
      };
      ParamsAsMap.prototype.getAll = function(name) {
        if (this.has(name)) {
          var v = this.params[name];
          return Array.isArray(v) ? v : [v];
        }
        return [];
      };
      Object.defineProperty(ParamsAsMap.prototype, "keys", {
        get: function() {
          return Object.keys(this.params);
        },
        enumerable: true,
        configurable: true
      });
      return ParamsAsMap;
    }());
    function convertToParamMap(params) {
      return new ParamsAsMap(params);
    }
    var NAVIGATION_CANCELING_ERROR = 'ngNavigationCancelingError';
    function navigationCancelingError(message) {
      var error = Error('NavigationCancelingError: ' + message);
      ((error))[NAVIGATION_CANCELING_ERROR] = true;
      return error;
    }
    function isNavigationCancelingError(error) {
      return ((error))[NAVIGATION_CANCELING_ERROR];
    }
    function defaultUrlMatcher(segments, segmentGroup, route) {
      var parts = ((route.path)).split('/');
      if (parts.length > segments.length) {
        return null;
      }
      if (route.pathMatch === 'full' && (segmentGroup.hasChildren() || parts.length < segments.length)) {
        return null;
      }
      var posParams = {};
      for (var index = 0; index < parts.length; index++) {
        var part = parts[index];
        var segment = segments[index];
        var isParameter = part.startsWith(':');
        if (isParameter) {
          posParams[part.substring(1)] = segment;
        } else if (part !== segment.path) {
          return null;
        }
      }
      return {
        consumed: segments.slice(0, parts.length),
        posParams: posParams
      };
    }
    var LoadedRouterConfig = (function() {
      function LoadedRouterConfig(routes, module) {
        this.routes = routes;
        this.module = module;
      }
      return LoadedRouterConfig;
    }());
    function validateConfig(config, parentPath) {
      if (parentPath === void 0) {
        parentPath = '';
      }
      for (var i = 0; i < config.length; i++) {
        var route = config[i];
        var fullPath = getFullPath(parentPath, route);
        validateNode(route, fullPath);
      }
    }
    function validateNode(route, fullPath) {
      if (!route) {
        throw new Error("\n      Invalid configuration of route '" + fullPath + "': Encountered undefined route.\n      The reason might be an extra comma.\n\n      Example:\n      const routes: Routes = [\n        { path: '', redirectTo: '/dashboard', pathMatch: 'full' },\n        { path: 'dashboard',  component: DashboardComponent },, << two commas\n        { path: 'detail/:id', component: HeroDetailComponent }\n      ];\n    ");
      }
      if (Array.isArray(route)) {
        throw new Error("Invalid configuration of route '" + fullPath + "': Array cannot be specified");
      }
      if (!route.component && (route.outlet && route.outlet !== PRIMARY_OUTLET)) {
        throw new Error("Invalid configuration of route '" + fullPath + "': a componentless route cannot have a named outlet set");
      }
      if (route.redirectTo && route.children) {
        throw new Error("Invalid configuration of route '" + fullPath + "': redirectTo and children cannot be used together");
      }
      if (route.redirectTo && route.loadChildren) {
        throw new Error("Invalid configuration of route '" + fullPath + "': redirectTo and loadChildren cannot be used together");
      }
      if (route.children && route.loadChildren) {
        throw new Error("Invalid configuration of route '" + fullPath + "': children and loadChildren cannot be used together");
      }
      if (route.redirectTo && route.component) {
        throw new Error("Invalid configuration of route '" + fullPath + "': redirectTo and component cannot be used together");
      }
      if (route.path && route.matcher) {
        throw new Error("Invalid configuration of route '" + fullPath + "': path and matcher cannot be used together");
      }
      if (route.redirectTo === void 0 && !route.component && !route.children && !route.loadChildren) {
        throw new Error("Invalid configuration of route '" + fullPath + "'. One of the following must be provided: component, redirectTo, children or loadChildren");
      }
      if (route.path === void 0 && route.matcher === void 0) {
        throw new Error("Invalid configuration of route '" + fullPath + "': routes must have either a path or a matcher specified");
      }
      if (typeof route.path === 'string' && route.path.charAt(0) === '/') {
        throw new Error("Invalid configuration of route '" + fullPath + "': path cannot start with a slash");
      }
      if (route.path === '' && route.redirectTo !== void 0 && route.pathMatch === void 0) {
        var exp = "The default value of 'pathMatch' is 'prefix', but often the intent is to use 'full'.";
        throw new Error("Invalid configuration of route '{path: \"" + fullPath + "\", redirectTo: \"" + route.redirectTo + "\"}': please provide 'pathMatch'. " + exp);
      }
      if (route.pathMatch !== void 0 && route.pathMatch !== 'full' && route.pathMatch !== 'prefix') {
        throw new Error("Invalid configuration of route '" + fullPath + "': pathMatch can only be set to 'prefix' or 'full'");
      }
      if (route.children) {
        validateConfig(route.children, fullPath);
      }
    }
    function getFullPath(parentPath, currentRoute) {
      if (!currentRoute) {
        return parentPath;
      }
      if (!parentPath && !currentRoute.path) {
        return '';
      } else if (parentPath && !currentRoute.path) {
        return parentPath + "/";
      } else if (!parentPath && currentRoute.path) {
        return currentRoute.path;
      } else {
        return parentPath + "/" + currentRoute.path;
      }
    }
    function shallowEqualArrays(a, b) {
      if (a.length !== b.length)
        return false;
      for (var i = 0; i < a.length; ++i) {
        if (!shallowEqual(a[i], b[i]))
          return false;
      }
      return true;
    }
    function shallowEqual(a, b) {
      var k1 = Object.keys(a);
      var k2 = Object.keys(b);
      if (k1.length != k2.length) {
        return false;
      }
      var key;
      for (var i = 0; i < k1.length; i++) {
        key = k1[i];
        if (a[key] !== b[key]) {
          return false;
        }
      }
      return true;
    }
    function flatten(arr) {
      return Array.prototype.concat.apply([], arr);
    }
    function last$1(a) {
      return a.length > 0 ? a[a.length - 1] : null;
    }
    function forEach(map$$1, callback) {
      for (var prop in map$$1) {
        if (map$$1.hasOwnProperty(prop)) {
          callback(map$$1[prop], prop);
        }
      }
    }
    function waitForMap(obj, fn) {
      if (Object.keys(obj).length === 0) {
        return rxjs_observable_of.of({});
      }
      var waitHead = [];
      var waitTail = [];
      var res = {};
      forEach(obj, function(a, k) {
        var mapped = rxjs_operator_map.map.call(fn(k, a), function(r) {
          return res[k] = r;
        });
        if (k === PRIMARY_OUTLET) {
          waitHead.push(mapped);
        } else {
          waitTail.push(mapped);
        }
      });
      var concat$ = rxjs_operator_concatAll.concatAll.call(rxjs_observable_of.of.apply(void 0, waitHead.concat(waitTail)));
      var last$ = rxjs_operator_last.last.call(concat$);
      return rxjs_operator_map.map.call(last$, function() {
        return res;
      });
    }
    function andObservables(observables) {
      var merged$ = rxjs_operator_mergeAll.mergeAll.call(observables);
      return rxjs_operator_every.every.call(merged$, function(result) {
        return result === true;
      });
    }
    function wrapIntoObservable(value) {
      if (_angular_core.ɵisObservable(value)) {
        return value;
      }
      if (_angular_core.ɵisPromise(value)) {
        return rxjs_observable_fromPromise.fromPromise(Promise.resolve(value));
      }
      return rxjs_observable_of.of(value);
    }
    function createEmptyUrlTree() {
      return new UrlTree(new UrlSegmentGroup([], {}), {}, null);
    }
    function containsTree(container, containee, exact) {
      if (exact) {
        return equalQueryParams(container.queryParams, containee.queryParams) && equalSegmentGroups(container.root, containee.root);
      }
      return containsQueryParams(container.queryParams, containee.queryParams) && containsSegmentGroup(container.root, containee.root);
    }
    function equalQueryParams(container, containee) {
      return shallowEqual(container, containee);
    }
    function equalSegmentGroups(container, containee) {
      if (!equalPath(container.segments, containee.segments))
        return false;
      if (container.numberOfChildren !== containee.numberOfChildren)
        return false;
      for (var c in containee.children) {
        if (!container.children[c])
          return false;
        if (!equalSegmentGroups(container.children[c], containee.children[c]))
          return false;
      }
      return true;
    }
    function containsQueryParams(container, containee) {
      return Object.keys(containee).length <= Object.keys(container).length && Object.keys(containee).every(function(key) {
        return containee[key] === container[key];
      });
    }
    function containsSegmentGroup(container, containee) {
      return containsSegmentGroupHelper(container, containee, containee.segments);
    }
    function containsSegmentGroupHelper(container, containee, containeePaths) {
      if (container.segments.length > containeePaths.length) {
        var current = container.segments.slice(0, containeePaths.length);
        if (!equalPath(current, containeePaths))
          return false;
        if (containee.hasChildren())
          return false;
        return true;
      } else if (container.segments.length === containeePaths.length) {
        if (!equalPath(container.segments, containeePaths))
          return false;
        for (var c in containee.children) {
          if (!container.children[c])
            return false;
          if (!containsSegmentGroup(container.children[c], containee.children[c]))
            return false;
        }
        return true;
      } else {
        var current = containeePaths.slice(0, container.segments.length);
        var next = containeePaths.slice(container.segments.length);
        if (!equalPath(container.segments, current))
          return false;
        if (!container.children[PRIMARY_OUTLET])
          return false;
        return containsSegmentGroupHelper(container.children[PRIMARY_OUTLET], containee, next);
      }
    }
    var UrlTree = (function() {
      function UrlTree(root, queryParams, fragment) {
        this.root = root;
        this.queryParams = queryParams;
        this.fragment = fragment;
      }
      Object.defineProperty(UrlTree.prototype, "queryParamMap", {
        get: function() {
          if (!this._queryParamMap) {
            this._queryParamMap = convertToParamMap(this.queryParams);
          }
          return this._queryParamMap;
        },
        enumerable: true,
        configurable: true
      });
      UrlTree.prototype.toString = function() {
        return DEFAULT_SERIALIZER.serialize(this);
      };
      return UrlTree;
    }());
    var UrlSegmentGroup = (function() {
      function UrlSegmentGroup(segments, children) {
        var _this = this;
        this.segments = segments;
        this.children = children;
        this.parent = null;
        forEach(children, function(v, k) {
          return v.parent = _this;
        });
      }
      UrlSegmentGroup.prototype.hasChildren = function() {
        return this.numberOfChildren > 0;
      };
      Object.defineProperty(UrlSegmentGroup.prototype, "numberOfChildren", {
        get: function() {
          return Object.keys(this.children).length;
        },
        enumerable: true,
        configurable: true
      });
      UrlSegmentGroup.prototype.toString = function() {
        return serializePaths(this);
      };
      return UrlSegmentGroup;
    }());
    var UrlSegment = (function() {
      function UrlSegment(path, parameters) {
        this.path = path;
        this.parameters = parameters;
      }
      Object.defineProperty(UrlSegment.prototype, "parameterMap", {
        get: function() {
          if (!this._parameterMap) {
            this._parameterMap = convertToParamMap(this.parameters);
          }
          return this._parameterMap;
        },
        enumerable: true,
        configurable: true
      });
      UrlSegment.prototype.toString = function() {
        return serializePath(this);
      };
      return UrlSegment;
    }());
    function equalSegments(as, bs) {
      return equalPath(as, bs) && as.every(function(a, i) {
        return shallowEqual(a.parameters, bs[i].parameters);
      });
    }
    function equalPath(as, bs) {
      if (as.length !== bs.length)
        return false;
      return as.every(function(a, i) {
        return a.path === bs[i].path;
      });
    }
    function mapChildrenIntoArray(segment, fn) {
      var res = [];
      forEach(segment.children, function(child, childOutlet) {
        if (childOutlet === PRIMARY_OUTLET) {
          res = res.concat(fn(child, childOutlet));
        }
      });
      forEach(segment.children, function(child, childOutlet) {
        if (childOutlet !== PRIMARY_OUTLET) {
          res = res.concat(fn(child, childOutlet));
        }
      });
      return res;
    }
    var UrlSerializer = (function() {
      function UrlSerializer() {}
      UrlSerializer.prototype.parse = function(url) {};
      UrlSerializer.prototype.serialize = function(tree) {};
      return UrlSerializer;
    }());
    var DefaultUrlSerializer = (function() {
      function DefaultUrlSerializer() {}
      DefaultUrlSerializer.prototype.parse = function(url) {
        var p = new UrlParser(url);
        return new UrlTree(p.parseRootSegment(), p.parseQueryParams(), p.parseFragment());
      };
      DefaultUrlSerializer.prototype.serialize = function(tree) {
        var segment = "/" + serializeSegment(tree.root, true);
        var query = serializeQueryParams(tree.queryParams);
        var fragment = typeof tree.fragment === "string" ? "#" + encodeURI(((tree.fragment))) : '';
        return "" + segment + query + fragment;
      };
      return DefaultUrlSerializer;
    }());
    var DEFAULT_SERIALIZER = new DefaultUrlSerializer();
    function serializePaths(segment) {
      return segment.segments.map(function(p) {
        return serializePath(p);
      }).join('/');
    }
    function serializeSegment(segment, root) {
      if (!segment.hasChildren()) {
        return serializePaths(segment);
      }
      if (root) {
        var primary = segment.children[PRIMARY_OUTLET] ? serializeSegment(segment.children[PRIMARY_OUTLET], false) : '';
        var children_1 = [];
        forEach(segment.children, function(v, k) {
          if (k !== PRIMARY_OUTLET) {
            children_1.push(k + ":" + serializeSegment(v, false));
          }
        });
        return children_1.length > 0 ? primary + "(" + children_1.join('//') + ")" : primary;
      } else {
        var children = mapChildrenIntoArray(segment, function(v, k) {
          if (k === PRIMARY_OUTLET) {
            return [serializeSegment(segment.children[PRIMARY_OUTLET], false)];
          }
          return [k + ":" + serializeSegment(v, false)];
        });
        return serializePaths(segment) + "/(" + children.join('//') + ")";
      }
    }
    function encode(s) {
      return encodeURIComponent(s).replace(/%40/g, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%3B/gi, ';');
    }
    function decode(s) {
      return decodeURIComponent(s);
    }
    function serializePath(path) {
      return "" + encode(path.path) + serializeParams(path.parameters);
    }
    function serializeParams(params) {
      return Object.keys(params).map(function(key) {
        return ";" + encode(key) + "=" + encode(params[key]);
      }).join('');
    }
    function serializeQueryParams(params) {
      var strParams = Object.keys(params).map(function(name) {
        var value = params[name];
        return Array.isArray(value) ? value.map(function(v) {
          return encode(name) + "=" + encode(v);
        }).join('&') : encode(name) + "=" + encode(value);
      });
      return strParams.length ? "?" + strParams.join("&") : '';
    }
    var SEGMENT_RE = /^[^\/()?;=&#]+/;
    function matchSegments(str) {
      var match = str.match(SEGMENT_RE);
      return match ? match[0] : '';
    }
    var QUERY_PARAM_RE = /^[^=?&#]+/;
    function matchQueryParams(str) {
      var match = str.match(QUERY_PARAM_RE);
      return match ? match[0] : '';
    }
    var QUERY_PARAM_VALUE_RE = /^[^?&#]+/;
    function matchUrlQueryParamValue(str) {
      var match = str.match(QUERY_PARAM_VALUE_RE);
      return match ? match[0] : '';
    }
    var UrlParser = (function() {
      function UrlParser(url) {
        this.url = url;
        this.remaining = url;
      }
      UrlParser.prototype.parseRootSegment = function() {
        this.consumeOptional('/');
        if (this.remaining === '' || this.peekStartsWith('?') || this.peekStartsWith('#')) {
          return new UrlSegmentGroup([], {});
        }
        return new UrlSegmentGroup([], this.parseChildren());
      };
      UrlParser.prototype.parseQueryParams = function() {
        var params = {};
        if (this.consumeOptional('?')) {
          do {
            this.parseQueryParam(params);
          } while (this.consumeOptional('&'));
        }
        return params;
      };
      UrlParser.prototype.parseFragment = function() {
        return this.consumeOptional('#') ? decodeURI(this.remaining) : null;
      };
      UrlParser.prototype.parseChildren = function() {
        if (this.remaining === '') {
          return {};
        }
        this.consumeOptional('/');
        var segments = [];
        if (!this.peekStartsWith('(')) {
          segments.push(this.parseSegment());
        }
        while (this.peekStartsWith('/') && !this.peekStartsWith('//') && !this.peekStartsWith('/(')) {
          this.capture('/');
          segments.push(this.parseSegment());
        }
        var children = {};
        if (this.peekStartsWith('/(')) {
          this.capture('/');
          children = this.parseParens(true);
        }
        var res = {};
        if (this.peekStartsWith('(')) {
          res = this.parseParens(false);
        }
        if (segments.length > 0 || Object.keys(children).length > 0) {
          res[PRIMARY_OUTLET] = new UrlSegmentGroup(segments, children);
        }
        return res;
      };
      UrlParser.prototype.parseSegment = function() {
        var path = matchSegments(this.remaining);
        if (path === '' && this.peekStartsWith(';')) {
          throw new Error("Empty path url segment cannot have parameters: '" + this.remaining + "'.");
        }
        this.capture(path);
        return new UrlSegment(decode(path), this.parseMatrixParams());
      };
      UrlParser.prototype.parseMatrixParams = function() {
        var params = {};
        while (this.consumeOptional(';')) {
          this.parseParam(params);
        }
        return params;
      };
      UrlParser.prototype.parseParam = function(params) {
        var key = matchSegments(this.remaining);
        if (!key) {
          return;
        }
        this.capture(key);
        var value = '';
        if (this.consumeOptional('=')) {
          var valueMatch = matchSegments(this.remaining);
          if (valueMatch) {
            value = valueMatch;
            this.capture(value);
          }
        }
        params[decode(key)] = decode(value);
      };
      UrlParser.prototype.parseQueryParam = function(params) {
        var key = matchQueryParams(this.remaining);
        if (!key) {
          return;
        }
        this.capture(key);
        var value = '';
        if (this.consumeOptional('=')) {
          var valueMatch = matchUrlQueryParamValue(this.remaining);
          if (valueMatch) {
            value = valueMatch;
            this.capture(value);
          }
        }
        var decodedKey = decode(key);
        var decodedVal = decode(value);
        if (params.hasOwnProperty(decodedKey)) {
          var currentVal = params[decodedKey];
          if (!Array.isArray(currentVal)) {
            currentVal = [currentVal];
            params[decodedKey] = currentVal;
          }
          currentVal.push(decodedVal);
        } else {
          params[decodedKey] = decodedVal;
        }
      };
      UrlParser.prototype.parseParens = function(allowPrimary) {
        var segments = {};
        this.capture('(');
        while (!this.consumeOptional(')') && this.remaining.length > 0) {
          var path = matchSegments(this.remaining);
          var next = this.remaining[path.length];
          if (next !== '/' && next !== ')' && next !== ';') {
            throw new Error("Cannot parse url '" + this.url + "'");
          }
          var outletName = ((undefined));
          if (path.indexOf(':') > -1) {
            outletName = path.substr(0, path.indexOf(':'));
            this.capture(outletName);
            this.capture(':');
          } else if (allowPrimary) {
            outletName = PRIMARY_OUTLET;
          }
          var children = this.parseChildren();
          segments[outletName] = Object.keys(children).length === 1 ? children[PRIMARY_OUTLET] : new UrlSegmentGroup([], children);
          this.consumeOptional('//');
        }
        return segments;
      };
      UrlParser.prototype.peekStartsWith = function(str) {
        return this.remaining.startsWith(str);
      };
      UrlParser.prototype.consumeOptional = function(str) {
        if (this.peekStartsWith(str)) {
          this.remaining = this.remaining.substring(str.length);
          return true;
        }
        return false;
      };
      UrlParser.prototype.capture = function(str) {
        if (!this.consumeOptional(str)) {
          throw new Error("Expected \"" + str + "\".");
        }
      };
      return UrlParser;
    }());
    var NoMatch = (function() {
      function NoMatch(segmentGroup) {
        this.segmentGroup = segmentGroup || null;
      }
      return NoMatch;
    }());
    var AbsoluteRedirect = (function() {
      function AbsoluteRedirect(urlTree) {
        this.urlTree = urlTree;
      }
      return AbsoluteRedirect;
    }());
    function noMatch(segmentGroup) {
      return new rxjs_Observable.Observable(function(obs) {
        return obs.error(new NoMatch(segmentGroup));
      });
    }
    function absoluteRedirect(newTree) {
      return new rxjs_Observable.Observable(function(obs) {
        return obs.error(new AbsoluteRedirect(newTree));
      });
    }
    function namedOutletsRedirect(redirectTo) {
      return new rxjs_Observable.Observable(function(obs) {
        return obs.error(new Error("Only absolute redirects can have named outlets. redirectTo: '" + redirectTo + "'"));
      });
    }
    function canLoadFails(route) {
      return new rxjs_Observable.Observable(function(obs) {
        return obs.error(navigationCancelingError("Cannot load children because the guard of the route \"path: '" + route.path + "'\" returned false"));
      });
    }
    function applyRedirects(moduleInjector, configLoader, urlSerializer, urlTree, config) {
      return new ApplyRedirects(moduleInjector, configLoader, urlSerializer, urlTree, config).apply();
    }
    var ApplyRedirects = (function() {
      function ApplyRedirects(moduleInjector, configLoader, urlSerializer, urlTree, config) {
        this.configLoader = configLoader;
        this.urlSerializer = urlSerializer;
        this.urlTree = urlTree;
        this.config = config;
        this.allowRedirects = true;
        this.ngModule = moduleInjector.get(_angular_core.NgModuleRef);
      }
      ApplyRedirects.prototype.apply = function() {
        var _this = this;
        var expanded$ = this.expandSegmentGroup(this.ngModule, this.config, this.urlTree.root, PRIMARY_OUTLET);
        var urlTrees$ = rxjs_operator_map.map.call(expanded$, function(rootSegmentGroup) {
          return _this.createUrlTree(rootSegmentGroup, _this.urlTree.queryParams, ((_this.urlTree.fragment)));
        });
        return rxjs_operator_catch._catch.call(urlTrees$, function(e) {
          if (e instanceof AbsoluteRedirect) {
            _this.allowRedirects = false;
            return _this.match(e.urlTree);
          }
          if (e instanceof NoMatch) {
            throw _this.noMatchError(e);
          }
          throw e;
        });
      };
      ApplyRedirects.prototype.match = function(tree) {
        var _this = this;
        var expanded$ = this.expandSegmentGroup(this.ngModule, this.config, tree.root, PRIMARY_OUTLET);
        var mapped$ = rxjs_operator_map.map.call(expanded$, function(rootSegmentGroup) {
          return _this.createUrlTree(rootSegmentGroup, tree.queryParams, ((tree.fragment)));
        });
        return rxjs_operator_catch._catch.call(mapped$, function(e) {
          if (e instanceof NoMatch) {
            throw _this.noMatchError(e);
          }
          throw e;
        });
      };
      ApplyRedirects.prototype.noMatchError = function(e) {
        return new Error("Cannot match any routes. URL Segment: '" + e.segmentGroup + "'");
      };
      ApplyRedirects.prototype.createUrlTree = function(rootCandidate, queryParams, fragment) {
        var root = rootCandidate.segments.length > 0 ? new UrlSegmentGroup([], (_a = {}, _a[PRIMARY_OUTLET] = rootCandidate, _a)) : rootCandidate;
        return new UrlTree(root, queryParams, fragment);
        var _a;
      };
      ApplyRedirects.prototype.expandSegmentGroup = function(ngModule, routes, segmentGroup, outlet) {
        if (segmentGroup.segments.length === 0 && segmentGroup.hasChildren()) {
          return rxjs_operator_map.map.call(this.expandChildren(ngModule, routes, segmentGroup), function(children) {
            return new UrlSegmentGroup([], children);
          });
        }
        return this.expandSegment(ngModule, segmentGroup, routes, segmentGroup.segments, outlet, true);
      };
      ApplyRedirects.prototype.expandChildren = function(ngModule, routes, segmentGroup) {
        var _this = this;
        return waitForMap(segmentGroup.children, function(childOutlet, child) {
          return _this.expandSegmentGroup(ngModule, routes, child, childOutlet);
        });
      };
      ApplyRedirects.prototype.expandSegment = function(ngModule, segmentGroup, routes, segments, outlet, allowRedirects) {
        var _this = this;
        var routes$ = rxjs_observable_of.of.apply(void 0, routes);
        var processedRoutes$ = rxjs_operator_map.map.call(routes$, function(r) {
          var expanded$ = _this.expandSegmentAgainstRoute(ngModule, segmentGroup, routes, r, segments, outlet, allowRedirects);
          return rxjs_operator_catch._catch.call(expanded$, function(e) {
            if (e instanceof NoMatch) {
              return rxjs_observable_of.of(null);
            }
            throw e;
          });
        });
        var concattedProcessedRoutes$ = rxjs_operator_concatAll.concatAll.call(processedRoutes$);
        var first$ = rxjs_operator_first.first.call(concattedProcessedRoutes$, function(s) {
          return !!s;
        });
        return rxjs_operator_catch._catch.call(first$, function(e, _) {
          if (e instanceof rxjs_util_EmptyError.EmptyError) {
            if (_this.noLeftoversInUrl(segmentGroup, segments, outlet)) {
              return rxjs_observable_of.of(new UrlSegmentGroup([], {}));
            }
            throw new NoMatch(segmentGroup);
          }
          throw e;
        });
      };
      ApplyRedirects.prototype.noLeftoversInUrl = function(segmentGroup, segments, outlet) {
        return segments.length === 0 && !segmentGroup.children[outlet];
      };
      ApplyRedirects.prototype.expandSegmentAgainstRoute = function(ngModule, segmentGroup, routes, route, paths, outlet, allowRedirects) {
        if (getOutlet(route) !== outlet) {
          return noMatch(segmentGroup);
        }
        if (route.redirectTo === undefined) {
          return this.matchSegmentAgainstRoute(ngModule, segmentGroup, route, paths);
        }
        if (allowRedirects && this.allowRedirects) {
          return this.expandSegmentAgainstRouteUsingRedirect(ngModule, segmentGroup, routes, route, paths, outlet);
        }
        return noMatch(segmentGroup);
      };
      ApplyRedirects.prototype.expandSegmentAgainstRouteUsingRedirect = function(ngModule, segmentGroup, routes, route, segments, outlet) {
        if (route.path === '**') {
          return this.expandWildCardWithParamsAgainstRouteUsingRedirect(ngModule, routes, route, outlet);
        }
        return this.expandRegularSegmentAgainstRouteUsingRedirect(ngModule, segmentGroup, routes, route, segments, outlet);
      };
      ApplyRedirects.prototype.expandWildCardWithParamsAgainstRouteUsingRedirect = function(ngModule, routes, route, outlet) {
        var _this = this;
        var newTree = this.applyRedirectCommands([], ((route.redirectTo)), {});
        if (((route.redirectTo)).startsWith('/')) {
          return absoluteRedirect(newTree);
        }
        return rxjs_operator_mergeMap.mergeMap.call(this.lineralizeSegments(route, newTree), function(newSegments) {
          var group = new UrlSegmentGroup(newSegments, {});
          return _this.expandSegment(ngModule, group, routes, newSegments, outlet, false);
        });
      };
      ApplyRedirects.prototype.expandRegularSegmentAgainstRouteUsingRedirect = function(ngModule, segmentGroup, routes, route, segments, outlet) {
        var _this = this;
        var _a = match(segmentGroup, route, segments),
            matched = _a.matched,
            consumedSegments = _a.consumedSegments,
            lastChild = _a.lastChild,
            positionalParamSegments = _a.positionalParamSegments;
        if (!matched)
          return noMatch(segmentGroup);
        var newTree = this.applyRedirectCommands(consumedSegments, ((route.redirectTo)), (positionalParamSegments));
        if (((route.redirectTo)).startsWith('/')) {
          return absoluteRedirect(newTree);
        }
        return rxjs_operator_mergeMap.mergeMap.call(this.lineralizeSegments(route, newTree), function(newSegments) {
          return _this.expandSegment(ngModule, segmentGroup, routes, newSegments.concat(segments.slice(lastChild)), outlet, false);
        });
      };
      ApplyRedirects.prototype.matchSegmentAgainstRoute = function(ngModule, rawSegmentGroup, route, segments) {
        var _this = this;
        if (route.path === '**') {
          if (route.loadChildren) {
            return rxjs_operator_map.map.call(this.configLoader.load(ngModule.injector, route), function(cfg) {
              route._loadedConfig = cfg;
              return new UrlSegmentGroup(segments, {});
            });
          }
          return rxjs_observable_of.of(new UrlSegmentGroup(segments, {}));
        }
        var _a = match(rawSegmentGroup, route, segments),
            matched = _a.matched,
            consumedSegments = _a.consumedSegments,
            lastChild = _a.lastChild;
        if (!matched)
          return noMatch(rawSegmentGroup);
        var rawSlicedSegments = segments.slice(lastChild);
        var childConfig$ = this.getChildConfig(ngModule, route);
        return rxjs_operator_mergeMap.mergeMap.call(childConfig$, function(routerConfig) {
          var childModule = routerConfig.module;
          var childConfig = routerConfig.routes;
          var _a = split(rawSegmentGroup, consumedSegments, rawSlicedSegments, childConfig),
              segmentGroup = _a.segmentGroup,
              slicedSegments = _a.slicedSegments;
          if (slicedSegments.length === 0 && segmentGroup.hasChildren()) {
            var expanded$_1 = _this.expandChildren(childModule, childConfig, segmentGroup);
            return rxjs_operator_map.map.call(expanded$_1, function(children) {
              return new UrlSegmentGroup(consumedSegments, children);
            });
          }
          if (childConfig.length === 0 && slicedSegments.length === 0) {
            return rxjs_observable_of.of(new UrlSegmentGroup(consumedSegments, {}));
          }
          var expanded$ = _this.expandSegment(childModule, segmentGroup, childConfig, slicedSegments, PRIMARY_OUTLET, true);
          return rxjs_operator_map.map.call(expanded$, function(cs) {
            return new UrlSegmentGroup(consumedSegments.concat(cs.segments), cs.children);
          });
        });
      };
      ApplyRedirects.prototype.getChildConfig = function(ngModule, route) {
        var _this = this;
        if (route.children) {
          return rxjs_observable_of.of(new LoadedRouterConfig(route.children, ngModule));
        }
        if (route.loadChildren) {
          if (route._loadedConfig !== undefined) {
            return rxjs_observable_of.of(route._loadedConfig);
          }
          return rxjs_operator_mergeMap.mergeMap.call(runCanLoadGuard(ngModule.injector, route), function(shouldLoad) {
            if (shouldLoad) {
              return rxjs_operator_map.map.call(_this.configLoader.load(ngModule.injector, route), function(cfg) {
                route._loadedConfig = cfg;
                return cfg;
              });
            }
            return canLoadFails(route);
          });
        }
        return rxjs_observable_of.of(new LoadedRouterConfig([], ngModule));
      };
      ApplyRedirects.prototype.lineralizeSegments = function(route, urlTree) {
        var res = [];
        var c = urlTree.root;
        while (true) {
          res = res.concat(c.segments);
          if (c.numberOfChildren === 0) {
            return rxjs_observable_of.of(res);
          }
          if (c.numberOfChildren > 1 || !c.children[PRIMARY_OUTLET]) {
            return namedOutletsRedirect(((route.redirectTo)));
          }
          c = c.children[PRIMARY_OUTLET];
        }
      };
      ApplyRedirects.prototype.applyRedirectCommands = function(segments, redirectTo, posParams) {
        return this.applyRedirectCreatreUrlTree(redirectTo, this.urlSerializer.parse(redirectTo), segments, posParams);
      };
      ApplyRedirects.prototype.applyRedirectCreatreUrlTree = function(redirectTo, urlTree, segments, posParams) {
        var newRoot = this.createSegmentGroup(redirectTo, urlTree.root, segments, posParams);
        return new UrlTree(newRoot, this.createQueryParams(urlTree.queryParams, this.urlTree.queryParams), urlTree.fragment);
      };
      ApplyRedirects.prototype.createQueryParams = function(redirectToParams, actualParams) {
        var res = {};
        forEach(redirectToParams, function(v, k) {
          var copySourceValue = typeof v === 'string' && v.startsWith(':');
          if (copySourceValue) {
            var sourceName = v.substring(1);
            res[k] = actualParams[sourceName];
          } else {
            res[k] = v;
          }
        });
        return res;
      };
      ApplyRedirects.prototype.createSegmentGroup = function(redirectTo, group, segments, posParams) {
        var _this = this;
        var updatedSegments = this.createSegments(redirectTo, group.segments, segments, posParams);
        var children = {};
        forEach(group.children, function(child, name) {
          children[name] = _this.createSegmentGroup(redirectTo, child, segments, posParams);
        });
        return new UrlSegmentGroup(updatedSegments, children);
      };
      ApplyRedirects.prototype.createSegments = function(redirectTo, redirectToSegments, actualSegments, posParams) {
        var _this = this;
        return redirectToSegments.map(function(s) {
          return s.path.startsWith(':') ? _this.findPosParam(redirectTo, s, posParams) : _this.findOrReturn(s, actualSegments);
        });
      };
      ApplyRedirects.prototype.findPosParam = function(redirectTo, redirectToUrlSegment, posParams) {
        var pos = posParams[redirectToUrlSegment.path.substring(1)];
        if (!pos)
          throw new Error("Cannot redirect to '" + redirectTo + "'. Cannot find '" + redirectToUrlSegment.path + "'.");
        return pos;
      };
      ApplyRedirects.prototype.findOrReturn = function(redirectToUrlSegment, actualSegments) {
        var idx = 0;
        for (var _i = 0,
            actualSegments_1 = actualSegments; _i < actualSegments_1.length; _i++) {
          var s = actualSegments_1[_i];
          if (s.path === redirectToUrlSegment.path) {
            actualSegments.splice(idx);
            return s;
          }
          idx++;
        }
        return redirectToUrlSegment;
      };
      return ApplyRedirects;
    }());
    function runCanLoadGuard(moduleInjector, route) {
      var canLoad = route.canLoad;
      if (!canLoad || canLoad.length === 0)
        return rxjs_observable_of.of(true);
      var obs = rxjs_operator_map.map.call(rxjs_observable_from.from(canLoad), function(injectionToken) {
        var guard = moduleInjector.get(injectionToken);
        return wrapIntoObservable(guard.canLoad ? guard.canLoad(route) : guard(route));
      });
      return andObservables(obs);
    }
    function match(segmentGroup, route, segments) {
      if (route.path === '') {
        if ((route.pathMatch === 'full') && (segmentGroup.hasChildren() || segments.length > 0)) {
          return {
            matched: false,
            consumedSegments: [],
            lastChild: 0,
            positionalParamSegments: {}
          };
        }
        return {
          matched: true,
          consumedSegments: [],
          lastChild: 0,
          positionalParamSegments: {}
        };
      }
      var matcher = route.matcher || defaultUrlMatcher;
      var res = matcher(segments, segmentGroup, route);
      if (!res) {
        return {
          matched: false,
          consumedSegments: ([]),
          lastChild: 0,
          positionalParamSegments: {}
        };
      }
      return {
        matched: true,
        consumedSegments: ((res.consumed)),
        lastChild: ((res.consumed.length)),
        positionalParamSegments: ((res.posParams))
      };
    }
    function split(segmentGroup, consumedSegments, slicedSegments, config) {
      if (slicedSegments.length > 0 && containsEmptyPathRedirectsWithNamedOutlets(segmentGroup, slicedSegments, config)) {
        var s = new UrlSegmentGroup(consumedSegments, createChildrenForEmptySegments(config, new UrlSegmentGroup(slicedSegments, segmentGroup.children)));
        return {
          segmentGroup: mergeTrivialChildren(s),
          slicedSegments: []
        };
      }
      if (slicedSegments.length === 0 && containsEmptyPathRedirects(segmentGroup, slicedSegments, config)) {
        var s = new UrlSegmentGroup(segmentGroup.segments, addEmptySegmentsToChildrenIfNeeded(segmentGroup, slicedSegments, config, segmentGroup.children));
        return {
          segmentGroup: mergeTrivialChildren(s),
          slicedSegments: slicedSegments
        };
      }
      return {
        segmentGroup: segmentGroup,
        slicedSegments: slicedSegments
      };
    }
    function mergeTrivialChildren(s) {
      if (s.numberOfChildren === 1 && s.children[PRIMARY_OUTLET]) {
        var c = s.children[PRIMARY_OUTLET];
        return new UrlSegmentGroup(s.segments.concat(c.segments), c.children);
      }
      return s;
    }
    function addEmptySegmentsToChildrenIfNeeded(segmentGroup, slicedSegments, routes, children) {
      var res = {};
      for (var _i = 0,
          routes_1 = routes; _i < routes_1.length; _i++) {
        var r = routes_1[_i];
        if (isEmptyPathRedirect(segmentGroup, slicedSegments, r) && !children[getOutlet(r)]) {
          res[getOutlet(r)] = new UrlSegmentGroup([], {});
        }
      }
      return Object.assign({}, children, res);
    }
    function createChildrenForEmptySegments(routes, primarySegmentGroup) {
      var res = {};
      res[PRIMARY_OUTLET] = primarySegmentGroup;
      for (var _i = 0,
          routes_2 = routes; _i < routes_2.length; _i++) {
        var r = routes_2[_i];
        if (r.path === '' && getOutlet(r) !== PRIMARY_OUTLET) {
          res[getOutlet(r)] = new UrlSegmentGroup([], {});
        }
      }
      return res;
    }
    function containsEmptyPathRedirectsWithNamedOutlets(segmentGroup, segments, routes) {
      return routes.some(function(r) {
        return isEmptyPathRedirect(segmentGroup, segments, r) && getOutlet(r) !== PRIMARY_OUTLET;
      });
    }
    function containsEmptyPathRedirects(segmentGroup, segments, routes) {
      return routes.some(function(r) {
        return isEmptyPathRedirect(segmentGroup, segments, r);
      });
    }
    function isEmptyPathRedirect(segmentGroup, segments, r) {
      if ((segmentGroup.hasChildren() || segments.length > 0) && r.pathMatch === 'full') {
        return false;
      }
      return r.path === '' && r.redirectTo !== undefined;
    }
    function getOutlet(route) {
      return route.outlet || PRIMARY_OUTLET;
    }
    var Tree = (function() {
      function Tree(root) {
        this._root = root;
      }
      Object.defineProperty(Tree.prototype, "root", {
        get: function() {
          return this._root.value;
        },
        enumerable: true,
        configurable: true
      });
      Tree.prototype.parent = function(t) {
        var p = this.pathFromRoot(t);
        return p.length > 1 ? p[p.length - 2] : null;
      };
      Tree.prototype.children = function(t) {
        var n = findNode(t, this._root);
        return n ? n.children.map(function(t) {
          return t.value;
        }) : [];
      };
      Tree.prototype.firstChild = function(t) {
        var n = findNode(t, this._root);
        return n && n.children.length > 0 ? n.children[0].value : null;
      };
      Tree.prototype.siblings = function(t) {
        var p = findPath(t, this._root);
        if (p.length < 2)
          return [];
        var c = p[p.length - 2].children.map(function(c) {
          return c.value;
        });
        return c.filter(function(cc) {
          return cc !== t;
        });
      };
      Tree.prototype.pathFromRoot = function(t) {
        return findPath(t, this._root).map(function(s) {
          return s.value;
        });
      };
      return Tree;
    }());
    function findNode(value, node) {
      if (value === node.value)
        return node;
      for (var _i = 0,
          _a = node.children; _i < _a.length; _i++) {
        var child = _a[_i];
        var node_1 = findNode(value, child);
        if (node_1)
          return node_1;
      }
      return null;
    }
    function findPath(value, node) {
      if (value === node.value)
        return [node];
      for (var _i = 0,
          _a = node.children; _i < _a.length; _i++) {
        var child = _a[_i];
        var path = findPath(value, child);
        if (path.length) {
          path.unshift(node);
          return path;
        }
      }
      return [];
    }
    var TreeNode = (function() {
      function TreeNode(value, children) {
        this.value = value;
        this.children = children;
      }
      TreeNode.prototype.toString = function() {
        return "TreeNode(" + this.value + ")";
      };
      return TreeNode;
    }());
    var RouterState = (function(_super) {
      __extends(RouterState, _super);
      function RouterState(root, snapshot) {
        var _this = _super.call(this, root) || this;
        _this.snapshot = snapshot;
        setRouterState(_this, root);
        return _this;
      }
      RouterState.prototype.toString = function() {
        return this.snapshot.toString();
      };
      return RouterState;
    }(Tree));
    function createEmptyState(urlTree, rootComponent) {
      var snapshot = createEmptyStateSnapshot(urlTree, rootComponent);
      var emptyUrl = new rxjs_BehaviorSubject.BehaviorSubject([new UrlSegment('', {})]);
      var emptyParams = new rxjs_BehaviorSubject.BehaviorSubject({});
      var emptyData = new rxjs_BehaviorSubject.BehaviorSubject({});
      var emptyQueryParams = new rxjs_BehaviorSubject.BehaviorSubject({});
      var fragment = new rxjs_BehaviorSubject.BehaviorSubject('');
      var activated = new ActivatedRoute(emptyUrl, emptyParams, emptyQueryParams, fragment, emptyData, PRIMARY_OUTLET, rootComponent, snapshot.root);
      activated.snapshot = snapshot.root;
      return new RouterState(new TreeNode(activated, []), snapshot);
    }
    function createEmptyStateSnapshot(urlTree, rootComponent) {
      var emptyParams = {};
      var emptyData = {};
      var emptyQueryParams = {};
      var fragment = '';
      var activated = new ActivatedRouteSnapshot([], emptyParams, emptyQueryParams, fragment, emptyData, PRIMARY_OUTLET, rootComponent, null, urlTree.root, -1, {});
      return new RouterStateSnapshot('', new TreeNode(activated, []));
    }
    var ActivatedRoute = (function() {
      function ActivatedRoute(url, params, queryParams, fragment, data, outlet, component, futureSnapshot) {
        this.url = url;
        this.params = params;
        this.queryParams = queryParams;
        this.fragment = fragment;
        this.data = data;
        this.outlet = outlet;
        this.component = component;
        this._futureSnapshot = futureSnapshot;
      }
      Object.defineProperty(ActivatedRoute.prototype, "routeConfig", {
        get: function() {
          return this._futureSnapshot.routeConfig;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ActivatedRoute.prototype, "root", {
        get: function() {
          return this._routerState.root;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ActivatedRoute.prototype, "parent", {
        get: function() {
          return this._routerState.parent(this);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ActivatedRoute.prototype, "firstChild", {
        get: function() {
          return this._routerState.firstChild(this);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ActivatedRoute.prototype, "children", {
        get: function() {
          return this._routerState.children(this);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ActivatedRoute.prototype, "pathFromRoot", {
        get: function() {
          return this._routerState.pathFromRoot(this);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ActivatedRoute.prototype, "paramMap", {
        get: function() {
          if (!this._paramMap) {
            this._paramMap = rxjs_operator_map.map.call(this.params, function(p) {
              return convertToParamMap(p);
            });
          }
          return this._paramMap;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ActivatedRoute.prototype, "queryParamMap", {
        get: function() {
          if (!this._queryParamMap) {
            this._queryParamMap = rxjs_operator_map.map.call(this.queryParams, function(p) {
              return convertToParamMap(p);
            });
          }
          return this._queryParamMap;
        },
        enumerable: true,
        configurable: true
      });
      ActivatedRoute.prototype.toString = function() {
        return this.snapshot ? this.snapshot.toString() : "Future(" + this._futureSnapshot + ")";
      };
      return ActivatedRoute;
    }());
    function inheritedParamsDataResolve(route) {
      var pathToRoot = route.pathFromRoot;
      var inhertingStartingFrom = pathToRoot.length - 1;
      while (inhertingStartingFrom >= 1) {
        var current = pathToRoot[inhertingStartingFrom];
        var parent = pathToRoot[inhertingStartingFrom - 1];
        if (current.routeConfig && current.routeConfig.path === '') {
          inhertingStartingFrom--;
        } else if (!parent.component) {
          inhertingStartingFrom--;
        } else {
          break;
        }
      }
      return pathToRoot.slice(inhertingStartingFrom).reduce(function(res, curr) {
        var params = Object.assign({}, res.params, curr.params);
        var data = Object.assign({}, res.data, curr.data);
        var resolve = Object.assign({}, res.resolve, curr._resolvedData);
        return {
          params: params,
          data: data,
          resolve: resolve
        };
      }, ({
        params: {},
        data: {},
        resolve: {}
      }));
    }
    var ActivatedRouteSnapshot = (function() {
      function ActivatedRouteSnapshot(url, params, queryParams, fragment, data, outlet, component, routeConfig, urlSegment, lastPathIndex, resolve) {
        this.url = url;
        this.params = params;
        this.queryParams = queryParams;
        this.fragment = fragment;
        this.data = data;
        this.outlet = outlet;
        this.component = component;
        this._routeConfig = routeConfig;
        this._urlSegment = urlSegment;
        this._lastPathIndex = lastPathIndex;
        this._resolve = resolve;
      }
      Object.defineProperty(ActivatedRouteSnapshot.prototype, "routeConfig", {
        get: function() {
          return this._routeConfig;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ActivatedRouteSnapshot.prototype, "root", {
        get: function() {
          return this._routerState.root;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ActivatedRouteSnapshot.prototype, "parent", {
        get: function() {
          return this._routerState.parent(this);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ActivatedRouteSnapshot.prototype, "firstChild", {
        get: function() {
          return this._routerState.firstChild(this);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ActivatedRouteSnapshot.prototype, "children", {
        get: function() {
          return this._routerState.children(this);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ActivatedRouteSnapshot.prototype, "pathFromRoot", {
        get: function() {
          return this._routerState.pathFromRoot(this);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ActivatedRouteSnapshot.prototype, "paramMap", {
        get: function() {
          if (!this._paramMap) {
            this._paramMap = convertToParamMap(this.params);
          }
          return this._paramMap;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ActivatedRouteSnapshot.prototype, "queryParamMap", {
        get: function() {
          if (!this._queryParamMap) {
            this._queryParamMap = convertToParamMap(this.queryParams);
          }
          return this._queryParamMap;
        },
        enumerable: true,
        configurable: true
      });
      ActivatedRouteSnapshot.prototype.toString = function() {
        var url = this.url.map(function(segment) {
          return segment.toString();
        }).join('/');
        var matched = this._routeConfig ? this._routeConfig.path : '';
        return "Route(url:'" + url + "', path:'" + matched + "')";
      };
      return ActivatedRouteSnapshot;
    }());
    var RouterStateSnapshot = (function(_super) {
      __extends(RouterStateSnapshot, _super);
      function RouterStateSnapshot(url, root) {
        var _this = _super.call(this, root) || this;
        _this.url = url;
        setRouterState(_this, root);
        return _this;
      }
      RouterStateSnapshot.prototype.toString = function() {
        return serializeNode(this._root);
      };
      return RouterStateSnapshot;
    }(Tree));
    function setRouterState(state, node) {
      node.value._routerState = state;
      node.children.forEach(function(c) {
        return setRouterState(state, c);
      });
    }
    function serializeNode(node) {
      var c = node.children.length > 0 ? " { " + node.children.map(serializeNode).join(", ") + " } " : '';
      return "" + node.value + c;
    }
    function advanceActivatedRoute(route) {
      if (route.snapshot) {
        var currentSnapshot = route.snapshot;
        var nextSnapshot = route._futureSnapshot;
        route.snapshot = nextSnapshot;
        if (!shallowEqual(currentSnapshot.queryParams, nextSnapshot.queryParams)) {
          ((route.queryParams)).next(nextSnapshot.queryParams);
        }
        if (currentSnapshot.fragment !== nextSnapshot.fragment) {
          ((route.fragment)).next(nextSnapshot.fragment);
        }
        if (!shallowEqual(currentSnapshot.params, nextSnapshot.params)) {
          ((route.params)).next(nextSnapshot.params);
        }
        if (!shallowEqualArrays(currentSnapshot.url, nextSnapshot.url)) {
          ((route.url)).next(nextSnapshot.url);
        }
        if (!shallowEqual(currentSnapshot.data, nextSnapshot.data)) {
          ((route.data)).next(nextSnapshot.data);
        }
      } else {
        route.snapshot = route._futureSnapshot;
        ((route.data)).next(route._futureSnapshot.data);
      }
    }
    function equalParamsAndUrlSegments(a, b) {
      var equalUrlParams = shallowEqual(a.params, b.params) && equalSegments(a.url, b.url);
      var parentsMismatch = !a.parent !== !b.parent;
      return equalUrlParams && !parentsMismatch && (!a.parent || equalParamsAndUrlSegments(a.parent, ((b.parent))));
    }
    function createRouterState(routeReuseStrategy, curr, prevState) {
      var root = createNode(routeReuseStrategy, curr._root, prevState ? prevState._root : undefined);
      return new RouterState(root, curr);
    }
    function createNode(routeReuseStrategy, curr, prevState) {
      if (prevState && routeReuseStrategy.shouldReuseRoute(curr.value, prevState.value.snapshot)) {
        var value = prevState.value;
        value._futureSnapshot = curr.value;
        var children = createOrReuseChildren(routeReuseStrategy, curr, prevState);
        return new TreeNode(value, children);
      } else if (routeReuseStrategy.retrieve(curr.value)) {
        var tree_1 = ((routeReuseStrategy.retrieve(curr.value))).route;
        setFutureSnapshotsOfActivatedRoutes(curr, tree_1);
        return tree_1;
      } else {
        var value = createActivatedRoute(curr.value);
        var children = curr.children.map(function(c) {
          return createNode(routeReuseStrategy, c);
        });
        return new TreeNode(value, children);
      }
    }
    function setFutureSnapshotsOfActivatedRoutes(curr, result) {
      if (curr.value.routeConfig !== result.value.routeConfig) {
        throw new Error('Cannot reattach ActivatedRouteSnapshot created from a different route');
      }
      if (curr.children.length !== result.children.length) {
        throw new Error('Cannot reattach ActivatedRouteSnapshot with a different number of children');
      }
      result.value._futureSnapshot = curr.value;
      for (var i = 0; i < curr.children.length; ++i) {
        setFutureSnapshotsOfActivatedRoutes(curr.children[i], result.children[i]);
      }
    }
    function createOrReuseChildren(routeReuseStrategy, curr, prevState) {
      return curr.children.map(function(child) {
        for (var _i = 0,
            _a = prevState.children; _i < _a.length; _i++) {
          var p = _a[_i];
          if (routeReuseStrategy.shouldReuseRoute(p.value.snapshot, child.value)) {
            return createNode(routeReuseStrategy, child, p);
          }
        }
        return createNode(routeReuseStrategy, child);
      });
    }
    function createActivatedRoute(c) {
      return new ActivatedRoute(new rxjs_BehaviorSubject.BehaviorSubject(c.url), new rxjs_BehaviorSubject.BehaviorSubject(c.params), new rxjs_BehaviorSubject.BehaviorSubject(c.queryParams), new rxjs_BehaviorSubject.BehaviorSubject(c.fragment), new rxjs_BehaviorSubject.BehaviorSubject(c.data), c.outlet, c.component, c);
    }
    function createUrlTree(route, urlTree, commands, queryParams, fragment) {
      if (commands.length === 0) {
        return tree(urlTree.root, urlTree.root, urlTree, queryParams, fragment);
      }
      var nav = computeNavigation(commands);
      if (nav.toRoot()) {
        return tree(urlTree.root, new UrlSegmentGroup([], {}), urlTree, queryParams, fragment);
      }
      var startingPosition = findStartingPosition(nav, urlTree, route);
      var segmentGroup = startingPosition.processChildren ? updateSegmentGroupChildren(startingPosition.segmentGroup, startingPosition.index, nav.commands) : updateSegmentGroup(startingPosition.segmentGroup, startingPosition.index, nav.commands);
      return tree(startingPosition.segmentGroup, segmentGroup, urlTree, queryParams, fragment);
    }
    function isMatrixParams(command) {
      return typeof command === 'object' && command != null && !command.outlets && !command.segmentPath;
    }
    function tree(oldSegmentGroup, newSegmentGroup, urlTree, queryParams, fragment) {
      var qp = {};
      if (queryParams) {
        forEach(queryParams, function(value, name) {
          qp[name] = Array.isArray(value) ? value.map(function(v) {
            return "" + v;
          }) : "" + value;
        });
      }
      if (urlTree.root === oldSegmentGroup) {
        return new UrlTree(newSegmentGroup, qp, fragment);
      }
      return new UrlTree(replaceSegment(urlTree.root, oldSegmentGroup, newSegmentGroup), qp, fragment);
    }
    function replaceSegment(current, oldSegment, newSegment) {
      var children = {};
      forEach(current.children, function(c, outletName) {
        if (c === oldSegment) {
          children[outletName] = newSegment;
        } else {
          children[outletName] = replaceSegment(c, oldSegment, newSegment);
        }
      });
      return new UrlSegmentGroup(current.segments, children);
    }
    var Navigation = (function() {
      function Navigation(isAbsolute, numberOfDoubleDots, commands) {
        this.isAbsolute = isAbsolute;
        this.numberOfDoubleDots = numberOfDoubleDots;
        this.commands = commands;
        if (isAbsolute && commands.length > 0 && isMatrixParams(commands[0])) {
          throw new Error('Root segment cannot have matrix parameters');
        }
        var cmdWithOutlet = commands.find(function(c) {
          return typeof c === 'object' && c != null && c.outlets;
        });
        if (cmdWithOutlet && cmdWithOutlet !== last$1(commands)) {
          throw new Error('{outlets:{}} has to be the last command');
        }
      }
      Navigation.prototype.toRoot = function() {
        return this.isAbsolute && this.commands.length === 1 && this.commands[0] == '/';
      };
      return Navigation;
    }());
    function computeNavigation(commands) {
      if ((typeof commands[0] === 'string') && commands.length === 1 && commands[0] === '/') {
        return new Navigation(true, 0, commands);
      }
      var numberOfDoubleDots = 0;
      var isAbsolute = false;
      var res = commands.reduce(function(res, cmd, cmdIdx) {
        if (typeof cmd === 'object' && cmd != null) {
          if (cmd.outlets) {
            var outlets_1 = {};
            forEach(cmd.outlets, function(commands, name) {
              outlets_1[name] = typeof commands === 'string' ? commands.split('/') : commands;
            });
            return res.concat([{outlets: outlets_1}]);
          }
          if (cmd.segmentPath) {
            return res.concat([cmd.segmentPath]);
          }
        }
        if (!(typeof cmd === 'string')) {
          return res.concat([cmd]);
        }
        if (cmdIdx === 0) {
          cmd.split('/').forEach(function(urlPart, partIndex) {
            if (partIndex == 0 && urlPart === '.') {} else if (partIndex == 0 && urlPart === '') {
              isAbsolute = true;
            } else if (urlPart === '..') {
              numberOfDoubleDots++;
            } else if (urlPart != '') {
              res.push(urlPart);
            }
          });
          return res;
        }
        return res.concat([cmd]);
      }, []);
      return new Navigation(isAbsolute, numberOfDoubleDots, res);
    }
    var Position = (function() {
      function Position(segmentGroup, processChildren, index) {
        this.segmentGroup = segmentGroup;
        this.processChildren = processChildren;
        this.index = index;
      }
      return Position;
    }());
    function findStartingPosition(nav, tree, route) {
      if (nav.isAbsolute) {
        return new Position(tree.root, true, 0);
      }
      if (route.snapshot._lastPathIndex === -1) {
        return new Position(route.snapshot._urlSegment, true, 0);
      }
      var modifier = isMatrixParams(nav.commands[0]) ? 0 : 1;
      var index = route.snapshot._lastPathIndex + modifier;
      return createPositionApplyingDoubleDots(route.snapshot._urlSegment, index, nav.numberOfDoubleDots);
    }
    function createPositionApplyingDoubleDots(group, index, numberOfDoubleDots) {
      var g = group;
      var ci = index;
      var dd = numberOfDoubleDots;
      while (dd > ci) {
        dd -= ci;
        g = ((g.parent));
        if (!g) {
          throw new Error('Invalid number of \'../\'');
        }
        ci = g.segments.length;
      }
      return new Position(g, false, ci - dd);
    }
    function getPath(command) {
      if (typeof command === 'object' && command != null && command.outlets) {
        return command.outlets[PRIMARY_OUTLET];
      }
      return "" + command;
    }
    function getOutlets(commands) {
      if (!(typeof commands[0] === 'object'))
        return _a = {}, _a[PRIMARY_OUTLET] = commands, _a;
      if (commands[0].outlets === undefined)
        return _b = {}, _b[PRIMARY_OUTLET] = commands, _b;
      return commands[0].outlets;
      var _a,
          _b;
    }
    function updateSegmentGroup(segmentGroup, startIndex, commands) {
      if (!segmentGroup) {
        segmentGroup = new UrlSegmentGroup([], {});
      }
      if (segmentGroup.segments.length === 0 && segmentGroup.hasChildren()) {
        return updateSegmentGroupChildren(segmentGroup, startIndex, commands);
      }
      var m = prefixedWith(segmentGroup, startIndex, commands);
      var slicedCommands = commands.slice(m.commandIndex);
      if (m.match && m.pathIndex < segmentGroup.segments.length) {
        var g = new UrlSegmentGroup(segmentGroup.segments.slice(0, m.pathIndex), {});
        g.children[PRIMARY_OUTLET] = new UrlSegmentGroup(segmentGroup.segments.slice(m.pathIndex), segmentGroup.children);
        return updateSegmentGroupChildren(g, 0, slicedCommands);
      } else if (m.match && slicedCommands.length === 0) {
        return new UrlSegmentGroup(segmentGroup.segments, {});
      } else if (m.match && !segmentGroup.hasChildren()) {
        return createNewSegmentGroup(segmentGroup, startIndex, commands);
      } else if (m.match) {
        return updateSegmentGroupChildren(segmentGroup, 0, slicedCommands);
      } else {
        return createNewSegmentGroup(segmentGroup, startIndex, commands);
      }
    }
    function updateSegmentGroupChildren(segmentGroup, startIndex, commands) {
      if (commands.length === 0) {
        return new UrlSegmentGroup(segmentGroup.segments, {});
      } else {
        var outlets_2 = getOutlets(commands);
        var children_2 = {};
        forEach(outlets_2, function(commands, outlet) {
          if (commands !== null) {
            children_2[outlet] = updateSegmentGroup(segmentGroup.children[outlet], startIndex, commands);
          }
        });
        forEach(segmentGroup.children, function(child, childOutlet) {
          if (outlets_2[childOutlet] === undefined) {
            children_2[childOutlet] = child;
          }
        });
        return new UrlSegmentGroup(segmentGroup.segments, children_2);
      }
    }
    function prefixedWith(segmentGroup, startIndex, commands) {
      var currentCommandIndex = 0;
      var currentPathIndex = startIndex;
      var noMatch = {
        match: false,
        pathIndex: 0,
        commandIndex: 0
      };
      while (currentPathIndex < segmentGroup.segments.length) {
        if (currentCommandIndex >= commands.length)
          return noMatch;
        var path = segmentGroup.segments[currentPathIndex];
        var curr = getPath(commands[currentCommandIndex]);
        var next = currentCommandIndex < commands.length - 1 ? commands[currentCommandIndex + 1] : null;
        if (currentPathIndex > 0 && curr === undefined)
          break;
        if (curr && next && (typeof next === 'object') && next.outlets === undefined) {
          if (!compare(curr, next, path))
            return noMatch;
          currentCommandIndex += 2;
        } else {
          if (!compare(curr, {}, path))
            return noMatch;
          currentCommandIndex++;
        }
        currentPathIndex++;
      }
      return {
        match: true,
        pathIndex: currentPathIndex,
        commandIndex: currentCommandIndex
      };
    }
    function createNewSegmentGroup(segmentGroup, startIndex, commands) {
      var paths = segmentGroup.segments.slice(0, startIndex);
      var i = 0;
      while (i < commands.length) {
        if (typeof commands[i] === 'object' && commands[i].outlets !== undefined) {
          var children = createNewSegmentChildren(commands[i].outlets);
          return new UrlSegmentGroup(paths, children);
        }
        if (i === 0 && isMatrixParams(commands[0])) {
          var p = segmentGroup.segments[startIndex];
          paths.push(new UrlSegment(p.path, commands[0]));
          i++;
          continue;
        }
        var curr = getPath(commands[i]);
        var next = (i < commands.length - 1) ? commands[i + 1] : null;
        if (curr && next && isMatrixParams(next)) {
          paths.push(new UrlSegment(curr, stringify(next)));
          i += 2;
        } else {
          paths.push(new UrlSegment(curr, {}));
          i++;
        }
      }
      return new UrlSegmentGroup(paths, {});
    }
    function createNewSegmentChildren(outlets) {
      var children = {};
      forEach(outlets, function(commands, outlet) {
        if (commands !== null) {
          children[outlet] = createNewSegmentGroup(new UrlSegmentGroup([], {}), 0, commands);
        }
      });
      return children;
    }
    function stringify(params) {
      var res = {};
      forEach(params, function(v, k) {
        return res[k] = "" + v;
      });
      return res;
    }
    function compare(path, params, segment) {
      return path == segment.path && shallowEqual(params, segment.parameters);
    }
    var NoMatch$1 = (function() {
      function NoMatch$1() {}
      return NoMatch$1;
    }());
    function recognize(rootComponentType, config, urlTree, url) {
      return new Recognizer(rootComponentType, config, urlTree, url).recognize();
    }
    var Recognizer = (function() {
      function Recognizer(rootComponentType, config, urlTree, url) {
        this.rootComponentType = rootComponentType;
        this.config = config;
        this.urlTree = urlTree;
        this.url = url;
      }
      Recognizer.prototype.recognize = function() {
        try {
          var rootSegmentGroup = split$1(this.urlTree.root, [], [], this.config).segmentGroup;
          var children = this.processSegmentGroup(this.config, rootSegmentGroup, PRIMARY_OUTLET);
          var root = new ActivatedRouteSnapshot([], Object.freeze({}), Object.freeze(this.urlTree.queryParams), ((this.urlTree.fragment)), {}, PRIMARY_OUTLET, this.rootComponentType, null, this.urlTree.root, -1, {});
          var rootNode = new TreeNode(root, children);
          var routeState = new RouterStateSnapshot(this.url, rootNode);
          this.inheritParamsAndData(routeState._root);
          return rxjs_observable_of.of(routeState);
        } catch (e) {
          return new rxjs_Observable.Observable(function(obs) {
            return obs.error(e);
          });
        }
      };
      Recognizer.prototype.inheritParamsAndData = function(routeNode) {
        var _this = this;
        var route = routeNode.value;
        var i = inheritedParamsDataResolve(route);
        route.params = Object.freeze(i.params);
        route.data = Object.freeze(i.data);
        routeNode.children.forEach(function(n) {
          return _this.inheritParamsAndData(n);
        });
      };
      Recognizer.prototype.processSegmentGroup = function(config, segmentGroup, outlet) {
        if (segmentGroup.segments.length === 0 && segmentGroup.hasChildren()) {
          return this.processChildren(config, segmentGroup);
        }
        return this.processSegment(config, segmentGroup, segmentGroup.segments, outlet);
      };
      Recognizer.prototype.processChildren = function(config, segmentGroup) {
        var _this = this;
        var children = mapChildrenIntoArray(segmentGroup, function(child, childOutlet) {
          return _this.processSegmentGroup(config, child, childOutlet);
        });
        checkOutletNameUniqueness(children);
        sortActivatedRouteSnapshots(children);
        return children;
      };
      Recognizer.prototype.processSegment = function(config, segmentGroup, segments, outlet) {
        for (var _i = 0,
            config_1 = config; _i < config_1.length; _i++) {
          var r = config_1[_i];
          try {
            return this.processSegmentAgainstRoute(r, segmentGroup, segments, outlet);
          } catch (e) {
            if (!(e instanceof NoMatch$1))
              throw e;
          }
        }
        if (this.noLeftoversInUrl(segmentGroup, segments, outlet)) {
          return [];
        }
        throw new NoMatch$1();
      };
      Recognizer.prototype.noLeftoversInUrl = function(segmentGroup, segments, outlet) {
        return segments.length === 0 && !segmentGroup.children[outlet];
      };
      Recognizer.prototype.processSegmentAgainstRoute = function(route, rawSegment, segments, outlet) {
        if (route.redirectTo)
          throw new NoMatch$1();
        if ((route.outlet || PRIMARY_OUTLET) !== outlet)
          throw new NoMatch$1();
        if (route.path === '**') {
          var params = segments.length > 0 ? ((last$1(segments))).parameters : {};
          var snapshot_1 = new ActivatedRouteSnapshot(segments, params, Object.freeze(this.urlTree.queryParams), ((this.urlTree.fragment)), getData(route), outlet, ((route.component)), route, getSourceSegmentGroup(rawSegment), getPathIndexShift(rawSegment) + segments.length, getResolve(route));
          return [new TreeNode(snapshot_1, [])];
        }
        var _a = match$1(rawSegment, route, segments),
            consumedSegments = _a.consumedSegments,
            parameters = _a.parameters,
            lastChild = _a.lastChild;
        var rawSlicedSegments = segments.slice(lastChild);
        var childConfig = getChildConfig(route);
        var _b = split$1(rawSegment, consumedSegments, rawSlicedSegments, childConfig),
            segmentGroup = _b.segmentGroup,
            slicedSegments = _b.slicedSegments;
        var snapshot = new ActivatedRouteSnapshot(consumedSegments, parameters, Object.freeze(this.urlTree.queryParams), ((this.urlTree.fragment)), getData(route), outlet, ((route.component)), route, getSourceSegmentGroup(rawSegment), getPathIndexShift(rawSegment) + consumedSegments.length, getResolve(route));
        if (slicedSegments.length === 0 && segmentGroup.hasChildren()) {
          var children_3 = this.processChildren(childConfig, segmentGroup);
          return [new TreeNode(snapshot, children_3)];
        }
        if (childConfig.length === 0 && slicedSegments.length === 0) {
          return [new TreeNode(snapshot, [])];
        }
        var children = this.processSegment(childConfig, segmentGroup, slicedSegments, PRIMARY_OUTLET);
        return [new TreeNode(snapshot, children)];
      };
      return Recognizer;
    }());
    function sortActivatedRouteSnapshots(nodes) {
      nodes.sort(function(a, b) {
        if (a.value.outlet === PRIMARY_OUTLET)
          return -1;
        if (b.value.outlet === PRIMARY_OUTLET)
          return 1;
        return a.value.outlet.localeCompare(b.value.outlet);
      });
    }
    function getChildConfig(route) {
      if (route.children) {
        return route.children;
      }
      if (route.loadChildren) {
        return ((route._loadedConfig)).routes;
      }
      return [];
    }
    function match$1(segmentGroup, route, segments) {
      if (route.path === '') {
        if (route.pathMatch === 'full' && (segmentGroup.hasChildren() || segments.length > 0)) {
          throw new NoMatch$1();
        }
        return {
          consumedSegments: [],
          lastChild: 0,
          parameters: {}
        };
      }
      var matcher = route.matcher || defaultUrlMatcher;
      var res = matcher(segments, segmentGroup, route);
      if (!res)
        throw new NoMatch$1();
      var posParams = {};
      forEach(((res.posParams)), function(v, k) {
        posParams[k] = v.path;
      });
      var parameters = res.consumed.length > 0 ? Object.assign({}, posParams, res.consumed[res.consumed.length - 1].parameters) : posParams;
      return {
        consumedSegments: res.consumed,
        lastChild: res.consumed.length,
        parameters: parameters
      };
    }
    function checkOutletNameUniqueness(nodes) {
      var names = {};
      nodes.forEach(function(n) {
        var routeWithSameOutletName = names[n.value.outlet];
        if (routeWithSameOutletName) {
          var p = routeWithSameOutletName.url.map(function(s) {
            return s.toString();
          }).join('/');
          var c = n.value.url.map(function(s) {
            return s.toString();
          }).join('/');
          throw new Error("Two segments cannot have the same outlet name: '" + p + "' and '" + c + "'.");
        }
        names[n.value.outlet] = n.value;
      });
    }
    function getSourceSegmentGroup(segmentGroup) {
      var s = segmentGroup;
      while (s._sourceSegment) {
        s = s._sourceSegment;
      }
      return s;
    }
    function getPathIndexShift(segmentGroup) {
      var s = segmentGroup;
      var res = (s._segmentIndexShift ? s._segmentIndexShift : 0);
      while (s._sourceSegment) {
        s = s._sourceSegment;
        res += (s._segmentIndexShift ? s._segmentIndexShift : 0);
      }
      return res - 1;
    }
    function split$1(segmentGroup, consumedSegments, slicedSegments, config) {
      if (slicedSegments.length > 0 && containsEmptyPathMatchesWithNamedOutlets(segmentGroup, slicedSegments, config)) {
        var s_1 = new UrlSegmentGroup(consumedSegments, createChildrenForEmptyPaths(segmentGroup, consumedSegments, config, new UrlSegmentGroup(slicedSegments, segmentGroup.children)));
        s_1._sourceSegment = segmentGroup;
        s_1._segmentIndexShift = consumedSegments.length;
        return {
          segmentGroup: s_1,
          slicedSegments: []
        };
      }
      if (slicedSegments.length === 0 && containsEmptyPathMatches(segmentGroup, slicedSegments, config)) {
        var s_2 = new UrlSegmentGroup(segmentGroup.segments, addEmptyPathsToChildrenIfNeeded(segmentGroup, slicedSegments, config, segmentGroup.children));
        s_2._sourceSegment = segmentGroup;
        s_2._segmentIndexShift = consumedSegments.length;
        return {
          segmentGroup: s_2,
          slicedSegments: slicedSegments
        };
      }
      var s = new UrlSegmentGroup(segmentGroup.segments, segmentGroup.children);
      s._sourceSegment = segmentGroup;
      s._segmentIndexShift = consumedSegments.length;
      return {
        segmentGroup: s,
        slicedSegments: slicedSegments
      };
    }
    function addEmptyPathsToChildrenIfNeeded(segmentGroup, slicedSegments, routes, children) {
      var res = {};
      for (var _i = 0,
          routes_3 = routes; _i < routes_3.length; _i++) {
        var r = routes_3[_i];
        if (emptyPathMatch(segmentGroup, slicedSegments, r) && !children[getOutlet$1(r)]) {
          var s = new UrlSegmentGroup([], {});
          s._sourceSegment = segmentGroup;
          s._segmentIndexShift = segmentGroup.segments.length;
          res[getOutlet$1(r)] = s;
        }
      }
      return Object.assign({}, children, res);
    }
    function createChildrenForEmptyPaths(segmentGroup, consumedSegments, routes, primarySegment) {
      var res = {};
      res[PRIMARY_OUTLET] = primarySegment;
      primarySegment._sourceSegment = segmentGroup;
      primarySegment._segmentIndexShift = consumedSegments.length;
      for (var _i = 0,
          routes_4 = routes; _i < routes_4.length; _i++) {
        var r = routes_4[_i];
        if (r.path === '' && getOutlet$1(r) !== PRIMARY_OUTLET) {
          var s = new UrlSegmentGroup([], {});
          s._sourceSegment = segmentGroup;
          s._segmentIndexShift = consumedSegments.length;
          res[getOutlet$1(r)] = s;
        }
      }
      return res;
    }
    function containsEmptyPathMatchesWithNamedOutlets(segmentGroup, slicedSegments, routes) {
      return routes.some(function(r) {
        return emptyPathMatch(segmentGroup, slicedSegments, r) && getOutlet$1(r) !== PRIMARY_OUTLET;
      });
    }
    function containsEmptyPathMatches(segmentGroup, slicedSegments, routes) {
      return routes.some(function(r) {
        return emptyPathMatch(segmentGroup, slicedSegments, r);
      });
    }
    function emptyPathMatch(segmentGroup, slicedSegments, r) {
      if ((segmentGroup.hasChildren() || slicedSegments.length > 0) && r.pathMatch === 'full') {
        return false;
      }
      return r.path === '' && r.redirectTo === undefined;
    }
    function getOutlet$1(route) {
      return route.outlet || PRIMARY_OUTLET;
    }
    function getData(route) {
      return route.data || {};
    }
    function getResolve(route) {
      return route.resolve || {};
    }
    var RouteReuseStrategy = (function() {
      function RouteReuseStrategy() {}
      RouteReuseStrategy.prototype.shouldDetach = function(route) {};
      RouteReuseStrategy.prototype.store = function(route, handle) {};
      RouteReuseStrategy.prototype.shouldAttach = function(route) {};
      RouteReuseStrategy.prototype.retrieve = function(route) {};
      RouteReuseStrategy.prototype.shouldReuseRoute = function(future, curr) {};
      return RouteReuseStrategy;
    }());
    var DefaultRouteReuseStrategy = (function() {
      function DefaultRouteReuseStrategy() {}
      DefaultRouteReuseStrategy.prototype.shouldDetach = function(route) {
        return false;
      };
      DefaultRouteReuseStrategy.prototype.store = function(route, detachedTree) {};
      DefaultRouteReuseStrategy.prototype.shouldAttach = function(route) {
        return false;
      };
      DefaultRouteReuseStrategy.prototype.retrieve = function(route) {
        return null;
      };
      DefaultRouteReuseStrategy.prototype.shouldReuseRoute = function(future, curr) {
        return future.routeConfig === curr.routeConfig;
      };
      return DefaultRouteReuseStrategy;
    }());
    var ROUTES = new _angular_core.InjectionToken('ROUTES');
    var RouterConfigLoader = (function() {
      function RouterConfigLoader(loader, compiler, onLoadStartListener, onLoadEndListener) {
        this.loader = loader;
        this.compiler = compiler;
        this.onLoadStartListener = onLoadStartListener;
        this.onLoadEndListener = onLoadEndListener;
      }
      RouterConfigLoader.prototype.load = function(parentInjector, route) {
        var _this = this;
        if (this.onLoadStartListener) {
          this.onLoadStartListener(route);
        }
        var moduleFactory$ = this.loadModuleFactory(((route.loadChildren)));
        return rxjs_operator_map.map.call(moduleFactory$, function(factory) {
          if (_this.onLoadEndListener) {
            _this.onLoadEndListener(route);
          }
          var module = factory.create(parentInjector);
          return new LoadedRouterConfig(flatten(module.injector.get(ROUTES)), module);
        });
      };
      RouterConfigLoader.prototype.loadModuleFactory = function(loadChildren) {
        var _this = this;
        if (typeof loadChildren === 'string') {
          return rxjs_observable_fromPromise.fromPromise(this.loader.load(loadChildren));
        } else {
          return rxjs_operator_mergeMap.mergeMap.call(wrapIntoObservable(loadChildren()), function(t) {
            if (t instanceof _angular_core.NgModuleFactory) {
              return rxjs_observable_of.of(t);
            } else {
              return rxjs_observable_fromPromise.fromPromise(_this.compiler.compileModuleAsync(t));
            }
          });
        }
      };
      return RouterConfigLoader;
    }());
    var UrlHandlingStrategy = (function() {
      function UrlHandlingStrategy() {}
      UrlHandlingStrategy.prototype.shouldProcessUrl = function(url) {};
      UrlHandlingStrategy.prototype.extract = function(url) {};
      UrlHandlingStrategy.prototype.merge = function(newUrlPart, rawUrl) {};
      return UrlHandlingStrategy;
    }());
    var DefaultUrlHandlingStrategy = (function() {
      function DefaultUrlHandlingStrategy() {}
      DefaultUrlHandlingStrategy.prototype.shouldProcessUrl = function(url) {
        return true;
      };
      DefaultUrlHandlingStrategy.prototype.extract = function(url) {
        return url;
      };
      DefaultUrlHandlingStrategy.prototype.merge = function(newUrlPart, wholeUrl) {
        return newUrlPart;
      };
      return DefaultUrlHandlingStrategy;
    }());
    function defaultErrorHandler(error) {
      throw error;
    }
    function defaultRouterHook(snapshot) {
      return (rxjs_observable_of.of(null));
    }
    var Router = (function() {
      function Router(rootComponentType, urlSerializer, rootContexts, location, injector, loader, compiler, config) {
        var _this = this;
        this.rootComponentType = rootComponentType;
        this.urlSerializer = urlSerializer;
        this.rootContexts = rootContexts;
        this.location = location;
        this.config = config;
        this.navigations = new rxjs_BehaviorSubject.BehaviorSubject(((null)));
        this.routerEvents = new rxjs_Subject.Subject();
        this.navigationId = 0;
        this.errorHandler = defaultErrorHandler;
        this.navigated = false;
        this.hooks = {
          beforePreactivation: defaultRouterHook,
          afterPreactivation: defaultRouterHook
        };
        this.urlHandlingStrategy = new DefaultUrlHandlingStrategy();
        this.routeReuseStrategy = new DefaultRouteReuseStrategy();
        var onLoadStart = function(r) {
          return _this.triggerEvent(new RouteConfigLoadStart(r));
        };
        var onLoadEnd = function(r) {
          return _this.triggerEvent(new RouteConfigLoadEnd(r));
        };
        this.ngModule = injector.get(_angular_core.NgModuleRef);
        this.resetConfig(config);
        this.currentUrlTree = createEmptyUrlTree();
        this.rawUrlTree = this.currentUrlTree;
        this.configLoader = new RouterConfigLoader(loader, compiler, onLoadStart, onLoadEnd);
        this.currentRouterState = createEmptyState(this.currentUrlTree, this.rootComponentType);
        this.processNavigations();
      }
      Router.prototype.resetRootComponentType = function(rootComponentType) {
        this.rootComponentType = rootComponentType;
        this.currentRouterState.root.component = this.rootComponentType;
      };
      Router.prototype.initialNavigation = function() {
        this.setUpLocationChangeListener();
        if (this.navigationId === 0) {
          this.navigateByUrl(this.location.path(true), {replaceUrl: true});
        }
      };
      Router.prototype.setUpLocationChangeListener = function() {
        var _this = this;
        if (!this.locationSubscription) {
          this.locationSubscription = (this.location.subscribe(Zone.current.wrap(function(change) {
            var rawUrlTree = _this.urlSerializer.parse(change['url']);
            var source = change['type'] === 'popstate' ? 'popstate' : 'hashchange';
            setTimeout(function() {
              _this.scheduleNavigation(rawUrlTree, source, {replaceUrl: true});
            }, 0);
          })));
        }
      };
      Object.defineProperty(Router.prototype, "routerState", {
        get: function() {
          return this.currentRouterState;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(Router.prototype, "url", {
        get: function() {
          return this.serializeUrl(this.currentUrlTree);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(Router.prototype, "events", {
        get: function() {
          return this.routerEvents;
        },
        enumerable: true,
        configurable: true
      });
      Router.prototype.triggerEvent = function(e) {
        this.routerEvents.next(e);
      };
      Router.prototype.resetConfig = function(config) {
        validateConfig(config);
        this.config = config;
        this.navigated = false;
      };
      Router.prototype.ngOnDestroy = function() {
        this.dispose();
      };
      Router.prototype.dispose = function() {
        if (this.locationSubscription) {
          this.locationSubscription.unsubscribe();
          this.locationSubscription = ((null));
        }
      };
      Router.prototype.createUrlTree = function(commands, navigationExtras) {
        if (navigationExtras === void 0) {
          navigationExtras = {};
        }
        var relativeTo = navigationExtras.relativeTo,
            queryParams = navigationExtras.queryParams,
            fragment = navigationExtras.fragment,
            preserveQueryParams = navigationExtras.preserveQueryParams,
            queryParamsHandling = navigationExtras.queryParamsHandling,
            preserveFragment = navigationExtras.preserveFragment;
        if (_angular_core.isDevMode() && preserveQueryParams && (console) && (console.warn)) {
          console.warn('preserveQueryParams is deprecated, use queryParamsHandling instead.');
        }
        var a = relativeTo || this.routerState.root;
        var f = preserveFragment ? this.currentUrlTree.fragment : fragment;
        var q = null;
        if (queryParamsHandling) {
          switch (queryParamsHandling) {
            case 'merge':
              q = Object.assign({}, this.currentUrlTree.queryParams, queryParams);
              break;
            case 'preserve':
              q = this.currentUrlTree.queryParams;
              break;
            default:
              q = queryParams || null;
          }
        } else {
          q = preserveQueryParams ? this.currentUrlTree.queryParams : queryParams || null;
        }
        return createUrlTree(a, this.currentUrlTree, commands, ((q)), ((f)));
      };
      Router.prototype.navigateByUrl = function(url, extras) {
        if (extras === void 0) {
          extras = {skipLocationChange: false};
        }
        var urlTree = url instanceof UrlTree ? url : this.parseUrl(url);
        var mergedTree = this.urlHandlingStrategy.merge(urlTree, this.rawUrlTree);
        return this.scheduleNavigation(mergedTree, 'imperative', extras);
      };
      Router.prototype.navigate = function(commands, extras) {
        if (extras === void 0) {
          extras = {skipLocationChange: false};
        }
        validateCommands(commands);
        if (typeof extras.queryParams === 'object' && extras.queryParams !== null) {
          extras.queryParams = this.removeEmptyProps(extras.queryParams);
        }
        return this.navigateByUrl(this.createUrlTree(commands, extras), extras);
      };
      Router.prototype.serializeUrl = function(url) {
        return this.urlSerializer.serialize(url);
      };
      Router.prototype.parseUrl = function(url) {
        return this.urlSerializer.parse(url);
      };
      Router.prototype.isActive = function(url, exact) {
        if (url instanceof UrlTree) {
          return containsTree(this.currentUrlTree, url, exact);
        }
        var urlTree = this.urlSerializer.parse(url);
        return containsTree(this.currentUrlTree, urlTree, exact);
      };
      Router.prototype.removeEmptyProps = function(params) {
        return Object.keys(params).reduce(function(result, key) {
          var value = params[key];
          if (value !== null && value !== undefined) {
            result[key] = value;
          }
          return result;
        }, {});
      };
      Router.prototype.processNavigations = function() {
        var _this = this;
        rxjs_operator_concatMap.concatMap.call(this.navigations, function(nav) {
          if (nav) {
            _this.executeScheduledNavigation(nav);
            return nav.promise.catch(function() {});
          } else {
            return (rxjs_observable_of.of(null));
          }
        }).subscribe(function() {});
      };
      Router.prototype.scheduleNavigation = function(rawUrl, source, extras) {
        var lastNavigation = this.navigations.value;
        if (lastNavigation && source !== 'imperative' && lastNavigation.source === 'imperative' && lastNavigation.rawUrl.toString() === rawUrl.toString()) {
          return Promise.resolve(true);
        }
        if (lastNavigation && source == 'hashchange' && lastNavigation.source === 'popstate' && lastNavigation.rawUrl.toString() === rawUrl.toString()) {
          return Promise.resolve(true);
        }
        var resolve = null;
        var reject = null;
        var promise = new Promise(function(res, rej) {
          resolve = res;
          reject = rej;
        });
        var id = ++this.navigationId;
        this.navigations.next({
          id: id,
          source: source,
          rawUrl: rawUrl,
          extras: extras,
          resolve: resolve,
          reject: reject,
          promise: promise
        });
        return promise.catch(function(e) {
          return Promise.reject(e);
        });
      };
      Router.prototype.executeScheduledNavigation = function(_a) {
        var _this = this;
        var id = _a.id,
            rawUrl = _a.rawUrl,
            extras = _a.extras,
            resolve = _a.resolve,
            reject = _a.reject;
        var url = this.urlHandlingStrategy.extract(rawUrl);
        var urlTransition = !this.navigated || url.toString() !== this.currentUrlTree.toString();
        if (urlTransition && this.urlHandlingStrategy.shouldProcessUrl(rawUrl)) {
          this.routerEvents.next(new NavigationStart(id, this.serializeUrl(url)));
          Promise.resolve().then(function(_) {
            return _this.runNavigate(url, rawUrl, !!extras.skipLocationChange, !!extras.replaceUrl, id, null);
          }).then(resolve, reject);
        } else if (urlTransition && this.rawUrlTree && this.urlHandlingStrategy.shouldProcessUrl(this.rawUrlTree)) {
          this.routerEvents.next(new NavigationStart(id, this.serializeUrl(url)));
          Promise.resolve().then(function(_) {
            return _this.runNavigate(url, rawUrl, false, false, id, createEmptyState(url, _this.rootComponentType).snapshot);
          }).then(resolve, reject);
        } else {
          this.rawUrlTree = rawUrl;
          resolve(null);
        }
      };
      Router.prototype.runNavigate = function(url, rawUrl, shouldPreventPushState, shouldReplaceUrl, id, precreatedState) {
        var _this = this;
        if (id !== this.navigationId) {
          this.location.go(this.urlSerializer.serialize(this.currentUrlTree));
          this.routerEvents.next(new NavigationCancel(id, this.serializeUrl(url), "Navigation ID " + id + " is not equal to the current navigation id " + this.navigationId));
          return Promise.resolve(false);
        }
        return new Promise(function(resolvePromise, rejectPromise) {
          var urlAndSnapshot$;
          if (!precreatedState) {
            var moduleInjector = _this.ngModule.injector;
            var redirectsApplied$ = applyRedirects(moduleInjector, _this.configLoader, _this.urlSerializer, url, _this.config);
            urlAndSnapshot$ = rxjs_operator_mergeMap.mergeMap.call(redirectsApplied$, function(appliedUrl) {
              return rxjs_operator_map.map.call(recognize(_this.rootComponentType, _this.config, appliedUrl, _this.serializeUrl(appliedUrl)), function(snapshot) {
                _this.routerEvents.next(new RoutesRecognized(id, _this.serializeUrl(url), _this.serializeUrl(appliedUrl), snapshot));
                return {
                  appliedUrl: appliedUrl,
                  snapshot: snapshot
                };
              });
            });
          } else {
            urlAndSnapshot$ = rxjs_observable_of.of({
              appliedUrl: url,
              snapshot: precreatedState
            });
          }
          var beforePreactivationDone$ = rxjs_operator_mergeMap.mergeMap.call(urlAndSnapshot$, function(p) {
            return rxjs_operator_map.map.call(_this.hooks.beforePreactivation(p.snapshot), function() {
              return p;
            });
          });
          var preActivation;
          var preactivationTraverse$ = rxjs_operator_map.map.call(beforePreactivationDone$, function(_a) {
            var appliedUrl = _a.appliedUrl,
                snapshot = _a.snapshot;
            var moduleInjector = _this.ngModule.injector;
            preActivation = new PreActivation(snapshot, _this.currentRouterState.snapshot, moduleInjector);
            preActivation.traverse(_this.rootContexts);
            return {
              appliedUrl: appliedUrl,
              snapshot: snapshot
            };
          });
          var preactivationCheckGuards$ = rxjs_operator_mergeMap.mergeMap.call(preactivationTraverse$, function(_a) {
            var appliedUrl = _a.appliedUrl,
                snapshot = _a.snapshot;
            if (_this.navigationId !== id)
              return rxjs_observable_of.of(false);
            _this.triggerEvent(new GuardsCheckStart(id, _this.serializeUrl(url), appliedUrl, snapshot));
            return rxjs_operator_map.map.call(preActivation.checkGuards(), function(shouldActivate) {
              _this.triggerEvent(new GuardsCheckEnd(id, _this.serializeUrl(url), appliedUrl, snapshot, shouldActivate));
              return {
                appliedUrl: appliedUrl,
                snapshot: snapshot,
                shouldActivate: shouldActivate
              };
            });
          });
          var preactivationResolveData$ = rxjs_operator_mergeMap.mergeMap.call(preactivationCheckGuards$, function(p) {
            if (_this.navigationId !== id)
              return rxjs_observable_of.of(false);
            if (p.shouldActivate && preActivation.isActivating()) {
              _this.triggerEvent(new ResolveStart(id, _this.serializeUrl(url), p.appliedUrl, p.snapshot));
              return rxjs_operator_map.map.call(preActivation.resolveData(), function() {
                _this.triggerEvent(new ResolveEnd(id, _this.serializeUrl(url), p.appliedUrl, p.snapshot));
                return p;
              });
            } else {
              return rxjs_observable_of.of(p);
            }
          });
          var preactivationDone$ = rxjs_operator_mergeMap.mergeMap.call(preactivationResolveData$, function(p) {
            return rxjs_operator_map.map.call(_this.hooks.afterPreactivation(p.snapshot), function() {
              return p;
            });
          });
          var routerState$ = rxjs_operator_map.map.call(preactivationDone$, function(_a) {
            var appliedUrl = _a.appliedUrl,
                snapshot = _a.snapshot,
                shouldActivate = _a.shouldActivate;
            if (shouldActivate) {
              var state = createRouterState(_this.routeReuseStrategy, snapshot, _this.currentRouterState);
              return {
                appliedUrl: appliedUrl,
                state: state,
                shouldActivate: shouldActivate
              };
            } else {
              return {
                appliedUrl: appliedUrl,
                state: null,
                shouldActivate: shouldActivate
              };
            }
          });
          var navigationIsSuccessful;
          var storedState = _this.currentRouterState;
          var storedUrl = _this.currentUrlTree;
          routerState$.forEach(function(_a) {
            var appliedUrl = _a.appliedUrl,
                state = _a.state,
                shouldActivate = _a.shouldActivate;
            if (!shouldActivate || id !== _this.navigationId) {
              navigationIsSuccessful = false;
              return;
            }
            _this.currentUrlTree = appliedUrl;
            _this.rawUrlTree = _this.urlHandlingStrategy.merge(_this.currentUrlTree, rawUrl);
            _this.currentRouterState = state;
            if (!shouldPreventPushState) {
              var path = _this.urlSerializer.serialize(_this.rawUrlTree);
              if (_this.location.isCurrentPathEqualTo(path) || shouldReplaceUrl) {
                _this.location.replaceState(path);
              } else {
                _this.location.go(path);
              }
            }
            new ActivateRoutes(_this.routeReuseStrategy, state, storedState).activate(_this.rootContexts);
            navigationIsSuccessful = true;
          }).then(function() {
            if (navigationIsSuccessful) {
              _this.navigated = true;
              _this.routerEvents.next(new NavigationEnd(id, _this.serializeUrl(url), _this.serializeUrl(_this.currentUrlTree)));
              resolvePromise(true);
            } else {
              _this.resetUrlToCurrentUrlTree();
              _this.routerEvents.next(new NavigationCancel(id, _this.serializeUrl(url), ''));
              resolvePromise(false);
            }
          }, function(e) {
            if (isNavigationCancelingError(e)) {
              _this.resetUrlToCurrentUrlTree();
              _this.navigated = true;
              _this.routerEvents.next(new NavigationCancel(id, _this.serializeUrl(url), e.message));
              resolvePromise(false);
            } else {
              _this.routerEvents.next(new NavigationError(id, _this.serializeUrl(url), e));
              try {
                resolvePromise(_this.errorHandler(e));
              } catch (ee) {
                rejectPromise(ee);
              }
            }
            _this.currentRouterState = storedState;
            _this.currentUrlTree = storedUrl;
            _this.rawUrlTree = _this.urlHandlingStrategy.merge(_this.currentUrlTree, rawUrl);
            _this.location.replaceState(_this.serializeUrl(_this.rawUrlTree));
          });
        });
      };
      Router.prototype.resetUrlToCurrentUrlTree = function() {
        var path = this.urlSerializer.serialize(this.rawUrlTree);
        this.location.replaceState(path);
      };
      return Router;
    }());
    var CanActivate = (function() {
      function CanActivate(path) {
        this.path = path;
      }
      Object.defineProperty(CanActivate.prototype, "route", {
        get: function() {
          return this.path[this.path.length - 1];
        },
        enumerable: true,
        configurable: true
      });
      return CanActivate;
    }());
    var CanDeactivate = (function() {
      function CanDeactivate(component, route) {
        this.component = component;
        this.route = route;
      }
      return CanDeactivate;
    }());
    var PreActivation = (function() {
      function PreActivation(future, curr, moduleInjector) {
        this.future = future;
        this.curr = curr;
        this.moduleInjector = moduleInjector;
        this.canActivateChecks = [];
        this.canDeactivateChecks = [];
      }
      PreActivation.prototype.traverse = function(parentContexts) {
        var futureRoot = this.future._root;
        var currRoot = this.curr ? this.curr._root : null;
        this.traverseChildRoutes(futureRoot, currRoot, parentContexts, [futureRoot.value]);
      };
      PreActivation.prototype.checkGuards = function() {
        var _this = this;
        if (!this.isDeactivating() && !this.isActivating()) {
          return rxjs_observable_of.of(true);
        }
        var canDeactivate$ = this.runCanDeactivateChecks();
        return rxjs_operator_mergeMap.mergeMap.call(canDeactivate$, function(canDeactivate) {
          return canDeactivate ? _this.runCanActivateChecks() : rxjs_observable_of.of(false);
        });
      };
      PreActivation.prototype.resolveData = function() {
        var _this = this;
        if (!this.isActivating())
          return rxjs_observable_of.of(null);
        var checks$ = rxjs_observable_from.from(this.canActivateChecks);
        var runningChecks$ = rxjs_operator_concatMap.concatMap.call(checks$, function(check) {
          return _this.runResolve(check.route);
        });
        return rxjs_operator_reduce.reduce.call(runningChecks$, function(_, __) {
          return _;
        });
      };
      PreActivation.prototype.isDeactivating = function() {
        return this.canDeactivateChecks.length !== 0;
      };
      PreActivation.prototype.isActivating = function() {
        return this.canActivateChecks.length !== 0;
      };
      PreActivation.prototype.traverseChildRoutes = function(futureNode, currNode, contexts, futurePath) {
        var _this = this;
        var prevChildren = nodeChildrenAsMap(currNode);
        futureNode.children.forEach(function(c) {
          _this.traverseRoutes(c, prevChildren[c.value.outlet], contexts, futurePath.concat([c.value]));
          delete prevChildren[c.value.outlet];
        });
        forEach(prevChildren, function(v, k) {
          return _this.deactivateRouteAndItsChildren(v, ((contexts)).getContext(k));
        });
      };
      PreActivation.prototype.traverseRoutes = function(futureNode, currNode, parentContexts, futurePath) {
        var future = futureNode.value;
        var curr = currNode ? currNode.value : null;
        var context = parentContexts ? parentContexts.getContext(futureNode.value.outlet) : null;
        if (curr && future._routeConfig === curr._routeConfig) {
          var shouldRunGuardsAndResolvers = this.shouldRunGuardsAndResolvers(curr, future, ((future._routeConfig)).runGuardsAndResolvers);
          if (shouldRunGuardsAndResolvers) {
            this.canActivateChecks.push(new CanActivate(futurePath));
          } else {
            future.data = curr.data;
            future._resolvedData = curr._resolvedData;
          }
          if (future.component) {
            this.traverseChildRoutes(futureNode, currNode, context ? context.children : null, futurePath);
          } else {
            this.traverseChildRoutes(futureNode, currNode, parentContexts, futurePath);
          }
          if (shouldRunGuardsAndResolvers) {
            var outlet = ((((context)).outlet));
            this.canDeactivateChecks.push(new CanDeactivate(outlet.component, curr));
          }
        } else {
          if (curr) {
            this.deactivateRouteAndItsChildren(currNode, context);
          }
          this.canActivateChecks.push(new CanActivate(futurePath));
          if (future.component) {
            this.traverseChildRoutes(futureNode, null, context ? context.children : null, futurePath);
          } else {
            this.traverseChildRoutes(futureNode, null, parentContexts, futurePath);
          }
        }
      };
      PreActivation.prototype.shouldRunGuardsAndResolvers = function(curr, future, mode) {
        switch (mode) {
          case 'always':
            return true;
          case 'paramsOrQueryParamsChange':
            return !equalParamsAndUrlSegments(curr, future) || !shallowEqual(curr.queryParams, future.queryParams);
          case 'paramsChange':
          default:
            return !equalParamsAndUrlSegments(curr, future);
        }
      };
      PreActivation.prototype.deactivateRouteAndItsChildren = function(route, context) {
        var _this = this;
        var children = nodeChildrenAsMap(route);
        var r = route.value;
        forEach(children, function(node, childName) {
          if (!r.component) {
            _this.deactivateRouteAndItsChildren(node, context);
          } else if (context) {
            _this.deactivateRouteAndItsChildren(node, context.children.getContext(childName));
          } else {
            _this.deactivateRouteAndItsChildren(node, null);
          }
        });
        if (!r.component) {
          this.canDeactivateChecks.push(new CanDeactivate(null, r));
        } else if (context && context.outlet && context.outlet.isActivated) {
          this.canDeactivateChecks.push(new CanDeactivate(context.outlet.component, r));
        } else {
          this.canDeactivateChecks.push(new CanDeactivate(null, r));
        }
      };
      PreActivation.prototype.runCanDeactivateChecks = function() {
        var _this = this;
        var checks$ = rxjs_observable_from.from(this.canDeactivateChecks);
        var runningChecks$ = rxjs_operator_mergeMap.mergeMap.call(checks$, function(check) {
          return _this.runCanDeactivate(check.component, check.route);
        });
        return rxjs_operator_every.every.call(runningChecks$, function(result) {
          return result === true;
        });
      };
      PreActivation.prototype.runCanActivateChecks = function() {
        var _this = this;
        var checks$ = rxjs_observable_from.from(this.canActivateChecks);
        var runningChecks$ = rxjs_operator_concatMap.concatMap.call(checks$, function(check) {
          return andObservables(rxjs_observable_from.from([_this.runCanActivateChild(check.path), _this.runCanActivate(check.route)]));
        });
        return rxjs_operator_every.every.call(runningChecks$, function(result) {
          return result === true;
        });
      };
      PreActivation.prototype.runCanActivate = function(future) {
        var _this = this;
        var canActivate = future._routeConfig ? future._routeConfig.canActivate : null;
        if (!canActivate || canActivate.length === 0)
          return rxjs_observable_of.of(true);
        var obs = rxjs_operator_map.map.call(rxjs_observable_from.from(canActivate), function(c) {
          var guard = _this.getToken(c, future);
          var observable;
          if (guard.canActivate) {
            observable = wrapIntoObservable(guard.canActivate(future, _this.future));
          } else {
            observable = wrapIntoObservable(guard(future, _this.future));
          }
          return rxjs_operator_first.first.call(observable);
        });
        return andObservables(obs);
      };
      PreActivation.prototype.runCanActivateChild = function(path) {
        var _this = this;
        var future = path[path.length - 1];
        var canActivateChildGuards = path.slice(0, path.length - 1).reverse().map(function(p) {
          return _this.extractCanActivateChild(p);
        }).filter(function(_) {
          return _ !== null;
        });
        return andObservables(rxjs_operator_map.map.call(rxjs_observable_from.from(canActivateChildGuards), function(d) {
          var obs = rxjs_operator_map.map.call(rxjs_observable_from.from(d.guards), function(c) {
            var guard = _this.getToken(c, d.node);
            var observable;
            if (guard.canActivateChild) {
              observable = wrapIntoObservable(guard.canActivateChild(future, _this.future));
            } else {
              observable = wrapIntoObservable(guard(future, _this.future));
            }
            return rxjs_operator_first.first.call(observable);
          });
          return andObservables(obs);
        }));
      };
      PreActivation.prototype.extractCanActivateChild = function(p) {
        var canActivateChild = p._routeConfig ? p._routeConfig.canActivateChild : null;
        if (!canActivateChild || canActivateChild.length === 0)
          return null;
        return {
          node: p,
          guards: canActivateChild
        };
      };
      PreActivation.prototype.runCanDeactivate = function(component, curr) {
        var _this = this;
        var canDeactivate = curr && curr._routeConfig ? curr._routeConfig.canDeactivate : null;
        if (!canDeactivate || canDeactivate.length === 0)
          return rxjs_observable_of.of(true);
        var canDeactivate$ = rxjs_operator_mergeMap.mergeMap.call(rxjs_observable_from.from(canDeactivate), function(c) {
          var guard = _this.getToken(c, curr);
          var observable;
          if (guard.canDeactivate) {
            observable = wrapIntoObservable(guard.canDeactivate(component, curr, _this.curr, _this.future));
          } else {
            observable = wrapIntoObservable(guard(component, curr, _this.curr, _this.future));
          }
          return rxjs_operator_first.first.call(observable);
        });
        return rxjs_operator_every.every.call(canDeactivate$, function(result) {
          return result === true;
        });
      };
      PreActivation.prototype.runResolve = function(future) {
        var resolve = future._resolve;
        return rxjs_operator_map.map.call(this.resolveNode(resolve, future), function(resolvedData) {
          future._resolvedData = resolvedData;
          future.data = Object.assign({}, future.data, inheritedParamsDataResolve(future).resolve);
          return null;
        });
      };
      PreActivation.prototype.resolveNode = function(resolve, future) {
        var _this = this;
        var keys = Object.keys(resolve);
        if (keys.length === 0) {
          return rxjs_observable_of.of({});
        }
        if (keys.length === 1) {
          var key_1 = keys[0];
          return rxjs_operator_map.map.call(this.getResolver(resolve[key_1], future), function(value) {
            return _a = {}, _a[key_1] = value, _a;
            var _a;
          });
        }
        var data = {};
        var runningResolvers$ = rxjs_operator_mergeMap.mergeMap.call(rxjs_observable_from.from(keys), function(key) {
          return rxjs_operator_map.map.call(_this.getResolver(resolve[key], future), function(value) {
            data[key] = value;
            return value;
          });
        });
        return rxjs_operator_map.map.call(rxjs_operator_last.last.call(runningResolvers$), function() {
          return data;
        });
      };
      PreActivation.prototype.getResolver = function(injectionToken, future) {
        var resolver = this.getToken(injectionToken, future);
        return resolver.resolve ? wrapIntoObservable(resolver.resolve(future, this.future)) : wrapIntoObservable(resolver(future, this.future));
      };
      PreActivation.prototype.getToken = function(token, snapshot) {
        var config = closestLoadedConfig(snapshot);
        var injector = config ? config.module.injector : this.moduleInjector;
        return injector.get(token);
      };
      return PreActivation;
    }());
    var ActivateRoutes = (function() {
      function ActivateRoutes(routeReuseStrategy, futureState, currState) {
        this.routeReuseStrategy = routeReuseStrategy;
        this.futureState = futureState;
        this.currState = currState;
      }
      ActivateRoutes.prototype.activate = function(parentContexts) {
        var futureRoot = this.futureState._root;
        var currRoot = this.currState ? this.currState._root : null;
        this.deactivateChildRoutes(futureRoot, currRoot, parentContexts);
        advanceActivatedRoute(this.futureState.root);
        this.activateChildRoutes(futureRoot, currRoot, parentContexts);
      };
      ActivateRoutes.prototype.deactivateChildRoutes = function(futureNode, currNode, contexts) {
        var _this = this;
        var children = nodeChildrenAsMap(currNode);
        futureNode.children.forEach(function(futureChild) {
          var childOutletName = futureChild.value.outlet;
          _this.deactivateRoutes(futureChild, children[childOutletName], contexts);
          delete children[childOutletName];
        });
        forEach(children, function(v, childName) {
          _this.deactivateRouteAndItsChildren(v, contexts);
        });
      };
      ActivateRoutes.prototype.deactivateRoutes = function(futureNode, currNode, parentContext) {
        var future = futureNode.value;
        var curr = currNode ? currNode.value : null;
        if (future === curr) {
          if (future.component) {
            var context = parentContext.getContext(future.outlet);
            if (context) {
              this.deactivateChildRoutes(futureNode, currNode, context.children);
            }
          } else {
            this.deactivateChildRoutes(futureNode, currNode, parentContext);
          }
        } else {
          if (curr) {
            this.deactivateRouteAndItsChildren(currNode, parentContext);
          }
        }
      };
      ActivateRoutes.prototype.deactivateRouteAndItsChildren = function(route, parentContexts) {
        if (this.routeReuseStrategy.shouldDetach(route.value.snapshot)) {
          this.detachAndStoreRouteSubtree(route, parentContexts);
        } else {
          this.deactivateRouteAndOutlet(route, parentContexts);
        }
      };
      ActivateRoutes.prototype.detachAndStoreRouteSubtree = function(route, parentContexts) {
        var context = parentContexts.getContext(route.value.outlet);
        if (context && context.outlet) {
          var componentRef = context.outlet.detach();
          var contexts = context.children.onOutletDeactivated();
          this.routeReuseStrategy.store(route.value.snapshot, {
            componentRef: componentRef,
            route: route,
            contexts: contexts
          });
        }
      };
      ActivateRoutes.prototype.deactivateRouteAndOutlet = function(route, parentContexts) {
        var _this = this;
        var context = parentContexts.getContext(route.value.outlet);
        if (context) {
          var children = nodeChildrenAsMap(route);
          var contexts_1 = route.value.component ? context.children : parentContexts;
          forEach(children, function(v, k) {
            _this.deactivateRouteAndItsChildren(v, contexts_1);
          });
          if (context.outlet) {
            context.outlet.deactivate();
            context.children.onOutletDeactivated();
          }
        }
      };
      ActivateRoutes.prototype.activateChildRoutes = function(futureNode, currNode, contexts) {
        var _this = this;
        var children = nodeChildrenAsMap(currNode);
        futureNode.children.forEach(function(c) {
          _this.activateRoutes(c, children[c.value.outlet], contexts);
        });
      };
      ActivateRoutes.prototype.activateRoutes = function(futureNode, currNode, parentContexts) {
        var future = futureNode.value;
        var curr = currNode ? currNode.value : null;
        advanceActivatedRoute(future);
        if (future === curr) {
          if (future.component) {
            var context = parentContexts.getOrCreateContext(future.outlet);
            this.activateChildRoutes(futureNode, currNode, context.children);
          } else {
            this.activateChildRoutes(futureNode, currNode, parentContexts);
          }
        } else {
          if (future.component) {
            var context = parentContexts.getOrCreateContext(future.outlet);
            if (this.routeReuseStrategy.shouldAttach(future.snapshot)) {
              var stored = ((this.routeReuseStrategy.retrieve(future.snapshot)));
              this.routeReuseStrategy.store(future.snapshot, null);
              context.children.onOutletReAttached(stored.contexts);
              context.attachRef = stored.componentRef;
              context.route = stored.route.value;
              if (context.outlet) {
                context.outlet.attach(stored.componentRef, stored.route.value);
              }
              advanceActivatedRouteNodeAndItsChildren(stored.route);
            } else {
              var config = parentLoadedConfig(future.snapshot);
              var cmpFactoryResolver = config ? config.module.componentFactoryResolver : null;
              context.route = future;
              context.resolver = cmpFactoryResolver;
              if (context.outlet) {
                context.outlet.activateWith(future, cmpFactoryResolver);
              }
              this.activateChildRoutes(futureNode, null, context.children);
            }
          } else {
            this.activateChildRoutes(futureNode, null, parentContexts);
          }
        }
      };
      return ActivateRoutes;
    }());
    function advanceActivatedRouteNodeAndItsChildren(node) {
      advanceActivatedRoute(node.value);
      node.children.forEach(advanceActivatedRouteNodeAndItsChildren);
    }
    function parentLoadedConfig(snapshot) {
      for (var s = snapshot.parent; s; s = s.parent) {
        var route = s._routeConfig;
        if (route && route._loadedConfig)
          return route._loadedConfig;
        if (route && route.component)
          return null;
      }
      return null;
    }
    function closestLoadedConfig(snapshot) {
      if (!snapshot)
        return null;
      for (var s = snapshot.parent; s; s = s.parent) {
        var route = s._routeConfig;
        if (route && route._loadedConfig)
          return route._loadedConfig;
      }
      return null;
    }
    function nodeChildrenAsMap(node) {
      var map$$1 = {};
      if (node) {
        node.children.forEach(function(child) {
          return map$$1[child.value.outlet] = child;
        });
      }
      return map$$1;
    }
    function validateCommands(commands) {
      for (var i = 0; i < commands.length; i++) {
        var cmd = commands[i];
        if (cmd == null) {
          throw new Error("The requested path contains " + cmd + " segment at index " + i);
        }
      }
    }
    var RouterLink = (function() {
      function RouterLink(router, route, tabIndex, renderer, el) {
        this.router = router;
        this.route = route;
        this.commands = [];
        if (tabIndex == null) {
          renderer.setAttribute(el.nativeElement, 'tabindex', '0');
        }
      }
      Object.defineProperty(RouterLink.prototype, "routerLink", {
        set: function(commands) {
          if (commands != null) {
            this.commands = Array.isArray(commands) ? commands : [commands];
          } else {
            this.commands = [];
          }
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(RouterLink.prototype, "preserveQueryParams", {
        set: function(value) {
          if (_angular_core.isDevMode() && (console) && (console.warn)) {
            console.warn('preserveQueryParams is deprecated!, use queryParamsHandling instead.');
          }
          this.preserve = value;
        },
        enumerable: true,
        configurable: true
      });
      RouterLink.prototype.onClick = function() {
        var extras = {
          skipLocationChange: attrBoolValue(this.skipLocationChange),
          replaceUrl: attrBoolValue(this.replaceUrl)
        };
        this.router.navigateByUrl(this.urlTree, extras);
        return true;
      };
      Object.defineProperty(RouterLink.prototype, "urlTree", {
        get: function() {
          return this.router.createUrlTree(this.commands, {
            relativeTo: this.route,
            queryParams: this.queryParams,
            fragment: this.fragment,
            preserveQueryParams: attrBoolValue(this.preserve),
            queryParamsHandling: this.queryParamsHandling,
            preserveFragment: attrBoolValue(this.preserveFragment)
          });
        },
        enumerable: true,
        configurable: true
      });
      return RouterLink;
    }());
    RouterLink.decorators = [{
      type: _angular_core.Directive,
      args: [{selector: ':not(a)[routerLink]'}]
    }];
    RouterLink.ctorParameters = function() {
      return [{type: Router}, {type: ActivatedRoute}, {
        type: undefined,
        decorators: [{
          type: _angular_core.Attribute,
          args: ['tabindex']
        }]
      }, {type: _angular_core.Renderer2}, {type: _angular_core.ElementRef}];
    };
    RouterLink.propDecorators = {
      'queryParams': [{type: _angular_core.Input}],
      'fragment': [{type: _angular_core.Input}],
      'queryParamsHandling': [{type: _angular_core.Input}],
      'preserveFragment': [{type: _angular_core.Input}],
      'skipLocationChange': [{type: _angular_core.Input}],
      'replaceUrl': [{type: _angular_core.Input}],
      'routerLink': [{type: _angular_core.Input}],
      'preserveQueryParams': [{type: _angular_core.Input}],
      'onClick': [{
        type: _angular_core.HostListener,
        args: ['click']
      }]
    };
    var RouterLinkWithHref = (function() {
      function RouterLinkWithHref(router, route, locationStrategy) {
        var _this = this;
        this.router = router;
        this.route = route;
        this.locationStrategy = locationStrategy;
        this.commands = [];
        this.subscription = router.events.subscribe(function(s) {
          if (s instanceof NavigationEnd) {
            _this.updateTargetUrlAndHref();
          }
        });
      }
      Object.defineProperty(RouterLinkWithHref.prototype, "routerLink", {
        set: function(commands) {
          if (commands != null) {
            this.commands = Array.isArray(commands) ? commands : [commands];
          } else {
            this.commands = [];
          }
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(RouterLinkWithHref.prototype, "preserveQueryParams", {
        set: function(value) {
          if (_angular_core.isDevMode() && (console) && (console.warn)) {
            console.warn('preserveQueryParams is deprecated, use queryParamsHandling instead.');
          }
          this.preserve = value;
        },
        enumerable: true,
        configurable: true
      });
      RouterLinkWithHref.prototype.ngOnChanges = function(changes) {
        this.updateTargetUrlAndHref();
      };
      RouterLinkWithHref.prototype.ngOnDestroy = function() {
        this.subscription.unsubscribe();
      };
      RouterLinkWithHref.prototype.onClick = function(button, ctrlKey, metaKey, shiftKey) {
        if (button !== 0 || ctrlKey || metaKey || shiftKey) {
          return true;
        }
        if (typeof this.target === 'string' && this.target != '_self') {
          return true;
        }
        var extras = {
          skipLocationChange: attrBoolValue(this.skipLocationChange),
          replaceUrl: attrBoolValue(this.replaceUrl)
        };
        this.router.navigateByUrl(this.urlTree, extras);
        return false;
      };
      RouterLinkWithHref.prototype.updateTargetUrlAndHref = function() {
        this.href = this.locationStrategy.prepareExternalUrl(this.router.serializeUrl(this.urlTree));
      };
      Object.defineProperty(RouterLinkWithHref.prototype, "urlTree", {
        get: function() {
          return this.router.createUrlTree(this.commands, {
            relativeTo: this.route,
            queryParams: this.queryParams,
            fragment: this.fragment,
            preserveQueryParams: attrBoolValue(this.preserve),
            queryParamsHandling: this.queryParamsHandling,
            preserveFragment: attrBoolValue(this.preserveFragment)
          });
        },
        enumerable: true,
        configurable: true
      });
      return RouterLinkWithHref;
    }());
    RouterLinkWithHref.decorators = [{
      type: _angular_core.Directive,
      args: [{selector: 'a[routerLink]'}]
    }];
    RouterLinkWithHref.ctorParameters = function() {
      return [{type: Router}, {type: ActivatedRoute}, {type: _angular_common.LocationStrategy}];
    };
    RouterLinkWithHref.propDecorators = {
      'target': [{
        type: _angular_core.HostBinding,
        args: ['attr.target']
      }, {type: _angular_core.Input}],
      'queryParams': [{type: _angular_core.Input}],
      'fragment': [{type: _angular_core.Input}],
      'queryParamsHandling': [{type: _angular_core.Input}],
      'preserveFragment': [{type: _angular_core.Input}],
      'skipLocationChange': [{type: _angular_core.Input}],
      'replaceUrl': [{type: _angular_core.Input}],
      'href': [{type: _angular_core.HostBinding}],
      'routerLink': [{type: _angular_core.Input}],
      'preserveQueryParams': [{type: _angular_core.Input}],
      'onClick': [{
        type: _angular_core.HostListener,
        args: ['click', ['$event.button', '$event.ctrlKey', '$event.metaKey', '$event.shiftKey']]
      }]
    };
    function attrBoolValue(s) {
      return s === '' || !!s;
    }
    var RouterLinkActive = (function() {
      function RouterLinkActive(router, element, renderer, cdr) {
        var _this = this;
        this.router = router;
        this.element = element;
        this.renderer = renderer;
        this.cdr = cdr;
        this.classes = [];
        this.active = false;
        this.routerLinkActiveOptions = {exact: false};
        this.subscription = router.events.subscribe(function(s) {
          if (s instanceof NavigationEnd) {
            _this.update();
          }
        });
      }
      Object.defineProperty(RouterLinkActive.prototype, "isActive", {
        get: function() {
          return this.active;
        },
        enumerable: true,
        configurable: true
      });
      RouterLinkActive.prototype.ngAfterContentInit = function() {
        var _this = this;
        this.links.changes.subscribe(function(_) {
          return _this.update();
        });
        this.linksWithHrefs.changes.subscribe(function(_) {
          return _this.update();
        });
        this.update();
      };
      Object.defineProperty(RouterLinkActive.prototype, "routerLinkActive", {
        set: function(data) {
          var classes = Array.isArray(data) ? data : data.split(' ');
          this.classes = classes.filter(function(c) {
            return !!c;
          });
        },
        enumerable: true,
        configurable: true
      });
      RouterLinkActive.prototype.ngOnChanges = function(changes) {
        this.update();
      };
      RouterLinkActive.prototype.ngOnDestroy = function() {
        this.subscription.unsubscribe();
      };
      RouterLinkActive.prototype.update = function() {
        var _this = this;
        if (!this.links || !this.linksWithHrefs || !this.router.navigated)
          return;
        var hasActiveLinks = this.hasActiveLinks();
        if (this.active !== hasActiveLinks) {
          this.classes.forEach(function(c) {
            if (hasActiveLinks) {
              _this.renderer.addClass(_this.element.nativeElement, c);
            } else {
              _this.renderer.removeClass(_this.element.nativeElement, c);
            }
          });
          Promise.resolve(hasActiveLinks).then(function(active) {
            return _this.active = active;
          });
        }
      };
      RouterLinkActive.prototype.isLinkActive = function(router) {
        var _this = this;
        return function(link) {
          return router.isActive(link.urlTree, _this.routerLinkActiveOptions.exact);
        };
      };
      RouterLinkActive.prototype.hasActiveLinks = function() {
        return this.links.some(this.isLinkActive(this.router)) || this.linksWithHrefs.some(this.isLinkActive(this.router));
      };
      return RouterLinkActive;
    }());
    RouterLinkActive.decorators = [{
      type: _angular_core.Directive,
      args: [{
        selector: '[routerLinkActive]',
        exportAs: 'routerLinkActive'
      }]
    }];
    RouterLinkActive.ctorParameters = function() {
      return [{type: Router}, {type: _angular_core.ElementRef}, {type: _angular_core.Renderer2}, {type: _angular_core.ChangeDetectorRef}];
    };
    RouterLinkActive.propDecorators = {
      'links': [{
        type: _angular_core.ContentChildren,
        args: [RouterLink, {descendants: true}]
      }],
      'linksWithHrefs': [{
        type: _angular_core.ContentChildren,
        args: [RouterLinkWithHref, {descendants: true}]
      }],
      'routerLinkActiveOptions': [{type: _angular_core.Input}],
      'routerLinkActive': [{type: _angular_core.Input}]
    };
    var OutletContext = (function() {
      function OutletContext() {
        this.outlet = null;
        this.route = null;
        this.resolver = null;
        this.children = new ChildrenOutletContexts();
        this.attachRef = null;
      }
      return OutletContext;
    }());
    var ChildrenOutletContexts = (function() {
      function ChildrenOutletContexts() {
        this.contexts = new Map();
      }
      ChildrenOutletContexts.prototype.onChildOutletCreated = function(childName, outlet) {
        var context = this.getOrCreateContext(childName);
        context.outlet = outlet;
        this.contexts.set(childName, context);
      };
      ChildrenOutletContexts.prototype.onChildOutletDestroyed = function(childName) {
        var context = this.getContext(childName);
        if (context) {
          context.outlet = null;
        }
      };
      ChildrenOutletContexts.prototype.onOutletDeactivated = function() {
        var contexts = this.contexts;
        this.contexts = new Map();
        return contexts;
      };
      ChildrenOutletContexts.prototype.onOutletReAttached = function(contexts) {
        this.contexts = contexts;
      };
      ChildrenOutletContexts.prototype.getOrCreateContext = function(childName) {
        var context = this.getContext(childName);
        if (!context) {
          context = new OutletContext();
          this.contexts.set(childName, context);
        }
        return context;
      };
      ChildrenOutletContexts.prototype.getContext = function(childName) {
        return this.contexts.get(childName) || null;
      };
      return ChildrenOutletContexts;
    }());
    var RouterOutlet = (function() {
      function RouterOutlet(parentContexts, location, resolver, name, changeDetector) {
        this.parentContexts = parentContexts;
        this.location = location;
        this.resolver = resolver;
        this.changeDetector = changeDetector;
        this.activated = null;
        this._activatedRoute = null;
        this.activateEvents = new _angular_core.EventEmitter();
        this.deactivateEvents = new _angular_core.EventEmitter();
        this.name = name || PRIMARY_OUTLET;
        parentContexts.onChildOutletCreated(this.name, this);
      }
      RouterOutlet.prototype.ngOnDestroy = function() {
        this.parentContexts.onChildOutletDestroyed(this.name);
      };
      RouterOutlet.prototype.ngOnInit = function() {
        if (!this.activated) {
          var context = this.parentContexts.getContext(this.name);
          if (context && context.route) {
            if (context.attachRef) {
              this.attach(context.attachRef, context.route);
            } else {
              this.activateWith(context.route, context.resolver || null);
            }
          }
        }
      };
      Object.defineProperty(RouterOutlet.prototype, "locationInjector", {
        get: function() {
          return this.location.injector;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(RouterOutlet.prototype, "locationFactoryResolver", {
        get: function() {
          return this.resolver;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(RouterOutlet.prototype, "isActivated", {
        get: function() {
          return !!this.activated;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(RouterOutlet.prototype, "component", {
        get: function() {
          if (!this.activated)
            throw new Error('Outlet is not activated');
          return this.activated.instance;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(RouterOutlet.prototype, "activatedRoute", {
        get: function() {
          if (!this.activated)
            throw new Error('Outlet is not activated');
          return (this._activatedRoute);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(RouterOutlet.prototype, "activatedRouteData", {
        get: function() {
          if (this._activatedRoute) {
            return this._activatedRoute.snapshot.data;
          }
          return {};
        },
        enumerable: true,
        configurable: true
      });
      RouterOutlet.prototype.detach = function() {
        if (!this.activated)
          throw new Error('Outlet is not activated');
        this.location.detach();
        var cmp = this.activated;
        this.activated = null;
        this._activatedRoute = null;
        return cmp;
      };
      RouterOutlet.prototype.attach = function(ref, activatedRoute) {
        this.activated = ref;
        this._activatedRoute = activatedRoute;
        this.location.insert(ref.hostView);
      };
      RouterOutlet.prototype.deactivate = function() {
        if (this.activated) {
          var c = this.component;
          this.activated.destroy();
          this.activated = null;
          this._activatedRoute = null;
          this.deactivateEvents.emit(c);
        }
      };
      RouterOutlet.prototype.activateWith = function(activatedRoute, resolver) {
        if (this.isActivated) {
          throw new Error('Cannot activate an already activated outlet');
        }
        this._activatedRoute = activatedRoute;
        var snapshot = activatedRoute._futureSnapshot;
        var component = (((snapshot._routeConfig)).component);
        resolver = resolver || this.resolver;
        var factory = resolver.resolveComponentFactory(component);
        var childContexts = this.parentContexts.getOrCreateContext(this.name).children;
        var injector = new OutletInjector(activatedRoute, childContexts, this.location.injector);
        this.activated = this.location.createComponent(factory, this.location.length, injector);
        this.changeDetector.markForCheck();
        this.activateEvents.emit(this.activated.instance);
      };
      return RouterOutlet;
    }());
    RouterOutlet.decorators = [{
      type: _angular_core.Directive,
      args: [{
        selector: 'router-outlet',
        exportAs: 'outlet'
      }]
    }];
    RouterOutlet.ctorParameters = function() {
      return [{type: ChildrenOutletContexts}, {type: _angular_core.ViewContainerRef}, {type: _angular_core.ComponentFactoryResolver}, {
        type: undefined,
        decorators: [{
          type: _angular_core.Attribute,
          args: ['name']
        }]
      }, {type: _angular_core.ChangeDetectorRef}];
    };
    RouterOutlet.propDecorators = {
      'activateEvents': [{
        type: _angular_core.Output,
        args: ['activate']
      }],
      'deactivateEvents': [{
        type: _angular_core.Output,
        args: ['deactivate']
      }]
    };
    var OutletInjector = (function() {
      function OutletInjector(route, childContexts, parent) {
        this.route = route;
        this.childContexts = childContexts;
        this.parent = parent;
      }
      OutletInjector.prototype.get = function(token, notFoundValue) {
        if (token === ActivatedRoute) {
          return this.route;
        }
        if (token === ChildrenOutletContexts) {
          return this.childContexts;
        }
        return this.parent.get(token, notFoundValue);
      };
      return OutletInjector;
    }());
    var PreloadingStrategy = (function() {
      function PreloadingStrategy() {}
      PreloadingStrategy.prototype.preload = function(route, fn) {};
      return PreloadingStrategy;
    }());
    var PreloadAllModules = (function() {
      function PreloadAllModules() {}
      PreloadAllModules.prototype.preload = function(route, fn) {
        return rxjs_operator_catch._catch.call(fn(), function() {
          return rxjs_observable_of.of(null);
        });
      };
      return PreloadAllModules;
    }());
    var NoPreloading = (function() {
      function NoPreloading() {}
      NoPreloading.prototype.preload = function(route, fn) {
        return rxjs_observable_of.of(null);
      };
      return NoPreloading;
    }());
    var RouterPreloader = (function() {
      function RouterPreloader(router, moduleLoader, compiler, injector, preloadingStrategy) {
        this.router = router;
        this.injector = injector;
        this.preloadingStrategy = preloadingStrategy;
        var onStartLoad = function(r) {
          return router.triggerEvent(new RouteConfigLoadStart(r));
        };
        var onEndLoad = function(r) {
          return router.triggerEvent(new RouteConfigLoadEnd(r));
        };
        this.loader = new RouterConfigLoader(moduleLoader, compiler, onStartLoad, onEndLoad);
      }
      RouterPreloader.prototype.setUpPreloading = function() {
        var _this = this;
        var navigations$ = rxjs_operator_filter.filter.call(this.router.events, function(e) {
          return e instanceof NavigationEnd;
        });
        this.subscription = rxjs_operator_concatMap.concatMap.call(navigations$, function() {
          return _this.preload();
        }).subscribe(function() {});
      };
      RouterPreloader.prototype.preload = function() {
        var ngModule = this.injector.get(_angular_core.NgModuleRef);
        return this.processRoutes(ngModule, this.router.config);
      };
      RouterPreloader.prototype.ngOnDestroy = function() {
        this.subscription.unsubscribe();
      };
      RouterPreloader.prototype.processRoutes = function(ngModule, routes) {
        var res = [];
        for (var _i = 0,
            routes_5 = routes; _i < routes_5.length; _i++) {
          var route = routes_5[_i];
          if (route.loadChildren && !route.canLoad && route._loadedConfig) {
            var childConfig = route._loadedConfig;
            res.push(this.processRoutes(childConfig.module, childConfig.routes));
          } else if (route.loadChildren && !route.canLoad) {
            res.push(this.preloadConfig(ngModule, route));
          } else if (route.children) {
            res.push(this.processRoutes(ngModule, route.children));
          }
        }
        return rxjs_operator_mergeAll.mergeAll.call(rxjs_observable_from.from(res));
      };
      RouterPreloader.prototype.preloadConfig = function(ngModule, route) {
        var _this = this;
        return this.preloadingStrategy.preload(route, function() {
          var loaded$ = _this.loader.load(ngModule.injector, route);
          return rxjs_operator_mergeMap.mergeMap.call(loaded$, function(config) {
            route._loadedConfig = config;
            return _this.processRoutes(config.module, config.routes);
          });
        });
      };
      return RouterPreloader;
    }());
    RouterPreloader.decorators = [{type: _angular_core.Injectable}];
    RouterPreloader.ctorParameters = function() {
      return [{type: Router}, {type: _angular_core.NgModuleFactoryLoader}, {type: _angular_core.Compiler}, {type: _angular_core.Injector}, {type: PreloadingStrategy}];
    };
    var ROUTER_DIRECTIVES = [RouterOutlet, RouterLink, RouterLinkWithHref, RouterLinkActive];
    var ROUTER_CONFIGURATION = new _angular_core.InjectionToken('ROUTER_CONFIGURATION');
    var ROUTER_FORROOT_GUARD = new _angular_core.InjectionToken('ROUTER_FORROOT_GUARD');
    var ROUTER_PROVIDERS = [_angular_common.Location, {
      provide: UrlSerializer,
      useClass: DefaultUrlSerializer
    }, {
      provide: Router,
      useFactory: setupRouter,
      deps: [_angular_core.ApplicationRef, UrlSerializer, ChildrenOutletContexts, _angular_common.Location, _angular_core.Injector, _angular_core.NgModuleFactoryLoader, _angular_core.Compiler, ROUTES, ROUTER_CONFIGURATION, [UrlHandlingStrategy, new _angular_core.Optional()], [RouteReuseStrategy, new _angular_core.Optional()]]
    }, ChildrenOutletContexts, {
      provide: ActivatedRoute,
      useFactory: rootRoute,
      deps: [Router]
    }, {
      provide: _angular_core.NgModuleFactoryLoader,
      useClass: _angular_core.SystemJsNgModuleLoader
    }, RouterPreloader, NoPreloading, PreloadAllModules, {
      provide: ROUTER_CONFIGURATION,
      useValue: {enableTracing: false}
    }];
    function routerNgProbeToken() {
      return new _angular_core.NgProbeToken('Router', Router);
    }
    var RouterModule = (function() {
      function RouterModule(guard, router) {}
      RouterModule.forRoot = function(routes, config) {
        return {
          ngModule: RouterModule,
          providers: [ROUTER_PROVIDERS, provideRoutes(routes), {
            provide: ROUTER_FORROOT_GUARD,
            useFactory: provideForRootGuard,
            deps: [[Router, new _angular_core.Optional(), new _angular_core.SkipSelf()]]
          }, {
            provide: ROUTER_CONFIGURATION,
            useValue: config ? config : {}
          }, {
            provide: _angular_common.LocationStrategy,
            useFactory: provideLocationStrategy,
            deps: [_angular_common.PlatformLocation, [new _angular_core.Inject(_angular_common.APP_BASE_HREF), new _angular_core.Optional()], ROUTER_CONFIGURATION]
          }, {
            provide: PreloadingStrategy,
            useExisting: config && config.preloadingStrategy ? config.preloadingStrategy : NoPreloading
          }, {
            provide: _angular_core.NgProbeToken,
            multi: true,
            useFactory: routerNgProbeToken
          }, provideRouterInitializer()]
        };
      };
      RouterModule.forChild = function(routes) {
        return {
          ngModule: RouterModule,
          providers: [provideRoutes(routes)]
        };
      };
      return RouterModule;
    }());
    RouterModule.decorators = [{
      type: _angular_core.NgModule,
      args: [{
        declarations: ROUTER_DIRECTIVES,
        exports: ROUTER_DIRECTIVES
      }]
    }];
    RouterModule.ctorParameters = function() {
      return [{
        type: undefined,
        decorators: [{type: _angular_core.Optional}, {
          type: _angular_core.Inject,
          args: [ROUTER_FORROOT_GUARD]
        }]
      }, {
        type: Router,
        decorators: [{type: _angular_core.Optional}]
      }];
    };
    function provideLocationStrategy(platformLocationStrategy, baseHref, options) {
      if (options === void 0) {
        options = {};
      }
      return options.useHash ? new _angular_common.HashLocationStrategy(platformLocationStrategy, baseHref) : new _angular_common.PathLocationStrategy(platformLocationStrategy, baseHref);
    }
    function provideForRootGuard(router) {
      if (router) {
        throw new Error("RouterModule.forRoot() called twice. Lazy loaded modules should use RouterModule.forChild() instead.");
      }
      return 'guarded';
    }
    function provideRoutes(routes) {
      return [{
        provide: _angular_core.ANALYZE_FOR_ENTRY_COMPONENTS,
        multi: true,
        useValue: routes
      }, {
        provide: ROUTES,
        multi: true,
        useValue: routes
      }];
    }
    function setupRouter(ref, urlSerializer, contexts, location, injector, loader, compiler, config, opts, urlHandlingStrategy, routeReuseStrategy) {
      if (opts === void 0) {
        opts = {};
      }
      var router = new Router(null, urlSerializer, contexts, location, injector, loader, compiler, flatten(config));
      if (urlHandlingStrategy) {
        router.urlHandlingStrategy = urlHandlingStrategy;
      }
      if (routeReuseStrategy) {
        router.routeReuseStrategy = routeReuseStrategy;
      }
      if (opts.errorHandler) {
        router.errorHandler = opts.errorHandler;
      }
      if (opts.enableTracing) {
        var dom_1 = _angular_platformBrowser.ɵgetDOM();
        router.events.subscribe(function(e) {
          dom_1.logGroup("Router Event: " + ((e.constructor)).name);
          dom_1.log(e.toString());
          dom_1.log(e);
          dom_1.logGroupEnd();
        });
      }
      return router;
    }
    function rootRoute(router) {
      return router.routerState.root;
    }
    var RouterInitializer = (function() {
      function RouterInitializer(injector) {
        this.injector = injector;
        this.initNavigation = false;
        this.resultOfPreactivationDone = new rxjs_Subject.Subject();
      }
      RouterInitializer.prototype.appInitializer = function() {
        var _this = this;
        var p = this.injector.get(_angular_common.LOCATION_INITIALIZED, Promise.resolve(null));
        return p.then(function() {
          var resolve = ((null));
          var res = new Promise(function(r) {
            return resolve = r;
          });
          var router = _this.injector.get(Router);
          var opts = _this.injector.get(ROUTER_CONFIGURATION);
          if (_this.isLegacyDisabled(opts) || _this.isLegacyEnabled(opts)) {
            resolve(true);
          } else if (opts.initialNavigation === 'disabled') {
            router.setUpLocationChangeListener();
            resolve(true);
          } else if (opts.initialNavigation === 'enabled') {
            router.hooks.afterPreactivation = function() {
              if (!_this.initNavigation) {
                _this.initNavigation = true;
                resolve(true);
                return _this.resultOfPreactivationDone;
              } else {
                return (rxjs_observable_of.of(null));
              }
            };
            router.initialNavigation();
          } else {
            throw new Error("Invalid initialNavigation options: '" + opts.initialNavigation + "'");
          }
          return res;
        });
      };
      RouterInitializer.prototype.bootstrapListener = function(bootstrappedComponentRef) {
        var opts = this.injector.get(ROUTER_CONFIGURATION);
        var preloader = this.injector.get(RouterPreloader);
        var router = this.injector.get(Router);
        var ref = this.injector.get(_angular_core.ApplicationRef);
        if (bootstrappedComponentRef !== ref.components[0]) {
          return;
        }
        if (this.isLegacyEnabled(opts)) {
          router.initialNavigation();
        } else if (this.isLegacyDisabled(opts)) {
          router.setUpLocationChangeListener();
        }
        preloader.setUpPreloading();
        router.resetRootComponentType(ref.componentTypes[0]);
        this.resultOfPreactivationDone.next(((null)));
        this.resultOfPreactivationDone.complete();
      };
      RouterInitializer.prototype.isLegacyEnabled = function(opts) {
        return opts.initialNavigation === 'legacy_enabled' || opts.initialNavigation === true || opts.initialNavigation === undefined;
      };
      RouterInitializer.prototype.isLegacyDisabled = function(opts) {
        return opts.initialNavigation === 'legacy_disabled' || opts.initialNavigation === false;
      };
      return RouterInitializer;
    }());
    RouterInitializer.decorators = [{type: _angular_core.Injectable}];
    RouterInitializer.ctorParameters = function() {
      return [{type: _angular_core.Injector}];
    };
    function getAppInitializer(r) {
      return r.appInitializer.bind(r);
    }
    function getBootstrapListener(r) {
      return r.bootstrapListener.bind(r);
    }
    var ROUTER_INITIALIZER = new _angular_core.InjectionToken('Router Initializer');
    function provideRouterInitializer() {
      return [RouterInitializer, {
        provide: _angular_core.APP_INITIALIZER,
        multi: true,
        useFactory: getAppInitializer,
        deps: [RouterInitializer]
      }, {
        provide: ROUTER_INITIALIZER,
        useFactory: getBootstrapListener,
        deps: [RouterInitializer]
      }, {
        provide: _angular_core.APP_BOOTSTRAP_LISTENER,
        multi: true,
        useExisting: ROUTER_INITIALIZER
      }];
    }
    var VERSION = new _angular_core.Version('4.3.3');
    exports.RouterLink = RouterLink;
    exports.RouterLinkWithHref = RouterLinkWithHref;
    exports.RouterLinkActive = RouterLinkActive;
    exports.RouterOutlet = RouterOutlet;
    exports.GuardsCheckEnd = GuardsCheckEnd;
    exports.GuardsCheckStart = GuardsCheckStart;
    exports.NavigationCancel = NavigationCancel;
    exports.NavigationEnd = NavigationEnd;
    exports.NavigationError = NavigationError;
    exports.NavigationStart = NavigationStart;
    exports.ResolveEnd = ResolveEnd;
    exports.ResolveStart = ResolveStart;
    exports.RouteConfigLoadEnd = RouteConfigLoadEnd;
    exports.RouteConfigLoadStart = RouteConfigLoadStart;
    exports.RoutesRecognized = RoutesRecognized;
    exports.RouteReuseStrategy = RouteReuseStrategy;
    exports.Router = Router;
    exports.ROUTES = ROUTES;
    exports.ROUTER_CONFIGURATION = ROUTER_CONFIGURATION;
    exports.ROUTER_INITIALIZER = ROUTER_INITIALIZER;
    exports.RouterModule = RouterModule;
    exports.provideRoutes = provideRoutes;
    exports.ChildrenOutletContexts = ChildrenOutletContexts;
    exports.OutletContext = OutletContext;
    exports.NoPreloading = NoPreloading;
    exports.PreloadAllModules = PreloadAllModules;
    exports.PreloadingStrategy = PreloadingStrategy;
    exports.RouterPreloader = RouterPreloader;
    exports.ActivatedRoute = ActivatedRoute;
    exports.ActivatedRouteSnapshot = ActivatedRouteSnapshot;
    exports.RouterState = RouterState;
    exports.RouterStateSnapshot = RouterStateSnapshot;
    exports.PRIMARY_OUTLET = PRIMARY_OUTLET;
    exports.convertToParamMap = convertToParamMap;
    exports.UrlHandlingStrategy = UrlHandlingStrategy;
    exports.DefaultUrlSerializer = DefaultUrlSerializer;
    exports.UrlSegment = UrlSegment;
    exports.UrlSegmentGroup = UrlSegmentGroup;
    exports.UrlSerializer = UrlSerializer;
    exports.UrlTree = UrlTree;
    exports.VERSION = VERSION;
    exports.ɵROUTER_PROVIDERS = ROUTER_PROVIDERS;
    exports.ɵflatten = flatten;
    exports.ɵa = ROUTER_FORROOT_GUARD;
    exports.ɵg = RouterInitializer;
    exports.ɵh = getAppInitializer;
    exports.ɵi = getBootstrapListener;
    exports.ɵd = provideForRootGuard;
    exports.ɵc = provideLocationStrategy;
    exports.ɵj = provideRouterInitializer;
    exports.ɵf = rootRoute;
    exports.ɵb = routerNgProbeToken;
    exports.ɵe = setupRouter;
    exports.ɵk = Tree;
    exports.ɵl = TreeNode;
    Object.defineProperty(exports, '__esModule', {value: true});
  })));
})(require('process'));
