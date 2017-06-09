module.exports = function (grunt) {

    const path = require('path');
    const Builder = require('systemjs-builder');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            dist: {
                src: ['.tscache', 'dist', 'generated']
            }
        },

        // Copying the tsconfig file is for the benefit of the IDE.
        // The build simply uses the appropriate tsconfig.(app/web).json file.
        copy: {
            rad: {

            },
            dev: {
                files: copies('generated')
            },
            dst: {
                files: copies('dist')
            },
            app: {
                files: [
                    {
                        src: 'tsconfig.app.json',
                        dest: 'tsconfig.json'
                    }
                ]
            },
            themes: {
                // For development only.
                files: themes('generated')
            },
            web: {
                files: [
                    {
                        src: 'tsconfig.web.json',
                        dest: 'tsconfig.json'
                    }
                ]
            }
        },

        less: {
            dev: {
                options: {
                    paths: ['app/css/**/*.less']
                },
                files: {
                    "generated/css/app.css": "app/css/main.less"
                }
            },
            dst: {
                options: {
                    paths: ['app/css/**/*.less']
                },
                files: {
                    "dist/css/app.css": "app/css/main.less"
                }
            }
        },

        // Wrap the template cache in a 'TypeScript' wrapper so that it can be compiled into a System module.
        ngtemplates: {
            app: {
                cwd: 'app/templates',
                src: '*.html',
                dest: 'app/ts/template-cache.ts',
                options: {
                    bootstrap: function (module, script) {
                        return '' +
                            "//\n" +
                            "// GENERATED FILE\n" +
                            "//\n" +
                            "import { ITemplateCacheService } from 'angular';\n" +
                            "export function templateCache($templateCache: ITemplateCacheService) {\n" +
                            '\n' +
                            script +
                            '\n' +
                            '}\n';
                    }
                }
            }
        },

        ts: {
            app: {
                tsconfig: './tsconfig.app.json',
                options: {
                    fast: 'never'
                }
            },
            web: {
                tsconfig: './tsconfig.web.json',
                options: {
                    fast: 'never'
                }
            }
        },

        tslint: {
            src: [
                "app/ts/base/**/*.ts",
                "app/ts/collections/**/*.ts",
                "app/ts/controllers/**/*.ts",
                "app/ts/directives/**/*.ts",
                "app/ts/editor/**/*.ts",
                "app/ts/features/**/*.ts",
                "app/ts/filters/**/*.ts",
                "app/ts/languages/**/*.ts",
                "app/ts/mappings/**/*.ts",
                "app/ts/models/**/*.ts",
                "app/ts/modules/**/*.ts",
                "app/ts/scopes/**/*.ts",
                "app/ts/services/**/*.ts",
                "app/ts/stemcArXiv/**/*.ts",
                "app/ts/synchronization/**/*.ts",
                "app/ts/translate/**/*.ts",
                "app/ts/utils/**/*.ts",
                "app/ts/wsmodel/**/*.ts",
                "app/ts/*.ts",
                "server/**/*.ts",
                "./sockets.ts"
            ],
            options: {
                configuration: 'tslint.json'
            }
        },

        watch: {
            scripts: {
                files: ['app/ts/**/*.ts'],
                tasks: ['ts:app'],
                options: {
                    spawn: false
                }
            },
            templates: {
                files: ['app/templates/**/*.html'],
                tasks: ['ngtemplates']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-tslint');

    function bundle() {
        // Set the baseURL and load the configuration file.
        const builder = new Builder('./generated', './generated/jspm.config.js');

        var options = {
            minify: true,
            mangle: true,
            sourceMaps: true,
            lowResSourceMaps: false
        };

        return builder.bundle('js/main.js', 'dist/js/main.js', options);
    }

    grunt.registerTask('bundle', "Bundle into system modules", function () {
        var done = this.async();
        bundle()
            .then(function () {
                done(true);
            })
            .catch(function (err) {
                console.log(err);
                done(false);
            });
    });

    grunt.registerTask('app', "Set up environment for front-end development.", ['copy:app']);
    grunt.registerTask('web', "Set up environment for back-end development. ", ['copy:web']);

    grunt.registerTask('rad', "Build for rapid development. ", ['ts:app', 'ts:web']);
    grunt.registerTask('dev', "Build for development. ", ['clean', 'ngtemplates', 'ts:app', 'copy:dev', 'less:dev', 'ts:web']);
    grunt.registerTask('dst', "Build for production.", ['clean', 'ngtemplates', 'ts:app', 'copy:dev', 'less:dev', 'ts:web', 'tslint', 'less:dst', 'copy:dst', 'bundle']);

    grunt.registerTask('default', ['dst']);
};

function prepend(target, filePath) {
    return target + '/' + filePath;
}

/**
 * Files that are copied to the target folder ('generated' for dev, 'dist' for production)
 */
function copies(target) {

    const VERSION_STEMCSTUDIO_WORKERS = '0.1.3';
    /**
     * Angular
     * Used only to copy index.d.ts files from museum to vendor.
     * Keey this value in synch with the option manager.
     */
    const VERSION_ANGULAR = '4.1.0';
    /**
     * AngularJS
     */
    const VERSION_ANGULARJS = '1.6.17';
    /**
     * 
     */
    const VERSION_MONACO = '0.8.3';

    return [
        { src: 'app/manifest.json', dest: prepend(target, 'manifest.json') },
        { src: 'app/sw.js', dest: prepend(target, 'sw.js') },
        { src: 'app/stemcstudio-overview-2017-03-24.pdf', dest: prepend(target, 'stemcstudio-overview-2017-03-24.pdf') },
        /*
        { src: 'app/index.html', dest: prepend(target, 'index.html') },
        */
        {
            expand: true,
            cwd: `manual/monaco-editor@${VERSION_MONACO}`,
            src: ["**"],
            dest: prepend(target, `js/monaco-editor@${VERSION_MONACO}`)
        },
        {
            src: 'manual/typescript@2.3.1/typescriptServices.js',
            dest: prepend(target, 'js/typescript@2.3.1/typescriptServices.js')
        },
        {
            src: 'manual/typescript@2.3.1/typescriptServices.js.map',
            dest: prepend(target, 'js/typescript@2.3.1/typescriptServices.js.map')
        },
        {
            src: 'manual/typescript@2.3.1/lib.es6.d.ts',
            dest: prepend(target, 'typings/lib.es6.d.ts')
        },
        {
            src: 'manual/typescript@2.3.1/lib.d.ts',
            dest: prepend(target, 'vendor/typescript@2.3.1/lib.d.ts')
        },
        {
            src: 'manual/typescript@2.3.1/lib.es2015.core.d.ts',
            dest: prepend(target, 'vendor/typescript@2.3.1/lib.es2015.core.d.ts')
        },
        {
            src: 'manual/typescript@2.3.1/lib.es2015.promise.d.ts',
            dest: prepend(target, 'vendor/typescript@2.3.1/lib.es2015.promise.d.ts')
        },
        {
            src: `node_modules/stemcstudio-workers/src/worker.js`,
            dest: prepend(target, 'js/worker.js')
        },
        {
            src: `node_modules/stemcstudio-workers/dist/stemcstudio-workers.js`,
            dest: prepend(target, `js/stemcstudio-workers@${VERSION_STEMCSTUDIO_WORKERS}/stemcstudio-workers.js`)
        },
        {
            src: "../stemcstudio-workers/dist/stemcstudio-workers.js",
            dest: prepend(target, `js/stemcstudio-workers@${VERSION_STEMCSTUDIO_WORKERS}/stemcstudio-workers.js`)
        },
        {
            src: 'manual/aws/js/aws-sdk-2.3.12.min.js',
            dest: prepend(target, 'js/aws-sdk-2.3.12.min.js')
        },
        {
            // Maintain the same relative path with jspm.config.js.
            expand: true,
            cwd: "jspm_packages",
            src: ["**"],
            dest: prepend(target, 'jspm_packages')
        },
        {
            // Maintain the same relative path with jspm_packages.
            src: 'jspm.config.js',
            dest: prepend(target, 'jspm.config.js')
        },
        {
            src: 'museum/jasmine@2.5.2/lib/boot.js',
            dest: prepend(target, 'vendor/jasmine@2.5.2/lib/boot.js')
        },
        {
            src: 'museum/jasmine@2.5.2/lib/console.js',
            dest: prepend(target, 'vendor/jasmine@2.5.2/lib/console.js')
        },
        {
            src: 'museum/jasmine@2.5.2/lib/jasmine.css',
            dest: prepend(target, 'vendor/jasmine@2.5.2/lib/jasmine.css')
        },
        {
            src: 'museum/jasmine@2.5.2/lib/jasmine.js',
            dest: prepend(target, 'vendor/jasmine@2.5.2/lib/jasmine.js')
        },
        {
            src: 'museum/jasmine@2.5.2/lib/jasmine-html.js',
            dest: prepend(target, 'vendor/jasmine@2.5.2/lib/jasmine-html.js')
        },
        {
            src: 'museum/jasmine@2.5.2/lib/jasmine.d.ts',
            dest: prepend(target, 'vendor/jasmine@2.5.2/lib/jasmine.d.ts')
        },
        {
            src: 'museum/jasmine@2.5.2/lib/jasmine_favicon.png',
            dest: prepend(target, 'vendor/jasmine@2.5.2/lib/jasmine_favicon.png')
        },
        {
            src: 'museum/jasmine@2.5.2/package.json',
            dest: prepend(target, 'vendor/jasmine@2.4.1/package.json')
        },
        {
            expand: true,
            cwd: "app/data",
            src: ["**"],
            dest: prepend(target, 'data')
        },
        {
            expand: true,
            cwd: "app/img",
            src: ["**"],
            dest: prepend(target, 'img')
        },
        {
            expand: true,
            cwd: "app/themes",
            src: ["**"],
            dest: prepend(target, 'themes')
        },
        {
            expand: true,
            cwd: "app/ts/editor/snippets",
            src: ["**/*.snippets"],
            dest: prepend(target, 'snippets')
        },
        {
            src: "bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.eot",
            dest: prepend(target, 'fonts/glyphicons-halflings-regular.eot')
        },
        {
            src: "bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.svg",
            dest: prepend(target, 'fonts/glyphicons-halflings-regular.svg')
        },
        {
            src: "bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf",
            dest: prepend(target, 'fonts/glyphicons-halflings-regular.ttf')
        },
        {
            src: "bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff",
            dest: prepend(target, 'fonts/glyphicons-halflings-regular.woff')
        },
        {
            src: "bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2",
            dest: prepend(target, 'fonts/glyphicons-halflings-regular.woff2')
        },
        {
            src: `museum/@angular/common@${VERSION_ANGULAR}/index.d.ts`,
            dest: prepend(target, `vendor/@angular/common@${VERSION_ANGULAR}/index.d.ts`)
        },
        {
            src: `museum/@angular/compiler@${VERSION_ANGULAR}/index.d.ts`,
            dest: prepend(target, `vendor/@angular/compiler@${VERSION_ANGULAR}/index.d.ts`)
        },
        {
            src: `museum/@angular/core@${VERSION_ANGULAR}/index.d.ts`,
            dest: prepend(target, `vendor/@angular/core@${VERSION_ANGULAR}/index.d.ts`)
        },
        {
            src: `museum/@angular/forms@${VERSION_ANGULAR}/index.d.ts`,
            dest: prepend(target, `vendor/@angular/forms@${VERSION_ANGULAR}/index.d.ts`)
        },
        {
            src: `museum/@angular/http@${VERSION_ANGULAR}/index.d.ts`,
            dest: prepend(target, `vendor/@angular/http@${VERSION_ANGULAR}/index.d.ts`)
        },
        {
            src: `museum/@angular/platform-browser-dynamic@${VERSION_ANGULAR}/index.d.ts`,
            dest: prepend(target, `vendor/@angular/platform-browser-dynamic@${VERSION_ANGULAR}/index.d.ts`)
        },
        {
            src: `museum/@angular/platform-browser@${VERSION_ANGULAR}/index.d.ts`,
            dest: prepend(target, `vendor/@angular/platform-browser@${VERSION_ANGULAR}/index.d.ts`)
        },
        {
            src: `museum/@angular/router@${VERSION_ANGULAR}/index.d.ts`,
            dest: prepend(target, `vendor/@angular/router@${VERSION_ANGULAR}/index.d.ts`)
        },
        {
            src: `museum/angular-in-memory-web-api@0.3.2/index.d.ts`,
            dest: prepend(target, `vendor/angular-in-memory-web-api@0.3.2/index.d.ts`)
        },
        {
            // This is currently copying a 1.5.9 version of AngularJS to a location.
            // This file is needed for the application itself, which is a hybrid AngularJS/Angular application.
            // TODO: Probably should be using the minified version.
            src: "node_modules/angular/angular.js",
            //   "bower_components/angular/angular.js",
            dest: prepend(target, 'js/angular.js')
        },
        {
            src: "node_modules/@types/angular/index.d.ts",
            dest: prepend(target, `vendor/angular@${VERSION_ANGULARJS}/index.d.ts`)
        },
        {
            expand: true,
            cwd: "museum/async@1.4.2",
            src: ["**"],
            dest: prepend(target, 'vendor/async@1.4.2')
        },
        {
            expand: true,
            cwd: "museum/baconjs@0.7.88",
            src: ["**"],
            dest: prepend(target, 'vendor/baconjs@0.7.88')
        },
        {
            expand: true,
            cwd: "museum/baconjs@0.7.89",
            src: ["**"],
            dest: prepend(target, 'vendor/baconjs@0.7.89')
        },
        {
            expand: true,
            cwd: "museum/biwascheme@0.6.6",
            src: ["**"],
            dest: prepend(target, 'vendor/biwascheme@0.6.6')
        },
        {
            src: "bower_components/async/dist/async.js",
            dest: prepend(target, 'vendor/async@1.4.2/dist/async.js')
        },
        {
            src: "bower_components/async/dist/async.min.js",
            dest: prepend(target, 'vendor/async@1.4.2/dist/async.min.js')
        },
        {
            expand: true,
            cwd: "bower_components/bootstrap",
            src: ["**"],
            dest: prepend(target, 'vendor/bootstrap')
        },
        {
            src: "museum/dat-gui@0.5.0/dat-gui.d.ts",
            dest: prepend(target, 'vendor/dat-gui@0.5.0/dat-gui.d.ts')
        },
        {
            src: "bower_components/dat-gui/build/dat.gui.js",
            dest: prepend(target, 'vendor/dat-gui@0.5.0/dat-gui.js')
        },
        {
            src: "bower_components/dat-gui/build/dat.gui.min.js",
            dest: prepend(target, 'vendor/dat-gui@0.5.0/dat-gui.min.js')
        },
        {
            expand: true,
            cwd: "museum/d3@3.5.17",
            src: ["**"],
            dest: prepend(target, 'vendor/d3@3.5.17')
        },
        {
            expand: true,
            cwd: "museum/domready@1.0.0",
            src: ["**"],
            dest: prepend(target, 'vendor/domready@1.0.0')
        },
        {
            expand: true,
            cwd: "museum/gl-matrix@2.3.2",
            src: ["**"],
            dest: prepend(target, 'vendor/gl-matrix@2.3.2')
        },
        {
            expand: true,
            cwd: "museum/jquery@2.1.4",
            src: ["**"],
            dest: prepend(target, 'vendor/jquery@2.1.4')
        },
        {
            src: "bower_components/jquery/dist/jquery.js",
            dest: prepend(target, 'vendor/jquery@2.1.4/dist/jquery.js')
        },
        {
            src: "bower_components/jquery/dist/jquery.min.js",
            dest: prepend(target, 'vendor/jquery@2.1.4/dist/jquery.min.js')
        },
        {
            expand: true,
            cwd: "museum/jsxgraph@0.99.3",
            src: ["**"],
            dest: prepend(target, 'vendor/jsxgraph@0.99.3')
        },
        {
            expand: true,
            cwd: "museum/jsxgraph@0.99.4",
            src: ["**"],
            dest: prepend(target, 'vendor/jsxgraph@0.99.4')
        },
        {
            expand: true,
            cwd: "museum/jsxgraph@0.99.5",
            src: ["**"],
            dest: prepend(target, 'vendor/jsxgraph@0.99.5')
        },
        {
            src: "museum/jsxgraph@0.99.5/index.d.ts",
            dest: prepend(target, 'vendor/jsxgraph@0.99.5/index.d.ts')
        },
        {
            src: "museum/plotly@1.24.1/index.d.ts",
            dest: prepend(target, 'vendor/plotly@1.24.1/index.d.ts')
        },
        {
            src: "museum/plotly@1.24.1/plotly.js",
            dest: prepend(target, 'vendor/plotly@1.24.1/plotly.js')
        },
        {
            src: "museum/plotly@1.24.1/plotly.min.js",
            dest: prepend(target, 'vendor/plotly@1.24.1/plotly.min.js')
        },
        {
            expand: true,
            cwd: "museum/react@15.4.2",
            src: ["**"],
            dest: prepend(target, 'vendor/react@15.4.2')
        },
        {
            src: "museum/react@15.4.2/index.d.ts",
            dest: prepend(target, 'vendor/react@15.4.2/index.d.ts')
        },
        {
            expand: true,
            cwd: "museum/react-dom@15.4.2",
            src: ["**"],
            dest: prepend(target, 'vendor/react-dom@15.4.2')
        },
        {
            src: "museum/react-dom@15.4.2/index.d.ts",
            dest: prepend(target, 'vendor/react-dom@15.4.2/index.d.ts')
        },
        {
            src: "museum/requirejs@2.1.9/require.d.ts",
            dest: prepend(target, 'vendor/requirejs@2.1.9/require.d.ts')
        },
        {
            src: "bower_components/requirejs/require.js",
            dest: prepend(target, 'vendor/requirejs@2.1.9/require.js')
        },
        {
            expand: true,
            cwd: "museum/RxJS@5.3.3",
            src: ["**"],
            dest: prepend(target, 'vendor/RxJS@5.3.3')
        },
        {
            expand: true,
            cwd: "museum/socket.io-client@1.5.1",
            src: ["**"],
            dest: prepend(target, 'vendor/socket.io-client@1.5.1')
        },
        {
            expand: true,
            cwd: "museum/stats.js@0.16.0",
            src: ["**"],
            dest: prepend(target, 'vendor/stats.js@0.16.0')
        },
        {
            expand: true,
            cwd: "museum/systemjs@0.19.37",
            src: ["**"],
            dest: prepend(target, 'vendor/systemjs@0.19.37')
        },
        {
            expand: true,
            cwd: "museum/threejs@0.82.0",
            src: ["**"],
            dest: prepend(target, 'vendor/threejs@0.82.0')
        },
        {
            src: "museum/two@0.6.1/two.d.ts",
            dest: prepend(target, 'vendor/two@0.6.1/two.d.ts')
        },
        {
            src: "museum/two@0.6.1/two.js",
            dest: prepend(target, 'vendor/two@0.6.1/two.js')
        },
        {
            src: "museum/two@0.6.1/two.min.js",
            dest: prepend(target, 'vendor/two@0.6.1/two.min.js')
        },
        {
            expand: true,
            cwd: "museum/underscore@1.8.3",
            src: ["**"],
            dest: prepend(target, 'vendor/underscore@1.8.3')
        },
        {
            src: "bower_components/underscore/underscore.js",
            dest: prepend(target, 'vendor/underscore@1.8.3/underscore.js')
        },
        {
            src: "bower_components/underscore/underscore-min.js",
            dest: prepend(target, 'vendor/underscore@1.8.3/underscore-min.js')
        },
        {
            src: "bower_components/underscore/underscore-min.map",
            dest: prepend(target, 'vendor/underscore@1.8.3/underscore-min.map')
        },
        {
            src: "bower_components/davinci-mathscript/dist/davinci-mathscript.d.ts",
            dest: prepend(target, 'vendor/davinci-mathscript@1.2.2/dist/davinci-mathscript.d.ts')
        },
        {
            // This version is bundled for transpile.
            src: "bower_components/davinci-mathscript/dist/davinci-mathscript.js",
            dest: prepend(target, 'vendor/davinci-mathscript@1.2.2/dist/davinci-mathscript.js')
        },
        {
            // This version is loaded into iframe for the runtime.
            src: "bower_components/davinci-mathscript/dist/davinci-mathscript.min.js",
            dest: prepend(target, 'vendor/davinci-mathscript@1.2.2/dist/davinci-mathscript.min.js')
        },
        {
            src: "../davinci-mathscript/dist/davinci-mathscript.d.ts",
            dest: prepend(target, 'vendor/davinci-mathscript@1.2.2/dist/davinci-mathscript.d.ts')
        },
        {
            // This version is bundled for transpile.
            src: "../davinci-mathscript/dist/davinci-mathscript.js",
            dest: prepend(target, 'vendor/davinci-mathscript@1.2.2/dist/davinci-mathscript.js')
        },
        {
            // This version is loaded into iframe for the runtime.
            src: "../davinci-mathscript/dist/davinci-mathscript.min.js",
            dest: prepend(target, 'vendor/davinci-mathscript@1.2.2/dist/davinci-mathscript.min.js')
        },
        {
            expand: true,
            cwd: "../davinci-units/documentation",
            src: ["**"],
            dest: prepend(target, 'docs/davinci-units')
        },
        {
            src: "bower_components/davinci-units/dist/index.d.ts",
            dest: prepend(target, 'vendor/davinci-units@1.5.5/index.d.ts')
        },
        {
            src: "bower_components/davinci-units/dist/davinci-units.js",
            dest: prepend(target, 'vendor/davinci-units@1.5.5/davinci-units.js')
        },
        {
            src: "../davinci-units/dist/index.d.ts",
            dest: prepend(target, 'vendor/davinci-units@1.5.5/index.d.ts')
        },
        {
            src: "../davinci-units/dist/davinci-units.js",
            dest: prepend(target, 'vendor/davinci-units@1.5.5/davinci-units.js')
        },
        {
            expand: true,
            cwd: "../GeoCAS/documentation",
            src: ["**"],
            dest: prepend(target, 'docs/GeoCAS')
        },
        {
            src: "../GeoCAS/dist/geocas.d.ts",
            dest: prepend(target, 'vendor/GeoCAS@1.13.0/dist/geocas.d.ts')
        },
        {
            src: "../GeoCAS/dist/geocas.js",
            dest: prepend(target, 'vendor/GeoCAS@1.13.0/dist/geocas.js')
        },
        {
            src: "node_modules/immutable/dist/immutable-nonambient.d.ts",
            dest: prepend(target, 'vendor/immutable@3.8.1/index.d.ts')
        },
        {
            src: "node_modules/immutable/dist/immutable.js",
            dest: prepend(target, 'vendor/immutable@3.8.1/immutable.js')
        },
        {
            src: "node_modules/immutable/dist/immutable.min.js",
            dest: prepend(target, 'vendor/immutable@3.8.1/immutable.min.js')
        },
        {
            src: "node_modules/redux/index.d.ts",
            dest: prepend(target, 'vendor/redux@3.6.0/index.d.ts')
        },
        {
            src: "node_modules/redux/dist/redux.js",
            dest: prepend(target, 'vendor/redux@3.6.0/redux.js')
        },
        {
            src: "node_modules/redux/dist/redux.min.js",
            dest: prepend(target, 'vendor/redux@3.6.0/redux.min.js')
        }
    ]
}

/**
 * Copy themes to the target folder ('generated' for dev, 'dist' for production)
 */
function themes(target) {
    return [
        {
            expand: true,
            cwd: "app/themes",
            src: ["**"],
            dest: prepend(target, 'themes')
        }
    ]
}

