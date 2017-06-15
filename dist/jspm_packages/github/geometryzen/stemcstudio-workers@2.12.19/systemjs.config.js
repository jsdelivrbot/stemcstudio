System.config({
    paths: {
        'npm:': 'node_modules/'
    },
    map: {
        'code-writer': 'npm:code-writer/build/browser/index.js',
        'generic-rbtree': 'npm:generic-rbtree/build/browser/index.js',
        'stemcstudio-json': 'npm:stemcstudio-json/build/browser/index.js',
        'src': 'src',
        'test': 'test',
        'tslib': 'npm:tslib/tslib.js',
        'typhon-lang': 'npm:typhon-lang/build/browser/index.js',
        'typhon-typescript': 'npm:typhon-typescript/build/browser/index.js'
    },
    packages: {
        'code-writer': {
            defaultExtension: 'js'
        },
        'generic-rbtree': {
            defaultExtension: 'js'
        },
        'stemcstudio-json': {
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
        'typhon-typescript': {
            defaultExtension: 'js'
        }
    }
});
