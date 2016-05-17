/* */ 
(function(process) {
  uis.controller('uiSelectCtrl', ['$scope', '$element', '$timeout', '$filter', '$$uisDebounce', 'uisRepeatParser', 'uiSelectMinErr', 'uiSelectConfig', '$parse', '$injector', '$window', function($scope, $element, $timeout, $filter, $$uisDebounce, RepeatParser, uiSelectMinErr, uiSelectConfig, $parse, $injector, $window) {
    var ctrl = this;
    var EMPTY_SEARCH = '';
    ctrl.placeholder = uiSelectConfig.placeholder;
    ctrl.searchEnabled = uiSelectConfig.searchEnabled;
    ctrl.sortable = uiSelectConfig.sortable;
    ctrl.refreshDelay = uiSelectConfig.refreshDelay;
    ctrl.paste = uiSelectConfig.paste;
    ctrl.removeSelected = false;
    ctrl.closeOnSelect = true;
    ctrl.skipFocusser = false;
    ctrl.search = EMPTY_SEARCH;
    ctrl.activeIndex = 0;
    ctrl.items = [];
    ctrl.open = false;
    ctrl.focus = false;
    ctrl.disabled = false;
    ctrl.selected = undefined;
    ctrl.dropdownPosition = 'auto';
    ctrl.focusser = undefined;
    ctrl.resetSearchInput = true;
    ctrl.multiple = undefined;
    ctrl.disableChoiceExpression = undefined;
    ctrl.tagging = {
      isActivated: false,
      fct: undefined
    };
    ctrl.taggingTokens = {
      isActivated: false,
      tokens: undefined
    };
    ctrl.lockChoiceExpression = undefined;
    ctrl.clickTriggeredSelect = false;
    ctrl.$filter = $filter;
    ctrl.$element = $element;
    ctrl.$animate = (function() {
      try {
        return $injector.get('$animate');
      } catch (err) {
        return null;
      }
    })();
    ctrl.searchInput = $element.querySelectorAll('input.ui-select-search');
    if (ctrl.searchInput.length !== 1) {
      throw uiSelectMinErr('searchInput', "Expected 1 input.ui-select-search but got '{0}'.", ctrl.searchInput.length);
    }
    ctrl.isEmpty = function() {
      return angular.isUndefined(ctrl.selected) || ctrl.selected === null || ctrl.selected === '' || (ctrl.multiple && ctrl.selected.length === 0);
    };
    function _findIndex(collection, predicate, thisArg) {
      if (collection.findIndex) {
        return collection.findIndex(predicate, thisArg);
      } else {
        var list = Object(collection);
        var length = list.length >>> 0;
        var value;
        for (var i = 0; i < length; i++) {
          value = list[i];
          if (predicate.call(thisArg, value, i, list)) {
            return i;
          }
        }
        return -1;
      }
    }
    function _resetSearchInput() {
      if (ctrl.resetSearchInput || (ctrl.resetSearchInput === undefined && uiSelectConfig.resetSearchInput)) {
        ctrl.search = EMPTY_SEARCH;
        if (ctrl.selected && ctrl.items.length && !ctrl.multiple) {
          ctrl.activeIndex = _findIndex(ctrl.items, function(item) {
            return angular.equals(this, item);
          }, ctrl.selected);
        }
      }
    }
    function _groupsFilter(groups, groupNames) {
      var i,
          j,
          result = [];
      for (i = 0; i < groupNames.length; i++) {
        for (j = 0; j < groups.length; j++) {
          if (groups[j].name == [groupNames[i]]) {
            result.push(groups[j]);
          }
        }
      }
      return result;
    }
    ctrl.activate = function(initSearchValue, avoidReset) {
      if (!ctrl.disabled && !ctrl.open) {
        if (!avoidReset)
          _resetSearchInput();
        $scope.$broadcast('uis:activate');
        ctrl.open = true;
        ctrl.activeIndex = ctrl.activeIndex >= ctrl.items.length ? 0 : ctrl.activeIndex;
        if (ctrl.activeIndex === -1 && ctrl.taggingLabel !== false) {
          ctrl.activeIndex = 0;
        }
        var container = $element.querySelectorAll('.ui-select-choices-content');
        var searchInput = $element.querySelectorAll('.ui-select-search');
        if (ctrl.$animate && ctrl.$animate.enabled(container[0])) {
          var animateHandler = function(elem, phase) {
            if (phase === 'start' && ctrl.items.length === 0) {
              ctrl.$animate.off('removeClass', searchInput[0], animateHandler);
              $timeout(function() {
                ctrl.focusSearchInput(initSearchValue);
              });
            } else if (phase === 'close') {
              ctrl.$animate.off('enter', container[0], animateHandler);
              $timeout(function() {
                ctrl.focusSearchInput(initSearchValue);
              });
            }
          };
          if (ctrl.items.length > 0) {
            ctrl.$animate.on('enter', container[0], animateHandler);
          } else {
            ctrl.$animate.on('removeClass', searchInput[0], animateHandler);
          }
        } else {
          $timeout(function() {
            ctrl.focusSearchInput(initSearchValue);
            if (!ctrl.tagging.isActivated && ctrl.items.length > 1) {
              _ensureHighlightVisible();
            }
          });
        }
      }
    };
    ctrl.focusSearchInput = function(initSearchValue) {
      ctrl.search = initSearchValue || ctrl.search;
      ctrl.searchInput[0].focus();
    };
    ctrl.findGroupByName = function(name) {
      return ctrl.groups && ctrl.groups.filter(function(group) {
        return group.name === name;
      })[0];
    };
    ctrl.parseRepeatAttr = function(repeatAttr, groupByExp, groupFilterExp) {
      function updateGroups(items) {
        var groupFn = $scope.$eval(groupByExp);
        ctrl.groups = [];
        angular.forEach(items, function(item) {
          var groupName = angular.isFunction(groupFn) ? groupFn(item) : item[groupFn];
          var group = ctrl.findGroupByName(groupName);
          if (group) {
            group.items.push(item);
          } else {
            ctrl.groups.push({
              name: groupName,
              items: [item]
            });
          }
        });
        if (groupFilterExp) {
          var groupFilterFn = $scope.$eval(groupFilterExp);
          if (angular.isFunction(groupFilterFn)) {
            ctrl.groups = groupFilterFn(ctrl.groups);
          } else if (angular.isArray(groupFilterFn)) {
            ctrl.groups = _groupsFilter(ctrl.groups, groupFilterFn);
          }
        }
        ctrl.items = [];
        ctrl.groups.forEach(function(group) {
          ctrl.items = ctrl.items.concat(group.items);
        });
      }
      function setPlainItems(items) {
        ctrl.items = items;
      }
      ctrl.setItemsFn = groupByExp ? updateGroups : setPlainItems;
      ctrl.parserResult = RepeatParser.parse(repeatAttr);
      ctrl.isGrouped = !!groupByExp;
      ctrl.itemProperty = ctrl.parserResult.itemName;
      var originalSource = ctrl.parserResult.source;
      var createArrayFromObject = function() {
        var origSrc = originalSource($scope);
        $scope.$uisSource = Object.keys(origSrc).map(function(v) {
          var result = {};
          result[ctrl.parserResult.keyName] = v;
          result.value = origSrc[v];
          return result;
        });
      };
      if (ctrl.parserResult.keyName) {
        createArrayFromObject();
        ctrl.parserResult.source = $parse('$uisSource' + ctrl.parserResult.filters);
        $scope.$watch(originalSource, function(newVal, oldVal) {
          if (newVal !== oldVal)
            createArrayFromObject();
        }, true);
      }
      ctrl.refreshItems = function(data) {
        data = data || ctrl.parserResult.source($scope);
        var selectedItems = ctrl.selected;
        if (ctrl.isEmpty() || (angular.isArray(selectedItems) && !selectedItems.length) || !ctrl.removeSelected) {
          ctrl.setItemsFn(data);
        } else {
          if (data !== undefined) {
            var filteredItems = data.filter(function(i) {
              return selectedItems.every(function(selectedItem) {
                return !angular.equals(i, selectedItem);
              });
            });
            ctrl.setItemsFn(filteredItems);
          }
        }
        if (ctrl.dropdownPosition === 'auto' || ctrl.dropdownPosition === 'up') {
          $scope.calculateDropdownPos();
        }
      };
      $scope.$watchCollection(ctrl.parserResult.source, function(items) {
        if (items === undefined || items === null) {
          ctrl.items = [];
        } else {
          if (!angular.isArray(items)) {
            throw uiSelectMinErr('items', "Expected an array but got '{0}'.", items);
          } else {
            ctrl.refreshItems(items);
            if (angular.isDefined(ctrl.ngModel.$modelValue)) {
              ctrl.ngModel.$modelValue = null;
            }
          }
        }
      });
    };
    var _refreshDelayPromise;
    ctrl.refresh = function(refreshAttr) {
      if (refreshAttr !== undefined) {
        if (_refreshDelayPromise) {
          $timeout.cancel(_refreshDelayPromise);
        }
        _refreshDelayPromise = $timeout(function() {
          $scope.$eval(refreshAttr);
        }, ctrl.refreshDelay);
      }
    };
    ctrl.isActive = function(itemScope) {
      if (!ctrl.open) {
        return false;
      }
      var itemIndex = ctrl.items.indexOf(itemScope[ctrl.itemProperty]);
      var isActive = itemIndex == ctrl.activeIndex;
      if (!isActive || itemIndex < 0) {
        return false;
      }
      if (isActive && !angular.isUndefined(ctrl.onHighlightCallback)) {
        itemScope.$eval(ctrl.onHighlightCallback);
      }
      return isActive;
    };
    ctrl.isDisabled = function(itemScope) {
      if (!ctrl.open)
        return;
      var itemIndex = ctrl.items.indexOf(itemScope[ctrl.itemProperty]);
      var isDisabled = false;
      var item;
      if (itemIndex >= 0 && !angular.isUndefined(ctrl.disableChoiceExpression)) {
        item = ctrl.items[itemIndex];
        isDisabled = !!(itemScope.$eval(ctrl.disableChoiceExpression));
        item._uiSelectChoiceDisabled = isDisabled;
      }
      return isDisabled;
    };
    ctrl.select = function(item, skipFocusser, $event) {
      if (item === undefined || !item._uiSelectChoiceDisabled) {
        if (!ctrl.items && !ctrl.search && !ctrl.tagging.isActivated)
          return;
        if (!item || !item._uiSelectChoiceDisabled) {
          if (ctrl.tagging.isActivated) {
            if (ctrl.taggingLabel === false) {
              if (ctrl.activeIndex < 0) {
                item = ctrl.tagging.fct !== undefined ? ctrl.tagging.fct(ctrl.search) : ctrl.search;
                if (!item || angular.equals(ctrl.items[0], item)) {
                  return;
                }
              } else {
                item = ctrl.items[ctrl.activeIndex];
              }
            } else {
              if (ctrl.activeIndex === 0) {
                if (item === undefined)
                  return;
                if (ctrl.tagging.fct !== undefined && typeof item === 'string') {
                  item = ctrl.tagging.fct(item);
                  if (!item)
                    return;
                } else if (typeof item === 'string') {
                  item = item.replace(ctrl.taggingLabel, '').trim();
                }
              }
            }
            if (ctrl.selected && angular.isArray(ctrl.selected) && ctrl.selected.filter(function(selection) {
              return angular.equals(selection, item);
            }).length > 0) {
              ctrl.close(skipFocusser);
              return;
            }
          }
          $scope.$broadcast('uis:select', item);
          var locals = {};
          locals[ctrl.parserResult.itemName] = item;
          $timeout(function() {
            ctrl.onSelectCallback($scope, {
              $item: item,
              $model: ctrl.parserResult.modelMapper($scope, locals)
            });
          });
          if (ctrl.closeOnSelect) {
            ctrl.close(skipFocusser);
          }
          if ($event && $event.type === 'click') {
            ctrl.clickTriggeredSelect = true;
          }
        }
      }
    };
    ctrl.close = function(skipFocusser) {
      if (!ctrl.open)
        return;
      if (ctrl.ngModel && ctrl.ngModel.$setTouched)
        ctrl.ngModel.$setTouched();
      _resetSearchInput();
      ctrl.open = false;
      $scope.$broadcast('uis:close', skipFocusser);
    };
    ctrl.setFocus = function() {
      if (!ctrl.focus)
        ctrl.focusInput[0].focus();
    };
    ctrl.clear = function($event) {
      ctrl.select(undefined);
      $event.stopPropagation();
      $timeout(function() {
        ctrl.focusser[0].focus();
      }, 0, false);
    };
    ctrl.toggle = function(e) {
      if (ctrl.open) {
        ctrl.close();
        e.preventDefault();
        e.stopPropagation();
      } else {
        ctrl.activate();
      }
    };
    ctrl.isLocked = function(itemScope, itemIndex) {
      var isLocked,
          item = ctrl.selected[itemIndex];
      if (item && !angular.isUndefined(ctrl.lockChoiceExpression)) {
        isLocked = !!(itemScope.$eval(ctrl.lockChoiceExpression));
        item._uiSelectChoiceLocked = isLocked;
      }
      return isLocked;
    };
    var sizeWatch = null;
    var updaterScheduled = false;
    ctrl.sizeSearchInput = function() {
      var input = ctrl.searchInput[0],
          container = ctrl.searchInput.parent().parent()[0],
          calculateContainerWidth = function() {
            return container.clientWidth * !!input.offsetParent;
          },
          updateIfVisible = function(containerWidth) {
            if (containerWidth === 0) {
              return false;
            }
            var inputWidth = containerWidth - input.offsetLeft - 10;
            if (inputWidth < 50)
              inputWidth = containerWidth;
            ctrl.searchInput.css('width', inputWidth + 'px');
            return true;
          };
      ctrl.searchInput.css('width', '10px');
      $timeout(function() {
        if (sizeWatch === null && !updateIfVisible(calculateContainerWidth())) {
          sizeWatch = $scope.$watch(angular.noop, function() {
            if (!updaterScheduled) {
              updaterScheduled = true;
              $scope.$$postDigest(function() {
                updaterScheduled = false;
                if (updateIfVisible(calculateContainerWidth())) {
                  sizeWatch();
                  sizeWatch = null;
                }
              });
            }
          });
        }
      });
    };
    function _handleDropDownSelection(key) {
      var processed = true;
      switch (key) {
        case KEY.DOWN:
          if (!ctrl.open && ctrl.multiple)
            ctrl.activate(false, true);
          else if (ctrl.activeIndex < ctrl.items.length - 1) {
            ctrl.activeIndex++;
          }
          break;
        case KEY.UP:
          if (!ctrl.open && ctrl.multiple)
            ctrl.activate(false, true);
          else if (ctrl.activeIndex > 0 || (ctrl.search.length === 0 && ctrl.tagging.isActivated && ctrl.activeIndex > -1)) {
            ctrl.activeIndex--;
          }
          break;
        case KEY.TAB:
          if (!ctrl.multiple || ctrl.open)
            ctrl.select(ctrl.items[ctrl.activeIndex], true);
          break;
        case KEY.ENTER:
          if (ctrl.open && (ctrl.tagging.isActivated || ctrl.activeIndex >= 0)) {
            ctrl.select(ctrl.items[ctrl.activeIndex], ctrl.skipFocusser);
          } else {
            ctrl.activate(false, true);
          }
          break;
        case KEY.ESC:
          ctrl.close();
          break;
        default:
          processed = false;
      }
      return processed;
    }
    ctrl.searchInput.on('keydown', function(e) {
      var key = e.which;
      if (~[KEY.ENTER, KEY.ESC].indexOf(key)) {
        e.preventDefault();
        e.stopPropagation();
      }
      $scope.$apply(function() {
        var tagged = false;
        if (ctrl.items.length > 0 || ctrl.tagging.isActivated) {
          _handleDropDownSelection(key);
          if (ctrl.taggingTokens.isActivated) {
            for (var i = 0; i < ctrl.taggingTokens.tokens.length; i++) {
              if (ctrl.taggingTokens.tokens[i] === KEY.MAP[e.keyCode]) {
                if (ctrl.search.length > 0) {
                  tagged = true;
                }
              }
            }
            if (tagged) {
              $timeout(function() {
                ctrl.searchInput.triggerHandler('tagged');
                var newItem = ctrl.search.replace(KEY.MAP[e.keyCode], '').trim();
                if (ctrl.tagging.fct) {
                  newItem = ctrl.tagging.fct(newItem);
                }
                if (newItem)
                  ctrl.select(newItem, true);
              });
            }
          }
        }
      });
      if (KEY.isVerticalMovement(key) && ctrl.items.length > 0) {
        _ensureHighlightVisible();
      }
      if (key === KEY.ENTER || key === KEY.ESC) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
    ctrl.searchInput.on('paste', function(e) {
      var data;
      if (window.clipboardData && window.clipboardData.getData) {
        data = window.clipboardData.getData('Text');
      } else {
        data = (e.originalEvent || e).clipboardData.getData('text/plain');
      }
      data = ctrl.search + data;
      if (data && data.length > 0) {
        if (ctrl.taggingTokens.isActivated) {
          var items = [];
          for (var i = 0; i < ctrl.taggingTokens.tokens.length; i++) {
            var separator = KEY.toSeparator(ctrl.taggingTokens.tokens[i]) || ctrl.taggingTokens.tokens[i];
            if (data.indexOf(separator) > -1) {
              items = data.split(separator);
              break;
            }
          }
          if (items.length === 0) {
            items = [data];
          }
          if (items.length > 0) {
            var oldsearch = ctrl.search;
            angular.forEach(items, function(item) {
              var newItem = ctrl.tagging.fct ? ctrl.tagging.fct(item) : item;
              if (newItem) {
                ctrl.select(newItem, true);
              }
            });
            ctrl.search = oldsearch || EMPTY_SEARCH;
            e.preventDefault();
            e.stopPropagation();
          }
        } else if (ctrl.paste) {
          ctrl.paste(data);
          ctrl.search = EMPTY_SEARCH;
          e.preventDefault();
          e.stopPropagation();
        }
      }
    });
    ctrl.searchInput.on('tagged', function() {
      $timeout(function() {
        _resetSearchInput();
      });
    });
    function _ensureHighlightVisible() {
      var container = $element.querySelectorAll('.ui-select-choices-content');
      var choices = container.querySelectorAll('.ui-select-choices-row');
      if (choices.length < 1) {
        throw uiSelectMinErr('choices', "Expected multiple .ui-select-choices-row but got '{0}'.", choices.length);
      }
      if (ctrl.activeIndex < 0) {
        return;
      }
      var highlighted = choices[ctrl.activeIndex];
      var posY = highlighted.offsetTop + highlighted.clientHeight - container[0].scrollTop;
      var height = container[0].offsetHeight;
      if (posY > height) {
        container[0].scrollTop += posY - height;
      } else if (posY < highlighted.clientHeight) {
        if (ctrl.isGrouped && ctrl.activeIndex === 0)
          container[0].scrollTop = 0;
        else
          container[0].scrollTop -= highlighted.clientHeight - posY;
      }
    }
    var onResize = $$uisDebounce(function() {
      ctrl.sizeSearchInput();
    }, 50);
    angular.element($window).bind('resize', onResize);
    $scope.$on('$destroy', function() {
      ctrl.searchInput.off('keyup keydown tagged blur paste');
      angular.element($window).off('resize', onResize);
    });
  }]);
})(require('process'));
