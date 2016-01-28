var nconf = require("nconf");
var http = require("http");
var debug = require('debug')('mathdoodle:server');
var app_1 = require("./app");
var socketIO = require('socket.io');
var port = normalizePort(nconf.get("PORT") || 8080);
app_1.default.set('port', port);
var server = http.createServer(app_1.default);
var io = socketIO(server);
io.on('connection', function (socket) {
    console.log('User connected');
    socket.on('test', function (msg) {
        console.log('message: ' + msg);
        io.emit('foo', msg);
    });
    socket.on('disconnect', function () {
        console.log('User disconnected');
    });
});
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
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
    debug('Listening on ' + bind);
}
//# sourceMappingURL=web.js.map