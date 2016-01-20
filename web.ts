import * as nconf from "nconf";
import * as http from "http";
const debug = require('debug')('mathdoodle:server');
import app from "./app";
import * as socketIO from 'socket.io';

const port: number = normalizePort(nconf.get("PORT") || 8080);
app.set('port', port);

const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', function(socket: SocketIO.Socket) {
  console.log('User connected');
  socket.on('test', function(msg) {
    console.log('message: ' + msg);
    io.emit('foo', msg);
  });
  socket.on('disconnect', function() {
    console.log('User disconnected');
  });
});

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(value: string): any {
    const port = parseInt(value, 10);

    if (isNaN(port)) {
        // named pipe
        return value;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error): void {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
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

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening(): void {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}