System.register(["./EventEmitter", "../../fp/has", "../../fp/sliceArgs", "../../fp/findLastIndex"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var EventEmitter_1, has_1, sliceArgs_1, findLastIndex_1, marker, scopeManager;
    return {
        setters: [
            function (EventEmitter_1_1) {
                EventEmitter_1 = EventEmitter_1_1;
            },
            function (has_1_1) {
                has_1 = has_1_1;
            },
            function (sliceArgs_1_1) {
                sliceArgs_1 = sliceArgs_1_1;
            },
            function (findLastIndex_1_1) {
                findLastIndex_1 = findLastIndex_1_1;
            }
        ],
        execute: function () {
            marker = {};
            exports_1("scopeManager", scopeManager = function (state, predefined, exported, declared) {
                var _current;
                var _scopeStack = [];
                function _newScope(type) {
                    _current = {
                        "(labels)": Object.create(null),
                        "(usages)": Object.create(null),
                        "(breakLabels)": Object.create(null),
                        "(parent)": _current,
                        "(type)": type,
                        "(params)": (type === "functionparams" || type === "catchparams") ? [] : null
                    };
                    _scopeStack.push(_current);
                }
                _newScope("global");
                _current["(predefined)"] = predefined;
                var _currentFunctBody = _current;
                var usedPredefinedAndGlobals = Object.create(null);
                var impliedGlobals = Object.create(null);
                var unuseds = [];
                var emitter = new EventEmitter_1.default();
                function warning(code, token, unused1, unused2) {
                    emitter.emit("warning", {
                        code: code,
                        token: token,
                        data: sliceArgs_1.default(arguments, 2)
                    });
                }
                function error(code, token, unused) {
                    emitter.emit("warning", {
                        code: code,
                        token: token,
                        data: sliceArgs_1.default(arguments, 2)
                    });
                }
                function _setupUsages(labelName) {
                    if (!_current["(usages)"][labelName]) {
                        _current["(usages)"][labelName] = {
                            "(modified)": [],
                            "(reassigned)": [],
                            "(tokens)": []
                        };
                    }
                }
                var _getUnusedOption = function (unused_opt) {
                    if (unused_opt === undefined) {
                        unused_opt = state.option.unused;
                    }
                    if (unused_opt === true) {
                        unused_opt = "last-param";
                    }
                    return unused_opt;
                };
                var _warnUnused = function (name, tkn, type, unused_opt) {
                    var line = tkn.line;
                    var chr = tkn.from;
                    var raw_name = tkn.raw_text || name;
                    unused_opt = _getUnusedOption(unused_opt);
                    var warnable_types = {
                        "vars": ["var"],
                        "last-param": ["var", "param"],
                        "strict": ["var", "param", "last-param"]
                    };
                    if (unused_opt) {
                        if (warnable_types[unused_opt] && warnable_types[unused_opt].indexOf(type) !== -1) {
                            warning("W098", { line: line, from: chr }, raw_name);
                        }
                    }
                    if (unused_opt || type === "var") {
                        unuseds.push({
                            name: name,
                            line: line,
                            character: chr
                        });
                    }
                };
                function _checkForUnused() {
                    if (_current["(type)"] === "functionparams") {
                        _checkParams();
                        return;
                    }
                    var curentLabels = _current["(labels)"];
                    for (var labelName in curentLabels) {
                        if (curentLabels[labelName]) {
                            if (curentLabels[labelName]["(type)"] !== "exception" &&
                                curentLabels[labelName]["(unused)"]) {
                                _warnUnused(labelName, curentLabels[labelName]["(token)"], "var");
                            }
                        }
                    }
                }
                function _checkParams() {
                    var params = _current["(params)"];
                    if (!params) {
                        return;
                    }
                    var param = params.pop();
                    var unused_opt;
                    while (param) {
                        var label = _current["(labels)"][param];
                        unused_opt = _getUnusedOption(state.funct["(unusedOption)"]);
                        if (param === "undefined")
                            return;
                        if (label["(unused)"]) {
                            _warnUnused(param, label["(token)"], "param", state.funct["(unusedOption)"]);
                        }
                        else if (unused_opt === "last-param") {
                            return;
                        }
                        param = params.pop();
                    }
                }
                function _getLabel(labelName) {
                    for (var i = _scopeStack.length - 1; i >= 0; --i) {
                        var scopeLabels = _scopeStack[i]["(labels)"];
                        if (scopeLabels[labelName]) {
                            return scopeLabels;
                        }
                    }
                }
                function usedSoFarInCurrentFunction(labelName) {
                    for (var i = _scopeStack.length - 1; i >= 0; i--) {
                        var current = _scopeStack[i];
                        if (current["(usages)"][labelName]) {
                            return current["(usages)"][labelName];
                        }
                        if (current === _currentFunctBody) {
                            break;
                        }
                    }
                    return false;
                }
                function _checkOuterShadow(labelName, token, unused) {
                    if (state.option.shadow !== "outer") {
                        return;
                    }
                    var isGlobal = _currentFunctBody["(type)"] === "global", isNewFunction = _current["(type)"] === "functionparams";
                    var outsideCurrentFunction = !isGlobal;
                    for (var i = 0; i < _scopeStack.length; i++) {
                        var stackItem = _scopeStack[i];
                        if (!isNewFunction && _scopeStack[i + 1] === _currentFunctBody) {
                            outsideCurrentFunction = false;
                        }
                        if (outsideCurrentFunction && stackItem["(labels)"][labelName]) {
                            warning("W123", token, labelName);
                        }
                        if (stackItem["(breakLabels)"][labelName]) {
                            warning("W123", token, labelName);
                        }
                    }
                }
                function _latedefWarning(type, labelName, token) {
                    if (state.option.latedef) {
                        if ((state.option.latedef === true && type === "function") ||
                            type !== "function") {
                            warning("W003", token, labelName);
                        }
                    }
                }
                var scopeManagerInst = {
                    on: function (names, listener) {
                        names.split(" ").forEach(function (name) {
                            emitter.on(name, listener);
                        });
                    },
                    isPredefined: function (labelName) {
                        return !this.has(labelName) && has_1.default(_scopeStack[0]["(predefined)"], labelName);
                    },
                    stack: function (type) {
                        var previousScope = _current;
                        _newScope(type);
                        if (!type && previousScope["(type)"] === "functionparams") {
                            _current["(isFuncBody)"] = true;
                            _current["(context)"] = _currentFunctBody;
                            _currentFunctBody = _current;
                        }
                    },
                    unstack: function () {
                        var subScope = _scopeStack.length > 1 ? _scopeStack[_scopeStack.length - 2] : null;
                        var isUnstackingFunctionBody = _current === _currentFunctBody, isUnstackingFunctionParams = _current["(type)"] === "functionparams", isUnstackingFunctionOuter = _current["(type)"] === "functionouter";
                        var i, j;
                        var currentUsages = _current["(usages)"];
                        var currentLabels = _current["(labels)"];
                        var usedLabelNameList = Object.keys(currentUsages);
                        if (currentUsages.__proto__ && usedLabelNameList.indexOf("__proto__") === -1) {
                            usedLabelNameList.push("__proto__");
                        }
                        for (i = 0; i < usedLabelNameList.length; i++) {
                            var usedLabelName = usedLabelNameList[i];
                            var usage = currentUsages[usedLabelName];
                            var usedLabel = currentLabels[usedLabelName];
                            if (usedLabel) {
                                var usedLabelType = usedLabel["(type)"];
                                if (usedLabel["(useOutsideOfScope)"] && !state.option.funcscope) {
                                    var usedTokens = usage["(tokens)"];
                                    if (usedTokens) {
                                        for (j = 0; j < usedTokens.length; j++) {
                                            if (usedLabel["(function)"] === usedTokens[j]["(function)"]) {
                                                error("W038", usedTokens[j], usedLabelName);
                                            }
                                        }
                                    }
                                }
                                _current["(labels)"][usedLabelName]["(unused)"] = false;
                                if (usedLabelType === "const" && usage["(modified)"]) {
                                    for (j = 0; j < usage["(modified)"].length; j++) {
                                        error("E013", usage["(modified)"][j], usedLabelName);
                                    }
                                }
                                if ((usedLabelType === "function" || usedLabelType === "class") &&
                                    usage["(reassigned)"]) {
                                    for (j = 0; j < usage["(reassigned)"].length; j++) {
                                        if (!usage["(reassigned)"][j].ignoreW021) {
                                            warning("W021", usage["(reassigned)"][j], usedLabelName, usedLabelType);
                                        }
                                    }
                                }
                                continue;
                            }
                            if (isUnstackingFunctionOuter) {
                                state.funct["(isCapturing)"] = true;
                            }
                            if (subScope) {
                                if (!subScope["(usages)"][usedLabelName]) {
                                    subScope["(usages)"][usedLabelName] = usage;
                                    if (isUnstackingFunctionBody) {
                                        subScope["(usages)"][usedLabelName]["(onlyUsedSubFunction)"] = true;
                                    }
                                }
                                else {
                                    var subScopeUsage = subScope["(usages)"][usedLabelName];
                                    subScopeUsage["(modified)"] = subScopeUsage["(modified)"].concat(usage["(modified)"]);
                                    subScopeUsage["(tokens)"] = subScopeUsage["(tokens)"].concat(usage["(tokens)"]);
                                    subScopeUsage["(reassigned)"] =
                                        subScopeUsage["(reassigned)"].concat(usage["(reassigned)"]);
                                    subScopeUsage["(onlyUsedSubFunction)"] = false;
                                }
                            }
                            else {
                                if (typeof _current["(predefined)"][usedLabelName] === "boolean") {
                                    delete declared[usedLabelName];
                                    usedPredefinedAndGlobals[usedLabelName] = marker;
                                    if (_current["(predefined)"][usedLabelName] === false && usage["(reassigned)"]) {
                                        for (j = 0; j < usage["(reassigned)"].length; j++) {
                                            if (!usage["(reassigned)"][j].ignoreW020) {
                                                warning("W020", usage["(reassigned)"][j]);
                                            }
                                        }
                                    }
                                }
                                else {
                                    if (usage["(tokens)"]) {
                                        for (j = 0; j < usage["(tokens)"].length; j++) {
                                            var undefinedToken = usage["(tokens)"][j];
                                            if (!undefinedToken.forgiveUndef) {
                                                if (state.option.undef && !undefinedToken.ignoreUndef) {
                                                    warning("W117", undefinedToken, usedLabelName);
                                                }
                                                if (impliedGlobals[usedLabelName]) {
                                                    impliedGlobals[usedLabelName].line.push(undefinedToken.line);
                                                }
                                                else {
                                                    impliedGlobals[usedLabelName] = {
                                                        name: usedLabelName,
                                                        line: [undefinedToken.line]
                                                    };
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (!subScope) {
                            Object.keys(declared)
                                .forEach(function (labelNotUsed) {
                                _warnUnused(labelNotUsed, declared[labelNotUsed], "var");
                            });
                        }
                        if (subScope && !isUnstackingFunctionBody &&
                            !isUnstackingFunctionParams && !isUnstackingFunctionOuter) {
                            var labelNames = Object.keys(currentLabels);
                            for (i = 0; i < labelNames.length; i++) {
                                var defLabelName = labelNames[i];
                                var defLabel = currentLabels[defLabelName];
                                if (!defLabel["(blockscoped)"] && defLabel["(type)"] !== "exception") {
                                    var shadowed = subScope["(labels)"][defLabelName];
                                    if (shadowed) {
                                        shadowed["(unused)"] &= defLabel["(unused)"];
                                    }
                                    else {
                                        defLabel["(useOutsideOfScope)"] =
                                            _currentFunctBody["(type)"] !== "global" &&
                                                !this.funct.has(defLabelName, { excludeCurrent: true });
                                        subScope["(labels)"][defLabelName] = defLabel;
                                    }
                                    delete currentLabels[defLabelName];
                                }
                            }
                        }
                        _checkForUnused();
                        _scopeStack.pop();
                        if (isUnstackingFunctionBody) {
                            _currentFunctBody = _scopeStack[findLastIndex_1.default(_scopeStack, function (scope) {
                                return scope["(isFuncBody)"] || scope["(type)"] === "global";
                            })];
                        }
                        _current = subScope;
                    },
                    addParam: function (labelName, token, type) {
                        type = type || "param";
                        if (type === "exception") {
                            var previouslyDefinedLabelType = this.funct.labeltype(labelName);
                            if (previouslyDefinedLabelType && previouslyDefinedLabelType !== "exception") {
                                if (!state.option.node) {
                                    warning("W002", state.tokens.next, labelName);
                                }
                            }
                        }
                        if (has_1.default(_current["(labels)"], labelName)) {
                            _current["(labels)"][labelName].duplicated = true;
                        }
                        else {
                            _checkOuterShadow(labelName, token, type);
                            _current["(labels)"][labelName] = {
                                "(type)": type,
                                "(token)": token,
                                "(unused)": true
                            };
                            _current["(params)"].push(labelName);
                        }
                        if (has_1.default(_current["(usages)"], labelName)) {
                            var usage = _current["(usages)"][labelName];
                            if (usage["(onlyUsedSubFunction)"]) {
                                _latedefWarning(type, labelName, token);
                            }
                            else {
                                warning("E056", token, labelName, type);
                            }
                        }
                    },
                    validateParams: function () {
                        if (_currentFunctBody["(type)"] === "global") {
                            return;
                        }
                        var isStrict = state.isStrict();
                        var currentFunctParamScope = _currentFunctBody["(parent)"];
                        if (!currentFunctParamScope["(params)"]) {
                            return;
                        }
                        currentFunctParamScope["(params)"].forEach(function (labelName) {
                            var label = currentFunctParamScope["(labels)"][labelName];
                            if (label && label.duplicated) {
                                if (isStrict) {
                                    warning("E011", label["(token)"], labelName);
                                }
                                else if (state.option.shadow !== true) {
                                    warning("W004", label["(token)"], labelName);
                                }
                            }
                        });
                    },
                    getUsedOrDefinedGlobals: function () {
                        var list = Object.keys(usedPredefinedAndGlobals);
                        if (usedPredefinedAndGlobals.__proto__ === marker &&
                            list.indexOf("__proto__") === -1) {
                            list.push("__proto__");
                        }
                        return list;
                    },
                    getImpliedGlobals: function () {
                        var values = values(impliedGlobals);
                        var hasProto = false;
                        if (impliedGlobals.__proto__) {
                            hasProto = values.some(function (value) {
                                return value.name === "__proto__";
                            });
                            if (!hasProto) {
                                values.push(impliedGlobals.__proto__);
                            }
                        }
                        return values;
                    },
                    getUnuseds: function () {
                        return unuseds;
                    },
                    has: function (labelName, unused) {
                        return Boolean(_getLabel(labelName));
                    },
                    labeltype: function (labelName) {
                        var scopeLabels = _getLabel(labelName);
                        if (scopeLabels) {
                            return scopeLabels[labelName]["(type)"];
                        }
                        return null;
                    },
                    addExported: function (labelName) {
                        var globalLabels = _scopeStack[0]["(labels)"];
                        if (has_1.default(declared, labelName)) {
                            delete declared[labelName];
                        }
                        else if (has_1.default(globalLabels, labelName)) {
                            globalLabels[labelName]["(unused)"] = false;
                        }
                        else {
                            for (var i = 1; i < _scopeStack.length; i++) {
                                var scope = _scopeStack[i];
                                if (!scope["(type)"]) {
                                    if (has_1.default(scope["(labels)"], labelName) &&
                                        !scope["(labels)"][labelName]["(blockscoped)"]) {
                                        scope["(labels)"][labelName]["(unused)"] = false;
                                        return;
                                    }
                                }
                                else {
                                    break;
                                }
                            }
                            exported[labelName] = true;
                        }
                    },
                    setExported: function (labelName, token) {
                        this.block.use(labelName, token);
                    },
                    addlabel: function (labelName, opts) {
                        var type = opts.type;
                        var token = opts.token;
                        var isblockscoped = type === "let" || type === "const" || type === "class";
                        var isexported = (isblockscoped ? _current : _currentFunctBody)["(type)"] === "global" &&
                            has_1.default(exported, labelName);
                        _checkOuterShadow(labelName, token, type);
                        if (isblockscoped) {
                            var declaredInCurrentScope = _current["(labels)"][labelName];
                            if (!declaredInCurrentScope && _current === _currentFunctBody &&
                                _current["(type)"] !== "global") {
                                declaredInCurrentScope = !!_currentFunctBody["(parent)"]["(labels)"][labelName];
                            }
                            if (!declaredInCurrentScope && _current["(usages)"][labelName]) {
                                var usage = _current["(usages)"][labelName];
                                if (usage["(onlyUsedSubFunction)"]) {
                                    _latedefWarning(type, labelName, token);
                                }
                                else {
                                    warning("E056", token, labelName, type);
                                }
                            }
                            if (declaredInCurrentScope) {
                                warning("E011", token, labelName);
                            }
                            else if (state.option.shadow === "outer") {
                                if (scopeManagerInst.funct.has(labelName)) {
                                    warning("W004", token, labelName);
                                }
                            }
                            scopeManagerInst.block.add(labelName, type, token, !isexported);
                        }
                        else {
                            var declaredInCurrentFunctionScope = scopeManagerInst.funct.has(labelName);
                            if (!declaredInCurrentFunctionScope && usedSoFarInCurrentFunction(labelName)) {
                                _latedefWarning(type, labelName, token);
                            }
                            if (scopeManagerInst.funct.has(labelName, { onlyBlockscoped: true })) {
                                warning("E011", token, labelName);
                            }
                            else if (state.option.shadow !== true) {
                                if (declaredInCurrentFunctionScope && labelName !== "__proto__") {
                                    if (_currentFunctBody["(type)"] !== "global") {
                                        warning("W004", token, labelName);
                                    }
                                }
                            }
                            scopeManagerInst.funct.add(labelName, type, token, !isexported);
                            if (_currentFunctBody["(type)"] === "global") {
                                usedPredefinedAndGlobals[labelName] = marker;
                            }
                        }
                    },
                    funct: {
                        labeltype: function (labelName, options) {
                            var onlyBlockscoped = options && options.onlyBlockscoped;
                            var excludeParams = options && options.excludeParams;
                            var currentScopeIndex = _scopeStack.length - (options && options.excludeCurrent ? 2 : 1);
                            for (var i = currentScopeIndex; i >= 0; i--) {
                                var current = _scopeStack[i];
                                if (current["(labels)"][labelName] &&
                                    (!onlyBlockscoped || current["(labels)"][labelName]["(blockscoped)"])) {
                                    return current["(labels)"][labelName]["(type)"];
                                }
                                var scopeCheck = excludeParams ? _scopeStack[i - 1] : current;
                                if (scopeCheck && scopeCheck["(type)"] === "functionparams") {
                                    return null;
                                }
                            }
                            return null;
                        },
                        hasBreakLabel: function (labelName) {
                            for (var i = _scopeStack.length - 1; i >= 0; i--) {
                                var current = _scopeStack[i];
                                if (current["(breakLabels)"][labelName]) {
                                    return true;
                                }
                                if (current["(type)"] === "functionparams") {
                                    return false;
                                }
                            }
                            return false;
                        },
                        has: function (labelName, options) {
                            return Boolean(this.labeltype(labelName, options));
                        },
                        add: function (labelName, type, tok, unused) {
                            _current["(labels)"][labelName] = {
                                "(type)": type,
                                "(token)": tok,
                                "(blockscoped)": false,
                                "(function)": _currentFunctBody,
                                "(unused)": unused
                            };
                        }
                    },
                    block: {
                        isGlobal: function () {
                            return _current["(type)"] === "global";
                        },
                        use: function (labelName, token) {
                            var paramScope = _currentFunctBody["(parent)"];
                            if (paramScope && paramScope["(labels)"][labelName] &&
                                paramScope["(labels)"][labelName]["(type)"] === "param") {
                                if (!scopeManagerInst.funct.has(labelName, { excludeParams: true, onlyBlockscoped: true })) {
                                    paramScope["(labels)"][labelName]["(unused)"] = false;
                                }
                            }
                            if (token && (state.ignored.W117 || state.option.undef === false)) {
                                token.ignoreUndef = true;
                            }
                            _setupUsages(labelName);
                            if (token) {
                                token["(function)"] = _currentFunctBody;
                                _current["(usages)"][labelName]["(tokens)"].push(token);
                            }
                        },
                        reassign: function (labelName, token) {
                            token.ignoreW020 = state.ignored.W020;
                            token.ignoreW021 = state.ignored.W021;
                            this.modify(labelName, token);
                            _current["(usages)"][labelName]["(reassigned)"].push(token);
                        },
                        modify: function (labelName, token) {
                            _setupUsages(labelName);
                            _current["(usages)"][labelName]["(modified)"].push(token);
                        },
                        add: function (labelName, type, tok, unused) {
                            _current["(labels)"][labelName] = {
                                "(type)": type,
                                "(token)": tok,
                                "(blockscoped)": true,
                                "(unused)": unused
                            };
                        },
                        addBreakLabel: function (labelName, opts) {
                            var token = opts.token;
                            if (scopeManagerInst.funct.hasBreakLabel(labelName)) {
                                warning("E011", token, labelName);
                            }
                            else if (state.option.shadow === "outer") {
                                if (scopeManagerInst.funct.has(labelName)) {
                                    warning("W004", token, labelName);
                                }
                                else {
                                    _checkOuterShadow(labelName, token);
                                }
                            }
                            _current["(breakLabels)"][labelName] = token;
                        }
                    }
                };
                return scopeManagerInst;
            });
        }
    };
});
