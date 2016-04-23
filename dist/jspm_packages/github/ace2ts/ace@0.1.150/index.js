var element1 = document.getElementById("editor1");
var element2 = document.getElementById("editor2");

main(element1, element2);
//
//
//
function main(element1, element2) {
    /**
     * scripts that worker threads need to load.
     *
     * 1. We have to load system.js because it is an ES6 shim.
     * 2. We have to load config.js to configure System.
     * 3. We could load the corresponding worker code on-demand by configuring 'bundles'.
     * 4. typescriptServices.js (build from source as an ambient module).
     */
    var systemImports = ['/jspm_packages/system.js', '/config.js'];
    var workerImports = systemImports.concat(['/jspm_packages/github/ace2ts/ace-workers@0.1.52/dist/ace-workers.js']);
    var typescriptServices = ['/assets/js/typescriptServices.js'];

    var editor1 = ace.edit(element1);
    editor1.setLanguageMode(ace.createTypeScriptMode('/assets/js/worker.js', workerImports), function(err) {
        console.log("setLanguageMode completed, err => " + err);
    });
    editor1.setThemeCss("ace-twilight", "/dist/themes/twilight.css");
    editor1.setThemeDark(true);
    editor1.setPadding(4);
    editor1.setFontSize("16px");
    editor1.clearSelection();
    editor1.resize();
    editor1.focus();

    var editor2 = ace.edit(element2);
    editor2.setLanguageMode(ace.createTypeScriptMode('/assets/js/worker.js', workerImports), function(err) {
        console.log("setLanguageMode completed, err => " + err);
    });
    editor2.setThemeCss("ace-twilight", "/dist/themes/twilight.css");
    editor2.setThemeDark(true);
    editor2.setPadding(4);
    editor2.setFontSize("16px");
    editor2.clearSelection();
    editor2.resize();

    var workspace = ace.createWorkspace();
    workspace.init('/assets/js/worker.js', workerImports.concat(typescriptServices));
    console.log("calling setDefaultLibrary()");
    workspace.setDefaultLibrary('/assets/typings/lib.es6.d.ts', function(err) {
        console.log("setDefaultLibrary completed, err => " + err);
    });
    workspace.attachEditor('one.ts', editor1);
    workspace.attachEditor('two.ts', editor2);

    editor1.getSession().on('outputFiles', function(event) {
        // console.log(JSON.stringify(event.data[0].text));
    });
    editor2.getSession().on('outputFiles', function(event) {
        // console.log(JSON.stringify(event.data[0].text));
    });
    // workspace.detachEditor('one.ts', editor1);
    // workspace.detachEditor('two.ts', editor2);
    // workspace.terminate();
    var expandSnippet = {
        name: 'expandSnippet',
        exec: function(editor) {
            var success = editor.snippetManager.expandWithTab(editor);
            if (!success) {
                var indentCommand = editor.commands.getCommandByName('indent');
                editor.execCommand(indentCommand);
            }
        },
        bindKey: 'Tab'
    };
    editor1.commands.addCommand(expandSnippet);
    var snippets = editor1.snippetManager.parseSnippetFile("# Function\nsnippet fun\n\tfunction ${1?:function_name}(${2:argument}) {\n\t\t${3:// body...}\n\t}\n");
    //console.log(`snippets => ${JSON.stringify(snippets)}`);
    // The scope must match the language mode identifier.
    editor1.snippetManager.register(snippets, 'typescript');
}
