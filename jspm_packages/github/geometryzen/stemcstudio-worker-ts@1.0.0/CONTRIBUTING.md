stemcstudio-worker-ts CONTRIBUTING
==================================

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

# Customized TypeScript #

Clone and compile the TypeScript repository (with operatorOverloading) and copy the following into the `typings` folder.

```
typeScriptServices.d.ts
```

# Development #

npm install -g karma-cli

```
tsc [-w]
```

# Package #

Grunt is used to create a classic distribution and documentation.

```
grunt
```

# Test #

```
karma start
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
