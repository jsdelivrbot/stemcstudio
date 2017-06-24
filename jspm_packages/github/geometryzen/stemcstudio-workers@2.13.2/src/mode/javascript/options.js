System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var bool, val, inverted, validNames, renamed, removed, noenforceall;
    return {
        setters: [],
        execute: function () {
            exports_1("bool", bool = {
                enforcing: {
                    bitwise: true,
                    freeze: true,
                    camelcase: true,
                    curly: true,
                    eqeqeq: true,
                    futurehostile: true,
                    notypeof: true,
                    es3: true,
                    es5: true,
                    forin: true,
                    funcscope: true,
                    immed: true,
                    iterator: true,
                    newcap: true,
                    noarg: true,
                    nocomma: true,
                    noempty: true,
                    nonbsp: true,
                    nonew: true,
                    undef: true,
                    singleGroups: false,
                    varstmt: false,
                    enforceall: false
                },
                relaxing: {
                    asi: true,
                    multistr: true,
                    debug: true,
                    boss: true,
                    evil: true,
                    globalstrict: true,
                    plusplus: true,
                    proto: true,
                    scripturl: true,
                    sub: true,
                    supernew: true,
                    laxbreak: true,
                    laxcomma: true,
                    validthis: true,
                    withstmt: true,
                    moz: true,
                    noyield: true,
                    eqnull: true,
                    lastsemic: true,
                    loopfunc: true,
                    expr: true,
                    esnext: true,
                    elision: true,
                },
                environments: {
                    mootools: true,
                    couch: true,
                    jasmine: true,
                    jquery: true,
                    node: true,
                    qunit: true,
                    rhino: true,
                    shelljs: true,
                    prototypejs: true,
                    yui: true,
                    mocha: true,
                    module: true,
                    wsh: true,
                    worker: true,
                    nonstandard: true,
                    browser: true,
                    browserify: true,
                    devel: true,
                    dojo: true,
                    typed: true,
                    phantom: true
                },
                obsolete: {
                    onecase: true,
                    regexp: true,
                    regexdash: true
                }
            });
            exports_1("val", val = {
                maxlen: false,
                indent: false,
                maxerr: false,
                predef: false,
                globals: false,
                quotmark: false,
                scope: false,
                maxstatements: false,
                maxdepth: false,
                maxparams: false,
                maxcomplexity: false,
                shadow: false,
                strict: true,
                unused: true,
                latedef: false,
                ignore: false,
                ignoreDelimiters: false,
                esversion: 5
            });
            exports_1("inverted", inverted = {
                bitwise: true,
                forin: true,
                newcap: true,
                plusplus: true,
                regexp: true,
                undef: true,
                eqeqeq: true,
                strict: true
            });
            exports_1("validNames", validNames = Object.keys(val)
                .concat(Object.keys(bool.relaxing))
                .concat(Object.keys(bool.enforcing))
                .concat(Object.keys(bool.obsolete))
                .concat(Object.keys(bool.environments)));
            exports_1("renamed", renamed = {
                eqeq: "eqeqeq",
                windows: "wsh",
                sloppy: "strict"
            });
            exports_1("removed", removed = {
                nomen: true,
                onevar: true,
                passfail: true,
                white: true,
                gcl: true,
                smarttabs: true,
                trailing: true
            });
            exports_1("noenforceall", noenforceall = {
                varstmt: true,
                strict: true
            });
        }
    };
});
