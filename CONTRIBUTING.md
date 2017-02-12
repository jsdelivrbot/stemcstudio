# STEMCstudio

Learning STEM through Computational Modeling.

## Prerequisites

### Node.js (go to http://node.js.or/)

### Typings
```
npm install -g typings
```

### Karma
```
npm install -g karma-cli
```

## Instructions

1. `git clone https://github.com/geometryzen/STEMCstudio.git`
2. `cd STEMCstudio`
3. `npm install`
4. `bower install`
5. `typings install`
6. `jspm install`

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

```
karma start
```

## Upgrading

Update versions in

1. package.json
2. bower.json
3. app/ts/app.ts

### Upgrading a library dependency such as davinci-eight

1. bower.json - update the version
2. options.ts - update the version
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

### Upgrading TypeScript (version used at runtime)

1. Grintfile.js
2. app.ts

### Tested versions of TypeScript and ace-workers

|TypeScript|ace-workers|
------------------------
|1.8.0     |1.0.4      |

```
npm install
npm update
bower install
bower update
jspm install
jspm update
``` 
### Upgrading ace-workers

1. Gruntfile.js
2. package.json
3. jspm.config.js

git push origin master

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
