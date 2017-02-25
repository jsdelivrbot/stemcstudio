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
                            "import * as angular from 'angular';\n" +
                            "import app from './app';\n" +
                            "app.run(['$templateCache', function($templateCache: angular.ITemplateCacheService) {\n" +
                            '\n' +
                            script +
                            '\n' +
                            '}]);\n';
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
            eight: {
                files: ['../davinci-eight/dist/*.*'],
                tasks: ['dev'],
                options: {
                    spawn: false
                }
            },
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

        return builder.bundle('js/bootstrap.js', 'dist/js/bootstrap.js', options);
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

    grunt.registerTask('dev', "Build for development. ", ['clean', 'ngtemplates', 'ts:app', 'copy:dev', 'less:dev', 'ts:web']);
    grunt.registerTask('dst', "Build for distribution.", ['clean', 'ngtemplates', 'ts:app', 'copy:dev', 'less:dev', 'ts:web', 'tslint', 'less:dst', 'copy:dst', 'bundle']);

    grunt.registerTask('default', ['dst']);
};

function prepend(target, filePath) {
    return target + '/' + filePath;
}

/**
 * Files that are copied to the target folder ('generated' for dev, 'dist' for production)
 */
function copies(target) {
    return [
        {
            src: 'app/index.html',
            dest: prepend(target, 'index.html')
        },
        {
            src: 'manual/typescript@2.2.0/typescriptServices.js',
            dest: prepend(target, 'js/typescriptServices.js')
        },
        {
            src: 'manual/typescript@2.2.0/typescriptServices.js.map',
            dest: prepend(target, 'js/typescriptServices.js.map')
        },
        {
            src: 'manual/typescript@2.2.0/lib.es6.d.ts',
            dest: prepend(target, 'typings/lib.es6.d.ts')
        },
        {
            src: 'manual/typescript@2.2.0/lib.d.ts',
            dest: prepend(target, 'vendor/typescript@2.2.0/lib.d.ts')
        },
        {
            src: 'jspm_packages/github/geometryzen/ace-workers@2.0.11/src/worker.js',
            dest: prepend(target, 'js/worker.js')
        },
        {
            src: 'jspm_packages/github/geometryzen/ace-workers@2.0.11/dist/ace-workers.js',
            dest: prepend(target, 'js/ace-workers.js')
        },
        {
            src: "../ace-workers/dist/ace-workers.js",
            dest: prepend(target, 'js/ace-workers.js')
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
            src: "bower_components/angular/angular.js",
            dest: prepend(target, 'js/angular.js')
        },
        {
            expand: true,
            cwd: "museum/angular@1.5.3",
            src: ["**"],
            dest: prepend(target, 'vendor/angular@1.5.3')
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
            src: "museum/plotly@1.23.1/plotly.d.ts",
            dest: prepend(target, 'vendor/plotly@1.23.1/plotly.d.ts')
        },
        {
            src: "museum/plotly@1.23.1/plotly.js",
            dest: prepend(target, 'vendor/plotly@1.23.1/plotly.js')
        },
        {
            src: "museum/plotly@1.23.1/plotly.min.js",
            dest: prepend(target, 'vendor/plotly@1.23.1/plotly.min.js')
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
            src: "museum/two@0.6.0/two.d.ts",
            dest: prepend(target, 'vendor/two@0.6.0/two.d.ts')
        },
        {
            src: "museum/two@0.6.0/two.js",
            dest: prepend(target, 'vendor/two@0.6.0/two.js')
        },
        {
            src: "museum/two@0.6.0/two.min.js",
            dest: prepend(target, 'vendor/two@0.6.0/two.min.js')
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
            expand: true,
            cwd: "../davinci-csv/documentation",
            src: ["**"],
            dest: prepend(target, 'docs/davinci-csv')
        },
        {
            src: "bower_components/davinci-csv/dist/davinci-csv.d.ts",
            dest: prepend(target, 'vendor/davinci-csv@0.9.1/dist/davinci-csv.d.ts')
        },
        {
            src: "bower_components/davinci-csv/dist/davinci-csv.js",
            dest: prepend(target, 'vendor/davinci-csv@0.9.1/dist/davinci-csv.js')
        },
        {
            src: "../davinci-csv/dist/davinci-csv.d.ts",
            dest: prepend(target, 'vendor/davinci-csv@0.9.1/dist/davinci-csv.d.ts')
        },
        {
            src: "../davinci-csv/dist/davinci-csv.js",
            dest: prepend(target, 'vendor/davinci-csv@0.9.1/dist/davinci-csv.js')
        },
        {
            expand: true,
            cwd: "../davinci-eight/documentation",
            src: ["**"],
            dest: prepend(target, 'docs/davinci-eight')
        },
        {
            src: "bower_components/davinci-eight/dist/davinci-eight.d.ts",
            dest: prepend(target, 'vendor/davinci-eight@6.0.6/dist/davinci-eight.d.ts')
        },
        {
            src: "bower_components/davinci-eight/dist/davinci-eight.js",
            dest: prepend(target, 'vendor/davinci-eight@6.0.6/dist/davinci-eight.js')
        },
        {
            src: "bower_components/davinci-eight/dist/davinci-eight.css",
            dest: prepend(target, 'vendor/davinci-eight@6.0.6/dist/davinci-eight.css')
        },
        {
            src: "../davinci-eight/dist/davinci-eight.d.ts",
            dest: prepend(target, 'vendor/davinci-eight@6.0.6/dist/davinci-eight.d.ts')
        },
        {
            src: "../davinci-eight/dist/davinci-eight.js",
            dest: prepend(target, 'vendor/davinci-eight@6.0.6/dist/davinci-eight.js')
        },
        {
            src: "../davinci-eight/dist/davinci-eight.css",
            dest: prepend(target, 'vendor/davinci-eight@6.0.6/dist/davinci-eight.css')
        },
        {
            src: "bower_components/davinci-mathscript/dist/davinci-mathscript.d.ts",
            dest: prepend(target, 'vendor/davinci-mathscript@1.1.1/dist/davinci-mathscript.d.ts')
        },
        {
            // This version is bundled for transpile.
            src: "bower_components/davinci-mathscript/dist/davinci-mathscript.js",
            dest: prepend(target, 'vendor/davinci-mathscript@1.1.1/dist/davinci-mathscript.js')
        },
        {
            // This version is loaded into iframe for the runtime.
            src: "bower_components/davinci-mathscript/dist/davinci-mathscript.min.js",
            dest: prepend(target, 'vendor/davinci-mathscript@1.1.1/dist/davinci-mathscript.min.js')
        },
        {
            expand: true,
            cwd: "../davinci-newton/documentation",
            src: ["**"],
            dest: prepend(target, 'docs/davinci-newton')
        },
        {
            src: "bower_components/davinci-newton/dist/davinci-newton.d.ts",
            dest: prepend(target, 'vendor/davinci-newton@0.0.37/dist/davinci-newton.d.ts')
        },
        {
            src: "bower_components/davinci-newton/dist/davinci-newton.js",
            dest: prepend(target, 'vendor/davinci-newton@0.0.37/dist/davinci-newton.js')
        },
        {
            src: "../davinci-newton/dist/davinci-newton.d.ts",
            dest: prepend(target, 'vendor/davinci-newton@0.0.37/dist/davinci-newton.d.ts')
        },
        {
            src: "../davinci-newton/dist/davinci-newton.js",
            dest: prepend(target, 'vendor/davinci-newton@0.0.37/dist/davinci-newton.js')
        },
        {
            expand: true,
            cwd: "../davinci-units/documentation",
            src: ["**"],
            dest: prepend(target, 'docs/davinci-units')
        },
        {
            src: "bower_components/davinci-units/dist/davinci-units.d.ts",
            dest: prepend(target, 'vendor/davinci-units@1.5.4/dist/davinci-units.d.ts')
        },
        {
            src: "bower_components/davinci-units/dist/davinci-units.js",
            dest: prepend(target, 'vendor/davinci-units@1.5.4/dist/davinci-units.js')
        },
        {
            src: "../davinci-units/dist/davinci-units.d.ts",
            dest: prepend(target, 'vendor/davinci-units@1.5.4/dist/davinci-units.d.ts')
        },
        {
            src: "../davinci-units/dist/davinci-units.js",
            dest: prepend(target, 'vendor/davinci-units@1.5.4/dist/davinci-units.js')
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
        }
    ]
}

