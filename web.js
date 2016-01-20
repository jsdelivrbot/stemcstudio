require("coffee-script");

var nconf = require("nconf");
var http = require("http");
var app = require("./app");

var port = nconf.get("PORT");

var server = http.createServer(app);
server.listen(port, null, function(err) {
  console.log("Express server listening on port " + port);
});
