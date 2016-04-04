# MathDoodle

Learning Mathematics and Geometric Physics through Computational Modeling.

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

1. `git clone https://github.com/geometryzen/mathdoodle.git`
2. `cd mathdoodle`
3. `npm install`
4. `bower install`
5. `typings install`
6. `jspm install`
7. `grunt`
8. Open another terminal
9. `cd mathdoodle`
10. `npm start`
11. Open your web browser to localhost:8080

# Upgrading

Update versions in

1. package.json
2. bower.json
3. app/ts/app.ts

git push origin master

# Upload to Heroku

## Remote
```
git remote add heroku git@heroku.com:mathdoodle.git
```

## Push
```
git push -f heroku master
```
