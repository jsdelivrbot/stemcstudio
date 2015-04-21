# Geometry Zen Modeling Environment

[![Build Status](https://travis-ci.org/geometryzen/geozenme.png?branch=master)](https://travis-ci.org/geometryzen/geozenme)

This is the project for [GeoZenME](http://www.geozenme.org).

# Features

1. Template Precompilation into Angulars $templateCache using `grunt-angular-templates`
2. Configured [grunt-ng-annotate](https://github.com/mzgol/grunt-ng-annotate) so you don't have to fully qualify angular dependencies.
3. Auto generated [sourcemaps](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/) with inlined sources via [grunt-concat-sourcemap](https://github.com/kozy4324/grunt-concat-sourcemap) (you'll need to [enable sourcemaps](http://cl.ly/image/1d0X2z2u1E3b) in Firefox/Chrome to see this)
4. [Unit Tests](https://github.com/linemanjs/lineman-angular-template/tree/master/spec) and [End-to-End Tests](https://github.com/linemanjs/lineman-angular-template/tree/master/spec-e2e)
5. Configuration to run [Protractor](https://github.com/juliemr/protractor) for End-to-End Tests

# Instructions

1. `git clone https://github.com/geometryzen/geozenme.git`
2. `cd geozenme`
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

# Defining your apps angular.module in CoffeeScript

If you are using Coffeescript to define the angular.module for your app, you will need to swap the concat order in `config/application.js` such that coffeescript files are included _before_ javascript. (If you are using JavaScript for defining the angular.module the default concat order is fine).

Add the following `concat_sourcemap` block to `config/application.js` if you want to define your app module in coffeescript:

```javascript
module.exports = function(lineman) {
  return {

    concat_sourcemap: {
      js: {
        src: [
          "<%= files.js.vendor %>",
          "<%= files.coffee.generated %>",
          "<%= files.js.app %>",
          "<%= files.ngtemplates.dest %>"
        ]
      }
    }

  };
};
```
