/* */ 
"format cjs";
(function (global) {
    System.config({
        paths: {
            'npm:': 'node_modules/'
        },
        map: {
            'code-writer': 'npm:code-writer/build/browser/index.js',
            'generic-rbtree': 'npm:generic-rbtree/build/browser/index.js',
            'test': 'test',
            'tslib': 'npm:tslib/tslib.js'
        },
        packages: {
            'code-writer': {
                defaultExtension: 'js'
            },
            'generic-rbtree': {
                defaultExtension: 'js'
            },
            'test': {
                defaultExtension: 'js'
            },
            'tslib': {
                defaultExtension: 'js'
            }
        }
    });
})(this);
