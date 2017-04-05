"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cookieParser = require("cookie-parser");
var express = require("express");
var path = require("path");
require('jade');
var lactate = require('lactate');
var logger = require("morgan");
var methodOverride = require("method-override");
var nconf = require("nconf");
var https = require("https");
var qs = require("querystring");
require('express-session');
var body_parser_1 = require("body-parser");
require('multer');
var errorHandler = require("errorhandler");
var index_1 = require("./server/routes/rooms/index");
var index_2 = require("./server/routes/stemcArXiv/index");
var index_3 = require("./server/routes/translations/index");
var npm = require('./package.json');
require('./configure');
var GITHUB_APPLICATION_CLIENT_ID_KEY = 'GITHUB_APPLICATION_CLIENT_ID';
var clientId = nconf.get(GITHUB_APPLICATION_CLIENT_ID_KEY);
var isProductionMode = function () {
    switch (process.env.NODE_ENV || 'development') {
        case 'development':
            return false;
        default:
            return true;
    }
};
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(body_parser_1.json());
app.use(body_parser_1.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride());
var folder = "" + (isProductionMode() ? 'dist' : 'generated');
app.use("/font", lactate.static(__dirname + "/" + folder + "/img", { "max age": "one week" }));
app.use(lactate.static(__dirname + "/" + folder, { "max age": "one week" }));
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
var authenticate = function (code, cb) {
    var data = qs.stringify({
        client_id: clientId,
        client_secret: nconf.get("GITHUB_APPLICATION_CLIENT_SECRET"),
        code: code
    });
    var options = {
        host: nconf.get("GITHUB_HOST"),
        port: nconf.get("GITHUB_PORT"),
        path: nconf.get("GITHUB_PATH"),
        method: nconf.get("GITHUB_METHOD"),
        headers: { 'content-length': data.length }
    };
    var body = "";
    var req = https.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) { body += chunk; });
        res.on('end', function () { cb(null, qs.parse(body).access_token); });
    });
    req.write(data);
    req.end();
    req.on('error', function (e) { cb(e.message); });
};
app.get("/*", function (req, res, next) {
    if (req.headers['host'].match(/^stemcstudio.herokuapp.com/)) {
        res.redirect("https://www.stemcstudio.com" + req.url, 301);
    }
    else {
        next();
    }
});
app.get('/authenticate/:code', function (req, res) {
    authenticate(req.params.code, function (err, token) {
        if (err) {
            return res.json(err);
        }
        else {
            return res.json(token ? { "token": token } : { "error": "bad_code" });
        }
    });
});
app.get("/github_callback", function (req, res, next) {
    res.cookie('stemcstudio-github-application-client-id', clientId);
    res.render("github_callback", {
        npm: npm
    });
});
app.post('/rooms', index_1.createRoom);
app.get('/rooms/:id', index_1.getRoom);
app.delete('/rooms/:id', index_1.destroyRoom);
app.post('/search', index_2.search);
app.post('/submissions', index_2.submit);
app.get('/translations/:input', index_3.getTranslation);
app.get("/*", function (req, res, next) {
    res.cookie('stemcstudio-github-application-client-id', clientId);
    res.render("index", {
        css: "/css/app.css?version=" + npm.version,
        js: "/js/app.js?version=" + npm.version,
        jspmSystemJs: "jspm_packages/system.js?version=" + npm.version,
        jspmConfigJs: "jspm.config.js?version=" + npm.version,
        jspmCoreJs: "jspm_packages/npm/core-js@2.4.1/client/shim.min.js",
        jspmZoneJs: "jspm_packages/npm/zone.js@0.8.5/dist/zone.js",
        jspmReflectJs: "jspm_packages/npm/reflect-metadata@0.1.10/Reflect.js",
        npm: npm
    });
});
app.use(errorHandler());
exports.default = app;
//# sourceMappingURL=app.js.map