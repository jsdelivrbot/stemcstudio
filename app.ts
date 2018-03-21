import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import { Request, Response } from 'express';
import * as path from 'path';
// Uncomment after placing favicon in /public
// import favicon = require('serve-favicon');
// require('pug');
const lactate = require('lactate');
import logger = require('morgan');
import methodOverride = require('method-override');
import nconf = require('nconf');
import https = require('https');
import qs = require('querystring');
require('express-session');
import { json, urlencoded } from 'body-parser';
require('multer');
import errorHandler = require('errorhandler');
import forceDomain = require('forcedomain');

// Temporary disable rooms to prevent Redis from loading.
import { createRoom, getRoom, destroyRoom } from './server/routes/rooms/index';
import { search, submit } from './server/routes/stemcArXiv/index';
import { getTranslation } from './server/routes/translations/index';
import { IncomingMessage } from 'http';

const npm = require('./package.json');
require('./configure');

const GITHUB_APPLICATION_CLIENT_ID_KEY = 'GITHUB_APPLICATION_CLIENT_ID';
const clientId = nconf.get(GITHUB_APPLICATION_CLIENT_ID_KEY);
const STEMCSTUDIO_GITHUB_APPLICATION_CLIENT_ID_COOKIE_NAME = 'stemcstudio-github-application-client-id';
// console.lg(`${GITHUB_APPLICATION_CLIENT_ID_KEY} is '${clientId}'.`);

const isProductionMode = () => {
    switch (process.env.NODE_ENV || 'development') {
        case 'development':
            return false;
        default:
            return true;
    }
};

export const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// app.set("view options", {layout: false});

// Uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride());
//
// Using https://prerender.io for Cached Pages.
//
app.use(require('prerender-node').set('prerenderToken', 'sS0E4UAJN4GidsdVwMD9'));

// Serve out of dist or generated, depending upon the environment.
const folder = `${isProductionMode() ? 'dist' : 'generated'}`;
app.use("/font", lactate.static(`${__dirname}/${folder}/img`, { "max age": "one week" }));
app.use(lactate.static(`${__dirname}/${folder}`, { "max age": "one week" }));

// Attempt to force redirect from non-www version of domain to www
// as this adversely affects the ability to login using GitHub.
app.use(forceDomain({
    hostname: 'www.stemcstudio.com',
    port: 443,
    protocol: 'https'
}));

// Something rotten about the following line.
// app.use multer()

// Convenience for allowing CORS on routes - GET only
app.all('*', (req: Request, res: Response, next: Function) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const authenticate = (code: any, cb: (err: any, data?: any) => any) => {

    // This is step two in the GitHub Web Application Flow and occurs
    // after GitHub redirects back to the site (assuming user accepts request).
    // The following step exchanges the temporary code for an access token.
    // POST https://github.com/login/oauth/access_token
    const data = qs.stringify({
        client_id: clientId,
        client_secret: nconf.get("GITHUB_APPLICATION_CLIENT_SECRET"),
        code: code
    });

    const options = {
        host: nconf.get("GITHUB_HOST"),     // github.com
        port: nconf.get("GITHUB_PORT"),     // 443
        path: nconf.get("GITHUB_PATH"),     // /login/oath/access_token
        method: nconf.get("GITHUB_METHOD"), // POST
        headers: { 'content-length': data.length }
    };

    let body = "";
    const req = https.request(options, (res: IncomingMessage) => {
        res.setEncoding('utf8');
        res.on('data', (chunk: string) => { body += chunk; });
        res.on('end', () => { cb(null, qs.parse(body).access_token); });
    });

    req.write(data);
    req.end();
    req.on('error', (e: { message: string }) => { cb(e.message); });
};

// Forward stemcstudio.herokuapp.com to www.stemcstudio.com
// Notice that we use HTTP status 301 Moved Permanently (best for SEO purposes).
/*
app.get('/*', (req: Request, res: Response, next: Function) => {
    if (req.headers['host'].match(/^stemcstudio.herokuapp.com/)) {
        res.redirect(`https://www.stemcstudio.com${req.url}`, 301);
    }
    else {
        next();
    }
});
*/

// Exchange the session code for an access token.
// Perhaps auhenticate is not such a good name because that has already happened.
app.get('/authenticate/:code', (req: Request, res: Response) => {
    authenticate(req.params.code, (err, token) => {
        if (err) {
            return res.json(err);
        }
        else {
            return res.json(token ? { "token": token } : { "error": "bad_code" });
        }
    });
});

// GitHub has been instructed to callback here after authentication.
app.get("/github_callback", (req: Request, res: Response, next: Function) => {
    // Set a cookie to communicate the GitHub Client ID back to the client.
    res.cookie(STEMCSTUDIO_GITHUB_APPLICATION_CLIENT_ID_COOKIE_NAME, clientId);
    // Render github_callback.pug template which runs a JavaScript script on the
    // client that scrapes the code and state parameters from the URL. The client
    // then request the home page again, causing it to request an exchange of
    // the temporary code for a token (above).
    res.render("github_callback", {
        npm: npm
    });
});

// Temporary disable rooms to prevent Redis from loading.
app.post('/rooms', createRoom);
app.get('/rooms/:id', getRoom);
app.delete('/rooms/:id', destroyRoom);

app.post('/search', search);
app.post('/submissions', submit);

app.get('/translations/:input', getTranslation);

app.get("/*", (req: Request, res: Response, next: Function) => {
    // Set a cookie to communicate the GitHub Client ID back to the client.
    res.cookie(STEMCSTUDIO_GITHUB_APPLICATION_CLIENT_ID_COOKIE_NAME, clientId);
    res.render("index", {
        css: `/css/app.css?version=${npm.version}`,
        js: `/js/app.js?version=${npm.version}`,
        jspmSystemJs: `jspm_packages/system.js?version=${npm.version}`,
        jspmConfigJs: `jspm.config.js?version=${npm.version}`,
        jspmCoreJs: `jspm_packages/npm/core-js@2.4.1/client/shim.min.js`,
        jspmZoneJs: `jspm_packages/npm/zone.js@0.8.8/dist/zone.js`,
        jspmReflectJs: `jspm_packages/npm/reflect-metadata@0.1.10/Reflect.js`,
        npm: npm,
        version: npm.version
    });
});

// error handling middleware should be loaded after loading the routes
app.use(errorHandler());
