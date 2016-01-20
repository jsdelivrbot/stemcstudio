coffee = require "coffee-script"
cookieParser = require "cookie-parser"
express = require "express"
favicon = require "serve-favicon"
jade = require "jade"
lactate = require "lactate"
logger = require "morgan"
methodOverride = require "method-override"
nconf = require "nconf"
https = require "https"
qs = require "querystring"
session = require "express-session"
bodyParser = require "body-parser"
multer = require "multer"
errorHandler = require "errorhandler"

# No marketing
npm = require "./package.json"

require "./configure"

isProductionMode = ->
  switch process.env.NODE_ENV or "local"
    when "local"
      false
    else
      true

app = module.exports = express()

app.set "views", "#{__dirname}/views"
app.set "view engine", "jade"
app.set "view options", layout: false
# TODO app.use(favicon(__dirname + '/public/favicon.ico'));
app.use logger('dev')
app.use methodOverride()
# TODO session

# Serve out of dist or generated, depending upon the environment.
folder = "#{if isProductionMode() then 'dist' else 'generated'}"
app.use "/font", lactate.static "#{__dirname}/#{folder}/img", "max age": "one week"
app.use lactate.static "#{__dirname}/#{folder}", "max age": "one week"

app.use cookieParser()
app.use bodyParser.json()
app.use bodyParser.urlencoded({extended: true})
# Something rotten about the following line.
#app.use multer()

# Convenience for allowing CORS on routes - GET only
app.all '*', (req, res, next) ->
  res.header 'Access-Control-Allow-Origin', '*'
  res.header 'Access-Control-Allow-Methods', 'GET, OPTIONS'
  res.header 'Access-Control-Allow-Headers', 'Content-Type'
  next()

authenticate = (code, cb) ->

  # This is step two in the GitHub Web Application Flow and occurs
  # after GitHub redirects back to the site (assuming user accepts request).
  # The following step exchanges the temporary code for an access token.
  # POST https://github.com/login/oauth/access_token
  data = qs.stringify
    client_id: nconf.get("GITHUB_APPLICATION_CLIENT_ID"),
    client_secret: nconf.get("GITHUB_APPLICATION_CLIENT_SECRET"),
    code: code

  options =
    host: nconf.get("GITHUB_HOST")     # github.com
    port: nconf.get("GITHUB_PORT")     # 443
    path: nconf.get("GITHUB_PATH")     # /login/oath/access_token
    method: nconf.get("GITHUB_METHOD") # POST
    headers: 'content-length': data.length

  body = ""
  req = https.request options, (res) ->
    res.setEncoding('utf8')
    res.on 'data', (chunk) -> body += chunk
    res.on 'end', -> cb(null, qs.parse(body).access_token)

  req.write(data)
  req.end()
  req.on 'error', (e) -> cb(e.message)

# Forward mathdoodle.herokuapp.com to www.mathdoodle.io
# Notice that we use HTTP status 301 Moved Permanently (best for SEO purposes).
app.get "/*", (req, res, next) ->
    if req.headers.host.match(/^mathdoodle.herokuapp.com/)
      res.redirect("http://www.mathdoodle.io#{req.url}", 301)
    else
      next()

# Exchange the session code for an access token.
app.get '/authenticate/:code', (req, res) ->
  authenticate req.params.code, (err, token) ->
    if (err)
      res.json(err)
    else
      res.json(if token then "token": token else "error": "bad_code");

app.get "/github_callback", (req, res, next) ->
  # Set a cookie to communicate the GitHub Client ID back to the client.
  res.cookie('mathdoodle-github-application-client-id', nconf.get("GITHUB_APPLICATION_CLIENT_ID"))
  res.render "github_callback",
    npm: npm

app.get "/*", (req, res, next) ->
  # Set a cookie to communicate the GitHub Client ID back to the client.
  res.cookie('mathdoodle-github-application-client-id', nconf.get("GITHUB_APPLICATION_CLIENT_ID"))
  res.render "index",
    css: "/css/app.css?version=#{npm.version}"
    js:  "/js/app.js?version=#{npm.version}"
    npm: npm

# error handling middleware should be loaded after loading the routes
app.use errorHandler()
