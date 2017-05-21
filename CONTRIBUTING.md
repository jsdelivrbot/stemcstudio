# STEMCstudio

Learning STEM through Computational Modeling.

## Prerequisites

### Node.js (go to http://node.js.or/)

### Karma
```
npm install -g karma-cli
```

## Instructions

1. `git clone https://github.com/geometryzen/STEMCstudio.git`
2. `cd STEMCstudio`
3. `npm install`
4. `bower install`
6. `jspm install`
7. Manually fix: node_modules/@types/angular-resource/index.d.ts(194,40): error TS2694
8. `grunt`

### Peer Projects Required

The following projects are required as peer dependencies of STEMCstudio in order to stage their documentation.

* davinci-eight
* davinci-newton
* davinci-units

These projects are available from the geometryzen GitHub repository.

The copying of the documentation is performed by the STEMCstudio build.
(The documentation for these projects is generated and is not checked into GitHub).


### Manual Tweak

Manully tweak typings/browser/ambient/angular-ui-bootstrap/index.d.ts as follows:

```
declare module 'angular-bootstrap' {
    export = AngularUiBootstrap
}

declare module AngularUiBootstrap {
```

7. `grunt`
8. Open another terminal
9. `cd STEMCstudio`
10. `npm start`
11. Open your web browser to localhost:8080

## Testing

After building to create `generated`,

change `baseURL` property in `generated/jspm.config.js` to:

```js
baseURL: "/base/generated/",
```

How to make this work without messing with this file?

```
karma start
```

## Upgrading

Update versions in

1. package.json
2. bower.json
3. app/ts/app.ts

### Upgrading a library dependency such as davinci-csv, davinci-eight, or davinci-newton.

1. package.json or bower.json - update the version
2. optionManager.service.ts - update the version
3. Gruntfile.js - update the version


### Upgrading ace

1. tsconfig.json
2. Gruntfile.js
3. package.json
4. jspm.config.js

### Upgrading ace-workers

Make sure that the version references are correct in the following files:

1. package.json
2. Gruntfile.js
3. jspm.config.js
4. constants.ts (ACE_WORKER_VERSION)

### Upgrading @angular/upgrade/static

If you get errors Running "bundle" task, check version of @angular/upgrade/static.
This bundle does not have a package.json equivalent entry and so can get left behind.
The change should be made in jspm.config.js

git push origin master

### Upgrading TypeScript (version used at runtime)

1. Gruntfile.js
2. app.ts

### Tested versions of TypeScript and ace-workers

|TypeScript|ace-workers|
------------------------
|1.8.0     |1.x        |
|2.2.0     |2.x        |
|2.3.1     |2.9.3      | (Operator Overloading)

```
npm install
npm update
bower install
bower update
jspm install
jspm update
```

### Upgrading davinci-mathscript

1. package.json (jspm)
2. bower.json (version)
3. app/ts/app.ts (FILENAME_MATHSCRIPT_CURRENT_LIB_MIN_JS)
4. jspm.config.js (3 places)
5. Gruntfile.js

```
npm install
npm update
bower install
bower update
jspm install
jspm update
```

6. Update typings-manual/browser/ambient/davinci-mathscript/index.d.ts

```
grunt
```

### Upgrading Jasmine Testing Framework

1. Download latest stable release from https://jasmine.github.io
2. Unpack into museum/jasmine@major.minor.patch.
3. Copy and (if required) update jasmine.d.ts from previous version.
4. Create a package.json in the root (use existing as guide).
5. Verify structure similar to previous versions.
6. Upgrade STEMCstudio Gruntfile.js to copy the appropriate version.
7. Update STEMCstudio VERSION_JASMINE variable in options.ts to reflect the correct version.

## Upload to Heroku

Application is stemcstudio

Email: geometryzen@gmail.com, R...

### Remote
```
git remote add heroku git@heroku.com:STEMCstudio.git
```

### Push
```
git push -f heroku master
```

## JSPM

This application uses JSPM for module loading.
For AngularJS modules, you must both modify `jspm.config.js` and `app.ts`.

## Highlighters and Regular Expressions

Considerable use is made of regular expressions for syntax highlighting.
It would be nice if there were a RegExp pre-processor that could convert something
more human-readable (e.g. railroad diagram, schema, or JSON) into a RegExp.

Until then https://www.debuggex.com provides a nice visualization.

Another approach would be a literate API for building RegExp, but that would impact performance.

e.g. https://github.com/VerbalExpressions/JSVerbalExpressions
