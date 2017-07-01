/* */ 
"format cjs";
(function(process) {
  (function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs/observable/forkJoin'), require('rxjs/observable/fromPromise'), require('rxjs/operator/map'), require('@angular/platform-browser')) : typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'rxjs/observable/forkJoin', 'rxjs/observable/fromPromise', 'rxjs/operator/map', '@angular/platform-browser'], factory) : (factory((global.ng = global.ng || {}, global.ng.forms = global.ng.forms || {}), global.ng.core, global.Rx.Observable, global.Rx.Observable, global.Rx.Observable.prototype, global.ng.platformBrowser));
  }(this, (function(exports, _angular_core, rxjs_observable_forkJoin, rxjs_observable_fromPromise, rxjs_operator_map, _angular_platformBrowser) {
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
    var AbstractControlDirective = (function() {
      function AbstractControlDirective() {}
      AbstractControlDirective.prototype.control = function() {};
      Object.defineProperty(AbstractControlDirective.prototype, "value", {
        get: function() {
          return this.control ? this.control.value : null;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AbstractControlDirective.prototype, "valid", {
        get: function() {
          return this.control ? this.control.valid : null;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AbstractControlDirective.prototype, "invalid", {
        get: function() {
          return this.control ? this.control.invalid : null;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AbstractControlDirective.prototype, "pending", {
        get: function() {
          return this.control ? this.control.pending : null;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AbstractControlDirective.prototype, "errors", {
        get: function() {
          return this.control ? this.control.errors : null;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AbstractControlDirective.prototype, "pristine", {
        get: function() {
          return this.control ? this.control.pristine : null;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AbstractControlDirective.prototype, "dirty", {
        get: function() {
          return this.control ? this.control.dirty : null;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AbstractControlDirective.prototype, "touched", {
        get: function() {
          return this.control ? this.control.touched : null;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AbstractControlDirective.prototype, "untouched", {
        get: function() {
          return this.control ? this.control.untouched : null;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AbstractControlDirective.prototype, "disabled", {
        get: function() {
          return this.control ? this.control.disabled : null;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AbstractControlDirective.prototype, "enabled", {
        get: function() {
          return this.control ? this.control.enabled : null;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AbstractControlDirective.prototype, "statusChanges", {
        get: function() {
          return this.control ? this.control.statusChanges : null;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AbstractControlDirective.prototype, "valueChanges", {
        get: function() {
          return this.control ? this.control.valueChanges : null;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AbstractControlDirective.prototype, "path", {
        get: function() {
          return null;
        },
        enumerable: true,
        configurable: true
      });
      AbstractControlDirective.prototype.reset = function(value) {
        if (value === void 0) {
          value = undefined;
        }
        if (this.control)
          this.control.reset(value);
      };
      AbstractControlDirective.prototype.hasError = function(errorCode, path) {
        return this.control ? this.control.hasError(errorCode, path) : false;
      };
      AbstractControlDirective.prototype.getError = function(errorCode, path) {
        return this.control ? this.control.getError(errorCode, path) : null;
      };
      return AbstractControlDirective;
    }());
    var ControlContainer = (function(_super) {
      __extends(ControlContainer, _super);
      function ControlContainer() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      Object.defineProperty(ControlContainer.prototype, "formDirective", {
        get: function() {
          return null;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ControlContainer.prototype, "path", {
        get: function() {
          return null;
        },
        enumerable: true,
        configurable: true
      });
      return ControlContainer;
    }(AbstractControlDirective));
    function isEmptyInputValue(value) {
      return value == null || value.length === 0;
    }
    var NG_VALIDATORS = new _angular_core.InjectionToken('NgValidators');
    var NG_ASYNC_VALIDATORS = new _angular_core.InjectionToken('NgAsyncValidators');
    var EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
    var Validators = (function() {
      function Validators() {}
      Validators.min = function(min) {
        return function(control) {
          if (isEmptyInputValue(control.value) || isEmptyInputValue(min)) {
            return null;
          }
          var value = parseFloat(control.value);
          return !isNaN(value) && value < min ? {'min': {
              'min': min,
              'actual': control.value
            }} : null;
        };
      };
      Validators.max = function(max) {
        return function(control) {
          if (isEmptyInputValue(control.value) || isEmptyInputValue(max)) {
            return null;
          }
          var value = parseFloat(control.value);
          return !isNaN(value) && value > max ? {'max': {
              'max': max,
              'actual': control.value
            }} : null;
        };
      };
      Validators.required = function(control) {
        return isEmptyInputValue(control.value) ? {'required': true} : null;
      };
      Validators.requiredTrue = function(control) {
        return control.value === true ? null : {'required': true};
      };
      Validators.email = function(control) {
        return EMAIL_REGEXP.test(control.value) ? null : {'email': true};
      };
      Validators.minLength = function(minLength) {
        return function(control) {
          if (isEmptyInputValue(control.value)) {
            return null;
          }
          var length = control.value ? control.value.length : 0;
          return length < minLength ? {'minlength': {
              'requiredLength': minLength,
              'actualLength': length
            }} : null;
        };
      };
      Validators.maxLength = function(maxLength) {
        return function(control) {
          var length = control.value ? control.value.length : 0;
          return length > maxLength ? {'maxlength': {
              'requiredLength': maxLength,
              'actualLength': length
            }} : null;
        };
      };
      Validators.pattern = function(pattern) {
        if (!pattern)
          return Validators.nullValidator;
        var regex;
        var regexStr;
        if (typeof pattern === 'string') {
          regexStr = "^" + pattern + "$";
          regex = new RegExp(regexStr);
        } else {
          regexStr = pattern.toString();
          regex = pattern;
        }
        return function(control) {
          if (isEmptyInputValue(control.value)) {
            return null;
          }
          var value = control.value;
          return regex.test(value) ? null : {'pattern': {
              'requiredPattern': regexStr,
              'actualValue': value
            }};
        };
      };
      Validators.nullValidator = function(c) {
        return null;
      };
      Validators.compose = function(validators) {
        if (!validators)
          return null;
        var presentValidators = (validators.filter(isPresent));
        if (presentValidators.length == 0)
          return null;
        return function(control) {
          return _mergeErrors(_executeValidators(control, presentValidators));
        };
      };
      Validators.composeAsync = function(validators) {
        if (!validators)
          return null;
        var presentValidators = (validators.filter(isPresent));
        if (presentValidators.length == 0)
          return null;
        return function(control) {
          var observables = _executeAsyncValidators(control, presentValidators).map(toObservable);
          return rxjs_operator_map.map.call(rxjs_observable_forkJoin.forkJoin(observables), _mergeErrors);
        };
      };
      return Validators;
    }());
    function isPresent(o) {
      return o != null;
    }
    function toObservable(r) {
      var obs = _angular_core.ɵisPromise(r) ? rxjs_observable_fromPromise.fromPromise(r) : r;
      if (!(_angular_core.ɵisObservable(obs))) {
        throw new Error("Expected validator to return Promise or Observable.");
      }
      return obs;
    }
    function _executeValidators(control, validators) {
      return validators.map(function(v) {
        return v(control);
      });
    }
    function _executeAsyncValidators(control, validators) {
      return validators.map(function(v) {
        return v(control);
      });
    }
    function _mergeErrors(arrayOfErrors) {
      var res = arrayOfErrors.reduce(function(res, errors) {
        return errors != null ? Object.assign({}, ((res)), errors) : ((res));
      }, {});
      return Object.keys(res).length === 0 ? null : res;
    }
    var NG_VALUE_ACCESSOR = new _angular_core.InjectionToken('NgValueAccessor');
    var CHECKBOX_VALUE_ACCESSOR = {
      provide: NG_VALUE_ACCESSOR,
      useExisting: _angular_core.forwardRef(function() {
        return CheckboxControlValueAccessor;
      }),
      multi: true
    };
    var CheckboxControlValueAccessor = (function() {
      function CheckboxControlValueAccessor(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this.onChange = function(_) {};
        this.onTouched = function() {};
      }
      CheckboxControlValueAccessor.prototype.writeValue = function(value) {
        this._renderer.setElementProperty(this._elementRef.nativeElement, 'checked', value);
      };
      CheckboxControlValueAccessor.prototype.registerOnChange = function(fn) {
        this.onChange = fn;
      };
      CheckboxControlValueAccessor.prototype.registerOnTouched = function(fn) {
        this.onTouched = fn;
      };
      CheckboxControlValueAccessor.prototype.setDisabledState = function(isDisabled) {
        this._renderer.setElementProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
      };
      return CheckboxControlValueAccessor;
    }());
    CheckboxControlValueAccessor.decorators = [{
      type: _angular_core.Directive,
      args: [{
        selector: 'input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]',
        host: {
          '(change)': 'onChange($event.target.checked)',
          '(blur)': 'onTouched()'
        },
        providers: [CHECKBOX_VALUE_ACCESSOR]
      }]
    }];
    CheckboxControlValueAccessor.ctorParameters = function() {
      return [{type: _angular_core.Renderer}, {type: _angular_core.ElementRef}];
    };
    var DEFAULT_VALUE_ACCESSOR = {
      provide: NG_VALUE_ACCESSOR,
      useExisting: _angular_core.forwardRef(function() {
        return DefaultValueAccessor;
      }),
      multi: true
    };
    function _isAndroid() {
      var userAgent = _angular_platformBrowser.ɵgetDOM() ? _angular_platformBrowser.ɵgetDOM().getUserAgent() : '';
      return /android (\d+)/.test(userAgent.toLowerCase());
    }
    var COMPOSITION_BUFFER_MODE = new _angular_core.InjectionToken('CompositionEventMode');
    var DefaultValueAccessor = (function() {
      function DefaultValueAccessor(_renderer, _elementRef, _compositionMode) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this._compositionMode = _compositionMode;
        this.onChange = function(_) {};
        this.onTouched = function() {};
        this._composing = false;
        if (this._compositionMode == null) {
          this._compositionMode = !_isAndroid();
        }
      }
      DefaultValueAccessor.prototype.writeValue = function(value) {
        var normalizedValue = value == null ? '' : value;
        this._renderer.setElementProperty(this._elementRef.nativeElement, 'value', normalizedValue);
      };
      DefaultValueAccessor.prototype.registerOnChange = function(fn) {
        this.onChange = fn;
      };
      DefaultValueAccessor.prototype.registerOnTouched = function(fn) {
        this.onTouched = fn;
      };
      DefaultValueAccessor.prototype.setDisabledState = function(isDisabled) {
        this._renderer.setElementProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
      };
      DefaultValueAccessor.prototype._handleInput = function(value) {
        if (!this._compositionMode || (this._compositionMode && !this._composing)) {
          this.onChange(value);
        }
      };
      DefaultValueAccessor.prototype._compositionStart = function() {
        this._composing = true;
      };
      DefaultValueAccessor.prototype._compositionEnd = function(value) {
        this._composing = false;
        this._compositionMode && this.onChange(value);
      };
      return DefaultValueAccessor;
    }());
    DefaultValueAccessor.decorators = [{
      type: _angular_core.Directive,
      args: [{
        selector: 'input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]',
        host: {
          '(input)': '_handleInput($event.target.value)',
          '(blur)': 'onTouched()',
          '(compositionstart)': '_compositionStart()',
          '(compositionend)': '_compositionEnd($event.target.value)'
        },
        providers: [DEFAULT_VALUE_ACCESSOR]
      }]
    }];
    DefaultValueAccessor.ctorParameters = function() {
      return [{type: _angular_core.Renderer}, {type: _angular_core.ElementRef}, {
        type: undefined,
        decorators: [{type: _angular_core.Optional}, {
          type: _angular_core.Inject,
          args: [COMPOSITION_BUFFER_MODE]
        }]
      }];
    };
    function normalizeValidator(validator) {
      if (((validator)).validate) {
        return function(c) {
          return ((validator)).validate(c);
        };
      } else {
        return (validator);
      }
    }
    function normalizeAsyncValidator(validator) {
      if (((validator)).validate) {
        return function(c) {
          return ((validator)).validate(c);
        };
      } else {
        return (validator);
      }
    }
    var NUMBER_VALUE_ACCESSOR = {
      provide: NG_VALUE_ACCESSOR,
      useExisting: _angular_core.forwardRef(function() {
        return NumberValueAccessor;
      }),
      multi: true
    };
    var NumberValueAccessor = (function() {
      function NumberValueAccessor(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this.onChange = function(_) {};
        this.onTouched = function() {};
      }
      NumberValueAccessor.prototype.writeValue = function(value) {
        var normalizedValue = value == null ? '' : value;
        this._renderer.setElementProperty(this._elementRef.nativeElement, 'value', normalizedValue);
      };
      NumberValueAccessor.prototype.registerOnChange = function(fn) {
        this.onChange = function(value) {
          fn(value == '' ? null : parseFloat(value));
        };
      };
      NumberValueAccessor.prototype.registerOnTouched = function(fn) {
        this.onTouched = fn;
      };
      NumberValueAccessor.prototype.setDisabledState = function(isDisabled) {
        this._renderer.setElementProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
      };
      return NumberValueAccessor;
    }());
    NumberValueAccessor.decorators = [{
      type: _angular_core.Directive,
      args: [{
        selector: 'input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]',
        host: {
          '(change)': 'onChange($event.target.value)',
          '(input)': 'onChange($event.target.value)',
          '(blur)': 'onTouched()'
        },
        providers: [NUMBER_VALUE_ACCESSOR]
      }]
    }];
    NumberValueAccessor.ctorParameters = function() {
      return [{type: _angular_core.Renderer}, {type: _angular_core.ElementRef}];
    };
    function unimplemented() {
      throw new Error('unimplemented');
    }
    var NgControl = (function(_super) {
      __extends(NgControl, _super);
      function NgControl() {
        var _this = _super.apply(this, arguments) || this;
        _this._parent = null;
        _this.name = null;
        _this.valueAccessor = null;
        _this._rawValidators = [];
        _this._rawAsyncValidators = [];
        return _this;
      }
      Object.defineProperty(NgControl.prototype, "validator", {
        get: function() {
          return (unimplemented());
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(NgControl.prototype, "asyncValidator", {
        get: function() {
          return (unimplemented());
        },
        enumerable: true,
        configurable: true
      });
      NgControl.prototype.viewToModelUpdate = function(newValue) {};
      return NgControl;
    }(AbstractControlDirective));
    var RADIO_VALUE_ACCESSOR = {
      provide: NG_VALUE_ACCESSOR,
      useExisting: _angular_core.forwardRef(function() {
        return RadioControlValueAccessor;
      }),
      multi: true
    };
    var RadioControlRegistry = (function() {
      function RadioControlRegistry() {
        this._accessors = [];
      }
      RadioControlRegistry.prototype.add = function(control, accessor) {
        this._accessors.push([control, accessor]);
      };
      RadioControlRegistry.prototype.remove = function(accessor) {
        for (var i = this._accessors.length - 1; i >= 0; --i) {
          if (this._accessors[i][1] === accessor) {
            this._accessors.splice(i, 1);
            return;
          }
        }
      };
      RadioControlRegistry.prototype.select = function(accessor) {
        var _this = this;
        this._accessors.forEach(function(c) {
          if (_this._isSameGroup(c, accessor) && c[1] !== accessor) {
            c[1].fireUncheck(accessor.value);
          }
        });
      };
      RadioControlRegistry.prototype._isSameGroup = function(controlPair, accessor) {
        if (!controlPair[0].control)
          return false;
        return controlPair[0]._parent === accessor._control._parent && controlPair[1].name === accessor.name;
      };
      return RadioControlRegistry;
    }());
    RadioControlRegistry.decorators = [{type: _angular_core.Injectable}];
    RadioControlRegistry.ctorParameters = function() {
      return [];
    };
    var RadioControlValueAccessor = (function() {
      function RadioControlValueAccessor(_renderer, _elementRef, _registry, _injector) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this._registry = _registry;
        this._injector = _injector;
        this.onChange = function() {};
        this.onTouched = function() {};
      }
      RadioControlValueAccessor.prototype.ngOnInit = function() {
        this._control = this._injector.get(NgControl);
        this._checkName();
        this._registry.add(this._control, this);
      };
      RadioControlValueAccessor.prototype.ngOnDestroy = function() {
        this._registry.remove(this);
      };
      RadioControlValueAccessor.prototype.writeValue = function(value) {
        this._state = value === this.value;
        this._renderer.setElementProperty(this._elementRef.nativeElement, 'checked', this._state);
      };
      RadioControlValueAccessor.prototype.registerOnChange = function(fn) {
        var _this = this;
        this._fn = fn;
        this.onChange = function() {
          fn(_this.value);
          _this._registry.select(_this);
        };
      };
      RadioControlValueAccessor.prototype.fireUncheck = function(value) {
        this.writeValue(value);
      };
      RadioControlValueAccessor.prototype.registerOnTouched = function(fn) {
        this.onTouched = fn;
      };
      RadioControlValueAccessor.prototype.setDisabledState = function(isDisabled) {
        this._renderer.setElementProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
      };
      RadioControlValueAccessor.prototype._checkName = function() {
        if (this.name && this.formControlName && this.name !== this.formControlName) {
          this._throwNameError();
        }
        if (!this.name && this.formControlName)
          this.name = this.formControlName;
      };
      RadioControlValueAccessor.prototype._throwNameError = function() {
        throw new Error("\n      If you define both a name and a formControlName attribute on your radio button, their values\n      must match. Ex: <input type=\"radio\" formControlName=\"food\" name=\"food\">\n    ");
      };
      return RadioControlValueAccessor;
    }());
    RadioControlValueAccessor.decorators = [{
      type: _angular_core.Directive,
      args: [{
        selector: 'input[type=radio][formControlName],input[type=radio][formControl],input[type=radio][ngModel]',
        host: {
          '(change)': 'onChange()',
          '(blur)': 'onTouched()'
        },
        providers: [RADIO_VALUE_ACCESSOR]
      }]
    }];
    RadioControlValueAccessor.ctorParameters = function() {
      return [{type: _angular_core.Renderer}, {type: _angular_core.ElementRef}, {type: RadioControlRegistry}, {type: _angular_core.Injector}];
    };
    RadioControlValueAccessor.propDecorators = {
      'name': [{type: _angular_core.Input}],
      'formControlName': [{type: _angular_core.Input}],
      'value': [{type: _angular_core.Input}]
    };
    var RANGE_VALUE_ACCESSOR = {
      provide: NG_VALUE_ACCESSOR,
      useExisting: _angular_core.forwardRef(function() {
        return RangeValueAccessor;
      }),
      multi: true
    };
    var RangeValueAccessor = (function() {
      function RangeValueAccessor(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this.onChange = function(_) {};
        this.onTouched = function() {};
      }
      RangeValueAccessor.prototype.writeValue = function(value) {
        this._renderer.setElementProperty(this._elementRef.nativeElement, 'value', parseFloat(value));
      };
      RangeValueAccessor.prototype.registerOnChange = function(fn) {
        this.onChange = function(value) {
          fn(value == '' ? null : parseFloat(value));
        };
      };
      RangeValueAccessor.prototype.registerOnTouched = function(fn) {
        this.onTouched = fn;
      };
      RangeValueAccessor.prototype.setDisabledState = function(isDisabled) {
        this._renderer.setElementProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
      };
      return RangeValueAccessor;
    }());
    RangeValueAccessor.decorators = [{
      type: _angular_core.Directive,
      args: [{
        selector: 'input[type=range][formControlName],input[type=range][formControl],input[type=range][ngModel]',
        host: {
          '(change)': 'onChange($event.target.value)',
          '(input)': 'onChange($event.target.value)',
          '(blur)': 'onTouched()'
        },
        providers: [RANGE_VALUE_ACCESSOR]
      }]
    }];
    RangeValueAccessor.ctorParameters = function() {
      return [{type: _angular_core.Renderer}, {type: _angular_core.ElementRef}];
    };
    var SELECT_VALUE_ACCESSOR = {
      provide: NG_VALUE_ACCESSOR,
      useExisting: _angular_core.forwardRef(function() {
        return SelectControlValueAccessor;
      }),
      multi: true
    };
    function _buildValueString(id, value) {
      if (id == null)
        return "" + value;
      if (value && typeof value === 'object')
        value = 'Object';
      return (id + ": " + value).slice(0, 50);
    }
    function _extractId(valueString) {
      return valueString.split(':')[0];
    }
    var SelectControlValueAccessor = (function() {
      function SelectControlValueAccessor(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this._optionMap = new Map();
        this._idCounter = 0;
        this.onChange = function(_) {};
        this.onTouched = function() {};
        this._compareWith = _angular_core.ɵlooseIdentical;
      }
      Object.defineProperty(SelectControlValueAccessor.prototype, "compareWith", {
        set: function(fn) {
          if (typeof fn !== 'function') {
            throw new Error("compareWith must be a function, but received " + JSON.stringify(fn));
          }
          this._compareWith = fn;
        },
        enumerable: true,
        configurable: true
      });
      SelectControlValueAccessor.prototype.writeValue = function(value) {
        this.value = value;
        var id = this._getOptionId(value);
        if (id == null) {
          this._renderer.setElementProperty(this._elementRef.nativeElement, 'selectedIndex', -1);
        }
        var valueString = _buildValueString(id, value);
        this._renderer.setElementProperty(this._elementRef.nativeElement, 'value', valueString);
      };
      SelectControlValueAccessor.prototype.registerOnChange = function(fn) {
        var _this = this;
        this.onChange = function(valueString) {
          _this.value = valueString;
          fn(_this._getOptionValue(valueString));
        };
      };
      SelectControlValueAccessor.prototype.registerOnTouched = function(fn) {
        this.onTouched = fn;
      };
      SelectControlValueAccessor.prototype.setDisabledState = function(isDisabled) {
        this._renderer.setElementProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
      };
      SelectControlValueAccessor.prototype._registerOption = function() {
        return (this._idCounter++).toString();
      };
      SelectControlValueAccessor.prototype._getOptionId = function(value) {
        for (var _i = 0,
            _a = Array.from(this._optionMap.keys()); _i < _a.length; _i++) {
          var id = _a[_i];
          if (this._compareWith(this._optionMap.get(id), value))
            return id;
        }
        return null;
      };
      SelectControlValueAccessor.prototype._getOptionValue = function(valueString) {
        var id = _extractId(valueString);
        return this._optionMap.has(id) ? this._optionMap.get(id) : valueString;
      };
      return SelectControlValueAccessor;
    }());
    SelectControlValueAccessor.decorators = [{
      type: _angular_core.Directive,
      args: [{
        selector: 'select:not([multiple])[formControlName],select:not([multiple])[formControl],select:not([multiple])[ngModel]',
        host: {
          '(change)': 'onChange($event.target.value)',
          '(blur)': 'onTouched()'
        },
        providers: [SELECT_VALUE_ACCESSOR]
      }]
    }];
    SelectControlValueAccessor.ctorParameters = function() {
      return [{type: _angular_core.Renderer}, {type: _angular_core.ElementRef}];
    };
    SelectControlValueAccessor.propDecorators = {'compareWith': [{type: _angular_core.Input}]};
    var NgSelectOption = (function() {
      function NgSelectOption(_element, _renderer, _select) {
        this._element = _element;
        this._renderer = _renderer;
        this._select = _select;
        if (this._select)
          this.id = this._select._registerOption();
      }
      Object.defineProperty(NgSelectOption.prototype, "ngValue", {
        set: function(value) {
          if (this._select == null)
            return;
          this._select._optionMap.set(this.id, value);
          this._setElementValue(_buildValueString(this.id, value));
          this._select.writeValue(this._select.value);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(NgSelectOption.prototype, "value", {
        set: function(value) {
          this._setElementValue(value);
          if (this._select)
            this._select.writeValue(this._select.value);
        },
        enumerable: true,
        configurable: true
      });
      NgSelectOption.prototype._setElementValue = function(value) {
        this._renderer.setElementProperty(this._element.nativeElement, 'value', value);
      };
      NgSelectOption.prototype.ngOnDestroy = function() {
        if (this._select) {
          this._select._optionMap.delete(this.id);
          this._select.writeValue(this._select.value);
        }
      };
      return NgSelectOption;
    }());
    NgSelectOption.decorators = [{
      type: _angular_core.Directive,
      args: [{selector: 'option'}]
    }];
    NgSelectOption.ctorParameters = function() {
      return [{type: _angular_core.ElementRef}, {type: _angular_core.Renderer}, {
        type: SelectControlValueAccessor,
        decorators: [{type: _angular_core.Optional}, {type: _angular_core.Host}]
      }];
    };
    NgSelectOption.propDecorators = {
      'ngValue': [{
        type: _angular_core.Input,
        args: ['ngValue']
      }],
      'value': [{
        type: _angular_core.Input,
        args: ['value']
      }]
    };
    var SELECT_MULTIPLE_VALUE_ACCESSOR = {
      provide: NG_VALUE_ACCESSOR,
      useExisting: _angular_core.forwardRef(function() {
        return SelectMultipleControlValueAccessor;
      }),
      multi: true
    };
    function _buildValueString$1(id, value) {
      if (id == null)
        return "" + value;
      if (typeof value === 'string')
        value = "'" + value + "'";
      if (value && typeof value === 'object')
        value = 'Object';
      return (id + ": " + value).slice(0, 50);
    }
    function _extractId$1(valueString) {
      return valueString.split(':')[0];
    }
    var SelectMultipleControlValueAccessor = (function() {
      function SelectMultipleControlValueAccessor(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this._optionMap = new Map();
        this._idCounter = 0;
        this.onChange = function(_) {};
        this.onTouched = function() {};
        this._compareWith = _angular_core.ɵlooseIdentical;
      }
      Object.defineProperty(SelectMultipleControlValueAccessor.prototype, "compareWith", {
        set: function(fn) {
          if (typeof fn !== 'function') {
            throw new Error("compareWith must be a function, but received " + JSON.stringify(fn));
          }
          this._compareWith = fn;
        },
        enumerable: true,
        configurable: true
      });
      SelectMultipleControlValueAccessor.prototype.writeValue = function(value) {
        var _this = this;
        this.value = value;
        var optionSelectedStateSetter;
        if (Array.isArray(value)) {
          var ids_1 = value.map(function(v) {
            return _this._getOptionId(v);
          });
          optionSelectedStateSetter = function(opt, o) {
            opt._setSelected(ids_1.indexOf(o.toString()) > -1);
          };
        } else {
          optionSelectedStateSetter = function(opt, o) {
            opt._setSelected(false);
          };
        }
        this._optionMap.forEach(optionSelectedStateSetter);
      };
      SelectMultipleControlValueAccessor.prototype.registerOnChange = function(fn) {
        var _this = this;
        this.onChange = function(_) {
          var selected = [];
          if (_.hasOwnProperty('selectedOptions')) {
            var options = _.selectedOptions;
            for (var i = 0; i < options.length; i++) {
              var opt = options.item(i);
              var val = _this._getOptionValue(opt.value);
              selected.push(val);
            }
          } else {
            var options = (_.options);
            for (var i = 0; i < options.length; i++) {
              var opt = options.item(i);
              if (opt.selected) {
                var val = _this._getOptionValue(opt.value);
                selected.push(val);
              }
            }
          }
          _this.value = selected;
          fn(selected);
        };
      };
      SelectMultipleControlValueAccessor.prototype.registerOnTouched = function(fn) {
        this.onTouched = fn;
      };
      SelectMultipleControlValueAccessor.prototype.setDisabledState = function(isDisabled) {
        this._renderer.setElementProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
      };
      SelectMultipleControlValueAccessor.prototype._registerOption = function(value) {
        var id = (this._idCounter++).toString();
        this._optionMap.set(id, value);
        return id;
      };
      SelectMultipleControlValueAccessor.prototype._getOptionId = function(value) {
        for (var _i = 0,
            _a = Array.from(this._optionMap.keys()); _i < _a.length; _i++) {
          var id = _a[_i];
          if (this._compareWith(((this._optionMap.get(id)))._value, value))
            return id;
        }
        return null;
      };
      SelectMultipleControlValueAccessor.prototype._getOptionValue = function(valueString) {
        var id = _extractId$1(valueString);
        return this._optionMap.has(id) ? ((this._optionMap.get(id)))._value : valueString;
      };
      return SelectMultipleControlValueAccessor;
    }());
    SelectMultipleControlValueAccessor.decorators = [{
      type: _angular_core.Directive,
      args: [{
        selector: 'select[multiple][formControlName],select[multiple][formControl],select[multiple][ngModel]',
        host: {
          '(change)': 'onChange($event.target)',
          '(blur)': 'onTouched()'
        },
        providers: [SELECT_MULTIPLE_VALUE_ACCESSOR]
      }]
    }];
    SelectMultipleControlValueAccessor.ctorParameters = function() {
      return [{type: _angular_core.Renderer}, {type: _angular_core.ElementRef}];
    };
    SelectMultipleControlValueAccessor.propDecorators = {'compareWith': [{type: _angular_core.Input}]};
    var NgSelectMultipleOption = (function() {
      function NgSelectMultipleOption(_element, _renderer, _select) {
        this._element = _element;
        this._renderer = _renderer;
        this._select = _select;
        if (this._select) {
          this.id = this._select._registerOption(this);
        }
      }
      Object.defineProperty(NgSelectMultipleOption.prototype, "ngValue", {
        set: function(value) {
          if (this._select == null)
            return;
          this._value = value;
          this._setElementValue(_buildValueString$1(this.id, value));
          this._select.writeValue(this._select.value);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(NgSelectMultipleOption.prototype, "value", {
        set: function(value) {
          if (this._select) {
            this._value = value;
            this._setElementValue(_buildValueString$1(this.id, value));
            this._select.writeValue(this._select.value);
          } else {
            this._setElementValue(value);
          }
        },
        enumerable: true,
        configurable: true
      });
      NgSelectMultipleOption.prototype._setElementValue = function(value) {
        this._renderer.setElementProperty(this._element.nativeElement, 'value', value);
      };
      NgSelectMultipleOption.prototype._setSelected = function(selected) {
        this._renderer.setElementProperty(this._element.nativeElement, 'selected', selected);
      };
      NgSelectMultipleOption.prototype.ngOnDestroy = function() {
        if (this._select) {
          this._select._optionMap.delete(this.id);
          this._select.writeValue(this._select.value);
        }
      };
      return NgSelectMultipleOption;
    }());
    NgSelectMultipleOption.decorators = [{
      type: _angular_core.Directive,
      args: [{selector: 'option'}]
    }];
    NgSelectMultipleOption.ctorParameters = function() {
      return [{type: _angular_core.ElementRef}, {type: _angular_core.Renderer}, {
        type: SelectMultipleControlValueAccessor,
        decorators: [{type: _angular_core.Optional}, {type: _angular_core.Host}]
      }];
    };
    NgSelectMultipleOption.propDecorators = {
      'ngValue': [{
        type: _angular_core.Input,
        args: ['ngValue']
      }],
      'value': [{
        type: _angular_core.Input,
        args: ['value']
      }]
    };
    function controlPath(name, parent) {
      return ((parent.path)).concat([name]);
    }
    function setUpControl(control, dir) {
      if (!control)
        _throwError(dir, 'Cannot find control with');
      if (!dir.valueAccessor)
        _throwError(dir, 'No value accessor for form control with');
      control.validator = Validators.compose([((control.validator)), dir.validator]);
      control.asyncValidator = Validators.composeAsync([((control.asyncValidator)), dir.asyncValidator]);
      ((dir.valueAccessor)).writeValue(control.value);
      ((dir.valueAccessor)).registerOnChange(function(newValue) {
        dir.viewToModelUpdate(newValue);
        control.markAsDirty();
        control.setValue(newValue, {emitModelToViewChange: false});
      });
      ((dir.valueAccessor)).registerOnTouched(function() {
        return control.markAsTouched();
      });
      control.registerOnChange(function(newValue, emitModelEvent) {
        ((dir.valueAccessor)).writeValue(newValue);
        if (emitModelEvent)
          dir.viewToModelUpdate(newValue);
      });
      if (((dir.valueAccessor)).setDisabledState) {
        control.registerOnDisabledChange(function(isDisabled) {
          ((((dir.valueAccessor)).setDisabledState))(isDisabled);
        });
      }
      dir._rawValidators.forEach(function(validator) {
        if (((validator)).registerOnValidatorChange)
          ((((validator)).registerOnValidatorChange))(function() {
            return control.updateValueAndValidity();
          });
      });
      dir._rawAsyncValidators.forEach(function(validator) {
        if (((validator)).registerOnValidatorChange)
          ((((validator)).registerOnValidatorChange))(function() {
            return control.updateValueAndValidity();
          });
      });
    }
    function cleanUpControl(control, dir) {
      ((dir.valueAccessor)).registerOnChange(function() {
        return _noControlError(dir);
      });
      ((dir.valueAccessor)).registerOnTouched(function() {
        return _noControlError(dir);
      });
      dir._rawValidators.forEach(function(validator) {
        if (validator.registerOnValidatorChange) {
          validator.registerOnValidatorChange(null);
        }
      });
      dir._rawAsyncValidators.forEach(function(validator) {
        if (validator.registerOnValidatorChange) {
          validator.registerOnValidatorChange(null);
        }
      });
      if (control)
        control._clearChangeFns();
    }
    function setUpFormContainer(control, dir) {
      if (control == null)
        _throwError(dir, 'Cannot find control with');
      control.validator = Validators.compose([control.validator, dir.validator]);
      control.asyncValidator = Validators.composeAsync([control.asyncValidator, dir.asyncValidator]);
    }
    function _noControlError(dir) {
      return _throwError(dir, 'There is no FormControl instance attached to form control element with');
    }
    function _throwError(dir, message) {
      var messageEnd;
      if (((dir.path)).length > 1) {
        messageEnd = "path: '" + ((dir.path)).join(' -> ') + "'";
      } else if (((dir.path))[0]) {
        messageEnd = "name: '" + dir.path + "'";
      } else {
        messageEnd = 'unspecified name attribute';
      }
      throw new Error(message + " " + messageEnd);
    }
    function composeValidators(validators) {
      return validators != null ? Validators.compose(validators.map(normalizeValidator)) : null;
    }
    function composeAsyncValidators(validators) {
      return validators != null ? Validators.composeAsync(validators.map(normalizeAsyncValidator)) : null;
    }
    function isPropertyUpdated(changes, viewModel) {
      if (!changes.hasOwnProperty('model'))
        return false;
      var change = changes['model'];
      if (change.isFirstChange())
        return true;
      return !_angular_core.ɵlooseIdentical(viewModel, change.currentValue);
    }
    var BUILTIN_ACCESSORS = [CheckboxControlValueAccessor, RangeValueAccessor, NumberValueAccessor, SelectControlValueAccessor, SelectMultipleControlValueAccessor, RadioControlValueAccessor];
    function isBuiltInAccessor(valueAccessor) {
      return BUILTIN_ACCESSORS.some(function(a) {
        return valueAccessor.constructor === a;
      });
    }
    function selectValueAccessor(dir, valueAccessors) {
      if (!valueAccessors)
        return null;
      var defaultAccessor = undefined;
      var builtinAccessor = undefined;
      var customAccessor = undefined;
      valueAccessors.forEach(function(v) {
        if (v.constructor === DefaultValueAccessor) {
          defaultAccessor = v;
        } else if (isBuiltInAccessor(v)) {
          if (builtinAccessor)
            _throwError(dir, 'More than one built-in value accessor matches form control with');
          builtinAccessor = v;
        } else {
          if (customAccessor)
            _throwError(dir, 'More than one custom value accessor matches form control with');
          customAccessor = v;
        }
      });
      if (customAccessor)
        return customAccessor;
      if (builtinAccessor)
        return builtinAccessor;
      if (defaultAccessor)
        return defaultAccessor;
      _throwError(dir, 'No valid value accessor for form control with');
      return null;
    }
    var AbstractFormGroupDirective = (function(_super) {
      __extends(AbstractFormGroupDirective, _super);
      function AbstractFormGroupDirective() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      AbstractFormGroupDirective.prototype.ngOnInit = function() {
        this._checkParentType();
        ((this.formDirective)).addFormGroup(this);
      };
      AbstractFormGroupDirective.prototype.ngOnDestroy = function() {
        if (this.formDirective) {
          this.formDirective.removeFormGroup(this);
        }
      };
      Object.defineProperty(AbstractFormGroupDirective.prototype, "control", {
        get: function() {
          return ((this.formDirective)).getFormGroup(this);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AbstractFormGroupDirective.prototype, "path", {
        get: function() {
          return controlPath(this.name, this._parent);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AbstractFormGroupDirective.prototype, "formDirective", {
        get: function() {
          return this._parent ? this._parent.formDirective : null;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AbstractFormGroupDirective.prototype, "validator", {
        get: function() {
          return composeValidators(this._validators);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AbstractFormGroupDirective.prototype, "asyncValidator", {
        get: function() {
          return composeAsyncValidators(this._asyncValidators);
        },
        enumerable: true,
        configurable: true
      });
      AbstractFormGroupDirective.prototype._checkParentType = function() {};
      return AbstractFormGroupDirective;
    }(ControlContainer));
    var AbstractControlStatus = (function() {
      function AbstractControlStatus(cd) {
        this._cd = cd;
      }
      Object.defineProperty(AbstractControlStatus.prototype, "ngClassUntouched", {
        get: function() {
          return this._cd.control ? this._cd.control.untouched : false;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AbstractControlStatus.prototype, "ngClassTouched", {
        get: function() {
          return this._cd.control ? this._cd.control.touched : false;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AbstractControlStatus.prototype, "ngClassPristine", {
        get: function() {
          return this._cd.control ? this._cd.control.pristine : false;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AbstractControlStatus.prototype, "ngClassDirty", {
        get: function() {
          return this._cd.control ? this._cd.control.dirty : false;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AbstractControlStatus.prototype, "ngClassValid", {
        get: function() {
          return this._cd.control ? this._cd.control.valid : false;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AbstractControlStatus.prototype, "ngClassInvalid", {
        get: function() {
          return this._cd.control ? this._cd.control.invalid : false;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AbstractControlStatus.prototype, "ngClassPending", {
        get: function() {
          return this._cd.control ? this._cd.control.pending : false;
        },
        enumerable: true,
        configurable: true
      });
      return AbstractControlStatus;
    }());
    var ngControlStatusHost = {
      '[class.ng-untouched]': 'ngClassUntouched',
      '[class.ng-touched]': 'ngClassTouched',
      '[class.ng-pristine]': 'ngClassPristine',
      '[class.ng-dirty]': 'ngClassDirty',
      '[class.ng-valid]': 'ngClassValid',
      '[class.ng-invalid]': 'ngClassInvalid',
      '[class.ng-pending]': 'ngClassPending'
    };
    var NgControlStatus = (function(_super) {
      __extends(NgControlStatus, _super);
      function NgControlStatus(cd) {
        return _super.call(this, cd) || this;
      }
      return NgControlStatus;
    }(AbstractControlStatus));
    NgControlStatus.decorators = [{
      type: _angular_core.Directive,
      args: [{
        selector: '[formControlName],[ngModel],[formControl]',
        host: ngControlStatusHost
      }]
    }];
    NgControlStatus.ctorParameters = function() {
      return [{
        type: NgControl,
        decorators: [{type: _angular_core.Self}]
      }];
    };
    var NgControlStatusGroup = (function(_super) {
      __extends(NgControlStatusGroup, _super);
      function NgControlStatusGroup(cd) {
        return _super.call(this, cd) || this;
      }
      return NgControlStatusGroup;
    }(AbstractControlStatus));
    NgControlStatusGroup.decorators = [{
      type: _angular_core.Directive,
      args: [{
        selector: '[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]',
        host: ngControlStatusHost
      }]
    }];
    NgControlStatusGroup.ctorParameters = function() {
      return [{
        type: ControlContainer,
        decorators: [{type: _angular_core.Self}]
      }];
    };
    var VALID = 'VALID';
    var INVALID = 'INVALID';
    var PENDING = 'PENDING';
    var DISABLED = 'DISABLED';
    function _find(control, path, delimiter) {
      if (path == null)
        return null;
      if (!(path instanceof Array)) {
        path = ((path)).split(delimiter);
      }
      if (path instanceof Array && (path.length === 0))
        return null;
      return ((path)).reduce(function(v, name) {
        if (v instanceof FormGroup) {
          return v.controls[name] || null;
        }
        if (v instanceof FormArray) {
          return v.at((name)) || null;
        }
        return null;
      }, control);
    }
    function coerceToValidator(validator) {
      return Array.isArray(validator) ? composeValidators(validator) : validator || null;
    }
    function coerceToAsyncValidator(asyncValidator) {
      return Array.isArray(asyncValidator) ? composeAsyncValidators(asyncValidator) : asyncValidator || null;
    }
    var AbstractControl = (function() {
      function AbstractControl(validator, asyncValidator) {
        this.validator = validator;
        this.asyncValidator = asyncValidator;
        this._onCollectionChange = function() {};
        this._pristine = true;
        this._touched = false;
        this._onDisabledChange = [];
      }
      Object.defineProperty(AbstractControl.prototype, "value", {
        get: function() {
          return this._value;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AbstractControl.prototype, "parent", {
        get: function() {
          return this._parent;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AbstractControl.prototype, "status", {
        get: function() {
          return this._status;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AbstractControl.prototype, "valid", {
        get: function() {
          return this._status === VALID;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AbstractControl.prototype, "invalid", {
        get: function() {
          return this._status === INVALID;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AbstractControl.prototype, "pending", {
        get: function() {
          return this._status == PENDING;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AbstractControl.prototype, "disabled", {
        get: function() {
          return this._status === DISABLED;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AbstractControl.prototype, "enabled", {
        get: function() {
          return this._status !== DISABLED;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AbstractControl.prototype, "errors", {
        get: function() {
          return this._errors;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AbstractControl.prototype, "pristine", {
        get: function() {
          return this._pristine;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AbstractControl.prototype, "dirty", {
        get: function() {
          return !this.pristine;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AbstractControl.prototype, "touched", {
        get: function() {
          return this._touched;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AbstractControl.prototype, "untouched", {
        get: function() {
          return !this._touched;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AbstractControl.prototype, "valueChanges", {
        get: function() {
          return this._valueChanges;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(AbstractControl.prototype, "statusChanges", {
        get: function() {
          return this._statusChanges;
        },
        enumerable: true,
        configurable: true
      });
      AbstractControl.prototype.setValidators = function(newValidator) {
        this.validator = coerceToValidator(newValidator);
      };
      AbstractControl.prototype.setAsyncValidators = function(newValidator) {
        this.asyncValidator = coerceToAsyncValidator(newValidator);
      };
      AbstractControl.prototype.clearValidators = function() {
        this.validator = null;
      };
      AbstractControl.prototype.clearAsyncValidators = function() {
        this.asyncValidator = null;
      };
      AbstractControl.prototype.markAsTouched = function(opts) {
        if (opts === void 0) {
          opts = {};
        }
        this._touched = true;
        if (this._parent && !opts.onlySelf) {
          this._parent.markAsTouched(opts);
        }
      };
      AbstractControl.prototype.markAsUntouched = function(opts) {
        if (opts === void 0) {
          opts = {};
        }
        this._touched = false;
        this._forEachChild(function(control) {
          control.markAsUntouched({onlySelf: true});
        });
        if (this._parent && !opts.onlySelf) {
          this._parent._updateTouched(opts);
        }
      };
      AbstractControl.prototype.markAsDirty = function(opts) {
        if (opts === void 0) {
          opts = {};
        }
        this._pristine = false;
        if (this._parent && !opts.onlySelf) {
          this._parent.markAsDirty(opts);
        }
      };
      AbstractControl.prototype.markAsPristine = function(opts) {
        if (opts === void 0) {
          opts = {};
        }
        this._pristine = true;
        this._forEachChild(function(control) {
          control.markAsPristine({onlySelf: true});
        });
        if (this._parent && !opts.onlySelf) {
          this._parent._updatePristine(opts);
        }
      };
      AbstractControl.prototype.markAsPending = function(opts) {
        if (opts === void 0) {
          opts = {};
        }
        this._status = PENDING;
        if (this._parent && !opts.onlySelf) {
          this._parent.markAsPending(opts);
        }
      };
      AbstractControl.prototype.disable = function(opts) {
        if (opts === void 0) {
          opts = {};
        }
        this._status = DISABLED;
        this._errors = null;
        this._forEachChild(function(control) {
          control.disable({onlySelf: true});
        });
        this._updateValue();
        if (opts.emitEvent !== false) {
          this._valueChanges.emit(this._value);
          this._statusChanges.emit(this._status);
        }
        this._updateAncestors(!!opts.onlySelf);
        this._onDisabledChange.forEach(function(changeFn) {
          return changeFn(true);
        });
      };
      AbstractControl.prototype.enable = function(opts) {
        if (opts === void 0) {
          opts = {};
        }
        this._status = VALID;
        this._forEachChild(function(control) {
          control.enable({onlySelf: true});
        });
        this.updateValueAndValidity({
          onlySelf: true,
          emitEvent: opts.emitEvent
        });
        this._updateAncestors(!!opts.onlySelf);
        this._onDisabledChange.forEach(function(changeFn) {
          return changeFn(false);
        });
      };
      AbstractControl.prototype._updateAncestors = function(onlySelf) {
        if (this._parent && !onlySelf) {
          this._parent.updateValueAndValidity();
          this._parent._updatePristine();
          this._parent._updateTouched();
        }
      };
      AbstractControl.prototype.setParent = function(parent) {
        this._parent = parent;
      };
      AbstractControl.prototype.setValue = function(value, options) {};
      AbstractControl.prototype.patchValue = function(value, options) {};
      AbstractControl.prototype.reset = function(value, options) {};
      AbstractControl.prototype.updateValueAndValidity = function(opts) {
        if (opts === void 0) {
          opts = {};
        }
        this._setInitialStatus();
        this._updateValue();
        if (this.enabled) {
          this._cancelExistingSubscription();
          this._errors = this._runValidator();
          this._status = this._calculateStatus();
          if (this._status === VALID || this._status === PENDING) {
            this._runAsyncValidator(opts.emitEvent);
          }
        }
        if (opts.emitEvent !== false) {
          this._valueChanges.emit(this._value);
          this._statusChanges.emit(this._status);
        }
        if (this._parent && !opts.onlySelf) {
          this._parent.updateValueAndValidity(opts);
        }
      };
      AbstractControl.prototype._updateTreeValidity = function(opts) {
        if (opts === void 0) {
          opts = {emitEvent: true};
        }
        this._forEachChild(function(ctrl) {
          return ctrl._updateTreeValidity(opts);
        });
        this.updateValueAndValidity({
          onlySelf: true,
          emitEvent: opts.emitEvent
        });
      };
      AbstractControl.prototype._setInitialStatus = function() {
        this._status = this._allControlsDisabled() ? DISABLED : VALID;
      };
      AbstractControl.prototype._runValidator = function() {
        return this.validator ? this.validator(this) : null;
      };
      AbstractControl.prototype._runAsyncValidator = function(emitEvent) {
        var _this = this;
        if (this.asyncValidator) {
          this._status = PENDING;
          var obs = toObservable(this.asyncValidator(this));
          this._asyncValidationSubscription = obs.subscribe(function(errors) {
            return _this.setErrors(errors, {emitEvent: emitEvent});
          });
        }
      };
      AbstractControl.prototype._cancelExistingSubscription = function() {
        if (this._asyncValidationSubscription) {
          this._asyncValidationSubscription.unsubscribe();
        }
      };
      AbstractControl.prototype.setErrors = function(errors, opts) {
        if (opts === void 0) {
          opts = {};
        }
        this._errors = errors;
        this._updateControlsErrors(opts.emitEvent !== false);
      };
      AbstractControl.prototype.get = function(path) {
        return _find(this, path, '.');
      };
      AbstractControl.prototype.getError = function(errorCode, path) {
        var control = path ? this.get(path) : this;
        return control && control._errors ? control._errors[errorCode] : null;
      };
      AbstractControl.prototype.hasError = function(errorCode, path) {
        return !!this.getError(errorCode, path);
      };
      Object.defineProperty(AbstractControl.prototype, "root", {
        get: function() {
          var x = this;
          while (x._parent) {
            x = x._parent;
          }
          return x;
        },
        enumerable: true,
        configurable: true
      });
      AbstractControl.prototype._updateControlsErrors = function(emitEvent) {
        this._status = this._calculateStatus();
        if (emitEvent) {
          this._statusChanges.emit(this._status);
        }
        if (this._parent) {
          this._parent._updateControlsErrors(emitEvent);
        }
      };
      AbstractControl.prototype._initObservables = function() {
        this._valueChanges = new _angular_core.EventEmitter();
        this._statusChanges = new _angular_core.EventEmitter();
      };
      AbstractControl.prototype._calculateStatus = function() {
        if (this._allControlsDisabled())
          return DISABLED;
        if (this._errors)
          return INVALID;
        if (this._anyControlsHaveStatus(PENDING))
          return PENDING;
        if (this._anyControlsHaveStatus(INVALID))
          return INVALID;
        return VALID;
      };
      AbstractControl.prototype._updateValue = function() {};
      AbstractControl.prototype._forEachChild = function(cb) {};
      AbstractControl.prototype._anyControls = function(condition) {};
      AbstractControl.prototype._allControlsDisabled = function() {};
      AbstractControl.prototype._anyControlsHaveStatus = function(status) {
        return this._anyControls(function(control) {
          return control.status === status;
        });
      };
      AbstractControl.prototype._anyControlsDirty = function() {
        return this._anyControls(function(control) {
          return control.dirty;
        });
      };
      AbstractControl.prototype._anyControlsTouched = function() {
        return this._anyControls(function(control) {
          return control.touched;
        });
      };
      AbstractControl.prototype._updatePristine = function(opts) {
        if (opts === void 0) {
          opts = {};
        }
        this._pristine = !this._anyControlsDirty();
        if (this._parent && !opts.onlySelf) {
          this._parent._updatePristine(opts);
        }
      };
      AbstractControl.prototype._updateTouched = function(opts) {
        if (opts === void 0) {
          opts = {};
        }
        this._touched = this._anyControlsTouched();
        if (this._parent && !opts.onlySelf) {
          this._parent._updateTouched(opts);
        }
      };
      AbstractControl.prototype._isBoxedValue = function(formState) {
        return typeof formState === 'object' && formState !== null && Object.keys(formState).length === 2 && 'value' in formState && 'disabled' in formState;
      };
      AbstractControl.prototype._registerOnCollectionChange = function(fn) {
        this._onCollectionChange = fn;
      };
      return AbstractControl;
    }());
    var FormControl = (function(_super) {
      __extends(FormControl, _super);
      function FormControl(formState, validator, asyncValidator) {
        if (formState === void 0) {
          formState = null;
        }
        var _this = _super.call(this, coerceToValidator(validator), coerceToAsyncValidator(asyncValidator)) || this;
        _this._onChange = [];
        _this._applyFormState(formState);
        _this.updateValueAndValidity({
          onlySelf: true,
          emitEvent: false
        });
        _this._initObservables();
        return _this;
      }
      FormControl.prototype.setValue = function(value, options) {
        var _this = this;
        if (options === void 0) {
          options = {};
        }
        this._value = value;
        if (this._onChange.length && options.emitModelToViewChange !== false) {
          this._onChange.forEach(function(changeFn) {
            return changeFn(_this._value, options.emitViewToModelChange !== false);
          });
        }
        this.updateValueAndValidity(options);
      };
      FormControl.prototype.patchValue = function(value, options) {
        if (options === void 0) {
          options = {};
        }
        this.setValue(value, options);
      };
      FormControl.prototype.reset = function(formState, options) {
        if (formState === void 0) {
          formState = null;
        }
        if (options === void 0) {
          options = {};
        }
        this._applyFormState(formState);
        this.markAsPristine(options);
        this.markAsUntouched(options);
        this.setValue(this._value, options);
      };
      FormControl.prototype._updateValue = function() {};
      FormControl.prototype._anyControls = function(condition) {
        return false;
      };
      FormControl.prototype._allControlsDisabled = function() {
        return this.disabled;
      };
      FormControl.prototype.registerOnChange = function(fn) {
        this._onChange.push(fn);
      };
      FormControl.prototype._clearChangeFns = function() {
        this._onChange = [];
        this._onDisabledChange = [];
        this._onCollectionChange = function() {};
      };
      FormControl.prototype.registerOnDisabledChange = function(fn) {
        this._onDisabledChange.push(fn);
      };
      FormControl.prototype._forEachChild = function(cb) {};
      FormControl.prototype._applyFormState = function(formState) {
        if (this._isBoxedValue(formState)) {
          this._value = formState.value;
          formState.disabled ? this.disable({
            onlySelf: true,
            emitEvent: false
          }) : this.enable({
            onlySelf: true,
            emitEvent: false
          });
        } else {
          this._value = formState;
        }
      };
      return FormControl;
    }(AbstractControl));
    var FormGroup = (function(_super) {
      __extends(FormGroup, _super);
      function FormGroup(controls, validator, asyncValidator) {
        var _this = _super.call(this, validator || null, asyncValidator || null) || this;
        _this.controls = controls;
        _this._initObservables();
        _this._setUpControls();
        _this.updateValueAndValidity({
          onlySelf: true,
          emitEvent: false
        });
        return _this;
      }
      FormGroup.prototype.registerControl = function(name, control) {
        if (this.controls[name])
          return this.controls[name];
        this.controls[name] = control;
        control.setParent(this);
        control._registerOnCollectionChange(this._onCollectionChange);
        return control;
      };
      FormGroup.prototype.addControl = function(name, control) {
        this.registerControl(name, control);
        this.updateValueAndValidity();
        this._onCollectionChange();
      };
      FormGroup.prototype.removeControl = function(name) {
        if (this.controls[name])
          this.controls[name]._registerOnCollectionChange(function() {});
        delete(this.controls[name]);
        this.updateValueAndValidity();
        this._onCollectionChange();
      };
      FormGroup.prototype.setControl = function(name, control) {
        if (this.controls[name])
          this.controls[name]._registerOnCollectionChange(function() {});
        delete(this.controls[name]);
        if (control)
          this.registerControl(name, control);
        this.updateValueAndValidity();
        this._onCollectionChange();
      };
      FormGroup.prototype.contains = function(controlName) {
        return this.controls.hasOwnProperty(controlName) && this.controls[controlName].enabled;
      };
      FormGroup.prototype.setValue = function(value, options) {
        var _this = this;
        if (options === void 0) {
          options = {};
        }
        this._checkAllValuesPresent(value);
        Object.keys(value).forEach(function(name) {
          _this._throwIfControlMissing(name);
          _this.controls[name].setValue(value[name], {
            onlySelf: true,
            emitEvent: options.emitEvent
          });
        });
        this.updateValueAndValidity(options);
      };
      FormGroup.prototype.patchValue = function(value, options) {
        var _this = this;
        if (options === void 0) {
          options = {};
        }
        Object.keys(value).forEach(function(name) {
          if (_this.controls[name]) {
            _this.controls[name].patchValue(value[name], {
              onlySelf: true,
              emitEvent: options.emitEvent
            });
          }
        });
        this.updateValueAndValidity(options);
      };
      FormGroup.prototype.reset = function(value, options) {
        if (value === void 0) {
          value = {};
        }
        if (options === void 0) {
          options = {};
        }
        this._forEachChild(function(control, name) {
          control.reset(value[name], {
            onlySelf: true,
            emitEvent: options.emitEvent
          });
        });
        this.updateValueAndValidity(options);
        this._updatePristine(options);
        this._updateTouched(options);
      };
      FormGroup.prototype.getRawValue = function() {
        return this._reduceChildren({}, function(acc, control, name) {
          acc[name] = control instanceof FormControl ? control.value : ((control)).getRawValue();
          return acc;
        });
      };
      FormGroup.prototype._throwIfControlMissing = function(name) {
        if (!Object.keys(this.controls).length) {
          throw new Error("\n        There are no form controls registered with this group yet.  If you're using ngModel,\n        you may want to check next tick (e.g. use setTimeout).\n      ");
        }
        if (!this.controls[name]) {
          throw new Error("Cannot find form control with name: " + name + ".");
        }
      };
      FormGroup.prototype._forEachChild = function(cb) {
        var _this = this;
        Object.keys(this.controls).forEach(function(k) {
          return cb(_this.controls[k], k);
        });
      };
      FormGroup.prototype._setUpControls = function() {
        var _this = this;
        this._forEachChild(function(control) {
          control.setParent(_this);
          control._registerOnCollectionChange(_this._onCollectionChange);
        });
      };
      FormGroup.prototype._updateValue = function() {
        this._value = this._reduceValue();
      };
      FormGroup.prototype._anyControls = function(condition) {
        var _this = this;
        var res = false;
        this._forEachChild(function(control, name) {
          res = res || (_this.contains(name) && condition(control));
        });
        return res;
      };
      FormGroup.prototype._reduceValue = function() {
        var _this = this;
        return this._reduceChildren({}, function(acc, control, name) {
          if (control.enabled || _this.disabled) {
            acc[name] = control.value;
          }
          return acc;
        });
      };
      FormGroup.prototype._reduceChildren = function(initValue, fn) {
        var res = initValue;
        this._forEachChild(function(control, name) {
          res = fn(res, control, name);
        });
        return res;
      };
      FormGroup.prototype._allControlsDisabled = function() {
        for (var _i = 0,
            _a = Object.keys(this.controls); _i < _a.length; _i++) {
          var controlName = _a[_i];
          if (this.controls[controlName].enabled) {
            return false;
          }
        }
        return Object.keys(this.controls).length > 0 || this.disabled;
      };
      FormGroup.prototype._checkAllValuesPresent = function(value) {
        this._forEachChild(function(control, name) {
          if (value[name] === undefined) {
            throw new Error("Must supply a value for form control with name: '" + name + "'.");
          }
        });
      };
      return FormGroup;
    }(AbstractControl));
    var FormArray = (function(_super) {
      __extends(FormArray, _super);
      function FormArray(controls, validator, asyncValidator) {
        var _this = _super.call(this, validator || null, asyncValidator || null) || this;
        _this.controls = controls;
        _this._initObservables();
        _this._setUpControls();
        _this.updateValueAndValidity({
          onlySelf: true,
          emitEvent: false
        });
        return _this;
      }
      FormArray.prototype.at = function(index) {
        return this.controls[index];
      };
      FormArray.prototype.push = function(control) {
        this.controls.push(control);
        this._registerControl(control);
        this.updateValueAndValidity();
        this._onCollectionChange();
      };
      FormArray.prototype.insert = function(index, control) {
        this.controls.splice(index, 0, control);
        this._registerControl(control);
        this.updateValueAndValidity();
        this._onCollectionChange();
      };
      FormArray.prototype.removeAt = function(index) {
        if (this.controls[index])
          this.controls[index]._registerOnCollectionChange(function() {});
        this.controls.splice(index, 1);
        this.updateValueAndValidity();
        this._onCollectionChange();
      };
      FormArray.prototype.setControl = function(index, control) {
        if (this.controls[index])
          this.controls[index]._registerOnCollectionChange(function() {});
        this.controls.splice(index, 1);
        if (control) {
          this.controls.splice(index, 0, control);
          this._registerControl(control);
        }
        this.updateValueAndValidity();
        this._onCollectionChange();
      };
      Object.defineProperty(FormArray.prototype, "length", {
        get: function() {
          return this.controls.length;
        },
        enumerable: true,
        configurable: true
      });
      FormArray.prototype.setValue = function(value, options) {
        var _this = this;
        if (options === void 0) {
          options = {};
        }
        this._checkAllValuesPresent(value);
        value.forEach(function(newValue, index) {
          _this._throwIfControlMissing(index);
          _this.at(index).setValue(newValue, {
            onlySelf: true,
            emitEvent: options.emitEvent
          });
        });
        this.updateValueAndValidity(options);
      };
      FormArray.prototype.patchValue = function(value, options) {
        var _this = this;
        if (options === void 0) {
          options = {};
        }
        value.forEach(function(newValue, index) {
          if (_this.at(index)) {
            _this.at(index).patchValue(newValue, {
              onlySelf: true,
              emitEvent: options.emitEvent
            });
          }
        });
        this.updateValueAndValidity(options);
      };
      FormArray.prototype.reset = function(value, options) {
        if (value === void 0) {
          value = [];
        }
        if (options === void 0) {
          options = {};
        }
        this._forEachChild(function(control, index) {
          control.reset(value[index], {
            onlySelf: true,
            emitEvent: options.emitEvent
          });
        });
        this.updateValueAndValidity(options);
        this._updatePristine(options);
        this._updateTouched(options);
      };
      FormArray.prototype.getRawValue = function() {
        return this.controls.map(function(control) {
          return control instanceof FormControl ? control.value : ((control)).getRawValue();
        });
      };
      FormArray.prototype._throwIfControlMissing = function(index) {
        if (!this.controls.length) {
          throw new Error("\n        There are no form controls registered with this array yet.  If you're using ngModel,\n        you may want to check next tick (e.g. use setTimeout).\n      ");
        }
        if (!this.at(index)) {
          throw new Error("Cannot find form control at index " + index);
        }
      };
      FormArray.prototype._forEachChild = function(cb) {
        this.controls.forEach(function(control, index) {
          cb(control, index);
        });
      };
      FormArray.prototype._updateValue = function() {
        var _this = this;
        this._value = this.controls.filter(function(control) {
          return control.enabled || _this.disabled;
        }).map(function(control) {
          return control.value;
        });
      };
      FormArray.prototype._anyControls = function(condition) {
        return this.controls.some(function(control) {
          return control.enabled && condition(control);
        });
      };
      FormArray.prototype._setUpControls = function() {
        var _this = this;
        this._forEachChild(function(control) {
          return _this._registerControl(control);
        });
      };
      FormArray.prototype._checkAllValuesPresent = function(value) {
        this._forEachChild(function(control, i) {
          if (value[i] === undefined) {
            throw new Error("Must supply a value for form control at index: " + i + ".");
          }
        });
      };
      FormArray.prototype._allControlsDisabled = function() {
        for (var _i = 0,
            _a = this.controls; _i < _a.length; _i++) {
          var control = _a[_i];
          if (control.enabled)
            return false;
        }
        return this.controls.length > 0 || this.disabled;
      };
      FormArray.prototype._registerControl = function(control) {
        control.setParent(this);
        control._registerOnCollectionChange(this._onCollectionChange);
      };
      return FormArray;
    }(AbstractControl));
    var formDirectiveProvider = {
      provide: ControlContainer,
      useExisting: _angular_core.forwardRef(function() {
        return NgForm;
      })
    };
    var resolvedPromise = Promise.resolve(null);
    var NgForm = (function(_super) {
      __extends(NgForm, _super);
      function NgForm(validators, asyncValidators) {
        var _this = _super.call(this) || this;
        _this._submitted = false;
        _this.ngSubmit = new _angular_core.EventEmitter();
        _this.form = new FormGroup({}, composeValidators(validators), composeAsyncValidators(asyncValidators));
        return _this;
      }
      Object.defineProperty(NgForm.prototype, "submitted", {
        get: function() {
          return this._submitted;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(NgForm.prototype, "formDirective", {
        get: function() {
          return this;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(NgForm.prototype, "control", {
        get: function() {
          return this.form;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(NgForm.prototype, "path", {
        get: function() {
          return [];
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(NgForm.prototype, "controls", {
        get: function() {
          return this.form.controls;
        },
        enumerable: true,
        configurable: true
      });
      NgForm.prototype.addControl = function(dir) {
        var _this = this;
        resolvedPromise.then(function() {
          var container = _this._findContainer(dir.path);
          dir._control = (container.registerControl(dir.name, dir.control));
          setUpControl(dir.control, dir);
          dir.control.updateValueAndValidity({emitEvent: false});
        });
      };
      NgForm.prototype.getControl = function(dir) {
        return (this.form.get(dir.path));
      };
      NgForm.prototype.removeControl = function(dir) {
        var _this = this;
        resolvedPromise.then(function() {
          var container = _this._findContainer(dir.path);
          if (container) {
            container.removeControl(dir.name);
          }
        });
      };
      NgForm.prototype.addFormGroup = function(dir) {
        var _this = this;
        resolvedPromise.then(function() {
          var container = _this._findContainer(dir.path);
          var group = new FormGroup({});
          setUpFormContainer(group, dir);
          container.registerControl(dir.name, group);
          group.updateValueAndValidity({emitEvent: false});
        });
      };
      NgForm.prototype.removeFormGroup = function(dir) {
        var _this = this;
        resolvedPromise.then(function() {
          var container = _this._findContainer(dir.path);
          if (container) {
            container.removeControl(dir.name);
          }
        });
      };
      NgForm.prototype.getFormGroup = function(dir) {
        return (this.form.get(dir.path));
      };
      NgForm.prototype.updateModel = function(dir, value) {
        var _this = this;
        resolvedPromise.then(function() {
          var ctrl = (_this.form.get(((dir.path))));
          ctrl.setValue(value);
        });
      };
      NgForm.prototype.setValue = function(value) {
        this.control.setValue(value);
      };
      NgForm.prototype.onSubmit = function($event) {
        this._submitted = true;
        this.ngSubmit.emit($event);
        return false;
      };
      NgForm.prototype.onReset = function() {
        this.resetForm();
      };
      NgForm.prototype.resetForm = function(value) {
        if (value === void 0) {
          value = undefined;
        }
        this.form.reset(value);
        this._submitted = false;
      };
      NgForm.prototype._findContainer = function(path) {
        path.pop();
        return path.length ? (this.form.get(path)) : this.form;
      };
      return NgForm;
    }(ControlContainer));
    NgForm.decorators = [{
      type: _angular_core.Directive,
      args: [{
        selector: 'form:not([ngNoForm]):not([formGroup]),ngForm,[ngForm]',
        providers: [formDirectiveProvider],
        host: {
          '(submit)': 'onSubmit($event)',
          '(reset)': 'onReset()'
        },
        outputs: ['ngSubmit'],
        exportAs: 'ngForm'
      }]
    }];
    NgForm.ctorParameters = function() {
      return [{
        type: Array,
        decorators: [{type: _angular_core.Optional}, {type: _angular_core.Self}, {
          type: _angular_core.Inject,
          args: [NG_VALIDATORS]
        }]
      }, {
        type: Array,
        decorators: [{type: _angular_core.Optional}, {type: _angular_core.Self}, {
          type: _angular_core.Inject,
          args: [NG_ASYNC_VALIDATORS]
        }]
      }];
    };
    var FormErrorExamples = {
      formControlName: "\n    <div [formGroup]=\"myGroup\">\n      <input formControlName=\"firstName\">\n    </div>\n\n    In your class:\n\n    this.myGroup = new FormGroup({\n       firstName: new FormControl()\n    });",
      formGroupName: "\n    <div [formGroup]=\"myGroup\">\n       <div formGroupName=\"person\">\n          <input formControlName=\"firstName\">\n       </div>\n    </div>\n\n    In your class:\n\n    this.myGroup = new FormGroup({\n       person: new FormGroup({ firstName: new FormControl() })\n    });",
      formArrayName: "\n    <div [formGroup]=\"myGroup\">\n      <div formArrayName=\"cities\">\n        <div *ngFor=\"let city of cityArray.controls; index as i\">\n          <input [formControlName]=\"i\">\n        </div>\n      </div>\n    </div>\n\n    In your class:\n\n    this.cityArray = new FormArray([new FormControl('SF')]);\n    this.myGroup = new FormGroup({\n      cities: this.cityArray\n    });",
      ngModelGroup: "\n    <form>\n       <div ngModelGroup=\"person\">\n          <input [(ngModel)]=\"person.name\" name=\"firstName\">\n       </div>\n    </form>",
      ngModelWithFormGroup: "\n    <div [formGroup]=\"myGroup\">\n       <input formControlName=\"firstName\">\n       <input [(ngModel)]=\"showMoreControls\" [ngModelOptions]=\"{standalone: true}\">\n    </div>\n  "
    };
    var TemplateDrivenErrors = (function() {
      function TemplateDrivenErrors() {}
      TemplateDrivenErrors.modelParentException = function() {
        throw new Error("\n      ngModel cannot be used to register form controls with a parent formGroup directive.  Try using\n      formGroup's partner directive \"formControlName\" instead.  Example:\n\n      " + FormErrorExamples.formControlName + "\n\n      Or, if you'd like to avoid registering this form control, indicate that it's standalone in ngModelOptions:\n\n      Example:\n\n      " + FormErrorExamples.ngModelWithFormGroup);
      };
      TemplateDrivenErrors.formGroupNameException = function() {
        throw new Error("\n      ngModel cannot be used to register form controls with a parent formGroupName or formArrayName directive.\n\n      Option 1: Use formControlName instead of ngModel (reactive strategy):\n\n      " + FormErrorExamples.formGroupName + "\n\n      Option 2:  Update ngModel's parent be ngModelGroup (template-driven strategy):\n\n      " + FormErrorExamples.ngModelGroup);
      };
      TemplateDrivenErrors.missingNameException = function() {
        throw new Error("If ngModel is used within a form tag, either the name attribute must be set or the form\n      control must be defined as 'standalone' in ngModelOptions.\n\n      Example 1: <input [(ngModel)]=\"person.firstName\" name=\"first\">\n      Example 2: <input [(ngModel)]=\"person.firstName\" [ngModelOptions]=\"{standalone: true}\">");
      };
      TemplateDrivenErrors.modelGroupParentException = function() {
        throw new Error("\n      ngModelGroup cannot be used with a parent formGroup directive.\n\n      Option 1: Use formGroupName instead of ngModelGroup (reactive strategy):\n\n      " + FormErrorExamples.formGroupName + "\n\n      Option 2:  Use a regular form tag instead of the formGroup directive (template-driven strategy):\n\n      " + FormErrorExamples.ngModelGroup);
      };
      return TemplateDrivenErrors;
    }());
    var modelGroupProvider = {
      provide: ControlContainer,
      useExisting: _angular_core.forwardRef(function() {
        return NgModelGroup;
      })
    };
    var NgModelGroup = (function(_super) {
      __extends(NgModelGroup, _super);
      function NgModelGroup(parent, validators, asyncValidators) {
        var _this = _super.call(this) || this;
        _this._parent = parent;
        _this._validators = validators;
        _this._asyncValidators = asyncValidators;
        return _this;
      }
      NgModelGroup.prototype._checkParentType = function() {
        if (!(this._parent instanceof NgModelGroup) && !(this._parent instanceof NgForm)) {
          TemplateDrivenErrors.modelGroupParentException();
        }
      };
      return NgModelGroup;
    }(AbstractFormGroupDirective));
    NgModelGroup.decorators = [{
      type: _angular_core.Directive,
      args: [{
        selector: '[ngModelGroup]',
        providers: [modelGroupProvider],
        exportAs: 'ngModelGroup'
      }]
    }];
    NgModelGroup.ctorParameters = function() {
      return [{
        type: ControlContainer,
        decorators: [{type: _angular_core.Host}, {type: _angular_core.SkipSelf}]
      }, {
        type: Array,
        decorators: [{type: _angular_core.Optional}, {type: _angular_core.Self}, {
          type: _angular_core.Inject,
          args: [NG_VALIDATORS]
        }]
      }, {
        type: Array,
        decorators: [{type: _angular_core.Optional}, {type: _angular_core.Self}, {
          type: _angular_core.Inject,
          args: [NG_ASYNC_VALIDATORS]
        }]
      }];
    };
    NgModelGroup.propDecorators = {'name': [{
        type: _angular_core.Input,
        args: ['ngModelGroup']
      }]};
    var formControlBinding = {
      provide: NgControl,
      useExisting: _angular_core.forwardRef(function() {
        return NgModel;
      })
    };
    var resolvedPromise$1 = Promise.resolve(null);
    var NgModel = (function(_super) {
      __extends(NgModel, _super);
      function NgModel(parent, validators, asyncValidators, valueAccessors) {
        var _this = _super.call(this) || this;
        _this._control = new FormControl();
        _this._registered = false;
        _this.update = new _angular_core.EventEmitter();
        _this._parent = parent;
        _this._rawValidators = validators || [];
        _this._rawAsyncValidators = asyncValidators || [];
        _this.valueAccessor = selectValueAccessor(_this, valueAccessors);
        return _this;
      }
      NgModel.prototype.ngOnChanges = function(changes) {
        this._checkForErrors();
        if (!this._registered)
          this._setUpControl();
        if ('isDisabled' in changes) {
          this._updateDisabled(changes);
        }
        if (isPropertyUpdated(changes, this.viewModel)) {
          this._updateValue(this.model);
          this.viewModel = this.model;
        }
      };
      NgModel.prototype.ngOnDestroy = function() {
        this.formDirective && this.formDirective.removeControl(this);
      };
      Object.defineProperty(NgModel.prototype, "control", {
        get: function() {
          return this._control;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(NgModel.prototype, "path", {
        get: function() {
          return this._parent ? controlPath(this.name, this._parent) : [this.name];
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(NgModel.prototype, "formDirective", {
        get: function() {
          return this._parent ? this._parent.formDirective : null;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(NgModel.prototype, "validator", {
        get: function() {
          return composeValidators(this._rawValidators);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(NgModel.prototype, "asyncValidator", {
        get: function() {
          return composeAsyncValidators(this._rawAsyncValidators);
        },
        enumerable: true,
        configurable: true
      });
      NgModel.prototype.viewToModelUpdate = function(newValue) {
        this.viewModel = newValue;
        this.update.emit(newValue);
      };
      NgModel.prototype._setUpControl = function() {
        this._isStandalone() ? this._setUpStandalone() : this.formDirective.addControl(this);
        this._registered = true;
      };
      NgModel.prototype._isStandalone = function() {
        return !this._parent || !!(this.options && this.options.standalone);
      };
      NgModel.prototype._setUpStandalone = function() {
        setUpControl(this._control, this);
        this._control.updateValueAndValidity({emitEvent: false});
      };
      NgModel.prototype._checkForErrors = function() {
        if (!this._isStandalone()) {
          this._checkParentType();
        }
        this._checkName();
      };
      NgModel.prototype._checkParentType = function() {
        if (!(this._parent instanceof NgModelGroup) && this._parent instanceof AbstractFormGroupDirective) {
          TemplateDrivenErrors.formGroupNameException();
        } else if (!(this._parent instanceof NgModelGroup) && !(this._parent instanceof NgForm)) {
          TemplateDrivenErrors.modelParentException();
        }
      };
      NgModel.prototype._checkName = function() {
        if (this.options && this.options.name)
          this.name = this.options.name;
        if (!this._isStandalone() && !this.name) {
          TemplateDrivenErrors.missingNameException();
        }
      };
      NgModel.prototype._updateValue = function(value) {
        var _this = this;
        resolvedPromise$1.then(function() {
          _this.control.setValue(value, {emitViewToModelChange: false});
        });
      };
      NgModel.prototype._updateDisabled = function(changes) {
        var _this = this;
        var disabledValue = changes['isDisabled'].currentValue;
        var isDisabled = disabledValue === '' || (disabledValue && disabledValue !== 'false');
        resolvedPromise$1.then(function() {
          if (isDisabled && !_this.control.disabled) {
            _this.control.disable();
          } else if (!isDisabled && _this.control.disabled) {
            _this.control.enable();
          }
        });
      };
      return NgModel;
    }(NgControl));
    NgModel.decorators = [{
      type: _angular_core.Directive,
      args: [{
        selector: '[ngModel]:not([formControlName]):not([formControl])',
        providers: [formControlBinding],
        exportAs: 'ngModel'
      }]
    }];
    NgModel.ctorParameters = function() {
      return [{
        type: ControlContainer,
        decorators: [{type: _angular_core.Optional}, {type: _angular_core.Host}]
      }, {
        type: Array,
        decorators: [{type: _angular_core.Optional}, {type: _angular_core.Self}, {
          type: _angular_core.Inject,
          args: [NG_VALIDATORS]
        }]
      }, {
        type: Array,
        decorators: [{type: _angular_core.Optional}, {type: _angular_core.Self}, {
          type: _angular_core.Inject,
          args: [NG_ASYNC_VALIDATORS]
        }]
      }, {
        type: Array,
        decorators: [{type: _angular_core.Optional}, {type: _angular_core.Self}, {
          type: _angular_core.Inject,
          args: [NG_VALUE_ACCESSOR]
        }]
      }];
    };
    NgModel.propDecorators = {
      'name': [{type: _angular_core.Input}],
      'isDisabled': [{
        type: _angular_core.Input,
        args: ['disabled']
      }],
      'model': [{
        type: _angular_core.Input,
        args: ['ngModel']
      }],
      'options': [{
        type: _angular_core.Input,
        args: ['ngModelOptions']
      }],
      'update': [{
        type: _angular_core.Output,
        args: ['ngModelChange']
      }]
    };
    var ReactiveErrors = (function() {
      function ReactiveErrors() {}
      ReactiveErrors.controlParentException = function() {
        throw new Error("formControlName must be used with a parent formGroup directive.  You'll want to add a formGroup\n       directive and pass it an existing FormGroup instance (you can create one in your class).\n\n      Example:\n\n      " + FormErrorExamples.formControlName);
      };
      ReactiveErrors.ngModelGroupException = function() {
        throw new Error("formControlName cannot be used with an ngModelGroup parent. It is only compatible with parents\n       that also have a \"form\" prefix: formGroupName, formArrayName, or formGroup.\n\n       Option 1:  Update the parent to be formGroupName (reactive form strategy)\n\n        " + FormErrorExamples.formGroupName + "\n\n        Option 2: Use ngModel instead of formControlName (template-driven strategy)\n\n        " + FormErrorExamples.ngModelGroup);
      };
      ReactiveErrors.missingFormException = function() {
        throw new Error("formGroup expects a FormGroup instance. Please pass one in.\n\n       Example:\n\n       " + FormErrorExamples.formControlName);
      };
      ReactiveErrors.groupParentException = function() {
        throw new Error("formGroupName must be used with a parent formGroup directive.  You'll want to add a formGroup\n      directive and pass it an existing FormGroup instance (you can create one in your class).\n\n      Example:\n\n      " + FormErrorExamples.formGroupName);
      };
      ReactiveErrors.arrayParentException = function() {
        throw new Error("formArrayName must be used with a parent formGroup directive.  You'll want to add a formGroup\n       directive and pass it an existing FormGroup instance (you can create one in your class).\n\n        Example:\n\n        " + FormErrorExamples.formArrayName);
      };
      ReactiveErrors.disabledAttrWarning = function() {
        console.warn("\n      It looks like you're using the disabled attribute with a reactive form directive. If you set disabled to true\n      when you set up this control in your component class, the disabled attribute will actually be set in the DOM for\n      you. We recommend using this approach to avoid 'changed after checked' errors.\n       \n      Example: \n      form = new FormGroup({\n        first: new FormControl({value: 'Nancy', disabled: true}, Validators.required),\n        last: new FormControl('Drew', Validators.required)\n      });\n    ");
      };
      return ReactiveErrors;
    }());
    var formControlBinding$1 = {
      provide: NgControl,
      useExisting: _angular_core.forwardRef(function() {
        return FormControlDirective;
      })
    };
    var FormControlDirective = (function(_super) {
      __extends(FormControlDirective, _super);
      function FormControlDirective(validators, asyncValidators, valueAccessors) {
        var _this = _super.call(this) || this;
        _this.update = new _angular_core.EventEmitter();
        _this._rawValidators = validators || [];
        _this._rawAsyncValidators = asyncValidators || [];
        _this.valueAccessor = selectValueAccessor(_this, valueAccessors);
        return _this;
      }
      Object.defineProperty(FormControlDirective.prototype, "isDisabled", {
        set: function(isDisabled) {
          ReactiveErrors.disabledAttrWarning();
        },
        enumerable: true,
        configurable: true
      });
      FormControlDirective.prototype.ngOnChanges = function(changes) {
        if (this._isControlChanged(changes)) {
          setUpControl(this.form, this);
          if (this.control.disabled && ((this.valueAccessor)).setDisabledState) {
            ((((this.valueAccessor)).setDisabledState))(true);
          }
          this.form.updateValueAndValidity({emitEvent: false});
        }
        if (isPropertyUpdated(changes, this.viewModel)) {
          this.form.setValue(this.model);
          this.viewModel = this.model;
        }
      };
      Object.defineProperty(FormControlDirective.prototype, "path", {
        get: function() {
          return [];
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(FormControlDirective.prototype, "validator", {
        get: function() {
          return composeValidators(this._rawValidators);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(FormControlDirective.prototype, "asyncValidator", {
        get: function() {
          return composeAsyncValidators(this._rawAsyncValidators);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(FormControlDirective.prototype, "control", {
        get: function() {
          return this.form;
        },
        enumerable: true,
        configurable: true
      });
      FormControlDirective.prototype.viewToModelUpdate = function(newValue) {
        this.viewModel = newValue;
        this.update.emit(newValue);
      };
      FormControlDirective.prototype._isControlChanged = function(changes) {
        return changes.hasOwnProperty('form');
      };
      return FormControlDirective;
    }(NgControl));
    FormControlDirective.decorators = [{
      type: _angular_core.Directive,
      args: [{
        selector: '[formControl]',
        providers: [formControlBinding$1],
        exportAs: 'ngForm'
      }]
    }];
    FormControlDirective.ctorParameters = function() {
      return [{
        type: Array,
        decorators: [{type: _angular_core.Optional}, {type: _angular_core.Self}, {
          type: _angular_core.Inject,
          args: [NG_VALIDATORS]
        }]
      }, {
        type: Array,
        decorators: [{type: _angular_core.Optional}, {type: _angular_core.Self}, {
          type: _angular_core.Inject,
          args: [NG_ASYNC_VALIDATORS]
        }]
      }, {
        type: Array,
        decorators: [{type: _angular_core.Optional}, {type: _angular_core.Self}, {
          type: _angular_core.Inject,
          args: [NG_VALUE_ACCESSOR]
        }]
      }];
    };
    FormControlDirective.propDecorators = {
      'form': [{
        type: _angular_core.Input,
        args: ['formControl']
      }],
      'model': [{
        type: _angular_core.Input,
        args: ['ngModel']
      }],
      'update': [{
        type: _angular_core.Output,
        args: ['ngModelChange']
      }],
      'isDisabled': [{
        type: _angular_core.Input,
        args: ['disabled']
      }]
    };
    var formDirectiveProvider$1 = {
      provide: ControlContainer,
      useExisting: _angular_core.forwardRef(function() {
        return FormGroupDirective;
      })
    };
    var FormGroupDirective = (function(_super) {
      __extends(FormGroupDirective, _super);
      function FormGroupDirective(_validators, _asyncValidators) {
        var _this = _super.call(this) || this;
        _this._validators = _validators;
        _this._asyncValidators = _asyncValidators;
        _this._submitted = false;
        _this.directives = [];
        _this.form = ((null));
        _this.ngSubmit = new _angular_core.EventEmitter();
        return _this;
      }
      FormGroupDirective.prototype.ngOnChanges = function(changes) {
        this._checkFormPresent();
        if (changes.hasOwnProperty('form')) {
          this._updateValidators();
          this._updateDomValue();
          this._updateRegistrations();
        }
      };
      Object.defineProperty(FormGroupDirective.prototype, "submitted", {
        get: function() {
          return this._submitted;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(FormGroupDirective.prototype, "formDirective", {
        get: function() {
          return this;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(FormGroupDirective.prototype, "control", {
        get: function() {
          return this.form;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(FormGroupDirective.prototype, "path", {
        get: function() {
          return [];
        },
        enumerable: true,
        configurable: true
      });
      FormGroupDirective.prototype.addControl = function(dir) {
        var ctrl = this.form.get(dir.path);
        setUpControl(ctrl, dir);
        ctrl.updateValueAndValidity({emitEvent: false});
        this.directives.push(dir);
        return ctrl;
      };
      FormGroupDirective.prototype.getControl = function(dir) {
        return (this.form.get(dir.path));
      };
      FormGroupDirective.prototype.removeControl = function(dir) {
        remove(this.directives, dir);
      };
      FormGroupDirective.prototype.addFormGroup = function(dir) {
        var ctrl = this.form.get(dir.path);
        setUpFormContainer(ctrl, dir);
        ctrl.updateValueAndValidity({emitEvent: false});
      };
      FormGroupDirective.prototype.removeFormGroup = function(dir) {};
      FormGroupDirective.prototype.getFormGroup = function(dir) {
        return (this.form.get(dir.path));
      };
      FormGroupDirective.prototype.addFormArray = function(dir) {
        var ctrl = this.form.get(dir.path);
        setUpFormContainer(ctrl, dir);
        ctrl.updateValueAndValidity({emitEvent: false});
      };
      FormGroupDirective.prototype.removeFormArray = function(dir) {};
      FormGroupDirective.prototype.getFormArray = function(dir) {
        return (this.form.get(dir.path));
      };
      FormGroupDirective.prototype.updateModel = function(dir, value) {
        var ctrl = (this.form.get(dir.path));
        ctrl.setValue(value);
      };
      FormGroupDirective.prototype.onSubmit = function($event) {
        this._submitted = true;
        this.ngSubmit.emit($event);
        return false;
      };
      FormGroupDirective.prototype.onReset = function() {
        this.resetForm();
      };
      FormGroupDirective.prototype.resetForm = function(value) {
        if (value === void 0) {
          value = undefined;
        }
        this.form.reset(value);
        this._submitted = false;
      };
      FormGroupDirective.prototype._updateDomValue = function() {
        var _this = this;
        this.directives.forEach(function(dir) {
          var newCtrl = _this.form.get(dir.path);
          if (dir._control !== newCtrl) {
            cleanUpControl(dir._control, dir);
            if (newCtrl)
              setUpControl(newCtrl, dir);
            dir._control = newCtrl;
          }
        });
        this.form._updateTreeValidity({emitEvent: false});
      };
      FormGroupDirective.prototype._updateRegistrations = function() {
        var _this = this;
        this.form._registerOnCollectionChange(function() {
          return _this._updateDomValue();
        });
        if (this._oldForm)
          this._oldForm._registerOnCollectionChange(function() {});
        this._oldForm = this.form;
      };
      FormGroupDirective.prototype._updateValidators = function() {
        var sync = composeValidators(this._validators);
        this.form.validator = Validators.compose([((this.form.validator)), ((sync))]);
        var async = composeAsyncValidators(this._asyncValidators);
        this.form.asyncValidator = Validators.composeAsync([((this.form.asyncValidator)), ((async))]);
      };
      FormGroupDirective.prototype._checkFormPresent = function() {
        if (!this.form) {
          ReactiveErrors.missingFormException();
        }
      };
      return FormGroupDirective;
    }(ControlContainer));
    FormGroupDirective.decorators = [{
      type: _angular_core.Directive,
      args: [{
        selector: '[formGroup]',
        providers: [formDirectiveProvider$1],
        host: {
          '(submit)': 'onSubmit($event)',
          '(reset)': 'onReset()'
        },
        exportAs: 'ngForm'
      }]
    }];
    FormGroupDirective.ctorParameters = function() {
      return [{
        type: Array,
        decorators: [{type: _angular_core.Optional}, {type: _angular_core.Self}, {
          type: _angular_core.Inject,
          args: [NG_VALIDATORS]
        }]
      }, {
        type: Array,
        decorators: [{type: _angular_core.Optional}, {type: _angular_core.Self}, {
          type: _angular_core.Inject,
          args: [NG_ASYNC_VALIDATORS]
        }]
      }];
    };
    FormGroupDirective.propDecorators = {
      'form': [{
        type: _angular_core.Input,
        args: ['formGroup']
      }],
      'ngSubmit': [{type: _angular_core.Output}]
    };
    function remove(list, el) {
      var index = list.indexOf(el);
      if (index > -1) {
        list.splice(index, 1);
      }
    }
    var formGroupNameProvider = {
      provide: ControlContainer,
      useExisting: _angular_core.forwardRef(function() {
        return FormGroupName;
      })
    };
    var FormGroupName = (function(_super) {
      __extends(FormGroupName, _super);
      function FormGroupName(parent, validators, asyncValidators) {
        var _this = _super.call(this) || this;
        _this._parent = parent;
        _this._validators = validators;
        _this._asyncValidators = asyncValidators;
        return _this;
      }
      FormGroupName.prototype._checkParentType = function() {
        if (_hasInvalidParent(this._parent)) {
          ReactiveErrors.groupParentException();
        }
      };
      return FormGroupName;
    }(AbstractFormGroupDirective));
    FormGroupName.decorators = [{
      type: _angular_core.Directive,
      args: [{
        selector: '[formGroupName]',
        providers: [formGroupNameProvider]
      }]
    }];
    FormGroupName.ctorParameters = function() {
      return [{
        type: ControlContainer,
        decorators: [{type: _angular_core.Optional}, {type: _angular_core.Host}, {type: _angular_core.SkipSelf}]
      }, {
        type: Array,
        decorators: [{type: _angular_core.Optional}, {type: _angular_core.Self}, {
          type: _angular_core.Inject,
          args: [NG_VALIDATORS]
        }]
      }, {
        type: Array,
        decorators: [{type: _angular_core.Optional}, {type: _angular_core.Self}, {
          type: _angular_core.Inject,
          args: [NG_ASYNC_VALIDATORS]
        }]
      }];
    };
    FormGroupName.propDecorators = {'name': [{
        type: _angular_core.Input,
        args: ['formGroupName']
      }]};
    var formArrayNameProvider = {
      provide: ControlContainer,
      useExisting: _angular_core.forwardRef(function() {
        return FormArrayName;
      })
    };
    var FormArrayName = (function(_super) {
      __extends(FormArrayName, _super);
      function FormArrayName(parent, validators, asyncValidators) {
        var _this = _super.call(this) || this;
        _this._parent = parent;
        _this._validators = validators;
        _this._asyncValidators = asyncValidators;
        return _this;
      }
      FormArrayName.prototype.ngOnInit = function() {
        this._checkParentType();
        ((this.formDirective)).addFormArray(this);
      };
      FormArrayName.prototype.ngOnDestroy = function() {
        if (this.formDirective) {
          this.formDirective.removeFormArray(this);
        }
      };
      Object.defineProperty(FormArrayName.prototype, "control", {
        get: function() {
          return ((this.formDirective)).getFormArray(this);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(FormArrayName.prototype, "formDirective", {
        get: function() {
          return this._parent ? (this._parent.formDirective) : null;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(FormArrayName.prototype, "path", {
        get: function() {
          return controlPath(this.name, this._parent);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(FormArrayName.prototype, "validator", {
        get: function() {
          return composeValidators(this._validators);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(FormArrayName.prototype, "asyncValidator", {
        get: function() {
          return composeAsyncValidators(this._asyncValidators);
        },
        enumerable: true,
        configurable: true
      });
      FormArrayName.prototype._checkParentType = function() {
        if (_hasInvalidParent(this._parent)) {
          ReactiveErrors.arrayParentException();
        }
      };
      return FormArrayName;
    }(ControlContainer));
    FormArrayName.decorators = [{
      type: _angular_core.Directive,
      args: [{
        selector: '[formArrayName]',
        providers: [formArrayNameProvider]
      }]
    }];
    FormArrayName.ctorParameters = function() {
      return [{
        type: ControlContainer,
        decorators: [{type: _angular_core.Optional}, {type: _angular_core.Host}, {type: _angular_core.SkipSelf}]
      }, {
        type: Array,
        decorators: [{type: _angular_core.Optional}, {type: _angular_core.Self}, {
          type: _angular_core.Inject,
          args: [NG_VALIDATORS]
        }]
      }, {
        type: Array,
        decorators: [{type: _angular_core.Optional}, {type: _angular_core.Self}, {
          type: _angular_core.Inject,
          args: [NG_ASYNC_VALIDATORS]
        }]
      }];
    };
    FormArrayName.propDecorators = {'name': [{
        type: _angular_core.Input,
        args: ['formArrayName']
      }]};
    function _hasInvalidParent(parent) {
      return !(parent instanceof FormGroupName) && !(parent instanceof FormGroupDirective) && !(parent instanceof FormArrayName);
    }
    var controlNameBinding = {
      provide: NgControl,
      useExisting: _angular_core.forwardRef(function() {
        return FormControlName;
      })
    };
    var FormControlName = (function(_super) {
      __extends(FormControlName, _super);
      function FormControlName(parent, validators, asyncValidators, valueAccessors) {
        var _this = _super.call(this) || this;
        _this._added = false;
        _this.update = new _angular_core.EventEmitter();
        _this._parent = parent;
        _this._rawValidators = validators || [];
        _this._rawAsyncValidators = asyncValidators || [];
        _this.valueAccessor = selectValueAccessor(_this, valueAccessors);
        return _this;
      }
      Object.defineProperty(FormControlName.prototype, "isDisabled", {
        set: function(isDisabled) {
          ReactiveErrors.disabledAttrWarning();
        },
        enumerable: true,
        configurable: true
      });
      FormControlName.prototype.ngOnChanges = function(changes) {
        if (!this._added)
          this._setUpControl();
        if (isPropertyUpdated(changes, this.viewModel)) {
          this.viewModel = this.model;
          this.formDirective.updateModel(this, this.model);
        }
      };
      FormControlName.prototype.ngOnDestroy = function() {
        if (this.formDirective) {
          this.formDirective.removeControl(this);
        }
      };
      FormControlName.prototype.viewToModelUpdate = function(newValue) {
        this.viewModel = newValue;
        this.update.emit(newValue);
      };
      Object.defineProperty(FormControlName.prototype, "path", {
        get: function() {
          return controlPath(this.name, ((this._parent)));
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(FormControlName.prototype, "formDirective", {
        get: function() {
          return this._parent ? this._parent.formDirective : null;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(FormControlName.prototype, "validator", {
        get: function() {
          return composeValidators(this._rawValidators);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(FormControlName.prototype, "asyncValidator", {
        get: function() {
          return ((composeAsyncValidators(this._rawAsyncValidators)));
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(FormControlName.prototype, "control", {
        get: function() {
          return this._control;
        },
        enumerable: true,
        configurable: true
      });
      FormControlName.prototype._checkParentType = function() {
        if (!(this._parent instanceof FormGroupName) && this._parent instanceof AbstractFormGroupDirective) {
          ReactiveErrors.ngModelGroupException();
        } else if (!(this._parent instanceof FormGroupName) && !(this._parent instanceof FormGroupDirective) && !(this._parent instanceof FormArrayName)) {
          ReactiveErrors.controlParentException();
        }
      };
      FormControlName.prototype._setUpControl = function() {
        this._checkParentType();
        this._control = this.formDirective.addControl(this);
        if (this.control.disabled && ((this.valueAccessor)).setDisabledState) {
          ((((this.valueAccessor)).setDisabledState))(true);
        }
        this._added = true;
      };
      return FormControlName;
    }(NgControl));
    FormControlName.decorators = [{
      type: _angular_core.Directive,
      args: [{
        selector: '[formControlName]',
        providers: [controlNameBinding]
      }]
    }];
    FormControlName.ctorParameters = function() {
      return [{
        type: ControlContainer,
        decorators: [{type: _angular_core.Optional}, {type: _angular_core.Host}, {type: _angular_core.SkipSelf}]
      }, {
        type: Array,
        decorators: [{type: _angular_core.Optional}, {type: _angular_core.Self}, {
          type: _angular_core.Inject,
          args: [NG_VALIDATORS]
        }]
      }, {
        type: Array,
        decorators: [{type: _angular_core.Optional}, {type: _angular_core.Self}, {
          type: _angular_core.Inject,
          args: [NG_ASYNC_VALIDATORS]
        }]
      }, {
        type: Array,
        decorators: [{type: _angular_core.Optional}, {type: _angular_core.Self}, {
          type: _angular_core.Inject,
          args: [NG_VALUE_ACCESSOR]
        }]
      }];
    };
    FormControlName.propDecorators = {
      'name': [{
        type: _angular_core.Input,
        args: ['formControlName']
      }],
      'model': [{
        type: _angular_core.Input,
        args: ['ngModel']
      }],
      'update': [{
        type: _angular_core.Output,
        args: ['ngModelChange']
      }],
      'isDisabled': [{
        type: _angular_core.Input,
        args: ['disabled']
      }]
    };
    var REQUIRED_VALIDATOR = {
      provide: NG_VALIDATORS,
      useExisting: _angular_core.forwardRef(function() {
        return RequiredValidator;
      }),
      multi: true
    };
    var CHECKBOX_REQUIRED_VALIDATOR = {
      provide: NG_VALIDATORS,
      useExisting: _angular_core.forwardRef(function() {
        return CheckboxRequiredValidator;
      }),
      multi: true
    };
    var RequiredValidator = (function() {
      function RequiredValidator() {}
      Object.defineProperty(RequiredValidator.prototype, "required", {
        get: function() {
          return this._required;
        },
        set: function(value) {
          this._required = value != null && value !== false && "" + value !== 'false';
          if (this._onChange)
            this._onChange();
        },
        enumerable: true,
        configurable: true
      });
      RequiredValidator.prototype.validate = function(c) {
        return this.required ? Validators.required(c) : null;
      };
      RequiredValidator.prototype.registerOnValidatorChange = function(fn) {
        this._onChange = fn;
      };
      return RequiredValidator;
    }());
    RequiredValidator.decorators = [{
      type: _angular_core.Directive,
      args: [{
        selector: ':not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]',
        providers: [REQUIRED_VALIDATOR],
        host: {'[attr.required]': 'required ? "" : null'}
      }]
    }];
    RequiredValidator.ctorParameters = function() {
      return [];
    };
    RequiredValidator.propDecorators = {'required': [{type: _angular_core.Input}]};
    var CheckboxRequiredValidator = (function(_super) {
      __extends(CheckboxRequiredValidator, _super);
      function CheckboxRequiredValidator() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      CheckboxRequiredValidator.prototype.validate = function(c) {
        return this.required ? Validators.requiredTrue(c) : null;
      };
      return CheckboxRequiredValidator;
    }(RequiredValidator));
    CheckboxRequiredValidator.decorators = [{
      type: _angular_core.Directive,
      args: [{
        selector: 'input[type=checkbox][required][formControlName],input[type=checkbox][required][formControl],input[type=checkbox][required][ngModel]',
        providers: [CHECKBOX_REQUIRED_VALIDATOR],
        host: {'[attr.required]': 'required ? "" : null'}
      }]
    }];
    CheckboxRequiredValidator.ctorParameters = function() {
      return [];
    };
    var EMAIL_VALIDATOR = {
      provide: NG_VALIDATORS,
      useExisting: _angular_core.forwardRef(function() {
        return EmailValidator;
      }),
      multi: true
    };
    var EmailValidator = (function() {
      function EmailValidator() {}
      Object.defineProperty(EmailValidator.prototype, "email", {
        set: function(value) {
          this._enabled = value === '' || value === true || value === 'true';
          if (this._onChange)
            this._onChange();
        },
        enumerable: true,
        configurable: true
      });
      EmailValidator.prototype.validate = function(c) {
        return this._enabled ? Validators.email(c) : null;
      };
      EmailValidator.prototype.registerOnValidatorChange = function(fn) {
        this._onChange = fn;
      };
      return EmailValidator;
    }());
    EmailValidator.decorators = [{
      type: _angular_core.Directive,
      args: [{
        selector: '[email][formControlName],[email][formControl],[email][ngModel]',
        providers: [EMAIL_VALIDATOR]
      }]
    }];
    EmailValidator.ctorParameters = function() {
      return [];
    };
    EmailValidator.propDecorators = {'email': [{type: _angular_core.Input}]};
    var MIN_LENGTH_VALIDATOR = {
      provide: NG_VALIDATORS,
      useExisting: _angular_core.forwardRef(function() {
        return MinLengthValidator;
      }),
      multi: true
    };
    var MinLengthValidator = (function() {
      function MinLengthValidator() {}
      MinLengthValidator.prototype.ngOnChanges = function(changes) {
        if ('minlength' in changes) {
          this._createValidator();
          if (this._onChange)
            this._onChange();
        }
      };
      MinLengthValidator.prototype.validate = function(c) {
        return this.minlength == null ? null : this._validator(c);
      };
      MinLengthValidator.prototype.registerOnValidatorChange = function(fn) {
        this._onChange = fn;
      };
      MinLengthValidator.prototype._createValidator = function() {
        this._validator = Validators.minLength(parseInt(this.minlength, 10));
      };
      return MinLengthValidator;
    }());
    MinLengthValidator.decorators = [{
      type: _angular_core.Directive,
      args: [{
        selector: '[minlength][formControlName],[minlength][formControl],[minlength][ngModel]',
        providers: [MIN_LENGTH_VALIDATOR],
        host: {'[attr.minlength]': 'minlength ? minlength : null'}
      }]
    }];
    MinLengthValidator.ctorParameters = function() {
      return [];
    };
    MinLengthValidator.propDecorators = {'minlength': [{type: _angular_core.Input}]};
    var MAX_LENGTH_VALIDATOR = {
      provide: NG_VALIDATORS,
      useExisting: _angular_core.forwardRef(function() {
        return MaxLengthValidator;
      }),
      multi: true
    };
    var MaxLengthValidator = (function() {
      function MaxLengthValidator() {}
      MaxLengthValidator.prototype.ngOnChanges = function(changes) {
        if ('maxlength' in changes) {
          this._createValidator();
          if (this._onChange)
            this._onChange();
        }
      };
      MaxLengthValidator.prototype.validate = function(c) {
        return this.maxlength != null ? this._validator(c) : null;
      };
      MaxLengthValidator.prototype.registerOnValidatorChange = function(fn) {
        this._onChange = fn;
      };
      MaxLengthValidator.prototype._createValidator = function() {
        this._validator = Validators.maxLength(parseInt(this.maxlength, 10));
      };
      return MaxLengthValidator;
    }());
    MaxLengthValidator.decorators = [{
      type: _angular_core.Directive,
      args: [{
        selector: '[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]',
        providers: [MAX_LENGTH_VALIDATOR],
        host: {'[attr.maxlength]': 'maxlength ? maxlength : null'}
      }]
    }];
    MaxLengthValidator.ctorParameters = function() {
      return [];
    };
    MaxLengthValidator.propDecorators = {'maxlength': [{type: _angular_core.Input}]};
    var PATTERN_VALIDATOR = {
      provide: NG_VALIDATORS,
      useExisting: _angular_core.forwardRef(function() {
        return PatternValidator;
      }),
      multi: true
    };
    var PatternValidator = (function() {
      function PatternValidator() {}
      PatternValidator.prototype.ngOnChanges = function(changes) {
        if ('pattern' in changes) {
          this._createValidator();
          if (this._onChange)
            this._onChange();
        }
      };
      PatternValidator.prototype.validate = function(c) {
        return this._validator(c);
      };
      PatternValidator.prototype.registerOnValidatorChange = function(fn) {
        this._onChange = fn;
      };
      PatternValidator.prototype._createValidator = function() {
        this._validator = Validators.pattern(this.pattern);
      };
      return PatternValidator;
    }());
    PatternValidator.decorators = [{
      type: _angular_core.Directive,
      args: [{
        selector: '[pattern][formControlName],[pattern][formControl],[pattern][ngModel]',
        providers: [PATTERN_VALIDATOR],
        host: {'[attr.pattern]': 'pattern ? pattern : null'}
      }]
    }];
    PatternValidator.ctorParameters = function() {
      return [];
    };
    PatternValidator.propDecorators = {'pattern': [{type: _angular_core.Input}]};
    var FormBuilder = (function() {
      function FormBuilder() {}
      FormBuilder.prototype.group = function(controlsConfig, extra) {
        if (extra === void 0) {
          extra = null;
        }
        var controls = this._reduceControls(controlsConfig);
        var validator = extra != null ? extra['validator'] : null;
        var asyncValidator = extra != null ? extra['asyncValidator'] : null;
        return new FormGroup(controls, validator, asyncValidator);
      };
      FormBuilder.prototype.control = function(formState, validator, asyncValidator) {
        return new FormControl(formState, validator, asyncValidator);
      };
      FormBuilder.prototype.array = function(controlsConfig, validator, asyncValidator) {
        var _this = this;
        var controls = controlsConfig.map(function(c) {
          return _this._createControl(c);
        });
        return new FormArray(controls, validator, asyncValidator);
      };
      FormBuilder.prototype._reduceControls = function(controlsConfig) {
        var _this = this;
        var controls = {};
        Object.keys(controlsConfig).forEach(function(controlName) {
          controls[controlName] = _this._createControl(controlsConfig[controlName]);
        });
        return controls;
      };
      FormBuilder.prototype._createControl = function(controlConfig) {
        if (controlConfig instanceof FormControl || controlConfig instanceof FormGroup || controlConfig instanceof FormArray) {
          return controlConfig;
        } else if (Array.isArray(controlConfig)) {
          var value = controlConfig[0];
          var validator = controlConfig.length > 1 ? controlConfig[1] : null;
          var asyncValidator = controlConfig.length > 2 ? controlConfig[2] : null;
          return this.control(value, validator, asyncValidator);
        } else {
          return this.control(controlConfig);
        }
      };
      return FormBuilder;
    }());
    FormBuilder.decorators = [{type: _angular_core.Injectable}];
    FormBuilder.ctorParameters = function() {
      return [];
    };
    var VERSION = new _angular_core.Version('4.2.5');
    var NgNoValidate = (function() {
      function NgNoValidate() {}
      return NgNoValidate;
    }());
    NgNoValidate.decorators = [{
      type: _angular_core.Directive,
      args: [{
        selector: 'form:not([ngNoForm]):not([ngNativeValidate])',
        host: {'novalidate': ''}
      }]
    }];
    NgNoValidate.ctorParameters = function() {
      return [];
    };
    var SHARED_FORM_DIRECTIVES = [NgNoValidate, NgSelectOption, NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, RangeValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, SelectMultipleControlValueAccessor, RadioControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MinLengthValidator, MaxLengthValidator, PatternValidator, CheckboxRequiredValidator, EmailValidator];
    var TEMPLATE_DRIVEN_DIRECTIVES = [NgModel, NgModelGroup, NgForm];
    var REACTIVE_DRIVEN_DIRECTIVES = [FormControlDirective, FormGroupDirective, FormControlName, FormGroupName, FormArrayName];
    var InternalFormsSharedModule = (function() {
      function InternalFormsSharedModule() {}
      return InternalFormsSharedModule;
    }());
    InternalFormsSharedModule.decorators = [{
      type: _angular_core.NgModule,
      args: [{
        declarations: SHARED_FORM_DIRECTIVES,
        exports: SHARED_FORM_DIRECTIVES
      }]
    }];
    InternalFormsSharedModule.ctorParameters = function() {
      return [];
    };
    var FormsModule = (function() {
      function FormsModule() {}
      return FormsModule;
    }());
    FormsModule.decorators = [{
      type: _angular_core.NgModule,
      args: [{
        declarations: TEMPLATE_DRIVEN_DIRECTIVES,
        providers: [RadioControlRegistry],
        exports: [InternalFormsSharedModule, TEMPLATE_DRIVEN_DIRECTIVES]
      }]
    }];
    FormsModule.ctorParameters = function() {
      return [];
    };
    var ReactiveFormsModule = (function() {
      function ReactiveFormsModule() {}
      return ReactiveFormsModule;
    }());
    ReactiveFormsModule.decorators = [{
      type: _angular_core.NgModule,
      args: [{
        declarations: [REACTIVE_DRIVEN_DIRECTIVES],
        providers: [FormBuilder, RadioControlRegistry],
        exports: [InternalFormsSharedModule, REACTIVE_DRIVEN_DIRECTIVES]
      }]
    }];
    ReactiveFormsModule.ctorParameters = function() {
      return [];
    };
    exports.AbstractControlDirective = AbstractControlDirective;
    exports.AbstractFormGroupDirective = AbstractFormGroupDirective;
    exports.CheckboxControlValueAccessor = CheckboxControlValueAccessor;
    exports.ControlContainer = ControlContainer;
    exports.NG_VALUE_ACCESSOR = NG_VALUE_ACCESSOR;
    exports.COMPOSITION_BUFFER_MODE = COMPOSITION_BUFFER_MODE;
    exports.DefaultValueAccessor = DefaultValueAccessor;
    exports.NgControl = NgControl;
    exports.NgControlStatus = NgControlStatus;
    exports.NgControlStatusGroup = NgControlStatusGroup;
    exports.NgForm = NgForm;
    exports.NgModel = NgModel;
    exports.NgModelGroup = NgModelGroup;
    exports.RadioControlValueAccessor = RadioControlValueAccessor;
    exports.FormControlDirective = FormControlDirective;
    exports.FormControlName = FormControlName;
    exports.FormGroupDirective = FormGroupDirective;
    exports.FormArrayName = FormArrayName;
    exports.FormGroupName = FormGroupName;
    exports.NgSelectOption = NgSelectOption;
    exports.SelectControlValueAccessor = SelectControlValueAccessor;
    exports.SelectMultipleControlValueAccessor = SelectMultipleControlValueAccessor;
    exports.CheckboxRequiredValidator = CheckboxRequiredValidator;
    exports.EmailValidator = EmailValidator;
    exports.MaxLengthValidator = MaxLengthValidator;
    exports.MinLengthValidator = MinLengthValidator;
    exports.PatternValidator = PatternValidator;
    exports.RequiredValidator = RequiredValidator;
    exports.FormBuilder = FormBuilder;
    exports.AbstractControl = AbstractControl;
    exports.FormArray = FormArray;
    exports.FormControl = FormControl;
    exports.FormGroup = FormGroup;
    exports.NG_ASYNC_VALIDATORS = NG_ASYNC_VALIDATORS;
    exports.NG_VALIDATORS = NG_VALIDATORS;
    exports.Validators = Validators;
    exports.VERSION = VERSION;
    exports.FormsModule = FormsModule;
    exports.ReactiveFormsModule = ReactiveFormsModule;
    exports.ɵba = InternalFormsSharedModule;
    exports.ɵz = REACTIVE_DRIVEN_DIRECTIVES;
    exports.ɵx = SHARED_FORM_DIRECTIVES;
    exports.ɵy = TEMPLATE_DRIVEN_DIRECTIVES;
    exports.ɵa = CHECKBOX_VALUE_ACCESSOR;
    exports.ɵb = DEFAULT_VALUE_ACCESSOR;
    exports.ɵc = AbstractControlStatus;
    exports.ɵd = ngControlStatusHost;
    exports.ɵe = formDirectiveProvider;
    exports.ɵf = formControlBinding;
    exports.ɵg = modelGroupProvider;
    exports.ɵbf = NgNoValidate;
    exports.ɵbb = NUMBER_VALUE_ACCESSOR;
    exports.ɵbc = NumberValueAccessor;
    exports.ɵh = RADIO_VALUE_ACCESSOR;
    exports.ɵi = RadioControlRegistry;
    exports.ɵbd = RANGE_VALUE_ACCESSOR;
    exports.ɵbe = RangeValueAccessor;
    exports.ɵj = formControlBinding$1;
    exports.ɵk = controlNameBinding;
    exports.ɵl = formDirectiveProvider$1;
    exports.ɵn = formArrayNameProvider;
    exports.ɵm = formGroupNameProvider;
    exports.ɵo = SELECT_VALUE_ACCESSOR;
    exports.ɵq = NgSelectMultipleOption;
    exports.ɵp = SELECT_MULTIPLE_VALUE_ACCESSOR;
    exports.ɵs = CHECKBOX_REQUIRED_VALIDATOR;
    exports.ɵt = EMAIL_VALIDATOR;
    exports.ɵv = MAX_LENGTH_VALIDATOR;
    exports.ɵu = MIN_LENGTH_VALIDATOR;
    exports.ɵw = PATTERN_VALIDATOR;
    exports.ɵr = REQUIRED_VALIDATOR;
    Object.defineProperty(exports, '__esModule', {value: true});
  })));
})(require('process'));
