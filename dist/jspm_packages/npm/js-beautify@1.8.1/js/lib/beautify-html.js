/* */ 
"format cjs";
(function() {
  var legacy_beautify_html = (function(modules) {
    var installedModules = {};
    function __webpack_require__(moduleId) {
      if (installedModules[moduleId]) {
        return installedModules[moduleId].exports;
      }
      var module = installedModules[moduleId] = {
        i: moduleId,
        l: false,
        exports: {}
      };
      modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
      module.l = true;
      return module.exports;
    }
    __webpack_require__.m = modules;
    __webpack_require__.c = installedModules;
    __webpack_require__.d = function(exports, name, getter) {
      if (!__webpack_require__.o(exports, name)) {
        Object.defineProperty(exports, name, {
          enumerable: true,
          get: getter
        });
      }
    };
    __webpack_require__.r = function(exports) {
      if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        Object.defineProperty(exports, Symbol.toStringTag, {value: 'Module'});
      }
      Object.defineProperty(exports, '__esModule', {value: true});
    };
    __webpack_require__.t = function(value, mode) {
      if (mode & 1)
        value = __webpack_require__(value);
      if (mode & 8)
        return value;
      if ((mode & 4) && typeof value === 'object' && value && value.__esModule)
        return value;
      var ns = Object.create(null);
      __webpack_require__.r(ns);
      Object.defineProperty(ns, 'default', {
        enumerable: true,
        value: value
      });
      if (mode & 2 && typeof value != 'string')
        for (var key in value)
          __webpack_require__.d(ns, key, function(key) {
            return value[key];
          }.bind(null, key));
      return ns;
    };
    __webpack_require__.n = function(module) {
      var getter = module && module.__esModule ? function getDefault() {
        return module['default'];
      } : function getModuleExports() {
        return module;
      };
      __webpack_require__.d(getter, 'a', getter);
      return getter;
    };
    __webpack_require__.o = function(object, property) {
      return Object.prototype.hasOwnProperty.call(object, property);
    };
    __webpack_require__.p = "";
    return __webpack_require__(__webpack_require__.s = 13);
  })([, , (function(module, exports, __webpack_require__) {
    "use strict";
    function mergeOpts(allOptions, childFieldName) {
      var finalOpts = {};
      var name;
      for (name in allOptions) {
        if (name !== childFieldName) {
          finalOpts[name] = allOptions[name];
        }
      }
      if (childFieldName in allOptions) {
        for (name in allOptions[childFieldName]) {
          finalOpts[name] = allOptions[childFieldName][name];
        }
      }
      return finalOpts;
    }
    function normalizeOpts(options) {
      var convertedOpts = {};
      var key;
      for (key in options) {
        var newKey = key.replace(/-/g, "_");
        convertedOpts[newKey] = options[key];
      }
      return convertedOpts;
    }
    module.exports.mergeOpts = mergeOpts;
    module.exports.normalizeOpts = normalizeOpts;
  }), (function(module, exports, __webpack_require__) {
    "use strict";
    var nonASCIIwhitespace = /[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/;
    var baseASCIIidentifierStartChars = "\x24\x40\x41-\x5a\x5f\x61-\x7a";
    var nonASCIIidentifierStartChars = "\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0\u08a2-\u08ac\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua697\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa80-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc";
    var baseASCIIidentifierChars = "\x24\x30-\x39\x41-\x5a\x5f\x61-\x7a";
    var nonASCIIidentifierChars = "\u0300-\u036f\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u0620-\u0649\u0672-\u06d3\u06e7-\u06e8\u06fb-\u06fc\u0730-\u074a\u0800-\u0814\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0840-\u0857\u08e4-\u08fe\u0900-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962-\u0963\u0966-\u096f\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09d7\u09df-\u09e0\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a66-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2-\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b5f-\u0b60\u0b66-\u0b6f\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0be6-\u0bef\u0c01-\u0c03\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62-\u0c63\u0c66-\u0c6f\u0c82\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2-\u0ce3\u0ce6-\u0cef\u0d02\u0d03\u0d46-\u0d48\u0d57\u0d62-\u0d63\u0d66-\u0d6f\u0d82\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e34-\u0e3a\u0e40-\u0e45\u0e50-\u0e59\u0eb4-\u0eb9\u0ec8-\u0ecd\u0ed0-\u0ed9\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f41-\u0f47\u0f71-\u0f84\u0f86-\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u1029\u1040-\u1049\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f-\u109d\u135d-\u135f\u170e-\u1710\u1720-\u1730\u1740-\u1750\u1772\u1773\u1780-\u17b2\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u1920-\u192b\u1930-\u193b\u1951-\u196d\u19b0-\u19c0\u19c8-\u19c9\u19d0-\u19d9\u1a00-\u1a15\u1a20-\u1a53\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1b46-\u1b4b\u1b50-\u1b59\u1b6b-\u1b73\u1bb0-\u1bb9\u1be6-\u1bf3\u1c00-\u1c22\u1c40-\u1c49\u1c5b-\u1c7d\u1cd0-\u1cd2\u1d00-\u1dbe\u1e01-\u1f15\u200c\u200d\u203f\u2040\u2054\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2d81-\u2d96\u2de0-\u2dff\u3021-\u3028\u3099\u309a\ua640-\ua66d\ua674-\ua67d\ua69f\ua6f0-\ua6f1\ua7f8-\ua800\ua806\ua80b\ua823-\ua827\ua880-\ua881\ua8b4-\ua8c4\ua8d0-\ua8d9\ua8f3-\ua8f7\ua900-\ua909\ua926-\ua92d\ua930-\ua945\ua980-\ua983\ua9b3-\ua9c0\uaa00-\uaa27\uaa40-\uaa41\uaa4c-\uaa4d\uaa50-\uaa59\uaa7b\uaae0-\uaae9\uaaf2-\uaaf3\uabc0-\uabe1\uabec\uabed\uabf0-\uabf9\ufb20-\ufb28\ufe00-\ufe0f\ufe20-\ufe26\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff3f";
    var identifierStart = new RegExp("[" + baseASCIIidentifierStartChars + nonASCIIidentifierStartChars + "]");
    var identifierChars = new RegExp("[" + baseASCIIidentifierChars + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");
    exports.identifier = new RegExp("[" + baseASCIIidentifierStartChars + nonASCIIidentifierStartChars + "][" + baseASCIIidentifierChars + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]*", 'g');
    exports.newline = /[\n\r\u2028\u2029]/;
    exports.lineBreak = new RegExp('\r\n|' + exports.newline.source);
    exports.allLineBreaks = new RegExp(exports.lineBreak.source, 'g');
    exports.isIdentifierStart = function(code) {
      return identifierStart.test(String.fromCharCode(code));
    };
    exports.isIdentifierChar = function(code) {
      return identifierChars.test(String.fromCharCode(code));
    };
  }), (function(module, exports, __webpack_require__) {
    "use strict";
    function OutputLine(parent) {
      this.__parent = parent;
      this.__character_count = 0;
      this.__indent_count = -1;
      this.__alignment_count = 0;
      this.__items = [];
    }
    OutputLine.prototype.item = function(index) {
      if (index < 0) {
        return this.__items[this.__items.length + index];
      } else {
        return this.__items[index];
      }
    };
    OutputLine.prototype.has_match = function(pattern) {
      for (var lastCheckedOutput = this.__items.length - 1; lastCheckedOutput >= 0; lastCheckedOutput--) {
        if (this.__items[lastCheckedOutput].match(pattern)) {
          return true;
        }
      }
      return false;
    };
    OutputLine.prototype.set_indent = function(indent, alignment) {
      this.__indent_count = indent || 0;
      this.__alignment_count = alignment || 0;
      this.__character_count = this.__parent.baseIndentLength + this.__alignment_count + this.__indent_count * this.__parent.indent_length;
    };
    OutputLine.prototype.get_character_count = function() {
      return this.__character_count;
    };
    OutputLine.prototype.is_empty = function() {
      return this.__items.length === 0;
    };
    OutputLine.prototype.last = function() {
      if (!this.is_empty()) {
        return this.__items[this.__items.length - 1];
      } else {
        return null;
      }
    };
    OutputLine.prototype.push = function(item) {
      this.__items.push(item);
      this.__character_count += item.length;
    };
    OutputLine.prototype.push_raw = function(item) {
      this.push(item);
      var last_newline_index = item.lastIndexOf('\n');
      if (last_newline_index !== -1) {
        this.__character_count = item.length - last_newline_index;
      }
    };
    OutputLine.prototype.pop = function() {
      var item = null;
      if (!this.is_empty()) {
        item = this.__items.pop();
        this.__character_count -= item.length;
      }
      return item;
    };
    OutputLine.prototype.remove_indent = function() {
      if (this.__indent_count > 0) {
        this.__indent_count -= 1;
        this.__character_count -= this.__parent.indent_length;
      }
    };
    OutputLine.prototype.trim = function() {
      while (this.last() === ' ') {
        this.__items.pop();
        this.__character_count -= 1;
      }
    };
    OutputLine.prototype.toString = function() {
      var result = '';
      if (!this.is_empty()) {
        if (this.__indent_count >= 0) {
          result = this.__parent.get_indent_string(this.__indent_count);
        }
        if (this.__alignment_count >= 0) {
          result += this.__parent.get_alignment_string(this.__alignment_count);
        }
        result += this.__items.join('');
      }
      return result;
    };
    function IndentCache(base_string, level_string) {
      this.__cache = [base_string];
      this.__level_string = level_string;
    }
    IndentCache.prototype.__ensure_cache = function(level) {
      while (level >= this.__cache.length) {
        this.__cache.push(this.__cache[this.__cache.length - 1] + this.__level_string);
      }
    };
    IndentCache.prototype.get_level_string = function(level) {
      this.__ensure_cache(level);
      return this.__cache[level];
    };
    function Output(indent_string, baseIndentString) {
      baseIndentString = baseIndentString || '';
      this.__indent_cache = new IndentCache(baseIndentString, indent_string);
      this.__alignment_cache = new IndentCache('', ' ');
      this.baseIndentLength = baseIndentString.length;
      this.indent_length = indent_string.length;
      this.raw = false;
      this.__lines = [];
      this.previous_line = null;
      this.current_line = null;
      this.space_before_token = false;
      this.__add_outputline();
    }
    Output.prototype.__add_outputline = function() {
      this.previous_line = this.current_line;
      this.current_line = new OutputLine(this);
      this.__lines.push(this.current_line);
    };
    Output.prototype.get_line_number = function() {
      return this.__lines.length;
    };
    Output.prototype.get_indent_string = function(level) {
      return this.__indent_cache.get_level_string(level);
    };
    Output.prototype.get_alignment_string = function(level) {
      return this.__alignment_cache.get_level_string(level);
    };
    Output.prototype.is_empty = function() {
      return !this.previous_line && this.current_line.is_empty();
    };
    Output.prototype.add_new_line = function(force_newline) {
      if (this.is_empty() || (!force_newline && this.just_added_newline())) {
        return false;
      }
      if (!this.raw) {
        this.__add_outputline();
      }
      return true;
    };
    Output.prototype.get_code = function(end_with_newline, eol) {
      var sweet_code = this.__lines.join('\n').replace(/[\r\n\t ]+$/, '');
      if (end_with_newline) {
        sweet_code += '\n';
      }
      if (eol !== '\n') {
        sweet_code = sweet_code.replace(/[\n]/g, eol);
      }
      return sweet_code;
    };
    Output.prototype.set_indent = function(indent, alignment) {
      indent = indent || 0;
      alignment = alignment || 0;
      if (this.__lines.length > 1) {
        this.current_line.set_indent(indent, alignment);
        return true;
      }
      this.current_line.set_indent();
      return false;
    };
    Output.prototype.add_raw_token = function(token) {
      for (var x = 0; x < token.newlines; x++) {
        this.__add_outputline();
      }
      this.current_line.push(token.whitespace_before);
      this.current_line.push_raw(token.text);
      this.space_before_token = false;
    };
    Output.prototype.add_token = function(printable_token) {
      this.add_space_before_token();
      this.current_line.push(printable_token);
    };
    Output.prototype.add_space_before_token = function() {
      if (this.space_before_token && !this.just_added_newline()) {
        this.current_line.push(' ');
      }
      this.space_before_token = false;
    };
    Output.prototype.remove_indent = function(index) {
      var output_length = this.__lines.length;
      while (index < output_length) {
        this.__lines[index].remove_indent();
        index++;
      }
    };
    Output.prototype.trim = function(eat_newlines) {
      eat_newlines = (eat_newlines === undefined) ? false : eat_newlines;
      this.current_line.trim(this.indent_string, this.baseIndentString);
      while (eat_newlines && this.__lines.length > 1 && this.current_line.is_empty()) {
        this.__lines.pop();
        this.current_line = this.__lines[this.__lines.length - 1];
        this.current_line.trim();
      }
      this.previous_line = this.__lines.length > 1 ? this.__lines[this.__lines.length - 2] : null;
    };
    Output.prototype.just_added_newline = function() {
      return this.current_line.is_empty();
    };
    Output.prototype.just_added_blankline = function() {
      return this.is_empty() || (this.current_line.is_empty() && this.previous_line.is_empty());
    };
    Output.prototype.ensure_empty_line_above = function(starts_with, ends_with) {
      var index = this.__lines.length - 2;
      while (index >= 0) {
        var potentialEmptyLine = this.__lines[index];
        if (potentialEmptyLine.is_empty()) {
          break;
        } else if (potentialEmptyLine.item(0).indexOf(starts_with) !== 0 && potentialEmptyLine.item(-1) !== ends_with) {
          this.__lines.splice(index + 1, 0, new OutputLine(this));
          this.previous_line = this.__lines[this.__lines.length - 2];
          break;
        }
        index--;
      }
    };
    module.exports.Output = Output;
  }), , (function(module, exports, __webpack_require__) {
    "use strict";
    function InputScanner(input_string) {
      this.__input = input_string || '';
      this.__input_length = this.__input.length;
      this.__position = 0;
    }
    InputScanner.prototype.restart = function() {
      this.__position = 0;
    };
    InputScanner.prototype.back = function() {
      if (this.__position > 0) {
        this.__position -= 1;
      }
    };
    InputScanner.prototype.hasNext = function() {
      return this.__position < this.__input_length;
    };
    InputScanner.prototype.next = function() {
      var val = null;
      if (this.hasNext()) {
        val = this.__input.charAt(this.__position);
        this.__position += 1;
      }
      return val;
    };
    InputScanner.prototype.peek = function(index) {
      var val = null;
      index = index || 0;
      index += this.__position;
      if (index >= 0 && index < this.__input_length) {
        val = this.__input.charAt(index);
      }
      return val;
    };
    InputScanner.prototype.test = function(pattern, index) {
      index = index || 0;
      index += this.__position;
      pattern.lastIndex = index;
      if (index >= 0 && index < this.__input_length) {
        var pattern_match = pattern.exec(this.__input);
        return pattern_match && pattern_match.index === index;
      } else {
        return false;
      }
    };
    InputScanner.prototype.testChar = function(pattern, index) {
      var val = this.peek(index);
      return val !== null && pattern.test(val);
    };
    InputScanner.prototype.match = function(pattern) {
      pattern.lastIndex = this.__position;
      var pattern_match = pattern.exec(this.__input);
      if (pattern_match && pattern_match.index === this.__position) {
        this.__position += pattern_match[0].length;
      } else {
        pattern_match = null;
      }
      return pattern_match;
    };
    InputScanner.prototype.read = function(pattern) {
      var val = '';
      var match = this.match(pattern);
      if (match) {
        val = match[0];
      }
      return val;
    };
    InputScanner.prototype.readUntil = function(pattern, include_match) {
      var val = '';
      var match_index = this.__position;
      pattern.lastIndex = this.__position;
      var pattern_match = pattern.exec(this.__input);
      if (pattern_match) {
        if (include_match) {
          match_index = pattern_match.index + pattern_match[0].length;
        } else {
          match_index = pattern_match.index;
        }
      } else {
        match_index = this.__input_length;
      }
      val = this.__input.substring(this.__position, match_index);
      this.__position = match_index;
      return val;
    };
    InputScanner.prototype.readUntilAfter = function(pattern) {
      return this.readUntil(pattern, true);
    };
    InputScanner.prototype.peekUntilAfter = function(pattern) {
      var start = this.__position;
      var val = this.readUntilAfter(pattern);
      this.__position = start;
      return val;
    };
    InputScanner.prototype.lookBack = function(testVal) {
      var start = this.__position - 1;
      return start >= testVal.length && this.__input.substring(start - testVal.length, start).toLowerCase() === testVal;
    };
    module.exports.InputScanner = InputScanner;
  }), (function(module, exports, __webpack_require__) {
    "use strict";
    var InputScanner = __webpack_require__(6).InputScanner;
    var Token = __webpack_require__(8).Token;
    var TokenStream = __webpack_require__(9).TokenStream;
    var TOKEN = {
      START: 'TK_START',
      RAW: 'TK_RAW',
      EOF: 'TK_EOF'
    };
    var Tokenizer = function(input_string, options) {
      this._input = new InputScanner(input_string);
      this._options = options || {};
      this.__tokens = null;
      this.__newline_count = 0;
      this.__whitespace_before_token = '';
      this._whitespace_pattern = /[\n\r\u2028\u2029\t\u000B\u00A0\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff ]+/g;
      this._newline_pattern = /([^\n\r\u2028\u2029]*)(\r\n|[\n\r\u2028\u2029])?/g;
    };
    Tokenizer.prototype.tokenize = function() {
      this._input.restart();
      this.__tokens = new TokenStream();
      this._reset();
      var current;
      var previous = new Token(TOKEN.START, '');
      var open_token = null;
      var open_stack = [];
      var comments = new TokenStream();
      while (previous.type !== TOKEN.EOF) {
        current = this._get_next_token(previous, open_token);
        while (this._is_comment(current)) {
          comments.add(current);
          current = this._get_next_token(previous, open_token);
        }
        if (!comments.isEmpty()) {
          current.comments_before = comments;
          comments = new TokenStream();
        }
        current.parent = open_token;
        if (this._is_opening(current)) {
          open_stack.push(open_token);
          open_token = current;
        } else if (open_token && this._is_closing(current, open_token)) {
          current.opened = open_token;
          open_token.closed = current;
          open_token = open_stack.pop();
          current.parent = open_token;
        }
        current.previous = previous;
        previous.next = current;
        this.__tokens.add(current);
        previous = current;
      }
      return this.__tokens;
    };
    Tokenizer.prototype._is_first_token = function() {
      return this.__tokens.isEmpty();
    };
    Tokenizer.prototype._reset = function() {};
    Tokenizer.prototype._get_next_token = function(previous_token, open_token) {
      this._readWhitespace();
      var resulting_string = this._input.read(/.+/g);
      if (resulting_string) {
        return this._create_token(TOKEN.RAW, resulting_string);
      } else {
        return this._create_token(TOKEN.EOF, '');
      }
    };
    Tokenizer.prototype._is_comment = function(current_token) {
      return false;
    };
    Tokenizer.prototype._is_opening = function(current_token) {
      return false;
    };
    Tokenizer.prototype._is_closing = function(current_token, open_token) {
      return false;
    };
    Tokenizer.prototype._create_token = function(type, text) {
      var token = new Token(type, text, this.__newline_count, this.__whitespace_before_token);
      this.__newline_count = 0;
      this.__whitespace_before_token = '';
      return token;
    };
    Tokenizer.prototype._readWhitespace = function() {
      var resulting_string = this._input.read(this._whitespace_pattern);
      if (resulting_string === ' ') {
        this.__whitespace_before_token = resulting_string;
      } else if (resulting_string !== '') {
        this._newline_pattern.lastIndex = 0;
        var nextMatch = this._newline_pattern.exec(resulting_string);
        while (nextMatch[2]) {
          this.__newline_count += 1;
          nextMatch = this._newline_pattern.exec(resulting_string);
        }
        this.__whitespace_before_token = nextMatch[1];
      }
    };
    module.exports.Tokenizer = Tokenizer;
    module.exports.TOKEN = TOKEN;
  }), (function(module, exports, __webpack_require__) {
    "use strict";
    function Token(type, text, newlines, whitespace_before) {
      this.type = type;
      this.text = text;
      this.comments_before = null;
      this.newlines = newlines || 0;
      this.whitespace_before = whitespace_before || '';
      this.parent = null;
      this.next = null;
      this.previous = null;
      this.opened = null;
      this.closed = null;
      this.directives = null;
    }
    module.exports.Token = Token;
  }), (function(module, exports, __webpack_require__) {
    "use strict";
    function TokenStream(parent_token) {
      this.__tokens = [];
      this.__tokens_length = this.__tokens.length;
      this.__position = 0;
      this.__parent_token = parent_token;
    }
    TokenStream.prototype.restart = function() {
      this.__position = 0;
    };
    TokenStream.prototype.isEmpty = function() {
      return this.__tokens_length === 0;
    };
    TokenStream.prototype.hasNext = function() {
      return this.__position < this.__tokens_length;
    };
    TokenStream.prototype.next = function() {
      var val = null;
      if (this.hasNext()) {
        val = this.__tokens[this.__position];
        this.__position += 1;
      }
      return val;
    };
    TokenStream.prototype.peek = function(index) {
      var val = null;
      index = index || 0;
      index += this.__position;
      if (index >= 0 && index < this.__tokens_length) {
        val = this.__tokens[index];
      }
      return val;
    };
    TokenStream.prototype.add = function(token) {
      if (this.__parent_token) {
        token.parent = this.__parent_token;
      }
      this.__tokens.push(token);
      this.__tokens_length += 1;
    };
    module.exports.TokenStream = TokenStream;
  }), (function(module, exports, __webpack_require__) {
    "use strict";
    function Directives(start_block_pattern, end_block_pattern) {
      start_block_pattern = typeof start_block_pattern === 'string' ? start_block_pattern : start_block_pattern.source;
      end_block_pattern = typeof end_block_pattern === 'string' ? end_block_pattern : end_block_pattern.source;
      this.__directives_block_pattern = new RegExp(start_block_pattern + / beautify( \w+[:]\w+)+ /.source + end_block_pattern, 'g');
      this.__directive_pattern = / (\w+)[:](\w+)/g;
      this.__directives_end_ignore_pattern = new RegExp('(?:[\\s\\S]*?)((?:' + start_block_pattern + /\sbeautify\signore:end\s/.source + end_block_pattern + ')|$)', 'g');
    }
    Directives.prototype.get_directives = function(text) {
      if (!text.match(this.__directives_block_pattern)) {
        return null;
      }
      var directives = {};
      this.__directive_pattern.lastIndex = 0;
      var directive_match = this.__directive_pattern.exec(text);
      while (directive_match) {
        directives[directive_match[1]] = directive_match[2];
        directive_match = this.__directive_pattern.exec(text);
      }
      return directives;
    };
    Directives.prototype.readIgnored = function(input) {
      return input.read(this.__directives_end_ignore_pattern);
    };
    module.exports.Directives = Directives;
  }), , , (function(module, exports, __webpack_require__) {
    "use strict";
    var Beautifier = __webpack_require__(14).Beautifier;
    function style_html(html_source, options, js_beautify, css_beautify) {
      var beautifier = new Beautifier(html_source, options, js_beautify, css_beautify);
      return beautifier.beautify();
    }
    module.exports = style_html;
  }), (function(module, exports, __webpack_require__) {
    "use strict";
    var mergeOpts = __webpack_require__(2).mergeOpts;
    var normalizeOpts = __webpack_require__(2).normalizeOpts;
    var acorn = __webpack_require__(3);
    var Output = __webpack_require__(4).Output;
    var Tokenizer = __webpack_require__(15).Tokenizer;
    var TOKEN = __webpack_require__(15).TOKEN;
    var lineBreak = acorn.lineBreak;
    var allLineBreaks = acorn.allLineBreaks;
    var Printer = function(indent_character, indent_size, wrap_line_length, max_preserve_newlines, preserve_newlines) {
      this.indent_character = indent_character;
      this.indent_string = indent_character;
      this.indent_size = indent_size;
      this.indent_level = 0;
      this.alignment_size = 0;
      this.wrap_line_length = wrap_line_length;
      this.max_preserve_newlines = max_preserve_newlines;
      this.preserve_newlines = preserve_newlines;
      if (this.indent_size > 1) {
        this.indent_string = new Array(this.indent_size + 1).join(this.indent_character);
      }
      this._output = new Output(this.indent_string, '');
    };
    Printer.prototype.current_line_has_match = function(pattern) {
      return this._output.current_line.has_match(pattern);
    };
    Printer.prototype.set_space_before_token = function(value) {
      this._output.space_before_token = value;
    };
    Printer.prototype.add_raw_token = function(token) {
      this._output.add_raw_token(token);
    };
    Printer.prototype.traverse_whitespace = function(raw_token) {
      if (raw_token.whitespace_before || raw_token.newlines) {
        var newlines = 0;
        if (raw_token.type !== TOKEN.TEXT && raw_token.previous.type !== TOKEN.TEXT) {
          newlines = raw_token.newlines ? 1 : 0;
        }
        if (this.preserve_newlines) {
          newlines = raw_token.newlines < this.max_preserve_newlines + 1 ? raw_token.newlines : this.max_preserve_newlines + 1;
        }
        if (newlines) {
          for (var n = 0; n < newlines; n++) {
            this.print_newline(n > 0);
          }
        } else {
          this._output.space_before_token = true;
          this.print_space_or_wrap(raw_token.text);
        }
        return true;
      }
      return false;
    };
    Printer.prototype.print_space_or_wrap = function(text) {
      if (this._output.current_line.get_character_count() + text.length + 1 >= this.wrap_line_length) {
        if (this._output.add_new_line()) {
          return true;
        }
      }
      return false;
    };
    Printer.prototype.print_newline = function(force) {
      this._output.add_new_line(force);
    };
    Printer.prototype.print_token = function(text) {
      if (text) {
        if (this._output.current_line.is_empty()) {
          this._output.set_indent(this.indent_level, this.alignment_size);
        }
        this._output.add_token(text);
      }
    };
    Printer.prototype.print_raw_text = function(text) {
      this._output.current_line.push_raw(text);
    };
    Printer.prototype.indent = function() {
      this.indent_level++;
    };
    Printer.prototype.unindent = function() {
      if (this.indent_level > 0) {
        this.indent_level--;
      }
    };
    Printer.prototype.get_full_indent = function(level) {
      level = this.indent_level + (level || 0);
      if (level < 1) {
        return '';
      }
      return this._output.get_indent_string(level);
    };
    var uses_beautifier = function(tag_check, start_token) {
      var raw_token = start_token.next;
      if (!start_token.closed) {
        return false;
      }
      while (raw_token.type !== TOKEN.EOF && raw_token.closed !== start_token) {
        if (raw_token.type === TOKEN.ATTRIBUTE && raw_token.text === 'type') {
          var peekEquals = raw_token.next ? raw_token.next : raw_token;
          var peekValue = peekEquals.next ? peekEquals.next : peekEquals;
          if (peekEquals.type === TOKEN.EQUALS && peekValue.type === TOKEN.VALUE) {
            return (tag_check === 'style' && peekValue.text.search('text/css') > -1) || (tag_check === 'script' && peekValue.text.search(/(text|application|dojo)\/(x-)?(javascript|ecmascript|jscript|livescript|(ld\+)?json|method|aspect)/) > -1);
          }
          return false;
        }
        raw_token = raw_token.next;
      }
      return true;
    };
    function in_array(what, arr) {
      return arr.indexOf(what) !== -1;
    }
    function TagFrame(parent, parser_token, indent_level) {
      this.parent = parent || null;
      this.tag = parser_token ? parser_token.tag_name : '';
      this.indent_level = indent_level || 0;
      this.parser_token = parser_token || null;
    }
    function TagStack(printer) {
      this._printer = printer;
      this._current_frame = null;
    }
    TagStack.prototype.get_parser_token = function() {
      return this._current_frame ? this._current_frame.parser_token : null;
    };
    TagStack.prototype.record_tag = function(parser_token) {
      var new_frame = new TagFrame(this._current_frame, parser_token, this._printer.indent_level);
      this._current_frame = new_frame;
    };
    TagStack.prototype._try_pop_frame = function(frame) {
      var parser_token = null;
      if (frame) {
        parser_token = frame.parser_token;
        this._printer.indent_level = frame.indent_level;
        this._current_frame = frame.parent;
      }
      return parser_token;
    };
    TagStack.prototype._get_frame = function(tag_list, stop_list) {
      var frame = this._current_frame;
      while (frame) {
        if (tag_list.indexOf(frame.tag) !== -1) {
          break;
        } else if (stop_list && stop_list.indexOf(frame.tag) !== -1) {
          frame = null;
          break;
        }
        frame = frame.parent;
      }
      return frame;
    };
    TagStack.prototype.try_pop = function(tag, stop_list) {
      var frame = this._get_frame([tag], stop_list);
      return this._try_pop_frame(frame);
    };
    TagStack.prototype.indent_to_tag = function(tag_list) {
      var frame = this._get_frame(tag_list);
      if (frame) {
        this._printer.indent_level = frame.indent_level;
      }
    };
    function get_array(input, default_list) {
      var result = default_list || [];
      if (typeof input === 'object') {
        if (input !== null && typeof input.concat === 'function') {
          result = input.concat();
        }
      } else if (typeof input === 'string') {
        result = input.trim().replace(/\s*,\s*/g, ',').split(',');
      }
      return result;
    }
    function Beautifier(source_text, options, js_beautify, css_beautify) {
      this._source_text = source_text || '';
      options = options || {};
      this._js_beautify = js_beautify;
      this._css_beautify = css_beautify;
      this._tag_stack = null;
      options = mergeOpts(options, 'html');
      options = normalizeOpts(options);
      if ((options.wrap_line_length === undefined || parseInt(options.wrap_line_length, 10) === 0) && (options.max_char !== undefined && parseInt(options.max_char, 10) !== 0)) {
        options.wrap_line_length = options.max_char;
      }
      this._options = Object.assign({}, options);
      this._options.indent_inner_html = (options.indent_inner_html === undefined) ? false : options.indent_inner_html;
      this._options.indent_body_inner_html = (options.indent_body_inner_html === undefined) ? true : options.indent_body_inner_html;
      this._options.indent_head_inner_html = (options.indent_head_inner_html === undefined) ? true : options.indent_head_inner_html;
      this._options.indent_size = (options.indent_size === undefined) ? 4 : parseInt(options.indent_size, 10);
      this._options.indent_character = (options.indent_char === undefined) ? ' ' : options.indent_char;
      this._options.wrap_line_length = parseInt(options.wrap_line_length, 10) === 0 ? 32786 : parseInt(options.wrap_line_length || 250, 10);
      this._options.preserve_newlines = (options.preserve_newlines === undefined) ? true : options.preserve_newlines;
      this._options.max_preserve_newlines = this._options.preserve_newlines ? (isNaN(parseInt(options.max_preserve_newlines, 10)) ? 32786 : parseInt(options.max_preserve_newlines, 10)) : 0;
      this._options.indent_handlebars = (options.indent_handlebars === undefined) ? false : options.indent_handlebars;
      this._options.wrap_attributes = (options.wrap_attributes === undefined) ? 'auto' : options.wrap_attributes;
      this._options.wrap_attributes_indent_size = (isNaN(parseInt(options.wrap_attributes_indent_size, 10))) ? this._options.indent_size : parseInt(options.wrap_attributes_indent_size, 10);
      this._options.end_with_newline = (options.end_with_newline === undefined) ? false : options.end_with_newline;
      this._options.extra_liners = get_array(options.extra_liners, ['head', 'body', '/html']);
      this._options.eol = options.eol ? options.eol : 'auto';
      if (options.indent_with_tabs) {
        this._options.indent_character = '\t';
        this._options.indent_size = 1;
      }
      this._options.disabled = (options.disabled === undefined) ? false : options.disabled;
      this._options.eol = this._options.eol.replace(/\\r/, '\r').replace(/\\n/, '\n');
      this._options.inline = get_array(options.inline, ['a', 'abbr', 'area', 'audio', 'b', 'bdi', 'bdo', 'br', 'button', 'canvas', 'cite', 'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'map', 'mark', 'math', 'meter', 'noscript', 'object', 'output', 'progress', 'q', 'ruby', 's', 'samp', 'select', 'small', 'span', 'strong', 'sub', 'sup', 'svg', 'template', 'textarea', 'time', 'u', 'var', 'video', 'wbr', 'text', 'acronym', 'address', 'big', 'dt', 'ins', 'strike', 'tt']);
      this._options.void_elements = get_array(options.void_elements, ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr', '!doctype', '?xml', '?php', '?=', 'basefont', 'isindex']);
      this._options.unformatted = get_array(options.unformatted, []);
      this._options.content_unformatted = get_array(options.content_unformatted, ['pre', 'textarea']);
      this._is_wrap_attributes_force = this._options.wrap_attributes.substr(0, 'force'.length) === 'force';
      this._is_wrap_attributes_force_expand_multiline = (this._options.wrap_attributes === 'force-expand-multiline');
      this._is_wrap_attributes_force_aligned = (this._options.wrap_attributes === 'force-aligned');
      this._is_wrap_attributes_aligned_multiple = (this._options.wrap_attributes === 'aligned-multiple');
    }
    Beautifier.prototype.beautify = function() {
      if (this._options.disabled) {
        return this._source_text;
      }
      var source_text = this._source_text;
      var eol = this._options.eol;
      if (this._options.eol === 'auto') {
        eol = '\n';
        if (source_text && lineBreak.test(source_text)) {
          eol = source_text.match(lineBreak)[0];
        }
      }
      source_text = source_text.replace(allLineBreaks, '\n');
      var last_token = {
        text: '',
        type: ''
      };
      var last_tag_token = new TagOpenParserToken();
      var printer = new Printer(this._options.indent_character, this._options.indent_size, this._options.wrap_line_length, this._options.max_preserve_newlines, this._options.preserve_newlines);
      var tokens = new Tokenizer(source_text, this._options).tokenize();
      this._tag_stack = new TagStack(printer);
      var parser_token = null;
      var raw_token = tokens.next();
      while (raw_token.type !== TOKEN.EOF) {
        if (raw_token.type === TOKEN.TAG_OPEN || raw_token.type === TOKEN.COMMENT) {
          parser_token = this._handle_tag_open(printer, raw_token, last_tag_token, last_token);
          last_tag_token = parser_token;
        } else if ((raw_token.type === TOKEN.ATTRIBUTE || raw_token.type === TOKEN.EQUALS || raw_token.type === TOKEN.VALUE) || (raw_token.type === TOKEN.TEXT && !last_tag_token.tag_complete)) {
          parser_token = this._handle_inside_tag(printer, raw_token, last_tag_token, tokens);
        } else if (raw_token.type === TOKEN.TAG_CLOSE) {
          parser_token = this._handle_tag_close(printer, raw_token, last_tag_token);
        } else if (raw_token.type === TOKEN.TEXT) {
          parser_token = this._handle_text(printer, raw_token, last_tag_token);
        } else {
          printer.add_raw_token(raw_token);
        }
        last_token = parser_token;
        raw_token = tokens.next();
      }
      var sweet_code = printer._output.get_code(this._options.end_with_newline, eol);
      return sweet_code;
    };
    Beautifier.prototype._handle_tag_close = function(printer, raw_token, last_tag_token) {
      var parser_token = {
        text: raw_token.text,
        type: raw_token.type
      };
      printer.alignment_size = 0;
      last_tag_token.tag_complete = true;
      printer.set_space_before_token(raw_token.newlines || raw_token.whitespace_before !== '');
      if (last_tag_token.is_unformatted) {
        printer.add_raw_token(raw_token);
      } else {
        if (last_tag_token.tag_start_char === '<') {
          printer.set_space_before_token(raw_token.text[0] === '/');
          if (this._is_wrap_attributes_force_expand_multiline && last_tag_token.has_wrapped_attrs) {
            printer.print_newline(false);
          }
        }
        printer.print_token(raw_token.text);
      }
      if (last_tag_token.indent_content && !(last_tag_token.is_unformatted || last_tag_token.is_content_unformatted)) {
        printer.indent();
        last_tag_token.indent_content = false;
      }
      return parser_token;
    };
    Beautifier.prototype._handle_inside_tag = function(printer, raw_token, last_tag_token, tokens) {
      var parser_token = {
        text: raw_token.text,
        type: raw_token.type
      };
      printer.set_space_before_token(raw_token.newlines || raw_token.whitespace_before !== '');
      if (last_tag_token.is_unformatted) {
        printer.add_raw_token(raw_token);
      } else {
        if (last_tag_token.tag_start_char === '<') {
          if (raw_token.type === TOKEN.ATTRIBUTE) {
            printer.set_space_before_token(true);
            last_tag_token.attr_count += 1;
          } else if (raw_token.type === TOKEN.EQUALS) {
            printer.set_space_before_token(false);
          } else if (raw_token.type === TOKEN.VALUE && raw_token.previous.type === TOKEN.EQUALS) {
            printer.set_space_before_token(false);
          }
        }
        if (printer._output.space_before_token && last_tag_token.tag_start_char === '<') {
          var wrapped = printer.print_space_or_wrap(raw_token.text);
          if (raw_token.type === TOKEN.ATTRIBUTE) {
            var indentAttrs = wrapped && !this._is_wrap_attributes_force;
            if (this._is_wrap_attributes_force) {
              var force_first_attr_wrap = false;
              if (this._is_wrap_attributes_force_expand_multiline && last_tag_token.attr_count === 1) {
                var is_only_attribute = true;
                var peek_index = 0;
                var peek_token;
                do {
                  peek_token = tokens.peek(peek_index);
                  if (peek_token.type === TOKEN.ATTRIBUTE) {
                    is_only_attribute = false;
                    break;
                  }
                  peek_index += 1;
                } while (peek_index < 4 && peek_token.type !== TOKEN.EOF && peek_token.type !== TOKEN.TAG_CLOSE);
                force_first_attr_wrap = !is_only_attribute;
              }
              if (last_tag_token.attr_count > 1 || force_first_attr_wrap) {
                printer.print_newline(false);
                indentAttrs = true;
              }
            }
            if (indentAttrs) {
              last_tag_token.has_wrapped_attrs = true;
            }
          }
        }
        printer.print_token(raw_token.text);
      }
      return parser_token;
    };
    Beautifier.prototype._handle_text = function(printer, raw_token, last_tag_token) {
      var parser_token = {
        text: raw_token.text,
        type: 'TK_CONTENT'
      };
      if (last_tag_token.custom_beautifier) {
        this._print_custom_beatifier_text(printer, raw_token, last_tag_token);
      } else if (last_tag_token.is_unformatted || last_tag_token.is_content_unformatted) {
        printer.add_raw_token(raw_token);
      } else {
        printer.traverse_whitespace(raw_token);
        printer.print_token(raw_token.text);
      }
      return parser_token;
    };
    Beautifier.prototype._print_custom_beatifier_text = function(printer, raw_token, last_tag_token) {
      if (raw_token.text !== '') {
        printer.print_newline(false);
        var text = raw_token.text,
            _beautifier,
            script_indent_level = 1;
        if (last_tag_token.tag_name === 'script') {
          _beautifier = typeof this._js_beautify === 'function' && this._js_beautify;
        } else if (last_tag_token.tag_name === 'style') {
          _beautifier = typeof this._css_beautify === 'function' && this._css_beautify;
        }
        if (this._options.indent_scripts === "keep") {
          script_indent_level = 0;
        } else if (this._options.indent_scripts === "separate") {
          script_indent_level = -printer.indent_level;
        }
        var indentation = printer.get_full_indent(script_indent_level);
        text = text.replace(/\n[ \t]*$/, '');
        if (_beautifier) {
          var Child_options = function() {
            this.eol = '\n';
          };
          Child_options.prototype = this._options;
          var child_options = new Child_options();
          text = _beautifier(indentation + text, child_options);
        } else {
          var white = text.match(/^\s*/)[0];
          var _level = white.match(/[^\n\r]*$/)[0].split(this._indent_string).length - 1;
          var reindent = this._get_full_indent(script_indent_level - _level);
          text = (indentation + text.trim()).replace(/\r\n|\r|\n/g, '\n' + reindent);
        }
        if (text) {
          printer.print_raw_text(text);
          printer.print_newline(true);
        }
      }
    };
    Beautifier.prototype._handle_tag_open = function(printer, raw_token, last_tag_token, last_token) {
      var parser_token = this._get_tag_open_token(raw_token);
      printer.traverse_whitespace(raw_token);
      this._set_tag_position(printer, raw_token, parser_token, last_tag_token, last_token);
      if ((last_tag_token.is_unformatted || last_tag_token.is_content_unformatted) && raw_token.type === TOKEN.TAG_OPEN && raw_token.text.indexOf('</') === 0) {
        printer.add_raw_token(raw_token);
      } else {
        printer.print_token(raw_token.text);
      }
      if (this._is_wrap_attributes_force_aligned || this._is_wrap_attributes_aligned_multiple) {
        parser_token.alignment_size = raw_token.text.length + 1;
      }
      if (!parser_token.tag_complete && !parser_token.is_unformatted) {
        printer.alignment_size = parser_token.alignment_size;
      }
      return parser_token;
    };
    var TagOpenParserToken = function(parent, raw_token) {
      this.parent = parent || null;
      this.text = '';
      this.type = 'TK_TAG_OPEN';
      this.tag_name = '';
      this.is_inline_element = false;
      this.is_unformatted = false;
      this.is_content_unformatted = false;
      this.is_empty_element = false;
      this.is_start_tag = false;
      this.is_end_tag = false;
      this.indent_content = false;
      this.multiline_content = false;
      this.custom_beautifier = false;
      this.start_tag_token = null;
      this.attr_count = 0;
      this.has_wrapped_attrs = false;
      this.alignment_size = 0;
      this.tag_complete = false;
      this.tag_start_char = '';
      this.tag_check = '';
      if (!raw_token) {
        this.tag_complete = true;
      } else {
        var tag_check_match;
        this.tag_start_char = raw_token.text[0];
        this.text = raw_token.text;
        if (this.tag_start_char === '<') {
          tag_check_match = raw_token.text.match(/^<([^\s>]*)/);
          this.tag_check = tag_check_match ? tag_check_match[1] : '';
        } else {
          tag_check_match = raw_token.text.match(/^{{\#?([^\s}]+)/);
          this.tag_check = tag_check_match ? tag_check_match[1] : '';
        }
        this.tag_check = this.tag_check.toLowerCase();
        if (raw_token.type === TOKEN.COMMENT) {
          this.tag_complete = true;
        }
        this.is_start_tag = this.tag_check.charAt(0) !== '/';
        this.tag_name = !this.is_start_tag ? this.tag_check.substr(1) : this.tag_check;
        this.is_end_tag = !this.is_start_tag || (raw_token.closed && raw_token.closed.text === '/>');
        this.is_end_tag = this.is_end_tag || (this.tag_start_char === '{' && (this.text.length < 3 || (/[^#\^]/.test(this.text.charAt(2)))));
      }
    };
    Beautifier.prototype._get_tag_open_token = function(raw_token) {
      var parser_token = new TagOpenParserToken(this._tag_stack.get_parser_token(), raw_token);
      parser_token.alignment_size = this._options.wrap_attributes_indent_size;
      parser_token.is_end_tag = parser_token.is_end_tag || in_array(parser_token.tag_check, this._options.void_elements);
      parser_token.is_empty_element = parser_token.tag_complete || (parser_token.is_start_tag && parser_token.is_end_tag);
      parser_token.is_unformatted = !parser_token.tag_complete && in_array(parser_token.tag_check, this._options.unformatted);
      parser_token.is_content_unformatted = !parser_token.is_empty_element && in_array(parser_token.tag_check, this._options.content_unformatted);
      parser_token.is_inline_element = in_array(parser_token.tag_name, this._options.inline) || parser_token.tag_start_char === '{';
      return parser_token;
    };
    Beautifier.prototype._set_tag_position = function(printer, raw_token, parser_token, last_tag_token, last_token) {
      if (!parser_token.is_empty_element) {
        if (parser_token.is_end_tag) {
          parser_token.start_tag_token = this._tag_stack.try_pop(parser_token.tag_name);
        } else {
          this._do_optional_end_element(parser_token);
          this._tag_stack.record_tag(parser_token);
          if ((parser_token.tag_name === 'script' || parser_token.tag_name === 'style') && !(parser_token.is_unformatted || parser_token.is_content_unformatted)) {
            parser_token.custom_beautifier = uses_beautifier(parser_token.tag_check, raw_token);
          }
        }
      }
      if (in_array(parser_token.tag_check, this._options.extra_liners)) {
        printer.print_newline(false);
        if (!printer._output.just_added_blankline()) {
          printer.print_newline(true);
        }
      }
      if (parser_token.is_empty_element) {
        if (parser_token.tag_start_char === '{' && parser_token.tag_check === 'else') {
          this._tag_stack.indent_to_tag(['if', 'unless']);
          parser_token.indent_content = true;
          var foundIfOnCurrentLine = printer.current_line_has_match(/{{#if/);
          if (!foundIfOnCurrentLine) {
            printer.print_newline(false);
          }
        }
        if (parser_token.tag_name === '!--' && last_token.type === TOKEN.TAG_CLOSE && last_tag_token.is_end_tag && parser_token.text.indexOf('\n') === -1) {} else if (!parser_token.is_inline_element && !parser_token.is_unformatted) {
          printer.print_newline(false);
        }
      } else if (parser_token.is_unformatted || parser_token.is_content_unformatted) {
        if (!parser_token.is_inline_element && !parser_token.is_unformatted) {
          printer.print_newline(false);
        }
      } else if (parser_token.is_end_tag) {
        if ((parser_token.start_tag_token && parser_token.start_tag_token.multiline_content) || !(parser_token.is_inline_element || (last_tag_token.is_inline_element) || (last_token.type === TOKEN.TAG_CLOSE && parser_token.start_tag_token === last_tag_token) || (last_token.type === 'TK_CONTENT'))) {
          printer.print_newline(false);
        }
      } else {
        parser_token.indent_content = !parser_token.custom_beautifier;
        if (parser_token.tag_start_char === '<') {
          if (parser_token.tag_name === 'html') {
            parser_token.indent_content = this._options.indent_inner_html;
          } else if (parser_token.tag_name === 'head') {
            parser_token.indent_content = this._options.indent_head_inner_html;
          } else if (parser_token.tag_name === 'body') {
            parser_token.indent_content = this._options.indent_body_inner_html;
          }
        }
        if (!parser_token.is_inline_element && last_token.type !== 'TK_CONTENT') {
          if (parser_token.parent) {
            parser_token.parent.multiline_content = true;
          }
          printer.print_newline(false);
        }
      }
    };
    Beautifier.prototype._do_optional_end_element = function(parser_token) {
      if (parser_token.is_empty_element || !parser_token.is_start_tag || !parser_token.parent) {
        return;
      } else if (parser_token.tag_name === 'body') {
        this._tag_stack.try_pop('head');
      } else if (parser_token.tag_name === 'li') {
        this._tag_stack.try_pop('li', ['ol', 'ul']);
      } else if (parser_token.tag_name === 'dd' || parser_token.tag_name === 'dt') {
        this._tag_stack.try_pop('dt', ['dl']);
        this._tag_stack.try_pop('dd', ['dl']);
      } else if (parser_token.tag_name === 'rp' || parser_token.tag_name === 'rt') {
        this._tag_stack.try_pop('rt', ['ruby', 'rtc']);
        this._tag_stack.try_pop('rp', ['ruby', 'rtc']);
      } else if (parser_token.tag_name === 'optgroup') {
        this._tag_stack.try_pop('optgroup', ['select']);
      } else if (parser_token.tag_name === 'option') {
        this._tag_stack.try_pop('option', ['select', 'datalist', 'optgroup']);
      } else if (parser_token.tag_name === 'colgroup') {
        this._tag_stack.try_pop('caption', ['table']);
      } else if (parser_token.tag_name === 'thead') {
        this._tag_stack.try_pop('caption', ['table']);
        this._tag_stack.try_pop('colgroup', ['table']);
      } else if (parser_token.tag_name === 'tbody' || parser_token.tag_name === 'tfoot') {
        this._tag_stack.try_pop('caption', ['table']);
        this._tag_stack.try_pop('colgroup', ['table']);
        this._tag_stack.try_pop('thead', ['table']);
        this._tag_stack.try_pop('tbody', ['table']);
      } else if (parser_token.tag_name === 'tr') {
        this._tag_stack.try_pop('caption', ['table']);
        this._tag_stack.try_pop('colgroup', ['table']);
        this._tag_stack.try_pop('tr', ['table', 'thead', 'tbody', 'tfoot']);
      } else if (parser_token.tag_name === 'th' || parser_token.tag_name === 'td') {
        this._tag_stack.try_pop('td', ['tr']);
        this._tag_stack.try_pop('th', ['tr']);
      }
      parser_token.parent = this._tag_stack.get_parser_token();
    };
    module.exports.Beautifier = Beautifier;
  }), (function(module, exports, __webpack_require__) {
    "use strict";
    var BaseTokenizer = __webpack_require__(7).Tokenizer;
    var BASETOKEN = __webpack_require__(7).TOKEN;
    var Directives = __webpack_require__(10).Directives;
    var acorn = __webpack_require__(3);
    var TOKEN = {
      TAG_OPEN: 'TK_TAG_OPEN',
      TAG_CLOSE: 'TK_TAG_CLOSE',
      ATTRIBUTE: 'TK_ATTRIBUTE',
      EQUALS: 'TK_EQUALS',
      VALUE: 'TK_VALUE',
      COMMENT: 'TK_COMMENT',
      TEXT: 'TK_TEXT',
      UNKNOWN: 'TK_UNKNOWN',
      START: BASETOKEN.START,
      RAW: BASETOKEN.RAW,
      EOF: BASETOKEN.EOF
    };
    var directives_core = new Directives(/<\!--/, /-->/);
    var Tokenizer = function(input_string, options) {
      BaseTokenizer.call(this, input_string, options);
      this._current_tag_name = '';
      this._whitespace_pattern = /[\n\r\t ]+/g;
      this._newline_pattern = /([^\n\r]*)(\r\n|[\n\r])?/g;
      this._word_pattern = this._options.indent_handlebars ? /[\n\r\t <]|{{/g : /[\n\r\t <]/g;
    };
    Tokenizer.prototype = new BaseTokenizer();
    Tokenizer.prototype._is_comment = function(current_token) {
      return false;
    };
    Tokenizer.prototype._is_opening = function(current_token) {
      return current_token.type === TOKEN.TAG_OPEN;
    };
    Tokenizer.prototype._is_closing = function(current_token, open_token) {
      return current_token.type === TOKEN.TAG_CLOSE && (open_token && (((current_token.text === '>' || current_token.text === '/>') && open_token.text[0] === '<') || (current_token.text === '}}' && open_token.text[0] === '{' && open_token.text[1] === '{')));
    };
    Tokenizer.prototype._reset = function() {
      this._current_tag_name = '';
    };
    Tokenizer.prototype._get_next_token = function(previous_token, open_token) {
      this._readWhitespace();
      var token = null;
      var c = this._input.peek();
      if (c === null) {
        return this._create_token(TOKEN.EOF, '');
      }
      token = token || this._read_attribute(c, previous_token, open_token);
      token = token || this._read_raw_content(previous_token, open_token);
      token = token || this._read_comment(c);
      token = token || this._read_open(c, open_token);
      token = token || this._read_close(c, open_token);
      token = token || this._read_content_word();
      token = token || this._create_token(TOKEN.UNKNOWN, this._input.next());
      return token;
    };
    Tokenizer.prototype._read_comment = function(c) {
      var token = null;
      if (c === '<' || c === '{') {
        var peek1 = this._input.peek(1);
        var peek2 = this._input.peek(2);
        if ((c === '<' && (peek1 === '!' || peek1 === '?' || peek1 === '%')) || this._options.indent_handlebars && c === '{' && peek1 === '{' && peek2 === '!') {
          var comment = '',
              delimiter = '>',
              matched = false;
          var input_char = this._input.next();
          while (input_char) {
            comment += input_char;
            if (comment.charAt(comment.length - 1) === delimiter.charAt(delimiter.length - 1) && comment.indexOf(delimiter) !== -1) {
              break;
            }
            if (!matched) {
              matched = comment.length > 10;
              if (comment.indexOf('<![if') === 0) {
                delimiter = '<![endif]>';
                matched = true;
              } else if (comment.indexOf('<![cdata[') === 0) {
                delimiter = ']]>';
                matched = true;
              } else if (comment.indexOf('<![') === 0) {
                delimiter = ']>';
                matched = true;
              } else if (comment.indexOf('<!--') === 0) {
                delimiter = '-->';
                matched = true;
              } else if (comment.indexOf('{{!--') === 0) {
                delimiter = '--}}';
                matched = true;
              } else if (comment.indexOf('{{!') === 0) {
                if (comment.length === 5 && comment.indexOf('{{!--') === -1) {
                  delimiter = '}}';
                  matched = true;
                }
              } else if (comment.indexOf('<?') === 0) {
                delimiter = '?>';
                matched = true;
              } else if (comment.indexOf('<%') === 0) {
                delimiter = '%>';
                matched = true;
              }
            }
            input_char = this._input.next();
          }
          var directives = directives_core.get_directives(comment);
          if (directives && directives.ignore === 'start') {
            comment += directives_core.readIgnored(this._input);
          }
          comment = comment.replace(acorn.allLineBreaks, '\n');
          token = this._create_token(TOKEN.COMMENT, comment);
          token.directives = directives;
        }
      }
      return token;
    };
    Tokenizer.prototype._read_open = function(c, open_token) {
      var resulting_string = null;
      var token = null;
      if (!open_token) {
        if (c === '<') {
          resulting_string = this._input.read(/<(?:[^\n\r\t >{][^\n\r\t >{/]*)?/g);
          token = this._create_token(TOKEN.TAG_OPEN, resulting_string);
        } else if (this._options.indent_handlebars && c === '{' && this._input.peek(1) === '{') {
          resulting_string = this._input.readUntil(/[\n\r\t }]/g);
          token = this._create_token(TOKEN.TAG_OPEN, resulting_string);
        }
      }
      return token;
    };
    Tokenizer.prototype._read_close = function(c, open_token) {
      var resulting_string = null;
      var token = null;
      if (open_token) {
        if (open_token.text[0] === '<' && (c === '>' || (c === '/' && this._input.peek(1) === '>'))) {
          resulting_string = this._input.next();
          if (c === '/') {
            resulting_string += this._input.next();
          }
          token = this._create_token(TOKEN.TAG_CLOSE, resulting_string);
        } else if (open_token.text[0] === '{' && c === '}' && this._input.peek(1) === '}') {
          this._input.next();
          this._input.next();
          token = this._create_token(TOKEN.TAG_CLOSE, '}}');
        }
      }
      return token;
    };
    Tokenizer.prototype._read_attribute = function(c, previous_token, open_token) {
      var token = null;
      var resulting_string = '';
      if (open_token && open_token.text[0] === '<') {
        if (c === '=') {
          token = this._create_token(TOKEN.EQUALS, this._input.next());
        } else if (c === '"' || c === "'") {
          var content = this._input.next();
          var input_string = '';
          var string_pattern = new RegExp(c + '|{{', 'g');
          while (this._input.hasNext()) {
            input_string = this._input.readUntilAfter(string_pattern);
            content += input_string;
            if (input_string[input_string.length - 1] === '"' || input_string[input_string.length - 1] === "'") {
              break;
            } else if (this._input.hasNext()) {
              content += this._input.readUntilAfter(/}}/g);
            }
          }
          token = this._create_token(TOKEN.VALUE, content);
        } else {
          if (c === '{' && this._input.peek(1) === '{') {
            resulting_string = this._input.readUntilAfter(/}}/g);
          } else {
            resulting_string = this._input.readUntil(/[\n\r\t =\/>]/g);
          }
          if (resulting_string) {
            if (previous_token.type === TOKEN.EQUALS) {
              token = this._create_token(TOKEN.VALUE, resulting_string);
            } else {
              token = this._create_token(TOKEN.ATTRIBUTE, resulting_string);
            }
          }
        }
      }
      return token;
    };
    Tokenizer.prototype._is_content_unformatted = function(tag_name) {
      return this._options.void_elements.indexOf(tag_name) === -1 && (tag_name === 'script' || tag_name === 'style' || this._options.content_unformatted.indexOf(tag_name) !== -1 || this._options.unformatted.indexOf(tag_name) !== -1);
    };
    Tokenizer.prototype._read_raw_content = function(previous_token, open_token) {
      var resulting_string = '';
      if (open_token && open_token.text[0] === '{') {
        resulting_string = this._input.readUntil(/}}/g);
      } else if (previous_token.type === TOKEN.TAG_CLOSE && (previous_token.opened.text[0] === '<')) {
        var tag_name = previous_token.opened.text.substr(1).toLowerCase();
        if (this._is_content_unformatted(tag_name)) {
          resulting_string = this._input.readUntil(new RegExp('</' + tag_name + '[\\n\\r\\t ]*?>', 'ig'));
        }
      }
      if (resulting_string) {
        return this._create_token(TOKEN.TEXT, resulting_string);
      }
      return null;
    };
    Tokenizer.prototype._read_content_word = function() {
      var resulting_string = this._input.readUntil(this._word_pattern);
      if (resulting_string) {
        return this._create_token(TOKEN.TEXT, resulting_string);
      }
    };
    module.exports.Tokenizer = Tokenizer;
    module.exports.TOKEN = TOKEN;
  })]);
  var style_html = legacy_beautify_html;
  if (typeof define === "function" && define.amd) {
    define(["require", "./beautify", "./beautify-css"], function(requireamd) {
      var js_beautify = requireamd("./beautify");
      var css_beautify = requireamd("./beautify-css");
      return {html_beautify: function(html_source, options) {
          return style_html(html_source, options, js_beautify.js_beautify, css_beautify.css_beautify);
        }};
    });
  } else if (typeof exports !== "undefined") {
    var js_beautify = require('./beautify');
    var css_beautify = require('./beautify-css');
    exports.html_beautify = function(html_source, options) {
      return style_html(html_source, options, js_beautify.js_beautify, css_beautify.css_beautify);
    };
  } else if (typeof window !== "undefined") {
    window.html_beautify = function(html_source, options) {
      return style_html(html_source, options, window.js_beautify, window.css_beautify);
    };
  } else if (typeof global !== "undefined") {
    global.html_beautify = function(html_source, options) {
      return style_html(html_source, options, global.js_beautify, global.css_beautify);
    };
  }
}());
