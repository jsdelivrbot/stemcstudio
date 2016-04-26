// The "wrapper" function.
module.exports = function(grunt) {

    // Do grunt-related things in here.

    var path = require('path');
    var Builder = require('systemjs-builder');

    // Project configuration.
    grunt.initConfig({

        // Access the package file contents for later use.
        pkg: grunt.file.readJSON('package.json'),

        // Task configuration.
        clean: {
            // Don't clean 'lib' yet until we figure out what to do with the worker-system.js file.
            src: ['amd', 'dist', 'documentation', 'system', '.tscache']
        },

        exec: {
            'test': {
                command: 'npm test',
                stdout: true,
                stderr: true
            }
        },

        requirejs: {
            compile: {
                options: {
                    mainConfigFile: "requirejs.config.js",
                    paths: {
                    }
                }
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            amd: {
                src: 'dist/ace.js',
                dest: 'dist/ace.min.js'
            },
            system: {
                src: 'dist/ace-system-es5.js',
                dest: 'dist/ace-system-es5.min.js'
            }
        },

        copy: {
            css: {
                expand: true,
                cwd: 'src/css/',
                src: ['**/*.css'],
                dest: 'dist/css'
            },
            img: {
                expand: true,
                cwd: 'src/css/',
                src: ['**/*.png'],
                dest: 'dist/img'
            },
            snippets: {
                expand: true,
                cwd: 'src/snippets/',
                src: ['**/*.snippets'],
                dest: 'dist/snippets/'
            },
            themes: {
                expand: true,
                cwd: 'src/theme/',
                src: ['**/*.css'],
                dest: 'dist/themes/'
            },
            dts: {
                expand: true,
                cwd: 'dts/',
                src: ['ace.d.ts'],
                dest: 'dist'
            }
        },

        connect: {
            test: {
                options: {
                    port: 8080
                }
            }
        },

        jasmine: {
            taskName: {
                src: 'amd/**/*.js',
                options: {
                    specs: 'test/amd/*_test.js',
                    host: 'http://127.0.0.1:8080/',
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfig: {
                            baseUrl: 'amd/',
                            paths: {
                            }
                        }
                    }
                }
            }
        },

        ts: {
            amdES5: {
                tsconfig: {
                    tsconfig: './tsconfig.amd.json',
                    ignoreFiles: true,
                    ignoreSettings: true
                },
                options: {
                    fast: 'never',
                    module: 'amd',
                    target: 'ES5',
                    moduleResolution: "classic",
                    noImplicitAny: false,
                    outDir: 'amd',
                    sourceMap: false,
                    verbose: false
                }
            },
            systemES5: {
                tsconfig: {
                    tsconfig: './tsconfig.system.json',
                    ignoreFiles: true,
                    ignoreSettings: true
                },
                options: {
                    fast: 'never',
                    module: 'system',
                    target: 'ES5',
                    noImplicitAny: false,
                    outDir: 'system',
                    sourceMap: false,
                    verbose: false
                }
            }
        },

        // Eventually replace src with 'src/**/*.ts'
        tslint: {
            src: [
//              'src/**/*.ts',
                'src/autocomplete/**/*.ts',
                'src/dom/**/*.ts',
                'src/events/**/*.ts',
//              'src/keyboard/**/*.ts',             // TextInput.ts broken.
                'src/layer/**/*.ts',
                'src/ace.ts',
                'src/edit.ts',
                'src/Anchor.ts',
                'src/Annotation.ts',
                'src/BackgroundTokenizer.ts',
                'src/BehaviourCallback.ts',
                'src/BracketMatch.ts',
                'src/Change.ts',
                'src/Completion.ts',
                'src/CompletionList.ts',
                'src/CursorRange.ts',
                'src/Delta.ts',
                'src/Document.ts',
                'src/EditSession.ts',
                'src/Range.ts',
                'src/Selection.ts',
//              'src/Tokenizer.ts',
                'src/UndoManager.ts',
                'src/applyDelta.ts',
                'src/keyboard/EditorAction.ts',
                'src/keyboard/KeyBinding.ts',
                'src/keyboard/KeyHash.ts',
                'src/keyboard/KeyboardHandler.ts',
                'src/keyboard/KeyboardResponse.ts',
                'src/lib/lang/createDelayedCall.ts',
                'src/lib/lang/DelayedCall.ts',
                'src/mode/**/*.ts',
                'src/workspace/**/*.ts'
            ],
            options: {
                configuration: 'tslint.json'
            }
        },

        // Build TypeScript documentation.
        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                logo: '../assets/img/logo_half.png',
                options: {
                    linkNatives: false, // Native types get linked to MDN.
                    quiet: true,
                    writeJSON: false,
                    exclude: 'assets, dist, documentation, jspm_packages, node_modules, typings, vendor',
                    extension: '.ts',
                    paths: ['src'],
                    outdir: 'documentation',
                    syntaxtype: 'js'  // YUIDocs doesn't understand TypeScript.
                }
            }
        },

        complexity: {
            generic: {
                src: ['amd/**/*.js'],
                options: {
                    jsLintXML: 'report.xml', // create XML JSLint-like report
                    checkstyleXML: 'checkstyle.xml', // create checkstyle report
                    errorsOnly: false, // show only maintainability errors
                    cyclomatic: 3,
                    halstead: 8,
                    maintainability: 100
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-complexity');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-tslint');

    function bundle() {
        // Set the baseURL and load the configuration file.
        var builder = new Builder('./system', './config.js');

        var options = {
            minify: false,
            mangle: true,
            sourceMaps: true,
            lowResSourceMaps: true
        };

        return builder.bundle('ace.js', 'dist/ace-system-es5.js', options);
    }

    grunt.registerTask('bundle', "Bundle into system modules", function() {
        var done = this.async();
        bundle()
            .then(function() {
                done(true);
            })
            .catch(function(err) {
                console.log(err);
                done(false);
            });
    });

    grunt.registerTask('test', ['connect:test', 'jasmine']);

    grunt.registerTask('testAll', ['exec:test', 'test']);

    grunt.registerTask('docs', ['clean', 'compile', 'copy', 'yuidoc']);

    grunt.registerTask('system', ['ts:systemES5', 'bundle']);

    grunt.registerTask('amd', ['ts:amdES5', 'requirejs']);

    grunt.registerTask('dev', ['clean', 'tslint', 'amd', 'copy']);

    grunt.registerTask('default', ['clean', 'tslint', 'system', 'amd', 'uglify', 'copy', 'yuidoc', 'test']);
};
