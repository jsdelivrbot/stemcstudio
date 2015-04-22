var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
ace.define("ace/snippets",["require","exports","module","ace/lib/event_emitter","ace/lib/lang","ace/range","ace/anchor","ace/keyboard/hash_handler","ace/tokenizer","ace/lib/dom","ace/editor"], function(require, exports, module) {
"no use strict";
var eve = require("./lib/event_emitter");
var lang = require("./lib/lang");
var rm = require("./range");
var am = require("./anchor");
var hhm = require("./keyboard/hash_handler");
var tkm = require("./tokenizer");

var comparePoints = rm.Range.comparePoints;

var TABSTOP_MANAGER = 'tabstopManager';

function escape(ch) {
    return "(?:[^\\\\" + ch + "]|\\\\.)";
}
function TabstopToken(str, _, stack) {
    str = str.substr(1);
    if (/^\d+$/.test(str) && !stack.inFormatString) {
        return [{ tabstopId: parseInt(str, 10) }];
    }
    return [{ text: str }];
}

var SnippetManager = (function (_super) {
    __extends(SnippetManager, _super);
    function SnippetManager() {
        _super.call(this);
        this.snippetMap = {};
        this.snippetNameMap = {};
        this.variables = {};
    }
    SnippetManager.prototype.getTokenizer = function () {
        SnippetManager.prototype.getTokenizer = function () {
            return SnippetManager.$tokenizer;
        };
        return SnippetManager.$tokenizer;
    };

    SnippetManager.prototype.tokenizeTmSnippet = function (str, startState) {
        return this.getTokenizer().getLineTokens(str, startState).tokens.map(function (x) {
            return x.value || x;
        });
    };

    SnippetManager.prototype.$getDefaultValue = function (editor, name) {
        if (/^[A-Z]\d+$/.test(name)) {
            var i = name.substr(1);
            return (this.variables[name[0] + "__"] || {})[i];
        }
        if (/^\d+$/.test(name)) {
            return (this.variables['__'] || {})[name];
        }
        name = name.replace(/^TM_/, "");

        if (!editor)
            return;
        var s = editor.session;
        switch (name) {
            case "CURRENT_WORD":
                var r = s.getWordRange();

            case "SELECTION":
            case "SELECTED_TEXT":
                return s.getTextRange(r);
            case "CURRENT_LINE":
                return s.getLine(editor.getCursorPosition().row);
            case "PREV_LINE":
                return s.getLine(editor.getCursorPosition().row - 1);
            case "LINE_INDEX":
                return editor.getCursorPosition().column;
            case "LINE_NUMBER":
                return editor.getCursorPosition().row + 1;
            case "SOFT_TABS":
                return s.getUseSoftTabs() ? "YES" : "NO";
            case "TAB_SIZE":
                return s.getTabSize();

            case "FILENAME":
            case "FILEPATH":
                return "";
            case "FULLNAME":
                return "Ace";
        }
    };
    SnippetManager.prototype.getVariableValue = function (editor, varName) {
        if (this.variables.hasOwnProperty(varName))
            return this.variables[varName](editor, varName) || "";
        return this.$getDefaultValue(editor, varName) || "";
    };
    SnippetManager.prototype.tmStrFormat = function (str, ch, editor) {
        var flag = ch.flag || "";
        var re = ch.guard;
        re = new RegExp(re, flag.replace(/[^gi]/, ""));
        var fmtTokens = this.tokenizeTmSnippet(ch.fmt, "formatString");
        var _self = this;
        var formatted = str.replace(re, function () {
            _self.variables['__'] = arguments;
            var fmtParts = _self.resolveVariables(fmtTokens, editor);
            var gChangeCase = "E";
            for (var i = 0; i < fmtParts.length; i++) {
                var ch = fmtParts[i];
                if (typeof ch == "object") {
                    fmtParts[i] = "";
                    if (ch.changeCase && ch.local) {
                        var next = fmtParts[i + 1];
                        if (next && typeof next == "string") {
                            if (ch.changeCase == "u")
                                fmtParts[i] = next[0].toUpperCase();
                            else
                                fmtParts[i] = next[0].toLowerCase();
                            fmtParts[i + 1] = next.substr(1);
                        }
                    } else if (ch.changeCase) {
                        gChangeCase = ch.changeCase;
                    }
                } else if (gChangeCase == "U") {
                    fmtParts[i] = ch.toUpperCase();
                } else if (gChangeCase == "L") {
                    fmtParts[i] = ch.toLowerCase();
                }
            }
            return fmtParts.join("");
        });
        this.variables['__'] = null;
        return formatted;
    };

    SnippetManager.prototype.resolveVariables = function (snippet, editor) {
        var result = [];
        for (var i = 0; i < snippet.length; i++) {
            var ch = snippet[i];
            if (typeof ch == "string") {
                result.push(ch);
            } else if (typeof ch != "object") {
                continue;
            } else if (ch.skip) {
                gotoNext(ch);
            } else if (ch.processed < i) {
                continue;
            } else if (ch.text) {
                var value = this.getVariableValue(editor, ch.text);
                if (value && ch.fmtString)
                    value = this.tmStrFormat(value, ch);
                ch.processed = i;
                if (ch.expectIf == null) {
                    if (value) {
                        result.push(value);
                        gotoNext(ch);
                    }
                } else {
                    if (value) {
                        ch.skip = ch.elseBranch;
                    } else
                        gotoNext(ch);
                }
            } else if (ch.tabstopId != null) {
                result.push(ch);
            } else if (ch.changeCase != null) {
                result.push(ch);
            }
        }
        function gotoNext(ch) {
            var i1 = snippet.indexOf(ch, i + 1);
            if (i1 != -1)
                i = i1;
        }
        return result;
    };

    SnippetManager.prototype.insertSnippetForSelection = function (editor, snippetText) {
        var cursor = editor.getCursorPosition();
        var line = editor.session.getLine(cursor.row);
        var tabString = editor.session.getTabString();
        var indentString = line.match(/^\s*/)[0];

        if (cursor.column < indentString.length)
            indentString = indentString.slice(0, cursor.column);

        var tokens = this.tokenizeTmSnippet(snippetText);
        tokens = this.resolveVariables(tokens, editor);
        tokens = tokens.map(function (x) {
            if (x == "\n")
                return x + indentString;
            if (typeof x == "string")
                return x.replace(/\t/g, tabString);
            return x;
        });
        var tabstops = [];
        tokens.forEach(function (p, i) {
            if (typeof p != "object")
                return;
            var id = p.tabstopId;
            var ts = tabstops[id];
            if (!ts) {
                ts = tabstops[id] = [];
                ts.index = id;
                ts.value = "";
            }
            if (ts.indexOf(p) !== -1)
                return;
            ts.push(p);
            var i1 = tokens.indexOf(p, i + 1);
            if (i1 === -1)
                return;

            var value = tokens.slice(i + 1, i1);
            var isNested = value.some(function (t) {
                return typeof t === "object";
            });
            if (isNested && !ts.value) {
                ts.value = value;
            } else if (value.length && (!ts.value || typeof ts.value !== "string")) {
                ts.value = value.join("");
            }
        });
        tabstops.forEach(function (ts) {
            ts.length = 0;
        });
        var expanding = {};
        function copyValue(val) {
            var copy = [];
            for (var i = 0; i < val.length; i++) {
                var p = val[i];
                if (typeof p == "object") {
                    if (expanding[p.tabstopId])
                        continue;
                    var j = val.lastIndexOf(p, i - 1);
                    p = copy[j] || { tabstopId: p.tabstopId };
                }
                copy[i] = p;
            }
            return copy;
        }
        for (var i = 0; i < tokens.length; i++) {
            var p = tokens[i];
            if (typeof p != "object")
                continue;
            var id = p.tabstopId;
            var i1 = tokens.indexOf(p, i + 1);
            if (expanding[id]) {
                if (expanding[id] === p)
                    expanding[id] = null;

                continue;
            }

            var ts = tabstops[id];
            var arg = typeof ts.value == "string" ? [ts.value] : copyValue(ts.value);
            arg.unshift(i + 1, Math.max(0, i1 - i));
            arg.push(p);
            expanding[id] = p;
            tokens.splice.apply(tokens, arg);

            if (ts.indexOf(p) === -1)
                ts.push(p);
        }
        var row = 0, column = 0;
        var text = "";
        tokens.forEach(function (t) {
            if (typeof t === "string") {
                if (t[0] === "\n") {
                    column = t.length - 1;
                    row++;
                } else
                    column += t.length;
                text += t;
            } else {
                if (!t.start)
                    t.start = { row: row, column: column };
                else
                    t.end = { row: row, column: column };
            }
        });
        var range = editor.getSelectionRange();
        var end = editor.session.replace(range, text);

        var tsManager = editor[TABSTOP_MANAGER] ? editor[TABSTOP_MANAGER] : new TabstopManager(editor);
        var selectionId = editor.inVirtualSelectionMode && editor.selection['index'];
        tsManager.addTabstops(tabstops, range.start, end, selectionId);
    };

    SnippetManager.prototype.insertSnippet = function (editor, snippetText, unused) {
        var self = this;
        if (editor.inVirtualSelectionMode)
            return self.insertSnippetForSelection(editor, snippetText);

        editor.forEachSelection(function () {
            self.insertSnippetForSelection(editor, snippetText);
        }, null, { keepOrder: true });

        if (editor[TABSTOP_MANAGER]) {
            editor[TABSTOP_MANAGER].tabNext();
        }
    };

    SnippetManager.prototype.$getScope = function (editor) {
        var scope = editor.session.$mode.$id || "";
        scope = scope.split("/").pop();
        if (scope === "html" || scope === "php") {
            if (scope === "php" && !editor.session.$mode.inlinePhp)
                scope = "html";
            var c = editor.getCursorPosition();
            var state = editor.session.getState(c.row);
            if (typeof state === "object") {
                state = state[0];
            }
            if (state.substring) {
                if (state.substring(0, 3) == "js-")
                    scope = "javascript";
                else if (state.substring(0, 4) == "css-")
                    scope = "css";
                else if (state.substring(0, 4) == "php-")
                    scope = "php";
            }
        }

        return scope;
    };

    SnippetManager.prototype.getActiveScopes = function (editor) {
        var scope = this.$getScope(editor);
        var scopes = [scope];
        var snippetMap = this.snippetMap;
        if (snippetMap[scope] && snippetMap[scope].includeScopes) {
            scopes.push.apply(scopes, snippetMap[scope].includeScopes);
        }
        scopes.push("_");
        return scopes;
    };

    SnippetManager.prototype.expandWithTab = function (editor, options) {
        var self = this;
        var result = editor.forEachSelection(function () {
            return self.expandSnippetForSelection(editor, options);
        }, null, { keepOrder: true });
        if (result && editor[TABSTOP_MANAGER]) {
            editor[TABSTOP_MANAGER].tabNext();
        }
        return result;
    };

    SnippetManager.prototype.expandSnippetForSelection = function (editor, options) {
        var cursor = editor.getCursorPosition();
        var line = editor.session.getLine(cursor.row);
        var before = line.substring(0, cursor.column);
        var after = line.substr(cursor.column);

        var snippetMap = this.snippetMap;
        var snippet;
        this.getActiveScopes(editor).some(function (scope) {
            var snippets = snippetMap[scope];
            if (snippets)
                snippet = this.findMatchingSnippet(snippets, before, after);
            return !!snippet;
        }, this);
        if (!snippet)
            return false;
        if (options && options.dryRun)
            return true;
        editor.session.doc.removeInLine(cursor.row, cursor.column - snippet.replaceBefore.length, cursor.column + snippet.replaceAfter.length);

        this.variables['M__'] = snippet.matchBefore;
        this.variables['T__'] = snippet.matchAfter;
        this.insertSnippetForSelection(editor, snippet.content);

        this.variables['M__'] = this.variables['T__'] = null;
        return true;
    };

    SnippetManager.prototype.findMatchingSnippet = function (snippetList, before, after) {
        for (var i = snippetList.length; i--;) {
            var s = snippetList[i];
            if (s.startRe && !s.startRe.test(before))
                continue;
            if (s.endRe && !s.endRe.test(after))
                continue;
            if (!s.startRe && !s.endRe)
                continue;

            s.matchBefore = s.startRe ? s.startRe.exec(before) : [""];
            s.matchAfter = s.endRe ? s.endRe.exec(after) : [""];
            s.replaceBefore = s.triggerRe ? s.triggerRe.exec(before)[0] : "";
            s.replaceAfter = s.endTriggerRe ? s.endTriggerRe.exec(after)[0] : "";
            return s;
        }
    };

    SnippetManager.prototype.register = function (snippets, scope) {
        var snippetMap = this.snippetMap;
        var snippetNameMap = this.snippetNameMap;
        var self = this;
        function wrapRegexp(src) {
            if (src && !/^\^?\(.*\)\$?$|^\\b$/.test(src))
                src = "(?:" + src + ")";

            return src || "";
        }
        function guardedRegexp(re, guard, opening) {
            re = wrapRegexp(re);
            guard = wrapRegexp(guard);
            if (opening) {
                re = guard + re;
                if (re && re[re.length - 1] != "$")
                    re = re + "$";
            } else {
                re = re + guard;
                if (re && re[0] != "^")
                    re = "^" + re;
            }
            return new RegExp(re);
        }

        function addSnippet(s) {
            if (!s.scope)
                s.scope = scope || "_";
            scope = s.scope;
            if (!snippetMap[scope]) {
                snippetMap[scope] = [];
                snippetNameMap[scope] = {};
            }

            var map = snippetNameMap[scope];
            if (s.name) {
                var old = map[s.name];
                if (old)
                    self.unregister(old);
                map[s.name] = s;
            }
            snippetMap[scope].push(s);

            if (s.tabTrigger && !s.trigger) {
                if (!s.guard && /^\w/.test(s.tabTrigger))
                    s.guard = "\\b";
                s.trigger = lang.escapeRegExp(s.tabTrigger);
            }

            s.startRe = guardedRegexp(s.trigger, s.guard, true);
            s.triggerRe = new RegExp(s.trigger, "");

            s.endRe = guardedRegexp(s.endTrigger, s.endGuard, true);
            s.endTriggerRe = new RegExp(s.endTrigger, "");
        }

        if (snippets.content)
            addSnippet(snippets);
        else if (Array.isArray(snippets))
            snippets.forEach(addSnippet);

        this._signal("registerSnippets", { scope: scope });
    };

    SnippetManager.prototype.unregister = function (snippets, scope) {
        var snippetMap = this.snippetMap;
        var snippetNameMap = this.snippetNameMap;

        function removeSnippet(s) {
            var nameMap = snippetNameMap[s.scope || scope];
            if (nameMap && nameMap[s.name]) {
                delete nameMap[s.name];
                var map = snippetMap[s.scope || scope];
                var i = map && map.indexOf(s);
                if (i >= 0)
                    map.splice(i, 1);
            }
        }
        if (snippets.content)
            removeSnippet(snippets);
        else if (Array.isArray(snippets))
            snippets.forEach(removeSnippet);
    };

    SnippetManager.prototype.parseSnippetFile = function (str) {
        str = str.replace(/\r/g, "");
        var list = [];
        var snippet = {};
        var re = /^#.*|^({[\s\S]*})\s*$|^(\S+) (.*)$|^((?:\n*\t.*)+)/gm;
        var m;
        while (m = re.exec(str)) {
            if (m[1]) {
                try  {
                    snippet = JSON.parse(m[1]);
                    list.push(snippet);
                } catch (e) {
                }
            }
            if (m[4]) {
                snippet.content = m[4].replace(/^\t/gm, "");
                list.push(snippet);
                snippet = {};
            } else {
                var key = m[2], val = m[3];
                if (key == "regex") {
                    var guardRe = /\/((?:[^\/\\]|\\.)*)|$/g;
                    snippet.guard = guardRe.exec(val)[1];
                    snippet.trigger = guardRe.exec(val)[1];
                    snippet.endTrigger = guardRe.exec(val)[1];
                    snippet.endGuard = guardRe.exec(val)[1];
                } else if (key == "snippet") {
                    snippet.tabTrigger = val.match(/^\S*/)[0];
                    if (!snippet.name)
                        snippet.name = val;
                } else {
                    snippet[key] = val;
                }
            }
        }
        return list;
    };
    SnippetManager.prototype.getSnippetByName = function (name, editor) {
        var snippetMap = this.snippetNameMap;
        var snippet;
        this.getActiveScopes(editor).some(function (scope) {
            var snippets = snippetMap[scope];
            if (snippets)
                snippet = snippets[name];
            return !!snippet;
        }, this);
        return snippet;
    };
    SnippetManager.$tokenizer = new tkm.Tokenizer({
        start: [
            {
                regex: /:/,
                onMatch: function (val, state, stack) {
                    if (stack.length && stack[0].expectIf) {
                        stack[0].expectIf = false;
                        stack[0].elseBranch = stack[0];
                        return [stack[0]];
                    }
                    return ":";
                }
            },
            {
                regex: /\\./,
                onMatch: function (val, state, stack) {
                    var ch = val[1];
                    if (ch == "}" && stack.length) {
                        val = ch;
                    } else if ("`$\\".indexOf(ch) != -1) {
                        val = ch;
                    } else if (stack.inFormatString) {
                        if (ch == "n")
                            val = "\n";
                        else if (ch == "t")
                            val = "\n";
                        else if ("ulULE".indexOf(ch) != -1) {
                            val = { changeCase: ch, local: ch > "a" };
                        }
                    }

                    return [val];
                }
            },
            {
                regex: /}/,
                onMatch: function (val, state, stack) {
                    return [stack.length ? stack.shift() : val];
                }
            },
            {
                regex: /\$(?:\d+|\w+)/,
                onMatch: TabstopToken
            },
            {
                regex: /\$\{[\dA-Z_a-z]+/,
                onMatch: function (str, state, stack) {
                    var t = TabstopToken(str.substr(1), state, stack);
                    stack.unshift(t[0]);
                    return t;
                }, next: "snippetVar"
            },
            {
                regex: /\n/,
                token: "newline",
                merge: false
            }
        ],
        snippetVar: [
            {
                regex: "\\|" + escape("\\|") + "*\\|", onMatch: function (val, state, stack) {
                    stack[0].choices = val.slice(1, -1).split(",");
                }, next: "start"
            },
            {
                regex: "/(" + escape("/") + "+)/(?:(" + escape("/") + "*)/)(\\w*):?",
                onMatch: function (val, state, stack) {
                    var ts = stack[0];
                    ts.fmtString = val;

                    val = this.splitRegex.exec(val);
                    ts.guard = val[1];
                    ts.fmt = val[2];
                    ts.flag = val[3];
                    return "";
                }, next: "start"
            },
            {
                regex: "`" + escape("`") + "*`", onMatch: function (val, state, stack) {
                    stack[0].code = val.splice(1, -1);
                    return "";
                }, next: "start"
            },
            {
                regex: "\\?", onMatch: function (val, state, stack) {
                    if (stack[0])
                        stack[0].expectIf = true;
                }, next: "start"
            },
            { regex: "([^:}\\\\]|\\\\.)*:?", token: "", next: "start" }
        ],
        formatString: [
            { regex: "/(" + escape("/") + "+)/", token: "regex" },
            {
                regex: "", onMatch: function (val, state, stack) {
                    stack.inFormatString = true;
                }, next: "start"
            }
        ]
    });
    return SnippetManager;
})(eve.EventEmitterClass);
exports.SnippetManager = SnippetManager;

var TabstopManager = (function () {
    function TabstopManager(editor) {
        this.keyboardHandler = new hhm.HashHandler();
        this.addTabstops = function (tabstops, start, end, unused) {
            if (!this.$openTabstops)
                this.$openTabstops = [];
            if (!tabstops[0]) {
                var p = rm.Range.fromPoints(end, end);
                moveRelative(p.start, start);
                moveRelative(p.end, start);
                tabstops[0] = [p];
                tabstops[0].index = 0;
            }

            var i = this.index;
            var arg = [i + 1, 0];
            var ranges = this.ranges;
            tabstops.forEach(function (ts, index) {
                var dest = this.$openTabstops[index] || ts;

                for (var i = ts.length; i--;) {
                    var p = ts[i];
                    var range = rm.Range.fromPoints(p.start, p.end || p.start);
                    movePoint(range.start, start);
                    movePoint(range.end, start);
                    range.original = p;
                    range.tabstop = dest;
                    ranges.push(range);
                    if (dest != ts)
                        dest.unshift(range);
                    else
                        dest[i] = range;
                    if (p.fmtString) {
                        range.linked = true;
                        dest.hasLinkedRanges = true;
                    } else if (!dest.firstNonLinked)
                        dest.firstNonLinked = range;
                }
                if (!dest.firstNonLinked)
                    dest.hasLinkedRanges = false;
                if (dest === ts) {
                    arg.push(dest);
                    this.$openTabstops[index] = dest;
                }
                this.addTabstopMarkers(dest);
            }, this);

            if (arg.length > 2) {
                if (this.tabstops.length)
                    arg.push(arg.splice(2, 1)[0]);
                this.tabstops.splice.apply(this.tabstops, arg);
            }
        };
        this.addTabstopMarkers = function (ts) {
            var session = this.editor.session;
            ts.forEach(function (range) {
                if (!range.markerId)
                    range.markerId = session.addMarker(range, "ace_snippet-marker", "text");
            });
        };
        this.removeTabstopMarkers = function (ts) {
            var session = this.editor.session;
            ts.forEach(function (range) {
                session.removeMarker(range.markerId);
                range.markerId = null;
            });
        };
        this.removeRange = function (range) {
            var i = range.tabstop.indexOf(range);
            range.tabstop.splice(i, 1);
            i = this.ranges.indexOf(range);
            this.ranges.splice(i, 1);
            this.editor.session.removeMarker(range.markerId);
            if (!range.tabstop.length) {
                i = this.tabstops.indexOf(range.tabstop);
                if (i != -1)
                    this.tabstops.splice(i, 1);
                if (!this.tabstops.length)
                    this.detach();
            }
        };
        editor[TABSTOP_MANAGER] = this;
        this.$onChange = this.onChange.bind(this);
        this.$onChangeSelection = lang.delayedCall(this.onChangeSelection.bind(this)).schedule;
        this.$onChangeSession = this.onChangeSession.bind(this);
        this.$onAfterExec = this.onAfterExec.bind(this);
        this.attach(editor);
        this.keyboardHandler.bindKeys({
            "Tab": function (ed) {
                if (exports.snippetManager && exports.snippetManager.expandWithTab(ed)) {
                    return;
                } else {
                    ed[TABSTOP_MANAGER].tabNext(1);
                }
            },
            "Shift-Tab": function (ed) {
                ed[TABSTOP_MANAGER].tabNext(-1);
            },
            "Esc": function (ed) {
                ed[TABSTOP_MANAGER].detach();
            },
            "Return": function (ed) {
                return false;
            }
        });
    }
    TabstopManager.prototype.attach = function (editor) {
        this.index = 0;
        this.ranges = [];
        this.tabstops = [];
        this.$openTabstops = null;
        this.selectedTabstop = null;

        this.editor = editor;
        this.editor.on("change", this.$onChange);
        this.editor.on("changeSelection", this.$onChangeSelection);
        this.editor.on("changeSession", this.$onChangeSession);
        this.editor.commands.on("afterExec", this.$onAfterExec);
        this.editor.keyBinding.addKeyboardHandler(this.keyboardHandler);
    };

    TabstopManager.prototype.detach = function () {
        this.tabstops.forEach(this.removeTabstopMarkers, this);
        this.ranges = null;
        this.tabstops = null;
        this.selectedTabstop = null;
        this.editor.removeListener("change", this.$onChange);
        this.editor.removeListener("changeSelection", this.$onChangeSelection);
        this.editor.removeListener("changeSession", this.$onChangeSession);
        this.editor.commands.removeListener("afterExec", this.$onAfterExec);
        this.editor.keyBinding.removeKeyboardHandler(this.keyboardHandler);
        this.editor[TABSTOP_MANAGER] = null;
        this.editor = null;
    };

    TabstopManager.prototype.onChange = function (e) {
        var changeRange = e.data.range;
        var isRemove = e.data.action[0] == "r";
        var start = changeRange.start;
        var end = changeRange.end;
        var startRow = start.row;
        var endRow = end.row;
        var lineDif = endRow - startRow;
        var colDiff = end.column - start.column;

        if (isRemove) {
            lineDif = -lineDif;
            colDiff = -colDiff;
        }
        if (!this.$inChange && isRemove) {
            var ts = this.selectedTabstop;
            var changedOutside = ts && !ts.some(function (r) {
                return comparePoints(r.start, start) <= 0 && comparePoints(r.end, end) >= 0;
            });
            if (changedOutside)
                return this.detach();
        }
        var ranges = this.ranges;
        for (var i = 0; i < ranges.length; i++) {
            var r = ranges[i];
            if (r.end.row < start.row)
                continue;

            if (isRemove && comparePoints(start, r.start) < 0 && comparePoints(end, r.end) > 0) {
                this.removeRange(r);
                i--;
                continue;
            }

            if (r.start.row == startRow && r.start.column > start.column)
                r.start.column += colDiff;
            if (r.end.row == startRow && r.end.column >= start.column)
                r.end.column += colDiff;
            if (r.start.row >= startRow)
                r.start.row += lineDif;
            if (r.end.row >= startRow)
                r.end.row += lineDif;

            if (comparePoints(r.start, r.end) > 0)
                this.removeRange(r);
        }
        if (!ranges.length)
            this.detach();
    };

    TabstopManager.prototype.updateLinkedFields = function () {
        var ts = this.selectedTabstop;
        if (!ts || !ts.hasLinkedRanges)
            return;
        this.$inChange = true;
        var session = this.editor.session;
        var text = session.getTextRange(ts.firstNonLinked);
        for (var i = ts.length; i--;) {
            var range = ts[i];
            if (!range.linked)
                continue;
            var fmt = exports.snippetManager.tmStrFormat(text, range.original);
            session.replace(range, fmt);
        }
        this.$inChange = false;
    };

    TabstopManager.prototype.onAfterExec = function (e) {
        if (e.command && !e.command.readOnly)
            this.updateLinkedFields();
    };

    TabstopManager.prototype.onChangeSelection = function () {
        if (!this.editor)
            return;
        var lead = this.editor.selection.lead;
        var anchor = this.editor.selection.anchor;
        var isEmpty = this.editor.selection.isEmpty();
        for (var i = this.ranges.length; i--;) {
            if (this.ranges[i].linked)
                continue;
            var containsLead = this.ranges[i].contains(lead.row, lead.column);
            var containsAnchor = isEmpty || this.ranges[i].contains(anchor.row, anchor.column);
            if (containsLead && containsAnchor)
                return;
        }
        this.detach();
    };

    TabstopManager.prototype.onChangeSession = function () {
        this.detach();
    };

    TabstopManager.prototype.tabNext = function (dir) {
        var max = this.tabstops.length;
        var index = this.index + (dir || 1);
        index = Math.min(Math.max(index, 1), max);
        if (index == max)
            index = 0;
        this.selectTabstop(index);
        if (index === 0)
            this.detach();
    };

    TabstopManager.prototype.selectTabstop = function (index) {
        this.$openTabstops = null;
        var ts = this.tabstops[this.index];
        if (ts)
            this.addTabstopMarkers(ts);
        this.index = index;
        ts = this.tabstops[this.index];
        if (!ts || !ts.length)
            return;

        this.selectedTabstop = ts;
        if (!this.editor.inVirtualSelectionMode) {
            var sel = this.editor['multiSelect'];
            sel.toSingleRange(ts.firstNonLinked.clone());
            for (var i = ts.length; i--;) {
                if (ts.hasLinkedRanges && ts[i].linked)
                    continue;
                sel.addRange(ts[i].clone(), true);
            }
            if (sel.ranges[0])
                sel.addRange(sel.ranges[0].clone());
        } else {
            this.editor.selection.setRange(ts.firstNonLinked);
        }

        this.editor.keyBinding.addKeyboardHandler(this.keyboardHandler);
    };
    return TabstopManager;
})();

var changeTracker = {};
changeTracker.onChange = am.Anchor.prototype.onChange;
changeTracker.setPosition = function (row, column) {
    this.pos.row = row;
    this.pos.column = column;
};
changeTracker.update = function (pos, delta, $insertRight) {
    this.$insertRight = $insertRight;
    this.pos = pos;
    this.onChange(delta);
};

var movePoint = function (point, diff) {
    if (point.row == 0)
        point.column += diff.column;
    point.row += diff.row;
};

var moveRelative = function (point, start) {
    if (point.row == start.row)
        point.column -= start.column;
    point.row -= start.row;
};

require("./lib/dom").importCssString("\
.ace_snippet-marker {\
    -moz-box-sizing: border-box;\
    box-sizing: border-box;\
    background: rgba(194, 193, 208, 0.09);\
    border: 1px dotted rgba(211, 208, 235, 0.62);\
    position: absolute;\
}");

exports.snippetManager = new SnippetManager();

var Editor = require("./editor").Editor;
(function () {
    this.insertSnippet = function (content, options) {
        return exports.snippetManager.insertSnippet(this, content, options);
    };
    this.expandSnippet = function (options) {
        return exports.snippetManager.expandWithTab(this, options);
    };
}).call(Editor.prototype);
});

ace.define("ace/autocomplete/popup",["require","exports","module","ace/virtual_renderer","ace/editor","ace/range","ace/lib/event","ace/lib/lang","ace/lib/dom"], function(require, exports, module) {
"no use strict";
var vrm = require("../virtual_renderer");
var edm = require("../editor");
var rm = require("../range");
var event = require("../lib/event");
var lng = require("../lib/lang");
var dom = require("../lib/dom");

var noop = function () {
};

var ListViewPopup = (function () {
    function ListViewPopup(parentNode) {
        this.$borderSize = 1;
        this.$imageSize = 0;
        this.hoverMarker = new rm.Range(-1, 0, -1, Infinity);
        this.selectionMarker = new rm.Range(-1, 0, -1, Infinity);
        this.isOpen = false;
        this.isTopdown = false;
        this.data = [];
        var self = this;

        function createEditor(el) {
            var renderer = new vrm.VirtualRenderer(el);

            renderer.content.style.cursor = "default";
            renderer.setStyle("ace_autocomplete");
            renderer.$cursorLayer.restartTimer = noop;
            renderer.$cursorLayer.element.style.opacity = "0";
            renderer.$maxLines = 8;
            renderer.$keepTextAreaAtCursor = false;

            var editor = new edm.Editor(renderer);

            editor.setHighlightActiveLine(false);
            editor.setShowPrintMargin(false);
            editor.renderer.setShowGutter(false);
            editor.renderer.setHighlightGutterLine(false);

            editor.setOption("displayIndentGuides", false);
            editor.setOption("dragDelay", 150);

            editor.focus = noop;
            editor.$isFocused = true;

            editor.setHighlightActiveLine(false);
            editor.session.highlight("");
            editor.session.$searchHighlight.clazz = "ace_highlight-marker";

            return editor;
        }

        var el = dom.createElement("div");
        this.editor = createEditor(el);

        if (parentNode) {
            parentNode.appendChild(el);
        }
        el.style.display = "none";

        this.editor.on("mousedown", function (e) {
            var pos = e.getDocumentPosition();
            self.editor.selection.moveToPosition(pos);
            self.selectionMarker.start.row = self.selectionMarker.end.row = pos.row;
            e.stop();
        });

        this.selectionMarkerId = this.editor.session.addMarker(this.selectionMarker, "ace_active-line", "fullLine");

        this.setSelectOnHover(false);

        this.editor.on("mousemove", function (e) {
            if (!self.lastMouseEvent) {
                self.lastMouseEvent = e;
                return;
            }
            if (self.lastMouseEvent.x == e.x && self.lastMouseEvent.y == e.y) {
                return;
            }
            self.lastMouseEvent = e;
            self.lastMouseEventScrollTop = self.editor.renderer.scrollTop;
            var row = self.lastMouseEvent.getDocumentPosition().row;
            if (self.hoverMarker.start.row != row) {
                if (!self.hoverMarkerId) {
                    self.setRow(row);
                }
                self.setHoverMarker(row);
            }
        });
        this.editor.renderer.on("beforeRender", function () {
            if (self.lastMouseEvent && self.hoverMarker.start.row != -1) {
                self.lastMouseEvent.$pos = null;
                var row = self.lastMouseEvent.getDocumentPosition().row;
                if (!self.hoverMarkerId) {
                    self.setRow(row);
                }
                self.setHoverMarker(row, true);
            }
        });
        this.editor.renderer.on("afterRender", function () {
            var row = self.getRow();
            var t = self.editor.renderer.$textLayer;
            var selected = t.element.childNodes[row - t.config.firstRow];
            if (selected == t.selectedNode)
                return;
            if (t.selectedNode)
                dom.removeCssClass(t.selectedNode, "ace_selected");
            t.selectedNode = selected;
            if (selected)
                dom.addCssClass(selected, "ace_selected");
        });

        function hideHoverMarker() {
            self.setHoverMarker(-1);
        }

        event.addListener(this.editor.container, "mouseout", hideHoverMarker);
        this.editor.on("hide", hideHoverMarker);
        this.editor.on("changeSelection", hideHoverMarker);

        this.editor.session.doc.getLength = function () {
            return self.data.length;
        };
        this.editor.session.doc.getLine = function (i) {
            var data = self.data[i];
            if (typeof data == "string") {
                return data;
            }
            return (data && data.value) || "";
        };

        var bgTokenizer = this.editor.session.bgTokenizer;
        bgTokenizer.$tokenizeRow = function (dataIndex) {
            var data = self.data[dataIndex];
            var tokens = [];
            if (!data)
                return tokens;
            if (typeof data == "string")
                data = { value: data };
            if (!data.caption)
                data.caption = data.value || data.name;

            var last = -1;
            var flag, c;
            for (var cIndex = 0, length = data.caption.length; cIndex < length; cIndex++) {
                c = data.caption[cIndex];
                flag = data.matchMask & (1 << cIndex) ? 1 : 0;
                if (last !== flag) {
                    tokens.push({ type: data.className || "" + (flag ? "completion-highlight" : ""), value: c });
                    last = flag;
                } else {
                    tokens[tokens.length - 1].value += c;
                }
            }

            if (data.meta) {
                var maxW = self.editor.renderer.$size.scrollerWidth / self.editor.renderer.layerConfig.characterWidth;
                if (data.meta.length + data.caption.length < maxW - 2)
                    tokens.push({ type: "rightAlignedText", value: data.meta });
            }
            return tokens;
        };
        bgTokenizer.$updateOnChange = noop;
        bgTokenizer.start = noop;

        this.editor.session.$computeWidth = function () {
            return self.screenWidth = 0;
        };

        this.editor.on("changeSelection", function () {
            if (this.isOpen) {
                this.setRow(this.popup.selection.lead.row);
            }
        });
    }
    ListViewPopup.prototype.show = function (pos, lineHeight, topdownOnly) {
        var el = this.editor.container;
        var screenHeight = window.innerHeight;
        var screenWidth = window.innerWidth;
        var renderer = this.editor.renderer;
        var maxH = renderer.$maxLines * lineHeight * 1.4;
        var top = pos.top + this.$borderSize;
        if (top + maxH > screenHeight - lineHeight && !topdownOnly) {
            el.style.top = "";
            el.style.bottom = screenHeight - top + "px";
            this.isTopdown = false;
        } else {
            top += lineHeight;
            el.style.top = top + "px";
            el.style.bottom = "";
            this.isTopdown = true;
        }

        el.style.display = "";
        renderer.$textLayer.checkForSizeChanges();

        var left = pos.left;
        if (left + el.offsetWidth > screenWidth) {
            left = screenWidth - el.offsetWidth;
        }

        el.style.left = left + "px";

        this.editor._signal("show");
        this.lastMouseEvent = null;
        this.isOpen = true;
    };
    ListViewPopup.prototype.hide = function () {
        this.editor.container.style.display = "none";
        this.editor._signal("hide");
        this.isOpen = false;
    };
    ListViewPopup.prototype.setData = function (list) {
        this.data = list || [];
        this.editor.setValue(lng.stringRepeat("\n", list.length), -1);
        this.setRow(0);
    };
    ListViewPopup.prototype.getData = function (row) {
        return this.data[row];
    };
    ListViewPopup.prototype.on = function (eventName, callback, capturing) {
        return this.editor.on(eventName, callback, capturing);
    };
    ListViewPopup.prototype.getTextLeftOffset = function () {
        return this.$borderSize + this.editor.renderer.$padding + this.$imageSize;
    };
    ListViewPopup.prototype.setSelectOnHover = function (val) {
        if (!val) {
            this.hoverMarkerId = this.editor.session.addMarker(this.hoverMarker, "ace_line-hover", "fullLine");
        } else if (this.hoverMarkerId) {
            this.editor.session.removeMarker(this.hoverMarkerId);
            this.hoverMarkerId = null;
        }
    };
    ListViewPopup.prototype.setHoverMarker = function (row, suppressRedraw) {
        if (row !== this.hoverMarker.start.row) {
            this.hoverMarker.start.row = this.hoverMarker.end.row = row;
            if (!suppressRedraw) {
                this.editor.session._emit("changeBackMarker");
            }
            this.editor._emit("changeHoverMarker");
        }
    };
    ListViewPopup.prototype.getHoveredRow = function () {
        return this.hoverMarker.start.row;
    };
    ListViewPopup.prototype.getRow = function () {
        return this.selectionMarker.start.row;
    };
    ListViewPopup.prototype.setRow = function (row) {
        row = Math.max(-1, Math.min(this.data.length, row));
        if (this.selectionMarker.start.row != row) {
            this.editor.selection.clearSelection();
            this.selectionMarker.start.row = this.selectionMarker.end.row = row || 0;
            this.editor.session._emit("changeBackMarker");
            this.editor.moveCursorTo(row || 0, 0);
            if (this.isOpen) {
                this.editor._signal("select");
            }
        }
    };
    ListViewPopup.prototype.setTheme = function (theme) {
        this.editor.setTheme(theme);
    };
    ListViewPopup.prototype.setFontSize = function (fontSize) {
        this.editor.setFontSize(fontSize);
    };

    Object.defineProperty(ListViewPopup.prototype, "focus", {
        get: function () {
            return this.editor.focus;
        },
        enumerable: true,
        configurable: true
    });

    ListViewPopup.prototype.getLength = function () {
        return this.editor.session.getLength();
    };

    Object.defineProperty(ListViewPopup.prototype, "container", {
        get: function () {
            return this.editor.container;
        },
        enumerable: true,
        configurable: true
    });
    return ListViewPopup;
})();
exports.ListViewPopup = ListViewPopup;

dom.importCssString("\
.ace_editor.ace_autocomplete .ace_marker-layer .ace_active-line {\
    background-color: #CAD6FA;\
    z-index: 1;\
}\
.ace_editor.ace_autocomplete .ace_line-hover {\
    border: 1px solid #abbffe;\
    margin-top: -1px;\
    background: rgba(233,233,253,0.4);\
}\
.ace_editor.ace_autocomplete .ace_line-hover {\
    position: absolute;\
    z-index: 2;\
}\
.ace_editor.ace_autocomplete .ace_scroller {\
   background: none;\
   border: none;\
   box-shadow: none;\
}\
.ace_rightAlignedText {\
    color: gray;\
    display: inline-block;\
    position: absolute;\
    right: 4px;\
    text-align: right;\
    z-index: -1;\
}\
.ace_editor.ace_autocomplete .ace_completion-highlight{\
    color: #000;\
    text-shadow: 0 0 0.01em;\
}\
.ace_editor.ace_autocomplete {\
    width: 280px;\
    z-index: 200000;\
    background: #fbfbfb;\
    color: #444;\
    border: 1px lightgray solid;\
    position: fixed;\
    box-shadow: 2px 3px 5px rgba(0,0,0,.2);\
    line-height: 1.4;\
}");
});

ace.define("ace/autocomplete/util",["require","exports","module"], function(require, exports, module) {
"no use strict";
function parForEach(array, fn, callback) {
    var completed = 0;
    var arLength = array.length;
    if (arLength === 0)
        callback();
    for (var i = 0; i < arLength; i++) {
        fn(array[i], function (result, err) {
            completed++;
            if (completed === arLength)
                callback(result, err);
        });
    }
}
exports.parForEach = parForEach;

var ID_REGEX = /[a-zA-Z_0-9\$\-\u00A2-\uFFFF]/;

function retrievePrecedingIdentifier(text, pos, regex) {
    regex = regex || ID_REGEX;
    var buf = [];
    for (var i = pos - 1; i >= 0; i--) {
        if (regex.test(text[i]))
            buf.push(text[i]);
        else
            break;
    }
    return buf.reverse().join("");
}
exports.retrievePrecedingIdentifier = retrievePrecedingIdentifier;
function retrieveFollowingIdentifier(text, pos, regex) {
    regex = regex || ID_REGEX;
    var buf = [];
    for (var i = pos; i < text.length; i++) {
        if (regex.test(text[i]))
            buf.push(text[i]);
        else
            break;
    }
    return buf;
}
exports.retrieveFollowingIdentifier = retrieveFollowingIdentifier;
});

ace.define("ace/autocomplete",["require","exports","module","ace/keyboard/hash_handler","ace/autocomplete/popup","ace/autocomplete/util","ace/lib/lang","ace/snippets"], function(require, exports, module) {
"no use strict";
var hhm = require("./keyboard/hash_handler");
var pop = require("./autocomplete/popup");
var util = require("./autocomplete/util");

var lang = require("./lib/lang");
var snm = require("./snippets");

var EDITOR_EXT_COMPLETER = 'completer';

function getCompleter(editor) {
    return editor[EDITOR_EXT_COMPLETER];
}
exports.getCompleter = getCompleter;

function setCompleter(editor, completer) {
    editor[EDITOR_EXT_COMPLETER] = completer;
}
exports.setCompleter = setCompleter;

var CompleterAggregate = (function () {
    function CompleterAggregate(editor) {
        this.keyboardHandler = new hhm.HashHandler();
        this.gatherCompletionsId = 0;
        this.autoSelect = true;
        this.autoInsert = true;
        this.showPopup = function (editor) {
            if (this.editor) {
                this.detach();
            }

            this.activated = true;

            this.editor = editor;

            if (exports.getCompleter(editor) != this) {
                if (exports.getCompleter(editor)) {
                    exports.getCompleter(editor).detach();
                }
                exports.setCompleter(editor, this);
            }

            editor.keyBinding.addKeyboardHandler(this.keyboardHandler);
            editor.on("changeSelection", this.changeListener);
            editor.on("blur", this.blurListener);
            editor.on("mousedown", this.mousedownListener);
            editor.on("mousewheel", this.mousewheelListener);

            this.updateCompletions();
        };
        this.editor = editor;
        this.commands = {
            "Up": function (editor) {
                exports.getCompleter(editor).goTo("up");
            },
            "Down": function (editor) {
                exports.getCompleter(editor).goTo("down");
            },
            "Ctrl-Up|Ctrl-Home": function (editor) {
                exports.getCompleter(editor).goTo("start");
            },
            "Ctrl-Down|Ctrl-End": function (editor) {
                exports.getCompleter(editor).goTo("end");
            },
            "Esc": function (editor) {
                exports.getCompleter(editor).detach();
            },
            "Space": function (editor) {
                exports.getCompleter(editor).detach();
                editor.insert(" ");
            },
            "Return": function (editor) {
                return exports.getCompleter(editor).insertMatch();
            },
            "Shift-Return": function (editor) {
                exports.getCompleter(editor).insertMatch(true);
            },
            "Tab": function (editor) {
                var result = exports.getCompleter(editor).insertMatch();
                if (!result && !editor['tabstopManager']) {
                    exports.getCompleter(editor).goTo("down");
                } else
                    return result;
            },
            "PageUp": function (editor) {
                exports.getCompleter(editor).goTo('pageUp');
            },
            "PageDown": function (editor) {
                exports.getCompleter(editor).goTo('pageDown');
            }
        };

        this.keyboardHandler.bindKeys(this.commands);

        this.blurListener = this.blurListener.bind(this);
        this.changeListener = this.changeListener.bind(this);
        this.mousedownListener = this.mousedownListener.bind(this);
        this.mousewheelListener = this.mousewheelListener.bind(this);

        this.changeTimer = lang.delayedCall(function () {
            this.updateCompletions(true);
        }.bind(this));
    }
    CompleterAggregate.prototype.insertMatch = function (data) {
        if (!data) {
            data = this.popup.getData(this.popup.getRow());
        }

        if (!data) {
            return;
        }

        if (data.completer && data.completer.insertMatch) {
            data.completer.insertMatch(this.editor);
        } else {
            if (this.completions.filterText) {
                var ranges = this.editor.selection['getAllRanges']();

                for (var i = 0, range; range = ranges[i]; i++) {
                    range.start.column -= this.completions.filterText.length;
                    this.editor.session.remove(range);
                }
            }
            if (data.snippet) {
                snm.snippetManager.insertSnippet(this.editor, data.snippet);
            } else {
                this.editor.execCommand("insertstring", data.value || data);
            }
        }
        this.detach();
    };
    CompleterAggregate.prototype.detach = function () {
        this.editor.keyBinding.removeKeyboardHandler(this.keyboardHandler);
        this.editor.off("changeSelection", this.changeListener);
        this.editor.off("blur", this.blurListener);
        this.editor.off("mousedown", this.mousedownListener);
        this.editor.off("mousewheel", this.mousewheelListener);
        this.changeTimer.cancel();

        if (this.popup && this.popup.isOpen) {
            this.gatherCompletionsId += 1;
            this.popup.hide();
        }

        if (this.base)
            this.base.detach();
        this.activated = false;
        this.completions = this.base = null;
    };
    CompleterAggregate.prototype.goTo = function (where) {
        var row = this.popup.getRow();
        var max = this.popup.getLength() - 1;

        switch (where) {
            case "up":
                row = row <= 0 ? max : row - 1;
                break;
            case "down":
                row = row >= max ? -1 : row + 1;
                break;
            case "start":
                row = 0;
                break;
            case "end":
                row = max;
                break;
        }

        this.popup.setRow(row);
    };
    CompleterAggregate.prototype.getCompletions = function (editor, session, pos, prefix, callback) {
        this.base = session.doc.createAnchor(pos.row, pos.column - prefix.length);

        var matches = [];
        var total = editor.completers.length;
        editor.completers.forEach(function (completer, i) {
            completer.getCompletions(editor, session, pos, prefix, function (err, results) {
                if (!err)
                    matches = matches.concat(results);
                var pos = editor.getCursorPosition();
                var line = session.getLine(pos.row);
                callback(null, {
                    prefix: util.retrievePrecedingIdentifier(line, pos.column, results[0] && results[0].identifierRegex),
                    matches: matches,
                    finished: (--total === 0)
                });
            });
        });
        return true;
    };

    CompleterAggregate.prototype.updateCompletions = function (keepPopupPosition) {
        var pos = this.editor.getCursorPosition();
        var prefix;
        if (keepPopupPosition && this.base && this.completions) {
            prefix = this.editor.session.getTextRange({ start: this.base, end: pos });
            if (prefix == this.completions.filterText)
                return;
            this.completions.setFilter(prefix);
            if (!this.completions.filtered.length)
                return this.detach();

            if (this.completions.filtered.length == 1 && this.completions.filtered[0].value == prefix && !this.completions.filtered[0].snippet) {
                return this.detach();
            }

            this.openPopup(this.editor, prefix, keepPopupPosition);
        } else {
            var _id = this.gatherCompletionsId;
            var editor = this.editor;
            var session = editor.getSession();
            var line = session.getLine(pos.row);
            prefix = util.retrievePrecedingIdentifier(line, pos.column);
            this.getCompletions(this.editor, session, this.editor.getCursorPosition(), prefix, function (err, results) {
                var detachIfFinished = function () {
                    if (!results.finished)
                        return;
                    return this.detach();
                }.bind(this);

                var prefix = results.prefix;
                var matches = results && results.matches;

                if (!matches || !matches.length)
                    return detachIfFinished();
                if (prefix.indexOf(results.prefix) !== 0 || _id != this.gatherCompletionsId)
                    return;

                this.completions = new FilteredList(matches);
                this.completions.setFilter(prefix);
                var filtered = this.completions.filtered;
                if (!filtered.length)
                    return detachIfFinished();
                if (filtered.length == 1 && filtered[0].value == prefix && !filtered[0].snippet)
                    return detachIfFinished();
                if (this.autoInsert && filtered.length == 1)
                    return this.insertMatch(filtered[0]);

                this.openPopup(this.editor, prefix, keepPopupPosition);
            }.bind(this));
        }
    };

    CompleterAggregate.prototype.openPopup = function (editor, prefix, keepPopupPosition) {
        if (!this.popup) {
            this.popup = new pop.ListViewPopup(document.body || document.documentElement);
            this.popup.on("click", function (e) {
                this.insertMatch();
                e.stop();
            }.bind(this));
            this.popup.focus = this.editor.focus.bind(this.editor);
        }

        this.popup.setData(this.completions.filtered);

        this.popup.setRow(this.autoSelect ? 0 : -1);

        if (!keepPopupPosition) {
            this.popup.setTheme(editor.getTheme());
            this.popup.setFontSize(editor.getFontSize());

            var lineHeight = editor.renderer.layerConfig.lineHeight;

            var pos = editor.renderer.$cursorLayer.getPixelPosition(this.base, true);
            pos.left -= this.popup.getTextLeftOffset();

            var rect = editor.container.getBoundingClientRect();
            pos.top += rect.top - editor.renderer.layerConfig.offset;
            pos.left += rect.left - editor.renderer.scrollLeft;
            pos.left += editor.renderer.$gutterLayer.gutterWidth;

            this.popup.show(pos, lineHeight);
        }
    };

    CompleterAggregate.prototype.changeListener = function (e) {
        var cursor = this.editor.selection.lead;
        if (cursor.row != this.base.row || cursor.column < this.base.column) {
            this.detach();
        }
        if (this.activated)
            this.changeTimer.schedule();
        else
            this.detach();
    };

    CompleterAggregate.prototype.blurListener = function () {
        var el = document.activeElement;
        if (el != this.editor.textInput.getElement() && el.parentNode != this.popup.container) {
            this.detach();
        }
    };

    CompleterAggregate.prototype.mousedownListener = function (e) {
        this.detach();
    };

    CompleterAggregate.prototype.mousewheelListener = function (e) {
        this.detach();
    };

    CompleterAggregate.prototype.cancelContextMenu = function () {
        this.editor.cancelMouseContextMenu();
    };
    return CompleterAggregate;
})();
exports.CompleterAggregate = CompleterAggregate;
var Autocomplete = (function () {
    function Autocomplete() {
    }
    Autocomplete.startCommand = {
        name: "startAutocomplete",
        exec: function (editor) {
            var aggregate = exports.getCompleter(editor);
            if (!aggregate) {
                aggregate = new CompleterAggregate(editor);
                exports.setCompleter(editor, aggregate);
            }
            aggregate.autoInsert = true;
            aggregate.autoSelect = true;
            aggregate.showPopup(editor);
            aggregate.cancelContextMenu();
        },
        bindKey: "Ctrl-Space|Ctrl-Shift-Space|Alt-Space"
    };
    return Autocomplete;
})();
exports.Autocomplete = Autocomplete;

var FilteredList = (function () {
    function FilteredList(all, filterText, mutateData) {
        this.all = all;
        this.filtered = all;
        this.filterText = filterText || "";
    }
    FilteredList.prototype.setFilter = function (str) {
        var matches;
        if (str.length > this.filterText && str.lastIndexOf(this.filterText, 0) === 0)
            matches = this.filtered;
        else
            matches = this.all;

        this.filterText = str;
        matches = this.filterCompletions(matches, this.filterText);
        matches = matches.sort(function (a, b) {
            return b.exactMatch - a.exactMatch || b.score - a.score;
        });
        var prev = null;
        matches = matches.filter(function (item) {
            var caption = item.value || item.caption || item.snippet;
            if (caption === prev)
                return false;
            prev = caption;
            return true;
        });

        this.filtered = matches;
    };
    FilteredList.prototype.filterCompletions = function (items, needle) {
        var results = [];
        var upper = needle.toUpperCase();
        var lower = needle.toLowerCase();

        loop:
        for (var i = 0, length = items.length; i < length; i++) {
            var item = items[i];
            var caption = item.value || item.caption || item.snippet;
            if (!caption)
                continue;
            var lastIndex = -1;
            var matchMask = 0;
            var penalty = 0;
            var index, distance;

            for (var j = 0; j < needle.length; j++) {
                var i1 = caption.indexOf(lower[j], lastIndex + 1);
                var i2 = caption.indexOf(upper[j], lastIndex + 1);
                index = (i1 >= 0) ? ((i2 < 0 || i1 < i2) ? i1 : i2) : i2;
                if (index < 0)
                    continue loop;
                distance = index - lastIndex - 1;
                if (distance > 0) {
                    if (lastIndex === -1)
                        penalty += 10;
                    penalty += distance;
                }
                matchMask = matchMask | (1 << index);
                lastIndex = index;
            }
            item.matchMask = matchMask;
            item.exactMatch = penalty ? 0 : 1;
            item.score = (item.score || 0) - penalty;
            results.push(item);
        }
        return results;
    };
    return FilteredList;
})();
exports.FilteredList = FilteredList;
});

ace.define("ace/ext/language_tools",["require","exports","module","ace/snippets","ace/autocomplete","ace/config","ace/autocomplete/util","ace/editor"], function(require, exports, module) {
"no use strict";
var snip = require("../snippets");
var acm = require("../autocomplete");
var config = require("../config");
var util = require("../autocomplete/util");
var edm = require("../editor");
exports.keyWordCompleter = {
    getCompletions: function (editor, session, pos, prefix, callback) {
        var state = editor.session.getState(pos.row);
        var completions = session.$mode.getCompletions(state, session, pos, prefix);
        callback(null, completions);
    }
};

exports.snippetCompleter = {
    getCompletions: function (editor, session, pos, prefix, callback) {
        var snippetMap = snip.snippetManager.snippetMap;
        var completions = [];
        snip.snippetManager.getActiveScopes(editor).forEach(function (scope) {
            var snippets = snippetMap[scope] || [];
            for (var i = snippets.length; i--;) {
                var s = snippets[i];
                var caption = s.name || s.tabTrigger;
                if (!caption)
                    continue;
                completions.push({
                    caption: caption,
                    snippet: s.content,
                    meta: s.tabTrigger && !s.name ? s.tabTrigger + "\u21E5 " : "snippet"
                });
            }
        }, this);
        callback(null, completions);
    }
};

var completers = [exports.snippetCompleter, exports.keyWordCompleter];

function addCompleter(completer) {
    completers.push(completer);
}
exports.addCompleter = addCompleter;
;

var expandSnippet = {
    name: 'expandSnippet',
    exec: function (editor) {
        var success = snip.snippetManager.expandWithTab(editor);
        if (!success) {
            editor.execCommand('indent');
        }
    },
    bindKey: 'Tab'
};

var onChangeMode = function (e, editor) {
    loadSnippetsForMode(editor.session.$mode);
};

var loadSnippetsForMode = function (mode) {
    var id = mode.$id;
    if (!snip.snippetManager['files']) {
        snip.snippetManager['files'] = {};
    }
    loadSnippetFile(id);
    if (mode.modes)
        mode.modes.forEach(loadSnippetsForMode);
};

var loadSnippetFile = function (id) {
    if (!id || snip.snippetManager['files'][id])
        return;
    var snippetFilePath = id.replace("mode", "snippets");
    snip.snippetManager['files'][id] = {};
    config.loadModule(snippetFilePath, function (m) {
        if (m) {
            snip.snippetManager['files'][id] = m;
            if (!m.snippets && m.snippetText)
                m.snippets = snip.snippetManager.parseSnippetFile(m.snippetText);
            snip.snippetManager.register(m.snippets || [], m.scope);
            if (m.includeScopes) {
                snip.snippetManager.snippetMap[m.scope].includeScopes = m.includeScopes;
                m.includeScopes.forEach(function (x) {
                    loadSnippetFile("ace/mode/" + x);
                });
            }
        }
    });
};

function getCompletionPrefix(editor) {
    var pos = editor.getCursorPosition();
    var line = editor.session.getLine(pos.row);
    var prefix = util.retrievePrecedingIdentifier(line, pos.column);
    editor.completers.forEach(function (completer) {
        if (completer['identifierRegexps']) {
            completer['identifierRegexps'].forEach(function (identifierRegex) {
                if (!prefix && identifierRegex) {
                    prefix = util.retrievePrecedingIdentifier(line, pos.column, identifierRegex);
                }
            });
        }
    });
    return prefix;
}

var doLiveAutocomplete = function (e) {
    var editor = e.editor;
    var text = e.args || "";
    var hasCompleter = acm.getCompleter(editor) && acm.getCompleter(editor).activated;
    if (e.command.name === "backspace") {
        if (hasCompleter && !getCompletionPrefix(editor))
            acm.getCompleter(editor).detach();
    } else if (e.command.name === "insertstring") {
        var prefix = getCompletionPrefix(editor);
        if (prefix && !hasCompleter) {
            if (!acm.getCompleter(editor)) {
                acm.setCompleter(editor, new acm.CompleterAggregate(editor));
            }
            acm.getCompleter(editor).autoSelect = false;
            acm.getCompleter(editor).autoInsert = false;
            acm.getCompleter(editor).showPopup(editor);
        }
    }
};

config.defineOptions(edm.Editor.prototype, 'editor', {
    enableBasicAutocompletion: {
        set: function (val) {
            var editor = this;
            if (val) {
                if (!editor.completers) {
                    editor.completers = Array.isArray(val) ? val : completers;
                }
                editor.commands.addCommand(acm.Autocomplete.startCommand);
            } else {
                editor.commands.removeCommand(acm.Autocomplete.startCommand.name);
            }
        },
        value: false
    },
    enableLiveAutocompletion: {
        set: function (val) {
            var editor = this;
            if (val) {
                if (!editor.completers) {
                    editor.completers = Array.isArray(val) ? val : completers;
                }
                editor.commands.on('afterExec', doLiveAutocomplete);
            } else {
                editor.commands.off('afterExec', doLiveAutocomplete);
            }
        },
        value: false
    },
    enableSnippets: {
        set: function (val) {
            var editor = this;
            if (val) {
                editor.commands.addCommand(expandSnippet);
                editor.on("changeMode", onChangeMode);
                onChangeMode(null, editor);
            } else {
                editor.commands.removeCommand(expandSnippet.name);
                editor.off("changeMode", onChangeMode);
            }
        },
        value: false
    }
});
});
;
                (function() {
                    ace.require(["ace/ext/language_tools"], function() {});
                })();
            