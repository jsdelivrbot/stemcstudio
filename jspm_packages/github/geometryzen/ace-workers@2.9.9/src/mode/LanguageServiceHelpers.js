System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function changedCompilerSettings(oldSettings, newSettings) {
        if (oldSettings.allowJs !== newSettings.allowJs) {
            return true;
        }
        if (oldSettings.allowSyntheticDefaultImports !== newSettings.allowSyntheticDefaultImports) {
            return true;
        }
        if (oldSettings.allowUnreachableCode !== newSettings.allowUnreachableCode) {
            return true;
        }
        if (oldSettings.allowUnusedLabels !== newSettings.allowUnusedLabels) {
            return true;
        }
        if (oldSettings.alwaysStrict !== newSettings.alwaysStrict) {
            return true;
        }
        if (oldSettings.baseUrl !== newSettings.baseUrl) {
            return true;
        }
        if (oldSettings.charset !== newSettings.charset) {
            return true;
        }
        if (oldSettings.declaration !== newSettings.declaration) {
            return true;
        }
        if (oldSettings.declarationDir !== newSettings.declarationDir) {
            return true;
        }
        if (oldSettings.disableSizeLimit !== newSettings.disableSizeLimit) {
            return true;
        }
        if (oldSettings.downlevelIteration !== newSettings.downlevelIteration) {
            return true;
        }
        if (oldSettings.emitBOM !== newSettings.emitBOM) {
            return true;
        }
        if (oldSettings.emitDecoratorMetadata !== newSettings.emitDecoratorMetadata) {
            return true;
        }
        if (oldSettings.experimentalDecorators !== newSettings.experimentalDecorators) {
            return true;
        }
        if (oldSettings.forceConsistentCasingInFileNames !== newSettings.forceConsistentCasingInFileNames) {
            return true;
        }
        if (oldSettings.importHelpers !== newSettings.importHelpers) {
            return true;
        }
        if (oldSettings.inlineSourceMap !== newSettings.inlineSourceMap) {
            return true;
        }
        if (oldSettings.inlineSources !== newSettings.inlineSources) {
            return true;
        }
        if (oldSettings.isolatedModules !== newSettings.isolatedModules) {
            return true;
        }
        if (oldSettings.jsx !== newSettings.jsx) {
            return true;
        }
        if (oldSettings.jsxFactory !== newSettings.jsxFactory) {
            return true;
        }
        if (oldSettings.lib !== newSettings.lib) {
            return true;
        }
        if (oldSettings.locale !== newSettings.locale) {
            return true;
        }
        if (oldSettings.mapRoot !== newSettings.mapRoot) {
            return true;
        }
        if (oldSettings.maxNodeModuleJsDepth !== newSettings.maxNodeModuleJsDepth) {
            return true;
        }
        if (oldSettings.module !== newSettings.module) {
            return true;
        }
        if (oldSettings.moduleResolution !== newSettings.moduleResolution) {
            return true;
        }
        if (oldSettings.newLine !== newSettings.newLine) {
            return true;
        }
        if (oldSettings.noEmit !== newSettings.noEmit) {
            return true;
        }
        if (oldSettings.noEmitHelpers !== newSettings.noEmitHelpers) {
            return true;
        }
        if (oldSettings.noEmitOnError !== newSettings.noEmitOnError) {
            return true;
        }
        if (oldSettings.noErrorTruncation !== newSettings.noErrorTruncation) {
            return true;
        }
        if (oldSettings.noFallthroughCasesInSwitch !== newSettings.noFallthroughCasesInSwitch) {
            return true;
        }
        if (oldSettings.noImplicitAny !== newSettings.noImplicitAny) {
            return true;
        }
        if (oldSettings.noImplicitReturns !== newSettings.noImplicitReturns) {
            return true;
        }
        if (oldSettings.noImplicitThis !== newSettings.noImplicitThis) {
            return true;
        }
        if (oldSettings.noImplicitUseStrict !== newSettings.noImplicitUseStrict) {
            return true;
        }
        if (oldSettings.noLib !== newSettings.noLib) {
            return true;
        }
        if (oldSettings.noResolve !== newSettings.noResolve) {
            return true;
        }
        if (oldSettings.noUnusedLocals !== newSettings.noUnusedLocals) {
            return true;
        }
        if (oldSettings.noUnusedParameters !== newSettings.noUnusedParameters) {
            return true;
        }
        if (oldSettings.operatorOverloading !== newSettings.operatorOverloading) {
            return true;
        }
        if (oldSettings.out !== newSettings.out) {
            return true;
        }
        if (oldSettings.outDir !== newSettings.outDir) {
            return true;
        }
        if (oldSettings.outFile !== newSettings.outFile) {
            return true;
        }
        if (oldSettings.paths !== newSettings.paths) {
            return true;
        }
        if (oldSettings.preserveConstEnums !== newSettings.preserveConstEnums) {
            return true;
        }
        if (oldSettings.project !== newSettings.project) {
            return true;
        }
        if (oldSettings.reactNamespace !== newSettings.reactNamespace) {
            return true;
        }
        if (oldSettings.removeComments !== newSettings.removeComments) {
            return true;
        }
        if (oldSettings.rootDir !== newSettings.rootDir) {
            return true;
        }
        if (oldSettings.rootDirs !== newSettings.rootDirs) {
            return true;
        }
        if (oldSettings.skipDefaultLibCheck !== newSettings.skipDefaultLibCheck) {
            return true;
        }
        if (oldSettings.skipLibCheck !== newSettings.skipLibCheck) {
            return true;
        }
        if (oldSettings.sourceMap !== newSettings.souceMap) {
            return true;
        }
        if (oldSettings.sourceRoot !== newSettings.sourceRoot) {
            return true;
        }
        if (oldSettings.strict !== newSettings.strict) {
            return true;
        }
        if (oldSettings.strictNullChecks !== newSettings.strictNullChecks) {
            return true;
        }
        if (oldSettings.suppressExcessPropertyErrors !== newSettings.suppressExcessPropertyErrors) {
            return true;
        }
        if (oldSettings.suppressImplicitAnyIndexErrors !== newSettings.suppressImplicitAnyIndexErrors) {
            return true;
        }
        if (oldSettings.target !== newSettings.target) {
            return true;
        }
        if (oldSettings.traceResolution !== newSettings.traceResolution) {
            return true;
        }
        if (oldSettings.typeRoots !== newSettings.typeRoots) {
            return true;
        }
        return false;
    }
    exports_1("changedCompilerSettings", changedCompilerSettings);
    function compilerJsxEmitFromTsConfig(jsx, defaultJsx) {
        if (jsx) {
            switch (jsx) {
                case 'none': {
                    return ts.JsxEmit.None;
                }
                case 'preserve': {
                    return ts.JsxEmit.Preserve;
                }
                case 'react': {
                    return ts.JsxEmit.React;
                }
                case 'react-native': {
                    return ts.JsxEmit.ReactNative;
                }
                default: {
                    throw new Error("Unrecognized jsx: " + jsx);
                }
            }
        }
        else {
            return defaultJsx;
        }
    }
    exports_1("compilerJsxEmitFromTsConfig", compilerJsxEmitFromTsConfig);
    function compilerModuleKindFromTsConfig(moduleKind) {
        moduleKind = moduleKind.toLowerCase();
        switch (moduleKind) {
            case 'amd': {
                return ts.ModuleKind.AMD;
            }
            case 'commonjs': {
                return ts.ModuleKind.CommonJS;
            }
            case 'es2015': {
                return ts.ModuleKind.ES2015;
            }
            case 'none': {
                return ts.ModuleKind.None;
            }
            case 'system': {
                return ts.ModuleKind.System;
            }
            case 'umd': {
                return ts.ModuleKind.UMD;
            }
            default: {
                throw new Error("Unrecognized module kind: " + moduleKind);
            }
        }
    }
    exports_1("compilerModuleKindFromTsConfig", compilerModuleKindFromTsConfig);
    function compilerScriptTargetFromTsConfig(scriptTarget) {
        scriptTarget = scriptTarget.toLowerCase();
        switch (scriptTarget) {
            case 'es2015': {
                return ts.ScriptTarget.ES2015;
            }
            case 'es2016': {
                return ts.ScriptTarget.ES2016;
            }
            case 'es2017': {
                return ts.ScriptTarget.ES2017;
            }
            case 'es3': {
                return ts.ScriptTarget.ES3;
            }
            case 'es5': {
                return ts.ScriptTarget.ES5;
            }
            case 'esnext': {
                return ts.ScriptTarget.ESNext;
            }
            case 'latest': {
                return ts.ScriptTarget.Latest;
            }
            default: {
                throw new Error("Unrecognized script target: " + scriptTarget);
            }
        }
    }
    exports_1("compilerScriptTargetFromTsConfig", compilerScriptTargetFromTsConfig);
    function compilerOptionsFromTsConfig(settings) {
        var compilerOptions = {};
        compilerOptions.allowJs = settings.allowJs;
        compilerOptions.declaration = settings.declaration;
        compilerOptions.emitDecoratorMetadata = settings.emitDecoratorMetadata;
        compilerOptions.experimentalDecorators = settings.experimentalDecorators;
        compilerOptions.jsx = compilerJsxEmitFromTsConfig(settings.jsx, ts.JsxEmit.React);
        compilerOptions.module = compilerModuleKindFromTsConfig(settings.module);
        compilerOptions.noImplicitAny = settings.noImplicitAny;
        compilerOptions.noImplicitReturns = settings.noImplicitReturns;
        compilerOptions.noImplicitThis = settings.noImplicitThis;
        compilerOptions.noUnusedLocals = settings.noUnusedLocals;
        compilerOptions.noUnusedParameters = settings.noUnusedParameters;
        compilerOptions.operatorOverloading = settings.operatorOverloading;
        compilerOptions.preserveConstEnums = settings.preserveConstEnums;
        compilerOptions.removeComments = settings.removeComments;
        compilerOptions.sourceMap = settings.sourceMap;
        compilerOptions.strictNullChecks = settings.strictNullChecks;
        compilerOptions.suppressImplicitAnyIndexErrors = settings.suppressImplicitAnyIndexErrors;
        compilerOptions.target = compilerScriptTargetFromTsConfig(settings.target);
        compilerOptions.traceResolution = settings.traceResolution;
        return compilerOptions;
    }
    exports_1("compilerOptionsFromTsConfig", compilerOptionsFromTsConfig);
    function tsConfigJsxEmitFromCompilerOptions(jsx) {
        switch (jsx) {
            case ts.JsxEmit.None: {
                return 'none';
            }
            case ts.JsxEmit.Preserve: {
                return 'preserve';
            }
            case ts.JsxEmit.React: {
                return 'react';
            }
            case ts.JsxEmit.ReactNative: {
                return 'react-native';
            }
            default: {
                throw new Error("Unrecognized jsx: " + jsx);
            }
        }
    }
    exports_1("tsConfigJsxEmitFromCompilerOptions", tsConfigJsxEmitFromCompilerOptions);
    function tsConfigModuleKindFromCompilerOptions(moduleKind, defaultValue) {
        if (typeof moduleKind !== 'undefined') {
            switch (moduleKind) {
                case ts.ModuleKind.AMD: {
                    return 'amd';
                }
                case ts.ModuleKind.CommonJS: {
                    return 'commonjs';
                }
                case ts.ModuleKind.ES2015: {
                    return 'es2015';
                }
                case ts.ModuleKind.None: {
                    return 'none';
                }
                case ts.ModuleKind.System: {
                    return 'system';
                }
                case ts.ModuleKind.UMD: {
                    return 'umd';
                }
                default: {
                    throw new Error("Unrecognized module kind: " + moduleKind);
                }
            }
        }
        else {
            return defaultValue;
        }
    }
    exports_1("tsConfigModuleKindFromCompilerOptions", tsConfigModuleKindFromCompilerOptions);
    function tsConfigScriptTargetFromCompilerOptions(scriptTarget, defaultValue) {
        if (typeof scriptTarget !== 'undefined') {
            switch (scriptTarget) {
                case ts.ScriptTarget.ES2015: {
                    return 'es2015';
                }
                case ts.ScriptTarget.ES2016: {
                    return 'es2016';
                }
                case ts.ScriptTarget.ES2017: {
                    return 'es2017';
                }
                case ts.ScriptTarget.ES3: {
                    return 'es3';
                }
                case ts.ScriptTarget.ES5: {
                    return 'es5';
                }
                case ts.ScriptTarget.ESNext: {
                    return 'esnext';
                }
                case ts.ScriptTarget.Latest: {
                    return 'latest';
                }
                default: {
                    throw new Error("Unrecognized script target: " + scriptTarget);
                }
            }
        }
        else {
            return defaultValue;
        }
    }
    exports_1("tsConfigScriptTargetFromCompilerOptions", tsConfigScriptTargetFromCompilerOptions);
    function tsConfigFromCompilerOptions(options) {
        var tsConfig = {
            allowJs: options.allowJs,
            declaration: options.declaration,
            emitDecoratorMetadata: options.emitDecoratorMetadata,
            experimentalDecorators: options.experimentalDecorators,
            jsx: tsConfigJsxEmitFromCompilerOptions(ts.JsxEmit.React),
            module: tsConfigModuleKindFromCompilerOptions(options.module, 'system'),
            noImplicitAny: options.noImplicitAny,
            noImplicitReturns: options.noImplicitReturns,
            noImplicitThis: options.noImplicitThis,
            noUnusedLocals: options.noUnusedLocals,
            noUnusedParameters: options.noUnusedParameters,
            operatorOverloading: options.operatorOverloading,
            preserveConstEnums: options.preserveConstEnums,
            removeComments: options.removeComments,
            sourceMap: options.sourceMap,
            strictNullChecks: options.strictNullChecks,
            suppressImplicitAnyIndexErrors: options.suppressImplicitAnyIndexErrors,
            target: tsConfigScriptTargetFromCompilerOptions(options.target, 'es5'),
            traceResolution: options.traceResolution
        };
        return tsConfig;
    }
    exports_1("tsConfigFromCompilerOptions", tsConfigFromCompilerOptions);
    return {
        setters: [],
        execute: function () {
        }
    };
});
