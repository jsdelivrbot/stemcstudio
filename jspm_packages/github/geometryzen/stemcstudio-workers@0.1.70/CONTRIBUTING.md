Ace CONTRIBUTING
================

Browser Code Editor targeting ES6 written in TypeScript

# SetUp #

```
git clone ...
```

Install NPM dependencies (most of build).

```
npm install
npm update
```

Install Bower dependencies (use of r.js for AMD packaging).

```
bower install
bower update
```

Not currently using JSPM, so this isn't required

```
jspm install
jspm update
```

Clone and compile the TypeScript repository and copy the following into ace-workers/typings

```
lib.es6.d.ts
lib.webworker.es6.d.ts (copy lib.webworker.d.ts, rename then change reference path to pint to lib.es6.d.ts)
typeScriptServices.d.ts
```

# Development #

```
tsc [-w]
```

# Package #

Grunt is used to create a classic distribution and documentation.

```
grunt
```

# Documentation #

This is currently generated from comments in the code.
There will be some redundancy in type declarations until a TypeScript-aware tool is used.

# ace-workers.d.ts #

This is manually maintained in typings/ace-workers.d.ts

# jscover #

"jscover": "http://github.com/tntim96/JSCover.git"

# versioning #

```
package.json
```

```
bower.json
```

```
git add --all
git commit -m '...'
git tag -a major.minor.patch -m '...'
git push origin master --tags
```