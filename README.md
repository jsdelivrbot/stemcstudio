# Math Doodle

Computational Learning Environment.

[![Build Status](https://travis-ci.org/geometryzen/davincidoodle.svg?branch=master)](https://travis-ci.org/geometryzen/mathdoodle)

Web Site: [Math Doodle](mathdoodle.io).
This version uses TypeScript exclusively as the modeling language and saves models to local storage and GitHub.

# Instructions

1. `git clone https://github.com/geometryzen/mathdoodle.git`
2. `cd mathdoodle`
3. `sudo npm install -g lineman`
4. `npm install`
5. `lineman run`
6. open your web browser to localhost:8000

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
