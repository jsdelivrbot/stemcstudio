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

        copy: {
            dev: {
                files: [
                    {
                        src: 'app/index.html',
                        dest: 'generated/index.html'
                    },
                    {
                        src: 'jspm_packages/github/ace2ts/ace-workers@1.0.1/src/worker.js',
                        dest: 'generated/js/worker.js'
                    },
                    {
                        src: 'manual/aws/js/aws-sdk-2.3.12.min.js',
                        dest: 'generated/js/aws-sdk-2.3.12.min.js'
                    },
                    {
                        src: 'jspm_packages/github/ace2ts/ace-workers@1.0.1/dist/ace-workers.js',
                        dest: 'generated/js/ace-workers.js'
                    },
                    {
                        // Maintain the same relative path with jspm.config.js.
                        expand: true,
                        cwd: "jspm_packages",
                        src: ["**"],
                        dest: "generated/jspm_packages"
                    },
                    {
                        // Maintain the same relative path with jspm_packages.
                        src: 'jspm.config.js',
                        dest: 'generated/jspm.config.js'
                    },
                    {
                        src: 'manual/typescript@1.8.0/typescriptServices.js',
                        dest: 'generated/js/typescriptServices.js'
                    },
                    {
                        src: 'manual/typescript/lib.es6.d.ts',
                        dest: 'generated/typings/lib.es6.d.ts'
                    },
                    {
                        src: 'museum/typescript@1.4.1.3/lib.d.ts',
                        dest: 'generated/vendor/typescript@1.4.1.3/lib.d.ts'
                    },
                    {
                        src: 'museum/jasmine@2.4.1/lib/boot.js',
                        dest: 'generated/vendor/jasmine@2.4.1/lib/boot.js'
                    },
                    {
                        src: 'museum/jasmine@2.4.1/lib/console.js',
                        dest: 'generated/vendor/jasmine@2.4.1/lib/console.js'
                    },
                    {
                        src: 'museum/jasmine@2.4.1/lib/jasmine.css',
                        dest: 'generated/vendor/jasmine@2.4.1/lib/jasmine.css'
                    },
                    {
                        src: 'museum/jasmine@2.4.1/lib/jasmine.js',
                        dest: 'generated/vendor/jasmine@2.4.1/lib/jasmine.js'
                    },
                    {
                        src: 'museum/jasmine@2.4.1/lib/jasmine-html.js',
                        dest: 'generated/vendor/jasmine@2.4.1/lib/jasmine-html.js'
                    },
                    {
                        src: 'museum/jasmine@2.4.1/lib/jasmine.d.ts',
                        dest: 'generated/vendor/jasmine@2.4.1/lib/jasmine.d.ts'
                    },
                    {
                        src: 'museum/jasmine@2.4.1/lib/jasmine_favicon.png',
                        dest: 'generated/vendor/jasmine@2.4.1/lib/jasmine_favicon.png'
                    },
                    {
                        src: 'museum/jasmine@2.4.1/package.json',
                        dest: 'generated/vendor/jasmine@2.4.1/package.json'
                    },
                    {
                        expand: true,
                        cwd: "app/img",
                        src: ["**"],
                        dest: "generated/img"
                    },
                    {
                        src: 'app/img/checkerboard.jpg',
                        dest: 'generated/img/checkerboard.jpg'
                    },
                    {
                        src: 'app/img/particles.png',
                        dest: 'generated/img/particles.png'
                    },
                    {
                        expand: true,
                        cwd: "app/themes",
                        src: ["**"],
                        dest: "generated/themes"
                    },
                    {
                        src: "bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.eot",
                        dest: "generated/fonts/glyphicons-halflings-regular.eot"
                    },
                    {
                        src: "bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.svg",
                        dest: "generated/fonts/glyphicons-halflings-regular.svg"
                    },
                    {
                        src: "bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf",
                        dest: "generated/fonts/glyphicons-halflings-regular.ttf"
                    },
                    {
                        src: "bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff",
                        dest: "generated/fonts/glyphicons-halflings-regular.woff"
                    },
                    {
                        src: "bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2",
                        dest: "generated/fonts/glyphicons-halflings-regular.woff2"
                    },
                    {
                        src: "bower_components/angular/angular.js",
                        dest: "generated/js/angular.js"
                    },
                    {
                        expand: true,
                        cwd: "museum/angular@1.5.3",
                        src: ["**"],
                        dest: "generated/vendor/angular@1.5.3"
                    },
                    {
                        expand: true,
                        cwd: "museum/async@1.4.2",
                        src: ["**"],
                        dest: "generated/vendor/async@1.4.2"
                    },
                    {
                        src: "bower_components/async/dist/async.js",
                        dest: "generated/vendor/async@1.4.2/dist/async.js"
                    },
                    {
                        src: "bower_components/async/dist/async.min.js",
                        dest: "generated/vendor/async@1.4.2/dist/async.min.js"
                    },
                    {
                        expand: true,
                        cwd: "bower_components/bootstrap",
                        src: ["**"],
                        dest: "generated/vendor/bootstrap"
                    },
                    {
                        src: "museum/dat-gui@0.5.0/dat-gui.d.ts",
                        dest: "generated/vendor/dat-gui@0.5.0/dat-gui.d.ts"
                    },
                    {
                        src: "bower_components/dat-gui/build/dat.gui.js",
                        dest: "generated/vendor/dat-gui@0.5.0/dat-gui.js"
                    },
                    {
                        src: "bower_components/dat-gui/build/dat.gui.min.js",
                        dest: "generated/vendor/dat-gui@0.5.0/dat-gui.min.js"
                    },
                    {
                        expand: true,
                        cwd: "museum/d3@3.5.5",
                        src: ["**"],
                        dest: "generated/vendor/d3@3.5.5"
                    },
                    {
                        expand: true,
                        cwd: "museum/domready@1.0.0",
                        src: ["**"],
                        dest: "generated/vendor/domready@1.0.0"
                    },
                    {
                        expand: true,
                        cwd: "museum/gl-matrix@2.3.2",
                        src: ["**"],
                        dest: "generated/vendor/gl-matrix@2.3.2"
                    },
                    {
                        expand: true,
                        cwd: "museum/jquery@2.1.4",
                        src: ["**"],
                        dest: "generated/vendor/jquery@2.1.4"
                    },
                    {
                        src: "bower_components/jquery/dist/jquery.js",
                        dest: "generated/vendor/jquery@2.1.4/dist/jquery.js"
                    },
                    {
                        src: "bower_components/jquery/dist/jquery.min.js",
                        dest: "generated/vendor/jquery@2.1.4/dist/jquery.min.js"
                    },
                    {
                        expand: true,
                        cwd: "museum/jsxgraph@0.99.3",
                        src: ["**"],
                        dest: "generated/vendor/jsxgraph@0.99.3"
                    },
                    {
                        expand: true,
                        cwd: "museum/jsxgraph@0.99.4",
                        src: ["**"],
                        dest: "generated/vendor/jsxgraph@0.99.4"
                    },
                    {
                        expand: true,
                        cwd: "museum/jsxgraph@0.99.5",
                        src: ["**"],
                        dest: "generated/vendor/jsxgraph@0.99.5"
                    },
                    {
                        src: "museum/plotly@1.14.1/plotly.d.ts",
                        dest: "generated/vendor/plotly@1.14.1/plotly.d.ts"
                    },
                    {
                        src: "museum/plotly@1.14.1/plotly.js",
                        dest: "generated/vendor/plotly@1.14.1/plotly.js"
                    },
                    {
                        src: "museum/plotly@1.14.1/plotly.min.js",
                        dest: "generated/vendor/plotly@1.14.1/plotly.min.js"
                    },
                    {
                        src: "museum/requirejs@2.1.9/require.d.ts",
                        dest: "generated/vendor/requirejs@2.1.9/require.d.ts"
                    },
                    {
                        src: "bower_components/requirejs/require.js",
                        dest: "generated/vendor/requirejs@2.1.9/require.js"
                    },
                    {
                        expand: true,
                        cwd: "museum/stats.js@0.16.0",
                        src: ["**"],
                        dest: "generated/vendor/stats.js@0.16.0"
                    },
                    {
                        expand: true,
                        cwd: "museum/systemjs@0.19.37",
                        src: ["**"],
                        dest: "generated/vendor/systemjs@0.19.37"
                    },
                    {
                        expand: true,
                        cwd: "museum/threejs@0.78.0",
                        src: ["**"],
                        dest: "generated/vendor/threejs@0.78.0"
                    },
                    {
                        src: "bower_components/threejs/build/three.js",
                        dest: "generated/vendor/threejs@0.78.0/build/three.js"
                    },
                    {
                        src: "bower_components/threejs/build/three.min.js",
                        dest: "generated/vendor/threejs@0.78.0/build/three.min.js"
                    },
                    {
                        src: "museum/two@0.6.0/two.d.ts",
                        dest: "generated/vendor/two@0.6.0/two.d.ts"
                    },
                    {
                        src: "museum/two@0.6.0/two.js",
                        dest: "generated/vendor/two@0.6.0/two.js"
                    },
                    {
                        src: "museum/two@0.6.0/two.min.js",
                        dest: "generated/vendor/two@0.6.0/two.min.js"
                    },
                    {
                        expand: true,
                        cwd: "museum/underscore@1.8.3",
                        src: ["**"],
                        dest: "generated/vendor/underscore@1.8.3"
                    },
                    {
                        src: "bower_components/underscore/underscore.js",
                        dest: "generated/vendor/underscore@1.8.3/underscore.js"
                    },
                    {
                        src: "bower_components/underscore/underscore-min.js",
                        dest: "generated/vendor/underscore@1.8.3/underscore-min.js"
                    },
                    {
                        src: "bower_components/underscore/underscore-min.map",
                        dest: "generated/vendor/underscore@1.8.3/underscore-min.map"
                    },
                    {
                        expand: true,
                        cwd: "../davinci-eight/documentation",
                        src: ["**"],
                        dest: "generated/docs/davinci-eight"
                    },
                    {
                        src: "../davinci-eight/dist/davinci-eight.d.ts",
                        dest: "generated/vendor/davinci-eight@2.314.0/dist/davinci-eight.d.ts"
                    },
                    {
                        src: "../davinci-eight/dist/davinci-eight.js",
                        dest: "generated/vendor/davinci-eight@2.314.0/dist/davinci-eight.js"
                    },
                    {
                        src: "../davinci-eight/dist/davinci-eight.css",
                        dest: "generated/vendor/davinci-eight@2.314.0/dist/davinci-eight.css"
                    },
                    {
                        src: "bower_components/davinci-mathscript/dist/davinci-mathscript.d.ts",
                        dest: "generated/vendor/davinci-mathscript@1.1.1/dist/davinci-mathscript.d.ts"
                    },
                    {
                        // This version is bundled for transpile.
                        src: "bower_components/davinci-mathscript/dist/davinci-mathscript.js",
                        dest: "generated/vendor/davinci-mathscript@1.1.1/dist/davinci-mathscript.js"
                    },
                    {
                        // This version is loaded into iframe for the runtime.
                        src: "bower_components/davinci-mathscript/dist/davinci-mathscript.min.js",
                        dest: "generated/vendor/davinci-mathscript@1.1.1/dist/davinci-mathscript.min.js"
                    },
                    {
                        expand: true,
                        cwd: "../davinci-units/documentation",
                        src: ["**"],
                        dest: "generated/docs/davinci-units"
                    },
                    {
                        src: "../davinci-units/dist/davinci-units.d.ts",
                        dest: "generated/vendor/davinci-units@1.5.0/dist/davinci-units.d.ts"
                    },
                    {
                        src: "../davinci-units/dist/davinci-units.js",
                        dest: "generated/vendor/davinci-units@1.5.0/dist/davinci-units.js"
                    },
                    {
                        expand: true,
                        cwd: "../GeoCAS/documentation",
                        src: ["**"],
                        dest: "generated/docs/GeoCAS"
                    },
                    {
                        src: "../GeoCAS/dist/geocas.d.ts",
                        dest: "generated/vendor/GeoCAS@1.13.0/dist/geocas.d.ts"
                    },
                    {
                        src: "../GeoCAS/dist/geocas.js",
                        dest: "generated/vendor/GeoCAS@1.13.0/dist/geocas.js"
                    },
                ]
            },
            prod: {
                files: [
                    {
                        src: 'app/index.html',
                        dest: 'dist/index.html'
                    },
                    {
                        src: 'generated/css/app.css',
                        dest: 'dist/css/app.css'
                    },
                    {
                        src: 'jspm_packages/github/ace2ts/ace-workers@1.0.1/src/worker.js',
                        dest: 'dist/js/worker.js'
                    },
                    {
                        src: 'manual/aws/js/aws-sdk-2.3.12.min.js',
                        dest: 'dist/js/aws-sdk-2.3.12.min.js'
                    },
                    {
                        src: 'jspm_packages/github/ace2ts/ace-workers@1.0.1/dist/ace-workers.js',
                        dest: 'dist/js/ace-workers.js'
                    },
                    {
                        // Maintain the same relative path with jspm.config.js.
                        expand: true,
                        cwd: "jspm_packages",
                        src: ["**"],
                        dest: "dist/jspm_packages"
                    },
                    {
                        // Maintain the same relative path with jspm_packages.
                        src: 'jspm.config.js',
                        dest: 'dist/jspm.config.js'
                    },
                    {
                        src: 'manual/typescript@1.8.0/typescriptServices.js',
                        dest: 'dist/js/typescriptServices.js'
                    },
                    {
                        src: 'manual/typescript/lib.es6.d.ts',
                        dest: 'dist/typings/lib.es6.d.ts'
                    },
                    {
                        src: 'museum/typescript@1.4.1.3/lib.d.ts',
                        dest: 'dist/vendor/typescript@1.4.1.3/lib.d.ts'
                    },
                    {
                        src: 'museum/jasmine@2.4.1/lib/boot.js',
                        dest: 'dist/vendor/jasmine@2.4.1/lib/boot.js'
                    },
                    {
                        src: 'museum/jasmine@2.4.1/lib/console.js',
                        dest: 'dist/vendor/jasmine@2.4.1/lib/console.js'
                    },
                    {
                        src: 'museum/jasmine@2.4.1/lib/jasmine.css',
                        dest: 'dist/vendor/jasmine@2.4.1/lib/jasmine.css'
                    },
                    {
                        src: 'museum/jasmine@2.4.1/lib/jasmine.js',
                        dest: 'dist/vendor/jasmine@2.4.1/lib/jasmine.js'
                    },
                    {
                        src: 'museum/jasmine@2.4.1/lib/jasmine-html.js',
                        dest: 'dist/vendor/jasmine@2.4.1/lib/jasmine-html.js'
                    },
                    {
                        src: 'museum/jasmine@2.4.1/lib/jasmine.d.ts',
                        dest: 'dist/vendor/jasmine@2.4.1/lib/jasmine.d.ts'
                    },
                    {
                        src: 'museum/jasmine@2.4.1/lib/jasmine_favicon.png',
                        dest: 'dist/vendor/jasmine@2.4.1/lib/jasmine_favicon.png'
                    },
                    {
                        src: 'museum/jasmine@2.4.1/package.json',
                        dest: 'dist/vendor/jasmine@2.4.1/package.json'
                    },
                    {
                        expand: true,
                        cwd: "app/img",
                        src: ["**"],
                        dest: "dist/img"
                    },
                    {
                        src: 'app/img/checkerboard.jpg',
                        dest: 'dist/img/checkerboard.jpg'
                    },
                    {
                        src: 'app/img/particles.png',
                        dest: 'dist/img/particles.png'
                    },
                    {
                        expand: true,
                        cwd: "app/themes",
                        src: ["**"],
                        dest: "dist/themes"
                    },
                    {
                        src: "bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.eot",
                        dest: "dist/fonts/glyphicons-halflings-regular.eot"
                    },
                    {
                        src: "bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.svg",
                        dest: "dist/fonts/glyphicons-halflings-regular.svg"
                    },
                    {
                        src: "bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf",
                        dest: "dist/fonts/glyphicons-halflings-regular.ttf"
                    },
                    {
                        src: "bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff",
                        dest: "dist/fonts/glyphicons-halflings-regular.woff"
                    },
                    {
                        src: "bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2",
                        dest: "dist/fonts/glyphicons-halflings-regular.woff2"
                    },
                    {
                        src: "bower_components/angular/angular.js",
                        dest: "dist/js/angular.js"
                    },
                    {
                        expand: true,
                        cwd: "museum/angular@1.5.3",
                        src: ["**"],
                        dest: "dist/vendor/angular@1.5.3"
                    },
                    {
                        expand: true,
                        cwd: "museum/async@1.4.2",
                        src: ["**"],
                        dest: "dist/vendor/async@1.4.2"
                    },
                    {
                        src: "bower_components/async/dist/async.js",
                        dest: "dist/vendor/async@1.4.2/dist/async.js"
                    },
                    {
                        src: "bower_components/async/dist/async.min.js",
                        dest: "dist/vendor/async@1.4.2/dist/async.min.js"
                    },
                    {
                        expand: true,
                        cwd: "bower_components/bootstrap",
                        src: ["**"],
                        dest: "dist/vendor/bootstrap"
                    },
                    {
                        src: "museum/dat-gui@0.5.0/dat-gui.d.ts",
                        dest: "dist/vendor/dat-gui@0.5.0/dat-gui.d.ts"
                    },
                    {
                        src: "bower_components/dat-gui/build/dat.gui.js",
                        dest: "dist/vendor/dat-gui@0.5.0/dat-gui.js"
                    },
                    {
                        src: "bower_components/dat-gui/build/dat.gui.min.js",
                        dest: "dist/vendor/dat-gui@0.5.0/dat-gui.min.js"
                    },
                    {
                        expand: true,
                        cwd: "museum/d3@3.5.5",
                        src: ["**"],
                        dest: "dist/vendor/d3@3.5.5"
                    },
                    {
                        expand: true,
                        cwd: "museum/domready@1.0.0",
                        src: ["**"],
                        dest: "dist/vendor/domready@1.0.0"
                    },
                    {
                        expand: true,
                        cwd: "museum/gl-matrix@2.3.2",
                        src: ["**"],
                        dest: "dist/vendor/gl-matrix@2.3.2"
                    },
                    {
                        expand: true,
                        cwd: "museum/jquery@2.1.4",
                        src: ["**"],
                        dest: "dist/vendor/jquery@2.1.4"
                    },
                    {
                        src: "bower_components/jquery/dist/jquery.js",
                        dest: "dist/vendor/jquery@2.1.4/dist/jquery.js"
                    },
                    {
                        src: "bower_components/jquery/dist/jquery.min.js",
                        dest: "dist/vendor/jquery@2.1.4/dist/jquery.min.js"
                    },
                    {
                        expand: true,
                        cwd: "museum/jsxgraph@0.99.3",
                        src: ["**"],
                        dest: "dist/vendor/jsxgraph@0.99.3"
                    },
                    {
                        expand: true,
                        cwd: "museum/jsxgraph@0.99.4",
                        src: ["**"],
                        dest: "dist/vendor/jsxgraph@0.99.4"
                    },
                    {
                        expand: true,
                        cwd: "museum/jsxgraph@0.99.5",
                        src: ["**"],
                        dest: "dist/vendor/jsxgraph@0.99.5"
                    },
                    {
                        src: "museum/plotly@1.14.1/plotly.d.ts",
                        dest: "dist/vendor/plotly@1.14.1/plotly.d.ts"
                    },
                    {
                        src: "museum/plotly@1.14.1/plotly.js",
                        dest: "dist/vendor/plotly@1.14.1/plotly.js"
                    },
                    {
                        src: "museum/plotly@1.14.1/plotly.min.js",
                        dest: "dist/vendor/plotly@1.14.1/plotly.min.js"
                    },
                    {
                        src: "museum/requirejs@2.1.9/require.d.ts",
                        dest: "dist/vendor/requirejs@2.1.9/require.d.ts"
                    },
                    {
                        src: "bower_components/requirejs/require.js",
                        dest: "dist/vendor/requirejs@2.1.9/require.js"
                    },
                    {
                        expand: true,
                        cwd: "museum/stats.js@0.16.0",
                        src: ["**"],
                        dest: "dist/vendor/stats.js@0.16.0"
                    },
                    {
                        expand: true,
                        cwd: "museum/systemjs@0.19.37",
                        src: ["**"],
                        dest: "dist/vendor/systemjs@0.19.37"
                    },
                    {
                        expand: true,
                        cwd: "museum/threejs@0.78.0",
                        src: ["**"],
                        dest: "dist/vendor/threejs@0.78.0"
                    },
                    {
                        src: "bower_components/threejs/build/three.js",
                        dest: "dist/vendor/threejs@0.78.0/build/three.js"
                    },
                    {
                        src: "bower_components/threejs/build/three.min.js",
                        dest: "dist/vendor/threejs@0.78.0/build/three.min.js"
                    },
                    {
                        src: "museum/two@0.6.0/two.d.ts",
                        dest: "dist/vendor/two@0.6.0/two.d.ts"
                    },
                    {
                        src: "museum/two@0.6.0/two.js",
                        dest: "dist/vendor/two@0.6.0/two.js"
                    },
                    {
                        src: "museum/two@0.6.0/two.min.js",
                        dest: "dist/vendor/two@0.6.0/two.min.js"
                    },
                    {
                        expand: true,
                        cwd: "museum/underscore@1.8.3",
                        src: ["**"],
                        dest: "dist/vendor/underscore@1.8.3"
                    },
                    {
                        src: "bower_components/underscore/underscore.js",
                        dest: "dist/vendor/underscore@1.8.3/underscore.js"
                    },
                    {
                        src: "bower_components/underscore/underscore-min.js",
                        dest: "dist/vendor/underscore@1.8.3/underscore-min.js"
                    },
                    {
                        src: "bower_components/underscore/underscore-min.map",
                        dest: "dist/vendor/underscore@1.8.3/underscore-min.map"
                    },
                    {
                        expand: true,
                        cwd: "../davinci-eight/documentation",
                        src: ["**"],
                        dest: "dist/docs/davinci-eight"
                    },
                    {
                        src: "../davinci-eight/dist/davinci-eight.d.ts",
                        dest: "dist/vendor/davinci-eight@2.314.0/dist/davinci-eight.d.ts"
                    },
                    {
                        src: "../davinci-eight/dist/davinci-eight.js",
                        dest: "dist/vendor/davinci-eight@2.314.0/dist/davinci-eight.js"
                    },
                    {
                        src: "../davinci-eight/dist/davinci-eight.css",
                        dest: "dist/vendor/davinci-eight@2.314.0/dist/davinci-eight.css"
                    },
                    {
                        src: "bower_components/davinci-mathscript/dist/davinci-mathscript.d.ts",
                        dest: "dist/vendor/davinci-mathscript@1.1.1/dist/davinci-mathscript.d.ts"
                    },
                    {
                        // This version is bundled for transpile.
                        src: "bower_components/davinci-mathscript/dist/davinci-mathscript.js",
                        dest: "dist/vendor/davinci-mathscript@1.1.1/dist/davinci-mathscript.js"
                    },
                    {
                        // This version is loaded into iframe for the runtime.
                        src: "bower_components/davinci-mathscript/dist/davinci-mathscript.min.js",
                        dest: "dist/vendor/davinci-mathscript@1.1.1/dist/davinci-mathscript.min.js"
                    },
                    {
                        expand: true,
                        cwd: "../davinci-units/documentation",
                        src: ["**"],
                        dest: "dist/docs/davinci-units"
                    },
                    {
                        src: "../davinci-units/dist/davinci-units.d.ts",
                        dest: "dist/vendor/davinci-units@1.5.0/dist/davinci-units.d.ts"
                    },
                    {
                        src: "../davinci-units/dist/davinci-units.js",
                        dest: "dist/vendor/davinci-units@1.5.0/dist/davinci-units.js"
                    },
                    {
                        expand: true,
                        cwd: "../GeoCAS/documentation",
                        src: ["**"],
                        dest: "dist/docs/GeoCAS"
                    },
                    {
                        src: "../GeoCAS/dist/geocas.d.ts",
                        dest: "dist/vendor/GeoCAS@1.13.0/dist/geocas.d.ts"
                    },
                    {
                        src: "../GeoCAS/dist/geocas.js",
                        dest: "dist/vendor/GeoCAS@1.13.0/dist/geocas.js"
                    },
                ]
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
                "app/ts/editor/autocomplete/**/*.ts",
                "app/ts/editor/base/**/*.ts",
                "app/ts/editor/commands/**/*.ts",
                "app/ts/editor/dom/**/*.ts",
                "app/ts/editor/events/**/*.ts",
                "app/ts/editor/ext/**/*.ts",
                "app/ts/editor/mode/**/*.ts",
                "app/ts/editor/worker/**/*.ts",
                "app/ts/editor/workspace/**/*.ts",
                "app/ts/editor/addAltCursorListeners.ts",
                "app/ts/editor/Anchor.ts",
                "app/ts/editor/Annotation.ts",
                "app/ts/editor/applyDelta.ts",
                "app/ts/editor/BackgroundTokenizer.ts",
                "app/ts/editor/BehaviourCallback.ts",
                "app/ts/editor/BracketMatch.ts",
                "app/ts/editor/Change.ts",
                "app/ts/editor/comparePoints.ts",
                "app/ts/editor/Completion.ts",
                "app/ts/editor/CompletionList.ts",
                "app/ts/editor/CursorRange.ts",
                "app/ts/editor/Delta.ts",
                "app/ts/editor/DeltaGroup.ts",
                "app/ts/editor/Document.ts",
                // "app/ts/editor/Editor.ts",
                "app/ts/editor/editor_protocol.ts",
                "app/ts/editor/EditorRenderer.ts",
                "app/ts/editor/EditSession.ts",
                "app/ts/editor/EventBus.ts",
                "app/ts/editor/FirstAndLast.ts",
                "app/ts/editor/Fold.ts",
                "app/ts/editor/FoldEvent.ts",
                "app/ts/editor/FoldLine.ts",
                "app/ts/editor/HScrollBar.ts",
                "app/ts/editor/LanguageMode.ts",
                "app/ts/editor/LegacyNextRule.ts",
                "app/ts/editor/LineWidget.ts",
                "app/ts/editor/LineWidgetManager.ts",
                "app/ts/editor/Marker.ts",
                "app/ts/editor/OptionsProvider.ts",
                "app/ts/editor/PixelPosition.ts",
                "app/ts/editor/Position.ts",
                "app/ts/editor/Range.ts",
                "app/ts/editor/RangeBasic.ts",
                "app/ts/editor/RangeList.ts",
                "app/ts/editor/Renderer.ts",
                "app/ts/editor/RenderLoop.ts",
                "app/ts/editor/Rule.ts",
                "app/ts/editor/ScreenCoordinates.ts",
                "app/ts/editor/ScrollBar.ts",
                "app/ts/editor/Search.ts",
                "app/ts/editor/SearchHighlight.ts",
                "app/ts/editor/SearchOptions.ts",
                "app/ts/editor/Selection.ts",
                "app/ts/editor/Snippet.ts",
                "app/ts/editor/SnippetManager.ts",
                "app/ts/editor/SnippetOptions.ts",
                "app/ts/editor/Tabstop.ts",
                "app/ts/editor/TabstopManager.ts",
                "app/ts/editor/TextAndSelection.ts",
                "app/ts/editor/ThemeLink.ts",
                "app/ts/editor/Token.ts",
                "app/ts/editor/TokenIterator.ts",
                "app/ts/editor/TokenizedLine.ts",
                "app/ts/editor/Tokenizer.ts",
                "app/ts/editor/Tooltip.ts",
                "app/ts/editor/UndoManager.ts",
                "app/ts/editor/unicode.ts",
                "app/ts/editor/VScrollBar.ts",
                "app/ts/editor/WorkserCallback.ts",
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
    grunt.registerTask('web', "Set up environment for back-end development.", ['copy:web']);

    grunt.registerTask('dev', "Build for development.", ['ngtemplates', 'ts:app', 'copy:dev', 'less:dev']);

    grunt.registerTask('prod', "Build for production.", ['clean', 'ngtemplates', 'ts:app', 'tslint', 'copy:dev', 'less:dev', 'ts:web', 'tslint', 'copy:prod', 'bundle']);

    grunt.registerTask('default', ['prod']);

};