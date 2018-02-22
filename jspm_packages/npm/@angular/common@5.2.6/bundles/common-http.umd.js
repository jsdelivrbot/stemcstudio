/* */ 
"format cjs";
(function(process) {
  (function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs/observable/of'), require('rxjs/operator/concatMap'), require('rxjs/operator/filter'), require('rxjs/operator/map'), require('tslib'), require('./common.umd'), require('rxjs/Observable')) : typeof define === 'function' && define.amd ? define('@angular/common/http', ['exports', '@angular/core', 'rxjs/observable/of', 'rxjs/operator/concatMap', 'rxjs/operator/filter', 'rxjs/operator/map', 'tslib', '@angular/common', 'rxjs/Observable'], factory) : (factory((global.ng = global.ng || {}, global.ng.common = global.ng.common || {}, global.ng.common.http = {}), global.ng.core, global.Rx.Observable, global.Rx.Observable.prototype, global.Rx.Observable.prototype, global.Rx.Observable.prototype, global.tslib, global.ng.common, global.Rx));
  }(this, (function(exports, _angular_core, rxjs_observable_of, rxjs_operator_concatMap, rxjs_operator_filter, rxjs_operator_map, tslib, _angular_common, rxjs_Observable) {
    'use strict';
    var HttpHandler = (function() {
      function HttpHandler() {}
      return HttpHandler;
    }());
    var HttpBackend = (function() {
      function HttpBackend() {}
      return HttpBackend;
    }());
    var HttpHeaders = (function() {
      function HttpHeaders(headers) {
        var _this = this;
        this.normalizedNames = new Map();
        this.lazyUpdate = null;
        if (!headers) {
          this.headers = new Map();
        } else if (typeof headers === 'string') {
          this.lazyInit = function() {
            _this.headers = new Map();
            headers.split('\n').forEach(function(line) {
              var index = line.indexOf(':');
              if (index > 0) {
                var name_1 = line.slice(0, index);
                var key = name_1.toLowerCase();
                var value = line.slice(index + 1).trim();
                _this.maybeSetNormalizedName(name_1, key);
                if (_this.headers.has(key)) {
                  ((_this.headers.get(key))).push(value);
                } else {
                  _this.headers.set(key, [value]);
                }
              }
            });
          };
        } else {
          this.lazyInit = function() {
            _this.headers = new Map();
            Object.keys(headers).forEach(function(name) {
              var values = headers[name];
              var key = name.toLowerCase();
              if (typeof values === 'string') {
                values = [values];
              }
              if (values.length > 0) {
                _this.headers.set(key, values);
                _this.maybeSetNormalizedName(name, key);
              }
            });
          };
        }
      }
      HttpHeaders.prototype.has = function(name) {
        this.init();
        return this.headers.has(name.toLowerCase());
      };
      HttpHeaders.prototype.get = function(name) {
        this.init();
        var values = this.headers.get(name.toLowerCase());
        return values && values.length > 0 ? values[0] : null;
      };
      HttpHeaders.prototype.keys = function() {
        this.init();
        return Array.from(this.normalizedNames.values());
      };
      HttpHeaders.prototype.getAll = function(name) {
        this.init();
        return this.headers.get(name.toLowerCase()) || null;
      };
      HttpHeaders.prototype.append = function(name, value) {
        return this.clone({
          name: name,
          value: value,
          op: 'a'
        });
      };
      HttpHeaders.prototype.set = function(name, value) {
        return this.clone({
          name: name,
          value: value,
          op: 's'
        });
      };
      HttpHeaders.prototype.delete = function(name, value) {
        return this.clone({
          name: name,
          value: value,
          op: 'd'
        });
      };
      HttpHeaders.prototype.maybeSetNormalizedName = function(name, lcName) {
        if (!this.normalizedNames.has(lcName)) {
          this.normalizedNames.set(lcName, name);
        }
      };
      HttpHeaders.prototype.init = function() {
        var _this = this;
        if (!!this.lazyInit) {
          if (this.lazyInit instanceof HttpHeaders) {
            this.copyFrom(this.lazyInit);
          } else {
            this.lazyInit();
          }
          this.lazyInit = null;
          if (!!this.lazyUpdate) {
            this.lazyUpdate.forEach(function(update) {
              return _this.applyUpdate(update);
            });
            this.lazyUpdate = null;
          }
        }
      };
      HttpHeaders.prototype.copyFrom = function(other) {
        var _this = this;
        other.init();
        Array.from(other.headers.keys()).forEach(function(key) {
          _this.headers.set(key, ((other.headers.get(key))));
          _this.normalizedNames.set(key, ((other.normalizedNames.get(key))));
        });
      };
      HttpHeaders.prototype.clone = function(update) {
        var clone = new HttpHeaders();
        clone.lazyInit = (!!this.lazyInit && this.lazyInit instanceof HttpHeaders) ? this.lazyInit : this;
        clone.lazyUpdate = (this.lazyUpdate || []).concat([update]);
        return clone;
      };
      HttpHeaders.prototype.applyUpdate = function(update) {
        var key = update.name.toLowerCase();
        switch (update.op) {
          case 'a':
          case 's':
            var value = ((update.value));
            if (typeof value === 'string') {
              value = [value];
            }
            if (value.length === 0) {
              return;
            }
            this.maybeSetNormalizedName(update.name, key);
            var base = (update.op === 'a' ? this.headers.get(key) : undefined) || [];
            base.push.apply(base, value);
            this.headers.set(key, base);
            break;
          case 'd':
            var toDelete_1 = (update.value);
            if (!toDelete_1) {
              this.headers.delete(key);
              this.normalizedNames.delete(key);
            } else {
              var existing = this.headers.get(key);
              if (!existing) {
                return;
              }
              existing = existing.filter(function(value) {
                return toDelete_1.indexOf(value) === -1;
              });
              if (existing.length === 0) {
                this.headers.delete(key);
                this.normalizedNames.delete(key);
              } else {
                this.headers.set(key, existing);
              }
            }
            break;
        }
      };
      HttpHeaders.prototype.forEach = function(fn) {
        var _this = this;
        this.init();
        Array.from(this.normalizedNames.keys()).forEach(function(key) {
          return fn(((_this.normalizedNames.get(key))), ((_this.headers.get(key))));
        });
      };
      return HttpHeaders;
    }());
    var HttpUrlEncodingCodec = (function() {
      function HttpUrlEncodingCodec() {}
      HttpUrlEncodingCodec.prototype.encodeKey = function(k) {
        return standardEncoding(k);
      };
      HttpUrlEncodingCodec.prototype.encodeValue = function(v) {
        return standardEncoding(v);
      };
      HttpUrlEncodingCodec.prototype.decodeKey = function(k) {
        return decodeURIComponent(k);
      };
      HttpUrlEncodingCodec.prototype.decodeValue = function(v) {
        return decodeURIComponent(v);
      };
      return HttpUrlEncodingCodec;
    }());
    function paramParser(rawParams, codec) {
      var map$$1 = new Map();
      if (rawParams.length > 0) {
        var params = rawParams.split('&');
        params.forEach(function(param) {
          var eqIdx = param.indexOf('=');
          var _a = eqIdx == -1 ? [codec.decodeKey(param), ''] : [codec.decodeKey(param.slice(0, eqIdx)), codec.decodeValue(param.slice(eqIdx + 1))],
              key = _a[0],
              val = _a[1];
          var list = map$$1.get(key) || [];
          list.push(val);
          map$$1.set(key, list);
        });
      }
      return map$$1;
    }
    function standardEncoding(v) {
      return encodeURIComponent(v).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/gi, '$').replace(/%2C/gi, ',').replace(/%3B/gi, ';').replace(/%2B/gi, '+').replace(/%3D/gi, '=').replace(/%3F/gi, '?').replace(/%2F/gi, '/');
    }
    var HttpParams = (function() {
      function HttpParams(options) {
        if (options === void 0) {
          options = ({});
        }
        var _this = this;
        this.updates = null;
        this.cloneFrom = null;
        this.encoder = options.encoder || new HttpUrlEncodingCodec();
        if (!!options.fromString) {
          if (!!options.fromObject) {
            throw new Error("Cannot specify both fromString and fromObject.");
          }
          this.map = paramParser(options.fromString, this.encoder);
        } else if (!!options.fromObject) {
          this.map = new Map();
          Object.keys(options.fromObject).forEach(function(key) {
            var value = ((options.fromObject))[key];
            ((_this.map)).set(key, Array.isArray(value) ? value : [value]);
          });
        } else {
          this.map = null;
        }
      }
      HttpParams.prototype.has = function(param) {
        this.init();
        return ((this.map)).has(param);
      };
      HttpParams.prototype.get = function(param) {
        this.init();
        var res = ((this.map)).get(param);
        return !!res ? res[0] : null;
      };
      HttpParams.prototype.getAll = function(param) {
        this.init();
        return ((this.map)).get(param) || null;
      };
      HttpParams.prototype.keys = function() {
        this.init();
        return Array.from(((this.map)).keys());
      };
      HttpParams.prototype.append = function(param, value) {
        return this.clone({
          param: param,
          value: value,
          op: 'a'
        });
      };
      HttpParams.prototype.set = function(param, value) {
        return this.clone({
          param: param,
          value: value,
          op: 's'
        });
      };
      HttpParams.prototype.delete = function(param, value) {
        return this.clone({
          param: param,
          value: value,
          op: 'd'
        });
      };
      HttpParams.prototype.toString = function() {
        var _this = this;
        this.init();
        return this.keys().map(function(key) {
          var eKey = _this.encoder.encodeKey(key);
          return ((((_this.map)).get(key))).map(function(value) {
            return eKey + '=' + _this.encoder.encodeValue(value);
          }).join('&');
        }).join('&');
      };
      HttpParams.prototype.clone = function(update) {
        var clone = new HttpParams(({encoder: this.encoder}));
        clone.cloneFrom = this.cloneFrom || this;
        clone.updates = (this.updates || []).concat([update]);
        return clone;
      };
      HttpParams.prototype.init = function() {
        var _this = this;
        if (this.map === null) {
          this.map = new Map();
        }
        if (this.cloneFrom !== null) {
          this.cloneFrom.init();
          this.cloneFrom.keys().forEach(function(key) {
            return ((_this.map)).set(key, ((((((_this.cloneFrom)).map)).get(key))));
          });
          ((this.updates)).forEach(function(update) {
            switch (update.op) {
              case 'a':
              case 's':
                var base = (update.op === 'a' ? ((_this.map)).get(update.param) : undefined) || [];
                base.push(((update.value)));
                ((_this.map)).set(update.param, base);
                break;
              case 'd':
                if (update.value !== undefined) {
                  var base_1 = ((_this.map)).get(update.param) || [];
                  var idx = base_1.indexOf(update.value);
                  if (idx !== -1) {
                    base_1.splice(idx, 1);
                  }
                  if (base_1.length > 0) {
                    ((_this.map)).set(update.param, base_1);
                  } else {
                    ((_this.map)).delete(update.param);
                  }
                } else {
                  ((_this.map)).delete(update.param);
                  break;
                }
            }
          });
          this.cloneFrom = null;
        }
      };
      return HttpParams;
    }());
    function mightHaveBody(method) {
      switch (method) {
        case 'DELETE':
        case 'GET':
        case 'HEAD':
        case 'OPTIONS':
        case 'JSONP':
          return false;
        default:
          return true;
      }
    }
    function isArrayBuffer(value) {
      return typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer;
    }
    function isBlob(value) {
      return typeof Blob !== 'undefined' && value instanceof Blob;
    }
    function isFormData(value) {
      return typeof FormData !== 'undefined' && value instanceof FormData;
    }
    var HttpRequest = (function() {
      function HttpRequest(method, url, third, fourth) {
        this.url = url;
        this.body = null;
        this.reportProgress = false;
        this.withCredentials = false;
        this.responseType = 'json';
        this.method = method.toUpperCase();
        var options;
        if (mightHaveBody(this.method) || !!fourth) {
          this.body = (third !== undefined) ? (third) : null;
          options = fourth;
        } else {
          options = (third);
        }
        if (options) {
          this.reportProgress = !!options.reportProgress;
          this.withCredentials = !!options.withCredentials;
          if (!!options.responseType) {
            this.responseType = options.responseType;
          }
          if (!!options.headers) {
            this.headers = options.headers;
          }
          if (!!options.params) {
            this.params = options.params;
          }
        }
        if (!this.headers) {
          this.headers = new HttpHeaders();
        }
        if (!this.params) {
          this.params = new HttpParams();
          this.urlWithParams = url;
        } else {
          var params = this.params.toString();
          if (params.length === 0) {
            this.urlWithParams = url;
          } else {
            var qIdx = url.indexOf('?');
            var sep = qIdx === -1 ? '?' : (qIdx < url.length - 1 ? '&' : '');
            this.urlWithParams = url + sep + params;
          }
        }
      }
      HttpRequest.prototype.serializeBody = function() {
        if (this.body === null) {
          return null;
        }
        if (isArrayBuffer(this.body) || isBlob(this.body) || isFormData(this.body) || typeof this.body === 'string') {
          return this.body;
        }
        if (this.body instanceof HttpParams) {
          return this.body.toString();
        }
        if (typeof this.body === 'object' || typeof this.body === 'boolean' || Array.isArray(this.body)) {
          return JSON.stringify(this.body);
        }
        return ((this.body)).toString();
      };
      HttpRequest.prototype.detectContentTypeHeader = function() {
        if (this.body === null) {
          return null;
        }
        if (isFormData(this.body)) {
          return null;
        }
        if (isBlob(this.body)) {
          return this.body.type || null;
        }
        if (isArrayBuffer(this.body)) {
          return null;
        }
        if (typeof this.body === 'string') {
          return 'text/plain';
        }
        if (this.body instanceof HttpParams) {
          return 'application/x-www-form-urlencoded;charset=UTF-8';
        }
        if (typeof this.body === 'object' || typeof this.body === 'number' || Array.isArray(this.body)) {
          return 'application/json';
        }
        return null;
      };
      HttpRequest.prototype.clone = function(update) {
        if (update === void 0) {
          update = {};
        }
        var method = update.method || this.method;
        var url = update.url || this.url;
        var responseType = update.responseType || this.responseType;
        var body = (update.body !== undefined) ? update.body : this.body;
        var withCredentials = (update.withCredentials !== undefined) ? update.withCredentials : this.withCredentials;
        var reportProgress = (update.reportProgress !== undefined) ? update.reportProgress : this.reportProgress;
        var headers = update.headers || this.headers;
        var params = update.params || this.params;
        if (update.setHeaders !== undefined) {
          headers = Object.keys(update.setHeaders).reduce(function(headers, name) {
            return headers.set(name, ((update.setHeaders))[name]);
          }, headers);
        }
        if (update.setParams) {
          params = Object.keys(update.setParams).reduce(function(params, param) {
            return params.set(param, ((update.setParams))[param]);
          }, params);
        }
        return new HttpRequest(method, url, body, {
          params: params,
          headers: headers,
          reportProgress: reportProgress,
          responseType: responseType,
          withCredentials: withCredentials
        });
      };
      return HttpRequest;
    }());
    var HttpEventType = {
      Sent: 0,
      UploadProgress: 1,
      ResponseHeader: 2,
      DownloadProgress: 3,
      Response: 4,
      User: 5
    };
    HttpEventType[HttpEventType.Sent] = "Sent";
    HttpEventType[HttpEventType.UploadProgress] = "UploadProgress";
    HttpEventType[HttpEventType.ResponseHeader] = "ResponseHeader";
    HttpEventType[HttpEventType.DownloadProgress] = "DownloadProgress";
    HttpEventType[HttpEventType.Response] = "Response";
    HttpEventType[HttpEventType.User] = "User";
    var HttpResponseBase = (function() {
      function HttpResponseBase(init, defaultStatus, defaultStatusText) {
        if (defaultStatus === void 0) {
          defaultStatus = 200;
        }
        if (defaultStatusText === void 0) {
          defaultStatusText = 'OK';
        }
        this.headers = init.headers || new HttpHeaders();
        this.status = init.status !== undefined ? init.status : defaultStatus;
        this.statusText = init.statusText || defaultStatusText;
        this.url = init.url || null;
        this.ok = this.status >= 200 && this.status < 300;
      }
      return HttpResponseBase;
    }());
    var HttpHeaderResponse = (function(_super) {
      tslib.__extends(HttpHeaderResponse, _super);
      function HttpHeaderResponse(init) {
        if (init === void 0) {
          init = {};
        }
        var _this = _super.call(this, init) || this;
        _this.type = HttpEventType.ResponseHeader;
        return _this;
      }
      HttpHeaderResponse.prototype.clone = function(update) {
        if (update === void 0) {
          update = {};
        }
        return new HttpHeaderResponse({
          headers: update.headers || this.headers,
          status: update.status !== undefined ? update.status : this.status,
          statusText: update.statusText || this.statusText,
          url: update.url || this.url || undefined
        });
      };
      return HttpHeaderResponse;
    }(HttpResponseBase));
    var HttpResponse = (function(_super) {
      tslib.__extends(HttpResponse, _super);
      function HttpResponse(init) {
        if (init === void 0) {
          init = {};
        }
        var _this = _super.call(this, init) || this;
        _this.type = HttpEventType.Response;
        _this.body = init.body !== undefined ? init.body : null;
        return _this;
      }
      HttpResponse.prototype.clone = function(update) {
        if (update === void 0) {
          update = {};
        }
        return new HttpResponse({
          body: (update.body !== undefined) ? update.body : this.body,
          headers: update.headers || this.headers,
          status: (update.status !== undefined) ? update.status : this.status,
          statusText: update.statusText || this.statusText,
          url: update.url || this.url || undefined
        });
      };
      return HttpResponse;
    }(HttpResponseBase));
    var HttpErrorResponse = (function(_super) {
      tslib.__extends(HttpErrorResponse, _super);
      function HttpErrorResponse(init) {
        var _this = _super.call(this, init, 0, 'Unknown Error') || this;
        _this.name = 'HttpErrorResponse';
        _this.ok = false;
        if (_this.status >= 200 && _this.status < 300) {
          _this.message = "Http failure during parsing for " + (init.url || '(unknown url)');
        } else {
          _this.message = "Http failure response for " + (init.url || '(unknown url)') + ": " + init.status + " " + init.statusText;
        }
        _this.error = init.error || null;
        return _this;
      }
      return HttpErrorResponse;
    }(HttpResponseBase));
    function addBody(options, body) {
      return {
        body: body,
        headers: options.headers,
        observe: options.observe,
        params: options.params,
        reportProgress: options.reportProgress,
        responseType: options.responseType,
        withCredentials: options.withCredentials
      };
    }
    var HttpClient = (function() {
      function HttpClient(handler) {
        this.handler = handler;
      }
      HttpClient.prototype.request = function(first, url, options) {
        var _this = this;
        if (options === void 0) {
          options = {};
        }
        var req;
        if (first instanceof HttpRequest) {
          req = (first);
        } else {
          var headers = undefined;
          if (options.headers instanceof HttpHeaders) {
            headers = options.headers;
          } else {
            headers = new HttpHeaders(options.headers);
          }
          var params = undefined;
          if (!!options.params) {
            if (options.params instanceof HttpParams) {
              params = options.params;
            } else {
              params = new HttpParams(({fromObject: options.params}));
            }
          }
          req = new HttpRequest(first, ((url)), (options.body !== undefined ? options.body : null), {
            headers: headers,
            params: params,
            reportProgress: options.reportProgress,
            responseType: options.responseType || 'json',
            withCredentials: options.withCredentials
          });
        }
        var events$ = rxjs_operator_concatMap.concatMap.call(rxjs_observable_of.of(req), function(req) {
          return _this.handler.handle(req);
        });
        if (first instanceof HttpRequest || options.observe === 'events') {
          return events$;
        }
        var res$ = rxjs_operator_filter.filter.call(events$, function(event) {
          return event instanceof HttpResponse;
        });
        switch (options.observe || 'body') {
          case 'body':
            switch (req.responseType) {
              case 'arraybuffer':
                return rxjs_operator_map.map.call(res$, function(res) {
                  if (res.body !== null && !(res.body instanceof ArrayBuffer)) {
                    throw new Error('Response is not an ArrayBuffer.');
                  }
                  return res.body;
                });
              case 'blob':
                return rxjs_operator_map.map.call(res$, function(res) {
                  if (res.body !== null && !(res.body instanceof Blob)) {
                    throw new Error('Response is not a Blob.');
                  }
                  return res.body;
                });
              case 'text':
                return rxjs_operator_map.map.call(res$, function(res) {
                  if (res.body !== null && typeof res.body !== 'string') {
                    throw new Error('Response is not a string.');
                  }
                  return res.body;
                });
              case 'json':
              default:
                return rxjs_operator_map.map.call(res$, function(res) {
                  return res.body;
                });
            }
          case 'response':
            return res$;
          default:
            throw new Error("Unreachable: unhandled observe type " + options.observe + "}");
        }
      };
      HttpClient.prototype.delete = function(url, options) {
        if (options === void 0) {
          options = {};
        }
        return this.request('DELETE', url, (options));
      };
      HttpClient.prototype.get = function(url, options) {
        if (options === void 0) {
          options = {};
        }
        return this.request('GET', url, (options));
      };
      HttpClient.prototype.head = function(url, options) {
        if (options === void 0) {
          options = {};
        }
        return this.request('HEAD', url, (options));
      };
      HttpClient.prototype.jsonp = function(url, callbackParam) {
        return this.request('JSONP', url, {
          params: new HttpParams().append(callbackParam, 'JSONP_CALLBACK'),
          observe: 'body',
          responseType: 'json'
        });
      };
      HttpClient.prototype.options = function(url, options) {
        if (options === void 0) {
          options = {};
        }
        return this.request('OPTIONS', url, (options));
      };
      HttpClient.prototype.patch = function(url, body, options) {
        if (options === void 0) {
          options = {};
        }
        return this.request('PATCH', url, addBody(options, body));
      };
      HttpClient.prototype.post = function(url, body, options) {
        if (options === void 0) {
          options = {};
        }
        return this.request('POST', url, addBody(options, body));
      };
      HttpClient.prototype.put = function(url, body, options) {
        if (options === void 0) {
          options = {};
        }
        return this.request('PUT', url, addBody(options, body));
      };
      HttpClient.decorators = [{type: _angular_core.Injectable}];
      HttpClient.ctorParameters = function() {
        return [{type: HttpHandler}];
      };
      return HttpClient;
    }());
    var HttpInterceptorHandler = (function() {
      function HttpInterceptorHandler(next, interceptor) {
        this.next = next;
        this.interceptor = interceptor;
      }
      HttpInterceptorHandler.prototype.handle = function(req) {
        return this.interceptor.intercept(req, this.next);
      };
      return HttpInterceptorHandler;
    }());
    var HTTP_INTERCEPTORS = new _angular_core.InjectionToken('HTTP_INTERCEPTORS');
    var NoopInterceptor = (function() {
      function NoopInterceptor() {}
      NoopInterceptor.prototype.intercept = function(req, next) {
        return next.handle(req);
      };
      NoopInterceptor.decorators = [{type: _angular_core.Injectable}];
      NoopInterceptor.ctorParameters = function() {
        return [];
      };
      return NoopInterceptor;
    }());
    var nextRequestId = 0;
    var JSONP_ERR_NO_CALLBACK = 'JSONP injected script did not invoke callback.';
    var JSONP_ERR_WRONG_METHOD = 'JSONP requests must use JSONP request method.';
    var JSONP_ERR_WRONG_RESPONSE_TYPE = 'JSONP requests must use Json response type.';
    var JsonpCallbackContext = (function() {
      function JsonpCallbackContext() {}
      return JsonpCallbackContext;
    }());
    var JsonpClientBackend = (function() {
      function JsonpClientBackend(callbackMap, document) {
        this.callbackMap = callbackMap;
        this.document = document;
      }
      JsonpClientBackend.prototype.nextCallback = function() {
        return "ng_jsonp_callback_" + nextRequestId++;
      };
      JsonpClientBackend.prototype.handle = function(req) {
        var _this = this;
        if (req.method !== 'JSONP') {
          throw new Error(JSONP_ERR_WRONG_METHOD);
        } else if (req.responseType !== 'json') {
          throw new Error(JSONP_ERR_WRONG_RESPONSE_TYPE);
        }
        return new rxjs_Observable.Observable(function(observer) {
          var callback = _this.nextCallback();
          var url = req.urlWithParams.replace(/=JSONP_CALLBACK(&|$)/, "=" + callback + "$1");
          var node = _this.document.createElement('script');
          node.src = url;
          var body = null;
          var finished = false;
          var cancelled = false;
          _this.callbackMap[callback] = function(data) {
            delete _this.callbackMap[callback];
            if (cancelled) {
              return;
            }
            body = data;
            finished = true;
          };
          var cleanup = function() {
            if (node.parentNode) {
              node.parentNode.removeChild(node);
            }
            delete _this.callbackMap[callback];
          };
          var onLoad = function(event) {
            if (cancelled) {
              return;
            }
            cleanup();
            if (!finished) {
              observer.error(new HttpErrorResponse({
                url: url,
                status: 0,
                statusText: 'JSONP Error',
                error: new Error(JSONP_ERR_NO_CALLBACK)
              }));
              return;
            }
            observer.next(new HttpResponse({
              body: body,
              status: 200,
              statusText: 'OK',
              url: url
            }));
            observer.complete();
          };
          var onError = function(error) {
            if (cancelled) {
              return;
            }
            cleanup();
            observer.error(new HttpErrorResponse({
              error: error,
              status: 0,
              statusText: 'JSONP Error',
              url: url
            }));
          };
          node.addEventListener('load', onLoad);
          node.addEventListener('error', onError);
          _this.document.body.appendChild(node);
          observer.next({type: HttpEventType.Sent});
          return function() {
            cancelled = true;
            node.removeEventListener('load', onLoad);
            node.removeEventListener('error', onError);
            cleanup();
          };
        });
      };
      JsonpClientBackend.decorators = [{type: _angular_core.Injectable}];
      JsonpClientBackend.ctorParameters = function() {
        return [{type: JsonpCallbackContext}, {
          type: undefined,
          decorators: [{
            type: _angular_core.Inject,
            args: [_angular_common.DOCUMENT]
          }]
        }];
      };
      return JsonpClientBackend;
    }());
    var JsonpInterceptor = (function() {
      function JsonpInterceptor(jsonp) {
        this.jsonp = jsonp;
      }
      JsonpInterceptor.prototype.intercept = function(req, next) {
        if (req.method === 'JSONP') {
          return this.jsonp.handle((req));
        }
        return next.handle(req);
      };
      JsonpInterceptor.decorators = [{type: _angular_core.Injectable}];
      JsonpInterceptor.ctorParameters = function() {
        return [{type: JsonpClientBackend}];
      };
      return JsonpInterceptor;
    }());
    var XSSI_PREFIX = /^\)\]\}',?\n/;
    function getResponseUrl(xhr) {
      if ('responseURL' in xhr && xhr.responseURL) {
        return xhr.responseURL;
      }
      if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
        return xhr.getResponseHeader('X-Request-URL');
      }
      return null;
    }
    var XhrFactory = (function() {
      function XhrFactory() {}
      return XhrFactory;
    }());
    var BrowserXhr = (function() {
      function BrowserXhr() {}
      BrowserXhr.prototype.build = function() {
        return ((new XMLHttpRequest()));
      };
      BrowserXhr.decorators = [{type: _angular_core.Injectable}];
      BrowserXhr.ctorParameters = function() {
        return [];
      };
      return BrowserXhr;
    }());
    var HttpXhrBackend = (function() {
      function HttpXhrBackend(xhrFactory) {
        this.xhrFactory = xhrFactory;
      }
      HttpXhrBackend.prototype.handle = function(req) {
        var _this = this;
        if (req.method === 'JSONP') {
          throw new Error("Attempted to construct Jsonp request without JsonpClientModule installed.");
        }
        return new rxjs_Observable.Observable(function(observer) {
          var xhr = _this.xhrFactory.build();
          xhr.open(req.method, req.urlWithParams);
          if (!!req.withCredentials) {
            xhr.withCredentials = true;
          }
          req.headers.forEach(function(name, values) {
            return xhr.setRequestHeader(name, values.join(','));
          });
          if (!req.headers.has('Accept')) {
            xhr.setRequestHeader('Accept', 'application/json, text/plain, */*');
          }
          if (!req.headers.has('Content-Type')) {
            var detectedType = req.detectContentTypeHeader();
            if (detectedType !== null) {
              xhr.setRequestHeader('Content-Type', detectedType);
            }
          }
          if (req.responseType) {
            var responseType = req.responseType.toLowerCase();
            xhr.responseType = (((responseType !== 'json') ? responseType : 'text'));
          }
          var reqBody = req.serializeBody();
          var headerResponse = null;
          var partialFromXhr = function() {
            if (headerResponse !== null) {
              return headerResponse;
            }
            var status = xhr.status === 1223 ? 204 : xhr.status;
            var statusText = xhr.statusText || 'OK';
            var headers = new HttpHeaders(xhr.getAllResponseHeaders());
            var url = getResponseUrl(xhr) || req.url;
            headerResponse = new HttpHeaderResponse({
              headers: headers,
              status: status,
              statusText: statusText,
              url: url
            });
            return headerResponse;
          };
          var onLoad = function() {
            var _a = partialFromXhr(),
                headers = _a.headers,
                status = _a.status,
                statusText = _a.statusText,
                url = _a.url;
            var body = null;
            if (status !== 204) {
              body = (typeof xhr.response === 'undefined') ? xhr.responseText : xhr.response;
            }
            if (status === 0) {
              status = !!body ? 200 : 0;
            }
            var ok = status >= 200 && status < 300;
            if (req.responseType === 'json' && typeof body === 'string') {
              var originalBody = body;
              body = body.replace(XSSI_PREFIX, '');
              try {
                body = body !== '' ? JSON.parse(body) : null;
              } catch (error) {
                body = originalBody;
                if (ok) {
                  ok = false;
                  body = ({
                    error: error,
                    text: body
                  });
                }
              }
            }
            if (ok) {
              observer.next(new HttpResponse({
                body: body,
                headers: headers,
                status: status,
                statusText: statusText,
                url: url || undefined
              }));
              observer.complete();
            } else {
              observer.error(new HttpErrorResponse({
                error: body,
                headers: headers,
                status: status,
                statusText: statusText,
                url: url || undefined
              }));
            }
          };
          var onError = function(error) {
            var res = new HttpErrorResponse({
              error: error,
              status: xhr.status || 0,
              statusText: xhr.statusText || 'Unknown Error'
            });
            observer.error(res);
          };
          var sentHeaders = false;
          var onDownProgress = function(event) {
            if (!sentHeaders) {
              observer.next(partialFromXhr());
              sentHeaders = true;
            }
            var progressEvent = {
              type: HttpEventType.DownloadProgress,
              loaded: event.loaded
            };
            if (event.lengthComputable) {
              progressEvent.total = event.total;
            }
            if (req.responseType === 'text' && !!xhr.responseText) {
              progressEvent.partialText = xhr.responseText;
            }
            observer.next(progressEvent);
          };
          var onUpProgress = function(event) {
            var progress = {
              type: HttpEventType.UploadProgress,
              loaded: event.loaded
            };
            if (event.lengthComputable) {
              progress.total = event.total;
            }
            observer.next(progress);
          };
          xhr.addEventListener('load', onLoad);
          xhr.addEventListener('error', onError);
          if (req.reportProgress) {
            xhr.addEventListener('progress', onDownProgress);
            if (reqBody !== null && xhr.upload) {
              xhr.upload.addEventListener('progress', onUpProgress);
            }
          }
          xhr.send(reqBody);
          observer.next({type: HttpEventType.Sent});
          return function() {
            xhr.removeEventListener('error', onError);
            xhr.removeEventListener('load', onLoad);
            if (req.reportProgress) {
              xhr.removeEventListener('progress', onDownProgress);
              if (reqBody !== null && xhr.upload) {
                xhr.upload.removeEventListener('progress', onUpProgress);
              }
            }
            xhr.abort();
          };
        });
      };
      HttpXhrBackend.decorators = [{type: _angular_core.Injectable}];
      HttpXhrBackend.ctorParameters = function() {
        return [{type: XhrFactory}];
      };
      return HttpXhrBackend;
    }());
    var XSRF_COOKIE_NAME = new _angular_core.InjectionToken('XSRF_COOKIE_NAME');
    var XSRF_HEADER_NAME = new _angular_core.InjectionToken('XSRF_HEADER_NAME');
    var HttpXsrfTokenExtractor = (function() {
      function HttpXsrfTokenExtractor() {}
      return HttpXsrfTokenExtractor;
    }());
    var HttpXsrfCookieExtractor = (function() {
      function HttpXsrfCookieExtractor(doc, platform, cookieName) {
        this.doc = doc;
        this.platform = platform;
        this.cookieName = cookieName;
        this.lastCookieString = '';
        this.lastToken = null;
        this.parseCount = 0;
      }
      HttpXsrfCookieExtractor.prototype.getToken = function() {
        if (this.platform === 'server') {
          return null;
        }
        var cookieString = this.doc.cookie || '';
        if (cookieString !== this.lastCookieString) {
          this.parseCount++;
          this.lastToken = _angular_common.ɵparseCookieValue(cookieString, this.cookieName);
          this.lastCookieString = cookieString;
        }
        return this.lastToken;
      };
      HttpXsrfCookieExtractor.decorators = [{type: _angular_core.Injectable}];
      HttpXsrfCookieExtractor.ctorParameters = function() {
        return [{
          type: undefined,
          decorators: [{
            type: _angular_core.Inject,
            args: [_angular_common.DOCUMENT]
          }]
        }, {
          type: undefined,
          decorators: [{
            type: _angular_core.Inject,
            args: [_angular_core.PLATFORM_ID]
          }]
        }, {
          type: undefined,
          decorators: [{
            type: _angular_core.Inject,
            args: [XSRF_COOKIE_NAME]
          }]
        }];
      };
      return HttpXsrfCookieExtractor;
    }());
    var HttpXsrfInterceptor = (function() {
      function HttpXsrfInterceptor(tokenService, headerName) {
        this.tokenService = tokenService;
        this.headerName = headerName;
      }
      HttpXsrfInterceptor.prototype.intercept = function(req, next) {
        var lcUrl = req.url.toLowerCase();
        if (req.method === 'GET' || req.method === 'HEAD' || lcUrl.startsWith('http://') || lcUrl.startsWith('https://')) {
          return next.handle(req);
        }
        var token = this.tokenService.getToken();
        if (token !== null && !req.headers.has(this.headerName)) {
          req = req.clone({headers: req.headers.set(this.headerName, token)});
        }
        return next.handle(req);
      };
      HttpXsrfInterceptor.decorators = [{type: _angular_core.Injectable}];
      HttpXsrfInterceptor.ctorParameters = function() {
        return [{type: HttpXsrfTokenExtractor}, {
          type: undefined,
          decorators: [{
            type: _angular_core.Inject,
            args: [XSRF_HEADER_NAME]
          }]
        }];
      };
      return HttpXsrfInterceptor;
    }());
    var HttpInterceptingHandler = (function() {
      function HttpInterceptingHandler(backend, injector) {
        this.backend = backend;
        this.injector = injector;
        this.chain = null;
      }
      HttpInterceptingHandler.prototype.handle = function(req) {
        if (this.chain === null) {
          var interceptors = this.injector.get(HTTP_INTERCEPTORS, []);
          this.chain = interceptors.reduceRight(function(next, interceptor) {
            return new HttpInterceptorHandler(next, interceptor);
          }, this.backend);
        }
        return this.chain.handle(req);
      };
      HttpInterceptingHandler.decorators = [{type: _angular_core.Injectable}];
      HttpInterceptingHandler.ctorParameters = function() {
        return [{type: HttpBackend}, {type: _angular_core.Injector}];
      };
      return HttpInterceptingHandler;
    }());
    function interceptingHandler(backend, interceptors) {
      if (interceptors === void 0) {
        interceptors = [];
      }
      if (!interceptors) {
        return backend;
      }
      return interceptors.reduceRight(function(next, interceptor) {
        return new HttpInterceptorHandler(next, interceptor);
      }, backend);
    }
    function jsonpCallbackContext() {
      if (typeof window === 'object') {
        return window;
      }
      return {};
    }
    var HttpClientXsrfModule = (function() {
      function HttpClientXsrfModule() {}
      HttpClientXsrfModule.disable = function() {
        return {
          ngModule: HttpClientXsrfModule,
          providers: [{
            provide: HttpXsrfInterceptor,
            useClass: NoopInterceptor
          }]
        };
      };
      HttpClientXsrfModule.withOptions = function(options) {
        if (options === void 0) {
          options = {};
        }
        return {
          ngModule: HttpClientXsrfModule,
          providers: [options.cookieName ? {
            provide: XSRF_COOKIE_NAME,
            useValue: options.cookieName
          } : [], options.headerName ? {
            provide: XSRF_HEADER_NAME,
            useValue: options.headerName
          } : []]
        };
      };
      HttpClientXsrfModule.decorators = [{
        type: _angular_core.NgModule,
        args: [{providers: [HttpXsrfInterceptor, {
            provide: HTTP_INTERCEPTORS,
            useExisting: HttpXsrfInterceptor,
            multi: true
          }, {
            provide: HttpXsrfTokenExtractor,
            useClass: HttpXsrfCookieExtractor
          }, {
            provide: XSRF_COOKIE_NAME,
            useValue: 'XSRF-TOKEN'
          }, {
            provide: XSRF_HEADER_NAME,
            useValue: 'X-XSRF-TOKEN'
          }]}]
      }];
      HttpClientXsrfModule.ctorParameters = function() {
        return [];
      };
      return HttpClientXsrfModule;
    }());
    var HttpClientModule = (function() {
      function HttpClientModule() {}
      HttpClientModule.decorators = [{
        type: _angular_core.NgModule,
        args: [{
          imports: [HttpClientXsrfModule.withOptions({
            cookieName: 'XSRF-TOKEN',
            headerName: 'X-XSRF-TOKEN'
          })],
          providers: [HttpClient, {
            provide: HttpHandler,
            useClass: HttpInterceptingHandler
          }, HttpXhrBackend, {
            provide: HttpBackend,
            useExisting: HttpXhrBackend
          }, BrowserXhr, {
            provide: XhrFactory,
            useExisting: BrowserXhr
          }]
        }]
      }];
      HttpClientModule.ctorParameters = function() {
        return [];
      };
      return HttpClientModule;
    }());
    var HttpClientJsonpModule = (function() {
      function HttpClientJsonpModule() {}
      HttpClientJsonpModule.decorators = [{
        type: _angular_core.NgModule,
        args: [{providers: [JsonpClientBackend, {
            provide: JsonpCallbackContext,
            useFactory: jsonpCallbackContext
          }, {
            provide: HTTP_INTERCEPTORS,
            useClass: JsonpInterceptor,
            multi: true
          }]}]
      }];
      HttpClientJsonpModule.ctorParameters = function() {
        return [];
      };
      return HttpClientJsonpModule;
    }());
    exports.HttpBackend = HttpBackend;
    exports.HttpHandler = HttpHandler;
    exports.HttpClient = HttpClient;
    exports.HttpHeaders = HttpHeaders;
    exports.HTTP_INTERCEPTORS = HTTP_INTERCEPTORS;
    exports.JsonpClientBackend = JsonpClientBackend;
    exports.JsonpInterceptor = JsonpInterceptor;
    exports.HttpClientJsonpModule = HttpClientJsonpModule;
    exports.HttpClientModule = HttpClientModule;
    exports.HttpClientXsrfModule = HttpClientXsrfModule;
    exports.ɵinterceptingHandler = interceptingHandler;
    exports.HttpParams = HttpParams;
    exports.HttpUrlEncodingCodec = HttpUrlEncodingCodec;
    exports.HttpRequest = HttpRequest;
    exports.HttpErrorResponse = HttpErrorResponse;
    exports.HttpEventType = HttpEventType;
    exports.HttpHeaderResponse = HttpHeaderResponse;
    exports.HttpResponse = HttpResponse;
    exports.HttpResponseBase = HttpResponseBase;
    exports.HttpXhrBackend = HttpXhrBackend;
    exports.XhrFactory = XhrFactory;
    exports.HttpXsrfTokenExtractor = HttpXsrfTokenExtractor;
    exports.ɵa = NoopInterceptor;
    exports.ɵb = JsonpCallbackContext;
    exports.ɵc = HttpInterceptingHandler;
    exports.ɵd = jsonpCallbackContext;
    exports.ɵe = BrowserXhr;
    exports.ɵh = HttpXsrfCookieExtractor;
    exports.ɵi = HttpXsrfInterceptor;
    exports.ɵf = XSRF_COOKIE_NAME;
    exports.ɵg = XSRF_HEADER_NAME;
    Object.defineProperty(exports, '__esModule', {value: true});
  })));
})(require('process'));
