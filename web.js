var nconf = require("nconf");
var http = require("http");
var app_1 = require("./app");
var port = nconf.get("PORT");
var server = http.createServer(app_1["default"]);
server.listen(port, null, function (err) {
    console.log("Express server listening on port " + port);
});
//# sourceMappingURL=web.js.map