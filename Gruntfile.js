module.exports = function(grunt) {

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
            src: 'app/appcache.mf',
            dest: 'generated/appcache.mf'
          },
          {
            src: 'manual/ace/worker.js',
            dest: 'generated/js/worker.js'
          },
          {
            src: 'manual/ace/ace-workers.js',
            dest: 'generated/js/ace-workers.js'
          },
          {
            src: 'manual/ace/ace-workers.js.map',
            dest: 'generated/js/ace-workers.js.map'
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
            src: 'manual/typescript/typescriptServices.js',
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
            src: 'app/img/particles.png',
            dest: 'generated/img/particles.png'
          },
          {
            src: 'app/themes/twilight.css',
            dest: 'generated/themes/twilight.css'
          },
          {
            src: "vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.eot",
            dest: "generated/fonts/glyphicons-halflings-regular.eot"
          },
          {
            src: "vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.svg",
            dest: "generated/fonts/glyphicons-halflings-regular.svg"
          },
          {
            src: "vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf",
            dest: "generated/fonts/glyphicons-halflings-regular.ttf"
          },
          {
            src: "vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.woff",
            dest: "generated/fonts/glyphicons-halflings-regular.woff"
          },
          {
            src: "vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2",
            dest: "generated/fonts/glyphicons-halflings-regular.woff2"
          },
          {
            src: "vendor/angular/angular.js",
            dest: "generated/js/angular.js"
          },
          {
            expand: true,
            cwd: "museum/angular@1.4.6",
            src: ["**"],
            dest: "generated/vendor/angular@1.4.6"
          },
          {
            src: "vendor/angular/angular.js",
            dest: "generated/vendor/angular@1.4.6/angular.js"
          },
          {
            src: "vendor/angular/angular.min.js",
            dest: "generated/vendor/angular@1.4.6/angular.min.js"
          },
          {
            src: "vendor/angular/angular.min.js.map",
            dest: "generated/vendor/angular@1.4.6/angular.min.js.map"
          },
          {
            expand: true,
            cwd: "museum/async@1.4.2",
            src: ["**"],
            dest: "generated/vendor/async@1.4.2"
          },
          {
            src: "vendor/async/dist/async.js",
            dest: "generated/vendor/async@1.4.2/dist/async.js"
          },
          {
            src: "vendor/async/dist/async.min.js",
            dest: "generated/vendor/async@1.4.2/dist/async.min.js"
          },
          {
            expand: true,
            cwd: "vendor/bootstrap",
            src: ["**"],
            dest: "generated/vendor/bootstrap"
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
            cwd: "museum/jquery@2.1.4",
            src: ["**"],
            dest: "generated/vendor/jquery@2.1.4"
          },
          {
            src: "vendor/jquery/dist/jquery.js",
            dest: "generated/vendor/jquery@2.1.4/dist/jquery.js"
          },
          {
            src: "vendor/jquery/dist/jquery.min.js",
            dest: "generated/vendor/jquery@2.1.4/dist/jquery.min.js"
          },
          {
            expand: true,
            cwd: "museum/jsxgraph@0.99.3",
            src: ["**"],
            dest: "generated/vendor/jsxgraph@0.99.3"
          },
          {
            src: "museum/requirejs@2.1.9/require.d.ts",
            dest: "generated/vendor/requirejs@2.1.9/require.d.ts"
          },
          {
            src: "vendor/requirejs/require.js",
            dest: "generated/vendor/requirejs@2.1.9/require.js"
          },
          {
            expand: true,
            cwd: "museum/stats.js@0.0.14",
            src: ["**"],
            dest: "generated/vendor/stats.js@0.0.14"
          },
          {
            expand: true,
            cwd: "museum/threejs@0.72.0",
            src: ["**"],
            dest: "generated/vendor/threejs@0.72.0"
          },
          {
            src: "vendor/threejs/build/three.js",
            dest: "generated/vendor/threejs@0.72.0/build/three.js"
          },
          {
            src: "vendor/threejs/build/three.min.js",
            dest: "generated/vendor/threejs@0.72.0/build/three.min.js"
          },
          {
            expand: true,
            cwd: "museum/underscore@1.8.3",
            src: ["**"],
            dest: "generated/vendor/underscore@1.8.3"
          },
          {
            src: "vendor/underscore/underscore.js",
            dest: "generated/vendor/underscore@1.8.3/underscore.js"
          },
          {
            src: "vendor/underscore/underscore-min.js",
            dest: "generated/vendor/underscore@1.8.3/underscore-min.js"
          },
          {
            src: "vendor/underscore/underscore-min.map",
            dest: "generated/vendor/underscore@1.8.3/underscore-min.map"
          },
          {
            src: "vendor/davinci-eight/dist/davinci-eight.d.ts",
            dest: "generated/vendor/davinci-eight@2.102.0/dist/davinci-eight.d.ts"
          },
          {
            src: "vendor/davinci-eight/dist/davinci-eight.js",
            dest: "generated/vendor/davinci-eight@2.102.0/dist/davinci-eight.js"
          },
          {
            src: "vendor/davinci-mathscript/dist/davinci-mathscript.d.ts",
            dest: "generated/vendor/davinci-mathscript@1.0.8/dist/davinci-mathscript.d.ts"
          },
          {
            // This version is bundled for transpile.
            src: "vendor/davinci-mathscript/dist/davinci-mathscript.js",
            dest: "generated/vendor/davinci-mathscript@1.0.8/dist/davinci-mathscript.js"
          },
          {
            // This version is loaded into iframe for the runtime.
            src: "vendor/davinci-mathscript/dist/davinci-mathscript.min.js",
            dest: "generated/vendor/davinci-mathscript@1.0.8/dist/davinci-mathscript.min.js"
          }
        ]
      },
      prod: {
        files: [
          {
            src: 'app/index.html',
            dest: 'dist/index.html'
          },
          {
            src: 'app/appcache.mf',
            dest: 'dist/appcache.mf'
          },
          {
            src: 'generated/css/app.css',
            dest: 'dist/css/app.css'
          },
          {
            src: 'manual/ace/worker.js',
            dest: 'dist/js/worker.js'
          },
          {
            src: 'manual/ace/ace-workers.js',
            dest: 'dist/js/ace-workers.js'
          },
          {
            src: 'manual/ace/ace-workers.js.map',
            dest: 'dist/js/ace-workers.js.map'
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
            src: 'manual/typescript/typescriptServices.js',
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
            src: 'app/img/particles.png',
            dest: 'dist/img/particles.png'
          },
          {
            src: 'app/themes/twilight.css',
            dest: 'dist/themes/twilight.css'
          },
          {
            src: "vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.eot",
            dest: "dist/fonts/glyphicons-halflings-regular.eot"
          },
          {
            src: "vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.svg",
            dest: "dist/fonts/glyphicons-halflings-regular.svg"
          },
          {
            src: "vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf",
            dest: "dist/fonts/glyphicons-halflings-regular.ttf"
          },
          {
            src: "vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.woff",
            dest: "dist/fonts/glyphicons-halflings-regular.woff"
          },
          {
            src: "vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2",
            dest: "dist/fonts/glyphicons-halflings-regular.woff2"
          },
          {
            src: "vendor/angular/angular.js",
            dest: "dist/js/angular.js"
          },
          {
            expand: true,
            cwd: "museum/angular@1.4.6",
            src: ["**"],
            dest: "dist/vendor/angular@1.4.6"
          },
          {
            src: "vendor/angular/angular.js",
            dest: "dist/vendor/angular@1.4.6/angular.js"
          },
          {
            src: "vendor/angular/angular.min.js",
            dest: "dist/vendor/angular@1.4.6/angular.min.js"
          },
          {
            src: "vendor/angular/angular.min.js.map",
            dest: "dist/vendor/angular@1.4.6/angular.min.js.map"
          },
          {
            expand: true,
            cwd: "museum/async@1.4.2",
            src: ["**"],
            dest: "dist/vendor/async@1.4.2"
          },
          {
            src: "vendor/async/dist/async.js",
            dest: "dist/vendor/async@1.4.2/dist/async.js"
          },
          {
            src: "vendor/async/dist/async.min.js",
            dest: "dist/vendor/async@1.4.2/dist/async.min.js"
          },
          {
            expand: true,
            cwd: "vendor/bootstrap",
            src: ["**"],
            dest: "dist/vendor/bootstrap"
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
            cwd: "museum/jquery@2.1.4",
            src: ["**"],
            dest: "dist/vendor/jquery@2.1.4"
          },
          {
            src: "vendor/jquery/dist/jquery.js",
            dest: "dist/vendor/jquery@2.1.4/dist/jquery.js"
          },
          {
            src: "vendor/jquery/dist/jquery.min.js",
            dest: "dist/vendor/jquery@2.1.4/dist/jquery.min.js"
          },
          {
            expand: true,
            cwd: "museum/jsxgraph@0.99.3",
            src: ["**"],
            dest: "dist/vendor/jsxgraph@0.99.3"
          },
          {
            src: "museum/requirejs@2.1.9/require.d.ts",
            dest: "dist/vendor/requirejs@2.1.9/require.d.ts"
          },
          {
            src: "vendor/requirejs/require.js",
            dest: "dist/vendor/requirejs@2.1.9/require.js"
          },
          {
            expand: true,
            cwd: "museum/stats.js@0.0.14",
            src: ["**"],
            dest: "dist/vendor/stats.js@0.0.14"
          },
          {
            expand: true,
            cwd: "museum/threejs@0.72.0",
            src: ["**"],
            dest: "dist/vendor/threejs@0.72.0"
          },
          {
            src: "vendor/threejs/build/three.js",
            dest: "dist/vendor/threejs@0.72.0/build/three.js"
          },
          {
            src: "vendor/threejs/build/three.min.js",
            dest: "dist/vendor/threejs@0.72.0/build/three.min.js"
          },
          {
            expand: true,
            cwd: "museum/underscore@1.8.3",
            src: ["**"],
            dest: "dist/vendor/underscore@1.8.3"
          },
          {
            src: "vendor/underscore/underscore.js",
            dest: "dist/vendor/underscore@1.8.3/underscore.js"
          },
          {
            src: "vendor/underscore/underscore-min.js",
            dest: "dist/vendor/underscore@1.8.3/underscore-min.js"
          },
          {
            src: "vendor/underscore/underscore-min.map",
            dest: "dist/vendor/underscore@1.8.3/underscore-min.map"
          },
          {
            src: "vendor/davinci-eight/dist/davinci-eight.d.ts",
            dest: "dist/vendor/davinci-eight@2.102.0/dist/davinci-eight.d.ts"
          },
          {
            src: "vendor/davinci-eight/dist/davinci-eight.js",
            dest: "dist/vendor/davinci-eight@2.102.0/dist/davinci-eight.js"
          },
          {
            src: "vendor/davinci-mathscript/dist/davinci-mathscript.d.ts",
            dest: "dist/vendor/davinci-mathscript@1.0.8/dist/davinci-mathscript.d.ts"
          },
          {
            // This version is bundled for transpile.
            src: "vendor/davinci-mathscript/dist/davinci-mathscript.js",
            dest: "dist/vendor/davinci-mathscript@1.0.8/dist/davinci-mathscript.js"
          },
          {
            // This version is loaded into iframe for the runtime.
            src: "vendor/davinci-mathscript/dist/davinci-mathscript.min.js",
            dest: "dist/vendor/davinci-mathscript@1.0.8/dist/davinci-mathscript.min.js"
          }
        ]
      },
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
          bootstrap: function(module, script) {
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

  function bundle() {
    // Set the baseURL and load the configuration file.
    const builder = new Builder('./generated', './generated/jspm.config.js');

    var options = {
      minify: true,
      mangle: true,
      sourceMaps: false,
      lowResSourceMaps: false
    };

    return builder.bundle('js/bootstrap.js', 'dist/js/bootstrap.js', options);
  }

  grunt.registerTask('bundle', "Bundle into system modules", function() {
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

  grunt.registerTask('dev', ['clean','ngtemplates', 'ts:app', 'copy:dev', 'less:dev']);

  grunt.registerTask('prod', ['dev', 'ts:web', 'copy:prod', 'bundle']);

  grunt.registerTask('default', ['prod']);

};