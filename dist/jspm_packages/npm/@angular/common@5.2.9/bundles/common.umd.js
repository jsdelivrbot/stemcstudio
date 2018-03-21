/* */ 
"format cjs";
(function(process) {
  (function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core')) : typeof define === 'function' && define.amd ? define('@angular/common', ['exports', '@angular/core'], factory) : (factory((global.ng = global.ng || {}, global.ng.common = {}), global.ng.core));
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
    var PlatformLocation = (function() {
      function PlatformLocation() {}
      return PlatformLocation;
    }());
    var LOCATION_INITIALIZED = new _angular_core.InjectionToken('Location Initialized');
    var LocationStrategy = (function() {
      function LocationStrategy() {}
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
      Location.decorators = [{type: _angular_core.Injectable}];
      Location.ctorParameters = function() {
        return [{type: LocationStrategy}];
      };
      return Location;
    }());
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
      return HashLocationStrategy;
    }(LocationStrategy));
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
      return PathLocationStrategy;
    }(LocationStrategy));
    var CURRENCIES = {
      'AOA': [, 'Kz'],
      'ARS': [, '$'],
      'AUD': ['A$', '$'],
      'BAM': [, 'KM'],
      'BBD': [, '$'],
      'BDT': [, '৳'],
      'BMD': [, '$'],
      'BND': [, '$'],
      'BOB': [, 'Bs'],
      'BRL': ['R$'],
      'BSD': [, '$'],
      'BWP': [, 'P'],
      'BYN': [, 'р.'],
      'BZD': [, '$'],
      'CAD': ['CA$', '$'],
      'CLP': [, '$'],
      'CNY': ['CN¥', '¥'],
      'COP': [, '$'],
      'CRC': [, '₡'],
      'CUC': [, '$'],
      'CUP': [, '$'],
      'CZK': [, 'Kč'],
      'DKK': [, 'kr'],
      'DOP': [, '$'],
      'EGP': [, 'E£'],
      'ESP': [, '₧'],
      'EUR': ['€'],
      'FJD': [, '$'],
      'FKP': [, '£'],
      'GBP': ['£'],
      'GEL': [, '₾'],
      'GIP': [, '£'],
      'GNF': [, 'FG'],
      'GTQ': [, 'Q'],
      'GYD': [, '$'],
      'HKD': ['HK$', '$'],
      'HNL': [, 'L'],
      'HRK': [, 'kn'],
      'HUF': [, 'Ft'],
      'IDR': [, 'Rp'],
      'ILS': ['₪'],
      'INR': ['₹'],
      'ISK': [, 'kr'],
      'JMD': [, '$'],
      'JPY': ['¥'],
      'KHR': [, '៛'],
      'KMF': [, 'CF'],
      'KPW': [, '₩'],
      'KRW': ['₩'],
      'KYD': [, '$'],
      'KZT': [, '₸'],
      'LAK': [, '₭'],
      'LBP': [, 'L£'],
      'LKR': [, 'Rs'],
      'LRD': [, '$'],
      'LTL': [, 'Lt'],
      'LVL': [, 'Ls'],
      'MGA': [, 'Ar'],
      'MMK': [, 'K'],
      'MNT': [, '₮'],
      'MUR': [, 'Rs'],
      'MXN': ['MX$', '$'],
      'MYR': [, 'RM'],
      'NAD': [, '$'],
      'NGN': [, '₦'],
      'NIO': [, 'C$'],
      'NOK': [, 'kr'],
      'NPR': [, 'Rs'],
      'NZD': ['NZ$', '$'],
      'PHP': [, '₱'],
      'PKR': [, 'Rs'],
      'PLN': [, 'zł'],
      'PYG': [, '₲'],
      'RON': [, 'lei'],
      'RUB': [, '₽'],
      'RUR': [, 'р.'],
      'RWF': [, 'RF'],
      'SBD': [, '$'],
      'SEK': [, 'kr'],
      'SGD': [, '$'],
      'SHP': [, '£'],
      'SRD': [, '$'],
      'SSP': [, '£'],
      'STD': [, 'Db'],
      'SYP': [, '£'],
      'THB': [, '฿'],
      'TOP': [, 'T$'],
      'TRY': [, '₺'],
      'TTD': [, '$'],
      'TWD': ['NT$', '$'],
      'UAH': [, '₴'],
      'USD': ['$'],
      'UYU': [, '$'],
      'VEF': [, 'Bs'],
      'VND': ['₫'],
      'XAF': ['FCFA'],
      'XCD': ['EC$', '$'],
      'XOF': ['CFA'],
      'XPF': ['CFPF'],
      'ZAR': [, 'R'],
      'ZMW': [, 'ZK']
    };
    function plural(n) {
      var i = Math.floor(Math.abs(n)),
          v = n.toString().replace(/^[^.]*\.?/, '').length;
      if (i === 1 && v === 0)
        return 1;
      return 5;
    }
    var localeEn = ['en', [['a', 'p'], ['AM', 'PM']], [['AM', 'PM'], , ], [['S', 'M', 'T', 'W', 'T', 'F', 'S'], ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']], , [['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'], ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']], , [['B', 'A'], ['BC', 'AD'], ['Before Christ', 'Anno Domini']], 0, [6, 0], ['M/d/yy', 'MMM d, y', 'MMMM d, y', 'EEEE, MMMM d, y'], ['h:mm a', 'h:mm:ss a', 'h:mm:ss a z', 'h:mm:ss a zzzz'], ['{1}, {0}', , '{1} \'at\' {0}'], ['.', ',', ';', '%', '+', '-', 'E', '×', '‰', '∞', 'NaN', ':'], ['#,##0.###', '#,##0%', '¤#,##0.00', '#E0'], '$', 'US Dollar', plural];
    var LOCALE_DATA = {};
    function registerLocaleData(data, localeId, extraData) {
      if (typeof localeId !== 'string') {
        extraData = localeId;
        localeId = data[0];
      }
      localeId = localeId.toLowerCase().replace(/_/g, '-');
      LOCALE_DATA[localeId] = data;
      if (extraData) {
        LOCALE_DATA[localeId][18] = extraData;
      }
    }
    var NumberFormatStyle = {
      Decimal: 0,
      Percent: 1,
      Currency: 2,
      Scientific: 3
    };
    NumberFormatStyle[NumberFormatStyle.Decimal] = "Decimal";
    NumberFormatStyle[NumberFormatStyle.Percent] = "Percent";
    NumberFormatStyle[NumberFormatStyle.Currency] = "Currency";
    NumberFormatStyle[NumberFormatStyle.Scientific] = "Scientific";
    var Plural = {
      Zero: 0,
      One: 1,
      Two: 2,
      Few: 3,
      Many: 4,
      Other: 5
    };
    Plural[Plural.Zero] = "Zero";
    Plural[Plural.One] = "One";
    Plural[Plural.Two] = "Two";
    Plural[Plural.Few] = "Few";
    Plural[Plural.Many] = "Many";
    Plural[Plural.Other] = "Other";
    var FormStyle = {
      Format: 0,
      Standalone: 1
    };
    FormStyle[FormStyle.Format] = "Format";
    FormStyle[FormStyle.Standalone] = "Standalone";
    var TranslationWidth = {
      Narrow: 0,
      Abbreviated: 1,
      Wide: 2,
      Short: 3
    };
    TranslationWidth[TranslationWidth.Narrow] = "Narrow";
    TranslationWidth[TranslationWidth.Abbreviated] = "Abbreviated";
    TranslationWidth[TranslationWidth.Wide] = "Wide";
    TranslationWidth[TranslationWidth.Short] = "Short";
    var FormatWidth = {
      Short: 0,
      Medium: 1,
      Long: 2,
      Full: 3
    };
    FormatWidth[FormatWidth.Short] = "Short";
    FormatWidth[FormatWidth.Medium] = "Medium";
    FormatWidth[FormatWidth.Long] = "Long";
    FormatWidth[FormatWidth.Full] = "Full";
    var NumberSymbol = {
      Decimal: 0,
      Group: 1,
      List: 2,
      PercentSign: 3,
      PlusSign: 4,
      MinusSign: 5,
      Exponential: 6,
      SuperscriptingExponent: 7,
      PerMille: 8,
      Infinity: 9,
      NaN: 10,
      TimeSeparator: 11,
      CurrencyDecimal: 12,
      CurrencyGroup: 13
    };
    NumberSymbol[NumberSymbol.Decimal] = "Decimal";
    NumberSymbol[NumberSymbol.Group] = "Group";
    NumberSymbol[NumberSymbol.List] = "List";
    NumberSymbol[NumberSymbol.PercentSign] = "PercentSign";
    NumberSymbol[NumberSymbol.PlusSign] = "PlusSign";
    NumberSymbol[NumberSymbol.MinusSign] = "MinusSign";
    NumberSymbol[NumberSymbol.Exponential] = "Exponential";
    NumberSymbol[NumberSymbol.SuperscriptingExponent] = "SuperscriptingExponent";
    NumberSymbol[NumberSymbol.PerMille] = "PerMille";
    NumberSymbol[NumberSymbol.Infinity] = "Infinity";
    NumberSymbol[NumberSymbol.NaN] = "NaN";
    NumberSymbol[NumberSymbol.TimeSeparator] = "TimeSeparator";
    NumberSymbol[NumberSymbol.CurrencyDecimal] = "CurrencyDecimal";
    NumberSymbol[NumberSymbol.CurrencyGroup] = "CurrencyGroup";
    var WeekDay = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6
    };
    WeekDay[WeekDay.Sunday] = "Sunday";
    WeekDay[WeekDay.Monday] = "Monday";
    WeekDay[WeekDay.Tuesday] = "Tuesday";
    WeekDay[WeekDay.Wednesday] = "Wednesday";
    WeekDay[WeekDay.Thursday] = "Thursday";
    WeekDay[WeekDay.Friday] = "Friday";
    WeekDay[WeekDay.Saturday] = "Saturday";
    function getLocaleId(locale) {
      return findLocaleData(locale)[0];
    }
    function getLocaleDayPeriods(locale, formStyle, width) {
      var data = findLocaleData(locale);
      var amPmData = ([data[1], data[2]]);
      var amPm = getLastDefinedValue(amPmData, formStyle);
      return getLastDefinedValue(amPm, width);
    }
    function getLocaleDayNames(locale, formStyle, width) {
      var data = findLocaleData(locale);
      var daysData = ([data[3], data[4]]);
      var days = getLastDefinedValue(daysData, formStyle);
      return getLastDefinedValue(days, width);
    }
    function getLocaleMonthNames(locale, formStyle, width) {
      var data = findLocaleData(locale);
      var monthsData = ([data[5], data[6]]);
      var months = getLastDefinedValue(monthsData, formStyle);
      return getLastDefinedValue(months, width);
    }
    function getLocaleEraNames(locale, width) {
      var data = findLocaleData(locale);
      var erasData = (data[7]);
      return getLastDefinedValue(erasData, width);
    }
    function getLocaleFirstDayOfWeek(locale) {
      var data = findLocaleData(locale);
      return data[8];
    }
    function getLocaleWeekEndRange(locale) {
      var data = findLocaleData(locale);
      return data[9];
    }
    function getLocaleDateFormat(locale, width) {
      var data = findLocaleData(locale);
      return getLastDefinedValue(data[10], width);
    }
    function getLocaleTimeFormat(locale, width) {
      var data = findLocaleData(locale);
      return getLastDefinedValue(data[11], width);
    }
    function getLocaleDateTimeFormat(locale, width) {
      var data = findLocaleData(locale);
      var dateTimeFormatData = (data[12]);
      return getLastDefinedValue(dateTimeFormatData, width);
    }
    function getLocaleNumberSymbol(locale, symbol) {
      var data = findLocaleData(locale);
      var res = data[13][symbol];
      if (typeof res === 'undefined') {
        if (symbol === NumberSymbol.CurrencyDecimal) {
          return data[13][NumberSymbol.Decimal];
        } else if (symbol === NumberSymbol.CurrencyGroup) {
          return data[13][NumberSymbol.Group];
        }
      }
      return res;
    }
    function getLocaleNumberFormat(locale, type) {
      var data = findLocaleData(locale);
      return data[14][type];
    }
    function getLocaleCurrencySymbol(locale) {
      var data = findLocaleData(locale);
      return data[15] || null;
    }
    function getLocaleCurrencyName(locale) {
      var data = findLocaleData(locale);
      return data[16] || null;
    }
    function getLocalePluralCase(locale) {
      var data = findLocaleData(locale);
      return data[17];
    }
    function checkFullData(data) {
      if (!data[18]) {
        throw new Error("Missing extra locale data for the locale \"" + data[0] + "\". Use \"registerLocaleData\" to load new data. See the \"I18n guide\" on angular.io to know more.");
      }
    }
    function getLocaleExtraDayPeriodRules(locale) {
      var data = findLocaleData(locale);
      checkFullData(data);
      var rules = data[18][2] || [];
      return rules.map(function(rule) {
        if (typeof rule === 'string') {
          return extractTime(rule);
        }
        return [extractTime(rule[0]), extractTime(rule[1])];
      });
    }
    function getLocaleExtraDayPeriods(locale, formStyle, width) {
      var data = findLocaleData(locale);
      checkFullData(data);
      var dayPeriodsData = ([data[18][0], data[18][1]]);
      var dayPeriods = getLastDefinedValue(dayPeriodsData, formStyle) || [];
      return getLastDefinedValue(dayPeriods, width) || [];
    }
    function getLastDefinedValue(data, index) {
      for (var i = index; i > -1; i--) {
        if (typeof data[i] !== 'undefined') {
          return data[i];
        }
      }
      throw new Error('Locale data API: locale data undefined');
    }
    function extractTime(time) {
      var _a = time.split(':'),
          h = _a[0],
          m = _a[1];
      return {
        hours: +h,
        minutes: +m
      };
    }
    function findLocaleData(locale) {
      var normalizedLocale = locale.toLowerCase().replace(/_/g, '-');
      var match = LOCALE_DATA[normalizedLocale];
      if (match) {
        return match;
      }
      var parentLocale = normalizedLocale.split('-')[0];
      match = LOCALE_DATA[parentLocale];
      if (match) {
        return match;
      }
      if (parentLocale === 'en') {
        return localeEn;
      }
      throw new Error("Missing locale data for the locale \"" + locale + "\".");
    }
    function getCurrencySymbol(code, format) {
      var currency = CURRENCIES[code] || [];
      var symbolNarrow = currency[1];
      if (format === 'narrow' && typeof symbolNarrow === 'string') {
        return symbolNarrow;
      }
      return currency[0] || code;
    }
    var DEPRECATED_PLURAL_FN = new _angular_core.InjectionToken('UseV4Plurals');
    var NgLocalization = (function() {
      function NgLocalization() {}
      return NgLocalization;
    }());
    function getPluralCategory(value, cases, ngLocalization, locale) {
      var key = "=" + value;
      if (cases.indexOf(key) > -1) {
        return key;
      }
      key = ngLocalization.getPluralCategory(value, locale);
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
      function NgLocaleLocalization(locale, deprecatedPluralFn) {
        var _this = _super.call(this) || this;
        _this.locale = locale;
        _this.deprecatedPluralFn = deprecatedPluralFn;
        return _this;
      }
      NgLocaleLocalization.prototype.getPluralCategory = function(value, locale) {
        var plural = this.deprecatedPluralFn ? this.deprecatedPluralFn(locale || this.locale, value) : getLocalePluralCase(locale || this.locale)(value);
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
      NgLocaleLocalization.decorators = [{type: _angular_core.Injectable}];
      NgLocaleLocalization.ctorParameters = function() {
        return [{
          type: undefined,
          decorators: [{
            type: _angular_core.Inject,
            args: [_angular_core.LOCALE_ID]
          }]
        }, {
          type: undefined,
          decorators: [{type: _angular_core.Optional}, {
            type: _angular_core.Inject,
            args: [DEPRECATED_PLURAL_FN]
          }]
        }];
      };
      return NgLocaleLocalization;
    }(NgLocalization));
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
            if (enabled) {
              _this._renderer.addClass(_this._ngEl.nativeElement, klass);
            } else {
              _this._renderer.removeClass(_this._ngEl.nativeElement, klass);
            }
          });
        }
      };
      NgClass.decorators = [{
        type: _angular_core.Directive,
        args: [{selector: '[ngClass]'}]
      }];
      NgClass.ctorParameters = function() {
        return [{type: _angular_core.IterableDiffers}, {type: _angular_core.KeyValueDiffers}, {type: _angular_core.ElementRef}, {type: _angular_core.Renderer2}];
      };
      NgClass.propDecorators = {
        "klass": [{
          type: _angular_core.Input,
          args: ['class']
        }],
        "ngClass": [{type: _angular_core.Input}]
      };
      return NgClass;
    }());
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
      NgComponentOutlet.decorators = [{
        type: _angular_core.Directive,
        args: [{selector: '[ngComponentOutlet]'}]
      }];
      NgComponentOutlet.ctorParameters = function() {
        return [{type: _angular_core.ViewContainerRef}];
      };
      NgComponentOutlet.propDecorators = {
        "ngComponentOutlet": [{type: _angular_core.Input}],
        "ngComponentOutletInjector": [{type: _angular_core.Input}],
        "ngComponentOutletContent": [{type: _angular_core.Input}],
        "ngComponentOutletNgModuleFactory": [{type: _angular_core.Input}]
      };
      return NgComponentOutlet;
    }());
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
      NgForOf.decorators = [{
        type: _angular_core.Directive,
        args: [{selector: '[ngFor][ngForOf]'}]
      }];
      NgForOf.ctorParameters = function() {
        return [{type: _angular_core.ViewContainerRef}, {type: _angular_core.TemplateRef}, {type: _angular_core.IterableDiffers}];
      };
      NgForOf.propDecorators = {
        "ngForOf": [{type: _angular_core.Input}],
        "ngForTrackBy": [{type: _angular_core.Input}],
        "ngForTemplate": [{type: _angular_core.Input}]
      };
      return NgForOf;
    }());
    var RecordViewTuple = (function() {
      function RecordViewTuple(record, view) {
        this.record = record;
        this.view = view;
      }
      return RecordViewTuple;
    }());
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
      NgIf.decorators = [{
        type: _angular_core.Directive,
        args: [{selector: '[ngIf]'}]
      }];
      NgIf.ctorParameters = function() {
        return [{type: _angular_core.ViewContainerRef}, {type: _angular_core.TemplateRef}];
      };
      NgIf.propDecorators = {
        "ngIf": [{type: _angular_core.Input}],
        "ngIfThen": [{type: _angular_core.Input}],
        "ngIfElse": [{type: _angular_core.Input}]
      };
      return NgIf;
    }());
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
      NgSwitch.decorators = [{
        type: _angular_core.Directive,
        args: [{selector: '[ngSwitch]'}]
      }];
      NgSwitch.ctorParameters = function() {
        return [];
      };
      NgSwitch.propDecorators = {"ngSwitch": [{type: _angular_core.Input}]};
      return NgSwitch;
    }());
    var NgSwitchCase = (function() {
      function NgSwitchCase(viewContainer, templateRef, ngSwitch) {
        this.ngSwitch = ngSwitch;
        ngSwitch._addCase();
        this._view = new SwitchView(viewContainer, templateRef);
      }
      NgSwitchCase.prototype.ngDoCheck = function() {
        this._view.enforceState(this.ngSwitch._matchCase(this.ngSwitchCase));
      };
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
      NgSwitchCase.propDecorators = {"ngSwitchCase": [{type: _angular_core.Input}]};
      return NgSwitchCase;
    }());
    var NgSwitchDefault = (function() {
      function NgSwitchDefault(viewContainer, templateRef, ngSwitch) {
        ngSwitch._addDefault(new SwitchView(viewContainer, templateRef));
      }
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
      return NgSwitchDefault;
    }());
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
      NgPlural.decorators = [{
        type: _angular_core.Directive,
        args: [{selector: '[ngPlural]'}]
      }];
      NgPlural.ctorParameters = function() {
        return [{type: NgLocalization}];
      };
      NgPlural.propDecorators = {"ngPlural": [{type: _angular_core.Input}]};
      return NgPlural;
    }());
    var NgPluralCase = (function() {
      function NgPluralCase(value, template, viewContainer, ngPlural) {
        this.value = value;
        var isANumber = !isNaN(Number(value));
        ngPlural.addCase(isANumber ? "=" + value : value, new SwitchView(viewContainer, template));
      }
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
      return NgPluralCase;
    }());
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
        if (value != null) {
          this._renderer.setStyle(this._ngEl.nativeElement, name, (value));
        } else {
          this._renderer.removeStyle(this._ngEl.nativeElement, name);
        }
      };
      NgStyle.decorators = [{
        type: _angular_core.Directive,
        args: [{selector: '[ngStyle]'}]
      }];
      NgStyle.ctorParameters = function() {
        return [{type: _angular_core.KeyValueDiffers}, {type: _angular_core.ElementRef}, {type: _angular_core.Renderer2}];
      };
      NgStyle.propDecorators = {"ngStyle": [{type: _angular_core.Input}]};
      return NgStyle;
    }());
    var NgTemplateOutlet = (function() {
      function NgTemplateOutlet(_viewContainerRef) {
        this._viewContainerRef = _viewContainerRef;
      }
      NgTemplateOutlet.prototype.ngOnChanges = function(changes) {
        var recreateView = this._shouldRecreateView(changes);
        if (recreateView) {
          if (this._viewRef) {
            this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._viewRef));
          }
          if (this.ngTemplateOutlet) {
            this._viewRef = this._viewContainerRef.createEmbeddedView(this.ngTemplateOutlet, this.ngTemplateOutletContext);
          }
        } else {
          if (this._viewRef && this.ngTemplateOutletContext) {
            this._updateExistingContext(this.ngTemplateOutletContext);
          }
        }
      };
      NgTemplateOutlet.prototype._shouldRecreateView = function(changes) {
        var ctxChange = changes['ngTemplateOutletContext'];
        return !!changes['ngTemplateOutlet'] || (ctxChange && this._hasContextShapeChanged(ctxChange));
      };
      NgTemplateOutlet.prototype._hasContextShapeChanged = function(ctxChange) {
        var prevCtxKeys = Object.keys(ctxChange.previousValue || {});
        var currCtxKeys = Object.keys(ctxChange.currentValue || {});
        if (prevCtxKeys.length === currCtxKeys.length) {
          for (var _i = 0,
              currCtxKeys_1 = currCtxKeys; _i < currCtxKeys_1.length; _i++) {
            var propName = currCtxKeys_1[_i];
            if (prevCtxKeys.indexOf(propName) === -1) {
              return true;
            }
          }
          return false;
        } else {
          return true;
        }
      };
      NgTemplateOutlet.prototype._updateExistingContext = function(ctx) {
        for (var _i = 0,
            _a = Object.keys(ctx); _i < _a.length; _i++) {
          var propName = _a[_i];
          ((this._viewRef.context))[propName] = ((this.ngTemplateOutletContext))[propName];
        }
      };
      NgTemplateOutlet.decorators = [{
        type: _angular_core.Directive,
        args: [{selector: '[ngTemplateOutlet]'}]
      }];
      NgTemplateOutlet.ctorParameters = function() {
        return [{type: _angular_core.ViewContainerRef}];
      };
      NgTemplateOutlet.propDecorators = {
        "ngTemplateOutletContext": [{type: _angular_core.Input}],
        "ngTemplateOutlet": [{type: _angular_core.Input}]
      };
      return NgTemplateOutlet;
    }());
    var COMMON_DIRECTIVES = [NgClass, NgComponentOutlet, NgForOf, NgIf, NgTemplateOutlet, NgStyle, NgSwitch, NgSwitchCase, NgSwitchDefault, NgPlural, NgPluralCase];
    var NAMED_FORMATS = {};
    var DATE_FORMATS_SPLIT = /((?:[^GyMLwWdEabBhHmsSzZO']+)|(?:'(?:[^']|'')*')|(?:G{1,5}|y{1,4}|M{1,5}|L{1,5}|w{1,2}|W{1}|d{1,2}|E{1,6}|a{1,5}|b{1,5}|B{1,5}|h{1,2}|H{1,2}|m{1,2}|s{1,2}|S{1,3}|z{1,4}|Z{1,5}|O{1,4}))([\s\S]*)/;
    var ZoneWidth = {
      Short: 0,
      ShortGMT: 1,
      Long: 2,
      Extended: 3
    };
    ZoneWidth[ZoneWidth.Short] = "Short";
    ZoneWidth[ZoneWidth.ShortGMT] = "ShortGMT";
    ZoneWidth[ZoneWidth.Long] = "Long";
    ZoneWidth[ZoneWidth.Extended] = "Extended";
    var DateType = {
      FullYear: 0,
      Month: 1,
      Date: 2,
      Hours: 3,
      Minutes: 4,
      Seconds: 5,
      Milliseconds: 6,
      Day: 7
    };
    DateType[DateType.FullYear] = "FullYear";
    DateType[DateType.Month] = "Month";
    DateType[DateType.Date] = "Date";
    DateType[DateType.Hours] = "Hours";
    DateType[DateType.Minutes] = "Minutes";
    DateType[DateType.Seconds] = "Seconds";
    DateType[DateType.Milliseconds] = "Milliseconds";
    DateType[DateType.Day] = "Day";
    var TranslationType = {
      DayPeriods: 0,
      Days: 1,
      Months: 2,
      Eras: 3
    };
    TranslationType[TranslationType.DayPeriods] = "DayPeriods";
    TranslationType[TranslationType.Days] = "Days";
    TranslationType[TranslationType.Months] = "Months";
    TranslationType[TranslationType.Eras] = "Eras";
    function formatDate(date, format, locale, timezone) {
      var namedFormat = getNamedFormat(locale, format);
      format = namedFormat || format;
      var parts = [];
      var match;
      while (format) {
        match = DATE_FORMATS_SPLIT.exec(format);
        if (match) {
          parts = parts.concat(match.slice(1));
          var part = parts.pop();
          if (!part) {
            break;
          }
          format = part;
        } else {
          parts.push(format);
          break;
        }
      }
      var dateTimezoneOffset = date.getTimezoneOffset();
      if (timezone) {
        dateTimezoneOffset = timezoneToOffset(timezone, dateTimezoneOffset);
        date = convertTimezoneToLocal(date, timezone, true);
      }
      var text = '';
      parts.forEach(function(value) {
        var dateFormatter = getDateFormatter(value);
        text += dateFormatter ? dateFormatter(date, locale, dateTimezoneOffset) : value === '\'\'' ? '\'' : value.replace(/(^'|'$)/g, '').replace(/''/g, '\'');
      });
      return text;
    }
    function getNamedFormat(locale, format) {
      var localeId = getLocaleId(locale);
      NAMED_FORMATS[localeId] = NAMED_FORMATS[localeId] || {};
      if (NAMED_FORMATS[localeId][format]) {
        return NAMED_FORMATS[localeId][format];
      }
      var formatValue = '';
      switch (format) {
        case 'shortDate':
          formatValue = getLocaleDateFormat(locale, FormatWidth.Short);
          break;
        case 'mediumDate':
          formatValue = getLocaleDateFormat(locale, FormatWidth.Medium);
          break;
        case 'longDate':
          formatValue = getLocaleDateFormat(locale, FormatWidth.Long);
          break;
        case 'fullDate':
          formatValue = getLocaleDateFormat(locale, FormatWidth.Full);
          break;
        case 'shortTime':
          formatValue = getLocaleTimeFormat(locale, FormatWidth.Short);
          break;
        case 'mediumTime':
          formatValue = getLocaleTimeFormat(locale, FormatWidth.Medium);
          break;
        case 'longTime':
          formatValue = getLocaleTimeFormat(locale, FormatWidth.Long);
          break;
        case 'fullTime':
          formatValue = getLocaleTimeFormat(locale, FormatWidth.Full);
          break;
        case 'short':
          var shortTime = getNamedFormat(locale, 'shortTime');
          var shortDate = getNamedFormat(locale, 'shortDate');
          formatValue = formatDateTime(getLocaleDateTimeFormat(locale, FormatWidth.Short), [shortTime, shortDate]);
          break;
        case 'medium':
          var mediumTime = getNamedFormat(locale, 'mediumTime');
          var mediumDate = getNamedFormat(locale, 'mediumDate');
          formatValue = formatDateTime(getLocaleDateTimeFormat(locale, FormatWidth.Medium), [mediumTime, mediumDate]);
          break;
        case 'long':
          var longTime = getNamedFormat(locale, 'longTime');
          var longDate = getNamedFormat(locale, 'longDate');
          formatValue = formatDateTime(getLocaleDateTimeFormat(locale, FormatWidth.Long), [longTime, longDate]);
          break;
        case 'full':
          var fullTime = getNamedFormat(locale, 'fullTime');
          var fullDate = getNamedFormat(locale, 'fullDate');
          formatValue = formatDateTime(getLocaleDateTimeFormat(locale, FormatWidth.Full), [fullTime, fullDate]);
          break;
      }
      if (formatValue) {
        NAMED_FORMATS[localeId][format] = formatValue;
      }
      return formatValue;
    }
    function formatDateTime(str, opt_values) {
      if (opt_values) {
        str = str.replace(/\{([^}]+)}/g, function(match, key) {
          return (opt_values != null && key in opt_values) ? opt_values[key] : match;
        });
      }
      return str;
    }
    function padNumber(num, digits, minusSign, trim, negWrap) {
      if (minusSign === void 0) {
        minusSign = '-';
      }
      var neg = '';
      if (num < 0 || (negWrap && num <= 0)) {
        if (negWrap) {
          num = -num + 1;
        } else {
          num = -num;
          neg = minusSign;
        }
      }
      var strNum = '' + num;
      while (strNum.length < digits)
        strNum = '0' + strNum;
      if (trim) {
        strNum = strNum.substr(strNum.length - digits);
      }
      return neg + strNum;
    }
    function dateGetter(name, size, offset, trim, negWrap) {
      if (offset === void 0) {
        offset = 0;
      }
      if (trim === void 0) {
        trim = false;
      }
      if (negWrap === void 0) {
        negWrap = false;
      }
      return function(date, locale) {
        var part = getDatePart(name, date, size);
        if (offset > 0 || part > -offset) {
          part += offset;
        }
        if (name === DateType.Hours && part === 0 && offset === -12) {
          part = 12;
        }
        return padNumber(part, size, getLocaleNumberSymbol(locale, NumberSymbol.MinusSign), trim, negWrap);
      };
    }
    function getDatePart(name, date, size) {
      switch (name) {
        case DateType.FullYear:
          return date.getFullYear();
        case DateType.Month:
          return date.getMonth();
        case DateType.Date:
          return date.getDate();
        case DateType.Hours:
          return date.getHours();
        case DateType.Minutes:
          return date.getMinutes();
        case DateType.Seconds:
          return date.getSeconds();
        case DateType.Milliseconds:
          var div = size === 1 ? 100 : (size === 2 ? 10 : 1);
          return Math.round(date.getMilliseconds() / div);
        case DateType.Day:
          return date.getDay();
        default:
          throw new Error("Unknown DateType value \"" + name + "\".");
      }
    }
    function dateStrGetter(name, width, form, extended) {
      if (form === void 0) {
        form = FormStyle.Format;
      }
      if (extended === void 0) {
        extended = false;
      }
      return function(date, locale) {
        return getDateTranslation(date, locale, name, width, form, extended);
      };
    }
    function getDateTranslation(date, locale, name, width, form, extended) {
      switch (name) {
        case TranslationType.Months:
          return getLocaleMonthNames(locale, form, width)[date.getMonth()];
        case TranslationType.Days:
          return getLocaleDayNames(locale, form, width)[date.getDay()];
        case TranslationType.DayPeriods:
          var currentHours_1 = date.getHours();
          var currentMinutes_1 = date.getMinutes();
          if (extended) {
            var rules = getLocaleExtraDayPeriodRules(locale);
            var dayPeriods_1 = getLocaleExtraDayPeriods(locale, form, width);
            var result_1;
            rules.forEach(function(rule, index) {
              if (Array.isArray(rule)) {
                var _a = rule[0],
                    hoursFrom = _a.hours,
                    minutesFrom = _a.minutes;
                var _b = rule[1],
                    hoursTo = _b.hours,
                    minutesTo = _b.minutes;
                if (currentHours_1 >= hoursFrom && currentMinutes_1 >= minutesFrom && (currentHours_1 < hoursTo || (currentHours_1 === hoursTo && currentMinutes_1 < minutesTo))) {
                  result_1 = dayPeriods_1[index];
                }
              } else {
                var hours = rule.hours,
                    minutes = rule.minutes;
                if (hours === currentHours_1 && minutes === currentMinutes_1) {
                  result_1 = dayPeriods_1[index];
                }
              }
            });
            if (result_1) {
              return result_1;
            }
          }
          return getLocaleDayPeriods(locale, form, (width))[currentHours_1 < 12 ? 0 : 1];
        case TranslationType.Eras:
          return getLocaleEraNames(locale, (width))[date.getFullYear() <= 0 ? 0 : 1];
        default:
          var unexpected = name;
          throw new Error("unexpected translation type " + unexpected);
      }
    }
    function timeZoneGetter(width) {
      return function(date, locale, offset) {
        var zone = -1 * offset;
        var minusSign = getLocaleNumberSymbol(locale, NumberSymbol.MinusSign);
        var hours = zone > 0 ? Math.floor(zone / 60) : Math.ceil(zone / 60);
        switch (width) {
          case ZoneWidth.Short:
            return ((zone >= 0) ? '+' : '') + padNumber(hours, 2, minusSign) + padNumber(Math.abs(zone % 60), 2, minusSign);
          case ZoneWidth.ShortGMT:
            return 'GMT' + ((zone >= 0) ? '+' : '') + padNumber(hours, 1, minusSign);
          case ZoneWidth.Long:
            return 'GMT' + ((zone >= 0) ? '+' : '') + padNumber(hours, 2, minusSign) + ':' + padNumber(Math.abs(zone % 60), 2, minusSign);
          case ZoneWidth.Extended:
            if (offset === 0) {
              return 'Z';
            } else {
              return ((zone >= 0) ? '+' : '') + padNumber(hours, 2, minusSign) + ':' + padNumber(Math.abs(zone % 60), 2, minusSign);
            }
          default:
            throw new Error("Unknown zone width \"" + width + "\"");
        }
      };
    }
    var JANUARY = 0;
    var THURSDAY = 4;
    function getFirstThursdayOfYear(year) {
      var firstDayOfYear = (new Date(year, JANUARY, 1)).getDay();
      return new Date(year, 0, 1 + ((firstDayOfYear <= THURSDAY) ? THURSDAY : THURSDAY + 7) - firstDayOfYear);
    }
    function getThursdayThisWeek(datetime) {
      return new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate() + (THURSDAY - datetime.getDay()));
    }
    function weekGetter(size, monthBased) {
      if (monthBased === void 0) {
        monthBased = false;
      }
      return function(date, locale) {
        var result;
        if (monthBased) {
          var nbDaysBefore1stDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay() - 1;
          var today = date.getDate();
          result = 1 + Math.floor((today + nbDaysBefore1stDayOfMonth) / 7);
        } else {
          var firstThurs = getFirstThursdayOfYear(date.getFullYear());
          var thisThurs = getThursdayThisWeek(date);
          var diff = thisThurs.getTime() - firstThurs.getTime();
          result = 1 + Math.round(diff / 6.048e8);
        }
        return padNumber(result, size, getLocaleNumberSymbol(locale, NumberSymbol.MinusSign));
      };
    }
    var DATE_FORMATS = {};
    function getDateFormatter(format) {
      if (DATE_FORMATS[format]) {
        return DATE_FORMATS[format];
      }
      var formatter;
      switch (format) {
        case 'G':
        case 'GG':
        case 'GGG':
          formatter = dateStrGetter(TranslationType.Eras, TranslationWidth.Abbreviated);
          break;
        case 'GGGG':
          formatter = dateStrGetter(TranslationType.Eras, TranslationWidth.Wide);
          break;
        case 'GGGGG':
          formatter = dateStrGetter(TranslationType.Eras, TranslationWidth.Narrow);
          break;
        case 'y':
          formatter = dateGetter(DateType.FullYear, 1, 0, false, true);
          break;
        case 'yy':
          formatter = dateGetter(DateType.FullYear, 2, 0, true, true);
          break;
        case 'yyy':
          formatter = dateGetter(DateType.FullYear, 3, 0, false, true);
          break;
        case 'yyyy':
          formatter = dateGetter(DateType.FullYear, 4, 0, false, true);
          break;
        case 'M':
        case 'L':
          formatter = dateGetter(DateType.Month, 1, 1);
          break;
        case 'MM':
        case 'LL':
          formatter = dateGetter(DateType.Month, 2, 1);
          break;
        case 'MMM':
          formatter = dateStrGetter(TranslationType.Months, TranslationWidth.Abbreviated);
          break;
        case 'MMMM':
          formatter = dateStrGetter(TranslationType.Months, TranslationWidth.Wide);
          break;
        case 'MMMMM':
          formatter = dateStrGetter(TranslationType.Months, TranslationWidth.Narrow);
          break;
        case 'LLL':
          formatter = dateStrGetter(TranslationType.Months, TranslationWidth.Abbreviated, FormStyle.Standalone);
          break;
        case 'LLLL':
          formatter = dateStrGetter(TranslationType.Months, TranslationWidth.Wide, FormStyle.Standalone);
          break;
        case 'LLLLL':
          formatter = dateStrGetter(TranslationType.Months, TranslationWidth.Narrow, FormStyle.Standalone);
          break;
        case 'w':
          formatter = weekGetter(1);
          break;
        case 'ww':
          formatter = weekGetter(2);
          break;
        case 'W':
          formatter = weekGetter(1, true);
          break;
        case 'd':
          formatter = dateGetter(DateType.Date, 1);
          break;
        case 'dd':
          formatter = dateGetter(DateType.Date, 2);
          break;
        case 'E':
        case 'EE':
        case 'EEE':
          formatter = dateStrGetter(TranslationType.Days, TranslationWidth.Abbreviated);
          break;
        case 'EEEE':
          formatter = dateStrGetter(TranslationType.Days, TranslationWidth.Wide);
          break;
        case 'EEEEE':
          formatter = dateStrGetter(TranslationType.Days, TranslationWidth.Narrow);
          break;
        case 'EEEEEE':
          formatter = dateStrGetter(TranslationType.Days, TranslationWidth.Short);
          break;
        case 'a':
        case 'aa':
        case 'aaa':
          formatter = dateStrGetter(TranslationType.DayPeriods, TranslationWidth.Abbreviated);
          break;
        case 'aaaa':
          formatter = dateStrGetter(TranslationType.DayPeriods, TranslationWidth.Wide);
          break;
        case 'aaaaa':
          formatter = dateStrGetter(TranslationType.DayPeriods, TranslationWidth.Narrow);
          break;
        case 'b':
        case 'bb':
        case 'bbb':
          formatter = dateStrGetter(TranslationType.DayPeriods, TranslationWidth.Abbreviated, FormStyle.Standalone, true);
          break;
        case 'bbbb':
          formatter = dateStrGetter(TranslationType.DayPeriods, TranslationWidth.Wide, FormStyle.Standalone, true);
          break;
        case 'bbbbb':
          formatter = dateStrGetter(TranslationType.DayPeriods, TranslationWidth.Narrow, FormStyle.Standalone, true);
          break;
        case 'B':
        case 'BB':
        case 'BBB':
          formatter = dateStrGetter(TranslationType.DayPeriods, TranslationWidth.Abbreviated, FormStyle.Format, true);
          break;
        case 'BBBB':
          formatter = dateStrGetter(TranslationType.DayPeriods, TranslationWidth.Wide, FormStyle.Format, true);
          break;
        case 'BBBBB':
          formatter = dateStrGetter(TranslationType.DayPeriods, TranslationWidth.Narrow, FormStyle.Format, true);
          break;
        case 'h':
          formatter = dateGetter(DateType.Hours, 1, -12);
          break;
        case 'hh':
          formatter = dateGetter(DateType.Hours, 2, -12);
          break;
        case 'H':
          formatter = dateGetter(DateType.Hours, 1);
          break;
        case 'HH':
          formatter = dateGetter(DateType.Hours, 2);
          break;
        case 'm':
          formatter = dateGetter(DateType.Minutes, 1);
          break;
        case 'mm':
          formatter = dateGetter(DateType.Minutes, 2);
          break;
        case 's':
          formatter = dateGetter(DateType.Seconds, 1);
          break;
        case 'ss':
          formatter = dateGetter(DateType.Seconds, 2);
          break;
        case 'S':
          formatter = dateGetter(DateType.Milliseconds, 1);
          break;
        case 'SS':
          formatter = dateGetter(DateType.Milliseconds, 2);
          break;
        case 'SSS':
          formatter = dateGetter(DateType.Milliseconds, 3);
          break;
        case 'Z':
        case 'ZZ':
        case 'ZZZ':
          formatter = timeZoneGetter(ZoneWidth.Short);
          break;
        case 'ZZZZZ':
          formatter = timeZoneGetter(ZoneWidth.Extended);
          break;
        case 'O':
        case 'OO':
        case 'OOO':
        case 'z':
        case 'zz':
        case 'zzz':
          formatter = timeZoneGetter(ZoneWidth.ShortGMT);
          break;
        case 'OOOO':
        case 'ZZZZ':
        case 'zzzz':
          formatter = timeZoneGetter(ZoneWidth.Long);
          break;
        default:
          return null;
      }
      DATE_FORMATS[format] = formatter;
      return formatter;
    }
    function timezoneToOffset(timezone, fallback) {
      timezone = timezone.replace(/:/g, '');
      var requestedTimezoneOffset = Date.parse('Jan 01, 1970 00:00:00 ' + timezone) / 60000;
      return isNaN(requestedTimezoneOffset) ? fallback : requestedTimezoneOffset;
    }
    function addDateMinutes(date, minutes) {
      date = new Date(date.getTime());
      date.setMinutes(date.getMinutes() + minutes);
      return date;
    }
    function convertTimezoneToLocal(date, timezone, reverse) {
      var reverseValue = reverse ? -1 : 1;
      var dateTimezoneOffset = date.getTimezoneOffset();
      var timezoneOffset = timezoneToOffset(timezone, dateTimezoneOffset);
      return addDateMinutes(date, reverseValue * (timezoneOffset - dateTimezoneOffset));
    }
    function invalidPipeArgumentError(type, value) {
      return Error("InvalidPipeArgument: '" + value + "' for pipe '" + _angular_core.ɵstringify(type) + "'");
    }
    var ISO8601_DATE_REGEX = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
    var DatePipe = (function() {
      function DatePipe(locale) {
        this.locale = locale;
      }
      DatePipe.prototype.transform = function(value, format, timezone, locale) {
        if (format === void 0) {
          format = 'mediumDate';
        }
        if (value == null || value === '' || value !== value)
          return null;
        if (typeof value === 'string') {
          value = value.trim();
        }
        var date;
        var match;
        if (isDate$1(value)) {
          date = value;
        } else if (!isNaN(value - parseFloat(value))) {
          date = new Date(parseFloat(value));
        } else if (typeof value === 'string' && /^(\d{4}-\d{1,2}-\d{1,2})$/.test(value)) {
          var _a = value.split('-').map(function(val) {
            return +val;
          }),
              y = _a[0],
              m = _a[1],
              d = _a[2];
          date = new Date(y, m - 1, d);
        } else if ((typeof value === 'string') && (match = value.match(ISO8601_DATE_REGEX))) {
          date = isoStringToDate(match);
        } else {
          date = new Date(value);
        }
        if (!isDate$1(date)) {
          throw invalidPipeArgumentError(DatePipe, value);
        }
        return formatDate(date, format, locale || this.locale, timezone);
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
      return DatePipe;
    }());
    function isoStringToDate(match) {
      var date = new Date(0);
      var tzHour = 0;
      var tzMin = 0;
      var dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear;
      var timeSetter = match[8] ? date.setUTCHours : date.setHours;
      if (match[9]) {
        tzHour = +(match[9] + match[10]);
        tzMin = +(match[9] + match[11]);
      }
      dateSetter.call(date, +(match[1]), +(match[2]) - 1, +(match[3]));
      var h = +(match[4] || '0') - tzHour;
      var m = +(match[5] || '0') - tzMin;
      var s = +(match[6] || '0');
      var ms = Math.round(parseFloat('0.' + (match[7] || 0)) * 1000);
      timeSetter.call(date, h, m, s, ms);
      return date;
    }
    function isDate$1(value) {
      return value instanceof Date && !isNaN(value.valueOf());
    }
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
    var DATE_FORMATS_SPLIT$1 = /((?:[^yMLdHhmsazZEwGjJ']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|L+|d+|H+|h+|J+|j+|m+|s+|a|z|Z|G+|w+))(.*)/;
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
    var DATE_FORMATS$1 = {
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
      'Z': timeZoneGetter$1('short'),
      'z': timeZoneGetter$1('long'),
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
    function timeZoneGetter$1(timezone) {
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
      return options.reduce(function(merged, opt) {
        return (__assign({}, merged, opt));
      }, {});
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
        DATE_FORMATS_SPLIT$1.exec(format);
        var _format = format;
        while (_format) {
          match = DATE_FORMATS_SPLIT$1.exec(_format);
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
        var fn = DATE_FORMATS$1[part];
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
    var DeprecatedDatePipe = (function() {
      function DeprecatedDatePipe(_locale) {
        this._locale = _locale;
      }
      DeprecatedDatePipe.prototype.transform = function(value, pattern) {
        if (pattern === void 0) {
          pattern = 'mediumDate';
        }
        if (value == null || value === '' || value !== value)
          return null;
        var date;
        if (typeof value === 'string') {
          value = value.trim();
        }
        if (isDate(value)) {
          date = value;
        } else if (!isNaN(value - parseFloat(value))) {
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
            throw invalidPipeArgumentError(DeprecatedDatePipe, value);
          }
        }
        return DateFormatter.format(date, this._locale, DeprecatedDatePipe._ALIASES[pattern] || pattern);
      };
      DeprecatedDatePipe._ALIASES = {
        'medium': 'yMMMdjms',
        'short': 'yMdjm',
        'fullDate': 'yMMMMEEEEd',
        'longDate': 'yMMMMd',
        'mediumDate': 'yMMMd',
        'shortDate': 'yMd',
        'mediumTime': 'jms',
        'shortTime': 'jm'
      };
      DeprecatedDatePipe.decorators = [{
        type: _angular_core.Pipe,
        args: [{
          name: 'date',
          pure: true
        }]
      }];
      DeprecatedDatePipe.ctorParameters = function() {
        return [{
          type: undefined,
          decorators: [{
            type: _angular_core.Inject,
            args: [_angular_core.LOCALE_ID]
          }]
        }];
      };
      return DeprecatedDatePipe;
    }());
    function isDate(value) {
      return value instanceof Date && !isNaN(value.valueOf());
    }
    var NUMBER_FORMAT_REGEXP = /^(\d+)?\.((\d+)(-(\d+))?)?$/;
    var MAX_DIGITS = 22;
    var DECIMAL_SEP = '.';
    var ZERO_CHAR = '0';
    var PATTERN_SEP = ';';
    var GROUP_SEP = ',';
    var DIGIT_CHAR = '#';
    var CURRENCY_CHAR = '¤';
    var PERCENT_CHAR = '%';
    function formatNumber$1(value, locale, style, digitsInfo, currency) {
      if (currency === void 0) {
        currency = null;
      }
      var res = {str: null};
      var format = getLocaleNumberFormat(locale, style);
      var num;
      if (typeof value === 'string' && !isNaN(+value - parseFloat(value))) {
        num = +value;
      } else if (typeof value !== 'number') {
        res.error = value + " is not a number";
        return res;
      } else {
        num = value;
      }
      var pattern = parseNumberFormat(format, getLocaleNumberSymbol(locale, NumberSymbol.MinusSign));
      var formattedText = '';
      var isZero = false;
      if (!isFinite(num)) {
        formattedText = getLocaleNumberSymbol(locale, NumberSymbol.Infinity);
      } else {
        var parsedNumber = parseNumber(num);
        if (style === NumberFormatStyle.Percent) {
          parsedNumber = toPercent(parsedNumber);
        }
        var minInt = pattern.minInt;
        var minFraction = pattern.minFrac;
        var maxFraction = pattern.maxFrac;
        if (digitsInfo) {
          var parts = digitsInfo.match(NUMBER_FORMAT_REGEXP);
          if (parts === null) {
            res.error = digitsInfo + " is not a valid digit info";
            return res;
          }
          var minIntPart = parts[1];
          var minFractionPart = parts[3];
          var maxFractionPart = parts[5];
          if (minIntPart != null) {
            minInt = parseIntAutoRadix(minIntPart);
          }
          if (minFractionPart != null) {
            minFraction = parseIntAutoRadix(minFractionPart);
          }
          if (maxFractionPart != null) {
            maxFraction = parseIntAutoRadix(maxFractionPart);
          } else if (minFractionPart != null && minFraction > maxFraction) {
            maxFraction = minFraction;
          }
        }
        roundNumber(parsedNumber, minFraction, maxFraction);
        var digits = parsedNumber.digits;
        var integerLen = parsedNumber.integerLen;
        var exponent = parsedNumber.exponent;
        var decimals = [];
        isZero = digits.every(function(d) {
          return !d;
        });
        for (; integerLen < minInt; integerLen++) {
          digits.unshift(0);
        }
        for (; integerLen < 0; integerLen++) {
          digits.unshift(0);
        }
        if (integerLen > 0) {
          decimals = digits.splice(integerLen, digits.length);
        } else {
          decimals = digits;
          digits = [0];
        }
        var groups = [];
        if (digits.length >= pattern.lgSize) {
          groups.unshift(digits.splice(-pattern.lgSize, digits.length).join(''));
        }
        while (digits.length > pattern.gSize) {
          groups.unshift(digits.splice(-pattern.gSize, digits.length).join(''));
        }
        if (digits.length) {
          groups.unshift(digits.join(''));
        }
        var groupSymbol = currency ? NumberSymbol.CurrencyGroup : NumberSymbol.Group;
        formattedText = groups.join(getLocaleNumberSymbol(locale, groupSymbol));
        if (decimals.length) {
          var decimalSymbol = currency ? NumberSymbol.CurrencyDecimal : NumberSymbol.Decimal;
          formattedText += getLocaleNumberSymbol(locale, decimalSymbol) + decimals.join('');
        }
        if (exponent) {
          formattedText += getLocaleNumberSymbol(locale, NumberSymbol.Exponential) + '+' + exponent;
        }
      }
      if (num < 0 && !isZero) {
        formattedText = pattern.negPre + formattedText + pattern.negSuf;
      } else {
        formattedText = pattern.posPre + formattedText + pattern.posSuf;
      }
      if (style === NumberFormatStyle.Currency && currency !== null) {
        res.str = formattedText.replace(CURRENCY_CHAR, currency).replace(CURRENCY_CHAR, '');
        return res;
      }
      if (style === NumberFormatStyle.Percent) {
        res.str = formattedText.replace(new RegExp(PERCENT_CHAR, 'g'), getLocaleNumberSymbol(locale, NumberSymbol.PercentSign));
        return res;
      }
      res.str = formattedText;
      return res;
    }
    function parseNumberFormat(format, minusSign) {
      if (minusSign === void 0) {
        minusSign = '-';
      }
      var p = {
        minInt: 1,
        minFrac: 0,
        maxFrac: 0,
        posPre: '',
        posSuf: '',
        negPre: '',
        negSuf: '',
        gSize: 0,
        lgSize: 0
      };
      var patternParts = format.split(PATTERN_SEP);
      var positive = patternParts[0];
      var negative = patternParts[1];
      var positiveParts = positive.indexOf(DECIMAL_SEP) !== -1 ? positive.split(DECIMAL_SEP) : [positive.substring(0, positive.lastIndexOf(ZERO_CHAR) + 1), positive.substring(positive.lastIndexOf(ZERO_CHAR) + 1)],
          integer = positiveParts[0],
          fraction = positiveParts[1] || '';
      p.posPre = integer.substr(0, integer.indexOf(DIGIT_CHAR));
      for (var i = 0; i < fraction.length; i++) {
        var ch = fraction.charAt(i);
        if (ch === ZERO_CHAR) {
          p.minFrac = p.maxFrac = i + 1;
        } else if (ch === DIGIT_CHAR) {
          p.maxFrac = i + 1;
        } else {
          p.posSuf += ch;
        }
      }
      var groups = integer.split(GROUP_SEP);
      p.gSize = groups[1] ? groups[1].length : 0;
      p.lgSize = (groups[2] || groups[1]) ? (groups[2] || groups[1]).length : 0;
      if (negative) {
        var trunkLen = positive.length - p.posPre.length - p.posSuf.length,
            pos = negative.indexOf(DIGIT_CHAR);
        p.negPre = negative.substr(0, pos).replace(/'/g, '');
        p.negSuf = negative.substr(pos + trunkLen).replace(/'/g, '');
      } else {
        p.negPre = minusSign + p.posPre;
        p.negSuf = p.posSuf;
      }
      return p;
    }
    function toPercent(parsedNumber) {
      if (parsedNumber.digits[0] === 0) {
        return parsedNumber;
      }
      var fractionLen = parsedNumber.digits.length - parsedNumber.integerLen;
      if (parsedNumber.exponent) {
        parsedNumber.exponent += 2;
      } else {
        if (fractionLen === 0) {
          parsedNumber.digits.push(0, 0);
        } else if (fractionLen === 1) {
          parsedNumber.digits.push(0);
        }
        parsedNumber.integerLen += 2;
      }
      return parsedNumber;
    }
    function parseNumber(num) {
      var numStr = Math.abs(num) + '';
      var exponent = 0,
          digits,
          integerLen;
      var i,
          j,
          zeros;
      if ((integerLen = numStr.indexOf(DECIMAL_SEP)) > -1) {
        numStr = numStr.replace(DECIMAL_SEP, '');
      }
      if ((i = numStr.search(/e/i)) > 0) {
        if (integerLen < 0)
          integerLen = i;
        integerLen += +numStr.slice(i + 1);
        numStr = numStr.substring(0, i);
      } else if (integerLen < 0) {
        integerLen = numStr.length;
      }
      for (i = 0; numStr.charAt(i) === ZERO_CHAR; i++) {}
      if (i === (zeros = numStr.length)) {
        digits = [0];
        integerLen = 1;
      } else {
        zeros--;
        while (numStr.charAt(zeros) === ZERO_CHAR)
          zeros--;
        integerLen -= i;
        digits = [];
        for (j = 0; i <= zeros; i++, j++) {
          digits[j] = +numStr.charAt(i);
        }
      }
      if (integerLen > MAX_DIGITS) {
        digits = digits.splice(0, MAX_DIGITS - 1);
        exponent = integerLen - 1;
        integerLen = 1;
      }
      return {
        digits: digits,
        exponent: exponent,
        integerLen: integerLen
      };
    }
    function roundNumber(parsedNumber, minFrac, maxFrac) {
      if (minFrac > maxFrac) {
        throw new Error("The minimum number of digits after fraction (" + minFrac + ") is higher than the maximum (" + maxFrac + ").");
      }
      var digits = parsedNumber.digits;
      var fractionLen = digits.length - parsedNumber.integerLen;
      var fractionSize = Math.min(Math.max(minFrac, fractionLen), maxFrac);
      var roundAt = fractionSize + parsedNumber.integerLen;
      var digit = digits[roundAt];
      if (roundAt > 0) {
        digits.splice(Math.max(parsedNumber.integerLen, roundAt));
        for (var j = roundAt; j < digits.length; j++) {
          digits[j] = 0;
        }
      } else {
        fractionLen = Math.max(0, fractionLen);
        parsedNumber.integerLen = 1;
        digits.length = Math.max(1, roundAt = fractionSize + 1);
        digits[0] = 0;
        for (var i = 1; i < roundAt; i++)
          digits[i] = 0;
      }
      if (digit >= 5) {
        if (roundAt - 1 < 0) {
          for (var k = 0; k > roundAt; k--) {
            digits.unshift(0);
            parsedNumber.integerLen++;
          }
          digits.unshift(1);
          parsedNumber.integerLen++;
        } else {
          digits[roundAt - 1]++;
        }
      }
      for (; fractionLen < Math.max(0, fractionSize); fractionLen++)
        digits.push(0);
      var dropTrailingZeros = fractionSize !== 0;
      var minLen = minFrac + parsedNumber.integerLen;
      var carry = digits.reduceRight(function(carry, d, i, digits) {
        d = d + carry;
        digits[i] = d < 10 ? d : d - 10;
        if (dropTrailingZeros) {
          if (digits[i] === 0 && i >= minLen) {
            digits.pop();
          } else {
            dropTrailingZeros = false;
          }
        }
        return d >= 10 ? 1 : 0;
      }, 0);
      if (carry) {
        digits.unshift(carry);
        parsedNumber.integerLen++;
      }
    }
    function parseIntAutoRadix(text) {
      var result = parseInt(text);
      if (isNaN(result)) {
        throw new Error('Invalid integer literal when parsing ' + text);
      }
      return result;
    }
    function formatNumber(pipe, locale, value, style, digits, currency, currencyAsSymbol) {
      if (currency === void 0) {
        currency = null;
      }
      if (currencyAsSymbol === void 0) {
        currencyAsSymbol = false;
      }
      if (value == null)
        return null;
      value = typeof value === 'string' && !isNaN(+value - parseFloat(value)) ? +value : value;
      if (typeof value !== 'number') {
        throw invalidPipeArgumentError(pipe, value);
      }
      var minInt;
      var minFraction;
      var maxFraction;
      if (style !== NumberFormatStyle.Currency) {
        minInt = 1;
        minFraction = 0;
        maxFraction = 3;
      }
      if (digits) {
        var parts = digits.match(NUMBER_FORMAT_REGEXP);
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
    var DeprecatedDecimalPipe = (function() {
      function DeprecatedDecimalPipe(_locale) {
        this._locale = _locale;
      }
      DeprecatedDecimalPipe.prototype.transform = function(value, digits) {
        return formatNumber(DeprecatedDecimalPipe, this._locale, value, NumberFormatStyle.Decimal, digits);
      };
      DeprecatedDecimalPipe.decorators = [{
        type: _angular_core.Pipe,
        args: [{name: 'number'}]
      }];
      DeprecatedDecimalPipe.ctorParameters = function() {
        return [{
          type: undefined,
          decorators: [{
            type: _angular_core.Inject,
            args: [_angular_core.LOCALE_ID]
          }]
        }];
      };
      return DeprecatedDecimalPipe;
    }());
    var DeprecatedPercentPipe = (function() {
      function DeprecatedPercentPipe(_locale) {
        this._locale = _locale;
      }
      DeprecatedPercentPipe.prototype.transform = function(value, digits) {
        return formatNumber(DeprecatedPercentPipe, this._locale, value, NumberFormatStyle.Percent, digits);
      };
      DeprecatedPercentPipe.decorators = [{
        type: _angular_core.Pipe,
        args: [{name: 'percent'}]
      }];
      DeprecatedPercentPipe.ctorParameters = function() {
        return [{
          type: undefined,
          decorators: [{
            type: _angular_core.Inject,
            args: [_angular_core.LOCALE_ID]
          }]
        }];
      };
      return DeprecatedPercentPipe;
    }());
    var DeprecatedCurrencyPipe = (function() {
      function DeprecatedCurrencyPipe(_locale) {
        this._locale = _locale;
      }
      DeprecatedCurrencyPipe.prototype.transform = function(value, currencyCode, symbolDisplay, digits) {
        if (currencyCode === void 0) {
          currencyCode = 'USD';
        }
        if (symbolDisplay === void 0) {
          symbolDisplay = false;
        }
        return formatNumber(DeprecatedCurrencyPipe, this._locale, value, NumberFormatStyle.Currency, digits, currencyCode, symbolDisplay);
      };
      DeprecatedCurrencyPipe.decorators = [{
        type: _angular_core.Pipe,
        args: [{name: 'currency'}]
      }];
      DeprecatedCurrencyPipe.ctorParameters = function() {
        return [{
          type: undefined,
          decorators: [{
            type: _angular_core.Inject,
            args: [_angular_core.LOCALE_ID]
          }]
        }];
      };
      return DeprecatedCurrencyPipe;
    }());
    var COMMON_DEPRECATED_I18N_PIPES = [DeprecatedDecimalPipe, DeprecatedPercentPipe, DeprecatedCurrencyPipe, DeprecatedDatePipe];
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
      return AsyncPipe;
    }());
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
      LowerCasePipe.decorators = [{
        type: _angular_core.Pipe,
        args: [{name: 'lowercase'}]
      }];
      LowerCasePipe.ctorParameters = function() {
        return [];
      };
      return LowerCasePipe;
    }());
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
      TitleCasePipe.decorators = [{
        type: _angular_core.Pipe,
        args: [{name: 'titlecase'}]
      }];
      TitleCasePipe.ctorParameters = function() {
        return [];
      };
      return TitleCasePipe;
    }());
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
      UpperCasePipe.decorators = [{
        type: _angular_core.Pipe,
        args: [{name: 'uppercase'}]
      }];
      UpperCasePipe.ctorParameters = function() {
        return [];
      };
      return UpperCasePipe;
    }());
    var _INTERPOLATION_REGEXP = /#/g;
    var I18nPluralPipe = (function() {
      function I18nPluralPipe(_localization) {
        this._localization = _localization;
      }
      I18nPluralPipe.prototype.transform = function(value, pluralMap, locale) {
        if (value == null)
          return '';
        if (typeof pluralMap !== 'object' || pluralMap === null) {
          throw invalidPipeArgumentError(I18nPluralPipe, pluralMap);
        }
        var key = getPluralCategory(value, Object.keys(pluralMap), this._localization, locale);
        return pluralMap[key].replace(_INTERPOLATION_REGEXP, value.toString());
      };
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
      return I18nPluralPipe;
    }());
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
      return I18nSelectPipe;
    }());
    var JsonPipe = (function() {
      function JsonPipe() {}
      JsonPipe.prototype.transform = function(value) {
        return JSON.stringify(value, null, 2);
      };
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
      return JsonPipe;
    }());
    var DecimalPipe = (function() {
      function DecimalPipe(_locale) {
        this._locale = _locale;
      }
      DecimalPipe.prototype.transform = function(value, digits, locale) {
        if (isEmpty(value))
          return null;
        locale = locale || this._locale;
        var _a = formatNumber$1(value, locale, NumberFormatStyle.Decimal, digits),
            str = _a.str,
            error = _a.error;
        if (error) {
          throw invalidPipeArgumentError(DecimalPipe, error);
        }
        return str;
      };
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
      return DecimalPipe;
    }());
    var PercentPipe = (function() {
      function PercentPipe(_locale) {
        this._locale = _locale;
      }
      PercentPipe.prototype.transform = function(value, digits, locale) {
        if (isEmpty(value))
          return null;
        locale = locale || this._locale;
        var _a = formatNumber$1(value, locale, NumberFormatStyle.Percent, digits),
            str = _a.str,
            error = _a.error;
        if (error) {
          throw invalidPipeArgumentError(PercentPipe, error);
        }
        return str;
      };
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
      return PercentPipe;
    }());
    var CurrencyPipe = (function() {
      function CurrencyPipe(_locale) {
        this._locale = _locale;
      }
      CurrencyPipe.prototype.transform = function(value, currencyCode, display, digits, locale) {
        if (display === void 0) {
          display = 'symbol';
        }
        if (isEmpty(value))
          return null;
        locale = locale || this._locale;
        if (typeof display === 'boolean') {
          if ((console) && (console.warn)) {
            console.warn("Warning: the currency pipe has been changed in Angular v5. The symbolDisplay option (third parameter) is now a string instead of a boolean. The accepted values are \"code\", \"symbol\" or \"symbol-narrow\".");
          }
          display = display ? 'symbol' : 'code';
        }
        var currency = currencyCode || 'USD';
        if (display !== 'code') {
          currency = getCurrencySymbol(currency, display === 'symbol' ? 'wide' : 'narrow');
        }
        var _a = formatNumber$1(value, locale, NumberFormatStyle.Currency, digits, currency),
            str = _a.str,
            error = _a.error;
        if (error) {
          throw invalidPipeArgumentError(CurrencyPipe, error);
        }
        return str;
      };
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
      return CurrencyPipe;
    }());
    function isEmpty(value) {
      return value == null || value === '' || value !== value;
    }
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
      return SlicePipe;
    }());
    var COMMON_PIPES = [AsyncPipe, UpperCasePipe, LowerCasePipe, JsonPipe, SlicePipe, DecimalPipe, PercentPipe, TitleCasePipe, CurrencyPipe, DatePipe, I18nPluralPipe, I18nSelectPipe];
    var CommonModule = (function() {
      function CommonModule() {}
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
      return CommonModule;
    }());
    var ɵ0 = getPluralCase;
    var DeprecatedI18NPipesModule = (function() {
      function DeprecatedI18NPipesModule() {}
      DeprecatedI18NPipesModule.decorators = [{
        type: _angular_core.NgModule,
        args: [{
          declarations: [COMMON_DEPRECATED_I18N_PIPES],
          exports: [COMMON_DEPRECATED_I18N_PIPES],
          providers: [{
            provide: DEPRECATED_PLURAL_FN,
            useValue: ɵ0
          }]
        }]
      }];
      DeprecatedI18NPipesModule.ctorParameters = function() {
        return [];
      };
      return DeprecatedI18NPipesModule;
    }());
    var DOCUMENT = new _angular_core.InjectionToken('DocumentToken');
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
    var VERSION = new _angular_core.Version('5.2.9');
    exports.ɵregisterLocaleData = registerLocaleData;
    exports.NgLocaleLocalization = NgLocaleLocalization;
    exports.NgLocalization = NgLocalization;
    exports.registerLocaleData = registerLocaleData;
    exports.Plural = Plural;
    exports.NumberFormatStyle = NumberFormatStyle;
    exports.FormStyle = FormStyle;
    exports.TranslationWidth = TranslationWidth;
    exports.FormatWidth = FormatWidth;
    exports.NumberSymbol = NumberSymbol;
    exports.WeekDay = WeekDay;
    exports.getCurrencySymbol = getCurrencySymbol;
    exports.getLocaleDayPeriods = getLocaleDayPeriods;
    exports.getLocaleDayNames = getLocaleDayNames;
    exports.getLocaleMonthNames = getLocaleMonthNames;
    exports.getLocaleId = getLocaleId;
    exports.getLocaleEraNames = getLocaleEraNames;
    exports.getLocaleWeekEndRange = getLocaleWeekEndRange;
    exports.getLocaleFirstDayOfWeek = getLocaleFirstDayOfWeek;
    exports.getLocaleDateFormat = getLocaleDateFormat;
    exports.getLocaleDateTimeFormat = getLocaleDateTimeFormat;
    exports.getLocaleExtraDayPeriodRules = getLocaleExtraDayPeriodRules;
    exports.getLocaleExtraDayPeriods = getLocaleExtraDayPeriods;
    exports.getLocalePluralCase = getLocalePluralCase;
    exports.getLocaleTimeFormat = getLocaleTimeFormat;
    exports.getLocaleNumberSymbol = getLocaleNumberSymbol;
    exports.getLocaleNumberFormat = getLocaleNumberFormat;
    exports.getLocaleCurrencyName = getLocaleCurrencyName;
    exports.getLocaleCurrencySymbol = getLocaleCurrencySymbol;
    exports.ɵparseCookieValue = parseCookieValue;
    exports.CommonModule = CommonModule;
    exports.DeprecatedI18NPipesModule = DeprecatedI18NPipesModule;
    exports.NgClass = NgClass;
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
    exports.DOCUMENT = DOCUMENT;
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
    exports.DeprecatedDatePipe = DeprecatedDatePipe;
    exports.DeprecatedCurrencyPipe = DeprecatedCurrencyPipe;
    exports.DeprecatedDecimalPipe = DeprecatedDecimalPipe;
    exports.DeprecatedPercentPipe = DeprecatedPercentPipe;
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
    exports.ɵe = COMMON_DIRECTIVES;
    exports.ɵd = findLocaleData;
    exports.ɵa = DEPRECATED_PLURAL_FN;
    exports.ɵb = getPluralCase;
    exports.ɵg = COMMON_DEPRECATED_I18N_PIPES;
    exports.ɵf = COMMON_PIPES;
    Object.defineProperty(exports, '__esModule', {value: true});
  })));
})(require('process'));
