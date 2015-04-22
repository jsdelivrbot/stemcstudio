// This is the entry point for the Geometry Zen server.
require("coffee-script");

var nconf = require("nconf");
var http = require("http");
var app = require("./app");

var port = nconf.get("PORT");
app.listen(port, null, function(err) {
  console.log("listening on port " + port);
});
