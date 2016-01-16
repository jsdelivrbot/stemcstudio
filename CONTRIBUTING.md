# MathDoodle

Learning Mathematics and Geometric Physics through Computational Modeling.

# Instructions

1. `git clone https://github.com/geometryzen/mathdoodle.git`
2. `cd mathdoodle`
3. `npm install -g lineman`
4. `npm install`
5. `bower install`

6. `lineman clean`
7. `lineman build`
8. `lineman run`

9. open your web browser to localhost:8000

# Running Tests

To run the unit tests:

1. `lineman run` from 1 terminal window
2. `lineman spec` from another terminal window, this will launch Testem and execute specs in Chrome

To run the end-to-end tests:

## End-to-End Tests

1. `npm install protractor`
2. `./node_modules/protractor/bin/webdriver-manager update`
3. Make sure you have chrome installed.
4. `lineman run` from 1 terminal window
5. `lineman grunt spec-e2e` from another terminal window

# Upgrading

Update versions in

1. package.json
2. bower.json
3. appcache.mf
4. app/js/services/constants/constants.ts

git push origin master
git push -f heroku master

# Remotes

git remote add heroku git@heroku.com:mathdoodle.git

# Component

## Ace

MathDoodle is a test-bed for a re-written Ace editor.
