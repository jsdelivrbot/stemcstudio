# STEMCstudio

Learning STEM through Computational Modeling.

# Prerequisites

## Node.js (go to http://node.js.or/)

## Typings
```
npm install -g typings
```

## Karma
```
npm install -g karma-cli
```

# Instructions

1. `git clone https://github.com/geometryzen/STEMCstudio.git`
2. `cd STEMCstudio`
3. `npm install`
4. `bower install`
5. `typings install`
6. `jspm install`

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

# Upgrading

Update versions in

1. package.json
2. bower.json
3. app/ts/app.ts

## Upgrading ace

1. tsconfig.json
2. Gruntfile.js
3. package.json
4. jspm.config.js

```
npm install
npm update
bower install
bower update
jspm install
jspm update
``` 
## Upgrading ace-workers

1. Gruntfile.js
2. package.json
3. jspm.config.js

git push origin master

# Upload to Heroku

## Remote
```
git remote add heroku git@heroku.com:STEMCstudio.git
```

## Push
```
git push -f heroku master
```

## JSPM

This application uses JSPM for module loading.
For AngularJS modules, you must both modify `jspm.config.js` and `app.ts`.
