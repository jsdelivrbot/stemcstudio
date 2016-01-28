// The "wrapper" function.
module.exports = function(grunt) {

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
      // Don't clean 'lib' yet until we figure out what to do with the worker-system.js file.
      src: ['amd', 'dist', 'es6', 'system', 'lib', 'documentation']
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
          mainConfigFile: "build.js",
          paths: {
          }
        }
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'dist/ace-workers.js',
        dest: 'dist/ace-workers.min.js'
      }
    },
    copy: {
      typings: {
        expand: true,
        cwd: 'typings/',
        src: ['ace-workers.d.ts'],
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
    // Check JavaScript files for errors/warnings
    jshint: {
        src: [
            'Gruntfile.js',
            'amd/**/*.js',
            'cjs/**/*.js',
            'spec/**/*.js'
        ],
        options: {
            jshintrc: '.jshintrc'
        }
    },
    // Build TypeScript documentation.
    yuidoc: {
        compile: {
            name: '<%= pkg.name %>',
            description: '<%= pkg.description %>',
            version: '<%= pkg.version %>',
            url: '<%= pkg.homepage %>',
            logo: '../assets/logo_half.png',
            options: {
                linkNatives: false, // Native types get linked to MDN.
                quiet: true,
                writeJSON: true,
                exclude: 'src/mode/css, src/mode/html, src/mode/javascript, src/mode/json, src/mode/php, src/mode/python, src/mode/xquery',
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

  /**
   * tsc(tsfile: string, options): Promise
   */
  function tsc(options) {
    var command = "node " + path.resolve(path.dirname(require.resolve("typescript")), "tsc ");
    var optArray = Object.keys(options || {}).reduce(function(res, key) {
            res.push(key);
            if(options[key]){
                res.push(options[key]);
            }
            return res;
        }, []);

    return Q.Promise(function(resolve, reject) {
      var cmd = command + " " + optArray.join(" ");
      var childProcess = cp.exec(cmd, {});
      childProcess.stdout.on('data', function (d) { grunt.log.writeln(d); });
      childProcess.stderr.on('data', function (d) { grunt.log.error(d); });

      childProcess.on('exit', function(code) {
        if (code !== 0) {
          reject();
        }
        resolve();
      });
    });
  }

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-complexity');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('compile', "Compile TypeScript to ES6", function() {
    var done = this.async();
    tsc()
    .then(function(){
      done(true);
    })
    .catch(function(){
      done(false);
    });
  });

  function bundle() {
    var builder = new Builder('.', './config.js');

    var options = {
      minify: false,
      mangle: true,
      sourceMaps: true,
      lowResSourceMaps: true
    };

    return builder.bundle('ace-workers.js', 'dist/ace-workers.js', options);
  }

  grunt.registerTask('bundle', "Bundle ES6 into system modules", function() {
    var done = this.async();
    bundle()
    .then(function(){
      done(true);
    })
    .catch(function(err){
      console.log(err);
      done(false);
    });
  });

  grunt.registerTask('test', ['connect:test', 'jasmine']);

  grunt.registerTask('testAll', ['exec:test', 'test']);

  grunt.registerTask('default', ['clean', 'compile', 'bundle', 'copy', 'yuidoc']);
};
