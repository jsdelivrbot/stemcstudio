lineman.js
----------
This is referenced from the Gruntfile.js file in the root.

The `$lineman run` command loads lineman.js then Lineman goes onto load application.js and files.js

application.js
--------------
Notice that in the concat_sourcemap we order the files such that the AngularJS 'app' module gets defined first.

files.js
--------

plugins/typescript.coffee
-------------------------

Instead of adding to a Gruntfile...

`grunt.loadNpmTasks('grunt-typescript');`,

the enabling of the grunt-typescript plugin happens in typescript.coffee

Be aware that there is also TypeScript configuration in

config/application.js
---------------------

Amongst other things, explicitly loads the files specified in `plugins`.
