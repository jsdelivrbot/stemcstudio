System.config({
    paths: {
        'npm:': 'node_modules/'
    },
    map: {
        'generic-rbtree': 'npm:generic-rbtree/build/browser/index.js',
        'src': 'src',
        'test': 'test',
        'tslib': 'npm:tslib/tslib.js',
        'typhon-lang': 'npm:typhon-lang/build/browser/index.js',
    },
    packages: {
        'generic-rbtree': {
            defaultExtension: 'js'
        },
        'src': {
            defaultExtension: 'js'
        },
        'test': {
            defaultExtension: 'js'
        },
        'tslib': {
            defaultExtension: 'js'
        },
        'typhon-lang': {
            defaultExtension: 'js'
        },
    }
});
