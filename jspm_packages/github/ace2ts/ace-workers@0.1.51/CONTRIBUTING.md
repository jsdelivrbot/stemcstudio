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
```

Install Bower dependencies (use of r.js for AMD packaging).

```
bower install
```

Not currently using JSPM, so this isn't required

```
jspm install
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

# d.ace.ts #

This is manually maintained in src/modules/ace.d.ts

# jscover #

"jscover": "http://github.com/tntim96/JSCover.git"

