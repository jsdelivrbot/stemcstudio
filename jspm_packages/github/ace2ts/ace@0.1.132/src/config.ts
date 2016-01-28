/* ***** BEGIN LICENSE BLOCK *****
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2016 David Geo Holmes <david.geo.holmes@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * ***** END LICENSE BLOCK ***** */
/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */
import {copyObject} from "./lib/lang";
import {implement} from "./lib/oop";
import {loadScript} from "./lib/net";

var global = (function() {
    return this || typeof window !== 'undefined' && window;
})();

var options: { packaged: boolean; workerPath: string; modePath: string; themePath: string; basePath: string; suffix: string; $moduleUrls: { [name: string]: string } } = {
    packaged: false,
    workerPath: null,
    modePath: null,
    themePath: null,
    basePath: "",
    suffix: ".js",
    $moduleUrls: {}
};

export function get(key: string) {
    if (!options.hasOwnProperty(key)) {
        throw new Error("Unknown config key: " + key);
    }
    return options[key];
}

export function set(key: string, value) {
    if (!options.hasOwnProperty(key)) {
        throw new Error("Unknown config key: " + key);
    }
    options[key] = value;
}

export function all() {
    return copyObject(options);
}

/**
 *
 */
export function moduleUrl(moduleName: string, component: string): string {
    if (options.$moduleUrls[moduleName]) {
        return options.$moduleUrls[moduleName];
    }

    var parts = moduleName.split("/");
    component = component || parts[parts.length - 2] || "";

    // TODO: Configurable or get rid of '-'?
    var sep: string = component === "snippets" ? "/" : "-";
    var base: string = parts[parts.length - 1];
    if (component === 'worker' && sep === '-') {
        var re = new RegExp("^" + component + "[\\-_]|[\\-_]" + component + "$", "g");
        base = base.replace(re, "");
    }

    if ((!base || base == component) && parts.length > 1) {
        base = parts[parts.length - 2];
    }
    var path: string = options[component + "Path"];
    if (path == null) {
        path = options.basePath;
    }
    else if (sep == "/") {
        component = sep = "";
    }
    if (path && path.slice(-1) != "/") {
        path += "/";
    }
    return path + component + sep + base + get("suffix");
}

export function setModuleUrl(name: string, subst: string) {
    return options.$moduleUrls[name] = subst;
}

/**
 * A map from module name to an array of callbacks.
 */
export var $loading: { [name: string]: ((m) => any)[] } = {};

/**
 *
 */
export function loadModule(what: string | string[], onLoad: (m) => any, doc: Document = document) {
    var module;
    var moduleName: string;
    var moduleType: string;
    if (Array.isArray(what)) {
        moduleType = what[0];
        moduleName = what[1];
    }
    else {
        moduleName = what;
    }

    try {
        // FIXME: What does this do?
        // module = require(moduleName);
    }
    catch (e) { }
    // require(moduleName) can return empty object if called after require([moduleName], callback)
    if (module && !$loading[moduleName])
        return onLoad && onLoad(module);

    if (!$loading[moduleName]) {
        $loading[moduleName] = [];
    }

    $loading[moduleName].push(onLoad);

    if ($loading[moduleName].length > 1)
        return;

    var afterLoad = function() {
        // FIXME: Re-instate
        /*
        require([moduleName], function(module) {
            exports._emit("load.module", { name: moduleName, module: module });
            //
            // A local copy of all the listeners who want to hear when the module has loaded.
            // We make a local copy because we are going to clear the entry for the module.
            //
            var listeners = $loading[moduleName];
            $loading[moduleName] = null;
            listeners.forEach(function(onLoad) {
                onLoad && onLoad(module);
            });
        });
        */
    };

    // What is this special name?
    if (!get("packaged")) {
        return afterLoad();
    }

    // Delegate the loading of the script but hook the notification.
    loadScript(moduleUrl(moduleName, moduleType), afterLoad, doc);
}


// initialization
declare var module: any;
/**
 * Who calls this function?
 */
export function init(packaged: boolean) {
    // FIXME: Restore require of 'packaged' and define.
    options.packaged = packaged /*|| require['packaged']*/ || module.packaged /*|| (global.define && define['packaged'])*/;

    if (!global.document)
        return "";

    var scriptOptions: { [name: string]: any } = {};
    var scriptUrl = "";

    // Use currentScript.ownerDocument in case this file was loaded from imported document. (HTML Imports)
    var currentScript: HTMLScriptElement = (document['currentScript'] || document['_currentScript']); // native or polyfill
    var currentDocument = currentScript && currentScript.ownerDocument || document;

    var scripts: NodeListOf<HTMLScriptElement> = currentDocument.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
        var script = scripts[i];

        var src = script.src || script.getAttribute("src");
        if (!src)
            continue;

        var attributes: NamedNodeMap = script.attributes;
        for (var j = 0, l = attributes.length; j < l; j++) {
            var attr: Attr = attributes[j];
            if (attr.name.indexOf("data-ace-") === 0) {
                scriptOptions[deHyphenate(attr.name.replace(/^data-ace-/, ""))] = attr.value;
            }
        }

        var m: RegExpMatchArray = src.match(/^(.*)\/ace(\-\w+)?\.js(\?|$)/);
        if (m) {
            scriptUrl = m[1];
        }
    }

    if (scriptUrl) {
        scriptOptions['base'] = scriptOptions['base'] || scriptUrl;
        scriptOptions['packaged'] = true;
    }

    scriptOptions['basePath'] = scriptOptions['base'];
    scriptOptions['workerPath'] = scriptOptions['workerPath'] || scriptOptions['base'];
    scriptOptions['modePath'] = scriptOptions['modePath'] || scriptOptions['base'];
    scriptOptions['themePath'] = scriptOptions['themePath'] || scriptOptions['base'];
    delete scriptOptions['base'];

    for (var key in scriptOptions)
        if (typeof scriptOptions[key] !== "undefined")
            set(key, scriptOptions[key]);
};

function deHyphenate(str: string): string {
    return str.replace(/-(.)/g, function(m: string, m1: string) { return m1.toUpperCase(); });
}

// FIXME: Make this an OptionsProviderMixIn
var optionsProvider = {
    setOptions: function(optList) {
        Object.keys(optList).forEach(function(key) {
            this.setOption(key, optList[key]);
        }, this);
    },
    getOptions: function(optionNames) {
        var result = {};
        if (!optionNames) {
            optionNames = Object.keys(this.$options);
        } else if (!Array.isArray(optionNames)) {
            result = optionNames;
            optionNames = Object.keys(result);
        }
        optionNames.forEach(function(key) {
            result[key] = this.getOption(key);
        }, this);
        return result;
    },
    setOption: function(name, value) {
        if (this["$" + name] === value)
            return;
        var opt = this.$options[name];
        if (!opt) {
            if (typeof console != "undefined" && console.warn)
                console.warn('misspelled option "' + name + '"');
            return undefined;
        }
        if (opt.forwardTo)
            return this[opt.forwardTo] && this[opt.forwardTo].setOption(name, value);

        if (!opt.handlesSet)
            this["$" + name] = value;
        if (opt && opt.set)
            opt.set.call(this, value);
    },
    getOption: function(name) {
        var opt = this.$options[name];
        if (!opt) {
            if (typeof console != "undefined" && console.warn)
                console.warn('misspelled option "' + name + '"');
            return undefined;
        }
        if (opt.forwardTo)
            return this[opt.forwardTo] && this[opt.forwardTo].getOption(name);
        return opt && opt.get ? opt.get.call(this) : this["$" + name];
    }
};

var defaultOptions = {};
/*
 * option {name, value, initialValue, setterName, set, get }
 */
export function defineOptions(obj, path: string, options) {
    if (!obj.$options) {
        defaultOptions[path] = obj.$options = {};
    }

    Object.keys(options).forEach(function(key) {
        var opt = options[key];
        if (typeof opt === "string") {
            opt = { forwardTo: opt };
        }

        opt.name || (opt.name = key);
        obj.$options[opt.name] = opt;
        if ("initialValue" in opt) {
            obj["$" + opt.name] = opt.initialValue;
        }
    });

    // implement option provider interface
    implement(obj, optionsProvider);

    return this;
}

export function resetOptions(obj) {
    Object.keys(obj.$options).forEach(function(key) {
        var opt = obj.$options[key];
        if ("value" in opt) {
            obj.setOption(key, opt.value);
        }
    });
}

export function setDefaultValue(path, name, value) {
    var opts = defaultOptions[path] || (defaultOptions[path] = {});
    if (opts[name]) {
        if (opts.forwardTo)
            setDefaultValue(opts.forwardTo, name, value);
        else
            opts[name].value = value;
    }
}

export function setDefaultValues(path, optionHash) {
    Object.keys(optionHash).forEach(function(key) {
        setDefaultValue(path, key, optionHash[key]);
    });
}
