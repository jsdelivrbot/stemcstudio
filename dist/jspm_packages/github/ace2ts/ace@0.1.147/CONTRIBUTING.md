Ace CONTRIBUTING
================

Browser Code Editor targeting ES6 written in TypeScript

# SetUp #

```
git clone ...
```

```
cd ace
```

Install NPM dependencies (most of build).

```
npm install
```

Install Bower dependencies (use of r.js for AMD packaging).

```
bower install
```

Install JSPM dependencies (provides ace-workers).

```
jspm install
```

# Build #

Grunt is used to create a distribution and documentation.

```
grunt
```

# Execute #

Use an HTTP server to serve index.html (from the ace-demo folder).

```
http-server -o -c-1
```

# Documentation #

This is currently generated from comments in the code.
There will be some redundancy in type declarations until a TypeScript-aware tool is used.

# d.ace.ts #

This is manually maintained in dts/ace.d.ts

# versioning #

package.json
bower.json
dts/ace.d.ts
