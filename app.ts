import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as path from 'path';
import favicon = require('serve-favicon');
import jade = require('jade');
const lactate = require('lactate');
import logger = require('morgan');
import methodOverride = require('method-override');
import nconf = require('nconf');
import https = require('https');
import qs = require('querystring');
import session = require('express-session');
import * as bodyParser from 'body-parser';
import multer = require('multer');
import errorHandler = require('errorhandler');

const npm = require('./package.json');

const cfg = require('./configure');

const clientId = nconf.get("GITHUB_APPLICATION_CLIENT_ID");

const isProductionMode = () => {
  switch(process.env.NODE_ENV || 'development') {
    case 'development':
      return false;
    default:
      return true;
  }
};

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// app.set("view options", {layout: false});

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(methodOverride());
// TODO session

// Serve out of dist or generated, depending upon the environment.
const folder = `${isProductionMode() ? 'dist' : 'generated'}`;
app.use("/font", lactate.static(`${__dirname}/${folder}/img`, {"max age": "one week"}));
app.use(lactate.static(`${__dirname}/${folder}`, {"max age": "one week"}));

// Something rotten about the following line.
// app.use multer()

// Convenience for allowing CORS on routes - GET only
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const authenticate = (code, cb) => {

  // This is step two in the GitHub Web Application Flow and occurs
  // after GitHub redirects back to the site (assuming user accepts request).
  // The following step exchanges the temporary code for an access token.
  // POST https://github.com/login/oauth/access_token
  const data = qs.stringify({
    client_id: nconf.get("GITHUB_APPLICATION_CLIENT_ID"),
    client_secret: nconf.get("GITHUB_APPLICATION_CLIENT_SECRET"),
    code: code
    });

  const options = {
    host: nconf.get("GITHUB_HOST"),     // github.com
    port: nconf.get("GITHUB_PORT"),     // 443
    path: nconf.get("GITHUB_PATH"),     // /login/oath/access_token
    method: nconf.get("GITHUB_METHOD"), // POST
    headers: {'content-length': data.length}
  };

  let body = "";
  const req = https.request(options, (res) => {
    res.setEncoding('utf8');
    res.on('data', (chunk) => {body += chunk;});
    res.on('end', () => {cb(null, qs.parse(body).access_token);});
  });

  req.write(data);
  req.end();
  req.on('error', (e) => {cb(e.message)});
};

// Forward mathdoodle.herokuapp.com to www.mathdoodle.io
// Notice that we use HTTP status 301 Moved Permanently (best for SEO purposes).
app.get("/*", (req: express.Request, res, next) => {
    if (req.headers['host'].match(/^mathdoodle.herokuapp.com/)) {
      res.redirect("http://www.mathdoodle.io#{req.url}", 301);
    }
    else {
      next()
    }
});

// Exchange the session code for an access token.
app.get('/authenticate/:code', (req, res) => {
  authenticate(req.params.code, (err, token) => {
    if (err) {
      return res.json(err);
    }
    else {
      res.json(token ? {"token": token} : {"error": "bad_code"});
    }
  });
});

app.get("/github_callback", (req, res, next) => {
  // Set a cookie to communicate the GitHub Client ID back to the client.
  res.cookie('mathdoodle-github-application-client-id', nconf.get("GITHUB_APPLICATION_CLIENT_ID"));
  res.render("github_callback", {
    npm: npm
  });
});

app.get("/*", (req, res, next) => {
  // Set a cookie to communicate the GitHub Client ID back to the client.
  const clientId = nconf.get("GITHUB_APPLICATION_CLIENT_ID");
  res.cookie('mathdoodle-github-application-client-id', nconf.get("GITHUB_APPLICATION_CLIENT_ID"));
  res.render("index", {
    css: "/css/app.css?version=#{npm.version}",
    js:  "/js/app.js?version=#{npm.version}",
    npm: npm
  });
});

// error handling middleware should be loaded after loading the routes
app.use(errorHandler())

export default app;
