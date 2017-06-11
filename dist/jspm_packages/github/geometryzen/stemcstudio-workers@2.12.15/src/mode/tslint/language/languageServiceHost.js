System.register(["./utils"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function wrapProgram(program) {
        var files = new Map();
        var fileVersions = new Map();
        var host = {
            getCompilationSettings: function () { return program.getCompilerOptions(); },
            getCurrentDirectory: function () { return program.getCurrentDirectory(); },
            getDefaultLibFileName: function () { return "lib.d.ts"; },
            getScriptFileNames: function () { return program.getSourceFiles().map(function (sf) { return sf.fileName; }); },
            getScriptSnapshot: function (name) {
                var file = files.get(name);
                if (file !== undefined) {
                    return ts.ScriptSnapshot.fromString(file);
                }
                if (!program.getSourceFile(name)) {
                    return undefined;
                }
                return ts.ScriptSnapshot.fromString(program.getSourceFile(name).getFullText());
            },
            getScriptVersion: function (name) {
                var version = fileVersions.get(name);
                return version === undefined ? "1" : String(version);
            },
            log: function () { },
            editFile: function (fileName, newContent) {
                files.set(fileName, newContent);
                var prevVersion = fileVersions.get(fileName);
                fileVersions.set(fileName, prevVersion === undefined ? 0 : prevVersion + 1);
            },
        };
        var langSvc = ts.createLanguageService(host, ts.createDocumentRegistry());
        langSvc.editFile = host.editFile;
        return langSvc;
    }
    exports_1("wrapProgram", wrapProgram);
    function checkEdit(ls, sf, newText) {
        if (ls.hasOwnProperty("editFile")) {
            var host = ls;
            host.editFile(sf.fileName, newText);
            var newProgram = ls.getProgram();
            var newSf = newProgram.getSourceFile(sf.fileName);
            var newDiags = ts.getPreEmitDiagnostics(newProgram, newSf);
            host.editFile(sf.fileName, sf.getFullText());
            return newDiags;
        }
        return [];
    }
    exports_1("checkEdit", checkEdit);
    function createLanguageServiceHost(fileName, source) {
        return {
            getCompilationSettings: function () { return utils_1.createCompilerOptions(); },
            getCurrentDirectory: function () { return ""; },
            getDefaultLibFileName: function () { return "lib.d.ts"; },
            getScriptFileNames: function () { return [fileName]; },
            getScriptSnapshot: function (name) { return ts.ScriptSnapshot.fromString(name === fileName ? source : ""); },
            getScriptVersion: function () { return "1"; },
            log: function () { },
        };
    }
    exports_1("createLanguageServiceHost", createLanguageServiceHost);
    function createLanguageService(fileName, source) {
        var languageServiceHost = createLanguageServiceHost(fileName, source);
        return ts.createLanguageService(languageServiceHost);
    }
    exports_1("createLanguageService", createLanguageService);
    var utils_1;
    return {
        setters: [
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }
        ],
        execute: function () {
        }
    };
});
