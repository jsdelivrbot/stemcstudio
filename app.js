"use strict";
var cookieParser = require('cookie-parser');
var express = require('express');
var path = require('path');
var lactate = require('lactate');
var logger = require('morgan');
var methodOverride = require('method-override');
var nconf = require('nconf');
var https = require('https');
var qs = require('querystring');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var stemcArXiv = require('./server/routes/stemcArXiv/index');
var npm = require('./package.json');
var cfg = require('./configure');
var clientId = nconf.get("GITHUB_APPLICATION_CLIENT_ID");
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
        client_id: nconf.get("GITHUB_APPLICATION_CLIENT_ID"),
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
            res.json(token ? { "token": token } : { "error": "bad_code" });
        }
    });
});
app.get("/github_callback", function (req, res, next) {
    res.cookie('stemcstudio-github-application-client-id', nconf.get("GITHUB_APPLICATION_CLIENT_ID"));
    res.render("github_callback", {
        npm: npm
    });
});
app.post('/search', stemcArXiv.search);
app.post('/submit', stemcArXiv.submit);
app.get("/*", function (req, res, next) {
    var clientId = nconf.get("GITHUB_APPLICATION_CLIENT_ID");
    res.cookie('stemcstudio-github-application-client-id', nconf.get("GITHUB_APPLICATION_CLIENT_ID"));
    res.render("index", {
        css: "/css/app.css?version=" + npm.version,
        js: "/js/app.js?version=" + npm.version,
        npm: npm
    });
});
app.use(errorHandler());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = app;
