/* */ 
"format cjs";
(function(process) {
  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      define([], function() {
        return (factory());
      });
    } else if (typeof module === 'object' && module.exports) {
      module.exports = factory();
    } else {
      factory();
    }
  }(this, function() {
    angular.module('pascalprecht.translate').provider('$translatePartialLoader', $translatePartialLoader);
    function $translatePartialLoader() {
      'use strict';
      function Part(name, priority) {
        this.name = name;
        this.isActive = true;
        this.tables = {};
        this.priority = priority || 0;
        this.langPromises = {};
      }
      Part.prototype.parseUrl = function(urlTemplate, targetLang) {
        if (angular.isFunction(urlTemplate)) {
          return urlTemplate(this.name, targetLang);
        }
        return urlTemplate.replace(/\{part\}/g, this.name).replace(/\{lang\}/g, targetLang);
      };
      Part.prototype.getTable = function(lang, $q, $http, $httpOptions, urlTemplate, errorHandler) {
        var self = this;
        var lastLangPromise = this.langPromises[lang];
        var deferred = $q.defer();
        var fetchData = function() {
          return $http(angular.extend({
            method: 'GET',
            url: self.parseUrl(urlTemplate, lang)
          }, $httpOptions));
        };
        var handleNewData = function(data) {
          self.tables[lang] = data;
          deferred.resolve(data);
        };
        var rejectDeferredWithPartName = function() {
          deferred.reject(self.name);
        };
        var tryGettingThisTable = function() {
          fetchData().then(function(result) {
            handleNewData(result.data);
          }, function(errorResponse) {
            if (errorHandler) {
              errorHandler(self.name, lang, errorResponse).then(handleNewData, rejectDeferredWithPartName);
            } else {
              rejectDeferredWithPartName();
            }
          });
        };
        if (!this.tables[lang]) {
          if (!lastLangPromise) {
            tryGettingThisTable();
          } else {
            lastLangPromise.then(deferred.resolve, tryGettingThisTable);
          }
          this.langPromises[lang] = deferred.promise;
        } else {
          deferred.resolve(this.tables[lang]);
        }
        return deferred.promise;
      };
      var parts = {};
      function hasPart(name) {
        return Object.prototype.hasOwnProperty.call(parts, name);
      }
      function isStringValid(str) {
        return angular.isString(str) && str !== '';
      }
      function isPartAvailable(name) {
        if (!isStringValid(name)) {
          throw new TypeError('Invalid type of a first argument, a non-empty string expected.');
        }
        return (hasPart(name) && parts[name].isActive);
      }
      function deepExtend(dst, src) {
        for (var property in src) {
          if (src[property] && src[property].constructor && src[property].constructor === Object) {
            dst[property] = dst[property] || {};
            deepExtend(dst[property], src[property]);
          } else {
            dst[property] = src[property];
          }
        }
        return dst;
      }
      function getPrioritizedParts() {
        var prioritizedParts = [];
        for (var part in parts) {
          if (parts[part].isActive) {
            prioritizedParts.push(parts[part]);
          }
        }
        prioritizedParts.sort(function(a, b) {
          return a.priority - b.priority;
        });
        return prioritizedParts;
      }
      this.addPart = function(name, priority) {
        if (!isStringValid(name)) {
          throw new TypeError('Couldn\'t add part, part name has to be a string!');
        }
        if (!hasPart(name)) {
          parts[name] = new Part(name, priority);
        }
        parts[name].isActive = true;
        return this;
      };
      this.setPart = function(lang, part, table) {
        if (!isStringValid(lang)) {
          throw new TypeError('Couldn\'t set part.`lang` parameter has to be a string!');
        }
        if (!isStringValid(part)) {
          throw new TypeError('Couldn\'t set part.`part` parameter has to be a string!');
        }
        if (typeof table !== 'object' || table === null) {
          throw new TypeError('Couldn\'t set part. `table` parameter has to be an object!');
        }
        if (!hasPart(part)) {
          parts[part] = new Part(part);
          parts[part].isActive = false;
        }
        parts[part].tables[lang] = table;
        return this;
      };
      this.deletePart = function(name) {
        if (!isStringValid(name)) {
          throw new TypeError('Couldn\'t delete part, first arg has to be string.');
        }
        if (hasPart(name)) {
          parts[name].isActive = false;
        }
        return this;
      };
      this.isPartAvailable = isPartAvailable;
      this.$get = ['$rootScope', '$injector', '$q', '$http', function($rootScope, $injector, $q, $http) {
        var service = function(options) {
          if (!isStringValid(options.key)) {
            throw new TypeError('Unable to load data, a key is not a non-empty string.');
          }
          if (!isStringValid(options.urlTemplate) && !angular.isFunction(options.urlTemplate)) {
            throw new TypeError('Unable to load data, a urlTemplate is not a non-empty string or not a function.');
          }
          var errorHandler = options.loadFailureHandler;
          if (errorHandler !== undefined) {
            if (!angular.isString(errorHandler)) {
              throw new Error('Unable to load data, a loadFailureHandler is not a string.');
            } else {
              errorHandler = $injector.get(errorHandler);
            }
          }
          var loaders = [],
              prioritizedParts = getPrioritizedParts();
          angular.forEach(prioritizedParts, function(part) {
            loaders.push(part.getTable(options.key, $q, $http, options.$http, options.urlTemplate, errorHandler));
            part.urlTemplate = options.urlTemplate;
          });
          return $q.all(loaders).then(function() {
            var table = {};
            prioritizedParts = getPrioritizedParts();
            angular.forEach(prioritizedParts, function(part) {
              deepExtend(table, part.tables[options.key]);
            });
            return table;
          }, function() {
            return $q.reject(options.key);
          });
        };
        service.addPart = function(name, priority) {
          if (!isStringValid(name)) {
            throw new TypeError('Couldn\'t add part, first arg has to be a string');
          }
          if (!hasPart(name)) {
            parts[name] = new Part(name, priority);
            $rootScope.$emit('$translatePartialLoaderStructureChanged', name);
          } else if (!parts[name].isActive) {
            parts[name].isActive = true;
            $rootScope.$emit('$translatePartialLoaderStructureChanged', name);
          }
          return service;
        };
        service.deletePart = function(name, removeData) {
          if (!isStringValid(name)) {
            throw new TypeError('Couldn\'t delete part, first arg has to be string');
          }
          if (removeData === undefined) {
            removeData = false;
          } else if (typeof removeData !== 'boolean') {
            throw new TypeError('Invalid type of a second argument, a boolean expected.');
          }
          if (hasPart(name)) {
            var wasActive = parts[name].isActive;
            if (removeData) {
              var $translate = $injector.get('$translate');
              var cache = $translate.loaderCache();
              if (typeof(cache) === 'string') {
                cache = $injector.get(cache);
              }
              if (typeof(cache) === 'object') {
                angular.forEach(parts[name].tables, function(value, key) {
                  cache.remove(parts[name].parseUrl(parts[name].urlTemplate, key));
                });
              }
              delete parts[name];
            } else {
              parts[name].isActive = false;
            }
            if (wasActive) {
              $rootScope.$emit('$translatePartialLoaderStructureChanged', name);
            }
          }
          return service;
        };
        service.isPartLoaded = function(name, lang) {
          return angular.isDefined(parts[name]) && angular.isDefined(parts[name].tables[lang]);
        };
        service.getRegisteredParts = function() {
          var registeredParts = [];
          angular.forEach(parts, function(p) {
            if (p.isActive) {
              registeredParts.push(p.name);
            }
          });
          return registeredParts;
        };
        service.isPartAvailable = isPartAvailable;
        return service;
      }];
    }
    $translatePartialLoader.displayName = '$translatePartialLoader';
    return 'pascalprecht.translate';
  }));
})(require('process'));
