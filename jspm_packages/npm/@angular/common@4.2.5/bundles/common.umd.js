/* */ 
"format cjs";
(function(process) {
  (function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core')) : typeof define === 'function' && define.amd ? define(['exports', '@angular/core'], factory) : (factory((global.ng = global.ng || {}, global.ng.common = global.ng.common || {}), global.ng.core));
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
    var PlatformLocation = (function() {
      function PlatformLocation() {}
      PlatformLocation.prototype.getBaseHrefFromDOM = function() {};
      PlatformLocation.prototype.onPopState = function(fn) {};
      PlatformLocation.prototype.onHashChange = function(fn) {};
      PlatformLocation.prototype.pathname = function() {};
      PlatformLocation.prototype.search = function() {};
      PlatformLocation.prototype.hash = function() {};
      PlatformLocation.prototype.replaceState = function(state, title, url) {};
      PlatformLocation.prototype.pushState = function(state, title, url) {};
      PlatformLocation.prototype.forward = function() {};
      PlatformLocation.prototype.back = function() {};
      return PlatformLocation;
    }());
    var LOCATION_INITIALIZED = new _angular_core.InjectionToken('Location Initialized');
    var LocationStrategy = (function() {
      function LocationStrategy() {}
      LocationStrategy.prototype.path = function(includeHash) {};
      LocationStrategy.prototype.prepareExternalUrl = function(internal) {};
      LocationStrategy.prototype.pushState = function(state, title, url, queryParams) {};
      LocationStrategy.prototype.replaceState = function(state, title, url, queryParams) {};
      LocationStrategy.prototype.forward = function() {};
      LocationStrategy.prototype.back = function() {};
      LocationStrategy.prototype.onPopState = function(fn) {};
      LocationStrategy.prototype.getBaseHref = function() {};
      return LocationStrategy;
    }());
    var APP_BASE_HREF = new _angular_core.InjectionToken('appBaseHref');
    var Location = (function() {
      function Location(platformStrategy) {
        var _this = this;
        this._subject = new _angular_core.EventEmitter();
        this._platformStrategy = platformStrategy;
        var browserBaseHref = this._platformStrategy.getBaseHref();
        this._baseHref = Location.stripTrailingSlash(_stripIndexHtml(browserBaseHref));
        this._platformStrategy.onPopState(function(ev) {
          _this._subject.emit({
            'url': _this.path(true),
            'pop': true,
            'type': ev.type
          });
        });
      }
      Location.prototype.path = function(includeHash) {
        if (includeHash === void 0) {
          includeHash = false;
        }
        return this.normalize(this._platformStrategy.path(includeHash));
      };
      Location.prototype.isCurrentPathEqualTo = function(path, query) {
        if (query === void 0) {
          query = '';
        }
        return this.path() == this.normalize(path + Location.normalizeQueryParams(query));
      };
      Location.prototype.normalize = function(url) {
        return Location.stripTrailingSlash(_stripBaseHref(this._baseHref, _stripIndexHtml(url)));
      };
      Location.prototype.prepareExternalUrl = function(url) {
        if (url && url[0] !== '/') {
          url = '/' + url;
        }
        return this._platformStrategy.prepareExternalUrl(url);
      };
      Location.prototype.go = function(path, query) {
        if (query === void 0) {
          query = '';
        }
        this._platformStrategy.pushState(null, '', path, query);
      };
      Location.prototype.replaceState = function(path, query) {
        if (query === void 0) {
          query = '';
        }
        this._platformStrategy.replaceState(null, '', path, query);
      };
      Location.prototype.forward = function() {
        this._platformStrategy.forward();
      };
      Location.prototype.back = function() {
        this._platformStrategy.back();
      };
      Location.prototype.subscribe = function(onNext, onThrow, onReturn) {
        return this._subject.subscribe({
          next: onNext,
          error: onThrow,
          complete: onReturn
        });
      };
      Location.normalizeQueryParams = function(params) {
        return params && params[0] !== '?' ? '?' + params : params;
      };
      Location.joinWithSlash = function(start, end) {
        if (start.length == 0) {
          return end;
        }
        if (end.length == 0) {
          return start;
        }
        var slashes = 0;
        if (start.endsWith('/')) {
          slashes++;
        }
        if (end.startsWith('/')) {
          slashes++;
        }
        if (slashes == 2) {
          return start + end.substring(1);
        }
        if (slashes == 1) {
          return start + end;
        }
        return start + '/' + end;
      };
      Location.stripTrailingSlash = function(url) {
        var match = url.match(/#|\?|$/);
        var pathEndIdx = match && match.index || url.length;
        var droppedSlashIdx = pathEndIdx - (url[pathEndIdx - 1] === '/' ? 1 : 0);
        return url.slice(0, droppedSlashIdx) + url.slice(pathEndIdx);
      };
      return Location;
    }());
    Location.decorators = [{type: _angular_core.Injectable}];
    Location.ctorParameters = function() {
      return [{type: LocationStrategy}];
    };
    function _stripBaseHref(baseHref, url) {
      return baseHref && url.startsWith(baseHref) ? url.substring(baseHref.length) : url;
    }
    function _stripIndexHtml(url) {
      return url.replace(/\/index.html$/, '');
    }
    var HashLocationStrategy = (function(_super) {
      __extends(HashLocationStrategy, _super);
      function HashLocationStrategy(_platformLocation, _baseHref) {
        var _this = _super.call(this) || this;
        _this._platformLocation = _platformLocation;
        _this._baseHref = '';
        if (_baseHref != null) {
          _this._baseHref = _baseHref;
        }
        return _this;
      }
      HashLocationStrategy.prototype.onPopState = function(fn) {
        this._platformLocation.onPopState(fn);
        this._platformLocation.onHashChange(fn);
      };
      HashLocationStrategy.prototype.getBaseHref = function() {
        return this._baseHref;
      };
      HashLocationStrategy.prototype.path = function(includeHash) {
        if (includeHash === void 0) {
          includeHash = false;
        }
        var path = this._platformLocation.hash;
        if (path == null)
          path = '#';
        return path.length > 0 ? path.substring(1) : path;
      };
      HashLocationStrategy.prototype.prepareExternalUrl = function(internal) {
        var url = Location.joinWithSlash(this._baseHref, internal);
        return url.length > 0 ? ('#' + url) : url;
      };
      HashLocationStrategy.prototype.pushState = function(state, title, path, queryParams) {
        var url = this.prepareExternalUrl(path + Location.normalizeQueryParams(queryParams));
        if (url.length == 0) {
          url = this._platformLocation.pathname;
        }
        this._platformLocation.pushState(state, title, url);
      };
      HashLocationStrategy.prototype.replaceState = function(state, title, path, queryParams) {
        var url = this.prepareExternalUrl(path + Location.normalizeQueryParams(queryParams));
        if (url.length == 0) {
          url = this._platformLocation.pathname;
        }
        this._platformLocation.replaceState(state, title, url);
      };
      HashLocationStrategy.prototype.forward = function() {
        this._platformLocation.forward();
      };
      HashLocationStrategy.prototype.back = function() {
        this._platformLocation.back();
      };
      return HashLocationStrategy;
    }(LocationStrategy));
    HashLocationStrategy.decorators = [{type: _angular_core.Injectable}];
    HashLocationStrategy.ctorParameters = function() {
      return [{type: PlatformLocation}, {
        type: undefined,
        decorators: [{type: _angular_core.Optional}, {
          type: _angular_core.Inject,
          args: [APP_BASE_HREF]
        }]
      }];
    };
    var PathLocationStrategy = (function(_super) {
      __extends(PathLocationStrategy, _super);
      function PathLocationStrategy(_platformLocation, href) {
        var _this = _super.call(this) || this;
        _this._platformLocation = _platformLocation;
        if (href == null) {
          href = _this._platformLocation.getBaseHrefFromDOM();
        }
        if (href == null) {
          throw new Error("No base href set. Please provide a value for the APP_BASE_HREF token or add a base element to the document.");
        }
        _this._baseHref = href;
        return _this;
      }
      PathLocationStrategy.prototype.onPopState = function(fn) {
        this._platformLocation.onPopState(fn);
        this._platformLocation.onHashChange(fn);
      };
      PathLocationStrategy.prototype.getBaseHref = function() {
        return this._baseHref;
      };
      PathLocationStrategy.prototype.prepareExternalUrl = function(internal) {
        return Location.joinWithSlash(this._baseHref, internal);
      };
      PathLocationStrategy.prototype.path = function(includeHash) {
        if (includeHash === void 0) {
          includeHash = false;
        }
        var pathname = this._platformLocation.pathname + Location.normalizeQueryParams(this._platformLocation.search);
        var hash = this._platformLocation.hash;
        return hash && includeHash ? "" + pathname + hash : pathname;
      };
      PathLocationStrategy.prototype.pushState = function(state, title, url, queryParams) {
        var externalUrl = this.prepareExternalUrl(url + Location.normalizeQueryParams(queryParams));
        this._platformLocation.pushState(state, title, externalUrl);
      };
      PathLocationStrategy.prototype.replaceState = function(state, title, url, queryParams) {
        var externalUrl = this.prepareExternalUrl(url + Location.normalizeQueryParams(queryParams));
        this._platformLocation.replaceState(state, title, externalUrl);
      };
      PathLocationStrategy.prototype.forward = function() {
        this._platformLocation.forward();
      };
      PathLocationStrategy.prototype.back = function() {
        this._platformLocation.back();
      };
      return PathLocationStrategy;
    }(LocationStrategy));
    PathLocationStrategy.decorators = [{type: _angular_core.Injectable}];
    PathLocationStrategy.ctorParameters = function() {
      return [{type: PlatformLocation}, {
        type: undefined,
        decorators: [{type: _angular_core.Optional}, {
          type: _angular_core.Inject,
          args: [APP_BASE_HREF]
        }]
      }];
    };
    var NgLocalization = (function() {
      function NgLocalization() {}
      NgLocalization.prototype.getPluralCategory = function(value) {};
      return NgLocalization;
    }());
    function getPluralCategory(value, cases, ngLocalization) {
      var key = "=" + value;
      if (cases.indexOf(key) > -1) {
        return key;
      }
      key = ngLocalization.getPluralCategory(value);
      if (cases.indexOf(key) > -1) {
        return key;
      }
      if (cases.indexOf('other') > -1) {
        return 'other';
      }
      throw new Error("No plural message found for value \"" + value + "\"");
    }
    var NgLocaleLocalization = (function(_super) {
      __extends(NgLocaleLocalization, _super);
      function NgLocaleLocalization(locale) {
        var _this = _super.call(this) || this;
        _this.locale = locale;
        return _this;
      }
      NgLocaleLocalization.prototype.getPluralCategory = function(value) {
        var plural = getPluralCase(this.locale, value);
        switch (plural) {
          case Plural.Zero:
            return 'zero';
          case Plural.One:
            return 'one';
          case Plural.Two:
            return 'two';
          case Plural.Few:
            return 'few';
          case Plural.Many:
            return 'many';
          default:
            return 'other';
        }
      };
      return NgLocaleLocalization;
    }(NgLocalization));
    NgLocaleLocalization.decorators = [{type: _angular_core.Injectable}];
    NgLocaleLocalization.ctorParameters = function() {
      return [{
        type: undefined,
        decorators: [{
          type: _angular_core.Inject,
          args: [_angular_core.LOCALE_ID]
        }]
      }];
    };
    var Plural = {};
    Plural.Zero = 0;
    Plural.One = 1;
    Plural.Two = 2;
    Plural.Few = 3;
    Plural.Many = 4;
    Plural.Other = 5;
    Plural[Plural.Zero] = "Zero";
    Plural[Plural.One] = "One";
    Plural[Plural.Two] = "Two";
    Plural[Plural.Few] = "Few";
    Plural[Plural.Many] = "Many";
    Plural[Plural.Other] = "Other";
    function getPluralCase(locale, nLike) {
      if (typeof nLike === 'string') {
        nLike = parseInt((nLike), 10);
      }
      var n = (nLike);
      var nDecimal = n.toString().replace(/^[^.]*\.?/, '');
      var i = Math.floor(Math.abs(n));
      var v = nDecimal.length;
      var f = parseInt(nDecimal, 10);
      var t = parseInt(n.toString().replace(/^[^.]*\.?|0+$/g, ''), 10) || 0;
      var lang = locale.split('-')[0].toLowerCase();
      switch (lang) {
        case 'af':
        case 'asa':
        case 'az':
        case 'bem':
        case 'bez':
        case 'bg':
        case 'brx':
        case 'ce':
        case 'cgg':
        case 'chr':
        case 'ckb':
        case 'ee':
        case 'el':
        case 'eo':
        case 'es':
        case 'eu':
        case 'fo':
        case 'fur':
        case 'gsw':
        case 'ha':
        case 'haw':
        case 'hu':
        case 'jgo':
        case 'jmc':
        case 'ka':
        case 'kk':
        case 'kkj':
        case 'kl':
        case 'ks':
        case 'ksb':
        case 'ky':
        case 'lb':
        case 'lg':
        case 'mas':
        case 'mgo':
        case 'ml':
        case 'mn':
        case 'nb':
        case 'nd':
        case 'ne':
        case 'nn':
        case 'nnh':
        case 'nyn':
        case 'om':
        case 'or':
        case 'os':
        case 'ps':
        case 'rm':
        case 'rof':
        case 'rwk':
        case 'saq':
        case 'seh':
        case 'sn':
        case 'so':
        case 'sq':
        case 'ta':
        case 'te':
        case 'teo':
        case 'tk':
        case 'tr':
        case 'ug':
        case 'uz':
        case 'vo':
        case 'vun':
        case 'wae':
        case 'xog':
          if (n === 1)
            return Plural.One;
          return Plural.Other;
        case 'ak':
        case 'ln':
        case 'mg':
        case 'pa':
        case 'ti':
          if (n === Math.floor(n) && n >= 0 && n <= 1)
            return Plural.One;
          return Plural.Other;
        case 'am':
        case 'as':
        case 'bn':
        case 'fa':
        case 'gu':
        case 'hi':
        case 'kn':
        case 'mr':
        case 'zu':
          if (i === 0 || n === 1)
            return Plural.One;
          return Plural.Other;
        case 'ar':
          if (n === 0)
            return Plural.Zero;
          if (n === 1)
            return Plural.One;
          if (n === 2)
            return Plural.Two;
          if (n % 100 === Math.floor(n % 100) && n % 100 >= 3 && n % 100 <= 10)
            return Plural.Few;
          if (n % 100 === Math.floor(n % 100) && n % 100 >= 11 && n % 100 <= 99)
            return Plural.Many;
          return Plural.Other;
        case 'ast':
        case 'ca':
        case 'de':
        case 'en':
        case 'et':
        case 'fi':
        case 'fy':
        case 'gl':
        case 'it':
        case 'nl':
        case 'sv':
        case 'sw':
        case 'ur':
        case 'yi':
          if (i === 1 && v === 0)
            return Plural.One;
          return Plural.Other;
        case 'be':
          if (n % 10 === 1 && !(n % 100 === 11))
            return Plural.One;
          if (n % 10 === Math.floor(n % 10) && n % 10 >= 2 && n % 10 <= 4 && !(n % 100 >= 12 && n % 100 <= 14))
            return Plural.Few;
          if (n % 10 === 0 || n % 10 === Math.floor(n % 10) && n % 10 >= 5 && n % 10 <= 9 || n % 100 === Math.floor(n % 100) && n % 100 >= 11 && n % 100 <= 14)
            return Plural.Many;
          return Plural.Other;
        case 'br':
          if (n % 10 === 1 && !(n % 100 === 11 || n % 100 === 71 || n % 100 === 91))
            return Plural.One;
          if (n % 10 === 2 && !(n % 100 === 12 || n % 100 === 72 || n % 100 === 92))
            return Plural.Two;
          if (n % 10 === Math.floor(n % 10) && (n % 10 >= 3 && n % 10 <= 4 || n % 10 === 9) && !(n % 100 >= 10 && n % 100 <= 19 || n % 100 >= 70 && n % 100 <= 79 || n % 100 >= 90 && n % 100 <= 99))
            return Plural.Few;
          if (!(n === 0) && n % 1e6 === 0)
            return Plural.Many;
          return Plural.Other;
        case 'bs':
        case 'hr':
        case 'sr':
          if (v === 0 && i % 10 === 1 && !(i % 100 === 11) || f % 10 === 1 && !(f % 100 === 11))
            return Plural.One;
          if (v === 0 && i % 10 === Math.floor(i % 10) && i % 10 >= 2 && i % 10 <= 4 && !(i % 100 >= 12 && i % 100 <= 14) || f % 10 === Math.floor(f % 10) && f % 10 >= 2 && f % 10 <= 4 && !(f % 100 >= 12 && f % 100 <= 14))
            return Plural.Few;
          return Plural.Other;
        case 'cs':
        case 'sk':
          if (i === 1 && v === 0)
            return Plural.One;
          if (i === Math.floor(i) && i >= 2 && i <= 4 && v === 0)
            return Plural.Few;
          if (!(v === 0))
            return Plural.Many;
          return Plural.Other;
        case 'cy':
          if (n === 0)
            return Plural.Zero;
          if (n === 1)
            return Plural.One;
          if (n === 2)
            return Plural.Two;
          if (n === 3)
            return Plural.Few;
          if (n === 6)
            return Plural.Many;
          return Plural.Other;
        case 'da':
          if (n === 1 || !(t === 0) && (i === 0 || i === 1))
            return Plural.One;
          return Plural.Other;
        case 'dsb':
        case 'hsb':
          if (v === 0 && i % 100 === 1 || f % 100 === 1)
            return Plural.One;
          if (v === 0 && i % 100 === 2 || f % 100 === 2)
            return Plural.Two;
          if (v === 0 && i % 100 === Math.floor(i % 100) && i % 100 >= 3 && i % 100 <= 4 || f % 100 === Math.floor(f % 100) && f % 100 >= 3 && f % 100 <= 4)
            return Plural.Few;
          return Plural.Other;
        case 'ff':
        case 'fr':
        case 'hy':
        case 'kab':
          if (i === 0 || i === 1)
            return Plural.One;
          return Plural.Other;
        case 'fil':
          if (v === 0 && (i === 1 || i === 2 || i === 3) || v === 0 && !(i % 10 === 4 || i % 10 === 6 || i % 10 === 9) || !(v === 0) && !(f % 10 === 4 || f % 10 === 6 || f % 10 === 9))
            return Plural.One;
          return Plural.Other;
        case 'ga':
          if (n === 1)
            return Plural.One;
          if (n === 2)
            return Plural.Two;
          if (n === Math.floor(n) && n >= 3 && n <= 6)
            return Plural.Few;
          if (n === Math.floor(n) && n >= 7 && n <= 10)
            return Plural.Many;
          return Plural.Other;
        case 'gd':
          if (n === 1 || n === 11)
            return Plural.One;
          if (n === 2 || n === 12)
            return Plural.Two;
          if (n === Math.floor(n) && (n >= 3 && n <= 10 || n >= 13 && n <= 19))
            return Plural.Few;
          return Plural.Other;
        case 'gv':
          if (v === 0 && i % 10 === 1)
            return Plural.One;
          if (v === 0 && i % 10 === 2)
            return Plural.Two;
          if (v === 0 && (i % 100 === 0 || i % 100 === 20 || i % 100 === 40 || i % 100 === 60 || i % 100 === 80))
            return Plural.Few;
          if (!(v === 0))
            return Plural.Many;
          return Plural.Other;
        case 'he':
          if (i === 1 && v === 0)
            return Plural.One;
          if (i === 2 && v === 0)
            return Plural.Two;
          if (v === 0 && !(n >= 0 && n <= 10) && n % 10 === 0)
            return Plural.Many;
          return Plural.Other;
        case 'is':
          if (t === 0 && i % 10 === 1 && !(i % 100 === 11) || !(t === 0))
            return Plural.One;
          return Plural.Other;
        case 'ksh':
          if (n === 0)
            return Plural.Zero;
          if (n === 1)
            return Plural.One;
          return Plural.Other;
        case 'kw':
        case 'naq':
        case 'se':
        case 'smn':
          if (n === 1)
            return Plural.One;
          if (n === 2)
            return Plural.Two;
          return Plural.Other;
        case 'lag':
          if (n === 0)
            return Plural.Zero;
          if ((i === 0 || i === 1) && !(n === 0))
            return Plural.One;
          return Plural.Other;
        case 'lt':
          if (n % 10 === 1 && !(n % 100 >= 11 && n % 100 <= 19))
            return Plural.One;
          if (n % 10 === Math.floor(n % 10) && n % 10 >= 2 && n % 10 <= 9 && !(n % 100 >= 11 && n % 100 <= 19))
            return Plural.Few;
          if (!(f === 0))
            return Plural.Many;
          return Plural.Other;
        case 'lv':
        case 'prg':
          if (n % 10 === 0 || n % 100 === Math.floor(n % 100) && n % 100 >= 11 && n % 100 <= 19 || v === 2 && f % 100 === Math.floor(f % 100) && f % 100 >= 11 && f % 100 <= 19)
            return Plural.Zero;
          if (n % 10 === 1 && !(n % 100 === 11) || v === 2 && f % 10 === 1 && !(f % 100 === 11) || !(v === 2) && f % 10 === 1)
            return Plural.One;
          return Plural.Other;
        case 'mk':
          if (v === 0 && i % 10 === 1 || f % 10 === 1)
            return Plural.One;
          return Plural.Other;
        case 'mt':
          if (n === 1)
            return Plural.One;
          if (n === 0 || n % 100 === Math.floor(n % 100) && n % 100 >= 2 && n % 100 <= 10)
            return Plural.Few;
          if (n % 100 === Math.floor(n % 100) && n % 100 >= 11 && n % 100 <= 19)
            return Plural.Many;
          return Plural.Other;
        case 'pl':
          if (i === 1 && v === 0)
            return Plural.One;
          if (v === 0 && i % 10 === Math.floor(i % 10) && i % 10 >= 2 && i % 10 <= 4 && !(i % 100 >= 12 && i % 100 <= 14))
            return Plural.Few;
          if (v === 0 && !(i === 1) && i % 10 === Math.floor(i % 10) && i % 10 >= 0 && i % 10 <= 1 || v === 0 && i % 10 === Math.floor(i % 10) && i % 10 >= 5 && i % 10 <= 9 || v === 0 && i % 100 === Math.floor(i % 100) && i % 100 >= 12 && i % 100 <= 14)
            return Plural.Many;
          return Plural.Other;
        case 'pt':
          if (n === Math.floor(n) && n >= 0 && n <= 2 && !(n === 2))
            return Plural.One;
          return Plural.Other;
        case 'ro':
          if (i === 1 && v === 0)
            return Plural.One;
          if (!(v === 0) || n === 0 || !(n === 1) && n % 100 === Math.floor(n % 100) && n % 100 >= 1 && n % 100 <= 19)
            return Plural.Few;
          return Plural.Other;
        case 'ru':
        case 'uk':
          if (v === 0 && i % 10 === 1 && !(i % 100 === 11))
            return Plural.One;
          if (v === 0 && i % 10 === Math.floor(i % 10) && i % 10 >= 2 && i % 10 <= 4 && !(i % 100 >= 12 && i % 100 <= 14))
            return Plural.Few;
          if (v === 0 && i % 10 === 0 || v === 0 && i % 10 === Math.floor(i % 10) && i % 10 >= 5 && i % 10 <= 9 || v === 0 && i % 100 === Math.floor(i % 100) && i % 100 >= 11 && i % 100 <= 14)
            return Plural.Many;
          return Plural.Other;
        case 'shi':
          if (i === 0 || n === 1)
            return Plural.One;
          if (n === Math.floor(n) && n >= 2 && n <= 10)
            return Plural.Few;
          return Plural.Other;
        case 'si':
          if (n === 0 || n === 1 || i === 0 && f === 1)
            return Plural.One;
          return Plural.Other;
        case 'sl':
          if (v === 0 && i % 100 === 1)
            return Plural.One;
          if (v === 0 && i % 100 === 2)
            return Plural.Two;
          if (v === 0 && i % 100 === Math.floor(i % 100) && i % 100 >= 3 && i % 100 <= 4 || !(v === 0))
            return Plural.Few;
          return Plural.Other;
        case 'tzm':
          if (n === Math.floor(n) && n >= 0 && n <= 1 || n === Math.floor(n) && n >= 11 && n <= 99)
            return Plural.One;
          return Plural.Other;
        default:
          return Plural.Other;
      }
    }
    var NgClass = (function() {
      function NgClass(_iterableDiffers, _keyValueDiffers, _ngEl, _renderer) {
        this._iterableDiffers = _iterableDiffers;
        this._keyValueDiffers = _keyValueDiffers;
        this._ngEl = _ngEl;
        this._renderer = _renderer;
        this._initialClasses = [];
      }
      Object.defineProperty(NgClass.prototype, "klass", {
        set: function(v) {
          this._applyInitialClasses(true);
          this._initialClasses = typeof v === 'string' ? v.split(/\s+/) : [];
          this._applyInitialClasses(false);
          this._applyClasses(this._rawClass, false);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(NgClass.prototype, "ngClass", {
        set: function(v) {
          this._cleanupClasses(this._rawClass);
          this._iterableDiffer = null;
          this._keyValueDiffer = null;
          this._rawClass = typeof v === 'string' ? v.split(/\s+/) : v;
          if (this._rawClass) {
            if (_angular_core.ɵisListLikeIterable(this._rawClass)) {
              this._iterableDiffer = this._iterableDiffers.find(this._rawClass).create();
            } else {
              this._keyValueDiffer = this._keyValueDiffers.find(this._rawClass).create();
            }
          }
        },
        enumerable: true,
        configurable: true
      });
      NgClass.prototype.ngDoCheck = function() {
        if (this._iterableDiffer) {
          var iterableChanges = this._iterableDiffer.diff((this._rawClass));
          if (iterableChanges) {
            this._applyIterableChanges(iterableChanges);
          }
        } else if (this._keyValueDiffer) {
          var keyValueChanges = this._keyValueDiffer.diff((this._rawClass));
          if (keyValueChanges) {
            this._applyKeyValueChanges(keyValueChanges);
          }
        }
      };
      NgClass.prototype._cleanupClasses = function(rawClassVal) {
        this._applyClasses(rawClassVal, true);
        this._applyInitialClasses(false);
      };
      NgClass.prototype._applyKeyValueChanges = function(changes) {
        var _this = this;
        changes.forEachAddedItem(function(record) {
          return _this._toggleClass(record.key, record.currentValue);
        });
        changes.forEachChangedItem(function(record) {
          return _this._toggleClass(record.key, record.currentValue);
        });
        changes.forEachRemovedItem(function(record) {
          if (record.previousValue) {
            _this._toggleClass(record.key, false);
          }
        });
      };
      NgClass.prototype._applyIterableChanges = function(changes) {
        var _this = this;
        changes.forEachAddedItem(function(record) {
          if (typeof record.item === 'string') {
            _this._toggleClass(record.item, true);
          } else {
            throw new Error("NgClass can only toggle CSS classes expressed as strings, got " + _angular_core.ɵstringify(record.item));
          }
        });
        changes.forEachRemovedItem(function(record) {
          return _this._toggleClass(record.item, false);
        });
      };
      NgClass.prototype._applyInitialClasses = function(isCleanup) {
        var _this = this;
        this._initialClasses.forEach(function(klass) {
          return _this._toggleClass(klass, !isCleanup);
        });
      };
      NgClass.prototype._applyClasses = function(rawClassVal, isCleanup) {
        var _this = this;
        if (rawClassVal) {
          if (Array.isArray(rawClassVal) || rawClassVal instanceof Set) {
            ((rawClassVal)).forEach(function(klass) {
              return _this._toggleClass(klass, !isCleanup);
            });
          } else {
            Object.keys(rawClassVal).forEach(function(klass) {
              if (rawClassVal[klass] != null)
                _this._toggleClass(klass, !isCleanup);
            });
          }
        }
      };
      NgClass.prototype._toggleClass = function(klass, enabled) {
        var _this = this;
        klass = klass.trim();
        if (klass) {
          klass.split(/\s+/g).forEach(function(klass) {
            _this._renderer.setElementClass(_this._ngEl.nativeElement, klass, !!enabled);
          });
        }
      };
      return NgClass;
    }());
    NgClass.decorators = [{
      type: _angular_core.Directive,
      args: [{selector: '[ngClass]'}]
    }];
    NgClass.ctorParameters = function() {
      return [{type: _angular_core.IterableDiffers}, {type: _angular_core.KeyValueDiffers}, {type: _angular_core.ElementRef}, {type: _angular_core.Renderer}];
    };
    NgClass.propDecorators = {
      'klass': [{
        type: _angular_core.Input,
        args: ['class']
      }],
      'ngClass': [{type: _angular_core.Input}]
    };
    var NgComponentOutlet = (function() {
      function NgComponentOutlet(_viewContainerRef) {
        this._viewContainerRef = _viewContainerRef;
        this._componentRef = null;
        this._moduleRef = null;
      }
      NgComponentOutlet.prototype.ngOnChanges = function(changes) {
        this._viewContainerRef.clear();
        this._componentRef = null;
        if (this.ngComponentOutlet) {
          var elInjector = this.ngComponentOutletInjector || this._viewContainerRef.parentInjector;
          if (changes['ngComponentOutletNgModuleFactory']) {
            if (this._moduleRef)
              this._moduleRef.destroy();
            if (this.ngComponentOutletNgModuleFactory) {
              var parentModule = elInjector.get(_angular_core.NgModuleRef);
              this._moduleRef = this.ngComponentOutletNgModuleFactory.create(parentModule.injector);
            } else {
              this._moduleRef = null;
            }
          }
          var componentFactoryResolver = this._moduleRef ? this._moduleRef.componentFactoryResolver : elInjector.get(_angular_core.ComponentFactoryResolver);
          var componentFactory = componentFactoryResolver.resolveComponentFactory(this.ngComponentOutlet);
          this._componentRef = this._viewContainerRef.createComponent(componentFactory, this._viewContainerRef.length, elInjector, this.ngComponentOutletContent);
        }
      };
      NgComponentOutlet.prototype.ngOnDestroy = function() {
        if (this._moduleRef)
          this._moduleRef.destroy();
      };
      return NgComponentOutlet;
    }());
    NgComponentOutlet.decorators = [{
      type: _angular_core.Directive,
      args: [{selector: '[ngComponentOutlet]'}]
    }];
    NgComponentOutlet.ctorParameters = function() {
      return [{type: _angular_core.ViewContainerRef}];
    };
    NgComponentOutlet.propDecorators = {
      'ngComponentOutlet': [{type: _angular_core.Input}],
      'ngComponentOutletInjector': [{type: _angular_core.Input}],
      'ngComponentOutletContent': [{type: _angular_core.Input}],
      'ngComponentOutletNgModuleFactory': [{type: _angular_core.Input}]
    };
    var NgForOfContext = (function() {
      function NgForOfContext($implicit, ngForOf, index, count) {
        this.$implicit = $implicit;
        this.ngForOf = ngForOf;
        this.index = index;
        this.count = count;
      }
      Object.defineProperty(NgForOfContext.prototype, "first", {
        get: function() {
          return this.index === 0;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(NgForOfContext.prototype, "last", {
        get: function() {
          return this.index === this.count - 1;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(NgForOfContext.prototype, "even", {
        get: function() {
          return this.index % 2 === 0;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(NgForOfContext.prototype, "odd", {
        get: function() {
          return !this.even;
        },
        enumerable: true,
        configurable: true
      });
      return NgForOfContext;
    }());
    var NgForOf = (function() {
      function NgForOf(_viewContainer, _template, _differs) {
        this._viewContainer = _viewContainer;
        this._template = _template;
        this._differs = _differs;
        this._differ = null;
      }
      Object.defineProperty(NgForOf.prototype, "ngForTrackBy", {
        get: function() {
          return this._trackByFn;
        },
        set: function(fn) {
          if (_angular_core.isDevMode() && fn != null && typeof fn !== 'function') {
            if ((console) && (console.warn)) {
              console.warn("trackBy must be a function, but received " + JSON.stringify(fn) + ". " + "See https://angular.io/docs/ts/latest/api/common/index/NgFor-directive.html#!#change-propagation for more information.");
            }
          }
          this._trackByFn = fn;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(NgForOf.prototype, "ngForTemplate", {
        set: function(value) {
          if (value) {
            this._template = value;
          }
        },
        enumerable: true,
        configurable: true
      });
      NgForOf.prototype.ngOnChanges = function(changes) {
        if ('ngForOf' in changes) {
          var value = changes['ngForOf'].currentValue;
          if (!this._differ && value) {
            try {
              this._differ = this._differs.find(value).create(this.ngForTrackBy);
            } catch (e) {
              throw new Error("Cannot find a differ supporting object '" + value + "' of type '" + getTypeNameForDebugging(value) + "'. NgFor only supports binding to Iterables such as Arrays.");
            }
          }
        }
      };
      NgForOf.prototype.ngDoCheck = function() {
        if (this._differ) {
          var changes = this._differ.diff(this.ngForOf);
          if (changes)
            this._applyChanges(changes);
        }
      };
      NgForOf.prototype._applyChanges = function(changes) {
        var _this = this;
        var insertTuples = [];
        changes.forEachOperation(function(item, adjustedPreviousIndex, currentIndex) {
          if (item.previousIndex == null) {
            var view = _this._viewContainer.createEmbeddedView(_this._template, new NgForOfContext(((null)), _this.ngForOf, -1, -1), currentIndex);
            var tuple = new RecordViewTuple(item, view);
            insertTuples.push(tuple);
          } else if (currentIndex == null) {
            _this._viewContainer.remove(adjustedPreviousIndex);
          } else {
            var view = ((_this._viewContainer.get(adjustedPreviousIndex)));
            _this._viewContainer.move(view, currentIndex);
            var tuple = new RecordViewTuple(item, (view));
            insertTuples.push(tuple);
          }
        });
        for (var i = 0; i < insertTuples.length; i++) {
          this._perViewChange(insertTuples[i].view, insertTuples[i].record);
        }
        for (var i = 0,
            ilen = this._viewContainer.length; i < ilen; i++) {
          var viewRef = (this._viewContainer.get(i));
          viewRef.context.index = i;
          viewRef.context.count = ilen;
        }
        changes.forEachIdentityChange(function(record) {
          var viewRef = (_this._viewContainer.get(record.currentIndex));
          viewRef.context.$implicit = record.item;
        });
      };
      NgForOf.prototype._perViewChange = function(view, record) {
        view.context.$implicit = record.item;
      };
      return NgForOf;
    }());
    NgForOf.decorators = [{
      type: _angular_core.Directive,
      args: [{selector: '[ngFor][ngForOf]'}]
    }];
    NgForOf.ctorParameters = function() {
      return [{type: _angular_core.ViewContainerRef}, {type: _angular_core.TemplateRef}, {type: _angular_core.IterableDiffers}];
    };
    NgForOf.propDecorators = {
      'ngForOf': [{type: _angular_core.Input}],
      'ngForTrackBy': [{type: _angular_core.Input}],
      'ngForTemplate': [{type: _angular_core.Input}]
    };
    var RecordViewTuple = (function() {
      function RecordViewTuple(record, view) {
        this.record = record;
        this.view = view;
      }
      return RecordViewTuple;
    }());
    var NgFor = NgForOf;
    function getTypeNameForDebugging(type) {
      return type['name'] || typeof type;
    }
    var NgIf = (function() {
      function NgIf(_viewContainer, templateRef) {
        this._viewContainer = _viewContainer;
        this._context = new NgIfContext();
        this._thenTemplateRef = null;
        this._elseTemplateRef = null;
        this._thenViewRef = null;
        this._elseViewRef = null;
        this._thenTemplateRef = templateRef;
      }
      Object.defineProperty(NgIf.prototype, "ngIf", {
        set: function(condition) {
          this._context.$implicit = this._context.ngIf = condition;
          this._updateView();
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(NgIf.prototype, "ngIfThen", {
        set: function(templateRef) {
          this._thenTemplateRef = templateRef;
          this._thenViewRef = null;
          this._updateView();
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(NgIf.prototype, "ngIfElse", {
        set: function(templateRef) {
          this._elseTemplateRef = templateRef;
          this._elseViewRef = null;
          this._updateView();
        },
        enumerable: true,
        configurable: true
      });
      NgIf.prototype._updateView = function() {
        if (this._context.$implicit) {
          if (!this._thenViewRef) {
            this._viewContainer.clear();
            this._elseViewRef = null;
            if (this._thenTemplateRef) {
              this._thenViewRef = this._viewContainer.createEmbeddedView(this._thenTemplateRef, this._context);
            }
          }
        } else {
          if (!this._elseViewRef) {
            this._viewContainer.clear();
            this._thenViewRef = null;
            if (this._elseTemplateRef) {
              this._elseViewRef = this._viewContainer.createEmbeddedView(this._elseTemplateRef, this._context);
            }
          }
        }
      };
      return NgIf;
    }());
    NgIf.decorators = [{
      type: _angular_core.Directive,
      args: [{selector: '[ngIf]'}]
    }];
    NgIf.ctorParameters = function() {
      return [{type: _angular_core.ViewContainerRef}, {type: _angular_core.TemplateRef}];
    };
    NgIf.propDecorators = {
      'ngIf': [{type: _angular_core.Input}],
      'ngIfThen': [{type: _angular_core.Input}],
      'ngIfElse': [{type: _angular_core.Input}]
    };
    var NgIfContext = (function() {
      function NgIfContext() {
        this.$implicit = null;
        this.ngIf = null;
      }
      return NgIfContext;
    }());
    var SwitchView = (function() {
      function SwitchView(_viewContainerRef, _templateRef) {
        this._viewContainerRef = _viewContainerRef;
        this._templateRef = _templateRef;
        this._created = false;
      }
      SwitchView.prototype.create = function() {
        this._created = true;
        this._viewContainerRef.createEmbeddedView(this._templateRef);
      };
      SwitchView.prototype.destroy = function() {
        this._created = false;
        this._viewContainerRef.clear();
      };
      SwitchView.prototype.enforceState = function(created) {
        if (created && !this._created) {
          this.create();
        } else if (!created && this._created) {
          this.destroy();
        }
      };
      return SwitchView;
    }());
    var NgSwitch = (function() {
      function NgSwitch() {
        this._defaultUsed = false;
        this._caseCount = 0;
        this._lastCaseCheckIndex = 0;
        this._lastCasesMatched = false;
      }
      Object.defineProperty(NgSwitch.prototype, "ngSwitch", {
        set: function(newValue) {
          this._ngSwitch = newValue;
          if (this._caseCount === 0) {
            this._updateDefaultCases(true);
          }
        },
        enumerable: true,
        configurable: true
      });
      NgSwitch.prototype._addCase = function() {
        return this._caseCount++;
      };
      NgSwitch.prototype._addDefault = function(view) {
        if (!this._defaultViews) {
          this._defaultViews = [];
        }
        this._defaultViews.push(view);
      };
      NgSwitch.prototype._matchCase = function(value) {
        var matched = value == this._ngSwitch;
        this._lastCasesMatched = this._lastCasesMatched || matched;
        this._lastCaseCheckIndex++;
        if (this._lastCaseCheckIndex === this._caseCount) {
          this._updateDefaultCases(!this._lastCasesMatched);
          this._lastCaseCheckIndex = 0;
          this._lastCasesMatched = false;
        }
        return matched;
      };
      NgSwitch.prototype._updateDefaultCases = function(useDefault) {
        if (this._defaultViews && useDefault !== this._defaultUsed) {
          this._defaultUsed = useDefault;
          for (var i = 0; i < this._defaultViews.length; i++) {
            var defaultView = this._defaultViews[i];
            defaultView.enforceState(useDefault);
          }
        }
      };
      return NgSwitch;
    }());
    NgSwitch.decorators = [{
      type: _angular_core.Directive,
      args: [{selector: '[ngSwitch]'}]
    }];
    NgSwitch.ctorParameters = function() {
      return [];
    };
    NgSwitch.propDecorators = {'ngSwitch': [{type: _angular_core.Input}]};
    var NgSwitchCase = (function() {
      function NgSwitchCase(viewContainer, templateRef, ngSwitch) {
        this.ngSwitch = ngSwitch;
        ngSwitch._addCase();
        this._view = new SwitchView(viewContainer, templateRef);
      }
      NgSwitchCase.prototype.ngDoCheck = function() {
        this._view.enforceState(this.ngSwitch._matchCase(this.ngSwitchCase));
      };
      return NgSwitchCase;
    }());
    NgSwitchCase.decorators = [{
      type: _angular_core.Directive,
      args: [{selector: '[ngSwitchCase]'}]
    }];
    NgSwitchCase.ctorParameters = function() {
      return [{type: _angular_core.ViewContainerRef}, {type: _angular_core.TemplateRef}, {
        type: NgSwitch,
        decorators: [{type: _angular_core.Host}]
      }];
    };
    NgSwitchCase.propDecorators = {'ngSwitchCase': [{type: _angular_core.Input}]};
    var NgSwitchDefault = (function() {
      function NgSwitchDefault(viewContainer, templateRef, ngSwitch) {
        ngSwitch._addDefault(new SwitchView(viewContainer, templateRef));
      }
      return NgSwitchDefault;
    }());
    NgSwitchDefault.decorators = [{
      type: _angular_core.Directive,
      args: [{selector: '[ngSwitchDefault]'}]
    }];
    NgSwitchDefault.ctorParameters = function() {
      return [{type: _angular_core.ViewContainerRef}, {type: _angular_core.TemplateRef}, {
        type: NgSwitch,
        decorators: [{type: _angular_core.Host}]
      }];
    };
    var NgPlural = (function() {
      function NgPlural(_localization) {
        this._localization = _localization;
        this._caseViews = {};
      }
      Object.defineProperty(NgPlural.prototype, "ngPlural", {
        set: function(value) {
          this._switchValue = value;
          this._updateView();
        },
        enumerable: true,
        configurable: true
      });
      NgPlural.prototype.addCase = function(value, switchView) {
        this._caseViews[value] = switchView;
      };
      NgPlural.prototype._updateView = function() {
        this._clearViews();
        var cases = Object.keys(this._caseViews);
        var key = getPluralCategory(this._switchValue, cases, this._localization);
        this._activateView(this._caseViews[key]);
      };
      NgPlural.prototype._clearViews = function() {
        if (this._activeView)
          this._activeView.destroy();
      };
      NgPlural.prototype._activateView = function(view) {
        if (view) {
          this._activeView = view;
          this._activeView.create();
        }
      };
      return NgPlural;
    }());
    NgPlural.decorators = [{
      type: _angular_core.Directive,
      args: [{selector: '[ngPlural]'}]
    }];
    NgPlural.ctorParameters = function() {
      return [{type: NgLocalization}];
    };
    NgPlural.propDecorators = {'ngPlural': [{type: _angular_core.Input}]};
    var NgPluralCase = (function() {
      function NgPluralCase(value, template, viewContainer, ngPlural) {
        this.value = value;
        var isANumber = !isNaN(Number(value));
        ngPlural.addCase(isANumber ? "=" + value : value, new SwitchView(viewContainer, template));
      }
      return NgPluralCase;
    }());
    NgPluralCase.decorators = [{
      type: _angular_core.Directive,
      args: [{selector: '[ngPluralCase]'}]
    }];
    NgPluralCase.ctorParameters = function() {
      return [{
        type: undefined,
        decorators: [{
          type: _angular_core.Attribute,
          args: ['ngPluralCase']
        }]
      }, {type: _angular_core.TemplateRef}, {type: _angular_core.ViewContainerRef}, {
        type: NgPlural,
        decorators: [{type: _angular_core.Host}]
      }];
    };
    var NgStyle = (function() {
      function NgStyle(_differs, _ngEl, _renderer) {
        this._differs = _differs;
        this._ngEl = _ngEl;
        this._renderer = _renderer;
      }
      Object.defineProperty(NgStyle.prototype, "ngStyle", {
        set: function(v) {
          this._ngStyle = v;
          if (!this._differ && v) {
            this._differ = this._differs.find(v).create();
          }
        },
        enumerable: true,
        configurable: true
      });
      NgStyle.prototype.ngDoCheck = function() {
        if (this._differ) {
          var changes = this._differ.diff(this._ngStyle);
          if (changes) {
            this._applyChanges(changes);
          }
        }
      };
      NgStyle.prototype._applyChanges = function(changes) {
        var _this = this;
        changes.forEachRemovedItem(function(record) {
          return _this._setStyle(record.key, null);
        });
        changes.forEachAddedItem(function(record) {
          return _this._setStyle(record.key, record.currentValue);
        });
        changes.forEachChangedItem(function(record) {
          return _this._setStyle(record.key, record.currentValue);
        });
      };
      NgStyle.prototype._setStyle = function(nameAndUnit, value) {
        var _a = nameAndUnit.split('.'),
            name = _a[0],
            unit = _a[1];
        value = value != null && unit ? "" + value + unit : value;
        this._renderer.setElementStyle(this._ngEl.nativeElement, name, (value));
      };
      return NgStyle;
    }());
    NgStyle.decorators = [{
      type: _angular_core.Directive,
      args: [{selector: '[ngStyle]'}]
    }];
    NgStyle.ctorParameters = function() {
      return [{type: _angular_core.KeyValueDiffers}, {type: _angular_core.ElementRef}, {type: _angular_core.Renderer}];
    };
    NgStyle.propDecorators = {'ngStyle': [{type: _angular_core.Input}]};
    var NgTemplateOutlet = (function() {
      function NgTemplateOutlet(_viewContainerRef) {
        this._viewContainerRef = _viewContainerRef;
      }
      Object.defineProperty(NgTemplateOutlet.prototype, "ngOutletContext", {
        set: function(context) {
          this.ngTemplateOutletContext = context;
        },
        enumerable: true,
        configurable: true
      });
      NgTemplateOutlet.prototype.ngOnChanges = function(changes) {
        if (this._viewRef) {
          this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._viewRef));
        }
        if (this.ngTemplateOutlet) {
          this._viewRef = this._viewContainerRef.createEmbeddedView(this.ngTemplateOutlet, this.ngTemplateOutletContext);
        }
      };
      return NgTemplateOutlet;
    }());
    NgTemplateOutlet.decorators = [{
      type: _angular_core.Directive,
      args: [{selector: '[ngTemplateOutlet]'}]
    }];
    NgTemplateOutlet.ctorParameters = function() {
      return [{type: _angular_core.ViewContainerRef}];
    };
    NgTemplateOutlet.propDecorators = {
      'ngTemplateOutletContext': [{type: _angular_core.Input}],
      'ngTemplateOutlet': [{type: _angular_core.Input}],
      'ngOutletContext': [{type: _angular_core.Input}]
    };
    var COMMON_DIRECTIVES = [NgClass, NgComponentOutlet, NgForOf, NgIf, NgTemplateOutlet, NgStyle, NgSwitch, NgSwitchCase, NgSwitchDefault, NgPlural, NgPluralCase];
    function invalidPipeArgumentError(type, value) {
      return Error("InvalidPipeArgument: '" + value + "' for pipe '" + _angular_core.ɵstringify(type) + "'");
    }
    var ObservableStrategy = (function() {
      function ObservableStrategy() {}
      ObservableStrategy.prototype.createSubscription = function(async, updateLatestValue) {
        return async.subscribe({
          next: updateLatestValue,
          error: function(e) {
            throw e;
          }
        });
      };
      ObservableStrategy.prototype.dispose = function(subscription) {
        subscription.unsubscribe();
      };
      ObservableStrategy.prototype.onDestroy = function(subscription) {
        subscription.unsubscribe();
      };
      return ObservableStrategy;
    }());
    var PromiseStrategy = (function() {
      function PromiseStrategy() {}
      PromiseStrategy.prototype.createSubscription = function(async, updateLatestValue) {
        return async.then(updateLatestValue, function(e) {
          throw e;
        });
      };
      PromiseStrategy.prototype.dispose = function(subscription) {};
      PromiseStrategy.prototype.onDestroy = function(subscription) {};
      return PromiseStrategy;
    }());
    var _promiseStrategy = new PromiseStrategy();
    var _observableStrategy = new ObservableStrategy();
    var AsyncPipe = (function() {
      function AsyncPipe(_ref) {
        this._ref = _ref;
        this._latestValue = null;
        this._latestReturnedValue = null;
        this._subscription = null;
        this._obj = null;
        this._strategy = ((null));
      }
      AsyncPipe.prototype.ngOnDestroy = function() {
        if (this._subscription) {
          this._dispose();
        }
      };
      AsyncPipe.prototype.transform = function(obj) {
        if (!this._obj) {
          if (obj) {
            this._subscribe(obj);
          }
          this._latestReturnedValue = this._latestValue;
          return this._latestValue;
        }
        if (obj !== this._obj) {
          this._dispose();
          return this.transform((obj));
        }
        if (this._latestValue === this._latestReturnedValue) {
          return this._latestReturnedValue;
        }
        this._latestReturnedValue = this._latestValue;
        return _angular_core.WrappedValue.wrap(this._latestValue);
      };
      AsyncPipe.prototype._subscribe = function(obj) {
        var _this = this;
        this._obj = obj;
        this._strategy = this._selectStrategy(obj);
        this._subscription = this._strategy.createSubscription(obj, function(value) {
          return _this._updateLatestValue(obj, value);
        });
      };
      AsyncPipe.prototype._selectStrategy = function(obj) {
        if (_angular_core.ɵisPromise(obj)) {
          return _promiseStrategy;
        }
        if (_angular_core.ɵisObservable(obj)) {
          return _observableStrategy;
        }
        throw invalidPipeArgumentError(AsyncPipe, obj);
      };
      AsyncPipe.prototype._dispose = function() {
        this._strategy.dispose(((this._subscription)));
        this._latestValue = null;
        this._latestReturnedValue = null;
        this._subscription = null;
        this._obj = null;
      };
      AsyncPipe.prototype._updateLatestValue = function(async, value) {
        if (async === this._obj) {
          this._latestValue = value;
          this._ref.markForCheck();
        }
      };
      return AsyncPipe;
    }());
    AsyncPipe.decorators = [{
      type: _angular_core.Pipe,
      args: [{
        name: 'async',
        pure: false
      }]
    }];
    AsyncPipe.ctorParameters = function() {
      return [{type: _angular_core.ChangeDetectorRef}];
    };
    var LowerCasePipe = (function() {
      function LowerCasePipe() {}
      LowerCasePipe.prototype.transform = function(value) {
        if (!value)
          return value;
        if (typeof value !== 'string') {
          throw invalidPipeArgumentError(LowerCasePipe, value);
        }
        return value.toLowerCase();
      };
      return LowerCasePipe;
    }());
    LowerCasePipe.decorators = [{
      type: _angular_core.Pipe,
      args: [{name: 'lowercase'}]
    }];
    LowerCasePipe.ctorParameters = function() {
      return [];
    };
    function titleCaseWord(word) {
      if (!word)
        return word;
      return word[0].toUpperCase() + word.substr(1).toLowerCase();
    }
    var TitleCasePipe = (function() {
      function TitleCasePipe() {}
      TitleCasePipe.prototype.transform = function(value) {
        if (!value)
          return value;
        if (typeof value !== 'string') {
          throw invalidPipeArgumentError(TitleCasePipe, value);
        }
        return value.split(/\b/g).map(function(word) {
          return titleCaseWord(word);
        }).join('');
      };
      return TitleCasePipe;
    }());
    TitleCasePipe.decorators = [{
      type: _angular_core.Pipe,
      args: [{name: 'titlecase'}]
    }];
    TitleCasePipe.ctorParameters = function() {
      return [];
    };
    var UpperCasePipe = (function() {
      function UpperCasePipe() {}
      UpperCasePipe.prototype.transform = function(value) {
        if (!value)
          return value;
        if (typeof value !== 'string') {
          throw invalidPipeArgumentError(UpperCasePipe, value);
        }
        return value.toUpperCase();
      };
      return UpperCasePipe;
    }());
    UpperCasePipe.decorators = [{
      type: _angular_core.Pipe,
      args: [{name: 'uppercase'}]
    }];
    UpperCasePipe.ctorParameters = function() {
      return [];
    };
    var NumberFormatStyle = {};
    NumberFormatStyle.Decimal = 0;
    NumberFormatStyle.Percent = 1;
    NumberFormatStyle.Currency = 2;
    NumberFormatStyle[NumberFormatStyle.Decimal] = "Decimal";
    NumberFormatStyle[NumberFormatStyle.Percent] = "Percent";
    NumberFormatStyle[NumberFormatStyle.Currency] = "Currency";
    var NumberFormatter = (function() {
      function NumberFormatter() {}
      NumberFormatter.format = function(num, locale, style, opts) {
        if (opts === void 0) {
          opts = {};
        }
        var minimumIntegerDigits = opts.minimumIntegerDigits,
            minimumFractionDigits = opts.minimumFractionDigits,
            maximumFractionDigits = opts.maximumFractionDigits,
            currency = opts.currency,
            _a = opts.currencyAsSymbol,
            currencyAsSymbol = _a === void 0 ? false : _a;
        var options = {
          minimumIntegerDigits: minimumIntegerDigits,
          minimumFractionDigits: minimumFractionDigits,
          maximumFractionDigits: maximumFractionDigits,
          style: NumberFormatStyle[style].toLowerCase()
        };
        if (style == NumberFormatStyle.Currency) {
          options.currency = typeof currency == 'string' ? currency : undefined;
          options.currencyDisplay = currencyAsSymbol ? 'symbol' : 'code';
        }
        return new Intl.NumberFormat(locale, options).format(num);
      };
      return NumberFormatter;
    }());
    var DATE_FORMATS_SPLIT = /((?:[^yMLdHhmsazZEwGjJ']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|L+|d+|H+|h+|J+|j+|m+|s+|a|z|Z|G+|w+))(.*)/;
    var PATTERN_ALIASES = {
      'yMMMdjms': datePartGetterFactory(combine([digitCondition('year', 1), nameCondition('month', 3), digitCondition('day', 1), digitCondition('hour', 1), digitCondition('minute', 1), digitCondition('second', 1)])),
      'yMdjm': datePartGetterFactory(combine([digitCondition('year', 1), digitCondition('month', 1), digitCondition('day', 1), digitCondition('hour', 1), digitCondition('minute', 1)])),
      'yMMMMEEEEd': datePartGetterFactory(combine([digitCondition('year', 1), nameCondition('month', 4), nameCondition('weekday', 4), digitCondition('day', 1)])),
      'yMMMMd': datePartGetterFactory(combine([digitCondition('year', 1), nameCondition('month', 4), digitCondition('day', 1)])),
      'yMMMd': datePartGetterFactory(combine([digitCondition('year', 1), nameCondition('month', 3), digitCondition('day', 1)])),
      'yMd': datePartGetterFactory(combine([digitCondition('year', 1), digitCondition('month', 1), digitCondition('day', 1)])),
      'jms': datePartGetterFactory(combine([digitCondition('hour', 1), digitCondition('second', 1), digitCondition('minute', 1)])),
      'jm': datePartGetterFactory(combine([digitCondition('hour', 1), digitCondition('minute', 1)]))
    };
    var DATE_FORMATS = {
      'yyyy': datePartGetterFactory(digitCondition('year', 4)),
      'yy': datePartGetterFactory(digitCondition('year', 2)),
      'y': datePartGetterFactory(digitCondition('year', 1)),
      'MMMM': datePartGetterFactory(nameCondition('month', 4)),
      'MMM': datePartGetterFactory(nameCondition('month', 3)),
      'MM': datePartGetterFactory(digitCondition('month', 2)),
      'M': datePartGetterFactory(digitCondition('month', 1)),
      'LLLL': datePartGetterFactory(nameCondition('month', 4)),
      'L': datePartGetterFactory(nameCondition('month', 1)),
      'dd': datePartGetterFactory(digitCondition('day', 2)),
      'd': datePartGetterFactory(digitCondition('day', 1)),
      'HH': digitModifier(hourExtractor(datePartGetterFactory(hour12Modify(digitCondition('hour', 2), false)))),
      'H': hourExtractor(datePartGetterFactory(hour12Modify(digitCondition('hour', 1), false))),
      'hh': digitModifier(hourExtractor(datePartGetterFactory(hour12Modify(digitCondition('hour', 2), true)))),
      'h': hourExtractor(datePartGetterFactory(hour12Modify(digitCondition('hour', 1), true))),
      'jj': datePartGetterFactory(digitCondition('hour', 2)),
      'j': datePartGetterFactory(digitCondition('hour', 1)),
      'mm': digitModifier(datePartGetterFactory(digitCondition('minute', 2))),
      'm': datePartGetterFactory(digitCondition('minute', 1)),
      'ss': digitModifier(datePartGetterFactory(digitCondition('second', 2))),
      's': datePartGetterFactory(digitCondition('second', 1)),
      'sss': datePartGetterFactory(digitCondition('second', 3)),
      'EEEE': datePartGetterFactory(nameCondition('weekday', 4)),
      'EEE': datePartGetterFactory(nameCondition('weekday', 3)),
      'EE': datePartGetterFactory(nameCondition('weekday', 2)),
      'E': datePartGetterFactory(nameCondition('weekday', 1)),
      'a': hourClockExtractor(datePartGetterFactory(hour12Modify(digitCondition('hour', 1), true))),
      'Z': timeZoneGetter('short'),
      'z': timeZoneGetter('long'),
      'ww': datePartGetterFactory({}),
      'w': datePartGetterFactory({}),
      'G': datePartGetterFactory(nameCondition('era', 1)),
      'GG': datePartGetterFactory(nameCondition('era', 2)),
      'GGG': datePartGetterFactory(nameCondition('era', 3)),
      'GGGG': datePartGetterFactory(nameCondition('era', 4))
    };
    function digitModifier(inner) {
      return function(date, locale) {
        var result = inner(date, locale);
        return result.length == 1 ? '0' + result : result;
      };
    }
    function hourClockExtractor(inner) {
      return function(date, locale) {
        return inner(date, locale).split(' ')[1];
      };
    }
    function hourExtractor(inner) {
      return function(date, locale) {
        return inner(date, locale).split(' ')[0];
      };
    }
    function intlDateFormat(date, locale, options) {
      return new Intl.DateTimeFormat(locale, options).format(date).replace(/[\u200e\u200f]/g, '');
    }
    function timeZoneGetter(timezone) {
      var options = {
        hour: '2-digit',
        hour12: false,
        timeZoneName: timezone
      };
      return function(date, locale) {
        var result = intlDateFormat(date, locale, options);
        return result ? result.substring(3) : '';
      };
    }
    function hour12Modify(options, value) {
      options.hour12 = value;
      return options;
    }
    function digitCondition(prop, len) {
      var result = {};
      result[prop] = len === 2 ? '2-digit' : 'numeric';
      return result;
    }
    function nameCondition(prop, len) {
      var result = {};
      if (len < 4) {
        result[prop] = len > 1 ? 'short' : 'narrow';
      } else {
        result[prop] = 'long';
      }
      return result;
    }
    function combine(options) {
      return ((Object)).assign.apply(((Object)), [{}].concat(options));
    }
    function datePartGetterFactory(ret) {
      return function(date, locale) {
        return intlDateFormat(date, locale, ret);
      };
    }
    var DATE_FORMATTER_CACHE = new Map();
    function dateFormatter(format, date, locale) {
      var fn = PATTERN_ALIASES[format];
      if (fn)
        return fn(date, locale);
      var cacheKey = format;
      var parts = DATE_FORMATTER_CACHE.get(cacheKey);
      if (!parts) {
        parts = [];
        var match = void 0;
        DATE_FORMATS_SPLIT.exec(format);
        var _format = format;
        while (_format) {
          match = DATE_FORMATS_SPLIT.exec(_format);
          if (match) {
            parts = parts.concat(match.slice(1));
            _format = ((parts.pop()));
          } else {
            parts.push(_format);
            _format = null;
          }
        }
        DATE_FORMATTER_CACHE.set(cacheKey, parts);
      }
      return parts.reduce(function(text, part) {
        var fn = DATE_FORMATS[part];
        return text + (fn ? fn(date, locale) : partToTime(part));
      }, '');
    }
    function partToTime(part) {
      return part === '\'\'' ? '\'' : part.replace(/(^'|'$)/g, '').replace(/''/g, '\'');
    }
    var DateFormatter = (function() {
      function DateFormatter() {}
      DateFormatter.format = function(date, locale, pattern) {
        return dateFormatter(pattern, date, locale);
      };
      return DateFormatter;
    }());
    var _NUMBER_FORMAT_REGEXP = /^(\d+)?\.((\d+)(-(\d+))?)?$/;
    function formatNumber(pipe, locale, value, style, digits, currency, currencyAsSymbol) {
      if (currency === void 0) {
        currency = null;
      }
      if (currencyAsSymbol === void 0) {
        currencyAsSymbol = false;
      }
      if (value == null)
        return null;
      value = typeof value === 'string' && isNumeric(value) ? +value : value;
      if (typeof value !== 'number') {
        throw invalidPipeArgumentError(pipe, value);
      }
      var minInt = undefined;
      var minFraction = undefined;
      var maxFraction = undefined;
      if (style !== NumberFormatStyle.Currency) {
        minInt = 1;
        minFraction = 0;
        maxFraction = 3;
      }
      if (digits) {
        var parts = digits.match(_NUMBER_FORMAT_REGEXP);
        if (parts === null) {
          throw new Error(digits + " is not a valid digit info for number pipes");
        }
        if (parts[1] != null) {
          minInt = parseIntAutoRadix(parts[1]);
        }
        if (parts[3] != null) {
          minFraction = parseIntAutoRadix(parts[3]);
        }
        if (parts[5] != null) {
          maxFraction = parseIntAutoRadix(parts[5]);
        }
      }
      return NumberFormatter.format((value), locale, style, {
        minimumIntegerDigits: minInt,
        minimumFractionDigits: minFraction,
        maximumFractionDigits: maxFraction,
        currency: currency,
        currencyAsSymbol: currencyAsSymbol
      });
    }
    var DecimalPipe = (function() {
      function DecimalPipe(_locale) {
        this._locale = _locale;
      }
      DecimalPipe.prototype.transform = function(value, digits) {
        return formatNumber(DecimalPipe, this._locale, value, NumberFormatStyle.Decimal, digits);
      };
      return DecimalPipe;
    }());
    DecimalPipe.decorators = [{
      type: _angular_core.Pipe,
      args: [{name: 'number'}]
    }];
    DecimalPipe.ctorParameters = function() {
      return [{
        type: undefined,
        decorators: [{
          type: _angular_core.Inject,
          args: [_angular_core.LOCALE_ID]
        }]
      }];
    };
    var PercentPipe = (function() {
      function PercentPipe(_locale) {
        this._locale = _locale;
      }
      PercentPipe.prototype.transform = function(value, digits) {
        return formatNumber(PercentPipe, this._locale, value, NumberFormatStyle.Percent, digits);
      };
      return PercentPipe;
    }());
    PercentPipe.decorators = [{
      type: _angular_core.Pipe,
      args: [{name: 'percent'}]
    }];
    PercentPipe.ctorParameters = function() {
      return [{
        type: undefined,
        decorators: [{
          type: _angular_core.Inject,
          args: [_angular_core.LOCALE_ID]
        }]
      }];
    };
    var CurrencyPipe = (function() {
      function CurrencyPipe(_locale) {
        this._locale = _locale;
      }
      CurrencyPipe.prototype.transform = function(value, currencyCode, symbolDisplay, digits) {
        if (currencyCode === void 0) {
          currencyCode = 'USD';
        }
        if (symbolDisplay === void 0) {
          symbolDisplay = false;
        }
        return formatNumber(CurrencyPipe, this._locale, value, NumberFormatStyle.Currency, digits, currencyCode, symbolDisplay);
      };
      return CurrencyPipe;
    }());
    CurrencyPipe.decorators = [{
      type: _angular_core.Pipe,
      args: [{name: 'currency'}]
    }];
    CurrencyPipe.ctorParameters = function() {
      return [{
        type: undefined,
        decorators: [{
          type: _angular_core.Inject,
          args: [_angular_core.LOCALE_ID]
        }]
      }];
    };
    function parseIntAutoRadix(text) {
      var result = parseInt(text);
      if (isNaN(result)) {
        throw new Error('Invalid integer literal when parsing ' + text);
      }
      return result;
    }
    function isNumeric(value) {
      return !isNaN(value - parseFloat(value));
    }
    var ISO8601_DATE_REGEX = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
    var DatePipe = (function() {
      function DatePipe(_locale) {
        this._locale = _locale;
      }
      DatePipe.prototype.transform = function(value, pattern) {
        if (pattern === void 0) {
          pattern = 'mediumDate';
        }
        var date;
        if (isBlank(value) || value !== value)
          return null;
        if (typeof value === 'string') {
          value = value.trim();
        }
        if (isDate(value)) {
          date = value;
        } else if (isNumeric(value)) {
          date = new Date(parseFloat(value));
        } else if (typeof value === 'string' && /^(\d{4}-\d{1,2}-\d{1,2})$/.test(value)) {
          var _a = value.split('-').map(function(val) {
            return parseInt(val, 10);
          }),
              y = _a[0],
              m = _a[1],
              d = _a[2];
          date = new Date(y, m - 1, d);
        } else {
          date = new Date(value);
        }
        if (!isDate(date)) {
          var match = void 0;
          if ((typeof value === 'string') && (match = value.match(ISO8601_DATE_REGEX))) {
            date = isoStringToDate(match);
          } else {
            throw invalidPipeArgumentError(DatePipe, value);
          }
        }
        return DateFormatter.format(date, this._locale, DatePipe._ALIASES[pattern] || pattern);
      };
      return DatePipe;
    }());
    DatePipe._ALIASES = {
      'medium': 'yMMMdjms',
      'short': 'yMdjm',
      'fullDate': 'yMMMMEEEEd',
      'longDate': 'yMMMMd',
      'mediumDate': 'yMMMd',
      'shortDate': 'yMd',
      'mediumTime': 'jms',
      'shortTime': 'jm'
    };
    DatePipe.decorators = [{
      type: _angular_core.Pipe,
      args: [{
        name: 'date',
        pure: true
      }]
    }];
    DatePipe.ctorParameters = function() {
      return [{
        type: undefined,
        decorators: [{
          type: _angular_core.Inject,
          args: [_angular_core.LOCALE_ID]
        }]
      }];
    };
    function isBlank(obj) {
      return obj == null || obj === '';
    }
    function isDate(obj) {
      return obj instanceof Date && !isNaN(obj.valueOf());
    }
    function isoStringToDate(match) {
      var date = new Date(0);
      var tzHour = 0;
      var tzMin = 0;
      var dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear;
      var timeSetter = match[8] ? date.setUTCHours : date.setHours;
      if (match[9]) {
        tzHour = toInt(match[9] + match[10]);
        tzMin = toInt(match[9] + match[11]);
      }
      dateSetter.call(date, toInt(match[1]), toInt(match[2]) - 1, toInt(match[3]));
      var h = toInt(match[4] || '0') - tzHour;
      var m = toInt(match[5] || '0') - tzMin;
      var s = toInt(match[6] || '0');
      var ms = Math.round(parseFloat('0.' + (match[7] || 0)) * 1000);
      timeSetter.call(date, h, m, s, ms);
      return date;
    }
    function toInt(str) {
      return parseInt(str, 10);
    }
    var _INTERPOLATION_REGEXP = /#/g;
    var I18nPluralPipe = (function() {
      function I18nPluralPipe(_localization) {
        this._localization = _localization;
      }
      I18nPluralPipe.prototype.transform = function(value, pluralMap) {
        if (value == null)
          return '';
        if (typeof pluralMap !== 'object' || pluralMap === null) {
          throw invalidPipeArgumentError(I18nPluralPipe, pluralMap);
        }
        var key = getPluralCategory(value, Object.keys(pluralMap), this._localization);
        return pluralMap[key].replace(_INTERPOLATION_REGEXP, value.toString());
      };
      return I18nPluralPipe;
    }());
    I18nPluralPipe.decorators = [{
      type: _angular_core.Pipe,
      args: [{
        name: 'i18nPlural',
        pure: true
      }]
    }];
    I18nPluralPipe.ctorParameters = function() {
      return [{type: NgLocalization}];
    };
    var I18nSelectPipe = (function() {
      function I18nSelectPipe() {}
      I18nSelectPipe.prototype.transform = function(value, mapping) {
        if (value == null)
          return '';
        if (typeof mapping !== 'object' || typeof value !== 'string') {
          throw invalidPipeArgumentError(I18nSelectPipe, mapping);
        }
        if (mapping.hasOwnProperty(value)) {
          return mapping[value];
        }
        if (mapping.hasOwnProperty('other')) {
          return mapping['other'];
        }
        return '';
      };
      return I18nSelectPipe;
    }());
    I18nSelectPipe.decorators = [{
      type: _angular_core.Pipe,
      args: [{
        name: 'i18nSelect',
        pure: true
      }]
    }];
    I18nSelectPipe.ctorParameters = function() {
      return [];
    };
    var JsonPipe = (function() {
      function JsonPipe() {}
      JsonPipe.prototype.transform = function(value) {
        return JSON.stringify(value, null, 2);
      };
      return JsonPipe;
    }());
    JsonPipe.decorators = [{
      type: _angular_core.Pipe,
      args: [{
        name: 'json',
        pure: false
      }]
    }];
    JsonPipe.ctorParameters = function() {
      return [];
    };
    var SlicePipe = (function() {
      function SlicePipe() {}
      SlicePipe.prototype.transform = function(value, start, end) {
        if (value == null)
          return value;
        if (!this.supports(value)) {
          throw invalidPipeArgumentError(SlicePipe, value);
        }
        return value.slice(start, end);
      };
      SlicePipe.prototype.supports = function(obj) {
        return typeof obj === 'string' || Array.isArray(obj);
      };
      return SlicePipe;
    }());
    SlicePipe.decorators = [{
      type: _angular_core.Pipe,
      args: [{
        name: 'slice',
        pure: false
      }]
    }];
    SlicePipe.ctorParameters = function() {
      return [];
    };
    var COMMON_PIPES = [AsyncPipe, UpperCasePipe, LowerCasePipe, JsonPipe, SlicePipe, DecimalPipe, PercentPipe, TitleCasePipe, CurrencyPipe, DatePipe, I18nPluralPipe, I18nSelectPipe];
    var CommonModule = (function() {
      function CommonModule() {}
      return CommonModule;
    }());
    CommonModule.decorators = [{
      type: _angular_core.NgModule,
      args: [{
        declarations: [COMMON_DIRECTIVES, COMMON_PIPES],
        exports: [COMMON_DIRECTIVES, COMMON_PIPES],
        providers: [{
          provide: NgLocalization,
          useClass: NgLocaleLocalization
        }]
      }]
    }];
    CommonModule.ctorParameters = function() {
      return [];
    };
    var PLATFORM_BROWSER_ID = 'browser';
    var PLATFORM_SERVER_ID = 'server';
    var PLATFORM_WORKER_APP_ID = 'browserWorkerApp';
    var PLATFORM_WORKER_UI_ID = 'browserWorkerUi';
    function isPlatformBrowser(platformId) {
      return platformId === PLATFORM_BROWSER_ID;
    }
    function isPlatformServer(platformId) {
      return platformId === PLATFORM_SERVER_ID;
    }
    function isPlatformWorkerApp(platformId) {
      return platformId === PLATFORM_WORKER_APP_ID;
    }
    function isPlatformWorkerUi(platformId) {
      return platformId === PLATFORM_WORKER_UI_ID;
    }
    var VERSION = new _angular_core.Version('4.2.5');
    exports.NgLocaleLocalization = NgLocaleLocalization;
    exports.NgLocalization = NgLocalization;
    exports.CommonModule = CommonModule;
    exports.NgClass = NgClass;
    exports.NgFor = NgFor;
    exports.NgForOf = NgForOf;
    exports.NgForOfContext = NgForOfContext;
    exports.NgIf = NgIf;
    exports.NgIfContext = NgIfContext;
    exports.NgPlural = NgPlural;
    exports.NgPluralCase = NgPluralCase;
    exports.NgStyle = NgStyle;
    exports.NgSwitch = NgSwitch;
    exports.NgSwitchCase = NgSwitchCase;
    exports.NgSwitchDefault = NgSwitchDefault;
    exports.NgTemplateOutlet = NgTemplateOutlet;
    exports.NgComponentOutlet = NgComponentOutlet;
    exports.AsyncPipe = AsyncPipe;
    exports.DatePipe = DatePipe;
    exports.I18nPluralPipe = I18nPluralPipe;
    exports.I18nSelectPipe = I18nSelectPipe;
    exports.JsonPipe = JsonPipe;
    exports.LowerCasePipe = LowerCasePipe;
    exports.CurrencyPipe = CurrencyPipe;
    exports.DecimalPipe = DecimalPipe;
    exports.PercentPipe = PercentPipe;
    exports.SlicePipe = SlicePipe;
    exports.UpperCasePipe = UpperCasePipe;
    exports.TitleCasePipe = TitleCasePipe;
    exports.ɵPLATFORM_BROWSER_ID = PLATFORM_BROWSER_ID;
    exports.ɵPLATFORM_SERVER_ID = PLATFORM_SERVER_ID;
    exports.ɵPLATFORM_WORKER_APP_ID = PLATFORM_WORKER_APP_ID;
    exports.ɵPLATFORM_WORKER_UI_ID = PLATFORM_WORKER_UI_ID;
    exports.isPlatformBrowser = isPlatformBrowser;
    exports.isPlatformServer = isPlatformServer;
    exports.isPlatformWorkerApp = isPlatformWorkerApp;
    exports.isPlatformWorkerUi = isPlatformWorkerUi;
    exports.VERSION = VERSION;
    exports.PlatformLocation = PlatformLocation;
    exports.LOCATION_INITIALIZED = LOCATION_INITIALIZED;
    exports.LocationStrategy = LocationStrategy;
    exports.APP_BASE_HREF = APP_BASE_HREF;
    exports.HashLocationStrategy = HashLocationStrategy;
    exports.PathLocationStrategy = PathLocationStrategy;
    exports.Location = Location;
    exports.ɵa = COMMON_DIRECTIVES;
    exports.ɵb = COMMON_PIPES;
    Object.defineProperty(exports, '__esModule', {value: true});
  })));
})(require('process'));
