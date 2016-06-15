"use strict";
var nconf = require("nconf");
var http = require("http");
var app_1 = require("./app");
var port = normalizePort(nconf.get("PORT") || 8080);
app_1.default.set('port', port);
var server = http.createServer(app_1.default);
server.listen(port, onListening);
server.on('error', onError);
function normalizePort(value) {
    var port = parseInt(value, 10);
    if (isNaN(port)) {
        return value;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log("STEMCstudio HTTP server is listening on " + bind + ".");
}
process.on('uncaughtException', function (err) {
    console.log('Exception: ' + err.stack);
});
