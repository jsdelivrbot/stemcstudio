// The "wrapper" function.
module.exports = function (grunt) {

    // Do grunt-related things in here.

    var path = require('path');
    var Builder = require('systemjs-builder');
    var cp = require('child_process');
    var Q = require('q');

    // Project configuration.
    grunt.initConfig({

        // Access the package file contents for later use.
        pkg: grunt.file.readJSON('package.json'),

        // Task configuration.
        clean: {
            src: ['dist']
        },

        tslint: {
            src: [
                "src/fp/**/*.ts",
                "src/lib/**/*.ts",
                "src/mode/*.ts",
                "src/mode/html/*.ts",
                "src/mode/javascript/*.ts",
                "src/mode/json/*.ts",
                "src/mode/typescript/*.ts",
                "src/worker/**/*.ts",
                "src/*.ts"
            ],
            options: {
                configuration: 'tslint.json'
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'dist/stemcstudio-workspace.js',
                dest: 'dist/stemcstudio-workspace.min.js'
            }
        }
    });

    /**
     * tsc(tsfile: string, options): Promise
     */
    function tsc(options) {
        var command = "node " + path.resolve(path.dirname(require.resolve("typescript")), "tsc ");
        var optArray = Object.keys(options || {}).reduce(function (res, key) {
            res.push(key);
            if (options[key]) {
                res.push(options[key]);
            }
            return res;
        }, []);

        return Q.Promise(function (resolve, reject) {
            var cmd = command + " " + optArray.join(" ");
            var childProcess = cp.exec(cmd, {});
            childProcess.stdout.on('data', function (d) { grunt.log.writeln(d); });
            childProcess.stderr.on('data', function (d) { grunt.log.error(d); });

            childProcess.on('exit', function (code) {
                if (code !== 0) {
                    reject();
                }
                resolve();
            });
        });
    }

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-tslint');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('compile', "Compile TypeScript to ES6", function () {
        var done = this.async();
        tsc()
            .then(function () {
                done(true);
            })
            .catch(function () {
                done(false);
            });
    });

    function bundle() {
        var builder = new Builder('.', './config.js');

        var options = {
            minify: false,
            mangle: true,
            sourceMaps: false,
            lowResSourceMaps: false
        };

        return builder.bundle('stemcstudio-workspace.js', 'dist/stemcstudio-workspace.js', options);
    }

    grunt.registerTask('bundle', "Bundle ES6 into system modules", function () {
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

    grunt.registerTask('default', ['clean', 'compile', 'tslint', 'bundle', 'uglify']);
};
