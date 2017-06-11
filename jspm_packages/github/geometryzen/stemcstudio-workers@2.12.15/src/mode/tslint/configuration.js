System.register(["./utils"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function extendConfigurationFile(targetConfig, nextConfigSource) {
        var combinedConfig = {};
        var configRulesDirectory = utils_1.arrayify(targetConfig.rulesDirectory);
        var nextConfigRulesDirectory = utils_1.arrayify(nextConfigSource.rulesDirectory);
        combinedConfig.rulesDirectory = configRulesDirectory.concat(nextConfigRulesDirectory);
        var combineProperties = function (targetProperty, nextProperty) {
            var combinedProperty = {};
            for (var _i = 0, _a = Object.keys(utils_1.objectify(targetProperty)); _i < _a.length; _i++) {
                var name = _a[_i];
                combinedProperty[name] = targetProperty[name];
            }
            for (var _b = 0, _c = Object.keys(utils_1.objectify(nextProperty)); _b < _c.length; _b++) {
                var name = _c[_b];
                combinedProperty[name] = nextProperty[name];
            }
            return combinedProperty;
        };
        combinedConfig.rules = combineProperties(targetConfig.rules, nextConfigSource.rules);
        combinedConfig.jsRules = combineProperties(targetConfig.jsRules, nextConfigSource.jsRules);
        combinedConfig.linterOptions = combineProperties(targetConfig.linterOptions, nextConfigSource.linterOptions);
        return combinedConfig;
    }
    exports_1("extendConfigurationFile", extendConfigurationFile);
    var utils_1, CONFIG_FILENAME, DEFAULT_CONFIG;
    return {
        setters: [
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }
        ],
        execute: function () {
            exports_1("CONFIG_FILENAME", CONFIG_FILENAME = "tslint.json");
            exports_1("DEFAULT_CONFIG", DEFAULT_CONFIG = {
                "extends": "tslint:recommended",
            });
        }
    };
});
