/* */ 
(function(process) {
  uis.directive('uiSelectMultiple', ['uiSelectMinErr', '$timeout', function(uiSelectMinErr, $timeout) {
    return {
      restrict: 'EA',
      require: ['^uiSelect', '^ngModel'],
      controller: ['$scope', '$timeout', function($scope, $timeout) {
        var ctrl = this,
            $select = $scope.$select,
            ngModel;
        if (angular.isUndefined($select.selected))
          $select.selected = [];
        $scope.$evalAsync(function() {
          ngModel = $scope.ngModel;
        });
        ctrl.activeMatchIndex = -1;
        ctrl.updateModel = function() {
          ngModel.$setViewValue(Date.now());
          ctrl.refreshComponent();
        };
        ctrl.refreshComponent = function() {
          $select.refreshItems();
          $select.sizeSearchInput();
        };
        ctrl.removeChoice = function(index) {
          var removedChoice = $select.selected[index];
          if (removedChoice._uiSelectChoiceLocked)
            return;
          var locals = {};
          locals[$select.parserResult.itemName] = removedChoice;
          $select.selected.splice(index, 1);
          ctrl.activeMatchIndex = -1;
          $select.sizeSearchInput();
          $timeout(function() {
            $select.onRemoveCallback($scope, {
              $item: removedChoice,
              $model: $select.parserResult.modelMapper($scope, locals)
            });
          });
          ctrl.updateModel();
        };
        ctrl.getPlaceholder = function() {
          if ($select.selected && $select.selected.length)
            return;
          return $select.placeholder;
        };
      }],
      controllerAs: '$selectMultiple',
      link: function(scope, element, attrs, ctrls) {
        var $select = ctrls[0];
        var ngModel = scope.ngModel = ctrls[1];
        var $selectMultiple = scope.$selectMultiple;
        $select.multiple = true;
        $select.removeSelected = true;
        $select.focusInput = $select.searchInput;
        ngModel.$isEmpty = function(value) {
          return !value || value.length === 0;
        };
        ngModel.$parsers.unshift(function() {
          var locals = {},
              result,
              resultMultiple = [];
          for (var j = $select.selected.length - 1; j >= 0; j--) {
            locals = {};
            locals[$select.parserResult.itemName] = $select.selected[j];
            result = $select.parserResult.modelMapper(scope, locals);
            resultMultiple.unshift(result);
          }
          return resultMultiple;
        });
        ngModel.$formatters.unshift(function(inputValue) {
          var data = $select.parserResult.source(scope, {$select: {search: ''}}),
              locals = {},
              result;
          if (!data)
            return inputValue;
          var resultMultiple = [];
          var checkFnMultiple = function(list, value) {
            if (!list || !list.length)
              return;
            for (var p = list.length - 1; p >= 0; p--) {
              locals[$select.parserResult.itemName] = list[p];
              result = $select.parserResult.modelMapper(scope, locals);
              if ($select.parserResult.trackByExp) {
                var propsItemNameMatches = /(\w*)\./.exec($select.parserResult.trackByExp);
                var matches = /\.([^\s]+)/.exec($select.parserResult.trackByExp);
                if (propsItemNameMatches && propsItemNameMatches.length > 0 && propsItemNameMatches[1] == $select.parserResult.itemName) {
                  if (matches && matches.length > 0 && result[matches[1]] == value[matches[1]]) {
                    resultMultiple.unshift(list[p]);
                    return true;
                  }
                }
              }
              if (angular.equals(result, value)) {
                resultMultiple.unshift(list[p]);
                return true;
              }
            }
            return false;
          };
          if (!inputValue)
            return resultMultiple;
          for (var k = inputValue.length - 1; k >= 0; k--) {
            if (!checkFnMultiple($select.selected, inputValue[k])) {
              if (!checkFnMultiple(data, inputValue[k])) {
                resultMultiple.unshift(inputValue[k]);
              }
            }
          }
          return resultMultiple;
        });
        scope.$watchCollection(function() {
          return ngModel.$modelValue;
        }, function(newValue, oldValue) {
          if (oldValue != newValue) {
            if (angular.isDefined(ngModel.$modelValue)) {
              ngModel.$modelValue = null;
            }
            $selectMultiple.refreshComponent();
          }
        });
        ngModel.$render = function() {
          if (!angular.isArray(ngModel.$viewValue)) {
            if (angular.isUndefined(ngModel.$viewValue) || ngModel.$viewValue === null) {
              $select.selected = [];
            } else {
              throw uiSelectMinErr('multiarr', "Expected model value to be array but got '{0}'", ngModel.$viewValue);
            }
          }
          $select.selected = ngModel.$viewValue;
          $selectMultiple.refreshComponent();
          scope.$evalAsync();
        };
        scope.$on('uis:select', function(event, item) {
          if ($select.selected.length >= $select.limit) {
            return;
          }
          $select.selected.push(item);
          $selectMultiple.updateModel();
        });
        scope.$on('uis:activate', function() {
          $selectMultiple.activeMatchIndex = -1;
        });
        scope.$watch('$select.disabled', function(newValue, oldValue) {
          if (oldValue && !newValue)
            $select.sizeSearchInput();
        });
        $select.searchInput.on('keydown', function(e) {
          var key = e.which;
          scope.$apply(function() {
            var processed = false;
            if (KEY.isHorizontalMovement(key)) {
              processed = _handleMatchSelection(key);
            }
            if (processed && key != KEY.TAB) {
              e.preventDefault();
              e.stopPropagation();
            }
          });
        });
        function _getCaretPosition(el) {
          if (angular.isNumber(el.selectionStart))
            return el.selectionStart;
          else
            return el.value.length;
        }
        function _handleMatchSelection(key) {
          var caretPosition = _getCaretPosition($select.searchInput[0]),
              length = $select.selected.length,
              first = 0,
              last = length - 1,
              curr = $selectMultiple.activeMatchIndex,
              next = $selectMultiple.activeMatchIndex + 1,
              prev = $selectMultiple.activeMatchIndex - 1,
              newIndex = curr;
          if (caretPosition > 0 || ($select.search.length && key == KEY.RIGHT))
            return false;
          $select.close();
          function getNewActiveMatchIndex() {
            switch (key) {
              case KEY.LEFT:
                if (~$selectMultiple.activeMatchIndex)
                  return prev;
                else
                  return last;
                break;
              case KEY.RIGHT:
                if (!~$selectMultiple.activeMatchIndex || curr === last) {
                  $select.activate();
                  return false;
                } else
                  return next;
                break;
              case KEY.BACKSPACE:
                if (~$selectMultiple.activeMatchIndex) {
                  $selectMultiple.removeChoice(curr);
                  return prev;
                } else
                  return last;
                break;
              case KEY.DELETE:
                if (~$selectMultiple.activeMatchIndex) {
                  $selectMultiple.removeChoice($selectMultiple.activeMatchIndex);
                  return curr;
                } else
                  return false;
            }
          }
          newIndex = getNewActiveMatchIndex();
          if (!$select.selected.length || newIndex === false)
            $selectMultiple.activeMatchIndex = -1;
          else
            $selectMultiple.activeMatchIndex = Math.min(last, Math.max(first, newIndex));
          return true;
        }
        $select.searchInput.on('keyup', function(e) {
          if (!KEY.isVerticalMovement(e.which)) {
            scope.$evalAsync(function() {
              $select.activeIndex = $select.taggingLabel === false ? -1 : 0;
            });
          }
          if ($select.tagging.isActivated && $select.search.length > 0) {
            if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC || KEY.isVerticalMovement(e.which)) {
              return;
            }
            $select.activeIndex = $select.taggingLabel === false ? -1 : 0;
            if ($select.taggingLabel === false)
              return;
            var items = angular.copy($select.items);
            var stashArr = angular.copy($select.items);
            var newItem;
            var item;
            var hasTag = false;
            var dupeIndex = -1;
            var tagItems;
            var tagItem;
            if ($select.tagging.fct !== undefined) {
              tagItems = $select.$filter('filter')(items, {'isTag': true});
              if (tagItems.length > 0) {
                tagItem = tagItems[0];
              }
              if (items.length > 0 && tagItem) {
                hasTag = true;
                items = items.slice(1, items.length);
                stashArr = stashArr.slice(1, stashArr.length);
              }
              newItem = $select.tagging.fct($select.search);
              if (stashArr.some(function(origItem) {
                return angular.equals(origItem, newItem);
              }) || $select.selected.some(function(origItem) {
                return angular.equals(origItem, newItem);
              })) {
                scope.$evalAsync(function() {
                  $select.activeIndex = 0;
                  $select.items = items;
                });
                return;
              }
              if (newItem)
                newItem.isTag = true;
            } else {
              tagItems = $select.$filter('filter')(items, function(item) {
                return item.match($select.taggingLabel);
              });
              if (tagItems.length > 0) {
                tagItem = tagItems[0];
              }
              item = items[0];
              if (item !== undefined && items.length > 0 && tagItem) {
                hasTag = true;
                items = items.slice(1, items.length);
                stashArr = stashArr.slice(1, stashArr.length);
              }
              newItem = $select.search + ' ' + $select.taggingLabel;
              if (_findApproxDupe($select.selected, $select.search) > -1) {
                return;
              }
              if (_findCaseInsensitiveDupe(stashArr.concat($select.selected))) {
                if (hasTag) {
                  items = stashArr;
                  scope.$evalAsync(function() {
                    $select.activeIndex = 0;
                    $select.items = items;
                  });
                }
                return;
              }
              if (_findCaseInsensitiveDupe(stashArr)) {
                if (hasTag) {
                  $select.items = stashArr.slice(1, stashArr.length);
                }
                return;
              }
            }
            if (hasTag)
              dupeIndex = _findApproxDupe($select.selected, newItem);
            if (dupeIndex > -1) {
              items = items.slice(dupeIndex + 1, items.length - 1);
            } else {
              items = [];
              if (newItem)
                items.push(newItem);
              items = items.concat(stashArr);
            }
            scope.$evalAsync(function() {
              $select.activeIndex = 0;
              $select.items = items;
              if ($select.isGrouped) {
                var itemsWithoutTag = newItem ? items.slice(1) : items;
                $select.setItemsFn(itemsWithoutTag);
                if (newItem) {
                  $select.items.unshift(newItem);
                  $select.groups.unshift({
                    name: '',
                    items: [newItem],
                    tagging: true
                  });
                }
              }
            });
          }
        });
        function _findCaseInsensitiveDupe(arr) {
          if (arr === undefined || $select.search === undefined) {
            return false;
          }
          var hasDupe = arr.filter(function(origItem) {
            if ($select.search.toUpperCase() === undefined || origItem === undefined) {
              return false;
            }
            return origItem.toUpperCase() === $select.search.toUpperCase();
          }).length > 0;
          return hasDupe;
        }
        function _findApproxDupe(haystack, needle) {
          var dupeIndex = -1;
          if (angular.isArray(haystack)) {
            var tempArr = angular.copy(haystack);
            for (var i = 0; i < tempArr.length; i++) {
              if ($select.tagging.fct === undefined) {
                if (tempArr[i] + ' ' + $select.taggingLabel === needle) {
                  dupeIndex = i;
                }
              } else {
                var mockObj = tempArr[i];
                if (angular.isObject(mockObj)) {
                  mockObj.isTag = true;
                }
                if (angular.equals(mockObj, needle)) {
                  dupeIndex = i;
                }
              }
            }
          }
          return dupeIndex;
        }
        $select.searchInput.on('blur', function() {
          $timeout(function() {
            $selectMultiple.activeMatchIndex = -1;
          });
        });
      }
    };
  }]);
})(require('process'));
