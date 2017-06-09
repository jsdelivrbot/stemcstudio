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

Clone and compile the TypeScript repository (with operatorOverloading) and copy the following into the `typings` folder.

```
typeScriptServices.d.ts
```

# Development #

npm install -g karma-cli

```
tsc [-w]
```

```
karma start
```

# Package #

Grunt is used to create a classic distribution and documentation.

```
grunt
```

# Documentation #

This is currently generated from comments in the code.
There will be some redundancy in type declarations until a TypeScript-aware tool is used.

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

This package is not yet registered with NPM.
